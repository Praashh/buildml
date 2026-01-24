import { BookOpen, ChevronRight, Layers, Notebook, Target } from "lucide-react";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
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
					{/* Header */}
					<div className="mb-16 text-center">
						<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/5 px-4 py-2">
							<Notebook className="h-4 w-4 text-yellow-400" />
							<span className="font-medium text-yellow-400 text-sm">
								AI/ML Practice Arena
							</span>
						</div>
						<h1 className="mb-6 font-bold text-5xl text-white tracking-tight">
							Choose Your
							<span className="bg-linear-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
								{" "}
								Challenge
							</span>
						</h1>
						<p className="mx-auto max-w-2xl text-lg text-zinc-400 leading-relaxed">
							Master AI/ML concepts through curated problem sets. Each set
							contains multiple challenges designed to build your skills
							progressively.
						</p>
					</div>

					{/* Stats Row */}
					<div className="mb-12 flex justify-center gap-8">
						<div className="flex items-center gap-2 text-zinc-500">
							<Layers className="h-4 w-4 text-yellow-500" />
							<span className="text-sm">{problemSets.length} Problem Sets</span>
						</div>
						<div className="flex items-center gap-2 text-zinc-500">
							<Target className="h-4 w-4 text-yellow-500" />
							<span className="text-sm">
								{problemSets.reduce((acc, set) => acc + set._count.problems, 0)}{" "}
								Total Challenges
							</span>
						</div>
					</div>

					{/* Problem Sets Grid */}
					<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
						{problemSets.map((set, index) => (
							<div
								className="group fade-in slide-in-from-bottom-8 animate-in fill-mode-both duration-700"
								key={set.id}
								style={{ animationDelay: `${index * 100}ms` }}
							>
								<Card className="group relative h-full overflow-hidden border-white/5 bg-zinc-900/30 backdrop-blur-xl transition-all duration-500 hover:border-yellow-500/30 hover:bg-zinc-900/50">
									{/* Ambient Glow */}
									<div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-yellow-500/5 blur-3xl transition-colors duration-500 group-hover:bg-yellow-500/10" />

									{/* Hover Border Gradient */}
									<div className="pointer-events-none absolute inset-0 rounded-lg bg-linear-to-r from-yellow-500/10 via-transparent to-amber-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

									<CardHeader className="relative z-10 pb-2">
										<div className="mb-6 flex items-start justify-between">
											<div className="rounded-xl border border-yellow-500/20 bg-linear-to-br from-yellow-500/20 to-amber-500/10 p-3 transition-transform duration-300 group-hover:scale-110">
												<Layers className="h-6 w-6 text-yellow-400" />
											</div>
											<Badge
												className="border-zinc-700 px-3 py-1 font-bold text-[10px] text-zinc-400 uppercase tracking-wider transition-colors group-hover:border-yellow-500/30 group-hover:text-yellow-400"
												variant="outline"
											>
												{set._count.problems}{" "}
												{set._count.problems === 1 ? "Problem" : "Problems"}
											</Badge>
										</div>
										<CardTitle className="font-bold text-2xl text-white transition-colors duration-300 group-hover:text-yellow-400">
											{set.title}
										</CardTitle>
										<CardDescription className="mt-3 line-clamp-2 text-zinc-400 leading-relaxed">
											{set.description ||
												`Explore ${set._count.problems} curated problems to strengthen your understanding.`}
										</CardDescription>
									</CardHeader>

									<CardContent className="relative z-10 pt-4">
										<Link href={`/practice/${set.slug}`}>
											<Button className="group/btn relative w-full overflow-hidden border border-white/10 bg-white/5 py-6 font-bold text-white transition-all duration-300 hover:border-yellow-500 hover:bg-yellow-500 hover:text-black">
												<span className="relative z-10 flex items-center justify-center">
													Start Challenge
													<ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
												</span>
												<div className="absolute inset-0 bg-linear-to-r from-yellow-500 to-amber-500 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100" />
											</Button>
										</Link>
									</CardContent>
								</Card>
							</div>
						))}
					</div>

					{problemSets.length === 0 && (
						<div className="rounded-2xl border border-zinc-800 border-dashed bg-zinc-900/20 py-20 text-center">
							<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800/50">
								<BookOpen className="h-8 w-8 text-zinc-600" />
							</div>
							<p className="text-lg text-zinc-500">
								No problem sets available yet.
							</p>
							<p className="mt-2 text-zinc-600">
								Check back soon for new challenges!
							</p>
						</div>
					)}
				</div>
			</main>

			<Footer />
		</div>
	);
}
