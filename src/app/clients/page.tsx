import React from "react";
import type { Metadata } from "next";
import { ClientsSection } from "@/components/home/ClientsSection";
import { ShieldCheck, Lock, FileCheck, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Clients & Enterprise Partners",
  description:
    "Enterprise collaborations and corporate client partnerships of Vcube Infra Projects across residential, commercial, and retail infrastructure.",
};

export default function ClientsPage() {
  return (
    <div className="w-full pt-28 pb-24 bg-[#090B0D] text-[#F3F0E8] architectural-grid">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal direction="up" distance={30} duration={0.85} className="max-w-3xl mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C6A36A]/30 bg-[#171A1D] px-3.5 py-1 text-[11px] font-mono tracking-widest text-[#C6A36A]">
            <span>PARTNERSHIPS & COLLABORATIONS</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#F3F0E8] font-heading">
            Enterprise Client Network
          </h1>

          <p className="text-base sm:text-lg text-[#A0A4A8] leading-relaxed">
            Vcube Infra Projects collaborates with institutional developers, commercial landlords, corporate headquarters, and high-net-worth residential clients.
          </p>
        </ScrollReveal>

        {/* NDA & Governance Notice */}
        <ScrollReveal direction="up" distance={25} duration={0.8} className="mb-14 rounded-2xl border border-white/10 bg-[#171A1D]/70 p-6 sm:p-8 backdrop-blur-md grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C6A36A]">
              <Lock className="h-4 w-4" />
              <span>Strict NDA Compliance</span>
            </div>
            <p className="text-xs text-[#A0A4A8] leading-relaxed">
              We respect client confidentiality agreements for high-security commercial and private residential complexes.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C6A36A]">
              <FileCheck className="h-4 w-4" />
              <span>Direct Vendor Registration</span>
            </div>
            <p className="text-xs text-[#A0A4A8] leading-relaxed">
              Fully compliant for corporate vendor empanelment, institutional bidding, and municipal compliance.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C6A36A]">
              <ShieldCheck className="h-4 w-4" />
              <span>Verified Testimonials</span>
            </div>
            <p className="text-xs text-[#A0A4A8] leading-relaxed">
              Client testimonials and corporate references are shared directly with verified tender evaluation committees.
            </p>
          </div>
        </ScrollReveal>

        {/* Clients Section Display */}
        <ClientsSection />
      </div>
    </div>
  );
}
