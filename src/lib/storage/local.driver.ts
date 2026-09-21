/**
 * src/lib/storage/local.driver.ts
 *
 * Local filesystem storage driver for development and local testing.
 * Writes uploaded assets to public/uploads directory.
 */

import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { StorageDriver, StorageResult } from "./types";

export class LocalStorageDriver implements StorageDriver {
  private uploadDir: string;

  constructor(uploadDir?: string) {
    this.uploadDir =
      uploadDir ?? path.join(process.cwd(), "public", "uploads");
  }

  private async ensureDir(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  private sanitizeFilename(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const base = path
      .basename(filename, ext)
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .substring(0, 50);

    const randomSuffix = crypto.randomBytes(4).toString("hex");
    return `${Date.now()}-${base}-${randomSuffix}${ext}`;
  }

  async upload(
    fileBuffer: Buffer,
    filename: string,
    mimeType: string
  ): Promise<StorageResult> {
    await this.ensureDir();

    const storageKey = this.sanitizeFilename(filename);
    const destinationPath = path.join(this.uploadDir, storageKey);

    await fs.writeFile(destinationPath, fileBuffer);

    return {
      storageKey,
      url: this.getUrl(storageKey),
      size: fileBuffer.length,
      mimeType,
    };
  }

  async delete(storageKey: string): Promise<void> {
    const safeKey = path.basename(storageKey);
    const targetPath = path.join(this.uploadDir, safeKey);

    try {
      await fs.unlink(targetPath);
    } catch (err: unknown) {
      if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
        throw err;
      }
    }
  }

  getUrl(storageKey: string): string {
    const safeKey = path.basename(storageKey);
    return `/uploads/${safeKey}`;
  }
}
