import { BookOpen, Layers, Target } from "lucide-react";
import Link from "next/link";
import { createMetadata } from "~/lib/seo";
import { api } from "~/trpc/server";
import { Footer } from "../_components/footer";
import { Navbar } from "../_components/navbar";

export const metadata = createMetadata({
	title: "Practice AI/ML Challenges",
	description:
		"Master AI and Machine Learning through hands-on coding challenges. Implement research papers, neural networks, and algorithms from scratch.",
	pathname: "/practice",
});

export default async function PracticePage() {
	const problemSets = await api.problemSet.getAll();

	return (
		<div className="relative flex min-h-screen flex-col bg-[var(--background)]">
			<Navbar />

			<div className="animate-fade-in pt-[58px]">
				{/* Page Hero */}
				<div className="border-[var(--line)] border-b px-6 py-14 md:px-[52px] md:py-[60px]">
					<div className="mb-0 flex items-center gap-3 text-[10px] text-[var(--dim)] uppercase tracking-[0.18em]">
						Practice
						<span className="h-px flex-1 bg-[var(--line)]" />
					</div>
					<h1 className="mt-[14px] mb-3 font-display font-extrabold text-[clamp(40px,5vw,68px)] leading-[0.92] tracking-[-0.03em]">
						All{" "}
						<span className="font-normal font-serif text-primary italic">
							Challenges
						</span>
					</h1>
					<p className="max-w-[480px] text-[13px] text-[var(--sub)] leading-[1.85]">
						Implement foundational ML algorithms from scratch. Each problem set
						contains curated challenges to build your skills progressively.
					</p>
				</div>

				{/* Stats bar */}
				<div className="flex flex-wrap items-center gap-6 border-[var(--line)] border-b bg-[var(--panel)] px-6 py-[14px] md:px-[52px]">
					<div className="flex items-center gap-2 text-[var(--dim)]">
						<Layers className="h-3.5 w-3.5 text-primary" />
						<span className="text-[10px] uppercase tracking-[0.07em]">
							{problemSets.length} Problem Sets
						</span>
					</div>
					<div className="flex items-center gap-2 text-[var(--dim)]">
						<Target className="h-3.5 w-3.5 text-primary" />
						<span className="text-[10px] uppercase tracking-[0.07em]">
							{problemSets.reduce((acc, set) => acc + set._count.problems, 0)}{" "}
							Total Challenges
						</span>
					</div>
				</div>

				{/* Problem Sets Grid */}
				<div className="grid grid-cols-1 border-[var(--line)] border-b md:grid-cols-2 lg:grid-cols-3">
					{problemSets.map((set, _index) => (
						<Link
							className="group flex cursor-pointer flex-col border-[var(--line)] border-r border-b bg-[var(--background)] px-7 py-7 transition-all duration-[0.18s] last:border-r-0 hover:translate-y-[-2px] hover:bg-[var(--panel)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] [&:nth-child(3n)]:border-r-0"
							href={`/practice/${set.slug}`}
							key={set.id}
						>
							{/* Accent top bar on hover */}
							<div className="pointer-events-none absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-primary to-transparent opacity-0 transition-opacity duration-[0.18s] group-hover:opacity-100" />

							<div className="mb-[14px] flex items-center justify-between">
								<span className="font-sans text-[11px] text-[var(--dim)] tracking-[0.01em]">
									{set._count.problems}{" "}
									{set._count.problems === 1 ? "problem" : "problems"}
								</span>
								<span className="rounded-[2px] bg-[var(--tag-beginner-bg)] px-2 py-[3px] text-[9px] text-[var(--tag-beginner-ink)] uppercase tracking-[0.08em]">
									Problem Set
								</span>
							</div>

							<div className="mb-2 font-bold font-display text-[17px] text-[var(--ink)] tracking-[-0.01em]">
								{set.title}
							</div>

							<p className="flex-1 text-[var(--sub)] text-xs leading-[1.65]">
								{set.description ||
									`Explore ${set._count.problems} curated problems to strengthen your understanding.`}
							</p>

							<div className="mt-4 flex items-center justify-between border-[var(--line)] border-t pt-4">
								<span className="text-[10px] text-[var(--dim)] uppercase tracking-[0.05em]">
									{set._count.problems}{" "}
									{set._count.problems === 1 ? "Challenge" : "Challenges"}
								</span>
								<span className="text-[var(--dim)] text-base transition-all duration-[0.18s] group-hover:translate-x-[5px] group-hover:text-primary">
									→
								</span>
							</div>
						</Link>
					))}
				</div>

				{problemSets.length === 0 && (
					<div className="border-[var(--line)] border-b px-6 py-20 text-center md:px-[52px]">
						<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[2px] bg-[var(--panel)]">
							<BookOpen className="h-8 w-8 text-[var(--dim)]" />
						</div>
						<p className="text-[var(--sub)] text-sm">
							No problem sets available yet.
						</p>
						<p className="mt-2 text-[var(--dim)] text-xs">
							Check back soon for new challenges!
						</p>
					</div>
				)}

				<Footer />
			</div>
		</div>
	);
}
