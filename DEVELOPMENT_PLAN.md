# DEVELOPMENT_PLAN.md — ANTRABUMI

**Project:** ANTRABUMI
**Document:** Development Plan
**Version:** 1.0
**Status:** Production Architecture

---

# 1. PURPOSE

Dokumen ini mendefinisikan roadmap implementasi teknis ANTRABUMI dari project initialization hingga production launch.

Development plan harus menerjemahkan:

```text
BUSINESS_RULES.md
        +
CONTENT_STRUCTURE.md
        +
DESIGN_SYSTEM.md
        ↓
IMPLEMENTATION
```

Dokumen ini mencakup:

* Project setup.
* Architecture.
* Database.
* Authentication.
* RBAC.
* CMS.
* Content workflow.
* Media management.
* Public website.
* API.
* Search.
* SEO.
* Accessibility.
* Testing.
* Security.
* Migration.
* Deployment.
* Backup.
* Monitoring.
* Production launch.

---

# 2. DEVELOPMENT PRINCIPLES

Development harus mengikuti prinsip:

```text
Secure by Default
Server First
Content First
Source of Truth
Least Privilege
Validated Mutations
Explicit Relationships
Accessible by Default
Performance Aware
Observable
Recoverable
```

---

# 3. SOURCE DOCUMENT HIERARCHY

Jika terjadi konflik implementasi:

```text
BUSINESS_RULES.md
        ↓
CONTENT_STRUCTURE.md
        ↓
DESIGN_SYSTEM.md
        ↓
DEVELOPMENT_PLAN.md
        ↓
Implementation Detail
```

Business rule memiliki prioritas tertinggi terhadap convenience UI.

---

# 4. RECOMMENDED STACK

Reference implementation:

```text
Framework
Next.js

Language
TypeScript

UI
React

Styling
Tailwind CSS + CSS variables

Database
PostgreSQL

ORM
Prisma

Validation
Zod

Authentication
Secure server-side session architecture

Rich Text
Sanitized structured/rich text editor

Storage
S3-compatible object storage

Search
PostgreSQL full-text search initially

Deployment
VPS + Docker

Reverse Proxy
Nginx or equivalent

Monitoring
Application logs + server monitoring

CI/CD
Git-based CI/CD
```

Stack dapat diganti selama seluruh business rules dan security requirements tetap terpenuhi.

---

# 5. PROJECT STRUCTURE

Recommended structure:

```text
src/
├── app/
│   ├── (public)/
│   ├── admin/
│   ├── api/
│   └── ...
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── content/
│   ├── sections/
│   └── admin/
│
├── features/
│   ├── auth/
│   ├── users/
│   ├── experiences/
│   ├── knowledge/
│   ├── people/
│   ├── partners/
│   ├── media/
│   ├── navigation/
│   ├── contact/
│   └── search/
│
├── lib/
│   ├── auth/
│   ├── db/
│   ├── permissions/
│   ├── validation/
│   ├── storage/
│   ├── cache/
│   ├── seo/
│   └── audit/
│
├── server/
│   ├── services/
│   ├── repositories/
│   └── serializers/
│
├── styles/
│   ├── tokens.css
│   ├── globals.css
│   └── utilities.css
│
└── types/
```

---

# 6. ARCHITECTURE PRINCIPLE

Business logic tidak boleh berada hanya di:

```text
React component
```

atau:

```text
API route
```

Gunakan service/business layer:

```text
UI
 ↓
Server Action / API
 ↓
Validation
 ↓
Authorization
 ↓
Service
 ↓
Repository / ORM
 ↓
Database
```

---

# 7. ENVIRONMENT

Environment minimal:

```text
development
test
staging
production
```

Production secrets tidak boleh berada di repository.

---

# 8. ENVIRONMENT VARIABLES

Contoh:

```text
DATABASE_URL
SESSION_SECRET
STORAGE_ENDPOINT
STORAGE_BUCKET
STORAGE_ACCESS_KEY
STORAGE_SECRET_KEY
APP_URL
NEXT_PUBLIC_APP_URL
```

Environment variable harus divalidasi ketika application startup.

Missing critical secret harus menyebabkan application gagal startup secara aman.

---

# 9. REPOSITORY SETUP

Initial setup:

```text
Git repository
TypeScript
ESLint
Prettier
Tailwind
Next.js
Prisma
Testing framework
Environment validation
```

Tambahkan:

```text
.editorconfig
.gitignore
README.md
.env.example
```

---

# 10. BRANCHING

Recommended:

```text
main
develop
feature/*
fix/*
hotfix/*
```

Production branch harus protected.

Pull request harus melewati automated checks.

---

# 11. CI PIPELINE

Minimum CI:

```text
Install
↓
Type Check
↓
Lint
↓
Unit Tests
↓
Build
↓
Migration Check
```

Jika gagal:

```text
Deployment blocked
```

---

# 12. DATABASE FOUNDATION

Implement PostgreSQL schema berdasarkan:

```text
CONTENT_STRUCTURE.md
BUSINESS_RULES.md
```

Database harus menjadi source of truth untuk content state.

---

# 13. DATABASE CORE ENTITIES

Minimum entities:

```text
User
Session
AuditLog

SiteSetting
NavigationItem

Page
PageTranslation

ContributionArea
ContributionAreaTranslation

Experience
ExperienceTranslation
ExperienceMetric
ExperienceGallery

Person
PersonTranslation

Expertise
ExpertiseTranslation

Knowledge
KnowledgeTranslation
KnowledgeCategory
KnowledgeTag
KnowledgeDownload

Partner

Media

ContactMessage
```

Relationship tables dibuat sesuai kebutuhan normalization.

---

# 14. DATABASE CONSTRAINTS

Database harus memiliki:

* Primary keys.
* Foreign keys.
* Unique constraints.
* Required fields.
* Indexes.
* Cascading behavior yang eksplisit.
* Enum/status constraints bila sesuai.

Jangan mengandalkan application code saja untuk integrity yang dapat dijaga database.

---

# 15. DATABASE INDEXING

Index minimum pada:

```text
slug
status
language
publishedAt
updatedAt
createdAt
foreign keys
```

Index tambahan dibuat berdasarkan query nyata.

Jangan melakukan premature indexing berlebihan.

---

# 16. SLUG CONSTRAINTS

Slug:

```text
lowercase
URL-safe
hyphen-separated
```

Contoh:

```text
community-development-assessment
```

Slug harus unique berdasarkan entity type.

---

# 17. MIGRATIONS

Database migration harus:

* Versioned.
* Reviewable.
* Reproducible.
* Tested sebelum production.

Jangan melakukan perubahan schema production secara manual tanpa migration.

---

# 18. SEED DATA

Development seed harus menyediakan:

```text
Admin users
Sample content
Contribution areas
People
Experiences
Knowledge
Partners
Navigation
Settings
```

Seed content harus jelas ditandai sebagai development fixture.

Tidak boleh dianggap sebagai production organizational claims.

---

# 19. AUTHENTICATION

Authentication harus server-side.

Session:

```text
Secure
HttpOnly
SameSite
Expiration
Server validated
```

Jangan menyimpan credential/session secret sensitif di:

```text
localStorage
sessionStorage
client state
```

---

# 20. LOGIN FLOW

```text
Login
 ↓
Validate credentials
 ↓
Check user status
 ↓
Create session
 ↓
Audit LOGIN
 ↓
Redirect
```

User:

```text
INACTIVE
SUSPENDED
```

tidak dapat login.

---

# 21. SESSION VALIDATION

Setiap protected request harus dapat memvalidasi:

```text
session
user
user status
permissions
```

Session user yang kemudian menjadi `SUSPENDED` harus invalid pada session check berikutnya.

---

# 22. PASSWORD SECURITY

Password:

* Tidak pernah disimpan plaintext.
* Menggunakan modern password hashing.
* Tidak pernah dicatat di audit log.
* Tidak pernah dikirim ke client.

---

# 23. RBAC

Roles:

```text
AUTHOR
EDITOR
ADMIN
SUPER_ADMIN
```

Permission harus mengikuti hierarchy.

---

# 24. PERMISSION ARCHITECTURE

Gunakan centralized authorization:

```text
can(user, action, resource)
```

Contoh:

```text
canPublishExperience()
canManageUsers()
canEditNavigation()
canViewAuditLogs()
```

Authorization harus diverifikasi server-side.

---

# 25. ROLE ESCALATION PROTECTION

User tidak boleh:

* Mengubah role dirinya sendiri menjadi lebih tinggi.
* Membuat SUPER_ADMIN tanpa permission.
* Menghapus protection terhadap last SUPER_ADMIN.

Semua perubahan role harus diaudit.

---

# 26. AUDIT LOG

Audit log immutable.

Events minimum:

```text
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
```

Audit log:

```text
actor
action
entity
entityId
timestamp
metadata
```

Jangan menyimpan:

```text
password
token
session secret
private credentials
```

---

# 27. CONTENT WORKFLOW

Workflow utama:

```text
DRAFT
 ↓
REVIEW
 ↓
PUBLISHED
 ↓
ARCHIVED
```

Allowed return transitions:

```text
REVIEW → DRAFT
PUBLISHED → DRAFT
ARCHIVED → DRAFT
```

Transition harus melalui service layer.

---

# 28. AUTHOR WORKFLOW

AUTHOR dapat:

```text
Create
Edit
Submit for Review
```

AUTHOR tidak dapat publish kecuali business rule diubah secara eksplisit.

---

# 29. EDITOR WORKFLOW

EDITOR dapat:

```text
Review
Edit
Publish
Archive
```

sesuai permission resource.

---

# 30. ADMIN WORKFLOW

ADMIN dapat melakukan administrative content operations dan user/content management sesuai permission.

---

# 31. SUPER ADMIN

SUPER_ADMIN memiliki highest privilege.

Namun seluruh sensitive actions tetap:

```text
validated
audited
protected
```

---

# 32. PUBLISH VALIDATION

Sebelum publish:

```text
Validate slug
Validate translation
Validate title
Validate required content
Validate media
Validate relationships
Validate status transition
Validate metadata
```

Jika gagal:

```text
Publish blocked
```

---

# 33. ATOMIC PUBLISH

Publish harus dilakukan dalam transaction:

```text
validate
↓
update status
↓
set publishedAt
↓
write audit
↓
commit
```

Jika salah satu gagal:

```text
rollback
```

---

# 34. CONTENT TRANSLATION

Languages:

```text
ID
EN
```

Translation harus independent.

Tidak boleh silent machine translation.

Jika translation tidak tersedia:

```text
explicit fallback policy
```

harus diterapkan.

---

# 35. CONTENT EDITOR

Editor mendukung minimal:

```text
Heading
Paragraph
Bold
Italic
Lists
Links
Quotes
Images
```

Rich text harus disanitasi server-side.

---

# 36. CONTENT VALIDATION

Content validation menggunakan schema validation.

Recommended:

```text
Zod
```

Validation dilakukan:

```text
client
+
server
```

Server validation adalah authoritative.

---

# 37. MEDIA PIPELINE

Upload flow:

```text
Select file
 ↓
Client validation
 ↓
Server upload validation
 ↓
MIME validation
 ↓
Signature validation
 ↓
Size validation
 ↓
Dimension validation
 ↓
Storage
 ↓
Media record
 ↓
Audit
```

---

# 38. MEDIA STORAGE

Object storage key harus generated server-side.

Contoh:

```text
media/{year}/{month}/{uuid}.{extension}
```

Jangan menggunakan filename user sebagai storage path utama.

---

# 39. MEDIA OWNERSHIP

Media harus memiliki:

```text
uploadedById
```

Media deletion harus mengecek references terlebih dahulu.

---

# 40. IMAGE PROCESSING

Jika diperlukan:

```text
Original
Thumbnail
Card
Hero
```

variants dapat dibuat saat upload.

Output prefer:

```text
WebP
AVIF
```

jika pipeline mendukung.

---

# 41. MEDIA METADATA

Minimal:

```text
filename
mimeType
size
width
height
altText
caption
attribution
uploadedBy
createdAt
```

---

# 42. PUBLIC WEBSITE IMPLEMENTATION

Public pages:

```text
/
 /about
 /what-we-do
 /experiences
 /experiences/[slug]
 /knowledge
 /knowledge/[slug]
 /knowledge/category/[slug]
 /people
 /people/[slug]
 /collaboration
 /contact
```

---

# 43. HOMEPAGE

Implement berdasarkan:

```text
Hero
Pillars
About
Why ANTRABUMI
Journey
Framework
GEDSI
Contribution Areas
Featured Experiences
People / Expertise
Knowledge
Collaboration CTA
Contact CTA
Footer
```

Featured content hanya:

```text
status = PUBLISHED
```

---

# 44. CONTRIBUTION AREAS

Implement:

```text
LIST
DETAIL
RELATED CONTENT
```

Relationship ke:

```text
Experience
Knowledge
```

---

# 45. EXPERIENCES

List:

```text
Filter
Search
Featured
Pagination
```

Detail:

```text
Hero
Overview
Context
Methodology
Impact
Metrics
Gallery
Related Areas
Related Knowledge
CTA
```

Optional sections hanya dirender jika memiliki data.

---

# 46. PEOPLE

People list hanya menampilkan:

```text
PUBLISHED
```

Person detail:

```text
Portrait
Name
Role
Biography
Expertise
Related content
```

Semua factual profile harus source-backed.

---

# 47. KNOWLEDGE HUB

Knowledge list:

```text
Search
Category
Type
Tag
Pagination
```

Knowledge detail:

```text
Title
Metadata
Content
Downloads
Related Experiences
Contribution Areas
Related Knowledge
```

---

# 48. PARTNERS

Partner implementation:

```text
Logo
Name
Category
Description
Website
```

Website URL hanya:

```text
HTTP
HTTPS
```

Tidak menerima:

```text
javascript:
data:
```

---

# 49. CONTACT

Contact form:

```text
Name
Email
Organization
Interest
Message
```

Interest menggunakan ContributionArea taxonomy.

Submission status:

```text
NEW
READ
IN_PROGRESS
RESOLVED
ARCHIVED
```

---

# 50. CONTACT SECURITY

Contact endpoint harus memiliki:

```text
Rate limiting
Input validation
Length limits
Spam protection
Server-side sanitization
```

Email dan personal data tidak boleh masuk ke public response.

---

# 51. NAVIGATION

Navigation data berasal dari CMS.

Validate:

```text
language
order
visibility
parent
URL
```

Circular parent relationship harus ditolak.

---

# 52. SEARCH

Initial implementation:

```text
PostgreSQL full-text search
```

Search hanya mencakup:

```text
PUBLISHED
```

dan mengikuti language context.

---

# 53. SEARCH RESULT TYPES

Result dapat berupa:

```text
Experience
Knowledge
Person
Contribution Area
```

Search result harus menggunakan public DTO.

---

# 54. SEARCH INDEX

Search index dapat dibuat sebagai:

```text
database query
```

atau:

```text
derived search table
```

Jika menggunakan derived index, source of truth tetap entity utama.

---

# 55. CACHE

Cache digunakan pada:

```text
Public pages
Navigation
Site settings
Published content
Search results jika diperlukan
```

---

# 56. CACHE INVALIDATION

Mutation harus menginvalidasi cache terkait.

Contoh:

```text
Publish Experience
 ↓
Invalidate experience detail
 ↓
Invalidate experience list
 ↓
Invalidate homepage if featured
 ↓
Invalidate search
```

---

# 57. PUBLIC API

API harus menggunakan DTO.

Jangan expose database object secara langsung.

Public response hanya berisi field yang memang public.

Tidak boleh mengirim:

```text
passwordHash
internal tokens
private metadata
internal permissions
```

---

# 58. API METHODS

Gunakan HTTP semantics:

```text
GET
POST
PATCH
DELETE
```

sesuai operation.

Mutation harus memiliki authorization dan validation.

---

# 59. IDEMPOTENCY

Operation yang membutuhkan idempotency harus memiliki strategy yang sesuai.

Contoh:

```text
contact submission
file upload
publish operation
```

---

# 60. RATE LIMITING

Rate limit minimal untuk:

```text
Login
Contact
Search
Public mutation endpoints
Upload
Password operations
```

Threshold harus configurable.

---

# 61. SEO

Setiap public page harus mendukung:

```text
title
description
canonical
Open Graph
Twitter/X metadata jika digunakan
```

---

# 62. SEO VISIBILITY

Only:

```text
PUBLISHED
```

public URLs dapat masuk:

```text
sitemap
search indexing
```

Admin:

```text
noindex
```

Preview:

```text
noindex
```

---

# 63. SITEMAP

Sitemap harus dihasilkan dari published public entities.

Draft tidak boleh muncul.

Archived tidak boleh muncul sebagai current public URL.

---

# 64. CANONICAL URL

Canonical harus:

* Stabil.
* Menggunakan public URL.
* Tidak mengarah ke admin/preview.
* Memperhatikan language routing.

---

# 65. SLUG CHANGE

Jika published slug berubah:

```text
Update canonical
Invalidate cache
Update SEO
Create redirect if supported
Audit change
```

---

# 66. INTERNATIONALIZATION

Primary languages:

```text
ID
EN
```

Language switcher harus mempertahankan route apabila translation tersedia.

Translation state harus dapat terlihat di CMS.

---

# 67. ACCESSIBILITY IMPLEMENTATION

Target:

```text
WCAG 2.2 AA
```

Testing mencakup:

```text
Keyboard
Focus
Screen reader
Contrast
Reduced motion
Form labels
Error announcement
Semantic HTML
```

---

# 68. ACCESSIBILITY AUTOMATION

CI dapat menggunakan:

```text
axe
Lighthouse
```

untuk automated checks.

Automated accessibility testing tidak menggantikan manual testing.

---

# 69. RESPONSIVE TESTING

Minimum viewport testing:

```text
Mobile 320px+
Mobile 390px+
Tablet 768px
Desktop 1024px
Desktop 1280px
Large desktop 1536px+
```

---

# 70. BROWSER TESTING

Minimum:

```text
Chrome
Firefox
Safari
Edge
```

Prioritaskan current stable versions.

---

# 71. UNIT TESTING

Unit tests untuk:

```text
Validation
Permission
Business rules
Slug generation
Status transition
SEO helpers
Search filters
Serialization
```

---

# 72. INTEGRATION TESTING

Integration tests untuk:

```text
Authentication
Authorization
CRUD
Publishing
Media
Contact
Search
Cache invalidation
```

---

# 73. E2E TESTING

Critical flows:

```text
Login
Create content
Submit review
Publish
View public content
Change language
Search
Contact submission
Media upload
Archive content
```

---

# 74. SECURITY TESTING

Test:

```text
Unauthorized access
Privilege escalation
IDOR
CSRF where applicable
XSS
SQL injection
Upload abuse
Open redirect
Unsafe URLs
Rate-limit bypass
Session invalidation
```

---

# 75. XSS PROTECTION

Untrusted content harus:

```text
sanitized
escaped
validated
```

Rich text HTML tidak boleh dirender mentah.

---

# 76. URL SECURITY

External URLs harus divalidasi.

Allowed:

```text
http://
https://
```

Reject:

```text
javascript:
data:
vbscript:
```

dan scheme berbahaya lainnya.

---

# 77. FILE SECURITY

Upload harus memvalidasi:

```text
MIME
Magic bytes / signature
Size
Extension
Dimensions
```

Jangan percaya extension atau Content-Type dari browser saja.

---

# 78. CONCURRENCY CONTROL

Content mutation harus menggunakan optimistic concurrency.

Contoh:

```text
updatedAt
```

Jika record berubah sejak editor membuka:

```text
409 Conflict
```

User harus diberi pilihan untuk:

```text
reload
review changes
```

---

# 79. BACKUP STRATEGY

Production backup minimal:

```text
Daily database backup
Regular off-site backup
Media/object storage backup
```

Backup harus memiliki retention policy.

---

# 80. BACKUP TESTING

Backup tidak dianggap valid hanya karena file berhasil dibuat.

Lakukan:

```text
Restore test
Integrity check
Periodic recovery drill
```

---

# 81. DISASTER RECOVERY

Dokumentasikan:

```text
Database restore
Media restore
Environment recreation
Secret recovery
DNS recovery
Application redeploy
```

---

# 82. VPS DEPLOYMENT

Recommended:

```text
Internet
 ↓
Reverse Proxy
 ↓
Application Container
 ↓
PostgreSQL
 ↓
Object Storage
```

Database dapat berada di host terpisah jika diperlukan.

---

# 83. DOCKER

Production dapat menggunakan:

```text
Docker
Docker Compose
```

Services:

```text
app
db
reverse-proxy
```

Object storage dapat external.

---

# 84. PRODUCTION NETWORK

Database tidak boleh exposed langsung ke public internet jika tidak diperlukan.

Admin interfaces harus protected melalui application authorization dan infrastructure controls.

---

# 85. TLS

Production harus menggunakan:

```text
HTTPS
```

HTTP diarahkan ke HTTPS.

Secure cookies harus aktif pada production.

---

# 86. LOGGING

Application logs harus mencatat informasi yang diperlukan untuk debugging tanpa membocorkan secret.

Jangan log:

```text
password
session secret
access token
private credentials
```

---

# 87. ERROR MONITORING

Production harus memiliki error monitoring.

Minimum informasi:

```text
timestamp
request context
route
error type
stack trace
correlation/request ID
```

Sensitive data harus disanitasi.

---

# 88. HEALTH CHECK

Endpoint internal:

```text
/health
```

atau equivalent.

Check:

```text
Application
Database
Required dependencies
```

Health endpoint tidak boleh membocorkan credentials atau infrastructure secrets.

---

# 89. MONITORING

Monitor minimal:

```text
CPU
Memory
Disk
Database
HTTP errors
Latency
Application crashes
Storage usage
```

---

# 90. PERFORMANCE BUDGET

Target:

```text
Fast initial load
Low JavaScript payload
Optimized images
Minimal layout shift
Responsive interaction
```

Prioritaskan:

```text
LCP
CLS
INP
```

---

# 91. NEXT.JS PERFORMANCE

Default:

```text
Server Components
```

Client Components hanya jika diperlukan.

Gunakan:

```text
dynamic import
lazy loading
image optimization
streaming
cache
```

secara terukur.

---

# 92. FONT PERFORMANCE

Batasi:

```text
font families
font weights
font subsets
```

Gunakan hanya variant yang benar-benar diperlukan.

---

# 93. CONTENT PERFORMANCE

Jangan mengirim full rich content pada list pages.

Gunakan:

```text
excerpt
thumbnail
metadata
```

Detail content hanya pada detail page.

---

# 94. ADMIN PERFORMANCE

CMS table harus mendukung pagination.

Jangan mengambil ribuan record sekaligus.

Gunakan:

```text
server-side pagination
filter
sort
search
```

---

# 95. MIGRATION STRATEGY

Migration content:

```text
Source
 ↓
Normalize
 ↓
Validate
 ↓
Map
 ↓
Import as DRAFT
 ↓
Editorial Review
 ↓
Human Validation
 ↓
Publish
```

Tidak boleh:

```text
AI / imported source
 ↓
PUBLIC
```

tanpa review.

---

# 96. INITIAL CONTENT POPULATION

Urutan:

```text
1. Global settings
2. Navigation
3. Pages
4. Contribution Areas
5. People
6. Experiences
7. Knowledge
8. Partners
9. Media
```

---

# 97. SOURCE VALIDATION

Setiap organizational claim harus memiliki source atau basis editorial yang jelas.

Jika data tidak diketahui:

```text
null
```

atau:

```text
do not publish
```

Jangan mengarang.

---

# 98. AI USAGE

AI dapat membantu:

```text
Drafting
Formatting
Summarization
Content suggestions
Metadata suggestions
```

AI tidak menjadi final authority untuk:

```text
Organizational facts
People biography
Project claims
Impact claims
Partnership claims
Historical claims
```

Final validation tetap manusia.

---

# 99. CONTENT REVIEW CHECKLIST

Sebelum publish:

```text
[ ] Correct language
[ ] Correct title
[ ] Correct slug
[ ] Source verified
[ ] Relationships verified
[ ] Images valid
[ ] Alt text available
[ ] SEO metadata valid
[ ] Links valid
[ ] No unsupported claims
[ ] Editorial review complete
```

---

# 100. PRODUCTION SECURITY CHECKLIST

Sebelum launch:

```text
[ ] HTTPS
[ ] Secure cookies
[ ] Secrets outside repository
[ ] Database not publicly exposed
[ ] RBAC tested
[ ] Audit logs enabled
[ ] Rate limiting enabled
[ ] Upload validation enabled
[ ] Rich text sanitization enabled
[ ] Security headers configured
[ ] Error leakage checked
[ ] Backup configured
[ ] Restore tested
```

---

# 101. SEO LAUNCH CHECKLIST

```text
[ ] Title metadata
[ ] Description metadata
[ ] Canonical URLs
[ ] Sitemap
[ ] Robots configuration
[ ] Open Graph
[ ] Correct language metadata
[ ] Published pages indexable
[ ] Draft pages noindex
[ ] Preview pages noindex
[ ] 404 behavior verified
[ ] Redirects verified
```

---

# 102. ACCESSIBILITY LAUNCH CHECKLIST

```text
[ ] Keyboard navigation
[ ] Visible focus
[ ] Contrast
[ ] Semantic HTML
[ ] Form labels
[ ] Error messages
[ ] Screen reader checks
[ ] Reduced motion
[ ] Mobile accessibility
[ ] Image alt text
[ ] Accessible dialogs/drawers
```

---

# 103. PRODUCTION CONTENT CHECKLIST

```text
[ ] Site settings
[ ] Navigation
[ ] Homepage
[ ] About
[ ] What We Do
[ ] Contribution Areas
[ ] Experiences
[ ] People
[ ] Knowledge
[ ] Partners
[ ] Collaboration
[ ] Contact
[ ] Footer
[ ] SEO
[ ] Legal content
```

---

# 104. DEPLOYMENT PHASES

Development dibagi menjadi:

```text
Phase 0  Foundation
Phase 1  Database
Phase 2  Auth & RBAC
Phase 3  CMS Core
Phase 4  Media
Phase 5  Public UI
Phase 6  Content Modules
Phase 7  Search & SEO
Phase 8  Testing & Security
Phase 9  Migration
Phase 10 Production
Phase 11 Launch & Monitoring
```

---

# 105. PHASE 0 — FOUNDATION

Tasks:

```text
[ ] Repository
[ ] Next.js
[ ] TypeScript
[ ] Tailwind
[ ] ESLint
[ ] Prettier
[ ] Environment validation
[ ] Docker development environment
[ ] CI pipeline
[ ] Design tokens
[ ] Base layout
```

Deliverable:

```text
Running application skeleton
```

---

# 106. PHASE 1 — DATABASE

Tasks:

```text
[ ] Prisma setup
[ ] PostgreSQL
[ ] Schema
[ ] Relations
[ ] Constraints
[ ] Indexes
[ ] Migration
[ ] Seed
```

Deliverable:

```text
Stable development database
```

---

# 107. PHASE 2 — AUTH & RBAC

Tasks:

```text
[ ] User model
[ ] Session
[ ] Login
[ ] Logout
[ ] Password handling
[ ] Role system
[ ] Permission system
[ ] User status
[ ] Session invalidation
[ ] Audit events
```

Deliverable:

```text
Secure protected admin area
```

---

# 108. PHASE 3 — CMS CORE

Tasks:

```text
[ ] Admin shell
[ ] Sidebar
[ ] Dashboard
[ ] Tables
[ ] Filters
[ ] Forms
[ ] Validation
[ ] Editor
[ ] Status workflow
[ ] Preview
```

Deliverable:

```text
Functional content management system
```

---

# 109. PHASE 4 — MEDIA

Tasks:

```text
[ ] Storage integration
[ ] Upload
[ ] Validation
[ ] Media library
[ ] Metadata
[ ] Image processing
[ ] Reference checking
[ ] Delete protection
```

Deliverable:

```text
Production-ready media workflow
```

---

# 110. PHASE 5 — PUBLIC UI

Tasks:

```text
[ ] Header
[ ] Footer
[ ] Container
[ ] Grid
[ ] Buttons
[ ] Typography
[ ] Cards
[ ] Forms
[ ] Responsive navigation
[ ] Accessibility
```

Deliverable:

```text
Reusable public component system
```

---

# 111. PHASE 6 — CONTENT MODULES

Implement:

```text
[ ] Homepage
[ ] About
[ ] What We Do
[ ] Contribution Areas
[ ] Experiences
[ ] People
[ ] Knowledge
[ ] Partners
[ ] Collaboration
[ ] Contact
```

Deliverable:

```text
Complete public website
```

---

# 112. PHASE 7 — SEARCH & SEO

Tasks:

```text
[ ] Search
[ ] Filters
[ ] Search DTO
[ ] Metadata
[ ] Sitemap
[ ] Robots
[ ] Canonical
[ ] Open Graph
[ ] Language metadata
[ ] Redirect handling
```

Deliverable:

```text
Searchable and indexable public site
```

---

# 113. PHASE 8 — TESTING & SECURITY

Tasks:

```text
[ ] Unit tests
[ ] Integration tests
[ ] E2E
[ ] Accessibility
[ ] Security testing
[ ] Performance testing
[ ] Upload abuse testing
[ ] Authorization testing
[ ] Concurrency testing
```

Deliverable:

```text
Release candidate
```

---

# 114. PHASE 9 — MIGRATION

Tasks:

```text
[ ] Inventory source material
[ ] Normalize
[ ] Map schema
[ ] Import draft
[ ] Verify relationships
[ ] Verify translations
[ ] Verify media
[ ] Editorial review
[ ] Human validation
[ ] Publish approved content
```

Deliverable:

```text
Validated production content
```

---

# 115. PHASE 10 — PRODUCTION

Tasks:

```text
[ ] Production VPS
[ ] Docker
[ ] Reverse proxy
[ ] HTTPS
[ ] Database
[ ] Storage
[ ] Secrets
[ ] Backups
[ ] Monitoring
[ ] Logging
[ ] Health checks
```

Deliverable:

```text
Production-ready infrastructure
```

---

# 116. PHASE 11 — LAUNCH

Final sequence:

```text
Final backup
 ↓
Database migration
 ↓
Content verification
 ↓
Environment verification
 ↓
Build
 ↓
Deploy
 ↓
Health check
 ↓
Smoke test
 ↓
SEO check
 ↓
Accessibility check
 ↓
Production monitoring
```

---

# 117. SMOKE TEST

Immediately after deployment:

```text
[ ] Homepage
[ ] Navigation
[ ] Language switch
[ ] Experience detail
[ ] Knowledge detail
[ ] People
[ ] Contact form
[ ] Search
[ ] CMS login
[ ] CMS dashboard
[ ] Publish workflow
[ ] Media upload
```

---

# 118. ROLLBACK PLAN

Every production deployment must have rollback strategy.

Minimum:

```text
Previous application image
Previous migration compatibility
Database backup
Deployment version
```

Rollback procedure must be documented and tested.

---

# 119. RELEASE VERSIONING

Application release should have identifiable version:

```text
v1.0.0
v1.0.1
v1.1.0
```

Database migration version harus dapat dilacak ke release.

---

# 120. DEFINITION OF DONE

Feature dianggap selesai jika:

```text
[ ] UI implemented
[ ] Responsive
[ ] Accessible
[ ] Server validation
[ ] Authorization
[ ] Database integrity
[ ] Error handling
[ ] Loading state
[ ] Empty state
[ ] Audit where required
[ ] Tests
[ ] Documentation
```

---

# 121. DEFINITION OF PRODUCTION READY

System dianggap production ready apabila:

```text
Security
    ✓

Database integrity
    ✓

RBAC
    ✓

Publishing workflow
    ✓

Media pipeline
    ✓

Public website
    ✓

CMS
    ✓

SEO
    ✓

Accessibility
    ✓

Testing
    ✓

Backup
    ✓

Restore
    ✓

Monitoring
    ✓

Deployment
    ✓

Rollback
    ✓
```

---

# 122. FINAL ARCHITECTURE FLOW

```text
                    ┌─────────────────────┐
                    │      VISITOR        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   PUBLIC WEBSITE    │
                    │  Next.js / React    │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 ▼                           ▼
        ┌─────────────────┐        ┌─────────────────┐
        │ Public Content  │        │ Public Search   │
        └────────┬────────┘        └────────┬────────┘
                 │                          │
                 └────────────┬─────────────┘
                              ▼
                    ┌─────────────────────┐
                    │  SERVER SERVICES    │
                    │ Validation / Rules  │
                    │ Authorization       │
                    │ Serialization       │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼──────────────────┐
             ▼                 ▼                  ▼
      ┌────────────┐   ┌─────────────┐    ┌────────────┐
      │ PostgreSQL │   │ Object      │    │ Cache      │
      │            │   │ Storage     │    │            │
      └────────────┘   └─────────────┘    └────────────┘


                    ┌─────────────────────┐
                    │    CMS USERS        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      CMS            │
                    │ Auth + RBAC         │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ BUSINESS SERVICES   │
                    │ Validation          │
                    │ Authorization       │
                    │ Publishing          │
                    │ Audit               │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    DATABASE         │
                    └─────────────────────┘
```

---

# 123. CONTENT GOVERNANCE FLOW

```text
SOURCE
  ↓
DRAFT
  ↓
REVIEW
  ↓
HUMAN VALIDATION
  ↓
PUBLISHED
  ↓
PUBLIC
```

AI atau automation tidak boleh melewati human validation untuk organizational claims.

---

# 124. SECURITY FLOW

```text
REQUEST
  ↓
Authentication
  ↓
User Status
  ↓
Authorization
  ↓
Input Validation
  ↓
Business Rule
  ↓
Transaction
  ↓
Audit
  ↓
Response
```

---

# 125. PUBLISH FLOW

```text
Editor
  ↓
Edit Content
  ↓
Validate
  ↓
Review
  ↓
Publish Request
  ↓
Permission Check
  ↓
Publish Validation
  ↓
Database Transaction
  ├── Status
  ├── publishedAt
  └── Audit
  ↓
Cache Invalidation
  ↓
Public
```

---

# 126. MEDIA FLOW

```text
User
 ↓
Upload
 ↓
Server Validation
 ↓
MIME / Signature / Size / Dimensions
 ↓
Storage
 ↓
Media Record
 ↓
Reference
 ↓
Public Delivery
```

---

# 127. DEPLOYMENT FLOW

```text
Git Push
 ↓
CI
 ├── Typecheck
 ├── Lint
 ├── Test
 └── Build
 ↓
Deployment Artifact
 ↓
Production
 ↓
Migration
 ↓
Health Check
 ↓
Smoke Test
 ↓
Monitoring
```

---

# 128. PRIORITY RULE

Jika development menghadapi konflik antara:

```text
Security
Data Integrity
Authorization
Publishing
Editorial
UI Convenience
```

gunakan prioritas:

```text
1. Security
2. Data Integrity
3. Authorization
4. Publishing Integrity
5. Editorial Integrity
6. UI Convenience
```

---

# 129. FINAL DEVELOPMENT PRINCIPLE

ANTRABUMI harus dibangun sebagai:

```text
Content Platform
+
Editorial CMS
+
Knowledge Repository
+
Public Website
```

bukan sekadar landing page.

Architecture harus menjaga:

```text
SOURCE
  ↓
STRUCTURED CONTENT
  ↓
VALIDATION
  ↓
EDITORIAL REVIEW
  ↓
PUBLISHING
  ↓
PUBLIC EXPERIENCE
```

Setiap layer harus dapat diaudit, diuji, dipulihkan, dan dikembangkan tanpa merusak source of truth.

---

# 130. FINAL PROJECT CHECKLIST

```text
FOUNDATION
[ ] Repository
[ ] Framework
[ ] TypeScript
[ ] CI/CD
[ ] Environment

DATABASE
[ ] PostgreSQL
[ ] Schema
[ ] Relations
[ ] Constraints
[ ] Migration
[ ] Seed

AUTH
[ ] Authentication
[ ] Session
[ ] RBAC
[ ] User status
[ ] Audit

CMS
[ ] Dashboard
[ ] Content CRUD
[ ] Workflow
[ ] Preview
[ ] Publishing
[ ] Media

PUBLIC
[ ] Homepage
[ ] About
[ ] What We Do
[ ] Experiences
[ ] People
[ ] Knowledge
[ ] Partners
[ ] Collaboration
[ ] Contact

PLATFORM
[ ] Search
[ ] API
[ ] Cache
[ ] SEO
[ ] Sitemap
[ ] i18n

QUALITY
[ ] Unit tests
[ ] Integration tests
[ ] E2E
[ ] Accessibility
[ ] Security
[ ] Performance

INFRASTRUCTURE
[ ] Docker
[ ] VPS
[ ] HTTPS
[ ] Backup
[ ] Restore
[ ] Monitoring
[ ] Logging
[ ] Rollback

LAUNCH
[ ] Migration
[ ] Content validation
[ ] Smoke test
[ ] SEO verification
[ ] Accessibility verification
[ ] Production monitoring
```

---

# 131. END STATE

Ketika seluruh phase selesai, ANTRABUMI harus memiliki:

```text
                 ANTRABUMI PLATFORM
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   PUBLIC WEB          CMS             CONTENT
        │                │                │
        │                │                │
        └────────────────┼────────────────┘
                         ▼
                   BUSINESS LAYER
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
          PostgreSQL   Storage    Search
              │          │          │
              └──────────┼──────────┘
                         ▼
                  AUDIT / SECURITY
                         │
                         ▼
                    PRODUCTION
```

**ANTRABUMI bukan sekadar website.**

Ia merupakan platform editorial dan knowledge yang menghubungkan:

```text
People
+
Projects
+
Knowledge
+
Communities
+
Nature
+
Collaboration
```

dengan governance yang menjaga agar informasi yang masuk ke public tetap:

```text
Structured
Validated
Source-backed
Human-reviewed
Accessible
Secure
Recoverable
```

**END OF DEVELOPMENT_PLAN.md**
