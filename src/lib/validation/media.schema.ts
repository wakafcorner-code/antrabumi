/**
 * src/lib/validation/media.schema.ts
 */

import { z } from "zod";
import { MediaType } from "@prisma/client";

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
];

export const ALLOWED_DOCUMENT_MIME_TYPES = [
  "application/pdf",
];

export const ALLOWED_MIME_TYPES = [
  ...ALLOWED_IMAGE_MIME_TYPES,
  ...ALLOWED_DOCUMENT_MIME_TYPES,
];

export const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export function resolveMediaType(mimeType: string): MediaType {
  if (ALLOWED_IMAGE_MIME_TYPES.includes(mimeType)) {
    return MediaType.IMAGE;
  }
  if (ALLOWED_DOCUMENT_MIME_TYPES.includes(mimeType)) {
    return MediaType.DOCUMENT;
  }
  return MediaType.OTHER;
}

export const updateMediaMetadataSchema = z.object({
  id: z.string().min(1, "ID media diperlukan"),
  altText: z.string().trim().max(300).optional().nullable(),
  caption: z.string().trim().max(1000).optional().nullable(),
  attribution: z.string().trim().max(300).optional().nullable(),
});

export type UpdateMediaMetadataValues = z.infer<typeof updateMediaMetadataSchema>;
