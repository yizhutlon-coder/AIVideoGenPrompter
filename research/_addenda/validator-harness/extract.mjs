// extract.mjs — load PromptStudio.html's <script> bodies in a vm sandbox with
// minimal DOM stubs, and export validate() / TARGETS for out-of-process testing.
//
//   node extract.mjs            → smoke test
//   import { validate, TARGETS } from './extract.mjs'
//
// No network, no filesystem writes. The app is loaded with location.search='?split'
// so its init IIFE returns early (PS_SPLIT) and no polling timers start.

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
// PS_APP=/path/to/other.html lets the harness score a different build of the app
// (used to re-score the pre-fix validator against the final fixture labels).
export const APP_PATH = process.env.PS_APP
  ? path.resolve(process.env.PS_APP)
  : path.resolve(HERE, '..', '..', '..', 'PromptStudio.html');

function makeEl() {
  const el = {
    addEventListener() {}, removeEventListener() {}, appendChild() {}, insertBefore() {},
    remove() {}, focus() {}, blur() {}, click() {}, scrollIntoView() {},
    setAttribute() {}, getAttribute() { return null; }, hasAttribute() { return false; },
    classList: { toggle() {}, add() {}, remove() {}, contains() { return false; } },
    style: {}, dataset: {}, value: '', textContent: '', innerHTML: '', innerText: '',
    checked: false, disabled: false, scrollTop: 0, scrollHeight: 0, files: [],
    parentElement: null, firstChild: null, children: [],
    querySelector() { return makeEl(); },
    querySelectorAll() { return []; },
    closest() { return null; },
    getBoundingClientRect() { return { top: 0, left: 0, width: 0, height: 0 }; }
  };
  el.parentElement = null;
  return el;
}

function makeSandbox() {
  const storage = new Map();
  const localStorage = {
    getItem: k => (storage.has(String(k)) ? storage.get(String(k)) : null),
    setItem: (k, v) => storage.set(String(k), String(v)),
    removeItem: k => storage.delete(String(k)),
    clear: () => storage.clear(),
    key: i => [...storage.keys()][i] ?? null,
    get length() { return storage.size; }
  };

  const documentEl = makeEl();
  const document = {
    documentElement: documentEl,
    body: makeEl(),
    head: makeEl(),
    getElementById() { return makeEl(); },
    querySelector() { return makeEl(); },
    querySelectorAll() { return []; },
    createElement() { return makeEl(); },
    createTextNode() { return makeEl(); },
    createDocumentFragment() { return makeEl(); },
    addEventListener() {}, removeEventListener() {},
    execCommand() { return false; },
    readyState: 'complete',
    title: ''
  };

  const matchMedia = () => ({
    matches: false, media: '', addEventListener() {}, removeEventListener() {},
    addListener() {}, removeListener() {}
  });

  const sandbox = {
    console,
    document,
    localStorage,
    sessionStorage: localStorage,
    matchMedia,
    // '?split' makes the app treat itself as the split container: the init IIFE
    // returns immediately and checkStatus()/setInterval never run.
    location: { search: '?split', href: 'file:///PromptStudio.html', hash: '', pathname: '/PromptStudio.html', reload() {} },
    navigator: { clipboard: { writeText: () => Promise.resolve() }, userAgent: 'node', language: 'en' },
    fetch: () => Promise.reject(new Error('offline harness: fetch disabled')),
    URLSearchParams,
    URL,
    TextDecoder,
    TextEncoder,
    Blob: class Blob { constructor() {} },
    FileReader: class FileReader { readAsText() {} readAsArrayBuffer() {} },
    setTimeout: () => 0,
    clearTimeout: () => {},
    setInterval: () => 0,
    clearInterval: () => {},
    requestAnimationFrame: () => 0,
    performance: { now: () => 0 },
    alert() {}, confirm() { return false; }, prompt() { return null; },
    atob: s => Buffer.from(String(s), 'base64').toString('binary'),
    btoa: s => Buffer.from(String(s), 'binary').toString('base64'),
    crypto: { getRandomValues: a => a, randomUUID: () => 'x' },
    addEventListener() {}, removeEventListener() {}, dispatchEvent() { return true; },
    scrollTo() {}, open() { return null; }, close() {}, print() {}, postMessage() {},
    innerWidth: 1280, innerHeight: 900, devicePixelRatio: 1
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  sandbox.self = sandbox;
  document.defaultView = sandbox;
  return sandbox;
}

export function loadApp(appPath = APP_PATH) {
  const html = fs.readFileSync(appPath, 'utf8');
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  if (!scripts.length) throw new Error('no <script> blocks found in ' + appPath);
  const sandbox = makeSandbox();
  const ctx = vm.createContext(sandbox);
  scripts.forEach((src, i) => {
    // 'use strict' at the top of a script body would make top-level `const`
    // bindings script-local; run each block as a separate vm.Script in the same
    // context, which mirrors how the browser evaluates them (shared global).
    try {
      new vm.Script(src, { filename: `PromptStudio.html#script${i}` }).runInContext(ctx);
    } catch (e) {
      throw new Error(`script ${i} threw at load: ${e && e.message}`);
    }
  });
  return ctx;
}

const ctx = loadApp();

// 'use strict' + top-level const/function in a vm.Script land on the context's
// *lexical* scope, not as sandbox properties. Pull them out by evaluating in the
// same context.
function grab(name) {
  return vm.runInContext(`typeof ${name} !== 'undefined' ? ${name} : undefined`, ctx);
}

export const validate = grab('validate');
export const TARGETS = grab('TARGETS');
export const WAN_NEG = grab('WAN_NEG');
export const SDXL_NEG = grab('SDXL_NEG');
export const QWENIMG_NEG = grab('QWENIMG_NEG');

if (typeof validate !== 'function') throw new Error('validate() not found after load');
if (!TARGETS || typeof TARGETS !== 'object') throw new Error('TARGETS not found after load');

// smoke test when run directly
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const r = validate('wan', 'test');
  console.log('TARGETS keys:', Object.keys(TARGETS).join(', '));
  console.log('validate("wan","test") =>', Array.isArray(r) ? 'array(' + r.length + ')' : typeof r);
  console.log(JSON.stringify(r, null, 2));
}
