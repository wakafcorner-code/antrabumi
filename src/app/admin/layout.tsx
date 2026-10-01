import React from "react";
import { AdminSidebar } from "@/components/admin/Sidebar";
import { getCurrentUser } from "@/lib/auth/context";
import { AdminLogoutButton } from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server component — fetch session safely server-side
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-neutral-200 bg-white px-4 py-3 sm:px-6 lg:px-8">
          {/* Left — workspace label */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
              ANTRABUMI
            </span>
            <span className="text-neutral-300">/</span>
            <span className="text-sm font-medium text-neutral-700">
              Admin
            </span>
          </div>

          {/* Right — user identity + logout */}
          {user && (
            <div className="flex min-w-0 items-center gap-2 sm:gap-4">
              <div className="hidden min-w-0 flex-col items-end leading-tight sm:flex">
                <span className="text-sm font-semibold text-neutral-900">
                  <span className="block max-w-[180px] truncate">{user.name}</span>
                </span>
                <span className="text-xs text-neutral-400">{user.role}</span>
              </div>

              {/* Role badge */}
              <span
                className={[
                  "rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                  user.role === "SUPER_ADMIN"
                    ? "bg-neutral-900 text-white"
                    : user.role === "ADMIN"
                      ? "bg-neutral-800 text-white"
                      : user.role === "EDITOR"
                        ? "bg-neutral-200 text-neutral-700"
                        : "bg-neutral-100 text-neutral-500",
                ].join(" ")}
              >
                {user.role.replace("_", " ")}
              </span>

              <AdminLogoutButton />
            </div>
          )}
        </header>

        {/* Main content */}
        <main id="admin-main" className="min-w-0 flex-1 bg-neutral-50/50 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
