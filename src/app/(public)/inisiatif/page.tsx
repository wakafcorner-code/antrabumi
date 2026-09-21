import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { ContentStatus } from "@prisma/client";
import { getLanguage } from "@/lib/i18n/language";
import { InisiatifClient, DisplayExperience } from "./InisiatifClient";

export const metadata: Metadata = {
  title: "Inisiatif — ANTRABUMI",
  description:
    "Pengalaman dan inisiatif ANTRABUMI: asesmen, pelatihan, pengembangan program, dan kolaborasi lapangan di berbagai konteks.",
};

export const dynamic = "force-dynamic";

async function getExperiences() {
  return prisma.experience.findMany({
    where: { status: ContentStatus.PUBLISHED, type: "INITIATIVE" },
    orderBy: { year: "desc" },
    take: 20,
    select: {
      id: true,
      slug: true,
      year: true,
      coverMedia: { select: { url: true, altText: true } },
      translations: {
        select: { title: true, excerpt: true, language: true },
      },
    },
  });
}

// Source-supported static fallback (AGENTS.md §15)
const staticExperiences: DisplayExperience[] = [
  {
    id: "s1",
    slug: "indonesia-digital-ecosystem-assessment-idea",
    year: 2024,
    coverMedia: null,
    title: "Indonesia Digital Ecosystem Assessment — IDEA",
    excerpt: "Asesmen ekosistem digital nasional yang menghubungkan temuan lapangan, regulasi, dan kesiapan pemangku kepentingan.",
  },
  {
    id: "s2",
    slug: "perencanaan-pengelolaan-ekowisata-desa",
    year: 2023,
    coverMedia: null,
    title: "Perencanaan Pengelolaan Ekowisata Desa",
    excerpt: "Pendampingan penyusunan rencana kelola ekowisata berbasis partisipasi masyarakat dan prinsip keberlanjutan lokal.",
  },
  {
    id: "s3",
    slug: "assessment-training-for-community-development",
    year: 2023,
    coverMedia: null,
    title: "Assessment Training for Community Development",
    excerpt: "Pelatihan metodologi asesmen kontekstual untuk pemberdayaan masyarakat dan identifikasi potensi lokal.",
  },
  {
    id: "s4",
    slug: "assessment-pengembangan-batik-ekologis",
    year: 2022,
    coverMedia: null,
    title: "Assessment Pengembangan Batik Ekologis",
    excerpt: "Kajian rantai nilai, pewarna alami, dan potensi pelestarian tradisi batik ramah lingkungan.",
  },
  {
    id: "s5",
    slug: "prototyping-pengelolaan-sampah-pasar-tradisional",
    year: 2022,
    coverMedia: null,
    title: "Prototyping Pengelolaan Sampah Pasar Tradisional",
    excerpt: "Eksperimen pengelolaan dan reduksi sampah organik dan anorganik berbasis keterlibatan pedagang pasar.",
  },
];

export default async function InisiatifPage() {
  const lang = await getLanguage();
  let experiences: DisplayExperience[] = [];

  try {
    const dbExp = await getExperiences();
    if (dbExp.length > 0) {
      experiences = dbExp.map((e) => {
        const t =
          e.translations.find((tr) => tr.language === lang) ??
          e.translations.find((tr) => tr.language === "ID") ??
          e.translations[0];
        return {
          id: e.id,
          slug: e.slug,
          year: e.year ?? new Date().getFullYear(),
          coverMedia: e.coverMedia
            ? { url: e.coverMedia.url ?? null, altText: e.coverMedia.altText ?? null }
            : null,
          title: t?.title ?? e.slug,
          excerpt: t?.excerpt ?? null,
        };
      });
    } else {
      experiences = staticExperiences;
    }
  } catch {
    experiences = staticExperiences;
  }

  return <InisiatifClient initialExperiences={experiences} lang={lang} />;
}
