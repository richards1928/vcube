"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const narrativeRef = useRef<HTMLDivElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const imageMaskRef = useRef<HTMLDivElement>(null);
  const imgInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([narrativeRef.current, imageMaskRef.current, imageFrameRef.current], {
          opacity: 1,
          y: 0,
          clipPath: "none",
        });
        return;
      }

      // 1. Narrative Content Reveal
      if (narrativeRef.current) {
        const eyebrow = narrativeRef.current.querySelector(".about-eyebrow");
        const heading = narrativeRef.current.querySelector(".about-heading");
        const paragraphs = narrativeRef.current.querySelectorAll(".about-text p");
        const pillars = narrativeRef.current.querySelectorAll(".about-pillar");
        const cta = narrativeRef.current.querySelector(".about-cta");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: narrativeRef.current,
            start: "top 82%",
            toggleActions: "play none none none",
          },
          defaults: { ease: "power3.out" },
        });

        if (eyebrow) {
          tl.fromTo(eyebrow, { opacity: 0, x: -15 }, { opacity: 1, x: 0, duration: 0.7 });
        }
        if (heading) {
          tl.fromTo(heading, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.85 }, "-=0.4");
        }
        if (paragraphs.length) {
          tl.fromTo(
            paragraphs,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.75, stagger: 0.12 },
            "-=0.5"
          );
        }
        if (pillars.length) {
          tl.fromTo(
            pillars,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
            "-=0.4"
          );
        }
        if (cta) {
          tl.fromTo(cta, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3");
        }
      }

      // 2. Architectural Image Reveal & Champagne Frame
      if (imageMaskRef.current) {
        const maskTl = gsap.timeline({
          scrollTrigger: {
            trigger: imageMaskRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          defaults: { ease: "power3.out" },
        });

        maskTl.fromTo(
          imageMaskRef.current,
          { opacity: 0.3 },
          {
            opacity: 1,
            duration: 1.0,
            ease: "power3.out",
          }
        );

        if (imageFrameRef.current) {
          maskTl.fromTo(
            imageFrameRef.current,
            { opacity: 0, x: 15, y: -15 },
            { opacity: 1, x: 0, y: 0, duration: 0.9, ease: "power3.out" },
            0.2
          );
        }
      }
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-28 bg-[#F5F3EC] text-[#111315] overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Narrative */}
          <div ref={narrativeRef} className="lg:col-span-6 space-y-6 lg:space-y-8">
            {/* Eyebrow */}
            <div className="about-eyebrow inline-flex items-center gap-2.5">
              <span className="h-px w-6 bg-[#C6A36A]" />
              <span className="text-xs font-sans font-semibold uppercase tracking-[0.25em] text-[#C6A36A]">
                ABOUT VCUBE
              </span>
            </div>

            {/* Headline in Elegant Serif */}
            <h2 className="about-heading font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#111315] leading-[1.1]">
              Building More Than Structures.
            </h2>

            {/* Company Introduction */}
            <div className="about-text space-y-4 text-base text-[#4A4F55] leading-relaxed font-light">
              <p>
                At Vcube Infra Projects, our primary civil construction practice delivers multi-story residential apartment buildings, custom multi-level residences, and commercial developments, complemented by turnkey interior environments and architectural branding.
              </p>
              <p>
                From initial quantity estimations, architectural working drawings, and structural RCC framework execution to false ceilings, bespoke joinery, and building signage, our multidisciplinary engineering ensures complete architectural continuity from foundation to turnkey handover.
              </p>
            </div>

            {/* Verified Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#111315]/10">
              <div className="about-pillar flex items-start gap-2.5 text-xs text-[#111315]">
                <CheckCircle2 className="h-4 w-4 text-[#C6A36A] shrink-0 mt-0.5" />
                <span>Multi-Story Residential Apartments</span>
              </div>
              <div className="about-pillar flex items-start gap-2.5 text-xs text-[#111315]">
                <CheckCircle2 className="h-4 w-4 text-[#C6A36A] shrink-0 mt-0.5" />
                <span>Multi-Level Independent Residences</span>
              </div>
              <div className="about-pillar flex items-start gap-2.5 text-xs text-[#111315]">
                <CheckCircle2 className="h-4 w-4 text-[#C6A36A] shrink-0 mt-0.5" />
                <span>Turnkey Architectural Interiors</span>
              </div>
              <div className="about-pillar flex items-start gap-2.5 text-xs text-[#111315]">
                <CheckCircle2 className="h-4 w-4 text-[#C6A36A] shrink-0 mt-0.5" />
                <span>Exterior Signage & Facade Finishes</span>
              </div>
            </div>

            {/* Know More CTA */}
            <div className="about-cta pt-2">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 rounded-full border border-[#111315] bg-transparent px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#111315] transition-all duration-300 hover:bg-[#111315] hover:text-[#F3F0E8] active:scale-[0.98]"
              >
                <span>Know More About Us</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Asymmetrical Architectural Photography */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Decorative Champagne Offset Frame */}
              <div
                ref={imageFrameRef}
                className="absolute -top-4 -right-4 w-full h-full border border-[#C6A36A]/50 rounded-2xl pointer-events-none hidden sm:block"
              />

              {/* Main Image Container with Mask Reveal — Explicit 4/5 Aspect Ratio & Dimensions */}
              <div
                ref={imageMaskRef}
                style={{ aspectRatio: "4 / 5" }}
                className="relative aspect-4-5 w-full rounded-2xl overflow-hidden shadow-2xl bg-[#E8E5DD]"
              >
                <div ref={imgInnerRef} className="relative w-full h-full">
                  <Image
                    src="/images/about-building.webp"
                    alt="Contemporary multi-level independent residence showcasing architectural civil design and exterior finishes"
                    width={800}
                    height={1000}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    quality={85}
                    className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  />
                </div>

                {/* Subtle bottom gradient & architectural caption */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 text-[#F3F0E8]">
                  <span className="text-[10px] font-sans font-medium uppercase tracking-[0.25em] text-[#C6A36A] block">
                    FOUNDATION TO FINISHING
                  </span>
                  <p className="text-sm font-serif italic text-[#F3F0E8]/90 mt-1">
                    Multi-floor residential houses & apartment developments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
