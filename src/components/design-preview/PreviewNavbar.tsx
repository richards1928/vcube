"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, ArrowLeft, MessageSquare } from "lucide-react";
import { generateWhatsAppLink } from "@/config/site";
import { Logo } from "@/components/ui/Logo";

export function PreviewNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dismiss dropdown on outside click or escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        servicesDropdownRef.current &&
        !servicesDropdownRef.current.contains(event.target as Node)
      ) {
        setServicesDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setServicesDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleWhatsAppEnquiry = () => {
    const url = generateWhatsAppLink({
      enquiryType: "Architectural Project Consultation",
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const serviceSubItems = [
    {
      label: "Construction",
      href: "/services/construction",
      desc: "Estimations, Plans, Structural Work & Execution",
    },
    {
      label: "Interiors",
      href: "/services/interiors",
      desc: "False Ceilings, Furniture, Flooring & Finishes",
    },
    {
      label: "Branding",
      href: "/services/branding",
      desc: "Logos, External/Internal Signage & Sun Films",
    },
  ];

  return (
    <>
      {/* 1. Subtle Preview Notice Bar (Warm Ivory) */}
      <div className="w-full bg-[#FAF9F6] text-[#5A5E63] py-1.5 px-4 sm:px-8 text-[11px] font-mono tracking-wider flex items-center justify-between border-b border-[#111315]/8 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#C6A36A]" />
          <span className="text-[#C6A36A] font-semibold uppercase tracking-widest">
            DESIGN EXPLORATION
          </span>
          <span className="hidden md:inline text-[#7A7F85]">
            · Version 2.0 Architectural Studio Identity
          </span>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[#5A5E63] hover:text-[#111315] transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          <span>Exit Preview</span>
        </Link>
      </div>

      {/* 2. Warm Ivory Architectural Header */}
      <header
        className={`sticky top-[29px] z-40 w-full transition-all duration-300 relative border-b border-[#111315]/8 ${
          isScrolled
            ? "bg-[#FAF9F6]/95 backdrop-blur-md py-3 sm:py-3.5 shadow-[0_2px_16px_rgba(0,0,0,0.04)]"
            : "bg-[#FAF9F6] py-4 sm:py-4.5"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between w-full">
            {/* 1. FAR LEFT: Original Vcube Logo */}
            <Logo variant="navbar" href="/design-preview" priority />

            {/* 2. RIGHT: Exact Navigation Order */}
            <div className="flex items-center gap-6 xl:gap-8">
              {/* Desktop Nav Items */}
              <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
                {/* 1. Home (Active Champagne Indicator) */}
                <Link
                  href="/design-preview"
                  className="relative text-[13px] tracking-wide font-medium text-[#C6A36A] py-1 transition-colors"
                >
                  <span>Home</span>
                  <span className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-[#C6A36A] rounded-full" />
                </Link>

                {/* 2. About */}
                <a
                  href="#about"
                  className="text-[13px] tracking-wide font-normal text-[#111315]/85 hover:text-[#C6A36A] transition-colors py-1"
                >
                  About
                </a>

                {/* 3. Services (Dropdown) */}
                <div
                  ref={servicesDropdownRef}
                  className="relative"
                  onMouseEnter={() => setServicesDropdownOpen(true)}
                  onMouseLeave={() => setServicesDropdownOpen(false)}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setServicesDropdownOpen((prev) => !prev);
                    }}
                    aria-expanded={servicesDropdownOpen}
                    aria-haspopup="true"
                    className="flex items-center gap-1 text-[13px] tracking-wide font-normal text-[#111315]/85 hover:text-[#C6A36A] transition-colors py-1 cursor-pointer"
                  >
                    <span>Services</span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        servicesDropdownOpen ? "rotate-180 text-[#C6A36A]" : "text-[#111315]/50"
                      }`}
                    />
                  </button>

                  {/* Clean Ivory Dropdown Panel */}
                  {servicesDropdownOpen && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 rounded-xl border border-[#111315]/10 bg-white p-3 shadow-xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150 z-50"
                      role="menu"
                    >
                      <div className="space-y-1">
                        {serviceSubItems.map((sub) => (
                          <a
                            key={sub.label}
                            href="#expertise"
                            onClick={() => setServicesDropdownOpen(false)}
                            className="group block rounded-lg p-2.5 transition-all hover:bg-[#FAF9F6]"
                            role="menuitem"
                          >
                            <div className="text-sm font-medium text-[#111315] group-hover:text-[#C6A36A] transition-colors">
                              {sub.label}
                            </div>
                            <p className="text-[11px] text-[#5A5E63] line-clamp-1 mt-0.5 font-light">
                              {sub.desc}
                            </p>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Our Projects */}
                <a
                  href="#selected-work"
                  className="text-[13px] tracking-wide font-normal text-[#111315]/85 hover:text-[#C6A36A] transition-colors py-1"
                >
                  Our Projects
                </a>

                {/* 5. Clients */}
                <Link
                  href="/clients"
                  className="text-[13px] tracking-wide font-normal text-[#111315]/85 hover:text-[#C6A36A] transition-colors py-1"
                >
                  Clients
                </Link>

                {/* 6. Contact */}
                <a
                  href="#contact"
                  className="text-[13px] tracking-wide font-normal text-[#111315]/85 hover:text-[#C6A36A] transition-colors py-1"
                >
                  Contact
                </a>
              </nav>

              {/* 7. WhatsApp Enquiry (Refined CTA) */}
              <div className="hidden sm:flex items-center">
                <button
                  onClick={handleWhatsAppEnquiry}
                  className="inline-flex items-center gap-2 rounded-full border border-[#25D366]/40 bg-white px-4 py-2 text-xs font-semibold text-[#111315] transition-all duration-300 hover:border-[#25D366] hover:bg-[#25D366]/10 active:scale-[0.98] shadow-sm"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-[#25D366]" />
                  <span>WhatsApp Enquiry</span>
                </button>
              </div>

              {/* Mobile Toggle & Quick WhatsApp Button */}
              <div className="flex lg:hidden items-center gap-2">
                <button
                  onClick={handleWhatsAppEnquiry}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#111315]/10 bg-white text-[#25D366] hover:border-[#25D366]/50 transition-colors shadow-sm"
                  aria-label="Contact on WhatsApp"
                >
                  <MessageSquare className="h-4 w-4" />
                </button>

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#111315]/10 bg-white text-[#111315] hover:text-[#C6A36A] transition-colors shrink-0 shadow-sm"
                  aria-label="Toggle Mobile Menu"
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Smooth Mobile Navigation Drawer (Warm Ivory) */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#111315]/8 bg-[#FAF9F6] px-6 py-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-4">
              {/* Mobile Drawer Brand Header */}
              <div className="pb-3 border-b border-[#111315]/8 flex items-center justify-between">
                <div onClick={() => setMobileMenuOpen(false)}>
                  <Logo variant="drawer" href="/design-preview" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C6A36A] font-semibold">
                  Navigation
                </span>
              </div>

              {/* 1. Home */}
              <Link
                href="/design-preview"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#C6A36A] py-1.5 border-b border-[#111315]/6 flex items-center justify-between"
              >
                <span>Home</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#C6A36A]" />
              </Link>

              {/* 2. About */}
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm text-[#111315]/85 hover:text-[#C6A36A] py-1.5 border-b border-[#111315]/6"
              >
                About
              </a>

              {/* 3. Services (Dropdown in Drawer) */}
              <div className="space-y-2 border-b border-[#111315]/6 pb-3">
                <span className="text-xs uppercase tracking-widest text-[#7A7F85] font-semibold block pt-1">
                  Services
                </span>
                <div className="grid grid-cols-1 gap-2 pl-2 pt-1">
                  {serviceSubItems.map((sub) => (
                    <a
                      key={sub.label}
                      href="#expertise"
                      onClick={() => setMobileMenuOpen(false)}
                      className="py-1 text-sm text-[#111315] hover:text-[#C6A36A] flex flex-col"
                    >
                      <span className="font-medium">{sub.label}</span>
                      <span className="text-[11px] text-[#5A5E63] font-light">{sub.desc}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* 4. Our Projects */}
              <a
                href="#selected-work"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm text-[#111315]/85 hover:text-[#C6A36A] py-1.5 border-b border-[#111315]/6"
              >
                Our Projects
              </a>

              {/* 5. Clients */}
              <Link
                href="/clients"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm text-[#111315]/85 hover:text-[#C6A36A] py-1.5 border-b border-[#111315]/6"
              >
                Clients
              </Link>

              {/* 6. Contact */}
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm text-[#111315]/85 hover:text-[#C6A36A] py-1.5 border-b border-[#111315]/6"
              >
                Contact
              </a>

              {/* 7. WhatsApp Enquiry Button in Drawer */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleWhatsAppEnquiry();
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-full border border-[#25D366]/40 bg-white py-3 text-xs font-semibold uppercase tracking-wider text-[#111315] hover:border-[#25D366] hover:bg-[#25D366]/10 transition-colors shadow-sm"
                >
                  <MessageSquare className="h-4 w-4 text-[#25D366]" />
                  <span>WhatsApp Enquiry</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
