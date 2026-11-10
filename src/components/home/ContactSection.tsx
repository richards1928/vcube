"use client";

import React, { useEffect, useRef } from "react";
import { Mail, Phone, MapPin, Clock, MessageSquare, ShieldCheck, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SITE_CONFIG, generateWhatsAppLink } from "@/config/site";

interface ContactSectionProps {
  showHeading?: boolean;
  embedded?: boolean;
}

export function ContactSection({
  showHeading = true,
  embedded = false,
}: ContactSectionProps = {}) {
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
        const targets = [headerRef.current, leftColRef.current?.children, rightColRef.current].filter(Boolean);
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

  const content = (
    <>
      {showHeading && (
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
      )}

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

        {/* Right Column: Genuine Consultation & Project Engagement Hub */}
        <div ref={rightColRef} className="lg:col-span-7 rounded-2xl border border-[#C6A36A]/30 bg-[#171A1D]/80 p-8 sm:p-10 backdrop-blur-xl flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#C6A36A]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#C6A36A]">
                  Operational Hub & Service Region
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#A0A4A8]">HYDERABAD, TELANGANA</span>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-light text-[#F3F0E8] font-heading">
                Serving Hyderabad & Regional Telangana
              </h3>
              <p className="text-sm text-[#A0A4A8] mt-3 leading-relaxed">
                Vcube Infra Projects delivers civil structural execution, turnkey interiors, and architectural branding across Greater Hyderabad and surrounding districts. In-person consultations, architectural drawing reviews, and site feasibility visits are conducted by appointment.
              </p>
            </div>

            {/* Structured Project Engagement Steps */}
            <div className="rounded-xl border border-white/10 bg-[#090B0D]/80 p-6 space-y-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#C6A36A] block">
                How We Engage On New Projects
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5 border-l-2 border-[#C6A36A]/40 pl-3">
                  <span className="text-[10px] font-mono text-[#C6A36A]">01 // INITIATE</span>
                  <h4 className="text-xs font-medium text-[#F3F0E8]">Direct Contact</h4>
                  <p className="text-[11px] text-[#A0A4A8] leading-normal">
                    Call or message on WhatsApp with your project location and scope.
                  </p>
                </div>

                <div className="space-y-1.5 border-l-2 border-[#C6A36A]/40 pl-3">
                  <span className="text-[10px] font-mono text-[#C6A36A]">02 // EVALUATION</span>
                  <h4 className="text-xs font-medium text-[#F3F0E8]">Drawings & BOQ</h4>
                  <p className="text-[11px] text-[#A0A4A8] leading-normal">
                    Share CAD plans or architectural layouts for itemized quantity estimation.
                  </p>
                </div>

                <div className="space-y-1.5 border-l-2 border-[#C6A36A]/40 pl-3">
                  <span className="text-[10px] font-mono text-[#C6A36A]">03 // INSPECTION</span>
                  <h4 className="text-xs font-medium text-[#F3F0E8]">On-Site Visit</h4>
                  <p className="text-[11px] text-[#A0A4A8] leading-normal">
                    Coordinated site inspection and technical discussion with site engineers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#A0A4A8]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#C6A36A] shrink-0" />
              <span>Official Channels: +91 90143 03773 · vcubeinfraprojects@gmail.com</span>
            </div>
            <button
              onClick={handleLaunchWhatsApp}
              className="text-[#C6A36A] hover:underline font-semibold flex items-center gap-1 shrink-0"
            >
              <span>Connect on WhatsApp</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );

  if (embedded) {
    return (
      <div ref={sectionRef as any} id="contact" className="relative w-full">
        {content}
      </div>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-24 bg-[#090B0D] border-t border-[#C6A36A]/15"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {content}
      </div>
    </section>
  );
}
