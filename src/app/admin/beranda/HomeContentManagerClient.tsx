"use client";

import React, { useState, useTransition } from "react";
import { HomeSectionsContent, TimelineItem } from "@/types/home-content";
import { saveHomeContentAction } from "@/features/home-content/actions";

interface Props {
  initialContent: HomeSectionsContent;
}

export function HomeContentManagerClient({ initialContent }: Props) {
  const [content, setContent] = useState<HomeSectionsContent>(initialContent);
  const [activeTab, setActiveTab] = useState<"whyUs" | "about" | "growth" | "framework" | "cta">("whyUs");
  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Timeline helpers
  function addTimelineItem() {
    const newItem: TimelineItem = {
      year: new Date().getFullYear().toString(),
      label: "Fase Baru",
      labelEn: "New Phase",
      description: "Deskripsi pencapaian dan kolaborasi lapangan...",
      descriptionEn: "Description of field achievement...",
    };
    setContent((prev) => ({
      ...prev,
      growth: {
        ...prev.growth,
        timeline: [...prev.growth.timeline, newItem],
      },
    }));
  }

  function updateTimelineItem(index: number, field: keyof TimelineItem, value: string) {
    setContent((prev) => {
      const updated = [...prev.growth.timeline];
      updated[index] = { ...updated[index], [field]: value };
      return {
        ...prev,
        growth: { ...prev.growth, timeline: updated },
      };
    });
  }

  function deleteTimelineItem(index: number) {
    if (!confirm("Hapus tonggak tahun perjalanan ini?")) return;
    setContent((prev) => ({
      ...prev,
      growth: {
        ...prev.growth,
        timeline: prev.growth.timeline.filter((_, idx) => idx !== index),
      },
    }));
  }

  function handleSaveAll() {
    setStatusMsg(null);
    startTransition(async () => {
      const res = await saveHomeContentAction(content);
      if (res.success) {
        setStatusMsg({ type: "success", text: "Konten beranda berhasil diperbarui dan disimpan ke database!" });
      } else {
        setStatusMsg({ type: "error", text: res.error || "Gagal menyimpan konten beranda." });
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
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-red-200 bg-red-50 text-red-700"
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

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-2">
        {[
          { id: "whyUs", label: "01. Mengapa Kami Hadir" },
          { id: "about", label: "02. Tentang & 3 Pilar" },
          { id: "growth", label: "03. Perjalanan Kami (Timeline)" },
          { id: "framework", label: "04. Framework & GEDSI" },
          { id: "cta", label: "05. Ajakan Kolaborasi" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`rounded-md px-4 py-2 text-xs font-semibold uppercase tracking-wider transition ${
              activeTab === tab.id
                ? "bg-neutral-900 text-white"
                : "bg-white text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TAB 1: MENGAPA KAMI HADIR ────────────────────────────────────── */}
      {activeTab === "whyUs" && (
        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm space-y-5">
          <div>
            <h2 className="text-base font-bold text-neutral-900">01 — Mengapa Kami Hadir</h2>
            <p className="text-xs text-neutral-500">Sesuai Halaman 02 Organization Profile 2026.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                Badge / Penomoran (ID)
              </label>
              <input
                value={content.whyUs.badge}
                onChange={(e) =>
                  setContent({ ...content, whyUs: { ...content.whyUs, badge: e.target.value } })
                }
                className={inputCls}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                Badge / Penomoran (EN)
              </label>
              <input
                value={content.whyUs.badgeEn || ""}
                onChange={(e) =>
                  setContent({ ...content, whyUs: { ...content.whyUs, badgeEn: e.target.value } })
                }
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                Judul Utama (ID)
              </label>
              <textarea
                rows={2}
                value={content.whyUs.title}
                onChange={(e) =>
                  setContent({ ...content, whyUs: { ...content.whyUs, title: e.target.value } })
                }
                className={inputCls}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                Judul Utama (EN)
              </label>
              <textarea
                rows={2}
                value={content.whyUs.titleEn || ""}
                onChange={(e) =>
                  setContent({ ...content, whyUs: { ...content.whyUs, titleEn: e.target.value } })
                }
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                Paragraf Latar Belakang (ID)
              </label>
              <textarea
                rows={4}
                value={content.whyUs.leadText}
                onChange={(e) =>
                  setContent({ ...content, whyUs: { ...content.whyUs, leadText: e.target.value } })
                }
                className={inputCls}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                Paragraf Latar Belakang (EN)
              </label>
              <textarea
                rows={4}
                value={content.whyUs.leadTextEn || ""}
                onChange={(e) =>
                  setContent({ ...content, whyUs: { ...content.whyUs, leadTextEn: e.target.value } })
                }
                className={inputCls}
              />
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-4 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
              Pernyataan Solusi (Bridge Box)
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                  Judul Solusi (ID)
                </label>
                <input
                  value={content.whyUs.bridgeTitle}
                  onChange={(e) =>
                    setContent({ ...content, whyUs: { ...content.whyUs, bridgeTitle: e.target.value } })
                  }
                  className={inputCls}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                  Judul Solusi (EN)
                </label>
                <input
                  value={content.whyUs.bridgeTitleEn || ""}
                  onChange={(e) =>
                    setContent({ ...content, whyUs: { ...content.whyUs, bridgeTitleEn: e.target.value } })
                  }
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                  Uraian Solusi (ID)
                </label>
                <textarea
                  rows={3}
                  value={content.whyUs.bridgeText}
                  onChange={(e) =>
                    setContent({ ...content, whyUs: { ...content.whyUs, bridgeText: e.target.value } })
                  }
                  className={inputCls}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                  Uraian Solusi (EN)
                </label>
                <textarea
                  rows={3}
                  value={content.whyUs.bridgeTextEn || ""}
                  onChange={(e) =>
                    setContent({ ...content, whyUs: { ...content.whyUs, bridgeTextEn: e.target.value } })
                  }
                  className={inputCls}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                URL Gambar Diagram / Visual
              </label>
              <input
                value={content.whyUs.imageUrl || ""}
                onChange={(e) =>
                  setContent({ ...content, whyUs: { ...content.whyUs, imageUrl: e.target.value } })
                }
                placeholder="/images/home/bridge-diagram.svg"
                className={inputCls}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: TENTANG & TIGA PILAR ─────────────────────────────────── */}
      {activeTab === "about" && (
        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-neutral-900">02 — Tentang ANTRABUMI & Tiga Pilar</h2>
            <p className="text-xs text-neutral-500">Sesuai Halaman 03 Organization Profile 2026.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                Judul Pernyataan (ID)
              </label>
              <textarea
                rows={2}
                value={content.about.title}
                onChange={(e) =>
                  setContent({ ...content, about: { ...content.about, title: e.target.value } })
                }
                className={inputCls}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                Judul Pernyataan (EN)
              </label>
              <textarea
                rows={2}
                value={content.about.titleEn || ""}
                onChange={(e) =>
                  setContent({ ...content, about: { ...content.about, titleEn: e.target.value } })
                }
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                Deskripsi Utama (ID)
              </label>
              <textarea
                rows={4}
                value={content.about.description}
                onChange={(e) =>
                  setContent({ ...content, about: { ...content.about, description: e.target.value } })
                }
                className={inputCls}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                Deskripsi Utama (EN)
              </label>
              <textarea
                rows={4}
                value={content.about.descriptionEn || ""}
                onChange={(e) =>
                  setContent({ ...content, about: { ...content.about, descriptionEn: e.target.value } })
                }
                className={inputCls}
              />
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-4 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
              Deskripsi Tiga Pilar Utama (Knowledge, Nature, Communities)
            </h3>
            {content.pillars.map((pillar, idx) => (
              <div key={pillar.id} className="rounded-md border border-neutral-200 bg-neutral-50/50 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-neutral-400">#{pillar.id}</span>
                  <span className="font-heading text-sm font-bold text-neutral-900">{pillar.key}</span>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-neutral-600">Deskripsi (ID)</label>
                    <textarea
                      rows={2}
                      value={pillar.description}
                      onChange={(e) => {
                        const updated = [...content.pillars];
                        updated[idx].description = e.target.value;
                        setContent({ ...content, pillars: updated });
                      }}
                      className={inputCls}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-neutral-600">Deskripsi (EN)</label>
                    <textarea
                      rows={2}
                      value={pillar.descriptionEn || ""}
                      onChange={(e) => {
                        const updated = [...content.pillars];
                        updated[idx].descriptionEn = e.target.value;
                        setContent({ ...content, pillars: updated });
                      }}
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: PERJALANAN KAMI (TIMELINE) ────────────────────────────── */}
      {activeTab === "growth" && (
        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-neutral-900">03 — Bagaimana Kami Bertumbuh (Perjalanan Kami)</h2>
              <p className="text-xs text-neutral-500">Linimasa perjalanan dari 2021 hingga sekarang (Halaman 04).</p>
            </div>
            <button
              type="button"
              onClick={addTimelineItem}
              className="rounded-lg bg-gradient-to-r from-[#0D5C4D] to-[#116958] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-[#0D5C4D]/20 transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              + Tambah Tahun
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">Judul (ID)</label>
              <input
                value={content.growth.title}
                onChange={(e) =>
                  setContent({ ...content, growth: { ...content.growth, title: e.target.value } })
                }
                className={inputCls}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">Judul (EN)</label>
              <input
                value={content.growth.titleEn || ""}
                onChange={(e) =>
                  setContent({ ...content, growth: { ...content.growth, titleEn: e.target.value } })
                }
                className={inputCls}
              />
            </div>
          </div>

          <div className="space-y-4 pt-3">
            {content.growth.timeline.map((item, idx) => (
              <div key={idx} className="rounded-md border border-neutral-200 p-4 bg-neutral-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {item.year}
                    </span>
                    <span className="font-medium text-sm text-neutral-900">{item.label}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteTimelineItem(idx)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Hapus
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-neutral-600">Tahun</label>
                    <input
                      value={item.year}
                      onChange={(e) => updateTimelineItem(idx, "year", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-neutral-600">Label Fase (ID)</label>
                    <input
                      value={item.label}
                      onChange={(e) => updateTimelineItem(idx, "label", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-neutral-600">Label Fase (EN)</label>
                    <input
                      value={item.labelEn || ""}
                      onChange={(e) => updateTimelineItem(idx, "labelEn", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-neutral-600">Deskripsi (ID)</label>
                    <textarea
                      rows={2}
                      value={item.description}
                      onChange={(e) => updateTimelineItem(idx, "description", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-semibold text-neutral-600">Deskripsi (EN)</label>
                    <textarea
                      rows={2}
                      value={item.descriptionEn || ""}
                      onChange={(e) => updateTimelineItem(idx, "descriptionEn", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 4: FRAMEWORK & GEDSI ─────────────────────────────────────── */}
      {activeTab === "framework" && (
        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm space-y-5">
          <div>
            <h2 className="text-base font-bold text-neutral-900">04 — Cara Kami Bekerja (Framework & GEDSI)</h2>
            <p className="text-xs text-neutral-500">Sesuai Halaman 05 Organization Profile 2026.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                Prinsip Utama (ID)
              </label>
              <textarea
                rows={2}
                value={content.framework.title}
                onChange={(e) =>
                  setContent({ ...content, framework: { ...content.framework, title: e.target.value } })
                }
                className={inputCls}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                Prinsip Utama (EN)
              </label>
              <textarea
                rows={2}
                value={content.framework.titleEn || ""}
                onChange={(e) =>
                  setContent({ ...content, framework: { ...content.framework, titleEn: e.target.value } })
                }
                className={inputCls}
              />
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
              5 Langkah Kerangka Kerja (01 Listen - 05 Learn)
            </h3>
            {content.framework.steps.map((step, idx) => (
              <div key={step.step} className="grid grid-cols-1 gap-3 sm:grid-cols-12 rounded border border-neutral-200 p-3 bg-neutral-50/40 items-center">
                <div className="sm:col-span-2 font-mono text-xs font-bold text-neutral-900">
                  {step.step} {step.title}
                </div>
                <div className="sm:col-span-5">
                  <input
                    value={step.desc}
                    onChange={(e) => {
                      const updated = [...content.framework.steps];
                      updated[idx].desc = e.target.value;
                      setContent({ ...content, framework: { ...content.framework, steps: updated } });
                    }}
                    placeholder="Deskripsi ID"
                    className={inputCls}
                  />
                </div>
                <div className="sm:col-span-5">
                  <input
                    value={step.descEn || ""}
                    onChange={(e) => {
                      const updated = [...content.framework.steps];
                      updated[idx].descEn = e.target.value;
                      setContent({ ...content, framework: { ...content.framework, steps: updated } });
                    }}
                    placeholder="Deskripsi EN"
                    className={inputCls}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-100 pt-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
              Pendekatan GEDSI
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                  Uraian GEDSI (ID)
                </label>
                <textarea
                  rows={3}
                  value={content.framework.gedsiText}
                  onChange={(e) =>
                    setContent({ ...content, framework: { ...content.framework, gedsiText: e.target.value } })
                  }
                  className={inputCls}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                  Uraian GEDSI (EN)
                </label>
                <textarea
                  rows={3}
                  value={content.framework.gedsiTextEn || ""}
                  onChange={(e) =>
                    setContent({ ...content, framework: { ...content.framework, gedsiTextEn: e.target.value } })
                  }
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 5: AJAKAN KOLABORASI (CTA) ───────────────────────────────── */}
      {activeTab === "cta" && (
        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm space-y-5">
          <div>
            <h2 className="text-base font-bold text-neutral-900">05 — Bagian Penutup & Ajakan Kolaborasi</h2>
            <p className="text-xs text-neutral-500">Teks ajakan di bagian bawah beranda.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                Judul Ajakan (ID)
              </label>
              <input
                value={content.cta.title}
                onChange={(e) =>
                  setContent({ ...content, cta: { ...content.cta, title: e.target.value } })
                }
                className={inputCls}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                Judul Ajakan (EN)
              </label>
              <input
                value={content.cta.titleEn || ""}
                onChange={(e) =>
                  setContent({ ...content, cta: { ...content.cta, titleEn: e.target.value } })
                }
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                Deskripsi (ID)
              </label>
              <textarea
                rows={3}
                value={content.cta.description}
                onChange={(e) =>
                  setContent({ ...content, cta: { ...content.cta, description: e.target.value } })
                }
                className={inputCls}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                Deskripsi (EN)
              </label>
              <textarea
                rows={3}
                value={content.cta.descriptionEn || ""}
                onChange={(e) =>
                  setContent({ ...content, cta: { ...content.cta, descriptionEn: e.target.value } })
                }
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border-t border-neutral-100 pt-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                Teks Tombol Aksi (ID)
              </label>
              <input
                value={content.cta.primaryButtonText}
                onChange={(e) =>
                  setContent({ ...content, cta: { ...content.cta, primaryButtonText: e.target.value } })
                }
                className={inputCls}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-600">
                Tautan Tombol Aksi
              </label>
              <input
                value={content.cta.primaryButtonLink}
                onChange={(e) =>
                  setContent({ ...content, cta: { ...content.cta, primaryButtonLink: e.target.value } })
                }
                className={inputCls}
              />
            </div>
          </div>
        </div>
      )}

      {/* Global Save Button */}
      <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
        <span className="text-xs text-neutral-500">
          Klik tombol simpan untuk memperbarui isi beranda publik secara instan.
        </span>
        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isPending}
          className="rounded-lg bg-gradient-to-r from-[#0D5C4D] to-[#116958] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#0D5C4D]/25 transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50"
        >
          {isPending ? "Menyimpan…" : "Simpan Konten Beranda"}
        </button>
      </div>
    </div>
  );
}
