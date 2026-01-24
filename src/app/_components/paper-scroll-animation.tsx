"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

function ReaderAnimation() {
	return (
		<div className="relative flex h-20 w-full flex-col items-center justify-center sm:h-24">
			<div className="relative h-16 w-12 rounded border border-yellow-500/30 bg-gray-900/80 sm:h-20 sm:w-16">
				<div className="space-y-1 p-1.5 sm:space-y-1.5 sm:p-2">
					{[0.7, 1, 0.85, 1, 0.6, 0.9, 0.75].map((width, i) => (
						<div
							className="h-0.5 rounded-full bg-yellow-500/20 sm:h-1"
							key={i}
							style={{ width: `${width * 100}%` }}
						/>
					))}
				</div>
				<motion.div
					animate={{ top: ["6px", "52px", "6px"] }}
					className="absolute right-1 left-1 h-1.5 rounded-sm bg-yellow-400/30 sm:h-2"
					transition={{
						duration: 2.5,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
					}}
				/>
				<motion.div
					animate={{ opacity: [0.4, 1, 0.4] }}
					className="absolute top-1/2 -right-2.5 -translate-y-1/2 sm:-right-3"
					transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
				>
					<svg
						className="h-3 w-3 text-yellow-400 sm:h-4 sm:w-4"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						viewBox="0 0 24 24"
					>
						<path
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</motion.div>
			</div>
		</div>
	);
}

function TyperAnimation() {
	const codeLines = ["def attention:", "  Q @ K.T", "  / sqrt(d)"];

	return (
		<div className="relative flex h-20 w-full flex-col items-center justify-center sm:h-24">
			<div className="w-full max-w-35 rounded-lg border border-yellow-500/30 bg-gray-950/90 p-2 sm:max-w-45 sm:p-3">
				<div className="mb-1.5 flex gap-1 sm:mb-2 sm:gap-1.5">
					<div className="h-1.5 w-1.5 rounded-full bg-red-500/70 sm:h-2 sm:w-2" />
					<div className="h-1.5 w-1.5 rounded-full bg-yellow-500/70 sm:h-2 sm:w-2" />
					<div className="h-1.5 w-1.5 rounded-full bg-amber-500/70 sm:h-2 sm:w-2" />
				</div>
				<div className="space-y-0.5 font-mono text-[8px] sm:space-y-1 sm:text-[10px]">
					{codeLines.map((line, lineIndex) => (
						<div className="flex items-center" key={lineIndex}>
							<motion.span
								animate={{ opacity: 1 }}
								className="text-yellow-400"
								initial={{ opacity: 0 }}
								transition={{ delay: lineIndex * 0.8, duration: 0.3 }}
							>
								{line.split("").map((char, charIndex) => (
									<motion.span
										animate={{ opacity: 1 }}
										initial={{ opacity: 0 }}
										key={charIndex}
										transition={{
											delay: lineIndex * 0.8 + charIndex * 0.05,
											duration: 0.05,
											repeat: Number.POSITIVE_INFINITY,
											repeatDelay: 3,
										}}
									>
										{char}
									</motion.span>
								))}
							</motion.span>
						</div>
					))}
				</div>
				<motion.span
					animate={{ opacity: [1, 0, 1] }}
					className="ml-0.5 inline-block h-2 w-0.5 bg-yellow-400 sm:ml-1 sm:h-2.5 sm:w-1"
					transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
				/>
			</div>
		</div>
	);
}

function TesterAnimation() {
	const tests = [
		{ name: "unit", delay: 0 },
		{ name: "intg", delay: 0.6 },
		{ name: "e2e", delay: 1.2 },
	];

	return (
		<div className="relative flex h-20 w-full flex-col items-center justify-center sm:h-24">
			<div className="w-full max-w-35 space-y-1.5 sm:max-w-45 sm:space-y-2">
				{tests.map((test) => (
					<div className="flex items-center gap-1.5 sm:gap-2" key={test.name}>
						<motion.div
							animate={{
								backgroundColor: [
									"transparent",
									"rgb(234 179 8 / 0.3)",
									"rgb(234 179 8 / 0.3)",
								],
								borderColor: [
									"rgb(34 197 94 / 0.5)",
									"rgb(234 179 8)",
									"rgb(234 179 8)",
								],
							}}
							className="flex h-3 w-3 items-center justify-center rounded-full border border-yellow-500/50 sm:h-4 sm:w-4"
							transition={{
								duration: 2,
								repeat: Number.POSITIVE_INFINITY,
								delay: test.delay,
								times: [0, 0.4, 1],
							}}
						>
							<motion.svg
								className="h-1.5 w-1.5 sm:h-2 sm:w-2"
								fill="none"
								stroke="rgb(234 179 8)"
								strokeWidth="3"
								viewBox="0 0 24 24"
							>
								<motion.path
									animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 1] }}
									d="M5 13l4 4L19 7"
									initial={{ pathLength: 0, opacity: 0 }}
									strokeLinecap="round"
									strokeLinejoin="round"
									transition={{
										duration: 2,
										repeat: Number.POSITIVE_INFINITY,
										delay: test.delay,
										times: [0, 0.4, 1],
									}}
								/>
							</motion.svg>
						</motion.div>
						<div className="flex-1">
							<div className="h-1.5 overflow-hidden rounded-full bg-gray-800 sm:h-2">
								<motion.div
									animate={{ width: ["0%", "100%", "100%"] }}
									className="h-full rounded-full bg-linear-to-r from-amber-600 to-yellow-400"
									initial={{ width: "0%" }}
									transition={{
										duration: 2,
										repeat: Number.POSITIVE_INFINITY,
										delay: test.delay,
										times: [0, 0.35, 1],
										ease: "easeOut",
									}}
								/>
							</div>
						</div>
						<motion.span
							animate={{ opacity: [0, 0, 1, 1] }}
							className="font-bold font-mono text-[7px] text-yellow-400 sm:text-[9px]"
							initial={{ opacity: 0 }}
							transition={{
								duration: 2,
								repeat: Number.POSITIVE_INFINITY,
								delay: test.delay,
								times: [0, 0.35, 0.4, 1],
							}}
						>
							PASS
						</motion.span>
					</div>
				))}
			</div>
		</div>
	);
}

function Paper({
	scale = 1,
	rotate = 0,
	translateX = 0,
	opacity = 1,
	zIndex = 0,
}: {
	scale?: number;
	rotate?: number;
	translateX?: number;
	opacity?: number;
	zIndex?: number;
}) {
	return (
		<motion.div
			className="absolute top-1/2 left-1/2 aspect-4/5 w-[clamp(180px,45vw,320px)] -translate-x-1/2 rounded-xl border border-yellow-500/20 bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 p-3 shadow-2xl shadow-yellow-500/5 sm:rounded-2xl sm:p-4 md:p-6"
			style={{
				x: translateX,
				y: "-50%",
				scale,
				rotate,
				opacity,
				zIndex,
			}}
		>
			<div className="space-y-1.5 sm:space-y-2 md:space-y-3">
				<div className="h-1.5 w-3/4 rounded bg-yellow-500/20 sm:h-2 md:h-3" />
				<div className="h-1.5 w-full rounded bg-yellow-500/10 sm:h-2 md:h-3" />
				<div className="h-1.5 w-5/6 rounded bg-yellow-500/10 sm:h-2 md:h-3" />
				<div className="h-1.5 w-full rounded bg-yellow-500/10 sm:h-2 md:h-3" />
				<div className="h-1.5 w-4/5 rounded bg-yellow-500/10 sm:h-2 md:h-3" />
				<div className="h-1.5 w-full rounded bg-yellow-500/10 sm:h-2 md:h-3" />
				<div className="h-1.5 w-3/4 rounded bg-yellow-500/10 sm:h-2 md:h-3" />
				<div className="h-1.5 w-5/6 rounded bg-yellow-500/10 sm:h-2 md:h-3" />
				<div className="h-1.5 w-full rounded bg-yellow-500/10 sm:h-2 md:h-3" />
				<div className="h-1.5 w-4/5 rounded bg-yellow-500/10 sm:h-2 md:h-3" />
			</div>

			<div className="absolute right-3 bottom-3 left-3 sm:right-4 sm:bottom-4 sm:left-4 md:right-6 md:bottom-6 md:left-6">
				<div className="rounded-md border border-yellow-500/20 bg-gray-950/80 px-2 py-1.5 font-mono text-[10px] text-yellow-400 sm:rounded-lg sm:px-3 sm:py-2 sm:text-xs md:px-4 md:py-3 md:text-sm">
					∑ log P(x_t | x_&lt;t)
				</div>
			</div>
		</motion.div>
	);
}

function AnimatedStepCard({
	type,
	opacity = 1,
}: {
	type: "read" | "code" | "test";
	opacity?: number;
}) {
	return (
		<motion.div
			className="relative flex h-32.5 w-40 flex-col items-center justify-center rounded-xl border border-yellow-500/30 bg-linear-to-br from-gray-950 via-gray-900/95 to-gray-950 px-2 py-3 shadow-2xl shadow-yellow-500/10 sm:h-40 sm:w-50 sm:rounded-2xl sm:px-3 sm:py-4 md:h-50 md:w-65 md:px-4 md:py-6"
			style={{ opacity }}
			transition={{ duration: 0.2 }}
			whileHover={{ scale: 1.03, borderColor: "rgb(234 179 8 / 0.5)" }}
		>
			{type === "read" && <ReaderAnimation />}
			{type === "code" && <TyperAnimation />}
			{type === "test" && <TesterAnimation />}
			<div className="pointer-events-none absolute -inset-px rounded-xl bg-linear-to-br from-yellow-500/10 via-transparent to-yellow-500/5 sm:rounded-2xl" />
		</motion.div>
	);
}

export default function PaperScrollAnimation() {
	const containerRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start start", "end end"],
	});

	// Transform values for different animation phases
	// Phase 1 (0-0.3): Single paper visible
	// Phase 2 (0.3-0.5): Split into 3 papers
	// Phase 3 (0.5-1.0): Transform to cards

	// Paper 1 (left) - responsive values (smaller on mobile)
	const paper1TranslateX = useTransform(
		scrollYProgress,
		[0, 0.3, 0.5],
		[0, -120, -150],
	);
	const paper1Rotate = useTransform(
		scrollYProgress,
		[0, 0.3, 0.5],
		[0, -10, -6],
	);
	const paper1Scale = useTransform(
		scrollYProgress,
		[0.3, 0.5, 0.6],
		[0.9, 0.8, 0.65],
	);

	// Paper 2 (center)
	const paper2Scale = useTransform(
		scrollYProgress,
		[0.3, 0.5, 0.6],
		[1, 0.85, 0.65],
	);

	// Paper 3 (right)
	const paper3TranslateX = useTransform(
		scrollYProgress,
		[0, 0.3, 0.5],
		[0, 120, 150],
	);
	const paper3Rotate = useTransform(scrollYProgress, [0, 0.3, 0.5], [0, 10, 6]);
	const paper3Scale = useTransform(
		scrollYProgress,
		[0.3, 0.5, 0.6],
		[0.9, 0.8, 0.65],
	);

	// Opacity transitions
	const papersOpacity = useTransform(scrollYProgress, [0.5, 0.6], [1, 0]);
	const cardsOpacity = useTransform(scrollYProgress, [0.5, 0.65], [0, 1]);

	const cardTypes: ("read" | "code" | "test")[] = ["read", "code", "test"];

	return (
		<section className="relative h-[300vh] bg-black" ref={containerRef}>
			<div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-2 sm:px-4">
				{/* Background grid - gold themed */}
				<div className="absolute inset-0 bg-[linear-gradient(rgba(234,179,8,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(234,179,8,0.03)_1px,transparent_1px)] bg-size-[30px_30px] sm:bg-size-[50px_50px]" />

				{/* Papers container */}
				<motion.div
					className="relative h-80 w-full max-w-5xl sm:h-100 md:h-125"
					style={{ opacity: papersOpacity }}
				>
					{/* Back papers (shadows) */}
					<motion.div
						className="absolute top-1/2 left-1/2"
						style={{
							x: paper3TranslateX,
							rotate: paper3Rotate,
							scale: paper3Scale,
						}}
					>
						<Paper
							opacity={0.6}
							rotate={0}
							scale={1}
							translateX={0}
							zIndex={1}
						/>
					</motion.div>

					<motion.div
						className="absolute top-1/2 left-1/2"
						style={{
							x: 0,
							scale: paper2Scale,
						}}
					>
						<Paper
							opacity={0.8}
							rotate={0}
							scale={1}
							translateX={0}
							zIndex={2}
						/>
					</motion.div>

					<motion.div
						className="absolute top-1/2 left-1/2"
						style={{
							x: paper1TranslateX,
							rotate: paper1Rotate,
							scale: paper1Scale,
						}}
					>
						<Paper opacity={1} rotate={0} scale={1} translateX={0} zIndex={3} />
					</motion.div>
				</motion.div>

				{/* Animated Cards container - responsive layout with vertical stacking on mobile */}
				<motion.div
					className="absolute flex flex-col items-center gap-3 sm:flex-row sm:gap-4 md:gap-8"
					style={{ opacity: cardsOpacity }}
				>
					{cardTypes.map((type) => (
						<motion.div key={type}>
							<AnimatedStepCard opacity={1} type={type} />
						</motion.div>
					))}
				</motion.div>

				{/* Section title - responsive positioning and sizing */}
				<motion.div
					className="absolute top-8 px-4 text-center sm:top-12 md:top-20"
					initial={{ opacity: 0, y: 20 }}
					transition={{ duration: 0.5 }}
					whileInView={{ opacity: 1, y: 0 }}
				>
					<h2 className="font-bold text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl">
						The Journey
					</h2>
					<p className="mt-1.5 text-gray-400 text-xs sm:mt-2 sm:text-sm md:text-base">
						From paper to production, one step at a time
					</p>
				</motion.div>
			</div>
		</section>
	);
}
