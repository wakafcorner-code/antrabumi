# ANTRABUMI Source-to-Laravel Data Import Plan

Plan date: 2026-10-02
Status: **planning only; no source data has been imported**.
Source: `antrabumi`. Target: `antrabumi_laravel`.

## Verified Starting State

- Source has 30 domain tables and 230 domain rows, plus `_prisma_migrations` (three applied entries).
- Target database exists and has zero tables at audit time. Every target count below is the expected count **after** a complete import; its current count is zero.
- Do not import `_prisma_migrations`; it is Prisma's migration ledger, not an application entity. Laravel's `migrations` table is Laravel metadata, not source data.
- No seeding is part of this plan. Transfer only the existing source rows, including rows in currently empty domain tables (which remain zero).
- Source data lives on MariaDB 10.4.32; target schema was reconciled and tested on local MariaDB. Reconfirm exact target database identity and backup/restore before any future import.

## Non-Negotiable Import Rules

1. Preserve every existing source primary-key value and every composite pivot key. Do not let Laravel's ULID generator replace source CUIDs.
2. Source entity `id` values are 25-character CUIDs; all populated ID tables passed the CUID-shape check. Eight pivot tables use composite primary keys and have no `id`.
3. `BaseModel` guards `id`, `User::$fillable` omits it, and Laravel `User.passwordHash` has a `hashed` cast. Use a reviewed raw/query-builder import path with explicit IDs, hashes, enum strings, JSON, and timestamps. Do not use ordinary `Model::create()` for imported rows.
4. Preserve source NULLs, strings, JSON, IDs, and `DATETIME(3)` values. Do not synthesize missing metadata or alter content.
5. Copy media file bytes separately from SQL and verify checksums before marking associated media complete.
6. Never target or write to `antrabumi`; source stays read-only. Do not mix this data import with schema migrations or seeders.

## Table-by-Table Import Matrix

“Expected target rows” equals the current source row count. Every ID-based table uses source CUIDs as its PK; the eight composite-key tables preserve the listed pair unchanged. FK parents are the actual source dependencies.

| Source table | Target table | Source rows | Expected target rows | Primary key / preserve IDs | FK dependencies | Enum considerations | Transformation, phase, risk |
|---|---|---:|---:|---|---|---|---|
| `User` | `User` | 2 | 2 | `id` CUID; preserve | `Media` via optional `imageId`; break cycle by staging imageId NULL | Role: SUPER_ADMIN/ADMIN present; status ACTIVE only | Preserve `$2b$12$` hashes exactly until reviewed compatibility policy; normal hashed cast/model creation unsafe. Phase 1 skeleton. **High** |
| `Permission` | `Permission` | 18 | 18 | `id` CUID; preserve | None | None | Direct; preserve unique `key`. Phase 1 references. Low |
| `Page` | `Page` | 0 | 0 | `id` CUID; preserve if later populated | `Media` hero/OG fields | Language/status enums; no rows | Direct, retain NULLs. Phase 3 root content. Low |
| `ContributionArea` | `ContributionArea` | 6 | 6 | `id` CUID; preserve | None | ContentStatus: DRAFT/PUBLISHED values exist globally | Direct; preserve `order`. Phase 1 references. Medium |
| `ContributionAreaTranslation` | `ContributionAreaTranslation` | 12 | 12 | `id` CUID; preserve | `ContributionArea`, `Media` image | Language ID/EN | Direct after parents/media. Phase 4 child records. Medium |
| `Experience` | `Experience` | 5 | 5 | `id` CUID; preserve | `User` creator/updater, `Media` cover | ContentStatus; source rows are current enum values | Direct; preserve required creator/updater IDs and category. Phase 3 roots. High |
| `ExperienceTranslation` | `ExperienceTranslation` | 10 | 10 | `id` CUID; preserve | `Experience` | Language ID/EN | Preserve translation content/text/NULLs. Phase 4. Medium |
| `ExperienceMetric` | `ExperienceMetric` | 0 | 0 | `id` CUID; preserve | `Experience` | None | Direct if future rows exist. Phase 4. Low |
| `ExperienceContributionArea` | `ExperienceContributionArea` | 0 | 0 | Composite (`experienceId`, `contributionAreaId`); preserve pair | `Experience`, `ContributionArea` | None | Direct composite-key pivot; no `order` field. Phase 5. Low |
| `ExperienceMedia` | `ExperienceMedia` | 1 | 1 | Composite (`experienceId`, `mediaId`); preserve pair | `Experience`, `Media` | None | Direct after file/Media and Experience. Preserve `order`. Phase 5. Medium |
| `Person` | `Person` | 8 | 8 | `id` CUID; preserve | `User` creator/updater, `Media` image | ContentStatus | Direct; preserve user IDs and nullable image. Phase 3 roots. High |
| `PersonTranslation` | `PersonTranslation` | 16 | 16 | `id` CUID; preserve | `Person` | Language ID/EN | Direct, preserve degree/role/biography NULLs. Phase 4. Medium |
| `Expertise` | `Expertise` | 8 | 8 | `id` CUID; preserve | None | None | Direct reference data. Phase 1. Low |
| `PersonExpertise` | `PersonExpertise` | 0 | 0 | Composite (`personId`, `expertiseId`); preserve pair | `Person`, `Expertise` | None | Direct composite-key pivot; no fabricated order. Phase 5. Low |
| `Knowledge` | `Knowledge` | 3 | 3 | `id` CUID; preserve | `User` creator/updater, `Media` cover | Current `ARTICLE`, `RESEARCH_PUBLICATION`, `STORY`; one each | Direct only for current values; stop if selected source snapshot contains old labels. Phase 3 roots. **High** |
| `KnowledgeTranslation` | `KnowledgeTranslation` | 6 | 6 | `id` CUID; preserve | `Knowledge` | Language ID/EN | Preserve rich text and SEO exactly; do not sanitize/normalize during transfer. Phase 4. High |
| `Category` | `Category` | 0 | 0 | `id` CUID; preserve | None | None | No rows currently; direct if populated. Phase 1. Low |
| `KnowledgeCategory` | `KnowledgeCategory` | 0 | 0 | Composite (`knowledgeId`, `categoryId`); preserve pair | `Knowledge`, `Category` | None | Direct composite-key pivot. Phase 5. Low |
| `Tag` | `Tag` | 0 | 0 | `id` CUID; preserve | None | None | No rows currently; direct if populated. Phase 1. Low |
| `KnowledgeTag` | `KnowledgeTag` | 0 | 0 | Composite (`knowledgeId`, `tagId`); preserve pair | `Knowledge`, `Tag` | None | Direct composite-key pivot. Phase 5. Low |
| `ExperienceKnowledge` | `ExperienceKnowledge` | 0 | 0 | Composite (`experienceId`, `knowledgeId`); preserve pair | `Experience`, `Knowledge` | None | Direct composite-key pivot. Phase 5. Low |
| `KnowledgeContributionArea` | `KnowledgeContributionArea` | 0 | 0 | Composite (`knowledgeId`, `contributionAreaId`); preserve pair | `Knowledge`, `ContributionArea` | None | Direct composite-key pivot. Phase 5. Low |
| `KnowledgeDownload` | `KnowledgeDownload` | 2 | 2 | `id` CUID; preserve | `Knowledge`, `Media` | None | Preserve label/NULL and order; ensure media files copied. Phase 5. Medium |
| `KnowledgeMedia` | `KnowledgeMedia` | 3 | 3 | Composite (`knowledgeId`, `mediaId`); preserve pair | `Knowledge`, `Media` | None | Direct ordered gallery pivot; ensure files copied. Phase 5. Medium |
| `Media` | `Media` | 19 | 19 | `id` CUID; preserve | `User` via required `uploadedById` | MediaType: IMAGE 14, DOCUMENT 5 | Copy/verify bytes first; map source basename key to `uploads/<basename>` and source `/uploads/...` URL to Laravel media URL. Phase 2. **High** |
| `Partner` | `Partner` | 0 | 0 | `id` CUID; preserve | `Media` logo | ContentStatus | No rows; direct if populated. Phase 3. Low |
| `ContactMessage` | `ContactMessage` | 2 | 2 | `id` CUID; preserve | `User` via optional assignee (currently none assigned) | NEW 1, READ 1 | Direct; sensitive contact PII, restrict dumps/logs. Phase 6. High |
| `NavigationItem` | `NavigationItem` | 8 | 8 | `id` CUID; preserve | Self-FK `parentId`; currently all NULL | Language ID/EN | Current direct; for any future parents use parent-first or two-pass parentId update. Phase 4. Medium |
| `SiteSetting` | `SiteSetting` | 28 | 28 | `id` CUID; preserve | None | `language` nullable; all current language values NULL | Copy LONGTEXT exactly; preserve 12 NULL values and 16 populated values. Phase 1. Medium |
| `AuditLog` | `AuditLog` | 73 | 73 | `id` CUID; preserve | Optional `User` relation; all 73 currently linked | CREATE 4, LOGIN 5, LOGOUT 3, PUBLISH 7, UPDATE 35, UPLOAD 19 | Preserve JSON metadata/timestamps; sensitive audit data, import last and restrict access. Phase 6. High |

Totals: **230 source domain rows; 230 expected target domain rows** after a complete import. Empty source tables remain zero. Framework tables are created by Laravel schema migrations and receive no source rows in this plan.

## Dependency-Aware Sequence

This order follows the live 41-FK graph and accounts for the User/Media cycle:

0. Preflight only: verify an independently restorable source backup, an empty/approved target, schema version/collation, row counts, and a reviewed hash/enum/media policy. Keep source connection read-only.
1. Import User skeleton rows with source CUIDs/hashes and `imageId=NULL`; import root reference rows (`Permission`, `ContributionArea`, `Expertise`, `Category`, `Tag`) and `SiteSetting`.
2. Copy the 19 physical media files to a staging copy of Laravel's public disk, verify checksums/sizes, then import `Media` rows (requires uploader User IDs). Apply the approved storageKey/URL mapping. Restore User image references afterward only if the source snapshot has them; current source has none.
3. Import root content `Experience`, `Person`, `Knowledge`, `Page`, and `Partner` after their required users/media exist. Preserve exact IDs, creators/updaters, statuses, NULLs, and publication dates.
4. Import `ContributionAreaTranslation`, `ExperienceTranslation`, `ExperienceMetric`, `PersonTranslation`, `KnowledgeTranslation`, and `NavigationItem`. Current NavigationItem parents are all NULL; if not in a later snapshot, insert rows first and resolve parentId in a second pass.
5. Import `ExperienceContributionArea`, `ExperienceMedia`, `PersonExpertise`, `KnowledgeCategory`, `KnowledgeTag`, `ExperienceKnowledge`, `KnowledgeContributionArea`, `KnowledgeDownload`, and `KnowledgeMedia` after all parent rows and media files.
6. Import `ContactMessage` and finally `AuditLog`; preserve IDs, statuses, metadata, actor/assignee IDs, and timestamps. Restrict access to these tables.
7. Reconcile every source/target table count, distinct enum values, primary/composite keys, unique constraints, FK anti-joins, media checksums/URL reachability, and timestamp samples. Do not cut over until mismatches are zero or explicitly approved.

## Data Integrity and Verification Gates

- For each of 30 tables, source count must equal imported target count (expected counts above); all eight composite pivot key sets must match exactly.
- Preserve all 25-character CUIDs. The target's ULID generator is only for new records; imported rows bypass generation and mass-assignment guards.
- Source unique keys include 16 non-primary unique indexes (slug/key/email and language-scoped translation pairs); check for target collation-induced collisions before insertion. Source tables use `utf8mb4_unicode_ci`, while database defaults report `utf8mb4_general_ci`; compare actual target table collations.
- All source FK actions are known: 23 CASCADE, 7 RESTRICT, 11 SET NULL; update actions CASCADE. Import order satisfies parent requirements; do not disable FK checks to conceal missing parents.
- Preserve all `DATETIME(3)` source values exactly through raw inserts. Validate samples as stored, without timezone conversion or ORM timestamp replacement.
- Import current `KnowledgeType` values directly only after validating the selected snapshot. If it is an old backup with historical enum values, stop and use a separately approved mapping; do not silently coerce.
- Validate bcrypt compatibility before enabling imported-user login. Current Laravel `verify=true` rejects `$2b$`; current `rehash_on_login=true` can rewrite a hash after login. Do not reset plaintext passwords. Test the chosen target-only prefix/config policy against synthetic and authorized staging credentials before production import.
- Media metadata rows without matching checksummed file bytes are not a successful import, even if row counts match.

## Readiness

**NO-GO for executing this plan yet.** It is a dependency-aware plan, not an authorization to import. Resolve the Laravel `$2b$` authentication incompatibility and login rehash behavior, implement/test a deterministic raw-ID/timestamp/JSON import path, prepare/checksum the separately stored media, and perform a dry run against a disposable copy first. No source or target rows were modified during this audit.