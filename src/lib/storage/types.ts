/**
 * src/lib/storage/types.ts
 *
 * Pluggable Storage Driver interface for ANTRABUMI media management.
 */

export interface StorageResult {
  storageKey: string;
  url: string;
  size: number;
  mimeType: string;
}

export interface StorageDriver {
  upload(
    fileBuffer: Buffer,
    filename: string,
    mimeType: string
  ): Promise<StorageResult>;

  delete(storageKey: string): Promise<void>;

  getUrl(storageKey: string): string;
}
