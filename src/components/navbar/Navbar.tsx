"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X, ArrowUpRight, MessageSquare } from "lucide-react";
import gsap from "gsap";
import { SITE_CONFIG, generateWhatsAppLink } from "@/config/site";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Subtle header entrance
    if (headerRef.current) {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!prefersReducedMotion) {
        gsap.fromTo(
          headerRef.current,
          { y: -10, opacity: 0.8 },
          { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", clearProps: "all" }
        );
      }
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleWhatsAppEnquiry = () => {
    const url = generateWhatsAppLink({
      enquiryType: "General Enquiry",
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    {
      label: "Services",
      href: "/#services",
      hasDropdown: true,
      subItems: [
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
      ],
    },
    { label: "Our Projects", href: "/projects" },
    { label: "Clients", href: "/clients" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#090B0D]/95 backdrop-blur-md border-b border-white/10 py-3 shadow-xl"
          : "bg-gradient-to-b from-[#090B0D]/90 via-[#090B0D]/40 to-transparent py-4 sm:py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between w-full">
          {/* 1. LEFT: Company Brand Logo */}
          <Link
            href="/"
            className="group flex items-center shrink-0 transition-opacity duration-300 hover:opacity-85 focus:outline-none"
            aria-label="Vcube Infra Projects Home"
          >
            <Image
              src="/images/vcube-logo-transparent.webp"
              alt="Vcube Infra Projects"
              width={168}
              height={47}
              className="w-[130px] sm:w-[140px] lg:w-[168px] h-auto object-contain transition-opacity duration-300 group-hover:opacity-85"
              priority
            />
          </Link>

          {/* 2. RIGHT: Navigation Links + WhatsApp CTA + Mobile Menu Button */}
          <div className="flex items-center gap-6 xl:gap-8">
            {/* Desktop Navigation Links (Grouped to the right) */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
              {navLinks.map((item) => {
                if (item.hasDropdown) {
                  return (
                    <div
                      key={item.label}
                      className="relative"
                      onMouseEnter={() => setServicesDropdownOpen(true)}
                      onMouseLeave={() => setServicesDropdownOpen(false)}
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center gap-1 text-[13px] tracking-wide font-normal transition-colors py-2 ${
                          pathname.startsWith("/services")
                            ? "text-[#C6A36A]"
                            : "text-[#F3F0E8]/85 hover:text-[#C6A36A]"
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform duration-200 ${
                            servicesDropdownOpen ? "rotate-180 text-[#C6A36A]" : ""
                          }`}
                        />
                      </Link>

                      {/* Clean Dropdown Panel */}
                      {servicesDropdownOpen && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-72 rounded-xl border border-white/10 bg-[#111315]/98 p-3 shadow-2xl backdrop-blur-xl animate-in fade-in slide-from-top-2">
                          <div className="space-y-1">
                            {item.subItems?.map((sub) => (
                              <Link
                                key={sub.label}
                                href={sub.href}
                                className="group block rounded-lg p-2.5 transition-all hover:bg-white/5"
                              >
                                <div className="text-sm font-medium text-[#F3F0E8] group-hover:text-[#C6A36A] transition-colors">
                                  {sub.label}
                                </div>
                                <p className="text-[11px] text-[#A0A4A8] line-clamp-1 mt-0.5">
                                  {sub.desc}
                                </p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                const isActive =
                  item.href === "/" ? pathname === "/" : pathname === item.href;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`text-[13px] tracking-wide font-normal transition-colors relative py-1 ${
                      isActive
                        ? "text-[#C6A36A]"
                        : "text-[#F3F0E8]/85 hover:text-[#C6A36A]"
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-px bg-[#C6A36A]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop WhatsApp Enquiry CTA */}
            <div className="hidden sm:flex items-center">
              <button
                onClick={handleWhatsAppEnquiry}
                className="inline-flex items-center gap-2 rounded-full border border-[#25D366]/40 bg-[#16191D]/90 px-4 py-2 text-xs font-semibold text-[#F3F0E8] transition-all duration-300 hover:border-[#25D366] hover:bg-[#25D366]/15 hover:text-[#25D366] active:scale-[0.98] shadow-sm backdrop-blur-sm"
              >
                <MessageSquare className="h-3.5 w-3.5 text-[#25D366]" />
                <span>WhatsApp Enquiry</span>
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-[#171A1D] text-[#F3F0E8] hover:text-[#C6A36A] transition-colors shrink-0"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-[#090B0D]/98 px-6 py-6 backdrop-blur-2xl animate-in slide-in-from-top duration-300">
          <div className="flex flex-col space-y-4">
            {navLinks.map((item) => {
              if (item.hasDropdown) {
                return (
                  <div key={item.label} className="space-y-2 border-b border-white/5 pb-3">
                    <span className="text-xs uppercase tracking-widest text-[#A0A4A8] font-semibold">
                      {item.label}
                    </span>
                    <div className="grid grid-cols-1 gap-2 pl-2 pt-1">
                      {item.subItems?.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="py-1 text-sm text-[#F3F0E8] hover:text-[#C6A36A]"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm py-1.5 border-b border-white/5 ${
                    pathname === item.href ? "text-[#C6A36A]" : "text-[#F3F0E8]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleWhatsAppEnquiry();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-full border border-[#25D366]/40 bg-[#171A1D] py-3 text-xs font-semibold uppercase tracking-wider text-[#F3F0E8] hover:border-[#25D366] hover:bg-[#25D366]/15 hover:text-[#25D366] transition-colors"
              >
                <MessageSquare className="h-4 w-4 text-[#25D366]" />
                <span>WhatsApp Enquiry</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
