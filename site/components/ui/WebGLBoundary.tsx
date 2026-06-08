"use client";

import { Component, type ReactNode } from "react";

/**
 * Catches any error thrown while mounting/rendering the WebGL scene so a GPU
 * failure can never blank the hero — the poster fallback stays visible instead.
 */
export class WebGLBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[WebGLBoundary] 3D scene disabled:", error);
    }
  }

  render() {
    return this.state.failed
      ? (this.props.fallback ?? null)
      : this.props.children;
  }
}
