# BUSINESS_RULES.md — ANTRABUMI

**Project:** ANTRABUMI
**Document:** Business Rules
**Version:** 1.0
**Status:** Production Architecture

---

# 1. PURPOSE

Dokumen ini mendefinisikan aturan bisnis yang wajib dipatuhi oleh seluruh aplikasi ANTRABUMI.

Business rules berlaku pada:

* Public Website
* CMS
* API
* Server Actions
* Database operations
* Authentication
* Authorization
* Publishing workflow
* Content management
* Media management
* Contact management
* Multilingual content
* Search
* Navigation
* Audit logging

Business rules tidak boleh hanya diterapkan di UI.

Semua aturan kritis harus ditegakkan di server.

---

# 2. CORE PRINCIPLES

ANTRABUMI harus mengikuti prinsip:

1. Content-first
2. Source-grounded
3. Human-controlled publishing
4. Server-side authorization
5. Explicit multilingual content
6. Auditability
7. Safe media management
8. No unpublished content leakage
9. Archive instead of destructive deletion where possible
10. Consistent data relationships

---

# 3. CONTENT OWNERSHIP

Setiap content record yang dibuat melalui CMS harus memiliki informasi creator apabila model mendukungnya.

Contoh:

```text
Experience.createdById
Experience.updatedById

Knowledge.createdById
Knowledge.updatedById

Person.createdById
Person.updatedById
```

Creator tidak otomatis memiliki hak untuk publish.

Hak publish ditentukan oleh role.

---

# 4. ROLE DEFINITIONS

## 4.1 AUTHOR

AUTHOR dapat:

* Membuat content.
* Mengedit content miliknya.
* Menyimpan draft.
* Mengirim content untuk review.
* Melihat status content yang dibuat.
* Menggunakan media sesuai permission.

AUTHOR tidak dapat:

* Publish content.
* Mengubah role user.
* Mengubah system settings.
* Menghapus audit log.
* Mengakses fungsi Super Admin.

---

# 5. EDITOR

EDITOR dapat:

* Membuat content.
* Mengedit content.
* Mengedit content yang dibuat user lain.
* Melakukan review.
* Mengembalikan content ke draft.
* Publish content.
* Archive content.
* Mengelola content taxonomy sesuai permission.
* Mengelola media sesuai permission.

EDITOR tidak dapat melakukan operasi administratif tingkat sistem kecuali diberikan permission eksplisit.

---

# 6. ADMIN

ADMIN dapat:

* Mengelola seluruh content.
* Mengelola media.
* Mengelola contact messages.
* Mengelola navigation.
* Mengelola operational CMS.
* Melakukan publish/archive.
* Mengelola user dalam batas permission yang diberikan.
* Mengakses fungsi administratif yang ditentukan sistem.

ADMIN tidak otomatis memiliki hak untuk mengubah seluruh konfigurasi keamanan tingkat sistem.

---

# 7. SUPER ADMIN

SUPER_ADMIN memiliki akses penuh terhadap CMS.

Termasuk:

* Semua content.
* Semua media.
* Semua users.
* Role management.
* Site settings.
* Audit logs.
* System-level configuration.
* Semua publishing operation.

SUPER_ADMIN tetap harus mengikuti audit logging.

---

# 8. ROLE HIERARCHY

Secara konseptual:

```text
SUPER_ADMIN
     ↓
ADMIN
     ↓
EDITOR
     ↓
AUTHOR
```

Hierarchy tidak berarti role yang lebih tinggi boleh melakukan operasi tanpa audit.

Semua operasi sensitif tetap dicatat.

---

# 9. USER STATUS

User memiliki status:

```text
ACTIVE
INACTIVE
SUSPENDED
```

## ACTIVE

User dapat login sesuai role.

## INACTIVE

User tidak dapat melakukan login.

Data content milik user tetap dipertahankan.

## SUSPENDED

User tidak dapat login dan seluruh session aktif harus dianggap tidak valid pada pemeriksaan berikutnya.

---

# 10. AUTHENTICATION RULES

Login membutuhkan:

* Email valid.
* Password valid.
* User ACTIVE.

User `INACTIVE` atau `SUSPENDED` tidak boleh mendapatkan session aktif.

Login failure tidak boleh mengungkap apakah email tertentu terdaftar.

---

# 11. SESSION RULES

Session harus:

* Secure.
* HttpOnly apabila menggunakan cookie.
* SameSite sesuai kebutuhan deployment.
* Memiliki expiration.
* Divalidasi server-side.

Jangan menyimpan session credential sensitif di `localStorage`.

---

# 12. CONTENT STATUS

Semua content yang mendukung workflow publishing menggunakan:

```text
DRAFT
REVIEW
PUBLISHED
ARCHIVED
```

---

# 13. DRAFT

DRAFT berarti content masih dalam proses.

DRAFT:

* Tidak muncul di public website.
* Tidak muncul di public search.
* Tidak masuk sitemap.
* Tidak dianggap published.
* Boleh belum lengkap.

---

# 14. REVIEW

REVIEW berarti content telah diajukan untuk pemeriksaan.

REVIEW:

* Tidak muncul di public website.
* Tidak muncul di public search.
* Tidak masuk sitemap.
* Dapat diperiksa oleh reviewer.
* Harus memenuhi validasi struktural minimum.

---

# 15. PUBLISHED

PUBLISHED berarti content tersedia untuk public website.

PUBLISHED content:

* Dapat diakses public.
* Dapat muncul dalam search.
* Dapat muncul dalam related content.
* Dapat masuk sitemap.
* Harus memenuhi seluruh publish requirements.

---

# 16. ARCHIVED

ARCHIVED berarti content tidak lagi aktif di public website.

ARCHIVED:

* Tidak muncul dalam public listing.
* Tidak muncul dalam public search.
* Tidak masuk sitemap.
* Tetap disimpan di database.
* Tetap tersedia untuk admin yang memiliki permission.

---

# 17. STATUS TRANSITIONS

Valid transition:

```text
DRAFT
  ↓
REVIEW
  ↓
PUBLISHED
  ↓
ARCHIVED
```

Additional valid transitions:

```text
REVIEW → DRAFT

PUBLISHED → DRAFT

ARCHIVED → DRAFT
```

Transition harus melalui service/business layer.

Tidak boleh mengubah status langsung dari client dengan arbitrary value.

---

# 18. PUBLISH PERMISSION

AUTHOR:

```text
Cannot publish
```

EDITOR:

```text
Can publish
```

ADMIN:

```text
Can publish
```

SUPER_ADMIN:

```text
Can publish
```

---

# 19. PUBLISH VALIDATION

Content tidak boleh menjadi PUBLISHED apabila required public data belum tersedia.

Minimal validation:

* Valid slug.
* Required translation tersedia.
* Required title tersedia.
* Required content tersedia.
* Referenced media valid.
* Related entities tidak invalid.
* Tidak ada broken required relationship.
* Status transition valid.

---

# 20. PUBLISHED TRANSLATION

Sebuah content yang published harus memiliki translation yang cukup untuk bahasa yang digunakan public.

Default supported languages:

```text
ID
EN
```

Jika suatu bahasa tidak tersedia, aplikasi mengikuti fallback policy yang telah dikonfigurasi.

---

# 21. TRANSLATION INDEPENDENCE

ID dan EN adalah data yang berbeda.

Mengubah:

```text
ID title
```

tidak boleh otomatis mengubah:

```text
EN title
```

dan sebaliknya.

---

# 22. NO SILENT TRANSLATION

CMS tidak boleh secara diam-diam menerjemahkan content menggunakan machine translation lalu menyimpannya sebagai final content.

Jika automated translation ditambahkan di masa depan, hasilnya harus ditandai sebagai draft/unreviewed sampai diverifikasi manusia.

---

# 23. LANGUAGE FALLBACK

Fallback harus eksplisit.

Contoh:

```text
Request EN
   ↓
EN exists?
   ↓ yes
return EN

   ↓ no

ID fallback enabled?
   ↓ yes
return ID
```

Jika fallback tidak diaktifkan:

```text
404 / CONTENT_NOT_AVAILABLE
```

---

# 24. SLUG RULES

Slug harus:

* Lowercase.
* URL-safe.
* Menggunakan hyphen.
* Tidak mengandung whitespace.
* Tidak mengandung karakter berbahaya.
* Stable setelah publish.

Contoh valid:

```text
community-development
ecological-batik-assessment
digital-ecosystem-assessment
```

---

# 25. SLUG UNIQUENESS

Slug public harus unik dalam entity type.

Contoh:

```text
Experience.slug
Knowledge.slug
Person.slug
```

tidak boleh memiliki duplicate pada entity yang sama.

---

# 26. SLUG CHANGES

Slug published sebaiknya tidak diubah tanpa alasan yang valid.

Jika slug harus diubah:

1. Record diperbarui.
2. Cache di-invalidate.
3. SEO metadata diperbarui.
4. Jika redirect system tersedia, redirect lama dibuat.
5. Audit log dibuat.

---

# 27. CONTENT DELETION

Destructive deletion bukan default.

Prioritas:

```text
Archive
```

daripada:

```text
Delete
```

Hard delete hanya boleh dilakukan jika:

* Data tidak diperlukan.
* Tidak memiliki dependency penting.
* User memiliki permission.
* Tidak melanggar audit/data retention requirement.

---

# 28. RELATION INTEGRITY

Content yang masih direferensikan tidak boleh dihapus secara sembarangan.

Contoh:

Knowledge yang masih terhubung dengan:

* Category
* Tag
* Experience
* Contribution Area

harus ditangani dengan aman.

---

# 29. CONTRIBUTION AREA

Contribution Area harus merepresentasikan area kerja yang telah ditentukan.

Core areas:

1. Conservation, Climate & Sustainability
2. Program & Strategy
3. Partnership & Collaboration
4. Media, Storytelling & Campaign
5. Community Development
6. Research, Assessment & Knowledge

Jangan menambahkan area baru sebagai fakta organisasi tanpa sumber atau keputusan editorial.

---

# 30. EXPERIENCE RULES

Experience harus merepresentasikan pengalaman/proyek yang benar-benar tersedia dalam source content.

Field utama:

```text
title
description
methodology
impact
year
location
client
cover
gallery
contribution area
```

Tidak boleh membuat klaim proyek yang tidak memiliki dasar source material.

---

# 31. FEATURED CONTENT

`featured = true` hanya mengontrol prioritas editorial.

Featured bukan status publishing.

Content berikut masih harus:

```text
status = PUBLISHED
```

agar dapat muncul public.

Jadi:

```text
featured = true
status = DRAFT
```

tetap tidak boleh tampil public.

---

# 32. KNOWLEDGE RULES

Knowledge harus memiliki `type`.

Supported types:

```text
RESEARCH
ASSESSMENT
REPORT
PUBLICATION
ARTICLE
STORY
INSIGHT
```

Type digunakan untuk:

* Filtering.
* Display.
* Search.
* Categorization.

---

# 33. KNOWLEDGE PUBLICATION DATE

`publicationDate` harus digunakan untuk merepresentasikan tanggal publikasi content apabila tersedia.

Tanggal tersebut tidak boleh dibuat secara fiktif.

Jika tanggal tidak tersedia:

```text
publicationDate = null
```

lebih baik daripada mengarang tanggal.

---

# 34. PEOPLE RULES

People hanya boleh dipublikasikan apabila informasi profile memiliki dasar source content.

Minimum published profile:

* Name.
* Role or relevant profile information.
* Required translation content.

Degree hanya dicantumkan jika tersedia.

---

# 35. EXPERTISE RULES

Expertise merupakan taxonomy reusable.

Satu person dapat memiliki banyak expertise.

Urutan expertise dapat dikontrol melalui:

```text
PersonExpertise.order
```

---

# 36. CATEGORY RULES

Category digunakan untuk mengelompokkan Knowledge.

Category harus:

* Memiliki unique slug.
* Tidak duplicate secara semantik tanpa alasan editorial.
* Tidak dihapus jika masih diperlukan oleh published content tanpa proses reassignment.

---

# 37. TAG RULES

Tag bersifat lebih fleksibel daripada Category.

Tag harus:

* Unique.
* Normalized.
* Reusable.

Perbedaan:

```text
Category = structured classification
Tag = flexible descriptive metadata
```

---

# 38. MEDIA OWNERSHIP

Setiap upload media harus memiliki:

```text
uploadedById
```

Media metadata harus disimpan bersama asset.

---

# 39. MEDIA FILE NAMING

Original filename bukan storage identifier.

Storage key harus generated secara aman.

Contoh:

```text
media/{year}/{month}/{generated-id}.webp
```

---

# 40. MEDIA VALIDATION

Server harus memvalidasi:

* File type.
* MIME.
* File signature.
* File size.
* Dimensions untuk image.
* Storage path.

Client-provided MIME type tidak boleh dipercaya sebagai satu-satunya validasi.

---

# 41. MEDIA DELETION

Media tidak boleh dihapus jika masih digunakan oleh published content kecuali proses replacement telah diselesaikan.

Contoh:

```text
Experience.coverMediaId
Knowledge.coverMediaId
Person.imageId
Page.heroMediaId
```

harus diperiksa sebelum deletion.

---

# 42. MEDIA METADATA

Image yang digunakan public sebaiknya memiliki:

```text
altText
```

Alt text wajib untuk media penting yang memiliki fungsi informasional.

Decorative images dapat menggunakan strategi accessibility yang sesuai.

---

# 43. PARTNER RULES

Partner data harus berasal dari source-supported information.

Field:

```text
name
description
logo
website
category
status
order
```

Website hanya boleh menggunakan URL dengan scheme aman seperti:

```text
https://
http://
```

Tidak boleh menyimpan:

```text
javascript:
data:
```

sebagai website URL.

---

# 44. NAVIGATION RULES

Navigation item harus:

* Memiliki language.
* Memiliki order.
* Dapat disembunyikan.
* Tidak menciptakan circular parent relationship.

---

# 45. NAVIGATION URL RULES

Internal navigation sebaiknya menggunakan path:

```text
/about
/experiences
/knowledge
/contact
```

External navigation hanya menggunakan URL aman.

CMS tidak boleh memungkinkan arbitrary JavaScript URL.

---

# 46. NAVIGATION VISIBILITY

Navigation item dengan:

```text
visible = false
```

tidak boleh muncul pada public navigation.

Item parent yang hidden tidak otomatis berarti child dapat ditampilkan sebagai top-level item kecuali struktur navigation secara eksplisit mendukungnya.

---

# 47. CONTACT MESSAGE RULES

Contact message harus memiliki:

```text
name
email
subject
message
```

Optional:

```text
organization
phone
areaOfInterest
```

---

# 48. CONTACT STATUS

Supported statuses:

```text
NEW
READ
IN_PROGRESS
RESOLVED
ARCHIVED
```

Default:

```text
NEW
```

---

# 49. CONTACT ASSIGNMENT

Message dapat diberikan kepada user tertentu.

`assignedToId` hanya boleh menunjuk user yang:

* ACTIVE
* memiliki permission untuk menangani messages

---

# 50. CONTACT PRIVACY

Contact message mengandung data yang berpotensi sensitif.

Data tersebut:

* Tidak boleh muncul pada public API.
* Tidak boleh masuk search index public.
* Tidak boleh muncul pada public logs.
* Tidak boleh dimasukkan secara berlebihan ke audit metadata.

---

# 51. CONTACT NOTIFICATION

Jika email notification diterapkan:

```text
Contact submission
      ↓
Database transaction
      ↓
Notification
```

Kegagalan email notification tidak boleh menyebabkan data contact hilang.

Database adalah source of truth untuk message.

---

# 52. SEARCH RULES

Public search hanya mencari:

```text
PUBLISHED
```

content.

Search tidak boleh mengembalikan:

```text
DRAFT
REVIEW
ARCHIVED
```

---

# 53. SEARCH LANGUAGE

Search harus mempertimbangkan language yang diminta.

Contoh:

```text
language=ID
```

mencari content ID.

```text
language=EN
```

mencari content EN.

---

# 54. SEARCH RESULT TYPES

Search result dapat berasal dari:

```text
Experience
Knowledge
Person
ContributionArea
```

Setiap result harus memiliki:

```text
type
title
slug
excerpt
url
```

dan metadata minimum yang relevan.

---

# 55. SEARCH RELEVANCE

Search relevance harus digunakan untuk membantu menemukan content, tetapi tidak boleh digunakan untuk mengekspos unpublished content.

Urutan hasil ditentukan oleh search implementation.

Tidak ada business rule yang menyatakan bahwa hasil tertentu harus selalu berada di posisi pertama kecuali ditentukan secara editorial.

---

# 56. SEO RULES

Published content harus dapat menghasilkan metadata SEO.

Jika:

```text
seoTitle
```

tersedia, gunakan.

Jika tidak:

```text
title
```

dapat digunakan sebagai fallback.

Hal yang sama berlaku untuk description.

---

# 57. SITEMAP

Sitemap hanya boleh berisi public published URLs.

Tidak boleh memasukkan:

```text
/admin
draft
preview
review
archived content
```

---

# 58. ROBOTS

CMS/admin/preview routes harus tidak diindeks.

Public published content dapat diindeks sesuai konfigurasi SEO.

---

# 59. CACHE INVALIDATION

Setiap mutation yang mempengaruhi public content harus melakukan invalidasi cache yang relevan.

Contoh:

```text
Publish Experience
        ↓
invalidate:
- experience listing
- experience detail
- homepage if featured
- contribution area if relation changed
```

---

# 60. PUBLISHING TRANSACTION

Publish operation harus atomik.

Minimal:

```text
validate
+
update status
+
set publishedAt
+
audit log
```

Jika salah satu operasi kritis gagal, transaksi harus rollback.

---

# 61. UNPUBLISHING

Jika content perlu ditarik dari public website:

```text
PUBLISHED → DRAFT
```

atau:

```text
PUBLISHED → ARCHIVED
```

sesuai keputusan editorial.

Setelah unpublish:

* Public route tidak boleh mengembalikan content.
* Search harus menghapus content dari public result.
* Sitemap harus diperbarui.
* Cache harus di-invalidate.

---

# 62. REVIEW RULES

Review bukan sekadar perubahan status.

Reviewer harus dapat memastikan:

* Content valid.
* Translation sesuai.
* Media valid.
* Links valid.
* Claims memiliki source.
* Metadata cukup.
* Content layak dipublikasikan secara editorial.

---

# 63. SOURCE-GROUNDED CONTENT

Semua factual organizational claims harus memiliki dasar dari source material atau input editorial resmi.

Jangan mengarang:

* Program.
* Partnership.
* Client.
* Impact.
* Project.
* Statistic.
* Award.
* Organizational history.
* Team member.
* Contact information.

Jika informasi belum tersedia:

```text
null
```

atau content tidak dipublikasikan.

---

# 64. CONTENT EDITORIAL CONTROL

AI atau automation boleh membantu:

* Formatting.
* Drafting.
* Categorization suggestion.
* Metadata suggestion.

Tetapi AI tidak boleh menjadi final authority untuk factual organizational claims.

Final published content tetap berada di bawah kontrol manusia yang memiliki permission.

---

# 65. AUDIT RULES

Audit log wajib dibuat untuk operasi penting.

Minimum:

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

---

# 66. AUDIT IMMUTABILITY

Audit log tidak boleh diedit melalui CMS.

Jika koreksi diperlukan, buat event baru.

Jangan mengubah historical audit record untuk menyembunyikan perubahan.

---

# 67. AUDIT DATA

Audit metadata dapat mencatat:

```text
entity
entityId
userId
action
timestamp
requestId
ipAddress
userAgent
```

Jangan menyimpan:

```text
password
session token
API secret
private storage credentials
```

---

# 68. SYSTEM SETTINGS

Site settings dapat mengontrol operational configuration seperti:

* Site title.
* Contact information.
* Social links.
* Public configuration.
* SEO defaults.

Settings tidak boleh digunakan sebagai tempat penyimpanan secrets.

---

# 69. SECRET MANAGEMENT

Secrets harus berada di environment configuration atau secret manager.

Contoh:

```text
DATABASE_URL
AUTH_SECRET
STORAGE_ACCESS_KEY
STORAGE_SECRET_KEY
```

Tidak boleh disimpan di:

```text
SiteSetting
Page.content
Knowledge.content
```

---

# 70. DATABASE INTEGRITY

Business logic harus menjaga:

* Foreign key integrity.
* Unique constraints.
* Translation uniqueness.
* Relation integrity.
* Valid status.
* Valid enum values.

---

# 71. TRANSACTION BOUNDARIES

Gunakan transaction apabila satu business operation mengubah beberapa tabel yang harus konsisten.

Contoh:

```text
Create Knowledge
+
Translations
+
Categories
+
Tags
+
Relations
```

harus diperlakukan sebagai satu logical operation.

---

# 72. CONCURRENT EDITING

Jika dua user mengedit record yang sama, sistem sebaiknya mendeteksi stale data.

Recommended:

```text
client updatedAt
       ↓
server current updatedAt
       ↓
different?
       ↓
409 Conflict
```

User kemudian dapat memilih apakah ingin memuat versi terbaru.

---

# 73. OWNERSHIP RULE

AUTHOR hanya boleh mengedit content miliknya apabila permission tidak secara eksplisit memberikan akses global.

EDITOR dan ADMIN dapat mengedit content lintas author sesuai role.

---

# 74. SELF-ESCALATION PROTECTION

User tidak boleh meningkatkan privilege dirinya sendiri.

Contoh:

```text
AUTHOR → SUPER_ADMIN
```

tidak boleh dilakukan oleh AUTHOR.

Perubahan role harus dilakukan oleh user dengan permission yang sesuai.

---

# 75. SUPER ADMIN PROTECTION

Sistem sebaiknya mencegah kondisi di mana satu-satunya SUPER_ADMIN secara tidak sengaja dinonaktifkan atau kehilangan akses.

Jika hanya terdapat satu SUPER_ADMIN aktif:

```text
disable/delete/demote
```

harus mendapatkan protection tambahan.

---

# 76. PUBLIC DATA SAFETY

Public API tidak boleh mengembalikan:

* Internal IDs jika tidak diperlukan.
* User IDs.
* Audit logs.
* Internal notes.
* Draft content.
* Private contact data.
* Storage credentials.
* Internal implementation metadata.

---

# 77. ERROR SAFETY

Error production tidak boleh mengembalikan:

```text
SQL query
stack trace
database credentials
filesystem path
secret
```

Gunakan generic public error dan simpan detail internal di server logs.

---

# 78. HTTP METHOD RULES

Gunakan:

```text
GET
```

untuk read.

```text
POST
```

untuk create atau explicit action.

```text
PATCH
```

untuk partial update.

```text
DELETE
```

hanya untuk destructive operation yang memang diperbolehkan.

---

# 79. IDEMPOTENCY

Operation yang berpotensi menghasilkan duplicate data dapat mendukung:

```text
Idempotency-Key
```

Contoh:

```text
POST /api/v1/contact
```

Jika request yang sama dikirim ulang karena network retry, server dapat mencegah duplicate submission.

---

# 80. RATE LIMITING RULES

Rate limiting wajib dipertimbangkan untuk:

```text
login
contact
search
media upload
password-related endpoints
```

Admin mutation juga harus memiliki protection terhadap abusive automation.

---

# 81. FILE SIZE POLICY

Upload size harus configurable melalui environment/application configuration.

Contoh konfigurasi:

```text
MAX_IMAGE_UPLOAD_SIZE
MAX_DOCUMENT_UPLOAD_SIZE
MAX_VIDEO_UPLOAD_SIZE
MAX_AUDIO_UPLOAD_SIZE
```

Jangan hard-code limit tersebar di berbagai component.

---

# 82. CONTENT LENGTH

CMS dapat menentukan batas panjang untuk:

* Title.
* Excerpt.
* SEO title.
* SEO description.
* Slug.
* Short labels.

Limit harus didefinisikan di validation schema dan konsisten dengan UI.

---

# 83. RICH TEXT

Rich text yang disimpan di database harus diperlakukan sebagai untrusted input.

Sebelum rendering public:

```text
stored content
      ↓
sanitize
      ↓
render
```

---

# 84. EXTERNAL LINKS

External URLs harus:

* Valid.
* Menggunakan HTTP/HTTPS.
* Tidak mengandung executable schemes.

Jika `openInNewTab = true`, external link sebaiknya menggunakan security attributes yang sesuai.

---

# 85. RELATED CONTENT

Related content hanya boleh menampilkan target yang:

```text
status = PUBLISHED
```

Content archived/draft/review tidak boleh muncul pada public related-content module.

---

# 86. FEATURED CONTENT FALLBACK

Jika homepage meminta featured content tetapi tidak ada content published yang featured:

sistem boleh menampilkan empty state atau editorial fallback yang telah ditentukan.

Jangan otomatis mempromosikan draft.

---

# 87. EMPTY STATES

Public website harus menangani kondisi:

* No experiences.
* No knowledge.
* No search result.
* No people.
* No related content.

Empty state tidak boleh menghasilkan error 500.

---

# 88. CMS EMPTY STATES

CMS harus membedakan:

```text
No data exists
```

dengan:

```text
Permission denied
```

dan:

```text
Server error
```

---

# 89. PUBLIC 404

Jika content:

```text
does not exist
```

atau:

```text
is unpublished
```

public harus menerima perilaku 404 yang konsisten.

Jangan memberi petunjuk bahwa unpublished content sebenarnya ada.

---

# 90. ADMIN 404

Admin dapat menerima informasi lebih detail apabila user memiliki permission.

Contoh:

```text
Experience exists but is archived.
```

Namun detail internal tetap tidak boleh dibocorkan di luar permission scope.

---

# 91. DATABASE DELETION POLICY

Default:

```text
soft state change
```

daripada:

```text
hard delete
```

untuk business content.

Hard delete lebih cocok untuk:

* Temporary data.
* Unused taxonomy tertentu.
* Invalid records sebelum publication.
* Data yang secara eksplisit boleh dihapus.

---

# 92. BACKUP REQUIREMENT

Database harus memiliki backup routine.

Backup minimal mencakup:

```text
MySQL database
```

Media storage harus memiliki backup strategy terpisah jika storage provider tidak menjamin retention yang dibutuhkan.

---

# 93. DATA RECOVERY

Recovery procedure harus dapat mengembalikan:

* Database.
* Content.
* Relationship.
* Media references.

Recovery testing harus dilakukan secara berkala pada production operations.

---

# 94. DEPLOYMENT RULE

Migration database harus menggunakan migration system.

Recommended:

```text
Prisma Migrate
```

Jangan mengubah production schema secara manual tanpa migration record kecuali emergency procedure yang terdokumentasi.

---

# 95. SEED DATA

Seed hanya boleh memasukkan data yang:

* Diketahui benar.
* Bersumber dari source material.
* Dibutuhkan untuk initial application state.

Jangan membuat fake:

* Projects.
* Partners.
* People.
* Metrics.
* Testimonials.
* Statistics.

---

# 96. DEVELOPMENT DATA

Dummy data untuk development harus jelas dipisahkan dari production seed.

Contoh:

```text
development fixture
```

tidak boleh masuk production database secara otomatis.

---

# 97. PRODUCTION CONTENT RULE

Production content harus dapat ditelusuri ke:

```text
source material
atau
editorial input resmi
```

Content yang belum diverifikasi harus tetap:

```text
DRAFT
```

atau:

```text
REVIEW
```

---

# 98. ACCESSIBILITY BUSINESS RULE

CMS content harus mendukung accessibility.

Minimal:

* Images memiliki alt text bila informasional.
* Links memiliki meaningful labels.
* Heading hierarchy dapat dipertahankan.
* Content tidak bergantung hanya pada color.
* Forms memiliki labels.

---

# 99. SEO BUSINESS RULE

Published content harus memiliki metadata minimum yang sesuai entity.

Contoh:

```text
title
description
canonical URL
```

Open Graph image bersifat optional tetapi dapat digunakan jika tersedia.

---

# 100. ANALYTICS RULE

Jika analytics ditambahkan:

* Jangan mengirim data contact message ke analytics.
* Jangan mengirim password/email private ke analytics.
* Tracking harus mengikuti privacy requirements yang berlaku.
* Analytics tidak boleh memblokir core website functionality.

---

# 101. PERFORMANCE RULE

Public pages harus mengutamakan:

* Server rendering.
* Caching.
* Optimized images.
* Pagination.
* Minimal database queries.
* Avoiding unnecessary client-side fetching.

CMS dapat menggunakan client-side interaction jika meningkatkan UX.

---

# 102. DATABASE QUERY RULE

Hindari N+1 queries.

Gunakan Prisma relation loading secara terkontrol.

Jangan mengambil:

```text
SELECT *
```

secara tidak perlu pada public API.

Pilih field yang benar-benar dibutuhkan.

---

# 103. PUBLIC API DATA SHAPING

Database model tidak otomatis menjadi API response.

Gunakan DTO/serializer.

Contoh:

```text
Database User
    ↓
Public DTO
    ↓
Only safe fields
```

Ini mencegah accidental data exposure.

---

# 104. ADMIN API DATA SHAPING

Admin dapat menerima lebih banyak field dibanding public API, tetapi tetap tidak boleh menerima:

```text
passwordHash
secrets
session tokens
```

kecuali benar-benar dibutuhkan oleh internal security mechanism dan tidak ditampilkan ke UI.

---

# 105. BUSINESS RULE PRIORITY

Jika terdapat konflik antara:

```text
UI behavior
API behavior
database convenience
```

business rules ini dan security requirements harus diprioritaskan.

---

# 106. CONFLICT RESOLUTION

Jika dua business rules terlihat bertentangan:

1. Security requirement.
2. Data integrity.
3. Authorization.
4. Publishing workflow.
5. Editorial rule.
6. UI convenience.

Urutan tersebut menjadi prioritas implementasi.

---

# 107. RULE FOR UNKNOWN DATA

Jika data organisasi tidak diketahui:

```text
DO NOT INVENT
```

Gunakan:

```text
null
```

atau jangan publish content tersebut.

---

# 108. RULE FOR UNCERTAIN CLAIMS

Jika sebuah statement membutuhkan verifikasi:

```text
DRAFT / REVIEW
```

sampai editor dapat memverifikasinya.

Jangan mengubah uncertainty menjadi factual statement secara otomatis.

---

# 109. FINAL BUSINESS RULE CHECKLIST

Sebelum feature dianggap selesai, pastikan:

### Authentication

* [ ] Login aman.
* [ ] Session aman.
* [ ] Inactive user tidak dapat login.
* [ ] Logout bekerja.

### Authorization

* [ ] Role diperiksa server-side.
* [ ] Author tidak dapat publish.
* [ ] Role escalation dicegah.
* [ ] Super Admin operations terlindungi.

### Content

* [ ] Draft tidak public.
* [ ] Review tidak public.
* [ ] Published dapat public.
* [ ] Archived tidak public.
* [ ] Publish validation aktif.

### Multilingual

* [ ] ID dan EN independen.
* [ ] Tidak ada silent translation.
* [ ] Fallback eksplisit.

### Media

* [ ] Upload divalidasi.
* [ ] File reference diperiksa.
* [ ] Unsafe files ditolak.
* [ ] Metadata aman.

### Search

* [ ] Hanya published content.
* [ ] Language filter bekerja.
* [ ] Draft tidak bocor.

### Contact

* [ ] Validation aktif.
* [ ] Rate limiting aktif.
* [ ] Data tidak public.
* [ ] Status workflow bekerja.

### Audit

* [ ] Mutation tercatat.
* [ ] Publish tercatat.
* [ ] Role changes tercatat.
* [ ] Audit tidak dapat diedit.

### Database

* [ ] Foreign keys valid.
* [ ] Unique constraints valid.
* [ ] Transactions digunakan jika diperlukan.
* [ ] Backup tersedia.

---

# 110. FINAL PRINCIPLE

ANTRABUMI CMS harus memperlakukan content sebagai **editorially controlled organizational knowledge**, bukan sekadar database records.

Arsitektur harus memastikan:

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

Bukan:

```text
AI / USER INPUT
      ↓
DATABASE
      ↓
PUBLIC
```

Semua fakta organisasi, pengalaman, people, partnership, impact, angka, dan klaim publik harus memiliki dasar yang dapat dipertanggungjawabkan sebelum dipublikasikan.

**END OF BUSINESS_RULES.md**
