/**
 * src/lib/validation/experience.schema.ts
 */
import { z } from "zod";

export const experienceSchema = z.object({
  type: z
    .enum(["EXPERIENCE", "INITIATIVE"])
    .optional()
    .default("EXPERIENCE"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug minimal 2 karakter")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  year: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : undefined))
    .pipe(z.number().min(2000).max(2100).optional()),
  category: z.string().trim().max(80).optional(),
  client: z.string().trim().max(200).optional(),
  location: z.string().trim().max(200).optional(),
  featured: z.boolean().optional().default(false),
  order: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 0))
    .pipe(z.number().min(0).optional()),
  coverMediaId: z.string().trim().optional(),
  // ID translations
  titleId: z.string().trim().min(2, "Judul (ID) wajib diisi").max(300),
  excerptId: z.string().trim().max(500).optional(),
  bodyId: z.string().trim().optional(),
  // EN translations (optional)
  titleEn: z.string().trim().max(300).optional(),
  excerptEn: z.string().trim().max(500).optional(),
  bodyEn: z.string().trim().optional(),
});

export type ExperienceFormValues = z.infer<typeof experienceSchema>;
