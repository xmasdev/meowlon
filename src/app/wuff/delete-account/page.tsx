import type { Metadata } from "next";
import Link from "next/link";
import { WUFF_CONTACT, legalStyles, WuffLegalPage } from "@/components/wuff-legal";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.meowlon.com"),
  title: "Delete your account · wuff",
  description: "How to delete your Wuff account and the data that goes with it.",
  icons: { icon: "/wuff/icon.png" },
};

const mailto =
  `mailto:${WUFF_CONTACT}?subject=${encodeURIComponent("Delete my Wuff account")}` +
  `&body=${encodeURIComponent(
    "Please delete my Wuff account.\n\nThe email I sign in to Wuff with: \nMy Wuff username (if you remember it): \n",
  )}`;

export default function WuffDeleteAccount() {
  return (
    <WuffLegalPage title="Delete your Wuff account" updated="23 October 2026" path="/wuff/delete-account">
      <p>
        You can delete your Wuff account, made by melon (meowlon), at any time. Deleting it
        can&apos;t be undone.
      </p>

      <h2>In the app</h2>
      <ol>
        <li>Open Wuff and go to the <strong>Me</strong> tab.</li>
        <li>Scroll down and tap <strong>Delete account</strong>.</li>
        <li>Confirm. Your account is deleted straight away.</li>
      </ol>
      <p>
        If you own a community, hand it to another member or delete it first; the app shows you
        how.
      </p>

      <h2>Without the app</h2>
      <div className={legalStyles.box}>
        <p>
          Email <a href={`mailto:${WUFF_CONTACT}`}>{WUFF_CONTACT}</a> from the email address you
          sign in to Wuff with, asking for your account to be deleted. We confirm it is your
          account, delete it, and reply within 30 days.
        </p>
        <a className={legalStyles.button} href={mailto}>
          Email a deletion request
        </a>
      </div>

      <h2>What is deleted</h2>
      <ul>
        <li>Your sign-in, email address and date of birth.</li>
        <li>Your profile, profile picture, banner and links.</li>
        <li>Messages, photos, videos, stickers, voice messages and reactions you sent.</li>
        <li>Friends, boops, blocks, mutes, community memberships and meet RSVPs.</li>
        <li>Your location and any live location shares.</li>
        <li>Your phones&apos; encryption keys, reports you filed and your notification tokens.</li>
      </ul>

      <h2>What is kept</h2>
      <ul>
        <li>Group chats and communities you started stay for their other members, with a new
          owner.</li>
        <li>Copies in the hosting provider&apos;s backups are gone within 30 days.</li>
        <li>Content that breaks the law or was reported for child safety may be kept as long as the
          law requires.</li>
      </ul>
      <p>
        More in the <Link href="/wuff/privacy">privacy policy</Link>.
      </p>
    </WuffLegalPage>
  );
}
