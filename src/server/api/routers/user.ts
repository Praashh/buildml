import { z } from "zod";
import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
	getAllUsers: publicProcedure.query(async ({ ctx }) => {
		return ctx.prisma.user.count();
	}),

	getLeaderboard: publicProcedure.query(async ({ ctx }) => {
		const _users = await ctx.prisma.user.findMany({
			include: {
				_count: {
					select: {
						submissions: {
							where: { status: "PASS" },
						},
					},
				},
			},
		});

		// Prisma's _count doesn't support distinct by default in this context easily
		// Let's use a more accurate approach if we want unique problems.
		// For simplicity, let's assume one pass per problem is the common case,
		// but for a real LEADERBOARD we should be more precise.

		// Let's use raw query for performance and accuracy if possible,
		// or just fetch and process.
		// Given the instructions, I'll go with a robust Prisma approach.

		const leaderboardData = await ctx.prisma.user.findMany({
			select: {
				id: true,
				name: true,
				image: true,
				submissions: {
					where: { status: "PASS" },
					select: { problemId: true },
					distinct: ["problemId"],
				},
			},
		});

		const rankedUsers = leaderboardData
			.map((user) => ({
				id: user.id,
				name: user.name ?? "Anonymous",
				image: user.image,
				solvedCount: user.submissions.length,
			}))
			.sort((a, b) => b.solvedCount - a.solvedCount);

		return rankedUsers;
	}),

	getUserRank: protectedProcedure.query(async ({ ctx }) => {
		const leaderboardData = await ctx.prisma.user.findMany({
			select: {
				id: true,
				submissions: {
					where: { status: "PASS" },
					select: { problemId: true },
					distinct: ["problemId"],
				},
			},
		});

		const rankedUsers = leaderboardData
			.map((user) => ({
				id: user.id,
				solvedCount: user.submissions.length,
			}))
			.sort((a, b) => b.solvedCount - a.solvedCount);

		const currentUserId = ctx.session.user.id;
		const rank = rankedUsers.findIndex((u) => u.id === currentUserId) + 1;

		return rank > 0 ? rank : null;
	}),

	getProfile: publicProcedure
		.input(z.object({ userId: z.string().optional() }))
		.query(async ({ ctx, input }) => {
			const userId = input.userId ?? ctx.session?.user?.id;

			if (!userId) {
				return null;
			}

			const user = await ctx.prisma.user.findUnique({
				where: { id: userId },
				select: {
					id: true,
					name: true,
					image: true,
					submissions: {
						where: { status: "PASS" },
						include: {
							problem: {
								select: {
									difficulty: true,
								},
							},
						},
					},
				},
			});

			if (!user) {
				return null;
			}

			// Group by difficulty
			const difficultyCounts = {
				Easy: 0,
				Medium: 0,
				Hard: 0,
			};

			const solvedProblemIds = new Set<string>();

			for (const submission of user.submissions) {
				if (!solvedProblemIds.has(submission.problemId)) {
					solvedProblemIds.add(submission.problemId);
					const difficulty = submission.problem
						.difficulty as keyof typeof difficultyCounts;
					difficultyCounts[difficulty]++;
				}
			}

			// Format submission history: map of "YYYY-MM-DD" -> count
			const history: Record<string, number> = {};
			for (const sub of user.submissions) {
				const dateString = sub.createdAt.toISOString().split("T")[0];
				if (dateString) {
					history[dateString] = (history[dateString] ?? 0) + 1;
				}
			}

			// Get total problems count by difficulty
			const totalByDifficulty = await ctx.prisma.problem.groupBy({
				by: ["difficulty"],
				_count: {
					id: true,
				},
			});

			const totalCounts = {
				Easy: 0,
				Medium: 0,
				Hard: 0,
			};

			for (const item of totalByDifficulty) {
				const difficulty = item.difficulty as keyof typeof totalCounts;
				totalCounts[difficulty] = item._count.id;
			}

			return {
				user: {
					id: user.id,
					name: user.name,
					image: user.image,
				},
				difficultyCounts,
				totalCounts,
				solvedCount: solvedProblemIds.size,
				history,
			};
		}),
});
