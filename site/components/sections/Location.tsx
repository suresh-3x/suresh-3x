import Image from "next/image";
import { location } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function Location() {
  return (
    <section id="location" className="relative bg-ocean-950 py-28 md:py-40">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Reveal>
              <Eyebrow>{location.eyebrow}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-6 text-balance text-4xl leading-tight text-sand-50 md:text-6xl">
                {location.title}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-lg text-sand-100/70">{location.body}</p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-4 text-sm text-sand-100/50">{location.address}</p>
            </Reveal>
          </div>

          {/* Stylized map placeholder — interim royalty-free aerial under a dark map overlay.
              TODO: swap for an embedded interactive map / real site aerial before go-live. */}
          <Reveal delay={0.1}>
            <div className="relative aspect-square overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ocean-800 to-ocean-950">
              <Image
                src={location.image}
                alt="Aerial view of the coastline near Mira Road East, Mumbai"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-ocean-950/55" />
              <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:32px_32px]" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="absolute inset-0 -m-8 animate-ripple rounded-full border border-coral-400/40" />
                <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-coral-400 ring-4 ring-coral-400/30" />
              </div>
              <span className="absolute bottom-5 left-5 rounded-full glass px-4 py-2 text-xs text-sand-50">
                Mira Road East · Mumbai
              </span>
            </div>
            {/* TODO: replace with an embedded interactive map before go-live */}
          </Reveal>
        </div>

        <div className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {location.connectivity.map((c, i) => (
            <Reveal key={c.name} delay={Math.min(i * 0.05, 0.3)}>
              <div className="flex h-full items-start justify-between rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-500 ease-luxe hover:-translate-y-1 hover:border-coral-400/40">
                <div>
                  <p className="font-display text-lg text-sand-50">{c.name}</p>
                  <p className="mt-1 text-sm text-sand-100/60">{c.detail}</p>
                </div>
                <span className="shrink-0 rounded-full bg-coral-400/15 px-3 py-1 text-xs text-coral-200">
                  {c.time}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
