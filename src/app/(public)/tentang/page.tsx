import React from "react";
import { Metadata } from "next";
import { getLanguage } from "@/lib/i18n/language";
import { TentangClient } from "./TentangClient";

export const metadata: Metadata = {
  title: "Tentang ANTRABUMI — Connecting Knowledge, Nature, & Communities",
  description:
    "ANTRABUMI adalah organisasi independen yang bekerja di persimpangan pengetahuan, alam, dan komunitas. Pelajari perjalanan, pendekatan, dan tim kami.",
  openGraph: {
    title: "Tentang ANTRABUMI — Connecting Knowledge, Nature, & Communities",
    description:
      "Organisasi independen yang menghubungkan riset, pengalaman lapangan, pengetahuan lokal, dan komunitas.",
  },
};

export const dynamic = "force-dynamic";

export default async function TentangPage() {
  const lang = await getLanguage();

  return <TentangClient lang={lang} />;
}
