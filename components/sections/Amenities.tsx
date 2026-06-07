"use client";

import { useState } from "react";
import { amenities, amenitiesCount, type Amenity } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

const categories = ["All", "Wellness", "Leisure", "Social", "Outdoor"] as const;
type Filter = (typeof categories)[number];

export function Amenities() {
  const [filter, setFilter] = useState<Filter>("All");

  const visible: Amenity[] =
    filter === "All"
      ? amenities
      : amenities.filter((a) => a.category === filter);

  return (
    <section id="amenities" className="relative bg-ocean-900 py-28 md:py-40">
      <div className="container-page">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-coral-300">
            Amenities
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-6 max-w-2xl text-balance text-4xl leading-tight text-sand-50 md:text-6xl">
            <span className="text-coral-300">{amenitiesCount}</span> curated
            amenities, woven through the decks.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Amenity categories">
            {categories.map((c) => (
              <button
                key={c}
                role="tab"
                aria-selected={filter === c}
                onClick={() => setFilter(c)}
                className={`rounded-full px-5 py-2 text-sm transition-all duration-300 ${
                  filter === c
                    ? "bg-coral-400 text-ocean-950"
                    : "border border-white/15 text-sand-100/70 hover:border-coral-400/40 hover:text-sand-50"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {visible.map((a, i) => (
            <Reveal key={a.name} delay={Math.min(i * 0.03, 0.3)}>
              <div className="group flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-500 ease-luxe hover:-translate-y-1 hover:border-coral-400/40">
                <span className="text-xs uppercase tracking-widest text-coral-300/80">
                  {a.category}
                </span>
                <p className="mt-6 font-display text-lg leading-snug text-sand-50">
                  {a.name}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-sm text-sand-100/40">
          A representative selection. Final amenities subject to approvals.
        </p>
      </div>
    </section>
  );
}
