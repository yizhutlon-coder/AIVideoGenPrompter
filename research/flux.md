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
