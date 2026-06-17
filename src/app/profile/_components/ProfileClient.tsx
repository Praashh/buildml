"use client";

import { Award, Share2, Target, Trophy, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/react";
import { Heatmap } from "./Heatmap";

interface ProfileClientProps {
	userId: string;
}

export function ProfileClient({ userId }: ProfileClientProps) {
	const [profile] = api.user.getProfile.useSuspenseQuery({ userId });
	const [isSharing, setIsSharing] = useState(false);

	if (!profile) {
		return (
			<div className="py-20 text-center font-mono text-[11px] text-[var(--sub)] uppercase tracking-[0.05em]">
				<p>Profile not found or you're not logged in.</p>
			</div>
		);
	}

	const { user, difficultyCounts, totalCounts, solvedCount, history } = profile;

	const handleShare = async () => {
		const url = `${window.location.origin}/profile?userId=${user.id}`;
		setIsSharing(true);
		if (navigator.share) {
			try {
				await navigator.share({
					title: `${user.name}'s Profile on buildml`,
					text: `Check out ${user.name}'s progress on buildml! They've solved ${solvedCount} problems.`,
					url: url,
				});
			} catch (err) {
				console.error(err);
			} finally {
				setIsSharing(false);
			}
		} else {
			try {
				await navigator.clipboard.writeText(url);
				toast.success("Profile link copied to clipboard!");
			} catch (err) {
				console.error(err);
			} finally {
				setIsSharing(false);
			}
		}
	};

	const getPercentage = (count: number, total: number) =>
		total > 0 ? Math.min((count / total) * 100, 100) : 0;

	return (
		<div className="space-y-10">
			{/* Profile Header */}
			<div className="flex flex-col items-center gap-6 border-[var(--line)] border-b pb-8 md:flex-row md:items-center md:justify-between">
				<div className="flex flex-col items-center gap-6 md:flex-row md:items-center">
					<Avatar className="h-20 w-20 rounded-[2px] border border-[var(--line)] md:h-24 md:w-24">
						<AvatarImage alt={user.name ?? "User"} src={user.image ?? ""} />
						<AvatarFallback className="rounded-[2px] bg-[var(--panel)] font-display font-extrabold text-[var(--ink)] text-xl">
							{user.name?.[0] ?? "U"}
						</AvatarFallback>
					</Avatar>
					<div className="text-center md:text-left">
						<h2 className="mb-2 font-display font-extrabold text-[clamp(28px,4vw,38px)] text-[var(--ink)] leading-tight tracking-[-0.025em]">
							{user.name ?? "Anonymous"}
						</h2>
						<div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
							<span className="rounded-[2px] border border-primary bg-primary/[0.08] px-2.5 py-[3px] font-mono text-[9px] text-primary uppercase tracking-[0.05em]">
								Level {Math.floor(solvedCount / 10) + 1}
							</span>
							<span className="rounded-[2px] border border-[var(--line)] bg-[var(--panel)] px-2.5 py-[3px] font-mono text-[9px] text-[var(--dim)] uppercase tracking-[0.05em]">
								Joined Builder Network
							</span>
						</div>
					</div>
				</div>
				<button
					className="flex items-center gap-2 rounded-[2px] border border-[var(--line)] bg-[var(--panel)] px-4 py-2.5 font-mono text-[10px] text-[var(--dim)] uppercase tracking-[0.08em] transition-all duration-[0.18s] hover:border-[var(--sub)] hover:text-[var(--ink)]"
					onClick={handleShare}
					type="button"
				>
					<Share2 className="h-3.5 w-3.5" />
					{isSharing ? "Sharing..." : "Share Profile"}
				</button>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
				{[
					{
						title: "Total Solved",
						value: solvedCount,
						sub: "problems mastered",
						icon: <Trophy className="h-3.5 w-3.5 text-primary" />,
					},
					{
						title: "Streak",
						value: "12",
						sub: "days in a row",
						icon: (
							<Zap className="h-3.5 w-3.5 text-[var(--tag-intermediate-ink)]" />
						),
					},
					{
						title: "Achievements",
						value: "7",
						sub: "badges earned",
						icon: (
							<Award className="h-3.5 w-3.5 text-[var(--tag-beginner-ink)]" />
						),
					},
				].map((stat, i) => (
					<div
						className="relative rounded-[2px] border border-[var(--line)] bg-[var(--panel)] p-6"
						// biome-ignore lint/suspicious/noArrayIndexKey: stat list is static
						key={i}
					>
						<div className="flex items-center gap-2 font-mono text-[10px] text-[var(--dim)] uppercase tracking-[0.18em]">
							{stat.icon}
							{stat.title}
						</div>
						<div className="mt-4 mb-2 font-display font-extrabold text-[36px] text-[var(--ink)] leading-none">
							{stat.value}
						</div>
						<div className="font-mono text-[10px] text-[var(--sub)] uppercase tracking-[0.05em]">
							{stat.sub}
						</div>
					</div>
				))}
			</div>

			{/* Breakdown and Heatmap */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
				{/* Difficulty Breakdown */}
				<div className="rounded-[2px] border border-[var(--line)] bg-[var(--panel)] p-6 lg:col-span-4">
					<h3 className="mb-6 flex items-center gap-2 font-display font-extrabold text-[15px] text-[var(--ink)]">
						<Target className="h-4 w-4 text-primary" />
						Difficulty Breakdown
					</h3>
					<div className="space-y-6">
						{[
							{
								label: "Easy",
								count: difficultyCounts.Easy,
								total: totalCounts.Easy,
								color: "bg-[var(--tag-beginner-ink)]",
								textColor: "text-[var(--tag-beginner-ink)]",
							},
							{
								label: "Medium",
								count: difficultyCounts.Medium,
								total: totalCounts.Medium,
								color: "bg-[var(--tag-intermediate-ink)]",
								textColor: "text-[var(--tag-intermediate-ink)]",
							},
							{
								label: "Hard",
								count: difficultyCounts.Hard,
								total: totalCounts.Hard,
								color: "bg-[var(--tag-advanced-ink)]",
								textColor: "text-[var(--tag-advanced-ink)]",
							},
						].map((diff) => (
							<div className="space-y-2.5" key={diff.label}>
								<div className="flex justify-between font-mono text-[11px] uppercase tracking-[0.05em]">
									<span className={`font-semibold ${diff.textColor}`}>
										{diff.label}
									</span>
									<span className="text-[var(--ink)]">
										{diff.count} / {diff.total}
									</span>
								</div>
								<div className="h-[6px] w-full overflow-hidden rounded-[1px] bg-[var(--line)]">
									<div
										className={`h-full transition-all duration-1000 ${diff.color}`}
										style={{
											width: `${getPercentage(diff.count, diff.total)}%`,
										}}
									/>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Heatmap */}
				<div className="rounded-[2px] border border-[var(--line)] bg-[var(--panel)] p-6 lg:col-span-8">
					<h3 className="mb-6 font-display font-extrabold text-[15px] text-[var(--ink)]">
						Consistency Graph
					</h3>
					<div>
						<Heatmap data={history} />
						<div className="mt-5 flex items-center justify-end gap-2 font-mono text-[9px] text-[var(--dim)] uppercase tracking-[0.05em]">
							<span>Less</span>
							<div className="flex gap-[3px]">
								<div className="h-2.5 w-2.5 rounded-[1px] bg-[var(--line)]" />
								<div className="h-2.5 w-2.5 rounded-[1px] bg-primary/30" />
								<div className="h-2.5 w-2.5 rounded-[1px] bg-primary/60" />
								<div className="h-2.5 w-2.5 rounded-[1px] bg-primary" />
							</div>
							<span>More</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export function ProfileSkeleton() {
	return (
		<div className="space-y-10">
			<div className="flex items-center gap-6 border-[var(--line)] border-b pb-8">
				<Skeleton className="h-20 w-20 rounded-[2px] bg-[var(--line)]" />
				<div className="space-y-2">
					<Skeleton className="h-8 w-48 rounded-[2px] bg-[var(--line)]" />
					<Skeleton className="h-4 w-32 rounded-[2px] bg-[var(--line)]" />
				</div>
			</div>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
				{Array.from({ length: 3 }).map((_, i) => (
					<Skeleton
						className="h-32 rounded-[2px] bg-[var(--panel)]"
						// biome-ignore lint/suspicious/noArrayIndexKey: skeleton items are static placeholders
						key={i}
					/>
				))}
			</div>
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
				<Skeleton className="h-64 rounded-[2px] bg-[var(--panel)] lg:col-span-4" />
				<Skeleton className="h-64 rounded-[2px] bg-[var(--panel)] lg:col-span-8" />
			</div>
		</div>
	);
}
