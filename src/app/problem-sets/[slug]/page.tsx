import { api } from "~/trpc/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { Navbar } from "../../_components/navbar";
import { Footer } from "../../_components/footer";
import { ChevronRight, ChevronLeft, BrainCircuit, Activity, Zap, CheckCircle } from "lucide-react";

export default async function ProblemSetDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const problemSet = await api.problemSet.getBySlug({ slug });

    if (!problemSet) {
        notFound();
    }

    return (
        <div className="relative min-h-screen bg-black flex flex-col">
            <Navbar />

            <main className="relative z-10 flex-1 pt-32 pb-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb & Header */}
                    <div className="mb-12">
                        <Link
                            href="/problem-sets"
                            className="inline-flex items-center text-zinc-500 hover:text-green-400 transition-colors mb-6"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Back to Problem Sets
                        </Link>

                        <h1 className="text-4xl font-bold text-white mb-4">{problemSet.title}</h1>
                        {problemSet.description && (
                            <p className="text-zinc-400 max-w-3xl leading-relaxed">
                                {problemSet.description}
                            </p>
                        )}

                        <div className="flex items-center gap-4 mt-6">
                            <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                                {problemSet.problems.length} {problemSet.problems.length === 1 ? "Problem" : "Problems"}
                            </Badge>
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
                                <Card className="border-white/5 bg-zinc-900/30 backdrop-blur-xl hover:bg-zinc-900/50 hover:border-green-500/30 transition-all duration-300">
                                    <div className="flex items-center justify-between p-6">
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-800 text-zinc-400 font-mono text-sm">
                                                {String(index + 1).padStart(2, '0')}
                                            </div>

                                            <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                                                {index % 3 === 0 ? <BrainCircuit className="w-4 h-4 text-green-400" /> :
                                                    index % 3 === 1 ? <Activity className="w-4 h-4 text-green-400" /> :
                                                        <Zap className="w-4 h-4 text-green-400" />}
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors">
                                                    {problem.title}
                                                </h3>
                                                <p className="text-sm text-zinc-500">
                                                    Implement {problem.title.toLowerCase()} from scratch
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <Badge variant={
                                                problem.difficulty === "Easy" ? "success" :
                                                    problem.difficulty === "Medium" ? "warning" : "destructive"
                                            } className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                                                {problem.difficulty}
                                            </Badge>

                                            <Link href={`/problem-sets/${slug}/${problem.slug}`}>
                                                <Button
                                                    size="sm"
                                                    className="bg-white/5 hover:bg-green-500 text-white hover:text-black border border-white/10 hover:border-green-500 transition-all duration-300 font-semibold"
                                                >
                                                    Solve
                                                    <ChevronRight className="w-4 h-4 ml-1" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>

                    {problemSet.problems.length === 0 && (
                        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-xl">
                            <p className="text-zinc-500">No problems in this set yet.</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
