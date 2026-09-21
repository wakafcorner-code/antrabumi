import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { LocalStorageDriver } from "../local.driver";
import fs from "fs/promises";
import path from "path";
import os from "os";

describe("LocalStorageDriver", () => {
  let tempDir: string;
  let driver: LocalStorageDriver;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "antrabumi-test-storage-"));
    driver = new LocalStorageDriver(tempDir);
  });

  afterEach(async () => {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch {
      // ignore cleanup errors
    }
  });

  it("uploads a buffer and writes file to disk", async () => {
    const buffer = Buffer.from("Hello Antrabumi Storage");
    const result = await driver.upload(buffer, "test-document.pdf", "application/pdf");

    expect(result.size).toBe(buffer.length);
    expect(result.mimeType).toBe("application/pdf");
    expect(result.url).toContain(result.storageKey);

    const writtenContent = await fs.readFile(path.join(tempDir, result.storageKey));
    expect(writtenContent.toString()).toBe("Hello Antrabumi Storage");
  });

  it("deletes an uploaded file", async () => {
    const buffer = Buffer.from("File to delete");
    const uploadRes = await driver.upload(buffer, "delete-me.txt", "text/plain");

    await driver.delete(uploadRes.storageKey);

    const exists = await fs
      .access(path.join(tempDir, uploadRes.storageKey))
      .then(() => true)
      .catch(() => false);
    expect(exists).toBe(false);
  });

  it("generates correct public URL", () => {
    const url = driver.getUrl("sample-image.jpg");
    expect(url).toBe("/uploads/sample-image.jpg");
  });
});
