"use client";

import React, { useState } from "react";

export interface GalleryImage {
  id: string;
  url: string;
  filename?: string | null;
}

interface Props {
  initialImages?: GalleryImage[];
  onChange?: (images: GalleryImage[]) => void;
  label?: string;
}

export function ImageGalleryPicker({ initialImages = [], onChange, label = "Galeri Gambar" }: Props) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(next: GalleryImage[]) {
    setImages(next);
    onChange?.(next);
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files?.length) return;
    setError(null);
    setUploading(true);
    try {
      const uploaded: GalleryImage[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/api/v1/media/upload", { method: "POST", body: formData });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.error ?? "Gagal mengunggah gambar.");
        uploaded.push({ id: result.data.id, url: result.data.url, filename: result.data.filename || file.name });
      }
      update([...images, ...uploaded]);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Gagal mengunggah gambar.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="space-y-3 rounded-xl border border-neutral-200 bg-neutral-50/50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-700">{label}</label>
          <p className="mt-1 text-xs text-neutral-500">Upload beberapa gambar. Urutan tampil mengikuti urutan upload.</p>
        </div>
        <label className="inline-flex cursor-pointer items-center rounded-md bg-neutral-900 px-3 py-2 text-xs font-semibold text-white hover:bg-neutral-700">
          {uploading ? "Mengunggah..." : "Tambah Gambar"}
          <input type="file" multiple accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif" onChange={handleUpload} disabled={uploading} className="hidden" />
        </label>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((image, index) => (
            <div key={image.id} className="relative overflow-hidden rounded-lg border border-neutral-200 bg-white">
              <div className="relative aspect-video">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.url} alt={image.filename || `Gambar ${index + 1}`} className="h-full w-full object-cover" />
              </div>
              <button type="button" onClick={() => update(images.filter((item) => item.id !== image.id))} className="absolute right-1 top-1 rounded bg-black/70 px-2 py-1 text-[10px] font-semibold text-white hover:bg-black">Hapus</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
