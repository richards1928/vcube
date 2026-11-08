"use client";

import React from "react";
import { ApartmentG4Building } from "./ApartmentG4Building";
import { IndependentHouseG3 } from "./IndependentHouseG3";

export type BuildingMode = "construction" | "design" | "completed";
export type BuildingModelType = "apartment-g4" | "independent-g3";

export interface ArchitecturalBuildingProps {
  modelType?: BuildingModelType;
  mode?: BuildingMode;
  stage?: number; // 1 to 6
  exploded?: boolean;
  lightingMode?: "dusk" | "blueprint" | "day";
}

/**
 * ArchitecturalBuilding Master Dispatcher
 *
 * Renders either:
 * 1. Realistic Multi-Story Residential Apartment Building (with 6 Construction Stages)
 * 2. Modern Independent Residential House (with ground parking, multiple floors, balconies & pergola)
 */
export function ArchitecturalBuilding({
  modelType = "apartment-g4",
  mode = "completed",
  stage,
  exploded = false,
  lightingMode = "dusk",
}: ArchitecturalBuildingProps) {
  // If stage is provided, map to 1-6; otherwise derive from mode
  const resolvedStage = React.useMemo(() => {
    if (stage !== undefined && stage !== null) {
      return Math.max(1, Math.min(6, stage));
    }
    if (mode === "construction") return 2;
    if (mode === "design") return 4;
    return 6;
  }, [stage, mode]);

  if (modelType === "independent-g3") {
    // Map mode for IndependentHouseG3
    const houseMode = mode || (resolvedStage <= 2 ? "construction" : resolvedStage <= 4 ? "design" : "completed");
    return (
      <IndependentHouseG3
        mode={houseMode}
        exploded={exploded}
        lightingMode={lightingMode}
      />
    );
  }

  // Default: Multi-Story Residential Apartment Building with full 6-stage construction progression
  return (
    <ApartmentG4Building
      stage={resolvedStage}
      exploded={exploded}
      lightingMode={lightingMode}
    />
  );
}
