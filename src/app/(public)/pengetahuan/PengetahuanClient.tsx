"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export type KnowledgeTypeItem =
  | "ALL"
  | "RESEARCH"
  | "ASSESSMENT"
  | "REPORT"
  | "PUBLICATION"
  | "ARTICLE"
  | "STORY"
  | "INSIGHT";

export interface DisplayKnowledge {
  id: string;
  slug: string;
  type: string;
  featured?: boolean;
  publishedAt: string | null;
  coverMedia: { url: string | null; altText: string | null } | null;
  title: string;
  excerpt?: string | null;
  authorName?: string | null;
}

interface PengetahuanClientProps {
  initialItems: DisplayKnowledge[];
  lang: string;
}

const typeLabelsID: Record<string, string> = {
  ALL: "Semua",
  RESEARCH: "Riset",
  ASSESSMENT: "Asesmen",
  REPORT: "Laporan",
  PUBLICATION: "Publikasi",
  ARTICLE: "Artikel",
  STORY: "Cerita",
  INSIGHT: "Wawasan",
};

const typeLabelsEN: Record<string, string> = {
  ALL: "All",
  RESEARCH: "Research",
  ASSESSMENT: "Assessment",
  REPORT: "Report",
  PUBLICATION: "Publication",
  ARTICLE: "Article",
  STORY: "Story",
  INSIGHT: "Insight",
};

const curationThemesID = [
  {
    title: "Konservasi & Keberlanjutan",
    desc: "Kajian ekologis, konservasi berbasis masyarakat, dan strategi adaptasi perubahan iklim.",
    icon: "🌱",
  },
  {
    title: "Asesmen Kontekstual Lapangan",
    desc: "Metodologi asesmen partisipatif untuk memahami dinamika lokal sebelum intervensi.",
    icon: "📋",
  },
  {
    title: "GEDSI & Inklusi Sosial",
    desc: "Panduan dan pembelajaran dalam mengintegrasikan kesetaraan gender dan inklusi disabilitas.",
    icon: "🤝",
  },
  {
    title: "Ekosistem Digital & Data",
    desc: "Analisis kesiapan teknologi dan pemanfaatan data untuk penguatan komunitas.",
    icon: "📊",
  },
];

const curationThemesEN = [
  {
    title: "Conservation & Sustainability",
    desc: "Ecological assessments, community-based conservation, and climate adaptation strategies.",
    icon: "🌱",
  },
  {
    title: "Contextual Field Assessments",
    desc: "Participatory assessment methodologies to understand local dynamics prior to intervention.",
    icon: "📋",
  },
  {
    title: "GEDSI & Social Inclusion",
    desc: "Guidelines and field learnings on embedding gender equality and disability inclusion.",
    icon: "🤝",
  },
  {
    title: "Digital Ecosystem & Data",
    desc: "Analyzing technology readiness and data leverage for community empowerment.",
    icon: "📊",
  },
];

export function PengetahuanClient({ initialItems, lang }: PengetahuanClientProps) {
  const isEn = lang === "EN";
  const typeLabels = isEn ? typeLabelsEN : typeLabelsID;
  const curationThemes = isEn ? curationThemesEN : curationThemesID;

  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filterTabs: string[] = [
    "ALL",
    "RESEARCH",
    "ASSESSMENT",
    "REPORT",
    "PUBLICATION",
    "ARTICLE",
    "STORY",
    "INSIGHT",
  ];

  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      const matchType = selectedType === "ALL" || item.type === selectedType;
      const matchSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.excerpt && item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchType && matchSearch;
    });
  }, [initialItems, selectedType, searchQuery]);

  return (
    <div className="min-h-screen bg-white">
      {/* Editorial Hero Section */}
      <section className="relative overflow-hidden border-b border-neutral-100 bg-[#0B1E1A] py-20 lg:py-28 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0D5C4D_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#0D5C4D]/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#D96B27]/15 blur-3xl pointer-events-none" />

        <Container size="default">
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0D5C4D]/60 bg-[#0D5C4D]/30 px-3.5 py-1 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E5A823]" />
              <span className="font-mono text-xs font-semibold tracking-wider text-white/90 uppercase">
                {isEn ? "Knowledge Hub" : "Hub Pengetahuan"}
              </span>
            </div>

            <h1 className="font-heading text-3xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-5xl text-white">
              {isEn
                ? "Research, Assessments & Field Insights"
                : "Riset, Asesmen & Wawasan Lapangan"}
            </h1>

            <p className="text-base sm:text-lg leading-relaxed text-neutral-300">
              {isEn
                ? "ANTRABUMI's open repository of studies, assessment briefs, methodologies, and narratives grounded in real-world environmental and community practice."
                : "Arsip terbuka ANTRABUMI untuk publikasi kajian, ringkasan asesmen, catatan metodologi, dan wawasan yang berakar dari pengalaman lapangan bersama komunitas dan mitra."}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">
                  {initialItems.length > 0 ? initialItems.length : "Kurasi"}
                </span>
                <span>{isEn ? "Publications & Articles" : "Publikasi & Artikel"}</span>
              </div>
              <span className="hidden sm:inline text-neutral-600">·</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">Open Access</span>
                <span>{isEn ? "Public Knowledge" : "Pengetahuan Terbuka"}</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Filter & Search Bar */}
      <section className="sticky top-20 z-20 border-b border-neutral-200/80 bg-white/95 backdrop-blur-md py-4 shadow-sm">
        <Container size="default">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {filterTabs.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`rounded-full px-3.5 py-1 text-xs font-medium transition-all shrink-0 ${
                    selectedType === type
                      ? "bg-[#0D5C4D] text-white shadow-sm font-semibold"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {typeLabels[type] ?? type}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64 shrink-0">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEn ? "Search knowledge..." : "Cari pengetahuan..."}
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

      {/* Main Content Area */}
      <section className="bg-white py-14 lg:py-20">
        <Container size="default">
          {initialItems.length === 0 ? (
            /* Curated Knowledge Space (Empty State with Rich Design) */
            <div className="space-y-12">
              <div className="rounded-3xl border border-neutral-200/90 bg-gradient-to-b from-neutral-50/80 to-white p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-sm space-y-4">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0D5C4D]/10 text-2xl">
                  📚
                </div>
                <h2 className="font-heading text-2xl font-bold text-neutral-900">
                  {isEn
                    ? "Knowledge Archive in Active Curation"
                    : "Arsip Pengetahuan dalam Proses Kurasi"}
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-neutral-600 max-w-xl mx-auto">
                  {isEn
                    ? "Our research papers, field manuals, and assessment summaries are being digitized and uploaded. You can discover our ongoing themes below or inquire about specific publications."
                    : "Laporan kajian lapangan, panduan asesmen, dan ringkasan metodologi sedang dalam proses digitalisasi dan publikasi melalui CMS. Simak fokus tema pengetahuan kami di bawah ini."}
                </p>
                <div className="pt-2">
                  <Link
                    href="/kolaborasi#kontak"
                    className="inline-flex h-11 items-center rounded-xl bg-gradient-to-r from-[#0D5C4D] via-[#116958] to-[#147A66] px-6 text-xs font-semibold text-white shadow-md shadow-[#0D5C4D]/25 hover:shadow-lg transition-all"
                  >
                    {isEn ? "Inquire About Research Documents" : "Tanyakan Dokumen Riset"}
                  </Link>
                </div>
              </div>

              {/* 4 Thematic Areas of Knowledge Production */}
              <div>
                <div className="mb-6 text-center space-y-1">
                  <h3 className="font-heading text-lg font-bold text-neutral-900">
                    {isEn ? "Focus Themes of Knowledge Production" : "Fokus Tema Produksi Pengetahuan"}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    {isEn
                      ? "The core domains in which ANTRABUMI actively generates and synthesizes insights"
                      : "Area utama tempat ANTRABUMI memproduksi riset dan wawasan lapangan"}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {curationThemes.map((theme, i) => (
                    <div
                      key={i}
                      className="flex flex-col rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-6 transition-all hover:bg-white hover:border-[#0D5C4D]/40 hover:shadow-md"
                    >
                      <span className="text-2xl mb-3">{theme.icon}</span>
                      <h4 className="font-heading text-sm font-bold text-neutral-950 mb-2">
                        {theme.title}
                      </h4>
                      <p className="text-xs text-neutral-600 leading-relaxed flex-1">
                        {theme.desc}
                      </p>
                      <span className="mt-4 pt-3 border-t border-neutral-200/60 font-mono text-[11px] font-semibold text-[#0D5C4D]">
                        0{i + 1} · {isEn ? "Active Domain" : "Ranah Aktif"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : filteredItems.length === 0 ? (
            /* No search match */
            <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-10 text-center">
              <p className="text-sm font-medium text-neutral-600">
                {isEn ? "No items match your filter." : "Tidak ada artikel yang cocok dengan filter."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedType("ALL");
                  setSearchQuery("");
                }}
                className="mt-3 text-xs font-semibold text-[#0D5C4D] underline hover:text-[#116958]"
              >
                {isEn ? "Reset filters" : "Reset filter"}
              </button>
            </div>
          ) : (
            /* Articles Grid */
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => {
                const typeLabel = typeLabels[item.type] ?? item.type;
                const date = item.publishedAt
                  ? new Date(item.publishedAt).toLocaleDateString(isEn ? "en-US" : "id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : null;

                return (
                  <Link
                    key={item.id}
                    href={`/pengetahuan/${item.slug}`}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white transition-all duration-300 hover:border-[#0D5C4D]/60 hover:shadow-xl hover:-translate-y-1"
                  >
                    {/* Featured Badge */}
                    {item.featured && (
                      <div className="absolute top-3 right-3 z-10 rounded-full bg-[#E5A823] px-2.5 py-0.5 font-mono text-[10px] font-bold text-neutral-950 shadow-md">
                        ★ {isEn ? "Featured" : "Unggulan"}
                      </div>
                    )}

                    {/* Cover Area */}
                    <div className="relative aspect-video w-full overflow-hidden bg-neutral-100">
                      {item.coverMedia?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.coverMedia.url}
                          alt={item.coverMedia.altText ?? item.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="relative flex h-full w-full flex-col justify-between bg-gradient-to-br from-[#0B1E1A] via-[#116958] to-[#0D5C4D] p-5 text-white overflow-hidden">
                          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#E5A823_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                          <div className="relative z-10 flex items-center justify-between">
                            <span className="inline-flex items-center rounded-full bg-[#E5A823]/25 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#E5A823] border border-[#E5A823]/40">
                              {typeLabel}
                            </span>
                            <span className="font-mono text-[11px] text-white/60 uppercase">
                              ANTRABUMI
                            </span>
                          </div>
                          <div className="relative z-10 pt-4">
                            <p className="font-heading text-sm font-bold text-white leading-snug line-clamp-2">
                              {item.title}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content Details */}
                    <div className="flex flex-1 flex-col justify-between gap-4 p-6">
                      <div className="space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="rounded-full bg-[#0D5C4D]/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#0D5C4D]">
                            {typeLabel}
                          </span>
                          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
                            {date && <span>{date}</span>}
                            {item.authorName && (
                              <span className="truncate max-w-[130px]" title={item.authorName}>
                                · {item.authorName}
                              </span>
                            )}
                          </div>
                        </div>
                        <h2 className="font-heading text-base font-bold leading-snug text-neutral-950 group-hover:text-[#0D5C4D] transition-colors line-clamp-2">
                          {item.title}
                        </h2>
                        {item.excerpt && (
                          <p className="text-xs leading-relaxed text-neutral-600 line-clamp-2">
                            {item.excerpt}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-xs font-semibold text-[#0D5C4D]">
                        <span>{isEn ? "Read publication" : "Baca artikel"}</span>
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

      {/* Collaboration Callout */}
      <section className="border-t border-neutral-100 bg-neutral-50 py-16 lg:py-20">
        <Container size="reading">
          <div className="space-y-5 text-center">
            <span className="inline-flex items-center rounded-full bg-[#0D5C4D]/10 px-3 py-1 font-mono text-xs font-semibold text-[#0D5C4D]">
              {isEn ? "Knowledge Collaboration" : "Kolaborasi Pengetahuan"}
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-950">
              {isEn
                ? "Want to co-create research or publish with ANTRABUMI?"
                : "Ingin meriset bersama atau menerbitkan kajian bersama ANTRABUMI?"}
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              {isEn
                ? "We partner with universities, independent researchers, non-profits, and policy makers to produce evidence-based studies and contextual analyses."
                : "Kami bermitra dengan perguruan tinggi, peneliti independen, organisasi masyarakat sipil, dan pengambil kebijakan untuk menghasilkan kajian berbasis bukti yang aplikatif."}
            </p>
            <div className="pt-2">
              <Link
                href="/kolaborasi#kontak"
                className="inline-flex h-12 items-center rounded-xl bg-gradient-to-r from-[#0D5C4D] via-[#116958] to-[#147A66] px-8 text-sm font-semibold text-white shadow-md shadow-[#0D5C4D]/25 transition-all hover:shadow-lg hover:shadow-[#0D5C4D]/35 hover:-translate-y-0.5"
              >
                {isEn ? "Start Knowledge Partnership" : "Mulai Kemitraan Riset"}
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
