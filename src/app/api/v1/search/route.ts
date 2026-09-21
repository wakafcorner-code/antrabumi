import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { ContentStatus, Language } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() || "";
    const type = searchParams.get("type") || "all";
    const langParam = (searchParams.get("language")?.toUpperCase() || "ID") as Language;
    const language = langParam === Language.EN ? Language.EN : Language.ID;

    if (!q) {
      return NextResponse.json({
        success: true,
        data: { experiences: [], knowledge: [] },
      });
    }

    const searchExp = type === "all" || type === "experiences";
    const searchKnow = type === "all" || type === "knowledge";

    const [experiences, knowledge] = await Promise.all([
      searchExp
        ? prisma.experience.findMany({
            where: {
              status: ContentStatus.PUBLISHED,
              OR: [
                { slug: { contains: q } },
                { clientName: { contains: q } },
                { location: { contains: q } },
                { translations: { some: { title: { contains: q } } } },
                { translations: { some: { excerpt: { contains: q } } } },
              ],
            },
            take: 10,
            select: {
              id: true,
              slug: true,
              year: true,
              coverMedia: { select: { url: true, altText: true } },
              translations: {
                where: { language },
                select: { title: true, excerpt: true },
              },
            },
          })
        : Promise.resolve([]),

      searchKnow
        ? prisma.knowledge.findMany({
            where: {
              status: ContentStatus.PUBLISHED,
              OR: [
                { slug: { contains: q } },
                { authorName: { contains: q } },
                { translations: { some: { title: { contains: q } } } },
                { translations: { some: { excerpt: { contains: q } } } },
              ],
            },
            take: 10,
            select: {
              id: true,
              slug: true,
              type: true,
              coverMedia: { select: { url: true, altText: true } },
              translations: {
                where: { language },
                select: { title: true, excerpt: true },
              },
            },
          })
        : Promise.resolve([]),
    ]);

    return NextResponse.json({
      success: true,
      query: q,
      data: {
        experiences: experiences.map((e) => ({
          id: e.id,
          slug: e.slug,
          year: e.year,
          title: e.translations[0]?.title ?? e.slug,
          excerpt: e.translations[0]?.excerpt ?? null,
          coverMedia: e.coverMedia,
          url: `/inisiatif/${e.slug}`,
        })),
        knowledge: knowledge.map((k) => ({
          id: k.id,
          slug: k.slug,
          type: k.type,
          title: k.translations[0]?.title ?? k.slug,
          excerpt: k.translations[0]?.excerpt ?? null,
          coverMedia: k.coverMedia,
          url: `/pengetahuan/${k.slug}`,
        })),
      },
    });
  } catch (error) {
    console.error("GET /api/v1/search error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
