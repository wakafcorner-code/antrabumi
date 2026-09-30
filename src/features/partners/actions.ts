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

import { prisma } from "@/lib/db/prisma";

export type ActionResult = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

function slugify(str: string): string {
  return str.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

async function resolveMediaId(mediaId?: string, mediaUrl?: unknown, userId?: string): Promise<string | undefined> {
  if (mediaId && mediaId.trim()) return mediaId.trim();
  if (typeof mediaUrl === "string" && mediaUrl.trim()) {
    const url = mediaUrl.trim();
    const existing = await prisma.media.findFirst({ where: { url } });
    if (existing) return existing.id;
    if (userId) {
      const filename = url.split("/").pop()?.split("?")[0] || "logo.png";
      const created = await prisma.media.create({
        data: {
          type: "IMAGE",
          filename,
          originalName: filename,
          mimeType: "image/png",
          size: 0,
          storageKey: url,
          url,
          uploadedById: userId,
        },
      });
      return created.id;
    }
  }
  return undefined;
}

export async function createPartnerAction(formData: FormData): Promise<ActionResult> {
  const user = await requireUser(Role.EDITOR);
  const raw = Object.fromEntries(formData.entries());
  if (!raw.slug && raw.name) raw.slug = slugify(raw.name as string);

  const parsed = partnerSchema.safeParse(raw);
  if (!parsed.success) return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };

  const resolvedLogoId = await resolveMediaId(parsed.data.logoMediaId, raw.logoMediaIdUrl, user.id);
  const dataToSave = { ...parsed.data, logoMediaId: resolvedLogoId };

  const partner = await createPartner(dataToSave);
  await createAuditLog({ userId: user.id, action: AuditAction.CREATE, entity: "Partner", entityId: partner.id });

  revalidatePath("/admin/partners");
  revalidatePath("/kolaborasi");
  revalidatePath("/tentang");
  revalidatePath("/");
  redirect(`/admin/partners/${partner.id}/edit`);
}

export async function updatePartnerAction(id: string, formData: FormData): Promise<ActionResult> {
  const user = await requireUser(Role.EDITOR);
  const raw = Object.fromEntries(formData.entries());
  const parsed = partnerSchema.safeParse(raw);
  if (!parsed.success) return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };

  const resolvedLogoId = await resolveMediaId(parsed.data.logoMediaId, raw.logoMediaIdUrl, user.id);
  const dataToSave = { ...parsed.data, logoMediaId: resolvedLogoId };

  await updatePartner({ id, ...dataToSave });
  await createAuditLog({ userId: user.id, action: AuditAction.UPDATE, entity: "Partner", entityId: id });

  revalidatePath("/admin/partners");
  revalidatePath(`/admin/partners/${id}/edit`);
  revalidatePath("/kolaborasi");
  revalidatePath("/tentang");
  revalidatePath("/");
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
  revalidatePath("/kolaborasi");
  revalidatePath("/tentang");
  revalidatePath("/");
  return { success: true };
}

export async function deletePartnerAction(id: string): Promise<ActionResult> {
  const user = await requireUser(Role.ADMIN);
  await deletePartner(id);
  await createAuditLog({ userId: user.id, action: AuditAction.DELETE, entity: "Partner", entityId: id });

  revalidatePath("/admin/partners");
  revalidatePath("/kolaborasi");
  revalidatePath("/tentang");
  revalidatePath("/");
  redirect("/admin/partners");
}
