"use client";

import React, { useTransition, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createKnowledgeAction } from "@/features/knowledge/actions";
import { ContentStatus } from "@prisma/client";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { PdfPicker } from "@/components/admin/PdfPicker";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

const KNOWLEDGE_TYPE_OPTIONS = [
  { value: "ARTICLE", label: "Artikel" },
  { value: "RESEARCH_PUBLICATION", label: "Riset & Publikasi" },
  { value: "STORY", label: "Cerita Lapangan" },
];

export default function NewKnowledgePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | undefined>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ContentStatus>(ContentStatus.PUBLISHED);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>, overrideStatus?: ContentStatus) {
    e.preventDefault();
    setFieldErrors({});
    setErrorMsg(null);
    const formData = new FormData(e.currentTarget);

    if (overrideStatus) {
      formData.set("status", overrideStatus);
    } else {
      formData.set("status", selectedStatus);
    }

    startTransition(async () => {
      try {
        const res = await createKnowledgeAction(formData);
        if (res && !res.success) {
          if (res.fieldErrors) setFieldErrors(res.fieldErrors);
          if (res.error) setErrorMsg(res.error);
        }
      } catch (err: unknown) {
        // Next.js redirect throws a digest error
        if (err && typeof err === "object" && "digest" in err) {
          router.push("/admin/knowledge");
          return;
        }
        setErrorMsg("Terjadi kesalahan sistem.");
      }
    });
  }

  const inputCls = "w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Tambah Konten Pengetahuan</h1>
          <p className="mt-0.5 text-sm text-neutral-500">Artikel, laporan riset, publikasi, asesmen, atau cerita lapangan.</p>
        </div>
        <Link href="/admin/knowledge" className="text-sm text-neutral-500 hover:text-neutral-900">
          ← Kembali ke Daftar
        </Link>
      </div>

      {errorMsg && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{errorMsg}</div>
      )}

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        {/* Status Publikasi Langsung */}
        <div className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-4">
          <label className="block text-xs font-semibold uppercase tracking-wide text-emerald-900">
            Status Publikasi
          </label>
          <p className="text-xs text-emerald-700 mb-3">
            Pilih status publikasi agar langsung tampil di halaman <Link href="/pengetahuan" target="_blank" className="font-semibold underline">/pengetahuan</Link> atau simpan sebagai draf internal.
          </p>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-neutral-800">
              <input
                type="radio"
                name="statusOption"
                checked={selectedStatus === ContentStatus.PUBLISHED}
                onChange={() => setSelectedStatus(ContentStatus.PUBLISHED)}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                Terbitkan Sekarang (PUBLISHED)
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-neutral-800">
              <input
                type="radio"
                name="statusOption"
                checked={selectedStatus === ContentStatus.DRAFT}
                onChange={() => setSelectedStatus(ContentStatus.DRAFT)}
                className="h-4 w-4 text-neutral-600 focus:ring-neutral-500"
              />
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-neutral-400" />
                Simpan sebagai Draf (DRAFT)
              </span>
            </label>
          </div>
        </div>

        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-neutral-700">Informasi Dasar (Bahasa Indonesia)</legend>

          <Field label="Judul (Bahasa Indonesia) *" error={fieldErrors.titleId?.[0]}>
            <input name="titleId" required className={inputCls} placeholder="cth. Penilaian Ekosistem Digital..." />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Slug URL (opsional, otomatis dibuat jika kosong)" error={fieldErrors.slug?.[0]}>
              <input name="slug" className={inputCls} placeholder="cth. penilaian-ekosistem-digital" />
            </Field>

            <Field label="Tipe Konten" error={fieldErrors.type?.[0]}>
              <select name="type" className={inputCls} defaultValue="ARTICLE">
                {KNOWLEDGE_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Penulis / Kontributor (Opsional)" error={fieldErrors.authorName?.[0]}>
              <input name="authorName" className={inputCls} placeholder="cth. Tim Riset ANTRABUMI / Sendi Kenia" />
            </Field>

            <Field label="Tanggal Publikasi (Opsional)" error={fieldErrors.publicationDate?.[0]}>
              <input
                type="date"
                name="publicationDate"
                className={inputCls}
                defaultValue={new Date().toISOString().slice(0, 10)}
                suppressHydrationWarning
              />
            </Field>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              value="true"
              className="h-4 w-4 rounded border-neutral-300 text-[#0D5C4D] focus:ring-[#0D5C4D]"
            />
            <label htmlFor="featured" className="text-sm text-neutral-700 font-medium cursor-pointer">
              Tandai sebagai Konten Unggulan (Featured) di Beranda & Hub Pengetahuan
            </label>
          </div>

          <MediaPicker name="coverMediaId" label="Gambar Sampul / Cover (PNG, JPG, WebP, atau URL Gambar)" />

          {/* Dokumen PDF Opsional */}
          <PdfPicker
            name="pdfMediaId"
            labelName="pdfLabel"
            title="Dokumen / Berkas PDF"
            description="Lampirkan dokumen atau publikasi PDF jika tersedia (opsional). File dapat diunduh dan dipratinjau langsung di halaman publik."
          />

          <Field label="Ringkasan (ID)" error={fieldErrors.excerptId?.[0]}>
            <textarea name="excerptId" rows={3} className={inputCls} placeholder="Ringkasan singkat untuk kartu pratinjau di halaman /pengetahuan..." />
          </Field>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">Konten Lengkap (ID)</label>
            {fieldErrors.bodyId?.[0] && <p className="text-xs text-red-600">{fieldErrors.bodyId[0]}</p>}
            <RichTextEditor name="bodyId" placeholder="Isi artikel / laporan dalam Bahasa Indonesia…" />
          </div>
        </fieldset>

        <fieldset className="space-y-4 border-t border-neutral-100 pt-4">
          <legend className="text-sm font-semibold text-neutral-700">Konten Bahasa Inggris (Opsional)</legend>

          <Field label="Judul (EN)" error={fieldErrors.titleEn?.[0]}>
            <input name="titleEn" className={inputCls} placeholder="e.g. Digital Ecosystem Assessment..." />
          </Field>

          <Field label="Ringkasan (EN)" error={fieldErrors.excerptEn?.[0]}>
            <textarea name="excerptEn" rows={3} className={inputCls} placeholder="Brief summary for English preview card..." />
          </Field>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">Konten Lengkap (EN)</label>
            {fieldErrors.bodyEn?.[0] && <p className="text-xs text-red-600">{fieldErrors.bodyEn[0]}</p>}
            <RichTextEditor name="bodyEn" placeholder="Full content in English…" />
          </div>
        </fieldset>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-4">
          <Link href="/admin/knowledge" className="rounded-md border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50">
            Batal
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isPending}
              onClick={(e) => {
                const form = e.currentTarget.closest("form");
                if (form) {
                  const event = new Event("submit", { cancelable: true, bubbles: true });
                  setSelectedStatus(ContentStatus.DRAFT);
                  form.dispatchEvent(event);
                }
              }}
              className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
            >
              Simpan sebagai Draf
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-[#0D5C4D] px-5 py-2 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isPending ? "Menyimpan…" : "Terbitkan Sekarang (Publish)"}
            </button>
          </div>
        </div>
      </form>
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
