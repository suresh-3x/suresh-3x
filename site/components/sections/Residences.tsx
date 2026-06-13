import Image from "next/image";
import { residences } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function Residences() {
  return (
    <section
      id="residences"
      className="relative bg-gradient-to-b from-ocean-950 to-ocean-900 py-28 md:py-40"
    >
      <div className="container-page">
        <Reveal>
          <Eyebrow>The Residences</Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-6 max-w-2xl text-balance text-4xl leading-tight text-sand-50 md:text-6xl">
            Homes designed around the deck.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {residences.map((r, i) => (
            <Reveal key={r.type} delay={i * 0.1}>
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition-all duration-500 ease-luxe hover:border-coral-400/40 hover:bg-white/[0.07]">
                <div
                  className={`relative flex aspect-[16/10] items-end bg-gradient-to-br ${r.tone} p-6`}
                >
                  {/* Interim royalty-free interior under the dark gradient/grain overlays */}
                  <Image
                    src={r.image}
                    alt={`${r.name} interior`}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-luxe group-hover:scale-105"
                  />
                  <span className="grain absolute inset-0" />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ocean-950/70 via-ocean-950/10 to-transparent" />
                  <span className="relative font-display text-6xl text-white/90 drop-shadow">
                    {r.type}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-8">
                  <h3 className="font-display text-2xl text-sand-50">{r.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-sand-100/70">
                    {r.description}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {r.highlights.map((h) => (
                      <li
                        key={h}
                        className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-sand-100/80"
                      >
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex items-end justify-between border-t border-white/10 pt-6">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-sand-100/50">
                        Carpet
                      </p>
                      <p className="text-sm text-sand-50">{r.carpet}</p>
                    </div>
                    <a
                      href="#enquire"
                      className="text-sm font-semibold text-coral-300 transition-colors hover:text-coral-200"
                    >
                      Enquire →
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
