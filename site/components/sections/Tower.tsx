"use client";

import { useState } from "react";
import { tower } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

export function Tower() {
  const [active, setActive] = useState(0);

  return (
    <section
      id="tower"
      className="relative bg-gradient-to-b from-ocean-900 to-ocean-950 py-28 md:py-40"
    >
      <div className="container-page">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-coral-300">
            {tower.eyebrow}
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-6 max-w-2xl text-balance text-4xl leading-tight text-sand-50 md:text-6xl">
            {tower.title}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-lg text-sand-100/70">{tower.body}</p>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          {/* Interactive stacked tower */}
          <Reveal>
            <div className="mx-auto flex w-full max-w-sm flex-col gap-1.5">
              {tower.levels.map((level, i) => (
                <button
                  key={level.name}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-pressed={active === i}
                  className={`group relative overflow-hidden rounded-xl border px-5 text-left transition-all duration-500 ease-luxe ${
                    active === i
                      ? "border-coral-400/60 bg-coral-400/15"
                      : "border-white/10 bg-white/5 hover:border-white/25"
                  }`}
                  style={{ height: i === 1 ? 120 : 64 }}
                >
                  <span className="flex h-full flex-col justify-center">
                    <span className="font-display text-lg text-sand-50">
                      {level.name}
                    </span>
                    <span className="text-xs text-sand-100/60">
                      {level.floors}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </Reveal>

          {/* Active level detail + stats */}
          <div>
            <Reveal>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
                <p className="text-xs uppercase tracking-widest text-coral-300">
                  {tower.levels[active].floors}
                </p>
                <h3 className="mt-2 font-display text-3xl text-sand-50">
                  {tower.levels[active].name}
                </h3>
                <p className="mt-3 text-sand-100/70">
                  {tower.levels[active].note}
                </p>
              </div>
            </Reveal>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {tower.stats.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.05}>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
                    <p className="font-display text-3xl text-coral-300">
                      {s.value}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-wide text-sand-100/60">
                      {s.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
