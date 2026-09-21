/**
 * src/lib/storage/index.ts
 *
 * Central storage singleton.
 */

import { StorageDriver } from "./types";
import { LocalStorageDriver } from "./local.driver";

let driver: StorageDriver;

export function getStorageDriver(): StorageDriver {
  if (!driver) {
    // Default to local disk storage driver for development & VPS deployments
    driver = new LocalStorageDriver();
  }
  return driver;
}

export const storage = getStorageDriver();
export * from "./types";
