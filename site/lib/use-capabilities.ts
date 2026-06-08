"use client";

import { useEffect, useState } from "react";

export type Capabilities = {
  /** Resolved after mount. null = still detecting (render fallback). */
  ready: boolean;
  webgl: boolean;
  reducedMotion: boolean;
  /** Low-end / mobile gets a lighter scene or static poster. */
  lowPower: boolean;
};

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

/**
 * Detects whether it is safe and worthwhile to render the WebGL scene.
 * The site is fully usable when this returns webgl:false.
 */
export function useCapabilities(): Capabilities {
  const [caps, setCaps] = useState<Capabilities>({
    ready: false,
    webgl: false,
    reducedMotion: false,
    lowPower: false,
  });

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const cores = navigator.hardwareConcurrency ?? 8;
    const mem = (navigator as Navigator & { deviceMemory?: number })
      .deviceMemory;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const lowPower =
      cores <= 4 || (typeof mem === "number" && mem <= 4) || isCoarse;

    setCaps({
      ready: true,
      webgl: detectWebGL(),
      reducedMotion,
      lowPower,
    });
  }, []);

  return caps;
}
