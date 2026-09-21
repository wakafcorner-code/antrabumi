# ANTRABUMI — Organizational Profile &amp; Knowledge Hub

> **"Connecting Knowledge, Nature, & Communities."**

ANTRABUMI is an independent organization working at the intersection of knowledge, nature, and communities. This repository contains the full-stack web application and content management system built with Next.js App Router, React, TypeScript, and Tailwind CSS.

---

## 1. Project Documentation & Hierarchy

Pengembangan sistem wajib mematuhi dokumen spesifikasi dengan hierarki resolusi konflik sebagai berikut:

```text
BUSINESS_RULES.md
        ↓
CONTENT_STRUCTURE.md
        ↓
DESIGN_SYSTEM.md
        ↓
DEVELOPMENT_PLAN.md
        ↓
Implementation Code
```

- [BUSINESS_RULES.md](file:///d:/antra_bumi/BUSINESS_RULES.md) — Aturan bisnis inti, peran hak akses, alur publishing, dan integritas data.
- [CONTENT_STRUCTURE.md](file:///d:/antra_bumi/CONTENT_STRUCTURE.md) — Struktur entitas konten, skema bilingual (ID/EN), dan metadata.
- [DESIGN_SYSTEM.md](file:///d:/antra_bumi/DESIGN_SYSTEM.md) — Sistem visual, design tokens, tipografi, aksesibilitas, dan pedoman komponen.
- [DEVELOPMENT_PLAN.md](file:///d:/antra_bumi/DEVELOPMENT_PLAN.md) — Rencana tahapan implementasi teknis dari Phase 0 hingga Production Launch.

---

## 2. Phase 0 Foundation Status

Fase ini memfokuskan implementasi pada fondasi arsitektur bersih, aman, dan scalable sebelum melangkah ke Phase 1 (Database & Prisma):

- [x] Next.js App Router (Server Components sebagai default).
- [x] Strict TypeScript configuration (zero `any`).
- [x] Centralized Design Tokens (`src/styles/tokens.css`, `utilities.css`, `globals.css`).
- [x] Responsive layout & grid system (Desktop: 12-col, Tablet: 8-col, Mobile: 4-col).
- [x] Accessible Base UI Components (`Button`, `Container`, `Heading`, `Text`, `Badge`, `Grid`).
- [x] WCAG 2.2 AA accessibility (visible focus ring, skip link, semantic HTML, `prefers-reduced-motion`).
- [x] Public Layout & Structural Admin Layout Shell (`/admin`).
- [x] Error handling & loading boundaries (`not-found.tsx`, `error.tsx`, `global-error.tsx`, `loading.tsx`).
- [x] Environment schema validation via Zod (`src/lib/config/env.ts`).
- [x] Security headers configuration (CSP, X-Content-Type-Options, Referrer-Policy, HSTS).
- [x] Automated Testing (Vitest + React Testing Library) & CI workflow (`.github/workflows/ci.yml`).
- [x] Zero fake organizational data (source documents respected).

---

## 3. Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (`strict: true`)
- **UI:** React (Server Components by default)
- **Styling:** Tailwind CSS + CSS Variables Design Tokens
- **Icons:** Lucide Icons
- **Validation:** Zod
- **Unit Testing:** Vitest, React Testing Library, JSDOM
- **Linting & Formatting:** ESLint, Prettier

---

## 4. Project Directory Structure

```text
src/
├── app/
│   ├── (public)/              # Public website routes
│   │   ├── layout.tsx         # Header, Main, Footer shell
│   │   └── page.tsx           # Foundation homepage & design system test
│   ├── admin/                 # CMS Admin workspace shell (auth deferred to Phase 2/3)
│   │   ├── layout.tsx         # Sidebar shell & workspace header
│   │   └── page.tsx           # Admin placeholder overview
│   ├── api/
│   │   └── health/route.ts    # Health check endpoint
│   ├── layout.tsx             # Root layout with font abstraction & skip link
│   ├── globals.css            # Base styles & CSS resets
│   ├── not-found.tsx          # 404 page
│   ├── error.tsx              # Segment error boundary
│   ├── global-error.tsx       # Root error boundary
│   └── loading.tsx            # Accessible loading indicator
│
├── components/
│   ├── ui/                    # Base design system primitives (Button, Container, etc.)
│   ├── layout/                # Layout shells (Header, Footer)
│   └── admin/                 # Admin sidebar & admin components
│
├── lib/
│   ├── config/                # Environment parsing & validation (env.ts)
│   └── utils/                 # General helpers (cn.ts)
│
├── styles/
│   ├── tokens.css             # Single source of truth for design tokens
│   └── utilities.css          # Accessible focus, skip link, and type scales
│
└── types/                     # Shared TypeScript interfaces & types
```

---

## 5. Prerequisites & Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0

### Installation

```bash
# Clone the repository and install dependencies
npm install
```

### Environment Configuration

Salin berkas konfigurasi template:

```bash
cp .env.example .env.local
```

Untuk Phase 0, variabel lokal telah terisi dengan nilai default (`APP_URL=http://localhost:3000`).

---

## 6. Available Scripts

| Script                 | Deskripsi                                                         |
| :--------------------- | :---------------------------------------------------------------- |
| `npm run dev`          | Menjalankan Next.js development server di port 3000               |
| `npm run build`        | Membuat production build aplikasi                                 |
| `npm run start`        | Menjalankan production server hasil build                         |
| `npm run lint`         | Menjalankan ESLint untuk pemeriksaan kode                         |
| `npm run typecheck`    | Menjalankan TypeScript compiler check tanpa emit (`tsc --noEmit`) |
| `npm run format`       | Menjalankan Prettier untuk memformat semua berkas                 |
| `npm run format:check` | Memvalidasi kepatuhan format Prettier tanpa mengubah berkas       |
| `npm run test`         | Menjalankan unit test dengan Vitest                               |
| `npm run test:watch`   | Menjalankan unit test dalam watch mode interaktif                 |

---

## 7. Design Tokens & Color Strategy

Sesuai `DESIGN_SYSTEM.md`, nilai hex warna brand utama saat ini menggunakan **provisional values** yang ditandai secara jelas di `src/styles/tokens.css`. Seluruh komponen menggunakan semantic token seperti `var(--color-primary)` atau utility Tailwind `bg-primary`, sehingga pembaruan palet brand resmi di masa mendatang dapat dilakukan di satu tempat tanpa perlu mengubah komponen antarmuka.

---

## 8. Development Roadmap

- **Phase 0: Foundation (Current)** — Arsitektur dasar, design tokens, base UI, layout, dan CI.
- **Phase 1: Database & ORM** — PostgreSQL/MySQL database modeling via Prisma.
- **Phase 2: Authentication & RBAC** — Auth.js server sessions & permission guards.
- **Phase 3: CMS Content Engine** — Manajemen konten dinamis, state workflow, dan media library.
- **Phase 4+: Public Sections & Refinements** — Implementasi halaman publik, SEO, dan optimasi performa.
