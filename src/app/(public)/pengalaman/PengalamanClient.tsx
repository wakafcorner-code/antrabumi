"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";

export interface DisplayPengalaman {
  id: string;
  slug: string;
  year: number;
  featured: boolean;
  clientName: string | null;
  location: string | null;
  category: string | null;
  coverMedia: { url: string | null; altText: string | null } | null;
  title: string;
  excerpt?: string | null;
}

interface PengalamanClientProps {
  initialExperiences: DisplayPengalaman[];
  lang: string;
}

const CATEGORY_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  "Konservasi & Lanskap": { text: "#0D5C4D", bg: "#0D5C4D12", border: "#0D5C4D30" },
  "Kelautan & Pesisir": { text: "#2B8282", bg: "#2B828212", border: "#2B828230" },
  "Community Development": { text: "#D96B27", bg: "#D96B2712", border: "#D96B2730" },
  "Research & Assessment": { text: "#116958", bg: "#11695812", border: "#11695830" },
  "Conservation, Climate & Sustainability": { text: "#0D5C4D", bg: "#0D5C4D12", border: "#0D5C4D30" },
};

function getCategoryStyle(category: string | null) {
  if (!category) return { text: "#0D5C4D", bg: "#0D5C4D12", border: "#0D5C4D30" };
  return (
    CATEGORY_COLORS[category] ?? { text: "#0D5C4D", bg: "#0D5C4D12", border: "#0D5C4D30" }
  );
}

export function PengalamanClient({ initialExperiences, lang }: PengalamanClientProps) {
  const isEn = lang === "EN";

  // Extract unique years & categories
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(initialExperiences.map((e) => e.year))).sort(
      (a, b) => b - a
    );
    return years;
  }, [initialExperiences]);

  const availableCategories = useMemo(() => {
    const cats = Array.from(
      new Set(
        initialExperiences
          .map((e) => e.category)
          .filter((c): c is string => Boolean(c))
      )
    );
    return cats;
  }, [initialExperiences]);

  const [selectedYear, setSelectedYear] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filtered = useMemo(() => {
    return initialExperiences.filter((exp) => {
      const matchYear = selectedYear === "ALL" || exp.year.toString() === selectedYear;
      const matchCat =
        selectedCategory === "ALL" ||
        (exp.category ?? "").toLowerCase() === selectedCategory.toLowerCase();
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        exp.title.toLowerCase().includes(q) ||
        (exp.excerpt && exp.excerpt.toLowerCase().includes(q)) ||
        (exp.location && exp.location.toLowerCase().includes(q)) ||
        (exp.category && exp.category.toLowerCase().includes(q));
      return matchYear && matchCat && matchSearch;
    });
  }, [initialExperiences, selectedYear, selectedCategory, searchQuery]);

  const featured = initialExperiences.filter((e) => e.featured);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-neutral-100 bg-[#0B1E1A] py-20 text-white lg:py-28">
        {/* Ambient patterns */}
        <div className="pointer-events-none absolute inset-0 opacity-10 bg-[radial-gradient(#0D5C4D_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[#0D5C4D]/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#D96B27]/15 blur-3xl" />

        <Container size="default">
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0D5C4D]/60 bg-[#0D5C4D]/30 px-3.5 py-1 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E5A823]" />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-white/90">
                {isEn ? "Field Experiences" : "Pengalaman Lapangan"}
              </span>
            </div>

            <h1 className="font-heading text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
              {isEn
                ? "Experiences that shape the way we work."
                : "Pengalaman yang membentuk cara kami bekerja."}
            </h1>

            <p className="text-base leading-relaxed text-neutral-300 sm:text-lg">
              {isEn
                ? "ANTRABUMI's collective engagements — connecting research, assessment, and community action to develop grounded, contextual approaches."
                : "Kumpulan pengalaman ANTRABUMI di berbagai konteks — menghubungkan riset, asesmen, dan aksi komunitas untuk pendekatan yang berakar pada realitas lapangan."}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 font-mono text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">{initialExperiences.length}</span>
                <span>{isEn ? "Documented Experiences" : "Pengalaman Terdokumentasi"}</span>
              </div>
              <span className="hidden text-neutral-600 sm:inline">·</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">2021 — 2026</span>
                <span>{isEn ? "Timeline Scope" : "Rentang Waktu"}</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Featured Experience (if any) ─────────────────────────────── */}
      {featured.length > 0 && (
        <section className="border-b border-neutral-100 bg-[#F5FAF8] py-12 lg:py-16">
          <Container size="default">
            <p className="mb-6 font-mono text-xs font-bold uppercase tracking-widest text-[#0D5C4D]">
              {isEn ? "Featured Experience" : "Pengalaman Unggulan"}
            </p>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {featured.slice(0, 2).map((exp) => {
                const style = getCategoryStyle(exp.category);
                return (
                  <Link
                    key={exp.id}
                    href={`/pengalaman/${exp.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-[#0D5C4D]/20 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    {/* Cover */}
                    <div className="relative aspect-video w-full overflow-hidden bg-neutral-100">
                      {exp.coverMedia?.url ? (
                        <Image
                          src={exp.coverMedia.url}
                          alt={exp.coverMedia.altText ?? exp.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="relative flex h-full w-full flex-col justify-between bg-gradient-to-br from-[#0B1E1A] via-[#0D5C4D] to-[#116958] p-6 text-white overflow-hidden">
                          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#E5A823_1px,transparent_1px)] [background-size:16px_16px]" />
                          <div className="relative z-10 flex items-center justify-between">
                            <span className="inline-flex items-center rounded-full border border-[#E5A823]/40 bg-[#E5A823]/25 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#E5A823]">
                              {exp.year}
                            </span>
                            <span className="font-mono text-[11px] uppercase tracking-wider text-white/60">
                              ANTRABUMI
                            </span>
                          </div>
                          <div className="relative z-10">
                            <p className="font-heading text-lg font-bold leading-snug text-white line-clamp-2">
                              {exp.title}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Body */}
                    <div className="flex flex-1 flex-col gap-3 p-6">
                      <div className="flex flex-wrap items-center gap-2">
                        {exp.category && (
                          <span
                            className="rounded-md px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide"
                            style={{ color: style.text, background: style.bg }}
                          >
                            {exp.category}
                          </span>
                        )}
                        <span className="font-mono text-[10px] text-neutral-400">{exp.year}</span>
                      </div>
                      <h2 className="font-heading text-lg font-bold leading-snug text-neutral-950 group-hover:text-[#0D5C4D] transition-colors">
                        {exp.title}
                      </h2>
                      {exp.excerpt && (
                        <p className="text-sm leading-relaxed text-neutral-600 line-clamp-2">
                          {exp.excerpt}
                        </p>
                      )}
                      {(exp.location || exp.clientName) && (
                        <div className="flex flex-wrap gap-3 text-[11px] font-mono text-neutral-400">
                          {exp.location && <span>📍 {exp.location}</span>}
                          {exp.clientName && <span>🤝 {exp.clientName}</span>}
                        </div>
                      )}
                      <div className="mt-auto flex items-center justify-between border-t border-neutral-100 pt-3 text-xs font-semibold text-[#0D5C4D]">
                        <span>{isEn ? "View experience" : "Lihat pengalaman"}</span>
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* ── Filter & Search Bar ────────────────────────────────────────── */}
      <section className="sticky top-20 z-20 border-b border-neutral-200/80 bg-white/95 py-4 shadow-sm backdrop-blur-md">
        <Container size="default">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {/* Year filter */}
              <span className="mr-1 shrink-0 font-mono text-xs font-medium text-neutral-400">
                {isEn ? "Year:" : "Tahun:"}
              </span>
              <button
                type="button"
                onClick={() => setSelectedYear("ALL")}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  selectedYear === "ALL"
                    ? "bg-[#0D5C4D] text-white shadow-sm"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {isEn ? "All" : "Semua"}
              </button>
              {availableYears.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setSelectedYear(y.toString())}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    selectedYear === y.toString()
                      ? "bg-[#0D5C4D] text-white shadow-sm"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {y}
                </button>
              ))}
              {/* Category filter */}
              {availableCategories.length > 0 && (
                <>
                  <span className="ml-2 mr-1 hidden shrink-0 font-mono text-xs font-medium text-neutral-400 sm:inline">
                    {isEn ? "Category:" : "Kategori:"}
                  </span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs text-neutral-600 focus:border-[#0D5C4D] focus:outline-none"
                  >
                    <option value="ALL">{isEn ? "All Categories" : "Semua Kategori"}</option>
                    {availableCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>

            {/* Search */}
            <div className="relative w-full shrink-0 sm:w-60">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEn ? "Search experiences..." : "Cari pengalaman..."}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 py-1.5 pl-9 pr-8 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-[#0D5C4D] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0D5C4D]"
              />
              <svg
                className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2 text-xs text-neutral-400 hover:text-neutral-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Experiences Grid ────────────────────────────────────────────── */}
      <section className="bg-white py-12 lg:py-16">
        <Container size="default">
          {filtered.length === 0 ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-10 text-center">
              <p className="text-sm font-medium text-neutral-600">
                {isEn
                  ? "No experiences match your filter."
                  : "Tidak ada pengalaman yang cocok dengan filter."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedYear("ALL");
                  setSelectedCategory("ALL");
                  setSearchQuery("");
                }}
                className="mt-3 text-xs font-semibold text-[#0D5C4D] underline hover:text-[#116958]"
              >
                {isEn ? "Reset filters" : "Reset filter"}
              </button>
            </div>
          ) : (
            <>
              <p className="mb-6 font-mono text-xs text-neutral-400">
                {isEn
                  ? `Showing ${filtered.length} experience${filtered.length !== 1 ? "s" : ""}`
                  : `Menampilkan ${filtered.length} pengalaman`}
              </p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((exp) => {
                  const style = getCategoryStyle(exp.category);
                  return (
                    <Link
                      key={exp.id}
                      href={`/pengalaman/${exp.slug}`}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#0D5C4D]/60 hover:shadow-xl"
                    >
                      {/* Cover */}
                      <div className="relative aspect-video w-full overflow-hidden bg-neutral-100">
                        {exp.coverMedia?.url ? (
                          <Image
                            src={exp.coverMedia.url}
                            alt={exp.coverMedia.altText ?? exp.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="relative flex h-full w-full flex-col justify-between bg-gradient-to-br from-[#0B1E1A] via-[#0D5C4D] to-[#116958] p-5 text-white overflow-hidden">
                            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#E5A823_1px,transparent_1px)] [background-size:16px_16px]" />
                            <div className="relative z-10 flex items-center justify-between">
                              <span className="inline-flex items-center rounded-full border border-[#E5A823]/40 bg-[#E5A823]/25 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#E5A823]">
                                {exp.year}
                              </span>
                              <span className="font-mono text-[11px] uppercase tracking-wider text-white/60">
                                ANTRABUMI
                              </span>
                            </div>
                            <div className="relative z-10 pt-4">
                              <p className="font-heading text-sm font-bold leading-snug text-white line-clamp-2">
                                {exp.title}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card body */}
                      <div className="flex flex-1 flex-col justify-between gap-3 p-5">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            {exp.category && (
                              <span
                                className="rounded-md px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide"
                                style={{ color: style.text, background: style.bg }}
                              >
                                {exp.category}
                              </span>
                            )}
                            <span className="font-mono text-[10px] text-neutral-400">
                              {exp.year}
                            </span>
                          </div>
                          <h2 className="font-heading text-base font-bold leading-snug text-neutral-950 transition-colors group-hover:text-[#0D5C4D]">
                            {exp.title}
                          </h2>
                          {exp.excerpt && (
                            <p className="text-xs leading-relaxed text-neutral-600 line-clamp-2">
                              {exp.excerpt}
                            </p>
                          )}
                        </div>

                        {(exp.location || exp.clientName) && (
                          <div className="flex flex-wrap gap-3 text-[10px] font-mono text-neutral-400">
                            {exp.location && <span>📍 {exp.location}</span>}
                            {exp.clientName && <span>🤝 {exp.clientName}</span>}
                          </div>
                        )}

                        <div className="flex items-center justify-between border-t border-neutral-100 pt-3 text-xs font-semibold text-[#0D5C4D]">
                          <span>{isEn ? "View experience" : "Lihat pengalaman"}</span>
                          <span className="transition-transform group-hover:translate-x-1">→</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </Container>
      </section>

      {/* ── Collaboration CTA ────────────────────────────────────────── */}
      <section className="border-t border-neutral-100 bg-neutral-50 py-16 lg:py-20">
        <Container size="reading">
          <div className="space-y-5 text-center">
            <span className="inline-flex items-center rounded-full bg-[#0D5C4D]/10 px-3 py-1 font-mono text-xs font-semibold text-[#0D5C4D]">
              {isEn ? "Work Together" : "Bekerja Bersama"}
            </span>
            <h2 className="font-heading text-2xl font-bold text-neutral-950 sm:text-3xl">
              {isEn
                ? "Interested in building an experience together?"
                : "Ingin membangun pengalaman bersama?"}
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              {isEn
                ? "ANTRABUMI works with organizations, governments, academics, and communities to co-create grounded, contextual programs."
                : "ANTRABUMI bekerja bersama organisasi, pemerintah, akademisi, dan komunitas untuk merancang program yang kontekstual dan berdampak."}
            </p>
            <div className="pt-2">
              <Link
                href="/kolaborasi#kontak"
                className="inline-flex h-12 items-center rounded-xl bg-gradient-to-r from-[#0D5C4D] via-[#116958] to-[#147A66] px-8 text-sm font-semibold text-white shadow-md shadow-[#0D5C4D]/25 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#0D5C4D]/35"
              >
                {isEn ? "Discuss a Collaboration" : "Diskusikan Kolaborasi"}
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
