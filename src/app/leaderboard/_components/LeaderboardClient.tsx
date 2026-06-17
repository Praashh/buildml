"use client";

import { Crown, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Skeleton } from "~/components/ui/skeleton";
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

	const allParticipants = leaderboard ?? [];

	return (
		<div className="space-y-8">
			{/* Your Rank Section */}
			{session && (
				<div className="relative flex flex-col items-center justify-center overflow-hidden rounded-[2px] border border-primary/20 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent py-8">
					<div className="absolute top-0 right-0 p-4 opacity-10">
						<Crown className="h-20 w-20 text-primary" />
					</div>
					<p className="mb-2 font-medium font-sans text-[10px] text-[var(--dim)] uppercase tracking-[0.2em]">
						Personal Standing
					</p>
					<div className="flex items-baseline gap-2">
						<span className="font-medium text-[var(--sub)] text-lg">
							Your rank:
						</span>
						<span className="font-display font-extrabold text-5xl text-primary">
							#{userRank ?? "Loading..."}
						</span>
					</div>
				</div>
			)}

			{/* Table */}
			<table className="mt-7 w-full border-collapse">
				<thead>
					<tr>
						<th
							className="border-[var(--line)] border-b py-2 pr-0 pl-0 text-left font-normal font-sans text-[10px] text-[var(--dim)] uppercase tracking-[0.12em]"
							style={{ width: "44px" }}
						>
							#
						</th>
						<th className="border-[var(--line)] border-b py-2 text-left font-normal font-sans text-[10px] text-[var(--dim)] uppercase tracking-[0.12em]">
							Builder
						</th>
						<th className="border-[var(--line)] border-b py-2 text-left font-normal font-sans text-[10px] text-[var(--dim)] uppercase tracking-[0.12em]">
							Solved
						</th>
						<th className="border-[var(--line)] border-b py-2 pr-0 text-right font-normal font-sans text-[10px] text-[var(--dim)] uppercase tracking-[0.12em]">
							Problems Solved
						</th>
					</tr>
				</thead>
				<tbody>
					{allParticipants.length > 0 ? (
						allParticipants.map((user, index) => {
							const isCurrentUser = user.id === session?.user?.id;
							const isTop3 = index < 3;

							return (
								<tr
									className={`group transition-colors duration-[0.18s] ${isCurrentUser ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-[var(--panel)]"}`}
									key={user.id}
								>
									<td className="border-[var(--line)] border-b py-4">
										<span
											className={`font-display font-extrabold text-lg tracking-[-0.02em] ${isTop3 ? "text-primary" : "text-[var(--line)]"}`}
										>
											{String(index + 1).padStart(2, "0")}
										</span>
									</td>
									<td className="border-[var(--line)] border-b py-4">
										<div className="flex items-center gap-3">
											<Avatar
												className={`h-7 w-7 border ${isCurrentUser ? "border-primary" : "border-[var(--line)]"} transition-colors group-hover:border-primary/50`}
											>
												<AvatarImage src={user.image ?? ""} />
												<AvatarFallback className="bg-[var(--panel)] text-[var(--dim)]">
													<User className="h-3.5 w-3.5" />
												</AvatarFallback>
											</Avatar>
											<span
												className={`font-display font-semibold text-[15px] ${isCurrentUser ? "text-primary" : "text-[var(--ink)]"} transition-colors group-hover:text-primary`}
											>
												{user.name}
												{isCurrentUser && (
													<span className="ml-2 rounded-[2px] bg-primary/20 px-1.5 py-0.5 font-bold font-sans text-[9px] text-primary uppercase">
														You
													</span>
												)}
											</span>
										</div>
									</td>
									<td className="border-[var(--line)] border-b py-4">
										<span className="font-sans text-[10px] text-[var(--dim)] uppercase tracking-[0.06em]">
											{user.solvedCount} solved
										</span>
									</td>
									<td className="border-[var(--line)] border-b py-4 pr-0 text-right">
										<span className="font-bold font-display text-[13px] text-[var(--ink)]">
											{user.solvedCount}
										</span>
									</td>
								</tr>
							);
						})
					) : (
						<tr>
							<td className="py-20 text-center text-[var(--dim)]" colSpan={4}>
								<div className="flex flex-col items-center gap-2">
									<p className="text-sm">No completions yet.</p>
									<p className="text-xs">Be the first to solve a problem!</p>
								</div>
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}

function LeaderboardSkeleton() {
	return (
		<div className="animate-pulse space-y-6">
			<Skeleton className="h-24 w-full rounded-[2px] bg-[var(--panel)]" />
			<div className="space-y-3">
				{Array.from({ length: 8 }).map((_, i) => (
					<Skeleton
						className="h-14 w-full rounded-[2px] bg-[var(--panel)]"
						// biome-ignore lint/suspicious/noArrayIndexKey: skeleton items are static
						key={i}
					/>
				))}
			</div>
		</div>
	);
}
