import type { ReactNode } from "react";
import Link from "next/link";
import styles from "./wuff-legal.module.css";

export const WUFF_CONTACT = "melonberryie@gmail.com";

export const legalStyles = styles;

const pages = [
  { href: "/wuff/privacy", label: "Privacy policy" },
  { href: "/wuff/terms", label: "Terms" },
  { href: "/wuff/child-safety", label: "Child safety" },
  { href: "/wuff/delete-account", label: "Delete your account" },
];

// The Wuff logo: an orange speech-bubble dog head with a paw print.
function Mark() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden>
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

/** A plain reading page for Wuff's policies, with links between them. */
export function WuffLegalPage({
  title,
  updated,
  path,
  children,
}: {
  title: string;
  updated: string;
  path: string;
  children: ReactNode;
}) {
  return (
    <main className={styles.page}>
      <div className={styles.column}>
        <Link href="/wuff" className={styles.brand}>
          <Mark />
          wuff
        </Link>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.updated}>Last updated {updated}</p>
        <div className={styles.body}>{children}</div>
        <nav className={styles.foot} aria-label="Wuff policies">
          {pages.map((p) => (
            <Link key={p.href} href={p.href} aria-current={p.href === path ? "page" : undefined}>
              {p.label}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
