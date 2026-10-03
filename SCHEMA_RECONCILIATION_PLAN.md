# Schema Reconciliation Plan

Status: proposed changes recorded before implementation.
Source of truth: current Prisma schema plus read-only source catalog/data checks in `antrabumi`.
Scope excludes database writes, Prisma/Next.js edits, and feature implementation.

## Verified Baseline

- Current Prisma defaults unannotated scalar `String` fields to `VARCHAR(191)` in the source SQL. Laravel's `$table->string()` default is `VARCHAR(255)` unless a length is supplied.
- The live source `antrabumi.Knowledge.type` is `ENUM('ARTICLE','RESEARCH_PUBLICATION','STORY')`; it contains one row per value. The target `antrabumi_laravel` was confirmed empty in the audit.
- The historical seven-value enum exists in the initial Prisma migration and `DATABASE_SCHEMA.md`; the current Prisma schema, current SQL export, Laravel enum, and live source use three values.
- Laravel auth uses `Auth::attempt($credentials)` without the remember flag. No remember-me login flow was found. `remember_token` appears only in the Laravel migration, hidden attributes, and UserFactory data.
- Prisma and Laravel pivot DDL for `ExperienceContributionArea` have only `experienceId` and `contributionAreaId`; no `order` field exists.

## Proposed Implementation Changes

For every item below, Prisma/source is `VARCHAR(191)` and current Laravel is `$table->string(...)` with the framework default `VARCHAR(255)`. The proposed migration edit is `$table->string('<column>', 191)`. This matches the source definition rather than expanding it. No framework-only string field is included in this domain alignment list.

| Laravel migration/table | Columns to change to VARCHAR(191) | Source definition and reason |
|---|---|---|
| `0001_01_01_000000_create_users_table.php` / `User` | `name`, `email`, `passwordHash` | Prisma `String` defaults to VARCHAR(191); preserve source field limits and unique-email definition. |
| `2026_10_02_000001_create_reference_and_settings_tables.php` / `Permission` | `key`, `description` | Prisma `String` defaults to VARCHAR(191); preserve source lengths. |
| Same / `ContributionArea` | `slug` | Prisma `String` unique slug is VARCHAR(191). |
| Same / `Expertise` | `slug`, `name` | Prisma `String` fields are VARCHAR(191). |
| Same / `Category` | `slug`, `name` | Prisma `String` fields are VARCHAR(191). |
| Same / `Tag` | `slug`, `name` | Prisma `String` fields are VARCHAR(191). |
| Same / `SiteSetting` | `key`, `description` | Prisma `String` fields are VARCHAR(191); `value` remains LONGTEXT. |
| Same / `NavigationItem` | `label`, `url` | Prisma `String` fields are VARCHAR(191). |
| Same / `AuditLog` | `entity`, `entityId`, `ipAddress`, `userAgent` | Prisma nullable `String` fields are VARCHAR(191). |
| `2026_10_02_000002_create_media_table.php` / `Media` | `filename`, `originalName`, `mimeType`, `storageKey`, `url`, `altText` | Prisma `String` fields are VARCHAR(191); text caption/attribution and signed BIGINT size remain unchanged. |
| `2026_10_02_000003_create_content_tables.php` / `Page` | `slug`, `title`, `heroTitle`, `heroDescription`, `seoTitle` | Prisma `String` fields are VARCHAR(191); excerpt/content/SEO description text types remain unchanged. |
| Same / `ContributionAreaTranslation` | `title` | Prisma `String` title is VARCHAR(191). |
| Same / `Experience` | `slug`, `type`, `category`, `location`, `clientName` | Prisma `String` fields (including the post-migration category) are VARCHAR(191). |
| Same / `ExperienceTranslation` | `title`, `seoTitle` | Prisma `String` fields are VARCHAR(191); long/text fields remain unchanged. |
| Same / `ExperienceMetric` | `label`, `value`, `unit` | Prisma `String` fields are VARCHAR(191); nullable unit remains nullable. |
| Same / `Person` | `slug` | Prisma unique slug is VARCHAR(191). |
| Same / `PersonTranslation` | `name`, `degree`, `role` | Prisma `String` fields are VARCHAR(191); biography remains LONGTEXT. |
| Same / `Knowledge` | `slug`, `authorName` | Prisma `String` fields are VARCHAR(191); do not change KnowledgeType. |
| Same / `KnowledgeTranslation` | `title`, `seoTitle` | Prisma `String` fields are VARCHAR(191); excerpt/content remain TEXT/LONGTEXT. |
| Same / `Partner` | `name`, `slug`, `website`, `category` | Prisma `String` fields are VARCHAR(191). |
| Same / `ContactMessage` | `name`, `email`, `organization`, `phone`, `subject`, `areaOfInterest` | Prisma `String` fields are VARCHAR(191); message remains TEXT. |
| `2026_10_02_000004_create_content_pivots.php` / `KnowledgeDownload` | `label` | Prisma nullable `String` label is VARCHAR(191). |

Other source IDs and FK columns already explicitly use length 191 and will not change. Framework-owned `password_reset_tokens`, `sessions`, `cache`, `cache_locks`, `jobs`, `job_batches`, and `failed_jobs` definitions stay Laravel-native and are not source domain columns.

### Remember token

- Remove `$table->rememberToken()` from the `User` create migration because this application does not request remember-me authentication.
- Remove `remember_token` from `User::$hidden` and `UserFactory::definition()` so the model/test factory do not reference a removed column.
- Keep Laravel session authentication and the separate Laravel `sessions` table unchanged. This does not change source auth data or APP_KEY.

### ExperienceContributionArea pivot

- Remove `withPivot('order')` from `Experience::contributionAreas()` and `ContributionArea::experiences()`.
- Do not add an `order` column or migration. The source has no relation-level order. Contribution areas may be ordered by the existing `ContributionArea.order` when a caller needs display order; no per-link order is represented by this pivot.

### KnowledgeType and feature parity

- Leave `KnowledgeType` enum, migration values, source schema, and source data unchanged. No data conversion is proposed or performed.
- Document the current and historical values, the current source's grouped row counts, and that any old backup containing removed values needs a separately reviewed mapping before import.
- Create `FEATURE_PARITY_REMAINING.md` with outstanding Laravel work grouped by the requested feature areas; document only, no feature work.
- Create `SCHEMA_RECONCILIATION_REPORT.md` after implementation and validation with changes, remaining gaps, and a conservative GO/NO-GO decision.

## Proposed Validation

- Run `php -l` on each changed PHP migration/model/factory file.
- Run Laravel route/static structural checks that do not access or write the database.
- Run `php artisan config:show database` to confirm the resolved connection remains the local target.
- Run `php artisan migrate:status` only as requested; it is read-only. Do not run `migrate`, `migrate:fresh`, seeders, or schema-mutating checks.
- Do not run tests that invoke `RefreshDatabase`/migration commands, and do not connect with write queries to either database.