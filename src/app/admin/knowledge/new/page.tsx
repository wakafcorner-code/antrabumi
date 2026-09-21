"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createKnowledgeAction } from "@/features/knowledge/actions";
import { KnowledgeType } from "@prisma/client";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

export default function NewKnowledgePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string[] | undefined>>({});
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});
    setErrorMsg(null);
    const formData = new FormData(e.currentTarget);

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
          <p className="mt-0.5 text-sm text-neutral-500">Artikel, laporan riset, publikasi, atau kajian.</p>
        </div>
        <Link href="/admin/knowledge" className="text-sm text-neutral-500 hover:text-neutral-900">
          ← Kembali
        </Link>
      </div>

      {errorMsg && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{errorMsg}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-neutral-700">Informasi Dasar</legend>

          <Field label="Judul (Bahasa Indonesia) *" error={fieldErrors.titleId?.[0]}>
            <input name="titleId" required className={inputCls} placeholder="cth. Penilaian Ekosistem Digital..." />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Slug URL (opsional, otomatis jika kosong)" error={fieldErrors.slug?.[0]}>
              <input name="slug" className={inputCls} placeholder="cth. penilaian-ekosistem-digital" />
            </Field>

            <Field label="Tipe Konten" error={fieldErrors.type?.[0]}>
              <select name="type" className={inputCls} defaultValue={KnowledgeType.ARTICLE}>
                {Object.values(KnowledgeType).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>
          </div>

          <MediaPicker name="coverMediaId" label="Gambar Sampul / Cover" />

          <Field label="Ringkasan (ID)" error={fieldErrors.excerptId?.[0]}>
            <textarea name="excerptId" rows={3} className={inputCls} placeholder="Ringkasan singkat untuk kartu pratinjau..." />
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

        <div className="flex items-center justify-end gap-3 border-t border-neutral-100 pt-4">
          <Link href="/admin/knowledge" className="rounded-md border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50">
            Batal
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {isPending ? "Menyimpan…" : "Buat Draft"}
          </button>
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
