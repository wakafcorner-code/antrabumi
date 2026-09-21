"use server";

import { revalidatePath } from "next/cache";
import { Role, UserStatus, AuditAction } from "@prisma/client";
import { requireUser } from "@/lib/auth/context";
import { createAuditLog } from "@/lib/audit/audit";
import { updateUserRole, updateUserStatus } from "@/server/repositories/user.repository";

export async function changeUserRoleAction(targetUserId: string, newRole: Role) {
  const actor = await requireUser(Role.SUPER_ADMIN);

  // Prevent super admin from demoting themselves accidentally
  if (actor.id === targetUserId && newRole !== Role.SUPER_ADMIN) {
    return { success: false, error: "Anda tidak dapat menurunkan peran akun Anda sendiri." };
  }

  await updateUserRole(targetUserId, newRole);

  await createAuditLog({
    userId: actor.id,
    action: AuditAction.USER_ROLE_CHANGED,
    entity: "User",
    entityId: targetUserId,
    metadata: { newRole },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function changeUserStatusAction(targetUserId: string, newStatus: UserStatus) {
  const actor = await requireUser(Role.SUPER_ADMIN);

  if (actor.id === targetUserId && newStatus !== UserStatus.ACTIVE) {
    return { success: false, error: "Anda tidak dapat menonaktifkan akun Anda sendiri." };
  }

  await updateUserStatus(targetUserId, newStatus);

  await createAuditLog({
    userId: actor.id,
    action: AuditAction.UPDATE,
    entity: "User",
    entityId: targetUserId,
    metadata: { newStatus },
  });

  revalidatePath("/admin/users");
  return { success: true };
}
