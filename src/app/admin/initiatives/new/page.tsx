"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createExperienceAction } from "@/features/experiences/actions";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { PdfPicker } from "@/components/admin/PdfPicker";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

export default function NewInitiativePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string[] | undefined>>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);
    setFieldErrors({});

    startTransition(async () => {
      const result = await createExperienceAction(formData);
      if (result && !result.success) {
        setError(result.error ?? "Terjadi kesalahan.");
        setFieldErrors(result.fieldErrors ?? {});
      }
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-neutral-900">Tambah Inisiatif</h1>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-neutral-500 hover:text-neutral-900"
        >
          ← Kembali
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-neutral-200 bg-white p-6">
        {/* Tipe Inisiatif */}
        <fieldset className="space-y-2">
          <legend className="text-xs font-semibold uppercase tracking-wide text-neutral-600">
            Tipe Inisiatif *
          </legend>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
              <input
                type="radio"
                name="type"
                value="INITIATIVE"
                defaultChecked
                className="accent-neutral-900"
              />
              <span>
                <span className="font-semibold">Kampanye</span>
                <span className="ml-1.5 text-xs text-neutral-400">— Advokasi, aksi, dan kesadaran publik</span>
              </span>
            </label>
            <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
              <input
                type="radio"
                name="type"
                value="EXPERIENCE"
                className="accent-neutral-900"
              />
              <span>
                <span className="font-semibold">Proyek</span>
                <span className="ml-1.5 text-xs text-neutral-400">— Program lapangan dan pendampingan</span>
              </span>
            </label>
          </div>
        </fieldset>

        {/* Status */}
        <fieldset className="space-y-2">
          <legend className="text-xs font-semibold uppercase tracking-wide text-neutral-600">
            Status Publikasi
          </legend>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="DRAFT"
                defaultChecked
                className="accent-neutral-900"
              />
              Draft
            </label>
            <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="PUBLISHED"
                className="accent-neutral-900"
              />
              Published
            </label>
          </div>
        </fieldset>

        <fieldset className="space-y-4 border-t border-neutral-100 pt-4">
          <legend className="text-sm font-semibold text-neutral-700">Informasi Dasar</legend>

          <Field label="Judul (ID) *" error={fieldErrors.titleId?.[0]}>
            <input
              name="titleId"
              className={inputCls}
              placeholder="Contoh: Pelatihan Asesmen Pengembangan Komunitas"
              required
            />
          </Field>

          <Field label="Slug" hint="Akan dibuat otomatis jika kosong" error={fieldErrors.slug?.[0]}>
            <input
              name="slug"
              className={inputCls}
              placeholder="pelatihan-asesmen-pengembangan-komunitas"
            />
          </Field>

          <MediaPicker name="coverMediaId" label="Gambar Sampul / Cover" />

          {/* Dokumen PDF Opsional */}
          <PdfPicker
            name="pdfMediaId"
            labelName="pdfLabel"
            title="Dokumen / Laporan PDF"
            description="Lampirkan dokumen brief inisiatif atau laporan program PDF jika ada (opsional). File dapat diunduh dan dipratinjau langsung di halaman publik."
          />

          <div className="grid grid-cols-2 gap-4">
            <Field label="Tahun" error={fieldErrors.year?.[0]}>
              <input
                name="year"
                type="number"
                min="2000"
                max="2100"
                className={inputCls}
                placeholder="2024"
              />
            </Field>
            <Field label="Kategori / Bidang Kerja" error={fieldErrors.category?.[0]}>
              <select name="category" className={inputCls} defaultValue="">
                <option value="">Pilih kategori…</option>
                <option value="Konservasi, Iklim & Keberlanjutan">01 · Konservasi, Iklim &amp; Keberlanjutan</option>
                <option value="Program & Strategy">02 · Program &amp; Strategy</option>
                <option value="Partnership & Collaboration">03 · Partnership &amp; Collaboration</option>
                <option value="Media, Storytelling & Campaign">04 · Media, Storytelling &amp; Campaign</option>
                <option value="Community Development">05 · Community Development</option>
                <option value="Research, Assessment & Knowledge">06 · Research, Assessment &amp; Knowledge</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Klien / Mitra" error={fieldErrors.client?.[0]}>
              <input name="client" className={inputCls} placeholder="—" />
            </Field>
            <Field label="Lokasi" error={fieldErrors.location?.[0]}>
              <input name="location" className={inputCls} placeholder="—" />
            </Field>
          </div>

          <Field label="Ringkasan (ID)" error={fieldErrors.excerptId?.[0]}>
            <textarea
              name="excerptId"
              rows={3}
              className={inputCls}
              placeholder="Deskripsi singkat inisiatif…"
            />
          </Field>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
              Konten Lengkap (ID)
            </label>
            {fieldErrors.bodyId?.[0] && (
              <p className="text-xs text-red-600">{fieldErrors.bodyId[0]}</p>
            )}
            <RichTextEditor name="bodyId" placeholder="Deskripsi lengkap dan metodologi inisiatif…" />
          </div>
        </fieldset>

        <fieldset className="space-y-4 border-t border-neutral-100 pt-4">
          <legend className="text-sm font-semibold text-neutral-700">
            Konten Bahasa Inggris (opsional)
          </legend>
          <Field label="Judul (EN)" error={fieldErrors.titleEn?.[0]}>
            <input name="titleEn" className={inputCls} placeholder="English title…" />
          </Field>
          <Field label="Ringkasan (EN)" error={fieldErrors.excerptEn?.[0]}>
            <textarea
              name="excerptEn"
              rows={3}
              className={inputCls}
              placeholder="Short description…"
            />
          </Field>
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
              Konten Lengkap (EN)
            </label>
            {fieldErrors.bodyEn?.[0] && (
              <p className="text-xs text-red-600">{fieldErrors.bodyEn[0]}</p>
            )}
            <RichTextEditor
              name="bodyEn"
              placeholder="Full initiative description and methodology in English…"
            />
          </div>
        </fieldset>

        <div className="flex justify-end gap-3 border-t border-neutral-100 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="h-9 rounded-md border border-neutral-200 px-4 text-sm hover:bg-neutral-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="h-9 rounded-md bg-neutral-900 px-5 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {isPending ? "Menyimpan…" : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const inputCls =
  "w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:bg-white focus:ring-2 focus:ring-neutral-900/10";

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
        {label}
        {hint && <span className="ml-1 font-normal normal-case text-neutral-400">— {hint}</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
