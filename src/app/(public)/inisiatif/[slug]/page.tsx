import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { prisma } from "@/lib/db/prisma";
import { ContentStatus } from "@prisma/client";
import { getLanguage } from "@/lib/i18n/language";

interface Props {
  params: Promise<{ slug: string }>;
}

// Fallback details if DB has empty description or slug is accessed directly (AGENTS.md §15)
const fallbackInitiatives: Record<
  string,
  {
    titleId: string;
    titleEn: string;
    year: number;
    category: string;
    overviewId: string;
    overviewEn: string;
  }
> = {
  "indonesia-digital-ecosystem-assessment-idea": {
    titleId: "Indonesia Digital Ecosystem Assessment — IDEA",
    titleEn: "Indonesia Digital Ecosystem Assessment — IDEA",
    year: 2024,
    category: "Research, Assessment & Knowledge",
    overviewId:
      "Asesmen komprehensif mengenai ekosistem digital nasional yang menghubungkan temuan lapangan, kesiapan regulasi, dan kapasitas pemangku kepentingan dalam mewujudkan transformasi digital yang berkeadilan.",
    overviewEn:
      "A comprehensive national digital ecosystem assessment bridging field findings, regulatory readiness, and stakeholder capacity for equitable digital transformation.",
  },
  "perencanaan-pengelolaan-ekowisata-desa": {
    titleId: "Perencanaan Pengelolaan Ekowisata Desa",
    titleEn: "Village Ecotourism Management Planning",
    year: 2023,
    category: "Conservation, Climate & Sustainability",
    overviewId:
      "Pendampingan perumusan rencana kelola ekowisata berbasis partisipasi aktif masyarakat desa, pelestarian keanekaragaman hayati, dan penguatan kemandirian ekonomi lokal.",
    overviewEn:
      "Facilitating the formulation of village ecotourism management plans rooted in active community participation, biodiversity conservation, and local economic resilience.",
  },
  "assessment-training-for-community-development": {
    titleId: "Assessment Training for Community Development",
    titleEn: "Assessment Training for Community Development",
    year: 2023,
    category: "Community Development",
    overviewId:
      "Program peningkatan kapasitas praktisi lapangan dan fasilitator masyarakat dalam menerapkan metodologi asesmen partisipatif yang peka konteks, inklusif, dan berorientasi aksi.",
    overviewEn:
      "A capacity enhancement program for field practitioners and community facilitators in applying context-sensitive, inclusive, and action-oriented participatory assessment methodologies.",
  },
  "assessment-pengembangan-batik-ekologis": {
    titleId: "Assessment Pengembangan Batik Ekologis",
    titleEn: "Ecological Batik Development Assessment",
    year: 2022,
    category: "Conservation, Climate & Sustainability",
    overviewId:
      "Kajian mendalam terhadap potensi pewarna alam, konservasi flora pewarna lokal, serta perancangan rantai nilai produksi batik yang ramah lingkungan dan memberdayakan perajin.",
    overviewEn:
      "In-depth research exploring natural dyes, conservation of local dye flora, and designing environmentally friendly batik production value chains empowering artisans.",
  },
  "prototyping-pengelolaan-sampah-pasar-tradisional": {
    titleId: "Prototyping Pengelolaan Sampah Pasar Tradisional",
    titleEn: "Traditional Market Waste Management Prototyping",
    year: 2022,
    category: "Conservation, Climate & Sustainability",
    overviewId:
      "Uji coba solusi praktis penanganan dan pemilahan sampah pasar secara partisipatif, menghubungkan pedagang, pengelola pasar, dan pegiat daur ulang lokal.",
    overviewEn:
      "Piloting participatory waste segregation and management models in traditional markets, connecting vendors, market authorities, and local recyclers.",
  },
};

// Aliases for slug flexibility
const slugAliases: Record<string, string> = {
  "indonesia-digital-ecosystem-assessment": "indonesia-digital-ecosystem-assessment-idea",
  "perencanaan-ekowisata-desa": "perencanaan-pengelolaan-ekowisata-desa",
  "assessment-training-community-development": "assessment-training-for-community-development",
  "assessment-batik-ekologis": "assessment-pengembangan-batik-ekologis",
  "prototyping-sampah-pasar-tradisional": "prototyping-pengelolaan-sampah-pasar-tradisional",
};

async function getExperience(slug: string) {
  const normalizedSlug = slugAliases[slug] ?? slug;

  try {
    const fromDb = await prisma.experience.findFirst({
      where: {
        OR: [{ slug: normalizedSlug }, { slug: slug }],
        status: ContentStatus.PUBLISHED,
      },
      select: {
        id: true,
        slug: true,
        year: true,
        location: true,
        clientName: true,
        coverMedia: { select: { url: true, altText: true } },
        translations: {
          select: {
            title: true,
            excerpt: true,
            description: true,
            methodology: true,
            impact: true,
            language: true,
          },
        },
        metrics: {
          select: { label: true, value: true, unit: true },
          orderBy: { order: "asc" },
        },
      },
    });

    if (fromDb) return fromDb;
  } catch {
    // Fallback if DB error
  }

  // Check static fallback
  const fallback = fallbackInitiatives[normalizedSlug];
  if (!fallback) return null;

  return {
    id: normalizedSlug,
    slug: normalizedSlug,
    year: fallback.year,
    location: null,
    clientName: null,
    coverMedia: null,
    translations: [
      {
        title: fallback.titleId,
        excerpt: fallback.overviewId,
        description: fallback.overviewId,
        methodology: null,
        impact: null,
        language: "ID",
      },
      {
        title: fallback.titleEn,
        excerpt: fallback.overviewEn,
        description: fallback.overviewEn,
        methodology: null,
        impact: null,
        language: "EN",
      },
    ],
    metrics: [],
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const exp = await getExperience(slug);
  if (!exp) return { title: "Inisiatif Tidak Ditemukan — ANTRABUMI" };

  const lang = await getLanguage();
  const t =
    exp.translations.find((tr) => tr.language === lang) ??
    exp.translations.find((tr) => tr.language === "ID") ??
    exp.translations[0];

  return {
    title: t ? `${t.title} — Inisiatif ANTRABUMI` : `${slug} — Inisiatif ANTRABUMI`,
    description: t?.excerpt ?? "Inisiatif dan pengalaman lapangan ANTRABUMI.",
  };
}

export default async function ExperienceDetailPage({ params }: Props) {
  const { slug } = await params;
  const exp = await getExperience(slug);

  if (!exp) notFound();

  const lang = await getLanguage();
  const isEn = lang === "EN";
  const t =
    exp.translations.find((tr) => tr.language === lang) ??
    exp.translations.find((tr) => tr.language === "ID") ??
    exp.translations[0];

  const title = t?.title ?? exp.slug;
  const fallbackInfo = fallbackInitiatives[exp.slug];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Bar */}
      <div className="border-b border-neutral-100 bg-neutral-50/80 py-3.5 backdrop-blur-sm">
        <Container size="default">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-neutral-500">
            <Link href="/" className="hover:text-neutral-900 transition-colors">
              {isEn ? "Home" : "Beranda"}
            </Link>
            <span className="text-neutral-300">/</span>
            <Link href="/inisiatif" className="hover:text-neutral-900 transition-colors">
              {isEn ? "Initiatives" : "Inisiatif"}
            </Link>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-800 font-medium truncate max-w-xs sm:max-w-md">
              {title}
            </span>
          </nav>
        </Container>
      </div>

      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-neutral-100 bg-[#0B1E1A] py-16 sm:py-24 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0D5C4D_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#0D5C4D]/25 blur-3xl pointer-events-none" />

        <Container size="default">
          <div className="relative z-10 max-w-4xl space-y-6">
            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#0D5C4D] border border-[#147A66] px-3 py-1 font-mono text-xs font-semibold text-white">
                {exp.year ?? "Inisiatif"}
              </span>
              {fallbackInfo?.category && (
                <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-xs font-medium text-neutral-200">
                  {fallbackInfo.category}
                </span>
              )}
              {exp.location && (
                <span className="inline-flex items-center gap-1.5 text-xs text-neutral-300 font-mono">
                  <span>📍</span> {exp.location}
                </span>
              )}
              {exp.clientName && (
                <span className="text-xs text-neutral-300 font-mono">
                  · {isEn ? "Partner/Client:" : "Mitra/Klien:"} {exp.clientName}
                </span>
              )}
            </div>

            <h1 className="font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl text-white">
              {title}
            </h1>

            {t?.excerpt && (
              <p className="text-lg leading-relaxed text-neutral-200 sm:text-xl font-light">
                {t.excerpt}
              </p>
            )}
          </div>
        </Container>
      </section>

      {/* Cover Image banner if exists */}
      {exp.coverMedia?.url && (
        <section className="border-b border-neutral-100 bg-neutral-100">
          <Container size="default">
            <div className="relative aspect-[21/9] w-full overflow-hidden">
              <Image
                src={exp.coverMedia.url}
                alt={exp.coverMedia.altText ?? title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </Container>
        </section>
      )}

      {/* Main Content Area */}
      <section className="py-14 sm:py-20 bg-white">
        <Container size="default">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Main Column */}
            <div className="lg:col-span-8 space-y-12">
              {/* Metrics if available */}
              {exp.metrics && exp.metrics.length > 0 && (
                <div>
                  <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-400 mb-4">
                    {isEn ? "Initiative Highlights" : "Sorotan Inisiatif"}
                  </h2>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {exp.metrics.map((m, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-neutral-100 bg-neutral-50/80 p-5"
                      >
                        <p className="font-heading text-3xl font-bold text-[#0D5C4D]">
                          {m.value}
                          {m.unit ? <span className="text-lg font-normal text-neutral-600"> {m.unit}</span> : null}
                        </p>
                        <p className="mt-1 text-xs text-neutral-600 font-medium">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {t?.description && (
                <div className="space-y-4">
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-neutral-950">
                    {isEn ? "Overview & Context" : "Konteks & Gambaran Inisiatif"}
                  </h2>
                  <div className="prose prose-neutral max-w-none text-base leading-relaxed text-neutral-700">
                    <p className="whitespace-pre-line">{t.description}</p>
                  </div>
                </div>
              )}

              {/* Methodology */}
              {t?.methodology ? (
                <div className="space-y-4">
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-neutral-950">
                    {isEn ? "Approach & Methodology" : "Pendekatan & Metodologi"}
                  </h2>
                  <div className="prose prose-neutral max-w-none text-base leading-relaxed text-neutral-700">
                    <p className="whitespace-pre-line">{t.methodology}</p>
                  </div>
                </div>
              ) : null}

              {/* Impact */}
              {t?.impact ? (
                <div className="space-y-4">
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-neutral-950">
                    {isEn ? "Outcomes & Learnings" : "Hasil & Pembelajaran Lapangan"}
                  </h2>
                  <div className="prose prose-neutral max-w-none text-base leading-relaxed text-neutral-700">
                    <p className="whitespace-pre-line">{t.impact}</p>
                  </div>
                </div>
              ) : null}

              {/* Editorial Notice on In-Depth Report */}
              <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/70 p-6 sm:p-8 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl">📄</span>
                  <div className="space-y-1">
                    <h3 className="font-heading text-base font-bold text-neutral-950">
                      {isEn ? "Access Documentation & Case Studies" : "Akses Dokumentasi & Studi Kasus"}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      {isEn
                        ? "Full project briefs, assessment reports, and methodology documentation can be requested for academic, collaborative, or programmatic purposes."
                        : "Dokumen ringkasan inisiatif, laporan asesmen, dan catatan metodologi dapat diakses untuk kepentingan riset, kolaborasi, maupun perumusan program."}
                    </p>
                  </div>
                </div>
                <div className="pt-2">
                  <Link
                    href={`/kolaborasi#kontak?subject=Inquiry%20${encodeURIComponent(title)}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-white border border-neutral-200 px-5 py-2.5 text-xs font-semibold text-neutral-900 shadow-sm hover:border-[#0D5C4D] hover:text-[#0D5C4D] transition-colors"
                  >
                    <span>{isEn ? "Request details via email" : "Hubungi kami tentang inisiatif ini"}</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-4 space-y-6">
              {/* Quick Info Card */}
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm space-y-5">
                <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-neutral-900">
                  {isEn ? "Initiative Details" : "Informasi Inisiatif"}
                </h3>

                <dl className="divide-y divide-neutral-100 text-xs">
                  <div className="py-3 flex items-center justify-between">
                    <dt className="text-neutral-500 font-mono">{isEn ? "Year" : "Tahun"}</dt>
                    <dd className="font-semibold text-neutral-900">{exp.year}</dd>
                  </div>
                  {fallbackInfo?.category && (
                    <div className="py-3 flex flex-col gap-1">
                      <dt className="text-neutral-500 font-mono">{isEn ? "Focus Area" : "Bidang Fokus"}</dt>
                      <dd className="font-medium text-neutral-900">{fallbackInfo.category}</dd>
                    </div>
                  )}
                  {exp.location && (
                    <div className="py-3 flex items-center justify-between">
                      <dt className="text-neutral-500 font-mono">{isEn ? "Location" : "Lokasi"}</dt>
                      <dd className="font-medium text-neutral-900">{exp.location}</dd>
                    </div>
                  )}
                  {exp.clientName && (
                    <div className="py-3 flex items-center justify-between">
                      <dt className="text-neutral-500 font-mono">{isEn ? "Partner" : "Mitra"}</dt>
                      <dd className="font-medium text-neutral-900">{exp.clientName}</dd>
                    </div>
                  )}
                  <div className="py-3 flex items-center justify-between">
                    <dt className="text-neutral-500 font-mono">{isEn ? "Status" : "Status"}</dt>
                    <dd className="inline-flex items-center gap-1.5 font-semibold text-[#0D5C4D]">
                      <span className="h-2 w-2 rounded-full bg-[#0D5C4D]" />
                      <span>{isEn ? "Documented" : "Terdokumentasi"}</span>
                    </dd>
                  </div>
                </dl>

                <div className="pt-2 border-t border-neutral-100">
                  <Link
                    href="/kolaborasi#kontak"
                    className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#0D5C4D] via-[#116958] to-[#147A66] py-3 text-xs font-semibold text-white shadow-md shadow-[#0D5C4D]/20 transition-all hover:shadow-lg hover:shadow-[#0D5C4D]/30"
                  >
                    {isEn ? "Discuss Similar Initiative" : "Diskusikan Inisiatif Serupa"}
                  </Link>
                </div>
              </div>

              {/* Back Link */}
              <div className="text-center">
                <Link
                  href="/inisiatif"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  <span>←</span>
                  <span>{isEn ? "Back to all initiatives" : "Kembali ke semua inisiatif"}</span>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
