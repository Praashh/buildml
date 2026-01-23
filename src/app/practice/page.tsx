import { api } from "~/trpc/server";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { Navbar } from "../_components/navbar";
import { Footer } from "../_components/footer";
import { ChevronRight, Layers, BookOpen, Sparkles, Target, Zap } from "lucide-react";

export default async function PracticePage() {
    const problemSets = await api.problemSet.getAll();

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
                    {/* Header */}
                    <div className="mb-16 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/20 bg-green-500/5 mb-6">
                            <Sparkles className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-medium text-green-400">AI/ML Practice Arena</span>
                        </div>
                        <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">
                            Choose Your
                            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent"> Challenge</span>
                        </h1>
                        <p className="text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed">
                            Master AI/ML concepts through curated problem sets. Each set contains multiple challenges designed to build your skills progressively.
                        </p>
                    </div>

                    {/* Stats Row */}
                    <div className="flex justify-center gap-8 mb-12">
                        <div className="flex items-center gap-2 text-zinc-500">
                            <Layers className="w-4 h-4 text-green-500" />
                            <span className="text-sm">{problemSets.length} Problem Sets</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-500">
                            <Target className="w-4 h-4 text-green-500" />
                            <span className="text-sm">{problemSets.reduce((acc, set) => acc + set._count.problems, 0)} Total Challenges</span>
                        </div>
                    </div>

                    {/* Problem Sets Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {problemSets.map((set, index) => (
                            <div
                                key={set.id}
                                className="group animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <Card className="h-full border-white/5 bg-zinc-900/30 backdrop-blur-xl hover:bg-zinc-900/50 hover:border-green-500/30 transition-all duration-500 relative overflow-hidden group">
                                    {/* Ambient Glow */}
                                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-500/5 blur-3xl rounded-full group-hover:bg-green-500/10 transition-colors duration-500" />

                                    {/* Hover Border Gradient */}
                                    <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-green-500/10 via-transparent to-emerald-500/10 pointer-events-none" />

                                    <CardHeader className="relative z-10 pb-2">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/20 group-hover:scale-110 transition-transform duration-300">
                                                <Layers className="w-6 h-6 text-green-400" />
                                            </div>
                                            <Badge variant="outline" className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider border-zinc-700 text-zinc-400 group-hover:border-green-500/30 group-hover:text-green-400 transition-colors">
                                                {set._count.problems} {set._count.problems === 1 ? "Problem" : "Problems"}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">
                                            {set.title}
                                        </CardTitle>
                                        <CardDescription className="text-zinc-400 line-clamp-2 mt-3 leading-relaxed">
                                            {set.description || `Explore ${set._count.problems} curated problems to strengthen your understanding.`}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="relative z-10 pt-4">
                                        <Link href={`/practice/${set.slug}`}>
                                            <Button className="w-full group/btn bg-white/5 hover:bg-green-500 text-white hover:text-black border border-white/10 hover:border-green-500 transition-all duration-300 font-bold py-6 relative overflow-hidden">
                                                <span className="relative z-10 flex items-center justify-center">
                                                    Start Challenge
                                                    <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                                </span>
                                                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>

                    {problemSets.length === 0 && (
                        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
                            <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mx-auto mb-6">
                                <BookOpen className="w-8 h-8 text-zinc-600" />
                            </div>
                            <p className="text-zinc-500 text-lg">No problem sets available yet.</p>
                            <p className="text-zinc-600 mt-2">Check back soon for new challenges!</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
