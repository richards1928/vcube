"use client";

import React, { useRef, useMemo, useState, useEffect, memo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface ArchitecturalHotspot {
  id: string;
  number: number;
  title: string;
  category: string;
  position: [number, number, number];
  cameraPos: [number, number, number];
  cameraTarget: [number, number, number];
  desc: string;
  specs: string[];
}

// Canonical anchored 3D Hotspots on the Residential Apartment Demonstration Model
export const ARCHITECTURAL_HOTSPOTS: ArchitecturalHotspot[] = [
  {
    id: "columns",
    number: 1,
    title: "RCC Structural Columns",
    category: "STRUCTURAL FRAMEWORK",
    position: [-3.2, -1.2, 2.8],
    cameraPos: [-4.8, 0.4, 6.4],
    cameraTarget: [-3.2, -1.0, 2.8],
    desc: "Heavy 450x450mm reinforced concrete column grid cast with M25/M30 grade concrete and Fe550D TMT rebar, engineered to IS 1893 seismic compliance standards.",
    specs: ["M25/M30 Grade Concrete", "Fe550D High-Yield TMT Steel", "150mm Lateral Tie Pitch", "Seismic Zone II Compliance"],
  },
  {
    id: "slabs",
    number: 2,
    title: "Post-Tensioned Floor Slabs",
    category: "SLAB ENGINEERING",
    position: [1.5, -0.35, 4.88],
    cameraPos: [4.5, 0.8, 7.5],
    cameraTarget: [1.5, -0.35, 4.2],
    desc: "160mm thick suspended concrete floor slabs with precision formwork chamfers and integrated perimeter reveal shadow grooves, ensuring zero deflection.",
    specs: ["160mm Suspended Slabs", "Chamfered Perimeter Reveal", "Crack-Resistant Design", "Vitrified Tile Base"],
  },
  {
    id: "balconies",
    number: 3,
    title: "Cantilevered Glass Balconies",
    category: "FACADE & BALCONIES",
    position: [1.5, 1.4, 4.88],
    cameraPos: [4.2, 2.4, 7.5],
    cameraTarget: [1.5, 1.4, 4.2],
    desc: "Spacious recessed balconies featuring 12mm laminated blue-tinted tempered glass balustrades, continuous bottom aluminum shoe channels, and graphite handrails.",
    specs: ["12mm Toughened Glass", "Continuous Aluminum Shoe", "Brushed Graphite Rail", "Integrated Planter Trough"],
  },
  {
    id: "windows",
    number: 4,
    title: "UPVC Sliding French Doors",
    category: "FENESTRATION",
    position: [-2.6, 1.0, 3.95],
    cameraPos: [-1.8, 1.8, 6.5],
    cameraTarget: [-2.6, 1.0, 3.8],
    desc: "Heavy-gauge 3-track sliding French doors and architectural window boxes lined with natural teak wood and projecting black granite sills with drip edges.",
    specs: ["Dark Powder-Coated UPVC", "Double Glazed Acoustic Glass", "Natural Teak Box Reveal", "Granite Sill with Drip Edge"],
  },
  {
    id: "facade",
    number: 5,
    title: "Exterior Stucco & Teak Louvers",
    category: "EXTERIOR FINISHES",
    position: [-0.55, 2.3, 4.25],
    cameraPos: [1.6, 2.8, 6.8],
    cameraTarget: [-0.55, 2.3, 4.0],
    desc: "Weather-resistant warm ivory textured stucco paired with vertical natural teak brise-soleil louver screens for solar shading, privacy, and thermal comfort.",
    specs: ["Weatherproof Ivory Stucco", "Treated Natural Teak Battens", "Charcoal Feature Accents", "Bi-Directional LED Sconces"],
  },
  {
    id: "staircase",
    number: 6,
    title: "Central Staircase & Lift Core",
    category: "CIRCULATION CORE",
    position: [-0.2, 0.8, -2.8],
    cameraPos: [-3.8, 2.4, -5.2],
    cameraTarget: [-0.2, 1.2, -2.8],
    desc: "Continuous dog-legged RCC staircase with mid-landing slabs and adjacent high-speed elevator headroom core providing lateral structural stiffness.",
    specs: ["Dog-Legged Waist Slabs", "Fire-Rated Stair Enclosure", "Ventilated Louver Glazing", "Lift Machine Room Overhead"],
  },
  {
    id: "rooftop",
    number: 7,
    title: "Terrace Pergola & Services",
    category: "ROOFTOP AMENITIES",
    position: [1.5, 4.8, 1.2],
    cameraPos: [4.8, 6.4, 5.4],
    cameraTarget: [1.5, 4.5, 1.0],
    desc: "Architectural timber terrace pergola with transverse shading rafters, waterproofed terrace floor, mumty headroom, and elevated dual-ring water storage tank.",
    specs: ["Heavy Timber Pergola Rafters", "Elevated Dual Water Tank", "Stepped Parapet Coping", "Terrace Weather Door"],
  },
];

// In-memory cache for canvas-generated number textures
const textureCache = new Map<string, THREE.CanvasTexture>();

function getHotspotTexture(number: number, isSelected: boolean, isHovered: boolean): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;

  const key = `${number}-${isSelected ? "sel" : isHovered ? "hov" : "def"}`;
  if (textureCache.has(key)) {
    return textureCache.get(key)!;
  }

  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const centerX = 64;
  const centerY = 64;
  const radius = 50;

  ctx.clearRect(0, 0, 128, 128);

  // Outer ambient glow ring for selected / hovered
  if (isSelected || isHovered) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 8, 0, Math.PI * 2);
    ctx.fillStyle = isSelected ? "rgba(198, 163, 106, 0.5)" : "rgba(198, 163, 106, 0.3)";
    ctx.fill();
  }

  // Inner circular background
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  if (isSelected) {
    ctx.fillStyle = "#C6A36A"; // Solid gold
  } else if (isHovered) {
    ctx.fillStyle = "#1E2228"; // Dark graphite
  } else {
    ctx.fillStyle = "rgba(10, 12, 15, 0.94)"; // Obsidian slate
  }
  ctx.fill();

  // Border ring
  ctx.lineWidth = isSelected ? 5 : isHovered ? 4.5 : 3.5;
  ctx.strokeStyle = isSelected ? "#FFFFFF" : isHovered ? "#E5C287" : "#C6A36A";
  ctx.stroke();

  // Hotspot Number
  ctx.font = "bold 56px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = isSelected ? "#0A0C0E" : isHovered ? "#E5C287" : "#F3F0E8";
  ctx.fillText(String(number), centerX, centerY + 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  textureCache.set(key, texture);
  return texture;
}

interface HotspotPinProps {
  hotspot: ArchitecturalHotspot;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

/**
 * Native Three.js 3D Hotspot Pin:
 * Uses high-performance WebGL Sprite + Billboard Pulse Ring + Raycasting Hit Sphere.
 * Completely eliminates Drei <Html>, nested ReactDOM roots, and React 19 unmount lifecycle crashes.
 */
const HotspotPin = memo(function HotspotPin({
  hotspot,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: HotspotPinProps) {
  const spriteRef = useRef<THREE.Sprite>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ringMatRef = useRef<THREE.MeshBasicMaterial>(null);

  // Retrieve cached texture
  const texture = useMemo(() => {
    return getHotspotTexture(hotspot.number, isSelected, isHovered);
  }, [hotspot.number, isSelected, isHovered]);

  // Animation frame: billboarding, radar beacon pulsing, and smooth scale interpolation
  useFrame(({ clock, camera }) => {
    // 1. Radar beacon pulsing effect
    if (ringRef.current && ringMatRef.current) {
      ringRef.current.quaternion.copy(camera.quaternion);
      const t = clock.getElapsedTime() * 2.8 + hotspot.number * 0.8;
      const pulse = (Math.sin(t) + 1) * 0.5; // 0 to 1
      const scale = 1 + pulse * 0.45;
      ringRef.current.scale.set(scale, scale, scale);
      ringMatRef.current.opacity = (1 - pulse) * (isSelected ? 0.75 : isHovered ? 0.6 : 0.35);
    }

    // 2. Smooth scale animation for the sprite pin
    if (spriteRef.current) {
      const baseScale = isSelected ? 0.68 : isHovered ? 0.60 : 0.50;
      const targetScale = new THREE.Vector3(baseScale, baseScale, 1);
      spriteRef.current.scale.lerp(targetScale, 0.18);
    }
  });

  return (
    <group position={hotspot.position}>
      {/* Anchor beacon dot at the building surface */}
      <mesh>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial
          color={isSelected ? "#FFFFFF" : "#C6A36A"}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Pulsing billboard radar ring */}
      <mesh ref={ringRef} renderOrder={998}>
        <ringGeometry args={[0.22, 0.34, 32]} />
        <meshBasicMaterial
          ref={ringMatRef}
          color={isSelected ? "#FFFFFF" : "#C6A36A"}
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
          depthTest={false}
        />
      </mesh>

      {/* Native WebGL billboard Sprite with crisp canvas-generated number badge */}
      {texture && (
        <sprite
          ref={spriteRef}
          renderOrder={999}
          scale={[0.5, 0.5, 1]}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(hotspot.id);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(hotspot.id);
          }}
          onPointerOut={() => {
            onHover(null);
          }}
        >
          <spriteMaterial
            map={texture}
            transparent
            depthTest={false}
          />
        </sprite>
      )}

      {/* Invisible enlarged hit sphere for effortless clicking on desktop & touch */}
      <mesh
        visible={false}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(hotspot.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(hotspot.id);
        }}
        onPointerOut={() => {
          onHover(null);
        }}
      >
        <sphereGeometry args={[0.42, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
});

export interface ArchitecturalHotspotsProps {
  activeHotspotId: string | null;
  onSelectHotspot: (id: string | null) => void;
  onHoverHotspot?: (id: string | null) => void;
  visible?: boolean;
}

/**
 * ArchitecturalHotspots:
 * Pure Three.js WebGL Hotspots.
 * Renders native billboarding sprites and pulsing radar beacon rings.
 * Zero DOM manipulation, 100% resilient across React 19, Strict Mode, and Next.js Turbopack.
 */
export function ArchitecturalHotspots({
  activeHotspotId,
  onSelectHotspot,
  onHoverHotspot,
  visible = true,
}: ArchitecturalHotspotsProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Update cursor pointer when hovering any 3D hotspot
  useEffect(() => {
    if (hoveredId && visible) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "auto";
    }
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hoveredId, visible]);

  const handleHover = (id: string | null) => {
    setHoveredId(id);
    onHoverHotspot?.(id);
  };

  const handleSelect = (id: string) => {
    onSelectHotspot(activeHotspotId === id ? null : id);
  };

  return (
    <group visible={visible}>
      {ARCHITECTURAL_HOTSPOTS.map((hotspot) => (
        <HotspotPin
          key={hotspot.id}
          hotspot={hotspot}
          isSelected={activeHotspotId === hotspot.id}
          isHovered={hoveredId === hotspot.id}
          onSelect={handleSelect}
          onHover={handleHover}
        />
      ))}
    </group>
  );
}
