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

---

## 2026-09 sweep (agent 1F)

Scope added this run: `Wan-Dancer-14B`, `Wan2.2-Animate-2-14B`. All access dates **2026-09-03**
unless stated. This section resolves open target #1 from
[`_addenda/cn-sweep-2026-08-28.md`](_addenda/cn-sweep-2026-08-28.md) §9 (the Wan 2.2 `prompt_extend.py`
diff) with a first-party fetch. `raw.githubusercontent.com` worked on every attempt; the 08-28
provenance-gate constraint is gone.

### New official guidance

#### 1. `prompt_extend.py` diff — the constants are NOT in that file — `[OFFICIAL]`

The cn-sweep transcription was attributed to `wan/utils/prompt_extend.py`. In the Wan **2.2** tree
that file contains **no prompt text at all**. It opens with

```python
from .system_prompt import *
```

and dispatches through a dict. The constants live in
[`wan/utils/system_prompt.py`](https://raw.githubusercontent.com/Wan-Video/Wan2.2/main/wan/utils/system_prompt.py)
— six symbols: `T2V_A14B_{ZH,EN}_SYS_PROMPT`, `I2V_A14B_{ZH,EN}_SYS_PROMPT`,
`I2V_A14B_EMPTY_{ZH,EN}_SYS_PROMPT`. Line 14 of this file already named that path correctly; the
cn-sweep's file attribution was wrong, its *text* was right. **Wan 2.2 does not import anything from
Wan 2.1** — it carries its own copies.

**Verdict on the diff: the Chinese text is confirmed verbatim.** Every line of the cn-sweep §4.2
T2V-ZH block, the eight-axis 电影美学 vocabulary, the defaults (白天 / 中景或全景 / 中心构图), the
`拍摄角度`-vs-运镜 exclusion, the 湛蓝色的天空 rule, the `60-200字` cap and rules 8–10 (the silent
substitution filters) match the repo character-for-character. **Promote cn-sweep §4.2 from
`[LORE-transcription of OFFICIAL]` to `[OFFICIAL]`.** Four items the transcription **missed**:

**(a) `tar_lang="zh"` is confirmed as the default, and the dispatch is simpler than 2.1's** — the
bit-packed `SYSTEM_PROMPT_TYPES` table and the multi-image (FLF2V) branch documented for Wan 2.1 do
**not exist** in 2.2. Verbatim:

```python
    def decide_system_prompt(self, tar_lang="zh", prompt=None):
        assert self.task is not None
        if "ti2v" in self.task:
            if self.is_vl:
                return DEFAULT_SYS_PROMPTS[self.task]["i2v"][tar_lang]
            else:
                return DEFAULT_SYS_PROMPTS[self.task]["t2v"][tar_lang]
        if "i2v" in self.task and len(prompt) == 0:
            return DEFAULT_SYS_PROMPTS[self.task]["empty"][tar_lang]
        return DEFAULT_SYS_PROMPTS[self.task][tar_lang]
```

Two consequences worth teaching. `--use_prompt_extend` without `--prompt_extend_target_lang` still
rewrites an English prompt **into Chinese**. And `ti2v-5B` has **no `empty` branch** — the `ti2v`
early return fires first, so TI2V-5B never reaches the empty-prompt rewriter that I2V-A14B has.

**(b) The EN rewriter caps the aesthetic tokens at four; the ZH rewriter does not.** This is the
single largest ZH/EN divergence and it is invisible in the cn-sweep. Verbatim, `T2V_A14B_EN_SYS_PROMPT`
rule 1:

```text
1. 对于用户输入的prompt,在不改变prompt的原意（如主体、动作）前提下，从下列电影美学设定中选择不超过4种合适的时间、光源、光线强度、光线角度、对比度、饱和度、色调、拍摄角度、镜头大小、构图的电影设定细节
```

against the ZH form, which has no numeric cap:

```text
1. 对于用户输入的prompt,在不改变prompt的原意（如主体、动作）前提下，从下列电影美学设定中选择部分合适的时间、光源、光线强度、光线角度、对比度、饱和度、色调、拍摄角度、镜头大小、构图的电影设定细节
```

That explains the shape of the official exemplars: the ZH exemplars front-load **9–11** comma-separated
aesthetic tokens, the EN exemplars **3–4**. **`[SYNTHESIS]`** A validator should therefore apply a
different aesthetic-token budget by language: ~4 for English, up to ~10 for Chinese.

**(c) The EN prompt is written *in Chinese* and its own exemplar leaks untranslated Chinese.** Only
the vocabulary lists and the "输出必须是英文！" instruction are English; all ten task rules are
Chinese. And official EN exemplar 2 contains, verbatim:

```text
Dawn time, top lighting, high-angle shot, daylight, long lens shot, center composition, Close-up shot,  Fluorescent lighting,  soft lighting, cool colors. In dim surroundings, a Caucasian woman floats on her back in water. The俯拍close-up shows her brown short hair and freckled face.
```

`The俯拍close-up` is in the shipped file. The EN list also carries a stray-quote typo
(`""Low angle shot"`). **`[SYNTHESIS]`** The English dialect is a hand-translation of the Chinese one,
which is direct evidence for the corpus position that Chinese is Wan's primary prompt language.

**(d) Shot-scale lists are asymmetric.** ZH `镜头尺寸` has no *extreme close-up*:
`["中景","中近景","全景","中全景","近景","特写","极端全景"]`. EN adds one:
`["Medium shot","Medium close-up shot","Wide shot","Medium wide shot","Close-up shot","Extreme close-up shot","Extreme wide shot"]`.
So `极端特写` cannot be produced by the ZH rewriter's own vocabulary, while `Extreme close-up shot` can.

**(e) `magic_prompt` does not exist in the Wan codebase.** Grep of both Wan 2.2 files returns nothing.
The dead-code `magic_prompt` finding belongs to **Qwen-Image**'s `prompt_utils_2512.py`
(cn-sweep §4.3), not Wan. The 08-28 digest's recommended incorporation #10 bundles the two; they
should be split. `[OFFICIAL]`

**(f) The VRAM comments are a Wan 2.1 artefact.** Wan 2.2's `__main__` sets
`qwen_model_name = None` and carries **no** `# VRAM: 29136MiB` comments. The "~8.5–29 GB to run the
expander locally" figure (digest, Official guide changes) is sourced from the Wan **2.1** file and
should be version-stamped as such. `model_dict` in 2.2 lists only
`Qwen2.5-VL-3B/7B-Instruct` and `Qwen2.5-3B/7B/14B-Instruct` — **no AWQ entries**, so the cheap
10 GB AWQ path documented for 2.1 is not a 2.2 preset. Defaults: `Qwen2.5_14B` (T2V),
`QwenVL2.5_7B` (I2V). `[OFFICIAL]`

**(g) DashScope is still the default expander in 2.2**, `qwen-plus` / `qwen-vl-max` over
`https://dashscope.aliyuncs.com/api/v1`, raising `ValueError("DASH_API_KEY is not set")` if unset.
Corpus position confirmed. `[OFFICIAL]`

#### 2. The Alibaba prompt guide was revised 2026-09-02 — `[OFFICIAL]`

[`help.aliyun.com/zh/model-studio/text-to-video-prompt`](https://help.aliyun.com/zh/model-studio/text-to-video-prompt)
now carries `meta-last-modified: 2026-09-02T00:46:00+08:00` (created 2025-01-09). **This is the first
dated official in-scope doc change either sweep has caught.** What matters for local Wan 2.2:

- The `电影美学控制`, `动态控制` and `风格化表现` sections are explicitly labelled
  「以下视频效果均使用**万相2.2**版本」 — so those vocabulary tables are Wan-2.2-applicable, and the
  new 声音 / 多镜头 / 参考生视频 sections are labelled wan3.0/2.7/2.6/2.5 and are **not**.
- **The official locked-camera term is `固定镜头`, not `固定机位`.** Verbatim, I2V formula:
  「若希望镜头不要发生变化，可以通过"固定镜头"来强调」. Our corpus and gold pairs use `固定机位`
  throughout — a community coinage, not the vendor's word. See *Contradicts current corpus*.
- **Motion = amplitude + rate + effect, with three verbatim exemplar phrases**:
  「运动描述是对运动特征细节的描述，包含运动的**幅度、速率**和运动作用的**效果**，例如"猛烈地摇摆"、
  "缓慢地移动"、"打碎了玻璃"」. Confirms line 8 of this file at `[OFFICIAL]` and supplies the phrases.
- I2V formula restated verbatim: 「提示词 = 运动 + 运镜」. T2V advanced formula:
  「提示词 = 主体（主体描述）+ 场景（场景描述）+ 运动（运动描述）+ 美学控制 + 风格化」, where
  美学控制 「包含光源、光线环境、景别、视角、镜头、运镜」.
- 运镜 is split into **基础运镜** (`镜头拉远`, `镜头向左移动`) and **高级运镜**
  (`复合运镜`, `环绕运镜`). The 环绕运镜 exemplar is 「镜头跟随人物背面运镜至正面…镜头从他背后缓缓绕行至正面」
  — an ~180° orbit presented as a *working* example, with **no** degree limit anywhere on the page.
- New axes absent from the `system_prompt.py` enumeration but documented here with Wan-2.2 examples:
  **对比度** (高/低对比度), **饱和度** (高/低饱和度), **镜头焦段** (长焦 / 中焦距 / 广角 / 超广角-鱼眼),
  **镜头类型** (干净的单人镜头 / 双人镜头 / 群像镜头 / 定场镜头), **剪影**, plus special-process
  terms **移轴摄影** and **延时拍摄**.
- Cloud-only control words, recorded so nobody teaches them for local Wan 2.2: 「生成单镜头」/
  "Generate single shot.", 「无台词」/ "No dialogue.", 「无背景音乐」/ "No background music.",
  and the `图n` / `视频n` / `Image 1` / `Video 1` reference-indexing scheme (wan2.7/3.0) and
  `character1` (wan2.6).

#### 3. Wan2.2-Animate-2-14B — the official two-field Chinese dialect — `[OFFICIAL]`

Repo [`Wan-Video/Wan-Animate-2`](https://github.com/Wan-Video/Wan-Animate-2), README v1.0.0,
Apache 2.0, weights `Wan-AI/Wan2.2-Animate-2-14B` (base + distillation released 2026-08-07).
This is **not** the Wan cinematic formula and **not** a motion prompt. The prompt is a *caption of the
reference image only*, in two labelled Chinese fields, and the README tells you to have an LLM write
it. The caption-generating meta-prompt, verbatim from the README:

```text
用中文客观描述图片中的内容，包括以下要点：人物外观描述，不描述动作行为。 背景描述，忽略主观评价和情绪推测。 下面给出描述范例，必须遵循这个范式，不要输出额外的符号： 人物外观描述：穿着一件浅蓝色的校服衬衫，领口和袖口有白色边饰。胸前有一个圆形徽章。 背景描述：背景为明亮、整洁的教室或办公室，氛围安静有序。
```

Four hard rules in that one paragraph, all `[OFFICIAL]`: (1) Chinese; (2) **no action or behaviour
description** — 不描述动作行为, because the driving video supplies all motion; (3) no subjective
evaluation or emotional inference — 忽略主观评价和情绪推测; (4) **no extra punctuation or symbols** —
不要输出额外的符号, i.e. the two `人物外观描述：` / `背景描述：` labels are the only structure allowed.
Recommended captioner: 「LLM（如 Qwen3.7-Plus）」.

Official example prompt shipped in the README's own CLI invocation, verbatim:

```text
人物外观描述：一只银灰色虎斑纹的小猫，拥有圆润的脸庞、竖立的耳朵和巨大的圆形眼睛。它身穿一套深蓝色的制服套装，包括一件带有金色纽扣的西装外套和一条百褶裙。外套里面搭配着白色衬衫，领口处系着一个红色的蝴蝶结，袖口露出白色的衬衫边缘。背景描述：背景为纯白色，光线均匀明亮，无其他杂物或装饰。
```

Note the fields run together on one line with no separator beyond the `背景描述：` label, and that the
subject is a cat — 人物外观描述 is used for non-human subjects too.

**A third prompt field exists in the DiffSynth path.** `animate2_prompt_ref` captions the *driving
video*: `"视频中的人在做动作，背景静止"` — [ModelScope release post](https://modelscope.csdn.net/6a793a3610ee7a33f298da22.html),
2026-08-10. So the full Animate-2 text surface is **{two-field reference caption} + {negative} +
{one-line driving-video caption}**, which no corpus position covers.

**Relation to SCAIL-2-style motion transfer.** Wan-Animate-2's thesis is that the intermediate
representation SCAIL-2-class pipelines rely on is the problem. Paper abstract, verbatim: it
"achieves superior motion fidelity and identity preservation by eliminating intermediate motion
extractors entirely" ([arXiv:2608.06009](https://arxiv.org/abs/2608.06009) v2, 2026-08-08). The
prompt-side consequence is the *reason* for the no-action rule: with the driving video patchified
straight into the DiT, motion words in the prompt have nothing to bind to and can only fight the
reference. `[OFFICIAL]` for the architecture, `[SYNTHESIS]` for the inference.

**ComfyUI: natively supported since 2026-08-08.** `[OFFICIAL]`
[blog.comfy.org](https://blog.comfy.org/p/wan-animate-2-is-now-available-in) — two new nodes,
**`WanAnimate2ToVideo`** (reference character + driving video conditioning; `pose_strength`,
`pose_start_percent`, `pose_end_percent`, `reference_image_strength`) and **`WanAnimate2Cache`**
(caches the pose branch, roughly halves generation time, costs ~12.5 GB system RAM at 480×832/81
frames). Repackaged weights at `Comfy-Org/Wan-Animate-2`; template `video_wan_animate2.json`.
Diffusers support is PR [#14412](https://github.com/huggingface/diffusers/pull/14412), inference only.

**CFG is inconsistent across official Animate-2 surfaces** — `[OFFICIAL]`, recorded as a conflict:
`infer/wan_animate_2.yaml` sets `sample_guide_scale: 0.0` for the **Base** model while shipping a
full `sample_neg_prompt`; the distillation CLI passes `--sample_guide_scale 1.0`; the diffusers
snippet annotates `guidance_scale=1.0  # no classifier-free guidance`; DiffSynth-Studio uses
`cfg_scale=3.0`. **`[SPECULATION]`** At 0.0 or 1.0 the negative prompt is inert, so the negative
list shipped in the Base yaml is probably a dead field as configured. Do not teach Animate-2
negatives as live without a test.

Other `[OFFICIAL]` mechanicals from the yaml: UMT5-xxl text encoder, **`text_len: 512`**,
CLIP xlm-roberta-ViT-H/14, `sample_fps: 16`, `frame_num: 37`, 640×800 default, `sample_steps: 20`,
`flow_solver: euler`, `sp_size: 8` (tuned for 8× A800; 480P tested on 2× A800).
`input_prompts: ['static background.']` is the yaml's own placeholder — English, and not in the
two-field format, so the format is a *recommendation* the code does not enforce.

#### 4. Wan-Dancer-14B — a caption-schema dialect, not the Wan formula — `[OFFICIAL]`

[HF card](https://huggingface.co/Wan-AI/Wan-Dancer-14B) (Apache 2.0, created 2026-07-10, released
2026-07-13, arXiv 2607.09581, 4,560 downloads) · [repo](https://github.com/Wan-Video/Wan-Dancer).
Music-to-dance, two stages (global keyframe planning → local temporal refinement).

**The prompt is a file, and the files are one templated sentence.** Fetched verbatim:

```text
gen_video/prompt/古典舞_global.txt →
一个人正在跳舞，舞蹈种类是古典舞。

gen_video/prompt/古典舞_local.txt →
一个人正在跳舞，舞蹈种类是古典舞,图像清晰程度高,人物动作平均幅度中等,人物动作最大幅度中等。

gen_video/prompt/街舞_local.txt →
一个人正在跳舞，舞蹈种类是街舞,图像清晰程度高,人物动作平均幅度中等,人物动作最大幅度中等。

gen_video/prompt/kpop_local.txt →
一个人正在跳舞，舞蹈种类是韩舞,图像清晰程度高,人物动作平均幅度中等,人物动作最大幅度中等。
```

Findings, all `[OFFICIAL]`:

- **The dialect is a training-caption schema with slots, not prose.** Global stage:
  `一个人正在跳舞，舞蹈种类是{genre}。` Local stage appends three graded control tags:
  `图像清晰程度{高}` · `人物动作平均幅度{中等}` · `人物动作最大幅度{中等}`. **This is the only
  first-party Wan-family source for an enumerated motion-amplitude vocabulary**, and it separates
  *average* from *maximum* amplitude — a distinction nothing else in the corpus makes.
- Genre closed set (five, from the filenames): `古典舞` · `街舞` · `韩舞` (file `kpop_*`) ·
  `拉丁舞` · `踢踏舞`. Note the K-pop file's Chinese token is **韩舞**, not a transliteration.
- **`[SPECULATION]`** All five local files ship `高 / 中等 / 中等`, so the repo does not reveal the
  scale. A 低/中等/高 ladder is the obvious reading and is what the paper's "motion-speed control to
  preserve high-fidelity details during rapid movements" implies, but the other rungs are **not
  attested** in any file I fetched.
- **A hidden numeric token is appended at runtime.** `gen_video/gen_video_global.py`, verbatim:

  ```python
  input_fps = 30.0 / int(music_feature.shape[0] / 149.0 + 0.5)
  input_fps = "{:.4f}".format(input_fps)
  ...
  prompt += f"帧率是{input_fps}"
  ```

  The frame rate is concatenated into the prompt text (e.g. `帧率是30.0000`). A user editing the
  prompt file never sees this and cannot reproduce the model's expected caption without it.
- **CFG 5.0 confirmed as official, not claimed.** `gen_video_global.sh` sets `cfg_scale=5`;
  `gen_video_global.py` declares `--cfg_scale` `type=int, default=5`; the HF card's five worked
  examples all list `cfg_scale=5`. So **negative prompts are architecturally live** on Wan-Dancer,
  unlike our distilled models. Digest item confirmed.
- **The official negative list is hardcoded in the script**, verbatim:

  ```text
  色调艳丽，过曝，静态，细节模糊不清，字幕，风格，作品，画作，画面，静止，整体发灰，最差质量，低质量，JPEG压缩残留，丑陋的，残缺的，多余的手指，画得不好的手部，画得不好的脸部，畸形的，毁容的，形态畸形的肢体，手指融合，静止不动的画面，杂乱的背景，三条腿，背景人很多，倒着走
  ```

  It is **character-identical** to the `sample_neg_prompt` in Animate-2's
  `infer/wan_animate_2.yaml`, to the DiffSynth Animate-2 `negative_prompt`, and to the ComfyUI-template
  list the cn-sweep §4.5 recorded as `[LORE]` from issue #94. Three official repos, one list. See
  *Contradicts current corpus*.
- Hard hardware gate: `assert world_size == 8, "WORLD_SIZE must be 8"`. The official global stage
  **requires 8 GPUs**. Defaults 720×1280 portrait, `num_frames=149`, `FPS = 30`, 48 steps global /
  24 steps local, `sigma_shift=5`, music injected at layers `0,4,8,12,16,20,24,27`, librosa
  onset/MFCC/chroma/beat features. Runs on DiffSynth (`diffsynth.pipelines.wan_video_new`), built on
  Wan **2.1** per the card's acknowledgements.
- **Prompt Alignment 9.03: not found.** Neither the HF card, the arXiv v2 abstract, nor the project
  page states any Prompt Alignment score or names a benchmark. See *Nothing-found register*.
- Honesty caveat the project page states in bold, verbatim: 「Please note that all aforementioned
  videos were initially generated by our model and subsequently refined through post-processing.」
- `[SPECULATION]` on size: I did not open the weight tree, so the "~28 GB bf16" figure from the 08-28
  digest is **unverified this run**.

### Chinese sources

#### Finalized Chinese vocabulary table

Column **PE?** = does the term appear **verbatim inside official prompt-extend text**
(`Wan2.2/wan/utils/system_prompt.py`)? That is the highest grade of provenance available, because it
is vocabulary the vendor's own rewriter is instructed to emit.

Sources keyed: **[SP]** = `system_prompt.py` (Wan 2.2, `[OFFICIAL]`) · **[AL]** = 阿里云 万相 Prompt
指南 ZH, rev. 2026-09-02 (`[OFFICIAL]`, Wan-2.2-labelled sections) · **[WD]** = Wan-Dancer repo prompt
files + script (`[OFFICIAL]`) · **[AN]** = Wan-Animate-2 README / ModelScope release post
(`[OFFICIAL]`) · **[CM]** = community, no vendor attestation (`[LORE]`).

**Lighting — 光源 / 光线**

| 中文 | Sense | Source | PE? |
|---|---|---|---|
| 日光 / 人工光 / 月光 / 实用光 / 火光 / 荧光 / 阴天光 / 晴天光 | the closed 光源 set (8) | [SP] [AL] | **yes** |
| 柔光 / 硬光 | soft / hard light | [SP] [AL] | **yes** |
| 顶光 / 侧光 / 底光 / 边缘光 | top / side / under / rim light | [SP] [AL] | **yes** |
| 暖色调 / 冷色调 / 混合色调 | warm / cool / mixed tone | [SP] [AL] | **yes** |
| 高对比度 / 低对比度 | contrast — *named in SP rule 1 but no list given* | [AL] | no (axis only) |
| 高饱和度 / 低饱和度 | saturation — *same gap* | [AL] | no (axis only) |
| 背光 / 逆光 / 剪影 | backlight / contre-jour / silhouette | [AL] | no |
| 光线来源（窗户、灯具等） | SP orders the *source* named, not just the light | [SP] | **yes** |
| 侧逆光 / 轮廓光 / 窗侧柔光 / 阴天漫射光 / 烛火摇曳 | our `_cross` list — **no vendor attestation found** | [CM] | no |

**Camera — 景别 / 机位 / 焦段 / 运镜**

| 中文 | Sense | Source | PE? |
|---|---|---|---|
| 中景 / 中近景 / 全景 / 中全景 / 近景 / 特写 / 极端全景 | the closed 镜头尺寸 set (7); **no 极端特写 in ZH** | [SP] [AL] | **yes** |
| 过肩镜头角度拍摄 / 低角度拍摄 / 高角度拍摄 / 倾斜角度拍摄 / 航拍 / 俯视角度拍摄 | closed 拍摄角度 set (6); **suppressed when 运镜 is present** | [SP] [AL] | **yes** |
| 中心构图 / 平衡构图 / 右侧重构图 / 左侧重构图 / 对称构图 / 短边构图 | closed 构图 set (6) | [SP] [AL] | **yes** |
| 长焦 / 中焦距 / 广角 / 超广角-鱼眼 | focal length | [AL] (长焦 also in an SP exemplar) | partial |
| 干净的单人镜头 / 双人镜头 / 群像镜头 / 定场镜头 | shot type | [AL] | no |
| **固定镜头** | locked-off camera — **the vendor's word** | [AL] | no |
| 镜头后拉 / 镜头前推 | pull back / push in | [SP] I2V exemplars | **yes** |
| 镜头上摇 / 镜头下摇 | tilt up / down | [SP] I2V | **yes** |
| 镜头从左到右 / 镜头从右到左 | pan L→R / R→L | [SP] I2V | **yes** |
| 镜头左移后前推 | compound: truck left **then** push in | [SP] I2V exemplars 6 & 8 | **yes** |
| 镜头拉远 / 镜头向左移动 | 基础运镜 as the guide words them | [AL] | no |
| 环绕运镜 / 复合运镜 | 高级运镜; orbit exemplar is a back→front ~180° arc | [AL] | no |
| 无人机镜头，快速穿越 | drone compound move | [AL] | no |
| `right 60-degree view` / `top angle` | Animate-2 Viewpoint LoRA, **English tokens** | [AN] | n/a |
| 移轴摄影 / 延时拍摄 | tilt-shift / time-lapse | [AL] | no |
| 固定机位 / 跟拍 / 一镜到底 / 后拉揭示 | our existing corpus terms — **community, not vendor** | [CM] | no |

**Motion — amplitude, speed, effect**

| 中文 | Sense | Source | PE? |
|---|---|---|---|
| 运动描述 = 幅度 + 速率 + 效果 | the official three-part motion rule | [AL] | no |
| 猛烈地摇摆 / 缓慢地移动 / 打碎了玻璃 | the guide's three verbatim exemplar phrases (amplitude / speed / effect) | [AL] | no |
| 人物动作平均幅度{高\|中等\|低} | **average** motion amplitude tag; only `中等` attested | [WD] | no |
| 人物动作最大幅度{高\|中等\|低} | **maximum** motion amplitude tag; only `中等` attested | [WD] | no |
| 图像清晰程度{高\|…} | image-clarity tag; only `高` attested | [WD] | no |
| 帧率是{n} | frame-rate token appended by the script, not by the user | [WD] | no |
| 摇晃身体 / 跳舞 / 云彩飘动 / 风吹树叶 | SP rule 4's own examples of motion to **add** when none is given | [SP] | **yes** |
| 快速地 / 缓慢地 | the I2V formula's speed adverbs | [AL] | no |

**Aesthetic four-character compounds — the vendor forbids the mood kind**

`[OFFICIAL]` `T2V_A14B_ZH_SYS_PROMPT` rule 3, verbatim:

```text
3. 不要输出关于氛围、感觉等文学描写，如（画面充满运动感与生活张力，突出正式氛围）。
```

The four-character compounds the vendor **does** emit are all *concrete and measurable*:
`中心构图` · `暖色调` · `边缘光` · `晴天光` · `低饱和度` · `高对比度` · `俯视角度` — describing an
optical fact, never a mood. The mood compounds in
[`_cross/chinese-prompting.md`](_cross/chinese-prompting.md) (`古朴典雅`, `清冷疏离`, `朦胧诗意`,
`恢宏肃穆`, `烟火气息`, `静谧克制`, `粗粝纪实`) are **exactly the class rule 3 bans**, and none of them
appears in any official Wan file harvested across two sweeps. Keep them, but relabel: `[LORE]`, and
teach them as *inputs to be converted into visible choices*, which is what that file's own advice
already says. The only mood-adjacent phrasing in official text is the outcome clause of an exemplar
(`营造出温暖自然的画面感`), i.e. the rewriter's own output, not user vocabulary.

Officially attested **style** compounds (rule 5 orders style **first**, and forbids adding cinematic
aesthetics when the style is 2D): `二次元厚涂动漫插画` · `日系赛璐璐风格` (both verbatim in [SP]
exemplar 4); from [AL]: `毛毡风格` · `3D卡通风格` · `像素风格` · `木偶动画` · `黏土风格` · `黑白动画`;
from Wan 2.1 [SP]: `纪实摄影风格` (the stated default when unspecified), `插画风格` (discouraged unless
asked). `[OFFICIAL]`

**Texture — 质感: no Wan vocabulary exists.** Scoped absence: no enumerated 质感/材质 list appears in
`Wan2.2/wan/utils/system_prompt.py`, in the 阿里云 ZH guide (rev. 2026-09-02), or in the Wan-Dancer /
Wan-Animate-2 repos. Texture words appear only inside prose exemplars (`银灰色金属外壳`,
`树皮和树叶的丰富纹理`, `哑光表面`, `镀铬的肢体`). For a sourced texture list, use **Qwen-Image's**
official one (光滑 / 粗糙 / 金属感 / 织物感 / 透明 / 磨砂 — cn-sweep §4.3, `[OFFICIAL]`) and label it
as Qwen vocabulary borrowed into Wan prose, not Wan vocabulary. The `_cross` texture list
(`绢本设色`, `矿物颜料`, `宣纸纤维`, …) remains `[LORE]`.

#### Other Chinese-source items

- **The 通义万相 web app / DashScope split holds.** The 2026-09-02 guide is a **百炼 API** document
  throughout; its `prompt_extend` parameter is a server-side flag. Anything demonstrated on
  wan2.5+ in that doc is a cloud rewriter, not local behaviour. `[OFFICIAL]`
- **ModelScope release post** (`modelscope.csdn.net/6a793a3610ee7a33f298da22.html`, 魔搭 official
  community account, 2026-08-10) reproduces the Animate-2 caption meta-prompt identically to the
  GitHub README, and adds the Viewpoint LoRA detail below. Also gives a second official-style
  two-field example, verbatim: 「人物外观描述：一个人形机器人，躯干和四肢主要由银灰色金属外壳构成，
  关节连接处为黑色。…背景描述：背景为室外铺设有灰色地砖的广场或人行道…光线为自然日光。」
- **CSDN main-site wall confirmed still in place.** `blog.csdn.net/yihuaixu/article/details/149811366`
  (超详细提示词教程｜玩转Wan2.2 — open target #7 from cn-sweep §9) returned **HTTP 200 with an empty
  body**. The devpress mirrors (`modelscope.csdn.net`) continue to work. Zhihu not attempted this run.

### Tested findings

**Nothing in this sweep clears the `[TESTED]` bar for prompt behaviour.** No seeds, no grids, no n.
Two adjacent items worth recording at their real grades:

- **`[TESTED/PAPER]` — AnimationBench measures camera-motion consistency and includes Wan2.2.**
  [arXiv:2604.15299](https://arxiv.org/abs/2604.15299) (April 2026) operationalises the Twelve
  Principles plus "Broader Quality Dimensions" including **camera motion consistency**, over seven
  models including Wan2.2, HunyuanVideo, Framepack, Sora2-Pro, Veo3.1, Kling2.6 and Seedance. This
  remains the corpus's best camera-adherence evidence for Wan 2.2.
- **`[OFFICIAL]` — the newest camera-following evidence is a discrete 48-state viewpoint space, not
  free-form camera language.** Wan-Animate-2's **Viewpoint LoRA**, per the ModelScope release post,
  verbatim: 「模型在 **12 个方位角和 4 个仰角**构成的**离散视角空间**上，用文本描述相机状态，并通过接入
  cross-attention 层的轻量 LoRA 实现视角操控。相比 ReCamMaster 等方案所需的精确相机参数回归，文本方式
  对用户更友好。该 LoRA 使用约 **5 万个 Unreal Engine 渲染**的多视角样本训练。」 Text tokens given:
  `"right 60-degree view"`, `"top angle"`. **`[SYNTHESIS]`** 12 azimuths = 30° steps, so viewpoint
  words on Animate-2 should snap to multiples of 30°; asking for "right 45-degree view" asks for a
  state the LoRA was never trained on. This is a *viewpoint* control (where the camera stands), not a
  *camera move*, and it applies to Animate-2 only — not to T2V/I2V-A14B.

### Contradicts current corpus

1. **The "orbit wider than 45 degrees risks spatial distortion" rule is not supported at
   `[OFFICIAL]`.** This file, lines 9 and 44, attributes it to the Alibaba guide. On
   `help.aliyun.com/zh/model-studio/text-to-video-prompt` **as revised 2026-09-02** there is no degree
   figure anywhere, no orbit warning, and the sole 环绕运镜 exemplar is a *successful* back-to-front
   orbit of roughly 180°. Scoped: not found on that ZH page, nor in `Wan2.2/wan/utils/system_prompt.py`.
   A web search surfaced 45-degree orbit language only in third-party SEO guides, one of which
   instead recommends **10–20°** orbits. **Recommendation:** downgrade lines 9/44 to `[LORE]`, or drop
   the number and keep the defensible half — one camera move per short clip. The "arc shot works /
   orbit is the failure word" framing has **no first-party source** on the surfaces searched; it should
   not ship as `[OFFICIAL]`.
2. **The Chinese negative list is `[OFFICIAL]`, not `[LORE]`.** cn-sweep §4.5 graded it `[LORE]`
   because it came from user issue #94. It is hardcoded verbatim in **three** official Wan repos
   (Wan-Dancer `gen_video/gen_video_global.py`; Wan-Animate-2 `infer/wan_animate_2.yaml`; the
   DiffSynth Animate-2 example in the 魔搭 post). Promote it. Line 59 of this file already treats it as
   `[OFFICIAL]` from the ModelScope card — now triply confirmed with an exact string.
3. **`固定机位` is not the official term; `固定镜头` is.** The guide's own instruction is
   「通过"固定镜头"来强调」. Our validator suggestion (line 110) and all four existing gold pairs use
   `固定机位`. It is widely used in the wild (cn-sweep §4.5's real user writes 镜头位置保持不动), so
   keep it as an accepted synonym, but the taught form and the validator's canonical token should be
   `固定镜头`, with `固定机位|镜头位置保持不动` as accepted variants.
4. **cn-sweep §4.1's claim that four canonical exemplars (日系小清新胶片写真 / 二次元厚涂动漫插画 /
   CG游戏概念数字艺术 / 美剧宣传海报风格) are shared across Wan 2.1 and 2.2 is wrong for 2.2.**
   Wan 2.2's T2V exemplars are four *cinematic* ones (the 田野/毛驴, the 水中漂浮, the 壁炉/过肩, and one
   二次元厚涂动漫插画); its I2V exemplars are nine 运镜 sentences. `日系小清新胶片写真`,
   `CG游戏概念数字艺术` and `美剧宣传海报风格` appear **nowhere** in `Wan2.2/wan/utils/system_prompt.py`.
   They are Wan 2.1 vocabulary and must not be taught as Wan 2.2's.
5. **`prompt_extend.py` is the wrong citation for the system prompts.** Line 14 is right;
   cn-sweep §4.2's header is wrong; the digest's "Next-run target" phrasing inherits the error. In
   2.2 the text is in `system_prompt.py` and `prompt_extend.py` is wiring only.
6. **The `~8.5–29 GB local expander VRAM` figure is Wan 2.1's, not 2.2's**, and 2.2 ships no AWQ
   presets. Version-stamp it.
7. **Wan-Animate-2-Lite has no open weights.** The paper and the ComfyUI post both headline the
   real-time Lite variant; the paper's release sentence covers **Base** only ("we will release the
   Wan-Animate-2-Base model weights"), and the HF org lists no Lite repo. Any corpus line implying a
   locally runnable real-time Wan is wrong.

### Few-shot gold (new pairs)

### Pair 5 — Wan-Dancer music-to-dance [OFFICIAL-PATTERN]
INTENT: Two-stage music-driven dance clip; local refinement stage, moderate movement.
PROMPT-EN:
(Wan-Dancer takes no English prompt. The dialect is a Chinese caption schema; translate the slots
for teaching only, never as input: "A person is dancing, dance genre is street dance; image clarity
high; average character motion amplitude medium; maximum character motion amplitude medium.")
PROMPT-ZH:
一个人正在跳舞，舞蹈种类是街舞,图像清晰程度高,人物动作平均幅度中等,人物动作最大幅度中等。
NOTES: Verbatim official file (`gen_video/prompt/街舞_local.txt`). Do not add cinematography,
lighting, or camera words — the schema has four slots and no others. `舞蹈种类` takes one of
古典舞/街舞/韩舞/拉丁舞/踢踏舞. The global stage drops the three control tags and ends after the
genre. The script appends `帧率是{fps}` itself; do not type it. CFG 5, so the standard Wan Chinese
negative list is live here.

### Pair 6 — Wan2.2-Animate-2 reference caption [OFFICIAL]
INTENT: Animate a still character photo from a driving video; describe only appearance and background.
PROMPT-EN:
(Not the official dialect — the README mandates Chinese. English gloss for teaching only: "Character
appearance: a woman with long black hair, wearing a white semi-sheer lace long-sleeved top.
Background: a modern interior, walls and cabinetry mainly light grey.")
PROMPT-ZH:
人物外观描述：一名长黑发女性，穿着白色半透明蕾丝长袖上衣。背景描述：背景为现代室内空间，墙面和柜体以浅灰色为主。
NOTES: Verbatim from the official 魔搭 Diffusers example. Two labelled fields, nothing else — no
action, no emotion, no camera, no style, no extra punctuation (不描述动作行为 / 忽略主观评价和情绪推测 /
不要输出额外的符号). Motion comes entirely from the driving video; a motion verb here competes with it.
Works for non-human subjects too — the README's own example describes a cat under 人物外观描述.

### Pair 7 — Wan 2.2 T2V, official token order [OFFICIAL-PATTERN]
INTENT: A girl on a stone step at dusk, one small camera move, photoreal.
PROMPT-EN:
Edge lighting, medium close-up shot, warm colors, soft lighting, center composition. A girl of about
twelve sits on a worn stone step, unwinding a red woollen thread from her wrist, then looking up once
toward the lane. The camera pushes in slowly. Leaves drift across the ground behind her.
PROMPT-ZH:
边缘光，中近景，暖色调，柔光，晴天光，侧光，中心构图，白天，一个约十二岁的女孩坐在磨损的石阶上，将手腕上的红色毛线一圈圈解开，随后抬头看向巷口一次。镜头缓慢前推。她身后的落叶被风带着掠过地面。
NOTES: Mirrors the official exemplar shape exactly — aesthetic tokens comma-separated and front-loaded
before the subject, in no fixed internal order, then subject → action process → background motion.
The ZH form carries nine tokens (no cap in the ZH rewriter); the EN form carries five, honouring the
EN rewriter's 不超过4种 budget. `拍摄角度` is deliberately omitted because a 运镜 clause is present —
`system_prompt.py` rule 1 suppresses the two together. No mood prose, per rule 3.

### Validator changes

1. **Aesthetic-token budget by language.** Warn above ~4 front-loaded comma-separated aesthetic tokens
   in an **English** Wan 2.2 T2V prompt; allow up to ~10 in **Chinese**. Source: the EN rewriter's
   `不超过4种` versus the ZH rewriter's `部分`. `[OFFICIAL]`
2. **Mutual exclusion: camera angle vs camera move.** If the prompt contains a 运镜 term
   (`镜头.*(推|拉|移|摇|绕)|环绕运镜|复合运镜|push in|pull back|pan|tilt|orbit|dolly|truck`), warn on a
   simultaneous 拍摄角度 token from the closed set (`过肩镜头角度拍摄|低角度拍摄|高角度拍摄|
   倾斜角度拍摄|航拍|俯视角度拍摄`). Wan's own rewriter is instructed to suppress the latter.
   `[OFFICIAL]`
3. **Prefer `固定镜头`.** Accept `固定机位` and `镜头位置保持不动` as synonyms but suggest the official
   token. Keep the existing contradiction check (line 110) and add `环绕运镜|复合运镜` to the
   conflicting-verb list. `[OFFICIAL]`
4. **Mood-prose warning for Chinese Wan prompts.** Flag abstract 氛围/感觉 compounds
   (`氛围|感觉|充满.*感|张力` and the `_cross` mood list) with the reason quoted from rule 3, and
   prompt the user to convert them into a light/color/composition choice. `[OFFICIAL]`
5. **Style-first ordering, and the 2D exemption.** If a style term is present it should lead the
   prompt; if the style is a 2D/illustration form (`2D插画|二次元|厚涂|赛璐璐|像素|黏土|木偶|黑白动画`),
   *suppress* the cinematic-aesthetic recommendations entirely rather than encouraging them.
   Source: rule 5. `[OFFICIAL]`
6. **Drop the "orbit ≤ 45°" rule** or restate it without the number (see *Contradicts* #1).
7. **New target: `wanAnimate2`.** Require exactly the two labels `人物外观描述：` and `背景描述：`, in
   that order. **Fail** on action/motion verbs, emotion words, camera terms, style terms, or any
   third label. Require Chinese. Do not require or suggest a negative prompt (CFG is 0.0–1.0 on the
   official Base and distilled configs). Cap the reference caption well under the 512-token
   `text_len`. `[OFFICIAL]`
8. **New target: `wanDancer`.** Validate against the slot schema
   `一个人正在跳舞，舞蹈种类是{古典舞|街舞|韩舞|拉丁舞|踢踏舞}[,图像清晰程度{…},人物动作平均幅度{…},
   人物动作最大幅度{…}]。` **Fail** on cinematography, lighting, camera, or style additions. Warn that
   `帧率是…` is appended by the script. Negative prompt **is** live (CFG 5) — offer the official list.
   `[OFFICIAL]`
9. **Viewpoint snapping for Animate-2.** If a viewpoint phrase carries a degree figure, warn unless it
   is a multiple of 30 (12 azimuths) and note the 4 elevation states. `[SYNTHESIS]` from `[OFFICIAL]`
   architecture — mark as advisory, not a hard rule.
10. **Do not normalise `TI2V-5B` toward the empty-prompt behaviour.** TI2V-5B has no empty-prompt
    rewriter; an empty prompt there is not "auto-caption", it is an empty prompt. `[OFFICIAL]`

### Nothing-found register

| Brief item | Result |
|---|---|
| Wan 2.2 `prompt_extend.py` system-prompt diff | **Achieved.** Constants live in `system_prompt.py`; cn-sweep §4.2 text confirmed verbatim; five previously unrecorded divergences captured. |
| `tar_lang="zh"` default | **Confirmed** verbatim in `decide_system_prompt`. |
| `magic_prompt` dead code | **Not applicable to Wan.** No occurrence in either Wan 2.2 file. The finding belongs to Qwen-Image `prompt_utils_2512.py`. |
| Wan 2.1 file re-check | **Not needed / not fetched.** Wan 2.2 imports only `.system_prompt`; there is no cross-version import. Wan 2.1's constants remain as verified in cn-sweep §4.1. |
| Wan-Dancer prompt format | **Achieved**, verbatim from five prompt files + the runtime `帧率是` append. |
| Wan-Dancer CFG 5.0 | **Confirmed `[OFFICIAL]`** in `.sh`, in `argparse`, and in all five HF card examples. Negatives are live. |
| Wan-Dancer official negative list | **Achieved**, hardcoded verbatim in `gen_video_global.py`. |
| Wan-Dancer "Prompt Alignment 9.03" | **NOT FOUND** on the HF card, the arXiv v2 abstract, or the project page. No benchmark is named anywhere on those three surfaces. The 08-28 digest's figure is **unsourced** and should not ship until located (paper PDF body not read this run). |
| Wan-Dancer licence / size | Licence **Apache 2.0 confirmed** (HF card + `LICENSE` link). Size **not verified** — weight tree not opened; the "~28 GB bf16" figure stands unconfirmed. |
| Wan-Dancer: standard Wan formula? | **No.** It is a slot-filled training-caption schema. Recorded so nobody teaches the cinematic formula for it. |
| Wan2.2-Animate-2 two-field ZH dialect + official example | **Achieved**, verbatim from the GitHub README, the CLI invocation, the diffusers snippet, and the 魔搭 post (two independent official examples). |
| Animate-2 "no action description" rule | **Achieved**, verbatim: 不描述动作行为 / 忽略主观评价和情绪推测. |
| Animate-2 ↔ SCAIL-2 relation | Architecture stated `[OFFICIAL]` (no intermediate motion extractor). No source compares the two **by name**; not found on GitHub, arXiv abstracts, or 魔搭. Leave the head-to-head to agent 1A. |
| Animate-2 ComfyUI status | **Native since 2026-08-08**, node names and cache cost captured `[OFFICIAL]`. |
| Camera-following benchmark newer than AnimationBench | **None found that benchmarks Wan 2.2.** WBench (`github.com/meituan-longcat/WBench`) and WRBench (`github.com/JinPLu/WRBench`) are 2026 camera/viewpoint benchmarks but target interactive *world models* (Kling 3.0, HY-World 1.5, Lyra 2.0, SANA-WM); neither surfaced a Wan 2.2 camera-instruction score. Searched: WebSearch (EN + ZH), arXiv, the Wan repos. |
| "orbit is the failure word / arc shot works" | **Source not found.** Absent from the 阿里云 ZH guide (rev. 2026-09-02) and from `system_prompt.py`. Only third-party SEO guides carry degree figures, and they disagree with each other. Downgrade — see *Contradicts* #1. |
| Chinese vocabulary table | **Achieved**, with per-term source and a PE-verbatim column. |
| Chinese **texture** vocabulary for Wan | **Does not exist.** No 质感/材质 list in `system_prompt.py`, the 阿里云 ZH guide, or the Wan-Dancer / Animate-2 repos. Use Qwen-Image's official list with attribution. |
| Wan 4-character **mood** compounds | **Officially discouraged.** Rule 3 bans the class. None of our `_cross` mood compounds appears in any official Wan file across two sweeps. |
| 丁达尔效应 / 国风 / 水墨 | **Still not found** in any official Wan file. Confirms cn-sweep §4.6. |
| Wan 2.5 / 2.6 / 2.7 / 3.0 open weights | **None.** The 阿里云 guide (rev. 2026-09-02) documents them purely as 百炼 **API** formulas, and the `Wan-AI` HF org contains no such repo. Corpus position holds. |
| New Wan open weights since 2026-08-28 | **None.** `huggingface.co/api/models?author=Wan-AI&sort=createdAt` — newest repo is `Wan2.2-Animate-2-14B-Distilled-Diffusers`, `createdAt` **2026-08-06T06:12:58Z**. Nothing after that date in the org. |
| Wan-Animate-2-**Lite** weights | **Not released.** Paper commits to Base only; no Lite repo in the HF org. |
| `Wan2.2-Fun-Camera-Control` (cn-sweep open target #10) | **Not attempted** this run — out of brief. Still open. |
| CSDN main-site Wan prompt tutorial (open target #7) | **Still walled.** `blog.csdn.net/yihuaixu/article/details/149811366` returned HTTP 200, empty body. |
| Zhihu | **Not attempted** this run (known wall; needs the Chrome path). |
| `[TESTED]` prompt-behaviour data for Wan 2.2 | **None produced or found.** Everything in this section is `[OFFICIAL]` code/doc reading. |
| Wan-Dancer paper PDF body | **Not read** (abstract + project page only). The Prompt Alignment figure and the amplitude-tag ladder are the two things it would settle. |

### Sources

- [`Wan2.2/wan/utils/system_prompt.py`](https://raw.githubusercontent.com/Wan-Video/Wan2.2/main/wan/utils/system_prompt.py) — [OFFICIAL], accessed 2026-09-03. All six ZH/EN T2V/I2V/empty constants, verbatim.
- [`Wan2.2/wan/utils/prompt_extend.py`](https://raw.githubusercontent.com/Wan-Video/Wan2.2/main/wan/utils/prompt_extend.py) — [OFFICIAL], accessed 2026-09-03. Dispatch, `tar_lang="zh"`, DashScope default, `model_dict`.
- [阿里云 万相 文生视频/图生视频 Prompt 指南 (ZH)](https://help.aliyun.com/zh/model-studio/text-to-video-prompt) — [OFFICIAL], **doc revised 2026-09-02**, accessed 2026-09-03.
- [Wan-Video/Wan-Animate-2 README](https://raw.githubusercontent.com/Wan-Video/Wan-Animate-2/main/README.md) — [OFFICIAL], accessed 2026-09-03. Two-field dialect, caption meta-prompt, official examples.
- [`Wan-Animate-2/infer/wan_animate_2.yaml`](https://raw.githubusercontent.com/Wan-Video/Wan-Animate-2/main/infer/wan_animate_2.yaml) — [OFFICIAL], accessed 2026-09-03. `sample_neg_prompt`, `sample_guide_scale`, `text_len: 512`.
- [Wan-Animate-2 paper, arXiv:2608.06009v2](https://arxiv.org/abs/2608.06009) — [OFFICIAL], accessed 2026-09-03.
- [Wan-Animate-2 开源 — 魔搭 ModelScope 社区](https://modelscope.csdn.net/6a793a3610ee7a33f298da22.html) — [OFFICIAL, vendor community account], 2026-08-10, accessed 2026-09-03. Viewpoint LoRA (12 azimuth × 4 elevation), `animate2_prompt_ref`, second official example.
- [Wan Animate 2 native in ComfyUI](https://blog.comfy.org/p/wan-animate-2-is-now-available-in) — [OFFICIAL], 2026-08-08, accessed 2026-09-03.
- [Wan-AI/Wan-Dancer-14B model card](https://huggingface.co/Wan-AI/Wan-Dancer-14B) — [OFFICIAL], accessed 2026-09-03. Apache 2.0, `cfg_scale=5`, prompt-file paths, five genres.
- Wan-Dancer prompt files, verbatim — [OFFICIAL], accessed 2026-09-03: [`古典舞_global.txt`](https://raw.githubusercontent.com/Wan-Video/Wan-Dancer/main/gen_video/prompt/%E5%8F%A4%E5%85%B8%E8%88%9E_global.txt) · [`古典舞_local.txt`](https://raw.githubusercontent.com/Wan-Video/Wan-Dancer/main/gen_video/prompt/%E5%8F%A4%E5%85%B8%E8%88%9E_local.txt) · [`街舞_local.txt`](https://raw.githubusercontent.com/Wan-Video/Wan-Dancer/main/gen_video/prompt/%E8%A1%97%E8%88%9E_local.txt) · [`kpop_local.txt`](https://raw.githubusercontent.com/Wan-Video/Wan-Dancer/main/gen_video/prompt/kpop_local.txt)
- [`Wan-Dancer/gen_video/gen_video_global.py`](https://raw.githubusercontent.com/Wan-Video/Wan-Dancer/main/gen_video/gen_video_global.py) and [`gen_video_global.sh`](https://raw.githubusercontent.com/Wan-Video/Wan-Dancer/main/gen_video_global.sh) — [OFFICIAL], accessed 2026-09-03. Hardcoded negative list, `prompt += f"帧率是{input_fps}"`, `assert world_size == 8`.
- [Wan-Dancer paper, arXiv:2607.09581v2](https://arxiv.org/abs/2607.09581) and [project page](https://humanaigc.github.io/wan-dancer-project/) — [OFFICIAL], accessed 2026-09-03. "motion-speed control"; post-processing disclaimer.
- [Hugging Face API, `author=Wan-AI` sorted by creation](https://huggingface.co/api/models?author=Wan-AI&sort=createdAt&direction=-1&limit=25) — [OFFICIAL], accessed 2026-09-03. Lineage register; newest repo 2026-08-06.
- [AnimationBench, arXiv:2604.15299](https://arxiv.org/abs/2604.15299) — [TESTED/PAPER], accessed 2026-09-03 via search extract.
- [WBench](https://github.com/meituan-longcat/WBench) and [WRBench](https://github.com/JinPLu/WRBench) — recorded as **not** Wan-2.2 camera benchmarks, accessed 2026-09-03 via search extract.
