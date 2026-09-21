import React from "react";
import { Metadata } from "next";
import { getLanguage } from "@/lib/i18n/language";
import { KolaborasiClient } from "./KolaborasiClient";

export const metadata: Metadata = {
  title: "Kolaborasi — ANTRABUMI",
  description:
    "Perubahan tidak dibangun sendirian. ANTRABUMI bekerja bersama mereka yang memiliki persoalan, pengetahuan, sumber daya, atau gagasan yang ingin dikembangkan menjadi perubahan.",
};

export const dynamic = "force-dynamic";

export default async function KolaborasiPage() {
  const lang = await getLanguage();

  return <KolaborasiClient lang={lang} />;
}
