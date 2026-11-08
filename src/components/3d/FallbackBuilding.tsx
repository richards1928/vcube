"use client";

import React, { useState } from "react";
import { CheckCircle2, ShieldCheck, Ruler, Building2, Home } from "lucide-react";

export interface FallbackBuildingProps {
  currentStage?: number;
  modelType?: "apartment-g4" | "independent-g3";
  onSelectStage?: (stage: number) => void;
}

const APARTMENT_STAGES = [
  {
    stage: 1,
    title: "Foundation & Plinth",
    subtitle: "Isolated Footings, Plinth Beams & Rebar Dowels",
    desc: "Site grading, earthwork excavation, RCC footing pads, continuous plinth beam casting, and vertical column starter dowels.",
  },
  {
    stage: 2,
    title: "RCC Column Framework",
    subtitle: "Structural Column Grid Demonstration",
    desc: "Reinforced cement concrete column cages, M25/M30 grade concrete pouring, shuttering formwork, and lateral tie reinforcement.",
  },
  {
    stage: 3,
    title: "Floor Slabs & Staircase",
    subtitle: "Cast Concrete Slabs & Dog-Legged Staircase",
    desc: "Ground stilt slab, four residential suspended floor slabs, central dog-legged RCC staircase waist slabs, and rooftop terrace slab.",
  },
  {
    stage: 4,
    title: "Brickwork & Openings",
    subtitle: "AAC / Clay Brick Masonry & Lintel Bands",
    desc: "Precision external and partition brickwork masonry, cast-in-place concrete lintel bands, window/door openings, and balcony parapets.",
  },
  {
    stage: 5,
    title: "Electrical & Finishing",
    subtitle: "Concealed Conduits, Plaster & False Ceilings",
    desc: "Internal wall plastering, fire-retardant PVC electrical conduit routing, distribution boxes, gypsum false ceiling grids, and vitrified floor tiles.",
  },
  {
    stage: 6,
    title: "Completed Elevation",
    subtitle: "Turnkey Exterior Facade, Balconies & Handover",
    desc: "Weather-proof exterior elevation paint, vertical louvers, glass balustrades, ground stilt parking with gate, overhead water tank, and pergola.",
  },
];

export function FallbackBuilding({
  currentStage = 6,
  modelType = "apartment-g4",
  onSelectStage,
}: FallbackBuildingProps) {
  const [activeStage, setActiveStage] = useState(currentStage);

  const stage = onSelectStage ? currentStage : activeStage;
  const setStage = onSelectStage || setActiveStage;

  const isIndependentHouse = modelType === "independent-g3";
  const stageData = APARTMENT_STAGES[Math.max(0, Math.min(5, stage - 1))];

  return (
    <div className="relative w-full h-full min-h-[500px] flex flex-col items-center justify-between p-6 rounded-2xl border border-[#C6A36A]/20 bg-[#090B0D]/95 backdrop-blur-xl architectural-grid">
      {/* Top Header Indicators */}
      <div className="w-full flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-2 w-2 rounded-full bg-[#C6A36A] animate-pulse" />
          <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C6A36A]">
            {isIndependentHouse
              ? "Independent Residence Architectural Schematic"
              : "Multi-Story Apartment Construction Schematic"}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-[#858782] font-mono">
          <span>SCALE: 1:100</span>
          <span>ARCHITECTURAL SCHEMATIC</span>
          <span className="text-[#C6A36A]">IS 456 COMPLIANT</span>
        </div>
      </div>

      {/* Central Blueprint Vector Diagram */}
      <div className="relative w-full max-w-lg my-4 flex flex-col items-center justify-center">
        <div style={{ aspectRatio: "4 / 3" }} className="relative w-full aspect-4-3 max-h-[320px] flex items-center justify-center">
          <svg
            viewBox="0 0 420 360"
            className="w-full h-full drop-shadow-[0_0_25px_rgba(198,163,106,0.15)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Architectural Grid & Axis */}
            <circle cx="210" cy="180" r="150" stroke="#C6A36A" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.25" />
            <line x1="210" y1="20" x2="210" y2="340" stroke="#858782" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
            <line x1="30" y1="290" x2="390" y2="290" stroke="#858782" strokeWidth="0.8" opacity="0.4" />

            {/* Base Plot & Foundation Ground (Always visible) */}
            <rect x="50" y="290" width="320" height="20" fill="#14171A" stroke="#C6A36A" strokeWidth="1" />
            <line x1="60" y1="290" x2="360" y2="290" stroke="#C6A36A" strokeWidth="1.5" />

            {!isIndependentHouse ? (
              /* MULTI-STORY APARTMENT ELEVATION VECTOR */
              <g>
                {/* Stage 1: Footings & Plinth Beams */}
                {stage >= 1 && (
                  <g>
                    {/* Isolated Footing Pads */}
                    {[90, 150, 210, 270, 330].map((x) => (
                      <g key={`ft-${x}`}>
                        <rect x={x - 14} y="300" width="28" height="10" fill="#2A3038" stroke="#C6A36A" strokeWidth="0.8" />
                        <line x1={x} y1="285" x2={x} y2="300" stroke="#C6A36A" strokeWidth="1.5" />
                        {stage === 1 && (
                          <line x1={x} y1="260" x2={x} y2="285" stroke="#C6A36A" strokeWidth="1.5" strokeDasharray="2 2" />
                        )}
                      </g>
                    ))}
                    {/* Plinth Beam Band */}
                    <rect x="75" y="280" width="270" height="10" fill="#2A3038" stroke="#C6A36A" strokeWidth="1" />
                  </g>
                )}

                {/* Stage 2: Columns */}
                {stage >= 2 && (
                  <g>
                    {[90, 150, 210, 270, 330].map((x) => (
                      <g key={`col-${x}`}>
                        {/* Ground stilt columns */}
                        <line x1={x} y1="280" x2={x} y2="230" stroke={stage >= 6 ? "#858782" : "#C6A36A"} strokeWidth="5" />
                        {/* Upper 4 floors columns */}
                        <line x1={x} y1="230" x2={x} y2="180" stroke={stage >= 6 ? "#858782" : "#C6A36A"} strokeWidth="4.5" />
                        <line x1={x} y1="180" x2={x} y2="130" stroke={stage >= 6 ? "#858782" : "#C6A36A"} strokeWidth="4" />
                        <line x1={x} y1="130" x2={x} y2="80" stroke={stage >= 6 ? "#858782" : "#C6A36A"} strokeWidth="3.5" />
                        <line x1={x} y1="80" x2={x} y2="40" stroke={stage >= 6 ? "#858782" : "#C6A36A"} strokeWidth="3" />
                      </g>
                    ))}
                  </g>
                )}

                {/* Stage 3: Floor Slabs & Staircase */}
                {stage >= 3 && (
                  <g>
                    {/* Floor 1 Slab */}
                    <rect x="70" y="226" width="280" height="8" fill="#202428" stroke="#C6A36A" strokeWidth="1" />
                    {/* Floor 2 Slab */}
                    <rect x="70" y="176" width="280" height="8" fill="#202428" stroke="#C6A36A" strokeWidth="1" />
                    {/* Floor 3 Slab */}
                    <rect x="70" y="126" width="280" height="8" fill="#202428" stroke="#C6A36A" strokeWidth="1" />
                    {/* Floor 4 Slab */}
                    <rect x="70" y="76" width="280" height="8" fill="#202428" stroke="#C6A36A" strokeWidth="1" />
                    {/* Terrace Slab */}
                    <rect x="68" y="36" width="284" height="8" fill="#202428" stroke="#C6A36A" strokeWidth="1.2" />

                    {/* Dog-legged Staircase Zig-Zag */}
                    <polyline points="200,280 220,253 200,253 220,226" stroke="#C6A36A" strokeWidth="1.2" opacity="0.7" />
                    <polyline points="200,226 220,201 200,201 220,176" stroke="#C6A36A" strokeWidth="1.2" opacity="0.7" />
                    <polyline points="200,176 220,151 200,151 220,126" stroke="#C6A36A" strokeWidth="1.2" opacity="0.7" />
                    <polyline points="200,126 220,101 200,101 220,76" stroke="#C6A36A" strokeWidth="1.2" opacity="0.7" />
                  </g>
                )}

                {/* Stage 4: Brickwork & Window Openings */}
                {stage >= 4 && (
                  <g>
                    {/* Brick fills on Floor 1 to 4 */}
                    <rect x="95" y="184" width="50" height="42" fill="#A34834" fillOpacity={stage >= 5 ? 0.3 : 0.8} stroke="#A34834" strokeWidth="0.8" />
                    <rect x="275" y="184" width="50" height="42" fill="#A34834" fillOpacity={stage >= 5 ? 0.3 : 0.8} stroke="#A34834" strokeWidth="0.8" />
                    <rect x="95" y="134" width="50" height="42" fill="#A34834" fillOpacity={stage >= 5 ? 0.3 : 0.8} stroke="#A34834" strokeWidth="0.8" />
                    <rect x="275" y="134" width="50" height="42" fill="#A34834" fillOpacity={stage >= 5 ? 0.3 : 0.8} stroke="#A34834" strokeWidth="0.8" />
                    <rect x="95" y="84" width="50" height="42" fill="#A34834" fillOpacity={stage >= 5 ? 0.3 : 0.8} stroke="#A34834" strokeWidth="0.8" />
                    <rect x="275" y="84" width="50" height="42" fill="#A34834" fillOpacity={stage >= 5 ? 0.3 : 0.8} stroke="#A34834" strokeWidth="0.8" />
                    <rect x="95" y="44" width="50" height="32" fill="#A34834" fillOpacity={stage >= 5 ? 0.3 : 0.8} stroke="#A34834" strokeWidth="0.8" />
                    <rect x="275" y="44" width="50" height="32" fill="#A34834" fillOpacity={stage >= 5 ? 0.3 : 0.8} stroke="#A34834" strokeWidth="0.8" />
                  </g>
                )}

                {/* Stage 5: Electrical & Interior Finishing */}
                {stage === 5 && (
                  <g>
                    {/* Orange electrical conduits */}
                    <line x1="120" y1="184" x2="120" y2="226" stroke="#E65100" strokeWidth="1.5" />
                    <line x1="100" y1="205" x2="140" y2="205" stroke="#E65100" strokeWidth="1.5" />
                    <circle cx="120" cy="205" r="3" fill="#E65100" />
                    <line x1="300" y1="134" x2="300" y2="176" stroke="#E65100" strokeWidth="1.5" />
                    <circle cx="300" cy="155" r="3" fill="#E65100" />
                  </g>
                )}

                {/* Stage 6: Completed Elevation & Modern Architectural Accents */}
                {stage >= 6 && (
                  <g>
                    {/* Glass Windows with tint */}
                    {[184, 134, 84, 44].map((y, idx) => (
                      <g key={`win-${y}`}>
                        <rect x="156" y={y + 8} width="48" height={idx === 3 ? 24 : 32} fill="#6288A5" fillOpacity="0.4" stroke="#88B2CC" strokeWidth="0.8" />
                        <rect x="216" y={y + 8} width="48" height={idx === 3 ? 24 : 32} fill="#6288A5" fillOpacity="0.4" stroke="#88B2CC" strokeWidth="0.8" />
                        {/* Balcony Glass Railing with Champagne Handrail */}
                        <rect x="150" y={y + (idx === 3 ? 20 : 26)} width="120" height="15" fill="#A0C4DE" fillOpacity="0.5" stroke="#C6A36A" strokeWidth="1" />
                      </g>
                    ))}

                    {/* Stilt Parking Cars (Silhouette) */}
                    <rect x="100" y="252" width="40" height="25" rx="3" fill="#2E3640" stroke="#C6A36A" strokeWidth="0.5" />
                    <rect x="150" y="252" width="42" height="25" rx="3" fill="#7D2E24" stroke="#C6A36A" strokeWidth="0.5" />

                    {/* Ground Sliding Gate & Boundary Wall */}
                    <line x1="60" y1="280" x2="360" y2="280" stroke="#C6A36A" strokeWidth="1" strokeDasharray="5 3" />
                    <rect x="280" y="250" width="70" height="30" fill="#1C2025" stroke="#C6A36A" strokeWidth="1" />
                    <text x="315" y="268" fill="#C6A36A" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                      VCUBE
                    </text>

                    {/* Rooftop Overhead Concrete Water Tank on Columns */}
                    <rect x="270" y="14" width="36" height="22" fill="#2A3038" stroke="#C6A36A" strokeWidth="1" />
                    <line x1="276" y1="36" x2="276" y2="22" stroke="#C6A36A" strokeWidth="2" />
                    <line x1="300" y1="36" x2="300" y2="22" stroke="#C6A36A" strokeWidth="2" />

                    {/* Rooftop Pergola */}
                    <line x1="120" y1="22" x2="210" y2="22" stroke="#C6A36A" strokeWidth="1.5" />
                    {[130, 150, 170, 190].map((px) => (
                      <line key={`pp-${px}`} x1={px} y1="22" x2={px} y2="36" stroke="#C6A36A" strokeWidth="1" />
                    ))}
                  </g>
                )}
              </g>
            ) : (
              /* INDEPENDENT RESIDENTIAL HOUSE ELEVATION VECTOR */
              <g>
                {/* Ground Stilt Car Port */}
                <rect x="110" y="220" width="200" height="60" fill="#1B1F24" stroke="#C6A36A" strokeWidth="1" />
                <rect x="125" y="240" width="45" height="35" rx="4" fill="#2C3440" stroke="#858782" strokeWidth="0.8" />
                <rect x="180" y="242" width="42" height="33" rx="4" fill="#6A7280" stroke="#858782" strokeWidth="0.8" />
                {/* Sliding Wooden Gate */}
                <rect x="110" y="248" width="125" height="32" fill="#7E4E2C" stroke="#C6A36A" strokeWidth="1" />
                {/* Main Teak Door */}
                <rect x="250" y="235" width="30" height="45" fill="#7E4E2C" stroke="#C6A36A" strokeWidth="0.8" />

                {/* Level 1: Cantilevered Box Balcony */}
                <rect x="100" y="160" width="130" height="55" fill="#1F2328" stroke="#C6A36A" strokeWidth="1.2" />
                <rect x="105" y="188" width="120" height="22" fill="#A2C8E0" fillOpacity="0.45" stroke="#C6A36A" strokeWidth="1" />
                <rect x="240" y="160" width="70" height="55" fill="#F1EFEA" fillOpacity="0.8" stroke="#858782" strokeWidth="0.8" />

                {/* Level 2: Teak Louvers & Balcony */}
                <rect x="110" y="105" width="90" height="50" fill="#F1EFEA" fillOpacity="0.8" stroke="#858782" strokeWidth="0.8" />
                {[120, 132, 144, 156, 168].map((lx) => (
                  <line key={`tl-${lx}`} x1={lx} y1="110" x2={lx} y2="150" stroke="#7E4E2C" strokeWidth="2.5" />
                ))}
                <rect x="210" y="105" width="100" height="50" fill="#1F2328" stroke="#C6A36A" strokeWidth="1" />
                <rect x="215" y="132" width="90" height="20" fill="#A2C8E0" fillOpacity="0.45" stroke="#C6A36A" strokeWidth="1" />

                {/* Level 3: Master Suite & Corner Balcony */}
                <rect x="100" y="50" width="210" height="50" fill="#F1EFEA" fillOpacity="0.85" stroke="#C6A36A" strokeWidth="1" />
                <rect x="100" y="75" width="120" height="22" fill="#A2C8E0" fillOpacity="0.45" stroke="#C6A36A" strokeWidth="1" />

                {/* Rooftop Wooden Pergola & Terrace Garden */}
                <rect x="95" y="44" width="220" height="6" fill="#202428" stroke="#C6A36A" strokeWidth="1" />
                <line x1="120" y1="25" x2="200" y2="25" stroke="#7E4E2C" strokeWidth="2" />
                {[130, 150, 170, 190].map((px) => (
                  <line key={`hp-${px}`} x1={px} y1="25" x2={px} y2="44" stroke="#7E4E2C" strokeWidth="1.5" />
                ))}
                {/* Green terrace planters */}
                <circle cx="230" cy="38" r="6" fill="#3E6B48" />
                <circle cx="245" cy="38" r="5" fill="#3E6B48" />
              </g>
            )}
          </svg>

          {/* Active Stage Callout Box */}
          <div className="absolute top-2 right-2 rounded-lg border border-[#C6A36A]/30 bg-[#171A1D]/90 px-3 py-2 text-right">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#C6A36A]">
              Phase {stage} / 6
            </span>
            <div className="text-xs font-bold text-[#F3F0E8]">
              {stageData.title}
            </div>
          </div>
        </div>

        {/* Phase Details Card */}
        <div className="w-full mt-1 rounded-xl border border-white/10 bg-[#171A1D]/80 p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#F3F0E8]">
                {stageData.subtitle}
              </span>
              <p className="mt-1 text-xs text-[#858782] leading-relaxed">
                {stageData.desc}
              </p>
            </div>
            <CheckCircle2 className="h-5 w-5 text-[#C6A36A] shrink-0 ml-3" />
          </div>
        </div>
      </div>

      {/* Stage Controller Tabs (6 Stages) */}
      <div className="w-full pt-3 border-t border-white/10">
        <div className="grid grid-cols-6 gap-1 sm:gap-2">
          {APARTMENT_STAGES.map((s) => (
            <button
              key={s.stage}
              onClick={() => setStage(s.stage)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border transition-all text-center ${
                stage === s.stage
                  ? "border-[#C6A36A] bg-[#C6A36A]/20 text-[#C6A36A]"
                  : "border-white/5 bg-white/5 text-[#858782] hover:text-[#F3F0E8] hover:border-white/20"
              }`}
            >
              <span className="text-[10px] font-mono font-bold">0{s.stage}</span>
              <span className="hidden sm:inline text-[9px] truncate max-w-full font-medium">
                {s.title.split(" ")[0]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
