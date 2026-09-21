import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { ContentStatus, Language } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const langParam = (searchParams.get("language")?.toUpperCase() || "ID") as Language;
    const language = langParam === Language.EN ? Language.EN : Language.ID;

    const people = await prisma.person.findMany({
      where: { status: ContentStatus.PUBLISHED },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        slug: true,
        order: true,
        image: {
          select: { id: true, url: true, altText: true },
        },
        translations: {
          where: { language },
          select: {
            name: true,
            role: true,
            degree: true,
            biography: true,
          },
        },
        expertise: {
          orderBy: { order: "asc" },
          select: {
            expertise: { select: { id: true, slug: true, name: true } },
          },
        },
      },
    });

    const formatted = people.map((p) => {
      const t = p.translations[0];
      return {
        id: p.id,
        slug: p.slug,
        order: p.order,
        name: t?.name ?? p.slug,
        role: t?.role ?? null,
        degree: t?.degree ?? null,
        biography: t?.biography ?? null,
        image: p.image,
        expertise: p.expertise.map((e) => e.expertise),
      };
    });

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("GET /api/v1/people error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
