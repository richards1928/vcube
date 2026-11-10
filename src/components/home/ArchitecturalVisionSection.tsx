"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Building2, Compass, Layers, ShieldCheck, Sparkles } from "lucide-react";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface ArchitecturalVisionSectionProps {
  mainImage?: string;
  detailImage?: string;
}

export function ArchitecturalVisionSection({
  mainImage = "/images/hero-indian-morning.webp",
  detailImage = "/images/vision-detail.webp",
}: ArchitecturalVisionSectionProps) {
  const pillars = [
    {
      num: "01",
      title: "Structural Engineering & RCC",
      desc: "Turnkey civil execution spanning reinforced concrete columns, raft foundations, and multi-tier post-tensioned slabs with certified on-site engineering.",
      icon: Building2,
    },
    {
      num: "02",
      title: "Architectural Fit-outs & Interiors",
      desc: "Precision interior finishing from multi-tiered gypsum false ceilings and Italian marble flooring to custom joinery, flutter boards, and concealed MEP.",
      icon: Layers,
    },
    {
      num: "03",
      title: "Environmental Branding & Facade",
      desc: "Physical identity integrated directly into architecture: 3D illuminated dimensional entrance signs, wayfinding totems, and high-performance ACP cladding.",
      icon: Sparkles,
    },
  ];

  return (
    <section id="vision" className="relative w-full py-28 sm:py-36 bg-[#090B0D] text-[#F3F0E8] overflow-hidden architectural-grid">
      {/* Background Accent Gradients */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#C6A36A]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-[#1651B3]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-16 sm:mb-24">
          <ScrollReveal direction="up" distance={20} duration={0.6}>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C6A36A]/30 bg-[#171A1D] px-3.5 py-1 text-[11px] font-mono tracking-widest text-[#C6A36A]">
              <span>04 // INTEGRATED ARCHITECTURAL DELIVERY</span>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" distance={30} duration={0.8} delay={0.1}>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#F3F0E8] font-heading leading-[1.1]">
              BUILT WITH VISION. <br />
              <span className="text-[#C6A36A] font-normal">EXECUTED WITH PRECISION.</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="up" distance={25} duration={0.8} delay={0.2}>
            <p className="text-base sm:text-xl text-[#A0A4A8] font-light leading-relaxed max-w-2xl">
              From planning and structural execution to interiors and architectural branding, Vcube brings different aspects of building development together into one seamless standard.
            </p>
          </ScrollReveal>
        </div>

        {/* Editorial Asymmetric Dual-Image Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-20">
          {/* Main Primary Building Photography (7 Columns) */}
          <ScrollReveal direction="up" distance={35} scale={0.98} duration={0.9} className="lg:col-span-7">
            <div className="group relative w-full h-[380px] sm:h-[480px] lg:h-[580px] rounded-2xl overflow-hidden border border-white/10 bg-[#171A1D] shadow-2xl">
              <Image
                src={mainImage}
                alt="Contemporary commercial and residential architecture showcasing integrated structural execution and modern facade design"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090B0D] via-[#090B0D]/30 to-transparent" />
              
              {/* Overlay Badge */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#C6A36A] block mb-1">
                    COMMERCIAL & RESIDENTIAL EXCELLENCE
                  </span>
                  <h3 className="text-lg sm:text-xl font-medium text-[#F3F0E8] font-heading">
                    Contemporary Facade & Structural Core
                  </h3>
                </div>
                <div className="shrink-0 flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#090B0D]/80 backdrop-blur-md px-3 py-1.5 text-xs font-mono text-[#A0A4A8]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#C6A36A]" />
                  <span>Turnkey Standard</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Secondary Close-Up Detail & Editorial Narrative (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Secondary Detail Image Card */}
            <ScrollReveal direction="up" distance={30} scale={0.98} duration={0.85} delay={0.15}>
              <div className="group relative w-full h-[240px] sm:h-[280px] rounded-2xl overflow-hidden border border-[#C6A36A]/20 bg-[#171A1D] shadow-xl">
                <Image
                  src={detailImage}
                  alt="Architectural material junctions showcasing engineered concrete finishes, natural teak louvers, and structural joinery"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090B0D]/90 via-[#090B0D]/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C6A36A] block">
                    MATERIAL INTEGRITY
                  </span>
                  <p className="text-xs text-[#F3F0E8] font-light mt-0.5">
                    Engineered concrete finishes, precision joinery, and durable architectural cladding.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Narrative Box */}
            <ScrollReveal direction="up" distance={25} duration={0.8} delay={0.25}>
              <div className="rounded-2xl border border-white/10 bg-[#171A1D]/80 p-6 sm:p-7 backdrop-blur-md space-y-4">
                <div className="flex items-center gap-3 text-[#C6A36A]">
                  <Compass className="h-5 w-5" />
                  <span className="text-xs font-mono uppercase tracking-widest">
                    The Complete Construction Life Cycle
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#A0A4A8] leading-relaxed">
                  Rather than managing disjointed contractors for structural work, interior carpentry, and external signage, Vcube delivers a unified architectural ecosystem. Our site engineers supervise structural concrete casting with the same rigorous care applied to bespoke false ceilings and illuminated 3D exterior branding.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <WhatsAppButton
                    label="Discuss Architectural Scope"
                    variant="primary"
                  />
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-[#090B0D] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#F3F0E8] hover:border-[#C6A36A] transition-colors"
                  >
                    <span>View Projects</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* 3 Unified Pillar Grid */}
        <div className="border-t border-[#C6A36A]/20 pt-16">
          <ScrollReveal direction="up" distance={30} stagger={0.12} duration={0.8} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.num}
                  className="group relative rounded-2xl border border-white/10 bg-[#171A1D]/60 p-7 backdrop-blur-md transition-all duration-300 hover:border-[#C6A36A]/50 hover:bg-[#171A1D]/90 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#C6A36A]/30 bg-[#090B0D] text-[#C6A36A] group-hover:border-[#C6A36A] transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-[#C6A36A]">
                        {pillar.num}
                      </span>
                    </div>

                    <h3 className="text-lg font-medium text-[#F3F0E8] font-heading group-hover:text-[#C6A36A] transition-colors">
                      {pillar.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#A0A4A8] leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#A0A4A8] group-hover:text-[#F3F0E8] transition-colors">
                    <span>Verified Scope</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#C6A36A] transform transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              );
            })}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

