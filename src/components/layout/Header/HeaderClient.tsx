"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Language } from "@prisma/client";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { LanguageToggle } from "@/components/ui/LanguageToggle";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubMenuItem {
  labelId: string;
  labelEn: string;
  descId: string;
  descEn: string;
  href: string;
  icon: string;
  accent?: string; // optional accent color for icon bg
}

interface NavItem {
  labelId: string;
  labelEn: string;
  href: string;
  children?: SubMenuItem[];
  footerLinkId?: string;
  footerLinkEn?: string;
}

// ─── Navigation Data ──────────────────────────────────────────────────────────

const navItems: NavItem[] = [
  {
    labelId: "Tentang",
    labelEn: "About",
    href: "/tentang",
    footerLinkId: "Lihat Profil Lengkap →",
    footerLinkEn: "View Full Profile →",
    children: [
      {
        labelId: "Siapa Kami",
        labelEn: "Who We Are",
        descId: "Organisasi yang menghubungkan pengetahuan, alam, dan komunitas",
        descEn: "An organization connecting knowledge, nature, and communities",
        href: "/tentang",
        icon: "🌿",
        accent: "bg-emerald-50 text-emerald-700",
      },
      {
        labelId: "Perjalanan Kami",
        labelEn: "Our Journey",
        descId: "Jejak organisasi sejak 2021 hingga babak baru 2026",
        descEn: "Organizational milestones from 2021 to a new chapter in 2026",
        href: "/tentang#perjalanan",
        icon: "🗺️",
        accent: "bg-amber-50 text-amber-700",
      },
      {
        labelId: "Tim & Keahlian",
        labelEn: "Team & Expertise",
        descId: "Kumpulan pakar lintas disiplin yang bekerja bersama",
        descEn: "A multidisciplinary team combining diverse perspectives",
        href: "/tentang#tim",
        icon: "🤝",
        accent: "bg-blue-50 text-blue-700",
      },
    ],
  },
  {
    labelId: "Inisiatif",
    labelEn: "Initiatives",
    href: "/inisiatif",
    footerLinkId: "Semua Inisiatif →",
    footerLinkEn: "All Initiatives →",
    children: [
      {
        labelId: "Kampanye",
        labelEn: "Campaign",
        descId: "Advokasi publik, aksi bersama, dan kesadaran lingkungan",
        descEn: "Public advocacy, collective action, and environmental awareness",
        href: "/inisiatif?kategori=campaign",
        icon: "📢",
        accent: "bg-orange-50 text-orange-700",
      },
      {
        labelId: "Proyek",
        labelEn: "Project",
        descId: "Program lapangan, intervensi kontekstual, dan pendampingan",
        descEn: "Field programs, contextual interventions, and stewardship",
        href: "/inisiatif?kategori=project",
        icon: "🌱",
        accent: "bg-emerald-50 text-emerald-700",
      },
    ],
  },
  {
    labelId: "Pengetahuan",
    labelEn: "Knowledge",
    href: "/pengetahuan",
    footerLinkId: "Semua Publikasi →",
    footerLinkEn: "All Publications →",
    children: [
      {
        labelId: "Artikel",
        labelEn: "Article",
        descId: "Wawasan, analisis kontekstual, dan refleksi pemikiran",
        descEn: "Insights, contextual perspectives, and reflective analyses",
        href: "/pengetahuan?kategori=artikel",
        icon: "✍️",
        accent: "bg-violet-50 text-violet-700",
      },
      {
        labelId: "Riset & Publikasi",
        labelEn: "Research & Publication",
        descId: "Laporan kajian berbasis bukti, policy briefs, dan riset",
        descEn: "Evidence-based assessment reports, policy briefs, and studies",
        href: "/pengetahuan?kategori=riset",
        icon: "📑",
        accent: "bg-blue-50 text-blue-700",
      },
      {
        labelId: "Cerita Lapangan",
        labelEn: "Field Story",
        descId: "Catatan interaksi nyata bersama masyarakat di bentang alam",
        descEn: "Real stories from communities, places, and living realities",
        href: "/pengetahuan?kategori=cerita",
        icon: "🧭",
        accent: "bg-amber-50 text-amber-700",
      },
    ],
  },
  {
    labelId: "Kolaborasi",
    labelEn: "Collaboration",
    href: "/kolaborasi",
    footerLinkId: "Mulai Kolaborasi →",
    footerLinkEn: "Start Collaboration →",
    children: [
      {
        labelId: "Mitra & Jaringan",
        labelEn: "Partners & Network",
        descId: "Lembaga, pemerintah, akademisi, dan sektor swasta yang bergabung",
        descEn: "Organizations, governments, academics, and private sector partners",
        href: "/kolaborasi#mitra",
        icon: "🌐",
        accent: "bg-teal-50 text-teal-700",
      },
      {
        labelId: "Hubungi Kami",
        labelEn: "Contact Us",
        descId: "Diskusikan peluang kemitraan dan program bersama ANTRABUMI",
        descEn: "Discuss partnership opportunities and programs with ANTRABUMI",
        href: "/kolaborasi#formulir",
        icon: "💬",
        accent: "bg-emerald-50 text-emerald-700",
      },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface HeaderClientProps {
  currentLanguage: Language;
  logoUrl?: string;
  siteName?: string;
}

export const HeaderClient: React.FC<HeaderClientProps> = ({
  currentLanguage,
  logoUrl,
  siteName = "ANTRABUMI",
}) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isEn = currentLanguage === "EN";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const handleMouseEnter = (key: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(key);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 200);
  };

  const toggleMobile = (key: string) =>
    setMobileExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? "border-b border-neutral-200/80 bg-white/98 shadow-sm backdrop-blur-md"
          : "border-b border-transparent bg-white/90 backdrop-blur-sm"
      }`}
    >
      <Container size="default">
        <div className="flex h-16 sm:h-[68px] items-center justify-between">

          {/* ── Logo / Brand ── */}
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0D5C4D]"
          >
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt={siteName}
                className="h-8 sm:h-9 w-auto max-w-[160px] sm:max-w-[200px] object-contain"
              />
            ) : (
              <span className="font-heading text-lg font-bold tracking-tight text-neutral-950 sm:text-xl">
                {siteName}
              </span>
            )}
          </Link>

          {/* ── Desktop Navigation ── */}
          <nav aria-label="Navigasi Utama" className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const hasSub = item.children && item.children.length > 0;
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              const label = isEn ? item.labelEn : item.labelId;
              const isOpen = activeDropdown === item.href;

              if (hasSub) {
                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(item.href)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* Nav trigger button */}
                    <div className="flex items-center">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-haspopup="true"
                        onClick={() =>
                          setActiveDropdown((prev) =>
                            prev === item.href ? null : item.href
                          )
                        }
                        className={`group flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D5C4D] ${
                          isActive || isOpen
                            ? "bg-[#0D5C4D]/8 text-[#0D5C4D] font-semibold"
                            : "text-neutral-600 hover:bg-neutral-100/80 hover:text-neutral-900"
                        }`}
                      >
                        <span>{label}</span>
                        <svg
                          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
                            isOpen ? "rotate-180 text-[#0D5C4D]" : "text-neutral-400 group-hover:text-neutral-600"
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    {/* ── Dropdown Panel ── */}
                    {isOpen && (
                      <div
                        className="absolute left-1/2 top-full -translate-x-1/2 pt-3 z-50"
                        style={{ minWidth: "340px" }}
                        onMouseEnter={() => handleMouseEnter(item.href)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {/* Panel container */}
                        <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-2xl ring-1 ring-neutral-950/5">

                          {/* Header section */}
                          <div className="bg-gradient-to-r from-[#0B1F1A] to-[#0D5C4D] px-5 py-4">
                            <Link
                              href={item.href}
                              onClick={() => setActiveDropdown(null)}
                              className="group flex items-center justify-between"
                            >
                              <div>
                                <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#E5A823]">
                                  ANTRABUMI
                                </p>
                                <h3 className="mt-0.5 font-heading text-base font-bold text-white">
                                  {label}
                                </h3>
                              </div>
                              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all group-hover:bg-[#E5A823] group-hover:text-neutral-900">
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                              </span>
                            </Link>
                          </div>

                          {/* Menu items grid */}
                          <div className="p-2.5">
                            <div className="space-y-0.5">
                              {item.children?.map((sub) => {
                                const subLabel = isEn ? sub.labelEn : sub.labelId;
                                const subDesc = isEn ? sub.descEn : sub.descId;
                                const isSubActive = pathname === sub.href;

                                return (
                                  <Link
                                    key={sub.href}
                                    href={sub.href}
                                    onClick={() => setActiveDropdown(null)}
                                    className={`group flex items-start gap-3.5 rounded-xl p-3 transition-all ${
                                      isSubActive
                                        ? "bg-[#0D5C4D]/8"
                                        : "hover:bg-neutral-50"
                                    }`}
                                  >
                                    {/* Icon */}
                                    <span
                                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base transition-transform group-hover:scale-110 ${
                                        sub.accent
                                          ? sub.accent
                                          : "bg-neutral-100 text-neutral-600"
                                      }`}
                                    >
                                      {sub.icon}
                                    </span>

                                    {/* Text */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between gap-2">
                                        <p className={`text-xs font-semibold leading-tight transition-colors ${
                                          isSubActive
                                            ? "text-[#0D5C4D]"
                                            : "text-neutral-900 group-hover:text-[#0D5C4D]"
                                        }`}>
                                          {subLabel}
                                        </p>
                                        <svg
                                          className="h-3 w-3 shrink-0 text-neutral-300 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:text-[#0D5C4D]"
                                          fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                        >
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                        </svg>
                                      </div>
                                      <p className="mt-0.5 text-[11px] leading-snug text-neutral-500 line-clamp-2">
                                        {subDesc}
                                      </p>
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>

                          {/* Footer CTA */}
                          {(item.footerLinkId || item.footerLinkEn) && (
                            <div className="border-t border-neutral-100 bg-neutral-50/70 px-4 py-2.5">
                              <Link
                                href={item.href}
                                onClick={() => setActiveDropdown(null)}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0D5C4D] transition-all hover:gap-2.5 hover:text-[#116958]"
                              >
                                {isEn ? item.footerLinkEn : item.footerLinkId}
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // Regular nav link (no children)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D5C4D] ${
                    isActive
                      ? "bg-[#0D5C4D]/8 font-semibold text-[#0D5C4D]"
                      : "text-neutral-600 hover:bg-neutral-100/80 hover:text-neutral-900"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* ── Desktop Utilities ── */}
          <div className="hidden items-center gap-3 md:flex">
            <LanguageToggle current={currentLanguage} />
            <Button variant="primary" size="sm" href="/kolaborasi#formulir">
              {isEn ? "Contact Us" : "Hubungi Kami"}
            </Button>
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-primary md:hidden transition-colors"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? "Tutup menu" : "Buka menu"}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* ── Mobile Navigation Drawer ── */}
        {isMobileMenuOpen && (
          <nav
            id="mobile-menu"
            aria-label="Navigasi Mobile"
            className="border-t border-neutral-100 pb-5 pt-3 md:hidden"
          >
            <ul className="flex flex-col gap-0.5">
              {navItems.map((item) => {
                const hasSub = item.children && item.children.length > 0;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                const label = isEn ? item.labelEn : item.labelId;
                const isExpanded = mobileExpanded[item.href];

                if (hasSub) {
                  return (
                    <li key={item.href} className="flex flex-col">
                      <div className="flex items-center justify-between rounded-xl hover:bg-neutral-50 transition-colors">
                        <Link
                          href={item.href}
                          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                            isActive
                              ? "text-[#0D5C4D] font-semibold"
                              : "text-neutral-800"
                          }`}
                        >
                          {label}
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleMobile(item.href)}
                          className="flex h-10 w-10 items-center justify-center text-neutral-400 hover:text-[#0D5C4D] transition-colors"
                          aria-label={`Toggle submenu ${label}`}
                        >
                          <svg
                            className={`h-4 w-4 transition-transform duration-200 ${
                              isExpanded ? "rotate-180 text-[#0D5C4D]" : ""
                            }`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>

                      {/* Expanded Submenu */}
                      {isExpanded && (
                        <div className="mx-2 mb-2 rounded-2xl border border-neutral-200/70 bg-neutral-50/80 overflow-hidden">
                          {/* Submenu header */}
                          <div className="bg-gradient-to-r from-[#0D5C4D]/10 to-[#0D5C4D]/5 px-4 py-2.5">
                            <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#0D5C4D]">
                              {isEn ? label : label}
                            </p>
                          </div>
                          <div className="p-2 space-y-0.5">
                            {item.children?.map((sub) => {
                              const subLabel = isEn ? sub.labelEn : sub.labelId;
                              return (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-neutral-700 transition-colors hover:bg-white hover:text-[#0D5C4D]"
                                >
                                  <span
                                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm ${
                                      sub.accent ? sub.accent : "bg-neutral-100"
                                    }`}
                                  >
                                    {sub.icon}
                                  </span>
                                  <span className="font-medium">{subLabel}</span>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </li>
                  );
                }

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-[#0D5C4D]/8 text-[#0D5C4D] font-semibold"
                          : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 flex items-center justify-between gap-4 border-t border-neutral-100 pt-4 px-1">
              <LanguageToggle current={currentLanguage} />
              <Button variant="primary" size="md" href="/kolaborasi#formulir">
                {isEn ? "Contact Us" : "Hubungi Kami"}
              </Button>
            </div>
          </nav>
        )}
      </Container>
    </header>
  );
};
