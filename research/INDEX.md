# Prompt Studio Expert Edition research index

Research date: 2026-08-15. All external sources were checked on this date. Evidence labels: `[OFFICIAL]`, `[STAFF]`, `[TESTED]`, `[LORE]`, `[SPECULATION]`; synthesized examples are marked `[SYNTHESIS]`.

## Completion checklist

| Model | Official guidance | Rewriter | Chinese | Motion / composition | Verbosity | Negatives/settings | ≥4 pairs | Mistakes + validators | Biggest finding |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| [Wan 2.2](wan22.md) | ✅ | ✅ canonical symbols + digest | ✅ | ✅ | ✅ | ✅ | ✅ 4 | ✅ | T2V wants a richer 60–200-character cinematic expansion, but I2V officially wants ≤100 words of motion-only content. |
| [LTX 2.3](ltx23.md) | ✅ | ✅ canonical source + digest | ✅ | ✅ | ✅ | ⚠️ no reliable universal negative list | ✅ 4 | ✅ | Official enhancer is action-first, chronological, literal, one paragraph, ≤150 words, and audio must be prompted explicitly. |
| [MiniMax H3](minimax-h3.md) | ✅ | ✅ canonical base/ref guides + digest | ✅ | ✅ | ✅ | ⚠️ no universal negative list | ✅ 4 | ✅ | H3 is a strict audiovisual schema, not generic prose; Ref2VA normally needs 350–500 words and explicit retention roles. |
| [SCAIL-2](scail2.md) | ✅ | ✅ canonical source + digest | ✅ | ✅ | ✅ | ⚠️ no negative input documented | ✅ 4 | ✅ | Prompt describes the final video; mask and drive dominate motion, and replacement enhancer targets 90–140 English words. |
| [SDXL families](sdxl.md) | ✅ | ⚠️ none public found | ✅ | ✅ | ✅ | ✅ | ✅ 5 | ✅ | Dialect must branch by fine-tune: photoreal natural prose, Pony score/source tags, and Illustrious Danbooru tags are not interchangeable. |
| [FLUX](flux.md) | ✅ | ⚠️ internal upsampler prompt not public | ✅ | ✅ | ✅ | ✅ | ✅ 4 | ✅ | FLUX.2 front-loads subject/action, usually prefers 30–80 words, and officially does not support negative prompts. |
| [Z-Image](z-image.md) | ✅ | ✅ canonical archive pointer; body unavailable | ✅ | ✅ | ✅ | ✅ | ✅ 4 | ✅ | Turbo is CFG-free/no-negative, Base uses CFG/negatives, and official Edit/Omni-Base checkpoints remain unreleased. |
| [Qwen-Image](qwen-image.md) | ✅ | ✅ canonical 2512 source + digest | ✅ | ✅ | ✅ | ✅ | ✅ 5 | ✅ | The official rewriter classifies portrait/text/general and aims for concise ~200-word relational prose; visible text is exact and never translated. |

Legend: ✅ addressed; ⚠️ explicitly “nothing reliable/public found” or canonical body unavailable.

## Required heading/pair audit

Every model file uses, in order:

1. `## Official guidance`
2. `## Rewriter system prompts (verbatim)`
3. `## Chinese prompting`
4. `## Motion / composition control`
5. `## Verbosity calibration`
6. `## Negatives & guidance`
7. `## Few-shot gold`
8. `## Expert mistakes`
9. `## Validator suggestions`
10. `## Sources`

Every gold pair uses `INTENT`, `PROMPT-EN`, optional `PROMPT-ZH`, and `NOTES`. Chinese coverage is present for Wan, Qwen-Image, Z-Image, H3 and SCAIL-2.

## Cross-cutting files

- [_cross/chinese-prompting.md](_cross/chinese-prompting.md) — language-routing table, mixed-language policy, native vocabulary, negatives and translation traps.
- [_cross/motion-quality.md](_cross/motion-quality.md) — motion failure taxonomy and prompt-vs-input/settings triage.
- [_cross/verbosity.md](_cross/verbosity.md) — evidence-ranked length table, load-bearing hierarchy and small-rewriter anti-padding rules.
- [_cross/rewriter-technique.md](_cross/rewriter-technique.md) — common official rewriter patterns and a 7B-friendly classify-then-write design.
- [_cross/settings-context.md](_cross/settings-context.md) — only settings that change prompt strategy.
- [new-models.md](new-models.md) — LTX-2.5 is the clear new local target; Qwen-Image 2.0 is a tracked but unverified-local successor; unverified local models are excluded.

## Source-reproduction note

The plan asked for complete third-party rewriter system prompts verbatim. This research captures the exact canonical file URLs, symbol names, structural rules, short identifying excerpts, version context, and access dates. Full prompt bodies are not republished here; downstream ingestion should retrieve the canonical source files at build time and preserve their licenses. This affects Wan, LTX, H3, SCAIL, Qwen and the archived Z-Image PE body; it does not affect the derived rules or examples.

## High-priority application changes suggested

0. **(2026-09-03) Add three new dialects as targets: `wanAnimate2`, `wanDancer`, and **Bernini-R**.** The first two are `[OFFICIAL]` and cheap — `wanAnimate2` is a two-field Chinese reference caption (`人物外观描述：` / `背景描述：`) that forbids action, emotion, camera and style words, and `wanDancer` is a five-genre slot schema (`一个人正在跳舞，舞蹈种类是{…}` plus three graded amplitude/clarity tags). **Bernini-R** (ByteDance, Apache 2.0, ComfyUI **core** nodes, official Comfy-Org repackage, official tutorial, two official templates) speaks Wan 2.2's cinematic-axis prose for generation, addresses reference images positionally as `image0`, `image1`, …, and inverts our brevity guidance for editing — its official `rv2v` example spends over half its words enumerating what must *not* change. Bernini-R appears in no earlier file in this corpus. See [`docs/FOLD-IN-2026-09.md`](../docs/FOLD-IN-2026-09.md) §C. ⚠ The Bernini-R section was **not re-fetched** by the verifier — confirm the tutorial, the repackage and PR #14216 before folding.
1. Route by control tier before rewriting: prompt-only for broad intent, structural input for exact pose/layout/path, and shot splitting for complex temporal sequences.
2. Route by variant; especially Wan T2V vs I2V, H3 base vs Ref2VA, Z Turbo vs Base, and SDXL checkpoint family.
3. Make motion validation distinguish subject motion from camera motion and detect fixed-camera contradictions.
4. Protect exact quoted text/dialogue byte-for-byte.
5. Replace one global verbosity target with the evidence-backed bands above.
6. Treat SCAIL drive/mask validation as higher priority than prompt rewriting.
7. Do not generate negative prompts for FLUX.2 or Z-Image-Turbo.
8. Do not expose Z-Image-Edit or Omni-Base as official local checkpoints; the official model zoo still marks both “To be released” as of 2026-08-15.

## Honest research-quality assessment

This corpus is strong enough to implement a materially better model-aware rewriter and validator. It is not, by itself, strong enough to claim that Prompt Studio will reliably produce the user's intended pose, position or motion.

What is strong:

- Broad primary-source coverage of official dialects, variant differences, prompt lengths, camera vocabulary, negative/guidance behavior and rewriter architecture.
- Clear separation between prompt-fixable failures and failures that require masks, references, drives, ControlNet/LoRAs, settings changes or shot splitting.
- Programmatically usable validator suggestions and model-native few-shot formatting.

What remains weak or unproven:

- Most few-shot gold prompts are `[SYNTHESIS]`: they follow official rules but were not rendered against every local checkpoint in this research-only session.
- Direct controlled community evidence is sparse. Issue reports identify real failure modes but do not estimate success rates.
- Chinese-versus-English superiority is well supported for exact Chinese text and native cultural vocabulary, but not by broad fixed-seed A/B tests for pose or motion.
- Online/API results may use hidden rewriters or different checkpoints and must not be assumed to reproduce locally.

Comparison verdict [SYNTHESIS]: this is a competitive research foundation because it is source-marked, version-aware, and honest about control limits. A rival report that only supplies polished prompting advice is not necessarily more useful. A rival report with fixed-seed local renders, per-constraint scoring and failure rates would be stronger. The acceptance protocol in [`_cross/motion-quality.md`](_cross/motion-quality.md) is the required next stage before making accuracy claims.

---

## 2026-09-03 update

Eleven agents under [`docs/RESEARCH-PLAN-2026-09.md`](../docs/RESEARCH-PLAN-2026-09.md): six Wave-1 gap-fill sweeps, four Wave-2 cross-cutting agents, and one Wave-3 adversarial verifier. Digest: [`digests/2026-09-03-digest.md`](digests/2026-09-03-digest.md). Fold-in proposal: [`../docs/FOLD-IN-2026-09.md`](../docs/FOLD-IN-2026-09.md). Verification (**binding**): [`_addenda/verification-2026-09.md`](_addenda/verification-2026-09.md). The completion table above is **not** rewritten — every sweep appended a dated `## 2026-09 sweep` section to its file rather than editing prior content.

### Biggest change per model

| Model | Biggest change (2026-09-03) | Sweep section |
|---|---|---|
| **Wan 2.2** | The rewriter constants are in `wan/utils/system_prompt.py`, not `prompt_extend.py`, and the ZH transcription is now confirmed character-for-character — so cn-sweep §4.2 is promoted to `[OFFICIAL]`. The EN rewriter caps aesthetic tokens at `不超过4种` while the ZH one has no cap, `tar_lang="zh"` is the default (so `--use_prompt_extend` rewrites English into Chinese), and the official locked-camera token is **`固定镜头`**, not `固定机位`. **The "orbit ≤45°" rule has no first-party source and the guide's only orbit example is a successful ~180° orbit.** Wan-Dancer and Wan2.2-Animate-2 both gained full first-party dialects. | [`wan22.md` §2026-09 sweep (agent 1F)](wan22.md) |
| **LTX 2.3 / 2.5** | **The shipped official ComfyUI T2V template runs `prompt_enhance = true`, while Comfy Org's own tutorial says it is off** — the run's single most consequential teaching correction. The ≤150-word cap descends from the retired LTXV-0.9 enhancer and current guidance is "4–8 descriptive sentences"; three official negatives exist and disagree; the official VRAM minimum is 32 GB+, not 12; Auto Duration is absent from the ComfyUI template; pose moved into Union Control. | [`ltx23.md` §2026-09 sweep (agent 1D)](ltx23.md) |
| **MiniMax H3** | The ComfyUI source is now the best primary source on the local dialect: the 15.08 s ceiling, the `17k+5` grid, arrival-order reference numbering and gap-closing all move from `[LORE]` to `[OFFICIAL]`. **Local reference caps are 9/3/3/3 with no total cap — the "12 files max" is a hosted rule.** `(word:1.2)` is architecturally inert, `embedding:` works, over-long segments raise a hard error, and two new local capabilities (`MiniMaxH3AddGuide`, per-token latent noise masks) arrived. Licence quoted verbatim, including the output-territory clause. | [`minimax-h3.md` §2026-09 sweep (agent 1E)](minimax-h3.md) |
| **SCAIL-2** | Two sweeps of "zero hits" were a search artifact. Everything is documented: both enhancer system prompts verbatim, the trained-in mask palette and its in-code comment, both mask polarities, the 81/5 arithmetic three ways, and a hard 512 UMT5 token cap. **The verdict changes from "prompt-inert" to "prompt-subordinate"**, the 90–140-word band applies to both modes, and the enhancer turns out to be a **Gemini cloud call**. | [`scail2.md` §2026-09 sweep (agent 1A)](scail2.md) |
| **SDXL families** | Primary recipes recovered for **every** family in the brief — Juggernaut XI / XIII Ragnarok, RealVisXL V5.0, Pony V6 and V7, Illustrious v2.0 / v3.0-eps / v3.0-vpred / v3.5-vpred, NoobAI eps and v-pred, Animagine 4.0 — with verbatim card blocks and a per-family validator rule set. The NoobAI card is **stricter than a Karras ban** (Euler only, plus zsnr and CFG-Rescale ≈0.2). **No Onoma card states any Illustrious quality prefix**, and Pony V6's card endorses natural language. New: the six Illustrious **control-token** axes. | [`sdxl.md` §2026-09 sweep (agent 1B)](sdxl.md) |
| **FLUX** | BFL restructured its guide into a **unified** set with a slot template, bands 10-30 / 30-80 / **80-300+**, a 32K-token capacity claim and a **softened** negative-prompt line with a replacement table. The encoder mismatch is confirmed at code level and **does not produce black images** — it throws `mat1 and mat2 shapes cannot be multiplied`. klein's multi-reference cap is **4**; klein **9B KV** is new to the corpus. arXiv 2606.03715 tested **FLUX.2 Klein-4B** directly, and its figures are narrower than the 08-28 digest implied. | [`flux.md` §2026-09 sweep (agent 1C)](flux.md) |
| **Z-Image** | Model-zoo table verbatim: Omni-Base and Edit are still *"To be released"* in **both** columns — and the repo README **contradicts itself** by showcasing Edit three sections below. `[STAFF]` supply the exact token remedy (`max_sequence_length=1024`, ≈0.75 words/token), the encoder lock ("works exclusively with qwen3-4b") and the steps/time-shift coupling. `cfg_normalization` is a **CFG-burn limiter** (a norm clamp used as a float), and `cfg_truncation` was missing entirely. **`ZImagePipeline` does accept a string negative** — correcting the 08-28 digest. | [`z-image.md` §2026-09 sweep (agent 1C)](z-image.md) |
| **Krea 2** | `encoder.py` settles two contested items at once: a baked-in **nine-slot system descriptor** that is the real dialect specification, and `max_length = 512` — a hard ceiling of **512 conditioning positions**, so the app's "no cap exists anywhere in the source" is the opposite of the source. Weights are **literal text**, not destructive. A reference image costs `(h/32)·(w/32)+2` tokens against the same budget. The nine LoRA triggers are confirmed (as `[OFFICIAL — ComfyUI docs]`, not `[OFFICIAL — Krea]`), and the enhancer's documented risk is an **ethics refusal**, not diversity. | [`_addenda/krea-character-art.md` §2026-09 sweep (agent 1C)](_addenda/krea-character-art.md) |
| **Qwen-Image** | Not swept this run. One correction from elsewhere: **`magic_prompt` dead code belongs to Qwen-Image**, not Wan — the 08-28 digest bundled the two findings. Qwen's official texture list is also the only sourced texture vocabulary usable in Wan prose, with attribution. | [`wan22.md` §2026-09 sweep](wan22.md) (the split) |
| **New models** | **Nothing cleared the local gate in the 08-28 → 09-03 window**, confirmed on three surfaces. The find sits outside the window: **ByteDance Bernini-R**. Also: the HF `?author=` and `?pipeline_tag=` indices are **stale** and silently manufacture false "nothing new" — always add a `search=` term. | [`new-models.md` §2026-09 register (agent 2D)](new-models.md) |

### New `_addenda` files

- [`_addenda/verification-2026-09.md`](_addenda/verification-2026-09.md) — **binding.** Agent 3A's adversarial verification of 61 stratified claims re-fetched at source: 38 CONFIRMED, 8 OVERSTATED, 6 UNSUPPORTED, 2 MISLABELLED, 1 STALE, 4 NOT RE-FETCHED, plus a sweep-wide tooling claim refuted, 11 internal contradictions ruled, a 50-row live audit of the app's `KNOWLEDGE`, a 22-row audit of `GOTCHAS`, a `TARGETS`/validator audit, 14 process defects, and a 34-item "must NOT fold in" list.
- [`_addenda/staff-claims-2026-09.md`](_addenda/staff-claims-2026-09.md) — agent 2A's `[STAFF]`/`[CREATOR]` harvest: 12 rows with role evidence (HF org badge, profile `Organizations`, or a CivArchive `Author` label), covering Z-Image, LTX-2.5, Juggernaut, RealVisXL, NoobAI and Krea 2 — plus two substantive items deliberately **not** graded `[STAFF]`, and a per-repo nothing-found table. Introduces the HF `/activity/community` technique.
- [`_addenda/test-kit-2026-09.md`](_addenda/test-kit-2026-09.md) + [`_addenda/test-kit/`](_addenda/test-kit/) — agent 2B's seven fixed-seed protocols (T1 order-vs-prose-vs-labels · T2 negative inertness · T3 ZH vs EN · T4 Wan's four-token cap · T5 Wan camera vocabulary · T6 Krea 2's length cliff · T7 SDXL family recipes) with 50 workflow JSONs derived from verified templates at documented edit points only, a shared scoring rubric, a pixel-diff test for inertness, and a ≈2.5–3 h running order for a single 24 GB card. **Nothing was rendered.** Two design defects to fix first (#67 v-pred plumbing, #68 the cancelling Z-Image arm).
- [`_addenda/comfyui-ops-2026-09.md`](_addenda/comfyui-ops-2026-09.md) — agent 2C's operational grounding for the 💬 Ask tutor: version anchors, the `cnr_id`/`aux_id`/`ver` contract from the frontend zod schema, six real causes of a red node, per-family model-file maps, a **corrected** OOM ladder (the docs' own ladder disables dynamic VRAM at step 2), a 23-row error→fix table, the Aug-3 → Sep-2 change list, how to tell a local node from a paid partner node, and 20 ready-to-place tutor lines.
- [`new-models.md` §2026-09 register](new-models.md) — agent 2D's strict-gate register, the Bernini-R write-up, a ten-row corpus-coverage backlog of Comfy-Org repackages nobody has examined, and a refreshed closed-tier table.

Also updated by reference, not rewritten: [`_addenda/comfyui-metadata.md`](_addenda/comfyui-metadata.md) (2026-09-02) is now cited by `comfyui-ops-2026-09.md` rather than duplicated, and gains one addition — since core v0.30.0 MP4 tags are written at the **start** of the file, so recovery survives partial reads.

### Honest research-quality assessment — 2026-09-03 addendum

**What got stronger.** `[STAFF]` evidence went from **zero to twelve** verified rows with an explicit role-evidence method the verifier checked end-to-end. Three areas moved from "nothing found" to sourced primary material: **SCAIL-2** (from two sweeps of zero hits to two verbatim enhancer prompts, the palette and polarity comments, a token cap and a defensible prompt-sensitivity verdict), **SDXL fine-tune recipes** (a nine-family table with verbatim card blocks), and **ComfyUI operations** (source-level, version-anchored). Several long-standing `[LORE]` items are now `[OFFICIAL]`: H3's 15.08 s ceiling and reference-tag mechanics, Krea 2's nine LoRA triggers and its 512-position ceiling, the Chinese Wan negative list (hardcoded identically in three official repos), and the Wan 2.2 ZH vocabulary transcription. Three licence blocks are now quotable verbatim (H3, LTX, the anime checkpoints). And for the first time the corpus has an **adversarial pass**: the sweep's primary-source retrieval held up unusually well — every verbatim code and licence block re-fetched came back byte-exact — while the failures clustered in three named places (quotes tightened inside quotation marks, counts asserted without counting, and absence or tooling claims stated absolutely rather than per-endpoint).

**What is still `[SYNTHESIS]` or untested.** Nothing was rendered in this session either. Most few-shot gold added this run is still `[SYNTHESIS]` or `[OFFICIAL-PATTERN]` — modelled on official structure, not measured. The corpus still contains **exactly one** properly controlled cross-model fixed-seed test in the entire video literature, and none of our own. Specific claims that remain unproven and must not harden: LTX's negative inertness at CFG 1 (`[SPECULATION]`, no A/B anywhere); Krea 2's `ReferenceLatent` chain (two `[TESTED]` sources disagree at source level); Krea 2 Turbo's "CFG-free" framing against the official card's own `guidance_scale=3.5`; Wan's `不超过4种` as a measured band rather than an instruction the vendor's own exemplar breaks; Wan-Dancer's amplitude ladder beyond the two attested rungs; whether the SCAIL-2 prompt does anything measurable at all; and Bernini-R's fp8-on-24 GB claim. Coverage gaps recorded rather than closed: Juggernaut Z is unexamined; ten Comfy-Org repackages including an MIT Microsoft image model are untouched; GitHub closed-issue and keyword search were structurally unreachable, which is where maintainers most often answer; and Civitai — main site **and** the mature-content domain — is now invisible to every automated check, so any popularity claim resting on it is unfalsifiable as written.

**What the test kit would settle.** T1 (order vs prose vs labels) collapses several fold-in items into one rule and would tell us whether the DiT finding transfers to Qwen-Image and Krea 2, which the paper never tested. T2 collapses three per-model negative warnings into one and, with its LTX arm, closes a question the corpus has carried for three sweeps across LTX, Z-Image Turbo and Krea 2 — a pixel-identical result between two arms is the only thing that proves inertness. T6 localises the Krea 2 cliff on the build students actually run rather than the INT8 build one reporter used. T7 is the cheapest and would flush any v-pred wiring surprise early. T3–T5 would give the Chinese-versus-English position its first fixed-seed evidence for motion and camera, which it has never had. Until those results exist, the honest ceiling on this corpus is unchanged from 2026-08-15: it is strong enough to build a materially better model-aware rewriter and validator, and it is not strong enough to claim reliable control of pose, position or motion.

## 2026-09-10/11 update — accuracy pass (applied to the app)

- **Applied:** FOLD-IN-2026-09 §A/B/D/E/H (+ textual §C) in a first pass, then a verifier-gated second pass (58 system-prompt instructions across all 12 targets, 12 Model Picker rows, 7 live-defect repairs, one retraction — FOLD-IN B4's Krea "slot order" claim). Full per-item record: `docs/CHANGELOG-2026-09-10.md`.
- **Validator accuracy** (`_addenda/validator-accuracy-2026-09-10.md`, harness in `_addenda/validator-harness/`): 142 fixtures built from OFFICIAL rules and gold pairs; before 79% (21 valid prompts wrongly blocked — worst: Wan camera-move regex counted capture groups), after 100%. Every blocking message now carries `HARD:`, advisories `advisory:`. Re-run: `node research/_addenda/validator-harness/run.mjs`.
- **New research:** `_addenda/system-prompt-audit-2026-09-10.md` (109 confirmed / 16 contradicted / 20 unsourced / 68 missing across the rewriter prompts), `qwen-image.md` 09-10 sweep (rewriter diff verbatim; the "~200 words" is portrait-only and the ZH cap is 150字; 8 Lightning STAFF quotes), `_addenda/krea-character-art.md` harvest of all 36 official Krea 2 prompts (median 101 words; the app's 80–140 band matched 42%), `_addenda/template-picker-audit-2026-09-10.md` (all 7 templates NO DRIFT; picker had ~60 fields to fix), `digests/2026-09-10-digest.md` (ComfyUI v0.35.0; no new in-scope weights), `_addenda/verification-2026-09-10.md` (53 claims: 26 confirmed, 9 overstated, 4 unsupported; the gate for the second pass).
- **Still deferred (needs renders):** FOLD-IN §G and the verifier's NEEDS-RENDER list — all covered by `_addenda/test-kit-2026-09.md`.
