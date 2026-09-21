"use client";

import React, { useState } from "react";
import Image from "next/image";

interface Props {
  name: string; // Form input name for mediaId
  initialMediaId?: string | null;
  initialUrl?: string | null;
  label?: string;
}

export function MediaPicker({
  name,
  initialMediaId,
  initialUrl,
  label = "Gambar / Media",
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(initialMediaId ?? null);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(initialUrl ?? null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleDirectUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/v1/media/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setSelectedId(json.data.id);
        setSelectedUrl(json.data.url);
      }
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
        {label}
      </label>

      {/* Hidden input to pass mediaId to Server Actions */}
      <input type="hidden" name={name} value={selectedId ?? ""} />

      <div className="flex items-center gap-4">
        {selectedUrl ? (
          <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50">
            <Image
              src={selectedUrl}
              alt="Selected media"
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed border-neutral-200 bg-neutral-50 text-xs text-neutral-400">
            Tidak ada
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="cursor-pointer rounded border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 text-center">
            {isUploading ? "Mengunggah…" : "Unggah File Baru"}
            <input
              type="file"
              onChange={handleDirectUpload}
              accept="image/*,application/pdf"
              className="hidden"
              disabled={isUploading}
            />
          </label>

          {selectedId && (
            <button
              type="button"
              onClick={() => {
                setSelectedId(null);
                setSelectedUrl(null);
              }}
              className="text-left text-[11px] text-red-600 hover:text-red-800"
            >
              Hapus Pilihan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
