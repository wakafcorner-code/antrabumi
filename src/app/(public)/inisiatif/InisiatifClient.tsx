"use client";

import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

interface InisiatifClientProps {
  lang: string;
}

export function InisiatifClient({ lang }: InisiatifClientProps) {
  const isEn = lang === "EN";

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

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#0F2F27]">
      {/* Hero Section */}
      <section className="pt-12 sm:pt-16 pb-12 lg:pb-16">
        <Container size="default">
          <div className="max-w-4xl space-y-4 sm:space-y-6">
            <span className="block font-mono text-xs sm:text-sm font-semibold tracking-[0.25em] text-[#1B3E35] uppercase">
              {isEn ? "INITIATIVES" : "INISIATIF"}
            </span>

            <h1 className="font-heading text-4xl sm:text-6xl lg:text-[68px] font-extrabold leading-[1.08] tracking-tight text-[#0F2F27]">
              {isEn ? (
                <>
                  A workspace connecting nature, communities, knowledge, and change.
                </>
              ) : (
                <>
                  Ruang kerja yang menghubungkan alam, masyarakat, pengetahuan, dan perubahan.
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-neutral-600 max-w-2xl font-normal leading-relaxed pt-2">
              {isEn
                ? "Four initiative areas serve as a space for ANTRABUMI to work with partners, adhere to context, and develop solutions."
                : "Empat area inisiatif menjadi ruang bagi ANTRABUMI untuk bekerja bersama mitra, mengikuti konteks, dan mengembangkan solusi."}
            </p>
          </div>
        </Container>
      </section>

      {/* 4 Initiatives Grid */}
      <section className="pb-20 lg:pb-28">
        <Container size="default">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-7">
            {initiatives.map((item, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden aspect-[16/10] sm:aspect-[16/10] min-h-[300px] sm:min-h-[340px] bg-neutral-900 shadow-sm transition-all duration-300"
              >
                {/* Background Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={isEn ? item.titleEn : item.titleId}
                  loading={idx < 2 ? "eager" : "lazy"}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Dark Gradient Overlay for optimal editorial legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />

                {/* Card Content */}
                <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-9 text-white">
                  <span className="mb-2 font-mono text-xs font-medium tracking-wider text-white/80">
                    {isEn ? item.tagEn : item.tagId}
                  </span>

                  <h2 className="font-heading text-xl sm:text-2xl font-bold leading-snug text-white mb-2">
                    {isEn ? item.titleEn : item.titleId}
                  </h2>

                  <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal max-w-xl">
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
          {/* Header */}
          <div className="mb-10 sm:mb-14 space-y-2">
            <span className="block font-mono text-xs font-semibold tracking-[0.25em] text-[#1B3E35] uppercase">
              {isEn ? "OUR CONTRIBUTIONS" : "KONTRIBUSI KAMI"}
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-[#0F2F27]">
              {isEn
                ? "Six interconnected capabilities."
                : "Enam kemampuan yang saling terhubung."}
            </h2>
          </div>

          {/* 6 Grid Cells with Unified Fine Borders */}
          <div className="border border-neutral-300/80 bg-[#F8F7F4]/40">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {contributions.map((c, i) => {
                // Determine border classes for clean 3-col x 2-row table effect
                const isRightCol = (i + 1) % 3 === 0;
                const isBottomRow = i >= 3;

                return (
                  <div
                    key={i}
                    className={`p-7 sm:p-9 lg:p-10 flex flex-col justify-between transition-colors hover:bg-white/60 ${
                      // Vertical separator
                      !isRightCol ? "lg:border-r border-neutral-300/80" : ""
                    } ${
                      // Horizontal separator
                      !isBottomRow ? "border-b border-neutral-300/80" : ""
                    } ${
                      // MD screen vertical borders
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

      {/* Collaboration Callout (Soft Editorial Finish) */}
      <section className="border-t border-neutral-200/80 bg-[#F8F7F4] py-16 sm:py-20 text-center">
        <Container size="reading">
          <div className="space-y-4">
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#0F2F27]">
              {isEn
                ? "Work with ANTRABUMI across these four initiatives"
                : "Bekerja bersama ANTRABUMI di empat area inisiatif"}
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed max-w-xl mx-auto">
              {isEn
                ? "We invite organizations, governments, researchers, and local leaders to co-create contextual solutions grounded in real-world practice."
                : "Kami mengundang lembaga, pemerintah, periset, dan pemimpin komunitas untuk bersama-sama mengembangkan solusi berbasis konteks lapangan."}
            </p>
            <div className="pt-3">
              <Link
                href="/kolaborasi#kontak"
                className="inline-flex h-11 items-center rounded-full bg-[#0D5C4D] px-7 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#116958] hover:shadow-md"
              >
                {isEn ? "Collaborate With Us →" : "Mulai Kolaborasi →"}
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
