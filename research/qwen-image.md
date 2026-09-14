# Qwen-Image research brief

Research baseline: 2026-08-15. Scope: Qwen-Image-2512, Edit-2511, Lightning.

## Official guidance

- [OFFICIAL] Qwen-Image-2512 improves human realism, natural detail, text rendering/layout, and semantic posture adherence. It is a 20B bilingual text-to-image foundation model. [Model card](https://huggingface.co/Qwen/Qwen-Image-2512)
- [OFFICIAL] The 2512 rewriter automatically classifies portrait, text-containing, or general image. Portrait order: identity → clothing/accessories → face/skin → pose → background. Text prompts preserve exact text, punctuation, case, line breaks and language, plus carrier, role, position, font, color and size. Target is about 200 words. [Rewriter source](https://github.com/QwenLM/Qwen-Image/blob/main/src/examples/tools/prompt_utils_2512.py)
- [OFFICIAL] Edit-2511 supports multiple images, stronger consistency and geometric reasoning. Official local recipe: true CFG 4, guidance 1, 40 steps. Multi-image prompts refer to images by order. [Edit card](https://huggingface.co/Qwen/Qwen-Image-Edit-2511)
- [OFFICIAL] Qwen's launch demonstrates multi-line/paragraph Chinese and bilingual text. [Official blog](https://qwenlm.github.io/blog/qwen-image/)

## Rewriter system prompts (verbatim)

Canonical source: [`prompt_utils_2512.py`](https://github.com/QwenLM/Qwen-Image/blob/main/src/examples/tools/prompt_utils_2512.py); legacy generator/edit source: [`prompt_utils.py`](https://github.com/QwenLM/Qwen-Image/blob/main/src/examples/tools/prompt_utils.py).

Short fingerprints:

```text
“Maintain conciseness: aim for a succinct description, ideally around 200 words”
“Keep the enhanced prompt direct and specific.”
```

Structural digest [OFFICIAL]: classify first; preserve original intent; add only coherent visual detail; portrait identity and anatomy are explicit; text is exact and fully laid out; generic scenes name quantity/material/position/relationships; output one prompt only. Full third-party prompt bodies are not duplicated.

## Chinese prompting

- [OFFICIAL] Qwen-Image is trained for alphabetic and logographic text and the Chinese benchmark result is a headline strength. The official rewriter detects Han characters and produces native Chinese output.
- Chinese wins for Chinese glyphs, culturally precise content and native aesthetics. English is safe for global photo terminology. Mixed prompts should retain exact visible text in its original language.
- Native idiom: `遒劲行书`, `田英章硬笔`, `朱砂印`, `绢本设色`, `工笔重彩`, `留白`, `青灰瓦顶`, `朱红外墙`, `阴天漫射光`, `湿润路面细腻反光`.
- Do not machine-translate proper nouns, slogans or quoted text; the official rewriter explicitly says not to translate visible text.

## Motion / composition control

Composition: exact subject count and identity; pose/gaze/hand placement; object quantity/color/material/position and functional relation; specific setting; light direction/intensity/temperature; text carrier/layout. For multi-image edits, map every image index to exactly one role.

- [OFFICIAL] Edit-2511's multi-image interface is the strongest documented pose route in this scoped version: dedicate one image to identity, one to garment/style if needed, and one to pose, then state each role explicitly by index.
- [LORE: SINGLE REPORTS] Official-repository issues show that indexed image roles can still be swapped or ignored and that edited content can spill outside a requested mask despite explicit containment language. These are unresolved reliability reports, not controlled benchmarks; they prove the app must label multi-reference pose/edit fidelity as best effort. [image-order issue #169](https://github.com/QwenLM/Qwen-Image/issues/169) · [mask-containment issue #137](https://github.com/QwenLM/Qwen-Image/issues/137)
- [TESTED/PAPER] MMGR includes Qwen-Image and finds broad gaps in spatial/global-state consistency among current image/video generators. Qwen's own Qwen-Image-Bench separately scores action/pose and spatial relations, which should be used for regression testing rather than aesthetic-only review. [MMGR](https://arxiv.org/abs/2512.14691) · [Qwen-Image-Bench](https://github.com/QwenLM/Qwen-Image-Bench)

Failure fixes:

- Face/pose ambiguity: replace young/old with age or range; name gaze, head tilt, arm/hand placement.
- Text hallucination: supply every exact word, not placeholders; say “no other text.”
- Multi-image drift: “subject from image 1, garment from image 2, pose from image 3”; keep the destination background explicit.
- Overediting: direct imperative naming only changed property, followed by “preserve identity/composition/lighting” clauses.
- Exact pose: use a dedicated pose reference and enumerate stance, limb, head and gaze features to match; sample multiple fixed-setting seeds because role binding is not guaranteed.

## Verbosity calibration

- Official 2512 rewriter: ideally about 200 words, with concision. This is a target, not a minimum.
- API limits vary: Alibaba's current older Qwen-Image endpoints document 800 tokens/characters; 2.0 models 1300 tokens. Local 2512 pipeline limits should be checked in the selected UI.
- Load-bearing: exact identity/pose, clothing/material, spatial relationships, light, style, full text specification. Noise: 4K/32K/C4D piles, duplicated adjectives, speculative text not requested.
- Edit prompts should be shorter/direct; details should constrain the edit rather than recaption the whole image.

## Negatives & guidance

- [OFFICIAL] Qwen-Image supports a negative field. Alibaba's official Chinese example targets low resolution/quality, malformed limbs/fingers, oversaturation, waxy/smooth faces, chaotic composition and blurred/distorted text.
- [OFFICIAL] Edit-2511 example uses true CFG 4, guidance 1, 40 steps, blank negative. Treat text-to-image and edit settings separately.
- Lightning is community/LightX2V acceleration. Match Lightning LoRA to model version and intended step count; controlled tests report quality/adherence tradeoffs at 4/8 steps [TESTED, but not official Qwen]. [LightX2V model](https://huggingface.co/lightx2v/Qwen-Image-Lightning)

## Few-shot gold

### Pair 1 — person [SYNTHESIS]
INTENT: Portrait of a ceramic artist.
PROMPT-EN:
A 34-year-old East Asian woman, ceramic artist, with an oval face, warm brown almond-shaped eyes, light freckles, and black hair in a loose low bun. She wears an indigo linen work shirt, clay-stained beige apron, small silver studs, and no other jewelry. Seated upright at a pottery wheel, she looks down and cups a wet white bowl with both hands. North-window light from camera left reveals natural skin and damp clay texture; shelves of unfired vessels remain softly focused behind her.
PROMPT-ZH:
一名34岁的东亚女性陶艺师，椭圆脸，暖棕色杏眼，面颊有浅淡雀斑，黑发松松挽成低髻。她身穿靛蓝色亚麻工作衫和沾有陶泥的米色围裙，只戴小巧银色耳钉。她端坐在拉坯机前，低头注视双手捧住的湿润白色陶碗。画面左侧北窗光呈现自然肤质与潮湿陶泥纹理，身后未烧制器皿的置物架柔和虚化。
NOTES: Follows official portrait field order and concrete pose.

### Pair 2 — landscape [SYNTHESIS]
INTENT: Rainy old Beijing bookstore street.
PROMPT-EN:
A rainy winter lane in old Beijing, two adjacent shops with blue-gray tiled roofs and vermilion walls, warm paper lanterns under the eaves, damp cobblestones reflecting soft overcast light. The left shop is a bookstore with dark wooden shelves visible through the window; the right is a flower shop with red camellias. Eye-level wide composition, restrained gray-red palette, realistic architectural photography, no people and no text.
PROMPT-ZH:
冬日北京老城雨巷，两间相邻商铺采用青灰瓦顶与朱红外墙，檐下暖色纸灯笼照亮湿润鹅卵石路面的细腻反光。左侧书店的深色木书架透过玻璃可见，右侧花店陈列红色山茶。平视广角构图，灰红色调克制，写实建筑摄影，无人物，无文字。
NOTES: Native architectural/light vocabulary.

### Pair 3 — action/composition [SYNTHESIS]
INTENT: Basketball player leaning into a drive.
PROMPT-EN:
One 22-year-old Black male basketball player in a white number-14 jersey drives left past a defender, torso leaning forward, right hand pushing the ball low against the floor, left arm bent to protect space, eyes fixed on the lane. Full body and both feet visible; defender remains half a step behind on camera right. Low sideline angle, hard arena rim light, crisp sweat and jersey fabric, realistic sports photography.
PROMPT-ZH:
一名22岁的黑人男性篮球运动员身穿白色14号球衣，向左突破防守，躯干前倾，右手低位运球触地，左臂弯曲护住空间，目光锁定篮下通道。全身与双脚完整可见；防守者位于画面右侧，落后半步。边线低机位，球馆硬质轮廓光，汗珠与球衣织物清晰，写实体育摄影。
NOTES: Explicit posture and relative position exploit 2512's improved posture following.

### Pair 4 — text-in-image [OFFICIAL-PATTERN]
INTENT: Chinese lost-cat poster.
PROMPT-EN:
A torn-paper lost-cat poster on a pale blue weathered wooden wall. At the top center, bold black Chinese text reads “寻猫启事”. Beneath the centered photo of a gray male cat, two lines read “名字：灰仔” and “右耳缺角，走路微跛”. At the bottom, red text reads “如有见到，请联系：138-0000-0000”. Handwritten date “4月5日” appears at lower left. Clear hierarchy, realistic paper fibers, no other text.
PROMPT-ZH:
一张贴在浅蓝色风化木墙上的撕边寻猫海报。顶部中央以粗黑体写“寻猫启事”。灰色公猫照片居中，照片下方两行文字分别为“名字：灰仔”和“右耳缺角，走路微跛”。底部红字写“如有见到，请联系：138-0000-0000”。左下角手写日期“4月5日”。层级清晰，纸张纤维真实，无其他文字。
NOTES: Exact content, locations, carrier and no placeholders.

### Pair 5 — edit [OFFICIAL-PATTERN]
INTENT: Put the dress from image 2 on the woman in image 1 and use pose from image 3.
PROMPT-EN:
Dress the woman from image 1 in the black silk dress from image 2 and place her in the seated pose from image 3. Preserve her face, age, hairstyle, skin tone, and the background and lighting of image 1. Keep the dress's neckline, long sleeves, fabric sheen, and ankle length exactly as shown in image 2; maintain natural anatomy and contact with the chair.
PROMPT-ZH:
让图1中的女性穿上图2的黑色真丝连衣裙，并采用图3中的坐姿。保持图1人物的面部、年龄、发型、肤色以及图1的背景与光照不变。准确保留图2连衣裙的领口、长袖、面料光泽与及踝长度，确保人体结构自然并与椅子正确接触。
NOTES: One role per indexed image and explicit preservation.

## Expert mistakes

- Treating the 200-word rewriter target as permission to invent every detail.
- Translating visible text or omitting punctuation/line breaks.
- Using placeholders (“a list of features”) instead of exact infographic copy.
- Recaptioning the entire source image in an edit prompt and causing drift.
- Mixing Lightning steps/settings across 2509, 2511 and 2512.
- Assuming an online Qwen demo's behavior is reproducible by local 2512 weights without recording checkpoint, rewriter and settings.

## Validator suggestions

- Classify `portrait|text|general|edit` before validating.
- Portrait: require age/range, subject identity, pose/gaze/hand action, environment/light; target 80–220 words.
- Text: extract all quoted strings; require location + font/style; reject vague placeholders (`some text|a list|etc.`).
- Edit: require operation + target + result; multi-image tasks must reference every supplied image exactly once or explain unused inputs.
- Preserve non-English quoted text byte-for-byte between intent and output.
- Lightning workflow must name exact compatible model/version and 4/8-step profile.
- Multi-image pose/edit requests must assign one explicit role to every image; require a best-effort warning and recommend several seeds because role binding can fail.
- For strict pose/spatial requests, store the source references and evaluate limb/head/gaze/relative-position criteria separately from general aesthetics.

## Sources

- [Qwen-Image-2512 model card](https://huggingface.co/Qwen/Qwen-Image-2512) — [OFFICIAL], 2025-12, accessed 2026-08-15.
- [Qwen-Image official repository](https://github.com/QwenLM/Qwen-Image) — [OFFICIAL], accessed 2026-08-15.
- [Official 2512 rewriter](https://github.com/QwenLM/Qwen-Image/blob/main/src/examples/tools/prompt_utils_2512.py) — [OFFICIAL], accessed 2026-08-15.
- [Qwen-Image-Edit-2511 card](https://huggingface.co/Qwen/Qwen-Image-Edit-2511) — [OFFICIAL], 2025-11, accessed 2026-08-15.
- [Qwen-Image launch blog](https://qwenlm.github.io/blog/qwen-image/) and [Chinese version](https://qwenlm.github.io/zh/blog/qwen-image/) — [OFFICIAL], 2025-08-04, accessed 2026-08-15.
- [Alibaba Cloud Qwen-Image API](https://help.aliyun.com/zh/model-studio/qwen-image-api) — [OFFICIAL], accessed 2026-08-15.
- [Qwen-Image-Bench](https://github.com/QwenLM/Qwen-Image-Bench) — [OFFICIAL/BENCHMARK], accessed 2026-08-15.
- [MMGR](https://arxiv.org/abs/2512.14691) — [TESTED/PAPER], accessed 2026-08-15.
- [Qwen issue #169](https://github.com/QwenLM/Qwen-Image/issues/169) and [issue #137](https://github.com/QwenLM/Qwen-Image/issues/137) — [LORE: SINGLE REPORTS], accessed 2026-08-15.

---

## 2026-09-10 sweep (Qwen-Image agent)

Scope: Qwen-Image-2512, Qwen-Image-Edit-2511, Lightning LoRAs, any newer *local* checkpoints.
All URLs accessed **2026-09-10** unless a different date is stated on the line.
Spend: 41 fetches. Complete; every brief item has a line in the nothing-found register.

### New official guidance

**1. `Qwen-Image-2.0` announced 2026-02-10 — no open weights; stays closed-tier.** `[OFFICIAL]`
The `QwenLM/Qwen-Image` README News block, top entry, verbatim:

```text
- 2026.02.10: We are launching Qwen-Image-2.0, a next-generation foundational image generation model. The key highlights of Qwen-Image-2.0 include:

    * **Professional Typography Rendering** – Supports 1k-token instructions for direct generation of professional infographics, including PPTs, posters, comics, and more.
    * **Stronger Semantic Adherence** – Native 2K resolution support for finely detailed realistic scenes, including people, nature, and architecture.
    * **Improved Text Rendering** – Integrated understanding and generation capabilities, unifying image generation and editing in a single mode
    * **Lighter Model Architecture**  – Smaller model size with faster inference speed.
Check our [Blog](https://qwen.ai/blog?id=qwen-image-2.0) for more details! Also give it a try at [Qwen Chat](https://chat.qwen.ai/?inputFeature=t2i).
```

Note the **shape of the entry**: every open-weight release in the same list is announced twice — once as
"We released X!" (blog) and once as "We released X **weights**! Check at [Huggingface] and
[ModelScope]" (e.g. 2025.12.31 for 2512, 2025.12.23 for Edit-2511, 2025.12.19 for Layered).
Qwen-Image-2.0 has **no weights line, no HF link, no ModelScope link** — only Qwen Chat. Under the
strict gate (weights + licence + ComfyUI path) it **fails on all three** and remains closed-tier,
which agrees with the 09-03 digest. Prompt-relevant even so: **1k-token instructions** is the first
vendor-stated instruction budget for any Qwen-Image generation, and it is a *cloud* budget.
[README](https://github.com/QwenLM/Qwen-Image/blob/main/README.md) · accessed 2026-09-10.

**2. `Qwen-Image-Layered` (2025-12-19) is an open-weight Qwen-Image checkpoint the corpus has never
covered.** `[OFFICIAL]` README News: *"2025.12.19: We released Qwen-Image-Layered weights! Check at
[Huggingface](https://huggingface.co/Qwen/Qwen-Image-Layered) and
[ModelScope](https://modelscope.cn/models/Qwen/Qwen-Image-Layered)!"* plus a blog at
`https://qwenlm.github.io/blog/qwen-image-layered`. It is also named in vLLM-Omni's day-0 support line
alongside Edit-2511. Scoped absence: **no ComfyUI template or docs.comfy.org page for Layered was
found** on the surfaces searched this sweep (see nothing-found register), so it does not yet clear the
strict gate's third leg for teaching purposes. `research/new-models.md` should carry it.
[README](https://github.com/QwenLM/Qwen-Image/blob/main/README.md) · accessed 2026-09-10.

**3. The official 2512 negative prompt is verbatim identical to the app's `QWENIMG_NEG`.** `[OFFICIAL]`
Both the repo README's 2512 quick-start and the HF `Qwen/Qwen-Image-2512` card carry, character for
character:

```text
negative_prompt = "低分辨率，低画质，肢体畸形，手指畸形，画面过饱和，蜡像感，人脸无细节，过度光滑，画面具有AI感。构图混乱。文字模糊，扭曲。"
```

This is the **anti-AI-look Chinese negative list** the brief asked for, and it is the *only* negative
list Qwen publishes for 2512. Note its two structural quirks, both of which the app reproduces
correctly: it mixes `，` separators with two full stops `。` mid-list, and it names `画面具有AI感`
("the image has an AI look") as an artifact to suppress — which is the same axis the 2512 release
notes claim to have fixed in the weights. `PromptStudio.html` line 527 **matches exactly**.
[HF card](https://huggingface.co/Qwen/Qwen-Image-2512/raw/main/README.md) ·
[repo README](https://github.com/QwenLM/Qwen-Image/blob/main/README.md) · accessed 2026-09-10.

**4. Official 2512 sampling is 50 steps / `true_cfg_scale=4.0`, not 20/4.** `[OFFICIAL]` The 2512
quick-start (both surfaces) uses `num_inference_steps=50, true_cfg_scale=4.0` at one of seven
enumerated aspect ratios, all ≈1.76 MP:

```python
aspect_ratios = {
    "1:1": (1328, 1328),
    "16:9": (1664, 928),
    "9:16": (928, 1664),
    "4:3": (1472, 1104),
    "3:4": (1104, 1472),
    "3:2": (1584, 1056),
    "2:3": (1056, 1584),
}
```

`_addenda/test-kit-2026-09.md` §T1 specifies the Qwen arm at "20 steps, cfg 4 … 1024×1024" from the
ComfyUI template. That is the *template's* default, not Qwen's; the two should not be conflated in
write-ups. The **1328×1328** figure is the vendor's 1:1.

**5. `true_cfg_scale` vs `guidance_scale` are different knobs and only Edit sets both.** `[OFFICIAL]`
2512 T2I passes `true_cfg_scale=4.0` and **no** `guidance_scale`. Edit-2511 passes
`"true_cfg_scale": 4.0` **and** `"guidance_scale": 1.0` together with `"num_inference_steps": 40`.
Confirms the 08-15 line and pins it to source.

**6. The recommended "no negative" value is a single space, not an empty string.** `[OFFICIAL]` Base
Qwen-Image: `negative_prompt = " " # Recommended if you don't use a negative prompt.` Edit-2511 and
Edit-2509 both pass `"negative_prompt": " "`. The corpus's "blank negative" is right in spirit but the
literal is `" "`.

**7. Prompt rewriting is *mandatory-by-recommendation* for Edit, in the vendor's own words.**
`[OFFICIAL]` README note, verbatim:

```text
We have observed that editing results may become unstable if prompt rewriting is not used. Therefore, we strongly recommend applying prompt rewriting to improve the stability of editing tasks.
```

The app's `qwenimg` target is text-to-image only; this is the strongest official argument for an
explicit Qwen **edit** dialect rather than reuse of the T2I one.

**8. Edit-2511's own official example is a native-Chinese instruction with an embedded quoted glyph
string.** `[OFFICIAL]` Verbatim from the README Edit-2511 snippet:

```text
prompt = "这个女生看着面前的电视屏幕，屏幕上面写着“阿里巴巴”"
```

Two things: the edit instruction language is **Chinese**, and the text to render is in **Chinese
curly quotes** inside a Chinese sentence — not the English `" "` the *edit rewriter* mandates (see the
diff section). The vendor's own example does not follow the vendor's own rewriter rule.

**9. Multi-image reference wording is inconsistent across official surfaces.** `[OFFICIAL]` Three
different first-party phrasings exist for the same operation:
- `prompt_utils.py` edit rewriter: **`picture 1` / `picture 2`** (*"Replace the girl of picture 1 with the boy of picture 2"*).
- README Edit-2509 example: no indices at all — **`"The magician bear is on the left, the alchemist bear is on the right"`** (spatial roles).
- README SGLang line: **`Figure 1` / `Figure 2`** (*"make the girl in Figure 1 dance with the capybara in Figure 2."*).

The corpus and the app both use **`image 1`**, which appears in *none* of the three. No first-party
statement ranks them. See "Contradicts current corpus / app".

**10. Lightning has a dedicated Day-0 2512 build.** `[OFFICIAL]` README: *"2025.12.31:
[Qwen-Image-Lightning](https://github.com/ModelTC/Qwen-Image-Lightning), developed by
[Lightx2v](https://github.com/ModelTC/LightX2V), provides
[Day 0 acceleration support for Qwen-Image-2512](https://huggingface.co/lightx2v/Qwen-Image-2512-Lightning)."*
Note the repo moved to the **`ModelTC/`** org and the 2512 LoRAs live in a **separate HF repo**
(`lightx2v/Qwen-Image-2512-Lightning`) from the 08-15 corpus link
(`lightx2v/Qwen-Image-Lightning`). Mixing the two repos' files is exactly the "mixing Lightning steps
across 2509/2511/2512" mistake the corpus already warns about — now with a concrete repo-level cause.

**11. Edit-2511 folds community LoRAs into the base weights.** `[OFFICIAL]` README showcase:
*"Qwen-Image-Edit-2511 integrates selected popular LoRAs directly into the base model, unlocking their
effects without extra tuning"*, naming a **Lighting Enhancement LoRA** and novel-viewpoint generation
as now working from the base model. Prompt consequence: relighting and new-view requests should be
phrased as plain edit instructions on 2511 rather than routed through a LoRA trigger word.

### Rewriter system prompts (verbatim diff)

Two rewriter files are live in `main` as of 2026-09-10. Both were fetched in full via
`raw.githubusercontent.com`:
- `src/examples/tools/prompt_utils_2512.py` — **current** T2I rewriter (`polish_prompt_en`, `polish_prompt_zh`).
- `src/examples/tools/prompt_utils.py` — **legacy** T2I rewriter *and* the **only** edit rewriter (`polish_edit_prompt`).

Scoped absence: `src/examples/tools/prompt_utils_2511.py` **404s**; no `_2601`, `_2.0` or edit-specific
2511 variant was found. The GitHub tree HTML for `src/examples/tools` and
`api.github.com/repos/.../contents/...` both returned empty bodies (the 09-03 tooling note holds), so
the directory could not be enumerated — the absence claim above rests on direct raw-URL probes plus
the README, which points only at `src/examples/tools/prompt_utils_2512.py` and
`src/examples/tools/prompt_utils.py`.

#### D1 — `magic_prompt` / `, Ultra HD, 4K, cinematic composition.`: three states, not one

The 09-03 digest erratum #5 is **CONFIRMED and refined**. `magic_prompt` is Qwen-Image's, and in the
**2512** rewriter it is dead code — but the string itself is *not* globally retired.

| Surface | Literal | Live? |
|---|---|---|
| `prompt_utils_2512.py` · `polish_prompt_en` | `magic_prompt = "Ultra HD, 4K, cinematic composition"` | **Dead** — assigned, never referenced; function ends `return polished_prompt` |
| `prompt_utils_2512.py` · `polish_prompt_zh` | `magic_prompt = "超清，4K，电影级构图"` | **Dead** — same pattern |
| `prompt_utils.py` (legacy) · `polish_prompt_en` | `magic_prompt = "Ultra HD, 4K, cinematic composition"` | **Live** — `return polished_prompt + magic_prompt` |
| `prompt_utils.py` (legacy) · `polish_prompt_zh` | `magic_prompt = "超清，4K，电影级构图"` | **Live** — `return polished_prompt + magic_prompt` |
| README base-Qwen-Image snippet (in `<details> Previous Version`) | `positive_magic = {"en": ", Ultra HD, 4K, cinematic composition.", "zh": ", 超清，4K，电影级构图."}` | **Live** — passed as `prompt=prompt + positive_magic["en"]` |
| README **2512** snippet · HF **2512** card | — | **Absent entirely** |

`[OFFICIAL]`, all rows from the files linked in §Sources, accessed 2026-09-10.

Three notes the corpus does not have. (a) The legacy concatenation is **`polished_prompt + magic_prompt`
with no separator** — the emitted string is `…composition.Ultra HD, 4K, cinematic composition`-style
run-on; the README variant is the one with the leading comma and trailing period. (b) So the correct
statement is *"retired for 2512; still officially appended for base Qwen-Image"*, not "retired". (c)
`magic_prompt` surviving as an unused local in the 2512 file is why a grep-based reading calls it
"present"; a call-graph reading calls it "gone". Both are true of different lines.

#### D2 — the "~200 words" figure is portrait-only in 2512, and global in the legacy file

`[OFFICIAL]` **Legacy** `polish_prompt_en`, task requirement 5 — a hard global cap:

```text
5. Please ensure that the Rewritten Prompt is less than 200 words.
```

**2512** `polish_prompt_en` — the number moved *inside* Subtask 1 (Portrait Image Rewriting) and became
a soft target:

```text
7. **Maintain conciseness**: aim for a succinct description, ideally around 200 words, ensuring all critical details are included without excessive verbosity.
```

There is **no length rule at all** in 2512's Core Requirements, in Subtask 2 (text-containing) or in
Subtask 3 (general). Subtask 3's only budget-like line is Core Requirement 2's *"Exercise restraint in
simple scenes to avoid unnecessary elaboration."*

And the **2512 Chinese** rewriter uses a *different number and a different unit*:

```text
7. **内容篇幅保持克制**：人像场景下，改写/扩写的内容篇幅保持简洁，输出控制在150字以内。
```

i.e. portrait scenes, **within 150 Chinese characters** — roughly 90–110 English words of content,
about half the English budget. The corpus (`qwen-image.md` §Official guidance and §Verbosity
calibration) and the app both present "about 200 words" as a whole-model target. It is neither
whole-model nor language-neutral.

#### D3 — EN and ZH 2512 rewriters *disagree* about structured output. Directly bears on T1.

`[OFFICIAL]` **EN** Core Requirement 1 — prose by default, with an explicit infographic carve-out:

```text
1. **Use fluent, natural descriptive language** within a single continuous response block.
    Strictly avoid formal Markdown lists (e.g., using • or *), numbered items, or headings. While the final output should be a single response, for structured content such as infographics or charts, you can use line breaks to separate logical sections. Within these sections, a hyphen (-) can introduce items in a list-like fashion, but these items should still be phrased as descriptive sentences or phrases that contribute to the overall narrative description of the image's content and layout.
```

`[OFFICIAL]` **ZH** Core Requirement 1 — prose, no carve-out, absolute:

```text
1. **使用流畅、自然的描述性语言**，以连贯形式输出，禁止使用列表、编号、标题或任何结构化格式。
```

The EN file backs the carve-out with worked examples: its Subtask-2 sample outputs contain literal
`\n` line breaks and hyphen-led lines (*"Top Section:\n- On the left, a group of five illustrated
people labeled …"*). The ZH file's Subtask-2 samples are unbroken paragraphs.

**What this settles and what it does not.** It settles that the vendor's own *default* is prose in both
languages, and that the only officially sanctioned structure is **line-broken sections with
hyphen-led descriptive sentences, in English, for infographics/charts** — which is *not* the
`Subject:/Pose:/Camera:/Lighting:` label block that Civitai 30826 `[LORE]` claims 2512 prefers
(`_addenda/test-kit-2026-09.md` §T1). No first-party surface anywhere in this sweep mentions
field labels of that form. It does **not** settle whether label blocks *work*: T1 is still the test
that answers that, and this finding narrows T1's (b) arm — a fair 2512-flavoured "structured" arm
would be hyphen-led sentences under line-broken section heads, not bare `Label:` tokens.

#### D4 — portrait field order: ZH is a hard order, EN explicitly is not

`[OFFICIAL]` **ZH** Subtask 1, rule 6:

```text
6. **控制输出顺序**: 针对人像场景，先描述人种，性别，年龄，再描述服装及饰品信息，再描述人物脸部及皮肤信息，再描述动作姿势，再描述背景相关信息。人像场景中输出先后顺序按照上述说明。
```

`[OFFICIAL]` **EN** Subtask 1, rule 6:

```text
6. **Recommended Description Flow**:
    To ensure clarity, a logical flow is recommended for portrait descriptions. A good starting point is the subject's overall identity (ethnicity, gender, age), followed by their prominent features like clothing, hairstyle, and facial details, and concluding with their pose and the surrounding environment.
    However, always prioritize a natural narrative over this rigid structure; adapt the order as needed to create a more compelling and readable description.
```

The corpus's `identity → clothing/accessories → face/skin → pose → background` is an exact rendering
of the **Chinese** rule. The English rule is (i) a *recommendation*, (ii) ordered
identity → clothing **and hairstyle** and facial details → pose → environment, and (iii) carries an
explicit override sentence. The app states the order as a hard rule with an arrow chain; that is
correct for Chinese output and overstated for English output.

#### D5 — the "no text" sentinel differs by language, and the app uses a third string

`[OFFICIAL]` EN Core Requirement 4: *"If no text appears in the image, explicitly state: **"The image
contains no recognizable text."**"* — but the EN file's own examples end **both** with that sentence
and with `No other text appears in the image.` (Subtask-2 examples use the latter).
ZH Core Requirement 4: `若图像无任何文字，必须明确说明：“图像中未出现任何可识别文字”。` — and the
ZH examples end `图像中未出现其他文字。`
The app instructs Chinese output to end `无其他文字。`, which matches neither the ZH rule string nor
the ZH example string. Low-stakes, but it is a byte-level divergence from an `[OFFICIAL]` literal.

#### D6 — quoting convention is language-split

`[OFFICIAL]` EN 2512: *"**enclose every piece of displayed text in English double quotation marks
(" ")**"*. ZH 2512: `**图像中显示的文字内容均使用中文双引号包含起来**`. The edit rewriter overrides
both with a single global rule: *"All text content must be enclosed in English double quotes `" "`.
Keep the original language of the text, and keep the capitalization."* — i.e. **T2I follows the
prompt's language, edit always uses ASCII quotes.** The app's ZH example uses `“ ”` (correct for T2I).

#### D7 — two legacy-only rules with no 2512 successor

`[OFFICIAL]` The legacy ZH rewriter carries a **no-negation rule** that vanished in 2512:

```text
8. 改写之后的prompt中不应该出现任何否定词。如：用户输入为“不要有筷子”，则改写之后的prompt中不应该出现筷子。
9. 除了用户明确要求书写的文字内容外，**禁止增加任何额外的文字内容**。
```

2512 has no equivalent of rule 8 anywhere; instead its own showcase prompts *use* negation freely
(*"No humans, text, or artificial traces present."*, `无人物，无文字`). Rule 9 survives in weakened,
conditional form as 2512 Core Requirement 2's *"Determine whether the image contains text. If not, do
not add any extraneous textual elements."*

The legacy EN rewriter's example bank is also the origin of the quality-tag style the corpus tells
students to avoid — legacy example 1 ends *"premium illustration quality, ultra-detailed CG, 32K
resolution, C4D rendering."* **No such tag pile appears anywhere in `prompt_utils_2512.py`.** So
"32K / C4D / ultra-detailed" is base-Qwen-Image official dialect that 2512 dropped; the corpus's
"Expert mistakes" entry is right for 2512 and would have been wrong for the August model.

#### D8 — the edit rewriter's fixed templates (not in the corpus at all)

`[OFFICIAL]` `polish_edit_prompt`'s `EDIT_SYSTEM_PROMPT` mandates three **exact** output strings:

```text
- **Colorization tasks (including old photo restoration) must use the fixed template:**
  "Restore and colorize the photo."
```
```text
- For inpainting tasks, always use the fixed template: "Perform inpainting on this image. The original caption is: ".
- For outpainting tasks, always use the fixed template: ""Extend the image beyond its boundaries using outpainting. The original caption is: ".
```

(The doubled `""` before *Extend* is verbatim from the file — a typo in the source, not a transcription
error here.) Also verbatim, the four task-type rules worth folding in:

```text
- If the instruction is clear (already includes task type, target entity, position, quantity, attributes), preserve the original intent and only refine the grammar.
```
```text
- **For expression changes / beauty / make up changes, they must be natural and subtle, never exaggerated.**
```
```text
- Emphasize maintaining the person’s core visual consistency (ethnicity, gender, age, hairstyle, expression, outfit, etc.).
```
```text
- Rewritten prompts must clearly point out which image’s element is being modified. For example:
    > Original: "Replace the subject of picture 1 with the subject of picture 2"
    > Rewritten: "Replace the girl of picture 1 with the boy of picture 2, keeping picture 2’s background unchanged"
```

Plus a hard structural fact the corpus lacks: the edit rewriter **returns JSON**, `{"Rewritten": "..."}`,
and it is driven by `qwen-vl-max-latest` with the image attached — so the official edit path is
**vision-conditioned**, unlike the T2I rewriter (text-only `qwen-plus`). Any local reimplementation
that feeds an edit instruction to a text-only LLM is not running the official recipe.

#### D9 — what did *not* change

The 2512 file's three-way classifier (portrait / text-containing / general), the "never modify proper
nouns" rule, the ban on vague placeholders (*"Avoid vague references like "a list" or "a roster""*
/ `拒绝出现“名单”，“列表”等模糊的文字暗示内容`), the demand for exact transcription including
*"punctuation, capitalization, line breaks, and layout direction"*, and the closing
*"**Do not explain, confirm, or add any extra responses—output only the rewritten prompt text.**"*
are all present and unchanged from the 08-15 structural digest. The 08-15 fingerprint quote
`“Maintain conciseness: aim for a succinct description, ideally around 200 words”` still resolves,
in the portrait subtask only (see D2). The second 08-15 fingerprint,
`“Keep the enhanced prompt direct and specific.”`, resolves in `polish_edit_prompt`, whose full text is
now recorded above rather than fingerprinted.

### STAFF quotes

The 09-03 STAFF harvest recorded **zero** vendor-badged replies for Qwen-Image. That result is confirmed
for the **Qwen** surfaces and reversed for the **Lightning** surface. Eight quotes below, three
speakers, all with role evidence.

**Scoped absence first, so nobody re-hunts it.** No reply by any account identifiable as Alibaba/Qwen
staff was found on: `Qwen/Qwen-Image-2512/discussions` (27 threads, index read in full),
`Qwen/Qwen-Image-Edit-2511/discussions` (31 threads, index read in full), or the open-issue list of
`QwenLM/Qwen-Image`. Three specific misses worth recording: the **"Prompt guide"** request
(Edit-2511 #7) was answered only by other users; **#22** ("Qwen Image 2512 ignores all `{}` and `|` in
prompts") has **no reply at all**; **#286** (multi-image composition, opened 2026-08-24) and **#283**
(2026-08-14) both sit unanswered. `QwenLM/Qwen-Image` now shows **"Issue creation is restricted in this
repository"** and issue **#285** is titled `3.0 都发布了, 这里都没有更新` ("3.0 is out and this place hasn't
been updated") — the GitHub surface should be treated as closed for support purposes.

**Role evidence.** `X-niper` = **Xiangyu Fan**, the first author in the Qwen-Image-Lightning citation
block (`author = {Xiangyu Fan and Zesong Qiu and Fanzhou Wang and Peng Gao and Lei Yang}`); the GitHub
profile title is literally "X-niper (Xiangyu Fan)".
[profile](https://github.com/X-niper) · [citation](https://github.com/ModelTC/Qwen-Image-Lightning#citation).
`lightx2v` is the HF org account and its posts carry the **`Owner`** badge on the repo.
`keizez3` answers in the project's first person ("we generate…", "In the distillation of Qwen-Image…")
inside threads X-niper is also answering, so treat as team member without a badge → `[STAFF-probable]`.

| # | Claim | Who (role evidence) | Verbatim | URL · date |
|---|---|---|---|---|
| S1 | Lightning LoRA **suppresses whole-image style-change edits**, and the vendor accepts the report | `X-niper` (Xiangyu Fan, Lightning first author) | *"Thank you for this feedback. We are addressing the issue and will publish updated models accordingly."* | [HF Lightning disc. 26](https://huggingface.co/lightx2v/Qwen-Image-Lightning/discussions/26) · 2025-11-03 |
| S2 | Step counts are **not interchangeable**; match the LoRA to the step count | `lightx2v` (**Owner** badge) | *"Technically, the 4-step model should not be used in 8-step inference. But the test shows it can be used in 8-step setting. We are not confident which model you should choose. Howerver, using 8-step model for 8step inference and 4-step model for 4step inference is a good choice."* (sic) | [HF Lightning disc. 4](https://huggingface.co/lightx2v/Qwen-Image-Lightning/discussions/4) · 2025-08-12 |
| S3 | Blurry Lightning output is usually a **ComfyUI version** problem, not a prompt or LoRA problem | `lightx2v` (**Owner** badge) | *"Hi, it may be related with comfyUI version."* | [HF Lightning disc. 11](https://huggingface.co/lightx2v/Qwen-Image-Lightning/discussions/11) · 2025-08-15 |
| S4 | fp8 grid artifacts are a **base-weight conversion** fault, now fixed two ways | `X-niper` | *"Hi, fp8_e4m3fn base model is now supported, please check the solution here"* (linking the repo's fp8 section) | [GH Lightning #32](https://github.com/ModelTC/LightX2V-Qwen-Image-Lightning/issues/32) · 2025-10 |
| S5 | T2I distillation used **prompts only**, ~420k of them | `X-niper` | *"Hi, we use about 420 k items"* | [HF Lightning disc. 17](https://huggingface.co/lightx2v/Qwen-Image-Lightning/discussions/17) · 2025-09-10 |
| S6 | Edit distillation used **120k prompt–image pairs**; T2I used prompts alone | `keizez3` `[STAFF-probable]` | *"Yes. For the qwen edit model, we generate 120k prompt image pairs."* and *"Yes. In the distillation of Qwen-Image, only prompts are used. For Qwen-Image-Edit, both prompt–image pairs are used."* | [HF Lightning disc. 17](https://huggingface.co/lightx2v/Qwen-Image-Lightning/discussions/17) · 2025-09-11 / 09-17 |
| S7 | The distillation prompt set was **built by category**, and the categories match the 2512 rewriter's own classifier | `X-niper` | *"We divide the images into several categories, e.g., human, scene, pure-text, scene with text. For each category, we have some example prompts for MLM, and let MLM understand the image and decide whether the example prompt is applicable… For example, the input example prompt is like "remove some object in the image" and we give it a image like "a girl wearing t-shirt is drinking, sitting in front of a table". Then the MLM will output prompt like "remove the table in this figure""* | [HF Lightning disc. 17](https://huggingface.co/lightx2v/Qwen-Image-Lightning/discussions/17) · 2025-09-12 |
| S8 | The distillation set is **not releasable** — so nobody can audit the Lightning prompt distribution | `X-niper` | *"Hi, we are sorry that we are not allowed to release the dataset…"* | [HF Lightning disc. 17](https://huggingface.co/lightx2v/Qwen-Image-Lightning/discussions/17) · 2025-09-12 |

**S7 is the highest-value one for the app.** In the same post X-niper pasted the actual edit prompts
used in distillation. Verbatim, the object-level set:

```text
"text_annot": "Add a French flag to the world map near Europe."
"text_annot": "Replace the background with a serene sunset scene featuring warm orange and pink hues, with silhouettes of people strolling along the pier."
"text_annot": "Add a small pond with lily pads in the background to create a more natural habitat for the snail."
"text_annot": "Add a person wearing a high-visibility vest operating the machine near the top left corner for scale and context."
"text_annot": "Remove the graffiti from the red train car."
"text_annot": "Keep the front view of the image."
"text_annot": "Replace the man's striped sweater with a solid olive green sweater."
"text_annot": "Add a pair of black-rimmed glasses to the person's face and change the background to a cyberpunk style with neon lights and futuristic architecture."
"text_annot": "Add a leopard-print scarf around the woman's neck, positioning it slightly tilted to the right."
"text_annot": "Replace the doctor's white coat with a blue lab coat."
```

and — new to the corpus — a distinct **text-editing dialect**, verbatim:

```text
"text_annot": "append 'SIMON' at lower-center"
"text_annot": "withdraw '很有意' from the text"
"text_annot": "extend 'gj.0048 一直远离陆地，所以许多 大部分简直可以' at center"
"text_annot": "enlarge 'restaurant' at lower-center"
"text_annot": "convert 'Supplies' with 'Ban'"
"text_annot": "排除 '染病没有能再' from the text"
```

Read the shape, not the wording: **verb + single-quoted exact string + `at <position>`**, where
position is a compass-ish cell (`lower-center`, `center`), the quoted string keeps its own language,
and the whole instruction is one clause. Note also that the verbs are odd (`withdraw`, `convert X with
Y`, `排除`) — MLM-generated, not curated — which is itself an argument for keeping *your* text-edit
instructions short and positional rather than eloquent. `[STAFF]` for what Lightning was aligned to;
`[SPECULATION]` for any claim that this dialect outperforms plain English on the **base** (non-Lightning)
Edit weights — nobody has tested that.

### Chinese sources

**C1 — `prompt_extend` is on by default in the cloud, and Alibaba tells you to turn it off when you
want control.** `[OFFICIAL]` The Qwen-Image API page's FAQ, verbatim:

```text
Q：prompt_extend参数应该开启还是关闭？
A：如果希望图像内容更多样化，由模型补充细节，建议开启此选项（默认）。如果图像细节更可控，建议关闭此选项，并参考[文生图Prompt指南]进行优化，
```

("If you want more varied content and want the model to fill in detail, leave it on (the default). If
you want the detail more controllable, turn it off and optimise the prompt using the text-to-image
Prompt guide.") This is the clearest first-party statement anywhere that **the rewriter and a
hand-written prompt are alternatives, not a pipeline** — which is exactly the app's teaching stance.
The trailing comma is in the source. [help.aliyun.com/zh/model-studio/qwen-image-api](https://help.aliyun.com/zh/model-studio/qwen-image-api) · accessed 2026-09-10.

**C2 — hard, verbatim length limits, in *characters*, silently truncated.** `[OFFICIAL]` Same page,
parameter table:

```text
prompt string（必选）
正向提示词，用来描述生成图像中期望包含的元素和视觉特点。
支持中英文，长度不超过800个字符，每个汉字、字母、数字或符号计为一个字符，超出部分将自动截断。
```
```text
negative_prompt string（可选）
反向提示词，用于描述不希望在图像中出现的内容，对画面进行限制。
支持中英文，长度不超过500个字符，超出部分将自动截断。
示例值：低分辨率，低画质，肢体畸形，手指畸形，画面过饱和，蜡像感，人脸无细节，过度光滑，画面具有AI感。构图混乱。文字模糊，扭曲。
```

Three corrections to the corpus's "API limits vary: … 800 tokens/characters; 2.0 models 1300 tokens"
line: (a) the unit is **characters**, defined explicitly as *"每个汉字、字母、数字或符号计为一个字符"*
— one Han character counts the same as one Latin letter, so 800 characters is far more content in
Chinese than in English; (b) there is a separate, tighter **500-character cap on the negative**;
(c) **overflow is silently truncated**, not rejected — a long prompt loses its tail without warning.
Scoped absence: **no "1300" and no token-denominated limit appears anywhere on the 2026-09-10 revision
of that page**; the corpus's 1300-token claim could not be re-sourced this sweep.

**C3 — the cloud lineup, for telling students what is and is not the local model.** `[OFFICIAL]` Same
FAQ, `qwen-image-2.0-pro` / `-2026-04-22` and `qwen-image-2.0` / `-2026-03-03` are described as
**图像生成与编辑融合模型** (unified generate+edit), *"仅支持同步接口"*; `qwen-image-max` /
`-2025-12-30` is the T2I line *"相较于qwen-image-plus提升了生成图像的真实感与自然度，在人物质感、纹理细节
和文字渲染等方面效果更佳"* — the 2512 improvement axes, restated for the API tier;
`qwen-image-plus-2026-01-09` is *"qwen-image-max的蒸馏加速版"*. None of these are the local weights.

**C4 — Alibaba's official Chinese image-prompt guide is scoped to Wanxiang, not Qwen-Image.**
`[OFFICIAL]` The guide the Qwen-Image FAQ sends you to,
[文生图Prompt指南](https://help.aliyun.com/zh/model-studio/text-to-image-prompt) (page `meta-last-modified:
2026-09-02`), declares its 适用范围 as **万相-文生图V2** and **万相-文生图V1** only. So: the *only*
first-party Chinese image-prompting guide on Model Studio is a **Wan/Wanxiang** document that
Qwen-Image's own API page recommends by reference. Anything borrowed from it into a Qwen context must
be attributed as Wanxiang vocabulary — the same discipline `wan22.md` item 7 already applies in the
other direction. It publishes two formulas, verbatim:

```text
提示词 = 主体 + 场景 + 风格
```
```text
提示词 = 主体（主体描述）+ 场景（场景描述）+ 风格（定义风格）+ 镜头语言 + 氛围词 + 细节修饰
```

and a five-axis 提示词词典: **景别** (远景/全景/中景/近景/特写), **视角** (平视/俯视/仰视/航拍),
**镜头拍摄类型** (微距/超广角/长焦/鱼眼), **风格** (3D卡通/废土风/点彩画/超现实/水彩/粘土/写实/陶瓷/3D/
水墨/折纸/工笔/国风水墨), **光线** (自然光/逆光/霓虹灯/氛围光). Its worked examples lean on
`|`-separated lead tokens (`特写镜头 |`, `航拍视角 |`) and end-of-prompt tag piles
(`4K`, `32k超高清`, `C4D渲染`, `辛烷值渲染`, `最佳品质`) — i.e. the **base-Qwen-Image / Wanxiang** dialect
that `prompt_utils_2512.py` abandoned (see D7). Do not fold its tag-pile habit into the Qwen-Image
2512 dialect.

**C5 — 2512's own text-rendering showcase is Chinese, and it is long prose.** `[OFFICIAL]` All four of
the 2512 card's "Improved Text Rendering" exemplars are **Chinese paragraphs**, three of them well past
400 characters, each enumerating exact quoted strings in reading order (`从左向右依次写着：“…”“…”“…”`,
`第一行分别是…；第二行分别是…`). The PPT-roadmap prompt and the 3×4 grid poster prompt are the two most
useful models for students who want infographics. See "Few-shot gold" for a corpus-format pair built on
this pattern.

**C6 — ModelScope adds nothing and has not been revised.** `[OFFICIAL]` `modelscope.cn/api/v1/models/
Qwen/Qwen-Image-2512` returns `LastUpdatedTime: 1767175036` (**2025-12-31**), `TriggerWords: null`,
`License: apache-2.0`, `Downloads: 409936`, and a `ReadMeContent` that is the HF card verbatim — no
Chinese-only prompting text. Its Muse tags are `写实摄影` / `画面控制`. So the ZH mirror carries **no**
guidance the EN card lacks, and the card itself has had **no revision since release**.

**Machine-translation risk.** All Chinese in this section is quoted verbatim from first-party pages;
the parenthetical English is this agent's gloss and is not authoritative. The Aliyun page was fetched
as rendered HTML→text, so table cells arrive concatenated — the two parameter blocks in C2 are
reassembled from a single source line and the field boundaries (`prompt` vs `negative_prompt`) were
read off the surrounding `string（必选）`/`（可选）` markers, not from visual layout.

### Tested findings

**T-a — Lightning's own vendor-run comparison names four regimes where distillation costs you, and
they are prompt-shaped.** `[TESTED]` (vendor-run, no seeds published, reproduction script provided).
From the Lightning README's "T2I Performance Report", the section headings are the finding:
*"Dense or Small Text Rendering — In scenarios involving dense or small text, the base model is more
likely to produce better results."*; *"Hair-like Details — … the base model demonstrates superior
rendering fidelity, whereas the distilled models may yield outputs that appear either noticeably
blurred or excessively sharpened."*; *"Highly Complex Scenes — In highly complex scenes, all three
models may fail to produce satisfactory results."*; and, importantly for anyone drawing conclusions
from a single grid, *"Inconsistencies in Model Rankings Across Test Cases — … Even for the same prompt
at different resolutions, the relative performance ranking of the models may differ substantially."*
Teaching consequence: a prompt heavy in small text (the Hong Kong neon-signs exemplar with 23 quoted
shop names is their own failure case) should be run **non-distilled**, and any A/B a student runs at
one resolution does not generalise to another.
[README](https://github.com/ModelTC/Qwen-Image-Lightning#-t2i-performance-report) · accessed 2026-09-10.

**T-b — the edit report's failure captions are text-rendering failures, at every step count.**
`[TESTED]` (vendor-run). For `Replace the words 'HEALTH INSURANCE' on the letter blocks with
'Tomorrow will be better'.` the captions read *"Bad case: the first "m" appears as "mn" due to an extra
stroke."* (base, NFE=100), and *"Bad case: the letter "o" is missing."* (4-step). For the Chinese
variant, *"Bad case: an extra "更" is generated."* (8-step). For a longer overlay string,
*"Bad case: incorrect spelling "Lightx2V"."* / *"incorrect spelling "editing with""* / *"Failure
case."* So **exact-string edits degrade with string length independent of steps** — the corpus's
"supply every exact word" rule is necessary but not sufficient, and short strings are materially safer.

**T-c — Lightning at 4 steps collapses seed variance.** `[LORE]`, n≈3 independent reporters, no seeds
or grids published, **unanswered by the maintainers**: *"I'm testing the 4-step version and for the
same prompt, different seeds produce very similar, almost identical images. I also noticed something
similar on the 8-step. With the 50-step base model the variety is much more noticeable."*
([disc. 6](https://huggingface.co/lightx2v/Qwen-Image-Lightning/discussions/6), 2025-08-12); *"the 4
step model is fast at generating very static and very identical images"*
([disc. 4](https://huggingface.co/lightx2v/Qwen-Image-Lightning/discussions/4), 2025-08-17). A
community workaround is recorded in the same thread and is **`[LORE]`, untested by its own poster**:
*"VAE encode an image of the size you're generating and use that as the "empty latent" w a denoise of
like .95."* This directly undercuts the corpus's standing advice to "sample multiple fixed-setting
seeds because role binding is not guaranteed": **at 4 steps, extra seeds may buy you nothing.** The
advice should be conditioned on running non-distilled, or on varying something other than the seed.

**T-d — a maximal English "hard constraints" bullet block fails on Edit-2511 multi-image.** `[LORE]`,
n=1, images attached, unanswered. GitHub #286 (2026-08-24) documents a real workflow: composing two
cars from two images works; adding a **third** car onto the already-composed two-car image does not —
*"模型会按 2 辆重画，丢掉新增那辆"* (the model repaints as two cars and drops the new one), and
*"换顺序、放宽布局、换成差异很大的红车都不行"* (reordering, loosening the layout, and swapping in a
visually very different red car all fail). The prompt used is reproduced in the issue: a Chinese lead
sentence followed by **thirteen English `Hard constraints:` bullets** dense with shouted negation
(`Do NOT omit, merge, replace, or invent cars.`, `NEVER stack one car on top of another`,
`REMOVE any 'AI生成' … watermark badges`). Two readings, both worth teaching: the **capability** may
simply not exist (insert-into-an-already-composed-scene is not among the vendor's Edit-2511 claims),
and the **encoding** is the opposite of every first-party edit exemplar, which are one-clause
imperatives. It also mixes languages mid-prompt, against `_cross/chinese-prompting.md` rule 3.
[issue #286](https://github.com/QwenLM/Qwen-Image/issues/286) · accessed 2026-09-10.

**T-e — prose vs label blocks: first-party evidence now exists, and it points at prose.** `[OFFICIAL]`
rather than `[TESTED]`, and the distinction matters. Every prompt the vendor publishes for 2512 — the
quick-start snippet, all four portrait showcases, all four nature showcases, all four text-rendering
showcases, plus the eleven portrait and thirteen text exemplars inside `prompt_utils_2512.py` — is
**continuous prose**. Zero use `Subject:` / `Pose:` / `Camera:` / `Lighting:` labels. The rewriter
*forbids* headings and numbered lists outright in Chinese and permits only line-broken,
hyphen-led **descriptive sentences** for infographics in English (D3). Against that, `Civitai 30826`
`[LORE]` claims 2512 prefers label blocks; that claim has no grids, and it now also has no first-party
support on any surface searched. **This does not close T1** — "the vendor writes prose" is not "labels
score worse" — but it changes T1's status from *open question* to *challenge to a lone unsupported
claim*, and it argues for re-specifying T1's (b) arm as line-broken hyphen-led sentences (the only
structured form the vendor sanctions) alongside, or instead of, bare `Label:` tokens.
On arXiv **2606.03715**: the paper's result is scoped to **FLUX.2 klein-4B** per `flux.md` §2026-09
item 10; **no Qwen-Image arm was found** in any Qwen-Image surface this sweep, and the paper was not
re-fetched here. Recorded as still-open in the nothing-found register.

**T-f — `{}` / `|` wildcard syntax is inert in the 2512 ComfyUI path.** `[LORE]`, n=1, unanswered:
*"Qwen Image 2512 ignores all {} and | in prompts. No way to randomize subjects etc in prompts now. …
Using the template in comfyui for Qwen Image 2512."*
([2512 disc. 22](https://huggingface.co/Qwen/Qwen-Image-2512/discussions/22), 2026-01-17). Almost
certainly a ComfyUI dynamic-prompt frontend question rather than a model one, but it is the exact
confusion a student will hit, and it is worth a one-line GOTCHA: **dynamic-prompt braces are a
front-end feature; if the node does not expand them, the model sees the literal braces.**

### Contradicts current corpus / app

Ordered by how much the app would change. "App" = `PromptStudio.html` `TARGETS.qwenimg.system`
(lines ~776–803) and `QWENIMG_NEG` (line 527), read-only this sweep.

**X1 — "about 200 words" is applied far too broadly, in both the corpus and the app.**
*Corpus:* `qwen-image.md` line 8 ("Target is about 200 words") and line 50 ("Official 2512 rewriter:
ideally about 200 words"). *App:* line 783, *"Aim for about 200 words of direct, specific prose"* as a
global rule. *Source:* D2. The figure lives **only** inside the English rewriter's **Subtask 1
(Portrait)**; text-containing and general images have no length rule at all, and the **Chinese**
rewriter's portrait budget is a different number in a different unit (**150 字**). Suggested repair:
make the budget conditional — portrait EN ≈200 words, portrait ZH ≤150 characters, text/general
"as long as every exact string and spatial relation is stated, and no longer". Risk: low; it loosens a
constraint the vendor never imposed. Grade `[OFFICIAL]`.

**X2 — the portrait field order is a hard rule in Chinese and an explicitly overridable suggestion in
English.** *Corpus:* line 8. *App:* line 784 states it as an arrow chain with no escape. *Source:* D4;
the EN rewriter adds *"always prioritize a natural narrative over this rigid structure; adapt the order
as needed."* Suggested repair: keep the order as the default, add "prefer a natural sentence order when
the fixed order reads badly" for English output only. Risk: low. Grade `[OFFICIAL]`.

**X3 — "that suffix is officially retired" is true only for 2512.** *App:* line 787, *"Do NOT append
"Ultra HD, 4K, cinematic composition" — that suffix is officially retired."* *Source:* D1. It is still
appended by the **legacy** rewriter (`return polished_prompt + magic_prompt`) and still passed as
`prompt + positive_magic["en"]` in the README's base-Qwen-Image snippet. Suggested repair: change
"officially retired" to "dropped for 2512 (still used by base Qwen-Image)". Risk: low, but the current
wording would mislead a student running base Qwen-Image weights, which is the checkpoint the *only*
`docs.comfy.org/tutorials/image/qwen/qwen-image` page documents. Grade `[OFFICIAL]`.

**X4 — the app's Chinese no-text sentinel matches no official string.** *App:* line 786, *"(Chinese
output: 无其他文字。)"*. *Source:* D5. The ZH rewriter's **rule** string is
`图像中未出现任何可识别文字`; its **examples** end `图像中未出现其他文字。` Suggested repair: use
`图像中未出现其他文字。` (the example form the model was shown most often) or the rule form; either is
sourced, `无其他文字。` is not. Risk: negligible. Grade `[OFFICIAL]`.

**X5 — multi-image role binding: the corpus uses a phrasing that appears on no official surface.**
*Corpus:* line 36 and Pair 5 use `image 1` / `image 2` / `image 3`. *Source:* §New official guidance
item 9 — the official edit rewriter says **`picture 1` / `picture 2`**, the README's Edit-2509 example
uses **spatial roles with no index at all**, and the SGLang line uses **`Figure 1` / `Figure 2`**.
Suggested repair: do not "fix" the corpus to one form — record that at least four forms circulate
(`image N` is also what real users write, cf. GH #286's `Image1`/`Image2`) and that **no first-party
source ranks them**. This is a clean, cheap in-house test the maintainer could add to the kit. Risk:
none if stated as unresolved; medium if the app asserts one form is correct. Grade `[OFFICIAL]` for the
three official variants, `[SPECULATION]` for any ranking.

**X6 — the corpus's own "expert mistake" about `4K/32K/C4D` piles is right for 2512 and wrong for
August.** *Corpus:* "Expert mistakes" bullet 1 and "Verbosity calibration" ("Noise: 4K/32K/C4D piles").
*Source:* D7 — the **legacy** rewriter's example bank ends prompts with *"premium illustration quality,
ultra-detailed CG, 32K resolution, C4D rendering."*, and C4 shows Alibaba's live Chinese image guide
still teaching `4K` / `32k超高清` / `C4D渲染` / `辛烷值渲染` for Wanxiang. Suggested repair: version-stamp
the rule — "noise **on 2512**; official dialect on base Qwen-Image and on Wanxiang". Risk: low.
Grade `[OFFICIAL]`.

**X7 — "sample multiple fixed-setting seeds" is bad advice at Lightning step counts.** *Corpus:*
"Motion / composition control" last bullet and Validator suggestion 7. *Source:* T-c — multiple
independent reports of near-identical output across seeds at 4 and 8 steps, unrebutted by the
maintainers. Suggested repair: condition the advice — "vary seeds on the **non-distilled** model; at
4/8 steps expect little seed variance, so vary the prompt or the reference instead." Risk: low.
Grade `[LORE]` (n≈3, no grids) — flag as needing a cheap in-house check.

**X8 — the corpus's Edit-2511 recipe is right but under-specified, and the sampling numbers for 2512
are missing.** *Corpus:* line 9 / line 58 ("true CFG 4, guidance 1, 40 steps, blank negative"). Correct,
but the blank is literally `" "`, and the corpus records **no** 2512 T2I recipe at all. *Source:*
§New official guidance items 4–6 plus the Lightning README's own reproduction commands: base
Qwen-Image **50 / cfg 4.0**, Qwen-Image-2512 **50 / cfg 4.0**, Qwen-Image-Edit **50 / 4.0**,
Edit-2509 **40 / 4.0**, Edit-2511 **40 / 4.0**, every Lightning arm **cfg 1.0** at its own step count.
Risk: none — pure addition.

**X9 — the test kit's "the 2512 ComfyUI filename could not be confirmed" is now closed.**
*`_addenda/test-kit-2026-09.md`* §T1 model files, and its open-items table row "**Qwen-Image-2512**
workflow". *Source:* `docs.comfy.org/tutorials/image/qwen/qwen-image-2512` exists and names
`qwen_image_2512_fp8_e4m3fn.safetensors` (recommended) and `qwen_image_2512_bf16.safetensors`, text
encoder `qwen_2.5_vl_7b_fp8_scaled.safetensors`, VAE `qwen_image_vae.safetensors`, template
**`image_qwen_Image_2512`** with **two subgraphs** — *"Text to Image (Qwen-Image 2512): Standard
50-step generation"* and *"Text to Image (Qwen-Image 2512 4steps): Accelerated 4-step generation using
Lightning LoRA"* with `Qwen-Image-Lightning-4steps-V1.0.safetensors`. The Edit-2511 template
`image_qwen_image_edit_2511` likewise exists (`qwen_image_edit_2511_bf16.safetensors` +
`Qwen-Image-Edit-2511-Lightning-4steps-V1.0-bf16.safetensors`). **Note the step mismatch**: the T1
design says "20 steps, cfg 4" from the base template; the 2512 template's own standard subgraph is
**50**. Risk: the T1 Qwen arm would be run off-recipe as written. Grade `[OFFICIAL]`.

**X10 — the app has no Qwen *edit* dialect, and the vendor says edits are unstable without rewriting.**
*App:* `TARGETS.qwenimg` is text-to-image only. *Source:* §New official guidance item 7 (verbatim
*"editing results may become unstable if prompt rewriting is not used"*) plus D8's fixed templates and
the fact that the official edit rewriter is **vision-conditioned** (`qwen-vl-max-latest` with the image
attached). A text-only local reimplementation is not the official recipe and should say so. Risk:
medium — a new target is real work; but at minimum the app's Qwen card should carry the three fixed
templates and the "one clause, one changed property" rule. Grade `[OFFICIAL]`.

**X11 — Lightning suppresses whole-image style-change edits, which no corpus line mentions.**
*Corpus:* the Lightning bullet (line 59) covers only "quality/adherence tradeoffs at 4/8 steps".
*Source:* S1 — a first-author acknowledgement that style-change edits are blocked by the Edit Lightning
LoRA, with the user-side observation *"the very first step seems to start off with the style change,
and then snaps back to erasing the style thereafter"*. Suggested repair: add "if a style-transfer edit
refuses to take, disable the Lightning LoRA before rewording the prompt." Risk: low; `[STAFF]` +
`[LORE]`.

**X12 — the fp8 grid-artifact trap is a prompt-adjacent gotcha the corpus lacks entirely.**
*Source:* the Lightning README's fp8 section plus S4. `qwen_image_fp8_e4m3fn.safetensors` was produced
*"by directly downcasting the original bf16 weights, rather than employing a calibrated conversion
process with appropriate scaling"*, so a bf16-trained Lightning LoRA on top of it yields a grid
pattern. Fixes: use the fp8-trained LoRA, or the scaled fp8 base
(`qwen_image_fp8_e4m3fn_scaled.safetensors`), or a bf16 base. This is exactly the symptom behind 2512
discussion **#10 "Prevent grid artifact?"** (5 👍, unanswered). A student will read grid artifacts as a
prompt failure. Risk: none — pure addition. Grade `[OFFICIAL]` (vendor README) + `[STAFF]`.

**Explicitly *not* a contradiction:** the app's `QWENIMG_NEG` is byte-identical to the official 2512
negative on three independent first-party surfaces (repo README, HF card, Aliyun API example value).
Leave it exactly as it is, including the two mid-string `。`.

### Few-shot gold (new pairs)

### Pair 6 — infographic / slide with dense text [OFFICIAL-PATTERN]
INTENT: A one-slide "how to read a wine label" explainer with real copy.
PROMPT-EN:
A modern presentation slide on a deep navy gradient background. Centered at the top, bold white sans-serif text reads "How to Read a Wine Label". Below it, a photorealistic bottle stands on the left at three-quarter view, its cream paper label lit by soft directional light from the upper left. Four thin cyan leader lines run from the label to four rounded rectangles stacked on the right, each holding one line of white text: "1. Producer — Château Beaumont", "2. Appellation — Haut-Médoc", "3. Vintage — 2019", "4. Alcohol — 13.5% vol". A single line of small grey text sits centered at the bottom: "Front label only; back labels vary by market." Clean layout, generous margins, restrained navy-and-cyan palette, no other text.
PROMPT-ZH:
一张现代风格的演示幻灯片，采用深藏青色渐变背景。顶部居中以白色无衬线粗体写着“如何看懂葡萄酒酒标”。下方左侧是一只写实的葡萄酒瓶，呈四分之三侧视，米白色纸质酒标被左上方柔和的方向光照亮。四条细青色引线从酒标连向右侧竖排的四个圆角矩形，框内各一行白色文字，从上到下依次写着：“1. 酒庄——博蒙城堡”“2. 产区——上梅多克”“3. 年份——2019”“4. 酒精度——13.5% vol”。底部居中有一行灰色小字：“仅为正标；背标因市场而异。”版式干净，留白充足，藏青与青色配色克制，图像中未出现其他文字。
NOTES: Built on the 2512 card's own text-rendering exemplars (`从左向右依次写着：“…”“…”`). Every
string is exact and carried by a named element; the reading order is stated; the ZH ends with the
official-example sentinel `图像中未出现其他文字。` (X4). Deliberately **prose, not a label block** —
this is the shape the vendor uses for exactly this task (D3, T-e). Numerals, `%` and `vol` are left
untranslated, per the rewriter's proper-noun rule.

### Pair 7 — Edit-2511 text replacement [OFFICIAL-PATTERN + STAFF-PATTERN]
INTENT: Change the shop sign in a photo from "BAKERY" to "面包坊", keep everything else.
PROMPT-EN:
Replace the text "BAKERY" on the shop awning with "面包坊". Keep the original serif letterforms' weight and the same warm cream color, keep the text centered on the awning at the same size, and keep the awning's stripes, the shopfront, the window display, the pavement and the daylight exactly as they are. Change nothing else in the image.
PROMPT-ZH:
将店铺遮阳篷上的文字“BAKERY”替换为“面包坊”。保持原有衬线字形的粗细与同样的暖米色，文字仍居中于遮阳篷且大小不变，遮阳篷条纹、店面、橱窗陈列、人行道与日光全部保持原样。图像中其他内容不做任何改动。
NOTES: Follows the official edit rewriter's text rule — *"Both adding new text and replacing existing
text are text replacement tasks … Replace "xx" to "yy""* — and its ID rule (*"keep … unchanged"*).
One clause, one changed property, then an explicit preservation list; this is the opposite of the
thirteen-bullet block that failed in T-d. Compare the Lightning distillation dialect (S7):
`convert 'Supplies' with 'Ban'`, `append 'SIMON' at lower-center` — verb, exact quoted string,
position. Both target strings are short: per T-b, exact-string edits degrade with length. Note the
official edit rewriter mandates **ASCII** `" "` quotes even around Han text (D6), which is why the EN
side uses straight quotes around 面包坊.

### Pair 8 — anti-AI-look realism portrait [OFFICIAL-PATTERN]
INTENT: A believable candid photo of an older tradesman, not a glossy render.
PROMPT-EN:
A 62-year-old Portuguese man, a boat carpenter, broad-shouldered, with a square face, deep crow's feet, a grey stubbled beard, sun-weathered olive skin with visible pores and a healed scar on his left thumb. He wears a faded blue cotton work shirt with rolled sleeves and a canvas apron dusted with sawdust. He stands at a bench in an open boatshed, one hand resting on a half-planed cedar plank, head turned slightly toward the doorway, mouth closed in a plain, unposed expression. Lighting is ordinary overcast daylight from the open doors — no staged lighting, no rim light — and the image resembles a casual phone snapshot: unpretentious composition, natural colour, high clarity. The image contains no recognizable text.
PROMPT-ZH:
一名62岁的葡萄牙男性造船木匠，肩膀宽阔，方脸，眼角皱纹很深，灰白胡茬，皮肤为日晒后的橄榄色，毛孔清晰可见，左手拇指有一道愈合的疤痕。他身穿褪色的蓝色棉质工作衫，袖子卷起，外系沾满木屑的帆布围裙。他站在敞开的船棚工作台前，一只手搭在刨了一半的雪松木板上，头略微转向门口，双唇闭合，表情平实自然，未刻意摆拍。光线是从敞开的大门照入的普通阴天日光——没有布光，没有轮廓光——画面如同随手用手机拍下的快照：构图朴素，色彩自然，清晰度高。图像中未出现其他文字。
NOTES: Uses 2512's own anti-"AI look" idiom, lifted from the official quick-start prompt —
*"Lighting is typical indoor illumination—no staged lighting—and the image resembles a casual iPhone
snapshot: unpretentious composition"*. Age is a **specific number**, not "old" (the rewriter bans
"young"/"old"). Follows the ZH field order 人种/性别/年龄 → 服装及饰品 → 脸部及皮肤 → 动作姿势 → 背景
(D4). The ZH side is 197 characters — over the ZH rewriter's 150-字 portrait budget (D2), which is the
point: **that budget governs the rewriter's output, not what a human may write**; trim the scar and the
sleeve detail if you want to sit inside it. Pairs with `QWENIMG_NEG`, whose `画面具有AI感` and
`过度光滑` push the same axis from the negative side.

### Validator changes

Additions and edits to the existing "Validator suggestions" list, each traceable to a finding above.

1. **Make the length rule conditional on class *and* language** (X1/D2). Replace the single 80–220-word
   window with: `portrait+EN → 120–240 words`; `portrait+ZH → warn above 150 汉字`; `text|general →
   no upper bound, but require every quoted string to have a carrier and a position`.
2. **Add a hard character cap check for the cloud path** (C2): warn at >800 characters for the prompt
   and >500 for the negative, counting **每个汉字、字母、数字或符号** as one, and say *why* — the tail is
   silently truncated, not rejected. Local pipelines are not bound by this; label the warning as
   API-scoped.
3. **Stop asserting the portrait order for English output** (X2). Downgrade the order check to
   informational when the output language is English; keep it as a rule for Chinese.
4. **Fix the ZH no-text sentinel** (X4): accept `图像中未出现其他文字。` or
   `图像中未出现任何可识别文字`; stop emitting `无其他文字。`.
5. **Version-gate the `magic_prompt` check** (X3/D1): flag `Ultra HD, 4K, cinematic composition` /
   `超清，4K，电影级构图` only when the declared checkpoint is **2512**; on base Qwen-Image it is the
   official suffix. Same gate for the `32K / C4D / 辛烷值渲染` tag-pile warning (X6).
6. **Quote-character rule, split by task** (D6): T2I must use the prompt language's own quotes
   (`" "` in English, `“ ”` in Chinese); **edit** prompts must use ASCII `" "` even around Han text.
7. **Edit-prompt structure check** (X10/D8/T-d): require the shape *one imperative naming the changed
   property → explicit preservation clause*; **reject** prompts containing more than ~4 bullet lines
   of constraints or more than two shouted negations (`Do NOT`, `NEVER`), and point at T-d. Recognise
   the three fixed templates verbatim and do not rewrite them:
   `Restore and colorize the photo.` ·
   `Perform inpainting on this image. The original caption is: ` ·
   `Extend the image beyond its boundaries using outpainting. The original caption is: `.
8. **Multi-image reference form** (X5): keep requiring one explicit role per supplied image, but accept
   `image N`, `picture N`, `Figure N` **and** unindexed spatial roles ("on the left / on the right"),
   since all four appear on first-party surfaces and none is ranked. Emit an informational note, not an
   error.
9. **Text-length risk warning** (T-b): when an edit or T2I prompt requests a rendered string longer than
   ~24 characters, warn that vendor-run tests show spelling failures at that length **at every step
   count**, and suggest splitting into shorter strings.
10. **Lightning profile checks** (S2/X7/X11/X12), all recipe-level:
    - LoRA step count must equal the sampler step count (S2: "4-step for 4-step, 8-step for 8-step").
    - LoRA family must match the checkpoint family: `Qwen-Image-2512-Lightning-4steps-V1.0-*` only with
      2512; `Qwen-Image-Edit-2511-Lightning-4steps-V1.0-*` only with Edit-2511. **There is no 8-step
      build for either 2512 or Edit-2511** as of 2026-09-10.
    - Any Lightning arm implies `cfg 1.0`; non-distilled implies `true_cfg_scale 4.0`, with
      50 steps (T2I, base and 2512) or 40 steps (Edit-2509/2511).
    - If the base is `qwen_image_fp8_e4m3fn.safetensors` and the LoRA is a bf16-trained one, warn about
      grid artifacts and name the three fixes (X12).
    - If a style-transfer **edit** is requested with a Lightning LoRA loaded, warn that the vendor has
      acknowledged style changes being suppressed and suggest disabling the LoRA before rewording (X11).
    - Suppress the "try several seeds" hint when steps ≤ 8 (X7).
11. **Aspect-ratio hint** (item 4): offer the seven official pairs (1328², 1664×928, 928×1664,
    1472×1104, 1104×1472, 1584×1056, 1056×1584) rather than 1024².
12. **Prose check stays, with a carve-out** (D3/T-e): warn on `Subject:`/`Camera:`-style label blocks,
    but **do not** warn on line-broken sections with hyphen-led descriptive sentences in an
    English infographic/chart prompt — that form is explicitly sanctioned. Never allow it in Chinese
    output, where the rewriter bans structured formatting outright.

### Nothing-found register

Per brief item, on the surfaces actually searched on 2026-09-10.

- **A newer official rewriter than `prompt_utils_2512.py`.** Not found. `prompt_utils_2511.py` 404s;
  no `_2601`, `_2.0`, or edit-specific 2511/2512 variant was reachable by direct raw-URL probe, and the
  README points only at `prompt_utils_2512.py` and `prompt_utils.py`. **The directory could not be
  enumerated**: `github.com/QwenLM/Qwen-Image/tree/main/src/examples/tools` and
  `api.github.com/repos/QwenLM/Qwen-Image/contents/src/examples/tools` both returned empty bodies
  (09-03 tooling note holds). So this absence is probe-based, not listing-based.
- **A Qwen-Image-2.0 / 2.0-pro weight repo.** Not found on `huggingface.co/Qwen/*` links reachable from
  the README, ModelScope links in the README, or the README's own News block, which announces 2.0 with
  **no weights line** unlike every open release around it. Stays closed-tier. Not independently
  re-checked against a full HF org listing this sweep.
- **An official Qwen-Image or Qwen-Image-Edit *prompting guide*.** Not found. Edit-2511 discussion #7
  is a direct request for one; it drew only community pointers to the launch blog and to
  `prompt_utils.py`. `help.aliyun.com/zh/model-studio/text-to-image-prompt` is scoped to
  **万相/Wanxiang**, not Qwen-Image (C4). The 09-03 digest's note that an unanswered "Where can I find
  an official prompt guide?" sits on the base repo is **still true** and now has a second instance.
- **Any Alibaba/Qwen staff reply on prompting.** Not found across `Qwen/Qwen-Image-2512/discussions`
  (27 threads), `Qwen/Qwen-Image-Edit-2511/discussions` (31 threads), or the `QwenLM/Qwen-Image` open
  issue list. `huggingface.co/Qwen/activity/community` returned an **empty body** — the org-activity
  route that worked for MiniMaxAI on 09-03 did not work here, so that specific surface is untested
  rather than negative.
- **Closed HF discussions and closed GitHub issues.** Not harvested. HF shows "View closed (3)" for
  2512 and "(4)" for Edit-2511 but the closed listing was not fetched; GitHub `?q=` search pages remain
  empty and the open list itself renders only ~12 of 217. Treat closed threads as unexplored.
- **A ComfyUI template or docs page for `Qwen-Image-Layered`.** Not found on `docs.comfy.org`
  (the three Qwen pages fetched cover base Qwen-Image, 2512, and Edit-2511). Not searched: `llms.txt`
  in full. Layered therefore fails the strict gate's ComfyUI leg for now.
- **Prompt-relevant defaults inside the ComfyUI template JSONs** (CFG, shift, sampler, scheduler, the
  negative widget's default text). Not retrieved — the template `.json` files under
  `Comfy-Org/workflow_templates` were **not fetched** this sweep (budget). The docs pages state only
  "Standard 50-step" and "Accelerated 4-step". **No prompt enhancer / rewriter node appears in any of
  the three Qwen ComfyUI pages**, which is a positive finding: the ComfyUI path has no built-in
  equivalent of `prompt_extend`, so a student's raw text is what the encoder sees.
- **A `[TESTED]` order-vs-prose-vs-labels result for Qwen-Image.** Still does not exist. T1 remains
  unrun. arXiv **2606.03715** was **not re-fetched** here; per `flux.md` its result is klein-scoped and
  no Qwen-Image arm was found on any Qwen surface this sweep.
- **A ZH-vs-EN fixed-seed result for Qwen-Image.** Not found anywhere. The vendor mixes languages in
  its own quick-start (English prompt + Chinese negative) without comment.
- **Civitai 30826.** Not fetched — civitai.com is unreachable per the standing rule, and civarchive was
  not tried for an article ID. The label-block claim is therefore still second-hand in this corpus.
- **知乎 / Bilibili / WeChat.** Not attempted this sweep (budget spent on first-party surfaces). Record
  as untried, not as empty.
- **Qwen-Image-Bench and MMGR.** Not re-checked for 2512-specific results; the 08-15 lines stand
  unverified this sweep.
- **The 1300-token limit for Qwen-Image 2.0.** Could not be re-sourced. The current
  `help.aliyun.com/zh/model-studio/qwen-image-api` states 800 characters (prompt) / 500 characters
  (negative) and contains no token-denominated figure.
- **Seed / determinism guidance for Edit-2511 multi-image binding.** No official statement found. The
  only relevant material is T-c (seed variance collapses under Lightning) and T-d (an n=1 failure).

### Sources

- [`QwenLM/Qwen-Image` README](https://raw.githubusercontent.com/QwenLM/Qwen-Image/main/README.md) — [OFFICIAL], News block current to 2026-02-10, accessed 2026-09-10.
- [`src/examples/tools/prompt_utils_2512.py`](https://raw.githubusercontent.com/QwenLM/Qwen-Image/main/src/examples/tools/prompt_utils_2512.py) — [OFFICIAL], current T2I rewriter (EN + ZH), fetched in full, accessed 2026-09-10.
- [`src/examples/tools/prompt_utils.py`](https://raw.githubusercontent.com/QwenLM/Qwen-Image/main/src/examples/tools/prompt_utils.py) — [OFFICIAL], legacy T2I rewriter + the only edit rewriter (`polish_edit_prompt`), fetched in full, accessed 2026-09-10.
- [`prompt_utils_2511.py`](https://raw.githubusercontent.com/QwenLM/Qwen-Image/main/src/examples/tools/prompt_utils_2511.py) — **404**, probed 2026-09-10.
- [HF `Qwen/Qwen-Image-2512` card](https://huggingface.co/Qwen/Qwen-Image-2512/raw/main/README.md) — [OFFICIAL], accessed 2026-09-10.
- [HF `Qwen/Qwen-Image-2512` discussions index](https://huggingface.co/Qwen/Qwen-Image-2512/discussions) (27 open) and [disc. 13](https://huggingface.co/Qwen/Qwen-Image-2512/discussions/13) · [disc. 22](https://huggingface.co/Qwen/Qwen-Image-2512/discussions/22) — [LORE], accessed 2026-09-10.
- [HF `Qwen/Qwen-Image-Edit-2511` discussions index](https://huggingface.co/Qwen/Qwen-Image-Edit-2511/discussions) (31 open) and [disc. 7 "Prompt guide"](https://huggingface.co/Qwen/Qwen-Image-Edit-2511/discussions/7) — [LORE], accessed 2026-09-10.
- [`QwenLM/Qwen-Image` issues](https://github.com/QwenLM/Qwen-Image/issues) (217 open, creation restricted), [#283](https://github.com/QwenLM/Qwen-Image/issues/283), [#286](https://github.com/QwenLM/Qwen-Image/issues/286) — [LORE], accessed 2026-09-10.
- [`ModelTC/Qwen-Image-Lightning` README](https://raw.githubusercontent.com/ModelTC/Qwen-Image-Lightning/main/README.md) (repo now `ModelTC/LightX2V-Qwen-Image-Lightning`) — [OFFICIAL/TESTED], news current to 2026-01-01, accessed 2026-09-10.
- [HF `lightx2v/Qwen-Image-2512-Lightning` card](https://huggingface.co/lightx2v/Qwen-Image-2512-Lightning/raw/main/README.md) — [OFFICIAL], accessed 2026-09-10.
- [HF `lightx2v/Qwen-Image-Lightning` discussions](https://huggingface.co/lightx2v/Qwen-Image-Lightning/discussions) — index plus [4](https://huggingface.co/lightx2v/Qwen-Image-Lightning/discussions/4) · [6](https://huggingface.co/lightx2v/Qwen-Image-Lightning/discussions/6) · [8](https://huggingface.co/lightx2v/Qwen-Image-Lightning/discussions/8) · [11](https://huggingface.co/lightx2v/Qwen-Image-Lightning/discussions/11) · [17](https://huggingface.co/lightx2v/Qwen-Image-Lightning/discussions/17) · [23](https://huggingface.co/lightx2v/Qwen-Image-Lightning/discussions/23) · [26](https://huggingface.co/lightx2v/Qwen-Image-Lightning/discussions/26) — [STAFF]/[LORE], accessed 2026-09-10.
- [GH `LightX2V-Qwen-Image-Lightning` #32](https://github.com/ModelTC/LightX2V-Qwen-Image-Lightning/issues/32) · [#69](https://github.com/ModelTC/LightX2V-Qwen-Image-Lightning/issues/69) · [#79](https://github.com/ModelTC/LightX2V-Qwen-Image-Lightning/issues/79) · [issue list](https://github.com/ModelTC/LightX2V-Qwen-Image-Lightning/issues) — [STAFF]/[LORE], accessed 2026-09-10.
- [`github.com/X-niper`](https://github.com/X-niper) — role evidence, profile title "X-niper (Xiangyu Fan)", accessed 2026-09-10.
- [docs.comfy.org — Qwen-Image](https://docs.comfy.org/tutorials/image/qwen/qwen-image) · [Qwen-Image-2512](https://docs.comfy.org/tutorials/image/qwen/qwen-image-2512) · [Qwen-Image-Edit-2511](https://docs.comfy.org/tutorials/image/qwen/qwen-image-edit-2511) — [OFFICIAL], accessed 2026-09-10.
- [阿里云 千问-图像生成 API](https://help.aliyun.com/zh/model-studio/qwen-image-api) — [OFFICIAL, ZH], accessed 2026-09-10.
- [阿里云 文生图Prompt指南](https://help.aliyun.com/zh/model-studio/text-to-image-prompt) — [OFFICIAL, ZH], `last-modified 2026-09-02`, **scoped to 万相 V1/V2**, accessed 2026-09-10.
- [ModelScope `Qwen/Qwen-Image-2512` model JSON](https://modelscope.cn/api/v1/models/Qwen/Qwen-Image-2512) — [OFFICIAL, ZH mirror], `LastUpdatedTime` 2025-12-31, accessed 2026-09-10.
- [`huggingface.co/Qwen/activity/community`](https://huggingface.co/Qwen/activity/community) — **empty body**, probed 2026-09-10.

**Read-only cross-references (not modified by this sweep):** `PromptStudio.html` lines 527 and 776–803;
`research/_addenda/test-kit-2026-09.md` §T1 and its open-items table; `research/_cross/chinese-prompting.md`
Qwen rows and Sources list (its Qwen source line cites the 2512 rewriter, which is correct, but the
Chinese image guide it should also cite is `text-to-image-prompt`, not `text-to-video-prompt`);
`research/digests/2026-09-03-digest.md` erratum #5 (confirmed and refined in D1).
