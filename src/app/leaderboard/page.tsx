import { HydrateClient } from "~/trpc/server";
import { Navbar } from "../_components/navbar";
import { Footer } from "../_components/footer";

export default async function LeaderboardPage() {
    return (
        <HydrateClient>
            <div className="relative flex min-h-screen flex-col">
                <Navbar />
                <main className="relative z-10 flex-1 container mx-auto px-6 lg:px-8 pt-32 pb-20 max-w-2xl">
                    Leaderboard
                </main>
                <Footer />
            </div>
        </HydrateClient>
    );
}
