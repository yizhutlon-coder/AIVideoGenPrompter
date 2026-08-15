# Z-Image family research brief

Research baseline: 2026-08-15. Scope: Z-Image-Turbo, Z-Image base, Omni-Base, Edit.

## Official guidance

- [OFFICIAL] Z-Image is a 6B bilingual image family. Turbo is distilled, photorealistic, strong at Chinese/English text and runs at 8 NFEs. Base is diverse, controllable and supports effective negatives. Omni-Base unifies generation/editing; Edit is the instruction-tuned editor. [Repository](https://github.com/Tongyi-MAI/Z-Image)
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
- Edit release exists in the official family by research date. Use direct edit instructions and identify target/location; do not feed T2I scene descriptions as if they were edits.

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

## Validator suggestions

- Variant gate: Turbo → guidance 0, no negative, 8 NFEs/9 scheduler steps; Base → 28–50 steps, CFG 3–5, negative recommended.
- Count model tokens if tokenizer available; warn above 480 default tokens and offer 1024 local mode.
- Require natural sentences and at least three concrete categories: subject, spatial relation, light/style.
- Text tasks require quoted exact text, location and typeface; Chinese text should remain unchanged.
- Edit tasks require imperative target + operation + resulting attribute/location.

## Sources

- [Official Z-Image repository](https://github.com/Tongyi-MAI/Z-Image) — [OFFICIAL], accessed 2026-08-15.
- [Z-Image-Turbo staff prompting discussion](https://huggingface.co/Tongyi-MAI/Z-Image-Turbo/discussions/8) — [STAFF], 2025-11-27, accessed 2026-08-15.
- [Archived official prompt enhancer](https://huggingface.co/spaces/Tongyi-MAI/Z-Image-Turbo/blob/main/pe.py) — [OFFICIAL], accessed 2026-08-15.
- [Diffusers Z-Image training notes](https://github.com/huggingface/diffusers/blob/main/examples/dreambooth/README_z_image.md) — [MAINTAINER], accessed 2026-08-15.

