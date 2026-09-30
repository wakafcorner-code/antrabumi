import React from "react";
import { Metadata } from "next";
import { getLanguage } from "@/lib/i18n/language";
import { findPublishedPartners } from "@/server/repositories/partner.repository";
import { KolaborasiClient } from "./KolaborasiClient";

export const metadata: Metadata = {
  title: "Kolaborasi — ANTRABUMI",
  description:
    "Perubahan tidak dibangun sendirian. ANTRABUMI bekerja bersama mereka yang memiliki persoalan, pengetahuan, sumber daya, atau gagasan yang ingin dikembangkan menjadi perubahan.",
};

export const dynamic = "force-dynamic";

export default async function KolaborasiPage() {
  const [lang, partners] = await Promise.all([
    getLanguage(),
    findPublishedPartners(),
  ]);

  return <KolaborasiClient lang={lang} partners={partners} />;
}
