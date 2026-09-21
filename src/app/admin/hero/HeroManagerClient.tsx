"use client";

import React, { useState, useTransition } from "react";
import { HeroSlide, HeroSliderConfig } from "@/types/hero";
import { saveHeroSliderAction } from "@/features/hero/actions";

interface Props {
  initialSlides: HeroSlide[];
  initialConfig: HeroSliderConfig;
}

export function HeroManagerClient({ initialSlides, initialConfig }: Props) {
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
  const [config, setConfig] = useState<HeroSliderConfig>(initialConfig);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isNewSlide, setIsNewSlide] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  async function handleSlideImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editingSlide) return;

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/v1/media/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (res.ok && json.success && json.data?.url) {
        setEditingSlide({
          ...editingSlide,
          imageUrl: json.data.url,
        });
      } else {
        alert(json.error || "Gagal mengunggah gambar.");
      }
    } catch {
      alert("Terjadi kesalahan koneksi saat mengunggah gambar.");
    } finally {
      setIsUploadingImage(false);
    }
  }

  // Reorder slide up/down
  function moveSlide(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;

    // update order numbers
    newSlides.forEach((s, idx) => {
      s.order = idx + 1;
    });

    setSlides(newSlides);
  }

  // Toggle active status
  function toggleActive(id: string) {
    setSlides((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  }

  // Delete slide
  function deleteSlide(id: string) {
    if (!confirm("Apakah Anda yakin ingin menghapus slide ini?")) return;
    setSlides((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      return filtered.map((s, idx) => ({ ...s, order: idx + 1 }));
    });
  }

  // Open modal for new slide
  function handleAddNew() {
    setIsNewSlide(true);
    setEditingSlide({
      id: "slide-" + Date.now(),
      tagline: "ANTRABUMI — Organisasi Independen",
      taglineEn: "ANTRABUMI — Independent Organization",
      title: "",
      titleEn: "",
      subtitle: "",
      subtitleEn: "",
      primaryCtaText: "Hubungi Kami",
      primaryCtaTextEn: "Contact Us",
      primaryCtaLink: "/kolaborasi#kontak",
      secondaryCtaText: "Tentang ANTRABUMI",
      secondaryCtaTextEn: "About ANTRABUMI",
      secondaryCtaLink: "/tentang",
      imageUrl: "",
      order: slides.length + 1,
      isActive: true,
    });
  }

  // Save edited or new slide
  function handleSaveSlideModal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingSlide) return;

    const formData = new FormData(e.currentTarget);
    const updated: HeroSlide = {
      ...editingSlide,
      tagline: formData.get("tagline")?.toString().trim() || "",
      taglineEn: formData.get("taglineEn")?.toString().trim() || "",
      title: formData.get("title")?.toString().trim() || "Judul Slide",
      titleEn: formData.get("titleEn")?.toString().trim() || "",
      subtitle: formData.get("subtitle")?.toString().trim() || "",
      subtitleEn: formData.get("subtitleEn")?.toString().trim() || "",
      primaryCtaText: formData.get("primaryCtaText")?.toString().trim() || "",
      primaryCtaTextEn: formData.get("primaryCtaTextEn")?.toString().trim() || "",
      primaryCtaLink: formData.get("primaryCtaLink")?.toString().trim() || "",
      secondaryCtaText: formData.get("secondaryCtaText")?.toString().trim() || "",
      secondaryCtaTextEn: formData.get("secondaryCtaTextEn")?.toString().trim() || "",
      secondaryCtaLink: formData.get("secondaryCtaLink")?.toString().trim() || "",
      imageUrl: (formData.get("imageUrl")?.toString().trim() || editingSlide.imageUrl || "").trim(),
      order: parseInt(formData.get("order")?.toString() || "1", 10),
      isActive: editingSlide.isActive,
    };

    if (isNewSlide) {
      setSlides((prev) => [...prev, updated]);
    } else {
      setSlides((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    }

    setEditingSlide(null);
    setStatusMsg({
      type: "success",
      text: "Slide berhasil diperbarui pada daftar. Klik tombol 'Simpan Pengaturan Slider' di atas untuk menyimpan permanen ke database.",
    });
  }

  // Submit all changes to database
  function handleSaveAll() {
    setStatusMsg(null);
    startTransition(async () => {
      const res = await saveHeroSliderAction({ slides, config });
      if (res.success) {
        setStatusMsg({ type: "success", text: "Pengaturan dan daftar Hero Slider berhasil disimpan!" });
      } else {
        setStatusMsg({ type: "error", text: res.error || "Gagal menyimpan pengaturan." });
      }
    });
  }

  const inputCls =
    "w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-900";

  return (
    <div className="space-y-6">
      {statusMsg && (
        <div
          className={`flex items-center justify-between rounded-md p-4 text-sm font-medium ${
            statusMsg.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          <span>{statusMsg.text}</span>
          <button
            type="button"
            onClick={() => setStatusMsg(null)}
            className="text-xs uppercase opacity-60 hover:opacity-100"
          >
            Tutup
          </button>
        </div>
      )}

      {/* ── CARD 1: KONFIGURASI SLIDER ──────────────────────────────────── */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-neutral-900">Konfigurasi Putar Otomatis (Autoplay)</h2>
        <p className="mt-1 text-xs text-neutral-500">
          Atur bagaimana slider beranda bergerak secara otomatis di perangkat pengguna.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {/* Autoplay Toggle */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
              Putar Otomatis
            </label>
            <select
              value={config.autoplay ? "true" : "false"}
              onChange={(e) => setConfig({ ...config, autoplay: e.target.value === "true" })}
              className={inputCls}
            >
              <option value="true">Aktif (Autoplay ON)</option>
              <option value="false">Nonaktif (Manual)</option>
            </select>
          </div>

          {/* Durasi Interval */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
              Durasi per Slide
            </label>
            <select
              value={config.intervalMs}
              onChange={(e) => setConfig({ ...config, intervalMs: parseInt(e.target.value, 10) })}
              className={inputCls}
            >
              <option value={4000}>4 Detik (Cepat)</option>
              <option value={5000}>5 Detik</option>
              <option value={6000}>6 Detik (Rekomendasi)</option>
              <option value={8000}>8 Detik (Tenang)</option>
              <option value={10000}>10 Detik (Lambat)</option>
            </select>
          </div>

          {/* Efek Transisi */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
              Efek Transisi
            </label>
            <select
              value={config.transitionEffect}
              onChange={(e) =>
                setConfig({ ...config, transitionEffect: e.target.value as "fade" | "slide" })
              }
              className={inputCls}
            >
              <option value="fade">Fade (Halus & Elegan)</option>
              <option value="slide">Slide (Geser Horizontal)</option>
            </select>
          </div>

          {/* Pause on Hover */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
              Jeda Saat Kursor Diatas
            </label>
            <select
              value={config.pauseOnHover ? "true" : "false"}
              onChange={(e) => setConfig({ ...config, pauseOnHover: e.target.value === "true" })}
              className={inputCls}
            >
              <option value="true">Ya (Pause on Hover)</option>
              <option value="false">Tidak (Tetap Berputar)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── CARD 2: DAFTAR SLIDE ────────────────────────────────────────── */}
      <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">Daftar Slide Beranda</h2>
            <p className="mt-0.5 text-xs text-neutral-500">
              Total {slides.length} slide terdaftar. Minimal 1 slide harus aktif agar beranda tampil optimal.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddNew}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#0D5C4D] to-[#116958] px-4 text-xs font-semibold text-white shadow-sm shadow-[#0D5C4D]/20 transition hover:shadow-md hover:-translate-y-0.5"
          >
            + Tambah Slide Baru
          </button>
        </div>

        {slides.length === 0 ? (
          <div className="mt-8 rounded-lg border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500">
            Belum ada slide. Klik tombol &ldquo;+ Tambah Slide Baru&rdquo; di atas untuk membuat slide pertama.
          </div>
        ) : (
          <div className="mt-6 divide-y divide-neutral-100 overflow-hidden rounded-md border border-neutral-200">
            {slides.map((s, index) => (
              <div
                key={s.id}
                className={`flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between ${
                  !s.isActive ? "bg-neutral-50/60 opacity-65" : "bg-white"
                }`}
              >
                {/* Left: Info */}
                <div className="flex items-start gap-4">
                  {/* Order badge & buttons */}
                  <div className="flex flex-col items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveSlide(index, "up")}
                      className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-20"
                      title="Pindahkan ke atas"
                    >
                      ▲
                    </button>
                    <span className="font-mono text-xs font-bold text-neutral-400">
                      #{index + 1}
                    </span>
                    <button
                      type="button"
                      disabled={index === slides.length - 1}
                      onClick={() => moveSlide(index, "down")}
                      className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-20"
                      title="Pindahkan ke bawah"
                    >
                      ▼
                    </button>
                  </div>

                  {/* Thumbnail if image is set */}
                  {s.imageUrl ? (
                    <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded border border-neutral-200 bg-neutral-100">
                      <img
                        src={s.imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-16 w-24 flex-shrink-0 items-center justify-center rounded border border-dashed border-neutral-200 bg-neutral-50 text-[10px] text-neutral-400">
                      Tanpa Gambar
                    </div>
                  )}

                  {/* Text Details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                        {s.tagline || "ANTRABUMI"}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                          s.isActive
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-neutral-200 text-neutral-600"
                        }`}
                      >
                        {s.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                    <h3 className="font-heading text-sm font-bold text-neutral-900 line-clamp-1">
                      {s.title}
                    </h3>
                    {s.titleEn && (
                      <p className="text-xs italic text-neutral-500 line-clamp-1">
                        EN: {s.titleEn}
                      </p>
                    )}
                    <p className="text-xs text-neutral-600 line-clamp-1">{s.subtitle}</p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 pt-2 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => toggleActive(s.id)}
                    className={`rounded border px-2.5 py-1 text-xs font-medium transition ${
                      s.isActive
                        ? "border-neutral-200 text-neutral-600 hover:bg-neutral-100"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    {s.isActive ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewSlide(false);
                      setEditingSlide(s);
                    }}
                    className="rounded border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-800 transition hover:bg-neutral-100"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSlide(s.id)}
                    className="rounded border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Global Save Button */}
        <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-5">
          <span className="text-xs text-neutral-500">
            Pastikan menekan tombol di samping setelah melakukan perubahan slide.
          </span>
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isPending}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-r from-[#0D5C4D] to-[#116958] px-6 text-sm font-semibold text-white shadow-md shadow-[#0D5C4D]/25 transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50"
          >
            {isPending ? "Menyimpan Perubahan…" : "Simpan Semua Pengaturan"}
          </button>
        </div>
      </div>

      {/* ── MODAL FORM ADD / EDIT SLIDE ──────────────────────────────────── */}
      {editingSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <h3 className="text-base font-bold text-neutral-900">
                {isNewSlide ? "Tambah Slide Baru" : "Edit Slide"}
              </h3>
              <button
                type="button"
                onClick={() => setEditingSlide(null)}
                className="text-neutral-400 hover:text-neutral-900"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSlideModal} className="mt-4 space-y-4">
              <input type="hidden" name="isActive" value={editingSlide.isActive ? "true" : "false"} />
              <input type="hidden" name="order" value={editingSlide.order} />

              {/* Tagline */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                    Badge / Tagline (ID)
                  </label>
                  <input
                    name="tagline"
                    defaultValue={editingSlide.tagline}
                    placeholder="ANTRABUMI — Organisasi Independen"
                    className={inputCls}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                    Badge / Tagline (EN)
                  </label>
                  <input
                    name="taglineEn"
                    defaultValue={editingSlide.taglineEn || ""}
                    placeholder="ANTRABUMI — Independent Organization"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Judul Slide */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                    Judul Utama (ID) *
                  </label>
                  <textarea
                    name="title"
                    rows={2}
                    required
                    defaultValue={editingSlide.title}
                    placeholder="Connecting Knowledge, Nature, & Communities."
                    className={inputCls}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                    Judul Utama (EN)
                  </label>
                  <textarea
                    name="titleEn"
                    rows={2}
                    defaultValue={editingSlide.titleEn || ""}
                    placeholder="Connecting Knowledge, Nature, & Communities."
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Subtitle / Deskripsi */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                    Deskripsi / Subjudul (ID)
                  </label>
                  <textarea
                    name="subtitle"
                    rows={3}
                    defaultValue={editingSlide.subtitle}
                    placeholder="Organisasi independen yang menghubungkan riset, pengalaman lapangan..."
                    className={inputCls}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                    Deskripsi / Subjudul (EN)
                  </label>
                  <textarea
                    name="subtitleEn"
                    rows={3}
                    defaultValue={editingSlide.subtitleEn || ""}
                    placeholder="An independent organization working at the intersection..."
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Tombol Aksi 1 (Utama) */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                    Teks Tombol 1 (ID)
                  </label>
                  <input
                    name="primaryCtaText"
                    defaultValue={editingSlide.primaryCtaText || ""}
                    placeholder="Hubungi Kami"
                    className={inputCls}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                    Teks Tombol 1 (EN)
                  </label>
                  <input
                    name="primaryCtaTextEn"
                    defaultValue={editingSlide.primaryCtaTextEn || ""}
                    placeholder="Contact Us"
                    className={inputCls}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                    Link Tujuan Tombol 1
                  </label>
                  <input
                    name="primaryCtaLink"
                    defaultValue={editingSlide.primaryCtaLink || ""}
                    placeholder="/kolaborasi#kontak"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Tombol Aksi 2 (Sekunder) */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                    Teks Tombol 2 (ID)
                  </label>
                  <input
                    name="secondaryCtaText"
                    defaultValue={editingSlide.secondaryCtaText || ""}
                    placeholder="Tentang ANTRABUMI"
                    className={inputCls}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                    Teks Tombol 2 (EN)
                  </label>
                  <input
                    name="secondaryCtaTextEn"
                    defaultValue={editingSlide.secondaryCtaTextEn || ""}
                    placeholder="About ANTRABUMI"
                    className={inputCls}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                    Link Tujuan Tombol 2
                  </label>
                  <input
                    name="secondaryCtaLink"
                    defaultValue={editingSlide.secondaryCtaLink || ""}
                    placeholder="/tentang"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Gambar Latar / Visual - Manual Upload & URL */}
              <div className="space-y-3 rounded-2xl border border-neutral-200 bg-neutral-50/70 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-700">
                      Gambar Visual Slide (Opsional)
                    </label>
                    <p className="text-[11px] text-neutral-500">
                      Unggah berkas foto dari perangkat Anda atau masukkan URL gambar langsung.
                    </p>
                  </div>
                  {editingSlide.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setEditingSlide({ ...editingSlide, imageUrl: "" })}
                      className="text-xs font-medium text-red-600 hover:text-red-700 hover:underline"
                    >
                      Hapus Gambar
                    </button>
                  )}
                </div>

                {/* Live Preview Box */}
                {editingSlide.imageUrl ? (
                  <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={editingSlide.imageUrl}
                      alt="Pratinjau visual hero"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}

                {/* Upload Action & URL Input */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 items-center">
                  <div>
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#0D5C4D]/30 bg-white px-4 py-2.5 text-xs font-semibold text-[#0D5C4D] shadow-xs transition hover:bg-[#0D5C4D]/5 hover:border-[#0D5C4D]">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span>{isUploadingImage ? "Mengunggah..." : "Unggah Gambar Manual"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSlideImageUpload}
                        disabled={isUploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <input
                      name="imageUrl"
                      value={editingSlide.imageUrl || ""}
                      onChange={(e) => setEditingSlide({ ...editingSlide, imageUrl: e.target.value })}
                      placeholder="Atau tempel URL (https://...)"
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>

              {/* Status Aktif */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  name="isActive"
                  id="modal-isActive"
                  checked={editingSlide.isActive}
                  onChange={(e) => {
                    setEditingSlide({ ...editingSlide, isActive: e.target.checked });
                  }}
                  className="h-4 w-4 rounded border-neutral-300 text-[#0D5C4D] focus:ring-[#0D5C4D]"
                />
                <label htmlFor="modal-isActive" className="text-sm font-medium text-neutral-700 cursor-pointer">
                  Aktifkan slide ini di beranda
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-neutral-100 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingSlide(null)}
                  className="rounded-md border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-gradient-to-r from-[#0D5C4D] to-[#116958] px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-[#0D5C4D]/20 transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  Terapkan ke Daftar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
