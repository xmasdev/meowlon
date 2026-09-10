"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export function ProfileAvatar() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.4;

    const controller = new AbortController();
    const { signal } = controller;

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

    return () => controller.abort();
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
      <div
        data-bgm-toggle
        role="button"
        tabIndex={0}
        aria-label="Toggle background music"
        onClick={toggle}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggle();
          }
        }}
        className="group relative cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
      >
        <div
          aria-hidden
          className="absolute inset-0 scale-110 rounded-full bg-cyan-500/25 blur-2xl"
        />
        <div className="relative rounded-full bg-gradient-to-tr from-cyan-400 via-sky-500 to-indigo-500 p-[2px] shadow-[0_0_50px_-5px_rgba(34,211,238,0.5)] transition-transform duration-300 group-hover:scale-[1.03]">
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
    </>
  );
}
