/**
 * src/lib/validation/knowledge.schema.ts
 */
import { z } from "zod";
import { KnowledgeType } from "@prisma/client";

export const knowledgeSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, "Slug minimal 2 karakter")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  type: z.nativeEnum(KnowledgeType).optional().default(KnowledgeType.ARTICLE),
  featured: z.boolean().optional().default(false),
  coverMediaId: z.string().trim().optional(),
  titleId: z.string().trim().min(2, "Judul (ID) wajib diisi").max(300),
  excerptId: z.string().trim().max(500).optional(),
  bodyId: z.string().trim().optional(),
  titleEn: z.string().trim().max(300).optional(),
  excerptEn: z.string().trim().max(500).optional(),
  bodyEn: z.string().trim().optional(),
});

export type KnowledgeFormValues = z.infer<typeof knowledgeSchema>;
