"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { HeroSlide, HeroSliderConfig } from "@/types/hero";

interface PillarItem {
  id: string;
  key: string;
  label: string;
  description: string;
}

interface HeroSliderProps {
  slides: HeroSlide[];
  config: HeroSliderConfig;
  lang: "ID" | "EN";
  pillars: PillarItem[];
}

export function HeroSlider({ slides, config, lang, pillars }: HeroSliderProps) {
  // Only display active slides
  const activeSlides = slides.filter((s) => s.isActive);
  const displaySlides = activeSlides.length > 0 ? activeSlides : slides;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = displaySlides.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Autoplay timer
  useEffect(() => {
    if (!config.autoplay || isPaused || totalSlides <= 1) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, config.intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [config.autoplay, config.intervalMs, isPaused, nextSlide, totalSlides]);

  const currentSlide = displaySlides[currentIndex] || displaySlides[0];

  // Bilingual text helpers
  const tagline =
    lang === "EN" && currentSlide.taglineEn
      ? currentSlide.taglineEn
      : currentSlide.tagline || "ANTRABUMI — Independent Organization";

  const title =
    lang === "EN" && currentSlide.titleEn
      ? currentSlide.titleEn
      : currentSlide.title;

  const subtitle =
    lang === "EN" && currentSlide.subtitleEn
      ? currentSlide.subtitleEn
      : currentSlide.subtitle;

  const primaryCtaText =
    lang === "EN" && currentSlide.primaryCtaTextEn
      ? currentSlide.primaryCtaTextEn
      : currentSlide.primaryCtaText || (lang === "EN" ? "Contact Us" : "Hubungi Kami");

  const primaryCtaLink = currentSlide.primaryCtaLink || "/kolaborasi#kontak";

  const secondaryCtaText =
    lang === "EN" && currentSlide.secondaryCtaTextEn
      ? currentSlide.secondaryCtaTextEn
      : currentSlide.secondaryCtaText || (lang === "EN" ? "About ANTRABUMI" : "Tentang ANTRABUMI");

  const secondaryCtaLink = currentSlide.secondaryCtaLink || "/tentang";

  return (
    <section
      aria-label="Beranda Hero Slider"
      onMouseEnter={() => config.pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => config.pauseOnHover && setIsPaused(false)}
      onFocus={() => config.pauseOnHover && setIsPaused(true)}
      onBlur={() => config.pauseOnHover && setIsPaused(false)}
      className="relative overflow-hidden border-b border-neutral-100 bg-white"
    >
      {/* Subtle architectural grid texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,transparent,transparent 60px,#000 60px,#000 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,#000 60px,#000 61px)",
        }}
      />

      <Container size="default">
        <div className="relative min-h-[60vh] sm:min-h-[70vh] lg:min-h-[78vh] py-10 sm:py-16 lg:py-20 flex flex-col justify-center">
          <div className="grid grid-cols-1 items-center gap-8 sm:gap-12 lg:grid-cols-12 lg:gap-16">
            {/* ── LEFT: TEXT CONTENT (Col 7 of 12) ───────────────────────── */}
            <div className="space-y-6 sm:space-y-8 lg:col-span-7">
              {/* Tagline Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0D5C4D]/25 bg-[#0D5C4D]/5 px-3.5 sm:px-4 py-1.5 backdrop-blur-xs">
                <span className="h-2 w-2 rounded-full bg-[#E5A823]" />
                <span className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.14em] text-[#0D5C4D]">
                  {tagline}
                </span>
              </div>

              {/* Title / Headline with smooth fade transition */}
              <div key={`title-${currentSlide.id}`} className="transition-opacity duration-500 ease-out">
                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.12] sm:leading-[1.08] tracking-tight text-neutral-950">
                  {title}
                </h1>
              </div>

              {/* Subtitle / Excerpt */}
              <div key={`sub-${currentSlide.id}`} className="transition-opacity duration-500 ease-out">
                <p className="max-w-xl text-sm sm:text-base md:text-lg leading-relaxed text-neutral-600">
                  {subtitle}
                </p>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {primaryCtaText && (
                  <Link
                    href={primaryCtaLink}
                    className="inline-flex h-12 items-center rounded-xl bg-gradient-to-r from-[#0D5C4D] via-[#116958] to-[#1A4B43] px-8 text-sm font-semibold text-white shadow-md shadow-[#0D5C4D]/25 transition-all hover:shadow-lg hover:shadow-[#0D5C4D]/35 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0D5C4D]"
                  >
                    {primaryCtaText}
                  </Link>
                )}
                {secondaryCtaText && (
                  <Link
                    href={secondaryCtaLink}
                    className="inline-flex h-12 items-center gap-2 rounded-xl border-2 border-[#0D5C4D]/30 bg-white px-7 text-sm font-semibold text-[#0D5C4D] transition-all hover:border-[#0D5C4D] hover:bg-[#0D5C4D]/5 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0D5C4D]"
                  >
                    {secondaryCtaText}
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>

            {/* ── RIGHT: VISUAL ELEMENT (Col 5 of 12) ──────────────────────── */}
            <div className="lg:col-span-5">
              {currentSlide.imageUrl ? (
                /* Visual Image Card */
                <div
                  key={`img-${currentSlide.id}`}
                  className="relative overflow-hidden rounded-2xl border-2 border-[#0D5C4D]/20 bg-neutral-50 shadow-md transition-all duration-500"
                >
                  <div className="aspect-4/3 w-full sm:aspect-16/10">
                    <img
                      src={currentSlide.imageUrl}
                      alt={title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                /* Three Pillars Official Visual */
                <div aria-hidden="true" className="space-y-3.5">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#E5A823]" />
                    <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#0D5C4D]">
                      {lang === "EN" ? "Core Pillars" : "Pilar Utama"}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {pillars.map((p, idx) => {
                      const accentColor =
                        idx === 0
                          ? "border-l-4 border-l-[#0D5C4D] text-[#0D5C4D]"
                          : idx === 1
                            ? "border-l-4 border-l-[#D96B27] text-[#D96B27]"
                            : "border-l-4 border-l-[#2B8282] text-[#2B8282]";

                      return (
                        <div
                          key={p.id}
                          className={`group flex items-start gap-4 rounded-xl border border-neutral-200/90 bg-white p-4.5 shadow-xs transition hover:shadow-md ${accentColor}`}
                        >
                          <span className="font-mono text-xs font-bold opacity-80">
                            {p.id}
                          </span>
                          <div>
                            <p className="font-heading text-sm font-bold tracking-wide text-neutral-950">
                              {p.key}
                            </p>
                            <p className="mt-0.5 text-xs leading-relaxed text-neutral-600">
                              {p.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── SLIDER CONTROLS & NAVIGATION BAR ─────────────────────────── */}
          {totalSlides > 1 && (
            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-neutral-100 pt-6">
              {/* Slide Indicators & Count */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5" role="tablist" aria-label="Slide Indicators">
                  {displaySlides.map((s, idx) => {
                    const isActive = idx === currentIndex;
                    return (
                      <button
                        key={s.id}
                        role="tab"
                        aria-selected={isActive}
                        aria-label={`Slide ${idx + 1}`}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                          isActive
                            ? "w-9 bg-[#0D5C4D]"
                            : "w-2.5 bg-neutral-300 hover:bg-[#0D5C4D]/40"
                        }`}
                      />
                    );
                  })}
                </div>
                <span className="font-mono text-xs font-semibold text-[#0D5C4D]">
                  {String(currentIndex + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
                </span>
              </div>

              {/* Prev / Next & Pause/Play Buttons */}
              <div className="flex items-center gap-2">
                {/* Manual Pause / Play toggle */}
                <button
                  type="button"
                  onClick={() => setIsPaused(!isPaused)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 transition-all hover:border-[#0D5C4D] hover:text-[#0D5C4D]"
                  aria-label={isPaused ? "Lanjutkan putar otomatis" : "Jeda putar otomatis"}
                  title={isPaused ? "Play" : "Pause"}
                >
                  {isPaused ? (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                  )}
                </button>

                {/* Prev */}
                <button
                  type="button"
                  onClick={prevSlide}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 shadow-xs transition-all hover:border-[#0D5C4D] hover:bg-[#0D5C4D] hover:text-white"
                  aria-label="Slide Sebelumnya"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Next */}
                <button
                  type="button"
                  onClick={nextSlide}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 shadow-xs transition-all hover:border-[#0D5C4D] hover:bg-[#0D5C4D] hover:text-white"
                  aria-label="Slide Selanjutnya"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
