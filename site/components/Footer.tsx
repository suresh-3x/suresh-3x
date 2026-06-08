import { nav, site } from "@/lib/content";

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-ocean-950 py-16">
      <div className="container-page">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl text-sand-50">{site.name}</p>
            <p className="mt-2 text-sm text-sand-100/60">by {site.developer}</p>
            <p className="mt-4 max-w-xs text-sm text-sand-100/50">
              MTNL Road, near Jangid Circle, Mira Road East, Mumbai.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="text-xs uppercase tracking-widest text-sand-100/40">
              Explore
            </p>
            <ul className="mt-4 space-y-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-sand-100/70 transition-colors hover:text-coral-300"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-xs uppercase tracking-widest text-sand-100/40">
              Contact
            </p>
            <ul className="mt-4 space-y-2 text-sm text-sand-100/70">
              <li>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-coral-300">
                  {site.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-coral-300">
                  {site.email}
                </a>
              </li>
              <li className="flex gap-3 pt-2">
                <a href="#" aria-label="Instagram" className="hover:text-coral-300">
                  Instagram
                </a>
                <a href="#" aria-label="LinkedIn" className="hover:text-coral-300">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-xs leading-relaxed text-sand-100/40">
          <p>
            MahaRERA Registration No.: {site.rera}. {/* TODO: confirm */} This
            is not an offer or contract. Images, plans and amenities are
            artistic representations and indicative only, subject to approvals
            and change.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p>
              © {new Date().getFullYear()} {site.developer}. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="/privacy" className="hover:text-coral-300">
                Privacy
              </a>
              <a href="/disclaimer" className="hover:text-coral-300">
                Disclaimer
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
