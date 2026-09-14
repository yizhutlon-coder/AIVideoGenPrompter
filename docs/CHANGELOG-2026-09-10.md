# CHANGELOG 2026-09-10 — FOLD-IN application to `PromptStudio.html`

**Source:** [`docs/FOLD-IN-2026-09.md`](FOLD-IN-2026-09.md), filtered through
[`research/_addenda/verification-2026-09.md`](../research/_addenda/verification-2026-09.md)
("Items the synthesis agent must NOT fold in", 34 entries — binding).

**Sections applied:** A, B, D, E, H, plus the *textual* half of C (KNOWLEDGE/GOTCHAS prose about
wanAnimate2 / wanDancer / Bernini-R / LTX-2.5). **§G is deferred and NOT applied.** Structural §C
(new `TARGETS` keys, new `WF_TEMPLATES`) is NOT applied by design.

**Run history.** An earlier applier run (2026-09-10, cut off mid-run by a rate limit) applied most of
A, B, C-textual, E and H without writing a changelog. This file records the state of every item as
found at the start of this run, then what this run did.

Legend: **ALREADY** = applied by the earlier run (proposed text present, current text absent) ·
**APPLIED** = applied by this run · **SKIPPED** = not applied, with reason · **N/A** = no app change.

---

## State table

| Item | State at start | Outcome |
|---|---|---|
| A1 Wan orbit/45° in KNOWLEDGE | ALREADY | ALREADY |
| A2 Wan system prompt orbit/45°/固定镜头 | ALREADY | ALREADY |
| A3 delete `orbit` validator error | PENDING | **APPLIED** |
| A4 LTX enhancer "HISTORY" → current state | ALREADY | ALREADY |
| A5 new LTX enhancer GOTCHAS card | ALREADY | ALREADY |
| A6 LTX target: enhancer note | ALREADY | ALREADY |
| A7 LTX version-split length | ALREADY | ALREADY |
| A8 LTX 150-word GOTCHAS card | ALREADY | ALREADY |
| A9 LTX three official negatives | ALREADY | ALREADY |
| A10 LTX negatives-inert downgrade | ALREADY | ALREADY |
| A11 same downgrade, card + target | ALREADY | ALREADY |
| A12 LTX VRAM floor | ALREADY | ALREADY |
| A13 LTX licence "annual revenues" | ALREADY | ALREADY |
| A14 LTX IC-LoRA control names | ALREADY | ALREADY |
| A15 H3 reference caps (KNOWLEDGE) | ALREADY | ALREADY + **APPLIED** to `TARGETS.minimaxRef` and the H3 tag GOTCHAS card, which still said "12 files max" / "a file slot" |
| A16 delete H3 audio-requires-visual | ALREADY | ALREADY |
| A17 H3 release date | ALREADY | ALREADY |
| A18 retire SCAIL-2 prompt-inert | ALREADY | ALREADY |
| A19 SCAIL-2 length band + 512 cap | ALREADY | ALREADY |
| A20 SCAIL-2 mask polarity / 704p (KNOWLEDGE) | ALREADY | ALREADY + **APPLIED** to `TARGETS.scail`, which still carried "704p recommended for Replacement" (verifier exclusion #2) |
| A21 Wan-Dancer numbers + dialect (KNOWLEDGE) | ALREADY | ALREADY + **APPLIED** to the model picker, which still carried "Prompt Alignment 9.03" and "~28 GB" (verifier exclusion #8) |
| A22 Wan I2V ≤100 words/chars | ALREADY | ALREADY |
| A23 same in card + target | ALREADY | ALREADY |
| A24 Illustrious self-contradiction | ALREADY | ALREADY |
| A25 NoobAI v-pred warning | ALREADY | ALREADY |
| A26 Illustrious org scope | ALREADY | ALREADY |
| A27 Krea 2 length ceiling | ALREADY | ALREADY |
| A28 Krea 2 weights are literal | ALREADY | ALREADY |
| A29 Krea 2 licence/enhancer/params | ALREADY | ALREADY |
| A30 Krea 2 ReferenceLatent downgrade | ALREADY | ALREADY |
| A31 klein encoder / black images | ALREADY | ALREADY |
| A32 HOST TRAP | ALREADY | ALREADY |
| A33 order-over-prose rule | ALREADY | ALREADY |
| A34 drop "four vendor guides" | ALREADY | ALREADY |
| A35 Z-Image Turbo 9 steps | ALREADY | ALREADY |
| A36 negatives-active list | ALREADY | ALREADY |
| A37 weighting-syntax card | ALREADY | ALREADY |
| A38 klein black-frame causes card | ALREADY | ALREADY |
| A39 Civitai anime claim scoped | ALREADY | ALREADY |
| A40 ≤75-token advice + chunking | ALREADY | ALREADY |
| B1 Z-Image staff token remedy | ALREADY | ALREADY |
| B2 `cfg_normalization` / `cfg_truncation` | ALREADY | ALREADY |
| B3 Z-Image multi-subject anti-bleed (target) | PENDING | **APPLIED** |
| B4 Krea 2 nine-slot encoder descriptor (target) | PENDING | **APPLIED** |
| B5 Krea 2 reference token cost | ALREADY | ALREADY |
| B6 H3 licence block | ALREADY | ALREADY |
| B7 H3 new local capabilities | ALREADY | ALREADY |
| B8 H3 reference-tag mechanics | ALREADY | ALREADY |
| B9 Wan EN/ZH rewriter asymmetry | ALREADY | ALREADY |
| B10 Illustrious control tokens | ALREADY | ALREADY |
| B11 Wan-Animate-2 third field | ALREADY | ALREADY |
| B12 LTX multi-shot per-cut rules | ALREADY | ALREADY |
| C1 `TARGETS.wanAnimate2` (new key) | N/A | SKIPPED — structural, excluded by brief (text folded via B11) |
| C2 `TARGETS.wanDancer` (new key) | N/A | SKIPPED — structural, excluded by brief (text folded via A21) |
| C3 Bernini-R KNOWLEDGE paragraph | ALREADY | ALREADY (textual half only; no `TARGETS.berniniR`) |
| C4 split `TARGETS.ltx` by version | N/A | SKIPPED — structural; the textual half is folded via A7/B12 |
| D1 `sdxlAnime` family selector | PENDING in `validate()` (target text ALREADY) | **APPLIED** |
| D2 drop 15-35 tags, scope prose ban | PENDING in `validate()` (target text ALREADY) | **APPLIED** |
| D3 per-family negatives | ALREADY (in `TARGETS.sdxlAnime.system`) | ALREADY |
| D4 v-pred plumbing in `wfNotes` | PENDING | **APPLIED** (note); template split SKIPPED — structural |
| D5 Krea 2 hard token error | PENDING | **APPLIED** |
| D6 Wan aesthetic budget + angle/move | PENDING | **APPLIED** |
| D7 LTX-2.5 validator rules | PENDING | **APPLIED** |
| D8 H3 validator additions | PENDING | **APPLIED** (text-checkable half) |
| D9 `SDXL_NEG` routing + CLIP-skip | PENDING | **APPLIED** (routing in target + `wfNotes`); CLIP-skip node SKIPPED — would edit `WF_TEMPLATES` |
| D10 Z-Image token budget + variant gate | PENDING | **APPLIED** (validator + target) |
| E1 ComfyUI version anchor | ALREADY | ALREADY |
| E2 red nodes / Install Missing | ALREADY | ALREADY |
| E3 `cnr_id` / `aux_id` / `ver` | ALREADY | ALREADY |
| E4 corrected OOM ladder | ALREADY | ALREADY |
| E5 model paths 2026 | ALREADY | ALREADY |
| E6 metadata / Dev mode / subgraphs | ALREADY | ALREADY |
| E7 Partner nodes | ALREADY | ALREADY |
| E8 seeds / caching / reproducibility | ALREADY | ALREADY |
| H1 H3 full clause set | ALREADY (via B6) | ALREADY |
| H2 H3 LoRA is a Model Derivative | ALREADY | ALREADY |
| H3 NoobAI bans commercialisation | ALREADY | ALREADY |
| H4 Pony V6 monetized-inference ban | ALREADY | ALREADY |
| H5 Animagine permits commercial use | ALREADY | ALREADY |
| H6 LTX annual revenues (via A13) | ALREADY | ALREADY |
| H7 klein 9B non-commercial | ALREADY | ALREADY |
| H8 Krea thresholds unverified (via A29) | ALREADY | ALREADY |
| H9 SCAIL-2 / H3-vs-Comfy licence conflicts | ALREADY | ALREADY |
| §G (13 deferred items) | N/A | NOT APPLIED by design |

---

## Not applied by design

- **§G, all 13 items.** Deferred pending the test kit; nothing from G reached the bank.
- **Structural §C**: `TARGETS.wanAnimate2`, `TARGETS.wanDancer`, `TARGETS.berniniR`, the
  `TARGETS.ltx` → `ltx23`/`ltx25` split, and any new `WF_TEMPLATES` / `WF_MAP` keys. Only the
  textual KNOWLEDGE/GOTCHAS additions from C were folded.

## Residues cleaned on surfaces the FOLD-IN did not name

The earlier run applied A/B/C-textual/E/H to `KNOWLEDGE`, `GOTCHAS` and most `TARGETS`, but four
already-corrected claims were still live elsewhere in the app. Each is on the verifier's
"must NOT fold in" list, so it was corrected here rather than left standing:

- `TARGETS.minimaxRef.system` — "12 files max" → local caps 9/3/3/3 = 18 slots, no total; the 12 is a
  hosted rule, advisory (exclusion #18, A15/B8).
- GOTCHAS H3 reference-tag card — "eats both a file slot and the 3-audio budget" → rewritten to the
  OFFICIAL fixed-order/ordinal mechanics (B8; the verifier's "upgrade the grade" row).
- `TARGETS.scail.system` — "704p recommended for Replacement" → the card's own sentence, which names
  pose-driven only, plus ÷32 (exclusion #2, A20).
- Model picker — Wan-Dancer "Prompt Alignment 9.03" and `disk:'~28 GB'` (exclusion #8, A21);
  Illustrious "every top Civitai anime checkpoint builds on it" (exclusion #33, A39); klein "wrong
  encoder gives black images" (exclusion #13, A31); Krea 2 `lic:'Custom (<$1M/<50 seats)'`
  (exclusion #24, A29).
- Krea 2 "CFG-free" in `KNOWLEDGE`, `TARGETS.krea2`, the Krea CFG GOTCHAS card and the `krea2`
  validator — all four now carry the route clause and the unresolved `guidance_scale=3.5` conflict
  (exclusion #25). The `krea2` target and validator also stop calling `(word:1.2)` "broken" and say
  it is literal text (exclusion #23).
- `ltx` validator — its negative-prompt message asserted the negative pass is "INERT on the distilled
  path", the exact claim exclusion #11 forbids; softened to "never required … untested" (A10/A11).

## Duplicates removed

**None found.** A whole-file scan for repeated segments over 90 characters returned only pre-existing
by-design repeats (the shared TIMING-WORDS doctrine block across several system prompts, CSS rules,
and one few-shot example). No FOLD-IN sentence appears twice.

## Deviations from the proposed text

1. **§D severity tiers.** `validate()` returns a flat array of strings, and the brief required the
   return shape be preserved — so "error" vs "warning" is carried in the message wording
   (`HARD: …` / `advisory: …`) rather than in a new structure.
2. **D5 expander interlock** cannot read `prompt_enhance`; it fires as a character-count advisory
   above ~1,400 chars, phrased conditionally.
3. **D5 reference budget** cannot see attachments; it fires when the prompt or intent mentions a
   reference image, quoting the `(h/32)·(w/32)+2` cost.
4. **D7 frame grid / enhancer state** are not text-checkable inside `validate()`; they went into
   `wfNotes(ltx)`, which is the ComfyUI export path the rules are about.
5. **D7 "warn only when a sentence carries no concrete visual or audio detail"** is not
   machine-checkable; the sentence-count band (4–8 single-shot, ~16 multishot) is enforced and the
   concreteness requirement is stated in the message text.
6. **D7 version split** has no UI selector: LTX-2.3 rules fire when the request names 2.3, otherwise
   the 2.5 rules apply and the 200-word 2.3 figure is quoted as an advisory.
7. **D8 frame-count and resolution rules** (n % 17 == 5, 124–362, ÷32, ≤1,032,192 px, 1376×768
   rejected) have no H3 export path in the app, so they were folded into `KNOWLEDGE ¶MINIMAX H3`
   instead of a validator.
8. **D8 tag arithmetic** cannot know which assets are attached; it enforces what is checkable from the
   text — per-type ordinals 1-based with no gaps, caps 9/3/6, and the soundtrack-ordering advisory.
9. **D9 CLIP-skip field** and **D4 template split** would require editing `WF_TEMPLATES` / `WF_MAP`,
   which the brief forbids. Both are carried as `wfNotes` instructions instead (add a
   `CLIPSetLastLayer` at -2 for Pony V6; the four v-pred changes).
10. **D1 family selector** is inferred from the request and the prompt text rather than added as a UI
    control. When no family is detected, every family rule is skipped and a single advisory says so —
    per the brief, no hard errors on an unknown family.

## Verification

Final syntax check (both `<script>` blocks compiled with `new Function`):

```
script 0 OK
script 1 OK
```

Structural anchors all present exactly once: `const TARGETS`, `const KNOWLEDGE`, `const GOTCHAS`,
`function validate(`, `const WF_TEMPLATES`, `function buildWorkflow(`, `const SDXL_NEG`,
`function wfNotes(`. `GOTCHAS` parses as an array of **46** cards.

`validate()` was exercised out-of-process on ten crafted inputs (wan / ltx / minimax / minimaxref /
sdxlAnime ×3 / krea2 / zimage / sdxl); every new rule fired as intended and none threw. One defect
found and fixed during that run: the H3 ordinal-gap check emitted one message per missing ordinal and
now emits one per reference type.

Counts for this run — **already applied by the earlier run: 63** (A1–A2, A4–A14, A15–A23 KNOWLEDGE
halves, A24–A40, B1–B2, B5–B12, C3-textual, D3, E1–E8, H1–H9) · **applied now: 17**
(A3, A15-target, A20-target, A21-picker, B3, B4, D1, D2, D4, D5, D6, D7, D8, D9, D10, plus the Krea
CFG/weights residues and the LTX negative-message residue) · **skipped: 4** (C1, C2, C4 structural;
§G deferred in full — 13 items) · **duplicates removed: 0**.

---

# Second pass (verifier-gated)

**Gate:** [`research/_addenda/verification-2026-09-10.md`](../research/_addenda/verification-2026-09-10.md)
— its `## System-prompt gate`, `## Applied-edit audit`, `## Picker corrections cleared for apply` and
`## Items the apply pass must NOT use` are binding, as are the 34 entries of
`verification-2026-09.md`. Proposed text comes from
[`system-prompt-audit-2026-09-10.md`](../research/_addenda/system-prompt-audit-2026-09-10.md) and
[`template-picker-audit-2026-09-10.md`](../research/_addenda/template-picker-audit-2026-09-10.md),
filtered to ALLOW rows; ADVISORY rows ship only as soft wording, and only where the gate's ADVISORY
entry says so. Nothing on a BLOCK or must-NOT-use list entered the app.

**Merge policy.** The proposed replacement prompts were NOT pasted wholesale — the live `system:`
strings already carry the first pass's edits, so each ALLOW instruction was merged into the current
text one at a time. The ≤+20% length rule is measured against the **live** string at the start of this
pass (not the audit's pre-first-pass baseline); per-model figures are in `## Verification`.

## A — repairs the verifier demands

| # | Item | Outcome |
|---|---|---|
| A1 | `sdxlAnime` self-negating Pony-negative sentence (verifier claim #38b) | **APPLIED** — rewritten to *"emit NO negative block at all … Do not add an explanatory clause after the tags; just omit the block."* |
| A2 | `sdxlAnime` exemplar: 3-rung score chain + illegal negative block (claim #39) | **APPLIED** — exemplar 1 now carries the full six-rung chain, one `source_*`, one `rating_*`, and **no** negative block (Pony emits none). The unsourced third negative variant is gone. |
| A3 | `TARGETS.scail` exemplar still ending `704p output recommended` on a `MODE: Replacement` case (claim #41, exclusion #2) | **APPLIED** — replaced with *"output dimensions divisible by 32"*. The rule half was already correct. |
| A4 | `CAM_FIXED` must match `固定镜头` (Applied-edit audit #3) | **ALREADY** — the validator-accuracy pass fixed it; the live alternation reads `…|固定机位|固定镜头|镜头不移动|镜头位置保持不动|…`. No edit. |
| A5 | `wfNotes()` teaching `ConditioningZeroOut` as the Krea 2 negative slot (must-NOT-use #17) | **APPLIED** — the `krea` branch is split out of the `zimage`/`klein` line and now says to connect a **real, empty** `CLIPTextEncode`, naming v0.35.0's `cfgpp_ud10_ab` as a `_cfg_pp` sampler whose name does not contain `cfg_pp`. |
| A6 | Krea licence string `"thresholds unverified"` (Applied-edit audit #8) | **APPLIED** — picker `lic` now carries the `$1M` cap; the `warn` states the trailing-twelve-month, company-wide, affiliates-aggregated scope and the naming/NOTICE/provenance/content-filter obligations, and points at the ungated `LICENSE.pdf`. Per must-NOT-use #12 the seat question is phrased *"No seat limit appears in the extracted text — we have not seen one, which is not the same as there being none"*, never "refuted", and "50 seats" does not appear. |
| A7 | Stale ComfyUI version anchor (Applied-edit audit #10) | **APPLIED** — re-anchored to **core v0.35.0 (Sept 9)** / **workflow-templates 0.11.57 (Sept 9)** with the three intervening core releases named, plus the v0.35.0 prompt-relevant items (see F). |

## B — retraction of FOLD-IN B4 (Krea 2 nine-slot *order*)

**APPLIED as a retraction, not a decline.** The first pass shipped B4's ordering half into
`TARGETS.krea2` — *"Then follow the encoder's OWN slot order … colour → shape → size → texture →
quantity → text → spatial relationships → objects → background. That is a better-evidenced ordering
rule than any heuristic."* The same day's harvest falsified it against the vendor's own 36 published
prompts (verifier claim #46, internal-contradiction ruling #3, must-NOT-use #4).

The sentence is replaced by the harvest's finding as the verifier words it — **checklist, not an
ordering rule, plus the fill rates**:

> Use them as a CHECKLIST, NOT as an order: fill rates across those 36 prompts are colour 94%, spatial
> 94%, size 92%, texture 61%, shape 56%, quantity 53%, text 6%, and the order they actually use runs
> objects → attributes → spatial → background → composition → medium → lighting. Cover the axes that
> matter, in any order that reads well.

The nine axes themselves survive verbatim; only "in that order" and the "better-evidenced ordering
rule" claim are retracted. The exemplar was rewritten to stop demonstrating the retracted order.

## C — system prompts, instruction by instruction

### C.krea2

| Item | Outcome |
|---|---|
| K10 / B4 nine-slot order | **RETRACTED** — see B. |
| "matte facts" string (BLOCK, claim #17) | **APPLIED as a regrade** — the anti-gloss route is now NAMING THE MARK-MAKING with the vendor's own attested phrases (`expressive thick brushstrokes`, `blocky painterly brushstrokes`, `flat shading`, `granular stippled shading`, `grainy paper texture`); the old adjective string is kept but explicitly labelled *"OUR house craft, not Krea vocabulary — zero occurrences in the 36"*. `flat graphic design` removed. |
| "Output ONLY the paragraph" as an absolute (BLOCK) | **APPLIED** — now permits the vendor-normal trailing style tail, citing 15/36. |
| K1 length | **APPLIED AS ADVISORY** — 80-140 is stated as TYPICAL craft guidance with the harvest's 10-230 / median 101.5 / 15-of-36 figures; the 512-position ≈ 2,850-character ceiling stays the hard number, per ruling #8 (the two are now visibly different kinds of number). |
| K3 weights are literal text | **ALREADY** (first pass). |
| K4 recipe branch | **APPLIED** — Turbo 8 steps CFG-free / ComfyUI CFG 1.0 / RAW 52 steps CFG 3.5, **keeping** the live `guidance_scale=3.5` conflict clause per exclusion #25. |
| K5 real empty negative | **APPLIED** in the target and in `wfNotes` (A5). |
| K8 restate instead of multiply | **APPLIED** — now named as the alternative to weighting, with the vendor's `(rust:1.4)` example. |
| K2 reference token cost | **APPLIED, relocated** — moved from the target into `wfNotes(krea)` to stay inside the length cap; the validator already carries it as an advisory. |
| K9 English output | **APPLIED** as a two-word clause. |
| K6 flat-background difficulty | **SKIPPED — length.** `[SPECULATION]`, ADVISORY-only, and the least load-bearing item in the target. |
| K7 `prompt_enhance` OFF + ethics refusal | **SKIPPED — already covered** in `KNOWLEDGE`, the Krea GOTCHAS card and the export (which sets it false). Not duplicated into the target. |
| K11 second exemplar | **SKIPPED — length**, exactly the cut the audit itself proposes. Also NEEDS-RENDER. |

### C.qwenimg — chapter reconciled first

Per must-NOT-use #15 and internal-contradiction ruling #1, `research/qwen-image.md` §*2026-09-10 sweep*
was treated as authoritative wherever it and the audit's `qwenimg` chapter differ.

| Item | Outcome |
|---|---|
| **Q1 as written** (EN ~200 words as a language rule) | **BLOCKED — not applied.** Replaced with X1's three-way formulation: *"LENGTH IS PER CLASS: a PORTRAIT targets ~200 words in English or 150 字 in Chinese (输出控制在150字以内); text and general scenes carry NO official length rule — state every exact string and spatial relation, no further."* This also removes the live global "about 200 words" defect. |
| **Q6 as written** (ethnicity → gender → age as a hard order) | **BLOCKED — not applied.** Shipped scoped: the chain is stated, then *"Hard order in CHINESE; in ENGLISH only a Recommended Flow, so prefer natural sentence order."* |
| **Q12** | **APPLIED AS ADVISORY WORDING** per the gate — *"dropped for 2512 (the rewriter defines it but never appends it); base Qwen-Image still appends it"*. The absolute "officially retired" is gone and "dead code" was never written. |
| **Q11** | **APPLIED AS ADVISORY** — the live `无其他文字。` matched no official string. Two of the three official forms now ship with an explicit pick rule: no text anywhere → 图像中未出现任何可识别文字。; text present but nothing more → 图像中未出现其他文字。 |
| Q3 instruction-is-the-description + list/numbering/heading ban | **APPLIED** (merged into the classify line). |
| Q5 mandatory art-style statement | **APPLIED**, trimmed to four vocabulary items. |
| Q8 layout direction + punctuation/case/line-break preservation | **APPLIED**. |
| Q9 quote-mark asymmetry | **APPLIED**. |
| Q15 / Q16 exemplar fixes | **APPLIED** — exemplar 1 gains the art-style statement and the mandated no-text sentence; exemplar 2 gains 写实摄影风格, 横排, 粗糙 and the correct *other-text* sentinel (it is a text image, so the rule-string form would have been wrong). |
| Q4 proper-noun protection · Q7 texture set · Q10 invent-the-string · Q2 three-branch expansion | **SKIPPED — length.** All ALLOW; the target has ten OFFICIAL omissions and the audit measured a full close at **+50%**. Shipped subset lands at **+20.4%**. |
| Q13 best-effort pose · Q14 Lightning CFG-1 clause · Q17 third exemplar | **SKIPPED** — ADVISORY / NEEDS-RENDER, and length. Note the sweep's T-c/X7 seed advice is `[LORE]` and was not made a validator rule. |

### C.sdxlAnime

| Item | Outcome |
|---|---|
| A1 broken Pony-negative sentence | **APPLIED** (see A1). |
| A2 explicit family selection + state the assumed family | **APPLIED** — a FIRST silent step naming `pony6 \| noobai \| animagine \| illustrious`, a required trailing `(assumed: Pony V6)` line, and "apply ONLY that family's block". |
| A3 refuse Pony V7 (AuraFlow) | **APPLIED**. |
| A4 truncated chain has "a much weaker effect compared to full string" | **APPLIED**, card verbatim. |
| A9 fix exemplar 1 | **APPLIED** (see A2 above): six rungs, one `source_*`, `rating_safe`, no negative block, assumed-family line. |
| A10 add a NoobAI exemplar | **APPLIED — but NEEDS-RENDER and shipped untested.** The tag vocabulary and the negative list are OFFICIAL (NoobAI card, verifier-confirmed); the specific tag sequence is the applier's and nobody has generated from it. Not labelled inside the prompt, because a meta-label inside an `Example output:` block is exactly defect #51. |
| A5 two Pony style templates + `rating_*` values · A6 NoobAI percentile explanation · A7 Animagine parenthesis escaping + year tags | **SKIPPED — length.** All ALLOW; the target is the largest in the app and lands at +18.4% with the items above. |
| A8 Illustrious control-token rungs + version gate | **SKIPPED.** ADVISORY only, and the gate requires a visible "community reprint of the author's notes" label; the six axes already ship without values, which is the safe half. Exclusion #29 (no Onoma card states a quality prefix) remains honoured. |

## D — picker rows (cleared rows only)

| Row / field | Outcome |
|---|---|
| LongCat-Image `speed` | **APPLIED** — `'fast'` → `'slow (official quick-start: 50 steps, CFG 4.0, cfg_renorm on; the 8-step build is a different checkpoint)'`. |
| LongCat-Image `warn` | **APPLIED** — the mandatory-quotation-marks rule, card verbatim. |
| LongCat-Image `min`/`comfy` | **APPLIED as a deletion** — `6`/`10` removed (set `null`); a new `vramNote` **quotes** the card comment and states that the source never says what the ~17 GB is. 16/24 was **not** asserted. |
| LongCat-Image `disk` | **APPLIED (one-precision rule)** — `'~12 GB'` → `'~12 GB (DiT only — the text encoder and VAE are extra)'`. The unverified ~29.3 GB total was not written. |
| LongCat-Image `lic` | **NO CHANGE** — Apache 2.0 confirmed. |
| Krea 2 `lic` / `warn` | **APPLIED** — see A6. |
| MiniMax H3 `min`/`comfy` | **APPLIED as a deletion** — `48`/`80` removed (the row contradicted its own `warn`). The replacement `12`/`16` was **HELD** per must-NOT-use #19; `vramNote` says "not published — MiniMax answers 未公布" and quotes the ~12 GB report as unverified. |
| Wan2.2-Animate-2 `warn` | **APPLIED** — `"3 weeks in"` → `"~5 weeks after release"`. |
| LTX 2.3 `warn` | **APPLIED** — `"Negatives are inert (CFG 1)"` removed (binding exclusion #11); now matches the `GOTCHAS` and `validate()` wording already live. |
| SCAIL-2 `warn` | **APPLIED** — `"Prompt-inert"` → `"Prompt-SUBORDINATE"` with the prompt's actual job stated. |
| Illustrious / NoobAI `licClass` | **APPLIED** — `'ok'` → `'risk'`, and the `warn` names the FAIPL-1.0-SD commercial prohibition. The verifier's claim #35 assumed the live row already read `risk`; it read `ok`, so this was a live false positive in the free/commercial filter. The `lic` **string** rewrite (naming exact licence identifiers per checkpoint) is **NOT cleared** and was not made. |
| `renderPicker` `licClass:'nc'` badge | **APPLIED** — `.pk-lic.nc` now renders in `--err`, so the three non-commercial rows are no longer indistinguishable from Apache rows. |
| `renderPicker` null-VRAM support | **APPLIED** (new, required by the two deletions) — rows without published VRAM render `"? VRAM unpublished"` and their `vramNote` instead of `VRAM undefined+ GB`, and sort last rather than reading as "comfortable" for everyone. |
| klein 9B `comfy` 16→24-32 · klein 4B `comfy` 8→12 · Qwen-Edit-2511 `comfy` 16→24 · Qwen quant sizes · Z-Image Turbo `disk` · every HF-tree byte count | **SKIPPED — not cleared.** The verifier lists each explicitly under *Not cleared* ("one fetch each would settle them"). klein 4B `min:6`→8 was also held: the correction is safe but sits inside an acknowledged vendor self-contradiction (8 / 8.4 / 13) that the gate says to ship with both numbers visible, which needs the fetch. |
| `WF_TEMPLATES` | **NO CHANGE** — all seven NO DRIFT; also forbidden by the brief. |

### C.wan

| Item | Outcome |
|---|---|
| W1 STYLE LEADS + attested style vocabulary | **APPLIED** — new leading bullet with 二次元厚涂动漫插画 / 日系赛璐璐风格 / 3D卡通风格 / 纪实摄影风格. |
| W2 2D-style aesthetic suppression | **APPLIED** (same bullet). |
| W3 name both official orders, drop "Style last" | **APPLIED** — the subject-first run and the vendor's aesthetic-run-first exemplars are both named as official; the rule-vs-example clash inside the string is gone. |
| W4a English aesthetic cap `不超过4种` | **APPLIED**. |
| **W4b "exemplars carry 9-11" / "Chinese may run to ~10"** | **BLOCKED — not applied** (claim #48, must-NOT-use #8). The Chinese branch is stated as *"the Chinese rewriter states no cap"*; no band was written. |
| W5 the three motion exemplar phrases | **APPLIED** — 猛烈地摇摆 / 缓慢地移动 / 打碎了玻璃, verbatim. |
| W7 复合运镜 | **APPLIED AS ADVISORY** — added to the vocabulary list only (`CAM_MOVE` already matched it). |
| W8 delete "measurably harms motion and identity" | **APPLIED** — the asserted measurement is gone. |
| W9 banned mood tokens | **PARTIALLY APPLIED** — the official rule string 不要输出关于氛围、感觉等文学描写 was added; the named compound list was **skipped for length**. |
| W11 rewrite the ZH exemplar | **APPLIED** — style first, 镜头从左到右横移, and 低机位 removed. This also repairs a live internal contradiction: the old exemplar emitted an angle **and** a move while the same string forbids it. |
| **English move list giving `arc shot` with `orbit` omitted** | **BLOCKED — repaired.** Now reads *"orbit, also called an arc shot"*, so exclusion #6's deleted doctrine is not re-taught by omission. |
| W6 closed 拍摄角度 set · W10 声音 cloud-tier | **SKIPPED — length.** The move-XOR-angle rule itself is already live. |

### C.wanI2V

| Item | Outcome |
|---|---|
| **I1 `固定机位` → `固定镜头`** | **APPLIED** — this was the live cross-target inconsistency of claim #40; the app now emits one token for one concept, and `CAM_FIXED` already matches it. |
| I4 quote 提示词 = 运动 + 运镜 | **APPLIED**. |
| I5 move-XOR-angle | **APPLIED**. |
| I8 quote the ZH rewriter's own 100字 sentence | **APPLIED** — 提示词长度控制在100字以内. |
| I3 speed adverbs + visible effect | **APPLIED** — "what visible effect it produces" added to the content rule. |
| I10 add a visible effect to the EN exemplar | **APPLIED** — "quick paw movements that scatter small shell fragments". |
| I2 PE-attested camera set · I6 banned mood tokens · I7 silent-classification line | **SKIPPED — length.** |
| I9 add a 49-character Chinese exemplar | **SKIPPED** — ADVISORY + NEEDS-RENDER, and it is the single most expensive item in the target. Logged as the highest-value outstanding item for this model: the ZH branch's unit differs by ~3× and still has no exemplar. |
| "15-70 words is usually right" | **SCOPED** — now says "in English", since the band was never a Chinese figure. |

### C.ltx

| Item | Outcome |
|---|---|
| **Length attribution residue** (the gate's unflagged item) | **APPLIED** — *"LTX-2.3: 200 words hard — that number, and only that number, is the LTX-2 README's; the 40-150 soft band is house craft descended from the LTXV-0.9 enhancer."* Exclusion #12 satisfied; the single attribution covering both numbers is gone. |
| L4 tag-syntax ban | **APPLIED**. |
| L9 English default | **APPLIED** (same bullet). |
| L11 "no labels" → "no meta-labels" | **APPLIED** — with the clarifier that a named transition inside the prose is not a label, which was the ambiguity that made the old wording fight the cut rules in the same string. |
| **L6 Auto Duration** | **NOT APPLIED** — ADVISORY and it needs the 09-03 K5 scope clause (absent from the shipped ComfyUI template). Not present in the live string, so nothing to correct. |
| L1, L2, L3, L5, L7, L8, L10, L12, L13, L14 | **SKIPPED** — already live from the first pass (L7 via A9), or additive/NEEDS-RENDER. |

### C.minimax

| Item | Outcome |
|---|---|
| M3 `Roll Clockwise/Counterclockwise` | **APPLIED** (single-source; see the caveat below). |
| M9 ban `(word:1.2)` and `{a\|b}` | **APPLIED** — code-level, verifier #50. |
| M10 "H3 takes NO negative prompt — CFG-distilled" | **APPLIED**. |
| M12 ~6 s → ~5 s with the `n % 17 == 5` grid | **APPLIED**. |
| M14 style list marked open | **APPLIED** — *"are examples, not a closed set"*, removing an unsourced closed set. |
| M6 mouth-stop clause | **APPLIED AS ADVISORY WORDING** — shipped as craft ("when a speaker's line ends, say so"), not as a vendor rule, per the gate's `[OFFICIAL-PATTERN]` downgrade. |
| M7 on-screen copy "3-5 words, ≤32 characters" | **SKIPPED** — ADVISORY, and its source is a CN product-ad skill; the gate forbids shipping it as a universal H3 rule. |
| M11 the exact `ValueError` string · M1 · M2 · M4 · M5 · M8 · M13 · M15 · M16/M17 | **SKIPPED — length**, or NEEDS-RENDER. |
| **Single-source caveat** | M1–M5, M8 and M13 all rest on `minimax-h3.md` item 8's transcription of a MiniMax "base guide" that no verifier has fetched (claim #43 — the largest single-source dependency in the audit). Only M3 was taken from that set, because it corrects a token already in the app. |

### C.minimaxref

| Item | Outcome |
|---|---|
| **R3 three-step label numbering** | **APPLIED** — the gate calls it the single most valuable change in this target: count per type → number from 1 with no gaps in the user's order → then write labels; per-type ordinals, never shared; no label without an asset. |
| R14 repeat the 350-500 band next to the exemplar | **APPLIED, placed OUTSIDE the fenced output** — a line before `Example input:` says the worked example is compressed and that a real `detailed_description` runs the full 350-500 words, plus an explicit "never put a note like this one inside your own output". This resolves the live contradiction (a ~110-word exemplar under a 350-500-word rule) **without** committing defect #51. |
| **R15 Ref2VA 16:9 / 9:16 at `[OFFICIAL-3P]`** | **BLOCKED — not applied.** Binding exclusion #21 rules it `[LORE]` by name, and `[OFFICIAL-3P]` is an invented grade. Not added at any grade. |
| **The exemplar meta-parenthetical** *"(<Video 1>'s soundtrack is not attached…)"* | **BLOCKED — not added** (defect #51). |
| R1 caps sentence | **NOT RE-APPLIED** — "12 files max" is already gone (claim #42, ruling #9); re-applying it would have duplicated. The live text already carries 9/3/3/3 = 18 with no total. |
| R2 drop the "15s total" figures | **N/A** — no "15s total" figure exists in this target; the ~15 s clip cap survives in `KNOWLEDGE` and the picker. |
| R4, R6–R9, R11 | **ALREADY** live from the first pass. |
| R5, R12, R13 | **SKIPPED** — ADVISORY / NEEDS-RENDER. |

### C.scail

| Item | Outcome |
|---|---|
| **S1 90-140 words in BOTH modes** | **APPLIED** — the live *"Animation: 15-60 words is enough"* was wrong; the vendor's rule is mode-agnostic and is now stated as such. |
| S2 delete "704p recommended for Replacement" | **APPLIED** — rule half was already done; the exemplar half is A3. The surviving sentence names pose-driven only. |
| S7 extend the ban list, drop bare `process` | **APPLIED** — adds `inpaint`, `"the task is"`, 分割/抠图 and "any mention of the prompt or of how it was made", and explicitly restores plain "process" as legal. |
| S13 ÷32 as a recommendation | **APPLIED** — "width and height **should** both be divisible by 32", exactly the wording exclusion #1 demanded. |
| S15 rewrite the exemplar to the band | **APPLIED (NEEDS-RENDER, shipped untested)** — the `PROMPT:` exemplar goes from ~50 to ~105 words and now demonstrates the anti-inflation shape and four concrete background nouns. Nobody has generated from it. |
| S8 512 UMT5 ceiling | **SKIPPED in the target — already enforced** by `validate()` (fixture `scail-viol-over512`), so it was not duplicated into the prompt. |
| S3 mask polarity both sides · S5 anti-inflation clause · S9 appearance-and-environment channel · S10 negative-prompt paragraph · S11 narrow to motion/identity | **SKIPPED — length.** S4, S6, S12, S14 are ADVISORY and were not shipped; note the gate's warning that S4's "FOUR OR MORE" count is the auditor's, not the source's. |

### C.sdxl

| Item | Outcome |
|---|---|
| X1 "the first clause sets the foundation" | **APPLIED**, replacing "trailing tokens fade". |
| **X2 the U-Net context rule (SDXL 4% / SD 2.1 0.2%)** | **APPLIED** — the gate's "best single change in the whole audit", and the scope limit exclusion #16 requires wherever the app states the order-over-prose rule. |
| X3 no standing quality words | **APPLIED** — "At most 2 quality words total" → "No standing quality words: add one only if the user asked for it." |
| X8 never machine-translate tags | **APPLIED**. |
| X9 no exact viewpoint from prose | **APPLIED** (folded into the camera/lens bullet). |
| X5 family-routed negative | **ALREADY** live from the first pass. |
| **X7 "text at the FRONT"** | **NOT APPLIED** (must-NOT-use #11) — it is one sentence from the Ragnarok guide's *Metallic Typography* example, and the gate only permits it scoped. Not worth the length at ADVISORY. |
| **X10 the RealVisXL literal negative** | **LEFT AS IS, flagged.** The gate marks it NEEDS-VERIFY: neither verifier re-fetched that card, and the app hardcodes the list. Not extended, not re-quoted, not removed. **Outstanding: one fetch of the RealVisXL card would settle it.** |
| X4 weights sparingly, X6 BOORU-in-negative | **SKIPPED — length.** |

### C.zimage

| Item | Outcome |
|---|---|
| Z2 weights are literal text | **APPLIED** — "No weighting syntax" → "(word:1.2) is not parsed, so it lands in the prompt as literal text". |
| **Residue: English prompt closing with a Chinese Base negative** | **APPLIED** — the target now says the vendor's Chinese negative list may be used verbatim even under an English prompt, and that this is the one place the language rule does not apply. Without it the 7B produced inconsistent language pairs. |
| Z1 (token conversion + `max_sequence_length=1024`), Z7 (MultiBind as vocabulary only), Z8, Z6 | **ALREADY** live from the first pass, in the correct scoped form. |
| **Z3 NegPiP "the only route"** | **NOT APPLIED** — the absolute the gate objects to is not in the live string, and adding the clause at `[LORE]` was not worth the length. |
| Z4, Z5, Z9, Z10 | **SKIPPED** — already live, additive, or NEEDS-RENDER. |

## E — Qwen-Image sweep OFFICIAL items into `KNOWLEDGE`

**APPLIED**, terse, with grade tags, in `KNOWLEDGE ¶QWEN-IMAGE`:

- **The 150 字 ZH portrait cap and the portrait scoping of the 200-word English figure** — both quoted
  as Subtask-1 rule 7 in their own rewriter, with the explicit statement that Subtasks 2 and 3 carry no
  length rule in either language. The ZH gloss "≈90-110 English words" was **not** carried: the gate
  marks it an unmeasured estimate that should be SYNTHESIS.
- **The order split** — ZH rule 6 hard (「人像场景中输出先后顺序按照上述说明」) vs EN "Recommended
  Description Flow" with its explicit override, quoted.
- **All three official no-text sentinels**, including 子任务三's 「图像中未出现任何文字或人像。」 which the
  sweep itself does not record (claim #6), with "pick one deliberately".
- **The `magic_prompt` three-way statement** — assigned-but-never-referenced in
  `prompt_utils_2512.py`; still returned by the legacy `prompt_utils.py`; still passed by the README's
  base-Qwen-Image snippet. Landed as *"DROPPED FOR 2512, still appended by base Qwen-Image — not
  'officially retired', not 'dead code' in general"*, which is exactly the scoping must-NOT-use #3
  requires.
- **The 2512 template's 50 steps and its filename `image_qwen_Image_2512`**, tagged
  *"OFFICIAL per the 09-10 sweep; not independently re-fetched"* (claim #12 is NOT RE-FETCHED), and
  framed as the sweep's template-vs-vendor distinction rather than as a vendor step count.
- The Lightning seed-variance collapse is recorded as **LORE, n≈3, no grids published**, and explicitly
  **not** made a validator rule (claim #11).

Also folded into `KNOWLEDGE` while on these surfaces:

- **Krea licence** — the "PDF nobody has opened" sentence is replaced by the route (`gated:false`,
  `LICENSE.pdf` at the repo root) and the `$1M` trailing-twelve-month clause, with the seat question
  phrased as *not found*, never *refuted*.
- **Krea "matte facts"** — regraded in `KNOWLEDGE` too, with the zero-occurrence figure and the
  vendor's mark-making vocabulary named as the real route; the 80-140 band relabelled craft against the
  10-230 / median-101.5 measurement.
- **klein scope on black outputs** — the surviving dual-CLIP sentence now says *"but NOT klein, where a
  mismatched encoder throws a mat1/mat2 shape error instead of a black image"*, closing the unstated
  scope the gate flagged.

## F — 2026-09-10 digest items

| Item | Outcome |
|---|---|
| ComfyUI release block (v0.34.4 / .5 / .6 / v0.35.0) and templates 0.11.55/.56/.57 | **APPLIED** (A7) — CONFIRMED byte-for-byte by the verifier. |
| v0.35.0 prompt-relevant changes | **APPLIED** — the four MiniMax H3 items (PDD LoRAs, Fun Union, **text-encoder-only references with the VAE made optional**, DiffSynth/ModelScope LoRA loading), Pixal3D Multi-View and SenseNova U1.5 named as core-support additions. |
| `cfgpp_ud10_ab` naming gap | **APPLIED in two places** — `KNOWLEDGE` (spelled out: no underscore between `cfg` and `pp`, so a `cfg_pp` substring match misses it) and the new `wfNotes(krea)` negative-slot note, which is where the consequence actually bites. |
| ComfyUI Manager registry lag (v0.10.7 vs PyPI 0.11.57) | **APPLIED** — one clause telling the reader to trust PyPI/GitHub over the Manager's "Latest". |
| **SenseNova U1.5 one-liner** | **SKIPPED as a model entry.** The brief conditions it on the verifier confirming the gate, and the verifier did **not**: claim #24 is OVERSTATED on one leg of three — only the HF `license:apache-2.0` **tag** was read, no LICENSE file, which must-NOT-use #13 names as the SCAIL-2 tag-vs-text trap. The model is therefore named only as a factual v0.35.0 core-support item, with **no licence claim of any kind**. |
| "local:partner ratio 6:8" | **NOT USED** (must-NOT-use #20) — the counting convention is unstated and every-bullet counting gives 6:9. |

## G — validator message-prefix contract (from `validator-accuracy-2026-09-10.md`)

**APPLIED, mechanically.** The accuracy file's "unresolved contract gap" was that most blocking
messages carried no `HARD:` prefix, so the stated contract and the emitted strings disagreed. Every
`issues.push(...)` inside `validate()` that the validator's own logic treats as blocking now starts
with `HARD:`; advisories already started with `advisory:`.

- **92** string-literal messages gained an inline `HARD: ` prefix; **3** expression-leading messages
  were wrapped as `'HARD: ' + …`; **36** were already correctly prefixed and were left alone.
- Census before: `HARD:` 2 · `advisory:` 50 · **no prefix 62**.
  Census after: **`HARD:` 64 · `advisory:` 50 · no prefix 0**.
- Severity classification is unchanged by construction (the harness and `renderCheck()` both treat an
  unprefixed message as blocking), so **no fixture expectation moved** — still 142/142.
- Nothing from the validator-accuracy pass was reverted. `CAM_FIXED`'s `固定镜头` (A4) came from that
  pass and was left in place.

## Verification

**Syntax** — both `<script>` blocks compiled with `new Function`, after every model:

```
script 0 OK
script 1 OK
```

**Structural anchors**, each present exactly once: `const TARGETS`, `const KNOWLEDGE`, `const GOTCHAS`,
`function validate(`, `const WF_TEMPLATES`, `function buildWorkflow(`, `const SDXL_NEG`,
`function wfNotes(`.

**Validator harness** (`node research/_addenda/validator-harness/run.mjs`), final run:

```
Fixtures: 142 across 12 model keys. validate() threw on 0.
Message-prefix census: HARD: 64 · advisory: 50 · no prefix 0
| key         |  n  | correct | false-hard | false-pass | wrong-severity | accuracy |
| wan         |  13 |      13 |          0 |          0 |              0 |     100% |
| wanI2V      |   8 |       8 |          0 |          0 |              0 |     100% |
| ltx         |  13 |      13 |          0 |          0 |              0 |     100% |
| minimax     |  14 |      14 |          0 |          0 |              0 |     100% |
| minimaxref  |   9 |       9 |          0 |          0 |              0 |     100% |
| scail       |  12 |      12 |          0 |          0 |              0 |     100% |
| sdxl        |  10 |      10 |          0 |          0 |              0 |     100% |
| sdxlAnime   |  12 |      12 |          0 |          0 |              0 |     100% |
| flux        |  14 |      14 |          0 |          0 |              0 |     100% |
| zimage      |  11 |      11 |          0 |          0 |              0 |     100% |
| total       | 142 |     142 |          0 |          0 |              0 |     100% |
## Failures (0)
```

**142/142, 0 false-hard, 0 false-pass, 0 wrong-severity, 0 throws.** No fixture was edited and no
validator rule was loosened to reach it. No rewritten exemplar failed its own model's rules, so no
exemplar-vs-validator conflict had to be adjudicated.

**System-prompt lengths** — measured on `TARGETS.<key>.system`, "before" = the live string at the
start of this pass (i.e. after the first pass), which is the baseline the gate's footnote requires.
The audit's own percentages were measured against the pre-first-pass strings and are not comparable.

| Model | before | after | Δ | ≤+20%? |
|---|--:|--:|--:|:--:|
| `wan` | 2,889 | 3,382 | +17.1% | ✓ |
| `wanI2V` | 1,680 | 1,979 | +17.8% | ✓ |
| `ltx` | 3,385 | 3,733 | +10.3% | ✓ |
| `minimax` | 2,994 | 3,402 | +13.6% | ✓ |
| `minimaxref` | 4,675 | 5,191 | +11.0% | ✓ |
| `scail` | 2,400 | 2,860 | +19.2% | ✓ |
| `sdxl` | 2,211 | 2,628 | +18.9% | ✓ |
| `sdxlAnime` | 3,490 | 4,131 | +18.4% | ✓ |
| `flux` | 1,761 | 2,107 | +19.6% | ✓ |
| `zimage` | 3,251 | 3,481 | +7.1% | ✓ |
| `qwenimg` | 2,299 | 2,769 | **+20.4%** | at the ceiling |
| `krea2` | 2,961 | 3,552 | +20.0% | ✓ |

**All twelve land at or inside +20%**, against the audit's six breaches of up to +58%. `qwenimg` sits
0.4 points over after four rounds of trimming; the alternative was dropping a second OFFICIAL
correction, so it ships as-is and is recorded here rather than waved through. Nothing was shipped at a
breach on the strength of a per-target exception (must-NOT-use #16).

**Cost of the cap.** Fitting inside it meant skipping ALLOW-graded OFFICIAL material, not just
ADVISORY material — most heavily on `qwenimg` (Q2, Q4, Q7, Q10), `sdxlAnime` (A5, A6, A7) and `minimax`
(M11 and the M1–M13 remainder). The audit's §C-9 remedy — hoisting the shared TIMING-WORDS, weighting
and negative-guidance blocks into a common prefix — was **not** implemented, because it changes the
`TARGETS` shape and every model's string at once, which is a larger structural edit than this pass was
scoped for. **It remains the correct next move**, and it is what would let the skipped OFFICIAL rows
land without a length exception.

## Outstanding after this pass

1. **§C-9 prefix hoist** — the real fix for the length pressure; would free 300-600 characters per
   video target.
2. **One fetch each** would settle: the RealVisXL card (`sdxl` X10, hardcoded and unverified),
   `Comfy-Org/Krea-2/LICENSE.pdf` §2.3 text, klein 9B/4B and Qwen-Edit-2511 `comfy` figures, the
   Illustrious v2.0 front-matter, `docs.comfy.org/tutorials/image/qwen/qwen-image-2512`, and
   SenseNova U1.5's LICENSE file.
3. **NEEDS-RENDER, shipped untested**: the `sdxlAnime` NoobAI exemplar and the `scail` ~105-word
   `PROMPT:` exemplar. Both use OFFICIAL vocabulary; neither has been generated from.
4. **`wanI2V` still has no Chinese exemplar** (I9), on a branch whose length unit differs by ~3×.

# Third pass (2026-09-11, documentation review follow-ups)

Triggered by the merge-notes review (`docs/MERGE-NOTES-2026-09.md`, "merge risks").

- **GOTCHAS `Qwen-Image` / "Ultra HD, 4K" card — REPLACED.** The card still said "officially retired / dead code" while KNOWLEDGE (CHANGELOG §E, Qwen sweep) had been corrected to the three-way finding. Now: dropped for 2512 (defined, never appended), still appended by base Qwen-Image's legacy rewriter and README snippet. Evidence: `research/qwen-image.md` → `## 2026-09-10 sweep` → `### Rewriter system prompts (verbatim diff)` [OFFICIAL]; verification-2026-09-10 CONFIRMED.
- **`validate()` "empty output" — PREFIXED `HARD:`.** The one message without a severity prefix after pass 2's contract fix. Harness re-run: 142/142.
- **README "Verifying your copy" — CLARIFIED.** Checksums are over LF bytes (ZIP / `git show`); a Windows clone with `core.autocrlf` will not match `certutil` directly. Text now says so and gives the `git show | shasum` alternative. No change to the sums' convention.
- `docs/SHA256SUMS.txt` regenerated; `docs/diffs/2026-09/` refreshed.
