import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { site } from "@/lib/content";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { SectionNav } from "@/components/ui/SectionNav";
import { CursorGlow } from "@/components/ui/CursorGlow";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Tropical Luxury Residences by ${site.developer}`,
    template: `%s · ${site.name}`,
  },
  description: site.subtagline,
  keywords: [
    "Codename Coral",
    "Mayfair Housing",
    "Mira Road luxury apartments",
    "tropical residences Mumbai",
    "2 BHK 3 BHK Mira Road",
    "deck residences",
  ],
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.subtagline,
    url: site.url,
    siteName: site.name,
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.subtagline,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: site.url },
};

export const viewport: Viewport = {
  themeColor: "#06181d",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Residence",
  name: site.name,
  description: site.subtagline,
  url: site.url,
  address: {
    "@type": "PostalAddress",
    streetAddress: "MTNL Road, near Jangid Circle",
    addressLocality: "Mira Road East",
    addressRegion: "Maharashtra",
    addressCountry: "IN",
  },
  identifier: {
    "@type": "PropertyValue",
    propertyID: "MahaRERA",
    value: site.rera,
  },
  developer: {
    "@type": "Organization",
    name: site.developer,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#overview"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-coral-400 focus:px-4 focus:py-2 focus:text-ocean-950"
        >
          Skip to content
        </a>
        <ScrollProgress />
        <CursorGlow />
        <SectionNav />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
