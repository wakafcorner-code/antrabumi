/**
 * src/server/repositories/person.repository.ts
 * Data access for People / Team profiles.
 */

import { prisma } from "@/lib/db/prisma";
import { ContentStatus, Language, Prisma } from "@prisma/client";

export interface PersonListItem {
  id: string;
  slug: string;
  status: ContentStatus;
  order: number;
  imageId: string | null;
  createdAt: Date;
  updatedAt: Date;
  name: string | null;
  roleId: string | null;
}

export interface PersonDetail {
  id: string;
  slug: string;
  status: ContentStatus;
  order: number;
  imageId: string | null;
  image?: { id: string; url: string | null; altText: string | null } | null;
  createdAt: Date;
  updatedAt: Date;
  translations: Array<{
    language: Language;
    name: string;
    role: string | null;
    degree: string | null;
    biography: string | null;
  }>;
  expertise: Array<{ expertise: { id: string; slug: string; name: string } }>;
}

export interface PersonListOptions {
  page?: number;
  perPage?: number;
  status?: ContentStatus;
  search?: string;
}

export async function findPeople(
  opts: PersonListOptions = {}
): Promise<{ items: PersonListItem[]; total: number }> {
  const { page = 1, perPage = 20, status, search } = opts;
  const skip = (page - 1) * perPage;

  const where: Prisma.PersonWhereInput = {
    ...(status ? { status } : {}),
    ...(search
      ? { translations: { some: { name: { contains: search } } } }
      : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.person.findMany({
      where,
      skip,
      take: perPage,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      include: {
        translations: {
          where: { language: Language.ID },
          select: { name: true, role: true },
        },
      },
    }),
    prisma.person.count({ where }),
  ]);

  return {
    total,
    items: items.map((p) => ({
      id: p.id,
      slug: p.slug,
      status: p.status,
      order: p.order,
      imageId: p.imageId,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      name: p.translations[0]?.name ?? null,
      roleId: p.translations[0]?.role ?? null,
    })),
  };
}

export interface PublicPersonItem {
  id: string;
  slug: string;
  order: number;
  name: string;
  role: string | null;
  degree: string | null;
  biography: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
}

export async function findPublishedPeople(language: string = "ID"): Promise<PublicPersonItem[]> {
  const people = await prisma.person.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
    },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    include: {
      image: {
        select: { url: true, altText: true },
      },
      translations: {
        select: {
          language: true,
          name: true,
          role: true,
          degree: true,
          biography: true,
        },
      },
    },
  });

  const langEnum = language.toUpperCase() === "EN" ? Language.EN : Language.ID;

  return people.map((p) => {
    const currentTranslation =
      p.translations.find((t) => t.language === langEnum) ??
      p.translations.find((t) => t.language === Language.ID) ??
      p.translations[0];

    const fallbackTranslation =
      p.translations.find((t) => t.language !== langEnum);

    const name = currentTranslation?.name || fallbackTranslation?.name || p.slug;
    const role = currentTranslation?.role || fallbackTranslation?.role || null;
    const degree = currentTranslation?.degree || fallbackTranslation?.degree || null;
    const biography = currentTranslation?.biography || fallbackTranslation?.biography || null;

    return {
      id: p.id,
      slug: p.slug,
      order: p.order,
      name,
      role,
      degree,
      biography,
      imageUrl: p.image?.url ?? null,
      imageAlt: p.image?.altText ?? name ?? null,
    };
  });
}

export async function findPersonById(id: string): Promise<PersonDetail | null> {
  const p = await prisma.person.findUnique({
    where: { id },
    include: {
      image: {
        select: { id: true, url: true, altText: true },
      },
      translations: {
        select: {
          language: true,
          name: true,
          role: true,
          degree: true,
          biography: true,
        },
      },
      expertise: {
        include: { expertise: { select: { id: true, slug: true, name: true } } },
      },
    },
  });
  if (!p) return null;
  return {
    id: p.id,
    slug: p.slug,
    status: p.status,
    order: p.order,
    imageId: p.imageId,
    image: p.image,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    translations: p.translations,
    expertise: p.expertise,
  };
}

export interface CreatePersonInput {
  slug: string;
  displayOrder?: number;
  imageId?: string;
  nameId: string;
  roleId?: string;
  credentialsId?: string;
  biographyId?: string;
  nameEn?: string;
  roleEn?: string;
  biographyEn?: string;
}

export async function createPerson(input: CreatePersonInput, userId: string) {
  return prisma.person.create({
    data: {
      slug: input.slug,
      status: ContentStatus.DRAFT,
      order: input.displayOrder ?? 0,
      imageId: input.imageId || null,
      createdById: userId,
      updatedById: userId,
      translations: {
        create: [
          {
            language: Language.ID,
            name: input.nameId,
            role: input.roleId ?? null,
            degree: input.credentialsId ?? null,
            biography: input.biographyId ?? null,
          },
          ...(input.nameEn
            ? [
                {
                  language: Language.EN,
                  name: input.nameEn,
                  role: input.roleEn ?? null,
                  degree: null,
                  biography: input.biographyEn ?? null,
                },
              ]
            : []),
        ],
      },
    },
  });
}

export interface UpdatePersonInput extends Partial<CreatePersonInput> {
  id: string;
}

export async function updatePerson(input: UpdatePersonInput, userId: string) {
  const { id, nameId, roleId, credentialsId, biographyId, nameEn, roleEn, biographyEn, ...core } = input;

  return prisma.$transaction(async (tx) => {
    const p = await tx.person.update({
      where: { id },
      data: {
        ...(core.slug ? { slug: core.slug } : {}),
        ...(core.displayOrder !== undefined ? { order: core.displayOrder } : {}),
        ...(core.imageId !== undefined ? { imageId: core.imageId || null } : {}),
        updatedById: userId,
      },
    });

    if (nameId !== undefined) {
      await tx.personTranslation.upsert({
        where: { personId_language: { personId: id, language: Language.ID } },
        create: {
          personId: id,
          language: Language.ID,
          name: nameId,
          role: roleId ?? null,
          degree: credentialsId ?? null,
          biography: biographyId ?? null,
        },
        update: {
          name: nameId,
          role: roleId ?? null,
          degree: credentialsId ?? null,
          biography: biographyId ?? null,
        },
      });
    }
    if (nameEn !== undefined) {
      await tx.personTranslation.upsert({
        where: { personId_language: { personId: id, language: Language.EN } },
        create: {
          personId: id,
          language: Language.EN,
          name: nameEn,
          role: roleEn ?? null,
          biography: biographyEn ?? null,
        },
        update: {
          name: nameEn,
          role: roleEn ?? null,
          biography: biographyEn ?? null,
        },
      });
    }
    return p;
  });
}

export async function updatePersonStatus(id: string, status: ContentStatus, userId: string) {
  return prisma.person.update({
    where: { id },
    data: {
      status,
      updatedById: userId,
    },
  });
}

export async function deletePerson(id: string) {
  return prisma.person.delete({ where: { id } });
}
