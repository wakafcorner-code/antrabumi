/**
 * src/server/repositories/settings.repository.ts
 * Data access for SiteSetting key/value store.
 */

import { prisma } from "@/lib/db/prisma";

export async function findAllSettings() {
  return prisma.siteSetting.findMany({ orderBy: { key: "asc" } });
}

export async function findSettingByKey(key: string) {
  return prisma.siteSetting.findUnique({ where: { key } });
}

export async function upsertSetting(key: string, value: string) {
  return prisma.siteSetting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
}

export async function upsertManySettings(pairs: Array<{ key: string; value: string }>) {
  return prisma.$transaction(
    pairs.map(({ key, value }) =>
      prisma.siteSetting.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      })
    )
  );
}
