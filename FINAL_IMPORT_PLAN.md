# Final Production Import Plan

Status: **PREPARED — NOT AUTHORIZED OR EXECUTED**. This document and the production importer do not modify the database. The separate disposable import remains the only completed data import test.

## Scope and Safety

- Source database is exactly `antrabumi`; the importer checks the configured source URL and `SELECT DATABASE()` on its read-only PDO connection.
- Production target is exactly `antrabumi_laravel`; the importer checks the configured Laravel MySQL database and `SELECT DATABASE()` on the active connection.
- The importer rejects `antrabumi_migration_test_2` and every other target.
- It never creates databases, runs migrations, runs seeders, or drops/truncates tables. Production schema migrations must already match the seven-entry reviewed ledger.
- The importer is gated by both `--execute` and `--confirm-target=antrabumi_laravel`. Without either, it refuses execution. It also requires all 30 domain tables to exist and be empty.
- Source PDO runs `SET SESSION TRANSACTION READ ONLY`; it reads source records/metadata with `SELECT` and ends the transaction without source writes.
- No physical media files are accessed. Media records keep source IDs, `storageKey`, `url`, metadata, and relationships unchanged.

## Preflight

When run after explicit approval, the script prints a JSON preflight report before any target write. It includes:

- Configured and active source/target database identities.
- The number of domain tables (30) and the exact Laravel migration ledger/status.
- Source and target row counts for each domain table.
- Whether all 30 target domain tables are empty.
- Any guard failures.

Preflight stops before the first INSERT if the active/configured database name differs, the migration ledger differs, a table is missing or nonempty, source row counts differ from the reviewed 230-row baseline, or source fields are incompatible with the target schema. No `migrate:fresh` is used.

Connection identity was checked read-only while preparing this plan: source config returned `antrabumi`; Laravel config and `SELECT DATABASE()` returned `antrabumi_laravel`. This identity check did not inspect or change production rows. Target emptiness is intentionally checked by the importer at execution time and is not assumed from `.env` or this plan.

## Import Order

The production script follows the order proven by the disposable importer:

1. `User`, `Permission`, `ContributionArea`, `Expertise`, `Category`, `Tag`, `SiteSetting`, `NavigationItem`.
2. `Media` metadata, then `Page`, `Experience`, `Person`, `Knowledge`, `Partner`.
3. `ContributionAreaTranslation`, `ExperienceTranslation`, `ExperienceMetric`, `PersonTranslation`, `KnowledgeTranslation`.
4. `ExperienceContributionArea`, `ExperienceMedia`, `PersonExpertise`, `KnowledgeCategory`, `KnowledgeTag`, `ExperienceKnowledge`, `KnowledgeContributionArea`, `KnowledgeDownload`, `KnowledgeMedia`.
5. `ContactMessage`, then `AuditLog`.

All 30 table names, current expected counts (230 total), eight composite key definitions, and the ordering are copied from the successful disposable import baseline. Existing IDs are inserted with the query builder, bypassing ULID generation and password casts. The User/Media image cycle and NavigationItem self-reference use a temporary NULL then target-only restoration inside the transaction; source values are never changed.

## Transaction and Verification

After every preflight guard passes, all target inserts, deferred relationship restoration, and post-import checks execute inside one target transaction. Any exception or failed check rolls back that transaction. The source read transaction is read-only and is closed before target writes.

Before commit, the production importer checks:

- Source/target counts for every domain table.
- Exact ID sets and all eight composite-key sets.
- Equality of every source field, including foreign keys, NULLs, metadata, URLs, keys, and timestamps.
- Source/target FK graph equality and source/target orphan references.
- Enum/value distributions without conversion.
- Timestamp equality.
- Domain unique-index signatures.
- Every source password hash byte-for-byte, including its expected length/prefix.
- All 19 Media rows and safe public-key resolver results. No login with a real credential is attempted.

A JSON result is printed only after successful commit. Physical media remains explicitly pending; a successful row import does not mark files transferred.

## Rollback Plan

- Before commit, the importer transaction rolls back all target inserts/updates on any error. The script does not issue DROP or TRUNCATE.
- After a successful commit, do not attempt ad hoc row deletion or rerun the importer; its empty-target guard will reject the populated target. Stop application cutover and use the separately approved production backup/restore procedure to restore the pre-import target state.
- The source is never part of rollback. Do not change source data or media files.
- Retain the command output and database backup/restore records with the import report.

## Media Transfer Pending

- Source upload directory is **UNKNOWN**. The source code default `process.cwd()/public/uploads` does not establish the runtime host path. Verify the authoritative absolute source-host path with the operator/cPanel File Manager before any file access.
- A later, separately authorized media transfer must build a source checksum manifest, copy to the resolver destination `storage/app/public/uploads/<storageKey>`, calculate destination SHA-256, compare size and checksum, and only then mark the file verified.
- Do not copy, move, rename, hash, or delete source files during this database import. Do not copy files to production as part of this plan.

## Command After Explicit Approval

From the Laravel project directory, the exact write command will be:

```powershell
php scripts/import-production-data.php --execute --confirm-target=antrabumi_laravel
```

This command has **not** been run. A read-only connection identity check passed during preparation; all migration-ledger and empty-target guards will be rechecked by the importer immediately before it can write. Production import requires separate explicit approval.
