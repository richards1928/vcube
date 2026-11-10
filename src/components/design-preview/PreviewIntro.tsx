"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { generateWhatsAppLink } from "@/config/site";

export function PreviewIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      if (contentRef.current) gsap.set(contentRef.current, { opacity: 1, y: 0 });
      if (imagesRef.current) gsap.set(imagesRef.current, { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power2.out",
          }
        );
      }

      if (imagesRef.current) {
        gsap.fromTo(
          imagesRef.current,
          { opacity: 0.8, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            delay: 0.15,
            ease: "power2.out",
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleConnect = () => {
    const url = generateWhatsAppLink({
      enquiryType: "Leadership Architecture Consultation",
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full py-20 sm:py-28 lg:py-36 bg-[#FFFFFF] text-[#111315] border-t border-[#111315]/8"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Asymmetrical Typography Layout */}
        <div
          ref={contentRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-16 sm:mb-24"
        >
          {/* Left Column: Subtle Metadata & Tenets (4 Columns) */}
          <div className="lg:col-span-4 space-y-6 sm:space-y-8">
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C6A36A] font-medium block">
                Philosophy & Ethos
              </span>
              <p className="text-xs font-mono text-[#5A5E63] uppercase tracking-wider">
                Hyderabad · Integrated Practice
              </p>
            </div>

            <div className="border-t border-[#111315]/10 pt-6 space-y-5 text-xs text-[#5A5E63]">
              <div>
                <span className="font-mono text-[#111315] font-semibold block uppercase tracking-wider mb-1">
                  01 / Civil Structural Works
                </span>
                <p className="font-light leading-relaxed">
                  Deep foundations, RCC column framing, and certified on-site engineering supervision.
                </p>
              </div>

              <div>
                <span className="font-mono text-[#111315] font-semibold block uppercase tracking-wider mb-1">
                  02 / Turnkey Interior Fit-Outs
                </span>
                <p className="font-light leading-relaxed">
                  Gypsum false ceilings, bespoke joinery, large-format tile laying, and specialized flutter boards.
                </p>
              </div>

              <div>
                <span className="font-mono text-[#111315] font-semibold block uppercase tracking-wider mb-1">
                  03 / Physical Environmental Branding
                </span>
                <p className="font-light leading-relaxed">
                  3D illuminated architectural signage, wayfinding totems, and ceramic sun control glazing.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleConnect}
                className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-[#111315] hover:text-[#0E3D6E] transition-colors font-medium border-b border-[#111315]/30 pb-1"
              >
                <span>Connect With Leadership</span>
                <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: Large Refined Serif Headline & Prose (8 Columns) */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl font-normal tracking-tight text-[#111315] leading-[1.14]">
              We craft enduring architecture where rigorous structural engineering meets{" "}
              <span className="italic text-[#0E3D6E]">refined material craft.</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-sm sm:text-base text-[#44484D] font-light leading-relaxed pt-2">
              <p>
                In conventional project delivery, civil contractors, interior decorators, and signage fabricators operate in silos. This fragmentation frequently causes communication gaps, structural rework, and budget escalations.
              </p>
              <p>
                Vcube Infra Projects eliminates these boundaries. By housing civil structural engineering, interior fit-outs, and environmental branding within one coordinated practice, we ensure seamless continuity from initial foundation planning to final physical commissioning.
              </p>
            </div>
          </div>
        </div>

        {/* Overlapping Architectural Photography Arrangement */}
        <div ref={imagesRef} className="relative pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            {/* Primary Large Image (8 Columns) */}
            <div className="lg:col-span-8">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#EAE6DC] border border-[#111315]/8">
                <Image
                  src="/images/about-building.webp"
                  alt="Contemporary multi-level independent residence showcasing architectural civil design and exterior finishes"
                  fill
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover object-center transition-transform duration-700 hover:scale-[1.015]"
                />
              </div>
              <div className="mt-3 text-[11px] font-mono text-[#5A5E63] uppercase tracking-wider">
                Contemporary Residence · Structural Form & Teakwood Louvers
              </div>
            </div>

            {/* Secondary Intimate Material Junction Detail (4 Columns) */}
            <div className="lg:col-span-4">
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#EAE6DC] border border-[#111315]/8">
                <Image
                  src="/images/vision-detail.webp"
                  alt="Architectural material junctions showcasing engineered concrete finishes, natural teak louvers, and structural joinery"
                  fill
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover object-center transition-transform duration-700 hover:scale-[1.015]"
                />
              </div>
              <div className="mt-3 text-[11px] font-mono text-[#5A5E63] uppercase tracking-wider">
                Material Integrity · Concrete, Timber & Steel Junctions
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
