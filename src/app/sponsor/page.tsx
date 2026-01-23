import { HydrateClient } from "~/trpc/server";
import { Navbar } from "../_components/navbar";
import { Footer } from "../_components/footer";
import { Heart, Crown, Server, Award } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { createMetadata } from "~/lib/seo";

export const metadata = createMetadata({
    title: "Become a Sponsor",
    description:
        "Support 100xPractice and help keep AI/ML learning accessible to everyone. Sponsors receive premium features, badges, and lifetime access.",
    pathname: "/sponsor",
});

const benefits = [
    {
        title: "Premium for Life",
        description: "Early sponsors become premium members for life when we launch premium features",
        icon: Crown,
    },
    {
        title: "Keep Servers Running",
        description: "Your support helps cover hosting costs, database infrastructure, and API services",
        icon: Server,
        highlighted: true,
    },
    {
        title: "Sponsor Badge",
        description: "Get a special sponsor badge on your profile and leaderboard entries",
        icon: Award,
    },
];

export default async function SponsorPage() {
    return (
        <HydrateClient>
            <div className="relative min-h-screen flex flex-col">
                <Navbar />

                <main className="flex-1 container mx-auto px-6 lg:px-8 pt-32 pb-20 max-w-5xl">

                    {/* Back Button */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
                    >
                        <span>←</span>
                        <span>Back to Home</span>
                    </Link>

                    {/* Support Badge */}
                    <div className="flex justify-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30">
                            <Heart className="w-4 h-4 text-green-400 fill-green-400" />
                            <span className="text-green-400 text-sm font-semibold">Support 100xPractice</span>
                        </div>
                    </div>

                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                            Become a Sponsor
                        </h1>
                        <p className="text-lg text-white/60 leading-relaxed max-w-2xl mx-auto">
                            Help keep 100xPractice running and accessible to everyone. Your support covers server
                            costs, infrastructure, and enables us to add more papers and features.
                        </p>
                    </div>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                        {benefits.map((benefit) => (
                            <div
                                key={benefit.title}
                                className={`p-6 rounded-lg bg-white/5 ${benefit.highlighted
                                    ? "border-2 border-green-500/50"
                                    : "border border-white/10"
                                    }`}
                            >
                                <div className={`inline-flex p-3 rounded-lg mb-4 ${benefit.highlighted
                                    ? "bg-green-500/20"
                                    : "bg-white/5"
                                    }`}>
                                    <benefit.icon className={`w-6 h-6 ${benefit.highlighted
                                        ? "text-green-400"
                                        : "text-white/60"
                                        }`} />
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2">
                                    {benefit.title}
                                </h3>

                                <p className="text-white/60 text-sm leading-relaxed">
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <div className="flex justify-center mb-20">
                        <Button
                            className="bg-linear-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-black font-semibold px-8 py-6 text-lg"
                        >
                            Sponsor on GitHub
                        </Button>
                    </div>

                    {/* Our Amazing Sponsors Section */}
                    <div className="border-t border-white/10 pt-12">
                        <div className="flex items-center gap-3 mb-6">
                            <Heart className="w-5 h-5 text-green-400 fill-green-400" />
                            <h2 className="text-2xl font-bold text-white">
                                Our Amazing Sponsors
                            </h2>
                        </div>
                        <p className="text-white/60">
                            Thank you to everyone who supports 100xPractice
                        </p>
                    </div>
                </main>

                <Footer />
            </div>
        </HydrateClient>
    );
}
