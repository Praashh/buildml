import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env";
import { qstash } from "~/lib/qstash";
import { runRateLimit, submitRateLimit } from "~/lib/rate-limiter";
import { redis } from "~/lib/redis";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

// Shape of the FastAPI executor response
interface ExecutorResponse {
	passed: number;
	total: number;
	results: Array<{ name: string; passed: boolean; error?: string }>;
	stdout: string;
	stderr?: string;
	error?: string;
}

/**
 * Calls the FastAPI executor with user code and a task_id (= problem slug).
 * The executor looks up `/app/tests/{task_id}.py` inside the Docker container.
 */
async function _callExecutor(
	code: string,
	taskId: string,
	problemSetSlug: string,
): Promise<ExecutorResponse> {
	const response = await fetch(`${env.EXECUTOR_URL}/execute`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-secret": env.EXECUTOR_SECRET,
		},
		body: JSON.stringify({
			code,
			task_id: taskId,
			problem_set_slug: problemSetSlug,
		}),
	});

	if (!response.ok) {
		const errText = await response.text();
		throw new Error(`Executor error (${response.status}): ${errText}`);
	}

	return (await response.json()) as ExecutorResponse;
}

/**
 * Converts the executor's structured response into a status + output string
 * for storage / display.
 */
function _parseExecutorResult(result: ExecutorResponse): {
	status: string;
	output: string;
} {
	if (result.error) {
		return { status: "ERROR", output: result.error };
	}

	const passed = result.passed;
	const total = result.total;
	const status = passed === total && total > 0 ? "PASS" : "FAIL";

	const lines: string[] = [`${passed}/${total} tests passed`];

	for (const r of result.results) {
		const icon = r.passed ? "✓" : "✗";
		lines.push(`  ${icon} ${r.name}${r.error ? `: ${r.error}` : ""}`);
	}

	if (result.stderr) {
		lines.push("", "--- stderr ---", result.stderr);
	}

	return { status, output: lines.join("\n") };
}

export const submissionRouter = createTRPCRouter({
	/**
	 * RUN — synchronous execution against the FastAPI executor.
	 * Immediate feedback for testing solution.
	 */
	run: protectedProcedure
		.input(
			z.object({
				problemId: z.string(),
				code: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// Rate limit (per user)
			const { success } = await runRateLimit.limit(ctx.session.user.id);
			if (!success) {
				throw new TRPCError({
					code: "TOO_MANY_REQUESTS",
					message: "Rate limit exceeded. Please wait a moment.",
				});
			}

			const problem = await ctx.prisma.problem.findUnique({
				where: { id: input.problemId },
				include: { problemSet: true },
			});

			if (!problem || !problem.problemSet) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Problem or Problem Set not found",
				});
			}

			try {
				const execRes = await _callExecutor(
					input.code,
					problem.slug,
					problem.problemSet.slug,
				);
				return _parseExecutorResult(execRes);
			} catch (err: unknown) {
				console.error("[Submission.run] Execution error:", err);
				const message =
					err instanceof Error
						? err.message
						: "Failed to reach executor service.";
				return {
					status: "ERROR",
					output: `Execution Error: ${message}\n\nMake sure the executor service is running at ${env.EXECUTOR_URL}.`,
				};
			}
		}),

	/**
	 * SUBMIT — creates a DB record, then dispatches to QStash (or executes directly in dev).
	 */
	submit: protectedProcedure
		.input(
			z.object({
				problemId: z.string(),
				code: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// Rate limit (per user)
			const { success } = await submitRateLimit.limit(ctx.session.user.id);
			if (!success) {
				throw new TRPCError({
					code: "TOO_MANY_REQUESTS",
					message: "Rate limit exceeded. Please wait a moment.",
				});
			}

			// Create submission record
			const submission = await ctx.prisma.submission.create({
				data: {
					problemId: input.problemId,
					userId: ctx.session.user.id,
					code: input.code,
					status: "PENDING",
				},
				include: {
					problem: {
						include: {
							problemSet: true,
						},
					},
				},
			});

			const isLocal =
				!env.DEPLOYMENT_URL ||
				env.DEPLOYMENT_URL.includes("localhost") ||
				env.DEPLOYMENT_URL.includes("127.0.0.1");

			let qstashDispatched = false;

			if (!isLocal && env.QSTASH_TOKEN) {
				try {
					await qstash.publishJSON({
						url: `${env.DEPLOYMENT_URL}/api/webhooks/process-submission`,
						body: {
							type: "SUBMIT",
							submissionId: submission.id,
							userId: ctx.session.user.id,
						},
					});
					qstashDispatched = true;
				} catch (e) {
					console.warn(
						"[Submit] QStash dispatch failed, executing directly:",
						e,
					);
				}
			}

			if (!qstashDispatched) {
				try {
					if (!submission.problem.problemSet) {
						throw new TRPCError({
							code: "NOT_FOUND",
							message: "Problem set not found",
						});
					}

					const execRes = await _callExecutor(
						submission.code,
						submission.problem.slug,
						submission.problem.problemSet.slug,
					);
					const parsed = _parseExecutorResult(execRes);
					return await ctx.prisma.submission.update({
						where: { id: submission.id },
						data: { status: parsed.status, output: parsed.output },
					});
				} catch (err: unknown) {
					const message =
						err instanceof Error
							? err.message
							: "Failed to reach executor service.";
					const errMsg = `Execution Error: ${message}\n\nMake sure the executor service is running at ${env.EXECUTOR_URL}.`;
					return await ctx.prisma.submission.update({
						where: { id: submission.id },
						data: {
							status: "ERROR",
							output: errMsg,
						},
					});
				}
			}

			return submission;
		}),

	getStatus: protectedProcedure
		.input(
			z.object({
				submissionId: z.string().optional(),
				runId: z.string().optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
			if (input.submissionId) {
				const submission = await ctx.prisma.submission.findUnique({
					where: { id: input.submissionId },
					select: { status: true, output: true },
				});
				return submission;
			}

			if (input.runId) {
				const result = await redis.get(`run_result:${input.runId}`);
				if (result) {
					return result as { status: string; output: string };
				}
				return { status: "PENDING", output: null };
			}

			throw new TRPCError({
				code: "BAD_REQUEST",
				message: "Either submissionId or runId must be provided",
			});
		}),
});
