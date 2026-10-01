"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { KnowledgeType, ContentStatus } from "@prisma/client";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { PdfUploader } from "@/components/admin/PdfUploader";
import { ImageGalleryPicker, GalleryImage } from "@/components/admin/ImageGalleryPicker";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  updateKnowledgeAction,
  changeKnowledgeStatusAction,
  deleteKnowledgeAction,
  attachKnowledgeDownloadAction,
  removeKnowledgeDownloadAction,
  attachKnowledgeImageAction,
  removeKnowledgeImageAction,
} from "@/features/knowledge/actions";

const KNOWLEDGE_TYPE_OPTIONS = [
  { value: "ARTICLE", label: "Artikel" },
  { value: "RESEARCH_PUBLICATION", label: "Riset & Publikasi" },
  { value: "STORY", label: "Cerita Lapangan" },
];

interface PdfItem {
  id: string;
  label: string | null;
  mediaId: string;
  url: string;
  filename: string;
  size?: number | null;
}

interface KnowledgeEditClientProps {
  id: string;
  slug: string;
  type: KnowledgeType;
  status: ContentStatus;
  featured: boolean;
  authorName: string | null;
  coverMediaId: string | null;
  coverMediaUrl: string | null;
  titleId: string;
  excerptId: string | null;
  bodyId: string | null;
  titleEn: string | null;
  excerptEn: string | null;
  bodyEn: string | null;
  pdfAttachments: PdfItem[];
  galleryImages: GalleryImage[];
}

export function KnowledgeEditClient({
  id,
  slug,
  type,
  status,
  featured,
  authorName,
  coverMediaId,
  coverMediaUrl,
  titleId,
  excerptId,
  bodyId,
  titleEn,
  excerptEn,
  bodyEn,
  pdfAttachments: initialPdfs,
  galleryImages: initialGalleryImages,
}: KnowledgeEditClientProps) {
  const [isPending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | undefined>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [pdfList, setPdfList] = useState<PdfItem[]>(initialPdfs);
  const [showDelete, setShowDelete] = useState(false);

  const inputCls =
    "w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#0D5C4D] focus:ring-2 focus:ring-[#0D5C4D]/10";

  // ── Save core content ──────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});
    setErrorMsg(null);
    setSuccessMsg(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await updateKnowledgeAction(id, formData);
      if (res?.success) {
        setSuccessMsg("Konten berhasil disimpan.");
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        if (res?.fieldErrors) setFieldErrors(res.fieldErrors);
        if (res?.error) setErrorMsg(res.error);
      }
    });
  }

  // ── Status change ──────────────────────────────────────────────────────────
  function handleStatusChange(newStatus: ContentStatus) {
    startTransition(async () => {
      const res = await changeKnowledgeStatusAction(id, newStatus);
      if (res?.success) {
        setSuccessMsg(`Status diubah ke ${newStatus}.`);
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(res?.error ?? "Gagal mengubah status.");
      }
    });
  }

  // ── PDF: Upload new ────────────────────────────────────────────────────────
  function handlePdfUploaded(media: { id: string; url: string; filename: string; size?: number }) {
    startTransition(async () => {
      const res = await attachKnowledgeDownloadAction(id, media.id);
      if (res?.success) {
        setPdfList((prev) => [
          ...prev,
          {
            id: res.downloadId || `temp-${Date.now()}`,
            label: null,
            mediaId: media.id,
            url: media.url,
            filename: media.filename,
            size: media.size,
          },
        ]);
        setSuccessMsg("PDF berhasil dilampirkan.");
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(res?.error ?? "Gagal melampirkan PDF.");
      }
    });
  }

  // ── PDF: Remove ────────────────────────────────────────────────────────────
  function handlePdfRemove(downloadId: string) {
    startTransition(async () => {
      const res = await removeKnowledgeDownloadAction(id, downloadId);
      if (res?.success) {
        setPdfList((prev) => prev.filter((p) => p.id !== downloadId));
        setSuccessMsg("PDF berhasil dihapus.");
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setErrorMsg(res?.error ?? "Gagal menghapus PDF.");
      }
    });
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  function handleDelete() {
    startTransition(async () => {
      await deleteKnowledgeAction(id);
    });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">

      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-semibold text-neutral-900">Edit Konten Pengetahuan</h1>
            <StatusBadge status={status} />
          </div>
          <p className="mt-1 text-sm text-neutral-500 font-mono">/{slug}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/pengetahuan/${slug}`}
            target="_blank"
            className="rounded-md border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
          >
            Lihat Publik ↗
          </Link>
          <Link href="/admin/knowledge" className="text-sm text-neutral-500 hover:text-neutral-900">
            ← Kembali
          </Link>
        </div>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="rounded-md bg-red-50 border border-red-100 p-3 text-sm text-red-700">{errorMsg}</div>
      )}
      {successMsg && (
        <div className="rounded-md bg-emerald-50 border border-emerald-100 p-3 text-sm text-emerald-700">
          ✓ {successMsg}
        </div>
      )}

      {/* ── STATUS CONTROL ── */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm space-y-3">
        <h2 className="text-sm font-semibold text-neutral-800">Status Publikasi</h2>
        <div className="flex flex-wrap gap-2">
          {(["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"] as ContentStatus[]).map((s) => (
            <button
              key={s}
              type="button"
              disabled={isPending || status === s}
              onClick={() => handleStatusChange(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-50 ${
                status === s
                  ? "bg-neutral-900 text-white cursor-default"
                  : "border border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-neutral-400">
          Hanya konten berstatus <strong>PUBLISHED</strong> yang tampil di halaman publik /pengetahuan.
        </p>
      </div>

      {/* ── MAIN EDIT FORM ── */}
      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">

        {/* ── Info Dasar ── */}
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-neutral-700">Informasi Dasar</legend>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Slug URL" error={fieldErrors.slug?.[0]}>
              <input name="slug" defaultValue={slug} className={inputCls} />
            </Field>
            <Field label="Tipe Konten" error={fieldErrors.type?.[0]}>
              <select name="type" defaultValue={type} className={inputCls}>
                {KNOWLEDGE_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Penulis / Kontributor" error={fieldErrors.authorName?.[0]}>
              <input name="authorName" defaultValue={authorName ?? ""} className={inputCls} placeholder="cth. Tim Riset ANTRABUMI" />
            </Field>
            <Field label="Tanggal Publikasi" error={fieldErrors.publicationDate?.[0]}>
              <input type="date" name="publicationDate" className={inputCls} />
            </Field>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              value="true"
              defaultChecked={featured}
              className="h-4 w-4 rounded border-neutral-300 text-[#0D5C4D] focus:ring-[#0D5C4D]"
            />
            <label htmlFor="featured" className="text-sm text-neutral-700 font-medium cursor-pointer">
              Tandai sebagai Konten Unggulan (Featured)
            </label>
          </div>

          <MediaPicker name="coverMediaId" initialMediaId={coverMediaId} initialUrl={coverMediaUrl} label="Gambar Sampul / Cover" />
          <ImageGalleryPicker
            initialImages={initialGalleryImages}
            label="Galeri Gambar Pengetahuan"
            onChange={async (images) => {
              const currentIds = new Set(initialGalleryImages.map((image) => image.id));
              const nextIds = new Set(images.map((image) => image.id));
              await Promise.all([
                ...images.filter((image) => !currentIds.has(image.id)).map((image) => attachKnowledgeImageAction(id, image.id)),
                ...initialGalleryImages.filter((image) => !nextIds.has(image.id)).map((image) => removeKnowledgeImageAction(id, image.id)),
              ]);
            }}
          />

          {/* Dokumen / PDF Unduhan (Opsional) */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-50 text-red-600 font-bold text-xs">
                📄
              </span>
              <label className="text-xs font-semibold uppercase tracking-wide text-neutral-800">
                Dokumen / Laporan PDF
              </label>
              <span className="rounded-full bg-neutral-200/80 px-2 py-0.5 text-[10px] font-medium text-neutral-600">
                Opsional
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              Lampirkan dokumen riset, publikasi, policy brief, atau laporan lengkap PDF jika tersedia (opsional). Pengunjung dapat melihat pratinjau dan mengunduh berkas ini.
            </p>
            <PdfUploader
              existing={pdfList}
              disabled={isPending}
              onUploaded={handlePdfUploaded}
              onRemove={handlePdfRemove}
            />
          </div>
        </fieldset>

        {/* ── Konten Bahasa Indonesia ── */}
        <fieldset className="space-y-4 border-t border-neutral-100 pt-4">
          <legend className="text-sm font-semibold text-neutral-700">Konten Bahasa Indonesia</legend>

          <Field label="Judul (ID) *" error={fieldErrors.titleId?.[0]}>
            <input name="titleId" required defaultValue={titleId} className={inputCls} />
          </Field>
          <Field label="Ringkasan (ID)" error={fieldErrors.excerptId?.[0]}>
            <textarea name="excerptId" rows={3} defaultValue={excerptId ?? ""} className={inputCls} />
          </Field>
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">Konten Lengkap (ID)</label>
            <RichTextEditor name="bodyId" defaultValue={bodyId ?? ""} placeholder="Isi artikel dalam Bahasa Indonesia…" />
          </div>
        </fieldset>

        {/* ── Konten Bahasa Inggris ── */}
        <fieldset className="space-y-4 border-t border-neutral-100 pt-4">
          <legend className="text-sm font-semibold text-neutral-700">Konten Bahasa Inggris (Opsional)</legend>

          <Field label="Judul (EN)" error={fieldErrors.titleEn?.[0]}>
            <input name="titleEn" defaultValue={titleEn ?? ""} className={inputCls} />
          </Field>
          <Field label="Ringkasan (EN)" error={fieldErrors.excerptEn?.[0]}>
            <textarea name="excerptEn" rows={3} defaultValue={excerptEn ?? ""} className={inputCls} />
          </Field>
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">Konten Lengkap (EN)</label>
            <RichTextEditor name="bodyEn" defaultValue={bodyEn ?? ""} placeholder="Full content in English…" />
          </div>
        </fieldset>

        {/* ── Submit ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-4">
          <button
            type="button"
            onClick={() => setShowDelete(true)}
            className="rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
            disabled={isPending}
          >
            Hapus Konten
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-[#0D5C4D] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#116958] disabled:opacity-50"
          >
            {isPending ? "Menyimpan…" : "Simpan Perubahan"}
          </button>
        </div>
      </form>

      {/* ── PDF / DOKUMEN UNDUHAN ── */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-neutral-800">📄 Dokumen / PDF Unduhan</h2>
          <p className="mt-0.5 text-xs text-neutral-500">
            File PDF yang diunggah di sini akan tampil sebagai tombol &ldquo;Lihat&rdquo; dan &ldquo;Unduh&rdquo; di halaman publik konten ini.
          </p>
        </div>

        <PdfUploader
          existing={pdfList}
          onUploaded={handlePdfUploaded}
          onRemove={handlePdfRemove}
          disabled={isPending}
        />
      </div>

      {/* ── DELETE CONFIRM ── */}
      {showDelete && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-red-800">Hapus konten ini secara permanen?</h3>
          <p className="text-xs text-red-700">
            Tindakan ini tidak dapat dibatalkan. Seluruh terjemahan dan lampiran akan ikut terhapus.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              disabled={isPending}
              onClick={handleDelete}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              {isPending ? "Menghapus…" : "Ya, Hapus Sekarang"}
            </button>
            <button
              type="button"
              onClick={() => setShowDelete(false)}
              className="rounded-md border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
