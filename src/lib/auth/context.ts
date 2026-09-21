import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { verifySessionToken, SESSION_COOKIE_NAME } from "./session";
import { hasMinimumRole } from "@/lib/permissions/rbac";
import { Role, UserStatus } from "@prisma/client";

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  imageId: string | null;
  lastLoginAt: Date | null;
  createdAt: Date;
}

/**
 * Get the currently authenticated user from session cookie.
 * Validates session signature AND verifies user status is ACTIVE in the database.
 * Never returns sensitive fields like passwordHash.
 */
export async function getCurrentUser(): Promise<SafeUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) {
      return null;
    }

    const payload = await verifySessionToken(sessionCookie.value);
    if (!payload?.userId) {
      return null;
    }

    // Query database to ensure user still exists and status is ACTIVE
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        imageId: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });

    if (!user || user.status !== UserStatus.ACTIVE) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

/**
 * Require an authenticated user with an optional minimum role requirement.
 * Throws an Error if unauthorized or insufficient permissions.
 */
export async function requireUser(minimumRole?: Role): Promise<SafeUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHORIZED: Authentication required.");
  }

  if (minimumRole && !hasMinimumRole(user.role, minimumRole)) {
    throw new Error("FORBIDDEN: Insufficient permissions.");
  }

  return user;
}
