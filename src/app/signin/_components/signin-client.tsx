"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";

function GoogleIcon() {
    return (
        <svg
            aria-hidden="true"
            height="18"
            viewBox="0 0 18 18"
            width="18"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.701-1.567 2.684-3.874 2.684-6.615z"
                fill="#4285F4"
            />
            <path
                d="M9 18c2.43 0 4.467-.806 5.956-2.184L12.048 13.56c-.829.554-1.89.883-3.048.883-2.345 0-4.328-1.583-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
                fill="#34A853"
            />
            <path
                d="M3.964 10.732c-.18-.54-.282-1.117-.282-1.732s.102-1.192.282-1.732V4.936H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.064l3.007-3.332z"
                fill="#FBBC05"
            />
            <path
                d="M9 3.556c1.32 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.48 0 2.443 2.041.957 4.936l3.007 2.332C4.672 5.139 6.655 3.556 9 3.556z"
                fill="#EA4335"
            />
        </svg>
    );
}

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

                // Consistent with gold/amber theme
                const brightness = Math.random() * 155 + 100;
                ctx.fillStyle = `rgba(${brightness}, ${brightness * 0.8}, 0, 0.4)`;
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
            className="pointer-events-none absolute inset-0 opacity-20"
            ref={canvasRef}
        />
    );
}

export function SignInClient() {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black font-sans">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.1),transparent_70%)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-yellow-500/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-yellow-500/10 to-transparent" />

            <MatrixRain />

            <div className="relative z-10 w-full max-w-md px-6">
                <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link
                        className="group mb-8 inline-flex items-center text-gray-400 text-sm transition-colors hover:text-white"
                        href="/"
                    >
                        <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back to home
                    </Link>

                    <Card className="border-white/10 bg-gray-950/50 shadow-2xl backdrop-blur-xl">
                        <CardHeader className="space-y-4 text-center">
                            <div className="mx-auto flex h-12 w-12 rotate-3 items-center justify-center rounded-xl bg-linear-to-br from-yellow-400 to-amber-600 shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-transform hover:rotate-0">
                                <span className="font-black text-black text-xl">ML</span>
                            </div>
                            <div className="space-y-2">
                                <CardTitle className="font-bold text-2xl text-white tracking-tight">
                                    Welcome back
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    Login to continue building AI models from scratch
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-6 py-6">
                            <Button
                                className="relative h-12 w-full overflow-hidden border-white/5 bg-white text-black transition-all hover:bg-gray-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98]"
                                disabled={isLoading}
                                onClick={() => {
                                    setIsLoading(true);
                                    signIn("google", { callbackUrl: "/" });
                                }}
                                variant="outline"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <Loader2 className="animate-spin text-white" />
                                        <span className="font-semibold text-white">Loading...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-3">
                                        <GoogleIcon />
                                        <span className="font-semibold text-white">Continue with Google</span>
                                    </div>
                                )}
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-white/5 border-t" />
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                                    <span className="bg-gray-950 px-2 text-gray-500">
                                        Secure Authentication
                                    </span>
                                </div>
                            </div>

                            <p className="px-8 text-center text-gray-500 text-xs leading-relaxed">
                                By clicking continue, you agree to our terms and privacy policy.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.p
                    animate={{ opacity: 1 }}
                    className="mt-8 text-center text-gray-600 text-[10px] uppercase tracking-widest"
                    initial={{ opacity: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    &copy; {new Date().getFullYear()} buildml. Engineering excellence in AI.
                </motion.p>
            </div>
        </div>
    );
}
