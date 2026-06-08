"use client";

import { useRef } from "react";

/**
 * Anchor that drifts toward the pointer on hover (a subtle "magnetic" pull),
 * then springs back on leave. No-op on touch devices. Tracks 1:1 during hover
 * (short ease) and uses a longer ease only for the reset.
 */
export function MagneticButton({
  href,
  children,
  className = "",
  strength = 0.3,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    const r = el.getBoundingClientRect();
    const mx = e.clientX - (r.left + r.width / 2);
    const my = e.clientY - (r.top + r.height / 2);
    el.style.transition = "transform 0.12s ease-out";
    el.style.transform = `translate(${mx * strength}px, ${my * strength * 1.2}px)`;
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.45s cubic-bezier(0.16,1,0.3,1)";
    el.style.transform = "";
  };

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={`inline-block [will-change:transform] ${className}`}
    >
      {children}
    </a>
  );
}
