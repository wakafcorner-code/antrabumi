import { notFound } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { Language } from "@prisma/client";
import { KnowledgeEditClient } from "./KnowledgeEditClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const k = await prisma.knowledge.findUnique({
    where: { id },
    include: { translations: { where: { language: Language.ID }, select: { title: true } } },
  });
  return { title: k ? `Edit: ${k.translations[0]?.title ?? k.slug} — ANTRABUMI Admin` : "Edit Konten" };
}

export default async function KnowledgeEditPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch full knowledge record with translations and PDF attachments
  const k = await prisma.knowledge.findUnique({
    where: { id },
    include: {
      coverMedia: { select: { id: true, url: true } },
      translations: {
        select: { language: true, title: true, excerpt: true, content: true },
      },
      downloadableMedia: {
        include: {
          media: {
            select: { id: true, url: true, filename: true, size: true },
          },
        },
        orderBy: { order: "asc" },
      },
      gallery: { include: { media: { select: { id: true, url: true, originalName: true } } }, orderBy: { order: "asc" } },
    },
  });

  if (!k) return notFound();

  const transId = k.translations.find((t) => t.language === Language.ID);
  const transEn = k.translations.find((t) => t.language === Language.EN);

  const pdfAttachments = k.downloadableMedia.map((d) => ({
    id: d.id,
    label: d.label,
    mediaId: d.mediaId,
    url: d.media.url ?? "",
    filename: d.media.filename ?? "document.pdf",
    size: d.media.size ? Number(d.media.size) : null,
  }));

  return (
    <KnowledgeEditClient
      id={k.id}
      slug={k.slug}
      type={k.type}
      status={k.status}
      featured={k.featured}
      authorName={k.authorName}
      coverMediaId={k.coverMediaId}
      coverMediaUrl={k.coverMedia?.url ?? null}
      titleId={transId?.title ?? ""}
      excerptId={transId?.excerpt ?? null}
      bodyId={transId?.content ?? null}
      titleEn={transEn?.title ?? null}
      excerptEn={transEn?.excerpt ?? null}
      bodyEn={transEn?.content ?? null}
      pdfAttachments={pdfAttachments}
      galleryImages={k.gallery.filter((item) => item.media.url).map((item) => ({ id: item.media.id, url: item.media.url!, filename: item.media.originalName }))}
    />
  );
}
