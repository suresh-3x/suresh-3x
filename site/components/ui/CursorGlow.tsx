"use client";

import { useEffect, useRef } from "react";

/**
 * A soft coral glow that trails the pointer (screen-blended over the dark UI).
 * Disabled on touch devices and when reduced motion is requested. One rAF loop,
 * GPU-composited transform — negligible cost.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = ref.current;
    if (coarse || reduced || !el) return;

    let raf = 0;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const loop = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    el.style.opacity = "1";

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed -left-[18rem] -top-[18rem] z-[55] h-[36rem] w-[36rem] rounded-full opacity-0 transition-opacity duration-700 [will-change:transform]"
      style={{
        background:
          "radial-gradient(circle, rgba(255,111,97,0.10), rgba(58,171,182,0.05) 45%, transparent 65%)",
        mixBlendMode: "screen",
      }}
    />
  );
}
