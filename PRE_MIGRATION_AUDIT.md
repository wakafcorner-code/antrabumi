# ANTRABUMI Pre-Migration Database and Feature Audit

Audit date: 2026-10-02
Scope: read-only comparison of the Next.js/Prisma source and Laravel implementation.
**Recommendation: NO-GO for running the current Laravel migrations until the listed schema and compatibility issues are resolved.**

No migrations, seeders, tests, schema changes, or data-changing SQL were run. The only live database operations were SELECTs against `antrabumi` and `antrabumi_laravel` metadata and grouped Knowledge type counts. No source rows or secrets were read into this report.

## 1. Executive Summary

- Live source `antrabumi` has 30 application tables plus `_prisma_migrations`. All three checked-in Prisma migrations are recorded as completed. The live target `antrabumi_laravel` currently has no tables.
- All 30 Prisma domain tables have corresponding Laravel create-table definitions. Laravel also creates framework/auth/queue/cache tables that do not exist in the Prisma schema.
- The main domain column sets, primary keys, nullability, defaults, enum values (current Knowledge enum excepted historically), indexes/unique column sets, timestamps, and foreign-key actions are substantially aligned. There are important exceptions: Laravel's unqualified `string()` columns are VARCHAR(255), while Prisma's default String columns are VARCHAR(191); Laravel adds `User.remember_token`; and Eloquent requests an `order` column missing from `ExperienceContributionArea` in both schemas.
- Current source Knowledge data has exactly three rows: one each of `ARTICLE`, `RESEARCH_PUBLICATION`, and `STORY`. The current live enum and `database.sql` export allow those three values. The initial Prisma migration and `DATABASE_SCHEMA.md` document seven older values. The checked-in enum-update script narrows the enum without a mapping step, and no corresponding Prisma migration is recorded.
- Laravel does not yet provide feature parity or a data/file importer. Most Knowledge/People/Partner/admin CRUD and public content/API flows are placeholders. A schema migration alone will not migrate existing source content or uploaded file bytes.

## 2. Source Database and Schema Summary

Sources inspected: [`../prisma/schema.prisma`](../prisma/schema.prisma), all files under [`../prisma/migrations`](../prisma/migrations), [`../database.sql`](../database.sql), [`../DATABASE_SCHEMA.md`](../DATABASE_SCHEMA.md), [`../BUSINESS_RULES.md`](../BUSINESS_RULES.md), [`../MIGRATION_ANALYSIS.md`](../MIGRATION_ANALYSIS.md), and [`../prisma/seed.ts`](../prisma/seed.ts).

The current Prisma provider is MySQL. Its 30 domain entities are User, Permission, Page, ContributionArea, ContributionAreaTranslation, Experience, ExperienceTranslation, ExperienceMetric, ExperienceContributionArea, ExperienceMedia, Person, PersonTranslation, Expertise, PersonExpertise, Knowledge, KnowledgeTranslation, Category, KnowledgeCategory, Tag, KnowledgeTag, ExperienceKnowledge, KnowledgeContributionArea, KnowledgeDownload, KnowledgeMedia, Media, Partner, ContactMessage, NavigationItem, SiteSetting, and AuditLog.

Read-only live catalog results:

- `antrabumi`: 31 tables total, consisting of the 30 domain tables plus `_prisma_migrations`.
- `_prisma_migrations`: `20260921063149_init`, `20260929080308_add_category_to_experience`, and `20261001090000_add_knowledge_gallery` are finished and not rolled back.
- `Knowledge.type`: `ENUM('ARTICLE','RESEARCH_PUBLICATION','STORY')`; grouped row counts are 1, 1, and 1 respectively.
- `antrabumi_laravel`: no tables found at audit time.

The per-column source baseline is Prisma's current schema and the checked-in full SQL export. The live catalog check independently verified source/target table inventories, Prisma migration history, and the Knowledge enum/data values; this audit did not dump every live source column or foreign-key definition individually.

## 3. Laravel Schema and Feature Summary

Sources inspected: all seven Laravel migration files under [`database/migrations`](database/migrations), all Eloquent models under [`app/Models`](app/Models), all enums under [`app/Enums`](app/Enums), both seeders, `UserFactory`, `routes/web.php`, `routes/api.php`, request classes, and the relevant controllers/services. Laravel's migration tracking table named `migrations` is created by Laravel's migration repository when migrations are first run; it is not a Prisma domain table.

The migrations create the 30 domain tables plus framework tables for `password_reset_tokens`, `sessions`, `cache`, `cache_locks`, `jobs`, `job_batches`, and `failed_jobs`. `User` additionally has Laravel's `remember_token` column. `User.imageId` is constrained only after `Media` exists, avoiding the User/Media creation cycle. Reference tables precede media/content; pivot tables are last.

All application models use string primary keys. Prisma IDs are generated as CUIDs; Laravel's `UsesStringPrimaryKey` generates ULIDs for new Laravel records. Both fit VARCHAR(191), but an importer must preserve existing source IDs. Neither schema uses soft deletes; content retirement is represented by status/archive fields.

Implementation coverage is not equivalent to schema coverage: Experience CRUD is partly implemented; auth, contact, health, and media upload have implementations; Knowledge, Initiative, People, Partner and several other admin controllers inherit migration placeholders. Public pages are placeholders, content API routes return HTTP 501, and Search returns HTTP 501. No data/file importer was found.

## 4. Entity-by-Entity Comparison

Legend: **Aligned** means the entity/table, column names, PK/FK columns, nullability, defaults, timestamp columns, and index/unique column sets match the current Prisma/export definition, subject to the global VARCHAR width difference below. Any entity-specific deviation is stated. Index and foreign-key *names* are framework-generated and differ; their indexed/referenced columns and delete/update behavior are aligned unless noted.

| Source entity / table | Laravel comparison |
|---|---|
| `User` | Aligned core fields and role/status/auth enums. Width differences: `name`, `email`, `passwordHash`. Laravel-only `remember_token`. `imageId` FK is added after Media creation. |
| `Permission` | Aligned; `key` and `description` have the VARCHAR width difference. No role-permission relation exists in either schema. |
| `Page` | Aligned; `slug`, `title`, `heroTitle`, `heroDescription`, `seoTitle` have the width difference. Both media references are nullable/set-null. |
| `ContributionArea` | Aligned; `slug` has the width difference. |
| `ContributionAreaTranslation` | Aligned; `title` has the width difference. Translation unique key and parent/image FKs match. |
| `Experience` | Aligned after the Prisma category migration; `slug`, `type`, `category`, `location`, `clientName` have the width difference. |
| `ExperienceTranslation` | Aligned; `title` and `seoTitle` have the width difference. |
| `ExperienceMetric` | Aligned, including no timestamps and its experience FK. `label`, `value`, `unit` have the width difference. |
| `ExperienceContributionArea` | Table, composite PK and both cascading FKs align. Laravel relation methods incorrectly request pivot `order`, which neither schema defines. |
| `ExperienceMedia` | Aligned, including composite PK and `order` pivot field. |
| `Person` | Aligned; `slug` has the width difference. Creator/updater and optional image references match. |
| `PersonTranslation` | Aligned; `name`, `degree`, `role` have the width difference. |
| `Expertise` | Aligned; `slug` and `name` have the width difference. |
| `PersonExpertise` | Aligned, including composite PK and ordered pivot field. |
| `Knowledge` | Aligned to the **current** three-value enum; `slug` and `authorName` have the width difference. Historical enum discrepancy is detailed in section 5. |
| `KnowledgeTranslation` | Aligned; `title` and `seoTitle` have the width difference. Content/excerpt long-text types match. |
| `Category` | Aligned; `slug` and `name` have the width difference. |
| `KnowledgeCategory` | Aligned, including composite PK and cascading FKs. |
| `Tag` | Aligned; `slug` and `name` have the width difference. |
| `KnowledgeTag` | Aligned, including composite PK and cascading FKs. |
| `ExperienceKnowledge` | Aligned, including composite PK and cascading FKs. |
| `KnowledgeContributionArea` | Aligned, including composite PK and cascading FKs. |
| `KnowledgeDownload` | Aligned, including no timestamps and knowledge/media FKs; `label` has the width difference. |
| `KnowledgeMedia` | Aligned with the later Prisma gallery migration, including composite PK, `order`, and knowledge index. |
| `Media` | Aligned fields, nullable metadata, signed BIGINT size, indexes and uploader FK; `filename`, `originalName`, `mimeType`, `storageKey`, `url`, `altText` have the width difference. |
| `Partner` | Aligned; `name`, `slug`, `website`, `category` have the width difference. |
| `ContactMessage` | Aligned; `name`, `email`, `organization`, `phone`, `subject`, `areaOfInterest` have the width difference. Status/default/index/assignee FK match. |
| `NavigationItem` | Aligned; `label` and `url` have the width difference. Self-parent FK uses SET NULL in both. |
| `SiteSetting` | Aligned; `key` and `description` have the width difference. `value` remains nullable LONGTEXT. |
| `AuditLog` | Aligned; `entity`, `entityId`, `ipAddress`, `userAgent` have the width difference. JSON metadata and append-only `createdAt` semantics match. |

### Column type and constraint findings

- Prisma's unannotated `String` maps to VARCHAR(191) in the source SQL. Laravel's `$table->string()` defaults to VARCHAR(255). The differing columns are enumerated per entity above. All domain IDs and FK strings are explicitly length 191 in Laravel; Prisma strings annotated as TEXT/LONGTEXT and the BIGINT/INT/BOOLEAN/DATETIME(3)/JSON fields otherwise match.
- The width mismatch is wider in Laravel, not truncating during a source-to-Laravel copy. It is still schema drift: Laravel can accept values of 192-255 characters that the source schema does not, creating reverse-sync/import incompatibility. Unique/index definitions may also have different physical names and sizes.
- No source-domain column was found missing from Laravel's 30 domain tables. `User.remember_token` is the only extra column within those domain tables. Framework tables/columns are Laravel-only additions.
- No domain table is missing in Laravel. `_prisma_migrations` is a source-only migration ledger, not a domain entity; Laravel uses its own `migrations` ledger.
- Nullable fields, default values, created/updated timestamps, and semantic index/unique column sets match in the reviewed DDL, apart from the explicit additions/deviations above. No soft-delete columns exist in either schema.

## 5. Enum Comparison

| Enum | Current Prisma/source DB | Laravel migration/PHP enum | Result |
|---|---|---|---|
| `Language` | `ID`, `EN` | `ID`, `EN` | Match |
| `ContentStatus` | `DRAFT`, `REVIEW`, `PUBLISHED`, `ARCHIVED` | Same | Match |
| `UserStatus` | `ACTIVE`, `INACTIVE`, `SUSPENDED` | Same | Match |
| `Role` | `SUPER_ADMIN`, `ADMIN`, `EDITOR`, `AUTHOR` | Same | Match |
| `KnowledgeType` | `ARTICLE`, `RESEARCH_PUBLICATION`, `STORY` | Same three values | Current match; historical drift is a blocker for old backups/data |
| `MessageStatus` | `NEW`, `READ`, `IN_PROGRESS`, `RESOLVED`, `ARCHIVED` | Same | Match |
| `MediaType` | `IMAGE`, `DOCUMENT`, `VIDEO`, `AUDIO`, `OTHER` | Same | Match |
| `AuditAction` | `LOGIN`, `LOGOUT`, `CREATE`, `UPDATE`, `DELETE`, `PUBLISH`, `UNPUBLISH`, `ARCHIVE`, `UPLOAD`, `USER_ROLE_CHANGED`, `SETTING_CHANGED` | Same | Match |

Historical KnowledgeType evidence:

- The initial Prisma migration created `Knowledge.type` with `RESEARCH`, `ASSESSMENT`, `REPORT`, `PUBLICATION`, `ARTICLE`, `STORY`, `INSIGHT`.
- Current `prisma/schema.prisma`, Laravel enum/DDL, `database.sql`, and the live source database allow only `ARTICLE`, `RESEARCH_PUBLICATION`, `STORY`.
- The checked-in `scripts/update-knowledge-enum.js` executes a direct ALTER narrowing the enum. There is no checked-in Prisma migration recording this change and no data mapping in that script. `DATABASE_SCHEMA.md` still lists the seven historical values.
- Live source currently has one row for each of the three current values and no row with an old label. The current live enum cannot normally store the removed labels; an older DB, backup, replica, or export taken before the narrowing may contain them. No mapping is required for the three observed live values; an approved explicit mapping and a pre-conversion audit are required for any legacy source that has old values. Do not guess lossy mappings (for example, collapsing ASSESSMENT/REPORT/INSIGHT into RESEARCH_PUBLICATION/ARTICLE) without editorial approval and preservation of original values.

## 6. Relationship Comparison

- User image -> Media: optional, SET NULL; creator/updater relations for Experience, Knowledge, and Person; uploader for Media; assignee for ContactMessage; optional user on AuditLog. Delete rules match Prisma: creator/uploader RESTRICT, assignee/audit user SET NULL.
- Page hero/OG image, ContributionAreaTranslation image, Experience cover, Person image, Knowledge cover, and Partner logo are optional Media references with SET NULL in both schemas.
- Translations and child metrics/downloads cascade on parent delete. Knowledge/Experience/Person taxonomy and gallery pivots use matching composite keys and cascade FKs.
- `ExperienceContributionArea` is the exception: the source table and Laravel migration have only `experienceId` and `contributionAreaId`, but both `Experience::contributionAreas()` and `ContributionArea::experiences()` call `withPivot('order')`. Reads/syncs that request this pivot attribute can fail with an unknown-column error. Remove the incorrect pivot field reference or make a deliberate, coordinated Prisma/source-schema change before feature use; do not silently alter source schema.
- `Permission` is a key registry only. Neither schema has a role-permission pivot or FK; current authorization uses role enums/hard-coded middleware rather than database-backed permission assignments.
- FK creation order is valid for a clean target: User first, reference tables, Media, then content and translations, then pivots. User's Media FK is deferred until Media exists. No unresolved FK cycle was found in the migration order.
- Current Next auth is bcrypt password + JWT cookie; Laravel uses session auth and maps the existing `passwordHash` column via `getAuthPasswordName()`. Hash compatibility is plausible for bcrypt hashes but was not tested against actual credentials. Existing JWT cookies/sessions are not portable; Laravel sessions are separate.

## 7. Migration Conflicts and Feature/Seed Findings

- Every Laravel domain migration uses `Schema::create` for names already present in source. If Laravel is accidentally pointed at `antrabumi`, its `migrations` repository is not the Prisma `_prisma_migrations` ledger. Laravel will attempt to create its repository and then hit the existing `User` table in its first migration. MySQL DDL may not roll back atomically; never test Laravel migrations against source.
- The 30 existing domain tables are all potential create-name conflicts on source: User, Permission, Page, ContributionArea, ContributionAreaTranslation, Experience, ExperienceTranslation, ExperienceMetric, ExperienceContributionArea, ExperienceMedia, Person, PersonTranslation, Expertise, PersonExpertise, Knowledge, KnowledgeTranslation, Category, KnowledgeCategory, Tag, KnowledgeTag, ExperienceKnowledge, KnowledgeContributionArea, KnowledgeDownload, KnowledgeMedia, Media, Partner, ContactMessage, NavigationItem, SiteSetting, AuditLog.
- Laravel-only tables absent from source include `password_reset_tokens`, `sessions`, `cache`, `cache_locks`, `jobs`, `job_batches`, `failed_jobs`, plus the runtime Laravel `migrations` table. These are expected framework additions on a separate Laravel target; they are not source data replacements.
- Historical Prisma changes are: initial schema, add nullable `Experience.category`, add `KnowledgeMedia` gallery. All three checked-in migrations are applied on live source. The Knowledge enum alteration is outside that migration history. Current `schema.prisma` and SQL export include the category/gallery updates.
- `DatabaseSeeder` seeds permission keys, six Contribution Areas/translations, and empty SiteSetting keys; it conditionally calls `SuperAdminSeeder` only when both env variables exist. It does not seed Expertise, NavigationItem, source-supported experiences, or people that `prisma/seed.ts` seeds. Laravel `UserFactory` creates synthetic users and is test data only. The Prisma seed has fallback admin credentials (`admin@antrabumi.org` / `change-me-in-production`); do not run that seed on production or use its fallback.
- Laravel's Knowledge admin controller is still a placeholder despite the schema and request class. Public content API routes use `MigrationPendingController` (501); Search is 501; public pages render migration placeholders. Schema creation therefore does not imply functional feature migration.

## 8. Data-Loss and Compatibility Risks

1. Narrowing a historical Knowledge enum without inspecting/mapping values can fail or coerce legacy values depending on MySQL SQL mode. The update script has no backup, staged mapping, or verification. Preserve raw old values until a reviewed mapping is approved.
2. Laravel DDL is create-only and collides with all 30 source domain table names. A wrong DB target can mutate migration metadata before the first create-table conflict; source protection must be configuration/credential-level, not a hope that the migration fails.
3. Laravel's wider VARCHAR limits permit values the Prisma schema cannot store. Align widths before accepting writes from Laravel if data may return to or be shared with Next.js.
4. Creator/updater/uploader IDs are required FKs. Imports must preserve IDs and ensure valid User records before dependent content/media; update User image references after Media records to handle the User/Media cycle.
5. Media metadata does not contain file bytes. `database.sql`/Prisma exports alone cannot migrate files; copy and verify every referenced storage object separately, retaining `storageKey`/URL mapping and handling missing files.
6. Existing `passwordHash` can be retained, but real bcrypt verification, session expiry, role/status enforcement and user lockout behavior need integration tests. Existing Next JWT sessions will not transfer.
7. Laravel migration `down()` methods drop the created tables. Do not use rollback against a database containing imported/production data without a verified restore plan.
8. No Laravel data importer or reconciliation tool was found. Applying DDL creates an empty Laravel schema; it does not copy source data or files.

## 9. Required Changes Before Migration

- Make a schema decision for the 191-vs-255 string columns and align Laravel migration definitions to the source if Prisma/Laravel must remain interoperable. Keep the explicit 191 width for CUID/FK fields.
- Correct the `ExperienceContributionArea` Eloquent `withPivot('order')` declarations (or approve and implement a synchronized source-schema/migration addition; source currently has no such column).
- Document `User.remember_token` as an intentional Laravel-only auth extension, or remove it if not needed. Keep Laravel-only framework/session tables isolated to the Laravel target.
- Reconcile `DATABASE_SCHEMA.md`, the initial migration history, current schema/export, and the ad-hoc Knowledge enum script. Add a reviewed legacy-value mapping/import check before any old backup/data import.
- Confirm whether the migration objective is schema-only setup or includes content/data migration. The current Laravel migrations are schema-only; define a separate importer, ID preservation, creator/user mapping, FK ordering, and media-byte copy/checksum verification before data cutover.
- Complete or explicitly defer the documented placeholder features; do not represent the Laravel CMS/API as equivalent until these flows are implemented and tested.
- Before any command that writes schema, assert `DB_DATABASE=antrabumi_laravel` using Laravel-resolved config and a live `SELECT DATABASE()`. Use a least-privilege local credential that has no write grants on `antrabumi` if possible.

## 10. Safe Migration Sequence

1. Keep source `antrabumi` read-only; take and verify a restorable source DB and upload-file backup before planning any data transfer. Do not use it as the Laravel migration target.
2. Correct/approve the DDL-width and pivot mismatch, settle the auth-only column decision, and commit/document the Knowledge legacy mapping. Do not alter Prisma source schema casually to accommodate Laravel.
3. Validate the corrected migrations against a disposable MySQL database with a matching MySQL version/collation. Verify all table/column/index/enum/FK definitions, migration order, and fresh rollback behavior there only.
4. Reconfirm the target is the empty `antrabumi_laravel`, with resolved driver/host/port/database and live `SELECT DATABASE()`; do not auto-create databases or change credentials.
5. Only after review, run Laravel schema migrations on `antrabumi_laravel` alone and verify the resulting schema. Keep schema migration separate from seed execution and data import.
6. For any later import, stage from a backup: preserve source IDs and password hashes; create users with imageId unset, copy/verify file bytes and Media rows, then restore image references; import parent content/translations and finally pivots/assignments/messages/audit with FK checks. Apply only an approved KnowledgeType mapping and reconcile source/target counts plus broken references before cutover.

## 11. GO / NO-GO Recommendation

**NO-GO for running the current Laravel migrations now.** The target is confirmed empty and distinct from the source, so a corrected schema-only migration can eventually be isolated from existing ANTRABUMI data. However, the present migration/model set has known parity defects (VARCHAR widths and the nonexistent `ExperienceContributionArea.order` pivot attribute), and historical KnowledgeType handling is undocumented in the migration ledger. Resolve these and validate on disposable MySQL first. Never point Laravel migrations or seeders at source `antrabumi`; do not run migrations as part of this audit.