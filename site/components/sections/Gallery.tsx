"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { gallery } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);

  // Close lightbox on Escape; lock scroll while open.
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => ((o ?? 0) + 1) % gallery.length);
      if (e.key === "ArrowLeft")
        setOpen((o) => ((o ?? 0) - 1 + gallery.length) % gallery.length);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <section
      id="gallery"
      className="relative bg-gradient-to-b from-ocean-950 to-ocean-900 py-28 md:py-40"
    >
      <div className="container-page">
        <Reveal>
          <Eyebrow>Gallery</Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-6 max-w-2xl text-balance text-4xl leading-tight text-sand-50 md:text-6xl">
            A first look at the reef above the city.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-3">
          {gallery.map((g, i) => (
            <Reveal key={g.title} delay={Math.min(i * 0.05, 0.3)}>
              <button
                onClick={() => setOpen(i)}
                aria-label={`View ${g.title}`}
                className={`group relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br ${g.tone} ${
                  i === 0 ? "md:col-span-2 md:row-span-2 md:aspect-auto" : ""
                }`}
              >
                {/* Interim royalty-free image sits under the dark gradient/grain/hover overlays */}
                <Image
                  src={g.image}
                  alt={g.title}
                  fill
                  sizes={
                    i === 0
                      ? "(min-width: 768px) 66vw, 50vw"
                      : "(min-width: 768px) 33vw, 50vw"
                  }
                  className="object-cover transition-transform duration-700 ease-luxe group-hover:scale-105"
                  priority={i === 0}
                />
                <span className="grain absolute inset-0" />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ocean-950/70 via-ocean-950/10 to-transparent" />
                <span className="absolute inset-0 bg-ocean-950/0 transition-colors duration-500 group-hover:bg-ocean-950/30" />
                <span className="absolute bottom-4 left-4 font-display text-lg text-white/95 drop-shadow">
                  {g.title}
                </span>
              </button>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-sm text-sand-100/40">
          Artistic representations. {/* TODO: swap in final renders */}
        </p>
      </div>

      {/* Lightbox */}
      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={gallery[open].title}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ocean-950/90 p-6 backdrop-blur-sm"
          onClick={() => setOpen(null)}
        >
          <div
            className={`relative aspect-video w-full max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br ${gallery[open].tone}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={gallery[open].image}
              alt={gallery[open].title}
              fill
              sizes="(min-width: 1024px) 896px, 100vw"
              className="object-cover"
              priority
            />
            <span className="grain absolute inset-0" />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ocean-950/70 via-transparent to-transparent" />
            <span className="absolute bottom-6 left-6 font-display text-2xl text-white drop-shadow">
              {gallery[open].title}
            </span>
          </div>
          <button
            onClick={() => setOpen(null)}
            aria-label="Close"
            className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full glass text-2xl text-sand-50"
          >
            ×
          </button>
        </div>
      )}
    </section>
  );
}
