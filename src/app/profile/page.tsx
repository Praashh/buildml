import { redirect } from "next/navigation";
import { createMetadata } from "~/lib/seo";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { Footer } from "../_components/footer";
import { Navbar } from "../_components/navbar";
import { ProfileClient } from "./_components/ProfileClient";

export const metadata = createMetadata({
	title: "Profile",
	description: "View your progress, solved problems, and activity on buildml.",
	pathname: "/profile",
});

export default async function ProfilePage({
	searchParams,
}: {
	searchParams: Promise<{ userId?: string }>;
}) {
	const session = await auth();
	const { userId } = await searchParams;

	const targetUserId = userId ?? session?.user?.id;

	if (!targetUserId) {
		redirect("/");
	}

	// Prefetching for better initial load
	void api.user.getProfile.prefetch({ userId: targetUserId });

	return (
		<HydrateClient>
			<div className="relative min-h-screen bg-[var(--background)]">
				<Navbar />

				{/* Page wrapper — offset for fixed nav */}
				<div className="animate-fade-in pt-[58px]">
					{/* Decorative grid overlay */}
					<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(224,104,48,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(224,104,48,0.015)_1px,transparent_1px)] bg-[size:100px_100px]" />

					<main className="relative z-10 mx-auto max-w-5xl px-6 py-16 md:px-8 md:py-20">
						<ProfileClient userId={targetUserId} />
					</main>
					<Footer />
				</div>
			</div>
		</HydrateClient>
	);
}
