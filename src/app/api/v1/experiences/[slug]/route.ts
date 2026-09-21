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

    const exp = await prisma.experience.findUnique({
      where: {
        slug,
        status: ContentStatus.PUBLISHED,
      },
      select: {
        id: true,
        slug: true,
        year: true,
        clientName: true,
        location: true,
        featured: true,
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
            description: true,
            methodology: true,
            impact: true,
          },
        },
        metrics: {
          orderBy: { order: "asc" },
          select: { id: true, label: true, value: true, unit: true },
        },
      },
    });

    if (!exp) {
      return NextResponse.json(
        { success: false, error: "Experience not found or not published" },
        { status: 404 }
      );
    }

    const t = exp.translations[0];

    return NextResponse.json({
      success: true,
      data: {
        id: exp.id,
        slug: exp.slug,
        year: exp.year,
        client: exp.clientName,
        location: exp.location,
        featured: exp.featured,
        title: t?.title ?? exp.slug,
        excerpt: t?.excerpt ?? null,
        description: t?.description ?? null,
        methodology: t?.methodology ?? null,
        impact: t?.impact ?? null,
        coverMedia: exp.coverMedia,
        metrics: exp.metrics,
        createdAt: exp.createdAt,
        updatedAt: exp.updatedAt,
      },
    });
  } catch (error) {
    console.error("GET /api/v1/experiences/[slug] error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
