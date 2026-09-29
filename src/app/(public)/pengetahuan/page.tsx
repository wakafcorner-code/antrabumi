import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { ContentStatus } from "@prisma/client";
import { getLanguage } from "@/lib/i18n/language";
import { PengetahuanClient, DisplayKnowledge } from "./PengetahuanClient";

export const metadata: Metadata = {
  title: "Pengetahuan — ANTRABUMI",
  description:
    "Arsip pengetahuan ANTRABUMI: riset, laporan, asesmen, artikel, dan wawasan dari lapangan yang dapat diakses publik.",
};

export const dynamic = "force-dynamic";

async function getKnowledge() {
  return prisma.knowledge.findMany({
    where: { status: ContentStatus.PUBLISHED },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: 50,
    select: {
      id: true,
      slug: true,
      type: true,
      featured: true,
      authorName: true,
      publicationDate: true,
      publishedAt: true,
      createdAt: true,
      coverMedia: { select: { url: true, altText: true } },
      translations: {
        select: { title: true, excerpt: true, language: true },
      },
    },
  });
}

export default async function PengetahuanPage() {
  const lang = await getLanguage();
  let items: DisplayKnowledge[] = [];

  try {
    const dbItems = await getKnowledge();
    if (dbItems.length > 0) {
      items = dbItems.map((item) => {
        // Robust translation matching: language -> ID fallback -> first non-empty -> slug
        const tLang = item.translations.find((tr) => tr.language === lang && tr.title?.trim());
        const tId = item.translations.find((tr) => tr.language === "ID" && tr.title?.trim());
        const tAny = item.translations.find((tr) => tr.title?.trim());
        const t = tLang ?? tId ?? tAny ?? item.translations[0];

        const title = t?.title?.trim() || item.slug;
        const excerpt = t?.excerpt?.trim() || null;
        const displayDate = item.publishedAt || item.publicationDate || item.createdAt;

        return {
          id: item.id,
          slug: item.slug,
          type: item.type,
          featured: item.featured,
          authorName: item.authorName,
          publishedAt: displayDate ? displayDate.toISOString() : null,
          coverMedia: item.coverMedia?.url
            ? { url: item.coverMedia.url, altText: item.coverMedia.altText ?? title }
            : null,
          title,
          excerpt,
        };
      });
    }
  } catch (err) {
    console.error("Failed to load knowledge items:", err);
    items = [];
  }

  return <PengetahuanClient initialItems={items} lang={lang} />;
}
