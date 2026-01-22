import { api } from "~/trpc/server";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { Navbar } from "../_components/navbar";
import { Footer } from "../_components/footer";
import RainingLetters from "../_components/hero";
import { ChevronRight, BrainCircuit, Activity, Zap } from "lucide-react";

export default async function PracticePage() {
    const problems = await api.problem.getAll();

    return (
        <div className="relative min-h-screen bg-black flex flex-col">
            <Navbar />

            <main className="relative z-10 flex-1 pt-32 pb-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="max-w-3xl mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold mb-6 uppercase tracking-widest">
                            <Zap className="w-3 h-3 fill-current" />
                            Hands-on Learning
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                            Master AI & ML <br />
                            <span className="bg-linear-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                                through practice.
                            </span>
                        </h1>
                        <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl">
                            Bridge the gap between theory and implementation. Solve algorithmic challenges,
                            optimize neural networks, and master the math behind machine learning.
                        </p>
                    </div>

                    {/* Problems Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {problems.map((problem, index) => (
                            <div
                                key={problem.id}
                                className="group animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <Card className="h-full border-white/5 bg-zinc-900/30 backdrop-blur-xl hover:bg-zinc-900/50 hover:border-green-500/30 transition-all duration-500 relative overflow-hidden group">
                                    {/* Ambient Glow */}
                                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-500/5 blur-3xl rounded-full group-hover:bg-green-500/10 transition-colors duration-500" />

                                    <CardHeader className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/20">
                                                {index % 3 === 0 ? <BrainCircuit className="w-5 h-5 text-green-400" /> :
                                                    index % 3 === 1 ? <Activity className="w-5 h-5 text-green-400" /> :
                                                        <Zap className="w-5 h-5 text-green-400" />}
                                            </div>
                                            <Badge variant={
                                                problem.difficulty === "Easy" ? "success" :
                                                    problem.difficulty === "Medium" ? "warning" : "destructive"
                                            } className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                                                {problem.difficulty}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">
                                            {problem.title}
                                        </CardTitle>
                                        <CardDescription className="text-zinc-400 line-clamp-2 mt-2 leading-relaxed">
                                            Learn the core mechanics of {problem.title.toLowerCase()} and implement it from first principles.
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="relative z-10 pt-4">
                                        <Link href={`/practice/${problem.slug}`}>
                                            <Button className="w-full group/btn bg-white/5 hover:bg-green-500 text-white hover:text-black border border-white/10 hover:border-green-500 transition-all duration-300 font-bold py-6">
                                                Start Challenge
                                                <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
