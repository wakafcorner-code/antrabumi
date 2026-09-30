"use client";

import React, { useEffect } from "react";

export interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title: string;
  category?: string;
  lang?: "ID" | "EN";
}

export function PdfViewerModal({
  isOpen,
  onClose,
  pdfUrl,
  title,
  category,
  lang = "ID",
}: PdfViewerModalProps) {
  const isEn = lang === "EN";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !pdfUrl) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`PDF Viewer: ${title}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="relative flex flex-col w-full max-w-5xl h-[92vh] max-h-[900px] rounded-2xl bg-white shadow-2xl overflow-hidden border border-neutral-200/80"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-neutral-200 bg-neutral-50/90 backdrop-blur-xs">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-600 font-bold text-xs border border-red-500/20">
              PDF
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-sm sm:text-base font-bold text-neutral-900 truncate">
                  {title}
                </h3>
                {category && (
                  <span className="hidden sm:inline-block rounded-md bg-[#0D5C4D]/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#0D5C4D]">
                    {category}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-500">
                {isEn ? "Document Reader & Preview" : "Pratinjau Dokumen ANTRABUMI"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Open in New Window */}
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors shadow-2xs"
              title={isEn ? "Open in new window" : "Buka di tab baru"}
            >
              <svg className="h-3.5 w-3.5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>{isEn ? "Full Tab" : "Tab Baru"}</span>
            </a>

            {/* Direct Download */}
            <a
              href={pdfUrl}
              download
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0D5C4D] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#116958] transition-colors shadow-xs"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>{isEn ? "Download PDF" : "Unduh PDF"}</span>
            </a>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-200/70 hover:text-neutral-900 transition-colors"
              aria-label={isEn ? "Close" : "Tutup"}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Embedded Iframe Viewer */}
        <div className="relative flex-1 w-full bg-neutral-100 overflow-hidden">
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=0`}
            title={title}
            className="w-full h-full border-0"
          />

          {/* Fallback bar if browser restricts iframe preview */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-auto rounded-full bg-white/90 border border-neutral-200/90 shadow-lg px-4 py-1.5 text-[11px] text-neutral-600 backdrop-blur-xs flex items-center gap-2">
            <span>{isEn ? "Trouble viewing preview?" : "Kendala menampilkan preview?"}</span>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#0D5C4D] hover:underline"
            >
              {isEn ? "Open directly →" : "Buka langsung →"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
