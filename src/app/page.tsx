import { HydrateClient } from "~/trpc/server";
import { CtaBlock } from "./_components/cta-block";
import FeedbackPage from "./_components/feedback";
import { Footer } from "./_components/footer";
import HeroSection from "./_components/hero";
import { Navbar } from "./_components/navbar";
import { StepsSection } from "./_components/steps-section";
import { Ticker } from "./_components/ticker";

export default async function Home() {
	return (
		<HydrateClient>
			<div className="relative min-h-screen bg-[var(--background)]">
				<Navbar />

				{/* Page wrapper — offset for fixed nav */}
				<div className="animate-fade-in pt-[58px]">
					<HeroSection />

					<Ticker />

					<StepsSection />

					{/* Value Props */}
					<section className="grid grid-cols-1 gap-px border-[var(--line)] border-b bg-[var(--line)] sm:grid-cols-3">
						{[
							[
								"Zero to Infinity",
								"You start with basic challenges, gradually master the fundamentals, build real-world projects, and eventually finish by producing proper machine learning research papers.",
							],
							[
								"Test-driven",
								"Each challenge ships with a full test suite. You know you're right when all tests pass.",
							],
							[
								"Paper-first",
								"Every challenge is grounded in a real research paper. Understand the theory before you type a line.",
							],
						].map(([title, desc]) => (
							<div className="bg-[var(--background)] px-8 py-9" key={title}>
								<div className="mb-[10px] font-bold font-display text-[var(--ink)] text-base">
									{title}
								</div>
								<p className="text-[var(--sub)] text-xs leading-[1.85]">
									{desc}
								</p>
							</div>
						))}
					</section>

					{/* Feedback section */}
					<FeedbackPage />

					<CtaBlock
						body="The best ML engineers don't just fine-tune APIs. They understand the math, they've written the code, and they know exactly what's happening inside the model. That's what buildml builds."
						cta="Start for free →"
						em="boxes."
						href="/signin"
						title="Stop using black"
					/>

					<Footer />
				</div>
			</div>
		</HydrateClient>
	);
}
