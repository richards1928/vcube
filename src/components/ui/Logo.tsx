import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface LogoProps {
  /**
   * Visual preset variant:
   * - 'navbar': Primary header logo (w-[145px] on mobile, lg:w-[180px] on desktop)
   * - 'footer': Global footer branding (w-[165px] on mobile, sm:w-[185px] on desktop)
   * - 'drawer': Mobile navigation drawer header (w-[150px])
   * - 'standalone': Arbitrary custom sizing via width/height or className
   */
  variant?: "navbar" | "footer" | "drawer" | "standalone";
  /**
   * Width override (defaults according to variant)
   */
  width?: number;
  /**
   * Height override (auto-calculated from 3.607:1 ratio if omitted)
   */
  height?: number;
  /**
   * Whether to wrap in a Link to home (default: true)
   */
  withLink?: boolean;
  /**
   * Target link URL (default: "/")
   */
  href?: string;
  /**
   * Custom className passed to the image/container
   */
  className?: string;
  /**
   * High priority loading for above-the-fold display
   */
  priority?: boolean;
}

export function Logo({
  variant = "navbar",
  width,
  height,
  withLink = true,
  href = "/",
  className = "",
  priority = false,
}: LogoProps) {
  // Dimension presets preserving the exact 3.607:1 native aspect ratio (808x224)
  let defaultWidth = 180;
  let defaultHeight = 50;
  let sizeClasses = "w-[145px] sm:w-[160px] lg:w-[180px] h-auto";

  if (variant === "navbar") {
    defaultWidth = 180;
    defaultHeight = 50;
    sizeClasses = "w-[145px] sm:w-[160px] lg:w-[180px] h-auto";
  } else if (variant === "footer") {
    defaultWidth = 185;
    defaultHeight = 51;
    sizeClasses = "w-[165px] sm:w-[185px] h-auto";
  } else if (variant === "drawer") {
    defaultWidth = 150;
    defaultHeight = 42;
    sizeClasses = "w-[150px] h-auto";
  } else if (variant === "standalone") {
    defaultWidth = width || 180;
    defaultHeight = height || Math.round(defaultWidth / 3.607);
    sizeClasses = className ? "" : "w-auto h-auto";
  }

  const finalWidth = width || defaultWidth;
  const finalHeight = height || defaultHeight;
  const isPriority = priority !== undefined ? priority : variant === "navbar";

  const imageElement = (
    <Image
      src="/images/vcube-logo-transparent.webp"
      alt="Vcube Infra Projects"
      width={finalWidth}
      height={finalHeight}
      priority={isPriority}
      className={`object-contain transition-opacity duration-300 group-hover:opacity-85 ${sizeClasses} ${className}`}
    />
  );

  if (!withLink) {
    return (
      <div className="flex items-center shrink-0">
        {imageElement}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="group flex items-center shrink-0 transition-opacity duration-300 focus:outline-none"
      aria-label="Vcube Infra Projects Home"
    >
      {imageElement}
    </Link>
  );
}
