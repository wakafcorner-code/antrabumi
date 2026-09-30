"use client";

import React, { useState } from "react";

export interface SelectedPdf {
  id: string;
  url: string;
  filename: string;
  size?: number | null;
}

interface PdfPickerProps {
  name?: string;
  labelName?: string;
  title?: string;
  description?: string;
  initialMedia?: SelectedPdf | null;
  onChange?: (media: SelectedPdf | null) => void;
}

function formatBytes(bytes?: number | null): string {
  if (!bytes || bytes === 0) return "—";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function PdfPicker({
  name = "pdfMediaId",
  labelName = "pdfLabel",
  title = "Dokumen / Berkas PDF",
  description = "Unggah berkas PDF jika tersedia (opsional). Kosongkan jika tidak ada dokumen pendukung.",
  initialMedia = null,
  onChange,
}: PdfPickerProps) {
  const [selected, setSelected] = useState<SelectedPdf | null>(initialMedia);
  const [labelValue, setLabelValue] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Hanya berkas format PDF yang diizinkan.");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError("Ukuran berkas melebihi batas maksimum 15MB.");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/v1/media/upload", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();

      if (res.ok && json.success) {
        const item: SelectedPdf = {
          id: json.data.id,
          url: json.data.url,
          filename: json.data.originalName || json.data.filename || file.name,
          size: json.data.size ?? file.size,
        };
        setSelected(item);
        onChange?.(item);
      } else {
        setError(json.error ?? "Gagal mengunggah berkas PDF.");
      }
    } catch {
      setError("Terjadi kesalahan jaringan saat mengunggah berkas PDF.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  function handleRemove() {
    setSelected(null);
    setLabelValue("");
    setError(null);
    onChange?.(null);
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm space-y-3">
      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={selected?.id ?? ""} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-50 text-red-600 font-bold text-xs">
            📄
          </span>
          <label className="text-xs font-semibold uppercase tracking-wide text-neutral-800">
            {title}
          </label>
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500">
            Opsional
          </span>
        </div>
      </div>

      <p className="text-xs text-neutral-500 leading-relaxed">
        {description}
      </p>

      {error && (
        <div className="rounded-lg bg-red-50 p-2.5 text-xs text-red-700 border border-red-100">
          {error}
        </div>
      )}

      {selected ? (
        /* Selected PDF card */
        <div className="space-y-3 rounded-lg border border-emerald-200 bg-emerald-50/40 p-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 font-mono text-[11px] font-bold text-red-700">
                PDF
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-neutral-900">
                  {selected.filename}
                </p>
                <p className="font-mono text-[11px] text-neutral-500">
                  {formatBytes(selected.size)} · Siap dilampirkan
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {selected.url && (
                <a
                  href={selected.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors shadow-xs"
                >
                  Lihat ↗
                </a>
              )}
              <button
                type="button"
                onClick={handleRemove}
                className="rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>

          {/* Optional Label input */}
          <div className="pt-2 border-t border-emerald-100">
            <label className="block text-[11px] font-medium text-neutral-600 mb-1">
              Label Dokumen (Opsional)
            </label>
            <input
              type="text"
              name={labelName}
              value={labelValue}
              onChange={(e) => setLabelValue(e.target.value)}
              placeholder="cth. Executive Summary / Laporan Lengkap 2026"
              className="w-full rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-[#0D5C4D] focus:ring-2 focus:ring-[#0D5C4D]/10"
            />
          </div>
        </div>
      ) : (
        /* Upload trigger */
        <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50/60 p-4 transition-colors hover:border-neutral-400">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <p className="text-xs font-medium text-neutral-700">
                Pilih atau unggah dokumen PDF
              </p>
              <p className="text-[11px] text-neutral-400">
                Format: .pdf (Maks. 15MB) · Tidak wajib diisi
              </p>
            </div>

            <label
              className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-all ${
                isUploading
                  ? "border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed"
                  : "border-[#0D5C4D] bg-[#0D5C4D] text-white hover:bg-[#116958] shadow-xs"
              }`}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {isUploading ? "Mengunggah PDF…" : "Pilih File PDF"}
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
