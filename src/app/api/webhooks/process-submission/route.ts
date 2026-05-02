import { NextRequest, NextResponse } from "next/server";
import { receiver } from "~/lib/qstash";
import { prisma } from "~/db/client";
import { redis } from "~/lib/redis";
import { env } from "~/env";

interface ExecutorResponse {
	passed: number;
	total: number;
	results: Array<{ name: string; passed: boolean; error?: string }>;
	stdout: string;
	stderr?: string;
	error?: string;
}

export async function POST(req: NextRequest) {
	const signature = req.headers.get("upstash-signature");
	if (!signature) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	const bodyText = await req.text();
	const isValid = await receiver.verify({
		body: bodyText,
		signature,
	});

	if (!isValid) {
		return new NextResponse("Invalid signature", { status: 401 });
	}

	const taskData = JSON.parse(bodyText);
	const { type, submissionId, runId, problemId, code } = taskData;

	console.log(`[QStash Webhook] Processing ${type}: ${submissionId || runId}`);

	try {
		let problemSlug: string;
		let problemSetSlug: string;
		let userCode: string;

		if (type === "SUBMIT") {
			const submission = await prisma.submission.findUnique({
				where: { id: submissionId },
				include: {
					problem: {
						include: {
							problemSet: true,
						},
					},
				},
			});

			if (!submission || !submission.problem.problemSet) {
				throw new Error("Submission or Problem Set not found");
			}

			problemSlug = submission.problem.slug;
			problemSetSlug = submission.problem.problemSet.slug;
			userCode = submission.code;
		} else if (type === "RUN") {
			const problem = await prisma.problem.findUnique({
				where: { id: problemId },
				include: { problemSet: true },
			});

			if (!problem || !problem.problemSet) {
				throw new Error("Problem or Problem Set not found");
			}

			problemSlug = problem.slug;
			problemSetSlug = problem.problemSet.slug;
			userCode = code;
		} else {
			return NextResponse.json({ error: "Unknown task type" }, { status: 400 });
		}

		// Call the FastAPI executor
		const response = await fetch(`${env.EXECUTOR_URL}/execute`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-secret": env.EXECUTOR_SECRET,
			},
			body: JSON.stringify({
				code: userCode,
				task_id: problemSlug,
				problem_set_slug: problemSetSlug,
			}),
		});

		if (!response.ok) {
			const errText = await response.text();
			throw new Error(`Executor error (${response.status}): ${errText}`);
		}

		const result = (await response.json()) as ExecutorResponse;

		// Determine status and build output string
		let status = "FAIL";
		if (result.error) {
			status = "ERROR";
		} else if (result.passed === result.total && result.total > 0) {
			status = "PASS";
		}

		const lines: string[] = [`${result.passed}/${result.total} tests passed`];
		for (const r of result.results) {
			const icon = r.passed ? "✓" : "✗";
			lines.push(`  ${icon} ${r.name}${r.error ? `: ${r.error}` : ""}`);
		}
		if (result.error) {
			lines.push("", result.error);
		}
		if (result.stderr) {
			lines.push("", "--- stderr ---", result.stderr);
		}

		const output = lines.join("\n");

		// Store results based on type
		if (type === "SUBMIT") {
			await prisma.submission.update({
				where: { id: submissionId },
				data: { status, output },
			});
		} else {
			// RUN: store in Redis for 10 minutes
			await redis.set(`run_result:${runId}`, {
				status,
				output,
				passed: result.passed,
				total: result.total,
				results: result.results,
			}, { ex: 600 });
		}

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error(`[QStash Webhook] Error:`, error);
		
		const errorMessage = error instanceof Error ? error.message : "Processing error";

		if (type === "SUBMIT") {
			await prisma.submission.update({
				where: { id: submissionId },
				data: { status: "ERROR", output: errorMessage },
			});
		} else if (type === "RUN") {
			await redis.set(`run_result:${runId}`, {
				status: "ERROR",
				output: errorMessage,
				passed: 0,
				total: 0,
				results: [],
			}, { ex: 600 });
		}

		return NextResponse.json({ error: "Failed to process" }, { status: 500 });
	}
}
