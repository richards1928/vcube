"use client";

import React, { Suspense, useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { ArchitecturalBuilding, BuildingMode, BuildingModelType } from "./ArchitecturalBuilding";
import { FallbackBuilding } from "./FallbackBuilding";
import {
  CinematicCameraController,
  CameraPresetType,
} from "./CinematicCameraController";
import { ArchitecturalHotspots } from "./ArchitecturalHotspots";

export interface BuildingSceneProps {
  modelType?: BuildingModelType;
  mode?: BuildingMode;
  stage?: number;
  exploded?: boolean;
  lightingMode?: "dusk" | "blueprint" | "day";
  interactive?: boolean;
  isCinematic?: boolean;
  onCameraModeChange?: (mode: "cinematic" | "manual") => void;
  activePreset?: CameraPresetType | null;
  onPresetComplete?: () => void;
  activeHotspotId?: string | null;
  onSelectHotspot?: (id: string | null) => void;
  onHoverHotspot?: (id: string | null) => void;
  showHotspots?: boolean;
  resetTrigger?: number;
  autoResumeDelay?: number;
  isAutoResumeEnabled?: boolean;
}

function SceneLights({
  lightingMode,
  isMobile = false,
}: {
  lightingMode: "dusk" | "blueprint" | "day";
  isMobile?: boolean;
}) {
  const shadowMapSize: [number, number] = isMobile ? [512, 512] : [1024, 1024];

  if (lightingMode === "blueprint") {
    return (
      <>
        <ambientLight intensity={0.65} />
        <directionalLight position={[10, 18, 10]} intensity={1.3} color="#C6A36A" />
        <directionalLight position={[-10, 12, -10]} intensity={0.8} color="#858782" />
      </>
    );
  }

  if (lightingMode === "day") {
    return (
      <>
        <ambientLight intensity={0.95} />
        <directionalLight
          position={[14, 22, 10]}
          intensity={2.2}
          castShadow
          shadow-mapSize={shadowMapSize}
          shadow-camera-left={-9}
          shadow-camera-right={9}
          shadow-camera-top={11}
          shadow-camera-bottom={-7}
          shadow-camera-near={0.5}
          shadow-camera-far={45}
          shadow-bias={-0.0005}
        />
        <directionalLight position={[-10, 14, -14]} intensity={0.75} color="#B0C4DE" />
      </>
    );
  }

  // Dusk / Architectural Golden Hour Lighting (Default - Warm, Rich, Inviting)
  return (
    <>
      <ambientLight intensity={0.85} color="#556272" />

      {/* Main Warm Golden Architectural Key Light */}
      <directionalLight
        position={[13, 17, 11]}
        intensity={2.4}
        color="#FDE8B3"
        castShadow
        shadow-mapSize={shadowMapSize}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={11}
        shadow-camera-bottom={-7}
        shadow-camera-near={0.5}
        shadow-camera-far={45}
        shadow-bias={-0.0005}
      />

      {/* Sky Ambient Twilight Cool Fill Light */}
      <directionalLight
        position={[-12, 12, -10]}
        intensity={0.85}
        color="#7C96B2"
      />

      {/* Ground Up-lights for boundary entrance & trees */}
      <pointLight position={[0, -0.6, 5]} intensity={isMobile ? 1.5 : 2.2} color="#FDE8B3" distance={11} />
      {!isMobile && (
        <>
          <pointLight position={[3.6, 0.4, 3.2]} intensity={1.8} color="#F5E6CC" distance={9} />
          <pointLight position={[-3.6, 0.4, 3.2]} intensity={1.8} color="#F5E6CC" distance={9} />
        </>
      )}
    </>
  );
}

export function BuildingScene({
  modelType = "apartment-g4",
  mode = "completed",
  stage = 6,
  exploded = false,
  lightingMode = "dusk",
  interactive = true,
  isCinematic = true,
  onCameraModeChange = () => {},
  activePreset = null,
  onPresetComplete,
  activeHotspotId = null,
  onSelectHotspot = () => {},
  onHoverHotspot,
  showHotspots = true,
  resetTrigger = 0,
  autoResumeDelay = 10,
  isAutoResumeEnabled = true,
}: BuildingSceneProps) {
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    setIsMobile(
      typeof window !== "undefined" &&
      (window.innerWidth <= 768 || window.matchMedia("(pointer: coarse)").matches)
    );
  }, []);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl") ||
        canvas.getContext("webgl2");
      setHasWebGL(Boolean(gl));
    } catch {
      setHasWebGL(false);
    }
  }, []);

  // Viewport-aware rendering: pause continuous WebGL render loops when out of view
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        rootMargin: "250px", // Pre-activate 250px before entering viewport for seamless transition
        threshold: 0.01,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (hasWebGL === false) {
    return <FallbackBuilding currentStage={stage} modelType={modelType} />;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[500px] flex items-center justify-center will-change-transform select-none"
    >
      <Canvas
        shadows={!isMobile}
        dpr={isMobile ? [1, 1.2] : [1, 1.5]}
        frameloop={isVisible ? "always" : "never"}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: "high-performance",
        }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <PerspectiveCamera makeDefault position={[10.8, 4.8, 12.2]} fov={39} />

        <SceneLights lightingMode={lightingMode} isMobile={isMobile} />

        <Suspense fallback={null}>
          <ArchitecturalBuilding
            modelType={modelType}
            mode={mode}
            stage={stage}
            exploded={exploded}
            lightingMode={lightingMode}
          />

          {modelType === "apartment-g4" && (
            <ArchitecturalHotspots
              activeHotspotId={activeHotspotId}
              onSelectHotspot={onSelectHotspot}
              onHoverHotspot={onHoverHotspot}
              visible={showHotspots && (stage === 6 || stage === undefined)}
            />
          )}
        </Suspense>

        {interactive && (
          <CinematicCameraController
            isCinematic={isCinematic}
            onModeChange={onCameraModeChange}
            activePreset={activePreset}
            onPresetComplete={onPresetComplete}
            activeHotspotId={activeHotspotId}
            resetTrigger={resetTrigger}
            autoResumeDelay={autoResumeDelay}
            isAutoResumeEnabled={isAutoResumeEnabled}
            isVisible={isVisible}
          />
        )}
      </Canvas>
    </div>
  );
}
