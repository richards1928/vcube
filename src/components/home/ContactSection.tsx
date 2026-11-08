"use client";

import React, { useEffect, useRef } from "react";
import { Mail, Phone, MapPin, Clock, MessageSquare, ShieldCheck, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SITE_CONFIG, generateWhatsAppLink } from "@/config/site";

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  const { contact, whatsapp } = SITE_CONFIG;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([headerRef.current, leftColRef.current?.children, rightColRef.current], {
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

      if (leftColRef.current) {
        gsap.fromTo(
          leftColRef.current.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: leftColRef.current,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      if (rightColRef.current) {
        gsap.fromTo(
          rightColRef.current,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: rightColRef.current,
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

  const handleLaunchWhatsApp = () => {
    const url = generateWhatsAppLink({});
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-24 bg-[#090B0D] border-t border-[#C6A36A]/15"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeading
            badge="06 // COMMUNICATE"
            title="Contact & Location"
            subtitle="Connect with the technical team at Vcube Infra Projects for estimations, site visits, and project consultations."
          />
          <div className="text-xs font-mono text-[#A0A4A8] shrink-0">
            <span>OFFICE HOURS: 09:00 - 19:00 IST</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Details Hub */}
          <div ref={leftColRef} className="lg:col-span-5 space-y-4">
            {/* Phone Card */}
            <div className="p-6 rounded-2xl border border-white/10 bg-[#171A1D]/70 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C6A36A]/10 text-[#C6A36A]">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#A0A4A8]">
                    Telephone Direct
                  </span>
                  <p className="text-base font-semibold text-[#F3F0E8]">
                    <a href={`tel:${whatsapp.phoneNumber}`} className="hover:text-[#C6A36A] transition-colors">
                      {whatsapp.displayNumber}
                    </a>
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#A0A4A8] ml-12">
                Available Monday through Saturday for civil tenders and consultation.
              </p>
            </div>

            {/* WhatsApp Card */}
            <div className="p-6 rounded-2xl border border-[#25D366]/30 bg-[#171A1D]/70 backdrop-blur-md">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#25D366]/20 text-[#25D366]">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#25D366]">
                      Official WhatsApp
                    </span>
                    <p className="text-base font-semibold text-[#F3F0E8]">
                      {whatsapp.displayNumber}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLaunchWhatsApp}
                  className="rounded-lg bg-[#25D366] p-2 text-black hover:bg-[#20ba5a] transition-colors"
                  aria-label="Direct WhatsApp Link"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-[#A0A4A8] ml-12">
                Direct channel for instant blueprints, drawings, and inquiries.
              </p>
            </div>

            {/* Email Card */}
            <div className="p-6 rounded-2xl border border-white/10 bg-[#171A1D]/70 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C6A36A]/10 text-[#C6A36A]">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#A0A4A8]">
                    Electronic Mail
                  </span>
                  <p className="text-base font-semibold text-[#F3F0E8]">
                    <a href={`mailto:${contact.email}`} className="hover:text-[#C6A36A] transition-colors">
                      {contact.email}
                    </a>
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#A0A4A8] ml-12">
                Official transmission for RFPs, BOQs, and formal contracts.
              </p>
            </div>

            {/* Hours Card */}
            <div className="p-6 rounded-2xl border border-white/10 bg-[#171A1D]/70 backdrop-blur-md flex items-center gap-3">
              <Clock className="h-5 w-5 text-[#C6A36A] shrink-0" />
              <div className="text-xs text-[#A0A4A8]">
                <span className="text-[#F3F0E8] font-medium block">
                  {contact.businessHours}
                </span>
                Standard Indian Standard Time (IST)
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Office Map / Location Matrix */}
          <div ref={rightColRef} className="lg:col-span-7 rounded-2xl border border-[#C6A36A]/30 bg-[#171A1D]/80 p-8 backdrop-blur-xl flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#C6A36A]" />
                  <span className="text-xs font-mono uppercase tracking-widest text-[#C6A36A]">
                    Registered Corporate Location
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#A0A4A8]">HYDERABAD METROPOLIS</span>
              </div>

              <h3 className="text-2xl font-light text-[#F3F0E8] font-heading">
                {contact.address.line1}
              </h3>
              <p className="text-sm text-[#A0A4A8] mt-2">
                {contact.address.line2}
                <br />
                {contact.address.city}, {contact.address.state} — {contact.address.pincode}, India
              </p>

              {/* Architectural Grid Map Representation */}
              <div className="mt-8 relative h-64 rounded-xl border border-white/10 bg-[#090B0D] overflow-hidden architectural-grid flex items-center justify-center">
                {/* Visual coordinate target */}
                <div className="relative flex items-center justify-center">
                  <div className="absolute h-32 w-32 rounded-full border border-[#C6A36A]/30 animate-ping opacity-30" />
                  <div className="absolute h-20 w-20 rounded-full border border-[#C6A36A]/50" />
                  <div className="h-3 w-3 rounded-full bg-[#C6A36A] shadow-[0_0_15px_#C6A36A]" />
                </div>

                <div className="absolute bottom-3 left-3 bg-[#171A1D]/90 border border-white/10 px-3 py-1.5 rounded text-[10px] font-mono text-[#A0A4A8]">
                  LAT: 17.4435° N // LON: 78.3772° E
                </div>
                <div className="absolute top-3 right-3 bg-[#171A1D]/90 border border-[#C6A36A]/30 px-3 py-1.5 rounded text-[10px] font-mono text-[#C6A36A]">
                  VCUBE HQ
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#A0A4A8]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#C6A36A]" />
                <span>Client verification notice: Contact numbers updated centrally.</span>
              </div>
              <button
                onClick={handleLaunchWhatsApp}
                className="text-[#C6A36A] hover:underline font-semibold"
              >
                Send Direct WhatsApp →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
