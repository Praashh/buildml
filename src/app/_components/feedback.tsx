"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Navbar } from "~/app/_components/navbar";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";

type FeedbackType = "general" | "bug" | "feature" | "improvement";

export default function FeedbackPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [type, setType] = useState<FeedbackType>("general");
	const [message, setMessage] = useState("");

	const submitFeedback = api.feedback.submit.useMutation({
		onSuccess: (data) => {
			toast.success(data.message);
			// Reset form
			setName("");
			setEmail("");
			setType("general");
			setMessage("");
		},
		onError: (error) => {
			toast.error(
				error.message || "Failed to submit feedback. Please try again.",
			);
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Basic validation
		if (!email.trim()) {
			toast.error("Please enter your email address.");
			return;
		}

		if (!message.trim()) {
			toast.error("Please enter your feedback message.");
			return;
		}

		if (message.trim().length < 10) {
			toast.error("Your message must be at least 10 characters long.");
			return;
		}

		submitFeedback.mutate({
			name: name.trim() || undefined,
			email: email.trim(),
			type,
			message: message.trim(),
		});
	};

	return (
		<div className="relative -mt-36 flex min-h-screen flex-col">
			<Navbar />
			<main className="container relative z-10 mx-auto max-w-2xl flex-1 px-6 pt-32 pb-20 lg:px-8">
				{/* Header Section */}
				<div className="mb-12">
					<h1 className="mb-6 font-bold text-4xl text-white md:text-5xl">
						Feedback
					</h1>
					<p className="text-lg text-white/60 leading-relaxed">
						Your feedback helps us improve 100xPractice. Share your thoughts,
						report bugs, or suggest new features.
					</p>
				</div>

				{/* Feedback Form Card */}
				<Card className="mb-16 border-white/10 bg-white/5 backdrop-blur-sm">
					<CardContent className="p-6 md:p-8">
						<form className="space-y-6" onSubmit={handleSubmit}>
							{/* Name */}
							<div className="space-y-2">
								<Label className="text-white/80" htmlFor="name">
									Name (optional)
								</Label>
								<Input
									className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-green-400/50 focus-visible:ring-green-400/30"
									disabled={submitFeedback.isPending}
									id="name"
									name="name"
									onChange={(e) => setName(e.target.value)}
									placeholder="Your name"
									type="text"
									value={name}
								/>
							</div>

							{/* Email */}
							<div className="space-y-2">
								<Label className="text-white/80" htmlFor="email">
									Email
								</Label>
								<Input
									className="border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-green-400/50 focus-visible:ring-green-400/30"
									disabled={submitFeedback.isPending}
									id="email"
									name="email"
									onChange={(e) => setEmail(e.target.value)}
									placeholder="your@email.com"
									required
									type="email"
									value={email}
								/>
							</div>

							{/* Feedback Type */}
							<div className="space-y-2">
								<Label className="text-white/80" htmlFor="type">
									Feedback Type
								</Label>
								<Select
									disabled={submitFeedback.isPending}
									name="type"
									onValueChange={(value: FeedbackType) => setType(value)}
									value={type}
								>
									<SelectTrigger className="border-white/10 bg-white/5 text-white focus:ring-green-400/30">
										<SelectValue placeholder="Select feedback type" />
									</SelectTrigger>
									<SelectContent className="border-white/10 bg-zinc-900">
										<SelectItem
											className="text-white hover:bg-white/10 focus:bg-white/10"
											value="general"
										>
											General Feedback
										</SelectItem>
										<SelectItem
											className="text-white hover:bg-white/10 focus:bg-white/10"
											value="bug"
										>
											Bug Report
										</SelectItem>
										<SelectItem
											className="text-white hover:bg-white/10 focus:bg-white/10"
											value="feature"
										>
											Feature Request
										</SelectItem>
										<SelectItem
											className="text-white hover:bg-white/10 focus:bg-white/10"
											value="improvement"
										>
											Improvement Suggestion
										</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{/* Message */}
							<div className="space-y-2">
								<Label className="text-white/80" htmlFor="message">
									Message
								</Label>
								<Textarea
									className="resize-none border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-green-400/50 focus-visible:ring-green-400/30"
									disabled={submitFeedback.isPending}
									id="message"
									name="message"
									onChange={(e) => setMessage(e.target.value)}
									placeholder="Tell us what's on your mind..."
									required
									rows={6}
									value={message}
								/>
							</div>

							{/* Submit Button */}
							<Button
								className="w-full bg-linear-to-r from-green-400 to-emerald-500 py-6 font-semibold text-black text-lg hover:from-green-500 hover:to-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
								disabled={submitFeedback.isPending}
								type="submit"
							>
								{submitFeedback.isPending ? "Sending..." : "Send Feedback"}
							</Button>
						</form>
					</CardContent>
				</Card>
			</main>
		</div>
	);
}
