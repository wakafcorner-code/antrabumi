# Authentication Compatibility for a Future Data Import

Status: compatibility implemented and verified with synthetic in-memory hashes only. No database was accessed or changed by the compatibility test.

## Source Format

The source has two User rows. Both stored hashes are bcrypt-format `$2b$12$` strings of length 60. The source Next.js password helper uses `bcryptjs` with 12 rounds. No plaintext passwords or raw hash values are recorded here.

## Previous Laravel Behavior

- The default guard is Laravel's session guard and the user provider was the standard Eloquent provider.
- `User::getAuthPasswordName()` maps authentication to `passwordHash`.
- The model previously used Laravel's `hashed` cast on `passwordHash`.
- Effective hash config is bcrypt, 12 rounds, `bcrypt.verify=true`, and `rehash_on_login=true`.
- Runtime inspection confirmed those effective hash settings. The login controller regenerates the session after successful authentication; inactive-user handling logs out, invalidates the session, and regenerates the CSRF token. Active-user middleware applies the same invalidation behavior if a user's status changes later.
- Laravel's BcryptHasher strict algorithm check calls `password_get_info()`. PHP reports source `$2b$` hashes as an unknown algorithm, so `Hash::check()` threw `This password does not use the Bcrypt algorithm.` before password verification. PHP's native `password_verify()` accepts the `$2b$` format, but the default strict Laravel check did not reach it.
- Laravel's standard Eloquent provider calls `rehashPasswordIfRequired()` after successful validation. With unknown `$2b$` hashes, automatic rehashing is unsafe/unpredictable if compatibility is globally relaxed.
- Eloquent mass assignment also guards the User `id`; ordinary `User::create()` is not an import-safe way to preserve source IDs. The model cast must not rehash an imported hash.

## Compatibility Mechanism Implemented

- The `users` auth provider now uses `LegacyCompatibleUserProvider`, registered by `AppServiceProvider`. The global bcrypt driver and `bcrypt.verify=true` setting are unchanged.
- That provider recognizes only a 60-character, cost-12 bcrypt hash matching `^\$2b\$12\$[./A-Za-z0-9]{53}$`. For that exact source format only, it calls PHP `password_verify()`. All other hash formats continue through Laravel's standard strict hasher.
- The provider skips automatic rehash for the recognized legacy format. `SessionGuard` still performs its normal post-validation rehash hook, but this provider deliberately leaves `$2b$12$` values untouched.
- `PasswordHashCast` preserves recognized source hashes and hashes new plaintext values using `Hash::make()`. Already-recognized Laravel hashes are preserved, preventing double hashing.
- Login controller behavior is otherwise unchanged: `Auth::attempt()` uses the configured provider, session ID is regenerated after login, inactive users are logged out and their session invalidated, and active/role middleware remain in place.

This avoids weakening password verification globally: only the known source bcrypt variant receives the PHP-native verification path. No hash prefix conversion or database-side hash update is performed.

## ID and Import Handling

`UsesStringPrimaryKey` generates a ULID only when no key is already set, but the User model's mass-assignment rules do not allow ordinary assignment of `id`. A future importer must use raw query-builder inserts or a separately reviewed raw-attribute path to preserve source CUIDs and hashes. Do not use `User::create()` with the source `passwordHash`; do not invoke the hashed cast as an import transformation. No importer is included in this change.

## Synthetic Verification

`tests/Unit/LegacyBcryptAuthenticationTest.php` creates a synthetic bcrypt hash in memory, changes only its prefix to the source `$2b$12$` format, and verifies:

- The hash is 60 characters and has the expected source prefix.
- PHP `password_verify()` accepts the correct synthetic password.
- `LegacyCompatibleUserProvider` accepts the correct password and rejects an incorrect one.
- The provider's rehash hook leaves the legacy hash unchanged.
- The User cast preserves the legacy hash without double hashing.
- A new plaintext password is hashed with Laravel's configured bcrypt hasher and validates with `Hash::check()`.
- A supplied synthetic CUID remains unchanged on the in-memory User.

The focused test passed: 2 tests, 12 assertions. The test does not use `RefreshDatabase`, query any DB, or contain real credentials. Real-user authentication still requires a separately authorized staging check with a known test account.

Read-only validation also confirmed the registered auth provider configuration, Laravel's effective hashing config, the login/media route registration, and PHP syntax for the compatibility classes and User model. No database connection or source credential was used by these checks.

## New Passwords and Rehash Policy

New plaintext passwords continue through `Hash::make()` with the existing bcrypt driver and 12 rounds. They use PHP/Laravel's normal bcrypt format and strict verification; global hashing configuration was not weakened.

Legacy `$2b$12$` hashes are not automatically rehashed on login. After a staging test with an authorized account and an approved backup/rollback, a later release may deliberately re-enable migration of those hashes on successful login. That future change should be explicit, auditable, and limited to the Laravel target. Do not edit source hashes or bulk-convert hashes during import without separate approval.

## Rollback Strategy

- This change does not touch user rows, passwords, APP_KEY, or sessions.
- If the code/config change is reverted before importing users, the database state is unaffected. The standard Laravel provider will again reject source `$2b$` hashes; do not expect imported users to authenticate under that rollback.
- If legacy users have been imported later, retain this compatibility provider for rollback releases. Revert application code only after an explicit target-only password migration strategy has been completed and verified. Never revert by changing source hashes or resetting passwords.
- Laravel session cookies remain separate from the source application's sessions; rollback/cutover must account for re-login.

## Import Readiness

Password compatibility remains verified with synthetic in-memory hashes. The Laravel media resolver is also covered by isolated tests; combined status is **READY-FOR-TEST-IMPORT**. This does not verify or assume a source upload directory: its source-host path remains UNKNOWN/pending confirmation as documented in `MEDIA_MIGRATION_PLAN.md`. No database, source file, APP_KEY, or Next.js application was modified for the media resolver work.