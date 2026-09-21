import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { ContentStatus, KnowledgeType, Language, Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));
    const search = searchParams.get("search")?.trim() || "";
    const typeParam = searchParams.get("type")?.toUpperCase() as KnowledgeType | undefined;
    const featuredParam = searchParams.get("featured");
    const langParam = (searchParams.get("language")?.toUpperCase() || "ID") as Language;
    const language = langParam === Language.EN ? Language.EN : Language.ID;

    const skip = (page - 1) * limit;

    const where: Prisma.KnowledgeWhereInput = {
      status: ContentStatus.PUBLISHED,
    };

    if (typeParam && Object.values(KnowledgeType).includes(typeParam)) {
      where.type = typeParam;
    }

    if (featuredParam !== null && featuredParam !== undefined) {
      where.featured = featuredParam === "true" || featuredParam === "1";
    }

    if (search) {
      where.OR = [
        { slug: { contains: search } },
        { authorName: { contains: search } },
        { translations: { some: { title: { contains: search } } } },
      ];
    }

    const [total, items] = await Promise.all([
      prisma.knowledge.count({ where }),
      prisma.knowledge.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ publicationDate: "desc" }, { createdAt: "desc" }],
        select: {
          id: true,
          slug: true,
          type: true,
          featured: true,
          authorName: true,
          publicationDate: true,
          coverMedia: {
            select: { id: true, url: true, altText: true },
          },
          translations: {
            where: { language },
            select: { title: true, excerpt: true },
          },
        },
      }),
    ]);

    const formatted = items.map((item) => {
      const t = item.translations[0];
      return {
        id: item.id,
        slug: item.slug,
        type: item.type,
        featured: item.featured,
        author: item.authorName,
        publishedAt: item.publicationDate,
        title: t?.title ?? item.slug,
        excerpt: t?.excerpt ?? null,
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
    console.error("GET /api/v1/knowledge error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
