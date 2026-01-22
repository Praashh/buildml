import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { feedbackRouter } from "./routers/feedback";
import { problemRouter } from "./routers/problem";
import { submissionRouter } from "./routers/submission";
import { userRouter } from "./routers/user";

export const appRouter = createTRPCRouter({
    feedback: feedbackRouter,
    problem: problemRouter,
    submission: submissionRouter,
    user: userRouter
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
