"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  streamVertexShader,
  streamFragmentShader,
} from "@/three/shaders/signal-stream";

const EMOTION_COLORS: Record<string, [string, string]> = {
  calm: ["#3E4A52", "#5C7C8A"],
  joy: ["#7A5B3A", "#E8D9C0"],
  urgency: ["#5A2E22", "#C16B4A"],
  sincerity: ["#3A4A3E", "#8FA889"],
};

interface SignalStreamProps {
  emotion: string;
  transformed: boolean;
}

function SignalStream({ emotion, transformed }: SignalStreamProps) {
  const laneCount = 7;
  const perLane = 90;
  const total = laneCount * perLane;

  const geometry = useMemo(() => {
    const positions = new Float32Array(total * 3);
    const offsets = new Float32Array(total);
    const lanes = new Float32Array(total);

    let idx = 0;
    for (let lane = 0; lane < laneCount; lane++) {
      const laneCenter = (lane - (laneCount - 1) / 2) * 0.45;
      for (let i = 0; i < perLane; i++) {
        positions[idx * 3] = 0;
        positions[idx * 3 + 1] = laneCenter;
        positions[idx * 3 + 2] = 0;
        offsets[idx] = i / perLane;
        lanes[idx] = laneCenter;
        idx++;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aOffset", new THREE.BufferAttribute(offsets, 1));
    geo.setAttribute("aLane", new THREE.BufferAttribute(lanes, 1));
    return geo;
  }, [total, laneCount]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: streamVertexShader,
        fragmentShader: streamFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uEmotionEnergy: { value: 0.4 },
          uTransform: { value: 0 },
          uColorLow: { value: new THREE.Color(EMOTION_COLORS.calm[0]) },
          uColorHigh: { value: new THREE.Color(EMOTION_COLORS.calm[1]) },
        },
      }),
    []
  );

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;

    const colors = EMOTION_COLORS[emotion] ?? EMOTION_COLORS.calm;
    const targetLow = new THREE.Color(colors[0]);
    const targetHigh = new THREE.Color(colors[1]);
    (material.uniforms.uColorLow.value as THREE.Color).lerp(targetLow, 0.06);
    (material.uniforms.uColorHigh.value as THREE.Color).lerp(targetHigh, 0.06);

    const targetEnergy =
      emotion === "urgency" ? 0.95 : emotion === "joy" ? 0.75 : emotion === "sincerity" ? 0.5 : 0.35;
    material.uniforms.uEmotionEnergy.value = THREE.MathUtils.lerp(
      material.uniforms.uEmotionEnergy.value,
      targetEnergy,
      0.05
    );

    material.uniforms.uTransform.value = THREE.MathUtils.lerp(
      material.uniforms.uTransform.value,
      transformed ? 1 : 0,
      0.05
    );
  });

  return <points geometry={geometry} material={material} />;
}

export function InteractiveDemoScene({
  emotion,
  transformed,
}: SignalStreamProps) {
  return (
    <div className="scene-canvas" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 6], fov: 50 }}
      >
        <SignalStream emotion={emotion} transformed={transformed} />
      </Canvas>
    </div>
  );
}
