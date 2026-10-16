import type { Ref } from "react";
import { PHONE, PHONE_HREF } from "@/lib/content";
import type { AttemptState } from "@/components/submissionAttempt";

type NoticeKind = "unconfirmed" | "previous" | "storage-unavailable";

const CHECK = "and we\u2019ll check for you.";

// Each notice reads "{title} {body} Call {PHONE} {close}".
const COPY: Record<NoticeKind, { title: string; body: string; close: string }> = {
  unconfirmed: {
    title: "We couldn\u2019t confirm we received your request.",
    body: "It may already have reached our team, so this form won\u2019t send it again.",
    close: CHECK,
  },
  previous: {
    title: "You already started a request from this page.",
    body: "We can\u2019t confirm from here whether it reached our team, so this form won\u2019t send it again.",
    close: CHECK,
  },
  "storage-unavailable": {
    title: "Your request wasn\u2019t sent.",
    body: "Your browser\u2019s settings stopped this form from sending it. Your details are still here.",
    close: "and we\u2019ll take your request by phone.",
  },
};

// Which notice (if any) this card shows. Only the card whose own action in
// this mount produced it announces it as an alert and takes focus.
export function noticeFor(
  attempt: AttemptState,
  idPrefix: string,
  storageBlocked: boolean,
  acted: boolean
): { kind: NoticeKind; announce: boolean } | null {
  const announce = acted && attempt.owner === idPrefix;
  const { phase } = attempt;
  if (phase === "unconfirmed" || phase === "previous") return { kind: phase, announce };
  if (phase === "idle" && storageBlocked) {
    return { kind: "storage-unavailable", announce: true };
  }
  return null;
}

interface SubmissionNoticeProps {
  id: string;
  kind: NoticeKind;
  announce: boolean;
  noticeRef?: Ref<HTMLParagraphElement>;
}

export function SubmissionNotice({
  id,
  kind,
  announce,
  noticeRef,
}: SubmissionNoticeProps): React.JSX.Element {
  const { title, body, close } = COPY[kind];
  return (
    <p
      ref={noticeRef}
      id={id}
      role={announce ? "alert" : undefined}
      tabIndex={-1}
      data-notice={kind}
      className="rounded-lg border-[1.5px] border-[var(--color-error)]/40 bg-[var(--color-error)]/6 px-3.5 py-3 text-sm leading-snug text-[var(--color-text-dark)] outline-none"
    >
      <span className="block font-bold text-[var(--color-error)]">{title}</span>
      {body} Call{" "}
      <a
        href={PHONE_HREF}
        className="whitespace-nowrap rounded-sm font-semibold underline underline-offset-2 transition-colors hover:text-[var(--color-error)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-hover)]"
      >
        {PHONE}
      </a>
      {" "}
      {close}
    </p>
  );
}
