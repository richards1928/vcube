import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Layers, Sparkles, Box, Info, Home } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
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

          {/* Premium Interior Photography Showcase */}
          <ScrollReveal direction="up" distance={25} scale={0.98} duration={0.95} delay={0.15} className="lg:col-span-6 relative">
            <div className="relative w-full h-[460px] sm:h-[500px] rounded-2xl border border-[#C6A36A]/30 bg-[#171A1D] overflow-hidden shadow-2xl group">
              <Image
                src="/images/service-interiors.webp"
                alt="Contemporary luxury Indian interior fit-out featuring tiered false ceiling with warm cove LED lighting, custom teak joinery, and polished marble flooring by Vcube Infra Projects"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090B0D] via-[#090B0D]/30 to-transparent" />

              {/* Top Status Pill */}
              <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full border border-white/10 bg-[#090B0D]/80 backdrop-blur-md px-3.5 py-1 text-xs font-mono text-[#C6A36A]">
                <Home className="h-3.5 w-3.5 text-[#C6A36A]" />
                <span>BESPOKE FIT-OUT & INTERIOR FINISHING</span>
              </div>

              {/* Bottom Details Panel */}
              <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/10 bg-[#090B0D]/85 backdrop-blur-md p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-[#F3F0E8] font-heading">
                      Architectural Living & Executive Fit-out
                    </h4>
                    <p className="text-[11px] text-[#A0A4A8] mt-0.5">
                      Gypsum False Ceiling · Concealed Ambient Lighting · Custom Joinery & Stone Honing
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-[10px] font-mono text-[#C6A36A] uppercase tracking-wider block">
                      Execution
                    </span>
                    <span className="text-xs font-mono text-[#F3F0E8] font-bold">
                      Turnkey Delivery
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* 4 Categorized Sections */}
        <div className="space-y-20 border-t border-[#C6A36A]/20 pt-16">
          <ScrollReveal direction="up" distance={25} duration={0.8}>
            <SectionHeading
              badge="01 // DETAILED SPECIFICATIONS"
              title="Comprehensive Interior Systems"
              subtitle="All 11 verified interior capabilities organized by architectural trade."
            />
          </ScrollReveal>

          {categories.map((cat, cIdx) => (
            <div key={cIdx} className="space-y-6">
              <ScrollReveal direction="up" distance={20} duration={0.7} className="border-b border-white/10 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <h2 className="text-2xl font-light text-[#F3F0E8] font-heading flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-[#C6A36A] border border-[#C6A36A]/30 bg-[#171A1D] px-2.5 py-1 rounded">
                      0{cIdx + 1}
                    </span>
                    {cat.title}
                  </h2>
                  <p className="text-xs font-mono text-[#A0A4A8]">
                    {cat.desc}
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" distance={25} stagger={0.08} duration={0.75} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cat.items.map((item) => (
                  <div
                    id={item.id}
                    key={item.id}
                    className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#171A1D]/70 p-6 backdrop-blur-md transition-all duration-300 hover:border-[#C6A36A]/50 hover:bg-[#171A1D]/95"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#C6A36A] border border-[#C6A36A]/20 bg-[#090B0D] px-2 py-0.5 rounded">
                          Trade Standard
                        </span>
                        <Sparkles className="h-4 w-4 text-[#A0A4A8] group-hover:text-[#C6A36A] transition-colors" />
                      </div>

                      <h3 className="text-lg font-medium text-[#F3F0E8] font-heading group-hover:text-[#C6A36A] transition-colors">
                        {item.name}
                      </h3>

                      <p className="mt-2 text-xs text-[#A0A4A8] leading-relaxed">
                        {item.description}
                      </p>

                      {item.details && (
                        <div className="mt-4 pt-4 border-t border-white/5 space-y-1.5">
                          {item.details.map((detail, dIdx) => (
                            <div key={dIdx} className="flex items-start gap-2 text-[11px] text-[#F3F0E8]">
                              <CheckCircle2 className="h-3 w-3 text-[#C6A36A] mt-0.5 shrink-0" />
                              <span>{detail}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#A0A4A8]">
                        Interior Scope
                      </span>
                      <WhatsAppButton
                        service="interiors"
                        label={`Enquire ${item.name}`}
                        variant="compact"
                      />
                    </div>
                  </div>
                ))}
              </ScrollReveal>
            </div>
          ))}
        </div>

        {/* Bottom Consultation Banner */}
        <ScrollReveal direction="up" distance={25} duration={0.85} className="mt-20 rounded-2xl border border-[#C6A36A]/30 bg-gradient-to-r from-[#171A1D] via-[#171A1D]/90 to-[#090B0D] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C6A36A]">
              Turnkey Interior Fit-out & BOQ
            </span>
            <h2 className="text-2xl sm:text-3xl font-light text-[#F3F0E8] font-heading">
              Ready to elevate your residential or commercial interior?
            </h2>
            <p className="text-sm text-[#A0A4A8] max-w-xl leading-relaxed">
              Connect directly with our interior fit-out team on WhatsApp to review floor plans, material swatches, or estimate turnkey interior costs.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-4">
            <WhatsAppButton
              service="interiors"
              label="Open Interiors WhatsApp"
              variant="primary"
            />
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
