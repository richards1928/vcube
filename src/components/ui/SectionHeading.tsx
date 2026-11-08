import React from "react";

interface SectionHeadingProps {
  badge?: string;
  tagline?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export function SectionHeading({
  badge,
  tagline,
  title,
  subtitle,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const alignClass =
    align === "center"
      ? "text-center items-center"
      : align === "right"
      ? "text-right items-end"
      : "text-left items-start";

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
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-[#F3F0E8] font-heading">
        {title}
      </h2>

      {/* Subtitle / Architectural note */}
      {subtitle && (
        <p className="mt-4 max-w-2xl text-sm sm:text-base text-[#A0A4A8] font-normal leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
