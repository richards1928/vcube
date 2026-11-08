import React from "react";
import type { Metadata } from "next";
import { ContactSection } from "@/components/home/ContactSection";
import { SITE_CONFIG } from "@/config/site";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { Phone, Mail, MapPin, Clock, MessageSquare, ShieldCheck } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Contact Us | Office & Project Inquiries",
  description:
    "Get in touch with Vcube Infra Projects for civil construction estimations, interior fit-outs, and environmental branding.",
};

export default function ContactPage() {
  const { contact, whatsapp } = SITE_CONFIG;

  return (
    <div className="w-full pt-28 pb-24 bg-[#090B0D] text-[#F3F0E8] architectural-grid">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Top Header */}
        <ScrollReveal direction="up" distance={30} duration={0.85} className="max-w-3xl mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C6A36A]/30 bg-[#171A1D] px-3.5 py-1 text-[11px] font-mono tracking-widest text-[#C6A36A]">
            <span>COMMUNICATION & HEADQUARTERS</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#F3F0E8] font-heading">
            Contact Vcube Infra Projects
          </h1>

          <p className="text-base sm:text-lg text-[#A0A4A8] leading-relaxed">
            Reach out to our engineering and design desk for turnkey project consultations, drawings review, and site inspections.
          </p>
        </ScrollReveal>

        {/* Contact Section Component */}
        <ContactSection />
      </div>
    </div>
  );
}
