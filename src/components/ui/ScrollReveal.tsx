"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  scale?: number;
  start?: string;
  as?: React.ElementType;
}

export function ScrollReveal({
  children,
  className = "",
  direction = "up",
  distance = 28,
  duration = 0.85,
  delay = 0,
  stagger,
  scale,
  start = "top 85%",
  as: Component = "div",
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1 });
      return;
    }

    let x = 0;
    let y = 0;
    if (direction === "up") y = distance;
    if (direction === "down") y = -distance;
    if (direction === "left") x = distance;
    if (direction === "right") x = -distance;

    const ctx = gsap.context(() => {
      const targets = stagger && el.children.length > 0 ? Array.from(el.children) : el;

      gsap.fromTo(
        targets,
        {
          opacity: 0,
          x,
          y,
          scale: scale !== undefined ? scale : 1,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration,
          delay,
          stagger: stagger || 0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: "play none none none",
          },
        }
      );
    }, el);

    return () => {
      ctx.revert();
    };
  }, [direction, distance, duration, delay, stagger, scale, start]);

  const Comp = Component as any;

  return (
    <Comp ref={elementRef} className={className}>
      {children}
    </Comp>
  );
}
