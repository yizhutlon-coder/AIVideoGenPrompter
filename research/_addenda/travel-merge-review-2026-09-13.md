# Travel-fork merge review — 2026-09-13

Review of the uncommitted working tree produced in the travel checkout ("AIVideoGenPrompter Travel",
based on canonical HEAD b5f06fc). Two independent deep reviews were run: one over the research/docs
wave, one a security-lens code review of the app diff and the new tool. This file is the incorporation
ledger: what was adopted, what was fixed on the way in, and what was pushed back — with reasons.

## Adopted

- **PromptStudio.html** (whole file, LF-clean) — Meta Inspector integration, severity-tiered validator
  rewrite (including the real CAM_MOVE non-global-regex bug that blocked every one-camera-move Wan
  prompt), 10 rewritten TARGETS with examples kept in sync, evidence-graded KNOWLEDGE expansion,
  MODELSPEC nullable-VRAM + the NoobAI (FAIPL) / LTX license reclassifications.
- **tools/MetaInspector.html** — new offline recipe reader. Privacy-verified: zero network calls of any
  kind, no CDNs, no new storage keys, house theme/zoom patterns followed.
- **README** — the three real hunks (Meta Inspector + limitations, tools map, LF-checksum caveat).
- **Research corpus**: digests 2026-09-03 and 2026-09-10; addenda staff-claims-2026-09,
  comfyui-ops-2026-09, system-prompt-audit-2026-09-10, template-picker-audit-2026-09-10,
  validator-accuracy-2026-09-10, verification-2026-09, verification-2026-09-10, test-kit-2026-09 +
  test-kit/ (50 unrun protocol workflows), validator-harness/; expanded briefs (wan22, ltx23,
  minimax-h3, scail2, sdxl, flux, z-image, qwen-image, new-models, krea-character-art, INDEX);
  process docs MERGE-NOTES, FOLD-IN, CHANGELOG-2026-09-10, RESEARCH-PLAN-2026-09.

## Fixed on the way in (blocking or mandatory)

1. **Severity tiers were declared but never consumed** — `renderCheck` showed raw `HARD:`/`advisory:`
   prefixes, counted advisories as errors, and the auto-fix prompt told the LLM to "fix" craft advice.
   Now: HARD → ⚠ + Fix; advisory → ℹ tip badge; prefixes stripped; auto-fix receives HARD only.
2. **MetaInspector copy button** — `JSON.stringify(k)` inside a double-quoted `onclick` broke every
   raw-field copy button AND was an attribute-injection vector from attacker-supplied metadata keys
   (PNG tEXt keywords, MKV tag names…). Replaced with an escaped `data-fk` + delegated listener;
   hostile-key regression test added.
3. MetaInspector raw-byte scan decoded up to 600 MB into one string (V8 cap / frozen tab) → bounded
   12 MB head+tail windows. Thumbnail blob URLs now revoked. Child-side postMessage source gate added.
4. **LTX static-camera rule downgraded HARD → advisory** — its own message text cites one user's
   ~2-in-50 anecdote; n=1 must not block.
5. **minimax-h3.md**: all 13 `[OFFICIAL-3P]` tokens regraded `[LORE — third-party README, not vendor]`
   (the branch's own process defect #65: the invented label launders third-party READMEs into vendor
   authority).
6. **scail2.md**: two hardened quotes corrected per the branch's own round-2 verifier — the card says
   *"Pose-driven performs better under 704p"* (never "and replacement"), and divisible-by-32 is
   "should" guidance, not a verbatim "must".
7. **FOLD-IN B4** annotated RETRACTED (nine-slot order falsified by the vendor's own gallery 7 days later).
8. **comfyui-metadata.md** demoted from "ground truth" to DRAFT (mostly ungraded/un-URLed) and its
   `PreviewImage` claim corrected (it DOES write, to the temp directory).
9. **validator-harness/run.mjs** could never fail (`process.exitCode = 0` unconditionally) → now exits 1
   on any failure.
10. KB self-consistency: LTX negative-inertness no longer asserted flatly in the Negatives gotcha
    (the LTX card calls it unmeasured); Illustrious "quality tags" labeled LORE; the Krea
    "flat graphic design" official-example claim removed (same bank counts it at zero in the gallery).

## Pushed back (NOT adopted)

- **All CRLF churn** (~45 files) — including a **corrupted ComfyUI-Privacy-Handout.pdf** (xref broken by
  CRLF conversion) and 9/11 broken checksums; `start-promptstudio.sh` had gained a `\r` shebang that
  fails on Mac/Linux. A `.gitattributes` (LF + binary markers) now prevents recurrence.
- **Root CHANGELOG.md** — flattens caveats its own sources carry (+20.4% recorded as "at or inside
  +20%"; "no prefix 0" contradicted by MERGE-NOTES itself; sdxlAnime family "selection" is actually
  inference). CHANGELOG-2026-09-10.md is the reliable record and is kept instead.
- **docs/diffs/2026-09/** — partially stale (regenerated before the last edits) and reproducible from
  git history; not imported.
- **bbs.monster as a standing Bilibili proxy** — the 09-03 digest calls its transcriptions "authorised"
  with zero evidence for that word. Not adopted as standing practice; per-item use requires evidence.
- **The "reusable access route for every gated HF repo" framing** (09-10 digest) — commit-pinned raw
  URLs may be cited when found for public documentation, but a generalized gate-bypass recipe is not
  house practice. Not adopted.
- **Validator "before" numbers as headline** — "blocked one in seven of vendors' own prompts" overstates
  (23/30 before-failures were fixtures the old build structurally could not express; strict block rate
  4/142, and 33/77 "gold" fixtures are corpus-authored). The honest number is the 0-blocking-on-84
  pass/advisory line.

## Known-open items (tracked, not blocking)

- Severity census: docs say 64 HARD / 50 advisory; the shipped file has ~97/34. The prefix-aware UI
  makes advisories non-blocking regardless, but ~16 rules where the licensing FOLD-IN item said "warn"
  still ship as HARD — worth a deliberate pass (candidates listed in MERGE-NOTES "unmapped hunks").
- sdxlAnime family detection is circular (inferred from the tags it then requires) — a Pony prompt
  missing its score ladder is never classified pony6, so the check can't fire. Needs an explicit
  family control or a pony6 fallback.
- qwenimg edit-gate (`picture 2` etc.) early-returns past the negative/sentinel checks; RUNJING
  alternation lacks \b on pan/tilt ("Japan", "panorama"); Krea2 hard cap 2500 chars vs prose ceiling
  ≈2850 — reconcile.
- Weakest shipped claims flagged by the branch itself: RealVisXL negative (never re-fetched, shipped
  anyway), Qwen Lightning seed-variance (n≈3, no grids), H3 Roll Clockwise (unfetched "base guide").
  Two exemplars shipped NEEDS-RENDER (sdxlAnime NoobAI, scail ~105-word).
- test-kit: fix defects #67 (v-pred arm lacks ModelSamplingDiscrete) and #68 (Z-Image negeqpos arm
  cancels its own guidance) before running T7/T2; T1's Qwen 20-step arm vs the template's 50-step
  subgraph is unresolved. Nothing in FOLD-IN §G may reach the bank until results-2026-09.md exists.
- timing-words-are-physics is now formally ungraded (house doctrine, 6 targets) — candidate for the
  test-kit's next protocol batch.
- validator-harness before-column is not reproducible from the repo (pre-fix HTML never committed);
  results-after.md predates the shipped validator — regenerate on next validator change.
- MetaInspector minor: child still sends a `negative` field the parent drops; dead code
  (`sendLoras`, vacuous depth guard); 1.5 GB cap files get a misleading "no metadata" verdict.

## Process note

The travel session's own plan (RESEARCH-PLAN-2026-09 rule 1) forbade touching the app, and the app was
extensively edited anyway; repeated self-certifications ("nothing on a BLOCK list entered the app")
were each contradicted somewhere in the branch's own later passes. The work survived review on its
merits — but "we checked ourselves" lines are claims to verify, not clearances. Future travel/external
sessions: research-only stays research-only; app changes come back as proposals (FOLD-IN pattern),
which worked well everywhere it was actually followed.
