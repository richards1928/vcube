"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowDown, MessageSquare, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { generateWhatsAppLink } from "@/config/site";

export function PreviewHero() {
  const heroRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const elements = [
      eyebrowRef.current,
      headingRef.current,
      textRef.current,
    ].filter(Boolean);

    if (prefersReducedMotion) {
      if (elements.length > 0) {
        gsap.set(elements, { opacity: 1, y: 0 });
      }
      if (imageFrameRef.current) {
        gsap.set(imageFrameRef.current, { opacity: 1, scale: 1 });
      }
      return;
    }

    const ctx = gsap.context(() => {
      if (elements.length > 0) {
        gsap.fromTo(
          elements,
          { y: 18, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.12,
            ease: "power2.out",
          }
        );
      }

      if (imageFrameRef.current) {
        gsap.fromTo(
          imageFrameRef.current,
          { opacity: 0.7, scale: 0.985 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.1,
            delay: 0.2,
            ease: "power2.out",
          }
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleConsultation = () => {
    const url = generateWhatsAppLink({
      enquiryType: "New Project Architectural Consultation",
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full bg-[#FAF9F6] text-[#111315] pt-6 sm:pt-8 lg:pt-10 pb-16 sm:pb-24 lg:pb-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Editorial Eyebrow & Compact Headline Block */}
        <div className="max-w-5xl space-y-4 sm:space-y-5 mb-8 sm:mb-10 lg:mb-12">
          {/* Eyebrow */}
          <div ref={eyebrowRef} className="inline-flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C6A36A]" />
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#5A5E63] font-medium">
              Architecture · Civil Engineering · Environmental Branding
            </span>
          </div>

          {/* Primary Display Headline */}
          <h1
            ref={headingRef}
            className="font-serif text-3xl sm:text-5xl lg:text-[4rem] xl:text-[4.5rem] font-normal tracking-tight text-[#111315] leading-[1.08]"
          >
            Building Spaces. <br className="hidden sm:inline" />
            <span className="italic font-normal text-[#0E3D6E]">
              Creating Possibilities.
            </span>
          </h1>

          {/* Refined 2-Column Supporting Content & Direct Action Bar */}
          <div
            ref={textRef}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-end pt-1"
          >
            <p className="lg:col-span-8 text-sm sm:text-base lg:text-[17px] text-[#44484D] font-light leading-relaxed max-w-2xl">
              Vcube Infra Projects is a dedicated multidisciplinary practice delivering turnkey residential apartment buildings, custom multi-level residences, and commercial structures from initial foundation to physical commissioning across Hyderabad and regional Telangana.
            </p>

            {/* CTAs */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 sm:gap-4">
              <button
                onClick={handleConsultation}
                className="inline-flex items-center gap-2 rounded-none bg-[#111315] px-6 py-3.5 text-xs font-mono font-medium uppercase tracking-[0.16em] text-[#FAF9F6] hover:bg-[#0E3D6E] transition-all duration-300 shadow-sm"
              >
                <MessageSquare className="h-3.5 w-3.5 text-[#25D366]" />
                <span>Initiate Consultation</span>
              </button>

              <a
                href="#selected-work"
                className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.16em] text-[#111315]/75 hover:text-[#0E3D6E] transition-colors py-1 font-medium"
              >
                <span>View Selected Works</span>
                <ArrowDown className="h-3.5 w-3.5 text-[#0E3D6E] group-hover:translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* The Dominant Architectural Photography */}
        <div ref={imageFrameRef} className="relative w-full">
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-[21/10] overflow-hidden bg-[#EAE6DC] border border-[#111315]/8 shadow-sm">
            <Image
              src="/images/hero-indian-morning.webp"
              alt="Contemporary Indian architectural development under morning sunlight showcasing civil construction, turnkey interiors, and architectural branding"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1280px"
              className="object-cover object-[center_35%] transition-transform duration-1000 ease-out hover:scale-[1.015]"
            />
          </div>

          {/* Minimalist Architectural Caption */}
          <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-[#5A5E63] gap-2 border-t border-[#111315]/8 pt-3">
            <span className="tracking-wider uppercase">
              Residential Apartment Development · Framework & Elevation
            </span>
            <span className="tracking-wider uppercase text-[#7A7F85]">
              Hyderabad Metropolis · Telangana, India
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
