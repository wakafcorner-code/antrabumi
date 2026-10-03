# Schema Reconciliation Report

Date: 2026-10-02
Scope: Laravel schema/model reconciliation against current Prisma/source definitions.
**Final recommendation: NO-GO for running migrations at this stage.**

No database was modified. No migration, `migrate:fresh`, seeder, drop, truncate, Next.js edit, or APP_KEY change was performed. The audit-only source values were rechecked with read-only SELECTs; the current source enum is three values with one row per value. The Laravel target remains intentionally empty.

## Changes Made

- Changed every mismatched Prisma-domain default Laravel string width from VARCHAR(255) to explicit VARCHAR(191) in the User, reference/settings, Media, content, and KnowledgeDownload migration definitions. The full table/column plan is in [SCHEMA_RECONCILIATION_PLAN.md](SCHEMA_RECONCILIATION_PLAN.md).
- Removed the `User.remember_token` column from the new User schema, plus its hidden-model and factory references. Laravel uses session authentication; the login calls `Auth::attempt($credentials)` without remember-me enabled. Framework session storage remains unchanged.
- Removed `withPivot('order')` from `Experience::contributionAreas()` and `ContributionArea::experiences()`. The source and target pivot contain only the two FK columns; no order column was invented. Other ordered pivots retain their actual `order` fields.
- Created [FEATURE_PARITY_REMAINING.md](FEATURE_PARITY_REMAINING.md) with remaining Laravel work grouped by the requested domains.
- Created [SCHEMA_RECONCILIATION_PLAN.md](SCHEMA_RECONCILIATION_PLAN.md) before implementation and this report after validation.

## Files Changed

- `database/migrations/0001_01_01_000000_create_users_table.php`
- `database/migrations/2026_10_02_000001_create_reference_and_settings_tables.php`
- `database/migrations/2026_10_02_000002_create_media_table.php`
- `database/migrations/2026_10_02_000003_create_content_tables.php`
- `database/migrations/2026_10_02_000004_create_content_pivots.php`
- `app/Models/User.php`
- `app/Models/Experience.php`
- `app/Models/ContributionArea.php`
- `database/factories/UserFactory.php`
- `SCHEMA_RECONCILIATION_PLAN.md` (new)
- `FEATURE_PARITY_REMAINING.md` (new)
- `SCHEMA_RECONCILIATION_REPORT.md` (new)

No Prisma, Next.js, `.env`, APP_KEY, live schema, or source data was changed.

## Schema Differences Resolved

All Prisma-domain scalar `String` fields whose Laravel definitions relied on the default length now explicitly use VARCHAR(191), matching the current source DDL. This covers:

- `User`: `name`, `email`, `passwordHash`.
- `Permission`: `key`, `description`; `ContributionArea`: `slug`; `Expertise`: `slug`, `name`; `Category`: `slug`, `name`; `Tag`: `slug`, `name`.
- `SiteSetting`: `key`, `description`; `NavigationItem`: `label`, `url`; `AuditLog`: `entity`, `entityId`, `ipAddress`, `userAgent`.
- `Media`: `filename`, `originalName`, `mimeType`, `storageKey`, `url`, `altText`.
- `Page`: `slug`, `title`, `heroTitle`, `heroDescription`, `seoTitle`; `ContributionAreaTranslation`: `title`.
- `Experience`: `slug`, `type`, `category`, `location`, `clientName`; `ExperienceTranslation`: `title`, `seoTitle`; `ExperienceMetric`: `label`, `value`, `unit`.
- `Person`: `slug`; `PersonTranslation`: `name`, `degree`, `role`.
- `Knowledge`: `slug`, `authorName`; `KnowledgeTranslation`: `title`, `seoTitle`.
- `Partner`: `name`, `slug`, `website`, `category`; `ContactMessage`: `name`, `email`, `organization`, `phone`, `subject`, `areaOfInterest`.
- `KnowledgeDownload`: `label`.

IDs/FK strings were already 191 and remain unchanged. Laravel-owned password-reset, session, cache, and queue table definitions were deliberately left framework-native.

## Remaining Schema Differences

- Framework tables (`password_reset_tokens`, `sessions`, `cache`, `cache_locks`, `jobs`, `job_batches`, `failed_jobs`) and Laravel's runtime `migrations` ledger remain Laravel-specific and are intentionally absent from Prisma.
- `_prisma_migrations` remains source-only. Laravel does not consume Prisma's migration ledger.
- Laravel generates ULIDs for new string IDs while Prisma generates CUIDs. Both fit VARCHAR(191); any future source-data importer must preserve existing primary and foreign key values.
- No live Laravel schema was created or compared because migrations were expressly prohibited. Physical MySQL index/FK behavior therefore remains unverified after the edits.

## KnowledgeType Status

- Current Prisma, Laravel PHP enum/DDL, current source SQL export, and live `antrabumi` use `ARTICLE`, `RESEARCH_PUBLICATION`, `STORY`.
- Historical values `RESEARCH`, `ASSESSMENT`, `REPORT`, `PUBLICATION`, `ARTICLE`, `STORY`, `INSIGHT` appear in the initial Prisma migration and the older `DATABASE_SCHEMA.md`. The checked-in enum update script narrows the database directly; it contains no mapping, and the narrowing is not represented in the checked-in Prisma migration history.
- Live source currently contains one row each of `ARTICLE`, `RESEARCH_PUBLICATION`, and `STORY`; no historical label is currently present. The enum was not changed by this task.
- No data migration/mapping was performed. A separate approved mapping and preflight is required for any older backup/source that contains removed enum labels; preserve original values until that is reviewed.

## Pivot Relationship Status

`ExperienceContributionArea` now uses only the composite FK pair and no selected pivot metadata. This matches Prisma/source DDL. There is no relationship-specific order in that table. If a page needs ordered contribution areas, it must use the existing `ContributionArea.order`; ordering experience links per experience would require a coordinated source-schema change and is not represented today.

## Feature Parity Status

Feature parity remains incomplete and is itemized in [FEATURE_PARITY_REMAINING.md](FEATURE_PARITY_REMAINING.md). In particular, Knowledge CRUD/public content, categories/taxonomy management, references, user administration, settings/home/hero editing, most admin workflows, public pages, content APIs, search, and import tooling remain absent or placeholders. Existing auth, dashboard, Experience CRUD, contact, and upload functionality is partial rather than full source parity.

## Validation

- `php -l` passed for all nine changed PHP migration/model/factory files.
- Search for default-length `$table->string('...')` definitions in the Laravel custom domain migrations returned no matches. Framework-native migrations were not normalized.
- Search confirmed no app/factory use of `remember_token`; remaining `withPivot('order')` references are for pivots that define the field.
- `php artisan config:show database` resolved to `mysql`, `127.0.0.1:3306`, database `antrabumi_laravel`.
- `php artisan route:list --except-vendor` passed.
- `php artisan migrate:status` returned exit code 1 and `ERROR  Migration table not found.` This confirms no Laravel migration ledger is present; no migration was applied.
- Tests that use `RefreshDatabase` were not run because they invoke migrations. No schema-writing checks were run.

## Remaining Migration Blockers

- The corrected migration definitions have not been applied or structurally verified against MySQL; doing so was explicitly out of scope. Test on a disposable MySQL database before applying to the intended target.
- Historical KnowledgeType conversion remains unresolved for old backups/replicas. It is not needed for the three values currently observed in live source, but import compatibility cannot be assumed for historical snapshots.
- Feature parity is documented but not delivered. If the goal is a schema-only Laravel target, this is a separate product readiness gate; it is not resolved by schema reconciliation.
- No data/file importer exists. Any source-data move still needs approved ID/creator mapping, FK-order handling, file-byte transfer and checksums, enum policy, count reconciliation, and a tested backup/restore procedure.
- Source safety depends on keeping Laravel configured and permissioned for `antrabumi_laravel`; all 30 domain table names already exist in `antrabumi`.

## Final GO / NO-GO

**NO-GO for running migrations now.** Domain widths, remember-token usage, and the identified pivot relation have been reconciled in code. However, physical schema/relationship behavior has not been verified on MySQL, legacy snapshot enum handling and data import are still open, and feature parity is incomplete. After reviewing those gates, validate on disposable MySQL first; only then consider a schema-only migration to the separate empty target. Never point Laravel migrations at source `antrabumi`.