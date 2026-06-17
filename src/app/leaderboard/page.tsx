import { createMetadata } from "~/lib/seo";
import { api, HydrateClient } from "~/trpc/server";
import { CtaBlock } from "../_components/cta-block";
import { Footer } from "../_components/footer";
import { Navbar } from "../_components/navbar";
import { LeaderboardClient } from "./_components/LeaderboardClient";

export const metadata = createMetadata({
	title: "Leaderboard",
	description:
		"See the top performers on buildml. Track your progress and compete with other AI/ML learners.",
	pathname: "/leaderboard",
});

export default async function LeaderboardPage() {
	// Prefetching for better initial load
	await api.user.getLeaderboard.prefetch();

	return (
		<HydrateClient>
			<div className="relative flex min-h-screen flex-col bg-[var(--background)]">
				<Navbar />

				<div className="animate-fade-in pt-[58px]">
					{/* Header */}
					<div className="grid grid-cols-1 items-end gap-8 border-[var(--line)] border-b px-6 py-14 md:grid-cols-[1fr_auto] md:gap-10 md:px-[52px] md:py-[60px]">
						<div>
							<div className="mb-0 flex items-center gap-3 text-[10px] text-[var(--dim)] uppercase tracking-[0.18em]">
								Community
								<span className="h-px flex-1 bg-[var(--line)]" />
							</div>
							<h1 className="mt-[14px] mb-3 font-display font-extrabold text-[clamp(40px,5vw,68px)] leading-[0.92] tracking-[-0.03em]">
								Top{" "}
								<span className="font-normal font-serif text-primary italic">
									Builders
								</span>
							</h1>
							<p className="max-w-[480px] text-[13px] text-[var(--sub)] leading-[1.85]">
								Ranked by total points across all solved challenges. Updated in
								real time.
							</p>
						</div>
						<div className="flex flex-shrink-0 gap-9">
							{[
								["80+", "Builders"],
								["20+", "Problems"],
								["500+", "Submissions"],
							].map(([n, l]) => (
								<div className="text-right" key={l}>
									<span className="block font-display font-extrabold text-[28px] text-[var(--ink)] tracking-[-0.025em]">
										{n}
									</span>
									<span className="text-[10px] text-[var(--dim)] uppercase tracking-[0.1em]">
										{l}
									</span>
								</div>
							))}
						</div>
					</div>

					{/* Table */}
					<div className="px-6 pb-16 md:px-[52px]">
						<LeaderboardClient />
					</div>

					<CtaBlock
						body="Start solving challenges today. Every submission earns points and every solved challenge climbs the board."
						cta="Browse Challenges →"
						em="here."
						href="/practice"
						title="Your name could be"
					/>

					<Footer />
				</div>
			</div>
		</HydrateClient>
	);
}
