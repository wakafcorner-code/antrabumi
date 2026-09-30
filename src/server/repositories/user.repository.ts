/**
 * src/server/repositories/user.repository.ts
 * Data access for User management (SUPER_ADMIN only).
 */

import { prisma } from "@/lib/db/prisma";
import { Role, UserStatus, Prisma } from "@prisma/client";

export interface UserListItem {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  lastLoginAt: Date | null;
  createdAt: Date;
}

export async function findUsers(opts: {
  page?: number;
  perPage?: number;
  search?: string;
}): Promise<{ items: UserListItem[]; total: number }> {
  const { page = 1, perPage = 20, search } = opts;
  const skip = (page - 1) * perPage;

  const where: Prisma.UserWhereInput = search
    ? { OR: [{ name: { contains: search } }, { email: { contains: search } }] }
    : {};

  const [items, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      skip,
      take: perPage,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { items, total };
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });
}

export async function updateUserStatus(id: string, status: UserStatus) {
  return prisma.user.update({ where: { id }, data: { status } });
}

export async function updateUserRole(id: string, role: Role) {
  return prisma.user.update({ where: { id }, data: { role } });
}

/** Create a brand-new user (SUPER_ADMIN only). */
export async function createUser(data: {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
}) {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash: data.passwordHash,
      role: data.role,
      status: "ACTIVE",
    },
  });
}

/** Change the email address of an existing user. */
export async function updateUserEmail(id: string, email: string) {
  return prisma.user.update({ where: { id }, data: { email } });
}

/** Replace the password hash of an existing user. */
export async function updateUserPassword(id: string, passwordHash: string) {
  return prisma.user.update({ where: { id }, data: { passwordHash } });
}

/** Update name and/or email together. */
export async function updateUserProfile(
  id: string,
  data: { name?: string; email?: string }
) {
  return prisma.user.update({ where: { id }, data });
}
