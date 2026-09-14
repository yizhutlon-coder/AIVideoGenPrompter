# MERGE NOTES — 2026-09 branch → main

Working tree as of **2026-09-11**, against last commit **`b5f06fc feat: LoRA trigger-word notebook in WF export`**.
Nothing below is committed. This document is the narrative entry point; every "why" cites a file that
exists in this repo.

---

## Summary

1. One new feature — **Meta Inspector** (`tools/MetaInspector.html`, 944 lines, zero network), integrated
   into `PromptStudio.html` via a Tools-menu panel, a page-wide drop zone and a `postMessage` bridge.
2. One large **evidence-graded knowledge pass**: 106 proposed items in `docs/FOLD-IN-2026-09.md`, applied
   in two verifier-gated passes across all 12 rewriter targets, `KNOWLEDGE`, `GOTCHAS`, `validate()`,
   `wfNotes()` and the Model Picker. Per-item record: `docs/CHANGELOG-2026-09-10.md`.
3. One **validator accuracy pass**: 142 fixtures, 79% → 100%, plus a mechanical `HARD:`/`advisory:`
   severity-prefix sweep. Harness: `research/_addenda/validator-harness/`.
4. A large **research corpus addition** (13 new files + `test-kit/` + `validator-harness/`); every model
   file gained a dated `## 2026-09 sweep` section.
5. **To verify:** `node -e` syntax check on both `<script>` blocks, then
   `node research/_addenda/validator-harness/run.mjs` (expect 142/142, 0 failures), then grep
   `PromptStudio.html` for `http` (expect only `localhost:11434` and `127.0.0.1:8188` as fetch targets).
   All three were re-run for this document — see §Verification performed.
6. **Deliberately not included:** FOLD-IN §G (13 items, need renders), structural §C (four new
   `TARGETS`/`WF_TEMPLATES` keys), ~40 ALLOW-graded prompt instructions cut for the +20% length cap,
   and SenseNova U1.5 as a picker/licence entry. See §Deliberately not applied.
7. **Known wart:** `docs/SHA256SUMS.txt` is LF-normalized, so 9 of its 11 entries do not match a raw
   `certutil -hashfile` on a CRLF checkout. See §Merge & commit guidance.

---

## File inventory

Status is against `b5f06fc`. `M*` marks files git reports as modified **only because of CRLF/LF
normalization in this sandbox** — they carry no content change (see §Merge & commit guidance).

### Application

| Path | State | Purpose | Delta | Rationale lives in |
|---|---|---|---|---|
| `PromptStudio.html` | modified | The app. Meta Inspector integration + the whole knowledge/validator pass | 2,760 lines / 428,277 B; **+544 / −** per `docs/diffs/2026-09/PromptStudio.full.diff` (30 hunks), of which ~120 added lines are Meta Inspector | this file; `docs/CHANGELOG-2026-09-10.md` |
| `tools/MetaInspector.html` | **added** | Standalone metadata reader for ComfyUI/A1111 outputs | 944 lines / 73,386 B | §Feature: Meta Inspector; `research/_addenda/comfyui-metadata.md` |
| `README.md` | modified | Tools list gains the Meta Inspector paragraph (line 66) and the directory map entry (line 91) | 115 lines | §Feature: Meta Inspector |
| `docs/SHA256SUMS.txt` | modified | Regenerated, LF-normalized; now covers 11 files incl. `tools/MetaInspector.html` | 11 lines | §Verification performed |

### Documentation (all new)

| Path | State | Purpose | Size | Rationale lives in |
|---|---|---|---|---|
| `docs/RESEARCH-PLAN-2026-09.md` | added | The 12-agent plan for the 2026-09-03 run | 73 lines | itself |
| `docs/FOLD-IN-2026-09.md` | added | The proposal: 106 items (A 40 · B 12 · C 4 · D 10 · E 8 = 74 actionable; F 10 · G 13 · H 9), each with current text, proposed text, research citation, verifier verdict number, grade, risk note | 833 lines | itself, §Applying this |
| `docs/CHANGELOG-2026-09-10.md` | added | Per-item application record, both passes | 566 lines | itself |
| `docs/diffs/2026-09/` | added | Mechanically generated section-level diffs (LF-normalized) + before/after texts | 21 files | `docs/diffs/2026-09/README.md` |
| `docs/MERGE-NOTES-2026-09.md` | added | This file | — | — |
| `CHANGELOG.md` | added | Keep-a-Changelog rollup at repo root | — | this file |

### Research corpus (new)

| Path | State | Purpose | Size |
|---|---|---|---|
| `research/_addenda/comfyui-metadata.md` | added | Ground truth for Meta Inspector; verified 2026-09-02 against ComfyUI `master` | 48 lines |
| `research/_addenda/verification-2026-09.md` | added | Round-1 adversarial verifier (61 claims); **binding** | 589 lines |
| `research/_addenda/verification-2026-09-10.md` | added | Round-2 verifier: system-prompt gate, applied-edit audit, picker clearance | 649 lines |
| `research/_addenda/staff-claims-2026-09.md` | added | `[STAFF]`/`[CREATOR]` harvest with role evidence (12 rows) | 259 lines |
| `research/_addenda/comfyui-ops-2026-09.md` | added | Operational grounding for the tutor (source of §E1–E8) | 447 lines |
| `research/_addenda/test-kit-2026-09.md` + `research/_addenda/test-kit/` | added | 7 fixed-seed protocols + 50 workflow JSONs. **Nothing rendered.** | 853 lines + 50 JSON |
| `research/_addenda/system-prompt-audit-2026-09-10.md` | added | Instruction-by-instruction audit of all 12 system prompts (109 confirmed / 16 contradicted / 20 unsourced / 68 missing) | 1,639 lines |
| `research/_addenda/template-picker-audit-2026-09-10.md` | added | All 7 `WF_TEMPLATES` NO DRIFT; ~60 picker fields to fix | 845 lines |
| `research/_addenda/validator-accuracy-2026-09-10.md` | added | The measurement + every rule changed | 349 lines |
| `research/_addenda/validator-harness/` | added | `run.mjs`, `extract.mjs`, `fixtures.json` (142), `results-before.md`, `results-after.md` | 5 files |
| `research/digests/2026-09-03-digest.md` | added | Run-1 digest | 1,149 lines |
| `research/digests/2026-09-10-digest.md` | added | Run-2 digest (ComfyUI v0.35.0) | 451 lines |

### Research corpus (appended to, not rewritten)

`research/INDEX.md` (two new dated sections: `## 2026-09-03 update` at line 83, `## 2026-09-10/11 update
— accuracy pass` at line 120) · `research/{flux,ltx23,minimax-h3,qwen-image,scail2,sdxl,wan22,z-image,
new-models}.md` (each gained a `## 2026-09 sweep` section; `qwen-image.md` additionally a `## 2026-09-10
sweep`) · `research/_addenda/krea-character-art.md` (36-prompt harvest).

**M\*** — line-ending-only, no content change: `!START HERE.bat`, `.gitignore`, `CONTRIBUTING.md`,
`LICENSE`, `Make-Portable.bat`, `NOTICE`, `SECURITY.md`, `Start-*.bat`, `start-promptstudio.sh`,
`tools/{ClipChopper.bat,ClipPicker.html,H3Builder.html,video-prompt-translator.html}`,
`docs/{ComfyUI-Privacy-Handout.pdf,DESIGN-BRIEF.md,RESEARCH-PLAN.md,design/*}`,
`research/_addenda/comfy-templates/*`, `research/_cross/*`, and the pre-existing `_addenda/*` and
`digests/2026-08-*` files. Confirm with `git diff --ignore-all-space` before committing any of these.

---

## Feature: Meta Inspector

### What it does

`tools/MetaInspector.html` reads the generation recipe ComfyUI (and A1111/Forge) embeds in its outputs.
Header comment, verbatim:

> "Meta Inspector — reads ComfyUI (and A1111-style) generation metadata out of PNG / WebP / JPEG / MP4 /
> MOV / WebM / MKV / safetensors / JSON. Pure client-side. No network calls of any kind."

Parsers: `parsePng` (tEXt), `parseTiff`/`parseWebp` (EXIF), `parseJpeg`, `parseEbml` (WebM/MKV),
`parseSafetensors` (`.latent` / `.safetensors` header), `parseJsonText` (workflow or API `.json`, also
via Ctrl+V paste), all dispatched through `inspectFile`. It summarises: model family, canvas & sampling,
positive prompt, negative prompt, other text fields, LoRAs with strengths, model files, inputs & outputs,
canvas notes, the A1111 `parameters` line when present, and the raw metadata fields. It offers
**Send prompt → Translate**, **→ Reload settings into workflow export**, a `workflow.json` download, and a
**📦 Recipe bundle** ZIP (`workflow.json` + `api-prompt.json` + `recipe.txt` + the original file).

### Why

The README (line 66) states the use cases the feature was built for: *"answers 'which one worked?' after
a big batch, lets you recreate or tweak a successful output, and gives two machines with the same models
a way to swap complete recipes (good for teaching)."* The tool's own intro block expands this to four:
"Which one worked?", recreate-or-edit, collaborate/teach (the recipe bundle exists because chat apps
strip images and therefore metadata), and learning from other people's work.

The research question behind it — *what does ComfyUI actually embed?* — is answered in
`research/_addenda/comfyui-metadata.md` (line 3: "Ground truth for `tools/MetaInspector.html`. Verified
2026-09-02 against ComfyUI `master` source", with an `[OFFICIAL]` citation to
`nodes.py → SaveImage.save_images`). Its headings are *What gets written* · *Where it lives per container*
· *How much* · *Why a file comes up empty* · *Frontend behaviour worth knowing*. The two keys:

| Key | Contents | Container homes |
|---|---|---|
| `prompt` | the **executed API graph** — prompt text verbatim, checkpoint/UNet/CLIP/VAE filenames, `LoraLoader` name + `strength_model`/`strength_clip`, seed/steps/CFG/sampler/scheduler/denoise, width/height/length, fps; subgraphs already flattened | PNG `tEXt`; WebP EXIF tag `0x0110` Model; MP4/MOV container tags (`movflags=use_metadata_tags` → `moov/meta/keys`+`ilst`); WebM Matroska tag `PROMPT` (upper-cased by the muxer); safetensors `__metadata__` |
| `workflow` | the **canvas JSON** — the same values plus node positions, links, `widgets_values`, Note text, `definitions.subgraphs`, and `properties.cnr_id` per node (which custom packs are needed) | PNG `tEXt`; WebP EXIF tag `0x010f` Make; same container tags; same header |

Typical payload 10–60 KB (7 KB for a simple SDXL graph, 41 KB for Wan 2.2 14B I2V).

### Design constraints honoured

- **Zero network.** Measured on `tools/MetaInspector.html`: `http://` **0**, `https://` **0**, `fetch(` **0**,
  `XMLHttpRequest` **0**, `WebSocket` **0**, `import(` **0**, `<script src` **0**, `<link rel` **0**.
  This is the `CONTRIBUTING.md` rule *"Privacy is the product. No network calls except `127.0.0.1`."*
- **Single file.** No build step, no CDN, no external font — `CONTRIBUTING.md`, *"Single-file architecture
  is sacred."*
- **Privacy footer.** Subtitle: *"Nothing is uploaded; the file is parsed inside this page."* The
  PromptStudio panel header repeats *"nothing leaves this machine."* The footer carries three blocks:
  *Where the data lives*, *Why a file can come up empty*, *Trust* ("a recipe, not a signature").
- **Uses-and-limitations block at the top**, before any UI (see below).

### Integration points in `PromptStudio.html`

| Symbol | Line | What it hooks |
|---|---|---|
| `#metaBtn` | 289 | Tools-menu button, `onclick="toggleMeta()"` |
| `#metaPanel` | CSS 186–191, markup 393–399 | Side panel; `right:-1020px` → `right:0` on `.open` |
| `toggleMeta(force)` | 2533–2537 | **Lazy iframe load.** The iframe carries only `data-src`; line 2535 is `if (!f.src) f.src = f.dataset.src;` — the inspector is never parsed until first open |
| `metaInspect(files)` | 2538–2544 | Opens the panel, posts the files or buffers them into `metaQueue` |
| `psmeta-ready` branch | 2550–2553 | Drains `metaQueue`; the child posts `psmeta-ready` only when `EMBEDDED` (MetaInspector.html 149, 935–941) |
| `#dropVeil` | CSS 192–194, markup 400, wiring 2589–2599 | Page-wide drop zone, `pointer-events:none` so it never intercepts the drop; `dragover` shows it only when `e.dataTransfer.types` contains `Files` and re-arms a 250 ms `veilTimer` to hide it (avoids the spurious-`dragleave` problem). Guarded by `if (!PS_SPLIT)` |
| `handleComfyDrop(file)` | 2545 | `if (PS_PANE) handleComfyDropQuick(file); else metaInspect([file]);` |
| `handleComfyDropQuick` | 2508–2529 | The **old** longest-text-field → Translate path, kept for the split-pane case only |
| `psmeta-prompt` handler | 2554–2565 | "Send prompt → Translate": sets `#intent`, then finds the chip by `data-key`, ticks it only if unticked, and fires a synthetic `change` so the app's own chip logic runs. Graceful path when the family has no dialect ("pick targets manually") |
| `psmeta-loras` handler | 2566–2587 | "Reload settings into workflow export": stashes a one-shot `wfPrefill` (LoRA basenames, strength default 0.8, seed/steps/CFG, w/h, `duration = frames/fps`) and calls `openWf(key)`. If the target has no `WF_MAP` graph it copies LoRA filenames to the clipboard instead |
| `wfPrefill` consumption | 2344–2370 | `const pre = (wfPrefill && wfPrefill.key === key) ? wfPrefill : null; wfPrefill = null;` — one-shot handover. Fills `wfLora0/1`+strengths, seed/steps/CFG; resolution is a nearest-aspect-ratio match against `WF_RES[tplKey]` with a `-1` bonus for an exact hit; duration clamped to the input's min/max |
| `wfPrefillText` | 2345, consumed 2395 | Last-resort prompt text in `downloadWf()` when no translation output exists for that model; a green hint at 2347 warns the user |
| `wfPrefillApplied` | 2373, read at 2583 | Drives the toast that names exactly which fields were pre-filled |

### Security note

The parent's `message` listener (2546) authenticates by **source reference equality**, line 2548:

```js
if (!f || e.source !== f.contentWindow) return;   // only our own inspector frame; origin is opaque under file://
```

This is the right check for a `file://`-hosted app, where `e.origin` serialises to `"null"` and carries no
information. **Asymmetry to note:** the child listener (`MetaInspector.html` 936–938) performs no
`e.source`/`e.origin` check and will accept `psmeta-files` from any frame holding a handle to it. The
practical risk today is nil (same-origin `file://`, payload is a `File` parsed locally, no network), but
it is the weaker half of the pair and would need fixing before any http hosting.

### Tests run

- Node fixture harness over synthetic and real containers, including MP4 and WebM written by `ffmpeg`
  with the same `movflags`/Matroska tag layout ComfyUI uses (the WebM path matters because the Matroska
  muxer **upper-cases** the tag names to `PROMPT`/`WORKFLOW` — see `comfyui-metadata.md` §*Where it lives
  per container*).
- A jsdom test of the `postMessage` bridge (ready handshake, queue drain, `psmeta-prompt` chip selection,
  `psmeta-loras` → `wfPrefill`).
- Zero-network grep, re-run for this document (counts above).
- `docs/SHA256SUMS.txt` regenerated; `tools/MetaInspector.html` is entry 9 and its hash matches the
  working tree today.

### Known limitations (the tool's own block, condensed)

1. **Only the original file works.** "Metadata lives in the file's bytes, not its pixels." Screenshots,
   copy-paste and Discord/Reddit/X/Instagram re-encode and strip it; on Civitai only the **Download**
   button preserves it.
2. **Nothing is stored if the creator turned it off** — `--disable-metadata` (Desktop: "Disable saving
   prompt metadata in files"); Preview Image writes no file at all.
3. **The recipe is not the ingredients** — filenames only, never weights or input pixels. LoRA trigger
   words are not stored unless typed into the prompt.
4. **Reconstruction is best-effort** — positive/negative labels, sampler settings and model family are
   *inferred*; unusual custom nodes or a graph with no API `prompt` field will show gaps. "The raw JSON at
   the bottom is always the ground truth."
5. **It proves nothing** — "Embedded metadata is plain editable text — a recipe, not a signature. It
   cannot tell you who made a file or whether it was altered."

One more, from `comfyui-metadata.md` §*Frontend behaviour worth knowing*, which the parser has to handle:
subgraph **instance** nodes hold the real `widgets_values` while the inner template nodes may be stale, so
the API `prompt` is authoritative; and `ConditioningZeroOut` on the negative input means "no negative",
so the positive must not be reported as the negative.

---

## Knowledge & prompt changes — by model

How to read the tables: **change** quotes before → after; **id** is the FOLD-IN item or the second-pass
audit item as recorded in `docs/CHANGELOG-2026-09-10.md`; **evidence** names the research file and the
grade the corpus assigns; **verdict** is the verifier's ruling
(`research/_addenda/verification-2026-09.md` = round 1, `verification-2026-09-10.md` = round 2).

Section-level diffs: `docs/diffs/2026-09/TARGETS.<key>.diff`, `KNOWLEDGE.diff`, `GOTCHAS.diff`.

### Cross-model doctrine

The app now teaches four cross-model rules differently, and all four were **narrowed** rather than
extended — this pass mostly took claims away.

| Change | Item | Evidence | Verdict |
|---|---|---|---|
| Order-over-prose: "matched full prose embeddings on quality, attribute binding, spatial relations AND numeracy" → "reached **65% non-inferiority** against full embeddings' 70-90% — COMING CLOSE TO, not matching" | A33 | arXiv 2606.03715 via `research/flux.md` §2026-09 sweep · `[TESTED/PAPER]` | round 1 **#16 OVERSTATED** — exclusion #16 |
| …and it may never ship without its scope limits: by task (*"on GenEval 'Single object' 88-100%, but on DrawBench 'Text' only 24-37%"*) and by architecture (*"this is DiT-only. U-Net models collapse without context — SDXL 4%, SD 2.1 0.2% — so never apply it to the SDXL targets"*) | A33 + `sdxl` X2 | same | round 2 calls X2 **"the best single change in the whole audit"** |
| "four independent vendor guides converge on order-based emphasis" → one named source (*"BFL's own guidance independently says the same thing"*) | A34 | `research/flux.md` | round 1 **#17 "Uncounted. One is verified."** |
| Weighting syntax: "(word:1.2) is **actively destructive**" → "the stock tokenizer does not parse it at all — it lands in the prompt as **literal text**"; adds H3 (`disable_weights=True`, architecturally inert), `{a\|b}`, `[]`, and the NegPiP escape hatch | A28, A37, `krea2` K3, `zimage` Z2, `minimax` M9 | `research/_addenda/krea-character-art.md`; `research/minimax-h3.md` · `[OFFICIAL]` | round 1 **#23** (exclusion #23) |
| Negative-prompt liveness list corrected: adds **Wan-Dancer** (CFG 5.0) and **SCAIL-2** (CFG 5.0, ComfyUI exposes a real negative input the template leaves empty); demotes **klein Base** to *"architecturally live at guidance 4.0 but UNREACHABLE through diffusers, which pins the negative to `\"\"`"*; exonerates **Z-Image** (`ZImagePipeline` does accept a string negative) | A32, A36 | `research/z-image.md`, `research/flux.md`, `research/scail2.md` · `[OFFICIAL]`, diffusers #13416 | round 1 **#36 CONFIRMED (indirectly)**, F8 "refuted in half" |
| Licence notices added across nine models (H1–H9): H3 territorial ban **extends to outputs** (§V.4 + Exhibit A #1) and a LoRA is a Model Derivative (§I.11); NoobAI FAIPL-1.0-SD *"II. Commercial Prohibition"*; Pony V6 bans monetized inference; Animagine 4.0 permits commercial use; LTX "**annual revenues**, not ARR"; klein 9B non-commercial + mandatory filters; Krea $1M trailing-twelve-month; SCAIL-2 Apache-vs-MIT conflict; H3-vs-Comfy reseller conflict | H1–H9 | `research/minimax-h3.md` item 1, `research/sdxl.md`, `research/ltx23.md` item 15, `research/flux.md` item 6 · `[OFFICIAL]` | round 1 **#48** ("the sweep's strongest block"); H3/H4 flagged *"re-verify the licence text before folding"* |
| New GOTCHAS card, **Licenses**: myth *"Open weights means I can sell what I make with them."* | H1–H9 | as above | — |

**HOST TRAP** (A32) was also narrowed: *"several hosted APIs … expose a negative_prompt field on FLUX.2
and Z-Image that is architecturally DEAD"* → the dead-field claim survives for **klein only**.

`[LORE]` and `[SYNTHESIS]` items were kept out of hard rules throughout — see §Evidence-trail conventions.

### `flux` (FLUX.2, incl. klein)

The app now teaches FLUX length as a **capacity-vs-craft** split instead of a flat ceiling, and it stops
inventing a mechanism for the negative-prompt ban — it quotes BFL instead.

| Change | Item | Evidence | Verdict |
|---|---|---|---|
| "30-80 words is the official ideal; go longer ONLY for genuinely complex multi-object scenes — extra length does not improve quality, it collapses seed diversity" → "30-80 … **80-300+** only for genuinely complex multi-object scenes … FLUX.2 accepts 32K tokens but the shipped pipelines default to `max_sequence_length=512` and truncate silently — stay under ~480 tokens" | `flux` F-audit; validator F1 | `research/flux.md` §2026-09 sweep · `[OFFICIAL]` | round 1 CONFIRMED; bands quoted verbatim |
| "NEVER use weighting syntax like (word:1.3) — not parsed" → "…; **BFL's levers are order and specificity, not weights**" | A33-adjacent | `research/flux.md` | — |
| Negative-prompt rule now **quotes** BFL: *"Most FLUX models do not support negative prompts. Even when they can process them, AI models generally struggle with negation."* + "using the vendor's own substitutions" | `flux` sweep | `research/flux.md` §*softened negative-prompt line with a replacement table* · `[OFFICIAL]` | — |
| "Output ONLY the paragraph" → "Output ONLY the **prompt**" | editorial | — | — |
| KNOWLEDGE: "klein uses QWEN3 (9B needs Qwen3-8B; **wrong encoder = black images**)" → "**SIZE-MATCHED** QWEN3 — klein 4B ↔ Qwen3-4B, 9B and 9B KV ↔ Qwen3-8B"; the real symptom is *"mat1 and mat2 shapes cannot be multiplied (512x12288 and 7680x3072)"* at the sampler | A31, A38 | `research/flux.md` · `[OFFICIAL]` (re-fetched 2026-09-10) | round 1 **exclusion #13** — retire the black-image claim |
| KNOWLEDGE adds the official trap: *"ComfyUI's own Flux 2 example page hands you `mistral_3_small_flux2_fp8.safetensors` and never mentions klein."* | A31 | `research/flux.md` | — |
| KNOWLEDGE adds the intra-klein licence split and the 4-reference cap (dev: 6), "and has no prompt upsampler" | H7, `flux` sweep | `research/flux.md` item 6 · `[OFFICIAL]` | round 1 **#29 NOT RE-FETCHED** — `flux2_overview` was not re-checked; weakest leg in this model |
| **Citation BLOCKed:** the BFL native-language sentence must **not** be cited to `prompting_unified_technical` | round-2 gate `flux` BLOCK | round 2 **#26** read that page in full | round 1 **exclusion #15** |

Skipped for length: F13 (a text-in-image exemplar, NEEDS-RENDER). `flux` landed at **+19.6%**.

### `krea2` (Krea 2 Turbo / RAW)

This is the model whose teaching changed most, and the only one carrying a **retraction**. The app used to
teach Krea 2 from house craft; it now teaches it from the vendor's own 36 published prompts and from
`encoder.py`.

| Change | Item | Evidence | Verdict |
|---|---|---|---|
| Length: "ONE prose paragraph, 80-140 words" → "80-140 words is **TYPICAL craft guidance, not a rule and not capacity**: the vendor's own 36 published prompts run 10-230 words (median 101.5) and only 15 sit in that band. The hard ceiling is **512 conditioning positions ≈ 2,850 characters**" | K1 (+ A27) | `research/_addenda/krea-character-art.md` §*2026-09-10 harvest, Length distribution*, contradiction X1; `encoder.py` `max_length = 512` · `[OFFICIAL]` cap, `[TESTED]` cliff | round 1 **exclusion #22** (the app said "no cap exists anywhere in the source"); round 2 ruling #4 and #8 ("they measure different things and the app does not say so") |
| **RETRACTION of FOLD-IN B4.** Shipped in pass 1: *"Then follow the encoder's OWN slot order … colour → shape → size → … That is a better-evidenced ordering rule than any heuristic."* → "Use them as a **CHECKLIST, NOT as an order**: fill rates … colour 94%, spatial 94%, size 92%, texture 61%, shape 56%, quantity 53%, text 6%, and the order they actually use runs objects → attributes → spatial → background → composition → medium → lighting." | B4 (retracted); K10 | same harvest, falsified same-day against the 36 prompts | round 2 **#46 FALSIFIED**; must-NOT-use #4; ruling #3 — *"a retraction the second apply pass must make, not merely a change it declines"* |
| Anti-gloss route inverted: "Kill AI gloss with POSITIVE matte facts: 'matte surface, no specular highlights, dry pigment finish'" → "Kill AI gloss by **NAMING THE MARK-MAKING**, the vendor's own route: 'expressive thick brushstrokes', 'blocky painterly brushstrokes', 'flat shading', 'granular stippled shading', 'grainy paper texture'". The old string survives, **labelled** *"OUR house craft, not Krea vocabulary — zero occurrences in the 36"*; `flat graphic design` removed | K-"matte facts" | same harvest · regraded `[SYNTHESIS]` | round 2 **#17 BLOCK** → shipped as a regrade |
| "Output ONLY the paragraph" as an absolute → "**a trailing style tail (', impressionist painting, visible brushstrokes') is legal and vendor-normal: 15 of the 36 official prompts end with one**" | K-"output only" | harvest X6 | round 2 **BLOCK** on the absolute |
| CFG: "NO negative prompt (Turbo is CFG-free)" → the **route**: "Turbo is 8 steps, CFG-free in Krea's own CLI/diffusers path and CFG 1.0 in ComfyUI; RAW is 52 steps at CFG 3.5 — but the official Turbo card's own diffusers snippet passes `guidance_scale=3.5`, an unresolved conflict nobody has tested" | K4 | `krea/Krea-2-Turbo` card · `[OFFICIAL]` vs `[OFFICIAL]` | round 1 **exclusion #25** — "record the conflict; do not pick a side yet"; test **G3** would settle it |
| Negative slot: "If a negative slot is wired at all, connect a **REAL, EMPTY** text encode, never `ConditioningZeroOut`: with any `_cfg_pp` sampler that gives a degenerate uncond and visible grain" (target **and** `wfNotes(krea)`) | K5 / repair A5 | `research/_addenda/krea-character-art.md`; `research/digests/2026-09-10-digest.md` (core v0.35.0's `cfgpp_ud10_ab`) | round 2 **must-NOT-use #17**, live defect at `PromptStudio.html:2272` |
| Weights: "NEVER use (word:1.2) emphasis — it is **broken** on Krea 2" → "**the stock tokenizer does not parse it, so it lands in the prompt as literal text**"; paired with "RESTATE INSTEAD OF MULTIPLY — rather than (rust:1.4), describe the rust twice" | K3, K8 | `encoder.py` · `[OFFICIAL]` | round 1 **exclusion #23** |
| Nine descriptor axes retained as a checklist with fill rates; English-output clause added; reference token cost `(h/32)·(w/32)+2` **relocated** from the target into `wfNotes(krea)` to stay under the length cap | K9, K2, B5 | harvest · `[TESTED]` (one 1MP reference ≈ 1,026 tokens) | round 1 **#54 CONFIRMED** |
| Exemplar rewritten to stop demonstrating the retracted order | B-retraction | — | NEEDS-RENDER-adjacent; the new exemplar is the applier's |
| Picker `lic`: "Custom (<$1M/<50 seats)" → "Krea Community License — commercial use only under $1M revenue", with a `warn` naming the **trailing-twelve-month, company-wide, affiliates-aggregated** scope and *"No seat limit appears in the extracted text — we have not seen one, which is not the same as there being none"* | repair A6 / H8 | `Comfy-Org/Krea-2` `LICENSE.pdf` §2.3 (`gated:false`) | round 2 must-NOT-use #12 — never say "refuted" |
| KNOWLEDGE: parameter count "~12.9B" → "12-billion-parameter DiT"; enhancer rationale "RL-trained to INCREASE diversity" → the documented risk is an **ethics refusal that silently becomes your prompt**; ReferenceLatent claim marked **CONTESTED at source level** (`Krea2.extra_conds` reads only `cross_attn`) | A29, A30 | `research/_addenda/krea-character-art.md` · `[OFFICIAL]` / `[TESTED]` both directions | round 1 **exclusion #26** (no source for the diversity claim); **G2** is the test |

Skipped for length: K6 (flat-background difficulty, `[SPECULATION]`), K11 (second exemplar, NEEDS-RENDER).
K7 skipped as already covered elsewhere. `krea2` landed at **+20.0%**.

### `zimage` (Z-Image Turbo / Base)

The app now branches Turbo vs Base explicitly instead of teaching one recipe, and it states the token
budget as a number with a remedy rather than a vague danger zone.

| Change | Item | Evidence | Verdict |
|---|---|---|---|
| "NEVER exceed ~350 words — the default 512-token cap silently truncates the tail" → "The default cap is **512 TOKENS** and it truncates the tail silently: at the staff conversion of **0.75 words/token** that is about **380 English words**, so stop by ~360. If more is genuinely needed, the vendor's own remedy is **`max_sequence_length=1024`** in the diffusers call" | B1 / Z1 | `research/z-image.md` §2026-09 sweep · `[STAFF]` | round 1 **#34 CONFIRMED** (named a safe item) |
| New **VARIANT GATE**: "Turbo: type **9 scheduler steps (= 8 DiT forwards)**, guidance 0.0, NO negative prompt — guidance 0 skips the negative branch entirely … Base: 28-50 steps, CFG 3.0-5.0, negatives STRONGLY RECOMMENDED and officially 'responsive' — emit a short targeted negative (多余的人物, 面部变形, 手部畸形, 文字, 水印), never a mega-list … `cfg_normalization` is a CFG-burn limiter (False for stylism, True for realism)" | D10, B2, A35 | `research/z-image.md`; vendor code comment *"num_inference_steps=9,  # This actually results in 8 DiT forwards"* · `[OFFICIAL]`+`[STAFF]` | round 1 CONFIRMED; A35 corrects a live error |
| Language exception stated: "that Chinese list is the vendor's own and **may be used verbatim even when the prompt itself is English**, which is the one place the language rule does not apply" | second-pass residue fix | round-2 gate flagged the proposed English exemplar closing with a Chinese negative | round 2 gate, `zimage` residue |
| Multi-subject anti-bleed gains the vendor's own Chinese Base pattern (count first 两名, one clause per subject anchored 左侧/右侧 closed with "；", shared action 两人均…, capture-term run, background restatement) and names the four risks precisely: **drift / swap / dominance / blending** (MultiBind vocabulary) | B3, Z7 | `research/z-image.md` · `[OFFICIAL]` example; MultiBind as **vocabulary only** | round 1 CONFIRMED with the "vocabulary only" scope |
| Weights: "No weighting syntax" → "(word:1.2) is not parsed, so it lands in the prompt as literal text" | Z2 | as cross-model | exclusion #23 |
| Chinese band corrected 120-500 → **120-450** characters | D10 | `research/z-image.md` | — |
| KNOWLEDGE adds `cfg_truncation` (default 1.0, never fires; lowering it kills guidance and therefore the negative for late low-noise steps), the steps/time-shift coupling (16-30 steps need time-shift ~6-12), the encoder lock (*"our diffusion model works exclusively with qwen3-4b"*), and the worked example `height=1280 width=720` | B2, Z-sweep | `research/z-image.md` · `[STAFF]`/`[OFFICIAL]` | round 1 **#27** corrected the orientation (it is portrait, not 1280×720 landscape) |
| KNOWLEDGE: Base's two headline lines re-scoped — "that line and the `cfg_normalization` line live on the **GitHub README only** — the HF card drops both" | Z-sweep | `research/z-image.md` | round 1 **#28** (the vendor contradicts itself inside one file) |

Skipped: Z3 (NegPiP "the only route", `[LORE]`, and the absolute was not in the live string), Z4/Z5/Z9/Z10
(already live, additive, or NEEDS-RENDER). `zimage` landed at **+7.1%** — the cheapest target.

### `qwenimg` (Qwen-Image / 2512)

Two of this model's proposed instructions were **BLOCKed as written** and re-derived from the same-day
sweep. The app now scopes length and order by *class* and by *language* instead of globally.

| Change | Item | Evidence | Verdict |
|---|---|---|---|
| "Aim for about 200 words of direct, specific prose" (global) → "**LENGTH IS PER CLASS**: a PORTRAIT targets ~200 words in English or 150 字 in Chinese (输出控制在150字以内); text and general scenes carry **NO official length rule**" | Q1 as **BLOCKED**, replaced by sweep X1 | `research/qwen-image.md` §*2026-09-10 sweep*; `prompt_utils_2512.py` Subtask 1 rule 7 · `[OFFICIAL]` | round 2 **#7 / BLOCK**; must-NOT-use #1; ruling #1 *"the sweep wins outright, and I verified it at source"* |
| Portrait order "identity → clothing → …" → "ethnicity → gender → age (a number or range, never 'young') → … **Hard order in CHINESE; in ENGLISH only a Recommended Flow, so prefer natural sentence order**" | Q6 as **BLOCKED**, shipped scoped | ZH rule 6 ends 「人像场景中输出先后顺序按照上述说明」; EN rule 6 is headed *"Recommended Description Flow"* with an explicit override · `[OFFICIAL]` | round 2 **#8 / BLOCK**; ruling #2 *"both, by language, and the audit collapsed them"* |
| "that suffix is **officially retired**" → "**dropped for 2512** (the rewriter defines it but never appends it); **base Qwen-Image still appends it**" | Q12 | `prompt_utils_2512.py` (assigned, never referenced) vs legacy `prompt_utils.py` vs the README's base snippet | round 2 must-NOT-use #3 — the absolute and "dead code" are both forbidden |
| No-text sentinel: the live `无其他文字。` matched **no official string** → two official forms with a pick rule: none anywhere → 「图像中未出现任何可识别文字。」; text present but nothing more → 「图像中未出现其他文字。」 | Q11 | `research/qwen-image.md` · `[OFFICIAL]` (three sentinels exist; the third, 「图像中未出现任何文字或人像。」, is in KNOWLEDGE) | round 2 **#6** — the sweep itself does not record the third |
| Adds: "**Even an instruction is the description to be rewritten**"; a ban on "lists, numbering, headings or markdown"; a mandatory art-style statement (写实摄影 / 动漫插画 / 电影海报 / 3D 渲染); layout direction + "preserve punctuation, case and line breaks"; "Chinese quotes in Chinese, ASCII in English" | Q3, Q5, Q8, Q9 | `research/_addenda/system-prompt-audit-2026-09-10.md` ALLOW rows | round 2 ALLOW |
| Both exemplars rewritten — EN gains the art-style statement and the mandated no-text sentence; ZH gains 写实摄影风格, 横排, 粗糙 and the correct *other-text* sentinel | Q15, Q16 | as above | round 2 ALLOW; the ZH exemplar is a **text** image so the rule-string form would have been wrong |

Skipped for length (all ALLOW, all OFFICIAL): Q2, Q4, Q7, Q10 — the audit measured a full close at **+50%**.
Skipped as ADVISORY/NEEDS-RENDER: Q13, Q14, Q17. `qwenimg` shipped at **+20.4%**, 0.4 points over the cap,
recorded rather than waved through (`docs/CHANGELOG-2026-09-10.md` §Verification).

### `sdxl` (SDXL photoreal)

The single highest-value change in the whole pass lives here: the app no longer teaches DiT order-doctrine
to a U-Net model.

| Change | Item | Evidence | Verdict |
|---|---|---|---|
| "Trailing tokens fade" → "**The first clause sets the foundation everything after it is read against**" | X1 | `research/sdxl.md` §2026-09 sweep | round 2 ALLOW |
| **New rule:** "Front-load, but do NOT strip context: SDXL is a U-Net. In the ablation behind the order-over-prose rule a contextless bag of position-tagged words scored **65% on DiT models and only 4% on SDXL (SD 2.1: 0.2%)** — keep real phrases." | X2 | arXiv 2606.03715 via `research/flux.md` · `[TESTED/PAPER]` | round 2: **"the best single change in the whole audit"**; round 1 **exclusion #16** requires this scope wherever the rule appears |
| "Keep it under ~60 words (≈75 CLIP tokens)" → "…— **the Juggernaut author's own guidance**. Past 75 tokens ComfyUI does NOT discard your words: it encodes the prompt in separate 75-token chunks that cannot attend to each other, so cross-chunk relationships are lost." | A40 | `research/sdxl.md` · advice `[CREATOR]`, mechanism corrected | round 1 **#32 MISLABELLED (too low)** — keep the advice, drop the "ignored by the model" mechanism |
| "At most 2 quality words total" → "**No standing quality words: add one only if the user asked for it.**" | X3 | `research/sdxl.md` | round 2 ALLOW |
| **Negative prompt routed by checkpoint family**, replacing one hardcoded `SDXL_NEG`: RealVisXL gets its own published list; **Juggernaut XI / XIII Ragnarok emit NO negative block** (*"Start with no negative, and add afterwards the Stuff you don´t wanna see in that image"*); unknown family gets `SDXL_NEG` **plus a clause saying it is generic, not any card's** | D9 / X5 | `research/sdxl.md` §2026-09 sweep, card blocks verbatim · `[CREATOR]` | round 2 ALLOW — but see **X10** below |
| "Never machine-translate a tag: emit canonical English only." | X8 | `research/sdxl.md` | round 2 ALLOW |
| "do not rely on f-stops for exact blur" → "…, **or on prose for an exact viewpoint**" | X9 | `research/sdxl.md` | round 2 ALLOW |
| `wfNotes(sdxl)` gains the whole routing explanation, ending "**An empty negative on Juggernaut is correct, not a bug.**" | D9 | same | — |
| KNOWLEDGE: sampler non-portability made explicit — "RealVis **REQUIRES** a Karras variant (DPM++ SDE Karras ≥30 steps, or DPM++ 2M Karras ≥50); Pony Realism **bans** DPM++ 2M Karras" | `sdxl` sweep | `research/sdxl.md` · `[OFFICIAL]` | — |

**Weak evidence, flagged:** **X10** — the RealVisXL literal negative the app hardcodes was **not re-fetched
by either verifier**. Round 2 marks it *NEEDS-VERIFY before ship*; it was left as-is, not extended and not
re-quoted. One fetch of that card settles it. Skipped for length: X4, X6. **X7** ("text at the FRONT")
**not applied** — must-NOT-use #11, it is one sentence from the Ragnarok guide's *Metallic Typography*
example. `sdxl` landed at **+18.9%**.

### `sdxlAnime` (Pony V6 / NoobAI / Animagine / Illustrious)

This target was **restructured**: it used to teach one anime dialect; it now selects a family first and
applies only that family's block. It also carries the pass's two worst self-inflicted defects, both
repaired.

| Change | Item | Evidence | Verdict |
|---|---|---|---|
| **New first step:** "silently pick the FAMILY: `pony6 \| noobai \| animagine \| illustrious`. Use the one the user named; otherwise Pony V6, and add a trailing line `(assumed: Pony V6)`. Apply ONLY that family's block. **Pony V7 is AuraFlow, not SDXL** — if named, say so and stop." | D1 / A2 | `research/sdxl.md` §2026-09 sweep · `[OFFICIAL]` per card | round 2 ALLOW |
| "Start with the quality prefix: for Pony 'score_9, score_8_up, score_7_up, source_anime'" → the **full six-rung chain** "score_9, score_8_up, score_7_up, score_6_up, score_5_up, score_4_up", because a truncated chain has *"a much weaker effect compared to full string"*; plus exactly ONE `source_*`, optionally one `rating_*`; plus **CLIP-skip 2** (*"otherwise you will be getting low quality blobs"*) | D1 / A4 | Pony V6 card verbatim · `[OFFICIAL]` | round 2 ALLOW |
| "NO prose sentences" (universal) → "Prose sentences are banned on **ANIMAGINE only** … **Pony V6's own card explicitly endorses natural language**, so do not strip a descriptive clause on Pony" | D2 | `research/sdxl.md` | round 1 **exclusion #30** |
| "15-35 tags total" → **deleted** ("no card states a tag count") | D2 | — | round 1 **exclusion #31** |
| Per-family prefixes added verbatim: NoobAI "masterpiece, best quality, newest, absurdres, highres, safe," then `<character>, <series>, <artists>, <special tags>, <general tags>, <other tags>` (newest/recent/mid/early/old are **period** tags, never quality words); Animagine 4.0 count tag FIRST then "masterpiece, high score, great score, absurdres" at the **END** | D1 | the three cards · `[OFFICIAL]` | round 2 ALLOW |
| Illustrious: "**NO quality prefix at all** (no Onoma card states one; the masterpiece/best-quality scheme is third-party **LORE**)"; adds the six control-token axes (contrast / brightness / sharpness / dynamic colors / colorfulness / saturation) and "prefer 'black theme' over the contaminated 'dark'" | A24, B10 | `research/sdxl.md` · control tokens graded `[CREATOR]` via a reprint channel | round 1 **exclusion #29**; round 2 held A8 (needs a visible "community reprint" label) |
| **Negatives per family, never one universal list:** Pony V6 emits **none** (*"designed to not need negative prompts in most cases"*); NoobAI and Animagine get their cards' own lists; Illustrious gets the Animagine-style list only if asked, labelled community LORE | D3 | the cards · `[OFFICIAL]` | round 2 ALLOW |
| **REPAIR:** the pass-1 Pony-negative sentence was ungrammatical and self-negating → "emit NO negative block at all … Do not add an explanatory clause after the tags; just omit the block." | repair A1 | — | round 2 **#38b**, *"the highest-priority single edit in the round"* |
| **REPAIR:** exemplar 1 carried a **3-rung** score chain **and an illegal negative block** whose token list matched no family → six rungs, one `source_*`, `rating_safe`, no negative block, assumed-family line | repair A2 / A9 | — | round 2 **#39**, "ALLOW, urgent" |
| **New NoobAI exemplar** added — **shipped untested** | A10 | vocabulary and negative list are OFFICIAL (NoobAI card, verifier-confirmed); the **tag sequence is the applier's** | round 2 **NEEDS-RENDER** — nobody has generated from it |
| KNOWLEDGE: "Illustrious org static since Apr 2025" → "Illustrious's **HUGGINGFACE** org is static since Apr 2025 (it stops at v2.0), but the vendor platform lists nine models — v3.0 EPS, v3.0 VPred and v3.5 VPred shipped after that" | A26 | `research/sdxl.md` | — |
| KNOWLEDGE: NoobAI v-pred warning strengthened from "bans Karras" to the card's *"Sampling Method: Euler (⚠️ Other samplers will not work properly)"* plus the **four-part** graph (v_prediction, `rescale_betas_zero_snr=True`, CFG-Rescale ≈0.2, CFG 4-5) | A25 | `research/sdxl.md` · `[OFFICIAL]` | — |
| Picker row: `lic` "varies/checkpoint" → "varies/checkpoint — **some PROHIBIT commercial use**", `licClass` `'ok'` → **`'risk'`** | picker / H3 | NoobAI FAIPL-1.0-SD | round 2 **#35** assumed the row already read `risk`; it read `ok` — a **live false positive in the free/commercial filter** |

Skipped for length (all ALLOW): A5 (two Pony style templates + `rating_*` values), A6 (NoobAI percentile
explanation), A7 (Animagine parenthesis escaping + year tags). `sdxlAnime` is the largest target in the app
and landed at **+18.4%**.

### `wan` (Wan 2.2 T2V)

The app stops teaching a rule that has no first-party source (orbit ≤45°) and starts teaching the two
things the vendor's own rewriter actually enforces: style-leads and move-XOR-angle.

| Change | Item | Evidence | Verdict |
|---|---|---|---|
| **New leading rule:** "**STYLE LEADS if the user named one** — put it first (二次元厚涂动漫插画, 日系赛璐璐风格, 3D卡通风格, 纪实摄影风格); if it is 2D / illustration / anime, add **NO cinematic aesthetic tokens**, which the official rewriter suppresses for 2D styles" | W1, W2 | `wan/utils/system_prompt.py` via `research/wan22.md` §2026-09 sweep · `[OFFICIAL]` | round 2 ALLOW |
| "Subject, Scene, Motion, Aesthetic keywords …, Style" (with Style last) → **both official orders named**: "the vendor's exemplars also front-load that aesthetic run BEFORE the subject, so both orders are official" — the rule-vs-example clash inside the string is gone | W3 | same | round 2 ALLOW |
| "At most 4 aesthetic tokens in English (不超过4种); **the Chinese rewriter states no cap**" | W4a; **W4b BLOCKED** | `system_prompt.py` EN vs ZH · `[OFFICIAL]` instruction | round 2 **#48 BLOCK** on W4b: the proposed band "exemplars carry 9-11" was **not counted** — the verifier counted **9 / 11 / 7**. Must-NOT-use #8; the ZH twin of round-1 **exclusion #7** |
| Camera: "say 'arc shot' (**never 'orbit'**), keep arcs under 45 degrees" → "using official vocabulary (push in / pull back / pan left-right / tilt up-down / **orbit, also called an arc shot**; 镜头前推、镜头后拉、镜头从左到右、镜头上摇、环绕运镜、复合运镜)" | A1, A2, W7; **BLOCK repaired** | `research/wan22.md`: no first-party source for the 45° rule, and the guide's only 环绕运镜 example is a successful ~180° orbit | round 1 **exclusion #6**; round 2 BLOCKed the proposed word list for **omitting** `orbit` — "exclusion #6's deleted doctrine surviving as a word list" |
| **New:** "Do NOT also state a camera angle — the official rewriter suppresses 拍摄角度 whenever a camera move is present" | D6 / W-audit | `system_prompt.py` · `[OFFICIAL]` | round 2 ALLOW |
| Locked-camera token unified: emit **固定镜头** (accepting 固定机位 and 镜头位置保持不动 as synonyms) | A2 / I1 | 阿里云 rev. 2026-09-02, 「通过"固定镜头"来强调」 · `[OFFICIAL]` | round 2 **repair #3** — see §Retractions & repairs |
| "over-expansion **measurably harms** motion and identity" → "Do NOT pad." (the asserted measurement deleted); the official rule string 不要输出关于氛围、感觉等文学描写 added | W8, W9 | `system_prompt.py` rule 3 | round 2 ALLOW on W8 |
| Motion exemplar phrases added verbatim: 猛烈地摇摆 / 缓慢地移动 / 打碎了玻璃 | W5 | `system_prompt.py` exemplars · `[OFFICIAL]` | round 2 ALLOW |
| ZH exemplar rewritten — style first, 镜头从左到右横移, 低机位 removed. This **repairs a live internal contradiction**: the old exemplar emitted an angle **and** a move while the same string forbids it | W11 | — | round 2 ALLOW + **NEEDS-RENDER** |
| Validator: the **`orbit` error deleted**; camera-move counting fixed (the old regex had no `/g` and seven capture groups, so it was **always 8**); new advisory when 固定机位 appears without 固定镜头; aesthetic-token budget advisory; 运镜-vs-拍摄角度 advisory; mood-prose advisory | A3, H1, W1–W3, D6 | `research/_addenda/validator-accuracy-2026-09-10.md` §4 | see §Format checker changes |
| KNOWLEDGE: constants live in **`wan/utils/system_prompt.py`, NOT `prompt_extend.py`**; default target language is **Chinese** (`tar_lang="zh"`), so `--use_prompt_extend` on an English prompt rewrites it into Chinese; TI2V-5B has **no** empty-prompt auto-caption branch | A21-area, F10 | `research/wan22.md` · `[OFFICIAL]` | round 1 CONFIRMED (#38–#41 named as safe) |
| Picker: **Wan-Dancer** "Prompt Alignment 9.03" and `disk:'~28 GB'` **both deleted** — "neither exists on the card, the abstract or the project page"; `best` rewritten to music-to-dance with the fixed caption schema; `warn` gains "the global stage asserts `world_size == 8` (8 GPUs)" | A21 | `research/wan22.md` · `[OFFICIAL]` | round 1 **exclusion #8** |
| Picker: Wan2.2-Animate-2 `warn` "3 weeks in" → "~5 weeks after release" | picker | arithmetic from a release date already in the corpus | round 2 cleared |

Skipped for length: W6 (closed 拍摄角度 set), W10 (声音 cloud-tier), and W9's named compound mood list.
`wan` landed at **+17.1%**.

### `wanI2V` (Wan 2.2 image-to-video)

| Change | Item | Evidence | Verdict |
|---|---|---|---|
| "Hard cap 100 words" → "**Hard cap 100 words in English, 100 characters in Chinese** (the two official rewriters differ — the Chinese one says 提示词长度控制在100字以内); 15-70 words is usually right **in English**" | A22, I8 | ZH rewriter verbatim 改写后的prompt字数控制在100字以下 · `[OFFICIAL]` | round 1 CONFIRMED; the two rewriters differ by ~3× |
| Adds the official formula: "提示词 = 运动 + 运镜"; adds "what visible effect it produces" to the content rule | I4, I3 | `research/wan22.md` | round 2 ALLOW |
| "固定机位。" → "**固定镜头。**"; adds "MOVE or ANGLE, never both — with any camera move present, emit no shot-angle token" | I1, I5 | as `wan` above | round 2 **#40** — this was the live cross-target inconsistency |
| EN exemplar gains a visible effect: "quick paw movements **that scatter small shell fragments**" | I10 | — | round 2 ALLOW |

Skipped for length: I2 (PE-attested camera set), I6 (banned mood tokens), I7 (silent-classification line).
**I9 — a 49-character Chinese exemplar — is the highest-value outstanding item for this model**: the ZH
branch's length unit differs by ~3× and still has no exemplar. `wanI2V` landed at **+17.8%**.

### `ltx` (LTX 2.3 / 2.5)

The app used to state one length cap and one negative-prompt fact for LTX; both were wrong or
unattributable. It now splits by version and admits what is untested.

| Change | Item | Evidence | Verdict |
|---|---|---|---|
| "Cap at 150 words (official enhancer ceiling; LTX-2.5 style is 4-8 descriptive sentences)" → "**LENGTH IS VERSION-SPLIT. LTX-2.3: 200 words hard — that number, and only that number, is the LTX-2 README's; the 40-150 soft band is house craft descended from the LTXV-0.9 enhancer, not a current vendor figure.** LTX-2.5: 4-8 descriptive sentences … up to ~16 for a multishot … no word cap exists in its current guide" | A7 + second-pass attribution residue | `research/ltx23.md` §2026-09 sweep · `[OFFICIAL]` | round 1 **exclusion #12**; round 2 flagged the single attribution covering both numbers |
| "Negative prompts **do not exist** on the distilled path (CFG 1 skips them)" → "**Never require** a negative prompt: the distilled path runs at CFG 1.0 and the shipped template already hardcodes one." | A10, A11 | `research/ltx23.md` · CFG 1.0 `[OFFICIAL]`, inertness `[SPECULATION]` | round 1 **exclusion #11** — inertness is untested until test **T2-LTX** runs (**G1**) |
| **New:** "The official ComfyUI LTX-2.5 T2V template ships `prompt_enhance = true`, so a well-formed prompt may be rewritten before encoding … tell the user to toggle `prompt_enhance` off for exact wording." | A6 + new GOTCHAS card A5 | `research/ltx23.md` — *"the run's single most consequential teaching correction"* (`research/INDEX.md` line 92) · `[OFFICIAL]` | round 1 **#15/#16 CONFIRMED**, named among the strongest claims; Comfy Org's own tutorial says the opposite and is wrong |
| Cuts: "simple named cuts are allowed only if the user asked and is on 2.5" → the **four per-cut requirements**: name the transition in prose; re-establish shot scale/angle/who is in frame/lighting; re-identify recurring subjects with the same visual identifiers; state audio continuity. Prefer 2-4 shots; never emit a numbered shot list or bare sluglines | B12 | `research/ltx23.md` §*Longer / Screenplay-Style* · `[OFFICIAL]` | round 1 **#9 OVERSTATED** the slugline count (two prompts, one slugline) — the corrected citation is used |
| "Never use tag syntax, bracketed labels or weighting parentheses — LTX reads plain prose only. English by default…" | L4, L9 | `research/ltx23.md` | round 2 ALLOW |
| "no labels" → "**no meta-labels** (a named transition inside the prose is not a label)" — resolving the ambiguity that made the old wording fight the cut rules in the same string | L11 | — | round 2 ALLOW |
| KNOWLEDGE: VRAM floor "~15GB alone" → "**OFFICIAL MINIMUM IS 32GB+ VRAM** (system-requirements.md and the ComfyUI-LTXVideo README both), with 32GB RAM / 100GB storage / CUDA 12.7+ / Python 3.12+"; the low community numbers explained by int8/fp8 + offload + block streaming + tiled VAE — **not GGUF** (there is no official GGUF path for 2.5) | A12 | `research/ltx23.md` · `[OFFICIAL]` | round 1 CONFIRMED |
| KNOWLEDGE: "No universal negative list is documented" → "**THREE official negatives exist and they disagree**: the ~90-item `DEFAULT_NEGATIVE_PROMPT` in `ltx_pipelines/utils/constants.py`; a Diffusers copy missing its first five items; and a six-token aesthetic negative hardcoded in the official ComfyUI 2.5 template" | A9 | `research/ltx23.md` · `[OFFICIAL]` | round 1 CONFIRMED |
| KNOWLEDGE: licence "free under $10M **ARR**" → "'**annual revenues** of at least $10,000,000' … §1.6 aggregates subsidiaries and affiliates"; plus Attachment A #18/#20 and the §6 watermarking clause | A13 / H6 | `research/ltx23.md` item 15 · `[OFFICIAL]` | round 1 CONFIRMED |
| KNOWLEDGE: IC-LoRA control names re-pointed — pose now lives inside **Union Control**; "Motion Track Control" is documented as **Motion Control** with two nodes; adapter trigger phrases named (DEBLUR, REMOVEBEARD, COLORIZE, ADD WATER, ENHANCE QUALITY) | A14 | `research/ltx23.md` · `[OFFICIAL]`/`[STAFF]` | — |
| `wfNotes(ltx)` gains the frame grid (`num_frames % 8 == 1`, dims ÷32, Dub-It and Retake snap **silently**) and the enhancer-state warning | D7 (non-text-checkable half) | `research/ltx23.md` | see §Deliberately not applied |
| Picker `warn`: "Negatives are inert (CFG 1)" **removed** | picker / A10 | binding exclusion #11 | round 2: the picker row was an internal inconsistency with `GOTCHAS` and `validate()` |
| GOTCHAS card "LTX never cuts and caps at 150 words": "**True for 2.3.**" → "**Neither half survives.** The 150 figure comes from the retired LTXV-0.9 enhancer node, not from any 2.3 guidance" | A8 | as above | exclusion #12 |

**L6 (Auto Duration) NOT applied** — ADVISORY, and it needs the 09-03 K5 scope clause (Auto Duration is
absent from the shipped ComfyUI template). Nothing to correct: it was never in the live string.
`ltx` landed at **+10.3%**.

### `minimax` (MiniMax H3)

| Change | Item | Evidence | Verdict |
|---|---|---|---|
| Style keyword list "(Live-action, cinematic, 2D-animated, …)" → "**are examples, not a closed set**" | M14 | `research/minimax-h3.md` | round 2 ALLOW — removes an unsourced closed set |
| Camera type "Roll" → "**Roll Clockwise/Counterclockwise**" | M3 | `research/minimax-h3.md` item 8 | **Single-source caveat:** round 2 **#43** — item 8 transcribes a MiniMax "base guide" **no verifier has fetched**. M3 was taken only because it corrects a token already in the app; M1/M2/M4/M5/M8/M13 from the same set were not |
| "Default to **~6 seconds**" → "**~5 seconds** and 1-3 shots (local frame counts satisfy `n % 17 == 5`, so ~5s is the natural unit)" | M12 | ComfyUI node constants · `[OFFICIAL]` | round 1 **#50 CONFIRMED**, named a safe item |
| "There is no [CUT TO] syntax" → "…, **no (word:1.2) weighting and no {a\|b} wildcard syntax**"; plus "H3 takes **NO negative prompt**: it is CFG-distilled, so there is nothing for a negative to push against" | M9, M10 | tokenizer `disable_weights=True`; ComfyUI's wildcard expander consumes `{a\|b}` before the model sees it · `[OFFICIAL]` | round 2 **#50** (code-level) |
| **New craft clause:** "When a speaker's line ends, say so — 'her mouth closes and stays still' — or the mouth keeps moving after the audio stops" | M6 | `research/minimax-h3.md` · shipped as **craft, not vendor rule** | round 2 downgraded the source to `[OFFICIAL-PATTERN]` |
| KNOWLEDGE: release date Aug 3 → **Aug 2, 2026**; licence block replaced with the full clause set (territorial ban **on outputs** §V.4 + Exhibit A #1; §IV.1 US$20M authorisation route with the exact subject line; §IV.2 **SHALL** vs the merely-encouraged "Powered by"; §I.11 LoRA = Model Derivative; the Qwen3-VL Apache encoder does **not** relicense) | A17, B6, H1, H2 | `research/minimax-h3.md` item 1 · `[OFFICIAL]` | round 1 **#48**, "the sweep's strongest block" |
| KNOWLEDGE adds the local grid: "frame count must satisfy `n % 17 == 5` and snaps UP; the trained range is 124-362 frames at 24 fps"; "area at most 1,032,192 px (768×1344) — **1376×768 is rejected**" | D8 (relocated) | node source · `[OFFICIAL]` | there is no H3 export path in the app, so this is KNOWLEDGE, not a validator rule |
| KNOWLEDGE adds `MiniMaxH3AddGuide` (anchors a guide image/audio at **any** frame, negative `frame_idx` counts from the end, chainable) and per-token latent noise masks (*"a value of 0 preserves the corresponding latent region, while 1 regenerates it"*) | B7 | node source · `[OFFICIAL]` | round 1 **#20** — `MiniMaxH3AddGuide` is a fifth node the "only four nodes" claim missed |
| **DELETED:** "audio cannot be sent without at least one image or video" | A16 | — | round 1 **exclusion #19** — "not in the schema, not in the docs" |
| Picker `min`/`comfy` `48`/`80` → **`null`** with `vramNote:'not published — MiniMax answers 未公布; the official pruned-int8 build is reported at 480p+audio on ~12 GB (unverified at source)'` | picker | the row contradicted its own `warn` | round 2 cleared the **deletion**; **HELD** the replacement 12/16 (must-NOT-use #19) |

Skipped for length or as NEEDS-RENDER: M1, M2, M4, M5, M7, M8, M11, M13, M15, M16/M17. **M7** (on-screen
copy "3-5 words, ≤32 characters") was skipped on principle: its source is a CN product-ad skill and the
gate forbids shipping it as a universal H3 rule. `minimax` landed at **+13.6%**.

### `minimaxref` (H3 multi-reference)

| Change | Item | Evidence | Verdict |
|---|---|---|---|
| "up to 9 images + 3 videos 15s total + 3 audio 15s total, **12 files max**" → "local ComfyUI caps: 9 images + 3 reference videos + 3 video soundtracks + 3 standalone audio = **18 slots with NO total cap**; the '12 files max' figure is a hosted/tooling rule, advisory only. Each soundtrack takes its own ordinal, so `<Audio j>` can reach 6" | A15 / B8 | `MiniMaxH3ReferenceToVideo` Autogrow maxima · `[OFFICIAL]` | round 1 **exclusion #18**; round 2 ruling #9 — do not re-apply the caps sentence, it is already correct |
| **New, and the gate's single most valuable change in this target:** "NUMBERING, in three steps and in this order: (1) count the assets the user actually listed, per type; (2) number each type from 1 upward with NO gaps, in the order the user gave them; (3) only then write the labels. `<Picture>`, `<Video>` and `<Audio>` ordinals are per-type, never shared, and a label with no asset behind it must not appear at all." | R3 | node source, fixed presentation order · `[OFFICIAL]` (upgraded from `[LORE]` by B8) | round 2 ALLOW |
| **New, placed OUTSIDE the fenced exemplar:** "The worked example below is compressed to save space; a real `detailed_description` runs the full 350-500 words. **Never put a note like this one inside your own output.**" | R14 | resolves a live contradiction (a ~110-word exemplar under a 350-500-word rule) | round 2 ALLOW — deliberately placed outside the block to avoid defect **#51** |
| **BLOCKED — not applied:** the Ref2VA 16:9 / 9:16 restriction at `[OFFICIAL-3P]` | R15 | a third-party LoRA README | round 1 **exclusion #21** rules it `[LORE]` **by name**; `[OFFICIAL-3P]` is an invented grade (process defect #65) |
| **BLOCKED — not added:** the exemplar's inline parenthetical *"(&lt;Video 1&gt;'s soundtrack is not attached…)"* | audit's own new defect | — | round 2 **#51** — a 7B copies exemplar shape over rules; must-NOT-use #14 |
| GOTCHAS card rewritten: "H3 numbers references by ARRIVAL order — gaps close up" → the OFFICIAL fixed-order/ordinal mechanics, adding "writing a standalone voice reference as `<Audio 1>` when a video soundtrack is attached silently points at the wrong asset, **the single most likely Ref2VA authoring error**" | B8 | node source · `[OFFICIAL]` | round 1 **#42**, the verifier's "upgrade the grade" row |

Skipped: R5, R12, R13 (ADVISORY / NEEDS-RENDER). `minimaxref` landed at **+11.0%**, against a proposed
**+35%** the gate refused ("**Length exception: NOT granted as written.**").

### `scail` (SCAIL-2)

| Change | Item | Evidence | Verdict |
|---|---|---|---|
| "Replacement: 90-140 words. **Animation: 15-60 words is enough.**" → "**90-140 words in BOTH modes** — the vendor's length rule is mode-agnostic: SCAIL-2 is trained with long, detailed prompts, and short or empty prompts run but do worse." | A19 / S1 | `research/scail2.md` §2026-09 sweep · `[OFFICIAL]`; *"The girl is dancing"* is a **CLI smoke test**, not a style guide | round 1 CONFIRMED |
| Ban list extended: adds `inpaint`, `"the task is"`, 分割 / 抠图, "any mention of the prompt or of how it was made"; **restores plain "process" as legal** | S7 | official enhancer rules 1 and 7 · `[OFFICIAL]` | round 2 ALLOW |
| "704p recommended for Replacement" → "**pose-driven** work performs better at 704p (**the card does not name replacement**), width and height should both be divisible by 32" | A20 / S2, S13 | the card's own sentence: *"End-to-end driven supports both 512p and 704p. Pose-driven performs better under 704p"* | round 1 **exclusion #2** ("the words 'and replacement' are not in the source") and **exclusion #1** (`÷32` is a *should*, not a *must*) |
| **REPAIR:** the exemplar still ended `704p output recommended` on a `MODE: Replacement` case → "output dimensions divisible by 32" | repair A3 | — | round 2 **#41** — *"the changelog overstates it"*; exclusion #2 residue was still live |
| Exemplar rewritten from ~50 to ~105 words, demonstrating the anti-inflation shape and four concrete background nouns — **shipped untested** | S15 | — | round 2 **NEEDS-RENDER** |
| KNOWLEDGE: "**effectively PROMPT-INERT**" → "**PROMPT-SUBORDINATE, not inert** — the least prompt-sensitive model here that still has a load-bearing prompt"; adds "The prompt is an **APPEARANCE-AND-ENVIRONMENT** channel, not a motion channel" | A18 | `research/scail2.md` · `[OFFICIAL]` for the direction; **no controlled prompt experiment exists anywhere** | round 1 CONFIRMED; test **G13** would settle the magnitude |
| KNOWLEDGE: mask polarity spelled out **both** ways — "Animation = driving black / reference WHITE; Replacement = driving white / reference BLACK"; `--matchnearest` located as a **preprocessor** flag; "a 7th identity wraps and collides, so **6 is a hard cap**"; "Routing is **POSITION-first, not colour-first**" | A20, `scail` sweep | `research/scail2.md` · `[OFFICIAL]`+`[TESTED]` | round 1 **#5/#9 CONFIRMED**, named among the strongest |
| KNOWLEDGE adds: "hard cap **512 UMT5 tokens** (`wan_shared_cfg.text_len = 512`)"; "Dimensions should be divisible by **32, not 16** … a multiple-of-16-but-not-32 canvas circular-pads and the bottom ~8-16px echoes the top" | A19, S13 | `[TESTED]` — *"the official ComfyUI tutorial's 'divisible by 16' is the surface that is wrong"* | contradicts official docs on TESTED evidence; flagged in §Evidence-trail conventions |
| KNOWLEDGE adds the Apache-vs-MIT licence conflict (code repo Apache 2.0 "Copyright 2026 Zhipu AI", every distribution surface tagged MIT; both permissive) | H9a | `research/scail2.md` | round 1 **#8**, ruling #2 — state the conflict |
| Picker `warn`: "**Prompt-inert**" → "**Prompt-SUBORDINATE** — the prompt still describes the final video, but masks … and drive quality are the real work" | picker | as A18 | round 2 cleared |

Skipped for length: S3, S5, S9, S10, S11 (plus ADVISORY S4, S6, S12, S14; note the gate's warning that
S4's "FOUR OR MORE" count is the auditor's, not the source's). **S8** (the 512 UMT5 ceiling) was skipped in
the target because `validate()` already enforces it (fixture `scail-viol-over512`). `scail` landed at
**+19.2%**, against a proposed **+43%** the gate refused.

---

## Format checker (`validate`) changes

Diff: `docs/diffs/2026-09/validate.diff` (one hunk, `@@ -3,149 +3,325 @@` — the body of `validate()`
only). Measurement and rationale: `research/_addenda/validator-accuracy-2026-09-10.md`.

> **Correction to a number in circulation.** "21" is the **false-hard count in the *before* run**
> ("21 (20 on OFFICIAL/gold)"), not a count of rules changed. The accuracy file's §4 *Every rule changed*
> lists **25 numbered items**. Both numbers are correct about different things; this document uses 25.

### The severity contract

`validate()` returns a **flat array of strings**; severity lives in the wording. The contract, as
`validator-accuracy-2026-09-10.md` §1.2 states it and as `docs/CHANGELOG-2026-09-10.md` §Deviations 1
records the decision:

- message starts with `advisory:` → **advisory** (non-blocking guidance)
- message starts with `HARD:` **or carries no prefix** → **blocking**
- no messages → **pass**

The gap it found: *"In the pre-fix build, exactly ONE message in the whole function carried `HARD:` … 98 of
the 106 messages emitted across the fixture set carried no prefix at all."* `renderCheck()` renders an
unprefixed message exactly like a hard one — a `⚠ N issues` badge plus a **Fix** button — so the tier was
inferable but not declared. `docs/CHANGELOG-2026-09-10.md` §G closed it mechanically: **92** string
literals gained an inline `HARD: `, **3** expression-leading messages were wrapped as `'HARD: ' + …`, **36**
were already correct. Census **before: `HARD:` 2 · `advisory:` 50 · no prefix 62** → **after: `HARD:` 64 ·
`advisory:` 50 · no prefix 0**. Severity classification is unchanged by construction, so **no fixture
expectation moved**.

**Rule for future rules** (accuracy file §8): *"If the source says 'warn', the message must start with
`advisory:`. If it says 'error' / 'block, don't warn', it must not."*

**One residue:** `if (!t) return ['empty output'];` was never prefixed, so §G's "no prefix 0" is off by
one. It is still classified blocking, so nothing moves — a contract-completeness defect only.

### The 25 rule changes

| # | Key | Before → After | Class | Evidence |
|---|---|---|---|---|
| **H1** | `wan` helper | `pos.match(CAM_MOVE).length` — "no `/g` flag and seven capture groups, so … was **always 8** whenever any camera verb appeared" → new `CAM_MOVE_G` with `/g` and non-capturing groups | false-hard (arithmetic) | `research/wan22.md` §Validator suggestions ("warn on >2 distinct camera moves") |
| **H2** | `wan`/`wanI2V` helper | `CAM_MOVE` gained 复合运镜; `CAM_FIXED` gained **固定镜头**, 镜头位置保持不动, `fixed shot`, `locked-off` | false-pass (coverage) | `wan22.md` §Validator changes #3, verbatim |
| **H3** | all | Severity-tier comment block added above `validate()` (nothing in source stated the convention) | documentation | `docs/CHANGELOG-2026-09-10.md` §Deviations 1 |
| **X1** | all video | The intent-vs-output sequencing check tested the output with the intent's narrow regex → new `seqOutRe` also accepts `initially`, `a moment later`, `later,`, `subsequently`, `once …`, `finally`, `first,` | false-hard | `ltx23.md` Pair 6 NOTES — *"Chronological connectives are the documented ones: Initially…, A moment later…"*; the guide's own vocabulary was read as **missing** sequencing |
| **W1** | `wan` | `too short/too long` **blocking** → `advisory:` both ends, bands 35–140 EN / 60–200 Han | wrong-severity | `wan22.md`, verbatim: *"35–140 English words or 60–200 Han characters; **warn, do not fail**, outside band"* |
| **W2** | `wan` | `multiple camera moves` fired on **one** move → real count, only above 2 | false-hard | H1 |
| **W3** | `wan` | *(new)* `advisory:` when 固定机位 / 镜头位置保持不动 appears without 固定镜头 | coverage | `wan22.md` §Validator changes #3; `system-prompt-audit-2026-09-10.md` I1 (阿里云 rev. 2026-09-02) |
| **I1** | `wanI2V` | Only the English 100-**word** cap was checked → added the Chinese 100-**character** cap as a separate blocking rule | false-pass | `TARGETS.wanI2V.system` verbatim; FOLD-IN **A22** |
| **L1** | `ltx` | *(new)* Dub-It recognizer: `[Speaker] is speaking [Language/Accent], saying: "…"` validates on its own rules and returns before the paragraph/length/audio rules | false-hard | `ltx23.md` §Validator changes **V14**, verbatim |
| **L2** | `ltx` | `too short (<35 words)` blocking → `advisory:` | wrong-severity | No word floor exists in the 2.5 guide; V6 replaces length with a sentence-count rule already enforced separately |
| **M1** | `minimaxref` | `detailed_description thin (<120)` / `too long (>560)` blocking → `advisory:` at **<300 / >550** | false-hard (all 3 `minimaxref` FHs) | `minimax-h3.md`, verbatim: *"**warn** below 300 or above 550 English words; target 350–500"* |
| **S1** | `scail` | Only `replace/swap/edit/mask/segment` banned → the official enhancer's own list: `the task is`, `Gemini`, `editing software`, `Photoshop`, `inpaint`, `prompt`, 分割, 抠图, 修图 | false-pass | `scail2.md` §Validator changes #3 · `[OFFICIAL]` |
| **S2** | `scail` | `PROMPT too long (>160)` blocking → `advisory:`, plus a new `advisory:` **under 60 words**, both quoting the one 90–140 band for **both** modes | wrong-severity | `scail2.md` §Validator changes #1; FOLD-IN **A19** |
| **S3** | `scail` | *(new)* `HARD:` above ~360 words / 2,000 chars — the `text_len = 512` UMT5 cap at 0.75 words/token | false-pass | `scail2.md` §Validator changes #2: *"Hard cap: 512 UMT5 tokens. **Block, don't warn**, above it"* |
| **A1** | `sdxlAnime` | `Pony V6: missing the score chain` blocking → `advisory:` (both absent-chain and short-chain) | wrong-severity | Pony V6's card makes a **strength** claim, and the same card endorses natural language |
| **A2** | `sdxlAnime` | `Illustrious: no Onoma card states any quality prefix` blocking → `advisory:` | false-hard (blocked the Illustrious v3.5-vpred gold pair) | `sdxl.md`: mark the scheme *"a suggestion labelled `[LORE]`"* |
| **A3** | `sdxlAnime` | *(new)* blocking when a **v-pred** family is detected **and** the request names a **Karras** schedule | false-pass | `sdxl.md` NoobAI v-pred block: *"Scheduler MUST NOT be karras … — **error**, cite the card"*; FOLD-IN **D4** |
| **F1** | `flux` | `too short (<25)` / `too long (>160)` blocking → `advisory:`; `advisory:` above **300**, blocking only above **360 words** (≈480 tokens of `max_sequence_length=512`) | wrong-severity | `flux.md` §Validator changes: *"Warn above 480 tokens … 80–300 allowed for genuinely complex scenes"* |
| **Z1** | `zimage` | `too short (<55 words)` / `thin (<90 Han)` blocking → `advisory:`, band corrected to 120–450 Han | false-hard (all 3 `zimage` FHs) | `z-image.md` states *categories*, never a floor; only the 512/1024-token limits stay blocking |
| **Q1** | `qwenimg` | **No edit mode existed**, so every edit prompt was blocked twice over → new **edit branch**: negative-block and no-text rules skipped, edit shape checked instead, a preservation clause required | false-hard | `qwen-image.md` §Validator suggestions ("Classify portrait\|text\|general\|**edit** before validating"); §Validator changes #7 |
| **Q2** | `qwenimg` | One rule `must either quote visible text exactly or state …` → split: **blocking** only when the prompt names a text carrier (sign/poster/label/menu/slide/海报/招牌…) and quotes nothing; otherwise **advisory** | false-hard | `qwen-image.md`; the app's own portrait exemplar omits it |
| **Q3** | `qwenimg` | Sentinel set too narrow → extended to 图像中未出现其他文字, 图像中未出现任何可识别文字, `no other text`, 「…」 | false-hard | `qwen-image.md` §Validator changes #4 (X4), verbatim |
| **K1** | `krea2` | `too short (<55)` / `too long (>170)` blocking → `advisory:` outside 80–140, message quoting the measured distribution (10–230 words, median 101.5, 42% inside) | false-hard / wrong-severity | `krea-character-art.md` §2026-09-10 harvest §Length distribution, contradiction **X1** |
| **K2** | `krea2` | `does not lead with the medium` blocking, matched in the first 60 chars, with an unanchored `art` alternative (so `partially` matched) → `advisory:` in two flavours, medium vocabulary widened, `\bart…\b` anchored | false-hard | Harvest **X2** — *"named within the first 80 characters in 24/36 … never named at all in 4"* |
| **K3** | `krea2` | `background mentioned but not locked` blocking, accepting only `solid`/`flat` → `advisory:`, accepting `plain`, `uniform`, `seamless`, `pitch-black`, `single-colour`, `monochromatic` | false-hard | Harvest **C4**, the vendor's own lock wordings verbatim |

### New rules added by the FOLD-IN §D application

Distinct from the accuracy fixes above. Grouped by key, with the item that licenses each.

- **`wan` (D6)** — front-loaded aesthetic-token budget (`AES_EN`/`AES_ZH` over the first 8 comma fields;
  `advisory:` above 4 EN / 10 ZH); 运镜-vs-拍摄角度 exclusion advisory; mood-prose advisory on
  `氛围|感觉|充满.{0,4}感|张力`. **A3:** the `orbit` error **deleted**.
- **`ltx` (D7)** — version split (`const isV23 = /\b2\.3\b/.test(intent || '')`); sentence-count rule
  (`sents > (cutsA ? 16 : 8)` → HARD); multishot pack (named transition required in prose, audio-continuity
  clause per cut, >4 shots HARD); single-take contradiction; static-camera-by-prose → HARD with the
  camera-control-LoRA route. Negative-prompt message rewritten off "INERT" (exclusion #11).
- **`minimax` (D8)** — `[Shot 1]` with a timestamp → HARD; `(word:1.2)` → HARD; `{a|b}` → HARD; longest
  unbroken run between `[Shot N]` markers > 450 words → HARD, quoting the vendor error string.
- **`minimaxref` (D8)** — per-type caps (Picture 9 / Video 3 / Audio 6) → HARD; 1-based ordinal-gap
  detection → HARD (emitting **one message per reference type**, not per missing ordinal — a defect caught
  and fixed during the pass-1 out-of-process exercise); `<Video>`+`<Audio>` co-occurrence advisory.
- **`sdxl` (D9)** — the negative-block requirement gains `&& !/juggernaut|ragnarok/i.test(…)`.
- **`sdxlAnime` (D1/D2/D3/D4)** — family detector `fam` from intent+text, everything gated on it, with an
  `advisory:` when no family is detected (per the brief, **no hard errors on an unknown family**);
  `15-35 tags` and the global prose ban **deleted**; per-family rules for Pony V6, NoobAI, Animagine,
  Illustrious and Pony V7; the v-pred+Karras rule (A3).
- **`zimage` (D10)** — two-tier token budget replacing one tier: Han >450 and >900 HARD; EN >360 and >760
  HARD, both naming the `max_sequence_length=1024` remedy.
- **`krea2` (D5)** — `t.length > 2500` HARD (512 conditioning positions; "clean at 576 tokens, pure black
  at 640"); `t.length > 1400` advisory (expander interlock — it cannot read `prompt_enhance`, so it fires
  on character count and is phrased conditionally); reference-image budget advisory quoting
  `(h/32)·(w/32)+2` (it cannot see attachments, so it fires when the text mentions a reference image).

### How to run the harness

```bash
cd research/_addenda/validator-harness
node extract.mjs                       # smoke test: prints validate('wan','test') as an array
node run.mjs                           # full report to stdout
node run.mjs --save results-after.md   # …and write it next to the fixtures
node run.mjs --key krea2               # one model key
node run.mjs --id krea-gold-p7-official25
PS_APP=/path/to/other/PromptStudio.html node run.mjs   # score a different build
```

And the gating syntax check after any app edit:

```bash
node -e "const fs=require('fs');const h=fs.readFileSync('PromptStudio.html','utf8');\
[...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].forEach((m,i)=>{new Function(m[1]);console.log('script',i,'OK')})"
```

**No Node version is stated anywhere** in the harness or the addendum, and there is no `package.json`.
In practice it needs ESM `.mjs`, `node:` import prefixes and `??` — so ≥16. It was run for this document
on **Node v22.23.2**. Two quirks worth pinning: `run.mjs`'s header documents a `--md` flag the
implementation does not parse (it is a no-op — output is already plain markdown), and
`process.exitCode = 0` unconditionally, so **the harness never fails a build**. If you want CI gating,
that line needs changing.

All 142 fixtures live in one `fixtures.json` (133 KB), shape `{ "_readme": …, "fixtures": [ … ] }`. Each
record is `{key, id, text, expect, rule, source, grade, intent?}` — `source` names the research file **and
section** that licenses the fixture, `grade` mirrors that source's evidence grade, and `text` may contain
`{{WAN_NEG}}` / `{{SDXL_NEG}}` / `{{QWENIMG_NEG}}`, expanded from the app's own constants by `run.mjs` so
**a fixture can never drift from the string the app actually emits**. Ids read
`<shortkey>-<class>-<slug>`, class ∈ `gold` (77) / `viol` (59) / `adv` (6).

### Accuracy, before → after

| key | n | before correct | before FH / FP / WS | before | after correct | after |
|---|--:|--:|---|--:|--:|--:|
| `wan` | 13 | 10 | 1 / 0 / 2 | 77% | 13 | 100% |
| `wanI2V` | 8 | 7 | 0 / 1 / 0 | 88% | 8 | 100% |
| `ltx` | 13 | 11 | 2 / 0 / 0 | 85% | 13 | 100% |
| `minimax` | 14 | 14 | 0 / 0 / 0 | 100% | 14 | 100% |
| `minimaxref` | 9 | 6 | 3 / 0 / 0 | 67% | 9 | 100% |
| `scail` | 12 | 8 | 1 / 1 / 2 | 67% | 12 | 100% |
| `sdxl` | 10 | 10 | 0 / 0 / 0 | 100% | 10 | 100% |
| `sdxlAnime` | 12 | 9 | 2 / 1 / 0 | 75% | 12 | 100% |
| `flux` | 14 | 14 | 0 / 0 / 0 | 100% | 14 | 100% |
| `zimage` | 11 | 8 | 3 / 0 / 0 | 73% | 11 | 100% |
| `qwenimg` | 13 | 9 | 4 / 0 / 0 | 69% | 13 | 100% |
| `krea2` | 13 | 6 | 5 / 0 / 2 | **46%** | 13 | 100% |
| **total** | **142** | **112** | **21 / 3 / 6** | **79%** | **142** | **100%** |

`validate()` threw on **0** in both runs. **No fixture was edited and no validator rule was loosened to
reach 100%** (`docs/CHANGELOG-2026-09-10.md` §Verification). Seven fixture *labels* were corrected during
the pass; each carries a `relabelled` field explaining why (e.g. `wan-gold-p3-zh`: *"no sourced rule fires
on this pair … the original 'advisory' label was the harness author's prediction, not a rule"*).

---

## Model Picker changes

Diff: `docs/diffs/2026-09/MODELSPEC.diff`. Only rows the round-2 verifier explicitly cleared were touched
(`verification-2026-09-10.md` §*Picker corrections cleared for apply*).

| Row · field | Old → New | Source / clearance |
|---|---|---|
| **LTX 2.3** `warn` | "Negatives are inert (CFG 1); native speech is gibberish…" → "**A negative prompt is never required** (the distilled path runs CFG 1.0 and the shipped template hardcodes one) — **whether it does anything there is untested**; …" | Binding **exclusion #11**. The row was internally inconsistent with `GOTCHAS` and `validate()`, which already said "untested" |
| **MiniMax H3** `min`/`comfy` | `48`/`80` → **`null`**, plus `vramNote:'not published — MiniMax answers 未公布; the official pruned-int8 build is reported at 480p+audio on ~12 GB (unverified at source)'` | The row contradicted its own `warn`. Round 2 cleared the **deletion**; the replacement `12`/`16` is **HELD** (must-NOT-use #19, ruling #6 — 未公布 never re-fetched) |
| **SCAIL-2** `warn` | "**Prompt-inert** — masks … are the real work" → "**Prompt-SUBORDINATE** — the prompt still describes the final video, but masks … are the real work" | FOLD-IN **A18**; round-1 #2/#5 |
| **Wan2.2-Animate-2** `warn` | "zero community recipes, **3 weeks in**" → "**~5 weeks after release**" | Arithmetic from a release date already in the corpus |
| **Wan-Dancer-14B** `disk` | `'~28 GB'` → `'14B class (no size published)'` | **exclusion #8** — the figure exists on no surface (card, arXiv v2 abstract, project page all checked) |
| **Wan-Dancer-14B** `best` | "Dance/choreography video with LIVE CFG + negative prompts …; **Prompt Alignment 9.03 headline**" → "**Music-to-dance** video with LIVE **CFG 5.0** + negative prompts …; **fixed caption schema, not the Wan cinematic formula**" | **exclusion #8**; `research/wan22.md` §2026-09 sweep |
| **Wan-Dancer-14B** `warn` | "Young ecosystem, few community recipes yet." → "…; the global stage asserts `world_size == 8` (8 GPUs)." | `research/wan22.md` · `[OFFICIAL]` |
| **Illustrious / NoobAI** `lic` + `licClass` | `'varies/checkpoint'`, `licClass:'ok'` → `'varies/checkpoint — some PROHIBIT commercial use'`, **`licClass:'risk'`** | **H3** — NoobAI ships FAIPL-1.0-SD. Round 2 **#35** assumed the row already read `risk`; it read `ok`, so this was a **live false positive in the free/commercial filter**. The `lic` **string** rewrite (exact identifiers per checkpoint) was **NOT cleared** and was not made |
| **Illustrious / NoobAI** `best` | "Still king of anime — **every top Civitai anime checkpoint builds on it**" → "Dominates open anime work (community consensus — civitai.com returns an empty body to every automated check we run, so 'every top checkpoint builds on it' is **LORE, not a measurement**)" | **exclusion #33** / FOLD-IN **A39** |
| **FLUX.2 klein 9B** `warn` | "wrong encoder gives **black images**" → "a mismatch throws '**mat1 and mat2 shapes cannot be multiplied**' at the sampler, not a black image" | **exclusion #13** / **A31** |
| **Krea 2** `lic` + `warn` | `'Custom (<$1M/<50 seats)'` → `'Custom (Krea Community License — commercial use only under $1M revenue)'`; `warn` now carries the **trailing-twelve-month, company-wide, affiliates-aggregated** scope, the naming/NOTICE/provenance/content-filter obligations, the ungated `LICENSE.pdf` route, and *"No seat limit appears in the extracted text — we have not seen one, which is not the same as there being none"* | **exclusion #24** prescribed the route; must-NOT-use #12 forbids the word "refuted" and forbids "50 seats" appearing at all |
| **LongCat-Image** `min`/`comfy`/`vramNote` | `6`/`10` → **`null`**, with a `vramNote` **quoting** the card comment *"Offload to CPU to save VRAM (Required ~17 GB)"* and stating the source never says what the ~17 GB is | Cleared as a **deletion**; 16/24 was **not** asserted (round-2 #30 — the unit is unstated in the source) |
| **LongCat-Image** `disk` | `'~12 GB'` → `'~12 GB (DiT only — the text encoder and VAE are extra)'` | The audit's **one-precision-per-row** rule, called "the highest-value change in the picker audit". The unverified ~29.3 GB total was **not** written |
| **LongCat-Image** `speed` | `'fast'` → `'slow (official quick-start: 50 steps, CFG 4.0, cfg_renorm on; the 8-step build is a different checkpoint)'` | Card quick-start re-fetched 2026-09-10: `num_inference_steps=50, guidance_scale=4.0, enable_cfg_renorm=True` |
| **LongCat-Image** `warn` | "Quoted text is mandatory syntax; young ecosystem." → the card verbatim: *"Failure to use explicit quotation marks prevents this mechanism from triggering, which will severely compromise the text rendering capability"* | Card, re-fetched |
| **LongCat-Image** `lic` | **no change** — Apache 2.0 confirmed | Front-matter `license: apache-2.0` |
| `renderPicker` — `licClass:'nc'` badge | `.pk-lic.nc` now renders in `--err` | Round-2 ruling #10: `'nc'` and `'ok'` rendered identically, leaving three non-commercial rows visually indistinguishable from Apache rows |
| `renderPicker` — null-VRAM support | **new**, required by the two deletions: rows without published VRAM render `"? VRAM unpublished"` plus their `vramNote` instead of `VRAM undefined+ GB`, and **sort last** rather than reading as "comfortable" for everyone | — |
| `WF_TEMPLATES` | **no change** — all seven NO DRIFT | `template-picker-audit-2026-09-10.md`; also forbidden by the apply brief |

**Not cleared, not changed** (round 2: *"one fetch each would settle them"*): klein 9B `comfy` 16→24-32,
klein 4B `comfy` 8→12, klein 4B `min` 6→8 (it sits inside an acknowledged vendor self-contradiction of
8 / 8.4 / 13 that the gate says to ship with both numbers visible), Qwen-Edit-2511 `comfy` 16→24, Qwen
quant sizes, Z-Image Turbo `disk`, and every HF-tree byte count.

---

## Retractions & repairs

Everything in this section exists because the **round-2 verifier** audited the app's live text against the
pass-1 changelog and found it wanting. Source: `research/_addenda/verification-2026-09-10.md`
§*Applied-edit audit* (ten items audited, five clean) and §*System-prompt gate*.

### The retraction — FOLD-IN B4

Pass 1 shipped B4's **ordering** half into `TARGETS.krea2`:

> "Then follow the encoder's OWN slot order … colour → shape → size → texture → quantity → text → spatial
> relationships → objects → background. That is a better-evidenced ordering rule than any heuristic."

The same day's 36-prompt harvest falsified it against the vendor's own published prompts. Round 2 claim
**#46**, internal-contradiction ruling **#3**, must-NOT-use **#4**; the ruling is explicit that *"this is a
retraction the second apply pass must make, not merely a change it declines"*, because the changelog
already recorded B4 as APPLIED. The sentence is replaced by the harvest's finding — **checklist, not an
ordering rule, plus the fill rates** (colour 94%, spatial 94%, size 92%, texture 61%, shape 56%, quantity
53%, text 6%; actual order objects → attributes → spatial → background → composition → medium → lighting).
The nine axes survive verbatim; only *"in that order"* and the *"better-evidenced ordering rule"* claim are
retracted, and the exemplar was rewritten to stop demonstrating the retracted order.

### The seven repairs

| # | What was wrong | Fix | Verifier row |
|---|---|---|---|
| 1 | **`CAM_FIXED` did not contain 固定镜头** (`PromptStudio.html:1174`). "**DEFECT INTRODUCED BY A2.** The wan target now tells the model to emit the one locked-camera token the validator cannot see; it passes today only because the app also emits 镜头不移动." Recorded in **no** changelog | Already fixed by the validator-accuracy pass (H2); the live alternation reads `…|固定机位|固定镜头|镜头不移动|镜头位置保持不动|…`. Verified, no edit needed | Applied-edit audit **#3** — a live defect found in none of that day's files |
| 2 | **`TARGETS.scail` exemplar still ended `704p output recommended`** on a `MODE: Replacement` case, while the rule half above it was already fixed. "**INCOMPLETE — the changelog overstates it**" | Exemplar rewritten to "output dimensions divisible by 32" | **#41**; exclusion **#2** residue |
| 3 | **Krea 2 picker `lic` now wrong in the other direction** — `'Custom (Krea Community License; thresholds unverified)'` after the $1M became verified OFFICIAL | `lic` carries the $1M cap; `warn` carries the full scope and the "not found, not refuted" phrasing | Applied-edit audit **#8**; ruling #5 |
| 4 | **`TARGETS.sdxlAnime` — two defects introduced by the pass-1 apply.** `:726` an ungrammatical, self-negating Pony-negative sentence; `:734-736` a 3-rung score chain **plus an illegal negative block** whose token list matched neither family | Rewritten to "emit NO negative block at all … just omit the block"; exemplar 1 rebuilt with six rungs, one `source_*`, `rating_safe`, no negative block, assumed-family line | **#38b** (*"the highest-priority single edit in the round"*) and **#39** ("ALLOW, urgent") |
| 5 | **`wfNotes()` taught `ConditioningZeroOut` as the Krea 2 negative slot** (`:2272`), which `krea-character-art.md` calls unsafe — with any `_cfg_pp` sampler it gives a degenerate uncond and visible grain. Aggravated by core v0.35.0's new `cfgpp_ud10_ab`, whose **name does not contain the substring `cfg_pp`** | The `krea` branch split out of the `zimage`/`klein` line; it now says to connect a **real, empty `CLIPTextEncode`** and names the sampler trap | Applied-edit audit, "found while auditing, in none of today's files"; must-NOT-use **#17** |
| 6 | **Stale ComfyUI version anchor** (`:886`, "As of Sept 3 2026: core v0.34.3 … templates 0.11.48"). Date-stamped so honest, but four core and nine template releases behind | Re-anchored to **core v0.35.0 (Sept 9)** / **workflow-templates 0.11.57 (Sept 9)**, with v0.34.4/.5/.6 named and the v0.35.0 prompt-relevant items folded in | Applied-edit audit **#10**; ruling #7 — "**STALE, not wrong**" |
| 7 | **Black-output causes still listed "wrong text encoder pairing"** (`:881`) on an unstated scope — exclusion #13 retired that claim **for klein specifically** | The dual-CLIP sentence now ends "**but NOT klein, where a mismatched encoder throws a mat1/mat2 shape error instead of a black image**" | Applied-edit audit, "compliant, but load-bearing on an unstated scope" |

### The BLOCKed instructions

The gate ruled every proposed instruction **ALLOW / ADVISORY / BLOCK / NEEDS-RENDER**. Totals printed in
the file: **ALLOW 107 · ADVISORY 34 · BLOCK 13 · NEEDS-RENDER 15**, ≤+20%-compliant **5 of 12**.

> **Citation hazard:** the per-model BLOCK column sums to **11**, not the 13 the Total row prints. Cite
> "13" only as the file's own stated total. Likewise the file uses both "**seven** length-budget breaches"
> (must-NOT-use #16) and "**6 of 12**" (gate totals); `flux` is the seventh.

The eleven enumerable BLOCKs:

| Model | Instruction | Why |
|---|---|---|
| `wan` | **W4b** — "its exemplars carry 9-11" / "Chinese may run to ~10" | Claim #48. The verifier **counted** them: 9 / 11 / 7. The item's own evidence cell forbids a measured band. Must-NOT-use #8 — "the ZH twin of binding exclusion #7" |
| `wan` | the English move list giving `arc shot` with **`orbit` omitted** | Claim #49, exclusion **#6**: "exclusion #6's deleted doctrine surviving as a word list". **Repaired**, not merely declined — the live text now reads "orbit, also called an arc shot" |
| `minimaxref` | **R15** — the Ref2VA 16:9 / 9:16 restriction graded `[OFFICIAL-3P]` | Claim #44. Exclusion **#21** rules it `[LORE]` **by name**, and `[OFFICIAL-3P]` is one of 13 invented grades (process defect #65). Not added at any grade |
| `minimaxref` | the exemplar's inline meta-parenthetical | Claim **#51** — a **new defect introduced by the audit itself**; a 7B copies exemplar shape over rules. Must-NOT-use #14 |
| `scail` | (length only) **+43%** | The audit's own two cuts land at +21%, still over |
| `flux` | (citation) citing `prompting_unified_technical` as the home of BFL's native-language sentence | Round 2 **#26** read that page in full; the sentence is not on it. Exclusion **#15** |
| `qwenimg` | **Q1 as written** — ~200 words as a language-wide rule | Claim #7 — it is **Subtask 1 (Portrait) rule 7**. Ruling #1. Replaced by the sweep's three-way formulation |
| `qwenimg` | **Q6 as written** — ethnicity → gender → age as a hard order | Claim #8 — hard **only in Chinese**; the English rewriter says *"always prioritize a natural narrative over this rigid structure"*. Ruling #2. Shipped scoped |
| `krea2` | **K10 / B4** — nine slots "in that order" | See the retraction above |
| `krea2` | the **"matte facts"** string as Krea vocabulary | Claim #17 — **zero occurrences** in the 36 official prompts. Shipped as a **regrade**: kept and explicitly labelled house craft |
| `krea2` | **"Output ONLY the paragraph" as an absolute** | Harvest X6 — 15 of 36 official prompts carry a trailing style tail. Shipped permissive |

One more that is not a BLOCK but should not be forgotten: **`sdxl` X10 is NEEDS-VERIFY** — the RealVisXL
literal negative is hardcoded in the app and **neither verifier re-fetched that card**. It was left as-is,
flagged, not extended.

---

## Deliberately not applied

| Class | What | Count | Why |
|---|---|---|---|
| **FOLD-IN §G** | G1–G13, deferred items | 13 | Each is real and useful but sits at `[SPECULATION]`, `[LORE]`, or TESTED-vs-TESTED, and **each names the test that would settle it**. FOLD-IN §*Applying this*: *"Nothing in G should reach the bank until its named test has run and the results file (`research/_addenda/test-kit/results-2026-09.md`) exists."* That file does not exist — **nothing has been rendered** |
| **Structural §C** | `TARGETS.wanAnimate2` (C1), `TARGETS.wanDancer` (C2), `TARGETS.berniniR` (from C3), the `TARGETS.ltx` → `ltx23`/`ltx25` split (C4), and any new `WF_TEMPLATES`/`WF_MAP` keys | 4 + templates | Excluded by the apply brief as structural. **The textual halves were folded**: B11 carries wanAnimate2's dialect, A21 carries Wan-Dancer's, C3's KNOWLEDGE paragraph carries Bernini-R, and A7/B12 carry the LTX version split as prose. Bernini-R additionally was **not re-fetched by the round-1 verifier** (`research/INDEX.md` line 52: "confirm the tutorial, the repackage and PR #14216 before folding") and **G11** gates it |
| **Prompt instructions cut for length** | ~40 across all 12 targets, most of them **ALLOW-graded OFFICIAL**, not merely advisory | ~40 | The gate's **≤ +20%** length rule, measured against the live string. Heaviest on `qwenimg` (Q2, Q4, Q7, Q10), `sdxlAnime` (A5, A6, A7) and `minimax` (M11 + the M1–M13 remainder). `docs/CHANGELOG-2026-09-10.md` §*Cost of the cap* is blunt about it: *"Fitting inside it meant skipping ALLOW-graded OFFICIAL material, not just ADVISORY material."* The real fix — the audit's §C-9 **prefix hoist** — was not implemented because it changes the `TARGETS` shape and every model's string at once |
| **SenseNova U1.5** | as a model/picker/licence entry | 1 | The brief conditioned it on the verifier confirming the licence gate; the verifier did **not**. Claim **#24 OVERSTATED** on one leg of three — only the HF `license:apache-2.0` **tag** was read, no LICENSE file, which must-NOT-use **#13** names as "the SCAIL-2 tag-vs-text trap again". It is named **only** as a factual v0.35.0 core-support item, with **no licence claim of any kind** |
| **Other declines** | `sdxl` X7 ("text at the FRONT", must-NOT-use #11) · `zimage` Z3 (NegPiP "the only route", `[LORE]`) · `ltx` L6 (Auto Duration, needs the 09-03 K5 scope clause) · `sdxlAnime` A8 (Illustrious control-token **values**, needs a visible "community reprint" label) · the digest's "local:partner ratio 6:8" (must-NOT-use #20 — counting convention unstated; every-bullet counting gives 6:9) · the Illustrious/NoobAI `lic` **string** rewrite (not cleared) · FOLD-IN D9's CLIP-skip node and D4's template split (would edit `WF_TEMPLATES`; carried as `wfNotes` instructions instead) | — | each as noted |

**The unblocker for most of this is the test kit.** `research/_addenda/test-kit-2026-09.md` + `test-kit/`
ship seven fixed-seed protocols and 50 workflow JSONs derived from verified templates at documented edit
points, with a shared scoring rubric and a ≈2.5–3 h running order for a single 24 GB card. Running T1–T7
would clear most of §G. **Fix test-kit defects #67 and #68 first** (FOLD-IN §*Applying this*): #67 — the
shipped v-pred arm has no `ModelSamplingDiscrete` (v_prediction) node and no CFG-Rescale node, so as built
it compares samplers on a v-pred checkpoint without the plumbing `sdxl.md` itself mandates; #68 — the
Z-Image "negative = positive" arm mathematically cancels guidance (`pred = pos + 4·(pos − pos) = pos`), so
it measures whether the uncond branch is computed at all, not whether the negative does anything.

---

## Evidence-trail conventions

### The grades

`CONTRIBUTING.md`: *"Everything is evidence-graded. The app's knowledge comes from `research/`, where every
claim carries a grade (`[OFFICIAL]` / `[STAFF]` / `[TESTED]` / `[LORE]`) and a source URL."* In practice
the corpus also uses `[CREATOR]` (a named checkpoint author), `[SPECULATION]`, `[SYNTHESIS]` (ours, not a
source's), and `[OFFICIAL-PATTERN]` (attested in official examples but never stated as a rule).

**`[OFFICIAL-3P]` is not a grade.** Round 1 process defect **#65** calls it the worst of 13 invented
labels; exclusion #21 rules the claim that wore it `[LORE]`.

### Verifier verdicts

Round 1 (`verification-2026-09.md`) grades each re-fetched claim **CONFIRMED · OVERSTATED** ("real but
claimed beyond the evidence") **· UNSUPPORTED** ("no evidence found at the cited source") **· STALE ·
MISLABELLED** ("wrong evidence grade") **· UNREACHABLE · NOT RE-FETCHED** ("sampled but out of budget —
recorded so nobody assumes it was checked"). 61 claims: **38 CONFIRMED, 8 OVERSTATED, 6 UNSUPPORTED,
2 MISLABELLED, 1 STALE, 4 NOT RE-FETCHED**, plus 11 internal contradictions ruled and 14 process defects.

Round 2 (`verification-2026-09-10.md`) reuses that vocabulary (widening MISLABELLED to "wrong evidence
grade **or wrong scope label**") and adds the system-prompt gate's **ALLOW / ADVISORY / BLOCK /
NEEDS-RENDER**. 53 rows: **26 CONFIRMED, 9 OVERSTATED, 4 UNSUPPORTED/FALSIFIED, 2 MISLABELLED, 1 STALE,
11 NOT RE-FETCHED**. Row **38b** is numbered separately; there is no plain row 38.

### Tracing a diff hunk back to its reason

The chain, as `docs/diffs/2026-09/README.md` states it:

```
docs/diffs/2026-09/<section>.diff        the change
  → docs/MERGE-NOTES-2026-09.md          this file — the narrative
    → docs/CHANGELOG-2026-09-10.md       the per-item outcome (ALREADY / APPLIED / SKIPPED / BLOCKED)
      → docs/FOLD-IN-2026-09.md §<id>    proposed text + research file + grade + risk note
        → research/…                     the source, with URL and access date
          → research/_addenda/verification-2026-09*.md   the independent re-fetch verdict
```

Worked example. The `wan` target no longer bans "orbit":
`TARGETS.wan.diff` shows the word list change → this document, §`wan`, row 4 → `CHANGELOG-2026-09-10.md`
state table **A1/A2 ALREADY**, **A3 APPLIED** → `FOLD-IN-2026-09.md` §A1 (line 26) with the current text
verbatim and the proposed replacement → `research/wan22.md` §2026-09 sweep → `verification-2026-09.md`
claim **#6** / **exclusion #6** ("No first-party source on any surface across two sweeps … do not
downgrade-and-keep the number") → and, because the *replacement* word list then omitted `orbit`,
`verification-2026-09-10.md` claim **#49 BLOCK**, repaired to "orbit, also called an arc shot".

### `[LORE]` and `[SYNTHESIS]` were kept out of hard rules

This is a deliberate policy of the pass, not an accident. Examples you can check:

- The Qwen Lightning seed-variance collapse ships in `KNOWLEDGE` as *"LORE, n≈3, no grids published"* and
  was **explicitly not made a validator rule** (round-2 claim #11).
- The Illustrious quality prefix ships as `[LORE]` and its validator rule was downgraded from blocking to
  `advisory:` (accuracy item **A2**).
- The Krea "matte facts" vocabulary is retained but labelled `[SYNTHESIS]`/house craft, and the validator
  rules around Krea length, medium-first and background lock were all downgraded to `advisory:`
  (**K1/K2/K3**) once the harvest showed the vendor's own prompts violate them.
- The Civitai anime claim ships as LORE in both `KNOWLEDGE` and the picker `best` string.

Where evidence is weak, this document says so rather than smoothing it — see §Open follow-ups.

---

## Verification performed

Everything in this section was **re-run against the working tree on 2026-09-11** while writing this
document, except where marked *(session record)* — meaning it was performed during the work but is not
reproducible from a file in the repo.

**1 — Syntax.** Both `<script>` blocks compiled with `new Function`:

```
script 0 OK
script 1 OK
```

**2 — Structural anchors**, each present exactly once: `const TARGETS`, `const KNOWLEDGE`,
`const GOTCHAS`, `function validate(`, `const WF_TEMPLATES`, `function buildWorkflow(`, `const SDXL_NEG`,
`function wfNotes(`.

**3 — Out-of-process smoke** (loaded through the harness's own DOM-stub sandbox,
`research/_addenda/validator-harness/extract.mjs`):

```
TARGETS: 12 | wan wanI2V ltx minimax minimaxref scail sdxl sdxlAnime flux zimage qwenimg krea2
KNOWLEDGE chars: 67,995 | GOTCHAS cards: 46 | MODELSPEC rows: 21
validate() returned an array for 12/12 keys; threw on 0
WF_TEMPLATES: 7 | WF_MAP: 9 — wan wanI2V ltx sdxl sdxlAnime zimage qwenimg flux krea2
buildWorkflow: 9/9 built, 0 failures
wfNotes: ran for all 9
```

*(session record)* A jsdom boot with a mocked Ollama `/api/tags` reaching "offline & ready", and a jsdom
exercise of the Meta Inspector `postMessage` bridge (ready handshake → queue drain → `psmeta-prompt` chip
selection → `psmeta-loras` → `wfPrefill`). These are the `CONTRIBUTING.md` §*Before you open a PR* recipe;
they are not captured in a results file.

**4 — Validator harness.** `node research/_addenda/validator-harness/run.mjs` on Node v22.23.2:

```
Fixtures: 142 across 12 model keys. validate() threw on 0.
Message-prefix census: HARD: 64 · advisory: 50 · no prefix 0
…
| total | 142 | 142 | 0 | 0 | 0 | 100% |
## Failures (0)
```

**5 — Network-target audit.** `PromptStudio.html`: 3 × `http://`, 75 × `https://`. Distinct hosts:
`http://127.0.0.1:8188`, `http://localhost:11434`, `https://docs.comfy.org`, `https://github.com`,
`https://huggingface.co`, `https://modelscope.cn`, `https://ollama.com`. **Only the two loopback hosts are
runtime targets** — every request in the file is either `OLLAMA + '/api/…'` (lines 1022, 1064, 1159, 1740,
1777, 1810) or `fetch('http://127.0.0.1:8188/object_info')` (line 2285). The 75 `https://` occurrences are
documentation and model-download links rendered as text or `href`s and never fetched. No
`XMLHttpRequest`, no `WebSocket`. `tools/MetaInspector.html`: **zero** on every one of `http://`,
`https://`, `fetch(`, `XMLHttpRequest`, `WebSocket`, `import(`, `<script src`, `<link rel`.

**6 — Encoding.** `PromptStudio.html` and `tools/MetaInspector.html` are both **valid UTF-8, no BOM, zero
control bytes** outside tab/LF/CR.

**7 — Checksums.** `docs/SHA256SUMS.txt` covers 11 files and now includes `tools/MetaInspector.html`.
Against the working tree: `PromptStudio.html` **OK**, `tools/MetaInspector.html` **OK** — these two are LF
on disk. The other **nine** entries do **not** match a raw hash, because those files are **CRLF** on disk
while the sums file is LF-normalized. Their **LF-normalized** hashes match exactly (spot-checked on
`!START HERE.bat`, `tools/H3Builder.html`, `start-promptstudio.sh` — all three match to the byte). So the
file is internally consistent with its own stated convention, **but `README.md` line 109 tells the user to
run `certutil -hashfile` / `shasum -a 256` on the raw file**, which will report a mismatch on those nine.
See §Open follow-ups.

**8 — Template drift.** All seven `WF_TEMPLATES` verified **NO DRIFT** by
`research/_addenda/template-picker-audit-2026-09-10.md` (two-to-three independent reads per template) and
untouched by this branch — `docs/diffs/2026-09/buildWorkflow.diff` and `MODEL_CATALOG.diff` and
`EXAMPLES.diff` are all empty, as `docs/diffs/2026-09/README.md` predicts. Round 2 records this as
**NOT RE-FETCHED by the verifier** (claim #53) — the method is sound but nobody re-downloaded the
upstream templates.

---

## Merge & commit guidance

### The CRLF/LF problem — read this first

`git status` reports **58 files modified**, but most carry **no content change**: this sandbox sees CRLF/LF
mismatch on every file that is CRLF in the Windows working tree. That is why nothing was committed, and
why `docs/diffs/2026-09/` exists at all (`README.md` there: *"the Windows working tree is CRLF, so a raw
`git diff` shows every line — use these instead"*).

Before committing anything:

```bash
git diff --ignore-all-space --stat          # the real change set
git config core.autocrlf                    # decide the repo's policy, once
```

`PromptStudio.html`, `tools/MetaInspector.html`, `docs/SHA256SUMS.txt`, `docs/CHANGELOG-2026-09-10.md`,
`docs/FOLD-IN-2026-09.md` and the diffs are **LF**; `README.md`, the `.bat` launchers and the older tools
are **CRLF**. A `.gitattributes` with `* text=auto` (and `*.bat text eol=crlf`) would end this permanently
and is worth doing as its own commit **before** the ones below, so the feature commits stay readable.

### Suggested commit split

Six commits, in this order. `CONTRIBUTING.md` states no commit-message convention beyond the Apache 2.0
§4(b) modified-files notice; the repo's own log uses Conventional Commits (`feat:`, `research:`), so these
follow that.

```
1. chore: normalize line endings (.gitattributes) + renormalize
   — no content change; verify with `git diff --ignore-all-space` showing nothing

2. feat: Meta Inspector — read the recipe out of any ComfyUI output
   tools/MetaInspector.html (new) · PromptStudio.html (panel, drop veil, postMessage bridge,
   wfPrefill) · README.md · research/_addenda/comfyui-metadata.md
   Body: the two use cases, zero-network constraint, the e.source check, and the
   known limitation that metadata dies on re-encode.

3. research: 2026-09-03 sweep — 12 agents, verification, FOLD-IN proposal
   docs/RESEARCH-PLAN-2026-09.md · docs/FOLD-IN-2026-09.md ·
   research/{flux,ltx23,minimax-h3,scail2,sdxl,wan22,z-image,new-models}.md (## 2026-09 sweep) ·
   research/_addenda/{verification-2026-09,staff-claims-2026-09,comfyui-ops-2026-09,test-kit-2026-09}.md ·
   research/_addenda/test-kit/ · research/digests/2026-09-03-digest.md · research/INDEX.md

4. research: 2026-09-10 audits + round-2 verification
   research/_addenda/{system-prompt-audit,template-picker-audit,krea-character-art,
   verification}-2026-09-10.md · research/qwen-image.md (09-10 sweep) ·
   research/digests/2026-09-10-digest.md

5. fix(validate): 79% → 100% on 142 fixtures; declare the severity contract
   PromptStudio.html (validate() + helpers) ·
   research/_addenda/validator-accuracy-2026-09-10.md · research/_addenda/validator-harness/
   Body: 25 rules changed, 21 false-hards eliminated, HARD:/advisory: prefixes made
   consistent, no fixture edited and no rule loosened.

6. feat(knowledge): apply FOLD-IN 2026-09 §A/B/D/E/H + verifier-gated second pass
   PromptStudio.html (TARGETS ×12, KNOWLEDGE, GOTCHAS, MODELSPEC, wfNotes) ·
   docs/CHANGELOG-2026-09-10.md · docs/diffs/2026-09/
   Body: 63 + 17 items in pass 1; 58 gated instructions, 12 picker rows, 7 repairs and
   1 retraction (FOLD-IN B4) in pass 2. §G and structural §C not applied.

7. docs: merge notes + repo CHANGELOG
   docs/MERGE-NOTES-2026-09.md · CHANGELOG.md
```

Commits 5 and 6 both touch `PromptStudio.html`, so they cannot be split by file — split them by hunk
(`git add -p`) using `docs/diffs/2026-09/validate.diff` as the boundary, or merge them into one
`feat(knowledge)` commit if that is too fiddly. **Do not** split 2 from 6: the Meta Inspector hunks and the
knowledge hunks are in disjoint regions of the file (CSS 186–195, markup 289/393–400, JS 2344–2370 and
2508–2599 versus `TARGETS`/`KNOWLEDGE`/`validate` above them), so `git add -p` separates them cleanly.

### After any further edit

Non-negotiable, in this order:

```bash
node -e "…new Function per <script>…"                    # must print: script 0 OK / script 1 OK
node research/_addenda/validator-harness/run.mjs         # must print 142/142 and "## Failures (0)"
# then regenerate the sums, LF-normalized, same convention as today:
```

`docs/SHA256SUMS.txt` must be regenerated on release (`README.md` line 109: *"Checksums are regenerated on
every release commit"*). Keep the LF normalization — changing it now would invalidate the two entries that
currently verify raw.

---

## Open follow-ups

### From `docs/CHANGELOG-2026-09-10.md` §Outstanding

1. **The §C-9 prefix hoist.** Hoisting the shared TIMING-WORDS, weighting and negative-guidance blocks out
   of all twelve `TARGETS` strings into a common prefix. It is the real fix for the length pressure — it
   would free 300–600 characters per video target and let the ~40 skipped ALLOW-graded OFFICIAL
   instructions land without a length exception. The changelog calls it *"the correct next move"*; it was
   out of scope because it changes the `TARGETS` shape and every model's string at once.
2. **One fetch each would settle:** the RealVisXL card (`sdxl` **X10** — hardcoded in the app, unverified
   by either verifier), `Comfy-Org/Krea-2/LICENSE.pdf` §2.3 text, klein 9B/4B and Qwen-Edit-2511 `comfy`
   figures, the Illustrious v2.0 front-matter, `docs.comfy.org/tutorials/image/qwen/qwen-image-2512`, and
   **SenseNova U1.5's LICENSE file** (the tag-vs-text trap).
3. **NEEDS-RENDER, shipped untested:** the `sdxlAnime` **NoobAI exemplar** and the `scail` ~105-word
   `PROMPT:` exemplar. Both use OFFICIAL vocabulary; neither has been generated from.
4. **`wanI2V` still has no Chinese exemplar** (I9), on a branch whose length unit differs by ~3×. The gate
   calls it the highest-value item in that target.

### NEEDS-RENDER, round 2 — the full list (15)

`wan` W11 (ZH exemplar rewrite — **shipped**) · `wanI2V` I9 (ZH exemplar — not shipped) · `ltx` L14
(two-shot cut exemplar) · `minimax` M16, M17 · `minimaxref` R13 · `scail` S15 (**shipped**) · `sdxl` (the
target's exemplar work; X10 is separately NEEDS-**VERIFY**) · `sdxlAnime` A10 (**shipped**) · `flux` F13
(text-in-image exemplar) · `zimage` Z9 (English multi-subject Base exemplar) · `qwenimg` Q15, Q16
(**shipped**), Q17 · `krea2` K11.

### NOT RE-FETCHED — recorded so nobody assumes they were checked

Round 1: 4 rows, including **#29 `flux2_overview`** (which H7's klein licence split rests on). Round 2:
**11 rows**, including the seven picker figures above and **claim #53** (`WF_TEMPLATES` NO DRIFT — method
sound, not independently re-downloaded). Round 1 **ruling #6**: MiniMax's 未公布 VRAM answer has never been
re-fetched across two rounds, which is why the picker row is `null` rather than 12/16.

### The three weakest pieces of evidence in this branch

Stated plainly, because §Evidence-trail conventions promises it:

1. **`sdxl` X10 — the RealVisXL negative prompt the app hardcodes and instructs the model to emit
   *exactly*.** Neither verifier re-fetched the card. Round 2 marks it NEEDS-VERIFY-before-ship; it shipped
   anyway, unchanged from before this branch. It is the only place the app emits a literal vendor string
   nobody re-checked this cycle.
2. **Qwen-Image's Lightning seed-variance line** — `KNOWLEDGE`: *"seed variance is reported to collapse
   (LORE, n≈3, no grids published)"*. It is honestly labelled and deliberately excluded from the
   validator, but n≈3 with no published grids is the thinnest claim added anywhere in this merge.
3. **`minimax` M3 (`Roll Clockwise/Counterclockwise`)** — it rests on `research/minimax-h3.md` item 8's
   transcription of a MiniMax "base guide" **no verifier has fetched** (round-2 claim #43, "the largest
   single-source dependency in the audit"). It was taken only because it corrects a token already in the
   app; M1/M2/M4/M5/M8/M13 from the same source were deliberately left out. If item 8 is wrong, this is
   the one instruction that inherits the error.

Honourable mentions, for the same reason: **SCAIL-2's "divisible by 32, not 16"** contradicts the official
ComfyUI tutorial on `[TESTED]` evidence alone (the finding is well-described — circular padding, the
bottom ~8–16 px echoes the top — but it is one person's test against a vendor doc); and **Bernini-R's
entire `KNOWLEDGE` paragraph** was never re-fetched by the round-1 verifier
(`research/INDEX.md` line 52: *"confirm the tutorial, the repackage and PR #14216 before folding"*).

### Consistency defects worth one small follow-up commit

- **The Qwen magic-suffix GOTCHAS card was not updated with its KNOWLEDGE twin.** `KNOWLEDGE` now says
  *"DROPPED FOR 2512, still appended by base Qwen-Image — not 'officially retired', not 'dead code' in
  general"*, while the `GOTCHAS` card still reads *"Officially retired — it's dead code in the current
  rewriter."* This is the one substantive internal inconsistency this merge introduces. Must-NOT-use #3
  covers the claim; the card needs the same scoping.
- **`if (!t) return ['empty output'];`** is the one `validate()` message with no severity prefix, against
  §G's claim of "no prefix 0".
- **`README.md` line 109 vs `docs/SHA256SUMS.txt`.** The checksum instructions will report a mismatch on
  the nine CRLF files. Either ship raw hashes, or say in the README that the sums are LF-normalized and
  give a normalizing command.
- **`run.mjs` sets `process.exitCode = 0` unconditionally** and documents a `--md` flag it does not parse.
  The harness can never fail CI as written.

### Hunks nobody has mapped to an item id

These are in the tree and are defensible on their face, but no FOLD-IN id or changelog row names them.
Worth a reviewer's eye before merge:

- `KNOWLEDGE`'s Qwen-Image `prompt_utils_2512.py` block (length scoping, ZH/EN order asymmetry, the three
  sentinels, the three-way magic-suffix statement) — substantial OFFICIAL additions with no A/B/C/E/H id;
  they come from the 09-10 sweep via `CHANGELOG-2026-09-10.md` §E, which is the right provenance but is
  not an item id.
- The Krea 2 36-prompt regrade (K6/K7 above) — A29 covers licence/enhancer/parameter count, nothing covers
  a corpus-wide regrade.
- SCAIL-2's ÷32 finding, the 6-identity hard cap and "routing is POSITION-first, not colour-first" — new
  hard claims outside A18–A20.
- Wan's TI2V-5B empty-prompt note and "Wan-Animate-2-Lite has NO open weights" — outside A21–A23 / B11.
- Krea 2's "ComfyUI strips the SYSTEM turn before the DiT" — adjacent to B4 but not the same claim.
- The `== VIDEO MODELS ==` section marker moved position in `KNOWLEDGE` with no item behind it (the
  `== IMAGE MODELS ==` move is a side-effect of inserting Bernini-R). Cosmetic, but check the rendered bank.
- In `validate.diff`: the `sdxl` Juggernaut/Ragnarok exception and the `sdxlAnime` per-family
  negative-required rule are both **validator-side** implementations of items (D9, D3) whose declared
  targets were `TARGETS`/`SDXL_NEG`, not `validate()`. And five rules emit `HARD:` where the item that
  licenses them says "warn" (D8 `{a|b}`, D8 length guard, D3 Pony 12-token negative, D10's two tiers) —
  against the accuracy file §8 rule. None is dangerous; all five are worth a deliberate decision rather
  than an accident.
