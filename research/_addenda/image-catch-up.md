# Image-model catch-up addendum

Addendum to the 2026-08-15 image corpus (`sdxl.md`, `flux.md`, `z-image.md`, `qwen-image.md`, `new-models.md`).
Research pass: 2026-08-15. All URLs accessed 2026-08-15 unless noted.

Purpose: (a) find **tested** evidence for prompt techniques the corpus currently asserts, (b) capture releases and
changes the corpus missed. Evidence labels as in the main corpus: `[OFFICIAL]`, `[STAFF]`, `[TESTED]` (methodology
stated inline), `[LORE]`, `[SPECULATION]`, `[SYNTHESIS]`.

---

## 0. Contradiction register — read this first

Nine items in the existing corpus are wrong, unsupported, or stale. Ordered by how much damage they do.

| # | Corpus currently says | Evidence found | Action |
|---|---|---|---|
| 1 | Rewriting/expanding the user's prompt is the product's core value | `[TESTED]` Naive zero-shot LLM rewriting scores **0.370** average GPT-4o win rate vs **0.401** for *no rewriter at all* (arXiv:2510.12041, Table 10). Two of thirteen rewriter backbones also scored below baseline. | Rewriting must be **tuned or tightly schema-constrained**, not free-form "make it prettier". Add an explicit "no-rewrite" path. |
| 2 | Camera/lens/aperture vocabulary is a composition-control lever | `[TESTED]` ×3 independent papers: aperture, focal length, shutter speed and numeric viewpoint angle perform **at or below chance** in prompt text on SD1.5/SDXL/SD3/SD3.5/FLUX. SDXL with `f/2.8` in prompt scores **48.47** blur-monotonicity where chance ≈ 50. | Demote all lens/aperture/film-stock vocabulary from "control" to "style token". Do not validate it as a constraint. |
| 3 | FLUX.2 "usually prefers 30–80 words" | `[OFFICIAL]` BFL publishes that band verbatim, but it has **no methodology anywhere**. The one real length study (`[TESTED]`, PromptMoG) finds longer prompts don't hurt quality — they collapse **seed diversity**. | Relabel from empirical to `[OFFICIAL]` guidance. Add the diversity mechanism as the actual reason to stay short while exploring. |
| 4 | Qwen-Image wants the magic suffix `Ultra HD, 4K, cinematic composition` | `[OFFICIAL]` The official **2512** pipeline **abandoned it** — `magic_prompt` is dead code in `prompt_utils_2512.py`, and the README replaced it with an anti-AI-look **negative prompt**. | Version-gate the suffix: Qwen-Image (Aug 2025) yes, Qwen-Image-2512 no. |
| 5 | Meta-tags like "masterpiece" can get rendered as literal text by Flux | **Nothing found.** No repro, no image, no issue, no article. | Delete the claim or mark `[SPECULATION]`. |
| 6 | `(word:1.3)` is a portable SDXL emphasis idiom | `[OFFICIAL]` source code: A1111 scales hidden states from the **zero vector** then restores the chunk mean; ComfyUI lerps from the **empty-prompt embedding** and never renormalizes. Same syntax, different math, different image. | Emphasis values must be UI-scoped. Never carry a weight number across UIs without a warning. |
| 7 | "Pony score/source tags" is a stable SDXL dialect branch | `[OFFICIAL]` Pony **V7 shipped on AuraFlow, not SDXL**, and its own card says `score_9` "would not necessarily yield better results on some prompts". | Split the branch: Pony **V6** (SDXL, score tags load-bearing) vs Pony **V7** (AuraFlow, template-based, score tags degraded). |
| 8 | 512-token cap is the FLUX.2 story | `[OFFICIAL]` **cloud accepts 32K tokens; local weights hard-truncate at 512** (`MAX_LENGTH = 512` for both the Mistral and Qwen3 embedders). Silent. | Add an explicit cloud/local split. A 500-word prompt on local FLUX.2 is partly discarded. |
| 9 | Illustrious is an actively versioned family | `[OFFICIAL]` HF org **static since 2025-04-22**; only v0.1 / v1.0 / v1.1 / v2.0 have public weights. **v3.x was promised and never shipped to HF.** | Cap the Illustrious selector at v2.0 and note the hosted-platform paywall. |

---

## 1. SDXL — tested evidence

### 1.1 Prompt weighting is not portable between UIs `[OFFICIAL]`

**A1111** — `modules/sd_emphasis.py`
([source](https://github.com/AUTOMATIC1111/stable-diffusion-webui/blob/master/modules/sd_emphasis.py)) exposes four
emphasis modes with these exact names/descriptions:

- `None` — "disable the mechanism entirely and treat (:.1.1) as literal characters"
- `Ignore` — "treat all empasised words as if they have no emphasis"
- `Original` — "the original emphasis implementation" *(default)*
- `No norm` — "same as original, but without normalization (**seems to work better for SDXL**)"

`EmphasisOriginal.after_transformers()`, verbatim:

```python
original_mean = self.z.mean()
self.z = self.z * self.multipliers.reshape(self.multipliers.shape + (1,)).expand(self.z.shape)

# restoring original mean is likely not correct, but it seems to work well to prevent artifacts that happen otherwise
new_mean = self.z.mean()
self.z = self.z * (original_mean / new_mean)
```

Two teaching points fall straight out of that code: A1111 scales the **post-transformer hidden states**, and by
default it **rescales the whole chunk back to the original mean** — so raising one token's weight silently *lowers*
everything else. The codebase's own recommendation for SDXL is `No norm`.

**ComfyUI** — `comfy/sd1_clip.py`, `ClipTokenWeightEncoder.encode_token_weights`
([source](https://github.com/comfyanonymous/ComfyUI/blob/master/comfy/sd1_clip.py)):

```python
z_empty = out[-1]
...
weight = token_weight_pairs[k][j][1]
if weight != 1.0:
    z[i][j] = (z[i][j] - z_empty[j]) * weight + z_empty[j]
```

ComfyUI encodes an extra **empty prompt** and extrapolates each token away from *that* baseline, with no mean
restoration. Both UIs parse `(word)` as `weight *= 1.1` with identical nesting rules — the parsing is the same, the
application is not.

**BlenderNeko `ComfyUI_ADV_CLIP_emb`** ([README](https://github.com/BlenderNeko/ComfyUI_ADV_CLIP_emb)) is the
reconciliation layer and the best single artifact for teaching this. Exact parameter values:

- `weight_interpretation`: **comfy**, **A1111**, **compel**, **comfy++**, **down_weight**
- `token_normalization`: **none**, **mean**, **length**, **length+mean**

Verbatim from the README: *"comfy: the default in ComfyUI, CLIP vectors are lerped between the prompt and a
completely empty prompt."* / *"A1111: CLip vectors are scaled by their weight"* / *"down_weight: rescales weights
such that the maximum weight is one."* On the mechanism: *"in A1111 we use weights to travel on the line between the
zero vector and the vector corresponding to the token embedding... Comfy also creates a direction starting from a
single point but instead uses the vector embedding corresponding to a completely empty prompt... Despite the
magnitude of the vector not growing as fast as in A1111 this is actually quite effective and can result in SD quite
aggressively chasing concepts that are up-weighted."*

`length` normalization, verbatim: *"if a word is expressed as 3 tokens and it has a weight of 1.5 all tokens get a
weight of around 1.29 because sqrt(3 * pow(0.35, 2)) = 0.5."* This is the reason a weight on a long rare word does
less than the same weight on a short common word.

**compel** ([changelog](https://github.com/damian0815/compel)) changed its downweighting algorithm in **v1.0.0**:
*"Downweighting now works by applying an attention mask to remove the downweighted tokens, rather than literally
removing them from the sequence... Formerly, downweighting a token worked by both multiplying the weighting of the
token's embedding, and doing an inverse-weighted blend with a copy of the token sequence that had the downweighted
tokens removed... However, removing the tokens resulted in the positioning of all downstream tokens becoming messed
up."* Old behavior is restorable via `downweight_mode=DownweightMode.REMOVE`.

Other UIs `[OFFICIAL]`: **InvokeAI** uses compel as its prompting engine (compel README: *"Adapted from the InvokeAI
prompting code (also by @damian0815)"*). **SD.Next** (`modules/prompt_parser_diffusers.py`) defaults to compel's
`EmbeddingsProvider` with a `prompt_attention` switch and a separate `prompt_mean_norm` toggle — i.e. A1111-style mean
renormalization layered over compel. **Forge/reForge** (`backend/text_processing/classic_engine.py`) is a near-verbatim
port of A1111's `sd_hijack_clip.py` with the same four emphasis modes; one difference is that
`comma_padding_backtrack` is hardcoded to `20` instead of exposed as a setting.

**Verdict.** `(word:1.3)` is **not portable**. Nearest-equivalent recipe: set A1111 to `No norm`, and in ComfyUI use
the Advanced CLIP Text Encode node with `weight_interpretation: A1111`, `token_normalization: none`.

> Nothing found: comfyanonymous's own prose/numeric explanation of the design choice. The mechanism is unambiguous
> from source but there is no authored writeup to cite.

### 1.2 Quality tags work if and only if they were in the training captions

This is the honest generalization, and both sides of it are sourced.

**Photoreal SDXL checkpoints do not use them** `[OFFICIAL]`:

- **Juggernaut XL v9** ([card](https://huggingface.co/RunDiffusion/Juggernaut-XL-v9)): 832×1216, DPM++ 2M Karras,
  30–40 steps, **CFG 3–7** ("lower = more realistic"). On negatives, verbatim: *"Negative prompts: start with none.
  Add specific things you don't want as you iterate. **Heavy negatives often hurt more than they help on this
  model.**"* Its recommended keyword list is entirely photographic-domain — *"Architecture Photography · Wildlife
  Photography · Car Photography · Food Photography · Interior Photography · Landscape Photography · Hyperdetailed
  Photography · Cinematic Movie · Still Mid Shot Photo · Full Body Photo · Skin Details"*. No `masterpiece`, no `8k`.
- **RealVisXL V4.0** ([card](https://huggingface.co/SG161222/RealVisXL_V4.0)): recommended negative
  *"(face asymmetry, eyes asymmetry, deformed eyes, open mouth) or another negative prompt"*, 25+ steps.
  **V5.0** ([card](https://huggingface.co/SG161222/RealVisXL_V5.0)): *"bad hands, bad anatomy, ugly, deformed, (face
  asymmetry, eyes asymmetry, deformed eyes, deformed mouth, open mouth)"*, DPM++ SDE Karras 30+ or 2M Karras 50+.
  Both cards recommend **defect-naming negatives only** and never mention positive quality tags.

**Anime/booru checkpoints publish the mapping** `[OFFICIAL]`:

- **NoobAI-XL 1.1** ([card](https://huggingface.co/Laxhar/noobai-XL-1.1)) publishes the training percentile → tag
  table: `>95th → masterpiece`, `>85th–95th → best quality`, `>60th–85th → good quality`,
  `>30th–60th → normal quality`, `<=30th → worst quality`. Plus aesthetic tags (`very awa` = top 5% by waifu-scorer)
  and period tags (`old`/`early`/`mid`/`recent`/`newest`). Recommended prefix:
  `masterpiece, best quality, newest, absurdres, highres, safe,`.
- **Animagine XL 4.0** ([card](https://huggingface.co/cagliostrolab/animagine-xl-4.0)) ships **side-by-side
  comparison images** with the negative prompt left empty, comparing `"masterpiece, best quality"` against
  `"low quality, worst quality"` and `"high score, great score"` against `"bad score, low score"`. This is the closest
  thing to a published quality-tag ablation anywhere in the SDXL ecosystem — call it `[TESTED — vendor, informal]`.
  The card states score tags have a **"stronger impact"** on steering quality than the basic quality tags.
- **bigASP V2.5** ([card](https://huggingface.co/fancyfeast/bigaspv2-5)) `[TESTED — author's informal comparison, no
  metric]`: *"Images in the training dataset were assessed for overall quality and their quality rating was included
  during training. So you can prompt with: worst quality, low quality, normal quality, high quality, best quality, and
  masterpiece quality. Including the quality in your prompt is not required... I would caution against using
  **masterpiece quality** for now, since that tends to skew the model towards drawings rather than photoreal."*

**Was quality vocabulary in SDXL base captions?** `[OFFICIAL — negative evidence]` The SDXL paper
([arXiv:2307.01952](https://arxiv.org/abs/2307.01952)) describes its novel conditioning as **size, crop, and
aspect-ratio micro-conditioning vectors** — numeric inputs, not caption keywords. It documents no `masterpiece`-style
caption vocabulary. The refiner does carry an aesthetic score, surfaced in A1111 as
`sdxl_refiner_low_aesthetic_score: 2.5` / `sdxl_refiner_high_aesthetic_score: 6.0` — again a numeric conditioning
input, not a prompt token. This is absence of evidence in the paper, not a denial.

**`score_9` on non-Pony models**: no test found `[SPECULATION]`. Note that Pony's own V7 card concedes the tags barely
work on Pony anymore (§1.5).

> **Nothing found:** any controlled A/B measuring whether "masterpiece, best quality, 8k, ultra detailed" helps or
> hurts on Juggernaut or RealVisXL. This is a clean, cheap experiment nobody has published.

### 1.3 Negative prompts — mechanism is solid, mega-lists are unsupported

**Mechanism** `[OFFICIAL]`, from AUTOMATIC1111's own wiki page
([Negative prompt](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Negative-prompt)):

> *"As far as I know, I was the first to use this approach; the commit that adds it is 757bb7c4."*
> *"The way negative prompt works is by using user-specified text instead of empty string for
> `unconditional_conditioning` when doing sampling."*
> *"...this allows you to do that without using any of your allowance of 75 tokens the prompt consists of."*

That last line is worth correcting the corpus on: **the negative prompt does not eat the positive prompt's 75-token
budget** — it has its own. The "negatives consume your token budget" folk claim is wrong for A1111.

**Fixed-seed ladder** `[TESTED — A1111's own published grid: seed 749109862, Euler a, 20 steps, CFG 7, 896×448, one
castle prompt]`, same page: five images with negatives `none` → `fog` → `grainy` → `fog, grainy` →
`fog, grainy, purple`. Each addition visibly changes the output. Small N, one prompt, but methodology fully visible.

**Peer-reviewed:**

- *"Understanding the Impact of Negative Prompts: When and How Do They Take Effect?"*
  ([arXiv:2406.02965](https://arxiv.org/abs/2406.02965), 2024-06-05) `[TESTED]`. Two named findings, verbatim:
  **"Delayed Effect: The impact of negative prompts is observed after positive prompts render corresponding
  content."** and **"Deletion Through Neutralization: Negative prompts delete concepts from the generated image
  through a mutual cancellation effect in latent space with positive prompts."** SD generation not specified in the
  abstract. The "delayed effect" is the actionable one — it explains why NGMS-style step-skipping works.
- *"Dynamic Negative Guidance of Diffusion Models"* ([arXiv:2410.14398](https://arxiv.org/abs/2410.14398), ICLR 2025
  poster) `[TESTED — class removal on MNIST and CIFAR10; SD used only qualitatively]`: *"conventional NP is limited by
  the assumption of a **constant guidance scale**, which may lead to highly suboptimal results, **or even complete
  failure**, due to the non-stationarity and state-dependence of the reverse process."*

**Long vs short negatives.** No controlled study found. Two indirect data points, both pointing the same way:

- Juggernaut XL v9 `[STAFF]`: *"Heavy negatives often hurt more than they help on this model."*
- bigASP V2.5 `[TESTED — informal, author's own comparison]`: *"I've tried leaving it blank, 'low quality', and a more
  universal long negative prompt with things like 'deformed', etc. Of those three options, **just 'low quality'
  performed the best for me**."* And: *"I noticed a rather significant improvement in the quality of gens when
  including 'low quality' in the negative prompt versus leaving the negative blank. Not just in aesthetics, but also
  in overall image structure, which I find quite odd."*

**Structural evidence the negative is skippable** `[OFFICIAL]` — A1111 ships four options in
`modules/shared_options.py` that skip or truncate it, default-off, framed as *quality* features:

- `s_min_uncond` — "Negative Guidance minimum sigma" (infotext `NGMS`): *"skip negative prompt for some steps when the
  image is almost ready; 0=disable, higher=faster"*. Default `0.0`, max `15.0`.
- `s_min_uncond_all` — *"By default, NGMS above skips every other step; this makes it skip all steps"*.
- `skip_early_cond` — "Ignore negative prompt during early sampling" (infotext `Skip Early CFG`): *"disables CFG on a
  proportion of steps at the beginning of generation; 0=skip none; 1=skip all; **can both improve sample
  diversity/quality and speed up sampling**"*.
- `pad_cond_uncond_v0` — *"**WARNING: truncates negative prompt if it's too long**; changes seeds"*.

**Does a nonsense negative still change the output?** No published experiment found — but it is a *mechanical
consequence*, not an empirical claim: any non-empty negative replaces `unconditional_conditioning` with a different
tensor, so the CFG difference vector changes. Teach it as mechanism, label it `[OFFICIAL — by construction]`, not
`[TESTED]`.

### 1.4 77-token chunking differs between UIs `[OFFICIAL]`

**A1111** (`modules/sd_hijack_clip.py`): chunk = *"exact amount of tokens - 77, which includes one for start and end
token, **so just 75 tokens from prompt**"*. Chunks are encoded separately then concatenated (`torch.hstack(zs)` →
`(B, 77*N, C)`). `BREAK` is handled literally — `if text == 'BREAK' and weight == -1: next_chunk()` — force-closing
the chunk and padding it with end tokens. `comma_padding_backtrack` (default 20, "Prompt word wrap length limit")
pushes text after the last comma into the next chunk if the boundary would land within 20 tokens of it, so **A1111
already avoids splitting mid-clause by default**.

**ComfyUI** (`comfy/sd1_clip.py`, `tokenize_with_weights`): also batches into 77-token groups, but the split rule is
different — a word group is only broken across a boundary if `is_large = len(t_group) >= self.max_word_length` (8);
otherwise it is pushed whole to the next batch. No comma backtracking, no `BREAK` keyword in core
(`ConditioningConcat` / `ConditioningCombine` are the equivalents).

Consequence: **the same >75-token prompt tokenizes into different chunks in the two UIs**, compounding the weighting
difference in §1.1. Relevant compel history `[OFFICIAL]`: `truncate_long_prompts=False` pads to a multiple of max
length; v2.1.0 added `split_long_text_mode` (default `SENTENCES` from 2.1.1); v2.3.0 added CLS/EOS handling across
chunks; v2.3.1 fixed a "78 tokens / 77 tokens issue with SDXL". Three releases of API surface is itself evidence the
chunk-boundary problem is real.

> **Nothing found:** any visible fixed-seed experiment measuring chunk-boundary artifacts.

### 1.5 SDXL ecosystem state `[OFFICIAL]`

**Illustrious XL (Onoma AI).** Public HF weights, from the org API fetched 2026-08-15 — **exactly five repos**:

| Repo | Created | Likes |
|---|---|---|
| `Illustrious-xl-early-release-v0` (v0.1) | 2024-09-20 | 428 |
| `Illustrious-XL-v1.0` | 2025-02-13 | 41 |
| `Illustrious-XL-v1.1` | 2025-03-19 | 88 |
| `Illustrious-XL-v2.0` | 2025-04-18 | 197 |
| `Illustrious-Lumina-v0.03` | 2025-04-16 | 48 |

**No v3.x on Hugging Face.** Last modification across the whole org: **2025-04-22** — static for ~16 months. The v1.0
card still promises *"Upcoming releases (Illustrious XL v3) aim to support higher resolutions, targeting up to 2k"*.
Every card now leads with a hosted-platform push: *"you can now generate images directly with our Illustrious XL
models on our official site: illustrious-xl.ai... plus, **several exclusive models you won't find on any other
hub**."* v1.1 vs v1.0 is the one measured comparison `[TESTED — ELO over 400 sample responses]`: *"ELO rating **1617**,
compared to v1.0, ELO rating **1571**"*. Paper: [arXiv:2409.19946](https://arxiv.org/abs/2409.19946) — *"we propose
the **refined multi-level captions**, covering all tags and various natural language captions as a critical factor for
model development."*

**NoobAI-XL.** Two lines: eps-pred [`Laxhar/noobai-XL-1.1`](https://huggingface.co/Laxhar/noobai-XL-1.1) (created
2024-11-21) and v-pred [`Laxhar/noobai-XL-Vpred-1.0`](https://huggingface.co/Laxhar/noobai-XL-Vpred-1.0) (created
2024-12-22). HF 30-day downloads at fetch time: eps **55,840**, v-pred **41,952**. No release after v-pred 1.0; the
org's newest artifact is an unrelated LoRA trainer (2026-05). **"Development ended" is not officially stated —
nothing found** for such an announcement; the history simply stops.

V-pred prompting caveats, verbatim from the card — these matter because they break generic SDXL defaults:

> **"THIS MODEL WORKS DIFFERENT FROM EPS MODELS!"**
> *"CFG: **4 ~ 5**; Steps: 28 ~ 35; Sampling Method: **Euler** (⚠️ **Other samplers will not work properly**)"*

Diffusers requires both flags: `scheduler_args = {"prediction_type": "v_prediction", "rescale_betas_zero_snr": True}`.
The A1111 equivalent is `sd_noise_schedule: ["Default", "Zero Terminal SNR"]` — *"for use with zero terminal SNR
trained models"*. The card routes users to reForge, ComfyUI, or the A1111 **`dev` branch** (*"Note that dev branch is
not stable and may contain bugs"*). eps 1.1 differs: **CFG 5~6, steps 25~30, Euler a**. Prompt prefix and negative are
identical across both.

**Pony Diffusion V7 — shipped, and it left SDXL.**
[`purplesmartai/pony-v7-base`](https://huggingface.co/purplesmartai/pony-v7-base) is built on **AuraFlow**, ~10M
images, *"roughly 1:1 ratio between anime/cartoon/furry/pony datasets and 1:1 ratio between safe/questionable/
explicit"*, 768–1536px, 30+ steps. The score tags survived syntactically but degraded functionally. Verbatim:
*"Special Tags: `score_X`, `style_cluster_x`, `source_X` — **warning: V7 prompting may be inconsistent**, please see
the article as we are working on **V7.1** to address this."* And in Limitations: *"Special tags (including quality
tags) have much weaker performance compared to V6, meaning **score_9 would not necessarily yield better results on
some prompts**."* What replaced them is an *"opinionated default prompt template"*:
`special tags, factual description of image, stylistic description of image, additional content tags`, with the
character convention `<species> <gender> <name> from <source>` (e.g. *"Anthro bunny female Lola Bunny from Space
Jam"*). Also: *"Artists' names have been removed."* Explanation article:
<https://civitai.com/articles/19986>.

**Animagine XL 4.0** ([card](https://huggingface.co/cagliostrolab/animagine-xl-4.0)): released **2025-01-24**, "4.0
Opt" added **2025-02-13**. SDXL 1.0 retrain, 8,401,464 images, data cutoff 2025-01-07, 7×H100, ~2650 GPU-hours.
Prompt template: `1girl/1boy/1other, character name, from which series, rating, everything else in any order and end
with quality enhancement`, closing with `masterpiece, high score, great score, absurdres`. CFG 4–7 (5 recommended),
28 steps, Euler a. Stated limitation: *"**Limited to tag-based text prompts; natural language input may not be
effective.**"*

**2026 SDXL-lineage anime releases:** nothing confirmed. No 2026-dated SDXL-lineage anime model appeared in the org
listings checked. Treat any such claim as unverified.

**SDXL usage share vs Flux/Qwen/Z-Image:** **nothing found** for aggregate Civitai/HF share statistics. Fragments
only — Juggernaut XL v9 card `[STAFF, self-reported]`: *"6M+ all-time downloads on Hugging Face, 1.5M+ on Civitai"*,
*"Overwhelmingly Positive across 7,780+ reviews"*. Directional `[STAFF]` signal: RunDiffusion's own card now steers
new users toward non-SDXL successors ("Juggernaut Z" on Lumina-Image-2, "Juggernaut Pro Flux" on FLUX.1) while calling
SDXL *"the single most mature corner of open image generation"* and citing the 8 GB VRAM floor *"unlike newer
DiT-based models that demand 16+ GB."* Note also that Illustrious v1.0/v1.1/v2.0 report `0` HF downloads because they
are single-file `.safetensors` repos — **do not read those zeros as no usage**.

---

## 2. FLUX — tested evidence and what changed

### 2.1 "30–80 words" is official guidance, not a measurement

`[OFFICIAL]` — [BFL FLUX.2 prompting guide](https://docs.bfl.ai/guides/prompting_guide_flux2), verbatim:

> **Prompt length guidance**:
> * **Short (10-30 words)**: Quick concepts and style exploration
> * **Medium (30-80 words)**: Usually ideal for most projects
> * **Long (80+ words)**: Complex scenes requiring detailed specifications

The newer unified guide ([docs.bfl.ml/guides/prompting_unified_building.md](https://docs.bfl.ml/guides/prompting_unified_building.md))
restates it as 10–30 / 30–80 / **80–300+** and attaches this warning, verbatim: *"**Start short. Add only what changes
the image. More words do not automatically mean better results.**"* and *"Specific detail helps. Filler hurts."* /
*"Strong prompts are specific, not necessarily long."*

**No methodology accompanies the band anywhere** — no seed sweep, no grid, no N. Also note the 30–80 range is written
for **[pro] & [max]**, cloud models that may apply prompt upsampling (§2.6); it is not a statement about local
[dev]/[klein].

The one number that *is* baked into shipped code `[OFFICIAL]`: BFL's own image-to-image upsampler system message
instructs the LLM to produce *"one concise instruction (**50-80 words**, ~30 for brief requests)"*
([system_messages.py](https://raw.githubusercontent.com/black-forest-labs/flux2/main/src/flux2/system_messages.py)).
That is BFL's revealed preference for **edit-instruction** length, not T2I.

### 2.2 Token caps: cloud and local disagree `[OFFICIAL]`

| Model | Text encoder | Token cap | Source |
|---|---|---|---|
| FLUX.1 [dev] | T5-XXL + CLIP-L | **512** (`max_sequence_length=512`) | [diffusers Flux docs](https://huggingface.co/docs/diffusers/en/api/pipelines/flux) |
| FLUX.1 [schnell] | T5-XXL + CLIP-L | **256** in official example | same |
| FLUX.2 [dev] | Mistral-Small-3.2-24B | **512** — `MAX_LENGTH = 512`, truncation enabled | `src/flux2/text_encoder.py` |
| FLUX.2 [klein] 4B / 9B | Qwen3-4B-FP8 / Qwen3-8B-FP8 | **512** | same |
| FLUX.2 via **BFL API** | — | **"up to 32K tokens"** | [prompting_unified_building](https://docs.bfl.ml/guides/prompting_unified_building.md) |

Corroborated by the HF diffusers FLUX.2 post: *"The pipeline allows for a `max_sequence_length` of 512."*
([blog](https://huggingface.co/blog/flux-2)).

**Teaching point.** 512 tokens ≈ 350–400 English words. A 500-word prompt on local FLUX.2 is not "long" — it is
**silently partly discarded**. The 32K number is cloud-only.

Architecture detail worth carrying `[OFFICIAL]`: FLUX.2 concatenates hidden states from **layers 10/20/30 (Mistral)**
or **9/18/27 (Qwen3)**, giving `(batch, seq_len, 3 × hidden_dim)`.

### 2.3 The real length finding: long prompts kill seed diversity `[TESTED]`

**PromptMoG / LPD-Bench**, [arXiv:2511.20251](https://arxiv.org/abs/2511.20251). Methodology fully visible: LPD-Bench =
**1000 prompts averaging 250–450 words**, 40 per topic, ~4× longer than existing benchmarks; diversity measured by
**Vendi Score** over InceptionV3 and DINOv3 features; results averaged over **6 random seeds**; single H100; noise
generated on CPU for cross-device reproducibility; ablation on 200 prompts. Models include **Flux.1-Krea-Dev (12B)**,
SD3.5-Large, CogView4, Qwen-Image.

Verbatim: *"Long prompts encode rich content, spatial, and stylistic information that enhances fidelity but often
suppresses diversity, leading to repetitive and less creative outputs... state-of-the-art models exhibit a clear drop
in diversity as prompt length increases."* Fig. 2 compares diversity using the first sentence vs first three sentences
vs all sentences of each long prompt.

This is the strongest published evidence on prompt length in the FLUX family, and it says something **different** from
BFL's guidance: longer prompts don't degrade quality, they degrade **variety across seeds**. That is a defensible,
testable reason to stay short while exploring and go long once you have committed to a composition. Corroborating:
DiverseVAR ([arXiv:2511.21415](https://arxiv.org/abs/2511.21415)) benchmarks explicitly against prompt-rewriting as a
diversity baseline.

> Per-model numeric diversity drops were not extractable from search results — read the PDF before quoting figures.

### 2.4 Word order: official claim vs one small counter-test

`[OFFICIAL]` BFL: *"Word order matters - FLUX.2 pays more attention to what comes first."* Their worked example:

- Weaker: `Person standing inside a forest fire, strong determined attitude, close-up shot, realistic` → *"can lead to
  a wider scene than intended"*
- Better: `Person with a strong determined expression, forest fire in the background, close-up shot, realistic`
- Rule: *"If FLUX keeps pulling too far back, make the subject clear first and move environmental details later in the
  sentence."*

`[TESTED — weak: 1 prompt, sentence-level shuffle, fixed seed, FLUX.1 dev]` —
<https://bytedance.github.io/LatentUnfold/> shuffled *"A red car driving on a beautiful mountain highway"* and
concluded *"Flux seems to be insensitive to word order in the input prompt."* Different model generation, N=1. Flag as
an **open question**, not resolved either way. This is a cheap first-party experiment.

### 2.5 Quality tags and Flux

> **Nothing found** for the claim that Flux renders "masterpiece / best quality / 4k" as literal text in the image. No
> Reddit thread, Civitai article, GitHub issue, or paper demonstrates it. **The corpus should not assert this.**

What *is* official `[OFFICIAL]`:

- *"FLUX works best when your prompt reads like a clear description of the image you want to generate."*
  ([prompting_unified_basics](https://docs.bfl.ml/guides/prompting_unified_basics.md))
- klein section, verbatim: *"What you write is exactly what the model receives"* / *"**Write in prose, not keyword
  lists — describe scenes like a novelist**"* / *"Lighting descriptions have the highest single impact on output
  quality"* / *"Add `Style: [style]. Mood: [mood].` at the end for consistent aesthetics"*
  ([prompting_unified_reference](https://docs.bfl.ml/guides/prompting_unified_reference.md)). Note the "lighting has
  the highest impact" line has **no method shown** — BFL opinion, not measurement.
- On boilerplate: *"Avoid stacking too many generic quality terms. One or two strong realism cues are usually
  enough."* That is "don't overdo it", **not** "these tags are harmful".
- klein 4B card, Limitations: *"Prompt following is heavily influenced by the prompting style."*

Adjacent, and often confused with the tag claim `[TESTED — coarse, platform-level]`:
[pollinations#7653](https://github.com/pollinations/pollinations/issues/7653) (2026-01-25, reproduced by a second
user): *"Short text (1-5 words) renders fine. Text longer than 5 words becomes garbled, smeared, or 'melted'."*
Controls: *"Checked `enhance` parameter: Issue persists with `enhance=false`"*, and external models rendered the same
long text correctly. Their own hypothesis blames quantization in the serving pipeline, not the weights — so this is
evidence about **requested text length**, not about tag leakage.

### 2.6 Prompt upsampling — the cloud/local confound `[OFFICIAL]`

This one matters for evaluating *any* Flux prompt claim:

> *"FLUX.2 [pro], [max], and [flex] **automatically enhance short prompts** by adding visual detail and context while
> preserving your original intent."* — [prompting_unified_technical](https://docs.bfl.ml/guides/prompting_unified_technical.md)
> *"On FLUX.2 [klein], **what you write is what you get** — be descriptive. Other FLUX.2 variants are more forgiving
> with short prompts."*
> *"FLUX.2 [klein] does **not** include prompt upsampling."*

Local [dev] has an opt-in upsampler
([docs](https://raw.githubusercontent.com/black-forest-labs/flux2/main/docs/flux2_with_prompt_upsampling.md)):
`--upsample_prompt_mode=local` (the same Mistral-Small-3.2-24B used for text encoding) or `=openrouter`. BFL's own
verdict on the local option, verbatim: *"This option requires no API keys but **may produce less detailed
expansions**"*; API-based *"generally produces better results by leveraging more capable models."* Scope: helps for
text-in-image, image-based instructions with overlaid text/arrows, code/math visualizations; *"For simple, direct
prompts (e.g., 'a red car'), prompt upsampling may not provide significant benefits."* Generation params:
`max_new_tokens=512, temperature=0.15, do_sample=True`. **No benchmark numbers published.**

Implication for the corpus: any prompt-technique result obtained via the BFL API or playground may be measuring the
**Mistral upsampler's rewrite**, not the model's response to the user's words. Only [klein] and un-upsampled local
[dev] give a clean read.

### 2.7 Negative prompts: confirmed absent, three ways `[OFFICIAL]`

1. *"**No negative prompts: FLUX.2 does not support negative prompts.** Focus on describing what you want, not what
   you don't want."* ([guide](https://docs.bfl.ai/guides/prompting_guide_flux2))
2. *"FLUX.2 has no negative prompts. Instead of 'no blur,' say 'sharp focus throughout.' Instead of 'no people,'
   describe an 'empty scene.'"*
3. Code-level: the `Flux2Pipeline.__call__` signature contains **no `negative_prompt` parameter at all**
   ([HF blog](https://huggingface.co/blog/flux-2)).

Generalized `[OFFICIAL]`: *"Most FLUX models do not support negative prompts. Even when they can process them, AI
models generally struggle with negation."* BFL publishes a replacement table (`"no people"` → *"empty", "deserted",
"solitary"*; `"no text"` → *"clean surfaces", "unmarked", "blank"*).

**Distillation matrix** `[OFFICIAL]`, from the [flux2 repo](https://github.com/black-forest-labs/flux2):

| Model | Step-distilled | Guidance-distilled |
|---|---|---|
| [klein] 4B / 9B / 9B-KV | yes | yes |
| [klein] **Base** 4B / 9B | **no** | **no** |
| FLUX.2 [dev] | no | yes |

The **Base klein** variants are the only FLUX.2 open weights where real CFG — and therefore a real negative prompt —
is architecturally coherent. BFL positions them for *"fine-tuning, LoRA training, research, and custom pipelines"*
with *"Higher output diversity than distilled models."* Distilled = 4 steps; Base = 50 steps.

**Platform contradiction worth teaching** `[LORE/vendor]`: fal's klein docs expose a `negative_prompt` parameter with
recommended contents (*"distorted features, unnatural proportions, extra limbs"*) —
<https://fal.ai/learn/devs/flux-2-klein-prompt-guide>. That is a wrapper-level field, not a model capability, and it
flatly contradicts BFL. Students hitting Flux via fal/Replicate will see a negative field that BFL says doesn't exist.

Adjacent research for few-step models `[TESTED]`: **VSF (Value Sign Flip)**,
[arXiv:2508.10931](https://arxiv.org/html/2508.10931v6) — negative guidance without a second forward pass, directly
relevant to 4-step klein.

### 2.8 JSON prompting and HEX colors

**JSON** `[OFFICIAL]` — BFL publishes a full schema and worked examples
([guide](https://docs.bfl.ai/guides/prompting_guide_flux2),
[usecase](https://docs.bfl.ml/guides/usecases_t2i_json_prompting.md)):

```json
{
  "scene": "overall scene description",
  "subjects": [{ "description": "...", "position": "where in frame", "action": "..." }],
  "style": "artistic style",
  "color_palette": ["#hex1", "#hex2", "#hex3"],
  "lighting": "...", "mood": "...", "background": "...", "composition": "...",
  "camera": { "angle": "...", "lens": "...", "depth_of_field": "..." }
}
```

Camera fields use numeric keys in the published examples: `"lens-mm": 85, "f-number": "f/5.6", "ISO": 200`. BFL's
stated equivalence, verbatim: **"FLUX.2 understands both formats equally well—choose based on your workflow needs."**
JSON is recommended for production/automation/multi-subject; prose for quick iteration.

> **Nothing found:** any A/B of JSON vs flattened prose at fixed seed, by BFL or anyone else. The "equally well" claim
> is `[OFFICIAL]`, unmeasured.

**HEX colors** — this is where the corpus should be most careful.

`[OFFICIAL]` claim: *"Specify brand colors via hex codes with precision matching. **No approximation**—get the exact
colors you need."* ([flux2_overview](https://docs.bfl.ml/flux_2/flux2_overview.md)). Official caveats: *"Hex codes work
best when clearly associated with specific objects. Vague references like 'use #FF0000 somewhere' may produce
inconsistent results."* and *"'The car is #FF0000' works better than 'use red #FF0000 in the image.'"*

`[TESTED]` counter-evidence, previous generation: **GenColorBench**
([arXiv:2510.20586](https://arxiv.org/html/2510.20586v1), CVPR 2026 poster) — **9.8K prompts**, hex and RGB formats,
graded against ISCC-NBS color naming at three granularities plus CSS3/X11. Baseline **FLUX** scores reported in
NumColor ([arXiv:2603.13547](https://arxiv.org/abs/2603.13547)): **13.82% at ISCC-L1** (vs 7.7% random over 13 coarse
categories), **7.74% at ISCC-L3**, **5.86% at CSS3/X11**. NumColor's fix raises these to 55.71 / 48.02 / 51.96.
Stated root cause, verbatim: *"This limitation stems from subword tokenization, which fragments color codes into
semantically meaningless tokens that text encoders cannot map to coherent color representations."*

**Critical caveat:** that baseline is **FLUX.1-era with T5/CLIP**, not FLUX.2 with Mistral-3. FLUX.2's hex ability is
plausibly a genuine improvement — BFL clearly trained for it. But **no independent ΔE-measured test of FLUX.2 hex
adherence exists — nothing found.** Honest corpus position: FLUX.2 hex support is `[OFFICIAL]`-claimed and visually
demonstrated by BFL; the only *measured* hex numbers in the literature are previous-generation and catastrophic
(5–14%). Do not repeat "exact color matching" as established fact.

Third-party `[LORE]`: fal claims *"FLUX 2 Pro is the only major model that honors hex codes literally"*
(<https://fal.ai/learn/devs/flux-2-vs-flux-1-what-changed>) — no method.

### 2.9 Multi-reference and character consistency `[OFFICIAL]`

Per-variant limits ([flux2_overview](https://docs.bfl.ml/flux_2/flux2_overview.md)): **[klein] up to 4**,
**[max]/[pro]/[flex] up to 8 (API) / 10 (playground)**, **[dev] recommended max 6**. Budget note: *"[pro] API has a 9MP
total limit for input+output. At 1MP output you can use up to 8 reference images, at 2MP output up to 7, and so on."*
The widely repeated "up to 10 references" is the **playground/marketing** number, not the API contract and not the
local recommendation.

Referencing technique `[OFFICIAL]`: *"You can reference the images by index (e.g., image 1, image 2) or by natural
language (e.g., the kangaroo, the turtle). For optimal results, the best approach is to use a combination of both
methods."*

Character consistency has **no special mechanism** — BFL's documented method is brute-force repetition:
*"Notice how Diffusion Man's description stays detailed and consistent across panels... **Repeat these details in
every panel prompt.**"* Each published panel prompt restates the full ~40-word character description. The claim of
*"the best character / product / style consistency available today"* is published with **no eval and no benchmark
table**.

### 2.10 What shipped since the corpus baseline `[OFFICIAL]`

The BFL [blog index](https://bfl.ai/blog) and [release notes](https://docs.bfl.ml/release-notes.md) terminate at
**2026-08-04**. Nothing found after that date.

**FLUX 3 — 2026-08-04. BFL is no longer image-only.** Release notes verbatim: *"FLUX 3 is our first video model: one
model trained across image, video, and audio, generating video with synchronized sound. Available now as a preview."*
Up to **20 seconds at FHD** (1920×1088 for 16:9), **24 fps**, single request; **synchronized audio** with multilingual
speech and lipsync; four modes on one endpoint (`t2v`, `i2v` with 1–10 pinned keyframes, `v2v`, `draft_enhance`);
`POST /v1/flux-3-video`. Blog: <https://bfl.ai/blog/flux-3> (2026-07-23), <https://bfl.ai/blog/flux-3-video>
(2026-08-04), <https://bfl.ai/blog/flux-3-mimic>. New prompting docs: `prompting_video_overview`,
`prompting_video_text_to_video`, `prompting_video_audio`, `prompting_video_image_to_video`,
`prompting_video_camera_terms`. **Not open weights as of 2026-08-15** — relevant to `new-models.md`, and to the video
corpus more than this one.

**FLUX.2 [klein] shipped 2026-01-15 — as five checkpoints, not one**
([blog](https://bfl.ai/blog/flux2-klein-towards-interactive-visual-intelligence)):

| Model | Params | Step-distilled | License |
|---|---|---|---|
| [klein] 4B | 4B | yes (4 steps) | **Apache 2.0** |
| [klein] 9B | 9B | yes (4 steps) | FLUX Non-Commercial |
| [klein] 9B KV | 9B | yes | FLUX Non-Commercial |
| [klein] Base 4B | 4B | no (50 steps) | **Apache 2.0** |
| [klein] Base 9B | 9B | no (50 steps) | FLUX Non-Commercial |

VRAM: blog and model card say **~13GB** for 4B (RTX 3090/4070+); the repo README says **~8GB** — an inconsistency in
BFL's own materials. 9B KV uses KV caching and is *"faster than 4B for multi-reference image editing"*. License
rename `[OFFICIAL]`: *"The 'FLUX [dev] Non-Commercial License' has been renamed to 'FLUX Non-Commercial License'...
No material changes have been made to the license."* Benchmarks `[TESTED — Elo vs latency and Elo vs VRAM Pareto
curves, "measured on a GB200 in bf16"]` claim 9B *"matches or exceeds models 5x its size."*

**Official quantized releases** `[TESTED — RTX 5080/5090, 1024×1024 T2I]`: FP8 up to **1.6× faster, 40% less VRAM**;
NVFP4 up to **2.7× faster, 55% less VRAM**. Same licenses. Note: **GGUF is not mentioned in any official BFL/HF
material** for FLUX.2 — community-only.

**Other releases, newest first** `[OFFICIAL]`, from [release notes](https://docs.bfl.ml/release-notes.md):

- **2026-07-17** — FLUX VTO v2 (virtual try-on), improved face preservation, 4MP inputs.
- **2026-06-09** — Outpainting `mode: "fast"` vs `"high"`.
- **2026-06-04** — klein **on-device on ASUS ProArt laptops**.
- **2026-05-21** — **FLUX Erase**, prompt-free masked removal, *powered by FLUX.2 Klein 9B*.
  `[TESTED — partial]`: *"On a held-out benchmark of **198 object-removal images**, FLUX Erase matches or outperforms
  frontier alternatives at substantially lower cost."* N stated; benchmark unpublished.
- **2026-05-14** — FLUX Outpainting, up to 4MP, no prompt needed.
- **2026-04-23** — **FLUX.2 LoRA inference public beta**: bring-your-own LoRA (AI-Toolkit, Diffusers) via
  `-finetuned` endpoints with `finetune_id` + `finetune_strength`. New training docs: `flux2_klein_training`.
- **2026-03-03** — **[pro] ~2× faster**; **`flux-2-pro` is now a frozen snapshot for reproducibility** while
  `flux-2-pro-preview` gets improvements first. *Anyone doing seed-reproducible testing must use the non-preview
  endpoints.*
- **2026-01-29** — [flex] up to 3× faster.
- **2025-12-16** — **FLUX.2 [max]** with **grounding search** (live web search).

**Architecture** `[OFFICIAL]`: [dev] is a **32B** flow-matching transformer, guidance-distilled, not step-distilled,
FLUX Non-Commercial License; text encoder **Mistral-Small-3.2-24B-Instruct-2506**; the **VAE is released separately
under Apache 2.0** (<https://bfl.ai/research/representation-comparison> — *"We re-trained the model's latent space
from scratch... a step towards solving the 'Learnability-Quality-Compression' trilemma"*). Diffusers-verified changes:
single text encoder instead of FLUX.1's two, multi-layer embedding stacking, AdaLayerNorm-Zero modulation params
**shared across all blocks**. **No FLUX.2 technical report or arXiv paper exists** — the official citation is a
`@misc` pointing at the blog.

**VRAM for FLUX.2 [dev]** `[OFFICIAL]`: full bf16 no offload **>80GB** (*"Even an H100 can't hold the text-encoder,
transformer and VAE at the same time"*); bf16 + `enable_model_cpu_offload()` ~62GB; 4-bit NF4 DiT + 4-bit text encoder
+ offload **~20GB**; 4-bit DiT + **remote text encoder** ~18GB; `group_offloading` ~**8GB VRAM but 32GB free RAM**.
Prebuilt: `diffusers/FLUX.2-dev-bnb-4bit`.

> **Privacy flag for the app:** the remote text-encoder path
> (`https://remote-text-encoder-flux-2.huggingface.co/predict`) computes embeddings **in the cloud** — the user's
> prompt leaves the machine. If Prompt Studio ever makes a "fully local" claim while recommending that config, the
> claim is false.

**FLUX.1 Krea [dev] / Kontext [dev]**: no updates found since release. BFL docs now carry *"For new projects, we
recommend FLUX.2."* on every Kontext page. Surviving Kontext advice `[OFFICIAL]`: specify what should **change**; use
quotes for text edits (`Replace 'joy' with 'BFL'`); be explicit about preservation; prefer specific verbs. Krea [dev]
remains the FLUX model used in academic evaluation (it is the one in PromptMoG).

---

## 3. Z-Image — tested evidence and release status

### 3.1 Truncation is real, silent, and has a chat-template overhead `[OFFICIAL]`

From [`pipeline_z_image.py`](https://raw.githubusercontent.com/huggingface/diffusers/main/src/diffusers/pipelines/z_image/pipeline_z_image.py):

- `def __call__(..., max_sequence_length: int = 512)` and `encode_prompt(..., max_sequence_length: int = 512)`
- `self.tokenizer(prompt, padding="max_length", max_length=max_sequence_length, truncation=True, ...)` —
  **silent tail truncation, no warning emitted.**
- **Overlooked detail:** the prompt is first wrapped in a chat template —
  `apply_chat_template(messages, tokenize=False, add_generation_prompt=True, enable_thinking=True)` — so ~20–25
  template tokens are consumed **before** the user's text.

**The canonical staff quote** `[STAFF]` — QJerry (Tongyi-MAI), [HF discussion #8](https://huggingface.co/Tongyi-MAI/Z-Image-Turbo/discussions/8),
2025-11-27:

> *"Due to better performance in online demo in concern of speed, we set text maximum length as 512 tokens, 600-1000
> words may results in 800-1333 tokens roughly (**0.75 word per token generally**, more detailly you may calculate
> your prompt with the tokenizer of **Qwen3-4B** yourself), or set `max_sequence_length` in pipeline calling to 1024
> when running the code locally, we've handled this case in our pipeline."*

```python
max_sequence_length=1024   ##  please add this line, the default is 512
```

Practical arithmetic: **512 tokens ≈ 380 English words; 1024 ≈ 760 words.** `[OFFICIAL]` Text encoder is Qwen3-4B
(Z-Image tech report §4.1, [arXiv:2511.22699](https://arxiv.org/abs/2511.22699)).

**1024 is a ceiling, not a knob** — issue #69 (closed 2025-12-08) reports that 2048/4096/8192 trigger a **CUDA
device-side assert**.

> **Nothing found:** (a) any published before/after image pair demonstrating truncation at the 512 boundary;
> (b) any measured Han-characters-per-token figure — **do not publish a Chinese word/char band as tested.** The
> corpus's current "120–500 Han characters" band remains `[SYNTHESIS]`.

### 3.2 Seed diversity — staff confirm it is a distillation trade-off, and it interacts with prompt length

`[STAFF]` JerryWu-code, [issue #16](https://github.com/Tongyi-MAI/Z-Image/issues/16#issuecomment-3587832445),
2025-11-28:

> *"(1) In the way of your understanding, using short prompts work better for diversity with less words describing
> their attributes & identity, coz this scenario give more spaces for the noise latent (controlled by random seed) to
> effect \"unprompted\" part. But noted our model works best for long and detailed prompt ~, so you may also consider
> use lots of short prompts and then use different LLMs models to enhance it... (2) Yeah, the diversity of the base
> model would be better."*

Follow-up, [issue #27](https://github.com/Tongyi-MAI/Z-Image/issues/27#issuecomment-3592317395), 2025-11-30:
*"it's actually a trade-off."*

**This is the key teaching point and it is counter-intuitive: the same long-prompt advice that maximizes quality is
what kills seed diversity.** A fully-specified prompt leaves no unconstrained latent for the seed to act on. Note that
this is the *same mechanism* PromptMoG measures across models (§2.3) — independent confirmation from two directions.

`[OFFICIAL]` Diversity is a documented product-tier property. README model zoo: **Turbo = Low, Z-Image = Medium,
Omni-Base = High**. Tech report §4.4: SFT means *"shifting the model from a diversity-maximizing regime to a
quality-maximizing operating point"*; §4.5: distillation makes the student *"'collapse' its probabilistic path into a
deterministic and highly efficient inference process."*

**Measured workarounds** `[TESTED — ComfyUI A/B across sampler/scheduler sweeps and three workflow families, images
shown]`, Wei Mao, MyAIForce, 2025-12-21, <https://myaiforce.com/z-image-turbo-improve-variation/>:

| Workaround | Result |
|---|---|
| Sampler/scheduler changes | *"Faces usually remain the same… Overall style barely changes"* — limited |
| Two-KSampler, **CFG < 1 on the first sampler** | Real diversity gain, but *"randomness is not selective"* — buildings appear in beach scenes, skin/limb noise, prompt drift |
| `SeedVarianceEnhancer` node (noise into text embeddings) | Cleaner, but *"Faces remain very similar… Clothing styles often repeat."* |
| **Flux Schnell → Z-Image-Turbo img2img** (shared latent space) | **Winner.** Schnell 768×1024, 4 steps, 8 images in 49 s; Turbo repaints at 1536×2048; dpmpp_sde @ 5 steps, linear_quadratic scheduler |

Author's conclusion, verbatim: *"Z Image Turbo's lack of variation is **not a minor tuning issue—it's a structural
problem rooted in the first sampling step**."*

### 3.3 Release status — one correction, one confirmation `[OFFICIAL]`

| Model | Status 2026-08-15 | Date |
|---|---|---|
| Z-Image-Turbo | Released | 2025-11-26 |
| **Z-Image (base)** | **Released** | **2026-01-27** |
| Z-Image-Edit | *To be released* | — |
| Z-Image-Omni-Base | *To be released* | — |

README news entry: *"[2026-01-27] 🔥 Z-Image is released!"* — [HF](https://huggingface.co/Tongyi-MAI/Z-Image) (created
2026-01-23; 22,180 downloads, 1,188 likes), ModelScope (175,382 downloads, last updated 2026-01-28). Official
parameters confirm the corpus's Base recipe: 512×512–2048×2048, **guidance 3.0–5.0**, **28–50 steps**, negative
prompts *"Strongly recommended"*, `cfg_normalization=False` for stylism / `True` for realism.

**Edit and Omni-Base remain literally `*To be released*`** in the model-zoo table. The HF API `?author=Tongyi-MAI`
returns **exactly 4 repos** (Z-Image-Turbo, Z-Image, MAI-UI-2B, MAI-UI-8B). ModelScope `Tongyi-MAI/Z-Image-Edit` and
`Tongyi-MAI/Z-Image-Omni-Base` return nothing.

**The silence is total and worth recording.** ~20 GitHub issues and ~8 HF discussions ask about Edit; **zero
maintainer replies to any of them**, across ~9 months. Newest issue is **#172** (2026-08-09).
[Issue #169](https://github.com/Tongyi-MAI/Z-Image/issues/169) (2026-06-26) has two non-staff comments only. **Last
staff comment anywhere in the project: 2026-03-25.** No Z-Image 2.0. **Nothing found** for any official cancellation.

> **Source hazard:** the official blog <https://tongyi-mai.github.io/Z-Image-blog/> still carries the **now-false**
> claim *"We are publicly releasing two specialized models on Z-Image: Z-Image-Turbo for generation and Z-Image-Edit
> for editing. The model code, weights, and an online demo are now publicly available."* **Do not cite the blog for
> release status** — cite the repo model-zoo table.

`[SPECULATION — community, single comment]` Issue #169, `GreenShadows`, 2026-07-12: *"It's dead. I think Alibaba
ordered the cancellation of all open-source initiatives."* Correlates with the Qwen-Image open-weights pause (§4.4)
but is not evidence.

`[OFFICIAL]` Archived prompt enhancer: the original Space URL now **404s**. Working archive mirror:
<https://web.archive.org/web/20251127201114/https://huggingface.co/spaces/Tongyi-MAI/Z-Image-Turbo/blob/main/pe.py>.
Staff used **Qwen3-Max-Preview** to drive it.

---

## 4. Qwen-Image — tested evidence and release status

### 4.1 The magic suffix was quietly dropped in 2512 `[OFFICIAL]`

Original [README](https://github.com/QwenLM/Qwen-Image):

```python
positive_magic = {"en": ", Ultra HD, 4K, cinematic composition.",
                  "zh": ", 超清，4K，电影级构图."}
... pipe(prompt=prompt + positive_magic["en"], ...)
```

`src/examples/tools/prompt_utils.py` ends both rewriters with `return polished_prompt + magic_prompt` — note there is
**no separator**, the suffix is concatenated flush against the last word.

**In `prompt_utils_2512.py`, `magic_prompt = "Ultra HD, 4K, cinematic composition"` is still assigned but the function
returns `return polished_prompt` — the variable is dead code.** The 2512 README example likewise omits
`positive_magic` and substitutes a negative prompt:

```text
低分辨率，低画质，肢体畸形，手指畸形，画面过饱和，蜡像感，人脸无细节，过度光滑，画面具有AI感。构图混乱。文字模糊，扭曲。
```

**Teaching takeaway:** for Qwen-Image (Aug 2025) the suffix is officially prescribed; for **Qwen-Image-2512 the
official pipeline abandoned it in favour of an anti-"AI look" negative prompt.** That version change is the strongest
available signal on whether the suffix still helps.

> **Nothing found:** any A/B ablation measuring the suffix's effect. Report it as untested in both directions.

### 4.2 ZH vs EN — official benchmark numbers, no controlled A/B `[OFFICIAL]`

All from the Qwen-Image technical report, [arXiv:2508.02324](https://arxiv.org/html/2508.02324v1).

**Table 10 — LongText-Bench** (Text Accuracy, 0–1):

| Model | EN | ZH |
|---|---|---|
| **Qwen-Image** | **0.943** | **0.946** |
| GPT Image 1 [High] | 0.956 | 0.619 |
| Seedream 3.0 | 0.896 | 0.878 |
| FLUX.1 [dev] | 0.607 | **0.005** |
| OmniGen2 | 0.561 | 0.059 |
| HiDream-I1-Full | 0.543 | 0.024 |

Qwen-Image is the only model with **no EN–ZH gap** (+0.003 toward Chinese). GPT Image 1's gap is **−0.337**.
FLUX.1 [dev] at **0.005 ZH** is effectively zero — worth teaching as the hard reason to route Chinese text to Qwen or
Z-Image rather than Flux.

**Tables 5/6 — OneIG-Bench.** Qwen-Image EN: Alignment 0.882, **Text 0.891**, Reasoning 0.306, Style 0.418,
**Diversity 0.197**, Overall 0.539. ZH: Alignment 0.825, **Text 0.963**, Reasoning 0.267, Style 0.405, Diversity
0.279, Overall 0.548. **Qwen-Image renders Chinese text better than English** (0.963 vs 0.891) — the inverse of every
competitor except Seedream. Note the low EN Diversity (0.197).

**Table 9 — ChineseWord** (accuracy %, 8,105 characters, one character per image):

| Model | L1 (3500 chars) | L2 (3000) | L3 (1605) | Overall |
|---|---|---|---|---|
| **Qwen-Image** | **97.29** | **40.53** | **6.48** | **58.30** |
| GPT Image 1 [High] | 68.37 | 15.97 | 3.55 | 36.14 |
| Seedream 3.0 | 53.48 | 26.23 | 1.25 | 33.05 |

> **Nothing found:** any controlled A/B of the *same semantic prompt* written in ZH vs EN. The only datapoint is
> anecdotal and fully confounded `[LORE]` — HF Turbo discussion #8, non-staff user `urtuuuu`, 2025-11-30: ran a Chinese
> demo prompt on Z-Image-Turbo, got poor text, then ran it through `pe.py` which returned an *English* expansion and
> *"the result was much better. Maybe it just prefers english promt 😀"*. Language, length **and** detail all changed
> at once. **The corpus's language-routing guidance remains correct for exact glyphs and native vocabulary, but there
> is still no fixed-seed evidence for a general ZH-vs-EN aesthetics advantage in either direction.**

### 4.3 Text-in-image: the real threshold is rarity, not length

**LongText-Bench methodology** `[OFFICIAL]` (from X-Omni, [arXiv:2507.22058](https://arxiv.org/abs/2507.22058) App. A —
the benchmark's origin): 160 prompts, 8 text-rich scenarios (signboards, labelled objects, printed materials, web
pages, slides, posters, captions, dialogues), 10 short + 10 long each. **English: "short" = 10–30 words, "long" =
30–50 words. Chinese: "short" = 20–40 characters, "long" typically >60 characters.** Metric = Text Accuracy via
**Qwen2.5-VL-7B OCR**, 4 images per prompt.

**Multi-string degradation — Table 8 (CVTG-2K), Word Accuracy by number of text regions** `[OFFICIAL]`:

| Regions | 2 | 3 | 4 | 5 | avg |
|---|---|---|---|---|---|
| Qwen-Image | 0.8370 | 0.8364 | 0.8313 | 0.8158 | 0.8288 |
| **Z-Image** | 0.9006 | 0.8722 | 0.8652 | 0.8512 | **0.8671** |
| **Z-Image-Turbo** | 0.8872 | 0.8662 | 0.8628 | 0.8347 | **0.8585** |
| GPT Image 1 [High] | 0.8779 | 0.8659 | 0.8731 | 0.8218 | 0.8569 |
| Seedream 3.0 | 0.6282 | 0.5962 | 0.6043 | 0.5610 | 0.5924 |
| FLUX.1 [dev] | 0.6089 | 0.5531 | 0.4661 | 0.4316 | 0.4965 |

**Multi-string degradation is mild** — only −2 to −5 points going from 2 to 5 regions on both Alibaba families, versus
**−17.7 points on FLUX.1 [dev]**. And a finding that is not widely known: **Z-Image beats Qwen-Image on English
multi-region text.**

**Z-Image LongText-Bench** `[OFFICIAL]` (tech report Table 6): Z-Image 0.935 EN / 0.936 ZH; **Z-Image-Turbo 0.917 EN /
0.926 ZH**. Distillation costs only 0.018 EN / 0.010 ZH — i.e. Turbo is essentially as good at text as Base.

**Thresholds to actually teach:**

1. **Rarity, not length, is the cliff.** ChineseWord: **97% → 41% → 6%** across frequency tiers. A rare Han character
   fails ~93% of the time even on the best model. This is the number that should drive validator warnings.
2. **Length degrades gently** up to LongText-Bench scale (~50 EN words / >60 Han characters in one image) and up to
   **5 text regions**.
3. `[OFFICIAL]` The paper states **no character-count limit** and never claims accuracy degrades with longer strings.
   **Any "N characters max" figure in circulation is `[LORE]`** — including any the corpus may currently carry.

**Quoting technique** `[OFFICIAL]`, from the `prompt_utils_2512.py` system prompt, verbatim:

> *"**enclose every piece of displayed text in English double quotation marks (\" \")**… Accurately describe the
> text's content, position, layout direction (horizontal/vertical/wrapped), font style, color, size, and presentation
> method (e.g., printed, embroidered, neon)."*
> *"If the prompt implies the presence of specific text or numbers (even indirectly), explicitly state the **exact
> textual/numeric content**… Avoid vague references like 'a list' or 'a roster'."*
> *"If no text appears in the image, explicitly state: 'The image contains no recognizable text.'"*
> *"For non-English text… **retain the original text and specify the language**."*

The Chinese rewriter mandates Chinese double quotes 「""」 and the sentinel 「图像中未出现任何可识别文字」.

**Why quoting works, mechanistically** `[OFFICIAL]` — Z-Image tech report §3.1 on OCR-CoT captioning: *"including
explicit OCR information in image captions is inextricably bound with accurate text rendering… by first explicitly
recognizing all optical characters in the image and then generating a caption based on the OCR results. This
effectively mitigates missing texts… especially for the cases where texts are very long/dense."* Plus: *"we force the
OCR results to remain in their original languages **without any translation**, avoiding them being falsely rendered in
their translated form"* — i.e. **never translate the target string in your prompt.** This is a training-data-level
justification for the corpus's existing byte-for-byte text-preservation rule.

**Font control** `[OFFICIAL]`: the official rewriter instructs describing font **style categories** ("handwritten,
serif, calligraphy, pixel art style") and, for edits, *"If font is specified, keep the original language of the
font."* Qwen-Image-Bench includes a **"Font"** L3 facet.

> **Nothing found:** any evidence that naming a specific font *family* (e.g. "Helvetica", "Futura") works. **Teach
> style-category naming, not font names.**

### 4.4 Qwen-Image releases — the open-weights line stopped in December 2025 `[OFFICIAL]`

**Open weights** (HF `?author=Qwen&search=Image`, exhaustive — 7 repos):

- **Qwen-Image-2512** (2025-12-30) — latest open T2I. Apache 2.0. Claimed *"ranks as the strongest open-source image
  model"* in 10,000+ AI Arena blind rounds. 50 steps, `true_cfg_scale=4.0`, aspect presets 1328×1328 / 1664×928.
- **Qwen-Image-Edit-2511** (2025-12-17) — latest open edit model. 40 steps, `true_cfg_scale=4.0`,
  `guidance_scale=1.0`. New: multi-person consistency, **built-in community LoRAs** (lighting, novel view),
  geometric reasoning / construction lines.
- **Qwen-Image-Layered** (2025-12-17, [arXiv:2512.15603](https://arxiv.org/abs/2512.15603)) — layered decomposition.
  **Likely new to the corpus.**
- **Qwen-Image-Bench / "Q-Judger"** (2026-05-21, [arXiv:2605.28091](https://arxiv.org/abs/2605.28091)) — **new and
  directly useful**: a Qwen3.6-27B-based T2I judge, 5 pillars / 23 sub-capabilities / 56 facets, scores 0/60/100,
  **Spearman ρ = 0.92 vs human experts (N=18)**. Model + 1000-prompt dataset are open. This is a ready-made
  evaluation harness if Prompt Studio ever wants to run its own fixed-seed grids.

**Closed / API-only, no weights, none promised:**

- **Qwen-Image-2.0** — 2026-02-10. README highlights verbatim: *"Supports 1k-token instructions for direct generation
  of professional infographics"*; *"Native 2K resolution support"*; *"unifying image generation and editing in a
  single mode"*; *"Lighter Model Architecture – Smaller model size with faster inference speed."* Alibaba Model Studio
  docs (updated 2026-07-15) give the real cap: *"The `qwen-image-2.0` series accept up to **1,300 tokens**. Other
  models accept up to 800 tokens. **The system truncates excess tokens.**"* Default resolution **2048×2048**, range
  512²–2048². Same model ID serves T2I and edit. **The widely repeated "7B" parameter figure is unsourced —
  `[SPECULATION]`, do not repeat it.**
- **Qwen-Image 3.0 / 3.0-Pro** — surfaced in **ComfyUI v0.32.0, 2026-08-11**, under *Partner Node Updates* (API nodes,
  not open models): <https://docs.comfy.org/changelog>. Verified in `comfy_api_nodes/nodes_qwen.py`:
  `QWEN_IMAGE_MODELS = ["qwen-image-3.0-pro", "qwen-image-3.0"]`, `MAX_AREA = 6553600` (2560×2560), aspect 1:8–8:1,
  1–3 reference images for edit, `is_api_node=True`. **This is the newest item in this entire addendum (4 days before
  the corpus baseline) and it is cloud-only.**
- Qwen-Image-Bench evaluates **"Qwen Image 2.0 Pro"** and reports it **ranks fifth** of 18 models; GPT Image 2 leads at
  64.7 overall.

**Qwen-Image-Edit-2512 or any later open edit checkpoint: does not exist.** Nothing on HF, README, or ModelScope.

**Qwen-Image-Lightning** `[OFFICIAL]` (<https://github.com/ModelTC/Qwen-Image-Lightning>):

- **2026-01-01: Qwen-Image-2512-Lightning-4steps-V1.0** (fp32 + bf16) — newest.
- 2025-12-22: Qwen-Image-Edit-2511-Lightning-4steps-V1.0 (+ fused fp8).
- Still on the todo list, **unchecked**: `Qwen-Image-Edit-Lightning-4/8steps-V2.0`, `Qwen Edit 2511 ComfyUI Workflow`.
  **No 8-step variant exists for 2511 or 2512 — 4-step only.**

`[TESTED — visible methodology: `generate_with_diffusers.py`, `--base_seed 42`, side-by-side grids]` Distilled models
give *"12–25× speed improvement with no significant loss in performance in most cases"*, with named failure modes:
**dense/small text** (*"the base model is more likely to produce better results"*), **hair-like details**
(*"noticeably blurred or excessively sharpened"*), and highly complex scenes (all variants fail). Documented text
bad-cases: an extra "更" generated by the 8-step model; a missing "o" by 4-step; a misspelled "Lightx2V" by the base.
An unusually honest caveat worth quoting to students: *"Even for the same prompt at different resolutions, the
relative performance ranking of the models may differ substantially."* V2 vs V1: *"V2.0 produces images with reduced
over-saturation, resulting in improved skin texture and more natural-looking visuals."*

**Actionable rule:** if the task is dense or small text, **do not use a Lightning LoRA** — this is a prompt-independent
routing decision the validator can make.

**New Tongyi image models:** nothing found beyond the above. Tongyi-MAI's only non-Z-Image releases are
**MAI-UI-2B / MAI-UI-8B** (2025-12-25, qwen3_vl UI-agent VLMs) — not image generators.

### 4.5 Cloud vs local boundary — state this explicitly in the app

- **Local weights available today:** Z-Image-Turbo, Z-Image, Qwen-Image, Qwen-Image-2512, Qwen-Image-Edit / -2509 /
  -2511, Qwen-Image-Layered, plus Lightning LoRAs.
- **Cloud-only, hidden rewriter, do not generalize prompting advice from:** Qwen Chat, DashScope/Model Studio
  `qwen-image-2.0*`, `qwen-image-3.0*`, `qwen-image-edit-max`.
- Both official Qwen pipelines route prompts through a **qwen-plus LLM rewriter** (`prompt_utils.py` /
  `prompt_utils_2512.py`) and edits through **qwen-vl-max-latest**. **Qwen Chat output is never a clean test of raw
  prompt behavior.** Z-Image's equivalent is `pe.py`, driven by Qwen3-Max-Preview.

---

## 5. Photography and composition vocabulary — measured, and it mostly fails

**Headline: aperture, focal length, shutter speed and numeric viewpoint angle, expressed in plain prompt text,
perform at or below chance. This is measured, replicated across three independent papers, and it contradicts almost
all prompt-engineering folklore — including BFL's own official guidance.**

### 5.1 The three measurements `[TESTED]`

**Bokeh Diffusion** (SIGGRAPH Asia 2025, [arXiv:2503.08434](https://arxiv.org/abs/2503.08434)). Method: 20 prompts × 5
bokeh conditions = 100 samples; accuracy = Pearson correlation of the Laplacian-variance trend against a physically
rendered reference (LVCorr). Baselines obtained bokeh via prompt descriptors.

| Model | LVCorr |
|---|---|
| SD1.5 | **−0.410** |
| SD3.5 | **−0.088** |
| FLUX | **−0.041** |
| *(physical reference)* | 1.000 |
| *(their conditioned method)* | 0.901 |

Verbatim: *"changing from a 'wide aperture' to a 'narrow aperture' might yield not just a different depth-of-field but
**a new arrangement of objects**."* Negative correlations mean the models were, if anything, going the *wrong* way.

**Fine-grained Defocus Blur Control** (WACV 2026, <https://arxiv.org/html/2510.06215v1>). Method: "Blur Monotonicity"
over 8 apertures f/1.8–f/22; **chance ≈ 50**.

| Condition | Score |
|---|---|
| **SDXL with EXIF-as-text (`f/2.8` in prompt)** | **48.47** *(below chance)* |
| **SDXL with prose ("shallow depth of field")** | **53.80** |
| Their conditioned model | 93.91 |

Verbatim: *"The SDXL baselines… all struggle to generate different defocus effects as aperture and focal distance are
changed."* Note the practical detail: **prose beat EXIF notation**, but both are near chance.

**Generative Photography** (CVPR 2025 Highlight, <https://arxiv.org/html/2412.02168v2>). Method: CorrCoef against
physical simulation across four axes.

| Model | Bokeh | Focal Length | Shutter Speed | Color Temp |
|---|---|---|---|---|
| SD3 | 0.2492 | 0.2356 | 0.2731 | 0.2312 |
| FLUX | 0.2006 | 0.2003 | 0.2398 | 0.2363 |

Verbatim: *"the prompt 'quiet mountain trail, 24mm lens' and another prompt 'quiet mountain trail, 70mm lens' will
have **no differences in the field of view (FoV)** but different rocks and trees."* That sentence is the single best
one-line summary of the whole topic: **lens vocabulary re-rolls the scene; it does not change the optics.**

**Even frontier models fail on numeric angles** `[TESTED — qualitative]`: CVPR 2026 "Camera Control via Learning
Viewpoint Tokens" (<https://arxiv.org/html/2604.19954v1>), Fig. 2: *"GPT5 viewpoint failures… 'A white sedan seen from
45°/30° to the left/right of the front view'. **All three prompts result in nearly identical orientations.**"*

### 5.2 What official docs claim, for contrast `[OFFICIAL]`

BFL is unambiguous and prescriptive: *"For photorealism, specify camera models, lenses, and film stocks. **'Shot on
Fujifilm X-T5, 35mm f/1.4' produces more authentic results than just 'professional photo.'**"* It publishes a full
**Camera & Lens Cheat Sheet** ([prompting_unified_reference](https://docs.bfl.ml/guides/prompting_unified_reference.md))
asserting f/1.4–f/2.8 → blurry background; f/8–f/16 → everything sharp; 24mm wide; 35mm documentary; 50mm neutral;
85mm portrait compression; 135mm+ strong compression; ISO 100 clean; ISO 1600–3200 grainy; anamorphic → oval bokeh.
Style table entries include `"shot on Kodak Portra 400, natural grain, organic colors"`, `"shot on Sony A7IV"`,
`"Shot on Hasselblad X2D, 80mm lens, f/2.8"`.

**Not one of these claims is accompanied by a fixed-seed A/B, a grid, or any measurement.** They are `[OFFICIAL]`
assertions — authoritative lore.

**How to reconcile.** These vocabularies are not useless; they are **style/genre tokens, not optical controls.** Saying
"85mm f/1.4 portrait" reliably pulls the model toward the *aesthetic cluster* of portrait photographs (background
separation, framing, skin rendering conventions) because those captions co-occurred with those images. It does not
control focal compression or depth of field as a physical parameter. The corpus should say exactly that, and should
**not** validate lens/aperture strings as constraints the user can rely on.

### 5.3 Benchmarks do not test this, and the judges can't judge it `[TESTED]`

Confirmed absent: GenEval, T2I-CompBench++, DPG-Bench, HEIM, EvalMuse-40K, GenAI-Bench, TIFA, PartiPrompts, DrawBench,
OneIG-Bench — **none has a camera/lens/exposure category.** Partial exceptions: **GenSpace**
([arXiv:2505.24870](https://arxiv.org/abs/2505.24870)) has a Camera *Pose* sub-domain where the best models plateau
~60% on basic front/back/left/right; **Qwen-Image-Bench** (2026) has "Camera/Lens Style" and "Cinematic Style" facets,
but they are **LLM-judge aesthetic rubrics, not physical verification**, and no per-facet breakdown is published.

**Why the gap exists** — the graders are the bottleneck. **CineTechBench**
(<https://arxiv.org/html/2505.15145v1>) focal-length *recognition* accuracy: **GPT-4o 33.33, Gemini-2.5-Pro 36.67,
InternVL2.5 20.00** (vs GPT-4o 93.33 on Color). **ShotBench**
([arXiv:2506.21356](https://arxiv.org/abs/2506.21356)): GPT-4o averages **59.3%** across shot size / framing / angle /
lens / lighting / composition / movement; *"approximately half of the evaluated models attain an overall accuracy
below 50%."* You cannot auto-grade what the VLM cannot see.

**Constructive corollary:** explicitly-conditioned models reach 0.86–0.97 correlation and 93.91 monotonicity. **The
capability is learnable and is simply absent from the text encoders.** So the right product answer is a control input,
not a better adjective.

### 5.4 Aspect ratio and shot size

> **Nothing found:** any head-to-head measurement of "wide shot" in the prompt vs setting the latent aspect ratio.
> **Nothing found:** any benchmark checking whether "extreme close-up" vs "wide shot" produces the correct
> subject-to-frame ratio in still T2I. The closest is **Auteur** (2026,
> [arXiv:2606.01900](https://arxiv.org/abs/2606.01900)) with an F-Scale shot-scale-conformity metric — **video only**.
> **Nothing found:** film-stock adherence (Portra 400, Cinestill 800T) — zero quantitative sources, everything is
> preset marketing. **Nothing found:** named-lens adherence with a metric; the only artifact is an eyeball-grade
> Midjourney grid (n=30 lenses × 1 prompt, no metric, <https://hackernoon.com/a-midjourney-camera-lens-experiment-the-results>).
> **Nothing found:** ISO/grain adherence.

Measured adjacent work covers aspect-ratio **artifacts** only: ElasticDiffusion (SD *"fails to maintain its
performance at different aspect ratios during inference"*) and Native-Resolution Image Synthesis (*"truncation bias
from training predominantly on square or tightly cropped image samples"*). **The claim "aspect ratio functions as a
compositional command" is `[LORE]`.**

BFL's official position `[OFFICIAL]`, unmeasured: *"Choose the ratio that matches the compositional intent of your
scene. **Mismatched ratios force the model to either crop or pad the composition.**"* Resolution limits: min 64×64,
max 4MP, **dimensions must be multiples of 16**, up to 2MP recommended.

---

## 6. Rewriter evidence — the most consequential section for this app

### 6.1 The one clean rewriter-size sweep `[TESTED]`

*"Improving Text-to-Image Generation with Input-Side Inference-Time Scaling"*,
[arXiv:2510.12041](https://arxiv.org/abs/2510.12041) (HTML: <https://arxiv.org/html/2510.12041v2>).

Methodology, fully visible: iterative DPO (LoRA r=64, 6 rounds, 60k prompts from Pick-a-Pic v2 + T2I-CompBench++),
reward = Qwen2.5-VL-72B as judge. Generators: FLUX.1-schnell, FLUX.1-dev, SD-3.5-medium, JanusPro. Evaluation:
**GPT-4o pairwise win rate vs DALL·E 3 on 500 Pick-a-Pic v2 prompts**, plus GenEval / T2I-CompBench++ / TIFA /
LAION-aesthetic / COCO-30k FID.

**Table 5 (FLUX.1-schnell, GPT-4o win rate vs DALL·E 3):**

| Rewriter backbone | Quality | Aesthetics | Alignment | **Avg** |
|---|---|---|---|---|
| **no rewriter** | 0.469 | 0.314 | 0.419 | **0.401** |
| Qwen2.5 14B | 0.455 | 0.275 | 0.452 | **0.394** |
| Qwen2.5 32B | 0.454 | 0.277 | 0.431 | **0.387** |
| Qwen2.5 72B | 0.458 | 0.305 | 0.465 | **0.409** |
| Qwen3 8B | 0.511 | 0.376 | 0.491 | **0.459** |
| Qwen3 14B | 0.490 | 0.362 | 0.473 | **0.442** |
| Qwen3 32B | 0.517 | 0.424 | 0.534 | **0.492** |
| DeepSeek-R1-Distill 8B | 0.527 | 0.402 | 0.461 | **0.463** |
| DeepSeek 32B | 0.499 | 0.405 | 0.503 | **0.469** |
| DeepSeek 70B | 0.502 | 0.380 | 0.506 | **0.463** |
| **Llama3 3B** | 0.517 | 0.455 | 0.524 | **0.499** |
| **Llama3 8B** | 0.511 | 0.441 | **0.565** | **0.506** |
| Llama3 70B | 0.494 | 0.476 | 0.561 | **0.510** |

**Three findings that should shape the product:**

1. **Size barely matters within a family.** Llama-3 **3B = 0.499, 8B = 0.506, 70B = 0.510** — an 0.011 absolute spread
   across a 23× parameter range. Llama3-8B *beats* 70B on alignment (0.565 vs 0.561); 3B beats 70B on quality (0.517
   vs 0.494). GenEval (Table 2, FLUX.1-schnell): baseline 0.67 → **3B 0.73, 8B 0.74, 70B 0.75** — the 3B captures ~75%
   of the headroom. **A 7–8B local rewriter is a defensible product decision, with published numbers behind it.**
2. **Family matters far more than size.** Qwen2.5-72B (0.409) loses badly to Llama3-3B (0.499).
3. **Reasoning-tuned models are worse, not better.** Verbatim: *"Models tuned for explicit reasoning (e.g.,
   DeepSeek-R1-Distilled series) underperform Llama-3-70B-Instruct overall, especially on aesthetics, suggesting that
   reasoning-oriented tuning can conflict with aesthetic goals."* **Do not assume a "thinking" local model makes a
   better rewriter** — this independently supports the corpus's existing "no printed chain-of-thought" rule.

The paper's own prose is more conservative than the table: *"Larger backbones generally yield higher averaged GPT-4o
win rates... smaller models can occasionally lead on a single axis (e.g., alignment or aesthetics), reflecting
inherent trade-offs."*

**Caveat that matters enormously here:** every number above is for a **DPO-tuned** rewriter, not an off-the-shelf
instruct model.

### 6.2 Evidence that rewriting HURTS `[TESTED]`

This is the section that most directly challenges the app's premise, and it is all from the same paper unless noted.

1. **Naive zero-shot rewriting is worse than no rewriting.** Table 10: **Zero-Shot avg 0.370 vs no-rewriter 0.401** —
   worse on all three axes (Quality 0.431 vs 0.469, Aesthetics 0.263 vs 0.314, Alignment 0.417 vs 0.419). *This is the
   most important single number for anyone bolting an un-tuned local 8B onto a T2I pipeline.*
2. **Two rewriter backbones scored below baseline** even after tuning (Qwen2.5-14B 0.394, Qwen2.5-32B 0.387 vs 0.401).
3. **Aesthetics-optimized rewriting destroys fidelity.** Verbatim: *"increasing [aesthetics] from 0.476 to 0.818, but
   simultaneously **reduces alignment from 0.561 to 0.424**… the aesthetics reward often enriches scenes by
   introducing additional objects or ornamentation, which can dilute the main subject."* Table 16 case study:
   `"a low light photo of a city at night"` → rewritten to *"…at **dusk**… vibrant purple and blue night sky"*
   (contradicting the low-light request); `"Fat black man in suit watching iguanas"` → the rewriter **dropped "fat"
   and "suit"** and invented a golden chair, fountains, stone statues, waterfalls and gems. Textbook hallucinated
   content plus lost user constraints.
4. **Whole generators where rewriting fails:** JanusPro on GenEval, baseline **0.79 → ICL 0.68 → their method 0.68**
   (Table 9).
5. **VLM-driven iterative refinement underperforms a plain rewrite:** Idea2Img on FLUX.1-dev GenEval **0.69**, below
   the *un-rewritten* baseline 0.70 and below zero-shot rewrite 0.73 / ICL 0.74 (Table 4).
6. **Over-iteration degrades:** *"Beyond round six… image quality and aesthetics begin to decline, while text-image
   alignment continues to improve."*
7. **Diversity collapse** (PromptMoG, §2.3; Z-Image staff, §3.2) — expansion buys fidelity and pays in seed-to-seed
   variation.

**Design implications for Prompt Studio:**

- Ship a **no-rewrite / minimal-normalize** path and make it the default for prompts that are already specific.
- Constrain the rewriter with the **schema + invariant preservation** design already in
  `_cross/rewriter-technique.md` — that architecture is *exactly* what the failure modes above argue for, and this
  evidence upgrades it from a style preference to a correctness requirement.
- Add a hard **"do not drop user adjectives"** post-check. The "fat / suit" deletion is a validator-detectable failure:
  every content word in the user's input should survive into the output or be flagged.
- Add a **"do not contradict"** check for lighting/time-of-day (the low-light → dusk failure).
- Cap expansion. Do not iterate past a small number of passes.

### 6.3 Prior art worth naming

- **Promptist** (Microsoft, NeurIPS 2023,
  [paper](https://proceedings.neurips.cc/paper_files/paper/2023/file/d346d91999074dd8d6073d4c3b13733b-Paper-Conference.pdf))
  `[TESTED — secondary reproductions]`: **GPT-2, 117M parameters**, SFT + RL, for SD v1.4. Reported aesthetic 6.15
  (DiffusionDB) / 6.09 (COCO), CLIP relevance 0.25, PickScore 53.4–53.8%. **A 117M rewriter beat manual prompt
  engineering in 2022 — this task has never needed a big model.**
- **BeautifulPrompt** (EMNLP 2023 Industry, [arXiv:2311.06752](https://arxiv.org/abs/2311.06752)) `[OFFICIAL]`:
  BLOOM-based, RL from PickScore + aesthetic. **PickScore 20.84, Aesthetic 6.52, HPS 0.203** vs MagicPrompt PickScore
  20.11 and ChatGPT aesthetic 5.92. 143k prompt pairs released.
- **RePrompt** (Microsoft, [arXiv:2505.17540](https://arxiv.org/abs/2505.17540)) `[OFFICIAL]`: RL on **Qwen2.5-3B**,
  GPT-4V as reward VLM, **8×A100 for ~6 hours**. Reports **+77.1% relative on GenEval Position** and **+22.2% on
  Counting** over the Qwen2.5-3B-enhanced baseline; GenEval overall 0.76 on FLUX.1-dev. A 3B RL-tuned rewriter is a
  genuinely reproducible project at this scale.
- **PromptEnhancer / V2** (Tencent Hunyuan, [arXiv:2509.04545](https://arxiv.org/abs/2509.04545), now **CVPR 2026**:
  [openaccess](https://openaccess.thecvf.com/content/CVPR2026/html/Wang_PromptEnhancer_Taming_Your_Rewriter_for_Text-to-Image_Generation_via_Fine-Grained_Reward_CVPR_2026_paper.html))
  `[OFFICIAL]`: SFT → GRPO against **AlignEvaluator**, a reward model over a **24-keypoint taxonomy of T2I failure
  modes**. On HunyuanImage 2.1: **mean accuracy 65.9% → 71.0%, +5.1pp across 24 dimensions** — but the project page
  notes the per-category chart shows *"regressions (red)"* in some categories. **Open weights: PromptEnhancer-7B**
  (~13GB, *"balanced performance for most users"*) and **PromptEnhancer-32B** (~64GB, *"highest quality"*), plus
  `PromptEnhancer-Img2img-Edit`. Repo: <https://github.com/Hunyuan-PromptEnhancer/PromptEnhancer>; benchmark
  **T2I-Keypoints-Eval**: <https://huggingface.co/datasets/PromptEnhancer/T2I-Keypoints-Eval>.
  **This is the closest existing thing to what Prompt Studio is building, it ships at 7B, and its 24-keypoint
  taxonomy is directly reusable as a validator checklist.**
  > Nothing found: any published 7B-vs-32B head-to-head win-rate table. The size choice is presented as a
  > quality/VRAM tradeoff with no numbers.
- Surfaced but unverified in depth: PRISM (arXiv:2607.24353), Sem-DPO (arXiv:2507.20133), Fast Prompt Alignment
  (arXiv:2412.08639 — notes a fine-tuned **7B underperforms fully iterative OPT2I**), APPO (arXiv:2602.13131,
  human-in-the-loop, no size sweep).

### 6.4 Official shipped rewriters: recommended everywhere, measured nowhere

- **FLUX.2 [dev]** `[OFFICIAL]`: BFL says the local 24B upsampler *"may produce less detailed expansions"* than the
  API path, and that upsampling is **task-conditional**, not universal. **No benchmark numbers — nothing found.**
- **FLUX.2 [klein]** `[OFFICIAL]`: does not include and does not require prompt upsampling. No measurement.
- **Qwen-Image** `[OFFICIAL]`: ships `prompt_utils.py` (Qwen-Plus via DashScope), says rewriting *"is recommended to
  improve the stability of editing tasks."* **No ablation table found.**
- **Z-Image** (`pe.py`), **LongCat-Image** (`enable_prompt_rewrite=True`), **GLM-Image** (*"We strongly recommend using
  GLM-4.7 to enhance prompts"*), **HunyuanImage-3.0-Instruct** (in-model `think_recaption`) — all `[OFFICIAL]`
  recommendations, **none with published with/without numbers.**

> **Nothing found:** any published evaluation of specifically *consumer-runnable* rewriters (Qwen3-4B/8B, Gemma-3-4B/
> 12B, Phi-4-mini, Mistral-7B) as image prompt rewriters, and no rigorous community A/B of them either. The
> arXiv:2510.12041 sweep (Llama3-3B/8B, Qwen3-8B) is the closest thing that exists, and it is DPO-tuned.

---

## 7. New local models a class should know (Nov 2025 – Aug 2026)

Consumer-viable at ≤24GB marked **[24GB OK]**. One paragraph each, prompt dialect emphasized.

**FLUX.2 [klein] 4B / 9B — [24GB OK]** — 2026-01-15. Rectified-flow MMDiT; conditioner Qwen3-4B (4B) / Qwen3-8B (9B,
step-distilled to 4 steps). **4B is Apache 2.0**, 9B is FLUX Non-Commercial. *"fits in ~13GB VRAM… RTX 3090/4070 and
above."* Dialect: prose not keyword lists; **negative prompts ignored**; `guidance_scale=1.0, steps=4`; no prompt
upsampling, so *"what you write is exactly what the model receives"*; up to 4 reference images; T2I and multi-reference
editing in one checkpoint. The **Base** variants (non-distilled, 50 steps) are the ones that accept real CFG.

**Z-Image / Z-Image-Turbo — [24GB OK]** — Turbo 2025-11-26, base **2026-01-27**. 6.15B single-stream S3-DiT, frozen
Qwen3-4B encoder, Flux VAE, **Apache 2.0**. *"fits comfortably within 16G VRAM"*; runs at 4GB via
stable-diffusion.cpp. The dialect split the corpus already documents is confirmed: **Turbo is CFG-free
(`guidance=0.0`, 8 NFEs) so negatives do nothing; base Z-Image restores CFG** with *"Negative prompts: Strongly
recommended"*, guidance 3.0–5.0, 28–50 steps. Best-in-class English multi-region text (§4.3).

**Qwen-Image-2512 / Qwen-Image-Edit-2511** — Dec 2025. 20B MMDiT, Qwen2.5-VL conditioning, **Apache 2.0**. BF16 ~40GB
(not consumer) but a large Q4/fp8 GGUF ecosystem puts it on 16–24GB `[LORE]`. Dialect: natural-language instructions,
**wrap literal text in double quotes**, `negative_prompt` + `true_cfg_scale=4.0` supported, 1–3 reference images. 2511
absorbed community lighting/viewpoint LoRAs into the base model. **Qwen-Image-2.0 (Feb 2026) is API-only.**

**FLUX.2 [dev]** — 2025-11-25. 32B + Mistral-3 24B VLM encoder, FLUX Non-Commercial. Not comfortably consumer at
BF16; 4-bit + remote text encoder runs on a 4090 (with the privacy caveat in §2.10). **Teach the prompting guide
regardless** — it is the richest official dialect doc in open weights.

**LongCat-Image / LongCat-Image-Edit (Meituan) — [24GB OK]** — Dec 2025 – Mar 2026,
<https://github.com/meituan-longcat/LongCat-Image>. **6B, Apache 2.0**, ~17–18GB with CPU offload. GenEval 0.87 at 6B.
Its distinctive rule deserves a slide of its own, verbatim: *"you must enclose the target text within single or double
quotation marks… The model utilizes a specialized **character-level encoding** strategy specifically for quoted
content. **Failure to use explicit quotation marks… will severely compromise the text rendering capability.**"*
Negative prompts supported; ships `enable_prompt_rewrite=True`.

**GLM-Image (Z.ai) — [24GB, just]** — 2026-01-14, <https://huggingface.co/zai-org/GLM-Image>. Hybrid **9B
autoregressive + 7B DiT decoder**, **MIT license**, *"~23GB of GPU memory"* with offload. Quote your text; official
GLM-4.7 rewriter script. Unusual knob: AR sampling `temperature=0.9` — *"A higher temperature results in more diverse
and rich outputs, but… decrease in output stability."* Reported best open text rendering: **CVTG-2K word accuracy
0.9116** vs Qwen-Image 0.8288 `[TESTED — vendor-run]`.

**FireRed-Image-Edit-1.1 (Xiaohongshu)** — Feb–Mar 2026, <https://github.com/FireRedTeam/FireRed-Image-Edit>.
Qwen-Image backbone, **Apache 2.0**, *"requiring only 30GB VRAM"* → **not 24GB in the official config**. Current open
editing SOTA on ImgEdit_O `[TESTED — vendor-run GPT-judge, self-reported]`: **4.56** vs Qwen-Image-Edit-2511 4.51,
LongCat-Image-Edit 4.45, FLUX.2 [dev] 4.35, Step1X-Edit-v1.2 3.95. Ships an **Agent** that recaptions to ~512 words via
an external LLM — the canonical "rewriter as a separate model" pattern, and a useful reference architecture.

**HunyuanImage-3.0 / -Instruct — NOT consumer** — **80B MoE / 13B active**, Tencent Hunyuan Community License.
Official requirement: **"≥ 3 × 80 GB"** (base), **"≥ 8 × 80 GB"** (Instruct). "Runs on a 4090" claims are third-party
blogs only `[LORE]`. Teach it purely as the concept demo for *rewriting moved inside the model*:
`--bot-task think_recaption` (think → rewrite → image, recommended), `--use-system-prompt en_unified`.

**Legacy baselines students will still meet — [24GB OK]**: **Chroma1-HD** (8.9B, Apache 2.0, FLUX-schnell de-distill,
**T5-XXL encoder → long prose + real negative prompts + real CFG**,
<https://huggingface.co/lodestones/Chroma1-HD>) and **SD 3.5** (Oct 2024, Stability Community License, triple encoder,
tag-tolerant). **No 2026 Stability image release found — nothing found.**

**Checked and rejected for the teaching set:** FLUX 3 (2026-07-23/08-04, **not open weights**); Step1X-Edit
(superseded, 80GB recommended); SANA / SANA-Sprint (**NVIDIA non-permissive license**, lapped by Z-Image-Turbo);
Nitro-E / Nitro-T (304M, demo-grade); BAGEL-7B / Janus-Pro / Emu3.5 / Lumina-DiMOO / NextStep-1 (OneIG-Bench EN:
BAGEL 0.361, Janus-Pro 0.267 vs Qwen-Image 0.539 — architecturally interesting, not competitive). **Nothing found** on
CogView5, Bria 3.x open weights, or a 2026 Meissonic / Kandinsky-5 / Playground release that changes the picture.

**The organizing principle for 2026 `[SYNTHESIS]`: dialect is encoder-driven.**

- **T5/CLIP-era models** (SDXL family, Chroma, SD3.5) → tags tolerated, weighting syntax matters, negative prompts and
  real CFG are load-bearing, 75/77-token chunking applies.
- **LLM-conditioned models** (Qwen3 → FLUX.2/klein/Z-Image; Qwen2.5-VL → Qwen-Image; Mistral-3 → FLUX.2 dev; GLM-4 →
  GLM-Image) → ordered natural-language paragraphs, no weighting syntax, negatives mostly absent or discouraged,
  512-token caps with silent truncation.
- Three near-universal new conventions across the LLM-conditioned generation: **quote literal text**, **bind hex
  colors to named objects**, **use JSON when you need production repeatability**.

This is a cleaner teaching spine than per-model rule lists, and it predicts behavior for models not yet in the corpus.

---

## 8. Recommended corpus edits

1. `flux.md` — relabel "30–80 words" as `[OFFICIAL]` guidance, not a tested preference. Add the **512-local /
   32K-cloud** token split and the silent-truncation warning. Add PromptMoG as the real length evidence. Remove or
   mark `[SPECULATION]` any "meta-tags render as text" claim. Add the klein five-checkpoint lineup, the Base-klein
   real-CFG exception, and the hex-color honesty note.
2. `qwen-image.md` — version-gate the magic suffix (present in Qwen-Image, **removed in 2512**, replaced by the
   official negative prompt). Add ChineseWord rarity tiers (97/41/6) as the text-failure predictor. Add the CVTG-2K
   multi-region table. Add the "no 8-step Lightning for 2511/2512" and "don't use Lightning for dense text" routing
   rules. Mark Qwen-Image 2.0 and 3.0 as **API-only**.
3. `z-image.md` — record Base's actual release date (2026-01-27) and confirm Edit/Omni-Base still unreleased with
   **9 months of total maintainer silence**; add the blog-vs-repo source hazard. Add the chat-template token overhead
   and the 2048+ CUDA assert. Add the staff seed-diversity trade-off quote and the measured workaround table.
4. `sdxl.md` — split Pony **V6 (SDXL)** from **V7 (AuraFlow)**. Cap Illustrious at v2.0. Add the NoobAI v-pred hard
   constraints (**CFG 4–5, Euler only, ZTSNR**). Make emphasis weights **UI-scoped**. Replace "negatives eat your
   token budget" with A1111's own statement that they do not. Add the quality-tags-iff-in-captions rule with the
   NoobAI percentile table as the proof case.
5. `_cross/verbosity.md` — add the diversity-vs-length trade-off as a *second axis*: length is not just
   quality-vs-truncation, it is fidelity-vs-seed-variety. Two independent sources (PromptMoG measurement; Z-Image
   staff explanation).
6. `_cross/rewriter-technique.md` — add §6.2 as an evidence section. The existing schema-constrained design is now
   *justified by measurement*, not just taste. Add the two new mechanical checks (no dropped content words; no
   contradicted lighting/time-of-day) and the no-rewrite default path.
7. `_cross/motion-quality.md` / composition guidance — reclassify camera/lens/aperture/film-stock vocabulary as
   **style tokens, not controls**, and cite the three failure measurements. This is the largest single correction in
   this addendum.
8. `new-models.md` — add FLUX.2 klein family, GLM-Image, LongCat-Image, FireRed-Image-Edit, Qwen-Image-Layered,
   Qwen-Image-Bench. Note FLUX 3 as announced-but-closed. Adopt the encoder-driven dialect spine from §7.
9. `INDEX.md` item 8 — keep "do not expose Z-Image-Edit/Omni-Base", still correct. Add a new item: "do not validate
   lens/aperture vocabulary as a constraint."

---

## 9. Consolidated "nothing found"

Stated explicitly so the corpus does not later mistake absence for oversight.

- No controlled A/B of quality tags ("masterpiece, best quality, 8k") on Juggernaut or RealVisXL.
- No long-vs-short negative-prompt ablation on SDXL.
- No visible experiment on 77-token chunk-boundary artifacts.
- No official NoobAI end-of-development announcement.
- No 2026 SDXL-lineage anime model confirmed; no aggregate Civitai/HF usage-share statistics.
- No fixed-seed prompt-length ablation for any FLUX model, from BFL or anyone.
- No documented case of quality tags rendering as literal text in a Flux image.
- No measured hex-adherence test of **FLUX.2** (only FLUX.1-era GenColorBench data).
- No JSON-vs-prose A/B at fixed seed.
- No FLUX.2 technical report or arXiv paper.
- No official GGUF release or guidance for FLUX.2.
- No BFL announcement after 2026-08-04.
- No published before/after demonstration of Z-Image truncation at 512 tokens.
- No measured Han-characters-per-token figure for the Qwen3 tokenizer.
- No A/B ablation of the Qwen "Ultra HD, 4K, cinematic composition" suffix.
- No controlled same-prompt ZH-vs-EN A/B for Qwen-Image or Z-Image.
- No evidence that naming a specific font *family* works on any model.
- No official statement on Z-Image-Edit / Omni-Base timing or cancellation.
- No Qwen-Image-2.0 open weights or promise of them; no Qwen-Image-Edit-2512+.
- No 8-step Lightning LoRA for Edit-2511 or 2512.
- No measurement of shot-size or camera-angle adherence in still T2I.
- No head-to-head of "wide shot" in prompt vs latent aspect ratio.
- No metric-based test of film-stock, named-lens, or ISO/grain adherence.
- No published evaluation of consumer-runnable (3–8B, untuned) LLMs as image prompt rewriters.
- No published 7B-vs-32B comparison for Tencent's PromptEnhancer.
- No with/without benchmark for any official shipped rewriter (Qwen, Z-Image, FLUX.2, GLM, LongCat, Hunyuan).

---

## 10. Sources

Grouped by section; all accessed 2026-08-15.

**SDXL / UI internals** — [A1111 sd_emphasis.py](https://github.com/AUTOMATIC1111/stable-diffusion-webui/blob/master/modules/sd_emphasis.py) ·
[A1111 negative-prompt wiki](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Negative-prompt) ·
[ComfyUI sd1_clip.py](https://github.com/comfyanonymous/ComfyUI/blob/master/comfy/sd1_clip.py) ·
[ComfyUI_ADV_CLIP_emb](https://github.com/BlenderNeko/ComfyUI_ADV_CLIP_emb) ·
[compel](https://github.com/damian0815/compel) — all `[OFFICIAL]`.

**SDXL checkpoints** — [Juggernaut XL v9](https://huggingface.co/RunDiffusion/Juggernaut-XL-v9) ·
[RealVisXL V4.0](https://huggingface.co/SG161222/RealVisXL_V4.0) ·
[RealVisXL V5.0](https://huggingface.co/SG161222/RealVisXL_V5.0) ·
[NoobAI-XL 1.1](https://huggingface.co/Laxhar/noobai-XL-1.1) ·
[NoobAI-XL Vpred 1.0](https://huggingface.co/Laxhar/noobai-XL-Vpred-1.0) ·
[Animagine XL 4.0](https://huggingface.co/cagliostrolab/animagine-xl-4.0) ·
[bigASP V2.5](https://huggingface.co/fancyfeast/bigaspv2-5) ·
[Pony V7 base](https://huggingface.co/purplesmartai/pony-v7-base) ·
[Illustrious paper](https://arxiv.org/abs/2409.19946) ·
[SDXL paper](https://arxiv.org/abs/2307.01952) — all `[OFFICIAL]`.

**FLUX** — [FLUX.2 prompting guide](https://docs.bfl.ai/guides/prompting_guide_flux2) ·
[unified building](https://docs.bfl.ml/guides/prompting_unified_building.md) ·
[unified reference](https://docs.bfl.ml/guides/prompting_unified_reference.md) ·
[unified technical](https://docs.bfl.ml/guides/prompting_unified_technical.md) ·
[flux2 overview](https://docs.bfl.ml/flux_2/flux2_overview.md) ·
[release notes](https://docs.bfl.ml/release-notes.md) · [flux2 repo](https://github.com/black-forest-labs/flux2) ·
[system_messages.py](https://raw.githubusercontent.com/black-forest-labs/flux2/main/src/flux2/system_messages.py) ·
[prompt upsampling doc](https://raw.githubusercontent.com/black-forest-labs/flux2/main/docs/flux2_with_prompt_upsampling.md) ·
[HF diffusers FLUX.2 post](https://huggingface.co/blog/flux-2) ·
[klein blog](https://bfl.ai/blog/flux2-klein-towards-interactive-visual-intelligence) ·
[FLUX 3 video](https://bfl.ai/blog/flux-3-video) — all `[OFFICIAL]`.
[pollinations#7653](https://github.com/pollinations/pollinations/issues/7653) `[TESTED — coarse]` ·
[LatentUnfold word-order test](https://bytedance.github.io/LatentUnfold/) `[TESTED — weak]` ·
[fal klein guide](https://fal.ai/learn/devs/flux-2-klein-prompt-guide) `[LORE — vendor]`.

**Z-Image** — [repo](https://github.com/Tongyi-MAI/Z-Image) ·
[Z-Image base card](https://huggingface.co/Tongyi-MAI/Z-Image) ·
[diffusers pipeline](https://raw.githubusercontent.com/huggingface/diffusers/main/src/diffusers/pipelines/z_image/pipeline_z_image.py) ·
[tech report arXiv:2511.22699](https://arxiv.org/abs/2511.22699) — `[OFFICIAL]`.
[HF discussion #8](https://huggingface.co/Tongyi-MAI/Z-Image-Turbo/discussions/8) ·
[issue #16](https://github.com/Tongyi-MAI/Z-Image/issues/16#issuecomment-3587832445) ·
[issue #27](https://github.com/Tongyi-MAI/Z-Image/issues/27#issuecomment-3592317395) ·
[issue #169](https://github.com/Tongyi-MAI/Z-Image/issues/169) — `[STAFF]` / `[LORE]`.
[MyAIForce variation study](https://myaiforce.com/z-image-turbo-improve-variation/) `[TESTED]` ·
[archived pe.py](https://web.archive.org/web/20251127201114/https://huggingface.co/spaces/Tongyi-MAI/Z-Image-Turbo/blob/main/pe.py).

**Qwen-Image** — [repo](https://github.com/QwenLM/Qwen-Image) ·
[tech report arXiv:2508.02324](https://arxiv.org/html/2508.02324v1) ·
[X-Omni / LongText-Bench arXiv:2507.22058](https://arxiv.org/abs/2507.22058) ·
[Qwen-Image-Layered arXiv:2512.15603](https://arxiv.org/abs/2512.15603) ·
[Qwen-Image-Bench arXiv:2605.28091](https://arxiv.org/abs/2605.28091) ·
[Qwen-Image-Lightning](https://github.com/ModelTC/Qwen-Image-Lightning) ·
[ComfyUI changelog](https://docs.comfy.org/changelog) — all `[OFFICIAL]`.

**Photography adherence** — [Bokeh Diffusion arXiv:2503.08434](https://arxiv.org/abs/2503.08434) ·
[Defocus Blur Control arXiv:2510.06215](https://arxiv.org/html/2510.06215v1) ·
[Generative Photography arXiv:2412.02168](https://arxiv.org/html/2412.02168v2) ·
[Viewpoint Tokens arXiv:2604.19954](https://arxiv.org/html/2604.19954v1) ·
[GenSpace arXiv:2505.24870](https://arxiv.org/abs/2505.24870) ·
[CineTechBench arXiv:2505.15145](https://arxiv.org/html/2505.15145v1) ·
[ShotBench arXiv:2506.21356](https://arxiv.org/abs/2506.21356) ·
[Auteur arXiv:2606.01900](https://arxiv.org/abs/2606.01900) — all `[TESTED]`.

**Color** — [GenColorBench arXiv:2510.20586](https://arxiv.org/html/2510.20586v1) ·
[NumColor arXiv:2603.13547](https://arxiv.org/abs/2603.13547) — `[TESTED]`.

**Rewriters** — [Input-Side Inference-Time Scaling arXiv:2510.12041](https://arxiv.org/abs/2510.12041) `[TESTED]` ·
[PromptMoG / LPD-Bench arXiv:2511.20251](https://arxiv.org/abs/2511.20251) `[TESTED]` ·
[DiverseVAR arXiv:2511.21415](https://arxiv.org/abs/2511.21415) `[TESTED]` ·
[Promptist](https://proceedings.neurips.cc/paper_files/paper/2023/file/d346d91999074dd8d6073d4c3b13733b-Paper-Conference.pdf) `[TESTED]` ·
[BeautifulPrompt arXiv:2311.06752](https://arxiv.org/abs/2311.06752) `[OFFICIAL]` ·
[RePrompt arXiv:2505.17540](https://arxiv.org/abs/2505.17540) `[OFFICIAL]` ·
[PromptEnhancer CVPR 2026](https://openaccess.thecvf.com/content/CVPR2026/html/Wang_PromptEnhancer_Taming_Your_Rewriter_for_Text-to-Image_Generation_via_Fine-Grained_Reward_CVPR_2026_paper.html) ·
[PromptEnhancer repo](https://github.com/Hunyuan-PromptEnhancer/PromptEnhancer) `[OFFICIAL]`.

**Negative prompts** — [arXiv:2406.02965](https://arxiv.org/abs/2406.02965) ·
[Dynamic Negative Guidance arXiv:2410.14398](https://arxiv.org/abs/2410.14398) ·
[VSF arXiv:2508.10931](https://arxiv.org/html/2508.10931v6) — `[TESTED]`.

**New models** — [LongCat-Image](https://github.com/meituan-longcat/LongCat-Image) ·
[GLM-Image](https://huggingface.co/zai-org/GLM-Image) ·
[FireRed-Image-Edit](https://github.com/FireRedTeam/FireRed-Image-Edit) ·
[Chroma1-HD](https://huggingface.co/lodestones/Chroma1-HD) — `[OFFICIAL]`.

---

## 11. Research-quality note

Coverage is strong on official sources and unexpectedly strong on tested evidence for **photography vocabulary**
(three converging papers) and **rewriter value** (one clean size sweep with a below-baseline control). It is weakest
exactly where the corpus most wanted it: **no one has published fixed-seed ablations of the specific prompt idioms
this app manipulates** — quality tags on photoreal SDXL, magic suffixes on Qwen, JSON vs prose on FLUX.2, ZH vs EN at
matched length. Every one of those is cheap to run locally on klein 4B or Z-Image-Turbo, and running even two of them
would make this corpus genuinely first-party rather than a well-sourced literature review.

One process caveat: Reddit and several login-walled Civitai articles were inaccessible during this pass, and the web
search budget was exhausted before the SDXL ecosystem sweep could be completed by search (that section rests on direct
API and model-card fetches). Community-only findings living on Reddit are therefore unassessed.
