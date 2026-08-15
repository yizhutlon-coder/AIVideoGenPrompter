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

## Validator rules

- Require a finite motion/change verb for video.
- Warn when no mover can be resolved or >3 candidate movers exist.
- Parse camera verbs separately from subject verbs; flag fixed-camera conflicts.
- Warn on >3 ordered actions per five seconds or >2 camera moves per shot.
- Encourage `only|仅` plus explicit stillness for single-mover intent.
- H3: require speed/amplitude only when non-default; do not force redundant “normal/medium.”

## Sources

- [Wan official prompt guide](https://help.aliyun.com/en/model-studio/text-to-video-prompt) — [OFFICIAL], accessed 2026-08-15.
- [LTX enhancer](https://github.com/Lightricks/ComfyUI-LTXVideo/blob/master/prompt_enhancer_utils.py) — [OFFICIAL], accessed 2026-08-15.
- [MiniMax H3 base guide](https://github.com/MiniMax-AI/MiniMax-H3/blob/main/skills/h3-prompt-writing/references/base-en.txt) — [OFFICIAL], accessed 2026-08-15.
- [SCAIL-2 repository](https://github.com/Ardynai/scail-2) — [OFFICIAL], accessed 2026-08-15.

