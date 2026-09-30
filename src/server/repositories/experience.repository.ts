/**
 * src/server/repositories/experience.repository.ts
 *
 * Data access for Experience entities.
 * All queries return plain objects — no business logic.
 */

import { prisma } from "@/lib/db/prisma";
import {
  ContentStatus,
  Language,
  Prisma,
} from "@prisma/client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ExperienceListItem {
  id: string;
  slug: string;
  type: string;
  status: ContentStatus;
  year: number | null;
  category: string | null;
  clientName: string | null;
  location: string | null;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  titleId: string | null;
  titleEn: string | null;
  pdfUrl?: string | null;
  pdfFilename?: string | null;
  coverMediaUrl?: string | null;
  coverMediaAlt?: string | null;
}

export interface ExperienceDetail {
  id: string;
  slug: string;
  type: string;
  status: ContentStatus;
  year: number | null;
  category: string | null;
  clientName: string | null;
  location: string | null;
  featured: boolean;
  coverMediaId: string | null;
  coverMedia?: { id: string; url: string | null; altText: string | null } | null;
  createdAt: Date;
  updatedAt: Date;
  translations: Array<{
    language: string;
    title: string;
    excerpt: string | null;
    description: string | null;
    methodology: string | null;
    impact: string | null;
  }>;
  metrics: Array<{
    id: string;
    label: string;
    value: string;
    order: number;
  }>;
  pdfAttachments?: Array<{
    id: string;
    label?: string | null;
    mediaId: string;
    url: string;
    filename: string;
    size?: number | null;
  }>;
}

export interface ExperienceListOptions {
  page?: number;
  perPage?: number;
  status?: ContentStatus;
  search?: string;
  type?: string;
}

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

export async function findExperiences(
  opts: ExperienceListOptions = {}
): Promise<{ items: ExperienceListItem[]; total: number }> {
  const { page = 1, perPage = 20, status, search, type } = opts;
  const skip = (page - 1) * perPage;

  const where: Prisma.ExperienceWhereInput = {
    ...(type ? { type } : {}),
    ...(status ? { status } : {}),
    ...(search
      ? {
          translations: {
            some: {
              title: { contains: search },
            },
          },
        }
      : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.experience.findMany({
      where,
      skip,
      take: perPage,
      orderBy: [{ year: "desc" }, { createdAt: "desc" }],
      include: {
        translations: {
          select: { language: true, title: true },
        },
        coverMedia: {
          select: { url: true, altText: true },
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
    }),
    prisma.experience.count({ where }),
  ]);

  return {
    total,
    items: items.map((e) => {
      const pdfMedia = e.gallery?.find(
        (g) =>
          g.media?.mimeType === "application/pdf" ||
          g.media?.type === "DOCUMENT" ||
          g.media?.filename?.toLowerCase().endsWith(".pdf") ||
          g.media?.url?.toLowerCase().endsWith(".pdf")
      );

      return {
        id: e.id,
        slug: e.slug,
        type: e.type,
        status: e.status,
        year: e.year,
        category: (e as Record<string, any>).category ?? null,
        clientName: e.clientName,
        location: e.location,
        featured: e.featured,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
        titleId: e.translations.find((t) => t.language === "ID")?.title ?? null,
        titleEn: e.translations.find((t) => t.language === "EN")?.title ?? null,
        pdfUrl: pdfMedia?.media?.url ?? null,
        pdfFilename: pdfMedia?.media?.originalName || pdfMedia?.media?.filename || null,
        coverMediaUrl: e.coverMedia?.url ?? null,
        coverMediaAlt: e.coverMedia?.altText ?? null,
      };
    }),
  };
}

export async function findExperienceById(id: string): Promise<ExperienceDetail | null> {
  const exp = await prisma.experience.findUnique({
    where: { id },
    include: {
      coverMedia: {
        select: { id: true, url: true, altText: true },
      },
      translations: {
        select: {
          language: true,
          title: true,
          excerpt: true,
          description: true,
          methodology: true,
          impact: true,
        },
      },
      metrics: {
        orderBy: { order: "asc" },
        select: { id: true, label: true, value: true, order: true },
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
  if (!exp) return null;

  const pdfAttachments = (exp.gallery ?? [])
    .filter(
      (g) =>
        g.media?.mimeType === "application/pdf" ||
        g.media?.type === "DOCUMENT" ||
        g.media?.filename?.toLowerCase().endsWith(".pdf") ||
        g.media?.url?.toLowerCase().endsWith(".pdf")
    )
    .map((g) => ({
      id: g.mediaId,
      label: g.media.originalName || null,
      mediaId: g.mediaId,
      url: g.media.url ?? "",
      filename: g.media.originalName || g.media.filename || "dokumen.pdf",
      size: g.media.size ? Number(g.media.size) : null,
    }));

  return {
    id: exp.id,
    slug: exp.slug,
    type: exp.type,
    status: exp.status,
    year: exp.year,
    category: (exp as Record<string, any>).category ?? null,
    clientName: exp.clientName,
    location: exp.location,
    featured: exp.featured,
    coverMediaId: exp.coverMediaId,
    coverMedia: exp.coverMedia,
    createdAt: exp.createdAt,
    updatedAt: exp.updatedAt,
    translations: exp.translations,
    metrics: exp.metrics,
    pdfAttachments,
  };
}

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

export interface CreateExperienceInput {
  slug: string;
  type?: string;
  status?: ContentStatus;
  year?: number;
  category?: string;
  client?: string;
  location?: string;
  featured?: boolean;
  coverMediaId?: string;
  titleId: string;
  excerptId?: string;
  bodyId?: string;
  titleEn?: string;
  excerptEn?: string;
  bodyEn?: string;
}

export async function createExperience(input: CreateExperienceInput, userId: string) {
  const isPublished = input.status === ContentStatus.PUBLISHED;

  return prisma.experience.create({
    data: {
      slug: input.slug,
      type: input.type ?? "INITIATIVE",
      status: input.status ?? ContentStatus.DRAFT,
      publishedAt: isPublished ? new Date() : null,
      year: input.year,
      ...((input.category !== undefined ? { category: input.category } : {}) as any),
      clientName: input.client ?? null,
      location: input.location ?? null,
      featured: input.featured ?? false,
      coverMediaId: input.coverMediaId || null,
      createdById: userId,
      updatedById: userId,
      translations: {
        create: [
          {
            language: Language.ID,
            title: input.titleId,
            excerpt: input.excerptId ?? null,
            description: input.bodyId ?? null,
          },
          ...(input.titleEn
            ? [
                {
                  language: Language.EN,
                  title: input.titleEn,
                  excerpt: input.excerptEn ?? null,
                  description: input.bodyEn ?? null,
                },
              ]
            : []),
        ],
      },
    },
  });
}

export interface UpdateExperienceInput extends Partial<CreateExperienceInput> {
  id: string;
}

export async function updateExperience(input: UpdateExperienceInput, userId: string) {
  const { id, titleId, excerptId, bodyId, titleEn, excerptEn, bodyEn, ...core } = input;
  const isNowPublished = core.status === ContentStatus.PUBLISHED;

  return prisma.$transaction(async (tx) => {
    const exp = await tx.experience.update({
      where: { id },
      data: {
        ...(core.slug ? { slug: core.slug } : {}),
        ...(core.type ? { type: core.type } : {}),
        ...(core.status ? { status: core.status } : {}),
        ...(isNowPublished ? { publishedAt: new Date() } : {}),
        ...(core.year !== undefined ? { year: core.year } : {}),
        ...((core.category !== undefined ? { category: core.category ?? null } : {}) as any),
        ...(core.client !== undefined ? { clientName: core.client } : {}),
        ...(core.location !== undefined ? { location: core.location } : {}),
        ...(core.featured !== undefined ? { featured: core.featured } : {}),
        ...(core.coverMediaId !== undefined ? { coverMediaId: core.coverMediaId || null } : {}),
        updatedById: userId,
      },
    });

    if (titleId !== undefined) {
      await tx.experienceTranslation.upsert({
        where: { experienceId_language: { experienceId: id, language: "ID" } },
        create: {
          experienceId: id,
          language: "ID",
          title: titleId,
          excerpt: excerptId ?? null,
          description: bodyId ?? null,
        },
        update: {
          title: titleId,
          excerpt: excerptId ?? null,
          description: bodyId ?? null,
        },
      });
    }

    if (titleEn !== undefined) {
      await tx.experienceTranslation.upsert({
        where: { experienceId_language: { experienceId: id, language: "EN" } },
        create: {
          experienceId: id,
          language: "EN",
          title: titleEn,
          excerpt: excerptEn ?? null,
          description: bodyEn ?? null,
        },
        update: {
          title: titleEn,
          excerpt: excerptEn ?? null,
          description: bodyEn ?? null,
        },
      });
    }

    return exp;
  });
}

export async function updateExperienceStatus(id: string, status: ContentStatus, userId: string) {
  return prisma.experience.update({
    where: { id },
    data: {
      status,
      updatedById: userId,
      ...(status === ContentStatus.PUBLISHED ? { publishedAt: new Date() } : {}),
    },
  });
}

export async function deleteExperience(id: string) {
  return prisma.experience.delete({ where: { id } });
}
