"use client";

import { Github, Twitter } from "lucide-react";
import Link from "next/link";

const socialLinks = [
	{ name: "GitHub", icon: Github, href: "https://github.com/Praashh" },
	{ name: "Twitter", icon: Twitter, href: "https://x.com/10xpraash" },
];

export function Footer() {
	return (
		<footer className="flex flex-col items-center justify-between gap-4 border-[var(--line)] border-t bg-[var(--background)] px-6 py-[18px] text-[11px] text-[var(--dim)] sm:flex-row md:px-[52px]">
			<span>© 2025 buildml — built by praash</span>
			<div className="flex items-center gap-[22px]">
				<Link
					className="font-sans text-[11px] text-[var(--dim)] transition-colors duration-[0.18s] hover:text-[var(--ink)]"
					href="/about"
				>
					About
				</Link>
				<Link
					className="font-sans text-[11px] text-[var(--dim)] transition-colors duration-[0.18s] hover:text-[var(--ink)]"
					href="/sponsor"
				>
					Sponsor
				</Link>
				{socialLinks.map((social) => (
					<Link
						aria-label={social.name}
						className="font-sans text-[11px] text-[var(--dim)] transition-colors duration-[0.18s] hover:text-[var(--ink)]"
						href={social.href}
						key={social.name}
						rel="noopener noreferrer"
						target="_blank"
					>
						{social.name} ↗
					</Link>
				))}
			</div>
		</footer>
	);
}
