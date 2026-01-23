import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const problemRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		return ctx.prisma.problem.findMany({
			orderBy: { createdAt: "desc" },
			include: {
				problemSet: true,
			},
		});
	}),

	getBySlug: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(async ({ ctx, input }) => {
			return ctx.prisma.problem.findUnique({
				where: { slug: input.slug },
				include: {
					problemSet: true,
				},
			});
		}),
});
