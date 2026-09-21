/**
 * src/lib/validation/partner.schema.ts
 */
import { z } from "zod";

export const partnerSchema = z.object({
  name: z.string().trim().min(2, "Nama mitra minimal 2 karakter").max(200),
  slug: z
    .string()
    .trim()
    .min(2, "Slug minimal 2 karakter")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  description: z.string().trim().optional(),
  website: z
    .string()
    .trim()
    .url("Format URL tidak valid")
    .optional()
    .or(z.literal("")),
  logoMediaId: z.string().trim().optional(),
  category: z.string().trim().max(100).optional(),
  order: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 0))
    .pipe(z.number().min(0).optional()),
});

export type PartnerFormValues = z.infer<typeof partnerSchema>;
