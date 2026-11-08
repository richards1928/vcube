"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { BuildingCanvas } from "@/components/3d/BuildingCanvas";
import { BuildingMode, BuildingModelType } from "@/components/3d/ArchitecturalBuilding";
import { CameraPresetType } from "@/components/3d/CinematicCameraController";
import { ARCHITECTURAL_HOTSPOTS } from "@/components/3d/ArchitecturalHotspots";
import {
  Layers,
  Sun,
  Moon,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Building2,
  Home,
  Compass,
  Sparkles,
  Maximize2,
  Minimize2,
  X,
  Eye,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

const APARTMENT_STAGES = [
  {
    stage: 1,
    title: "1. Foundation & Plinth",
    subtitle: "Isolated Footings, Plinth Beams & Rebar Dowels",
    desc: "Site grading, earthwork excavation, concrete footing pads, continuous plinth beam casting, and vertical column starter dowels.",
    specs: ["M25 Grade Concrete", "Fe550D TMT Steel", "Anti-Termite Treatment", "Plinth Compaction"],
  },
  {
    stage: 2,
    title: "2. RCC Columns & Frame",
    subtitle: "Structural Column Grid & Multi-Story Framing",
    desc: "Reinforced cement concrete column cages, M25/M30 grade concrete pouring, shuttering formwork, and lateral tie reinforcement.",
    specs: ["Heavy Column Grids", "Shuttering Formwork", "Seismic Zone II Compliance", "Curing Protocols"],
  },
  {
    stage: 3,
    title: "3. Floor Slabs & Staircase",
    subtitle: "Cast Concrete Slabs & Dog-Legged Staircase",
    desc: "Ground stilt slab, four residential suspended floor slabs, central dog-legged RCC staircase waist slabs, and rooftop terrace slab.",
    specs: ["Post-Tensioned Slabs", "Dog-Legged Staircase", "Bevel Edge Casting", "Camber Validation"],
  },
  {
    stage: 4,
    title: "4. Brickwork, Walls & Windows",
    subtitle: "AAC / Clay Brick Masonry & Lintel Bands",
    desc: "Precision external and partition brickwork masonry, cast-in-place concrete lintel bands, window/door openings, and balcony parapets.",
    specs: ["AAC Lightweight Blocks", "Cast Lintel Bands", "Opening Alignment", "Balcony Brick Parapets"],
  },
  {
    stage: 5,
    title: "5. Electrical & Finishing",
    subtitle: "Concealed Conduits, Plaster & False Ceilings",
    desc: "Internal wall plastering, fire-retardant PVC electrical conduit routing, distribution boxes, gypsum false ceiling grids, and vitrified floor tiles.",
    specs: ["Concealed PVC Conduits", "Gypsum False Ceilings", "Vitrified Tile Flooring", "Undercoat Primer"],
  },
  {
    stage: 6,
    title: "6. Exterior Elevation & Completed",
    subtitle: "Turnkey Exterior Facade, Balconies & Handover",
    desc: "Weather-proof exterior elevation paint, vertical louvers, glass balustrades, ground stilt parking with gate, overhead water tank, and pergola.",
    specs: ["Weather-Proof Stucco", "Natural Teak Louvers", "Glass Balustrades", "Stilt Parking & Gate"],
  },
];

export function InteractiveExplorerSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const stepperRef = useRef<HTMLDivElement>(null);

  const [activeModel, setActiveModel] = useState<BuildingModelType>("apartment-g4");
  const [apartmentStage, setApartmentStage] = useState<number>(6);
  const [houseMode, setHouseMode] = useState<BuildingMode>("completed");
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [lightingMode, setLightingMode] = useState<"dusk" | "blueprint" | "day">("dusk");
  const [isPlayingAnimation, setIsPlayingAnimation] = useState<boolean>(false);

  // Hybrid Cinematic + Interactive Camera State
  const [isCinematic, setIsCinematic] = useState<boolean>(true);
  const [cameraPreset, setCameraPreset] = useState<CameraPresetType | null>(null);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [hoveredHotspotId, setHoveredHotspotId] = useState<string | null>(null);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [resetTrigger, setResetTrigger] = useState<number>(0);
  const [isAutoResumeEnabled, setIsAutoResumeEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Fullscreen state listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!canvasContainerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await canvasContainerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Gracefully fall back if browser blocks fullscreen
    }
  }, []);

  // Handle camera mode change from canvas interaction
  const handleCameraModeChange = useCallback((mode: "cinematic" | "manual") => {
    setIsCinematic(mode === "cinematic");
    if (mode === "manual") {
      setCameraPreset(null);
    }
  }, []);

  // Select camera preset
  const handleSelectPreset = useCallback((preset: CameraPresetType) => {
    setCameraPreset(preset);
    setIsCinematic(false);
    setActiveHotspotId(null);
  }, []);

  // Reset view to default 3/4 Hero view
  const handleResetView = useCallback(() => {
    setResetTrigger((prev) => prev + 1);
    setCameraPreset("three-quarter");
    setActiveHotspotId(null);
    setIsExploded(false);
  }, []);

  // Select hotspot
  const handleSelectHotspot = useCallback((id: string | null) => {
    setActiveHotspotId(id);
    if (id) {
      setIsCinematic(false);
      setCameraPreset(null);
    }
  }, []);

  // Auto-play construction sequence timer for the Demonstration Apartment
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlayingAnimation && activeModel === "apartment-g4") {
      timer = setInterval(() => {
        setApartmentStage((prev) => {
          if (prev >= 6) {
            setIsPlayingAnimation(false);
            return 6;
          }
          return prev + 1;
        });
      }, 2400);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlayingAnimation, activeModel]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set([headerRef.current, canvasContainerRef.current, stepperRef.current], {
          opacity: 1,
          y: 0,
        });
        return;
      }

      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      if (canvasContainerRef.current) {
        gsap.fromTo(
          canvasContainerRef.current,
          { opacity: 0, y: 30, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: canvasContainerRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      if (stepperRef.current) {
        gsap.fromTo(
          stepperRef.current.children,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: stepperRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  const handleStartAnimation = () => {
    if (apartmentStage >= 6) {
      setApartmentStage(1);
    }
    setIsPlayingAnimation(true);
    setActiveHotspotId(null);
  };

  const handlePauseAnimation = () => {
    setIsPlayingAnimation(false);
  };

  const currentStageInfo = APARTMENT_STAGES[apartmentStage - 1];
  const activeHotspot = ARCHITECTURAL_HOTSPOTS.find((h) => h.id === activeHotspotId);
  const hoveredHotspot = ARCHITECTURAL_HOTSPOTS.find((h) => h.id === hoveredHotspotId);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 bg-[#090B0D] text-[#F3F0E8] overflow-hidden border-t border-white/5 architectural-grid"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2.5">
              <span className="h-px w-6 bg-[#C6A36A]" />
              <span className="text-xs font-sans font-semibold uppercase tracking-[0.25em] text-[#C6A36A]">
                HYBRID CINEMATIC + INTERACTIVE 3D EXPLORER
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#F3F0E8] leading-tight">
              Interactive Residential Experience
            </h2>

            <p className="text-sm sm:text-base text-[#A0A4A8] font-light leading-relaxed">
              Experience our architectural projects in real time. Watch the cinematic tour, inspect structural hotspots, or take full manual control to rotate, zoom, and explore every floor slab.
            </p>
          </div>

          {/* Master Model Switcher */}
          <div className="flex items-center gap-2 p-1.5 rounded-full border border-[#C6A36A]/30 bg-[#16191D]/90 backdrop-blur-md shrink-0">
            <button
              onClick={() => {
                setActiveModel("apartment-g4");
                setIsPlayingAnimation(false);
                setActiveHotspotId(null);
              }}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide transition-all ${
                activeModel === "apartment-g4"
                  ? "bg-[#C6A36A] text-[#090B0D] shadow-lg"
                  : "text-[#A0A4A8] hover:text-[#F3F0E8]"
              }`}
            >
              <Building2 className="h-4 w-4" />
              <span>Multi-Story Apartment Model</span>
            </button>

            <button
              onClick={() => {
                setActiveModel("independent-g3");
                setIsPlayingAnimation(false);
                setActiveHotspotId(null);
              }}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide transition-all ${
                activeModel === "independent-g3"
                  ? "bg-[#C6A36A] text-[#090B0D] shadow-lg"
                  : "text-[#A0A4A8] hover:text-[#F3F0E8]"
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Independent Residence Model</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3D CANVAS BOX CONTAINER WITH HYBRID CINEMATIC OVERLAYS   */}
        {/* ======================================================== */}
        <div
          ref={canvasContainerRef}
          onDoubleClick={handleResetView}
          className={`relative w-full rounded-3xl border border-white/10 bg-gradient-to-b from-[#16191D]/90 to-[#0A0C0E]/95 overflow-hidden shadow-2xl transition-all duration-300 ${
            isFullscreen
              ? "h-screen rounded-none z-50 fixed inset-0"
              : "h-[560px] sm:h-[650px] lg:h-[720px]"
          }`}
        >
          <BuildingCanvas
            modelType={activeModel}
            stage={apartmentStage}
            mode={
              activeModel === "apartment-g4"
                ? apartmentStage <= 2
                  ? "construction"
                  : apartmentStage <= 4
                  ? "design"
                  : "completed"
                : houseMode
            }
            exploded={isExploded}
            lightingMode={lightingMode}
            interactive={true}
            isCinematic={isCinematic}
            onCameraModeChange={handleCameraModeChange}
            activePreset={cameraPreset}
            onPresetComplete={() => setCameraPreset(null)}
            activeHotspotId={activeHotspotId}
            onSelectHotspot={handleSelectHotspot}
            onHoverHotspot={setHoveredHotspotId}
            showHotspots={showHotspots}
            resetTrigger={resetTrigger}
            autoResumeDelay={10}
            isAutoResumeEnabled={isAutoResumeEnabled}
          />

          {/* Floating Hover Hotspot Pill Indicator */}
          {hoveredHotspot && !activeHotspot && activeModel === "apartment-g4" && showHotspots && apartmentStage === 6 && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-none z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#090B0D]/90 border border-[#C6A36A]/60 shadow-xl backdrop-blur-md animate-in fade-in duration-200">
              <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#C6A36A] text-[#090B0D] font-mono font-bold text-[9px]">
                {hoveredHotspot.number}
              </span>
              <span className="text-xs font-sans font-medium text-[#F3F0E8]">
                {hoveredHotspot.title}
              </span>
              <span className="text-[10px] font-mono text-[#C6A36A] uppercase tracking-wider hidden sm:inline ml-1">
                • Click to inspect
              </span>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TOP BAR: CINEMATIC MODE INDICATOR & CAMERA PRESETS   */}
          {/* ---------------------------------------------------- */}
          <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
            {/* Mode Indicator Badge */}
            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                onClick={() => setIsCinematic(!isCinematic)}
                className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 border backdrop-blur-md transition-all shadow-lg ${
                  isCinematic
                    ? "bg-[#C6A36A]/20 border-[#C6A36A] text-[#C6A36A]"
                    : "bg-[#090B0D]/80 border-white/15 text-[#A0A4A8] hover:text-[#F3F0E8]"
                }`}
                title={isCinematic ? "Click to Pause Cinematic Tour" : "Click to Resume Cinematic Tour"}
              >
                {isCinematic ? (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C6A36A] opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C6A36A]" />
                    </span>
                    <span className="text-xs font-mono font-bold tracking-wider">
                      CINEMATIC TOUR
                    </span>
                    <Pause className="h-3 w-3 ml-0.5 opacity-70" />
                  </>
                ) : (
                  <>
                    <Compass className="h-3.5 w-3.5 text-[#C6A36A]" />
                    <span className="text-xs font-mono font-medium tracking-wide">
                      MANUAL 3D
                    </span>
                    <Play className="h-3 w-3 ml-0.5 fill-current opacity-70" />
                  </>
                )}
              </button>

              {/* Hotspot Toggle */}
              {activeModel === "apartment-g4" && apartmentStage === 6 && (
                <button
                  onClick={() => setShowHotspots(!showHotspots)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 border backdrop-blur-md text-xs font-medium transition-all ${
                    showHotspots
                      ? "border-[#C6A36A]/60 bg-[#16191D]/90 text-[#F3F0E8]"
                      : "border-white/10 bg-[#090B0D]/60 text-[#A0A4A8]"
                  }`}
                  title="Toggle Architectural Hotspots"
                >
                  <Sparkles className="h-3 w-3 text-[#C6A36A]" />
                  <span className="hidden sm:inline">Hotspots</span>
                  <span className="text-[10px] opacity-60">({ARCHITECTURAL_HOTSPOTS.length})</span>
                </button>
              )}
            </div>

            {/* Camera Presets & Utilities */}
            <div className="flex items-center gap-2 pointer-events-auto">
              {/* 3 Camera Presets */}
              <div className="hidden md:flex items-center gap-1 p-1 rounded-full border border-white/10 bg-[#090B0D]/85 backdrop-blur-md">
                <button
                  onClick={() => handleSelectPreset("front")}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                    cameraPreset === "front"
                      ? "bg-[#C6A36A] text-[#090B0D] font-bold shadow"
                      : "text-[#A0A4A8] hover:text-[#F3F0E8]"
                  }`}
                >
                  01 Front
                </button>
                <button
                  onClick={() => handleSelectPreset("three-quarter")}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                    cameraPreset === "three-quarter"
                      ? "bg-[#C6A36A] text-[#090B0D] font-bold shadow"
                      : "text-[#A0A4A8] hover:text-[#F3F0E8]"
                  }`}
                >
                  02 3/4 Hero
                </button>
                <button
                  onClick={() => handleSelectPreset("detail")}
                  className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                    cameraPreset === "detail"
                      ? "bg-[#C6A36A] text-[#090B0D] font-bold shadow"
                      : "text-[#A0A4A8] hover:text-[#F3F0E8]"
                  }`}
                >
                  03 Detail
                </button>
              </div>

              {/* Explode Slabs Button */}
              <button
                onClick={() => setIsExploded(!isExploded)}
                className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium tracking-wide transition-all backdrop-blur-md ${
                  isExploded
                    ? "border-[#C6A36A] bg-[#C6A36A] text-black font-semibold shadow-md"
                    : "border-white/15 bg-[#090B0D]/80 text-[#A0A4A8] hover:text-[#F3F0E8]"
                }`}
                title="Separate floor slabs vertically for interior inspection"
              >
                <Layers className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{isExploded ? "Exploded" : "Explode Slabs"}</span>
              </button>

              {/* Lighting Mode Switcher */}
              <button
                onClick={() =>
                  setLightingMode((prev) =>
                    prev === "dusk" ? "day" : prev === "day" ? "blueprint" : "dusk"
                  )
                }
                title="Toggle Dusk / Day / Blueprint Lighting"
                className="flex items-center justify-center h-8 w-8 rounded-full border border-white/15 bg-[#090B0D]/80 text-[#C6A36A] hover:border-[#C6A36A] transition-all"
              >
                {lightingMode === "dusk" ? (
                  <Moon className="h-3.5 w-3.5" />
                ) : lightingMode === "day" ? (
                  <Sun className="h-3.5 w-3.5" />
                ) : (
                  <Sliders className="h-3.5 w-3.5" />
                )}
              </button>

              {/* Reset View Button */}
              <button
                onClick={handleResetView}
                title="Reset Camera to Hero 3/4 View"
                className="flex items-center justify-center h-8 w-8 rounded-full border border-white/15 bg-[#090B0D]/80 text-[#A0A4A8] hover:text-[#F3F0E8] hover:border-white/30 transition-all"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                className="flex items-center justify-center h-8 w-8 rounded-full border border-white/15 bg-[#090B0D]/80 text-[#A0A4A8] hover:text-[#F3F0E8] transition-all"
              >
                {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {/* ---------------------------------------------------- */}
          {/* FLOATING ARCHITECTURAL HOTSPOT INFORMATION CARD     */}
          {/* ---------------------------------------------------- */}
          {activeHotspot && activeModel === "apartment-g4" && (
            <div className="absolute right-4 sm:right-6 bottom-16 sm:bottom-6 max-w-xs sm:max-w-sm rounded-2xl border border-[#C6A36A]/50 bg-[#090B0D]/95 p-4 sm:p-5 backdrop-blur-xl shadow-2xl z-20 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#C6A36A] text-[#090B0D] font-mono font-bold text-[10px]">
                    {activeHotspot.number}
                  </span>
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[#C6A36A]">
                    {activeHotspot.category}
                  </span>
                </div>
                <button
                  onClick={() => setActiveHotspotId(null)}
                  className="text-[#A0A4A8] hover:text-[#F3F0E8] p-1 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Close information card"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <h4 className="font-serif text-sm sm:text-base font-normal text-[#F3F0E8]">
                {activeHotspot.title}
              </h4>

              <p className="text-[11px] sm:text-xs text-[#A8ABB0] font-light leading-relaxed mt-1.5 mb-2.5">
                {activeHotspot.desc}
              </p>

              {/* Technical Specifications List */}
              <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-white/10">
                {activeHotspot.specs.map((spec) => (
                  <div key={spec} className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-[#F3F0E8]">
                    <span className="h-1 w-1 rounded-full bg-[#C6A36A] shrink-0" />
                    <span className="truncate">{spec}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons: Return to 3/4 Hero View or Dismiss */}
              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => {
                    setActiveHotspotId(null);
                    handleResetView();
                  }}
                  className="text-[11px] font-medium text-[#C6A36A] hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset to Full View</span>
                </button>
                <button
                  onClick={() => setActiveHotspotId(null)}
                  className="text-[11px] text-[#A0A4A8] hover:text-[#F3F0E8] px-2.5 py-0.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* BOTTOM BAR: HOTSPOT QUICK CHIPS & INTERACTION HINT   */}
          {/* ---------------------------------------------------- */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-3 pointer-events-none">
            {/* Quick Hotspot Chips (Mobile Touch Friendly) */}
            {activeModel === "apartment-g4" && apartmentStage === 6 && showHotspots && (
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 pointer-events-auto max-w-[calc(100%-140px)] sm:max-w-none">
                {ARCHITECTURAL_HOTSPOTS.map((h) => (
                  <button
                    key={`chip-${h.id}`}
                    onClick={() => handleSelectHotspot(activeHotspotId === h.id ? null : h.id)}
                    className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-sans transition-all backdrop-blur-md ${
                      activeHotspotId === h.id
                        ? "border-[#C6A36A] bg-[#C6A36A] text-[#090B0D] font-bold shadow-md"
                        : "border-white/10 bg-[#090B0D]/80 text-[#A0A4A8] hover:text-[#F3F0E8] hover:border-white/20"
                    }`}
                  >
                    <span className="font-mono text-[9px] opacity-75">{h.number}.</span>
                    <span>{h.title.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Desktop Interaction Hint */}
            <div className="hidden lg:flex items-center gap-2 bg-[#090B0D]/75 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-mono text-[#A0A4A8] ml-auto">
              <span>Drag to Orbit · Scroll to Zoom · Double-Click to Reset</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 6-STAGE CONSTRUCTION SEQUENCE & TECHNICAL HIGHLIGHTS     */}
        {/* ======================================================== */}
        {activeModel === "apartment-g4" ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#16191D]/80 p-6 backdrop-blur-md">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#C6A36A]">
                    COORDINATED 6-STAGE CONSTRUCTION PROGRESSION
                  </span>
                  {isPlayingAnimation && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#C6A36A]/20 px-2.5 py-0.5 text-[10px] font-mono text-[#C6A36A] animate-pulse">
                      ● Active Transformation
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-serif font-normal text-[#F3F0E8]">
                  {currentStageInfo.subtitle}
                </h3>
              </div>

              {/* Stage Animation Play/Pause & Reset Controls */}
              <div className="flex items-center gap-3">
                {isPlayingAnimation ? (
                  <button
                    onClick={handlePauseAnimation}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-[#F3F0E8] hover:bg-white/20 transition-all"
                  >
                    <Pause className="h-3.5 w-3.5 text-[#C6A36A]" />
                    <span>Pause Sequence</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStartAnimation}
                    className="inline-flex items-center gap-2 rounded-full bg-[#C6A36A] px-5 py-2 text-xs font-bold text-[#090B0D] hover:bg-[#DFC293] shadow-lg transition-all"
                  >
                    <Play className="h-3.5 w-3.5 fill-[#090B0D]" />
                    <span>{apartmentStage >= 6 ? "Play Construction Sequence" : "Resume Sequence"}</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setApartmentStage(1);
                    setIsPlayingAnimation(false);
                    setActiveHotspotId(null);
                  }}
                  title="Reset to Foundation (Stage 1)"
                  className="flex items-center justify-center h-8 w-8 rounded-full border border-white/15 bg-[#090B0D] text-[#A0A4A8] hover:text-[#F3F0E8] transition-all"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* 6 Stage Buttons */}
            <div ref={stepperRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6">
              {APARTMENT_STAGES.map((item) => (
                <button
                  key={item.stage}
                  onClick={() => {
                    setApartmentStage(item.stage);
                    setIsPlayingAnimation(false);
                    setActiveHotspotId(null);
                  }}
                  className={`flex flex-col items-start p-3.5 rounded-xl border transition-all text-left ${
                    apartmentStage === item.stage
                      ? "border-[#C6A36A] bg-[#C6A36A]/15 text-[#F3F0E8] shadow-md ring-1 ring-[#C6A36A]"
                      : "border-white/5 bg-[#0D0F12] text-[#A0A4A8] hover:text-[#F3F0E8] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-[#C6A36A]">
                      0{item.stage}
                    </span>
                    {apartmentStage >= item.stage && (
                      <CheckCircle2 className="h-3 w-3 text-[#C6A36A]" />
                    )}
                  </div>
                  <span className="text-xs font-semibold truncate w-full text-[#F3F0E8]">
                    {item.title.split(". ")[1]}
                  </span>
                  <span className="text-[10px] text-[#A0A4A8] truncate w-full mt-0.5">
                    {item.subtitle.split(",")[0]}
                  </span>
                </button>
              ))}
            </div>

            {/* Specifications for Active Stage */}
            <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#C6A36A] mr-2">
                  Technical Highlights:
                </span>
                {currentStageInfo.specs.map((spec) => (
                  <span
                    key={spec}
                    className="inline-flex items-center gap-1.5 rounded-md bg-[#0D0F12] border border-white/10 px-2.5 py-1 text-[11px] text-[#F3F0E8]"
                  >
                    <span className="h-1 w-1 rounded-full bg-[#C6A36A]" />
                    <span>{spec}</span>
                  </span>
                ))}
              </div>

              {/* Auto-Resume Configuration Toggle */}
              <div className="flex items-center gap-2">
                <label className="text-[11px] font-mono text-[#A0A4A8] cursor-pointer flex items-center gap-1.5 select-none">
                  <input
                    type="checkbox"
                    checked={isAutoResumeEnabled}
                    onChange={(e) => setIsAutoResumeEnabled(e.target.checked)}
                    className="rounded border-white/20 bg-[#090B0D] text-[#C6A36A] focus:ring-0 cursor-pointer h-3.5 w-3.5"
                  />
                  <span>Auto-Resume Tour (10s inactivity)</span>
                </label>
              </div>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* INDEPENDENT RESIDENCE CONTROLLER                         */
          /* ======================================================== */
          <div className="mt-8 rounded-2xl border border-white/10 bg-[#16191D]/80 p-6 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-widest text-[#C6A36A]">
                  INDEPENDENT MULTI-FLOOR RESIDENCE (DEMO)
                </span>
                <h3 className="text-lg font-serif font-normal text-[#F3F0E8]">
                  Contemporary Multi-Level Private Residence with Stilt Parking & Pergola
                </h3>
              </div>

              <div className="flex items-center gap-2 p-1 rounded-full border border-white/10 bg-[#0D0F12]">
                {(
                  [
                    { id: "construction", label: "Structural Frame" },
                    { id: "design", label: "Facade & Balconies" },
                    { id: "completed", label: "Completed Residence" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setHouseMode(tab.id)}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium tracking-wide transition-all ${
                      houseMode === tab.id
                        ? "bg-[#C6A36A] text-[#090B0D] font-bold shadow-md"
                        : "text-[#A0A4A8] hover:text-[#F3F0E8]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
              {[
                { title: "Ground Stilt Parking", desc: "Covered parking bays, automated sliding teak gate & security foyer." },
                { title: "Floor 1 Box Cantilever", desc: "Dark bronze architectural box projection with tempered glass balcony." },
                { title: "Floor 2 Teak Louvers", desc: "Vertical brise-soleil slats for privacy & solar heat reduction." },
                { title: "Floor 3 & Terrace", desc: "Master suite corner balcony & rooftop open terrace wooden pergola." },
              ].map((hl) => (
                <div key={hl.title} className="p-4 rounded-xl border border-white/5 bg-[#0D0F12] space-y-1">
                  <span className="text-xs font-semibold text-[#F3F0E8] block">{hl.title}</span>
                  <p className="text-[11px] text-[#A0A4A8] leading-relaxed">{hl.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
