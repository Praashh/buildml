import { HydrateClient } from "~/trpc/server";
import RainingLetters from "./_components/hero";
import { Navbar } from "./_components/navbar";
import { Footer } from "./_components/footer";

export default async function Home() {
  return (
    <HydrateClient>
      <div className="relative min-h-screen">
        <Navbar />
        <RainingLetters />
        <Footer />
      </div>
    </HydrateClient>
  );
}
