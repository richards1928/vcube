"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export function PreviewApproach() {
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

  const phases = [
    {
      number: "01",
      phase: "Phase I",
      title: "Pre-Construction & Feasibility",
      summary:
        "Comprehensive structural evaluation, geotechnical assessment, and precision quantity takeoff prior to site mobilization.",
      deliverables: [
        "Itemized Bill of Quantities (BOQ)",
        "Material lifecycle & grade specification",
        "Milestone-linked cashflow & procurement schedule",
        "Structural drawings & load calculations",
      ],
    },
    {
      number: "02",
      phase: "Phase II",
      title: "Civil & Structural Engineering",
      summary:
        "Full-lifecycle execution from deep foundation piling to high-tensile reinforced concrete framing with rigorous site testing.",
      deliverables: [
        "Earthwork excavation & foundation casting",
        "IS-compliant RCC column & shear wall framing",
        "Pre-pour rebar inspection & slump cone testing",
        "Monolithic slab casting & continuous curing",
      ],
    },
    {
      number: "03",
      phase: "Phase III",
      title: "Interior Architecture & Facade",
      summary:
        "Seamless integration of concealed MEP infrastructure, custom architectural millwork, and high-performance exterior cladding.",
      deliverables: [
        "Concealed electrical conduit & plumbing drops",
        "Acoustic false ceiling & lighting integration",
        "Natural stone, Italian marble & hardwood joinery",
        "Engineered ACP, louvers & exterior signage",
      ],
    },
  ];

  return (
    <section
      id="approach"
      ref={sectionRef}
      className="relative w-full py-20 sm:py-28 lg:py-36 bg-[#FAF9F6] text-[#111315] border-t border-[#111315]/8"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={headerRef}
          className="flex flex-col lg:flex-row lg:items-end justify-between pb-10 mb-14 sm:mb-20 border-b border-[#111315]/10 gap-8"
        >
          <div className="space-y-3 max-w-2xl">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C6A36A] font-medium block">
              Methodology & Execution
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#111315] leading-[1.08]">
              Precision from ground to finish.
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#5A5E63] max-w-md font-light leading-relaxed">
            By coordinating structural engineering, civil casting, interior architecture, and exterior branding under one accountable practice, we eliminate the friction, rework, and delays inherent in fragmented multi-contractor models.
          </p>
        </div>

        {/* 3-Column Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14 mb-16 sm:mb-24">
          {phases.map((item) => (
            <div
              key={item.number}
              className="flex flex-col justify-between pt-6 border-t border-[#111315]/15 space-y-6 sm:space-y-8"
            >
              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-baseline justify-between">
                  <span className="font-serif text-4xl sm:text-5xl font-light text-[#111315]/25">
                    {item.number}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C6A36A] font-medium">
                    {item.phase}
                  </span>
                </div>

                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#111315] leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#5A5E63] font-light leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="pt-5 border-t border-[#111315]/8 space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#7A7F85] block">
                  Core Deliverables
                </span>
                <ul className="space-y-2 text-xs text-[#22252A] font-light">
                  {item.deliverables.map((deliv, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-[#C6A36A] font-serif mt-[-2px] text-sm">•</span>
                      <span className="leading-relaxed">{deliv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Architectural Practice Principles Banner */}
        <div className="border border-[#111315]/10 bg-white p-8 sm:p-12 lg:p-14 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C6A36A] font-medium block">
                The Integrated Standard
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#111315] leading-tight">
                Single-point contractual accountability.
              </h3>
              <p className="text-xs sm:text-sm text-[#5A5E63] font-light leading-relaxed">
                Conventional projects divide responsibility among separate civil masons, interior carpenters, and signage fabricators — leading to conflicting site schedules and costly modifications. Our unified studio model delivers end-to-end coherence.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 lg:pt-0 lg:border-l lg:border-[#111315]/10 lg:pl-10">
              <div className="space-y-2">
                <span className="font-serif text-3xl font-light text-[#0E3D6E] block">
                  01
                </span>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#111315] font-semibold">
                  Zero MEP Conflict
                </h4>
                <p className="text-xs text-[#5A5E63] font-light leading-relaxed">
                  Electrical, plumbing, and HVAC drops are engineered before pouring concrete, preventing core cutting.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-serif text-3xl font-light text-[#0E3D6E] block">
                  02
                </span>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#111315] font-semibold">
                  Transparent BOQ
                </h4>
                <p className="text-xs text-[#5A5E63] font-light leading-relaxed">
                  Every metric ton of cement, rebar grade, and square foot of veneer is tracked against clear contract milestones.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-serif text-3xl font-light text-[#0E3D6E] block">
                  03
                </span>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#111315] font-semibold">
                  Direct Engineering
                </h4>
                <p className="text-xs text-[#5A5E63] font-light leading-relaxed">
                  Qualified civil engineers oversee execution daily, ensuring structural integrity and precise architectural finishing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
