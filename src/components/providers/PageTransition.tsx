"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Skip on initial page mount to ensure 0 layout shift during initial paint
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      // Subtle architectural fade-in across route changes using pure compositor opacity
      gsap.fromTo(
        el,
        {
          opacity: 0.4,
        },
        {
          opacity: 1,
          duration: 0.35,
          ease: "power2.out",
          onComplete: () => {
            ScrollTrigger.refresh();
          },
        }
      );
    }, el);

    return () => {
      ctx.revert();
    };
  }, [pathname]);

  return (
    <div ref={containerRef} className="w-full flex-1 flex flex-col">
      {children}
    </div>
  );
}
