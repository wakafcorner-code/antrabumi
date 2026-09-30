"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

import type { PublicPersonItem } from "@/server/repositories/person.repository";

const defaultPeople: PublicPersonItem[] = [
  { id: "1", slug: "sendi-kenia-savitri", order: 1, name: "Sendi Kenia Savitri, M.Si.", role: null, degree: "M.Si.", biography: null, imageUrl: null, imageAlt: null },
  { id: "2", slug: "ade-afrilian-saputra", order: 2, name: "Ade Afrilian Saputra, M.M.Sus.", role: null, degree: "M.M.Sus.", biography: null, imageUrl: null, imageAlt: null },
  { id: "3", slug: "anna-agustina", order: 3, name: "Anna Agustina, Ph.D.", role: null, degree: "Ph.D.", biography: null, imageUrl: null, imageAlt: null },
  { id: "4", slug: "yando-zakaria", order: 4, name: "Yando Zakaria", role: null, degree: null, biography: null, imageUrl: null, imageAlt: null },
  { id: "5", slug: "sekar-mira-c-herandarudewi", order: 5, name: "Sekar Mira C. Herandarudewi, M.Si.", role: null, degree: "M.Si.", biography: null, imageUrl: null, imageAlt: null },
  { id: "6", slug: "arya-kusumo-harwinanto", order: 6, name: "Arya Kusumo Harwinanto, S.I.Kom.", role: null, degree: "S.I.Kom.", biography: null, imageUrl: null, imageAlt: null },
  { id: "7", slug: "shaniya-utamidita", order: 7, name: "Shaniya Utamidita, M.S.", role: null, degree: "M.S.", biography: null, imageUrl: null, imageAlt: null },
  { id: "8", slug: "suluh-gembyeng-ciptadi", order: 8, name: "Suluh Gembyeng Ciptadi, M.Si.", role: null, degree: "M.Si.", biography: null, imageUrl: null, imageAlt: null },
];

const timelineID = [
  { year: "2021", label: "Awal Perjalanan", desc: "Lahirnya gagasan untuk menghubungkan pengetahuan, alam, dan komunitas melalui pendekatan kolaboratif." },
  { year: "2022", label: "Membentuk Identitas", desc: "Membangun identitas organisasi, menentukan arah, dan memperkuat fondasi kerja." },
  { year: "2023", label: "Belajar dari Lapangan", desc: "Menjalankan proyek-proyek awal, belajar langsung dari realitas di lapangan." },
  { year: "2024", label: "Memperkuat Pendekatan", desc: "Menyempurnakan metodologi berdasarkan pembelajaran nyata dari praktik." },
  { year: "2025", label: "Memperluas Kolaborasi", desc: "Menjalin kemitraan lebih luas dengan berbagai sektor dan komunitas." },
  { year: "2026", label: "A New Chapter", desc: "Babak baru dalam perjalanan ANTRABUMI — memperdalam dampak, memperluas jangkauan." },
];

const timelineEN = [
  { year: "2021", label: "The Beginning", desc: "The birth of an idea to connect knowledge, nature, and communities through collaborative approaches." },
  { year: "2022", label: "Forming an Identity", desc: "Building organizational identity, establishing direction, and strengthening the foundation." },
  { year: "2023", label: "Learning from the Field", desc: "Executing initial projects and learning directly from real-world conditions." },
  { year: "2024", label: "Strengthening Our Approach", desc: "Refining methodology based on genuine lessons from practice." },
  { year: "2025", label: "Expanding Collaboration", desc: "Forging broader partnerships across sectors and communities." },
  { year: "2026", label: "A New Chapter", desc: "A new chapter in ANTRABUMI's journey — deepening impact, expanding reach." },
];

const frameworkSteps = [
  {
    num: "01",
    step: "Listen",
    stepID: "Mendengarkan",
    descEN: "Understanding context, genuine needs, and voices of all stakeholders involved.",
    descID: "Memahami konteks, kebutuhan nyata, dan suara dari semua pihak yang terlibat.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
      </svg>
    ),
  },
  {
    num: "02",
    step: "Connect",
    stepID: "Menghubungkan",
    descEN: "Bringing together relevant perspectives, knowledge, capacities, and networks.",
    descID: "Mempertemukan perspektif, pengetahuan, kapasitas, dan jejaring yang relevan.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.07-9.07l4.5-4.5a4.5 4.5 0 016.364 6.364l-1.757 1.757" />
      </svg>
    ),
  },
  {
    num: "03",
    step: "Co-create",
    stepID: "Merancang Bersama",
    descEN: "Designing approaches and solutions collaboratively, not from a single side.",
    descID: "Merancang pendekatan dan solusi bersama, bukan dari satu sisi saja.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
  {
    num: "04",
    step: "Act",
    stepID: "Bertindak",
    descEN: "Translating agreements into actionable, measurable, and tangible steps.",
    descID: "Menerjemahkan kesepakatan menjadi langkah nyata yang terukur dan dapat dipelajari.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    num: "05",
    step: "Learn",
    stepID: "Belajar",
    descEN: "Utilizing experience to iteratively refine approaches and cultivate lasting knowledge.",
    descID: "Menggunakan pengalaman untuk memperbaiki pendekatan dan membangun pengetahuan.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
];

const expertiseAreas = [
  { label: "Community Development", color: "#0D5C4D" },
  { label: "GEDSI", color: "#D96B27" },
  { label: "Research & Assessment", color: "#2B8282" },
  { label: "Communication", color: "#E5A823" },
  { label: "Conservation", color: "#116958" },
  { label: "Policy", color: "#0D5C4D" },
  { label: "Climate & Sustainability", color: "#147A66" },
  { label: "Partnership", color: "#D96B27" },
];

interface TentangClientProps {
  lang: string;
  people?: PublicPersonItem[];
}

export function TentangClient({ lang, people }: TentangClientProps) {
  const isEn = lang === "EN";
  const timeline = isEn ? timelineEN : timelineID;
  const teamList = people && people.length > 0 ? people : defaultPeople;

  return (
    <div>
      {/* ─── 1. HERO SECTION ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-neutral-200/70 bg-gradient-to-b from-[#FBF9F5] via-white to-white py-24 sm:py-32">
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#0D5C4D_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute -top-32 right-10 h-96 w-96 rounded-full bg-[#0D5C4D]/5 blur-3xl pointer-events-none" />
        <Container size="default">
          <div className="relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            <div className="space-y-6 lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0D5C4D]/20 bg-white/80 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-[#0D5C4D] shadow-xs">
                <span className="h-2 w-2 rounded-full bg-[#0D5C4D] animate-pulse" />
                {isEn ? "About ANTRABUMI" : "Tentang ANTRABUMI"}
              </div>
              <h1 className="font-heading text-4xl font-extrabold leading-[1.12] tracking-tight text-neutral-950 sm:text-5xl lg:text-6xl">
                {isEn ? (
                  <>
                    Connecting <span className="text-[#0D5C4D]">Knowledge</span>, Nature, &amp; Communities.
                  </>
                ) : (
                  <>
                    Menghubungkan <span className="text-[#0D5C4D]">Pengetahuan</span>, Alam, &amp; Komunitas.
                  </>
                )}
              </h1>
              <p className="text-lg leading-relaxed text-neutral-600 sm:text-xl font-normal max-w-2xl">
                {isEn
                  ? "ANTRABUMI is an independent organization that brings together field experience, research, local knowledge, and diverse perspectives — to understand issues more fully and develop contextual approaches."
                  : "ANTRABUMI adalah organisasi independen yang menghimpun pengalaman lapangan, riset, pengetahuan lokal, dan berbagai perspektif — untuk memahami isu secara lebih utuh dan mengembangkan pendekatan yang kontekstual."}
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-500">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0D5C4D]" />
                  {isEn ? "Est. 2021" : "Didirikan 2021"}
                </span>
                <span>•</span>
                <span>Belitung &amp; Indonesia</span>
                <span>•</span>
                <span className="text-[#0D5C4D] font-semibold">{isEn ? "Independent & Collaborative" : "Independen & Kolaboratif"}</span>
              </div>
            </div>

            {/* Editorial Quote Card on the Right */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl border border-neutral-200/90 bg-white p-8 sm:p-10 shadow-[0_10px_35px_-8px_rgba(13,92,77,0.10)] transition-all hover:shadow-[0_15px_45px_-8px_rgba(13,92,77,0.15)]">
                <div className="absolute -top-3.5 left-8 inline-block bg-[#0D5C4D] text-[#E5A823] px-3.5 py-0.5 text-[11px] font-mono font-semibold uppercase tracking-wider rounded-md">
                  {isEn ? "Working Principle" : "Prinsip Kerja"}
                </div>
                <div className="text-4xl text-[#0D5C4D]/30 font-serif leading-none mb-3">“</div>
                <blockquote className="text-neutral-800 text-lg sm:text-xl font-medium leading-relaxed font-heading">
                  {isEn
                    ? "Every collaboration begins with understanding context, not offering solutions."
                    : "Setiap kolaborasi bermula dari memahami konteks, bukan menawarkan solusi."}
                </blockquote>
                <div className="mt-6 pt-5 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                  <span className="font-semibold text-[#0D5C4D]">{isEn ? "Our Framework" : "Kerangka Kerja"}</span>
                  <span className="font-mono text-neutral-400">01 LISTEN → 05 LEARN</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── 2. THREE CORE PILLARS ─────────────────────────────────────── */}
      <section className="bg-[#FAF9F5] py-24 border-b border-neutral-200/70">
        <Container size="default">
          <div className="max-w-2xl mb-16">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#0D5C4D]">
              01 / {isEn ? "Core Pillars" : "Tiga Pilar Utama"}
            </p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
              {isEn
                ? "Change becomes meaningful when these three are connected."
                : "Perubahan menjadi bermakna ketika ketiganya terhubung."}
            </h2>
            <p className="mt-4 text-base text-neutral-600 leading-relaxed">
              {isEn
                ? "We don't treat research, nature, and society as isolated silos. They inform and strengthen one another."
                : "Kami tidak melihat riset, alam, dan masyarakat sebagai ruang terpisah. Ketiganya saling memperkuat dan memberi makna."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                number: "01",
                pillar: "Knowledge",
                pillarID: "Pengetahuan",
                badge: isEn ? "EVIDENCE & INSIGHT" : "BUKTI & PEMBELAJARAN",
                descEN: "Research, assessment, field data, and the translation of knowledge for strategic decisions and contextual understanding.",
                descID: "Riset, asesmen, data lapangan, dan penerjemahan pengetahuan untuk keputusan strategis dan pemahaman kontekstual.",
                color: "#0D5C4D",
                tags: ["Riset & Asesmen", "Data Lapangan", "Dokumentasi"],
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                ),
              },
              {
                number: "02",
                pillar: "Nature",
                pillarID: "Alam",
                badge: isEn ? "ECOLOGY & RESILIENCE" : "EKOLOGI & KETAHANAN",
                descEN: "Conservation, biodiversity, climate resilience, and the integration of ecological sustainability into every approach.",
                descID: "Konservasi, keanekaragaman hayati, ketahanan iklim, dan integrasi keberlanjutan ekologis ke dalam setiap pendekatan.",
                color: "#116958",
                tags: ["Konservasi", "Ketahanan Iklim", "Lanskap Berkelanjutan"],
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
                  </svg>
                ),
              },
              {
                number: "03",
                pillar: "Communities",
                pillarID: "Komunitas",
                badge: isEn ? "VOICES & ACTION" : "SUARA & AKSI NYATA",
                descEN: "People, local knowledge, participation, empowerment, and solutions built with those who will live with them.",
                descID: "Masyarakat, pengetahuan lokal, partisipasi, pemberdayaan, dan solusi yang dibangun bersama mereka yang akan menjalaninya.",
                color: "#D96B27",
                tags: ["Kapasitas Lokal", "Inklusi Sosial", "Partisipasi"],
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                ),
              },
            ].map((p) => (
              <div
                key={p.pillar}
                className="group relative flex flex-col justify-between rounded-3xl border border-neutral-200/90 bg-white p-8 sm:p-10 shadow-sm transition-all duration-300 hover:shadow-[0_16px_40px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1.5"
                style={{ borderTop: `4px solid ${p.color}` }}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 duration-300"
                      style={{ backgroundColor: `${p.color}15`, color: p.color }}
                    >
                      {p.icon}
                    </div>
                    <span className="font-mono text-xs font-bold tracking-wider text-neutral-400">
                      {p.number}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-neutral-400 block mb-1">
                    {p.badge}
                  </span>

                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-950 transition-colors group-hover:text-[#0D5C4D]">
                    {isEn ? p.pillar : p.pillarID}
                  </h3>

                  <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-600">
                    {isEn ? p.descEN : p.descID}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-neutral-100 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── 3. ABOUT BODY & GEDSI ─────────────────────────────────────── */}
      <section className="bg-white py-24 border-b border-neutral-100">
        <Container size="default">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#0D5C4D] mb-4">
                02 / {isEn ? "Who We Are" : "Siapa Kami"}
              </p>
              <div className="prose prose-neutral max-w-none space-y-5 text-base leading-relaxed text-neutral-700">
                {isEn ? (
                  <>
                    <p>
                      ANTRABUMI works with communities, government, academics, civil society organizations, the private
                      sector, and development partners — bridging diverse perspectives so that the changes that occur are
                      meaningful to all parties involved.
                    </p>
                    <p>
                      We believe that every collaboration must begin with listening and understanding context, not offering
                      solutions. From that understanding, we help design, implement, and document approaches that match
                      the realities on the ground.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      ANTRABUMI bekerja dengan komunitas, pemerintah, akademisi, organisasi masyarakat sipil, sektor swasta,
                      dan mitra pembangunan — menjembatani berbagai perspektif agar perubahan yang terjadi bermakna bagi
                      semua pihak yang terlibat.
                    </p>
                    <p>
                      Kami percaya bahwa setiap kolaborasi harus dimulai dari mendengarkan dan memahami konteks, bukan dari
                      penawaran solusi. Dari pemahaman itulah kami membantu merancang, menjalankan, dan mendokumentasikan
                      pendekatan yang sesuai dengan realitas di lapangan.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* GEDSI Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-[#D96B27]/20 bg-gradient-to-br from-[#D96B27]/5 to-[#E5A823]/5 p-8 sm:p-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#D96B27]/30 bg-[#D96B27]/10 px-3 py-1 text-xs font-semibold tracking-widest uppercase text-[#D96B27] mb-4">
                  GEDSI
                </div>
                <h3 className="font-heading text-xl font-bold text-neutral-950 mb-3">
                  Gender Equality, Disability &amp; Social Inclusion
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600">
                  {isEn
                    ? "Our approach always considers gender equality, disability, and social inclusion (GEDSI) as an integral part of the process — not merely a keyword, but a genuine way we involve communities, design solutions, and support decision-making."
                    : "Pendekatan kami selalu mempertimbangkan kesetaraan gender, disabilitas, dan inklusi sosial (GEDSI) sebagai bagian integral dari proses — bukan sekadar kata kunci, melainkan cara kerja nyata kami dalam melibatkan komunitas, merancang solusi, dan mendukung pengambilan keputusan."}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {(isEn
                    ? ["Understanding Context", "Involving Communities", "Designing Solutions", "Supporting Decisions"]
                    : ["Memahami Konteks", "Melibatkan Komunitas", "Merancang Solusi", "Mendukung Keputusan"]
                  ).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-[#D96B27]/10 px-2.5 py-1 text-[11px] font-medium text-[#D96B27]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── 4. JOURNEY / TIMELINE ─────────────────────────────────────── */}
      <section id="perjalanan" className="bg-[#FAF9F5] py-24 border-b border-neutral-200/70">
        <Container size="default">
          <div className="max-w-2xl mb-16">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#0D5C4D]">
              03 / {isEn ? "Our Journey" : "Perjalanan"}
            </p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
              {isEn ? "Growing Through Field Practice" : "Tumbuh dari Praktik Lapangan"}
            </h2>
            <p className="mt-4 text-base text-neutral-600 leading-relaxed">
              {isEn
                ? "Every milestone has been shaped by listening, learning, and working alongside communities, academics, and partners across landscapes."
                : "Setiap langkah dibentuk oleh proses mendengarkan, belajar, dan bekerja bersama komunitas, akademisi, dan mitra di lapangan."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {timeline.map((t, i) => {
              const isCurrent = i === timeline.length - 1;
              return (
                <div
                  key={t.year}
                  className={`group relative flex flex-col justify-between rounded-3xl border p-8 transition-all duration-300 hover:-translate-y-1.5 ${
                    isCurrent
                      ? "border-[#0D5C4D] bg-gradient-to-br from-[#0D5C4D] via-[#0A483C] to-[#08352C] text-white shadow-xl shadow-[#0D5C4D]/25"
                      : "border-neutral-200/90 bg-white hover:border-[#0D5C4D]/50 hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.08)]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`font-mono text-3xl sm:text-4xl font-extrabold ${
                          isCurrent ? "text-[#E5A823]" : "text-[#0D5C4D]"
                        }`}
                      >
                        {t.year}
                      </span>
                      {isCurrent ? (
                        <span className="rounded-full bg-[#E5A823]/20 border border-[#E5A823]/30 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#E5A823]">
                          {isEn ? "CURRENT PHASE" : "BABAK BARU"}
                        </span>
                      ) : (
                        <span className="text-xs font-mono text-neutral-400">
                          {`PHASE 0${i + 1}`}
                        </span>
                      )}
                    </div>
                    <h3
                      className={`font-heading text-xl font-bold ${
                        isCurrent ? "text-white" : "text-neutral-950"
                      }`}
                    >
                      {t.label}
                    </h3>
                    <p
                      className={`mt-3 text-sm leading-relaxed ${
                        isCurrent ? "text-neutral-200" : "text-neutral-600"
                      }`}
                    >
                      {t.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-100/20 flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isCurrent ? "bg-[#E5A823]" : "bg-[#0D5C4D]"
                      }`}
                    />
                    <span
                      className={`text-[11px] font-mono ${
                        isCurrent ? "text-neutral-300" : "text-neutral-400"
                      }`}
                    >
                      {isEn ? "Antrabumi Milestone" : "Capaian Antrabumi"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ─── 5. OUR FRAMEWORK ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#081C17] py-28 text-white">
        <div className="absolute top-0 right-0 -mt-24 -mr-24 h-[550px] w-[550px] rounded-full bg-[#0D5C4D]/25 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-24 -ml-24 h-[450px] w-[450px] rounded-full bg-[#E5A823]/10 blur-3xl pointer-events-none" />
        <Container size="default">
          <div className="relative z-10 max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E5A823]/30 bg-[#E5A823]/10 px-3.5 py-1 text-xs font-semibold tracking-widest uppercase text-[#E5A823] mb-4">
              04 / {isEn ? "Our Framework" : "Kerangka Kerja Kami"}
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {isEn
                ? "Every collaboration begins with understanding context, not offering solutions."
                : "Setiap kolaborasi bermula dari memahami konteks, bukan menawarkan solusi."}
            </h2>
            <p className="mt-4 text-base text-neutral-300 leading-relaxed">
              {isEn
                ? "A 5-step iterative cycle designed to bridge ground realities with sustainable solutions."
                : "Siklus kerja 5 tahap yang dirancang untuk menjembatani realitas lapangan dengan solusi yang berkelanjutan."}
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {frameworkSteps.map((item, idx) => (
              <div
                key={item.num}
                className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-md transition-all duration-300 hover:border-[#0D5C4D] hover:bg-white/[0.08] hover:-translate-y-1"
              >
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <span className="font-mono text-2xl font-black text-[#0D5C4D] group-hover:text-[#E5A823] transition-colors">
                      {item.num}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-[#E5A823] group-hover:bg-[#E5A823]/20 transition-all">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-white group-hover:text-[#E5A823] transition-colors">
                    {item.step}
                  </h3>
                  <p className="mt-0.5 text-xs font-semibold text-[#E5A823]/90">
                    {isEn ? item.step : item.stepID}
                  </p>
                  <p className="mt-4 text-xs leading-relaxed text-neutral-300">
                    {isEn ? item.descEN : item.descID}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-1.5">
                    <span>STEP {idx + 1} OF 5</span>
                    <span>{((idx + 1) * 20)}%</span>
                  </div>
                  <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-1 rounded-full bg-gradient-to-r from-[#0D5C4D] to-[#E5A823] transition-all duration-500"
                      style={{ width: `${((idx + 1) / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── 6. COLLECTIVE EXPERTISE ─────────────────────────────────── */}
      <section className="bg-white py-24 border-b border-neutral-200/70">
        <Container size="default">
          <div className="max-w-2xl mb-16">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#0D5C4D]">
              05 / {isEn ? "Collective Expertise" : "Keahlian Kolektif"}
            </p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
              {isEn
                ? "Multiple perspectives, combined into one approach."
                : "Beragam perspektif, disatukan dalam satu pendekatan."}
            </h2>
            <p className="mt-4 text-base text-neutral-600 leading-relaxed">
              {isEn
                ? "ANTRABUMI's strength lies in the diversity of expertise within the team — spanning field practice, research, and collaboration."
                : "Kekuatan ANTRABUMI terletak pada keberagaman keahlian di dalam tim — yang merentang dari praktik lapangan, riset, hingga kolaborasi."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {expertiseAreas.map((area) => (
              <div
                key={area.label}
                className="group relative rounded-2xl border border-neutral-200/90 bg-[#FBF9F5] p-6 transition-all duration-300 hover:border-[#0D5C4D]/50 hover:bg-white hover:shadow-[0_8px_24px_-4px_rgba(13,92,77,0.08)] hover:-translate-y-1"
              >
                <div
                  className="h-1.5 w-10 rounded-full mb-4 transition-all duration-300 group-hover:w-16"
                  style={{ backgroundColor: area.color }}
                />
                <p className="text-sm sm:text-base font-bold text-neutral-950 group-hover:text-[#0D5C4D] transition-colors font-heading leading-snug">
                  {area.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── 7. PEOPLE / TEAM ─────────────────────────────────────────── */}
      <section id="tim" className="bg-[#FAF9F5] py-24 border-b border-neutral-200/70">
        <Container size="default">
          <div className="max-w-2xl mb-16">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#0D5C4D]">
              06 / {isEn ? "The Collective" : "Tim & Kolektif"}
            </p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
              {isEn ? "The People Behind ANTRABUMI" : "Orang-orang di Balik ANTRABUMI"}
            </h2>
            <p className="mt-4 text-base text-neutral-600 leading-relaxed">
              {isEn
                ? "Diverse backgrounds united by a shared commitment to connecting knowledge, nature, and communities."
                : "Beragam latar belakang yang disatukan oleh komitmen untuk menghubungkan pengetahuan, alam, dan komunitas."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {teamList.map((p) => {
              const initials = p.name
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((n) => n[0])
                .join("");
              const imageUrl = p.imageUrl;
              const imageAlt = p.imageAlt || p.name;
              const role = p.role;
              const degree = p.degree;
              const biography = p.biography;

              return (
                <div
                  key={p.name}
                  className="group relative flex flex-col justify-between rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-7 shadow-xs transition-all duration-300 hover:border-[#0D5C4D]/40 hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.08)] hover:-translate-y-1.5"
                >
                  <div>
                    {imageUrl ? (
                      <div className="relative mb-5 h-28 w-28 overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-100 shadow-xs">
                        <img
                          src={imageUrl}
                          alt={imageAlt}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
                        />
                      </div>
                    ) : (
                      <div className="mb-5 flex h-28 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0D5C4D]/10 via-[#116958]/10 to-[#E5A823]/10 text-[#0D5C4D] font-heading font-black text-2xl border border-[#0D5C4D]/15 shadow-xs transition-transform duration-300 group-hover:scale-105">
                        {initials}
                      </div>
                    )}

                    <h3 className="text-base sm:text-lg font-bold text-neutral-950 group-hover:text-[#0D5C4D] transition-colors font-heading leading-snug">
                      {p.name}
                    </h3>

                    {role && role !== "—" && (
                      <div className="mt-2 inline-block rounded-md bg-[#0D5C4D]/5 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#0D5C4D]">
                        {role}
                      </div>
                    )}

                    {degree && !p.name.includes(degree) && (
                      <p className="mt-1 text-xs text-neutral-400 font-mono">
                        {degree}
                      </p>
                    )}

                    {biography && (
                      <p className="mt-3 text-xs leading-relaxed text-neutral-600 line-clamp-3">
                        {biography}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                    <span>ANTRABUMI</span>
                    <span className="text-[#0D5C4D] font-semibold">●</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ─── 8. CTA ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0D5C4D] to-[#0A483C] py-20 text-white">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(white_1px,transparent_1px)] [background-size:20px_20px]" />
        <Container size="default">
          <div className="relative z-10 flex flex-col items-center text-center space-y-6">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              {isEn
                ? "Want to work with us?"
                : "Ingin bekerja bersama kami?"}
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-neutral-200">
              {isEn
                ? "Whether you have a project, an idea, or a shared concern — let's start with a conversation."
                : "Baik memiliki proyek, gagasan, atau keresahan yang sama — mari mulai dari percakapan."}
            </p>
            <div className="flex flex-wrap gap-4 pt-2 justify-center">
              <Link
                href="/kolaborasi"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-[#0D5C4D] shadow-xl shadow-black/10 transition-all hover:-translate-y-0.5 hover:shadow-2xl"
              >
                {isEn ? "Start a Collaboration" : "Mulai Kolaborasi"}
                <span>→</span>
              </Link>
              <Link
                href="/inisiatif"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white/20 hover:-translate-y-0.5"
              >
                {isEn ? "View Our Initiatives" : "Lihat Inisiatif Kami"}
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
