import {
	Activity,
	BrainCircuit,
	ChevronLeft,
	ChevronRight,
	Code,
	Layers,
	Sparkles,
	Zap,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { createMetadata, generateCourseSchema } from "~/lib/seo";
import { api } from "~/trpc/server";
import { Footer } from "../../_components/footer";
import { Navbar } from "../../_components/navbar";

type PageProps = {
	params: Promise<{ slug: string }>;
};

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params;
	const problemSet = await api.problemSet.getBySlug({ slug });

	if (!problemSet) {
		return createMetadata({
			title: "Problem Set Not Found",
			noIndex: true,
		});
	}

	return createMetadata({
		title: problemSet.title,
		description:
			problemSet.description ||
			`Master ${problemSet.title} with ${problemSet.problems.length} hands-on coding challenges. Implement AI/ML concepts from scratch.`,
		pathname: `/practice/${slug}`,
	});
}

export default async function ProblemSetPage({ params }: PageProps) {
	const { slug } = await params;
	const problemSet = await api.problemSet.getBySlug({ slug });

	if (!problemSet) {
		notFound();
	}

	// Count problems by difficulty
	const difficultyCounts = problemSet.problems.reduce(
		(acc, p) => {
			acc[p.difficulty] = (acc[p.difficulty] || 0) + 1;
			return acc;
		},
		{} as Record<string, number>,
	);

	return (
		<div className="relative flex min-h-screen flex-col bg-black">
			{/* Background Effects */}
			<div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
				<div className="absolute top-1/4 left-1/4 h-96 w-96 animate-pulse rounded-full bg-yellow-500/5 blur-3xl" />
				<div
					className="absolute right-1/4 bottom-1/3 h-80 w-80 animate-pulse rounded-full bg-amber-500/5 blur-3xl"
					style={{ animationDelay: "1s" }}
				/>
			</div>

			<Navbar />

			<main className="relative z-10 flex-1 pt-32 pb-20">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8">
					{/* Breadcrumb & Header */}
					<div className="mb-12">
						<Link
							className="group mb-8 inline-flex items-center text-zinc-500 transition-colors hover:text-yellow-400"
							href="/practice"
						>
							<ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
							Back to Problem Sets
						</Link>

						<div className="mb-6 flex items-start gap-4">
							<div className="rounded-xl border border-yellow-500/20 bg-linear-to-br from-yellow-500/20 to-amber-500/10 p-3">
								<Layers className="h-6 w-6 text-yellow-400" />
							</div>
							<div>
								<h1 className="mb-3 font-bold text-4xl text-white tracking-tight">
									{problemSet.title}
								</h1>
								{problemSet.description && (
									<p className="max-w-3xl text-lg text-zinc-400 leading-relaxed">
										{problemSet.description}
									</p>
								)}
							</div>
						</div>

						{/* Stats Bar */}
						<div className="mt-8 flex flex-wrap items-center gap-4 rounded-xl border border-white/5 bg-zinc-900/50 p-4">
							<Badge
								className="border-zinc-700 px-3 py-1 text-zinc-400"
								variant="outline"
							>
								<Code className="mr-2 h-3 w-3" />
								{problemSet.problems.length}{" "}
								{problemSet.problems.length === 1 ? "Problem" : "Problems"}
							</Badge>
							{difficultyCounts.Easy && (
								<Badge className="px-3 py-1" variant="success">
									{difficultyCounts.Easy} Easy
								</Badge>
							)}
							{difficultyCounts.Medium && (
								<Badge className="px-3 py-1" variant="warning">
									{difficultyCounts.Medium} Medium
								</Badge>
							)}
							{difficultyCounts.Hard && (
								<Badge className="px-3 py-1" variant="destructive">
									{difficultyCounts.Hard} Hard
								</Badge>
							)}
						</div>
					</div>

					{/* Problems List */}
					<div className="space-y-4">
						{problemSet.problems.map((problem, index) => (
							<div
								className="group fade-in slide-in-from-bottom-4 animate-in fill-mode-both duration-500"
								key={problem.id}
								style={{ animationDelay: `${index * 50}ms` }}
							>
								<Card className="relative overflow-hidden border-white/5 bg-zinc-900/30 backdrop-blur-xl transition-all duration-300 hover:border-yellow-500/30 hover:bg-zinc-900/50">
									{/* Hover Gradient */}
									<div className="pointer-events-none absolute inset-0 bg-linear-to-r from-yellow-500/0 via-yellow-500/5 to-yellow-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

									<div className="relative z-10 flex items-center justify-between p-6">
										<div className="flex items-center gap-6">
											{/* Problem Number */}
											<div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/5 bg-zinc-800/80 font-bold font-mono text-sm text-zinc-400 transition-all group-hover:border-yellow-500/20 group-hover:text-yellow-400">
												{String(index + 1).padStart(2, "0")}
											</div>

											{/* Icon */}
											<div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-2.5 transition-transform group-hover:scale-110">
												{index % 3 === 0 ? (
													<BrainCircuit className="h-5 w-5 text-yellow-400" />
												) : index % 3 === 1 ? (
													<Activity className="h-5 w-5 text-yellow-400" />
												) : (
													<Zap className="h-5 w-5 text-yellow-400" />
												)}
											</div>

											{/* Problem Info */}
											<div>
												<h3 className="font-semibold text-lg text-white transition-colors group-hover:text-yellow-400">
													{problem.title}
												</h3>
												<p className="mt-1 text-sm text-zinc-500">
													Implement {problem.title.toLowerCase()} from first
													principles
												</p>
											</div>
										</div>

										<div className="flex items-center gap-4">
											<Badge
												className="px-3 py-1 font-bold text-[10px] uppercase tracking-wider"
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

											<Link href={`/practice/${slug}/${problem.slug}`}>
												<Button
													className="group/btn relative overflow-hidden border border-white/10 bg-white/5 px-6 font-semibold text-white transition-all duration-300 hover:border-yellow-500 hover:bg-yellow-500 hover:text-black"
													size="sm"
												>
													<span className="relative z-10 flex items-center">
														Solve
														<ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
													</span>
													<div className="absolute inset-0 bg-linear-to-r from-yellow-500 to-amber-500 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
												</Button>
											</Link>
										</div>
									</div>
								</Card>
							</div>
						))}
					</div>

					{problemSet.problems.length === 0 && (
						<div className="rounded-2xl border border-zinc-800 border-dashed bg-zinc-900/20 py-20 text-center">
							<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800/50">
								<Sparkles className="h-8 w-8 text-zinc-600" />
							</div>
							<p className="text-lg text-zinc-500">
								No problems in this set yet.
							</p>
							<p className="mt-2 text-zinc-600">New challenges coming soon!</p>
						</div>
					)}
				</div>
			</main>

			<Footer />
		</div>
	);
}
