import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className="container-page py-32">
      <Link href="/" className="text-sm text-coral-300">
        ← Back to home
      </Link>
      <h1 className="mt-6 font-display text-4xl text-sand-50 md:text-5xl">
        Privacy Policy
      </h1>
      <div className="prose-invert mt-8 max-w-2xl space-y-4 text-sand-100/70">
        <p>
          {site.developer} respects your privacy. This placeholder policy
          describes how enquiry information submitted through {site.name} is
          handled. {/* TODO: replace with legal-approved copy before go-live */}
        </p>
        <p>
          Information you submit (name, phone, email and configuration interest)
          is used solely to respond to your enquiry and share project details.
          We do not sell your data.
        </p>
        <p>
          To request access to or deletion of your data, contact{" "}
          <a href={`mailto:${site.email}`} className="text-coral-300">
            {site.email}
          </a>
          .
        </p>
        <p className="text-sm text-sand-100/40">
          Last updated: {new Date().toLocaleDateString("en-IN")}.
        </p>
      </div>
    </main>
  );
}
