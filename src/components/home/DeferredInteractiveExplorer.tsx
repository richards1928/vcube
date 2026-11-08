"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { InteractiveExplorerSkeleton } from "./InteractiveExplorerSkeleton";

const DynamicInteractiveExplorer = dynamic(
  () =>
    import("@/components/home/InteractiveExplorerSection").then(
      (mod) => mod.InteractiveExplorerSection
    ),
  {
    ssr: false,
    loading: () => <InteractiveExplorerSkeleton />,
  }
);

export function DeferredInteractiveExplorer() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "350px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      {shouldLoad ? (
        <DynamicInteractiveExplorer />
      ) : (
        <InteractiveExplorerSkeleton />
      )}
    </div>
  );
}
