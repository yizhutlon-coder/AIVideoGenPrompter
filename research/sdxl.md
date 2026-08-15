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

Failure fixes:

- Multiple-subject bleed: one clause per subject, strong position/clothing anchors, fewer shared adjectives; use regional conditioning when precision matters.
- Cropped body: specify shot (`full-body`, `feet visible`, `wide shot`) early and choose matching aspect ratio.
- Flat composition: add foreground/midground/background objects and one camera height/lens relation.
- Text failure: short quoted text + placement + font; otherwise route to Qwen/Z.

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

## Validator suggestions

- Detect family first: `pony`, `illustrious`, `juggernaut/realvis/base`.
- Pony: require `score_9` and a `source_*` token; recommend the full `score_8_up...` ladder; reject prose-only if strict mode.
- Illustrious: require at least 5 comma-separated canonical tags in tag mode; do not require Pony score ladder.
- Juggernaut: warn above ~75 CLIP tokens; require subject before style stack.
- Text task: require quoted exact text + location; warn beyond ~12 words.
- Warn on >4 generic quality aliases or negative prompt >positive prompt length.

## Sources

- [SDXL model card](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0) — [OFFICIAL], accessed 2026-08-15.
- [SDXL paper](https://arxiv.org/abs/2307.01952) — [OFFICIAL/PAPER], accessed 2026-08-15.
- [Diffusers SDXL API](https://huggingface.co/docs/diffusers/main/api/pipelines/stable_diffusion/stable_diffusion_xl) — [OFFICIAL], accessed 2026-08-15.
- [Juggernaut X creator guide](https://www.rundiffusion.com/prompting-guide-for-juggernaut-x) — [CREATOR], updated 2026-04-09, accessed 2026-08-15.
- [RealVisXL V5 card](https://huggingface.co/SG161222/RealVisXL_V5.0) — [CREATOR], accessed 2026-08-15.
- [Illustrious v1.1 card](https://huggingface.co/OnomaAIResearch/Illustrious-XL-v1.1) and [paper](https://arxiv.org/abs/2409.19946) — [CREATOR/PAPER], accessed 2026-08-15.

