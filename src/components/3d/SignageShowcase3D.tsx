"use client";

import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Text } from "@react-three/drei";
import * as THREE from "three";
import dynamic from "next/dynamic";

interface SignageShowcaseProps {
  activeType?: "facade" | "internal" | "monolith" | "films";
}

function SignageSceneModel({ activeType }: { activeType?: string }) {
  const modelRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.06;
    }
  });

  const gold = "#C6A36A";
  const graphite = "#171A1D";

  return (
    <group ref={modelRef} position={[0, -1, 0]}>
      {/* Architectural Storefront / Building Entrance Facade */}
      <mesh position={[0, 1.5, -0.6]} receiveShadow>
        <boxGeometry args={[6, 3.4, 0.4]} />
        <meshStandardMaterial color="#121518" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* ACP Cladding Panels surrounding the entrance */}
      {[-2.2, 2.2].map((x) => (
        <mesh key={`acp-${x}`} position={[x, 1.5, -0.38]}>
          <boxGeometry args={[1.5, 3.3, 0.05]} />
          <meshStandardMaterial color="#1E2328" roughness={0.3} metalness={0.7} />
        </mesh>
      ))}

      {/* Double Glass Entry Portal with Ceramic Sun Control Film */}
      <mesh position={[0, 1.2, -0.35]}>
        <boxGeometry args={[2.8, 2.4, 0.05]} />
        <meshPhysicalMaterial
          color={activeType === "films" ? "#3D627A" : "#8AAFC4"}
          transmission={0.6}
          opacity={0.8}
          transparent
          roughness={0.1}
          reflectivity={0.9}
        />
      </mesh>

      {/* Main External Reverse Halo-lit Signage (3D Channel Letters) */}
      <group position={[0, 2.8, -0.3]}>
        {/* Backing Tray with LED halo backlight */}
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[4.2, 0.8, 0.08]} />
          <meshStandardMaterial color={graphite} roughness={0.4} />
        </mesh>

        <pointLight position={[0, 0, 0.1]} intensity={2.5} color={gold} distance={3} />

        <Text
          position={[0, 0, 0.05]}
          fontSize={0.42}
          color={gold}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.2}
        >
          VCUBE INFRA
        </Text>
      </group>

      {/* Freestanding Monolith Pylon Sign (External Signage) */}
      <group position={[2.6, 0.8, 1.2]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[0.5, 2.2, 0.2]} />
          <meshStandardMaterial color="#171A1D" roughness={0.3} metalness={0.8} />
        </mesh>
        <Text
          position={[0, 0.9, 0.11]}
          fontSize={0.12}
          color={gold}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.1}
        >
          VCUBE
        </Text>
        <pointLight position={[0, 1.3, 0.2]} intensity={0.8} color="#FFE6B3" distance={1.5} />
      </group>

      {/* Ground Pavers */}
      <mesh position={[0, -0.1, 1]} receiveShadow>
        <boxGeometry args={[7, 0.2, 4]} />
        <meshStandardMaterial color="#1B1E22" roughness={0.9} />
      </mesh>

      {/* Lights */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 5, 4]} intensity={1.2} color="#FFF2DB" castShadow />
      <directionalLight position={[-4, 3, -3]} intensity={0.5} color="#858782" />
    </group>
  );
}

function SignageCanvas(props: SignageShowcaseProps) {
  return (
    <div className="relative w-full h-[400px] sm:h-[480px] rounded-2xl border border-[#C6A36A]/20 bg-[#090B0D]/80 backdrop-blur-xl overflow-hidden architectural-grid">
      <Canvas shadows gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[5, 3.5, 6]} fov={42} />
        <Suspense fallback={null}>
          <SignageSceneModel {...props} />
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
        <span className="text-[#C6A36A]">ENVIRONMENTAL BRANDING 3D:</span> Architectural facade integration
      </div>
    </div>
  );
}

export const SignageShowcase3D = dynamic(
  () => Promise.resolve(SignageCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] flex items-center justify-center rounded-2xl border border-[#C6A36A]/20 bg-[#171A1D]/80 text-[#858782] text-xs font-mono">
        Initializing 3D Architectural Signage...
      </div>
    ),
  }
);
