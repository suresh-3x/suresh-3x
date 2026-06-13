"use client";

import { motion } from "framer-motion";

/**
 * Editorial section eyebrow: an animated coral hairline + uppercase label.
 * Unifies the section kickers across the site. Honors reduced-motion via
 * framer-motion's defaults.
 */
export function Eyebrow({
  children,
  center = false,
  className = "",
}: {
  children: React.ReactNode;
  center?: boolean;
  className?: string;
}) {
  const line = (
    <motion.span
      aria-hidden="true"
      className="h-px bg-coral-300/60"
      initial={{ width: 0 }}
      whileInView={{ width: 32 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    />
  );

  return (
    <span
      className={`inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.35em] text-coral-300 ${
        center ? "justify-center" : ""
      } ${className}`}
    >
      {line}
      {children}
      {center && line}
    </span>
  );
}
