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
