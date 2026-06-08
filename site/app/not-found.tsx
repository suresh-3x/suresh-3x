import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grain flex min-h-[100svh] flex-col items-center justify-center bg-gradient-to-b from-ocean-800 to-ocean-950 px-6 text-center">
      <p className="font-display text-7xl text-coral-300">404</p>
      <h1 className="mt-4 font-display text-3xl text-sand-50">
        This reef drifted away.
      </h1>
      <p className="mt-3 max-w-sm text-sand-100/60">
        The page you were looking for could not be found.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-coral-400 px-8 py-3.5 text-sm font-semibold text-ocean-950 transition-transform hover:scale-[1.03]"
      >
        Back to home
      </Link>
    </main>
  );
}
