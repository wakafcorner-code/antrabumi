"use client";

import React, { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { ContentStatus } from "@prisma/client";
import {
  updateExperienceAction,
  changeExperienceStatusAction,
  deleteExperienceAction,
  attachExperiencePdfAction,
  removeExperiencePdfAction,
} from "@/features/experiences/actions";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { PdfUploader } from "@/components/admin/PdfUploader";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import type { ExperienceDetail } from "@/server/repositories/experience.repository";

const inputCls =
  "w-full rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:bg-white focus:ring-2 focus:ring-neutral-900/10";

const STATUS_TRANSITIONS: Record<ContentStatus, ContentStatus[]> = {
  DRAFT: ["REVIEW"],
  REVIEW: ["PUBLISHED", "DRAFT"],
  PUBLISHED: ["ARCHIVED"],
  ARCHIVED: ["DRAFT"],
};

interface Props {
  experience: ExperienceDetail;
  /** Where the back button should navigate. Defaults to /admin/experiences */
  backHref?: string;
}

export function ExperienceEditForm({ experience, backHref = "/admin/experiences" }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [statusPending, setStatusPending] = useState<ContentStatus | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | undefined>>({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  const idTranslation = experience.translations.find((t) => t.language === "ID");
  const enTranslation = experience.translations.find((t) => t.language === "EN");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaved(false);
    setError(null);
    setFieldErrors({});
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateExperienceAction(experience.id, formData);
      if (!result.success) {
        setError(result.error ?? "Terjadi kesalahan.");
        setFieldErrors(result.fieldErrors ?? {});
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    });
  }

  function handleStatusChange(status: ContentStatus) {
    setStatusPending(status);
    startTransition(async () => {
      await changeExperienceStatusAction(experience.id, status);
      setStatusPending(null);
      router.refresh();
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteExperienceAction(experience.id);
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-neutral-900">Edit Inisiatif</h1>
          <StatusBadge status={experience.status} />
        </div>
        <button
          type="button"
          onClick={() => router.push(backHref)}
          className="text-sm text-neutral-500 hover:text-neutral-900"
        >
          ← Kembali
        </button>
      </div>

      {/* Status workflow */}
      <div className="flex flex-wrap gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
        <span className="self-center text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Alur Status:
        </span>
        {STATUS_TRANSITIONS[experience.status].map((nextStatus) => (
          <button
            key={nextStatus}
            type="button"
            disabled={isPending}
            onClick={() => handleStatusChange(nextStatus)}
            className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900 disabled:opacity-50"
          >
            {statusPending === nextStatus ? "Menyimpan…" : `→ ${nextStatus}`}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {saved && (
        <div className="rounded-md bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700 border border-emerald-200">
          ✓ Perubahan berhasil disimpan.
        </div>
      )}
      {error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-neutral-200 bg-white p-6">
        {/* Preserve status on update */}
        <input type="hidden" name="status" value={experience.status} />

        {/* Tipe (visible, editable) */}
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
                defaultChecked={experience.type === "INITIATIVE"}
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
                defaultChecked={experience.type === "EXPERIENCE"}
                className="accent-neutral-900"
              />
              <span>
                <span className="font-semibold">Proyek</span>
                <span className="ml-1.5 text-xs text-neutral-400">— Program lapangan dan pendampingan</span>
              </span>
            </label>
          </div>
        </fieldset>
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-neutral-700">Informasi Dasar</legend>

          <Field label="Judul (ID) *" error={fieldErrors.titleId?.[0]}>
            <input name="titleId" defaultValue={idTranslation?.title ?? ""} className={inputCls} required />
          </Field>

          <Field label="Slug" error={fieldErrors.slug?.[0]}>
            <input name="slug" defaultValue={experience.slug} className={`${inputCls} font-mono`} />
          </Field>

          <MediaPicker
            name="coverMediaId"
            label="Gambar Sampul / Cover"
            initialMediaId={experience.coverMediaId}
            initialUrl={experience.coverMedia?.url}
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
              Unggah dokumen PDF seperti ringkasan eksekutif, laporan lapangan, atau metodologi. Bersifat opsional.
            </p>
            <PdfUploader
              existing={experience.pdfAttachments ?? []}
              onUploaded={async (media) => {
                await attachExperiencePdfAction(experience.id, media.id);
                router.refresh();
              }}
              onRemove={async (mediaId) => {
                await removeExperiencePdfAction(experience.id, mediaId);
                router.refresh();
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Tahun" error={fieldErrors.year?.[0]}>
              <input name="year" type="number" defaultValue={experience.year ?? ""} className={inputCls} />
            </Field>
            <Field label="Kategori / Bidang Kerja" error={fieldErrors.category?.[0]}>
              <select name="category" defaultValue={experience.category ?? ""} className={inputCls}>
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
              <input name="client" defaultValue={experience.clientName ?? ""} className={inputCls} />
            </Field>
            <Field label="Lokasi" error={fieldErrors.location?.[0]}>
              <input name="location" defaultValue={experience.location ?? ""} className={inputCls} />
            </Field>
          </div>

          <Field label="Ringkasan (ID)" error={fieldErrors.excerptId?.[0]}>
            <textarea name="excerptId" rows={3} defaultValue={idTranslation?.excerpt ?? ""} className={inputCls} />
          </Field>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">Konten / Isi (ID)</label>
            {fieldErrors.bodyId?.[0] && <p className="text-xs text-red-600">{fieldErrors.bodyId[0]}</p>}
            <RichTextEditor
              name="bodyId"
              defaultValue={idTranslation?.description ?? ""}
              placeholder="Isi lengkap dalam Bahasa Indonesia…"
            />
          </div>
        </fieldset>

        <fieldset className="space-y-4 border-t border-neutral-100 pt-4">
          <legend className="text-sm font-semibold text-neutral-700">Konten Bahasa Inggris (opsional)</legend>
          <Field label="Judul (EN)" error={fieldErrors.titleEn?.[0]}>
            <input name="titleEn" defaultValue={enTranslation?.title ?? ""} className={inputCls} />
          </Field>
          <Field label="Ringkasan (EN)" error={fieldErrors.excerptEn?.[0]}>
            <textarea name="excerptEn" rows={3} defaultValue={enTranslation?.excerpt ?? ""} className={inputCls} />
          </Field>
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">Konten (EN)</label>
            {fieldErrors.bodyEn?.[0] && <p className="text-xs text-red-600">{fieldErrors.bodyEn[0]}</p>}
            <RichTextEditor
              name="bodyEn"
              defaultValue={enTranslation?.description ?? ""}
              placeholder="Full content in English…"
            />
          </div>
        </fieldset>

        <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
          {/* Delete */}
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="text-xs font-medium text-red-600 hover:text-red-800"
            >
              Hapus entri ini
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-600">Yakin ingin menghapus?</span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                Ya, Hapus
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="text-xs text-neutral-500 hover:text-neutral-800"
              >
                Batal
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="h-9 rounded-md bg-neutral-900 px-5 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            {isPending ? "Menyimpan…" : "Simpan Perubahan"}
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
