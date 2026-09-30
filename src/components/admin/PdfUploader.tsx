"use client";

import React, { useState } from "react";

interface PdfItem {
  id: string;
  label?: string | null;
  mediaId: string;
  url: string;
  filename: string;
  size?: number | null;
}

interface PdfUploaderProps {
  /** Existing PDF attachments to show */
  existing?: PdfItem[];
  /** Called when user uploads a new PDF — returns the media info */
  onUploaded?: (media: { id: string; url: string; filename: string; size?: number }) => void;
  /** Called when user wants to remove an existing attachment */
  onRemove?: (downloadId: string) => void;
  /** Whether we are in "saving" state */
  disabled?: boolean;
}

function formatBytes(bytes?: number | null): string {
  if (!bytes || bytes === 0) return "—";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function PdfUploader({
  existing = [],
  onUploaded,
  onRemove,
  disabled = false,
}: PdfUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedLabel, setUploadedLabel] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setUploadError("Hanya file PDF yang diizinkan.");
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/v1/media/upload", { method: "POST", body: fd });
      const json = await res.json();

      if (res.ok && json.success) {
        onUploaded?.({
          id: json.data.id,
          url: json.data.url,
          filename: json.data.filename || file.name,
          size: json.data.size ?? file.size,
        });
        setUploadedLabel("");
      } else {
        setUploadError(json.error ?? "Gagal mengunggah PDF.");
      }
    } catch {
      setUploadError("Terjadi kesalahan koneksi saat mengunggah.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-3">
      {/* Existing PDF attachments */}
      {existing.length > 0 && (
        <div className="space-y-2">
          {existing.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white p-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* PDF icon */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 border border-red-100 font-mono text-[10px] font-bold text-red-600">
                  PDF
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-neutral-900">
                    {item.label || item.filename}
                  </p>
                  <p className="font-mono text-[10px] text-neutral-400">
                    {item.filename} · {formatBytes(item.size)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[11px] font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
                >
                  Lihat ↗
                </a>
                {onRemove && (
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onRemove(item.id)}
                    className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-medium text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    Hapus
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload new PDF */}
      <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50/60 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Label input */}
          <input
            type="text"
            value={uploadedLabel}
            onChange={(e) => setUploadedLabel(e.target.value)}
            placeholder="Label PDF (opsional, mis. Laporan Ringkas)"
            className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#0D5C4D] focus:ring-2 focus:ring-[#0D5C4D]/10"
          />

          {/* File picker trigger */}
          <label
            className={`flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold transition-all ${
              isUploading || disabled
                ? "border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed"
                : "border-[#0D5C4D] bg-[#0D5C4D] text-white hover:bg-[#116958] shadow-sm"
            }`}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {isUploading ? "Mengunggah…" : "Upload PDF"}
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
              disabled={isUploading || disabled}
              className="hidden"
            />
          </label>
        </div>

        {uploadError && (
          <p className="mt-2 text-[11px] text-red-600">{uploadError}</p>
        )}
        <p className="mt-2 text-[11px] text-neutral-400">
          Format: PDF · Maks. 50MB · File akan langsung tersedia untuk diunduh di halaman publik
        </p>
      </div>
    </div>
  );
}
