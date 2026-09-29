import React from "react";
import { Metadata } from "next";
import { getLanguage } from "@/lib/i18n/language";
import { InisiatifClient } from "./InisiatifClient";

export const metadata: Metadata = {
  title: "Inisiatif — ANTRABUMI",
  description:
    "Ruang kerja yang menghubungkan alam, masyarakat, pengetahuan, dan perubahan. Empat area inisiatif menjadi ruang bagi ANTRABUMI untuk bekerja bersama mitra.",
};

export const dynamic = "force-dynamic";

export default async function InisiatifPage() {
  const lang = await getLanguage();

  return <InisiatifClient lang={lang} />;
}
