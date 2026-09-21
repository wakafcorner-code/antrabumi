# ANTRABUMI — AI AGENT DEVELOPMENT INSTRUCTIONS

## 1. PROJECT IDENTITY

Project name: ANTRABUMI
Project type: Full-stack organizational profile website + CMS
Year: 2026

Primary positioning:

"Connecting Knowledge, Nature, & Communities."

ANTRABUMI is an independent organization working at the intersection of knowledge,
nature, and communities.

The website must communicate ANTRABUMI as an organization that connects:

- Research
- Field experience
- Local knowledge
- Communities
- Conservation
- Sustainability
- Communication
- Collaboration
- Program development
- Knowledge

The website is not a generic environmental company website.

The implementation MUST preserve the identity, language, positioning,
content structure, and visual direction defined in the official ANTRABUMI
Profile 2026 and Brand Guidelines 2026.


==================================================
2. SOURCE OF TRUTH
==================================================

The following documents are the primary source of truth:

1. ANTRABUMI Organization Profile 2026
2. ANTRABUMI Brand Guidelines 2026
3. Existing ANTRABUMI HTML reference

When implementing content or visual identity:

PRIORITY:

1. Official ANTRABUMI Profile
2. Official ANTRABUMI Brand Guidelines
3. Existing HTML reference
4. Developer implementation decisions
5. General best practices

Do NOT invent organizational facts.

Do NOT invent projects, partners, statistics, team members,
credentials, awards, clients, locations, or impact numbers.

If information is not available in the source documents,
create a CMS field or placeholder rather than inventing information.


==================================================
3. DEVELOPMENT PRINCIPLES
==================================================

Build the project as a production-ready full-stack application.

The application must have:

- Public website
- Admin dashboard
- Authentication
- CMS
- Database
- Media management
- Content publishing
- Contact/message management
- API/backend
- Role-based access control
- Responsive frontend
- Indonesian and English content support

The website must be maintainable and scalable.

Do not create unnecessary complexity.

Prefer clear architecture over clever architecture.


==================================================
4. RECOMMENDED TECHNOLOGY STACK
==================================================

Frontend:

- Next.js
- TypeScript
- React
- Tailwind CSS
- Framer Motion
- Lucide Icons

Backend:

- Next.js server-side functionality
- Server Actions where appropriate
- Route Handlers/API where appropriate

Database:

- MySQL
- Prisma ORM

Authentication:

- Auth.js / compatible secure authentication solution

Validation:

- Zod

Forms:

- React Hook Form where appropriate

Rich text:

- A secure CMS-compatible rich text editor

Media:

- Local storage during development
- Storage abstraction for production
- Images must support optimization

Deployment target:

- Linux VPS
- Nginx
- Node.js
- MySQL


==================================================
5. ARCHITECTURE
==================================================

Use a clean full-stack architecture.

Recommended structure:

app/
├── (public)/
│   ├── page.tsx
│   ├── about/
│   ├── initiatives/
│   ├── knowledge/
│   ├── people/
│   └── collaboration/
│
├── admin/
│   ├── page.tsx
│   ├── pages/
│   ├── initiatives/
│   ├── knowledge/
│   ├── people/
│   ├── services/
│   ├── partners/
│   ├── media/
│   ├── messages/
│   ├── users/
│   └── settings/
│
├── api/
│   └── ...
│
components/
├── ui/
├── layout/
├── navigation/
├── hero/
├── sections/
├── cards/
├── forms/
├── cms/
└── admin/

lib/
├── auth/
├── db/
├── api/
├── validation/
├── storage/
├── i18n/
└── utils/

prisma/
└── schema.prisma

public/
├── brand/
├── images/
├── icons/
└── fonts/


==================================================
6. PUBLIC WEBSITE
==================================================

The public website should contain at minimum:

1. Home
2. About
3. What We Do / Contributions
4. Experiences / Initiatives
5. Knowledge
6. People
7. Collaboration
8. Contact

Navigation should remain simple and editorial.

Primary navigation:

- Tentang
- Inisiatif
- Pengetahuan
- Kolaborasi

Language:

- ID
- EN

Primary CTA:

"Hubungi Kami"


==================================================
7. HOMEPAGE
==================================================

The homepage should communicate the organization immediately.

Hero message:

"Connecting Knowledge, Nature, & Communities."

The homepage should include:

- Hero
- Organizational introduction
- Three core pillars
- Why ANTRABUMI exists
- How ANTRABUMI works
- Contribution areas
- Selected experiences
- Collective expertise / people
- Collaboration CTA
- Contact/footer

Do not overcrowd the homepage.

The hero must feel editorial, confident, natural, and spacious.


==================================================
8. CORE PILLARS
==================================================

The three core pillars are:

KNOWLEDGE

NATURE

COMMUNITIES

These terms must remain consistent across the website.

Do not replace them with generic alternatives such as:

- Environment
- People
- Innovation

unless the content explicitly requires those terms.


==================================================
9. WHY ANTRABUMI EXISTS
==================================================

The website must communicate the central idea:

Change becomes meaningful when knowledge, nature,
and communities are connected.

ANTRABUMI exists to bridge the gap between:

- knowledge and action
- field experience and learning
- solutions and the people who will live with them

The tone must remain factual and grounded.

Avoid exaggerated claims.


==================================================
10. ABOUT ANTRABUMI
==================================================

Use the official organizational description as the basis.

ANTRABUMI works at the intersection of:

- knowledge
- nature
- communities

The organization brings together:

- field experience
- research
- local knowledge
- different perspectives

to understand issues more fully and develop contextual approaches.

ANTRABUMI works with:

- communities
- government
- academics
- civil society organizations
- private sector
- development partners


==================================================
11. JOURNEY
==================================================

The organizational journey begins in 2021.

The website may present the timeline:

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

The timeline content must follow the official organization profile.

Do not invent additional historical events.


==================================================
12. OUR FRAMEWORK
==================================================

The official working framework is:

01 — LISTEN
02 — CONNECT
03 — CO-CREATE
04 — ACT
05 — LEARN

Core principle:

"Every collaboration begins with understanding context,
not offering solutions."

The framework should be presented visually and interactively,
but the meaning must remain faithful to the source material.


==================================================
13. GEDSI
==================================================

GEDSI means:

Gender Equality, Disability and Social Inclusion.

GEDSI is part of ANTRABUMI's approach to:

- understanding context
- involving communities
- designing solutions
- considering diverse perspectives
- considering experience
- considering access
- considering needs
- supporting decision-making

Do not treat GEDSI as a decorative keyword.

It must be presented as part of the organization's working approach.


==================================================
14. CONTRIBUTION AREAS
==================================================

The six official contribution areas are:

01. Conservation, Climate & Sustainability

02. Program & Strategy

03. Partnership & Collaboration

04. Media, Storytelling & Campaign

05. Community Development

06. Research, Assessment & Knowledge

Each area should have:

- title
- description
- optional image
- optional related experiences
- optional related knowledge content

Descriptions must remain faithful to the organization profile.


==================================================
15. EXPERIENCES / INITIATIVES
==================================================

The CMS must support organizational experiences/projects.

Known source-supported experiences include:

1. Indonesia Digital Ecosystem Assessment — IDEA

2. Perencanaan Pengelolaan Ekowisata Desa

3. Assessment Training for Community Development

4. Assessment Pengembangan Batik Ekologis

5. Prototyping Pengelolaan Sampah Pasar Tradisional

Each project may contain:

- title
- slug
- year
- category
- client/partner
- location
- description
- methodology
- statistics
- impact/results
- gallery
- related expertise
- publication
- status

Do not fabricate missing fields.

If a project does not have a source-supported value,
leave the field empty.


==================================================
16. PEOPLE
==================================================

The CMS must support team/person profiles.

Known people from the source material include:

- Sendi Kenia Savitri, M.Si.
- Ade Afrilian Saputra, M.M.Sus.
- Anna Agustina, Ph.D.
- Yando Zakaria
- Sekar Mira C. Herandarudewi, M.Si.
- Arya Kusumo Harwinanto, S.I.Kom.
- Shaniya Utamidita, M.S.
- Suluh Gembyeng Ciptadi, M.Si.

Each profile should support:

- name
- photo
- title/degree
- role
- biography
- expertise
- display order
- published status

Do not change professional credentials.

Do not invent social profiles or contact information.


==================================================
17. COLLECTIVE EXPERTISE
==================================================

The collective expertise section includes:

- Community Development
- GEDSI
- Research & Assessment
- Communication
- Conservation
- Policy
- Climate & Sustainability
- Partnership

This section should visually communicate
that multiple perspectives are combined.


==================================================
18. KNOWLEDGE HUB
==================================================

The website must have a Knowledge section.

Recommended content types:

- Research
- Assessment
- Report
- Publication
- Article
- Story
- Insight

Each content item should support:

- title
- slug
- excerpt
- content
- cover image
- category
- author
- publication date
- tags
- downloadable file
- SEO metadata
- language
- status

Statuses:

- Draft
- Published
- Archived

Only Published content is visible publicly.


==================================================
19. COLLABORATION
==================================================

The collaboration page should communicate that ANTRABUMI
works across sectors.

Potential collaboration audiences based on the source:

- Communities
- Government
- Academics
- Civil society
- Private sector
- Development partners

The page should include a clear CTA.

Do not make unsupported claims about existing partnerships.


==================================================
20. CONTACT
==================================================

Source-supported contact information:

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

Use the contact information from the organization profile
as the primary source.

If a discrepancy exists in another document,
do not silently choose one. Flag it for review.


==================================================
21. CMS
==================================================

Admin CMS must support:

Dashboard
Pages
Experiences
People
Knowledge
Contribution Areas
Partners
Media Library
Contact Messages
Users
Settings

The CMS should make it possible to update content
without editing source code.


==================================================
22. USER ROLES
==================================================

Minimum roles:

SUPER_ADMIN
ADMIN
EDITOR
AUTHOR

SUPER_ADMIN:

- full access
- manage users
- manage settings
- manage all content

ADMIN:

- manage content
- manage media
- manage messages

EDITOR:

- create/edit/publish content
- manage knowledge
- manage experiences

AUTHOR:

- create and edit own content
- cannot manage users/settings
- cannot change system configuration


==================================================
23. CONTENT STATUS
==================================================

Content lifecycle:

DRAFT
    ↓
REVIEW
    ↓
PUBLISHED
    ↓
ARCHIVED

Only authorized roles may publish content.

Never expose draft content on the public website.


==================================================
24. MEDIA LIBRARY
==================================================

Media management must support:

- upload
- image preview
- alt text
- filename
- MIME type
- size
- dimensions
- caption
- attribution
- usage
- deletion

Images must be optimized.

Every public image should have meaningful alt text.

Do not use artificial stock imagery when the source
requires authentic real-world visuals.


==================================================
25. DESIGN SYSTEM
==================================================

The website must follow ANTRABUMI Brand Guidelines.

Brand character:

- Inclusive
- Visionary yet Grounded
- Organic & Fluid
- Natural
- Authentic
- Approachable

Avoid:

- generic corporate green
- excessive glassmorphism
- excessive neon
- excessive gradients
- artificial environmental imagery
- overly technical visual language
- exaggerated sustainability visuals


==================================================
26. COLOR
==================================================

Primary visual direction:

- Black
- White

Supporting colors must follow the official
ANTRABUMI Brand Guidelines.

Use official brand HEX values where available.

Do not invent replacement brand colors.

Supporting gradients may be used when they remain
consistent with the official guidelines.

Do not introduce random colors.


==================================================
27. TYPOGRAPHY
==================================================

Official typography:

Heading:
Sohne

Body:
Montserrat

If Sohne is not legally/technically available in the
development environment, create a typography abstraction
so the font can be replaced without changing components.

Do not silently replace the visual hierarchy.


==================================================
28. VISUAL DIRECTION
==================================================

Use:

- natural lighting
- genuine human interaction
- organic textures
- real field photography
- environmental context
- community interaction
- editorial composition

Focus on real-world impact.

Avoid:

- hyper-filtered photography
- artificial stock-photo appearance
- generic corporate imagery
- visual greenwashing


==================================================
29. LOGO RULES
==================================================

Never:

- stretch the logo
- skew the logo
- distort proportions
- add unapproved shadows
- add glow
- add heavy outlines
- modify the logo shape
- introduce unapproved colors

Maintain proper clear space.

Use official logo assets supplied by the project.


==================================================
30. ANIMATION
==================================================

Animations should be subtle.

Preferred:

- fade
- slide
- reveal
- image parallax
- smooth section transitions
- hover interactions

Avoid:

- excessive bouncing
- flashy transitions
- distracting animations
- animation on every element

Animation must support storytelling,
not become the main visual feature.


==================================================
31. RESPONSIVE DESIGN
==================================================

Must support:

- mobile
- tablet
- laptop
- desktop
- large desktop

Mobile is not an afterthought.

Navigation must become a usable mobile menu.

Typography and spacing must scale responsively.


==================================================
32. INTERNATIONALIZATION
==================================================

Support:

ID — Indonesian
EN — English

The architecture must allow content to exist
in both languages.

Do not automatically machine-translate official
organizational statements and present them as approved
official translations.

Store translations independently where appropriate.


==================================================
33. SEO
==================================================

Every public page must support:

- title
- meta description
- canonical URL
- Open Graph title
- Open Graph description
- Open Graph image
- structured metadata where appropriate

Use semantic HTML.

Generate sitemap.

Generate robots.txt.

Use clean URLs.


==================================================
34. ACCESSIBILITY
==================================================

Target WCAG-conscious implementation.

Must include:

- semantic HTML
- keyboard navigation
- visible focus states
- sufficient contrast
- alt text
- accessible forms
- accessible buttons
- proper heading hierarchy
- reduced motion support


==================================================
35. SECURITY
==================================================

Never:

- expose database credentials
- expose authentication secrets
- trust client-side authorization
- store passwords in plaintext
- accept unsanitized HTML blindly
- expose private CMS APIs publicly

Validate server-side.

Use authorization on every protected backend operation.

Protect admin routes.

Validate uploaded files.


==================================================
36. DATABASE
==================================================

Database entities should be designed around:

- User
- Role
- Permission
- Page
- ContributionArea
- Experience
- ExperienceMetric
- Person
- Expertise
- Knowledge
- Category
- Tag
- Media
- Partner
- ContactMessage
- SiteSetting
- NavigationItem
- AuditLog

Use Prisma migrations.

Do not modify production database manually
when a schema migration is appropriate.


==================================================
37. API
==================================================

Backend APIs must:

- validate input
- authenticate protected requests
- authorize actions
- return consistent responses
- handle errors
- avoid exposing sensitive database data

Do not create an API endpoint when a Server Action
is more appropriate.

Keep public and admin operations clearly separated.


==================================================
38. ADMIN DASHBOARD UX
==================================================

Admin UI should be simple and functional.

Prioritize:

- clear navigation
- searchable content
- filters
- pagination
- status badges
- create/edit forms
- media preview
- confirmation dialogs
- error messages
- success feedback

Do not make the CMS visually identical to the public website.


==================================================
39. CONTENT RULE
==================================================

IMPORTANT:

Never invent ANTRABUMI facts.

If the agent needs information that is unavailable:

1. create an appropriate empty CMS field,
2. add TODO/source-needed metadata if appropriate,
3. continue implementation,
4. do not fabricate the information.


==================================================
40. SOURCE CONTENT VS UI COPY
==================================================

Source-supported organizational copy may be reused
where appropriate.

UI labels may be adapted for usability.

However, core statements, organizational descriptions,
project statistics, credentials, names, dates,
and official claims must remain faithful to the source.


==================================================
41. EXISTING HTML
==================================================

The provided HTML is a reference implementation.

Use it to understand:

- navigation
- page structure
- content hierarchy
- footer
- existing wording
- section relationships

Do not blindly copy its implementation.

Rebuild it using the selected modern architecture.


==================================================
42. PERFORMANCE
==================================================

Prioritize:

- optimized images
- lazy loading
- server rendering where appropriate
- minimal client JavaScript
- code splitting
- caching
- responsive image sizes
- efficient database queries

Do not turn every component into a client component.


==================================================
43. ERROR HANDLING
==================================================

Every major operation must have:

- loading state
- success state
- validation state
- error state
- empty state

Public pages must not expose technical errors.

Admin users should receive useful error messages.


==================================================
44. DEVELOPMENT WORKFLOW
==================================================

Development order:

PHASE 1
Project setup

PHASE 2
Database + Prisma

PHASE 3
Authentication + RBAC

PHASE 4
CMS foundation

PHASE 5
Media management

PHASE 6
Public layout + design system

PHASE 7
Homepage

PHASE 8
About + Journey + Framework

PHASE 9
Contribution Areas

PHASE 10
Experiences

PHASE 11
People

PHASE 12
Knowledge

PHASE 13
Collaboration + Contact

PHASE 14
SEO + Accessibility

PHASE 15
Testing

PHASE 16
Production deployment


==================================================
45. TESTING
==================================================

Before considering the project complete:

- run TypeScript checks
- run lint
- run tests
- test authentication
- test authorization
- test CMS CRUD
- test image upload
- test publishing workflow
- test public pages
- test mobile layout
- test forms
- test language switching
- test SEO metadata
- test production build


==================================================
46. DO NOT DO
==================================================

Do NOT:

- invent content
- invent statistics
- invent partners
- invent projects
- invent team members
- change official terminology unnecessarily
- replace brand colors randomly
- redesign the logo
- use excessive green
- use fake sustainability claims
- create unnecessary backend complexity
- hard-code CMS content unnecessarily
- expose admin functionality publicly
- store secrets in Git
- modify database without migrations


==================================================
47. DEFINITION OF DONE
==================================================

The project is considered complete when:

1. Public website works.
2. Admin CMS works.
3. Authentication works.
4. Role-based authorization works.
5. MySQL database works.
6. Prisma migrations work.
7. Content can be created from CMS.
8. Content can be edited from CMS.
9. Content can be published/unpublished.
10. Experiences can be managed.
11. People can be managed.
12. Knowledge can be managed.
13. Media can be managed.
14. Contact messages can be managed.
15. ID/EN architecture works.
16. Website is responsive.
17. SEO fundamentals are implemented.
18. Accessibility fundamentals are implemented.
19. Brand Guidelines are respected.
20. Official source content is not fabricated.
21. Production build succeeds.
22. Deployment documentation exists.


==================================================
48. AI AGENT BEHAVIOR
==================================================

When working on this project, the AI Agent must:

- inspect existing files before modifying them
- preserve working functionality
- make small, verifiable changes
- explain significant architectural decisions
- avoid unnecessary dependencies
- avoid unnecessary refactoring
- reuse existing components where appropriate
- keep database migrations explicit
- never fabricate source content
- flag source conflicts instead of silently resolving them
- run validation after significant changes


==================================================
49. FINAL PRINCIPLE
==================================================

ANTRABUMI is not merely an environmental website.

The website must communicate the connection between:

KNOWLEDGE
        +
NATURE
        +
COMMUNITIES

and demonstrate how research, experience, local knowledge,
collaboration, and action can contribute to meaningful change.

Every design and technical decision should reinforce that idea.

END OF AGENTS.md