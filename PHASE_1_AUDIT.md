# Phase 1 — Next.js to Laravel Audit

Snapshot: 2026-10-02
Status: **AUDIT COMPLETE; IMPLEMENTATION NOT STARTED BY THIS DOCUMENT**

This is a static code audit and route/data mapping. No application code, database, media file, or deployment configuration was changed. Next.js remains the reference application. The existing [MIGRATION_ANALYSIS.md](../MIGRATION_ANALYSIS.md) contains the fuller Prisma field/constraint inventory; this document records route behavior and compares it with the Laravel routes/controllers/views that exist now.

## Inventory

- Next.js uses App Router; no `pages/` Pages Router was found.
- There are 37 `page.tsx` routes: 12 public routes and 25 admin/login routes.
- There are 13 Route Handlers: health, three auth, seven public read/search, contact, and media upload.
- Ten feature modules contain Server Actions. The UI predominantly invokes these actions instead of calling public read APIs.
- Data access is Prisma/MySQL, through eight repositories plus direct Prisma reads in some pages.
- Laravel has named web/API route files, Eloquent models, and Blade shells. Public page actions currently return a shared placeholder view. Several API/admin controllers are registered but inherit a 501 migration placeholder.

## Public Page Route Mapping

| Next.js route | Source behavior/data | Laravel route → controller → view/query now | Audit status |
|---|---|---|---|
| `/` | Editorial home; home/hero settings, published partners, four published experiences, three recent knowledge items. | `GET /` → `PublicPageController::home` → `public.migration-placeholder`; no home data query. | NOT MIGRATED |
| `/tentang` | Organization copy, journey/framework/GEDSI, published people; ID/EN language cookie. | `GET /tentang` → `PublicPageController::about` → public placeholder. | NOT MIGRATED |
| `/tentang/tim/{slug}` | Published person profile, translation, image/expertise; not-found if absent. | `GET /tentang/tim/{slug}` → `PublicPageController::person` → public placeholder. | NOT MIGRATED |
| `/inisiatif` | Experience/initiative listing, query-driven initial filters and client-side filtering/search. | `GET /inisiatif` → `PublicPageController::initiatives` → public placeholder. | NOT MIGRATED |
| `/inisiatif/{slug}` | Published Experience detail, translation, metrics, contribution areas, cover/gallery/PDF; source-backed static fallbacks exist for selected slugs. | `GET /inisiatif/{slug}` → `PublicPageController::initiative` → public placeholder. | NOT MIGRATED |
| `/pengalaman` | Published `EXPERIENCE` listing; client-side filtering/search and source-backed fallback entries. | `GET /pengalaman` → `PublicPageController::experiences` → public placeholder. | NOT MIGRATED |
| `/pengalaman/{slug}` | Published experience detail with translation, methods/impact/metrics/media; aliases/fallbacks exist for selected slugs. | `GET /pengalaman/{slug}` → `PublicPageController::experience` → public placeholder. | NOT MIGRATED |
| `/experience` | Alias/re-export of `/pengalaman`; same page behavior. | `GET /experience` → 301 redirect to `/pengalaman`. | PARTIAL; URL kept as redirect |
| `/experience/{slug}` | Alias/re-export of `/pengalaman/{slug}`. | `GET /experience/{slug}` → 301 redirect to Laravel experience detail route. | PARTIAL; URL kept as redirect |
| `/pengetahuan` | Published knowledge, ID/EN translation, cover/downloads; client-side search/type filtering. | `GET /pengetahuan` → `PublicPageController::knowledge` → public placeholder. | NOT MIGRATED |
| `/pengetahuan/{slug}` | Published knowledge detail, SEO, cover/gallery/downloads/categories/tags and rich text. Missing records call Next `notFound()`. | `GET /pengetahuan/{slug}` → `PublicPageController::knowledgeItem` → public placeholder. | NOT MIGRATED |
| `/kolaborasi` | Collaboration copy, published partners, and form posting ContactMessage. | `GET /kolaborasi` → `PublicPageController::collaboration` → public placeholder. | NOT MIGRATED |

Public data relationships observed in the source:

- Home: `SiteSetting` keys for home sections/hero, `Partner`, `Experience` and `Knowledge` with their public relations/media.
- About/team: `Person`, `PersonTranslation`, `Expertise`/`PersonExpertise`, and `Media`.
- Initiatives/experiences: `Experience`, `ExperienceTranslation`, `ExperienceMetric`, `ContributionArea` translations, `ExperienceMedia`, `KnowledgeDownload`, and `Media`.
- Knowledge: `Knowledge`, `KnowledgeTranslation`, `Category`, `Tag`, `KnowledgeCategory`, `KnowledgeTag`, `KnowledgeMedia`, `KnowledgeDownload`, and `Media`.
- Collaboration: published `Partner`; contact form creates `ContactMessage`.

## Admin Page Route Mapping

All paths below are actual App Router page paths; `[id]` is dynamic. Laravel paths are from `routes/web.php`.

| Next.js route | Source behavior | Laravel current route/controller/view/query | Audit status |
|---|---|---|---|
| `/admin` | Counts, recent messages and audit activity. | `GET /admin` → `DashboardController::index` → `admin.dashboard`; Eloquent counts and recent rows are implemented. | PARTIAL; base dashboard exists |
| `/admin/login` | Email/password form; honors `from`; calls auth login API. | `GET /admin/login` → `AuthenticatedSessionController::create` → `auth.login`; POST form route and API login are implemented. | IMPLEMENTED; session contract differs from JWT |
| `/admin/beranda` | Edit JSON home section configuration; upload/select media. | GET/PUT `/admin/beranda` → `HomeContentController`; controller inherits migration placeholder. | PLACEHOLDER |
| `/admin/hero` | Manage/reorder slides and slider config in SiteSetting; upload media. | GET/PUT `/admin/hero` → `HeroController`; controller inherits migration placeholder. | PLACEHOLDER |
| `/admin/experiences` | Redirects to initiatives list filtered to experience. | GET `/admin/experiences` redirects to `/admin/initiatives?type=EXPERIENCE`. | PARTIAL; redirect exists |
| `/admin/experiences/new` | Create Experience with bilingual text and media. | GET `/admin/experiences/new`, POST `/admin/experiences` → `ExperienceController`, `admin.experiences.create/form`. | PARTIAL; core create exists |
| `/admin/experiences/{id}/edit` | Edit Experience, translations, metrics, gallery/PDF and status. | GET/PATCH `/admin/experiences/{experience}/edit` and status route → `ExperienceController`; edit loads translations/media. | PARTIAL; gallery/metrics parity incomplete |
| `/admin/initiatives` | Search/status/type filters and pagination. | Resource routes → `InitiativeController`; inherits migration placeholder. | PLACEHOLDER |
| `/admin/initiatives/new` | Create initiative or experience. | `/admin/initiatives/new`, resource store → `InitiativeController`; placeholder. | PLACEHOLDER |
| `/admin/initiatives/{id}/edit` | Reuses experience edit form. | Resource edit/update → `InitiativeController`; placeholder. | PLACEHOLDER |
| `/admin/knowledge` | Search/status filter and paginated list. | Resource routes → `KnowledgeController`; placeholder. | PLACEHOLDER |
| `/admin/knowledge/new` | Create bilingual knowledge, status/featured/date, cover/download and rich text. | Resource routes → `KnowledgeController`; placeholder. | PLACEHOLDER |
| `/admin/knowledge/{id}/edit` | Edit translations, publication state, cover/gallery/downloads. | Resource routes → `KnowledgeController`; placeholder. | PLACEHOLDER |
| `/admin/people` | Search/status/paginated people list. | Resource routes → `PersonController`; placeholder. | PLACEHOLDER |
| `/admin/people/new` | Create bilingual person profile, image and order. | Resource routes → `PersonController`; placeholder. | PLACEHOLDER |
| `/admin/people/{id}/edit` | Edit person translations/image/status. | Resource routes → `PersonController`; placeholder. | PLACEHOLDER |
| `/admin/partners` | Search/status/paginated partner list. | Resource routes → `PartnerController`; placeholder. | PLACEHOLDER |
| `/admin/partners/new` | Create partner/logo/order. | Resource routes → `PartnerController`; placeholder. | PLACEHOLDER |
| `/admin/partners/{id}/edit` | Edit partner/logo/status. | Resource routes → `PartnerController`; placeholder. | PLACEHOLDER |
| `/admin/media` | Search/filter/page, upload, metadata, URL copy, delete. | GET `/admin/media` returns migration-placeholder view; upload/store, PATCH metadata, DELETE are registered in MediaController. | PARTIAL; list UI absent |
| `/admin/messages` | Status-filtered inbox with pagination. | GET `/admin/messages` → `ContactMessageController`; inherited placeholder. | PLACEHOLDER |
| `/admin/messages/{id}` | Message detail and status update. | GET detail/PATCH status → `ContactMessageController`; inherited placeholder. | PLACEHOLDER |
| `/admin/users` | Search/paginated user management, role/status/profile/password operations. | User resource and role/status/password routes → `UserController`; placeholder. | PLACEHOLDER |
| `/admin/settings` | Organization identity/contact/SEO/social/logo settings. | GET/PUT `/admin/settings` → `SettingController`; placeholder. | PLACEHOLDER |
| `/admin/logs` | Filtered audit log, page size 50. | GET `/admin/logs` → `AuditLogController`; placeholder. | PLACEHOLDER |

The source uses Server Actions for mutation and the admin UI is more complete than the current Laravel target. The seven controller classes for Initiative, Knowledge, Person, Partner, User, Setting, Hero, HomeContent, AuditLog and ContactMessage currently inherit `MigrationPlaceholderController` (10 classes). Their registrations do not mean their workflows are implemented.

## API Route Mapping

| Next.js method/path | Source behavior and data | Laravel method/path → current handler | Audit status |
|---|---|---|---|
| `GET /api/health` | DB ping, latency, uptime/version; 200/503. | `GET /api/health` → `HealthController::show`. | IMPLEMENTED |
| `POST /api/v1/auth/login` | Zod email/password validation, active-user check, bcrypt, audit, sets JWT cookie. | `POST /api/v1/auth/login` → `AuthenticatedSessionController::store`; Laravel session and legacy-compatible provider. | IMPLEMENTED; auth mechanism intentionally differs |
| `POST /api/v1/auth/logout` | Clears JWT cookie and audits logout. | `POST /api/v1/auth/logout` → session logout/invalidate. | IMPLEMENTED; session contract differs |
| `GET /api/v1/auth/me` | Current user safe profile from JWT and DB. Source declares `force-static`, inconsistent with request-bound session. | `GET /api/v1/auth/me` → `AuthenticatedSessionController::me`, `auth` + `active`. | IMPLEMENTED; verify response/caching parity |
| `GET /api/v1/experiences` | Published, paginated/filterable experience data. Source declares `force-static` despite query params. | `GET /api/v1/experiences` → `MigrationPendingController` (501). | NOT MIGRATED |
| `GET /api/v1/experiences/{slug}` | Published detail with language/relations. Source declares `force-static` despite path/query input. | `GET /api/v1/experiences/{slug}` → `MigrationPendingController` (501). | NOT MIGRATED |
| `GET /api/v1/knowledge` | Published knowledge list, query filters/pagination. | `GET /api/v1/knowledge` → `MigrationPendingController` (501). | NOT MIGRATED |
| `GET /api/v1/knowledge/{slug}` | Published knowledge detail and media/category/tag relations. | `GET /api/v1/knowledge/{slug}` → `MigrationPendingController` (501). | NOT MIGRATED |
| `GET /api/v1/people` | Published people, selected translation/image/expertise. | `GET /api/v1/people` → `MigrationPendingController` (501). | NOT MIGRATED |
| `GET /api/v1/partners` | Published partners with optional category filter/logo. | `GET /api/v1/partners` → `MigrationPendingController` (501). | NOT MIGRATED |
| `GET /api/v1/search` | Published experience/knowledge search, up to ten per entity. | `GET /api/v1/search` → `SearchController::index` (501). | NOT MIGRATED |
| `POST /api/v1/contact` | Validated anonymous form -> ContactMessage NEW; JSON or redirect. | `POST /api/v1/contact` → `ContactController::store`; throttled route, FormRequest, stores record. | PARTIAL; compare exact validation/response |
| `POST /api/v1/media/upload` | Multipart upload, metadata row, UPLOAD audit. | `POST /api/v1/media/upload` → `MediaController::store` + MediaStorageService. | PARTIAL; compare MIME/size/response/storage behavior |

`API_SPEC.md` lists routes not present in source `src/app/api`; do not treat them as implemented source contracts without evidence of a consumer. Actual pages mostly query Prisma directly and do not fetch these public APIs.

## Server Actions, Validation and Laravel Mutation Mapping

| Next feature action module | Source operation/data | Laravel target now |
|---|---|---|
| `src/features/experiences/actions.ts` | Create/update/status/delete; attach/remove PDF and gallery image. Uses experience Zod schema, `requireUser`, repository transaction and audit. | `ExperienceController` handles core create/update/status/delete and PDF field; gallery/metrics and full source form parity remain incomplete. |
| `src/features/knowledge/actions.ts` | Create/update/status/delete; attach/remove download and gallery media. Uses knowledge schema and role checks. | `KnowledgeController` registered but placeholder; no equivalent workflow. |
| `src/features/people/actions.ts` | Create/update/status/delete person and translations/image. | `PersonController` placeholder. |
| `src/features/partners/actions.ts` | Create/update/status/delete partner/logo/status. May resolve external image URL into media metadata. | `PartnerController` placeholder. |
| `src/features/media/actions.ts` | Update metadata and delete; role checks and audit. | Media metadata/delete endpoints exist; index UI is placeholder. |
| `src/features/messages/actions.ts` | ContactMessage status change. | `ContactMessageController` placeholder; status mutation not migrated. |
| `src/features/users/actions.ts` | Create/edit/status/role/password; SUPER_ADMIN checks and self-protection. | `UserController` placeholder; routes registered only. |
| `src/features/settings/actions.ts` | Validate/upsert key/value settings; ADMIN check. | `SettingController` placeholder. |
| `src/features/hero/actions.ts` | Read/save hero slides and slider config in SiteSetting JSON; EDITOR check on save. | `HeroController` placeholder. |
| `src/features/home-content/actions.ts` | Read/save home section JSON in SiteSetting; EDITOR check on save. | `HomeContentController` placeholder. |

Source schemas include `experience.schema.ts`, `knowledge.schema.ts`, `person.schema.ts`, `partner.schema.ts`, and `media.schema.ts`; user/settings/hero/home actions also validate their own input. Laravel FormRequests exist for Experience, Knowledge, Person, Partner, Media upload/metadata, contact, and login, but not for the placeholder admin workflows. Form parity must compare rules, limits, nullable fields, unique checks, error presentation, and role requirements before porting.

## Layout, Components and Interaction

- Root Next layout: `src/app/layout.tsx` loads Montserrat and Inter, global CSS, root metadata/viewport, document language, and skip link.
- Public layout: `src/app/(public)/layout.tsx` composes Header, Footer, FloatingCta and main content. Header has language/navigation behavior; pages use Client Components for tabs, filters, sliders and responsive interactions.
- Admin layout: dynamic server layout loads current user, sidebar, topbar/role, logout control; forms/lists use Client Components and Server Actions.
- Laravel has `layouts.app`, `layouts.admin`, header/footer/navigation/sidebar partials, login view, dashboard view and Experience create/edit views. Public content and most admin features still use migration-placeholder views. This is not visual or behavior parity yet.
- Source form/client modules include contact, login, media picker/upload, Tiptap rich-text editor, experience/initiative, knowledge, people, partner, users, settings, hero and home-content managers. Preserve loading/success/validation/error/empty states, keyboard behavior and responsive layouts during later phases.

## Authentication, Middleware and Authorization

- Next stores a seven-day HS256 JWT in HttpOnly `antrabumi_session`; secure only in production, SameSite=Lax. The claim contains user ID/email/role/name. `getCurrentUser` verifies the token and queries an active User.
- `src/middleware.ts` checks JWT validity for `/admin/*`, redirects unauthenticated pages to `/admin/login?from=...`, and handles `/api/v1/admin/*`. It does not query current status/role. Server Actions separately invoke `requireUser(role)`; authorization uses `src/lib/permissions/rbac.ts` hierarchy and ownership rules.
- Laravel uses session auth, session regeneration/invalidation, active middleware and route role middleware. Preserve source role/ownership policy while deliberately maintaining the existing Laravel session design. Review read-route protection and active status centrally; do not copy the source middleware's weaker page-level checks.
- No role-permission pivot exists in Prisma; `Permission` rows are not the source runtime RBAC engine. Source authorization is hard-coded in RBAC helpers/actions.

## SEO, URL, Errors and Listing Behavior

- Root metadata defines title template, description, canonical base, Open Graph, Twitter card, robots and viewport. Public pages define metadata; initiative/experience/knowledge details generate metadata from content. Team detail has route-specific behavior and should be checked for metadata separately.
- Next has `sitemap.ts`, `robots.ts`, generated `/opengraph-image`, `loading.tsx`, `error.tsx`, `global-error.tsx`, `not-found.tsx`. Laravel currently has `/sitemap.xml` and `/robots.txt`; there is no equivalent generated OG image, loading boundary, or custom 404 parity. Laravel sitemap currently includes `/pengalaman` and both initiative/experience URLs for each published Experience; Next sitemap static list omits some public index routes and its dynamic Experience URLs use `/inisiatif/{slug}` only. Align intentionally to the existing public URL/canonical contract.
- Next 404 is localized/custom and called for missing dynamic records. Laravel dynamic public methods currently return placeholder views rather than content-aware 404 responses.
- Pagination/filter behavior varies by surface: source public APIs default 12/max 50; initiative and knowledge pages use query/client filters; experience filtering/search is client-side; admin lists commonly use 20, media 24, audit 50. Laravel needs route-by-route comparison, not one generic pagination convention.
- Preserve both `/pengalaman` and `/experience` URLs, slug aliases and trailing-slash behavior. Laravel currently redirects the English alias to Indonesian canonical URLs.
- Knowledge HTML is rendered directly with `dangerouslySetInnerHTML` in Next; sanitizer behavior must be decided and tested before equivalent Blade output. Do not silently treat default Blade escaping as rich-text parity.

## Prisma Model to Laravel Model/Table Inventory

All 30 source domain models have same-named Laravel model/table targets in the repository. This inventory confirms the mapping surface exists, not full relation/query parity. IDs are source CUID strings; source timestamp columns are preserved by schema and the successful disposable import. The established detailed columns, enums, and FK rules remain in [MIGRATION_ANALYSIS.md](../MIGRATION_ANALYSIS.md), sections 5 and 10.

| Prisma model | Laravel model/table | Principal source relationships relevant to page/action queries |
|---|---|---|
| User | `User` | Optional Media image; Experience/Knowledge/Person creator/updater; uploaded Media; assigned ContactMessage; AuditLog. |
| Permission | `Permission` | Unique permission key; no role-permission relation in source schema. |
| Page | `Page` | Optional hero and OG Media; unique slug/language. No current Page CRUD page was found. |
| ContributionArea | `ContributionArea` | Translations; Experience and Knowledge pivots. |
| ContributionAreaTranslation | `ContributionAreaTranslation` | Parent ContributionArea; optional Media image. |
| Experience | `Experience` | Creator/updater User; cover Media; translations, metrics, contribution areas, gallery Media, Knowledge relation. |
| ExperienceTranslation | `ExperienceTranslation` | Parent Experience, unique language pair. |
| ExperienceMetric | `ExperienceMetric` | Parent Experience, display order. |
| ExperienceContributionArea | `ExperienceContributionArea` | Composite Experience/ContributionArea key. |
| ExperienceMedia | `ExperienceMedia` | Composite Experience/Media key and order; gallery/PDF association. |
| Person | `Person` | Creator/updater User; optional image; translations and Expertise. |
| PersonTranslation | `PersonTranslation` | Parent Person, unique language pair. |
| Expertise | `Expertise` | Many-to-many People through PersonExpertise. |
| PersonExpertise | `PersonExpertise` | Composite Person/Expertise key and order. |
| Knowledge | `Knowledge` | Creator/updater User; cover Media; translations, Category/Tag, Experience/ContributionArea, downloads and gallery. |
| KnowledgeTranslation | `KnowledgeTranslation` | Parent Knowledge, unique language pair, rich-text content/SEO. |
| Category | `Category` | KnowledgeCategory relation. |
| KnowledgeCategory | `KnowledgeCategory` | Composite Knowledge/Category key. |
| Tag | `Tag` | KnowledgeTag relation. |
| KnowledgeTag | `KnowledgeTag` | Composite Knowledge/Tag key. |
| ExperienceKnowledge | `ExperienceKnowledge` | Composite Experience/Knowledge key. |
| KnowledgeContributionArea | `KnowledgeContributionArea` | Composite Knowledge/ContributionArea key. |
| KnowledgeDownload | `KnowledgeDownload` | Parent Knowledge and Media; label/order. |
| KnowledgeMedia | `KnowledgeMedia` | Composite Knowledge/Media gallery key and order. |
| Media | `Media` | Uploader User; referenced by user/page/contribution/experience/person/knowledge/partner images, galleries and downloads. |
| Partner | `Partner` | Optional logo Media. |
| ContactMessage | `ContactMessage` | Optional assigned User. |
| NavigationItem | `NavigationItem` | Self-referential parent/children; language/order/visibility. |
| SiteSetting | `SiteSetting` | Key/value settings; homepage and hero JSON currently stored here. |
| AuditLog | `AuditLog` | Optional actor User; entity/action/JSON metadata. |

The Eloquent classes and relationship definitions are present, but relation-by-relation tests and public-query parity remain incomplete. The earlier disposable import verified that current source rows fit these tables; that is not equivalent to complete application-level relation coverage.

## Confirmed Gaps and Risks for the Next Phase

1. **Public Laravel pages are not migrated:** all primary public page methods render `public.migration-placeholder`; public copy, dynamic data, metadata and client interactions are absent.
2. **Public content API is mostly 501:** experiences, knowledge, people, partners and search are registered but not implemented. Source page rendering uses Prisma queries directly, so decide which endpoints are actually consumed before porting them.
3. **Admin CRUD parity is low:** only dashboard, auth, part of Experience and media upload/metadata/delete have active implementation. Ten admin controllers inherit the 501 base.
4. **URL/SEO differs:** sitemap behavior is not equivalent; generated Open Graph image and custom error/loading views are missing in Laravel; aliases/canonical behavior needs regression tests.
5. **Source `force-static` declarations conflict with request-specific auth/query endpoints:** treat current deployed behavior as a bug candidate to verify, not a contract to reproduce blindly.
6. **Auth differs intentionally:** JWT is replaced by Laravel session. Keep legacy bcrypt compatibility; verify active/role checks and redirects per request.
7. **Media file source is still UNKNOWN:** metadata/resolver exist, but physical media transfer and HTTP content checks are separate and blocked until source path verification.
8. **Rich text, contact validation, media size/MIME, aliases/fallback content and client filtering need explicit parity tests.**
9. **The Laravel target schema is prepared but remains empty** after the schema-only migration stage; do not run production importer or cutover as part of Phase 1.

## Phase 1 Exit

Route, action, query/data, layout, auth, media, SEO, redirect, error/loading and current Laravel coverage have been inventoried and mapped. No implementation is started by this audit. Next work should use this mapping to prioritize Phase 2 relationship/query verification and Phase 3 incremental Blade ports; Next.js remains intact and authoritative until Laravel behavior is proven.
