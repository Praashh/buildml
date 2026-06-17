import {
	Activity,
	BrainCircuit,
	ChevronLeft,
	Code,
	Layers,
	Sparkles,
	Zap,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createMetadata } from "~/lib/seo";
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

function DifficultyTag({ difficulty }: { difficulty: string }) {
	const cls =
		difficulty === "Easy"
			? "bg-[var(--tag-beginner-bg)] text-[var(--tag-beginner-ink)]"
			: difficulty === "Medium"
				? "bg-[var(--tag-intermediate-bg)] text-[var(--tag-intermediate-ink)]"
				: "bg-[var(--tag-advanced-bg)] text-[var(--tag-advanced-ink)]";

	return (
		<span
			className={`rounded-[2px] px-2 py-[3px] text-[9px] uppercase tracking-[0.08em] ${cls}`}
		>
			{difficulty}
		</span>
	);
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
		<div className="relative flex min-h-screen flex-col bg-[var(--background)]">
			<Navbar />

			<div className="animate-fade-in pt-[58px]">
				{/* Header */}
				<div className="border-[var(--line)] border-b px-6 py-10 md:px-[52px]">
					<Link
						className="mb-6 inline-flex items-center gap-[6px] font-sans text-[11px] text-[var(--dim)] transition-colors duration-[0.18s] hover:text-primary"
						href="/practice"
					>
						<ChevronLeft className="h-3.5 w-3.5" />
						Back to Problem Sets
					</Link>

					<div className="flex items-start gap-4">
						<div className="rounded-[2px] border border-primary/20 bg-primary/10 p-3">
							<Layers className="h-6 w-6 text-primary" />
						</div>
						<div>
							<h1 className="mb-3 font-display font-extrabold text-[24px] tracking-[-0.02em]">
								{problemSet.title}
							</h1>
							{problemSet.description && (
								<p className="max-w-3xl text-[13px] text-[var(--sub)] leading-[1.85]">
									{problemSet.description}
								</p>
							)}
						</div>
					</div>

					{/* Stats chips */}
					<div className="mt-6 flex flex-wrap items-center gap-2">
						<span className="rounded-[2px] border border-[var(--line)] bg-[var(--panel)] px-[10px] py-1 text-[10px] text-[var(--sub)] tracking-[0.07em]">
							<Code className="mr-1.5 inline-block h-3 w-3" />
							{problemSet.problems.length}{" "}
							{problemSet.problems.length === 1 ? "Problem" : "Problems"}
						</span>
						{difficultyCounts.Easy && <DifficultyTag difficulty="Easy" />}
						{difficultyCounts.Medium && <DifficultyTag difficulty="Medium" />}
						{difficultyCounts.Hard && <DifficultyTag difficulty="Hard" />}
					</div>
				</div>

				{/* Problems List */}
				<div className="border-[var(--line)] border-b">
					{problemSet.problems.map((problem, index) => (
						<Link
							className="group flex items-center justify-between border-[var(--line)] border-b px-6 py-5 transition-all duration-[0.18s] last:border-b-0 hover:bg-[var(--panel)] md:px-[52px]"
							href={`/practice/${slug}/${problem.slug}`}
							key={problem.id}
						>
							<div className="flex items-center gap-5">
								{/* Number */}
								<div className="flex h-10 w-10 items-center justify-center rounded-[2px] border border-[var(--line)] font-bold font-sans text-[var(--dim)] text-xs transition-all duration-[0.18s] group-hover:border-primary/20 group-hover:text-primary">
									{String(index + 1).padStart(2, "0")}
								</div>

								{/* Icon */}
								<div className="rounded-[2px] border border-primary/20 bg-primary/10 p-2 transition-transform duration-[0.18s] group-hover:scale-110">
									{index % 3 === 0 ? (
										<BrainCircuit className="h-4 w-4 text-primary" />
									) : index % 3 === 1 ? (
										<Activity className="h-4 w-4 text-primary" />
									) : (
										<Zap className="h-4 w-4 text-primary" />
									)}
								</div>

								{/* Info */}
								<div>
									<h3 className="font-display font-semibold text-[15px] text-[var(--ink)] transition-colors duration-[0.18s] group-hover:text-primary">
										{problem.title}
									</h3>
									<p className="mt-0.5 text-[var(--dim)] text-xs">
										Implement {problem.title.toLowerCase()} from first
										principles
									</p>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<DifficultyTag difficulty={problem.difficulty} />
								<span className="text-[var(--dim)] text-base transition-all duration-[0.18s] group-hover:translate-x-[5px] group-hover:text-primary">
									→
								</span>
							</div>
						</Link>
					))}
				</div>

				{problemSet.problems.length === 0 && (
					<div className="border-[var(--line)] border-b px-6 py-20 text-center md:px-[52px]">
						<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[2px] bg-[var(--panel)]">
							<Sparkles className="h-8 w-8 text-[var(--dim)]" />
						</div>
						<p className="text-[var(--sub)] text-sm">
							No problems in this set yet.
						</p>
						<p className="mt-2 text-[var(--dim)] text-xs">
							New challenges coming soon!
						</p>
					</div>
				)}

				<Footer />
			</div>
		</div>
	);
}
