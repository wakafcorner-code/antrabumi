import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";

const schema = z.object({
  name: z.string().min(2, "Nama terlalu pendek.").max(120),
  email: z.string().email("Email tidak valid."),
  phone: z.string().max(50).optional(),
  organization: z.string().max(150).optional(),
  areaOfInterest: z.string().max(150).optional(),
  subject: z.string().max(200).optional(),
  message: z.string().min(5, "Pesan terlalu pendek.").max(5000),
});

export async function POST(req: NextRequest) {
  try {
    let rawBody: Record<string, unknown> = {};

    // Support both JSON payload and FormData
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      rawBody = await req.json();
    } else {
      rawBody = Object.fromEntries((await req.formData()).entries());
    }

    const parsed = schema.safeParse(rawBody);

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      if (req.headers.get("accept")?.includes("application/json") || contentType.includes("application/json")) {
        return NextResponse.json({ success: false, errors }, { status: 422 });
      }
      return NextResponse.redirect(new URL("/kolaborasi?error=validation", req.url), 303);
    }

    await prisma.contactMessage.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        organization: parsed.data.organization || null,
        areaOfInterest: parsed.data.areaOfInterest || null,
        subject: parsed.data.subject || "Kolaborasi",
        message: parsed.data.message,
      },
    });

    if (req.headers.get("accept")?.includes("application/json") || contentType.includes("application/json")) {
      return NextResponse.json({ success: true, message: "Pesan atau pengajuan kolaborasi Anda berhasil dikirim." });
    }
    return NextResponse.redirect(new URL("/kolaborasi?sent=1", req.url), 303);
  } catch (err) {
    console.error("[contact] Error:", err);
    if (req.headers.get("accept")?.includes("application/json") || req.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json({ success: false, error: "Terjadi kesalahan internal pada server." }, { status: 500 });
    }
    return NextResponse.redirect(new URL("/kolaborasi?error=server", req.url), 303);
  }
}
