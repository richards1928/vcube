"use client";

import React from "react";
import { MessageSquare, ArrowUpRight } from "lucide-react";
import { generateWhatsAppLink } from "@/config/site";

interface WhatsAppButtonProps {
  service?: "construction" | "interiors" | "branding" | string;
  projectTitle?: string;
  label?: string;
  customNotes?: string;
  variant?: "primary" | "outline" | "compact";
  className?: string;
}

export function WhatsAppButton({
  service,
  projectTitle,
  label,
  customNotes,
  variant = "primary",
  className = "",
}: WhatsAppButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = generateWhatsAppLink({
      service,
      projectTitle,
      customNotes,
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const defaultLabel = projectTitle
    ? `Enquire for ${projectTitle}`
    : service
    ? `Enquire for ${service.charAt(0).toUpperCase() + service.slice(1)}`
    : "Chat on WhatsApp";

  const displayLabel = label || defaultLabel;

  if (variant === "outline") {
    return (
      <button
        onClick={handleClick}
        className={`group inline-flex items-center gap-2 rounded-lg border border-[#C6A36A]/50 bg-transparent px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#C6A36A] transition-all duration-300 hover:border-[#C6A36A] hover:bg-[#C6A36A]/10 hover:text-[#F3F0E8] active:scale-[0.98] ${className}`}
      >
        <MessageSquare className="h-4 w-4 text-[#25D366]" />
        <span>{displayLabel}</span>
        <ArrowUpRight className="h-3.5 w-3.5 text-[#C6A36A] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <button
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 text-xs font-medium text-[#C6A36A] hover:text-[#DFC293] transition-colors ${className}`}
      >
        <MessageSquare className="h-3.5 w-3.5 text-[#25D366]" />
        <span>{displayLabel}</span>
        <ArrowUpRight className="h-3 w-3" />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-lg bg-[#C6A36A] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#090B0D] transition-all duration-300 hover:bg-[#DFC293] hover:shadow-[0_0_25px_rgba(198,163,106,0.4)] active:scale-[0.98] ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-[#090B0D]" />
        <span>{displayLabel}</span>
        <ArrowUpRight className="h-3.5 w-3.5 text-[#090B0D] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </button>
  );
}
