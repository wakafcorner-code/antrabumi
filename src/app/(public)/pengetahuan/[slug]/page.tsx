import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SocialShare } from "@/components/ui/SocialShare";
import { ImageSlider } from "@/components/ui/ImageSlider";
import { prisma } from "@/lib/db/prisma";
import { ContentStatus } from "@prisma/client";
import { getLanguage } from "@/lib/i18n/language";

interface Props {
  params: Promise<{ slug: string }>;
}

const typeLabelsId: Record<string, string> = {
  ARTICLE: "Artikel",
  RESEARCH_PUBLICATION: "Riset & Publikasi",
  STORY: "Cerita Lapangan",
};

const typeLabelsEn: Record<string, string> = {
  ARTICLE: "Article",
  RESEARCH_PUBLICATION: "Research & Publication",
  STORY: "Field Story",
};

async function getKnowledge(slug: string) {
  return prisma.knowledge.findUnique({
    where: { slug, status: ContentStatus.PUBLISHED },
    select: {
      id: true,
      slug: true,
      type: true,
      authorName: true,
      publicationDate: true,
      publishedAt: true,
      coverMedia: { select: { url: true, altText: true } },
      translations: {
        select: { title: true, excerpt: true, content: true, language: true },
      },
      downloadableMedia: {
        select: { label: true, media: { select: { url: true, originalName: true, filename: true } } },
        orderBy: { order: "asc" },
      },
      gallery: { include: { media: { select: { id: true, url: true, originalName: true } } }, orderBy: { order: "asc" } },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getKnowledge(slug);
  if (!item) return { title: "Tidak Ditemukan — ANTRABUMI" };

  const lang = await getLanguage();
  const t =
    item.translations.find((tr) => tr.language === lang && tr.title?.trim()) ??
    item.translations.find((tr) => tr.language === "ID" && tr.title?.trim()) ??
    item.translations[0];
  return {
    title: t?.title ? `${t.title} — Pengetahuan ANTRABUMI` : `${slug} — ANTRABUMI`,
    description: t?.excerpt ?? undefined,
    openGraph: {
      title: t?.title ?? slug,
      description: t?.excerpt ?? "Pengetahuan dan pembelajaran ANTRABUMI.",
      images: item.coverMedia?.url ? [{ url: item.coverMedia.url }] : undefined,
    },
  };
}

export default async function KnowledgeDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = await getKnowledge(slug);

  if (!item) notFound();

  const lang = await getLanguage();
  const isEn = lang === "EN";
  const tLang = item.translations.find((tr) => tr.language === lang && tr.title?.trim());
  const tId = item.translations.find((tr) => tr.language === "ID" && tr.title?.trim());
  const t = tLang ?? tId ?? item.translations[0];

  const content = (tLang?.content && tLang.content !== "<p></p>") ? tLang.content : (tId?.content ?? t?.content);
  const typeMap = isEn ? typeLabelsEn : typeLabelsId;
  const typeLabel = typeMap[item.type] ?? item.type;
  const rawDate = item.publicationDate || item.publishedAt;
  const pubDate = rawDate
    ? new Date(rawDate).toLocaleDateString(isEn ? "en-US" : "id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;
  const downloadable = item.downloadableMedia.find((attachment) => attachment.media.url);
  const downloadUrl = downloadable?.media.url;
  const hasVisuals = Boolean(item.coverMedia?.url) || item.gallery.some((image) => image.media.url);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="border-b border-neutral-100 bg-neutral-50/80 py-3.5 backdrop-blur-sm">
        <Container size="default">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-neutral-500">
            <Link href="/" className="hover:text-neutral-900 transition-colors">
              {isEn ? "Home" : "Beranda"}
            </Link>
            <span className="text-neutral-300">/</span>
            <Link href="/pengetahuan" className="hover:text-neutral-900 transition-colors">
              {isEn ? "Knowledge" : "Pengetahuan"}
            </Link>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-800 font-medium truncate max-w-xs sm:max-w-md">
              {t?.title ?? item.slug}
            </span>
          </nav>
        </Container>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-neutral-100 bg-[#0B1E1A] py-16 sm:py-24 text-white">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0D5C4D_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#0D5C4D]/25 blur-3xl pointer-events-none" />

        <Container size="reading">
          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#0D5C4D] border border-[#147A66] px-3 py-1 font-mono text-xs font-semibold text-white">
                {typeLabel}
              </span>
              {pubDate && (
                <span className="text-xs text-neutral-300 font-mono" suppressHydrationWarning>
                  {pubDate}
                </span>
              )}
              {item.authorName && (
                <span className="text-xs text-neutral-300 font-mono">
                  · {isEn ? `By ${item.authorName}` : `Oleh ${item.authorName}`}
                </span>
              )}
            </div>

            <h1 className="font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl text-white">
              {t?.title ?? slug}
            </h1>

            {t?.excerpt && (
              <p className="text-lg leading-relaxed text-neutral-200 sm:text-xl font-light">
                {t.excerpt}
              </p>
            )}
          </div>
        </Container>
      </section>

      {(hasVisuals || downloadUrl) && (
        <section className="relative overflow-hidden border-b border-neutral-100 bg-[#F4F5F0] py-10 sm:py-16">
          <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-[#0D5C4D]/5 blur-3xl" />
          <Container size="default">
            <div className="relative z-10 mb-7 flex flex-col gap-3 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-1">
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#0D5C4D] sm:text-xs">
                  {downloadUrl
                    ? isEn ? "OFFICIAL PUBLICATION & DOCUMENT" : "DOKUMEN & PUBLIKASI RESMI"
                    : isEn ? "FIELD DOCUMENTATION" : "DOKUMENTASI VISUAL"}
                </span>
                <h2 className="font-heading text-2xl font-bold tracking-tight text-neutral-950 sm:text-3xl">
                  {downloadUrl
                    ? isEn ? "Document Download & Preview" : "Berkas Unduhan & Pratinjau Dokumen"
                    : isEn ? "Project Gallery" : "Galeri Kegiatan"}
                </h2>
                {downloadUrl && (
                  <p className="max-w-2xl text-xs leading-relaxed text-neutral-600 sm:text-sm">
                    {isEn
                      ? "Access the full briefing, methodology, or assessment paper in PDF format."
                      : "Akses naskah lengkap, ringkasan eksekutif, dan metodologi dalam format PDF."}
                  </p>
                )}
              </div>
              <span className="w-fit rounded-full border border-[#0D5C4D]/15 bg-white/70 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#0D5C4D]">
                ANTRABUMI · {typeLabel}
              </span>
            </div>

            <div
              className={`relative z-10 ${hasVisuals && downloadUrl ? "grid grid-cols-1 items-start gap-5 lg:grid-cols-2 lg:gap-7" : "mx-auto max-w-4xl"}`}
            >
              {hasVisuals && (
                <div className="rounded-2xl border border-neutral-200/80 bg-white p-2 shadow-[0_14px_35px_-20px_rgba(15,47,39,0.35)] sm:p-3">
                  <div className="mb-3 flex items-center justify-between px-1 sm:px-2">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-400">01 / Visual</span>
                    <span className="text-[10px] font-medium text-neutral-400">{isEn ? "Gallery" : "Galeri"}</span>
                  </div>
                  <ImageSlider
                    images={[
                      ...(item.coverMedia?.url ? [{ id: "cover", url: item.coverMedia.url, alt: item.coverMedia.altText ?? t?.title }] : []),
                      ...item.gallery
                        .filter((image) => image.media.url)
                        .map((image) => ({ id: image.media.id, url: image.media.url!, alt: image.media.originalName })),
                    ]}
                    label={t?.title ?? item.slug}
                  />
                </div>
              )}

              {downloadable && downloadUrl && (
                <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-[0_14px_35px_-20px_rgba(15,47,39,0.35)]">
                  <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3 sm:px-5">
                    <div>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-400">02 / PDF</span>
                      <p className="mt-0.5 max-w-[220px] truncate text-xs font-semibold text-neutral-800">{downloadable.label || downloadable.media.originalName || "Dokumen PDF"}</p>
                    </div>
                    <span className="rounded-md bg-red-50 px-2 py-1 font-mono text-[10px] font-bold text-red-600">PDF</span>
                  </div>
                  <iframe
                    src={`${downloadUrl}#toolbar=0&view=FitH`}
                    title={downloadable.label || downloadable.media.originalName || "Pratinjau PDF"}
                    className="h-[500px] w-full bg-neutral-100 sm:h-[640px]"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 p-4 sm:p-5">
                    <p className="min-w-0 truncate text-[11px] font-medium text-neutral-500">{downloadable.media.filename}</p>
                    <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-lg bg-[#0D5C4D] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#116958]">
                      {isEn ? "Open / Download" : "Buka / Unduh"}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* Content body */}
      {content && (
        <section className="bg-white py-14 sm:py-20">
          <Container size="reading">
            <div
              className="prose prose-neutral max-w-none text-base sm:text-lg leading-relaxed text-neutral-800 prose-headings:font-heading prose-headings:font-bold prose-headings:text-neutral-950 prose-a:text-[#0D5C4D] prose-a:font-semibold hover:prose-a:text-[#116958]"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </Container>
        </section>
      )}

      <section className="border-t border-neutral-100 bg-white py-8 sm:py-10">
        <Container size="reading">
          <SocialShare
            url={`/pengetahuan/${item.slug}`}
            title={t?.title ?? item.slug}
            text={t?.excerpt ?? undefined}
            label={isEn ? "Share this publication" : "Bagikan publikasi ini"}
          />
        </Container>
      </section>

      {/* Bottom Navigation & CTA */}
      <section className="border-t border-neutral-100 bg-white py-12">
        <Container size="reading">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/pengetahuan"
              className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              <span>←</span>
              <span>{isEn ? "Back to all knowledge" : "Kembali ke arsip pengetahuan"}</span>
            </Link>

            <Link
              href="/kolaborasi#kontak"
              className="inline-flex h-11 items-center rounded-xl bg-gradient-to-r from-[#0D5C4D] via-[#116958] to-[#147A66] px-6 text-xs font-semibold text-white shadow-md shadow-[#0D5C4D]/25 transition-all hover:shadow-lg hover:shadow-[#0D5C4D]/35 hover:-translate-y-0.5"
            >
              {isEn ? "Discuss This Research" : "Diskusikan Riset Ini"}
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
