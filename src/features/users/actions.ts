"use server";

import { revalidatePath } from "next/cache";
import { Role, UserStatus, AuditAction } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { requireUser } from "@/lib/auth/context";
import { createAuditLog } from "@/lib/audit/audit";
import {
  updateUserRole,
  updateUserStatus,
  createUser,
  updateUserPassword,
  updateUserProfile,
} from "@/server/repositories/user.repository";
import { prisma } from "@/lib/db/prisma";

// ── Schema ─────────────────────────────────────────────────────────────────────

const createUserSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter.").max(100),
  email: z.string().email("Format email tidak valid."),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter.")
    .max(100),
  role: z.nativeEnum(Role),
});

const editProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email("Format email tidak valid.").optional(),
});

const changePasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password minimal 8 karakter.")
    .max(100),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Konfirmasi password tidak cocok.",
  path: ["confirmPassword"],
});

// ── Actions ────────────────────────────────────────────────────────────────────

export async function changeUserRoleAction(targetUserId: string, newRole: Role) {
  const actor = await requireUser(Role.SUPER_ADMIN);

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

/** Create a new user account */
export async function createUserAction(formData: FormData) {
  const actor = await requireUser(Role.SUPER_ADMIN);

  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    role: formData.get("role") as Role,
  };

  const parsed = createUserSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: "Data tidak valid.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // Check email uniqueness
  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return { success: false, error: "Email sudah terdaftar di sistem." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  const user = await createUser({
    name: parsed.data.name,
    email: parsed.data.email,
    passwordHash,
    role: parsed.data.role,
  });

  await createAuditLog({
    userId: actor.id,
    action: AuditAction.CREATE,
    entity: "User",
    entityId: user.id,
    metadata: { name: user.name, email: user.email, role: user.role },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

/** Edit name + email of an existing user */
export async function editUserProfileAction(targetUserId: string, formData: FormData) {
  const actor = await requireUser(Role.SUPER_ADMIN);

  const raw = {
    name: (formData.get("name") as string) || undefined,
    email: (formData.get("email") as string) || undefined,
  };

  const parsed = editProfileSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: "Data tidak valid.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // Check email uniqueness if changing email
  if (parsed.data.email) {
    const existing = await prisma.user.findFirst({
      where: { email: parsed.data.email, NOT: { id: targetUserId } },
    });
    if (existing) {
      return { success: false, error: "Email sudah digunakan akun lain." };
    }
  }

  await updateUserProfile(targetUserId, parsed.data);

  await createAuditLog({
    userId: actor.id,
    action: AuditAction.UPDATE,
    entity: "User",
    entityId: targetUserId,
    metadata: { updated: parsed.data },
  });

  revalidatePath("/admin/users");
  return { success: true };
}

/** Change the password of an existing user */
export async function changeUserPasswordAction(targetUserId: string, formData: FormData) {
  const actor = await requireUser(Role.SUPER_ADMIN);

  const raw = {
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const parsed = changePasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0]?.message ?? "Password tidak valid.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await updateUserPassword(targetUserId, passwordHash);

  await createAuditLog({
    userId: actor.id,
    action: AuditAction.UPDATE,
    entity: "User",
    entityId: targetUserId,
    metadata: { action: "password_changed" },
  });

  revalidatePath("/admin/users");
  return { success: true };
}
