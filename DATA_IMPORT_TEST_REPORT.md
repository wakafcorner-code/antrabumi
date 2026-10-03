# ANTRABUMI Full Data Import Test Report

Date: 2026-10-02
Overall result: **PASS WITH WARNINGS**

## Scope and Safety

- Source: `antrabumi` (verified by Prisma `SELECT DATABASE()`; importer used a read-only transaction).
- Target: `antrabumi_migration_test_2` (verified as the active target before import).
- Source modified: **NO**. Source queries were SELECT-only inside a read-only transaction.
- Disposable target modified: **YES**. The seven Laravel migrations and the 230 source domain rows were applied here.
- Production target `antrabumi_laravel` modified: **NO**. Laravel's default database name was overridden only in the import process; the import script refuses any active target other than `antrabumi_migration_test_2`.
- No data was imported into `antrabumi_laravel`. No seeder or `migrate:fresh` was run. No source media files were read, copied, moved, renamed, or deleted.

The disposable schema already existed and had no tables. The reconciled Laravel migrations ran normally; `migrate:status` then showed all seven migrations as ran in batch 1. The importer also verifies the exact migration ledger, refuses nonempty domain tables, and wraps target inserts/restoration/verification in one transaction.

## Row Counts

| Table | Source Rows | Target Rows | Difference | Status |
|---|---:|---:|---:|---|
| User | 2 | 2 | 0 | PASS |
| Permission | 18 | 18 | 0 | PASS |
| Page | 0 | 0 | 0 | PASS |
| ContributionArea | 6 | 6 | 0 | PASS |
| ContributionAreaTranslation | 12 | 12 | 0 | PASS |
| Experience | 5 | 5 | 0 | PASS |
| ExperienceTranslation | 10 | 10 | 0 | PASS |
| ExperienceMetric | 0 | 0 | 0 | PASS |
| ExperienceContributionArea | 0 | 0 | 0 | PASS |
| ExperienceMedia | 1 | 1 | 0 | PASS |
| Person | 8 | 8 | 0 | PASS |
| PersonTranslation | 16 | 16 | 0 | PASS |
| Expertise | 8 | 8 | 0 | PASS |
| PersonExpertise | 0 | 0 | 0 | PASS |
| Knowledge | 3 | 3 | 0 | PASS |
| KnowledgeTranslation | 6 | 6 | 0 | PASS |
| Category | 0 | 0 | 0 | PASS |
| KnowledgeCategory | 0 | 0 | 0 | PASS |
| Tag | 0 | 0 | 0 | PASS |
| KnowledgeTag | 0 | 0 | 0 | PASS |
| ExperienceKnowledge | 0 | 0 | 0 | PASS |
| KnowledgeContributionArea | 0 | 0 | 0 | PASS |
| KnowledgeDownload | 2 | 2 | 0 | PASS |
| KnowledgeMedia | 3 | 3 | 0 | PASS |
| Media | 19 | 19 | 0 | PASS |
| Partner | 0 | 0 | 0 | PASS |
| ContactMessage | 2 | 2 | 0 | PASS |
| NavigationItem | 8 | 8 | 0 | PASS |
| SiteSetting | 28 | 28 | 0 | PASS |
| AuditLog | 73 | 73 | 0 | PASS |
| **Total** | **230** | **230** | **0** | **PASS** |

## Integrity Results

- **IDs:** All 22 ID-primary-key table ID sets matched. Missing IDs: 0. Extra IDs: 0.
- **Composite keys:** All eight pivot composite key sets matched exactly. Missing keys: 0. Extra keys: 0.
- **All source fields:** Every source row was compared against its target row by primary key, across all source columns. Mismatched values: 0 for every table.
- **Foreign keys:** 41 source and 41 target FK definitions; graph signatures match. Source orphan references: 0. Target orphan references: 0.
- **Enums:** All source/target enum value distributions match. `Knowledge.type`: `ARTICLE` 1, `RESEARCH_PUBLICATION` 1, `STORY` 1. No enum conversions were applied.
- **Timestamps:** 375 `createdAt`/`updatedAt` values compared. Differences: 0. Source values were inserted as raw PDO values; import-time timestamps were not substituted.
- **Unique constraints:** 16 source and 16 target non-primary unique-index signatures match for the 30 domain tables. All 230 rows inserted without a unique-key collision, and full source-field comparison found no lost/changed rows.

## Passwords

- Two source user hashes were checked. Both target hashes have length 60, retain the `$2b$12$` prefix, and match the source hashes byte-for-byte.
- Imported values bypassed Eloquent models/casts through the query builder; no password was reset, generated, or double-hashed.
- No source plaintext credentials were available, so real source-account login was not attempted. The existing isolated synthetic compatibility test had already verified correct-password PASS and incorrect-password FAIL through the legacy-compatible provider.

## Media

- Media database rows: **19**. IDs, `storageKey`, `url`, metadata, uploader IDs, and related source fields match exactly.
- Resolver paths: **19 resolved**, 0 rejected as unsafe.
- Media relationships remain unchanged; all corresponding FKs passed the 41-edge orphan validation.
- Physical media transferred: **0**. Physical media pending transfer: **19**.
- The authoritative source-host upload path remains **UNKNOWN**. The media plan records the workspace candidate separately; it is not treated as the authoritative source path. No checksum procedure was run.

## Application Checks

Read-only Laravel database checks against the disposable target returned:

- User lookup rows: 2.
- Published Knowledge: 3; published Experiences: 5; published People: 8; published Partners: 0.
- Media metadata rows: 19; Contact records: 2.
- Dashboard table counts: User 2, Experience 5, Person 8, Knowledge 3, Media 19, ContactMessage 2, AuditLog 73.

No login request was submitted because it would require a real password and session handling; no source password was requested or exposed.

## Errors and Warnings

- Two initial importer verification attempts rolled back fully inside the disposable target transaction: one exposed case-folded `information_schema` table names, and one compared unrelated Laravel framework unique indexes. The importer was corrected to normalize table names and limit unique-index checks to the 30 domain tables; the final run passed. The target was confirmed empty after the rolled-back attempts.
- Physical media and checksum verification remain pending until the source-host path is explicitly confirmed and a separate transfer is authorized.
- Git status/diff could not be produced because this workspace has no Git metadata.

## Changed Files

- `laravel/scripts/import-disposable-test-data.php` — guarded test-only importer and verification routine.
- `laravel/DATA_IMPORT_TEST_REPORT.md` — this report.

**PRODUCTION TARGET `antrabumi_laravel` WAS NOT MODIFIED.**