"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPartnerAction } from "@/features/partners/actions";
import { MediaPicker } from "@/components/admin/MediaPicker";

export default function NewPartnerPage() {
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
        const res = await createPartnerAction(formData);
        if (res && !res.success) {
          if (res.fieldErrors) setFieldErrors(res.fieldErrors);
          if (res.error) setErrorMsg(res.error);
        }
      } catch (err: unknown) {
        if (err && typeof err === "object" && "digest" in err) {
          router.push("/admin/partners");
          return;
        }
        setErrorMsg("Terjadi kesalahan sistem.");
      }
    });
  }

  const inputCls = "w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Tambah Mitra Baru</h1>
          <p className="mt-0.5 text-sm text-neutral-500">Mitra kolaborator, institusi, atau komunitas donor/mitra kerja.</p>
        </div>
        <Link href="/admin/partners" className="text-sm text-neutral-500 hover:text-neutral-900">
          ← Kembali
        </Link>
      </div>

      {errorMsg && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{errorMsg}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <Field label="Nama Mitra / Institusi *" error={fieldErrors.name?.[0]}>
          <input name="name" required className={inputCls} placeholder="cth. Kementerian Lingkungan Hidup..." />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Slug URL (opsional, otomatis jika kosong)" error={fieldErrors.slug?.[0]}>
            <input name="slug" className={inputCls} placeholder="cth. kementerian-lh" />
          </Field>

          <Field label="Kategori Mitra" error={fieldErrors.category?.[0]}>
            <input name="category" className={inputCls} placeholder="cth. Pemerintah, LSM, Akademik..." />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Website Resmi (URL)" error={fieldErrors.website?.[0]}>
            <input name="website" type="url" className={inputCls} placeholder="https://example.org" />
          </Field>

          <Field label="Urutan Tampilan" error={fieldErrors.order?.[0]}>
            <input name="order" type="number" defaultValue="0" className={inputCls} />
          </Field>
        </div>

        <MediaPicker name="logoMediaId" label="Logo Mitra / Institusi" />

        <Field label="Deskripsi / Catatan Singkat" error={fieldErrors.description?.[0]}>
          <textarea name="description" rows={4} className={inputCls} placeholder="Keterangan singkat tentang lingkup kolaborasi…" />
        </Field>

        <div className="flex items-center justify-end gap-3 border-t border-neutral-100 pt-4">
          <Link href="/admin/partners" className="rounded-md border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50">
            Batal
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {isPending ? "Menyimpan…" : "Tambah Mitra"}
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
