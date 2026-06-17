import "~/styles/globals.css";

import { Analytics } from "@vercel/analytics/next";
import { IBM_Plex_Mono, Instrument_Serif, Syne } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "~/components/session-provider";
import { ThemeProvider } from "~/components/theme-provider";
import {
	createMetadata,
	generateOrganizationSchema,
	generateWebsiteSchema,
	safeJsonLd,
} from "~/lib/seo";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata = createMetadata();

const syne = Syne({
	subsets: ["latin"],
	variable: "--font-syne",
	weight: ["400", "500", "700", "800"],
});

const ibmPlexMono = IBM_Plex_Mono({
	subsets: ["latin"],
	variable: "--font-ibm-plex-mono",
	weight: ["300", "400", "500", "600"],
	style: ["normal", "italic"],
});

const instrumentSerif = Instrument_Serif({
	subsets: ["latin"],
	variable: "--font-instrument-serif",
	weight: "400",
	style: ["normal", "italic"],
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const organizationJsonLd = safeJsonLd(generateOrganizationSchema());
	const websiteJsonLd = safeJsonLd(generateWebsiteSchema());

	return (
		<html
			className={`${syne.variable} ${ibmPlexMono.variable} ${instrumentSerif.variable}`}
			lang="en"
			suppressHydrationWarning
		>
			<head>
				<link href="https://www.buildml.website" rel="canonical" />
				<meta content="#0C0B09" name="theme-color" />
				<meta content="yes" name="apple-mobile-web-app-capable" />
				<meta
					content="black-translucent"
					name="apple-mobile-web-app-status-bar-style"
				/>
				<script type="application/ld+json">
					{organizationJsonLd}
				</script>
				<script type="application/ld+json">
					{websiteJsonLd}
				</script>
			</head>
			<body>
				<TRPCReactProvider>
					<AuthProvider>
						<ThemeProvider
							attribute="class"
							defaultTheme="dark"
							disableTransitionOnChange
							enableSystem
						>
							{children}
							<Analytics />
							<Toaster position="bottom-right" richColors />
						</ThemeProvider>
					</AuthProvider>
				</TRPCReactProvider>
			</body>
		</html>
	);
}
