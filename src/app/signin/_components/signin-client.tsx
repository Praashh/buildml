"use client";

import { MotionConfig, motion } from "framer-motion";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";

function GoogleIcon() {
	return (
		<svg
			aria-hidden="true"
			height="14"
			viewBox="0 0 18 18"
			width="14"
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

export function SignInClient() {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	return (
		<MotionConfig reducedMotion="user">
		<div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--background)] px-4 transition-colors duration-[0.18s]">
			{/* Decorative grid overlay matching homepage/leaderboard styling */}
			<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(224,104,48,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(224,104,48,0.015)_1px,transparent_1px)] bg-[size:100px_100px]" />

			{/* Soft accent glow */}
			<div className="pointer-events-none absolute -top-[200px] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,var(--glow)_0%,transparent_70%)]" />

			<div className="relative z-10 w-full max-w-[400px]">
				<motion.div
					animate={{ opacity: 1, y: 0 }}
					initial={{ opacity: 0, y: 12 }}
					transition={{ duration: 0.3 }}
				>
					{/* Back Link */}
					<Link
						className="group mb-6 inline-flex items-center gap-1 font-mono text-[10px] text-[var(--dim)] uppercase tracking-[0.1em] transition-colors hover:text-[var(--ink)]"
						href="/"
					>
						<ChevronLeft className="h-3 w-3 transition-transform group-hover:-translate-x-[2px]" />
						Back to home
					</Link>

					{/* Login Box */}
					<div className="border border-[var(--line)] bg-[var(--panel)] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.3)] md:p-11">
						{/* Logo */}
						<div className="mb-6 flex justify-center">
							<Link
								className="flex items-center gap-[9px] font-display font-extrabold text-[var(--ink)] text-base tracking-[-0.02em]"
								href="/"
							>
								<div className="h-2 w-2 animate-pulse-dot rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
								buildml
							</Link>
						</div>

						{/* Header */}
						<div className="mb-8 text-center">
							<h1 className="mb-1.5 font-display font-extrabold text-[24px] text-[var(--ink)] tracking-[-0.02em]">
								Welcome back.
							</h1>
							<p className="font-sans text-[11px] text-[var(--sub)] leading-relaxed">
								Sign in to track progress, save solutions, and climb the
								leaderboard.
							</p>
						</div>

						{/* Google Auth Button */}
						<button
							className="flex w-full items-center justify-center gap-3 rounded-[2px] bg-primary py-3 font-medium font-mono text-[11px] text-white uppercase tracking-[0.07em] shadow-[0_2px_12px_rgba(224,104,48,0.25)] transition-all duration-[0.18s] hover:translate-y-[-1px] hover:opacity-88 hover:shadow-[0_4px_20px_rgba(224,104,48,0.35)] disabled:opacity-50"
							disabled={isLoading}
							onClick={() => {
								setIsLoading(true);
								signIn("google", { callbackUrl: "/" });
							}}
							type="button"
						>
							{isLoading ? (
								<>
									<Loader2 className="h-3.5 w-3.5 animate-spin" />
									<span>Loading...</span>
								</>
							) : (
								<>
									<GoogleIcon />
									<span>Continue with Google</span>
								</>
							)}
						</button>

						{/* Divider */}
						<div className="relative my-6">
							<div className="absolute inset-0 flex items-center">
								<span className="w-full border-[var(--line)] border-t" />
							</div>
							<div className="relative flex justify-center text-[9px] uppercase tracking-widest">
								<span className="bg-[var(--panel)] px-2 text-[var(--dim)]">
									Secure Authentication
								</span>
							</div>
						</div>

						<p className="text-center font-sans text-[10px] text-[var(--dim)] leading-relaxed">
							By logging in, you agree to track your achievements using Google
							authentication.
						</p>
					</div>
				</motion.div>

				<motion.p
					animate={{ opacity: 1 }}
					className="mt-8 text-center font-mono text-[9px] text-[var(--dim)] uppercase tracking-widest"
					initial={{ opacity: 0 }}
					transition={{ delay: 0.3 }}
				>
					&copy; {new Date().getFullYear()} buildml. Engineering excellence.
				</motion.p>
			</div>
		</div>
		</MotionConfig>
	);
}
