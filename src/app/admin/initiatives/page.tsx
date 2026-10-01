import React from "react";
import Link from "next/link";
import { findExperiences } from "@/server/repositories/experience.repository";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ContentStatus } from "@prisma/client";

interface PageProps {
  searchParams: Promise<{ page?: string; status?: string; type?: string; q?: string }>;
}

export const metadata = { title: "Inisiatif & Program — ANTRABUMI Admin" };

export default async function InitiativesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10);
  const status = params.status as ContentStatus | undefined;
  const rawType = params.type;
  const typeFilter = rawType && rawType !== "ALL" ? rawType : undefined;
  const search = params.q;

  const { items, total } = await findExperiences({
    page,
    status,
    search,
    type: typeFilter,
  });
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Inisiatif &amp; Program</h1>
          <p className="mt-0.5 text-sm text-neutral-500">
            {total} total entri (seluruh program lapangan, proyek konservasi, dan inisiatif)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/initiatives/new"
            id="btn-new-initiative"
            className="flex h-9 items-center gap-1.5 rounded-lg bg-[#0D5C4D] px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-[#116958]"
          >
            + Tambah Inisiatif
          </Link>
        </div>
      </div>

      {/* Type Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200 pb-3">
        <Link
          href={`/admin/initiatives${status ? `?status=${status}` : ""}`}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition ${
            !typeFilter
              ? "bg-neutral-900 text-white shadow-xs"
              : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
          }`}
        >
          Semua ({total})
        </Link>
        <Link
          href={`/admin/initiatives?type=EXPERIENCE${status ? `&status=${status}` : ""}`}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition ${
            typeFilter === "EXPERIENCE"
              ? "bg-neutral-900 text-white shadow-xs"
              : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
          }`}
        >
          Proyek &amp; Pengalaman Lapangan
        </Link>
        <Link
          href={`/admin/initiatives?type=INITIATIVE${status ? `&status=${status}` : ""}`}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition ${
            typeFilter === "INITIATIVE"
              ? "bg-neutral-900 text-white shadow-xs"
              : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
          }`}
        >
          Kampanye &amp; Aksi
        </Link>
      </div>

      {/* Search & Status Filters */}
      <form method="GET" className="flex flex-wrap items-center gap-3">
        {typeFilter && <input type="hidden" name="type" value={typeFilter} />}
        <input
          name="q"
          defaultValue={search}
          placeholder="Cari judul inisiatif…"
          className="h-9 w-full min-w-0 rounded-md border border-neutral-200 bg-white px-3 text-xs outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 sm:w-64"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="h-9 rounded-md border border-neutral-200 bg-white px-3 text-xs outline-none focus:border-neutral-900"
        >
          <option value="">Semua Status</option>
          {(["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"] as ContentStatus[]).map(
            (s) => (
              <option key={s} value={s}>
                {s}
              </option>
            )
          )}
        </select>
        <button
          type="submit"
          className="h-9 rounded-md border border-neutral-200 bg-white px-4 text-xs font-medium hover:bg-neutral-50 transition"
        >
          Cari
        </button>
      </form>

      {/* Table */}
      {items.length === 0 ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-white text-center p-6">
          <p className="text-sm font-medium text-neutral-600">Tidak ada inisiatif ditemukan.</p>
          <p className="mt-1 text-xs text-neutral-400">Silakan ubah filter atau tambahkan inisiatif baru.</p>
          <Link
            href="/admin/initiatives/new"
            className="mt-4 rounded-lg bg-[#0D5C4D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#116958]"
          >
            Tambah Inisiatif Baru →
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Judul (ID)
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Tipe / Kategori
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Slug
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Tahun
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50/60 transition">
                  <td className="px-4 py-3 font-medium text-neutral-900 max-w-xs">
                    <p className="truncate font-semibold">{item.titleId ?? <span className="italic text-neutral-400">Tanpa judul</span>}</p>
                    {item.clientName && (
                      <p className="truncate text-xs text-neutral-400">{item.clientName}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`inline-block rounded-md px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
                        item.type === "INITIATIVE"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}>
                        {item.type === "INITIATIVE" ? "Kampanye" : "Proyek"}
                      </span>
                      {item.category && (
                        <span className="rounded bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-600">
                          {item.category}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-neutral-500 max-w-[180px] truncate">
                    {item.slug}
                  </td>
                  <td className="px-4 py-3 text-neutral-600 font-mono text-xs">
                    {item.year ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/initiatives/${item.id}/edit`}
                      className="inline-flex items-center rounded-md border border-neutral-200 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:border-[#0D5C4D] hover:text-[#0D5C4D] transition"
                    >
                      Edit →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>
            Halaman {page} dari {totalPages}
          </span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`?page=${page - 1}${typeFilter ? `&type=${typeFilter}` : ""}${status ? `&status=${status}` : ""}${search ? `&q=${search}` : ""}`}
                className="rounded border border-neutral-200 bg-white px-3 py-1.5 hover:bg-neutral-50 transition"
              >
                ← Sebelumnya
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`?page=${page + 1}${typeFilter ? `&type=${typeFilter}` : ""}${status ? `&status=${status}` : ""}${search ? `&q=${search}` : ""}`}
                className="rounded border border-neutral-200 bg-white px-3 py-1.5 hover:bg-neutral-50 transition"
              >
                Berikutnya →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
