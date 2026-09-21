# DESIGN_SYSTEM.md — ANTRABUMI

**Project:** ANTRABUMI
**Document:** Design System
**Version:** 1.0
**Status:** Production Architecture

---

# 1. PURPOSE

Dokumen ini mendefinisikan sistem visual dan interaction design ANTRABUMI.

Design system harus menjadi single source of truth untuk:

* Visual identity.
* Color.
* Typography.
* Spacing.
* Grid.
* Layout.
* Components.
* Responsive behavior.
* Accessibility.
* Motion.
* Image treatment.
* Public website.
* CMS interface.

Tujuannya adalah menghasilkan website yang:

* Editorial.
* Natural.
* Human.
* Credible.
* Contemporary.
* Calm.
* Structured.
* Accessible.
* Tidak terasa seperti template corporate generik.

---

# 2. DESIGN DIRECTION

Visual language ANTRABUMI harus menggabungkan:

```text
Knowledge
+
Nature
+
Communities
```

dengan karakter:

```text
Editorial
Human
Grounded
Thoughtful
Warm
Modern
```

Desain harus terasa dekat dengan manusia dan lingkungan tanpa menggunakan visual cliché secara berlebihan.

---

# 3. DESIGN PRINCIPLES

## 3.1 Clarity

Pengunjung harus memahami:

* Siapa ANTRABUMI.
* Apa yang dikerjakan.
* Dengan siapa bekerja.
* Apa yang telah dilakukan.
* Pengetahuan apa yang tersedia.
* Bagaimana berkolaborasi.

dengan cepat.

---

## 3.2 Editorial Hierarchy

Content harus memiliki hirarki visual yang jelas.

Prioritas:

```text
Headline
↓
Supporting message
↓
Content
↓
Metadata
↓
Secondary action
```

---

## 3.3 Human Scale

Gunakan:

* White space.
* Comfortable line length.
* Large but controlled typography.
* Natural imagery.
* Conversational supporting copy.

Hindari:

* Excessive density.
* Too many cards.
* Excessive gradients.
* Excessive shadows.
* Decorative UI tanpa fungsi.

---

## 3.4 Content First

UI harus mendukung content.

Jangan membuat layout yang:

```text
beautiful
but
difficult to read
```

---

# 4. VISUAL PERSONALITY

ANTRABUMI harus terasa:

### Calm

Tidak menggunakan visual noise berlebihan.

### Grounded

Memiliki hubungan visual dengan nature dan communities.

### Intelligent

Typography dan information hierarchy harus terasa thoughtful.

### Human

Photography dan copy tidak boleh terasa terlalu sterile.

### Contemporary

Layout tetap modern dan responsive.

---

# 5. COLOR SYSTEM

Warna final harus mengikuti brand/source material yang telah disepakati.

Jika source brand guideline belum menyediakan exact token, gunakan semantic tokens berikut sebagai implementation layer dan sesuaikan nilai hex setelah brand assets final tersedia.

---

# 6. COLOR TOKENS

## Primary

```text id="x5ts0h"
--color-primary
--color-primary-hover
--color-primary-active
--color-primary-foreground
```

Digunakan untuk:

* Primary CTA.
* Active state.
* Important links.
* Brand accents.

---

# 7. SECONDARY

```text id="eaqjbt"
--color-secondary
--color-secondary-hover
--color-secondary-foreground
```

Digunakan secara terbatas.

Secondary tidak boleh bersaing dengan primary CTA.

---

# 8. NEUTRALS

Minimum neutral scale:

```text id="w7y6ny"
--color-neutral-50
--color-neutral-100
--color-neutral-200
--color-neutral-300
--color-neutral-400
--color-neutral-500
--color-neutral-600
--color-neutral-700
--color-neutral-800
--color-neutral-900
--color-neutral-950
```

Penggunaan:

```text id="h6egw4"
50–100  → subtle backgrounds
200–300 → borders
400–500 → secondary text
600–700 → body text
800–950 → headings
```

---

# 9. SEMANTIC COLORS

```text id="gn4q5x"
--color-success
--color-warning
--color-error
--color-info
```

Digunakan untuk state, bukan dekorasi.

---

# 10. CMS STATUS COLORS

CMS status:

```text id="8af0p6"
DRAFT
REVIEW
PUBLISHED
ARCHIVED
```

Harus memiliki visual distinction yang jelas.

Namun status tidak boleh dibedakan hanya berdasarkan warna.

Tambahkan:

* Label.
* Icon.
* Text.

---

# 11. ACCESSIBLE COLOR CONTRAST

Minimum target:

```text id="5pmg3m"
WCAG AA
```

Untuk normal text:

```text id="7j0qma"
4.5:1
```

Untuk large text:

```text id="1a9f6s"
3:1
```

UI controls dan meaningful graphical elements harus memiliki contrast yang memadai.

---

# 12. TYPOGRAPHY

Typography harus terasa:

```text id="u5a5w4"
Editorial
Readable
Contemporary
Human
```

Gunakan maksimal dua font families.

Recommended structure:

```text id="p3cw2f"
Display / Heading Font
+
Body / UI Font
```

Jika brand font tersedia, gunakan brand font tersebut.

Jika belum tersedia, pilih web-safe/open-source alternatives dengan readability tinggi.

---

# 13. FONT LOADING

Font harus:

* Self-host jika memungkinkan.
* Menggunakan `font-display: swap`.
* Memiliki subset yang dibutuhkan.
* Tidak memblokir rendering utama.

---

# 14. TYPE SCALE

Recommended scale:

```text id="y25d9p"
Display XL   64–80px
Display L    52–64px
H1           44–56px
H2           36–44px
H3           28–36px
H4           22–28px
H5           18–22px
Body L       18–20px
Body         16–18px
Body S       14–16px
Caption      12–14px
```

Nilai final harus menggunakan responsive `clamp()` bila memungkinkan.

---

# 15. HEADING RULES

Heading:

* Harus singkat.
* Harus memiliki semantic HTML.
* Tidak boleh menggunakan heading level hanya demi ukuran visual.

Contoh:

```html id="z8b6y0"
<h1>
<h2>
<h3>
```

CSS tidak menentukan semantic hierarchy.

---

# 16. BODY TEXT

Body text:

```text id="r3zzx1"
font-size: 16–18px
line-height: 1.5–1.7
```

Optimal reading width:

```text id="pxq2lu"
60–75 characters per line
```

---

# 17. LABEL / EYEBROW

Eyebrow digunakan untuk:

* Section category.
* Content type.
* Small context.

Contoh:

```text id="a6u8cq"
EXPERIENCES
KNOWLEDGE
OUR APPROACH
```

Tidak boleh digunakan secara berlebihan.

---

# 18. SPACING SYSTEM

Gunakan spacing scale berbasis kelipatan kecil.

Recommended:

```text id="h9g2n4"
4
8
12
16
20
24
32
40
48
64
80
96
120
160
```

Dalam Tailwind dapat dipetakan ke utility scale.

---

# 19. SECTION SPACING

Desktop:

```text id="yk3n95"
Small section       48–64px
Standard section    80–120px
Major section       120–160px
```

Mobile:

```text id="2lq9ca"
Small section       32–48px
Standard section    56–80px
Major section       80–96px
```

---

# 20. CONTAINER

Recommended maximum width:

```text id="3p4w7k"
1280px
```

Large editorial content:

```text id="2y2z1g"
720–840px
```

Full-bleed visual sections dapat menggunakan viewport width.

---

# 21. PAGE GUTTER

Desktop:

```text id="3h9f0v"
32–48px
```

Tablet:

```text id="gj30bg"
24–32px
```

Mobile:

```text id="7a4i8v"
20–24px
```

Jangan membuat mobile content menempel pada edge viewport.

---

# 22. GRID

Desktop default:

```text id="qf7t44"
12 columns
```

Tablet:

```text id="w8m8tu"
8 columns
```

Mobile:

```text id="8xv9df"
4 columns
```

Gunakan CSS Grid untuk layout utama.

---

# 23. RESPONSIVE BREAKPOINTS

Recommended:

```text id="5s1iw9"
sm   640px
md   768px
lg   1024px
xl   1280px
2xl  1536px
```

Design harus mobile-first.

---

# 24. RESPONSIVE PRINCIPLE

Desktop layout tidak boleh sekadar diperkecil ke mobile.

Pada mobile:

* Grid dapat menjadi single column.
* Navigation berubah menjadi menu.
* Complex horizontal sections dapat menjadi vertical.
* Typography mengecil secara controlled.
* Image aspect ratio tetap konsisten.
* CTA dapat menjadi full-width.

---

# 25. HEADER

Header public harus memiliki:

```text id="3gohs0"
Logo
Primary Navigation
Language Switcher
Primary CTA
Mobile Menu Trigger
```

---

# 26. HEADER BEHAVIOR

Desktop:

```text id="6bwr8x"
Logo | Navigation | Language | CTA
```

Mobile:

```text id="k09z3h"
Logo | Menu
```

Language switcher tetap dapat diakses melalui mobile menu.

---

# 27. STICKY HEADER

Sticky header boleh digunakan.

Jika digunakan:

* Tidak menutup anchor target.
* Tidak terlalu tinggi.
* Scroll transition subtle.
* Tidak mengganggu mobile viewport.

---

# 28. FOOTER

Footer memiliki hierarchy:

```text id="s2tqhp"
Brand
Description
Navigation
Contact
Social
Legal
Copyright
```

Footer tidak boleh terlalu padat.

---

# 29. BUTTONS

Button variants:

```text id="n5i7za"
Primary
Secondary
Tertiary
Ghost
Text Link
```

---

# 30. PRIMARY BUTTON

Primary CTA digunakan untuk:

* Contact.
* Collaboration.
* Important conversion.

Properties:

```text id="8v0p6x"
clear background
high contrast
medium/large height
comfortable horizontal padding
```

---

# 31. SECONDARY BUTTON

Secondary digunakan untuk:

* Alternative CTA.
* Navigation.
* Less prominent action.

Tidak boleh terlihat lebih dominant daripada primary.

---

# 32. TEXT LINK

Text link digunakan untuk:

* Related content.
* Read more.
* Secondary navigation.

Harus memiliki visible hover/focus state.

---

# 33. BUTTON STATES

Setiap button harus memiliki:

```text id="r2gjf4"
Default
Hover
Focus
Active
Disabled
Loading
```

---

# 34. FOCUS STATE

Focus state harus jelas.

Jangan menghapus:

```css id="n5t1j4"
outline: none;
```

tanpa replacement yang accessible.

---

# 35. INPUTS

Input components:

```text id="5h5z6q"
Text Input
Textarea
Select
Search Input
Checkbox
Radio
File Upload
```

---

# 36. FORM STRUCTURE

Form harus memiliki:

```text id="4v9zpf"
Label
Input
Helper Text
Error Message
```

Contoh:

```text id="4c4d0d"
Label
↓
Input
↓
Helper / Error
```

---

# 37. FORM VALIDATION

Error harus:

* Specific.
* Human-readable.
* Dekat dengan field.
* Tidak hanya menggunakan color.

---

# 38. CARD

Card digunakan untuk:

* Experience.
* Knowledge.
* People.
* Partner.
* Search result.

Card harus memiliki hierarchy:

```text id="j2b04x"
Image
Eyebrow / Type
Title
Excerpt
Metadata
Action
```

Tidak semua card harus menggunakan seluruh field.

---

# 39. EXPERIENCE CARD

Experience card:

```text id="v4ykwx"
Cover
Year
Title
Excerpt
Contribution Area
Arrow / CTA
```

Hover boleh memberikan subtle movement.

---

# 40. KNOWLEDGE CARD

Knowledge card:

```text id="4a4imq"
Cover
Type
Title
Excerpt
Publication Date
Category / Tag
CTA
```

---

# 41. PEOPLE CARD

People card:

```text id="l18z9v"
Portrait
Name
Role
Expertise
```

Image harus memiliki consistent aspect ratio.

---

# 42. PARTNER CARD

Partner card:

```text id="d8qjvq"
Logo
Name
Category
Website
```

Partner logo harus mempertahankan aspect ratio asli.

---

# 43. IMAGE SYSTEM

Image treatment harus konsisten.

Recommended aspect ratios:

```text id="j8u1ic"
Hero        16:9 / cinematic
Experience  4:3 / 3:2
People      3:4 / square
Knowledge   16:9
Partner     natural
```

Aspect ratio dapat berbeda berdasarkan source image.

---

# 44. IMAGE FIT

Default:

```text id="1v4a3r"
object-fit: cover
```

untuk editorial cards.

Logo:

```text id="mpp9uq"
object-fit: contain
```

Portrait harus mempertahankan focal point.

---

# 45. IMAGE QUALITY

Gunakan Next.js Image atau equivalent image optimization.

Prefer:

```text id="g9q9pk"
WebP
AVIF
```

jika browser/storage pipeline mendukung.

---

# 46. IMAGE LOADING

Above-the-fold hero image:

```text id="4op6uq"
priority loading
```

Images below the fold:

```text id="sw1d0y"
lazy loading
```

---

# 47. SKELETONS

Skeleton digunakan pada CMS atau asynchronous UI jika loading state cukup lama untuk dirasakan.

Skeleton tidak boleh menyerupai error state.

---

# 48. EMPTY STATE

Empty state harus memiliki:

```text id="c9ut2p"
Context
Short explanation
Optional action
```

Contoh:

```text id="v5k3hc"
No knowledge available yet.
```

Jangan membuat empty state terlalu dekoratif.

---

# 49. ERROR STATE

Error state:

```text id="14o0wh"
What happened
What user can do
Retry if appropriate
```

Technical stack trace tidak boleh ditampilkan.

---

# 50. MODAL

Modal digunakan secara terbatas.

Cocok untuk:

* Confirmation.
* Media selection.
* Delete confirmation.
* CMS focused actions.

Jangan menggunakan modal untuk content panjang yang lebih cocok sebagai page.

---

# 51. DRAWER

Drawer cocok untuk:

* Mobile navigation.
* Filters.
* CMS side panel.
* Media selector.

Drawer harus trap focus dan dapat ditutup dengan:

```text id="10mkwy"
Escape
Close button
```

---

# 52. BADGE

Badge digunakan untuk:

* Knowledge type.
* Status.
* Category.
* Small metadata.

Jangan menggunakan badge untuk setiap piece of information.

---

# 53. BREADCRUMBS

Breadcrumbs digunakan pada:

* Experience detail.
* Knowledge detail.
* Category pages.

Contoh:

```text id="m6w7vp"
Home
/
Knowledge
/
Category
/
Title
```

Mobile dapat menyederhanakan breadcrumb.

---

# 54. PAGINATION

Pagination harus:

* Keyboard accessible.
* Memiliki current page indicator.
* Memiliki previous/next.
* Tidak terlalu panjang.

Mobile dapat menggunakan compact pagination.

---

# 55. SEARCH

Search component:

```text id="8j5n2m"
Input
Search icon
Clear button
Result count
```

Search harus memiliki accessible label.

---

# 56. FILTERS

Filter dapat menggunakan:

* Select.
* Tabs.
* Chips.
* Drawer pada mobile.

Desktop:

```text id="9m7j1p"
Horizontal filters
```

Mobile:

```text id="d1e4wx"
Filter button
↓
Drawer / panel
```

---

# 57. TAB SYSTEM

Tabs digunakan hanya jika content merupakan alternatif view dalam konteks yang sama.

Jangan menggunakan tabs untuk primary navigation.

Tabs harus memiliki keyboard support.

---

# 58. ACCORDION

Accordion cocok untuk:

* FAQ.
* Supporting details.
* CMS sections.

Tidak cocok untuk primary content yang seharusnya langsung terlihat.

---

# 59. TOAST

Toast digunakan untuk:

* Save success.
* Publish success.
* Copy success.
* Non-critical feedback.

Error penting tetap harus terlihat dalam context.

---

# 60. CMS LAYOUT

Admin CMS layout:

```text id="e0t46s"
┌───────────────────────────────┐
│ Header                        │
├────────────┬──────────────────┤
│ Sidebar    │ Main Content     │
│            │                  │
│            │                  │
└────────────┴──────────────────┘
```

---

# 61. CMS SIDEBAR

Navigation:

```text id="2v6i44"
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

Menu item hanya tampil jika user memiliki permission.

Namun hidden menu bukan security mechanism.

---

# 62. CMS DASHBOARD

Dashboard harus menampilkan:

* Content counts.
* Recent activity.
* Recent messages.
* Draft/review status.
* Quick actions.

Jangan menggunakan fake analytics.

---

# 63. CMS TABLE

Table digunakan untuk:

* Experiences.
* Knowledge.
* People.
* Messages.
* Users.
* Media.

Minimum:

```text id="z0sg5w"
Name / Title
Status
Updated
Owner
Actions
```

---

# 64. CMS TABLE ACTIONS

Actions harus contextual.

Contoh:

```text id="21xj8v"
Edit
Preview
Submit Review
Publish
Archive
Delete
```

Action yang tidak memiliki permission tidak boleh dieksekusi meskipun dipanggil manual.

---

# 65. CMS EDITOR

Editor harus mendukung:

* Heading.
* Paragraph.
* Lists.
* Links.
* Quotes.
* Images.
* Basic formatting.

Rich text toolbar harus tetap sederhana.

---

# 66. EDITOR CONTENT SANITIZATION

Content editor output dianggap untrusted.

Sanitization dilakukan server-side sebelum public rendering.

---

# 67. CMS MEDIA LIBRARY

Media library:

```text id="6l0s0d"
Search
Type Filter
Grid/List
Upload
Select
Metadata
Delete
```

Image preview harus tersedia jika memungkinkan.

---

# 68. CMS PUBLISHING UX

Publish action harus memberikan confirmation ketika diperlukan.

Contoh:

```text id="yqg8ga"
Ready to publish?
```

Jika validation gagal:

```text id="kzqjjr"
Publish blocked
```

dan tampilkan required corrections.

---

# 69. CMS STATUS INDICATOR

Content list harus mudah membedakan:

```text id="9fskw8"
Draft
In Review
Published
Archived
```

Status label tidak hanya menggunakan color.

---

# 70. RESPONSIVE CMS

CMS harus usable pada:

```text id="f7mlp4"
Desktop
Tablet
```

Mobile CMS dapat didukung secara progressive enhancement, tetapi operasi penting tidak boleh unusable pada viewport kecil.

---

# 71. ACCESSIBILITY

Target:

```text id="n8k5ju"
WCAG 2.2 AA
```

---

# 72. KEYBOARD ACCESS

Semua interactive elements harus dapat diakses melalui keyboard.

Minimum:

```text id="x8p5v1"
Tab
Shift+Tab
Enter
Space
Escape
Arrow keys
```

sesuai component.

---

# 73. SCREEN READER

Gunakan semantic HTML:

```text id="9zjjls"
header
nav
main
section
article
aside
footer
button
form
label
```

Jangan mengganti semantic element dengan generic `div` jika tidak diperlukan.

---

# 74. ARIA

ARIA digunakan jika semantic HTML tidak cukup.

Jangan menggunakan ARIA untuk menggantikan semantic HTML yang tersedia.

---

# 75. MOTION

Motion harus:

```text id="f7w0v8"
Subtle
Purposeful
Fast
```

Recommended duration:

```text id="i8u5l4"
100–150ms → micro interaction
200–300ms → normal transition
300–500ms → larger transition
```

---

# 76. REDUCED MOTION

Jika user memilih:

```text id="8vysqz"
prefers-reduced-motion
```

non-essential motion harus dikurangi atau dihilangkan.

---

# 77. HOVER EFFECT

Hover effect dapat digunakan pada:

* Cards.
* Links.
* Buttons.
* Images.

Hindari dramatic scaling yang menyebabkan layout shift.

---

# 78. PAGE TRANSITIONS

Page transitions harus subtle.

Jangan menggunakan transition panjang yang menghambat navigation.

---

# 79. HERO DESIGN

Hero merupakan salah satu visual anchor utama.

Recommended structure:

```text id="6f8vkd"
Eyebrow
Large Heading
Description
CTA
Visual
```

Hero dapat:

* Full width.
* Split layout.
* Editorial layout.

Namun tetap prioritaskan readability.

---

# 80. HOMEPAGE VISUAL RHYTHM

Homepage harus memiliki rhythm:

```text id="z1pr31"
Hero
↓
Light section
↓
Visual section
↓
Content section
↓
Dark / contrasting section
↓
Grid
↓
CTA
```

Jangan membuat seluruh page memiliki background dan card treatment yang sama.

---

# 81. NATURE VISUAL LANGUAGE

Natural imagery dapat digunakan untuk:

* Landscape.
* Community.
* Field work.
* Environmental context.
* Human interaction.

Hindari stock imagery yang terlalu generic jika source photography tersedia.

---

# 82. PHOTOGRAPHY

Photography harus terasa:

* Authentic.
* Contextual.
* Human.
* Documentary/editorial.

Prioritaskan source photography.

Jika belum tersedia, gunakan placeholder yang jelas dan jangan menganggapnya sebagai final organizational documentation.

---

# 83. ILLUSTRATION

Illustration dapat digunakan untuk:

* Framework.
* Abstract concept.
* Supporting visual.

Jangan menggunakan illustration untuk menggantikan evidence photography jika context membutuhkan representasi nyata.

---

# 84. ICONOGRAPHY

Icon style harus konsisten.

Recommended:

```text id="8xwj4j"
Simple
Geometric
Moderate stroke
```

Jangan mencampur banyak icon libraries secara sembarangan.

---

# 85. BORDER RADIUS

Gunakan radius secara konsisten.

Recommended:

```text id="fq4m2v"
Small       6px
Medium      10px
Large       16px
XL          24px
Pill        9999px
```

Tidak semua element membutuhkan rounded corners.

---

# 86. SHADOW

Shadow harus subtle.

Recommended semantic levels:

```text id="5rqm3p"
shadow-sm
shadow-md
shadow-lg
```

Gunakan terutama untuk:

* Floating UI.
* Dropdown.
* Modal.
* Sticky surfaces.

Editorial cards dapat menggunakan border daripada shadow.

---

# 87. BORDERS

Default border:

```text id="6ub0cb"
1px
```

Gunakan neutral tone.

Borders harus membantu hierarchy, bukan mendominasi visual.

---

# 88. BACKGROUND SYSTEM

Recommended semantic backgrounds:

```text id="i6nux7"
background-primary
background-secondary
background-muted
background-accent
background-inverse
```

Gunakan alternating surfaces untuk section hierarchy.

---

# 89. DARK SECTIONS

Dark background dapat digunakan untuk:

* CTA.
* Framework.
* Footer.
* Important visual section.

Pastikan contrast memenuhi accessibility requirement.

---

# 90. CONTENT WIDTH

Full-width section:

```text id="2fbv7p"
viewport
```

Container content:

```text id="g2l9wy"
max-width: 1280px
```

Reading content:

```text id="sh3n16"
max-width: 720–840px
```

---

# 91. LONG-FORM CONTENT

Knowledge detail harus mengutamakan readability.

Recommended:

```text id="eq6oz1"
Body 18px
Line-height 1.6–1.8
Reading width 680–780px
```

---

# 92. CONTENT TABLES

Jika Knowledge memiliki table:

* Responsive.
* Horizontal scroll pada mobile.
* Header jelas.
* Tidak menggunakan tiny text.

---

# 93. CODE / TECHNICAL CONTENT

Jika Knowledge membutuhkan technical content:

* Monospace font.
* Horizontal scroll.
* Syntax highlighting jika diperlukan.
* Accessible contrast.

---

# 94. LINK STYLING

Links harus recognizable.

Jangan hanya membedakan link melalui hover.

Gunakan:

* Underline.
* Distinct color.
* Strong typography.

---

# 95. MOBILE NAVIGATION

Mobile menu:

```text id="6t1jzk"
Menu trigger
↓
Full / partial drawer
↓
Navigation
Language
CTA
```

Focus harus terperangkap selama menu terbuka jika menggunakan modal-like drawer.

---

# 96. LANGUAGE SWITCHER

Language switcher:

```text id="uxaq4u"
ID
EN
```

Current language harus jelas.

Changing language harus mempertahankan current page apabila translation tersedia.

Jika tidak tersedia, gunakan fallback behavior yang telah ditentukan.

---

# 97. FORM ACCESSIBILITY

Form harus mendukung:

* Label.
* Error.
* Required indicator.
* Keyboard navigation.
* Focus.
* Screen reader announcement.

Error summary dapat digunakan untuk form panjang.

---

# 98. LOADING STATES

Loading state tidak boleh menyebabkan:

```text id="5mb8c0"
layout jump
```

Gunakan skeleton atau reserved space jika memungkinkan.

---

# 99. PERFORMANCE DESIGN RULE

Design decisions harus mempertimbangkan:

```text id="m3r9pk"
LCP
CLS
INP
```

Hindari:

* Huge unoptimized hero images.
* Excessive JavaScript animation.
* Large font payload.
* Unnecessary client components.

---

# 100. COMPONENT ARCHITECTURE

Recommended:

```text id="0d3z4a"
components/
├── ui/
│   ├── Button
│   ├── Input
│   ├── Badge
│   ├── Card
│   ├── Modal
│   └── ...
│
├── layout/
│   ├── Header
│   ├── Footer
│   ├── Container
│   └── Navigation
│
├── content/
│   ├── ExperienceCard
│   ├── KnowledgeCard
│   ├── PersonCard
│   ├── SearchResult
│   └── ...
│
├── sections/
│   ├── Hero
│   ├── About
│   ├── Framework
│   ├── ContributionAreas
│   └── ...
│
└── admin/
    ├── Sidebar
    ├── DataTable
    ├── ContentEditor
    ├── MediaPicker
    └── ...
```

---

# 101. COMPONENT RULE

Component harus memiliki satu tanggung jawab utama.

Hindari:

```text id="fj6lpd"
MassivePageComponent
```

yang mengandung seluruh business logic.

---

# 102. SERVER VS CLIENT COMPONENT

Default:

```text id="e8xw9f"
Server Component
```

Gunakan Client Component jika membutuhkan:

* Interaction.
* State.
* Browser API.
* Event handlers.
* Rich editor.
* Complex UI.

Jangan membuat seluruh page menjadi Client Component tanpa alasan.

---

# 103. DESIGN TOKEN IMPLEMENTATION

Design tokens harus berada dalam satu source.

Recommended:

```text id="j0p2cc"
styles/
├── tokens.css
├── globals.css
└── utilities.css
```

atau menggunakan Tailwind theme configuration.

Jangan mendefinisikan brand values secara acak di setiap component.

---

# 104. COMPONENT DOCUMENTATION

Reusable components harus memiliki:

* Purpose.
* Props.
* Variants.
* States.
* Accessibility behavior.
* Usage example.

---

# 105. DESIGN SYSTEM ACCEPTANCE CRITERIA

Design system selesai apabila:

* [ ] Color tokens tersedia.
* [ ] Typography tokens tersedia.
* [ ] Spacing scale tersedia.
* [ ] Grid tersedia.
* [ ] Responsive breakpoints tersedia.
* [ ] Button states tersedia.
* [ ] Form states tersedia.
* [ ] Card variants tersedia.
* [ ] Header responsive.
* [ ] Footer responsive.
* [ ] CMS components tersedia.
* [ ] Accessibility rules diterapkan.
* [ ] Reduced motion didukung.
* [ ] Images optimized.
* [ ] Design tokens centralized.
* [ ] Public dan Admin memiliki visual consistency.

---

# 106. IMPLEMENTATION PRIORITY

Design implementation dilakukan dengan urutan:

```text id="0j9m5g"
1. Design tokens
2. Typography
3. Container / Grid
4. Base UI
5. Header
6. Footer
7. Buttons
8. Forms
9. Cards
10. Content components
11. Public sections
12. CMS components
13. Responsive refinement
14. Accessibility
15. Motion
16. Performance optimization
```

---

# 107. FINAL DESIGN PRINCIPLE

ANTRABUMI tidak harus terlihat "ramai" untuk terlihat distinctive.

Distinctiveness harus berasal dari:

```text id="3ng7sp"
Typography
+
Whitespace
+
Photography
+
Content hierarchy
+
Color
+
Editorial composition
+
Human stories
```

bukan dari:

```text id="pjk1p5"
Excessive animation
+
Gradients
+
Decorative effects
+
UI complexity
```

Design system harus membuat website terasa **calm, editorial, credible, human, dan connected to knowledge, nature, and communities**, sambil tetap menjaga usability, accessibility, dan performance.

**END OF DESIGN_SYSTEM.md**
