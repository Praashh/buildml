import Link from "next/link";
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


export default async function SponsorPage() {
	return (
		<HydrateClient>
			<div className="relative flex min-h-screen flex-col bg-[var(--background)]">
				<Navbar />

				<div className="animate-fade-in pt-[58px]">
					<div className="grid grid-cols-1 border-[var(--line)] border-b lg:grid-cols-2">
						<div className="border-[var(--line)] border-b px-6 py-16 md:px-[52px] md:py-20 lg:border-r lg:border-b-0">
							<div className="mb-4 flex items-center gap-3 text-[10px] text-[var(--dim)] uppercase tracking-[0.18em]">
								Sponsor
								<span className="h-px flex-1 bg-[var(--line)]" />
							</div>
							<h1 className="mb-6 font-display font-extrabold text-[clamp(40px,5vw,68px)] leading-[0.92] tracking-[-0.03em]">
								Support real ML
								<br />
								<span className="font-normal font-serif text-primary italic">
									education.
								</span>
							</h1>
							<p className="mb-8 text-[13px] text-[var(--sub)] leading-[1.85]">
								buildml reaches thousands of ML engineers and students who care
								deeply about fundamentals. Your company gets in front of exactly
								the people you want to hire.
							</p>
							<Link
								className="inline-block rounded-[2px] bg-primary px-6 py-[11px] font-medium font-sans text-[11px] text-white uppercase tracking-[0.07em] shadow-[0_2px_12px_rgba(200,75,31,0.25)] transition-all duration-[0.18s] hover:translate-y-[-1px] hover:opacity-88"
								href="https://x.com/10xpraash"
								target="_blank"
							>
								Get in Touch →
							</Link>
						</div>

						<div className="bg-[var(--panel)] px-6 py-16 md:px-[52px]">
							<BuyMeCoffee />
						</div>
					</div>
					<Footer />
				</div>
			</div>
		</HydrateClient>
	);
}
