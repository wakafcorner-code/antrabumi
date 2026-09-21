import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
  getSessionCookieOptions,
} from "@/lib/auth/session";
import { createAuditLog } from "@/lib/audit/audit";
import { AuditAction } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
    let userId: string | undefined;

    if (sessionCookie?.value) {
      const payload = await verifySessionToken(sessionCookie.value);
      if (payload?.userId) {
        userId = payload.userId;
      }
    }

    if (userId) {
      const ipAddress =
        request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
        request.headers.get("x-real-ip") ||
        undefined;
      const userAgent = request.headers.get("user-agent") || undefined;

      await createAuditLog({
        userId,
        action: AuditAction.LOGOUT,
        entity: "User",
        entityId: userId,
        ipAddress,
        userAgent,
      });
    }

    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    });

    // Clear session cookie
    const cookieOptions = getSessionCookieOptions();
    response.cookies.set(SESSION_COOKIE_NAME, "", {
      ...cookieOptions,
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("[Auth API] Logout error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
