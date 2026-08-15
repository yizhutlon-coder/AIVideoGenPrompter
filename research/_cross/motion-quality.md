# Motion quality: cross-model synthesis

Baseline: 2026-08-15.

## Triage taxonomy

| Failure | Prompt-fixable? | First intervention |
|---|---|---|
| Static output | Usually | Name one moving subject, body part, phases, amplitude/speed and consequence |
| Chaotic/too much motion | Usually | One action chain, one camera move, freeze other subjects/background |
| Wrong subject moves | Usually + control | Position/clothing anchor + `only`; use masks/references where supported |
| Camera drift | Usually | Positive `static/fixed camera`; remove conflicting cinematography filler |
| Morphing/warping | Partly | Simplify action/camera; identity anchors; then model/reference/settings fix |
| Wrong speed | Usually | Explicit slow/fast + small/large amplitude + timestamps for H3 |
| Bad contact/physics | Partly | Describe contact, force and result; use pose/drive/control if precision matters |
| Reference motion ignored | Often input/settings | Validate reference role/strength, drive and masks before rewriting |

## Control-tier routing

The app should classify requested accuracy before rewriting:

| Tier | User intent | Product behavior |
|---|---|---|
| 1 — semantic | Approximate action, mood, broad composition | Generate the model-native prompt normally. |
| 2 — constrained text | Named mover, direction, speed, camera lock, simple start→end | Generate a compact prompt, surface conflicts, and recommend 2–4 fixed-setting seeds. |
| 3 — structural | Exact pose, limb angle, contact point, multi-person position, exact camera/path | Require or strongly recommend a pose/layout/motion reference, mask, drive, ControlNet/LoRA, or Ref2VA asset; label text-only output best effort. |
| 4 — temporal production | Several ordered actions, dialogue beats, cuts, or frame-accurate timing | Split into shots/takes and edit; do not imply that one expanded prompt can guarantee the sequence. |

Per-model structural route:

| Model | Preferred control route for exact pose/position/motion |
|---|---|
| Wan 2.2 | Strong first frame/reference workflow; split long choreography; prompt-only exactness is not guaranteed. |
| LTX 2.3 | Pose Control, Motion Track Control, camera LoRA, IC-LoRA, or I2V anchor. |
| MiniMax H3 | Ref2VA/reference generation with narrow asset roles and timed shots. |
| SCAIL-2 | Valid driving video + reference/driving masks; choose end-to-end or pose-driven mode. |
| SDXL | OpenPose/ControlNet; optionally depth/edge/segmentation or regional conditioning. |
| FLUX.2 | Multi-reference pose/layout guidance with explicit identity-vs-pose roles. |
| Z-Image | No official structural pose workflow verified; prompt-only is best effort unless a separately validated community adapter is active. |
| Qwen-Image Edit | Dedicated indexed pose reference plus identity/style references; sample several seeds because role binding can fail. |

## The motion sentence

Use: **identified mover + starting state + phase sequence + speed/amplitude + physical result + camera relationship + frozen elements**.

Example: “The red-jacketed runner starts crouched, pushes off once, clears the puddle, and lands left foot first; water splashes backward. A low camera tracks laterally at fast speed while the blue-jacketed bystander and background remain still.”

## Model mapping

- Wan I2V: strip static captioning; motion + camera only, ≤100 words [OFFICIAL]. Fixed camera is explicit. Keep orbits <45° [OFFICIAL].
- LTX 2.3: action first, chronological, ≤150 words; effects/dialogue adjacent to actions [OFFICIAL].
- H3: formal timeline; camera type + meaningful amplitude + speed; timestamps/cuts; reference-role analysis [OFFICIAL].
- SCAIL-2: drive and masks dominate. Prompt describes final semantics; mask/drive failures are not repaired by prose [OFFICIAL].

## Static-output playbook

1. Replace “dynamic/energetic” with a body part and verb.
2. Add start→change→end, no more than three phases for a short clip.
3. Add a consequence: dust, ripple, recoil, fabric lag, displaced object, sound.
4. Keep camera fixed for the diagnostic render. If motion appears, add one controlled camera move later.
5. For I2V remove wardrobe/background restatement.

## Chaos playbook

1. Say `only` and identify the mover.
2. State camera and other subjects remain still.
3. Delete compound camera moves, crowd activity and background weather.
4. Change fast/large to slow/small.
5. Use one continuous shot; cuts should introduce new information, not simulate motion.

## Settings versus prompt

- SCAIL mask semantics, reference selection, pose video and mode are input-side controls [OFFICIAL].
- Distilled vs dev checkpoints can change adherence/diversity; do not infer prompt rules while changing both.
- Guidance can increase adherence but also saturation/artifacts; prompt cleanup should precede raising it.
- Long action sequences exceeding clip duration are model/time failures. Shorten or split shots.

## Evidence limits

- [TESTED/PAPER] MMGR benchmarks Wan 2.2 and Qwen-Image and reports weak long-horizon spatial/global-state consistency across current generators. [MMGR](https://arxiv.org/abs/2512.14691)
- [TESTED/PAPER] GenSpace evaluates SDXL and FLUX.1-dev and reports substantial camera/object-orientation and frame-of-reference failures. [GenSpace](https://openreview.net/pdf?id=zyBG1j339A)
- [LORE: SINGLE REPORT] A Wan user reports unwanted mouth motion persisting despite multiple negative/positive wording attempts. This is not a controlled benchmark, but it is sufficient to reject guaranteed prompt fixes. [Wan issue #77](https://github.com/Wan-Video/Wan2.2/issues/77)
- [OFFICIAL] LTX, BFL, Diffusers and SCAIL all document structural controls for cases where text alone is insufficient. This is the strongest cross-model design signal in the research.

## Reproducible acceptance benchmark for Prompt Studio

The gold prompts in these briefs are rule-derived, not render-validated. Before calling the app “accurate,” run this small fixed protocol per supported checkpoint:

1. Freeze checkpoint/hash, seed set (at least four seeds), scheduler, steps, guidance, resolution, duration, enhancer state and all reference/control strengths.
2. Compare three conditions: raw user intent; Prompt Studio rewrite; Prompt Studio rewrite plus the model's recommended structural control when the request is Tier 3.
3. Use eight diagnostic tasks: static camera with moving subject; one mover among three people; left/right crossing; two-step action order; exact single-person pose; hand-object contact; slow versus fast version of one action; identity retention under large motion.
4. Score observable requirements independently: subject identity, mover selection, start pose, end pose, action order, contact, camera lock, speed, background stability. Use pass/fail per requirement before any aesthetic rating.
5. Report pass rate across seeds and worst-case failures. A single attractive cherry-picked result is not evidence of reliable control.
6. Treat a rewrite as an improvement only when it raises constraint pass rate without reducing identity/visual quality. Treat the control route as required when prompt-only results remain seed-fragile.

Suggested release gate [SYNTHESIS]: no validator may promise an exact pose/motion unless the corresponding structural input is active; model-specific prompt changes should beat raw intent on at least two independent seed sets before becoming a hard rule.

## Validator rules

- Require a finite motion/change verb for video.
- Warn when no mover can be resolved or >3 candidate movers exist.
- Parse camera verbs separately from subject verbs; flag fixed-camera conflicts.
- Warn on >3 ordered actions per five seconds or >2 camera moves per shot.
- Encourage `only|仅` plus explicit stillness for single-mover intent.
- H3: require speed/amplitude only when non-default; do not force redundant “normal/medium.”
- Detect Tier-3 phrases (`exact pose`, `same pose`, `match limbs`, `precise path`, `frame accurate`, `identical layout`) and require a model-supported structural route or an explicit best-effort warning.
- Store subject-motion verbs separately from camera verbs and compare them with requested duration/action budget.

## Sources

- [Wan official prompt guide](https://help.aliyun.com/en/model-studio/text-to-video-prompt) — [OFFICIAL], accessed 2026-08-15.
- [LTX enhancer](https://github.com/Lightricks/ComfyUI-LTXVideo/blob/master/prompt_enhancer_utils.py) — [OFFICIAL], accessed 2026-08-15.
- [MiniMax H3 base guide](https://github.com/MiniMax-AI/MiniMax-H3/blob/main/skills/h3-prompt-writing/references/base-en.txt) — [OFFICIAL], accessed 2026-08-15.
- [SCAIL-2 repository](https://github.com/Ardynai/scail-2) — [OFFICIAL], accessed 2026-08-15.
- [BFL Pose & Layout Guidance](https://docs.bfl.ai/guides/usecases_editing_controlnets) — [OFFICIAL], accessed 2026-08-15.
- [Diffusers SDXL ControlNet](https://huggingface.co/docs/diffusers/api/pipelines/controlnet_sdxl) — [OFFICIAL/MAINTAINER], accessed 2026-08-15.
- [LTX-2.3 prompt-adherence guide](https://ltx.io/blog/how-to-improve-ltx-2-3-prompt-adherence) — [OFFICIAL/MAINTAINER], accessed 2026-08-15.
- [MMGR](https://arxiv.org/abs/2512.14691) and [GenSpace](https://openreview.net/pdf?id=zyBG1j339A) — [TESTED/PAPER], accessed 2026-08-15.
