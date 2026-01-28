import { createMetadata } from "~/lib/seo";
import { api, HydrateClient } from "~/trpc/server";
import { Footer } from "../_components/footer";
import { Navbar } from "../_components/navbar";
import { ProfileClient } from "./_components/ProfileClient";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";

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
            <div className="relative flex min-h-screen flex-col bg-black">
                <Navbar />

                {/* Background effects */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-[10%] left-[20%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
                    <div className="absolute right-[20%] bottom-[10%] h-[40%] w-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
                </div>

                <main className="container relative z-10 mx-auto max-w-5xl flex-1 px-6 pt-32 pb-20 lg:px-8">
                    <ProfileClient userId={targetUserId} />
                </main>
                <Footer />
            </div>
        </HydrateClient>
    );
}
