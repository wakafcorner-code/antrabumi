"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ---------------------------------------------------------------------------
// Navigation structure
// ---------------------------------------------------------------------------

const NAV_GROUPS = [
  {
    label: "Konten",
    items: [
      {
        label: "Hero Slider",
        href: "/admin/hero",
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.75"/>
            <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            <path d="m7 10 3 3 5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
      {
        label: "Konten Beranda",
        href: "/admin/beranda",
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
      {
        label: "Inisiatif",
        href: "/admin/initiatives",
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        label: "Pengetahuan",
        href: "/admin/knowledge",
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 6.5a5 5 0 0 1 5 5v1.5H7V11.5a5 5 0 0 1 5-5zm0-3v1.5M8 3.5l1 1.5M4 7.5l1.5.5M4.5 13l1.5-.5M16 3.5l-1 1.5M20 7.5l-1.5.5M19.5 13l-1.5-.5M7 13h10v2a5 5 0 0 1-10 0v-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
      {
        label: "Tim",
        href: "/admin/people",
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.75"/>
            <path d="M2 21c0-3.87 3.13-7 7-7s7 3.13 7 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            <path d="M19 11c1.66 0 3 1.34 3 3v7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            <path d="M16 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" stroke="currentColor" strokeWidth="1.75"/>
          </svg>
        ),
      },
      {
        label: "Mitra",
        href: "/admin/partners",
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.75"/>
          </svg>
        ),
      },
      {
        label: "Media",
        href: "/admin/media",
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.75"/>
            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
            <path d="m21 15-5-5L5 21" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
    ],
  },
  {
    label: "Komunikasi",
    items: [
      {
        label: "Pesan Masuk",
        href: "/admin/messages",
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round"/>
            <path d="m22 6-10 7L2 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
    ],
  },
  {
    label: "Sistem",
    items: [
      {
        label: "Pengguna",
        href: "/admin/users",
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.75"/>
            <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        label: "Audit Log",
        href: "/admin/logs",
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
            <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.75"/>
            <path d="M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        label: "Pengaturan",
        href: "/admin/settings",
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="1.75"/>
          </svg>
        ),
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const AdminSidebar: React.FC<{ isSuperAdmin: boolean }> = ({ isSuperAdmin }) => {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(href);

  return (
    <>
      <div className="sticky top-0 z-30 border-b border-neutral-200 bg-white lg:hidden">
        <details className="group">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-neutral-900 [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-2">
              <span className="font-mono text-xs tracking-[0.18em]">ANTRABUMI</span>
              <span className="rounded bg-neutral-900 px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-white">CMS</span>
            </span>
            <span className="text-neutral-500 transition-transform group-open:rotate-180" aria-hidden="true">⌄</span>
          </summary>
          <nav className="border-t border-neutral-100 px-3 pb-4 pt-2" aria-label="Navigasi Admin Mobile">
            <Link
              href="/admin"
              className={`mb-2 flex items-center rounded-md px-3 py-2 text-sm font-medium ${isActive("/admin") ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"}`}
            >
              Dashboard
            </Link>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {NAV_GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">{group.label}</p>
                  <div className="space-y-0.5">
                    {group.items.filter((item) => isSuperAdmin || item.href !== "/admin/users").map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium ${isActive(item.href) ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100"}`}
                      >
                        <span className={isActive(item.href) ? "text-white" : "text-neutral-400"}>{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </nav>
        </details>
      </div>

      <aside
      aria-label="Admin Navigation"
      className="hidden min-h-screen w-60 flex-shrink-0 flex-col justify-between border-r border-neutral-200 bg-white lg:flex"
      >
      {/* Wordmark */}
      <div>
        <div className="flex h-16 items-center border-b border-neutral-200 px-5">
          <Link
            href="/admin"
            className="flex items-center gap-2"
            aria-label="ANTRABUMI Admin Dashboard"
          >
            <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-neutral-900">
              ANTRABUMI
            </span>
            <span className="rounded bg-neutral-900 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-white">
              CMS
            </span>
          </Link>
        </div>

        {/* Dashboard link */}
        <div className="px-3 pt-3">
          <Link
            href="/admin"
            className={[
              "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive("/admin")
                ? "bg-neutral-900 text-white"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
            ].join(" ")}
            aria-current={isActive("/admin") ? "page" : undefined}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.75"/>
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.75"/>
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.75"/>
              <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.75"/>
            </svg>
            Dashboard
          </Link>
        </div>

        {/* Nav groups */}
        <nav className="mt-2 space-y-4 px-3 pb-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.filter((item) => isSuperAdmin || item.href !== "/admin/users").map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-neutral-900 text-white"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
                    ].join(" ")}
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    <span
                      className={
                        isActive(item.href) ? "text-white" : "text-neutral-400"
                      }
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t border-neutral-200 px-5 py-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-700"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Lihat Website Publik
        </Link>
      </div>
      </aside>
    </>
  );
};
