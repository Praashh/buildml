"use client";

import { Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { NeuralNetwork } from "./neural-network";

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

		const chars =
			"アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";
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

				// Varying gold/amber shades for depth
				const brightness = Math.random() * 155 + 100;
				ctx.fillStyle = `rgba(${brightness}, ${brightness * 0.8}, 0, 0.8)`;
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
			className="pointer-events-none absolute inset-0 opacity-40"
			ref={canvasRef}
		/>
	);
}

export default function RainingLetters() {
	const { data: users, isPending } = api.user.getAllUsers.useQuery();

	return (
		<section className="relative flex min-h-[calc(100vh-80px)] items-center overflow-hidden bg-black">
			{/* Background Effects */}
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.05),transparent_50%)]" />
			<div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-yellow-500/20 to-transparent" />

			{/* Matrix Rain Background */}
			<MatrixRain />

			{/* Content */}
			<div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
				<div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-2">
					{/* Left side - Text content */}
					<div className="space-y-8">
						<h1 className="font-bold text-5xl text-white leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
							Don't just read
							<br />
							the paper.
							<br />
							<span className="font-mono text-yellow-500">Compile it.</span>
						</h1>

						<p className="max-w-md text-base text-gray-400 md:text-lg">
							Bridge the gap between theory and reality. Implement
							state-of-the-art models{" "}
							<span className="font-mono font-semibold text-white">
								from scratch
							</span>
							, line by line.
						</p>

						<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
							<Button
								asChild
								className="w-fit rounded-full bg-white px-8 py-6 font-semibold text-base text-black transition-all hover:bg-yellow-500 hover:shadow-[0_0_20px_rgba(234,179,8,0.5)]"
								size="lg"
							>
								<Link href="/practice">Start Coding</Link>
							</Button>
						</div>

						<div className="flex items-center gap-2 text-gray-500">
							<Users className="h-4 w-4" />
							<span className="text-sm">
								<span className="font-semibold text-yellow-500">
									{isPending ? "Loading..." : users}
								</span>{" "}
								people coding now
							</span>
						</div>
					</div>

					{/* Right side - Neural Network */}
					<div className="relative hidden h-112.5 w-full lg:block">
						<NeuralNetwork />
					</div>
				</div>
			</div>
		</section >
	);
}
