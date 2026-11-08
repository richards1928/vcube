import React from "react";
import { Layers, Building2, Home } from "lucide-react";

export function InteractiveExplorerSkeleton() {
  return (
    <section className="relative py-28 bg-[#090B0D] text-[#F3F0E8] overflow-hidden border-t border-white/5 architectural-grid">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header matched to InteractiveExplorerSection */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2.5">
              <span className="h-px w-6 bg-[#C6A36A]" />
              <span className="text-xs font-sans font-semibold uppercase tracking-[0.25em] text-[#C6A36A]">
                HYBRID CINEMATIC + INTERACTIVE 3D EXPLORER
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#F3F0E8] leading-tight">
              Interactive Residential Experience
            </h2>
            <p className="text-sm sm:text-base text-[#A0A4A8] font-light leading-relaxed">
              Experience our architectural projects in real time. Watch the cinematic tour, inspect structural hotspots, or take full manual control to rotate, zoom, and explore every floor slab.
            </p>
          </div>

          {/* Model Switcher Placeholder */}
          <div className="flex items-center gap-2 p-1.5 rounded-full border border-[#C6A36A]/30 bg-[#16191D]/90 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold bg-[#C6A36A] text-[#090B0D]">
              <Building2 className="h-4 w-4" />
              <span>Apartment Model</span>
            </div>
            <div className="flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold text-[#A0A4A8]">
              <Home className="h-4 w-4" />
              <span>Independent House</span>
            </div>
          </div>
        </div>

        {/* 3D Canvas Box Container - exact responsive dimensions */}
        <div className="relative w-full rounded-3xl border border-white/10 bg-gradient-to-b from-[#16191D]/90 to-[#0A0C0E]/95 overflow-hidden shadow-2xl h-[560px] sm:h-[650px] lg:h-[720px] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-10 h-10 border-2 border-[#C6A36A] border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="space-y-1">
              <p className="text-xs tracking-widest uppercase font-mono text-[#C6A36A]">
                Preparing 3D Architectural Scene
              </p>
              <p className="text-[11px] text-[#A0A4A8]">
                Initializing WebGL geometry, structural columns & shaders...
              </p>
            </div>
          </div>
        </div>

        {/* Stage Controller Card Skeleton - matches the mounted apartment stage bar */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#16191D]/80 p-6 backdrop-blur-md animate-pulse">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="space-y-2">
              <div className="h-3 w-44 bg-white/10 rounded" />
              <div className="h-5 w-64 bg-white/10 rounded" />
            </div>
            <div className="h-9 w-48 bg-white/10 rounded-full" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6">
            {[1, 2, 3, 4, 5, 6].map((stageNum) => (
              <div
                key={stageNum}
                className="flex flex-col items-start p-3.5 rounded-xl border border-white/5 bg-[#0D0F12] space-y-2"
              >
                <div className="h-2.5 w-6 bg-white/10 rounded" />
                <div className="h-3 w-20 bg-white/10 rounded" />
                <div className="h-2 w-16 bg-white/5 rounded" />
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
            <div className="h-4 w-72 bg-white/5 rounded" />
            <div className="h-4 w-48 bg-white/5 rounded" />
          </div>
        </div>
      </div>
    </section>
  );
}
