# SCAIL-2 research brief

Research baseline: 2026-08-15. Scope: Animation and Replacement.

## Official guidance

- [OFFICIAL, 2026-06] SCAIL-2 is reference-character animation driven by a video, with animation, replacement, animal-driving and multi-character support. It is not a free-form T2V model. [Model card](https://huggingface.co/zai-org/SCAIL-2)
- [OFFICIAL] Prompt semantics are descriptive: describe the final generated video, never an edit instruction. In replacement, describe the replacement character's visible appearance/clothes plus interacted/nearby objects. [Repository README](https://github.com/Ardynai/scail-2)
- [OFFICIAL] Correct reference and driving masks are critical even for single-character animation. Wrong masks can collapse animation into replacement behavior, degrade complex motion, and weaken long-video anchoring. Prompt changes cannot repair mask semantics.
- [OFFICIAL] End-to-end driving supports 512p/704p; pose-driven and replacement are reported better at 704p. Training mixes resolution and fps.
- [OFFICIAL] The recommended animation preprocessor uses the end-to-end driving video plus SAM3-derived masks. Pose-driven NLF/DWPose remains available when an intermediate skeleton is the desired control. Multi-person replacement has `--matchnearest`. [Repository README](https://github.com/Ardynai/scail-2)

## Rewriter system prompts (verbatim)

Canonical source: [`prompt_enhancer.py`](https://github.com/Ardynai/scail-2/blob/wan-scail2/prompt_enhancer.py), default branch `wan-scail2`. Short fingerprint:

```text
“This is not an editing instruction.”
“around 90-140 words”
```

Structural digest [OFFICIAL]: samples source frames; captions scene, action, timing, camera; combines source caption and reference image; outputs one 90–140-word English paragraph describing the post-replacement video; preserves environment, lighting, angle, shot scale, objects and motion trajectory; bans replace/swap/edit/mask/process wording.

## Chinese prompting

- [OFFICIAL] The checkpoint bundles UMT5 and therefore has multilingual capacity, but the official enhancer explicitly outputs English and the documented replacement examples are English. No official evidence found that Chinese outperforms English.
- Chinese can still express intent upstream, but the app should normalize final SCAIL prompt to English unless a controlled local test proves otherwise.
- Native Chinese intent examples for the rewriter: `把参考角色放入舞者位置，保留原视频动作与机位`; `只替换蓝衣男子，保留他手中的小提琴`; `角色外观来自参考图，动作节奏完全跟随驱动视频` [SYNTHESIS]. Final prompt should be English description, not these instructions.

## Motion / composition control

- Driving video dominates pose, gesture, timing, interaction and often camera rhythm. Prompt supplies semantic identity/appearance and objects; it should not contradict the drive.
- Too static or degraded: first validate mask and drive; this is settings/input-fixable, not primarily prompt-fixable.
- Wrong person moves/replaces: use the multi-person `--matchnearest` preprocessing plus the correct replacement mask. Also identify the target in final-scene prose by clothing/position.
- Morph/identity loss: clean reference mask, visible clothing description, and 704p for replacement/pose-driven mode.
- Missing object interaction: name the object and relation in the prompt (“holds the violin under his chin,” “sits on the wooden chair”).
- Camera drift: inherit source camera; describe it accurately rather than asking for a contradictory new move.
- Exact pose/motion: choose or create a drive that already contains it. Use end-to-end mode for robust general motion; use pose-driven mode for challenging inputs where skeleton-level control is intentional. The prompt only names what the final video depicts.

## Verbosity calibration

- Replacement enhancer target: one English paragraph, 90–140 words [OFFICIAL].
- Animation can be much shorter: official minimal example is “The girl is dancing.” The drive already provides motion. Use 15–60 words unless semantic appearance or object interactions need more [SYNTHESIS].
- Load-bearing: final-state subject, clothes/appearance, action, interacted objects, environment/camera preservation. Noise: edit verbs, mask talk, generic quality tags, invented motion that conflicts with drive.

## Negatives & guidance

- No model-specific negative prompt input is documented in the official CLI. Report: nothing reliable found.
- [OFFICIAL] Defaults: 40 steps, shift 3.0, guide scale 5.0, UniPC. Lightx2v LoRA example: 8 steps, shift 1, guide scale 1, LoRA alpha 1.0. These recipes should not share a prompt-quality judgment.
- Prompt-side prohibitions are weaker than drive/mask controls; route motion failures to input validation first.

## Few-shot gold

### Pair 1 — character animation [SYNTHESIS]
INTENT: Animate a girl dancing from a drive video.
PROMPT-EN:
A young woman in a blue pleated dress performs the driving video's dance on the studio floor, maintaining the reference character's face, hairstyle, clothing, and body proportions while following the original timing and full-body movement.
PROMPT-ZH:
一名身穿蓝色百褶裙的年轻女子在摄影棚地面上完成驱动视频中的舞蹈，保持参考角色的面部、发型、服装与身体比例，并严格跟随原视频的节奏与全身动作。
NOTES: Final-video description; no edit verbs. English remains recommended final language.

### Pair 2 — replacement/person [OFFICIAL-PATTERN]
INTENT: Replace a street violinist with the reference man.
PROMPT-EN:
A blond white man wearing a fitted black suit, black trousers, and leather shoes plays a brown violin on the street. He holds the violin beneath his chin and draws the bow across the strings while pedestrians pass behind him. The original street, daylight, camera framing, and motion trajectory remain unchanged.
PROMPT-ZH:
一名金发白人男子身穿合体黑色西装、黑色长裤和皮鞋，在街头演奏棕色小提琴。他把琴托在下巴下方，拉弓演奏，行人从身后经过。原视频的街景、日光、机位构图与动作轨迹保持不变。
NOTES: Derived from official README example plus explicit preservation.

### Pair 3 — object interaction [SYNTHESIS]
INTENT: Replace a mechanic but preserve work with a wrench.
PROMPT-EN:
A middle-aged East Asian woman with short black hair, orange coveralls, gray gloves, and work boots kneels beside the motorcycle and turns the same steel wrench on the rear axle. She keeps both hands aligned with the tool throughout the source motion. The garage bench, motorcycle, overhead fluorescent light, camera angle, and passing workers remain as in the driving video.
PROMPT-ZH:
一名黑色短发的中年东亚女性穿橙色连体工装、灰色手套和工作靴，跪在摩托车旁，用同一把钢制扳手拧动后轴。双手始终与工具准确贴合。车库工作台、摩托车、顶置荧光灯、机位与经过的工人保持驱动视频原貌。
NOTES: Explicit tool/hand relationship is the key semantic payload.

### Pair 4 — multi-character [SYNTHESIS]
INTENT: Animate two stylized characters greeting each other.
PROMPT-EN:
Two cel-shaded characters follow the two performers in the driving video: the taller red-jacketed character steps forward and extends a right hand, while the shorter green-jacketed character remains in place, then reaches with the right hand to complete one handshake. Their identities, colors, and proportions stay consistent; the background and camera remain unchanged.
PROMPT-ZH:
两名赛璐璐风格角色分别跟随驱动视频中的两位表演者：较高的红衣角色向前一步并伸出右手，较矮的绿衣角色先保持原位，再伸出右手完成一次握手。两者身份、颜色与比例保持一致，背景与机位不变。
NOTES: Position/clothing anchors disambiguate the movers.

## Expert mistakes

- Writing “replace X with Y” as the inference prompt.
- Trying to prompt around an incorrect or omitted mask.
- Omitting interacted objects, causing hands/object relationships to degrade.
- Contradicting the source motion/camera rather than choosing a better drive.
- Assuming multilingual encoder means Chinese is the optimized official dialect.
- Calling a bad drive/mask a prompt-adherence failure and repeatedly rewriting prose.

## Validator suggestions

- Replacement: reject/strongly warn on `replace|swap|edit|mask|segmentation|替换|蒙版`; require final-state subject + clothing + action.
- Target 90–140 English words for enhancer output; animation can be shorter.
- Require at least one concrete action verb and, when objects are detected, a spatial/functional relation verb (`holds`, `sits on`, `beside`).
- Input-side validation should outrank prompt lint: all four paths exist, masks nonempty, mode flag agrees with mask semantics.
- Warn when requested camera move differs from source-camera description.
- Block generation when an “exact motion/pose” intent has no valid drive/mask pair; do not claim text can substitute for those inputs.
- For multi-person replacement, require target-selection/mask validation and recommend `--matchnearest` where the workflow exposes it.

## Sources

- [Official SCAIL-2 repository](https://github.com/Ardynai/scail-2) — [OFFICIAL], accessed 2026-08-15.
- [Official prompt enhancer](https://github.com/Ardynai/scail-2/blob/wan-scail2/prompt_enhancer.py) — [OFFICIAL], accessed 2026-08-15.
- [Official Hugging Face card](https://huggingface.co/zai-org/SCAIL-2) — [OFFICIAL], accessed 2026-08-15.
- [SCAIL-2 paper](https://arxiv.org/abs/2606.10804) — [OFFICIAL/PAPER], 2026-06, accessed 2026-08-15.
