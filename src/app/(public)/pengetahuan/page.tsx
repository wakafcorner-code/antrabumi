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
    orderBy: { publishedAt: "desc" },
    take: 24,
    select: {
      id: true,
      slug: true,
      type: true,
      publishedAt: true,
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
        const t =
          item.translations.find((tr) => tr.language === lang) ??
          item.translations.find((tr) => tr.language === "ID") ??
          item.translations[0];
        return {
          id: item.id,
          slug: item.slug,
          type: item.type,
          publishedAt: item.publishedAt ? item.publishedAt.toISOString() : null,
          coverMedia: item.coverMedia
            ? { url: item.coverMedia.url ?? null, altText: item.coverMedia.altText ?? null }
            : null,
          title: t?.title ?? item.slug,
          excerpt: t?.excerpt ?? null,
        };
      });
    }
  } catch {
    items = [];
  }

  return <PengetahuanClient initialItems={items} lang={lang} />;
}
