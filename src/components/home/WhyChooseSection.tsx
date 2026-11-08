"use client";

import React, { useEffect, useRef } from "react";
import { CheckCircle2, ShieldCheck, Layers, Users, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function WhyChooseSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const valueProps = [
    {
      title: "End-to-End Solutions",
      desc: "Complete civil construction, architectural interiors, and environmental branding managed under one coordinated practice, eliminating subcontractor silos.",
      icon: Layers,
      number: "01",
    },
    {
      title: "Customized Designs",
      desc: "Bespoke structural plans, modular false ceilings, custom joinery, and specialized flutter boards tailored to each residential or commercial brief.",
      icon: Sparkles,
      number: "02",
    },
    {
      title: "Quality Workmanship",
      desc: "Strict on-site engineering supervision, verified concrete testing, structural tolerance standards, and high-performance architectural materials.",
      icon: ShieldCheck,
      number: "03",
    },
    {
      title: "Client-Focused Approach",
      desc: "Direct communication with engineering leadership, transparent itemized quantity estimations, milestone accountability, and responsive WhatsApp support.",
      icon: Users,
      number: "04",
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([headerRef.current, cardsRef.current?.children], {
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

      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 82%",
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
      className="relative py-28 bg-[#111315] text-[#F3F0E8] overflow-hidden border-t border-white/5"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={headerRef} className="max-w-2xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2.5">
            <span className="h-px w-6 bg-[#C6A36A]" />
            <span className="text-xs font-sans font-semibold uppercase tracking-[0.25em] text-[#C6A36A]">
              OUR FOUNDATION
            </span>
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#F3F0E8] leading-[1.08]">
            Driven by Design. Built on Trust.
          </h2>

          <p className="text-base text-[#A0A4A8] font-light leading-relaxed">
            Our multidisciplinary practice is guided by four fundamental architectural and engineering principles.
          </p>
        </div>

        {/* 4 Restrained Value Propositions Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueProps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#16191D] p-7 transition-all duration-300 hover:border-[#C6A36A]/40 hover:bg-[#1A1E22]"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0A0C0E] border border-white/10 text-[#C6A36A] group-hover:border-[#C6A36A]/40 transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-mono text-[#A0A4A8]">
                      [{item.number}]
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-normal text-[#F3F0E8] group-hover:text-[#C6A36A] transition-colors">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-xs text-[#A0A4A8] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-[11px] text-[#C6A36A]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Verified Standard</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
