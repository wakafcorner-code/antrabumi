# ANTRABUMI — Database Backup & Disaster Recovery Strategy

**Document Version:** 1.0  
**Target Engine:** MySQL 8+  
**Target Environment:** Linux VPS (Nginx + Node.js + MySQL)  
**Source of Truth:** DATABASE_SCHEMA.md §43 & §48

---

## 1. Overview

The ANTRABUMI application data architecture consists of two tightly coupled components:

1. **Relational Database (MySQL 8+):** Structured organizational records, user credentials, multilingual content, CMS pages, and audit trails.
2. **Media Storage (Local filesystem / S3-compatible Object Storage):** Media assets referenced by the `Media` entity in MySQL via `storageKey`.

> [!IMPORTANT]
> A database backup alone without media asset backup will cause broken media references. Backups of MySQL and Media must be synchronized or executed as part of the same scheduled snapshot.

---

## 2. Backup Schedule & Retention Policy

| Type                                     | Frequency           | Retention Window | Storage Location                  |
| ---------------------------------------- | ------------------- | ---------------- | --------------------------------- |
| **Full DB Dump (`mysqldump`)**           | Daily at 02:00 UTC  | 30 days          | Off-site encrypted backup storage |
| **Weekly Archive**                       | Sunday at 03:00 UTC | 12 weeks         | Off-site cold storage             |
| **Monthly Snapshot**                     | 1st of every month  | 12 months        | Long-term compliance archive      |
| **Media Library Sync (`rsync`/S3 sync)** | Daily at 03:30 UTC  | Versioned        | S3 / Remote backup server         |

---

## 3. Automated Backup Procedures

### 3.1 Daily MySQL Backup Script (`backup-db.sh`)

```bash
#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR="/var/backups/antrabumi/db"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_NAME="antrabumi"
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql.gz"

mkdir -p "${BACKUP_DIR}"

# Perform dump with single-transaction (consistent InnoDB read)
mysqldump \
  --single-transaction \
  --quick \
  --routines \
  --triggers \
  --default-character-set=utf8mb4 \
  -u "${DB_USER}" -p"${DB_PASSWORD}" "${DB_NAME}" | gzip -9 > "${BACKUP_FILE}"

# Set secure permissions (owner-only read)
chmod 600 "${BACKUP_FILE}"

# Delete backups older than 30 days
find "${BACKUP_DIR}" -type f -name "${DB_NAME}_*.sql.gz" -mtime +30 -delete

echo "[$(date)] Backup completed: ${BACKUP_FILE}"
```

### 3.2 Media Asset Sync

```bash
#!/usr/bin/env bash
set -euo pipefail

MEDIA_SRC="/var/www/antrabumi/uploads"
BACKUP_DEST="user@backup-host:/var/backups/antrabumi/media"

# Sync media directory with delete protection on backup
rsync -avz --delete "${MEDIA_SRC}/" "${BACKUP_DEST}/"
```

---

## 4. Restoration Procedure

### 4.1 Database Restore

To restore the database from an encrypted gzip backup:

```bash
# 1. Stop the application service to prevent incoming writes
sudo systemctl stop antrabumi

# 2. Extract and import the SQL dump
gunzip < /var/backups/antrabumi/db/antrabumi_YYYYMMDD_HHMMSS.sql.gz | mysql -u antrabumi -p antrabumi

# 3. Apply any newer pending Prisma migrations
cd /var/www/antrabumi
npx prisma migrate deploy

# 4. Restart application
sudo systemctl start antrabumi
```

### 4.2 Point-In-Time Recovery (PITR)

To support Point-In-Time Recovery:

1. Ensure MySQL binary logging is enabled in `/etc/mysql/my.cnf`:
   ```ini
   [mysqld]
   log-bin=mysql-bin
   binlog_format=ROW
   expire_logs_days=14
   max_binlog_size=100M
   ```
2. Apply the latest full dump, then replay binary logs up to the exact target timestamp using `mysqlbinlog`.

---

## 5. Migration History Integrity

- All migrations are tracked via Prisma in the `_prisma_migrations` table and the `prisma/migrations/` repository folder.
- Before executing `npx prisma migrate deploy` in production, create an on-demand pre-migration snapshot:
  ```bash
  mysqldump --single-transaction -u antrabumi -p antrabumi | gzip > "/var/backups/antrabumi/db/pre_migration_$(date +%Y%m%d%H%M%S).sql.gz"
  ```
