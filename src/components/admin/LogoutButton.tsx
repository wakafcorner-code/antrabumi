"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * AdminLogoutButton
 *
 * Client component. Calls the /api/v1/auth/logout Route Handler which
 * clears the HttpOnly session cookie server-side, then redirects to
 * the login page.
 */
export function AdminLogoutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleLogout() {
    setIsPending(true);
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
    } catch {
      // ignore network errors — proceed to redirect anyway
    } finally {
      router.push("/admin/login");
    }
  }

  return (
    <button
      type="button"
      id="admin-logout-btn"
      onClick={handleLogout}
      disabled={isPending}
      aria-busy={isPending}
      className="flex h-8 items-center gap-1.5 rounded border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-600 transition-colors hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neutral-900 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? (
        <>
          <span
            className="inline-block h-3 w-3 animate-spin rounded-full border border-neutral-300 border-t-neutral-600"
            aria-hidden="true"
          />
          Keluar…
        </>
      ) : (
        <>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Keluar
        </>
      )}
    </button>
  );
}
