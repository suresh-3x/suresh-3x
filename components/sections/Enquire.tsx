"use client";

import { useState } from "react";
import { site } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

type Status = "idle" | "submitting" | "success" | "error";

export function Enquire() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <section id="enquire" className="relative bg-ocean-900 py-28 md:py-40">
      <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-coral-300">
              Enquire
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-6 text-balance text-4xl leading-tight text-sand-50 md:text-6xl">
              Book your private site visit.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-lg text-sand-100/70">
              Register your interest and our team will reach out with floor
              plans, pricing and a curated walkthrough of {site.name}.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 space-y-2 text-sm text-sand-100/60">
              <p>
                Call:{" "}
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="text-coral-300">
                  {site.phone}
                </a>
              </p>
              <p>
                Email:{" "}
                <a href={`mailto:${site.email}`} className="text-coral-300">
                  {site.email}
                </a>
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          {status === "success" ? (
            <div className="rounded-3xl border border-coral-400/40 bg-coral-400/10 p-10 text-center">
              <p className="font-display text-2xl text-sand-50">Thank you.</p>
              <p className="mt-3 text-sand-100/70">
                Your enquiry is in. Our team will be in touch shortly.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-6 text-sm font-semibold text-coral-300"
              >
                Submit another enquiry
              </button>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="rounded-3xl border border-white/10 bg-white/5 p-8"
              noValidate
            >
              {/* Honeypot — hidden from humans, catches bots */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <div className="grid gap-5">
                <Field label="Full name" name="name" type="text" required autoComplete="name" />
                <Field label="Phone" name="phone" type="tel" required autoComplete="tel" />
                <Field label="Email" name="email" type="email" required autoComplete="email" />

                <div className="flex flex-col gap-2">
                  <label htmlFor="config" className="text-sm text-sand-100/70">
                    Interested in
                  </label>
                  <select
                    id="config"
                    name="config"
                    defaultValue="2 BHK"
                    className="rounded-xl border border-white/15 bg-ocean-950/60 px-4 py-3 text-sand-50 outline-none transition-colors focus:border-coral-400"
                  >
                    <option>2 BHK Deck Residence</option>
                    <option>3 BHK Deck Residence</option>
                    <option>Either</option>
                  </select>
                </div>

                <label className="flex items-start gap-3 text-xs text-sand-100/60">
                  <input
                    type="checkbox"
                    name="consent"
                    required
                    className="mt-0.5 accent-coral-400"
                  />
                  I authorise {site.developer} and its representatives to contact
                  me regarding this enquiry.
                </label>

                {status === "error" && (
                  <p role="alert" className="text-sm text-coral-300">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="mt-2 rounded-full bg-coral-400 px-8 py-3.5 text-sm font-semibold text-ocean-950 transition-all duration-300 ease-luxe hover:bg-coral-300 disabled:opacity-60"
                >
                  {status === "submitting" ? "Submitting…" : "Request a Call Back"}
                </button>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type,
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm text-sand-100/70">
        {label}
        {required && <span className="text-coral-300"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="rounded-xl border border-white/15 bg-ocean-950/60 px-4 py-3 text-sand-50 outline-none transition-colors placeholder:text-sand-100/30 focus:border-coral-400"
      />
    </div>
  );
}
