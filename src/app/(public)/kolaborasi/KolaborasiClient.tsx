"use client";

import React, { useState, useRef } from "react";
import { Container } from "@/components/ui/Container";

interface KolaborasiClientProps {
  lang: string;
}

type CollaborationMode = "PROJECT" | "NETWORK" | "GENERAL";

const BIDANG_OPTIONS = [
  { id: "esg", label: "ESG & Sustainability" },
  { id: "community", label: "Community Engagement" },
  { id: "nbs", label: "Nature-based Solutions" },
  { id: "research", label: "Research Partnership" },
  { id: "capacity", label: "Capacity Strengthening" },
  { id: "storytelling", label: "Knowledge & Storytelling" },
];

export function KolaborasiClient({ lang }: KolaborasiClientProps) {
  const isEn = lang === "EN";
  const formRef = useRef<HTMLDivElement>(null);

  // Form State
  const [mode, setMode] = useState<CollaborationMode>("PROJECT");
  const [selectedBidang, setSelectedBidang] = useState<string>("esg");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    subject: "",
    portfolioUrl: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const scrollToForm = (targetMode: CollaborationMode, bidangId?: string) => {
    setMode(targetMode);
    if (bidangId) {
      setSelectedBidang(bidangId);
    }
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const bidangObj = BIDANG_OPTIONS.find((b) => b.id === selectedBidang);
    const bidangLabel = bidangObj ? bidangObj.label : selectedBidang;

    let areaOfInterestLabel = "";
    if (mode === "PROJECT") {
      areaOfInterestLabel = `[Project Collaboration] ${bidangLabel}`;
    } else if (mode === "NETWORK") {
      areaOfInterestLabel = `[Network Associate] ${bidangLabel}`;
    } else {
      areaOfInterestLabel = `[General Inquiry] ${bidangLabel}`;
    }

    let finalMessage = formData.message;
    if (mode === "NETWORK" && formData.portfolioUrl) {
      finalMessage = `${formData.message}\n\n---\nTautan Portofolio/Profil: ${formData.portfolioUrl}`;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      organization: formData.organization || undefined,
      areaOfInterest: areaOfInterestLabel,
      subject: formData.subject || (mode === "PROJECT" ? `Kolaborasi Proyek: ${bidangLabel}` : mode === "NETWORK" ? `Gabung Jaringan Associate: ${bidangLabel}` : "Kerja Sama ANTRABUMI"),
      message: finalMessage,
    };

    try {
      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          organization: "",
          subject: "",
          portfolioUrl: "",
          message: "",
        });
      } else {
        setErrorMessage(data.error || "Gagal mengirim formulir. Mohon periksa kembali isian Anda.");
      }
    } catch (err) {
      setErrorMessage("Terjadi kesalahan koneksi. Silakan periksa jaringan internet Anda.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* ─── 1. HERO SECTION ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-neutral-100 bg-white py-24 sm:py-32">
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#0D5C4D_1px,transparent_1px)] [background-size:24px_24px]" />
        <Container size="default">
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0D5C4D]/20 bg-[#0D5C4D]/5 px-3.5 py-1 text-xs font-semibold tracking-widest uppercase text-[#0D5C4D]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0D5C4D]" />
              {isEn ? "Collaboration" : "Kolaborasi"}
            </div>
            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-neutral-950 sm:text-6xl">
              {isEn ? "Change is not built alone." : "Perubahan tidak dibangun sendirian."}
            </h1>
            <p className="text-lg leading-relaxed text-neutral-600 sm:text-xl">
              {isEn
                ? "ANTRABUMI works alongside those who bring problems, knowledge, resources, or ideas to be cultivated into real change."
                : "ANTRABUMI bekerja bersama mereka yang memiliki persoalan, pengetahuan, sumber daya, atau gagasan yang ingin dikembangkan menjadi perubahan."}
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => scrollToForm("PROJECT")}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#0D5C4D] via-[#116958] to-[#147A66] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#0D5C4D]/25 transition-all hover:shadow-xl hover:shadow-[#0D5C4D]/35 hover:-translate-y-0.5"
              >
                {isEn ? "Discuss a Project" : "Mulai Diskusi Proyek"}
                <span>→</span>
              </button>
              <button
                type="button"
                onClick={() => scrollToForm("NETWORK")}
                className="inline-flex items-center gap-2 rounded-xl border border-[#0D5C4D]/30 bg-[#0D5C4D]/5 px-6 py-3.5 text-sm font-semibold text-[#0D5C4D] transition-all hover:bg-[#0D5C4D]/10 hover:-translate-y-0.5"
              >
                {isEn ? "Join Associate Network" : "Gabung Jaringan Associate"}
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── 2. DUA RUANG KOLABORASI ──────────────────────────────────── */}
      <section className="bg-neutral-50/60 py-24 border-b border-neutral-100">
        <Container size="default">
          <div className="mb-14">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#0D5C4D]">
              01 / {isEn ? "Two Collaboration Pathways" : "Dua Ruang Kolaborasi"}
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
              {isEn ? "Find the right way to connect with ANTRABUMI." : "Temukan cara yang tepat untuk terhubung dengan ANTRABUMI."}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Card 01: Collaborate on a Project */}
            <div className="group relative flex flex-col justify-between rounded-3xl border border-neutral-200/90 bg-white p-8 sm:p-10 shadow-sm transition-all hover:border-[#0D5C4D]/50 hover:shadow-xl hover:-translate-y-1">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl font-black text-[#0D5C4D]/30 group-hover:text-[#0D5C4D] transition-colors">
                    01
                  </span>
                  <span className="rounded-full bg-[#0D5C4D]/10 px-3 py-1 text-xs font-semibold text-[#0D5C4D]">
                    {isEn ? "Organizations & Partners" : "Organisasi & Mitra"}
                  </span>
                </div>
                <h3 className="font-heading text-2xl font-bold text-neutral-950 group-hover:text-[#0D5C4D] transition-colors">
                  Collaborate on a Project
                </h3>
                <p className="text-base leading-relaxed text-neutral-600">
                  {isEn
                    ? "For organizations, institutions, communities, governments, academia, corporations, or development partners with challenges, ideas, research, or programs to work on together."
                    : "Untuk organisasi, institusi, komunitas, pemerintah, akademisi, perusahaan, atau mitra pembangunan yang memiliki persoalan, gagasan, riset, atau program yang ingin dikerjakan bersama."}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => scrollToForm("PROJECT")}
                  className="inline-flex items-center gap-2 font-semibold text-[#0D5C4D] transition-all group-hover:gap-3 group-hover:text-[#116958]"
                >
                  <span>{isEn ? "Discuss a Project" : "Diskusikan Proyek"}</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Card 02: Join the ANTRABUMI Network */}
            <div className="group relative flex flex-col justify-between rounded-3xl border border-neutral-200/90 bg-white p-8 sm:p-10 shadow-sm transition-all hover:border-[#D96B27]/50 hover:shadow-xl hover:-translate-y-1">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl font-black text-[#D96B27]/30 group-hover:text-[#D96B27] transition-colors">
                    02
                  </span>
                  <span className="rounded-full bg-[#D96B27]/10 px-3 py-1 text-xs font-semibold text-[#D96B27]">
                    {isEn ? "Individuals & Experts" : "Individu & Pakar"}
                  </span>
                </div>
                <h3 className="font-heading text-2xl font-bold text-neutral-950 group-hover:text-[#D96B27] transition-colors">
                  Join the ANTRABUMI Network
                </h3>
                <p className="text-base leading-relaxed text-neutral-600">
                  {isEn
                    ? "For individuals with experience, expertise, knowledge, or perspectives who want to contribute to ANTRABUMI's work as part of our associate network."
                    : "Untuk individu dengan pengalaman, keahlian, pengetahuan, atau perspektif yang ingin berkontribusi dalam pekerjaan ANTRABUMI sebagai bagian dari jaringan associate."}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => scrollToForm("NETWORK")}
                  className="inline-flex items-center gap-2 font-semibold text-[#D96B27] transition-all group-hover:gap-3 group-hover:text-[#B8571B]"
                >
                  <span>{isEn ? "Join the Network" : "Bergabung ke Jaringan"}</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── 3. BIDANG KOLABORASI ─────────────────────────────────────── */}
      <section className="bg-white py-24 border-b border-neutral-100">
        <Container size="default">
          <div className="mb-14">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#0D5C4D]">
              02 / {isEn ? "Collaboration Areas" : "Bidang Kolaborasi"}
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
              {isEn ? "Workspaces we can build together." : "Ruang kerja yang dapat dibentuk bersama."}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: "esg",
                title: "ESG & Sustainability",
                desc: isEn
                  ? "Context-driven sustainability strategies, assessments, and approaches."
                  : "Strategi, assessment, dan pendekatan keberlanjutan yang terhubung dengan konteks.",
                color: "#0D5C4D",
              },
              {
                id: "community",
                title: "Community Engagement",
                desc: isEn
                  ? "Participatory approaches to understanding and collaborating with local communities."
                  : "Pendekatan partisipatif untuk memahami dan bekerja bersama masyarakat.",
                color: "#D96B27",
              },
              {
                id: "nbs",
                title: "Nature-based Solutions",
                desc: isEn
                  ? "Approaches bridging ecosystems, resilience, and human necessities."
                  : "Pendekatan yang menghubungkan ekosistem, ketahanan, dan kebutuhan manusia.",
                color: "#116958",
              },
              {
                id: "research",
                title: "Research Partnership",
                desc: isEn
                  ? "Action-oriented research, assessment, field data, and knowledge translation for strategic decisions."
                  : "Riset, assessment, data, dan penerjemahan pengetahuan untuk keputusan.",
                color: "#2B8282",
              },
              {
                id: "capacity",
                title: "Capacity Strengthening",
                desc: isEn
                  ? "Capacity building grounded in real-world challenges, field realities, and practical execution."
                  : "Penguatan kapasitas yang berangkat dari kebutuhan nyata dan praktik.",
                color: "#E5A823",
              },
              {
                id: "storytelling",
                title: "Knowledge & Storytelling",
                desc: isEn
                  ? "Translating field experience and knowledge into accessible, actionable narratives."
                  : "Membawa pengetahuan dan pengalaman menjadi cerita yang dapat dipahami dan digunakan.",
                color: "#0D5C4D",
              },
            ].map((b) => (
              <div
                key={b.id}
                onClick={() => scrollToForm("PROJECT", b.id)}
                className="group relative cursor-pointer rounded-2xl border border-neutral-200/80 bg-white p-7 transition-all hover:border-[#0D5C4D]/40 hover:shadow-lg hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div
                    className="h-1.5 w-10 rounded-full mb-4"
                    style={{ backgroundColor: b.color }}
                  />
                  <h3 className="font-heading text-lg font-bold text-neutral-950 group-hover:text-[#0D5C4D] transition-colors">
                    {b.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-600">
                    {b.desc}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-neutral-400 group-hover:text-[#0D5C4D] transition-colors">
                  <span>{isEn ? "Collaborate in this area" : "Bekerja sama di bidang ini"}</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── 4. CARA BEKERJA BERSAMA KAMI ─────────────────────────────── */}
      <section className="bg-neutral-50/50 py-24 border-b border-neutral-100">
        <Container size="default">
          <div className="mb-14">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#0D5C4D]">
              03 / {isEn ? "Our Approach" : "Cara Bekerja Bersama Kami"}
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
              {isEn ? "Starting from real problems, not pre-packaged services." : "Mulai dari persoalan, bukan paket layanan."}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                num: "01",
                step: "Listen",
                desc: isEn
                  ? "Understanding context, genuine needs, and voices of all stakeholders involved."
                  : "Memahami konteks, kebutuhan, dan suara dari pihak-pihak yang terlibat.",
              },
              {
                num: "02",
                step: "Connect",
                desc: isEn
                  ? "Bringing together relevant perspectives, knowledge, capacities, and networks."
                  : "Mempertemukan perspektif, pengetahuan, kapasitas, dan jejaring yang relevan.",
              },
              {
                num: "03",
                step: "Co-create",
                desc: isEn
                  ? "Designing approaches and solutions collaboratively, not from a single side."
                  : "Merancang pendekatan dan solusi bersama, bukan dari satu sisi saja.",
              },
              {
                num: "04",
                step: "Act",
                desc: isEn
                  ? "Translating agreements into actionable, measurable, and tangible steps."
                  : "Menerjemahkan kesepakatan menjadi langkah nyata dan dapat dipelajari.",
              },
              {
                num: "05",
                step: "Learn",
                desc: isEn
                  ? "Utilizing experience to iteratively refine approaches and cultivate lasting knowledge."
                  : "Menggunakan pengalaman untuk memperbaiki pendekatan dan membangun pembelajaran.",
              },
            ].map((item, idx) => (
              <div
                key={item.num}
                className="relative rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-2xl font-bold text-[#0D5C4D]">
                    {item.num}
                  </span>
                  <h3 className="mt-3 font-heading text-lg font-bold text-neutral-950">
                    {item.step}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-neutral-100 flex items-center gap-1">
                  <div className="h-1 flex-1 rounded-full bg-[#0D5C4D]/15">
                    <div
                      className="h-1 rounded-full bg-[#0D5C4D]"
                      style={{ width: `${((idx + 1) / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── 5. HUBUNGI KAMI & FORM INTERAKTIF ────────────────────────── */}
      <section
        id="formulir"
        ref={formRef}
        className="relative overflow-hidden bg-[#0B1E1A] py-24 text-white"
      >
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-96 w-96 rounded-full bg-[#0D5C4D]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-96 w-96 rounded-full bg-[#E5A823]/10 blur-3xl pointer-events-none" />

        <Container size="default">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:items-start">
            {/* Left Description (5 cols) */}
            <div className="space-y-6 lg:col-span-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E5A823]/30 bg-[#E5A823]/10 px-3 py-1 text-xs font-semibold tracking-widest uppercase text-[#E5A823]">
                {isEn ? "Contact & Collaborate" : "Hubungi Kami"}
              </div>
              <h2 className="font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl text-white">
                {isEn ? "Have something to work on together?" : "Ada sesuatu yang ingin dikerjakan bersama?"}
              </h2>
              <p className="text-base leading-relaxed text-neutral-300">
                {isEn
                  ? "Share your challenges, ideas, or collaboration opportunities. Every collaboration begins with listening and understanding the real context."
                  : "Bagikan persoalan, gagasan, atau peluang kolaborasi Anda. Setiap kolaborasi bermula dari mendengarkan dan memahami konteks nyata."}
              </p>

              {/* Direct channels */}
              <div className="space-y-4 pt-4 text-sm border-t border-white/10">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#E5A823]">
                    Email
                  </p>
                  <a
                    href="mailto:hello@antrabumi.org"
                    className="text-neutral-300 hover:text-white transition-colors"
                  >
                    hello@antrabumi.org
                  </a>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#E5A823]">
                    WhatsApp / Telepon
                  </p>
                  <a
                    href="https://wa.me/6282330387505"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-300 hover:text-white transition-colors"
                  >
                    +62-823-3038-7505
                  </a>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#E5A823]">
                    Lokasi
                  </p>
                  <p className="text-neutral-400">
                    TRIGHA Creative Hub, Sudirman St. 08, Belitung
                  </p>
                </div>
              </div>
            </div>

            {/* Right Interactive Form Box (7 cols) */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-white/15 bg-white/5 p-6 sm:p-9 backdrop-blur-xl shadow-2xl">
                {/* Pathway / Mode Switcher */}
                <div className="mb-8">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
                    {isEn ? "Select Collaboration Space:" : "Pilih Ruang Kolaborasi:"}
                  </label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => setMode("PROJECT")}
                      className={`flex flex-col items-start gap-1 rounded-xl p-3 text-left transition-all border ${
                        mode === "PROJECT"
                          ? "border-[#0D5C4D] bg-[#0D5C4D] text-white shadow-md"
                          : "border-white/10 bg-white/5 text-neutral-300 hover:border-white/20 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-sm font-bold">💼 Diskusi Proyek</span>
                      <span className="text-[11px] opacity-80">Untuk Organisasi & Mitra</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMode("NETWORK")}
                      className={`flex flex-col items-start gap-1 rounded-xl p-3 text-left transition-all border ${
                        mode === "NETWORK"
                          ? "border-[#D96B27] bg-[#D96B27] text-white shadow-md"
                          : "border-white/10 bg-white/5 text-neutral-300 hover:border-white/20 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-sm font-bold">🤝 Jaringan Associate</span>
                      <span className="text-[11px] opacity-80">Untuk Individu & Pakar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMode("GENERAL")}
                      className={`flex flex-col items-start gap-1 rounded-xl p-3 text-left transition-all border ${
                        mode === "GENERAL"
                          ? "border-[#2B8282] bg-[#2B8282] text-white shadow-md"
                          : "border-white/10 bg-white/5 text-neutral-300 hover:border-white/20 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-sm font-bold">💬 Kerja Sama Umum</span>
                      <span className="text-[11px] opacity-80">Pertanyaan & Diskusi</span>
                    </button>
                  </div>
                </div>

                {submitSuccess ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#0D5C4D]/30 border border-[#0D5C4D] text-[#E5A823]">
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-white">
                      {isEn ? "Thank you for reaching out!" : "Terima Kasih! Formulir Berhasil Dikirim"}
                    </h3>
                    <p className="max-w-md mx-auto text-sm leading-relaxed text-neutral-300">
                      {isEn
                        ? "We have received your message. Our team at ANTRABUMI will review your inquiry and follow up shortly."
                        : "Pesan dan gagasan kolaborasi Anda telah masuk ke sistem kami. Tim ANTRABUMI akan segera menindaklanjuti untuk mendiskusikan langkah selanjutnya."}
                    </p>
                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => setSubmitSuccess(false)}
                        className="rounded-xl border border-white/20 bg-white/10 px-6 py-2.5 text-xs font-semibold text-white transition hover:bg-white/20"
                      >
                        {isEn ? "Send Another Message" : "Kirim Pengajuan Lain"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {errorMessage && (
                      <div className="rounded-xl border border-red-500/30 bg-red-950/40 p-3.5 text-xs text-red-200">
                        {errorMessage}
                      </div>
                    )}

                    {/* Category / Bidang selector */}
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                        {isEn ? "Collaboration Area / Focus:" : "Bidang Kolaborasi / Fokus:"}
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {BIDANG_OPTIONS.map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setSelectedBidang(opt.id)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                              selectedBidang === opt.id
                                ? "bg-[#E5A823] text-neutral-950 font-bold shadow-sm"
                                : "bg-white/10 text-neutral-300 hover:bg-white/15"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Name and Email */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-300">
                          {isEn ? "Full Name *" : "Nama Lengkap *"}
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder={isEn ? "Your full name" : "Nama lengkap Anda"}
                          className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-[#0D5C4D] focus:bg-white/15"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-300">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="email@domain.com"
                          className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-[#0D5C4D] focus:bg-white/15"
                        />
                      </div>
                    </div>

                    {/* Phone & Organization/Role */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-300">
                          {isEn ? "WhatsApp / Phone" : "WhatsApp / No. Telepon"}
                        </label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+62 8..."
                          className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-[#0D5C4D] focus:bg-white/15"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-300">
                          {mode === "PROJECT"
                            ? isEn
                              ? "Organization / Institution *"
                              : "Organisasi / Institusi / Perusahaan *"
                            : mode === "NETWORK"
                            ? isEn
                              ? "Background / Primary Discipline *"
                              : "Peran / Keahlian Utama *"
                            : isEn
                            ? "Organization / Institution (Optional)"
                            : "Organisasi / Institusi (Opsional)"}
                        </label>
                        <input
                          type="text"
                          name="organization"
                          required={mode === "PROJECT" || mode === "NETWORK"}
                          value={formData.organization}
                          onChange={handleInputChange}
                          placeholder={
                            mode === "PROJECT"
                              ? "e.g. Yayasan Bumi Lestari, Ditjen KSDAE, dsb."
                              : mode === "NETWORK"
                              ? "e.g. Peneliti Ekologi, Fasilitator Komunitas, dsb."
                              : "Nama lembaga atau instansi"
                          }
                          className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-[#0D5C4D] focus:bg-white/15"
                        />
                      </div>
                    </div>

                    {/* Network Portfolio URL if Network mode */}
                    {mode === "NETWORK" && (
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-300">
                          {isEn ? "Portfolio / LinkedIn / CV Link (Optional)" : "Tautan Portofolio / LinkedIn / Profil (Opsional)"}
                        </label>
                        <input
                          type="url"
                          name="portfolioUrl"
                          value={formData.portfolioUrl}
                          onChange={handleInputChange}
                          placeholder="https://linkedin.com/in/... atau tautan berkas"
                          className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-[#0D5C4D] focus:bg-white/15"
                        />
                      </div>
                    )}

                    {/* Subject */}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-300">
                        {mode === "PROJECT"
                          ? isEn
                            ? "Project / Collaboration Title *"
                            : "Judul Proyek / Topik Kolaborasi *"
                          : isEn
                          ? "Subject *"
                          : "Subjek Pesan *"}
                      </label>
                      <input
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder={
                          mode === "PROJECT"
                            ? "cth. Pengembangan Ekowisata Berbasis Komunitas di..."
                            : mode === "NETWORK"
                            ? "cth. Ketertarikan Bergabung sebagai Associate Riset Lingkungan"
                            : "Subjek pesan atau kerja sama"
                        }
                        className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-[#0D5C4D] focus:bg-white/15"
                      />
                    </div>

                    {/* Message Area */}
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-300">
                        {mode === "PROJECT"
                          ? isEn
                            ? "Tell us about the challenge, idea, or program *"
                            : "Ceritakan persoalan, gagasan, atau program yang ingin dikerjakan bersama *"
                          : mode === "NETWORK"
                          ? isEn
                            ? "Tell us about your experience and how you would like to contribute *"
                            : "Ceritakan pengalaman Anda dan bentuk kontribusi yang ingin dibagikan *"
                          : isEn
                          ? "Message *"
                          : "Pesan / Gagasan Kolaborasi *"}
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder={
                          mode === "PROJECT"
                            ? "Ceritakan latar belakang, tantangan di lapangan, tujuan yang ingin dicapai, dan bagaimana ANTRABUMI dapat berkolaborasi..."
                            : mode === "NETWORK"
                            ? "Jelaskan pengalaman lapangan/riset Anda, perspektif yang Anda bawa, dan ketersediaan waktu untuk proyek kolaboratif..."
                            : "Bagikan pertanyaan, tanggapan, atau peluang kolaborasi Anda..."
                        }
                        className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-[#0D5C4D] focus:bg-white/15 leading-relaxed"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-xl bg-gradient-to-r from-[#0D5C4D] via-[#116958] to-[#147A66] py-3.5 text-sm font-semibold text-white shadow-xl shadow-[#0D5C4D]/30 transition-all hover:shadow-[#0D5C4D]/50 hover:-translate-y-0.5 focus:outline-none disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="inline-flex items-center gap-2">
                          <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          {isEn ? "Sending..." : "Mengirimkan Data..."}
                        </span>
                      ) : mode === "PROJECT" ? (
                        isEn ? "Submit Project Inquiry →" : "Kirimkan Diskusi Proyek →"
                      ) : mode === "NETWORK" ? (
                        isEn ? "Submit Associate Interest →" : "Kirimkan Pendaftaran Jaringan →"
                      ) : (
                        isEn ? "Send Message →" : "Kirimkan Pesan Kolaborasi →"
                      )}
                    </button>
                    <p className="text-center text-[11px] text-neutral-400">
                      {isEn
                        ? "Data will be safely received by the ANTRABUMI admin team."
                        : "Data Anda akan langsung tersimpan dan ditinjau oleh tim administrator ANTRABUMI."}
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
