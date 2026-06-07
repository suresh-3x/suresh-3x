"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useCapabilities } from "@/lib/use-capabilities";
import { site } from "@/lib/content";

// 3D is code-split and never server-rendered; the poster shows until/unless it loads.
const CoralCanvas = dynamic(
  () => import("@/components/three/CoralCanvas").then((m) => m.CoralCanvas),
  { ssr: false },
);

export function Hero() {
  const caps = useCapabilities();
  const show3D = caps.ready && caps.webgl && !caps.reducedMotion;

  return (
    <section
      id="overview"
      className="relative grain flex min-h-[100svh] flex-col items-center justify-center overflow-hidden"
    >
      {/* Poster fallback — always present beneath the canvas */}
      <PosterBackdrop />

      {show3D && <CoralCanvas lowPower={caps.lowPower} />}

      {/* Readability gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-950/40 via-transparent to-ocean-950" />

      <div className="container-page relative z-10 flex flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5 text-xs font-medium uppercase tracking-[0.35em] text-coral-300"
        >
          {site.developer} presents
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-balance text-5xl leading-[1.05] text-sand-50 sm:text-7xl md:text-8xl"
        >
          {site.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-xl text-balance text-base text-sand-100/80 sm:text-lg"
        >
          {site.subtagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col gap-3 sm:flex-row"
        >
          <a
            href="#enquire"
            className="rounded-full bg-coral-400 px-8 py-3.5 text-sm font-semibold text-ocean-950 transition-transform duration-300 ease-luxe hover:scale-[1.03] hover:bg-coral-300"
          >
            Book a Site Visit
          </a>
          <a
            href="#residences"
            className="rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-sand-50 transition-colors duration-300 hover:bg-white/10"
          >
            Explore Residences
          </a>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/25 p-1.5">
          <span className="h-2 w-1 animate-float rounded-full bg-coral-300" />
        </div>
      </div>
    </section>
  );
}

function PosterBackdrop() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-b from-ocean-700 via-ocean-900 to-ocean-950" />
      <div className="absolute left-1/2 top-1/3 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-coral-400/20 blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 h-[30rem] w-[30rem] rounded-full bg-ocean-400/20 blur-[120px]" />
    </div>
  );
}
