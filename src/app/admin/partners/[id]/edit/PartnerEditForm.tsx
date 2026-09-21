"use client";

import React, { useTransition, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ContentStatus } from "@prisma/client";
import {
  updatePartnerAction,
  changePartnerStatusAction,
  deletePartnerAction,
} from "@/features/partners/actions";
import { PartnerDetail } from "@/server/repositories/partner.repository";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { MediaPicker } from "@/components/admin/MediaPicker";

interface Props {
  partner: PartnerDetail;
}

export function PartnerEditForm({ partner }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | undefined>>({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatusMsg(null);
    setFieldErrors({});
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await updatePartnerAction(partner.id, formData);
      if (res.success) {
        setStatusMsg({ type: "success", text: "Perubahan mitra berhasil disimpan." });
      } else {
        if (res.fieldErrors) setFieldErrors(res.fieldErrors);
        setStatusMsg({ type: "error", text: res.error ?? "Gagal menyimpan perubahan." });
      }
    });
  }

  function handleStatusChange(nextStatus: ContentStatus) {
    setStatusMsg(null);
    startTransition(async () => {
      const res = await changePartnerStatusAction(partner.id, nextStatus);
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
      await deletePartnerAction(partner.id);
      router.push("/admin/partners");
    });
  }

  const inputCls = "w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-neutral-900">{partner.name}</h1>
            <StatusBadge status={partner.status} />
          </div>
          <p className="mt-0.5 text-xs text-neutral-400">ID: {partner.id}</p>
        </div>
        <Link href="/admin/partners" className="text-sm text-neutral-500 hover:text-neutral-900">
          ← Kembali
        </Link>
      </div>

      {statusMsg && (
        <div
          className={`rounded-md p-3 text-sm ${
            statusMsg.type === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      {/* Status toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-neutral-200 bg-white p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Alur Status</p>
          <p className="text-xs text-neutral-400">Kelola status publikasi mitra</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {partner.status !== ContentStatus.DRAFT && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleStatusChange(ContentStatus.DRAFT)}
              className="rounded border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
            >
              Kembalikan ke Draft
            </button>
          )}
          {partner.status === ContentStatus.DRAFT && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleStatusChange(ContentStatus.REVIEW)}
              className="rounded border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 hover:bg-amber-100 disabled:opacity-50"
            >
              Ajukan Review
            </button>
          )}
          {(partner.status === ContentStatus.DRAFT || partner.status === ContentStatus.REVIEW) && (
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleStatusChange(ContentStatus.PUBLISHED)}
              className="rounded bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              Terbitkan Sekarang
            </button>
          )}
          {partner.status === ContentStatus.PUBLISHED && (
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

      <form onSubmit={handleUpdate} className="space-y-6 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <Field label="Nama Mitra / Institusi *" error={fieldErrors.name?.[0]}>
          <input name="name" defaultValue={partner.name} required className={inputCls} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Slug URL" error={fieldErrors.slug?.[0]}>
            <input name="slug" defaultValue={partner.slug} required className={inputCls} />
          </Field>

          <Field label="Kategori Mitra" error={fieldErrors.category?.[0]}>
            <input name="category" defaultValue={partner.category ?? ""} className={inputCls} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Website Resmi (URL)" error={fieldErrors.website?.[0]}>
            <input name="website" type="url" defaultValue={partner.website ?? ""} className={inputCls} />
          </Field>

          <Field label="Urutan Tampilan" error={fieldErrors.order?.[0]}>
            <input name="order" type="number" defaultValue={partner.order} className={inputCls} />
          </Field>
        </div>

        <MediaPicker
          name="logoMediaId"
          label="Logo Mitra / Institusi"
          initialMediaId={partner.logoMediaId}
          initialUrl={partner.logoMedia?.url}
        />

        <Field label="Deskripsi / Catatan Singkat" error={fieldErrors.description?.[0]}>
          <textarea name="description" rows={4} defaultValue={partner.description ?? ""} className={inputCls} />
        </Field>

        <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="text-xs font-medium text-red-600 hover:text-red-800"
            >
              Hapus mitra ini
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
