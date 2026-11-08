import React from "react";
import type { Metadata } from "next";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { AlertCircle } from "lucide-react";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Our Projects | Architectural Portfolio & Studies",
  description:
    "Explore the architectural portfolio of Vcube Infra Projects across turnkey civil construction, commercial interiors, and environmental branding.",
};

export default function ProjectsPage() {
  return (
    <div className="w-full pt-28 pb-24 bg-[#090B0D] text-[#F3F0E8] architectural-grid">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Top Header */}
        <ScrollReveal direction="up" distance={30} duration={0.85} className="max-w-3xl mb-8 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C6A36A]/30 bg-[#171A1D] px-3.5 py-1 text-[11px] font-mono tracking-widest text-[#C6A36A]">
            <span>PROJECT REPERTORY & CASE STUDIES</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#F3F0E8] font-heading">
            Our Architectural Projects
          </h1>

          <p className="text-base sm:text-lg text-[#A0A4A8] leading-relaxed">
            A curated portfolio demonstrating our civil construction frameworks, turnkey interior fit-outs, and architectural environmental branding.
          </p>
        </ScrollReveal>

        {/* Development Disclosure Callout */}
        <ScrollReveal direction="up" distance={20} duration={0.7} className="mb-12 rounded-xl border border-[#C6A36A]/30 bg-[#171A1D]/80 p-5 flex items-start gap-3.5 text-xs text-[#A0A4A8]">
          <AlertCircle className="h-5 w-5 text-[#C6A36A] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="text-[#F3F0E8] font-semibold block">
              Development Phase Demonstration Archive
            </span>
            <span>
              The projects shown below are carefully modeled demonstration studies created during initial website engineering. They illustrate the technical scope across civil construction, interior fit-outs, and branding. Official proprietary client project archives will be populated upon client sign-off.
            </span>
          </div>
        </ScrollReveal>

        {/* Full Portfolio with Working Filters */}
        <div className="border-t border-[#C6A36A]/20 pt-8">
          <ProjectsSection />
        </div>

        {/* Bottom Banner */}
        <ScrollReveal direction="up" distance={25} duration={0.85} className="mt-20 rounded-2xl border border-[#C6A36A]/30 bg-gradient-to-r from-[#171A1D] via-[#171A1D]/90 to-[#090B0D] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C6A36A]">
              Custom Project Commissioning
            </span>
            <h2 className="text-2xl sm:text-3xl font-light text-[#F3F0E8] font-heading">
              Have a residential or commercial project in mind?
            </h2>
            <p className="text-sm text-[#A0A4A8] max-w-xl leading-relaxed">
              Contact our engineering and design team directly on WhatsApp to discuss feasibility, floor plans, and material BOQs.
            </p>
          </div>

          <div className="shrink-0">
            <WhatsAppButton
              service="general"
              label="Initiate Project Discussion"
              variant="primary"
            />
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
