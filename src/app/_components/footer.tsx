"use client";

import { Github, Twitter } from "lucide-react";
import Link from "next/link";

const socialLinks = [
    { name: "GitHub", icon: Github, href: "https://github.com/Praashh" },
    { name: "Twitter", icon: Twitter, href: "https://x.com/10xpraash" },
];

export function Footer() {
    return (
        <footer className="relative border-white/10 border-t bg-black/50 py-12 backdrop-blur-xl">
            <div className="container mx-auto flex flex-col items-center gap-6 px-4">
                {/* Socials */}
                <div className="flex items-center gap-6">
                    {socialLinks.map((social) => (
                        <Link
                            aria-label={social.name}
                            className="transform text-white/40 transition-all duration-300 hover:scale-110 hover:text-yellow-400"
                            href={social.href}
                            key={social.name}
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <social.icon className="h-5 w-5" />
                        </Link>
                    ))}
                </div>

                {/* Built By */}
                <div className="space-y-2 text-center">
                    <p className="font-medium text-sm text-white/60">
                        built by{" "}
                        <span className="cursor-default text-white transition-colors hover:text-yellow-400">
                            praash and team
                        </span>
                    </p>

                    {/* Inspired By */}
                    {/* <p className="text-[10px] text-white/20 uppercase tracking-widest">
                        inspired by{" "}
                        <Link
                            className="transition-colors hover:text-white/40"
                            href="https://papercode.vercel.app/"
                            target="_blank"
                        >
                            papercode
                        </Link>
                    </p> */}
                </div>
            </div>
        </footer>
    );
}
