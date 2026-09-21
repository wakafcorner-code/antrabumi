import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Role, AuditAction } from "@prisma/client";
import { requireUser } from "@/lib/auth/context";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Audit Log — ANTRABUMI Admin",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 50;

const ACTION_LABELS: Record<AuditAction, string> = {
  LOGIN: "Login",
  LOGOUT: "Logout",
  CREATE: "Buat",
  UPDATE: "Ubah",
  DELETE: "Hapus",
  PUBLISH: "Publish",
  UNPUBLISH: "Unpublish",
  ARCHIVE: "Arsip",
  UPLOAD: "Upload",
  USER_ROLE_CHANGED: "Role Diubah",
  SETTING_CHANGED: "Pengaturan Diubah",
};

const ACTION_COLORS: Record<AuditAction, string> = {
  LOGIN: "bg-sky-50 text-sky-700 ring-sky-200",
  LOGOUT: "bg-neutral-50 text-neutral-600 ring-neutral-200",
  CREATE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  UPDATE: "bg-amber-50 text-amber-700 ring-amber-200",
  DELETE: "bg-red-50 text-red-700 ring-red-200",
  PUBLISH: "bg-green-50 text-green-700 ring-green-200",
  UNPUBLISH: "bg-orange-50 text-orange-700 ring-orange-200",
  ARCHIVE: "bg-neutral-100 text-neutral-600 ring-neutral-200",
  UPLOAD: "bg-violet-50 text-violet-700 ring-violet-200",
  USER_ROLE_CHANGED: "bg-rose-50 text-rose-700 ring-rose-200",
  SETTING_CHANGED: "bg-indigo-50 text-indigo-700 ring-indigo-200",
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface SearchParams {
  page?: string;
  action?: string;
  entity?: string;
}

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireUser(Role.ADMIN);

  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page ?? "1", 10));
  const actionFilter = (params.action ?? "") as AuditAction | "";
  const entityFilter = params.entity?.trim() ?? "";

  const where = {
    ...(actionFilter && { action: actionFilter as AuditAction }),
    ...(entityFilter && { entity: { contains: entityFilter } }),
  };

  const [total, logs] = await Promise.all([
    prisma.auditLog.count({ where }),
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const buildUrl = (overrides: Partial<SearchParams>) => {
    const p = new URLSearchParams();
    const merged = { page: String(currentPage), action: actionFilter, entity: entityFilter, ...overrides };
    if (merged.page && merged.page !== "1") p.set("page", merged.page);
    if (merged.action) p.set("action", merged.action);
    if (merged.entity) p.set("entity", merged.entity);
    const qs = p.toString();
    return `/admin/logs${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Audit Log</h1>
          <p className="mt-0.5 text-sm text-neutral-500">
            Rekam jejak seluruh aktivitas sistem. Total: {total.toLocaleString("id-ID")} entri.
          </p>
        </div>
      </div>

      {/* Filters */}
      <form method="GET" className="flex flex-wrap items-center gap-3">
        <select
          name="action"
          defaultValue={actionFilter}
          className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
        >
          <option value="">Semua Aksi</option>
          {Object.entries(ACTION_LABELS).map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="entity"
          defaultValue={entityFilter}
          placeholder="Filter entitas (Experience, Knowledge…)"
          className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 shadow-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 sm:w-64"
        />

        <input type="hidden" name="page" value="1" />

        <button
          type="submit"
          className="rounded-md bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500"
        >
          Filter
        </button>

        {(actionFilter || entityFilter) && (
          <Link
            href="/admin/logs"
            className="text-sm text-neutral-500 underline-offset-2 hover:text-neutral-800 hover:underline"
          >
            Reset
          </Link>
        )}
      </form>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-100 text-sm">
            <thead>
              <tr className="bg-neutral-50 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                <th className="px-5 py-3">Waktu</th>
                <th className="px-5 py-3">Pengguna</th>
                <th className="px-5 py-3">Aksi</th>
                <th className="px-5 py-3">Entitas</th>
                <th className="px-5 py-3">ID Entitas</th>
                <th className="px-5 py-3">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-neutral-400">
                    Tidak ada entri yang sesuai filter.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="group hover:bg-neutral-50/80">
                    <td className="whitespace-nowrap px-5 py-3 font-mono text-xs text-neutral-500">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="px-5 py-3">
                      {log.user ? (
                        <div className="leading-tight">
                          <p className="font-medium text-neutral-800">{log.user.name}</p>
                          <p className="text-xs text-neutral-400">{log.user.role}</p>
                        </div>
                      ) : (
                        <span className="text-neutral-400">Sistem</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${ACTION_COLORS[log.action]}`}
                      >
                        {ACTION_LABELS[log.action]}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-neutral-700">
                      {log.entity ?? <span className="text-neutral-300">—</span>}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-neutral-500">
                      {log.entityId ? log.entityId.slice(0, 12) + "…" : <span className="text-neutral-300">—</span>}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-neutral-500">
                      {log.ipAddress ?? <span className="text-neutral-300">—</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-100 px-5 py-3">
            <p className="text-xs text-neutral-500">
              Halaman {currentPage} dari {totalPages}
            </p>
            <div className="flex items-center gap-2">
              {currentPage > 1 && (
                <Link
                  href={buildUrl({ page: String(currentPage - 1) })}
                  className="rounded px-3 py-1 text-xs font-medium text-neutral-600 ring-1 ring-neutral-200 hover:bg-neutral-50"
                >
                  ← Sebelumnya
                </Link>
              )}
              {currentPage < totalPages && (
                <Link
                  href={buildUrl({ page: String(currentPage + 1) })}
                  className="rounded px-3 py-1 text-xs font-medium text-neutral-600 ring-1 ring-neutral-200 hover:bg-neutral-50"
                >
                  Berikutnya →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
