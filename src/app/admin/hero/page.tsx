import React from "react";
import { Role } from "@prisma/client";
import { requireUser } from "@/lib/auth/context";
import { getHeroSliderDataAction } from "@/features/hero/actions";
import { HeroManagerClient } from "./HeroManagerClient";

export const metadata = {
  title: "Kelola Hero Slider — ANTRABUMI Admin",
  description: "Atur slide beranda, durasi putar otomatis, dan teks aksi.",
};

export const dynamic = "force-dynamic";

export default async function AdminHeroPage() {
  await requireUser(Role.EDITOR);

  const { slides, config } = await getHeroSliderDataAction();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Hero Slider Beranda</h1>
          <p className="mt-0.5 text-sm text-neutral-500">
            Kelola slide, teks dwibahasa, tombol aksi, serta durasi putar otomatis pada beranda utama.
          </p>
        </div>
      </div>

      <HeroManagerClient initialSlides={slides} initialConfig={config} />
    </div>
  );
}
