"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageSquare, Phone, Mail, MapPin, ArrowUpRight, ShieldCheck } from "lucide-react";
import { SITE_CONFIG, generateWhatsAppLink } from "@/config/site";

export function Footer() {
  const { services, contact, whatsapp } = SITE_CONFIG;

  const handleGeneralWhatsApp = () => {
    const url = generateWhatsAppLink({});
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <footer className="relative border-t border-white/10 bg-[#0A0C0E] text-[#A0A4A8] overflow-hidden">
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C6A36A]/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Official Brand Logo */}
            <Link
              href="/"
              className="group relative inline-flex items-center transition-opacity duration-300 hover:opacity-90 focus:outline-none py-1"
              aria-label="Vcube Infra Projects Home"
            >
              {/* Localized subtle ambient contrast backlight */}
              <div
                className="absolute inset-0 -inset-x-3.5 -inset-y-1.5 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.85)_0%,_rgba(255,255,255,0.45)_40%,_transparent_75%)] pointer-events-none opacity-80 group-hover:opacity-95 transition-opacity duration-300"
                aria-hidden="true"
              />
              <Image
                src="/images/vcube-logo-transparent.webp"
                alt="Vcube Infra Projects"
                width={180}
                height={50}
                className="relative z-10 w-[160px] sm:w-[180px] h-auto object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
              />
            </Link>

            <p className="text-sm text-[#A0A4A8] max-w-sm leading-relaxed font-light">
              From foundation to finishing, we create functional, beautiful and lasting spaces. Turnkey civil construction, tailored interior environments, and physical environmental branding.
            </p>

            <div className="pt-2">
              <button
                onClick={handleGeneralWhatsApp}
                className="inline-flex items-center gap-2 rounded-full border border-[#25D366]/40 bg-[#16191D] px-5 py-2.5 text-xs font-semibold text-[#F3F0E8] hover:border-[#25D366] hover:bg-[#25D366]/10 transition-colors"
              >
                <MessageSquare className="h-4 w-4 text-[#25D366]" />
                <span>Instant WhatsApp: {whatsapp.displayNumber}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#A0A4A8]">
              <ShieldCheck className="h-4 w-4 text-[#C6A36A]" />
              <span>Civil & Architectural Infrastructure Practice</span>
            </div>
          </div>

          {/* Service Column 1: Construction */}
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C6A36A] block">
              Construction
            </span>
            <ul className="space-y-2 text-xs">
              {services.construction.items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/services/construction#${item.id}`}
                    className="hover:text-[#F3F0E8] transition-colors flex items-center justify-between group"
                  >
                    <span>{item.name}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 text-[#C6A36A] transition-opacity" />
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/services/construction"
                  className="text-[#C6A36A] hover:underline font-medium inline-block text-[11px]"
                >
                  View Division Page →
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Column 2: Interiors */}
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C6A36A] block">
              Interiors
            </span>
            <ul className="space-y-1.5 text-xs">
              {services.interiors.items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/services/interiors#${item.id}`}
                    className="hover:text-[#F3F0E8] transition-colors flex items-center justify-between group py-0.5"
                  >
                    <span>{item.name}</span>
                    <ArrowUpRight className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 text-[#C6A36A] transition-opacity" />
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/services/interiors"
                  className="text-[#C6A36A] hover:underline font-medium inline-block text-[11px]"
                >
                  View Division Page →
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Column 3: Branding & Contact */}
          <div className="space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#C6A36A] block">
                Branding
              </span>
              <ul className="space-y-1.5 text-xs">
                {services.branding.items.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/services/branding#${item.id}`}
                      className="hover:text-[#F3F0E8] transition-colors flex items-center justify-between group py-0.5"
                    >
                      <span>{item.name}</span>
                      <ArrowUpRight className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 text-[#C6A36A] transition-opacity" />
                    </Link>
                  </li>
                ))}
                <li className="pt-2">
                  <Link
                    href="/services/branding"
                    className="text-[#C6A36A] hover:underline font-medium inline-block text-[11px]"
                  >
                    View Division Page →
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#C6A36A] shrink-0 mt-0.5" />
                <span>{contact.address.city}, {contact.address.state}, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#C6A36A] shrink-0" />
                <a href={`mailto:${contact.email}`} className="hover:text-[#F3F0E8] transition-colors">
                  {contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#C6A36A] shrink-0" />
                <a href={`tel:${whatsapp.phoneNumber}`} className="hover:text-[#F3F0E8] transition-colors">
                  {whatsapp.displayNumber}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A0A4A8]">
          <p>© 2025 Vcube Infra Projects. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-[#F3F0E8] transition-colors">
              Home
            </Link>
            <Link href="/about" className="hover:text-[#F3F0E8] transition-colors">
              About
            </Link>
            <Link href="/projects" className="hover:text-[#F3F0E8] transition-colors">
              Our Projects
            </Link>
            <Link href="/clients" className="hover:text-[#F3F0E8] transition-colors">
              Clients
            </Link>
            <Link href="/contact" className="hover:text-[#F3F0E8] transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
