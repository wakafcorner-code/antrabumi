import React from "react";
import Link from "next/link";
import { Role } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth/context";
import { prisma } from "@/lib/db/prisma";

export const metadata = {
  title: "Dashboard Administrasi — ANTRABUMI",
  description: "Pusat kendali portal ANTRABUMI untuk publikasi, inisiatif, dan manajemen konten.",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  // Fetch real database metrics in parallel
  const [
    expTotal,
    expPublished,
    knowTotal,
    knowPublished,
    personTotal,
    personPublished,
    partnerTotal,
    mediaTotal,
    mediaDocs,
    msgTotal,
    msgNew,
    userTotal,
    recentMessages,
    recentLogs,
  ] = await Promise.all([
    prisma.experience.count(),
    prisma.experience.count({ where: { status: "PUBLISHED" } }),
    prisma.knowledge.count(),
    prisma.knowledge.count({ where: { status: "PUBLISHED" } }),
    prisma.person.count(),
    prisma.person.count({ where: { status: "PUBLISHED" } }),
    prisma.partner.count(),
    prisma.media.count(),
    prisma.media.count({ where: { type: "DOCUMENT" } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { status: "NEW" } }),
    prisma.user.count(),
    prisma.contactMessage.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        organization: true,
        subject: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.auditLog.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
      },
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* ── Top Header Banner ────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-gradient-to-br from-neutral-900 via-neutral-900 to-[#072B24] p-6 text-white shadow-sm sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold tracking-wide text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Sistem Siap Produksi
              </span>
              <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-[11px] text-neutral-300">
                Domain: antrabumi.org
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Selamat datang kembali, {user?.name ?? "Admin"}
            </h1>
            <p className="max-w-2xl text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
              Pusat kendali CMS resmi ANTRABUMI 2026. Kelola arsip inisiatif, publikasi pengetahuan,
              profil pakar, mitra, serta pesan kolaborasi dari satu panel terintegrasi.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              href="/admin/initiatives/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0D5C4D] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#116958]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Inisiatif Baru
            </Link>
            <Link
              href="/admin/knowledge/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/20 border border-white/10"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Publikasi Baru
            </Link>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-lg border border-white/20 px-3.5 py-2.5 text-xs font-medium text-neutral-300 hover:text-white hover:border-white/40 transition"
              title="Pratinjau Situs Publik"
            >
              Lihat Web ↗
            </Link>
          </div>
        </div>

        {/* Decorative corner glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      {/* ── Primary Metric Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Inisiatif */}
        <Link
          href="/admin/initiatives"
          className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-5 shadow-xs transition hover:border-[#0D5C4D] hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Inisiatif & Proyek
            </span>
            <span className="rounded-lg bg-emerald-50 p-2 text-[#0D5C4D] transition group-hover:bg-[#0D5C4D] group-hover:text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-neutral-900">{expTotal}</span>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {expPublished} Terbit
            </span>
          </div>
          <p className="mt-2 text-xs text-neutral-500">
            {expTotal - expPublished} Draf / Review · Program lapangan
          </p>
        </Link>

        {/* Pengetahuan */}
        <Link
          href="/admin/knowledge"
          className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-5 shadow-xs transition hover:border-[#0D5C4D] hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Hub Pengetahuan
            </span>
            <span className="rounded-lg bg-blue-50 p-2 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-neutral-900">{knowTotal}</span>
            <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              {knowPublished} Terbit
            </span>
          </div>
          <p className="mt-2 text-xs text-neutral-500">
            Riset, artikel, dan dokumen PDF kajian
          </p>
        </Link>

        {/* Pesan Masuk */}
        <Link
          href="/admin/messages"
          className={`group relative overflow-hidden rounded-xl border p-5 shadow-xs transition hover:shadow-md ${
            msgNew > 0
              ? "border-amber-300 bg-amber-50/30 hover:border-amber-400"
              : "border-neutral-200 bg-white hover:border-[#0D5C4D]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Pesan Masuk
            </span>
            <span className={`rounded-lg p-2 transition ${
              msgNew > 0
                ? "bg-amber-100 text-amber-800 group-hover:bg-amber-600 group-hover:text-white"
                : "bg-neutral-100 text-neutral-600 group-hover:bg-neutral-800 group-hover:text-white"
            }`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-neutral-900">{msgTotal}</span>
            {msgNew > 0 ? (
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full animate-pulse">
                {msgNew} Pesan Baru
              </span>
            ) : (
              <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                Semua Terbaca
              </span>
            )}
          </div>
          <p className="mt-2 text-xs text-neutral-500">
            Formulir kontak & ajakan kolaborasi
          </p>
        </Link>

        {/* Media & Dokumen */}
        <Link
          href="/admin/media"
          className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-5 shadow-xs transition hover:border-[#0D5C4D] hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Media & Arsip
            </span>
            <span className="rounded-lg bg-neutral-100 p-2 text-neutral-700 transition group-hover:bg-neutral-900 group-hover:text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-neutral-900">{mediaTotal}</span>
            <span className="text-xs font-medium text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full">
              {mediaDocs} Dokumen PDF
            </span>
          </div>
          <p className="mt-2 text-xs text-neutral-500">
            File lokal di /public/uploads & /documents
          </p>
        </Link>
      </div>

      {/* ── Secondary Quick Hub Navigation ──────────────────────────────── */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-3">
          Modul Pengelolaan CMS
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <Link
            href="/admin/beranda"
            className="flex flex-col rounded-xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-900 hover:shadow-xs"
          >
            <span className="text-xs font-semibold text-neutral-900">Konten Beranda</span>
            <span className="mt-1 text-[11px] text-neutral-500">Pilar, Journey, GEDSI</span>
            <span className="mt-3 text-[10px] font-medium text-[#0D5C4D]">Atur Teks →</span>
          </Link>

          <Link
            href="/admin/hero"
            className="flex flex-col rounded-xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-900 hover:shadow-xs"
          >
            <span className="text-xs font-semibold text-neutral-900">Hero Slider</span>
            <span className="mt-1 text-[11px] text-neutral-500">Slide visual & durasi</span>
            <span className="mt-3 text-[10px] font-medium text-[#0D5C4D]">Atur Slider →</span>
          </Link>

          <Link
            href="/admin/people"
            className="flex flex-col rounded-xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-900 hover:shadow-xs"
          >
            <span className="text-xs font-semibold text-neutral-900">Tim & Dewan Pakar</span>
            <span className="mt-1 text-[11px] text-neutral-500">{personTotal} profil ({personPublished} terbit)</span>
            <span className="mt-3 text-[10px] font-medium text-[#0D5C4D]">Kelola Tim →</span>
          </Link>

          <Link
            href="/admin/partners"
            className="flex flex-col rounded-xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-900 hover:shadow-xs"
          >
            <span className="text-xs font-semibold text-neutral-900">Mitra Kolaborasi</span>
            <span className="mt-1 text-[11px] text-neutral-500">{partnerTotal} mitra terdaftar</span>
            <span className="mt-3 text-[10px] font-medium text-[#0D5C4D]">Kelola Mitra →</span>
          </Link>

          <Link
            href="/admin/users"
            className="flex flex-col rounded-xl border border-neutral-200 bg-white p-4 transition hover:border-neutral-900 hover:shadow-xs"
          >
            <span className="text-xs font-semibold text-neutral-900">Pengguna & Akses</span>
            <span className="mt-1 text-[11px] text-neutral-500">{userTotal} akun administrator</span>
            <span className="mt-3 text-[10px] font-medium text-[#0D5C4D]">Kelola User →</span>
          </Link>
        </div>
      </div>

      {/* ── Two Columns: Recent Messages & Activity Logs ─────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Messages */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">Pesan Masuk Terbaru</h2>
              <p className="text-xs text-neutral-500">Pesan dari halaman kolaborasi & kontak publik</p>
            </div>
            <Link
              href="/admin/messages"
              className="text-xs font-semibold text-[#0D5C4D] hover:underline"
            >
              Lihat Semua ({msgTotal}) →
            </Link>
          </div>

          <div className="mt-4 divide-y divide-neutral-100">
            {recentMessages.length === 0 ? (
              <div className="py-8 text-center text-xs text-neutral-400">
                Belum ada pesan masuk.
              </div>
            ) : (
              recentMessages.map((msg) => (
                <Link
                  key={msg.id}
                  href={`/admin/messages/${msg.id}`}
                  className="group block py-3 first:pt-0 last:pb-0 hover:bg-neutral-50/70 -mx-2 px-2 rounded-lg transition"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-neutral-900 group-hover:text-[#0D5C4D] truncate">
                      {msg.name}
                      {msg.organization && (
                        <span className="ml-1.5 font-normal text-neutral-500">
                          ({msg.organization})
                        </span>
                      )}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                        msg.status === "NEW"
                          ? "bg-amber-100 text-amber-800 font-semibold"
                          : msg.status === "RESOLVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {msg.status === "NEW"
                        ? "Baru"
                        : msg.status === "READ"
                        ? "Dibaca"
                        : msg.status === "RESOLVED"
                        ? "Selesai"
                        : msg.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-neutral-600 font-medium truncate">
                    {msg.subject}
                  </p>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                    <span>{msg.email}</span>
                    <span>
                      {new Date(msg.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Audit Activity */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">Log Aktivitas CMS</h2>
              <p className="text-xs text-neutral-500">Pencatatan audit keamanan dan perubahan data</p>
            </div>
            <Link
              href="/admin/logs"
              className="text-xs font-semibold text-[#0D5C4D] hover:underline"
            >
              Lihat Log Lengkap →
            </Link>
          </div>

          <div className="mt-4 divide-y divide-neutral-100">
            {recentLogs.length === 0 ? (
              <div className="py-8 text-center text-xs text-neutral-400">
                Belum ada aktivitas tercatat.
              </div>
            ) : (
              recentLogs.map((log) => (
                <div key={log.id} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase ${
                          log.action === "CREATE"
                            ? "bg-emerald-100 text-emerald-800"
                            : log.action === "UPDATE"
                            ? "bg-blue-100 text-blue-800"
                            : log.action === "DELETE"
                            ? "bg-red-100 text-red-800"
                            : "bg-neutral-100 text-neutral-700"
                        }`}
                      >
                        {log.action}
                      </span>
                      <span className="text-xs font-semibold text-neutral-800">
                        {log.entity ?? "Sistem"}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500">
                      Oleh: <span className="font-medium text-neutral-700">{log.user?.name ?? "Sistem"}</span>
                    </p>
                  </div>
                  <span className="text-[11px] text-neutral-400 font-mono shrink-0">
                    {new Date(log.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Production Architecture & Info Card ─────────────────────────── */}
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 text-xs text-neutral-600">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="font-semibold text-neutral-900">
              ANTRABUMI Profile 2026 & Brand Guidelines — Production Instance
            </p>
            <p className="text-neutral-500">
              Kantor: TRIGHA Creative Hub, Sudirman St, 08, Belitung · Kontak: hello@antrabumi.org · +62-823-3038-7505
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-neutral-500">
            <span className="rounded bg-white px-2.5 py-1 border border-neutral-200">
              Next.js 15 App Router
            </span>
            <span className="rounded bg-white px-2.5 py-1 border border-neutral-200">
              MySQL + Prisma ORM
            </span>
            <span className="rounded bg-white px-2.5 py-1 border border-neutral-200">
              RBAC Enabled
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
