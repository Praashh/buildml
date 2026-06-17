const steps = [
	{
		n: "01",
		title: "Read the Paper",
		desc: "Every challenge begins with the original research. No hand-holding — read the source, understand the theory.",
		chip: "Foundation",
	},
	{
		n: "02",
		title: "Implement Cold",
		desc: "Write the code from scratch in our editor. No copying, no shortcuts. Just you, numpy, and the math.",
		chip: "Practice",
	},
	{
		n: "03",
		title: "Run the Tests",
		desc: "Automated checks validate your implementation against reference outputs. Debug until it passes.",
		chip: "Verify",
	},
	{
		n: "04",
		title: "Level Up",
		desc: "Climb the leaderboard, unlock harder challenges, build a portfolio of real ML expertise.",
		chip: "Grow",
	},
];

export function StepsSection() {
	return (
		<section className="border-[var(--line)] border-b px-6 py-16 md:px-[52px] md:py-20">
			{/* Eyebrow */}
			<div className="mb-8 flex items-center gap-3 text-[10px] text-[var(--dim)] uppercase tracking-[0.18em]">
				The Journey
				<span className="h-px flex-1 bg-[var(--line)]" />
			</div>

			{/* Header */}
			<div className="mb-[52px] grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-12">
				<h2 className="font-display font-extrabold text-[clamp(28px,3.5vw,46px)] leading-[0.93] tracking-[-0.025em]">
					From paper
					<br />
					to production.
				</h2>
				<p className="text-[13px] text-[var(--sub)] leading-[1.85]">
					Most people use models without understanding how they work. buildml
					changes that — by forcing you to write every line yourself, you build
					genuine intuition no tutorial can give you.
				</p>
			</div>

			{/* Steps Grid */}
			<div className="grid grid-cols-1 border border-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
				{steps.map((step, i) => (
					<div
						className={`group px-7 py-9 transition-colors duration-[0.18s] hover:bg-[var(--panel)] ${i < steps.length - 1 ? "border-[var(--line)] border-b sm:border-r" : ""} ${i === 1 ? "sm:border-r-0 lg:border-r" : ""} ${i === 2 ? "border-[var(--line)] sm:border-r sm:border-b lg:border-b-0" : ""} ${i === 3 ? "border-r-0 sm:border-b-0" : ""}`}
						key={step.n}
					>
						<div className="mb-5 font-display font-extrabold text-[52px] text-[var(--line)] leading-none tracking-[-0.04em] transition-colors duration-[0.18s] group-hover:text-primary">
							{step.n}
						</div>
						<div className="mb-2 font-bold font-display text-[var(--ink)] text-base">
							{step.title}
						</div>
						<p className="text-[var(--sub)] text-xs leading-[1.7]">
							{step.desc}
						</p>
						<div className="mt-[18px] inline-block rounded-[2px] border border-[var(--line)] px-2 py-[3px] text-[9px] text-[var(--dim)] uppercase tracking-[0.1em]">
							{step.chip}
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
