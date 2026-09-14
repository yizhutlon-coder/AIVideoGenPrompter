# Z-Image family research brief

Research baseline: 2026-08-15. Scope: Z-Image-Turbo and Z-Image base. Omni-Base and Edit are documented family members but their official checkpoints remain unreleased.

## Official guidance

- [OFFICIAL] Z-Image is a 6B bilingual image family. Turbo is distilled, photorealistic, strong at Chinese/English text and runs at 8 NFEs. Base is diverse, controllable and supports effective negatives. Omni-Base and Edit are described in the architecture/model-zoo table, but both download columns say “To be released.” [Repository](https://github.com/Tongyi-MAI/Z-Image)
- [STAFF, 2025-11-27] Turbo works best with long detailed prompts. Its default maximum is 512 tokens; local users can set 1024. Prompts of 600–1000 words exceed the default and may truncate. [HF staff discussion](https://huggingface.co/Tongyi-MAI/Z-Image-Turbo/discussions/8)
- [OFFICIAL] Turbo recipe: 9 scheduler steps ≈8 DiT forwards, guidance 0. Base: 28–50 steps, CFG 3–5, negatives strongly recommended, CFG normalization off for general stylism and on for realism.
- [OFFICIAL] Natural descriptive prose is the supported dialect; official examples precisely enumerate subject, clothing, objects, text, environment, light and photographic style.

## Rewriter system prompts (verbatim)

Canonical archived prompt enhancer: [`pe.py`](https://huggingface.co/spaces/Tongyi-MAI/Z-Image-Turbo/blob/main/pe.py), linked by Z-Image staff. The public space/source state changed over time; preserve that URL as canonical. Short fingerprint from staff guidance:

```text
“works best with long and detailed prompts”
```

Full third-party system text is not duplicated. Status: canonical location identified; archived body not reliably retrievable through the research index.

## Chinese prompting

- [OFFICIAL] Chinese and English text rendering are headline capabilities. Base's official inference example is a native Chinese descriptive paragraph, direct evidence that Chinese is first-class.
- Chinese wins for exact Han glyphs, Chinese calligraphy/font vocabulary, architecture/clothing names, and compact culturally native aesthetics: `绢本设色`, `工笔重彩`, `水墨写意`, `宋体`, `隶书`, `飞白`, `留白构图`, `青绿山水`.
- English remains useful for international camera/product vocabulary; mixed prompts work best when each language has a role, not sentence-by-sentence duplication.
- Native examples [SYNTHESIS]: `绢本设色的青绿山水册页，峰峦层叠，云气留白，江面一叶扁舟`; `雨夜成都街巷，湿润青石板反射红灯笼暖光，纪实摄影`; `海报中央用遒劲行书写“山河入梦”，朱砂印章位于右下角，无其他文字`.

## Motion / composition control

Composition control follows relational prose: subject/count → appearance/action → objects and exact positions → background → light/style. For text, provide exact quoted copy, carrier, layout, typeface, color and “no other text.” Base supports negatives for cleanup; Turbo does not.

- [TESTED/PAPER] GenSpace includes Z-Image's peer local models and documents a broad limitation of current text-to-image systems: text alone is unreliable for exact camera/object orientation and difficult spatial frames of reference. No official Z-Image pose-control workflow was found in this pass. Treat prompt-only pose/layout as approximate unless the host app supplies a compatible structural adapter. [GenSpace](https://openreview.net/pdf?id=zyBG1j339A)

Failure fixes:

- Similar outputs: vary composition/lens/layout materially; seed alone may not diversify a highly detailed distilled prompt [STAFF discussion].
- Attribute bleed: repeat attributes beside their object and state relative positions.
- Chinese text errors: keep exact glyphs quoted; reduce text length; specify line breaks and font.
- Overstuffed prompt: remain below active 512-token cap or deliberately raise `max_sequence_length` locally.

## Verbosity calibration

- Turbo: official staff says long/detailed; hard technical default 512 tokens, optional 1024. Recommended practical band 80–300 English words or 120–500 Han characters [SYNTHESIS], leaving headroom.
- Base: detailed prose, but 60–220 words generally covers composition without truncation [SYNTHESIS].
- Load-bearing: concrete identity, clothes/material, pose, count, location, spatial relation, light, lens/style, exact text. Noise: repeated ultra-HD tags, free-floating moods, 600+ words under 512-token default.

## Negatives & guidance

- Turbo: no CFG and no negative prompts [OFFICIAL/STAFF]. Validator should reject a Turbo negative field and force guidance 0.
- Base: negatives strongly recommended; guidance 3–5, 28–50 steps. Use targeted unwanted anatomy, artifacts, extra objects, unwanted text, or style rather than generic mega-lists.
- CFG normalization: off for stylism; on for realism [OFFICIAL].
- [OFFICIAL, corrected 2026-08-15] Z-Image-Edit and Omni-Base are not downloadable official checkpoints: the current model zoo says “To be released,” and an open June 2026 issue reports that Edit had not shipped. Do not expose either as a locally runnable target. [Repository](https://github.com/Tongyi-MAI/Z-Image) · [release-status issue](https://github.com/Tongyi-MAI/Z-Image/issues/169)

## Few-shot gold

### Pair 1 — person [OFFICIAL-PATTERN]
INTENT: Chinese woman in Hanfu holding a fan and a neon light.
PROMPT-EN:
A young Chinese woman wears deep-red Hanfu with intricate gold embroidery and holds a round folding fan painted with a lady, trees, and a bird. Her elaborate high bun carries a gold phoenix headdress, red flowers, and hanging beads. A bright yellow lightning-bolt neon lamp floats above her extended left palm. Soft night lighting, blurred colored lights, and the silhouetted Xi'an Giant Wild Goose Pagoda behind her; sharp face and textile detail.
PROMPT-ZH:
一名年轻中国女子身穿深红色汉服，金线刺绣细密，手持一把绘有仕女、树木与飞鸟的圆形团扇。高髻上佩戴金色凤凰头饰、红花与垂珠。她伸出的左手掌上方悬浮一盏明亮的黄色闪电形霓虹灯。夜间柔光，远处彩灯虚化，西安大雁塔呈剪影；面部与织物细节清晰。
NOTES: Mirrors the official example's concrete bilingual relational description.

### Pair 2 — landscape [SYNTHESIS]
INTENT: Chinese ink landscape in album format.
PROMPT-EN:
Song-dynasty-inspired album-leaf landscape on aged silk, layered blue-green mountains rising from large areas of blank mist, one narrow waterfall, a single dark wooden skiff on the lower-left river, mineral pigments with fine gongbi outlines, restrained ink texture, square composition, no people and no text.
PROMPT-ZH:
宋代册页式青绿山水，旧绢本，层叠峰峦从大片留白云气中升起，一线细瀑，一叶深色木舟位于左下江面；矿物颜料设色，工笔细线，墨色克制，方形构图，无人物，无文字。
NOTES: Chinese carries native art terminology; spatial placement is explicit.

### Pair 3 — action/composition [SYNTHESIS]
INTENT: Dancer with fabric frozen in motion.
PROMPT-EN:
One contemporary dancer turns counterclockwise at center stage, right foot planted and left leg extended, a cobalt silk ribbon forming one complete arc from her raised right hand to the floor. Low frontal camera, full body and both feet visible, empty black stage, hard white side light from camera left, crisp fabric texture with slight motion blur only at the ribbon tip.
PROMPT-ZH:
一名现代舞者在舞台中央逆时针旋转，右脚着地，左腿伸展；她抬起的右手牵引钴蓝色丝带，丝带从手到地面形成一道完整弧线。正面低机位，全身与双脚完整可见，黑色空舞台，画面左侧硬质白光；织物纹理清晰，仅丝带末端轻微运动模糊。
NOTES: Exact count, anatomy, action phase and bounded blur.

### Pair 4 — text-in-image [SYNTHESIS]
INTENT: Chinese bookstore poster.
PROMPT-EN:
Vertical bookstore poster on warm ivory paper. At the top center, large vermilion Song-style Chinese characters read “春日书市”. Below, smaller black text reads “四月二十日 · 城南旧书店”. A single green ginkgo leaf overlaps the lower-left border. Balanced letterpress texture, generous blank space, no other words, logos, or watermarks.
PROMPT-ZH:
暖象牙色纸张上的竖版书店海报。顶部中央以大号朱红色宋体清晰写“春日书市”，下方较小的黑字写“四月二十日 · 城南旧书店”。一片绿色银杏叶压住左下边框。活版印刷质感，留白充足，无其他文字、标志或水印。
NOTES: Exact native glyphs and layout.

## Expert mistakes

- Sending negatives or nonzero CFG to Turbo.
- Assuming “long” means 600–1000 words despite the 512-token default.
- SD-style parenthesis/tag soup instead of natural relational prose.
- Translating Chinese calligraphy/aesthetic terms into vague English.
- Expecting seed changes to overcome distilled-mode composition lock.
- Treating showcased Edit capability as proof that an official local Edit checkpoint is available.

## Validator suggestions

- Variant gate: Turbo → guidance 0, no negative, 8 NFEs/9 scheduler steps; Base → 28–50 steps, CFG 3–5, negative recommended.
- Count model tokens if tokenizer available; warn above 480 default tokens and offer 1024 local mode.
- Require natural sentences and at least three concrete categories: subject, spatial relation, light/style.
- Text tasks require quoted exact text, location and typeface; Chinese text should remain unchanged.
- Reject or disable official-local Edit/Omni-Base selection until a real checkpoint URL and license are verified. If a community adapter is selected, label its rules separately rather than inheriting unreleased official Edit claims.
- If the user asks for an exact pose/layout and no structural adapter/reference input is active, warn that prompt-only output is best effort.

## Sources

- [Official Z-Image repository](https://github.com/Tongyi-MAI/Z-Image) — [OFFICIAL], accessed 2026-08-15.
- [Z-Image-Turbo staff prompting discussion](https://huggingface.co/Tongyi-MAI/Z-Image-Turbo/discussions/8) — [STAFF], 2025-11-27, accessed 2026-08-15.
- [Archived official prompt enhancer](https://huggingface.co/spaces/Tongyi-MAI/Z-Image-Turbo/blob/main/pe.py) — [OFFICIAL], accessed 2026-08-15.
- [Diffusers Z-Image training notes](https://github.com/huggingface/diffusers/blob/main/examples/dreambooth/README_z_image.md) — [MAINTAINER], accessed 2026-08-15.
- [Official repository model-zoo status](https://github.com/Tongyi-MAI/Z-Image) and [Edit release-status issue #169](https://github.com/Tongyi-MAI/Z-Image/issues/169) — [OFFICIAL + LORE: SINGLE REPORT], accessed 2026-08-15.
- [GenSpace benchmark](https://openreview.net/pdf?id=zyBG1j339A) — [TESTED/PAPER], accessed 2026-08-15.

---

## 2026-09 sweep (agent 1C)

All URLs accessed **2026-09-03**. Targets: official Base guidance (negatives, `cfg_normalization`,
steps/CFG), the model-zoo table verbatim on Edit / Omni-Base release status, the 512-token truncation and
whether it can be raised, MultiBind-style multi-subject evidence, and Chinese-first prompting examples from
official sources. Nothing above this line was altered.

### New official guidance

**1. The model-zoo table, VERBATIM, at 2026-09-03.** `[OFFICIAL]`
<https://github.com/Tongyi-MAI/Z-Image> `README.md`:

| Model | Pre-Training | SFT | RL | Step | CFG | Task | Visual Quality | Diversity | Fine-Tunability | Hugging Face | ModelScope |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Z-Image-Omni-Base** | ✅ | ❌ | ❌ | 50 | ✅ | Gen. / Editing | Medium | High | Easy | *To be released* | *To be released* |
| **Z-Image** | ✅ | ✅ | ❌ | 50 | ✅ | Gen. | High | Medium | Easy | (links live) | (links live) |
| **Z-Image-Turbo** | ✅ | ✅ | ✅ | 8 | ❌ | Gen. | Very High | Low | N/A | (links live) | (links live) |
| **Z-Image-Edit** | ✅ | ✅ | ❌ | 50 | ✅ | Editing | High | Medium | Easy | *To be released* | *To be released* |

**The corpus position holds without change: Omni-Base and Edit are still "*To be released*" in both the
Hugging Face and ModelScope columns.** Note two things the table now settles: **Turbo is the only
RL-trained variant** and the only one with CFG ❌; **Omni-Base is Pre-Training only** (no SFT, no RL) which
is why its Visual Quality is "Medium" and its Diversity "High". Also confirmed: Base was released
**2026-01-27** (README News: *"[2026-01-27] 🔥 **Z-Image is released!**"*), Turbo **2025-11-26**.

**⚠ An official-vs-official conflict, unresolved.** The project homepage says, verbatim: *"We are publicly
releasing two specialized models on Z-Image: Z-Image-Turbo for generation and **Z-Image-Edit for
editing**. The model code, weights, and an online demo are now publicly available"*
(<https://tongyi-mai.github.io/Z-Image-blog/>, Chinese alongside: 「我们公开发布基于Z-Image的两个子模型：用于
图像生成的Z-Image-Turbo和用于图像编辑的Z-Image-Edit。我们已将模型代码、权重及在线Demo公开发布」). The repo's
own zoo table contradicts that page. **Keep both; act on the table.** The corpus's validator rule
("reject official-local Edit selection until a real checkpoint URL and licence are verified") is exactly
right, and this blog sentence is the reason students keep asking for Edit.

**2. Base recommended parameters, verbatim — two versions that disagree on one line.** `[OFFICIAL]`
GitHub README (the fuller list):

> - **Resolution:** 512×512 to 2048×2048 (total pixel area, any aspect ratio)
> - **Guidance scale:** 3.0 – 5.0
> - **Inference steps:** 28 – 50
> - **Negative prompts:** Strongly recommended for better control
> - **CFG normalization:** `False` for general stylism, `True` for realism

The **HF model card** (<https://huggingface.co/Tongyi-MAI/Z-Image>) lists only Resolution / Guidance scale
/ Inference steps — it **drops the negative-prompt and CFG-normalization lines**. Cite the GitHub README
for those two. The corpus's §"Negatives & guidance" is correct and now has a precise source split.

**3. What `cfg_normalization` actually does — read off the code, not the doc.** `[OFFICIAL]` diffusers
`ZImagePipeline` (<https://github.com/huggingface/diffusers/blob/main/src/diffusers/pipelines/z_image/pipeline_z_image.py>),
verbatim from the denoising loop:

```python
pred = pos + current_guidance_scale * (pos - neg)

# Renormalization
if self._cfg_normalization and float(self._cfg_normalization) > 0.0:
    ori_pos_norm = torch.linalg.vector_norm(pos)
    new_pos_norm = torch.linalg.vector_norm(pred)
    max_new_norm = ori_pos_norm * float(self._cfg_normalization)
    if new_pos_norm > max_new_norm:
        pred = pred * (max_new_norm / new_pos_norm)
```

`[SYNTHESIS]` So `cfg_normalization` is **a clamp on how far CFG may grow the prediction's norm**, and the
flag is used as a *float multiplier* — `True` ⇒ 1.0 ⇒ "the guided prediction may not exceed the
positive-only prediction's magnitude." That is why the vendor pairs it with realism (it suppresses the
oversaturated, crunchy CFG-burn look) and turns it off for stylism (it also suppresses the punch a
stylised image may want). **Teach it as "CFG burn limiter", not as a quality switch.** The signature also
accepts a float: `cfg_normalization=1.2` is a legal, gentler clamp — undocumented by the vendor,
`[SYNTHESIS]` from the code.

**4. A companion parameter the corpus does not mention at all: `cfg_truncation`.** `[OFFICIAL]` same file:
`cfg_truncation: float = 1.0`, documented only as *"The truncation value for configuration"*, and
implemented as — verbatim — a per-step guidance kill switch:

```python
if _precomputed_t_norms[i] > self._cfg_truncation:
    current_guidance_scale = 0.0
```
with `_precomputed_t_norms = ((1000 - timesteps.float()) / 1000)`. `[SYNTHESIS]` At the default 1.0 it
never fires. Lowering it disables CFG (and therefore the negative prompt) for the **late, low-noise**
steps, which is the standard trick for keeping guidance's composition benefit without its texture damage.
Add to the parameter glossary; do not surface it to beginners.

**5. Pipeline defaults ≠ Turbo defaults.** `[OFFICIAL]` `ZImagePipeline.__call__` defaults are
`num_inference_steps=50`, `guidance_scale=5.0`, `cfg_normalization=False`, `max_sequence_length=512` — i.e.
**Base** settings. A student who copies the Turbo snippet but forgets `guidance_scale=0.0` gets a
CFG-5 run on a distilled model. Also: `do_classifier_free_guidance` is `self._guidance_scale > 0`, so
guidance 0.0 skips the negative branch **entirely** — the mechanism behind "Turbo negatives are inert".

**6. ComfyUI's own one-line description of Base is quotable.** `[OFFICIAL]`
<https://docs.comfy.org/tutorials/image/z-image/z-image>: *"Foundation for creative freedom. Diverse
aesthetics with exceptional photorealistic quality; ideal for fine-tuning; **responsive to negative
prompts**; high generation diversity."* File layout, verbatim: text encoder `qwen_3_4b.safetensors`,
diffusion model `z_image_bf16.safetensors`, VAE `ae.safetensors` — **the encoder and VAE files are shared
with Turbo** (both are pulled from the `Comfy-Org/z_image_turbo` repo), so a student already running Turbo
downloads only the DiT.

**7. Base's own model card adds a verbatim Base-vs-Turbo table.** `[OFFICIAL]`
<https://huggingface.co/Tongyi-MAI/Z-Image>:

| Aspect | Z-Image | Z-Image-Turbo |
|------|------|------|
| CFG | ✅ | ❌ |
| Steps | 28~50 | 8 |
| Fintunablity | ✅ | ❌ |
| Negative Prompting | ✅ | ❌ |
| Diversity | High | Low |
| Visual Quality | High | Very High |
| RL | ❌ | ✅ |

and, verbatim: *"**Robust Negative Control**: Responds with high fidelity to negative prompting, allowing
users to reliably suppress artifacts and adjust compositions."* (typo "Fintunablity" is the vendor's.)

### Chinese sources

**8. The 512 cap and how to raise it — `[STAFF]`, verbatim, and the answer is yes.**
`QJerry` (badged **Tongyi-MAI org**), 2025-11-27, <https://huggingface.co/Tongyi-MAI/Z-Image-Turbo/discussions/8>:

> "Due to better performance in online demo in concern of speed, we set text maximum length as 512 tokens,
> 600-1000 words may results in 800-1333 tokens roughly (0.75 word per token generally, more detailly you
> may calculate your prompt with the tokenizer of Qwen3-4B yourself), or set `max_sequence_length` in
> pipeline calling to 1024 when running the code locally, we've handled this case in our pipeline."

```python
image = pipe(
    prompt=prompt,
    ...
    max_sequence_length=1024              ##  please add this line, the default is 512
).images[0]
```

Two things this settles. **(a) The cap is a deliberate serving-latency choice, not an architectural
limit** — 1024 is explicitly supported. **(b) The truncation is silent**: `ZImagePipeline._encode_prompt`
tokenises with `padding="max_length", truncation=True`, so over-long prompts lose their tail with no
warning. Note also that Z-Image wraps the prompt in a Qwen chat template with
**`enable_thinking=True`**, so template tokens count against the budget. Conversion rule to teach,
straight from staff: **≈0.75 words per token** — 512 tokens ≈ **380 English words**; 1024 ≈ 760.

**9. Negatives on Turbo — the `[STAFF]` sentence, verbatim.** `Cxxs` (badged **Tongyi-MAI org**),
2025-11-27, same thread:

> "First, note that this is a few-step distilled model that **does not rely on classifier-free guidance**
> during inference. In other words, unlike traditional diffusion models, this model does not use negative
> prompts at all."

and, on prompting:

> "Z-Image-Turbo works best with long and detailed prompts. You may consider first manually writing the
> prompt and then feeding it to an LLM to enhance it. Our Prompt Enhancing (PE) template is available at
> <https://huggingface.co/spaces/Tongyi-MAI/Z-Image-Turbo/blob/main/pe.py>"

**10. Chinese is first-class in the official code, verbatim.** `[OFFICIAL]` The **Base** usage example's
prompt is a native Chinese paragraph, quoted here in full because it is the single best specimen of the
supported dialect (<https://huggingface.co/Tongyi-MAI/Z-Image> and the repo README):

```text
两名年轻亚裔女性紧密站在一起，背景为朴素的灰色纹理墙面，可能是室内地毯地面。左侧女性留着长卷发，身穿藏青色毛衣，左袖有奶油色褶皱装饰，内搭白色立领衬衫，下身白色裤子；佩戴小巧金色耳钉，双臂交叉于背后。右侧女性留直肩长发，身穿奶油色卫衣，胸前印有"Tun the tables"字样，下方为"New ideas"，搭配白色裤子；佩戴银色小环耳环，双臂交叉于胸前。两人均面带微笑直视镜头。照片，自然光照明，柔和阴影，以藏青、奶油白为主的中性色调，休闲时尚摄影，中等景深，面部和上半身对焦清晰，姿态放松，表情友好，室内环境，地毯地面，纯色背景。
```

`[SYNTHESIS]` Read it as a template: **count first (两名) → per-subject block anchored by side (左侧/右侧)
→ garment + colour + trim + accessory + arm position inside each block → shared action (两人均…) → then a
comma-run of capture terms** (照片, 自然光照明, 柔和阴影, 中性色调, 休闲时尚摄影, 中等景深, 面部和上半身对焦
清晰) **and a background restatement** (纯色背景). Note the vendor's own multi-subject discipline: each
woman's attributes are enclosed in one clause and separated by `；` — this *is* the official anti-bleed
technique.

Turbo's official Chinese specimen, verbatim from the diffusers docstring
(<https://github.com/huggingface/diffusers/blob/main/src/diffusers/pipelines/z_image/pipeline_z_image.py>):

```text
一幅为名为"造相「Z-IMAGE-TURBO」"的项目设计的创意海报。画面巧妙地将文字概念视觉化：一辆复古蒸汽小火车化身为巨大的拉链头，正拉开厚厚的冬日积雪，展露出一个生机盎然的春天。
```

**11. The official PE handles reasoning-style Chinese instructions, not just descriptions.** `[OFFICIAL]`
<https://tongyi-mai.github.io/Z-Image-blog/>, verbatim: 「强大的提示词增强器（PE）通过结构化推理链注入逻辑与
常识，使模型能处理诸如"鸡兔同笼"或古诗可视化等复杂任务。」 Its own showcased inputs are things like
`帮我给《登科后》配图，最出名的两句`, `泡普洱茶的步骤都有哪些`, `帮我规划一个杭州西湖的旅游计划，手帐`,
`Generate a photograph located at 30° 9'36"N, 120° 7' 12"E.` `[SYNTHESIS]` **These are PE inputs, not model
inputs.** A local user with no PE who types 泡普洱茶的步骤都有哪些 will not get an infographic. This is the
same hidden-rewriter trap the corpus documents for 通义万相 and MiniMax H3 — record Z-Image's PE alongside them.

**12. A `[LORE]` counterweight to "Chinese outranks English for Alibaba models".** Same HF thread,
user `urtuuuu`, 2025-11-30: he ran the Chinese Qwen-Image blog prompt (宫崎骏的动漫风格…阿里云…云存储…) on
Z-Image-Turbo and reported it *"performs worse, in terms of details and especially text accuracy"*; after
running it through the official `pe.py` in Gemini 3, **the enhancer returned an English prompt** (keeping
only the Han glyphs that had to be *rendered*, quoted) and *"the result was much better. Maybe it just
prefers english promt"*. `[SYNTHESIS]` This is n=1 with no seeds, but it is directionally consistent with
the corpus's own position (§"Chinese prompting"): **Chinese for exact glyphs and culturally native
vocabulary; English for the surrounding camera/scene description.** It is *not* evidence that Chinese is
worse — it is evidence that the vendor's own enhancer chooses the mixed strategy the corpus already
recommends. Do not upgrade it past `[LORE]`.

### Tested findings

**13. `ZImagePipeline` HAS a string→negative path. The 08-28 digest's contradiction #3 is wrong for
Z-Image.** `[OFFICIAL — code, verified 2026-09-03]` diffusers `main`:

```python
def __call__(self, prompt=..., ..., negative_prompt: str | list[str] | None = None, ...)
...
def encode_prompt(self, prompt, ..., negative_prompt: str | list[str] | None = None, ...):
    if do_classifier_free_guidance:
        if negative_prompt is None:
            negative_prompt = ["" for _ in prompt]
        else:
            negative_prompt = [negative_prompt] if isinstance(negative_prompt, str) else negative_prompt
        negative_prompt_embeds = self._encode_prompt(prompt=negative_prompt, ...)
```

A plain string negative is accepted and encoded. What is true is that it **does nothing when
`guidance_scale == 0`**, because `do_classifier_free_guidance` is `self._guidance_scale > 0`. So the
correct statement is the corpus's own cross-model rule — *negatives are a function of guidance, not of the
pipeline* — and **the "no string→negative path" defect belongs to `Flux2KleinPipeline` alone** (see
`research/flux.md`, this sweep). The digest conflated the two pipelines because they were reported in one
issue. Issue **#13416** (<https://github.com/huggingface/diffusers/issues/13416>) is confirmed **still
open, zero comments, label "bug", opened 2026-04-04** — but its Z-Image half is no longer accurate.

**14. Multi-subject misbinding: a diagnostic benchmark now exists; a *mitigation* does not.**
`[TESTED/PAPER]` **MultiBind**, arXiv **2603.21937** (<https://arxiv.org/abs/2603.21937>): 508 instances,
1,527 human subjects (118 / 269 / 121 instances with two / three / four subjects), built from real
multi-person photographs with slot-ordered subject crops, masks, bounding boxes, an inpainted background
reference and *"a dense entity-indexed prompt derived from structured annotations"*. Its contribution is a
**dimension-wise confusion protocol** that, verbatim, *"separates self-degradation from true cross-subject
interference and exposes interpretable failure patterns such as **drift, swap, dominance, and blending**."*

Two honest limits. **(a) It is a multi-*reference* benchmark** — subject images plus prompt — so it does
not evaluate prompt-only T2I, and Z-Image has no released multi-reference path (Edit/Omni-Base
unreleased). **(b) The abstract names no models**; we did not verify that Z-Image is among the "modern
multi-reference generators" tested. So: **no MultiBind-style mitigation evidence for Z-Image was found on
{arXiv abstract, Tongyi-MAI repo, HF discussions, docs.comfy.org}.** Adjacent papers found and not
pursued: MIBE (2607.01383, interaction/occlusion), "When Identities Collapse" (2603.26078), CogCanvas
(2606.15867).

`[SYNTHESIS]` What the corpus *should* take from MultiBind is its **vocabulary**. "Attribute bleed" is
four distinct failures — **drift** (attributes degrade), **swap** (A gets B's attribute), **dominance**
(one subject's look takes over), **blending** (subjects fuse). The official Chinese Base example (item 10)
is the vendor's own mitigation for swap and blending: one bracketed clause per subject, anchored to a
stated screen position, separated by `；`.

**15. A working negative-prompt route on Z-Image Turbo exists, and it re-introduces weight syntax.**
`[LORE — community tool, no published image tests]` `cyberdeliaAI/comfyui-negpip-zimage`
(<https://github.com/cyberdeliaAI/comfyui-negpip-zimage>). NegPiP merges the negative into the positive
conditioning as **signed weights** and patches the model, so it works at CFG 1.0 where CFG-based negatives
cannot. Verbatim example and compatibility line:

```text
positive: a sharp portrait, detailed eyes
negative: blurry background, (text:1.3)
→ a sharp portrait, detailed eyes, (blurry background:-1), (text:-1.3)
```

> "Z-Image / Z-Image Turbo | Supported | Lumina2 / NextDiT / Qwen3-4B"

> "Use `compiled_prompt` only for inspection. Do not send it through another CLIP Text Encode node;
> **Z-Image's normal tokenizer does not interpret NegPiP weights.**"

Author's dosing guidance, verbatim: *"For Z-Image, compare prompt changes with the same seed. Broad
semantic categories can react non-linearly, so start with a strength around `0.25` to `0.5` before trying
`1.0`."* and *"Large negative lists at strength `1.0` can dominate the prompt."* The suggested grouped form
is worth teaching as a pattern:

```text
(3D, CGI, render, blender, video game screenshot, illustration:0.25),
(text, writing, subtitle, watermark, logo:0.7),
(blurry, low quality, jpeg artifacts, grainy:0.4)
```

Also settles the weighting question for this family: **`(word:1.2)` is inert literal text in Z-Image's
stock encode, and becomes a real signed weight only inside a NegPiP patch.**

### Contradicts current corpus

1. **08-28 contradiction #3 is half wrong.** `ZImagePipeline` does expose a string `negative_prompt` and
   does encode it (item 13). The "no string→negative path" finding applies to `Flux2KleinPipeline` only.
   Fix the digest line and the fold-in item that rests on it.
2. **"Turbo does not support negatives" needs a route clause.** True for the CFG path (`[STAFF]`, item 9)
   and for guidance 0.0 in code — **not** true once a NegPiP node patches the model (item 15). Restate as:
   "no negative through guidance; a community NegPiP node gives you one through signed positive
   conditioning."
3. **The corpus's line 40 fix "remain below active 512-token cap or deliberately raise
   `max_sequence_length` locally" is right but under-quantified.** Staff give the conversion (0.75 w/token)
   and the exact supported value (1024). Put both in the validator.
4. **"CFG normalization: off for stylism, on for realism" is a vendor heuristic wrapping a norm clamp,
   and it lives on the GitHub README only** — the HF model card omits it. Cite precisely, and explain the
   mechanism so students stop treating it as a quality toggle.
5. **The corpus's "Base: 28–50 steps, CFG 3–5" should note the code defaults are 50 / 5.0**, and that the
   vendor's own worked example uses **50 steps, guidance 4, `cfg_normalization=False`, 1280×720** — a
   concrete recipe the corpus does not currently carry.
6. **The project homepage says Edit is released.** The corpus says the opposite and is right, but the
   contradiction is *inside* the vendor's own material and must be recorded so nobody "corrects" us.
7. **`cfg_truncation` is missing from the corpus entirely.** Not a contradiction; a gap.
8. **On the cross-cutting order-vs-prose question, Z-Image is unevidenced.** The best-tested paper in this
   area (arXiv 2606.03715, see `research/flux.md` this sweep) covers SD 3, FLUX.1 Schnell, FLUX.2 Klein-4B,
   SDXL and SD 2.1 — **not Z-Image**. Z-Image is an S3-DiT with a Qwen3-4B encoder, architecturally in the
   same family as the models where "word identity + order is nearly sufficient" held, so the *expectation*
   transfers `[SPECULATION]` — but the corpus must not claim it as tested.

### Few-shot gold (new pairs)

### Pair 5 — multi-subject anti-bleed, official Base pattern [OFFICIAL-PATTERN]
INTENT: Two people, distinct outfits, no attribute swap — written in the vendor's own per-subject clause
form (Base, 50 steps, guidance 4, `cfg_normalization=False`).
PROMPT-ZH:
两名年轻男性并肩站在旧书店门前，背景为深绿色木质门框与磨旧的黄铜门把手。左侧男性戴细框圆形眼镜，留短寸头，身穿灰蓝色粗针毛衣，内搭白色圆领衫，下身深棕色灯芯绒长裤；左手夹着一本厚精装书，右手插在口袋里。右侧男性未戴眼镜，留中长卷发扎于脑后，身穿砖红色工装夹克，内搭米白色条纹衬衫，下身水洗蓝牛仔裤；双手各提一只帆布袋。两人均侧身面向镜头微笑。照片，午后侧逆光，柔和阴影，以灰蓝、砖红、米白为主的中性色调，纪实人像摄影，中等景深，两人面部同时清晰对焦，无其他人物出现在画面中。
PROMPT-EN:
Two young men stand shoulder to shoulder in front of an old bookshop, against a dark-green wooden door
frame with a worn brass handle. The man on the left wears thin round glasses and a short crew cut, a
grey-blue chunky knit sweater over a white crew-neck tee, dark brown corduroy trousers; a thick hardback
book is tucked under his left arm and his right hand is in his pocket. The man on the right wears no
glasses, mid-length curly hair tied back, a brick-red work jacket over an off-white striped shirt, washed
blue jeans; he carries one canvas tote in each hand. Both are turned three-quarters toward the camera,
smiling. Photograph, late-afternoon side-backlight, soft shadows, a neutral palette of grey-blue, brick red
and off-white, documentary portraiture, medium depth of field, both faces in sharp focus at once, no other
people in the frame.
NOTES: Copies the official example's structure exactly — count first, then one `；`-terminated clause per
subject anchored by 左侧/右侧, then a shared action, then a comma-run of capture terms, then an exclusion
stated positively. Targets MultiBind's **swap** and **blending** failures (item 14). Base negative to pair
with it: `多余的人物, 面部变形, 手部畸形, 文字, 水印` (targeted, not a mega-list). ~250 Han characters ≈ well
inside 512 tokens. Untested.

### Pair 6 — Turbo, NegPiP route [LORE-PATTERN]
INTENT: Suppress a plastic-render look on Turbo, where CFG-based negatives cannot work.
PROMPT-EN (positive):
A weathered fisherman mends a green nylon net on a concrete quay at dawn, thick knuckles and split
fingernails visible, salt-stained yellow oilskin bibs, low horizontal light from the right, matte skin with
visible pores, documentary photograph, 50mm, medium depth of field.
NEGATIVE (into the NegPiP node's negative socket, grouped and dosed):
`(3D, CGI, render, video game screenshot, illustration:0.25), (plastic skin, waxy highlights, airbrushed, beauty retouching:0.5), (text, watermark, logo:0.7)`
NOTES: Compiles to signed weights inside the positive conditioning; keep the sampler at CFG 1.0 and
guidance 0. Author's own guidance: start 0.25–0.5, compare at fixed seed, expect non-linear response from
broad categories. This is a **community route**, not vendor-supported — label it as such in class, and
teach the positive-rephrase route (`matte skin with visible pores`, already in the positive above) as the
primary technique. Untested.

### Validator changes

- **Token budget, quantified.** Warn above **480 tokens** (default 512); if the user asks for more, offer
  the exact staff remedy: `max_sequence_length=1024` in the diffusers call (Turbo and Base both). With no
  tokenizer, use the staff conversion **0.75 words/token**: warn above **360 English words** or ~**450 Han
  characters**, hard-warn above 760 words even with 1024 set.
- **Variant gate, extended.** Turbo → `guidance_scale=0.0`, 9 scheduler steps (8 DiT forwards), negative
  field disabled *unless* a NegPiP node is present. Base → 28–50 steps, guidance 3.0–5.0, negative
  recommended; expose `cfg_normalization` with the tooltip "CFG burn limiter — `True` (=1.0) clamps the
  guided prediction to the unguided one's magnitude; vendor says off for stylism, on for realism";
  expose `cfg_truncation` as advanced only.
- **Weighting syntax.** Flag `(word:1.2)` on Z-Image as **literal text** (the stock tokenizer does not
  parse it) unless a NegPiP node is in the graph; if one is, allow signed weights and warn above 0.5.
- **Multi-subject rule (new).** If the prompt names two or more people/animals, require: an explicit count,
  a screen-position anchor per subject (左侧/右侧, left/right, foreground/behind), and every attribute inside
  its own subject clause. Name the risk using MultiBind's terms (swap / blending).
- **PE awareness (new).** If the user's text is a *question or task* rather than a description
  (泡普洱茶的步骤…, "what is a diffusion model?"), warn that this only works through the official Prompt
  Enhancer and that local ComfyUI has no PE — offer to rewrite it as a description.
- **Edit/Omni-Base.** Keep the hard block, and add the counter-source note so the tutor can answer "but the
  Z-Image homepage says Edit is released."

### Nothing-found register

- **`pe.py` is still not retrievable.** The canonical URL
  <https://huggingface.co/spaces/Tongyi-MAI/Z-Image-Turbo/blob/main/pe.py> **404s** (users in HF
  discussion #8 report the same from 2025-11-30). The archived snapshot named in that thread
  (`web.archive.org/web/20251127201114/…`) **is blocked in this environment** ("URL is on blocklist").
  The corpus's "canonical location identified; archived body not reliably retrievable" therefore **stands
  unchanged after a second attempt**. The only verbatim fragment we can source remains the staff
  fingerprint "works best with long and detailed prompts", plus the blog's Chinese description of what PE
  does (item 11).
- **`api.github.com` returns an empty body for every request here**, including
  `/repos/Tongyi-MAI/Z-Image/issues/169`. Issue #169's *current* status was therefore **not** re-verified
  this sweep; the model-zoo table (item 1) is the evidence carrying the "Edit unreleased" claim.
- **No official prompting guide document for Z-Image** on {github.com/Tongyi-MAI/Z-Image,
  huggingface.co/Tongyi-MAI/*, tongyi-mai.github.io/Z-Image-blog, docs.comfy.org}. The `[STAFF]` HF thread
  remains the only prompting guidance the vendor has published.
- **No official Chinese-language prompting *guide*** — the Chinese material is bilingual marketing copy on
  the project homepage plus the Chinese example prompts in code. 知乎 and Bilibili were **not** reachable
  (WebSearch index is US-only); ModelScope model pages were not fetched this sweep.
- **No Z-Image-specific multi-subject mitigation** (see item 14 for the surfaces searched).
- **No `[TESTED]` order-vs-prose or ZH-vs-EN fixed-seed evidence for Z-Image anywhere.** The 08-28
  digest's priority in-house test is still the right call and is still unrun.
- **No official LoRA-training recipe from Tongyi-MAI.** Staff said (2025-11-27) *"We are actively working
  on this"*; nothing found since. DiffSynth-Studio and the diffusers `README_z_image.md` remain the
  community/maintainer paths.
- **Reddit remains structurally unreachable.**

### Sources

`[OFFICIAL]`
- Z-Image repository README — model zoo table verbatim, Base recommended parameters, release dates, community-works list — <https://github.com/Tongyi-MAI/Z-Image>
- Z-Image (Base) HF model card — Base-vs-Turbo table, "Robust Negative Control", recommended parameters, Chinese usage example — <https://huggingface.co/Tongyi-MAI/Z-Image>
- Z-Image PyTorch-native `inference.py` (Turbo: 8 steps, guidance 0.0, 1024²) — <https://github.com/Tongyi-MAI/Z-Image/blob/main/inference.py>
- diffusers `ZImagePipeline` source — `max_sequence_length=512`, string negative path, `cfg_normalization` clamp, `cfg_truncation`, `enable_thinking=True`, `hidden_states[-2]` — <https://github.com/huggingface/diffusers/blob/main/src/diffusers/pipelines/z_image/pipeline_z_image.py>
- Z-Image project homepage (bilingual; PE reasoning claim; the "Edit is released" sentence) — <https://tongyi-mai.github.io/Z-Image-blog/>
- ComfyUI Z-Image (Base) workflow docs — "responsive to negative prompts"; file layout shared with Turbo — <https://docs.comfy.org/tutorials/image/z-image/z-image>
- diffusers issue #13416, "how to use zimage and flux2 with negative prompt?" — open, zero comments, label "bug", opened 2026-04-04 — <https://github.com/huggingface/diffusers/issues/13416>

`[STAFF]`
- `Cxxs` (Tongyi-MAI org) and `QJerry` (Tongyi-MAI org), 2025-11-27 — prompting, negatives, the 512→1024 `max_sequence_length` remedy — <https://huggingface.co/Tongyi-MAI/Z-Image-Turbo/discussions/8>

`[TESTED/PAPER]`
- MultiBind: A Benchmark for Attribute Misbinding in Multi-Subject Generation, arXiv 2603.21937 — drift / swap / dominance / blending taxonomy — <https://arxiv.org/abs/2603.21937>

`[LORE]`
- `cyberdeliaAI/comfyui-negpip-zimage` — NegPiP negative/weighting route for Z-Image and Turbo; "Z-Image's normal tokenizer does not interpret NegPiP weights" — <https://github.com/cyberdeliaAI/comfyui-negpip-zimage>
- `urtuuuu`, HF discussion #8, 2025-11-30 — ZH-vs-EN single-prompt anecdote; the official PE returned English — <https://huggingface.co/Tongyi-MAI/Z-Image-Turbo/discussions/8>
