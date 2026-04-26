import { z } from "zod";
import { runRateLimit, submitRateLimit } from "~/lib/rate-limiter";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { redis } from "~/lib/redis";
import { qstash } from "~/lib/qstash";
import { env } from "~/env";

export const submissionRouter = createTRPCRouter({
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
				throw new Error("Rate limit exceeded. Please wait a moment.");
			}

			const runId = crypto.randomUUID();

			// Publish to QStash
			await qstash.publishJSON({
				url: `${env.DEPLOYMENT_URL}/api/webhooks/process-submission`,
				body: {
					type: "RUN",
					runId,
					userId: ctx.session.user.id,
					problemId: input.problemId,
					code: input.code,
				},
			});

			return {
				runId,
				status: "PENDING",
			};
		}),

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
				throw new Error("Rate limit exceeded. Please wait a moment.");
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

			// Publish to QStash
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

			throw new Error("Either submissionId or runId must be provided");
		}),
});
