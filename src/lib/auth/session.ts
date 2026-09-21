import { SignJWT, jwtVerify } from "jose";
import { Role } from "@prisma/client";

export const SESSION_COOKIE_NAME = "antrabumi_session";
export const SESSION_EXPIRATION_SECONDS = 7 * 24 * 60 * 60; // 7 days

export interface SessionPayload {
  userId: string;
  email: string;
  role: Role;
  name: string;
  [key: string]: unknown;
}

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "CRITICAL: AUTH_SECRET must be at least 32 characters long in production."
      );
    }
    // Fallback for development/testing if missing
    return new TextEncoder().encode(
      "antrabumi-dev-secret-key-super-secure-32chars-minimum"
    );
  }
  return new TextEncoder().encode(secret);
}

/**
 * Sign a JWT session token with HS256.
 */
export async function signSessionToken(
  payload: SessionPayload,
  expiresIn: string = "7d"
): Promise<string> {
  const secret = getSecretKey();
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}

/**
 * Verify and decode a JWT session token.
 * Returns null if the token is invalid or expired.
 */
export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const secret = getSecretKey();
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    if (
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.role !== "string"
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role as Role,
      name: (payload.name as string) ?? "",
    };
  } catch {
    return null;
  }
}

/**
 * Default secure cookie options for session cookie.
 */
export function getSessionCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_EXPIRATION_SECONDS,
  };
}
