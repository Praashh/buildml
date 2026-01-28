"use client";

import { api } from "~/trpc/react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { Heatmap } from "./Heatmap";
import { Share2, Trophy, Zap, Target, Award } from "lucide-react";
import { toast } from "sonner";

interface ProfileClientProps {
    userId: string;
}

export function ProfileClient({ userId }: ProfileClientProps) {
    const [profile] = api.user.getProfile.useSuspenseQuery({ userId });

    if (!profile) {
        return (
            <div className="text-center text-neutral-400">
                <p>Profile not found or you're not logged in.</p>
            </div>
        );
    }

    const { user, difficultyCounts, totalCounts, solvedCount, history } = profile;

    const handleShare = async () => {
        const url = `${window.location.origin}/profile?userId=${user.id}`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${user.name}'s Profile on buildml`,
                    text: `Check out ${user.name}'s progress on buildml! They've solved ${solvedCount} problems.`,
                    url: url,
                });
            } catch (err) {
                console.error(err);
            }
        } else {
            await navigator.clipboard.writeText(url);
            toast.success("Profile link copied to clipboard!");
        }
    };

    const getPercentage = (count: number, total: number) =>
        total > 0 ? Math.min((count / total) * 100, 100) : 0;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Profile Header */}
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col items-center gap-6 md:flex-row md:items-center">
                    <div className="relative">
                        <div className="absolute -inset-4 rounded-full bg-primary/20 blur-xl animate-pulse" />
                        <Avatar className="h-24 w-24 border-2 border-primary/20 md:h-32 md:w-32">
                            <AvatarImage src={user.image ?? ""} alt={user.name ?? "User"} />
                            <AvatarFallback className="text-2xl font-bold bg-neutral-900 text-white">
                                {user.name?.[0] ?? "U"}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="mb-2 font-black text-3xl text-white tracking-tight md:text-4xl">
                            {user.name ?? "Anonymous"}
                        </h2>
                        <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                                Level {Math.floor(solvedCount / 10) + 1}
                            </Badge>
                            <Badge variant="outline" className="text-neutral-400 border-neutral-800">
                                Joined {new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                            </Badge>
                        </div>
                    </div>
                </div>
                <Button
                    onClick={handleShare}
                    variant="outline"
                    className="group relative overflow-hidden border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 hover:text-white transition-all duration-300"
                >
                    <Share2 className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    Share Profile
                    <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card className="border-neutral-800 bg-neutral-900/30 backdrop-blur-sm overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 font-black text-6xl text-primary/5 select-none transition-transform group-hover:scale-110 duration-500">
                        <Trophy />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-yellow-500" />
                            Total Solved
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-white">{solvedCount}</div>
                        <p className="mt-1 text-xs text-neutral-500">problems mastered</p>
                    </CardContent>
                </Card>

                <Card className="border-neutral-800 bg-neutral-900/30 backdrop-blur-sm overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 font-black text-6xl text-primary/5 select-none transition-transform group-hover:scale-110 duration-500">
                        <Zap />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                            <Zap className="h-4 w-4 text-primary" />
                            Current Streak
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-white">12</div>
                        <p className="mt-1 text-xs text-neutral-500">days in a row</p>
                    </CardContent>
                </Card>

                <Card className="border-neutral-800 bg-neutral-900/30 backdrop-blur-sm overflow-hidden relative group">
                    <div className="absolute top-0 right-0 p-4 font-black text-6xl text-primary/5 select-none transition-transform group-hover:scale-110 duration-500">
                        <Award />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                            <Award className="h-4 w-4 text-purple-500" />
                            Achievements
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-white">7</div>
                        <p className="mt-1 text-xs text-neutral-500">badges earned</p>
                    </CardContent>
                </Card>
            </div>

            {/* difficulty Breakdown and Heatmap */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Difficulty Breakdown */}
                <Card className="lg:col-span-4 border-neutral-800 bg-neutral-900/30 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                            <Target className="h-5 w-5 text-primary" />
                            Difficulty Breakdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-yellow-400 font-medium italic">Easy</span>
                                <span className="text-white font-bold">{difficultyCounts.Easy} / {totalCounts.Easy}</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
                                <div
                                    className="h-full bg-yellow-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${getPercentage(difficultyCounts.Easy, totalCounts.Easy)}%` }}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-amber-400 font-medium italic">Medium</span>
                                <span className="text-white font-bold">{difficultyCounts.Medium} / {totalCounts.Medium}</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
                                <div
                                    className="h-full bg-amber-500 rounded-full transition-all duration-1000 delay-100"
                                    style={{ width: `${getPercentage(difficultyCounts.Medium, totalCounts.Medium)}%` }}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-rose-400 font-medium italic">Hard</span>
                                <span className="text-white font-bold">{difficultyCounts.Hard} / {totalCounts.Hard}</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
                                <div
                                    className="h-full bg-rose-500 rounded-full transition-all duration-1000 delay-200"
                                    style={{ width: `${getPercentage(difficultyCounts.Hard, totalCounts.Hard)}%` }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Heatmap */}
                <Card className="lg:col-span-8 border-neutral-800 bg-neutral-900/30 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                            Consistency Graph
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Heatmap data={history} />
                        <div className="mt-4 flex items-center justify-end gap-2 text-[10px] text-neutral-500">
                            <span>Less</span>
                            <div className="flex gap-0.75">
                                <div className="h-2.5 w-2.5 rounded-[2px] bg-neutral-900" />
                                <div className="h-2.5 w-2.5 rounded-[2px] bg-primary/30" />
                                <div className="h-2.5 w-2.5 rounded-[2px] bg-primary/60" />
                                <div className="h-2.5 w-2.5 rounded-[2px] bg-primary" />
                            </div>
                            <span>More</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export function ProfileSkeleton() {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-6">
                <Skeleton className="h-24 w-24 rounded-full bg-neutral-800" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48 bg-neutral-800" />
                    <Skeleton className="h-4 w-32 bg-neutral-800" />
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 bg-neutral-800 rounded-xl" />
                ))}
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <Skeleton className="lg:col-span-4 h-64 bg-neutral-800 rounded-xl" />
                <Skeleton className="lg:col-span-8 h-64 bg-neutral-800 rounded-xl" />
            </div>
        </div>
    );
}
