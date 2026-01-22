"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Reader Animation - Document with scanning highlight
function ReaderAnimation() {
    return (
        <div className="relative flex h-24 w-full flex-col items-center justify-center">
            {/* Document */}
            <div className="relative h-20 w-16 rounded border border-green-500/30 bg-gray-900/80">
                {/* Text lines */}
                <div className="space-y-1.5 p-2">
                    {[0.7, 1, 0.85, 1, 0.6, 0.9, 0.75].map((width, i) => (
                        <div
                            key={i}
                            className="h-1 rounded-full bg-green-500/20"
                            style={{ width: `${width * 100}%` }}
                        />
                    ))}
                </div>
                {/* Scanning highlight line */}
                <motion.div
                    className="absolute left-1 right-1 h-2 rounded-sm bg-green-400/30"
                    animate={{ top: ["8px", "64px", "8px"] }}
                    transition={{
                        duration: 2.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                />
                {/* Eye icon scanning effect */}
                <motion.div
                    className="absolute -right-3 top-1/2 -translate-y-1/2"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                >
                    <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </motion.div>
            </div>
        </div>
    );
}

// Typer Animation - Typewriter effect with code
function TyperAnimation() {
    const codeLines = ["def attention:", "  Q @ K.T", "  / sqrt(d)"];

    return (
        <div className="relative flex h-24 w-full flex-col items-center justify-center">
            {/* Terminal window */}
            <div className="w-full max-w-[180px] rounded-lg border border-green-500/30 bg-gray-950/90 p-3">
                {/* Terminal header */}
                <div className="mb-2 flex gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-red-500/70" />
                    <div className="h-2 w-2 rounded-full bg-yellow-500/70" />
                    <div className="h-2 w-2 rounded-full bg-green-500/70" />
                </div>
                {/* Code with typewriter effect */}
                <div className="space-y-1 font-mono text-[10px]">
                    {codeLines.map((line, lineIndex) => (
                        <div key={lineIndex} className="flex items-center">
                            <motion.span
                                className="text-green-400"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: lineIndex * 0.8, duration: 0.3 }}
                            >
                                {line.split("").map((char, charIndex) => (
                                    <motion.span
                                        key={charIndex}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
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
                {/* Blinking cursor */}
                <motion.span
                    className="ml-1 inline-block h-2.5 w-1 bg-green-400"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
                />
            </div>
        </div>
    );
}

// Tester Animation - Progress bars with checkmarks
function TesterAnimation() {
    const tests = [
        { name: "unit", delay: 0 },
        { name: "intg", delay: 0.6 },
        { name: "e2e", delay: 1.2 },
    ];

    return (
        <div className="relative flex h-24 w-full flex-col items-center justify-center">
            <div className="w-full max-w-[180px] space-y-2">
                {tests.map((test, i) => (
                    <div key={test.name} className="flex items-center gap-2">
                        {/* Checkmark circle */}
                        <motion.div
                            className="flex h-4 w-4 items-center justify-center rounded-full border border-green-500/50"
                            animate={{
                                backgroundColor: ["transparent", "rgb(34 197 94 / 0.3)", "rgb(34 197 94 / 0.3)"],
                                borderColor: ["rgb(34 197 94 / 0.5)", "rgb(34 197 94)", "rgb(34 197 94)"],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                delay: test.delay,
                                times: [0, 0.4, 1],
                            }}
                        >
                            <motion.svg
                                viewBox="0 0 24 24"
                                className="h-2 w-2"
                                fill="none"
                                stroke="rgb(34 197 94)"
                                strokeWidth="3"
                            >
                                <motion.path
                                    d="M5 13l4 4L19 7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 1] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Number.POSITIVE_INFINITY,
                                        delay: test.delay,
                                        times: [0, 0.4, 1],
                                    }}
                                />
                            </motion.svg>
                        </motion.div>
                        {/* Progress bar container */}
                        <div className="flex-1">
                            <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                                <motion.div
                                    className="h-full rounded-full bg-linear-to-r from-green-600 to-green-400"
                                    initial={{ width: "0%" }}
                                    animate={{ width: ["0%", "100%", "100%"] }}
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
                        {/* PASS label */}
                        <motion.span
                            className="font-mono text-[9px] font-bold text-green-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0, 1, 1] }}
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

// Paper component with text lines - themed
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
            className="absolute left-1/2 top-1/2 h-[400px] w-[320px] rounded-2xl border border-green-500/20 bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 p-6 shadow-2xl shadow-green-500/5"
            style={{
                x: translateX,
                y: "-50%",
                marginLeft: "-160px",
                scale,
                rotate,
                opacity,
                zIndex,
            }}
        >
            {/* Text lines with green theme */}
            <div className="space-y-3">
                <div className="h-3 w-3/4 rounded bg-green-500/20" />
                <div className="h-3 w-full rounded bg-green-500/10" />
                <div className="h-3 w-5/6 rounded bg-green-500/10" />
                <div className="h-3 w-full rounded bg-green-500/10" />
                <div className="h-3 w-4/5 rounded bg-green-500/10" />
                <div className="h-3 w-full rounded bg-green-500/10" />
                <div className="h-3 w-3/4 rounded bg-green-500/10" />
                <div className="h-3 w-5/6 rounded bg-green-500/10" />
                <div className="h-3 w-full rounded bg-green-500/10" />
                <div className="h-3 w-4/5 rounded bg-green-500/10" />
            </div>

            {/* Formula at bottom - themed */}
            <div className="absolute bottom-6 left-6 right-6">
                <div className="rounded-lg border border-green-500/20 bg-gray-950/80 px-4 py-3 font-mono text-sm text-green-400">
                    ∑ log P(x_t | x_&lt;t)
                </div>
            </div>
        </motion.div>
    );
}

// Animated Card component for the final state
function AnimatedStepCard({
    type,
    opacity = 1,
}: {
    type: "read" | "code" | "test";
    opacity?: number;
}) {
    return (
        <motion.div
            className="relative flex h-[200px] w-[260px] flex-col items-center justify-center rounded-2xl border border-green-500/30 bg-linear-to-br from-gray-950 via-gray-900/95 to-gray-950 px-4 py-6 shadow-2xl shadow-green-500/10"
            style={{ opacity }}
            whileHover={{ scale: 1.03, borderColor: "rgb(34 197 94 / 0.5)" }}
            transition={{ duration: 0.2 }}
        >
            {/* Animation based on type */}
            {type === "read" && <ReaderAnimation />}
            {type === "code" && <TyperAnimation />}
            {type === "test" && <TesterAnimation />}

            {/* Subtle corner glow */}
            <div className="pointer-events-none absolute -inset-px rounded-2xl bg-linear-to-br from-green-500/10 via-transparent to-green-500/5" />
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
    // Phase 3 (0.5-1.0): Transform to cards (removed stepper phase)

    // Paper 1 (left)
    const paper1TranslateX = useTransform(
        scrollYProgress,
        [0, 0.3, 0.5],
        [0, -300, -350]
    );
    const paper1Rotate = useTransform(
        scrollYProgress,
        [0, 0.3, 0.5],
        [0, -15, -10]
    );
    const paper1Scale = useTransform(
        scrollYProgress,
        [0.3, 0.5, 0.6],
        [0.9, 0.8, 0.65]
    );

    // Paper 2 (center)
    const paper2Scale = useTransform(
        scrollYProgress,
        [0.3, 0.5, 0.6],
        [1, 0.85, 0.65]
    );

    // Paper 3 (right)
    const paper3TranslateX = useTransform(
        scrollYProgress,
        [0, 0.3, 0.5],
        [0, 300, 350]
    );
    const paper3Rotate = useTransform(
        scrollYProgress,
        [0, 0.3, 0.5],
        [0, 15, 10]
    );
    const paper3Scale = useTransform(
        scrollYProgress,
        [0.3, 0.5, 0.6],
        [0.9, 0.8, 0.65]
    );

    // Opacity transitions
    const papersOpacity = useTransform(
        scrollYProgress,
        [0.5, 0.6],
        [1, 0]
    );
    const cardsOpacity = useTransform(
        scrollYProgress,
        [0.5, 0.65],
        [0, 1]
    );

    const cardTypes: ("read" | "code" | "test")[] = ["read", "code", "test"];

    return (
        <section
            ref={containerRef}
            className="relative h-[300vh] bg-black"
        >
            <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
                {/* Background grid - green themed */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-size-[50px_50px]" />

                {/* Papers container */}
                <motion.div
                    className="relative h-[500px] w-full max-w-5xl"
                    style={{ opacity: papersOpacity }}
                >
                    {/* Back papers (shadows) */}
                    <motion.div
                        className="absolute left-1/2 top-1/2"
                        style={{
                            x: paper3TranslateX,
                            rotate: paper3Rotate,
                            scale: paper3Scale,
                        }}
                    >
                        <Paper
                            translateX={0}
                            rotate={0}
                            scale={1}
                            opacity={0.6}
                            zIndex={1}
                        />
                    </motion.div>

                    <motion.div
                        className="absolute left-1/2 top-1/2"
                        style={{
                            x: 0,
                            scale: paper2Scale,
                        }}
                    >
                        <Paper
                            translateX={0}
                            rotate={0}
                            scale={1}
                            opacity={0.8}
                            zIndex={2}
                        />
                    </motion.div>

                    <motion.div
                        className="absolute left-1/2 top-1/2"
                        style={{
                            x: paper1TranslateX,
                            rotate: paper1Rotate,
                            scale: paper1Scale,
                        }}
                    >
                        <Paper
                            translateX={0}
                            rotate={0}
                            scale={1}
                            opacity={1}
                            zIndex={3}
                        />
                    </motion.div>
                </motion.div>

                {/* Animated Cards container - no text, only animations */}
                <motion.div
                    className="absolute flex gap-8"
                    style={{ opacity: cardsOpacity }}
                >
                    {cardTypes.map((type) => (
                        <motion.div key={type}>
                            <AnimatedStepCard type={type} opacity={1} />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Section title */}
                <motion.div
                    className="absolute top-20 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl font-bold text-white md:text-4xl">
                        The Journey
                    </h2>
                    <p className="mt-2 text-gray-400">
                        From paper to production, one step at a time
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
