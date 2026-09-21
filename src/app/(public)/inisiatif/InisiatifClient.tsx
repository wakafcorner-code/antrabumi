"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";

export interface DisplayExperience {
  id: string;
  slug: string;
  year: number;
  coverMedia: { url: string | null; altText: string | null } | null;
  title: string;
  excerpt?: string | null;
  category?: string | null;
}

interface InisiatifClientProps {
  initialExperiences: DisplayExperience[];
  lang: string;
}

export function InisiatifClient({ initialExperiences, lang }: InisiatifClientProps) {
  const isEn = lang === "EN";
  const [selectedYear, setSelectedYear] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Extract available years
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(initialExperiences.map((e) => e.year))).sort((a, b) => b - a);
    return years;
  }, [initialExperiences]);

  // Filter experiences
  const filteredExperiences = useMemo(() => {
    return initialExperiences.filter((exp) => {
      const matchYear = selectedYear === "ALL" || exp.year.toString() === selectedYear;
      const matchSearch =
        !searchQuery.trim() ||
        exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (exp.excerpt && exp.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (exp.category && exp.category.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchYear && matchSearch;
    });
  }, [initialExperiences, selectedYear, searchQuery]);

  return (
    <div className="min-h-screen bg-white">
      {/* Editorial Hero Section */}
      <section className="relative overflow-hidden border-b border-neutral-100 bg-[#0B1E1A] py-20 lg:py-28 text-white">
        {/* Subtle background ambient patterns */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0D5C4D_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#0D5C4D]/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#D96B27]/15 blur-3xl pointer-events-none" />

        <Container size="default">
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0D5C4D]/60 bg-[#0D5C4D]/30 px-3.5 py-1 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E5A823]" />
              <span className="font-mono text-xs font-semibold tracking-wider text-white/90 uppercase">
                {isEn ? "Strategic Initiatives" : "Inisiatif Strategis"}
              </span>
            </div>

            <h1 className="font-heading text-3xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-5xl text-white">
              {isEn
                ? "Strategic Initiatives for Contextual Change"
                : "Inisiatif Strategis untuk Perubahan Berkelanjutan"}
            </h1>

            <p className="text-base sm:text-lg leading-relaxed text-neutral-300">
              {isEn
                ? "Strategic programs and systemic initiatives developed by ANTRABUMI to bridge knowledge, nature, and communities into tangible impacts."
                : "Inisiatif tematik dan program kolaboratif ANTRABUMI yang dirancang untuk menjembatani pengetahuan, kelestarian alam, dan keberdayaan masyarakat menuju dampak nyata."}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">{initialExperiences.length}</span>
                <span>{isEn ? "Documented Initiatives" : "Inisiatif Terdokumentasi"}</span>
              </div>
              <span className="hidden sm:inline text-neutral-600">·</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">2021 — 2026</span>
                <span>{isEn ? "Timeline Scope" : "Rentang Waktu"}</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Filter & Search Controls Bar */}
      <section className="sticky top-20 z-20 border-b border-neutral-200/80 bg-white/95 backdrop-blur-md py-4 shadow-sm">
        <Container size="default">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Year Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-xs font-mono font-medium text-neutral-400 mr-2 shrink-0">
                {isEn ? "Year:" : "Tahun:"}
              </span>
              <button
                type="button"
                onClick={() => setSelectedYear("ALL")}
                className={`rounded-full px-3.5 py-1 text-xs font-medium transition-all shrink-0 ${
                  selectedYear === "ALL"
                    ? "bg-[#0D5C4D] text-white shadow-sm font-semibold"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {isEn ? "All" : "Semua"}
              </button>
              {availableYears.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => setSelectedYear(year.toString())}
                  className={`rounded-full px-3.5 py-1 text-xs font-medium transition-all shrink-0 ${
                    selectedYear === year.toString()
                      ? "bg-[#0D5C4D] text-white shadow-sm font-semibold"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64 shrink-0">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEn ? "Search initiatives..." : "Cari inisiatif..."}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-1.5 pl-9 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-[#0D5C4D] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0D5C4D]"
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

      {/* Initiatives Grid Section */}
      <section className="bg-white py-14 lg:py-20">
        <Container size="default">
          {filteredExperiences.length === 0 ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-10 text-center">
              <p className="text-sm font-medium text-neutral-600">
                {isEn ? "No initiatives match your filter." : "Tidak ada inisiatif yang cocok dengan filter."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedYear("ALL");
                  setSearchQuery("");
                }}
                className="mt-3 text-xs font-semibold text-[#0D5C4D] underline hover:text-[#116958]"
              >
                {isEn ? "Reset filters" : "Reset filter"}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredExperiences.map((exp) => {
                const coverUrl = exp.coverMedia?.url;
                const coverAlt = exp.coverMedia?.altText ?? exp.title;

                return (
                  <Link
                    key={exp.id}
                    href={`/inisiatif/${exp.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white transition-all duration-300 hover:border-[#0D5C4D]/60 hover:shadow-xl hover:-translate-y-1"
                  >
                    {/* Cover Area */}
                    <div className="relative aspect-video w-full overflow-hidden bg-neutral-100">
                      {coverUrl ? (
                        <Image
                          src={coverUrl}
                          alt={coverAlt}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="relative flex h-full w-full flex-col justify-between bg-gradient-to-br from-[#0B1E1A] via-[#0D5C4D] to-[#116958] p-5 text-white overflow-hidden">
                          {/* Pattern */}
                          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#E5A823_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                          <div className="relative z-10 flex items-center justify-between">
                            <span className="inline-flex items-center rounded-full bg-[#E5A823]/25 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#E5A823] border border-[#E5A823]/40">
                              {exp.year}
                            </span>
                            <span className="font-mono text-[11px] text-white/60 uppercase tracking-wider">
                              ANTRABUMI
                            </span>
                          </div>
                          <div className="relative z-10 pt-4">
                            <p className="font-heading text-sm font-bold text-white leading-snug line-clamp-2">
                              {exp.title}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Information */}
                    <div className="flex flex-1 flex-col justify-between gap-4 p-6">
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-[#0D5C4D]/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#0D5C4D]">
                            {exp.year}
                          </span>
                          <span className="text-[11px] font-mono text-neutral-400">
                            {isEn ? "Initiative" : "Inisiatif"}
                          </span>
                        </div>
                        <h2 className="font-heading text-base font-bold leading-snug text-neutral-950 group-hover:text-[#0D5C4D] transition-colors">
                          {exp.title}
                        </h2>
                        {exp.excerpt && (
                          <p className="text-xs leading-relaxed text-neutral-600 line-clamp-2">
                            {exp.excerpt}
                          </p>
                        )}
                      </div>

                      {/* Footer Link */}
                      <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-xs font-semibold text-[#0D5C4D]">
                        <span>{isEn ? "View initiative" : "Lihat inisiatif"}</span>
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </Container>
      </section>

      {/* Collaboration Callout Section */}
      <section className="border-t border-neutral-100 bg-neutral-50 py-16 lg:py-20">
        <Container size="reading">
          <div className="space-y-5 text-center">
            <span className="inline-flex items-center rounded-full bg-[#0D5C4D]/10 px-3 py-1 font-mono text-xs font-semibold text-[#0D5C4D]">
              {isEn ? "Next Collaboration" : "Kolaborasi Berikutnya"}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-950">
              {isEn
                ? "Interested in collaborating on upcoming initiatives?"
                : "Ingin berkolaborasi pada inisiatif berikutnya?"}
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              {isEn
                ? "We work with organizations, governments, academic institutions, and grassroots communities to co-create contextual and sustainable programs."
                : "Kami bekerja bersama organisasi, pemerintah, akademisi, dan komunitas akar rumput untuk merancang dan menjalankan program yang kontekstual dan berdampak."}
            </p>
            <div className="pt-2">
              <Link
                href="/kolaborasi#kontak"
                className="inline-flex h-12 items-center rounded-xl bg-gradient-to-r from-[#0D5C4D] via-[#116958] to-[#147A66] px-8 text-sm font-semibold text-white shadow-md shadow-[#0D5C4D]/25 transition-all hover:shadow-lg hover:shadow-[#0D5C4D]/35 hover:-translate-y-0.5"
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
