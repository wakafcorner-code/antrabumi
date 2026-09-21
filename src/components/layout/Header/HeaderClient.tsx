"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Language } from "@prisma/client";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { LanguageToggle } from "@/components/ui/LanguageToggle";

const navLinks = [
  { labelId: "Tentang", labelEn: "About", href: "/tentang" },
  { labelId: "Pengalaman", labelEn: "Experiences", href: "/experience" },
  { labelId: "Inisiatif", labelEn: "Initiatives", href: "/inisiatif" },
  { labelId: "Pengetahuan", labelEn: "Knowledge", href: "/pengetahuan" },
  { labelId: "Kolaborasi", labelEn: "Collaboration", href: "/kolaborasi" },
];

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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b transition-all duration-200 ${
        isScrolled
          ? "border-neutral-200 bg-white/98 shadow-sm backdrop-blur-md"
          : "border-transparent bg-white/90 backdrop-blur-sm"
      }`}
    >
      <Container size="default">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo / Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0D5C4D]"
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={siteName}
                className="h-8 sm:h-9 md:h-10 w-auto max-w-[160px] sm:max-w-[200px] object-contain transition-all"
              />
            ) : (
              <span className="font-heading text-lg font-bold tracking-tight text-neutral-950 sm:text-xl">
                {siteName}
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Navigasi Utama" className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              const label = currentLanguage === "EN" ? link.labelEn : link.labelId;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D5C4D] ${
                    isActive
                      ? "font-semibold text-[#0D5C4D] underline underline-offset-8 decoration-2 decoration-[#0D5C4D]"
                      : "font-medium text-neutral-600 hover:text-[#0D5C4D]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Utilities */}
          <div className="hidden items-center gap-4 md:flex">
            <LanguageToggle current={currentLanguage} />
            <Button variant="primary" size="sm" href="/kolaborasi#kontak">
              Hubungi Kami
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center justify-center rounded-md p-2 text-neutral-700 hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-primary md:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <nav
            id="mobile-menu"
            aria-label="Navigasi Mobile"
            className="border-t border-neutral-100 pb-6 pt-4 md:hidden"
          >
            <ul className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                const label = currentLanguage === "EN" ? link.labelEn : link.labelId;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                        isActive
                          ? "bg-[#0D5C4D]/10 text-[#0D5C4D] font-semibold"
                          : "text-neutral-700 hover:bg-neutral-50 hover:text-[#0D5C4D]"
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
              <LanguageToggle current={currentLanguage} />
              <Button variant="primary" size="md" href="/kolaborasi#kontak">
                Hubungi Kami
              </Button>
            </div>
          </nav>
        )}
      </Container>
    </header>
  );
};
