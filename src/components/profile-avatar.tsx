"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

export function ProfileAvatar({ className }: { className?: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.4;

    const controller = new AbortController();
    const { signal } = controller;
    const listeners = new AbortController();

    audio.addEventListener("play", () => setPlaying(true), {
      signal: listeners.signal,
    });
    audio.addEventListener("pause", () => setPlaying(false), {
      signal: listeners.signal,
    });

    const start = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-bgm-toggle]")) return;
      void audio.play().catch(() => {});
      controller.abort();
    };

    void audio.play().catch(() => {});

    window.addEventListener("pointerdown", start, { signal });
    window.addEventListener("keydown", start, { signal });
    window.addEventListener("touchstart", start, { signal });

    return () => {
      controller.abort();
      listeners.abort();
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/bgm.mp3" loop preload="auto" />
      <button
        type="button"
        data-bgm-toggle
        data-playing={playing}
        aria-pressed={playing}
        aria-label={playing ? "Pause background music" : "Play background music"}
        title={playing ? "Pause music" : "Play music"}
        onClick={toggle}
        className={[
          "group relative block cursor-pointer rounded-[10px] outline-offset-4",
          className ?? "",
        ].join(" ")}
      >
        <span className="relative block overflow-hidden rounded-[10px] shadow-[0_30px_60px_-24px_rgba(200,78,65,0.55),0_10px_24px_-12px_rgba(7,11,21,0.8)] ring-1 ring-peach/15 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:-rotate-1">
          <Image
            src="/image.png"
            alt="melon's profile art: a dark, fluffy creature with ember-striped ears breathing a curl of fire in front of a pale sun"
            width={1000}
            height={1100}
            priority
            sizes="(min-width: 1024px) 270px, (min-width: 640px) 160px, 112px"
            className="block h-auto w-full"
          />
        </span>

        <span
          aria-hidden
          className="absolute bottom-2 right-2 flex h-7 items-center gap-1.5 rounded-full bg-dusk-900/85 px-2.5 text-ember shadow-[0_4px_12px_-4px_rgba(7,11,21,0.8)] ring-1 ring-peach/15 backdrop-blur-sm transition-colors group-hover:text-peach max-sm:bottom-1.5 max-sm:right-1.5 max-sm:h-6 max-sm:px-2"
        >
          <span className="flex h-3 items-end gap-[2px]">
            {[0.45, 0.9, 0.65].map((rest, index) => (
              <span
                key={index}
                className="eq-bar block h-full w-[3px] rounded-full bg-current"
                style={
                  {
                    "--eq-rest": rest,
                    animationDelay: `${index * -300}ms`,
                  } as CSSProperties
                }
              />
            ))}
          </span>
          <span className="font-mono text-[11px] leading-none text-ink-muted max-sm:hidden">
            {playing ? "on" : "off"}
          </span>
        </span>
      </button>
    </>
  );
}
