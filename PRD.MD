# PRD.md — ANTRABUMI Full-Stack Website + CMS

**Project:** ANTRABUMI
**Year:** 2026
**Type:** Full-stack organizational profile website + CMS
**Primary Positioning:** Connecting Knowledge, Nature, & Communities.

---

# 1. PRODUCT OVERVIEW

ANTRABUMI is an independent organization working at the intersection of:

* Knowledge
* Nature
* Communities

The website must communicate ANTRABUMI's organizational identity, areas of contribution, experiences, people, knowledge, and opportunities for collaboration.

The product consists of two connected systems:

1. **Public Website**
2. **Admin CMS**

The public website is the organization's primary digital presence.

The CMS allows authorized ANTRABUMI users to manage website content without modifying source code.

---

# 2. PRODUCT GOALS

## 2.1 Primary Goals

The system must:

1. Present ANTRABUMI clearly and professionally.
2. Communicate the connection between knowledge, nature, and communities.
3. Showcase organizational experiences and contribution areas.
4. Present people and collective expertise.
5. Provide a knowledge hub.
6. Enable collaboration inquiries.
7. Allow authorized staff to manage content through a CMS.
8. Support Indonesian and English.
9. Maintain a scalable technical architecture.
10. Preserve the official ANTRABUMI identity and terminology.

---

# 3. NON-GOALS

The first version is NOT intended to become:

* A project-management system.
* An internal HR system.
* A financial management system.
* A CRM.
* A social network.
* A public discussion forum.
* A generic environmental marketplace.

Future functionality may be added without restructuring the core architecture.

---

# 4. USERS

## 4.1 Public Visitor

Can:

* Browse public pages.
* Read experiences.
* Browse knowledge.
* View people.
* Explore contribution areas.
* Read organizational information.
* Submit contact/collaboration inquiries.
* Switch language between ID and EN.
* Download published resources.

No authentication is required.

---

## 4.2 AUTHOR

Can:

* Log in to CMS.
* Create content.
* Edit own content.
* Save drafts.
* Submit content for review.

Cannot:

* Manage users.
* Change system settings.
* Manage permissions.
* Publish content unless explicitly authorized.

---

## 4.3 EDITOR

Can:

* Create content.
* Edit content.
* Review content.
* Publish content.
* Archive content.
* Manage Knowledge.
* Manage Experiences.
* Manage People content where permitted.
* Manage media.

Cannot:

* Manage system configuration unless explicitly granted.

---

## 4.4 ADMIN

Can:

* Manage content.
* Manage media.
* Manage messages.
* Manage People.
* Manage Experiences.
* Manage Knowledge.
* Manage Contribution Areas.
* Manage Partners.
* Manage navigation.

---

## 4.5 SUPER ADMIN

Full access:

* Users
* Roles
* Permissions
* Content
* Media
* Settings
* Navigation
* Messages
* Audit logs
* System configuration

---

# 5. INFORMATION ARCHITECTURE

## Public

```text
/
├── /about
├── /what-we-do
├── /experiences
│   └── /experiences/[slug]
├── /knowledge
│   ├── /knowledge/[slug]
│   └── /knowledge/category/[slug]
├── /people
│   └── /people/[slug]
├── /collaboration
└── /contact
```

## Admin

```text
/admin
├── /dashboard
├── /pages
├── /contribution-areas
├── /experiences
├── /people
├── /knowledge
├── /categories
├── /tags
├── /partners
├── /media
├── /messages
├── /navigation
├── /users
├── /settings
└── /audit-logs
```

---

# 6. PUBLIC WEBSITE

## 6.1 Homepage

The homepage must immediately communicate:

> Connecting Knowledge, Nature, & Communities.

Required sections:

1. Hero
2. Introduction
3. Three core pillars
4. Why ANTRABUMI
5. How ANTRABUMI works
6. Contribution Areas
7. Selected Experiences
8. Collective Expertise / People
9. Collaboration CTA
10. Footer

The homepage should remain spacious and editorial.

Do not overcrowd the page.

---

# 7. HERO

## Required

* Primary headline
* Supporting introduction
* Primary CTA
* Secondary navigation/action where appropriate
* Strong visual composition

Primary positioning:

**Connecting Knowledge, Nature, & Communities.**

CTA:

**Hubungi Kami**

The hero must feel:

* Confident
* Editorial
* Natural
* Grounded
* Spacious

Avoid:

* Generic corporate hero layouts
* Excessive animations
* Artificial environmental imagery
* Excessive gradients

---

# 8. CORE PILLARS

The three core pillars are:

## Knowledge

Represents research, assessment, learning, local knowledge, and knowledge development.

## Nature

Represents conservation, climate, sustainability, and environmental context.

## Communities

Represents people, participation, local context, collaboration, and community development.

The terms must remain consistent.

---

# 9. ABOUT

The About page must communicate:

* Why ANTRABUMI exists
* Who ANTRABUMI is
* Organizational approach
* Journey
* Framework
* GEDSI

The content must remain faithful to the official organization profile.

---

# 10. WHY ANTRABUMI

The website should communicate the central idea:

> Change becomes meaningful when knowledge, nature, and communities are connected.

The section should explain the relationship between:

* Knowledge and action
* Field experience and learning
* Solutions and people who live with them

Avoid exaggerated organizational claims.

---

# 11. JOURNEY

The journey begins in 2021.

The website may present:

```text
2021
Awal Perjalanan

2022
Membentuk Identitas

2023
Belajar dari Lapangan

2024
Memperkuat Pendekatan

2025
Memperluas Kolaborasi

2026
A New Chapter
```

Only source-supported historical information may be presented.

If detailed descriptions are unavailable, the CMS must allow them to remain empty.

---

# 12. OUR FRAMEWORK

The official framework:

```text
01 — LISTEN
02 — CONNECT
03 — CO-CREATE
04 — ACT
05 — LEARN
```

Core principle:

> Every collaboration begins with understanding context, not offering solutions.

The interface may use interactive presentation, but must preserve the meaning of the framework.

---

# 13. GEDSI

GEDSI means:

**Gender Equality, Disability and Social Inclusion.**

GEDSI must be represented as part of ANTRABUMI's working approach.

It relates to:

* Understanding context
* Involving communities
* Designing solutions
* Diverse perspectives
* Experience
* Access
* Needs
* Decision-making

It must not be presented merely as a decorative keyword.

---

# 14. WHAT WE DO

The system must support six contribution areas.

## 14.1 Conservation, Climate & Sustainability

## 14.2 Program & Strategy

## 14.3 Partnership & Collaboration

## 14.4 Media, Storytelling & Campaign

## 14.5 Community Development

## 14.6 Research, Assessment & Knowledge

Each contribution area supports:

```text
Title
Slug
Description
Image
Related Experiences
Related Knowledge
Display Order
Published Status
```

---

# 15. EXPERIENCES

Experiences represent ANTRABUMI's organizational work and projects.

Source-supported examples include:

1. Indonesia Digital Ecosystem Assessment — IDEA
2. Perencanaan Pengelolaan Ekowisata Desa
3. Assessment Training for Community Development
4. Assessment Pengembangan Batik Ekologis
5. Prototyping Pengelolaan Sampah Pasar Tradisional

The CMS must not fabricate missing information.

---

# 16. EXPERIENCE DETAIL

Each Experience may contain:

```text
Title
Slug
Year
Category
Client / Partner
Location
Description
Methodology
Statistics
Impact / Results
Gallery
Related Expertise
Related Knowledge
Publication
Status
Language
SEO Metadata
```

Fields that do not have source-supported information must remain empty.

---

# 17. EXPERIENCE LIST

The public Experience page must support:

* Grid/list view
* Category filtering
* Year filtering where applicable
* Search
* Pagination/load more
* Featured experiences

Only published experiences are visible.

---

# 18. PEOPLE

The People section represents the people behind ANTRABUMI.

Known source-supported people:

* Sendi Kenia Savitri, M.Si.
* Ade Afrilian Saputra, M.M.Sus.
* Anna Agustina, Ph.D.
* Yando Zakaria
* Sekar Mira C. Herandarudewi, M.Si.
* Arya Kusumo Harwinanto, S.I.Kom.
* Shaniya Utamidita, M.S.
* Suluh Gembyeng Ciptadi, M.Si.

Each profile supports:

```text
Name
Photo
Title / Degree
Role
Biography
Expertise
Display Order
Published Status
```

Do not invent:

* Credentials
* Positions
* Social profiles
* Contact information
* Awards
* Experience
* Statistics

---

# 19. COLLECTIVE EXPERTISE

The website must support presentation of collective expertise:

* Community Development
* GEDSI
* Research & Assessment
* Communication
* Conservation
* Policy
* Climate & Sustainability
* Partnership

The presentation should communicate multiple perspectives working together.

---

# 20. KNOWLEDGE HUB

Knowledge is a first-class content area.

Supported content types:

* Research
* Assessment
* Report
* Publication
* Article
* Story
* Insight

Each Knowledge item supports:

```text
Title
Slug
Excerpt
Content
Cover Image
Category
Author
Publication Date
Tags
Downloadable File
SEO Metadata
Language
Status
```

---

# 21. KNOWLEDGE STATUS

Supported states:

```text
DRAFT
REVIEW
PUBLISHED
ARCHIVED
```

Only:

```text
PUBLISHED
```

content is visible publicly.

---

# 22. KNOWLEDGE DETAIL

Public detail page should include:

* Title
* Category
* Publication date
* Author
* Cover
* Content
* Tags
* Download action where available
* Related knowledge
* Related experiences
* SEO metadata

---

# 23. SEARCH

The website should provide content discovery.

Search should cover, where applicable:

* Experiences
* Knowledge
* People
* Contribution Areas

Search should support:

* Keyword search
* Relevant filtering
* Empty results state
* Clear reset action

Search must never expose unpublished content.

---

# 24. COLLABORATION

The Collaboration page should explain that ANTRABUMI works across sectors.

Relevant audiences:

* Communities
* Government
* Academics
* Civil society
* Private sector
* Development partners

The page should contain a clear collaboration CTA.

Do not claim existing partnerships unless supported by source material.

---

# 25. CONTACT

The website must provide a contact mechanism.

Source-supported contact information:

```text
Phone:
+62-823-3038-7505

Email:
hello@antrabumi.org

Website:
www.antrabumi.org

Instagram:
@antrabumi_org

LinkedIn:
Antrabumi

Address:
TRIGHA Creative Hub,
Sudirman St, 08,
Belitung
```

The contact form must create a CMS-managed Contact Message.

---

# 26. CONTACT FORM

Minimum fields:

```text
Name
Email
Organization
Subject
Message
```

Optional:

```text
Phone
Area of Interest
```

Validation:

* Name required
* Valid email required
* Subject required
* Message required

On successful submission:

1. Store message in database.
2. Show success state.
3. Prevent accidental duplicate submission.
4. Do not expose database details.

---

# 27. ADMIN CMS

The CMS must be accessible through:

```text
/admin
```

Protected by authentication.

CMS navigation:

```text
Dashboard
Pages
Contribution Areas
Experiences
People
Knowledge
Categories
Tags
Partners
Media
Messages
Navigation
Users
Settings
Audit Logs
```

Visible navigation must depend on user permissions.

---

# 28. DASHBOARD

Dashboard should provide an operational overview.

Potential metrics:

```text
Published Experiences
Published Knowledge
People
Draft Content
Review Queue
Unread Messages
Media Count
```

Metrics must be calculated from actual database records.

Do not use fabricated numbers.

---

# 29. CMS CONTENT EDITOR

Content forms must provide:

* Create
* Edit
* Save draft
* Submit for review
* Publish
* Unpublish
* Archive
* Delete where authorized

Forms must have:

* Validation
* Loading state
* Error state
* Success feedback
* Unsaved-change protection where appropriate

---

# 30. PUBLISHING WORKFLOW

Default workflow:

```text
DRAFT
   ↓
REVIEW
   ↓
PUBLISHED
   ↓
ARCHIVED
```

Rules:

* Authors can create drafts.
* Authorized reviewers can review.
* Only authorized roles can publish.
* Archived content is not publicly visible.
* Draft content must never be exposed publicly.

---

# 31. MEDIA LIBRARY

The CMS must provide a centralized Media Library.

Each asset supports:

```text
File
Filename
MIME Type
File Size
Dimensions
Alt Text
Caption
Attribution
Usage
Created At
Uploaded By
```

Supported primary use cases:

* Cover image
* Gallery
* Profile image
* Content image
* Social sharing image
* Brand asset

---

# 32. MEDIA SECURITY

Uploads must be validated server-side.

Validate:

* File type
* MIME type
* File size
* Filename
* Image dimensions where applicable

Do not trust client-side validation alone.

Storage must be abstracted so development storage can later be replaced by production storage.

---

# 33. PAGES CMS

Static organizational pages should be manageable from CMS where appropriate.

Page fields:

```text
Title
Slug
Language
Content
Hero
SEO Title
SEO Description
OG Image
Status
Published At
Updated At
```

Core pages:

* About
* What We Do
* Collaboration
* Contact

---

# 34. NAVIGATION CMS

Authorized administrators may manage navigation.

Navigation item:

```text
Label
URL
Language
Order
Visibility
Parent
Open Behavior
```

The system must prevent invalid navigation configurations.

Primary public navigation:

```text
Tentang
Inisiatif
Pengetahuan
Kolaborasi
```

Primary CTA:

```text
Hubungi Kami
```

---

# 35. PARTNERS

The CMS may support partner records.

Partner data should include only source-supported information.

Potential fields:

```text
Name
Logo
Description
Website
Category
Display Order
Published
```

Do not create unsupported partner relationships.

---

# 36. CATEGORIES

Categories should be reusable across content types where appropriate.

Category:

```text
Name
Slug
Description
Content Type
Language
Display Order
Status
```

---

# 37. TAGS

Tags support Knowledge and potentially Experiences.

Tag:

```text
Name
Slug
```

Tags must be normalized to avoid duplicates.

---

# 38. USERS

User fields:

```text
Name
Email
Password Hash / Auth Provider
Role
Status
Created At
Updated At
Last Login
```

Passwords must never be stored in plaintext.

---

# 39. ROLES

Minimum roles:

```text
SUPER_ADMIN
ADMIN
EDITOR
AUTHOR
```

Authorization must be enforced server-side.

Hiding a UI button is not sufficient authorization.

---

# 40. AUDIT LOG

The system should record important administrative operations.

Examples:

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

Audit records should include:

```text
User
Action
Entity
Entity ID
Timestamp
Relevant Metadata
```

Audit logs are accessible to authorized administrators.

---

# 41. INTERNATIONALIZATION

The public website supports:

```text
ID — Indonesian
EN — English
```

Content must support independent translations.

Do not automatically treat machine-translated text as an approved official translation.

Recommended model:

```text
Content
 ├── Indonesian version
 └── English version
```

Language switching should preserve the equivalent page/content where available.

If a translation does not exist, the system should use a defined fallback behavior rather than silently presenting incorrect content.

---

# 42. DESIGN REQUIREMENTS

The design must follow ANTRABUMI Brand Guidelines.

Brand character:

* Inclusive
* Visionary yet Grounded
* Organic & Fluid
* Natural
* Authentic
* Approachable

Primary visual direction:

* Black
* White
* Official supporting colors
* Organic gradients where appropriate
* Real photography
* Natural lighting
* Editorial composition
* Organic visual elements

---

# 43. TYPOGRAPHY

Primary:

```text
Heading: Sohne
Body: Montserrat
```

If Sohne is unavailable, create a font abstraction so it can be replaced later.

Do not redesign the typography hierarchy merely because the exact font is unavailable.

---

# 44. VISUAL CONTENT

Preferred:

* Real field photography
* Genuine human interaction
* Natural lighting
* Environmental context
* Community interaction
* Organic textures
* Editorial composition

Avoid:

* Generic corporate stock photography
* Artificial environmental imagery
* Excessive green
* Visual greenwashing
* Hyper-filtered photography

---

# 45. ANIMATION

Use subtle motion.

Preferred:

* Fade
* Reveal
* Slide
* Image parallax
* Smooth transitions
* Hover interactions

Animations must support storytelling.

Respect:

```text
prefers-reduced-motion
```

Do not animate every component.

---

# 46. RESPONSIVE DESIGN

Support:

* Mobile
* Tablet
* Laptop
* Desktop
* Large desktop

Mobile must be treated as a first-class layout.

Required:

* Mobile navigation
* Responsive typography
* Responsive spacing
* Responsive images
* Touch-friendly controls
* Accessible forms

---

# 47. ACCESSIBILITY

Target WCAG-conscious implementation.

Required:

* Semantic HTML
* Proper heading hierarchy
* Keyboard navigation
* Visible focus states
* Accessible buttons
* Accessible forms
* Alt text
* Sufficient contrast
* Reduced motion support
* Meaningful link labels

---

# 48. SEO

Every public page should support:

```text
SEO Title
Meta Description
Canonical URL
Open Graph Title
Open Graph Description
Open Graph Image
```

The system must generate:

```text
sitemap.xml
robots.txt
```

Use semantic URLs.

Example:

```text
/about
/experiences/indonesia-digital-ecosystem-assessment
/knowledge/example-slug
/people/person-slug
```

---

# 49. PERFORMANCE

The application should prioritize:

* Server rendering where appropriate
* Optimized images
* Lazy loading
* Responsive image sizes
* Minimal client-side JavaScript
* Code splitting
* Efficient database queries
* Caching where appropriate

Do not make every component a Client Component.

---

# 50. SECURITY

The application must:

* Protect admin routes.
* Authenticate protected operations.
* Authorize every protected operation.
* Validate server-side.
* Sanitize rich content appropriately.
* Protect authentication secrets.
* Protect database credentials.
* Validate file uploads.
* Prevent unauthorized content access.
* Prevent draft content from leaking publicly.

Secrets must use environment variables.

Never commit secrets to Git.

---

# 51. API / BACKEND

Backend functionality should use the appropriate Next.js mechanism:

* Server Actions where suitable.
* Route Handlers/API where suitable.
* Server-side database access.

Public and admin operations must remain clearly separated.

API responses should have consistent error handling.

---

# 52. DATABASE REQUIREMENTS

The database must support at minimum:

```text
User
Role
Permission
Page
ContributionArea
Experience
ExperienceMetric
Person
Expertise
Knowledge
Category
Tag
Media
Partner
ContactMessage
SiteSetting
NavigationItem
AuditLog
```

Use Prisma ORM.

Database changes must use Prisma migrations.

---

# 53. CONTENT MODEL PRINCIPLE

The public website must be database-driven.

Avoid:

```text
React component
      ↓
hard-coded organizational content
```

Prefer:

```text
MySQL
   ↓
Prisma
   ↓
Server-side data layer
   ↓
Public website
```

The CMS must update the content displayed by the public website.

---

# 54. EMPTY STATES

Every dynamic CMS-driven page needs an appropriate empty state.

Examples:

```text
No experiences available.
No knowledge content available.
No search results found.
No messages available.
No media available.
```

Do not use fake placeholder records in production.

---

# 55. ERROR STATES

Public pages:

* Must not expose stack traces.
* Must show friendly error states.

Admin:

* Must provide actionable error messages.
* Validation errors should identify the relevant field.
* Failed operations must not silently appear successful.

---

# 56. LOADING STATES

Dynamic interfaces should provide appropriate loading states.

Use:

* Skeletons
* Spinners where appropriate
* Disabled submit buttons
* Progress feedback for uploads

Avoid unnecessary loading animations.

---

# 57. DELETE BEHAVIOR

Destructive actions require confirmation.

Where appropriate, prefer soft-delete/archive over permanent deletion.

Permanent deletion must be restricted to authorized roles.

Deleting media that is still referenced should either:

1. Prevent deletion, or
2. Clearly identify affected references and require confirmation.

---

# 58. DRAFT PREVIEW

Authorized CMS users should be able to preview unpublished content before publishing.

Preview must:

* Require authorization.
* Never make draft content publicly discoverable.
* Avoid indexing.
* Preserve the intended public layout.

---

# 59. CONTACT MESSAGE MANAGEMENT

Admin users should be able to:

* View messages.
* Search messages.
* Filter by status.
* Mark as read.
* Mark as processed.
* Archive messages.

Message statuses may include:

```text
NEW
READ
IN_PROGRESS
RESOLVED
ARCHIVED
```

---

# 60. CMS SEARCH & FILTERING

Admin lists should support:

* Search
* Filtering
* Sorting
* Pagination
* Status filtering
* Date filtering where appropriate

This applies especially to:

* Experienc
