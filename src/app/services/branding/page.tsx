import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CheckCircle2, ShieldCheck, Sun, Building, Sparkles } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { SignageShowcase3D } from "@/components/3d/SignageShowcase3D";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Architectural Branding & Signage",
  description:
    "Physical environmental branding seamlessly integrated into architecture: 3D Logos, External Facade Signage, Internal Wayfinding, Wall Graphics, and Sun Control Films.",
};

export default function BrandingServicePage() {
  const service = SITE_CONFIG.services.branding;

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
              <span>ENVIRONMENTAL & FACADE IDENTITY</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#F3F0E8] font-heading leading-tight">
              Architectural Branding & Environmental Signage
            </h1>

            <p className="text-base sm:text-lg text-[#A0A4A8] leading-relaxed">
              {service.heroHeadline}. Physical brand presence engineered for building facades, commercial storefronts, interior walls, and high-performance glass envelopes.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <WhatsAppButton
                service="branding"
                label="Discuss Branding Project"
                variant="primary"
              />
              <Link
                href="/queries"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-[#171A1D] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#F3F0E8] hover:border-[#C6A36A] transition-colors"
              >
                <span>Request Signage Consultation</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </ScrollReveal>

          {/* 3D Signage Showcase */}
          <ScrollReveal direction="up" distance={25} scale={0.98} duration={0.95} delay={0.15} className="lg:col-span-6 relative">
            <SignageShowcase3D activeType="facade" />
          </ScrollReveal>
        </div>

        {/* The 5 Exact Branding Services */}
        <div className="border-t border-[#C6A36A]/20 pt-16">
          <ScrollReveal direction="up" distance={25} duration={0.8} className="mb-12">
            <SectionHeading
              badge="01 // PHYSICAL IDENTITY"
              title="Core Branding Capabilities"
              subtitle="The five verified environmental brand implementations from the handwritten specifications."
            />
          </ScrollReveal>

          <ScrollReveal direction="up" distance={30} stagger={0.1} duration={0.8} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.items.map((item, idx) => (
              <div
                id={item.id}
                key={item.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#171A1D]/70 p-7 backdrop-blur-md transition-all duration-300 hover:border-[#C6A36A]/50 hover:bg-[#171A1D]/95"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#C6A36A] border border-[#C6A36A]/20 bg-[#090B0D] px-2 py-0.5 rounded">
                      Architectural Identity
                    </span>
                    <span className="text-xs font-mono font-bold text-[#C6A36A]">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-xl font-medium text-[#F3F0E8] font-heading group-hover:text-[#C6A36A] transition-colors">
                    {item.name}
                  </h3>

                  <p className="mt-3 text-xs text-[#A0A4A8] leading-relaxed">
                    {item.description}
                  </p>

                  {item.details && (
                    <div className="mt-5 pt-4 border-t border-white/5 space-y-2">
                      {item.details.map((detail, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-2 text-xs text-[#F3F0E8]">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#C6A36A] mt-0.5 shrink-0" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-[#A0A4A8]">
                    Environmental Scope
                  </span>
                  <WhatsAppButton
                    service="branding"
                    label={`Enquire ${item.name}`}
                    variant="compact"
                  />
                </div>
              </div>
            ))}
          </ScrollReveal>
        </div>

        {/* Bottom Banner */}
        <ScrollReveal direction="up" distance={25} duration={0.85} className="mt-20 rounded-2xl border border-[#C6A36A]/30 bg-gradient-to-r from-[#171A1D] via-[#171A1D]/90 to-[#090B0D] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C6A36A]">
              Facade & Interior Brand Engineering
            </span>
            <h2 className="text-2xl sm:text-3xl font-light text-[#F3F0E8] font-heading">
              Ready to integrate your brand into architecture?
            </h2>
            <p className="text-sm text-[#A0A4A8] max-w-xl leading-relaxed">
              From 3D sky signage to spectrally selective ceramic sun control films, consult with our environmental branding team on WhatsApp.
            </p>
          </div>

          <div className="shrink-0">
            <WhatsAppButton
              service="branding"
              label="Open Branding WhatsApp"
              variant="primary"
            />
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
