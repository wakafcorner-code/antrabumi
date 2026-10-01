import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { PdfDocumentCard } from "@/components/ui/PdfDocumentCard";
import { prisma } from "@/lib/db/prisma";
import { ContentStatus } from "@prisma/client";
import { getLanguage } from "@/lib/i18n/language";

interface Props {
  params: Promise<{ slug: string }>;
}

// Fallback details if DB has empty description or slug is accessed directly (AGENTS.md §15)
const fallbackExperiences: Record<
  string,
  {
    titleId: string;
    titleEn: string;
    year: number;
    category: string;
    locationId: string | null;
    locationEn: string | null;
    partner: string | null;
    overviewId: string;
    overviewEn: string;
    methodologyId: string;
    methodologyEn: string;
    impactId: string;
    impactEn: string;
  }
> = {
  "indonesia-digital-ecosystem-assessment-idea": {
    titleId: "Indonesia Digital Ecosystem Assessment — IDEA",
    titleEn: "Indonesia Digital Ecosystem Assessment — IDEA",
    year: 2024,
    category: "Research, Assessment & Knowledge",
    locationId: "Nasional / Multi-wilayah",
    locationEn: "National / Multi-region",
    partner: "Mitra Pembangunan & Multi-stakeholder",
    overviewId:
      "Asesmen komprehensif mengenai ekosistem digital nasional yang menghubungkan temuan lapangan, kesiapan regulasi, dan kapasitas pemangku kepentingan dalam mewujudkan transformasi digital yang inklusif dan berkeadilan bagi seluruh lapisan masyarakat.",
    overviewEn:
      "A comprehensive national digital ecosystem assessment bridging field findings, regulatory readiness, and stakeholder capacity for inclusive and equitable digital transformation.",
    methodologyId:
      "Pendekatan riset campuran meliputi survei multipihak, Focus Group Discussion (FGD) dengan kelompok rentan dan pelaku lokal, analisis kebijakan, serta pemetaan ekosistem secara partisipatif.",
    methodologyEn:
      "Mixed-method research approach combining multi-stakeholder surveys, Focus Group Discussions with vulnerable groups and local actors, policy analysis, and participatory ecosystem mapping.",
    impactId:
      "Menghasilkan peta jalan asesmen digital yang dijadikan rujukan bersama oleh pemangku kepentingan kebijakan dan mitra pelaksana di lapangan.",
    impactEn:
      "Delivered an assessment roadmap utilized by policy stakeholders and field implementing partners for contextual digital programs.",
  },
  "perencanaan-pengelolaan-ekowisata-desa": {
    titleId: "Perencanaan Pengelolaan Ekowisata Desa",
    titleEn: "Village Ecotourism Management Planning",
    year: 2023,
    category: "Konservasi & Lanskap",
    locationId: "Belitung",
    locationEn: "Belitung",
    partner: "Komunitas Desa & Pengelola Wisata Lokal",
    overviewId:
      "Pendampingan perumusan rencana kelola ekowisata berbasis partisipasi aktif masyarakat desa, pelestarian keanekaragaman hayati pesisir, serta penguatan kemandirian kelembagaan dan ekonomi lokal.",
    overviewEn:
      "Facilitating the formulation of village ecotourism management plans rooted in active community participation, coastal biodiversity conservation, and local economic resilience.",
    methodologyId:
      "Pemetaan partisipatif lanskap pesisir, survei daya dukung lingkungan, lokakarya penyusunan Standar Operasional Prosedur (SOP), dan konsultasi publik multi-arah.",
    methodologyEn:
      "Participatory coastal mapping, environmental carrying capacity surveys, management SOP workshops, and multi-directional public consultations.",
    impactId:
      "Terbentuknya dokumen kesepakatan tata kelola desa dan kelompok sadar wisata yang beroperasi dengan prinsip keberlanjutan ekologis.",
    impactEn:
      "Established community ecotourism governance agreements and local tourism stewardship groups operating on ecological principles.",
  },
  "assessment-training-for-community-development": {
    titleId: "Assessment Training for Community Development",
    titleEn: "Assessment Training for Community Development",
    year: 2023,
    category: "Community Development",
    locationId: "Indonesia",
    locationEn: "Indonesia",
    partner: "Fasilitator & Penggerak Komunitas",
    overviewId:
      "Program peningkatan kapasitas praktisi lapangan dan fasilitator masyarakat dalam menerapkan metodologi asesmen partisipatif yang peka konteks, inklusif (GEDSI), dan berorientasi aksi berkelanjutan.",
    overviewEn:
      "A capacity enhancement program for field practitioners and community facilitators in applying context-sensitive, inclusive (GEDSI), and action-oriented participatory assessment methodologies.",
    methodologyId:
      "Modul interaktif berbasis studi kasus riil di lapangan, simulasi wawancara mendalam, participatory rural appraisal (PRA), dan teknik sintesis data komunitas.",
    methodologyEn:
      "Interactive modules based on real field case studies, in-depth interview simulations, participatory rural appraisal (PRA), and community data synthesis techniques.",
    impactId:
      "Puluhan fasilitator lokal terlatih mampu menyusun pemetaan sosial mandiri yang adil gender dan ramah disabilitas.",
    impactEn:
      "Trained grassroots facilitators capable of independently conducting gender-equitable and disability-inclusive community mapping.",
  },
  "assessment-pengembangan-batik-ekologis": {
    titleId: "Assessment Pengembangan Batik Ekologis",
    titleEn: "Ecological Batik Development Assessment",
    year: 2022,
    category: "Konservasi & Lanskap",
    locationId: "Jawa & Komunitas Perajin",
    locationEn: "Java & Artisan Communities",
    partner: "Kelompok Perajin & Inisiatif Lestari",
    overviewId:
      "Kajian mendalam terhadap potensi pewarna alam, konservasi flora pewarna lokal, serta perancangan rantai nilai produksi batik yang ramah lingkungan dan memberdayakan perajin perempuan.",
    overviewEn:
      "In-depth research exploring natural dyes, conservation of local dye flora, and designing environmentally friendly batik production value chains empowering women artisans.",
    methodologyId:
      "Identifikasi botani tanaman pewarna alami, uji coba formula ekstraksi ramah lingkungan, asesmen ekonomi rantai pasok, dan wawancara etnobotani.",
    methodologyEn:
      "Botanical identification of dye plants, eco-friendly extraction trials, supply chain economic assessment, and ethnobotanical interviews.",
    impactId:
      "Terdokumentasikannya formula pewarna alami lestari dan terhubungnya kelompok perajin dengan jejaring pasar sadar lingkungan.",
    impactEn:
      "Documented sustainable natural dye formulas and connected artisan groups with eco-conscious ethical consumer networks.",
  },
  "prototyping-pengelolaan-sampah-pasar-tradisional": {
    titleId: "Prototyping Pengelolaan Sampah Pasar Tradisional",
    titleEn: "Traditional Market Waste Management Prototyping",
    year: 2022,
    category: "Community Development",
    locationId: "Kawasan Pasar Rakyat",
    locationEn: "Traditional Market Areas",
    partner: "Asosiasi Pedagang & Pengelola Pasar",
    overviewId:
      "Uji coba solusi praktis penanganan dan pemilahan sampah pasar secara partisipatif, menghubungkan pedagang, pengelola pasar, dan jejaring pengolah limbah organik lokal.",
    overviewEn:
      "Piloting participatory waste segregation and management models in traditional markets, connecting vendors, market authorities, and local organic recyclers.",
    methodologyId:
      "Audit karakterisasi timbulan sampah, uji alur pemilahan harian bersama pedagang, rekayasa komposter modular, serta evaluasi ekonomi sirkular tingkat mikro.",
    methodologyEn:
      "Waste generation characterization audits, participatory daily sorting trials with vendors, modular composter design, and micro circular economy assessment.",
    impactId:
      "Penurunan volume residu sampah pasar yang dibuang langsung ke TPA dan meningkatnya kesadaran kolektif pedagang.",
    impactEn:
      "Significant reduction in market waste residues directed to landfills and heightened collective vendor environmental awareness.",
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
        contributionAreas: {
          select: {
            contributionArea: {
              select: {
                translations: {
                  select: { title: true, language: true },
                },
              },
            },
          },
        },
        metrics: {
          select: { label: true, value: true, unit: true },
          orderBy: { order: "asc" },
        },
        gallery: {
          include: {
            media: {
              select: {
                id: true,
                url: true,
                filename: true,
                originalName: true,
                size: true,
                mimeType: true,
                type: true,
              },
            },
          },
        },
      },
    });

    if (fromDb) return fromDb;
  } catch {
    // Fallback if DB query fails
  }

  // Check static fallback
  const fallback = fallbackExperiences[normalizedSlug];
  if (!fallback) return null;

  return {
    id: normalizedSlug,
    slug: normalizedSlug,
    year: fallback.year,
    location: fallback.locationId,
    clientName: fallback.partner,
    coverMedia: null,
    translations: [
      {
        title: fallback.titleId,
        excerpt: fallback.overviewId,
        description: fallback.overviewId,
        methodology: fallback.methodologyId,
        impact: fallback.impactId,
        language: "ID" as const,
      },
      {
        title: fallback.titleEn,
        excerpt: fallback.overviewEn,
        description: fallback.overviewEn,
        methodology: fallback.methodologyEn,
        impact: fallback.impactEn,
        language: "EN" as const,
      },
    ],
    contributionAreas: [
      {
        contributionArea: {
          translations: [
            { title: fallback.category, language: "ID" as const },
            { title: fallback.category, language: "EN" as const },
          ],
        },
      },
    ],
    metrics: [],
    gallery: [],
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const exp = await getExperience(slug);
  if (!exp) return { title: "Pengalaman Tidak Ditemukan — ANTRABUMI" };

  const lang = await getLanguage();
  const t =
    exp.translations.find((tr) => tr.language === lang) ??
    exp.translations.find((tr) => tr.language === "ID") ??
    exp.translations[0];

  return {
    title: t ? `${t.title} — Pengalaman ANTRABUMI` : `${slug} — Pengalaman ANTRABUMI`,
    description: t?.excerpt ?? "Pengalaman dan inisiatif lapangan ANTRABUMI.",
    openGraph: {
      title: t ? `${t.title} — ANTRABUMI` : "Pengalaman ANTRABUMI",
      description: t?.excerpt ?? "Pengalaman lapangan ANTRABUMI di berbagai konteks.",
      url: `https://www.antrabumi.org/pengalaman/${slug}`,
    },
  };
}

export default async function PengalamanDetailPage({ params }: Props) {
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
  const fallbackInfo = fallbackExperiences[exp.slug];

  // Category resolution
  const caTrans = exp.contributionAreas?.[0]?.contributionArea?.translations;
  const categoryTitle =
    caTrans?.find((c) => c.language === lang)?.title ??
    caTrans?.find((c) => c.language === "ID")?.title ??
    fallbackInfo?.category ??
    (isEn ? "Experience" : "Pengalaman");

  // Other experiences for recommendation / next reading
  const otherExperiences = Object.entries(fallbackExperiences)
    .filter(([s]) => s !== exp.slug && s !== slugAliases[exp.slug])
    .slice(0, 3)
    .map(([s, val]) => ({
      slug: s,
      title: isEn ? val.titleEn : val.titleId,
      category: val.category,
      year: val.year,
      excerpt: isEn ? val.overviewEn : val.overviewId,
    }));

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
            <Link href="/pengalaman" className="hover:text-neutral-900 transition-colors">
              {isEn ? "Experiences" : "Pengalaman"}
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
              <span className="rounded-full bg-[#0D5C4D] border border-[#147A66] px-3.5 py-1 font-mono text-xs font-semibold text-white">
                {exp.year ?? (isEn ? "Experience" : "Pengalaman")}
              </span>
              {categoryTitle && (
                <span className="rounded-full bg-white/10 px-3.5 py-1 font-mono text-xs font-medium text-neutral-200">
                  {categoryTitle}
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
                    {isEn ? "Experience Highlights" : "Sorotan Pengalaman"}
                  </h2>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {exp.metrics.map((m, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-neutral-100 bg-neutral-50/80 p-5 shadow-xs"
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

              {/* Overview / Description */}
              {t?.description && (
                <div className="space-y-4">
                  <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#0D5C4D]">
                    {isEn ? "01 — Overview & Context" : "01 — Gambaran Umum & Konteks"}
                  </h2>
                  <div className="prose prose-neutral max-w-none text-neutral-700 leading-relaxed space-y-4 text-base">
                    {t.description.split("\n\n").map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Methodology / Pendekatan */}
              {t?.methodology && (
                <div className="space-y-4 rounded-2xl border border-neutral-100 bg-neutral-50/50 p-6 sm:p-8">
                  <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#D96B27]">
                    {isEn ? "02 — Approach & Methodology" : "02 — Pendekatan & Metodologi"}
                  </h2>
                  <div className="text-neutral-700 leading-relaxed text-sm sm:text-base space-y-3">
                    {t.methodology.split("\n\n").map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Impact / Dampak & Pembelajaran */}
              {t?.impact && (
                <div className="space-y-4 rounded-2xl border border-[#0D5C4D]/15 bg-[#F5FAF8] p-6 sm:p-8">
                  <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#0D5C4D]">
                    {isEn ? "03 — Impact & Outcomes" : "03 — Dampak & Pembelajaran"}
                  </h2>
                  <div className="text-neutral-700 leading-relaxed text-sm sm:text-base space-y-3">
                    {t.impact.split("\n\n").map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* PDF Documentation & Report */}
              {/* PDF Documentation & Report (Optional) */}
              {(() => {
                const pdfMedia = exp.gallery.find(
                  (g) =>
                    g.media?.mimeType === "application/pdf" ||
                    g.media?.type === "DOCUMENT" ||
                    g.media?.filename?.toLowerCase().endsWith(".pdf") ||
                    g.media?.url?.toLowerCase().endsWith(".pdf")
                );
                const attachedPdfUrl = pdfMedia?.media?.url;
                if (!attachedPdfUrl) return null;

                return (
                  <div className="pt-2">
                    <PdfDocumentCard
                      title={pdfMedia?.media?.originalName || `${title} (Brief & Case Study)`}
                      pdfUrl={attachedPdfUrl}
                      category={categoryTitle || (isEn ? "Field Experience" : "Dokumen Pengalaman")}
                      fileSize="PDF Document"
                      description={
                        t?.excerpt ??
                        (isEn
                          ? "Official project summary detailing methodology, community participation, and outcomes."
                          : "Ringkasan resmi proyek yang memuat metodologi, partisipasi masyarakat, dan capaian lapangan.")
                      }
                      lang={lang as "ID" | "EN"}
                    />
                  </div>
                );
              })()}
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-4 space-y-8">
              {/* Project Quick Facts Card */}
              <div className="rounded-2xl border border-neutral-200/80 bg-neutral-50/60 p-6 space-y-5">
                <h3 className="font-heading text-sm font-bold text-neutral-900 uppercase tracking-wider">
                  {isEn ? "Quick Facts" : "Informasi Ringkas"}
                </h3>
                <dl className="space-y-4 text-xs">
                  {exp.year && (
                    <div className="flex justify-between border-b border-neutral-200/60 pb-3">
                      <dt className="text-neutral-500 font-mono">{isEn ? "Year" : "Tahun"}</dt>
                      <dd className="font-semibold text-neutral-900">{exp.year}</dd>
                    </div>
                  )}
                  {categoryTitle && (
                    <div className="flex justify-between border-b border-neutral-200/60 pb-3">
                      <dt className="text-neutral-500 font-mono">{isEn ? "Category" : "Kategori"}</dt>
                      <dd className="font-semibold text-neutral-900 text-right">{categoryTitle}</dd>
                    </div>
                  )}
                  {exp.location && (
                    <div className="flex justify-between border-b border-neutral-200/60 pb-3">
                      <dt className="text-neutral-500 font-mono">{isEn ? "Location" : "Lokasi"}</dt>
                      <dd className="font-semibold text-neutral-900 text-right">{exp.location}</dd>
                    </div>
                  )}
                  {exp.clientName && (
                    <div className="flex justify-between border-b border-neutral-200/60 pb-3">
                      <dt className="text-neutral-500 font-mono">{isEn ? "Partner" : "Mitra/Klien"}</dt>
                      <dd className="font-semibold text-neutral-900 text-right">{exp.clientName}</dd>
                    </div>
                  )}
                </dl>

                <div className="pt-2">
                  <Link
                    href="/kolaborasi"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0D5C4D] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#116958]"
                  >
                    <span>{isEn ? "Collaborate on a Project" : "Ajukan Kolaborasi"}</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              {/* Working Framework Reminder */}
              <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 space-y-3">
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#0D5C4D]">
                  ANTRABUMI WORKING FRAMEWORK
                </p>
                <p className="font-heading text-xs font-bold text-neutral-900">
                  {isEn
                    ? "01 LISTEN · 02 CONNECT · 03 CO-CREATE · 04 ACT · 05 LEARN"
                    : "01 LISTEN · 02 CONNECT · 03 CO-CREATE · 04 ACT · 05 LEARN"}
                </p>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {isEn
                    ? '"Every collaboration begins with understanding context, not offering solutions."'
                    : '"Setiap kolaborasi dimulai dari memahami konteks, bukan menawarkan solusi."'}
                </p>
              </div>

              {/* Back to All Experiences Link */}
              <div>
                <Link
                  href="/pengalaman"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#0D5C4D] hover:underline"
                >
                  <span>←</span>
                  <span>{isEn ? "Back to all experiences" : "Kembali ke semua pengalaman"}</span>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Related / Other Experiences Section */}
      {otherExperiences.length > 0 && (
        <section className="border-t border-neutral-100 bg-neutral-50/50 py-14 sm:py-18">
          <Container size="default">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-widest text-[#0D5C4D]">
                  {isEn ? "Other Experiences" : "Pengalaman Lainnya"}
                </p>
                <h2 className="font-heading text-xl font-bold text-neutral-950 mt-1">
                  {isEn ? "Explore more field experiences" : "Jelajahi pengalaman lapangan lainnya"}
                </h2>
              </div>
              <Link
                href="/pengalaman"
                className="text-xs font-semibold text-[#0D5C4D] hover:underline hidden sm:inline-block"
              >
                {isEn ? "View all →" : "Lihat semua →"}
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otherExperiences.map((item) => (
                <Link
                  key={item.slug}
                  href={`/pengalaman/${item.slug}`}
                  className="group flex flex-col justify-between rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-xs transition hover:-translate-y-1 hover:border-[#0D5C4D]/30 hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between text-neutral-400 text-xs font-mono mb-2">
                      <span className="font-bold text-[#0D5C4D]">{item.category}</span>
                      <span>{item.year}</span>
                    </div>
                    <h3 className="font-heading text-base font-bold text-neutral-900 group-hover:text-[#0D5C4D] transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                      {item.excerpt}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#0D5C4D]">
                    <span>{isEn ? "Read details" : "Lihat selengkapnya"}</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
