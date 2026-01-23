import { api } from "~/trpc/server";
import Link from "next/link";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { Navbar } from "../_components/navbar";
import { Footer } from "../_components/footer";
import { ChevronRight, Layers, BookOpen } from "lucide-react";

export default async function ProblemSetsPage() {
    const problemSets = await api.problemSet.getAll();

    return (
        <div className="relative min-h-screen bg-black flex flex-col">
            <Navbar />

            <main className="relative z-10 flex-1 pt-32 pb-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-12 text-center">
                        <h1 className="text-4xl font-bold text-white mb-4">Problem Sets</h1>
                        <p className="text-zinc-400 max-w-2xl mx-auto">
                            Master AI/ML concepts through curated problem sets. Each set contains multiple challenges designed to build your skills progressively.
                        </p>
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

                                    <CardHeader className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/20">
                                                <Layers className="w-5 h-5 text-green-400" />
                                            </div>
                                            <Badge variant="outline" className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border-zinc-700 text-zinc-400">
                                                {set._count.problems} {set._count.problems === 1 ? "Problem" : "Problems"}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">
                                            {set.title}
                                        </CardTitle>
                                        <CardDescription className="text-zinc-400 line-clamp-2 mt-2 leading-relaxed">
                                            {set.description || `Explore ${set._count.problems} curated problems to strengthen your understanding.`}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="relative z-10 pt-4">
                                        <Link href={`/problem-sets/${set.slug}`}>
                                            <Button className="w-full group/btn bg-white/5 hover:bg-green-500 text-white hover:text-black border border-white/10 hover:border-green-500 transition-all duration-300 font-bold py-6">
                                                View Problems
                                                <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>

                    {problemSets.length === 0 && (
                        <div className="text-center py-20">
                            <BookOpen className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                            <p className="text-zinc-500">No problem sets available yet.</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
