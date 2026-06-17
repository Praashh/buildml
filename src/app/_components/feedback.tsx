"use client";
import type * as React from "react";
import { useState } from "react";
import { toast } from "sonner";
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
		<section className="border-[var(--line)] border-b">
			<div className="grid grid-cols-1 lg:grid-cols-2">
				{/* Left — Header */}
				<div className="flex flex-col justify-center border-[var(--line)] border-b px-6 py-16 md:px-[52px] md:py-20 lg:border-r lg:border-b-0">
					<div className="mb-4 flex items-center gap-3 text-[10px] text-[var(--dim)] uppercase tracking-[0.18em]">
						Feedback
						<span className="h-px flex-1 bg-[var(--line)]" />
					</div>
					<h2 className="mb-4 font-display font-extrabold text-[clamp(28px,3.5vw,46px)] leading-[0.93] tracking-[-0.025em]">
						Help us{" "}
						<span className="font-normal font-serif text-primary italic">
							improve.
						</span>
					</h2>
					<p className="max-w-[380px] text-[13px] text-[var(--sub)] leading-[1.85]">
						Your feedback helps us improve buildml. Share your thoughts, report
						bugs, or suggest new features.
					</p>
				</div>

				{/* Right — Form */}
				<div className="bg-[var(--panel)] px-6 py-12 md:px-[52px] md:py-16">
					<form className="space-y-5" onSubmit={handleSubmit}>
						{/* Name */}
						<div>
							<label
								className="mb-[5px] block text-[10px] text-[var(--dim)] uppercase tracking-[0.1em]"
								htmlFor="feedback-name"
							>
								Name (optional)
							</label>
							<input
								className="w-full rounded-[2px] border border-[var(--line)] bg-[var(--panel)] px-3 py-[10px] font-sans text-[13px] text-[var(--ink)] outline-none transition-colors duration-[0.18s] placeholder:text-[var(--dim)] focus:border-primary"
								disabled={submitFeedback.isPending}
								id="feedback-name"
								name="name"
								onChange={(e) => setName(e.target.value)}
								placeholder="Your name"
								type="text"
								value={name}
							/>
						</div>

						{/* Email */}
						<div>
							<label
								className="mb-[5px] block text-[10px] text-[var(--dim)] uppercase tracking-[0.1em]"
								htmlFor="feedback-email"
							>
								Email
							</label>
							<input
								className="w-full rounded-[2px] border border-[var(--line)] bg-[var(--panel)] px-3 py-[10px] font-sans text-[13px] text-[var(--ink)] outline-none transition-colors duration-[0.18s] placeholder:text-[var(--dim)] focus:border-primary"
								disabled={submitFeedback.isPending}
								id="feedback-email"
								name="email"
								onChange={(e) => setEmail(e.target.value)}
								placeholder="you@domain.com"
								required
								type="email"
								value={email}
							/>
						</div>

						{/* Feedback Type */}
						<div>
							<label
								className="mb-[5px] block text-[10px] text-[var(--dim)] uppercase tracking-[0.1em]"
								htmlFor="feedback-type"
							>
								Feedback Type
							</label>
							<select
								className="w-full rounded-[2px] border border-[var(--line)] bg-[var(--panel)] px-3 py-[10px] font-sans text-[13px] text-[var(--ink)] outline-none transition-colors duration-[0.18s] focus:border-primary"
								disabled={submitFeedback.isPending}
								id="feedback-type"
								name="type"
								onChange={(e) => setType(e.target.value as FeedbackType)}
								value={type}
							>
								<option value="general">General Feedback</option>
								<option value="bug">Bug Report</option>
								<option value="feature">Feature Request</option>
								<option value="improvement">Improvement Suggestion</option>
							</select>
						</div>

						{/* Message */}
						<div>
							<label
								className="mb-[5px] block text-[10px] text-[var(--dim)] uppercase tracking-[0.1em]"
								htmlFor="feedback-message"
							>
								Message
							</label>
							<textarea
								className="w-full resize-none rounded-[2px] border border-[var(--line)] bg-[var(--panel)] px-3 py-[10px] font-sans text-[13px] text-[var(--ink)] outline-none transition-colors duration-[0.18s] placeholder:text-[var(--dim)] focus:border-primary"
								disabled={submitFeedback.isPending}
								id="feedback-message"
								name="message"
								onChange={(e) => setMessage(e.target.value)}
								placeholder="Tell us what's on your mind..."
								required
								rows={5}
								value={message}
							/>
						</div>

						{/* Submit */}
						<button
							className="w-full rounded-[2px] bg-primary px-6 py-3 font-sans font-semibold text-[11px] text-white uppercase tracking-[0.07em] transition-all duration-[0.18s] hover:translate-y-[-1px] hover:opacity-88 disabled:cursor-not-allowed disabled:opacity-50"
							disabled={submitFeedback.isPending}
							type="submit"
						>
							{submitFeedback.isPending ? "Sending..." : "Send Feedback →"}
						</button>
					</form>
				</div>
			</div>
		</section>
	);
}
