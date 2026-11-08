"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface IndependentHouseG3Props {
  mode?: "completed" | "construction" | "design";
  exploded?: boolean;
  lightingMode?: "dusk" | "blueprint" | "day";
}

/**
 * Modern Independent Residential House Demonstration Model
 *
 * - Ground floor with covered parking entrance, automated teak gate & boundary wall
 * - Upper residential floors with cantilevered box balconies, teak louvers & glass railings
 * - Open rooftop terrace with wooden pergola canopy & terrace garden
 * - Realistic urban residential plot proportions
 */
export function IndependentHouseG3({
  mode = "completed",
  exploded = false,
  lightingMode = "dusk",
}: IndependentHouseG3Props) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current && !exploded) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  const explodeOffset = exploded ? 0.9 : 0;
  const currentMode = mode || "completed";

  // Proportions of an upscale urban independent house (approx 30x50 ft scale)
  const houseWidth = 6.4;  // X
  const houseDepth = 7.0;  // Z
  const groundHeight = 1.35; // Parking & foyer
  const floorHeight = 1.25;  // 3 upper residential floors
  const totalUpperFloors = 3; // Upper residential levels for demonstration model

  // Column coordinates (3x2 grid = 6 columns for an independent house)
  const columns: [number, number][] = useMemo(
    () => [
      [-2.4, -2.5], [0.4, -2.5], [2.4, -2.5],
      [-2.4, 2.5],  [0.4, 2.5],  [2.4, 2.5],
    ],
    []
  );

  const colors = useMemo(
    () => ({
      ivory: "#EDE8DF",
      charcoal: "#1D2024",
      champagne: "#A38555",
      teakWood: "#82502E",
      glass: "#84B0CC",
      concrete: "#545B62",
      pavement: "#1A1D20",
    }),
    []
  );

  return (
    <group ref={groupRef} position={[0, -2.8, 0]}>
      {/* ======================================================== */}
      {/* 1. GROUND PLOT & BOUNDARY                                */}
      {/* ======================================================== */}
      <group position={[0, 0, 0]}>
        {/* Plot Base Slab */}
        <mesh position={[0, -0.2, 0]} receiveShadow>
          <boxGeometry args={[10.5, 0.4, 10.5]} />
          <meshStandardMaterial color={colors.pavement} roughness={0.85} />
        </mesh>

        {/* Construction Grid / Foundation Piles */}
        {currentMode === "construction" && (
          <group position={[0, 0, 0]}>
            <gridHelper args={[9.5, 9.5, "#C6A36A", "#3A414A"]} position={[0, 0.02, 0]} />
            {/* Plinth tie beams */}
            {[-2.4, 0.4, 2.4].map((x) => (
              <mesh key={`plinth-house-x-${x}`} position={[x, 0.12, 0]}>
                <boxGeometry args={[0.32, 0.25, 5.2]} />
                <meshStandardMaterial color={colors.concrete} roughness={0.8} />
              </mesh>
            ))}
          </group>
        )}
      </group>

      {/* ======================================================== */}
      {/* 2. GROUND FLOOR: COVERED PARKING & ENTRANCE FOYER        */}
      {/* ======================================================== */}
      <group position={[0, 0, 0]}>
        {/* Ground Floor Slab */}
        <mesh position={[0, 0.08, 0]} receiveShadow>
          <boxGeometry args={[houseWidth + 0.2, 0.16, houseDepth + 0.2]} />
          <meshStandardMaterial
            color={currentMode === "completed" ? "#22262B" : colors.concrete}
            roughness={0.7}
          />
        </mesh>

        {/* Structural RCC Columns */}
        {columns.map(([x, z], idx) => (
          <group key={`gh-col-${idx}`} position={[x, groundHeight / 2, z]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.38, groundHeight, 0.38]} />
              <meshStandardMaterial
                color={currentMode === "completed" ? colors.ivory : colors.concrete}
                roughness={0.65}
              />
            </mesh>
            {currentMode === "construction" && (
              <mesh position={[0, 0.2, 0]}>
                <boxGeometry args={[0.42, 0.03, 0.42]} />
                <meshStandardMaterial color={colors.champagne} metalness={0.9} />
              </mesh>
            )}
          </group>
        ))}

        {/* COMPLETED / DESIGN: Ground Parking Port & Gate Details */}
        {currentMode !== "construction" && (
          <group position={[0, 0, 0]}>
            {/* Foyer & Home Office Enclosure on the right side */}
            <mesh position={[1.8, groundHeight / 2, -0.6]} castShadow>
              <boxGeometry args={[2.0, groundHeight, 3.6]} />
              <meshStandardMaterial color={colors.ivory} roughness={0.6} />
            </mesh>
            {/* Main Entrance Teak Door */}
            <mesh position={[0.78, groundHeight / 2 - 0.15, -0.6]}>
              <boxGeometry args={[0.04, 1.05, 0.85]} />
              <meshStandardMaterial color={colors.teakWood} roughness={0.4} />
            </mesh>
            {/* Door Handle in Champagne Gold */}
            <mesh position={[0.75, groundHeight / 2 - 0.15, -0.3]}>
              <boxGeometry args={[0.02, 0.4, 0.03]} />
              <meshStandardMaterial color={colors.champagne} metalness={0.9} />
            </mesh>

            {/* Covered Parking Bays for 2 Cars */}
            <group position={[-1.2, 0.35, 0.2]}>
              {/* Luxury Sedan */}
              <mesh castShadow position={[-0.7, 0, 0]}>
                <boxGeometry args={[1.25, 0.48, 2.3]} />
                <meshStandardMaterial color="#1E242B" roughness={0.3} metalness={0.7} />
              </mesh>
              <mesh position={[-0.7, 0.3, -0.1]} castShadow>
                <boxGeometry args={[1.1, 0.32, 1.25]} />
                <meshStandardMaterial color="#0E1216" roughness={0.1} metalness={0.9} />
              </mesh>

              {/* Second Car (Silver Hatchback/Sedan) */}
              <mesh castShadow position={[0.7, 0, 0]}>
                <boxGeometry args={[1.2, 0.46, 2.2]} />
                <meshStandardMaterial color="#8E959E" roughness={0.3} metalness={0.8} />
              </mesh>
              <mesh position={[0.7, 0.3, -0.1]} castShadow>
                <boxGeometry args={[1.05, 0.32, 1.2]} />
                <meshStandardMaterial color="#1A1F26" roughness={0.1} metalness={0.9} />
              </mesh>
            </group>

            {/* Boundary Wall & Modern Automated Sliding Teak Gate */}
            <group position={[0, 0, 4.2]}>
              {/* Left Wall Section with Warm Sconce Light */}
              <mesh position={[-2.4, 0.45, 0]} castShadow>
                <boxGeometry args={[1.6, 0.9, 0.2]} />
                <meshStandardMaterial color={colors.charcoal} roughness={0.5} />
              </mesh>
              {/* Warm Exterior Wall Sconce */}
              <mesh position={[-2.4, 0.6, 0.12]}>
                <boxGeometry args={[0.08, 0.15, 0.04]} />
                <meshBasicMaterial color="#FFE082" />
              </mesh>

              {/* Sliding Teak Wood Gate with Champagne Trim */}
              <mesh position={[0.2, 0.45, 0]} castShadow>
                <boxGeometry args={[3.4, 0.85, 0.06]} />
                <meshStandardMaterial color={colors.teakWood} roughness={0.4} />
              </mesh>
              <mesh position={[0.2, 0.45, 0.04]}>
                <boxGeometry args={[3.44, 0.04, 0.02]} />
                <meshStandardMaterial color={colors.champagne} metalness={0.9} />
              </mesh>

              {/* Right Wall with Nameplate: THE COURTYARD RESIDENCE */}
              <mesh position={[2.6, 0.45, 0]} castShadow>
                <boxGeometry args={[1.2, 0.9, 0.2]} />
                <meshStandardMaterial color={colors.charcoal} roughness={0.5} />
              </mesh>
              <mesh position={[2.6, 0.55, 0.12]}>
                <boxGeometry args={[0.9, 0.25, 0.02]} />
                <meshStandardMaterial color={colors.champagne} metalness={0.8} />
              </mesh>
            </group>
          </group>
        )}
      </group>

      {/* ======================================================== */}
      {/* 3. THREE UPPER RESIDENTIAL FLOORS (Floors 1, 2, 3)        */}
      {/* ======================================================== */}
      {Array.from({ length: totalUpperFloors }).map((_, fIdx) => {
        const floorNum = fIdx + 1;
        const yBase =
          groundHeight +
          fIdx * floorHeight +
          (fIdx + 1) * explodeOffset;

        return (
          <group key={`house-floor-${floorNum}`} position={[0, yBase, 0]}>
            {/* Concrete Slab */}
            <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
              <boxGeometry args={[houseWidth, 0.16, houseDepth]} />
              <meshStandardMaterial
                color={currentMode === "completed" ? "#22262B" : colors.concrete}
                roughness={0.65}
              />
            </mesh>

            {/* RCC Columns for this level */}
            <group position={[0, floorHeight / 2, 0]}>
              {columns.map(([x, z], cIdx) => (
                <mesh key={`h-col-${floorNum}-${cIdx}`} position={[x, 0, z]} castShadow receiveShadow>
                  <boxGeometry args={[0.34, floorHeight, 0.34]} />
                  <meshStandardMaterial
                    color={currentMode === "completed" ? colors.ivory : colors.concrete}
                    roughness={0.65}
                  />
                </mesh>
              ))}
            </group>

            {/* ==================================================== */}
            {/* FLOOR 1: Cantilevered Box Balcony & Living Lounge    */}
            {/* ==================================================== */}
            {floorNum === 1 && currentMode !== "construction" && (
              <group position={[0, floorHeight / 2, 0]}>
                {/* Cantilevered Charcoal Box Frame Protrusion */}
                <mesh position={[-0.8, 0, 3.8]} castShadow>
                  <boxGeometry args={[3.6, floorHeight, 1.2]} />
                  <meshStandardMaterial color={colors.charcoal} roughness={0.3} metalness={0.4} />
                </mesh>
                {/* Balcony Glass Railing */}
                <mesh position={[-0.8, -floorHeight / 2 + 0.45, 4.45]} castShadow>
                  <boxGeometry args={[3.4, 0.75, 0.04]} />
                  <meshStandardMaterial
                    color="#A2C8E0"
                    transparent
                    opacity={0.65}
                    roughness={0.1}
                    metalness={0.7}
                  />
                </mesh>
                {/* Champagne Handrail */}
                <mesh position={[-0.8, -floorHeight / 2 + 0.85, 4.45]}>
                  <boxGeometry args={[3.45, 0.04, 0.06]} />
                  <meshStandardMaterial color={colors.champagne} metalness={0.9} />
                </mesh>
                {/* Living Room Large Sliding Glass Door */}
                <mesh position={[-0.8, 0, 3.2]}>
                  <boxGeometry args={[3.2, floorHeight - 0.1, 0.06]} />
                  <meshStandardMaterial color={colors.glass} transparent opacity={0.5} roughness={0.1} />
                </mesh>
                {/* Main Wall Ivory Finish */}
                <mesh position={[2.0, 0, 3.4]} castShadow>
                  <boxGeometry args={[2.0, floorHeight, 0.25]} />
                  <meshStandardMaterial color={colors.ivory} roughness={0.6} />
                </mesh>
                {/* Warm Interior Lighting */}
                <pointLight position={[-0.8, 0.2, 1.5]} intensity={1.5} color="#FFDCA8" distance={5.0} />
              </group>
            )}

            {/* ==================================================== */}
            {/* FLOOR 2: Vertical Teakwood Louvers & Offset Balcony  */}
            {/* ==================================================== */}
            {floorNum === 2 && currentMode !== "construction" && (
              <group position={[0, floorHeight / 2, 0]}>
                {/* Main Ivory Elevation Wall */}
                <mesh position={[-1.2, 0, 3.4]} castShadow>
                  <boxGeometry args={[3.4, floorHeight, 0.25]} />
                  <meshStandardMaterial color={colors.ivory} roughness={0.6} />
                </mesh>
                {/* Offset Balcony on the Right */}
                <mesh position={[1.4, -floorHeight / 2 + 0.45, 3.9]} castShadow>
                  <boxGeometry args={[2.6, 0.75, 0.04]} />
                  <meshStandardMaterial
                    color="#A2C8E0"
                    transparent
                    opacity={0.65}
                    roughness={0.1}
                    metalness={0.7}
                  />
                </mesh>
                {/* Balcony Handrail */}
                <mesh position={[1.4, -floorHeight / 2 + 0.85, 3.9]}>
                  <boxGeometry args={[2.65, 0.04, 0.06]} />
                  <meshStandardMaterial color={colors.champagne} metalness={0.9} />
                </mesh>
                {/* Vertical Teak Louvers (Brise-Soleil) */}
                {[-2.2, -1.8, -1.4, -1.0, -0.6].map((lx) => (
                  <mesh key={`teak-louver-${lx}`} position={[lx, 0, 3.6]} castShadow>
                    <boxGeometry args={[0.06, floorHeight, 0.22]} />
                    <meshStandardMaterial color={colors.teakWood} roughness={0.4} />
                  </mesh>
                ))}
                {/* Glass Window Behind Louvers */}
                <mesh position={[-1.4, 0, 3.45]}>
                  <boxGeometry args={[2.0, floorHeight - 0.2, 0.04]} />
                  <meshStandardMaterial color={colors.glass} transparent opacity={0.6} />
                </mesh>
                {/* Warm Interior Lighting */}
                <pointLight position={[1.0, 0.2, 1.5]} intensity={1.5} color="#FFDCA8" distance={5.0} />
              </group>
            )}

            {/* ==================================================== */}
            {/* FLOOR 3: Master Suite Wrap-around Balcony & Canopy   */}
            {/* ==================================================== */}
            {floorNum === 3 && currentMode !== "construction" && (
              <group position={[0, floorHeight / 2, 0]}>
                {/* Master Bedroom Walls */}
                <mesh position={[0.8, 0, 3.4]} castShadow>
                  <boxGeometry args={[3.4, floorHeight, 0.25]} />
                  <meshStandardMaterial color={colors.ivory} roughness={0.6} />
                </mesh>
                {/* Wrap-around Corner Balcony */}
                <mesh position={[-1.6, -floorHeight / 2 + 0.45, 3.9]} castShadow>
                  <boxGeometry args={[2.8, 0.75, 0.04]} />
                  <meshStandardMaterial
                    color="#A2C8E0"
                    transparent
                    opacity={0.65}
                    roughness={0.1}
                    metalness={0.7}
                  />
                </mesh>
                <mesh position={[-3.0, -floorHeight / 2 + 0.45, 2.6]} castShadow>
                  <boxGeometry args={[0.04, 0.75, 2.6]} />
                  <meshStandardMaterial
                    color="#A2C8E0"
                    transparent
                    opacity={0.65}
                    roughness={0.1}
                    metalness={0.7}
                  />
                </mesh>
                {/* Modern Geometric Canopy Frame Above Balcony */}
                <mesh position={[-1.6, floorHeight / 2 - 0.05, 3.9]}>
                  <boxGeometry args={[3.0, 0.08, 1.2]} />
                  <meshStandardMaterial color={colors.champagne} metalness={0.8} />
                </mesh>
                {/* Warm Interior Light */}
                <pointLight position={[-0.5, 0.2, 1.5]} intensity={1.5} color="#FFDCA8" distance={5.0} />
              </group>
            )}

            {/* Exterior Side Walls */}
            {currentMode !== "construction" && (
              <group position={[0, floorHeight / 2, 0]}>
                <mesh position={[houseWidth / 2, 0, 0]} castShadow>
                  <boxGeometry args={[0.22, floorHeight, houseDepth]} />
                  <meshStandardMaterial color={colors.ivory} roughness={0.6} />
                </mesh>
                <mesh position={[-houseWidth / 2, 0, -1.0]} castShadow>
                  <boxGeometry args={[0.22, floorHeight, houseDepth - 2.0]} />
                  <meshStandardMaterial color={colors.ivory} roughness={0.6} />
                </mesh>
              </group>
            )}
          </group>
        );
      })}

      {/* ======================================================== */}
      {/* 4. ROOFTOP OPEN TERRACE & WOODEN PERGOLA                 */}
      {/* ======================================================== */}
      <group
        position={[
          0,
          groundHeight +
            totalUpperFloors * floorHeight +
            totalUpperFloors * explodeOffset,
          0,
        ]}
      >
        {/* Terrace Floor Slab */}
        <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
          <boxGeometry args={[houseWidth + 0.1, 0.18, houseDepth + 0.1]} />
          <meshStandardMaterial
            color={currentMode === "completed" ? "#22262B" : colors.concrete}
            roughness={0.7}
          />
        </mesh>

        {currentMode !== "construction" && (
          <group position={[0, 0, 0]}>
            {/* Parapet Wall Around Terrace */}
            <mesh position={[0, 0.4, 3.5]} castShadow>
              <boxGeometry args={[houseWidth, 0.65, 0.18]} />
              <meshStandardMaterial color={colors.ivory} roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.4, -3.5]} castShadow>
              <boxGeometry args={[houseWidth, 0.65, 0.18]} />
              <meshStandardMaterial color={colors.ivory} roughness={0.6} />
            </mesh>
            <mesh position={[houseWidth / 2, 0.4, 0]} castShadow>
              <boxGeometry args={[0.18, 0.65, houseDepth]} />
              <meshStandardMaterial color={colors.ivory} roughness={0.6} />
            </mesh>
            <mesh position={[-houseWidth / 2, 0.4, 0]} castShadow>
              <boxGeometry args={[0.18, 0.65, houseDepth]} />
              <meshStandardMaterial color={colors.ivory} roughness={0.6} />
            </mesh>

            {/* Staircase Headroom (Mumty) */}
            <mesh position={[1.4, 0.8, -2.0]} castShadow>
              <boxGeometry args={[2.0, 1.4, 1.8]} />
              <meshStandardMaterial color={colors.charcoal} roughness={0.5} />
            </mesh>

            {/* Contemporary Wooden Pergola Canopy Over Terrace */}
            <group position={[-0.8, 1.0, 1.0]}>
              {/* Pergola Columns */}
              {[-1.2, 1.2].map((px) =>
                [-1.0, 1.0].map((pz) => (
                  <mesh key={`perg-col-${px}-${pz}`} position={[px, -0.45, pz]}>
                    <boxGeometry args={[0.08, 0.9, 0.08]} />
                    <meshStandardMaterial color={colors.teakWood} roughness={0.4} />
                  </mesh>
                ))
              )}
              {/* Horizontal Wooden Pergola Slats */}
              {[-0.8, -0.4, 0, 0.4, 0.8].map((pz) => (
                <mesh key={`p-slat-${pz}`} position={[0, 0.05, pz]}>
                  <boxGeometry args={[2.6, 0.06, 0.1]} />
                  <meshStandardMaterial color={colors.teakWood} roughness={0.4} />
                </mesh>
              ))}
            </group>

            {/* Terrace Garden Planters with Lush Greenery */}
            {[-2.4, 0.8].map((gx) => (
              <group key={`t-planter-${gx}`} position={[gx, 0.25, 3.1]}>
                <mesh castShadow>
                  <boxGeometry args={[1.0, 0.45, 0.4]} />
                  <meshStandardMaterial color={colors.champagne} metalness={0.7} />
                </mesh>
                <mesh position={[0, 0.3, 0]}>
                  <sphereGeometry args={[0.25, 8, 8]} />
                  <meshStandardMaterial color="#3E6B48" roughness={0.9} />
                </mesh>
              </group>
            ))}
          </group>
        )}
      </group>
    </group>
  );
}
