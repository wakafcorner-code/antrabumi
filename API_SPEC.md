# API_SPEC.md — ANTRABUMI

**Project:** ANTRABUMI
**API Version:** v1
**Architecture:** Next.js + TypeScript + Prisma + MySQL
**Authentication:** Secure session-based authentication
**Status:** Production Architecture

---

# 1. PURPOSE

Dokumen ini mendefinisikan kontrak backend untuk ANTRABUMI Full-Stack Website + CMS.

API harus mendukung:

* Public website
* Admin CMS
* Authentication
* RBAC
* CRUD content
* Publishing workflow
* Multilingual content
* Media management
* Search
* Contact messages
* Navigation
* Site settings
* Audit logs

API harus menjadi lapisan terkontrol antara:

```text
Public / Admin UI
       ↓
Server Actions / Route Handlers
       ↓
Validation
       ↓
Authorization
       ↓
Service / Data Layer
       ↓
Prisma
       ↓
MySQL
```

---

# 2. API PRINCIPLES

## 2.1 Server-side first

Semua operasi yang:

* mengubah database,
* membutuhkan authentication,
* membutuhkan authorization,
* mengakses secret,
* mengakses storage,

harus dijalankan di server.

---

## 2.2 Validation

Semua input eksternal harus divalidasi menggunakan schema validation.

Recommended:

```text
Zod
```

Client-side validation boleh digunakan untuk UX, tetapi server-side validation tetap wajib.

---

## 2.3 Authorization

Authentication hanya membuktikan identitas.

Authorization menentukan apakah user boleh melakukan operasi tertentu.

Jangan mengandalkan:

```text
hidden button
disabled button
frontend role check
```

sebagai security mechanism.

---

# 3. API TYPES

API dibagi menjadi:

```text
PUBLIC API
AUTH API
ADMIN API
MEDIA API
SYSTEM API
```

---

# 4. PUBLIC API

Public API tidak membutuhkan login.

Namun public API hanya boleh mengembalikan:

```text
PUBLISHED
```

content.

---

# 5. PUBLIC EXPERIENCES

## GET

```http
GET /api/v1/experiences
```

Query:

```text
page
limit
search
year
contributionArea
featured
language
```

Example:

```http
GET /api/v1/experiences?page=1&limit=12&language=ID
```

Response:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 0,
    "totalPages": 0
  }
}
```

---

# 6. PUBLIC EXPERIENCE DETAIL

```http
GET /api/v1/experiences/:slug
```

Required:

```text
slug
language
```

Only published experiences may be returned.

If unavailable:

```http
404 Not Found
```

---

# 7. PUBLIC FEATURED EXPERIENCES

```http
GET /api/v1/experiences/featured
```

Returns published experiences where:

```text
featured = true
```

Optional:

```text
language
limit
```

---

# 8. PUBLIC CONTRIBUTION AREAS

```http
GET /api/v1/contribution-areas
```

Optional:

```text
language
```

Only published contribution areas are returned.

---

# 9. PUBLIC CONTRIBUTION AREA DETAIL

```http
GET /api/v1/contribution-areas/:slug
```

Returns:

* Contribution Area
* Description
* Related Experiences
* Related Knowledge

Only published related content may be returned.

---

# 10. PUBLIC PEOPLE

```http
GET /api/v1/people
```

Query:

```text
page
limit
language
expertise
```

Only published people are returned.

---

# 11. PUBLIC PERSON DETAIL

```http
GET /api/v1/people/:slug
```

Returns:

```text
Profile
Biography
Expertise
Related content where applicable
```

---

# 12. PUBLIC KNOWLEDGE

```http
GET /api/v1/knowledge
```

Query:

```text
page
limit
search
type
category
tag
language
featured
```

Example:

```http
GET /api/v1/knowledge?type=REPORT&language=ID
```

Only published Knowledge is returned.

---

# 13. PUBLIC KNOWLEDGE DETAIL

```http
GET /api/v1/knowledge/:slug
```

Returns:

* Title
* Excerpt
* Content
* Cover
* Author
* Publication date
* Categories
* Tags
* Downloads
* Related Experiences
* Related Knowledge

---

# 14. PUBLIC KNOWLEDGE CATEGORIES

```http
GET /api/v1/knowledge/categories
```

Optional:

```text
language
```

---

# 15. PUBLIC KNOWLEDGE TAGS

```http
GET /api/v1/knowledge/tags
```

Returns available tags used by published Knowledge.

---

# 16. PUBLIC SEARCH

```http
GET /api/v1/search
```

Query:

```text
q
type
language
page
limit
```

Supported types:

```text
all
experiences
knowledge
people
contribution-areas
```

Example:

```http
GET /api/v1/search?q=community&type=all&language=EN
```

Search must never return:

```text
DRAFT
REVIEW
ARCHIVED
```

content.

---

# 17. PUBLIC PAGES

```http
GET /api/v1/pages/:slug
```

Required:

```text
language
```

Only published pages are returned.

---

# 18. PUBLIC NAVIGATION

```http
GET /api/v1/navigation
```

Query:

```text
language
```

Returns visible navigation items.

The response should preserve hierarchy.

---

# 19. PUBLIC SITE SETTINGS

Only explicitly public settings may be exposed.

```http
GET /api/v1/site
```

Possible response:

```json
{
  "name": "ANTRABUMI",
  "tagline": "Connecting Knowledge, Nature, & Communities.",
  "email": "hello@antrabumi.org",
  "phone": "+62-823-3038-7505"
}
```

Sensitive settings must never be exposed.

---

# 20. PUBLIC CONTACT FORM

```http
POST /api/v1/contact
```

Request:

```json
{
  "name": "Example Name",
  "email": "example@email.com",
  "organization": "Example Organization",
  "phone": "",
  "subject": "Collaboration",
  "message": "Hello ANTRABUMI...",
  "areaOfInterest": "Research"
}
```

Required:

```text
name
email
subject
message
```

Server must:

1. Validate input.
2. Apply abuse protection.
3. Create `ContactMessage`.
4. Return success response.

---

# 21. CONTACT SUCCESS RESPONSE

```http
201 Created
```

```json
{
  "success": true,
  "message": "Your message has been received."
}
```

Do not return internal database identifiers unnecessarily.

---

# 22. CONTACT ABUSE PROTECTION

The contact endpoint should support:

* Rate limiting
* Request validation
* Payload size limits
* Spam protection
* Optional honeypot
* Optional CAPTCHA integration

The implementation must not expose whether internal anti-spam checks were triggered.

---

# 23. AUTHENTICATION

Authentication must protect `/admin`.

Recommended flow:

```text
Login
 ↓
Validate credentials
 ↓
Create secure session
 ↓
Redirect to /admin
```

---

# 24. LOGIN

Implementation may use an authentication library rather than exposing a custom credential endpoint.

If a Route Handler is required:

```http
POST /api/v1/auth/login
```

Request:

```json
{
  "email": "user@example.com",
  "password": "..."
}
```

Invalid credentials should produce a generic error.

Do not reveal:

```text
email does not exist
password incorrect
user disabled
```

as separate public messages.

---

# 25. LOGOUT

```http
POST /api/v1/auth/logout
```

The server invalidates the current session.

---

# 26. CURRENT USER

```http
GET /api/v1/auth/me
```

Authenticated users receive:

```json
{
  "id": "...",
  "name": "...",
  "email": "...",
  "role": "EDITOR"
}
```

Never return:

```text
passwordHash
authentication secret
session secret
```

---

# 27. AUTHORIZATION MODEL

Minimum roles:

```text
SUPER_ADMIN
ADMIN
EDITOR
AUTHOR
```

Recommended capability matrix:

| Capability       |  Author | Editor |   Admin | Super Admin |
| ---------------- | ------: | -----: | ------: | ----------: |
| View dashboard   |     Yes |    Yes |     Yes |         Yes |
| Create content   |     Yes |    Yes |     Yes |         Yes |
| Edit own content |     Yes |    Yes |     Yes |         Yes |
| Edit all content |      No |    Yes |     Yes |         Yes |
| Submit review    |     Yes |    Yes |     Yes |         Yes |
| Publish          |      No |    Yes |     Yes |         Yes |
| Archive          | Limited |    Yes |     Yes |         Yes |
| Media management | Limited |    Yes |     Yes |         Yes |
| Messages         |      No |    Yes |     Yes |         Yes |
| Users            |      No |     No |     Yes |         Yes |
| Settings         |      No |     No |     Yes |         Yes |
| Roles            |      No |     No | Limited |         Yes |
| Audit logs       |      No |     No | Limited |         Yes |

Actual implementation may refine these permissions without weakening security.

---

# 28. ADMIN API CONVENTION

Admin endpoints use:

```text
/api/v1/admin/*
```

All endpoints require authentication.

Authorization is evaluated before database mutation.

---

# 29. ADMIN DASHBOARD

```http
GET /api/v1/admin/dashboard
```

Returns calculated statistics:

```json
{
  "experiences": {
    "published": 0,
    "draft": 0
  },
  "knowledge": {
    "published": 0,
    "draft": 0
  },
  "people": 0,
  "messages": {
    "new": 0
  },
  "media": 0
}
```

Values must come from the database.

Never seed fake dashboard statistics.

---

# 30. ADMIN EXPERIENCES

```http
GET    /api/v1/admin/experiences
POST   /api/v1/admin/experiences
GET    /api/v1/admin/experiences/:id
PATCH  /api/v1/admin/experiences/:id
DELETE /api/v1/admin/experiences/:id
```

Supported operations:

* Search
* Filter
* Sort
* Pagination
* Create
* Update
* Archive
* Delete where authorized

---

# 31. CREATE EXPERIENCE

```http
POST /api/v1/admin/experiences
```

Example:

```json
{
  "slug": "example-experience",
  "year": 2026,
  "location": "Belitung",
  "clientName": null,
  "featured": false,
  "translations": [
    {
      "language": "ID",
      "title": "Example Experience",
      "excerpt": "...",
      "description": "...",
      "methodology": "...",
      "impact": null
    }
  ]
}
```

Required fields depend on content status.

Drafts may contain incomplete optional fields.

Publishing requires stricter validation.

---

# 32. UPDATE EXPERIENCE

```http
PATCH /api/v1/admin/experiences/:id
```

Partial updates are allowed.

The server must validate only after merging with the existing state where necessary.

---

# 33. EXPERIENCE PUBLISH

```http
POST /api/v1/admin/experiences/:id/publish
```

Requirements:

* User authorized to publish.
* Required content exists.
* Slug is valid.
* At least required language content exists.
* Referenced media is valid.
* Content is not already archived.

On success:

```text
status = PUBLISHED
publishedAt = current timestamp
```

---

# 34. EXPERIENCE ARCHIVE

```http
POST /api/v1/admin/experiences/:id/archive
```

Changes:

```text
status = ARCHIVED
```

Archived experiences disappear from public queries.

---

# 35. EXPERIENCE PREVIEW

```http
GET /api/v1/admin/experiences/:id/preview
```

Requires:

* Authentication
* Appropriate permission

Preview must not be indexable by search engines.

---

# 36. ADMIN CONTRIBUTION AREAS

```http
GET    /api/v1/admin/contribution-areas
POST   /api/v1/admin/contribution-areas
GET    /api/v1/admin/contribution-areas/:id
PATCH  /api/v1/admin/contribution-areas/:id
DELETE /api/v1/admin/contribution-areas/:id
```

Publishing:

```http
POST /api/v1/admin/contribution-areas/:id/publish
```

---

# 37. ADMIN PEOPLE

```http
GET    /api/v1/admin/people
POST   /api/v1/admin/people
GET    /api/v1/admin/people/:id
PATCH  /api/v1/admin/people/:id
DELETE /api/v1/admin/people/:id
```

Publishing:

```http
POST /api/v1/admin/people/:id/publish
```

---

# 38. ADMIN KNOWLEDGE

```http
GET    /api/v1/admin/knowledge
POST   /api/v1/admin/knowledge
GET    /api/v1/admin/knowledge/:id
PATCH  /api/v1/admin/knowledge/:id
DELETE /api/v1/admin/knowledge/:id
```

Publishing:

```http
POST /api/v1/admin/knowledge/:id/publish
```

---

# 39. KNOWLEDGE WORKFLOW

```text
DRAFT
 ↓
REVIEW
 ↓
PUBLISHED
 ↓
ARCHIVED
```

Authors may submit:

```http
POST /api/v1/admin/knowledge/:id/submit-review
```

Authorized reviewers may approve/publish.

---

# 40. ADMIN PAGES

```http
GET    /api/v1/admin/pages
POST   /api/v1/admin/pages
GET    /api/v1/admin/pages/:id
PATCH  /api/v1/admin/pages/:id
DELETE /api/v1/admin/pages/:id
```

Publishing:

```http
POST /api/v1/admin/pages/:id/publish
```

---

# 41. ADMIN CATEGORIES

```http
GET    /api/v1/admin/categories
POST   /api/v1/admin/categories
PATCH  /api/v1/admin/categories/:id
DELETE /api/v1/admin/categories/:id
```

Deleting a category that is still referenced must either:

1. Be prevented, or
2. Require explicit reassignment.

---

# 42. ADMIN TAGS

```http
GET    /api/v1/admin/tags
POST   /api/v1/admin/tags
PATCH  /api/v1/admin/tags/:id
DELETE /api/v1/admin/tags/:id
```

Duplicate tags must be prevented.

Slug normalization should be deterministic.

---

# 43. ADMIN EXPERTISE

```http
GET    /api/v1/admin/expertise
POST   /api/v1/admin/expertise
PATCH  /api/v1/admin/expertise/:id
DELETE /api/v1/admin/expertise/:id
```

Expertise records should be reusable across People.

---

# 44. ADMIN PARTNERS

```http
GET    /api/v1/admin/partners
POST   /api/v1/admin/partners
GET    /api/v1/admin/partners/:id
PATCH  /api/v1/admin/partners/:id
DELETE /api/v1/admin/partners/:id
```

Publishing:

```http
POST /api/v1/admin/partners/:id/publish
```

No partner relationship should be created without source-supported information.

---

# 45. ADMIN MEDIA

```http
GET  /api/v1/admin/media
POST /api/v1/admin/media
GET  /api/v1/admin/media/:id
PATCH /api/v1/admin/media/:id
DELETE /api/v1/admin/media/:id
```

Supported operations:

* Upload
* Search
* Filter
* Metadata update
* Delete
* Reference inspection

---

# 46. MEDIA UPLOAD

```http
POST /api/v1/admin/media
Content-Type: multipart/form-data
```

Expected fields:

```text
file
altText
caption
attribution
```

Server validates:

* MIME type
* Actual file type
* File size
* Filename
* Image dimensions
* Storage destination

---

# 47. MEDIA RESPONSE

Example:

```json
{
  "id": "media_123",
  "filename": "field-photo.webp",
  "mimeType": "image/webp",
  "size": 182736,
  "width": 1600,
  "height": 1000,
  "url": "/media/..."
}
```

Storage implementation details should not expose private credentials.

---

# 48. MEDIA REFERENCE CHECK

Before deleting media:

```http
GET /api/v1/admin/media/:id/references
```

Response:

```json
{
  "references": [
    {
      "type": "EXPERIENCE",
      "id": "..."
    }
  ]
}
```

If media is referenced by published content, deletion should normally be blocked.

---

# 49. ADMIN CONTACT MESSAGES

```http
GET /api/v1/admin/messages
GET /api/v1/admin/messages/:id
PATCH /api/v1/admin/messages/:id
```

Query:

```text
status
search
page
limit
sort
```

---

# 50. MESSAGE STATUS UPDATE

```http
PATCH /api/v1/admin/messages/:id
```

Example:

```json
{
  "status": "IN_PROGRESS",
  "assignedToId": "user_123"
}
```

Only authorized users may assign messages.

---

# 51. ADMIN NAVIGATION

```http
GET    /api/v1/admin/navigation
POST   /api/v1/admin/navigation
PATCH  /api/v1/admin/navigation/:id
DELETE /api/v1/admin/navigation/:id
```

Navigation updates must validate:

* Parent exists.
* Parent does not create a cycle.
* Order is valid.
* Language is valid.
* URL is valid where provided.

---

# 52. ADMIN USERS

```http
GET   /api/v1/admin/users
POST  /api/v1/admin/users
GET   /api/v1/admin/users/:id
PATCH /api/v1/admin/users/:id
```

User deletion should generally be replaced by:

```text
status = INACTIVE
```

or:

```text
status = SUSPENDED
```

---

# 53. CHANGE USER ROLE

```http
POST /api/v1/admin/users/:id/role
```

Request:

```json
{
  "role": "EDITOR"
}
```

Requirements:

* Only authorized administrators.
* Cannot arbitrarily elevate own role.
* Must create an audit record.

---

# 54. ADMIN SETTINGS

```http
GET   /api/v1/admin/settings
PATCH /api/v1/admin/settings
```

Only authorized administrators may modify settings.

Sensitive environment variables must never be editable through CMS settings.

---

# 55. ADMIN AUDIT LOGS

```http
GET /api/v1/admin/audit-logs
GET /api/v1/admin/audit-logs/:id
```

Filters:

```text
user
action
entity
dateFrom
dateTo
```

Audit logs should normally be immutable.

---

# 56. RESPONSE FORMAT

Successful collection response:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

Successful single response:

```json
{
  "data": {}
}
```

Successful mutation:

```json
{
  "data": {},
  "message": "Operation completed successfully."
}
```

---

# 57. ERROR FORMAT

All API errors should follow a predictable structure:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The submitted data is invalid.",
    "fields": {
      "email": "Invalid email address."
    }
  }
}
```

---

# 58. HTTP STATUS CODES

Use standard status codes.

```text
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
413 Payload Too Large
422 Unprocessable Entity
429 Too Many Requests
500 Internal Server Error
```

---

# 59. ERROR CODES

Recommended codes:

```text
AUTH_REQUIRED
AUTH_INVALID
FORBIDDEN
NOT_FOUND
VALIDATION_ERROR
CONFLICT
SLUG_EXISTS
CONTENT_NOT_READY
CONTENT_NOT_PUBLISHED
MEDIA_INVALID
MEDIA_TOO_LARGE
MEDIA_IN_USE
RATE_LIMITED
INTERNAL_ERROR
```

---

# 60. CONTENT PUBLISH VALIDATION

Publishing must perform stricter validation than saving drafts.

Example:

```text
DRAFT
→ minimal validation

REVIEW
→ structural validation

PUBLISHED
→ required public fields validation
```

The exact required fields depend on entity type.

---

# 61. TRANSLATION RULES

For translated content:

```text
ID
EN
```

Each translation is independently stored.

API must not silently overwrite one language with another.

Example:

```json
{
  "translations": [
    {
      "language": "ID",
      "title": "Tentang ANTRABUMI"
    },
    {
      "language": "EN",
      "title": "About ANTRABUMI"
    }
  ]
}
```

---

# 62. LANGUAGE FALLBACK

Public APIs should follow a deterministic policy.

Recommended:

```text
requested language
      ↓
exact translation available?
      ↓ yes
return translation
      ↓ no
fallback to ID if configured
      ↓
otherwise return not available
```

The fallback policy must be explicit in the application configuration.

Never silently present a misleading translation.

---

# 63. PAGINATION

Default:

```text
page = 1
limit = 20
```

Recommended maximum:

```text
limit = 100
```

Client-provided excessive limits must be capped.

---

# 64. SORTING

Only whitelisted fields may be used for sorting.

Example:

```text
createdAt
updatedAt
publishedAt
year
order
title
```

Never directly inject client-provided SQL/order expressions.

---

# 65. FILTERING

Filters must use validated enumerations where possible.

Example:

```text
status
language
type
featured
year
category
tag
```

---

# 66. SLUG RESOLUTION

Public routes should use:

```text
slug
```

rather than exposing database IDs.

Admin routes may use:

```text
id
```

unless there is a specific reason to use another identifier.

---

# 67. SERVER ACTIONS

Server Actions are preferred for operations tightly coupled to the Next.js application.

Suitable examples:

```text
createExperience()
updateExperience()
submitExperienceForReview()
publishExperience()
createKnowledge()
updateKnowledge()
publishKnowledge()
updateMessageStatus()
```

They must still perform:

* Authentication
* Authorization
* Validation
* Database operation
* Audit logging where applicable

---

# 68. ROUTE HANDLERS

Route Handlers are preferred when:

* External consumers may need an API.
* HTTP semantics are useful.
* File upload is involved.
* Public API endpoints are required.
* Webhook integration is added later.

---

# 69. SERVICE LAYER

Business logic should not be duplicated between:

```text
Server Actions
Route Handlers
```

Preferred:

```text
Server Action
     ↓
Service
     ↓
Repository / Prisma
```

and:

```text
Route Handler
     ↓
Service
     ↓
Repository / Prisma
```

---

# 70. VALIDATION LAYER

Recommended structure:

```text
lib/
└── validation/
    ├── auth.ts
    ├── experience.ts
    ├── knowledge.ts
    ├── people.ts
    ├── media.ts
    ├── contact.ts
    ├── navigation.ts
    └── settings.ts
```

Schemas should be reusable between:

* API
* Server Actions
* Forms

without trusting client validation.

---

# 71. AUTHORIZATION LAYER

Recommended:

```text
lib/auth/
├── session.ts
├── permissions.ts
├── guards.ts
└── roles.ts
```

Example conceptual usage:

```text
requireAuth()
requireRole("EDITOR")
requirePermission("knowledge.publish")
```

Exact implementation may vary.

---

# 72. AUDIT LOGGING

Important mutations should create audit records.

At minimum:

```text
CREATE
UPDATE
DELETE
PUBLISH
ARCHIVE
UPLOAD
USER_ROLE_CHANGED
SETTING_CHANGED
```

Authentication events:

```text
LOGIN
LOGOUT
```

Audit logging must not expose passwords, tokens, or secrets.

---

# 73. TRANSACTION REQUIREMENTS

Use database transactions when multiple related mutations must succeed or fail together.

Examples:

### Publishing

```text
Update status
+
Set publishedAt
+
Create audit log
```

### Knowledge update

```text
Update Knowledge
+
Update translations
+
Update categories
+
Update tags
```

### Role change

```text
Update user role
+
Create audit log
```

---

# 74. CONCURRENCY

The API should account for multiple CMS users editing the same content.

Recommended future-safe mechanism:

```text
updatedAt comparison
```

If a record changed after the editor loaded it:

```text
409 Conflict
```

The user should be informed that newer content exists.

---

# 75. DRAFT PREVIEW SECURITY

Preview endpoints must:

* Require authentication.
* Require content permission.
* Never be indexed.
* Never be included in sitemap.
* Never appear in public search.
* Avoid exposing unpublished data through predictable URLs.

---

# 76. PUBLIC CACHE POLICY

Public published content may be cached.

Admin content must not be publicly cached.

When content is published/updated:

```text
invalidate relevant cache
```

Examples:

```text
homepage
experience detail
knowledge detail
people
navigation
```

---

# 77. SECURITY HEADERS

Production responses should use appropriate security headers.

Examples:

```text
Content-Security-Policy
X-Content-Type-Options
Referrer-Policy
Permissions-Policy
Strict-Transport-Security
```

Exact CSP configuration must account for:

* Image storage
* Fonts
* Analytics if added
* CMS editor
* Authentication

---

# 78. RATE LIMITING

Rate limiting should be applied especially to:

```text
login
contact
public search
media upload
admin mutations
```

Limits should be configurable.

---

# 79. FILE UPLOAD SECURITY

Never trust:

```text
filename
extension
client MIME type
```

Validate server-side.

Recommended:

```text
allowed MIME types
maximum file size
actual file signature
image dimensions
safe generated storage key
```

Do not use original filenames as storage identifiers.

---

# 80. RICH TEXT SECURITY

Rich text must be sanitized before public rendering.

Disallow unsafe content such as:

```text
<script>
javascript:
unsafe iframe
event handler injection
```

The allowed HTML subset must be explicitly defined.

---

# 81. API LOGGING

Production logs should contain enough information to diagnose failures without exposing sensitive data.

Never log:

```text
password
session token
authentication secret
database password
storage secret
```

---

# 82. API OBSERVABILITY

At minimum monitor:

```text
5xx responses
authentication failures
upload failures
database errors
slow requests
rate-limit events
```

---

# 83. HEALTH CHECK

Provide an internal health endpoint:

```http
GET /api/health
```

Response:

```json
{
  "status": "ok"
}
```

A deeper protected health check may verify:

```text
database
storage
```

without exposing infrastructure credentials.

---

# 84. API VERSIONING

Initial version:

```text
/api/v1/
```

Breaking changes require a new version.

Avoid breaking existing public contracts unnecessarily.

---

# 85. API DOCUMENTATION

The implementation should eventually expose machine-readable API documentation where appropriate.

Recommended:

```text
OpenAPI
```

The documentation must reflect the actual implementation rather than becoming a second inconsistent source of truth.

---

# 86. API TESTING

Tests must cover:

### Public

* Published content retrieval.
* Draft exclusion.
* Language behavior.
* Search.
* Pagination.
* Filtering.

### Authentication

* Valid login.
* Invalid login.
* Session.
* Logout.
* Inactive user.

### Authorization

* Author restrictions.
* Editor publishing.
* Admin operations.
* Super Admin operations.

### CMS

* CRUD.
* Validation.
* Publishing.
* Archive.
* Preview.

### Media

* Valid upload.
* Invalid file.
* Oversized file.
* Referenced media deletion.

### Contact

* Valid submission.
* Invalid email.
* Required fields.
* Rate limiting.

### Audit

* Mutation creates log.
* Role change creates log.
* Logs cannot be modified by ordinary users.

---

# 87. API DEFINITION OF DONE

API implementation is complete when:

1. Public endpoints work.
2. Admin endpoints work.
3. Authentication works.
4. RBAC works.
5. Validation works.
6. Publishing workflow works.
7. ID/EN works.
8. Search works.
9. Media upload works.
10. Contact form works.
11. Audit logs work.
12. Error format is consistent.
13. Rate limiting exists for sensitive endpoints.
14. Draft content is protected.
15. Server-side authorization is enforced.
16. Transactions are used where necessary.
17. API tests pass.
18. Production build passes.
19. No secrets are exposed.
20. API documentation matches implementation.

---

# 88. FINAL API ARCHITECTURE

```text
                 PUBLIC WEBSITE
                       │
                       ▼
                Public API / SSR
                       │
                       ▼
                 Service Layer
                       │
                       ▼
                    Prisma
                       │
                       ▼
                    MySQL


                  ADMIN CMS
                       │
                       ▼
          Server Actions / Route Handlers
                       │
              ┌────────┴────────┐
              ▼                 ▼
         Authentication     Validation
              │                 │
              └────────┬────────┘
                       ▼
                  Authorization
                       │
                       ▼
                 Service Layer
                       │
              ┌────────┴────────┐
              ▼                 ▼
           Prisma            Storage
              │                 │
              ▼                 ▼
           MySQL             Media


                EVERY MUTATION
                       │
                       ▼
                  AUDIT LOG
```

API utama harus tetap sederhana, terprediksi, dan aman. Business logic tidak boleh tersebar secara acak di component UI, route handler, dan server action.

**END OF API_SPEC.md**
