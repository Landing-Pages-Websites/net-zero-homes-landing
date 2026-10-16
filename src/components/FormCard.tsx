"use client";

import { useEffect, useRef, useState } from "react";
import { useMegaLeadForm } from "@/hooks/useMegaLeadForm";
import {
  BUDGET_LABEL,
  BUDGET_OPTIONS,
  DISQUALIFYING_BUDGET,
  HERO,
  PHONE,
} from "@/lib/content";
import { Icon } from "@/components/icons";
import { SubmissionNotice, noticeFor } from "@/components/SubmissionNotice";
import {
  beginAttempt,
  finishAttempt,
  useSubmissionAttempt,
} from "@/components/submissionAttempt";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    MegaTag?: {
      trackEvent?: (event: string, payload?: Record<string, unknown>) => void;
    };
  }
}

// ─── Validation (inline per-field, no native tooltips) ───
const EMAIL_RE = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;
// NANP: area code & exchange each start 2-9 and may not be an N11.
const NANP_RE = /^[2-9](?!11)\d{2}[2-9](?!11)\d{2}\d{4}$/;

type FieldKey = "firstName" | "lastName" | "email" | "phone" | "projectBudget";

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  projectBudget: string;
}

const INITIAL: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  projectBudget: "",
};

type FieldErrors = Partial<Record<FieldKey, string>>;

const REQUIRED_ORDER: FieldKey[] = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "projectBudget",
];

function validateField(key: FieldKey, value: string): string | undefined {
  switch (key) {
    case "firstName":
      return value.trim() ? undefined : "First name is required.";
    case "lastName":
      return value.trim() ? undefined : "Last name is required.";
    case "email": {
      const v = value.trim();
      if (!v) return "Email address is required.";
      if (!EMAIL_RE.test(v)) return "Please enter a valid email address.";
      return undefined;
    }
    case "phone": {
      const digits = value.replace(/\D/g, "");
      if (!digits) return "Phone number is required.";
      if (digits.length !== 10)
        return "Please enter a valid 10-digit phone number.";
      if (!NANP_RE.test(digits)) return "Please enter a valid US phone number.";
      return undefined;
    }
    case "projectBudget":
      return value ? undefined : "Please select an estimated budget.";
  }
}

function validateAll(data: FormState): FieldErrors {
  const errors: FieldErrors = {};
  REQUIRED_ORDER.forEach((k) => {
    const err = validateField(k, data[k]);
    if (err) errors[k] = err;
  });
  return errors;
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (!digits) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

// Only an explicit affirmative application response counts as a captured
// lead. A resolved promise or HTTP 2xx alone is NOT success.
function isAccepted(result: unknown): boolean {
  return (result as { ok?: unknown } | null)?.ok === true;
}

interface FormCardProps {
  idPrefix?: string;
  heading?: string;
  helper?: string;
  reassurance?: string;
  routeSlug?: string;
}

export function FormCard({
  idPrefix = "hero",
  heading = HERO.formHeading,
  helper = HERO.formHelper,
  reassurance = HERO.reassurance,
  routeSlug,
}: FormCardProps): React.JSX.Element {
  const { submit } = useMegaLeadForm();

  const [data, setData] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>(
    {}
  );
  // Page-wide attempt shared with the other card. Once a request may have
  // been sent, neither card sends again in this browser session.
  const attempt = useSubmissionAttempt();
  const submitting = attempt.phase === "sending" && attempt.owner === idPrefix;
  const [storageBlocked, setStorageBlocked] = useState(false);
  // Bumped whenever this card's own action produces a notice to focus.
  const [noticeFocus, setNoticeFocus] = useState(0);

  const fieldRefs = useRef<Partial<Record<FieldKey, HTMLElement | null>>>({});
  const noticeRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    if (noticeFocus > 0) noticeRef.current?.focus();
  }, [noticeFocus]);

  const update = (k: keyof FormState, v: string) => {
    setData((d) => ({ ...d, [k]: v }));
    setErrors((prev) => {
      if (!(k in prev)) return prev;
      const key = k as FieldKey;
      if (!prev[key]) return prev;
      const err = validateField(key, v);
      if (err) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const markTouched = (k: FieldKey, currentValue: string) => {
    setTouched((t) => ({ ...t, [k]: true }));
    const err = validateField(k, currentValue);
    setErrors((prev) => {
      const next = { ...prev };
      if (err) next[k] = err;
      else delete next[k];
      return next;
    });
  };

  // Mega optimizer event FIRST, then the GTM dataLayer signal. form_submit
  // fires on EVERY submission; qualified_lead only when the budget qualifies.
  const fireTracking = (qualified: boolean) => {
    if (typeof window === "undefined") return;
    const route = routeSlug || window.location.pathname;
    window.MegaTag?.trackEvent?.("form_submit", { form_route: route });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "form_submission", form_route: route });
    if (qualified) {
      window.MegaTag?.trackEvent?.("qualified_lead", { form_route: route });
      window.dataLayer.push({ event: "qualified_lead", form_route: route });
    }
  };

  const showValidationErrors = (allErrors: FieldErrors) => {
    setErrors(allErrors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      projectBudget: true,
    });
    const firstBad = REQUIRED_ORDER.find((k) => allErrors[k]);
    if (!firstBad) return;
    const el = fieldRefs.current[firstBad];
    try {
      el?.focus({ preventScroll: false });
    } catch {
      el?.focus();
    }
  };

  // Resolves true only when the endpoint explicitly accepted the lead. Every
  // other outcome is UNCONFIRMED: the lead may still have been stored, and
  // the hook has no idempotency key, so it is never resent.
  const sendLead = async (qualified: boolean): Promise<boolean> => {
    try {
      const result: unknown = await submit({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
        phone: data.phone.replace(/\D/g, ""),
        projectBudget: data.projectBudget,
        qualified,
        disqualification_reason: qualified ? null : "budget_under_1m",
        route_slug: routeSlug || window.location.pathname,
      });
      return isAccepted(result);
    } catch {
      return false;
    }
  };

  // Validate FIRST, then claim the page-wide attempt, then submit. Button is
  // type="button" so the optimizer's capture-phase listener never fires on
  // empty/invalid clicks. beginAttempt is synchronous, so same-tick clicks on
  // either card cannot both reach the hook.
  const handleValidateAndSubmit = async () => {
    const allErrors = validateAll(data);
    if (Object.keys(allErrors).length > 0) {
      showValidationErrors(allErrors);
      return;
    }
    const claim = beginAttempt(idPrefix);
    setStorageBlocked(claim === "storage-unavailable");
    if (claim !== "started") {
      setNoticeFocus((n) => n + 1);
      return;
    }
    // Reporting qualification — does NOT block submit. Every lead is delivered,
    // emailed and written to Keystone; only the qualified flag differs.
    const qualified = data.projectBudget !== DISQUALIFYING_BUDGET;
    const accepted = await sendLead(qualified);
    finishAttempt(accepted);
    if (!accepted) {
      setNoticeFocus((n) => n + 1);
      return;
    }
    try {
      fireTracking(qualified);
    } catch {
      // An analytics side effect must never undo an accepted lead.
    }
  };

  const handleNativeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const cardBase =
    "rounded-2xl border border-[var(--color-sand)] bg-[var(--color-surface-2)] shadow-form";

  // Only the card that sent the accepted lead thanks the visitor; the other
  // card keeps its form, locked, with a session-lock notice.
  if (attempt.phase === "accepted" && attempt.owner === idPrefix) {
    return (
      <div className={`${cardBase} p-8 md:p-10`}>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-primary)]/15">
            <Icon
              name="check"
              className="h-7 w-7 text-[var(--color-primary-hover)]"
              strokeWidth={2.4}
            />
          </div>
          <h3 className="t-h3 text-[var(--color-text-dark)]">
            Thank you — we&apos;ve got your project details.
          </h3>
          <p className="t-body text-[var(--color-muted-dark)]">
            A member of our team will be in touch to discuss your goals,
            location, and timeline.
          </p>
          <p className="text-sm text-[var(--color-muted-dark)]">
            Prefer to talk now? Call{" "}
            <span className="font-semibold text-[var(--color-text-dark)]">
              {PHONE}
            </span>
            .
          </p>
        </div>
      </div>
    );
  }

  const showErr = (k: FieldKey) => Boolean(touched[k] && errors[k]);
  const errId = (k: FieldKey) => `${idPrefix}-${k}-error`;
  const fieldCls =
    "w-full rounded-lg border-[1.5px] border-[var(--color-border-light)] bg-white px-3.5 py-3 text-[0.95rem] text-[var(--color-text-dark)] placeholder:text-[var(--color-muted-dark)]/70 transition-colors hover:border-[var(--color-primary)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-[3px] focus:ring-[rgba(140,165,61,0.25)]";
  const inputCls = (k: FieldKey) =>
    `${fieldCls} ${showErr(k) ? "lp-input-error" : ""}`;
  const labelCls =
    "mb-1.5 block text-[0.8125rem] font-semibold text-[var(--color-muted-dark)]";
  const notice = noticeFor(attempt, idPrefix, storageBlocked, noticeFocus > 0);
  const noticeId = `${idPrefix}-submit-error`;

  return (
    <form
      onSubmit={handleNativeSubmit}
      noValidate
      aria-label="Request a consultation with Net Zero Construction"
      aria-describedby={notice ? noticeId : undefined}
      className={`${cardBase} space-y-4 p-6 md:p-7`}
    >
      <div className="space-y-1.5">
        <h3 className="t-h4 font-extrabold text-[var(--color-text-dark)]">
          {heading}
        </h3>
        <p className="text-sm leading-snug text-[var(--color-muted-dark)]">
          {helper}
        </p>
      </div>

      {/* First / Last */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idPrefix}-firstName`} className={labelCls}>
            First Name
          </label>
          <input
            ref={(el) => {
              fieldRefs.current.firstName = el;
            }}
            id={`${idPrefix}-firstName`}
            name="firstName"
            type="text"
            required
            autoComplete="given-name"
            placeholder="First name"
            value={data.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            onBlur={(e) => markTouched("firstName", e.target.value)}
            className={inputCls("firstName")}
            aria-invalid={showErr("firstName") || undefined}
            aria-describedby={
              showErr("firstName") ? errId("firstName") : undefined
            }
            disabled={submitting}
          />
          {showErr("firstName") && (
            <p
              id={errId("firstName")}
              role="alert"
              aria-live="polite"
              className="lp-field-error"
            >
              {errors.firstName}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${idPrefix}-lastName`} className={labelCls}>
            Last Name
          </label>
          <input
            ref={(el) => {
              fieldRefs.current.lastName = el;
            }}
            id={`${idPrefix}-lastName`}
            name="lastName"
            type="text"
            required
            autoComplete="family-name"
            placeholder="Last name"
            value={data.lastName}
            onChange={(e) => update("lastName", e.target.value)}
            onBlur={(e) => markTouched("lastName", e.target.value)}
            className={inputCls("lastName")}
            aria-invalid={showErr("lastName") || undefined}
            aria-describedby={
              showErr("lastName") ? errId("lastName") : undefined
            }
            disabled={submitting}
          />
          {showErr("lastName") && (
            <p
              id={errId("lastName")}
              role="alert"
              aria-live="polite"
              className="lp-field-error"
            >
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor={`${idPrefix}-email`} className={labelCls}>
          Email Address
        </label>
        <input
          ref={(el) => {
            fieldRefs.current.email = el;
          }}
          id={`${idPrefix}-email`}
          name="email"
          type="email"
          required
          pattern="[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}"
          autoComplete="email"
          placeholder="you@example.com"
          value={data.email}
          onChange={(e) => update("email", e.target.value)}
          onBlur={(e) => markTouched("email", e.target.value)}
          className={inputCls("email")}
          aria-invalid={showErr("email") || undefined}
          aria-describedby={showErr("email") ? errId("email") : undefined}
          disabled={submitting}
        />
        {showErr("email") && (
          <p
            id={errId("email")}
            role="alert"
            aria-live="polite"
            className="lp-field-error"
          >
            {errors.email}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor={`${idPrefix}-phone`} className={labelCls}>
          Phone Number
        </label>
        <input
          ref={(el) => {
            fieldRefs.current.phone = el;
          }}
          id={`${idPrefix}-phone`}
          name="phone"
          type="tel"
          required
          pattern="\(\d{3}\) \d{3}-\d{4}"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="(941) 000-0000"
          value={data.phone}
          onChange={(e) => update("phone", formatPhone(e.target.value))}
          onBlur={(e) => markTouched("phone", e.target.value)}
          className={inputCls("phone")}
          aria-invalid={showErr("phone") || undefined}
          aria-describedby={showErr("phone") ? errId("phone") : undefined}
          disabled={submitting}
        />
        {showErr("phone") && (
          <p
            id={errId("phone")}
            role="alert"
            aria-live="polite"
            className="lp-field-error"
          >
            {errors.phone}
          </p>
        )}
      </div>

      {/* Project budget (the qualifier) */}
      <div>
        <label htmlFor={`${idPrefix}-projectBudget`} className={labelCls}>
          {BUDGET_LABEL}
        </label>
        <div className="relative">
          <select
            ref={(el) => {
              fieldRefs.current.projectBudget = el;
            }}
            id={`${idPrefix}-projectBudget`}
            name="projectBudget"
            required
            value={data.projectBudget}
            onChange={(e) => {
              update("projectBudget", e.target.value);
              markTouched("projectBudget", e.target.value);
            }}
            onBlur={(e) => markTouched("projectBudget", e.target.value)}
            className={`${inputCls("projectBudget")} appearance-none pr-10 ${
              data.projectBudget ? "" : "text-[var(--color-muted-dark)]/70"
            }`}
            aria-invalid={showErr("projectBudget") || undefined}
            aria-describedby={
              showErr("projectBudget") ? errId("projectBudget") : undefined
            }
            disabled={submitting}
          >
            <option value="">Select an estimated budget</option>
            {BUDGET_OPTIONS.map((o) => (
              <option
                key={o}
                value={o}
                className="text-[var(--color-text-dark)]"
              >
                {o}
              </option>
            ))}
          </select>
          <Icon
            name="chevron"
            className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-dark)]"
            strokeWidth={2}
          />
        </div>
        {showErr("projectBudget") && (
          <p
            id={errId("projectBudget")}
            role="alert"
            aria-live="polite"
            className="lp-field-error"
          >
            {errors.projectBudget}
          </p>
        )}
      </div>

      {notice && (
        <SubmissionNotice
          id={noticeId}
          kind={notice.kind}
          announce={notice.announce}
          noticeRef={noticeRef}
        />
      )}

      <button
        type="button"
        onClick={handleValidateAndSubmit}
        disabled={attempt.phase !== "idle"}
        aria-describedby={notice ? noticeId : undefined}
        className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-primary)] px-6 py-3.5 text-base font-bold text-[var(--color-primary-ink)] transition-all hover:-translate-y-px hover:bg-[var(--color-primary-hover)] hover:text-white active:translate-y-0 active:bg-[var(--color-primary-active)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-hover)] focus-visible:ring-offset-2 disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-[var(--color-sand)] disabled:text-[var(--color-muted-dark)]"
      >
        {submitting ? "Sending…" : "Request a Consultation"}
        {!submitting && (
          <Icon name="arrow" className="h-4 w-4" strokeWidth={2.2} />
        )}
      </button>

      <p className="text-center text-xs leading-relaxed text-[var(--color-muted-dark)]">
        {reassurance}
      </p>
    </form>
  );
}
