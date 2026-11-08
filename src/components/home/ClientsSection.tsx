"use client";

import React, { useEffect, useRef } from "react";
import { Building2, ShieldCheck, Lock, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export function ClientsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

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
        gsap.set([headerRef.current, gridRef.current?.children, bannerRef.current], {
          opacity: 1,
          y: 0,
        });
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

  return (
    <section
      ref={sectionRef}
      id="clients"
      className="relative py-28 bg-[#F5F3EC] text-[#111315] overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2.5">
              <span className="h-px w-6 bg-[#C6A36A]" />
              <span className="text-xs font-sans font-semibold uppercase tracking-[0.25em] text-[#C6A36A]">
                COLLABORATIONS
              </span>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#111315] leading-[1.08]">
              Clients & Enterprise Partners
            </h2>

            <p className="text-base text-[#4A4F55] font-light leading-relaxed">
              We collaborate with private property developers, corporate landlords, and commercial procurement boards. Verified portfolio references are shared under institutional confidentiality compliance.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[#111315]/10 bg-white/70 px-4 py-2.5 text-xs text-[#4A4F55] shrink-0 shadow-sm">
            <Lock className="h-4 w-4 text-[#C6A36A]" />
            <span>CONFIDENTIALITY & NDA COMPLIANT</span>
          </div>
        </div>

        {/* Structured Corporate Roster Grid (Zero fabricated brands) */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {clientCategories.map((cat) => (
            <div
              key={cat.slot}
              className="group relative flex flex-col justify-between rounded-2xl border border-[#111315]/10 bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-[#5A5D62] mb-6">
                  <span>PARTNER SECTOR</span>
                  <span className="text-[#C6A36A] font-bold">[{cat.slot}]</span>
                </div>

                <div className="h-12 w-12 rounded-xl bg-[#F5F3EC] border border-[#111315]/5 flex items-center justify-center text-[#111315] mb-5 group-hover:text-[#C6A36A] transition-colors">
                  <Building2 className="h-6 w-6" />
                </div>

                <h3 className="font-serif text-lg font-normal text-[#111315] leading-snug">
                  {cat.title}
                </h3>

                <p className="mt-2.5 text-xs text-[#4A4F55] leading-relaxed">
                  {cat.scope}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#111315]/10 flex items-center justify-between text-[11px] text-[#5A5D62]">
                <span>Verified Entity</span>
                <ShieldCheck className="h-4 w-4 text-[#C6A36A]" />
              </div>
            </div>
          ))}
        </div>

        {/* Commercial Tender Collaboration Banner */}
        <div ref={bannerRef} className="mt-12 rounded-2xl border border-[#111315]/10 bg-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C6A36A] block">
              Institutional & Commercial Tenders
            </span>
            <h3 className="font-serif text-2xl font-normal text-[#111315]">
              Initiate an Institutional Procurement Inquiry
            </h3>
            <p className="text-xs sm:text-sm text-[#4A4F55] max-w-xl leading-relaxed">
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
      </div>
    </section>
  );
}
