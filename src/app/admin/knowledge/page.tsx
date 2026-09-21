import React from "react";
import Link from "next/link";
import { findKnowledge } from "@/server/repositories/knowledge.repository";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ContentStatus } from "@prisma/client";

interface PageProps {
  searchParams: Promise<{ page?: string; status?: string; q?: string }>;
}

export const metadata = { title: "Pengetahuan — ANTRABUMI Admin" };

export default async function KnowledgePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10);
  const status = params.status as ContentStatus | undefined;
  const search = params.q;

  const { items, total } = await findKnowledge({ page, status, search });
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Pengetahuan</h1>
          <p className="mt-0.5 text-sm text-neutral-500">{total} total entri</p>
        </div>
        <Link
          href="/admin/knowledge/new"
          id="btn-new-knowledge"
          className="flex h-9 items-center gap-1.5 rounded-md bg-neutral-900 px-4 text-sm font-medium text-white transition-opacity hover:opacity-80"
        >
          + Tambah Konten
        </Link>
      </div>

      <form method="GET" className="flex flex-wrap items-center gap-3">
        <input
          name="q"
          defaultValue={search}
          placeholder="Cari judul…"
          className="h-9 rounded-md border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-900"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="h-9 rounded-md border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-900"
        >
          <option value="">Semua Status</option>
          {(["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"] as ContentStatus[]).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button type="submit" className="h-9 rounded-md border border-neutral-200 px-3 text-sm hover:bg-neutral-50">
          Cari
        </button>
      </form>

      {items.length === 0 ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-neutral-200 bg-white text-center">
          <p className="text-sm text-neutral-500">Belum ada konten pengetahuan.</p>
          <Link href="/admin/knowledge/new" className="mt-2 text-sm font-medium text-neutral-800 underline">
            Tambah yang pertama →
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Judul</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Kategori</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {items.map((k) => (
                <tr key={k.id} className="hover:bg-neutral-50/50">
                  <td className="px-4 py-3 font-medium text-neutral-900">
                    {k.titleId ?? <span className="italic text-neutral-400">Tanpa judul</span>}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{k.type}</td>
                  <td className="px-4 py-3"><StatusBadge status={k.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/knowledge/${k.id}/edit`} className="text-xs font-medium text-neutral-700 underline-offset-2 hover:underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-neutral-500">
          <span>Halaman {page} dari {totalPages}</span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={`?page=${page - 1}${status ? `&status=${status}` : ""}${search ? `&q=${search}` : ""}`}
                className="rounded border border-neutral-200 px-3 py-1.5 text-xs hover:bg-neutral-50">← Sebelumnya</Link>
            )}
            {page < totalPages && (
              <Link href={`?page=${page + 1}${status ? `&status=${status}` : ""}${search ? `&q=${search}` : ""}`}
                className="rounded border border-neutral-200 px-3 py-1.5 text-xs hover:bg-neutral-50">Berikutnya →</Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
