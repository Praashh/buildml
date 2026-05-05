import { createMetadata } from "~/lib/seo";
import { HydrateClient } from "~/trpc/server";
import { Footer } from "../_components/footer";
import { Navbar } from "../_components/navbar";

export const metadata = createMetadata({
	title: "About",
	description:
		"Learn about buildml - a platform for mastering AI/ML by implementing research papers from scratch. Built by praash with Next.js, TypeScript, tRPC, and Prisma.",
	pathname: "/about",
});

export default async function AboutPage() {
	return (
		<HydrateClient>
			<div className="relative flex min-h-screen flex-col bg-black">
				<Navbar />

				{/* Background effects */}
				<div className="pointer-events-none absolute inset-0 overflow-hidden">
					<div className="absolute top-[10%] left-[20%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px]" />
					<div className="absolute right-[20%] bottom-[10%] h-[40%] w-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
				</div>

				<main className="container mx-auto max-w-4xl flex-1 px-6 pt-32 pb-20 lg:px-8">
					{/* Header Section */}
					<div className="mb-16">
						<h1 className="mb-6 font-bold text-4xl text-white md:text-5xl">
							About buildml
						</h1>
						<p className="text-lg text-white/60 leading-relaxed">
							buildml is a platform for learning by implementing coding
							challenges from scratch. We believe that deep understanding comes
							from hands-on implementation. Reading gives you the "what" and
							"why", but coding gives you the "how".
						</p>
					</div>

					{/* Built By Section */}
					<div className="mb-16">
						<h2 className="mb-4 font-bold text-2xl text-white">Built By</h2>
						<p className="text-white/60">
							buildml is built and maintained by{" "}
							<span className="text-white">praash and team</span>.
						</p>
					</div>

					{/* Tech Stack Section */}
					<div>
						<h2 className="mb-4 font-bold text-2xl text-white">Tech Stack</h2>
						<ul className="space-y-2 text-white/60">
							<li>Next.js (App Router)</li>
							<li>TypeScript</li>
							<li>tRPC</li>
							<li>Prisma (ORM)</li>
							<li>TailwindCSS (Styling)</li>
							<li>React Query</li>
							<li>Fastapi</li>
						</ul>
					</div>
				</main>

				<Footer />
			</div>
		</HydrateClient>
	);
}
