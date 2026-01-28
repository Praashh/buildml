import "~/styles/globals.css";

import { Geist } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "~/components/session-provider";
import { ThemeProvider } from "~/components/theme-provider";
import {
	createMetadata,
	generateOrganizationSchema,
	generateWebsiteSchema,
} from "~/lib/seo";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata = createMetadata();

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const organizationSchema = generateOrganizationSchema();
	const websiteSchema = generateWebsiteSchema();

	return (
		<html className={`${geist.variable}`} lang="en" suppressHydrationWarning>
			<head>
				<link href="https://buildml.com" rel="canonical" />
				<meta content="#22c55e" name="theme-color" />
				<meta content="yes" name="apple-mobile-web-app-capable" />
				<meta
					content="black-translucent"
					name="apple-mobile-web-app-status-bar-style"
				/>
				<script
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(organizationSchema),
					}}
					// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires dangerouslySetInnerHTML
					type="application/ld+json"
				/>
				<script
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(websiteSchema),
					}}
					// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires dangerouslySetInnerHTML
					type="application/ld+json"
				/>
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
							<Toaster position="bottom-right" richColors />
						</ThemeProvider>
					</AuthProvider>
				</TRPCReactProvider>
			</body>
		</html>
	);
}
