import Link from "next/link";

interface CtaBlockProps {
	title: string;
	em: string;
	body: string;
	cta: string;
	href?: string;
	onClick?: string;
}

export function CtaBlock({
	title,
	em,
	body,
	cta,
	href = "/practice",
}: CtaBlockProps) {
	return (
		<div className="relative grid grid-cols-1 items-center gap-12 overflow-hidden border-[#1E1C18] border-t bg-[#100F0D] px-6 py-16 md:grid-cols-2 md:gap-20 md:px-[52px] md:py-[88px]">
			{/* Glow */}
			<div className="pointer-events-none absolute -bottom-[100px] -left-[60px] h-[350px] w-[350px] rounded-full bg-[radial-gradient(circle,rgba(200,75,31,0.12)_0%,transparent_70%)]" />

			<h2 className="font-display font-extrabold text-[#EDE9E2] text-[clamp(36px,4.5vw,58px)] leading-[0.91] tracking-[-0.03em]">
				{title}
				<br />
				<span className="font-normal font-serif text-[#E06830] italic">
					{em}
				</span>
			</h2>

			<div>
				<p className="mb-7 text-[#5A5650] text-[13px] leading-[1.85]">{body}</p>
				<Link
					className="inline-block rounded-[2px] border-none bg-[#EDE9E2] px-[26px] py-3 font-medium font-sans text-[#100F0D] text-[11px] uppercase tracking-[0.08em] transition-all duration-[0.18s] hover:translate-y-[-1px] hover:bg-[#E06830] hover:text-white"
					href={href}
				>
					{cta}
				</Link>
			</div>
		</div>
	);
}
