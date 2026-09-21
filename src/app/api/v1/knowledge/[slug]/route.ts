import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { ContentStatus, Language } from "@prisma/client";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    const langParam = (searchParams.get("language")?.toUpperCase() || "ID") as Language;
    const language = langParam === Language.EN ? Language.EN : Language.ID;

    const k = await prisma.knowledge.findUnique({
      where: {
        slug,
        status: ContentStatus.PUBLISHED,
      },
      select: {
        id: true,
        slug: true,
        type: true,
        featured: true,
        authorName: true,
        publicationDate: true,
        createdAt: true,
        updatedAt: true,
        coverMedia: {
          select: { id: true, url: true, altText: true },
        },
        translations: {
          where: { language },
          select: {
            title: true,
            excerpt: true,
            content: true,
            seoTitle: true,
            seoDescription: true,
          },
        },
        downloadableMedia: {
          select: {
            media: {
              select: { id: true, url: true, originalName: true, filename: true },
            },
          },
          orderBy: { order: "asc" },
        },
        categories: {
          select: {
            category: { select: { id: true, slug: true, name: true } },
          },
        },
        tags: {
          select: {
            tag: { select: { id: true, slug: true, name: true } },
          },
        },
      },
    });

    if (!k) {
      return NextResponse.json(
        { success: false, error: "Knowledge item not found or not published" },
        { status: 404 }
      );
    }

    const t = k.translations[0];

    return NextResponse.json({
      success: true,
      data: {
        id: k.id,
        slug: k.slug,
        type: k.type,
        featured: k.featured,
        author: k.authorName,
        publishedAt: k.publicationDate,
        title: t?.title ?? k.slug,
        excerpt: t?.excerpt ?? null,
        content: t?.content ?? null,
        seoTitle: t?.seoTitle ?? null,
        seoDescription: t?.seoDescription ?? null,
        coverMedia: k.coverMedia,
        downloads: k.downloadableMedia.map((d) => d.media),
        categories: k.categories.map((c) => c.category),
        tags: k.tags.map((tg) => tg.tag),
        createdAt: k.createdAt,
        updatedAt: k.updatedAt,
      },
    });
  } catch (error) {
    console.error("GET /api/v1/knowledge/[slug] error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
