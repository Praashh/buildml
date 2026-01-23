import { HydrateClient } from "~/trpc/server";
import FeedbackPage from "./_components/feedback";
import { Footer } from "./_components/footer";
import RainingLetters from "./_components/hero";
import { Navbar } from "./_components/navbar";
import PaperScrollAnimation from "./_components/paper-scroll-animation";

export default async function Home() {
	return (
		<HydrateClient>
			<div className="relative min-h-screen bg-black">
				<Navbar />
				<RainingLetters />
				<PaperScrollAnimation />
				<FeedbackPage />
				<Footer />
			</div>
		</HydrateClient>
	);
}
