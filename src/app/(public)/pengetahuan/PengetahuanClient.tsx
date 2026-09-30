"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { PdfViewerModal } from "@/components/ui/PdfViewerModal";

export type KnowledgeTypeItem =
  | "ALL"
  | "ARTICLE"
  | "RESEARCH_PUBLICATION"
  | "STORY";

export interface KnowledgeDownloadItem {
  id: string;
  label?: string | null;
  url: string;
  filename: string;
  size?: number | null;
}

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
  downloads?: KnowledgeDownloadItem[];
}

interface PengetahuanClientProps {
  initialItems: DisplayKnowledge[];
  lang: string;
  initialType?: string;
}

const typeLabelsID: Record<string, string> = {
  ALL: "Semua",
  ARTICLE: "Artikel",
  RESEARCH_PUBLICATION: "Riset & Publikasi",
  STORY: "Cerita Lapangan",
};

const typeLabelsEN: Record<string, string> = {
  ALL: "All",
  ARTICLE: "Article",
  RESEARCH_PUBLICATION: "Research & Publication",
  STORY: "Field Story",
};

export function PengetahuanClient({ initialItems, lang, initialType = "ALL" }: PengetahuanClientProps) {
  const isEn = lang === "EN";
  const typeLabels = isEn ? typeLabelsEN : typeLabelsID;

  const [selectedType, setSelectedType] = useState<string>(initialType);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [modalPdf, setModalPdf] = useState<{
    url: string;
    title: string;
    category?: string;
  } | null>(null);

  useEffect(() => {
    if (initialType && initialType !== "ALL") {
      setSelectedType(initialType);
      // Optional slight scroll to archive if category is specified in query
      const arsipEl = document.getElementById("arsip");
      if (arsipEl) {
        arsipEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [initialType]);

  const filterTabs: string[] = [
    "ALL",
    "ARTICLE",
    "RESEARCH_PUBLICATION",
    "STORY",
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
    <div className="min-h-screen bg-white text-neutral-900 font-sans">
      {/* ─── 1. EDITORIAL HEADER / HERO ─────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-neutral-200/80 bg-gradient-to-b from-[#FBF9F5] via-[#FDFBF7] to-white py-24 sm:py-32">
        <div className="absolute inset-0 pointer-events-none opacity-35 bg-[radial-gradient(#0D5C4D_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute -top-32 right-10 h-96 w-96 rounded-full bg-[#0D5C4D]/5 blur-3xl pointer-events-none" />
        <Container size="default">
          <div className="relative z-10 max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0D5C4D]/25 bg-white/80 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-[#0D5C4D] shadow-xs">
              <span className="h-2 w-2 rounded-full bg-[#0D5C4D] animate-pulse" />
              {isEn ? "KNOWLEDGE & RESEARCH" : "PENGETAHUAN & RISET"}
            </div>
            <h1 className="font-heading text-4xl sm:text-6xl lg:text-[64px] font-extrabold tracking-tight text-neutral-950 leading-[1.08]">
              {isEn ? (
                <>
                  Knowledge grows when <span className="text-[#0D5C4D]">experience is shared</span>.
                </>
              ) : (
                <>
                  Pengetahuan tumbuh ketika <span className="text-[#0D5C4D]">pengalaman dibagikan</span>.
                </>
              )}
            </h1>
            <p className="text-base sm:text-xl text-neutral-600 max-w-2xl font-normal leading-relaxed">
              {isEn
                ? "A dedicated hub for field stories, research reports, policy briefs, and contextual learnings from collaborative processes across Indonesia."
                : "Ruang dokumentasi terbuka untuk cerita lapangan, laporan riset, policy brief, dan pembelajaran kontekstual dari proses kerja bersama di berbagai lanskap."}
            </p>

            {/* Sub-menu kategori */}
            <nav aria-label="Kategori Pengetahuan" className="flex flex-wrap items-center gap-2.5 pt-4">
              {(["ALL", "ARTICLE", "RESEARCH_PUBLICATION", "STORY"] as string[]).map((tab) => {
                const subLabels: Record<string, { id: string; en: string }> = {
                  ALL: { id: "Semua", en: "All" },
                  ARTICLE: { id: "Artikel & Opini", en: "Articles & Opinions" },
                  RESEARCH_PUBLICATION: { id: "Riset & Publikasi", en: "Research & Reports" },
                  STORY: { id: "Cerita Lapangan", en: "Field Stories" },
                };
                const label = isEn ? subLabels[tab]?.en : subLabels[tab]?.id;
                const isActive = selectedType === tab;
                const count = tab === "ALL" ? initialItems.length : initialItems.filter(i => i.type === tab).length;

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setSelectedType(tab);
                      document.getElementById("arsip")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-[#0D5C4D] text-white shadow-md shadow-[#0D5C4D]/20 scale-[1.02]"
                        : "bg-white border border-neutral-300/80 text-neutral-700 hover:border-[#0D5C4D]/50 hover:bg-neutral-50"
                    }`}
                  >
                    <span>{label}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-mono ${
                        isActive ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </Container>
      </section>

      {/* ─── 2. FEATURED SECTION (2 COLUMNS: LEFT STORY + RIGHT 3 ITEMS) ── */}
      <section className="bg-white py-16 sm:py-24 border-b border-neutral-100">
        <Container size="default">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Featured Item: CERITA LAPANGAN */}
            <div className="lg:col-span-7 group flex flex-col space-y-6">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-neutral-100 shadow-sm border border-neutral-200/80">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/pengetahuan/cerita-lapangan.jpg"
                  alt={isEn ? "Field Story" : "Cerita Lapangan"}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="space-y-3">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  {isEn ? "FIELD STORY · 2026" : "CERITA LAPANGAN · 2026"}
                </p>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-950 group-hover:text-[#0D5C4D] transition-colors leading-snug">
                  {isEn
                    ? "Between knowledge, place, and living realities."
                    : "Di antara pengetahuan, tempat, dan kehidupan."}
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-neutral-600">
                  {isEn
                    ? "Notes from the field on how a challenge reveals itself when we listen more closely."
                    : "Catatan dari lapangan tentang bagaimana sebuah persoalan terlihat ketika kita mendengarkan lebih dekat."}
                </p>
                <div className="pt-2">
                  <Link
                    href="#arsip"
                    onClick={() => setSelectedType("STORY")}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#0D5C4D] hover:text-[#116958] transition-all group-hover:gap-3"
                  >
                    <span>{isEn ? "Read stories" : "Baca cerita"}</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Stacked Column (3 Items with horizontal divider lines) */}
            <div className="lg:col-span-5 flex flex-col divide-y divide-neutral-200/90 pt-2 lg:pt-0">
              {/* Item 1: OPINI */}
              <div className="pb-8 first:pt-0 group">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  {isEn ? "OPINION · 2026" : "OPINI · 2026"}
                </p>
                <h3 className="mt-2 font-heading text-lg sm:text-xl font-bold text-neutral-950 group-hover:text-[#0D5C4D] transition-colors leading-snug">
                  <Link href="#arsip" onClick={() => setSelectedType("ARTICLE")}>
                    {isEn
                      ? "Why context must precede solutions?"
                      : "Mengapa konteks harus datang sebelum solusi?"}
                  </Link>
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-neutral-600">
                  {isEn
                    ? "Reflections on reading development and environmental issues through grassroots realities."
                    : "Refleksi tentang cara membaca persoalan pembangunan dan lingkungan."}
                </p>
              </div>

              {/* Item 2: PUBLIKASI */}
              <div className="py-8 group">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  {isEn ? "PUBLICATION · 2026" : "PUBLIKASI · 2026"}
                </p>
                <h3 className="mt-2 font-heading text-lg sm:text-xl font-bold text-neutral-950 group-hover:text-[#0D5C4D] transition-colors leading-snug">
                  <Link href="#arsip" onClick={() => setSelectedType("RESEARCH_PUBLICATION")}>
                    Research, Assessment & Knowledge
                  </Link>
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-neutral-600">
                  {isEn
                    ? "A collection of reports and assessments underpinning evidence-based decision making."
                    : "Kumpulan laporan dan assessment yang menjadi dasar pengambilan keputusan."}
                </p>
              </div>

              {/* Item 3: PANDUAN */}
              <div className="pt-8 group">
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  {isEn ? "GUIDE · 2026" : "PANDUAN · 2026"}
                </p>
                <h3 className="mt-2 font-heading text-lg sm:text-xl font-bold text-neutral-950 group-hover:text-[#0D5C4D] transition-colors leading-snug">
                  <Link href="#arsip" onClick={() => setSelectedType("RESEARCH_PUBLICATION")}>
                    {isEn
                      ? "Learning from collaborative processes"
                      : "Belajar dari proses kolaborasi"}
                  </Link>
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-neutral-600">
                  {isEn
                    ? "Toolkits and learnings ready to be adapted and reused by partner organizations."
                    : "Toolkit dan pembelajaran yang dapat digunakan kembali oleh mitra."}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── 3. PUBLIKASI SECTION (3 RICH CARDS WITH DETAILED EXPLANATION) ── */}
      <section className="bg-[#FAF9F5] py-20 sm:py-28 border-b border-neutral-200/80">
        <Container size="default">
          <div className="mb-14 space-y-3">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#0D5C4D]">
              {isEn ? "PUBLICATIONS" : "PUBLIKASI"}
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950">
              {isEn
                ? "Documents to read, use, and share."
                : "Dokumen yang dapat dibaca, digunakan, dan dibagikan."}
            </h2>
            <p className="max-w-3xl text-sm sm:text-base text-neutral-600 leading-relaxed">
              {isEn
                ? "Open knowledge resources produced through rigorous field research, stakeholder dialogues, and participatory community development."
                : "Sumber daya pengetahuan terbuka yang dihasilkan melalui kajian lapangan berdisiplin, dialog multi-pihak, serta pendampingan masyarakat berbasis bukti."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: LAPORAN */}
            <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-xs transition-all hover:border-[#0D5C4D]/50 hover:shadow-xl hover:-translate-y-1">
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/pengetahuan/laporan-assessment.jpg"
                    alt={isEn ? "Reports and Assessments" : "Laporan dan Asesmen"}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-md bg-white/90 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#0D5C4D] shadow-xs backdrop-blur-xs">
                      {isEn ? "REPORT" : "LAPORAN"}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-7 space-y-3">
                  <h3 className="font-heading text-xl font-bold text-neutral-950 group-hover:text-[#0D5C4D] transition-colors leading-snug">
                    Assessment &amp; programme learning
                  </h3>
                  <p className="font-medium text-xs text-neutral-700">
                    {isEn
                      ? "Research reports and continuous learning processes."
                      : "Dokumen hasil riset dan proses pembelajaran."}
                  </p>

                  {/* Penjelasan Tambahan / Detailed Explanation */}
                  <div className="pt-2 text-xs leading-relaxed text-neutral-600 border-t border-neutral-100 space-y-2">
                    <p>
                      {isEn
                        ? "Comprehensive reports documenting ecological baselines, marine and terrestrial landscape mapping, and multi-stakeholder program evaluations. Synthesizes scientific methods with empirical field data to provide actionable evidence for long-term sustainability interventions."
                        : "Dokumentasi komprehensif yang memuat kajian baseline ekologi, pemetaan bentang alam pesisir dan darat, serta evaluasi program berbasis data lapangan yang terverifikasi. Disusun secara multi-disiplin untuk memberikan gambaran faktual tentang kondisi bentang alam, dinamika sosial ekonomi komunitas, dan rekomendasi intervensi berkelanjutan."}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-600">
                        {isEn ? "Ecological Baseline" : "Baseline Ekologi"}
                      </span>
                      <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-600">
                        {isEn ? "Spatial Mapping" : "Pemetaan Spasial"}
                      </span>
                      <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-600">
                        {isEn ? "Program Review" : "Evaluasi Program"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-7 pt-0 border-t border-neutral-100/60 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedType("RESEARCH_PUBLICATION");
                    document.getElementById("arsip")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D5C4D] hover:underline"
                >
                  <span>{isEn ? "Explore Reports" : "Telusuri Dokumen Laporan"}</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Card 2: POLICY BRIEF */}
            <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-xs transition-all hover:border-[#0D5C4D]/50 hover:shadow-xl hover:-translate-y-1">
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/pengetahuan/policy-brief.jpg"
                    alt={isEn ? "Policy Brief" : "Policy Brief"}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-md bg-white/90 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#2B8282] shadow-xs backdrop-blur-xs">
                      POLICY BRIEF
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-7 space-y-3">
                  <h3 className="font-heading text-xl font-bold text-neutral-950 group-hover:text-[#0D5C4D] transition-colors leading-snug">
                    Knowledge for better decisions
                  </h3>
                  <p className="font-medium text-xs text-neutral-700">
                    {isEn
                      ? "Knowledge synthesis for policy spaces and collaborative governance."
                      : "Ringkasan pengetahuan untuk ruang kebijakan dan kolaborasi."}
                  </p>

                  {/* Penjelasan Tambahan / Detailed Explanation */}
                  <div className="pt-2 text-xs leading-relaxed text-neutral-600 border-t border-neutral-100 space-y-2">
                    <p>
                      {isEn
                        ? "Concise, strategic briefs translating complex technical research into clear, practical policy insights. Designed specifically for regional policymakers, ministries, and civil society leaders to shape responsive regulations, equitable resource distribution, and climate-resilient governance."
                        : "Ringkasan strategis yang menerjemahkan data riset kompleks menjadi poin-poin implikasi kebijakan yang ringkas dan lugas. Ditujukan bagi pembuat kebijakan, instansi pemerintah, dan mitra pembangunan untuk merumuskan tata kelola bentang alam yang adil, inklusif, dan adaptif terhadap perubahan iklim."}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-600">
                        {isEn ? "Executive Brief" : "Ringkasan Eksekutif"}
                      </span>
                      <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-600">
                        {isEn ? "Policy Recommendations" : "Rekomendasi Kebijakan"}
                      </span>
                      <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-600">
                        {isEn ? "Landscape Governance" : "Tata Kelola Wilayah"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-7 pt-0 border-t border-neutral-100/60 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedType("RESEARCH_PUBLICATION");
                    document.getElementById("arsip")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D5C4D] hover:underline"
                >
                  <span>{isEn ? "Explore Policy Briefs" : "Telusuri Policy Brief"}</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Card 3: TOOLKIT */}
            <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-xs transition-all hover:border-[#0D5C4D]/50 hover:shadow-xl hover:-translate-y-1">
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/pengetahuan/toolkit-community.jpg"
                    alt={isEn ? "Toolkit & Field Guides" : "Toolkit & Panduan"}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-md bg-white/90 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#D96B27] shadow-xs backdrop-blur-xs">
                      TOOLKIT
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-7 space-y-3">
                  <h3 className="font-heading text-xl font-bold text-neutral-950 group-hover:text-[#0D5C4D] transition-colors leading-snug">
                    Community-centred approaches
                  </h3>
                  <p className="font-medium text-xs text-neutral-700">
                    {isEn
                      ? "Actionable toolkits and operational guides grounded in field experience."
                      : "Panduan praktis dari pengalaman lapangan."}
                  </p>

                  {/* Penjelasan Tambahan / Detailed Explanation */}
                  <div className="pt-2 text-xs leading-relaxed text-neutral-600 border-t border-neutral-100 space-y-2">
                    <p>
                      {isEn
                        ? "Ready-to-deploy participatory toolkits, facilitation guides, and practical instruments tested alongside local communities. Includes GEDSI assessment matrices (Gender Equality, Disability, and Social Inclusion), village facilitation modules, and citizen self-monitoring protocols."
                        : "Panduan kerja langkah-demi-langkah dan instrumen partisipatif siap pakai yang diuji langsung bersama masyarakat. Menyediakan instrumen asesmen GEDSI (kesetaraan gender, disabilitas, dan inklusi sosial), lembar kerja fasilitasi desa, metode pemetaan partisipatif, serta protokol monitoring mandiri warga."}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-600">
                        {isEn ? "GEDSI Framework" : "Kerangka GEDSI"}
                      </span>
                      <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-600">
                        {isEn ? "FGD Modules" : "Modul Fasilitasi FGD"}
                      </span>
                      <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-600">
                        {isEn ? "Citizen Monitoring" : "Monitoring Warga"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-7 pt-0 border-t border-neutral-100/60 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedType("RESEARCH_PUBLICATION");
                    document.getElementById("arsip")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D5C4D] hover:underline"
                >
                  <span>{isEn ? "Explore Toolkits" : "Telusuri Panduan & Toolkit"}</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── 4. DYNAMIC CMS KNOWLEDGE ARCHIVE (FILTER & EXPLORATION) ────── */}
      <section id="arsip" className="py-20 sm:py-28 bg-white">
        <Container size="default">
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-neutral-200 pb-6">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[#0D5C4D]">
                {isEn ? "EXPLORE ARCHIVE" : "TELUSURI ARSIP"}
              </p>
              <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-bold text-neutral-950">
                {isEn ? "All Publications & Insights" : "Semua Publikasi & Tulisan Lapangan"}
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                {isEn
                  ? "Browse publications, research briefs, and articles produced by the ANTRABUMI team."
                  : "Telusuri publikasi resmi, catatan refleksi, dan riset yang diterbitkan oleh tim ANTRABUMI."}
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72 shrink-0">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEn ? "Search by title or topic..." : "Cari judul atau topik..."}
                className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-2.5 pl-10 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-[#0D5C4D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0D5C4D]/10"
              />
              <svg
                className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400"
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
                  className="absolute right-3.5 top-2.5 text-xs text-neutral-400 hover:text-neutral-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Filter Categories */}
          <div className="mb-10 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {filterTabs.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all shrink-0 ${
                  selectedType === type
                    ? "bg-[#0D5C4D] text-white shadow-sm font-semibold"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {typeLabels[type] ?? type}
              </button>
            ))}
          </div>

          {/* Articles Grid or Empty Search */}
          {filteredItems.length === 0 ? (
            <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50 p-8 text-center">
              <p className="text-sm font-medium text-neutral-600">
                {isEn
                  ? "No publication matches your search / category filter."
                  : "Belum ada dokumen publikasi yang cocok dengan filter atau kata kunci ini."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedType("ALL");
                  setSearchQuery("");
                }}
                className="mt-3 text-xs font-semibold text-[#0D5C4D] underline hover:text-[#116958]"
              >
                {isEn ? "Reset all filters" : "Reset semua filter"}
              </button>
            </div>
          ) : (
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
                  <div
                    key={item.id}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white transition-all duration-300 hover:border-[#0D5C4D]/50 hover:shadow-xl hover:-translate-y-1"
                  >
                    {item.featured && (
                      <div className="absolute top-3 right-3 z-10 rounded-full bg-[#E5A823] px-2.5 py-0.5 font-mono text-[10px] font-bold text-neutral-950 shadow-md">
                        ★ {isEn ? "Featured" : "Unggulan"}
                      </div>
                    )}

                    {/* Cover Media */}
                    <Link href={`/pengetahuan/${item.slug}`} className="block relative aspect-video w-full overflow-hidden bg-neutral-100">
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
                    </Link>

                    {/* Content Detail */}
                    <div className="flex flex-1 flex-col justify-between gap-4 p-6">
                      <div className="space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="rounded-md bg-[#0D5C4D]/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#0D5C4D]">
                            {typeLabel}
                          </span>
                          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono" suppressHydrationWarning>
                            {date && <span suppressHydrationWarning>{date}</span>}
                            {item.authorName && (
                              <span className="truncate max-w-[130px]" title={item.authorName}>
                                · {item.authorName}
                              </span>
                            )}
                          </div>
                        </div>
                        <h3 className="font-heading text-base font-bold leading-snug text-neutral-950 group-hover:text-[#0D5C4D] transition-colors line-clamp-2">
                          <Link href={`/pengetahuan/${item.slug}`} className="hover:underline">
                            {item.title}
                          </Link>
                        </h3>
                        {item.excerpt && (
                          <p className="text-xs leading-relaxed text-neutral-600 line-clamp-2">
                            {item.excerpt}
                          </p>
                        )}
                      </div>

                      {/* PDF Document Quick Action if available */}
                      {item.downloads && item.downloads.length > 0 && (
                        <div className="rounded-xl border border-neutral-200/90 bg-neutral-50/80 p-2.5 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-red-100 font-mono text-[9px] font-bold text-red-600">
                                PDF
                              </span>
                              <span className="truncate text-[11px] font-medium text-neutral-700">
                                {item.downloads[0].label || (isEn ? "Research Brief" : "Dokumen Riset")}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 pt-1 border-t border-neutral-200/60">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setModalPdf({
                                  url: item.downloads![0].url,
                                  title: item.downloads![0].label || item.title,
                                  category: typeLabel,
                                });
                              }}
                              className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-neutral-200 bg-white py-1 text-[11px] font-semibold text-neutral-700 hover:border-[#0D5C4D] hover:text-[#0D5C4D] transition-colors cursor-pointer"
                            >
                              <span>👁</span>
                              <span>{isEn ? "View PDF" : "Lihat PDF"}</span>
                            </button>
                            <a
                              href={item.downloads[0].url}
                              download
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#0D5C4D] py-1 text-[11px] font-semibold text-white hover:bg-[#116958] transition-colors shadow-2xs"
                            >
                              <span>↓</span>
                              <span>{isEn ? "Download" : "Unduh"}</span>
                            </a>
                          </div>
                        </div>
                      )}

                      <Link
                        href={`/pengetahuan/${item.slug}`}
                        className="flex items-center justify-between pt-3 border-t border-neutral-100 text-xs font-semibold text-[#0D5C4D] group-hover:text-[#116958]"
                      >
                        <span>{isEn ? "Read article" : "Baca selengkapnya"}</span>
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Container>
      </section>

      {/* ─── 5. CALLOUT FOR RESEARCH PARTNERSHIP ────────────────────────── */}
      <section className="border-t border-neutral-100 bg-[#FBF9F4] py-16 sm:py-20">
        <Container size="reading">
          <div className="space-y-5 text-center">
            <span className="inline-flex items-center rounded-full bg-[#0D5C4D]/10 px-3.5 py-1 font-mono text-xs font-semibold text-[#0D5C4D]">
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
                : "Kami bermitra dengan perguruan tinggi, peneliti independen, organisasi masyarakat sipil, dan pengambil kebijakan untuk menghasilkan kajian berbasis bukti yang kontekstual dan aplikatif."}
            </p>
            <div className="pt-2">
              <Link
                href="/kolaborasi"
                className="inline-flex h-12 items-center rounded-xl bg-gradient-to-r from-[#0D5C4D] via-[#116958] to-[#147A66] px-8 text-sm font-semibold text-white shadow-md shadow-[#0D5C4D]/25 transition-all hover:shadow-lg hover:shadow-[#0D5C4D]/35 hover:-translate-y-0.5"
              >
                {isEn ? "Start Knowledge Partnership" : "Mulai Kemitraan Riset"}
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
