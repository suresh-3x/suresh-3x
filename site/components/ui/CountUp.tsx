"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Animates a numeric value up from zero when scrolled into view.
 * Accepts strings like "35", "1.75", "40+", "2 & 3" — it animates the
 * leading number and preserves any prefix/suffix and decimal precision.
 * Falls back to the static value when reduced-motion is preferred.
 */
export function CountUp({
  value,
  className,
  duration = 1.4,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const [text, setText] = useState(value);

  useEffect(() => {
    // Parse inside the effect so its identity doesn't change every render.
    const match = value.match(/^(\D*)([\d,.]+)(.*)$/);
    if (!match) {
      setText(value);
      return;
    }
    const [, prefix, numStr, suffix] = match;
    const target = parseFloat(numStr.replace(/,/g, ""));
    if (Number.isNaN(target)) {
      setText(value);
      return;
    }

    const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
    const format = (n: number) =>
      `${prefix}${n.toLocaleString("en-IN", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`;

    if (reduced) {
      setText(format(target));
      return;
    }
    if (!inView) {
      setText(format(0));
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setText(format(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, value, duration]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
