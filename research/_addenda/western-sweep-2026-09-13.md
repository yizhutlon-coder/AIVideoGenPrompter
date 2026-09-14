# Western sweep 2026-09-13

Agent B (Western / English-language). News window: **2026-08-28 → 2026-09-13**.
All URLs accessed **2026-09-13**. Status: COMPLETE.

Evidence labels: `[OFFICIAL]` `[STAFF]` `[TESTED]` `[LORE]` `[SPECULATION]`.
`[USER-VERIFIED]` is reserved for the instructor and is not used in this file.

## Executive summary
1. **`[STAFF]` drought broken: 3 posts, 2 vendors.** Lightricks (`art-alex`, `LTX.io org`) ×2 in
   `LTX-2.5#62`, and Comfy Org (`Lexius`) ×1 in `MiniMax-H3#50`. §4.
2. **Both v0.34.x verification jobs pass.** `taeh3` (PR #15695) and MiniMax prompt embeddings
   (PR #15697) are real; the `embedding:filename` **syntax** is now `[STAFF]`-confirmed. Note
   v0.34.0 shipped **2026-08-26**, two days *before* the window. §3a, §4a.
3. **SCAIL-2 is no longer dark — and it is NOT prompt-inert.** The vendor documents prompt
   semantics, ships a prompt enhancer, trains on long detailed prompts, and licenses under
   Apache-2.0. Our brief's "no `main` branch" rule was wrong for Hugging Face and is the likely
   cause of two zero-coverage runs. §5, §10e.
4. **Lightricks publicly rewrote a failing user prompt** — deleting tag preamble, quality tail
   and camera line, and breaking the paragraph into chronological beats. Contradicts the
   "one flowing paragraph" packaging for LTX-2.5. §4c-bis, §8e.
5. **Possible LTX-2.5 text-encoder checkpoint mismatch in-window**, unconfirmed by the vendor —
   a second confounder stacked on the enhancer confound. §4c-bis.
6. **Quiet window for open weights.** Only ComfyUI v0.35.0 (2026-09-09) confirmed shipping;
   no new in-scope open-weight model, no confirmed licence change. §1.
7. **`[TESTED]`: none cleared the bar.** §6.

---

## 1. News delta (08-28 → 09-13): releases & licence changes

**Headline: this was a quiet window for open weights.** The only in-window *release* I could
confirm on a Western surface is **ComfyUI v0.35.0** (2026-09-09), plus an unopened **v0.35.1**.
No new open-weight image or video model in scope shipped between 08-28 and 09-13 that I could
find. The movement is in tooling and in cloud tiers.

### 1a. In-window, confirmed
| Date | What | Label |
|---|---|---|
| 2026-09-09 | **ComfyUI v0.35.0** — Comfy Compiler, SenseNova U1.5 + Pixal3D support, 7 MiniMax-H3 changes, 2 new LTXV nodes, new `cfgpp_ud10_ab` sampler, Sparse Attention node | `[OFFICIAL]` |
| ≈2026-09-09 | **ComfyUI v0.35.1** exists (newreleases.io header: "latest release: v0.35.1, 4 days ago"). **Body not read.** | `[OFFICIAL]` (existence only) |
| ≈2026-09-09 | **arXiv 2609.11242** — Vid-PRE, model-agnostic video prompt rewriter (§7) | `[OFFICIAL]` (paper exists) |

### 1b. Just outside the window — confirmed, and correcting the record
| Date | What | Label |
|---|---|---|
| 2026-08-26 | **ComfyUI v0.34.0** cut. Our brief treated this as in-window; it is **2 days early**. | `[OFFICIAL]` |
| ≈2026-08-24 | `Comfy-Org/MiniMax-H3` PR #50 merged — H3 prompt embeddings published (§4a) | `[OFFICIAL]` |
| ≈2026-08-19 | `Lightricks/LTX-2.5-Diffusers` PR #14 merged — enhancer pinned to `google/gemma-4-E2B-it` (§4b) | `[OFFICIAL]` |
| 2026-08-07 | **Wan2.2-Animate-2-14B** open weights, **Apache-2.0**; Animate-2 Distillation weights same day | `[LORE]` — see caveat |
| 2026-07-10…16 | **Wan-Dancer-14B** (music-to-dance), **Apache-2.0** | `[LORE]` — see caveat |
| 2026-07-21 | **Qwen-Image-3.0** announced **closed** (§1d) | `[LORE]` |
| 2026-07-23 | **FLUX 3** announced, gated early access; open-weight dev "later in 2026", no date, no licence | `[LORE]` |

**Caveat on the two Wan rows:** the Apache-2.0 and dating claims come from secondary
aggregator blogs surfaced by search, **not** from the `Wan-AI/*` model cards themselves, which
I did not open this run (web_fetch rate limit, §10). `huggingface.co/Wan-AI/Wan2.2-Animate-2-14B`
is confirmed to **exist** as a repo. Label stays `[LORE]` until a card is read.

### 1c. Licence changes
**No licence change confirmed in-window** for any in-scope model. Two licence-adjacent findings,
both needing follow-up rather than corpus edits:
- **LTX two licence slugs** — `ltx-2.x-community-license-agreement` (on `Lightricks/LTX-2.5`)
  vs `ltx-2-community-license-agreement` (on `Lightricks/LTX-2.5-Diffusers`). Detail in §4e.
- **SCAIL-2 is Apache-2.0** `[OFFICIAL]` (§5a). Not a *change* — but the corpus has carried
  SCAIL-2 with no licence note at all, so this is new information: it is the most permissively
  licensed video model in our scope, alongside the Wan 2.2 family.

### 1d. Closed-tier releases — one line each, per scope rules
- `[LORE]` **Wan 3.0**: API-only beta, August 2026. No HF weights, no GitHub repo. ComfyUI
  added **partner API nodes** for it in v0.34.0 (#15843) and **WAN3-Prime** in v0.35.0 (#15894)
  — the nodes are *not* evidence of weights.
- `[LORE]` **Qwen-Image-3.0**, 2026-07-21: shipped with *no weights, no licence, no benchmark
  table, no parameter count, no technical report*. Advertised specs: 4,500-token prompts,
  12 languages, 20+ fonts, 10px minimum text. **Corpus note:** our Qwen-Image entry covers
  2512 / Edit-2511 open weights; 3.0 is a different animal and must not be conflated. The
  4,500-token figure is a *cloud* claim and says nothing about local Qwen-Image limits.
- `[LORE]` **FLUX 3**: announced 2026-07-23, gated. Dev weights still "planned for later in
  2026". **No change in-window.**
- `[OFFICIAL]` **MiniMax H3 "Max" / "Max Turbo"**: appear in v0.35.0 only as **partner API
  nodes** (#16025, #16094, #16041). Not local weights.

## 2. Official doc & repo changes

- `[OFFICIAL]` **`Lightricks/LTX-2.5-Diffusers` `modular_model_index.json` changed**
  (merged ≈2026-08-19, PR #14): `prompt_enhancer` and `processor` now resolve automatically to
  `google/gemma-4-E2B-it`. Full text in §4b. This is the most consequential doc change I found.
- `[OFFICIAL]` **`Comfy-Org/MiniMax-H3` gained an embeddings directory** (PR #50, +41 files,
  merged ≈2026-08-24). Repo licence shown as `minimax-h3-community-license-agreement`.
- `[OFFICIAL]` **`zai-org/SCAIL-2` README** (`wan-scail2`) documents Prompt Semantics, a Gemini
  prompt enhancer, mask semantics, and Apache-2.0. Last news entry 2026-08-06 — **no in-window
  change**. Full treatment in §5.
- `[OFFICIAL]` ComfyUI embedded docs bumped to **v0.5.11** (#15947) and workflow templates to
  **v0.11.57** (#16192) by v0.35.0. Template bumps in-window: v0.11.50 → v0.11.52 → v0.11.54 →
  v0.11.55 → v0.11.57. `[SPECULATION]` Five template bumps in two weeks is where LTXV/H3
  default prompt text most likely shifted; the templates repo is the place to diff next run.
- `[OFFICIAL]` ComfyUI `AGENTS.md` gained a **"user input tolerance"** section (#15955) and a
  model-caching section (#16003). Not prompt-related, but it is the repo telling contributors
  how forgiving node inputs should be.
- **Not reached this run:** `docs.comfy.org` (the `.md`-suffix trick is documented as working
  but the URL was outside my fetch tool's provenance gate — see §10), the Comfy blog, and the
  `Comfy-Org/workflow_templates` repo.

## 3. ComfyUI verification jobs

### 3a. v0.34.0 claims — BOTH VERIFIED DIRECTLY

Source: `https://github.com/Comfy-Org/ComfyUI/releases/tag/v0.34.0` (accessed 2026-09-13).
Release was cut **26 Aug 2026 02:09 UTC** by `github-actions`, tag commit `12d5279`. That is
**two days BEFORE the 08-28 sweep boundary** — so v0.34.0 itself is prior-window; only the
verification is new.

`[OFFICIAL]` Both changelog lines exist verbatim in the release body:

```
- Add support for taeh3. by @comfyanonymous in #15695
- feat(minimax): support prompt embeddings by @silveroxides in #15697
```

Notes that matter for the corpus:
- The decoder PR title is **`taeh3`**, not "TAESD-H3". "TAESD-H3" is our shorthand; the
  ComfyUI-side identifier is `taeh3`. Flagging so the corpus does not invent a name.
- The `embedding:` prompt-syntax claim is **one inferential step away from the primary
  source**. The release note says only "support prompt embeddings" — it does **not** state
  the `embedding:` token syntax. The `embedding:`-in-`CLIPTextEncode` phrasing came from a
  search-engine summary of the changelog, not from text I read on the release page or PR
  page. Treat the *feature* as `[OFFICIAL]` and the *exact invocation syntax* as still
  **UNVERIFIED** — PR #15697's diff is the remaining check. Do not teach
  `embedding:name.pt` for H3 until someone reads that diff or the docs page.

`[OFFICIAL]` Other v0.34.0 MiniMax-H3 lines (all in-release, verbatim):

```
- Add MiniMaxH3AddGuide for anchoring image and audio guides at any frame by @drozbay in #15439
- Allow regular single image Empty Latent Image node to be used with H3. by @comfyanonymous in #15677
- Support per-token video and audio latent noise masks on MiniMax-H3 by @drozbay in #15375
- Minimax-H3: Add missing special tokens by @kijai in #15808
```

`[OFFICIAL]` v0.34.0 also shipped `[Partner Nodes] feat(Wan): add Wan 3.0 video generation
nodes` (#15843) — **closed tier, API-only**. One line, per scope rules.

### 3b. v0.35.0 — NEW IN WINDOW (released 2026-09-09)

Source: `https://newreleases.io/project/github/Comfy-Org/ComfyUI/release/v0.35.0`
(accessed 2026-09-13). Mirrors the GitHub release body; `github.com/Comfy-Org/ComfyUI/releases`
was not reachable through my fetch tool's provenance gate (see §10).
Page also states **`latest release: v0.35.1`, "4 days ago"**.

**v0.35.1** `[LORE]` — exists, released **≈2026-09-11**, in-window. I could not reach its
release body (§10a/§10h). From third-party Docker/QNAP rebuild tags and package indexes
surfaced by search, it appears to be a **patch** carrying `comfy-aimdo 0.5.3` (DynamicVRAM) and
`comfyui-frontend 1.51.10` — i.e. no new model support. **Unverified; body still unread.**
Related, also `[LORE]` and worth knowing: `Comfy-Org/ComfyUI` **issue #16246** reports a
Windows BSOD in `dxgmms2.sys` on a 6 GB RTX 3050 *"since v0.35.0 / comfy-aimdo 0.5.3 dynamic
VRAM loading"*. If v0.35.1 is the fix, low-VRAM users on v0.35.0 may be unstable — relevant
because "my generation crashed" gets misread as a workflow/prompt problem.

`[OFFICIAL]` MiniMax-H3 changes in v0.35.0 (verbatim):

```
- MiniMax-H3: Support PDD LoRA by @kijai in #15908
- Minimax h3 controlnet as a model patch instead of a controlnet. by @comfyanonymous in #15975
- Allow using references with MiniMax-H3 Fun Union and fix prefetch rac… by @kijai in #16020
- MiniMax-H3: Make VAE optional, allow using text encoder only references by @kijai in #16065
- Support MiniMax-H3 and HiDream O1 loras trained with DiffSynth-Studio / ModelScope by @yjy415 in #15662
- Fix MiniMax H3 denoise mask velocity conversion by @poorpaper in #15988
- Remove now unecessary minimax memory workaround. by @comfyanonymous in #16103
```

The last one is a **VRAM-relevant** change: a MiniMax memory workaround was removed as
unnecessary. `[SPECULATION]` This may change the practical VRAM floor our corpus quotes
("H3 pruned-int8 runs in 12GB") — worth a re-measure, not a corpus edit.

`[OFFICIAL]` LTX changes in v0.35.0 (verbatim):

```
- Add LTXV generated-keyframe nodes and Freeze Latent by @adamoster in #16040
- Add LTXVAddLatentGuide for pinning a pre-encoded latent as a guide by @alexanderar in #16176
```

`[OFFICIAL]` New locally-runnable model support in v0.35.0 (verbatim):

```
- Support SenseNova U1.5 (CORE-411) by @T8mars in #15922
- feat: Pixal3D multiview model support (CORE-421) by @kijai in #16048
```

**SenseNova U1.5** is the one to chase — a web summary describes it as "native pixel-space
generation and multi-reference editing"; if it is open-weight it is a new in-scope image
model. I did not reach a licence page this run. **Open item.**

`[OFFICIAL]` Infrastructure worth knowing: `Introduce Comfy Compiler (CORE-389)` (#15861),
`Add Sparse Attention node` (#16072, kijai), `Add cfgpp_ud10_ab sampler.` (#15951,
comfyanonymous). A **new sampler landing in core** is a live counter-pressure on the corpus's
"no portable sampler recipe" line — it does not refute it, but the sampler menu moved.

`[OFFICIAL]` Closed-tier / API-only, one line each: `feat(WAN): add WAN3-Prime model support`
(#15894); `feat(MiniMax): add H3 Max option…` (#16025) and `H3 Max Turbo` (#16094) and
`add the Max model to the Reference node` (#16041). **H3 "Max" / "Max Turbo" are partner API
nodes, not local weights** — this is exactly the cloud-vs-local trap: any tutorial showing
"H3 Max" output is showing the hosted rewriter path, not local H3.

## 4. STAFF hunt results

**The ZERO-`[STAFF]` drought is broken.** One clean org-badged staff claim, plus two
near-misses. All HF relative timestamps converted against today 2026-09-13 and marked "≈".

### 4a. ✅ `[STAFF]` — Comfy Org, on MiniMax-H3 `embedding:` syntax

Source: `https://huggingface.co/Comfy-Org/MiniMax-H3/discussions/50` — "Upload Minimax H3
embeddings", PR #50 by `silveroxides`, opened ≈2026-08-20, **merged ≈2026-08-24** by `Lexius`.
Accessed 2026-09-13.

**`Lexius` carries the `Comfy Org org` badge on the page.** Replying ≈2026-08-25 to a
Chinese-language question ("请问这个怎么用，需要在提示词中添加触发词吗？" — how do I use this,
do I need to add a trigger word to the prompt?), verbatim:

```
@hbert To use the embeddings in a text prompt, invoke them in the CLIPTextEncode node
like this (you can omit the .pt extension): embedding:embedding_filename.pt.
```

And the PR author `silveroxides` (who also authored ComfyUI PR #15697) in the PR body,
verbatim:

```
Works like other embeddings in prompt as of commit feat(minimax): support prompt embeddings
in ComfyUI

i.e. embedding:minimaxh3_art_is_explosion
```

**This closes verification job §3a.** The `embedding:` syntax for MiniMax-H3 is confirmed by
a Comfy Org staff member on a vendor repo, with a worked example (`embedding:minimaxh3_art_is_explosion`).
Upgrade the corpus claim from "changelog extract, unverified" to `[STAFF]`.

Two consequences the corpus should absorb:
1. H3 embeddings live in the **`Comfy-Org/MiniMax-H3`** repo (License:
   `minimax-h3-community-license-agreement`, 1.76k likes, 57 community threads) and are
   invoked through **`CLIPTextEncode`** — i.e. through the normal text-conditioning path.
2. `[SPECULATION]` This is the **first portable-ish non-prose prompt token for a video model**
   in our scope. It is not weighting syntax, but it *is* a structured escape hatch inside a
   prompt string — a genuine wrinkle in the corpus's "prose only, no syntax" framing. It is
   ComfyUI-specific, not model-specific, so it does not travel to `diffusers`.

### 4b. ⚠️ Near-miss — LTX-2.5-Diffusers #14 (the assigned target)

Source: `https://huggingface.co/Lightricks/LTX-2.5-Diffusers/discussions/14` — "Add Prompt
Enhancer and Processor Modular Reference". Opened ≈2026-08-18 by `dg845`, **merged
≈2026-08-19 by `art-alex`**. Accessed 2026-09-13. Both **pre-window**.

Neither account shows an org badge in the rendered page, so I am **not** labelling this
`[STAFF]`. `[SPECULATION]` `art-alex` merging into `Lightricks/*` implies write access, i.e.
almost certainly Lightricks-side; `dg845` is a recognised `diffusers` contributor. Treat as
`[OFFICIAL]`-adjacent repo content rather than a staff statement.

**The substantive payload, `[OFFICIAL]` (it is merged repo config):**

```
This PR lets the LTX-2.5 modular pipeline automatically load the prompt_enhancer and
processor components from the google/gemma-4-E2B-it repo without needing to include its
weights in the Lightricks/LTX-2.5-Diffusers repo, by setting those components'
pretrained_model_name_or_path config in modular_model_index.json to point to the Gemma repo.
```

**The LTX-2.5 prompt enhancer is `google/gemma-4-E2B-it`.** Named, pinned in
`modular_model_index.json`, and now auto-loaded. This is a hard fact the corpus was missing.

Also from the PR's worked example, `[OFFICIAL]`:
- The enhancer is controlled by the kwarg **`enable_prompt_enhancement=True`** — an explicit,
  per-call, opt-in flag in the `diffusers` modular pipeline. Consistent with PR #1166 having
  flipped the ComfyUI default OFF on 2026-08-20.
- There is a **`DEFAULT_NEGATIVE_PROMPT`** constant importable from
  `diffusers.pipelines.ltx2.utils`, and the official example passes it:
  `negative_prompt=DEFAULT_NEGATIVE_PROMPT`. Worth chasing its literal string next run — a
  vendor-default negative prompt is directly teachable, and its existence sits awkwardly beside
  the corpus line that LTX distilled negatives are inert at CFG=1. (The example here is the
  **non-distilled** path at `num_inference_steps=30`, so no contradiction yet — but the corpus
  should be explicit that "inert" is a *distilled-only* property, not an LTX-family property.)
- Reference settings in the official snippet: `width=768, height=512, frame_rate=24.0`,
  `num_inference_steps=30`, `use_cross_timestep=True`, `seed 42`.

### 4c. ⚠️ Near-miss — LTX-2.5 #36, high-quality user bug report, NO vendor reply

Source: `https://huggingface.co/Lightricks/LTX-2.5/discussions/36` — "Prompt Enhancement
Produces Unrelated Generations in LTX-2.5 ComfyUI Workflow", opened ≈2026-08-26 by
`nafishasan60`; thread runs to ≈2026-09-07. Accessed 2026-09-13.
**Lightricks has not replied in 18 days.** Eight community comments, zero badged accounts.

This is the single most corpus-relevant community thread I found. It is `[LORE]` — the OP
gives a full config but **no seeds and no controlled grid**, so it does **not** clear the
`[TESTED]` bar. Details in §6 and §8.

### 4c-bis. ✅✅ `[STAFF]` — **Lightricks (`art-alex`, `LTX.io org`) on LTX-2.5 prompt construction**

**This is the most valuable single source in the sweep.** Thread:
`https://huggingface.co/Lightricks/LTX-2.5/discussions/62` — "Any chance for a bigger text
encoder (e.g. Gemma 4 26b) for the next version?", opened ≈2026-08-30 by `kabachuha`, running
to ≈2026-09-08. **Entirely in-window.** Accessed 2026-09-13.
**`art-alex` carries the `LTX.io org` badge** — this is Lightricks speaking.

#### `[STAFF]` claim 1 — the official repro request, with the official pipeline
`art-alex`, ≈2026-09-04, asked for `prompt and your setup` and posted the canonical local
invocation. Key detail the corpus should hold: **the LTX-2.5 text encoder file is
`gemma4-12b-with-proj-ltx-2.5-bf16.safetensors`** — Gemma 4 **12B**, with a projection layer,
distinct from the **E2B** enhancer of §4b. The staff example runs `--num-frames 121 --seed 42`.

#### `[STAFF]` claim 2 — Lightricks rewrites a user's failing prompt. **Read this one closely.**
`kabachuha` reported "extremely huge problems with object permanence" using the stock ComfyUI
"LTX 2.5 Image2Video" template. His prompt began with a tag-soup preamble and a camera
specification, verbatim:

```
sound-driven video, audio-reactive motion, continuous visual flow

A cinematic top-down overhead shot of the black Lada car from the image. Suddenly, dark brown
fizzy cola starts pouring out of all the windows and doors like a waterfall. An anthropomorphic
fluffy brown bear wearing a t-shirt quickly opens the door and climbs inside. The car then
violently accelerates, performing a sharp, aggressive drift on the gravel road, leaving smoke
and tire tracks, and finally crashes head-on into the green bushes on the side of the road.
High dynamic range, realistic physics, splashes of liquid, flying debris from the bushes.
```

`art-alex` (`LTX.io org`), ≈2026-09-04, verbatim:

```
The prompt that you provided is indeed tricky and doesn't produce good results as it is.
But with very minor changes (even without prompt enhancement) on a default ComfyUI I2V template
the model produced a decent and accurate result.
```

The staff rewrite, verbatim:

```
The car is peacefully parked at the side of the road when suddenly, dark brown fizzy cola
starts pouring out of all the car's windows and doors.

An anthropomorphic fluffy brown bear wearing a t-shirt quickly approaches the car from the
left, opens the front door and climbs inside the driver seat.
The car violently accelerates, performing a sharp, aggressive drift on the gravel road,
leaving smoke and tire tracks.
After a short drive the car looses control and crashes head-on into the green bushes on the
left side of the road.
```

**This is a vendor-authored before/after and it is worth an entire corpus lesson. What
Lightricks actually changed, calling it "very minor":**
1. **Deleted the tag-soup preamble** (`sound-driven video, audio-reactive motion, continuous
   visual flow`). Gone entirely. `[STAFF]`-adjacent support for "quality/modifier tag strings
   are retired" — on LTX at least, the vendor's own fix begins by deleting them.
2. **Deleted the trailing quality tail** (`High dynamic range, realistic physics, splashes of
   liquid, flying debris from the bushes.`). Also gone. Note this cuts **against** §8b's
   ZIT "quality tail" advice — confirming the corpus's instinct that tails are model-specific,
   not universal.
3. **Deleted the camera specification** (`A cinematic top-down overhead shot`). Interesting
   given the corpus's "avoid 'cinematic'" line for Wan — here a vendor silently drops
   "cinematic" from an LTX prompt too.
4. **Broke one dense paragraph into one beat per line**, in strict chronological order.
5. **Added an establishing state** — "The car is peacefully parked at the side of the road
   **when suddenly**…" The original jumped straight to the event. Giving the model a *before*
   state precedes giving it a *change*. This mirrors the H3 checklist's "what exists at the
   beginning?" (§6c) from a completely independent source.
6. **Added spatial specificity** — "approaches the car **from the left**", "climbs inside the
   **driver seat**", "into the bushes on the **left side** of the road". Vague became directed.
7. **Added a connective beat** — "**After a short drive** the car looses control and crashes",
   where the original had "and finally crashes". Transitions got explicit duration.

`[SPECULATION]` The unifying principle: **replace atmosphere with chronology and geometry.**
The original was a mood board; the rewrite is a shot list. That is a cleaner statement of the
corpus's declarative-caption position than anything currently in it, and it comes with a
vendor's name on it.

Honest caveat: `art-alex` posted a result video but **no seed and no A/B grid**, and
`kabachuha` immediately pushed back that the result was "a bit cheating as the car turns on the
side where there are no other vehicles". So this is `[STAFF]` **advice**, not `[TESTED]`
**evidence**. Label it that way.

#### 🚨 `[LORE]` — a possible LTX-2.5 text-encoder checkpoint mismatch **inside our window**
`kabachuha`, ≈2026-09-04, on the recent text-encoder upload
(`https://huggingface.co/Lightricks/LTX-2.5/commit/1b92891cedc4a823c35a3b23588d7a57a3a23c65`),
verbatim:

```
They uploaded an entire wrong checkpoint, which was not synchronized with the video model,
resulting in artifacts and really weird prompt following
```

Another user (`Ravan`) independently noticed the silent swap: *"Didnt understand why they
uploaded new text encoder and didnt gave us any details."* **Lightricks did not confirm or deny
this in-thread.**

**If true this is a second confounder stacked on the enhancer confound.** Our corpus already
voids 08-11→08-20 LTX verdicts because the enhancer defaulted ON. This suggests a further
window in which the *text encoder itself* may have been mismatched to the transformer —
producing exactly the symptom ("really weird prompt following") that a prompt researcher would
otherwise attribute to the prompt. **Action: date that commit, and quarantine any LTX-2.5
prompt verdict recorded after it until the encoder version is pinned.** Unverified, vendor
silent, but high-consequence.

#### `[LORE]` — the strongest community contradiction of "one flowing paragraph"
`Andyx1976`, ≈2026-09-05, an unusually experienced-sounding user. Verbatim, emphasis his:

```
You just have to FORGET! the idea everything has to be in "one flowing paragraph". This isn't
z-image and a video has things that happen after each other. If the text encoder has to extract
what you want from a cumbersome "flowing paragraph" it very quickly fails
```

```
What you do is press enter after every section of the video. You can probably do "shot 1:
shot 2:" and so on but its not even needed.
```

```
2.3 and 2.5 It can do quite long videos (up to 40s in my experience) with a proper step by step
prompt (created by a llm). The trick is to give it enough things to do, enough steps to fill
that time. If it has not enough to do for the video length, it freaks out completely. It is
MUCH worse at filling the gaps by itself than H3 or Wan2.2.
```

**Note that this independently corroborates the `[STAFF]` rewrite above** — Lightricks' own fix
was exactly "press enter after every section". Two independent sources, one of them the vendor,
converging on **line-broken chronological beats over a flowing paragraph, for LTX**. That is
strong enough to act on. See §8e.

More `[LORE]` from the same author, each useful and each untested:
- *"i remember the official guide for ltx2.0: Don't prompt 'abstract' concepts like 'sad',
  prompt every face muscle movement instead"* — and he says 2.5 is better but still behind H3
  and Wan 2.2 on world understanding. Cited official LTX blog post, **not fetched**:
  `https://ltx.io/blog/prompting-long-shots-with-ltx-2-how-to-build-20-second-cinematic-moments`.
  **Chase this next run — it is a first-party long-shot prompting guide.**
- Duration ceilings: **"1025 frames or about 41 seconds does work"** on LTX-2.5;
  **"i found 22secs is the H3 limit"**. Neither figure is in our corpus.
- On prompt enhancers generally: *"A prompt enhance is only as good as it's system prompt."*
  He argues the stock LTX enhancer is built for one-shot 5–10s clips and therefore actively
  sabotages long-video prompts — *"The model has simply no idea what to do in all the frames."*
  A precise, mechanistic account of when expansion hurts. Consistent with the corpus's
  "expansion helps only when underspecified", and sharpens it: **expansion tuned for the wrong
  duration is worse than none.**
- Gemma 4 12B is *"explicitly named 'experimental'"* (kabachuha) and both users call the
  small Gemma 4 vision variants poor at captioning — `sudo-0x2a` adds *"Its tokenizer and
  chat-templet was broken."* `[SPECULATION]` If the enhancer (E2B) and encoder (12B) are both
  weak Gemma 4 variants, §6b's enhancer-garbage reports have a plausible mechanism.
- **H3's local text encoder is ~30–32B Qwen3**, and `ComfyUI-ClipProj`
  (`https://github.com/nicolab28/ComfyUI-ClipProj`) reportedly swaps it for Qwen3-VL 8B or 4B
  by ridge regression on embeddings — *"Works a charm. At least 8b."* `[LORE]`, unverified,
  but directly relevant to the corpus's H3 VRAM claims. **New lead.**

### 4d. Discussions tabs actually checked (per the absence-claim rule)

| Repo / thread | Reached? | `[STAFF]` found? |
|---|---|---|
| `Comfy-Org/MiniMax-H3` **#50** | yes, full thread | **YES — `Lexius`, `Comfy Org org`** |
| `Comfy-Org/MiniMax-H3` discussions index (57 threads) | header only, not enumerated | — |
| `Lightricks/LTX-2.5-Diffusers` **#14** (assigned) | yes, full thread | no badge shown |
| `Lightricks/LTX-2.5-Diffusers` index (10 threads) | header only | — |
| `Lightricks/LTX-2.5` **#36** | yes, full thread | no — **vendor silent** |
| `Lightricks/LTX-2.5` **#62** | yes, full thread | **YES — `art-alex`, `LTX.io org`, ×2 posts** |
| `Lightricks/LTX-2.5` **#38** (referenced from #62) | **not opened** | unknown — open item |
| `Lightricks/LTX-2.5` index (now 64 threads) | header only | — |
| `Wan-AI/*`, `black-forest-labs/*`, `Qwen/*`, `Tongyi*`/Z-Image, `zai-org/*` discussions | **NOT REACHED this run** | unknown |

Honest scoping: I confirmed **three** `[STAFF]` posts across **two** vendors (Comfy Org ×1,
LTX.io ×2). I did **not** sweep the Wan-AI, BFL, Qwen, Tongyi/Z-Image or zai-org discussion tabs
at all — those remain unsearched, not empty.

**Method note for future runs:** the winning move was to open threads whose *titles* sounded
like architecture complaints rather than usage questions. #62 is titled "Any chance for a bigger
text encoder…" — nothing about prompting — and it contains the sweep's best prompt-construction
evidence. Vendor staff answer *challenges*, not *how-do-I* questions.

### 4e. Licence-string discrepancy spotted in passing — worth a look

`[OFFICIAL]` The two LTX-2.5 repos declare **different licence identifiers** on their headers
(both accessed 2026-09-13):

| Repo | Licence string shown |
|---|---|
| `Lightricks/LTX-2.5` | `ltx-2.x-community-license-agreement` |
| `Lightricks/LTX-2.5-Diffusers` | `ltx-2-community-license-agreement` |

`[SPECULATION]` Probably a versioned-licence rollout that has not been applied uniformly rather
than two different legal documents — but our corpus states the LTX terms as a single thing
("free under $10M ARR"), and there are now **two distinct licence slugs** in play. Someone
should diff the two documents before the corpus asserts a single revenue threshold.

Also noted: both LTX-2.5 repos rendered their **Model card / Files / Community tabs normally**
to a logged-out server fetch, with **no gated-repo consent card visible on the discussion
pages**. Our brief says `Lightricks/LTX-2.5` is gated. I did **not** fetch the model-card root
itself, so this is *not* evidence the gate was lifted — discussion pages may simply sit outside
the gate. **Do not update the "gated" note on this basis.** Re-check the repo root next run.

Both LTX-2.5 repos cite **arxiv: 2601.03233** and tag **9 languages**.

## 5. SCAIL-2 from scratch

**Two prior runs of zero coverage — this run broke the drought.** The blocker was a wrong
assumption in our own brief (see §10): the *GitHub* repo has no `main`, but the *Hugging Face*
repo **does**.

Primary source read in full: `https://github.com/zai-org/SCAIL-2/blob/wan-scail2/README.md`
(accessed 2026-09-13; 515 lines / 25 KB; repo `zai-org/SCAIL-2`, 1.2k stars, 89 forks,
12 open issues).

### 5a. Identity, licence, provenance
`[OFFICIAL]` Full title: *"SCAIL-2: Unifying Controlled Character Animation with End-to-end
In-Context Conditioning."* Authors Wenhao Yan, Fengjia Guo, Zhuoyi Yang, Jie Tang.
arXiv **2606.10804**. Project page `https://teal024.github.io/SCAIL-2/`.

`[OFFICIAL]` **Licence: Apache 2.0.** Verbatim:

```
This project is licensed under the Apache License 2.0 - see the LICENSE file for details.
```

That is materially more permissive than LTX's ARR-gated licence or MiniMax H3's
territory-excluding licence. Worth stating plainly in the corpus: SCAIL-2 is one of the
*least* encumbered in-scope models.

`[OFFICIAL]` Built on **Wan 2.1** ("Our implementation is built upon the foundation of
Wan 2.1"), ships **Wan2.1_VAE.pth** and **umt5-xxl** inside the checkpoint, and was trained on
**MotionPair-60K** synthesised using SCAIL-Preview + **Wan-Animate** + MoCha. So SCAIL-2's
text pathway is a **UMT5-XXL encoder**, same family as Wan 2.2 — relevant to any claim we make
about how its prompts behave.

`[OFFICIAL]` Branch map (this is the thing that kept defeating prior runs):
- `wan-scail2` — default; inference, `generate.py`, safetensors path.
- `sat-scail2` — training entrypoints + configs; DPO LoRA reproduction.
- **No `main`** on GitHub. **HF `zai-org/SCAIL-2` DOES resolve `/blob/main/…`** — the README
  itself links `https://huggingface.co/zai-org/SCAIL-2/blob/main/model/relighting-lora.pt`.
- ModelScope mirror: `https://modelscope.cn/models/ZhipuAI/SCAIL-2`.

### 5b. News timeline (from the repo's own 📰 News block, verbatim)

```
- 2026.08.06: Training code released! See Training and the sat-scail2 branch.
- 2026.07.15: Relighting LoRA for replacement mode released!
- 2026.06.17: Multi-reference support landed in ComfyUI (PR #14509).
- 2026.06.13: Multi-reference inference released.
- 2026.06.09: ComfyUI integration now available (PR #14373).
- 2026.06.09: Model & inference code open-sourced.
```

**Nothing in the 08-28 → 09-13 window.** Latest repo news is 2026-08-06. So: SCAIL-2 is
*documented*, not *dark* — but it is also **not moving** in this news window.

### 5c. SCAIL-2 IS NOT PROMPT-INERT — direct contradiction of a corpus position

This is the highest-value finding of the sweep. The corpus says *"SCAIL-2 / Wan-Animate are
prompt-inert."* The official README has an entire **"Prompt Semantics"** section that says the
opposite. Verbatim `[OFFICIAL]`:

```
For both animation and character replacement, --prompt should describe the generated video
itself. It should not be an instruction to the model.

For replacement tasks, the prompt should describe the video after replacement has already
happened. For better results, describe the replacement character's visible clothing and
appearance, and include objects the character interacts with or stays close to in the video,
such as tools, instruments, chairs, tables, vehicles, doors, or handheld items.
```

And verbatim `[OFFICIAL]`, from the Single-GPU Inference section:

```
Note that SCAIL-2 is trained with long, detailed prompts. Short prompts or an empty prompt
can run, but detailed descriptions of the reference subject and motion usually produce
better results.
```

Three teachable claims fall straight out of this, all `[OFFICIAL]`:
1. The prompt is a **description of the output video**, never an instruction. ("It should not
   be an instruction to the model.") This is the same declarative-caption discipline the corpus
   already teaches for Wan — consistent, and now vendor-stated for SCAIL-2 too.
2. For **replacement mode**, write the prompt in the **post-replacement** state — describe the
   scene as if the swap already happened. That is a genuinely non-obvious, vendor-specific
   rule and it is nowhere in our corpus.
3. A concrete content checklist is given: **clothing + appearance + interacted/proximate
   objects** (tools, instruments, chairs, tables, vehicles, doors, handheld items).

Official example prompts, verbatim, showing the register:
```
--prompt "The girl is dancing"

--prompt "A blond white male wearing a black suit, trousers, and leather shoes is playing the
violin on the street while pedestrians walk past him."

--prompt "An anime style character with yellow hair, wearing a white and green sailor uniform
and a green skirt, is dancing in a warm anime-style classroom."
```
Note the shape: **subject front-loaded**, then clothing, then action, then setting. That is
*consistent* with the corpus's front-load-the-subject position, and it is prose, not tags.

**Recommended corpus action:** amend "SCAIL-2 is prompt-inert" to "SCAIL-2 is
prompt-*sensitive* but low-leverage relative to the mask/driving-video inputs; the vendor
documents prompt semantics and trained on long detailed captions." Do not simply delete the
old line — I have **no `[TESTED]` evidence** that prompt changes visibly move SCAIL-2 output.
What I have is the vendor contradicting our characterisation. That is enough to retract the
absolute claim, not enough to assert the converse magnitude.

### 5d. SCAIL-2 has an official prompt enhancer — and it is a CLOUD rewriter

`[OFFICIAL]` `prompt_enhancer.py`, Gemini-based, for replacement mode. Verbatim:

```
We provide an optional Gemini-based helper, prompt_enhancer.py, to turn a short replacement
instruction into a positive prompt for generate.py. The helper samples frames from the source
video, reads the replacement reference image, uses few-shot examples from prompt_examples.txt,
and outputs a long English description of the replaced video.
```

Requires `pip install google-genai` and `export GEMINI_API_KEY=...`. It takes `--instruction`
("replace the man in the blue jacket in the video with the person in the image") and emits a
long English description to `--output`, which is then passed to `generate.py --prompt`.

**CLOUD-VS-LOCAL FLAG.** This is a rewriter, but an unusually *honest* one: it is
**out-of-process, opt-in, off by default, and its output is a file you can read** before it
reaches the model. Contrast with MiniMax H3 Context-IR and 通义万相, which rewrite invisibly
server-side. Pedagogically this is a **great teaching artefact**: it makes the
instruction → description transformation legible. `prompt_examples.txt` is the few-shot style
file and is user-editable — verbatim: *"Add more examples there if you want the enhanced
prompts to follow a different level of detail or wording."*

`[OFFICIAL]` Note the enhancer's contract also restates rule (2) above: its output is "the
positive generated-video description", and it is "instructed to include useful SCAIL-2 prompt
details such as the replacement character's clothing and objects the character interacts with."

### 5e. Non-prompt SCAIL-2 facts worth having
`[OFFICIAL]` Resolutions: end-to-end driving supports **512p and 704p**; **pose-driven performs
better at 704p**; H and W must both be divisible by 32 (e.g. 704*1280).
`[OFFICIAL]` Sampling defaults: `--sample_steps 40`, `--sample_shift 3.0`,
`--sample_guide_scale 5.0`, `--sample_solver unipc` (or `dpm++`).
`[OFFICIAL]` With a Lightx2v step-distill LoRA the documented recipe is `--sample_steps 8
--sample_shift 1 --sample_guide_scale 1.0`. **CFG=1** — so at that setting SCAIL-2 inherits the
same "negatives are inert by construction" property the corpus already teaches for LTX
distilled. Same physics, different model. Worth generalising the lesson.
`[OFFICIAL]` Mask semantics are the real control surface: Black = background not visible,
White = background should be visible, Colour = correspondence between character regions and
driving motion. Verbatim: *"Without a correct mask Animation mode collapse into
Replacement-Mode behavior in certain inputs."* `[SPECULATION]` This is probably why SCAIL-2
*reads* as prompt-inert in practice — the mask dominates.
`[OFFICIAL]` Python 3.10–3.12 inclusive. Apache-2.0. MotionPair dataset subset is
**gated behind a Google Form**, not an open download.

### 5f. Surfaces checked for SCAIL-2 (per the absence-claim rule)
| Surface | Result |
|---|---|
| `github.com/zai-org/SCAIL-2` README @ `wan-scail2` | **HIT** — read in full |
| GitHub branches `sat-scail2`, `wan-scail2` | Confirmed to exist via README links |
| `huggingface.co/zai-org/SCAIL-2` | Exists; `/blob/main/` **resolves** (README links into it) |
| HF `/tree/main/model/1` | Exists (search index) |
| ComfyUI core PRs #14373, #14509 | Confirmed via README; both pre-window (June 2026) |
| arXiv 2606.10804 | Confirmed as the paper ID |
| ModelScope `ZhipuAI/SCAIL-2` | Mirror confirmed |
| Civitai / civarchive | **Not reached this run** — still open |
| HF discussions tab for `zai-org/SCAIL-2` | **Not reached this run** — still open |
| `inferencebench.io/models/zai-org/scail-2/`, `deepwiki.com/zai-org/SCAIL-2` | Indexed, not opened |

Community-tooling leads found in the README, unverified `[LORE]`:
`https://github.com/wuwukaka/ComfyUI-WanAnimatePlus` and
`https://github.com/user2318/ComfyUI-CustomNodeKit/` — both credited by the vendor for
multi-reference workflows, and `https://github.com/fengjia-guo/SCAIL-2-Tuner` for
"VRAM-friendly" training.

## 6. Tested findings

### 6a. Verdict: **none cleared the `[TESTED]` bar this run.**

I found no source in the window that published seeds **and** a controlled grid **and** held
variables fixed. Everything below is labelled honestly as short of it.

### 6b. Best near-miss — LTX-2.5 prompt-enhancer failure report `[LORE]`

`https://huggingface.co/Lightricks/LTX-2.5/discussions/36`, OP `nafishasan60`, ≈2026-08-26,
accessed 2026-09-13. **Why it misses:** the OP gives a complete hardware/model config and an
explicit A/B (enhancement ON vs OFF) but **no seed, no grid, and no count of runs** — he only
says "I can reproduce cases". He *offers* the missing rigour ("I'm happy to provide the
workflow, exact model filenames, seeds, prompts, screenshots or generated videos") and nobody
took him up on it. So: a well-specified anecdote, not a test.

Config quoted verbatim:

```
- LTX-2.5 22B Distilled transformer
- 1280×720
- 24 FPS
- 10-second generation
- LTX-2.5 video VAE conv BF16
- LTX-2.5 latent spatial upscaler
- Gemma 4 12B LTX-2.5 text encoder
- gemma4_e2b_it_bf16.safetensors as the prompt enhancement model
```

That config line is itself valuable `[LORE]`: it separates the **text encoder (Gemma 4 12B)**
from the **prompt-enhancement model (`gemma4_e2b_it_bf16`)** — two different Gemma 4 models in
one pipeline. The enhancer file name matches the `google/gemma-4-E2B-it` repo pinned
`[OFFICIAL]` in PR #14 (§4b). Encoder and enhancer corroborate across two independent sources.

The reported failure, paraphrased (full prompts are in the thread): a detailed aerial
mountain-road/red-sports-car prompt rendered correctly with enhancement OFF, and with
enhancement ON produced instead a close-up of a man and woman outdoors — road, car and aerial
landscape all absent. A second, unrelated cartoon-cat prompt likewise became a photorealistic
forest hike with enhancement ON. Verbatim summary from the OP:

```
Disabling Prompt Enhancement consistently gives me much better adherence to the original
prompt.
```

**Two competing community explanations, both `[LORE]`, neither verified:**

`Tiwaz`, ≈2026-08-26, verbatim:
```
it not their fault, blame ComfyUI, depending on settings ComfyUI freaks and the LLM outputs
no text, you can check it with the preview text node.

So when you turn of prompt enhancement if works because it has a prompt.
When the LLM fails in it has zero prompt.
So totally expected.
```

`Insidious-One`, ≈2026-08-28 (in-window), verbatim:
```
The T2V sees the last used image file and injects it into the enhanced prompts first sentence.
If your last I2V reference was a kitchen table scene and your new T2I is the inside of an
airplane, the enhanced prompt will say something like, "initially the scene begins in the
kitchen and then cuts to an airplane..." To stop this, I drop a blank image into the I2V
"Load First Frame" node and it ignores it and proceeds with a typical T2V prompt. It's not a
fix but at least a work around.
```

These are **mutually exclusive** (empty-prompt failure vs stale-image contamination), and the
second would be a genuine state-leak bug. `jesselivengood`, ≈2026-09-04 (in-window), posted a
third mode entirely: the enhancer emitting a wall of non-language garbage
(`,GEtYVOMUCZNlTDIRLPKBkfXFnmvdJERE_…`) on "todays newest stable desktop build", and separately
noted that pointing at the *wrong enhancer model* was part of his problem.

**Teachable, and the reason this thread matters more than its rigour deserves:** every one of
these is a *pipeline* failure, not a *model* failure. The corpus's rule that the LTX-2.5
enhancer confounds all 08-11 → 08-20 verdicts should be widened: an enhancer can confound a
verdict not only by improving the prompt but by **emptying it, contaminating it with stale
state, or corrupting it into noise** — and in all four cases the user sees "the model ignored
my prompt". The actionable diagnostic is the one `Tiwaz` names: **put a preview-text node on
the enhancer output and read what actually reached the encoder.** That is a genuinely good
teaching move and it costs nothing.

`[SPECULATION]` The fact that Lightricks has not answered an 18-day-old, well-written,
reproducible-sounding adherence report on their own flagship repo is itself informative about
how much vendor support the enhancer path has.

### 6c. Civitai H3 structured-prompt guide `[LORE]`, **and a cloud-vs-local trap**

`https://civitai.com/articles/34646/…` by `AISeedance25`, **published 2026-08-30 — in window**,
accessed 2026-09-13. Zero-rigour by our standard: no seeds, no A/B, no negative controls, and
it terminates in a referral link to `minimax3.org` (self-declared: "an independent MiniMax H3
resource and is not the official MiniMax website"). Treat as **marketing-adjacent `[LORE]`**.

**CLOUD-VS-LOCAL FLAG — this is the important part.** The five worked examples use
multi-video reference roles ("Use Video 1 for all subject motion… Replace only its green
background with the fairytale environment from Video 2"), 4 sequential keyframe images, and
15-second durations. Those are **hosted-tier H3 capabilities**. Our corpus position is that
**H3 local = 768p, Context-IR and 2K are API-only**. Nothing in this article demonstrates local
H3 behaviour, and its "why it works" rationales are therefore rationales about **the server-side
rewriter**, not about the local model. Do not import its claims into the corpus as model facts.

What is still worth extracting, as a *format* claim to be tested locally (§8c):

```
integrated_multimodal_description:

[Shot 1] Subject, action, setting, framing and camera behavior.

overall_soundscape:

Physical and environmental sounds.

non_diegetic_music:

Audience-only music, or N/A.
```

plus a trailing `AVOID: …` line in every example. And the author's own framing, verbatim:

```
MiniMax H3 prompts work best when they read more like a production plan than a pile of
visual adjectives.
```

```
One of the biggest improvements you can make is to describe observable changes instead of
stacking more adjectives.
```

The "observable changes, not adjectives" line is **consistent** with the corpus's
retired-quality-suffix position and with the declarative-caption discipline. That part I would
teach. The keyed-field syntax and `AVOID:` I would not teach yet — see §8c.

### 6d. Second Civitai lead, pre-window `[LORE]`

`https://civitai.com/articles/33552/…` by `CongXS`, **2026-08-06**, accessed 2026-09-13.
Claims, verbatim:

```
MiniMax just released the official H3 Prompt Writing Skill — and it changes how you write
video generation prompts.
```

```
I walk through the h3-prompt-writing skill that automatically rewrites your natural language
requests into H3's structured prompt format. It covers all 5 generation modes: T2VA, I2VA,
FL2VA, L2VA, and Ref2VA.
```

The article body is a YouTube embed with no text detail, so this is a **pointer, not evidence**.
But if MiniMax really publishes an **official `h3-prompt-writing` skill** that emits a
structured format, that is a first-party specification of H3's prompt grammar and it would
settle §8c decisively. **Highest-value open lead from this sweep.** The five mode names
(T2VA / I2VA / FL2VA / L2VA / Ref2VA — note the trailing **A** for audio) are new to our corpus.
Likely a Chinese-surface artefact; worth handing to Agent A.

### 6e. The one source with **visible methodology** — civarchive derivative page

`https://civarchive.com/models/2918791?modelVersionId=3302228` — *KreaAlex - MiniMax H3 Style
LoRA ep50*, by `hoodtronik`. Published **2026-09-06 — in window**. Accessed 2026-09-13.

This is the only thing I found all sweep that states seeds and held-constant variables.
Verbatim methodology, quoted as required:

```
Samples: the same three sketch storyboards and prompts are used for every LoRA in this series
(street arrival, a letter across a tavern table, read-and-rise to the window) with two
characters from this LoRA's own dataset - compare them across the series to see how each LoRA
interprets the same scene. H3 renders at 480p, 6 s, seed 77, audio stripped.
```

**Fixed seed (77), fixed prompts, fixed storyboards, fixed resolution/duration, one variable
(the LoRA), and an explicit cross-series comparison design.** That is a real controlled
protocol. I am still **not** stamping it `[TESTED]` for our purposes, for one reason: the
controlled variable is the **LoRA**, not the **prompt**. It tells us nothing about prompt
behaviour. It is `[TESTED]`-grade evidence about *a question we are not asking*. Recording it
because the protocol is the model of what we should demand, and because the incidental facts
below are useful.

Incidental `[OFFICIAL]`-on-its-own-page facts (`[LORE]` as claims about H3 generally):
- **"Trigger word: bradhamstyle (put it first in the prompt). Strength 1.0."** An independent
  community practitioner asserting **position-in-prompt matters** for H3 — mild support for the
  corpus's front-load/order-carries-emphasis position, from a surface unrelated to our usual ones.
- **"Base: MiniMax H3 (fl2va)"** — LoRAs are being cut against specific H3 *modes*, matching the
  five-mode naming (T2VA/I2VA/FL2VA/L2VA/Ref2VA) seen in §6d. Mode-specific, not universal.
- **"Loads in ComfyUI with `LoraLoaderModelOnly` (the file must sit in `models/loras/`)."**
- **"H3 renders at 480p"** in this author's setup — *below* the 768p our corpus quotes as the
  local ceiling. Not a contradiction (768p is a max, not a mandate), but a reminder that
  community H3 samples are often well under it.
- Training recipe, verbatim: `rank 8, LR 2e-4, 50 epochs, blocks 0-3,6-47, adamw, shift 0.6667`,
  trained with Fizgig "MiniMax H3 Style (LoRA 8)", on a **150-image Krea 2 dataset** —
  i.e. **Krea 2 output being used as training data for an H3 video LoRA**, with
  "cinematic shot vocabulary in every caption".
- Usage claim `[LORE]`: *"give H3 a pencil-sketch storyboard plus character references and let
  the LoRA fill in the look. With a photoreal start frame it mostly reinforces what is already
  there."*

**Access finding (important, see §10):** this model's CivitAI **Platform Status is "Deleted"**,
deleted **9/6/2026 — the same day it was published** — and civarchive reports *"Looks like we
don't have an active mirror for this file right now."* Downloads: 8. So the *metadata* survives
on civarchive while the *artefact* does not. This is exactly why the derivative pages are worth
mining and why "I couldn't find it on Civitai" means nothing.

## 7. arXiv

Method note: arXiv's 2026 IDs are `26MM.NNNNN`, so the in-window range is **2609.\***. General
web search resolves "September 2026" to 2509.* (2025) unless forced, which is how prior sweeps
may have missed things. Searching on `2609` explicitly is the trick.

### 7a. NEW, in-window: **arXiv:2609.11242** `[OFFICIAL]`
*From Evaluation to Enhancement: Benchmarking and Improving Think-with-Video Reasoning for
Video Generative Models.* Submitted **10 Sep 2026**, v1, 46 pages / 41 figures,
**accepted to ECCV 2026**, CC-BY-4.0. `https://arxiv.org/abs/2609.11242` (accessed 2026-09-13).
Authors: Meng Luo, Yicheng Liu, Jiahao Wang, Yuanxing Zhang, **Xin Tao, Pengfei Wan, Kun Gai**,
Hao Fei — i.e. **the Kling / Kuaishou video team**. Data and code at
`https://huggingface.co/datasets/KlingTeam/VWG-Bench`.

Two artefacts: **VWG-Bench** (9 reasoning dimensions, 38 fine-grained tasks, three-level
VLM-as-Judge separating video-level fluency / task-level rule adherence / sample-level goal
realization) and **Vid-PRE**, a prompt rewriter. Verbatim from the abstract:

```
Evaluations of leading models reveal a striking gap: while models achieve strong rendering
scores, they consistently fail on logic-heavy and rule-constrained tasks.
```

```
we propose Vid-PRE (Video Prompt Reasoner and Enhancer), a model-agnostic prompt rewriter
that offloads the cognitive burden of reasoning to a dedicated VLM. Trained via reinforcement
learning with purely text-based rewards, Vid-PRE produces concise, constraint-aware prompts
without the instability of video-level reward signals.
```

**Why this matters to us, three ways:**
1. `[OFFICIAL]` It independently states the split our corpus already teaches for Wan 2.2 —
   strong rendering, weak semantic/rule fidelity — and generalises it to "leading models"
   plural. That **supports** the corpus position and extends its scope.
2. The rewriter's stated output is **"concise, constraint-aware"**. Note *concise*. Most
   rewriters in the wild (LTX's Gemma enhancer, 通义万相, Context-IR) *expand*. A paper from a
   major video lab arguing that the useful rewrite is a **shortening toward constraints**
   rather than an inflation toward adjectives is a real data point for the corpus's
   "expansion helps only when underspecified AND the rewriter can't invent" line — and
   arguably strengthens it.
3. `[SPECULATION]` "Offloads the cognitive burden of reasoning to a dedicated VLM" is an
   admission that the generator's text encoder does not reason. That cuts against the naive
   reading of "write prose because the encoder is an LLM" — the encoder being an LLM does not
   mean it *reasons* over the prompt. See §8a.

**Not read:** full text, the VWG-Bench task taxonomy, and which generators were evaluated.
Abstract only. Do not quote numbers from this paper until someone reads it.

### 7b. In-scope leads found but **not opened** (titles + IDs only)
- **arXiv:2608.20749** — *Identity-Preserving Text-to-Video Generation via Agentic Enhancement
  and Semantic Repair* ("AESR"; described in search as "global-level prompt enhancement via an
  agentic loop"). August 2026, likely just pre-window.
- **arXiv:2608.12290** — *Beyond Trial-and-Error: Agentic Optimization for Image-to-Video
  Adherence*. Search-engine summary attributes to it the claim that *"treating the prompt as a
  refinable target, rather than a fixed input, is a critical step for improving semantic
  alignment"* — I could **not** verify that against the paper (fetch rate-limited, §10). Do not
  cite that sentence until read.
- **arXiv:2603.01509** — *Retrieval, Refinement, and Ranking for Text-to-Video Generation via
  Prompt Optimization and Test-Time Scaling* ("3R"), ICLR 2026 TTU Workshop. March 2026,
  well pre-window, but it is a RAG prompt-optimisation framework usable with any T2V model and
  our corpus does not appear to know about it.

### 7c. Prior anchors — status
Anchors 2606.03715 (bag-of-position-tagged-words), 2606.08492 (Qwen rewriting replication),
2607.09581 (Wan-Dancer), 2607.14749 (WanSong), 2607.15038 (Wan-Streamer) were **not re-checked
for new versions** this run. No in-window follow-up surfaced for any of them in the searches
I ran. `[SPECULATION]` 2606.03715 remains the live challenge to "write prose"; 2609.11242's
"concise, constraint-aware" framing is directionally sympathetic to it without testing it.

## 8. Contradicts corpus

Ordered by how much I think each should actually move the corpus.

### 8a. 🔴 STRONG — "SCAIL-2 is prompt-inert" is contradicted by the vendor
`[OFFICIAL]`, `https://github.com/zai-org/SCAIL-2/blob/wan-scail2/README.md`, accessed
2026-09-13. Full treatment in §5c. The vendor ships a **Prompt Semantics** section, an official
**prompt enhancer**, and states *"SCAIL-2 is trained with long, detailed prompts."* Retract the
absolute claim. Replace with a scoped one; do not assert the converse magnitude without a test.
**Bonus new rule the corpus does not have:** for replacement mode, write the prompt in the
**post-replacement** state.

### 8b. 🔴 STRONG — "quality-suffix tags are retired" is contradicted for Z-Image Turbo
`[LORE]`, `https://civitai.com/articles/33736/z-image-turbo-vs-krea-2-how-prompting-actually-differs`
by `Cyberdelia` (Forge badge), published 2026-08-10, 666 reactions / 450 👍, accessed
2026-09-13. The recommended ZIT ordering is, verbatim:

```
Z-Image Turbo: subject and action, then scene, then composition and camera, then lighting and
atmosphere, then style, then a short quality tail if needed.
```

**"then a short quality tail if needed"** — a quality tail, recommended, in 2026, by a
high-reputation guide. And the article's own copy-ready ZIT prompt ends with
`...muted warm color grade, humid night air, candid unposed moment, no readable text`, which is
a tail of exactly that kind (including a negation smuggled into the positive prompt).
This is `[LORE]` with no seeds or grid — it does **not** overturn the corpus position. But
"quality-suffix tags are retired" is currently stated as universal, and the most-read
Z-Image/Krea prompting guide on Civitai contradicts it for ZIT specifically. **Soften to a
model-scoped claim, and flag ZIT as the exception to test.**

### 8c. 🟠 MEDIUM — "no portable weighting syntax" holds, but **structured prompt syntax is spreading**
Two independent in-scope surfaces now show **non-prose, keyed prompt structure**:
1. `[STAFF]` (§4a) — **`embedding:filename`** now works inside a MiniMax-H3 prompt via
   `CLIPTextEncode`. Not weighting, but a structured token in a prompt string.
2. `[LORE]` (§6c) — a keyed-field H3 format with `integrated_multimodal_description:`,
   `overall_soundscape:`, `non_diegetic_music:` **and a trailing `AVOID:` line**.

The `AVOID:` line is the interesting one: it is an **in-positive-prompt negative channel**,
used in all five examples. If H3 genuinely honours `AVOID:` locally, that is a meaningful
addition to the corpus's negative-prompt story (which currently runs "FLUX.2 has none, LTX
distilled are inert, SDXL-style negatives don't port"). **But** the source is
marketing-adjacent, gives no evidence, and its examples are plainly **API-tier** (multi-video
references, 15s). `[SPECULATION]` Most likely `AVOID:` is a **rewriter instruction** consumed by
the hosted Context-IR layer, not a local model capability. **Do not teach it. Test it locally:
one prompt, two runs, `AVOID: X` present vs absent, fixed seed.** §6d's official
`h3-prompt-writing` skill would settle this.

### 8d. 🟠 MEDIUM — "write prose because the encoder is an LLM" gets no support, and some pushback
- `[OFFICIAL]` arXiv:2609.11242 (Kling team): leading video models *"consistently fail on
  logic-heavy and rule-constrained tasks"* and the fix is to **offload reasoning to a separate
  VLM**. The encoder being LLM-family does not make it reason. (§7a)
- `[OFFICIAL]` The same paper's rewriter targets **"concise, constraint-aware"** prompts — not
  longer, richer ones.
- `[LORE]` Cyberdelia, on two models that **share the Qwen3 encoder family**, verbatim:
  ```
  Both of these models read your prompt through a Qwen3-family text encoder instead of the old
  CLIP/T5 setup. That makes people assume one prompt style works for both. It doesn't.
  ```
  and the observed split is stark — ZIT wants **100–180 words** and is "genuinely confused" by
  short prompts or tag lists, while Krea 2 handles **5–20 words** fine. **Same encoder family,
  opposite length appetite.** That is direct evidence that *"the encoder is an LLM"* does not
  determine prompt style; the **training recipe** does. This is the cleanest articulation of the
  point I have seen and it is worth importing into the corpus almost verbatim as a caution.
  It also refines "expansion helps only when underspecified": for ZIT, expansion helps
  **always**; for Krea 2, rarely.

### 8e. 🔴 STRONG — "write one flowing prose paragraph" is contradicted **for LTX-2.5**, by the vendor
Two independent in-window sources, one of them `[STAFF]`, converge (§4c-bis):
- `[STAFF]` `art-alex` (`LTX.io org`) fixed a failing LTX-2.5 prompt by **deleting the tag
  preamble and quality tail, dropping the camera line, and breaking the paragraph into one
  chronological beat per line** — and called the change "very minor".
- `[LORE]` `Andyx1976`: *"You just have to FORGET! the idea everything has to be in 'one flowing
  paragraph'. This isn't z-image and a video has things that happen after each other."*

The corpus teaches prose-not-tags, which is still right — the staff rewrite is prose. What is
contradicted is the **single-paragraph** packaging. **Recommended amendment: prose sentences,
but one beat per line, in chronological order, with an establishing state before the first
change.** Scope it to LTX-2.5 for now; note that `Andyx1976` explicitly says H3 and Wan 2.2
tolerate the flowing form better because they fill gaps, while *"LTX2.5's world understanding is
still fairly bad"*. That model-dependence is the actual lesson.

### 8f. 🟠 MEDIUM — "expansion helps only when underspecified" needs a **duration** clause
`[LORE]` `Andyx1976` gives a mechanism the corpus lacks: an enhancer tuned for a 5–10s one-shot
will under-fill a 40s request, and *"If it has not enough to do for the video length, it freaks
out completely."* So expansion can fail not because the prompt was already specified, but
because the expansion was **calibrated to the wrong output length**. Add the clause.

### 8g. 🟢 CONFIRMS corpus (counter-evidence hunted, none found)
- **Front-load the subject / order carries emphasis.** `[LORE]` Cyberdelia: *"Both models
  front-load the first thing you write, so lead with your subject on either one."* `[LORE]`
  hoodtronik: *"put it first in the prompt"* for an H3 trigger word. `[OFFICIAL]` SCAIL-2's
  official example prompts are all subject-first. **Three independent surfaces, zero
  counter-evidence.** Strongest-supported position in the corpus.
- **`(word:1.2)` does not port.** `[LORE]` Cyberdelia, verbatim: *"Drop the old `(word:1.3)`
  syntax on both models. Neither encoder reads it that way, and pushing weights too far breaks
  the image instead of emphasizing anything."* Plus the recommended substitute, which the corpus
  should adopt as a phrasing: *"To emphasize something on either model, restate it in different
  words or pick a more specific word. 'Oxblood' beats 'red,' 'sodium vapor' beats 'orange
  light.'"*
- **Wan 2.2 strong temporal / weak semantic.** `[OFFICIAL]` arXiv:2609.11242 generalises the
  rendering-vs-reasoning gap across leading models.
- **Negatives are inert at low CFG.** `[LORE]` Cyberdelia on ZIT: *"runs at a very low CFG,
  close to 1.0. At that setting it effectively ignores negative prompts."* Same mechanism the
  corpus teaches for LTX distilled. `[OFFICIAL]` SCAIL-2's distilled recipe is also CFG 1.0
  (§5e). **Generalise the lesson: the corpus should teach "CFG≈1 ⇒ negatives inert" as a
  physics rule, not as an LTX quirk.**

### 8h. 🆕 NEW hard facts worth adding (no corpus position to contradict)
`[LORE]`, all from Cyberdelia (2026-08-10), useful and specific:
- **Krea 2 = 12.9B DiT trained from scratch, text encoder Qwen3-**VL**-4B** (vision-language,
  which is *why* it reads style reference images). **Z-Image Turbo = 6B S3-DiT single-stream,
  Qwen3-4B text-only.** Our corpus has these models but, as far as the brief shows, not the
  encoder distinction — and it explains the capability gap.
- **Krea 2 trained natively to 2048×2048**; *"generating small and upscaling wastes what the
  checkpoint can do."* FP8 ≈12GB VRAM, BF16 ≈24.8GB.
- **The ComfyUI CFG-0.0 trap**, verbatim and directly actionable:
  ```
  the standard ComfyUI KSampler node doesn't accept CFG 0.0 the same way. Its guidance formula
  reads 0.0 as pure unconditional output, so the prompt gets ignored and the image breaks. On
  stock KSampler, use CFG 1.0 instead, which is that node's version of "no extra guidance."
  ```
  **A user hitting this sees "the model ignored my prompt" and blames the prompt.** That is a
  prompt-studio-relevant failure mode of the first order, and it belongs in the corpus next to
  the LTX enhancer confound. Krea 2 Turbo: 8 steps, CFG 0.0, **mu 1.15**; Raw checkpoint ≈52
  steps at CFG 3.5, intended for LoRA training.
- **Krea 2 ships nine official style LoRAs with trigger phrases**, plus mood presets that
  *"add both positive keywords and negative avoid-terms"*, style stacks, and style reference
  images with adjustable strength. ZIT has no official style layer.
- `[LORE]` Finetune-portability claim worth testing: *"Everything said here about Krea 2 applies
  equally to the base checkpoint and to full finetunes built on it, since a finetune retrains
  the diffusion weights, not the text encoder or the sampling recipe."* If true, this is a
  general principle the corpus could use for the whole SDXL-finetune family.

**Not found:** no counter-evidence this run on "arc shot" vs "orbit", "avoid 'cinematic' on
Wan", Krea 2's ~512-token cap / silent-black cliff in (576,640], FLUX.2 negative prompts, or
the ComfyUI-embeds-the-graph-in-mp4-metadata trick. See §9.

## 9. Nothing-found register

Per the absence-claim rule: each line names the surfaces **actually searched**. A scraper
seeing zero results is not evidence of absence.

| Area | Result | Surfaces actually searched |
|---|---|---|
| **New open-weight model in window** | **Nothing found** | ComfyUI v0.34.0 + v0.35.0 release bodies; 2 general web searches on Sept-2026 open-weight image/video releases; HF repo pages for LTX-2.5, LTX-2.5-Diffusers, Comfy-Org/MiniMax-H3. **Not searched:** HF "recently updated" model index, HF blog, r/StableDiffusion, Discord. |
| **Licence change in window** | **Nothing found** | Licence strings on 3 HF repo headers; SCAIL-2 LICENSE reference. **Not searched:** the LTX licence document text itself, BFL licence pages, MiniMax licence page. |
| **FLUX.1 / FLUX.2 / FLUX 3 news** | **Nothing new in window** | 1 targeted web search. **`black-forest-labs/*` HF discussions tabs NOT searched.** FLUX 3 dev weights still unreleased as of the searches run. |
| **Wan 2.2 family news** | **Nothing new in window** | 1 targeted web search; both ComfyUI release bodies. Latest confirmed Wan open-weight events are **pre-window** (Animate-2 2026-08-07, Dancer 2026-07-10/16). **`Wan-AI/*` HF cards and discussions NOT opened.** |
| **Z-Image / Qwen-Image in window** | **Nothing found** | 2 targeted web searches; v0.35.0 body. Qwen-Image-3.0 (closed) is 2026-07-21, pre-window. **`Tongyi-MAI/Z-Image-Turbo` discussions NOT opened** (thread #132 surfaced in search, unread). |
| **Krea 2 ~512-token cap / silent black frames** | **No new evidence either way** | The one substantial Krea 2 guide found (Cyberdelia) discusses length in *words*, never tokens, and never mentions black frames. Corpus position **unchallenged and unconfirmed**. |
| **SDXL fine-tune families (Juggernaut / RealVis / Pony / Illustrious / NoobAI / Animagine)** | **Nothing found** | 1 combined web search, which returned only a NoobAI-XL-1.1-on-Illustrious background note. **Essentially unsearched — treat as a gap, not a null.** |
| **`[STAFF]` posts on Wan-AI / BFL / Qwen / Tongyi / zai-org** | **Not searched at all** | Zero of these discussion tabs were opened. **Not "none found" — not looked.** |
| **Reddit** | **Skipped by instruction** | Not attempted. Chrome MCP tools were listed as available but the browser pane refused to open github.com (§10), so I did not pursue it. |
| **ComfyUI mp4-metadata graph-embedding trick** | **Not re-confirmed** | Not searched this run. Still carrying prior-run status. |
| **docs.comfy.org / Comfy blog** | **Not reached** | Blocked by fetch provenance (§10). The `.md` suffix trick could not be exercised. |
| **`AVOID:` honoured locally by H3** | **Unresolved** | Only the one marketing-adjacent Civitai article. No test, no vendor doc. |

## 10. Access notes

### 10a. ⚠️ The fetch tool in this environment is **provenance-gated** — this is the big one
`mcp__workspace__web_fetch` refuses any URL that has not already appeared in a user message, a
prior fetch result, or a **WebSearch** result:

```
URL not in provenance set. web_fetch can only retrieve URLs that appeared in a user message,
a prior web_fetch result, or a WebSearch result. Retries will fail.
```

**Consequence:** you cannot navigate directly to a known URL. `https://docs.comfy.org/changelog.md`
and `https://github.com/Comfy-Org/ComfyUI/releases` were both **refused outright** even though
they are correct, well-known URLs.

**The working pattern is: WebSearch first to mint provenance, then fetch.** A search whose
results merely *contain* the URL is enough. This is why §3b had to be sourced from
`newreleases.io` rather than GitHub — the lowercase `github.com/comfy-org/ComfyUI/releases`
appeared in a search result but the release-body page did not, while newreleases.io did.
**Budget one WebSearch per URL family you intend to open.** This constraint is new information
for the sweep protocol and probably explains some past "unreachable" verdicts.

### 10b. ⚠️ Rate limit is real and abrupt
One round of parallel fetches returned:
```
The web fetch API is rate limited (HTTP 429). Immediate retries will fail
```
It cleared after roughly one intervening search round. **Cost me arXiv 2608.12290.** Pace
fetches; interleave searches.

### 10c. ⚠️ The browser pane is unavailable for these hosts
`mcp__Claude_Browser__navigate` to `https://github.com/Comfy-Org/ComfyUI/releases` returned
`navOk: false` — *"navigation to https://github.com was denied or failed"*, pane left at
`about:blank`. I did not find a host it would accept. **No browser fallback exists in this
environment**, so the Reddit workaround the brief contemplates is not available.

### 10d. ✅ Routes that WORKED well
- **Hugging Face discussion pages render fully to a logged-out server fetch** — full comment
  threads, **org badges** (this is how `Lexius` / `Comfy Org org` was identified), relative
  timestamps, merge events, and inline code blocks. **This is the single most productive
  `[STAFF]`-hunting surface and it should be the default next run.** Model-page headers also
  render licence slug, like count, follower count and discussion count.
- **`civitai.com/articles/...` fetches clean and complete**, including full prompt text in code
  blocks and reaction counts. No login needed. Much better than expected.
- **`civarchive.com` model pages are rich and login-free**, including SHA256, file size, trigger
  words, training hyperparameters, sample methodology, **and CivitAI deletion status**. The
  brief's advice to mine *derivative* pages is correct and paid off (§6e).
- **`github.com/.../blob/<branch>/README.md` renders full markdown** — this is how the SCAIL-2
  README was read. No `raw.githubusercontent.com` needed, as the brief says.
- **`arxiv.org/abs/<id>`** fetches cleanly with the full abstract in metadata.
- **`newreleases.io/project/github/<org>/<repo>/release/<tag>`** is an excellent GitHub-release
  mirror and reports the *latest* tag in its header as a bonus.

### 10e. 📌 Correction to the brief: SCAIL-2 `@main`
The brief says *"there is NO `main` branch — @main URLs 404."* That is true of **GitHub**
(`zai-org/SCAIL-2` uses `wan-scail2` / `sat-scail2`). It is **NOT true of Hugging Face**:
`huggingface.co/zai-org/SCAIL-2` resolves `/blob/main/...` — the official README itself links
`https://huggingface.co/zai-org/SCAIL-2/blob/main/model/relighting-lora.pt`, and a search index
shows `/tree/main/model/1`. `[SPECULATION]` This mistaken rule is the most likely cause of the
**two consecutive zero-coverage runs** on SCAIL-2. **Please amend the brief.**

### 10f. 📌 arXiv ID convention
Searching "September 2026" for arXiv resolves to **2509.\*** (2025 papers) and buries the real
results. In-window IDs are **2609.\***. Search the numeric prefix explicitly.

### 10g. Artefact volatility on Civitai
The one in-window H3 LoRA I examined was **deleted from CivitAI the same day it was published**
(2026-09-06) with **no surviving mirror**. Metadata persisted only on civarchive. Treat CivitAI
availability as ephemeral; civarchive is the durable record.

### 10h. URLs I could not open (report, per instruction)
- `https://docs.comfy.org/changelog.md` — provenance-refused.
- `https://github.com/Comfy-Org/ComfyUI/releases` — provenance-refused (and browser-pane denied).
- `https://github.com/Comfy-Org/ComfyUI/releases/tag/v0.35.1` — never minted provenance; **body unread**.
- `https://arxiv.org/html/2608.12290` — HTTP 429.
- `https://huggingface.co/Lightricks/LTX-2.5/discussions/62` — in provenance, not fetched (budget).
- `https://huggingface.co/Tongyi-MAI/Z-Image-Turbo/discussions/132` — in provenance, not fetched (budget).

---

## Top follow-ups for next sweep, in priority order
1. **Date `Lightricks/LTX-2.5` commit `1b92891`** (the text-encoder upload) and establish
   whether the checkpoint really was mismatched. If so, **quarantine every LTX-2.5 prompt
   verdict after that date**, exactly as we did for the enhancer-default window. Highest
   consequence item in this report. §4c-bis.
2. **Fetch `https://ltx.io/blog/prompting-long-shots-with-ltx-2-how-to-build-20-second-cinematic-moments`**
   — a first-party Lightricks long-shot prompting guide, cited by a user, never in our corpus.
3. **Chase the official MiniMax `h3-prompt-writing` skill** (§6d). Would settle the
   structured-format and `AVOID:` questions from a first-party source. Hand to Agent A.
4. **Sweep the untouched discussions tabs** — `Wan-AI/*`, `black-forest-labs/*`, `Qwen/*`,
   `Tongyi-MAI/Z-Image-Turbo` (#132), `zai-org/SCAIL-2`, plus `Lightricks/LTX-2.5` **#38**.
   HF discussion pages are the proven `[STAFF]` surface (§10d), and the trick is to open threads
   titled like *architecture complaints*, not usage questions (§4d).
5. **Read ComfyUI v0.35.1's release body** — in-window, unread. Also check whether it fixes
   issue #16246 (low-VRAM BSOD since v0.35.0).
6. **Determine whether SenseNova U1.5 is open-weight** (ComfyUI #15922). If so it is a new
   in-scope model nobody in the corpus has.
7. **Test `AVOID:` on local H3** — fixed seed, one prompt, `AVOID: X` present vs absent (§8c).
8. **Get the literal string of `diffusers`' LTX `DEFAULT_NEGATIVE_PROMPT`** (§4b) and **diff the
   two LTX licence slugs** (§4e).
9. **Evaluate `ComfyUI-ClipProj`** (`https://github.com/nicolab28/ComfyUI-ClipProj`) — claimed
   to swap H3's ~30B Qwen3 encoder for Qwen3-VL 8B/4B via ridge regression. If real, it changes
   the H3 VRAM story and is a natural experiment on how much the encoder drives prompt
   behaviour.
10. **Amend the sweep brief**: SCAIL-2 `@main` works on Hugging Face (§10e); arXiv in-window
    IDs are `2609.*` (§10f); web_fetch is provenance-gated, so WebSearch first (§10a).
