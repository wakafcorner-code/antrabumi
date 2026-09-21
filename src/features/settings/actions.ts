"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Role, AuditAction } from "@prisma/client";
import { requireUser } from "@/lib/auth/context";
import { createAuditLog } from "@/lib/audit/audit";
import { upsertManySettings } from "@/server/repositories/settings.repository";

const settingsSchema = z.record(z.string(), z.string().max(5000));

export async function updateSettingsAction(formData: FormData) {
  const user = await requireUser(Role.ADMIN);

  const pairs: Record<string, string> = {};
  for (const [key, val] of formData.entries()) {
    if (typeof val === "string") {
      pairs[key] = val;
    }
  }

  const parsed = settingsSchema.safeParse(pairs);
  if (!parsed.success) {
    return { success: false, error: "Nilai tidak valid." };
  }

  const updates = Object.entries(parsed.data).map(([key, value]) => ({ key, value }));
  await upsertManySettings(updates);

  await createAuditLog({
    userId: user.id,
    action: AuditAction.UPDATE,
    entity: "SiteSetting",
    entityId: "bulk",
    metadata: { keys: Object.keys(parsed.data) },
  });

  revalidatePath("/admin/settings");
  return { success: true };
}
