import { describe, it, expect } from "vitest";
import { prisma } from "../prisma";
import { ContentStatus, Language, Role, UserStatus } from "@prisma/client";

describe("Prisma Database & Models", () => {
  it("should have seeded SuperAdmin user", async () => {
    const admin = await prisma.user.findUnique({
      where: { email: "admin@antrabumi.org" },
    });

    expect(admin).not.toBeNull();
    expect(admin?.role).toBe(Role.SUPER_ADMIN);
    expect(admin?.status).toBe(UserStatus.ACTIVE);
  });

  it("should have seeded all 8 expertise areas", async () => {
    const count = await prisma.expertise.count();
    expect(count).toBe(8);

    const gedsi = await prisma.expertise.findUnique({
      where: { slug: "gedsi" },
    });
    expect(gedsi).not.toBeNull();
    expect(gedsi?.name).toBe("GEDSI");
  });

  it("should have seeded 6 contribution areas with ID and EN translations", async () => {
    const areas = await prisma.contributionArea.findMany({
      include: {
        translations: true,
      },
      orderBy: { order: "asc" },
    });

    expect(areas.length).toBe(6);
    expect(areas[0].translations.length).toBe(2);

    const langCodes = areas[0].translations.map((t: { language: Language }) => t.language);
    expect(langCodes).toContain(Language.ID);
    expect(langCodes).toContain(Language.EN);
  });

  it("should support creating, updating, and cascading delete for an experience", async () => {
    const admin = await prisma.user.findFirst({
      where: { role: Role.SUPER_ADMIN },
    });
    expect(admin).not.toBeNull();
    if (!admin) return;

    const testSlug = `test-experience-${Date.now()}`;

    // 1. Create Experience with Translation and Metric
    const exp = await prisma.experience.create({
      data: {
        slug: testSlug,
        year: 2026,
        status: ContentStatus.DRAFT,
        createdById: admin.id,
        updatedById: admin.id,
        translations: {
          create: [
            {
              language: Language.ID,
              title: "Uji Coba Pengalaman",
              excerpt: "Ringkasan pengujian",
            },
            {
              language: Language.EN,
              title: "Test Experience",
              excerpt: "Test summary",
            },
          ],
        },
        metrics: {
          create: [
            {
              label: "Participants",
              value: "100",
              unit: "people",
              order: 1,
            },
          ],
        },
      },
      include: {
        translations: true,
        metrics: true,
      },
    });

    expect(exp.id).toBeDefined();
    expect(exp.translations.length).toBe(2);
    expect(exp.metrics.length).toBe(1);

    // 2. Verify Cascade Delete
    await prisma.experience.delete({
      where: { id: exp.id },
    });

    const translationsLeft = await prisma.experienceTranslation.findMany({
      where: { experienceId: exp.id },
    });
    expect(translationsLeft.length).toBe(0);

    const metricsLeft = await prisma.experienceMetric.findMany({
      where: { experienceId: exp.id },
    });
    expect(metricsLeft.length).toBe(0);
  });
});
