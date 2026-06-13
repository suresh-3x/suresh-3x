"use client";

import { nav } from "@/lib/content";
import { useActiveSection } from "@/lib/use-active-section";

/** Fixed right-rail dot navigation with the active section highlighted. */
export function SectionNav() {
  const ids = nav.map((n) => n.href.replace("#", ""));
  const active = useActiveSection([...ids, "enquire"]);

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <ul className="flex flex-col items-end gap-4">
        {nav.map((item) => {
          const id = item.href.replace("#", "");
          const on = active === id;
          return (
            <li key={item.href}>
              <a
                href={item.href}
                aria-label={item.label}
                aria-current={on ? "true" : undefined}
                className="group flex items-center justify-end gap-2"
              >
                <span className="pointer-events-none rounded-full bg-ocean-900/80 px-2.5 py-1 text-xs text-sand-100 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                  {item.label}
                </span>
                <span
                  className={`block h-2.5 w-2.5 rounded-full border transition-all duration-300 ease-luxe ${
                    on
                      ? "scale-125 border-coral-300 bg-coral-300"
                      : "border-white/40 bg-transparent group-hover:border-coral-300"
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
