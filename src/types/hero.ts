/**
 * src/types/hero.ts
 * Types and defaults for the Homepage Hero Slider and its CMS configuration.
 */

export interface HeroSlide {
  id: string;
  tagline: string;        // ID (e.g. "ANTRABUMI — Organisasi Independen")
  taglineEn?: string;      // EN (e.g. "ANTRABUMI — Independent Organization")
  title: string;          // ID headline
  titleEn?: string;        // EN headline
  subtitle: string;       // ID body
  subtitleEn?: string;     // EN body
  primaryCtaText?: string;
  primaryCtaTextEn?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaTextEn?: string;
  secondaryCtaLink?: string;
  imageUrl?: string;      // Background or contextual visual image URL
  order: number;
  isActive: boolean;
}

export interface HeroSliderConfig {
  autoplay: boolean;
  intervalMs: number;       // e.g. 6000 ms
  transitionEffect: "fade" | "slide";
  pauseOnHover: boolean;
}

export const DEFAULT_HERO_CONFIG: HeroSliderConfig = {
  autoplay: true,
  intervalMs: 6000,
  transitionEffect: "fade",
  pauseOnHover: true,
};

export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: "slide-1",
    tagline: "ANTRABUMI — Organisasi Independen",
    taglineEn: "ANTRABUMI — Independent Organization",
    title: "Connecting Knowledge, Nature, & Communities.",
    titleEn: "Connecting Knowledge, Nature, & Communities.",
    subtitle:
      "Organisasi independen yang bekerja di persimpangan pengetahuan, alam, dan komunitas — menghubungkan riset, pengalaman lapangan, dan kolaborasi untuk perubahan yang bermakna.",
    subtitleEn:
      "An independent organization working at the intersection of knowledge, nature, and communities — connecting research, field experience, and collaboration for meaningful change.",
    primaryCtaText: "Hubungi Kami",
    primaryCtaTextEn: "Contact Us",
    primaryCtaLink: "/kolaborasi#kontak",
    secondaryCtaText: "Tentang ANTRABUMI",
    secondaryCtaTextEn: "About ANTRABUMI",
    secondaryCtaLink: "/tentang",
    imageUrl: "",
    order: 1,
    isActive: true,
  },
  {
    id: "slide-2",
    tagline: "Pendekatan Kami — 01 Listen to 05 Learn",
    taglineEn: "Our Framework — 01 Listen to 05 Learn",
    title: "Menjembatani Riset & Tindakan Nyata di Lapangan.",
    titleEn: "Bridging Research & Real Action in the Field.",
    subtitle:
      "Setiap kolaborasi dimulai dari memahami konteks, bukan menawarkan solusi instan. Kami mempertemukan bukti ilmiah dengan kearifan komunitas lokal.",
    subtitleEn:
      "Every collaboration begins with understanding context, not offering instant solutions. We bridge scientific evidence with local community knowledge.",
    primaryCtaText: "Lihat Inisiatif",
    primaryCtaTextEn: "View Initiatives",
    primaryCtaLink: "/inisiatif",
    secondaryCtaText: "Kerangka Kerja",
    secondaryCtaTextEn: "Our Framework",
    secondaryCtaLink: "/tentang#framework",
    imageUrl: "",
    order: 2,
    isActive: true,
  },
  {
    id: "slide-3",
    tagline: "Pusat Pengetahuan — Knowledge Hub",
    taglineEn: "Knowledge Hub — Evidence-Based Learning",
    title: "Mendokumentasikan Pembelajaran untuk Keberlanjutan.",
    titleEn: "Documenting Lessons for Long-Term Sustainability.",
    subtitle:
      "Publikasi, laporan asesmen lapangan, dan artikel mendalam untuk mendukung pengambilan keputusan yang lebih inklusif dan berkelanjutan.",
    subtitleEn:
      "Publications, field assessments, and in-depth articles supporting more inclusive and sustainable decision-making.",
    primaryCtaText: "Eksplorasi Pengetahuan",
    primaryCtaTextEn: "Explore Knowledge",
    primaryCtaLink: "/pengetahuan",
    secondaryCtaText: "Bermitra dengan Kami",
    secondaryCtaTextEn: "Partner with Us",
    secondaryCtaLink: "/kolaborasi",
    imageUrl: "",
    order: 3,
    isActive: true,
  },
];
