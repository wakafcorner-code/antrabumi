import React from "react";
import { Role } from "@prisma/client";
import { requireUser } from "@/lib/auth/context";
import { getHomeContentAction } from "@/features/home-content/actions";
import { HomeContentManagerClient } from "./HomeContentManagerClient";

export const metadata = {
  title: "Kelola Konten Beranda — ANTRABUMI Admin",
  description: "Edit teks, pilar, kerangka kerja, dan linimasa beranda ANTRABUMI.",
};

export const dynamic = "force-dynamic";

export default async function AdminBerandaPage() {
  await requireUser(Role.EDITOR);

  const content = await getHomeContentAction();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Konten & Teks Beranda</h1>
        <p className="mt-0.5 text-sm text-neutral-500">
          Ubah dan sesuaikan isi semua bagian beranda (Mengapa Kami Hadir, Pilar Utama, Kerangka Kerja, Linimasa Perjalanan, dan Ajakan Kolaborasi) sesuai Organization Profile 2026.
        </p>
      </div>

      <HomeContentManagerClient initialContent={content} />
    </div>
  );
}
