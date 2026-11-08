"use client";

import React, { useState } from "react";
import { MessageSquare, ExternalLink, X } from "lucide-react";
import { SITE_CONFIG, generateWhatsAppLink } from "@/config/site";

export function WhatsAppFloatingTrigger() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>("construction");
  const [customQuery, setCustomQuery] = useState("");

  const handleLaunchWhatsApp = () => {
    const url = generateWhatsAppLink({
      service: selectedService,
      customNotes: customQuery.trim() ? customQuery : undefined,
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end max-w-[calc(100vw-1rem)] pointer-events-auto">
      {/* Expanded Quick Drawer */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-sm sm:w-96 rounded-xl border border-[#C6A36A]/30 bg-[#171A1D]/95 p-4 sm:p-5 shadow-2xl backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between border-b border-[#C6A36A]/15 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#25D366]/20 text-[#25D366]">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#F3F0E8] tracking-wide">
                  Direct WhatsApp Enquiry
                </h4>
                <p className="text-[11px] text-[#A0A4A8]">Vcube Infra Projects</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#A0A4A8] hover:text-[#F3F0E8] transition-colors p-1"
              aria-label="Close WhatsApp Drawer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-3 text-xs text-[#A0A4A8] leading-relaxed">
            Select a service to generate an official pre-filled project message:
          </p>

          <div className="mt-3 grid grid-cols-3 gap-1.5 text-xs font-medium">
            {[
              { id: "construction", label: "Construction" },
              { id: "interiors", label: "Interiors" },
              { id: "branding", label: "Branding" },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedService(s.id)}
                className={`py-1.5 px-2 rounded border text-center transition-all ${
                  selectedService === s.id
                    ? "border-[#C6A36A] bg-[#C6A36A]/15 text-[#C6A36A]"
                    : "border-white/5 bg-white/5 text-[#A0A4A8] hover:text-[#F3F0E8]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="mt-3">
            <textarea
              id="floating-query-notes"
              name="floatingQueryNotes"
              aria-label="Custom Project Details"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="Optional: Mention project size, location, or requirements..."
              rows={2}
              className="w-full rounded-lg border border-white/10 bg-[#090B0D]/80 p-2.5 text-xs text-[#F3F0E8] placeholder-[#A0A4A8]/60 focus:border-[#C6A36A] focus:outline-none focus:ring-1 focus:ring-[#C6A36A]"
            />
          </div>

          <div className="mt-3 pt-2">
            <button
              onClick={handleLaunchWhatsApp}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-xs font-semibold text-black transition-all hover:bg-[#20ba5a] active:scale-[0.98] shadow-lg shadow-[#25D366]/20"
            >
              <span>Open in WhatsApp</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
            <p className="mt-2 text-center text-[10px] text-[#A0A4A8]">
              Configured for: {SITE_CONFIG.whatsapp.displayNumber}
            </p>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 rounded-full border border-[#C6A36A]/40 bg-[#171A1D]/90 px-4 py-3 text-xs font-semibold text-[#F3F0E8] shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-[#C6A36A] hover:bg-[#212529] hover:shadow-[0_0_25px_rgba(198,163,106,0.3)]"
        aria-label="Open WhatsApp Project Enquiry"
      >
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-[#25D366]"></span>
        </span>
        <span className="tracking-wider uppercase text-[11px] text-[#C6A36A] group-hover:text-[#F3F0E8] transition-colors">
          Project WhatsApp
        </span>
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366]/20 text-[#25D366]">
          <MessageSquare className="h-3.5 w-3.5" />
        </div>
      </button>
    </div>
  );
}
