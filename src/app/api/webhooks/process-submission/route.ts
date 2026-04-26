import { NextRequest, NextResponse } from "next/server";
import { receiver } from "~/lib/qstash";
import { prisma } from "~/db/client";
import { redis } from "~/lib/redis";
import { env } from "~/env";

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

        const judge0Url = `${env.JUDGE0_URL}/submissions/?wait=true`;
        
        // Prepare source code for Judge0 (Python specific injection)
        const sourceCode = `
import sys
import types

# Inject user solution so it can be imported as 'solution'
solution_code = ${JSON.stringify(finalCode)}
solution_module = types.ModuleType('solution')
exec(solution_code, solution_module.__dict__)
sys.modules['solution'] = solution_module

# Execute tests
${testCode}
`;

        const response = await fetch(judge0Url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                language_id: 71, // Python 3
                source_code: sourceCode,
            }),
        });

        const result = (await response.json()) as any;
        let status = "FAIL";

        const stdout = result.stdout || "";
        const stderr = result.stderr || "";
        const compileOutput = result.compile_output || "";
        const statusDescription = result.status?.description || "Unknown Error";

        if (result.status?.id === 3) {
            status = stdout.includes("SUCCESS") ? "PASS" : "FAIL";
        } else if (result.status?.id === 4) {
            status = "FAIL";
        } else {
            status = "ERROR";
        }

        let output = "";
        if (status === "PASS") {
            output = stdout;
        } else if (result.status?.id === 6) {
            output = compileOutput || "Compilation Error";
        } else if (status === "FAIL") {
            output = stderr ? `${stdout}\n${stderr}` : stdout;
        } else {
            output = `[${statusDescription}]\n${stderr || stdout || result.message || ""}`;
        }

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
