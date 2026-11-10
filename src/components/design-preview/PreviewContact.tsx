"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { SITE_CONFIG, generateWhatsAppLink } from "@/config/site";

export function PreviewContact() {
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

  const { whatsapp, contact } = SITE_CONFIG;

  const handleWhatsApp = () => {
    const url = generateWhatsAppLink({
      enquiryType: "New Project Consultation",
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full py-20 sm:py-28 lg:py-36 bg-[#FFFFFF] text-[#111315] border-t border-[#111315]/8"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={headerRef} className="max-w-3xl mb-14 sm:mb-20 space-y-3 sm:space-y-4">
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#C6A36A] font-medium block">
            Consultations & Enquiries
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#111315] leading-[1.08]">
            Let&apos;s discuss your <br />
            <span className="italic font-normal text-[#0E3D6E]">
              upcoming development.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-[#5A5E63] font-light leading-relaxed pt-1">
            Whether you are planning a private residential villa, multi-storey commercial framing, comprehensive interior fit-out, or turnkey retail rollout across Hyderabad and regional Telangana, our engineering team is available for preliminary site evaluations and detailed BOQ estimations.
          </p>
        </div>

        {/* Editorial Contact Presentation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Direct Communication Channels (7 Columns) */}
          <div className="lg:col-span-7 space-y-8 sm:space-y-10">
            <div className="divide-y divide-[#111315]/10 border-y border-[#111315]/10">
              {/* Telephone */}
              <div className="py-5 sm:py-7 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-2">
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#7A7F85]">
                  Direct Telephone
                </span>
                <div className="sm:text-right">
                  <a
                    href={`tel:${whatsapp.phoneNumber}`}
                    className="font-serif text-xl sm:text-2xl text-[#111315] hover:text-[#0E3D6E] transition-colors block"
                  >
                    {whatsapp.displayNumber}
                  </a>
                  <span className="text-xs text-[#5A5E63] font-light block mt-0.5">
                    Mon – Sat, 9:00 AM – 7:00 PM IST
                  </span>
                </div>
              </div>

              {/* WhatsApp Discussion */}
              <div className="py-5 sm:py-7 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-2">
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#7A7F85]">
                  Instant Channel
                </span>
                <div className="sm:text-right">
                  <button
                    onClick={handleWhatsApp}
                    className="group inline-flex items-center gap-1.5 font-serif text-xl sm:text-2xl text-[#111315] hover:text-[#0E3D6E] transition-colors"
                  >
                    <span>{whatsapp.displayNumber}</span>
                    <ArrowUpRight className="h-4 w-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </button>
                  <span className="text-xs text-[#5A5E63] font-light block mt-0.5">
                    Share CAD drawings, site sketches, and BOQs directly
                  </span>
                </div>
              </div>

              {/* Electronic Mail */}
              <div className="py-5 sm:py-7 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-2">
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#7A7F85]">
                  Electronic Mail
                </span>
                <div className="sm:text-right">
                  <a
                    href={`mailto:${contact.email}`}
                    className="font-serif text-xl sm:text-2xl text-[#111315] hover:text-[#0E3D6E] transition-colors block"
                  >
                    {contact.email}
                  </a>
                  <span className="text-xs text-[#5A5E63] font-light block mt-0.5">
                    Official channel for tender documents & technical RFPs
                  </span>
                </div>
              </div>

              {/* Operational Region */}
              <div className="py-5 sm:py-7 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-2">
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#7A7F85]">
                  Practice Region
                </span>
                <div className="sm:text-right">
                  <p className="font-serif text-xl sm:text-2xl text-[#111315]">
                    Hyderabad & Regional Telangana
                  </p>
                  <span className="text-xs text-[#5A5E63] font-light block mt-0.5">
                    Site visits and on-location reviews scheduled by appointment
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
              <button
                onClick={handleWhatsApp}
                className="inline-flex items-center justify-center gap-2 bg-[#111315] px-7 py-3.5 text-xs font-mono uppercase tracking-[0.18em] text-[#FAF8F5] hover:bg-[#0E3D6E] transition-colors duration-200 shadow-sm"
              >
                <span>Initiate WhatsApp Discussion</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>

              <a
                href={`mailto:${contact.email}`}
                className="inline-flex items-center justify-center gap-2 border border-[#111315]/20 bg-white px-7 py-3.5 text-xs font-mono uppercase tracking-[0.18em] text-[#111315] hover:border-[#111315] hover:bg-[#FAF9F6] transition-colors duration-200"
              >
                <span>Email Project Brief</span>
              </a>
            </div>
          </div>

          {/* Right Side: Architectural Studio Note & Site Oversight (5 Columns) */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EAE6DC] border border-[#111315]/8 shadow-sm">
              <Image
                src="/images/project-construction-site.webp"
                alt="Active civil engineering site in Hyderabad"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/80 block">
                  Site Operations · Hyderabad
                </span>
                <p className="text-xs font-light text-white/95 mt-0.5">
                  Every project is supervised on-site by qualified civil engineers.
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 border border-[#111315]/10 bg-[#FAF9F6] space-y-3 sm:space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C6A36A] font-medium block">
                Preliminary Consultation Protocol
              </span>
              <h4 className="font-serif text-lg text-[#111315]">
                What to prepare for your initial review:
              </h4>
              <ul className="space-y-2 text-xs text-[#5A5E63] font-light">
                <li className="flex items-start gap-2">
                  <span className="text-[#C6A36A]">•</span>
                  <span>Plot dimensions, site survey, or architectural AutoCAD layout</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C6A36A]">•</span>
                  <span>Scope requirement (Civil core & shell, turnkey interior, or exterior facade)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C6A36A]">•</span>
                  <span>Target completion timeframe and milestone expectations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
