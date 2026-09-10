import Image from "next/image";
import { Terminal } from "@/components/terminal";
import { DiagonalDivider } from "@/components/diagonal-divider";
import Link from "next/link";
import { Clock } from "@/components/clock";

export default function Home() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6 py-20 sm:px-10">
      <div
        aria-hidden
        className="absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-cyan-500/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="absolute -right-24 bottom-0 h-[28rem] w-[28rem] rounded-full bg-indigo-500/15 blur-[130px]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#05070a_100%)]"
      />

      <section className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-10 md:flex-row md:justify-center md:gap-2 lg:gap-6">
        <div className="flex shrink-0 flex-col items-center gap-3">
          <div className="relative">
            <div
              aria-hidden
              className="absolute inset-0 scale-110 rounded-full bg-cyan-500/25 blur-2xl"
            />
            <div className="relative rounded-full bg-gradient-to-tr from-cyan-400 via-sky-500 to-indigo-500 p-[2px] shadow-[0_0_50px_-5px_rgba(34,211,238,0.5)]">
              <div className="rounded-full bg-[#05070a] p-1.5">
                <div className="relative h-40 w-40 overflow-hidden rounded-full sm:h-48 sm:w-48 lg:h-56 lg:w-56">
                  <Image
                    src="/image.png"
                    alt="Portrait of melon"
                    width={1000}
                    height={1100}
                    priority
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          <span className="font-mono text-xs tracking-wide text-zinc-500">
            credit: <Link href="https://x.com/Terenry_" target="_blank" rel="noopener noreferrer">
              @terenry
            </Link>
          </span>
          <Clock />
        </div>

        <DiagonalDivider className="hidden h-[340px] w-[130px] shrink-0 md:block" />
        <div
          aria-hidden
          className="h-px w-48 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent md:hidden"
        />

        <Terminal />
      </section>
    </main>
  );
}
