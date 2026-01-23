"use client";

import { Home, Terminal } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Button } from "./ui/button";

// Matrix rain effect for the 404 page
function MatrixRain() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		const chars = "404ERROR01アイウエオカキクケコ";
		const charArray = chars.split("");
		const fontSize = 16;
		const columns = Math.floor(canvas.width / fontSize);
		const drops: number[] = [];

		for (let i = 0; i < columns; i++) {
			drops[i] = Math.random() * -100;
		}

		const draw = () => {
			ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.font = `${fontSize}px monospace`;

			for (let i = 0; i < drops.length; i++) {
				const char = charArray[Math.floor(Math.random() * charArray.length)];
				const x = i * fontSize;
				const y = drops[i]! * fontSize;

				const brightness = Math.random() * 155 + 100;
				ctx.fillStyle = `rgba(0, ${brightness}, 0, 0.8)`;
				ctx.fillText(char!, x, y);

				if (y > canvas.height && Math.random() > 0.975) {
					drops[i] = 0;
				}
				drops[i]! += 0.5;
			}
		};

		const interval = setInterval(draw, 50);

		return () => {
			clearInterval(interval);
			window.removeEventListener("resize", resizeCanvas);
		};
	}, []);

	return (
		<canvas
			className="pointer-events-none absolute inset-0 opacity-30"
			ref={canvasRef}
		/>
	);
}

// Glitch effect for the 404 text
function GlitchText({ children }: { children: React.ReactNode }) {
	return (
		<span className="relative inline-block">
			<span className="relative z-10">{children}</span>
			<span
				className="absolute top-0 left-[2px] -z-10 text-green-400 opacity-70"
				style={{
					clipPath: "polygon(0 0, 100% 0, 100% 45%, 0 45%)",
					animation: "glitch-1 2.5s infinite linear alternate-reverse",
				}}
			>
				{children}
			</span>
			<span
				className="absolute top-0 left-[-2px] -z-10 text-green-600 opacity-70"
				style={{
					clipPath: "polygon(0 55%, 100% 55%, 100% 100%, 0 100%)",
					animation: "glitch-2 3s infinite linear alternate-reverse",
				}}
			>
				{children}
			</span>
		</span>
	);
}

export default function NotFoundComponent() {
	return (
		<div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black p-4">
			{/* Matrix Rain Background */}
			<MatrixRain />

			{/* Subtle grid overlay */}
			<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

			{/* Content */}
			<div className="relative z-10 max-w-2xl text-center">
				{/* Terminal-style error header */}
				<div className="mb-8 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2">
					<Terminal className="h-4 w-4 text-green-500" />
					<span className="font-mono text-green-500 text-sm">
						ERROR_PAGE_NOT_FOUND
					</span>
				</div>

				{/* Large 404 with glitch effect */}
				<div className="mb-8">
					<h1 className="font-bold font-mono text-[8rem] text-white leading-none tracking-tighter md:text-[12rem]">
						<GlitchText>404</GlitchText>
					</h1>
				</div>

				{/* Terminal output style message */}
				<div className="mb-10 space-y-4 text-left font-mono">
					<div className="rounded-lg border border-green-500/20 bg-black/50 p-6 backdrop-blur-sm">
						<div className="mb-4 flex items-center gap-2">
							<div className="h-3 w-3 rounded-full bg-red-500" />
							<div className="h-3 w-3 rounded-full bg-yellow-500" />
							<div className="h-3 w-3 rounded-full bg-green-500" />
							<span className="ml-2 text-gray-500 text-xs">terminal</span>
						</div>
						<div className="space-y-2 text-sm">
							<p className="text-gray-500">
								<span className="text-green-500">$</span> navigate --path
								&quot;/requested-page&quot;
							</p>
							<p className="text-red-400">
								Error: The requested path does not exist.
							</p>
							<p className="text-gray-400">
								The page you&apos;re looking for has been moved, deleted, or
								never existed in the first place.
							</p>
							<p className="flex items-center gap-2 text-green-500">
								<span className="inline-block h-3 w-2 animate-pulse bg-green-500" />
								Ready for redirect...
							</p>
						</div>
					</div>
				</div>

				{/* Action Button */}
				<Link href="/">
					<Button
						className="group rounded-full bg-white px-8 py-6 font-semibold text-base text-black transition-all hover:bg-green-400 hover:shadow-green-500/20 hover:shadow-lg"
						size="lg"
					>
						<Home className="mr-2 h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
						Return Home
					</Button>
				</Link>

				{/* Decorative blinking dots */}
				<div className="mt-16 flex justify-center gap-3">
					{[...Array(5)].map((_, i) => (
						<div
							className="h-2 w-2 rounded-full bg-green-500/50"
							key={i}
							style={{
								animation: `pulse 1.5s ease-in-out ${i * 0.15}s infinite`,
							}}
						/>
					))}
				</div>
			</div>

			{/* CSS Keyframes for glitch effect */}
			<style jsx>{`
                @keyframes glitch-1 {
                    0%,
                    100% {
                        transform: translateX(0);
                    }
                    20% {
                        transform: translateX(-2px);
                    }
                    40% {
                        transform: translateX(2px);
                    }
                    60% {
                        transform: translateX(-1px);
                    }
                    80% {
                        transform: translateX(1px);
                    }
                }
                @keyframes glitch-2 {
                    0%,
                    100% {
                        transform: translateX(0);
                    }
                    25% {
                        transform: translateX(2px);
                    }
                    50% {
                        transform: translateX(-2px);
                    }
                    75% {
                        transform: translateX(1px);
                    }
                }
            `}</style>
		</div>
	);
}
