# CONTENT_STRUCTURE.md — ANTRABUMI

**Project:** ANTRABUMI
**Document:** Content Structure
**Version:** 1.0
**Status:** Production Architecture

---

# 1. PURPOSE

Dokumen ini mendefinisikan struktur konten ANTRABUMI untuk:

* Public website
* CMS
* Database
* API
* SEO
* Multilingual content
* Search
* Media
* Related content

Dokumen ini menjawab:

> "Konten apa yang ada, disimpan di mana, bagaimana relasinya, dan bagian mana yang dapat diedit melalui CMS?"

---

# 2. CONTENT ARCHITECTURE

Struktur konten ANTRABUMI dibagi menjadi:

```text
SITE
├── Global Content
├── Pages
├── Contribution Areas
├── Experiences
├── People
├── Knowledge
├── Partners
├── Navigation
├── Media
├── Contact Messages
└── System Settings
```

---

# 3. CONTENT PRINCIPLE

CMS harus memisahkan:

```text
STRUCTURAL CONTENT
```

dari:

```text
EDITORIAL CONTENT
```

Contoh:

### Structural

```text
Experience has:
- title
- year
- location
- methodology
- impact
```

### Editorial

```text
Homepage hero copy
About description
Featured experiences
```

Struktur database tidak boleh berubah hanya karena copy berubah.

---

# 4. LANGUAGE MODEL

Supported languages:

```text
ID
EN
```

Konten multilingual disimpan secara terpisah.

Contoh:

```text
Experience
├── ExperienceTranslation(ID)
└── ExperienceTranslation(EN)
```

---

# 5. LANGUAGE RULE

Setiap translation memiliki:

```text
language
title
content
metadata
```

Content ID dan EN tidak boleh saling overwrite.

---

# 6. GLOBAL SITE CONTENT

Global content mencakup:

* Site name
* Tagline
* Primary navigation
* Footer
* Contact information
* Social links
* Default SEO
* Global CTA
* Copyright
* Optional legal links

Sebagian besar dapat dikelola melalui:

```text
SiteSetting
NavigationItem
```

---

# 7. HOMEPAGE

Route:

```text
/
```

Homepage terdiri dari:

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

---

# 8. HOMEPAGE HERO

Hero harus memiliki:

```text
Eyebrow / Label
Title
Description
Primary CTA
Secondary CTA
Background / Cover Media
```

Contoh struktur:

```text
Hero
├── eyebrow
├── title
├── description
├── primaryCTA
├── secondaryCTA
└── media
```

Copy final harus berasal dari source material.

---

# 9. HOMEPAGE PILLARS

Tiga pillar utama:

```text
Knowledge
Nature
Communities
```

Setiap pillar dapat memiliki:

```text
title
description
icon / visual
link
order
```

Jika pillar menggunakan konten editorial, konten tersebut harus editable tanpa mengubah application code.

---

# 10. ABOUT SECTION

Homepage About section:

```text
label
title
description
image
CTA
```

CTA dapat menuju:

```text
/about
```

---

# 11. WHY ANTRABUMI

Struktur:

```text
title
description
points
visual
```

Possible point structure:

```text
title
description
icon
order
```

Konten ini bersifat editorial.

---

# 12. JOURNEY

Journey merupakan timeline/sequence perkembangan organisasi.

Struktur:

```text
year
title
description
order
```

Contoh:

```text
Journey Item
├── year
├── title
├── description
└── order
```

Tanggal atau tahun harus berasal dari source material.

---

# 13. FRAMEWORK

Framework ANTRABUMI:

```text
LISTEN
CONNECT
CO-CREATE
ACT
LEARN
```

Setiap tahap dapat memiliki:

```text
code
title
description
icon
order
```

Urutan default:

```text
1 LISTEN
2 CONNECT
3 CO-CREATE
4 ACT
5 LEARN
```

---

# 14. GEDSI

GEDSI section dapat memiliki:

```text
title
description
image
supportingPoints
CTA
```

Terminologi final harus mengikuti source content organisasi.

Jangan memperluas klaim GEDSI tanpa sumber.

---

# 15. CONTRIBUTION AREAS

Contribution Areas adalah content type utama.

Core areas:

```text
Conservation, Climate & Sustainability
Program & Strategy
Partnership & Collaboration
Media, Storytelling & Campaign
Community Development
Research, Assessment & Knowledge
```

---

# 16. CONTRIBUTION AREA STRUCTURE

```text
ContributionArea
├── id
├── slug
├── status
├── order
└── translations
    ├── ID
    └── EN
```

Translation:

```text
title
description
image
```

---

# 17. CONTRIBUTION AREA RELATIONSHIPS

Contribution Area dapat berhubungan dengan:

```text
Experiences
Knowledge
```

Relationship digunakan untuk:

* Related work
* Filtering
* Search
* Landing pages

---

# 18. EXPERIENCE

Experience adalah salah satu content type utama ANTRABUMI.

Public route:

```text
/experiences
/experiences/[slug]
```

---

# 19. EXPERIENCE STRUCTURE

Core:

```text
Experience
├── slug
├── year
├── location
├── clientName
├── status
├── featured
├── coverMedia
├── translations
├── contributionAreas
├── metrics
├── gallery
└── relatedKnowledge
```

---

# 20. EXPERIENCE TRANSLATION

Setiap translation:

```text
language
title
excerpt
description
methodology
impact
seoTitle
seoDescription
```

---

# 21. EXPERIENCE CONTENT SECTIONS

Detail Experience dapat dirender sebagai:

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

Tidak semua project harus memiliki seluruh section.

Jika data tidak tersedia, section disembunyikan.

---

# 22. EXPERIENCE HERO

Experience hero:

```text
title
excerpt
coverMedia
year
location
```

Optional:

```text
clientName
```

Client name hanya ditampilkan jika data tersedia dan boleh dipublikasikan.

---

# 23. EXPERIENCE OVERVIEW

Overview berasal dari:

```text
description
```

Rich text diperbolehkan.

---

# 24. EXPERIENCE METHODOLOGY

Methodology menjelaskan pendekatan yang digunakan.

Field:

```text
methodology
```

Tidak boleh menghasilkan klaim metodologis yang tidak berasal dari source.

---

# 25. EXPERIENCE IMPACT

Impact:

```text
impact
```

Impact dapat berupa:

* Narrative
* Outcome
* Result
* Learning

Jangan membuat angka impact jika tidak tersedia.

---

# 26. EXPERIENCE METRICS

Metrics:

```text
label
value
unit
order
```

Contoh struktur:

```text
Metric
├── label
├── value
├── unit
└── order
```

Angka harus berasal dari source.

---

# 27. EXPERIENCE GALLERY

Gallery:

```text
media
order
```

Setiap image sebaiknya memiliki:

```text
altText
caption
attribution
```

---

# 28. EXPERIENCE RELATED KNOWLEDGE

Experience dapat berhubungan dengan:

```text
Knowledge
```

Relationship:

```text
Experience
    ↕
ExperienceKnowledge
    ↕
Knowledge
```

Public hanya menampilkan Knowledge yang published.

---

# 29. EXPERIENCE EXAMPLES

Source-supported Experience examples include:

```text
Indonesia Digital Ecosystem Assessment — IDEA
Perencanaan Pengelolaan Ekowisata Desa
Assessment Training for Community Development
Assessment Pengembangan Batik Ekologis
Prototyping Pengelolaan Sampah Pasar Tradisional
```

Daftar ini adalah initial content reference, bukan daftar final yang tidak dapat berkembang.

---

# 30. PEOPLE

Route:

```text
/people
/people/[slug]
```

People content mewakili anggota/team/person profile yang memang disediakan oleh source material.

---

# 31. PERSON STRUCTURE

```text
Person
├── slug
├── image
├── status
├── order
├── translations
└── expertise
```

---

# 32. PERSON TRANSLATION

```text
language
name
degree
role
biography
```

Degree optional.

Role optional tetapi dianjurkan untuk published profile jika tersedia.

---

# 33. PERSON EXPERTISE

Satu person dapat memiliki beberapa expertise.

```text
Person
├── Expertise A
├── Expertise B
└── Expertise C
```

Order dapat dikontrol.

---

# 34. PEOPLE INITIAL CONTENT

Source-supported people include:

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

Data biography, role, expertise, dan informasi lainnya harus tetap diambil dari source material.

Jangan mengisi profile kosong dengan fakta yang dibuat-buat.

---

# 35. COLLECTIVE EXPERTISE

Homepage dapat menampilkan:

```text
Collective Expertise
```

Data dapat diturunkan dari:

```text
Person
+
Expertise
```

Tidak perlu membuat duplicate content jika data dapat dihitung dari relationship.

---

# 36. KNOWLEDGE HUB

Route:

```text
/knowledge
/knowledge/[slug]
/knowledge/category/[slug]
```

Knowledge Hub menjadi pusat:

* Research
* Assessment
* Reports
* Publications
* Articles
* Stories
* Insights

---

# 37. KNOWLEDGE STRUCTURE

```text
Knowledge
├── slug
├── type
├── status
├── featured
├── authorName
├── publicationDate
├── coverMedia
├── translations
├── categories
├── tags
├── experiences
├── contributionAreas
└── downloads
```

---

# 38. KNOWLEDGE TRANSLATION

```text
language
title
excerpt
content
seoTitle
seoDescription
```

---

# 39. KNOWLEDGE TYPE

Supported:

```text
RESEARCH
ASSESSMENT
REPORT
PUBLICATION
ARTICLE
STORY
INSIGHT
```

CMS menggunakan type sebagai controlled taxonomy.

---

# 40. KNOWLEDGE CATEGORY

Category:

```text
slug
name
description
```

Satu Knowledge dapat memiliki beberapa category.

---

# 41. KNOWLEDGE TAG

Tag:

```text
slug
name
```

Tag digunakan untuk flexible discovery.

---

# 42. KNOWLEDGE DOWNLOAD

Download:

```text
media
label
order
```

Contoh:

```text
Download Report
Download PDF
Download Assessment
```

File hanya dapat diakses jika media tersebut valid dan memang diperbolehkan untuk public download.

---

# 43. KNOWLEDGE AUTHOR

`authorName` dapat digunakan jika nama author merupakan bagian dari publication metadata.

Jangan otomatis mengisi authorName dengan user CMS.

CMS editor bukan otomatis author publikasi.

---

# 44. PARTNERS

Partner content:

```text
name
slug
description
logo
website
category
status
order
```

Partner tidak boleh dipublikasikan hanya karena record dibuat.

Tetap mengikuti status workflow.

---

# 45. PARTNER WEBSITE

Website partner harus disimpan sebagai valid HTTP/HTTPS URL.

Contoh:

```text
https://example.org
```

Tidak diperbolehkan:

```text
javascript:...
data:...
```

---

# 46. ABOUT PAGE

Route:

```text
/about
```

Recommended content sections:

```text
Hero
Who We Are
Why ANTRABUMI
Approach
Framework
GEDSI
Journey
Collective Expertise
CTA
```

---

# 47. WHAT WE DO PAGE

Route:

```text
/what-we-do
```

Struktur:

```text
Hero
Introduction
Contribution Areas
Framework
Approach
CTA
```

Contribution Areas ditarik dari CMS.

---

# 48. EXPERIENCES PAGE

Route:

```text
/experiences
```

Struktur:

```text
Hero
Introduction
Filters
Experience Grid
Pagination
CTA
```

Filter dapat berdasarkan:

```text
Contribution Area
Year
Search
Featured
```

---

# 49. EXPERIENCE DETAIL PAGE

Route:

```text
/experiences/[slug]
```

Struktur:

```text
Hero
Metadata
Overview
Methodology
Impact
Metrics
Gallery
Related Knowledge
Related Experiences
CTA
```

Section kosong disembunyikan.

---

# 50. KNOWLEDGE PAGE

Route:

```text
/knowledge
```

Struktur:

```text
Hero
Search
Type Filter
Category Filter
Tag Filter
Featured Knowledge
Knowledge Grid
Pagination
```

---

# 51. KNOWLEDGE DETAIL

Route:

```text
/knowledge/[slug]
```

Struktur:

```text
Hero
Publication Metadata
Content
Categories
Tags
Downloads
Related Experiences
Related Knowledge
CTA
```

---

# 52. KNOWLEDGE CATEGORY PAGE

Route:

```text
/knowledge/category/[slug]
```

Menampilkan:

```text
Category Header
Description
Knowledge Listing
```

Hanya published Knowledge.

---

# 53. PEOPLE PAGE

Route:

```text
/people
```

Struktur:

```text
Hero
Introduction
People Grid
Expertise
CTA
```

---

# 54. PERSON DETAIL

Route:

```text
/people/[slug]
```

Struktur:

```text
Profile Hero
Biography
Role
Expertise
Related Knowledge
Related Experiences
```

Related sections hanya muncul jika relationship tersedia.

---

# 55. COLLABORATION PAGE

Route:

```text
/collaboration
```

Struktur:

```text
Hero
Why Collaborate
Contribution Areas
Potential Collaboration
CTA
Contact
```

Copy harus berdasarkan positioning ANTRABUMI yang tersedia dalam source material.

---

# 56. CONTACT PAGE

Route:

```text
/contact
```

Struktur:

```text
Hero
Contact Information
Contact Form
Area of Interest
Response CTA
```

Form fields:

```text
Name
Email
Organization
Phone
Subject
Message
Area of Interest
```

---

# 57. CONTACT AREA OF INTEREST

Area of Interest dapat menggunakan Contribution Areas sebagai source.

Jangan membuat taxonomy kedua jika tidak diperlukan.

Recommended:

```text
ContributionArea
```

sebagai source option.

---

# 58. FOOTER

Footer dapat memiliki:

```text
Logo
Short Description
Navigation
Contact
Social Links
Legal Links
Copyright
```

Social links dan contact data sebaiknya configurable.

---

# 59. SEO CONTENT MODEL

Setiap content type yang public dapat memiliki:

```text
seoTitle
seoDescription
```

Optional:

```text
ogImage
```

Fallback:

```text
seoTitle → title
seoDescription → excerpt
```

---

# 60. OPEN GRAPH

Public content dapat menggunakan:

```text
og:image
og:title
og:description
```

Jika `ogImage` tidak tersedia:

```text
coverMedia
```

dapat digunakan sebagai fallback.

---

# 61. CANONICAL URL

Setiap public content harus memiliki canonical URL yang deterministic.

Example:

```text
/experiences/example-experience
```

Jangan membuat duplicate canonical URLs untuk language variant tanpa policy yang jelas.

---

# 62. SEARCH INDEX MODEL

Search dapat menggunakan field:

### Experience

```text
title
excerpt
description
location
```

### Knowledge

```text
title
excerpt
content
tags
categories
```

### People

```text
name
role
biography
expertise
```

### Contribution Areas

```text
title
description
```

---

# 63. CONTENT RELATION MAP

Core relation:

```text
ContributionArea
       │
       ├──────── Experience
       │
       └──────── Knowledge


Experience
       │
       └──────── Knowledge


Person
       │
       └──────── Expertise


Knowledge
       ├──────── Category
       ├──────── Tag
       ├──────── Experience
       ├──────── ContributionArea
       └──────── Media
```

---

# 64. CONTENT DEPENDENCY

Public Experience detail dapat bergantung pada:

```text
Experience
ExperienceTranslation
Media
ContributionArea
ExperienceMetric
ExperienceKnowledge
Knowledge
```

Namun kegagalan data optional tidak boleh menyebabkan seluruh page gagal.

---

# 65. REQUIRED VS OPTIONAL

## Required for basic published Experience

```text
slug
title
description
language
status
```

## Optional

```text
year
location
clientName
methodology
impact
metrics
gallery
relatedKnowledge
```

---

# 66. REQUIRED VS OPTIONAL KNOWLEDGE

## Required

```text
slug
type
title
content
language
status
```

## Optional

```text
excerpt
authorName
publicationDate
cover
category
tag
downloads
relatedExperience
contributionArea
```

---

# 67. REQUIRED VS OPTIONAL PERSON

## Required

```text
slug
name
language
status
```

## Optional

```text
degree
role
biography
image
expertise
```

---

# 68. CONTENT BLOCK STRATEGY

Untuk section editorial yang belum membutuhkan reusable structured model, gunakan structured page fields atau rich content.

Jangan membuat database table baru untuk setiap paragraph.

Gunakan structured models hanya jika content memiliki:

* Relationship.
* Ordering.
* Reusable entity.
* Filtering.
* Independent lifecycle.

---

# 69. HOMEPAGE CONTENT OWNERSHIP

Homepage dapat menggunakan kombinasi:

```text
Page
SiteSetting
ContributionArea
Experience
Person
Knowledge
```

Contoh:

```text
Homepage Hero → Page / Site content
Contribution Areas → ContributionArea
Featured Experiences → Experience
People → Person
Knowledge → Knowledge
```

Dengan pendekatan ini homepage tidak menyimpan duplicate copy yang sebenarnya sudah ada di entity lain.

---

# 70. FEATURED CONTENT RULE

Homepage featured modules mengambil data dari:

```text
Experience.featured = true
Knowledge.featured = true
```

tetapi selalu dengan:

```text
status = PUBLISHED
```

---

# 71. ORDERING

Content yang memiliki order editorial menggunakan integer.

Contoh:

```text
order = 1
order = 2
order = 3
```

CMS harus memungkinkan reorder.

Tidak perlu menyimpan floating-point ordering kecuali terdapat kebutuhan khusus.

---

# 72. CONTENT ARCHIVE

Ketika content di-archive:

```text
status = ARCHIVED
```

relationship tetap dipertahankan agar historical integrity tetap terjaga.

Public modules harus otomatis mengabaikannya.

---

# 73. CONTENT VERSIONING

Initial implementation tidak wajib membuat full revision table untuk semua content.

Namun architecture harus memungkinkan penambahan:

```text
ContentRevision
```

di masa depan.

Audit log tidak menggantikan full content versioning.

---

# 74. CMS FORM STRUCTURE

Form CMS sebaiknya mengikuti struktur content.

Example Experience:

```text
Basic Information
├── Slug
├── Year
├── Location
├── Client
└── Featured

Translation
├── Language
├── Title
├── Excerpt
├── Description
├── Methodology
└── Impact

Relationships
├── Contribution Areas
└── Knowledge

Media
├── Cover
└── Gallery

Metrics
└── Repeating Metrics

SEO
├── SEO Title
└── SEO Description
```

---

# 75. DRAFT EDITING

Draft form dapat menyimpan content incomplete.

CMS harus menunjukkan:

```text
Draft completeness
```

tetapi completeness indicator bukan pengganti server validation.

---

# 76. PUBLISH CHECKLIST UI

Sebelum publish, CMS dapat menampilkan:

```text
✓ Required title
✓ Required description
✓ Valid slug
✓ Cover image
✓ Translation
✓ SEO metadata
✓ Relationships
```

Namun final decision tetap dilakukan oleh server-side validation.

---

# 77. CONTENT PREVIEW

Preview harus memperlihatkan content sebagaimana public page akan tampil, tetapi dengan:

```text
preview mode
```

Preview tidak boleh memengaruhi published cache.

---

# 78. MEDIA ALT TEXT

CMS media selector sebaiknya dapat menampilkan:

```text
Filename
Thumbnail
Alt text
Caption
Attribution
```

Editor dapat memperbarui metadata tanpa mengunggah ulang file.

---

# 79. MEDIA REUSE

Media yang sama boleh digunakan oleh beberapa content.

Contoh:

```text
Media A
├── Experience cover
├── Knowledge image
└── Page image
```

Karena itu media deletion harus melakukan reference check.

---

# 80. CONTENT DISCOVERY

Public users dapat menemukan content melalui:

```text
Navigation
Search
Categories
Tags
Contribution Areas
Related Content
Featured Content
```

Tidak semua content membutuhkan direct navigation item.

---

# 81. RELATED CONTENT RULE

Related content dapat ditentukan melalui:

1. Explicit editorial relationship.
2. Shared Contribution Area.
3. Shared taxonomy.
4. Search/relevance logic.

Explicit relationship harus diprioritaskan jika tersedia.

---

# 82. PUBLIC CONTENT RESPONSE

Public API tidak perlu mengembalikan seluruh database structure.

Contoh Experience public response:

```json
{
  "slug": "example-experience",
  "title": "Example Experience",
  "excerpt": "...",
  "description": "...",
  "year": 2025,
  "location": "...",
  "cover": {
    "url": "...",
    "alt": "..."
  },
  "contributionAreas": [],
  "metrics": [],
  "relatedKnowledge": []
}
```

---

# 83. ADMIN CONTENT RESPONSE

Admin dapat menerima:

```text
status
createdAt
updatedAt
createdBy
updatedBy
publishedAt
```

yang tidak diperlukan public.

---

# 84. CONTENT SOURCE OF TRUTH

Untuk setiap data:

```text
Experience → Experience
Knowledge → Knowledge
Person → Person
Contribution Area → ContributionArea
Media → Media
Navigation → NavigationItem
Site config → SiteSetting
```

Jangan menyimpan duplicate authoritative copies.

---

# 85. DATA DUPLICATION RULE

Duplicate content hanya boleh dibuat jika diperlukan untuk:

* Performance.
* Search index.
* Cache.
* Snapshot/versioning.

Jika duplicate dibuat, tentukan source of truth dengan jelas.

---

# 86. HOMEPAGE STATIC VS CMS

Tidak semua UI text harus menjadi database field.

Gunakan code untuk:

```text
Structural labels
Stable UI primitives
```

Gunakan CMS untuk:

```text
Organizational copy
Editorial content
Project content
People
Knowledge
Navigation
Contact information
SEO
```

---

# 87. CONTENT THAT SHOULD NOT BE CMS-EDITABLE

Application-level security configuration tidak boleh diubah melalui CMS.

Contoh:

```text
database connection
authentication secret
storage credentials
encryption keys
server configuration
```

---

# 88. INITIAL CONTENT PRIORITY

Initial content population sebaiknya dilakukan dalam urutan:

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

# 89. CONTENT MIGRATION

Jika source content berasal dari dokumen lama:

```text
Source
 ↓
Normalize
 ↓
Validate
 ↓
Map to content model
 ↓
Import as Draft
 ↓
Editorial review
 ↓
Publish
```

Jangan langsung import menjadi PUBLISHED tanpa validasi.

---

# 90. CONTENT STRUCTURE ACCEPTANCE CRITERIA

Dokumen content dianggap terimplementasi apabila:

* [ ] Semua public pages memiliki content mapping.
* [ ] Semua content type memiliki CMS representation.
* [ ] ID/EN dapat dikelola independen.
* [ ] Relationships dapat dikelola.
* [ ] Media dapat digunakan ulang.
* [ ] SEO fields tersedia.
* [ ] Search fields jelas.
* [ ] Published content dapat dibedakan dari draft.
* [ ] Empty sections dapat ditangani.
* [ ] Tidak ada duplicate source of truth yang tidak diperlukan.
* [ ] Source-grounded content rule diterapkan.

---

# 91. FINAL CONTENT ARCHITECTURE

```text
                         ANTRABUMI
                             │
              ┌──────────────┼──────────────┐
              │              │              │
           GLOBAL          CONTENT        MEDIA
              │              │              │
       ┌──────┼──────┐       │              │
       │      │      │       │              │
    Settings Nav   SEO       │              │
                             │              │
       ┌─────────┬───────────┼──────────────┐
       │         │           │              │
    Pages   Contribution  Experiences    People
              Areas          │              │
                             │              │
                         Knowledge       Expertise
                             │
                    ┌────────┼────────┐
                    │        │        │
                 Category   Tag    Downloads
```

---

# 92. FINAL PRINCIPLE

Struktur konten ANTRABUMI harus membuat sistem mampu menjawab tiga hal:

### What

```text
Apa yang ANTRABUMI kerjakan?
```

### Who

```text
Siapa orang dan collective expertise di dalamnya?
```

### Evidence

```text
Pengalaman, pengetahuan, assessment, research,
publication, dan learning apa yang mendukungnya?
```

Ketiga lapisan tersebut harus saling terhubung melalui content relationships, tetapi tetap memiliki source of truth masing-masing.

**END OF CONTENT_STRUCTURE.md**
