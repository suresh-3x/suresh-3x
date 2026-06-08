"use client";

import { useEffect, useState } from "react";
import { nav, site } from "@/lib/content";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-luxe ${
        scrolled ? "glass py-3" : "bg-transparent py-5"
      }`}
    >
      <nav
        className="container-page flex items-center justify-between"
        aria-label="Primary"
      >
        <a
          href="#overview"
          className="font-display text-lg font-semibold tracking-tight text-sand-50"
        >
          {site.name}
          <span className="ml-2 text-xs font-sans font-normal uppercase tracking-widest text-coral-300">
            by {site.developer}
          </span>
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-sm text-sand-100/80 transition-colors hover:text-coral-300"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#enquire"
            className="hidden rounded-full bg-coral-400 px-5 py-2.5 text-sm font-semibold text-ocean-950 transition-transform duration-300 ease-luxe hover:scale-[1.03] sm:inline-block"
          >
            Book a Site Visit
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 lg:hidden"
          >
            <span className="text-xl">{open ? "×" : "☰"}</span>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="glass mt-3 lg:hidden">
          <ul className="container-page flex flex-col gap-1 py-4">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-3 text-base text-sand-100 transition-colors hover:bg-white/5"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#enquire"
                onClick={() => setOpen(false)}
                className="mt-2 block rounded-full bg-coral-400 px-5 py-3 text-center font-semibold text-ocean-950"
              >
                Book a Site Visit
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
