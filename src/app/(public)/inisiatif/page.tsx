import React from "react";
import { Metadata } from "next";
import { getLanguage } from "@/lib/i18n/language";
import { ContentStatus } from "@prisma/client";
import { findExperiences } from "@/server/repositories/experience.repository";
import { InisiatifClient, DisplayInitiative } from "./InisiatifClient";

export const metadata: Metadata = {
  title: "Inisiatif — ANTRABUMI",
  description:
    "Ruang kerja yang menghubungkan alam, masyarakat, pengetahuan, dan perubahan. Kampanye, program proyek lapangan, dan dokumentasi inisiatif bersama mitra.",
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    kategori?: string;
    type?: string;
  }>;
}

export default async function InisiatifPage({ searchParams }: PageProps) {
  const [lang, params, { items: rawItems }] = await Promise.all([
    getLanguage(),
    searchParams,
    findExperiences({ status: ContentStatus.PUBLISHED, perPage: 40 }),
  ]);

  const isEn = lang === "EN";

  const initiatives: DisplayInitiative[] = rawItems.map((item, idx) => {
    const title = (isEn ? item.titleEn : item.titleId) || item.titleId || item.slug;

    // Classify into CAMPAIGN or PROJECT
    const rawCat = (item.category || "").toLowerCase();
    const isCampaign = rawCat.includes("campaign") || rawCat.includes("kampanye") || idx % 2 === 1;
    const categoryType: "CAMPAIGN" | "PROJECT" = isCampaign ? "CAMPAIGN" : "PROJECT";

    return {
      id: item.id,
      slug: item.slug,
      title,
      excerpt: null,
      year: item.year,
      category: item.category || (isCampaign ? "Kampanye / Campaign" : "Proyek / Project"),
      categoryType,
      location: item.location,
      clientName: item.clientName,
      featured: item.featured,
      pdfUrl: item.pdfUrl ?? null,
      pdfLabel: item.pdfUrl ? (item.pdfFilename || `${title} (Brief & Case Study)`) : undefined,
    };
  });

  // Determine initial selected category from URL query
  let initialCategory = "ALL";
  const kat = (params.kategori || params.type || "").toLowerCase();
  if (kat === "campaign" || kat === "kampanye" || kat === "campaigne") {
    initialCategory = "CAMPAIGN";
  } else if (kat === "project" || kat === "proyek") {
    initialCategory = "PROJECT";
  }

  return (
    <InisiatifClient
      lang={lang}
      initiativesData={initiatives}
      initialCategory={initialCategory}
    />
  );
}
