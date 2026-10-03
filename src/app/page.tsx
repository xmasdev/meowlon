import Link from "next/link";
import { Terminal } from "@/components/terminal";
import { DiagonalDivider } from "@/components/diagonal-divider";
import { Clock } from "@/components/clock";
import { FallingLeaves } from "@/components/falling-leaves";
import { ProfileAvatar } from "@/components/profile-avatar";

export default function Home() {
  return (
    <main className="relative isolate min-h-dvh w-full overflow-hidden">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div className="dusk-sky animate-horizon absolute inset-0" />
        <div className="dusk-sun animate-sun absolute left-1/2 top-[72vh] aspect-square w-[min(110vw,1100px)]" />
        <div className="grain absolute inset-0" />
      </div>

      <FallingLeaves />

      <div className="relative z-10 mx-auto grid min-h-dvh w-full max-w-[1180px] content-center gap-8 px-4 py-10 sm:px-8 sm:py-14 lg:grid-cols-[270px_100px_minmax(0,1fr)] lg:items-center lg:gap-6 lg:py-16">
        <header className="flex items-center gap-5 sm:gap-7 lg:flex-col lg:items-start lg:gap-0">
          <figure className="w-28 shrink-0 sm:w-40 lg:w-full">
            <ProfileAvatar />
            <figcaption className="mt-2 hidden font-mono text-xs text-ink-dim lg:block">
              art by{" "}
              <Link
                href="https://x.com/Terenry_"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-muted underline decoration-ember/50 underline-offset-[3px] transition-colors hover:text-peach hover:decoration-ember"
              >
                @terenry
              </Link>
            </figcaption>
          </figure>

          <div className="min-w-0 lg:mt-8">
            <h1 className="font-display text-[clamp(2.5rem,9vw,4.25rem)] leading-[0.9] tracking-[-0.02em] text-peach">
              melon
            </h1>
            <Clock className="mt-3 block text-lg sm:text-2xl lg:mt-5 lg:text-[1.75rem]" />
            <p className="mt-2 font-mono text-xs text-ink-dim lg:hidden">
              art by{" "}
              <Link
                href="https://x.com/Terenry_"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-muted underline decoration-ember/50 underline-offset-[3px]"
              >
                @terenry
              </Link>
            </p>
          </div>
        </header>

        <DiagonalDivider className="hidden h-[340px] w-[100px] lg:block" />

        <Terminal />
      </div>
    </main>
  );
}
