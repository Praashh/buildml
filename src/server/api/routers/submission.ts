import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env";
import { runRateLimit, submitRateLimit } from "~/lib/rate-limiter";
import { redis } from "~/lib/redis";
import { qstash } from "~/lib/qstash";
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
async function callExecutor(
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
function parseExecutorResult(result: ExecutorResponse): {
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
	 * No QStash, no webhook. Immediate feedback.
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

			const runId = crypto.randomUUID();

			// Dispatch to QStash for async processing
			await qstash.publishJSON({
				url: `${env.DEPLOYMENT_URL}/api/webhooks/process-submission`,
				body: {
					type: "RUN",
					runId,
					problemId: input.problemId,
					code: input.code,
					userId: ctx.session.user.id,
				},
			});

			return { runId };
		}),

	/**
	 * SUBMIT — creates a DB record, then dispatches to QStash for async processing.
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
			});

			// Publish to QStash for async processing
			await qstash.publishJSON({
				url: `${env.DEPLOYMENT_URL}/api/webhooks/process-submission`,
				body: {
					type: "SUBMIT",
					submissionId: submission.id,
					userId: ctx.session.user.id,
				},
			});

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
