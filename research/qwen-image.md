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

Failure fixes:

- Face/pose ambiguity: replace young/old with age or range; name gaze, head tilt, arm/hand placement.
- Text hallucination: supply every exact word, not placeholders; say “no other text.”
- Multi-image drift: “subject from image 1, garment from image 2, pose from image 3”; keep the destination background explicit.
- Overediting: direct imperative naming only changed property, followed by “preserve identity/composition/lighting” clauses.

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

## Validator suggestions

- Classify `portrait|text|general|edit` before validating.
- Portrait: require age/range, subject identity, pose/gaze/hand action, environment/light; target 80–220 words.
- Text: extract all quoted strings; require location + font/style; reject vague placeholders (`some text|a list|etc.`).
- Edit: require operation + target + result; multi-image tasks must reference every supplied image exactly once or explain unused inputs.
- Preserve non-English quoted text byte-for-byte between intent and output.
- Lightning workflow must name exact compatible model/version and 4/8-step profile.

## Sources

- [Qwen-Image-2512 model card](https://huggingface.co/Qwen/Qwen-Image-2512) — [OFFICIAL], 2025-12, accessed 2026-08-15.
- [Qwen-Image official repository](https://github.com/QwenLM/Qwen-Image) — [OFFICIAL], accessed 2026-08-15.
- [Official 2512 rewriter](https://github.com/QwenLM/Qwen-Image/blob/main/src/examples/tools/prompt_utils_2512.py) — [OFFICIAL], accessed 2026-08-15.
- [Qwen-Image-Edit-2511 card](https://huggingface.co/Qwen/Qwen-Image-Edit-2511) — [OFFICIAL], 2025-11, accessed 2026-08-15.
- [Qwen-Image launch blog](https://qwenlm.github.io/blog/qwen-image/) and [Chinese version](https://qwenlm.github.io/zh/blog/qwen-image/) — [OFFICIAL], 2025-08-04, accessed 2026-08-15.
- [Alibaba Cloud Qwen-Image API](https://help.aliyun.com/zh/model-studio/qwen-image-api) — [OFFICIAL], accessed 2026-08-15.

