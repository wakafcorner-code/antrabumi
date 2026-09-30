import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { PdfDocumentCard } from "@/components/ui/PdfDocumentCard";
import { prisma } from "@/lib/db/prisma";
import { ContentStatus, KnowledgeType } from "@prisma/client";
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

      {/* Cover image */}
      {item.coverMedia?.url && (
        <section className="border-b border-neutral-100 bg-neutral-50 py-8">
          <Container size="reading">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-sm">
              <Image
                src={item.coverMedia.url}
                alt={item.coverMedia.altText ?? t?.title ?? ""}
                fill
                className="object-cover"
                priority
              />
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

      {/* Downloads / PDF Documents — Only shown when PDF is attached (optional) */}
      {item.downloadableMedia.length > 0 && (
        <section className="border-t border-neutral-100 bg-[#FBF9F4] py-12 sm:py-16">
          <Container size="reading">
            <div className="mb-6 space-y-1">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0D5C4D]">
                {isEn ? "OFFICIAL PUBLICATION & DOCUMENT" : "DOKUMEN & PUBLIKASI RESMI"}
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-neutral-950">
                {isEn ? "Document Download & Preview" : "Berkas Unduhan & Pratinjau Dokumen"}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600">
                {isEn
                  ? "Access the full briefing, methodology, or assessment paper in PDF format."
                  : "Akses naskah lengkap, ringkasan eksekutif, dan metodologi dalam format PDF."}
              </p>
            </div>

            <div className="space-y-4">
              {item.downloadableMedia.map((d, i) => (
                <PdfDocumentCard
                  key={i}
                  title={d.label || d.media.originalName || d.media.filename}
                  pdfUrl={d.media.url ?? ""}
                  category={typeLabel}
                  fileSize="PDF Document"
                  description={t?.excerpt ?? undefined}
                  lang={lang as "ID" | "EN"}
                />
              ))}
            </div>
          </Container>
        </section>
      )}

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
