import type { Metadata } from "next";
import Link from "next/link";
import { WUFF_CONTACT, WuffLegalPage } from "@/components/wuff-legal";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.meowlon.com"),
  title: "Privacy policy · wuff",
  description: "What Wuff collects, why, who can see it, and how to delete it.",
  icons: { icon: "/wuff/icon.png" },
};

export default function WuffPrivacy() {
  return (
    <WuffLegalPage title="Privacy policy" updated="23 October 2026" path="/wuff/privacy">
      <p>
        Wuff is a social app for adult furries, made by melon (meowlon). This policy says what
        Wuff collects, why, who can see it, and how to delete it. It covers the Wuff app for
        Android and these pages. Questions or requests:{" "}
        <a href={`mailto:${WUFF_CONTACT}`}>{WUFF_CONTACT}</a>.
      </p>

      <h2>What Wuff collects</h2>
      <ul>
        <li>
          <strong>Email address</strong>, to sign you in with a one-time code. It is never shown to
          other members.
        </li>
        <li>
          <strong>Date of birth</strong>, only to check that you are 18 or older. It is never shown
          on your profile.
        </li>
        <li>
          <strong>Profile details you add</strong>: name, username, pronouns, species, bio,
          interests, what you are looking for, whether you have a fursuit, profile picture, banner,
          and links to your other accounts. Other members can see these. Links can be limited to
          friends.
        </li>
        <li>
          <strong>Location</strong>, only while Wuff is open and only if you allow it. For Nearby,
          the server keeps it snapped to a grid of about 500 m, and other members only ever see a
          rounded distance. If you choose to appear on the map, people near you see that rough
          area. If you share your live location with friends you pick, your phone sends its
          position and those friends see it, exact or rough as you choose, until the share ends or
          you stop it.
        </li>
        <li>
          <strong>Messages and what you post</strong>: chat messages, photos, stickers and voice
          messages, posts and rules in communities (Dens), and meets you plan or join. The words
          of direct messages and group chats are end-to-end encrypted: they are sealed on your
          phone for the phones of the people in the chat, and the server only stores the sealed
          copy, which nobody at Wuff can read. Photos, stickers and voice messages in those chats,
          and everything in communities, are not end-to-end encrypted; they are stored on the
          server and only shown to the people in the chat or community.
        </li>
        <li>
          <strong>Encryption keys</strong>: each phone you use makes its own key pair. The secret
          half never leaves the phone&apos;s secure storage; the public half is stored on the
          server so others can seal messages for you. A new phone can&apos;t read messages sent
          before it was set up.
        </li>
        <li>
          <strong>Activity that makes features work</strong>: friends and friend requests, boops,
          blocks, mutes, reports you file, community memberships, meet RSVPs, read receipts, and
          whether you are online or away (you can hide this).
        </li>
        <li>
          <strong>A push notification token</strong> for your phone, so Wuff can send you
          notifications. Notifications for encrypted chats carry the message sealed, and only your
          phone opens it; notifications for communities can include the start of a message.
        </li>
      </ul>
      <p>
        Wuff has no ads, no analytics or tracking tools, and no crash reporting. Your data is
        never sold or shared with anyone for advertising or marketing.
      </p>

      <h2>Why it is used</h2>
      <p>
        Only to run Wuff: signing you in, showing your profile, finding furs near you, delivering
        messages and notifications, running communities and meets, keeping members safe
        (age checks, blocks, reports and moderation), and answering requests you send us.
      </p>

      <h2>Services Wuff uses</h2>
      <ul>
        <li>
          <strong>Supabase</strong> hosts the database, sign-in and file storage.
        </li>
        <li>
          <strong>Expo push service and Google Firebase Cloud Messaging</strong> deliver
          notifications. They receive your push token and the notification, which for encrypted
          chats is sealed.
        </li>
        <li>
          <strong>Map tiles</strong> are loaded from OpenStreetMap&apos;s tile servers, and the map
          code from the unpkg content network. They see your phone&apos;s IP address and the map
          area you look at, not who you are.
        </li>
        <li>
          <strong>Link previews</strong>: when a message contains a link, your phone fetches that
          page to show its title and picture, so the website sees your IP address, as it would if
          you opened the link.
        </li>
        <li>
          <strong>Vercel</strong> hosts this website and counts page visits without cookies.
        </li>
      </ul>
      <p>
        These providers process data on Wuff&apos;s behalf and may store it on servers outside
        your country. All connections use encryption (HTTPS).
      </p>

      <h2>Who can see what</h2>
      <p>
        Other members see your profile, a rounded distance, and what you post in chats and
        communities you are part of. People you block can&apos;t see you at all. Community
        moderators can remove posts in their community, and Wuff&apos;s moderators review reported
        content and accounts. When you report a message, your phone sends what it shows you of
        that message with the report, because the server can&apos;t read encrypted chats. We share data with authorities only when the law requires it, or to
        report child sexual abuse material.
      </p>

      <h2>How long it is kept</h2>
      <p>
        Your data is kept while your account exists. When you delete your account it is removed
        straight away, apart from copies in the hosting provider&apos;s backups, which are gone
        within 30 days. Messages you sent in group chats and communities are deleted with your
        account. Live location shares are removed when they end.
      </p>

      <h2>Deleting your account and data</h2>
      <p>
        In the app, go to <strong>Me → Delete account</strong>. This removes your sign-in, profile,
        pictures, messages, encryption keys, friendships, boops, blocks, location shares, reports and
        push tokens. A
        group chat you started is handed to another member, and a community you own has to be
        handed over or deleted first. If you can&apos;t open the app, see{" "}
        <Link href="/wuff/delete-account">Delete your Wuff account</Link>.
      </p>
      <p>
        You can also ask for a copy of your data, or for a correction, by emailing{" "}
        <a href={`mailto:${WUFF_CONTACT}`}>{WUFF_CONTACT}</a>. We answer within 30 days.
      </p>

      <h2>Age</h2>
      <p>
        Wuff is only for people 18 and older. Accounts found to belong to someone younger are
        deleted. If you think a child is using Wuff, tell us at{" "}
        <a href={`mailto:${WUFF_CONTACT}`}>{WUFF_CONTACT}</a>.
      </p>

      <h2>Changes</h2>
      <p>
        If this policy changes, the date at the top changes, and the app tells you about important
        changes before they apply.
      </p>
    </WuffLegalPage>
  );
}
