import type { MetadataRoute } from "next";
import { prisma } from "~/db/client";

type ProblemSet = {
    slug: string;
    updatedAt: Date;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://100xpractice.com";

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${baseUrl}/practice`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${baseUrl}/sponsor`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.6,
        },
        {
            url: `${baseUrl}/leaderboard`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.8,
        },
    ];

    // Dynamic problem set pages
    let problemSetPages: MetadataRoute.Sitemap = [];
    try {
        const problemSets: ProblemSet[] = await prisma.problemSet.findMany({
            select: { slug: true, updatedAt: true },
        });

        problemSetPages = problemSets.map((set: ProblemSet) => ({
            url: `${baseUrl}/practice/${set.slug}`,
            lastModified: set.updatedAt,
            changeFrequency: "weekly" as const,
            priority: 0.8,
        }));
    } catch {
        // Database might not be available during build
        console.warn("Could not fetch problem sets for sitemap");
    }

    // Dynamic problem-sets pages
    let problemSetsDetailPages: MetadataRoute.Sitemap = [];
    try {
        const problemSetsWithSlug: ProblemSet[] = await prisma.problemSet.findMany({
            select: { slug: true, updatedAt: true },
        });

        problemSetsDetailPages = problemSetsWithSlug.map((set: ProblemSet) => ({
            url: `${baseUrl}/problem-sets/${set.slug}`,
            lastModified: set.updatedAt,
            changeFrequency: "weekly" as const,
            priority: 0.75,
        }));
    } catch {
        console.warn("Could not fetch problem-sets for sitemap");
    }

    return [...staticPages, ...problemSetPages, ...problemSetsDetailPages];
}
