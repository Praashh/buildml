import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const problemSetRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		return ctx.prisma.problemSet.findMany({
			orderBy: { createdAt: "desc" },
			include: {
				_count: {
					select: { problems: true },
				},
			},
		});
	}),

	getBySlug: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(async ({ ctx, input }) => {
			return ctx.prisma.problemSet.findUnique({
				where: { slug: input.slug },
				include: {
					problems: {
						orderBy: { order: "asc" },
					},
				},
			});
		}),
});
