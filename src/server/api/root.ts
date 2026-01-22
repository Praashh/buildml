import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { feedbackRouter } from "./routers/feedback";
import { problemRouter } from "./routers/problem";
import { submissionRouter } from "./routers/submission";

export const appRouter = createTRPCRouter({
    feedback: feedbackRouter,
    problem: problemRouter,
    submission: submissionRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
