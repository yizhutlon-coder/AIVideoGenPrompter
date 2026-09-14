# SCAIL-2 research brief

Research baseline: 2026-08-15. Scope: Animation and Replacement.

## Official guidance

- [OFFICIAL, 2026-06] SCAIL-2 is reference-character animation driven by a video, with animation, replacement, animal-driving and multi-character support. It is not a free-form T2V model. [Model card](https://huggingface.co/zai-org/SCAIL-2)
- [OFFICIAL] Prompt semantics are descriptive: describe the final generated video, never an edit instruction. In replacement, describe the replacement character's visible appearance/clothes plus interacted/nearby objects. [Repository README](https://github.com/Ardynai/scail-2)
- [OFFICIAL] Correct reference and driving masks are critical even for single-character animation. Wrong masks can collapse animation into replacement behavior, degrade complex motion, and weaken long-video anchoring. Prompt changes cannot repair mask semantics.
- [OFFICIAL] End-to-end driving supports 512p/704p; pose-driven is reported better at 704p — the card names pose-driven only; it does not name replacement (corrected 2026-09-13 per verification-2026-09-10). Training mixes resolution and fps.
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
- Morph/identity loss: clean reference mask, visible clothing description, and 704p for pose-driven mode (the card does not extend the 704p claim to replacement).
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

---

## 2026-09 sweep (agent 1A)

Access date for everything below: **2026-09-03**. Repo state: `zai-org/SCAIL-2`, branch `wan-scail2`
@ commit `78fe19576bb06be96c2375e088574a262a300edb`. ModelScope mirror `LastUpdatedTime` 1784203664
(≈ 2026-07-16), 5,809 downloads, 7 stars. ComfyUI core support landed via PR #14373 (Kijai, June 2026);
third parties report the nodes working from `v0.24.1+60 commits` and stable by `v0.27.0`.

**Headline: the previous two sweeps' "zero hits" was a search artifact, not an absence.** SCAIL-2 has
an official repo, an official ComfyUI core integration with an official workflow template, an English
and a Chinese official tutorial, six HF discussions, a transcribed Chinese video tutorial and a
substantial community node with a tested findings log. Nearly every open question in the 08-15 file is
now answerable from primary sources.

### New official guidance

**Repo identity and the branch quirk — confirmed, and the current corpus points at a fork.**

- [OFFICIAL] The canonical repo is **`github.com/zai-org/SCAIL-2`**. The `GET /branches` API returns
  exactly two branches and **no `main` / `master`**: `sat-scail2` (`ac63f8e…`) and `wan-scail2`
  (`78fe195…`). The branch quirk in the 08-15 file is real and now verified.
  https://api.github.com/repos/zai-org/SCAIL-2/branches
- [OFFICIAL] The two branches are two checkpoint formats, not two products: weights ship for the `sat`
  branch and must be converted for the `wan` branch — *"The model weights are intended for `sat`
  branch, for usage in `wan` branch, convert to `safetensors` format"* via
  `python convert.py --scail-dir … --save-path …`.
  https://raw.githubusercontent.com/zai-org/SCAIL-2/wan-scail2/README.md
- [OFFICIAL] `Ardynai/scail-2` and `kotthoff/scail-2` are **forks/mirrors** with identical titles. Our
  existing Sources block cites `Ardynai` as "the official repository" — see *Contradicts*.

**Prompt semantics (unchanged in wording, but with a new load-bearing sentence).**

- [OFFICIAL] *"For both animation and character replacement, `--prompt` should describe the generated
  video itself. It should not be an instruction to the model."* Replacement: *"describe the video after
  replacement has already happened … describe the replacement character's visible clothing and
  appearance, and include objects the character interacts with or stays close to in the video, such as
  tools, instruments, chairs, tables, vehicles, doors, or handheld items."* Same README.
- [OFFICIAL] **New and important:** *"Note that SCAIL-2 is trained with long, detailed prompts. Short
  prompts or an empty prompt can run, but detailed descriptions of the reference subject and motion
  usually produce better results."* Same README, end of the LoRA section. This is the vendor's own
  length doctrine and it applies to **both** modes, not just replacement.
- [OFFICIAL] `generate.py` sets `if args.prompt is None: args.prompt = ""` — an empty prompt is legal,
  which is why "can run" is literally true.
  https://raw.githubusercontent.com/zai-org/SCAIL-2/wan-scail2/generate.py

**The enhancer prompt text, verbatim.** Two prompts, both in
https://raw.githubusercontent.com/zai-org/SCAIL-2/wan-scail2/prompt_enhancer.py [OFFICIAL].
It is a **Gemini cloud call** (`--model` default `gemini-3-flash-preview`, `--temperature` 0.4,
`GEMINI_API_KEY` required, `google-genai` not in `requirements.txt`) — i.e. SCAIL-2 has a *hidden
cloud rewriter* in exactly the sense Wan's DashScope expander does. Stage 1, the source-video
captioner:

```text
You are captioning sampled frames from a source video for a character replacement video generation task.

Describe the source video in one detailed English paragraph. Focus on:
- the scene, location, lighting, camera framing, and background;
- the action, motion, timing, and camera movement across the sampled frames;
- the clothing, pose, body motion, and nearby objects touched or interacted with by the person/character being replaced.

If the user specifies who should be replaced, identify that source subject clearly in the caption. Pay special attention to the source subject's clothing and any objects they hold, touch, operate, sit on, stand near, or otherwise interact with, because those details help locate the replacement region.

Do not mention the replacement target image. Do not invent an identity for the replacement target.
Output only the source-video caption.
```

Stage 2, the actual prompt enhancer (this is the canonical rule set for our validator):

```text
You are a prompt enhancer for SCAIL-2 character replacement.

Your task is to write one detailed English description of the final replaced video. This is not an editing instruction. The output must describe the video after replacement has already happened: the replacement character from the reference image is performing the source subject's motion in the source scene.

Replacement instruction from user:
{instruction}

Source video caption:
{caption}

Few-shot examples of the desired prompt style:
{examples}

Rules:
1. Output a positive video-generation prompt describing the replaced video itself. Do not output wording like "replace X with Y", "swap", "edit", or "the task is".
2. Remove the original source subject's identity and appearance. Keep only the original subject's motion, pose, timing, spatial position, and interaction with the scene.
3. The final prompt for SCAIL-2 should describe the replacement character's visible clothing and appearance in enough detail, using the reference image as the source of identity and wardrobe details.
4. The final prompt should also describe important objects the character interacts with or stays close to in the source video, such as tools, instruments, furniture, vehicles, doors, tables, handheld items, or work surfaces.
5. Keep the original video environment, lighting, camera angle, shot scale, background objects, and motion trajectory.
6. If the source caption mentions the original subject's clothing only to locate body regions or interactions, translate those grounding details into the replacement character's final appearance instead of preserving the original identity.
7. Use natural video wording with concrete verbs. Avoid mentioning masks, segmentation, editing software, Gemini, or the prompt generation process.
8. Output only the final enhanced prompt, in one English paragraph, around 90-140 words.
```

The 08-15 fingerprint ("This is not an editing instruction." / "around 90-140 words") is **confirmed
verbatim**; the structural digest in the 08-15 file is accurate. Note rule 7 bans "Gemini" and
"editing software" as well as mask talk — our validator's ban list is narrower than the official one.

**Mask colour palette and its in-code comment — found.** Not in the paper (the paper describes a
binary `1+K` channel stack, no colours) and not in the repo README (which only gives black/white/colour
*semantics*). The palette lives in ComfyUI core, in `comfy_extras/nodes_scail.py`:

```python
# Model was trained on these exact colors; deviating degrades multi-identity quality.
DEFAULT_PALETTE = [
    (0.0, 0.0, 1.0),  # Blue
    (1.0, 0.0, 0.0),  # Red
    (0.0, 1.0, 0.0),  # Green
    (1.0, 0.0, 1.0),  # Magenta
    (0.0, 1.0, 1.0),  # Cyan
    (1.0, 1.0, 0.0),  # Yellow
]
```

[OFFICIAL] https://raw.githubusercontent.com/Comfy-Org/ComfyUI/master/comfy_extras/nodes_scail.py
Six colours, assigned in `sort_by` order (`left_to_right` default). The same file shows the decode:
`_extract_mask_to_28ch` threshold-extracts **7 binary channels (white, red, green, blue, yellow,
magenta, cyan) at 225/255**, downsamples 8× spatially and stacks 4 frames temporally → **28 channels**.
That is exactly the paper's `4(K+1)` with `K=6`, so the **white channel is the paper's environment
switch `Ch_0`** and the six colours are its `K` binding slots. Palette length is therefore an
architectural cap, not a UI choice.

**Animation vs Replacement mask polarity — fully resolved, both sides of the mask.** In-code comment
in `SCAIL2ColoredMask.execute`: `# Animation: driving=black, ref=white. Replacement: driving=white,
ref=black.` [OFFICIAL, same file]. Tooltip, verbatim: *"False = Animation Mode (pose_video_mask has
black background, reference_image_mask has white background). True = Replacement Mode (pose_video_mask
has white background, reference_image_mask has black background)."* This is consistent with the repo
README's semantics — *"**Black** — tells the model the background at this location should not be
visible. **White** — … should be visible. **Color** — encodes the correspondence between character
regions and the driving motion."* [OFFICIAL, repo README] — because Replacement keeps the source
video's background (white on the driving side) while Animation keeps the reference's own background
(white on the reference side).

**`--matchnearest` — confirmed, with its exact context.** [OFFICIAL, repo README] It is a flag of the
*preprocessor*, not of `generate.py`:

```bash
# If the driving video has multiple people and only one should be replaced:
python NLFPoseExtract/process_replacement.py --subdir /path/to/input --matchnearest
```

The e2e/pose-driven split is likewise a preprocessor flag: `process_animation_aio.py --subdir … --e2e_mode`
(recommended; masks from SAM3) vs the same script without it (runs NLF + DWPose, writes a skeleton render).

**81-frame / 5-frame-overlap Extend arithmetic — now sourced three ways and consistent.**

- [OFFICIAL] CLI defaults: `--segment_len` **81** ("pixel frames to sample per segment for long-video
  inference"), `--segment_overlap` **5** ("pixel frames reused as clean history between adjacent
  segments"). `generate.py`.
- [OFFICIAL] ComfyUI node tooltip: `previous_frame_count` — *"Tail frames of previous_frames to anchor.
  **SCAIL-2 trained at 5 (81-frame chunks, 76-frame step)**."* `nodes_scail.py`.
- [OFFICIAL] Official tutorial + workflow note: segments = `ceil(total_frames / 76)`; pose offset =
  `76 × (segment_index − 1)`; `frame_count` default **81 (4n+1)**; `previous_frame_count` overlap **5**.
  https://docs.comfy.org/tutorials/video/zai/scail2
- [OFFICIAL] Also official: *"`WanSCAILToVideo` cannot queue all segments automatically. Run each
  segment manually."* So 81/5 → **76 new frames per segment**, e.g. 197 frames → `[81, 81, 45]`.

**Per-segment prompt fields in the official Extend workflow — YES, they are independent.** In
`video_wan21_scail2_character_replacement.json` the Base subgraph and the Extend subgraph each expose
their **own** `prompt` input (labels at lines 579 and 843 of the fetched JSON), alongside their own
`segment_index`, `replace_mode`, `frame_count` and `previous_frame_count`. [OFFICIAL]
https://github.com/Comfy-Org/workflow_templates/blob/main/templates/video_wan21_scail2_character_replacement.json
Consequences worth teaching: (a) a long video is prompted **per 76-frame chunk**, so the prompt can be
re-written as the action changes; (b) nothing keeps the two in sync — a user who edits only the Base
prompt gets a silent identity/appearance discontinuity at the first seam; (c) the workflow's own note
says *"Set on **both** subgraphs. Animation still needs masks; rewrite `prompt` accordingly."*

The workflow's in-graph Note also confirms, verbatim [OFFICIAL]:
*"Colored masks bind body regions between ref and driving. Main `prompt` controls final appearance."*
and, of the SAM3 text inputs, *"Not the SCAIL-2 `prompt` — only for mask track/segment"* (default `human`).

**Negative prompt — the 08-15 "nothing found" is superseded.**

- [OFFICIAL] The CLI exposes no negative argument, but the inherited Wan config hardcodes one and it is
  live at the default `--sample_guide_scale 5.0`:
  `wan_shared_cfg.sample_neg_prompt = '色调艳丽，过曝，静态，细节模糊不清，字幕，风格，作品，画作，画面，静止，整体发灰，最差质量，低质量，JPEG压缩残留，丑陋的，残缺的，多余的手指，画得不好的手部，画得不好的脸部，畸形的，毁容的，形态畸形的肢体，手指融合，静止不动的画面，杂乱的背景，三条腿，背景人很多，倒着走'`
  https://raw.githubusercontent.com/zai-org/SCAIL-2/wan-scail2/wan/configs/shared_config.py
  Same file: `text_len = 512` (UMT5 token cap) and `sample_fps = 16`.
- [OFFICIAL] In ComfyUI the negative is a **first-class input**: `WanSCAILToVideo` takes
  `io.Conditioning.Input("positive")` **and** `("negative")` and propagates every conditioning key to
  both. The official template wires an **empty** string into the negative `CLIPTextEncode`.
  So: negatives are architecturally live on SCAIL-2 (unlike our distilled models) but are *unused* in
  the official template and *Chinese-only* in the official CLI.

**Other official specifics not previously in the file.**

- [OFFICIAL] Resolution source for the 704p line is the checkpoint table on both the repo README and the
  HF/ModelScope card. CORRECTED 2026-09-13 (verification-2026-09-10 caught two hardened quotes here): the
  card's actual wording is *"Pose-driven performs better under 704p"* — it does NOT say "and replacement" —
  and the divisibility line is "should … if using other resolutions" guidance, not a verbatim "must".
  H/W divisible by 32 (e.g. 704×1280) remains correct as a recommendation, and the [TESTED] patch-math
  entry below explains why out-of-spec dims fail in practice.
  https://huggingface.co/zai-org/SCAIL-2/raw/main/README.md
- [OFFICIAL] Sampling defaults re-confirmed in `generate.py`: 40 steps, shift 3.0, guide scale 5.0,
  `unipc` (or `dpm++`), `--offload_model` default True single-process. Lightx2v recipe re-confirmed
  (8 steps / shift 1 / guide 1.0 / alpha 1.0). Models: `SCAIL-14B` **and `SCAIL-1.3B`** are both valid
  `--model` choices (1.3B has no published checkpoint we could find).
- [OFFICIAL] **Multi-reference is a real, documented beta**, new to this file: CLI
  `--additional_ref_image` / `--additional_ref_mask_image` ("beta", must be equal-length lists); in
  ComfyUI, extra batch images on `reference_image` are *"used as additional views (back view, close-up,
  occluded background), each needing a matching reference_image_mask in that identity's color."*
- [OFFICIAL] ComfyUI weight zoo is larger than the tutorial lists: `fp16`, `fp8_scaled`,
  `int8_convrot`, `mxfp8`, `nvfp4_mxpf8_mix`, plus **two** LoRAs — `wan2.1_SCAIL_2_DPO_lora_bf16` and
  an undocumented **`wan2.1_SCAIL_2_relight_lora_bf16`**.
  https://huggingface.co/Comfy-Org/SCAIL-2/raw/main/README.md
- [STAFF] Kijai (Comfy Org org) on the DPO LoRA: *"Basically just a quality LoRA, can improve things
  like hands and faces."* https://huggingface.co/Comfy-Org/SCAIL-2/discussions/4 — matches the paper's
  Bias-Aware DPO, which models preference **only on the hands region**.
- [STAFF] Kijai on node availability: *"The nodes are part of ComfyUI master branch, meaning it's
  available only in the nightly version, not in any versioned stable release yet."* and *"It's not a
  custom node, it is part of ComfyUI itself."* https://huggingface.co/Comfy-Org/SCAIL-2/discussions/2

**The paper's own position on prompts** (arXiv:2606.10804, extracted 2026-09-03):

- [OFFICIAL/PAPER] The text prompt appears in the formulation only: *"the condition c comprises a text
  prompt c_text, a reference image I … and a motion signal derived from a driving video y"*. `c_text`
  is never mentioned again in the method, training or inference sections.
- [OFFICIAL/PAPER] Text is explicitly framed as **insufficient**, twice. Abstract: *"we utilize
  in-context mask conditioning and mode-specific RoPE as **soft guidance beyond textual
  instructions** and raw visual information."* §4.5: *"Without the environment switch, the model
  generates an arbitrary background, as it **struggles to distinguish the two modes from textual cues
  alone**."*
- [OFFICIAL/PAPER] **The paper does not ablate the prompt at all.** §4.5 ablates driving mode
  (e2e vs pose), network modules (environment switch, Mode-Specific RoPE), Binding Slots, data
  composition, and Bias-Aware DPO vs SFT. Appendix D quantifies only Binding Slots and Replacement
  Data. There is **no** empty-vs-full-prompt, caption-quality, prompt-length or prompt-dropout study,
  and **no text-alignment metric anywhere** — metrics are SSIM/PSNR/LPIPS/FVD, Video-Bench's four
  perceptual axes, and human GSB on Motion Accuracy / Identity Consistency / Physical Plausibility /
  Identity Isolation / Environment Integration. The words "caption" and "annotat*" appear zero times;
  the text encoder is never named in the paper.
- [OFFICIAL/PAPER] Training: Wan2.1-14B-I2V backbone, 3,500 steps @ batch 128, lr 1e-5, 64×H100 ≈ 1
  week, then 400 DPO steps (LoRA rank 128, lr 1e-4, ~1K preference pairs). `K = 6`, "so 28 additional
  channels are stacked". Long video: *"we follow Wan-Animate to randomly replace the first 2 latents
  to be conditional history latents."* Stated limitation: dependence on synthetic-data generator
  fidelity; hands are the named failure mode — *"finger joints are often incorrectly articulated or
  simply neglected."*

### Chinese sources

**The honest headline: there is no Chinese-language official SCAIL-2 documentation.** The ModelScope
card is byte-identical English to the HF card (fetched via
`https://www.modelscope.cn/api/v1/models/ZhipuAI/SCAIL-2`, field `ReadMeContent`) [OFFICIAL]. The only
official Chinese prose is ComfyUI's translated tutorial and node docs.

- [OFFICIAL] Official Chinese tutorial: https://docs.comfy.org/zh/tutorials/video/zai/scail2 — the
  mode table is 「替换模式 `true`（默认）/ 驱动视频蒙版背景：白色」 vs 「动画模式 `false` / 黑色」, and the
  entire Chinese prompt guidance for `prompt` is the three characters 「输出视频描述」. Long-video line:
  「计算段落数量：`ceil(total_frames / 76)`」. **No Chinese prompt vocabulary exists for SCAIL-2** —
  no 电影美学 axis list, no 运镜 terms, nothing analogous to Wan 2.2's closed vocabulary.
- [OFFICIAL] Official Chinese node doc for `SCAIL2ColoredMask`:
  https://raw.githubusercontent.com/Comfy-Org/embedded-docs/main/comfyui_embedded_docs/docs/SCAIL2ColoredMask/zh.md
  Input row, correct: 「False = 动画模式（pose_video_mask 背景为黑色，reference_image_mask 背景为白色）。
  True = 替换模式（pose_video_mask 背景为白色，reference_image_mask 背景为黑色）。」
  **Output row, wrong:** 「参考图像掩码 … 根据模型惯例，始终以黑色背景渲染。」 The same document contradicts
  itself, and the code contradicts the output row. The page self-labels 「本文档由 AI 生成」 — treat
  ComfyUI's zh node docs as machine-generated and defer to `nodes_scail.py`.
- [LORE — authorised transcription of a Bilibili video, T8star-Aix, 2026-06-16] The richest Chinese
  prompt claim we found, from a T8 tutorial transcript on Monster社区:
  「提示词也很关键，尤其是替换模式下，要把特殊动作、人物关系和背景要求写清楚。」
  ("Prompts also matter a great deal, especially in replacement mode: write out the special actions,
  the relationships between characters, and the background requirements clearly.")
  https://bbs.monster/thread-4183-1-1.html — this independently corroborates the English-side
  background-drift mitigation below. Same source, user-reported failure modes, verbatim:
  - 「KJ 接力方式在 20 到 30 秒以内相对稳定，但接力次数越多，画面错误和裂画会逐步积累；WanAnimatePlus/SCAIL-2
    的上下文窗口方式更省显存、理论上上限更高，但每次上下文切换处仍可能出现明显过渡或闪动。」
  - 「如果多填出一张黑图，黑图信息可能被模型吸收，导致背景或人物整体变黑」 (a surplus all-black mask image
    gets absorbed and blackens the background or the character).
  - 「人物替换模式下，SCAIL-2 多参考图容易出现污染、脸部闪动或人物相互干扰」 (multi-reference in
    replacement mode → contamination, face flicker, characters interfering with each other);
    「作者当前测试认为动作迁移更适合多参考图」 (multi-reference suits animation/motion-transfer better).
  - 「换背景功能虽然可用，但作者不推荐直接依赖节点硬换背景，因为容易出现人物与背景不融合、头发边缘黑边、
    场景反复跳变等问题。」 (don't force a background swap in-node: non-blending, black fringing at hair
    edges, scenes jumping repeatedly; pre-composite the background instead and feed it as reference).
  - 「Clip Vision 多图输入建议做灰底预处理。」 (grey-matte multi-image CLIP Vision input.)
- [LORE] Community Chinese ecosystem exists and is active: three Bilibili tutorials
  (`BV1eGM36VEKd`, `BV1RGEC6ZELi`, `BV1CJjp61EZU`), a `comfyui-scail2-infinity` auto-window node, and
  two 知乎 zhuanlan write-ups (`p/2050708759719293238` GGUF/8 GB claim; `p/2048881122113859758`
  closerAI overview). Search-snippet-level claim only, body walled: SCAIL-2 「能转绘分钟级」 but
  「多次循环后劣化不可避免，一致性会偏移，纯白背景尤其容易出现瑕疵」 (degradation after repeated looping is
  unavoidable, consistency drifts, and **pure-white backgrounds are especially prone to artifacts**).
  Unverified — bodies unreachable, see register.
- [LORE — flagged as low quality] `nanhubrain.csdn.net/6a3cf71410ee7a33f2825c4d.html` (2026-06-15) is
  LLM-generated SEO filler: it calls SCAIL-2 an 「AI绘图工具」 for 「AI图像生成」 and gives a generic
  text-to-image node recipe. It is factually wrong about the model class. Recorded as a worked example
  of the 08-28 digest's source-quality warning; **none of its claims are used**.

### Tested findings

**`Brobert-in-aus/scail-auto-extend` "Findings" is the single best `[TESTED]` source on SCAIL-2.**
A community ComfyUI node (MIT) whose README records negative results with mechanisms.
https://raw.githubusercontent.com/Brobert-in-aus/scail-auto-extend/main/README.md

- [TESTED] **Resolution must be divisible by 32, not 16 — with a stated mechanism and symptom.**
  *"The pose/mask conditioning runs at half resolution, so its latent is `dim/16`; with the model's
  patch size of 2 that has to be even → `dim` divisible by 32. Out-of-spec dimensions get
  **circular**-padded (`common_dit.pad_to_patch_size`), which wraps the top edge of the frame onto the
  bottom — the symptom is the bottom ~8–16 px echoing the top. The trap is a multiple of
  16-but-not-32: the main latent is clean but the half-res pose latent is odd, so it only shows up at
  some resolutions."* This resolves the docs conflict below in favour of 32 and is directly
  corroborated by `nodes_scail.py`, whose `width`/`height` inputs use `step=32`.
- [TESTED] **Identity routing is position-first, not colour-first.** *"With a single composited
  reference frame, the model assigns reference characters to driving people by **spatial position**;
  the colour mask's real job is *temporal consistency* … not initial assignment."* And the negative
  result: *"You can't force colour over position. Rearranging the reference to break the spatial
  correspondence (e.g. stacking characters vertically instead of in a row) does **not** override
  position-first routing — tested, no effect."* Fix: order the reference composite left-to-right to
  match the driving people and set `sort_by = left_to_right`.
- [TESTED] **Max 6 identities.** *"The model was trained on a fixed 6-colour palette; a 7th wraps and
  collides."* Independently predicted by `DEFAULT_PALETTE` (6 entries, `i % len(...)`) and by the
  paper's `K = 6`.
- [TESTED] **Constant subject count.** *"People entering or leaving mid-shot produce artifacts — it
  tries to realise all reference identities from the start, cramming/hallucinating."* Fix is editorial
  (split the clip), not prompt-side.
- [TESTED] **Crossings/occlusion are the weak point**, and the report gives a diagnostic that separates
  the two failing layers: *"preview `pose_video_mask` through the crossing — swapped colours there mean
  the tracker; a clean mask but a swapped output means the model."*
- [TESTED] **Multi-reference binds by colour but blends appearance** — *"Correct routing, degraded
  fidelity … Kept as a documented dead end."* Agrees with the Chinese T8 report above.
- [TESTED] **16 fps is native**; raising the loader's `force_rate` "pushes the model off 16 fps" —
  generate at 16 and interpolate. Corroborated by `sample_fps = 16` in `shared_config.py`.
- [TESTED] **Colour drift across chunks is real**: the node's default `color_transfer = true` applies a
  Reinhard-LAB match of each chunk to the previous chunk's last frame "(fights color drift)".
- [TESTED] Reference-image prep matters: *"Removing the reference image's background and padding it to
  the video's aspect ratio helps the model produce cleaner replacements."*

**Background drift in Replacement mode — the one place a prompt demonstrably helps.**
https://huggingface.co/Comfy-Org/SCAIL-2/discussions/3

- [USER-VERIFIED] Theoldsong: *"Is there a solution if the background of the generated video is
  different from the original video?"* … *"I tried various prompt words, but couldn't achieve it."*
- [USER-VERIFIED] slikvik55 (2 👍): *"Same issue. Tried lots of workflows. Replacement Mode set to
  true, the background always ends up generated and not referencing the original video."*
- [USER-VERIFIED] ZonkBadonk: *"I had some success by offering a **fairly detailed description of the
  background of the first frame**. After rendering out the animation it then managed to pick up things
  later in the clip. I can't say it will work for every clip but it did on the one I tried."*
  → The actionable rule: generic preservation language ("the original background remains unchanged")
  is what failed; **concrete first-frame background nouns** are what partially worked.
- [USER-VERIFIED] lucas-ai26, discussions/2: *"I'm adding WAN LoRas + **detailed prompt** to further
  enhance the input and the results are simply incredible."* Consistent with the README's long-prompt line.

**Third-party end-to-end run, real hardware.** ComfyLab, 2026-07-03, RTX 3090 24 GB, ComfyUI v0.27.0.
https://comfylab.dev/blog/workflows/scail-2-character-replacement-comfyui-workflow/

- [TESTED] 81 frames at 896×512 = **571 s** total; SCAIL-2 diffusion 15,881 MB + umt5_xxl 6,419 MB +
  CLIP vision 1,205 MB, staged (not simultaneous); peak under 24 GB; ~21.4 GB of downloads.
  `int8_convrot` (16.7 GB) chosen over fp8 on Ampere.
- [TESTED] **Two reproducible bugs in the official template**, both "Value not in list" with no useful
  message: the template names `Wan2_1_VAE_bf16.safetensors` but the official checkpoint ships
  `Wan2.1_VAE.pth`; and a LoRA in `models/loras/lightx2v/` needs the subfolder prefixed. Both must be
  fixed in **two** places (Base *and* Extend subgraphs). Verdict on output: *"Scene composition,
  lighting, and camera framing are preserved faithfully. The identity swap is the only thing that
  changed."* Extend was **not** exercised, so this report says nothing about seam quality.

### Contradicts current corpus

1. **Our Sources block cites a fork as "the official repository."** Lines 8, 11, 107–108 point at
   `github.com/Ardynai/scail-2`; the canonical repo is `github.com/zai-org/SCAIL-2` (same branch
   name, same content today, but not authoritative). Fix the four URLs. [OFFICIAL]
2. **"Animation can be much shorter … Use 15–60 words" is contradicted by the vendor.** Our line 43
   reasons from the minimal example `"The girl is dancing"`. The README's own guidance is the
   opposite and is mode-agnostic: *"SCAIL-2 is trained with long, detailed prompts. Short prompts or
   an empty prompt can run, but detailed descriptions of the reference subject and motion usually
   produce better results."* The `"The girl is dancing"` string is a **CLI smoke-test**, not a
   recommendation. The official ComfyUI template's own default prompt is **111 words** — inside the
   90–140 band — and it is the *animation-style* dance case. Recommend retiring the 15–60 word
   guidance and using 90–140 for both modes. [OFFICIAL, graded high]
3. **"No model-specific negative prompt input is documented … nothing reliable found" (line 48) is
   now wrong in both directions.** There *is* a hardcoded Chinese `sample_neg_prompt` inherited from
   Wan 2.1, active at guide scale 5.0, and ComfyUI exposes `negative` as a real conditioning input
   with the official template leaving it empty. [OFFICIAL]
4. **New hard number our corpus lacks: the prompt token cap is 512.** `wan_shared_cfg.text_len = 512`.
   A 90–140-word English paragraph is comfortably inside it, but an over-eager expander is not. [OFFICIAL]
5. **A live docs conflict on resolution — 16 vs 32.** Both language versions of the official ComfyUI
   tutorial say `width`/`height` *"Must be divisible by 16"* / 「必须能被 16 整除」, while the model card
   says *"H and W must both be divisible by 32"*, the node schema uses `step=32`, and the `[TESTED]`
   report above gives the mechanism and the visual symptom for 16-but-not-32. **Teach 32.** Keep both
   sources on record; the ComfyUI tutorial is the one that is wrong. [OFFICIAL vs OFFICIAL, resolved
   by TESTED]
6. **Licence conflict, unresolved.** `LICENSE` on `wan-scail2` is **Apache License 2.0, "Copyright
   2026 Zhipu AI"**, and the README says Apache-2.0; the HF card YAML, the ModelScope API (`"License":
   "mit"`) and `Comfy-Org/SCAIL-2` all say **MIT**. Both permissive, but our corpus states neither —
   record the conflict rather than picking. [OFFICIAL vs OFFICIAL]
7. **The mask is not "colour-coded" in the model — the colours are a transport encoding.** Our line 9
   is right that masks are critical, but the paper's mask is a binary `4(K+1)=28`-channel latent stack;
   RGB colour exists only so the mask can travel as a video and be threshold-decoded at 225/255. This
   matters because it explains *why* off-palette colours degrade rather than merely confuse.
   [OFFICIAL/PAPER + OFFICIAL code]
8. **"Prompt changes cannot repair mask semantics" (line 9) stands, but our framing over-generalises
   to backgrounds.** Discussions/3 shows a background failure that masks did *not* fix and a detailed
   background description partially *did*. Our "route motion failures to input validation first"
   (line 50) should be narrowed to **motion/identity** failures. [USER-VERIFIED]
9. **The enhancer is a Gemini cloud call.** Our file presents `prompt_enhancer.py` as simply "the
   official enhancer" (lines 15, 26) without noting it needs `GEMINI_API_KEY`, a `pip install
   google-genai`, and sends frames plus the reference image to Google. It belongs in the
   hidden-cloud-rewriter warning group alongside 通义万相/DashScope and MiniMax Context-IR. [OFFICIAL]
10. **`prompt_examples.txt` — the few-shot file the enhancer defaults to — is not retrievable.**
    `--examples` defaults to `prompt_examples.txt` and the README says *"`prompt_examples.txt` is used
    as few-shot style guidance"*, but every fetch of that path on `wan-scail2` returns empty, and the
    code path `_read_examples` tolerates absence (`"(No examples provided.)"`). So the officially
    referenced example file is either empty or absent from the branch. Do not cite "official few-shot
    examples" as if we have them. [OFFICIAL, scoped absence]

### Few-shot gold (new pairs)

### Pair 5 — replacement / official template default [OFFICIAL]
INTENT: Replace the dancer in an outdoor coastal driving video with a streetwear reference character
(the shipped `reference_streetwear_character.png` + `driving_outdoor_dance.mp4` pair).
PROMPT-EN:
A young woman with dark hair tied in a neat high bun, with a few loose strands framing her face, is dancing outdoors on a sunny coastal hillside. She has a normal-sized head and a slim face, with no hat, no headwear, and no oversized hair volume. She wears a fitted black long-sleeve crop top with a shoulder cutout, extremely baggy black cargo pants with straps and pockets, and chunky black combat boots. She performs energetic dance moves with one leg lifted and arms extended, moving naturally in front of a large tree, a small white stone house with a terracotta roof, and a bright blue sea under a clear sky with light clouds.
PROMPT-ZH: (omit — the official template is English-only and there is no Chinese SCAIL-2 dialect)
NOTES: **Verbatim** from the `CLIPTextEncode` in `video_wan21_scail2_character_replacement.json`
(node id 3); the paired negative `CLIPTextEncode` is the empty string. 111 words — inside the
enhancer's 90–140 band. Three things to teach from it: (1) it front-loads subject + hair + face, then
wardrobe head-to-toe, then the action, then the background nouns — the enhancer's rule order made
concrete; (2) it spends a whole sentence on **corrective negation inside the positive prompt** ("normal-sized
head", "no hat, no headwear, no oversized hair volume"), which is the vendor's own tell that head
inflation / hair-volume blow-up / hat hallucination are real SCAIL-2 failure modes and that the fix
goes in the *positive* text; (3) the background is named as concrete objects (tree, white stone house,
terracotta roof, blue sea, light clouds), not as "the original background is preserved" — exactly the
pattern that worked in HF discussions/3.

### Pair 6 — character animation, long form [SYNTHESIS]
INTENT: Animate a stylised reference character performing a drive video's dance, on the reference's
own clean studio background (Animation mode: driving mask black, reference mask white).
PROMPT-EN:
A young woman with long straight black hair and a blunt fringe performs an energetic dance routine on a seamless white studio floor. Her head is normal-sized and her face is slim, with no hat and no extra hair volume. She wears a fitted sky-blue pleated dress with short sleeves, white ankle socks, and white canvas sneakers. She steps forward, lifts her right knee, extends both arms overhead and turns once on the spot, the pleated skirt swinging with the motion. The plain white backdrop stays clean and evenly lit throughout, the static camera holds a full-body frame, and no other people or objects enter the shot.
PROMPT-ZH:
一名留着长直黑发和齐刘海的年轻女子在无缝白色摄影棚地面上完成一段充满活力的舞蹈。她头部比例正常、脸型清瘦，没有帽子，也没有额外增厚的发量。她身穿修身天蓝色短袖百褶连衣裙、白色短袜和白色帆布鞋。她向前迈步、抬起右膝、双臂上举并原地转身一圈，百褶裙随动作摆动。纯白背景始终干净且光照均匀，静止机位保持全身构图，画面中没有其他人物或物体进入。
NOTES: Replaces the 08-15 "animation can be 15–60 words" doctrine with the README's long-prompt line;
97 words. Follows the official enhancer rules even though the enhancer itself is replacement-only:
final-state description, no edit verbs, concrete action verbs, wardrobe detail, explicit camera and
environment. Carries the official template's anti-inflation clause. The "plain white backdrop stays
clean" clause is deliberate — the Chinese community report flags 纯白背景 as artifact-prone, and this is
also the case the repo README singles out: *"especially true when you want the character to remain on
its original solid-color background and don't want it to be polluted by the driving video in Animation
mode."* PROMPT-ZH is provided for upstream intent capture only; **normalise the final prompt to
English** — the enhancer emits English and no Chinese SCAIL-2 vocabulary exists.

### Pair 7 — replacement with explicit background anchoring [SYNTHESIS + USER-VERIFIED mitigation]
INTENT: Replace a walking pedestrian in street footage, while defeating the Replacement-mode
background-drift failure reported in HF discussions/3.
PROMPT-EN:
A bearded South Asian man in his forties wearing a charcoal wool overcoat, a burgundy scarf, dark jeans, and brown leather boots walks along a wet cobblestone street at dusk. He carries a brown leather satchel in his left hand and keeps his right hand in his coat pocket. Behind him a row of shuttered brick shopfronts, a green cast-iron lamppost, a red postbox, and two parked bicycles line the pavement, with warm shop light reflecting in the puddles. The handheld camera tracks him from the left at chest height, and the overcast dusk lighting, the street layout, and his walking trajectory stay exactly as in the source footage.
PROMPT-ZH:
一名四十多岁、留着胡须的南亚男子身穿炭灰色羊毛大衣、酒红色围巾、深色牛仔裤和棕色皮靴，在黄昏时分走过湿漉漉的石板路。他左手提着棕色皮质单肩包，右手插在大衣口袋里。他身后是一排拉下卷帘门的红砖店面、一根绿色铸铁路灯柱、一个红色邮筒和两辆停放的自行车，暖色店铺灯光映在水洼中。手持机位从左侧以胸高跟拍，阴天黄昏的光线、街道布局与他的行走轨迹与源素材完全一致。
NOTES: 110 words. The load-bearing move is the third sentence: **five concrete background nouns with
colours and materials**, taken from the source's first frame, rather than a generic preservation
clause. That is the only prompt-side mitigation for background drift with any positive evidence
(ZonkBadonk, HF discussions/3) and it is independently recommended in Chinese
(「要把特殊动作、人物关系和背景要求写清楚」, T8star-Aix). The final sentence still carries the enhancer's
rule-5 preservation language, but *in addition to*, not *instead of*, the concrete nouns. Objects the
character interacts with (satchel, coat pocket) are named per enhancer rule 4.

### Validator changes

Additive to the existing list in this file; none of the old rules are withdrawn except where item 2 below says so.

1. **Length target: 90–140 English words for BOTH modes.** Retire the "animation 15–60 words" rule
   (Contradicts #2). Warn under ~60 words with the README's long-prompt sentence as the reason; warn
   over ~160 words. [OFFICIAL]
2. **Hard cap: 512 UMT5 tokens** (`text_len = 512`). Block, don't warn, above it, and make the
   expander length-aware so it cannot push a working prompt over — the same failure shape as the Krea 2
   cliff, though here it truncates rather than blackens. [OFFICIAL]
3. **Extend ban list to the official one.** Current: `replace|swap|edit|mask|segmentation|替换|蒙版`.
   Add from enhancer rule 1 and rule 7: `the task is`, `Gemini`, `editing software`, `Photoshop`,
   `inpaint`, `prompt`, plus `分割`, `抠图`, `修图`. [OFFICIAL]
4. **Require concrete background nouns in Replacement mode.** If `replace_flag` / `replacement_mode`
   is set and the prompt contains only a generic preservation clause ("background unchanged",
   "same scene", "原背景不变") with no concrete environment nouns, warn: background drift is the
   top-reported Replacement failure and generic preservation language is what users report failing.
   [USER-VERIFIED]
5. **Resolution rule: require `width % 32 == 0 && height % 32 == 0`.** Do not accept the ComfyUI
   tutorial's "divisible by 16". Multiple-of-16-but-not-32 is the trap; symptom is the bottom ~8–16 px
   echoing the top edge (circular padding of the half-res pose latent). [TESTED + OFFICIAL]
6. **Frame arithmetic:** `frame_count % 4 == 1` (81 default); `previous_frame_count = 5`; segment step
   = `frame_count − previous_frame_count` = 76; `segments = ceil(total_frames / 76)`; pose offset =
   `76 × (segment_index − 1)`. Warn if `previous_frame_count != 5` ("SCAIL-2 trained at 5"). [OFFICIAL]
7. **Per-segment prompt sync check.** If a workflow has ≥2 SCAIL-2 segments and the Base and Extend
   `prompt` strings differ in subject or wardrobe wording, warn about an identity discontinuity at the
   seam. Conversely, offer per-segment prompts as a *feature* when the described action changes.
   [OFFICIAL, SYNTHESIS]
8. **Identity count cap: 6.** Block a 7th tracked identity (palette wraps and collides). Also warn when
   subjects enter or leave mid-shot — recommend splitting the clip, not rewriting the prompt. [TESTED]
9. **Multi-person routing is positional.** Where the workflow exposes it, require
   `sort_by = left_to_right` and tell the user to order the reference composite left-to-right to match
   the driving people. Do not suggest that colours can override position. Keep the `--matchnearest`
   recommendation for the CLI preprocessor path. [TESTED + OFFICIAL]
10. **Mask polarity check, both sides.** Animation → driving mask background black, reference mask
    background white. Replacement → driving white, reference black. Flag an all-black surplus reference
    mask specifically (Chinese report: it gets absorbed and blackens the output). [OFFICIAL + LORE]
11. **fps:** warn if the driving loader's `force_rate` ≠ 16; recommend generating at 16 and
    interpolating. [OFFICIAL + TESTED]
12. **Negative prompt guidance is mode-specific now.** Do not tell users SCAIL-2 has no negative path:
    CFG is live at 5.0, the CLI hardcodes a Chinese Wan negative, and ComfyUI exposes a real `negative`
    input that the official template leaves empty. Recommend leaving it empty (official default) but
    stop calling it absent. [OFFICIAL]
13. **Enhancer warning:** `prompt_enhancer.py` is a Gemini API call that uploads sampled frames and the
    reference image. Surface that before recommending it, and note its `prompt_examples.txt` default is
    empty/absent so it runs with `"(No examples provided.)"`. [OFFICIAL]
14. **Template filename traps** (for the tutor, not the prompt linter): the official template's
    `Wan2_1_VAE_bf16.safetensors` and bare-name lightx2v LoRA both fail with a generic
    "Value not in list", and both must be fixed in the Base **and** Extend subgraphs. [TESTED]

**Prompt-inertness verdict** (brief item 1A; kept inside the Validator-changes block so the
sub-header sequence stays exactly the eight required ones)

**SCAIL-2 is NOT prompt-inert, but it is prompt-subordinate — and it is the least prompt-sensitive
model in our corpus that still has a genuinely load-bearing prompt.** Evidence grade: **[OFFICIAL]
for the direction, [TESTED]/[USER-VERIFIED] for the magnitude, with the honest caveat that no
controlled prompt experiment exists anywhere we could reach.**

For "not inert":
- [OFFICIAL] The vendor states long detailed prompts beat short ones and empty ones ("usually produce
  better results"), which is a claim about prompt sensitivity, not just prompt legality.
- [OFFICIAL] The vendor ships a whole Gemini rewriter whose only job is to lengthen and structure the
  prompt — nobody builds that for an inert input.
- [OFFICIAL] The official workflow note: *"Main `prompt` controls final appearance."*
- [OFFICIAL] The official default prompt spends a full sentence correcting head size, hair volume and
  hats — i.e. the vendor uses text to fix visual artifacts.
- [USER-VERIFIED] A detailed first-frame background description partially fixed background drift where
  generic preservation language and workflow changes had failed.

For "subordinate":
- [OFFICIAL/PAPER] Text conditioning is architecturally demoted by design: mask channels and
  mode-specific RoPE exist as *"soft guidance beyond textual instructions"*, and the model *"struggles
  to distinguish the two modes from textual cues alone."*
- [OFFICIAL/PAPER] The paper **never ablates the prompt** and has **no text-alignment metric** — the
  authors did not consider prompt following a dimension worth measuring.
- [TESTED] Every multi-identity control question (routing, crossings, subject count) resolves to
  position, mask and footage, never to text.

Practical corollary for the app: SCAIL-2's prompt is an **appearance-and-environment channel**, not a
motion channel. Motion, timing, camera and identity routing are set by the drive, the mask and the
composite. So the prompt is worth writing carefully (90–140 words, wardrobe head-to-toe, interacted
objects, concrete background nouns, anti-inflation clause) and worth *not* arguing with the drive.

### Nothing-found register

Scoped to the surfaces actually searched on 2026-09-03.

- **`prompt_examples.txt`** — referenced by the README and by `--examples`' default, but returns empty
  on both `raw.githubusercontent.com/.../wan-scail2/prompt_examples.txt` and
  `github.com/.../raw/wan-scail2/prompt_examples.txt`. Not found on: raw.githubusercontent, GitHub raw
  redirect. Could not enumerate the tree to confirm absence (see next item).
- **GitHub tree/contents API** — `git/trees/wan-scail2?recursive=1` and
  `contents/?ref=wan-scail2` both return empty bodies through our fetcher, as does the JS-rendered
  `github.com/zai-org/SCAIL-2/tree/wan-scail2`. `GET /branches` works. File-by-file raw fetches work.
  So we can confirm presence but never absence of a repo file. Sandbox `curl` is blocked (403 at the
  proxy) — do not retry.
- **`zai-org/SCAIL-2` issues** — `api.github.com/repos/zai-org/SCAIL-2/issues?state=all` returned an
  empty body on two attempts (the same failure mode as the tree API, so this is **not** evidence the
  issue tracker is empty). An Issues page exists per search. **Unharvested; highest-value next-run
  target for `[STAFF]` claims from the SCAIL authors themselves.**
- **The paper on prompts** — no caption pipeline, no text-encoder name, no prompt-length statement,
  no prompt ablation, no text-alignment metric. Not found in: arXiv HTML v1 full text (all sections
  plus appendices A–E). This is a positive finding, not a gap.
- **Mask colours in the paper** — absent. "color/colour/RGB/black" appear zero times; "white" appears
  once, as an *artifact* description. The palette exists only in ComfyUI core. Not found on: arXiv
  HTML v1, repo README (semantics only), project page.
- **Resolution/frames/fps in the paper** — absent. No 512p/704p, no frame counts, no fps, no chunk
  length. Those numbers live only in the model card, the CLI and the ComfyUI node.
- **知乎 article bodies** — `zhuanlan.zhihu.com/p/2048881122113859758` and `/p/2050708759719293238`
  both fetch as empty. Consistent with the 08-28 digest's "Zhihu bodies are walled". Titles and
  search snippets only. Needs Chrome MCP.
- **Bilibili** — `bilibili.com/video/BV1eGM36VEKd`, `BV1RGEC6ZELi`, `BV1CJjp61EZU` all fetch empty
  (JS-rendered), and `api.bilibili.com/x/web-interface/view?bvid=…` returns empty. **Workaround that
  did work: `bbs.monster` publishes authorised transcriptions of T8star-Aix's videos and fetches
  cleanly** — use it as the Bilibili proxy for Chinese ComfyUI content in future runs.
- **ModelScope** — the model page is JS-rendered and `resolve/master/README.md` returns as
  `application/x-genesis-rom` binary, but **`www.modelscope.cn/api/v1/models/{org}/{name}` returns
  clean JSON including the full `ReadMeContent`** — new access route, reusable for every Chinese model.
  The SCAIL-2 card there is English-only.
- **智谱 / Z.ai official Chinese announcement for SCAIL-2** — not found on: zhipuai.cn, WebSearch in
  Chinese (智谱 Z.ai SCAIL-2 开源 发布 公告 清华), cloud.tencent.com/developer, ModelScope. Zhipu's own
  Chinese channels appear to have announced GLM releases in the window but not SCAIL-2. The
  Zhipu×Tsinghua framing comes only from aggregator sites (`aiboss88.com`, `ai-all.info`), graded [LORE].
- **Kijai `ComfyUI-WanVideoWrapper` SCAIL-2 support** — issue #2031 ("SCAIL-2 support & workflow",
  opened 2026-06-10 by bondobrus) is **closed with no reply**; the wrapper ships a SCAIL **v1**
  example (`wanvideo_2_1_14B_SCAIL_pose_control_example_01.json`) but SCAIL-2 went into **ComfyUI core**
  instead (PR #14373, Kijai). There is no wrapper-specific SCAIL-2 README to harvest.
- **Reddit** — not attempted; structurally unreachable per standing rule.
- **`SCAIL-Pose` submodule source** — not fetched. The README documents its entrypoints and weight
  layout (`nlf_l_multi_0.3.2.torchscript`, `DWPose/dw-ll_ucoco_384.onnx`, `yolox_l.onnx`) but the
  submodule's own README/flags were not read. Next-run item if mask generation needs more depth.
- **`SCAIL-2` PR #14373 discussion thread** — not read (only its diff summary via search). May contain
  Kijai `[STAFF]` commentary on the 28-channel decode and mask conventions. Next-run target.
- **No controlled prompt experiment for SCAIL-2 exists** on: arXiv, GitHub, HF discussions (all 6),
  docs.comfy.org (en+zh), Bilibili search, 知乎 search, ComfyLab, scail-auto-extend. Our prompt-length
  and background-anchoring rules rest on vendor assertion + anecdote. **This is the top in-house test
  candidate:** fixed seed, fixed drive/mask, Replacement mode, four prompts — empty / `"The girl is
  dancing"` / a 110-word official-style prompt / the same 110 words with the background nouns removed.

### Sources

**Official — primary**
- [`zai-org/SCAIL-2` README, branch `wan-scail2`](https://raw.githubusercontent.com/zai-org/SCAIL-2/wan-scail2/README.md) — [OFFICIAL], accessed 2026-09-03.
- [`prompt_enhancer.py`](https://raw.githubusercontent.com/zai-org/SCAIL-2/wan-scail2/prompt_enhancer.py) — [OFFICIAL], accessed 2026-09-03. Both system prompts quoted verbatim above.
- [`generate.py`](https://raw.githubusercontent.com/zai-org/SCAIL-2/wan-scail2/generate.py) — [OFFICIAL], accessed 2026-09-03. CLI flags, segment defaults, multi-ref beta.
- [`wan/configs/shared_config.py`](https://raw.githubusercontent.com/zai-org/SCAIL-2/wan-scail2/wan/configs/shared_config.py) — [OFFICIAL], accessed 2026-09-03. `text_len=512`, `sample_fps=16`, `sample_neg_prompt`.
- [`LICENSE`](https://raw.githubusercontent.com/zai-org/SCAIL-2/wan-scail2/LICENSE) — [OFFICIAL], accessed 2026-09-03. Apache 2.0, "Copyright 2026 Zhipu AI".
- [Branch list API](https://api.github.com/repos/zai-org/SCAIL-2/branches) — [OFFICIAL], accessed 2026-09-03. `sat-scail2` + `wan-scail2`, no `main`.
- [HF model card `zai-org/SCAIL-2`](https://huggingface.co/zai-org/SCAIL-2/raw/main/README.md) — [OFFICIAL], accessed 2026-09-03. 704p line, ÷32 constraint, `license: mit`.
- [ModelScope API `ZhipuAI/SCAIL-2`](https://www.modelscope.cn/api/v1/models/ZhipuAI/SCAIL-2) — [OFFICIAL], accessed 2026-09-03. English-only card, `"License":"mit"`, 5,809 downloads.
- [arXiv 2606.10804 HTML v1](https://arxiv.org/html/2606.10804v1) — [OFFICIAL/PAPER], accessed 2026-09-03. Abstract, §3.3, §4.1, §4.5, §5, Appendices A–D.
- [Project page](https://teal024.github.io/SCAIL-2/) — [OFFICIAL], referenced, not fetched.

**Official — ComfyUI integration**
- [`comfy_extras/nodes_scail.py`](https://raw.githubusercontent.com/Comfy-Org/ComfyUI/master/comfy_extras/nodes_scail.py) — [OFFICIAL], accessed 2026-09-03. `DEFAULT_PALETTE` + comment, mask polarity comment, 28-ch decode, `previous_frame_count` tooltip, `negative` input.
- [Official tutorial (EN)](https://docs.comfy.org/tutorials/video/zai/scail2) — [OFFICIAL], accessed 2026-09-03.
- [Official tutorial (ZH)](https://docs.comfy.org/zh/tutorials/video/zai/scail2) — [OFFICIAL], accessed 2026-09-03.
- [Official workflow template JSON](https://github.com/Comfy-Org/workflow_templates/blob/main/templates/video_wan21_scail2_character_replacement.json) — [OFFICIAL], accessed 2026-09-03. Pair 5 verbatim, per-segment `prompt` fields, in-graph Note.
- [`SCAIL2ColoredMask` zh node doc](https://raw.githubusercontent.com/Comfy-Org/embedded-docs/main/comfyui_embedded_docs/docs/SCAIL2ColoredMask/zh.md) — [OFFICIAL, AI-generated], accessed 2026-09-03. Self-contradictory output row.
- [`Comfy-Org/SCAIL-2` card](https://huggingface.co/Comfy-Org/SCAIL-2/raw/main/README.md) — [OFFICIAL], accessed 2026-09-03. Quant list + relight LoRA.
- [ComfyUI PR #14373 (Kijai)](https://github.com/Comfy-Org/ComfyUI/pull/14373) — [OFFICIAL], referenced via search, thread not read.

**Staff / community**
- [HF `Comfy-Org/SCAIL-2` discussions/4](https://huggingface.co/Comfy-Org/SCAIL-2/discussions/4) — [STAFF] Kijai on the DPO LoRA, accessed 2026-09-03.
- [HF `Comfy-Org/SCAIL-2` discussions/2](https://huggingface.co/Comfy-Org/SCAIL-2/discussions/2) — [STAFF] Kijai on nightly-only nodes; [USER-VERIFIED] "detailed prompt" report, accessed 2026-09-03.
- [HF `Comfy-Org/SCAIL-2` discussions/3](https://huggingface.co/Comfy-Org/SCAIL-2/discussions/3) — [USER-VERIFIED] background-drift failure + first-frame-background mitigation, accessed 2026-09-03.
- [`Brobert-in-aus/scail-auto-extend` README](https://raw.githubusercontent.com/Brobert-in-aus/scail-auto-extend/main/README.md) — [TESTED], accessed 2026-09-03. The ÷32 mechanism, position-first routing, 6-identity cap, colour drift.
- [ComfyLab SCAIL-2 test](https://comfylab.dev/blog/workflows/scail-2-character-replacement-comfyui-workflow/) — [TESTED], 2026-07-03, accessed 2026-09-03. RTX 3090 timings, two template filename bugs.
- [Monster社区 thread-4183 (T8star-Aix transcription)](https://bbs.monster/thread-4183-1-1.html) — [LORE, authorised transcription], 2026-06-16, accessed 2026-09-03. Chinese prompt claim + multi-reference / background-swap failure modes.
- [Kijai wrapper issue #2031](https://github.com/kijai/ComfyUI-WanVideoWrapper/issues/2031) — [OFFICIAL, closed no-reply], accessed 2026-09-03.
- [CSDN 脑启社区 SCAIL-2 guide](https://nanhubrain.csdn.net/6a3cf71410ee7a33f2825c4d.html) — [LORE, LLM-generated, factually wrong], 2026-06-15, accessed 2026-09-03. Cited only as a source-quality example; no claims used.
