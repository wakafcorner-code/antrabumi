"use client";

import React, { useState, useTransition, useRef } from "react";
import { updateSettingsAction } from "@/features/settings/actions";

interface Props {
  initialSettings: Record<string, string>;
}

export function SettingsForm({ initialSettings }: Props) {
  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [logoUrl, setLogoUrl] = useState<string>(initialSettings["site_logo_url"] || "/brand/logo.svg");
  const [logoDarkUrl, setLogoDarkUrl] = useState<string>(initialSettings["site_logo_dark_url"] || "/brand/logo-white.svg");
  const [isUploadingLight, setIsUploadingLight] = useState(false);
  const [isUploadingDark, setIsUploadingDark] = useState(false);

  const fileInputLightRef = useRef<HTMLInputElement>(null);
  const fileInputDarkRef = useRef<HTMLInputElement>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, target: "light" | "dark") {
    const file = e.target.files?.[0];
    if (!file) return;

    if (target === "light") setIsUploadingLight(true);
    else setIsUploadingDark(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("altText", `Logo ANTRABUMI ${target === "light" ? "Utama" : "Versi Gelap"}`);

      const res = await fetch("/api/v1/media/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.data?.url) {
        if (target === "light") {
          setLogoUrl(data.data.url);
        } else {
          setLogoDarkUrl(data.data.url);
        }
      } else {
        alert(data.error || "Gagal mengunggah file logo. Pastikan format file adalah SVG, PNG, WebP, atau JPG (maks 15MB).");
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi saat mengunggah gambar logo.");
    } finally {
      if (target === "light") setIsUploadingLight(false);
      else setIsUploadingDark(false);
      // Reset file input value so selecting the same file triggers change
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatusMsg(null);
    const formData = new FormData(e.currentTarget);

    // Explicitly set logo values from state
    formData.set("site_logo_url", logoUrl);
    formData.set("site_logo_dark_url", logoDarkUrl);

    startTransition(async () => {
      const res = await updateSettingsAction(formData);
      if (res.success) {
        setStatusMsg({ type: "success", text: "Pengaturan situs berhasil disimpan & diperbarui." });
      } else {
        setStatusMsg({ type: "error", text: res.error ?? "Gagal menyimpan pengaturan." });
      }
    });
  }

  const inputCls = "w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-sm outline-none transition focus:border-[#0D5C4D] focus:ring-1 focus:ring-[#0D5C4D]";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8 shadow-sm">
      {statusMsg && (
        <div
          className={`rounded-xl p-4 text-sm font-medium ${
            statusMsg.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      {/* Identitas Organisasi */}
      <fieldset className="space-y-5">
        <div className="border-b border-neutral-100 pb-2">
          <legend className="text-base font-bold text-neutral-900">Profil & Identitas Organisasi</legend>
          <p className="text-xs text-neutral-500 mt-0.5">Nama, tagline, dan pengelolaan aset logo resmi ANTRABUMI.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">Nama Organisasi</label>
            <input
              name="site_name"
              defaultValue={initialSettings["site_name"] ?? "ANTRABUMI"}
              className={inputCls}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">Tagline Resmi</label>
            <input
              name="site_tagline"
              defaultValue={initialSettings["site_tagline"] ?? "Connecting Knowledge, Nature, & Communities."}
              className={inputCls}
            />
          </div>
        </div>

        {/* LOGO MANAGEMENT SECTION WITH FILE UPLOAD */}
        <div className="pt-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#0D5C4D] mb-3">
            Pengaturan & Unggah Logo Resmi
          </label>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Logo Utama (Light/Header) */}
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">Logo Utama (Header / Latar Terang)</h4>
                  <p className="text-xs text-neutral-500">Tampil di header situs dan latar belakang terang.</p>
                </div>
                <span className="rounded-full bg-[#0D5C4D]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#0D5C4D]">
                  Utama
                </span>
              </div>

              {/* Preview Box */}
              <div className="relative flex h-24 w-full items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white p-4 shadow-inner overflow-hidden">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoUrl}
                    alt="Logo Utama"
                    className="max-h-16 w-auto object-contain transition-transform hover:scale-105"
                  />
                ) : (
                  <span className="text-xs text-neutral-400">Belum ada logo dipilih</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={fileInputLightRef}
                  type="file"
                  accept="image/svg+xml,image/png,image/jpeg,image/webp"
                  onChange={(e) => handleFileUpload(e, "light")}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={isUploadingLight}
                  onClick={() => fileInputLightRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#0D5C4D] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#116958] disabled:opacity-50"
                >
                  {isUploadingLight ? (
                    <span>Mengunggah…</span>
                  ) : (
                    <>
                      <span>📁</span>
                      <span>Unggah File Logo</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setLogoUrl("/brand/logo.svg")}
                  className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-100 transition"
                  title="Kembalikan ke /brand/logo.svg bawaan"
                >
                  Gunakan Default
                </button>
              </div>

              {/* URL input fallback */}
              <div className="space-y-1 pt-1">
                <label className="block text-[11px] font-medium text-neutral-500">URL / Path Logo:</label>
                <input
                  name="site_logo_url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="/brand/logo.svg atau https://..."
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 font-mono text-xs text-neutral-800 outline-none focus:border-[#0D5C4D]"
                />
              </div>
            </div>

            {/* Logo Versi Gelap (Dark/Footer) */}
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">Logo Versi Gelap (Footer / Latar Gelap)</h4>
                  <p className="text-xs text-neutral-500">Tampil di footer gelap dan area kontras tinggi.</p>
                </div>
                <span className="rounded-full bg-[#E5A823]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#B8571B]">
                  Versi Gelap
                </span>
              </div>

              {/* Preview Box (Dark background) */}
              <div className="relative flex h-24 w-full items-center justify-center rounded-xl border border-neutral-800 bg-[#0B1E1A] p-4 shadow-inner overflow-hidden">
                {logoDarkUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoDarkUrl}
                    alt="Logo Versi Gelap"
                    className="max-h-16 w-auto object-contain transition-transform hover:scale-105"
                  />
                ) : (
                  <span className="text-xs text-neutral-500">Belum ada logo dipilih</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  ref={fileInputDarkRef}
                  type="file"
                  accept="image/svg+xml,image/png,image/jpeg,image/webp"
                  onChange={(e) => handleFileUpload(e, "dark")}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={isUploadingDark}
                  onClick={() => fileInputDarkRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#0D5C4D] px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#116958] disabled:opacity-50"
                >
                  {isUploadingDark ? (
                    <span>Mengunggah…</span>
                  ) : (
                    <>
                      <span>📁</span>
                      <span>Unggah File Logo</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setLogoDarkUrl("/brand/logo-white.svg")}
                  className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-100 transition"
                  title="Kembalikan ke /brand/logo-white.svg bawaan"
                >
                  Gunakan Default
                </button>
              </div>

              {/* URL input fallback */}
              <div className="space-y-1 pt-1">
                <label className="block text-[11px] font-medium text-neutral-500">URL / Path Logo Versi Gelap:</label>
                <input
                  name="site_logo_dark_url"
                  value={logoDarkUrl}
                  onChange={(e) => setLogoDarkUrl(e.target.value)}
                  placeholder="/brand/logo-white.svg atau https://..."
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-1.5 font-mono text-xs text-neutral-800 outline-none focus:border-[#0D5C4D]"
                />
              </div>
            </div>
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">
            💡 <strong>Format yang disarankan:</strong> Format SVG vektor asli atau PNG transparan beresolusi tinggi. File yang diunggah akan otomatis tersimpan di server dan diterapkan langsung di Header &amp; Footer.
          </p>
        </div>
      </fieldset>

      {/* Kontak Resmi */}
      <fieldset className="space-y-4 border-t border-neutral-100 pt-6">
        <div className="border-b border-neutral-100 pb-2">
          <legend className="text-base font-bold text-neutral-900">Kontak Resmi (Sesuai Profil 2026)</legend>
          <p className="text-xs text-neutral-500 mt-0.5">Informasi kontak yang ditampilkan di footer dan laman kolaborasi.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">Email Resmi</label>
            <input
              name="contact_email"
              type="email"
              defaultValue={initialSettings["contact_email"] ?? "hello@antrabumi.org"}
              className={inputCls}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">Nomor Telepon / WhatsApp</label>
            <input
              name="contact_phone"
              defaultValue={initialSettings["contact_phone"] ?? "+62-823-3038-7505"}
              className={inputCls}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">Alamat Kantor</label>
          <textarea
            name="contact_address"
            rows={3}
            defaultValue={initialSettings["contact_address"] ?? "TRIGHA Creative Hub, Sudirman St, 08, Belitung"}
            className={inputCls}
          />
        </div>
      </fieldset>

      {/* Media Sosial */}
      <fieldset className="space-y-4 border-t border-neutral-100 pt-6">
        <div className="border-b border-neutral-100 pb-2">
          <legend className="text-base font-bold text-neutral-900">Media Sosial Resmi</legend>
          <p className="text-xs text-neutral-500 mt-0.5">Tautan profil media sosial yang aktif di footer situs.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">Instagram URL</label>
            <input
              name="instagram_url"
              defaultValue={initialSettings["instagram_url"] ?? "https://instagram.com/antrabumi_org"}
              className={inputCls}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">LinkedIn URL</label>
            <input
              name="linkedin_url"
              defaultValue={initialSettings["linkedin_url"] ?? "https://linkedin.com/company/antrabumi"}
              className={inputCls}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">YouTube URL</label>
            <input
              name="youtube_url"
              placeholder="https://youtube.com/@antrabumi"
              defaultValue={initialSettings["youtube_url"] ?? ""}
              className={inputCls}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">X / Twitter URL</label>
            <input
              name="twitter_url"
              placeholder="https://x.com/antrabumi"
              defaultValue={initialSettings["twitter_url"] ?? ""}
              className={inputCls}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">Facebook URL</label>
            <input
              name="facebook_url"
              placeholder="https://facebook.com/antrabumi"
              defaultValue={initialSettings["facebook_url"] ?? ""}
              className={inputCls}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">WhatsApp Link / Chat URL</label>
            <input
              name="whatsapp_url"
              placeholder="https://wa.me/6282330387505"
              defaultValue={initialSettings["whatsapp_url"] ?? ""}
              className={inputCls}
            />
          </div>
        </div>
      </fieldset>

      <div className="flex items-center justify-end border-t border-neutral-100 pt-6">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-xl bg-gradient-to-r from-[#0D5C4D] via-[#116958] to-[#147A66] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0D5C4D]/25 transition-all hover:shadow-xl hover:shadow-[#0D5C4D]/35 hover:-translate-y-0.5 disabled:opacity-50"
        >
          {isPending ? "Menyimpan…" : "Simpan Semua Pengaturan"}
        </button>
      </div>
    </form>
  );
}
