"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MessageSquare, ArrowDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { generateWhatsAppLink } from "@/config/site";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgImageContainerRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const handleDiscussProject = () => {
    const url = generateWhatsAppLink({
      enquiryType: "New Project Discussion",
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth <= 768 || window.matchMedia("(pointer: coarse)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          [
            bgImageContainerRef.current,
            eyebrowRef.current,
            textRef.current,
            buttonsRef.current,
            scrollIndicatorRef.current,
          ],
          { opacity: 1, scale: 1, y: 0 }
        );
        return;
      }

      // Master entrance timeline: fast initial response without delaying content
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Cinematic Background Image Reveal
      if (bgImageContainerRef.current) {
        // Gentle background parallax on desktop; bypass on mobile touch to preserve native 120Hz momentum
        if (!isMobile) {
          gsap.to(bgImageContainerRef.current, {
            yPercent: 10,
            ease: "none",
            force3D: true,
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 0.6,
            },
          });
        }
      }

      // 2. Eyebrow animation (using GPU transform scaleX to eliminate layout shift on sibling text)
      if (eyebrowRef.current) {
        const line = eyebrowRef.current.querySelector(".eyebrow-line");
        const text = eyebrowRef.current.querySelector(".eyebrow-text");
        if (line) {
          tl.fromTo(line, { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.6 }, 0.05);
        }
        if (text) {
          tl.fromTo(text, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.6 }, 0.1);
        }
      }

      // 3. Headline line-by-line reveal
      if (headlineRef.current) {
        const lines = headlineRef.current.querySelectorAll(".headline-line");
        tl.fromTo(
          lines,
          { yPercent: isMobile ? 50 : 105, opacity: isMobile ? 0.3 : 0 },
          { yPercent: 0, opacity: 1, duration: isMobile ? 0.6 : 0.85, stagger: 0.08, ease: "power3.out" },
          isMobile ? 0.05 : 0.15
        );
      }

      // 4. Supporting text fade-in
      if (textRef.current) {
        tl.fromTo(
          textRef.current,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          isMobile ? 0.25 : 0.4
        );
      }

      // 5. Action buttons subtle stagger
      if (buttonsRef.current) {
        const btns = buttonsRef.current.children;
        tl.fromTo(
          btns,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 },
          isMobile ? 0.35 : 0.5
        );
      }

      // 6. Scroll indicator gentle entrance (desktop only)
      if (scrollIndicatorRef.current && !isMobile) {
        tl.fromTo(
          scrollIndicatorRef.current,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.7 },
          0.7
        );
      }
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ minHeight: "100vh", height: "100vh" }}
      className="relative min-h-screen h-screen w-full flex items-center justify-center overflow-hidden bg-[#090B0D]"
    >
      {/* Background Hero Image — Absolute Inset Locked to Viewport Dimensions */}
      <div
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%" }}
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      >
        <div
          ref={bgImageContainerRef}
          style={{ width: "100%", height: "100%" }}
          className="hero-bg-scale relative w-full h-full origin-center transform-gpu"
        >
          <Image
            src="/images/hero-residential-g4.webp"
            alt="Contemporary residential apartment building development at dusk by Vcube Infra Projects"
            fill
            priority
            sizes="100vw"
            quality={85}
            className="object-cover object-center"
          />

          {/* Sophisticated Editorial Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#090B0D] via-[#090B0D]/80 via-45% to-transparent lg:to-transparent" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#090B0D]/90 via-[#090B0D]/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#090B0D] to-transparent" />
        </div>
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pt-32 pb-20 flex flex-col justify-center">
        <div className="max-w-2xl space-y-6 sm:space-y-8">
          {/* Eyebrow */}
          <div ref={eyebrowRef} className="inline-flex items-center gap-2">
            <span className="eyebrow-line h-px w-8 bg-[#C6A36A]" />
            <span className="eyebrow-text text-xs sm:text-sm font-sans font-medium uppercase tracking-[0.28em] text-[#C6A36A]">
              CONSTRUCTION · INTERIORS · BRANDING
            </span>
          </div>

          {/* Headline in Elegant Serif Display with line-by-line reveal */}
          <h1
            ref={headlineRef}
            className="font-serif text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight text-[#F3F0E8] leading-[1.02]"
          >
            <span className="block overflow-hidden">
              <span className="headline-line block">SPACES</span>
            </span>
            <span className="block overflow-hidden">
              <span className="headline-line block">THAT</span>
            </span>
            <span className="block overflow-hidden">
              <span className="headline-line block">INSPIRE</span>
            </span>
          </h1>

          {/* Supporting Text */}
          <p
            ref={textRef}
            className="text-base sm:text-lg text-[#F3F0E8]/85 max-w-lg font-light leading-relaxed"
          >
            Specializing in multi-story residential apartments, custom independent residences, commercial structures, and turnkey interiors from foundation to form.
          </p>

          {/* Action Buttons */}
          <div ref={buttonsRef} className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/#projects"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F3F0E8] px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#090B0D] transition-all duration-300 hover:bg-[#C6A36A] hover:text-[#090B0D] active:scale-[0.98] shadow-lg shadow-black/40"
            >
              <span>Explore Our Work</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            <button
              onClick={handleDiscussProject}
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/30 bg-[#090B0D]/50 px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#F3F0E8] backdrop-blur-md transition-all duration-300 hover:border-[#C6A36A] hover:text-[#C6A36A] hover:bg-[#090B0D]/80 active:scale-[0.98]"
            >
              <MessageSquare className="h-4 w-4 text-[#25D366]" />
              <span>Discuss Your Project</span>
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          ref={scrollIndicatorRef}
          className="hidden lg:flex items-center gap-3 pt-16 text-xs text-[#F3F0E8]/50 font-light tracking-widest uppercase"
        >
          <ArrowDown className="h-3.5 w-3.5 animate-bounce text-[#C6A36A]" />
          <span>Scroll to explore</span>
        </div>
      </div>
    </section>
  );
}
