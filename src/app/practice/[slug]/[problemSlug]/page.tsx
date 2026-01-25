"use client";

import {
	BookOpen,
	ChevronLeft,
	ChevronRight,
	Loader2,
	Play,
	Send,
	Terminal as TerminalIcon,
} from "lucide-react";
import { use, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import CodeEditor from "~/app/_components/editor";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import "katex/dist/katex.min.css";
import Link from "next/link";
import { Navbar } from "~/app/_components/navbar";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "~/components/ui/resizable";

export default function PracticeProblemPage({
	params,
}: {
	params: Promise<{ slug: string; problemSlug: string }>;
}) {
	const { slug: setSlug, problemSlug } = use(params);
	const [code, setCode] = useState("");
	const [result, setResult] = useState<any>(null);

	const { data: problem, isLoading } = api.problem.getBySlug.useQuery({
		slug: problemSlug,
	});
	const { data: problemSet } = api.problemSet.getBySlug.useQuery({
		slug: setSlug,
	});

	const runMutation = api.submission.run.useMutation({
		onSuccess: (data) => {
			setResult(data);
		},
	});

	const submitMutation = api.submission.submit.useMutation({
		onSuccess: (data) => {
			setResult(data);
		},
	});

	// Polling query
	const { data: statusData } = api.submission.getStatus.useQuery(
		{
			runId: result?.runId,
			submissionId: result?.id,
		},
		{
			enabled: !!(result?.runId || (result?.id && result?.status === "PENDING")),
			refetchInterval: (query) => {
				const data = query.state.data;
				if (data && data.status !== "PENDING") {
					return false;
				}
				return 1000; // Poll every 1 second
			},
		},
	);

	// Update result when polling gets new data
	useEffect(() => {
		if (statusData && statusData.status !== "PENDING") {
			setResult((prev: any) => ({ ...prev, ...statusData }));
		}
	}, [statusData]);

	useEffect(() => {
		if (problem) {
			setCode(problem.templateCode);
		}
	}, [problem]);

	if (isLoading || !problem) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-black">
				<Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
			</div>
		);
	}

	const handleRun = () => {
		runMutation.mutate({ problemId: problem.id, code });
	};

	const handleSubmit = () => {
		submitMutation.mutate({ problemId: problem.id, code });
	};

	const isExecuting =
		runMutation.isPending ||
		submitMutation.isPending ||
		(result?.status === "PENDING" && !statusData) ||
		(statusData?.status === "PENDING");

	// Find current problem index and adjacent problems
	const currentIndex =
		problemSet?.problems.findIndex((p) => p.slug === problemSlug) ?? -1;
	const prevProblem =
		currentIndex > 0 ? problemSet?.problems[currentIndex - 1] : null;
	const nextProblem =
		currentIndex >= 0 && currentIndex < (problemSet?.problems.length ?? 0) - 1
			? problemSet?.problems[currentIndex + 1]
			: null;

	return (
		<div className="flex h-screen flex-col overflow-hidden bg-black">
			<Navbar />

			<div className="flex flex-1 flex-col overflow-hidden pt-16">
				{/* Compact Header Bar */}
				<div className="flex h-12 shrink-0 items-center justify-between border-white/10 border-b bg-zinc-950 px-4">
					<div className="flex items-center space-x-3 overflow-hidden">
						<div className="flex shrink-0 items-center space-x-1 font-medium text-xs text-zinc-500">
							<Link
								className="transition-colors hover:text-yellow-400"
								href="/practice"
							>
								Practice
							</Link>
							<ChevronRight className="h-3 w-3" />
							<Link
								className="transition-colors hover:text-yellow-400"
								href={`/practice/${setSlug}`}
							>
								{problemSet?.title || setSlug}
							</Link>
							<ChevronRight className="h-3 w-3" />
						</div>
						<h1 className="max-w-[200px] truncate font-semibold text-sm text-white tracking-tight sm:max-w-md">
							{problem.title}
						</h1>
						<Badge
							className="h-5 px-1.5 text-[10px] uppercase tracking-wider"
							variant={
								problem.difficulty === "Easy"
									? "success"
									: problem.difficulty === "Medium"
										? "warning"
										: "destructive"
							}
						>
							{problem.difficulty}
						</Badge>
					</div>

					{/* Problem Navigation */}
					<div className="flex items-center gap-2">
						{prevProblem && (
							<Link href={`/practice/${setSlug}/${prevProblem.slug}`}>
								<Button
									className="h-7 px-2 text-xs text-zinc-400 hover:text-white"
									size="sm"
									variant="ghost"
								>
									<ChevronLeft className="mr-1 h-3 w-3" />
									Prev
								</Button>
							</Link>
						)}
						{nextProblem && (
							<Link href={`/practice/${setSlug}/${nextProblem.slug}`}>
								<Button
									className="h-7 px-2 text-xs text-zinc-400 hover:text-white"
									size="sm"
									variant="ghost"
								>
									Next
									<ChevronRight className="ml-1 h-3 w-3" />
								</Button>
							</Link>
						)}
					</div>
				</div>

				<ResizablePanelGroup
					className="flex-1 overflow-hidden"
					orientation="horizontal"
				>
					{/* Left Panel: Description */}
					<ResizablePanel className="bg-zinc-950" defaultSize={40} minSize={25}>
						<div className="flex h-full flex-col">
							<div className="flex h-9 shrink-0 items-center border-white/5 border-b px-4">
								<span className="flex items-center font-bold text-[10px] text-zinc-500 uppercase tracking-widest">
									<BookOpen className="mr-2 h-3 w-3 text-yellow-500" />
									Problem Statement
								</span>
							</div>
							<div className="scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent flex-1 overflow-y-auto p-6">
								<div className="prose prose-sm prose-invert max-w-none prose-code:rounded prose-pre:border prose-pre:border-white/10 prose-code:bg-amber-400/10 prose-pre:bg-black/50 prose-code:px-1.5 prose-code:py-0.5 prose-headings:font-bold prose-a:text-yellow-400 prose-code:text-amber-400 prose-headings:text-white prose-p:text-zinc-400 prose-strong:text-white prose-p:leading-relaxed prose-headings:tracking-tight transition-colors prose-code:before:content-none prose-code:after:content-none hover:prose-a:text-yellow-300">
									<ReactMarkdown
										rehypePlugins={[rehypeKatex]}
										remarkPlugins={[remarkMath]}
									>
										{problem.description}
									</ReactMarkdown>
								</div>
							</div>
						</div>
					</ResizablePanel>

					<ResizableHandle
						className="w-1.5 cursor-col-resize border-white/5 border-x bg-black transition-colors hover:bg-zinc-800"
						withHandle
					/>

					{/* Right Panel: Editor & Terminal */}
					<ResizablePanel className="bg-zinc-950" defaultSize={60}>
						<ResizablePanelGroup orientation="vertical">
							<ResizablePanel
								className="relative overflow-hidden"
								defaultSize={70}
								minSize={20}
							>
								<div className="relative h-full bg-black">
									<CodeEditor
										onChange={(val) => setCode(val || "")}
										value={code}
									/>
								</div>
							</ResizablePanel>

							<ResizableHandle
								className="h-1.5 cursor-row-resize border-white/5 border-y bg-black transition-colors hover:bg-zinc-800"
								withHandle
							/>

							<ResizablePanel
								className="bg-black"
								defaultSize={30}
								minSize={10}
							>
								<div className="flex h-full flex-col font-mono">
									<div className="flex h-9 shrink-0 items-center justify-between border-white/5 border-b bg-zinc-950 px-4">
										<div className="flex items-center space-x-4">
											<div className="flex items-center space-x-2">
												<TerminalIcon className="h-3 w-3 text-zinc-500" />
												<span className="font-bold text-[10px] text-zinc-500 uppercase tracking-widest">
													Console
												</span>
											</div>

											<div className="flex items-center space-x-1 border-white/10 border-l pl-4">
												<Button
													className="h-6 px-2 font-bold text-[10px] text-zinc-400 hover:bg-white/5 hover:text-white"
													disabled={isExecuting}
													onClick={handleRun}
													size="sm"
													variant="ghost"
												>
													{runMutation.isPending ? (
														<Loader2 className="mr-1.5 h-2.5 w-2.5 animate-spin" />
													) : (
														<Play className="mr-1.5 h-2.5 w-2.5 fill-current text-yellow-500" />
													)}
													RUN
												</Button>
												<Button
													className="h-6 rounded bg-yellow-500/10 px-2 font-bold text-[10px] text-yellow-500 transition-all hover:bg-yellow-500 hover:text-black active:scale-95"
													disabled={isExecuting}
													onClick={handleSubmit}
													size="sm"
												>
													{submitMutation.isPending ? (
														<Loader2 className="mr-1.5 h-2.5 w-2.5 animate-spin" />
													) : (
														<Send className="mr-1.5 h-2.5 w-2.5" />
													)}
													SUBMIT
												</Button>
											</div>
										</div>

										{result && (
											<div className="flex items-center">
												{result.status === "PASS" ? (
													<span className="flex items-center font-bold text-[10px] text-yellow-500">
														<div className="mr-2 h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-500" />
														ALL TESTS PASSED
													</span>
												) : (
													<span className="flex items-center font-bold text-[10px] text-red-500">
														<div className="mr-2 h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
														EXECUTION {result.status}
													</span>
												)}
											</div>
										)}
									</div>

									<div className="scrollbar-thin scrollbar-thumb-zinc-800 flex-1 select-text overflow-y-auto p-4 text-[13px] leading-relaxed">
										{isExecuting && (
											<div className="flex animate-pulse items-center text-zinc-500 italic">
												<span className="mr-2 text-yellow-500">➜</span>
												Executing test suite...
											</div>
										)}

										{result ? (
											<div className="space-y-4">
												<div className="group">
													<div className="mb-2 flex justify-between border-zinc-800/50 border-b pb-1 text-zinc-600">
														<span>Output Logs</span>
														<span className="text-[10px] opacity-0 transition-opacity group-hover:opacity-100">
															PID: {Math.floor(Math.random() * 9000) + 1000}
														</span>
													</div>
													<div className="rounded-lg border border-white/5 bg-zinc-900/40 p-3 font-light text-zinc-300">
														<pre className="whitespace-pre-wrap break-all font-mono leading-relaxed">
															{result.output || "(no output returned)"}
														</pre>
													</div>
												</div>
											</div>
										) : (
											!isExecuting && (
												<div className="flex items-center text-zinc-700 italic">
													<span className="mr-2 text-zinc-800 tracking-tighter opacity-30">
														{"||||"}
													</span>
													Ready for execution. Click 'Run' to test your logic.
												</div>
											)
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
