"use client";

import React, { useState } from "react";

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
  const [selectedId, setSelectedId] = useState<string | null>(
    initialMediaId ?? null
  );
  const [selectedUrl, setSelectedUrl] = useState<string | null>(
    initialUrl ?? null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [tab, setTab] = useState<"upload" | "url">("upload");
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleDirectUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
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
        setUrlInput("");
      } else {
        setUploadError(json.error ?? "Gagal mengunggah gambar.");
      }
    } catch {
      setUploadError("Terjadi kesalahan koneksi.");
    } finally {
      setIsUploading(false);
      // reset input agar bisa upload file sama lagi
      e.target.value = "";
    }
  }

  function handleApplyUrl() {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    // URL-based — no mediaId, just a direct URL stored via hidden input trick
    // We store the URL in selectedUrl and clear mediaId
    setSelectedId(null);
    setSelectedUrl(trimmed);
    setUrlInput("");
  }

  function handleClear() {
    setSelectedId(null);
    setSelectedUrl(null);
    setUrlInput("");
    setUploadError(null);
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
        {label}
      </label>

      {/* Hidden inputs */}
      <input type="hidden" name={name} value={selectedId ?? ""} />
      {/* Also expose the raw URL so Server Actions can use it if no mediaId */}
      <input type="hidden" name={`${name}Url`} value={selectedUrl ?? ""} />

      {/* Preview */}
      {selectedUrl && (
        <div className="relative mb-2 h-32 w-full max-w-xs overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedUrl}
            alt="Pratinjau gambar"
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-1.5 top-1.5 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white hover:bg-black/80"
          >
            Hapus
          </button>
        </div>
      )}

      {/* Tab switcher */}
      <div className="flex gap-1 rounded-lg border border-neutral-200 bg-neutral-50 p-1 w-fit">
        <button
          type="button"
          onClick={() => setTab("upload")}
          className={`rounded-md px-3 py-1 text-xs font-medium transition ${
            tab === "upload"
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          Unggah File
        </button>
        <button
          type="button"
          onClick={() => setTab("url")}
          className={`rounded-md px-3 py-1 text-xs font-medium transition ${
            tab === "url"
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500 hover:text-neutral-700"
          }`}
        >
          URL Gambar
        </button>
      </div>

      {/* Tab: Upload */}
      {tab === "upload" && (
        <div className="space-y-1.5">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 w-fit">
            <svg className="h-4 w-4 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {isUploading ? "Mengunggah…" : "Pilih Gambar (PNG, JPG, WebP)"}
            <input
              type="file"
              onChange={handleDirectUpload}
              accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
              className="hidden"
              disabled={isUploading}
            />
          </label>
          {uploadError && (
            <p className="text-[11px] text-red-600">{uploadError}</p>
          )}
          <p className="text-[11px] text-neutral-400">
            Format: PNG, JPG, WebP, SVG · Maks. 15MB
          </p>
        </div>
      )}

      {/* Tab: URL */}
      {tab === "url" && (
        <div className="flex items-center gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://contoh.com/gambar.jpg"
            className="flex-1 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            disabled={!urlInput.trim()}
            className="rounded-md bg-neutral-900 px-4 py-2 text-xs font-semibold text-white hover:opacity-80 disabled:opacity-40"
          >
            Terapkan
          </button>
        </div>
      )}
    </div>
  );
}
