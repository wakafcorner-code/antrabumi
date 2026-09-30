/**
 * src/server/repositories/partner.repository.ts
 * Data access for Partner entities.
 */

import { prisma } from "@/lib/db/prisma";
import { ContentStatus, Prisma } from "@prisma/client";

export interface PartnerListItem {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  website: string | null;
  status: ContentStatus;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PartnerDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  website: string | null;
  logoMediaId: string | null;
  logoMedia?: { id: string; url: string | null; altText: string | null } | null;
  status: ContentStatus;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PartnerListOptions {
  page?: number;
  perPage?: number;
  status?: ContentStatus;
  search?: string;
}

export async function findPartners(
  opts: PartnerListOptions = {}
): Promise<{ items: PartnerListItem[]; total: number }> {
  const { page = 1, perPage = 20, status, search } = opts;
  const skip = (page - 1) * perPage;

  const where: Prisma.PartnerWhereInput = {
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search } },
            { slug: { contains: search } },
          ],
        }
      : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.partner.findMany({
      where,
      skip,
      take: perPage,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    }),
    prisma.partner.count({ where }),
  ]);

  return { items, total };
}

export interface PublicPartnerItem {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  description: string | null;
  website: string | null;
  logoUrl: string | null;
  logoAlt: string | null;
}

export async function findPublishedPartners(): Promise<PublicPartnerItem[]> {
  const partners = await prisma.partner.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
    },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    include: {
      logoMedia: {
        select: { url: true, altText: true },
      },
    },
  });

  return partners.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category,
    description: p.description,
    website: p.website,
    logoUrl: p.logoMedia?.url ?? null,
    logoAlt: p.logoMedia?.altText ?? p.name,
  }));
}

export async function findPartnerById(id: string): Promise<PartnerDetail | null> {
  return prisma.partner.findUnique({
    where: { id },
    include: {
      logoMedia: {
        select: { id: true, url: true, altText: true },
      },
    },
  });
}

export interface CreatePartnerInput {
  name: string;
  slug: string;
  description?: string;
  website?: string;
  logoMediaId?: string;
  category?: string;
  order?: number;
}

export async function createPartner(input: CreatePartnerInput) {
  return prisma.partner.create({
    data: {
      name: input.name,
      slug: input.slug,
      description: input.description ?? null,
      website: input.website || null,
      logoMediaId: input.logoMediaId || null,
      category: input.category ?? null,
      order: input.order ?? 0,
      status: ContentStatus.DRAFT,
    },
  });
}

export interface UpdatePartnerInput extends Partial<CreatePartnerInput> {
  id: string;
}

export async function updatePartner(input: UpdatePartnerInput) {
  const { id, ...data } = input;
  return prisma.partner.update({
    where: { id },
    data: {
      ...(data.name ? { name: data.name } : {}),
      ...(data.slug ? { slug: data.slug } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.website !== undefined ? { website: data.website || null } : {}),
      ...(data.logoMediaId !== undefined ? { logoMediaId: data.logoMediaId || null } : {}),
      ...(data.category !== undefined ? { category: data.category } : {}),
      ...(data.order !== undefined ? { order: data.order } : {}),
    },
  });
}

export async function updatePartnerStatus(id: string, status: ContentStatus) {
  return prisma.partner.update({
    where: { id },
    data: { status },
  });
}

export async function deletePartner(id: string) {
  return prisma.partner.delete({ where: { id } });
}
