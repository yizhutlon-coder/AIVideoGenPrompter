// run.mjs — measure PromptStudio.html's validate() against the labelled fixture set.
//
//   node run.mjs                  → full report to stdout
//   node run.mjs --md > out.md    → same report, markdown-only (no ANSI)
//   node run.mjs --key krea2      → one model key
//   node run.mjs --id krea-gold-p5-charart
//
// Severity model
// --------------
// validate() returns a flat array of message strings. The app's own convention
// (docs/CHANGELOG-2026-09-10.md §Deviations #1) is that severity lives in the
// message wording: 'HARD: …' = blocking, 'advisory: …' = non-blocking.  Every
// message WITHOUT a prefix is rendered by renderCheck() exactly like a hard
// error (a ⚠ count plus a "Fix" button that rewrites the prompt), so this
// harness classifies unprefixed messages as BLOCKING.  The report prints how
// many messages actually carry each prefix, because the gap between the stated
// contract and the emitted strings is itself a finding.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validate, TARGETS, WAN_NEG, SDXL_NEG, QWENIMG_NEG } from './extract.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const argOf = n => { const i = argv.indexOf(n); return i === -1 ? null : argv[i + 1]; };
const onlyKey = argOf('--key');
const onlyId = argOf('--id');

const NEG = { '{{WAN_NEG}}': WAN_NEG, '{{SDXL_NEG}}': SDXL_NEG, '{{QWENIMG_NEG}}': QWENIMG_NEG };
function expand(s) {
  let out = String(s == null ? '' : s);
  for (const k of Object.keys(NEG)) out = out.split(k).join(NEG[k] == null ? k : NEG[k]);
  return out;
}

const RANK = { pass: 0, advisory: 1, hard: 2 };

function classify(messages) {
  if (!messages || !messages.length) return 'pass';
  let hard = 0, adv = 0;
  for (const m of messages) {
    if (/^\s*advisory:/i.test(m)) adv++;
    else hard++;             // 'HARD: …' and every unprefixed message
  }
  return hard ? 'hard' : (adv ? 'advisory' : 'pass');
}

function verdict(expect, actual) {
  if (expect === actual) return 'correct';
  if (actual === 'hard') return 'false-hard';
  if (actual === 'pass' && expect === 'hard') return 'false-pass';
  return 'wrong-severity';
}

const raw = JSON.parse(fs.readFileSync(path.join(HERE, 'fixtures.json'), 'utf8'));
let fixtures = raw.fixtures;
if (onlyKey) fixtures = fixtures.filter(f => f.key === onlyKey);
if (onlyId) fixtures = fixtures.filter(f => f.id === onlyId);

const keys = Object.keys(TARGETS);
const rows = [];
let threw = 0, prefixHard = 0, prefixAdv = 0, prefixNone = 0;

for (const f of fixtures) {
  if (keys.indexOf(f.key) === -1) { console.error('!! unknown key in fixture ' + f.id + ': ' + f.key); continue; }
  let msgs, error = null;
  try {
    msgs = validate(f.key, expand(f.text), f.intent == null ? undefined : expand(f.intent));
    if (!Array.isArray(msgs)) throw new Error('validate() did not return an array (got ' + typeof msgs + ')');
  } catch (e) {
    error = e && e.message; msgs = ['<<THREW>> ' + error]; threw++;
  }
  for (const m of msgs) {
    if (/^\s*HARD:/.test(m)) prefixHard++;
    else if (/^\s*advisory:/i.test(m)) prefixAdv++;
    else prefixNone++;
  }
  const actual = error ? 'hard' : classify(msgs);
  rows.push({ ...f, msgs, actual, verdict: verdict(f.expect, actual), error });
}

// ---------- aggregate ----------
const byKey = new Map();
for (const k of keys) byKey.set(k, { n: 0, correct: 0, fh: 0, fp: 0, ws: 0 });
for (const r of rows) {
  const b = byKey.get(r.key); if (!b) continue;
  b.n++;
  if (r.verdict === 'correct') b.correct++;
  else if (r.verdict === 'false-hard') b.fh++;
  else if (r.verdict === 'false-pass') b.fp++;
  else b.ws++;
}

const tot = { n: rows.length, correct: 0, fh: 0, fp: 0, ws: 0 };
for (const r of rows) {
  if (r.verdict === 'correct') tot.correct++;
  else if (r.verdict === 'false-hard') tot.fh++;
  else if (r.verdict === 'false-pass') tot.fp++;
  else tot.ws++;
}

const goldRows = rows.filter(r => /gold|official/i.test(r.id) || /OFFICIAL/i.test(r.grade || ''));
const goldFH = goldRows.filter(r => r.verdict === 'false-hard').length;

// ---------- report ----------
const L = [];
L.push('# Validator accuracy run — ' + new Date().toISOString().slice(0, 10));
L.push('');
L.push('Fixtures: **' + rows.length + '** across **' + [...new Set(rows.map(r => r.key))].length + '** model keys. ' +
       'validate() threw on **' + threw + '**.');
L.push('');
L.push('Message-prefix census (the stated contract is `HARD:` / `advisory:`): ' +
       '`HARD:` **' + prefixHard + '** · `advisory:` **' + prefixAdv + '** · **no prefix ' + prefixNone + '** ' +
       '(unprefixed messages are counted as blocking, because `renderCheck()` renders them identically to a hard error).');
L.push('');
L.push('## Confusion by model key');
L.push('');
L.push('| key | n | correct | false-hard | false-pass | wrong-severity | accuracy |');
L.push('|---|--:|--:|--:|--:|--:|--:|');
for (const k of keys) {
  const b = byKey.get(k);
  if (!b.n) continue;
  L.push('| `' + k + '` | ' + b.n + ' | ' + b.correct + ' | ' + b.fh + ' | ' + b.fp + ' | ' + b.ws + ' | ' +
         (100 * b.correct / b.n).toFixed(0) + '% |');
}
L.push('| **total** | **' + tot.n + '** | **' + tot.correct + '** | **' + tot.fh + '** | **' + tot.fp + '** | **' + tot.ws + '** | **' +
       (100 * tot.correct / tot.n).toFixed(0) + '%** |');
L.push('');
L.push('- **false-hard** (blocks a prompt that is valid or only worth an advisory): **' + tot.fh + '** of ' + tot.n +
       ' — of which **' + goldFH + '** are on OFFICIAL / gold-pair fixtures.');
L.push('- **false-pass** (misses a real, sourced violation entirely): **' + tot.fp + '**.');
L.push('- **wrong-severity** (right that something is off, wrong tier): **' + tot.ws + '**.');
L.push('');

const expectedDist = { pass: 0, advisory: 0, hard: 0 };
for (const r of rows) expectedDist[r.expect]++;
L.push('Label distribution — expect `pass` ' + expectedDist.pass + ' · `advisory` ' + expectedDist.advisory + ' · `hard` ' + expectedDist.hard + '.');
L.push('');

const bad = rows.filter(r => r.verdict !== 'correct');
L.push('## Failures (' + bad.length + ')');
L.push('');
if (!bad.length) L.push('_None._');
for (const r of bad) {
  L.push('### `' + r.id + '` — ' + r.verdict.toUpperCase());
  L.push('');
  L.push('- key `' + r.key + '` · expect **' + r.expect + '** · actual **' + r.actual + '** · grade ' + (r.grade || '?'));
  L.push('- rule: ' + (r.rule || '—'));
  L.push('- source: ' + (r.source || '—'));
  if (r.msgs.length) {
    L.push('- messages produced:');
    for (const m of r.msgs) L.push('  - `' + String(m).replace(/`/g, "'").replace(/\s+/g, ' ').slice(0, 400) + '`');
  } else {
    L.push('- messages produced: _(none)_');
  }
  L.push('');
}

// full message log, so a re-run can be diffed
L.push('## Full message log');
L.push('');
for (const r of rows) {
  L.push('- `' + r.id + '` [' + r.expect + '→' + r.actual + '] ' +
    (r.msgs.length ? r.msgs.map(m => String(m).replace(/\s+/g, ' ').slice(0, 160)).join(' | ') : '(clean)'));
}
L.push('');

const out = L.join('\n');
console.log(out);

if (argv.indexOf('--save') !== -1) {
  const file = argOf('--save') || 'results.md';
  fs.writeFileSync(path.join(HERE, file), out, 'utf8');
  console.error('saved ' + file);
}

process.exitCode = bad.length ? 1 : 0;
