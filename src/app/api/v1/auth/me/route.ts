import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/context";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        imageId: user.imageId,
        lastLoginAt: user.lastLoginAt,
      },
    });
  } catch (error) {
    console.error("[Auth API] Me error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
