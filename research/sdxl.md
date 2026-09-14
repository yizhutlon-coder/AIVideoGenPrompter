# SDXL and major fine-tune families research brief

Research baseline: 2026-08-15. Families: base SDXL, Juggernaut, RealVis, Pony, Illustrious.

## Official guidance

- [OFFICIAL, 2023] SDXL uses two text encoders and native high-resolution/aspect-ratio conditioning. Diffusers permits separate `prompt`/`prompt_2` and negative counterparts. [SDXL paper](https://arxiv.org/abs/2307.01952) · [Diffusers SDXL docs](https://huggingface.co/docs/diffusers/main/api/pipelines/stable_diffusion/stable_diffusion_xl)
- [OFFICIAL] Base example style is compact keyword-natural hybrid: “Astronaut in a jungle, cold color palette, muted colors, detailed, 8k.” There is no official universal prompt template.
- [CREATOR] Juggernaut X: accurate/descriptive prompts, natural or tags, under about 75 tokens; subject, action, setting, color, style, mood, light, viewpoint, texture. Current recommended settings: DPM++ 2M Karras, 30–40 steps, CFG 6–7. [RunDiffusion guide](https://www.rundiffusion.com/prompting-guide-for-juggernaut-x)
- [CREATOR] RealVisXL V5: photorealism; DPM++ SDE Karras 30+ or DPM++ 2M Karras 50+; short anatomy/face negative published on the model card. [RealVis model card](https://huggingface.co/SG161222/RealVisXL_V5.0)
- [CREATOR] Pony V6 is tag-dialect and depends on the score ladder (`score_9, score_8_up...`) plus source tags. Illustrious is Danbooru-tag fluent; v1.1 also improves natural-language prompting. [Pony source page](https://civitai.com/models/257749/pony-diffusion-v6-xl) · [Illustrious card](https://huggingface.co/OnomaAIResearch/Illustrious-XL-v1.1)

## Rewriter system prompts (verbatim)

No official SDXL-base prompt rewriter system prompt was found. Juggernaut provides a human guide, RealVis a model card, and Pony/Illustrious model-specific vocabulary rather than an official rewriter. Status: nothing public found.

## Chinese prompting

- Base SDXL's CLIP encoders are not Chinese-first. No official evidence found that Chinese outperforms English; use English or known training tags for composition/style.
- For visible Chinese text, SDXL is a poor first choice versus Qwen-Image/Z-Image. If required, quote the exact short text and keep surrounding prompt English; expect correction/inpainting.
- Pony/Illustrious should retain canonical English Danbooru tags. Machine-translating tags destroys their learned tokens.

## Motion / composition control

Image composition is controlled by front-loading subject/count/action, then viewpoint/shot, spatial relationships, environment, lighting, and style. SDXL still struggles with exact counting, left/right binding, hands and long text; ControlNet/Regional Prompting/pose references are settings/tools fixes, not solvable by adjective padding.

- [OFFICIAL/MAINTAINER] Diffusers' SDXL ControlNet pipeline accepts spatial conditions including human pose, depth, edges and segmentation; multiple ControlNets can combine an OpenPose image with a layout/edge condition, with separate conditioning scales. This is the appropriate route for exact limb placement or pose—not increasingly ornate prose. [Diffusers SDXL ControlNet](https://huggingface.co/docs/diffusers/api/pipelines/controlnet_sdxl)
- [TESTED/PAPER] GenSpace evaluates SDXL and FLUX.1-dev and finds clear weaknesses on camera/object orientation and complex frames of reference. Prompt-only spatial directions therefore remain best effort even when phrased well. [GenSpace](https://openreview.net/pdf?id=zyBG1j339A)

Failure fixes:

- Multiple-subject bleed: one clause per subject, strong position/clothing anchors, fewer shared adjectives; use regional conditioning when precision matters.
- Cropped body: specify shot (`full-body`, `feet visible`, `wide shot`) early and choose matching aspect ratio.
- Flat composition: add foreground/midground/background objects and one camera height/lens relation.
- Text failure: short quoted text + placement + font; otherwise route to Qwen/Z.
- Exact pose/layout: require OpenPose/ControlNet, depth, edge, or regional conditioning. Keep the text prompt semantic and let the control image carry geometry.

## Verbosity calibration

- CLIP tokenization makes concise front-loaded prompts safer. Juggernaut creator guidance says under about 75 tokens [CREATOR].
- Base/fine-tune practical band: 20–70 comma-separated concepts; split content vs global style between the two encoders only in advanced workflows [SYNTHESIS].
- Load-bearing: count, subject traits, pose/action, crop, location, lighting direction, medium/style. Noise: repeated `masterpiece/best quality/8k`, synonymous aesthetics, giant negative boilerplates.
- Pony is the exception: quality/source tags are learned triggers, not generic fluff. Illustrious similarly rewards canonical Danbooru tags.

## Negatives & guidance

- Higher CFG increases prompt adherence but can saturate/degrade image quality [OFFICIAL Diffusers].
- RealVis official negative: bad hands/anatomy, ugly/deformed, face/eye asymmetry, deformed eyes/mouth. Do not multiply it into hundreds of generic tokens.
- Juggernaut guide examples use compact negatives targeted to eyes/hands/CGI.
- Pony: put low-score ladder and unwanted source/style tokens in negative; positive starts with high-score ladder. Illustrious: `lowres, bad anatomy, bad hands, text, error` remains common [LORE], but checkpoint cards override.
- Trigger warning: there is no one “SDXL family” validator. Route by checkpoint family.

## Few-shot gold

### Pair 1 — person/photoreal [SYNTHESIS]
INTENT: Editorial portrait in a café.
PROMPT-EN:
Medium portrait of a 38-year-old woman with short auburn curls reading beside a café window, cream wool coat, left hand holding the book, gaze lowered, natural skin texture, warm window side-light, 50mm lens at f/2, muted brown and teal palette, candid editorial photography.
NOTES: Front-loaded subject/action, specific crop, light and lens; suitable for base/Juggernaut/RealVis.

### Pair 2 — landscape [SYNTHESIS]
INTENT: A dramatic desert observatory.
PROMPT-EN:
Wide establishing view of a white astronomical observatory on a red desert ridge, tiny service road in the foreground, layered mesas in the distance, dusk, first stars visible, cool dome light against warm horizon, crisp architectural photography, 24mm lens, balanced negative space.
NOTES: Explicit spatial layers and camera vocabulary.

### Pair 3 — action/composition [SYNTHESIS]
INTENT: Skateboarder above stairs.
PROMPT-EN:
Low-angle full-body photograph of one skateboarder at the peak of a kickflip above a concrete stair set, board fully separated and rotating beneath both feet, arms extended for balance, feet and board visible, crowd confined to soft-focus background, hard afternoon side light, 1/1000-second sports photography.
NOTES: Exact count, phase, crop and shutter intent.

### Pair 4 — text-in-image [SYNTHESIS]
INTENT: Minimal coffee poster saying OPEN LATE.
PROMPT-EN:
Minimal vertical coffee-shop poster, centered steaming black cup on warm cream paper, large two-line headline “OPEN\nLATE” at the top in bold condensed dark-green sans serif, small red circle at bottom right, clean Swiss graphic design, generous negative space, no other text.
NOTES: Short exact text, layout and font. Route to Qwen/Z if fidelity is critical.

### Pair 5 — Pony/Illustrious anime [CREATOR-DIALECT]
INTENT: Anime swordswoman on a rooftop.
PROMPT-EN:
score_9, score_8_up, score_7_up, source_anime, 1girl, solo, black hair, red eyes, rooftop, holding katana, wind, school uniform, full moon, low angle, dynamic pose, detailed background
NOTES: Pony quality/source ladder plus canonical tags; for Illustrious replace score ladder with the checkpoint's quality tags.

## Expert mistakes

- Sending the same generic natural-language template to Pony, Illustrious and photoreal SDXL.
- Believing CLIP skip 2 is a universal SDXL/Pony requirement across UIs.
- Putting the most important subject after long quality/style prefixes.
- Expecting prompt-only exact multi-subject layout or long typography.
- Using contradictory negative and positive tokens.
- Treating a pose tag such as `dynamic pose` as an exact skeleton specification.

## Validator suggestions

- Detect family first: `pony`, `illustrious`, `juggernaut/realvis/base`.
- Pony: require `score_9` and a `source_*` token; recommend the full `score_8_up...` ladder; reject prose-only if strict mode.
- Illustrious: require at least 5 comma-separated canonical tags in tag mode; do not require Pony score ladder.
- Juggernaut: warn above ~75 CLIP tokens; require subject before style stack.
- Text task: require quoted exact text + location; warn beyond ~12 words.
- Warn on >4 generic quality aliases or negative prompt >positive prompt length.
- If intent requests an exact pose/limb/contact/layout and no structural control is active, warn that output is best effort and offer OpenPose/ControlNet. When several controls are active, validate non-overlap and expose per-control strength.

## Sources

- [SDXL model card](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0) — [OFFICIAL], accessed 2026-08-15.
- [SDXL paper](https://arxiv.org/abs/2307.01952) — [OFFICIAL/PAPER], accessed 2026-08-15.
- [Diffusers SDXL API](https://huggingface.co/docs/diffusers/main/api/pipelines/stable_diffusion/stable_diffusion_xl) — [OFFICIAL], accessed 2026-08-15.
- [Juggernaut X creator guide](https://www.rundiffusion.com/prompting-guide-for-juggernaut-x) — [CREATOR], updated 2026-04-09, accessed 2026-08-15.
- [RealVisXL V5 card](https://huggingface.co/SG161222/RealVisXL_V5.0) — [CREATOR], accessed 2026-08-15.
- [Illustrious v1.1 card](https://huggingface.co/OnomaAIResearch/Illustrious-XL-v1.1) and [paper](https://arxiv.org/abs/2409.19946) — [CREATOR/PAPER], accessed 2026-08-15.
- [Diffusers SDXL ControlNet documentation](https://huggingface.co/docs/diffusers/api/pipelines/controlnet_sdxl) — [OFFICIAL/MAINTAINER], accessed 2026-08-15.
- [GenSpace benchmark](https://openreview.net/pdf?id=zyBG1j339A) — [TESTED/PAPER], accessed 2026-08-15.

---

## 2026-09 sweep (agent 1B)

Scope: per-checkpoint official recipes for Juggernaut (XI / XIII Ragnarok), RealVisXL v5+, Pony
Diffusion V6 XL and V7, Illustrious XL v2 / v3.0 / v3.5, NoobAI-XL (eps + v-pred), Animagine XL 4.0.
All accesses **2026-09-03** unless stated. Two previous sweeps returned nothing here; this one
recovered primary cards for **every** family in the brief.

**Surface notes for absence claims.** `civitai.com/api/v1/models/<id>` returned an empty body on
every attempt (257749, 833294 with and without `nsfw=true`) — the Civitai JSON API is effectively
invisible from this environment, so no absence claim below rests on Civitai. `civarchive.com/models/<id>`
**does** fetch and carries the full Civitai description HTML including the author's usage notes;
its FAQ accordions and its comment stream past ~263 entries are client-rendered and were not read.
`civitai.red` was not attempted (standing erratum: invisible to fetches). `illustrious-xl.ai` is a
client-rendered Next.js app: only the static footer reaches a fetch, so its `/updates/20`,
`/updates/21` and `/blog/*` bodies are unreadable — the Illustrious dev blog was recovered instead
from a full third-party **reprint**. `mcp__workspace__bash` has no network in this environment
(curl exits 56), so all retrieval was via `web_fetch`/`WebSearch`.

### New official guidance

#### Recipe table

| Family / version | Sampler + scheduler | Steps | CFG | Quality prefix (verbatim) | Official negative | Resolutions | CLIP-skip | Special tokens / "do not" | Card rev. |
|---|---|---|---|---|---|---|---|---|---|
| **Juggernaut XI v11** (SDXL) | `DPM++ 2M Karras` | 30–40 | 3–7 ("lower = more realistic") | none — none defined | none on card | 832×1216 portrait · 1216×832 landscape | not stated | VAE **baked in**, no external VAE. Two prompting styles: natural language *or* tagging | HF card lastModified 2026-05-08 |
| **Juggernaut XIII Ragnarok** (SDXL) | `DPM++ 2M SDE` or `DPM++ 2M Karras` | 30–40 | 3–6 (lower for realism) | none | "add NSFW tokens to the negative"; guide examples e.g. `bad eyes, blurry, missing limbs, bad anatomy, cartoon` | 832×1216 portrait; "all standard SDXL resolutions work well" | not stated | Trained with **BOORU tokens for anatomical detail** → put them in *negative* to stay SFW; always prompt clothing; ≤75 tokens; text at the **front** | guide published 2025-05-08 |
| **RealVisXL V5.0** | `DPM++ SDE Karras` (30+) **or** `DPM++ 2M Karras` (50+) | 30+ / 50+ | not stated | none | `bad hands, bad anatomy, ugly, deformed, (face asymmetry, eyes asymmetry, deformed eyes, deformed mouth, open mouth)` | not stated | not stated | HiRes: `DPM++ 2M Karras`, 25+ steps, 4x-NMKD-Superscale / 4x-UltraSharp, denoise 0.1–0.3, upscale ×1.1–1.5 | V5.0 is still the newest RealVisXL — `RealVisXL_V6.0` 404s on HF |
| **Pony Diffusion V6 XL** | `Euler a` | 25 | not stated ("otherwise default settings") | `score_9, score_8_up, score_7_up, score_6_up, score_5_up, score_4_up` | **by design none** — "designed to not need negative prompts in most cases" | 1024px ("generally can do most supported SDXL resolution") | **2 (or −2)** — mandatory, "otherwise you will be getting low quality blobs" | `source_pony/source_furry/source_cartoon/source_anime`; `rating_safe/rating_questionable/rating_explicit`; do **not** add `hd`, `masterpiece` etc.; bare `score_9` has "much weaker effect" than the full chain | card text as mirrored 2026-09-03 |
| **Pony V7** (⚠ **AuraFlow, not SDXL**) | not stated | **≥30** | not stated | `score_X`, `style_cluster_x`, `source_X` — "warning: V7 prompting may be inconsistent" | none | **768px–1536px**, "recommended to go for higher resolutions" | n/a (not CLIP-only) | Template `special tags, factual description of image, stylistic description of image, additional content tags`; character pattern `<species> <gender> <name> from <source>`; no text generation | HF card, V7.1 fix promised |
| **Illustrious XL v2.0-STABLE** | `Euler a` [LORE] | 20–40 (20–28 usually enough) [LORE] | 3–7.5, sweet spot 4.5–5 [LORE] | `masterpiece, best quality, amazing quality` (+ optional `very aesthetic, newest`) [LORE] | `lowres, bad quality, worst quality, bad anatomy, sketch, jpeg artifacts, ugly, poorly drawn, censor, blurry, watermark, artistic failure, artistic error, bad proportions, bad perspective, displeasing, very displeasing, oldest, child, childish, traditional media` [LORE] | 512–2048 stable; 1536-based recommended | **2** [LORE] | Rating tags before subject; artist tags after quality tags or at end; `absurdres, highres` at end; `<x> focus` | HF card has **no** settings at all; numbers are a third-party guide dated 2025-03-18 |
| **Illustrious XL v3.0-epsilon** | `Euler` + `Normal` schedule (author's own test caption) | not stated | **7.5** (author's own test caption) | as v2 [LORE] | as v2 [LORE] | 256→2048 | 2 [LORE] | **Control tokens work** (see below); "stable base model", LoRA-trainable | dev blog 2025-03-22 |
| **Illustrious XL v3.0-vpred** | v-pred; Karras-family contraindicated (see NoobAI note) | not stated | low (2–4 reported [LORE]) | as v2 [LORE] | as v2 [LORE] | 256→2048 | 2 [LORE] | **Control tokens "may not work well"**; oversaturates at default; flawed zero-terminal-SNR implementation | dev blog 2025-03-22 |
| **Illustrious XL v3.5-vpred** | `Euler a` + `SGM Uniform` reported [LORE] | 8+ usable, 4–6 works [LORE] | 1.0–1.5 reported [LORE] | as v2 [LORE] | as v2 [LORE] | **256×256 → 2048×2048** | 2 [LORE] | Zero Terminal SNR; **control tokens carry colour**, model "does not naturally generate vibrant colors"; positional NL prompts work ("red hair girl on the left…") | release notes 2025-06-16; dev blog 2025-03-22 |
| **NoobAI-XL 1.1 (eps)** | `Euler a` | 25–30 | **5–6** | `masterpiece, best quality, newest, absurdres, highres, safe,` | `nsfw, worst quality, old, early, low quality, lowres, signature, username, logo, bad hands, mutated hands, mammal, anthro, furry, ambiguous form, feral, semi-anthro` | area ≈1024²; 768×1344, **832×1216**, 896×1152, 1024×1024, 1152×896, 1216×832, 1344×768 | not stated | Percentile quality ladder; period tags `old/early/mid/recent/newest`; `year xxxx`; aesthetic `very awa` / `worst aesthetic` | HF card (base Laxhar/noobai-XL-1.0) |
| **NoobAI-XL V-Pred 1.0** | **`Euler`** — "⚠️ Other samplers will not work properly" (HF); Civitai adds "V prediction does **not** support the **Karras** series"; use **Euler or DDIM** | 28–35 | **4–5** | same prefix as eps | same list as eps | same list as eps | not stated | `prediction_type="v_prediction"` **+ `rescale_betas_zero_snr=True`**; **CFG Rescale / dynamic CFG ≈ 0.2**; "THIS MODEL WORKS DIFFERENT FROM EPS MODELS!" | published 2024-12-22 |
| **Animagine XL 4.0** | **`Euler Ancestral`** | 25–28 (28 rec.) | **4–7 (5 rec.)** | `masterpiece, high score, great score, absurdres` — **at the END of the prompt** | `lowres, bad anatomy, bad hands, text, error, missing finger, extra digits, fewer digits, cropped, worst quality, low quality, low score, bad score, average score, signature, watermark, username, blurry` | 1024×1024, 1152×896, 1216×832, 1344×768, 1536×640 + portrait mirrors | not stated | Score tags `high/great/good/average/bad/low score`; ratings `safe/sensitive/nsfw/explicit`; `year 2005…year 2025`; escape parens `\(…\)`; **tag-only** — "natural language input may not be effective"; 1536² degrades | v4.0 2025-01-24, **Opt** 2025-02-13 |

#### Verbatim blocks

Pony Diffusion V6 XL — official card (`[CREATOR]`, mirrored at `LyliaEngine/Pony_Diffusion_V6_XL`,
source given as `civitai.com/models/257749`):

```
Make sure you load this model with clip skip 2 (or -2 in some software), otherwise you will be getting low quality blobs.

score_9, score_8_up, score_7_up, score_6_up, score_5_up, score_4_up, just describe what you want, tag1, tag2

(previous Pony Diffusion models used a simpler score_9 quality modifier, the longer version of V6 XL version is a training issue that was too late to correct during training, you can still use score_9 but it has a much weaker effect compared to full string.)

The model is designed to not need negative prompts in most cases and does not need other quality modifiers like "hd", "masterpiece", etc...

Other special data selection tags include, 'source_pony', 'source_furry', 'source_cartoon' and 'source_anime' and ratings of 'rating_safe', 'rating_questionable' and 'rating_explicit'.

If you are looking specifically for pony style, I recommend using one of the two following templates `anthro/feral pony, rest of the prompt` or `source_pony, rest of the prompt`.

Using Euler a with 25 steps and resolution of 1024px is recommended although model generally can do most supported SDXL resolution.

This model will sometimes generate pseudo signatures that are hard to remove even with negative prompts
```

Pony V7 — official HF card (`[OFFICIAL]`):

```
special tags, factual description of image, stylistic description of image, additional content tags

### Special Tags
`score_X`, `style_cluster_x`, `source_X` - warning: V7 prompting may be inconsistent, please see the article as we are working on V7.1 to address this.

2. When referring to characters use pattern: `<species> <gender> <name> from <source>`
For example "Anthro bunny female Lola Bunny from Space Jam".

## Supported inference settings
V7 supports resolutions in the range of 768px to 1536px. It is recommended to go for higher resolutions and at least 30 steps during inference.

## Limitations
- This model does not support text generation and has degraded text generation capabilities compared to base AuraFlow
- Special tags (including quality tags) have much weaker performance compared to V6, meaning score_9 would not necessarily yield better results on some prompts. We are working on a V7.1 follow-up to improve this
```

NoobAI-XL V-Pred 1.0 — HF card "Recommended Settings" (`[OFFICIAL]`):

```
- CFG: 4 ~ 5
- Steps: 28 ~ 35
- Sampling Method: **Euler** (⚠️ Other samplers will not work properly)
- Resolution: Total area around 1024x1024. Best to choose from: 768x1344, **832x1216**, 896x1152, 1024x1024, 1152x896, 1216x832, 1344x768
```

NoobAI-XL V-Pred 1.0 — Civitai description, "Usage recommendations and future work" (`[OFFICIAL]`,
via civarchive; this is the **explicit Karras ban** and the CFG-Rescale number):

```
1. Use with dynamic CFG plugin: We recommend using the dynamic CFG & CFG Rescale plugin when employing the V prediction model to prevent oversaturation or overly gray images. You can refer to the configuration of 0.2 for the best results.

2. Choice of sampling methods: Although NOOBAI XL-VPred 1.0 supports most sampling methods, V prediction does not support the Karras series of sampling. Therefore, we suggest using Euler and DDIM sampling methods for more stable outcomes.
```

NoobAI-XL — zsnr wiring, from the card's own diffusers snippet (`[OFFICIAL]`):

```python
scheduler_args = {"prediction_type": "v_prediction", "rescale_betas_zero_snr": True}
pipe.scheduler = EulerDiscreteScheduler.from_config(pipe.scheduler.config, **scheduler_args)
```

NoobAI-XL — quality ladder is a **time-decayed popularity percentile**, not an aesthetic word
(`[OFFICIAL]`, identical text on eps 1.1 and v-pred 1.0):

```
- Data normalization based on various sources and ratings.
- Application of time-based decay coefficients according to date recency.
- Ranking of images within the entire dataset based on this processing.

| > 95th          | masterpiece    |
| > 85th, <= 95th | best quality   |
| > 60th, <= 85th | good quality   |
| > 30th, <= 60th | normal quality |
| <= 30th         | worst quality  |

Caption: <1girl/1boy/1other/...>, <character>, <series>, <artists>, <special tags>, <general tags>, <other tags>

| 2005-2010 | old | 2011-2014 | early | 2014-2017 | mid | 2018-2020 | recent | 2021-2024 | newest |
```

Animagine XL 4.0 — official "Usage Guidelines" (`[OFFICIAL]`):

```
### 1. Prompt Structure
1girl/1boy/1other, character name, from which series, rating, everything else in any order and end with quality enhancement

### 2. Quality Enhancement Tags
Add these tags at the end of your prompt:
masterpiece, high score, great score, absurdres

### 4. Optimal Settings
- **CFG Scale**: 4-7 (5 Recommended)
- **Sampling Steps**: 25-28 (28 Recommended)
- **Preferred Sampler**: Euler Ancestral (Euler a)

### 6. Final Prompt Structure Example
1girl, firefly \(honkai: star rail\), honkai \(series\), honkai: star rail, safe, casual, solo, looking at viewer, outdoors, smile, reaching towards viewer, night, masterpiece, high score, great score, absurdres

## Limitations
- **Prompt Format**: Limited to tag-based text prompts; natural language input may not be effective
- **Text Generation**: Text rendering in images is currently not supported and not recommended
- **Resolution**: Higher resolutions (e.g., 1536x1536) may show degradation as training used original SDXL resolution
```

Juggernaut XI v11 — official HF card "Recommended Settings" (`[CREATOR]`):

```
| Resolution | `832 × 1216` (portrait) · `1216 × 832` (landscape) |
| Sampler    | `DPM++ 2M Karras` |
| Steps      | `30 – 40` |
| CFG scale  | `3 – 7` (lower = more realistic) |
| VAE        | **Already baked in** — no external VAE required |
```

Juggernaut **XIII Ragnarok** — official RunDiffusion guide (`[CREATOR]`, 2025-05-08). Note the
**BOORU-in-negative** rule, which is unique to this family and the opposite of the anime dialects:

```
**Resolution:** 832 x 1216 for Portraits, but all standard SDXL resolutions work well.
**Sampler:** DPM++ 2M SDE or DPM++2m Karras
**Steps:** 30–40
**CFG:** 3–6 (Lower values for realism)
**Negative Prompt:** You may want to add NSFW tokens to the negative to be sure you don't get NSFW content.
**VAE:** Baked in
**HiRes:** 4xNMKD-Siax_200k with 15 Steps, 0.3 Denoise, 1.5x Upscale

**Importance of the First Sentence:** Sets the foundation for the image.
**Use of Weights:** Apply weights sparingly to primary subjects if your application supports it.
**Prompt Size:** Try not to exceed 75 tokens.

**BOORU Token Influence:**
Juggernaut Ragnarok was trained with BOORU style tokens for anatomical detail.
If specific BOORU tokens are used positively, it may trigger unwanted outputs. To steer clear, ensure such tokens are placed in the negative.

Make sure you put the text at the front of the prompt not at the end.
```

RealVisXL V5.0 — official HF card (`[CREATOR]`, unchanged since the 2026-08-15 baseline; re-verified):

```
Recommended Negative Prompt:
bad hands, bad anatomy, ugly, deformed, (face asymmetry, eyes asymmetry, deformed eyes, deformed mouth, open mouth)

Recommended Generation Parameters:
Sampling Method: DPM++ SDE Karras (30+ Sampling Steps) or DPM++ 2M Karras (50+ Sampling Steps)

Recommended Hires Fix Parameters:
Hires Sampling Method: DPM++ 2M Karras
Hires steps: 25+
Denoising strength: 0.1 - 0.3
Upscale by: 1.1-1.5
```

**Illustrious XL: a whole special-token family we did not have.** From the Onoma AI dev blog
"Illustrious XL 3.0-3.5-vpred: 2048 Resolution and Natural Language" by **Angelbottomless**
(Illustrious lead), 2025-03-22, read via a complete reprint (`[CREATOR]` for the words,
`[LORE]` for the reprint channel — the onoma-hosted original is unreadable from a fetch):

```
Here, we introduce the "control tokens" - explicitly tagged by image analysis:

Contrast: 'low contrast', 'medium contrast', 'high contrast', 'very high contrast'
Brightness: 'dark', 'normal brightness', 'bright', 'very bright'
Sharpness: 'blurry', 'slightly sharp', 'sharp', 'very sharp'
Dynamic Colors: 'static colors', 'medium dynamic colors', 'high dynamic colors', 'very dynamic colors'
Colorfulness: 'monotonic color', 'medium colorfulness', 'high colorfulness', 'very high colorfulness'
Saturation: 'muted colors', 'average colors', 'vibrant colors', 'very vibrant colors'

The control token, works specifically in v3.0-epsilon and v3.5-vpred model, however, v3.0-vpred model may not work well the token.

Also, common phrase, "dark" is contaminated - "black theme" might be better for usecases.

there are extremely small amount of "very dark" or "very white" images, this is near opposite of statements which claims "model requires #000000 or #FFFFFF".
```

Same post, on the eps/v-pred split and on why v-pred LoRAs fail (`[CREATOR]`):

```
V3.0-epsilon employs epsilon-prediction (noise prediction), establishing itself as a stable "base" model suitable for future training tasks, notably demonstrating compatibility with LoRA training.

V3.0-vpred utilizes velocity-prediction (v-parameterization), demonstrating improved compositional understanding yet initially plagued by significant issues, including catastrophic forgetting, domain shifts, oversaturated colors, and collapsed color palettes due to flawed zero terminal SNR implementation.

V3.5-vpred is trained with experimental setups, to mitigate the mentioned problems. The model has shown significantly more stable colors, however does not naturally generate vibrant colors. The functionality has moved to certain controlling tokens.

The LoRA training on v-parameterization models did not go well - this is also well known on v0.1-vpred model, and noobai vpred models, and flow based models as well.
```

The only concrete settings Angelbottomless states in that post are for a v3.0-epsilon test grid:
`Sampler: Euler, Schedule type: Normal, CFG scale: 7.5.` (`[CREATOR]`)

Illustrious XL **v3.5-vpred** official release notes (`[OFFICIAL]`, published 2025-06-16, mirrored
on SeaArt's model page for the checkpoint):

```
Supports generation resolutions from 256x256 to 2048x2048, enabling detailed and high-quality outputs.
Basic natural language prompt separation capabilities significantly improved, allowing clear positional and descriptive control.
Color control tokens, previously unavailable in the intermediate version, are fully restored, enabling precise manipulation of visual attributes.
The model incorporates "Zero Terminal Signal-to-noise Ratio" (Zero Terminal SNR), enhancing its ability to disregard initial noise and faithfully interpret complex instructions.
Existing LoRA adapters from v0.1 remain fully compatible, even at higher resolutions such as 2048, with recommended usage.
```

**Illustrious version inventory (`[OFFICIAL]`, illustrious-xl.ai static footer, 2026-09-03).** The
platform lists nine models: `Illustrious XL v0.1 · v1.0 · v1.1 · v2.0 · v3.0 EPS · v3.0 VPred ·
v3.5 VPred · Illustrious LU v0.03 · Illustrious LU v1.0`. The **HuggingFace org stops at
`Illustrious-XL-v2.0` (created 2025-04-18)** plus `Illustrious-Lumina-v0.03` — so v3.0 EPS,
v3.0 VPred, v3.5 VPred and LU v1.0 are **platform/partner-hosted only, with no open weights on the
Onoma HF org**. Nothing named v4 exists on either surface. The `Illustrious-XL-v2.0` card itself
carries **no** sampler/CFG/step/prefix/negative guidance at all — only a note that v2.0-STABLE is
the "last annealing phase" checkpoint of a cosine-annealing run.

### Chinese sources

Nothing Chinese-language was sought or found for these families — they are Korean (Onoma),
Indonesian (Cagliostro), US (RunDiffusion, PurpleSmartAI) and a mixed CN/EN community lab (Laxhar).
Two incidental CN-community signals, recorded for completeness:

- `[OFFICIAL]` NoobAI-XL's own cards list **six QQ groups** (427280545, 677964513, 852429527,
  914818692, 635772191, 870086562) alongside its Discord, and the contributor list is heavily
  Chinese (白玲可, 吟游诗人, 稀里哗啦, 幸运二副, 孤辰NULL, 汤人烂, 沅月弯刀, 年糕特工队).
  The lab's centre of gravity is Chinese-speaking even though every card is written in English —
  so the **primary vocabulary is still English Danbooru tags**, and the corpus rule
  "machine-translating tags destroys them" is unaffected.
  <https://huggingface.co/Laxhar/noobai-XL-Vpred-1.0>
- `[LORE]` The Illustrious v3.0/3.5 dev blog's only accessible full text is on a bilingual
  (EN/简体中文) reprint site; the Chinese translation of the control-token list is a machine
  translation of the author's own already-non-native English and should not be quoted.
  <https://neverbiasu.github.io/zh/posts/reprints/illustrious-xl-3.0-3.5-vpred-2048-resolution-and-natural-language.html>

**Scoped absence:** no ModelScope / 知乎 / Bilibili search was run for these seven families this
sweep. Treat "no Chinese guidance" as *not looked for*, not as *absent*.

### Tested findings

- `[CREATOR/TESTED]` Illustrious v3.0-epsilon vs v3.0-vpred vs v3.5-vpred on a two-girl colour-
  separation prompt, n=25 per cell: **v3.0-epsilon scored 23/25** on left/right colour binding at
  `Euler / Normal / CFG 7.5`; v3.0-vpred followed the prompt "with high success rate" but
  oversaturated; v3.5-vpred produced "mid-range colors with separation". A separate v-pred failure
  grid measured **58.46% of pixels exactly `#FFFFFF`** — the author's own illustration of v-pred
  collapse. Same post also reports a 424-token "paraphrased" prompt on which v3.5-vpred behaved
  "similar to Flux somehow, **however lost stylish generation**" while noting Flux's prompt
  following is "distinctly good and robust" whilst v3.5-vpred's "can be limited". n is small and
  self-reported by the model author; treat as directional.
  <https://neverbiasu.github.io/posts/reprints/illustrious-xl-3.0-3.5-vpred-2048-resolution-and-natural-language.html>
- `[CREATOR/TESTED]` Dataset colour audit behind the control tokens: **4.4M-image sample**, an image
  counted "colorful" at saturation > 120 with saturation stdev < 50, and "the 'variant colored'
  images are less than 10%". This is the measured reason `vibrant colors` must be a *token* rather
  than an expectation. Same source.
- `[LORE/USER-VERIFIED]` Third-party NoobAI v-pred practice diverges sharply from the card's own
  number: the card says CFG Rescale **0.2**, while a heavily-reacted civarchive comment thread
  reports "for NoobAI Vpred, I normally use CFG ~ 0.3-0.5 so 0.5 is on the high end side" and
  another "Rescale CFG work really well for me". Keep both; the card is the citable default.
  <https://civarchive.com/models/833294>
- `[LORE]` A third-party Illustrious node pack ships a generic Illustrious recipe that is *not* on
  any Onoma card and is the closest thing to a portable default: `CFG Scale: 4.0-6.5 (optimal: 5.0)`,
  `Steps: 24-28 for standard resolution, 30+ for high-resolution`,
  `Sampler: euler_ancestral (balanced) or DPM++ 2M Karras (smooth)`,
  `Scheduler: normal (standard), karras (1536px+)`, and troubleshooting that maps oversaturation →
  lower CFG to 4.0–4.5 + karras at high res, foggy → CFG 5.5–6.5 + 28–35 steps.
  <https://raw.githubusercontent.com/regiellis/ComfyUI-EasyIllustrious/main/README.md>

### Contradicts current corpus

1. **`research/sdxl.md` line 11 is now wrong on Pony V6's tag set** — it says V6 "depends on the
   score ladder (`score_9, score_8_up...`) plus source tags". The card's own text says the **six-rung
   chain is a training bug** ("too late to correct during training") and that **bare `score_9` has a
   much weaker effect than the full string**. The corpus reads the long chain as a design; it is an
   accident that you nonetheless must reproduce in full. `[CREATOR]`
2. **`research/sdxl.md` line 50 tells students to put the low-score ladder in Pony's negative.** The
   official card says the opposite: the model "is designed to not need negative prompts in most
   cases and does not need other quality modifiers". A negative ladder is a community habit, not a
   card instruction. `[CREATOR]`
3. **`research/sdxl.md` line 45 ("Believing CLIP skip 2 is a universal SDXL/Pony requirement") is
   half wrong.** It is *not* universal — but for **Pony V6 it is mandatory and stated in bold on the
   card**: "otherwise you will be getting low quality blobs". The Expert-mistakes line should say
   "not universal, but required on Pony V6". `[CREATOR]`
4. **`research/sdxl.md` line 11 credits Illustrious with `masterpiece, best quality`.** No Onoma
   card states any quality prefix; the `masterpiece, best quality, amazing quality` + `very
   aesthetic, newest` scheme comes from third-party guides. Meanwhile the app's `KNOWLEDGE`
   describes Illustrious as "deliberate de-biasing / no quality tags" — **both of our own surfaces
   are asserting a prefix policy that no primary source states.** Downgrade to `[LORE]` on both.
5. **App `KNOWLEDGE` line 835 says "NoobAI v-pred bans Karras".** Correct, and now sourced verbatim
   — but the same family's HF card is *stricter*: "Sampling Method: **Euler** (⚠️ Other samplers will
   not work properly)". Two official statements, one narrower than the other. Our single-sentence
   version under-warns; the safe teaching is "Euler or DDIM, never a Karras schedule".
6. **App `KNOWLEDGE` line 835 says "Illustrious org static since Apr 2025".** True of HuggingFace,
   but **v3.0 EPS, v3.0 VPred and v3.5 VPred shipped after that** on the vendor platform (v3.5-vpred
   release notes dated 2025-06-16), and v3.0/3.5 are the versions where the **eps-vs-v-pred split
   arrives inside the Illustrious family too**. "Org static" is now a HuggingFace-only claim.
7. **Nothing in our corpus mentions Illustrious control tokens** (contrast / brightness / sharpness /
   dynamic colors / colorfulness / saturation), and nothing warns that `dark` is "contaminated" and
   `black theme` is preferable. This is the single largest missing vocabulary in the SDXL file.
8. **Pony V7's score tags:** app `KNOWLEDGE` says "documented-but-unreliable (fix promised for
   V7.1)" — confirmed verbatim by the card. No change needed; upgrade its grade to `[OFFICIAL]`.

### Few-shot gold (new pairs)

### Pair 6 — person/photoreal, Juggernaut XIII Ragnarok [CREATOR-DIALECT]
INTENT: A safe-for-work editorial portrait of an older woman, on a Ragnarok/Juggernaut checkpoint.
PROMPT-EN:
Photograph of an elderly woman seated by a workshop window, deep wrinkles highlighted by hard side light, wearing a heavy charcoal wool cardigan and a linen collared shirt, hands resting on a worn leather apron, strong shadows across her features, intense and somber mood, detailed skin, realistic texture, mid shot, high resolution

Negative prompt: bad eyes, bad hands, flat lighting, cartoon, low detail, smooth skin, overexposed, deformed, nudity, naked
NOTES: Ragnarok recipe — subject first, action, then setting/light/texture/medium; under 75 tokens;
clothing explicitly prompted because the checkpoint is NSFW-trained; anatomical BOORU tokens kept out
of the positive and safety tokens pushed into the negative, exactly as the official guide instructs.
Run at `DPM++ 2M SDE` or `DPM++ 2M Karras`, 30–40 steps, CFG 3–6, 832×1216. `detailed skin` /
`realistic texture` are the guide's own named realism triggers.

### Pair 7 — anime tags, NoobAI-XL V-Pred 1.0 [CREATOR-DIALECT]
INTENT: Anime swordswoman on a rooftop, on a NoobAI v-pred checkpoint (the same brief as Pair 5, in
a different dialect — to show the schemes are not interchangeable).
PROMPT-EN:
masterpiece, best quality, newest, absurdres, highres, safe, 1girl, solo, black hair, red eyes, school uniform, holding katana, standing on roof, wind, full moon, night, from below, dynamic pose, detailed background

Negative prompt: nsfw, worst quality, old, early, low quality, lowres, signature, username, logo, bad hands, mutated hands, mammal, anthro, furry, ambiguous form, feral, semi-anthro
NOTES: The card's exact prefix and exact negative, unmodified. **No `score_*` chain and no
`source_*` tag** — those are Pony V6 tokens and are inert-to-harmful here. `newest` is a *period*
tag (2021–2024), not a quality word; `safe` is a rating tag. Settings: `Euler` (never a Karras
schedule), 28–35 steps, CFG 4–5, 832×1216, CFG-Rescale ≈ 0.2. Swapping this prompt onto Animagine
XL 4.0 requires moving the quality words to the END and changing them to
`masterpiece, high score, great score, absurdres`; swapping it onto Pony V6 requires the six-rung
score chain, `source_anime`, and CLIP-skip 2.

### Pair 8 — anime tags, Illustrious v3.5-vpred colour control [CREATOR-DIALECT]
INTENT: Two characters, colour-separated left/right, on Illustrious v3.5-vpred.
PROMPT-EN:
masterpiece, best quality, amazing quality, very aesthetic, newest, safe, 2girls, the girl on the left has long red hair and yellow eyes wearing a blue skirt, the girl on the right has short silver hair and blue pupils wearing a silver dress, standing side by side, rooftop at dusk, high contrast, vibrant colors, very sharp, absurdres, highres

Negative prompt: lowres, bad quality, worst quality, bad anatomy, sketch, jpeg artifacts, ugly, poorly drawn, censor, blurry, watermark, artistic failure, artistic error, bad proportions, bad perspective, displeasing, very displeasing, oldest, child, childish, traditional media
NOTES: Uses the two things v3.5-vpred actually adds — **positional natural language inside a tag
prompt** ("the girl on the left…", the author's own test formulation) and the **control tokens**
`high contrast, vibrant colors, very sharp`, which exist because the model will not produce vibrant
colour on its own. Prefer `black theme` over `dark` if you want a dark image. v-pred, so: no Karras
schedule, low CFG, and expect LoRAs trained on eps checkpoints to misbehave. The quality prefix here
is `[LORE]` (third-party guide), unlike the NoobAI and Animagine prefixes which are on the card.

### Validator changes

Route by checkpoint family **first**; there is still no "SDXL validator". Mechanical rules, one
block per family:

**Pony V6 XL** (`pony`, `ponyDiffusionV6`, `*ponyxl*`)
- Positive prompt MUST begin with the chain `score_9, score_8_up, score_7_up` — warn if `score_9`
  is present without at least `score_8_up, score_7_up` following it ("bare `score_9` has a much
  weaker effect than the full string" — card).
- Positive SHOULD contain the full six rungs `score_9, score_8_up, score_7_up, score_6_up, score_5_up, score_4_up`.
- Positive MUST contain exactly one `source_(anime|furry|pony|cartoon)`.
- Positive MAY contain one `rating_(safe|questionable|explicit)`.
- Reject `masterpiece|best quality|hd|8k|amazing quality|high score|great score` in the positive —
  card: "does not need other quality modifiers".
- Negative prompt is OPTIONAL and a long one is a smell: warn if the negative exceeds ~12 tokens.
- Require CLIP-skip **2** in the exported settings; error if 1.
- Sampler `Euler a`, steps 25, base side 1024.

**Pony V7** (`ponyV7`, `pony-v7-base`)
- Do NOT apply any SDXL rule: **V7 is AuraFlow.** No CLIP-skip field, no 77-token warning.
- `score_*` / `style_cluster_*` / `source_*` are permitted but MUST NOT be required, and the
  validator must attach the card's own caveat ("V7 prompting may be inconsistent… V7.1").
- Enforce prompt order `special tags → factual description → stylistic description → content tags`.
- Character references SHOULD match `<species> <gender> <name> from <source>`.
- Resolution MUST be within 768–1536 px per side; steps MUST be ≥ 30.
- Reject any request for rendered text in the image.

**NoobAI-XL — eps** (`noobai*eps*`, `noobaiXL_v1.1`)
- Positive MUST begin with `masterpiece, best quality, newest, absurdres, highres, safe,`
  (warn, don't error, if the rating tag differs).
- Negative SHOULD be exactly the card list; warn on additions beyond it.
- `newest|recent|mid|early|old` are **period** tags — error if flagged as quality words.
- CFG 5–6; steps 25–30; sampler `Euler a`; resolution from the seven listed pairs.

**NoobAI-XL — v-pred** (`noobai*vpred*`, `*v-pred*`, `*vPred*`)
- Scheduler MUST NOT be `karras` (any `*_karras`, `DPM++ * Karras`) — **error**, cite the card.
- Sampler MUST be in {`euler`, `ddim`}; anything else is a warning ("Other samplers will not work
  properly").
- CFG MUST be 4–5 (the brief's 3.5–5.5 band is wider than the card; use 4–5 and warn outside).
- Steps MUST be 28–35.
- Require `prediction_type = v_prediction` **and** `rescale_betas_zero_snr = true` in the exported
  recipe; error if either is missing.
- Require a CFG-Rescale / dynamic-CFG node with value ≈ **0.2**; warn if absent, note the community
  0.3–0.5 range as unofficial.
- Warn that eps-trained LoRAs are not reliable on v-pred weights.
- Same prefix/negative/resolution rules as eps.

**Animagine XL 4.0**
- Quality words MUST be at the **END**: error if `masterpiece|high score|great score|absurdres`
  appears before the last third of the prompt.
- The end block SHOULD be exactly `masterpiece, high score, great score, absurdres`.
- Prompt MUST open with a count tag (`1girl|1boy|1other|2girls|…`), then character, then series,
  then rating.
- Score words are drawn from {`high|great|good|average|bad|low score`}; ratings from
  {`safe|sensitive|nsfw|explicit`}; year tags match `year (20\d\d|19\d\d)`.
- Parentheses inside character names MUST be escaped `\(` `\)`.
- Reject prose sentences — "natural language input may not be effective".
- CFG 4–7 (default 5); steps 25–28 (default 28); sampler `Euler Ancestral`.
- Warn above 1024² total area and error above 1536×1536.
- Reject text-in-image tasks outright ("not supported and not recommended").

**Illustrious XL — v0.1 / v1.x / v2.0 (eps)**
- Danbooru tags required (≥5 comma-separated); NL sentences allowed from v1.1 up but must be mixed
  with tags, not replace them.
- Do NOT require the Pony score chain; do NOT require any quality prefix — mark
  `masterpiece, best quality, amazing quality` as a **suggestion labelled `[LORE]`**, since no Onoma
  card states it.
- Recommend CLIP-skip 2 `[LORE]`; CFG 3–7.5 with default 4.5–5 `[LORE]`; sampler `Euler a`;
  steps 20–28.
- v2.0: allow up to 1536-based sides; warn above 2048.

**Illustrious XL — v3.0-eps**
- As v2.0, plus: **control tokens enabled** — offer the six axes; `Euler` + `Normal` schedule and
  CFG 7.5 are the only author-stated numbers, so surface them as the reference grid, not a default.

**Illustrious XL — v3.0-vpred / v3.5-vpred**
- Treat as v-pred: scheduler MUST NOT be `karras`; prefer `sgm_uniform`; CFG low (v3.5 reported
  1.0–1.5, `[LORE]`) — error above 4 and label the band unofficial.
- Resolution allowed 256–2048 per side.
- v3.5 only: control tokens are the **colour mechanism** — if the intent asks for vivid colour,
  require at least one of `vibrant colors|very vibrant colors|high colorfulness|very high colorfulness`.
- If the intent asks for a dark image, rewrite `dark` → `black theme` and explain why.
- v3.0-vpred only: warn that control tokens "may not work well".
- Warn on LoRA use: v-pred LoRA training is documented by the author as unreliable; v0.1-era LoRAs
  are the ones the release notes call compatible.
- Note that these three versions have **no open weights on the Onoma HF org**.

**Juggernaut XI / XII**
- Prose or tags both fine; subject first; warn above ~75 CLIP tokens.
- `DPM++ 2M Karras`, 30–40 steps, CFG 3–7; 832×1216 / 1216×832.
- Error if an external VAE is selected — VAE is baked in.

**Juggernaut XIII Ragnarok**
- Everything above, plus sampler may also be `DPM++ 2M SDE`; CFG 3–6.
- Text-in-image MUST be placed at the front of the prompt, never the end.
- If the positive contains BOORU-style anatomical tokens, **move them to the negative** and say why.
- Require at least one clothing phrase in the positive when a person is present (official SFW rule).
- Warn if the negative lacks NSFW tokens.

**RealVisXL V5.0**
- Sampler MUST be a Karras variant (`DPM++ SDE Karras` ≥30 steps, or `DPM++ 2M Karras` ≥50 steps) —
  this is the exact inverse of the NoobAI v-pred rule and the two must never share a preset.
- Negative SHOULD be the card's short anatomy list; warn if the negative exceeds it by >2× length.

**Cross-family guards**
- Never let one preset carry both a Karras requirement (RealVis) and a Karras ban (NoobAI/Illustrious
  v-pred). If the checkpoint family is unknown, refuse to emit a scheduler at all.
- `score_*`, `masterpiece/best quality`, `high score/great score`, and the control tokens are **four
  mutually non-portable vocabularies**; emitting more than one family's prefix in a single prompt is
  an error, not a warning.

#### What our current `sdxlAnime` export and `SDXL_NEG` get wrong

Read-only findings against `PromptStudio.html` (do not edit here):

1. **`sdxlAnime` hard-requires the Pony ladder for every anime checkpoint.** The validator at
   `PromptStudio.html:1257-1258` errors when `score_9` or `source_*` is missing. That is correct for
   Pony V6 and **wrong for the other four anime families now sourced**: NoobAI wants
   `masterpiece, best quality, newest, absurdres, highres, safe,`; Animagine wants
   `masterpiece, high score, great score, absurdres` **at the end**; Illustrious wants no
   card-stated prefix at all; Pony V7 is not even SDXL. The rule must be gated on a family selector.
2. **The system prompt at `PromptStudio.html:715` tells the model to "default to the Pony V6 ladder"
   and to say nothing about the alternatives.** It names NoobAI, Animagine and Illustrious as
   differing but hands the student a Pony prompt regardless. With five recipes now in hand, the
   dialect should be a choice, not a default with a footnote.
3. **`sdxlAnime`'s hard-coded negative (`PromptStudio.html:719`) is nobody's official list.**
   `lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped,
   worst quality, low quality, signature, watermark` is *close to* Animagine's list but omits its
   `low score, bad score, average score, username, blurry` and uses `missing fingers`/`extra digit`
   where Animagine writes `missing finger`/`extra digits`. It is **not** NoobAI's list (which is
   built around `nsfw, old, early, … mammal, anthro, furry, feral, semi-anthro`), and it directly
   contradicts Pony V6's "designed to not need negative prompts". Ship per-family negatives.
4. **`SDXL_NEG` (`PromptStudio.html:526`) is a generic 13-token list attached to the photoreal
   target.** RealVisXL's card publishes a *shorter, differently-shaped* list built on
   `(face asymmetry, eyes asymmetry, deformed eyes, deformed mouth, open mouth)` with weighting
   parentheses; Juggernaut publishes no standing negative at all and Ragnarok's advice is
   "add NSFW tokens". `SDXL_NEG` invents a consensus that does not exist, and the app's own
   `KNOWLEDGE` line already says "RealVis ships a small anatomy list; mega-lists hurt".
5. **`sdxlAnime` has no CLIP-skip field, so Pony V6's one hard requirement is unenforceable.** The
   card's wording is unambiguous ("otherwise you will be getting low quality blobs"), yet the export
   cannot state it. The workflow note at `PromptStudio.html:2157` warns about Karras but never about
   CLIP-skip.
6. **The Karras warning at `PromptStudio.html:2157` is right but under-specified.** It says "NoobAI
   v-pred checkpoints ban Karras; adjust per your checkpoint card". It should also (a) name the
   replacement (`Euler`, or `DDIM`), (b) require `rescale_betas_zero_snr` / v-prediction, (c) name
   CFG-Rescale ≈ 0.2, (d) extend the ban to **Illustrious v3.0-vpred and v3.5-vpred**, which our app
   does not currently know are v-pred, and (e) note that CFG must drop to 4–5 (NoobAI) — a Karras
   swap alone does not fix a v-pred graph.
7. **Ambiguity: `sdxlAnime`'s "15-35 tags" band has no card behind it.** No anime card states a tag
   count. Animagine states a *structure*, NoobAI states a *caption order*, Illustrious states a
   recommended *order*. Replace the count heuristic with the per-family order templates, which are
   now quotable.
8. **Ambiguity: the exporter maps both `sdxl` and `sdxlAnime` to one `sdxl` workflow template**
   (`PromptStudio.html:1713`). One template cannot carry a Karras requirement and a Karras ban, a
   baked-in VAE and a CLIP-skip-2 loader. At minimum the anime path needs a family switch.

### Nothing-found register

Every brief item, so nobody re-hunts it:

- **Juggernaut XI on Civitai** — not read. Civitai's JSON API returns empty here; the HF card
  (lastModified 2026-05-08) carried the full settings table, so no gap in substance.
- **Juggernaut XIII Ragnarok weights/card on HuggingFace** — **not present**. `RunDiffusion/Juggernaut-XL-Ragnarok`
  404s and an HF search for "Juggernaut" (top 50 by relevance) returns only `Juggernaut-XL-v9`,
  `Juggernaut-XI-v11`, `Juggernaut-XI-Lightning` and `Juggernaut-Z-Image` from the RunDiffusion org.
  Ragnarok is vendor-page + Civitai only. Its recipe came from the official RunDiffusion guide.
- **Juggernaut XII settings** — no dedicated settings table found; the vendor lineup page points at a
  combined "XI and XII" prompt guide that was not fetched this sweep. Open.
- **`RealVisXL_V6.0`** — does not exist on HF (404 on the raw README); V5.0 remains newest. Searched:
  huggingface.co raw paths + web search.
- **RealVisXL V5.0 resolution list / CLIP-skip / CFG** — **the card states none**. Not an omission in
  our notes; the card genuinely gives only sampler, steps and the negative.
- **Pony V6 CFG** — **not stated on the card**. It says "no negative prompt and otherwise default
  settings", `Euler a`, 25 steps, 1024px. Any CFG number for Pony V6 in our corpus is community lore.
- **Pony V7 sampler / scheduler / CFG / negative** — **not stated on the card**. Only resolution
  range and ≥30 steps. `ponydiffusion.com/faq` returned an empty body (client-rendered).
- **Pony V7.1** — announced on the V7 card as the fix for weak special tags; no release found on HF
  or in search as of 2026-09-03.
- **Illustrious XL v2.0 official settings** — **the HF card contains none**. Everything numeric for
  v2.0 in the table above is a third-party guide (SeaArt, 2025-03-18) and is labelled `[LORE]`.
- **Illustrious XL v3.0 EPS / v3.0 VPred / v3.5 VPred weights** — **not on the Onoma HF org**
  (org listing enumerated: v2.0, early-release-v0, v1.0, v1.1, Lumina-v0.03 — nothing else).
- **Illustrious v3.x official sampler/CFG table** — **not found on any primary surface.**
  `illustrious-xl.ai/updates/21` (the official "ILXL Image Generation User Guide") and
  `/blog/8` are client-rendered and yield only the site footer to a fetch; the Onoma HF cards carry
  no settings. The `Euler a` + `SGM Uniform` + CFG 1.0–1.5 + 8-steps figures are search-surfaced
  third-party numbers, `[LORE]`, and should be tested before teaching.
- **Illustrious XL v3.5-EPS** — referenced in the dev blog as an ablation twin of v3.5-vpred
  ("trained with identical datasets and setups but different objectives") but **not listed as a
  shipped model** in the platform's own nine-model footer.
- **Illustrious v4** — nothing on either surface; the author writes only "I will introduce
  Illustrious v4 - when I am prepared mathematically".
- **NoobAI-XL FAQ answers** — the six FAQ headings on the Civitai/civarchive page
  ("What should I watch out for with NoobAI models?" etc.) are collapsed accordions rendered
  client-side; **headings only** were readable. Unresolved.
- **NoobAI v-pred CLIP-skip** — **not stated** on either the HF card or the Civitai description.
- **NoobAI "artist-tag policy"** — no policy statement found. The card's own example prompt *uses*
  `artist:john_kafka, artist:nixeu, artist:quasarcake`, and the caption order puts `<artists>` fourth,
  so artist tags are trained-in and unrestricted, but there is no written policy. Contrast Pony
  (V6 and V7 both state "artists' names have been removed") — that asymmetry is worth teaching.
- **Animagine XL 4.0 Opt as a separate repo** — does not exist; `cagliostrolab/animagine-xl-4.0-opt`
  404s. Opt is a file inside the 4.0 repo, documented only in the 4.0 changelog (2025-02-13).
- **Animagine XL 4.5 / 5.0** — no evidence of any release after 4.0 Opt; searched HF + web.
- **Animagine XL 4.0 CLIP-skip** — **not stated** on the card.
- **civitai.red** — not attempted (standing erratum: invisible to fetches). No absence claim here
  depends on it.
- **Chinese-language coverage for all seven families** — not searched this sweep (see above).

### Sources

- [RunDiffusion/Juggernaut-XI-v11 card](https://huggingface.co/RunDiffusion/Juggernaut-XI-v11) — `[CREATOR]`, repo lastModified 2026-05-08, accessed 2026-09-03.
- [RunDiffusion — Prompt Guide for Juggernaut XIII: Ragnarok](https://www.rundiffusion.com/prompt-guide-for-juggernaut-xiii-ragnarok-by-rundiffusion) — `[CREATOR]`, published 2025-05-08, accessed 2026-09-03.
- [RunDiffusion — Juggernaut model family / lineup](https://www.rundiffusion.com/juggernaut) — `[CREATOR]`, accessed 2026-09-03 (confirms Ragnarok = XIII and SDXL-architecture grouping).
- [SG161222/RealVisXL_V5.0 card](https://huggingface.co/SG161222/RealVisXL_V5.0) — `[CREATOR]`, accessed 2026-09-03 (re-verified unchanged vs 2026-08-15).
- [Pony Diffusion V6 XL card text](https://huggingface.co/LyliaEngine/Pony_Diffusion_V6_XL) — `[CREATOR]`, mirror of `civitai.com/models/257749` by PurpleSmartAI, accessed 2026-09-03. Civitai original not fetchable from here.
- [purplesmartai/pony-v7-base card](https://huggingface.co/purplesmartai/pony-v7-base) — `[OFFICIAL]`, accessed 2026-09-03.
- [OnomaAIResearch/Illustrious-XL-v2.0 card](https://huggingface.co/OnomaAIResearch/Illustrious-XL-v2.0) — `[OFFICIAL]`, repo created 2025-04-18, accessed 2026-09-03 (no settings on card).
- [OnomaAIResearch/Illustrious-XL-v1.1 card](https://huggingface.co/OnomaAIResearch/Illustrious-XL-v1.1) — `[OFFICIAL]`, accessed 2026-09-03 (knowledge cutoff 2024-07; ELO 1617 vs 1571).
- [OnomaAIResearch HF org listing](https://huggingface.co/api/models?author=OnomaAIResearch) — `[OFFICIAL]`, accessed 2026-09-03 (five repos; nothing above v2.0).
- [illustrious-xl.ai model list (site footer)](https://www.illustrious-xl.ai/updates/21) — `[OFFICIAL]`, accessed 2026-09-03 (nine models incl. v3.0 EPS / v3.0 VPred / v3.5 VPred; page body client-rendered and unreadable).
- [Illustrious XL 3.0-3.5-vpred dev blog by Angelbottomless, reprint](https://neverbiasu.github.io/posts/reprints/illustrious-xl-3.0-3.5-vpred-2048-resolution-and-natural-language.html) — `[CREATOR]` words via `[LORE]` channel, published 2025-03-22, accessed 2026-09-03. **Source of the control-token vocabulary.**
- [Illustrious-xl-v3.5-vpred release notes (SeaArt mirror of the official version description)](https://www.seaart.ai/models/detail/40217d3a4243c870589707a95fe350a0) — `[OFFICIAL]` text via mirror, publish date 2025-06-16, model-info update 2025-08-13, accessed 2026-09-03.
- [Illustrious XL v2.0 Update And User Guide (SeaArt, GrayMan)](https://www.seaart.ai/articleDetail/cvceb6le878c73bckfig) — `[LORE]`, updated 2025-03-18, accessed 2026-09-03. Only source for Illustrious quality prefix, CFG band, CLIP-skip 2 and negative list.
- [Laxhar/noobai-XL-Vpred-1.0 card](https://huggingface.co/Laxhar/noobai-XL-Vpred-1.0) — `[OFFICIAL]`, accessed 2026-09-03.
- [Laxhar/noobai-XL-1.1 card](https://huggingface.co/Laxhar/noobai-XL-1.1) — `[OFFICIAL]`, accessed 2026-09-03.
- [NoobAI-XL V-Pred-1.0 Civitai description via CivArchive](https://civarchive.com/models/833294) — `[OFFICIAL]` description text, published 2024-12-22, accessed 2026-09-03. **Source of the verbatim Karras ban and CFG-Rescale 0.2.**
- [cagliostrolab/animagine-xl-4.0 card](https://huggingface.co/cagliostrolab/animagine-xl-4.0) — `[OFFICIAL]`, v4.0 2025-01-24 / Opt 2025-02-13, accessed 2026-09-03.
- [regiellis/ComfyUI-EasyIllustrious README](https://raw.githubusercontent.com/regiellis/ComfyUI-EasyIllustrious/main/README.md) — `[LORE]`, accessed 2026-09-03 (third-party Illustrious defaults and troubleshooting ladder).
- `PromptStudio.html` lines 526, 700-719, 835, 1256-1262, 1713, 2157 — read-only, 2026-09-03, for the export/validator gap list.
