import type { Metadata } from "next";

export const siteConfig = {
    name: "100xPractice",
    description:
        "Master AI/ML by implementing research papers from scratch. Practice coding challenges, understand algorithms, and build real skills through hands-on implementation.",
    url: "https://100xpractice.com",
    ogImage: "/og.png",
    creator: "praash",
    keywords: [
        "AI practice",
        "ML coding challenges",
        "machine learning practice",
        "implement research papers",
        "AI/ML learning",
        "coding challenges",
        "algorithm practice",
        "deep learning implementation",
        "neural network coding",
        "100xPractice",
    ],
};

export function createMetadata({
    title,
    description,
    image,
    noIndex = false,
    pathname = "",
}: {
    title?: string;
    description?: string;
    image?: string;
    noIndex?: boolean;
    pathname?: string;
} = {}): Metadata {
    const finalTitle = title
        ? `${title} | ${siteConfig.name}`
        : `${siteConfig.name} - AI/ML Coding Challenges`;
    const finalDescription = description || siteConfig.description;
    const finalImage = image || siteConfig.ogImage;
    const url = `${siteConfig.url}${pathname}`;

    return {
        title: finalTitle,
        description: finalDescription,
        keywords: siteConfig.keywords,
        authors: [{ name: siteConfig.creator }],
        creator: siteConfig.creator,
        metadataBase: new URL(siteConfig.url),
        alternates: {
            canonical: url,
        },
        openGraph: {
            type: "website",
            locale: "en_US",
            url,
            title: finalTitle,
            description: finalDescription,
            siteName: siteConfig.name,
            images: [
                {
                    url: finalImage,
                    width: 1200,
                    height: 630,
                    alt: `${siteConfig.name} - AI/ML Coding Challenges`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: finalTitle,
            description: finalDescription,
            images: [finalImage],
            creator: "@praash",
        },
        robots: {
            index: !noIndex,
            follow: !noIndex,
            googleBot: {
                index: !noIndex,
                follow: !noIndex,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
        icons: {
            icon: "/favicon.ico",
            apple: "/favicon.ico",
        },
        manifest: "/manifest.json",
    };
}

// JSON-LD Structured Data helpers
export function generateOrganizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/favicon.ico`,
        description: siteConfig.description,
        founder: {
            "@type": "Person",
            name: siteConfig.creator,
        },
    };
}

export function generateWebsiteSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${siteConfig.url}/practice?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    };
}

export function generateCourseSchema(problemSet: {
    title: string;
    description: string;
    slug: string;
    problemCount: number;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "Course",
        name: problemSet.title,
        description: problemSet.description,
        provider: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
        },
        url: `${siteConfig.url}/practice/${problemSet.slug}`,
        numberOfCredits: problemSet.problemCount,
        educationalLevel: "Intermediate",
        about: {
            "@type": "Thing",
            name: "AI/ML Implementation",
        },
    };
}
