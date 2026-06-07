"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { Coral } from "./Coral";
import { Particles } from "./Particles";

/** Gentle camera parallax toward the pointer, with a slow idle orbit. */
function Rig({ lowPower }: { lowPower: boolean }) {
  const { camera, pointer } = useThree();
  const target = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const orbit = lowPower ? 0 : 0.4;
    target.current.set(
      Math.sin(t * 0.1) * orbit + pointer.x * 1.2,
      0.2 + pointer.y * 0.6,
      4.6,
    );
    camera.position.lerp(target.current, 1 - Math.pow(0.001, delta));
    camera.lookAt(0, 0.2, 0);
  });
  return null;
}

export function CoralCanvas({ lowPower = false }: { lowPower?: boolean }) {
  // Pause rendering when the tab is hidden or the canvas scrolls offscreen.
  const [active, setActive] = useState(true);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onVis = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", onVis);

    let io: IntersectionObserver | null = null;
    if (wrap.current) {
      io = new IntersectionObserver(
        ([entry]) => setActive(entry.isIntersecting && !document.hidden),
        { threshold: 0.05 },
      );
      io.observe(wrap.current);
    }
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      io?.disconnect();
    };
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0" aria-hidden="true">
      <Canvas
        frameloop={active ? "always" : "demand"}
        dpr={[1, lowPower ? 1.25 : 2]}
        shadows={!lowPower}
        camera={{ position: [0, 0.2, 4.6], fov: 42 }}
        gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
      >
        <color attach="background" args={["#06181d"]} />
        <fog attach="fog" args={["#06181d", 5, 13]} />

        <ambientLight intensity={0.35} color="#73ccd3" />
        <directionalLight
          position={[4, 6, 5]}
          intensity={2.2}
          color="#ffd9c9"
          castShadow={!lowPower}
        />
        <pointLight position={[-4, -2, -3]} intensity={6} color="#1f8c99" />
        <pointLight position={[0, 3, 2]} intensity={3} color="#ff6f61" />

        <Suspense fallback={null}>
          <Coral />
          <Particles count={lowPower ? 250 : 600} />
        </Suspense>

        <Rig lowPower={lowPower} />

        {!lowPower && (
          <EffectComposer>
            <Bloom
              intensity={0.7}
              luminanceThreshold={0.35}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
