"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Role, AuditAction, ContentStatus } from "@prisma/client";
import { requireUser } from "@/lib/auth/context";
import { createAuditLog } from "@/lib/audit/audit";
import { personSchema } from "@/lib/validation/person.schema";
import {
  createPerson,
  updatePerson,
  updatePersonStatus,
  deletePerson,
} from "@/server/repositories/person.repository";

import { prisma } from "@/lib/db/prisma";

export type ActionResult = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

function slugify(str: string): string {
  return str.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

async function resolveMediaId(imageId?: string, imageIdUrl?: unknown, userId?: string): Promise<string | undefined> {
  if (imageId && imageId.trim()) return imageId.trim();
  if (typeof imageIdUrl === "string" && imageIdUrl.trim()) {
    const url = imageIdUrl.trim();
    const existing = await prisma.media.findFirst({ where: { url } });
    if (existing) return existing.id;
    if (userId) {
      const filename = url.split("/").pop()?.split("?")[0] || "image.jpg";
      const created = await prisma.media.create({
        data: {
          type: "IMAGE",
          filename,
          originalName: filename,
          mimeType: "image/jpeg",
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

export async function createPersonAction(formData: FormData): Promise<ActionResult> {
  const user = await requireUser(Role.EDITOR);
  const raw = Object.fromEntries(formData.entries());
  if (!raw.slug && raw.nameId) raw.slug = slugify(raw.nameId as string);

  const parsed = personSchema.safeParse(raw);
  if (!parsed.success) return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };

  const resolvedImageId = await resolveMediaId(parsed.data.imageId, raw.imageIdUrl, user.id);
  const dataToSave = { ...parsed.data, imageId: resolvedImageId };

  const p = await createPerson(dataToSave, user.id);
  await createAuditLog({ userId: user.id, action: AuditAction.CREATE, entity: "Person", entityId: p.id });

  revalidatePath("/admin/people");
  revalidatePath("/tentang");
  revalidatePath("/about");
  revalidatePath("/");
  redirect(`/admin/people/${p.id}/edit`);
}

export async function updatePersonAction(id: string, formData: FormData): Promise<ActionResult> {
  const user = await requireUser(Role.EDITOR);
  const raw = Object.fromEntries(formData.entries());
  const parsed = personSchema.safeParse(raw);
  if (!parsed.success) return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };

  const resolvedImageId = await resolveMediaId(parsed.data.imageId, raw.imageIdUrl, user.id);
  const dataToSave = { ...parsed.data, imageId: resolvedImageId };

  await updatePerson({ id, ...dataToSave }, user.id);
  await createAuditLog({ userId: user.id, action: AuditAction.UPDATE, entity: "Person", entityId: id });

  revalidatePath("/admin/people");
  revalidatePath(`/admin/people/${id}/edit`);
  revalidatePath("/tentang");
  revalidatePath("/about");
  revalidatePath("/");
  return { success: true };
}

export async function changePersonStatusAction(id: string, status: ContentStatus): Promise<ActionResult> {
  const user = await requireUser(Role.EDITOR);
  await updatePersonStatus(id, status, user.id);

  const action =
    status === ContentStatus.PUBLISHED
      ? AuditAction.PUBLISH
      : status === ContentStatus.ARCHIVED
      ? AuditAction.ARCHIVE
      : AuditAction.UPDATE;

  await createAuditLog({
    userId: user.id,
    action,
    entity: "Person",
    entityId: id,
    metadata: { status },
  });

  revalidatePath("/admin/people");
  revalidatePath(`/admin/people/${id}/edit`);
  revalidatePath("/tentang");
  revalidatePath("/about");
  revalidatePath("/");
  return { success: true };
}

export async function deletePersonAction(id: string): Promise<ActionResult> {
  const user = await requireUser(Role.ADMIN);
  await deletePerson(id);
  await createAuditLog({ userId: user.id, action: AuditAction.DELETE, entity: "Person", entityId: id });

  revalidatePath("/admin/people");
  revalidatePath("/tentang");
  revalidatePath("/about");
  revalidatePath("/");
  redirect("/admin/people");
}
