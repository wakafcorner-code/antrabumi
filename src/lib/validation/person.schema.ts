/**
 * src/lib/validation/person.schema.ts
 */
import { z } from "zod";

export const personSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2, "Slug minimal 2 karakter")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  displayOrder: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 0))
    .pipe(z.number().min(0).optional()),
  imageId: z.string().trim().optional(),
  nameId: z.string().trim().min(2, "Nama (ID) wajib diisi").max(200),
  roleId: z.string().trim().max(200).optional(),
  credentialsId: z.string().trim().max(200).optional(),
  biographyId: z.string().trim().optional(),
  nameEn: z.string().trim().max(200).optional(),
  roleEn: z.string().trim().max(200).optional(),
  biographyEn: z.string().trim().optional(),
});

export type PersonFormValues = z.infer<typeof personSchema>;
