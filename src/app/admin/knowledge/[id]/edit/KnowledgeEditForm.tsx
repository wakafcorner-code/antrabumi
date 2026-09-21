"use client";

import React, { useTransition, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ContentStatus, KnowledgeType } from "@prisma/client";
import {
  updateKnowledgeAction,
  changeKnowledgeStatusAction,
  deleteKnowledgeAction,
} from "@/features/knowledge/actions";
import { KnowledgeDetail } from "@/server/repositories/knowledge.repository";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

interface Props {
  knowledge: KnowledgeDetail;
}

export function KnowledgeEditForm({ knowledge }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | undefined>>({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  const idTranslation = knowledge.translations.find((t) => t.language === "ID");
  const enTranslation = knowledge.translations.find((t) => t.language === "EN");

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatusMsg(null);
    setFieldErrors({});
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await updateKnowledgeAction(knowledge.id, formData);
      if (res.success) {
        setStatusMsg({ type: "success", text: "Perubahan berhasil disimpan." });
      } else {
        if (res.fieldErrors) setFieldErrors(res.fieldErrors);
        setStatusMsg({ type: "error", text: res.error ?? "Gagal menyimpan perubahan." });
      }
    });
  }

  function handleStatusChange(nextStatus: ContentStatus) {
    setStatusMsg(null);
    startTransition(async () => {
      const res = await changeKnowledgeStatusAction(knowledge.id, nextStatus);
      if (res.success) {
        setStatusMsg({ type: "success", text: `Status berhasil diubah menjadi ${nextStatus}.` });
        router.refresh();
      } else {
        setStatusMsg({ type: "error", text: res.error ?? "Gagal mengubah status." });
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteKnowledgeAction(knowledge.id);
      router.push("/admin/knowledge");
    });
  }

  const inputCls = "w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-neutral-900">
              {idTranslation?.title ?? knowledge.slug}
            </h1>
            <StatusBadge status={knowledge.status} />
          </div>
          <p className="mt-0.5 text-xs text-neutral-400">ID: {knowledge.id}</p>
        </div>
        <Link href="/admin/knowledge" className="text-sm text-neutral-500 hover:text-neutral-900">
          ← Kembali
        </Link>
      </div>

      {/* Feedback message */}
      {statusMsg && (
        <div
          className={`rounded-md p-3 text-sm ${
            statusMsg.type === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      {/* Status workflow toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Alur Status</p>
          <p className="text-xs text-neutral-400">Kelola visibilitas entri ini</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {knowledge.status !== ContentStatus.DRAFT && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleStatusChange(ContentStatus.DRAFT)}
              className="rounded border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
            >
              Kembalikan ke Draft
            </button>
          )}
          {knowledge.status === ContentStatus.DRAFT && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleStatusChange(ContentStatus.REVIEW)}
              className="rounded border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 hover:bg-amber-100 disabled:opacity-50"
            >
              Ajukan Review
            </button>
          )}
          {(knowledge.status === ContentStatus.DRAFT || knowledge.status === ContentStatus.REVIEW) && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleStatusChange(ContentStatus.PUBLISHED)}
              className="rounded bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              Terbitkan Sekarang
            </button>
          )}
          {knowledge.status === ContentStatus.PUBLISHED && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleStatusChange(ContentStatus.ARCHIVED)}
              className="rounded border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-500 hover:bg-neutral-50 disabled:opacity-50"
            >
              Arsipkan
            </button>
          )}
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleUpdate} className="space-y-6 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-neutral-700">Konten Bahasa Indonesia (Wajib)</legend>

          <Field label="Judul (ID) *" error={fieldErrors.titleId?.[0]}>
            <input name="titleId" defaultValue={idTranslation?.title ?? ""} required className={inputCls} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Slug URL" error={fieldErrors.slug?.[0]}>
              <input name="slug" defaultValue={knowledge.slug} required className={inputCls} />
            </Field>
            <Field label="Tipe Konten" error={fieldErrors.type?.[0]}>
              <select name="type" defaultValue={knowledge.type} className={inputCls}>
                {Object.values(KnowledgeType).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>
          </div>

          <MediaPicker
            name="coverMediaId"
            label="Gambar Sampul / Cover"
            initialMediaId={knowledge.coverMediaId}
            initialUrl={knowledge.coverMedia?.url}
          />

          <Field label="Ringkasan (ID)" error={fieldErrors.excerptId?.[0]}>
            <textarea name="excerptId" rows={3} defaultValue={idTranslation?.excerpt ?? ""} className={inputCls} />
          </Field>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">Konten / Isi (ID)</label>
            {fieldErrors.bodyId?.[0] && <p className="text-xs text-red-600">{fieldErrors.bodyId[0]}</p>}
            <RichTextEditor
              name="bodyId"
              defaultValue={idTranslation?.content ?? ""}
              placeholder="Isi artikel / laporan dalam Bahasa Indonesia…"
            />
          </div>
        </fieldset>

        <fieldset className="space-y-4 border-t border-neutral-100 pt-4">
          <legend className="text-sm font-semibold text-neutral-700">Konten Bahasa Inggris (Opsional)</legend>
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
              defaultValue={enTranslation?.content ?? ""}
              placeholder="Full content in English…"
            />
          </div>
        </fieldset>

        <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
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
