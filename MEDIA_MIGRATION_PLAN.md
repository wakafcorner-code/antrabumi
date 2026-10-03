# Media Migration Plan

Status: **READY-FOR-TEST-IMPORT** for the Laravel media compatibility path only. No database was accessed, and no source or destination media files were opened, copied, moved, renamed, hashed, or deleted for this task. The source-host upload path remains unknown and must be confirmed before any transfer.

## Verified

- Workspace: `C:\xampp\htdocs\antrabumi`. The workspace-root candidate `public/uploads` exists; this only verifies a local directory, not that it is the authoritative source-host location. Workspace-root `uploads` does not exist.
- Laravel public disk is configured with driver `local`, root `storage_path('app/public')`, and URL prefix `APP_URL/media-file`. Its effective media destination for legacy basename keys is `laravel/storage/app/public/uploads/<storageKey>`.
- Laravel's configured storage link maps `laravel/public/storage` to `laravel/storage/app/public`. In this workspace, `laravel/public/storage` is a normal directory, not a symlink. No symlink was created.
- The existing `/media-file/{path}` route remains registered. A compatibility route now accepts `/uploads/{path}` and streams only media registered in the `Media` table.
- `MediaStorageKeyResolver` maps a legacy basename such as `photo.jpg` to the public-disk-relative key `uploads/photo.jpg`; an existing key already beginning `uploads/` is unchanged. Database `Media.url` and `Media.storageKey` values are not rewritten by this resolver.
- Public Blade templates currently do not render `Media.url`. The admin media API returns the stored URL unchanged. Image, gallery, cover, avatar, logo, and download relationships reference Media IDs and are not changed by URL resolution.

## Assumed

- Future cPanel deployment exposes Laravel's `public` directory and routes missing paths through Laravel's front controller. Under that setup the legacy `/uploads/...` URL is handled by Laravel, and file bytes are read from the configured public disk.
- If cPanel permits a symlink, the configured `storage:link` target implies `public/storage/uploads/...` maps to `storage/app/public/uploads/...`. The legacy `/uploads/...` URL does not depend on that symlink; the Laravel route streams through the public disk.

## To Verify During Import

- **Source-host path: UNKNOWN.** Confirm the authoritative directory from the source host/operator. Do not infer it from the workspace candidate or configure a hard-coded absolute path.
- Confirm the source `storageKey` manifest matches files under the confirmed source root, including missing, extra, and duplicate-key cases.
- Confirm cPanel document-root/rewrite behavior, PHP read permissions, whether symlinks are permitted, and that no static file in `public/uploads` shadows the Laravel compatibility route.
- Generate and compare the SHA-256 manifest before marking any transferred media verified.

## Preserve Keys, IDs, Relationships, and URL Mapping

- Preserve every source `Media.id` and every foreign-key value exactly. Never create replacement media IDs or rewrite content/pivot IDs.
- Preserve source `storageKey` exactly as the basename, for example `<original-key>`. Do not prepend `uploads/` in the database.
- Preferred destination for a later controlled transfer: `laravel/storage/app/public/uploads/<original-storageKey>`. The resolver maps the unchanged basename storage key to that public-disk-relative key.
- Preserve the source `Media.url` value `/uploads/<original-storageKey>`. The new `/uploads/{path}` route resolves that URL without rewriting the database value. Existing Laravel uploads retain their `/media-file/uploads/...` URL and `uploads/...` storage key.
- Resolution requires a matching Media row and reads only through `Storage::disk('public')`; it does not expose arbitrary filesystem paths. The resolver rejects absolute paths, traversal segments, backslashes, control characters, and empty keys. No Blade URL rewriting is needed.
- Existing source relationships to preserve include `User.imageId`, `Page.heroMediaId`, `Page.ogImageId`, `ContributionAreaTranslation.imageId`, `Experience.coverMediaId`, `ExperienceMedia`, `Person.imageId`, `Knowledge.coverMediaId`, `KnowledgeMedia`, `KnowledgeDownload.mediaId`, and `Partner.logoMediaId`.
- Current relationship counts: User images 0; Page hero/OG 0; contribution-area translation images 0; Experience cover 1 and gallery 1; Person image 1; Knowledge covers 2, gallery 3, downloads 2; Partner logos 0. The same Media ID may appear in more than one relationship.

## Copy and Checksum Procedure

Before copying, produce a manifest from source Media rows containing `id`, `storageKey`, source `size`, `mimeType`, and source URL. Do not include passwords, audit metadata, or content bodies. Compare the source key set to the file set; exclude repository marker files such as `.gitkeep`.

For each key, calculate source byte count and SHA-256 and record them in the manifest. Copy bytes without recompression or renaming to `laravel/storage/app/public/uploads/<storageKey>`. Then calculate destination byte count and SHA-256. Only accept an item when byte counts and SHA-256 values are identical. These are future-only examples; set `$sourceRoot` only after confirming the source host path:

```powershell
$laravelPublicDiskRoot = '<Laravel project>/storage/app/public'
$storageKey = '<source-storageKey>'
$sourcePath = Join-Path $sourceRoot $storageKey
$destinationPath = Join-Path (Join-Path $laravelPublicDiskRoot 'uploads') $storageKey
Get-Item -LiteralPath $sourcePath | Select-Object Length
Get-FileHash -LiteralPath $sourcePath -Algorithm SHA256
Copy-Item -LiteralPath $sourcePath -Destination $destinationPath
Get-Item -LiteralPath $destinationPath | Select-Object Length
Get-FileHash -LiteralPath $destinationPath -Algorithm SHA256
```

```sh
wc -c -- "$source_path" "$destination_path"
sha256sum -- "$source_path" "$destination_path"
```

Record a manifest with Media ID, unchanged `storageKey`, source/destination path, source/destination byte count, source/destination SHA-256, and verification status. The order is source hash manifest -> copy -> destination hash -> compare -> mark verified. These commands are for a separately approved transfer only; this task did not execute them or generate a manifest.

## Missing and Duplicate Files

- If a DB row has no corresponding source file, stop that media item and report the Media ID/key. Do not insert a fabricated file, silently skip the record, or publish content with a broken file relationship. Resolve from an authoritative backup first.
- If a source file has no Media row, report it as an extra and do not import it automatically.
- Before transfer, query for duplicate `storageKey` values. If multiple rows share one key with identical file bytes, copy the physical object once while preserving all Media IDs and FKs; verify URL resolution is unambiguous. If the same key resolves to different file content or size, stop for manual resolution. Do not silently overwrite.
- Same-content files under different keys should retain their distinct source keys unless a separately approved deduplication plan exists.

## File Permissions and Public Serving

- Keep files under Laravel's configured public disk root and preserve relative keys. Make storage readable by the PHP/web-server account with least privilege; avoid `777` permissions. Restrict write access to the deployment/runtime owner.
- Expected cPanel layout, subject to host verification: Laravel private project storage at `storage/app/public/uploads/`; optional public symlink `public/storage/` -> `storage/app/public/`, giving public filesystem path `public/storage/uploads/`. The configured public disk root and link mapping were verified in `config/filesystems.php`; actual hosting symlink policy was not.
- Preferred legacy URL serving is the Laravel `/uploads/{path}` route, which streams a Media-record-backed object from the configured public disk and does not require a symlink. Confirm Apache rewrite/front-controller routing reaches Laravel, the route is not shadowed by static files, and the PHP account can read the storage directory.
- Do not create a symlink until the host supports it and deployment approves it. Do not expose the project root or `.env` as the document root. Do not switch to `public/uploads` without an explicit storage adapter and access-control review.

## Rollback

- Keep source files immutable and retain the source manifest/backup.
- Before a future copy, snapshot the Laravel target database and record the exact target paths created by the transfer.
- On rollback, route traffic back to the previous application, restore the target DB snapshot if target Media rows were imported, and remove/quarantine only the target files listed in the transfer manifest after verifying they are not shared with other target records.
- Never delete, move, or overwrite source files during rollback. Do not remove a target file based only on filename if other Media rows reference the same key.

## Readiness Gate

Media compatibility is **READY-FOR-TEST-IMPORT**: isolated resolver/path-traversal tests pass, the legacy and existing media routes resolve, no DB was modified, no source files were modified, and the source-host path is explicitly recorded as UNKNOWN/pending verification. This status is not authorization to copy files or import data. Source path confirmation, target backup, and the future checksum comparison remain mandatory before media transfer.