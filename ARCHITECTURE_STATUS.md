# ANTRABUMI Laravel Target

Laravel 12 migration architecture lives in this subdirectory so the existing Next.js application remains available as the reference implementation.

## Requirements

- PHP 8.3+
- Composer 2+
- MySQL 8+ (SQLite is configured only for local tests)
- Node.js/npm for compiling Tailwind/Vite assets

## Local setup

```bash
composer install
cp .env.example .env
php artisan key:generate
npm install
npm run build
php artisan storage:link
php artisan serve
```

Configure MySQL values in this subproject's `.env`. Never copy credentials into source control.

## Validation

```bash
composer validate --no-check-publish
php artisan route:list
php artisan test
npm run build
```

Migration smoke tests should use a disposable SQLite/database instance. Do not run `php artisan migrate` against a shared/existing ANTRABUMI database until the Prisma enum/data discrepancy in `../MIGRATION_ANALYSIS.md` has been reconciled and a verified backup exists. The Laravel migration files describe the target schema; they do not migrate or import existing data.

## Current scope

Implemented foundation and verified migration slices: Laravel 12 bootstrap, MySQL-oriented target migrations for all current Prisma models, Eloquent relationships, PHP enums, session login/logout/current-user flow, active-user and role middleware, health/contact/media upload endpoints, upload signature/name validation, Laravel storage service and no-symlink media fallback, responsive shared Blade shell/navigation, database-backed admin dashboard metrics and recent activity, and Experience create/edit/update/status/delete workflows with bilingual translations and audit logging. These slices are covered by in-memory SQLite feature tests; see `../MIGRATION_STATUS.md` and `../FINAL_MIGRATION_REPORT.md` for current status and verification.

Not yet migrated: full public page content/design, Initiative/Knowledge/People/Partner/User/Settings/Message CRUD workflows, hero/home-content editor workflows, public API query implementations (except health/contact), image gallery management, cPanel-specific upload-limit/permission verification and storage-delete compensation, full search/filter/pagination/report parity, data/file importer, and end-to-end production deployment. Placeholder routes return a visible migration notice or HTTP 501 and do not mutate data.

Uploaded media is stored on Laravel's `public` disk at `storage/app/public`; `php artisan storage:link` exposes it through `public/storage`. Back up these files separately from MySQL.
