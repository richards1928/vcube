"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { ARCHITECTURAL_HOTSPOTS } from "./ArchitecturalHotspots";

export type CameraPresetType = "front" | "three-quarter" | "detail";

export interface CinematicCameraControllerProps {
  isCinematic: boolean;
  onModeChange: (mode: "cinematic" | "manual") => void;
  activePreset: CameraPresetType | null;
  onPresetComplete?: () => void;
  activeHotspotId: string | null;
  resetTrigger?: number;
  autoResumeDelay?: number; // in seconds (e.g. 10)
  isAutoResumeEnabled?: boolean;
  isVisible?: boolean;
}

// Canonical Architectural Camera Presets (Centering full building with foundation & roof)
export const CAMERA_PRESETS: Record<
  CameraPresetType,
  { position: [number, number, number]; target: [number, number, number] }
> = {
  "three-quarter": {
    position: [10.8, 4.8, 12.2],
    target: [0, 0.95, 0],
  },
  "front": {
    position: [0, 3.2, 14.5],
    target: [0, 1.1, 0],
  },
  "detail": {
    position: [4.6, 2.8, 7.8],
    target: [1.2, 1.8, 4.2],
  },
};

export function CinematicCameraController({
  isCinematic,
  onModeChange,
  activePreset,
  onPresetComplete,
  activeHotspotId,
  resetTrigger,
  autoResumeDelay = 10,
  isAutoResumeEnabled = true,
  isVisible = true,
}: CinematicCameraControllerProps) {
  const { camera, gl } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Transition animation state
  const isTransitioningRef = useRef<boolean>(false);
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(10.8, 4.8, 12.2));
  const targetCamLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.95, 0));

  // Cinematic movement timing (controlled sinusoidal architectural sweep)
  const cinematicTimeRef = useRef<number>(0);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear any existing inactivity timer
  const clearInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  }, []);

  // Schedule auto-resume of cinematic orbit after inactivity
  const scheduleAutoResume = useCallback(() => {
    clearInactivityTimer();
    if (!isAutoResumeEnabled || !isVisible) return;

    inactivityTimerRef.current = setTimeout(() => {
      // Calculate where the camera currently is to resume sinusoidal sweep smoothly
      if (controlsRef.current) {
        const dx = camera.position.x - controlsRef.current.target.x;
        const dz = camera.position.z - controlsRef.current.target.z;
        const currentAngle = Math.atan2(dx, dz);
        // Map current angle into the sweep phase
        const normalized = Math.max(-1, Math.min(1, (currentAngle - 0.75) / 0.38));
        cinematicTimeRef.current = Math.asin(normalized) / 0.16;
      }
      onModeChange("cinematic");
    }, autoResumeDelay * 1000);
  }, [autoResumeDelay, isAutoResumeEnabled, isVisible, camera, onModeChange, clearInactivityTimer]);

  // Handle immediate manual user interaction
  const handleUserInteractionStart = useCallback(() => {
    clearInactivityTimer();
    if (isCinematic) {
      onModeChange("manual");
    }
  }, [isCinematic, onModeChange, clearInactivityTimer]);

  const handleUserInteractionEnd = useCallback(() => {
    scheduleAutoResume();
  }, [scheduleAutoResume]);

  // Attach non-intrusive event listeners to the canvas element
  useEffect(() => {
    const domEl = gl.domElement;
    if (!domEl) return;

    const onPointerDown = () => handleUserInteractionStart();
    const onPointerUp = () => handleUserInteractionEnd();
    const onWheel = () => {
      handleUserInteractionStart();
      scheduleAutoResume();
    };

    domEl.addEventListener("pointerdown", onPointerDown, { passive: true });
    domEl.addEventListener("pointerup", onPointerUp, { passive: true });
    domEl.addEventListener("wheel", onWheel, { passive: true });
    domEl.addEventListener("touchstart", onPointerDown, { passive: true });
    domEl.addEventListener("touchend", onPointerUp, { passive: true });

    return () => {
      domEl.removeEventListener("pointerdown", onPointerDown);
      domEl.removeEventListener("pointerup", onPointerUp);
      domEl.removeEventListener("wheel", onWheel);
      domEl.removeEventListener("touchstart", onPointerDown);
      domEl.removeEventListener("touchend", onPointerUp);
      clearInactivityTimer();
    };
  }, [gl.domElement, handleUserInteractionStart, handleUserInteractionEnd, scheduleAutoResume, clearInactivityTimer]);

  // Respond to Preset changes
  useEffect(() => {
    if (!activePreset) return;
    const preset = CAMERA_PRESETS[activePreset];
    if (!preset) return;

    targetCamPosRef.current.set(...preset.position);
    targetCamLookAtRef.current.set(...preset.target);
    isTransitioningRef.current = true;
    clearInactivityTimer();
  }, [activePreset, clearInactivityTimer]);

  // Respond to Hotspot selection
  useEffect(() => {
    if (!activeHotspotId) return;
    const spot = ARCHITECTURAL_HOTSPOTS.find((h) => h.id === activeHotspotId);
    if (!spot) return;

    targetCamPosRef.current.set(...spot.cameraPos);
    targetCamLookAtRef.current.set(...spot.cameraTarget);
    isTransitioningRef.current = true;
    clearInactivityTimer();
  }, [activeHotspotId, clearInactivityTimer]);

  // Respond to Reset View trigger
  useEffect(() => {
    if (resetTrigger === undefined) return;
    const defaultPreset = CAMERA_PRESETS["three-quarter"];
    targetCamPosRef.current.set(...defaultPreset.position);
    targetCamLookAtRef.current.set(...defaultPreset.target);
    isTransitioningRef.current = true;
    clearInactivityTimer();
  }, [resetTrigger, clearInactivityTimer]);

  // Main per-frame camera logic
  useFrame((_, delta) => {
    if (!isVisible || !controlsRef.current) return;

    const controls = controlsRef.current;

    // 1. Smooth Transition Mode (Lerping towards preset or hotspot)
    if (isTransitioningRef.current) {
      const lerpFactor = 1 - Math.exp(-6.0 * delta);
      camera.position.lerp(targetCamPosRef.current, lerpFactor);
      controls.target.lerp(targetCamLookAtRef.current, lerpFactor);
      controls.update();

      const posDist = camera.position.distanceTo(targetCamPosRef.current);
      const targetDist = controls.target.distanceTo(targetCamLookAtRef.current);

      if (posDist < 0.04 && targetDist < 0.04) {
        camera.position.copy(targetCamPosRef.current);
        controls.target.copy(targetCamLookAtRef.current);
        controls.update();
        isTransitioningRef.current = false;

        onPresetComplete?.();
        scheduleAutoResume();
      }
      return;
    }

    // 2. Cinematic Tour Mode: Controlled Architectural Sweep
    // Avoids 360 spinning to the back wall; smoothly arcs between Front and Three-Quarter views
    if (isCinematic) {
      cinematicTimeRef.current += delta;

      const target = controls.target;
      const radius = 16.5;

      // Arc oscillation between ~21° and ~65° (Front elevation to Three-Quarter Hero view)
      const sweepAngle = 0.75 + Math.sin(cinematicTimeRef.current * 0.16) * 0.38;
      const sweepY = target.y + 3.8 + Math.cos(cinematicTimeRef.current * 0.16) * 0.35;

      camera.position.x = target.x + Math.sin(sweepAngle) * radius;
      camera.position.z = target.z + Math.cos(sweepAngle) * radius;
      camera.position.y = sweepY;

      camera.lookAt(target);
      controls.update();
      return;
    }

    // 3. Manual Exploration Mode
    // OrbitControls handles fluid damping without any resistance
    controls.update();
  });

  return (
    <primitive
      object={
        new OrbitControlsImpl(camera, gl.domElement)
      }
      ref={controlsRef}
      enablePan={false}
      enableZoom={true}
      minDistance={6.0}
      maxDistance={24.0}
      maxPolarAngle={Math.PI / 2 - 0.02}
      minPolarAngle={Math.PI / 6}
      enableDamping={true}
      dampingFactor={0.06}
    />
  );
}
