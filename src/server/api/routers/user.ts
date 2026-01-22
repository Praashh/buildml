import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    getAllUsers: publicProcedure.query(async ({ ctx }) => {
        return ctx.prisma.user.count();
    }),
});
