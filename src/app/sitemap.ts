import { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";
import { ContentStatus } from "@prisma/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.APP_URL || "https://antrabumi.org";

  // Static public routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tentang`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/inisiatif`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pengetahuan`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/kolaborasi`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  try {
    const [experiences, knowledge] = await Promise.all([
      prisma.experience.findMany({
        where: { status: ContentStatus.PUBLISHED },
        select: { slug: true, updatedAt: true },
      }),
      prisma.knowledge.findMany({
        where: { status: ContentStatus.PUBLISHED },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const experienceRoutes: MetadataRoute.Sitemap = experiences.map((exp: { slug: string; updatedAt: Date }) => ({
      url: `${baseUrl}/inisiatif/${exp.slug}`,
      lastModified: exp.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    const knowledgeRoutes: MetadataRoute.Sitemap = knowledge.map((item: { slug: string; updatedAt: Date }) => ({
      url: `${baseUrl}/pengetahuan/${item.slug}`,
      lastModified: item.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    return [...staticRoutes, ...experienceRoutes, ...knowledgeRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticRoutes;
  }
}
