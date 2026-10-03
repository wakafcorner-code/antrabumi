# Disposable MySQL Migration Test Report

Date: 2026-10-02
Scope: schema-only Laravel migration rehearsal on the disposable local database.
**Final result: PASS** (for this local disposable migration test only).

## Database Used

- Migration target: `antrabumi_migration_test` (`mysql`, `127.0.0.1:3306`).
- Confirmed present before the run and had zero tables.
- Source database `antrabumi` was not modified or used as the migration target.
- Existing Laravel target `antrabumi_laravel` was not migrated or modified.
- No source data was imported and no seeder was run.

## Migration Result

`php artisan migrate --force` completed successfully. Seven Laravel migration files ran in batch 1; no migration failed.

```text
INFO  Preparing database.

Creating migration table ...................................... 16.12ms DONE

INFO  Running migrations.

0001_01_01_000000_create_users_table .......................... 63.97ms DONE
0001_01_01_000001_create_cache_table .......................... 13.70ms DONE
0001_01_01_000002_create_jobs_table ........................... 46.20ms DONE
2026_10_02_000001_create_reference_and_settings_tables ....... 252.25ms DONE
2026_10_02_000002_create_media_table .......................... 70.67ms DONE
2026_10_02_000003_create_content_tables ............................ 1s DONE
2026_10_02_000004_create_content_pivots ...................... 618.93ms DONE
```

Pre-migration `php artisan migrate:status` returned `ERROR Migration table not found.` (exit code 1), as expected for the empty database. After migration, all seven migrations showed `[1] Ran`; there were no pending or failed migration rows.

## Schema Verification

Read-only `INFORMATION_SCHEMA` inspection confirmed the selected schema is `antrabumi_migration_test` and found 38 tables:

- All 30 Laravel domain tables were present.
- Seven framework tables were present: `password_reset_tokens`, `sessions`, `cache`, `cache_locks`, `jobs`, `job_batches`, `failed_jobs`.
- Laravel's `migrations` table was present.

Verification findings:

- Primary keys exist on all tables. Composite primary keys were confirmed on `ExperienceContributionArea`, `ExperienceMedia`, `PersonExpertise`, `KnowledgeCategory`, `KnowledgeTag`, `ExperienceKnowledge`, `KnowledgeContributionArea`, and `KnowledgeMedia`.
- All 41 foreign keys were present. Delete actions: 23 CASCADE, 7 RESTRICT, 11 SET NULL. All use ON UPDATE CASCADE.
- Primary/unique/secondary indexes were present in `INFORMATION_SCHEMA.STATISTICS`; inspected unique keys include unique slugs, email/setting/permission keys, language-scoped translation pairs, and pivot composite keys.
- All 19 enum columns were inspected. They contain the defined Language, ContentStatus, UserStatus, Role, KnowledgeType, MessageStatus, MediaType, and AuditAction values. `Knowledge.type` is exactly `ARTICLE`, `RESEARCH_PUBLICATION`, `STORY`; it was not converted.
- A read-only check found no Prisma-domain VARCHAR column with a length other than 191.
- All 21 Prisma-domain TEXT/LONGTEXT columns were present with the expected types; nullable and non-nullable fields were inspected.
- Domain `createdAt`/`updatedAt` and publication/login timestamps use `DATETIME(3)` where defined. `createdAt` has the expected CURRENT_TIMESTAMP(3) default; `updatedAt` is required with no database default, matching the migrations.
- `ExperienceContributionArea` contains only `experienceId` and `contributionAreaId`; no `order` column exists. Other pivots retain only their schema-defined fields, including order where specified.
- The `User` table has no `remember_token` column.

## Warnings

- This verifies migrations on the local XAMPP MySQL server only; production MySQL/MariaDB version, collation, and Linux table-name case behavior were not tested.
- No application tests or seeders were run. This was a schema-only rehearsal.
- Historical KnowledgeType values in old backups remain a separate data-import concern; this test did not import or convert data.
- Passing this disposable migration test does not authorize running migrations against `antrabumi` or `antrabumi_laravel`.

## Environment Restoration

After migration and inspection, `.env` was restored to `DB_DATABASE=antrabumi_laravel`; `php artisan config:clear` succeeded. Final `php artisan config:show database` resolves the default connection as MySQL at `127.0.0.1:3306` with database `antrabumi_laravel`. The existing `APP_KEY` was preserved.