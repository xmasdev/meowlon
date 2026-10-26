import type { Metadata } from "next";
import Link from "next/link";
import { WUFF_CONTACT, WuffLegalPage } from "@/components/wuff-legal";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.meowlon.com"),
  title: "Terms and conditions · wuff",
  description: "The rules for using Wuff, and what happens when they are broken.",
  icons: { icon: "/wuff/icon.png" },
};

export default function WuffTerms() {
  return (
    <WuffLegalPage title="Terms and conditions" updated="26 October 2026" path="/wuff/terms">
      <p>
        These terms are the agreement between you and melon (meowlon), who makes Wuff. By creating
        an account or using Wuff you agree to them and to the{" "}
        <Link href="/wuff/privacy">privacy policy</Link>. If you don&apos;t agree, please
        don&apos;t use Wuff.
      </p>

      <h2>Who can use Wuff</h2>
      <ul>
        <li>You must be 18 or older. Accounts belonging to anyone younger are deleted.</li>
        <li>One person per account. Keep your sign-in email secure; you are responsible for what
          happens on your account.</li>
        <li>You can&apos;t use Wuff if we have removed you before, or if the law where you live
          forbids it.</li>
      </ul>

      <h2>All ages and Adult only communities</h2>
      <p>
        Every community is either <strong>All ages</strong> or <strong>Adult only</strong>.
        Communities start as All ages, which means no sexual content. Adult only communities can
        have sexually explicit content. They don&apos;t show up in Find, and nobody can join one,
        until they turn on <strong>Show adult only communities</strong> in Me. Pictures, videos
        and stickers in them stay blurred until tapped.
      </p>
      <p>
        Sexually explicit content is only allowed inside Adult only communities. It is never
        allowed in profiles, profile pictures, banners, usernames, community names or pictures,
        Nearby, the map, meets, or All ages communities. In private and group chats, only send it
        to people who have clearly asked for it. Explicit content must be legal and involve only
        consenting adults.
      </p>

      <h2>What is not allowed</h2>
      <p>
        These rules apply everywhere in Wuff: profiles, pictures, stickers, chats, voice messages,
        communities (Dens) and meets. There is zero tolerance for objectionable content or abusive
        behaviour.
      </p>
      <ul>
        <li>
          <strong>Any sexual content involving minors</strong>, or anything that sexualises
          children or characters presented as children. This is reported to the authorities. See{" "}
          <Link href="/wuff/child-safety">child safety</Link>.
        </li>
        <li>
          <strong>Sexual content in the wrong place</strong>: sexually explicit content outside
          Adult only communities, or sending it to anyone who hasn&apos;t asked for it.
        </li>
        <li>
          <strong>Harassment and bullying</strong>: threats, intimidation, repeated unwanted
          contact, or encouraging others to target someone.
        </li>
        <li>
          <strong>Hate</strong>: attacking people for race, ethnicity, religion, disability, sex,
          gender identity, sexual orientation, age or any similar trait.
        </li>
        <li>
          <strong>Violence</strong>: threats of violence, glorifying violence or terrorism, or
          content that encourages self-harm.
        </li>
        <li>
          <strong>Privacy violations</strong>: sharing someone&apos;s real name, address, location,
          photos or other personal details without their permission (doxxing).
        </li>
        <li>
          <strong>Illegal activity</strong>: selling drugs, weapons or other regulated goods,
          fraud, scams, or anything else against the law.
        </li>
        <li>
          <strong>Impersonation and deception</strong>: pretending to be another person, artist or
          organisation, or lying about your age.
        </li>
        <li>
          <strong>Spam and abuse of the service</strong>: unwanted advertising, mass messaging,
          fake accounts, automation, or trying to break, overload or get around Wuff&apos;s
          security.
        </li>
        <li>
          <strong>Other people&apos;s work</strong>: posting art, photos or other content you
          don&apos;t have the right to share. Credit artists.
        </li>
      </ul>

      <h2>Reporting, blocking and moderation</h2>
      <p>
        You can report any profile, message or community from inside the app, and block anyone so
        you no longer see each other. Reports are anonymous and are reviewed by Wuff&apos;s
        moderators, usually within 48 hours. You can also report by email to{" "}
        <a href={`mailto:${WUFF_CONTACT}`}>{WUFF_CONTACT}</a>.
      </p>
      <p>
        When something breaks these rules we may remove it, limit what an account can do, or
        suspend or delete the account, without warning for serious cases. Community owners and
        moderators can also remove posts and members in their community, and must enforce these
        terms there. Content that may be illegal is reported to the authorities.
      </p>

      <h2>Encrypted chats</h2>
      <p>
        The words in direct messages and group chats are end-to-end encrypted, so nobody at Wuff
        can read them. These terms still apply inside them. When you report a message, your
        phone sends that message to the moderators with the report, so they can act on it.
        Photos, videos, stickers, voice messages and reactions, and everything in communities,
        are not end-to-end encrypted and can be reviewed by moderators when reported.
      </p>

      <h2>Your content</h2>
      <p>
        You keep ownership of what you post. You give Wuff permission to store it, show it to the
        people you share it with, and process it as needed to run the service. This permission
        ends when you delete the content or your account, except for copies others have already
        saved or that we must keep to deal with a report or legal request.
      </p>

      <h2>Meeting people</h2>
      <p>
        Wuff helps people meet in person. You are responsible for your own safety: meet in public
        places, tell a friend where you are going, and leave if you feel unsafe. Wuff does not
        check who members are beyond their stated age and is not responsible for how members
        behave online or offline.
      </p>

      <h2>The service</h2>
      <p>
        Wuff is free and is provided as it is, without guarantees that it will always be available
        or free of errors. Features may change or end. To the extent the law allows, melon is not
        liable for indirect losses, lost data or harm caused by other members. Nothing in these
        terms takes away rights you have under consumer law.
      </p>

      <h2>Ending your account</h2>
      <p>
        You can delete your account at any time from <strong>Me → Delete account</strong> in the
        app, or as described on <Link href="/wuff/delete-account">this page</Link>. We may end
        accounts that break these terms.
      </p>

      <h2>Your responsibility</h2>
      <p>
        You are responsible for what you post and for how you use Wuff. If your use of Wuff
        breaks these terms or the law and someone makes a claim against melon because of it, you
        agree to cover the reasonable costs of that claim, as far as the law allows.
      </p>

      <h2>Changes and contact</h2>
      <p>
        If these terms change, the date at the top changes, and the app tells you about important
        changes before they apply. Questions:{" "}
        <a href={`mailto:${WUFF_CONTACT}`}>{WUFF_CONTACT}</a>.
      </p>
    </WuffLegalPage>
  );
}
