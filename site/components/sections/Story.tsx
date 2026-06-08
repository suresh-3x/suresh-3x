import { story } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

export function Story() {
  return (
    <section id="story" className="relative bg-ocean-950 py-28 md:py-40">
      <div className="container-page">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-coral-300">
            {story.eyebrow}
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-6 max-w-3xl text-balance text-4xl leading-tight text-sand-50 md:text-6xl">
            {story.title}
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-6 md:max-w-2xl">
          {story.body.map((p, i) => (
            <Reveal key={i} delay={0.1 + i * 0.05}>
              <p className="text-lg leading-relaxed text-sand-100/70">{p}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
          {story.pillars.map((pillar, i) => (
            <Reveal key={pillar.title} delay={i * 0.08}>
              <div className="h-full bg-ocean-900/40 p-8 transition-colors duration-500 hover:bg-coral-400/10">
                <h3 className="font-display text-2xl text-coral-300">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-sand-100/60">
                  {pillar.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
