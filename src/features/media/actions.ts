"use server";

import { revalidatePath } from "next/cache";
import { Role, AuditAction } from "@prisma/client";
import { requireUser } from "@/lib/auth/context";
import { createAuditLog } from "@/lib/audit/audit";
import { updateMediaMetadataSchema } from "@/lib/validation/media.schema";
import {
  updateMediaMetadata,
  deleteMedia,
} from "@/server/repositories/media.repository";

export async function updateMediaMetadataAction(id: string, formData: FormData) {
  const user = await requireUser(Role.EDITOR);

  const raw = {
    id,
    altText: (formData.get("altText") as string) || null,
    caption: (formData.get("caption") as string) || null,
    attribution: (formData.get("attribution") as string) || null,
  };

  const parsed = updateMediaMetadataSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await updateMediaMetadata(parsed.data);

  await createAuditLog({
    userId: user.id,
    action: AuditAction.UPDATE,
    entity: "Media",
    entityId: id,
    metadata: parsed.data,
  });

  revalidatePath("/admin/media");
  return { success: true };
}

export async function deleteMediaAction(id: string) {
  const user = await requireUser(Role.ADMIN);

  await deleteMedia(id);

  await createAuditLog({
    userId: user.id,
    action: AuditAction.DELETE,
    entity: "Media",
    entityId: id,
  });

  revalidatePath("/admin/media");
  return { success: true };
}
