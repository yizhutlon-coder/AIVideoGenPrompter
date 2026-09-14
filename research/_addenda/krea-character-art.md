# Krea 2 and painterly 2D game-character art — addendum

Addendum to the image corpus (`flux.md`, `sdxl.md`, `z-image.md`, `qwen-image.md`, `new-models.md`,
`_addenda/image-catch-up.md`). Research pass: **2026-08-17**. All URLs accessed **2026-08-17** unless noted.

**Driving use case.** A teacher / hobby game-dev wants to generate 2D game character art **locally**:
painterly rather than glossy-digital (matte texture, muted palette), **full-body** characters on a
**flat solid-colour background** for chroma cutout, consistent across many generations.

Evidence labels as in the main corpus: `[OFFICIAL]` (vendor doc/code/model card), `[STAFF]` (named
vendor employee, non-doc), `[TESTED]` (methodology stated inline), `[LORE]` (community consensus, no
methodology), `[SPECULATION]`, `[SYNTHESIS]` (my inference from the above).

---

## 0. Bottom line up front

| Question | Answer |
|---|---|
| Does a model named "Krea 2" exist? | **Yes.** Krea's own from-scratch foundation model, not a FLUX fine-tune. |
| Released when? | Hosted product **May 2026**; **open weights 2026-06-22**, technical report **2026-06-23**. |
| Open weights / locally runnable? | **Yes.** Two checkpoints on Hugging Face: **Krea 2 Raw** and **Krea 2 Turbo**. Native ComfyUI support. |
| License | **Krea 2 Community License** — gated download, custom, *not* Apache/MIT. Revenue + seat caps. |
| VRAM | FP8 Turbo ≈ **12.0 GiB** weights (16 GB card realistic floor, 12 GB reported working); BF16 ≈ **24.8 GiB**. |
| Is it the best local pick for painterly game character art? | **Probably yes as a base**, but the flat-background + full-body discipline comes from prompt craft, not the model. See §5. |

The **confusion to clear up first**: there are *three* different "Krea" things and people mix them
constantly.

1. **FLUX.1 Krea [dev]** (July 2025) — BFL × Krea collaboration, a **FLUX.1 [dev]-architecture**
   aesthetic fine-tune, open weights, the famous "anti-AI-look" model. Still exists, still runs, but
   it is a 2025 model on the FLUX.1 dev codebase and non-commercial dev license.
2. **Krea 1** — Krea's hosted in-house model, 2025. FLUX.1 Krea [dev] is described by Krea as the
   open-weights version of Krea 1.
3. **Krea 2 (K2)** — Krea's **first foundation model trained from scratch**, 12–12.9B DiT, Qwen3-VL
   text encoder, open weights June 2026. **This is what the user should use.**

So the answer to "is Krea 2 cloud-only?" is **no** — it is genuinely local, and it is the current
best-in-family option. But the cloud product has features the open weights do **not** fully ship
(see §1.4: Medium/Large variants, creativity slider, moodboards).

---

## 1. What Krea 2 actually is

### 1.1 Identity, dates, architecture `[OFFICIAL]`

Hugging Face model card, `krea/Krea-2-Turbo`
(<https://huggingface.co/krea/Krea-2-Turbo>), "Model Overview", verbatim:

> - **Model Name:** Krea 2
> - **Version:** v1.0
> - **Release Date:** June 22, 2026
> - **Model Type:** Text-to-image diffusion model
> - **Architecture:** Diffusion Transformer with 12 billion parameters
> - **License:** Krea 2 Community License
> - **Release Format:** Open-weight release and Krea-hosted product integrations
> - **Model Developer:** Krea.ai, Inc.

Checkpoints, verbatim from the same card:

> - **Krea 2 Raw:** Base release checkpoint, prior to additional post-training and fine-tuning.
> - **Krea 2 Turbo:** Post-trained release checkpoint with additional fine-tuning and distillation.

Technical report (Sangwu Lee et al., published `2026-06-23T15:00:00.000Z`,
<https://www.krea.ai/blog/krea-2-technical-report>), architecture, verbatim:

> "We develop a simple yet performant [diffusion transformer (DiT)] architecture through thorough
> ablations. Our model incorporates several components that accelerate convergence, including iREPA,
> improved VAEs, and Qwen3-VL. We also integrate several architectural improvements, including
> grouped-query attention (GQA), sigmoid-gated attention, lightweight timestep modulation, and
> multilayer feature aggregation for text-encoder features…"

Text encoder choice, verbatim:

> "We used T5-XXL as our baseline text encoder… Ultimately, we use **Qwen 3 VL as our final text
> encoder**, as a VLM offers a richer input space (text and image) and stronger multilingual
> generalization."

Autoencoder, verbatim:

> "we therefore initially used the Qwen Image autoencoder to scale our early models and later adopted
> the FLUX 2 VAE for our larger models."

**Note the parameter-count discrepancy.** The HF card says "12 billion parameters"; the HF sidebar
reports "13B params"; the technical report gives **no** parameter count; secondary coverage
consistently says **12.9B**. `[SYNTHESIS]` Treat **~12.9B** as the practical number (it matches the
BF16 file size of 24.76 GiB ÷ 2 bytes) and quote "12B" only when citing the model card.

### 1.2 Training resolution `[OFFICIAL]`

Technical report, verbatim:

> "Pretraining data spans 256px, 512px, and 1024px resolution stages."

But the official prompting guide says (verbatim, <https://github.com/krea-ai/krea-2/blob/main/docs/prompting.md>):

> "The turbo model can generate up to 2k resolution images."

and ComfyUI docs say "Krea 2 supports outputs from 1K to 2K. Set the megapixels value to 2.0 to get
2K resolution."
(<https://docs.comfy.org/tutorials/image/krea/krea-2>).

Native 2K/4K is listed in the report as **future work**, verbatim:

> "We aim to expand the capabilities of Krea models to include robust editing, image reference, and
> native 2K/4K generation."

`[SYNTHESIS]` Pretraining ladder tops out at 1024px; high-res capability is instilled in midtraining;
2K output is supported and recommended by the vendor. **Generate at 1K–2K natively rather than
generating small and upscaling** — this is the one setting everyone agrees on. `[LORE]` InstaSD:
"generating at 1024 and upscaling is throwing away capability you already downloaded"
(<https://www.instasd.com/post/krea-2-prompt-and-style-guide-comfyui>).

### 1.3 License — the catch `[OFFICIAL]` + `[LORE]`

The HF repo is **gated**: you must log in, agree to the *Krea 2 Community License Agreement*
(PDF link on the card) and acknowledge the *Acceptable Use Policy* before downloading.

Model card, verbatim (this is a real obligation, not boilerplate):

> "Under the Krea 2 Community License, **deployers are required to implement content filtering
> measures or equivalent review processes** to prevent the generation or distribution of unlawful or
> policy-violating content appropriate to their use case. Deployers who fail to implement required
> safeguards are in breach of the license."

The technical report only says (verbatim):

> "The model weights and inference are released under a permissive license."

`[LORE]` The commonly reported commercial threshold is **under $1M annual revenue AND under 50 seats**
(<https://localaimaster.com/blog/krea-2-local-guide>, 2026-07-20). Two independent write-ups repeat
it; a third (InstaSD) explicitly refuses to state the boundary: *"the sources I've read disagree on
the exact boundary, so read the actual license text and not a blog post about it. Including this
one."*

**Corpus rule:** state the $1M/50-seat figure only as `[LORE]`, always with the "read the actual
license" caveat. For a **teacher generating classroom / small-indie assets, this is a non-issue.**
`[LORE]` The Reddit AMA also surfaced a concern that the license is **revocable**, which matters for
anyone building a product on it (<https://blog.bymar.co/posts/krea-2-open-weights-image-model/>,
2026-06-29).

### 1.4 What the open weights do NOT include `[SYNTHESIS]`

Several widely-cited Krea 2 features are **hosted-product only** or ship as separate adapters. Do not
promise them in a local workflow:

| Feature | Local status |
|---|---|
| **Medium / Large variants** | **Cloud only.** fal's guide (<https://fal.ai/learn/tools/krea-2-prompting-guide>, 2026-05-25) documents `Krea 2 Medium` and `Krea 2 Large` as API endpoints. The open weights are **Raw** and **Turbo** only. |
| **Creativity parameter** | Cloud only. fal: "The creativity parameter is unique to Krea 2." No local equivalent. |
| **Moodboards / Generative Sliders** | Cloud only. The words "moodboard" and "slider" appear **nowhere** in the technical report. |
| **Style reference (image → style)** | **Local, but as a separate stack**: `krea2_turbo_int8_convrot.safetensors` + `krea2_style_reference.safetensors` LoRA, per ComfyUI docs. Not the base T2I workflow. |
| **Prompt expander** | **Local, optional.** ComfyUI ships it as a `prompt_enhance` toggle in the template subgraph. See §2.5 — **you usually want it OFF for this use case.** |
| **Edit / inpaint model** | **Does not exist yet.** `[STAFF]` AMA: the head of research said they are "currently working on an edit version" but "don't like over-promising things." No timeline. |

### 1.5 Running it locally

`[OFFICIAL]` ComfyUI docs (<https://docs.comfy.org/tutorials/image/krea/krea-2>) — the canonical
three-file layout:

```
ComfyUI/
├── models/
│   ├── diffusion_models/  krea2_turbo_fp8_scaled.safetensors    (recommended)
│   ├── text_encoders/     qwen3vl_4b_fp8_scaled.safetensors
│   ├── vae/               qwen_image_vae.safetensors
│   └── loras/             krea2_softwatercolor.safetensors (etc.)
```

Files come from `Comfy-Org/Krea-2` on Hugging Face. Other variants: **BF16, NVFP4, MXFP8**
("for users with higher-end hardware"). Community INT8/INT4 ConvRot and GGUF quants exist
(`realrebelai/KREA-2_GGUFs`, `molbal/krea2-gguf`) — `[LORE]` GGUF needs a **patched** GGUF node fork
because stock nodes throw "Unexpected architecture type" on this DiT.

`[OFFICIAL]` Official CLI (HF card, verbatim):

```bash
uv run inference.py "a fox walking in the snow" \
 --checkpoint oss_turbo --steps 8 --cfg 0.0 --mu 1.15 --width 2048 --height 2048
```

`[OFFICIAL]` diffusers (HF card, verbatim):

```python
pipe = Krea2Pipeline.from_pretrained("krea/Krea-2-Turbo", torch_dtype=torch.bfloat16).to("cuda")
image = pipe("a fox in the snow", num_inference_steps=8, guidance_scale=0.0).images[0]
```

**VRAM.** `[LORE]` Neither the HF card nor ComfyUI docs publish minimums. Measured file sizes
(InstaSD): **BF16 Turbo 24.76 GiB, FP8 12.01 GiB**. Practical guidance found:

- 16 GB — comfortable FP8 floor (LocalAIMaster arithmetic; InstaSD "fits a 16GB card with the encoder loaded")
- 12 GB — reported working with FP8 (`[TESTED]` earngenix, RTX 4090 host, states 12 GB minimum; bymar.co reports 12 GB cards running FP8)
- 6 GB — community INT4 ConvRot only, with visible fine-texture loss `[LORE]`
- 24 GB+ — BF16

**Contradiction register — ComfyUI version.** Sources disagree badly: bymar.co says "ComfyUI 0.25.0
shipped with native Krea 2 support"; LocalAIMaster says "v0.26.0… June 23, 2026"; earngenix says
"v0.3.7+". `[SYNTHESIS]` These are different versioning schemes being conflated by secondary
sources. **Do not cite a specific ComfyUI version.** Say: "native support landed within a day of the
weights; update ComfyUI to the latest and use the built-in Krea-2 template."

**Contradiction register — VAE.** ComfyUI's own docs specify `qwen_image_vae.safetensors`. The
earngenix character-consistency tutorial instructs `Wan2_1_VAE_bf16.safetensors`. `[SYNTHESIS]`
**Trust the ComfyUI docs — `qwen_image_vae`.** The technical report confirms Qwen Image VAE / FLUX 2
VAE lineage; Wan 2.1's VAE is a video VAE and is almost certainly a copy-paste error in that
tutorial. (The separate `Wan2.1-VAE-upscale2x` recommendation in the AMA thread is an *upscaler*, a
different thing.)

---

## 2. The Krea 2 prompt dialect

### 2.1 Official guidance — verbatim `[OFFICIAL]`

The **entire** official prompting doc
(<https://github.com/krea-ai/krea-2/blob/main/docs/prompting.md>) is four sentences. Quoted in full
because it is short and load-bearing:

> "We recommend users to use **natural language prompts** to generate images.
> The turbo model can generate up to 2k resolution images. **Long detailed prompts yield best
> results, but the model is capable of generating high quality images with minimal prompt
> engineering.** For text rendering, we recommend putting **quotes** around the words to be rendered.
> If you wish to use LLM assistance for generating longer prompts, check out expansion.txt and use it
> as a system prompt for LLM of your choice."

That's it. **No CFG guidance, no negative-prompt guidance, no length numbers, no style vocabulary.**
Everything else in circulation is community-derived. Label accordingly.

The doc's *value* is its **19 worked example prompts**, all generated at 2K on Turbo. Those are the
real dialect specification — see §2.6 and §4.

### 2.2 Why prose, not tags `[OFFICIAL]` + `[LORE]`

`[OFFICIAL]` Training captions were long and natural-language, verbatim from the technical report:

> "Once a context-rich, long-form natural-language caption is obtained, we use a cheaper LLM to
> reformat it into a variety of lengths and formats, exposing the model to a range of prompt styles.
> Empirically, we find that **training on long prompts provides dense supervision, yielding faster
> convergence and lower training loss.** For many downstream and applied use cases, however,
> performance on short and medium-length prompts remains important. We therefore train predominantly
> on long captions while ensuring the model is exposed to short and medium-length prompts throughout
> training."

`[LORE]` InstaSD, on the practical consequence of a 4B VLM encoder:

> "A decade of CLIP conditioning taught everyone to prompt in keyword confetti, 'masterpiece, best
> quality, 8k, ultra detailed,' and Krea 2 just... ignores that stuff. The Qwen3VL encoder is a 4B
> vision-language model. **It parses grammar. Spatial relationships survive. Possessives survive.
> Counts mostly survive**…"

`[LORE]` The same source's working recipe: *"describe the finished photo to an imaginary person over
the phone. Subject, what they're doing, where the light comes from, one or two textures worth caring
about. Stop."* And the diagnostic: *"When a generation goes mushy on me, the prompt almost always
turns out to be either **two competing actions or zero described light**."*

### 2.3 Length `[LORE]`

Officially only "long detailed prompts yield best results." Community bands, consistently reported by
two independent sources (Civitai `Cyberdelia`, <https://civitai.com/articles/33736/>, 2026-08-10;
and the krea2.co prompt guide):

| Goal | Words |
|---|---|
| Exploration / let the model decide | 5–20 |
| Controlled image | 30–80 |
| Complex scene with specified palette | 80–140 |

`[LORE]` Notably, Krea 2 **tolerates short prompts** where Z-Image Turbo does not — Cyberdelia:
"Short prompts don't confuse Krea 2 the way they confuse ZIT." For our use case (exact background
colour, exact framing) we are firmly in the **80–140 word** band.

### 2.4 CFG, steps, negatives — the guidance-distillation story

`[OFFICIAL]` Turbo is **guidance-distilled**. The technical report describes the mechanism, verbatim:

> "After the RL stage, we include an optional timestep-distillation stage in which we apply
> **guidance distillation and timestep distillation simultaneously**… we adopted Trajectory
> Distribution Matching (TDM)…"

and on CFG during training, verbatim:

> "We therefore train the whole RL stage **without CFG**… At inference time, CFG can still be enabled
> as an additional control knob, further improving quality when desired."

`[OFFICIAL]` Official inference values: **Turbo = 8 steps, cfg 0.0, mu 1.15**, up to 2048×2048.

`[LORE]` **Raw = ~52 steps at CFG 3.5** (InstaSD, Cyberdelia, ComfyUI docs all say 52 steps; the 3.5
CFG figure is community).

**⚠ The single most useful gotcha in this whole document** — `[LORE]`, Cyberdelia, verbatim:

> "One workflow-specific catch: the standard ComfyUI KSampler node doesn't accept CFG 0.0 the same
> way. Its guidance formula reads 0.0 as pure unconditional output, so **the prompt gets ignored and
> the image breaks**. On stock KSampler, **use CFG 1.0** instead, which is that node's version of 'no
> extra guidance.' Krea-aware custom samplers, and Krea's own tools, handle 0.0 fine."

Corroborated independently: the `brushcelstyle` LoRA card states its showcase settings as
"Krea 2 Turbo fp8, euler / beta, **8 steps, CFG 1.0, empty negative through ConditioningZeroOut**";
bymar.co likewise reports "CFG 1.0, 8 steps."

**Negative prompts.** `[SYNTHESIS]` At CFG 0.0/1.0 there is no unconditional branch to steer away
from, so negatives are near-inert. `[LORE]` Cyberdelia: "Krea 2: barely functional at CFG 0.0,
troubleshooting only." The recommended pattern is `ConditioningZeroOut` for the negative slot.

**But there is one documented exception where a negative does work** — `[TESTED]` earngenix
(<https://www.earngenix.com/tutorials/krea-2-character-consistency-comfyui>, 2026-07-13, RTX 4090):
Krea 2 spontaneously emits side-by-side comparison panels, and this negative suppresses it:

```
diptych, split screen, two panels, side by side, before and after comparison, collage, multiple images
```

`[SYNTHESIS]` For our use case this is **directly relevant**: "character sheet"-adjacent prompts are
exactly the kind that trigger unwanted multi-panel output. Keep this negative on hand.

### 2.5 The prompt enhancer — turn it OFF for this job

`[OFFICIAL]` ComfyUI's Krea 2 template ships `prompt_enhance` **enabled by default**: "The defaults
(8 steps, prompt enhancement enabled, no LoRA) produce a high-quality image with minimal
configuration."

`[OFFICIAL]` The enhancer's system prompt is published verbatim as `docs/expansion.txt`
(<https://github.com/krea-ai/krea-2/blob/main/docs/expansion.txt>). Two of its nine rules matter here:

> "**1. Faithfulness First:** Preserve all original subjects, actions, colors, and spatial
> relationships. Do not add new objects, props, characters, or animals unless the user clearly
> implies them."

> "**5. Avoid Over-Specification:** Do not invent highly specific clothing, colors, materials, or
> scene details unless the input supports them."

> "**7. Respect Existing Detail:** If the user's prompt is already detailed, **lightly polish and
> finalize rather than heavily expanding** — preserve their phrasing and direction."

> "**9. Preserve User Medium:** When the user explicitly requests a medium (e.g. 'photo of',
> 'photograph of', 'illustration of', 'painting of', 'sketch of', '3D render of'), honor it. **Do not
> pivot to a different medium** to avoid difficulty — match the user's stated intent."

`[SYNTHESIS]` **Recommendation: disable `prompt_enhance` for flat-background sprite work.** The
enhancer is a *creativity* tool — the technical report says it is explicitly RL-trained *against*
diversity collapse, i.e. it is rewarded for adding visual variation:

> "One failure mode we explicitly optimize against is diversity collapse… we add a simple DINOv3
> embedding diversity score over prompt groups, **rewarding intra-group visual diversity** alongside
> quality and alignment."

Variation is the enemy of a repeatable sprite pipeline. It is also the most likely mechanism for a
"solid magenta background" prompt coming back with a gradient or a hint of environment. Rule 7 means
a long, already-detailed prompt is mostly safe — but "mostly" is not "exactly."

Corroborating `[LORE]`: earngenix's Krea 2 workflow guide — "Disable it in the workflow only if
you're writing a fully detailed long prompt yourself and want exact control over every phrase."
Also relevant: **ComfyUI issue #14631**, "System Prompt wording in Krea-2 default workflow causing
incorrect refusals" (<https://github.com/Comfy-Org/ComfyUI/issues/14631>) — the enhancer LLM can
*refuse* prompts outright, which is a second reason to switch it off.

### 2.6 Emphasis / weighting `[LORE]`

`(word:1.3)` **does not work** and is reported by two independent sources to actively damage output.
InstaSD, verbatim:

> "That syntax was built for CLIP, where every token carries its own weight… The Qwen3VL encoder
> reads the whole sentence as language, so **scaling one token's embedding shoves the entire
> conditioning around** instead of lifting that one word. Push much past 1.2 and the picture falls
> apart before the emphasis ever lands."

Three replacement moves, verbatim from InstaSD (Cyberdelia independently gives the same first and
third):

> - "**Order carries the emphasis.** The encoder front-loads. Whatever comes first reads as the
>   subject, so lead with the thing that matters."
> - "**Restate instead of multiply.** Rather than `(rust:1.4)`, describe the rust twice in different
>   words: 'a rusted iron gate, orange corrosion eating through the hinges.'"
> - "**Be specific, not loud.** Weighting in CLIP was a volume knob. Here it's a vocabulary problem.
>   'Red' at 1.5 gets you a fight with the model. **'Oxblood' gets you the color on the first try.**"

`[SYNTHESIS]` For an exact chroma-key colour this is the key insight: **name the colour precisely and
restate it**, don't weight it. See §4.2.

### 2.7 What to NOT write `[LORE]`

Quality-tag soup is inert or harmful. krea2.co prompt guide, paraphrased consensus across sources:
don't write "beautiful," "amazing," "8k," or "masterpiece" — "Krea has its own aesthetic prior and
these words either get ignored or pull in random directions."

`[SYNTHESIS]` This is consistent with the corpus's existing position on meta-tags for prose-encoder
models. **Carry the existing corpus rule forward unchanged.**

### 2.8 Prompt ordering `[LORE]`

Cyberdelia's Krea-2-specific order:

> "**Krea 2:** subject, setting, composition and camera, lighting, mood, medium and style, texture
> detail. **If the medium itself is the point** (a risograph poster, a woodblock print), **lead with
> the medium instead of the subject.**"

`[SYNTHESIS]` For painterly game art the medium *is* the point. **Lead with the medium.** This is
directly confirmed by Krea's own official examples, which do exactly that — e.g.
`"A minimalist flat-color illustration of a person wading through…"`,
`"stylized digital painting of a dark convertible…"`,
`"vintage analog collage, central irregularly shaped snowy mountain range…"`.

---

## 3. Does Krea 2 avoid the "AI look," and does prompting change that?

### 3.1 The design thesis `[OFFICIAL]`

Technical report abstract and intro, verbatim:

> "In this technical report we introduce Krea 2: a series of foundation models designed for both wide
> aesthetic diversity and user creative control."

> "Yet as the field has optimized for reliability on these capabilities, **many systems have converged
> toward a narrow set of default aesthetics.** While effective production tools, this makes them less
> effective as engines for creative exploration, where users often need to search across styles,
> moods, compositions and visual directions rather than **receive a single polished default**."

### 3.2 The three mechanisms that actually produce it `[OFFICIAL]`

This is the part worth teaching, because it explains *why* prompting for painterly works better here
than on a photoreal-tuned model.

**(a) No AI-generated images in pretraining.** Verbatim:

> "Importantly, **we use no AI-generated images in our pretraining mix.** Synthetic data and
> distillation can be an effective shortcut for acquiring model capabilities. However we find that
> **even a small proportion of AI-generated images introduces biases into the model's output
> distribution**, as synthetic images tend to be easier to learn, which effectively imposes an upper
> bound on model quality. We therefore designed in-house classifiers to filter such images out."

**(b) Aesthetic-score filtering deliberately rejected.** Verbatim:

> "We argue that conventional model-based filtering, which uses aesthetic-score and image-quality-
> assessment (IQA) models, **introduces implicit biases**. For example, such methods may classify a
> blurry image as low quality, even though **motion blur or softness can be a deliberate artistic
> choice**."

And, critically:

> "Importantly, these quality scores are used **only to drop images of extremely poor quality, not to
> oversample images on the basis of their scores.**"

`[SYNTHESIS]` (a) + (b) are precisely the two pipeline decisions that produce the plastic/glossy
"AI look" in other models. Krea explicitly declined both. **This is the substantive, non-marketing
reason to prefer Krea 2 for matte painterly work.**

**(c) An SFT stage that specifically fixed saturation and texture.** Verbatim:

> "We find this stage particularly helpful for improving overall checkpoint quality and for
> **addressing the high-saturation and texture issues that are prevalent in earlier checkpoints.**"

### 3.3 Does prompting change it? `[SYNTHESIS]`

**Yes, strongly, and more so than on photoreal-leaning models.** The report's own framing is that the
model exposes "a broad visual space and give[s] users practical ways to move through it, using both
text and image-based control." The model is a *wide distribution*; the prompt is the *selector*. A
photoreal-tuned model resists a painterly prompt because its distribution is narrow; Krea 2 does not.

`[LORE]` bymar.co on a community anime/illustration sample: *"The sketchy line work, muted palette,
and hand-drawn aesthetic are hard to get from photoreal-leaning models. K2 keeps the painterly
texture intact."*

**Caveat `[OFFICIAL]`:** the model has a *known* pull toward the opposite of what we want for
backgrounds. Verbatim from the report:

> "As an example, one issue we encountered while pretraining K2 was **a tendency for the model to
> generate flat-color backgrounds and border artifacts.** To mitigate this, we used RGB entropy,
> white/black pixel ratios, custom heuristics, and **in-house classifiers to filter out samples that
> induced this behavior.**"

`[SPECULATION]` — flagged clearly because it matters and is unproven: Krea **deliberately trained
away** the flat-colour-background tendency. That means our headline requirement (perfectly uniform
solid background) is fighting a documented data-filtering decision. Expect this to be the hardest of
the five requirements to satisfy, and expect a post-process step to be mandatory rather than
optional. *No test was run to confirm this; it is an inference from one sentence in the report.*
Counter-evidence: Krea's own official example prompts include several with successful solid
backgrounds (§4.2), so the capability clearly survives — it may just need explicit prompting.

---

## 4. Character-art technique — the five requirements

Everything in this section is prompt-side. Ordered by how reliably it's evidenced.

### 4.1 (c) Painterly / matte, avoiding plastic gloss — **best evidenced**

`[OFFICIAL]` Krea's own prompting doc contains four examples that *are* the answer. Verbatim:

> `A dynamic digital painting of a joyful girl in a sailor uniform stretching her arms high against a
> solid vibrant blue background. She has short dark windblown hair, amber eyes, and a bright smile.
> She wears a white shirt, striped blue collar, flowing red neckerchief, and a billowing blue pleated
> skirt. **Expressive thick brushstrokes and bold shading emphasize energetic motion.**`

> `A tiny figure and a small white dog sit side-by-side in the deep green shadow of a massive tree…
> The **stylized, painterly landscape features flattened perspective, visible brushstrokes, and
> intense color contrast.**`

> `A minimalist **flat-color illustration** of a person wading through expansive shallow ocean waves…
> The ocean is rendered in **muted mint green with delicate, thin black linework**… utilizing a clean
> **ligne claire drawing aesthetic with a subtle paper texture.**`

> `1990s vintage anime style cel animation… tightly framed medium shot, **flat shading, soft muted
> retro.**`

**Extracted vocabulary that Krea itself uses and vouches for** (these are the phrases to build a
picker from):

| Effect wanted | Verbatim phrases from official examples |
|---|---|
| Painterly texture | `expressive thick brushstrokes`, `visible brushstrokes`, `blocky painterly brushstrokes`, `bold shading`, `heavily textured` |
| Flat / matte | `flat-color illustration`, `flat shading`, `flat 2d shapes`, `matte finish`, `flattened perspective` |
| Muted palette | `soft muted retro`, `muted mint green`, `muted earthy color palette`, `warm neutral tones` |
| Print / paper grain | `subtle paper texture`, `grainy paper texture`, `granular stippled shading`, `volumetric grain`, `halftone texture` |
| Line quality | `clean ligne claire drawing aesthetic`, `delicate, thin black linework`, `bold black outlines` |
| Medium naming (lead with these) | `stylized digital painting of…`, `A minimalist flat-color illustration of…`, `vintage analog collage…`, `an ukiyo-e woodblock print of…` |

`[LORE]` fal's guide, Technique #1, verbatim: *"Krea 2 responds well to specific material and
rendering language… The more specific the visual language, the more precise the output."*

`[LORE]` Anti-gloss exclusions circulating for FLUX-family prose models (weak evidence, no
methodology): "no oil paint, no impasto, no canvas texture, no palette-knife strokes, **no digital
gloss**." `[SYNTHESIS]` **Do not use these as negatives on Krea 2** (§2.4 — negatives are inert).
Convert them into positive statements instead: not "no digital gloss" but `matte surface, no specular
highlights on skin, dry pigment finish`. Phrasing an exclusion as a positive constraint is the same
rule Cyberdelia gives for Z-Image: *"Instead of 'no blur,' write 'razor-sharp focus, crisp detail.'"*

**LoRA route `[LORE]`.** `brushcelstyle` (<https://civitai.com/models/2749544>, published 2026-07-02,
441 downloads-ish, 37 positive reviews) is a purpose-built painterly LoRA for Krea 2 — *"turns Krea
2's photoreal output into something that looks hand-painted over a 3D render."* Trigger word
`brushcelstyle` **placed at the start of the prompt**; strength 1.0 default, usable 0.5–2.0;
**model-only LoRA — must use `LoraLoaderModelOnly`, there is no CLIP half.** Trained with
ai-toolkit on **Raw**, run on **Turbo**, rank 16 / alpha 16, ~1250 steps, natural-language captions.

**Official style LoRAs `[OFFICIAL]`.** Nine ship with the weights. The trigger phrases are
non-obvious and must be typed exactly (table from ComfyUI docs; recommended strength 1.0 for all):

| LoRA | Trigger word |
|---|---|
| krea2_darkbrush | `monochrome ink wash style` |
| krea2_dotmatrix | `monochrome stippling style` |
| krea2_kidsdrawing | `naive expressive sketch style` |
| krea2_neondrip | `textured abstract style` |
| krea2_rainywindow | `rainy window style` |
| krea2_retroanime | `purple retro anime style` |
| krea2_softwatercolor | `art deco watercolor style` |
| krea2_sunsetblur | `ethereal motion blur style` |
| krea2_vintagetarot | `vintage tarot style` |

`[LORE]` InstaSD's warning is the useful part: *"Every 'this LoRA does nothing' complaint I've read
traces back to a prompt fighting the LoRA with its own style words… **Pick a lane.**"* i.e. when a
style LoRA is loaded, **keep the rest of the prompt about content, not style.**

For our use case: `krea2_softwatercolor` (matte, muted) and `krea2_kidsdrawing` are the closest
official fits; `brushcelstyle` is the closest community fit.

### 4.2 (b) Flat solid single-colour background — **well evidenced, but needs post-processing**

`[OFFICIAL]` Krea's own examples repeatedly use solid backgrounds and they clearly work. Verbatim
fragments:

- `…smooth vinyl texture, studio lighting, **solid vibrant blue background**, high contrast minimal composition`
- `…stretching her arms high **against a solid vibrant blue background**`
- `The background is **a solid, striking crimson red.**`
- `…**solid striking crimson red background**, soft directional studio lighting`
- `…isolating the brightly lit features **against a pitch-black background**`
- `…alternating tiles with **solid azure blue background squares**`
- fal's official-partner example: `…**solid bright chroma green background**, bold black outlines…`
- fal's official-partner example: `fantasy concept art of a dark blue skinned elven archer riding a white tiger, **solid green backdrop, flat graphic design**…`
- fal's official-partner example: `Stylized 3D toy character **on a solid cobalt blue background**…`

`[SYNTHESIS]` The canonical construction is **`solid <adjective> <colour> background`**, with
`solid` doing the work. Krea uses `solid vibrant blue`, `solid striking crimson red`, `solid bright
chroma green`, `solid cobalt blue`. Note that **`solid green backdrop` appears alongside `flat
graphic design`** — pairing the background instruction with a flatness instruction for the *whole
image* appears to be the working pattern.

**Recommended phrasing for chroma-key magenta** `[SYNTHESIS]`, built from the above + §2.6's
"be specific, not loud" + "restate instead of multiply":

```
…, solid flat magenta background, uniform bright magenta backdrop filling the entire frame behind the
figure, no environment, no props, no floor line, no cast shadow, even flat lighting on the character
```

Rationale, per rule: `solid flat` = Krea's own construction; `uniform … filling the entire frame` =
the restatement (§2.6) rather than a weight; `no environment / no floor line / no cast shadow` are
stated **in the positive prompt as facts about the scene**, not in a negative slot (§2.4).

`[LORE]` A phrasing reported for uniform fills generally: *"a perfectly uniform image in color
[colour]. No texture, no gradient, no shadows."*

**⚠ Two hard limits — `[TESTED]` from adjacent tooling, and they generalise:**

1. **Diffusion models do not hit an exact hex value.** Documented failure from a sprite pipeline:
   *"the AI video model didn't preserve the precise pink chosen. It interpolated it like any other
   color. By the end, **#FF00FF had become a cloud of pinks, magentas, and purples**."*
   (<https://roboticape.com/2026/03/07/generating-game-sprites-with-gemini-image-generation-nano-banana-pro-lessons-learned/>)
2. **No local diffusion model outputs true alpha.** You always need a post-processing step.

`[SYNTHESIS]` **Therefore the prompt's job is not "produce #FF00FF" — it is "produce a background
that is a single flat hue, uncontaminated by the character's palette, and easy to key."** Then key it
with a tolerance-based tool (threshold ~70 / strength ~80 are the reported starting values for hard
sprite edges), or use a background remover / SAM-style matte instead of chroma keying at all.

**Colour choice `[LORE]`:** magenta is correct for characters with greens and blues — *"Magenta is
the go-to chroma key color for content with greens and blues, since it shouldn't appear in isometric
foliage, stone, or sky."* Pick the key colour to be **absent from the character's palette**, and
change it per character if needed.

**Corroborating design decision `[OFFICIAL]`:** fal's own sprite-sheet LoRA for FLUX.2 klein made
exactly this choice, and says why:

> "The output uses a **consistent red background** by design. This solid color background: improves
> style consistency across all 4 views; makes it easy to remove the background for game integration;
> ensures clean edges for sprite extraction."
> (<https://huggingface.co/fal/flux-2-klein-4b-spritesheet-lora>)

Note the first bullet — a solid background **also improves cross-generation style consistency**.
That's a free win for requirement (e).

### 4.3 (a) Full body with feet in frame — **weakly evidenced; treat as craft, not science**

There is **no Krea-2-specific** guidance on this, and no rigorous test anywhere. What exists:

`[LORE]` Aspect ratio is the biggest lever: *"Using a portrait aspect ratio of at least 2:3 or taller
helps ensure full-body generation, as square and 4:3 formats regularly cut off the lower body."*
`[SYNTHESIS]` This is mechanically plausible (the model composes to fill the canvas) and costs
nothing. **Generate sprites at 2:3 or 9:16, never 1:1.** Krea 2's own FAQ recommends "a portrait crop
(3:4 or 4:5) for single key portraits" — for *full body* go taller than that.

`[LORE]` Prompt phrases reported to help, across FLUX/SDXL/Midjourney communities:
- `full body`, `head to toe`, `complete figure`, `full-length portrait`, `full shot`
- one write-up claims **`full shot` outperforms `uncropped` and `head to toe`** — no methodology given
- `zoomed-out`, `view from a distance`, `wide angle`
- **naming the footwear** (`wearing scuffed leather boots`) — the most-repeated trick, on the theory
  that a described object must be rendered
- an action that implies standing: `standing confidently`, `walking forward`
- `both feet visible`, `standing on the ground plane`

`[SYNTHESIS]` **Ranked recommendation** (highest-confidence first): (1) tall aspect ratio;
(2) describe the shoes/boots as a specific object with colour and material; (3) `full body` + a
standing verb; (4) explicitly state there is empty space above the head and below the feet. Since
§2.6 says restatement beats weighting, use **two** framing statements, e.g.
`full-body view, the entire figure from head to boots inside the frame with margin above and below`.

`[SYNTHESIS]` **Cheapest reliable fix is not prompt-side at all:** generate tall, then pad/outpaint,
or simply accept a wider frame and crop. For a solid-background sprite, extending a *flat* background
downward is trivially easy in any editor — arguably easier than fighting the model.

### 4.4 (d) A-pose / T-pose / specified stance — **weak; LoRAs exist**

No official guidance from Krea. `[SYNTHESIS]` The model was trained on natural-language captions of
real images; "A-pose" and "T-pose" are 3D-pipeline jargon that will be sparsely represented, and
"T-pose" in particular is contaminated by meme imagery.

**Better: describe the pose in plain language rather than naming it.** Krea's own examples do exactly
this — `contrapposto pose, body contorted, one hand outstretched mid-dance` (fal),
`one leg raised high, leans forward` (jester),
`arm bent with hand resting on hip` (fashion editorial). These read as *descriptions*, not pose tags,
and they demonstrably work.

So for a neutral game stance, write something like:
`standing straight and symmetrical facing the viewer, arms relaxed and held slightly away from the
body, palms open and facing forward, feet shoulder-width apart, neutral expression, no dynamic motion`
— which is an A-pose described rather than named.

**LoRA route `[LORE]`.** Dedicated pose LoRAs exist but are on **older base models**:
- `Standard Poses` (Pony Diffusion LoRA, <https://civitai.com/models/729016>) — "made with 5 views:
  front, back, profile (side), three-quarters, and three-quarters back"
- `Pony CharTurn, Multi-View, Turnaround, Model Sheet` (<https://civitai.com/models/692970>)
- `game-character-turnaround-base` (Illustrious LoRA, <https://civitai.com/models/1867374>)

`[SYNTHESIS]` These are **not** loadable on Krea 2 (different architecture entirely). If pose control
matters more than aesthetics, an SDXL/Illustrious stack with ControlNet OpenPose is still the
stronger tool — Krea 2 has **no ControlNet ecosystem** as of Aug 2026, and no edit model (§1.4). This
is the biggest gap in the Krea 2 story for game-asset work.

### 4.5 (e) Consistency across generations — **three tiers, all evidenced**

**Tier 1 — prompt discipline `[OFFICIAL]`.** Krea's character-design article
(<https://www.krea.ai/blog/character-design-with-krea-2>, 2026-05-23), verbatim:

> "*Lock the palette early.* **Pick three to five color words per character and reuse them across
> every sheet. Drift in palette is the biggest cause of inconsistency.**"

> "*Start with silhouettes.* Before locking color, ask the model for the same lineup in flat
> silhouettes against a white background. **If the silhouettes are not distinct, the characters will
> read identically once colored.**"

> "*Use a clean white or neutral background.* Backgrounds distract from the design work."

> "*Pair turnarounds, expressions, and costumes from the same prompt seed.* Keep the character
> description identical across all three sheet types so the references align."

**Tier 2 — image reference (no training) `[OFFICIAL]` + `[TESTED]`.** Krea's own FAQ, verbatim:

> "**Will turnarounds be pixel-consistent across views?** They will be visually consistent — same
> outfit, same hair color, same proportions — but **not pixel-perfect. For pixel-perfect multi-view
> work, generate the front view first, then use it as an image reference for the other views.**"

`[TESTED]` earngenix documents the local ComfyUI equivalent (RTX 4090, 12 GB minimum, Krea 2 Turbo).
The load-bearing finding, verbatim:

> "**Two separate paths carry your reference photo into the sampler, and both matter:** The
> text-encoder path — the reference image is fed into the Qwen3-VL text encoder alongside your
> instruction… The image-latent path — the same reference image is separately VAE-encoded into a
> latent and merged into the conditioning through **ReferenceLatent**. **This is the path doing most
> of the work to hold the face steady.**"

> "Skipping the VAEEncode → ReferenceLatent chain and relying only on the text-encoded reference will
> still run, but **identity preservation drops noticeably.**"

Node chain: `LoadImage` → `TextEncodeQwenImageEditPlus` (positive) **and** `VAEEncode` →
`ReferenceLatent` → `KSampler`. `CLIPLoader` type must be set to **`krea2`** (a documented
easy-to-miss setting). Settings used: steps 12, cfg 2.5, euler/simple, 1280×1280.

⚠ Note the cfg 2.5 here **contradicts** the CFG 0.0/1.0 recommendation in §2.4. `[SYNTHESIS]` The
reference-conditioning workflow appears to want real guidance; the plain T2I workflow does not.
earngenix's own note: *"Pushing CFG higher forces more literal instruction-following but tends to
flatten the natural look Krea 2 is known for."* Treat 2.5 as specific to reference-conditioned runs
and expect it to cost you some of the painterly texture.

Instruction format, verbatim (**preservation language first** — this is the tip):

```
KEEP the same [subject] and change the pose and setting: [new pose, new location, new framing — be
specific about posture, hands, expression, camera angle]. Preserve exact facial identity, makeup,
hairstyle, and clothing details from the reference image.
```

> "Write the 'KEEP' instruction first, before describing the new scene. Putting preservation language
> at the start of the prompt weights it more heavily than burying it at the end."

(Consistent with §2.6, "order carries the emphasis.")

**Tier 3 — LoRA `[OFFICIAL]`.** Krea: *"Train a LoRA once the design is locked. A LoRA takes about 20
minutes and gives you that exact character on demand for every future generation."* And the family
rule, from ComfyUI docs verbatim: **"train LoRAs on RAW, run inference on Turbo"** — *"LoRAs trained
on RAW apply seamlessly to Turbo."*

**Do turnaround prompts work? `[OFFICIAL]` — yes, with a caveat.** Krea, verbatim:

> "For a good turnaround, prompt for the specific views — **'shown from four angles — front view,
> three-quarter view, side view, and back view.'** Lock the character description tightly (hair,
> eyes, outfit, accessories) so each view shares the same person. **Use a clean white background** to
> keep the focus on the figure."

> "Use **16:9 wide** for lineup sheets, turnarounds, and costume variations."

Caveat is the FAQ quote above: **visually consistent, not pixel-consistent.** `[SYNTHESIS]` For a
game sprite you usually want each pose as a *separate full-resolution image*, not slices of one sheet
— a 4-view sheet at 2048 wide gives you ~512px per character, which is too small. **Use the sheet as
a design document, then re-generate each view individually with the sheet as an image reference.**

Costume variations, verbatim: *"the same original character shown in five outfits — school uniform,
casual streetwear, formal kimono, sci-fi pilot suit, summer beach outfit."* → *"Krea 2 holds the face
and hair stable while changing only the clothes."*

**Dedicated character-sheet LoRAs for Krea 2 `[LORE]`:**
- `[KREA 2] Character Design` (<https://civitai.com/models/2815175>, 2026-07-28, trigger word
  `Character design`, strength 1.0, 2000 steps / 10 epochs, "Very Positive" 91 reviews) —
  *"front, side, and back views, expression studies, color palettes, accessories… prompt for it and
  it will increase the details, **simple prompts give simple sheets**."*
- `Krea 2 Identity Edit` (<https://civitai.com/models/2761113>) — needs the `comfyui-krea2edit`
  node pack; reported to help when the stock ReferenceLatent workflow isn't holding identity tightly
  enough.

---

## 5. Alternatives — is Krea 2 actually the right local pick?

| Option | For painterly 2D game characters | Verdict |
|---|---|---|
| **Krea 2 Turbo** (12.9B, Jun 2026) | Aesthetic-diversity thesis is architecturally real (§3.2); prose prompting; 2K native; nine official style LoRAs + growing painterly community LoRAs; 8-step iteration speed. | **Best base for the *look*.** |
| **FLUX.1 Krea [dev]** (Jul 2025) | The original anti-AI-look model; huge FLUX.1 LoRA/ControlNet ecosystem. But it is a **photoreal-first** aesthetic fine-tune and a year old. | Only if you need the FLUX.1 ControlNet ecosystem. |
| **FLUX.2 klein 4B** (Jan 2026) | **Apache 2.0** (no revenue caps at all), ~2.6 GB Q4 GGUF, runs on hardware Krea 2 can't touch, 4 steps. Has an actual **sprite-sheet LoRA** (§4.2). | **Best if VRAM < 12 GB or license matters.** |
| **Z-Image Turbo 6B** | Faster, 16 GB, Qwen3-4B encoder. But `[LORE]` "tuned for realism"; no official style layer — *"Its look comes almost entirely from the prompt itself."* | Weaker for painterly. |
| **Qwen-Image 2** | Strong photorealism, slower (5–8 s/img vs 2–4 s). Note the existing corpus finding: **Qwen-Image-2512 dropped the magic suffix** in favour of an anti-AI-look **negative prompt** — and unlike Krea 2, Qwen actually runs at a CFG where negatives work. | Viable; different dialect. |
| **SDXL / Illustrious / Pony finetunes** | Vastly better **pose control** (ControlNet OpenPose, depth, canny), vast painterly-LoRA library, dedicated sprite LoRAs (`RPG Character Sprite Style [Illustrious]`, `Game Character Sprites/Assets Generator`, `Pony CharTurn`), tiny VRAM. Aesthetics are dated by comparison. | **Best for reproducible poses / turnarounds.** |

`[SYNTHESIS]` **Recommended stack for this user:** Krea 2 Turbo FP8 as the aesthetic engine, with
`brushcelstyle` or `krea2_softwatercolor` for the painterly grade, disciplined solid-background
prompting, and a **non-AI post-process** (chroma key or background remover) for the cutout. Keep an
SDXL/Illustrious + ControlNet install as the fallback for anything where the *exact pose* is
non-negotiable — Krea 2 has no ControlNet as of Aug 2026 and that gap is real.

Two honest caveats to give the user up front:
1. **Krea 2 has no edit/inpaint model yet** (`[STAFF]`, AMA). Fixing a bad hand means re-rolling, not
   inpainting — or bouncing the image through a different model.
2. **The 12 GB / 16 GB VRAM floor** rules out a lot of school hardware. FLUX.2 klein at Q4 (~2.6 GB)
   is the honest recommendation for a laptop.

---

## 6. Known failure modes and prompt-side fixes

| # | Failure | Evidence | Fix |
|---|---|---|---|
| 1 | **Spontaneous diptych / split-screen panels** | `[TESTED]` earngenix: "Krea 2 occasionally generates side-by-side comparison panels unprompted." | The one negative prompt worth keeping: `diptych, split screen, two panels, side by side, before and after comparison, collage, multiple images`. Especially likely on character-sheet-adjacent prompts. |
| 2 | **Cropped feet / lower body** | `[LORE]`, cross-model | Tall aspect ratio (2:3+) first; name the footwear as a described object; two framing statements (§4.3); or just pad the flat background afterwards. |
| 3 | **Background gradients / vignettes creeping in** | `[SPECULATION]` from `[OFFICIAL]` — Krea explicitly filtered training data to *suppress* flat-colour backgrounds (§3.3) | State flatness twice in different words; add `even flat lighting, no vignette, no gradient, uniform hue across the entire background` as positive facts; **turn `prompt_enhance` OFF** (§2.5). Accept that keying tolerance will do the last 10%. |
| 4 | **Drop shadows / floor contact shadows** | `[LORE]` widely reported across tools; generative models "sample the darkest pixels at the base of your subject and project them outward" | Say `the figure floats against the background with no cast shadow and no ground plane` — a *positive* description of the absence. Avoid `studio lighting` (Krea's own solid-background examples pair it with product shots, where a shadow is wanted). |
| 5 | **Glossy / plastic skin** | `[OFFICIAL]` — the report names "high-saturation and texture issues" as a thing SFT had to fix; `[LORE]` a Civitai "realism enhancer that knocks out the plasticky skin look" exists | Lead with the medium (`stylized digital painting of…`), and state surface positively: `matte skin with visible brushwork, no specular highlights, dry pigment finish`. A painterly LoRA at 1.0 is the blunt reliable fix. |
| 6 | **Style drift between generations** | `[OFFICIAL]` Krea: "Drift in palette is the biggest cause of inconsistency" | 3–5 fixed colour words reused verbatim in every prompt; identical character description across all sheets; same seed family; solid background (fal: it "improves style consistency across all 4 views"); LoRA once the design is locked. |
| 7 | **Prompt enhancer rewriting or *refusing* your prompt** | `[OFFICIAL]` ComfyUI issue #14631 "causing incorrect refusals"; enhancer on by default | Disable `prompt_enhance`. |
| 8 | **CFG 0.0 producing garbage in ComfyUI** | `[LORE]` ×2 sources | Use **CFG 1.0** on stock KSampler; 0.0 only in Krea's own CLI/diffusers. |
| 9 | **Style LoRA "does nothing"** | `[LORE]` InstaSD | The prompt is fighting the LoRA with its own style words. Trigger phrase + content-only prompt. Trigger must be exact (see §4.1 table — nobody guesses "art deco watercolor style" for Softwatercolor). |
| 10 | **`(word:1.2+)` breaking the image** | `[LORE]` ×2 sources | Restate or use a more specific word; use LoRA strength for the only real numeric knob. |
| 11 | **Text in images is mediocre** | `[LORE]` InstaSD: "somewhere between SDXL and Ideogram, fine for a shop sign, embarrassing for a poster headline" | For any UI/label text on a sprite, composite it in an editor. `[OFFICIAL]` If you must, put the words in **quotes**. |

---

## 7. Worked starter prompts `[SYNTHESIS]`

Untested — assembled from official phrasing patterns in §4. Flag as starting points, not proven
recipes.

**Base — painterly full-body on flat magenta, 832×1216 (≈2:3), Turbo, 8 steps, CFG 1.0,
`prompt_enhance` OFF, negative = ConditioningZeroOut (or the diptych negative):**

```
A stylized digital painting of a young village herbalist standing facing the viewer, full-body view
with the entire figure from head to boots inside the frame and clear margin above and below. She
stands straight and symmetrical, arms relaxed and held slightly away from her body, palms open and
facing forward, feet shoulder-width apart on no visible ground, neutral calm expression. She wears a
faded sage-green wool coat over a dust-ochre tunic, a worn leather satchel, and scuffed oxblood
leather boots. Rendered with expressive thick brushstrokes, flat shading, and a muted earthy palette
of sage green, dust ochre, and oxblood. Matte surface with a subtle paper texture and no specular
highlights. Solid flat magenta background, uniform bright magenta filling the entire frame behind the
figure, no environment, no props, no floor line, no cast shadow, no vignette, even flat lighting
across the character.
```

**With the painterly LoRA** (trigger at the start, content-only prompt after; `LoraLoaderModelOnly`,
strength 1.0):

```
brushcelstyle, a young village herbalist standing facing the viewer, full-body view … [content only,
drop the style sentences] … solid flat magenta background, uniform bright magenta filling the entire
frame, no environment, no cast shadow.
```

**Turnaround design document** (16:9, per Krea's own recommendation — for reference only, then
re-generate each view individually):

```
Character design sheet of the same young village herbalist shown from four angles — front view,
three-quarter view, side view, and back view — standing in an identical neutral pose at identical
proportions in a single row. Faded sage-green wool coat, dust-ochre tunic, worn leather satchel,
scuffed oxblood leather boots, shoulder-length copper hair. Flat shading, expressive brushstrokes,
muted earthy palette. Clean solid white background, no shadows, no text, no labels.
```

**Silhouette pass first**, per Krea's explicit workflow tip: same prompt with
`rendered as a flat solid black silhouette against a clean white background` — check the silhouettes
read distinctly before committing colour.

---

## 8. Actions for the corpus

1. **Add a Krea 2 model entry** to `new-models.md`. Dialect: prose, 30–140 words, medium-first
   ordering, no tag soup, no `(word:1.2)`, negatives inert, 8 steps / CFG 1.0 (0.0 outside ComfyUI) /
   mu 1.15, generate at 1K–2K.
2. **Add a disambiguation note** wherever "Krea" appears: FLUX.1 Krea [dev] (2025, FLUX.1 arch) ≠
   Krea 1 (hosted) ≠ Krea 2 (2026, from-scratch DiT). Users say "Krea" and mean all three.
3. **Extend the emphasis-portability rule** (image-catch-up.md §1.1 / contradiction #6) to cover
   VLM-encoder models: on Qwen3-VL-conditioned models the syntax isn't just non-portable, it is
   **actively destructive** past ~1.2. Same finding now holds for Z-Image and Krea 2.
4. **New cross-model rule: "negatives are a function of CFG, not of the model."** Any guidance-
   distilled checkpoint run at CFG ≈ 0–1 has no functioning negative branch. Convert exclusions into
   positive statements. Applies to Krea 2 Turbo, Z-Image Turbo, FLUX schnell-class, and any Turbo/
   Lightning LoRA stack.
5. **New gotcha: vendor prompt-expanders default ON and are trained for *diversity*.** For any task
   requiring exact repeatable output (sprites, assets, brand colour), disable the expander. Add to
   the misconceptions/gotchas bank.
6. **Flag the ComfyUI CFG 0.0 trap** as a first-class gotcha — it produces a broken image with no
   error message, which is the worst kind of failure.
7. **Do not claim** Medium/Large/creativity-slider/moodboards for local Krea 2 — cloud only.

---

## 9. Source list

`[OFFICIAL]`
- Krea 2 Turbo model card — <https://huggingface.co/krea/Krea-2-Turbo>
- Krea 2 Raw — <https://huggingface.co/krea/Krea-2-Raw>
- Krea 2 Technical Report (Lee et al., 2026-06-23) — <https://www.krea.ai/blog/krea-2-technical-report>
- Official prompting guidelines — <https://github.com/krea-ai/krea-2/blob/main/docs/prompting.md>
- Official prompt-expander system prompt — <https://github.com/krea-ai/krea-2/blob/main/docs/expansion.txt>
- Krea 2 Open-Source release page — <https://www.krea.ai/krea-2-open-source>
- Character design with Krea 2 (Krea Team, 2026-05-23) — <https://www.krea.ai/blog/character-design-with-krea-2>
- ComfyUI Krea-2 tutorial (file layout, LoRA triggers, workflow controls) — <https://docs.comfy.org/tutorials/image/krea/krea-2>
- ComfyUI issue #14631 (enhancer refusals) — <https://github.com/Comfy-Org/ComfyUI/issues/14631>
- fal Krea 2 prompting guide (official API partner, 2026-05-25) — <https://fal.ai/learn/tools/krea-2-prompting-guide>
- fal FLUX.2-klein sprite-sheet LoRA — <https://huggingface.co/fal/flux-2-klein-4b-spritesheet-lora>
- BFL FLUX.1 Krea [dev] (2025) — <https://bfl.ai/blog/flux-1-krea-dev>

`[TESTED]` (methodology stated by the author)
- Krea 2 character consistency in ComfyUI, RTX 4090 / 24 GB, 2026-07-13 — <https://www.earngenix.com/tutorials/krea-2-character-consistency-comfyui>
- Nano Banana Pro sprite lessons (chroma-key drift), 2026-03-07 — <https://roboticape.com/2026/03/07/generating-game-sprites-with-gemini-image-generation-nano-banana-pro-lessons-learned/>

`[LORE]`
- InstaSD, Krea 2 Prompt & Style Guide — <https://www.instasd.com/post/krea-2-prompt-and-style-guide-comfyui>
- Civitai, Cyberdelia, "Z-Image Turbo vs Krea 2: How Prompting Actually Differs", 2026-08-10 — <https://civitai.com/articles/33736/z-image-turbo-vs-krea-2-how-prompting-actually-differs>
- LocalAIMaster, Krea 2 Local Guide, 2026-07-20 — <https://localaimaster.com/blog/krea-2-local-guide>
- bymar.co, "Krea 2 Is the Open-Weights Image Model Worth Running Locally", 2026-06-29 (includes AMA summary) — <https://blog.bymar.co/posts/krea-2-open-weights-image-model/>
- Civitai `brushcelstyle` painterly LoRA, 2026-07-02 — <https://civitai.com/models/2749544>
- Civitai `[KREA 2] Character Design` LoRA, 2026-07-28 — <https://civitai.com/models/2815175>
- Civitai `Krea 2 Identity Edit` — <https://civitai.com/models/2761113>
- Krea 2 GGUF quants — <https://huggingface.co/realrebelai/KREA-2_GGUFs>
- Reddit AMA thread (not directly fetchable; summarised via bymar.co) — <https://www.reddit.com/r/StableDiffusion/comments/1udnm0a/>

---

*End of addendum. Nothing in §4.3, §4.4 or §7 has been image-tested; those are construction rules
derived from official example prompts, not verified recipes.*

---

## 2026-09 sweep (agent 1C)

All URLs accessed **2026-09-03** unless a different date is given. Scope of this sweep: verify the nine
official LoRA triggers, the ~512-token cliff and its methodology, attempt Chinese coverage, and pin down
the built-in LLM prompt-rewriter node. Nothing above this line was altered.

### New official guidance

**1. The nine LoRA trigger words are confirmed `[OFFICIAL]`, and §4.1's table is correct as printed.**
Verified against the ComfyUI docs table in **both** the English and the Chinese edition, which are
character-identical in the trigger column
(<https://docs.comfy.org/tutorials/image/krea/krea-2> and
<https://docs.comfy.org/zh/tutorials/image/krea/krea-2>). Verbatim, with the recommended strength column:

| LoRA | Trigger Word | Recommended Strength |
|---|---|:--:|
| krea2_darkbrush | `monochrome ink wash style` | 1.0 |
| krea2_dotmatrix | `monochrome stippling style` | 1.0 |
| krea2_kidsdrawing | `naive expressive sketch style` | 1.0 |
| krea2_neondrip | `textured abstract style` | 1.0 |
| krea2_rainywindow | `rainy window style` | 1.0 |
| krea2_retroanime | `purple retro anime style` | 1.0 |
| krea2_softwatercolor | `art deco watercolor style` | 1.0 |
| krea2_sunsetblur | `ethereal motion blur style` | 1.0 |
| krea2_vintagetarot | `vintage tarot style` | 1.0 |

Provenance caveat, scoped: the trigger words are **not** documented in `krea-ai/krea-2` (the repo's
`README.md` and `docs/prompting.md` do not mention LoRAs at all), and `krea/Krea-2-Turbo`'s raw model card
is not fetchable because the repo is gated (see register). **docs.comfy.org is the only primary surface we
could read that carries them.** The 08-28 digest's `[LORE]` grade (InstaSD) is therefore upgraded to
`[OFFICIAL — ComfyUI docs]`, not to `[OFFICIAL — Krea]`.

**2. Krea 2's text encoder ships a baked-in system descriptor, and it is the real dialect specification.**
`[OFFICIAL]` `encoder.py`, `Qwen3VLConditioner`
(<https://github.com/krea-ai/krea-2/blob/main/encoder.py>), verbatim:

```python
self.prompt_template_encode_prefix = "<|im_start|>system\nDescribe the image by detailing the color, shape, size, texture, quantity, text, spatial relationships of the objects and background:<|im_end|>\n<|im_start|>user\n"
self.prompt_template_encode_suffix = "<|im_end|>\n<|im_start|>assistant\n"
self.prompt_template_encode_start_idx = 34
self.prompt_template_encode_suffix_start_idx = 5
```

`[SYNTHESIS]` Every Krea 2 prompt is encoded as the *user turn* of a chat whose system turn asks for
**colour, shape, size, texture, quantity, text, spatial relationships, objects, background** — nine named
slots, in that order. This is a better-evidenced ordering rule than the `[LORE]` Cyberdelia order in §2.8
and it explains why Krea's own examples read as inventories of concrete nouns with attributes attached.
**Teach these nine slots as the Krea 2 checklist.**

**3. The 512 cap is in official code, with the exact arithmetic.** `[OFFICIAL]` same file:

```python
max_length: int = 512
select_layers: tuple[int, ...] = (2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35)
...
max_length=self.max_length + prefix_idx - self.prompt_template_encode_suffix_start_idx,   # 512 + 34 - 5 = 541
truncation=True, padding="max_length"
...
hiddens = hiddens[:, prefix_idx:]   # the 34-token system prefix is discarded
```

So the reference implementation tokenises to a 541-token window, **truncates silently**, then slices off
the 34-token prefix — a hard ceiling of **512 conditioning positions**. Twelve layers × 2560 = the
**30720**-wide conditioning the bug report observes. Krea's own CLI can therefore never exceed the cap;
ComfyUI can, and that is the whole bug (below).

**4. `Raw = 52 steps @ CFG 3.5` is `[OFFICIAL]`, not `[LORE]`.** `[OFFICIAL]`
<https://github.com/krea-ai/krea-2> README, verbatim:

```bash
uv run inference.py "a fox walking in the snow" --checkpoint oss_raw --steps 52 --cfg 3.5
```

Same README, also verbatim and new to the corpus: Raw — *"The model has been trained to generate upto 1k
resolution."*; Turbo — *"The model can generate images from 1k ~ 2k resolution."* CLI **defaults** (used
when you pass neither flag) are `--steps 28`, `--cfg 4.5`, `--y1 0.5` (mu at min resolution), `--y2 1.15`
(mu at max resolution), `--checkpoint oss_raw`. §2.4's "`[LORE]` Raw = ~52 steps at CFG 3.5" should be
re-graded.

**5. The prompt-rewriter node: default ON, one toggle, and the system prompt is public.**
`[OFFICIAL]` ComfyUI docs, EN: *"The defaults (8 steps, prompt enhancement enabled, no LoRA) produce a
high-quality image with minimal configuration."* ZH edition, verbatim: 「默认设置（8步、提示词增强开启、不使用
LoRA）即可生成高质量图像。」 **Disable it** by setting the subgraph's `prompt_enhance` toggle to off
(*"Toggle LLM-powered prompt expansion on/off"*); the sibling control `LLM_max_token` caps the expansion's
output length (*"Maximum token length for prompt enhancement"*) and is the second thing to reach for,
because an unbounded expansion is exactly what pushes you over the 512-position cliff.

The rewriter's system prompt is `docs/expansion.txt`, nine numbered rules
(<https://github.com/krea-ai/krea-2/blob/main/docs/expansion.txt>), re-fetched and byte-checked this sweep.
Two parts §2.5 did not quote — the reasoning preamble and rule 8 — verbatim:

> "Think step by step about the request before writing the answer:
> - What is the subject and mood?
> - What visual styles, mediums, and lighting options would fit? Consider two or three alternatives and pick the one that best serves the caption.
> - What composition, framing, and grounded details will help the text-to-image model?
> Then output a single expanded prompt paragraph."

> "**8. Respect the Human Form:** Treat depictions of people with dignity. Assume clothing covers genitals and intimate anatomy."

`[SPECULATION]` Rule 8 plus rule 3 ("Style Planning Stays Internal") is the most likely trigger of the
refusal behaviour in issue #14631 — but that issue reports a refusal for a prompt with no human in it, so
the mechanism is probably the base Qwen3-VL-4B's own safety training rather than the rule text.

**6. Refusals: issue #14631 is still open, and the verbatim refusal is worth teaching.** `[OFFICIAL]`
<https://github.com/Comfy-Org/ComfyUI/issues/14631> — opened **2026-06-25** by `808charlie`, label
**"Feature"** (not "Bug"), **no maintainer reply**, still open at 2026-09-03. Prompt `"photo of a dog on a
kitchen table"` produced, verbatim:

> "No, I can't fulfill that request. I'm designed to provide helpful, respectful, and appropriate responses while adhering to ethical guidelines and safety policies. If you'd like to explore a different prompt or need assistance with something else, feel free to ask!"

Two facts new to the corpus: the enhancer runs through ComfyUI's **`TextGenerate`** node on **the same
Qwen3-VL-4B that is the text encoder**, and `TextGenerate` **cannot load sharded models**, so the
reporter's workaround (an abliterated Qwen3-VL-4B) requires merging to a single `.safetensors` first.
`[SYNTHESIS]` For a classroom the honest advice stays §2.5's: turn `prompt_enhance` off. The refusal is a
*text-model* refusal, and it silently replaces your prompt with prose about ethics, which then gets
encoded — so the failure mode is "an image of nothing you asked for", not an error.

### Chinese sources

**The 08-28 register entry "Krea 2: zero Chinese coverage" is now partially superseded — but only by an
official translation, not by community prompt craft.**

- `[OFFICIAL]` **docs.comfy.org ships a full Chinese edition of the Krea-2 tutorial**:
  <https://docs.comfy.org/zh/tutorials/image/krea/krea-2>. It is a faithful translation of the English page
  (same tables, same file layout, same nine LoRAs). Load-bearing detail: **the trigger words are left in
  English** in the Chinese table — a Chinese-speaking student must still type `art deco watercolor style`.
  Machine-translation risk: low (this is a maintained vendor translation, not MT).
- `[OFFICIAL]` Chinese phrasings worth reusing verbatim in teaching copy: 「在 RAW 上训练 LoRA，在 Turbo 上
  运行推理」 (train on RAW, run on Turbo); 「默认设置（8步、提示词增强开启、不使用 LoRA）」; 「Krea 2 支持 1K 到 2K
  的输出，将 megapixels 值设为 2.0 即可获得 2K 分辨率。」
- **No Chinese prompt-craft material found.** Surfaces searched: WebSearch in Chinese
  (`Krea 2 提示词 教程 本地部署 ComfyUI`). Everything returned was CSDN integration-package/deployment
  content (`blog.csdn.net/weixin_31062533/article/details/162646776`,
  `blog.csdn.net/gitblog_00515/article/details/151993632`, `wenku.csdn.net` columns) — install guides and
  一键整合包 promotion, with the tell-tale LLM-SEO signature the 08-28 digest warns about. One of them
  ("在 CLIP Text Encode (Negative) 节点中输入简单的负面提示词") is **actively wrong** for Krea 2 at CFG 0–1.
- **知乎 and Bilibili remain unreachable from this environment**: the WebSearch index is US-only and
  returned no zhihu.com or bilibili.com results for the Chinese query; direct fetches were not attempted
  per the no-bypass rule. So: "no Chinese-language Krea 2 prompt-craft source found on
  {WebSearch (US index), docs.comfy.org/zh}" — 知乎/Bilibili are **not** covered by that statement.

### Tested findings

**A. The 512-token cliff, re-verified with full methodology.** `[TESTED — single reporter, unreplicated]`
<https://github.com/Comfy-Org/ComfyUI/issues/14782> — opened **2026-07-06** by `Goldlionren`, label
**"Potential Bug"**, **no maintainer reply**, still **open** at 2026-09-03. Verbatim table:

| Final Krea2 conditioning sequence | Result |
|---|---|
| 49 | OK |
| 512 | OK |
| 513 | OK |
| 576 | OK |
| 640 | Black output |
| 674 | Corrupted/noisy output |

and verbatim instrumentation for the original prompt:

```
raw_chars=3785
token_pairs=708
template_end=34
final conditioning seq=674
conditioning shape=(1, 674, 30720)
```

with the controlling sentence *"The sequence length was the only intentionally changed variable."* and the
diagnosis *"The reference implementation uses a default `max_length=512` and truncates the prompt body
while preserving the final 5-token template suffix."* — which §"New official guidance" item 3 now confirms
line-for-line against `encoder.py`.

**Grade, explicitly:** one reporter, one prompt, one workflow, **the INT8 ConvRot checkpoint** (not the FP8
most users run), no seed grid, no images attached, no maintainer replication. Six data points, one
variable, a stated instrumentation method, and a *confirmed* mechanism. That is enough for
`[TESTED]` on "there is a cliff and ComfyUI does not enforce the reference cap", and **not** enough for
"the cliff is at exactly 640". Teach: **512 is the reference cap; (576, 640] is where this reporter's
prompt died; treat >512 as undefined behaviour.** From this prompt's own ratio (3785 chars ⇒ 674
positions ≈ 5.6 chars/position), 512 positions ≈ **2,850 characters**, so the corpus's ~2,500-char safe
ceiling remains a reasonable `[SPECULATION]`. The reporter names <https://github.com/Comfy-Org/ComfyUI/issues/14717>
as possibly the same root cause; unverified here.

**B. `fblissjr/krea-explorations` — a methodology-stating probe repo, and the largest single addition to
this file.** `[TESTED]` <https://github.com/fblissjr/krea-explorations> (`docs/krea2_text_encode.md`
last updated 2026-07-02; `docs/findings.md` 2026-07-07). The author labels his own confidence per finding;
we carry those labels through. Runtime-verified items (his "high confidence", checked in-process against
ComfyUI's real `comfy/text_encoders/krea2.py`):

- **The encoder is frozen stock `Qwen/Qwen3-VL-4B-Instruct`** — Krea's loading code is `from_pretrained` +
  `.eval().requires_grad_(False)` and the config is *"field-for-field identical to stock"*; **all learned
  aggregation is DiT-side.** (Consistent with `encoder.py` above.)
- **ComfyUI strips the system turn before the DiT.** `Krea2TEModel.encode_token_weights` finds the second
  `<|im_start|>` and slices `out = out[:, :, template_end:]`. Consequence, verbatim: *"the directly
  steerable write-points are the **user turn and the assistant `<think>` turn** (both survive). A
  **system-turn** prompt does **not** inject conditioning — its tokens are sliced off."*
- **Krea 2's DiT has no reference-latent slot**, verified at source: *"`Krea2.extra_conds` reads only
  `cross_attn` (no `reference_latents`, unlike the QwenImage models) and `SingleStreamDiT.forward` takes
  only `(x, timesteps, context, attention_mask)`"* — see Contradicts, item 1.
- **Reference images ride the Qwen3-VL *vision* path and eat the same sequence budget.** A reference costs
  `(h/32)·(w/32) + 2` tokens; *"one 1 MP reference is **~1026 vision tokens** against a ~20-token
  prompt"*, i.e. `token budget: 1026 image + 18 text = 1044 (98% image)`. `[SYNTHESIS]` **This collides
  head-on with the 512-position cap**: two 1 MP references cannot coexist with a long prompt. `CLIPLoader`
  type must be `krea2`; `vision_megapixels` is a detail/resolution knob, **not** an image-weight knob
  (the reference dominated identically from 0.1 to 2.0 MP).
- **Measured mechanism for our failure mode #1 (spontaneous multi-panel output):** with the tokenizer's
  default unlabeled vision blocks two references **composite** into one scene; emitting `Picture N:`
  labels (`add_vision_id=True`) instead *"cue the model to lay the references out as a **tiled
  collage** (separate panels). So the labels, not the architecture, were what produced collages."*
- **Braces are literal** in both the system and user fields (*"the assembly never calls `str.format`"*) —
  so ComfyUI wildcard `{a|b}` and NovelAI `{}` emphasis are both inert-as-syntax here.
- **fp8 + image references work** on ComfyUI **0.27.0** (`qwen3vl_4b_fp8_scaled`) — the upstream
  "FP8 vision path crashes" claim *"did not reproduce"*.

His generation-side results (his labels: "low–medium", visual reads, few seeds):

- **The Turbo LoRA *is* the distillation delta**, so its strength is a de-distillation dial:
  **`RAW + s·LoRA ≡ Turbo + (s−1)·LoRA`**, `s=1.0` = Turbo, `s=0.0` = RAW. Recommended:
  **`s0.8 / 8 steps / cfg 1`** (efficiency pick, matches Turbo at 8 evals) or **`s0.6 / 12 steps / cfg 1`**
  (all-rounder). *"CFG headroom grows as strength drops… Turbo (s1.0) burns out above cfg ~2.5 — at cfg 4
  the face goes blown-white; s0.5 and RAW tolerate cfg 4 cleanly."*
- **The negative branch, definitively** — verbatim: *"The negative is inert at cfg = 1 — and you must use a
  real (empty) negative, never `ConditioningZeroOut`. At cfg 1 ComfyUI skips the uncond pass, so a real
  negative and `ConditioningZeroOut` are byte-identical there; the negative only acts at cfg > 1, and even
  there it's a weak semantic lever (targeted suppression fails). The catch: **`_cfg_pp` samplers use the
  uncond even at cfg 1**, and `ConditioningZeroOut` feeds them a degenerate uncond → grain."*
- **An assistant `<think>` block is the best prompt-side steering lever** — it *"restores the flattened
  expressions as well as or better than the deep-band rebalance lever, with adherence intact"*, and in a
  head-to-head of four levers won on both axes: *"drift-from-stock: `<think>` 0.14 < bypass 0.19 ≈ vision
  0.19 < concept 0.20"* with the most added detail. Mechanism: *"~17–24% shift in the 12 selected hidden
  states, **0.86 direction consistency**… energy concentrated at L20/L23"*, i.e. it pushes along the
  model's own axis rather than adding content.
- **"Turbo collapses seeds" is not general.** *"on an **open scene** Turbo already varies across seeds
  (cross-seed diff flat ~45–48 as strength drops 1.0→0.6)"*; only constrained/dense prompts collapse.
- **A vision reference is a content input, not a restyle knob.** A **matched** reference (depicting the
  scene the prompt already describes) preserves composition and drifts ≈0.19; a **cross-domain** reference
  drifts **1.56×** that (0.30), and *"a **distinct-subject** reference **replaces** the scene; a
  **full-scene** reference tends to **composite** the prompt's subject into it."* The system preset does
  **not** modulate this (Δ ≤ 0.007).

**C. A working negative-prompt route on Krea 2 exists: NegPiP.** `[LORE — community tool, no image tests
published]` `cyberdeliaAI/comfyui-negpip-zimage` v2.x
(<https://github.com/cyberdeliaAI/comfyui-negpip-zimage>). It merges the negative string into the
*positive* conditioning as negative weights — verbatim example:

```text
positive: a sharp portrait, detailed eyes
negative: blurry background, (text:1.3)
```
```text
→ a sharp portrait, detailed eyes, (blurry background:-1), (text:-1.3)
```

Krea 2 specifics, verbatim: *"The integrated Krea 2 path applies NegPiP to all 28 main transformer blocks
and both text-fusion refiner blocks"*; *"Load the text encoder with ComfyUI's `CLIPLoader` type `krea2`; a
regular Qwen, Z-Image, or Flux CLIP is not interchangeable"*; *"Z-Image's normal tokenizer does not
interpret NegPiP weights"* (so the `(word:x)` syntax is meaningful **only inside this node**); and
*"Complex conditioning transforms that normalize or clamp the Krea 2 conditioning tensor may destroy its
embedded NegPiP sidecar."* Author's dosing guidance: start at **0.25–0.5**, not 1.0, because *"Broad
semantic categories can react non-linearly."* Its own compatibility table lists **Flux: Not supported —
"upstream marks its NegPiP path as unmaintained."**

### Contradicts current corpus

1. **§4.5 Tier 2's `VAEEncode → ReferenceLatent → KSampler` chain may be dead weight.** The corpus quotes
   earngenix `[TESTED]`: *"This is the path doing most of the work to hold the face steady."*
   krea-explorations `[TESTED]` says the opposite at source level: Krea 2's DiT exposes no
   `reference_latents`, so *"a `reference_latents` entry would be silently discarded"* and *"a VAE input
   truly would be dead weight."* **Both are kept.** Reconciliation `[SPECULATION]`: earngenix's workflow
   also feeds the reference through `TextEncodeQwenImageEditPlus` (the vision path), which *is* real and
   *does* dominate — so the identity preservation he measured is plausibly the vision path's, mis-attributed
   to `ReferenceLatent`. ComfyUI's own Krea 2 style-reference template supports this reading: it uses a
   **dedicated INT8 ConvRot checkpoint plus `krea2_style_reference.safetensors`**, not a latent slot.
   **This is the single highest-value in-house test to run**: same seed, same reference, with and without
   the `ReferenceLatent` node.
2. **§2.4 / failure-mode #8's "use `ConditioningZeroOut` for the negative slot" is unsafe as a blanket
   rule.** With any `_cfg_pp` sampler `ConditioningZeroOut` produces a degenerate uncond and visible grain;
   with plain euler at cfg 1 it is byte-identical to an empty negative. Correct advice: **connect a real,
   empty negative** — it costs nothing and cannot break.
3. **§2.4's "`[LORE]` Raw = ~52 steps at CFG 3.5" is `[OFFICIAL]`.** Regrade.
4. **§6 row 6 / "Expecting seed changes to overcome distilled-mode composition lock" is over-general.**
   Seed lock is a property of *dense, constrained* prompts, not of Turbo.
5. **§2.6 / §6 row 10's "`(word:1.2+)` breaks the image" needs a scope clause.** The stock Krea 2 tokenizer
   does not parse weights at all (they are literal text); a NegPiP node makes the same syntax meaningful
   and signed. So the rule is **"no weighting syntax in stock encode; weights exist only inside a NegPiP
   patch"**, not "weighting is destructive".
6. **§1.5's "Do not cite a specific ComfyUI version" can be relaxed slightly.** We now have one dated,
   runtime-verified data point: **ComfyUI 0.27.0** (2026-07-02) has native Krea 2, the `krea2` CLIP type,
   and a working fp8 vision path. Cite that as a *floor*, not as the release that added support.
7. **"Order carries the emphasis" needs a mechanical exception.** The system turn is sliced off before the
   DiT, so text placed there is not a write-point at all — it can only act indirectly, through the causal
   encoder pass. Position matters, but *which turn* matters more than *how early*.
8. **§2.3's word bands (5–20 / 30–80 / 80–140) sit far below the real ceiling and should be stated as
   craft, not capacity.** The hard ceiling is 512 conditioning positions ≈ 2,850 characters ≈ 380–450
   English words for this reporter's prose. The 80–140 recommendation is an aesthetic claim; the cliff is
   an engineering one. Do not let a student conflate them.

### Few-shot gold (new pairs)

### Pair 5 — character art, descriptor-slot order [OFFICIAL-PATTERN]
INTENT: Painterly full-body game character on a keyable flat background, written in the exact order the
encoder's own system descriptor asks for (colour → shape → size → texture → quantity → text → spatial
relationships → objects → background).
PROMPT-EN:
A stylized digital painting of one village herbalist, full-body, facing the viewer. Muted sage green, dust
ochre and oxblood: a faded sage-green wool coat over a dust-ochre tunic, scuffed oxblood leather boots. The
silhouette is tall and narrow, the coat squared at the shoulders and flaring below the hip. Matte, dry
pigment texture with expressive thick brushstrokes and a subtle paper grain, no specular highlights on the
skin. One figure only, no text anywhere in the image. She stands straight and symmetrical, arms relaxed and
held slightly away from the body, palms forward, feet shoulder-width apart, the whole figure from head to
boots inside the frame with clear margin above and below. A worn leather satchel hangs at her right hip.
Behind her, a solid flat magenta background, uniform bright magenta filling the entire frame, no
environment, no floor line, no cast shadow, even flat lighting across the character.
NOTES: Nine sentences mapped one-to-one onto the nine slots of the verbatim
`prompt_template_encode_prefix`. ~135 words ≈ 190 conditioning positions — comfortably inside the 512 cap
with room for the enhancer to be left OFF and a LoRA trigger to be prepended. Exclusions are stated as
positive facts about the scene (§4.2). Run: Turbo fp8, 8 steps, **CFG 1.0 on stock KSampler**, a **real
empty negative** (never `ConditioningZeroOut`), `prompt_enhance` OFF, 832×1216. Untested.

### Pair 6 — de-distilled portrait with think-steering [TESTED-PATTERN]
INTENT: Recover the intense expression that Turbo's distillation flattens, without a weight edit.
PROMPT-EN (full-template string, passed through the tokenizer's skip-template route so the chat structure
survives — note the `<think>` block lands in the **assistant** turn, which is not stripped):
```
<|im_start|>system
Describe the image by detailing the color, shape, size, texture, quantity, text, spatial relationships of the objects and background:<|im_end|>
<|im_start|>user
A close-up portrait of a weathered dock worker, furious, jaw clenched and brows driven down, harsh cold side light from camera left, wet oilskin coat, shallow depth of field, muted blue-grey palette.<|im_end|>
<|im_start|>assistant
<think>The expression is the subject. Fury reads in the lowered brow ridge, the tightened orbital muscles, the compressed lips and the flared nostril — not in a shout. Push the facial tension, keep the framing and the light exactly as described.</think>
```
NOTES: Pattern from krea-explorations `[TESTED]` (Turbo, mu pinned, same seed, 4 expressions × 3 levers;
his confidence "low–medium" on the visual result, "high" on the tokenisation facts). The system text here
is Krea's own descriptor and is **discarded** before the DiT — it is reproduced only so the skip-template
route triggers (`text.startswith('<|im_start|>')`). Steering "pushes along the model's own axis"; expect
slight identity drift. Preferred over the community projector-bypass LoRAs, which are the same direction
at higher drift and are redundant when stacked.

### Validator changes

- **Hard token rule (new, highest priority).** Count Qwen3-VL tokens. ≤512 conditioning positions = OK;
  >512 = **error, not warning**: "past the reference cap; Krea's own encoder truncates here and ComfyUI
  does not — outputs go black or noisy with no exception." No tokenizer available → warn above **2,500
  characters**.
- **Expander interlock.** If `prompt_enhance` is on AND the user prompt is already >250 positions
  (≈1,400 chars), warn that the expansion can push the total over the cliff; recommend `prompt_enhance`
  OFF or a low `LLM_max_token`.
- **Reference-image budget.** If a Krea 2 workflow carries a reference image, subtract `(h/32)·(w/32)+2`
  tokens per reference from the 512 budget before validating the text (1 MP ≈ 1026 — i.e. a single 1 MP
  reference *already exceeds* the cap on its own; warn hard).
- **Negative slot.** Replace "recommend `ConditioningZeroOut`" with "**require a real empty negative**";
  warn specifically if the sampler name contains `cfg_pp` and `ConditioningZeroOut` is present.
- **CFG gate.** Stock KSampler: reject CFG 0.0 (→1.0). Reject CFG > 2.5 while Turbo-LoRA strength ≥ 0.8
  ("burns; drop strength to ~0.5–0.6 first"). Krea CLI/diffusers: CFG 0.0 for Turbo, 3.5 @ 52 steps for Raw.
- **LoRA trigger check.** Exact-match the nine official trigger strings (case-insensitive, whole phrase);
  if a style LoRA is enabled and the prompt also carries style words, warn "pick a lane" (§4.1).
- **Syntax check.** Flag `(word:1.2)`, `{a|b}` and `[]` as literal text on Krea 2 unless a NegPiP node is
  in the graph; if one is, allow signed weights and warn above 0.5 magnitude.
- **Turn awareness.** If the prompt starts with `<|im_start|>`, treat it as a full-template string: warn
  that system-turn content is stripped and only user/assistant turns condition the image.

### Nothing-found register

- **`krea/Krea-2-Turbo` and `krea/Krea-2-Raw` raw model cards: unreachable.** `…/raw/main/README.md`
  returns an empty body because the repos are licence-gated. Every model-card quote in §1.1–§1.3 is
  therefore un-refreshed this sweep and rests on the 2026-08-17 pass.
- **`api.github.com` returns an empty body for every request in this environment** (tested on
  `/repos/Comfy-Org/ComfyUI/issues/14782`, `/repos/comfyanonymous/ComfyUI/issues/14782`,
  `/repos/huggingface/diffusers/issues/13416`, `/repos/Tongyi-MAI/Z-Image/issues/169`). The 2026-09 plan's
  tooling note ("prefer api.github.com JSON") is **stale**: use the HTML issue pages, which fetch fine.
- **`web.archive.org` is blocked** ("URL is on blocklist"). Any archived-snapshot target must be reached
  another way or recorded as unavailable.
- **No LoRA trigger words in `krea-ai/krea-2`.** Searched `README.md`, `docs/prompting.md`,
  `docs/expansion.txt`, `encoder.py`. Not present.
- **No official Krea guidance on negatives, CFG for Turbo-in-ComfyUI, prompt length in words, or style
  vocabulary.** `docs/prompting.md` re-fetched in full this sweep: still exactly four sentences plus 19
  examples. §2.1's "That's it" verdict holds unchanged.
- **No Krea 2 ControlNet, no edit/inpaint checkpoint, no pose adapter** found on
  {krea-ai GitHub, docs.comfy.org, HF black-forest-labs/krea orgs}. §4.4's gap is unchanged at 2026-09-03.
- **No Chinese-language Krea 2 prompt-craft source** on {WebSearch US index, docs.comfy.org/zh}. 知乎 and
  Bilibili were **not** searchable from here — the absence is not scoped to them.
- **No maintainer/`[STAFF]` reply on either Krea 2 ComfyUI issue** (#14782, #14631) as of 2026-09-03.
- **`docs/safety.md`** exists in the Krea repo and was **not** fetched (budget). Next run.
- **Issue #14717** (named by #14782 as possibly related) **not** fetched. Next run.
- **Reddit remains unreachable.** krea-explorations cites
  `reddit.com/r/StableDiffusion/comments/1ukh334/` for the extracted projector-bypass values; we read the
  decoded analysis, never the thread.

### Sources

`[OFFICIAL]`
- Krea 2 official prompting guidelines (re-fetched in full) — <https://github.com/krea-ai/krea-2/blob/main/docs/prompting.md>
- Krea 2 prompt-expander system prompt, nine rules + preamble — <https://github.com/krea-ai/krea-2/blob/main/docs/expansion.txt>
- **Krea 2 reference text encoder** (`max_length=512`, baked-in system descriptor, 12 select layers, prefix strip) — <https://github.com/krea-ai/krea-2/blob/main/encoder.py>
- Krea 2 repo README (Raw 52 steps @ CFG 3.5; CLI flag defaults; 1k vs 1k–2k) — <https://github.com/krea-ai/krea-2>
- ComfyUI Krea-2 tutorial, English (nine LoRA triggers, `prompt_enhance` default ON, `LLM_max_token`) — <https://docs.comfy.org/tutorials/image/krea/krea-2>
- ComfyUI Krea-2 tutorial, **Chinese** — <https://docs.comfy.org/zh/tutorials/image/krea/krea-2>
- ComfyUI issue #14631, enhancer refusals (open, "Feature", no maintainer reply, verbatim refusal) — <https://github.com/Comfy-Org/ComfyUI/issues/14631>

`[TESTED]`
- ComfyUI issue #14782, Krea 2 512-token cliff (open, "Potential Bug", verbatim sweep table + instrumentation) — <https://github.com/Comfy-Org/ComfyUI/issues/14782>
- `fblissjr/krea-explorations`, `docs/krea2_text_encode.md` (2026-07-02) — encoder/vision-path facts, no reference-latent slot, token budget, collage-vs-composite — <https://github.com/fblissjr/krea-explorations/blob/main/docs/krea2_text_encode.md>
- `fblissjr/krea-explorations`, `docs/findings.md` (2026-07-07) — layer probes, L20 hub, contrastive projector, `<think>` steering, Turbo-LoRA dial, negative-branch/`_cfg_pp` mechanism, vision-reference divergence — <https://github.com/fblissjr/krea-explorations/blob/main/docs/findings.md>

`[LORE]`
- `cyberdeliaAI/comfyui-negpip-zimage` v2.x — NegPiP for Krea 2 / Z-Image / SDXL; signed-weight compilation; "Flux: Not supported" — <https://github.com/cyberdeliaAI/comfyui-negpip-zimage>
- `ethanfel/ComfyUI-Krea2TextEncoder` and `blue-pen5805/ComfyUI-krea2-negpip` — cited upstreams, not independently fetched.
- CSDN Krea 2 deployment articles (SEO/integration-package tier; one contains incorrect negative-prompt advice) — `blog.csdn.net/weixin_31062533/article/details/162646776`, `blog.csdn.net/gitblog_00515/article/details/151993632`

---

## 2026-09-10 official prompt-pair harvest

**Source.** `krea/Krea-2-Turbo` model card at the pinned commit `665ef38131535e3a1da1a86c6ff2261e70ba9a55`,
fetched **2026-09-10** as raw markdown:
<https://huggingface.co/krea/Krea-2-Turbo/raw/665ef38131535e3a1da1a86c6ff2261e70ba9a55/README.md>.
Grade `[OFFICIAL]` throughout this section for the prompt strings themselves — they are the vendor's own
`widget:` gallery, each `text:` paired with an `output.url` image that Krea generated from it and chose to
publish. Pointer provenance: `_addenda/staff-claims-2026-09.md` row 12, `[STAFF]` **NagaSaiAbhinay**
(KREA org), <https://huggingface.co/krea/Krea-2-Turbo/discussions/3>.

**Access note that unblocks a standing register entry.** The 2026-09 sweep's nothing-found register says
*"`krea/Krea-2-Turbo` … raw model cards: unreachable — `…/raw/main/README.md` returns an empty body because
the repos are licence-gated."* **The commit-pinned raw URL is NOT gated and returns the full card**, exactly
as `_addenda/verification-2026-09.md` predicted. Retire that register line for commit-pinned URLs; it still
holds for `…/raw/main/…`.

**Count: exactly 36 `widget:` entries**, paired one-to-one with `images/00.jpg` … `images/35.jpg`. Image URLs
are `https://huggingface.co/krea/Krea-2-Turbo/resolve/665ef38131535e3a1da1a86c6ff2261e70ba9a55/images/NN.jpg`
(the card also references `images/header.jpg`, which has no prompt and is not counted).

**Relationship to the 19 prompts already in this file.** `docs/prompting.md`'s 19 worked examples (§2.1,
§4.1, §4.2) are a *subset*: the short comma-run entries §4.1 and §4.2 quote (`3D rendered matte black
designer toy figure…`, `vintage analog collage…`, `A minimalist flat-color illustration…`, `A dynamic
digital painting of a joyful girl…`, `A tiny figure and a small white dog…`, `1990s vintage anime style cel
animation…`, `stylized digital painting of a dark convertible…`) are numbers **17, 18, 20, 24, 21, 33, 25**
below. The **17 long third-person "describes an existing image" prompts (1–15, plus 3 and 9's variants) are
new to the corpus** and they change the length picture materially — see *Length distribution*.

### The 36 prompts, verbatim

Each is reproduced exactly as the YAML `text:` scalar folds (YAML plain/quoted multi-line scalars fold
newlines to single spaces; no other change). Trailing `., <tail>` punctuation is the vendor's, not a
transcription artefact.

**1 — `images/00.jpg`**
```text
A small, dark-colored cat is captured mid-stride, walking down the center of a narrow, abandoned street. The street is paved and appears cracked and worn. On either side of the street are tall, dilapidated buildings with visible brickwork and windows. A street lamp stands on the right side. The entire image is rendered in a monochromatic blue, with a distinct halftone dot pattern overlaying the scene, giving it a retro or printed appearance. The focus is soft, and the lighting is diffused, creating a hazy, atmospheric effect. The perspective is from ground level, looking down the length of the street, which narrows into the distance., halftone texture
```

**2 — `images/01.jpg`**
```text
A detailed illustration depicts a dramatic confrontation between a mythical lion-like creature and a large bird, possibly a crane. The lion, on the left, is rendered in shades of brown with a prominent, flowing white mane and a small crown on its head. Its mouth is open in a roar, revealing sharp teeth and a pink tongue. On the right, the bird is in mid-flight, with its wings fully extended and its legs tucked back. The bird has white plumage with red accents on its head and tail. The background is a swirling mass of clouds and abstract rock formations, rendered in a palette of warm oranges, yellows, and pale blues, creating a sense of intense action and mythic scale. The artwork has a textured appearance, suggesting it was created with traditional painting techniques, with visible brushstrokes and a slightly aged look. The overall composition is dynamic, with the figures positioned to create a sense of impending clash., ukiyo-e style, Japanese woodblock print
```

**3 — `images/02.jpg`**
```text
A digital painting depicts a black panther in profile, walking on a rocky outcrop in the foreground, facing left. The panther is the primary subject in the immediate foreground. Behind the panther, a vast field of vibrant orange flowers stretches out. A winding path of similar orange flowers cuts through the field. Two immense, pale white monolithic structures rise vertically on either side of the scene, creating a sense of scale and mystery. In the middle distance, on a small hill to the right, a tiny, solitary figure stands, appearing to look towards the monoliths. The background reveals a hazy, distant mountain range. The overall lighting is soft and diffused, with a warm color palette dominated by oranges and whites, and subtle sparkles of light scattered throughout the scene, enhancing its dreamlike quality. The image is rendered with a painterly texture., hazy atmosphere, vast landscapes, expansive mega structures, tiny humans and animals, vibrant and bright
```

**4 — `images/03.jpg`**
```text
This is a digital illustration with a retro, pixelated aesthetic, depicting a young boy and a dog in an abstract indoor setting. The boy, with short brown hair and wearing a white t-shirt and dark shorts, is seated at a light-colored table. He is leaning over the table, looking down at papers or books. His face is rendered with a soft, somewhat blurry effect. To the right of the table, a tan, long-haired dog with large ears is lying on a red surface, possibly a rug or blanket. The dog's head is resting on the surface, and its eyes are closed, suggesting it is asleep. Its face is also rendered with a soft, somewhat distorted effect. The background features reddish-pink walls and a hint of a window or doorway on the left, with a hazy, abstract purple area. Scattered around the scene are various pixelated elements: a blue floppy disk icon, a yellow star icon, a green star icon, a blue thumbs-up icon, and a small black pixelated object near the boy's feet. The overall style is reminiscent of early computer graphics or video games, with a limited color palette and a focus on simple, blocky shapes. The composition is somewhat chaotic, with elements overlapping and a lack of clear spatial depth. The lighting is artificial and creates strong shadows, particularly on the table and the boy., low-poly 3D models
```

**5 — `images/04.jpg`**
```text
A small dragon with outstretched wings and a long tail flies through a cloudy sky. Below the dragon, a vast, indistinct mass of figures, possibly an army, is visible. The main elements are set against a backdrop of swirling, ethereal clouds in shades of blue and white, with hints of purple and pink. The dragon is positioned in the upper right quadrant of the image, with the army occupying the lower left. The image has a dreamlike and atmospheric quality, rendered with a soft, painterly style. The composition is dynamic, with a sense of movement and scale. The medium appears to be digital art or a heavily stylized photograph, possibly with a stippling or pointillist effect. The camera angle is low, looking up towards the dragon and the sky. The lighting is soft and diffused, creating a hazy, ethereal glow. The color palette is dominated by blues and whites, with accents of purple, pink, and warm tones in the army., soft focus, hazy mist
```

**6 — `images/05.jpg`**
```text
A young woman with fair skin and blonde hair styled in curls sits on the floor of a vast, empty opera hall. She is dressed in a fluffy, light pink tutu and a white lace shawl draped over her shoulders. Her legs are extended forward, and her hands rest on her lap. The opera hall features rows of empty, plush red velvet seats arranged in a circular pattern around a central floor area. Ornate balconies with decorative railings line the upper levels, and large, elaborate chandeliers hang from the high ceiling, casting a soft glow. The image has a soft, romantic, and slightly ethereal aesthetic, with a sense of grandeur and emptiness. The composition is centered on the woman, with the vastness of the opera hall surrounding her. The medium appears to be a painting, rendered with visible brushstrokes and a soft focus. The camera angle is a medium shot, slightly elevated, looking down towards the woman. The color palette is dominated by pastels, especially pinks, whites, and creams, with touches of deep red from the seats and gold from the chandeliers and ceiling. The lighting is soft and diffused, creating gentle shadows and highlights., impressionist painting, visible brushstrokes
```

**7 — `images/06.jpg`**
```text
A black and white photograph captures a male rockstar performing on stage, illuminated by a bright spotlight. He is holding a microphone to his open mouth, with his head tilted back and his right arm raised in a dynamic pose. His figure is rendered in high contrast, with sharp highlights and deep shadows. The background depicts a concert setting with a drum set and various amplifiers and speakers. The stage is bathed in intense light, creating a hazy, abstract effect. Silhouettes of an audience are visible in the distance, some with their hands raised. The overall style is gritty and energetic, with a dramatic composition focusing on the performer., thermal imaging style
```

**8 — `images/07.jpg`**
```text
A black and white photograph captures a solitary man standing on a wooden dock, facing away from the viewer and looking out at the vast expanse of the sea. He is wearing a full-length coat and a flat-rimmed hat. The man is silhouetted against the bright sky and water. The dock occupies the lower portion of the frame, with the sea stretching to the horizon. The image is composed with a low camera angle, emphasizing the scale of the sea and the isolation of the figure. The lighting creates strong contrasts, with the man and dock appearing as dark silhouettes against the lighter background., black and white photography
```

**9 — `images/08.jpg`**
```text
A collage-style illustration depicts a man dressed as a wizard, wearing a black suit, a red vest, a yellow shirt, a yellow tie, and a black pointed wizard hat. The wizard hat is positioned above his head, tilted to the right. He holds a wand in his left hand and looks upwards and to the right. To the left of the man, on a purple rectangular background, is a silhouette of a tall, ornate tower, likely a magical castle. To the right of the man, a small purple silhouette of a cat or dog sits on a branch, looking up at the wizard. The entire composition is set against a crumpled brown paper background. The style is whimsical and illustrative, with a focus on texture and a slightly surreal presentation., muted earth tones
```

**10 — `images/09.jpg`**
```text
This is a still image from an anime, depicting a young man with messy, spiky brown hair and glasses seated at a desk. He is wearing a red shirt and a patterned tie. His gaze is directed forward, with a thoughtful expression. The desk is cluttered with various items, including a lamp with a yellow shade, books, and other small objects. Behind him, a large window with horizontal blinds looks out onto a lush green landscape under a bright sky. The sun is setting, casting a warm, golden light into the room and creating a slight lens flare effect. The overall style is characteristic of anime animation from the late 1980s or early 1990s, with hand-drawn character art and painted backgrounds. The lighting is dramatic, emphasizing the transition from day to night., hand-painted background
```

**11 — `images/10.jpg`**
```text
A sweeping cinematic landscape of terraced rice paddies cascading down a misty mountainside at sunrise. Golden light floods across the flooded terraces, their water surfaces mirroring the warm sky. A lone farmer in a conical hat walks along a narrow earthen path between the fields, with layered ridgelines fading into soft morning haze in the distance. The composition is wide and panoramic, filling the entire frame edge to edge with no empty space, rendered in rich, saturated color with a painterly, atmospheric quality., lush panoramic landscape
```

**12 — `images/11.jpg`**
```text
A young girl with short, dark hair, wearing a school uniform consisting of a white shirt, a dark vest, and a red bow tie, stands in the foreground, looking upwards and to her left. Her expression is one of quiet contemplation as she gazes at the sky. The sky is a deep, clear blue, filled with immense, towering cumulus clouds that dominate the upper portion of the frame. These clouds are rendered with a soft, painterly texture, giving them a voluminous and almost tangible appearance. In the upper left quadrant of the image, a small, dark silhouette of an airplane is visible, flying from left to right against the expanse of the blue sky. Below the clouds and behind the girl, the dark, shadowy outlines of hillsides or mountains create a stark contrast with the bright sky. The overall scene is an anime illustration characterized by its detailed background art, evoking a sense of vastness and tranquility. The camera angle is slightly low, looking up at the girl and the sky, enhancing the feeling of openness., deep blue sky
```

**13 — `images/12.jpg`**
```text
An aerial, high-angle shot looks directly down at a woman floating on her back in deep blue water. Her arms are extended outwards, and her head is tilted back with her eyes closed. Sunlight reflects intensely off the water's surface, creating a sparkling effect around her. The composition is centered on the woman, emphasizing her isolation and connection with the water. The lighting is natural, with the sun creating strong highlights and reflections. The color palette is dominated by blues, with the bright sunlight providing contrast., vibrant blue water
```

**14 — `images/13.jpg`**
```text
An anime illustration depicts a young boy and girl walking through a lush forest. The boy, on the left, wears a white short-sleeved shirt, a dark tie, and a blue cap. He has short brown hair and looks to his right with a curious expression. The girl, on the right, wears a white dress with a blue collar and cuffs, and her brown hair is tied back. She carries a woven basket over her right shoulder and also looks to her right with an inquisitive gaze. The forest background is filled with green foliage and trees, with sunlight filtering through the leaves. Large rocks are scattered in the foreground, with a small brown bird perched on a rock to the left. To the right, a small brown monkey is visible climbing a tree. Red and yellow flowers add pops of color to the scene. The overall style is characteristic of traditional hand-drawn animation, with soft lighting and a natural color palette., whimsical woodland creatures
```

**15 — `images/14.jpg`**
```text
A painting depicts a solitary man in a hat and coat standing on a wet sandy beach, facing away from the viewer and towards the sea. To the left, a small, old lighthouse is situated on a rocky outcrop, with a faint light emanating from its top. The sea is calm with gentle waves rolling onto the shore, reflecting the muted light. In the distance, on the left side of the horizon, a cluster of small, warm lights suggests a settlement or port. The sky above is dark and filled with heavy clouds, creating a sense of twilight or early dawn. The overall atmosphere is one of quiet contemplation and solitude, with a color palette dominated by deep teals, greens, and grays, punctuated by the small points of orange light., painterly texture
```

**16 — `images/15.jpg`**
```text
This is a watercolor illustration featuring a collection of nine whimsical, cartoonish characters arranged on a plain white background. The characters are diverse in form and color, rendered with loose, expressive ink lines and watercolor washes. Prominently featured is a tall, anthropomorphic figure with a large white beard, wearing a tall, pointed hat with orange and red stripes, and a small green frog perched on top. To its left is a smaller, brown, plump character with a simple smile. Below the tall figure is a stout, rounded character with a blue hat and a purple robe. Other figures include a small, brown creature with a surprised expression, a yellow, star-like character, and several smaller, abstractly shaped figures in various colors like orange, blue, and brown. Some characters have long, flowing tails or limbs. The overall impression is a playful and imaginative group of fantastical beings.
```

**17 — `images/16.jpg`**
```text
immense rocket launch exhaust as seen from extremely close up
```

**18 — `images/17.jpg`**
```text
3D rendered matte black designer toy figure, stylized round anthropomorphic shape, backward black baseball cap, oversized gold-rimmed aviator sunglasses, white traditional line-art tattoos of tiger and bird on torso, black studded belt with gold buckle, smooth vinyl texture, studio lighting, solid vibrant blue background, high contrast minimal composition
```

**19 — `images/18.jpg`**
```text
vintage analog collage, central irregularly shaped snowy mountain range with a section featuring distinct wavy edges, structured within a 12x16 grid of square tiles, composition fragments the subject by alternating tiles with solid azure blue background squares, thin white grid lines, grainy paper texture, retro aesthetic of mid-century print, vibrant cyan and warm neutral tones, experimental layout, tactile quality, high-contrast graphic composition
```

**20 — `images/19.jpg`**
```text
close-up anime portrait of a young woman, large amber-brown eyes with intricate sparkling reflections, index finger delicately touching a subtle smile, messy dark blue hair with loose strands crossing her face, white and navy school uniform, bright high-key lighting, luminous shadows with cool blue undertones, detailed digital painting, dynamic tilted framing, shallow depth of field on hand
```

**21 — `images/20.jpg`**
```text
A minimalist flat-color illustration of a person wading through expansive shallow ocean waves beneath a pale peach sky. The dark-skinned figure, wearing an orange swim cap, light blue top, and bright green shorts, steps carefully through knee-deep water. The ocean is rendered in muted mint green with delicate, thin black linework detailing the continuous ripples and gentle whitecaps. Soft pinkish-peach reflections echo the sky on the water's surface. A dark, jagged rock rests in the lower left foreground near a pale grey shoreline. The horizon features a solid purplish-blue landmass and a stylized, layered yellow and blue cloud. The high-angle wide perspective emphasizes the vast negative space of the water, utilizing a clean ligne claire drawing aesthetic with a subtle paper texture.
```

**22 — `images/21.jpg`**
```text
A tiny figure and a small white dog sit side-by-side in the deep green shadow of a massive tree on a sloping grassy hill. The enormous tree canopy dominates the upper composition, textured with thousands of stippled, light blue and yellow dabs representing leaves. A sharp diagonal line divides the vibrant, sunlit yellow-green grass in the foreground from the dark shade sheltering the pair. The stylized, painterly landscape features flattened perspective, visible brushstrokes, and intense color contrast.
```

**23 — `images/22.jpg`**
```text
A close-up portrait of a young East Asian woman with straight black hair, loose strands sweeping across her fair skin, and an intense gaze. She wears a light grey collared shirt with a black tie. A vibrant bouquet of pink and orange lilies with lush green leaves sits in the blurred right foreground. The background is a solid, striking crimson red. Soft, directional studio lighting highlights her facial features, creating a high-contrast composition with a shallow depth of field.
```

**24 — `images/23.jpg`**
```text
A tiny, russet-brown harvest mouse clings to a slender diagonal branch amid vibrant green lobed leaves and small round buds. The mouse has soft textured fur, glossy black eyes, a pink nose, fine whiskers, and delicate pink paws firmly gripping the wood. In this macro photograph, an extremely shallow depth of field sharply focuses on the animal's face. The deep green background dissolves into a smooth, creamy bokeh, illuminated by soft, diffused natural lighting that highlights the intricate details of the fur and foliage.
```

**25 — `images/24.jpg`**
```text
A dynamic digital painting of a joyful girl in a sailor uniform stretching her arms high against a solid vibrant blue background. She has short dark windblown hair, amber eyes, and a bright smile. She wears a white shirt, striped blue collar, flowing red neckerchief, and a billowing blue pleated skirt. Expressive thick brushstrokes and bold shading emphasize energetic motion.
```

**26 — `images/25.jpg`**
```text
stylized digital painting of a dark convertible on a winding coastal cliff road, high-angle perspective, blocky painterly brushstrokes, golden hour sunlight hitting rocky orange terrain and green vegetation, flock of white abstract birds flying in foreground, blinding bright sun reflection on vast ocean, vibrant warm color palette, sharp graphic shadows
```

**27 — `images/26.jpg`**
```text
An extreme low-angle close-up captures a colossal, weathered stone and bronze guardian towering in a dark, cavernous ruin. The foreground is dominated by a massive circular shield, deeply engraved with intricate spiral motifs, geometric borders, and a central star emblem. To the right, a massive gauntlet grips a textured staff. Cinematic shafts of light pierce the dusty gloom, highlighting the rough, aged textures of the ancient armor while the background fades into deep shadows through a shallow depth of field.
```

**28 — `images/27.jpg`**
```text
A stylized jungle illustration densely packed with oversized flora and surreal characters, rendered with smooth geometric shapes and granular stippled shading. Two pale figures with flowing, star-speckled black hair navigate the lush environment in blue garments. On the left, a figure grasps a vine as a white, long-beaked bird perches on their outstretched hand. On the right, the second figure reclines beside a sleek, pinkish-orange fox. The dense surroundings feature sweeping green stalks and colossal blooms in brilliant golden yellow, coral pink, and deep red. A second white bird emerges from the lower foliage. The vibrant composition forms a seamless tapestry, utilizing rich colors and volumetric grain to create a dreamlike, textured depth.
```

**29 — `images/28.jpg`**
```text
A surreal retro-futuristic space scene features liquid chrome forming an abstract face merging with a glowing planetary horizon. The foreground is dominated by swirling, highly reflective metallic fluid that distorts into a stylized, melting facial profile with deep shadows and bright silver highlights. This undulating chrome form rests against the curved, atmospheric edge of a massive planet bathed in a soft electric blue and purple glow. Above the primary planet, a smaller eclipsed celestial sphere sits in the upper center, crowned by a sharp, cross-shaped starburst flare. Two additional radiant flares burst from the left and right edges of the horizon. Set against a deep black starfield, the artwork employs a vintage 1980s airbrush aesthetic with smooth gradients, ethereal lighting, and high-contrast metallic rendering.
```

**30 — `images/29.jpg`**
```text
An extreme close-up portrait featuring pale, freckled skin and a single blue eye wrapped in reflective metallic gold ribbons. Thin gold strips crisscross diagonally over the cheek and forehead, casting sharp, hard shadows onto the face. Strands of copper hair frame the top edge while the left ear softly blurs out of focus. Harsh, direct lighting highlights intricate skin pores and bright golden reflections, isolating the brightly lit features against a pitch-black background in a bold, high-contrast macro editorial style.
```

**31 — `images/30.jpg`**
```text
Stylized digital painting of a menacing jester figure rendered with bold, expressive brushstrokes and a vibrant, almost psychedelic color palette against a pitch-black background. Dynamic low-angle perspective forces a dramatic, imposing composition as the character leans forward, one leg raised high. The jester wears a classic multi-pointed hat with bells, a ruffled collar, puffed sleeves, harlequin-patterned shorts in muted gold and dark brown, and striped tights in alternating shades of purple, blue, and chartreuse. A heavily textured, flowing cape billows outward to the left, decorated with abstract, fluid patterns of saturated purples, greens, and iridescent hues resembling oil slicks or marbled paper. The figure's face is completely obscured, appearing as a smooth, faceless, pale mauve mask with a single, glowing bright white point of light in the center. In its right hand, clad in a grey-blue gauntlet, the jester grips a massive, ornate sword with a wide, glowing, ethereal white blade, its crossguard intricately sculpted. Lighting is dramatic and theatrical, casting strong shadows and highlighting the painterly texture, giving the artwork a dark fantasy, surreal aesthetic reminiscent of concept art.
```

**32 — `images/31.jpg`**
```text
high-fashion editorial portrait of a young East Asian woman, short choppy platinum blonde bob with heavy bangs, looking over her bare shoulder to the right, lips playfully pursed, wearing a structured black top with an architectural protruding bust detail and thin straps, delicate gold hoop earrings, arm bent with hand resting on hip, warm skin tones, solid striking crimson red background, soft directional studio lighting, cinematic color palette, medium close-up shot
```

**33 — `images/32.jpg`**
```text
A surreal black-and-white ink illustration of three interlocking, heavily wrinkled elderly faces merging into a landscape. The top face covers one eye, crowned by dense leaves, a live bird, and a skeletal bird. It flows into a profile face and a third face featuring a solid black eye and a hand on its cheek. The bottom neck plunges into a cross-section of earth, morphing into swirling subterranean roots, buried bones, and abstract organic forms. Above ground, weathered wooden cabins and tall grass flank the facial monolith. Meticulous stippling and cross-hatching define the high-contrast, intricate vertical composition.
```

**34 — `images/33.jpg`**
```text
1990s vintage anime style cel animation, densely packed crowd of teenagers in summer uniforms, central boy with short black hair raising a clenched right fist, squinting one eye with a determined expression, wearing a white short-sleeve shirt and solid green necktie, surrounding students looking in various directions, girls in white sailor blouses with green striped collars and neckerchiefs, light blue skirts and trousers, tightly framed medium shot, flat shading, soft muted retro.
```

**35 — `images/34.jpg`**
```text
young woman looking over her right shoulder, anime-style illustration, messy black hair blowing dynamically in the wind, striking green eyes, subtle neutral expression, oversized white button-down collared shirt with soft blue shadows, vibrant deep blue sky background, bright fluffy white cumulus clouds, silhouetted utility poles with power lines, low angle portrait, cinematic sunlight, crisp cel-shaded aesthetic
```

**36 — `images/35.jpg`**
```text
extreme close-up of a woman's face partially obscured by tousled dark brown hair, soft parted lips, smooth skin on lower cheek and jawline, stray hair strands falling loosely across the nose, deep moody shadows enveloping the left frame, cinematic warm lighting, delicate highlights on the mouth, muted earthy color palette, sepia-toned warmth, intimate portrait photography, macro lens, shallow depth of field, distinct film grain texture, vintage atmospheric aesthetic
```

### Analysis

All figures below are computed from the 36 strings exactly as reproduced above (whitespace-normalised,
split on ASCII spaces). The script is deterministic and re-runnable against this file; grade the *counts*
`[TESTED — static analysis of an OFFICIAL corpus]` and the *prompts* `[OFFICIAL]`.

#### Length distribution

| Statistic | Words | Characters |
|---|--:|--:|
| min | **10** (#17) | 61 |
| Q1 | 71.2 | — |
| median | **101.5** | 625 |
| mean | 108.0 | 673.6 |
| Q3 | 142.2 | — |
| max | **230** (#4) | 1321 |

Band histogram (words): ≤20 → **1** · 21–50 → **2** · 51–80 → **11** · 81–120 → **8** · 121–160 → **7** ·
161–200 → **6** · >200 → **1**.

**The vendor's own spread is far wider than any band the corpus teaches.** Only **15 of 36 (42%)** land
inside the app's `80-140 words` rule; **12 are shorter than 80** and **9 are longer than 140**. Krea
publishes a **ten-word** prompt (`immense rocket launch exhaust as seen from extremely close up`) and a
**230-word** prompt in the same gallery, with the same billing. This is the strongest evidence yet for the
model card's own sentence *"prompt following may be influenced by prompt style, specificity, language, and
phrasing"* rather than by a length target, and for `docs/prompting.md`'s *"the model is capable of
generating high quality images with minimal prompt engineering."*

**Against the 512-position cap** (§*Tested findings* A): the longest of the 36 is **1,321 characters
≈ 236 conditioning positions** at the bug reporter's measured 5.6 chars/position ratio, or ≈307 tokens at
`QJerry`'s 0.75 words/token. **Every official prompt sits at or under ~46% of the 512-position budget.**
`[SYNTHESIS]` The cap is not a constraint on vendor-shaped prompts at all — it is a constraint on
*expander output* and on *vision references*. That relocates the whole cliff risk onto `prompt_enhance`
and reference images, exactly where §*Validator changes* already put it.

#### Two prompt families, and the one nobody recorded

The 36 split cleanly, and the split is positional:

| Family | Entries | Shape | Words (mean / median) |
|---|---|---|--:|
| **A — long caption + style tail** | **1–15** (`images/00`–`14`) | third-person description of an already-existing image (`A … depicts/captures …`), 4–12 sentences, ending `., <comma-separated style tail>` | 143.7 / 134 |
| **B — direct prompt** | **16–36** (`images/15`–`35`) | the `docs/prompting.md` set: 13 prose, 8 pure comma-runs | 82.6 / 77 |

**All 15 family-A entries carry the trailing tail; none of the 21 family-B entries do.** The tails, verbatim:

```text
 1  halftone texture
 2  ukiyo-e style, Japanese woodblock print
 3  hazy atmosphere, vast landscapes, expansive mega structures, tiny humans and animals, vibrant and bright
 4  low-poly 3D models
 5  soft focus, hazy mist
 6  impressionist painting, visible brushstrokes
 7  thermal imaging style
 8  black and white photography
 9  muted earth tones
10  hand-painted background
11  lush panoramic landscape
12  deep blue sky
13  vibrant blue water
14  whimsical woodland creatures
15  painterly texture
```

`[SYNTHESIS]` This is the technical report's caption pipeline made visible: *"Once a context-rich,
long-form natural-language caption is obtained, we use a cheaper LLM to reformat it into a variety of
lengths and formats."* Family A reads as **VLM caption of a reference image + the user's own style
request appended as a tag run**. It is a *documented vendor prompt format* that the corpus has never
carried, and it is the exact shape the app's `krea2` rule *"Output ONLY the paragraph"* forbids. Note
too that the tail is where the **style** lives in family A — the opposite of "lead with the medium".

#### Ordering — what actually comes first

Mean relative position (0 = start of prompt, 1 = end) of each axis across the prompts that use it:

| Axis / phrase | n | mean relative position |
|---|--:|--:|
| subject + its attributes | 36 | opens every prompt |
| `background` | 20 | 0.61 |
| `The background …` | 5 | 0.53 |
| `The composition …` | 5 | 0.61 |
| `composition` (any) | 15 | 0.68 |
| `The camera angle …` | 3 | 0.76 |
| `color palette` | 11 | 0.76 |
| `lighting` | 19 | 0.79 |
| `The lighting …` | 6 | 0.82 |
| `depth of field` | 5 | 0.86 |

**The observed vendor order is: subject and its concrete attributes → spatial layout → background →
composition → medium / camera → lighting → colour palette → (optional style tail).** Technical and
aesthetic axes consistently *trail*; nouns and their attributes *lead*.

Medium naming: named within the first 80 characters in **24/36 (67%)**; named only past the midpoint in
**8** (relative positions 0.38, 0.47, 0.48, 0.51, 0.64, 0.75, 0.82, 0.84); and **never named at all in 4**
(#10, #17, #22, #27). Family A's characteristic construction discloses the medium *late and hedged* —
`The medium appears to be a painting, rendered with visible brushstrokes and a soft focus.` (#6),
`The image is rendered with a painterly texture.` (#3), `The medium appears to be digital art or a heavily
stylized photograph` (#5).

#### Encoder-descriptor categories — fill rates

The encoder's baked-in system turn asks for *"the color, shape, size, texture, quantity, text, spatial
relationships of the objects and background"* (§*New official guidance* item 2). Measured against the
vendor's own 36 prompts:

| Descriptor slot | Prompts using it | Share |
|---|--:|--:|
| **color** | 34 | 94% |
| **spatial relationships** | 34 | 94% |
| **size** | 33 | 92% |
| **texture** | 22 | 61% |
| **shape** | 20 | 56% |
| **quantity** | 19 | 53% |
| **text** | **2** | **6%** |

And the two "text" hits are `star emblem` / `floppy disk icon`-type object nouns (#4, #27) — **no prompt
in the set asks for a rendered glyph.**

`[SYNTHESIS]` Two corrections follow. (a) The nine slots are an **axis checklist of what the encoder is
primed to look for**, not a mandatory list to fill: three axes are near-universal, three are optional,
one is essentially unused. (b) **The vendor's own prompts do not follow the descriptor's order.** The
descriptor runs colour → shape → size → texture → quantity → text → spatial → objects → background; the
prompts run objects → attributes → spatial → background → style → camera → lighting → palette. The
2026-09-03 sweep's *"nine named slots in that order … Teach these nine slots as the Krea 2 checklist"* is
right about the checklist and **wrong about the order** — the ordering half has now been falsified against
the same vendor's own published prompts.

#### Matte, flat and negative-space vocabulary

Every occurrence in the 36, with its prompt number:

| Phrase | n | Prompts |
|---|--:|---|
| `solid vibrant blue background` | 2 | 18, 25 |
| `solid striking crimson red background` | 1 | 32 |
| `The background is a solid, striking crimson red.` | 1 | 23 |
| `pitch-black background` | 2 | 30, 31 |
| `plain white background` | 1 | 16 |
| `solid azure blue background squares` | 1 | 19 |
| `flat-color illustration` | 1 | 21 |
| `flat shading` | 1 | 34 |
| `flattened perspective` | 1 | 22 |
| `negative space` | 1 | 21 (`emphasizes the vast negative space of the water`) |
| `no empty space` | 1 | 11 (`filling the entire frame edge to edge with no empty space`) |
| `matte` | 1 | 18 (`3D rendered **matte black** designer toy figure` — an object colour, not an anti-gloss instruction) |
| `studio lighting` | 3 | 18, 23, 32 |
| `high contrast` / `high-contrast` | 7 | 7, 18, 19, 23, 29, 30, 33 |
| `minimal composition` | 1 | 18 |
| `shallow depth of field` | 5 | 20, 23, 24, 27, 36 |

**Confirmed:** the corpus's canonical construction **`solid <adjective> <colour> background`** is vendor
language, present four times, and #23 shows it can be **its own sentence**
(`The background is a solid, striking crimson red.`) — a form §4.2 does not record.

**Falsified as vendor language:** `matte surface`, `no specular highlights`, `dry pigment finish`,
`flat graphic design` appear **nowhere** in the 36. The word `matte` occurs once and describes the toy's
paint, not the render. `[SYNTHESIS]` The vendor's own anti-gloss route is not an adjective list at all —
it is **naming the mark-making**: `expressive thick brushstrokes`, `blocky painterly brushstrokes`,
`visible brushstrokes`, `flat shading`, `granular stippled shading`, `volumetric grain`, `grainy paper
texture`, `subtle paper texture`, `clean ligne claire drawing aesthetic`, `meticulous stippling and
cross-hatching`. Keep §4.1's table; **regrade the app's `matte surface / no specular highlights / dry
pigment finish` string from implied-official to `[SYNTHESIS]`.**

#### Trigger words

**Zero of the nine official LoRA trigger phrases appear in any of the 36 prompts.** Searched all nine
verbatim (`monochrome ink wash style`, `monochrome stippling style`, `naive expressive sketch style`,
`textured abstract style`, `rainy window style`, `purple retro anime style`, `art deco watercolor style`,
`ethereal motion blur style`, `vintage tarot style`). `[OFFICIAL]` scoped absence: the triggers are
**LoRA-activation strings, not base-model style vocabulary**, and the base model's own gallery never uses
them. This is a clean confirmation of the §4.1 "pick a lane" advice from the other direction — Krea's own
base-model prompts describe style in ordinary words (`ukiyo-e style, Japanese woodblock print`,
`impressionist painting`, `1990s vintage anime style cel animation`), never with a trigger phrase.

#### Rendered text handling

`docs/prompting.md` says, verbatim, *"For text rendering, we recommend putting **quotes** around the words
to be rendered."* **The 36-pair gallery contains no example of it: 0/36 prompts contain a double quote and
0/36 contain the word "text" as a request.** `[OFFICIAL]` scoped absence over {the pinned model card's 36
`widget:` entries}. The convention stands on the four-sentence prompting doc alone; **there is no
vendor-published prompt+image pair demonstrating Krea 2 rendering a legible glyph.** The corpus and the app
should say so rather than implying the technique is demonstrated.

#### Comparison with the app's `krea2` system prompt

Compared against `PromptStudio.html` `TARGETS.krea2.system` (read-only, read 2026-09-10). Confirmations
first, then contradictions, each graded.

**Confirmations**

| # | App rule | Evidence from the 36 | Grade |
|---|---|---|---|
| C1 | "ONE prose paragraph" | **28/36 are prose**; only 8 are pure comma-runs (#18, 19, 20, 26, 32, 34, 35, 36). Prose is the vendor default. | `[OFFICIAL]` |
| C2 | "Palette lock … 3-5 precise color words" | Colour vocabulary in **34/36**, and the hues are named precisely, not loudly: `muted mint green`, `russet-brown`, `pinkish-orange`, `pale mauve`, `chartreuse`, `pale peach`, `deep teals`. Confirms §2.6's *"'Oxblood' gets you the color on the first try."* | `[OFFICIAL]` |
| C3 | "NEVER use (word:1.2) emphasis" | **Zero** weighting parens, zero `{a\|b}`, zero `[]` across all 36. | `[OFFICIAL]` |
| C4 | "solid flat background named by exact color" | `solid vibrant blue background` ×2, `solid striking crimson red background`, `The background is a solid, striking crimson red.`, `pitch-black background` ×2, `plain white background`. | `[OFFICIAL]` |
| C5 | "No quality meta-tags" | **Zero** occurrences of `masterpiece`, `best quality`, `8k`, `ultra detailed`, `beautiful`, `amazing`. | `[OFFICIAL]` |
| C6 | "NO negative prompt" | The `widget:` schema carries a single positive `text:` per pair; there is no negative field anywhere on the card. Weak but consistent. | `[OFFICIAL]`, weak |

**Contradictions**

| # | App rule | What the 36 show | Grade |
|---|---|---|---|
| X1 | `ONE prose paragraph, 80-140 words` | **42% compliance.** Range 10–230, median 101.5, IQR 71–142. Krea ships a 10-word and a 230-word prompt side by side. The band is a craft preference, not a vendor spec, and the app states it as a hard rule. | `[OFFICIAL]` contradicts |
| X2 | `LEAD WITH THE MEDIUM` (stated as a rule, in caps) | True in **24/36 (67%)**; **8** disclose the medium past the midpoint, **4 never name one**, and family A's house style is *subject first, medium disclosed late and hedged, style pushed into a trailing tail*. | `[OFFICIAL]` contradicts |
| X3 | `Rendered text goes in quotes` | **0/36** worked examples. The rule is sourced (four-sentence prompting doc) but **undemonstrated** by the vendor's own gallery. | `[OFFICIAL]` scoped absence |
| X4 | (corpus, 2026-09-03) *"nine named slots **in that order**"* | Fill rates 94/94/92/61/56/53/**6**%, and the prompts run objects→attributes→spatial→background→style→camera→lighting→palette — **not** the descriptor's order. Checklist yes; ordering no. | `[OFFICIAL]` contradicts |
| X5 | `matte surface, no specular highlights, dry pigment finish` | **Not vendor language.** Zero occurrences; `matte` appears once as an object colour. The vendor's anti-gloss route is naming the mark-making. | `[OFFICIAL]` scoped absence |
| X6 | `Output ONLY the paragraph.` | **15/36** official prompts are *paragraph* `., ` *comma-separated style tail*. A documented vendor format the app's output contract forbids. | `[OFFICIAL]` contradicts |

**Not contradicted, but newly sourced:** the app's `flat graphic design` phrase traces to fal's
partner examples (§4.2), not to Krea — Krea's own flatness words are `flat-color illustration`,
`flat shading`, `flattened perspective`, `high contrast minimal composition`.

#### Erratum found while harvesting

`[OFFICIAL]` §1.5 of this file quotes the HF card's diffusers snippet as
`pipe("a fox in the snow", num_inference_steps=8, guidance_scale=0.0)`. **The pinned commit
`665ef38` — the card as published on release day, "Last updated: June 22, 2026" — reads
`guidance_scale=3.5`**, verbatim:

```python
pipe = Krea2Pipeline.from_pretrained("krea/Krea-2-Turbo", torch_dtype=torch.bfloat16).to("cuda")
image = pipe("a fox in the snow", num_inference_steps=8, guidance_scale=3.5).images[0]
```

So the 2026-09-03 digest's *Contradicts* #17 (*"a new, unrecorded official-vs-corpus conflict on Krea 2
Turbo's CFG"*) is not a later edit to the card — **the 3.5 value was there from release**, and §1.5's
`0.0` is a transcription error or came from a different surface. Also: **this card carries no CLI section
at all**, so §1.5's `uv run inference.py … --cfg 0.0 --mu 1.15` block is attributable to
`github.com/krea-ai/krea-2`'s README, **not** to the HF card as §1.5 states. The substantive question
(does `Krea2Pipeline` treat `guidance_scale` as embedded guidance rather than CFG?) remains **open and
testable** — do not fold either side in as settled.

### Few-shot gold (new pairs)

### Pair 7 — figure on a solid keyable background [OFFICIAL]
INTENT: A single expressive character rendered painterly, isolated on a flat solid colour that can be keyed
or masked — the app's core `krea2` use case, in Krea's own words.
PROMPT-EN (verbatim, prompt #25 of 36):
```text
A dynamic digital painting of a joyful girl in a sailor uniform stretching her arms high against a solid vibrant blue background. She has short dark windblown hair, amber eyes, and a bright smile. She wears a white shirt, striped blue collar, flowing red neckerchief, and a billowing blue pleated skirt. Expressive thick brushstrokes and bold shading emphasize energetic motion.
```
IMAGE: `images/24.jpg` —
<https://huggingface.co/krea/Krea-2-Turbo/resolve/665ef38131535e3a1da1a86c6ff2261e70ba9a55/images/24.jpg>
NOTES: **60 words / 378 characters ≈ 68 conditioning positions** — 13% of the 512 budget, and *less than
half* the app's stated 80–140 floor, yet it is one of the vendor's published showcase pairs. Structure:
medium (`A dynamic digital painting`) → subject + action → **background in the same opening sentence** →
per-garment colour inventory → mark-making last (`Expressive thick brushstrokes and bold shading`). No
lighting clause, no camera clause, no palette clause, no negative, no weights, no quality tags. This is the
counter-example to the app's length rule and the proof that `solid <adj> <colour> background` works inside
the *first* sentence rather than as a trailing instruction.

### Pair 8 — long caption + style tail, medium disclosed late [OFFICIAL]
INTENT: The vendor's family-A house format — a full third-person description of the finished image, with
the style request appended after the final period as a comma tail.
PROMPT-EN (verbatim, prompt #6 of 36):
```text
A young woman with fair skin and blonde hair styled in curls sits on the floor of a vast, empty opera hall. She is dressed in a fluffy, light pink tutu and a white lace shawl draped over her shoulders. Her legs are extended forward, and her hands rest on her lap. The opera hall features rows of empty, plush red velvet seats arranged in a circular pattern around a central floor area. Ornate balconies with decorative railings line the upper levels, and large, elaborate chandeliers hang from the high ceiling, casting a soft glow. The image has a soft, romantic, and slightly ethereal aesthetic, with a sense of grandeur and emptiness. The composition is centered on the woman, with the vastness of the opera hall surrounding her. The medium appears to be a painting, rendered with visible brushstrokes and a soft focus. The camera angle is a medium shot, slightly elevated, looking down towards the woman. The color palette is dominated by pastels, especially pinks, whites, and creams, with touches of deep red from the seats and gold from the chandeliers and ceiling. The lighting is soft and diffused, creating gentle shadows and highlights., impressionist painting, visible brushstrokes
```
IMAGE: `images/05.jpg` —
<https://huggingface.co/krea/Krea-2-Turbo/resolve/665ef38131535e3a1da1a86c6ff2261e70ba9a55/images/05.jpg>
NOTES: **199 words / 1,193 characters ≈ 213 conditioning positions** (42% of budget). Eleven sentences in a
fixed axis order — subject → costume → pose → setting → setting detail → mood → **composition** →
**medium** (at 64% through the prompt) → **camera angle** → **colour palette** → **lighting** — then
`., impressionist painting, visible brushstrokes`. **This single prompt falsifies "LEAD WITH THE MEDIUM"
and "Output ONLY the paragraph" simultaneously**, and it is the cleanest available template for the
"describe the finished picture to someone over the phone" doctrine §2.2 already teaches. Teach it as *a*
vendor format, not *the* format — family B is equally official and half the length.

### Pair 9 — flat colour, linework and negative space [OFFICIAL]
INTENT: Matte, print-like flatness with deliberate empty space — the closest official prompt to the app's
painterly / anti-gloss target, and the only one that uses the phrase `negative space`.
PROMPT-EN (verbatim, prompt #21 of 36):
```text
A minimalist flat-color illustration of a person wading through expansive shallow ocean waves beneath a pale peach sky. The dark-skinned figure, wearing an orange swim cap, light blue top, and bright green shorts, steps carefully through knee-deep water. The ocean is rendered in muted mint green with delicate, thin black linework detailing the continuous ripples and gentle whitecaps. Soft pinkish-peach reflections echo the sky on the water's surface. A dark, jagged rock rests in the lower left foreground near a pale grey shoreline. The horizon features a solid purplish-blue landmass and a stylized, layered yellow and blue cloud. The high-angle wide perspective emphasizes the vast negative space of the water, utilizing a clean ligne claire drawing aesthetic with a subtle paper texture.
```
IMAGE: `images/20.jpg` —
<https://huggingface.co/krea/Krea-2-Turbo/resolve/665ef38131535e3a1da1a86c6ff2261e70ba9a55/images/20.jpg>
NOTES: **122 words / 795 characters ≈ 142 conditioning positions** (28% of budget). Medium leads
(`A minimalist flat-color illustration`), every colour is a compound hue rather than a base word
(`pale peach`, `muted mint green`, `pinkish-peach`, `purplish-blue`, `pale grey`), and the anti-gloss work
is done entirely by **medium + mark-making + surface**: `flat-color`, `delicate, thin black linework`,
`clean ligne claire drawing aesthetic`, `subtle paper texture`. Note the negative-space instruction is
phrased as a **positive compositional fact** (`The high-angle wide perspective emphasizes the vast negative
space of the water`), never as an exclusion — the same rule §4.2 derives, now with a vendor example. Also
note the counter-example at #11, which instructs the exact opposite in the same official set:
`filling the entire frame edge to edge with no empty space`.

### Nothing-found register (2026-09-10 harvest)

- **The 36 `widget:` images were not downloaded or viewed.** Every claim here is about the **prompt text**;
  no visual verification of prompt→image fidelity was attempted. URLs are recorded so the maintainer can.
- **No negative prompt, sampler, step count, CFG, seed or resolution is attached to any of the 36 pairs.**
  The `widget:` schema carries only `text:` and `output.url`. So the pairs cannot settle the CFG question.
- **No LoRA is referenced by any of the 36.** Whether these were generated on Raw or Turbo is unstated on
  the card.
- **Zero rendered-text examples**, as above — scoped to this card at this commit.
- **`LICENSE.pdf` was still not opened** (linked from the card front-matter as
  `https://huggingface.co/krea/Krea-2-Turbo/blob/main/LICENSE.pdf`). The `$1M revenue / 50 seats` figures
  therefore remain `[SPECULATION]` for a third sweep running. A PDF behind a gated repo is the blocker.
- **`krea/Krea-2-Raw`'s card was not fetched at a pinned commit** — no commit SHA is recorded anywhere in
  the corpus for it. Next-run target: find one via the repo's commit list.
- **`docs/safety.md`** in `krea-ai/krea-2` remains unfetched (carried over from the 2026-09-03 register).
