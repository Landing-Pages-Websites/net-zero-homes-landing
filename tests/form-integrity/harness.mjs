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

// Child function components (Icon, SubmissionNotice) are stateless, so they
// are rendered inline into the parent's tree.
function jsx(type, props, key) {
  if (typeof type === "function") return type(props ?? {});
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

// Store updates mark the instance dirty; mount() commits effect-driven
// updates, and tests re-render the other card after each settle().
function useSyncExternalStore(subscribe, getSnapshot) {
  const inst = current;
  slot(() => subscribe(() => (inst.dirty = true)));
  return getSnapshot();
}

const fakeReact = { Fragment, useState, useRef, useCallback, useEffect, useSyncExternalStore };
const fakeJsxRuntime = { jsx, jsxs: jsx, jsxDEV: jsx, Fragment };

// ─── Module loader (transpile TS/TSX, resolve "@/") ───
const cache = new Map();
// "fake" = the hooks runtime above; "real" = the installed react, for SSR.
let reactMode = "fake";
const reactFor = (spec) => {
  if (reactMode === "real") return require(spec);
  return spec === "react" ? fakeReact : fakeJsxRuntime;
};

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
    if (spec === "react" || spec === "react/jsx-runtime" || spec === "react/jsx-dev-runtime") return reactFor(spec);
    if (spec.startsWith("@/") || spec.startsWith(".")) return loadModule(resolveSource(spec, path.dirname(file)));
    throw new Error(`harness: unexpected import "${spec}" in ${file}`);
  };
  new Function("exports", "require", "module", outputText)(mod.exports, localRequire, mod);
  return mod.exports;
}

export function loadSource(rel) {
  return loadModule(path.join(SRC, rel));
}

// A fresh module graph = a fresh page load: module state (the page-wide
// attempt store) starts over, while whatever sessionStorage the env carries
// persists. No production reset hook is needed.
export function freshPage() {
  cache.clear();
  reactMode = "fake";
  return loadSource("components/FormCard.tsx").FormCard;
}

// Server-renders the real FormCard with the real react-dom/server, with no
// window/sessionStorage (as on the server). Restores the fake runtime after.
export function renderOnServer(props) {
  const saved = { window: globalThis.window, sessionStorage: Object.getOwnPropertyDescriptor(globalThis, "sessionStorage") };
  cache.clear();
  reactMode = "real";
  delete globalThis.window;
  delete globalThis.sessionStorage;
  try {
    const { FormCard } = loadSource("components/FormCard.tsx");
    const { createElement } = require("react");
    return require("react-dom/server").renderToString(createElement(FormCard, props));
  } finally {
    cache.clear();
    reactMode = "fake";
    globalThis.window = saved.window;
    if (saved.sessionStorage) Object.defineProperty(globalThis, "sessionStorage", saved.sessionStorage);
  }
}

// ─── Isolated browser-ish globals + recorders ───
export function memoryStorage() {
  const m = new Map();
  return {
    getItem: (k) => m.get(k) ?? null,
    setItem: (k, v) => void m.set(k, String(v)),
    entries: () => Object.fromEntries(m),
  };
}

// Ways a browser can refuse sessionStorage (privacy modes, quotas, policy).
export const brokenStorage = {
  "setItem throws": () => ({ ...memoryStorage(), setItem: () => { throw new DOMException("quota", "QuotaExceededError"); } }),
  "setItem silently ignored": () => ({ ...memoryStorage(), setItem: () => {} }),
  "getItem throws": () => ({ ...memoryStorage(), getItem: () => { throw new DOMException("denied", "SecurityError"); } }),
  "storage getter throws": () => null,
};

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

function installSessionStorage(win, storage) {
  const descriptor = storage
    ? { value: storage, configurable: true, writable: true }
    : { get: () => { throw new DOMException("denied", "SecurityError"); }, configurable: true };
  Object.defineProperty(win, "sessionStorage", descriptor);
  Object.defineProperty(globalThis, "sessionStorage", descriptor);
}

// One browser tab. Pass the previous env's `session` to model a same-tab
// reload; omit it for a genuinely separate browsing session.
export function createEnv({ session = memoryStorage() } = {}) {
  const env = { requests: [], megaTag: [], dataLayer: [], focused: null, responders: [], trackingThrows: false, session };
  globalThis.window = recordingWindow(env);
  globalThis.document = { cookie: "", referrer: "" };
  globalThis.localStorage = memoryStorage();
  installSessionStorage(globalThis.window, session);
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

// The lead platform's documented same-site phone/email merge window, from
// https://docs.gomega.ai/landing-pages/form-submission-guide#repeated-test-leads-and-the-shared-phone
// A resend after it would be a second lead row. Tests advance past it to
// show that time never releases the no-resend lock.
export const MERGE_WINDOW_MS = 2 * 60 * 1000;

// In-memory stand-in for an endpoint that STORES a request and then loses the
// confirmation on the way back. Every request that reaches it becomes a row
// (no merging assumed), so `rows.length` counts what a server would hold. It
// is not the real endpoint and proves nothing about server-side dedup.
export function leadPlatformModel() {
  const model = { rows: [] };
  model.persistThenLose = (lose) => (request) => {
    model.rows.push(request.body);
    return lose();
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
    // Like React: state set during effects (e.g. a restored marker) commits.
    if (inst.dirty) return inst.render();
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
    text: () => textOf(inst.tree),
  };
}

// Let pending promises settle, then re-render (like React committing).
export async function settle(inst, rounds = 10) {
  for (let i = 0; i < rounds; i++) await new Promise((r) => setImmediate(r));
  inst.render();
}
