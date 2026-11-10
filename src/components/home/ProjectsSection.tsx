"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, AlertCircle } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SITE_CONFIG, ProjectItem } from "@/config/site";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

interface ProjectsSectionProps {
  limit?: number;
  theme?: "light" | "dark";
  showHeading?: boolean;
  embedded?: boolean;
}

export function ProjectsSection({
  limit,
  theme = "light",
  showHeading = true,
  embedded = false,
}: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [activeFilter, setActiveFilter] = useState<"all" | "construction" | "interiors" | "branding">("all");
  const isFirstRender = useRef(true);

  const filterTabs: Array<{ id: "all" | "construction" | "interiors" | "branding"; label: string }> = [
    { id: "all", label: "All Projects" },
    { id: "construction", label: "Construction" },
    { id: "interiors", label: "Interiors" },
    { id: "branding", label: "Branding" },
  ];

  // Map high-performance WebP imagery to residential and commercial projects
  const projectImages: Record<string, string> = {
    "proj-1": "/images/project-apartment-g4.webp",
    "proj-2": "/images/project-independent-house.webp",
    "proj-3": "/images/project-residential-interior.webp",
    "proj-4": "/images/project-construction-site.webp",
    "proj-5": "/images/service-branding.webp",
    "proj-6": "/images/project-commercial.webp",
  };

  const filteredProjects = SITE_CONFIG.demoProjects.filter((item) => {
    if (activeFilter === "all") return true;
    return item.category === activeFilter;
  });

  const displayProjects = limit ? filteredProjects.slice(0, limit) : filteredProjects;

  const isDark = theme === "dark";

  // Initial scroll-triggered reveal
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        const targets = [headerRef.current, filterBarRef.current, gridRef.current?.children].filter(Boolean);
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
          { opacity: 0 },
          {
            opacity: 1,
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

      if (filterBarRef.current) {
        gsap.fromTo(
          filterBarRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: filterBarRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
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

  // Filter change transition
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (gridRef.current) {
      const cards = gridRef.current.children;
      gsap.fromTo(
        cards,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }
      );
    }
  }, [activeFilter]);

  if (embedded) {
    return (
      <div ref={sectionRef as any} id="projects" className="relative w-full text-[#F3F0E8]">
        {/* Filter Tabs */}
        <div ref={filterBarRef} className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`rounded-full px-5 py-2 text-xs font-medium tracking-wider uppercase transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-[#C6A36A] text-black font-semibold shadow-md"
                    : "bg-[#171A1D] text-[#A0A4A8] hover:text-[#F3F0E8] border border-white/10"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {displayProjects.map((project) => {
            const imageSrc = projectImages[project.id] || "/images/project-construction-site.webp";
            return (
              <div
                key={project.id}
                className="group rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between bg-[#171A1D] border-white/10 hover:border-[#C6A36A]/40"
              >
                <div>
                  {/* Visual Image Header */}
                  <div className="relative aspect-16-11 w-full overflow-hidden bg-[#0A0C0E]">
                    <Image
                      src={imageSrc}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                    {/* Category Pill */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-[#F3F0E8] border border-white/20">
                        {project.category}
                      </span>
                    </div>

                    {/* Scope Badges */}
                    <div className="absolute bottom-3 left-4 right-4 z-10 flex flex-wrap gap-1.5">
                      {project.scope.slice(0, 2).map((s, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-black/70 backdrop-blur-sm px-2 py-0.5 text-[9px] font-mono text-[#C6A36A]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <span className="text-[11px] font-mono uppercase tracking-widest block mb-1.5 text-[#C6A36A]">
                      {project.categoryLabel}
                    </span>

                    <h3 className="text-xl font-medium tracking-tight mb-2.5 transition-colors text-[#F3F0E8] group-hover:text-[#C6A36A]">
                      {project.title}
                    </h3>

                    <p className="text-xs line-clamp-3 leading-relaxed text-[#A0A4A8]">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Bottom WhatsApp Button */}
                <div className="p-6 pt-0 border-t mt-4 pt-4 flex items-center justify-between border-white/10">
                  <span className="text-[11px] font-mono text-[#A0A4A8]">
                    Concept Study
                  </span>
                  <WhatsAppButton
                    projectTitle={project.title}
                    label="Inquire Project"
                    variant="compact"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="projects"
      className={
        isDark
          ? "relative py-4 text-[#F3F0E8] overflow-hidden"
          : "relative py-28 bg-[#F5F3EC] text-[#111315] overflow-hidden"
      }
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header (Rendered on homepage, bypassed on standalone page where H1 is provided) */}
        {showHeading && (
          <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2.5">
                <span className="h-px w-6 bg-[#C6A36A]" />
                <span className="text-xs font-sans font-semibold uppercase tracking-[0.25em] text-[#C6A36A]">
                  FEATURED RESIDENTIAL & COMMERCIAL WORK
                </span>
              </div>

              <h2 className={`font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight leading-[1.08] ${
                isDark ? "text-[#F3F0E8]" : "text-[#111315]"
              }`}>
                Real Spaces. Real Impact.
              </h2>

              <p className={`text-base font-light leading-relaxed ${
                isDark ? "text-[#A0A4A8]" : "text-[#4A4F55]"
              }`}>
                Explore our architectural portfolio spanning residential apartment developments, multi-level independent houses, residential interiors, and commercial projects.
              </p>
            </div>

            {/* Development Disclosure Notice */}
            <div className={`flex items-center gap-2 rounded-xl border p-3 text-xs max-w-xs shrink-0 shadow-sm ${
              isDark
                ? "border-white/10 bg-[#171A1D]/80 text-[#A0A4A8]"
                : "border-[#111315]/10 bg-white/70 text-[#4A4F55]"
            }`}>
              <AlertCircle className="h-4 w-4 text-[#C6A36A] shrink-0" />
              <span>Development Demonstration: Demonstrating capabilities pending client case study assets.</span>
            </div>
          </div>
        )}

        {/* Working Filter Tabs */}
        <div ref={filterBarRef} className={`flex flex-wrap items-center gap-2 mb-12 border-b pb-4 ${
          isDark ? "border-white/10" : "border-[#111315]/10"
        }`}>
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            let tabClasses = "";
            if (isDark) {
              tabClasses = isActive
                ? "bg-[#C6A36A] text-[#090B0D] font-semibold shadow-md"
                : "bg-transparent text-[#A0A4A8] hover:text-[#F3F0E8] hover:bg-white/5";
            } else {
              tabClasses = isActive
                ? "bg-[#111315] text-[#F3F0E8] font-semibold shadow-md"
                : "bg-transparent text-[#4A4F55] hover:text-[#111315] hover:bg-black/5";
            }

            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`rounded-full px-5 py-2 text-xs font-medium tracking-wide transition-all ${tabClasses}`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Large Editorial Portfolio Cards Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project) => {
            const imageSrc = projectImages[project.id] || "/images/hero-indian-morning.webp";
            return (
              <div
                key={project.id}
                className={`group relative flex flex-col justify-between rounded-2xl border overflow-hidden shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${
                  isDark
                    ? "border-white/10 bg-[#171A1D]/80 backdrop-blur-md hover:border-[#C6A36A]/40 hover:bg-[#1A1E22]"
                    : "border-[#111315]/10 bg-white hover:border-[#C6A36A]/40"
                }`}
              >
                <div>
                  {/* Top Image Banner */}
                  <div style={{ aspectRatio: "16 / 11" }} className="relative aspect-16-11 w-full overflow-hidden bg-[#16191D]">
                    <Image
                      src={imageSrc}
                      alt={project.title}
                      width={600}
                      height={412}
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="w-full h-auto aspect-[16/11] object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Category Tag */}
                    <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono tracking-wider text-[#C6A36A] border border-white/10">
                      {project.categoryLabel}
                    </div>

                    {/* Status Pill */}
                    <div className="absolute bottom-4 left-4 text-[#F3F0E8]">
                      <span className="text-[10px] font-mono tracking-wider opacity-80 block">
                        YEAR {project.year} · DEMO ARCHIVE
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-3">
                    <h3 className={`font-serif text-xl sm:text-2xl font-normal leading-snug transition-colors group-hover:text-[#C6A36A] ${
                      isDark ? "text-[#F3F0E8]" : "text-[#111315]"
                    }`}>
                      {project.title}
                    </h3>

                    <p className={`text-xs leading-relaxed line-clamp-2 ${
                      isDark ? "text-[#A0A4A8]" : "text-[#4A4F55]"
                    }`}>
                      {project.description}
                    </p>

                    {/* Scope Tags */}
                    <div className={`pt-3 border-t flex flex-wrap gap-1.5 ${
                      isDark ? "border-white/10" : "border-[#111315]/10"
                    }`}>
                      {project.scope.map((tag) => (
                        <span
                          key={tag}
                          className={`rounded px-2 py-0.5 text-[10px] font-medium border ${
                            isDark
                              ? "bg-[#090B0D] text-[#C6A36A] border-[#C6A36A]/20"
                              : "bg-[#F5F3EC] text-[#111315] border-[#111315]/5"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom WhatsApp Button */}
                <div className={`p-6 pt-0 border-t mt-4 pt-4 flex items-center justify-between ${
                  isDark ? "border-white/10" : "border-[#111315]/10"
                }`}>
                  <span className={`text-[11px] font-mono ${
                    isDark ? "text-[#A0A4A8]" : "text-[#5A5D62]"
                  }`}>
                    Concept Study
                  </span>
                  <WhatsAppButton
                    projectTitle={project.title}
                    label="Inquire Project"
                    variant="compact"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA (Homepage Only) */}
        {limit && (
          <div className="mt-16 text-center">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-[#111315] bg-transparent px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#111315] transition-all duration-300 hover:bg-[#111315] hover:text-[#F3F0E8] active:scale-[0.98]"
            >
              <span>View Full Project Archive</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
