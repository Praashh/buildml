"use client";

export function Ticker() {
	const items = [
		"Attention is all you need",
		"No black boxes",
		"Paper to code",
		"Implement from scratch",
		"Build real intuition",
		"2400+ builders",
		"Read the paper",
		"Write the math",
		"Pass the tests",
		"Level up",
	];

	// Duplicate items for seamless infinite scroll
	const doubled = [...items, ...items];

	return (
		<div className="overflow-hidden border-[var(--line)] border-t border-b bg-[var(--panel)] py-[9px]">
			<div className="flex w-max animate-ticker gap-[52px]">
				{doubled.map((text, i) => (
					<div
						className="flex items-center gap-[14px] whitespace-nowrap text-[10px] text-[var(--dim)] uppercase tracking-[0.18em]"
						// biome-ignore lint/suspicious/noArrayIndexKey: items are static and order is stable
						key={`${text}-${i}`}
					>
						<span className="text-[7px] text-primary">◆</span>
						{text}
					</div>
				))}
			</div>
		</div>
	);
}
