"use client";

import React, { useState, useEffect } from "react";

interface FloatingCtaProps {
  lang?: string;
}

/**
 * FloatingCta — Fixed bottom-right WhatsApp + scroll-to-top button.
 * Appears after scrolling 300px. Accessible with keyboard.
 */
export function FloatingCta({ lang = "ID" }: FloatingCtaProps) {
  const [visible, setVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const isEn = lang === "EN";

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y > 200);
      setShowScrollTop(y > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-6 right-5 z-50 flex flex-col items-center gap-2.5"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
      }}
    >
      {/* Scroll to top */}
      {showScrollTop && (
        <button
          type="button"
          aria-label="Kembali ke atas"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-md text-neutral-500 hover:text-[#0D5C4D] hover:border-[#0D5C4D]/30 hover:shadow-lg transition-all"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}

      {/* WhatsApp button */}
      <a
        href="https://wa.me/6282330387505"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={isEn ? "Chat on WhatsApp" : "Hubungi via WhatsApp"}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/40 transition-all hover:scale-105 hover:shadow-[#25D366]/60 active:scale-95"
      >
        {/* Pulse ring animation */}
        <span
          className="absolute inset-0 rounded-full bg-[#25D366] opacity-30"
          style={{ animation: "pulseRing 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}
        />
        <svg
          className="relative z-10 h-7 w-7"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>

      {/* Tooltip label */}
      <span className="pointer-events-none absolute right-[4.5rem] bottom-1 whitespace-nowrap rounded-xl bg-neutral-900 px-3 py-1.5 text-[11px] font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 hidden sm:block">
        {isEn ? "Chat via WhatsApp" : "Hubungi via WhatsApp"}
      </span>
    </div>
  );
}
