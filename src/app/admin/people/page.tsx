import React from "react";
import Link from "next/link";
import { findPeople } from "@/server/repositories/person.repository";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ContentStatus } from "@prisma/client";

interface PageProps {
  searchParams: Promise<{ page?: string; status?: string; q?: string }>;
}

export const metadata = { title: "Tim & Profil — ANTRABUMI Admin" };

export default async function PeoplePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10);
  const status = params.status as ContentStatus | undefined;
  const search = params.q;

  const { items, total } = await findPeople({ page, status, search });
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Tim & Tokoh</h1>
          <p className="mt-0.5 text-sm text-neutral-500">{total} total profil tim/kolektif</p>
        </div>
        <Link
          href="/admin/people/new"
          id="btn-new-person"
          className="flex h-9 items-center gap-1.5 rounded-md bg-neutral-900 px-4 text-sm font-medium text-white transition-opacity hover:opacity-80"
        >
          + Tambah Profil
        </Link>
      </div>

      <form method="GET" className="flex flex-wrap items-center gap-3">
        <input
          name="q"
          defaultValue={search}
          placeholder="Cari nama profil…"
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
          <p className="text-sm text-neutral-500">Belum ada profil tim.</p>
          <Link href="/admin/people/new" className="mt-2 text-sm font-medium text-neutral-800 underline">
            Tambah profil pertama →
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Nama</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Peran</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Urutan</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {items.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50/50">
                  <td className="px-4 py-3 font-medium text-neutral-900">
                    {p.name ?? <span className="italic text-neutral-400">Tanpa nama</span>}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{p.roleId ?? "—"}</td>
                  <td className="px-4 py-3 text-neutral-500">{p.order}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/people/${p.id}/edit`} className="text-xs font-medium text-neutral-700 underline-offset-2 hover:underline">
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
