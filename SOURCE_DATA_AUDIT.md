# ANTRABUMI Source Data Audit

Audit date: 2026-10-02
Scope: read-only inspection of source database `antrabumi` and empty Laravel target `antrabumi_laravel`.
**No source data was changed, and no data import was performed.** Queries were SELECT-only; Laravel `.env` was not changed.

## Database Inventory

- Source server: MariaDB `10.4.32`, `lower_case_table_names=1`, session timezone `SYSTEM`.
- Source database default charset/collation: `utf8mb4` / `utf8mb4_general_ci`; all 31 source base tables use `utf8mb4_unicode_ci`.
- Source table count: **31** total: 30 application/domain tables plus `_prisma_migrations`.
- Source Prisma ledger contains three applied migrations: initial schema, Experience category, Knowledge gallery.
- Domain row count: **230** across the 30 tables below. `_prisma_migrations` is a schema-history table and is not included in the domain count or import.
- `antrabumi_laravel` exists and has **zero tables** at audit time. It remains unmodified.
- All counts and relationship summaries below came from the live source database, not just the checked-in SQL export.

## Source Row Counts and Primary Keys

| Source table | Rows | State | Primary key |
|---|---:|---|---|
| `AuditLog` | 73 | Non-empty | `id` (CUID) |
| `Category` | 0 | Empty | `id` (CUID) |
| `ContactMessage` | 2 | Non-empty | `id` (CUID) |
| `ContributionArea` | 6 | Non-empty | `id` (CUID) |
| `ContributionAreaTranslation` | 12 | Non-empty | `id` (CUID) |
| `Experience` | 5 | Non-empty | `id` (CUID) |
| `ExperienceContributionArea` | 0 | Empty | (`experienceId`, `contributionAreaId`) |
| `ExperienceKnowledge` | 0 | Empty | (`experienceId`, `knowledgeId`) |
| `ExperienceMedia` | 1 | Non-empty | (`experienceId`, `mediaId`) |
| `ExperienceMetric` | 0 | Empty | `id` (CUID) |
| `ExperienceTranslation` | 10 | Non-empty | `id` (CUID) |
| `Expertise` | 8 | Non-empty | `id` (CUID) |
| `Knowledge` | 3 | Non-empty | `id` (CUID) |
| `KnowledgeCategory` | 0 | Empty | (`knowledgeId`, `categoryId`) |
| `KnowledgeContributionArea` | 0 | Empty | (`knowledgeId`, `contributionAreaId`) |
| `KnowledgeDownload` | 2 | Non-empty | `id` (CUID) |
| `KnowledgeMedia` | 3 | Non-empty | (`knowledgeId`, `mediaId`) |
| `KnowledgeTag` | 0 | Empty | (`knowledgeId`, `tagId`) |
| `KnowledgeTranslation` | 6 | Non-empty | `id` (CUID) |
| `Media` | 19 | Non-empty | `id` (CUID) |
| `NavigationItem` | 8 | Non-empty | `id` (CUID) |
| `Page` | 0 | Empty | `id` (CUID) |
| `Partner` | 0 | Empty | `id` (CUID) |
| `Permission` | 18 | Non-empty | `id` (CUID) |
| `Person` | 8 | Non-empty | `id` (CUID) |
| `PersonExpertise` | 0 | Empty | (`personId`, `expertiseId`) |
| `PersonTranslation` | 16 | Non-empty | `id` (CUID) |
| `SiteSetting` | 28 | Non-empty | `id` (CUID) |
| `Tag` | 0 | Empty | `id` (CUID) |
| `User` | 2 | Non-empty | `id` (CUID) |

There are **11 empty** and **19 non-empty** domain tables. The eight composite-key tables are pivots and have no standalone `id` column.

## Foreign-Key Dependency Graph

The live source has **41 foreign keys**: 23 `ON DELETE CASCADE`, 7 `RESTRICT`, and 11 `SET NULL`; all 41 use `ON UPDATE CASCADE`.

Dependencies below are `dependent table -> referenced parent table(s)`:

- `User -> Media` (`imageId`, optional; current non-null count 0).
- `Media -> User` (`uploadedById`, required): this and `User.imageId` form a schema-level cycle. Current User rows do not reference images, so import Users with the source null value; if future source rows do reference images, import User first with `imageId=NULL`, import Media, then restore `imageId` in a second pass.
- `Page -> Media` (hero and OG image, optional; Page currently empty).
- `ContributionAreaTranslation -> ContributionArea, Media` (translation image optional).
- `Experience -> User, Media` (creator/updater required; cover optional).
- `ExperienceTranslation -> Experience`.
- `ExperienceMetric -> Experience`.
- `ExperienceContributionArea -> Experience, ContributionArea`.
- `ExperienceMedia -> Experience, Media`.
- `Person -> User, Media` (creator/updater required; image optional).
- `PersonTranslation -> Person`.
- `PersonExpertise -> Person, Expertise`.
- `Knowledge -> User, Media` (creator/updater required; cover optional).
- `KnowledgeTranslation -> Knowledge`.
- `KnowledgeCategory -> Knowledge, Category`.
- `KnowledgeTag -> Knowledge, Tag`.
- `ExperienceKnowledge -> Experience, Knowledge`.
- `KnowledgeContributionArea -> Knowledge, ContributionArea`.
- `KnowledgeDownload -> Knowledge, Media`.
- `KnowledgeMedia -> Knowledge, Media`.
- `Partner -> Media` (logo optional; Partner currently empty).
- `ContactMessage -> User` (optional assignee; current assigned count 0).
- `NavigationItem -> NavigationItem` (optional parent). Current 8 rows have no parent references and no broken parent references.
- `AuditLog -> User` (optional user; all 73 current audit rows have a user reference).
- `ContributionArea`, `Permission`, `Expertise`, `Category`, `Tag`, and `SiteSetting` have no outgoing foreign keys.

Every referenced parent row is constrained by a live FK. The import still needs anti-join/count validation after transfer; do not rely on disabling FK checks as a substitute.

## Nullability and Timestamps

Live `INFORMATION_SCHEMA.COLUMNS` inspection confirmed nullable fields match the current source model. Nullable-column inventory:

| Table | Nullable columns |
|---|---|
| `User` | `passwordHash`, `imageId`, `lastLoginAt` |
| `Permission` | `description` |
| `Page` | `excerpt`, `content`, `heroTitle`, `heroDescription`, `heroMediaId`, `seoTitle`, `seoDescription`, `ogImageId`, `publishedAt` |
| `ContributionAreaTranslation` | `description`, `imageId` |
| `Experience` | `year`, `location`, `clientName`, `coverMediaId`, `publishedAt`, `category` |
| `ExperienceTranslation` | `excerpt`, `description`, `methodology`, `impact`, `seoTitle`, `seoDescription` |
| `ExperienceMetric` | `unit` |
| `Person` | `imageId` |
| `PersonTranslation` | `degree`, `role`, `biography` |
| `Knowledge` | `coverMediaId`, `authorName`, `publicationDate`, `publishedAt` |
| `KnowledgeTranslation` | `excerpt`, `content`, `seoTitle`, `seoDescription` |
| `Category` | `description` |
| `KnowledgeDownload` | `label` |
| `Media` | `originalName`, `width`, `height`, `url`, `altText`, `caption`, `attribution` |
| `Partner` | `description`, `logoMediaId`, `website`, `category` |
| `ContactMessage` | `organization`, `phone`, `areaOfInterest`, `assignedToId` |
| `NavigationItem` | `url`, `parentId` |
| `SiteSetting` | `value`, `language`, `description` |
| `AuditLog` | `userId`, `entity`, `entityId`, `metadata`, `ipAddress`, `userAgent` |

The source has 47 `DATETIME(3)` columns and no lower-precision timestamp columns. `DATETIME` itself carries no timezone. Exact preservation is possible by importing source timestamp text at millisecond precision into the matching target `DATETIME(3)` columns, without timezone conversion. Do not let Eloquent replace `createdAt`/`updatedAt` with import-time timestamps; use raw/bulk inserts with explicit timestamp values.

## Enums and Values Present

Current enum definitions and observed source rows:

| Enum | Values allowed by live source | Values actually present |
|---|---|---|
| `Role` | `SUPER_ADMIN`, `ADMIN`, `EDITOR`, `AUTHOR` | `SUPER_ADMIN` 1; `ADMIN` 1 |
| `UserStatus` | `ACTIVE`, `INACTIVE`, `SUSPENDED` | `ACTIVE` 2 |
| `ContentStatus` | `DRAFT`, `REVIEW`, `PUBLISHED`, `ARCHIVED` | `DRAFT` 6; `PUBLISHED` 16 |
| `Language` | `ID`, `EN` | `ID` 26; `EN` 26 across translation/navigation rows |
| `KnowledgeType` | `ARTICLE`, `RESEARCH_PUBLICATION`, `STORY` | one row of each |
| `MediaType` | `IMAGE`, `DOCUMENT`, `VIDEO`, `AUDIO`, `OTHER` | `IMAGE` 14; `DOCUMENT` 5 |
| `MessageStatus` | `NEW`, `READ`, `IN_PROGRESS`, `RESOLVED`, `ARCHIVED` | `NEW` 1; `READ` 1 |
| `AuditAction` | `LOGIN`, `LOGOUT`, `CREATE`, `UPDATE`, `DELETE`, `PUBLISH`, `UNPUBLISH`, `ARCHIVE`, `UPLOAD`, `USER_ROLE_CHANGED`, `SETTING_CHANGED` | `CREATE` 4; `LOGIN` 5; `LOGOUT` 3; `PUBLISH` 7; `UPDATE` 35; `UPLOAD` 19 |

Historical KnowledgeType values `RESEARCH`, `ASSESSMENT`, `REPORT`, `PUBLICATION`, `ARTICLE`, `STORY`, `INSIGHT` appear in the initial Prisma migration and older `DATABASE_SCHEMA.md`, but not in the current live enum or current source rows. The direct enum-narrowing script has no value mapping. No enum or row was changed by this audit. Older backups need a separate old-value scan and approved mapping before import.

## User and Authentication Findings

- Source `User` contains 2 users: one `SUPER_ADMIN` and one `ADMIN`; both are `ACTIVE`. Neither has a profile image or missing password hash.
- Both `passwordHash` values are bcrypt-style `$2b$12$` hashes, length 60. Raw hash strings and plaintext passwords were not disclosed; only prefix/length/cost metadata was recorded.
- Source password hashing code uses `bcryptjs` with 12 rounds.
- Laravel auth reads `passwordHash` through `getAuthPasswordName()`. Effective Laravel hashing config currently has `bcrypt.verify=true` and `rehash_on_login=true`.
- A synthetic-only probe showed native PHP `password_verify()` accepts a `$2b$` bcrypt hash. Laravel's current strict bcrypt hasher rejects `$2b$` with `This password does not use the Bcrypt algorithm`; `Hash::info()` classifies that prefix as unknown. A synthetic `$2b$` hash passes Laravel's bcrypt check only when strict algorithm verification is disabled. Laravel also reports such hashes need rehash, so allowing login with rehash-on-login enabled may rewrite the stored hash.
- Therefore the existing passwords need **no plaintext/password reset**, but Laravel's current authentication settings are not compatible with the imported prefix. Before importing users, choose and test a target-only compatibility policy: e.g. a reviewed `$2b$` to `$2y$` prefix normalization during copy, or compatible verification configuration plus an explicit rehash-on-login policy. The source hashes must remain untouched. Real-user password verification cannot be proven without a known authorized test credential.
- `UsesStringPrimaryKey` generates a ULID only when no key is set. However, normal model mass assignment guards `id` (`BaseModel::$guarded=['id']`; `User::$fillable` omits it), and `passwordHash` has Laravel's `hashed` cast. Importing through regular `Model::create()` is unsafe for exact ID/hash preservation. Use a controlled raw query-builder bulk insert (or a carefully audited force-fill/raw-attribute path) with source IDs/hashes explicitly supplied and import-time timestamps explicitly set.

## Media and Physical Files

- Source `Media` has 19 rows: 14 images and 5 PDFs. All 19 have a `storageKey`, URL, original filename, uploader, and nonzero size. All lack width, height, alt text, caption, and attribution.
- The source storage driver writes to `<Next.js project root>/public/uploads` and returns a basename-only `storageKey` plus `/uploads/<basename>` URL.
- All 19 current `storageKey` basenames match files present in this workspace's root `public/uploads`. Those uploads are excluded from Git by the root `.gitignore`; they may be absent from a clone/deployment artifact and must be separately obtained from the actual source host/backup.
- Laravel's `storage/app/public` currently contains no source files; `laravel/public/storage` is not a populated storage link. Laravel `MediaStorageService` writes to `storage/app/public/uploads/<generated-name>` and its media endpoint expects `storageKey` beginning `uploads/`, served under `/media-file/...`.
- Current media relationships: 1 Experience cover, 1 Experience gallery link, 1 Person image, 2 Knowledge covers, 3 Knowledge gallery links, and 2 Knowledge downloads, totaling 10 links across six relationship categories. User images, page media, contribution-area images, and partner logos are 0. Media IDs may be shared; do not infer unique file count from relationship count.
- A later importer must copy/verify the 19 file bytes separately, checksum them, preserve basenames, place them under Laravel's public disk `uploads/`, transform `storageKey` from `<basename>` to `uploads/<basename>`, and update URL values to Laravel's media route/disk URL. Do not copy files as part of this audit.

## Settings, References, Content, and Audit Data

- `SiteSetting`: 28 rows; 12 values are NULL, 16 non-NULL; all current `language` values are NULL. Preserve key/value/description and NULLs; do not parse/re-serialize LONGTEXT settings implicitly.
- References: 18 Permission rows, 6 ContributionArea rows, 8 Expertise rows; Category and Tag are empty. No PersonExpertise or ExperienceContributionArea rows exist.
- Content: 5 Experience rows with 10 translations; 8 Person rows with 16 translations; 3 Knowledge rows with 6 translations. Page and Partner are empty. ExperienceKnowledge, KnowledgeCategory, KnowledgeTag, and KnowledgeContributionArea are empty.
- ContactMessage: 2 rows (`NEW` 1, `READ` 1); none are assigned. Treat message body/contact information as sensitive.
- AuditLog: 73 rows, all linked to a User, all with non-NULL metadata. Preserve metadata as valid JSON and do not expose it in logs/reports.
- NavigationItem: 8 rows; none has a parent. Its self-FK must still be handled safely for future/non-current parented rows.

## Potential Data-Loss and Compatibility Risks

1. Recreating IDs with Laravel's ULID hook would break every source FK. Source `id` values are CUIDs; preserve all 25-character values exactly, and preserve composite pivot PKs exactly.
2. Laravel's current strict bcrypt verifier rejects the source `$2b$` prefix. Normal model assignment may also invoke the `hashed` cast; do not use normal model creation for raw source hashes. Define and test compatibility before importing users.
3. `rehash_on_login=true` can cause later auth writes after compatibility is enabled. Decide explicitly whether login-time rehash is allowed; do not silently change stored hashes during an import.
4. SQL-only copying loses all 19 physical media files. Source URLs/storage keys do not match Laravel's storage route/key convention without a deliberate mapping.
5. MySQL `DATETIME(3)` values can be changed by application timestamp handling or timezone conversion. Copy raw values with explicit timestamp columns.
6. Preserve NULLs in optional fields; do not fabricate empty values, authors, dimensions, alt text, dates, or content.
7. Preserve historical enum values only if they exist in the chosen source/backup. Current live source has only current KnowledgeType values; older backups may not.
8. Source tables use `utf8mb4_unicode_ci`; schema/database defaults show `utf8mb4_general_ci`. Laravel migrations use `utf8mb4_unicode_ci` at table level. Compare actual target table collations before import, especially for unique-key/case/accent behavior.
9. Source local MariaDB uses `lower_case_table_names=1`. Production Linux MySQL may use case-sensitive table names; validate Laravel table-name casing on the eventual host.
10. Preserve `AuditLog` and `ContactMessage` data under restricted access. Do not print metadata/message bodies into import logs.

## Tables Requiring Transformation

- `Media`: physical bytes must be separately copied; `storageKey` and URL must be mapped to the Laravel public disk/route. The DB IDs and file basenames should remain stable.
- `User.passwordHash`: plaintext password must not change. Stored `$2b$` compatibility must be explicitly handled before login; the current strict Laravel config cannot validate it as-is.
- `User.imageId`: current count is zero; if importing future non-NULL values, defer setting it until after Media rows are inserted to break the User/Media FK cycle.
- `NavigationItem.parentId`: current count is zero; if parent links are present in a future snapshot, import rows with parent IDs deferred or in parent-first order, then restore links.
- Timestamps: no timezone conversion; preserve source millisecond values exactly with explicit columns.
- Other domain columns: direct transfer is expected after schema/enum/ID preflight; preserve NULLs and JSON/text content without lossy normalization.

## Recommended Import Order

See the per-table phase numbers in [DATA_IMPORT_PLAN.md](DATA_IMPORT_PLAN.md). In summary: User skeleton and reference roots; Media bytes and rows; content roots; translations/children/navigation/contact; pivots/downloads; AuditLog last. User image links and NavigationItem parent links are second-pass fields if present.

## Final Readiness

**NO-GO for data import now.** The target is empty and source counts/keys/FKs are known, but the current Laravel auth configuration rejects the source bcrypt prefix, login may rehash hashes, media files are outside Laravel storage and ignored by Git, and no importer/checksum/reconciliation tool exists. Resolve and test those paths on a controlled disposable staging copy before importing any source data. This audit did not modify `antrabumi`, `antrabumi_laravel`, Next.js, Prisma, files, or credentials.