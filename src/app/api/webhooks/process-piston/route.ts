import { NextRequest, NextResponse } from "next/server";
import { receiver } from "~/lib/qstash";
import { prisma } from "~/db/client";
import { redis } from "~/lib/redis";

export async function POST(req: NextRequest) {
    const signature = req.headers.get("upstash-signature");
    if (!signature) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const bodyText = await req.text();
    const isValid = await receiver.verify({
        body: bodyText,
        signature,
    });

    if (!isValid) {
        return new NextResponse("Invalid signature", { status: 401 });
    }

    const taskData = JSON.parse(bodyText);
    const { type, submissionId, runId, problemId, code } = taskData;

    console.log(`[QStash Webhook] Processing ${type}: ${submissionId || runId}`);

    try {
        let finalCode = code;
        let testCode = "";

        if (type === "SUBMIT") {
            const submission = await prisma.submission.findUnique({
                where: { id: submissionId },
                include: { problem: true },
            });
            if (!submission) {
                return NextResponse.json({ error: "Submission not found" });
            }
            finalCode = submission.code;
            testCode = submission.problem.testCode;
        } else {
            const problem = await prisma.problem.findUnique({
                where: { id: problemId },
            });
            if (!problem) {
                return NextResponse.json({ error: "Problem not found" });
            }
            testCode = problem.testCode;
        }

        const response = await fetch("https://emkc.org/api/v2/piston/execute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                language: "python",
                version: "3.10.0",
                files: [
                    { name: "tests.py", content: testCode },
                    { name: "solution.py", content: finalCode },
                ],
            }),
        });

        const result = (await response.json()) as any;
        let status = "FAIL";

        if (result.run) {
            if (result.run.code === 0 && result.run.stdout.includes("SUCCESS")) {
                status = "PASS";
            } else if (result.run.code !== 0 || result.run.stderr) {
                status = "ERROR";
            }
        } else {
            status = "ERROR";
        }

        const output = result.run?.output || result.message || "Unknown error";

        if (type === "SUBMIT") {
            await prisma.submission.update({
                where: { id: submissionId },
                data: { status, output },
            });
        } else {
            await redis.set(`run_result:${runId}`, JSON.stringify({ status, output }), {
                ex: 300, // 5 minutes TTL
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(`[QStash Webhook] Error:`, error);
        if (type === "SUBMIT") {
            await prisma.submission.update({
                where: { id: submissionId },
                data: { status: "ERROR", output: error instanceof Error ? error.message : "Inner Webhook Error" },
            });
        } else {
            await redis.set(`run_result:${runId}`, JSON.stringify({ status: "ERROR", output: "Inner Webhook Error" }), {
                ex: 300,
            });
        }
        return NextResponse.json({ error: "Failed to process" }, { status: 500 });
    }
}
