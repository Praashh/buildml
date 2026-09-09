"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthErrorContent() {
	const searchParams = useSearchParams();
	const error = searchParams.get("error");

	return (
		<div className="flex min-h-screen flex-col items-center justify-center">
			<h1 className="font-bold text-2xl text-red-600">Authentication Error</h1>
			<p className="mt-2 text-gray-600">
				{error === "CredentialsSignin"
					? "Invalid email or password."
					: "An unexpected error occurred during authentication."}
			</p>
			<Link className="mt-4 text-blue-500 underline" href="/signin">
				Back to Sign In
			</Link>
		</div>
	);
}

export default function AuthErrorPage() {
	return (
		<Suspense>
			<AuthErrorContent />
		</Suspense>
	);
}
