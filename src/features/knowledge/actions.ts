"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Role, AuditAction, ContentStatus } from "@prisma/client";
import { requireUser } from "@/lib/auth/context";
import { createAuditLog } from "@/lib/audit/audit";
import { knowledgeSchema } from "@/lib/validation/knowledge.schema";
import { prisma } from "@/lib/db/prisma";
import {
  createKnowledge,
  updateKnowledge,
  updateKnowledgeStatus,
  deleteKnowledge,
} from "@/server/repositories/knowledge.repository";

export type ActionResult = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  downloadId?: string;
};

function slugify(str: string): string {
  return str.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

export async function createKnowledgeAction(formData: FormData): Promise<ActionResult> {
  const user = await requireUser(Role.EDITOR);
  const raw = Object.fromEntries(formData.entries());
  if (!raw.slug && raw.titleId) raw.slug = slugify(raw.titleId as string);

  const parsed = knowledgeSchema.safeParse(raw);
  if (!parsed.success) return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };

  const k = await createKnowledge(parsed.data, user.id);
  await createAuditLog({ userId: user.id, action: AuditAction.CREATE, entity: "Knowledge", entityId: k.id });

  // Optional PDF attachment
  const pdfMediaId = formData.get("pdfMediaId") as string | null;
  const pdfLabel = formData.get("pdfLabel") as string | null;
  if (pdfMediaId && pdfMediaId.trim() !== "") {
    try {
      await prisma.knowledgeDownload.create({
        data: {
          knowledgeId: k.id,
          mediaId: pdfMediaId.trim(),
          label: pdfLabel?.trim() || null,
        },
      });
    } catch (err) {
      console.error("Failed to attach PDF on knowledge creation:", err);
    }
  }

  revalidatePath("/admin/knowledge");
  revalidatePath("/pengetahuan");
  revalidatePath(`/pengetahuan/${k.slug}`);
  revalidatePath("/");
  redirect(`/admin/knowledge/${k.id}/edit`);
}

export async function updateKnowledgeAction(id: string, formData: FormData): Promise<ActionResult> {
  const user = await requireUser(Role.EDITOR);
  const raw = Object.fromEntries(formData.entries());
  const parsed = knowledgeSchema.safeParse(raw);
  if (!parsed.success) return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };

  const updated = await updateKnowledge({ id, ...parsed.data }, user.id);
  await createAuditLog({ userId: user.id, action: AuditAction.UPDATE, entity: "Knowledge", entityId: id });

  revalidatePath("/admin/knowledge");
  revalidatePath(`/admin/knowledge/${id}/edit`);
  revalidatePath("/pengetahuan");
  if (updated?.slug) revalidatePath(`/pengetahuan/${updated.slug}`);
  revalidatePath("/");
  return { success: true };
}

export async function changeKnowledgeStatusAction(id: string, status: ContentStatus): Promise<ActionResult> {
  const user = await requireUser(Role.EDITOR);
  const updated = await updateKnowledgeStatus(id, status, user.id);

  const action =
    status === ContentStatus.PUBLISHED
      ? AuditAction.PUBLISH
      : status === ContentStatus.ARCHIVED
      ? AuditAction.ARCHIVE
      : AuditAction.UPDATE;

  await createAuditLog({
    userId: user.id,
    action,
    entity: "Knowledge",
    entityId: id,
    metadata: { status },
  });

  revalidatePath("/admin/knowledge");
  revalidatePath(`/admin/knowledge/${id}/edit`);
  revalidatePath("/pengetahuan");
  if (updated?.slug) revalidatePath(`/pengetahuan/${updated.slug}`);
  revalidatePath("/");
  return { success: true };
}

export async function deleteKnowledgeAction(id: string): Promise<ActionResult> {
  const user = await requireUser(Role.ADMIN);
  await deleteKnowledge(id);
  await createAuditLog({ userId: user.id, action: AuditAction.DELETE, entity: "Knowledge", entityId: id });

  revalidatePath("/admin/knowledge");
  revalidatePath("/pengetahuan");
  revalidatePath("/");
  redirect("/admin/knowledge");
}

// ── PDF / Download attachment actions ────────────────────────────────────────

export async function attachKnowledgeDownloadAction(
  knowledgeId: string,
  mediaId: string,
  label?: string
): Promise<ActionResult> {
  const user = await requireUser(Role.EDITOR);

  // Verify knowledge exists
  const k = await prisma.knowledge.findUnique({ where: { id: knowledgeId }, select: { id: true, slug: true } });
  if (!k) return { success: false, error: "Konten pengetahuan tidak ditemukan." };

  // Verify media exists
  const media = await prisma.media.findUnique({ where: { id: mediaId }, select: { id: true } });
  if (!media) return { success: false, error: "File media tidak ditemukan." };

  const dl = await prisma.knowledgeDownload.create({
    data: {
      knowledgeId,
      mediaId,
      label: label?.trim() || null,
    },
  });

  await createAuditLog({
    userId: user.id,
    action: AuditAction.UPDATE,
    entity: "Knowledge",
    entityId: knowledgeId,
    metadata: { action: "attach_pdf", mediaId },
  });

  revalidatePath(`/admin/knowledge/${knowledgeId}/edit`);
  revalidatePath("/pengetahuan");
  if (k.slug) revalidatePath(`/pengetahuan/${k.slug}`);
  return { success: true, downloadId: dl.id };
}

export async function removeKnowledgeDownloadAction(
  knowledgeId: string,
  downloadId: string
): Promise<ActionResult> {
  const user = await requireUser(Role.EDITOR);

  const k = await prisma.knowledge.findUnique({ where: { id: knowledgeId }, select: { id: true, slug: true } });
  if (!k) return { success: false, error: "Konten tidak ditemukan." };

  await prisma.knowledgeDownload.deleteMany({
    where: { id: downloadId, knowledgeId },
  });

  await createAuditLog({
    userId: user.id,
    action: AuditAction.UPDATE,
    entity: "Knowledge",
    entityId: knowledgeId,
    metadata: { action: "remove_pdf", downloadId },
  });

  revalidatePath(`/admin/knowledge/${knowledgeId}/edit`);
  revalidatePath("/pengetahuan");
  if (k.slug) revalidatePath(`/pengetahuan/${k.slug}`);
  return { success: true };
}
