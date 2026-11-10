"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { generateWhatsAppLink } from "@/config/site";

export function PreviewExpertise() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      if (headerRef.current) gsap.set(headerRef.current, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power2.out",
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleServiceInquiry = (serviceSlug: string) => {
    const url = generateWhatsAppLink({ service: serviceSlug as any });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="expertise"
      ref={sectionRef}
      className="relative w-full py-20 sm:py-28 lg:py-36 bg-[#FAF9F6] text-[#111315] border-t border-[#111315]/8"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28 lg:space-y-36">
        {/* Section Header */}
        <div ref={headerRef} className="max-w-3xl space-y-3 sm:space-y-4">
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C6A36A] font-medium block">
            Core Disciplines
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#111315] leading-[1.08]">
            Three Disciplines. <br />
            <span className="italic font-normal text-[#0E3D6E]">
              One Integrated Standard.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[#44484D] font-light leading-relaxed max-w-xl pt-1">
            We provide full-lifecycle structural civil engineering, turnkey interior fit-outs, and architectural facade branding without subcontractor fragmentation.
          </p>
        </div>

        {/* Presentation 01: Civil Construction (Large Asymmetric Composition) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          <div className="lg:col-span-8">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#EAE6DC] border border-[#111315]/8 shadow-sm">
              <Image
                src="/images/service-construction.webp"
                alt="Active RCC structural construction site in India with reinforced concrete columns, floor slabs, and precision rebar framing"
                fill
                sizes="(max-width: 1024px) 100vw, 850px"
                className="object-cover object-center transition-transform duration-700 hover:scale-[1.015]"
              />
            </div>
            <div className="mt-3 text-[11px] font-mono text-[#5A5E63] flex flex-col sm:flex-row sm:justify-between uppercase tracking-wider gap-1">
              <span>01 / Civil & Structural Engineering</span>
              <span>Earthwork · RCC Columns · Slabs</span>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#7A7F85]">
                Core Practice
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#111315] leading-snug">
                Civil Construction & Structural Engineering
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#44484D] font-light leading-relaxed">
              Full-lifecycle civil engineering for multi-story residential apartments, custom multi-level residences, and commercial developments with certified on-site engineering supervision.
            </p>

            <ul className="border-t border-[#111315]/10 pt-4 space-y-2 text-xs font-mono text-[#5A5E63]">
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#0E3D6E]" />
                <span>Quantity Estimations & Itemized BOQ</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#0E3D6E]" />
                <span>Architectural Plans & Sanction Drawings</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#0E3D6E]" />
                <span>Reinforced Concrete (RCC) Column Grids</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#0E3D6E]" />
                <span>Engineered Deep Pile & Raft Foundations</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={() => handleServiceInquiry("construction")}
                className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-[#111315] hover:text-[#0E3D6E] transition-colors font-medium border-b border-[#111315]/30 pb-1"
              >
                <span>Enquire Construction Scope</span>
                <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Presentation 02: Architectural Interiors (Inverted Asymmetric Split) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          <div className="lg:col-span-4 space-y-5 sm:space-y-6 lg:order-1 order-2">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#7A7F85]">
                Interior Practice
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#111315] leading-snug">
                Architectural Interiors & Bespoke Fit-outs
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#44484D] font-light leading-relaxed">
              Turnkey interior environments uniting tiered gypsum false ceilings, custom joinery, natural stone laying, concealed electrical MEP, dynamic flutter boards, and exterior ACP cladding.
            </p>

            <ul className="border-t border-[#111315]/10 pt-4 space-y-2 text-xs font-mono text-[#5A5E63]">
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#0E3D6E]" />
                <span>Gypsum False Ceilings & Cove Lighting</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#0E3D6E]" />
                <span>Custom Joinery & Executive Furniture</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#0E3D6E]" />
                <span>Natural Stone & Large-Format Slab Laying</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#0E3D6E]" />
                <span>Specialized Dynamic Flutter Boards</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#0E3D6E]" />
                <span>Aluminum Composite Panel (ACP) Cladding</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={() => handleServiceInquiry("interiors")}
                className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-[#111315] hover:text-[#0E3D6E] transition-colors font-medium border-b border-[#111315]/30 pb-1"
              >
                <span>Enquire Interior Scope</span>
                <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-8 lg:order-2 order-1">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#EAE6DC] border border-[#111315]/8 shadow-sm">
              <Image
                src="/images/service-interiors.webp"
                alt="Contemporary luxury Indian interior fit-out featuring tiered false ceiling with warm cove LED lighting, custom teak joinery, and polished marble flooring"
                fill
                sizes="(max-width: 1024px) 100vw, 850px"
                className="object-cover object-center transition-transform duration-700 hover:scale-[1.015]"
              />
            </div>
            <div className="mt-3 text-[11px] font-mono text-[#5A5E63] flex flex-col sm:flex-row sm:justify-between uppercase tracking-wider gap-1">
              <span>02 / Architectural Fit-Outs</span>
              <span>Ceilings · Joinery · Surfaces</span>
            </div>
          </div>
        </div>

        {/* Presentation 03: Environmental Branding (Expansive Facade Composition) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          <div className="lg:col-span-8">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#EAE6DC] border border-[#111315]/8 shadow-sm">
              <Image
                src="/images/service-branding.webp"
                alt="Contemporary commercial building entrance featuring 3D illuminated architectural signage, brushed metal lettering, and precision ACP cladding"
                fill
                sizes="(max-width: 1024px) 100vw, 850px"
                className="object-cover object-center transition-transform duration-700 hover:scale-[1.015]"
              />
            </div>
            <div className="mt-3 text-[11px] font-mono text-[#5A5E63] flex flex-col sm:flex-row sm:justify-between uppercase tracking-wider gap-1">
              <span>03 / Environmental Branding</span>
              <span>3D Signage · Wayfinding · Solar Glazing</span>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#7A7F85]">
                Identity Practice
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#111315] leading-snug">
                Environmental Branding & Architectural Signage
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#44484D] font-light leading-relaxed">
              Physical brand identity seamlessly engineered into building envelopes: 3D illuminated dimensional logos, facade sky signs, interior wayfinding, and ceramic sun control glazing.
            </p>

            <ul className="border-t border-[#111315]/10 pt-4 space-y-2 text-xs font-mono text-[#5A5E63]">
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#0E3D6E]" />
                <span>3D Channel Letters (IP67 LED Modules)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#0E3D6E]" />
                <span>High-Rise Facade Sky Signage & Totems</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#0E3D6E]" />
                <span>Modular Architectural Wayfinding Directories</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[#0E3D6E]" />
                <span>High-Rejection Ceramic Sun Control Films</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={() => handleServiceInquiry("branding")}
                className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-[#111315] hover:text-[#0E3D6E] transition-colors font-medium border-b border-[#111315]/30 pb-1"
              >
                <span>Enquire Signage Scope</span>
                <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
