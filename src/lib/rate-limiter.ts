import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const runRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "10 s"),
    analytics: true,
    prefix: "ratelimit:run",
});

export const submitRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(2, "30 s"),
    analytics: true,
    prefix: "ratelimit:submit",
});
