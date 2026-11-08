import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Layers, Sparkles, Box, Info } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { InteriorShowcase3D } from "@/components/3d/InteriorShowcase3D";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Interior Services | Architectural Fit-outs & Finishes",
  description:
    "Comprehensive interior solutions by Vcube Infra Projects: False Ceilings, Bespoke Furniture, Luxury Flooring, Electrical MEP, Flutter Boards, Painting, Glass Films, Wallpapers, Foam Boards, Vinyl Stickers, and ACP Cladding.",
};

export default function InteriorsServicePage() {
  const service = SITE_CONFIG.services.interiors;

  // Grouped into attractive visual categories without omitting a single handwritten item
  const categories = [
    {
      title: "Ceiling & Technical Infrastructure",
      desc: "Integrated overhead architectural systems, concealed lighting troughs, and MEP wiring.",
      items: service.items.filter((i) =>
        ["false-ceilings", "electrical-work", "acp-cladding"].includes(i.id)
      ),
    },
    {
      title: "Flooring & Surface Finishes",
      desc: "Floor surface engineering, luxury stone honing, acoustic wall coverings, and Venetian plaster.",
      items: service.items.filter((i) =>
        ["flooring", "painting", "wallpapers"].includes(i.id)
      ),
    },
    {
      title: "Bespoke Joinery & Specialized Boards",
      desc: "Custom architectural millwork, modular executive clusters, and dynamic flutter boards.",
      items: service.items.filter((i) =>
        ["furniture", "flutter-boards"].includes(i.id)
      ),
    },
    {
      title: "Glazing Treatments & Graphic Media",
      desc: "Acoustic privacy manifestation films, foam board architectural substrates, and cast vinyl.",
      items: service.items.filter((i) =>
        ["glass-films", "foam-boards", "vinyl-stickers"].includes(i.id)
      ),
    },
  ];

  return (
    <div className="w-full pt-28 pb-24 bg-[#090B0D] text-[#F3F0E8] architectural-grid">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <ScrollReveal direction="left" distance={15} duration={0.6} className="mb-8">
          <Link
            href="/#services"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#A0A4A8] hover:text-[#C6A36A] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Services</span>
          </Link>
        </ScrollReveal>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <ScrollReveal direction="up" distance={30} duration={0.85} className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C6A36A]/30 bg-[#171A1D] px-3.5 py-1 text-[11px] font-mono tracking-widest text-[#C6A36A]">
              <span>SPATIAL & ARCHITECTURAL FINISHES</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#F3F0E8] font-heading leading-tight">
              Architectural Interiors & Bespoke Fit-outs
            </h1>

            <p className="text-base sm:text-lg text-[#A0A4A8] leading-relaxed">
              {service.heroHeadline}. Seamless turnkey interior execution spanning false ceilings, custom furniture, high-grade flooring, electrical MEP, flutter boards, painting, and ACP cladding.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <WhatsAppButton
                service="interiors"
                label="Discuss Interior Project"
                variant="primary"
              />
              <Link
                href="/queries"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-[#171A1D] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#F3F0E8] hover:border-[#C6A36A] transition-colors"
              >
                <span>Request Interior BOQ</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </ScrollReveal>

          {/* 3D Interior Showcase */}
          <ScrollReveal direction="up" distance={25} scale={0.98} duration={0.95} delay={0.15} className="lg:col-span-6 relative">
            <InteriorShowcase3D activeMaterial="false-ceilings" />
          </ScrollReveal>
        </div>

        {/* Client Specification Note on Flutter Boards */}
        <ScrollReveal direction="up" distance={20} duration={0.7} className="mb-14 rounded-xl border border-[#C6A36A]/30 bg-[#171A1D]/60 p-4 sm:p-5 flex items-start gap-3 text-xs text-[#A0A4A8]">
          <Info className="h-5 w-5 text-[#C6A36A] shrink-0 mt-0.5" />
          <div>
            <span className="text-[#F3F0E8] font-semibold block mb-0.5">
              Client Specification Integrity — &ldquo;Flutter Boards&rdquo;
            </span>
            <span>
              As noted in the client&apos;s handwritten requirements, the term <strong>&ldquo;Flutter Boards&rdquo;</strong> is preserved as an active specialized display/slat category until the client confirms its specific architectural nomenclature or proprietary specification.
            </span>
          </div>
        </ScrollReveal>

        {/* Categorized Services Matrix */}
        <div className="border-t border-[#C6A36A]/20 pt-16 space-y-16">
          <ScrollReveal direction="up" distance={25} duration={0.8}>
            <SectionHeading
              badge="02 // TAXONOMY"
              title="Complete Interior Services"
              subtitle="All 11 interior capabilities from the handwritten notes, organized into harmonious architectural systems."
            />
          </ScrollReveal>

          <div className="space-y-14">
            {categories.map((cat, catIdx) => (
              <ScrollReveal key={cat.title} direction="up" distance={25} duration={0.8} className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-white/10 pb-3 gap-2">
                  <h3 className="text-xl font-medium text-[#F3F0E8] font-heading flex items-center gap-3">
                    <span className="text-xs font-mono text-[#C6A36A]">
                      [0{catIdx + 1}]
                    </span>
                    <span>{cat.title}</span>
                  </h3>
                  <p className="text-xs text-[#A0A4A8] max-w-md">
                    {cat.desc}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cat.items.map((item) => (
                    <div
                      id={item.id}
                      key={item.id}
                      className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#171A1D]/70 p-6 backdrop-blur-md transition-all duration-300 hover:border-[#C6A36A]/50 hover:bg-[#171A1D]/95"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C6A36A] border border-[#C6A36A]/20 bg-[#090B0D] px-2 py-0.5 rounded">
                            {item.category || "Finishes"}
                          </span>
                        </div>

                        <h4 className="text-lg font-medium text-[#F3F0E8] font-heading group-hover:text-[#C6A36A] transition-colors">
                          {item.name}
                        </h4>

                        <p className="mt-2.5 text-xs text-[#A0A4A8] leading-relaxed">
                          {item.description}
                        </p>

                        {item.details && (
                          <div className="mt-4 pt-4 border-t border-white/5 space-y-1.5">
                            {item.details.map((detail, dIdx) => (
                              <div key={dIdx} className="flex items-start gap-2 text-xs text-[#F3F0E8]">
                                <CheckCircle2 className="h-3 w-3 text-[#C6A36A] mt-0.5 shrink-0" />
                                <span>{detail}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#A0A4A8]">
                          Turnkey Fit-out
                        </span>
                        <WhatsAppButton
                          service="interiors"
                          label={`Enquire ${item.name}`}
                          variant="compact"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Bottom Banner */}
        <ScrollReveal direction="up" distance={25} duration={0.85} className="mt-20 rounded-2xl border border-[#C6A36A]/30 bg-gradient-to-r from-[#171A1D] via-[#171A1D]/90 to-[#090B0D] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C6A36A]">
              Turnkey Interior Fit-outs
            </span>
            <h2 className="text-2xl sm:text-3xl font-light text-[#F3F0E8] font-heading">
              Elevate your residential or commercial space
            </h2>
            <p className="text-sm text-[#A0A4A8] max-w-xl leading-relaxed">
              Connect directly with our interior specialists to discuss design layouts, false ceiling frameworks, custom furniture joinery, or material samples.
            </p>
          </div>

          <div className="shrink-0">
            <WhatsAppButton
              service="interiors"
              label="Open Interior WhatsApp"
              variant="primary"
            />
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
