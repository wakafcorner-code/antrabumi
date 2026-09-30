"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { HeroSlide, HeroSliderConfig } from "@/types/hero";

export interface PillarItem {
  id: string;
  key: string;
  label: string;
  description: string;
}

export interface HeroSliderProps {
  slides: HeroSlide[];
  config: HeroSliderConfig;
  lang: "ID" | "EN";
  pillars?: PillarItem[];
}

export function HeroSlider({ slides, config, lang, pillars = [] }: HeroSliderProps) {
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
      className="relative min-h-[75vh] sm:min-h-[82vh] lg:min-h-[88vh] overflow-hidden bg-[#061512] text-white flex flex-col justify-between"
    >
      {/* ── BACKGROUND IMAGE LAYER (Slides with smooth crossfade) ─────────── */}
      <div className="absolute inset-0 z-0">
        {displaySlides.map((slide, idx) => {
          const isActive = idx === currentIndex;
          return (
            <div
              key={`bg-${slide.id}`}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              {slide.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                /* Fallback ambient organic gradient when slide has no image */
                <div className="h-full w-full bg-gradient-to-br from-[#061814] via-[#0B2520] to-[#04100D]">
                  <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#0D5C4D]/30 blur-3xl pointer-events-none" />
                  <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#E5A823]/10 blur-3xl pointer-events-none" />
                </div>
              )}
            </div>
          );
        })}

        {/* Multi-layer Dark Editorial Overlays for 100% Contrast & Legibility */}
        {/* Layer 1: Left-to-right gradient ensuring text on left is super readable */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#051411]/95 via-[#051411]/80 md:via-[#051411]/65 to-[#051411]/40"
        />

        {/* Layer 2: Top and bottom subtle vignettes for navbar and slider controls */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#051411]/95 via-transparent to-[#051411]/60"
        />

        {/* Layer 3: Subtle architectural grid texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 60px,#fff 60px,#fff 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,#fff 60px,#fff 61px)",
          }}
        />
      </div>

      {/* ── FOREGROUND CONTENT LAYER (z-10) ──────────────────────────────── */}
      <div className="relative z-10 flex flex-1 flex-col justify-between pt-16 pb-10 sm:pt-20 sm:pb-14 lg:pt-28 lg:pb-16">
        <Container size="default" className="flex flex-1 flex-col justify-center">
          {/* ── EDITORIAL FULL-WIDTH TEXT ─────────────────────────────────────── */}
          <div className="max-w-4xl space-y-6 sm:space-y-8">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md shadow-xs">
              <span className="h-2 w-2 rounded-full bg-[#E5A823] shadow-xs shadow-[#E5A823]/60" />
              <span className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.15em] text-white/95">
                {tagline}
              </span>
            </div>

            {/* Title / Headline */}
            <div key={`title-${currentSlide.id}`} className="transition-opacity duration-500 ease-out">
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.06] tracking-tight text-white drop-shadow-sm">
                {title}
              </h1>
            </div>

            {/* Subtitle / Excerpt */}
            <div key={`sub-${currentSlide.id}`} className="transition-opacity duration-500 ease-out">
              <p className="max-w-2xl text-base sm:text-xl leading-relaxed text-neutral-200/90 font-light drop-shadow-xs">
                {subtitle}
              </p>
            </div>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {primaryCtaText && (
                <Link
                  href={primaryCtaLink}
                  className="inline-flex h-12 items-center rounded-xl bg-gradient-to-r from-[#0D5C4D] via-[#116958] to-[#147A66] px-8 text-sm font-semibold text-white shadow-lg shadow-black/30 transition-all hover:brightness-110 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0D5C4D]"
                >
                  {primaryCtaText}
                </Link>
              )}
              {secondaryCtaText && (
                <Link
                  href={secondaryCtaLink}
                  className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/50 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                >
                  {secondaryCtaText}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              )}
            </div>

            {/* ── THREE PILLARS OVERLAY (If pillars passed) ─────────── */}
            {pillars && pillars.length > 0 && (
              <div className="pt-6 sm:pt-8 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {pillars.map((p, idx) => {
                  const colors = [
                    { border: "border-l-[#2B8282]", bar: "bg-[#2B8282]" },
                    { border: "border-l-[#D96B27]", bar: "bg-[#D96B27]" },
                    { border: "border-l-[#E5A823]", bar: "bg-[#E5A823]" },
                  ][idx % 3];

                  return (
                    <div
                      key={p.id || p.key}
                      className={`flex flex-col justify-between rounded-xl border border-white/15 bg-black/40 backdrop-blur-md p-4 transition-all hover:bg-black/60 hover:border-white/30 border-l-4 ${colors.border}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-heading text-sm font-bold tracking-wider text-white">
                          {p.key}
                        </span>
                        <span className="font-mono text-xs font-semibold text-white/50">
                          {p.id || `0${idx + 1}`}
                        </span>
                      </div>
                      <div className={`mt-2 h-0.5 w-8 ${colors.bar} rounded-full`} />
                      <p className="mt-2 text-xs leading-relaxed text-neutral-300 line-clamp-3">
                        {p.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Container>

        {/* ── SLIDER CONTROLS & NAVIGATION BAR (At the bottom of Hero) ────── */}
        <Container size="default" className="mt-10 sm:mt-12">
          {totalSlides > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-5 sm:pt-6">
              {/* Slide Indicators & Count */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2" role="tablist" aria-label="Slide Indicators">
                  {displaySlides.map((s, idx) => {
                    const isActive = idx === currentIndex;
                    return (
                      <button
                        key={s.id}
                        role="tab"
                        aria-selected={isActive}
                        aria-label={`Slide ${idx + 1}`}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isActive
                            ? "w-10 bg-[#E5A823] shadow-xs shadow-[#E5A823]/50"
                            : "w-2.5 bg-white/30 hover:bg-white/60"
                        }`}
                      />
                    );
                  })}
                </div>
                <span className="font-mono text-xs font-semibold text-white/75">
                  {String(currentIndex + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
                </span>
              </div>

              {/* Prev / Next & Pause/Play Buttons */}
              <div className="flex items-center gap-2">
                {/* Manual Pause / Play toggle */}
                <button
                  type="button"
                  onClick={() => setIsPaused(!isPaused)}
                  className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/40"
                  aria-label={isPaused ? "Lanjutkan putar otomatis" : "Jeda putar otomatis"}
                  title={isPaused ? "Play" : "Pause"}
                >
                  {isPaused ? (
                    <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  ) : (
                    <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                  )}
                </button>

                {/* Prev */}
                <button
                  type="button"
                  onClick={prevSlide}
                  className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/40"
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
                  className="inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/40"
                  aria-label="Slide Selanjutnya"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </Container>
      </div>
    </section>
  );
}
