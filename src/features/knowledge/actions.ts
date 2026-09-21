"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Role, AuditAction, ContentStatus } from "@prisma/client";
import { requireUser } from "@/lib/auth/context";
import { createAuditLog } from "@/lib/audit/audit";
import { knowledgeSchema } from "@/lib/validation/knowledge.schema";
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

  revalidatePath("/admin/knowledge");
  redirect(`/admin/knowledge/${k.id}/edit`);
}

export async function updateKnowledgeAction(id: string, formData: FormData): Promise<ActionResult> {
  const user = await requireUser(Role.EDITOR);
  const raw = Object.fromEntries(formData.entries());
  const parsed = knowledgeSchema.safeParse(raw);
  if (!parsed.success) return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };

  await updateKnowledge({ id, ...parsed.data }, user.id);
  await createAuditLog({ userId: user.id, action: AuditAction.UPDATE, entity: "Knowledge", entityId: id });

  revalidatePath("/admin/knowledge");
  revalidatePath(`/admin/knowledge/${id}/edit`);
  return { success: true };
}

export async function changeKnowledgeStatusAction(id: string, status: ContentStatus): Promise<ActionResult> {
  const user = await requireUser(Role.EDITOR);
  await updateKnowledgeStatus(id, status, user.id);

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
  return { success: true };
}

export async function deleteKnowledgeAction(id: string): Promise<ActionResult> {
  const user = await requireUser(Role.ADMIN);
  await deleteKnowledge(id);
  await createAuditLog({ userId: user.id, action: AuditAction.DELETE, entity: "Knowledge", entityId: id });

  revalidatePath("/admin/knowledge");
  redirect("/admin/knowledge");
}
