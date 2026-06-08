"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { Coral } from "./Coral";
import { Particles } from "./Particles";

/**
 * Camera rig: pointer parallax + slow idle orbit, plus a scroll-linked "rise"
 * — as you scroll through the hero the camera ascends and dollies back, so the
 * reef feels like it's being left below you. `scroll` is 0 at the top, 1 once
 * the hero is a viewport-height scrolled. Only moves the camera — no extra cost.
 */
function Rig({
  lowPower,
  scroll,
}: {
  lowPower: boolean;
  scroll: React.MutableRefObject<number>;
}) {
  const { camera, pointer } = useThree();
  const target = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const orbit = lowPower ? 0 : 0.4;
    const s = scroll.current;
    target.current.set(
      Math.sin(t * 0.1) * orbit + pointer.x * 1.2,
      0.2 + pointer.y * 0.6 + s * 1.7,
      4.6 + s * 3.4,
    );
    camera.position.lerp(target.current, 1 - Math.pow(0.001, delta));
    camera.lookAt(0, 0.2 + s * 0.9, 0);
  });
  return null;
}

export function CoralCanvas({ lowPower = false }: { lowPower?: boolean }) {
  // Pause rendering when the tab is hidden or the canvas scrolls offscreen.
  const [active, setActive] = useState(true);
  const wrap = useRef<HTMLDivElement>(null);
  // Normalised hero scroll progress (0 at top → 1 after one viewport height).
  const scroll = useRef(0);

  useEffect(() => {
    const onVis = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", onVis);

    const onScroll = () => {
      scroll.current = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

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
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0" aria-hidden="true">
      <Canvas
        frameloop={active ? "always" : "demand"}
        dpr={[1, lowPower ? 1 : 1.5]}
        camera={{ position: [0, 0.2, 4.6], fov: 42 }}
        gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
      >
        {/* Shadows intentionally OFF: a directional shadow map recomputed each
            frame on the rotating coral caused jank + shadow-acne flicker. The
            scene reads well on lighting + bloom alone. */}
        <color attach="background" args={["#06181d"]} />
        <fog attach="fog" args={["#06181d", 5, 13]} />

        <ambientLight intensity={0.4} color="#73ccd3" />
        <directionalLight position={[4, 6, 5]} intensity={2.2} color="#ffd9c9" />
        <pointLight position={[-4, -2, -3]} intensity={6} color="#1f8c99" />
        <pointLight position={[0, 3, 2]} intensity={3} color="#ff6f61" />

        <Suspense fallback={null}>
          <Coral />
          <Particles count={lowPower ? 140 : 320} />
        </Suspense>

        <Rig lowPower={lowPower} scroll={scroll} />

        {!lowPower && (
          <EffectComposer>
            <Bloom
              intensity={0.55}
              luminanceThreshold={0.5}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
