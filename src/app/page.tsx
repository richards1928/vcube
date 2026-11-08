import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { ServicesPreviewSection } from "@/components/home/ServicesPreviewSection";
import { ArchitecturalVisionSection } from "@/components/home/ArchitecturalVisionSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { WhyChooseSection } from "@/components/home/WhyChooseSection";
import { ClientsSection } from "@/components/home/ClientsSection";
import { ProjectQueriesSection } from "@/components/home/ProjectQueriesSection";
import { ContactSection } from "@/components/home/ContactSection";

export default function HomePage() {
  return (
    <div className="w-full flex flex-col">
      {/* 1. Cinematic Architectural Hero */}
      <HeroSection />

      {/* 2. About Vcube (Warm Ivory Asymmetrical Composition) */}
      <AboutSection />

      {/* 3. Our Services (Dark Charcoal Image-Led Cards) */}
      <ServicesPreviewSection />

      {/* 4. Built With Vision. Executed With Precision. (Editorial Architectural Photography Showcase) */}
      <ArchitecturalVisionSection />

      {/* 5. Featured Projects (Warm Ivory Portfolio with Working Filters) */}
      <ProjectsSection limit={6} />

      {/* 6. Why Choose Vcube (Driven by Design. Built on Trust.) */}
      <WhyChooseSection />

      {/* 7. Clients & Enterprise Partners */}
      <ClientsSection />

      {/* 8. Project Enquiry (Have a Project in Mind? - WhatsApp & Quote) */}
      <ProjectQueriesSection />

      {/* 9. Contact & Location */}
      <ContactSection />
    </div>
  );
}
