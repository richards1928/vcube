import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Building2, Layers, Paintbrush, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "About Us | Engineering Precision & Architecture",
  description:
    "Learn about Vcube Infra Projects — an integrated architectural infrastructure company uniting civil construction, interior fit-outs, and environmental branding.",
};

export default function AboutPage() {
  const pillars = [
    {
      title: "Civil Construction",
      tagline: "Foundation to Superstructure",
      desc: "Turnkey structural engineering, soil testing, deep foundations, and RCC column frames for multi-story residential apartments, independent houses, and commercial developments.",
      icon: Building2,
      link: "/services/construction",
    },
    {
      title: "Architectural Interiors",
      tagline: "False Ceilings to Custom Joinery",
      desc: "Transformative spatial fit-outs encompassing modular false ceilings, custom furniture, luxury flooring, flutter boards, painting, and ACP cladding.",
      icon: Layers,
      link: "/services/interiors",
    },
    {
      title: "Environmental Branding",
      tagline: "Physical Identity in Architecture",
      desc: "Seamless integration of brand presence into architectural envelopes through 3D illuminated entrance emblems, wayfinding signage, and sun control films.",
      icon: Paintbrush,
      link: "/services/branding",
    },
  ];

  return (
    <div className="w-full pt-28 pb-24 bg-[#090B0D] text-[#F3F0E8] architectural-grid">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <ScrollReveal direction="up" distance={30} duration={0.85} className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C6A36A]/30 bg-[#171A1D] px-3.5 py-1 text-[11px] font-mono tracking-widest text-[#C6A36A]">
            <span>COMPANY PROFILE & ETHOS</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#F3F0E8] font-heading">
            Engineering Precision. <br />
            <span className="text-[#C6A36A] font-medium">Architectural Integrity.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#A0A4A8] leading-relaxed">
            Vcube Infra Projects is a dedicated multidisciplinary practice providing integrated civil construction, interior environments, and environmental branding for residential and commercial infrastructure.
          </p>
        </ScrollReveal>

        {/* Narrative Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start border-t border-[#C6A36A]/20 pt-16 mb-20">
          <ScrollReveal direction="up" distance={25} duration={0.85} className="lg:col-span-5 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-light text-[#F3F0E8] font-heading">
              A Unified Operational Approach
            </h2>
            <div className="space-y-4 text-sm text-[#A0A4A8] leading-relaxed">
              <p>
                In conventional project delivery, civil construction contractors, interior decorators, and signage fabricators operate in silos. This fragmentation frequently causes communication gaps, architectural inconsistencies, and budget overruns.
              </p>
              <p>
                Vcube Infra Projects eliminates these boundaries. By housing civil structural engineering, interior fit-outs, and environmental branding within one coordinated practice, we ensure seamless continuity from initial foundation planning to final physical commissioning.
              </p>
            </div>

            <div className="pt-2">
              <WhatsAppButton
                service="general"
                label="Connect with Leadership"
                variant="primary"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" distance={25} duration={0.85} delay={0.15} className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#171A1D]/70 p-8 backdrop-blur-md space-y-6">
              <h3 className="text-lg font-semibold text-[#F3F0E8]">
                Core Operational Standards
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    title: "Accurate Bill of Quantities",
                    desc: "Rigorous quantity estimation and itemized BOQ generation avoiding arbitrary cost escalations.",
                  },
                  {
                    title: "Structural Tolerance",
                    desc: "High-grade concrete slump testing and alignment tolerances verified by certified site engineers.",
                  },
                  {
                    title: "Material Transparency",
                    desc: "Direct procurement of verified cement, steel, gypsum, electrical cables, and aluminum composite panels.",
                  },
                  {
                    title: "Turnkey Accountable Handover",
                    desc: "One central point of accountability from civil excavation to final aesthetic sign-off.",
                  },
                ].map((std) => (
                  <div key={std.title} className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#C6A36A]">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span>{std.title}</span>
                    </div>
                    <p className="text-xs text-[#A0A4A8] leading-relaxed pl-6">
                      {std.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* 3 Core Divisions */}
        <div className="border-t border-[#C6A36A]/20 pt-16">
          <ScrollReveal direction="up" distance={25} duration={0.8}>
            <SectionHeading
              badge="02 // DIVISIONS"
              title="Integrated Architecture Matrix"
              subtitle="Explore our three specialized disciplines."
              className="mb-12"
            />
          </ScrollReveal>

          <ScrollReveal direction="up" distance={30} stagger={0.12} duration={0.8} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="rounded-2xl border border-white/10 bg-[#171A1D]/60 p-7 backdrop-blur-md flex flex-col justify-between hover:border-[#C6A36A]/40 transition-all"
                >
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#C6A36A]/30 bg-[#090B0D] text-[#C6A36A] mb-5">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-medium text-[#F3F0E8] font-heading">
                      {pillar.title}
                    </h3>
                    <p className="text-xs font-mono uppercase tracking-wider text-[#C6A36A] mt-1">
                      {pillar.tagline}
                    </p>
                    <p className="mt-3 text-xs text-[#A0A4A8] leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10">
                    <Link
                      href={pillar.link}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C6A36A] hover:text-[#DFC293]"
                    >
                      <span>Explore Division</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
