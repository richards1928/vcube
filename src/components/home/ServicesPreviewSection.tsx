"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SITE_CONFIG } from "@/config/site";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export function ServicesPreviewSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const { construction, interiors, branding } = SITE_CONFIG.services;

  const serviceCards = [
    {
      data: construction,
      href: "/services/construction",
      image: "/images/service-construction.jpg",
      number: "01",
      tagline: "CIVIL & STRUCTURAL ENGINEERING",
      description:
        "Comprehensive civil structural works for residential apartment buildings, multi-level houses, and commercial structures from foundation and RCC columns to turnkey execution.",
    },
    {
      data: interiors,
      href: "/services/interiors",
      image: "/images/service-interiors.jpg",
      number: "02",
      tagline: "SPATIAL ARCHITECTURE & FIT-OUTS",
      description:
        "Bespoke turnkey interior environments encompassing false ceilings, custom furniture, Italian marble, flutter boards, painting, and ACP cladding.",
    },
    {
      data: branding,
      href: "/services/branding",
      image: "/images/service-branding.jpg",
      number: "03",
      tagline: "ENVIRONMENTAL & FACADE SIGNAGE",
      description:
        "Physical brand identity seamlessly integrated into built architecture: 3D illuminated letters, architectural signage, and sun control films.",
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([headerRef.current, cardsContainerRef.current?.children], {
          opacity: 1,
          y: 0,
        });
        return;
      }

      // 1. Header Reveal
      if (headerRef.current) {
        const eyebrow = headerRef.current.querySelector(".services-eyebrow");
        const title = headerRef.current.querySelector(".services-title");
        const desc = headerRef.current.querySelector(".services-desc");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
          defaults: { ease: "power3.out" },
        });

        if (eyebrow) tl.fromTo(eyebrow, { opacity: 0, x: -15 }, { opacity: 1, x: 0, duration: 0.7 });
        if (title) tl.fromTo(title, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.85 }, "-=0.4");
        if (desc) tl.fromTo(desc, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.75 }, "-=0.5");
      }

      // 2. Sequential Service Cards Reveal
      if (cardsContainerRef.current) {
        const cards = cardsContainerRef.current.children;
        const cardImages = cardsContainerRef.current.querySelectorAll(".service-card-img");

        gsap.fromTo(
          cards,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.16,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsContainerRef.current,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        );

        if (cardImages.length) {
          gsap.fromTo(
            cardImages,
            { scale: 1.08 },
            {
              scale: 1.0,
              duration: 1.3,
              stagger: 0.16,
              ease: "power2.out",
              scrollTrigger: {
                trigger: cardsContainerRef.current,
                start: "top 82%",
                toggleActions: "play none none none",
              },
            }
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
      id="services"
      className="relative py-28 bg-[#111315] text-[#F3F0E8] overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={headerRef} className="max-w-2xl mb-16 space-y-4">
          <div className="services-eyebrow inline-flex items-center gap-2.5">
            <span className="h-px w-6 bg-[#C6A36A]" />
            <span className="text-xs font-sans font-semibold uppercase tracking-[0.25em] text-[#C6A36A]">
              OUR SERVICES
            </span>
          </div>

          <h2 className="services-title font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#F3F0E8] leading-[1.08]">
            Everything Your Space Needs
          </h2>

          <p className="services-desc text-base text-[#A0A4A8] font-light leading-relaxed">
            Follow the verified scopes of work conceived in the original project specifications: Structural Civil Construction, Architectural Interiors, and Environmental Branding.
          </p>
        </div>

        {/* 3 Substantial Image-Led Service Cards */}
        <div ref={cardsContainerRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {serviceCards.map((card) => {
            const { data } = card;
            return (
              <div
                key={data.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-[#16191D] overflow-hidden transition-all duration-500 hover:border-[#C6A36A]/50 hover:shadow-2xl"
              >
                <div>
                  {/* Top Image Banner */}
                  <div style={{ aspectRatio: "16 / 11" }} className="relative aspect-16-11 w-full overflow-hidden bg-[#0A0C0E]">
                    <Image
                      src={card.image}
                      alt={`${data.title} by Vcube Infra Projects`}
                      width={600}
                      height={412}
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="service-card-img w-full h-auto aspect-[16/11] object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {/* Dark gradient over image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#16191D] via-[#16191D]/30 to-transparent" />

                    {/* Discipline Badge */}
                    <div className="absolute top-4 left-4 bg-[#090B0D]/85 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest text-[#C6A36A]">
                      DIVISION {card.number}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-7 space-y-4">
                    <div>
                      <span className="text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-[#C6A36A] block mb-1">
                        {card.tagline}
                      </span>
                      <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#F3F0E8] group-hover:text-[#C6A36A] transition-colors">
                        {data.title}
                      </h3>
                    </div>

                    <p className="text-xs text-[#A0A4A8] leading-relaxed line-clamp-2">
                      {card.description}
                    </p>

                    {/* Complete Exact Services Scope from Handwritten Notes */}
                    <div className="pt-4 border-t border-white/10 space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#F3F0E8]/70 block mb-2">
                        Included Capabilities:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {data.items.map((item) => (
                          <span
                            key={item.id}
                            className="inline-flex items-center gap-1.5 rounded-md bg-[#0D0F11] border border-white/5 px-2.5 py-1 text-[11px] text-[#F3F0E8] group-hover:border-[#C6A36A]/20 transition-colors"
                          >
                            <span className="h-1 w-1 rounded-full bg-[#C6A36A]" />
                            <span>{item.name}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-7 pt-0 flex items-center justify-between border-t border-white/10 mt-6 pt-5">
                  <Link
                    href={card.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#F3F0E8] group-hover:text-[#C6A36A] transition-colors"
                  >
                    <span>Explore {data.title}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#C6A36A]" />
                  </Link>

                  <WhatsAppButton
                    service={data.id}
                    label="Enquire"
                    variant="compact"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
