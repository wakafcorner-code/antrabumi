"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PdfViewerModal } from "@/components/ui/PdfViewerModal";
import type { ExperienceListItem } from "@/server/repositories/experience.repository";

export interface DisplayInitiative {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  year?: number | null;
  category?: string | null;
  categoryType: "CAMPAIGN" | "PROJECT";
  location?: string | null;
  clientName?: string | null;
  featured?: boolean;
  coverMedia?: { url: string | null; altText: string | null } | null;
  pdfUrl?: string | null;
  pdfLabel?: string | null;
}

interface InisiatifClientProps {
  lang: string;
  experiences?: ExperienceListItem[];
  initiativesData?: DisplayInitiative[];
  initialCategory?: string;
}

export function InisiatifClient({
  lang,
  experiences = [],
  initiativesData = [],
  initialCategory = "ALL",
}: InisiatifClientProps) {
  const isEn = lang === "EN";

  const [selectedFilter, setSelectedFilter] = useState<string>(initialCategory);
  const [modalPdf, setModalPdf] = useState<{
    url: string;
    title: string;
    category?: string;
  } | null>(null);

  useEffect(() => {
    if (initialCategory && initialCategory !== "ALL") {
      setSelectedFilter(initialCategory);
      // Scroll to the list section if category is selected from URL
      const workEl = document.getElementById("karya-inisiatif");
      if (workEl) {
        workEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [initialCategory]);

  const initiatives = [
    {
      number: "01",
      tagId: "01 · Konservasi Alam",
      tagEn: "01 · Nature Conservation",
      titleId: "Melindungi biodiversitas dan ekosistem.",
      titleEn: "Protecting biodiversity and ecosystems.",
      descId:
        "Menghubungkan konservasi, pengelolaan sumber daya, dan peran masyarakat dalam menjaga bentang alam.",
      descEn:
        "Connecting conservation, resource governance, and community stewardship across landscapes.",
      image: "/images/inisiatif/konservasi-alam.jpg",
    },
    {
      number: "02",
      tagId: "02 · Pengembangan Masyarakat",
      tagEn: "02 · Community Development",
      titleId: "Memperkuat kapasitas dan inisiatif lokal.",
      titleEn: "Strengthening local capacity and initiatives.",
      descId:
        "Mendukung partisipasi, kelembagaan, dan pendekatan pembangunan yang kontekstual dan inklusif.",
      descEn:
        "Supporting participation, institutions, and contextual, inclusive development approaches.",
      image: "/images/inisiatif/pengembangan-masyarakat.jpg",
    },
    {
      number: "03",
      tagId: "03 · Riset & Pengetahuan",
      tagEn: "03 · Research & Knowledge",
      titleId: "Mengubah data dan pengalaman menjadi pembelajaran.",
      titleEn: "Transforming data and experience into shared learning.",
      descId:
        "Assessment, riset, analisis, dan penerjemahan pengetahuan untuk mendukung keputusan dan aksi.",
      descEn:
        "Assessments, research, analysis, and knowledge translation to inform decision-making and action.",
      image: "/images/inisiatif/riset-pengetahuan.jpg",
    },
    {
      number: "04",
      tagId: "04 · Iklim & Lanskap Berkelanjutan",
      tagEn: "04 · Climate & Sustainable Landscapes",
      titleId: "Melihat hubungan antara iklim, ruang, dan kehidupan.",
      titleEn: "Understanding the nexus of climate, space, and livelihoods.",
      descId:
        "Mengembangkan pendekatan yang menghubungkan ketahanan iklim, lanskap, mata pencaharian, dan pembangunan berkelanjutan.",
      descEn:
        "Advancing approaches that link climate resilience, landscapes, livelihoods, and sustainable development.",
      image: "/images/inisiatif/iklim-lanskap.jpg",
    },
  ];

  const contributions = [
    {
      titleId: "Konservasi, Iklim & Keberlanjutan",
      titleEn: "Conservation, Climate & Sustainability",
      descId:
        "Perlindungan biodiversitas dan ekosistem dengan ketahanan iklim, pengelolaan sumber daya, dan pembangunan berkelanjutan.",
      descEn:
        "Protecting biodiversity and ecosystems alongside climate resilience, resource governance, and sustainable development.",
    },
    {
      titleId: "Community Development",
      titleEn: "Community Development",
      descId:
        "Kapasitas, partisipasi, kelembagaan, dan inisiatif masyarakat melalui pendekatan kontekstual dan kolaboratif.",
      descEn:
        "Community capacity, participation, institutions, and initiatives through contextual and collaborative approaches.",
    },
    {
      titleId: "Research, Assessment & Knowledge",
      titleEn: "Research, Assessment & Knowledge",
      descId:
        "Data, pengalaman, dan pengetahuan untuk memahami persoalan, mendukung keputusan, dan membangun pembelajaran.",
      descEn:
        "Data, field experience, and knowledge to understand issues, inform decision-making, and build lasting learning.",
    },
    {
      titleId: "Program & Strategy",
      titleEn: "Program & Strategy",
      descId:
        "Menerjemahkan kebutuhan dan temuan lapangan menjadi desain, pengembangan, dan penguatan program.",
      descEn:
        "Translating field realities and contextual needs into program design, development, and strategic execution.",
    },
    {
      titleId: "Partnership & Collaboration",
      titleEn: "Partnership & Collaboration",
      descId:
        "Mempertemukan berbagai pihak, keahlian, dan kepentingan untuk membangun kerja bersama.",
      descEn:
        "Convening cross-sector stakeholders, diverse expertise, and shared interests to build collaborative action.",
    },
    {
      titleId: "Media, Storytelling & Campaign",
      titleEn: "Media, Storytelling & Campaign",
      descId:
        "Membawa pengetahuan, pengalaman, dan suara dari lapangan ke ruang publik melalui cerita, media, dan campaign.",
      descEn:
        "Amplifying field knowledge, human experiences, and voices into public spheres through narrative, media, and campaigns.",
    },
  ];

  // Merge items: use initiativesData if present or map from experiences
  const allItems: DisplayInitiative[] = useMemo(() => {
    if (initiativesData.length > 0) return initiativesData;
    return experiences.map((exp, i) => {
      const isCampaign = (exp.category || "").toLowerCase().includes("campaign") || i % 2 === 1;
      return {
        id: exp.id,
        slug: exp.slug,
        title: (isEn ? exp.titleEn : exp.titleId) || exp.titleId || exp.slug,
        excerpt: null,
        year: exp.year,
        category: exp.category || (isCampaign ? "Kampanye / Campaign" : "Proyek / Project"),
        categoryType: isCampaign ? "CAMPAIGN" : "PROJECT",
        location: exp.location,
        clientName: exp.clientName,
        featured: exp.featured,
        pdfUrl: "/documents/antrabumi-initiative-report.pdf",
        pdfLabel: `${(isEn ? exp.titleEn : exp.titleId) || exp.slug} (Report Brief)`,
      };
    });
  }, [initiativesData, experiences, isEn]);

  // Filter items based on selected category (ALL, CAMPAIGN, PROJECT)
  const filteredItems = useMemo(() => {
    if (selectedFilter === "ALL") return allItems;
    return allItems.filter((item) => item.categoryType === selectedFilter);
  }, [allItems, selectedFilter]);

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#0F2F27]">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-neutral-200/80 bg-gradient-to-b from-[#F5F3ED] via-[#F8F7F4] to-[#F8F7F4] pt-20 sm:pt-28 pb-16 lg:pb-20">
        <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#0D5C4D_1px,transparent_1px)] [background-size:28px_28px]" />
        <Container size="default">
          <div className="relative z-10 max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0D5C4D]/25 bg-white/80 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-[#0D5C4D] shadow-xs">
              <span className="h-2 w-2 rounded-full bg-[#0D5C4D] animate-pulse" />
              {isEn ? "ANTRABUMI INITIATIVES" : "INISIATIF ANTRABUMI"}
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl lg:text-[64px] font-extrabold leading-[1.08] tracking-tight text-[#0F2F27]">
              {isEn ? (
                <>A workspace connecting nature, communities, knowledge, &amp; change.</>
              ) : (
                <>Ruang kerja yang menghubungkan alam, masyarakat, pengetahuan, &amp; perubahan.</>
              )}
            </h1>

            <p className="text-base sm:text-xl text-neutral-600 max-w-2xl font-normal leading-relaxed">
              {isEn
                ? "Four initiative areas serve as a space for ANTRABUMI to work with partners, adhere to ground context, and develop contextual solutions."
                : "Empat area inisiatif menjadi ruang bagi ANTRABUMI untuk bekerja bersama mitra, mengikuti konteks lapangan, dan mengembangkan solusi yang tepat guna."}
            </p>

            {/* Quick Filter Navigation Bar */}
            <div className="flex flex-wrap items-center gap-2.5 pt-4">
              {[
                { key: "ALL", id: "Semua Inisiatif", en: "All Initiatives", count: allItems.length },
                { key: "PROJECT", id: "Proyek & Riset", en: "Projects & Research", count: allItems.filter(i => i.categoryType === "PROJECT").length },
                { key: "CAMPAIGN", id: "Kampanye & Advokasi", en: "Campaigns & Advocacy", count: allItems.filter(i => i.categoryType === "CAMPAIGN").length },
              ].map((tab) => {
                const isActive = selectedFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => {
                      setSelectedFilter(tab.key);
                      document.getElementById("karya-inisiatif")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-[#0D5C4D] text-white shadow-md shadow-[#0D5C4D]/20 scale-[1.02]"
                        : "bg-white border border-neutral-300/80 text-neutral-700 hover:border-[#0D5C4D]/50 hover:bg-neutral-50"
                    }`}
                  >
                    <span>{isEn ? tab.en : tab.id}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
                        isActive ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* 4 Initiatives Grid */}
      <section className="py-20 lg:py-28">
        <Container size="default">
          <div className="mb-12 max-w-2xl">
            <span className="block font-mono text-xs font-semibold tracking-[0.25em] text-[#0D5C4D] uppercase">
              {isEn ? "FOUR CORE AREAS" : "EMPAT PILAR KERJA"}
            </span>
            <h2 className="mt-2 font-heading text-3xl sm:text-4xl font-extrabold text-[#0F2F27]">
              {isEn ? "Focusing Action Where It Matters Most" : "Fokus Aksi pada Titik Temu Paling Bermakna"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-8">
            {initiatives.map((item, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden aspect-[16/10] min-h-[320px] sm:min-h-[360px] bg-neutral-900 shadow-md transition-all duration-500 rounded-3xl hover:shadow-2xl hover:-translate-y-1"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={isEn ? item.titleEn : item.titleId}
                  loading={idx < 2 ? "eager" : "lazy"}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20 group-hover:from-black/90 transition-all duration-500" />

                <div className="relative z-10 flex h-full flex-col justify-end p-8 sm:p-10 text-white">
                  <div className="inline-flex items-center gap-2 mb-3">
                    <span className="rounded-md bg-white/20 backdrop-blur-md px-2.5 py-1 font-mono text-[11px] font-bold tracking-wider text-white">
                      {isEn ? item.tagEn : item.tagId}
                    </span>
                  </div>

                  <h2 className="font-heading text-2xl sm:text-3xl font-extrabold leading-snug text-white mb-3 group-hover:text-[#E5A823] transition-colors">
                    {isEn ? item.titleEn : item.titleId}
                  </h2>

                  <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-normal max-w-xl">
                    {isEn ? item.descEn : item.descId}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Kontribusi Kami Section */}
      <section className="border-t border-neutral-200/80 bg-[#F4F3EE] py-20 lg:py-28">
        <Container size="default">
          <div className="mb-10 sm:mb-14 space-y-2">
            <span className="block font-mono text-xs font-semibold tracking-[0.25em] text-[#1B3E35] uppercase">
              {isEn ? "OUR CONTRIBUTIONS" : "KONTRIBUSI KAMI"}
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-[#0F2F27]">
              {isEn ? "Six interconnected capabilities." : "Enam kemampuan yang saling terhubung."}
            </h2>
          </div>

          <div className="border border-neutral-300/80 bg-[#F8F7F4]/40 rounded-2xl overflow-hidden shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {contributions.map((c, i) => {
                const isRightCol = (i + 1) % 3 === 0;
                const isBottomRow = i >= 3;

                return (
                  <div
                    key={i}
                    className={`p-7 sm:p-9 lg:p-10 flex flex-col justify-between transition-colors hover:bg-white/60 ${
                      !isRightCol ? "lg:border-r border-neutral-300/80" : ""
                    } ${!isBottomRow ? "border-b border-neutral-300/80" : ""} ${
                      i % 2 === 0 ? "md:border-r lg:border-r-0" : ""
                    }`}
                  >
                    <div>
                      <h3 className="font-heading text-base sm:text-lg font-bold text-neutral-900 mb-3 leading-snug">
                        {isEn ? c.titleEn : c.titleId}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                        {isEn ? c.descEn : c.descId}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Karya, Kampanye & Proyek Lapangan (Interactive with Filter & PDF) ─── */}
      <section id="karya-inisiatif" className="border-t border-neutral-200/80 bg-[#F8F7F4] py-20 lg:py-28">
        <Container size="default">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
            <div className="space-y-2">
              <span className="block font-mono text-xs font-semibold tracking-[0.25em] text-[#1B3E35] uppercase">
                {isEn ? "PROGRAMS & FIELD INTERVENTIONS" : "PROGRAM & AKSI LAPANGAN"}
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#0F2F27]">
                {selectedFilter === "CAMPAIGN"
                  ? isEn
                    ? "Campaign Initiatives"
                    : "Inisiatif Kampanye"
                  : selectedFilter === "PROJECT"
                  ? isEn
                    ? "Field Projects"
                    : "Proyek & Intervensi Lapangan"
                  : isEn
                  ? "All Campaigns & Projects"
                  : "Semua Kampanye & Proyek"}
              </h2>
              <p className="text-sm text-neutral-600 max-w-2xl">
                {isEn
                  ? "Field interventions, public advocacy campaigns, and programmatic roadmaps complete with downloadable documents."
                  : "Dokumentasi intervensi lapangan, kampanye penyadartahuan, serta ringkasan dokumen dan laporan PDF."}
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
              {[
                { key: "ALL", id: "Semua", en: "All" },
                { key: "CAMPAIGN", id: "Kampanye", en: "Campaign" },
                { key: "PROJECT", id: "Proyek", en: "Project" },
              ].map((tab) => {
                const isActive = selectedFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setSelectedFilter(tab.key)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#0D5C4D] text-white shadow-xs"
                        : "bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100"
                    }`}
                  >
                    {isEn ? tab.en : tab.id}
                  </button>
                );
              })}
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="flex min-h-[240px] flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-300 bg-white/60 p-12 text-center">
              <span className="text-3xl mb-3">🌿</span>
              <p className="text-base font-semibold text-neutral-800">
                {isEn
                  ? "No initiatives found in this category."
                  : "Belum ada inisiatif yang terdaftar dalam kategori ini."}
              </p>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm">
                {isEn
                  ? "Try selecting another category or view all initiatives."
                  : "Coba pilih kategori lain atau tampilkan seluruh inisiatif ANTRABUMI."}
              </p>
              <button
                type="button"
                onClick={() => setSelectedFilter("ALL")}
                className="mt-4 rounded-xl bg-[#0D5C4D] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#116958] transition-all"
              >
                {isEn ? "View all initiatives" : "Lihat semua inisiatif"}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => {
                const href = `/inisiatif/${item.slug}`;
                const isCampaign = item.categoryType === "CAMPAIGN";

                return (
                  <div
                    key={item.id}
                    className="group relative flex flex-col justify-between rounded-3xl border border-neutral-200/90 bg-white p-7 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-[#0D5C4D]/40 hover:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.08)]"
                  >
                    <div>
                      {/* Optional cover thumbnail if present */}
                      {item.coverMedia?.url && (
                        <div className="relative mb-5 h-44 w-full overflow-hidden rounded-2xl bg-neutral-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.coverMedia.url}
                            alt={item.coverMedia.altText || item.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`rounded-md px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
                            isCampaign
                              ? "bg-[#D96B27]/10 text-[#D96B27]"
                              : "bg-[#0D5C4D]/10 text-[#0D5C4D]"
                          }`}
                        >
                          {isCampaign ? (isEn ? "CAMPAIGN" : "KAMPANYE") : (isEn ? "PROJECT" : "PROYEK")}
                        </span>
                        {item.year && (
                          <span className="font-mono text-xs text-neutral-400 font-semibold">
                            {item.year}
                          </span>
                        )}
                      </div>

                      <h3 className="font-heading text-xl font-bold text-neutral-900 group-hover:text-[#0D5C4D] transition-colors leading-snug">
                        <Link href={href} className="hover:underline">
                          {item.title}
                        </Link>
                      </h3>

                      {item.excerpt && (
                        <p className="mt-2.5 text-xs text-neutral-600 leading-relaxed line-clamp-3">
                          {item.excerpt}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-y-1 gap-x-3 text-xs text-neutral-500 pt-2 border-t border-neutral-100">
                        {item.location && (
                          <span className="flex items-center gap-1 font-mono text-[11px] text-neutral-600">
                            <span>📍</span>
                            <span>{item.location}</span>
                          </span>
                        )}
                        {item.clientName && (
                          <span className="text-[11px] text-neutral-500">
                            <span className="font-medium text-neutral-400">{isEn ? "Partner: " : "Mitra: "}</span>
                            {item.clientName}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 space-y-3.5 border-t border-neutral-100 pt-4">
                      {/* PDF View & Download Strip */}
                      {item.pdfUrl && (
                        <div className="flex items-center justify-between rounded-2xl bg-[#F8F7F4] border border-neutral-200/80 p-2.5 text-xs">
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-red-100 font-mono text-[9px] font-extrabold text-red-700 shadow-2xs">
                              PDF
                            </span>
                            <span className="truncate text-[11px] font-semibold text-neutral-800">
                              {isEn ? "Brief Document" : "Laporan Ringkas"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                setModalPdf({
                                  url: item.pdfUrl!,
                                  title: item.pdfLabel || item.title,
                                  category: isCampaign ? "Kampanye" : "Proyek",
                                })
                              }
                              className="rounded-lg bg-white border border-neutral-200/80 px-2.5 py-1 text-[11px] font-semibold text-[#0D5C4D] shadow-2xs hover:bg-[#0D5C4D] hover:text-white transition-all"
                            >
                              {isEn ? "View" : "Lihat"}
                            </button>
                            <a
                              href={item.pdfUrl}
                              download
                              className="rounded-lg bg-white border border-neutral-200/80 px-2.5 py-1 text-[11px] font-semibold text-neutral-700 shadow-2xs hover:bg-neutral-100 transition-all"
                            >
                              {isEn ? "Download" : "Unduh"}
                            </a>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs font-bold text-[#0D5C4D]">
                        <Link href={href} className="group-hover:translate-x-0.5 transition-transform flex items-center gap-1.5">
                          <span>{isEn ? "Read initiative details" : "Lihat detail inisiatif"}</span>
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Container>
      </section>

      {/* Collaboration Callout */}
      <section className="relative overflow-hidden border-t border-neutral-200/80 bg-gradient-to-br from-[#0D5C4D] to-[#0A483C] py-20 text-white">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:20px_20px]" />
        <Container size="default">
          <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
              {isEn ? "Have an initiative in mind?" : "Punya inisiatif yang ingin dijalankan bersama?"}
            </h2>
            <p className="text-base text-neutral-200 leading-relaxed">
              {isEn
                ? "Let's discuss how we can bring research, community context, and action together."
                : "Mari diskusikan bagaimana kita dapat mempertemukan riset, konteks komunitas, dan aksi nyata."}
            </p>
            <div className="pt-2">
              <Link
                href="/kolaborasi"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-[#0D5C4D] shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all"
              >
                <span>{isEn ? "Start a Conversation" : "Mulai Percakapan"}</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>



      {/* PDF Modal Reader */}
      {modalPdf && (
        <PdfViewerModal
          isOpen={Boolean(modalPdf)}
          onClose={() => setModalPdf(null)}
          pdfUrl={modalPdf.url}
          title={modalPdf.title}
          category={modalPdf.category}
          lang={lang as "ID" | "EN"}
        />
      )}
    </div>
  );
}
