"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Role, AuditAction, ContentStatus } from "@prisma/client";
import { requireUser } from "@/lib/auth/context";
import { createAuditLog } from "@/lib/audit/audit";
import { partnerSchema } from "@/lib/validation/partner.schema";
import {
  createPartner,
  updatePartner,
  updatePartnerStatus,
  deletePartner,
} from "@/server/repositories/partner.repository";

export type ActionResult = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

function slugify(str: string): string {
  return str.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

export async function createPartnerAction(formData: FormData): Promise<ActionResult> {
  const user = await requireUser(Role.EDITOR);
  const raw = Object.fromEntries(formData.entries());
  if (!raw.slug && raw.name) raw.slug = slugify(raw.name as string);

  const parsed = partnerSchema.safeParse(raw);
  if (!parsed.success) return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };

  const partner = await createPartner(parsed.data);
  await createAuditLog({ userId: user.id, action: AuditAction.CREATE, entity: "Partner", entityId: partner.id });

  revalidatePath("/admin/partners");
  redirect(`/admin/partners/${partner.id}/edit`);
}

export async function updatePartnerAction(id: string, formData: FormData): Promise<ActionResult> {
  const user = await requireUser(Role.EDITOR);
  const raw = Object.fromEntries(formData.entries());
  const parsed = partnerSchema.safeParse(raw);
  if (!parsed.success) return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };

  await updatePartner({ id, ...parsed.data });
  await createAuditLog({ userId: user.id, action: AuditAction.UPDATE, entity: "Partner", entityId: id });

  revalidatePath("/admin/partners");
  revalidatePath(`/admin/partners/${id}/edit`);
  return { success: true };
}

export async function changePartnerStatusAction(id: string, status: ContentStatus): Promise<ActionResult> {
  const user = await requireUser(Role.EDITOR);
  await updatePartnerStatus(id, status);

  const action =
    status === ContentStatus.PUBLISHED
      ? AuditAction.PUBLISH
      : status === ContentStatus.ARCHIVED
      ? AuditAction.ARCHIVE
      : AuditAction.UPDATE;

  await createAuditLog({
    userId: user.id,
    action,
    entity: "Partner",
    entityId: id,
    metadata: { status },
  });

  revalidatePath("/admin/partners");
  revalidatePath(`/admin/partners/${id}/edit`);
  return { success: true };
}

export async function deletePartnerAction(id: string): Promise<ActionResult> {
  const user = await requireUser(Role.ADMIN);
  await deletePartner(id);
  await createAuditLog({ userId: user.id, action: AuditAction.DELETE, entity: "Partner", entityId: id });

  revalidatePath("/admin/partners");
  redirect("/admin/partners");
}
