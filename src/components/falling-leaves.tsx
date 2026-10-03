"use client";

import type { CSSProperties } from "react";

const LEAF_COUNT = 16;

const COLORS = [
  "#9a5a3a",
  "#b8683f",
  "#7d4a34",
  "#c87a48",
  "#8c4a3c",
  "#a8664a",
  "#6e4434",
];

const LEAF_PATH =
  "M16 1 C13.5 4.5 10.5 7 8 10 C5.5 13 4.5 17 5.5 21 C6.3 24 8 26.5 10.5 28 C12 29 14 29.7 16 31.5 C18 29.7 20 29 21.5 28 C24 26.5 25.7 24 26.5 21 C27.5 17 26.5 13 24 10 C21.5 7 18.5 4.5 16 1 Z";

const STEM = "M16 30.8 L16 33.6";

const MIDRIB = "M16 3.6 C15.6 10 15.6 20 16 30.4";

const VEINS =
  "M15.8 8.5 C13.6 9.6 11.7 11 10 12.8 " +
  "M15.8 12.5 C13.8 13.6 12.1 15 10.6 16.8 " +
  "M15.8 16.5 C14.1 17.5 12.7 18.8 11.7 20.4 " +
  "M16.2 8.5 C18.4 9.6 20.3 11 22 12.8 " +
  "M16.2 12.5 C18.2 13.6 19.9 15 21.4 16.8 " +
  "M16.2 16.5 C17.9 17.5 19.3 18.8 20.3 20.4";

const WRINKLES =
  "M9.5 15 C11 16.5 11.5 18.5 10.5 20.5 " +
  "M22.5 15 C21 16.5 20.5 18.5 21.5 20.5 " +
  "M12.8 24.6 C14.5 25.6 17.5 25.6 19.2 24.6 " +
  "M12.5 6.8 C13.4 8 13.7 9.2 13.5 10.5 " +
  "M19.5 6.8 C18.6 8 18.3 9.2 18.5 10.5";

// Rounded so server and client serialize identical style strings.
function seeded(index: number, salt: number): number {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return Math.round((value - Math.floor(value)) * 1000) / 1000;
}

export function FallingLeaves() {
  const leaves = Array.from({ length: LEAF_COUNT }, (_, index) => ({
    startLeft: 45 + seeded(index, 1) * 65,
    drift: -(35 + seeded(index, 2) * 55),
    sway: 14 + seeded(index, 3) * 38,
    size: 16 + seeded(index, 4) * 20,
    duration: 10 + seeded(index, 5) * 11,
    delay: -seeded(index, 6) * 22,
    opacity: 0.35 + seeded(index, 7) * 0.4,
    color: COLORS[Math.floor(seeded(index, 8) * COLORS.length)],
    spin: seeded(index, 9) > 0.5 ? 1 : -1,
    flip: seeded(index, 10) > 0.5,
    wobble: 1.6 + seeded(index, 11) * 2.2,
  }));

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
    >
      {leaves.map((leaf, index) => (
        <span
          key={index}
          className="leaf"
          style={
            {
              left: `${leaf.startLeft}%`,
              width: `${leaf.size}px`,
              height: `${leaf.size}px`,
              opacity: leaf.opacity,
              animationDuration: `${leaf.duration}s`,
              animationDelay: `${leaf.delay}s`,
              "--drift": `${leaf.drift}vw`,
              "--sway": `${leaf.sway}px`,
              "--spin": String(leaf.spin),
            } as CSSProperties
          }
        >
          <svg
            viewBox="0 0 32 32"
            width="100%"
            height="100%"
            style={{
              animationDuration: `${leaf.wobble}s`,
              animationDelay: `${-seeded(index, 12) * 3}s`,
            }}
          >
            <g
              transform={leaf.flip ? "translate(32 0) scale(-1 1)" : undefined}
            >
              <path d={LEAF_PATH} fill={leaf.color} />
              <path
                d={STEM}
                stroke="rgba(43, 26, 12, 0.5)"
                strokeWidth="0.9"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d={MIDRIB}
                stroke="rgba(43, 26, 12, 0.45)"
                strokeWidth="0.8"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d={VEINS}
                stroke="rgba(43, 26, 12, 0.32)"
                strokeWidth="0.6"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d={WRINKLES}
                stroke="rgba(43, 26, 12, 0.22)"
                strokeWidth="0.5"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </span>
      ))}
    </div>
  );
}
