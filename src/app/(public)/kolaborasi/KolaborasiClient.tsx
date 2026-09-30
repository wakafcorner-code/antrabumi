"use client";

import React, { useState, useRef } from "react";
import { Container } from "@/components/ui/Container";
import type { PublicPartnerItem } from "@/server/repositories/partner.repository";

interface KolaborasiClientProps {
  lang: string;
  partners?: PublicPartnerItem[];
}

type CollaborationMode = "PROJECT" | "NETWORK" | "GENERAL";

const BIDANG_OPTIONS = [
  { id: "esg", label: "ESG & Keberlanjutan", labelEn: "ESG & Sustainability" },
  { id: "community", label: "Pemberdayaan Komunitas", labelEn: "Community Engagement" },
  { id: "nbs", label: "Solusi Berbasis Alam", labelEn: "Nature-based Solutions" },
  { id: "research", label: "Kemitraan Riset & Asesmen", labelEn: "Research & Assessment" },
  { id: "capacity", label: "Penguatan Kapasitas", labelEn: "Capacity Strengthening" },
  { id: "storytelling", label: "Pengetahuan & Storytelling", labelEn: "Knowledge & Storytelling" },
];

export function KolaborasiClient({ lang, partners = [] }: KolaborasiClientProps) {
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
    const bidangLabel = bidangObj ? (isEn ? bidangObj.labelEn : bidangObj.label) : selectedBidang;

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
      finalMessage = `${formData.message}\n\n---\n${isEn ? "Portfolio / Profile Link:" : "Tautan Portofolio / Profil:"} ${formData.portfolioUrl}`;
    }

    const defaultSubject =
      mode === "PROJECT"
        ? (isEn ? `Project Collaboration: ${bidangLabel}` : `Kolaborasi Proyek: ${bidangLabel}`)
        : mode === "NETWORK"
        ? (isEn ? `Associate Network Interest: ${bidangLabel}` : `Gabung Jaringan Associate: ${bidangLabel}`)
        : (isEn ? `ANTRABUMI Collaboration Inquiry` : `Kerja Sama ANTRABUMI`);

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      organization: formData.organization || undefined,
      areaOfInterest: areaOfInterestLabel,
      subject: formData.subject || defaultSubject,
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
      <section className="relative overflow-hidden border-b border-neutral-200/70 bg-gradient-to-b from-[#FBF9F5] via-white to-white py-24 sm:py-32">
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#0D5C4D_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute -top-32 right-10 h-96 w-96 rounded-full bg-[#0D5C4D]/5 blur-3xl pointer-events-none" />
        <Container size="default">
          <div className="relative z-10 max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0D5C4D]/20 bg-white/80 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-[#0D5C4D] shadow-xs">
              <span className="h-2 w-2 rounded-full bg-[#0D5C4D] animate-pulse" />
              {isEn ? "Collaboration Hub" : "Ruang Kolaborasi"}
            </div>
            <h1 className="font-heading text-4xl sm:text-6xl lg:text-[68px] font-extrabold leading-[1.08] tracking-tight text-neutral-950">
              {isEn ? (
                <>
                  Change is <span className="text-[#0D5C4D]">never built</span> alone.
                </>
              ) : (
                <>
                  Perubahan <span className="text-[#0D5C4D]">tidak pernah</span> dibangun sendirian.
                </>
              )}
            </h1>
            <p className="text-lg leading-relaxed text-neutral-600 sm:text-xl font-normal max-w-2xl">
              {isEn
                ? "ANTRABUMI works alongside organizations, communities, researchers, and individuals who bring problems, knowledge, or ideas to be cultivated into real-world impact."
                : "ANTRABUMI bekerja bersama organisasi, komunitas, peneliti, dan individu yang memiliki persoalan, pengetahuan, atau gagasan yang ingin dikembangkan menjadi dampak nyata."}
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => scrollToForm("PROJECT")}
                className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-[#0D5C4D] via-[#116958] to-[#147A66] px-7 py-4 text-sm font-semibold text-white shadow-xl shadow-[#0D5C4D]/25 transition-all hover:shadow-2xl hover:shadow-[#0D5C4D]/35 hover:-translate-y-0.5"
              >
                <span>{isEn ? "Discuss a Project" : "Mulai Diskusi Proyek"}</span>
                <span>→</span>
              </button>
              <button
                type="button"
                onClick={() => scrollToForm("NETWORK")}
                className="inline-flex items-center gap-2.5 rounded-xl border border-[#0D5C4D]/30 bg-[#0D5C4D]/5 px-7 py-4 text-sm font-semibold text-[#0D5C4D] transition-all hover:bg-[#0D5C4D]/10 hover:-translate-y-0.5"
              >
                <span>{isEn ? "Join Associate Network" : "Gabung Jaringan Associate"}</span>
                <span>✦</span>
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── 2. DUA RUANG KOLABORASI ──────────────────────────────────── */}
      <section className="bg-[#FAF9F5] py-24 border-b border-neutral-200/70">
        <Container size="default">
          <div className="max-w-2xl mb-16">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-[#0D5C4D]">
              01 / {isEn ? "Two Collaboration Pathways" : "Dua Ruang Kolaborasi"}
            </p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-neutral-950 sm:text-4xl lg:text-5xl">
              {isEn ? "Find the right way to connect with ANTRABUMI." : "Temukan cara yang tepat untuk terhubung dengan ANTRABUMI."}
            </h2>
            <p className="mt-4 text-base text-neutral-600 leading-relaxed">
              {isEn
                ? "Whether as an institution seeking strategic partnership, or as an expert contributing specialized knowledge."
                : "Baik sebagai institusi yang mencari kemitraan strategis, maupun sebagai individu pakar yang ingin menyumbangkan keahlian."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Card 01: Collaborate on a Project */}
            <div className="group relative flex flex-col justify-between rounded-3xl border border-neutral-200/90 bg-white p-8 sm:p-11 shadow-sm transition-all duration-300 hover:border-[#0D5C4D]/50 hover:shadow-[0_20px_45px_-12px_rgba(13,92,77,0.12)] hover:-translate-y-1.5" style={{ borderTop: "4px solid #0D5C4D" }}>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl sm:text-4xl font-black text-[#0D5C4D]/25 group-hover:text-[#0D5C4D] transition-colors">
                    01
                  </span>
                  <span className="rounded-full bg-[#0D5C4D]/10 px-3.5 py-1 text-xs font-semibold text-[#0D5C4D] font-mono">
                    {isEn ? "Organizations & Partners" : "Organisasi & Lembaga"}
                  </span>
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-950 group-hover:text-[#0D5C4D] transition-colors">
                  {isEn ? "Collaborate on a Project" : "Kolaborasi Proyek & Riset"}
                </h3>
                <p className="text-base leading-relaxed text-neutral-600">
                  {isEn
                    ? "For organizations, institutions, communities, governments, academia, corporations, or development partners with challenges, ideas, research, or programs to work on together."
                    : "Untuk organisasi, institusi, komunitas, pemerintah, akademisi, perusahaan, atau mitra pembangunan yang memiliki persoalan, gagasan, riset, atau program yang ingin dikerjakan bersama."}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {(isEn ? ["ESG & Climate", "Community Assessment", "Research & Policy"] : ["ESG & Iklim", "Asesmen Komunitas", "Riset & Kebijakan"]).map((chip) => (
                    <span key={chip} className="rounded-md bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-600">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => scrollToForm("PROJECT")}
                  className="inline-flex items-center gap-2 font-bold text-[#0D5C4D] transition-all group-hover:gap-3 group-hover:text-[#116958]"
                >
                  <span>{isEn ? "Discuss a Project" : "Diskusikan Proyek"}</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Card 02: Join the ANTRABUMI Network */}
            <div className="group relative flex flex-col justify-between rounded-3xl border border-neutral-200/90 bg-white p-8 sm:p-11 shadow-sm transition-all duration-300 hover:border-[#D96B27]/50 hover:shadow-[0_20px_45px_-12px_rgba(217,107,39,0.12)] hover:-translate-y-1.5" style={{ borderTop: "4px solid #D96B27" }}>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl sm:text-4xl font-black text-[#D96B27]/25 group-hover:text-[#D96B27] transition-colors">
                    02
                  </span>
                  <span className="rounded-full bg-[#D96B27]/10 px-3.5 py-1 text-xs font-semibold text-[#D96B27] font-mono">
                    {isEn ? "Individuals & Experts" : "Individu & Pakar"}
                  </span>
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-950 group-hover:text-[#D96B27] transition-colors">
                  {isEn ? "Join the ANTRABUMI Network" : "Bergabung ke Jaringan ANTRABUMI"}
                </h3>
                <p className="text-base leading-relaxed text-neutral-600">
                  {isEn
                    ? "For individuals with experience, expertise, knowledge, or perspectives who want to contribute to ANTRABUMI's work as part of our multidisciplinary associate network."
                    : "Untuk individu dengan pengalaman, keahlian, pengetahuan, atau perspektif yang ingin berkontribusi dalam pekerjaan ANTRABUMI sebagai bagian dari jaringan associate multidisiplin."}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {(isEn ? ["Field Researchers", "Storytellers & Facilitators", "Thematic Experts"] : ["Peneliti Lapangan", "Fasilitator & Cerita", "Pakar Tematik"]).map((chip) => (
                    <span key={chip} className="rounded-md bg-[#D96B27]/10 px-2.5 py-1 text-[11px] font-medium text-[#D96B27]">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => scrollToForm("NETWORK")}
                  className="inline-flex items-center gap-2 font-bold text-[#D96B27] transition-all group-hover:gap-3 group-hover:text-[#B8571B]"
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

      {/* ─── 4. MITRA & JEJARING KOLABORASI ───────────────────────────── */}
      <section id="mitra" className="bg-white py-24 border-b border-neutral-100">
        <Container size="default">
          <div className="mb-14 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#0D5C4D]">
                04 / {isEn ? "Partners & Collaborative Network" : "Mitra & Jejaring Kolaborasi"}
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
                {isEn ? "Ecosystem Across Sectors" : "Bekerja Bersama Berbagai Sektor"}
              </h2>
              <p className="mt-3 max-w-2xl text-base text-neutral-600">
                {isEn
                  ? "ANTRABUMI bridges diverse perspectives so that changes are contextual, grounded, and sustainable."
                  : "ANTRABUMI mempertemukan berbagai perspektif agar perubahan yang terjadi bersifat kontekstual, membumi, dan berkelanjutan."}
              </p>
            </div>
          </div>

          {partners && partners.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="group flex flex-col justify-between rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-6 transition-all hover:border-[#0D5C4D]/40 hover:bg-white hover:shadow-md hover:-translate-y-1"
                >
                  <div className="flex h-16 items-center justify-center">
                    {partner.logoUrl ? (
                      <img
                        src={partner.logoUrl}
                        alt={partner.logoAlt || partner.name}
                        className="max-h-12 max-w-[140px] object-contain filter grayscale group-hover:grayscale-0 transition-all"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0D5C4D]/10 text-sm font-bold text-[#0D5C4D]">
                        {partner.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 border-t border-neutral-100 pt-3 text-center">
                    <h3 className="text-sm font-bold text-neutral-900 group-hover:text-[#0D5C4D] transition-colors">
                      {partner.name}
                    </h3>
                    {partner.category && (
                      <span className="mt-1 inline-block rounded-md bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600">
                        {partner.category}
                      </span>
                    )}
                    {partner.description && (
                      <p className="mt-2 text-xs text-neutral-500 line-clamp-2">
                        {partner.description}
                      </p>
                    )}
                    {partner.website && (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-[#0D5C4D] hover:underline"
                      >
                        <span>{isEn ? "Visit Website" : "Kunjungi Situs"}</span>
                        <span>↗</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  sector: isEn ? "Local Communities" : "Komunitas Lokal & Adat",
                  desc: isEn
                    ? "Co-creating contextual solutions based on local wisdom, field practices, and participatory engagement."
                    : "Membangun solusi kontekstual berbasis kearifan lokal, praktik lapangan, dan pelibatan aktif.",
                  icon: "👥",
                },
                {
                  sector: isEn ? "Government & Policy Makers" : "Pemerintah & Pembuat Kebijakan",
                  desc: isEn
                    ? "Connecting field evidence and policy recommendations to strengthen regional sustainability planning."
                    : "Menghubungkan bukti lapangan dengan rekomendasi kebijakan untuk memperkuat perencanaan wilayah.",
                  icon: "🏛️",
                },
                {
                  sector: isEn ? "Academia & Researchers" : "Akademisi & Peneliti",
                  desc: isEn
                    ? "Translating scientific assessments and multi-disciplinary studies into actionable field practice."
                    : "Menerjemahkan kajian ilmiah dan riset multi-disiplin menjadi aksi nyata di lapangan.",
                  icon: "🔬",
                },
                {
                  sector: isEn ? "Civil Society (CSO/NGO)" : "Masyarakat Sipil & NGO",
                  desc: isEn
                    ? "Fostering collective action and shared learning on conservation, climate, and inclusive community advocacy."
                    : "Memperkuat aksi bersama dan pembelajaran kolektif dalam advokasi konservasi dan GEDSI.",
                  icon: "🌱",
                },
                {
                  sector: isEn ? "Private Sector" : "Sektor Swasta & Industri",
                  desc: isEn
                    ? "Developing contextual ESG roadmaps, responsible supply chains, and nature-based solutions."
                    : "Mengembangkan peta jalan ESG, rantai pasok bertanggung jawab, dan solusi berbasis alam.",
                  icon: "🏢",
                },
                {
                  sector: isEn ? "Development Partners" : "Mitra Pembangunan & Donor",
                  desc: isEn
                    ? "Designing and delivering measurable, impactful, and community-rooted intervention programs."
                    : "Merancang dan mengeksekusi program intervensi yang terukur, berdampak, dan berakar pada masyarakat.",
                  icon: "🤝",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-6 transition-all hover:border-[#0D5C4D]/30 hover:bg-white hover:shadow-sm"
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-heading text-base font-bold text-neutral-950">
                    {item.sector}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          )}
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
              <div className="space-y-3 pt-6 border-t border-white/10">
                <a
                  href="mailto:hello@antrabumi.org"
                  className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:bg-white/[0.08] hover:border-white/20"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0D5C4D]/30 border border-[#0D5C4D]/40 text-[#4ADE80]">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#E5A823]">
                      Email
                    </span>
                    <p className="text-sm font-medium text-white group-hover:text-[#4ADE80] transition-colors">
                      hello@antrabumi.org
                    </p>
                  </div>
                </a>

                <a
                  href="https://wa.me/6282330387505"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:bg-white/[0.08] hover:border-white/20"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0D5C4D]/30 border border-[#0D5C4D]/40 text-[#4ADE80]">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#E5A823]">
                      {isEn ? "WhatsApp / Phone" : "WhatsApp / Telepon"}
                    </span>
                    <p className="text-sm font-medium text-white group-hover:text-[#4ADE80] transition-colors">
                      +62-823-3038-7505
                    </p>
                  </div>
                </a>

                <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D96B27]/20 border border-[#D96B27]/30 text-[#FB923C]">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#E5A823]">
                      {isEn ? "Secretariat / Hub" : "Sekretariat / Hub"}
                    </span>
                    <p className="text-sm text-neutral-300">
                      TRIGHA Creative Hub, Sudirman St. 08, Belitung
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-neutral-300">
                    <span className="h-2 w-2 rounded-full bg-[#4ADE80] animate-pulse" />
                    <span>{isEn ? "Response typically within 1-2 business days" : "Tanggapan dalam 1-2 hari kerja"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Interactive Form Box (7 cols) */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-6 sm:p-9 backdrop-blur-2xl shadow-2xl">
                {/* Pathway / Mode Switcher */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#E5A823]">
                      {isEn ? "Select Collaboration Space:" : "Pilih Ruang Kolaborasi:"}
                    </label>
                    <span className="text-[11px] text-neutral-400">
                      {isEn ? "Choose your collaboration profile" : "Pilih profil keterlibatan Anda"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {/* 01: Project Discussion */}
                    <button
                      type="button"
                      onClick={() => setMode("PROJECT")}
                      className={`group relative flex flex-col justify-between rounded-2xl p-4 text-left transition-all duration-300 border ${
                        mode === "PROJECT"
                          ? "border-[#0D5C4D] bg-gradient-to-br from-[#0D5C4D]/40 to-[#0A3D33]/60 text-white shadow-lg shadow-[#0D5C4D]/30 ring-1 ring-[#0D5C4D]"
                          : "border-white/10 bg-white/[0.04] text-neutral-300 hover:border-white/20 hover:bg-white/[0.08]"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                          mode === "PROJECT"
                            ? "bg-[#0D5C4D] text-[#4ADE80]"
                            : "bg-white/10 text-neutral-300 group-hover:bg-white/15"
                        }`}>
                          <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7h-4V4a1 1 0 00-1-1H9a1 1 0 00-1 1v3H4a1 1 0 00-1 1v11a2 2 0 002 2h14a2 2 0 002-2V8a1 1 0 00-1-1zM10 5h4v2h-4V5zm-6 5h16v3H4v-3zm0 5h16v4H4v-4z" />
                          </svg>
                        </div>
                        <span className={`h-2.5 w-2.5 rounded-full transition-all ${
                          mode === "PROJECT" ? "bg-[#4ADE80] shadow-sm shadow-[#4ADE80]" : "bg-white/20"
                        }`} />
                      </div>
                      <div>
                        <span className="block text-sm font-heading font-bold text-white tracking-wide">
                          {isEn ? "Project Discussion" : "Diskusi Proyek"}
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-neutral-300">
                          {isEn ? "For Organizations & Partners" : "Untuk Organisasi & Mitra"}
                        </span>
                      </div>
                    </button>

                    {/* 02: Associate Network */}
                    <button
                      type="button"
                      onClick={() => setMode("NETWORK")}
                      className={`group relative flex flex-col justify-between rounded-2xl p-4 text-left transition-all duration-300 border ${
                        mode === "NETWORK"
                          ? "border-[#D96B27] bg-gradient-to-br from-[#D96B27]/40 to-[#8C3A0A]/60 text-white shadow-lg shadow-[#D96B27]/30 ring-1 ring-[#D96B27]"
                          : "border-white/10 bg-white/[0.04] text-neutral-300 hover:border-white/20 hover:bg-white/[0.08]"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                          mode === "NETWORK"
                            ? "bg-[#D96B27] text-[#FDBA74]"
                            : "bg-white/10 text-neutral-300 group-hover:bg-white/15"
                        }`}>
                          <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zM6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <span className={`h-2.5 w-2.5 rounded-full transition-all ${
                          mode === "NETWORK" ? "bg-[#FDBA74] shadow-sm shadow-[#FDBA74]" : "bg-white/20"
                        }`} />
                      </div>
                      <div>
                        <span className="block text-sm font-heading font-bold text-white tracking-wide">
                          {isEn ? "Associate Network" : "Jaringan Associate"}
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-neutral-300">
                          {isEn ? "For Individuals & Experts" : "Untuk Individu & Pakar"}
                        </span>
                      </div>
                    </button>

                    {/* 03: General Inquiries */}
                    <button
                      type="button"
                      onClick={() => setMode("GENERAL")}
                      className={`group relative flex flex-col justify-between rounded-2xl p-4 text-left transition-all duration-300 border ${
                        mode === "GENERAL"
                          ? "border-[#2B8282] bg-gradient-to-br from-[#2B8282]/40 to-[#124D4D]/60 text-white shadow-lg shadow-[#2B8282]/30 ring-1 ring-[#2B8282]"
                          : "border-white/10 bg-white/[0.04] text-neutral-300 hover:border-white/20 hover:bg-white/[0.08]"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                          mode === "GENERAL"
                            ? "bg-[#2B8282] text-[#99F6E4]"
                            : "bg-white/10 text-neutral-300 group-hover:bg-white/15"
                        }`}>
                          <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <span className={`h-2.5 w-2.5 rounded-full transition-all ${
                          mode === "GENERAL" ? "bg-[#99F6E4] shadow-sm shadow-[#99F6E4]" : "bg-white/20"
                        }`} />
                      </div>
                      <div>
                        <span className="block text-sm font-heading font-bold text-white tracking-wide">
                          {isEn ? "General Inquiries" : "Kerja Sama Umum"}
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-neutral-300">
                          {isEn ? "Questions & Discussions" : "Pertanyaan & Diskusi"}
                        </span>
                      </div>
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
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-neutral-300">
                          {isEn ? "Collaboration Area / Focus:" : "Bidang Kolaborasi / Fokus:"}
                        </label>
                        <span className="text-[11px] text-neutral-400">
                          {isEn ? "Select area" : "Pilih bidang"}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {BIDANG_OPTIONS.map((opt) => {
                          const isSelected = selectedBidang === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setSelectedBidang(opt.id)}
                              className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                                isSelected
                                  ? "bg-[#E5A823] text-neutral-950 shadow-md shadow-[#E5A823]/30 scale-[1.02]"
                                  : "border border-white/10 bg-white/5 text-neutral-300 hover:bg-white/10 hover:border-white/20"
                              }`}
                            >
                              {isEn ? opt.labelEn : opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Name and Email */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-mono font-semibold uppercase tracking-wide text-neutral-300">
                          {isEn ? "Full Name *" : "Nama Lengkap *"}
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder={isEn ? "Your full name" : "Nama lengkap Anda"}
                          className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-[#E5A823] focus:bg-white/10 focus:ring-1 focus:ring-[#E5A823]/50"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-mono font-semibold uppercase tracking-wide text-neutral-300">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="email@domain.com"
                          className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-[#E5A823] focus:bg-white/10 focus:ring-1 focus:ring-[#E5A823]/50"
                        />
                      </div>
                    </div>

                    {/* Phone & Organization/Role */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-mono font-semibold uppercase tracking-wide text-neutral-300">
                          {isEn ? "WhatsApp / Phone" : "WhatsApp / No. Telepon"}
                        </label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+62 8..."
                          className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-[#E5A823] focus:bg-white/10 focus:ring-1 focus:ring-[#E5A823]/50"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-mono font-semibold uppercase tracking-wide text-neutral-300">
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
                              ? (isEn ? "e.g. Green Earth Foundation, Forestry Agency, etc." : "cth. Yayasan Bumi Lestari, Ditjen KSDAE, dsb.")
                              : mode === "NETWORK"
                              ? (isEn ? "e.g. Ecological Researcher, Community Facilitator, etc." : "cth. Peneliti Ekologi, Fasilitator Komunitas, dsb.")
                              : (isEn ? "Organization, institution, or company (optional)" : "Nama lembaga atau instansi (opsional)")
                          }
                          className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-[#E5A823] focus:bg-white/10 focus:ring-1 focus:ring-[#E5A823]/50"
                        />
                      </div>
                    </div>

                    {/* Network Portfolio URL if Network mode */}
                    {mode === "NETWORK" && (
                      <div>
                        <label className="mb-1.5 block text-xs font-mono font-semibold uppercase tracking-wide text-neutral-300">
                          {isEn ? "Portfolio / LinkedIn / CV Link (Optional)" : "Tautan Portofolio / LinkedIn / Profil (Opsional)"}
                        </label>
                        <input
                          type="url"
                          name="portfolioUrl"
                          value={formData.portfolioUrl}
                          onChange={handleInputChange}
                          placeholder={isEn ? "https://linkedin.com/in/... or link to portfolio/CV" : "https://linkedin.com/in/... atau tautan berkas/CV"}
                          className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-[#E5A823] focus:bg-white/10 focus:ring-1 focus:ring-[#E5A823]/50"
                        />
                      </div>
                    )}

                    {/* Subject */}
                    <div>
                      <label className="mb-1.5 block text-xs font-mono font-semibold uppercase tracking-wide text-neutral-300">
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
                            ? (isEn ? "e.g. Community-Based Ecotourism Planning in..." : "cth. Pengembangan Ekowisata Berbasis Komunitas di...")
                            : mode === "NETWORK"
                            ? (isEn ? "e.g. Interest in Joining as Environmental Research Associate" : "cth. Ketertarikan Bergabung sebagai Associate Riset Lingkungan")
                            : (isEn ? "e.g. Cross-Sector Knowledge Exchange" : "cth. Subjek pesan atau kerja sama")
                        }
                        className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-[#E5A823] focus:bg-white/10 focus:ring-1 focus:ring-[#E5A823]/50"
                      />
                    </div>

                    {/* Message Area */}
                    <div>
                      <label className="mb-1.5 block text-xs font-mono font-semibold uppercase tracking-wide text-neutral-300">
                        {mode === "PROJECT"
                          ? isEn
                            ? "Tell us about the challenge, idea, or program *"
                            : "Ceritakan persoalan, gagasan, atau program yang ingin dikerjakan bersama *"
                          : mode === "NETWORK"
                          ? isEn
                            ? "Tell us about your experience and how you would like to contribute *"
                            : "Ceritakan pengalaman Anda dan bentuk kontribusi yang ingin dibagikan *"
                          : isEn
                          ? "Message / Inquiry *"
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
                            ? (isEn ? "Describe the context, field challenges, intended objectives, and how ANTRABUMI can collaborate with your organization..." : "Ceritakan latar belakang, tantangan di lapangan, tujuan yang ingin dicapai, dan bagaimana ANTRABUMI dapat berkolaborasi...")
                            : mode === "NETWORK"
                            ? (isEn ? "Share your research/field background, unique expertise you bring, and your availability for joint initiatives..." : "Jelaskan pengalaman lapangan/riset Anda, perspektif yang Anda bawa, dan ketersediaan waktu untuk inisiatif bersama...")
                            : (isEn ? "Share your questions, ideas, or partnership opportunities you would like to explore..." : "Bagikan pertanyaan, tanggapan, atau peluang kolaborasi Anda...")
                        }
                        className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-[#E5A823] focus:bg-white/10 focus:ring-1 focus:ring-[#E5A823]/50 leading-relaxed"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-xl bg-gradient-to-r from-[#0D5C4D] via-[#116958] to-[#147A66] py-3.5 text-sm font-semibold text-white shadow-xl shadow-[#0D5C4D]/30 transition-all hover:shadow-[#0D5C4D]/50 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#E5A823]/50 disabled:opacity-50"
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
                        ? "Your data will be securely handled and reviewed by the ANTRABUMI team."
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
