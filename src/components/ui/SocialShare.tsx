"use client";

import React, { useState } from "react";

interface SocialShareProps {
  url: string;
  title: string;
  text?: string;
  label?: string;
}

export function SocialShare({ url, title, text = "", label = "Bagikan halaman ini" }: SocialShareProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const shareUrl = typeof window === "undefined" ? url : new URL(url, window.location.origin).toString();

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setFeedback("Link tersalin");
    } catch {
      setFeedback("Salin link dari alamat browser");
    }
    window.setTimeout(() => setFeedback(null), 2200);
  }

  function openTarget(target: string) {
    window.open(target, "_blank", "noopener,noreferrer");
  }

  async function shareInstagram() {
    await copyLink();
    openTarget("https://www.instagram.com/");
  }

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(text ? `${title}\n\n${text}` : title);

  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-700">{label}</p>
        {feedback && <p className="text-xs font-medium text-[#0D5C4D]" role="status">{feedback}</p>}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        <button
          type="button"
          onClick={() => openTarget(`https://wa.me/?text=${encodedText}%20${encodedUrl}`)}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#25D366] px-3 py-2 text-xs font-semibold text-white transition hover:brightness-95"
        >
          WhatsApp
        </button>
        <button
          type="button"
          onClick={() => openTarget(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`)}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#1877F2] px-3 py-2 text-xs font-semibold text-white transition hover:brightness-95"
        >
          Facebook
        </button>
        <button
          type="button"
          onClick={() => openTarget(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`)}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#0A66C2] px-3 py-2 text-xs font-semibold text-white transition hover:brightness-95"
        >
          LinkedIn
        </button>
        <button
          type="button"
          onClick={() => openTarget(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`)}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-neutral-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-neutral-700"
        >
          X / Twitter
        </button>
        <button
          type="button"
          onClick={shareInstagram}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] px-3 py-2 text-xs font-semibold text-white transition hover:brightness-95"
        >
          Instagram
        </button>
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
        >
          Salin Link
        </button>
      </div>
    </div>
  );
}