/**
 * src/lib/validation/knowledge.schema.ts
 */
import { z } from "zod";
import { KnowledgeType, ContentStatus } from "@prisma/client";

export const knowledgeSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, "Slug minimal 2 karakter")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  type: z.nativeEnum(KnowledgeType).optional().default(KnowledgeType.ARTICLE),
  status: z.nativeEnum(ContentStatus).optional().default(ContentStatus.DRAFT),
  authorName: z.string().trim().max(150).optional(),
  publicationDate: z.string().optional().nullable(),
  featured: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => val === true || val === "true" || val === "on" || val === "1"),
  coverMediaId: z.string().trim().optional().nullable(),
  titleId: z.string().trim().min(2, "Judul (ID) wajib diisi").max(300),
  excerptId: z.string().trim().max(1000).optional().nullable(),
  bodyId: z.string().trim().optional().nullable(),
  titleEn: z.string().trim().max(300).optional().nullable(),
  excerptEn: z.string().trim().max(1000).optional().nullable(),
  bodyEn: z.string().trim().optional().nullable(),
});

export type KnowledgeFormValues = z.infer<typeof knowledgeSchema>;
