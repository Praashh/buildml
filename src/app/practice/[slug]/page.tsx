"use client";

import { use, useState, useEffect } from "react";
import { api } from "~/trpc/react";
import CodeEditor from "~/app/_components/editor";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Play, Send, CheckCircle, XCircle, Loader2, ChevronRight, Terminal as TerminalIcon, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; // Import KaTeX styles

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "~/components/ui/resizable";
import { Navbar } from "~/app/_components/navbar";

export default function ProblemSolvingPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [code, setCode] = useState("");
    const [result, setResult] = useState<any>(null);

    const { data: problem, isLoading } = api.problem.getBySlug.useQuery({ slug });

    const runMutation = api.submission.run.useMutation({
        onSuccess: (data) => setResult(data),
    });

    const submitMutation = api.submission.submit.useMutation({
        onSuccess: (data) => setResult(data),
    });

    useEffect(() => {
        if (problem) {
            setCode(problem.templateCode);
        }
    }, [problem]);

    if (isLoading || !problem) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <Loader2 className="w-8 h-8 animate-spin text-green-500" />
            </div>
        );
    }

    const handleRun = () => {
        runMutation.mutate({ problemId: problem.id, code });
    };

    const handleSubmit = () => {
        submitMutation.mutate({ problemId: problem.id, code });
    };

    const isExecuting = runMutation.isPending || submitMutation.isPending;

    return (
        <div className="flex flex-col h-screen bg-black overflow-hidden">
            <Navbar />

            <div className="flex-1 flex flex-col pt-16 overflow-hidden">
                {/* Compact Header Bar */}
                <div className="h-12 border-b border-white/10 bg-zinc-950 flex items-center justify-between px-4 shrink-0">
                    <div className="flex items-center space-x-3 overflow-hidden">
                        <div className="flex items-center space-x-1 text-zinc-500 text-xs font-medium shrink-0">
                            <span>Practice</span>
                            <ChevronRight className="w-3 h-3" />
                        </div>
                        <h1 className="text-sm font-semibold tracking-tight text-white truncate max-w-[200px] sm:max-w-md">
                            {problem.title}
                        </h1>
                        <Badge variant={
                            problem.difficulty === "Easy" ? "success" :
                                problem.difficulty === "Medium" ? "warning" : "destructive"
                        } className="h-5 px-1.5 text-[10px] uppercase tracking-wider">
                            {problem.difficulty}
                        </Badge>
                    </div>
                </div>

                <ResizablePanelGroup orientation="horizontal" className="flex-1 overflow-hidden">
                    {/* Left Panel: Description */}
                    <ResizablePanel defaultSize={40} minSize={25} className="bg-zinc-950">
                        <div className="h-full flex flex-col">
                            <div className="h-9 border-b border-white/5 flex items-center px-4 shrink-0">
                                <span className="flex items-center text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                    <BookOpen className="w-3 h-3 mr-2 text-green-500" />
                                    Problem Statement
                                </span>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                                <div className="prose prose-sm prose-invert max-w-none 
                                    prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight
                                    prose-p:text-zinc-400 prose-p:leading-relaxed
                                    prose-strong:text-white
                                    prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10
                                    prose-code:text-emerald-400 prose-code:bg-emerald-400/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                                    prose-a:text-green-400 hover:prose-a:text-green-300 transition-colors">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
                                    >
                                        {problem.description}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    </ResizablePanel>

                    <ResizableHandle withHandle className="bg-black border-x border-white/5 hover:bg-zinc-800 transition-colors w-1.5 cursor-col-resize" />

                    {/* Right Panel: Editor & Terminal */}
                    <ResizablePanel defaultSize={60} className="bg-zinc-950">
                        <ResizablePanelGroup orientation="vertical">
                            <ResizablePanel defaultSize={70} minSize={20} className="relative overflow-hidden">
                                <div className="h-full relative bg-black">
                                    <CodeEditor
                                        value={code}
                                        onChange={(val) => setCode(val || "")}
                                    />
                                </div>
                            </ResizablePanel>

                            <ResizableHandle withHandle className="bg-black border-y border-white/5 hover:bg-zinc-800 transition-colors h-1.5 cursor-row-resize" />

                            <ResizablePanel defaultSize={30} minSize={10} className="bg-black">
                                <div className="h-full flex flex-col font-mono">
                                    <div className="h-9 border-b border-white/5 flex items-center justify-between px-4 bg-zinc-950 shrink-0">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <TerminalIcon className="w-3 h-3 text-zinc-500" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Console</span>
                                            </div>

                                            <div className="flex items-center space-x-1 border-l border-white/10 pl-4">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleRun}
                                                    disabled={isExecuting}
                                                    className="h-6 px-2 text-[10px] font-bold text-zinc-400 hover:text-white hover:bg-white/5"
                                                >
                                                    {runMutation.isPending ? <Loader2 className="w-2.5 h-2.5 mr-1.5 animate-spin" /> : <Play className="h-2.5 w-2.5 mr-1.5 fill-current text-yellow-500" />}
                                                    RUN
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={handleSubmit}
                                                    disabled={isExecuting}
                                                    className="h-6 px-2 text-[10px] font-bold bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-black rounded transition-all active:scale-95"
                                                >
                                                    {submitMutation.isPending ? <Loader2 className="w-2.5 h-2.5 mr-1.5 animate-spin" /> : <Send className="h-2.5 w-2.5 mr-1.5" />}
                                                    SUBMIT
                                                </Button>
                                            </div>
                                        </div>

                                        {result && (
                                            <div className="flex items-center">
                                                {result.status === "PASS" ? (
                                                    <span className="text-[10px] font-bold text-green-500 flex items-center">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse" />
                                                        ALL TESTS PASSED
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-red-500 flex items-center">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mr-2 animate-pulse" />
                                                        EXECUTION {result.status}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-4 text-[13px] leading-relaxed select-text scrollbar-thin scrollbar-thumb-zinc-800">
                                        {isExecuting && (
                                            <div className="flex items-center text-zinc-500 animate-pulse italic">
                                                <span className="text-green-500 mr-2">➜</span>
                                                Executing test suite...
                                            </div>
                                        )}

                                        {result ? (
                                            <div className="space-y-4">
                                                <div className="group">
                                                    <div className="text-zinc-600 mb-2 border-b border-zinc-800/50 pb-1 flex justify-between">
                                                        <span>Output Logs</span>
                                                        <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">PID: {Math.floor(Math.random() * 9000) + 1000}</span>
                                                    </div>
                                                    <div className="bg-zinc-900/40 p-3 rounded-lg border border-white/5 text-zinc-300 font-light">
                                                        <pre className="whitespace-pre-wrap font-mono break-all leading-relaxed">{result.output || "(no output returned)"}</pre>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : !isExecuting && (
                                            <div className="text-zinc-700 italic flex items-center">
                                                <span className="text-zinc-800 mr-2 opacity-30 tracking-tighter">{"||||"}</span>
                                                Ready for execution. Click 'Run' to test your logic.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    );
}
