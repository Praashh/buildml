"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import { TerminalPreview } from "./terminal-preview";

const pills = [
	"Transformers",
	"Diffusion",
	"RL",
	"LSTMs",
	"CNNs",
	"VAEs",
	"Graphs",
];

export default function HeroSection() {
	const { data: users, isPending } = api.user.getAllUsers.useQuery();

	return (
		<section className="grid min-h-[calc(100vh-58px)] grid-cols-1 border-[var(--line)] border-b lg:grid-cols-2">
			{/* Left — Text Content */}
			<div className="relative flex flex-col justify-center overflow-hidden border-[var(--line)] border-b px-6 py-16 md:px-[52px] md:py-20 lg:border-r lg:border-b-0">
				{/* Glow */}
				<div className="pointer-events-none absolute -bottom-[120px] -left-[80px] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,var(--glow)_0%,transparent_70%)]" />

				{/* Kicker */}
				<div className="relative mb-[22px] flex items-center gap-[10px] text-[10px] text-primary uppercase tracking-[0.2em]">

					AI / ML Coding Challenges
				</div>

				{/* Title */}
				<h1 className="relative mb-[26px] font-display font-extrabold text-[clamp(44px,5.5vw,76px)] leading-[0.91] tracking-[-0.035em]">
					Code the models,
					<br />
					<span className="font-normal font-serif text-primary italic">
						from scratch.
					</span>
				</h1>

				{/* Body */}
				<p className="relative mb-9 max-w-xl text-[13px] text-[var(--sub)] leading-[1.85]">
					Implement the architectures everyone talks about but few truly
					understand. Go from paper to working code — one challenge at a time.
				</p>

				{/* CTAs */}
				<div className="relative flex flex-wrap gap-[10px]">
					<Link
						className="rounded-[2px] bg-primary px-6 py-[11px] font-medium font-sans text-[11px] text-white uppercase tracking-[0.07em] shadow-[0_2px_12px_rgba(200,75,31,0.25)] transition-all duration-[0.18s] hover:translate-y-[-1px] hover:opacity-88 hover:shadow-[0_4px_20px_rgba(200,75,31,0.35)]"
						href="/practice"
					>
						Start Building →
					</Link>
					<Link
						className="rounded-[2px] border border-[var(--line)] bg-transparent px-[22px] py-[11px] font-sans text-[11px] text-[var(--sub)] uppercase tracking-[0.07em] transition-all duration-[0.18s] hover:border-[var(--ink)] hover:text-[var(--ink)]"
						href="/leaderboard"
					>
						Leaderboard
					</Link>
				</div>

				{/* Stats */}
				<div className="relative mt-[52px] flex gap-9 border-[var(--line)] border-t pt-6">
					<div>
						<span className="block font-display font-extrabold text-[28px] text-[var(--ink)] tracking-[-0.025em]">
							{isPending ? "..." : (users ?? "2,400+")}
						</span>
						<span className="text-[10px] text-[var(--dim)] uppercase tracking-[0.1em]">
							Builders
						</span>
					</div>
					<div>
						<span className="block font-display font-extrabold text-[28px] text-[var(--ink)] tracking-[-0.025em]">
							20+
						</span>
						<span className="text-[10px] text-[var(--dim)] uppercase tracking-[0.1em]">
							Problems
						</span>
					</div>
					<div>
						<span className="block font-display font-extrabold text-[28px] text-[var(--ink)] tracking-[-0.025em]">
							500+
						</span>
						<span className="text-[10px] text-[var(--dim)] uppercase tracking-[0.1em]">
							Submissions
						</span>
					</div>
				</div>
			</div>

			{/* Right — Terminal + Pills */}
			<div className="relative flex flex-col justify-center overflow-hidden bg-[var(--panel)] px-6 py-12 md:px-[52px]">
				{/* Blue glow */}
				<div className="pointer-events-none absolute -top-[60px] -right-[60px] h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(91,130,240,0.07)_0%,transparent_70%)]" />

				<div className="relative">
					<TerminalPreview />
				</div>

				{/* Pills */}
				<div className="relative mt-[22px] flex flex-wrap gap-[6px]">
					{pills.map((pill, i) => (
						<div
							className={cn(
								"rounded-[2px] border px-3 py-[5px] font-sans text-[10px] uppercase tracking-[0.07em] transition-all duration-[0.18s]",
								i === 0
									? "cursor-pointer border-primary bg-primary/[0.07] text-primary"
									: "border-[var(--line)] bg-[var(--background)] cursor-not-allowed text-[var(--dim)] hover:border-[var(--sub)] hover:text-[var(--sub)]",
							)}
							key={pill}
						>
							{pill}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function cn(...classes: (string | boolean | undefined)[]) {
	return classes.filter(Boolean).join(" ");
}
