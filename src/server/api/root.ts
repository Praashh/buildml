import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { feedbackRouter } from "./routers/feedback";
import { problemRouter } from "./routers/problem";
import { problemSetRouter } from "./routers/problemSet";
import { submissionRouter } from "./routers/submission";
import { userRouter } from "./routers/user";

export const appRouter = createTRPCRouter({
	feedback: feedbackRouter,
	problem: problemRouter,
	problemSet: problemSetRouter,
	submission: submissionRouter,
	user: userRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
