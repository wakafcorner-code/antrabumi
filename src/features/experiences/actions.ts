"use server";

/**
 * src/features/experiences/actions.ts
 *
 * Server Actions for Experience CRUD + status workflow.
 * All actions enforce RBAC and write audit logs.
 */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Role, AuditAction, ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/auth/context";
import { createAuditLog } from "@/lib/audit/audit";
import { experienceSchema } from "@/lib/validation/experience.schema";
import {
  createExperience,
  updateExperience,
  updateExperienceStatus,
  deleteExperience,
} from "@/server/repositories/experience.repository";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export type ActionResult = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------

export async function createExperienceAction(
  formData: FormData
): Promise<ActionResult> {
  const user = await requireUser(Role.EDITOR);

  const raw = Object.fromEntries(formData.entries());

  // Auto-generate slug from title if not provided
  if (!raw.slug && raw.titleId) {
    raw.slug = slugify(raw.titleId as string);
  }

  const parsed = experienceSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const exp = await createExperience(parsed.data, user.id);

  // Optional PDF attachment
  const pdfMediaId = formData.get("pdfMediaId") as string | null;
  if (pdfMediaId && pdfMediaId.trim() !== "") {
    try {
      await prisma.experienceMedia.create({
        data: {
          experienceId: exp.id,
          mediaId: pdfMediaId.trim(),
          order: 0,
        },
      });
    } catch (err) {
      console.error("Failed to attach PDF on experience creation:", err);
    }
  }

  await createAuditLog({
    userId: user.id,
    action: AuditAction.CREATE,
    entity: "Experience",
    entityId: exp.id,
    metadata: { slug: exp.slug, type: parsed.data.type },
  });

  const isInitiative = parsed.data.type === "INITIATIVE";
  revalidatePath("/admin/experiences");
  revalidatePath("/admin/initiatives");
  revalidatePath("/inisiatif");
  revalidatePath("/pengalaman");
  redirect(`/admin/${ isInitiative ? "initiatives" : "experiences"}/${exp.id}/edit`);
}

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------

export async function updateExperienceAction(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const user = await requireUser(Role.EDITOR);

  const raw = Object.fromEntries(formData.entries());
  const parsed = experienceSchema.safeParse(raw);

  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await updateExperience({ id, ...parsed.data }, user.id);

  await createAuditLog({
    userId: user.id,
    action: AuditAction.UPDATE,
    entity: "Experience",
    entityId: id,
    metadata: { slug: parsed.data.slug },
  });

  revalidatePath("/admin/experiences");
  revalidatePath("/admin/initiatives");
  revalidatePath(`/admin/experiences/${id}/edit`);
  revalidatePath(`/admin/initiatives/${id}/edit`);

  return { success: true };
}

// ---------------------------------------------------------------------------
// Status transitions
// ---------------------------------------------------------------------------

export async function changeExperienceStatusAction(
  id: string,
  status: ContentStatus
): Promise<ActionResult> {
  const user = await requireUser(Role.EDITOR);

  await updateExperienceStatus(id, status, user.id);

  const action =
    status === ContentStatus.PUBLISHED
      ? AuditAction.PUBLISH
      : status === ContentStatus.ARCHIVED
      ? AuditAction.ARCHIVE
      : AuditAction.UPDATE;

  await createAuditLog({
    userId: user.id,
    action,
    entity: "Experience",
    entityId: id,
    metadata: { status },
  });

  revalidatePath("/admin/experiences");
  revalidatePath("/admin/initiatives");
  revalidatePath(`/admin/experiences/${id}/edit`);
  revalidatePath(`/admin/initiatives/${id}/edit`);

  return { success: true };
}

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------

export async function deleteExperienceAction(id: string): Promise<ActionResult> {
  const user = await requireUser(Role.ADMIN);

  await deleteExperience(id);

  await createAuditLog({
    userId: user.id,
    action: AuditAction.DELETE,
    entity: "Experience",
    entityId: id,
  });

  revalidatePath("/admin/experiences");
  revalidatePath("/admin/initiatives");
  redirect("/admin/experiences");
}

// ---------------------------------------------------------------------------
// PDF Actions
// ---------------------------------------------------------------------------

export async function attachExperiencePdfAction(
  experienceId: string,
  mediaId: string
): Promise<ActionResult> {
  const user = await requireUser(Role.EDITOR);
  const exp = await prisma.experience.findUnique({ where: { id: experienceId } });
  if (!exp) return { success: false, error: "Data inisiatif tidak ditemukan." };

  const existing = await prisma.experienceMedia.findUnique({
    where: {
      experienceId_mediaId: { experienceId, mediaId },
    },
  });
  if (!existing) {
    await prisma.experienceMedia.create({
      data: { experienceId, mediaId, order: 0 },
    });
  }

  await createAuditLog({
    userId: user.id,
    action: AuditAction.UPDATE,
    entity: "Experience",
    entityId: experienceId,
    metadata: { action: "attach_pdf", mediaId },
  });

  revalidatePath("/admin/experiences");
  revalidatePath("/admin/initiatives");
  revalidatePath(`/admin/experiences/${experienceId}/edit`);
  revalidatePath(`/admin/initiatives/${experienceId}/edit`);
  revalidatePath("/inisiatif");
  revalidatePath("/pengalaman");
  return { success: true };
}

export async function removeExperiencePdfAction(
  experienceId: string,
  mediaId: string
): Promise<ActionResult> {
  const user = await requireUser(Role.EDITOR);
  await prisma.experienceMedia.deleteMany({
    where: { experienceId, mediaId },
  });

  await createAuditLog({
    userId: user.id,
    action: AuditAction.UPDATE,
    entity: "Experience",
    entityId: experienceId,
    metadata: { action: "remove_pdf", mediaId },
  });

  revalidatePath("/admin/experiences");
  revalidatePath("/admin/initiatives");
  revalidatePath(`/admin/experiences/${experienceId}/edit`);
  revalidatePath(`/admin/initiatives/${experienceId}/edit`);
  revalidatePath("/inisiatif");
  revalidatePath("/pengalaman");
  return { success: true };
}
