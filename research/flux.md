# FLUX family research brief

Research baseline: 2026-08-15. Scope: FLUX.1 dev/schnell/Krea; FLUX.2 dev/klein.

## Official guidance

- [OFFICIAL] FLUX.2 structure: Subject + Action + Style + Context. Word order matters; priority is main subject → action → style → context → secondary details. [BFL guide](https://docs.bfl.ai/guides/prompting_guide_flux2)
- [OFFICIAL] Prompt bands: short 10–30 words for exploration, medium 30–80 usually ideal, long 80+ for genuinely complex specifications.
- [OFFICIAL] For photorealism, name camera/lens/stock rather than “professional photo.” For text, quote exact copy and state placement, style, size and color. FLUX.2 also understands JSON for complex scenes and hex colors tied to specific objects.
- [OFFICIAL] FLUX.2 dev supports local customization and about six references; klein 4B/9B is step-distilled at four steps and has base undistilled variants. Klein does not include prompt upsampling, so detail must be supplied by the user. [FLUX.2 overview](https://docs.bfl.ai/flux_2/flux2_overview)
- [OFFICIAL/CREATOR] FLUX.1 dev is the quality local variant; schnell is fast/distilled. Krea is an aesthetic fine-tune—keep checkpoint-specific conclusions separate.

## Rewriter system prompts (verbatim)

No public, official FLUX.1/2 local prompt-rewriter system prompt was found. FLUX.2 API offers `prompt_upsampling`, but BFL documents behavior, not its internal system text. Status: nothing public found.

## Chinese prompting

- [OFFICIAL] FLUX.2 recommends the native language best matching cultural context. It supports multilingual prompting; official examples encourage French for Parisian scenes and Japanese for anime.
- This is not evidence that Chinese generally beats English. Use Chinese for Chinese visible text/cultural objects; keep exact glyphs quoted. English remains best-supported for camera/lens vocabulary.
- Native examples [SYNTHESIS]: `宋代山水册页，绢本设色，留白构图，远山层叠，江面一叶扁舟`; `上海弄堂雨夜，湿润石板反射暖色窗光，纪实摄影`; `海报顶部以朱红色宋体写“春日书市”，无其他文字`.

## Motion / composition control

Composition hierarchy: front-load subject/action; add viewpoint/lens; specify foreground/midground/background and left/right placement; associate every color with an object. JSON is useful when three or more objects need independent attributes.

- [OFFICIAL] FLUX.2 supports structural pose/layout guidance through its multi-reference editing interface. A pose reference can bind body position, gaze direction, limb placement and stance while separate references supply identity/style. The official pattern is: “Match the exact pose from image 2—same arm position, same body angle, same gaze direction. Use the person and clothing from image 1.” Clear, unoccluded limbs work best. [BFL Pose & Layout Guidance](https://docs.bfl.ai/guides/usecases_editing_controlnets)
- [TESTED/PAPER] GenSpace finds that even strong systems including FLUX.1-dev and SDXL have substantial camera/object-orientation weaknesses and often default toward common views. This is evidence against promising exact viewpoint or multi-object geometry from prose alone. [GenSpace](https://openreview.net/pdf?id=zyBG1j339A)
- [SYNTHESIS] Route exact-pose requests to FLUX.2 reference guidance. Use prompt-only prose for approximate poses; do not make the prompt longer in an attempt to replace a structural reference.

Failure fixes:

- Attribute bleed: flatten to one explicit sentence per object or JSON fields; repeat each object's color/material locally.
- Wrong text: quoted exact copy, carrier, position, typography, size, color; say “no other text.”
- Generic photorealism: real camera/lens/light/film reference rather than quality adjectives.
- Crowded scene: reduce secondary details, front-load the focal subject, and state negative space/compositional role positively.
- Exact pose fails: ask for a pose image; assign one reference to identity and another to pose, then name the limb/stance/head/gaze features that must match.

## Verbosity calibration

- 30–80 words is the official ideal for most work. 10–30 is exploratory; 80+ is justified by complex scenes [OFFICIAL].
- Load-bearing: subject/action, spatial relation, style/medium, context, light, material, lens, exact text/color. Noise: redundant quality modifiers, conflicting style stack, “no X” phrasing.
- FLUX.2 klein needs more explicit description because it has no upsampling [OFFICIAL]. FLUX.2 API upsampling is useful for exploration, but disable/avoid it when exact wording and layout must remain controlled [SYNTHESIS].

## Negatives & guidance

- [OFFICIAL] FLUX.2 does not support negative prompts. Rephrase positively: `sharp focus throughout`, `empty street`, `clean background`.
- [OFFICIAL] FLUX.2 flex guidance range is 1.5–10, example 4.5; steps up to 50. Higher guidance is an adherence/quality tradeoff.
- FLUX.1 local pipelines vary. Do not transfer FLUX.2 “no negatives” mechanically to every community FLUX.1 node, but the model dialect still benefits from positive descriptions.

## Few-shot gold

### Pair 1 — person [SYNTHESIS]
INTENT: Analog portrait of a florist.
PROMPT-EN:
A florist in her early forties trims eucalyptus stems at a narrow workbench, candid three-quarter portrait, sage apron over a white linen shirt, buckets of wildflowers behind her, soft north-window light, shot on Kodak Portra 400 with a 50mm lens, natural grain and restrained color.
PROMPT-ZH:
一位四十岁左右的花艺师在狭窄工作台前修剪尤加利枝，三分之四身纪实肖像，鼠尾草绿色围裙配白色亚麻衬衫，身后摆放几桶野花，北窗柔光，柯达 Portra 400 胶片质感，50mm 镜头，自然颗粒与克制色彩。
NOTES: Official subject-action-style-context order plus specific capture vocabulary.

### Pair 2 — landscape [SYNTHESIS]
INTENT: Whale seen half above and below water.
PROMPT-EN:
A humpback whale dives beside a small research boat, cinematic long shot with the camera exactly half underwater and half above the surface; sunlit waves and boat occupy the upper third, the whale's full body descends through clear deep-blue water below, natural caustics, wide-angle underwater photography.
NOTES: Front-loaded subject/action and explicit split composition.

### Pair 3 — action/composition [SYNTHESIS]
INTENT: Chef tossing noodles in a wok.
PROMPT-EN:
A street-food chef tosses noodles high above a black steel wok, orange flame curling around the pan, one hand gripping the handle and the other holding a long ladle, low three-quarter camera at counter height, customers only in the softly blurred background, crisp frozen motion, humid night market, warm tungsten and cyan sign light.
PROMPT-ZH:
夜市摊主将面条从黑色钢制炒锅中高高颠起，橙色火焰沿锅壁卷起，一手握锅柄，一手持长柄炒勺；机位位于柜台高度的低角度三分之四侧面，顾客只出现在柔焦背景，动作凝固清晰，暖色钨丝灯与青色招牌光交错。
NOTES: Local attribute binding and positive background control.

### Pair 4 — text-in-image [OFFICIAL-PATTERN]
INTENT: Branded opening-hours sign.
PROMPT-EN:
Minimal cream storefront sign. The large headline text “OPEN LATE” appears centered in bold condensed serif lettering, color #C43A2F. Directly below, small text reads “FRI—SUN · 6 PM—1 AM” in dark charcoal. Thin #1F6B55 border, even spacing, straight-on product photograph, no other text.
PROMPT-ZH:
极简奶油色店铺招牌。中央大标题以粗体窄宋体清晰写“夜间营业”，颜色 #C43A2F；正下方小字写“周五至周日 · 18:00—01:00”，深炭灰色。细线边框为 #1F6B55，间距均匀，正面产品摄影，无其他文字。
NOTES: Exact text, role, hierarchy and object-bound hex colors.

## Expert mistakes

- Writing negatives for FLUX.2 instead of positive end states.
- Burying the subject after long camera/style lists.
- Using hex codes without binding each to an object.
- Overusing JSON for simple scenes or natural prose for complex multi-object binding.
- Assuming API prompt upsampling exists in local klein.
- Promising exact limb geometry or viewpoint from text alone when the selected workflow has no structural reference.

## Validator suggestions

- Require subject/action within first 20 words; target 30–80 total.
- FLUX.2: reject separate negative prompt; warn on `no|without|avoid` and suggest positive rewrite (except exact phrases like “no other text” may remain as a text-layout guard).
- Text tasks require quoted copy + placement + font/style; hex codes must be adjacent to a named object.
- Warn on >3 unrelated style labels.
- Klein strict mode: require at least subject, action, style/medium, context/light.
- If intent contains `exact pose|same pose|match stance|precise limb|reference pose`, require a pose/layout reference or downgrade the result to best effort. For multiple references, require one explicit role per image.

## Sources

- [BFL FLUX prompting guide](https://docs.bfl.ai/guides/prompting_summary) — [OFFICIAL], accessed 2026-08-15.
- [FLUX.2 detailed guide](https://docs.bfl.ai/guides/prompting_guide_flux2) — [OFFICIAL], accessed 2026-08-15.
- [FLUX.2 overview](https://docs.bfl.ai/flux_2/flux2_overview) — [OFFICIAL], accessed 2026-08-15.
- [FLUX.2 text-to-image docs](https://docs.bfl.ai/flux_2/flux2_text_to_image) — [OFFICIAL], accessed 2026-08-15.
- [BFL Pose & Layout Guidance](https://docs.bfl.ai/guides/usecases_editing_controlnets) — [OFFICIAL], accessed 2026-08-15.
- [GenSpace benchmark](https://openreview.net/pdf?id=zyBG1j339A) — [TESTED/PAPER], accessed 2026-08-15.

---

## 2026-09 sweep (agent 1C)

All URLs accessed **2026-09-03**. Targets: FLUX.2 **klein** encoder-mismatch symptoms (Qwen3 vs Mistral),
the diffusers "no string→negative path" issue status, BFL prompting-guide changes since Aug 2026, klein
**Base** (non-distilled) variants where a real negative could work, and the source of the 30–80-word band.
Nothing above this line was altered.

### New official guidance

**1. BFL restructured the prompting guide. Our two cited guide URLs are now the wrong ones to teach from.**
`[OFFICIAL]` <https://docs.bfl.ai/llms.txt>. `docs.bfl.ai/guides/prompting_guide_flux2` still resolves but
is now titled **"Prompting Guide - FLUX.2 [pro] & [max]"** — a tier-specific page. The general guidance
moved to a **unified** set: `prompting_unified_basics`, `prompting_unified_building`,
`prompting_unified_style`, `prompting_unified_technical`, `prompting_unified_reference`,
`prompting_unified_usecases`, plus per-use-case pages (`usecases_t2i_hex_color_prompting`,
`usecases_t2i_json_prompting`, `usecases_t2i_multi_language`, `usecases_t2i_typography_design`,
`usecases_editing_*`). **Update the Sources block to the unified pages.** BFL's release notes carry no
dated entry for the restructure, so it cannot be version-stamped; the newest release note of any kind is
**2026-08-27** (Auto Top-Up for credits) and **no release note between 2026-08-15 and 2026-09-03 concerns
prompting** (<https://docs.bfl.ai/release-notes>).

**2. The 30–80-word band is `[OFFICIAL]` and survives the restructure, but the long band changed.**
`[OFFICIAL]` `prompting_unified_building` (<https://docs.bfl.ai/guides/prompting_unified_building>),
verbatim:

> FLUX.2 supports prompts up to 32K tokens.

| Length     | Words   | Best For                                              |
| ---------- | ------- | ----------------------------------------------------- |
| **Short**  | 10-30   | Quick concepts, fast iteration, style exploration     |
| **Medium** | 30-80   | Most scenes and everyday prompting                    |
| **Long**   | 80-300+ | Complex multi-subject scenes or very directed outputs |

> "Start short. Add only what changes the image. More words do not automatically mean better results."

The old page's "Long (80+ words)" is now bounded as **80–300+**, and the **32K-token** capacity statement
is new. ⚠ **That 32K figure is about the model, not about your runtime** — diffusers'
`Flux2KleinPipeline` defaults to `max_sequence_length=512` with `truncation=True` (item 7). Teach the
32K claim only with that caveat.

**3. BFL now publishes a slot template, not a prose instruction.** `[OFFICIAL]` same page, verbatim:

```
[SUBJECT], [LOCATION],
[STYLE], [CAMERA SETTINGS], [LIGHTING], [COLORS], [EFFECT],
[ADDITIONAL ELEMENTS]
```

> "This is a prompt-building aid, not a rule. You do not need every slot every time."

with a nine-row component table (Image type · Subject · Location · Style · Camera settings · Lighting ·
Colors · Effect · Additional elements) and a four-step worked build that is a **comma-run**, not a
sentence: `portrait, a young woman with curly red hair, in a bustling city street, fashion editorial
photography, 85mm lens, soft golden hour light, warm amber and charcoal tones, subtle film grain,
wind-blown hair and blurred city lights`. `[SYNTHESIS]` This matters for the corpus's biggest open split:
**BFL's own current guidance is slot-ordered comma phrases, not prose grammar.** The old
Subject+Action+Style+Context framing is still on the pro/max page; both are official and they now coexist.

**4. An official order-matters demonstration, quotable and paired with images.** `[OFFICIAL]` same page,
under Framing, verbatim:

> "Prompt order matters here too. If FLUX keeps pulling too far back, make the subject clear first and move
> environmental details later in the sentence."
>
> This version can lead to a wider scene than intended:
> `Person standing inside a forest fire, strong determined attitude, close-up shot, realistic`
>
> This rewrite usually gives you more control:
> `Person with a strong determined expression, forest fire in the background, close-up shot, realistic`

Same word set, different order, different framing — vendor doc with paired examples. Not `[TESTED]` (no
seeds, no grid), but it is the cleanest official statement of the rule we have.

**5. BFL softened the no-negatives line.** `[OFFICIAL]` `prompting_unified_technical`
(<https://docs.bfl.ai/guides/prompting_unified_technical>), verbatim:

> "**Most FLUX models do not support negative prompts.** Even when they can process them, AI models
> generally struggle with negation — writing *"a person without glasses"* causes the model to focus on
> "glasses" and often generate exactly what you were trying to avoid."

Compare the older, absolute claim still live on the pro/max page: *"**No negative prompts**: FLUX.2 does
not support negative prompts."* **Keep both.** The new wording is materially different — "most models",
and an explicit "even when they can process them" — which is consistent with what the code shows for
klein **Base** (item 8). The same page ships a replacement table worth lifting wholesale into the app:

| Instead of...        | Write...                                       |
| -------------------- | ---------------------------------------------- |
| "no people"          | "empty", "deserted", "solitary"                |
| "no colors"          | "monochrome", "black and white", "grayscale"   |
| "no text"            | "clean surfaces", "unmarked", "blank"          |
| "no modern elements" | "traditional", "historical", "period-accurate" |
| "not dark"           | "brightly lit", "sun-drenched"                 |
| "not many"           | "few", "single", "minimal"                     |

plus a three-step procedure — *"1. **Identify** the unwanted element… 2. **Ask** what would fill that
space… 3. **Describe** the positive"* — and the escalation ladder when positives fail: *"1. Be more
specific… 2. **Front-load the positive description — word order signals priority**… 3. Add more descriptive
detail… 4. Use environmental context."*

**6. klein-specific official statements, refreshed.** `[OFFICIAL]`
<https://docs.bfl.ai/flux_2/flux2_overview> and the model cards:

- *"FLUX.2 [klein] does not include prompt upsampling. Write detailed, descriptive prompts for best
  results."* and, on the technical page, *"On FLUX.2 [klein], **what you write is what you get** — be
  descriptive. Other FLUX.2 variants are more forgiving with short prompts."* (Corpus line 43 confirmed.)
- **Multi-reference caps, verbatim table**: **[klein] Up to 4**; [max]/[pro]/[flex] up to 8 API / 10
  playground; **[dev] "Recommended max 6"**. The corpus's "about six references" is a *dev* number and
  must not be applied to klein.
- klein **9B** was launched with, verbatim, *"Balanced quality and speed with **8B Qwen3 text embedder**"*
  (<https://docs.bfl.ai/release-notes>, 2026-01-15). klein launched **2026-01-15**.
- VRAM: BFL's docs and both model cards say klein 4B *"fits in ~13GB VRAM"* / *"as little as 13GB VRAM"*,
  while the **inference repo README says "Klein 4B fits in ~8GB VRAM"**
  (<https://github.com/black-forest-labs/flux2>). ⚠ **An internal BFL contradiction; record both.** Neither
  figure is the Q4 GGUF number (~2.6 GB) the Krea addendum quotes.
- Licences unchanged: **4B = Apache 2.0**, **9B = FLUX Non-Commercial License**; *"Filters or manual review
  **must** be used with the FLUX.2 [klein] 9B models under the terms of the FLUX Non-Commercial License"*
  (model card, Responsible AI §5) — a real obligation, like Krea 2's.
- New family member not in the corpus: **[klein] 9B KV** (`flux-2-klein-9b-kv`), *"faster than 4B for
  multi-reference image editing via KV caching"*. Also **FLUX Erase** is *"powered by FLUX.2 Klein 9B"*.
- **FLUX.2 LoRA inference is in public beta on the API since 2026-04-23**, covering *"FLUX.2 [klein] 4B,
  9B, and **Base variants** in FP8, plus a BF16 option"*, via `-finetuned` endpoints with `finetune_id` +
  `finetune_strength`. There are also two official klein LoRA-training guides
  (`flux2_klein_training`, `flux2_klein_training_example`) the corpus does not cite.
- Out of scope but for the closed-tier register: **FLUX 3 is live on the API** (announced 2026-07-23,
  video+audio preview 2026-08-04, up to 20 s FHD 24 fps; `v2v` capped at 15 s since 2026-08-17) with
  *"open-weight access to a multimodal backbone"* listed as a later rollout phase.

### Chinese sources

- **BFL's multi-language guidance is unchanged and still does not privilege Chinese.** `[OFFICIAL]`
  `prompting_unified_technical`/`prompting_guide_flux2`, verbatim: *"Prompting in the native language of
  the content you're creating often produces more culturally authentic results — local markets,
  architecture, and atmosphere are rendered with greater accuracy."* The worked examples are **French,
  Thai, Korean** (`Un marché alimentaire dans la campagne normande`;
  `ตลาดอาหารเช้าในชนบทใกล้กรุงเทพฯ`; `서울 도심의 옥상 정원, 저녁 노을이 지는 하늘`). **No Chinese example
  appears on any BFL prompting page fetched this sweep.** The corpus's line 19 ("official examples
  encourage French for Parisian scenes and Japanese for anime") is directionally right; the *Japanese*
  example is on the older pro/max page's best-practices accordion, the three rendered examples are the
  three above.
- **Nothing Chinese-language and klein-specific was found**, on {docs.bfl.ai (no /zh edition exists),
  github.com/black-forest-labs/flux2, HF black-forest-labs cards, WebSearch}. The corpus's existing
  position — Chinese only for Han glyphs and Chinese cultural objects, English for camera vocabulary —
  is unchanged and unchallenged. 知乎/Bilibili not reachable from this environment (US-only search index).

### Tested findings

**7. The encoder mismatch is real, is `[OFFICIAL]` at code level, and the symptom is NOT a black image —
it is a matmul shape error.** This answers the brief's open question.

`[OFFICIAL]` diffusers `Flux2KleinPipeline`
(<https://github.com/huggingface/diffusers/blob/main/src/diffusers/pipelines/flux2/pipeline_flux2_klein.py>)
imports `Qwen2TokenizerFast, Qwen3ForCausalLM`, documents `text_encoder ([Qwen3ForCausalLM])`, and taps
three hidden layers:

```python
max_sequence_length: int = 512,
hidden_states_layers: list[int] = (9, 18, 27),
...
text = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True, enable_thinking=False)
inputs = tokenizer(text, padding="max_length", truncation=True, max_length=max_sequence_length)
...
out = torch.stack([output.hidden_states[k] for k in hidden_states_layers], dim=1)
prompt_embeds = out.permute(0, 2, 1, 3).reshape(batch_size, seq_len, num_channels * hidden_dim)
```
`self.tokenizer_max_length = 512`.

`[OFFICIAL]` **FLUX.2 [dev]**, by contrast, uses Mistral: the BFL repo README says its prompt upsampler
runs *"with the same model we use for text encoding
([`Mistral-Small-3.2-24B-Instruct-2506`](https://huggingface.co/mistralai/Mistral-Small-3.2-24B-Instruct-2506))"*,
and ComfyUI's own Flux 2 example page tells you to download **`mistral_3_small_flux2_fp8.safetensors`**
(<https://comfyanonymous.github.io/ComfyUI_examples/flux2/>). **That page covers dev only and never
mentions klein** — which is precisely how students end up pairing klein with Mistral.

`[USER-VERIFIED — multiple reporters, thread closed as resolved]`
<https://huggingface.co/unsloth/FLUX.2-klein-4B-GGUF/discussions/1> (Jan 2026). Verbatim symptoms and
resolution:

> `realrebelai`: "i cannot get the mistral small 3 fp8 text encoder to work at all with any of the ggufs or
> the full model. im not sure why because it works with the flux 2 dev gguf but not this." … "fails right
> at the step count on all of them" … "**mat1 and mat2 shape error.**"

> `doublemathew`: "These models do not use mistral. the 4b klein uses Qwen3-4B and 9b uses Qwen3-8B" …
> "flux2 klein 4b with qwen3 4b, and flux2 klein 9b with qwen3 8b, should work."

> `Lambda-7C0`: "4b is fine! 8b - gives an error! **SamplerCustomAdvanced mat1 and mat2 shapes cannot be
> multiplied (512x12288 and 7680x3072)**"

`[SYNTHESIS]` That error string decodes exactly against the code above and is worth teaching as a
diagnostic: **512** = the token cap; **12288 = 3 layers × 4096** (Qwen3-**8B** hidden size); **7680 = 3 ×
2560** (Qwen3-**4B** hidden size) is what the 4B DiT's projection expects. So:

- **Correct pairing is size-matched Qwen3: klein 4B ↔ Qwen3-4B, klein 9B ↔ Qwen3-8B.** Mixing the two
  Qwen3 sizes fails the same way as using Mistral.
- **The failure is loud, not silent** — a `mat1/mat2` mismatch at the sampler, usually reported as "fails
  right at the step count". **No source found anywhere that a wrong text encoder produces a black image on
  klein.** The corpus/brief's "black images?" hypothesis is **not supported**; the one black/broken-preview
  remedy in that thread is unrelated (*"change the preview method from auto to none"*).
- Related open ComfyUI feature request: **#12032**, *"[Feature Request] Add `clip_target()` support for
  Flux2 AIO checkpoints (Klein/Qwen3 + Mistral)"* — ComfyUI cannot auto-detect which encoder an
  all-in-one FLUX.2 checkpoint carries. (Title only; issue body not fetched.)
- Incidental `[LORE]` from the same thread, recorded not endorsed: *"the anatomy knowledge sucks for flux
  models again vs qwen image and z image models."*

**8. The "no string→negative path" defect is CONFIRMED, and it belongs to klein alone.**
`[OFFICIAL — code, verified 2026-09-03]` In `Flux2KleinPipeline.__call__` the negative is **hardcoded to
the empty string** and the parameter is mis-typed:

```python
negative_prompt_embeds: str | list[str] | None = None,       # annotation says str; the docstring says Tensor
...
if self.do_classifier_free_guidance:
    negative_prompt = ""
    if prompt is not None and isinstance(prompt, list):
        negative_prompt = [negative_prompt] * len(prompt)
    negative_prompt_embeds, negative_text_ids = self.encode_prompt(prompt=negative_prompt, ...)
```
docstring, verbatim: *"negative_prompt_embeds (`torch.Tensor`, *optional*): Pre-generated negative text
embeddings. **Note that "" is used as the negative prompt in this pipeline.** If not provided, will be
generated from ""."*

There is **no `negative_prompt` string argument at all** — `encode_prompt` does not accept one. The only
way to supply a negative is to precompute the embedding tensor yourself. Issue **#13416**
(<https://github.com/huggingface/diffusers/issues/13416>) is **still open, zero comments, label "bug",
opened 2026-04-04, unanswered at 2026-09-03**.

**Correction to the 08-28 digest (contradiction #3):** it reported the same defect for `ZImagePipeline`.
That is **wrong** — `ZImagePipeline` does take a `negative_prompt` string and encodes it (see
`research/z-image.md`, this sweep). The defect is klein's only.

**9. klein Base is where a real negative would work — and that is exactly where diffusers denies you one.**
`[OFFICIAL]` The BFL repo publishes the distillation matrix, verbatim
(<https://github.com/black-forest-labs/flux2>):

| Name | Step-distilled | Guidance-distilled | License |
| :--- | :---: | :---: | :---: |
| FLUX.2 [klein] 4B | ✅ | ✅ | apache-2.0 |
| FLUX.2 [klein] 9B | ✅ | ✅ | FLUX NCL |
| FLUX.2 [klein] 9B KV | ✅ | ✅ | FLUX NCL |
| **FLUX.2 [klein] 4B Base** | ❌ | ❌ | apache-2.0 |
| **FLUX.2 [klein] 9B Base** | ❌ | ❌ | FLUX NCL |
| FLUX.2 [dev] | ❌ | ✅ | FLUX NCL |

> "**Distilled vs Base:** Use **Distilled** (4-step) for production apps and real-time generation. Use
> **Base** (50-step) for fine-tuning, LoRA training, and maximum flexibility"

Model-card snippets confirm the practical consequence: klein 4B runs `guidance_scale=1.0,
num_inference_steps=4`; **klein-base-4B runs `guidance_scale=4.0, num_inference_steps=50`**
(<https://huggingface.co/black-forest-labs/FLUX.2-klein-base-4B>), described as *"Trained without step or
guidance distillation"* with *"Higher output diversity than the distilled models"*. Base variants are
*"not offered on the public API"* (open weights only).

And the pipeline honours that: `do_classifier_free_guidance` is
`self._guidance_scale > 1 and not self.config.is_distilled`, plus a guard —
`if guidance_scale > 1.0 and self.config.is_distilled: logger.warning("Guidance scale ... is ignored for
step-wise distilled models.")`. `[SYNTHESIS]` **So on klein Base a genuine unconditional branch is
computed at guidance 4.0 — a negative prompt is architecturally live — but diffusers pins that branch to
`""`.** This is the corpus's cleanest example of the cross-model rule "negatives are a function of
guidance, not of the model", plus a tooling bug sitting on top of it. Note also
`Flux2KleinPipeline.__init__` takes an `is_distilled: bool = False` flag written into the config, so a
mislabelled local checkpoint silently changes whether guidance applies at all.

Also: klein's chat template is applied with **`enable_thinking=False`**, whereas Z-Image's uses
`enable_thinking=True` — a concrete, code-level dialect difference between two Qwen3-encoder models.
`[SPECULATION]` Krea 2's assistant-`<think>` steering trick (see the Krea addendum, this sweep) therefore
has no obvious klein analogue through the normal path.

**10. The order-vs-prose question now has hard `[TESTED]` evidence, and FLUX.2 klein-4B was one of the
models tested.** `[TESTED/PAPER]` **"Text-to-Image Models Need Less from Text Encoders Than You Think"**,
Spingarn, Cohen, Rott Shaham (MIT CSAIL) & Michaeli (Technion), arXiv **2606.03715** v1, 2026-06-02
(<https://arxiv.org/html/2606.03715>). Method, verbatim: *"We study how pretrained transformer-based
diffusion models react to our contextless embeddings, focusing on SD 3, **FLUX.1 Schnell**, and **FLUX.2
Klein-4B**. We use prompts from the DrawBench, GenEval, and the MS-COCO 2014 validation set"* — five
images per prompt on DrawBench/GenEval, one on MSCOCO, judged blind three-way by **Gemma-3** as VLM
evaluator, cross-checked with CLIP score / FID / KID (*"These show the same trends"*). Three ablated
embeddings: **BoT** (token identities only), **BoW** (words, no order), **BoPTW** (words + absolute word
position, still no context).

Findings that bear directly on our doctrine, verbatim:

> "The two prompts in each pair comprise the same set of words, only in a different order. Although the
> BoPTW embedding of each word in the prompt lacks any context from the other words, all the examined
> models succeed in disambiguating the prompt meanings from those embeddings."

> "even the simplest BoT embeddings already achieve a non-inferiority score that exceeds 40% for most
> experimental settings… Nevertheless, the non-inferiority rate of the BoT embeddings usually remains
> below 50%"

> "**Still, a noticeable discrepancy persists for FLUX.2, suggesting that this model remains sensitive to
> the loss of richer contextual structure in the embedding space.**"

> "The BoPTW embeddings … lead to a non-inferiority rate that reaches 65% for most models and datasets,
> coming close to the non-inferiority rate of the full embedding, which is between 70%-90%"

> "for the prompt 'A sculpture of two women sitting on a bench with their purses on the ground while people
> standing in a line behind them,' capturing the full structure of the scene requires both word-level and
> positional information. Only when both are incorporated (using the BoPTW embedding) does the image model
> successfully infer the intended relationships"

> "We find that unlike DiTs, these U-Net based models completely fail to generate images with contextless
> embeddings. Specifically, with SD 2.1, the non-inferiority rate is 0.2%, and with SDXL it is 4%."

Category breakdown, verbatim and load-bearing for the app: on GenEval **"Single object"** BoPTW scores
*"88%, 90%, and 100% with SD 3, FLUX.1, and FLUX.2, respectively"*; on DrawBench **"Text"** it scores only
*"27%, 37%, and 24%"*.

`[SYNTHESIS]` What this licenses us to say, and what it does not:

- **"Front-load the subject / order carries emphasis" is now our best-evidenced prompting rule** — paired
  same-word-set / different-order prompts resolve correctly from identity + position alone, on klein
  specifically, plus BFL's own framing rewrite (item 4).
- **"Write prose because the encoder is an LLM" is weakened but not refuted, and least so for klein.**
  FLUX.2 is the model the paper singles out as *still* sensitive to losing context, and full embeddings
  keep a 70–90% vs 65% edge. For **simple single-subject** prompts context buys almost nothing; for
  **relational multi-object** scenes and above all for **text-in-image**, context is what carries it. So
  the honest teaching split is **by task, not by model**: comma-run slot lists are fine for a single
  subject; write real relational sentences for spatial/multi-object scenes and for typography.
- **This is DiT-only.** SDXL and SD 2.1 collapse without context (4% / 0.2%). Do not let the rule leak into
  the SDXL dialect — there the text encoder really is doing the linguistic work.
- Scope limits to state: image models only (no video), no Z-Image and no Krea 2 in the model set, one
  paper version, and the judge is an LLM rather than humans.

### Contradicts current corpus

1. **Line 47's flat "FLUX.2 does not support negative prompts" is now only half of BFL's own position.**
   The current unified page says *"Most FLUX models do not support negative prompts. Even when they can
   process them…"*. Both are official; quote the newer one and add the mechanism (item 9).
2. **08-28 contradiction #3 over-reached.** `ZImagePipeline` is not affected; the defect is
   `Flux2KleinPipeline`'s alone. Any fold-in item that says "the same bug wearing a third hat" needs
   rewriting.
3. **Line 10's "about six references" is a `[dev]` figure.** klein's official cap is **4**.
4. **Line 10's "klein 4B/9B is step-distilled at four steps and has base undistilled variants" is correct
   but incomplete** — the distilled klein models are *also* **guidance-distilled**, which is the reason
   guidance (and therefore any negative) is ignored on them. Add the matrix from item 9.
5. **Line 8's "long 80+ words" is superseded by "80–300+"**, and the new 32K-token capacity line must be
   paired with the diffusers 512-token default or it will mislead.
6. **Our Sources block cites two guide URLs that are no longer the general guidance** (item 1).
7. **The `research/_addenda/krea-character-art.md` §5 comparison row for klein ("~2.6 GB Q4 GGUF, 4 steps,
   Apache 2.0") should note BFL's own figures** — 13 GB (docs/model cards) or 8 GB (repo README) unquantised
   — so the class does not think 2.6 GB is the vendor number.
8. **The 08-28 digest's framing of arXiv 2606.03715 ("names FLUX.2's Qwen encoder as the assumption it
   questions") understates it: the paper *tested* FLUX.2 klein-4B, and found it the most
   context-sensitive of the three DiTs.** That flips the emphasis of recommended-incorporation #4: promote
   order, yes, but the demotion of "prose grammar matters" should be **task-scoped**, and for klein
   typography work prose is *more* important than the digest implies.
9. **A new klein trap the corpus does not warn about:** ComfyUI's official Flux 2 example page hands you
   `mistral_3_small_flux2_fp8.safetensors` and never mentions klein, so following official docs produces a
   `mat1/mat2` mismatch. Add it to Expert mistakes.

### Few-shot gold (new pairs)

### Pair 5 — klein, slot-ordered single subject [OFFICIAL-PATTERN]
INTENT: A directed portrait on klein 4B, written in BFL's current slot template with the subject first.
PROMPT-EN:
Portrait, a lighthouse keeper in her sixties with deep crow's feet and cropped grey hair, on a wet basalt
jetty at the end of a storm, documentary editorial photography, 85mm lens at f/2, hard low sun breaking
through cloud from camera right, palette of slate grey, oxidised copper and pale sea green, fine salt spray
and film grain, wind-flattened oilskin collar and gulls low behind her.
NOTES: One comma-run through `[SUBJECT], [LOCATION], [STYLE], [CAMERA SETTINGS], [LIGHTING], [COLORS],
[EFFECT], [ADDITIONAL ELEMENTS]` — 62 words, inside BFL's "Medium 30-80" band and well inside the 512-token
default. klein has **no prompt upsampling**, so every slot you skip stays unspecified. Run: klein 4B,
4 steps, `guidance_scale=1.0` (guidance is ignored anyway — distilled); **no negative field** —
`Flux2KleinPipeline` pins it to `""`. Untested.

### Pair 6 — klein Base, relational scene with a working guidance scale [OFFICIAL-PATTERN]
INTENT: A multi-object spatial scene on klein **Base** 4B, where CFG is real — written as relational
sentences rather than a comma-run, because arXiv 2606.03715 shows relational structure is exactly where
context still pays.
PROMPT-EN:
A brass orrery stands on a walnut desk beside a half-drunk cup of tea, its rings tilted so the small gilt
sun sits directly above the cup. Behind the desk, tall sash windows throw long parallel shadows across the
floorboards toward the viewer, and a folded map lies on the left edge of the desk with one corner hanging
over the side. Late afternoon light, warm brass and cool blue-grey shadows, sharp focus throughout, clean
uncluttered surfaces, muted period-accurate interior photography.
NOTES: Every spatial relation is stated with an explicit anchor (`beside`, `directly above`, `behind`,
`toward the viewer`, `on the left edge`, `hanging over the side`). Exclusions are positive per BFL's
replacement table — `sharp focus throughout`, `clean uncluttered surfaces`, `period-accurate` rather than
"not blurry / no clutter / no modern elements". Run: `black-forest-labs/FLUX.2-klein-base-4B`,
`num_inference_steps=50`, `guidance_scale=4.0` (the model card's own values). ⚠ A real negative is
architecturally live here but **diffusers gives you no way to type one** — the only route is precomputing
`negative_prompt_embeds`. Untested.

### Validator changes

- **Encoder pairing check (new, high value).** For any FLUX.2 workflow, require the text encoder to match
  the checkpoint: **klein 4B → Qwen3-4B; klein 9B / 9B KV → Qwen3-8B; klein Base 4B/9B → the same Qwen3 as
  their distilled twin; FLUX.2 dev → Mistral-Small-3.2-24B**. If mismatched, emit the diagnostic verbatim:
  "expect `mat1 and mat2 shapes cannot be multiplied` at the sampler — this is an encoder mismatch, not
  OOM and not a bad prompt."
- **Token budget.** Warn above **480 tokens**; note that BFL's "32K tokens" is a model capability and the
  diffusers/ComfyUI default is `max_sequence_length=512` with silent truncation. Word-band targets stay
  30–80 (medium) with 80–300 allowed for genuinely complex scenes.
- **Negative handling, split by variant.** Distilled klein (4-step): **reject** a negative field outright
  and explain guidance distillation. klein **Base**: allow the *concept* of a negative but warn that
  `Flux2KleinPipeline` has no string path, so a typed negative will be **silently ignored** — offer the
  positive rewrite instead. FLUX.2 dev/API: reject as today.
- **Guidance gate.** Distilled klein → `guidance_scale` 1.0 (anything >1 logs "ignored"). klein Base →
  4.0 / 50 steps. flex → 1.5–10, ≤50 steps.
- **Reference count.** klein: max **4** references; dev: warn above 6; pro/max/flex: 8 (10 in playground).
- **Task-scoped structure rule (new, from arXiv 2606.03715).** If the intent is a **single subject** or a
  style study, a slot-ordered comma run is fine. If it contains a **spatial relation between two or more
  objects**, or **any visible text**, require full relational sentences and flag comma-tag input:
  "contextless / tag-style prompts lose the most on exactly this category (DrawBench Text: 24%
  non-inferiority on FLUX.2)."
- **Do not apply the order-over-prose rule to SDXL targets** — U-Net models score 0.2–4% without context.

### Nothing-found register

- **No evidence anywhere that a wrong text encoder yields a *black image* on klein.** Surfaces searched:
  HF `unsloth/FLUX.2-klein-*-GGUF` discussions, WebSearch, ComfyUI issue titles, diffusers pipeline source,
  BFL docs and repo. The observed symptom is a `mat1/mat2` matmul mismatch at the sampler. The "black
  image" hypothesis in the brief is **unsupported** and should be retired.
- **BFL publishes no local prompt-rewriter system prompt.** Re-checked: `prompt_upsampling` is documented
  as a behaviour only, klein has none at all, and dev's upsampler is *"the same model we use for text
  encoding"* (Mistral-Small-3.2-24B) driven by a prompt BFL does not publish. The corpus's
  "nothing public found" **stands after a second attempt**.
- **No dated changelog entry for the prompting-guide restructure**; `docs.bfl.ai/release-notes` has no
  prompting entry between 2026-08-15 and 2026-09-03.
- **No Chinese example on any BFL prompting page**; no `/zh` edition of docs.bfl.ai.
- **No follow-up paper to arXiv 2606.03715 found** on {arXiv search, HF papers page, WebSearch}. Only v1
  (2026-06-02) exists as far as we can see; the project page
  `https://nsping13.github.io/contextless-TTI/` was **not** fetched (budget). No paper found that runs the
  same ablation on **Z-Image, Krea 2 or Qwen-Image**.
- **ComfyUI issue #12032** (`clip_target()` for Flux2 AIO checkpoints) — **title only**, body not fetched.
- **`docs.bfl.ai/flux_2/flux2_lora_inference`, `flux2_klein_training`, `flux2_klein_training_example`,
  `prompting_unified_basics`, `prompting_unified_style`, `prompting_unified_reference`** — identified in
  `llms.txt`, **not fetched** this sweep. Next run.
- **`api.github.com` returns an empty body for every request in this environment**; the 2026-09 plan's
  "prefer api.github.com JSON" note is stale. HTML issue pages fetch fine. **`web.archive.org` is
  blocked.** **Reddit remains unreachable.**
- **No `[STAFF]` (named BFL employee) claim obtained.** BFL has no HF discussion presence on the klein
  repos that we could read, and the flux2 repo has no maintainer Q&A thread we located.

### Sources

`[OFFICIAL]`
- BFL docs index (guide restructure, full page list) — <https://docs.bfl.ai/llms.txt>
- Building a Good Prompt — 32K tokens, length bands, slot template, the order-matters framing rewrite — <https://docs.bfl.ai/guides/prompting_unified_building>
- Technical Parameters — the softened negative-prompt statement, replacement table, klein "what you write is what you get" — <https://docs.bfl.ai/guides/prompting_unified_technical>
- Prompting Guide – FLUX.2 [pro] & [max] (the former general guide; still carries "FLUX.2 does not support negative prompts", JSON/hex/multi-language) — <https://docs.bfl.ai/guides/prompting_guide_flux2>
- FLUX.2 overview — model matrix, klein multi-reference cap 4, 13 GB VRAM, Base variants, preview endpoints, no prompt upsampling on klein — <https://docs.bfl.ai/flux_2/flux2_overview>
- BFL release notes — klein launch 2026-01-15 with "8B Qwen3 text embedder", LoRA inference beta 2026-04-23, FLUX 3 timeline, newest entry 2026-08-27 — <https://docs.bfl.ai/release-notes>
- BFL `flux2` inference repo — distillation matrix, "Base (50-step)", ~8 GB VRAM claim, Mistral-Small-3.2-24B as dev's encoder/upsampler — <https://github.com/black-forest-labs/flux2>
- FLUX.2 [klein] 4B model card (distilled: `guidance_scale=1.0`, 4 steps) — <https://huggingface.co/black-forest-labs/FLUX.2-klein-4B>
- FLUX.2 [klein] 4B **Base** model card (undistilled: `guidance_scale=4.0`, 50 steps; "Trained without step or guidance distillation") — <https://huggingface.co/black-forest-labs/FLUX.2-klein-base-4B>
- diffusers `Flux2KleinPipeline` source — Qwen3 encoder, layers (9,18,27), `max_sequence_length=512`, `enable_thinking=False`, hardcoded `""` negative, `is_distilled` guard — <https://github.com/huggingface/diffusers/blob/main/src/diffusers/pipelines/flux2/pipeline_flux2_klein.py>
- diffusers issue #13416 — open, zero comments, label "bug", opened 2026-04-04 — <https://github.com/huggingface/diffusers/issues/13416>
- ComfyUI official Flux 2 example page (dev-only; hands out the Mistral encoder) — <https://comfyanonymous.github.io/ComfyUI_examples/flux2/>

`[TESTED/PAPER]`
- "Text-to-Image Models Need Less from Text Encoders Than You Think", arXiv 2606.03715 v1, 2026-06-02 — BoT/BoW/BoPTW ablation on SD 3, FLUX.1 Schnell, **FLUX.2 Klein-4B** (+SDXL, SD 2.1) — <https://arxiv.org/abs/2606.03715> · HTML: <https://arxiv.org/html/2606.03715>

`[USER-VERIFIED]`
- `unsloth/FLUX.2-klein-4B-GGUF` discussion #1 (Jan 2026, closed) — the Mistral-on-klein failure, the `mat1/mat2` error string, the size-matched Qwen3 pairing — <https://huggingface.co/unsloth/FLUX.2-klein-4B-GGUF/discussions/1>
