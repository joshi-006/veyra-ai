"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { buildNeuralMesh } from "@/three/geometry/build-neural-mesh";
import {
  meshVertexShader,
  meshFragmentShader,
  lineVertexShader,
  lineFragmentShader,
} from "@/three/shaders/neural-mesh";

const COLOR_A = new THREE.Color("#5C7C8A"); // current — cool, precise
const COLOR_B = new THREE.Color("#E8D9C0"); // signal — warm, human

interface SceneProps {
  scrollProgress: { current: number };
  mouse: { current: [number, number] };
}

function NeuralField({ scrollProgress, mouse }: SceneProps) {
  const { points, lines } = useMemo(() => buildNeuralMesh({ count: 2200 }), []);
  const groupRef = useRef<THREE.Group>(null);
  const pointsMaterial = useRef<THREE.ShaderMaterial>(null);
  const lineMaterial = useRef<THREE.ShaderMaterial>(null);
  const mouseInfluence = useRef(0);

  const pMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: meshVertexShader,
        fragmentShader: meshFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uMouseInfluence: { value: 0 },
          uColorA: { value: COLOR_A },
          uColorB: { value: COLOR_B },
        },
      }),
    []
  );

  const lMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: lineVertexShader,
        fragmentShader: lineFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: COLOR_A.clone().lerp(COLOR_B, 0.4) },
        },
      }),
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    pMat.uniforms.uTime.value = t;
    lMat.uniforms.uTime.value = t;

    // Smoothly ease mouse influence in/out so it never snaps
    const targetInfluence = 1;
    mouseInfluence.current = THREE.MathUtils.lerp(
      mouseInfluence.current,
      targetInfluence,
      0.04
    );
    pMat.uniforms.uMouseInfluence.value = mouseInfluence.current;
    pMat.uniforms.uMouse.value.set(mouse.current[0], mouse.current[1]);

    if (groupRef.current) {
      // Ambient slow rotation — depth and parallax without user input
      groupRef.current.rotation.y = t * 0.015 + scrollProgress.current * 0.6;
      groupRef.current.rotation.x =
        Math.sin(t * 0.05) * 0.04 + scrollProgress.current * 0.25;

      // As the user scrolls past hero, the field compresses inward —
      // "particles begin clustering" cue picked up by the next section.
      const scale = THREE.MathUtils.lerp(1, 0.78, scrollProgress.current);
      groupRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={groupRef}>
      <points geometry={points} material={pMat} ref={pointsMaterial as never} />
      <lineSegments geometry={lines} material={lMat} ref={lineMaterial as never} />
    </group>
  );
}

function CameraRig({ mouse }: { mouse: { current: [number, number] } }) {
  const { camera } = useThree();
  useFrame(() => {
    const targetX = mouse.current[0] * 0.4;
    const targetY = mouse.current[1] * 0.25;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.03);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/**
 * Mounts the WebGL scene only after first paint and only if WebGL is
 * available, and caps pixel ratio for GPU-friendly performance on mobile.
 */
export function NeuralCommunicationScene({
  scrollProgress,
}: {
  scrollProgress: { current: number };
}) {
  const mouse = useRef<[number, number]>([0, 0]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerMove(e: PointerEvent) {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -((e.clientY / window.innerHeight) * 2 - 1);
      mouse.current = [nx, ny];
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <div ref={containerRef} className="scene-canvas" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 9], fov: 45 }}
        frameloop="always"
      >
        <CameraRig mouse={mouse} />
        <NeuralField scrollProgress={scrollProgress} mouse={mouse} />
      </Canvas>
    </div>
  );
}
