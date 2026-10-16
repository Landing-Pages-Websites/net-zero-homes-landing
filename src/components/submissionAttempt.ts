"use client";

import { useEffect, useSyncExternalStore } from "react";
import { FORM } from "@/lib/content";

// Page-wide, session-scoped "no resend" policy shared by every FormCard.
//
// The lead endpoint has no idempotency key, so once a request may have been
// sent, this browser session never sends another one, whatever the outcome.
// A non-PII marker in sessionStorage is written and read back BEFORE the hook
// is called; it survives same-tab reload/remount/back navigation. This is a
// local client policy, not server-side or global exactly-once delivery.
//
// The module state below is only ever written from browser event handlers and
// effects, so the server render always sees the initial idle state.

type AttemptPhase =
  | "idle"
  | "sending"
  | "accepted"
  | "unconfirmed"
  | "previous";

export interface AttemptState {
  phase: AttemptPhase;
  owner: string | null;
}

type BeginResult = "started" | "locked" | "storage-unavailable";

// Scoped to this site's form; the value carries no contact or form data.
const MARKER_KEY = `nzc_lead_attempt:${FORM.siteId}`;
const MARKER_VALUE = "attempted";
const IDLE: AttemptState = { phase: "idle", owner: null };

let state: AttemptState = IDLE;
const listeners = new Set<() => void>();

function setState(next: AttemptState): void {
  state = next;
  listeners.forEach((notify) => notify());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = (): AttemptState => state;
const getServerSnapshot = (): AttemptState => IDLE;

// Throws when storage is missing, blocked or throwing; callers fail closed.
function readMarker(): boolean {
  return window.sessionStorage.getItem(MARKER_KEY) === MARKER_VALUE;
}

function writeMarker(): boolean {
  try {
    window.sessionStorage.setItem(MARKER_KEY, MARKER_VALUE);
    return readMarker();
  } catch {
    return false;
  }
}

// Moves an idle page to "previous" when this session already attempted.
// Returns "unreadable" when storage cannot be read at all.
function lockIfMarked(owner: string | null): boolean | "unreadable" {
  try {
    if (!readMarker()) return false;
  } catch {
    return "unreadable";
  }
  setState({ phase: "previous", owner });
  return true;
}

// Unreadable storage is re-checked (and fails closed) on submit.
function restoreFromSession(): void {
  if (state.phase === "idle") lockIfMarked(null);
}

// Synchronously claims the single attempt for this session, or explains why
// not. Must run after validation and before the submission hook is invoked.
export function beginAttempt(owner: string): BeginResult {
  if (state.phase !== "idle") return "locked";
  const marked = lockIfMarked(owner);
  if (marked === "unreadable") return "storage-unavailable";
  if (marked) return "locked";
  if (!writeMarker()) return "storage-unavailable";
  setState({ phase: "sending", owner });
  return "started";
}

// The marker is kept either way, so a reload can never repeat this attempt.
export function finishAttempt(accepted: boolean): void {
  if (state.phase !== "sending") return;
  setState({ ...state, phase: accepted ? "accepted" : "unconfirmed" });
}

export function useSubmissionAttempt(): AttemptState {
  useEffect(restoreFromSession, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
