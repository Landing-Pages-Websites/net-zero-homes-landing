"use client";

import { useRef, useState } from "react";
import { useMegaLeadForm } from "@/hooks/useMegaLeadForm";
import {
  CTA,
  PHONE,
  TIRE_BRANDS,
  REVENUE_OPTIONS,
  EMPLOYEE_OPTIONS,
} from "@/lib/content";
import { Icon } from "@/components/icons";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    MegaTag?: {
      trackEvent?: (event: string, payload?: Record<string, unknown>) => void;
    };
  }
}

// ─── Validation (HARD RULE #8 — inline per-field, no native tooltips) ───

// RFC-5322-lite — the lead API server-validates the rest.
const EMAIL_RE = /^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/;

// NANP: area code & exchange each start 2-9 and may not be an N11.
const NANP_RE = /^[2-9](?!11)\d{2}[2-9](?!11)\d{2}\d{4}$/;

// Only these fields block submission. companyWebsite + primaryTireBrand are
// optional. annualRevenue "Under $2M" and employeeCount "Under 5" are
// REPORTING-ONLY answers — required to be chosen, but never disqualifying.
type FieldKey =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "annualRevenue"
  | "employeeCount";

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyWebsite: string;
  primaryTireBrand: string;
  annualRevenue: string;
  employeeCount: string;
}

const INITIAL: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  companyWebsite: "",
  primaryTireBrand: "",
  annualRevenue: "",
  employeeCount: "",
};

type FieldErrors = Partial<Record<FieldKey, string>>;

const REQUIRED_ORDER: FieldKey[] = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "annualRevenue",
  "employeeCount",
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
      if (digits.length !== 10) return "Please enter a valid 10-digit phone number.";
      if (!NANP_RE.test(digits)) return "Please enter a valid US phone number.";
      return undefined;
    }
    case "annualRevenue":
      return value ? undefined : "Please select your annual revenue.";
    case "employeeCount":
      return value ? undefined : "Please select your team size.";
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

interface FormCardProps {
  idPrefix?: string;
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  submitLabel?: string;
  routeSlug?: string;
  thankYouBody?: string;
}

export function FormCard({
  idPrefix = "hero",
  eyebrow = "Request your free demo",
  heading = "See TireServ mapped to your operation",
  subheading = "No cost, no commitment — every request gets a response within one business day.",
  submitLabel = CTA.primary,
  routeSlug,
  thankYouBody = "Thanks — your demo request is in. A member of the QBC Systems team will reach out within one business day to schedule a walkthrough built around your operation.",
}: FormCardProps) {
  const { submit } = useMegaLeadForm();

  const [data, setData] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Synchronous re-entrancy guard — blocks duplicate fires from rapid clicks
  // before React re-renders with the disabled state.
  const inFlightRef = useRef(false);
  const fieldRefs = useRef<Partial<Record<FieldKey, HTMLElement | null>>>({});

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

  const fireTracking = () => {
    if (typeof window === "undefined") return;
    const route =
      routeSlug || (typeof window !== "undefined" ? window.location.pathname : "/");
    // Mega optimizer event FIRST, then the GTM dataLayer signal.
    window.MegaTag?.trackEvent?.("form_submit", { form_route: route });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "form_submit", form_route: route });
  };

  // Validate FIRST, then submit. Button is type="button" so the optimizer's
  // capture-phase listener never fires on empty/invalid clicks.
  const handleValidateAndSubmit = async () => {
    if (inFlightRef.current || submitting || submitted) return;
    const allErrors = validateAll(data);
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setTouched({
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        annualRevenue: true,
        employeeCount: true,
      });
      const firstBad = REQUIRED_ORDER.find((k) => allErrors[k]);
      if (firstBad) {
        const el = fieldRefs.current[firstBad];
        try {
          (el as HTMLElement | null)?.focus({ preventScroll: false });
        } catch {
          el?.focus();
        }
      }
      return;
    }
    inFlightRef.current = true;
    setSubmitting(true);
    // Reporting qualification (does NOT block submit — every lead is delivered).
    const revenueDQ = data.annualRevenue === "Under $2M";
    const employeesDQ = data.employeeCount === "Under 5";
    const qualified = !(revenueDQ || employeesDQ);
    const disqualification_reason = revenueDQ && employeesDQ
      ? "revenue_and_headcount_below_threshold"
      : revenueDQ
        ? "revenue_under_2m"
        : employeesDQ
          ? "employees_under_5"
          : null;
    try {
      await submit({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
        phone: data.phone.replace(/\D/g, ""),
        companyWebsite: data.companyWebsite.trim(),
        primaryTireBrand: data.primaryTireBrand,
        annualRevenue: data.annualRevenue,
        employeeCount: data.employeeCount,
        qualified,
        disqualification_reason,
        route_slug:
          routeSlug ||
          (typeof window !== "undefined" ? window.location.pathname : "/"),
      });
      fireTracking();
      setSubmitted(true);
    } catch (err) {
      console.error("Form submission error:", err);
      // Still fire tracking + show thank-you so the user isn't stranded.
      fireTracking();
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNativeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const cardBase =
    "bg-white border border-[var(--color-border)] shadow-card-lg";

  if (submitted) {
    return (
      <div className={`${cardBase} rounded-2xl p-8 md:p-10`}>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[var(--color-primary)]/10">
            <Icon name="check" className="w-7 h-7 text-[var(--color-primary)]" strokeWidth={2.4} />
          </div>
          <h3 className="font-display text-2xl md:text-3xl text-[var(--color-text)]">
            Demo request received.
          </h3>
          <p className="text-[var(--color-muted)] text-base leading-relaxed">
            {thankYouBody}
          </p>
          <p className="text-[var(--color-muted)] text-sm">
            Prefer to talk now? Call{" "}
            <span className="font-semibold text-[var(--color-text)] whitespace-nowrap">
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
    "w-full rounded-lg px-3.5 py-2.5 text-sm bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] placeholder:text-[var(--color-muted-soft)] transition-colors focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-accent)]/40";
  const inputCls = (k: FieldKey) => `${fieldCls} ${showErr(k) ? "lp-input-error" : ""}`;

  return (
    <form
      onSubmit={handleNativeSubmit}
      noValidate
      aria-label="Request a free TireServ demo"
      className={`${cardBase} rounded-2xl p-6 md:p-7 space-y-3.5`}
    >
      <div className="space-y-1 mb-1">
        <p className="eyebrow">{eyebrow}</p>
        <h3 className="font-display text-xl md:text-[1.6rem] leading-tight text-[var(--color-text)]">
          {heading}
        </h3>
        <p className="text-sm text-[var(--color-muted)] leading-snug">{subheading}</p>
      </div>

      {/* First / Last */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${idPrefix}-firstName`} className="sr-only">First name</label>
          <input
            ref={(el) => { fieldRefs.current.firstName = el; }}
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
            aria-describedby={showErr("firstName") ? errId("firstName") : undefined}
            disabled={submitting}
          />
          {showErr("firstName") && (
            <p id={errId("firstName")} role="alert" aria-live="polite" className="lp-field-error">
              {errors.firstName}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${idPrefix}-lastName`} className="sr-only">Last name</label>
          <input
            ref={(el) => { fieldRefs.current.lastName = el; }}
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
            aria-describedby={showErr("lastName") ? errId("lastName") : undefined}
            disabled={submitting}
          />
          {showErr("lastName") && (
            <p id={errId("lastName")} role="alert" aria-live="polite" className="lp-field-error">
              {errors.lastName}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor={`${idPrefix}-email`} className="sr-only">Work email</label>
        <input
          ref={(el) => { fieldRefs.current.email = el; }}
          id={`${idPrefix}-email`}
          name="email"
          type="email"
          required
          pattern="[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}"
          autoComplete="email"
          placeholder="Work email"
          value={data.email}
          onChange={(e) => update("email", e.target.value)}
          onBlur={(e) => markTouched("email", e.target.value)}
          className={inputCls("email")}
          aria-invalid={showErr("email") || undefined}
          aria-describedby={showErr("email") ? errId("email") : undefined}
          disabled={submitting}
        />
        {showErr("email") && (
          <p id={errId("email")} role="alert" aria-live="polite" className="lp-field-error">
            {errors.email}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor={`${idPrefix}-phone`} className="sr-only">Phone</label>
        <input
          ref={(el) => { fieldRefs.current.phone = el; }}
          id={`${idPrefix}-phone`}
          name="phone"
          type="tel"
          required
          inputMode="numeric"
          autoComplete="tel"
          placeholder="Phone (10 digits)"
          value={data.phone}
          onChange={(e) => update("phone", formatPhone(e.target.value))}
          onBlur={(e) => markTouched("phone", e.target.value)}
          className={inputCls("phone")}
          aria-invalid={showErr("phone") || undefined}
          aria-describedby={showErr("phone") ? errId("phone") : undefined}
          disabled={submitting}
        />
        {showErr("phone") && (
          <p id={errId("phone")} role="alert" aria-live="polite" className="lp-field-error">
            {errors.phone}
          </p>
        )}
      </div>

      {/* Company website (optional) */}
      <div>
        <label htmlFor={`${idPrefix}-companyWebsite`} className="sr-only">
          Company website (optional)
        </label>
        <input
          id={`${idPrefix}-companyWebsite`}
          name="companyWebsite"
          type="text"
          autoComplete="url"
          placeholder="Company website (optional)"
          value={data.companyWebsite}
          onChange={(e) => update("companyWebsite", e.target.value)}
          className={fieldCls}
          disabled={submitting}
        />
      </div>

      {/* Primary tire brand (optional) */}
      <div className="relative">
        <label htmlFor={`${idPrefix}-primaryTireBrand`} className="sr-only">
          Primary tire brand (optional)
        </label>
        <select
          id={`${idPrefix}-primaryTireBrand`}
          name="primaryTireBrand"
          value={data.primaryTireBrand}
          onChange={(e) => update("primaryTireBrand", e.target.value)}
          className={`${fieldCls} appearance-none pr-9 ${data.primaryTireBrand ? "" : "text-[var(--color-muted-soft)]"}`}
          disabled={submitting}
        >
          <option value="">Primary tire brand (optional)</option>
          {TIRE_BRANDS.map((b) => (
            <option key={b} value={b} className="text-[var(--color-text)]">
              {b}
            </option>
          ))}
        </select>
        <ChevronDown />
      </div>

      {/* Qualifier note */}
      <p className="text-xs text-[var(--color-muted)] leading-snug pt-0.5">
        Two quick questions help us tailor the demo — every request gets a response
        regardless of your answers.
      </p>

      {/* Annual revenue / Employee count */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor={`${idPrefix}-annualRevenue`} className="sr-only">Annual revenue</label>
          <div className="relative">
            <select
              ref={(el) => { fieldRefs.current.annualRevenue = el; }}
              id={`${idPrefix}-annualRevenue`}
              name="annualRevenue"
              required
              value={data.annualRevenue}
              onChange={(e) => {
                update("annualRevenue", e.target.value);
                markTouched("annualRevenue", e.target.value);
              }}
              onBlur={(e) => markTouched("annualRevenue", e.target.value)}
              className={`${inputCls("annualRevenue")} appearance-none pr-9 ${data.annualRevenue ? "" : "text-[var(--color-muted-soft)]"}`}
              aria-invalid={showErr("annualRevenue") || undefined}
              aria-describedby={showErr("annualRevenue") ? errId("annualRevenue") : undefined}
              disabled={submitting}
            >
              <option value="">Annual revenue</option>
              {REVENUE_OPTIONS.map((o) => (
                <option key={o} value={o} className="text-[var(--color-text)]">{o}</option>
              ))}
            </select>
            <ChevronDown />
          </div>
          {showErr("annualRevenue") && (
            <p id={errId("annualRevenue")} role="alert" aria-live="polite" className="lp-field-error">
              {errors.annualRevenue}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${idPrefix}-employeeCount`} className="sr-only">Team size</label>
          <div className="relative">
            <select
              ref={(el) => { fieldRefs.current.employeeCount = el; }}
              id={`${idPrefix}-employeeCount`}
              name="employeeCount"
              required
              value={data.employeeCount}
              onChange={(e) => {
                update("employeeCount", e.target.value);
                markTouched("employeeCount", e.target.value);
              }}
              onBlur={(e) => markTouched("employeeCount", e.target.value)}
              className={`${inputCls("employeeCount")} appearance-none pr-9 ${data.employeeCount ? "" : "text-[var(--color-muted-soft)]"}`}
              aria-invalid={showErr("employeeCount") || undefined}
              aria-describedby={showErr("employeeCount") ? errId("employeeCount") : undefined}
              disabled={submitting}
            >
              <option value="">Team size</option>
              {EMPLOYEE_OPTIONS.map((o) => (
                <option key={o} value={o} className="text-[var(--color-text)]">{o}</option>
              ))}
            </select>
            <ChevronDown />
          </div>
          {showErr("employeeCount") && (
            <p id={errId("employeeCount")} role="alert" aria-live="polite" className="lp-field-error">
              {errors.employeeCount}
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleValidateAndSubmit}
        disabled={submitting || submitted}
        className="mt-1 w-full rounded-lg px-6 py-3.5 font-semibold text-base bg-[var(--color-primary)] text-white shadow-cta transition-all hover:bg-[var(--color-primary-hover)] hover:-translate-y-0.5 active:translate-y-0 active:bg-[var(--color-primary-active)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 disabled:bg-[var(--color-primary-disabled)] disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2"
      >
        {submitting ? "Submitting…" : submitLabel}
        {!submitting && <Icon name="arrow" className="w-4 h-4" strokeWidth={2.4} />}
      </button>

      <p className="text-xs text-center leading-relaxed text-[var(--color-muted)]">
        No spam. We&apos;ll only use your details to schedule your demo.
      </p>
    </form>
  );
}

function ChevronDown() {
  return (
    <svg
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
