"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Ensure ScrollTrigger is registered
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SmoothScrollContextType {
  lenis: Lenis | null;
  scrollTo: (target: string | HTMLElement | number, options?: { offset?: number; duration?: number }) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null,
  scrollTo: () => {},
});

export const useLenis = () => useContext(SmoothScrollContext);

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const [lenisState, setLenisState] = useState<Lenis | null>(null);
  const pathname = usePathname();
  const prevPathnameRef = useRef<string>(pathname);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Check for touch / mobile screens (preserve 100% native hardware touch momentum)
    const isTouchOrMobile =
      window.matchMedia("(pointer: coarse)").matches ||
      window.innerWidth <= 768;

    // Universal anchor interceptor for in-page smooth navigation
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      if (href.startsWith("#") || (href.startsWith("/#") && window.location.pathname === "/")) {
        const hash = href.startsWith("/#") ? href.substring(1) : href;
        if (hash === "#" || hash.length <= 1) return;

        const targetEl = document.querySelector(hash);
        if (targetEl) {
          e.preventDefault();
          if (lenisRef.current) {
            lenisRef.current.scrollTo(targetEl as HTMLElement, {
              offset: -80,
              duration: 1.15,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
          } else {
            const top = targetEl.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
          }
          window.history.pushState(null, "", hash);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });

    // Set stable lagSmoothing so heavy tasks catch up gracefully rather than violently jumping
    gsap.ticker.lagSmoothing(500, 33);

    if (prefersReducedMotion || isTouchOrMobile) {
      // For mobile devices: 100% native touch scrolling with 0ms delay, no gesture hijacking
      return () => {
        document.removeEventListener("click", handleAnchorClick, { capture: true });
      };
    }

    let isCancelled = false;
    let tickerUpdate: ((time: number) => void) | null = null;
    let handleScroll: (() => void) | null = null;
    let lenisInstance: Lenis | null = null;

    // Dynamically load Lenis strictly on desktop/pointer-fine environments
    import("lenis").then(({ default: LenisClass }) => {
      if (isCancelled) return;

      const lenis = new LenisClass({
        lerp: 0.09,
        wheelMultiplier: 0.95,
        touchMultiplier: 1,
        syncTouch: false,
        autoRaf: false,
      });

      lenisInstance = lenis;
      lenisRef.current = lenis;
      setLenisState(lenis);

      handleScroll = () => {
        ScrollTrigger.update();
      };
      lenis.on("scroll", handleScroll);

      tickerUpdate = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tickerUpdate);

      if (window.location.hash) {
        setTimeout(() => {
          const initialEl = document.querySelector(window.location.hash);
          if (initialEl) {
            lenis.scrollTo(initialEl as HTMLElement, {
              offset: -80,
              immediate: false,
              duration: 1.2,
            });
          }
        }, 350);
      }
    });

    return () => {
      isCancelled = true;
      document.removeEventListener("click", handleAnchorClick, { capture: true });
      if (tickerUpdate) gsap.ticker.remove(tickerUpdate);
      if (lenisInstance) {
        if (handleScroll) lenisInstance.off("scroll", handleScroll);
        lenisInstance.destroy();
      }
      lenisRef.current = null;
      setLenisState(null);
    };
  }, []);

  // Handle route transitions
  useEffect(() => {
    const isNewRoute = prevPathnameRef.current !== pathname;
    prevPathnameRef.current = pathname;

    if (isNewRoute && lenisRef.current) {
      // If navigating to a new route without a hash, reset scroll position cleanly
      if (typeof window !== "undefined") {
        const hash = window.location.hash;
        if (hash) {
          setTimeout(() => {
            const targetEl = document.querySelector(hash);
            if (targetEl && lenisRef.current) {
              lenisRef.current.scrollTo(targetEl as HTMLElement, {
                offset: -80,
                immediate: false,
                duration: 0.9,
              });
            }
          }, 150);
        } else {
          // New route starts at the top
          lenisRef.current.scrollTo(0, { immediate: true });
          window.scrollTo(0, 0);
        }
      }

      // Refresh ScrollTrigger after route has mounted
      const refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);

      return () => clearTimeout(refreshTimeout);
    }
  }, [pathname]);

  const scrollTo = (
    target: string | HTMLElement | number,
    options?: { offset?: number; duration?: number }
  ) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target as any, {
        offset: options?.offset ?? -80,
        duration: options?.duration ?? 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      // Fallback for native scrolling
      if (typeof target === "number") {
        window.scrollTo({ top: target, behavior: "smooth" });
      } else if (typeof target === "string") {
        const el = document.querySelector(target);
        if (el) {
          const top = el.getBoundingClientRect().top + window.pageYOffset + (options?.offset ?? -80);
          window.scrollTo({ top, behavior: "smooth" });
        }
      } else if (target instanceof HTMLElement) {
        const top = target.getBoundingClientRect().top + window.pageYOffset + (options?.offset ?? -80);
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisState, scrollTo }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
