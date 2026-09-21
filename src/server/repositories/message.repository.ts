/**
 * src/server/repositories/message.repository.ts
 * Data access for ContactMessage — read-only inbox.
 */

import { prisma } from "@/lib/db/prisma";
import { MessageStatus, Prisma } from "@prisma/client";

export interface MessageListItem {
  id: string;
  name: string;
  email: string;
  organization?: string | null;
  phone?: string | null;
  areaOfInterest?: string | null;
  subject: string | null;
  status: MessageStatus;
  createdAt: Date;
}

export async function findMessages(opts: {
  page?: number;
  perPage?: number;
  status?: MessageStatus;
}): Promise<{ items: MessageListItem[]; total: number }> {
  const { page = 1, perPage = 20, status } = opts;
  const skip = (page - 1) * perPage;

  const where: Prisma.ContactMessageWhereInput = status ? { status } : {};

  const [items, total] = await prisma.$transaction([
    prisma.contactMessage.findMany({
      where,
      skip,
      take: perPage,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        organization: true,
        phone: true,
        areaOfInterest: true,
        subject: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.contactMessage.count({ where }),
  ]);

  return { items, total };
}

export async function findMessageById(id: string) {
  return prisma.contactMessage.findUnique({ where: { id } });
}

export async function updateMessageStatus(id: string, status: MessageStatus) {
  return prisma.contactMessage.update({ where: { id }, data: { status } });
}
