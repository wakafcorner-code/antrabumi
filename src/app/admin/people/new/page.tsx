"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createPersonAction } from "@/features/people/actions";
import { MediaPicker } from "@/components/admin/MediaPicker";

export default function NewPersonPage() {
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
        const res = await createPersonAction(formData);
        if (res && !res.success) {
          if (res.fieldErrors) setFieldErrors(res.fieldErrors);
          if (res.error) setErrorMsg(res.error);
        }
      } catch (err: unknown) {
        if (err && typeof err === "object" && "digest" in err) {
          router.push("/admin/people");
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
          <h1 className="text-xl font-semibold text-neutral-900">Tambah Profil Tim</h1>
          <p className="mt-0.5 text-sm text-neutral-500">Profil tim inti atau dewan pakar/penasihat ANTRABUMI.</p>
        </div>
        <Link href="/admin/people" className="text-sm text-neutral-500 hover:text-neutral-900">
          ← Kembali
        </Link>
      </div>

      {errorMsg && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{errorMsg}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-neutral-700">Informasi Utama</legend>

          <Field label="Nama Lengkap *" error={fieldErrors.nameId?.[0]}>
            <input name="nameId" required className={inputCls} placeholder="cth. Sendi Kenia Savitri" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Gelar Akademik / Kredensial" error={fieldErrors.credentialsId?.[0]}>
              <input name="credentialsId" className={inputCls} placeholder="cth. M.Si., Ph.D." />
            </Field>

            <Field label="Peran / Jabatan" error={fieldErrors.roleId?.[0]}>
              <input name="roleId" className={inputCls} placeholder="cth. Direktur Eksekutif" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Slug URL (opsional, otomatis jika kosong)" error={fieldErrors.slug?.[0]}>
              <input name="slug" className={inputCls} placeholder="cth. sendi-kenia-savitri" />
            </Field>

            <Field label="Urutan Tampilan" error={fieldErrors.displayOrder?.[0]}>
              <input name="displayOrder" type="number" defaultValue="0" className={inputCls} />
            </Field>
          </div>

          <MediaPicker name="imageId" label="Foto Profil" />

          <Field label="Biografi Ringkas (Bahasa Indonesia)" error={fieldErrors.biographyId?.[0]}>
            <textarea name="biographyId" rows={6} className={inputCls} placeholder="Profil dan latar belakang dalam Bahasa Indonesia…" />
          </Field>
        </fieldset>

        <fieldset className="space-y-4 border-t border-neutral-100 pt-4">
          <legend className="text-sm font-semibold text-neutral-700">Konten Bahasa Inggris (Opsional)</legend>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Nama (EN)" error={fieldErrors.nameEn?.[0]}>
              <input name="nameEn" className={inputCls} placeholder="English name variation if any" />
            </Field>

            <Field label="Peran / Jabatan (EN)" error={fieldErrors.roleEn?.[0]}>
              <input name="roleEn" className={inputCls} placeholder="e.g. Executive Director" />
            </Field>
          </div>

          <Field label="Biografi Ringkas (EN)" error={fieldErrors.biographyEn?.[0]}>
            <textarea name="biographyEn" rows={6} className={inputCls} placeholder="Biography in English…" />
          </Field>
        </fieldset>

        <div className="flex items-center justify-end gap-3 border-t border-neutral-100 pt-4">
          <Link href="/admin/people" className="rounded-md border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50">
            Batal
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {isPending ? "Menyimpan…" : "Buat Profil"}
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
