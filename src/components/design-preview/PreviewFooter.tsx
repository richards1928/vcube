"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUp, ArrowLeft } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

export function PreviewFooter() {
  const [currentYear, setCurrentYear] = React.useState<number>(2026);

  React.useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#FAF9F6] text-[#111315] border-t border-[#111315]/10 pt-16 sm:pt-20 pb-12 sm:pb-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 pb-12 sm:pb-16 border-b border-[#111315]/10">
          {/* Logo & Studio Monograph Description (5 Cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/design-preview" className="inline-block">
              <Image
                src="/images/vcube-logo-transparent.webp"
                alt="Vcube Infra Projects"
                width={175}
                height={49}
                className="w-[145px] sm:w-[165px] h-auto object-contain"
              />
            </Link>
            <p className="text-xs text-[#5A5E63] font-light leading-relaxed max-w-sm">
              Integrated civil construction, architectural interior fit-out, and commercial facade engineering practice headquartered in Hyderabad, Telangana.
            </p>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C6A36A]">
              {SITE_CONFIG.tagline}
            </p>
          </div>

          {/* Quick Nav Links (3 Cols) */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#7A7F85] block">
              Navigation
            </span>
            <ul className="space-y-2 text-xs font-mono uppercase tracking-wider text-[#5A5E63]">
              <li>
                <a href="#expertise" className="hover:text-[#111315] transition-colors">
                  Core Disciplines
                </a>
              </li>
              <li>
                <a href="#selected-work" className="hover:text-[#111315] transition-colors">
                  Demonstration Portfolio
                </a>
              </li>
              <li>
                <a href="#approach" className="hover:text-[#111315] transition-colors">
                  Methodology
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#111315] transition-colors">
                  Studio Philosophy
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#111315] transition-colors">
                  Direct Enquiry
                </a>
              </li>
            </ul>
          </div>

          {/* Office Contact (4 Cols) */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#7A7F85] block">
              Studio Desks
            </span>
            <div className="space-y-2 text-xs text-[#5A5E63] font-light">
              <p>
                <span className="font-mono uppercase text-[10px] text-[#7A7F85] block">Telephone:</span>
                <a href={`tel:${SITE_CONFIG.whatsapp.phoneNumber}`} className="text-[#111315] hover:text-[#0E3D6E]">
                  {SITE_CONFIG.whatsapp.displayNumber}
                </a>
              </p>
              <p>
                <span className="font-mono uppercase text-[10px] text-[#7A7F85] block">Electronic Mail:</span>
                <a href={`mailto:${SITE_CONFIG.contact.email}`} className="text-[#111315] hover:text-[#0E3D6E]">
                  {SITE_CONFIG.contact.email}
                </a>
              </p>
              <p>
                <span className="font-mono uppercase text-[10px] text-[#7A7F85] block">Headquarters:</span>
                <span className="text-[#111315]">Hyderabad & Regional Telangana</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-[#7A7F85]">
          <p>© {currentYear} Vcube Infra Projects. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[#0E3D6E] hover:underline font-semibold"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Return to Standard Website</span>
            </Link>

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 hover:text-[#111315] transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
