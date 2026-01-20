import { HydrateClient } from "~/trpc/server";
import { Navbar } from "../_components/navbar";
import { Footer } from "../_components/footer";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import { Card, CardContent } from "~/components/ui/card";

export default async function FeedbackPage() {
    return (
        <HydrateClient>
            <div className="relative flex min-h-screen flex-col">
                <Navbar />
                <main className="relative z-10 flex-1 container mx-auto px-6 lg:px-8 pt-32 pb-20 max-w-2xl">
                    {/* Header Section */}
                    <div className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Feedback
                        </h1>
                        <p className="text-lg text-white/60 leading-relaxed">
                            Your feedback helps us improve 100xPractice. Share your thoughts, report bugs,
                            or suggest new features.
                        </p>
                    </div>

                    {/* Feedback Form Card */}
                    <Card className="bg-white/5 border-white/10 backdrop-blur-sm mb-16">
                        <CardContent className="p-6 md:p-8">
                            <form className="space-y-6">
                                {/* Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-white/80">
                                        Name (optional)
                                    </Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-green-400/50 focus-visible:ring-green-400/30"
                                        placeholder="Your name"
                                    />
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-white/80">
                                        Email
                                    </Label>
                                    <Input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-green-400/50 focus-visible:ring-green-400/30"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                {/* Feedback Type */}
                                <div className="space-y-2">
                                    <Label htmlFor="type" className="text-white/80">
                                        Feedback Type
                                    </Label>
                                    <Select name="type" defaultValue="general">
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-green-400/30">
                                            <SelectValue placeholder="Select feedback type" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-white/10">
                                            <SelectItem value="general" className="text-white hover:bg-white/10 focus:bg-white/10">
                                                General Feedback
                                            </SelectItem>
                                            <SelectItem value="bug" className="text-white hover:bg-white/10 focus:bg-white/10">
                                                Bug Report
                                            </SelectItem>
                                            <SelectItem value="feature" className="text-white hover:bg-white/10 focus:bg-white/10">
                                                Feature Request
                                            </SelectItem>
                                            <SelectItem value="improvement" className="text-white hover:bg-white/10 focus:bg-white/10">
                                                Improvement Suggestion
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Message */}
                                <div className="space-y-2">
                                    <Label htmlFor="message" className="text-white/80">
                                        Message
                                    </Label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={6}
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-green-400/50 focus-visible:ring-green-400/30 resize-none"
                                        placeholder="Tell us what's on your mind..."
                                    />
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full bg-linear-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-black font-semibold py-6 text-lg"
                                >
                                    Send Feedback
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Alternative Contact */}
                    <div className="text-center border-t border-white/10 pt-8">
                        <p className="text-white/60 mb-2">
                            Prefer to email directly?
                        </p>
                        <a
                            href="mailto:feedback@100xpractice.com"
                            className="text-green-400 hover:text-green-300 transition-colors"
                        >
                            feedback@100xpractice.com
                        </a>
                    </div>
                </main>

                <Footer />
            </div>
        </HydrateClient>
    );
}
