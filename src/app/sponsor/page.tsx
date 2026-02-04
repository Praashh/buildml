import { Award, Crown, Heart, Server } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { createMetadata } from "~/lib/seo";
import { HydrateClient } from "~/trpc/server";
import { Footer } from "../_components/footer";
import { Navbar } from "../_components/navbar";
import BuyMeCoffee from "./_components/buy-me-coffee";

export const metadata = createMetadata({
	title: "Become a Sponsor",
	description:
		"Support buildml and help keep AI/ML learning accessible to everyone. Sponsors receive premium features, badges, and lifetime access.",
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
			<div className="relative flex min-h-screen flex-col bg-black">
				<Navbar />
				<div className="pointer-events-none absolute inset-0 overflow-hidden">
					<div className="absolute top-[10%] left-[20%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
					<div className="absolute right-[20%] bottom-[10%] h-[40%] w-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
				</div>
				<main className="container mx-auto max-w-5xl flex-1 px-6 pt-32 pb-20 lg:px-8">
					<div className="flex flex-col items-center gap-6">
						<h1 className="text-4xl font-bold">Become a Sponsor</h1>
					</div>
					<BuyMeCoffee />
				</main>
				<Footer />
			</div>
		</HydrateClient>
	);
}
