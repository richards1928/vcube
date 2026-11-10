import React from "react";
import type { Metadata } from "next";
import { PreviewNavbar } from "@/components/design-preview/PreviewNavbar";
import { PreviewHero } from "@/components/design-preview/PreviewHero";
import { PreviewIntro } from "@/components/design-preview/PreviewIntro";
import { PreviewExpertise } from "@/components/design-preview/PreviewExpertise";
import { PreviewSelectedWork } from "@/components/design-preview/PreviewSelectedWork";
import { PreviewApproach } from "@/components/design-preview/PreviewApproach";
import { PreviewContact } from "@/components/design-preview/PreviewContact";
import { PreviewFooter } from "@/components/design-preview/PreviewFooter";

export const metadata: Metadata = {
  title: "Version 2.0 Architectural Identity Preview",
  description:
    "Design exploration preview for Vcube Infra Projects: Minimal editorial layouts, luxury architecture studio aesthetics, and large architectural photography.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DesignPreviewPage() {
  return (
    <div className="w-full min-h-screen bg-[#FAF8F5] text-[#111315] selection:bg-[#0E3D6E] selection:text-white">
      {/* 1. Preview Navbar & Top Ribbon */}
      <PreviewNavbar />

      {/* 2. Main Editorial Page Body */}
      <main className="w-full flex flex-col">
        {/* Hero Section */}
        <PreviewHero />

        {/* Studio Introduction */}
        <PreviewIntro />

        {/* Core Expertise Divisions */}
        <PreviewExpertise />

        {/* Selected Work (Demonstration Studies) */}
        <PreviewSelectedWork />

        {/* Our Approach (Integrated Practice Advantage) */}
        <PreviewApproach />

        {/* Minimal Contact & Consultation */}
        <PreviewContact />
      </main>

      {/* 3. Minimal Editorial Footer */}
      <PreviewFooter />
    </div>
  );
}

