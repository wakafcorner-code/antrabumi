# Laravel Feature Parity Remaining

Snapshot date: 2026-10-02. This is a documentation-only inventory; it does not implement or change these features. Models and schema definitions do not imply a complete workflow.

## Authentication

- Session login, logout, current-user response, active-user checks, role middleware, and session regeneration exist.
- Password reset/recovery and administrator password-management workflows are not implemented. `UserController` remains a placeholder.
- Existing Prisma bcrypt hashes and Laravel authentication have not been integration-tested against source user records. Existing Next.js JWT cookies/sessions do not transfer to Laravel sessions.
- Remember-me is intentionally not supported by the current login flow; no `remember_token` column is retained.

## Dashboard

- Dashboard counters and the five newest contact messages/audit records exist.
- Full reporting, filters, exports, date-range analytics, and feature-complete dashboard parity remain outstanding.

## Knowledge / Content

- Knowledge CRUD, publishing workflow, bilingual translation editing, public detail/list rendering, related-content management, gallery/download management, and server-side rich-text sanitization remain unimplemented; `KnowledgeController` is a placeholder.
- Initiative CRUD is a placeholder. Experience create/edit/update/status/delete is partly implemented; complete gallery, listing, filtering, and Next.js behavior parity remain.
- Content status transitions and publication requirements are not yet implemented as a centralized business-rule service for all content types.

## Media

- Upload, metadata update, delete endpoints and storage support exist.
- Media library listing/search/filter/pagination is a placeholder. Full usage/relationship management and safe replacement of in-use media remain outstanding.
- Media deletion failure compensation and orphan cleanup need completion; imported file bytes are not handled by schema migrations.

## Categories

- Category and Tag models, tables, and Knowledge pivots exist.
- Category/Tag CRUD, taxonomy validation/normalization, and CMS assignment workflows are not implemented.

## References

- ContributionArea, Expertise, NavigationItem, and Partner schema/models exist. Partner administration remains a placeholder.
- Reference CRUD/ordering, navigation-tree management, and complete source seed parity for Expertise, NavigationItem, experiences, and people remain outstanding.
- `Permission` is currently a key registry without role assignment relations; runtime authorization uses role middleware rather than data-driven permission assignments.

## Settings

- SiteSetting schema/model and initial settings seeding exist.
- Admin settings are a placeholder. Hero and home-content editors are placeholders; JSON payload validation/versioning and parity with source SiteSetting keys remain outstanding.

## Users

- User model and session authentication exist; user-management routes point to a placeholder controller.
- Admin user listing/creation/editing, role/status changes, password reset, self-protection rules, and complete audit workflow are not implemented.

## Uploads

- Authenticated upload validation and local public-disk storage exist, including MIME/signature checks for supported formats.
- Full CMS media browsing/picking and all content attachment/gallery flows are not implemented. Source uploads are physical files separate from MySQL; no verified file importer exists.
- Production hosting limits, storage permissions, backup/restore, and full deletion compensation need staging verification.

## Public Pages

- Public route shells exist, but home, about/team, initiatives, experiences, knowledge, collaboration, and detail pages render migration placeholders instead of source content.
- Complete bilingual query/fallback behavior, SEO metadata parity, published-only listings, pagination/filtering, and responsive browser verification remain outstanding. Sitemap and robots routes exist but do not establish page parity.

## API / Business Logic

- Health, contact, auth, and media upload endpoints have implementations.
- Public experience/knowledge/person/partner APIs return HTTP 501; Search returns HTTP 501. Other API_SPEC endpoints are not implemented or consumer-verified.
- No source-to-Laravel database importer, KnowledgeType legacy mapping, media-byte transfer/reconciliation, or count/FK integrity verification tool exists.
- Complete authorization, publishing transitions, contact abuse controls, audit coverage, and content validation parity remain outstanding across the full CMS.

## Admin Functionality

- Experience CRUD and dashboard are partial implementations. Media upload/update/delete endpoints exist, but media index is a placeholder.
- Knowledge, Initiative, Person, Partner, User, Settings, Hero, HomeContent, ContactMessage, and AuditLog admin controllers include placeholders or incomplete workflows.
- Search/list filtering, pagination, empty/error/loading/success states, reports, bulk operations, and browser-level admin workflow testing are not complete.