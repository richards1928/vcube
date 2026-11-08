import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { WhatsAppFloatingTrigger } from "@/components/ui/WhatsAppFloatingTrigger";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { PageTransition } from "@/components/providers/PageTransition";
import { SITE_CONFIG } from "@/config/site";

const outfit = localFont({
  src: [
    { path: "../../public/fonts/Outfit-300.woff2", weight: "300", style: "normal" },
    { path: "../../public/fonts/Outfit-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Outfit-500.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/Outfit-600.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/Outfit-700.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/Outfit-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-outfit",
  display: "swap",
});

const inter = localFont({
  src: [
    { path: "../../public/fonts/Inter-300.woff2", weight: "300", style: "normal" },
    { path: "../../public/fonts/Inter-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Inter-500.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/Inter-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

const cinzel = localFont({
  src: [
    { path: "../../public/fonts/Cinzel-400.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/Cinzel-600.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/Cinzel-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-cinzel",
  display: "optional",
});

export const viewport: Viewport = {
  themeColor: "#090B0D",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Vcube Infra Projects | From Foundation to Form",
    template: "%s | Vcube Infra Projects",
  },
  description:
    "Vcube Infra Projects specializes in turnkey civil construction, architectural interiors, and environmental branding for residential and commercial spaces.",
  keywords: [
    "Vcube Infra Projects",
    "Construction Hyderabad",
    "Turnkey Civil Contractors",
    "Architectural Interiors",
    "False Ceilings",
    "Commercial Furniture",
    "Flooring",
    "ACP Cladding",
    "Architectural Branding",
    "3D Signage",
    "Sun Control Films",
  ],
  authors: [{ name: "Vcube Infra Projects" }],
  openGraph: {
    title: "Vcube Infra Projects | Architectural Construction, Interiors & Branding",
    description: "From foundation to form: Structural execution, tailored interior environments, and physical brand identity.",
    url: "https://vcubeinfra.com",
    siteName: "Vcube Infra Projects",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "GeneralContractor",
        "@id": `${SITE_CONFIG.url}/#organization`,
        name: SITE_CONFIG.legalName,
        alternateName: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
        logo: `${SITE_CONFIG.url}/images/vcube-logo-transparent.png`,
        description: SITE_CONFIG.description,
        telephone: SITE_CONFIG.whatsapp.displayNumber,
        email: SITE_CONFIG.contact.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: `${SITE_CONFIG.contact.address.line1}, ${SITE_CONFIG.contact.address.line2}`,
          addressLocality: SITE_CONFIG.contact.address.city,
          addressRegion: SITE_CONFIG.contact.address.state,
          postalCode: SITE_CONFIG.contact.address.pincode,
          addressCountry: "IN",
        },
        openingHours: "Mo-Sa 09:00-19:00",
        priceRange: "$$$$",
        sameAs: [
          `https://wa.me/${SITE_CONFIG.whatsapp.phoneNumber}`,
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_CONFIG.url}/#website`,
        url: SITE_CONFIG.url,
        name: SITE_CONFIG.name,
        description: SITE_CONFIG.description,
        publisher: {
          "@id": `${SITE_CONFIG.url}/#organization`,
        },
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} ${cinzel.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#090B0D] text-[#F3F0E8] antialiased selection:bg-[#C6A36A] selection:text-[#090B0D] overflow-x-clip">
        <SmoothScrollProvider>
          <Navbar />
          <main className="flex-1 flex flex-col overflow-x-clip">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <WhatsAppFloatingTrigger />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
