import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./wuff.module.css";

const APK_URL = "/wuff.apk";

const description =
  "Find furs near you, keep up with friends, and hang out in communities.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.meowlon.com"),
  title: "wuff",
  description,
  icons: { icon: "/wuff/icon.png", apple: "/wuff/icon.png" },
  openGraph: { title: "wuff", description, url: "/wuff", siteName: "wuff", type: "website" },
  twitter: { card: "summary_large_image", title: "wuff", description },
};

export const viewport: Viewport = {
  themeColor: "#100F16",
};

const shots = [
  { src: "/wuff/welcome.jpg", alt: "Wuff welcome screen" },
  { src: "/wuff/dens.jpg", alt: "Finding communities to join" },
  { src: "/wuff/den.jpg", alt: "A community page" },
  { src: "/wuff/meet.jpg", alt: "Planning a meet" },
  { src: "/wuff/profile.jpg", alt: "Editing a profile" },
];

// Scattered paw prints in the background, same as the app's welcome screen.
const paws = [
  { top: "8%", left: "6%", size: 34, rot: -20, color: "#8B5CF6" },
  { top: "14%", left: "88%", size: 26, rot: 25, color: "#1FBFA0" },
  { top: "44%", left: "3%", size: 22, rot: 10, color: "#F2559B" },
  { top: "38%", left: "93%", size: 30, rot: -15, color: "#F5B829" },
  { top: "80%", left: "10%", size: 26, rot: 30, color: "#3BA3F5" },
  { top: "86%", left: "84%", size: 34, rot: -30, color: "#FF6A3D" },
];

function Paw({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 64 64" fill={color} aria-hidden>
      <ellipse cx="32" cy="41" rx="11" ry="9" />
      <circle cx="16" cy="29" r="5.5" />
      <circle cx="25" cy="20" r="5.5" />
      <circle cx="39" cy="20" r="5.5" />
      <circle cx="48" cy="29" r="5.5" />
    </svg>
  );
}

function Mark() {
  return (
    <svg viewBox="0 0 64 64" className={styles.mark} aria-hidden>
      <path
        fill="#FF6A3D"
        d="M12 22 L14.5 6.5 Q15.2 3.4 17.8 5.2 L28 14 L36 14 L46.2 5.2 Q48.8 3.4 49.5 6.5 L52 22 Q58 26 58 34 L58 42 Q58 54 46 54 L26 54 L15 61 Q12.5 62.4 12.8 59.6 L13.6 52.6 Q6 49 6 40 L6 34 Q6 26 12 22 Z"
      />
      <g fill="#100F16">
        <ellipse cx="32" cy="41" rx="7.6" ry="6.2" />
        <circle cx="22.4" cy="33.2" r="3.3" />
        <circle cx="28.2" cy="28.4" r="3.3" />
        <circle cx="35.8" cy="28.4" r="3.3" />
        <circle cx="41.6" cy="33.2" r="3.3" />
      </g>
    </svg>
  );
}

export default function WuffPage() {
  return (
    <main className={styles.page}>
      <div className={styles.glow} aria-hidden />
      {paws.map((p, i) => (
        <span
          key={i}
          className={styles.paw}
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            transform: `rotate(${p.rot}deg)`,
            animationDelay: `${i * 0.7}s`,
          }}
        >
          <Paw color={p.color} />
        </span>
      ))}

      <header className={styles.hero}>
        <Mark />
        <h1 className={styles.word}>wuff</h1>
        <p className={styles.line}>
          Find furs near you, keep up with friends, and hang out in communities.
        </p>
        <a className={styles.download} href={APK_URL} download="wuff.apk">
          <svg viewBox="0 0 24 24" aria-hidden>
            <path
              d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19.5h14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Download for Android
        </a>
        <span className={styles.meta}>wuff.apk · v1.1.1 · 53 MB</span>
      </header>

      <section className={styles.shots} aria-label="Screenshots">
        {shots.map((s, i) => (
          <figure key={s.src} className={styles.phone} style={{ "--i": i } as CSSProperties}>
            <Image src={s.src} alt={s.alt} width={390} height={844} priority={i === 2} />
          </figure>
        ))}
      </section>

      <footer className={styles.foot}>
        made by <Link href="/">melon</Link>
      </footer>
    </main>
  );
}
