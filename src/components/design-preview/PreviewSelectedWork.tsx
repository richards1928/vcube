"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { generateWhatsAppLink } from "@/config/site";

export function PreviewSelectedWork() {
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

  const handleInquiry = (title: string) => {
    const url = generateWhatsAppLink({ projectTitle: title });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="selected-work"
      ref={sectionRef}
      className="relative w-full py-20 sm:py-28 lg:py-36 bg-[#FFFFFF] text-[#111315] border-t border-[#111315]/8"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-14 sm:space-y-18">
        {/* Header & Disclosure Block */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#111315]/10 pb-8 gap-6"
        >
          <div className="space-y-3 max-w-2xl">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C6A36A] font-medium block">
              Selected Studies
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#111315] leading-[1.08]">
              Architectural Typologies
            </h2>
          </div>

          <div className="max-w-md text-xs font-mono text-[#5A5E63] leading-relaxed">
            <span className="text-[#111315] font-semibold uppercase block mb-1">
              Demonstration Concept Studies
            </span>
            Curated to illustrate technical execution scope across residential apartment frameworks, independent residences, bespoke interiors, and facade branding.
          </div>
        </div>

        {/* Asymmetrical Gallery Composition — Row 1 (8 Col + 4 Col) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          {/* Study 1: Surya Heights (8 Columns) */}
          <div
            onClick={() => handleInquiry("Surya Heights Residential Apartments")}
            className="lg:col-span-8 group cursor-pointer"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#EAE6DC] border border-[#111315]/8 shadow-sm">
              <Image
                src="/images/project-apartment-g4.webp"
                alt="Surya Heights Residential Apartments"
                fill
                sizes="(max-width: 1024px) 100vw, 850px"
                className="object-cover object-center transition-transform duration-700 hover:scale-[1.015]"
              />
            </div>
            <div className="mt-3.5 flex items-start justify-between">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#111315] group-hover:text-[#0E3D6E] transition-colors">
                  Surya Heights
                </h3>
                <p className="text-xs font-mono text-[#5A5E63] mt-0.5 uppercase tracking-wider">
                  Multi-Story Residential Apartment Framework · Concept Study
                </p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-[#111315] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
          </div>

          {/* Study 2: The Courtyard (4 Columns, Portrait) */}
          <div
            onClick={() => handleInquiry("The Courtyard Modern Independent House")}
            className="lg:col-span-4 group cursor-pointer"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#EAE6DC] border border-[#111315]/8 shadow-sm">
              <Image
                src="/images/project-independent-house.webp"
                alt="The Courtyard Modern Independent House"
                fill
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover object-center transition-transform duration-700 hover:scale-[1.015]"
              />
            </div>
            <div className="mt-3.5 flex items-start justify-between">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#111315] group-hover:text-[#0E3D6E] transition-colors">
                  The Courtyard
                </h3>
                <p className="text-xs font-mono text-[#5A5E63] mt-0.5 uppercase tracking-wider">
                  Multi-Level Private Residence · Teak Louvers & Pergola
                </p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-[#111315] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
          </div>
        </div>

        {/* Asymmetrical Gallery Composition — Row 2 (5 Col + 7 Col) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          {/* Study 3: Contemporary Living (5 Columns) */}
          <div
            onClick={() => handleInquiry("Contemporary Residential Living & Spatial Interiors")}
            className="lg:col-span-5 group cursor-pointer"
          >
            <div className="relative aspect-[4/4] sm:aspect-[4/3] lg:aspect-[4/4] w-full overflow-hidden bg-[#EAE6DC] border border-[#111315]/8 shadow-sm">
              <Image
                src="/images/project-residential-interior.webp"
                alt="Contemporary Residential Living & Spatial Interiors"
                fill
                sizes="(max-width: 1024px) 100vw, 550px"
                className="object-cover object-center transition-transform duration-700 hover:scale-[1.015]"
              />
            </div>
            <div className="mt-3.5 flex items-start justify-between">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#111315] group-hover:text-[#0E3D6E] transition-colors">
                  Contemporary Living
                </h3>
                <p className="text-xs font-mono text-[#5A5E63] mt-0.5 uppercase tracking-wider">
                  Turnkey Residential Interiors · False Ceilings & Joinery
                </p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-[#111315] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
          </div>

          {/* Study 4: Vaishnavi Enclave (7 Columns) */}
          <div
            onClick={() => handleInquiry("Vaishnavi Enclave Residential Project")}
            className="lg:col-span-7 group cursor-pointer"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#EAE6DC] border border-[#111315]/8 shadow-sm">
              <Image
                src="/images/project-construction-site.webp"
                alt="Vaishnavi Enclave Residential Project"
                fill
                sizes="(max-width: 1024px) 100vw, 750px"
                className="object-cover object-center transition-transform duration-700 hover:scale-[1.015]"
              />
            </div>
            <div className="mt-3.5 flex items-start justify-between">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#111315] group-hover:text-[#0E3D6E] transition-colors">
                  Vaishnavi Enclave
                </h3>
                <p className="text-xs font-mono text-[#5A5E63] mt-0.5 uppercase tracking-wider">
                  RCC Structural Site Execution · Foundation to Plinth
                </p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-[#111315] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
          </div>
        </div>

        {/* Asymmetrical Gallery Composition — Row 3 (6 Col + 6 Col) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          {/* Study 5: Vcube Residency Branding (6 Columns) */}
          <div
            onClick={() => handleInquiry("Vcube Residency Architectural Signage & Branding")}
            className="lg:col-span-6 group cursor-pointer"
          >
            <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#EAE6DC] border border-[#111315]/8 shadow-sm">
              <Image
                src="/images/service-branding.webp"
                alt="Vcube Residency Architectural Signage & Branding"
                fill
                sizes="(max-width: 1024px) 100vw, 650px"
                className="object-cover object-center transition-transform duration-700 hover:scale-[1.015]"
              />
            </div>
            <div className="mt-3.5 flex items-start justify-between">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#111315] group-hover:text-[#0E3D6E] transition-colors">
                  Vcube Residency Signage
                </h3>
                <p className="text-xs font-mono text-[#5A5E63] mt-0.5 uppercase tracking-wider">
                  3D Illuminated Entrance Emblem & Wayfinding Package
                </p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-[#111315] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
          </div>

          {/* Study 6: Arcadia Commercial (6 Columns) */}
          <div
            onClick={() => handleInquiry("Arcadia Boutique Commercial & Retail Hub")}
            className="lg:col-span-6 group cursor-pointer"
          >
            <div className="relative aspect-[16/11] w-full overflow-hidden bg-[#EAE6DC] border border-[#111315]/8 shadow-sm">
              <Image
                src="/images/project-commercial.webp"
                alt="Arcadia Boutique Commercial & Retail Hub"
                fill
                sizes="(max-width: 1024px) 100vw, 650px"
                className="object-cover object-center transition-transform duration-700 hover:scale-[1.015]"
              />
            </div>
            <div className="mt-3.5 flex items-start justify-between">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#111315] group-hover:text-[#0E3D6E] transition-colors">
                  Arcadia Boutique Hub
                </h3>
                <p className="text-xs font-mono text-[#5A5E63] mt-0.5 uppercase tracking-wider">
                  Commercial Structure · Exterior ACP Cladding & Showroom Glazing
                </p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-[#111315] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
