/**
 * prisma/seed.ts — ANTRABUMI Database Seed
 *
 * Seeds only source-supported data as per DATABASE_SCHEMA.md §41.
 * NO fabricated organizational content.
 * All seeded records start with status=DRAFT unless explicitly published.
 */

import { PrismaClient, Role, UserStatus, ContentStatus } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}



// ---------------------------------------------------------------------------
// Seed: Super Admin User
// ---------------------------------------------------------------------------

async function seedSuperAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@antrabumi.org";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("  [skip] Super admin already exists:", email);
    return existing;
  }

  const user = await prisma.user.create({
    data: {
      name: "ANTRABUMI Admin",
      email,
      passwordHash: await hashPassword(process.env.SEED_ADMIN_PASSWORD ?? "change-me-in-production"),
      role: Role.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
    },
  });
  console.log("  [ok] Super admin created:", email);
  return user;
}

// ---------------------------------------------------------------------------
// Seed: Expertise (source-supported from DATABASE_SCHEMA.md §16)
// ---------------------------------------------------------------------------

const EXPERTISE_LIST = [
  { slug: "community-development", name: "Community Development" },
  { slug: "gedsi", name: "GEDSI" },
  { slug: "research-assessment", name: "Research & Assessment" },
  { slug: "communication", name: "Communication" },
  { slug: "conservation", name: "Conservation" },
  { slug: "policy", name: "Policy" },
  { slug: "climate-sustainability", name: "Climate & Sustainability" },
  { slug: "partnership", name: "Partnership" },
];

async function seedExpertise() {
  for (const item of EXPERTISE_LIST) {
    await prisma.expertise.upsert({
      where: { slug: item.slug },
      update: {},
      create: {
        slug: item.slug,
        name: item.name,
      },
    });
  }
  console.log("  [ok] Expertise seeded:", EXPERTISE_LIST.length, "records");
}

// ---------------------------------------------------------------------------
// Seed: Contribution Areas (source-supported from DATABASE_SCHEMA.md §41)
// ---------------------------------------------------------------------------

const CONTRIBUTION_AREAS = [
  {
    slug: "conservation-climate-sustainability",
    order: 1,
    id: { name: "Conservation, Climate & Sustainability" },
    en: { name: "Conservation, Climate & Sustainability" },
  },
  {
    slug: "program-strategy",
    order: 2,
    id: { name: "Program & Strategy" },
    en: { name: "Program & Strategy" },
  },
  {
    slug: "partnership-collaboration",
    order: 3,
    id: { name: "Partnership & Collaboration" },
    en: { name: "Partnership & Collaboration" },
  },
  {
    slug: "media-storytelling-campaign",
    order: 4,
    id: { name: "Media, Storytelling & Campaign" },
    en: { name: "Media, Storytelling & Campaign" },
  },
  {
    slug: "community-development",
    order: 5,
    id: { name: "Community Development" },
    en: { name: "Community Development" },
  },
  {
    slug: "research-assessment-knowledge",
    order: 6,
    id: { name: "Research, Assessment & Knowledge" },
    en: { name: "Research, Assessment & Knowledge" },
  },
];

async function seedContributionAreas() {
  for (const area of CONTRIBUTION_AREAS) {
    const record = await prisma.contributionArea.upsert({
      where: { slug: area.slug },
      update: { order: area.order },
      create: {
        slug: area.slug,
        order: area.order,
        status: ContentStatus.DRAFT,
      },
    });

    // Seed ID translation
    await prisma.contributionAreaTranslation.upsert({
      where: {
        contributionAreaId_language: {
          contributionAreaId: record.id,
          language: "ID",
        },
      },
      update: {},
      create: {
        contributionAreaId: record.id,
        language: "ID",
        title: area.id.name,
      },
    });

    // Seed EN translation
    await prisma.contributionAreaTranslation.upsert({
      where: {
        contributionAreaId_language: {
          contributionAreaId: record.id,
          language: "EN",
        },
      },
      update: {},
      create: {
        contributionAreaId: record.id,
        language: "EN",
        title: area.en.name,
      },
    });
  }
  console.log("  [ok] Contribution areas seeded:", CONTRIBUTION_AREAS.length, "records");
}

// ---------------------------------------------------------------------------
// Seed: Site Settings (default keys only, values empty)
// ---------------------------------------------------------------------------

const SITE_SETTINGS = [
  { key: "site.name", description: "Organization name" },
  { key: "site.tagline", description: "Organization tagline" },
  { key: "site.description", description: "Organization description" },
  { key: "site.email", description: "Contact email" },
  { key: "site.phone", description: "Contact phone" },
  { key: "site.address", description: "Organization address" },
  { key: "site.instagram", description: "Instagram handle" },
  { key: "site.linkedin", description: "LinkedIn URL" },
  { key: "site.website", description: "Organization website URL" },
  { key: "seo.defaultTitle", description: "Default SEO page title" },
  {
    key: "seo.defaultDescription",
    description: "Default SEO meta description",
  },
  { key: "seo.defaultOgImage", description: "Default OG image media ID" },
];

async function seedSiteSettings() {
  for (const setting of SITE_SETTINGS) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: {
        key: setting.key,
        value: null,
        description: setting.description,
      },
    });
  }
  console.log("  [ok] Site settings seeded:", SITE_SETTINGS.length, "keys");
}

// ---------------------------------------------------------------------------
// Seed: Permissions (key registry only)
// ---------------------------------------------------------------------------

const PERMISSIONS = [
  "dashboard.view",
  "pages.read",
  "pages.write",
  "experiences.read",
  "experiences.write",
  "experiences.publish",
  "people.read",
  "people.write",
  "knowledge.read",
  "knowledge.write",
  "knowledge.publish",
  "media.read",
  "media.write",
  "messages.read",
  "messages.update",
  "users.manage",
  "settings.manage",
  "audit_logs.read",
];

async function seedPermissions() {
  for (const key of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { key },
      update: {},
      create: { key },
    });
  }
  console.log("  [ok] Permissions seeded:", PERMISSIONS.length, "keys");
}

// ---------------------------------------------------------------------------
// Seed: Navigation (default structure — ID)
// ---------------------------------------------------------------------------

async function seedNavigation() {
  const existing = await prisma.navigationItem.findFirst({
    where: { language: "ID" },
  });
  if (existing) {
    console.log("  [skip] Navigation already seeded");
    return;
  }

  const navItems = [
    { label: "Tentang", url: "/tentang", order: 1 },
    { label: "Inisiatif", url: "/inisiatif", order: 2 },
    { label: "Pengetahuan", url: "/pengetahuan", order: 3 },
    { label: "Kolaborasi", url: "/kolaborasi", order: 4 },
  ];

  for (const item of navItems) {
    await prisma.navigationItem.create({
      data: {
        label: item.label,
        url: item.url,
        language: "ID",
        order: item.order,
        visible: true,
      },
    });
  }

  const navItemsEN = [
    { label: "About", url: "/about", order: 1 },
    { label: "Initiatives", url: "/initiatives", order: 2 },
    { label: "Knowledge", url: "/knowledge", order: 3 },
    { label: "Collaboration", url: "/collaboration", order: 4 },
  ];

  for (const item of navItemsEN) {
    await prisma.navigationItem.create({
      data: {
        label: item.label,
        url: item.url,
        language: "EN",
        order: item.order,
        visible: true,
      },
    });
  }

  console.log("  [ok] Navigation seeded (ID + EN)");
}

// ---------------------------------------------------------------------------
// Seed: Experiences (Official source-supported from AGENTS.md §15)
// ---------------------------------------------------------------------------

const EXPERIENCES_SEED = [
  {
    slug: "indonesia-digital-ecosystem-assessment-idea",
    year: 2024,
    titleId: "Indonesia Digital Ecosystem Assessment — IDEA",
    titleEn: "Indonesia Digital Ecosystem Assessment — IDEA",
  },
  {
    slug: "perencanaan-pengelolaan-ekowisata-desa",
    year: 2023,
    titleId: "Perencanaan Pengelolaan Ekowisata Desa",
    titleEn: "Village Ecotourism Management Planning",
  },
  {
    slug: "assessment-training-for-community-development",
    year: 2023,
    titleId: "Assessment Training for Community Development",
    titleEn: "Assessment Training for Community Development",
  },
  {
    slug: "assessment-pengembangan-batik-ekologis",
    year: 2022,
    titleId: "Assessment Pengembangan Batik Ekologis",
    titleEn: "Ecological Batik Development Assessment",
  },
  {
    slug: "prototyping-pengelolaan-sampah-pasar-tradisional",
    year: 2022,
    titleId: "Prototyping Pengelolaan Sampah Pasar Tradisional",
    titleEn: "Traditional Market Waste Management Prototyping",
  },
];

async function seedExperiences(adminId: string) {
  for (const item of EXPERIENCES_SEED) {
    const existing = await prisma.experience.findUnique({ where: { slug: item.slug } });
    if (existing) continue;

    await prisma.experience.create({
      data: {
        slug: item.slug,
        year: item.year,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(),
        createdById: adminId,
        updatedById: adminId,
        translations: {
          create: [
            {
              language: "ID",
              title: item.titleId,
            },
            {
              language: "EN",
              title: item.titleEn,
            },
          ],
        },
      },
    });
  }
  console.log("  [ok] Official experiences seeded:", EXPERIENCES_SEED.length);
}

// ---------------------------------------------------------------------------
// Seed: People (Official source-supported from AGENTS.md §16)
// ---------------------------------------------------------------------------

const PEOPLE_SEED = [
  {
    slug: "sendi-kenia-savitri",
    order: 1,
    id: { name: "Sendi Kenia Savitri, M.Si.", degree: "M.Si." },
    en: { name: "Sendi Kenia Savitri, M.Si.", degree: "M.Si." },
  },
  {
    slug: "ade-afrilian-saputra",
    order: 2,
    id: { name: "Ade Afrilian Saputra, M.M.Sus.", degree: "M.M.Sus." },
    en: { name: "Ade Afrilian Saputra, M.M.Sus.", degree: "M.M.Sus." },
  },
  {
    slug: "anna-agustina",
    order: 3,
    id: { name: "Anna Agustina, Ph.D.", degree: "Ph.D." },
    en: { name: "Anna Agustina, Ph.D.", degree: "Ph.D." },
  },
  {
    slug: "yando-zakaria",
    order: 4,
    id: { name: "Yando Zakaria", degree: null },
    en: { name: "Yando Zakaria", degree: null },
  },
  {
    slug: "sekar-mira-c-herandarudewi",
    order: 5,
    id: { name: "Sekar Mira C. Herandarudewi, M.Si.", degree: "M.Si." },
    en: { name: "Sekar Mira C. Herandarudewi, M.Si.", degree: "M.Si." },
  },
  {
    slug: "arya-kusumo-harwinanto",
    order: 6,
    id: { name: "Arya Kusumo Harwinanto, S.I.Kom.", degree: "S.I.Kom." },
    en: { name: "Arya Kusumo Harwinanto, S.I.Kom.", degree: "S.I.Kom." },
  },
  {
    slug: "shaniya-utamidita",
    order: 7,
    id: { name: "Shaniya Utamidita, M.S.", degree: "M.S." },
    en: { name: "Shaniya Utamidita, M.S.", degree: "M.S." },
  },
  {
    slug: "suluh-gembyeng-ciptadi",
    order: 8,
    id: { name: "Suluh Gembyeng Ciptadi, M.Si.", degree: "M.Si." },
    en: { name: "Suluh Gembyeng Ciptadi, M.Si.", degree: "M.Si." },
  },
];

async function seedPeople(adminId: string) {
  for (const person of PEOPLE_SEED) {
    const existing = await prisma.person.findUnique({ where: { slug: person.slug } });
    if (existing) continue;

    await prisma.person.create({
      data: {
        slug: person.slug,
        order: person.order,
        status: ContentStatus.PUBLISHED,
        createdById: adminId,
        updatedById: adminId,
        translations: {
          create: [
            {
              language: "ID",
              name: person.id.name,
              degree: person.id.degree,
            },
            {
              language: "EN",
              name: person.en.name,
              degree: person.en.degree,
            },
          ],
        },
      },
    });
  }
  console.log("  [ok] Official team members seeded:", PEOPLE_SEED.length);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("─".repeat(60));
  console.log("ANTRABUMI — Database Seed");
  console.log("─".repeat(60));

  const superAdmin = await seedSuperAdmin();
  await seedExpertise();
  await seedContributionAreas();
  await seedSiteSettings();
  await seedPermissions();
  await seedNavigation();
  await seedExperiences(superAdmin.id);
  await seedPeople(superAdmin.id);

  console.log("─".repeat(60));
  console.log("Seed complete.");
  console.log("─".repeat(60));
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
