/**
 * src/server/repositories/media.repository.ts
 *
 * Data access layer for Media assets.
 */

import { prisma } from "@/lib/db/prisma";
import { MediaType, Prisma } from "@prisma/client";
import { storage } from "@/lib/storage";

export interface MediaListItem {
  id: string;
  type: MediaType;
  filename: string;
  originalName: string | null;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  storageKey: string;
  url: string | null;
  altText: string | null;
  caption: string | null;
  attribution: string | null;
  uploadedById: string;
  uploadedByName: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaListOptions {
  page?: number;
  perPage?: number;
  type?: MediaType;
  search?: string;
}

export async function findMedia(
  opts: MediaListOptions = {}
): Promise<{ items: MediaListItem[]; total: number }> {
  const { page = 1, perPage = 24, type, search } = opts;
  const skip = (page - 1) * perPage;

  const where: Prisma.MediaWhereInput = {
    ...(type ? { type } : {}),
    ...(search
      ? {
          OR: [
            { originalName: { contains: search } },
            { filename: { contains: search } },
            { altText: { contains: search } },
          ],
        }
      : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.media.findMany({
      where,
      skip,
      take: perPage,
      orderBy: { createdAt: "desc" },
      include: {
        uploadedBy: {
          select: { name: true },
        },
      },
    }),
    prisma.media.count({ where }),
  ]);

  return {
    total,
    items: items.map((m) => ({
      id: m.id,
      type: m.type,
      filename: m.filename,
      originalName: m.originalName,
      mimeType: m.mimeType,
      size: Number(m.size),
      width: m.width,
      height: m.height,
      storageKey: m.storageKey,
      url: m.url,
      altText: m.altText,
      caption: m.caption,
      attribution: m.attribution,
      uploadedById: m.uploadedById,
      uploadedByName: m.uploadedBy?.name ?? null,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
    })),
  };
}

export async function findMediaById(id: string): Promise<MediaListItem | null> {
  const m = await prisma.media.findUnique({
    where: { id },
    include: {
      uploadedBy: { select: { name: true } },
    },
  });

  if (!m) return null;

  return {
    id: m.id,
    type: m.type,
    filename: m.filename,
    originalName: m.originalName,
    mimeType: m.mimeType,
    size: Number(m.size),
    width: m.width,
    height: m.height,
    storageKey: m.storageKey,
    url: m.url,
    altText: m.altText,
    caption: m.caption,
    attribution: m.attribution,
    uploadedById: m.uploadedById,
    uploadedByName: m.uploadedBy?.name ?? null,
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
  };
}

export interface CreateMediaInput {
  type: MediaType;
  filename: string;
  originalName?: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  storageKey: string;
  url: string;
  altText?: string;
  caption?: string;
  attribution?: string;
  uploadedById: string;
}

export async function createMedia(input: CreateMediaInput) {
  return prisma.media.create({
    data: {
      type: input.type,
      filename: input.filename,
      originalName: input.originalName ?? null,
      mimeType: input.mimeType,
      size: BigInt(input.size),
      width: input.width ?? null,
      height: input.height ?? null,
      storageKey: input.storageKey,
      url: input.url,
      altText: input.altText ?? null,
      caption: input.caption ?? null,
      attribution: input.attribution ?? null,
      uploadedById: input.uploadedById,
    },
  });
}

export interface UpdateMediaMetadataInput {
  id: string;
  altText?: string | null;
  caption?: string | null;
  attribution?: string | null;
}

export async function updateMediaMetadata(input: UpdateMediaMetadataInput) {
  return prisma.media.update({
    where: { id: input.id },
    data: {
      ...(input.altText !== undefined ? { altText: input.altText } : {}),
      ...(input.caption !== undefined ? { caption: input.caption } : {}),
      ...(input.attribution !== undefined ? { attribution: input.attribution } : {}),
    },
  });
}

export async function deleteMedia(id: string) {
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return null;

  // Delete physical file from storage
  await storage.delete(media.storageKey);

  // Delete record from database
  return prisma.media.delete({ where: { id } });
}
