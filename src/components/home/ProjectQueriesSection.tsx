"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { MessageSquare, ExternalLink, Check, ArrowUpRight, ShieldCheck } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SITE_CONFIG, generateWhatsAppLink } from "@/config/site";

export function ProjectQueriesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);

  const [selectedDivision, setSelectedDivision] = useState<"construction" | "interiors" | "branding">("construction");
  const [projectType, setProjectType] = useState("Commercial Space");
  const [timeline, setTimeline] = useState("Immediate (Within 30 Days)");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [selectedSubItems, setSelectedSubItems] = useState<string[]>([]);

  const services = SITE_CONFIG.services;
  const currentServiceData = services[selectedDivision];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([leftColRef.current, formCardRef.current], { opacity: 1, y: 0 });
        return;
      }

      if (leftColRef.current) {
        gsap.fromTo(
          leftColRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: leftColRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      if (formCardRef.current) {
        gsap.fromTo(
          formCardRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: formCardRef.current,
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

  const toggleSubItem = (name: string) => {
    setSelectedSubItems((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  const handleLaunchWhatsApp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const itemsText =
      selectedSubItems.length > 0
        ? ` Scopes: [${selectedSubItems.join(", ")}].`
        : "";
    const typeText = ` Type: ${projectType}. Timeline: ${timeline}.`;
    const notesText = additionalNotes.trim() ? ` Details: "${additionalNotes.trim()}"` : "";

    const combinedDetails = `${typeText}${itemsText}${notesText}`;

    const url = generateWhatsAppLink({
      service: selectedDivision,
      customNotes: combinedDetails,
    });

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDirectWhatsApp = () => {
    const url = generateWhatsAppLink({
      enquiryType: "New Project",
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      ref={sectionRef}
      id="queries"
      className="relative py-28 bg-[#111315] text-[#F3F0E8] overflow-hidden border-t border-white/5"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Split-Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Striking Architectural Narrative & Direct CTAs */}
          <div ref={leftColRef} className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2.5">
                <span className="h-px w-6 bg-[#C6A36A]" />
                <span className="text-xs font-sans font-semibold uppercase tracking-[0.25em] text-[#C6A36A]">
                  PROJECT INITIATION
                </span>
              </div>

              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#F3F0E8] leading-[1.08]">
                Have a Project in Mind?
              </h2>

              <p className="text-base text-[#A0A4A8] font-light leading-relaxed">
                Whether you are planning a multi-story residential apartment complex, constructing a custom independent house, executing turnkey residential interiors, or developing commercial infrastructure, our multidisciplinary engineering team is ready to assist.
              </p>
            </div>

            {/* Direct Dual CTAs */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleDirectWhatsApp}
                className="inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-[#20ba5a] active:scale-[0.98] shadow-lg shadow-[#25D366]/20"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Chat on WhatsApp</span>
              </button>

              <a
                href="#quote-form"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-transparent px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#F3F0E8] transition-all hover:border-[#C6A36A] hover:text-[#C6A36A] active:scale-[0.98]"
              >
                <span>Get a Quote</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

            {/* Architectural Image Card Accent */}
            <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-xl hidden sm:block bg-[#0A0C0E]">
              <Image
                src="/images/project-commercial.webp"
                alt="Architectural development by Vcube Infra Projects"
                width={600}
                height={375}
                sizes="(max-width: 1024px) 100vw, 500px"
                quality={85}
                className="w-full h-auto object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 flex flex-col justify-end">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#C6A36A]">
                  VCUBE INFRA PROJECTS
                </span>
                <p className="text-xs text-[#F3F0E8]/90 font-serif italic mt-0.5">
                  Civil structural works · Custom interiors · Environmental signage
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#A0A4A8]">
              <ShieldCheck className="h-4 w-4 text-[#C6A36A]" />
              <span>Centrally configured: {SITE_CONFIG.whatsapp.displayNumber}</span>
            </div>
          </div>

          {/* Right Column: Quote & Scope Form */}
          <div ref={formCardRef} id="quote-form" className="lg:col-span-7">
            <form
              onSubmit={handleLaunchWhatsApp}
              className="rounded-3xl border border-white/10 bg-[#16191D] p-7 sm:p-10 shadow-2xl space-y-6"
            >
              <div>
                <h3 className="font-serif text-2xl font-normal text-[#F3F0E8]">
                  Request an Architectural Quote
                </h3>
                <p className="text-xs text-[#A0A4A8] mt-1">
                  Select your division and scopes to generate a verified, pre-formatted WhatsApp enquiry.
                </p>
              </div>

              {/* Step 1: Division Selection */}
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#C6A36A] block mb-2.5">
                  1. Primary Division
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { id: "construction", label: "Construction" },
                    { id: "interiors", label: "Interiors" },
                    { id: "branding", label: "Branding" },
                  ].map((div) => {
                    const isSelected = selectedDivision === div.id;
                    return (
                      <button
                        type="button"
                        key={div.id}
                        onClick={() => {
                          setSelectedDivision(div.id as any);
                          setSelectedSubItems([]);
                        }}
                        className={`py-3 px-3 rounded-xl border text-center transition-all text-xs font-medium ${
                          isSelected
                            ? "border-[#C6A36A] bg-[#C6A36A]/15 text-[#C6A36A] font-semibold"
                            : "border-white/10 bg-[#0A0C0E]/60 text-[#A0A4A8] hover:text-[#F3F0E8]"
                        }`}
                      >
                        {div.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Specific Services Scope Chips */}
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#C6A36A] block mb-2.5">
                  2. Select Scopes of Interest ({currentServiceData.title})
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentServiceData.items.map((item) => {
                    const isChecked = selectedSubItems.includes(item.name);
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => toggleSubItem(item.name)}
                        className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${
                          isChecked
                            ? "border-[#C6A36A] bg-[#C6A36A] text-black font-semibold"
                            : "border-white/10 bg-[#0A0C0E]/50 text-[#A0A4A8] hover:text-[#F3F0E8] hover:border-white/20"
                        }`}
                      >
                        {isChecked ? `✓ ${item.name}` : `+ ${item.name}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Project Type & Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="project-classification" className="block text-[11px] font-mono uppercase tracking-wider text-[#A0A4A8] mb-2">
                    Project Classification
                  </label>
                  <select
                    id="project-classification"
                    name="projectClassification"
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0A0C0E] p-3 text-xs text-[#F3F0E8] focus:border-[#C6A36A] focus:outline-none"
                  >
                    <option value="Residential Apartment Building">Residential Apartment Building</option>
                    <option value="Independent Multi-Level House">Independent Multi-Level House</option>
                    <option value="Residential Interior Fit-out">Residential Interior Fit-out</option>
                    <option value="Boutique Commercial / Retail Building">Boutique Commercial / Retail Building</option>
                    <option value="Architectural Signage & Branding">Architectural Signage & Branding</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="project-timeline" className="block text-[11px] font-mono uppercase tracking-wider text-[#A0A4A8] mb-2">
                    Timeline
                  </label>
                  <select
                    id="project-timeline"
                    name="projectTimeline"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0A0C0E] p-3 text-xs text-[#F3F0E8] focus:border-[#C6A36A] focus:outline-none"
                  >
                    <option value="Immediate (Within 30 Days)">Immediate (Within 30 Days)</option>
                    <option value="Planning Stage (1-3 Months)">Planning Stage (1-3 Months)</option>
                    <option value="Tender / BOQ Stage">Tender / BOQ Stage</option>
                  </select>
                </div>
              </div>

              {/* Step 4: Notes */}
              <div>
                <label htmlFor="project-notes" className="block text-[11px] font-mono uppercase tracking-wider text-[#A0A4A8] mb-2">
                  Project Details (Optional)
                </label>
                <textarea
                  id="project-notes"
                  name="projectNotes"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Mention area size, location, structural floors, or specific interior finishes..."
                  rows={2}
                  className="w-full rounded-xl border border-white/10 bg-[#0A0C0E] p-3 text-xs text-[#F3F0E8] placeholder-[#A0A4A8]/60 focus:border-[#C6A36A] focus:outline-none"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2.5 rounded-full bg-[#C6A36A] px-6 py-4 text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-[#DFC293] active:scale-[0.99] shadow-lg shadow-[#C6A36A]/20"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Generate Pre-filled WhatsApp Enquiry</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
                <p className="mt-2 text-center text-[10px] text-[#A0A4A8]">
                  Will open directly in WhatsApp for you to review and send.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
