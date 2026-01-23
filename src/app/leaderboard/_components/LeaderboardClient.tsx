"use client";

import { motion } from "framer-motion";
import { Crown, Medal, Trophy, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/react";

export function LeaderboardClient() {
	const { data: session } = useSession();
	const { data: leaderboard, isLoading } = api.user.getLeaderboard.useQuery();
	const { data: userRank } = api.user.getUserRank.useQuery(undefined, {
		enabled: !!session,
	});

	if (isLoading) {
		return <LeaderboardSkeleton />;
	}

	const topThree = leaderboard?.slice(0, 3) ?? [];
	const allParticipants = leaderboard ?? [];

	return (
		<div className="space-y-16">
			{/* Your Rank Section */}
			{session && (
				<motion.div
					animate={{ opacity: 1, scale: 1 }}
					className="relative flex flex-col items-center justify-center overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-br from-primary/20 via-primary/5 to-transparent py-8 shadow-2xl backdrop-blur-xl"
					initial={{ opacity: 0, scale: 0.95 }}
				>
					<div className="absolute top-0 right-0 p-4 opacity-10">
						<Trophy className="h-24 w-24" />
					</div>

					<p className="mb-2 font-medium text-neutral-400 text-xs uppercase tracking-[0.2em]">
						Personal Standing
					</p>
					<div className="flex items-baseline gap-2">
						<span className="font-medium text-2xl text-white/80">
							Your rank:
						</span>
						<span className="animate-gradient-x bg-linear-to-r from-primary via-white to-primary bg-clip-text font-black text-6xl text-transparent">
							#{userRank ?? "???"}
						</span>
					</div>
				</motion.div>
			)}

			{/* Podium Section */}
			<div className="grid grid-cols-1 items-end gap-8 px-4 pt-10 md:grid-cols-3">
				{/* 2nd Place */}
				<PodiumItem
					delay={0.1}
					glow="shadow-slate-500/20"
					gradient="from-slate-400 to-slate-600"
					rank={2}
					user={topThree[1]}
				/>

				{/* 1st Place */}
				<PodiumItem
					delay={0}
					glow="shadow-amber-500/30"
					gradient="from-yellow-400 via-amber-500 to-yellow-600"
					isWinner
					rank={1}
					user={topThree[0]}
				/>

				{/* 3rd Place */}
				<PodiumItem
					delay={0.2}
					glow="shadow-orange-500/20"
					gradient="from-orange-400 to-orange-700"
					rank={3}
					user={topThree[2]}
				/>
			</div>

			{/* Table Section */}
			<div className="space-y-6">
				<div className="flex items-center gap-4 px-2">
					<div className="h-px flex-1 bg-white/10" />
					<h2 className="font-bold text-neutral-400 text-sm uppercase tracking-widest">
						Complete Standings
					</h2>
					<div className="h-px flex-1 bg-white/10" />
				</div>

				<div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-md">
					<Table>
						<TableHeader className="bg-white/5">
							<TableRow className="border-white/10 hover:bg-transparent">
								<TableHead className="w-24 pl-6 font-bold text-[10px] text-neutral-400 uppercase tracking-widest">
									Rank
								</TableHead>
								<TableHead className="font-bold text-[10px] text-neutral-400 uppercase tracking-widest">
									User
								</TableHead>
								<TableHead className="pr-6 text-right font-bold text-[10px] text-neutral-400 uppercase tracking-widest">
									Problems Solved
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{allParticipants.length > 0 ? (
								allParticipants.map((user, index) => {
									const isCurrentUser = user.id === session?.user?.id;
									const isTop3 = index < 3;

									return (
										<TableRow
											className={`group border-white/5 transition-colors ${isCurrentUser ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-white/5"}`}
											key={user.id}
										>
											<TableCell className="pl-6">
												<div
													className={`flex h-8 w-8 items-center justify-center rounded-full font-bold font-mono text-xs ${
														index === 0
															? "border border-yellow-500/30 bg-yellow-500/20 text-yellow-500"
															: index === 1
																? "border border-slate-400/30 bg-slate-400/20 text-slate-400"
																: index === 2
																	? "border border-orange-500/30 bg-orange-500/20 text-orange-500"
																	: "text-neutral-500"
													}
                                                `}
												>
													{index + 1}
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-3">
													<Avatar
														className={`h-8 w-8 border ${isCurrentUser ? "border-primary" : "border-white/10"} transition-colors group-hover:border-primary/50`}
													>
														<AvatarImage src={user.image ?? ""} />
														<AvatarFallback>
															<User className="h-4 w-4" />
														</AvatarFallback>
													</Avatar>
													<div className="flex flex-col">
														<span
															className={`font-medium ${isCurrentUser ? "text-primary" : "text-white"} transition-colors group-hover:text-primary`}
														>
															{user.name}
															{isCurrentUser && (
																<span className="ml-2 rounded bg-primary/20 px-1.5 py-0.5 font-bold text-[10px] text-primary uppercase">
																	You
																</span>
															)}
														</span>
													</div>
												</div>
											</TableCell>
											<TableCell className="pr-6 text-right">
												<Badge
													className={`${isCurrentUser ? "border-primary/30 bg-primary/20 text-primary" : "border-white/10 bg-white/5 text-neutral-400"} hover:bg-primary/20`}
													variant="secondary"
												>
													{user.solvedCount}
												</Badge>
											</TableCell>
										</TableRow>
									);
								})
							) : (
								<TableRow>
									<TableCell
										className="py-20 text-center text-neutral-500"
										colSpan={3}
									>
										<div className="flex flex-col items-center gap-2">
											<p>No completions yet.</p>
											<p className="text-xs">
												Be the first to solve a problem!
											</p>
										</div>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}

function PodiumItem({
	user,
	rank,
	delay,
	isWinner,
	gradient,
	glow,
}: {
	user?: any;
	rank: number;
	delay: number;
	isWinner?: boolean;
	gradient: string;
	glow: string;
}) {
	if (!user) return <div className="hidden md:block" />;

	return (
		<motion.div
			animate={{ opacity: 1, y: 0 }}
			className={`flex flex-col items-center gap-4 ${isWinner ? "z-10 order-1 md:order-2" : rank === 2 ? "order-2 md:order-1" : "order-3"}`}
			initial={{ opacity: 0, y: 30 }}
			transition={{ delay, duration: 0.6, ease: "easeOut" }}
		>
			<div className="group relative">
				{isWinner && (
					<motion.div
						animate={{ rotate: 0, scale: 1 }}
						className="absolute -top-10 left-1/2 -translate-x-1/2 text-yellow-500"
						initial={{ rotate: -20, scale: 0 }}
						transition={{ delay: delay + 0.3, type: "spring" }}
					>
						<Crown className="h-10 w-10 fill-current" />
					</motion.div>
				)}

				<div
					className={`relative rounded-full bg-linear-to-b p-1.5 ${gradient} shadow-2xl ${glow} transition-transform duration-500 group-hover:scale-110`}
				>
					<Avatar
						className={`${isWinner ? "h-32 w-32 md:h-40 md:w-40" : "h-24 w-24 md:h-28 md:w-28"} border-4 border-black`}
					>
						<AvatarImage src={user.image ?? ""} />
						<AvatarFallback className="text-3xl">
							<User />
						</AvatarFallback>
					</Avatar>

					<div
						className={`absolute -bottom-2 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border-2 border-black bg-linear-to-b font-bold text-black drop-shadow-md md:h-10 md:w-10 ${gradient}`}
					>
						{rank}
					</div>
				</div>
			</div>

			<div className="text-center">
				<h3
					className={`mb-1 font-bold text-white ${isWinner ? "text-xl md:text-2xl" : "text-lg"}`}
				>
					{user.name}
				</h3>
				<p className="flex items-center justify-center gap-1 font-medium text-neutral-400 text-sm">
					{user.solvedCount} Solved
				</p>
				<div className="mt-2">
					<Badge className="border-primary/30 bg-primary/20 font-bold text-[10px] text-primary uppercase tracking-tighter hover:bg-primary/30">
						Grandmaster
					</Badge>
				</div>
			</div>
		</motion.div>
	);
}

function LeaderboardSkeleton() {
	return (
		<div className="animate-pulse space-y-12">
			<Skeleton className="h-24 w-full rounded-2xl bg-white/5" />
			<div className="grid grid-cols-1 items-end gap-8 pt-10 md:grid-cols-3">
				<div className="flex flex-col items-center gap-4">
					<Skeleton className="h-28 w-28 rounded-full bg-white/5" />
					<Skeleton className="h-4 w-24 bg-white/5" />
				</div>
				<div className="flex flex-col items-center gap-4">
					<Skeleton className="h-40 w-40 rounded-full bg-white/5" />
					<Skeleton className="h-4 w-32 bg-white/5" />
				</div>
				<div className="flex flex-col items-center gap-4">
					<Skeleton className="h-28 w-28 rounded-full bg-white/5" />
					<Skeleton className="h-4 w-24 bg-white/5" />
				</div>
			</div>
			<div className="h-64 rounded-2xl border border-white/10 bg-black/40" />
		</div>
	);
}
