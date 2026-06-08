import { developer } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

/** Compact developer-credibility band (Mayfair Housing legacy). */
export function DeveloperStrip() {
  return (
    <section className="relative border-y border-white/10 bg-ocean-950 py-16 md:py-20">
      <div className="container-page">
        <Reveal>
          <p className="text-center text-xs font-medium uppercase tracking-[0.35em] text-coral-300">
            A {developer.name} landmark
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-center font-display text-2xl text-sand-50 md:text-3xl">
            {developer.line}
          </p>
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
          {developer.stats.map((s, i) => (
            <Reveal key={s.label} delay={0.05 * i}>
              <div className="text-center">
                <p className="font-display text-4xl text-coral-300 md:text-5xl">
                  {s.value}
                </p>
                <p className="mt-2 text-xs uppercase tracking-widest text-sand-100/55">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
