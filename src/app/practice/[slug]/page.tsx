import { api } from "~/trpc/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Navbar } from "../../_components/navbar";
import { Footer } from "../../_components/footer";
import { ChevronRight, ChevronLeft, BrainCircuit, Activity, Zap, Layers, Code, Sparkles } from "lucide-react";

export default async function ProblemSetPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const problemSet = await api.problemSet.getBySlug({ slug });

    if (!problemSet) {
        notFound();
    }

    // Count problems by difficulty
    const difficultyCounts = problemSet.problems.reduce((acc, p) => {
        acc[p.difficulty] = (acc[p.difficulty] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="relative min-h-screen bg-black flex flex-col">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
            </div>

            <Navbar />

            <main className="relative z-10 flex-1 pt-32 pb-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb & Header */}
                    <div className="mb-12">
                        <Link
                            href="/practice"
                            className="inline-flex items-center text-zinc-500 hover:text-green-400 transition-colors mb-8 group"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                            Back to Problem Sets
                        </Link>

                        <div className="flex items-start gap-4 mb-6">
                            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/20">
                                <Layers className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">{problemSet.title}</h1>
                                {problemSet.description && (
                                    <p className="text-zinc-400 max-w-3xl leading-relaxed text-lg">
                                        {problemSet.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Stats Bar */}
                        <div className="flex flex-wrap items-center gap-4 mt-8 p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                            <Badge variant="outline" className="border-zinc-700 text-zinc-400 px-3 py-1">
                                <Code className="w-3 h-3 mr-2" />
                                {problemSet.problems.length} {problemSet.problems.length === 1 ? "Problem" : "Problems"}
                            </Badge>
                            {difficultyCounts.Easy && (
                                <Badge variant="success" className="px-3 py-1">
                                    {difficultyCounts.Easy} Easy
                                </Badge>
                            )}
                            {difficultyCounts.Medium && (
                                <Badge variant="warning" className="px-3 py-1">
                                    {difficultyCounts.Medium} Medium
                                </Badge>
                            )}
                            {difficultyCounts.Hard && (
                                <Badge variant="destructive" className="px-3 py-1">
                                    {difficultyCounts.Hard} Hard
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Problems List */}
                    <div className="space-y-4">
                        {problemSet.problems.map((problem, index) => (
                            <div
                                key={problem.id}
                                className="group animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <Card className="border-white/5 bg-zinc-900/30 backdrop-blur-xl hover:bg-zinc-900/50 hover:border-green-500/30 transition-all duration-300 overflow-hidden relative">
                                    {/* Hover Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                    <div className="flex items-center justify-between p-6 relative z-10">
                                        <div className="flex items-center gap-6">
                                            {/* Problem Number */}
                                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-800/80 text-zinc-400 font-mono text-sm font-bold border border-white/5 group-hover:border-green-500/20 group-hover:text-green-400 transition-all">
                                                {String(index + 1).padStart(2, '0')}
                                            </div>

                                            {/* Icon */}
                                            <div className="p-2.5 rounded-lg bg-green-500/10 border border-green-500/20 group-hover:scale-110 transition-transform">
                                                {index % 3 === 0 ? <BrainCircuit className="w-5 h-5 text-green-400" /> :
                                                    index % 3 === 1 ? <Activity className="w-5 h-5 text-green-400" /> :
                                                        <Zap className="w-5 h-5 text-green-400" />}
                                            </div>

                                            {/* Problem Info */}
                                            <div>
                                                <h3 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors">
                                                    {problem.title}
                                                </h3>
                                                <p className="text-sm text-zinc-500 mt-1">
                                                    Implement {problem.title.toLowerCase()} from first principles
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <Badge variant={
                                                problem.difficulty === "Easy" ? "success" :
                                                    problem.difficulty === "Medium" ? "warning" : "destructive"
                                            } className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                                                {problem.difficulty}
                                            </Badge>

                                            <Link href={`/practice/${slug}/${problem.slug}`}>
                                                <Button
                                                    size="sm"
                                                    className="bg-white/5 hover:bg-green-500 text-white hover:text-black border border-white/10 hover:border-green-500 transition-all duration-300 font-semibold px-6 relative overflow-hidden group/btn"
                                                >
                                                    <span className="relative z-10 flex items-center">
                                                        Solve
                                                        <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                                                    </span>
                                                    <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>

                    {problemSet.problems.length === 0 && (
                        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
                            <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mx-auto mb-6">
                                <Sparkles className="w-8 h-8 text-zinc-600" />
                            </div>
                            <p className="text-zinc-500 text-lg">No problems in this set yet.</p>
                            <p className="text-zinc-600 mt-2">New challenges coming soon!</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
