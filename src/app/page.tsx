import { HydrateClient } from "~/trpc/server";
import RainingLetters from "./_components/hero";
import PaperScrollAnimation from "./_components/paper-scroll-animation";
import { Navbar } from "./_components/navbar";
import { Footer } from "./_components/footer";
import FeedbackPage from "./_components/feedback";

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
