import React from "react";

interface SectionHeadingProps {
  badge?: string;
  tagline?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  theme?: "dark" | "light";
  as?: "h1" | "h2" | "h3";
  className?: string;
}

export function SectionHeading({
  badge,
  tagline,
  title,
  subtitle,
  align = "left",
  theme = "dark",
  as: Component = "h2",
  className = "",
}: SectionHeadingProps) {
  const alignClass =
    align === "center"
      ? "text-center items-center"
      : align === "right"
      ? "text-right items-end"
      : "text-left items-start";

  const isLight = theme === "light";

  return (
    <div className={`flex flex-col ${alignClass} ${className}`}>
      {/* Architectural Index / Badge */}
      {(badge || tagline) && (
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px w-6 bg-[#C6A36A]/60" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C6A36A]">
            {badge || tagline}
          </span>
          {align === "center" && <div className="h-px w-6 bg-[#C6A36A]/60" />}
        </div>
      )}

      {/* Main Heading */}
      <Component className={`text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight font-heading ${
        isLight ? "text-[#111315]" : "text-[#F3F0E8]"
      }`}>
        {title}
      </Component>

      {/* Subtitle / Architectural note */}
      {subtitle && (
        <p className={`mt-4 max-w-2xl text-sm sm:text-base font-normal leading-relaxed ${
          isLight ? "text-[#4A4F55]" : "text-[#A0A4A8]"
        }`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
