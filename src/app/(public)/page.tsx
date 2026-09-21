import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { getLanguage } from "@/lib/i18n/language";
import { getHeroSliderDataAction } from "@/features/hero/actions";
import { getHomeContentAction } from "@/features/home-content/actions";
import { HeroSlider } from "@/components/sections/HeroSlider/HeroSlider";

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
  },
  {
    no: "02",
    title: "Program & Strategy",
    desc: "Menerjemahkan kebutuhan dan temuan lapangan menjadi desain, pengembangan, dan penguatan program.",
  },
  {
    no: "03",
    title: "Partnership & Collaboration",
    desc: "Mempertemukan berbagai pihak, keahlian, dan kepentingan untuk membangun kerja bersama lintas sektor.",
  },
  {
    no: "04",
    title: "Media, Storytelling & Campaign",
    desc: "Membawa pengetahuan, pengalaman, dan suara dari lapangan ke ruang publik melalui cerita, media, dan campaign.",
  },
  {
    no: "05",
    title: "Community Development",
    desc: "Memperkuat kapasitas, partisipasi, kelembagaan, dan inisiatif masyarakat melalui pendekatan GEDSI-responsive, kontekstual, dan kolaboratif.",
  },
  {
    no: "06",
    title: "Research, Assessment & Knowledge",
    desc: "Menghasilkan dan menerjemahkan data, pengalaman, dan pengetahuan untuk memahami persoalan, mendukung keputusan, dan membangun pembelajaran.",
  },
];

const contributionsEN = [
  {
    no: "01",
    title: "Conservation, Climate & Sustainability",
    desc: "Connecting biodiversity and ecosystem protection with climate resilience, resource management, and sustainable development.",
  },
  {
    no: "02",
    title: "Program & Strategy",
    desc: "Translating field needs and findings into robust program design, development, and contextual scaling.",
  },
  {
    no: "03",
    title: "Partnership & Collaboration",
    desc: "Bringing together diverse stakeholders, expertise, and priorities to forge multi-sector collaborative partnerships.",
  },
  {
    no: "04",
    title: "Media, Storytelling & Campaign",
    desc: "Amplifying grassroots knowledge, field experiences, and public voices through compelling stories, media, and campaigns.",
  },
  {
    no: "05",
    title: "Community Development",
    desc: "Strengthening community capacity, participation, governance, and initiatives through GEDSI-responsive and participatory approaches.",
  },
  {
    no: "06",
    title: "Research, Assessment & Knowledge",
    desc: "Generating and translating field data, experiences, and evidence-based knowledge to inform decision-making and continuous learning.",
  },
];

const expertise = [
  "Community Development",
  "GEDSI",
  "Research & Assessment",
  "Communication",
  "Conservation",
  "Policy",
  "Climate & Sustainability",
  "Partnership",
];

// ─── Homepage ────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const [lang, heroData, homeContent] = await Promise.all([
    getLanguage(),
    getHeroSliderDataAction(),
    getHomeContentAction(),
  ]);

  const contributions = lang === "EN" ? contributionsEN : contributionsID;

  // Prepare pillars from dynamic content
  const dynamicPillars = homeContent.pillars.map((p) => ({
    id: p.id,
    key: p.key,
    label: lang === "EN" && p.labelEn ? p.labelEn : p.label,
    description: lang === "EN" && p.descriptionEn ? p.descriptionEn : p.description,
  }));

  // Helper for bilingual content
  const isEn = lang === "EN";

  return (
    <div className="bg-white">
      {/* ── HERO SLIDER (Configurable via /admin/hero) ────────────────── */}
      <HeroSlider
        slides={heroData.slides}
        config={heroData.config}
        lang={lang}
        pillars={dynamicPillars}
      />

      {/* ── 01 MENGAPA KAMI HADIR (Page 02 of Profile 2026) ───────────── */}
      <section aria-labelledby="why-heading" className="border-b border-neutral-100 bg-white py-14 sm:py-20 lg:py-24">
        <Container size="default">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
            {/* Left text column */}
            <div className="space-y-6 lg:col-span-7">
              <div className="inline-flex items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#D96B27]">
                  {isEn ? homeContent.whyUs.badgeEn || homeContent.whyUs.badge : homeContent.whyUs.badge}
                </span>
              </div>

              <h2
                id="why-heading"
                className="font-heading text-3xl font-bold leading-snug tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl"
              >
                {isEn ? homeContent.whyUs.titleEn || homeContent.whyUs.title : homeContent.whyUs.title}
              </h2>

              <div className="space-y-4 text-base leading-relaxed text-neutral-600 whitespace-pre-line">
                {isEn ? homeContent.whyUs.leadTextEn || homeContent.whyUs.leadText : homeContent.whyUs.leadText}
              </div>

              {/* Bridge Solution Box */}
              <div className="rounded-2xl border-l-4 border-[#0D5C4D] bg-neutral-50 p-6 sm:p-8">
                <h3 className="font-heading text-lg font-bold text-neutral-950 sm:text-xl">
                  {isEn ? homeContent.whyUs.bridgeTitleEn || homeContent.whyUs.bridgeTitle : homeContent.whyUs.bridgeTitle}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">
                  {isEn ? homeContent.whyUs.bridgeTextEn || homeContent.whyUs.bridgeText : homeContent.whyUs.bridgeText}
                </p>
              </div>
            </div>

            {/* Right graphic column (Megaphone & Community Collaboration) */}
            <div className="flex justify-center lg:col-span-5">
              <div className="relative w-full max-w-sm rounded-3xl border border-neutral-100 bg-neutral-50/70 p-6 shadow-sm sm:p-8">
                <img
                  src={homeContent.whyUs.imageUrl || "/images/home/bridge-diagram.svg"}
                  alt="ANTRABUMI Collaboration Bridge"
                  className="mx-auto h-auto w-full max-w-[280px] object-contain"
                />
                <p className="mt-4 text-center font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                  {isEn ? "Grassroots Voice & Evidence-Based Action" : "Suara Komunitas & Aksi Berbasis Bukti"}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 02 TENTANG ANTRABUMI & 3 PILAR (Page 03 of Profile 2026) ───── */}
      <section aria-labelledby="about-heading" className="border-b border-neutral-100 bg-neutral-50/50 py-14 sm:py-20 lg:py-24">
        <Container size="default">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
            {/* Circular Diagram (Left on desktop) */}
            <div className="flex justify-center lg:order-1 lg:col-span-5">
              <div className="relative w-full max-w-md rounded-3xl border border-neutral-200/70 bg-white p-6 shadow-sm sm:p-8">
                <img
                  src={homeContent.about.diagramUrl || "/images/home/pillars-diagram.svg"}
                  alt="Knowledge Nature Communities Ecosystem"
                  className="mx-auto h-auto w-full max-w-[340px] object-contain"
                />
                <p className="mt-4 text-center font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                  {isEn ? "The ANTRABUMI Intersecting Framework" : "Persimpangan Ekosistem ANTRABUMI"}
                </p>
              </div>
            </div>

            {/* Text & Pillars (Right on desktop) */}
            <div className="space-y-6 lg:order-2 lg:col-span-7">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0D5C4D]">
                {isEn ? homeContent.about.badgeEn || homeContent.about.badge : homeContent.about.badge}
              </span>

              <h2
                id="about-heading"
                className="font-heading text-3xl font-bold leading-snug tracking-tight text-neutral-950 sm:text-4xl"
              >
                {isEn ? homeContent.about.titleEn || homeContent.about.title : homeContent.about.title}
              </h2>

              <p className="text-base leading-relaxed text-neutral-600 sm:text-lg">
                {isEn ? homeContent.about.descriptionEn || homeContent.about.description : homeContent.about.description}
              </p>

              <p className="text-sm leading-relaxed text-neutral-500">
                {isEn ? homeContent.about.secondaryTextEn || homeContent.about.secondaryText : homeContent.about.secondaryText}
              </p>

              {/* Three Pillar Cards */}
              <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
                {dynamicPillars.map((p, idx) => {
                  const borderTopColor =
                    idx === 0
                      ? "border-t-[#E5A823]"
                      : idx === 1
                      ? "border-t-[#0D5C4D]"
                      : "border-t-[#D96B27]";
                  const badgeColor =
                    idx === 0
                      ? "text-[#E5A823] bg-[#E5A823]/10"
                      : idx === 1
                      ? "text-[#0D5C4D] bg-[#0D5C4D]/10"
                      : "text-[#D96B27] bg-[#D96B27]/10";
                  return (
                    <div
                      key={p.id}
                      className={`rounded-xl border border-neutral-200/80 border-t-4 ${borderTopColor} bg-white p-5 shadow-xs transition hover:shadow-md hover:-translate-y-0.5`}
                    >
                      <span className={`inline-block rounded-md px-2 py-0.5 font-mono text-xs font-bold ${badgeColor}`}>
                        {p.id}
                      </span>
                      <h3 className="mt-2.5 font-heading text-base font-bold text-neutral-950">
                        {p.key}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-neutral-600">
                        {p.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 03 BAGAIMANA KAMI BERTUMBUH / TIMELINE (Page 04) ──────────── */}
      <section aria-labelledby="journey-heading" className="border-b border-neutral-100 bg-white py-14 sm:py-20 lg:py-24">
        <Container size="default">
          <div className="mb-12 max-w-2xl">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#D96B27]">
              {isEn ? homeContent.growth.badgeEn || homeContent.growth.badge : homeContent.growth.badge}
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

          {/* Timeline Milestones Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {homeContent.growth.timeline.map((item, idx) => {
              const isLatest = idx === homeContent.growth.timeline.length - 1;
              return (
                <div
                  key={item.year + idx}
                  className={`flex flex-col justify-between rounded-2xl border p-6 transition hover:-translate-y-1 ${
                    isLatest
                      ? "border-[#0D5C4D] bg-gradient-to-b from-[#0D5C4D] to-[#0A483C] text-white shadow-md shadow-[#0D5C4D]/20"
                      : "border-neutral-200/80 bg-white hover:border-[#0D5C4D]/40 hover:shadow-sm"
                  }`}
                >
                  <div>
                    <span
                      className={`font-mono text-2xl font-bold tracking-tight ${
                        isLatest ? "text-[#E5A823]" : "text-[#0D5C4D]"
                      }`}
                    >
                      {item.year}
                    </span>
                    <h3
                      className={`mt-2 font-heading text-sm font-bold ${
                        isLatest ? "text-white" : "text-neutral-900"
                      }`}
                    >
                      {isEn && item.labelEn ? item.labelEn : item.label}
                    </h3>
                  </div>
                  <p
                    className={`mt-3 text-xs leading-relaxed ${
                      isLatest ? "text-neutral-200" : "text-neutral-500"
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

      {/* ── 04 CARA KAMI BEKERJA & GEDSI (Page 05 of Profile 2026) ─────── */}
      <section aria-labelledby="framework-heading" className="border-b border-neutral-100 bg-neutral-50/60 py-14 sm:py-20 lg:py-24">
        <Container size="default">
          <div className="mb-14 max-w-2xl">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0D5C4D]">
              {isEn ? homeContent.framework.badgeEn || homeContent.framework.badge : homeContent.framework.badge}
            </span>
            <h2
              id="framework-heading"
              className="mt-3 font-heading text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl"
            >
              {isEn ? homeContent.framework.titleEn || homeContent.framework.title : homeContent.framework.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-base">
              {isEn ? homeContent.framework.leadTextEn || homeContent.framework.leadText : homeContent.framework.leadText}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
            {/* 5 Framework Steps (01 LISTEN - 05 LEARN) */}
            <div className="space-y-4 lg:col-span-7">
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-400">
                OUR FRAMEWORK
              </h3>
              <div className="space-y-3">
                {homeContent.framework.steps.map((step, sIdx) => {
                  const stepColors = [
                    "bg-[#0D5C4D]",
                    "bg-[#116958]",
                    "bg-[#D96B27]",
                    "bg-[#2B8282]",
                    "bg-[#E5A823]",
                  ];
                  return (
                    <div
                      key={step.step}
                      className="group flex items-start gap-4 rounded-xl border border-neutral-200/80 bg-white p-4 shadow-xs transition hover:border-[#0D5C4D]/40 hover:shadow-sm"
                    >
                      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${stepColors[sIdx % stepColors.length]} text-white shadow-xs`}>
                        <span className="font-mono text-xs font-bold">{step.step}</span>
                      </div>
                      <div>
                        <p className="font-heading text-sm font-bold tracking-wide text-neutral-950 group-hover:text-[#0D5C4D] transition-colors">
                          {step.title}
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-neutral-600">
                          {isEn && step.descEn ? step.descEn : step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* GEDSI Approach Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border-2 border-[#D96B27]/30 bg-gradient-to-br from-white to-[#FDF8F5] p-7 shadow-sm">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#D96B27]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#D96B27]">
                  PENDAMPINGAN &amp; INKLUSI
                </div>
                <h3 className="mt-4 font-heading text-xl font-bold text-neutral-950">
                  {isEn ? homeContent.framework.gedsiTitleEn || homeContent.framework.gedsiTitle : homeContent.framework.gedsiTitle}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                  {isEn ? homeContent.framework.gedsiTextEn || homeContent.framework.gedsiText : homeContent.framework.gedsiText}
                </p>
                <div className="mt-6 border-t border-neutral-200/60 pt-4">
                  <p className="font-mono text-xs font-medium text-neutral-400">
                    GEDSI: Gender Equality, Disability &amp; Social Inclusion
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 05 KONTRIBUSI KAMI (Page 06 of Profile 2026) ───────────────── */}
      <section aria-labelledby="contributions-heading" className="border-b border-neutral-100 bg-white py-14 sm:py-20 lg:py-24">
        <Container size="default">
          <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#D96B27]">
                05 — KONTRIBUSI KAMI
              </span>
              <h2
                id="contributions-heading"
                className="mt-3 font-heading text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl"
              >
                {isEn ? "Our Contribution Areas" : "Bidang Kontribusi Kami"}
              </h2>
            </div>
            <Link
              href="/inisiatif"
              className="text-sm font-semibold text-[#0D5C4D] underline underline-offset-4 hover:text-[#116958]"
            >
              {isEn ? "Explore Initiatives →" : "Lihat Inisiatif →"}
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {contributions.map((c) => (
              <div
                key={c.no}
                className="group flex flex-col justify-between rounded-2xl border border-neutral-200/80 bg-neutral-50/60 p-7 transition-all hover:border-[#0D5C4D]/40 hover:bg-white hover:shadow-md hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#0D5C4D] bg-[#0D5C4D]/8 px-2.5 py-0.5 rounded-md">
                      {c.no}
                    </span>
                    <span className="text-[#0D5C4D] opacity-0 group-hover:opacity-100 transition-opacity text-sm font-semibold">
                      →
                    </span>
                  </div>
                  <h3 className="mt-3 font-heading text-lg font-bold leading-snug text-neutral-950 group-hover:text-[#0D5C4D] transition-colors">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                    {c.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 06 PENGALAMAN PILIHAN ──────────────────────────────────────── */}
      <section aria-labelledby="experiences-heading" className="border-b border-neutral-100 bg-neutral-50/50 py-14 sm:py-20 lg:py-24">
        <Container size="default">
          <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0D5C4D]">
                {isEn ? "06 — SELECTED EXPERIENCES" : "06 — PENGALAMAN PILIHAN"}
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
              href="/experience"
              className="flex-shrink-0 text-sm font-semibold text-[#0D5C4D] underline underline-offset-4 hover:text-[#116958]"
            >
              {isEn ? "See all experiences →" : "Lihat semua pengalaman →"}
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                imageAlt: "Lanskap pesisir",
                imagePlaceholder: "🌊",
                category: isEn ? "Conservation & Landscape" : "Konservasi & Lanskap",
                title: isEn ? "Coastal Landscape Management Planning" : "Perencanaan pengelolaan ekowisata desa",
                description: isEn
                  ? "Experience connecting surveys, mapping, public consultations, FGDs, workshops, and strengthening management plans."
                  : "Pengalaman menghubungkan survei, pemetaan, konsultasi publik, FGD, workshop, dan penguatan rencana.",
                tagLabel: "Lanskap pesisir",
                accentColor: "#0D5C4D",
              },
              {
                imageAlt: "Perikanan pesisir",
                imagePlaceholder: "🐟",
                category: isEn ? "Marine & Coastal" : "Kelautan & Pesisir",
                title: isEn ? "Community-based Research and Assessment" : "Riset dan assessment berbasis masyarakat",
                description: isEn
                  ? "Experience working with data, local knowledge, and stakeholder perspectives."
                  : "Pengalaman bekerja dengan data, pengetahuan lokal, dan perspektif pemangku kepentingan.",
                tagLabel: "Perikanan pesisir",
                accentColor: "#2B8282",
              },
              {
                imageAlt: "Pesisir dan komunitas",
                imagePlaceholder: "🏘️",
                category: "Community Development",
                title: isEn ? "Solutions that grow with context" : "Solusi yang tumbuh bersama konteks",
                description: isEn
                  ? "Connecting communities, environment, and opportunity through collaborative processes."
                  : "Menghubungkan masyarakat, lingkungan, dan peluang melalui proses kolaboratif.",
                tagLabel: "Pesisir dan komunitas",
                accentColor: "#D96B27",
              },
            ].map((exp, idx) => (
              <div
                key={idx}
                className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-xs transition-all hover:-translate-y-1 hover:border-neutral-300 hover:shadow-md"
              >
                {/* Visual */}
                <div
                  className="flex h-44 items-center justify-center text-5xl sm:h-48"
                  style={{ background: `linear-gradient(135deg, ${exp.accentColor}18, ${exp.accentColor}08)` }}
                  aria-hidden="true"
                >
                  <span>{exp.imagePlaceholder}</span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="inline-block rounded-md px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide"
                      style={{ color: exp.accentColor, background: `${exp.accentColor}12` }}
                    >
                      {exp.category}
                    </span>
                  </div>
                  <h3 className="font-heading text-base font-bold leading-snug text-neutral-950 group-hover:text-[#0D5C4D] transition-colors">
                    {exp.title}
                  </h3>
                  <p className="mt-auto text-xs leading-relaxed text-neutral-500">
                    {exp.description}
                  </p>
                  <div className="border-t border-neutral-100 pt-3 mt-1">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                      {exp.tagLabel}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── COLLECTIVE EXPERTISE ───────────────────────────────────────── */}
      <section aria-labelledby="expertise-heading" className="bg-[#0B1E1A] py-14 sm:py-20 lg:py-24 text-white">
        <Container size="default">
          <div className="mb-12">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#E5A823]">
              {isEn ? "Our Collective Expertise" : "Keahlian Kolektif Kami"}
            </p>
            <h2
              id="expertise-heading"
              className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl text-white"
            >
              {isEn
                ? "Diverse Perspectives, Shared Purpose"
                : "Tidak ada satu perspektif yang cukup. Kami mempertemukan pengalaman yang berbeda untuk melihat persoalan secara utuh."}
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            {expertise.map((e) => (
              <span
                key={e}
                className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-neutral-200 transition hover:border-[#E5A823] hover:text-white hover:bg-white/10"
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
              {isEn ? "Meet the ANTRABUMI Team →" : "Kenali Tim di Balik ANTRABUMI →"}
            </Link>
          </div>
        </Container>
      </section>

      {/* ── AJAKAN KOLABORASI (CTA) ────────────────────────────────────── */}
      <section aria-labelledby="cta-heading" className="border-t border-neutral-100 bg-gradient-to-b from-white to-[#F5FAF8] py-14 sm:py-20 lg:py-24">
        <Container size="reading">
          <div className="space-y-6 text-center">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#0D5C4D]">
              {isEn ? homeContent.cta.badgeEn || homeContent.cta.badge : homeContent.cta.badge}
            </p>
            <h2
              id="cta-heading"
              className="font-heading text-3xl font-bold leading-snug tracking-tight text-neutral-950 sm:text-4xl"
            >
              {isEn ? homeContent.cta.titleEn || homeContent.cta.title : homeContent.cta.title}
            </h2>
            <p className="mx-auto max-w-lg text-base leading-relaxed text-neutral-600">
              {isEn ? homeContent.cta.descriptionEn || homeContent.cta.description : homeContent.cta.description}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href={homeContent.cta.primaryButtonLink}
                className="inline-flex h-12 items-center rounded-xl bg-gradient-to-r from-[#0D5C4D] via-[#116958] to-[#147A66] px-8 text-sm font-semibold text-white shadow-md shadow-[#0D5C4D]/25 transition-all hover:shadow-lg hover:shadow-[#0D5C4D]/35 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0D5C4D]"
              >
                {isEn ? homeContent.cta.primaryButtonTextEn || homeContent.cta.primaryButtonText : homeContent.cta.primaryButtonText}
              </Link>
              <Link
                href={homeContent.cta.secondaryButtonLink}
                className="inline-flex h-12 items-center gap-2 rounded-xl border-2 border-[#0D5C4D]/40 bg-white px-7 text-sm font-semibold text-[#0D5C4D] transition-all hover:border-[#0D5C4D] hover:bg-[#0D5C4D]/5 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0D5C4D] shadow-xs"
              >
                {isEn ? homeContent.cta.secondaryButtonTextEn || homeContent.cta.secondaryButtonText : homeContent.cta.secondaryButtonText}
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
