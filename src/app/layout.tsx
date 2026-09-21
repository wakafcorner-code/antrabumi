import type { Metadata, Viewport } from "next";
import { Montserrat, Inter } from "next/font/google";
import "./globals.css";

// Font Abstraction: Montserrat for body and Inter/Montserrat for heading
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "ANTRABUMI — Connecting Knowledge, Nature, & Communities",
    template: "%s | ANTRABUMI",
  },
  description:
    "ANTRABUMI is an independent organization working at the intersection of knowledge, nature, and communities.",
  metadataBase: new URL(process.env.APP_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ANTRABUMI — Connecting Knowledge, Nature, & Communities",
    description:
      "ANTRABUMI is an independent organization working at the intersection of knowledge, nature, and communities.",
    url: "/",
    siteName: "ANTRABUMI",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ANTRABUMI — Connecting Knowledge, Nature, & Communities",
    description:
      "ANTRABUMI is an independent organization working at the intersection of knowledge, nature, and communities.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${montserrat.variable} ${inter.variable} scroll-smooth`}>
      <body className="flex min-h-screen flex-col bg-white text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white">
        {/* Skip to Main Content Link (WCAG 2.2 AA) */}
        <a href="#main-content" className="skip-link">
          Lewati ke Konten Utama
        </a>

        {children}
      </body>
    </html>
  );
}
