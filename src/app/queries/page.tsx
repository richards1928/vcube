import React from "react";
import type { Metadata } from "next";
import { ProjectQueriesSection } from "@/components/home/ProjectQueriesSection";
import { MessageSquare, Phone, Clock, ShieldCheck } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Project Queries & Instant WhatsApp Consultation",
  description:
    "Submit your construction, interior fit-out, or architectural branding inquiry directly to Vcube Infra Projects with automatic pre-filled WhatsApp messaging.",
};

export default function QueriesPage() {
  return (
    <div className="w-full pt-28 pb-24 bg-[#090B0D] text-[#F3F0E8] architectural-grid">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal direction="up" distance={30} duration={0.85} className="max-w-3xl mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C6A36A]/30 bg-[#171A1D] px-3.5 py-1 text-[11px] font-mono tracking-widest text-[#C6A36A]">
            <span>PROJECT COMMISSIONING & CONSULTATION</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#F3F0E8] font-heading">
            Project Queries & Estimates
          </h1>

          <p className="text-base sm:text-lg text-[#A0A4A8] leading-relaxed">
            Select your architectural division, specify your scope items, and initiate an immediate dialogue with our engineering and design desk.
          </p>
        </ScrollReveal>

        {/* Interactive Query Tool */}
        <ProjectQueriesSection />

        {/* Direct Telephone and Working Hours Info */}
        <ScrollReveal direction="up" distance={25} stagger={0.1} duration={0.8} className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-white/10 pt-12">
          <div className="rounded-xl border border-white/10 bg-[#171A1D]/60 p-6 flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#C6A36A]/10 text-[#C6A36A] shrink-0">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#A0A4A8]">
                Direct Hotline
              </span>
              <p className="text-sm font-semibold text-[#F3F0E8] mt-0.5">
                {SITE_CONFIG.whatsapp.displayNumber}
              </p>
              <p className="text-xs text-[#A0A4A8] mt-1">
                Mon - Sat, 09:00 - 19:00 IST
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[#25D366]/30 bg-[#171A1D]/60 p-6 flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#25D366]/20 text-[#25D366] shrink-0">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#25D366]">
                Fastest Response
              </span>
              <p className="text-sm font-semibold text-[#F3F0E8] mt-0.5">
                Official WhatsApp Channel
              </p>
              <p className="text-xs text-[#A0A4A8] mt-1">
                Share plans, CAD files, and photos instantly.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#171A1D]/60 p-6 flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#C6A36A]/10 text-[#C6A36A] shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#A0A4A8]">
                Confidentiality
              </span>
              <p className="text-sm font-semibold text-[#F3F0E8] mt-0.5">
                Privacy Guaranteed
              </p>
              <p className="text-xs text-[#A0A4A8] mt-1">
                All drawings and specifications remain secure.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
