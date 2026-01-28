import { createMetadata } from "~/lib/seo";
import { api, HydrateClient } from "~/trpc/server";
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
			<div className="relative flex min-h-screen flex-col bg-black">
				<Navbar />

				{/* Background effects */}
				<div className="pointer-events-none absolute inset-0 overflow-hidden">
					<div className="absolute top-[10%] left-[20%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
					<div className="absolute right-[20%] bottom-[10%] h-[40%] w-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
				</div>

				<main className="container relative z-10 mx-auto max-w-4xl flex-1 px-6 pt-32 pb-20 lg:px-8">
					<div className="mb-12 text-center">
						<h1 className="mb-4 font-black text-4xl text-white tracking-tight md:text-5xl">
							Global <span className="text-primary">Leaderboard</span>
						</h1>
						<p className="mx-auto max-w-xl text-lg text-neutral-400">
							Battle it out with the best. Solve more problems to climb the
							ranks and earn your place among the masters.
						</p>
					</div>

					<LeaderboardClient />
				</main>
				<Footer />
			</div>
		</HydrateClient>
	);
}
