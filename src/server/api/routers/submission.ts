import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const submissionRouter = createTRPCRouter({
	run: protectedProcedure
		.input(
			z.object({
				problemId: z.string(),
				code: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const problem = await ctx.prisma.problem.findUnique({
				where: { id: input.problemId },
			});

			if (!problem) {
				throw new Error("Problem not found");
			}

			try {
				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 10000);
				console.log("[INPUT CODE]", input.code);
				console.log("[PROBLEM CODE]", problem.testCode);
				const response = await fetch("https://emkc.org/api/v2/piston/execute", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						language: "py",
						version: "3.10.0",
						files: [
							{ name: "user_code.py", content: input.code },
							{ name: "test_code.py", content: problem.testCode },
						],
						run: {
							args: ["-m", "unittest", "-v", "test_code.py"],
						},
						compile_timeout: 10000,
						run_timeout: 3000,
						compile_cpu_time: 10000,
						run_cpu_time: 3000,
						compile_memory_limit: -1,
						run_memory_limit: -1,
					}),
					signal: controller.signal,
				});
				clearTimeout(timeoutId);

				const result = (await response.json()) as any;

				console.log("result", result);

				let status = "FAIL";
				if (result.run.code === 0) {
					status = "PASS";
				} else if (result.run.code !== 0 || result.run.stderr) {
					status = "ERROR";
				}

				return {
					status,
					output: result.run.output,
				};
			} catch (error) {
				return {
					status: "ERROR",
					output: error instanceof Error ? error.message : "Unknown error",
				};
			}
		}),

	submit: protectedProcedure
		.input(
			z.object({
				problemId: z.string(),
				code: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const problem = await ctx.prisma.problem.findUnique({
				where: { id: input.problemId },
			});

			if (!problem) {
				throw new Error("Problem not found");
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

			try {
				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 10000);

				const response = await fetch("https://emkc.org/api/v2/piston/execute", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						language: "python",
						version: "3.10.0",
						files: [
							{ name: "tests.py", content: problem.testCode },
							{ name: "solution.py", content: input.code },
						],
					}),
					signal: controller.signal,
				});
				clearTimeout(timeoutId);

				const result = (await response.json()) as any;

				let status = "FAIL";
				if (result.run.code === 0 && result.run.stdout.includes("SUCCESS")) {
					status = "PASS";
				} else if (result.run.code !== 0 || result.run.stderr) {
					status = "ERROR";
				}

				return await ctx.prisma.submission.update({
					where: { id: submission.id },
					data: {
						status,
						output: result.run.output,
					},
				});
			} catch (error) {
				return await ctx.prisma.submission.update({
					where: { id: submission.id },
					data: {
						status: "ERROR",
						output: error instanceof Error ? error.message : "Unknown error",
					},
				});
			}
		}),
});
