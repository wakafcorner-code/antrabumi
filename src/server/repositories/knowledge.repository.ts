/**
 * src/server/repositories/knowledge.repository.ts
 * Data access for Knowledge (articles, reports, publications).
 */

import { prisma } from "@/lib/db/prisma";
import { ContentStatus, KnowledgeType, Language, Prisma } from "@prisma/client";

export interface KnowledgeListItem {
  id: string;
  slug: string;
  type: KnowledgeType;
  status: ContentStatus;
  publishedAt: Date | null;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  titleId: string | null;
}

export interface KnowledgeDetail {
  id: string;
  slug: string;
  type: KnowledgeType;
  status: ContentStatus;
  publishedAt: Date | null;
  featured: boolean;
  coverMediaId: string | null;
  coverMedia?: { id: string; url: string | null; altText: string | null } | null;
  authorName: string | null;
  createdAt: Date;
  updatedAt: Date;
  translations: Array<{
    language: string;
    title: string;
    excerpt: string | null;
    content: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
  }>;
  tags: Array<{ tag: { id: string; slug: string; name: string } }>;
  categories: Array<{ category: { id: string; slug: string; name: string } }>;
}

export interface KnowledgeListOptions {
  page?: number;
  perPage?: number;
  status?: ContentStatus;
  search?: string;
  type?: KnowledgeType;
}

export async function findKnowledge(
  opts: KnowledgeListOptions = {}
): Promise<{ items: KnowledgeListItem[]; total: number }> {
  const { page = 1, perPage = 20, status, search, type } = opts;
  const skip = (page - 1) * perPage;

  const where: Prisma.KnowledgeWhereInput = {
    ...(status ? { status } : {}),
    ...(type ? { type } : {}),
    ...(search
      ? { translations: { some: { title: { contains: search } } } }
      : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.knowledge.findMany({
      where,
      skip,
      take: perPage,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      include: {
        translations: {
          where: { language: "ID" },
          select: { title: true },
        },
      },
    }),
    prisma.knowledge.count({ where }),
  ]);

  return {
    total,
    items: items.map((k) => ({
      id: k.id,
      slug: k.slug,
      type: k.type,
      status: k.status,
      publishedAt: k.publishedAt,
      featured: k.featured,
      createdAt: k.createdAt,
      updatedAt: k.updatedAt,
      titleId: k.translations[0]?.title ?? null,
    })),
  };
}

export async function findKnowledgeById(id: string): Promise<KnowledgeDetail | null> {
  const k = await prisma.knowledge.findUnique({
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
          content: true,
          seoTitle: true,
          seoDescription: true,
        },
      },
      tags: { include: { tag: { select: { id: true, slug: true, name: true } } } },
      categories: { include: { category: { select: { id: true, slug: true, name: true } } } },
    },
  });
  if (!k) return null;
  return {
    id: k.id,
    slug: k.slug,
    type: k.type,
    status: k.status,
    publishedAt: k.publishedAt,
    featured: k.featured,
    coverMediaId: k.coverMediaId,
    coverMedia: k.coverMedia,
    authorName: k.authorName,
    createdAt: k.createdAt,
    updatedAt: k.updatedAt,
    translations: k.translations,
    tags: k.tags,
    categories: k.categories,
  };
}

export interface CreateKnowledgeInput {
  slug: string;
  type?: KnowledgeType;
  status?: ContentStatus;
  authorName?: string | null;
  publicationDate?: string | Date | null;
  featured?: boolean;
  coverMediaId?: string | null;
  titleId: string;
  excerptId?: string | null;
  bodyId?: string | null;
  titleEn?: string | null;
  excerptEn?: string | null;
  bodyEn?: string | null;
}

export async function createKnowledge(input: CreateKnowledgeInput, userId: string) {
  const pubDate = input.publicationDate ? new Date(input.publicationDate) : null;
  const isPublished = input.status === ContentStatus.PUBLISHED;

  return prisma.knowledge.create({
    data: {
      slug: input.slug,
      type: input.type ?? KnowledgeType.ARTICLE,
      status: input.status ?? ContentStatus.DRAFT,
      authorName: input.authorName || null,
      publicationDate: pubDate ?? (isPublished ? new Date() : null),
      publishedAt: isPublished ? (pubDate ?? new Date()) : null,
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
            content: input.bodyId ?? null,
          },
          ...(input.titleEn?.trim()
            ? [
                {
                  language: Language.EN,
                  title: input.titleEn.trim(),
                  excerpt: input.excerptEn ?? null,
                  content: input.bodyEn ?? null,
                },
              ]
            : []),
        ],
      },
    },
  });
}

export interface UpdateKnowledgeInput extends Partial<CreateKnowledgeInput> {
  id: string;
}

export async function updateKnowledge(input: UpdateKnowledgeInput, userId: string) {
  const { id, titleId, excerptId, bodyId, titleEn, excerptEn, bodyEn, ...core } = input;
  const pubDate = core.publicationDate ? new Date(core.publicationDate) : undefined;
  const isNowPublished = core.status === ContentStatus.PUBLISHED;

  return prisma.$transaction(async (tx) => {
    const k = await tx.knowledge.update({
      where: { id },
      data: {
        ...(core.slug ? { slug: core.slug } : {}),
        ...(core.type ? { type: core.type } : {}),
        ...(core.status ? { status: core.status } : {}),
        ...(core.authorName !== undefined ? { authorName: core.authorName || null } : {}),
        ...(pubDate !== undefined ? { publicationDate: pubDate } : {}),
        ...(isNowPublished ? { publishedAt: new Date() } : {}),
        ...(core.featured !== undefined ? { featured: core.featured } : {}),
        ...(core.coverMediaId !== undefined ? { coverMediaId: core.coverMediaId || null } : {}),
        updatedById: userId,
      },
    });

    if (titleId !== undefined) {
      await tx.knowledgeTranslation.upsert({
        where: { knowledgeId_language: { knowledgeId: id, language: Language.ID } },
        create: {
          knowledgeId: id,
          language: Language.ID,
          title: titleId,
          excerpt: excerptId ?? null,
          content: bodyId ?? null,
        },
        update: {
          title: titleId,
          excerpt: excerptId ?? null,
          content: bodyId ?? null,
        },
      });
    }
    if (titleEn !== undefined && titleEn !== null) {
      await tx.knowledgeTranslation.upsert({
        where: { knowledgeId_language: { knowledgeId: id, language: Language.EN } },
        create: {
          knowledgeId: id,
          language: Language.EN,
          title: titleEn || "",
          excerpt: excerptEn ?? null,
          content: bodyEn ?? null,
        },
        update: {
          title: titleEn || "",
          excerpt: excerptEn ?? null,
          content: bodyEn ?? null,
        },
      });
    }
    return k;
  });
}

export async function updateKnowledgeStatus(id: string, status: ContentStatus, userId: string) {
  return prisma.knowledge.update({
    where: { id },
    data: {
      status,
      updatedById: userId,
      ...(status === ContentStatus.PUBLISHED ? { publishedAt: new Date() } : {}),
    },
  });
}

export async function deleteKnowledge(id: string) {
  return prisma.knowledge.delete({ where: { id } });
}
