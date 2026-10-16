// Minimal hooks host for exercising the REAL src/components/FormCard.tsx (and
// the real useMegaLeadForm hook + content) in plain Node, with no new deps.
//
// - Source is transpiled with the project's own `typescript` package.
// - `react` / `react/jsx-runtime` are replaced by a tiny hooks runtime that
//   mirrors React's closure semantics: event handlers captured from a render
//   keep that render's state until the test re-renders. That makes the
//   "rapid double click before React re-renders" case reproducible.
// - Transport is fully isolated: globalThis.fetch is a scripted fake and
//   MegaTag / dataLayer are in-memory recorders. Nothing leaves the process.
import { createRequire } from "node:module";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SRC = path.join(ROOT, "src");
export const ENDPOINT = "https://analytics.gomega.ai/submission/submit";

// ─── Fake React runtime ───
const Fragment = Symbol("Fragment");
let current = null;

function jsx(type, props, key) {
  if (props && typeof props.ref === "function" && current) {
    current.pendingRefs.push(props.ref);
  }
  return { type, props: props ?? {}, key };
}

function slot(init) {
  const inst = current;
  const i = inst.hookIndex++;
  if (!(i in inst.hooks)) inst.hooks[i] = init();
  return inst.hooks[i];
}

function useState(initial) {
  const inst = current;
  const s = slot(() => ({ value: typeof initial === "function" ? initial() : initial }));
  const set = (v) => {
    s.value = typeof v === "function" ? v(s.value) : v;
    inst.dirty = true;
  };
  return [s.value, set];
}

const useRef = (initial) => slot(() => ({ current: initial }));
const useCallback = (fn) => fn;

function useEffect(fn, deps) {
  const inst = current;
  const s = slot(() => ({ deps: undefined }));
  const changed = !deps || !s.deps || deps.some((d, i) => !Object.is(d, s.deps[i]));
  if (changed) {
    s.deps = deps;
    inst.effects.push(fn);
  }
}

const fakeReact = { Fragment, useState, useRef, useCallback, useEffect };
const fakeJsxRuntime = { jsx, jsxs: jsx, jsxDEV: jsx, Fragment };

// ─── Module loader (transpile TS/TSX, resolve "@/") ───
const cache = new Map();

function resolveSource(spec, fromDir) {
  const base = spec.startsWith("@/") ? path.join(SRC, spec.slice(2)) : path.resolve(fromDir, spec);
  const candidates = /\.tsx?$/.test(base) ? [base] : [`${base}.tsx`, `${base}.ts`];
  const found = candidates.find((c) => existsSync(c));
  if (found) return found;
  throw new Error(`harness: cannot resolve ${spec} from ${fromDir}`);
}

function loadModule(file) {
  if (cache.has(file)) return cache.get(file).exports;
  const { outputText } = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
    fileName: file,
  });
  const mod = { exports: {} };
  cache.set(file, mod);
  const localRequire = (spec) => {
    if (spec === "react") return fakeReact;
    if (spec === "react/jsx-runtime" || spec === "react/jsx-dev-runtime") return fakeJsxRuntime;
    if (spec.startsWith("@/") || spec.startsWith(".")) return loadModule(resolveSource(spec, path.dirname(file)));
    throw new Error(`harness: unexpected import "${spec}" in ${file}`);
  };
  new Function("exports", "require", "module", outputText)(mod.exports, localRequire, mod);
  return mod.exports;
}

export function loadSource(rel) {
  return loadModule(path.join(SRC, rel));
}

// ─── Isolated browser-ish globals + recorders ───
function memoryStorage() {
  const m = new Map();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, String(v)) };
}

function recordingWindow(env) {
  const dataLayer = [];
  dataLayer.push = (...items) => {
    env.dataLayer.push(...items);
    return Array.prototype.push.apply(dataLayer, items);
  };
  const trackEvent = (event, payload) => {
    env.megaTag.push({ event, ...payload });
    if (env.trackingThrows) throw new Error("tracking exploded");
  };
  return {
    location: { href: "https://info.netzerohomes.build/", pathname: "/" },
    dataLayer,
    MegaTag: { trackEvent },
  };
}

export function createEnv() {
  const env = { requests: [], megaTag: [], dataLayer: [], focused: null, responders: [], trackingThrows: false };
  globalThis.window = recordingWindow(env);
  globalThis.document = { cookie: "", referrer: "" };
  globalThis.localStorage = memoryStorage();
  globalThis.sessionStorage = memoryStorage();
  globalThis.fetch = async (url, init) => {
    const request = { url, body: JSON.parse(init.body) };
    env.requests.push(request);
    const respond = env.responders.shift();
    if (!respond) throw new Error("harness: unscripted request (no responder queued)");
    return respond(request);
  };
  return env;
}

// Scripted transport outcomes (never touch the network).
export const transport = {
  json: (status, body) => () => ({ ok: status >= 200 && status < 300, status, json: async () => body }),
  malformed: () => () => ({ ok: true, status: 200, json: async () => JSON.parse("<html>oops") }),
  networkError: () => () => Promise.reject(new TypeError("Failed to fetch")),
  deferred: () => {
    let resolve;
    const p = new Promise((r) => (resolve = r));
    const responder = () => p;
    responder.resolve = (status, body) => resolve(transport.json(status, body)());
    return responder;
  },
};

// In-memory MODEL of the lead platform's documented merge rule — not the real
// endpoint. Source: https://docs.gomega.ai/landing-pages/form-submission-guide#repeated-test-leads-and-the-shared-phone
// "merges a form submission into an earlier lead on the same site when the two
// share a phone or email and arrive within 2 minutes ... A submission after
// the window creates its own row and never modifies an earlier lead."
export const MERGE_WINDOW_MS = 2 * 60 * 1000;

export function leadPlatformModel() {
  const model = { rows: [], confirmedIds: [], nowMs: 0 };
  const shares = (a, b) => Boolean(a) && a === b;
  // Window measured from the earlier lead's arrival (strictest reading).
  const matches = (row, body, at) =>
    row.siteId === body.site_id &&
    at - row.receivedAt <= MERGE_WINDOW_MS &&
    (shares(row.data.phone, body.form_data.phone) || shares(row.data.email, body.form_data.email));
  const persist = ({ body }) => {
    const at = model.nowMs;
    const earlier = model.rows.find((row) => matches(row, body, at));
    if (earlier) return earlier.id;
    const row = { id: `lead_${model.rows.length + 1}`, siteId: body.site_id, receivedAt: at, data: body.form_data };
    model.rows.push(row);
    return row.id;
  };
  // Stores the lead, then the confirmation is lost on the way back.
  model.persistThenLose = (lose) => (request) => {
    persist(request);
    return lose();
  };
  model.persistThenAccept = () => (request) => {
    const id = persist(request);
    model.confirmedIds.push(id);
    return transport.json(200, { ok: true, id })();
  };
  return model;
}

// ─── Mounted component instance ───
export function mount(Component, props, env) {
  const inst = { hooks: [], hookIndex: 0, effects: [], pendingRefs: [], dirty: false, tree: null };
  inst.render = () => {
    current = inst;
    inst.hookIndex = 0;
    inst.pendingRefs = [];
    inst.tree = Component(props);
    current = null;
    inst.dirty = false;
    const nodes = collect(inst.tree);
    for (const ref of inst.pendingRefs) {
      const node = nodes.find((n) => n.props.ref === ref);
      ref(node ? fakeElement(node, env) : null);
    }
    for (const node of nodes) {
      const { ref } = node.props;
      if (ref && typeof ref === "object") ref.current = fakeElement(node, env);
    }
    const effects = inst.effects.splice(0);
    effects.forEach((fn) => fn());
    return inst.tree;
  };
  inst.render();
  return inst;
}

function fakeElement(node, env) {
  return { id: node.props.id, focus: () => (env.focused = node.props.id) };
}

function collect(node, out = []) {
  if (Array.isArray(node)) node.forEach((n) => collect(n, out));
  else if (node && typeof node === "object" && "props" in node) {
    out.push(node);
    collect(node.props.children, out);
  }
  return out;
}

export function textOf(node) {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  return textOf(node.props?.children);
}

// Query helpers over the current tree.
export function query(inst) {
  const all = () => collect(inst.tree);
  return {
    all,
    byId: (id) => all().find((n) => n.props.id === id),
    button: () => all().find((n) => n.type === "button"),
    form: () => all().find((n) => n.type === "form"),
    alerts: () => all().filter((n) => n.props.role === "alert"),
    text: () => textOf(inst.tree),
  };
}

// Let pending promises settle, then re-render (like React committing).
export async function settle(inst, rounds = 10) {
  for (let i = 0; i < rounds; i++) await new Promise((r) => setImmediate(r));
  inst.render();
}
