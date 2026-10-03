"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  const id = setInterval(callback, 1000);
  return () => clearInterval(id);
}

function getSnapshot(): number {
  return Math.floor(Date.now() / 1000);
}

function getServerSnapshot(): number | null {
  return null;
}

const TIME_FORMAT = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

export function Clock({ className }: { className?: string }) {
  const seconds = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const time = seconds === null ? "--:--:--" : TIME_FORMAT.format(seconds * 1000);

  return (
    <time
      suppressHydrationWarning
      className={`font-mono font-bold tabular-nums tracking-[0.12em] text-peach ${className ?? ""}`}
    >
      {time}
    </time>
  );
}
