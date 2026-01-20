import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { problemRouter } from "./routers/problem";
import { submissionRouter } from "./routers/submission";

export const appRouter = createTRPCRouter({
    problem: problemRouter,
    submission: submissionRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
