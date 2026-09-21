import React from "react";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { Badge } from "@/components/ui/Badge";

export default function AdminDashboardPage() {
  const sections = [
    { title: "Pages Management", desc: "Kelola halaman publik dan konten statis (Phase 4)." },
    { title: "Experiences & Initiatives", desc: "Arsip inisiatif dan program lapangan (Phase 4)." },
    { title: "Knowledge Hub", desc: "Publikasi riset, artikel, dan assessment (Phase 4)." },
    { title: "People & Team", desc: "Profil tim dan keahlian kolektif (Phase 4)." },
    { title: "Partners & Collaborators", desc: "Direktori mitra dan kolaborator (Phase 4)." },
    { title: "Messages & Inquiries", desc: "Pesan masuk dari form kontak publik (Phase 4)." },
  ];

  return (
    <div className="max-w-5xl space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="warning">CMS Structural Placeholder</Badge>
          <Badge variant="neutral">Phase 0</Badge>
        </div>
        <Heading level="h1" visualLevel="h2">
          CMS Admin Dashboard
        </Heading>
        <Text variant="body" muted>
          Struktur foundation untuk panel administrasi ANTRABUMI. Sesuai Development Plan, logika
          otentikasi, otorisasi RBAC, skema database, dan operasi CRUD akan diimplementasikan pada
          fase berikutnya.
        </Text>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((sec) => (
          <div
            key={sec.title}
            className="space-y-2 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <h3 className="text-sm font-semibold text-neutral-900">{sec.title}</h3>
            <p className="text-xs text-neutral-500">{sec.desc}</p>
            <div className="pt-2">
              <span className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[11px] text-neutral-400">
                Status: Pending Phase 2+
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
