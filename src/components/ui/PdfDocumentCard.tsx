"use client";

import React, { useState } from "react";
import { PdfViewerModal } from "./PdfViewerModal";

export interface PdfDocumentCardProps {
  title: string;
  pdfUrl: string;
  fileSize?: string;
  category?: string;
  description?: string;
  lang?: "ID" | "EN";
  variant?: "full" | "compact";
}

export function PdfDocumentCard({
  title,
  pdfUrl,
  fileSize = "PDF Document",
  category,
  description,
  lang = "ID",
  variant = "full",
}: PdfDocumentCardProps) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const isEn = lang === "EN";

  if (variant === "compact") {
    return (
      <>
        <div className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200/90 bg-white p-3.5 shadow-2xs hover:border-[#0D5C4D]/40 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 font-mono text-xs font-bold border border-red-100">
              PDF
            </div>
            <div className="min-w-0">
              <p className="font-heading text-xs font-bold text-neutral-900 truncate">
                {title}
              </p>
              <p className="text-[10px] text-neutral-400 font-mono">
                {fileSize}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsViewerOpen(true);
              }}
              className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-[11px] font-semibold text-neutral-700 hover:bg-[#0D5C4D]/10 hover:text-[#0D5C4D] transition-colors"
            >
              <span>{isEn ? "View" : "Lihat"}</span>
            </button>
            <a
              href={pdfUrl}
              download
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 rounded-lg bg-[#0D5C4D] px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#116958] transition-colors"
            >
              <span>{isEn ? "Download" : "Unduh"}</span>
            </a>
          </div>
        </div>

        <PdfViewerModal
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
          pdfUrl={pdfUrl}
          title={title}
          category={category}
          lang={lang}
        />
      </>
    );
  }

  return (
    <>
      <div className="group relative overflow-hidden rounded-2xl border border-neutral-200/90 bg-gradient-to-br from-white via-neutral-50/50 to-[#F6FAF8] p-6 sm:p-7 shadow-xs transition-all hover:border-[#0D5C4D]/40 hover:shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          {/* Document Info */}
          <div className="flex items-start gap-4">
            <div className="relative flex h-14 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-b from-red-500 to-red-600 text-white shadow-md shadow-red-500/20">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
                PDF
              </span>
              <svg className="h-5 w-5 mt-0.5 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-[#0D5C4D]/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#0D5C4D]">
                  {category ?? (isEn ? "Official Publication" : "Dokumen Resmi")}
                </span>
                <span className="text-[11px] font-mono text-neutral-400">
                  {fileSize}
                </span>
              </div>
              <h3 className="font-heading text-base sm:text-lg font-bold text-neutral-900 group-hover:text-[#0D5C4D] transition-colors leading-snug">
                {title}
              </h3>
              {description && (
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-xl">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Action Button Group */}
          <div className="flex items-center gap-2.5 sm:shrink-0 pt-2 sm:pt-0">
            {/* View PDF */}
            <button
              type="button"
              onClick={() => setIsViewerOpen(true)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-neutral-300/80 bg-white px-4 text-xs font-semibold text-neutral-800 shadow-2xs hover:border-[#0D5C4D] hover:bg-[#0D5C4D]/5 hover:text-[#0D5C4D] transition-all"
            >
              <svg className="h-4 w-4 text-neutral-500 group-hover:text-[#0D5C4D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{isEn ? "View Document" : "Lihat Dokumen"}</span>
            </button>

            {/* Download PDF */}
            <a
              href={pdfUrl}
              download
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0D5C4D] via-[#116958] to-[#147A66] px-5 text-xs font-semibold text-white shadow-sm shadow-[#0D5C4D]/25 hover:shadow-md hover:shadow-[#0D5C4D]/35 hover:-translate-y-0.5 transition-all"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>{isEn ? "Download PDF" : "Unduh PDF"}</span>
            </a>
          </div>
        </div>
      </div>

      <PdfViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        pdfUrl={pdfUrl}
        title={title}
        category={category}
        lang={lang}
      />
    </>
  );
}
