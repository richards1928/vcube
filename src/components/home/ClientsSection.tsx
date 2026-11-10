"use client";

import React, { useEffect, useRef } from "react";
import { Building2, ShieldCheck, Lock, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

interface ClientsSectionProps {
  theme?: "light" | "dark";
  showHeading?: boolean;
  embedded?: boolean;
}

export function ClientsSection({
  theme = "light",
  showHeading = true,
  embedded = false,
}: ClientsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  const isDark = theme === "dark";

  const clientCategories = [
    {
      title: "Residential Apartment Developers & Housing Projects",
      scope: "Turnkey multi-story apartment construction, structural RCC frames, and elevation finishes.",
      slot: "01",
    },
    {
      title: "Independent Multi-Floor Homeowners",
      scope: "Custom multi-level independent residences, stilt parking, balconies, and terrace pergolas.",
      slot: "02",
    },
    {
      title: "Retail Flagships & Storefronts",
      scope: "Exterior ACP cladding, sun control films, and 3D illuminated branding.",
      slot: "03",
    },
    {
      title: "Institutional Infrastructure",
      scope: "Structural RCC frameworks, architectural drawings, and MEP execution.",
      slot: "04",
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        const targets = [headerRef.current, gridRef.current?.children, bannerRef.current].filter(Boolean);
        if (targets.length) {
          gsap.set(targets, {
            opacity: 1,
            y: 0,
          });
        }
        return;
      }

      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      if (bannerRef.current) {
        gsap.fromTo(
          bannerRef.current,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: bannerRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  const content = (
    <>
      {/* Section Header (Homepage Only) */}
      {showHeading && (
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2.5">
              <span className="h-px w-6 bg-[#C6A36A]" />
              <span className="text-xs font-sans font-semibold uppercase tracking-[0.25em] text-[#C6A36A]">
                COLLABORATIONS
              </span>
            </div>

            <h2 className={`font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight leading-[1.08] ${
              isDark ? "text-[#F3F0E8]" : "text-[#111315]"
            }`}>
              Clients & Enterprise Partners
            </h2>

            <p className={`text-base font-light leading-relaxed ${
              isDark ? "text-[#A0A4A8]" : "text-[#4A4F55]"
            }`}>
              We collaborate with private property developers, corporate landlords, and commercial procurement boards. Verified portfolio references are shared under institutional confidentiality compliance.
            </p>
          </div>

          <div className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs shrink-0 shadow-sm ${
            isDark
              ? "border-white/10 bg-[#171A1D]/80 text-[#A0A4A8]"
              : "border-[#111315]/10 bg-white/70 text-[#4A4F55]"
          }`}>
            <Lock className="h-4 w-4 text-[#C6A36A]" />
            <span>CONFIDENTIALITY & NDA COMPLIANT</span>
          </div>
        </div>
      )}

      {/* Structured Corporate Roster Grid */}
      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {clientCategories.map((cat) => (
          <div
            key={cat.slot}
            className={`group relative flex flex-col justify-between rounded-2xl border p-7 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
              isDark
                ? "border-white/10 bg-[#171A1D]/80 backdrop-blur-md hover:border-[#C6A36A]/40 hover:bg-[#1A1E22]"
                : "border-[#111315]/10 bg-white hover:border-[#C6A36A]/40"
            }`}
          >
            <div>
              <div className={`flex items-center justify-between text-[11px] font-mono mb-6 ${
                isDark ? "text-[#A0A4A8]" : "text-[#5A5D62]"
              }`}>
                <span>PARTNER SECTOR</span>
                <span className="text-[#C6A36A] font-bold">[{cat.slot}]</span>
              </div>

              <div className={`h-12 w-12 rounded-xl border flex items-center justify-center mb-5 transition-colors ${
                isDark
                  ? "bg-[#090B0D] border-white/10 text-[#F3F0E8] group-hover:text-[#C6A36A]"
                  : "bg-[#F5F3EC] border-[#111315]/5 text-[#111315] group-hover:text-[#C6A36A]"
              }`}>
                <Building2 className="h-6 w-6" />
              </div>

              <h3 className={`font-serif text-lg font-normal leading-snug transition-colors group-hover:text-[#C6A36A] ${
                isDark ? "text-[#F3F0E8]" : "text-[#111315]"
              }`}>
                {cat.title}
              </h3>

              <p className={`mt-2.5 text-xs leading-relaxed ${
                isDark ? "text-[#A0A4A8]" : "text-[#4A4F55]"
              }`}>
                {cat.scope}
              </p>
            </div>

            <div className={`mt-6 pt-4 border-t flex items-center justify-between text-[11px] ${
              isDark ? "border-white/10 text-[#A0A4A8]" : "border-[#111315]/10 text-[#5A5D62]"
            }`}>
              <span>Verified Entity</span>
              <ShieldCheck className="h-4 w-4 text-[#C6A36A]" />
            </div>
          </div>
        ))}
      </div>

      {/* Commercial Tender Collaboration Banner */}
      <div ref={bannerRef} className={`mt-12 rounded-2xl border p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm ${
        isDark
          ? "border-[#C6A36A]/30 bg-gradient-to-r from-[#171A1D] via-[#171A1D]/90 to-[#090B0D]"
          : "border-[#111315]/10 bg-white"
      }`}>
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-[#C6A36A] block">
            Institutional & Commercial Tenders
          </span>
          <h3 className={`font-serif text-2xl font-normal ${
            isDark ? "text-[#F3F0E8]" : "text-[#111315]"
          }`}>
            Initiate an Institutional Procurement Inquiry
          </h3>
          <p className={`text-xs sm:text-sm max-w-xl leading-relaxed ${
            isDark ? "text-[#A0A4A8]" : "text-[#4A4F55]"
          }`}>
            We welcome private developers, architectural studios, and corporate procurement teams to review project documentation and schedule technical presentations.
          </p>
        </div>

        <div className="shrink-0">
          <WhatsAppButton
            service="general"
            label="Contact Enterprise Desk"
            variant="primary"
            className="rounded-full"
          />
        </div>
      </div>
    </>
  );

  if (embedded) {
    return (
      <div ref={sectionRef as any} id="clients" className="relative w-full text-[#F3F0E8]">
        {content}
      </div>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="clients"
      className={
        isDark
          ? "relative py-4 text-[#F3F0E8] overflow-hidden"
          : "relative py-28 bg-[#F5F3EC] text-[#111315] overflow-hidden"
      }
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {content}
      </div>
    </section>
  );
}
