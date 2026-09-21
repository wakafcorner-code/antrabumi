import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { ContentStatus, Language, Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));
    const search = searchParams.get("search")?.trim() || "";
    const yearParam = searchParams.get("year");
    const featuredParam = searchParams.get("featured");
    const langParam = (searchParams.get("language")?.toUpperCase() || "ID") as Language;
    const language = langParam === Language.EN ? Language.EN : Language.ID;

    const skip = (page - 1) * limit;

    const where: Prisma.ExperienceWhereInput = {
      status: ContentStatus.PUBLISHED,
    };

    if (yearParam) {
      const year = parseInt(yearParam, 10);
      if (!isNaN(year)) where.year = year;
    }

    if (featuredParam !== null && featuredParam !== undefined) {
      where.featured = featuredParam === "true" || featuredParam === "1";
    }

    if (search) {
      where.OR = [
        { slug: { contains: search } },
        { clientName: { contains: search } },
        { location: { contains: search } },
        { translations: { some: { title: { contains: search } } } },
      ];
    }

    const [total, items] = await Promise.all([
      prisma.experience.count({ where }),
      prisma.experience.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ year: "desc" }, { createdAt: "desc" }],
        select: {
          id: true,
          slug: true,
          year: true,
          clientName: true,
          location: true,
          featured: true,
          coverMedia: {
            select: { id: true, url: true, altText: true },
          },
          translations: {
            where: { language },
            select: { title: true, excerpt: true, description: true },
          },
        },
      }),
    ]);

    const formatted = items.map((item) => {
      const t = item.translations[0];
      return {
        id: item.id,
        slug: item.slug,
        year: item.year,
        client: item.clientName,
        location: item.location,
        featured: item.featured,
        title: t?.title ?? item.slug,
        excerpt: t?.excerpt ?? null,
        description: t?.description ?? null,
        coverMedia: item.coverMedia,
      };
    });

    return NextResponse.json({
      success: true,
      data: formatted,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/v1/experiences error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
