import type { Metadata } from "next";
import Link from "next/link";
import { WUFF_CONTACT, legalStyles, WuffLegalPage } from "@/components/wuff-legal";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.meowlon.com"),
  title: "Delete your data · wuff",
  description: "How to delete some or all of your Wuff data without deleting your account.",
  icons: { icon: "/wuff/icon.png" },
};

const mailto =
  `mailto:${WUFF_CONTACT}?subject=${encodeURIComponent("Delete some of my Wuff data")}` +
  `&body=${encodeURIComponent(
    "Please delete this data from my Wuff account:\n\n\nThe email I sign in to Wuff with: \nMy Wuff username: \n",
  )}`;

export default function WuffDeleteData() {
  return (
    <WuffLegalPage title="Delete your Wuff data" updated="23 October 2026" path="/wuff/delete-data">
      <p>
        You can delete parts of your data in Wuff, made by melon (meowlon), and keep your account.
        To delete everything, see <Link href="/wuff/delete-account">Delete your Wuff account</Link>.
      </p>

      <h2>In the app</h2>
      <ul>
        <li>
          <strong>Messages, photos and voice messages</strong>: hold a message you sent and tap{" "}
          <strong>Delete message</strong>. Its words and attachments are wiped for everyone
          straight away.
        </li>
        <li>
          <strong>Stickers</strong>: open the sticker panel, hold a sticker and tap{" "}
          <strong>Remove</strong>. Its file is deleted.
        </li>
        <li>
          <strong>Profile details, pictures and links</strong>: go to <strong>Me → Edit</strong>{" "}
          and change or clear them. The old details are replaced straight away.
        </li>
        <li>
          <strong>Location</strong>: stop live location shares from the Map tab, and turn off{" "}
          <strong>Show me on the map</strong> or turn on <strong>Invisible</strong> in Me.
          Stopping your shares removes your live location from the server.
        </li>
        <li>
          <strong>Communities and meets</strong>: leave a community or cancel your RSVP. Your
          membership or RSVP is removed.
        </li>
        <li>
          <strong>Friends and blocks</strong>: unfriend or unblock someone from their
          profile or from <strong>Me → Blocked</strong>.
        </li>
      </ul>

      <h2>By email</h2>
      <div className={legalStyles.box}>
        <p>
          For anything else, email <a href={`mailto:${WUFF_CONTACT}`}>{WUFF_CONTACT}</a> from the
          email address you sign in with, saying what you want deleted. We confirm it is your
          account, delete it, and reply within 30 days.
        </p>
        <a className={legalStyles.button} href={mailto}>
          Email a data deletion request
        </a>
      </div>

      <h2>What is kept</h2>
      <ul>
        <li>
          Files from messages you deleted (photos and voice messages) can no longer be seen by
          anyone, but stay in storage until you delete your account or ask us by email to remove
          them.
        </li>
        <li>Copies in the hosting provider&apos;s backups are gone within 30 days.</li>
        <li>
          Content that breaks the law or was reported for child safety may be kept as long as the
          law requires.
        </li>
      </ul>
      <p>
        More in the <Link href="/wuff/privacy">privacy policy</Link>.
      </p>
    </WuffLegalPage>
  );
}
