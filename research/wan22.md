# Wan 2.2 research brief

Research baseline: 2026-08-15. Scope: `T2V-A14B`, `I2V-A14B`, `TI2V-5B`.

## Official guidance

- [OFFICIAL, 2025-07; checked 2026-08-15] The repository recommends prompt extension and maps T2V to Qwen text models and I2V to Qwen-VL. It exposes `--prompt_extend_target_lang zh|en`; larger extenders are said to perform better. [Wan2.2 README](https://github.com/Wan-Video/Wan2.2)
- [OFFICIAL, checked 2026-08-15] T2V formula: subject + scene + motion + cinematic control + style. Motion should name amplitude, speed, and effect. I2V formula is deliberately smaller: motion + camera, because appearance/scene/style are already in the image. [Alibaba Cloud Wan prompt guide](https://help.aliyun.com/en/model-studio/text-to-video-prompt)
- [OFFICIAL, checked 2026-08-15] The official examples distinguish pan/truck in prose, recommend a fixed camera for no drift, and warn that an orbit wider than 45 degrees risks spatial distortion. One short clip should not contain a long choreography or rapid scene changes.
- [OFFICIAL, checked 2026-08-15] TI2V-5B accepts either T2V or I2V conditioning and uses the corresponding extender. Native documented T2V size is 1280x704; I2V follows input aspect ratio.

## Rewriter system prompts (verbatim)

Canonical source: [`wan/utils/system_prompt.py`](https://github.com/Wan-Video/Wan2.2/blob/main/wan/utils/system_prompt.py), symbols `T2V_A14B_{ZH,EN}_SYS_PROMPT`, `I2V_A14B_{ZH,EN}_SYS_PROMPT`, and `I2V_A14B_EMPTY_{ZH,EN}_SYS_PROMPT`. Wiring: [`prompt_extend.py`](https://huggingface.co/spaces/Wan-AI/Wan-2.2-5B/blob/main/wan/utils/prompt_extend.py).

Short verbatim fingerprints (full third-party prompt text is not republished here):

```text
“改写后的prompt字数控制在60-200字左右”
“Limit the rewritten prompt to 100 words or less.”
```

Structural digest [OFFICIAL]:

- T2V: preserve subject/action; optionally add time, source/intensity/angle of light, tone, shot size, angle, composition; detail the action process; add motion when absent; do not invent a style; avoid literary mood padding; put an existing style first.
- I2V: discard redundant static description, preserve/expand action process and camera motion, output only dynamic content, cap at 100 words. Empty-prompt variants infer plausible motion from the image.
- Important conflict: T2V defaults (daytime, medium/wide shot, centered composition) are extender defaults, not universal artistic truths. A validator should never require them when the user specified alternatives.

## Chinese prompting

- [OFFICIAL] The code has separate native ZH and EN rewriters; the README itself demonstrates English input extended to Chinese. Wan's bundled text stack is UMT5/T5-family and the model card publishes Chinese negatives and Chinese examples. This is direct evidence for bilingual operation, not proof that Chinese always wins.
- [OFFICIAL] Chinese wins operationally when the desired visible text, culturally specific styling, dialogue, or concise motion terms are Chinese. English remains safe for international cinematography terms and English-trained LoRAs.
- [LORE] Prefer native clauses over translated tag soup: `固定机位`, `镜头缓慢推进`, `主体保持不动`, `仅衣角轻摆`, `低饱和冷色调`, `侧逆光`, `一镜到底`.
- Native examples: `固定机位，女孩保持坐姿，只抬眼看向窗外，呼吸自然，发梢被微风轻轻吹动。`; `镜头缓慢左移，小舟从画面右侧匀速驶向左侧，水面仅泛起细小涟漪。`; `低机位跟拍，运动员全速冲刺，手臂大幅摆动，最后一步前倾撞线。` [SYNTHESIS following official formula]

## Motion / composition control

| Failure | Prompt-side fix | Evidence |
|---|---|---|
| Too static | Name subject, body part, phase sequence, amplitude and speed; add a reaction or background micro-motion. | [OFFICIAL] extender + Alibaba guide |
| Camera drifts | `fixed camera/static shot; no camera movement` / `固定机位，镜头不移动`; avoid cinematic-camera filler. | [OFFICIAL] guide |
| Wrong subject moves | Anchor by position/wardrobe and use `only`: “Only the woman in the red coat…”; state all others remain still. | [SYNTHESIS] |
| Chaos/morphing | One continuous action, one camera move, explicit start→middle→end; reduce simultaneous actors. | [OFFICIAL] warns against long complex action and rapid changes |
| Orbit distortion | Keep orbit under 45 degrees or use a small-amplitude arc. | [OFFICIAL] |
| I2V ignores action | Remove restatement of the still image; spend the prompt budget on temporal changes. | [OFFICIAL rewriter] |
| Unwanted mouth motion | Positive stillness/closed-mouth wording may help, but an open official-repo report says mouth motion persisted across multiple prompt variants. Treat this as a model/workflow limit, not a guaranteed prompt fix. | [LORE: SINGLE REPORT] [issue #77](https://github.com/Wan-Video/Wan2.2/issues/77) |
| Exact pose/spatial sequence fails | Split into shorter shots or provide a stronger first-frame/control workflow; prompt-only success is not guaranteed. MMGR reports broad spatial/global-state consistency gaps for Wan 2.2. | [TESTED/PAPER] [MMGR](https://arxiv.org/abs/2512.14691) |

Vocabulary: fixed/static shot, push in/pull out, pan/move left-right, tilt up/down, tracking/follow-cam, low-angle, aerial/drone, orbit/arc; `固定机位`, `镜头推进/后拉`, `镜头左移/右移`, `镜头上摇/下摇`, `跟拍`, `环绕运镜`.

## Verbosity calibration

- T2V extender: 60–200 Chinese characters [OFFICIAL]. Treat roughly 35–120 English words as a practical UI band, not a tokenizer equivalence [SYNTHESIS].
- I2V: ≤100 words [OFFICIAL], and usually 15–70 words is enough if it consists of motion only [SYNTHESIS].
- Load-bearing: subject identity, exact action phases, speed/amplitude, subject/camera separation, one shot scale, lighting direction. Noise: award language, repeated quality tags, abstract mood, static I2V restatement.

## Negatives & guidance

- [OFFICIAL] ModelScope ships a long default negative including overexposure, static/still frames, blur, compression, malformed hands/faces, busy background, many background people, reverse walking. [ModelScope model card](https://www.modelscope.cn/models/Wan-AI/Wan2.2-T2V-A14B-BF16)
- Task additions [SYNTHESIS]: camera drift → `camera shake, camera movement`; single subject → `duplicate person, background crowd`; forward locomotion → `walking backward, sliding feet`; identity → `face morphing, costume change`.
- Do not use negative prompts to specify desired motion. Put positive temporal causality in the positive prompt.

## Few-shot gold

### Pair 1 — person shot [SYNTHESIS]
INTENT: Woman at a train window quietly looks up.
PROMPT-EN:
Fixed medium close-up. A woman beside a rain-streaked train window keeps her body still, slowly lifts her gaze from a folded letter to the passing lights, blinks once, and exhales; only her reflection and the rain move. Cool side light, shallow depth of field.
PROMPT-ZH:
固定机位，中近景。女子坐在布满雨痕的列车窗边，身体保持不动，视线从折叠的信纸缓慢抬向窗外灯影，轻眨一次眼后呼气；只有玻璃倒影与雨滴移动。冷色侧光，浅景深。
NOTES: Explicit stillness, micro-motion, and camera lock prevent drift.

### Pair 2 — landscape [SYNTHESIS]
INTENT: A calm sunrise over rice terraces.
PROMPT-EN:
Wide aerial shot at dawn over layered rice terraces. Thin mist drifts slowly through the valleys while water surfaces catch the first warm sunlight. The camera advances gently with small amplitude; no people, no abrupt movement, natural low-saturation color.
PROMPT-ZH:
黎明，航拍远景，层叠梯田铺向山谷。薄雾缓慢穿行，水面逐渐映出第一缕暖色阳光。镜头小幅、缓慢前推；无人，无突然运动，自然低饱和色调。
NOTES: Separates environmental motion from slow camera motion.

### Pair 3 — action [SYNTHESIS]
INTENT: A boxer dodges and counters.
PROMPT-EN:
Single continuous ringside shot. The boxer in red slips left under one jab, pivots on his rear foot, then drives one compact right cross into the opponent's guard; sweat sprays at impact. The opponent only recoils one step. A low tracking camera follows laterally at fast speed without orbiting.
PROMPT-ZH:
一镜到底，拳台边低机位跟拍。红衣拳手先向左闪过一记直拳，后脚转轴，随即用紧凑的右直拳击中对手护架，撞击瞬间汗珠飞散；对手只后退一步。镜头快速横向跟随，不环绕。
NOTES: Causal phases, named subjects, and bounded reactions.

### Pair 4 — I2V micro-motion [OFFICIAL-PATTERN]
INTENT: Animate a still squirrel eating.
PROMPT-EN:
The squirrel keeps eating with quick paw movements, pauses once to raise its head and look left, then resumes. Static camera; the branch remains still.
PROMPT-ZH:
小松鼠用前爪快速进食，停顿一次，抬头看向左侧后继续吃。固定机位，树枝保持静止。
NOTES: Follows the official I2V motion-only style and stays far below 100 words.

## Expert mistakes

- Applying the T2V “cinematic paragraph” to I2V and drowning the action in visible-image description.
- Writing camera angle and camera movement as if interchangeable; e.g. “low angle” does not mean “tilt up.”
- Combining pan, orbit, zoom, handheld shake, and subject action in one short clip.
- Treating the extender's chosen defaults as requirements.
- Using `static` only in the negative prompt, although the positive prompt needs a named moving subject.
- Treating “no mouth movement” or a detailed choreography as a hard constraint the model must honor; known reports show some such failures persist across wording changes.

## Validator suggestions

- T2V: 35–140 English words or 60–200 Han characters; warn, do not fail, outside band.
- I2V: hard warning above 100 words; require at least one action/change verb.
- If `fixed camera|static shot|固定机位` appears, flag contradictory camera verbs (`pan|tilt|push|orbit|truck|镜头.*移|推进|环绕`).
- Warn on >2 distinct camera moves or >4 sequential action connectors in a sub-10-second prompt.
- If `only/仅` anchors one mover, encourage an explicit stillness clause for other subjects.
- Do not require a style, negative prompt, or Chinese language.
- For exact pose, limb contact, or multi-step spatial choreography, display “best effort from text alone” and recommend a reference/control or shot split. Never convert this warning into more adjective padding.

## Sources

- [Wan2.2 official repository](https://github.com/Wan-Video/Wan2.2) — [OFFICIAL], accessed 2026-08-15.
- [Official system-prompt source](https://github.com/Wan-Video/Wan2.2/blob/main/wan/utils/system_prompt.py) — [OFFICIAL], accessed 2026-08-15.
- [Alibaba Cloud Wan prompt guide](https://help.aliyun.com/en/model-studio/text-to-video-prompt) and [Chinese original](https://help.aliyun.com/zh/model-studio/text-to-video-prompt) — [OFFICIAL], accessed 2026-08-15.
- [Wan2.2 ModelScope card](https://www.modelscope.cn/models/Wan-AI/Wan2.2-T2V-A14B-BF16) — [OFFICIAL], accessed 2026-08-15.
- [Wan issue #77: persistent unwanted mouth movement](https://github.com/Wan-Video/Wan2.2/issues/77) — [LORE: SINGLE REPORT], accessed 2026-08-15.
- [MMGR benchmark](https://arxiv.org/abs/2512.14691) — [TESTED/PAPER], accessed 2026-08-15.
