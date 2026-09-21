/**
 * src/app/api/v1/media/upload/route.ts
 *
 * Secure Media Upload endpoint.
 * Accepts multipart/form-data.
 * Requires Role: EDITOR.
 */

import { NextRequest, NextResponse } from "next/server";
import { Role, AuditAction } from "@prisma/client";
import { requireUser } from "@/lib/auth/context";
import { createAuditLog } from "@/lib/audit/audit";
import { storage } from "@/lib/storage";
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
  resolveMediaType,
} from "@/lib/validation/media.schema";
import { createMedia } from "@/server/repositories/media.repository";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(Role.EDITOR);

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const altText = (formData.get("altText") as string | null) ?? undefined;
    const caption = (formData.get("caption") as string | null) ?? undefined;
    const attribution = (formData.get("attribution") as string | null) ?? undefined;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File tidak ditemukan dalam form upload." },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Format file ${file.type} tidak didukung. Format yang diizinkan: JPG, PNG, WebP, SVG, PDF.`,
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `Ukuran file (${(file.size / 1024 / 1024).toFixed(1)}MB) melebihi batas maksimum 15MB.`,
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await storage.upload(buffer, file.name, file.type);
    const mediaType = resolveMediaType(file.type);

    const media = await createMedia({
      type: mediaType,
      filename: uploadResult.storageKey,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      storageKey: uploadResult.storageKey,
      url: uploadResult.url,
      altText,
      caption,
      attribution,
      uploadedById: user.id,
    });

    await createAuditLog({
      userId: user.id,
      action: AuditAction.UPLOAD,
      entity: "Media",
      entityId: media.id,
      metadata: {
        filename: media.filename,
        originalName: media.originalName,
        mimeType: media.mimeType,
        size: Number(media.size),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: media.id,
        filename: media.filename,
        url: media.url,
        type: media.type,
        size: Number(media.size),
        altText: media.altText,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal mengunggah media.";
    const status = message.includes("UNAUTHORIZED") ? 401 : message.includes("FORBIDDEN") ? 403 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
