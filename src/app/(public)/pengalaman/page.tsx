import React from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/db/prisma";
import { ContentStatus } from "@prisma/client";
import { getLanguage } from "@/lib/i18n/language";
import { PengalamanClient, type DisplayPengalaman } from "./PengalamanClient";

export const metadata: Metadata = {
  title: "Pengalaman — ANTRABUMI",
  description:
    "Kumpulan pengalaman lapangan ANTRABUMI di berbagai konteks — menghubungkan riset, asesmen, dan aksi di tingkat komunitas untuk melahirkan pendekatan yang berakar kuat pada realitas.",
  openGraph: {
    title: "Pengalaman — ANTRABUMI",
    description:
      "Pengalaman dan inisiatif ANTRABUMI: asesmen, pelatihan, pengembangan program, dan kolaborasi lapangan.",
    url: "https://www.antrabumi.org/pengalaman",
    siteName: "ANTRABUMI",
    locale: "id_ID",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

async function getExperiences() {
  return prisma.experience.findMany({
    where: { status: ContentStatus.PUBLISHED, type: "EXPERIENCE" },
    orderBy: [{ featured: "desc" }, { year: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      slug: true,
      year: true,
      featured: true,
      clientName: true,
      location: true,
      coverMedia: { select: { url: true, altText: true } },
      translations: {
        select: { title: true, excerpt: true, language: true },
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
    },
  });
}

// Source-supported static fallback (AGENTS.md §15)
const staticExperiences: DisplayPengalaman[] = [
  {
    id: "s1",
    slug: "indonesia-digital-ecosystem-assessment-idea",
    year: 2024,
    featured: false,
    clientName: null,
    location: null,
    category: "Research & Assessment",
    coverMedia: null,
    title: "Indonesia Digital Ecosystem Assessment — IDEA",
    excerpt:
      "Asesmen ekosistem digital nasional yang menghubungkan temuan lapangan, regulasi, dan kesiapan pemangku kepentingan.",
  },
  {
    id: "s2",
    slug: "perencanaan-pengelolaan-ekowisata-desa",
    year: 2023,
    featured: true,
    clientName: null,
    location: "Belitung",
    category: "Konservasi & Lanskap",
    coverMedia: null,
    title: "Perencanaan Pengelolaan Ekowisata Desa",
    excerpt:
      "Pendampingan penyusunan rencana kelola ekowisata berbasis partisipasi masyarakat dan prinsip keberlanjutan lokal.",
  },
  {
    id: "s3",
    slug: "assessment-training-for-community-development",
    year: 2023,
    featured: false,
    clientName: null,
    location: null,
    category: "Community Development",
    coverMedia: null,
    title: "Assessment Training for Community Development",
    excerpt:
      "Pelatihan metodologi asesmen kontekstual untuk pemberdayaan masyarakat dan identifikasi potensi lokal.",
  },
  {
    id: "s4",
    slug: "assessment-pengembangan-batik-ekologis",
    year: 2022,
    featured: false,
    clientName: null,
    location: null,
    category: "Research & Assessment",
    coverMedia: null,
    title: "Assessment Pengembangan Batik Ekologis",
    excerpt:
      "Kajian rantai nilai, pewarna alami, dan potensi pelestarian tradisi batik ramah lingkungan.",
  },
  {
    id: "s5",
    slug: "prototyping-pengelolaan-sampah-pasar-tradisional",
    year: 2022,
    featured: false,
    clientName: null,
    location: null,
    category: "Conservation, Climate & Sustainability",
    coverMedia: null,
    title: "Prototyping Pengelolaan Sampah Pasar Tradisional",
    excerpt:
      "Eksperimen pengelolaan dan reduksi sampah organik dan anorganik berbasis keterlibatan pedagang pasar.",
  },
];

export default async function PengalamanPage() {
  const lang = await getLanguage();
  let experiences: DisplayPengalaman[] = [];

  try {
    const dbExp = await getExperiences();
    if (dbExp.length > 0) {
      experiences = dbExp.map((e) => {
        const t =
          e.translations.find((tr) => tr.language === lang) ??
          e.translations.find((tr) => tr.language === "ID") ??
          e.translations[0];
        const caTrans = e.contributionAreas?.[0]?.contributionArea?.translations;
        const matchedCategory =
          caTrans?.find((c) => c.language === lang)?.title ??
          caTrans?.find((c) => c.language === "ID")?.title ??
          caTrans?.[0]?.title ??
          null;

        return {
          id: e.id,
          slug: e.slug,
          year: e.year ?? new Date().getFullYear(),
          featured: e.featured,
          clientName: e.clientName,
          location: e.location,
          category: matchedCategory,
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

  return <PengalamanClient initialExperiences={experiences} lang={lang} />;
}
