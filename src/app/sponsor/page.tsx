import { Award, Crown, Heart, Server } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { createMetadata } from "~/lib/seo";
import { HydrateClient } from "~/trpc/server";
import { Footer } from "../_components/footer";
import { Navbar } from "../_components/navbar";

export const metadata = createMetadata({
	title: "Become a Sponsor",
	description:
		"Support 100xPractice and help keep AI/ML learning accessible to everyone. Sponsors receive premium features, badges, and lifetime access.",
	pathname: "/sponsor",
});

const benefits = [
	{
		title: "Premium for Life",
		description:
			"Early sponsors become premium members for life when we launch premium features",
		icon: Crown,
	},
	{
		title: "Keep Servers Running",
		description:
			"Your support helps cover hosting costs, database infrastructure, and API services",
		icon: Server,
		highlighted: true,
	},
	{
		title: "Sponsor Badge",
		description:
			"Get a special sponsor badge on your profile and leaderboard entries",
		icon: Award,
	},
];

export default async function SponsorPage() {
	return (
		<HydrateClient>
			<div className="relative flex min-h-screen flex-col">
				<Navbar />

				<main className="container mx-auto max-w-5xl flex-1 px-6 pt-32 pb-20 lg:px-8">
					{/* Back Button */}
					<Link
						className="mb-8 inline-flex items-center gap-2 text-white/60 transition-colors hover:text-white"
						href="/"
					>
						<span>←</span>
						<span>Back to Home</span>
					</Link>

					{/* Support Badge */}
					<div className="mb-8 flex justify-center">
						<div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2">
							<Heart className="h-4 w-4 fill-green-400 text-green-400" />
							<span className="font-semibold text-green-400 text-sm">
								Support 100xPractice
							</span>
						</div>
					</div>

					{/* Header Section */}
					<div className="mb-12 text-center">
						<h1 className="mb-6 bg-linear-to-r from-green-400 to-emerald-500 bg-clip-text font-bold text-5xl text-transparent md:text-6xl">
							Become a Sponsor
						</h1>
						<p className="mx-auto max-w-2xl text-lg text-white/60 leading-relaxed">
							Help keep 100xPractice running and accessible to everyone. Your
							support covers server costs, infrastructure, and enables us to add
							more papers and features.
						</p>
					</div>

					{/* Benefits Grid */}
					<div className="mb-20 grid grid-cols-1 gap-6 md:grid-cols-3">
						{benefits.map((benefit) => (
							<div
								className={`rounded-lg bg-white/5 p-6 ${
									benefit.highlighted
										? "border-2 border-green-500/50"
										: "border border-white/10"
								}`}
								key={benefit.title}
							>
								<div
									className={`mb-4 inline-flex rounded-lg p-3 ${
										benefit.highlighted ? "bg-green-500/20" : "bg-white/5"
									}`}
								>
									<benefit.icon
										className={`h-6 w-6 ${
											benefit.highlighted ? "text-green-400" : "text-white/60"
										}`}
									/>
								</div>

								<h3 className="mb-2 font-bold text-white text-xl">
									{benefit.title}
								</h3>

								<p className="text-sm text-white/60 leading-relaxed">
									{benefit.description}
								</p>
							</div>
						))}
					</div>

					{/* CTA Button */}
					<div className="mb-20 flex justify-center">
						<Button className="bg-linear-to-r from-green-400 to-emerald-500 px-8 py-6 font-semibold text-black text-lg hover:from-green-500 hover:to-emerald-600">
							Sponsor on GitHub
						</Button>
					</div>

					{/* Our Amazing Sponsors Section */}
					<div className="border-white/10 border-t pt-12">
						<div className="mb-6 flex items-center gap-3">
							<Heart className="h-5 w-5 fill-green-400 text-green-400" />
							<h2 className="font-bold text-2xl text-white">
								Our Amazing Sponsors
							</h2>
						</div>
						<p className="text-white/60">
							Thank you to everyone who supports 100xPractice
						</p>
					</div>
				</main>

				<Footer />
			</div>
		</HydrateClient>
	);
}
