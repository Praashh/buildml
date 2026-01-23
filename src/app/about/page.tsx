import { HydrateClient } from "~/trpc/server";
import { Navbar } from "../_components/navbar";
import { Footer } from "../_components/footer";
import { createMetadata } from "~/lib/seo";

export const metadata = createMetadata({
    title: "About",
    description:
        "Learn about 100xPractice - a platform for mastering AI/ML by implementing research papers from scratch. Built by praash with Next.js, TypeScript, tRPC, and Prisma.",
    pathname: "/about",
});

export default async function AboutPage() {
    return (
        <HydrateClient>
            <div className="relative min-h-screen flex flex-col">
                <Navbar />

                <main className="flex-1 container mx-auto px-6 lg:px-8 pt-32 pb-20 max-w-4xl">

                    {/* Header Section */}
                    <div className="mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            About 100xPractice
                        </h1>
                        <p className="text-lg text-white/60 leading-relaxed">
                            100xPractice is a platform for learning by implementing coding challenges from scratch.
                            We believe that deep understanding comes from hands-on implementation. Reading gives you
                            the "what" and "why", but coding gives you the "how".
                        </p>
                    </div>

                    {/* Built By Section */}
                    <div className="mb-16">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Built By
                        </h2>
                        <p className="text-white/60">
                            100xPractice is built and maintained by <span className="text-white">praash</span>.
                        </p>
                    </div>

                    {/* Tech Stack Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Tech Stack
                        </h2>
                        <ul className="space-y-2 text-white/60">
                            <li>Next.js (App Router)</li>
                            <li>TypeScript</li>
                            <li>tRPC</li>
                            <li>Prisma (ORM)</li>
                            <li>TailwindCSS (Styling)</li>
                            <li>React Query</li>
                        </ul>
                    </div>
                </main>

                <Footer />
            </div>
        </HydrateClient>
    );
}
