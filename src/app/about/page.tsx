import Link from "next/link";
import { createMetadata } from "~/lib/seo";
import { HydrateClient } from "~/trpc/server";
import { CtaBlock } from "../_components/cta-block";
import { Footer } from "../_components/footer";
import { Navbar } from "../_components/navbar";

export const metadata = createMetadata({
	title: "About",
	description:
		"Learn about buildml - a platform for mastering AI/ML by implementing research papers from scratch. Built by praash with Next.js, TypeScript, tRPC, and Prisma.",
	pathname: "/about",
});

const faqs = [
	{
		title: "Why implementation?",
		desc: "Reading papers gives you the map. Writing the code forces you to take the journey. Bugs reveal misunderstandings that re-reading never would.",
	},
	{
		title: "Why from scratch?",
		desc: "Libraries abstract away the important parts. When you implement attention in numpy, you understand every matrix multiply. That transfers to real work.",
	},
	{
		title: "Why a leaderboard?",
		desc: "Good engineers are competitive. A public leaderboard makes progress feel real and creates a community of people who care about understanding.",
	},
	{
		title: "Open & free",
		desc: "The platform is free. Challenges are free. We're supported by sponsors who believe in better ML education, not paywalls.",
	},
];

const team = [
	{
		initial: "P",
		name: "praash",
		role: "Founder & Engineer",
		bio: "Started buildml because I wanted to learn AI/ML by implementing research papers from scratch. I’m still figuring things out, but I’m excited to build this community with you.",
	}
];

export default async function AboutPage() {
	return (
		<HydrateClient>
			<div className="relative flex min-h-screen flex-col bg-[var(--background)]">
				<Navbar />

				<div className="animate-fade-in pt-[58px]">
					{/* Split Hero */}
					<div className="grid grid-cols-1 border-[var(--line)] border-b lg:grid-cols-2">
						{/* Left — Mission */}
						<div className="border-[var(--line)] border-b px-6 py-16 md:px-[52px] md:py-20 lg:border-r lg:border-b-0">
							<div className="mb-4 flex items-center gap-3 text-[10px] text-[var(--dim)] uppercase tracking-[0.18em]">
								About buildml
								<span className="h-px flex-1 bg-[var(--line)]" />
							</div>
							<h1 className="mb-7 font-display font-extrabold text-[clamp(40px,5vw,68px)] leading-[0.92] tracking-[-0.03em]">
								Built for people who{" "}
								<span className="font-normal font-serif text-primary italic">
									actually
								</span>
								<br />
								want to learn.
							</h1>
							<p className="mb-4 text-[13px] text-[var(--sub)] leading-[1.85]">
								buildml started as a personal project by praash — frustrated
								that every ML tutorial either hand-holds through copy-paste code
								or throws you at research papers with zero scaffolding. There
								had to be a middle path.
							</p>
							<p className="mb-4 text-[13px] text-[var(--sub)] leading-[1.85]">
								The answer: implementation challenges. Read the paper, write the
								code, pass the tests. No gradients handed to you. No shortcuts.
								Real understanding.
							</p>
							<p className="mb-10 text-[13px] text-[var(--sub)] leading-[1.85]">
								Today buildml has over 2,400 builders working through 40+
								challenges spanning everything from backprop to diffusion
								models. The mission hasn't changed.
							</p>
							<div className="flex flex-wrap gap-[10px]">
								<Link
									className="rounded-[2px] bg-primary px-6 py-[11px] font-medium font-sans text-[11px] text-white uppercase tracking-[0.07em] shadow-[0_2px_12px_rgba(200,75,31,0.25)] transition-all duration-[0.18s] hover:translate-y-[-1px] hover:opacity-88"
									href="/practice"
								>
									Start Building →
								</Link>
								<Link
									className="rounded-[2px] border border-[var(--line)] bg-transparent px-[22px] py-[11px] font-sans text-[11px] text-[var(--sub)] uppercase tracking-[0.07em] transition-all duration-[0.18s] hover:border-[var(--ink)] hover:text-[var(--ink)]"
									href="/sponsor"
								>
									Sponsor the Project
								</Link>
							</div>
						</div>

						{/* Right — FAQ */}
						<div className="bg-[var(--panel)] px-6 py-16 md:px-[52px]">
							{faqs.map((faq) => (
								<div
									className="border-[var(--line)] border-b py-[22px] last:border-b-0"
									key={faq.title}
								>
									<div className="mb-[6px] font-bold font-display text-[15px] text-[var(--ink)]">
										{faq.title}
									</div>
									<p className="text-[var(--sub)] text-xs leading-[1.72]">
										{faq.desc}
									</p>
								</div>
							))}
						</div>
					</div>

					<section className="border-[var(--line)] border-b px-6 py-16 md:px-[52px] md:py-20">
						<div className="mb-8 flex items-center gap-3 text-[10px] text-[var(--dim)] uppercase tracking-[0.18em]">
							The Team
							<span className="h-px flex-1 bg-[var(--line)]" />
						</div>
						<div className="grid grid-cols-1 border-[var(--line)] border-t sm:grid-cols-3">
							{team.map((member, i) => (
								<div
									className={`px-6 py-8 md:px-8 ${i < team.length - 1 ? "border-[var(--line)] border-b sm:border-r sm:border-b-0" : ""}`}
									key={member.name}
								>
									<div className="mb-[14px] flex h-11 w-11 items-center justify-center rounded-[2px] bg-[var(--ink)] font-display font-extrabold text-[var(--background)] text-lg">
										{member.initial}
									</div>
									<div className="font-bold font-display text-[15px] text-[var(--ink)]">
										{member.name}
									</div>
									<div className="mt-1 mb-[10px] text-[10px] text-[var(--dim)] uppercase tracking-[0.08em]">
										{member.role}
									</div>
									<p className="text-[var(--sub)] text-xs leading-[1.65]">
										{member.bio}
									</p>
								</div>
							))}
						</div>
					</section>

					<CtaBlock
						body="Every challenge takes you from theory to code. The understanding that comes from debugging your own attention implementation is irreplaceable."
						cta="Pick a Challenge →"
						em="building."
						href="/practice"
						title="Stop reading. Start"
					/>

					<Footer />
				</div>
			</div>
		</HydrateClient>
	);
}
