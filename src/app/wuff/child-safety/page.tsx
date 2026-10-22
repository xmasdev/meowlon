import type { Metadata } from "next";
import Link from "next/link";
import { WUFF_CONTACT, WuffLegalPage } from "@/components/wuff-legal";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.meowlon.com"),
  title: "Child safety standards · wuff",
  description: "Wuff's standards against child sexual abuse and exploitation.",
  icons: { icon: "/wuff/icon.png" },
};

export default function WuffChildSafety() {
  return (
    <WuffLegalPage title="Child safety standards" updated="23 October 2026" path="/wuff/child-safety">
      <p>
        Wuff is an app for adults only, and has zero tolerance for child sexual abuse and
        exploitation (CSAE) and child sexual abuse material (CSAM). These are Wuff&apos;s
        published standards.
      </p>

      <h2>What is prohibited</h2>
      <ul>
        <li>Any content that sexualises minors, including drawings, stories, stickers and fursona
          art showing characters presented as children.</li>
        <li>Child sexual abuse material of any kind, and links to it.</li>
        <li>Grooming, sexual contact or any sexual communication with a minor, and trying to
          arrange to meet a minor.</li>
        <li>Sextortion, trafficking, or any other exploitation of children.</li>
        <li>People under 18 using Wuff at all.</li>
      </ul>

      <h2>How Wuff prevents it</h2>
      <ul>
        <li>Everyone gives their date of birth when signing up, and people under 18 can&apos;t
          create an account.</li>
        <li>Members can report any profile, message, picture or community from inside the app, and
          can block anyone.</li>
        <li>Reports of child safety concerns are reviewed first, usually within 24 hours.</li>
        <li>Accounts that break these standards are removed and can&apos;t return. Accounts found
          to belong to minors are deleted.</li>
      </ul>

      <h2>Reporting and the law</h2>
      <p>
        When we find or are told about CSAM, we remove it, keep what the law requires, and report
        it to the National Center for Missing &amp; Exploited Children (NCMEC) and to the relevant
        national authorities. We cooperate with law enforcement investigations and comply with
        child safety laws that apply to Wuff.
      </p>
      <p>
        To report a concern, use <strong>Report</strong> in the app, or email{" "}
        <a href={`mailto:${WUFF_CONTACT}`}>{WUFF_CONTACT}</a>. If a child is in immediate danger,
        contact your local police first.
      </p>

      <h2>Child safety contact</h2>
      <p>
        melon, the developer of Wuff, is the designated contact for child safety and can speak
        about Wuff&apos;s practices: <a href={`mailto:${WUFF_CONTACT}`}>{WUFF_CONTACT}</a>.
      </p>
      <p>
        See also the <Link href="/wuff/terms">terms of use</Link>.
      </p>
    </WuffLegalPage>
  );
}
