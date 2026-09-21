import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { ContentStatus, Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category")?.trim();

    const where: Prisma.PartnerWhereInput = {
      status: ContentStatus.PUBLISHED,
    };

    if (category) {
      where.category = category;
    }

    const partners = await prisma.partner.findMany({
      where,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        category: true,
        website: true,
        order: true,
        logoMedia: {
          select: { id: true, url: true, altText: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: partners,
    });
  } catch (error) {
    console.error("GET /api/v1/partners error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
