"use client";

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import dynamic from "next/dynamic";

interface InteriorShowcaseProps {
  activeMaterial?: string; // "ceilings" | "furniture" | "flooring" | "flutter-boards" | "acp"
}

function InteriorRoomModel({ activeMaterial }: { activeMaterial?: string }) {
  const roomRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (roomRef.current) {
      roomRef.current.rotation.y += delta * 0.05;
    }
  });

  const gold = "#C6A36A";
  const graphite = "#171A1D";

  return (
    <group ref={roomRef} position={[0, -1.2, 0]}>
      {/* Floor Slab: Italian Marble / Polished Surface */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[5, 0.2, 5]} />
        <meshStandardMaterial
          color={activeMaterial === "flooring" ? "#DCD6CD" : "#1A1D20"}
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>

      {/* Grid seams on floor */}
      <gridHelper args={[5, 5, gold, "#333A42"]} position={[0, 0.01, 0]} />

      {/* Back Wall: Venetian Plaster / Wallpaper / Paint */}
      <mesh position={[0, 1.5, -2.4]} receiveShadow>
        <boxGeometry args={[4.8, 3, 0.2]} />
        <meshStandardMaterial
          color={activeMaterial === "wallpapers" ? "#403B35" : "#1F2327"}
          roughness={0.8}
        />
      </mesh>

      {/* Side Wall with ACP Cladding Panels */}
      <group position={[-2.4, 1.5, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[0.2, 3, 4.8]} />
          <meshStandardMaterial
            color={activeMaterial === "acp-cladding" ? "#C6A36A" : "#121518"}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* Flutter Boards — Dynamic architectural slats */}
      <group position={[-2.2, 1.5, 0.8]}>
        {[-0.8, -0.4, 0, 0.4, 0.8].map((z, idx) => (
          <mesh key={`flutter-${idx}`} position={[0, 0, z]} rotation={[0, 0.4 * (idx % 2 === 0 ? 1 : -1), 0]}>
            <boxGeometry args={[0.08, 2.6, 0.25]} />
            <meshStandardMaterial
              color={activeMaterial === "flutter-boards" ? "#C6A36A" : "#858782"}
              metalness={0.5}
              roughness={0.4}
            />
          </mesh>
        ))}
      </group>

      {/* Suspended False Ceiling with Integrated Ambient Cove */}
      <group position={[0, 2.9, 0]}>
        {/* Perimeter Ceiling */}
        <mesh>
          <boxGeometry args={[4.8, 0.15, 4.8]} />
          <meshStandardMaterial
            color={activeMaterial === "false-ceilings" ? "#C6A36A" : "#24282D"}
            roughness={0.5}
          />
        </mesh>

        {/* Cove Recess */}
        <mesh position={[0, -0.1, 0]}>
          <boxGeometry args={[3.2, 0.05, 3.2]} />
          <meshBasicMaterial color="#FFE6B3" />
        </mesh>
      </group>

      {/* Custom Architectural Furniture: Executive Joinery Desk */}
      <group position={[0, 0.6, 0]}>
        {/* Desk Top */}
        <mesh position={[0, 0.35, 0]} castShadow>
          <boxGeometry args={[2.4, 0.08, 1.2]} />
          <meshStandardMaterial
            color={activeMaterial === "furniture" ? "#C6A36A" : "#101214"}
            roughness={0.3}
            metalness={0.2}
          />
        </mesh>
        {/* Desk Metal Legs */}
        {[-1, 1].map((x) => (
          <mesh key={`leg-${x}`} position={[x, -0.05, 0]} castShadow>
            <boxGeometry args={[0.08, 0.75, 1.0]} />
            <meshStandardMaterial color={gold} metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* Glass Partition with Frosted Privacy Film */}
      <group position={[1.4, 1.4, 0.6]}>
        <mesh>
          <boxGeometry args={[0.05, 2.8, 2]} />
          <meshPhysicalMaterial
            color="#A8C4D8"
            transmission={0.8}
            opacity={0.7}
            transparent
            roughness={0.2}
          />
        </mesh>
        {/* Frosted Film Manifestation Band */}
        <mesh position={[0.03, 0, 0]}>
          <boxGeometry args={[0.01, 0.6, 2]} />
          <meshStandardMaterial color="#FFFFFF" opacity={0.65} transparent />
        </mesh>
      </group>

      {/* Room Accent Lighting */}
      <pointLight position={[0, 2.6, 0]} intensity={1.5} color="#FFEAC2" distance={6} />
      <directionalLight position={[3, 4, 3]} intensity={1.2} color="#F3F0E8" castShadow />
      <ambientLight intensity={0.4} />
    </group>
  );
}

function InteriorCanvas({ activeMaterial }: InteriorShowcaseProps) {
  return (
    <div className="relative w-full h-[400px] sm:h-[480px] rounded-2xl border border-[#C6A36A]/20 bg-[#090B0D]/80 backdrop-blur-xl overflow-hidden architectural-grid">
      <Canvas shadows gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[5, 4, 6]} fov={40} />
        <Suspense fallback={null}>
          <InteriorRoomModel activeMaterial={activeMaterial} />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
      <div className="absolute bottom-3 left-3 bg-[#171A1D]/80 border border-[#C6A36A]/20 px-3 py-1.5 rounded-lg text-[10px] font-mono text-[#858782]">
        <span className="text-[#C6A36A]">INTERIOR 3D MODEL:</span> Drag to orbit materials
      </div>
    </div>
  );
}

export const InteriorShowcase3D = dynamic(
  () => Promise.resolve(InteriorCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] flex items-center justify-center rounded-2xl border border-[#C6A36A]/20 bg-[#171A1D]/80 text-[#858782] text-xs font-mono">
        Initializing 3D Interior Model...
      </div>
    ),
  }
);
