"use client";

import React, { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MediaType } from "@prisma/client";
import { MediaListItem } from "@/server/repositories/media.repository";
import {
  updateMediaMetadataAction,
  deleteMediaAction,
} from "@/features/media/actions";

interface Props {
  initialMedia: MediaListItem[];
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function MediaGalleryClient({ initialMedia }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState<MediaListItem[]>(initialMedia);
  const [selectedItem, setSelectedItem] = useState<MediaListItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Sync state if server props change
  React.useEffect(() => {
    setItems(initialMedia);
  }, [initialMedia]);

  async function handleFileUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploadError(null);
    setIsUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/v1/media/upload", {
          method: "POST",
          body: formData,
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error ?? "Gagal mengunggah file.");
        }
      }

      router.refresh();
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Gagal mengunggah file.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleSaveMetadata(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedItem) return;
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await updateMediaMetadataAction(selectedItem.id, formData);
      if (res.success) {
        setSelectedItem(null);
        router.refresh();
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteMediaAction(id);
      setSelectedItem(null);
      setConfirmDelete(false);
      router.refresh();
    });
  }

  function handleCopy(url: string) {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFileUpload(e.dataTransfer.files);
        }}
        className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-white p-8 text-center transition-colors hover:border-neutral-400"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/svg+xml,application/pdf"
          onChange={(e) => handleFileUpload(e.target.files)}
          className="hidden"
          id="media-upload-input"
        />
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <p className="mt-3 text-sm font-medium text-neutral-900">
          Tarik & lepas file media ke sini, atau{" "}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-neutral-900 underline underline-offset-2 hover:text-neutral-600"
          >
            pilih dari komputer
          </button>
        </p>
        <p className="mt-1 text-xs text-neutral-400">
          Mendukung JPG, PNG, WebP, SVG (Maks. 5MB) dan PDF (Maks. 15MB).
        </p>

        {isUploading && (
          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-neutral-600">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
            Mengunggah media ke server…
          </div>
        )}

        {uploadError && (
          <p className="mt-3 text-xs font-medium text-red-600">{uploadError}</p>
        )}
      </div>

      {/* Media Grid */}
      {items.length === 0 ? (
        <div className="flex min-h-[250px] flex-col items-center justify-center rounded-lg border border-neutral-100 bg-white p-8 text-center">
          <p className="text-sm text-neutral-500">Belum ada aset media yang diunggah.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {items.map((m) => {
            const isImg = m.type === MediaType.IMAGE && m.url;
            return (
              <div
                key={m.id}
                onClick={() => {
                  setSelectedItem(m);
                  setConfirmDelete(false);
                }}
                className="group relative cursor-pointer overflow-hidden rounded-lg border border-neutral-200 bg-white transition-all hover:border-neutral-900 hover:shadow-sm"
              >
                <div className="relative aspect-square w-full bg-neutral-50 flex items-center justify-center overflow-hidden">
                  {isImg ? (
                    <Image
                      src={m.url!}
                      alt={m.altText || m.originalName || m.filename}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center p-3 text-neutral-400">
                      <svg className="h-10 w-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="mt-1 text-[10px] uppercase font-bold text-neutral-500">PDF</span>
                    </div>
                  )}
                </div>

                <div className="p-2.5">
                  <p className="truncate text-xs font-medium text-neutral-900" title={m.originalName || m.filename}>
                    {m.originalName || m.filename}
                  </p>
                  <p className="mt-0.5 text-[11px] text-neutral-400">
                    {formatBytes(m.size)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal / Drawer */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h2 className="text-base font-semibold text-neutral-900">Detail Media</h2>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="text-neutral-400 hover:text-neutral-900"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Preview */}
              <div className="flex flex-col items-center justify-center overflow-hidden rounded-lg bg-neutral-50 p-4 border border-neutral-100">
                {selectedItem.type === MediaType.IMAGE && selectedItem.url ? (
                  <div className="relative aspect-video w-full">
                    <Image
                      src={selectedItem.url}
                      alt={selectedItem.altText || ""}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-8 text-neutral-400">
                    <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span className="mt-2 text-xs font-semibold uppercase">{selectedItem.mimeType}</span>
                  </div>
                )}

                {selectedItem.url && (
                  <button
                    type="button"
                    onClick={() => handleCopy(selectedItem.url!)}
                    className="mt-3 rounded border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                  >
                    {copiedUrl ? "✓ URL Disalin!" : "Salin URL Media"}
                  </button>
                )}
              </div>

              {/* Metadata & Edit form */}
              <form onSubmit={handleSaveMetadata} className="space-y-4 text-xs">
                <div>
                  <span className="font-semibold text-neutral-500">Nama File Asli:</span>
                  <p className="font-mono text-neutral-900 break-all">{selectedItem.originalName || selectedItem.filename}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-semibold text-neutral-500">Ukuran:</span>
                    <p className="text-neutral-900">{formatBytes(selectedItem.size)}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-500">Tipe MIME:</span>
                    <p className="text-neutral-900">{selectedItem.mimeType}</p>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wide text-neutral-600">
                    Teks Alternatif (Alt Text) *
                  </label>
                  <input
                    name="altText"
                    defaultValue={selectedItem.altText ?? ""}
                    placeholder="Deskripsi gambar untuk aksesibilitas & SEO…"
                    className="mt-1 w-full rounded border border-neutral-200 p-2 text-xs outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wide text-neutral-600">
                    Keterangan (Caption)
                  </label>
                  <textarea
                    name="caption"
                    rows={2}
                    defaultValue={selectedItem.caption ?? ""}
                    placeholder="Keterangan gambar saat ditampilkan…"
                    className="mt-1 w-full rounded border border-neutral-200 p-2 text-xs outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wide text-neutral-600">
                    Atribusi / Hak Cipta
                  </label>
                  <input
                    name="attribution"
                    defaultValue={selectedItem.attribution ?? ""}
                    placeholder="cth. Dokumentasi ANTRABUMI 2026"
                    className="mt-1 w-full rounded border border-neutral-200 p-2 text-xs outline-none focus:border-neutral-900"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                  {!confirmDelete ? (
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(true)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Hapus Media
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleDelete(selectedItem.id)}
                        className="rounded bg-red-600 px-2 py-1 text-[11px] text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        Ya, Hapus
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(false)}
                        className="text-[11px] text-neutral-500"
                      >
                        Batal
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isPending}
                    className="rounded bg-neutral-900 px-4 py-1.5 text-xs font-medium text-white hover:opacity-80 disabled:opacity-50"
                  >
                    {isPending ? "Menyimpan…" : "Simpan Metadata"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
