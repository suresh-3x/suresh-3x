"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/**
 * A procedural coral formation: several curved branches built from tube
 * geometry, radiating and rising, tipped with glowing polyps.
 * Fully code-generated — no external assets to download.
 */
function useBranches(count: number) {
  return useMemo(() => {
    const branches: { geometry: THREE.TubeGeometry; tip: THREE.Vector3 }[] = [];
    const rng = mulberry32(1337);

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + rng() * 0.4;
      const radius = 0.15 + rng() * 0.25;
      const height = 1.6 + rng() * 1.4;

      const points: THREE.Vector3[] = [];
      const segments = 6;
      for (let s = 0; s <= segments; s++) {
        const t = s / segments;
        const sway = Math.sin(t * Math.PI * (1.2 + rng())) * (0.4 + rng() * 0.4);
        points.push(
          new THREE.Vector3(
            Math.cos(angle) * (radius + t * (0.6 + rng() * 0.8)) + sway * 0.3,
            t * height - 0.6,
            Math.sin(angle) * (radius + t * (0.6 + rng() * 0.8)) + sway * 0.3,
          ),
        );
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const geometry = new THREE.TubeGeometry(curve, 32, 0.07, 8, false);
      branches.push({ geometry, tip: points[points.length - 1] });
    }
    return branches;
  }, [count]);
}

export function Coral() {
  const group = useRef<THREE.Group>(null);
  const branches = useBranches(11);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.08;
  });

  return (
    <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.4}>
      <group ref={group} position={[0, -0.2, 0]}>
        {branches.map((b, i) => (
          <mesh key={i} geometry={b.geometry} castShadow>
            <meshStandardMaterial
              color={i % 3 === 0 ? "#ff6f61" : i % 3 === 1 ? "#ff9b86" : "#f24d3d"}
              roughness={0.55}
              metalness={0.05}
              emissive="#ff6f61"
              emissiveIntensity={0.18}
            />
          </mesh>
        ))}
        {branches.map((b, i) => (
          <mesh key={`tip-${i}`} position={b.tip}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial
              color="#ffe0d9"
              emissive="#ff6f61"
              emissiveIntensity={0.6}
              roughness={0.3}
            />
          </mesh>
        ))}
        {/* Base rock */}
        <mesh position={[0, -0.7, 0]} receiveShadow>
          <icosahedronGeometry args={[0.7, 1]} />
          <meshStandardMaterial color="#1a5a67" roughness={0.9} flatShading />
        </mesh>
      </group>
    </Float>
  );
}

// Deterministic PRNG so the formation is stable across renders.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
