import React from "react";
import { Role } from "@prisma/client";
import { requireUser } from "@/lib/auth/context";
import { findAllSettings } from "@/server/repositories/settings.repository";
import { SettingsForm } from "./SettingsForm";

export const metadata = { title: "Pengaturan Situs — ANTRABUMI Admin" };

export default async function SettingsPage() {
  await requireUser(Role.ADMIN);

  const settingsList = await findAllSettings();
  const settingsMap: Record<string, string> = {};
  for (const s of settingsList) {
    if (s.value !== null) {
      settingsMap[s.key] = s.value;
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Pengaturan Situs</h1>
        <p className="mt-0.5 text-sm text-neutral-500">
          Konfigurasi metadata, informasi kontak organisasi, dan tautan sosial resmi.
        </p>
      </div>

      <SettingsForm initialSettings={settingsMap} />
    </div>
  );
}
