import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-dusk-900 px-4 py-24 text-center">
      <p className="font-mono text-xs tracking-[0.2em] text-ink-dim">ERROR 404</p>
      <h1 className="mt-4 text-5xl text-ember" style={{ fontFamily: "var(--font-dela-gothic)" }}>
        Nothing here
      </h1>
      <p className="mt-4 max-w-sm text-ink-muted">
        This page wandered off. Maybe it never existed.
      </p>
      <Link
        href="/"
        className="mt-8 rounded border border-dusk-600 px-4 py-2 font-mono text-sm text-peach transition-colors hover:border-ember hover:text-ember"
      >
        cd ~
      </Link>
    </main>
  );
}
