import React from "react";
import Link from "next/link";
import { findMessages } from "@/server/repositories/message.repository";
import { MessageStatus } from "@prisma/client";

interface PageProps {
  searchParams: Promise<{ page?: string; status?: string }>;
}

export const metadata = { title: "Pesan Masuk — ANTRABUMI Admin" };

const STATUS_BADGE: Record<MessageStatus, { label: string; cls: string }> = {
  NEW: { label: "Baru", cls: "bg-blue-50 text-blue-700 border-blue-200" },
  READ: { label: "Dibaca", cls: "bg-neutral-50 text-neutral-600 border-neutral-200" },
  IN_PROGRESS: { label: "Diproses", cls: "bg-amber-50 text-amber-800 border-amber-200" },
  RESOLVED: { label: "Selesai", cls: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  ARCHIVED: { label: "Diarsipkan", cls: "bg-neutral-100 text-neutral-400 border-neutral-200" },
};

export default async function MessagesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10);
  const status = params.status as MessageStatus | undefined;

  const { items, total } = await findMessages({ page, status });
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Pesan Masuk</h1>
          <p className="mt-0.5 text-sm text-neutral-500">{total} pesan dari formulir kontak publik</p>
        </div>
      </div>

      <form method="GET" className="flex items-center gap-3">
        <select
          name="status"
          defaultValue={status ?? ""}
          className="h-9 rounded-md border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-900"
        >
          <option value="">Semua Status Pesan</option>
          {Object.values(MessageStatus).map((s) => (
            <option key={s} value={s}>{STATUS_BADGE[s].label} ({s})</option>
          ))}
        </select>
        <button type="submit" className="h-9 rounded-md border border-neutral-200 px-3 text-sm hover:bg-neutral-50">
          Filter
        </button>
      </form>

      {items.length === 0 ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-neutral-200 bg-white text-center">
          <p className="text-sm text-neutral-500">Belum ada pesan masuk.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Pengirim</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Tipe / Bidang</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Subjek</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Tanggal</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {items.map((m) => (
                <tr key={m.id} className="hover:bg-neutral-50/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-neutral-900">{m.name}</p>
                    <p className="text-xs text-neutral-500">{m.email}</p>
                    {m.organization && (
                      <p className="mt-0.5 text-xs text-neutral-400 font-mono">{m.organization}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {m.areaOfInterest ? (
                      <span className="inline-flex items-center rounded-full bg-[#0D5C4D]/10 px-2.5 py-0.5 text-xs font-medium text-[#0D5C4D] border border-[#0D5C4D]/20">
                        {m.areaOfInterest}
                      </span>
                    ) : (
                      <span className="text-xs text-neutral-400">Umum / Pesan</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-700">{m.subject ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[m.status]?.cls ?? "bg-neutral-50 text-neutral-600"}`}>
                      {STATUS_BADGE[m.status]?.label ?? m.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-500">
                    {new Date(m.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/messages/${m.id}`} className="inline-flex items-center rounded-lg border border-neutral-200 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:border-[#0D5C4D] hover:text-[#0D5C4D] transition-colors">
                      Buka Pesan →
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
              <Link href={`?page=${page - 1}${status ? `&status=${status}` : ""}`}
                className="rounded border border-neutral-200 px-3 py-1.5 text-xs hover:bg-neutral-50">← Sebelumnya</Link>
            )}
            {page < totalPages && (
              <Link href={`?page=${page + 1}${status ? `&status=${status}` : ""}`}
                className="rounded border border-neutral-200 px-3 py-1.5 text-xs hover:bg-neutral-50">Berikutnya →</Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
