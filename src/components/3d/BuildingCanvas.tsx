"use client";

import dynamic from "next/dynamic";
import React from "react";
import { FallbackBuilding } from "./FallbackBuilding";
import { BuildingMode, BuildingModelType } from "./ArchitecturalBuilding";
import { CameraPresetType } from "./CinematicCameraController";

const DynamicScene = dynamic(
  () => import("./BuildingScene").then((mod) => mod.BuildingScene),
  {
    ssr: false,
    loading: () => <FallbackBuilding />,
  }
);

export interface BuildingCanvasProps {
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

export function BuildingCanvas(props: BuildingCanvasProps) {
  return <DynamicScene {...props} />;
}
