# In-house test kit — 2026-09 (agent 2B)

**Purpose.** Seven fixed-seed local tests that settle the corpus's biggest open splits. Nothing here
was rendered; this file is a protocol. Every workflow JSON in
[`test-kit/`](test-kit/) is derived from a **verified** template in
[`comfy-templates/`](comfy-templates/) with edits confined to the points documented in
[`comfy-templates/INDEX.md`](comfy-templates/INDEX.md): prompt text, negative text, seed,
`control_after_generate`, steps, cfg, sampler/scheduler, width/height/length/fps, checkpoint or UNet
filename, `filename_prefix`, subgraph-instance widget arrays, and node `mode` (bypass) toggles.
Node ids, link ids, `last_node_id`/`last_link_id` and subgraph node/link counts are byte-for-byte
unchanged — verified programmatically for all 50 files against their source templates.

**Written 2026-09-03.** Author: research agent 2B. Grades used below are the grades the cited corpus
file itself carries.

---

## 0. Before you start (do this once)

1. **Metadata must be on.** Do not launch with `--disable-metadata`; in Desktop, leave "Disable
   saving prompt metadata in files" unchecked. Every conclusion below depends on the output carrying
   its own recipe (`research/_addenda/comfyui-metadata.md`).
2. **Every file already ships `control_after_generate: "fixed"`** and seed `424242424242`. Do not
   press "randomize". If ComfyUI re-randomises anything, the run is void.
3. **Seeds.** Where a test asks for 2–3 seeds, run the file, then change only the seed widget and run
   again. Seed set for this kit:
   - **S1 = 424242424242** (shipped in every file)
   - **S2 = 987654321098**
   - **S3 = 135792468013**
   Seed widget location per model, if you prefer editing JSON to using the GUI:
   | Model | Where the seed lives |
   |---|---|
   | Qwen-Image | `definitions.subgraphs[0]` node **3** `KSampler` `widgets_values[0]` |
   | Krea 2 Turbo | instance node **30** `widgets_values[6]` **and** inner node **3** `widgets_values[0]` |
   | FLUX.2 klein | subgraph node **73** `RandomNoise` `widgets_values[0]` (both branches use id 73) |
   | Z-Image | `definitions.subgraphs[0]` node **3** `KSampler` `widgets_values[0]` |
   | Wan 2.2 TI2V-5B | node **3** `KSampler` `widgets_values[0]` |
   | SDXL | node **12** `KSampler` `widgets_values[0]` (also mirror `widgets_values_named.seed`) |
4. **Use the `Save…` nodes as shipped.** `PreviewImage` writes no file and therefore no metadata.
5. **`filename_prefix` is the experiment label — do not edit it.** Every condition has a unique one
   (`test-kit/T1_qwen_prose`, `video/test-kit/T4_wan5b_zh_8`, …), so outputs are self-identifying even
   after they leave the machine.
6. **Record the environment once** at the top of the results file: ComfyUI version, frontend version,
   GPU, driver, and whether each model is fp8 / bf16 / int8. Two of the corpus's weakest `[TESTED]`
   items are weak precisely because the reporter's quantisation was unclear.
7. **Placeholder filenames.** Two SDXL checkpoints are named speculatively
   (`Illustrious-XL-v3.0-epsilon.safetensors`, `noobaiXL-vpred-1.0.safetensors`) because community
   checkpoint filenames are arbitrary. Point the `CheckpointLoaderSimple` at your local file; nothing
   else changes. Everything else uses filenames read out of the verified templates.

### Scoring convention (all tests)

**Two raters, independently, 1–5, no discussion until both are done.** Axes below; each test names the
axes that decide it. If the two raters differ by **≥2** on any axis for any condition, they re-score
that condition together and mark the row `re-scored`.

| Axis | 1 | 3 | 5 |
|---|---|---|---|
| **ADH** adherence | most named elements missing | about half present | every named element present |
| **BIND** attribute binding | attributes on the wrong objects | one swap or bleed | every attribute on its own object |
| **CAM** camera/framing compliance | opposite of what was asked | roughly right | exactly the named shot scale / move |
| **INT** technical integrity | black, noise, or collapsed anatomy | visible grain or one bad hand | clean |
| **AES** aesthetic quality | unusable | ordinary | best of the set |

For "did anything change at all?" questions, do **not** use the rubric — use a pixel diff:

```bash
python -c "from PIL import Image, ImageChops; import sys; \
a=Image.open(sys.argv[1]).convert('RGB'); b=Image.open(sys.argv[2]).convert('RGB'); \
d=ImageChops.difference(a,b); print('IDENTICAL' if d.getbbox() is None else 'DIFFERENT max=%d'%max(d.getextrema()[i][1] for i in range(3)))" \
  A.png B.png
```

`IDENTICAL` (bbox `None`) is the only result that proves inertness. Anything else is a difference, and
the max-channel delta tells you whether it is a rounding artefact (≤2) or a real change.

---

## T1 — Order vs prose vs labels  ★ highest priority

**Hypothesis.** Word **identity + position** carries the result; **prose grammar** does not.
Prediction: (a) prose ≈ (b) label block on ADH/BIND, and both ≫ (c) scrambled. If instead
(a) > (b) ≫ (c), prose grammar is doing real work and the corpus's prose doctrine survives.

**What the corpus currently claims.**
- `research/flux.md` §2026-09 sweep item **10** `[TESTED/PAPER]` — arXiv 2606.03715 (MIT/Technion):
  word identity + absolute position ("BoPTW") reaches ~65% non-inferiority vs 70–90% for full
  embeddings, **on FLUX.2 klein-4B specifically**, and same-word-set/different-order pairs are
  disambiguated correctly. Also item **3** `[OFFICIAL]`: BFL's current guide publishes a *slot
  template* (`[SUBJECT], [LOCATION], [STYLE], …`), i.e. comma-run, not prose. Also item **4**
  `[OFFICIAL]`: BFL's own paired framing rewrite, same words, different order, different result.
- `research/digests/2026-08-28-digest.md` "Contradicts" **#1/#2**: "write prose because the encoder is
  an LLM" is undercut; Civitai 30826 `[LORE]` claims Qwen-Image-2512 prefers
  `Subject:/Pose:/Camera:/Lighting:` blocks (weak evidence, no grids).
- The paper does **not** include Z-Image, Krea 2, or Qwen-Image, and is image-only. That is the gap
  this test closes.

**Encodings.** Content is held constant. (c) is an **exact multiset permutation** of (a) — same 52
words, punctuation stripped, shuffled once with a fixed RNG. (b) adds only the six label tokens and
drops connectives; that asymmetry is inherent to the comparison and must be stated in the write-up.

(a) **prose** — verbatim:

```text
A middle-aged woman in a mustard raincoat stands on an empty market street at dawn, holding a folded blue umbrella at her side and looking to her left, while the closed stalls behind her recede into overcast light and the wet pavement reflects her coat. Documentary photograph, low-angle three-quarter view, 35mm lens.
```

(b) **label block** — verbatim (newlines are part of the prompt):

```text
Subject: a middle-aged woman in a mustard raincoat
Pose: standing, holding a folded blue umbrella at her side, looking to her left
Camera: low-angle three-quarter view, 35mm lens
Lighting: overcast light, wet pavement reflecting her coat
Setting: an empty market street at dawn, closed stalls behind her
Style: documentary photograph
```

(c) **scrambled** — verbatim:

```text
blue into overcast three-quarter stalls and raincoat A a coat looking street left at low-angle umbrella empty her her a market light mustard reflects in recede and woman wet lens Documentary to view middle-aged her photograph at stands the behind on her while holding side closed dawn pavement an folded the 35mm
```

**Design.** 3 encodings × 3 seeds (S1/S2/S3) × 3 models = **27 renders**.

**Model files required** (exact names, from the templates):
- Qwen-Image: `qwen_image_fp8_e4m3fn.safetensors` · `qwen_2.5_vl_7b_fp8_scaled.safetensors` ·
  `qwen_image_vae.safetensors`. Runs **non-turbo**: 20 steps, cfg 4, euler/simple, 1024×1024.
  **Qwen-Image-2512 swap:** the 2512 checkpoint is *not* among the verified templates and its ComfyUI
  filename could not be confirmed from any local source or from
  `docs.comfy.org/tutorials/image/qwen/qwen-image` (that page covers base Qwen-Image only). If you
  have 2512 locally, change **one widget** — `definitions.subgraphs[0]` node **37** `UNETLoader`
  `widgets_values[0]` — and append `_2512` to the `filename_prefix` on node **60**. Run both if you
  can; the base-vs-2512 delta is itself a corpus question (Civitai 30826 is a *2512* claim).
- Krea 2 Turbo: `krea2_turbo_fp8_scaled.safetensors` · `qwen3vl_4b_fp8_scaled.safetensors` (CLIP type
  **`krea2`**) · `qwen_image_vae.safetensors`. 8 steps, cfg 1, euler/simple.
  **`prompt_enhance` is forced OFF** (instance `widgets_values[1] = false`, inner node 24 = `false`) —
  without that the built-in `TextGenerate` LLM rewrites the prompt and the test measures the rewriter,
  not the model. `enable_lora` is off so no trigger word is appended.
- FLUX.2 klein 4B **Base**: `flux-2-klein-base-4b.safetensors` · `qwen_3_4b.safetensors` (CLIP type
  **`flux2`**) · `flux2-vae.safetensors`. 20 steps, cfg 5 (template defaults). Encoder pairing is
  size-locked — 4B ↔ Qwen3-4B; a Mistral encoder or Qwen3-8B fails loudly with
  `mat1 and mat2 shapes cannot be multiplied` (`research/flux.md` item 7).

**Workflow JSONs.**

| Model | (a) prose | (b) labels | (c) scrambled |
|---|---|---|---|
| Qwen-Image | `T1-qwen-a-prose.json` | `T1-qwen-b-labels.json` | `T1-qwen-c-scrambled.json` |
| Krea 2 Turbo | `T1-krea2-a-prose.json` | `T1-krea2-b-labels.json` | `T1-krea2-c-scrambled.json` |
| klein 4B Base | `T1-klein4b-base-a-prose.json` | `T1-klein4b-base-b-labels.json` | `T1-klein4b-base-c-scrambled.json` |

**What to look at.** ADH (are all of: mustard raincoat, folded blue umbrella *at her side*, gaze to
*her left*, closed stalls *behind*, wet pavement reflection, dawn, low angle, three-quarter view
present?) · BIND (is the raincoat mustard and the umbrella blue, or have the colours swapped?) · CAM
(low-angle three-quarter, not eye-level frontal) · AES. INT is not expected to vary.

**Results table.**

| Model | Encoding | Seed | ADH | BIND | CAM | AES | Colour swap? (y/n) | Notes |
|---|---|---|---|---|---|---|---|---|
| Qwen | prose | S1 | | | | | | |
| Qwen | prose | S2 | | | | | | |
| Qwen | prose | S3 | | | | | | |
| Qwen | labels | S1–S3 | | | | | | |
| Qwen | scrambled | S1–S3 | | | | | | |
| Krea 2 | prose | S1–S3 | | | | | | |
| Krea 2 | labels | S1–S3 | | | | | | |
| Krea 2 | scrambled | S1–S3 | | | | | | |
| klein Base | prose | S1–S3 | | | | | | |
| klein Base | labels | S1–S3 | | | | | | |
| klein Base | scrambled | S1–S3 | | | | | | |

(Expand to one row per seed; the mean of ADH+BIND across three seeds is the decision statistic.)

**Decision rule.**
- If **|prose − labels| ≤ 0.5** and **scrambled ≤ prose − 1.0** on mean(ADH,BIND) for ≥2 of 3 models:
  rewrite the doctrine as one rule. Target: `KNOWLEDGE` — replace "write prose because the encoder is
  an LLM" with **"Order and specificity carry the image; grammar does not. Put the subject first,
  then pose, then camera, then light. Prose and `Subject:/Pose:/Camera:/Lighting:` blocks are
  interchangeable — pick whichever you write more carefully."** Fold-in items 1, 2 and 4 of the
  08-28 digest collapse into that single line.
- If **prose − labels ≥ 1.0** on ≥2 models: keep the prose rule, and demote the label-block claim
  (digest #2) to `[LORE, contradicted by in-house test]`.
- If **scrambled ≈ prose** anywhere: that model's encoder is order-insensitive; record it as a
  per-model exception and stop teaching front-loading for it.
- If **klein behaves differently from the other two** (paper predicts klein retains the most context
  sensitivity), split the rule by model rather than globally.

---

## T2 — Negative-prompt inertness

**Hypothesis.** A negative prompt is a function of **guidance**, not of the model. At cfg 1 it is
inert; above 1 it is live but weak. Corollary predictions:
(i) Qwen-Image at cfg 4 with negative `red` differs from cfg 4 with an empty negative; at cfg 1 the
two are **pixel-identical**. (ii) Z-Image Turbo (cfg 1) is pixel-identical whether the negative
branch is a zeroed conditioning or a copy of the positive; Z-Image Base (cfg 4) is not.
(iii) klein Base at cfg 4 responds to `red`; the same graph at cfg 1 does not; klein distilled has no
negative field at all. (iv) On Krea 2, `ConditioningZeroOut` + a `_cfg_pp` sampler adds grain even at
cfg 1.

**What the corpus currently claims.**
- `research/z-image.md` §2026-09 sweep item **9** `[STAFF]` (Tongyi-MAI `Cxxs`): Turbo "does not use
  negative prompts at all". Item **13** `[OFFICIAL — code]`: `ZImagePipeline` *does* accept a string
  negative; it is dead only because `do_classifier_free_guidance = guidance_scale > 0`. Item **5**
  `[OFFICIAL]`: Base defaults are 50 steps / cfg 5, and the GitHub README recommends negatives for
  Base (28–50 steps, guidance 3.0–5.0).
- `research/flux.md` items **8** and **9** `[OFFICIAL — code]`: `Flux2KleinPipeline` hardcodes the
  negative to `""` and exposes no string path; klein **Base** computes a real unconditional branch at
  guidance 4.0, so a negative is *architecturally* live there. Item **5** `[OFFICIAL]`: BFL softened
  "no negative prompts" to "**most** FLUX models do not support negative prompts".
- `research/_addenda/krea-character-art.md` §Tested **B** `[TESTED]`: "The negative is inert at
  cfg = 1 — and you must use a real (empty) negative, never `ConditioningZeroOut`… `_cfg_pp` samplers
  use the uncond even at cfg 1, and `ConditioningZeroOut` feeds them a degenerate uncond → grain."
- `research/ltx23.md` lines 431–433 `[SPECULATION]`: LTX-2.5's template negative is probably inert at
  distilled cfg 1, and `NAGuidance` is the only candidate negative path — with an open ComfyUI issue
  (#12707) claiming the built-in node does nothing.
- 08-28 digest "Contradicts" **#3** conflated `ZImagePipeline` with `Flux2KleinPipeline`; both Wave-1
  sweeps have since corrected it. This test is the empirical version of that correction.

**Prompt (identical in every arm), verbatim:**

```text
A still life on a white table: a red enamel teapot, two green pears and a folded grey cloth. Soft window light from the left, plain pale wall behind. Documentary photograph, 50mm lens.
```

Negative, where a negative field exists: the single word `red` (arm "negred") or `` (empty, arm
"negempty"). One word is deliberate: it is unambiguous, it targets a named object, and it makes
"nothing changed" visually obvious.

**The zero-out bypass probe** (used for Z-Image and available for Krea 2). Z-Image Turbo and Krea 2
ship `ConditioningZeroOut` in place of a negative `CLIPTextEncode`, so there is no text field to fill.
Setting that node's `mode` to **4 (bypass)** makes it pass its input through, so the negative
conditioning becomes **an exact copy of the positive**. Algebraically the guided prediction is then
`pos + s·(pos − pos) = pos` for any `s`, so:
- at cfg 1 (uncond pass skipped) the bypassed and non-bypassed runs must be **pixel-identical**;
- at cfg > 1 they must **differ** — and if they do not, the guidance branch is not running at all.
This is a liveness probe that needs **no added nodes**, only the documented `mode` lever
(INDEX §"Practical notes" item 4).

**Design.** 1 seed (S1) for every arm — these are identity comparisons, not quality comparisons.
14 renders.

| Arm | JSON | Model files | Params |
|---|---|---|---|
| klein Base, neg `red`, cfg 4 | `T2-klein4b-base-neg-red-cfg4.json` | `flux-2-klein-base-4b.safetensors`, `qwen_3_4b.safetensors`, `flux2-vae.safetensors` | 20 steps, cfg 4 |
| klein Base, neg empty, cfg 4 | `T2-klein4b-base-neg-empty-cfg4.json` | same | 20 steps, cfg 4 |
| klein Base, neg `red`, cfg 1 | `T2-klein4b-base-neg-red-cfg1.json` | same | 20 steps, cfg 1 |
| klein **distilled**, no negative field | `T2-klein4b-distilled-nonegative.json` | `flux-2-klein-4b.safetensors`, `qwen_3_4b.safetensors`, `flux2-vae.safetensors` | 4 steps, cfg 1; branch swap done by `mode` (instance 77 + SaveImage 78 enabled, 75 + 9 bypassed) |
| Qwen, neg `red`, cfg 4 | `T2-qwen-cfg4-neg-red.json` | `qwen_image_fp8_e4m3fn.safetensors`, `qwen_2.5_vl_7b_fp8_scaled.safetensors`, `qwen_image_vae.safetensors` | 20 steps, cfg 4, turbo off |
| Qwen, neg empty, cfg 4 | `T2-qwen-cfg4-neg-empty.json` | same | 20 steps, cfg 4 |
| Qwen, neg `red`, cfg 1 | `T2-qwen-cfg1-neg-red.json` | same + `Qwen-Image-Lightning-8steps-V1.0.safetensors` | 8 steps, cfg 1, turbo on |
| Qwen, neg empty, cfg 1 | `T2-qwen-cfg1-neg-empty.json` | same | 8 steps, cfg 1, turbo on |
| Z-Image **Turbo**, zero-out | `T2-zimage-turbo-zeroout.json` | `z_image_turbo_bf16.safetensors`, `qwen_3_4b.safetensors` (type `lumina2`), `ae.safetensors` | 8 steps, cfg 1, res_multistep |
| Z-Image Turbo, neg = pos | `T2-zimage-turbo-negeqpos.json` | same | 8 steps, cfg 1, node 33 bypassed |
| Z-Image **Base**, zero-out | `T2-zimage-base-zeroout.json` | `z_image_bf16.safetensors` + same encoder/VAE | 28 steps, cfg 4 |
| Z-Image Base, neg = pos | `T2-zimage-base-negeqpos.json` | same | 28 steps, cfg 4, node 33 bypassed |
| Krea 2, euler | `T2-krea2-euler-zeroout.json` | `krea2_turbo_fp8_scaled.safetensors`, `qwen3vl_4b_fp8_scaled.safetensors`, `qwen_image_vae.safetensors` | 8 steps, cfg 1, euler |
| Krea 2, euler_cfg_pp | `T2-krea2-euler-cfg-pp-zeroout.json` | same | 8 steps, cfg 1, `euler_cfg_pp` |

Note the Z-Image Base arms are the **Turbo template with three widgets changed** (UNet name, steps,
cfg). The encoder (`qwen_3_4b.safetensors`) and VAE (`ae.safetensors`) are shared between Base and
Turbo — `research/z-image.md` item 6 `[OFFICIAL]` — so no extra downloads beyond the Base DiT. Base's
own recommended range is 28–50 steps / cfg 3–5; 28/4 is the cheap end of it.

**What to look at.** Run the pixel diff on these five pairs, then rate INT on the two Krea arms.

| Pair | Diff result (IDENTICAL / DIFFERENT max=n) | Is the teapot still red? | Interpretation |
|---|---|---|---|
| Qwen cfg4 negred vs cfg4 negempty | | | negative live at cfg 4? |
| Qwen cfg1 negred vs cfg1 negempty | | | negative inert at cfg 1? |
| klein Base cfg4 negred vs cfg4 negempty | | | klein Base negative live in ComfyUI? |
| klein Base cfg4 negred vs cfg1 negred | | n/a | guidance is what makes it work? |
| Z-Image Turbo zeroout vs negeqpos | | n/a | uncond pass skipped at cfg 1? |
| Z-Image Base zeroout vs negeqpos | | n/a | uncond pass running at cfg 4? |

| Krea arm | INT | Grain present? | Notes |
|---|---|---|---|
| euler + ConditioningZeroOut | | | |
| euler_cfg_pp + ConditioningZeroOut | | | |

**Decision rule.**
- If both cfg-1 pairs are `IDENTICAL` and both cfg-4 pairs `DIFFERENT`: promote the cross-model rule
  to `[TESTED]` and make it the single teaching line. Target: `GOTCHAS` card — **"A negative prompt
  does nothing at CFG 1. It is guidance, not vocabulary. Distilled/Turbo models run at CFG 1, so
  their negative field is decoration. Raise CFG (Base checkpoints) or use a NAG/NegPiP node."**
  Then delete the three separate per-model warnings (LTX, Z-Image Turbo, Krea 2) and cross-reference
  one rule; and correct 08-28 digest contradiction #3 in place.
- If klein Base at cfg 4 shows **no** difference: ComfyUI's klein path also pins the negative, and the
  corpus must say so — the diffusers bug (#13416) is then not diffusers-only. Add a `WF` note.
- If `euler_cfg_pp` shows grain and `euler` does not: promote the Krea `_cfg_pp` rule from
  `[TESTED — single reporter]` to `[TESTED, replicated]` and add the validator warning already drafted
  in `krea-character-art.md` §Validator ("warn if sampler contains `cfg_pp` and `ConditioningZeroOut`
  is present").
- If anything at cfg 1 is `DIFFERENT`: the CFG-1 optimisation is not firing in your build. Record the
  ComfyUI version and treat the whole test as version-scoped.

### T2-LTX — the NAG arm: **designed, not shipped as JSON**

`research/ltx23.md` line 514 asks for this and it cannot be built from the verified templates. Two
blockers, both stated so nobody re-hunts them:
1. **The LTX-2.5 template is not in `comfy-templates/`.** The set contains
   `video_ltx2_3_t2v.TRUNCATED-DO-NOT-USE.json` (invalid JSON, capture cut at 105,577 bytes) and the
   Lightricks **2.3** vendor workflow, which needs `ComfyUI-LTXVideo` **and** `ClownSampler_Beta`
   (RES4LYF) and so is not a bare-core path. The 2.5 template (`video_ltx2_5_t2v.json`, subgraph
   input order and `widgets_values` recorded verbatim in `research/ltx23.md` item 5) must be fetched
   from the Comfy-Org repo or the template library before this arm can run.
2. **NAG requires adding a node.** `NAGuidance` is comfy-core
   (`docs.comfy.org/built-in-nodes/NAGuidance`; `nag_scale` 0–50 default 5.0, `nag_alpha` 0–1 default
   0.5, `nag_tau` 1–10 default 1.5) but inserting it changes the graph, which is outside this kit's
   edit budget.

Protocol, for when the 2.5 template is on disk (three arms, one seed, `prompt_enhance` **off** on the
subgraph node — it ships **`true`**, `research/ltx23.md` item 5 `[OFFICIAL/TESTED]`):

- **(i) as shipped** — distilled, dual-CFG guider at cfg 1, template negative
  `pc game, console game, video game, cartoon, childish, ugly` present.
- **(ii) negative emptied** — same everything, negative string blanked.
- **(iii) NAG** — insert `NAGuidance` between the model and the guider, feed it the *negative*
  conditioning, `nag_scale 5.0 / nag_alpha 0.5 / nag_tau 1.5`, and use the official
  `DEFAULT_NEGATIVE_PROMPT` from `ltx_pipelines/utils/constants.py` (quoted in full in
  `research/ltx23.md` item 7) as the negative text.

Positive prompt for all three arms — written to invite the thing the official negative's first tokens
name (`has_subtitles`, `has_blurbox`):

```text
A television news studio at night. A presenter in a navy suit sits behind a glass desk and speaks directly to camera; a lower-third graphics bar and a caption strip run along the bottom of the frame. Static shot, medium close-up, cool studio lighting.
```

Decision rule: if (i) and (ii) are pixel-identical, the shipped negative is inert at cfg 1 — teach
that, and treat `NAGuidance` as the only negative route on distilled LTX. If (iii) also equals (i),
ComfyUI issue **#12707** ("Native NAG node not applying negative prompt") is confirmed and NAG must
be taught as broken-in-core, with `ChenDarYen/ComfyUI-NAG` as the custom-pack alternative. Either way
this arm changes `research/ltx23.md` §Validator from `[SPECULATION]` to `[TESTED]`.

---

## T3 — ZH vs EN at fixed seed

**Hypothesis.** For a culturally Chinese scene, a **natively written Chinese** prompt beats a faithful
English translation, and a **machine-translated Chinese** prompt is the worst of the three — because
MT produces Chinese that is not the vocabulary either model was trained on (`静态射击` for "static
shot", `领域深度` for "depth of field"). If native ZH ≈ faithful EN, the corpus's "Chinese sources
outrank English mirrors" rule is about *sources*, not about *prompts*, and must say so.

**What the corpus currently claims.**
- `research/wan22.md` §2026-09 sweep (a) `[OFFICIAL]`: `tar_lang="zh"` is Wan's rewriter default, and
  `--use_prompt_extend` turns an English prompt **into Chinese**. (c) `[SYNTHESIS]`: the official
  "English" system prompt is written in Chinese and its own exemplar leaks untranslated Chinese
  (`The俯拍close-up`) — direct evidence Chinese is Wan's primary prompt language.
- `research/z-image.md` item **10** `[OFFICIAL]`: the Base usage example is a native Chinese paragraph
  (count → per-subject block → capture terms). Item **12** `[LORE]`: one user found the Chinese
  Qwen-Image blog prompt performed *worse* on Z-Image Turbo than the English rewrite, n=1, no seeds.
- Plan operating rule 6 tells agents to prefer Chinese sources for Alibaba-family models; nothing in
  the corpus tests whether that transfers to prompts.

**Prompts, verbatim.**

(1) `zh-native` — idiomatic, uses the vendor's own tokens (`固定镜头`, `中近景`, `暖色调`, `浅景深`):

```text
固定镜头，中近景。江南古镇的元宵夜，青石板路湿漉，两侧木窗透出暖黄灯光。一位穿藏青棉袄的老人提着兔子花灯缓步走过石桥，灯影在水面轻轻晃动；远处传来锣鼓声。暖色调，柔和的灯笼光，浅景深。
```

(2) `en-faithful` — a careful human translation of (1):

```text
Static shot, medium close-up. Lantern Festival night in an old Jiangnan water town: the flagstone lane is wet and warm yellow light comes through the wooden windows on both sides. An elderly man in a navy quilted jacket carries a rabbit-shaped paper lantern and walks slowly across a stone bridge; the lantern's reflection sways gently on the water. Gongs and drums sound in the distance. Warm colors, soft lantern light, shallow depth of field.
```

(3) `zh-machine` — (2) rendered back into Chinese the way a machine translator does it, with the
canonical failures left in (`静态射击` = "static gunfire", `被子夹克` = "duvet jacket", `反射` for a
reflection on water, `领域深度` = "field depth"):

```text
静态射击，中等特写。在一个古老的江南水乡的灯笼节之夜：石板小巷是湿的，温暖的黄色光线从两侧的木窗户中出来。一位穿着海军蓝被子夹克的老人拿着一个兔子形状的纸灯笼，慢慢地走过一座石桥；灯笼的反射在水面上轻轻摇摆。远处响起锣和鼓的声音。温暖的颜色，柔和的灯笼灯，浅的领域深度。
```

**Design.** Wan 2.2 TI2V-5B: 3 conditions × 2 seeds (S1, S2) = 6 clips at 960×544, **49 frames**
(`4n+1`), 24 fps ≈ 2 s. Z-Image Turbo: 3 conditions × 2 seeds = 6 images at 1024².
Wan's shipped CJK negative block is left **untouched** in all arms.

**Model files.** Wan: `wan2.2_ti2v_5B_fp16.safetensors` · `umt5_xxl_fp8_e4m3fn_scaled.safetensors`
(CLIP type `wan`) · `wan2.2_vae.safetensors`; 20 steps, cfg 5, `uni_pc`/`simple`, shift 8.
Z-Image: `z_image_turbo_bf16.safetensors` · `qwen_3_4b.safetensors` (type `lumina2`) ·
`ae.safetensors`; 8 steps, cfg 1, `res_multistep`/`simple`.

**Workflow JSONs.** `T3-wan5b-zh-native.json` · `T3-wan5b-en-faithful.json` ·
`T3-wan5b-zh-machine.json` · `T3-zimage-turbo-zh-native.json` ·
`T3-zimage-turbo-en-faithful.json` · `T3-zimage-turbo-zh-machine.json`

**What to look at.** ADH · CAM (is the camera actually locked off? MT `静态射击` is the most likely
place to lose it) · AES · plus two binary columns: **cultural correctness** (is it a Jiangnan water
town with a paper lantern, or a generic Western street with a lamp?) and **MT artefact** (does
anything gun-, duvet- or mirror-like appear?).

| Model | Condition | Seed | ADH | CAM | AES | Culturally correct? | MT artefact? | Notes |
|---|---|---|---|---|---|---|---|---|
| Wan 5B | zh-native | S1 | | | | | | |
| Wan 5B | zh-native | S2 | | | | | | |
| Wan 5B | en-faithful | S1/S2 | | | | | | |
| Wan 5B | zh-machine | S1/S2 | | | | | | |
| Z-Image | zh-native | S1/S2 | | | | | | |
| Z-Image | en-faithful | S1/S2 | | | | | | |
| Z-Image | zh-machine | S1/S2 | | | | | | |

**Decision rule.**
- If `zh-native > en-faithful` by ≥1.0 mean(ADH,AES) on **both** models: state it as a rule. Target:
  `TARGETS['wan22'].system` and `TARGETS['zImage'].system` — **"For a Chinese scene, write the prompt
  in Chinese using the vendor's own tokens; do not translate an English prompt."**
- If `en-faithful ≈ zh-native`: rewrite the corpus's Chinese-prompting position to the narrower,
  defensible one already in `z-image.md`: **Chinese for glyphs that must be rendered and for
  culturally native nouns; English is fine for camera and lighting vocabulary.** Also downgrade
  operating rule 6 to a *sourcing* rule only.
- If `zh-machine` is clearly worst on either model: add a `GOTCHAS` card — **"Do not machine-translate
  a prompt into Chinese. MT invents tokens the model never saw (`静态射击`, `领域深度`). Use the
  vendor vocabulary table or write English."** This is the single most likely-to-fire student
  mistake in the set.

---

## T4 — Wan's four-aesthetic-token cap: model limit or style choice?

**Hypothesis.** The `不超过4种` cap in Wan's **English** rewriter system prompt is a *stylistic*
instruction to the rewriter, not a model limit — so 8 aesthetic tokens will not degrade output in
either language. The alternative: past four, the aesthetic run starts competing with the action clause
and adherence to the *motion* drops. That would make the cap a real teaching rule.

**What the corpus currently claims.**
- `research/wan22.md` §2026-09 sweep (b) `[OFFICIAL]`, verbatim: `T2V_A14B_EN_SYS_PROMPT` rule 1 says
  「…选择**不超过4种**合适的…电影设定细节」 while the ZH form says 「选择**部分**合适的…」 with no
  numeric cap. The ZH exemplars front-load 9–11 aesthetic tokens, the EN exemplars 3–4.
- Same file §Validator change **1** `[SYNTHESIS]`: "Warn above ~4 front-loaded aesthetic tokens in
  English, ~10 in Chinese." That validator rule is currently pure inference from a rewriter prompt —
  no image or clip evidence anywhere in the corpus.
- All tokens used below are attested: the ZH set from `system_prompt.py`'s closed vocabulary plus the
  阿里云 guide's `低对比度` / `长焦`; the EN set from the shipped EN exemplar
  (`Dawn time, top lighting, … center composition, Close-up shot, … soft lighting, cool colors`).

**Prompts, verbatim.** The action clause is byte-identical across the three ZH arms and across the
three EN arms; only the leading aesthetic run grows.

ZH action clause: `一位女子坐在雨痕斑驳的列车窗边，身体保持不动，视线从信纸缓慢抬向窗外。`

```text
2 tokens: 黄昏时分，侧光。一位女子坐在雨痕斑驳的列车窗边，身体保持不动，视线从信纸缓慢抬向窗外。
4 tokens: 黄昏时分，侧光，柔和的光线，冷色调。一位女子坐在雨痕斑驳的列车窗边，身体保持不动，视线从信纸缓慢抬向窗外。
8 tokens: 黄昏时分，侧光，柔和的光线，冷色调，低对比度，中近景，长焦，中心构图。一位女子坐在雨痕斑驳的列车窗边，身体保持不动，视线从信纸缓慢抬向窗外。
```

EN action clause: `A woman sits by a rain-streaked train window, her body still, her gaze lifting slowly from a letter to the window.`

```text
2 tokens: Dusk time, side lighting. A woman sits by a rain-streaked train window, her body still, her gaze lifting slowly from a letter to the window.
4 tokens: Dusk time, side lighting, soft lighting, cool colors. A woman sits by a rain-streaked train window, her body still, her gaze lifting slowly from a letter to the window.
8 tokens: Dusk time, side lighting, soft lighting, cool colors, low contrast, Medium close-up shot, long lens shot, center composition. A woman sits by a rain-streaked train window, her body still, her gaze lifting slowly from a letter to the window.
```

**Design.** 6 conditions × 2 seeds (S1, S2) = **12 clips**, Wan 2.2 TI2V-5B, 960×544, 49 frames,
24 fps. Same model files and sampler settings as T3.

**Workflow JSONs.** `T4-wan5b-zh-2-aesthetic.json` · `T4-wan5b-zh-4-aesthetic.json` ·
`T4-wan5b-zh-8-aesthetic.json` · `T4-wan5b-en-2-aesthetic.json` ·
`T4-wan5b-en-4-aesthetic.json` · `T4-wan5b-en-8-aesthetic.json`

**What to look at.** Two things separately, because the hypothesis is about a *trade*:
**AES** (does the aesthetic run actually land — dusk, side light, cool, low contrast, medium close-up,
long lens, centred?) and **ADH-motion** (is the body still, and does the gaze lift *from the letter to
the window*, once, slowly?). Also INT (Wan degradations show as flicker or a drifting camera).
Count, per clip, **how many of the requested aesthetic tokens are visibly honoured** — that column is
the real measurement.

| Lang | Tokens | Seed | AES | ADH-motion | INT | Aesthetic tokens honoured (n/N) | Camera drifted? | Notes |
|---|---|---|---|---|---|---|---|---|
| ZH | 2 | S1/S2 | | | | /2 | | |
| ZH | 4 | S1/S2 | | | | /4 | | |
| ZH | 8 | S1/S2 | | | | /8 | | |
| EN | 2 | S1/S2 | | | | /2 | | |
| EN | 4 | S1/S2 | | | | /4 | | |
| EN | 8 | S1/S2 | | | | /8 | | |

**Decision rule.**
- If **ADH-motion drops ≥1.0 from 4→8 tokens in English but not in Chinese**: the cap is real and
  language-specific. Keep `wan22.md` validator change 1 as written and promote it from `[SYNTHESIS]`
  to `[TESTED]`.
- If ADH-motion drops in **both** languages: the cap is a general prompt-budget effect, not an
  English one. Rewrite the validator to a single language-neutral warning at ~4–6 tokens and note
  that the ZH rewriter's freedom is a rewriter artefact, not a licence.
- If **nothing drops** and the honoured-token count rises monotonically: the `不超过4种` line is a
  rewriter style rule only. Then the corpus must **not** ship an English aesthetic-token limit; change
  the validator to informational ("English official exemplars use 3–4; Chinese use 9–11") and record
  the test as the reason.
- Regardless of outcome: record how many of 8 tokens ever land. If the ceiling is ~5 in both
  languages, that number is more useful to students than either vendor figure.

---

## T5 — Wan camera vocabulary: `固定镜头` vs `固定机位` vs "static shot", and arc vs orbit

**Hypothesis (A).** `固定镜头` (the vendor's word) locks the camera more reliably than `固定机位`
(our corpus's community coinage). **Hypothesis (B).** There is no `arc` / `orbit` distinction and no
45° threshold: what matters is the described *extent* of the move, and a ~180° back-to-front orbit
works because the vendor's own guide ships it as an exemplar.

**What the corpus currently claims.**
- `research/wan22.md` line **9** and line **44** `[OFFICIAL]`: "an orbit wider than 45 degrees risks
  spatial distortion" / "Keep orbit under 45 degrees". §2026-09 sweep *Contradicts* **#1** says this
  is **unsupported**: no degree figure anywhere on the 阿里云 guide (rev. 2026-09-02) or in
  `system_prompt.py`, and the sole 环绕运镜 exemplar is a *successful* back→front ~180° orbit
  (「镜头从他背后缓缓绕行至正面」). Third-party SEO guides disagree with each other (one says 10–20°).
  The "arc shot works / orbit is the failure word" framing has **no first-party source**.
- Same sweep *Contradicts* **#3** `[OFFICIAL]`: the vendor's locked-camera term is `固定镜头`
  (「若希望镜头不要发生变化，可以通过"固定镜头"来强调」); `固定机位` is community vocabulary used in all
  four of our existing Wan gold pairs and in validator line 110.

**Prompts, verbatim.** Base ZH clause: `一位穿红色风衣的女子站在天台边缘，只有衣角轻摆，城市在她身后。`

Static-camera arms:

```text
guanfang: 固定镜头。一位穿红色风衣的女子站在天台边缘，只有衣角轻摆，城市在她身后。
corpus:   固定机位。一位穿红色风衣的女子站在天台边缘，只有衣角轻摆，城市在她身后。
english:  Static shot. A woman in a red trench coat stands at the edge of a rooftop; only the hem of her coat moves, the city behind her.
```

Orbit arms (all ZH, so language is not a confound):

```text
arc45:    一位穿红色风衣的女子站在天台边缘，只有衣角轻摆，城市在她身后。镜头以小幅度弧线绕行，约45度。
orbit45:  一位穿红色风衣的女子站在天台边缘，只有衣角轻摆，城市在她身后。环绕运镜，约45度。
arc180:   一位穿红色风衣的女子站在天台边缘，只有衣角轻摆，城市在她身后。镜头以弧线从她背后绕行至正面。
orbit180: 一位穿红色风衣的女子站在天台边缘，只有衣角轻摆，城市在她身后。环绕运镜，镜头从她背后缓缓绕行至正面。
```

⚠ The `english` arm changes the scene language as well as the term, so it is **not** a clean
comparison with the two ZH arms — the decisive comparison is `guanfang` vs `corpus`. Report the
English arm as context only.

**Design.** 7 conditions × 2 seeds (S1, S2) = **14 clips**, Wan 2.2 TI2V-5B, 960×544, 49 frames,
24 fps, same model files and sampler as T3. 49 frames is short for a 180° orbit — if the orbit arms
look truncated rather than distorted, re-run just `arc180` / `orbit180` at **97 frames** (`4n+1`,
node 55 `widgets_values[2]`) before concluding anything.

**Workflow JSONs.** `T5-wan5b-static-guanfang.json` · `T5-wan5b-static-corpus.json` ·
`T5-wan5b-static-english.json` · `T5-wan5b-arc45.json` · `T5-wan5b-orbit45.json` ·
`T5-wan5b-arc180.json` · `T5-wan5b-orbit180.json`

**What to look at.** For static arms: **CAM** plus a hard binary — *did the camera move at all?*
(any translation, zoom, or drift counts as a failure). For orbit arms: CAM, INT, plus **estimated
degrees traversed** (eyeball to the nearest 45°) and a **distortion** note (does the subject stretch,
does the background tear, does the face re-form?).

| Arm | Seed | CAM | INT | Camera moved? (static arms) | Degrees traversed (orbit arms) | Distortion | Notes |
|---|---|---|---|---|---|---|---|
| static `固定镜头` | S1/S2 | | | | n/a | | |
| static `固定机位` | S1/S2 | | | | n/a | | |
| static "Static shot" | S1/S2 | | | | n/a | | |
| arc45 | S1/S2 | | | n/a | | | |
| orbit45 | S1/S2 | | | n/a | | | |
| arc180 | S1/S2 | | | n/a | | | |
| orbit180 | S1/S2 | | | n/a | | | |

**Decision rule.**
- If `固定镜头` holds the camera on both seeds and `固定机位` does not (or drifts on either):
  change the vocabulary everywhere — `TARGETS['wan22'].system`, the four Wan gold pairs in
  `research/wan22.md`, and validator line 110 — to **prefer `固定镜头`, accept
  `固定机位` / `镜头位置保持不动` as variants**. This is `wan22.md` validator change 3, unblocked.
- If both work equally: keep `固定机位` in existing pairs, add `固定镜头` as the vendor-preferred
  synonym, and stop treating it as a correction.
- If `orbit180` succeeds (≥3 CAM, no distortion): **delete the "orbit ≤ 45°" rule** from
  `research/wan22.md` lines 9 and 44 and from `KNOWLEDGE`, and replace it with the defensible half —
  **one camera move per short clip, and give the extent in words rather than degrees.** That is
  `wan22.md` validator change 6.
- If `arc*` and `orbit*` at the same implied extent score within 0.5 of each other: **drop the
  "`arc shot` works, `orbit` is the failure word" framing entirely** — it has no first-party source
  and would then have no test support either.
- If the degree number in the prompt (`约45度`) is ignored in both 45° arms: record that Wan does not
  read numeric degrees, and teach extent as prose (`小幅度弧线` vs `从背后绕行至正面`).

---

## T6 — Krea 2's length cliff

**Hypothesis.** The reference implementation's `max_length=512` is a hard conditioning ceiling and
ComfyUI does not enforce it, so output degrades **silently** somewhere above 512 — black at the top of
the ladder. Prediction: 300 OK, 480 OK, 560 degraded or OK, 640 black or noise.

**What the corpus currently claims.**
- `research/_addenda/krea-character-art.md` §New official guidance item **3** `[OFFICIAL]`: Krea's own
  `encoder.py` has `max_length: int = 512`, tokenises a `512 + 34 − 5 = 541` window, truncates
  silently, then slices off the 34-token system prefix → **512 conditioning positions**.
- Same file §Tested **A** `[TESTED — single reporter, unreplicated]`: ComfyUI issue **#14782**,
  49 OK / 512 OK / 513 OK / 576 OK / **640 black** / **674 corrupted**, one prompt, one workflow,
  the **INT8 ConvRot** checkpoint, no seed grid, no images, no maintainer reply. The corpus's own
  grading note says this is enough for "there is a cliff" and **not** enough for "the cliff is at
  exactly 640".
- 08-28 digest recommended incorporation **2**: ship the ceiling as a hard validator rule plus the
  "an auto-expander can push a working prompt over the cliff" warning.
- This test replicates #14782 on the **fp8** checkpoint most users actually run, with a different
  prompt and a fixed seed — exactly the two variables the original left open.

**How to count tokens.** Krea 2's encoder is frozen stock `Qwen/Qwen3-VL-4B-Instruct`
(`krea-character-art.md` §Tested B `[TESTED]`), so count with that tokenizer:

```python
from transformers import AutoTokenizer
tok = AutoTokenizer.from_pretrained("Qwen/Qwen3-VL-4B-Instruct")
body = open("prompt.txt", encoding="utf-8").read()
print(len(tok(body, add_special_tokens=False).input_ids))
```

That number is the **prompt body**. The final conditioning sequence adds the chat template and then
has the 34-token system prefix sliced off; issue #14782's own instrumentation shows
`raw_chars=3785 → final conditioning seq=674` for a body it reports as `token_pairs=708`, i.e. the
conditioning length is a few tokens **above** the body count, not below it. So treat the body count as
a lower bound and use the ComfyUI console/`PreviewAny` reading if you can get one. If no tokenizer is
available, the corpus's ratio for this kind of English prose is **≈5.6 characters per conditioning
position**.

**The four prompts are strictly additive** — P480 = P300 + block B, P560 = P300+B+C, P640 =
P300+B+C+D — so the only variable is length, and any change must be attributable to the added block or
to truncation. Character counts and the estimated positions they imply:

| Rung | JSON | chars | est. positions (chars ÷ 5.6) | expectation |
|---|---|---|---|---|
| ~300 | `T6-krea2-len-300.json` | 1,823 | ≈326 | clean |
| ~480 | `T6-krea2-len-480.json` | 2,710 | ≈484 | clean |
| ~560 | `T6-krea2-len-560.json` | 3,247 | ≈580 | issue #14782's last "OK" is 576 |
| ~640 | `T6-krea2-len-640.json` | 3,738 | ≈668 | black or noise if #14782 replicates |

**Run the tokenizer first.** If a rung's real count is more than ~20 positions off its label, trim or
extend the **last sentence of the final block only** and record the actual number in the results
table. The labels are targets, not measurements — I could not run the tokenizer.

**Design.** 4 conditions × 1 seed (S1); if the 640 rung is black, re-run it at S2 and S3 to confirm
it is length and not seed. `prompt_enhance` is **off** in all four files (instance
`widgets_values[1] = false`, inner node 24 = `false`) — with it on, the built-in `TextGenerate`
rewriter changes the length and destroys the test. `LLM_max_token` stays 512.

**Model files.** `krea2_turbo_fp8_scaled.safetensors` · `qwen3vl_4b_fp8_scaled.safetensors`
(CLIP type **`krea2`** — a stock Qwen3-VL CLIP will not do) · `qwen_image_vae.safetensors`.
8 steps, cfg 1, euler/simple, 1024×1024. **No reference image** in any arm: a 1 MP reference costs
~1,026 vision tokens out of the same budget (`krea-character-art.md` §Tested B), which would swamp the
variable under test.

**What to look at.** INT is the whole test. Also record: does the sampler report completion (8/8)?
Does the VAE decode? Is the file written? #14782's signature failure is **all three succeed and the
image is black** — a silent failure, not an exception.

| Rung | Measured positions | Sampler completed? | File written? | INT | Black? | Noise? | Content from the trimmed tail present? | Notes |
|---|---|---|---|---|---|---|---|---|
| ~300 | | | | | | | n/a | |
| ~480 | | | | | | | | |
| ~560 | | | | | | | | |
| ~640 | | | | | | | | |

The "content from the trimmed tail" column is the sharpest single observation available: if 640 is
*not* black but the rim light from block C and the focus note from block D are absent while blocks A
and B are honoured, then the failure is **silent truncation**, not a crash — a different and more
teachable fact than "it goes black".

**Decision rule.**
- If ~640 fails and ~480 is clean: promote to `[TESTED, replicated on fp8]` and ship the hard
  validator rule. Target: validator — **error above 512 conditioning positions**, warn above
  **2,500 characters** when no tokenizer is available, and a `GOTCHAS` card: **"Krea 2 truncates
  silently at 512 tokens and can return a black frame past ~600. An auto-expander will push you over
  it — turn `prompt_enhance` off, or cap `LLM_max_token`."**
- If ~640 is clean on fp8: the cliff is **checkpoint-specific** (#14782 used INT8 ConvRot). Rewrite the
  corpus line to say so, keep 512 as the reference cap, and downgrade "past ~600 it dies" to
  `[TESTED on int8 only]`. Record the exact positions reached.
- If the tail content is missing without any visual failure: change the teaching from "it dies" to
  **"it silently ignores everything past 512 — your last two sentences never reached the model"**,
  which is both truer and more actionable.
- Either way, add the measured positions to `research/_addenda/krea-character-art.md` §Tested A as a
  replication row.

---

## T7 — SDXL family recipes (optional)

**Hypothesis (A).** Illustrious "control tokens" are real learned tokens on v3.0-epsilon: adding
`high contrast, very bright, very sharp, very vibrant colors, very high colorfulness` measurably
changes contrast/saturation/sharpness rather than acting as generic quality fluff.
**Hypothesis (B).** A NoobAI **v-pred** checkpoint on a **karras** schedule degrades visibly (washed
or blown-out output) versus the same seed on `normal`.

**What the corpus currently claims.**
- `research/sdxl.md` §2026-09 sweep, Illustrious block `[CREATOR]` (Onoma AI lead Angelbottomless,
  2025-03-22, read via a reprint — `[LORE]` for the channel): the six control-token families verbatim,
  and *"The control token works specifically in v3.0-epsilon and v3.5-vpred model, however, v3.0-vpred
  model may not work well the token."* The only settings he states are for a v3.0-epsilon grid:
  `Sampler: Euler, Schedule type: Normal, CFG scale: 7.5`.
- Same file *Contradicts* **#7**: **nothing in our corpus mentions Illustrious control tokens at all.**
- NoobAI v-pred `[OFFICIAL]`: HF card "Other samplers will not work properly" (Euler); Civitai
  description, verbatim — *"V prediction does not support the Karras series of sampling. Therefore, we
  suggest using Euler and DDIM sampling methods for more stable outcomes."* Recommended 28–35 steps,
  CFG 4–5, plus CFG-Rescale ≈0.2. *Contradicts* **#5**: the app's `KNOWLEDGE` line 835 says "NoobAI
  v-pred bans Karras" — correct but under-warned; the safe teaching is "Euler or DDIM, never a Karras
  schedule".

**Prompts, verbatim.**

Illustrious, control tokens **on**:

```text
masterpiece, best quality, amazing quality, very aesthetic, newest, high contrast, very bright, very sharp, very vibrant colors, very high colorfulness, 1girl, solo, long black hair, red hakama, holding katana, standing on rooftop, city at night, from below, absurdres, highres
```

Illustrious, control tokens **off** (identical minus the five control tokens):

```text
masterpiece, best quality, amazing quality, very aesthetic, newest, 1girl, solo, long black hair, red hakama, holding katana, standing on rooftop, city at night, from below, absurdres, highres
```

Illustrious negative (both arms), verbatim from the corpus's Illustrious row:

```text
lowres, bad quality, worst quality, bad anatomy, sketch, jpeg artifacts, ugly, poorly drawn, censor, blurry, watermark, artistic failure, artistic error, bad proportions, bad perspective, displeasing, very displeasing, oldest, child, childish, traditional media
```

NoobAI v-pred positive (both sampler arms), using the card's own quality prefix:

```text
masterpiece, best quality, newest, absurdres, highres, safe, 1girl, solo, long black hair, red hakama, holding katana, standing on rooftop, city at night, from below, absurdres, highres
```

NoobAI negative (both arms), verbatim from the card:

```text
nsfw, worst quality, old, early, low quality, lowres, signature, username, logo, bad hands, mutated hands, mammal, anthro, furry, ambiguous form, feral, semi-anthro
```

**Design.** 4 conditions × 2 seeds (S1, S2) = **8 images**, 832×1216.
- Illustrious arms: `euler` + `normal`, 28 steps, CFG 7.5 (the creator's own grid settings).
- NoobAI arms: `euler`, 30 steps, CFG 4.5; scheduler `normal` vs `karras`.

**Model files.** Both checkpoint names are **placeholders** — set
`CheckpointLoaderSimple` (node 15, and mirror `widgets_values_named.ckpt_name`) to your local file:
- `Illustrious-XL-v3.0-epsilon.safetensors` (v3.0 EPS is **not** on the HuggingFace Onoma org; it
  lives on illustrious-xl.ai — `research/sdxl.md` §2026-09 sweep, Illustrious version inventory)
- `noobaiXL-vpred-1.0.safetensors`

⚠ **v-pred wiring, unverified.** ComfyUI normally detects v-prediction from a `v_pred` key in the
checkpoint and needs no extra node; that is `[SPECULATION]` here and was not confirmed against the
source. If both NoobAI arms come out grey/washed *equally*, the sampling type is not being applied —
add a `ModelSamplingDiscrete` node (`sampling: v_prediction`, `zsnr: true`) between the checkpoint's
MODEL output and the KSampler, re-run, and record that the node was needed. That is a graph change and
is therefore **not** pre-built here.

**Workflow JSONs.** `T7-illustrious-ctrl-on.json` · `T7-illustrious-ctrl-off.json` ·
`T7-noobai-vpred-euler-normal.json` · `T7-noobai-vpred-euler-karras.json`

**What to look at.** Illustrious arms: AES plus three measurements you can take numerically — mean
luminance, RMS contrast, and mean HSV saturation (any image tool; report the three numbers, they are
more convincing than a rubric score). NoobAI arms: INT, plus **% of pixels at exactly `#FFFFFF`**
(`research/sdxl.md` records a v-pred failure grid at **58.46%** pure white — that is the diagnostic).

| Arm | Seed | AES | INT | mean luminance | RMS contrast | mean saturation | % pure white | Notes |
|---|---|---|---|---|---|---|---|---|
| Illu ctrl on | S1/S2 | | | | | | | |
| Illu ctrl off | S1/S2 | | | | | | | |
| NoobAI euler+normal | S1/S2 | | | | | | | |
| NoobAI euler+karras | S1/S2 | | | | | | | |

**Decision rule.**
- If ctrl-on vs ctrl-off moves contrast **and** saturation in the stated direction on both seeds: add
  the six control-token families to the corpus and to `TARGETS['sdxlAnime']` as an
  **Illustrious-v3.0-epsilon / v3.5-vpred-only** vocabulary, with the creator's caveat that
  v3.0-vpred "may not work well the token" and that plain `dark` is contaminated (prefer
  `black theme`). This closes `sdxl.md` *Contradicts* #7.
- If they do not move: record control tokens as `[CREATOR, not reproduced]` and do **not** ship them.
- If karras degrades and normal does not: keep `KNOWLEDGE` line 835 but strengthen it to the card's
  own wording — **"NoobAI v-pred: Euler or DDIM only; never a Karras schedule"** — and add a hard
  validator rule keyed on `v-pred` checkpoint + `karras` scheduler.
- If **both** NoobAI arms degrade: the v-pred wiring is missing (see the warning above), the test is
  void, and the corpus gains a different and more valuable line: **"a v-pred SDXL checkpoint needs
  `ModelSamplingDiscrete` (v_prediction + zsnr) in ComfyUI; without it every sampler looks broken."**
  Verify against the loader source before shipping that.

---

## Running order & time estimate — single 24 GB GPU

Ordered to **minimise model swaps**, cheapest first so early failures are cheap. All timings are
estimates for a 24 GB card with weights already on local disk; they exclude first-load time, which
dominates the first render of each block.

| # | Block | Files | Renders | Est. GPU time | Notes |
|---|---|---|---|---|---|
| 1 | **T7** SDXL | 4 | 8 | ~5 min | 28–30 steps at 832×1216, ~15 s each. Run first: it is the cheapest and it flushes any v-pred wiring surprise early. |
| 2 | **T6** Krea 2 length | 4 | 4 (+2 if 640 fails) | ~5 min | Do the tokenizer count **before** queuing. |
| 3 | **T2-krea** | 2 | 2 | ~2 min | Same weights already resident as block 2. |
| 4 | **T1-krea2** | 3 | 9 | ~5 min | 8 steps, cfg 1 → ~15 s each. |
| 5 | **T2-qwen** | 4 | 4 | ~5 min | 20-step arms ~60 s, 8-step turbo arms ~20 s. |
| 6 | **T1-qwen** | 3 | 9 | ~12 min | Non-turbo, 20 steps, 1024². Add ~10 min if you also run a 2512 pass. |
| 7 | **T1-klein4b-base** + **T2-klein** | 3 + 4 | 9 + 4 | ~12 min | One weight set for both; do the distilled arm last (different UNet). |
| 8 | **T2-zimage** | 4 | 4 | ~4 min | Turbo arms ~10 s; Base arms ~35 s. Base needs `z_image_bf16.safetensors` downloaded. |
| 9 | **T3-zimage** | 3 | 6 | ~3 min | Same weights as block 8's Turbo arms. |
| 10 | **T3-wan5b** | 3 | 6 | ~20 min | 960×544 × 49 frames ≈ 2–3 min per clip on 24 GB. |
| 11 | **T5-wan5b** | 7 | 14 | ~45 min | Two-thirds of the Wan cost. Drop to one seed to halve it. |
| 12 | **T4-wan5b** | 6 | 12 | ~40 min | Same. |
| | **Total** | **50** | **~88** | **≈2.5–3 h GPU** | plus ~1 h for downloads, model swaps, scoring and the pixel diffs. |

**If you only have an hour**, run blocks 1–7 (T7, T6, T2, T1). That covers the two tests the 08-28
digest itself flagged as highest-value: T1 collapses three fold-in items into one rule, and T2 collapses
three per-model negative warnings into one. Wan (T3–T5) is the expensive tail and can wait.

**VRAM notes.** Nothing here is above the 24 GB envelope as configured: Wan runs at 960×544/49f rather
than the template's 1280×704/121f; Qwen and klein run at 1024² rather than 1328². If Wan OOMs, drop
node **55** `widgets_values` to `[832, 480, 49, 1]` — that is a documented parameter point and does not
invalidate any comparison, provided you change it for **every arm of that test** and say so.

---

## Reporting back

1. **Every output already carries its own recipe.** Drop each file into
   **`tools/MetaInspector.html`** (or Prompt Studio's Meta Inspector tab). It reads `prompt` (API
   graph) and `workflow` (UI graph) from PNG `tEXt`, animated-WebP EXIF, and MP4/WebM container tags;
   subgraph templates like these store the user-facing values on the instance node while the API
   `prompt` holds the effective ones, and the Inspector handles both
   (`research/_addenda/comfyui-metadata.md`).
2. **Export the recipe bundle** for each output and paste the `recipe.txt` verbatim into a new file
   `research/_addenda/test-kit/results-2026-09.md`, one fenced block per condition, headed by the
   condition's `filename_prefix`. That gives every number in the results tables an auditable
   provenance without anyone re-deriving it from the JSONs.
3. **Fill the results tables in this file's format**, in that same results file — do not edit this
   protocol file, so the hypotheses stay as written before the data existed.
4. **Record all four of these at the top** of the results file: ComfyUI version, frontend version,
   GPU + driver, and the exact quantisation of every checkpoint used. Two of the corpus's weakest
   `[TESTED]` claims are weak for exactly this reason.
5. **Note anything the Inspector shows that the JSON did not** — a re-randomised seed, a widget the
   frontend rewrote on load, a `cnr_id` implying a custom pack. Those are findings about the tooling
   and belong in `research/_addenda/comfyui-ops-2026-09.md`.
6. **Keep the black/failed outputs.** A black PNG still carries full metadata and is the primary
   evidence for T6.

---

## What could not be built from the verified templates

| Wanted | Why not | What is shipped instead |
|---|---|---|
| **Qwen-Image-2512** workflow | The 2512 checkpoint is not in `comfy-templates/` and its ComfyUI filename is not recorded in any local file; `docs.comfy.org/tutorials/image/qwen/qwen-image` documents base Qwen-Image only. Official template IDs `image_qwen_Image_2512` and blueprint `text_to_image_qwen_image_2512.json` exist per INDEX §6 but were never fetched. | Base Qwen-Image workflows plus a one-widget swap instruction (subgraph node **37** `UNETLoader`). |
| **LTX-2.5 NAG-vs-CFG-1** workflow | (a) no LTX-2.5 template in the verified set — the Comfy-Org 2.3 capture is truncated and invalid, the Lightricks 2.3 file needs `ComfyUI-LTXVideo` + `ClownSampler_Beta`; (b) inserting `NAGuidance` adds a node, outside this kit's edit budget. | Full three-arm protocol, prompt, NAG parameters and decision rule in **T2-LTX**, plus the exact 2.5 subgraph input order from `research/ltx23.md` item 5. |
| **Text negative on Z-Image Turbo / Krea 2** ("does the word *red* remove red?") | Both graphs use `ConditioningZeroOut` instead of a negative `CLIPTextEncode`; adding one is a graph change. | The **zero-out bypass probe** (node `mode` 4), which answers the *liveness* question with no added nodes. For the semantic question, add a `CLIPTextEncode` fed from the same `CLIPLoader` and wire it to the KSampler's `negative` input — one node, one link, ~60 seconds in the GUI — and re-run the T2 Z-Image arms. |
| **Z-Image Base** on its own template | `image_z_image` (non-turbo) and the flat blueprints `text_to_image_z_image_base.json` are named in INDEX §5 but not present. | The Turbo template with UNet/steps/cfg changed — legal, documented, and it shares encoder and VAE with Turbo. |
| **klein 9B**, **Wan 2.2 14B**, **Wan-Dancer**, **SCAIL-2**, **MiniMax H3** arms | Out of the brief; the 14B I2V template is present but needs a start image and its steps/cfg live behind `ComfySwitchNode` gates, which makes it a poor first test bed. | Not attempted; recorded here so nobody re-hunts it. |
| **Verified token counts for T6** | No tokenizer and no network in the authoring sandbox. | Character counts, the corpus's 5.6 chars/position ratio, and a tokenizer snippet the maintainer runs first. |
| **Anything at all rendered** | No GPU in this environment. Every "expectation" in this file is a prediction, not a result. | — |
