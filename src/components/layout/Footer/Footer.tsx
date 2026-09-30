import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getLanguage } from "@/lib/i18n/language";

import { findAllSettings } from "@/server/repositories/settings.repository";

const navLinksID = [
  { label: "Tentang", href: "/tentang" },
  { label: "Pengalaman", href: "/experience" },
  { label: "Inisiatif", href: "/inisiatif" },
  { label: "Pengetahuan", href: "/pengetahuan" },
  { label: "Kolaborasi", href: "/kolaborasi" },
];

const navLinksEN = [
  { label: "About", href: "/tentang" },
  { label: "Experiences", href: "/experience" },
  { label: "Initiatives", href: "/inisiatif" },
  { label: "Knowledge", href: "/pengetahuan" },
  { label: "Collaboration", href: "/kolaborasi" },
];

export const Footer: React.FC = async () => {
  const currentYear = new Date().getFullYear();
  const [lang, settingsList] = await Promise.all([
    getLanguage(),
    findAllSettings(),
  ]);

  const settings: Record<string, string> = {};
  for (const s of settingsList) {
    if (s.value) settings[s.key] = s.value;
  }

  const navLinks = lang === "EN" ? navLinksEN : navLinksID;
  const siteName = settings["site_name"] || "ANTRABUMI";
  const logoUrl = settings["site_logo_dark_url"] || settings["site_logo_url"] || "/brand/logo-white.svg";
  const siteTagline = settings["site_tagline"] || "Connecting Knowledge, Nature, & Communities.";
  const contactEmail = settings["contact_email"] || "hello@antrabumi.org";
  const contactPhone = settings["contact_phone"] || "+62-823-3038-7505";
  const contactAddress = settings["contact_address"] || "TRIGHA Creative Hub, Sudirman St, 08, Belitung";

  const instagramUrl = settings["instagram_url"];
  const linkedinUrl = settings["linkedin_url"];
  const youtubeUrl = settings["youtube_url"];
  const twitterUrl = settings["twitter_url"];
  const facebookUrl = settings["facebook_url"];
  const whatsappUrl = settings["whatsapp_url"];

  return (
    <footer role="contentinfo" className="border-t border-[#0D5C4D]/30 bg-[#0B1E1A] pt-16 pb-10 text-neutral-400">
      <Container size="default">
        <div className="grid grid-cols-1 gap-12 border-b border-white/10 pb-12 md:grid-cols-12">
          {/* Column 1: Identity & Tagline (5 of 12) */}
          <div className="space-y-4 md:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={siteName}
                  className="h-9 md:h-10 w-auto max-w-[200px] object-contain"
                />
              ) : (
                <span className="font-heading text-xl font-bold tracking-tight text-white hover:text-neutral-200">
                  {siteName}
                </span>
              )}
            </Link>
            <p className="max-w-xs text-sm font-medium leading-relaxed text-[#E5A823]">
              {siteTagline}
            </p>
            <p className="max-w-xs text-xs leading-relaxed text-neutral-400">
              {lang === "EN"
                ? "An independent organization working at the intersection of knowledge, nature, and communities."
                : "Organisasi independen yang bekerja di persimpangan pengetahuan, alam, dan komunitas."}
            </p>

            {/* Social Media Links */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram ANTRABUMI"
                  className="rounded-full border border-white/10 bg-white/5 p-2 text-neutral-400 transition-all hover:border-[#E5A823]/50 hover:bg-[#E5A823]/10 hover:text-[#E5A823]"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              )}

              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn ANTRABUMI"
                  className="rounded-full border border-white/10 bg-white/5 p-2 text-neutral-400 transition-all hover:border-[#E5A823]/50 hover:bg-[#E5A823]/10 hover:text-[#E5A823]"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              )}

              {youtubeUrl && (
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube ANTRABUMI"
                  className="rounded-full border border-white/10 bg-white/5 p-2 text-neutral-400 transition-all hover:border-[#E5A823]/50 hover:bg-[#E5A823]/10 hover:text-[#E5A823]"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}

              {twitterUrl && (
                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X / Twitter ANTRABUMI"
                  className="rounded-full border border-white/10 bg-white/5 p-2 text-neutral-400 transition-all hover:border-[#E5A823]/50 hover:bg-[#E5A823]/10 hover:text-[#E5A823]"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}

              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook ANTRABUMI"
                  className="rounded-full border border-white/10 bg-white/5 p-2 text-neutral-400 transition-all hover:border-[#E5A823]/50 hover:bg-[#E5A823]/10 hover:text-[#E5A823]"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}


              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp ANTRABUMI"
                  title="Hubungi kami via WhatsApp"
                  className="group inline-flex h-10 w-10 items-center justify-center
      rounded-full border border-[#25D366]/30
      bg-[#25D366]/10 text-[#25D366]
      transition-all duration-300
      hover:scale-110 hover:border-[#25D366]
      hover:bg-[#25D366] hover:text-white
      hover:shadow-lg hover:shadow-[#25D366]/20
      focus-visible:outline-none focus-visible:ring-2
      focus-visible:ring-[#25D366] focus-visible:ring-offset-2
      focus-visible:ring-offset-neutral-900"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.5 0 .15 5.35.15 11.93c0 2.1.55 4.16 1.6 5.98L0 24l6.24-1.64a11.9 11.9 0 0 0 5.84 1.49h.01c6.58 0 11.93-5.35 11.93-11.93 0-3.19-1.24-6.18-3.5-8.44ZM12.08 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.7.97.99-3.61-.24-.37a9.87 9.87 0 0 1-1.52-5.27c0-5.47 4.45-9.92 9.93-9.92a9.86 9.86 0 0 1 7.02 2.91 9.87 9.87 0 0 1 2.9 7.02c0 5.47-4.45 9.92-9.92 9.92Zm5.44-7.43c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.18.2-.35.23-.65.08-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.68-2.08-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.53.08-.8.38-.28.3-1.06 1.03-1.06 2.51s1.08 2.91 1.23 3.11c.15.2 2.12 3.24 5.13 4.54.72.31 1.28.5 1.71.64.72.23 1.37.2 1.89.12.58-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.13-.28-.2-.58-.35Z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Navigation (3 of 12) */}
          <div className="space-y-4 md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#E5A823]">
              {lang === "EN" ? "Navigation" : "Navigasi"}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition-colors hover:text-[#E5A823]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact (4 of 12) */}
          <div className="space-y-4 md:col-span-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[#E5A823]">
              {lang === "EN" ? "Contact" : "Kontak"}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href={`mailto:${contactEmail}`} className="transition-colors hover:text-[#E5A823]">
                  {contactEmail}
                </a>
              </li>
              <li>
                <a href={`tel:${contactPhone.replace(/[^0-9+]/g, "")}`} className="transition-colors hover:text-[#E5A823]">
                  {contactPhone}
                </a>
              </li>
              <li className="pt-1 text-xs text-neutral-500 leading-relaxed whitespace-pre-line">
                {contactAddress}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-start justify-between gap-4 pt-8 text-xs text-neutral-600 sm:flex-row sm:items-center">
          <p>
            © {currentYear} ANTRABUMI.{" "}
            {lang === "EN" ? "All rights reserved." : "Seluruh hak dilindungi."}
          </p>
          <div className="flex items-center gap-6">
            <a href="https://www.antrabumi.org" className="transition-colors hover:text-[#E5A823]">
              www.antrabumi.org
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};
