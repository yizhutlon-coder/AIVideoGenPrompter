# Chinese prompting across local visual models

Baseline: 2026-08-15. Evidence labels apply per bullet; URLs were accessed 2026-08-15.

## Decision table

| Model | Chinese choice | Strongest evidence |
|---|---|---|
| Wan 2.2 | Prefer ZH for Chinese subjects/text and native motion phrasing; EN also official | Separate ZH/EN extenders; README demonstrates ZH target [OFFICIAL] |
| Qwen-Image | Prefer ZH for Han text/cultural idiom; mixed is valid | Chinese text benchmark and native ZH rewriter [OFFICIAL] |
| Z-Image | Prefer ZH for Chinese text/culture; EN equally valid for general photo | Bilingual headline capability and official ZH example [OFFICIAL] |
| MiniMax H3 | English field structure + exact ZH dialogue | Public skill schema is English; launch is bilingual [OFFICIAL] |
| SCAIL-2 | English final prompt | Official replacement enhancer outputs English [OFFICIAL] |
| LTX 2.3 | English default; ZH exact dialogue works | Multilingual Gemma 3/card, English official enhancer [OFFICIAL] |
| FLUX | Use native language for cultural context | BFL explicitly recommends native language [OFFICIAL] |
| SDXL families | English/tags | CLIP/tag training; no primary evidence of ZH advantage |

## When Chinese wins

- Exact Han glyphs, calligraphic font vocabulary, vertical/horizontal layout, Chinese dialogue, named architecture/clothing/crafts, and compact four-character aesthetics. Qwen and Z-Image are the strongest local defaults for Chinese text [OFFICIAL: [Qwen blog](https://qwenlm.github.io/zh/blog/qwen-image/), [Z-Image repo](https://github.com/Tongyi-MAI/Z-Image)].
- Wan's Chinese motion words are short and operational: `固定机位`, `小幅缓慢推进`, `猛烈摆动`, `匀速左移`, `一镜到底`. Its official Chinese guide defines motion as amplitude + speed + effect [OFFICIAL].
- Chinese does not automatically win for models whose official dialect is a fixed English schema (H3) or English final-caption enhancer (SCAIL).

## Mixed-language rules

1. Keep structural field names/tags in their canonical language (`integrated_multimodal_description`, Pony tags).
2. Keep exact visible or spoken text unchanged: `<d>[Chinese] 别回头。</d>` or `写“春日书市”`.
3. Use one surrounding prose language. Do not repeat the same sentence in both languages; duplication consumes attention and can create two text strings.
4. English camera brands/lenses can remain embedded in Chinese prose: `50mm 镜头，f/2.8`.
5. Do not translate proper names, slogans, Danbooru tags, LoRA triggers, or model control tokens.

## Native mini style guide

Lighting: `窗侧柔光`, `侧逆光`, `轮廓光`, `顶光`, `阴天漫射光`, `暖色实景灯`, `冷暖混合光`, `烛火摇曳`.

Camera/composition: `固定机位`, `镜头缓慢推进`, `后拉揭示`, `横向跟拍`, `低机位仰拍`, `俯视远景`, `中近景`, `对称构图`, `左侧重构图`, `留白构图`, `前景遮挡`.

Aesthetic compounds: `古朴典雅`, `清冷疏离`, `朦胧诗意`, `恢宏肃穆`, `烟火气息`, `静谧克制`, `粗粝纪实`. Use at most one or two; convert the rest into visible choices.

Texture/material: `绢本设色`, `矿物颜料`, `宣纸纤维`, `旧木风化`, `湿润石板`, `哑光陶土`, `拉丝金属`, `半透明磨砂玻璃`, `织物经纬清晰`.

Motion: `轻轻摆动`, `匀速移动`, `突然停住`, `逐渐抬眼`, `只让衣角随风飘动`, `撞击后碎片向外滑行`, `其余人物保持静止`.

## Negative conventions

Native Chinese negatives should name artifacts, not desired content: `低分辨率，肢体畸形，手指融合，重复人物，文字模糊，文字扭曲，过曝，画面过饱和，蜡像感，镜头漂移`. Qwen and Wan publish similar Chinese lists [OFFICIAL]. Never machine-translate an English mega-negative; model- and task-specific short lists are more auditable.

## Machine-translation pitfalls

- `pan` becomes generic “移动” instead of `摇镜`/`横移`; distinguish lens pivot from camera translation.
- `rim light` should be `轮廓光/边缘光`, not a literal rim.
- `medium shot` is `中景`, not “中等镜头.”
- Four-character compounds can become unobservable mood padding. Attach them to light/color/material.
- Chinese text inside quotes must never be translated, normalized, or silently punctuated.

## Sources

- [Wan official Chinese guide](https://help.aliyun.com/zh/model-studio/text-to-video-prompt) — [OFFICIAL].
- [Wan system prompts](https://github.com/Wan-Video/Wan2.2/blob/main/wan/utils/system_prompt.py) — [OFFICIAL].
- [Qwen Chinese launch](https://qwenlm.github.io/zh/blog/qwen-image/) and [2512 rewriter](https://github.com/QwenLM/Qwen-Image/blob/main/src/examples/tools/prompt_utils_2512.py) — [OFFICIAL].
- [Z-Image repository](https://github.com/Tongyi-MAI/Z-Image) — [OFFICIAL].
- [MiniMax H3 Chinese launch](https://www.minimaxi.com/blog/minimax-h3) — [OFFICIAL].
- [BFL FLUX.2 guide](https://docs.bfl.ai/guides/prompting_guide_flux2) — [OFFICIAL].

