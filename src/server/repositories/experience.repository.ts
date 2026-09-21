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
  clientName: string | null;
  location: string | null;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  titleId: string | null;
  titleEn: string | null;
}

export interface ExperienceDetail {
  id: string;
  slug: string;
  type: string;
  status: ContentStatus;
  year: number | null;
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
          where: { language: "ID" },
          select: { title: true },
        },
      },
    }),
    prisma.experience.count({ where }),
  ]);

  return {
    total,
    items: items.map((e) => ({
      id: e.id,
      slug: e.slug,
      type: e.type,
      status: e.status,
      year: e.year,
      clientName: e.clientName,
      location: e.location,
      featured: e.featured,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
      titleId: e.translations[0]?.title ?? null,
      titleEn: null,
    })),
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
    },
  });
  if (!exp) return null;
  return {
    id: exp.id,
    slug: exp.slug,
    type: exp.type,
    status: exp.status,
    year: exp.year,
    clientName: exp.clientName,
    location: exp.location,
    featured: exp.featured,
    coverMediaId: exp.coverMediaId,
    coverMedia: exp.coverMedia,
    createdAt: exp.createdAt,
    updatedAt: exp.updatedAt,
    translations: exp.translations,
    metrics: exp.metrics,
  };
}

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

export interface CreateExperienceInput {
  slug: string;
  type?: string;
  year?: number;
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
  return prisma.experience.create({
    data: {
      slug: input.slug,
      type: input.type ?? "EXPERIENCE",
      status: ContentStatus.DRAFT,
      year: input.year,
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

  return prisma.$transaction(async (tx) => {
    const exp = await tx.experience.update({
      where: { id },
      data: {
        ...(core.slug ? { slug: core.slug } : {}),
        ...(core.year !== undefined ? { year: core.year } : {}),
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
