# DATABASE_SCHEMA.md — ANTRABUMI

**Project:** ANTRABUMI
**Database:** MySQL
**ORM:** Prisma
**Version:** 1.0
**Status:** Production Architecture

---

# 1. PURPOSE

This document defines the database architecture for the ANTRABUMI Full-Stack Website + CMS.

The database must support:

* Public website
* Admin CMS
* Authentication
* Role-based access control
* Multilingual content
* Experiences
* People
* Knowledge
* Contribution Areas
* Partners
* Media Library
* Contact Messages
* Navigation
* Site Settings
* Audit Logs
* Publishing workflow

The database must be normalized enough for long-term maintenance without creating unnecessary complexity.

---

# 2. DATABASE PRINCIPLES

## 2.1 Database-driven content

Public organizational content must come from the database.

Avoid hard-coding content that CMS users are expected to manage.

---

## 2.2 Source integrity

The database must never require fabricated organizational data.

If a source-supported value does not exist:

* Store `NULL` where appropriate.
* Leave optional fields empty.
* Allow CMS users to add the information later.

---

## 2.3 Multilingual architecture

Content that requires translation must support independent language records.

Do not assume that an Indonesian string and English string are always direct translations.

---

## 2.4 Publishing safety

Public queries must only return content that is explicitly published.

Draft/review/archived content must not appear publicly.

---

## 2.5 Auditability

Important CMS actions should be traceable through `AuditLog`.

---

# 3. DATABASE ENGINE

Use:

```text
MySQL 8+
Prisma ORM
UTF-8 / utf8mb4
```

Recommended Prisma datasource:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

---

# 4. ENUMS

## 4.1 Language

```prisma
enum Language {
  ID
  EN
}
```

---

## 4.2 Content Status

```prisma
enum ContentStatus {
  DRAFT
  REVIEW
  PUBLISHED
  ARCHIVED
}
```

---

## 4.3 User Status

```prisma
enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
}
```

---

## 4.4 Role

```prisma
enum Role {
  SUPER_ADMIN
  ADMIN
  EDITOR
  AUTHOR
}
```

---

## 4.5 Knowledge Type

```prisma
enum KnowledgeType {
  RESEARCH
  ASSESSMENT
  REPORT
  PUBLICATION
  ARTICLE
  STORY
  INSIGHT
}
```

---

## 4.6 Message Status

```prisma
enum MessageStatus {
  NEW
  READ
  IN_PROGRESS
  RESOLVED
  ARCHIVED
}
```

---

## 4.7 Media Type

```prisma
enum MediaType {
  IMAGE
  DOCUMENT
  VIDEO
  AUDIO
  OTHER
}
```

---

## 4.8 Audit Action

```prisma
enum AuditAction {
  LOGIN
  LOGOUT
  CREATE
  UPDATE
  DELETE
  PUBLISH
  UNPUBLISH
  ARCHIVE
  UPLOAD
  USER_ROLE_CHANGED
  SETTING_CHANGED
}
```

---

# 5. USER

Users are authenticated CMS users.

```prisma
model User {
  id            String     @id @default(cuid())
  name          String
  email         String     @unique
  passwordHash  String?
  role          Role       @default(AUTHOR)
  status        UserStatus @default(ACTIVE)

  imageId       String?
  image         Media?     @relation("UserImage", fields: [imageId], references: [id])

  lastLoginAt   DateTime?
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  createdExperiences Experience[] @relation("ExperienceCreator")
  updatedExperiences Experience[] @relation("ExperienceUpdater")

  createdKnowledge Knowledge[] @relation("KnowledgeCreator")
  updatedKnowledge Knowledge[] @relation("KnowledgeUpdater")

  createdPeople Person[] @relation("PersonCreator")
  updatedPeople Person[] @relation("PersonUpdater")

  uploadedMedia Media[] @relation("MediaUploader")

  contactMessages ContactMessage[] @relation("MessageAssignee")

  auditLogs AuditLog[]

  @@index([role])
  @@index([status])
  @@index([createdAt])
}
```

---

# 6. PERMISSION

Permissions provide a path toward granular authorization.

```prisma
model Permission {
  id          String   @id @default(cuid())
  key         String   @unique
  description String?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

Examples:

```text
dashboard.view
pages.read
pages.write
experiences.read
experiences.write
experiences.publish
people.read
people.write
knowledge.read
knowledge.write
knowledge.publish
media.read
media.write
messages.read
messages.update
users.manage
settings.manage
audit_logs.read
```

The initial application may use role-based authorization while keeping this table available for future granular permissions.

---

# 7. PAGE

Pages represent CMS-managed organizational pages.

```prisma
model Page {
  id              String        @id @default(cuid())

  slug            String
  language        Language

  title           String
  excerpt         String?       @db.Text
  content         String?       @db.LongText

  heroTitle       String?
  heroDescription String?
  heroMediaId     String?

  status          ContentStatus @default(DRAFT)

  seoTitle        String?
  seoDescription  String?       @db.Text
  ogImageId       String?

  publishedAt     DateTime?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  heroMedia Media? @relation("PageHeroMedia", fields: [heroMediaId], references: [id])
  ogImage   Media? @relation("PageOgImage", fields: [ogImageId], references: [id])

  @@unique([slug, language])
  @@index([status])
  @@index([language])
  @@index([publishedAt])
}
```

---

# 8. CONTRIBUTION AREA

The six official contribution areas are represented as database records.

```prisma
model ContributionArea {
  id          String        @id @default(cuid())
  slug        String        @unique

  status      ContentStatus @default(DRAFT)
  order       Int           @default(0)

  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  translations ContributionAreaTranslation[]

  experiences ExperienceContributionArea[]
  knowledge   KnowledgeContributionArea[]
}
```

Translation:

```prisma
model ContributionAreaTranslation {
  id                 String   @id @default(cuid())
  contributionAreaId String
  language           Language

  title       String
  description String?  @db.Text

  imageId     String?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  contributionArea ContributionArea @relation(
    fields: [contributionAreaId],
    references: [id],
    onDelete: Cascade
  )

  image Media? @relation("ContributionAreaImage", fields: [imageId], references: [id])

  @@unique([contributionAreaId, language])
  @@index([language])
}
```

---

# 9. EXPERIENCE

Experiences represent organizational projects/work.

```prisma
model Experience {
  id          String        @id @default(cuid())
  slug        String        @unique

  year        Int?
  location    String?
  clientName  String?

  status      ContentStatus @default(DRAFT)

  featured    Boolean       @default(false)

  coverMediaId String?

  createdById String
  updatedById String

  publishedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  coverMedia Media @relation(
    "ExperienceCoverMedia",
    fields: [coverMediaId],
    references: [id]
  )

  createdBy User @relation(
    "ExperienceCreator",
    fields: [createdById],
    references: [id]
  )

  updatedBy User @relation(
    "ExperienceUpdater",
    fields: [updatedById],
    references: [id]
  )

  translations ExperienceTranslation[]

  contributionAreas ExperienceContributionArea[]
  metrics           ExperienceMetric[]
  gallery           ExperienceMedia[]
  knowledge         ExperienceKnowledge[]

  @@index([status])
  @@index([year])
  @@index([featured])
  @@index([publishedAt])
}
```

---

# 10. EXPERIENCE TRANSLATION

```prisma
model ExperienceTranslation {
  id           String   @id @default(cuid())
  experienceId String
  language     Language

  title         String
  excerpt       String?  @db.Text
  description   String?  @db.LongText
  methodology   String?  @db.LongText
  impact        String?  @db.LongText

  seoTitle       String?
  seoDescription String? @db.Text

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  experience Experience @relation(
    fields: [experienceId],
    references: [id],
    onDelete: Cascade
  )

  @@unique([experienceId, language])
  @@index([language])
}
```

---

# 11. EXPERIENCE METRIC

Metrics are optional.

Never seed fabricated numbers.

```prisma
model ExperienceMetric {
  id           String @id @default(cuid())
  experienceId String

  label String
  value String
  unit  String?

  order Int @default(0)

  experience Experience @relation(
    fields: [experienceId],
    references: [id],
    onDelete: Cascade
  )

  @@index([experienceId])
}
```

---

# 12. EXPERIENCE ↔ CONTRIBUTION AREA

Many-to-many relationship.

```prisma
model ExperienceContributionArea {
  experienceId       String
  contributionAreaId String

  experience       Experience       @relation(
    fields: [experienceId],
    references: [id],
    onDelete: Cascade
  )

  contributionArea ContributionArea @relation(
    fields: [contributionAreaId],
    references: [id],
    onDelete: Cascade
  )

  @@id([experienceId, contributionAreaId])
}
```

---

# 13. EXPERIENCE MEDIA

```prisma
model ExperienceMedia {
  experienceId String
  mediaId      String

  order Int @default(0)

  experience Experience @relation(
    fields: [experienceId],
    references: [id],
    onDelete: Cascade
  )

  media Media @relation(
    fields: [mediaId],
    references: [id],
    onDelete: Cascade
  )

  @@id([experienceId, mediaId])
}
```

---

# 14. PERSON

```prisma
model Person {
  id String @id @default(cuid())

  slug String @unique

  imageId String?

  status ContentStatus @default(DRAFT)
  order  Int           @default(0)

  createdById String
  updatedById String

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  image Media? @relation(
    "PersonImage",
    fields: [imageId],
    references: [id]
  )

  createdBy User @relation(
    "PersonCreator",
    fields: [createdById],
    references: [id]
  )

  updatedBy User @relation(
    "PersonUpdater",
    fields: [updatedById],
    references: [id]
  )

  translations PersonTranslation[]
  expertise    PersonExpertise[]
}
```

---

# 15. PERSON TRANSLATION

```prisma
model PersonTranslation {
  id       String   @id @default(cuid())
  personId String
  language Language

  name         String
  degree       String?
  role         String?
  biography    String? @db.LongText

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  person Person @relation(
    fields: [personId],
    references: [id],
    onDelete: Cascade
  )

  @@unique([personId, language])
}
```

---

# 16. EXPERTISE

```prisma
model Expertise {
  id          String @id @default(cuid())
  slug        String @unique
  name        String
  description String? @db.Text

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  people PersonExpertise[]
}
```

Source-supported expertise can include:

```text
Community Development
GEDSI
Research & Assessment
Communication
Conservation
Policy
Climate & Sustainability
Partnership
```

---

# 17. PERSON ↔ EXPERTISE

```prisma
model PersonExpertise {
  personId    String
  expertiseId String

  order Int @default(0)

  person    Person    @relation(
    fields: [personId],
    references: [id],
    onDelete: Cascade
  )

  expertise Expertise @relation(
    fields: [expertiseId],
    references: [id],
    onDelete: Cascade
  )

  @@id([personId, expertiseId])
}
```

---

# 18. KNOWLEDGE

```prisma
model Knowledge {
  id String @id @default(cuid())

  slug String @unique

  type KnowledgeType

  coverMediaId String?

  status   ContentStatus @default(DRAFT)
  featured Boolean       @default(false)

  authorName String?

  publicationDate DateTime?

  createdById String
  updatedById String

  publishedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  coverMedia Media? @relation(
    "KnowledgeCoverMedia",
    fields: [coverMediaId],
    references: [id]
  )

  createdBy User @relation(
    "KnowledgeCreator",
    fields: [createdById],
    references: [id]
  )

  updatedBy User @relation(
    "KnowledgeUpdater",
    fields: [updatedById],
    references: [id]
  )

  translations KnowledgeTranslation[]

  categories KnowledgeCategory[]
  tags       KnowledgeTag[]

  experiences ExperienceKnowledge[]
  contributionAreas KnowledgeContributionArea[]

  downloadableMedia KnowledgeDownload[]

  @@index([type])
  @@index([status])
  @@index([publicationDate])
  @@index([featured])
}
```

---

# 19. KNOWLEDGE TRANSLATION

```prisma
model KnowledgeTranslation {
  id          String   @id @default(cuid())
  knowledgeId String
  language    Language

  title   String
  excerpt String? @db.Text
  content String? @db.LongText

  seoTitle       String?
  seoDescription String? @db.Text

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  knowledge Knowledge @relation(
    fields: [knowledgeId],
    references: [id],
    onDelete: Cascade
  )

  @@unique([knowledgeId, language])
  @@index([language])
}
```

---

# 20. CATEGORY

```prisma
model Category {
  id          String @id @default(cuid())
  slug        String @unique
  name        String

  description String? @db.Text

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  knowledge KnowledgeCategory[]
}
```

---

# 21. KNOWLEDGE ↔ CATEGORY

```prisma
model KnowledgeCategory {
  knowledgeId String
  categoryId  String

  knowledge Knowledge @relation(
    fields: [knowledgeId],
    references: [id],
    onDelete: Cascade
  )

  category Category @relation(
    fields: [categoryId],
    references: [id],
    onDelete: Cascade
  )

  @@id([knowledgeId, categoryId])
}
```

---

# 22. TAG

```prisma
model Tag {
  id   String @id @default(cuid())
  slug String @unique
  name String

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  knowledge KnowledgeTag[]
}
```

---

# 23. KNOWLEDGE ↔ TAG

```prisma
model KnowledgeTag {
  knowledgeId String
  tagId       String

  knowledge Knowledge @relation(
    fields: [knowledgeId],
    references: [id],
    onDelete: Cascade
  )

  tag Tag @relation(
    fields: [tagId],
    references: [id],
    onDelete: Cascade
  )

  @@id([knowledgeId, tagId])
}
```

---

# 24. KNOWLEDGE ↔ EXPERIENCE

```prisma
model ExperienceKnowledge {
  experienceId String
  knowledgeId  String

  experience Experience @relation(
    fields: [experienceId],
    references: [id],
    onDelete: Cascade
  )

  knowledge Knowledge @relation(
    fields: [knowledgeId],
    references: [id],
    onDelete: Cascade
  )

  @@id([experienceId, knowledgeId])
}
```

---

# 25. KNOWLEDGE ↔ CONTRIBUTION AREA

```prisma
model KnowledgeContributionArea {
  knowledgeId       String
  contributionAreaId String

  knowledge Knowledge @relation(
    fields: [knowledgeId],
    references: [id],
    onDelete: Cascade
  )

  contributionArea ContributionArea @relation(
    fields: [contributionAreaId],
    references: [id],
    onDelete: Cascade
  )

  @@id([knowledgeId, contributionAreaId])
}
```

---

# 26. KNOWLEDGE DOWNLOAD

Knowledge may have downloadable files such as reports or publications.

```prisma
model KnowledgeDownload {
  id          String @id @default(cuid())
  knowledgeId String
  mediaId     String

  label String?
  order Int @default(0)

  knowledge Knowledge @relation(
    fields: [knowledgeId],
    references: [id],
    onDelete: Cascade
  )

  media Media @relation(
    fields: [mediaId],
    references: [id],
    onDelete: Cascade
  )

  @@index([knowledgeId])
}
```

---

# 27. MEDIA

Media is centralized.

```prisma
model Media {
  id String @id @default(cuid())

  type MediaType

  filename     String
  originalName String?

  mimeType String
  size     BigInt

  width  Int?
  height Int?

  storageKey String
  url        String?

  altText     String?
  caption     String? @db.Text
  attribution String? @db.Text

  uploadedById String

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  uploadedBy User @relation(
    "MediaUploader",
    fields: [uploadedById],
    references: [id]
  )

  userImages User[] @relation("UserImage")

  pageHeroMedia Page[] @relation("PageHeroMedia")
  pageOgImages  Page[] @relation("PageOgImage")

  contributionAreaImages ContributionAreaTranslation[]
    @relation("ContributionAreaImage")

  experienceCovers Experience[] @relation("ExperienceCoverMedia")
  experienceMedia ExperienceMedia[]

  personImages Person[] @relation("PersonImage")

  knowledgeCovers Knowledge[] @relation("KnowledgeCoverMedia")
  knowledgeDownloads KnowledgeDownload[]

  @@index([type])
  @@index([uploadedById])
  @@index([createdAt])
}
```

---

# 28. PARTNER

Partner records are optional and must contain only verified/source-supported information.

```prisma
model Partner {
  id String @id @default(cuid())

  name        String
  slug        String @unique
  description String? @db.Text

  logoMediaId String?
  website     String?

  category String?

  status ContentStatus @default(DRAFT)
  order  Int           @default(0)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  logoMedia Media? @relation(
    "PartnerLogoMedia",
    fields: [logoMediaId],
    references: [id]
  )

  @@index([status])
}
```

---

# 29. CONTACT MESSAGE

```prisma
model ContactMessage {
  id String @id @default(cuid())

  name         String
  email        String
  organization String?
  phone        String?
  subject      String
  message      String @db.Text

  areaOfInterest String?

  status MessageStatus @default(NEW)

  assignedToId String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  assignedTo User? @relation(
    "MessageAssignee",
    fields: [assignedToId],
    references: [id]
  )

  @@index([status])
  @@index([createdAt])
  @@index([email])
}
```

---

# 30. NAVIGATION ITEM

Navigation is CMS-managed.

```prisma
model NavigationItem {
  id String @id @default(cuid())

  label    String
  url      String?

  language Language

  parentId String?
  order    Int @default(0)

  visible Boolean @default(true)

  openInNewTab Boolean @default(false)

  parent   NavigationItem?  @relation(
    "NavigationTree",
    fields: [parentId],
    references: [id]
  )

  children NavigationItem[] @relation("NavigationTree")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([language])
  @@index([parentId])
  @@index([visible])
}
```

---

# 31. SITE SETTING

Site-level configuration.

```prisma
model SiteSetting {
  id String @id @default(cuid())

  key   String @unique
  value String? @db.LongText

  language Language?

  description String?

  updatedAt DateTime @updatedAt
  createdAt DateTime @default(now())

  @@index([language])
}
```

Potential settings:

```text
site.name
site.tagline
site.description
site.email
site.phone
site.address
site.instagram
site.linkedin
site.website
seo.defaultTitle
seo.defaultDescription
seo.defaultOgImage
```

---

# 32. AUDIT LOG

```prisma
model AuditLog {
  id String @id @default(cuid())

  userId String?

  action AuditAction

  entity   String?
  entityId String?

  metadata Json?

  ipAddress String?
  userAgent String?

  createdAt DateTime @default(now())

  user User? @relation(
    fields: [userId],
    references: [id]
  )

  @@index([userId])
  @@index([action])
  @@index([entity])
  @@index([entityId])
  @@index([createdAt])
}
```

---

# 33. RELATIONSHIP OVERVIEW

```text
User
 │
 ├── Experiences
 ├── Knowledge
 ├── People
 ├── Media
 ├── Messages
 └── Audit Logs


ContributionArea
 │
 ├── Experiences
 └── Knowledge


Experience
 │
 ├── Translations
 ├── Contribution Areas
 ├── Metrics
 ├── Media
 └── Knowledge


Person
 │
 ├── Translations
 └── Expertise


Knowledge
 │
 ├── Translations
 ├── Categories
 ├── Tags
 ├── Experiences
 ├── Contribution Areas
 └── Downloads


Media
 │
 ├── Pages
 ├── Experiences
 ├── People
 ├── Knowledge
 ├── Contributions
 └── Partners
```

---

# 34. PUBLISHING RULES

Public queries must follow:

```text
status = PUBLISHED
```

For translated content:

```text
parent.status = PUBLISHED
AND translation.language = requested language
```

Draft content must never be returned by public APIs.

---

# 35. SLUG RULES

Slugs must:

* Be lowercase.
* Use hyphens.
* Contain no spaces.
* Be URL-safe.
* Be unique within their content type.
* Remain stable after publishing where possible.

Example:

```text
indonesia-digital-ecosystem-assessment
```

---

# 36. SOFT DELETE / ARCHIVE

Content should generally use:

```text
ARCHIVED
```

instead of immediate permanent deletion.

Permanent deletion should be restricted to authorized administrators.

---

# 37. DATA INTEGRITY

The application must enforce:

* Unique email.
* Unique slug.
* Unique language translation per parent.
* Valid foreign keys.
* Valid role values.
* Valid content status.
* Valid media references.
* Valid many-to-many relationships.

---

# 38. CASCADE RULES

Use cascade deletion only for dependent records that cannot exist independently.

Examples:

```text
Experience
  → ExperienceTranslation
  → ExperienceMetric
  → ExperienceMedia

Person
  → PersonTranslation
  → PersonExpertise

Knowledge
  → KnowledgeTranslation
  → KnowledgeTag
  → KnowledgeCategory
  → KnowledgeDownload
```

Do not cascade-delete critical independent records such as users or audit logs unintentionally.

---

# 39. INDEXING

At minimum index:

* Status
* Language
* Slug
* Publication date
* Created date
* Foreign keys
* Search/filter fields
* User role/status

Indexes should be reviewed against actual query patterns after implementation.

---

# 40. SEARCH

For initial implementation, use MySQL-compatible search strategies appropriate to the dataset size.

Searchable content may include:

### Experiences

* Title
* Excerpt
* Description

### Knowledge

* Title
* Excerpt
* Content

### People

* Name
* Biography
* Expertise

Do not expose unpublished content to public search.

---

# 41. SEED DATA

The initial seed must contain only source-supported records.

Potential contribution areas:

```text
Conservation, Climate & Sustainability
Program & Strategy
Partnership & Collaboration
Media, Storytelling & Campaign
Community Development
Research, Assessment & Knowledge
```

Potential experiences:

```text
Indonesia Digital Ecosystem Assessment — IDEA
Perencanaan Pengelolaan Ekowisata Desa
Assessment Training for Community Development
Assessment Pengembangan Batik Ekologis
Prototyping Pengelolaan Sampah Pasar Tradisional
```

Potential people:

```text
Sendi Kenia Savitri, M.Si.
Ade Afrilian Saputra, M.M.Sus.
Anna Agustina, Ph.D.
Yando Zakaria
Sekar Mira C. Herandarudewi, M.Si.
Arya Kusumo Harwinanto, S.I.Kom.
Shaniya Utamidita, M.S.
Suluh Gembyeng Ciptadi, M.Si.
```

These records should initially be seeded as appropriate CMS content and only published when the corresponding source-supported content is available.

---

# 42. DATABASE MIGRATION POLICY

Never manually alter production database structure when a schema migration is appropriate.

Use:

```bash
npx prisma migrate dev
```

during development.

Use production migration workflow for deployment.

Never run destructive schema changes against production without explicit review.

---

# 43. BACKUP REQUIREMENTS

Production must have:

* Regular MySQL backups.
* Backup retention policy.
* Restore procedure.
* Database migration history.
* Media backup strategy.

Database backup alone is insufficient if media is stored separately.

---

# 44. ENVIRONMENT VARIABLES

Sensitive configuration must use environment variables.

Example:

```env
DATABASE_URL=
AUTH_SECRET=
STORAGE_ENDPOINT=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
STORAGE_BUCKET=
```

Never commit `.env` files containing secrets.

Provide:

```text
.env.example
```

with safe placeholders.

---

# 45. PRODUCTION CONSIDERATIONS

Production database should:

* Use secure credentials.
* Restrict external access where possible.
* Use SSL/TLS where supported.
* Have backups.
* Have monitoring.
* Have migration history.
* Have appropriate connection pooling.

---

# 46. PRISMA IMPLEMENTATION

The actual `schema.prisma` implementation must:

1. Match this document.
2. Use explicit relations.
3. Define indexes.
4. Define unique constraints.
5. Define appropriate deletion behavior.
6. Pass Prisma validation.
7. Generate successfully.
8. Support migration.

The AI Agent must resolve Prisma-specific syntax requirements during implementation without changing the intended data model.

---

# 47. DATABASE TESTING

Before completion, test:

### Users

* Create user.
* Authenticate user.
* Change role.
* Disable user.

### Content

* Create.
* Edit.
* Review.
* Publish.
* Archive.

### Relationships

* Experience ↔ Contribution Area.
* Knowledge ↔ Category.
* Knowledge ↔ Tag.
* Person ↔ Expertise.
* Experience ↔ Knowledge.

### Media

* Upload.
* Reference.
* Remove.
* Prevent unsafe uploads.

### Messages

* Create.
* Read.
* Assign.
* Resolve.
* Archive.

### Localization

* ID content.
* EN content.
* Missing translation behavior.

---

# 48. DEFINITION OF DONE

The database implementation is complete when:

1. MySQL connection works.
2. Prisma schema validates.
3. Initial migration succeeds.
4. Database migrations can be reproduced.
5. Seed process works.
6. Authentication data can be stored safely.
7. RBAC data is supported.
8. CMS content can be persisted.
9. Publishing status works.
10. Multilingual records work.
11. Experiences work.
12. People work.
13. Knowledge works.
14. Contribution Areas work.
15. Media references work.
16. Contact messages work.
17. Navigation works.
18. Settings work.
19. Audit logs work.
20. Foreign-key integrity works.
21. Indexes exist for important queries.
22. Production backup strategy is documented.

---

# 49. IMPORTANT IMPLEMENTATION RULE

Do not treat this document as permission to invent content.

This document defines **data structure**, not additional organizational facts.

The database may contain fields for:

* Statistics
* Impact
* Partners
* Client
* Location
* Biography
* Expertise
* Publications

without requiring those fields to contain values.

If the source material does not support a value:

```text
NULL / empty
```

is preferable to fabricated content.

---

# 50. FINAL DATABASE ARCHITECTURE

The core relationship is:

```text
                    ┌───────────────┐
                    │     USERS     │
                    └───────┬───────┘
                            │
                    ┌───────▼───────┐
                    │      CMS      │
                    └───────┬───────┘
                            │
       ┌────────────────────┼────────────────────┐
       │                    │                    │
       ▼                    ▼                    ▼
   EXPERIENCES           KNOWLEDGE            PEOPLE
       │                    │                    │
       │                    │                    │
       ▼                    ▼                    ▼
 CONTRIBUTION           CATEGORIES          EXPERTISE
   AREAS                   TAGS
       │                    │
       └────────────┬───────┘
                    │
                    ▼
                 MEDIA
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
      PUBLIC SITE          DOWNLOADS

Additional systems:

CONTACT MESSAGES
NAVIGATION
SITE SETTINGS
AUDIT LOGS
```

The database should remain focused on ANTRABUMI's actual website and CMS requirements rather than becoming a generic enterprise CMS.

**END OF DATABASE_SCHEMA.md**
