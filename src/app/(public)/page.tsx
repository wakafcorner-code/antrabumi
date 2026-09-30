import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { getLanguage } from "@/lib/i18n/language";
import { getHeroSliderDataAction } from "@/features/hero/actions";
import { getHomeContentAction } from "@/features/home-content/actions";
import { HeroSlider } from "@/components/sections/HeroSlider/HeroSlider";
import { findPublishedPartners } from "@/server/repositories/partner.repository";
import { findExperiences } from "@/server/repositories/experience.repository";
import { prisma } from "@/lib/db/prisma";
import { ContentStatus } from "@prisma/client";

export const metadata: Metadata = {
  title: "ANTRABUMI — Connecting Knowledge, Nature, & Communities",
  description:
    "ANTRABUMI adalah organisasi independen yang bekerja di persimpangan pengetahuan, alam, dan komunitas — menghubungkan riset lapangan, pengetahuan lokal, dan kolaborasi lintas sektor.",
  openGraph: {
    title: "ANTRABUMI — Connecting Knowledge, Nature, & Communities",
    description:
      "Organisasi independen yang menghubungkan riset, pengalaman lapangan, pengetahuan lokal, dan komunitas untuk mengembangkan pendekatan yang kontekstual.",
    url: "https://www.antrabumi.org",
    siteName: "ANTRABUMI",
    locale: "id_ID",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

// ─── Static Contribution Areas (Official from AGENTS.md / Profile 2026) ───────

const contributionsID = [
  {
    no: "01",
    title: "Konservasi, Iklim & Keberlanjutan",
    desc: "Menghubungkan perlindungan biodiversitas dan ekosistem dengan ketahanan iklim, pengelolaan sumber daya, dan pembangunan berkelanjutan.",
    href: "/inisiatif?kategori=konservasi",
    tag: "Ekosistem & Iklim",
  },
  {
    no: "02",
    title: "Program & Strategy",
    desc: "Menerjemahkan kebutuhan dan temuan lapangan menjadi desain, pengembangan, dan penguatan program.",
    href: "/inisiatif?kategori=program",
    tag: "Desain Intervensi",
  },
  {
    no: "03",
    title: "Partnership & Collaboration",
    desc: "Mempertemukan berbagai pihak, keahlian, dan kepentingan untuk membangun kerja bersama lintas sektor.",
    href: "/kolaborasi",
    tag: "Kerja Sama Multi-Pihak",
  },
  {
    no: "04",
    title: "Media, Storytelling & Campaign",
    desc: "Membawa pengetahuan, pengalaman, dan suara dari lapangan ke ruang publik melalui cerita, media, dan kampanye.",
    href: "/pengetahuan?kategori=cerita",
    tag: "Narasi & Advokasi",
  },
  {
    no: "05",
    title: "Community Development",
    desc: "Memperkuat kapasitas, partisipasi, kelembagaan, dan inisiatif masyarakat melalui pendekatan GEDSI-responsive dan kolaboratif.",
    href: "/inisiatif?kategori=komunitas",
    tag: "Pemberdayaan Warga",
  },
  {
    no: "06",
    title: "Research, Assessment & Knowledge",
    desc: "Menghasilkan dan menerjemahkan data, pengalaman, dan pengetahuan untuk memahami persoalan, mendukung keputusan, dan membangun pembelajaran.",
    href: "/pengetahuan?kategori=riset",
    tag: "Kajian Berbasis Bukti",
  },
];

const contributionsEN = [
  {
    no: "01",
    title: "Conservation, Climate & Sustainability",
    desc: "Connecting biodiversity and ecosystem protection with climate resilience, resource management, and sustainable development.",
    href: "/inisiatif?kategori=konservasi",
    tag: "Ecosystem & Climate",
  },
  {
    no: "02",
    title: "Program & Strategy",
    desc: "Translating field needs and findings into robust program design, development, and contextual scaling.",
    href: "/inisiatif?kategori=program",
    tag: "Intervention Design",
  },
  {
    no: "03",
    title: "Partnership & Collaboration",
    desc: "Bringing together diverse stakeholders, expertise, and priorities to forge multi-sector collaborative partnerships.",
    href: "/kolaborasi",
    tag: "Multi-Stakeholder",
  },
  {
    no: "04",
    title: "Media, Storytelling & Campaign",
    desc: "Amplifying grassroots knowledge, field experiences, and public voices through compelling stories, media, and campaigns.",
    href: "/pengetahuan?kategori=cerita",
    tag: "Narrative & Advocacy",
  },
  {
    no: "05",
    title: "Community Development",
    desc: "Strengthening community capacity, participation, governance, and initiatives through GEDSI-responsive and participatory approaches.",
    href: "/inisiatif?kategori=komunitas",
    tag: "Community Stewardship",
  },
  {
    no: "06",
    title: "Research, Assessment & Knowledge",
    desc: "Generating and translating field data, experiences, and evidence-based knowledge to inform decision-making and continuous learning.",
    href: "/pengetahuan?kategori=riset",
    tag: "Evidence-Based Study",
  },
];

const expertise = [
  "Community Development",
  "GEDSI (Gender & Inclusion)",
  "Research & Assessment",
  "Communication & Storytelling",
  "Conservation & Landscape",
  "Policy & Governance",
  "Climate & Sustainability",
  "Cross-Sector Partnership",
];

// Fallback contextual imagery for experiences if none uploaded
const fallbackExperienceImages = [
  "/images/inisiatif/iklim-lanskap.jpg",
  "/images/inisiatif/konservasi-alam.jpg",
  "/images/inisiatif/pengembangan-masyarakat.jpg",
  "/images/inisiatif/riset-pengetahuan.jpg",
];

// ─── Homepage Component ──────────────────────────────────────────────────────

export default async function HomePage() {
  const [lang, heroData, homeContent, partners, experiencesData, latestKnowledge] = await Promise.all([
    getLanguage(),
    getHeroSliderDataAction(),
    getHomeContentAction(),
    findPublishedPartners(),
    findExperiences({ perPage: 4, status: ContentStatus.PUBLISHED }),
    prisma.knowledge.findMany({
      where: { status: ContentStatus.PUBLISHED },
      take: 3,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      include: {
        coverMedia: { select: { url: true, altText: true } },
        translations: {
          select: {
            language: true,
            title: true,
            excerpt: true,
          },
        },
      },
    }),
  ]);

  const isEn = lang === "EN";
  const contributions = isEn ? contributionsEN : contributionsID;

  // Real published experiences
  const experiences = experiencesData.items;

  // Visual pillar images
  const pillarImages: Record<string, string> = {
    KNOWLEDGE: "/images/inisiatif/riset-pengetahuan.jpg",
    NATURE: "/images/inisiatif/konservasi-alam.jpg",
    COMMUNITIES: "/images/inisiatif/pengembangan-masyarakat.jpg",
  };

  return (
    <div className="bg-white selection:bg-[#0D5C4D] selection:text-white">
      {/* ── HERO SLIDER (Configurable via /admin/hero) ────────────────── */}
      <HeroSlider
        slides={heroData.slides}
        config={heroData.config}
        lang={lang}
      />

      {/* ── 01 MENGAPA KAMI HADIR — MANIFESTO & REALITA LAPANGAN ────────── */}
      <section aria-labelledby="why-heading" className="relative border-b border-neutral-100 bg-[#FAF9F5] py-16 sm:py-24 lg:py-28">
        <Container size="default">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Left Column: Editorial Statement */}
            <div className="space-y-6 lg:col-span-7">
              <div className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D96B27]" />
                <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#D96B27]">
                  {isEn ? homeContent.whyUs.badgeEn || "WHY ANTRABUMI EXISTS" : homeContent.whyUs.badge || "MENGAPA KAMI HADIR"}
                </span>
              </div>

              <h2
                id="why-heading"
                className="font-heading text-3xl font-bold leading-[1.2] tracking-tight text-neutral-950 sm:text-4xl lg:text-[42px]"
              >
                {isEn ? homeContent.whyUs.titleEn || homeContent.whyUs.title : homeContent.whyUs.title}
              </h2>

              <p className="text-base leading-relaxed text-neutral-700 sm:text-lg sm:leading-relaxed whitespace-pre-line font-normal">
                {isEn ? homeContent.whyUs.leadTextEn || homeContent.whyUs.leadText : homeContent.whyUs.leadText}
              </p>

              {/* The Bridge Quote Box */}
              <div className="relative rounded-2xl border-l-4 border-[#0D5C4D] bg-white p-6 shadow-sm sm:p-8">
                <span className="absolute -top-3 left-6 font-serif text-5xl font-bold text-[#0D5C4D]/20 leading-none">
                  “
                </span>
                <h3 className="font-heading text-base font-bold text-neutral-900 sm:text-lg">
                  {isEn ? homeContent.whyUs.bridgeTitleEn || homeContent.whyUs.bridgeTitle : homeContent.whyUs.bridgeTitle}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 sm:text-base">
                  {isEn ? homeContent.whyUs.bridgeTextEn || homeContent.whyUs.bridgeText : homeContent.whyUs.bridgeText}
                </p>
                <div className="mt-4 flex items-center gap-3 pt-3 border-t border-neutral-100 text-xs font-mono text-neutral-400">
                  <span className="font-semibold text-[#0D5C4D]">ANTRABUMI</span>
                  <span>·</span>
                  <span>Independent Organization</span>
                </div>
              </div>
            </div>

            {/* Right Column: Authentic Editorial Photo Composition */}
            <div className="relative lg:col-span-5">
              <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border border-neutral-200/80 bg-white p-3 shadow-xl">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-neutral-900">
                  <img
                    src="/images/inisiatif/iklim-lanskap.jpg"
                    alt="Bentang alam dan masyarakat pesisir Belitung"
                    className="h-full w-full object-cover brightness-[0.92] contrast-[1.05] transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/20 to-transparent" />

                  {/* Caption badge inside photo */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#E5A823]">
                      Catatan Lapangan &amp; Bentang Alam
                    </p>
                    <p className="mt-1 font-heading text-sm font-bold leading-snug">
                      {isEn
                        ? "Connecting field knowledge and community reality with real-world sustainability."
                        : "Menghubungkan suara tapak, kearifan lokal, dan sains untuk masa depan yang lestari."}
                    </p>
                    <p className="mt-1 font-mono text-[10px] text-neutral-300">
                      Belitung &amp; Kepulauan Nusantara
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 02 TIGA PILAR UTAMA (KNOWLEDGE · NATURE · COMMUNITIES) ──────── */}
      <section aria-labelledby="pillars-heading" className="border-b border-neutral-100 bg-white py-16 sm:py-24 lg:py-28">
        <Container size="default">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full bg-[#0D5C4D]/10 px-3.5 py-1 font-mono text-xs font-bold uppercase tracking-widest text-[#0D5C4D]">
              {isEn ? "THREE CORE PILLARS" : "TIGA PILAR UTAMA"}
            </span>
            <h2
              id="pillars-heading"
              className="mt-4 font-heading text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl lg:text-[40px]"
            >
              {isEn ? homeContent.about.titleEn || homeContent.about.title : homeContent.about.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-neutral-600 sm:text-lg">
              {isEn ? homeContent.about.descriptionEn || homeContent.about.description : homeContent.about.description}
            </p>
          </div>

          {/* Three Pillar Panoramic Cards */}
          <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {homeContent.pillars.map((pillar, idx) => {
              const accentColors = [
                {
                  badge: "bg-[#0D5C4D] text-white",
                  border: "hover:border-[#0D5C4D]",
                  glow: "group-hover:text-[#0D5C4D]",
                  bg: "from-[#0D5C4D]/5 to-transparent",
                  title: pillar.key,
                },
                {
                  badge: "bg-[#116958] text-white",
                  border: "hover:border-[#116958]",
                  glow: "group-hover:text-[#116958]",
                  bg: "from-[#116958]/5 to-transparent",
                  title: pillar.key,
                },
                {
                  badge: "bg-[#D96B27] text-white",
                  border: "hover:border-[#D96B27]",
                  glow: "group-hover:text-[#D96B27]",
                  bg: "from-[#D96B27]/5 to-transparent",
                  title: pillar.key,
                },
              ];
              const style = accentColors[idx % accentColors.length];
              const imageSrc = pillarImages[pillar.key] || fallbackExperienceImages[idx % fallbackExperienceImages.length];

              return (
                <div
                  key={pillar.id}
                  className={`group relative flex flex-col overflow-hidden rounded-3xl border border-neutral-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${style.border}`}
                >
                  {/* Photo Header */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
                    <img
                      src={imageSrc}
                      alt={pillar.label}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-[0.88]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent" />
                    <span className={`absolute top-4 left-4 rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider ${style.badge}`}>
                      0{idx + 1} · {pillar.id}
                    </span>
                    <p className="absolute bottom-3 left-4 right-4 font-heading text-xl font-bold text-white tracking-wide">
                      {pillar.key}
                    </p>
                  </div>

                  {/* Body Content */}
                  <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                    <div>
                      <h3 className={`font-heading text-base font-bold text-neutral-900 transition-colors ${style.glow}`}>
                        {isEn && pillar.labelEn ? pillar.labelEn : pillar.label}
                      </h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-neutral-600">
                        {isEn && pillar.descriptionEn ? pillar.descriptionEn : pillar.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-400 group-hover:text-neutral-700 transition-colors">
                      <span className="font-mono text-[11px] uppercase tracking-wider">
                        {isEn ? "Core Foundation" : "Pilar Fundamental"}
                      </span>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── 03 JEJAK LANGKAH 2021 – 2026 (TIMELINE) ────────────────────── */}
      <section aria-labelledby="journey-heading" className="border-b border-neutral-100 bg-[#FAF9F6] py-16 sm:py-24">
        <Container size="default">
          <div className="mb-12 max-w-2xl">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#D96B27]">
              {isEn ? homeContent.growth.badgeEn || "OUR JOURNEY" : homeContent.growth.badge || "JEJAK LANGKAH"}
            </span>
            <h2
              id="journey-heading"
              className="mt-3 font-heading text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl"
            >
              {isEn ? homeContent.growth.titleEn || homeContent.growth.title : homeContent.growth.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 whitespace-pre-line sm:text-base">
              {isEn ? homeContent.growth.leadTextEn || homeContent.growth.leadText : homeContent.growth.leadText}
            </p>
          </div>

          {/* Timeline Milestones Horizontal Track */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {homeContent.growth.timeline.map((item, idx) => {
              const isLatest = idx === homeContent.growth.timeline.length - 1;
              return (
                <div
                  key={item.year + idx}
                  className={`flex flex-col justify-between rounded-2xl border p-5 transition duration-300 hover:-translate-y-1 ${
                    isLatest
                      ? "border-[#0D5C4D] bg-[#0D5C4D] text-white shadow-lg shadow-[#0D5C4D]/25"
                      : "border-neutral-200/90 bg-white hover:border-[#0D5C4D]/40 hover:shadow-md"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-mono text-2xl font-bold tracking-tight ${
                          isLatest ? "text-[#E5A823]" : "text-[#0D5C4D]"
                        }`}
                      >
                        {item.year}
                      </span>
                      {isLatest && (
                        <span className="rounded-full bg-[#E5A823] px-2 py-0.5 font-mono text-[9px] font-bold text-neutral-900 uppercase">
                          New
                        </span>
                      )}
                    </div>
                    <h3
                      className={`mt-2 font-heading text-sm font-bold leading-snug ${
                        isLatest ? "text-white" : "text-neutral-900"
                      }`}
                    >
                      {isEn && item.labelEn ? item.labelEn : item.label}
                    </h3>
                  </div>
                  <p
                    className={`mt-3 text-xs leading-relaxed ${
                      isLatest ? "text-neutral-200" : "text-neutral-600"
                    }`}
                  >
                    {isEn && item.descriptionEn ? item.descriptionEn : item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── 04 OUR FRAMEWORK & GEDSI APPROACH ───────────────────────────── */}
      <section aria-labelledby="framework-heading" className="border-b border-neutral-100 bg-white py-16 sm:py-24">
        <Container size="default">
          <div className="mb-12 max-w-3xl">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#0D5C4D]">
              {isEn ? "OUR WORKING FRAMEWORK" : "CARA KAMI BEKERJA"}
            </span>
            <h2
              id="framework-heading"
              className="mt-3 font-heading text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl"
            >
              {isEn ? homeContent.framework.titleEn || homeContent.framework.title : homeContent.framework.title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-neutral-600 sm:text-lg">
              “Setiap kolaborasi berawal dari memahami konteks, bukan menawarkan solusi.”
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
            {/* 5 Connected Framework Steps */}
            <div className="space-y-3 lg:col-span-7">
              {homeContent.framework.steps.map((step, sIdx) => {
                const stepColors = [
                  "bg-[#0D5C4D] text-white",
                  "bg-[#116958] text-white",
                  "bg-[#D96B27] text-white",
                  "bg-[#2B8282] text-white",
                  "bg-[#E5A823] text-neutral-900",
                ];
                return (
                  <div
                    key={step.step}
                    className="group flex items-start gap-4 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-4 sm:p-5 transition hover:bg-white hover:border-[#0D5C4D]/40 hover:shadow-md"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold shadow-xs ${stepColors[sIdx % stepColors.length]}`}>
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <p className="font-heading text-base font-bold tracking-wide text-neutral-950 group-hover:text-[#0D5C4D] transition-colors">
                        {step.title}
                      </p>
                      <p className="mt-1 text-xs sm:text-sm leading-relaxed text-neutral-600">
                        {isEn && step.descEn ? step.descEn : step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* GEDSI Spotlight Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-[#D96B27]/40 bg-gradient-to-br from-[#FFFDFB] via-white to-[#FDF4EE] p-7 sm:p-8 shadow-sm">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#D96B27]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#D96B27]">
                  GEDSI IN ACTION
                </div>
                <h3 className="mt-4 font-heading text-xl font-bold text-neutral-950 sm:text-2xl">
                  {isEn ? homeContent.framework.gedsiTitleEn || homeContent.framework.gedsiTitle : homeContent.framework.gedsiTitle}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-700 sm:text-base">
                  {isEn ? homeContent.framework.gedsiTextEn || homeContent.framework.gedsiText : homeContent.framework.gedsiText}
                </p>

                <div className="mt-6 space-y-2 border-t border-[#D96B27]/20 pt-4 text-xs text-neutral-600">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#D96B27]">✓</span>
                    <span>Gender Equality — Pelibatan setara perempuan &amp; laki-laki</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#D96B27]">✓</span>
                    <span>Disability Inclusion — Akses dan hak bagi penyandang disabilitas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#D96B27]">✓</span>
                    <span>Social Inclusion — Memastikan kelompok rentan tidak tertinggal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 05 BIDANG KONTRIBUSI KAMI (6 AREAS) ───────────────────────── */}
      <section aria-labelledby="contributions-heading" className="border-b border-neutral-100 bg-[#FAF9F5] py-16 sm:py-24">
        <Container size="default">
          <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#D96B27]">
                05 — KONTRIBUSI KAMI
              </span>
              <h2
                id="contributions-heading"
                className="mt-3 font-heading text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl"
              >
                {isEn ? "Our 6 Contribution Areas" : "Enam Bidang Kontribusi Kami"}
              </h2>
            </div>
            <Link
              href="/inisiatif"
              className="text-sm font-semibold text-[#0D5C4D] underline underline-offset-4 hover:text-[#116958]"
            >
              {isEn ? "Explore all initiatives →" : "Eksplorasi seluruh inisiatif →"}
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {contributions.map((c) => (
              <Link
                key={c.no}
                href={c.href}
                className="group flex flex-col justify-between rounded-2xl border border-neutral-200/80 bg-white p-7 shadow-xs transition-all hover:border-[#0D5C4D] hover:shadow-xl hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-[#0D5C4D]/8 px-2.5 py-0.5 font-mono text-xs font-bold text-[#0D5C4D]">
                      {c.no}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 group-hover:text-[#0D5C4D] transition-colors">
                      {c.tag}
                    </span>
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-bold leading-snug text-neutral-950 group-hover:text-[#0D5C4D] transition-colors">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                    {c.desc}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-[#0D5C4D] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Lihat Inisiatif Terkait</span>
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 06 INISIATIF & PENGALAMAN TERPILIH (REAL FROM DATABASE) ────── */}
      <section aria-labelledby="experiences-heading" className="border-b border-neutral-100 bg-white py-16 sm:py-24">
        <Container size="default">
          <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#0D5C4D]">
                {isEn ? "SELECTED EXPERIENCES" : "PENGALAMAN & INISIATIF TERPILIH"}
              </span>
              <h2
                id="experiences-heading"
                className="mt-3 font-heading text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl"
              >
                {isEn
                  ? "Experiences that shape the way we work."
                  : "Pengalaman yang membentuk cara kami bekerja."}
              </h2>
            </div>
            <Link
              href="/inisiatif"
              className="text-sm font-semibold text-[#0D5C4D] underline underline-offset-4 hover:text-[#116958]"
            >
              {isEn ? "View all initiatives →" : "Lihat semua inisiatif →"}
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {experiences.map((exp, idx) => {
              const imageSrc =
                exp.coverMediaUrl ||
                fallbackExperienceImages[idx % fallbackExperienceImages.length];
              const title = isEn && exp.titleEn ? exp.titleEn : exp.titleId || exp.slug;

              return (
                <Link
                  key={exp.id}
                  href={`/inisiatif/${exp.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-[#0D5C4D]/60 hover:shadow-xl"
                >
                  {/* Photo Thumbnail */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
                    <img
                      src={imageSrc}
                      alt={exp.coverMediaAlt || title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-[0.92]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent" />
                    {exp.year && (
                      <span className="absolute bottom-2.5 right-2.5 rounded bg-black/60 px-2 py-0.5 font-mono text-[10px] font-semibold text-white backdrop-blur-xs">
                        {exp.year}
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="rounded bg-[#0D5C4D]/8 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#0D5C4D]">
                          {exp.type === "INITIATIVE" ? "Kampanye" : "Proyek"}
                        </span>
                        {exp.category && (
                          <span className="text-[10px] font-mono text-neutral-400">
                            · {exp.category}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-2.5 font-heading text-sm font-bold leading-snug text-neutral-950 group-hover:text-[#0D5C4D] transition-colors line-clamp-2">
                        {title}
                      </h3>
                      {exp.clientName && (
                        <p className="mt-1 text-xs text-neutral-500 line-clamp-1">
                          Mitra: {exp.clientName}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-[#0D5C4D]">
                      <span>Detail Inisiatif</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── 07 PENGETAHUAN & PUBLIKASI TERKINI (REAL FROM DATABASE) ───── */}
      {latestKnowledge && latestKnowledge.length > 0 && (
        <section aria-labelledby="knowledge-heading" className="border-b border-neutral-100 bg-[#FAF9F6] py-16 sm:py-24">
          <Container size="default">
            <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#0D5C4D]">
                  {isEn ? "KNOWLEDGE HUB" : "HUB PENGETAHUAN TERKINI"}
                </span>
                <h2
                  id="knowledge-heading"
                  className="mt-3 font-heading text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl"
                >
                  {isEn ? "Recent Research & Field Stories" : "Riset, Publikasi & Cerita Lapangan"}
                </h2>
              </div>
              <Link
                href="/pengetahuan"
                className="text-sm font-semibold text-[#0D5C4D] underline underline-offset-4 hover:text-[#116958]"
              >
                {isEn ? "View all publications →" : "Lihat semua publikasi →"}
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestKnowledge.map((item, idx) => {
                const trId = item.translations.find((t) => t.language === "ID");
                const trEn = item.translations.find((t) => t.language === "EN");
                const title = (isEn && trEn?.title) ? trEn.title : trId?.title || item.slug;
                const excerpt = (isEn && trEn?.excerpt) ? trEn.excerpt : trId?.excerpt || "";
                const cover = item.coverMedia?.url || "/images/pengetahuan/cerita-lapangan.jpg";

                return (
                  <Link
                    key={item.id}
                    href={`/pengetahuan/${item.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-[#0D5C4D] hover:shadow-xl"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
                      <img
                        src={cover}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-[0.92]"
                      />
                      <span className="absolute top-3 left-3 rounded-md bg-neutral-900/80 px-2.5 py-0.5 font-mono text-[10px] font-bold text-white uppercase backdrop-blur-xs">
                        {item.type}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <h3 className="font-heading text-base font-bold leading-snug text-neutral-950 group-hover:text-[#0D5C4D] transition-colors line-clamp-2">
                          {title}
                        </h3>
                        {excerpt && (
                          <p className="mt-2 text-xs leading-relaxed text-neutral-600 line-clamp-3">
                            {excerpt}
                          </p>
                        )}
                      </div>

                      <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400 font-mono">
                        <span suppressHydrationWarning>
                          {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString(isEn ? "en-US" : "id-ID") : "ANTRABUMI"}
                        </span>
                        <span className="font-semibold text-[#0D5C4D] group-hover:translate-x-1 transition-transform">
                          Baca Publikasi →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* ── 08 COLLECTIVE EXPERTISE ───────────────────────────────────── */}
      <section aria-labelledby="expertise-heading" className="bg-[#0B1E1A] py-16 sm:py-24 text-white">
        <Container size="default">
          <div className="mb-10 max-w-2xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#E5A823]">
              {isEn ? "OUR COLLECTIVE EXPERTISE" : "KEAHLIAN KOLEKTIF KAMI"}
            </p>
            <h2
              id="expertise-heading"
              className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl text-white"
            >
              {isEn
                ? "Diverse Perspectives, Shared Purpose"
                : "Tidak ada satu perspektif yang cukup. Kami mempertemukan pengalaman berbeda untuk melihat persoalan secara utuh."}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2.5 sm:gap-3">
            {expertise.map((e) => (
              <span
                key={e}
                className="rounded-full border border-white/20 bg-white/5 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-neutral-200 transition hover:border-[#E5A823] hover:text-white hover:bg-white/10"
              >
                {e}
              </span>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/tentang#tim"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#E5A823] underline underline-offset-4 hover:text-amber-300"
            >
              {isEn ? "Meet the team & credentialed specialists →" : "Kenali profil pakar di balik ANTRABUMI →"}
            </Link>
          </div>
        </Container>
      </section>

      {/* ── 09 PARTNERS / JEJARING KOLABORASI ──────────────────────────── */}
      {partners && partners.length > 0 && (
        <section aria-labelledby="partners-heading" className="border-t border-neutral-100 bg-white py-16 sm:py-20">
          <Container size="default">
            <div className="mb-10 text-center">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#0D5C4D]">
                {isEn ? "Collaboration & Network" : "Mitra & Jejaring Kolaborasi"}
              </p>
              <h2
                id="partners-heading"
                className="mt-2 font-heading text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl"
              >
                {isEn ? "Growing Together Across Sectors" : "Bekerja Bersama Lintas Sektor"}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 items-center">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="flex h-20 items-center justify-center rounded-xl border border-neutral-200/70 bg-neutral-50/50 p-4 shadow-2xs transition-all hover:border-[#0D5C4D]/30 hover:bg-white hover:shadow-xs"
                  title={partner.name}
                >
                  {partner.logoUrl ? (
                    <img
                      src={partner.logoUrl}
                      alt={partner.logoAlt || partner.name}
                      className="max-h-12 max-w-full object-contain filter grayscale hover:grayscale-0 transition-all"
                    />
                  ) : (
                    <span className="font-heading text-xs font-bold text-neutral-600 text-center line-clamp-2">
                      {partner.name}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/kolaborasi"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D5C4D] hover:underline"
              >
                <span>{isEn ? "Learn more about our collaborative ecosystem →" : "Pelajari ekosistem kolaborasi kami →"}</span>
              </Link>
            </div>
          </Container>
        </section>
      )}

      {/* ── 10 AJAKAN KOLABORASI (EDITORIAL CALL TO ACTION) ────────────── */}
      <section aria-labelledby="cta-heading" className="border-t border-neutral-100 bg-[#FAF9F5] py-20 sm:py-28">
        <Container size="reading">
          <div className="space-y-6 text-center">
            <span className="inline-block rounded-full bg-[#0D5C4D]/10 px-4 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#0D5C4D]">
              {isEn ? homeContent.cta.badgeEn || "START COLLABORATING" : homeContent.cta.badge || "MARI BERKOLABORASI"}
            </span>
            <h2
              id="cta-heading"
              className="font-heading text-3xl font-bold leading-snug tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl"
            >
              {isEn ? homeContent.cta.titleEn || homeContent.cta.title : homeContent.cta.title}
            </h2>
            <p className="mx-auto max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">
              {isEn ? homeContent.cta.descriptionEn || homeContent.cta.description : homeContent.cta.description}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
              <Link
                href="/kolaborasi#formulir"
                className="inline-flex h-12 items-center rounded-xl bg-[#0D5C4D] px-8 text-sm font-semibold text-white shadow-md shadow-[#0D5C4D]/25 transition hover:bg-[#116958] hover:shadow-lg hover:-translate-y-0.5"
              >
                {isEn ? "Start Collaboration →" : "Mulai Kolaborasi →"}
              </Link>
              <Link
                href="/kolaborasi#kontak"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-neutral-300 bg-white px-7 text-sm font-semibold text-neutral-800 transition hover:border-[#0D5C4D] hover:text-[#0D5C4D] hover:bg-[#0D5C4D]/5 shadow-xs"
              >
                {isEn ? "Contact Information" : "Informasi Kontak"}
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
