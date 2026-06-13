import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Disclaimer",
  robots: { index: false, follow: true },
};

export default function DisclaimerPage() {
  return (
    <main className="container-page py-32">
      <Link href="/" className="text-sm text-coral-300">
        ← Back to home
      </Link>
      <h1 className="mt-6 font-display text-4xl text-sand-50 md:text-5xl">
        Disclaimer
      </h1>
      <div className="mt-8 max-w-2xl space-y-4 text-sand-100/70">
        <p>
          The content on this website is for general information only and does
          not constitute an offer, invitation or contract.
          {/* TODO: replace with legal-approved copy before go-live */}
        </p>
        <p>
          All images, plans, dimensions, amenities and specifications are
          artistic representations and indicative only. They are subject to the
          approval of the competent authorities and may change without notice.
        </p>
        <p>
          {site.name} is registered under MahaRERA No. {site.rera}. Please
          verify all details with our authorised sales team before making any
          purchase decision.
        </p>
      </div>
    </main>
  );
}
