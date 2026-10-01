import React from "react";
import Link from "next/link";
import { Role, MediaType } from "@prisma/client";
import { requireUser } from "@/lib/auth/context";
import { findMedia } from "@/server/repositories/media.repository";
import { MediaGalleryClient } from "./MediaGalleryClient";

interface PageProps {
  searchParams: Promise<{ page?: string; type?: string; q?: string }>;
}

export const metadata = { title: "Perpustakaan Media — ANTRABUMI Admin" };

export default async function MediaPage({ searchParams }: PageProps) {
  await requireUser(Role.EDITOR);

  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10);
  const type = params.type as MediaType | undefined;
  const search = params.q;

  const { items, total } = await findMedia({ page, type, search });
  const totalPages = Math.ceil(total / 24);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Perpustakaan Media</h1>
          <p className="mt-0.5 text-sm text-neutral-500">
            {total} total berkas terunggah (gambar, foto lapangan, dokumen PDF)
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-white p-1">
          <Link
            href="/admin/media"
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              !type ? "bg-neutral-900 text-white" : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Semua Media
          </Link>
          <Link
            href="/admin/media?type=IMAGE"
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              type === "IMAGE" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Gambar & Foto
          </Link>
          <Link
            href="/admin/media?type=DOCUMENT"
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              type === "DOCUMENT" ? "bg-neutral-900 text-white" : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            Dokumen & PDF
          </Link>
        </div>

        <form method="GET" className="flex items-center gap-2">
          {type && <input type="hidden" name="type" value={type} />}
          <input
            name="q"
            defaultValue={search}
            placeholder="Cari nama atau deskripsi…"
            className="h-9 w-full min-w-0 rounded-md border border-neutral-200 bg-white px-3 text-xs outline-none focus:border-neutral-900 sm:w-60"
          />
          <button type="submit" className="h-9 rounded-md border border-neutral-200 px-3 text-xs font-medium hover:bg-neutral-50">
            Cari
          </button>
        </form>
      </div>

      <MediaGalleryClient initialMedia={items} />

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-neutral-500">
          <span>Halaman {page} dari {totalPages}</span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`?page=${page - 1}${type ? `&type=${type}` : ""}${search ? `&q=${search}` : ""}`}
                className="rounded border border-neutral-200 px-3 py-1.5 text-xs hover:bg-neutral-50"
              >
                ← Sebelumnya
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`?page=${page + 1}${type ? `&type=${type}` : ""}${search ? `&q=${search}` : ""}`}
                className="rounded border border-neutral-200 px-3 py-1.5 text-xs hover:bg-neutral-50"
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
