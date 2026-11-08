"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface ApartmentG4BuildingProps {
  stage?: number; // 1 to 6
  exploded?: boolean;
  lightingMode?: "dusk" | "blueprint" | "day";
}

/**
 * Premium Architectural Visualization: Multi-Story Residential Apartment Demonstration Model
 *
 * Visual Standard & Engineering Details:
 * 1. Architectural Elevation:
 *    - Deep recessed balconies with top ceiling soffits and recessed LED downlights.
 *    - Projecting cantilevered architectural picture-frame boxes around bedroom windows with black granite sills.
 *    - Laminated tempered glass balustrades with continuous aluminum base shoe channel and brushed metal handrail.
 *    - Integrated architectural balcony planter troughs with trailing green foliage.
 *    - Authentic materials: warm ivory plaster, exposed architectural concrete, charcoal feature bands, natural teak wood battens.
 * 2. Occupied Residential Windows & Interiors:
 *    - Reflective glazing with warm interior illumination.
 *    - 3-track sliding French door profiles with handle hardware and transom divisions.
 *    - Sheer off-white drapery/curtain meshes hanging on interior window flanks.
 * 3. Ground Floor Stilt Parking:
 *    - Interlocking driveway paver layout with thermoplastic yellow parking bay striping.
 *    - Rubber wheel curb stoppers with reflective markings.
 *    - 3 Dedicated vehicles: Silver/Pearl White Metallic Luxury SUV, Executive Dark Charcoal Sedan, and an Indian EV Scooter.
 *    - Glazed entrance lobby with double glass doors, stainless steel D-handles, granite entrance steps, and accessibility ramp.
 *    - Dedicated security cabin with viewing window and access control boom barrier.
 *    - Perimeter boundary wall with teak louvers, backlit building identity plaque ("VCUBE AURA RESIDENCES"), and pillar lanterns.
 * 4. Landscaping:
 *    - Two proportional architectural trees with sculpted natural wood trunks and multi-tiered foliage canopies.
 *    - Landscape uplight spots illuminating the tree canopies.
 *    - Layered planter beds with golden duranta hedges and flowering bougainvillea shrubs.
 *    - Stepping stone walkway set into manicured green lawn grass.
 * 5. Rooftop Terrace & Services:
 *    - Stepped coping stone parapet walls with drip-edge reveals.
 *    - Overhead cylindrical water tank on elevated 4-column RCC stilt frame with ladder and downpipe manifold.
 *    - Staircase headroom (mumty room) with weather door and ventilation louvers.
 *    - Architectural timber pergola casting dynamic shadow patterns.
 * 6. Coordinated 6-Stage Construction Sequence + Exploded Slabs inspection.
 */
export function ApartmentG4Building({
  stage = 6,
  exploded = false,
  lightingMode = "dusk",
}: ApartmentG4BuildingProps) {
  const groupRef = useRef<THREE.Group>(null);

  const explodeOffset = exploded ? 0.95 : 0;
  const currentStage = Math.max(1, Math.min(6, stage));

  // Architectural Proportions for Demonstration Model (1 unit ~ 1.4 meters)
  const buildingWidth = 8.4;
  const buildingDepth = 7.8;
  const stiltHeight = 1.45;
  const floorHeight = 1.35;
  const totalResidentialFloors = 4;

  // 3x3 Structural Column Grid (9 RCC Columns)
  const columnPositions: [number, number][] = useMemo(
    () => [
      [-3.2, -2.8], [0, -2.8], [3.2, -2.8],
      [-3.2, 0],    [0, 0],    [3.2, 0],
      [-3.2, 2.8],  [0, 2.8],  [3.2, 2.8],
    ],
    []
  );

  // Sophisticated Architectural Materials & Colors (Avoiding excessive gold)
  const materials = useMemo(() => {
    return {
      // Ground, Soil, Paving & Driveway
      soil: new THREE.MeshStandardMaterial({ color: "#261E16", roughness: 0.95 }),
      gravel: new THREE.MeshStandardMaterial({ color: "#3D3833", roughness: 0.9 }),
      pavingGround: new THREE.MeshStandardMaterial({ color: "#181B1E", roughness: 0.85 }),
      drivewayPavers: new THREE.MeshStandardMaterial({ color: "#282D33", roughness: 0.8 }),
      drivewayPaverAccent: new THREE.MeshStandardMaterial({ color: "#363C44", roughness: 0.75 }),
      lawnGrass: new THREE.MeshStandardMaterial({ color: "#2E4D29", roughness: 0.9 }),
      curbStone: new THREE.MeshStandardMaterial({ color: "#454C54", roughness: 0.75 }),
      parkingStripeYellow: new THREE.MeshStandardMaterial({
        color: "#E2AD28",
        emissive: "#996F10",
        emissiveIntensity: 0.35,
        roughness: 0.5,
      }),
      wheelStopRubber: new THREE.MeshStandardMaterial({ color: "#1C1E21", roughness: 0.85 }),

      // Concrete & RCC Structural Elements
      concreteRaw: new THREE.MeshStandardMaterial({ color: "#4E555C", roughness: 0.85, metalness: 0.05 }),
      concreteSmooth: new THREE.MeshStandardMaterial({ color: "#636B73", roughness: 0.7, metalness: 0.05 }),
      concreteSlabDark: new THREE.MeshStandardMaterial({ color: "#24282D", roughness: 0.6, metalness: 0.08 }),
      concreteFooting: new THREE.MeshStandardMaterial({ color: "#3B4148", roughness: 0.85 }),

      // Steel Reinforcement TMT Rebar
      rebarSteel: new THREE.MeshStandardMaterial({ color: "#C6893F", roughness: 0.35, metalness: 0.85 }),
      rebarDark: new THREE.MeshStandardMaterial({ color: "#6A6E75", roughness: 0.4, metalness: 0.8 }),

      // Masonry & Undercoat Finishing
      brickRed: new THREE.MeshStandardMaterial({ color: "#A34835", roughness: 0.88 }),
      aacBlock: new THREE.MeshStandardMaterial({ color: "#B4B8BC", roughness: 0.82 }),
      plasterGrey: new THREE.MeshStandardMaterial({ color: "#C8CCD0", roughness: 0.75 }),
      conduitOrange: new THREE.MeshStandardMaterial({ color: "#E65100", roughness: 0.3 }),
      conduitBlue: new THREE.MeshStandardMaterial({ color: "#0288D1", roughness: 0.3 }),

      // Turnkey Architectural Elevation
      wallIvory: new THREE.MeshStandardMaterial({ color: "#F2EFEB", roughness: 0.72, metalness: 0.02 }),
      wallAccentCharcoal: new THREE.MeshStandardMaterial({ color: "#1D2024", roughness: 0.55, metalness: 0.12 }),
      wallRevealGroove: new THREE.MeshStandardMaterial({ color: "#D2CEC6", roughness: 0.85 }),
      woodTeak: new THREE.MeshStandardMaterial({ color: "#8A522C", roughness: 0.48, metalness: 0.04 }),
      woodDarkTeak: new THREE.MeshStandardMaterial({ color: "#5A3318", roughness: 0.48, metalness: 0.04 }),

      // Windows, Glazing & Railings
      windowFrameDark: new THREE.MeshStandardMaterial({ color: "#121518", roughness: 0.35, metalness: 0.75 }),
      windowSillGranite: new THREE.MeshStandardMaterial({ color: "#222529", roughness: 0.4, metalness: 0.25 }),
      balconyGlass: new THREE.MeshStandardMaterial({
        color: "#7DA6C2",
        transparent: true,
        opacity: 0.55,
        roughness: 0.08,
        metalness: 0.35,
      }),
      balconyShoeMetal: new THREE.MeshStandardMaterial({ color: "#2B2E33", roughness: 0.3, metalness: 0.85 }),
      railingBronzeMetal: new THREE.MeshStandardMaterial({ color: "#33373D", roughness: 0.3, metalness: 0.85 }),
      railingChampagneAccent: new THREE.MeshStandardMaterial({ color: "#9C8259", roughness: 0.35, metalness: 0.8 }),
      windowGlassLit: new THREE.MeshStandardMaterial({
        color: "#FFE3B0",
        emissive: "#FFAA33",
        emissiveIntensity: lightingMode === "day" ? 0.2 : 0.6,
        transparent: true,
        opacity: 0.82,
        roughness: 0.18,
      }),
      interiorCurtains: new THREE.MeshStandardMaterial({ color: "#FAF7F2", roughness: 0.9 }),
      interiorRoomBack: new THREE.MeshStandardMaterial({ color: "#2A2016", roughness: 0.8 }),

      // Landscaping & Flora
      foliageDeepGreen: new THREE.MeshStandardMaterial({ color: "#234E28", roughness: 0.85 }),
      foliageGoldenDuranta: new THREE.MeshStandardMaterial({ color: "#4C7328", roughness: 0.8 }),
      foliageFlowering: new THREE.MeshStandardMaterial({ color: "#8B3A4C", roughness: 0.8 }),
      treeTrunk: new THREE.MeshStandardMaterial({ color: "#443224", roughness: 0.85 }),

      // Vehicles & Details
      carMetallicSilver: new THREE.MeshStandardMaterial({ color: "#D2D6DC", roughness: 0.25, metalness: 0.85 }),
      carMetallicCharcoal: new THREE.MeshStandardMaterial({ color: "#24282F", roughness: 0.28, metalness: 0.75 }),
      scooterMint: new THREE.MeshStandardMaterial({ color: "#319795", roughness: 0.35, metalness: 0.6 }),
      carGlass: new THREE.MeshStandardMaterial({ color: "#12151A", roughness: 0.1, metalness: 0.95 }),
      carTire: new THREE.MeshStandardMaterial({ color: "#101214", roughness: 0.95 }),
      carAlloy: new THREE.MeshStandardMaterial({ color: "#BAC0C7", roughness: 0.25, metalness: 0.85 }),
      waterTankPoly: new THREE.MeshStandardMaterial({ color: "#1F242A", roughness: 0.5, metalness: 0.3 }),

      // Emissive Lights
      lightWarmEmissive: new THREE.MeshBasicMaterial({ color: "#FFE8A3" }),
      lightSconceCone: new THREE.MeshBasicMaterial({ color: "#FFE8A3", transparent: true, opacity: 0.15 }),
    };
  }, [lightingMode]);

  return (
    <group ref={groupRef} position={[0, -3.2, 0]}>
      {/* ======================================================== */}
      {/* 1. PLOT SITE, GROUND LEVEL & FOUNDATIONS                 */}
      {/* ======================================================== */}
      <group position={[0, 0, 0]}>
        {/* Plot Ground Base */}
        <mesh position={[0, -0.25, 0]} receiveShadow material={currentStage === 1 ? materials.soil : materials.pavingGround}>
          <boxGeometry args={[12.6, 0.4, 12.0]} />
        </mesh>

        {/* Outer Perimeter Curb */}
        <mesh position={[0, -0.05, 0]} receiveShadow material={materials.curbStone}>
          <boxGeometry args={[11.8, 0.1, 11.2]} />
        </mesh>

        {/* ======================================================== */}
        {/* STAGE 1: FOUNDATION AND PLINTH                           */}
        {/* ======================================================== */}
        {currentStage === 1 && (
          <group position={[0, 0, 0]}>
            {/* Survey Grid & Centerline Marking */}
            <gridHelper args={[10.5, 12, "#9C8259", "#454C54"]} position={[0, 0.02, 0]} />

            {/* Excavated Plinth Beams connecting columns */}
            {[-3.2, 0, 3.2].map((x) => (
              <mesh key={`plinth-x-${x}`} position={[x, 0.16, 0]} material={materials.concreteRaw}>
                <boxGeometry args={[0.38, 0.32, 6.2]} />
              </mesh>
            ))}
            {[-2.8, 0, 2.8].map((z) => (
              <mesh key={`plinth-z-${z}`} position={[0, 0.16, z]} material={materials.concreteRaw}>
                <boxGeometry args={[6.8, 0.32, 0.38]} />
              </mesh>
            ))}

            {/* Stepped Isolated RCC Footing Pads & Starter Rebar Dowels */}
            {columnPositions.map(([x, z], idx) => (
              <group key={`footing-${idx}`} position={[x, 0, z]}>
                {/* PCC Bed */}
                <mesh position={[0, 0.05, 0]} material={materials.gravel}>
                  <boxGeometry args={[1.2, 0.1, 1.2]} />
                </mesh>
                {/* Trapezoidal RCC Footing Base */}
                <mesh position={[0, 0.18, 0]} material={materials.concreteFooting}>
                  <boxGeometry args={[0.95, 0.18, 0.95]} />
                </mesh>
                {/* Footing pedestal stub */}
                <mesh position={[0, 0.38, 0]} material={materials.concreteRaw}>
                  <boxGeometry args={[0.48, 0.22, 0.48]} />
                </mesh>
                {/* Protruding TMT Rebar starter dowels (4 vertical rods) */}
                {[-0.14, 0.14].map((rx) =>
                  [-0.14, 0.14].map((rz) => (
                    <mesh key={`rebar-rod-${rx}-${rz}`} position={[rx, 0.85, rz]} material={materials.rebarSteel}>
                      <cylinderGeometry args={[0.02, 0.02, 0.75, 8]} />
                    </mesh>
                  ))
                )}
                {/* Rebar stirrup rings */}
                {[0.6, 0.78, 0.96].map((sy) => (
                  <mesh key={`ring-${sy}`} position={[0, sy, 0]} material={materials.rebarSteel}>
                    <boxGeometry args={[0.34, 0.02, 0.34]} />
                  </mesh>
                ))}
              </group>
            ))}

            {/* Boundary Survey Pegs with Red-and-White markers */}
            {[-5.2, 5.2].map((px) =>
              [-4.9, 4.9].map((pz) => (
                <group key={`survey-peg-${px}-${pz}`} position={[px, 0.25, pz]}>
                  <mesh material={materials.woodTeak}>
                    <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
                  </mesh>
                  <mesh position={[0, 0.26, 0]} material={materials.rebarSteel}>
                    <sphereGeometry args={[0.06, 8, 8]} />
                  </mesh>
                </group>
              ))
            )}
          </group>
        )}
      </group>

      {/* ======================================================== */}
      {/* 2. GROUND FLOOR: STILT PARKING & ENTRANCE FOYER          */}
      {/* ======================================================== */}
      {currentStage >= 2 && (
        <group position={[0, 0, 0]}>
          {/* Ground Stilt Concrete Slab (Stages 3+) */}
          {currentStage >= 3 && (
            <mesh position={[0, 0.08, 0]} receiveShadow material={currentStage === 6 ? materials.drivewayPavers : materials.concreteRaw}>
              <boxGeometry args={[buildingWidth + 0.3, 0.16, buildingDepth + 0.3]} />
            </mesh>
          )}

          {/* Stilt Columns (Stages 2+) */}
          {columnPositions.map(([x, z], idx) => (
            <group key={`stilt-col-${idx}`} position={[x, stiltHeight / 2, z]}>
              <mesh castShadow receiveShadow material={currentStage >= 6 ? materials.wallIvory : materials.concreteRaw}>
                <boxGeometry args={[0.44, stiltHeight, 0.44]} />
              </mesh>

              {/* Stage 2 Shuttering / Formwork Props */}
              {currentStage === 2 && (
                <group>
                  <mesh material={materials.woodTeak}>
                    <boxGeometry args={[0.5, stiltHeight * 0.7, 0.5]} />
                  </mesh>
                  {[-0.2, 0.2].map((cy) => (
                    <mesh key={`clamp-${cy}`} position={[0, cy, 0]} material={materials.rebarDark}>
                      <boxGeometry args={[0.56, 0.04, 0.56]} />
                    </mesh>
                  ))}
                </group>
              )}
            </group>
          ))}

          {/* Entrance Lobby & Security Room Enclosure (Stages 4+) */}
          {currentStage >= 4 && (
            <group position={[2.7, stiltHeight / 2, -2.2]}>
              <mesh
                castShadow
                receiveShadow
                material={
                  currentStage === 4
                    ? materials.brickRed
                    : currentStage === 5
                    ? materials.plasterGrey
                    : materials.wallIvory
                }
              >
                <boxGeometry args={[1.9, stiltHeight, 1.8]} />
              </mesh>

              {/* Entrance Lobby Glass Door & Details in Stage 6 */}
              {currentStage === 6 && (
                <group position={[0, -0.05, 0.91]}>
                  {/* Outer Door Frame */}
                  <mesh material={materials.windowFrameDark}>
                    <boxGeometry args={[1.0, 1.25, 0.06]} />
                  </mesh>
                  {/* Clear Glass Door */}
                  <mesh position={[0, 0, 0.01]} material={materials.balconyGlass}>
                    <boxGeometry args={[0.88, 1.15, 0.02]} />
                  </mesh>
                  {/* Stainless Steel Vertical D-Pull Handles */}
                  <mesh position={[0.32, 0, 0.04]} material={materials.railingBronzeMetal}>
                    <cylinderGeometry args={[0.015, 0.015, 0.35, 8]} />
                  </mesh>
                  {/* Lobby Warm Interior Glow */}
                  <pointLight position={[0, 0.2, -0.6]} intensity={1.5} color="#FFE199" distance={3.5} />
                  {/* Polished Granite Entrance Steps */}
                  <mesh position={[0, -stiltHeight / 2 + 0.1, 0.35]} material={materials.windowSillGranite}>
                    <boxGeometry args={[1.2, 0.14, 0.6]} />
                  </mesh>
                  {/* Accessibility Ramp with Brushed Handrail */}
                  <mesh position={[-0.75, -stiltHeight / 2 + 0.07, 0.35]} rotation={[0.08, 0, 0]} material={materials.concreteSmooth}>
                    <boxGeometry args={[0.45, 0.1, 0.65]} />
                  </mesh>
                  <mesh position={[-0.95, -stiltHeight / 2 + 0.35, 0.35]} material={materials.railingBronzeMetal}>
                    <boxGeometry args={[0.03, 0.45, 0.6]} />
                  </mesh>
                  {/* Security Intercom / Access Keypad Panel */}
                  <mesh position={[0.55, 0.1, 0.02]} material={materials.wallAccentCharcoal}>
                    <boxGeometry args={[0.1, 0.22, 0.03]} />
                  </mesh>
                </group>
              )}
            </group>
          )}

          {/* ======================================================== */}
          {/* STAGE 6 COMPLETED GROUND FLOOR: VEHICLES & LANDSCAPING   */}
          {/* ======================================================== */}
          {currentStage === 6 && (
            <group position={[0, 0.1, 0]}>
              {/* Driveway Paver Floor Bands */}
              {[-1.5, 0, 1.5].map((pz) => (
                <mesh key={`pave-band-${pz}`} position={[0, 0.005, pz]} material={materials.drivewayPaverAccent}>
                  <boxGeometry args={[buildingWidth, 0.005, 0.1]} />
                </mesh>
              ))}

              {/* 3 Dedicated Parking Bays with Markings & Wheel Stops */}
              {/* Bay 1: Left Bay (-2.2) */}
              <group position={[-2.2, 0.01, 0.7]}>
                <mesh material={materials.concreteSlabDark}>
                  <boxGeometry args={[1.5, 0.01, 3.1]} />
                </mesh>
                {/* Yellow Stripe Demarcations */}
                {[-0.72, 0.72].map((sx) => (
                  <mesh key={`b1-stripe-${sx}`} position={[sx, 0.015, 0]} material={materials.parkingStripeYellow}>
                    <boxGeometry args={[0.06, 0.008, 3.0]} />
                  </mesh>
                ))}
                {/* Heavy-Duty Rubber Wheel Stop Curb */}
                <mesh position={[0, 0.04, -1.25]} material={materials.wheelStopRubber}>
                  <boxGeometry args={[0.85, 0.06, 0.12]} />
                </mesh>
              </group>

              {/* Bay 2: Center-Right Bay (0.5) */}
              <group position={[0.5, 0.01, 0.7]}>
                <mesh material={materials.concreteSlabDark}>
                  <boxGeometry args={[1.5, 0.01, 3.1]} />
                </mesh>
                {[-0.72, 0.72].map((sx) => (
                  <mesh key={`b2-stripe-${sx}`} position={[sx, 0.015, 0]} material={materials.parkingStripeYellow}>
                    <boxGeometry args={[0.06, 0.008, 3.0]} />
                  </mesh>
                ))}
                <mesh position={[0, 0.04, -1.25]} material={materials.wheelStopRubber}>
                  <boxGeometry args={[0.85, 0.06, 0.12]} />
                </mesh>
              </group>

              {/* Bay 3: Dedicated Two-Wheeler Bay (2.0) */}
              <group position={[2.0, 0.01, 0.7]}>
                <mesh material={materials.concreteSlabDark}>
                  <boxGeometry args={[1.0, 0.01, 2.2]} />
                </mesh>
                {[-0.48, 0.48].map((sx) => (
                  <mesh key={`b3-stripe-${sx}`} position={[sx, 0.015, 0]} material={materials.parkingStripeYellow}>
                    <boxGeometry args={[0.05, 0.008, 2.1]} />
                  </mesh>
                ))}
              </group>

              {/* VEHICLE 1: Contemporary Luxury SUV (Pearl Silver Metallic) */}
              <group position={[-2.2, 0.44, 0.8]}>
                {/* Lower Chassis & Bumper */}
                <mesh position={[0, -0.15, 0]} material={materials.wallAccentCharcoal}>
                  <boxGeometry args={[1.36, 0.2, 2.5]} />
                </mesh>
                {/* Main Sculpted Body */}
                <mesh castShadow material={materials.carMetallicSilver}>
                  <boxGeometry args={[1.34, 0.45, 2.45]} />
                </mesh>
                {/* Cabin Greenhouse with Tinted Glass */}
                <mesh position={[0, 0.38, -0.15]} castShadow material={materials.carGlass}>
                  <boxGeometry args={[1.22, 0.42, 1.45]} />
                </mesh>
                {/* Dark Panoramic Glass Roof & Satin Roof Rails */}
                <mesh position={[0, 0.6, -0.15]} material={materials.windowFrameDark}>
                  <boxGeometry args={[1.1, 0.02, 1.3]} />
                </mesh>
                {[-0.56, 0.56].map((rx) => (
                  <mesh key={`suv-rail-${rx}`} position={[rx, 0.62, -0.15]} material={materials.railingBronzeMetal}>
                    <boxGeometry args={[0.03, 0.035, 1.25]} />
                  </mesh>
                ))}
                {/* 4 Wheels with Alloy Rims and Calipers */}
                {[-0.66, 0.66].map((wx) =>
                  [-0.75, 0.75].map((wz) => (
                    <group key={`suv-wheel-${wx}-${wz}`} position={[wx, -0.22, wz]}>
                      <mesh rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.21, 0.21, 0.16, 14]} />
                        <primitive object={materials.carTire} attach="material" />
                      </mesh>
                      <mesh rotation={[0, 0, Math.PI / 2]} position={[wx > 0 ? 0.01 : -0.01, 0, 0]}>
                        <cylinderGeometry args={[0.13, 0.13, 0.165, 10]} />
                        <primitive object={materials.carAlloy} attach="material" />
                      </mesh>
                    </group>
                  ))
                )}
                {/* LED Headlight Strips & Grille */}
                {[-0.45, 0.45].map((hx) => (
                  <mesh key={`suv-light-${hx}`} position={[hx, 0.08, 1.24]} material={materials.lightWarmEmissive}>
                    <boxGeometry args={[0.26, 0.09, 0.03]} />
                  </mesh>
                ))}
                <mesh position={[0, 0.05, 1.24]} material={materials.windowFrameDark}>
                  <boxGeometry args={[0.55, 0.12, 0.02]} />
                </mesh>
                {/* Side Mirrors */}
                {[-0.7, 0.7].map((mx) => (
                  <mesh key={`suv-mirror-${mx}`} position={[mx, 0.32, 0.45]} material={materials.carMetallicSilver}>
                    <boxGeometry args={[0.12, 0.08, 0.14]} />
                  </mesh>
                ))}
              </group>

              {/* VEHICLE 2: Executive Sedan (Metallic Charcoal) */}
              <group position={[0.5, 0.38, 0.8]}>
                {/* Lower Chassis */}
                <mesh position={[0, -0.12, 0]} material={materials.wallAccentCharcoal}>
                  <boxGeometry args={[1.32, 0.18, 2.45]} />
                </mesh>
                {/* Sleek Aerodynamic Body */}
                <mesh castShadow material={materials.carMetallicCharcoal}>
                  <boxGeometry args={[1.3, 0.38, 2.4]} />
                </mesh>
                {/* Sloping Greenhouse Cabin */}
                <mesh position={[0, 0.32, -0.12]} castShadow material={materials.carGlass}>
                  <boxGeometry args={[1.18, 0.34, 1.35]} />
                </mesh>
                {/* 4 Wheels */}
                {[-0.64, 0.64].map((wx) =>
                  [-0.72, 0.72].map((wz) => (
                    <group key={`sedan-wheel-${wx}-${wz}`} position={[wx, -0.18, wz]}>
                      <mesh rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.19, 0.19, 0.15, 14]} />
                        <primitive object={materials.carTire} attach="material" />
                      </mesh>
                      <mesh rotation={[0, 0, Math.PI / 2]} position={[wx > 0 ? 0.01 : -0.01, 0, 0]}>
                        <cylinderGeometry args={[0.12, 0.12, 0.155, 10]} />
                        <primitive object={materials.carAlloy} attach="material" />
                      </mesh>
                    </group>
                  ))
                )}
                {/* Sleek LED Headlights */}
                {[-0.42, 0.42].map((hx) => (
                  <mesh key={`sedan-light-${hx}`} position={[hx, 0.06, 1.21]} material={materials.lightWarmEmissive}>
                    <boxGeometry args={[0.24, 0.07, 0.02]} />
                  </mesh>
                ))}
                {/* Side Mirrors */}
                {[-0.68, 0.68].map((mx) => (
                  <mesh key={`sedan-mirror-${mx}`} position={[mx, 0.28, 0.42]} material={materials.carMetallicCharcoal}>
                    <boxGeometry args={[0.1, 0.07, 0.12]} />
                  </mesh>
                ))}
              </group>

              {/* VEHICLE 3: Modern Indian Electric Scooter (Mint Green) */}
              <group position={[2.0, 0.32, 0.7]}>
                {/* Scooter Main Body & Floorboard */}
                <mesh castShadow material={materials.scooterMint}>
                  <boxGeometry args={[0.3, 0.25, 0.85]} />
                </mesh>
                {/* Apron & Front Cowl */}
                <mesh position={[0, 0.2, 0.36]} rotation={[-0.2, 0, 0]} material={materials.scooterMint}>
                  <boxGeometry args={[0.26, 0.35, 0.12]} />
                </mesh>
                {/* LED Headlamp */}
                <mesh position={[0, 0.34, 0.4]} material={materials.lightWarmEmissive}>
                  <boxGeometry args={[0.14, 0.06, 0.02]} />
                </mesh>
                {/* Handlebars with Grips */}
                <mesh position={[0, 0.46, 0.32]} rotation={[0, 0, Math.PI / 2]} material={materials.windowFrameDark}>
                  <cylinderGeometry args={[0.018, 0.018, 0.42, 8]} />
                </mesh>
                {/* Contoured Black Seat */}
                <mesh position={[0, 0.18, -0.1]} material={materials.carTire}>
                  <boxGeometry args={[0.22, 0.08, 0.48]} />
                </mesh>
                {/* Wheels */}
                {[0.34, -0.32].map((wz, idx) => (
                  <mesh key={`scooter-wheel-${idx}`} position={[0, -0.15, wz]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.12, 0.12, 0.07, 12]} />
                    <primitive object={materials.carTire} attach="material" />
                  </mesh>
                ))}
              </group>

              {/* Front Boundary Compound Wall & Motorized Sliding Gate */}
              <group position={[0, 0, 4.6]}>
                {/* Left Compound Wall */}
                <mesh position={[-3.4, 0.5, 0]} castShadow receiveShadow material={materials.wallIvory}>
                  <boxGeometry args={[3.2, 1.0, 0.22]} />
                </mesh>
                {/* Horizontal Teak Louver Slat Inserts */}
                <mesh position={[-3.4, 0.5, 0.12]} material={materials.woodTeak}>
                  <boxGeometry args={[2.8, 0.65, 0.04]} />
                </mesh>

                {/* Right Compound Wall with Building Name Plaque */}
                <mesh position={[3.6, 0.5, 0]} castShadow receiveShadow material={materials.wallIvory}>
                  <boxGeometry args={[2.6, 1.0, 0.22]} />
                </mesh>
                {/* Stone Plaque Backing */}
                <mesh position={[3.6, 0.52, 0.12]} material={materials.wallAccentCharcoal}>
                  <boxGeometry args={[2.1, 0.42, 0.05]} />
                </mesh>
                {/* Backlit Name Plaque: VCUBE AURA RESIDENCES */}
                <mesh position={[3.6, 0.52, 0.15]} material={materials.railingChampagneAccent}>
                  <boxGeometry args={[1.8, 0.14, 0.02]} />
                </mesh>

                {/* Gate Pillars with Warm Lanterns */}
                {[-1.7, 2.2].map((gx) => (
                  <group key={`gate-pillar-${gx}`} position={[gx, 0.6, 0]}>
                    <mesh castShadow material={materials.wallAccentCharcoal}>
                      <boxGeometry args={[0.38, 1.25, 0.38]} />
                    </mesh>
                    <mesh position={[0, 0.66, 0]} material={materials.lightWarmEmissive}>
                      <boxGeometry args={[0.24, 0.08, 0.24]} />
                    </mesh>
                  </group>
                ))}

                {/* Modern Sliding Metal Gate with Teak Slats */}
                <group position={[0.25, 0.5, 0]}>
                  <mesh castShadow material={materials.windowFrameDark}>
                    <boxGeometry args={[3.7, 0.95, 0.06]} />
                  </mesh>
                  {[-0.3, -0.15, 0, 0.15, 0.3].map((ly) => (
                    <mesh key={`gate-slat-${ly}`} position={[0, ly, 0.04]} material={materials.woodTeak}>
                      <boxGeometry args={[3.5, 0.05, 0.02]} />
                    </mesh>
                  ))}
                </group>

                {/* Security Gate Guard Post / Boom Barrier */}
                <group position={[1.8, 0.45, -0.5]}>
                  <mesh material={materials.wallAccentCharcoal}>
                    <boxGeometry args={[0.24, 0.85, 0.24]} />
                  </mesh>
                  <mesh position={[-0.8, 0.35, 0]} rotation={[0, 0, -0.05]} material={materials.parkingStripeYellow}>
                    <boxGeometry args={[1.6, 0.06, 0.03]} />
                  </mesh>
                </group>
              </group>

              {/* Entrance Porch Canopy with Warm Downlights */}
              <group position={[2.7, stiltHeight - 0.05, -1.1]}>
                <mesh castShadow material={materials.wallAccentCharcoal}>
                  <boxGeometry args={[1.9, 0.08, 1.8]} />
                </mesh>
                <mesh position={[0, -0.045, 0]} material={materials.woodTeak}>
                  <boxGeometry args={[1.82, 0.02, 1.72]} />
                </mesh>
                {[-0.5, 0.5].map((cx) => (
                  <mesh key={`canopy-light-${cx}`} position={[cx, -0.056, 0]} material={materials.lightWarmEmissive}>
                    <cylinderGeometry args={[0.08, 0.08, 0.02, 12]} />
                  </mesh>
                ))}
              </group>

              {/* ======================================================== */}
              {/* LANDSCAPING: ARCHITECTURAL TREES, SHRUBS & LAWN PATH    */}
              {/* ======================================================== */}
              {/* Manicured Lawn Grass Patch */}
              <mesh position={[-4.5, -0.02, 2.5]} receiveShadow material={materials.lawnGrass}>
                <boxGeometry args={[2.2, 0.04, 3.8]} />
              </mesh>
              <mesh position={[4.6, -0.02, 2.5]} receiveShadow material={materials.lawnGrass}>
                <boxGeometry args={[1.8, 0.04, 3.8]} />
              </mesh>

              {/* Stepping Stone Pedestrian Pavers */}
              {[-4.6, -4.6, -4.6, -4.6].map((sx, idx) => (
                <mesh key={`step-stone-${idx}`} position={[sx, 0.015, 1.0 + idx * 0.9]} material={materials.drivewayPaverAccent}>
                  <boxGeometry args={[0.65, 0.03, 0.45]} />
                </mesh>
              ))}

              {/* TREE 1: Left Front Architectural Frangipani / Ornamental Tree */}
              <group position={[-4.5, 0, 3.8]}>
                {/* Curved Natural Wood Trunk */}
                <mesh position={[0, 0.65, 0]} rotation={[0.05, 0, 0.08]} castShadow material={materials.treeTrunk}>
                  <cylinderGeometry args={[0.09, 0.13, 1.3, 10]} />
                </mesh>
                <mesh position={[0.1, 1.4, 0.05]} rotation={[-0.1, 0, -0.15]} material={materials.treeTrunk}>
                  <cylinderGeometry args={[0.06, 0.09, 0.7, 8]} />
                </mesh>
                {/* Multi-Tiered Organic Foliage Clusters */}
                <mesh position={[0, 1.6, 0]} castShadow material={materials.foliageDeepGreen}>
                  <sphereGeometry args={[0.65, 10, 10]} />
                </mesh>
                <mesh position={[0.3, 1.9, 0.2]} castShadow material={materials.foliageGoldenDuranta}>
                  <sphereGeometry args={[0.45, 8, 8]} />
                </mesh>
                <mesh position={[-0.25, 1.75, -0.2]} castShadow material={materials.foliageDeepGreen}>
                  <sphereGeometry args={[0.48, 8, 8]} />
                </mesh>
                {/* Ground Landscape Uplight Spot */}
                <mesh position={[0.2, 0.05, 0.2]} rotation={[-0.5, 0, 0]} material={materials.lightWarmEmissive}>
                  <cylinderGeometry args={[0.04, 0.04, 0.08, 8]} />
                </mesh>
              </group>

              {/* TREE 2: Right Corner Accent Tree */}
              <group position={[4.6, 0, 3.8]}>
                <mesh position={[0, 0.7, 0]} rotation={[-0.06, 0, -0.07]} castShadow material={materials.treeTrunk}>
                  <cylinderGeometry args={[0.08, 0.12, 1.4, 10]} />
                </mesh>
                <mesh position={[0, 1.65, 0]} castShadow material={materials.foliageDeepGreen}>
                  <sphereGeometry args={[0.6, 10, 10]} />
                </mesh>
                <mesh position={[-0.25, 1.9, 0.15]} castShadow material={materials.foliageGoldenDuranta}>
                  <sphereGeometry args={[0.42, 8, 8]} />
                </mesh>
                <mesh position={[0.2, 0.05, 0.2]} rotation={[-0.5, 0, 0]} material={materials.lightWarmEmissive}>
                  <cylinderGeometry args={[0.04, 0.04, 0.08, 8]} />
                </mesh>
              </group>

              {/* Layered Perimeter Planter Boxes with Golden Duranta & Bougainvillea */}
              {[-5.1, 5.0].map((px) => (
                <group key={`land-planter-${px}`} position={[px, 0.3, 0.8]}>
                  <mesh castShadow material={materials.wallAccentCharcoal}>
                    <boxGeometry args={[0.85, 0.6, 1.8]} />
                  </mesh>
                  <mesh position={[0, 0.28, 0]} material={materials.soil}>
                    <boxGeometry args={[0.75, 0.06, 1.7]} />
                  </mesh>
                  {/* Dense Shrub Hedge */}
                  {[-0.5, 0, 0.5].map((sz) => (
                    <mesh key={`shrub-${px}-${sz}`} position={[0, 0.48, sz]} castShadow material={materials.foliageGoldenDuranta}>
                      <sphereGeometry args={[0.32, 8, 8]} />
                    </mesh>
                  ))}
                  {/* Flowering Accent Cluster */}
                  <mesh position={[0, 0.58, 0]} material={materials.foliageFlowering}>
                    <sphereGeometry args={[0.24, 7, 7]} />
                  </mesh>
                </group>
              ))}
            </group>
          )}
        </group>
      )}

      {/* ======================================================== */}
      {/* 3. CENTRAL STAIRCASE CORE (Dog-Legged RCC Staircase)     */}
      {/* ======================================================== */}
      {currentStage >= 3 && (
        <group position={[-0.2, 0, -2.8]}>
          {/* Staircase Shaft RCC Enclosure */}
          <mesh
            position={[
              0,
              (stiltHeight + totalResidentialFloors * floorHeight) / 2 +
                (totalResidentialFloors * explodeOffset) / 2,
              0,
            ]}
            castShadow
            receiveShadow
            material={
              currentStage === 3
                ? materials.concreteRaw
                : currentStage === 4
                ? materials.brickRed
                : currentStage === 5
                ? materials.plasterGrey
                : materials.wallAccentCharcoal
            }
          >
            <boxGeometry
              args={[
                2.4,
                stiltHeight + totalResidentialFloors * floorHeight + totalResidentialFloors * explodeOffset,
                1.9,
              ]}
            />
          </mesh>

          {/* Dog-Legged RCC Steps visible during construction stages 3 to 5 */}
          {currentStage <= 5 &&
            Array.from({ length: totalResidentialFloors + 1 }).map((_, fIdx) => {
              const yBase = stiltHeight + fIdx * (floorHeight + explodeOffset);
              return (
                <group key={`stair-flight-${fIdx}`} position={[0, yBase - 0.45, 0]}>
                  {/* Flight 1 Waist Slab */}
                  <mesh rotation={[0.48, 0, 0]} position={[0.45, 0, 0]} material={materials.concreteRaw}>
                    <boxGeometry args={[0.75, 0.1, 1.25]} />
                  </mesh>
                  {/* Flight 2 Waist Slab */}
                  <mesh rotation={[-0.48, 0, 0]} position={[-0.45, 0.45, 0]} material={materials.concreteRaw}>
                    <boxGeometry args={[0.75, 0.1, 1.25]} />
                  </mesh>
                </group>
              );
            })}

          {/* Stage 6: Vertical Louver Windows on Staircase Shaft */}
          {currentStage === 6 && (
            <group position={[0, (stiltHeight + totalResidentialFloors * floorHeight) / 2, -1.0]}>
              {Array.from({ length: totalResidentialFloors }).map((_, wIdx) => {
                const wy = stiltHeight + wIdx * floorHeight + floorHeight / 2;
                return (
                  <group key={`stair-window-${wIdx}`} position={[0, wy - ((stiltHeight + totalResidentialFloors * floorHeight) / 2), 0]}>
                    <mesh material={materials.windowFrameDark}>
                      <boxGeometry args={[0.9, 0.9, 0.08]} />
                    </mesh>
                    <mesh position={[0, 0, -0.01]} material={materials.windowGlassLit}>
                      <boxGeometry args={[0.8, 0.8, 0.02]} />
                    </mesh>
                    {[-0.2, 0, 0.2].map((ly) => (
                      <mesh key={`stair-louver-${ly}`} position={[0, ly, -0.04]} material={materials.woodTeak}>
                        <boxGeometry args={[0.78, 0.04, 0.02]} />
                      </mesh>
                    ))}
                  </group>
                );
              })}
            </group>
          )}
        </group>
      )}

      {/* ======================================================== */}
      {/* 4. UPPER RESIDENTIAL FLOORS DEMONSTRATION                  */}
      {/* ======================================================== */}
      {Array.from({ length: totalResidentialFloors }).map((_, floorIdx) => {
        const floorNum = floorIdx + 1;
        const yBase =
          stiltHeight +
          floorIdx * floorHeight +
          (floorIdx + 1) * explodeOffset;

        return (
          <group key={`residential-floor-${floorNum}`} position={[0, yBase, 0]}>
            {/* -------------------------------------------------- */}
            {/* A. CONCRETE FLOOR SLAB & BALCONY CANTILEVERS (3+)  */}
            {/* -------------------------------------------------- */}
            {currentStage >= 3 && (
              <group position={[0, 0, 0]}>
                {/* Main Suspended Structural Floor Slab */}
                <mesh position={[0, 0.08, 0]} castShadow receiveShadow material={currentStage >= 6 ? materials.concreteSlabDark : materials.concreteRaw}>
                  <boxGeometry args={[buildingWidth, 0.16, buildingDepth]} />
                </mesh>

                {/* Primary Front Balcony Cantilever Slab */}
                <mesh position={[1.5, 0.08, 4.05]} castShadow receiveShadow material={currentStage >= 6 ? materials.concreteSmooth : materials.concreteRaw}>
                  <boxGeometry args={[4.0, 0.16, 1.6]} />
                </mesh>

                {/* Left Bedroom Balcony Projection */}
                <mesh position={[-4.2, 0.08, 0.6]} castShadow receiveShadow material={currentStage >= 6 ? materials.concreteSmooth : materials.concreteRaw}>
                  <boxGeometry args={[1.3, 0.16, 3.4]} />
                </mesh>

                {/* Bevel Edge Band in Natural Concrete / Warm Charcoal (Stage 6) */}
                {currentStage === 6 && (
                  <mesh position={[1.5, 0.08, 4.87]} material={materials.wallAccentCharcoal}>
                    <boxGeometry args={[4.04, 0.06, 0.04]} />
                  </mesh>
                )}
              </group>
            )}

            {/* -------------------------------------------------- */}
            {/* B. RCC COLUMNS FOR THIS FLOOR (Stages 2+)          */}
            {/* -------------------------------------------------- */}
            {currentStage >= 2 && (
              <group position={[0, floorHeight / 2, 0]}>
                {columnPositions.map(([x, z], cIdx) => (
                  <group key={`rf-col-${floorNum}-${cIdx}`} position={[x, 0, z]}>
                    <mesh castShadow receiveShadow material={currentStage >= 6 ? materials.concreteSmooth : materials.concreteRaw}>
                      <boxGeometry args={[0.4, floorHeight, 0.4]} />
                    </mesh>

                    {/* Stage 2 Column Ring Ties */}
                    {currentStage === 2 && (
                      <group>
                        <mesh position={[0, 0.25, 0]} material={materials.rebarSteel}>
                          <boxGeometry args={[0.44, 0.03, 0.44]} />
                        </mesh>
                        <mesh position={[0, -0.25, 0]} material={materials.rebarSteel}>
                          <boxGeometry args={[0.44, 0.03, 0.44]} />
                        </mesh>
                      </group>
                    )}
                  </group>
                ))}
              </group>
            )}

            {/* -------------------------------------------------- */}
            {/* C. STAGE 4: BRICKWORK, WALLS & MASONRY OPENINGS   */}
            {/* -------------------------------------------------- */}
            {currentStage === 4 && (
              <group position={[0, floorHeight / 2, 0]}>
                {/* AAC Blockwork for Left Front Bedroom Wall */}
                <mesh position={[-2.5, 0, 3.65]} castShadow material={materials.aacBlock}>
                  <boxGeometry args={[2.8, floorHeight, 0.26]} />
                </mesh>
                {/* Window Opening Sill & Lintel Bands in RCC */}
                <mesh position={[-2.5, 0.42, 3.65]} material={materials.concreteRaw}>
                  <boxGeometry args={[1.8, 0.16, 0.28]} />
                </mesh>
                <mesh position={[-2.5, -0.42, 3.65]} material={materials.concreteRaw}>
                  <boxGeometry args={[1.8, 0.16, 0.28]} />
                </mesh>

                {/* Red Clay Brickwork for Balcony Parapet Base */}
                <mesh position={[1.5, -floorHeight / 2 + 0.4, 4.8]} castShadow material={materials.brickRed}>
                  <boxGeometry args={[3.8, 0.8, 0.22]} />
                </mesh>

                {/* Exterior Side Walls in AAC Blocks */}
                <mesh position={[3.95, 0, 0]} castShadow material={materials.aacBlock}>
                  <boxGeometry args={[0.26, floorHeight, buildingDepth]} />
                </mesh>
                <mesh position={[-3.95, 0, -1.8]} castShadow material={materials.aacBlock}>
                  <boxGeometry args={[0.26, floorHeight, 3.6]} />
                </mesh>
                {/* Rear Wall */}
                <mesh position={[0, 0, -3.7]} castShadow material={materials.aacBlock}>
                  <boxGeometry args={[buildingWidth, floorHeight, 0.26]} />
                </mesh>

                {/* Masonry Scaffolding / GI Pipe Staging Props */}
                {[-3.0, -1.2, 1.2, 3.0].map((sx) => (
                  <mesh key={`scaff-${floorNum}-${sx}`} position={[sx, 0, 5.0]} material={materials.rebarDark}>
                    <cylinderGeometry args={[0.03, 0.03, floorHeight, 8]} />
                  </mesh>
                ))}
              </group>
            )}

            {/* -------------------------------------------------- */}
            {/* D. STAGE 5: ELECTRICAL CONDUITS, PLASTER & TILES   */}
            {/* -------------------------------------------------- */}
            {currentStage === 5 && (
              <group position={[0, floorHeight / 2, 0]}>
                {/* Cement Plastered Walls (Grey base coat) */}
                <mesh position={[-2.5, 0, 3.65]} castShadow material={materials.plasterGrey}>
                  <boxGeometry args={[2.8, floorHeight, 0.28]} />
                </mesh>
                <mesh position={[3.95, 0, 0]} castShadow material={materials.plasterGrey}>
                  <boxGeometry args={[0.28, floorHeight, buildingDepth]} />
                </mesh>
                <mesh position={[0, 0, -3.7]} castShadow material={materials.plasterGrey}>
                  <boxGeometry args={[buildingWidth, floorHeight, 0.28]} />
                </mesh>

                {/* Concealed Fire-Retardant PVC Conduits (Orange Power & Blue Telecom) */}
                <mesh position={[-2.5, 0.1, 3.82]} material={materials.conduitOrange}>
                  <cylinderGeometry args={[0.02, 0.02, floorHeight - 0.2, 8]} />
                </mesh>
                <mesh position={[-1.8, 0.25, 3.82]} rotation={[0, 0, Math.PI / 2]} material={materials.conduitOrange}>
                  <cylinderGeometry args={[0.02, 0.02, 1.3, 8]} />
                </mesh>
                <mesh position={[-2.3, -0.15, 3.82]} rotation={[0, 0, Math.PI / 2]} material={materials.conduitBlue}>
                  <cylinderGeometry args={[0.02, 0.02, 0.9, 8]} />
                </mesh>

                {/* UPVC Window Frame installed in opening */}
                <mesh position={[-2.5, 0, 3.8]} material={materials.windowFrameDark}>
                  <boxGeometry args={[1.7, 0.85, 0.08]} />
                </mesh>

                {/* Vitrified Floor Tiles Laid on Slab */}
                <mesh position={[0, -floorHeight / 2 + 0.09, 0]} material={materials.wallIvory}>
                  <boxGeometry args={[buildingWidth - 0.2, 0.02, buildingDepth - 0.2]} />
                </mesh>

                {/* False Ceiling Perimeter Drop Channel Grid */}
                <group position={[0, floorHeight / 2 - 0.1, 0]}>
                  {[-2.0, 0, 2.0].map((cx) => (
                    <mesh key={`grid-chan-${cx}`} position={[cx, 0, 0]} material={materials.rebarDark}>
                      <boxGeometry args={[0.04, 0.04, 6.4]} />
                    </mesh>
                  ))}
                </group>
              </group>
            )}

            {/* -------------------------------------------------- */}
            {/* E. STAGE 6: COMPLETED ARCHITECTURAL ELEVATION     */}
            {/* -------------------------------------------------- */}
            {currentStage === 6 && (
              <group position={[0, floorHeight / 2, 0]}>
                {/* 1. Main Left Facade Wall (Warm Ivory Stucco Plaster) */}
                <mesh position={[-2.6, 0, 3.65]} castShadow receiveShadow material={materials.wallIvory}>
                  <boxGeometry args={[2.7, floorHeight - 0.02, 0.3]} />
                </mesh>

                {/* Horizontal Architectural Reveal Shadow V-Groove */}
                <mesh position={[-2.6, 0.35, 3.81]} material={materials.wallRevealGroove}>
                  <boxGeometry args={[2.65, 0.02, 0.02]} />
                </mesh>
                <mesh position={[-2.6, -0.35, 3.81]} material={materials.wallRevealGroove}>
                  <boxGeometry args={[2.65, 0.02, 0.02]} />
                </mesh>

                {/* 2. Architectural Accent: Projecting Teak Wood / HPL Picture-Frame Box */}
                <group position={[-2.6, 0, 3.88]}>
                  {/* Outer Teak Frame Protrusion */}
                  <mesh castShadow material={materials.woodTeak}>
                    <boxGeometry args={[1.9, 1.0, 0.14]} />
                  </mesh>
                  {/* Recessed Dark UPVC Window Outer Casing */}
                  <mesh position={[0, 0, 0.04]} material={materials.windowFrameDark}>
                    <boxGeometry args={[1.68, 0.82, 0.06]} />
                  </mesh>
                  {/* Reflective Warm Illuminated Glazing */}
                  <mesh position={[0, 0, 0.06]} material={materials.windowGlassLit}>
                    <boxGeometry args={[1.56, 0.72, 0.02]} />
                  </mesh>
                  {/* Window Center Vertical Mullion */}
                  <mesh position={[0, 0, 0.075]} material={materials.windowFrameDark}>
                    <boxGeometry args={[0.04, 0.72, 0.03]} />
                  </mesh>
                  {/* Sheer Interior Curtains on Both Window Flanks */}
                  {[-0.65, 0.65].map((cx) => (
                    <mesh key={`curtain-win-${floorNum}-${cx}`} position={[cx, 0, 0.02]} material={materials.interiorCurtains}>
                      <boxGeometry args={[0.26, 0.7, 0.03]} />
                    </mesh>
                  ))}
                  {/* Protruding Black Granite Window Sill with Drip Edge */}
                  <mesh position={[0, -0.45, 0.08]} material={materials.windowSillGranite}>
                    <boxGeometry args={[1.82, 0.05, 0.16]} />
                  </mesh>
                </group>

                {/* 3. Deep Recessed Balcony Niche & Glass French Sliding Doors */}
                {/* Balcony Ceiling Soffit with Warm Recessed LED Downlights */}
                <group position={[1.5, floorHeight / 2 - 0.04, 4.05]}>
                  <mesh material={materials.concreteSmooth}>
                    <boxGeometry args={[3.95, 0.08, 1.55]} />
                  </mesh>
                  {[-1.0, 1.0].map((dx) => (
                    <mesh key={`soffit-downlight-${floorNum}-${dx}`} position={[dx, -0.045, 0]} material={materials.lightWarmEmissive}>
                      <cylinderGeometry args={[0.06, 0.06, 0.015, 10]} />
                    </mesh>
                  ))}
                </group>

                {/* Balcony Return Privacy Side Walls */}
                <mesh position={[-0.45, 0, 4.05]} castShadow material={materials.wallAccentCharcoal}>
                  <boxGeometry args={[0.16, floorHeight - 0.02, 1.55]} />
                </mesh>
                <mesh position={[3.45, 0, 4.05]} castShadow material={materials.wallIvory}>
                  <boxGeometry args={[0.16, floorHeight - 0.02, 1.55]} />
                </mesh>

                {/* Balcony 3-Track UPVC Sliding French Doors */}
                <group position={[1.5, 0, 3.3]}>
                  {/* Outer Door Frame */}
                  <mesh material={materials.windowFrameDark}>
                    <boxGeometry args={[3.6, floorHeight - 0.08, 0.08]} />
                  </mesh>
                  {/* Top Transom Bar */}
                  <mesh position={[0, floorHeight / 2 - 0.28, 0.02]} material={materials.windowFrameDark}>
                    <boxGeometry args={[3.55, 0.04, 0.04]} />
                  </mesh>
                  {/* 3 Glazed Sliding Door Panels */}
                  {[-1.15, 0, 1.15].map((sx, idx) => (
                    <mesh key={`french-pane-${idx}`} position={[sx, -0.08, 0.02 + idx * 0.01]} material={materials.windowGlassLit}>
                      <boxGeometry args={[1.12, floorHeight - 0.34, 0.02]} />
                    </mesh>
                  ))}
                  {/* Vertical Sashes & Door Handle Hardware */}
                  {[-0.6, 0.6].map((hx) => (
                    <group key={`french-sash-${hx}`} position={[hx, -0.08, 0.04]}>
                      <mesh material={materials.windowFrameDark}>
                        <boxGeometry args={[0.05, floorHeight - 0.32, 0.04]} />
                      </mesh>
                      <mesh position={[hx > 0 ? -0.06 : 0.06, 0, 0.02]} material={materials.railingChampagneAccent}>
                        <cylinderGeometry args={[0.01, 0.01, 0.25, 8]} />
                      </mesh>
                    </group>
                  ))}
                  {/* Sheer White Curtains visible inside along the edges */}
                  {[-1.6, 1.6].map((cx) => (
                    <mesh key={`curtain-french-${cx}`} position={[cx, -0.05, -0.08]} material={materials.interiorCurtains}>
                      <boxGeometry args={[0.35, floorHeight - 0.2, 0.06]} />
                    </mesh>
                  ))}
                </group>

                {/* 4. Cantilevered Balcony Glass Balustrade & Railing System */}
                <group position={[1.5, -floorHeight / 2 + 0.48, 4.82]}>
                  {/* Continuous Aluminum Mounting Base Shoe Profile */}
                  <mesh position={[0, -0.4, 0]} material={materials.balconyShoeMetal}>
                    <boxGeometry args={[3.92, 0.08, 0.08]} />
                  </mesh>
                  {/* Toughened Laminated Balcony Glass Pane */}
                  <mesh castShadow material={materials.balconyGlass}>
                    <boxGeometry args={[3.9, 0.78, 0.035]} />
                  </mesh>
                  {/* Stainless Steel Vertical Intermediate Posts */}
                  {[-1.9, -0.95, 0, 0.95, 1.9].map((px) => (
                    <mesh key={`bal-post-${floorNum}-${px}`} position={[px, 0.02, 0.025]} material={materials.railingBronzeMetal}>
                      <boxGeometry args={[0.04, 0.82, 0.02]} />
                    </mesh>
                  ))}
                  {/* Continuous Top Graphite Handrail */}
                  <mesh position={[0, 0.43, 0]} material={materials.railingBronzeMetal}>
                    <boxGeometry args={[3.96, 0.05, 0.08]} />
                  </mesh>
                  {/* Stainless Steel Heavy-Duty Clamping Spigots */}
                  {[-1.5, -0.5, 0.5, 1.5].map((sx) => (
                    <mesh key={`spigot-main-${sx}`} position={[sx, -0.38, 0.03]} material={materials.railingChampagneAccent}>
                      <cylinderGeometry args={[0.025, 0.025, 0.1, 10]} />
                    </mesh>
                  ))}
                  {/* Balcony Return Glass Railing (Right side) */}
                  <mesh position={[1.93, 0, -0.75]} material={materials.balconyGlass}>
                    <boxGeometry args={[0.035, 0.78, 1.5]} />
                  </mesh>
                  <mesh position={[1.93, 0.43, -0.75]} material={materials.railingBronzeMetal}>
                    <boxGeometry args={[0.08, 0.05, 1.54]} />
                  </mesh>
                  <mesh position={[1.93, -0.4, -0.75]} material={materials.balconyShoeMetal}>
                    <boxGeometry args={[0.08, 0.08, 1.52]} />
                  </mesh>
                </group>

                {/* 5. Integrated Balcony Planter Trough with Trailing Green Foliage */}
                <group position={[3.1, -floorHeight / 2 + 0.38, 4.5]}>
                  {/* Charcoal Concrete Planter Box */}
                  <mesh material={materials.wallAccentCharcoal}>
                    <boxGeometry args={[0.55, 0.36, 0.35]} />
                  </mesh>
                  {/* Rich Potting Soil */}
                  <mesh position={[0, 0.16, 0]} material={materials.soil}>
                    <boxGeometry args={[0.48, 0.04, 0.28]} />
                  </mesh>
                  {/* Lush Foliage Bush */}
                  <mesh position={[0, 0.24, 0]} material={materials.foliageDeepGreen}>
                    <sphereGeometry args={[0.18, 7, 7]} />
                  </mesh>
                  {/* Trailing Creeping Ivy spilling slightly over the planter rim */}
                  <mesh position={[0, 0.12, 0.18]} material={materials.foliageGoldenDuranta}>
                    <boxGeometry args={[0.35, 0.2, 0.06]} />
                  </mesh>
                </group>

                {/* 6. Left Bedroom Balcony Glass Railing */}
                <group position={[-4.82, -floorHeight / 2 + 0.48, 0.6]}>
                  <mesh position={[0, -0.4, 0]} material={materials.balconyShoeMetal}>
                    <boxGeometry args={[0.08, 0.08, 3.22]} />
                  </mesh>
                  <mesh castShadow material={materials.balconyGlass}>
                    <boxGeometry args={[0.035, 0.78, 3.2]} />
                  </mesh>
                  <mesh position={[0, 0.43, 0]} material={materials.railingBronzeMetal}>
                    <boxGeometry args={[0.08, 0.05, 3.26]} />
                  </mesh>
                  {[-1.2, 0, 1.2].map((sz) => (
                    <mesh key={`spigot-left-${sz}`} position={[0.03, -0.38, sz]} material={materials.railingChampagneAccent}>
                      <cylinderGeometry args={[0.025, 0.025, 0.1, 10]} />
                    </mesh>
                  ))}
                </group>

                {/* 7. Vertical Architectural Louvers (Brise-Soleil Screen) */}
                <group position={[-0.55, 0, 4.2]}>
                  {[-0.24, -0.08, 0.08, 0.24].map((lx) => (
                    <mesh key={`louver-${floorNum}-${lx}`} position={[lx, 0, 0]} castShadow material={materials.woodTeak}>
                      <boxGeometry args={[0.05, floorHeight + 0.02, 0.26]} />
                    </mesh>
                  ))}
                </group>

                {/* 8. Right & Rear Exterior Facade Walls */}
                <mesh position={[4.05, 0, 0]} castShadow receiveShadow material={materials.wallIvory}>
                  <boxGeometry args={[0.28, floorHeight - 0.02, buildingDepth]} />
                </mesh>
                {/* Side French Windows with Warm Glowing Glazing */}
                <group position={[4.2, 0, 1.2]}>
                  <mesh material={materials.windowFrameDark}>
                    <boxGeometry args={[0.06, 0.85, 1.9]} />
                  </mesh>
                  <mesh position={[0.01, 0, 0]} material={materials.windowGlassLit}>
                    <boxGeometry args={[0.02, 0.75, 1.8]} />
                  </mesh>
                  <mesh position={[0.04, -0.42, 0]} material={materials.windowSillGranite}>
                    <boxGeometry args={[0.1, 0.04, 1.95]} />
                  </mesh>
                </group>

                {/* Rear Facade Wall with Windows */}
                <mesh position={[0, 0, -3.75]} castShadow receiveShadow material={materials.wallIvory}>
                  <boxGeometry args={[buildingWidth, floorHeight - 0.02, 0.28]} />
                </mesh>

                {/* 9. Exterior Lighting: Cylindrical Up-Down Wall Sconces */}
                <group position={[-1.2, 0.1, 3.82]}>
                  <mesh material={materials.windowFrameDark}>
                    <cylinderGeometry args={[0.035, 0.035, 0.16, 10]} />
                  </mesh>
                  <mesh position={[0, 0.07, 0.01]} material={materials.lightWarmEmissive}>
                    <sphereGeometry args={[0.025, 6, 6]} />
                  </mesh>
                  <mesh position={[0, -0.07, 0.01]} material={materials.lightWarmEmissive}>
                    <sphereGeometry args={[0.025, 6, 6]} />
                  </mesh>
                </group>

                {/* 10. Soft Interior Room Light */}
                <pointLight
                  position={[1.2, 0.3, 1.5]}
                  intensity={lightingMode === "day" ? 0.7 : 1.7}
                  color="#FFD699"
                  distance={5.5}
                />
              </group>
            )}
          </group>
        );
      })}

      {/* ======================================================== */}
      {/* 5. ROOFTOP TERRACE, MUMTY ROOM, WATER TANK & PERGOLA     */}
      {/* ======================================================== */}
      {currentStage >= 3 && (
        <group
          position={[
            0,
            stiltHeight +
              totalResidentialFloors * floorHeight +
              totalResidentialFloors * explodeOffset,
            0,
          ]}
        >
          {/* Terrace Floor Slab with Waterproof Screed */}
          <mesh position={[0, 0.08, 0]} castShadow receiveShadow material={currentStage >= 6 ? materials.concreteSlabDark : materials.concreteRaw}>
            <boxGeometry args={[buildingWidth + 0.2, 0.18, buildingDepth + 0.2]} />
          </mesh>

          {/* Terrace Perimeter Parapet Walls (Stages 4+) */}
          {currentStage >= 4 && (
            <group position={[0, 0.5, 0]}>
              {/* Front Parapet */}
              <mesh position={[0, 0, 3.85]} castShadow material={currentStage === 4 ? materials.brickRed : materials.wallIvory}>
                <boxGeometry args={[buildingWidth + 0.2, 0.7, 0.2]} />
              </mesh>
              {/* Two-Tier Parapet Granite Coping with Drip Edge (Stage 6) */}
              {currentStage === 6 && (
                <group position={[0, 0.38, 3.85]}>
                  <mesh material={materials.wallAccentCharcoal}>
                    <boxGeometry args={[buildingWidth + 0.26, 0.05, 0.26]} />
                  </mesh>
                  {/* Waterproofing Flashing Groove */}
                  <mesh position={[0, -0.04, 0.12]} material={materials.wallRevealGroove}>
                    <boxGeometry args={[buildingWidth + 0.24, 0.015, 0.015]} />
                  </mesh>
                </group>
              )}

              {/* Rear Parapet */}
              <mesh position={[0, 0, -3.85]} castShadow material={currentStage === 4 ? materials.brickRed : materials.wallIvory}>
                <boxGeometry args={[buildingWidth + 0.2, 0.7, 0.2]} />
              </mesh>
              {/* Left Parapet */}
              <mesh position={[-4.15, 0, 0]} castShadow material={currentStage === 4 ? materials.brickRed : materials.wallIvory}>
                <boxGeometry args={[0.2, 0.7, buildingDepth + 0.2]} />
              </mesh>
              {/* Right Parapet */}
              <mesh position={[4.15, 0, 0]} castShadow material={currentStage === 4 ? materials.brickRed : materials.wallIvory}>
                <boxGeometry args={[0.2, 0.7, buildingDepth + 0.2]} />
              </mesh>
            </group>
          )}

          {/* Staircase Headroom / Mumty Room (Stages 4+) */}
          {currentStage >= 4 && (
            <group position={[-0.2, 1.0, -2.6]}>
              <mesh castShadow receiveShadow material={currentStage === 4 ? materials.brickRed : materials.wallAccentCharcoal}>
                <boxGeometry args={[2.4, 1.6, 2.0]} />
              </mesh>
              {/* Mumty Roof Slab with Cantilevered Overhang */}
              <mesh position={[0, 0.86, 0]} material={materials.concreteRaw}>
                <boxGeometry args={[2.65, 0.12, 2.25]} />
              </mesh>
              {/* Weather-Resistant Terrace Door in Stage 6 */}
              {currentStage === 6 && (
                <group position={[0, -0.15, 1.02]}>
                  <mesh material={materials.windowFrameDark}>
                    <boxGeometry args={[0.85, 1.25, 0.04]} />
                  </mesh>
                  <mesh position={[0, 0, 0.02]} material={materials.woodTeak}>
                    <boxGeometry args={[0.75, 1.15, 0.02]} />
                  </mesh>
                  {/* Rain Canopy over Door */}
                  <mesh position={[0, 0.68, 0.2]} rotation={[0.1, 0, 0]} material={materials.windowFrameDark}>
                    <boxGeometry args={[1.05, 0.04, 0.45]} />
                  </mesh>
                </group>
              )}
            </group>
          )}

          {/* Overhead Water Tank on RCC Stilt Frame (Stages 4+) */}
          {currentStage >= 4 && (
            <group position={[2.6, 1.3, -2.6]}>
              {/* 4 RCC Pedestal Stilt Columns */}
              {[-0.65, 0.65].map((tx) =>
                [-0.65, 0.65].map((tz) => (
                  <mesh key={`tank-stilt-${tx}-${tz}`} position={[tx, -0.45, tz]} material={materials.concreteRaw}>
                    <cylinderGeometry args={[0.07, 0.07, 0.9, 8]} />
                  </mesh>
                ))
              )}
              {/* Raised RCC Stilt Slab */}
              <mesh position={[0, 0.02, 0]} material={materials.concreteRaw}>
                <boxGeometry args={[1.7, 0.12, 1.7]} />
              </mesh>

              {/* Cylindrical Dual-Ring Commercial Water Tank */}
              <mesh position={[0, 0.65, 0]} castShadow material={materials.waterTankPoly}>
                <cylinderGeometry args={[0.7, 0.7, 1.1, 16]} />
              </mesh>
              {/* Reinforced Ribs on Tank */}
              {[-0.15, 0.2].map((ry) => (
                <mesh key={`tank-rib-${ry}`} position={[0, 0.65 + ry, 0]} material={materials.waterTankPoly}>
                  <cylinderGeometry args={[0.73, 0.73, 0.04, 16]} />
                </mesh>
              ))}
              {/* Tank Lid */}
              <mesh position={[0, 1.24, 0]} material={materials.railingChampagneAccent}>
                <cylinderGeometry args={[0.35, 0.35, 0.08, 16]} />
              </mesh>
              {/* Supply & Downpipe Manifold Piping */}
              <mesh position={[0.7, 0.2, 0.7]} material={materials.rebarDark}>
                <cylinderGeometry args={[0.035, 0.035, 1.8, 8]} />
              </mesh>
              {/* Steel Cage Maintenance Ladder */}
              <group position={[-0.8, 0.4, 0]}>
                {[-0.12, 0.12].map((lx) => (
                  <mesh key={`lad-rail-${lx}`} position={[0, 0, lx]} material={materials.rebarDark}>
                    <cylinderGeometry args={[0.015, 0.015, 1.6, 6]} />
                  </mesh>
                ))}
                {[-0.6, -0.3, 0, 0.3, 0.6].map((ly) => (
                  <mesh key={`lad-rung-${ly}`} position={[0, ly, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.rebarDark}>
                    <cylinderGeometry args={[0.012, 0.012, 0.24, 6]} />
                  </mesh>
                ))}
              </group>
            </group>
          )}

          {/* Modern Architectural Timber Terrace Pergola (Stage 6) */}
          {currentStage === 6 && (
            <group position={[1.5, 1.1, 1.2]}>
              {/* 4 Heavy Charcoal Upright Posts */}
              {[-1.6, 1.6].map((px) =>
                [-1.3, 1.3].map((pz) => (
                  <mesh key={`perg-post-${px}-${pz}`} position={[px, -0.5, pz]} material={materials.wallAccentCharcoal}>
                    <boxGeometry args={[0.1, 1.05, 0.1]} />
                  </mesh>
                ))
              )}
              {/* Longitudinal Main Carrier Beams */}
              {[-1.3, 1.3].map((pz) => (
                <mesh key={`perg-main-beam-${pz}`} position={[0, 0.05, pz]} material={materials.wallAccentCharcoal}>
                  <boxGeometry args={[3.5, 0.08, 0.12]} />
                </mesh>
              ))}
              {/* 7 Transverse Teak Wood Shading Rafter Slats */}
              {[-1.5, -1.0, -0.5, 0, 0.5, 1.0, 1.5].map((px) => (
                <mesh key={`perg-slat-${px}`} position={[px, 0.12, 0]} material={materials.woodTeak}>
                  <boxGeometry args={[0.08, 0.06, 2.9]} />
                </mesh>
              ))}
            </group>
          )}
        </group>
      )}
    </group>
  );
}
