# LTX 2.3 research brief

Research baseline: 2026-08-15. Note: LTX-2.5 has superseded 2.3; see `new-models.md`.

## Official guidance

- [OFFICIAL] LTX-2.3 is a 22B audio-video model with Gemma-3-12B conditioning. Its official Comfy workflow says: describe core actions over time, all wanted visual details, and sound/dialogue. [Model card](https://huggingface.co/Lightricks/LTX-2.3) · [Comfy template](https://github.com/Comfy-Org/workflow_templates/blob/main/templates/video_ltx2_3_t2v.json)
- [OFFICIAL] The official enhancer instructs a chronological single paragraph: main action first, movements/gestures, precise appearance, environment, camera, lighting/color, and any sudden event. Keep it literal and ≤150 words. [Enhancer source](https://github.com/Lightricks/ComfyUI-LTXVideo/blob/master/prompt_enhancer_utils.py)
- [OFFICIAL] Audio and video receive different context embeddings from the same prompt. Therefore identify audible dialogue, ambience, effects and music explicitly rather than assuming visual prose will imply them. [LTX core README](https://github.com/Lightricks/LTX-2/blob/main/packages/ltx-core/README.md)
- [OFFICIAL, current code] LTX-2 now ships separate Gemma system prompts for T2V and I2V. T2V may concretize vague lighting/material/setting and add natural movement, but must preserve requested elements, use chronological present-progressive action, integrate a complete soundscape, and never invent characters/dialogue/camera motion. I2V is deliberately concise and action-focused, uses the source image as visual truth, and likewise must not invent camera movement. [T2V system prompt](https://github.com/Lightricks/LTX-2/blob/main/packages/ltx-core/src/ltx_core/text_encoders/gemma/encoders/prompts/gemma_t2v_system_prompt.txt) · [I2V system prompt](https://github.com/Lightricks/LTX-2/blob/main/packages/ltx-core/src/ltx_core/text_encoders/gemma/encoders/prompts/gemma_i2v_system_prompt.txt)

## Rewriter system prompts (verbatim)

Canonical public source: [`T2V_CINEMATIC_PROMPT` and I2V prompt constants](https://github.com/Lightricks/ComfyUI-LTXVideo/blob/master/prompt_enhancer_utils.py). Short fingerprint:

```text
“Start directly with the action, and keep descriptions literal and precise.”
```

The current LTX-2 code also ships encoder prompts named [`gemma_t2v_system_prompt.txt`](https://github.com/Lightricks/LTX-2/blob/main/packages/ltx-core/src/ltx_core/text_encoders/gemma/encoders/prompts/gemma_t2v_system_prompt.txt) and [`gemma_i2v_system_prompt.txt`](https://github.com/Lightricks/LTX-2/blob/main/packages/ltx-core/src/ltx_core/text_encoders/gemma/encoders/prompts/gemma_i2v_system_prompt.txt). Their distinguishing current rules are: do not invent camera motion, characters or dialogue; preserve exact requested speech; write one English paragraph; no timestamps/cuts unless requested; start with optional `Style:` rather than scene-opening boilerplate. Full third-party prompt bodies are intentionally not duplicated; these exact source locations are canonical.

## Chinese prompting

- [OFFICIAL] The HF card declares nine languages and Gemma 3 is multilingual. This establishes support, not Chinese superiority.
- [LORE] English is the safest default for LTX cinematography and audio vocabulary because official enhancer/examples are English. Chinese is useful for exact Chinese dialogue; keep spoken words verbatim and leave camera terminology in clear native Chinese or standard English, not mixed token salad.
- Native examples [SYNTHESIS]: `女子低声说：“别回头。”镜头缓慢推进，远处只传来列车摩擦铁轨的声音。`; `固定机位，纸灯笼轻轻摇晃，雨声持续，人物保持静止。`; `手持跟拍，男孩快速穿过夜市，脚步声与喘息声逐渐加重。`

## Motion / composition control

- Start with action, not an establishing adjective pile. Use chronological verbs and one clear subject per clause.
- Static output: specify body-part motion plus a consequence (“heel strikes puddle; water splashes backward”) and a camera relationship.
- Chaos: use a stable shot, one action chain, restrained background, and eliminate “dynamic/epic/energetic” unless converted into observable movement.
- Wrong mover: identify clothing/position, say “only,” and explicitly freeze others/camera.
- Audio sync: place dialogue or effect next to the action that produces it; quote exact dialogue and name speaker/delivery.
- I2V continuity: describe what changes from the first frame; avoid changing identity, wardrobe, layout, or lighting unless requested.
- [OFFICIAL/MAINTAINER] LTX's adherence guide says one main action per 2–3 seconds, camera type/direction/speed stated separately from subject movement, and a fixed seed when iterating. When text is insufficient, camera LoRAs or IC-LoRAs (`Motion Track Control`, `Pose Control`, `Union Control`) provide structural anchoring. [LTX adherence guide](https://ltx.io/blog/how-to-improve-ltx-2-3-prompt-adherence)
- [SYNTHESIS] Exact pose, a precise motion path, or mechanically static camera should route to the matching LoRA/control workflow when available. The prompt should still describe the intended movement, but it is semantic context—not a substitute for control input.

## Verbosity calibration

- [OFFICIAL] Enhancer ceiling: 150 words. Its node accepts up to 512 output tokens, but that is a generation limit, not a recommended prompt length.
- [OFFICIAL/MAINTAINER] A later LTX-2.3 adherence article gives a looser “under 200 words” ceiling. Preserve the stricter 150-word enhancer ceiling in enhancer mode; allow 151–200 only as a soft-warning band for manually authored longer clips. This resolves rather than hides the source conflict.
- [OFFICIAL] Legacy LTX pipeline only invokes enhancement under a configured word threshold. This supports “enhance terse inputs, preserve already-detailed prompts.”
- Recommended band [SYNTHESIS]: 60–140 words for one shot with audio; 25–80 for I2V. Load-bearing: temporal verbs, appearance anchors, camera, environment, lighting, exact sound. Noise: awards, emotional interpretation, synonyms, repeated quality claims.

## Negatives & guidance

- No model-specific negative vocabulary is documented in the primary 2.3 materials reviewed. Report as nothing reliable found.
- [OFFICIAL] The HF release includes dev, distilled, distilled-1.1 and a distilled LoRA; the official HQ command applies the distilled LoRA at 0.8. Prompt testing should not mix conclusions across these variants.
- [SYNTHESIS] Use negatives sparingly for duplicates, morphing, subtitles, unwanted score; positive instructions should carry motion and audio intent.

## Few-shot gold

### Pair 1 — person shot [SYNTHESIS]
INTENT: Musician starts a quiet guitar performance.
PROMPT-EN:
A gray-haired man seated on a wooden stool draws one slow breath, places his left hand on the red electric guitar's fretboard, and plays a soft descending phrase while his right foot keeps time. A medium shot pushes in slightly; warm practical lamps glow behind him. Finger slides, amplifier hum, and the quiet room tone remain audible.
NOTES: Action-first, chronological, literal, and audio-bearing.

### Pair 2 — landscape [SYNTHESIS]
INTENT: Storm arrives over a salt flat.
PROMPT-EN:
Wind drives a thin sheet of dust across a white salt flat as a dark storm front advances from the horizon. The camera remains locked in a wide shot; distant lightning flashes once, then rain begins to stipple the foreground. Low wind rises into a heavy gust, followed three seconds later by a muted thunder roll. No music.
NOTES: Observable change and timed sound without mood padding.

### Pair 3 — action [SYNTHESIS]
INTENT: Cyclist jumps a stair set.
PROMPT-EN:
A cyclist accelerates toward a six-step concrete stair set, compresses low over the handlebars, pulls both wheels clear of the top step, and lands rear wheel then front wheel on the pavement. A low tracking shot moves parallel at fast speed and stops after the landing. Chain rattle, tire hiss, one sharp landing impact, and a brief exhale; no dialogue.
NOTES: Physical phases, bounded camera, synchronized effects.

### Pair 4 — dialogue/audio [SYNTHESIS]
INTENT: Two friends whisper during a blackout.
PROMPT-EN:
A woman holds a flashlight beneath her chin while her friend closes the apartment door behind them. In a static medium two-shot she whispers, “Did you hear that?” Her friend turns toward the dark hallway and answers quietly, “It came from upstairs.” The flashlight trembles slightly. Rain taps the windows, the refrigerator hum has stopped, and floorboards creak above them; no background music.
PROMPT-ZH:
女子把手电筒举在下巴下方，朋友在两人身后轻轻关上公寓门。固定中景双人镜头中，她低声说：“你听见了吗？”朋友转头望向黑暗走廊，轻声回答：“声音是楼上传来的。”手电光微微发抖。雨点敲窗，冰箱停止嗡鸣，楼上传来地板吱呀声；无背景音乐。
NOTES: Dialogue is exact and adjacent to speaker/action; sound sources are concrete.

## Expert mistakes

- Using visual-only prompts on a native audio-video model.
- Appending a detached “camera tags” list instead of integrating camera behavior in chronology.
- Confusing the node's 512-token allowance with the official 150-word recommendation.
- Over-describing a first frame in I2V and underspecifying the change.
- Testing dev and distilled checkpoints with one settings/prompt assumption.
- Rewriting an exact pose/path request repeatedly instead of switching to Pose Control or Motion Track Control.

## Validator suggestions

- Target 40–150 English words; hard warning over 150 when official enhancer mode is selected.
- Require an action/change verb in the first sentence.
- For audio-enabled generation require at least one of dialogue, ambience, effect, music, or `no music/no dialogue`.
- Warn if dialogue lacks quotation marks or an attributed speaker.
- Warn on adjective/tag fragments with no finite verb; official dialect is one flowing paragraph.
- Do not require Chinese or negatives.
- If intent contains exact pose/path language and no control input is active, emit a best-effort warning and recommend Pose Control or Motion Track Control; do not merely inflate the prompt.
- Warn above one main action per 2–3 seconds of requested duration.

## Sources

- [LTX-2.3 model card](https://huggingface.co/Lightricks/LTX-2.3) — [OFFICIAL], accessed 2026-08-15.
- [Official LTX-2 repository](https://github.com/Lightricks/LTX-2) — [OFFICIAL], accessed 2026-08-15.
- [Official ComfyUI enhancer](https://github.com/Lightricks/ComfyUI-LTXVideo/blob/master/prompt_enhancer_utils.py) — [OFFICIAL], accessed 2026-08-15.
- [Official Comfy workflow template](https://github.com/Comfy-Org/workflow_templates/blob/main/templates/video_ltx2_3_t2v.json) — [OFFICIAL/MAINTAINER], accessed 2026-08-15.
- [Current Gemma T2V system prompt](https://github.com/Lightricks/LTX-2/blob/main/packages/ltx-core/src/ltx_core/text_encoders/gemma/encoders/prompts/gemma_t2v_system_prompt.txt) and [I2V system prompt](https://github.com/Lightricks/LTX-2/blob/main/packages/ltx-core/src/ltx_core/text_encoders/gemma/encoders/prompts/gemma_i2v_system_prompt.txt) — [OFFICIAL], accessed 2026-08-15.
- [LTX-2.3 prompt-adherence guide](https://ltx.io/blog/how-to-improve-ltx-2-3-prompt-adherence) — [OFFICIAL/MAINTAINER], 2026-05-13, accessed 2026-08-15.

---

## 2026-09 sweep (agent 1D)

**Scope.** LTX-2.5 (launched 2026-08-11) prompt semantics after the Prompt-Enhancer default change, plus LTX-2.3 residuals. All URLs accessed **2026-09-03** unless stated. Everything above this header is the 2026-08-15 baseline and is left unmodified.

**Tooling caveats for this run (affects how to re-verify).**
- `api.github.com` returns **empty response bodies** through this environment's fetcher (tried `/repos/.../issues/N`, `/repos/.../contents/...`, `/search/issues`). The 09-03 plan note that GitHub issue JSON is preferable is **stale**; use the HTML issue pages instead.
- The sandbox shell (`mcp__workspace__bash`) has **no network** (curl returns HTTP `000`). Only the fetch tool reaches the internet.
- **HF discussion pages are served from a stale edge cache** whose age varies per request: the same repo reported "like 2.56k / Community 63" on the index and "like 1.26k / Community 58" on `discussions/54`, and relative timestamps ("1 day ago") disagree between index and detail views. **Dates below are taken from the discussions index page, not from detail pages.** Absolute comment anchors (`#6a…`) are stable and are the safest re-verification handle.
- `raw.githubusercontent.com` works. `docs.ltx.io` serves clean Markdown via `<url>.md` and indexes at `/llms.txt`. `docs.comfy.org` serves Markdown directly.

---

### New official guidance

**1. The official prompting guide was rewritten for 2.5 and the ≤150-word cap is gone.** [OFFICIAL]
Two URLs now serve byte-identical bodies: [`/api-documentation/implementation-guides/prompting-guide.md`](https://docs.ltx.io/api-documentation/implementation-guides/prompting-guide.md) and [`/open-source-model/usage-guides/prompting-guide.md`](https://docs.ltx.io/open-source-model/usage-guides/prompting-guide.md) (the open-source path is the one the 2.5 overview links to and is **absent from `/llms.txt`** — you have to guess it). Length guidance verbatim:

```text
### Simple / Single-Shot

For a single continuous take, a short flowing description works best:

* Write your prompt as a **single flowing paragraph**
* Use **present tense** verbs for action and movement
* Match the level of detail to the shot scale (close-ups need more detail than wide shots)
* Describe camera movement relative to the subject
* Aim for roughly **4–8 descriptive sentences**

### Length

Match length to complexity. A simple single shot is often 4–8 sentences; a longer screenplay-style
scene can run longer, provided every sentence adds concrete visual or audio detail.
```

There is **no word count anywhere** on this page. The old numeric ceilings survive only in two older places: the LTX-2 GitHub README still says "**Keep within 200 words**" ([README](https://raw.githubusercontent.com/Lightricks/LTX-2/main/README.md), 2.5-era file, still 2.3-flavoured prose), and the ≤150 figure now exists **only** in the legacy LTXV-0.9 enhancer file our baseline cites. Current official position: **sentence-count, not word-count.**

**2. Auto Duration: the prompt sets the length, and it does not pad.** [OFFICIAL] Verbatim from the prompting guide:

```text
**Pace the action in the prompt itself.** LTX-2.5's optional duration predictor sizes the clip to the
action you describe and times it as written — it won't stretch a moment or add a pause you didn't ask
for. Write the beats you want into the prompt ("she pauses", "a beat of silence") so they're part of
the action, or set an explicit duration to give the whole sequence more room.
```

Overview page, verbatim: "**Auto duration** — the model interprets the event or motion described in the prompt and predicts the appropriate clip duration before diffusion starts. Duration is connected to what needs to happen in the scene rather than a fixed parameter." ([overview](https://docs.ltx.io/open-source-model/getting-started/overview.md))

**Mechanically it is a separate optional weight file, not a model behaviour you get for free.** [OFFICIAL] LTX-2 README: "**Duration Head** - optional; lets you omit `--num-frames` and have the clip length predicted from the prompt — `ltx-2.5-duration-head-bf16.safetensors`" (in `model_patches/`). The PyTorch-API page adds verbatim: "Omit `--num-frames` to let the duration head pick a length from the prompt (LTX-2.5+), or set it explicitly, e.g. `--num-frames 121`." ([pytorch-api](https://docs.ltx.io/open-source-model/integration-tools/pytorch-api.md))

**3. Native Multishot has a documented prose syntax, and it does NOT abolish the 2.3 rule — it gates it.** [OFFICIAL] The whole Multi-Shot section verbatim (prompting guide):

```text
## Multi-Shot Prompts

The guidance above focuses on prompting for a single continuous shot. **LTX-2.5** can also generate
**multi-shot scenes**: several distinct shots joined by explicit cuts inside one prompt.

Write the full scene as **one chronological paragraph** (or a short sequence of sentences). Do not use
a shot list, numbered beats, or screenplay sluglines unless you also name the cut in prose.

### What to Include at Every Cut

1. **Name the transition** in natural language — e.g. "A hard cut transitions to…", "The view cuts to
   a close-up of…", "A match cut connects…", "The image dissolves into…".
2. **Re-establish the new shot** — shot scale, camera angle, who or what is in frame, and lighting if
   it changed.
3. **Keep identity consistent** — reuse the same visual identifiers for recurring people or objects
   ("the woman in the red coat, earlier at the table, now…").
4. **State audio continuity** — e.g. "the piano score continues across the cut" or "the dialogue
   drops; only wind remains."

### Tips for Strong Multi-Shot Prompts

* **Prefer 2–4 shots** in one generation; more cuts usually need clearer, shorter beats per shot.
* **Give each shot a clear job** (establish → detail → reaction, or wide → medium → close-up).
* **Keep action chronological** e.g. "Initially…", "A moment later…", "Simultaneously…".
* The **same rules as single-shot** apply: present tense, physical emotion cues, quoted dialogue,
  concrete camera language.
* **Avoid conflicting geography or unexplained costume changes** between cuts unless the cut is meant
  to jump time or place and you say so.
```

And the single-shot / multi-shot contrast table verbatim:

```text
|             | Single-shot                            | Multi-shot                                                                 |
| ----------- | -------------------------------------- | -------------------------------------------------------------------------- |
| Camera      | One continuous take                    | New framing after each cut                                                 |
| Transitions | Camera moves only (pan, push-in, etc.) | Name the edit: hard cut, match cut, dissolve, etc.                         |
| Continuity  | Same space / subjects throughout       | Re-identify subjects when they reappear; say what carries across the cut   |
| Audio       | One continuous soundscape              | At every cut, say whether music / dialogue / ambience continues or changes |
```

**Answer to the brief's question — do named cuts break the 2.3 "one camera verb first, no cuts" rule?** [SYNTHESIS from two [OFFICIAL] sources] **No — the rule becomes conditional, and the condition is enforced by the enhancer.** The current Gemma enhancer system prompt (main branch, unchanged from the 2.5-era snapshot) still contains verbatim:

```text
- Camera motion: DO NOT invent camera motion unless requested by the user.
- No timestamps or cuts: DO NOT use timestamps or describe scene cuts unless explicitly requested.
```

So cuts are legal in LTX-2.5 *only when the author names them*, and the enhancer will neither invent nor remove them. "One camera verb first, no cuts" therefore holds for **single-shot mode** and is **replaced per-shot** in multishot mode: each shot still gets exactly one camera treatment, and the cut is a named transition between shots rather than a camera move. That is a scoped amendment, not a repeal.

**4. Enhancer guidance, current, verbatim** ([prompting guide](https://docs.ltx.io/open-source-model/usage-guides/prompting-guide.md)):

```text
LTX pipelines include an optional **prompt enhancer**: an LLM rewrite pass (the Gemma 4 E2B model)
that expands your prompt using a system prompt tuned for text-to-video or image-to-video before
generation runs. It's enabled with `--enhance-prompt` in `ltx-pipelines` and via a dedicated node in
the official ComfyUI templates, and it can be turned off in both.

Use it when your prompt is short, rough, or was written for a different model — it will translate the
phrasing into the structure LTX expects. It helps least when your prompt already follows the structure
above: a detailed, well-formed prompt often passes through with little change. Leave it off if you want
your prompt to run exactly as written.
```

Also verbatim: "**Coming from another model?** Don't paste a prompt written for another video model into LTX unchanged — the content usually carries over, but tag syntax and shot-list formatting don't, and tend to underperform."

**5. Enhancer default state — three official surfaces, and the shipped file settles it.** [OFFICIAL/TESTED]
- **Python path: OFF.** `--enhance-prompt` is listed as an opt-in flag in [`installation.md`](https://raw.githubusercontent.com/Lightricks/LTX-2/main/packages/ltx-pipelines/docs/installation.md) ("rewrite the prompt with the built-in enhancer before generation"), and pipeline signatures default it off — e.g. `dubit.py`: `enhance_prompt: bool = False`.
- **ComfyUI, per Lightricks' own docs: ON.** [`text-to-video.md`](https://docs.ltx.io/open-source-model/usage-guides/text-to-video.md) verbatim: "The template turns on **Prompt Enhance** by default, which expands a short prompt into a more detailed one before it's encoded. Turn it off to use your prompt exactly as written."
- **ComfyUI, per Comfy Org's docs: OFF.** [`docs.comfy.org/tutorials/video/ltx/ltx-2-5`](https://docs.comfy.org/tutorials/video/ltx/ltx-2-5) verbatim: "**Use the prompt enhancer (optional)**: The workflow keeps it off by default. Enable `prompt_enhance` on the LTX-2.5 node to expand short prompts into detailed cinematic instructions. It needs the separate enhancer model (~5 GB) and adds about 1-2 minutes of generation time".
- **The shipped template says ON.** [TESTED — static inspection of the JSON, 2026-09-03] In [`Comfy-Org/workflow_templates/templates/video_ltx2_5_t2v.json`](https://raw.githubusercontent.com/Comfy-Org/workflow_templates/blob/main/templates/video_ltx2_5_t2v.json) the subgraph node's declared input order is `prompt` → `prompt_enhance` (BOOLEAN) → `duration` (INT) → `width` → `height` → `seed` → `frame_rate` → `unet_name` → `video_vae` → `audio_vae` → `clip_name_1` → `upscale_model` → `prompt_enhance_model`, and its `widgets_values` array is:

```json
[ "<the long Arctic-hunter prompt>", true, 5, 1280, 720, 558811532553686, 24,
  "ltx-2.5-22b-distilled-transformer-comfy-int8-convrot.safetensors",
  "ltx-2.5-video-vae-bf16.safetensors", "ltx-2.5-audio-vae-bf16.safetensors",
  "gemma4-12b-with-proj-ltx-2.5-comfy-int8-convrot.safetensors",
  "ltx-2.5-latent-spatial-upscaler-x2-bf16-1.0.safetensors",
  "gemma4_e2b_it_bf16.safetensors" ]
```

`prompt_enhance = true`. **Lightricks' docs are right; Comfy Org's tutorial line is wrong** as of 2026-09-03. Teaching consequence: a student following the ComfyUI tutorial will believe their prompt ran verbatim when it did not. **How to disable in ComfyUI:** toggle the `prompt_enhance` boolean on the "Text to Video (LTX-2.5)" subgraph node (no rewiring needed); the `prompt_enhance_model` slot (`gemma4_e2b_it_bf16.safetensors`, or Comfy's `gemma4_e2b_it_int8_convrot.safetensors`) then goes unused.

**The 08-11 → 08-20 "default-on window" could not be confirmed and looks mis-stated.** Nothing on any surface reached this run dates a change of the enhancer default, and the template on `main` is default-**on** today. Report as: default-on is the **current** shipped state of the official ComfyUI T2V template, not a closed historical window. Scoped absence: no changelog entry for an enhancer-default change was found on `docs.ltx.io`, `ltx.io/release-notes` (linked, not fetched), the LTX-2 README, or the ComfyUI-LTXVideo README.

**6. Enhancer system prompts — canonical location moved, and our baseline cites the wrong file for 2.5.** [OFFICIAL]
The 2.5 enhancer prompts are the two Gemma files in `ltx-core`, verified byte-identical on `main` and in the Diffusers mirror: [`gemma_t2v_system_prompt.txt`](https://raw.githubusercontent.com/Lightricks/LTX-2/main/packages/ltx-core/src/ltx_core/text_encoders/gemma/encoders/prompts/gemma_t2v_system_prompt.txt) and `gemma_i2v_system_prompt.txt`. Diffusers vendors both verbatim as `T2V_DEFAULT_SYSTEM_PROMPT` / `I2V_DEFAULT_SYSTEM_PROMPT` in [`diffusers/pipelines/ltx2/utils.py`](https://raw.githubusercontent.com/huggingface/diffusers/main/src/diffusers/pipelines/ltx2/utils.py) — the easiest single-file read of both.

Load-bearing T2V clauses, verbatim (full text is at the URLs; not duplicated here beyond what changes our guidance):

```text
- Style: Include visual style at the beginning: "Style: <style>, <rest of prompt>." Default to
  cinematic-realistic if unspecified. Omit if unclear.
- Restrained language: Avoid dramatic/exaggerated terms. Use mild, natural phrasing.
    - Colors: Use plain terms ("red dress"), not intensified ("vibrant blue," "bright red").
- Camera motion: DO NOT invent camera motion unless requested by the user.
- No timestamps or cuts: DO NOT use timestamps or describe scene cuts unless explicitly requested.
- If the user's raw input prompt is highly detailed, chronological and in the requested format: DO NOT
  make major edits or introduce new elements. Add/enhance audio descriptions if missing.
```

I2V adds, verbatim: "Describe only changes from the image: Don't reiterate established visual details. **Inaccurate descriptions may cause scene cuts.**" — an official causal mechanism for the "over-describing the first frame" mistake already in our Expert-mistakes list.

**The file our baseline calls canonical, [`ComfyUI-LTXVideo/prompt_enhancer_utils.py`](https://github.com/Lightricks/ComfyUI-LTXVideo/blob/master/prompt_enhancer_utils.py), is the legacy LTXV-0.9 enhancer, not the 2.5 one.** Its loader [`prompt_enhancer_nodes.py`](https://raw.githubusercontent.com/Lightricks/ComfyUI-LTXVideo/master/prompt_enhancer_nodes.py) hard-codes `LLM_NAME = ["unsloth/Llama-3.2-3B-Instruct"]` and `IMAGE_CAPTIONER = ["MiaoshouAI/Florence-2-large-PromptGen-v2.0"]`, with `max_resulting_tokens` default 256 / max 512 — a Llama-3.2-3B + Florence-2 pair that has nothing to do with the Gemma 4 E2B path 2.5 uses. Our 512-token and 150-word notes both descend from this dead file.

**7. LTX-2.5 has an official negative prompt — two of them, and they disagree.** [OFFICIAL] This directly contradicts our baseline's "no model-specific negative vocabulary." Canonical text, verbatim from [`ltx_pipelines/utils/constants.py`](https://raw.githubusercontent.com/Lightricks/LTX-2/main/packages/ltx-pipelines/src/ltx_pipelines/utils/constants.py):

```python
DEFAULT_NEGATIVE_PROMPT = (
    "has_subtitles, has_blurbox, transition from black, transition to black, speech_ending_short, "
    "blurry, out of focus, overexposed, underexposed, low contrast, washed out colors, excessive noise, "
    "grainy texture, poor lighting, flickering, motion blur, distorted proportions, unnatural skin tones, "
    "deformed facial features, asymmetrical face, missing facial features, extra limbs, disfigured hands, "
    "wrong hand count, artifacts around text, inconsistent perspective, camera shake, incorrect depth of "
    "field, background too sharp, background clutter, distracting reflections, harsh shadows, inconsistent "
    "lighting direction, color banding, cartoonish rendering, 3D CGI look, unrealistic materials, uncanny "
    "valley effect, incorrect ethnicity, wrong gender, exaggerated expressions, wrong gaze direction, "
    "mismatched lip sync, silent or muted audio, distorted voice, robotic voice, echo, background noise, "
    "off-sync audio, incorrect dialogue, added dialogue, repetitive speech, jittery movement, awkward "
    "pauses, incorrect timing, unnatural transitions, inconsistent framing, tilted camera, flat lighting, "
    "inconsistent tone, cinematic oversaturation, stylized filters, or AI artifacts."
)
```

Two things matter here. (a) The **first five tokens are snake_case/phrase artifacts that look like trained tags, not prose**: `has_subtitles, has_blurbox, transition from black, transition to black, speech_ending_short`. `has_subtitles` and `has_blurbox` in particular read as dataset attribute flags, i.e. the model was trained with such labels and they are being negated by name. That is the first evidence of anything tag-like being load-bearing in an LTX prompt field. `[SPECULATION]` that they are trained tokens; `[OFFICIAL]` that they are the first five items of the official default negative. (b) **Diffusers dropped exactly those five** when vendoring the constant — its `DEFAULT_NEGATIVE_PROMPT` starts at `"blurry, out of focus, …"`. So a student on the Diffusers path silently gets a weaker negative than the native path. Both copies also end with the grammatically odd `"stylized filters, or AI artifacts."`, i.e. Lightricks wrote it as an English list, not a token list.

**A third, completely different negative ships in the official ComfyUI template.** [OFFICIAL/TESTED] Inside the T2V subgraph, a `CLIPTextEncode`-side primitive holds verbatim:

```text
pc game, console game, video game, cartoon, childish, ugly
```

Corroborated in prose by [`text-to-video.md`](https://docs.ltx.io/open-source-model/usage-guides/text-to-video.md): "A negative prompt (`\"pc game, console game, video game, cartoon, childish, ugly\"`) is applied automatically." Six tokens, aesthetic-only, no audio terms — nothing like the 400-word native default. **Three official negatives now exist for one model** (native, Diffusers-truncated, ComfyUI-template) and no source reconciles them.

**8. Mechanics, verbatim.** [OFFICIAL]
- `pytorch-api.md`: "**Dimension constraints:** Width and height must be divisible by 32. Frame count must follow the pattern `8n + 1` (valid values: 1, 9, 17, 25, …, 97, 105, 113, 121, etc.)."
- `ltx-core/README.md` (VAE, the underlying reason): "Encoder: Compresses `[B, 3, F, H, W]` pixels → `[B, 128, F', H/32, W/32]` latents — Where `F' = 1 + (F-1)/8` (**frame count must satisfy `(F-1) % 8 == 0`**)". So `num_frames % 8 == 1` and `÷32` are one constraint each on the VAE's compression factors (8× temporal, 32× spatial), not arbitrary UI rules.
- `text-to-video.md` template table: "**Length** 97 frames — Frame count must be `1 + a multiple of 8` (e.g. 97 = 1 + 96)"; "**Width** 768 — Base resolution. Must be divisible by 32."
- `pipelines.md`, RetakePipeline: "**Constraints:** Source video frame count must satisfy the 8k+1 format (e.g. 97, 193) and resolution must be multiples of 32."
- `pipelines.md`, DubItPipeline: "frame count is **silently snapped** to the nearest `8k+1`" (`snap_frames_to_grid` in `dubit.py`). So an out-of-grid request is not always an error — sometimes it is a silent length change.
- **20 s max** is an API/product figure, not a local-weights figure: [`ltx.io/llm-info`](https://ltx.io/llm-info) "Duration: up to 20 seconds per generation" and "Videos can be extended beyond 20 seconds using the Extend pipeline". The Comfy blog gives the hosted envelopes: "**LTX-2.5 (Fast)** — 2 to 20 seconds… Clips over 10 seconds run at 720p or 1080p and 24 or 25fps. **LTX-2.5 (Pro)** — 2 to 10 seconds at 720p or 1080p". No 20 s clamp was found in the local `ltx-pipelines` docs — the local limit is VRAM and the 8n+1 grid.
- **Frame/duration table**, verbatim from `pytorch-api.md`: 65→~2.7 s, 97→~4.0 s, 121→~5.0 s, 161→~6.7 s, 257→~10.7 s (at 24 fps).
- **Sampling**, verbatim: distilled 4–8 steps / CFG 1.0; full model 20–50 steps / CFG 2.0–5.0, "Recommended 3.0–3.5".

**9. Gemma 4 encoder is version-gated and cannot be substituted.** [OFFICIAL] LTX-2 README, verbatim: "Google's stock Gemma 4 release is not a substitute: loading checks the encoder's version against the one the checkpoint was trained with (`gemma4-12b-ltx-v1`)." The encoder ships **with** the model (`gemma4-12b-with-proj-ltx-2.5-bf16.safetensors`); the 2.3 flow of downloading stock Gemma 3 separately is gone. Quick-start download set is "roughly **66 GiB**".

**10. VRAM: the "12 GB" claim has no support on any technical surface.** [OFFICIAL, conflicting]
- `docs.ltx.io/open-source-model/getting-started/system-requirements.md`, **Minimum**: "**GPU**: NVIDIA GPU with a minimum **32GB+ VRAM** - more is better; **RAM**: 32GB; **Storage**: 100GB; **CUDA**: 12.7+; **Python**: 3.12+". Recommended: A100 80GB or H100.
- `ComfyUI-LTXVideo/README.md` Prerequisites: "CUDA-compatible GPU with **32GB+ VRAM**", and its low-VRAM loaders "perform the model offloading such that generation fits in **32 GB VRAM**".
- `ltx.io/llm-info` (marketing): "Hardware requirement for full model: GPU with 80GB+ VRAM. Distilled and FP8-quantized variants support 32GB, and run locally on a single GPU with **as little as 12GB VRAM**."
- A third figure exists: the product comparison table reportedly says "Runs on any GPU" with a **16GB** minimum — reported by [AlphaLab](https://www.alphalab.site/ltx-2-5-multishot-local-video-model) (zh-TW, 2026-08-13) `[LORE]`, which states the same conclusion I reached independently: "官方 ComfyUI 節點也把 32GB+ 列為需求，所謂 low-VRAM offloading 是「把生成塞進 32GB」，不是已驗證的 16GB 基準."
- **The paths behind the low numbers, verbatim** [OFFICIAL]: `--quantization fp8-cast --offload {cpu,disk}` (README); `--offload cpu` "streams weights from system RAM per layer", `--offload disk` "reads them from disk on demand (lowest memory, slower)"; `PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True`; `ltx-core`'s **block streaming** ("streams the transformer's blocks through a small rolling set of GPU buffers… so only a few blocks are resident on the GPU at any moment", RAM- or disk-backed); ComfyUI's int8 files (`ltx-2.5-22b-distilled-transformer-comfy-int8-convrot.safetensors`) plus `LTXVTiledVAEDecode` / `LTXVSpatioTemporalTiledVAEDecode` and `--reserve-vram`. **No GGUF path is documented on any official surface** — GGUF is a community request (HF discussion #18, "We need gguf and gguf workflow", opened 22 days before index fetch, no reply). The digest's "the 12GB figure probably assumes GGUF/offload" should become "assumes int8/fp8 + offload/block-streaming; GGUF is unofficial."

**11. The T2V/I2V spatial-upscaler discrepancy is a docs bug, now with a falsifiable claim attached.** [OFFICIAL, resolved to docs bug]
The 2.5 latent spatial upscaler **exists in the LTX-2.5 repo** and is what the canonical README and the shipped ComfyUI template use: `latent_upscale_models/ltx-2.5-latent-spatial-upscaler-x2-bf16-1.0.safetensors` (LTX-2 README "Spatial Upscaler - required by the two-stage pipeline implementations in this repository"; the same filename is the `upscale_model` widget value in `video_ltx2_5_t2v.json`; docs.comfy.org lists it too). But **two `docs.ltx.io` pages still point at the 2.3 file**, and one of them makes an explicit claim that is now false:
- `quick-start.md`: `hf download Lightricks/LTX-2.3 ltx-2.3-spatial-upscaler-x2-1.1.safetensors` then `--spatial-upsampler-path models/ltx-2.3/…`.
- `pytorch-api.md`: "# Spatial upscaler (**still hosted on the LTX-2.3 repo**; required by the distilled pipeline)".
Verdict: **docs bug on `docs.ltx.io`, not a requirement.** Evidence grade [OFFICIAL] for the contradiction; [SYNTHESIS] for "bug" (three independent surfaces — repo README, HF model card snippet, ComfyUI template — all use the 2.5 file). Note the same two pages are simultaneously *newer* than the README in one respect: they are the only place that documents `--duration-head-path`. So neither page is wholly stale; they are partially updated. Also inconsistent: `text-to-video.md` says the template defaults are 768×512 / 97 frames, while the shipped template is **1280×720 / duration 5 s**.

**12. Auto Duration is NOT wired into the shipped ComfyUI template.** [TESTED — static inspection, 2026-09-03] `video_ltx2_5_t2v.json` exposes `duration` as a plain `PrimitiveInt` titled "Duration" with `widgets_values: [5, "fixed"]` — **seconds, explicit, no duration-head node**. Grepping the whole 3,673-line template for `Duration|model_patch|LTX2|LTXV` returns only that primitive plus the note text; there is no duration-head loader and no `model_patches/` reference. The template's own note says "duration | Clip length in seconds (**Auto Duration can predict it from the action**)", which is aspirational: the prediction requires `ltx-2.5-duration-head-bf16.safetensors` on the Python path. Comfy Org's Rob calls it "a **small experimental** duration head model that automatically sets the length of the generated video" ([blog.comfy.org](https://blog.comfy.org/p/ltx-25-day-0-support-in-comfyui), 2026-08-12) [OFFICIAL/MAINTAINER]. **Teaching consequence: in ComfyUI today, duration is a number you type; Auto Duration is a Python-path feature.**

**13. IC-LoRA controls for 2.5 — the roster changed and "Pose Control" is no longer a separate adapter.** [OFFICIAL] From [`ic-lo-ra-adapters.md`](https://docs.ltx.io/open-source-model/integration-tools/ic-lo-ra-adapters.md) and [`ic-lo-ra.md`](https://docs.ltx.io/open-source-model/usage-guides/ic-lo-ra.md):
- **Union Control** is now the pose route: "A single IC-LoRA that handles multiple control types (**depth, canny, and pose**) in one checkpoint" — `Lightricks/LTX-2.3-22b-IC-LoRA-Union-Control`. The standalone `ltx-2-19b-ic-lora-pose-control.safetensors` still listed in the ComfyUI-LTXVideo README is an **LTX-2.0 (19b)** adapter and is not in the "All LTX-2.5 IC-LoRAs" table. **Our baseline's `Pose Control` recommendation must be re-pointed to Union Control for 2.5.**
- **Motion Control** (formerly "Motion Track Control") — `LTX-2.3-22b-IC-LoRA-Motion-Track-Control`, "Guides object motion using sparse spline-based trajectories rendered as trails of circles." Two dedicated nodes: **LTX Draw Tracks** (canvas) and **LTX Sparse Track Editor**. Best practices verbatim: "Start with **3-4 keypoints per track**; add more only if the interpolated path doesn't match your intent"; "Keep trajectories physically plausible — sudden direction changes produce less natural results"; "Match the track canvas resolution to your generation resolution."
- **How controls interact with prose, verbatim** (the answer to the brief's question):

```text
### Prompt Alignment

* For control-type IC-LoRAs, describe visual style, not control type ("ornate architecture" not
  "depth map shows...")
* For IC-LoRAs with a trigger phrase, prepend it to the prompt before any scene description
* Align prompt with the reference input's motion and composition
* Be specific about materials, lighting, and atmosphere
* Avoid contradicting the structure or content of the reference
```

- **Trigger phrases are real prompt syntax for some adapters** [OFFICIAL], verbatim: "Some adapters use a **trigger phrase** prepended to the prompt (e.g. `DEBLUR`, `REMOVEBEARD`, `COLORIZE`, `ADD WATER`, `ENHANCE QUALITY`) — check the adapter's README file for the correct trigger."
- **Ingredients has a two-field prompt format** [OFFICIAL], verbatim: "You provide the reference sheet as a static video and a two-part prompt (`Reference sheet: <panels> / Generated video: <action>`)".
- **Strength is now tunable** (was fixed 1.0): `attention_strength` 0.0–1.0 (default 1.0) plus optional spatial `H×W` or spatiotemporal `T×H×W` `attention_mask`, via **LTX Add Video IC-LoRA Guide Advanced**. Verbatim: "`0.5` — Balanced blend of control signal and free generation"; "Reduce `attention_strength` to 0.5-0.8 for a softer control effect."
- IC-LoRA resolution guidance verbatim: "For best results: **704x1216 at 24-30 FPS**"; reference clips "25 fps is standard for most adapters".
- **HDR, Dub-It and Relight are 2.3-only**: "**Compatibility:** LTX-2.3 only — LTX-2.5 support in development." Every other adapter in the 2.5 table is still named `LTX-2.3-22b-…`; only the Pixel Spatial Upscaler has a 2.5 build (`Lightricks/LTX-2.5-22b-IC-LoRA-Pixel-Spatial-Upscaler`, "strength is fixed at 0.5" per the HF card snippet).

**14. Dub-It prompt template, verbatim** [OFFICIAL] ([prompting guide](https://docs.ltx.io/open-source-model/usage-guides/prompting-guide.md)) — this is the only place LTX documents a *slot-filling* prompt format:

```text
[Speaker] is speaking [Language/Accent], saying: "[Dialogue]"
```

Example verbatim: `A woman speaking in Russian saying: "Сегодня отличный день, чтобы протестировать рабочие процессы ComfyUI для дубляжа с использованием LTX."` Requirements verbatim: "**Provide the full dialogue text** — the model follows the content of the prompt. It does **not** translate dialogue for you"; "**Use native script** — write dialogue in the alphabet of the target language (e.g., Cyrillic for Russian, **Chinese characters for Mandarin**)"; "**Single speaker** — the beta IC-LoRA does not distinguish between multiple speakers"; "**Match audio length** — keep your prompt at roughly the same timing and syllable length as the original dialogue. Slightly longer is better than too short. Prompt too long: the model might skip words. Prompt too short: the output might sound slow and unnatural." Validated languages verbatim: "**English, French, Spanish, German, Russian**" — **Chinese is not on the validated list** even though native script is recommended.

**15. Licence, verbatim (the $10M clause).** [OFFICIAL] Full text at [`Lightricks/LTX-2/blob/main/LICENSE`](https://raw.githubusercontent.com/Lightricks/LTX-2/main/LICENSE). Header: `LTX-2.x Community License Agreement` / `License date: August 11, 2026`. The operative clause, §2.1:

```text
      2.1 Subject to your compliance with the terms and conditions of
          this Agreement, you are granted a non-exclusive, worldwide,
          non-transferable and royalty-free limited license … for any purpose, subject to the
          restrictions set forth in Attachment A; provided however, that Entities with
          annual revenues of at least $10,000,000 (the "Commercial
          Entities") are required to obtain a paid license for any use
          (excluding use solely for a Non-Commercial Purpose as set
          forth in Section 2.2) of LTX-2.x and Derivatives of LTX-2.x …
          Commercial Entities interested in such a commercial license are required
          to contact Licensor (ltxv-licensing@lightricks.com).
```

Points a class needs: **"annual revenues", not ARR** — the marketing pages say "$10M ARR", the agreement says annual revenues (AlphaLab flags the same gap). §1.6 aggregates "all subsidiaries, affiliates, and companies under common Control" when testing the threshold. §1.9 binds "all LTX-2.5 versions released since August 11, 2026, and all future releases of LTX-2.x". §2.2 carves out a Non-Commercial Purpose for big companies (personal/hobby use; "testing, evaluation, or non-commercial research and development in a non-production or development environment") but excludes anything revenue-generating, anything with end-user impact, and training/fine-tuning/distilling for commercial use. Attachment A restriction **#18**: "For commercial use only: To train, improve, or fine-tune any other machine learning model, artificial intelligence system, or **competing model**, except for Derivatives of LTX-2.x as expressly permitted under this Agreement." **#20**: no use "in any product, service, or application that **directly competes with Licensor's commercial products or services**… without obtaining a separate commercial license." **#5** requires disclosing machine-generated content. §6 forbids removing "watermarking, content provenance, latent disclosure" features and cites the EU AI Act and the California AI Transparency Act by name. §12/§14: New York law, ICC arbitration seated in New York, jury-trial and class-action waivers for non-consumers. **Prompt Studio itself is a teaching app, not a competing video model** — but #18/#20 are worth a GOTCHAS line for students who plan products.

**Gated-repo status confirmed** [OFFICIAL]: docs.comfy.org callout verbatim: "The LTX-2.5 model files are hosted in the **gated** [Lightricks/LTX-2.5] repository on Hugging Face. Open the repository page, accept the model license, and wait for your access request to be approved before downloading the models. Model downloads will fail without access." LTX-2 README verbatim: "If you get a 401/403, accept the model terms on Hugging Face and log in with a **Read** token (fine-grained tokens need the 'read gated repos' scope enabled)." Note the HF metadata line differs by repo: `Lightricks/LTX-2.5` shows `License: ltx-2.x-community-license-agreement` on the current index while `LTX-2.5-Diffusers` and older cached snapshots show `ltx-2-community-license-agreement`.

**16. `[STAFF]` — Lightricks org member on encoder substitution.** [STAFF]
`art-alex`, badged **"LTX.io org"** on the model's own repo (role evidence: the org badge renders next to the username on `huggingface.co/Lightricks/…`; the same account is recorded on `LTX-2.5-Diffusers/discussions/14` performing an org-only action, "changed pull request status to **merged**"). On [`Lightricks/LTX-2.5/discussions/34`](https://huggingface.co/Lightricks/LTX-2.5/discussions/34) (thread "Gemma 4", opened 2026-08-15 per the index; reply anchor `#6a7eab28198a731624f3cdce`):

```text
Are you using the one of those text encoders?
Since the model and the encoder were trained together, using the model with any other encoder produces sub optimal results.
If you are using the text encode API - then the new encoder is not supported there yet and we are working on adding support for it.
```

Two teachable facts: (a) encoder swaps degrade output — corroborates the `gemma4-12b-ltx-v1` version gate; (b) at the time of writing, **the free `GemmaAPITextEncode` node did not support the 2.5 encoder**. Anyone who used the API text-encode node with LTX-2.5 in the first weeks was encoding with the wrong encoder — a second class of invalid early test alongside the enhancer default. `docs.ltx.io` documents the node ("Free API-based text encoder that replaces the local Gemma") with **no version caveat**; that caveat exists only in this staff comment.

**17. Other official-surface facts worth folding in.** [OFFICIAL]
- Audio is "temporally synchronized **24 kHz stereo**" (`llm-info`); `ltx-core` README: audio VAE ingests 16 kHz mel, vocoder outputs 24 kHz stereo. Video context `[B, seq_len, 4096]`, audio context `[B, seq_len, 2048]` — the "different embeddings from one prompt" claim in our baseline is confirmed with dimensions.
- Camera-control LoRAs remain a **closed set of 7**: Dolly-in / Dolly-out / Dolly-left / Dolly-right / Jib-up / Jib-down / Static (`llm-info`; filenames `ltx-2-19b-lora-camera-control-*` in the ComfyUI-LTXVideo README — i.e. still **LTX-2.0-era** files, no 2.5 rebuild).
- `MultimodalGuider` gives per-modality CFG/STG/`modality_scale`; troubleshooting verbatim: "**Suggested baseline for balanced speed and consistency is Modality: 1 and Skip Step: 1**"; "**Higher values:** Tighter alignment (perfect for lip-sync or rhythmic action)."
- `LTXVNormalizingSampler` caveats verbatim: "Use this node **ONLY for the first sampling stage**"; "**Do not use this sampler for inpainting, video extension, or any workflow using masks.** It may break the context audio"; "Ensure you are using the **Distilled** model with the standard 8-step manual sigma schedule. This node is **NOT** tuned for the full model."
- Known weaknesses, verbatim from the prompting guide: "**On-screen text** — LTX-2.5 improves short-text accuracy … but exact spelling and consistency across frames are **not guaranteed**. Keep text short and prominent, verify it throughout the clip, and add critical titles, labels, or logos in post"; "**Complex physics** — highly chaotic motion can introduce artifacts."
- Two official sample prompts on the prompting guide are **screenplay-style with sluglines** (`EXT. TOWN STREET – MORNING – LIVE NEWS BROADCAST`, `Reporter: "…"`). Official position: sluglines and character cues are acceptable **for the longer/dialogue form**, while the *single-shot* form stays one flowing paragraph. This softens our baseline's blanket "one flowing paragraph" rule.
- `ltx.io/llm-info` still carries no mention of the enhancer default and is "Last updated: August 2026"; the 08-28 digest's criticism stands unchanged.

---

### Chinese sources

**Expected none; found derivative coverage and zero prompt vocabulary.** [SYNTHESIS]

Searched 2026-09-03: `LTX-2.5 提示词 中文`, `LTX 2.5 视频模型 提示词写法`, plus the pages the searches surfaced. Reached and read: [AlphaLab (zh-TW), 2026-08-13](https://www.alphalab.site/ltx-2-5-multishot-local-video-model). Surfaced but not fetched: [知乎 zhuanlan/p/2071535981560440452](https://zhuanlan.zhihu.com/p/2071535981560440452), [知乎 question/2070892832164991350](https://www.zhihu.com/question/2070892832164991350), [sanwenge.com/post/1351.html](https://www.sanwenge.com/post/1351.html), [nextmodel.cn/knowledges/news/24908](https://www.nextmodel.cn/knowledges/news/24908/), [17you.com](https://www.17you.com/freeresources/ltx-2-5-open-video). Also fetched the ModelScope/CSDN mirror cited in the 08-28 digest as the source of the frame-grid line — that line is now confirmed against primary English sources (item 8 above), so the mirror is no longer load-bearing.

**Findings.**
- **No Chinese prompt vocabulary exists for LTX.** [LORE — scoped to the surfaces above] Every Chinese page found is a translated summary of the English docs, blog post, or benchmark chart. None contains a Chinese prompt example, a Chinese term table (镜头/光线/材质 style), or a ZH-vs-EN comparison. Our baseline's `[SYNTHESIS]` Chinese examples remain synthesis, not sourced practice. **The 08-28 register's "LTX has no Chinese prompt vocabulary at all" holds; it can now be qualified as "no vocabulary, but non-zero Chinese commentary."**
- The AlphaLab piece is the **only Chinese-language source found that does independent verification**, and its two useful contributions are both about official inconsistency, not prompting: the VRAM triangle (16GB product page vs 32GB system requirements) and the ARR-vs-annual-revenues licence wording gap. Both are independently confirmed above from primary sources. Machine-translation risk: none for my use — I read it in the original; its own English quotes are marked as such.
- The Chinese pages repeat the multishot guidance accurately, e.g. "官方[提示詞指南]建議一段以 **2～4 個 shots** 為宜，每次切鏡後仍要重新識別出場主體，並明寫聲音如何延續；若對話必須在固定構圖中準確對嘴，官方反而建議單一 shot" — the last clause (prefer single-shot for precise lip-sync) is the author's inference, **not** in the official guide, which says nothing about lip-sync in the multishot section. Flag as `[LORE]`, not `[OFFICIAL]`.
- **Chinese as a prompt language:** the only official mention is in the Dub-It requirement to "Use native script… Chinese characters for Mandarin", and Chinese is **not** among Dub-It's five validated languages. The model card declares 9 languages. So: Chinese dialogue is supported in principle, unvalidated in the one place LTX documents language behaviour.
- One Chinese-language HF discussion exists and is prompt-relevant only as sentiment: [`discussions/32`](https://huggingface.co/Lightricks/LTX-2.5/discussions/32) "我怎么测试用了一下，感觉咱们这个版本有点负提升呢" (1 reply, opened 20 days before index fetch) and [`discussions/31`](https://huggingface.co/Lightricks/LTX-2.5/discussions/31) "求助LTXVDualCFGGuider" (3 replies). Neither yields vocabulary.

---

### Tested findings

I cannot render video here. Two categories below: **[TESTED]** = static inspection I performed of shipped artifacts (deterministic, re-checkable); **[USER-VERIFIED]** = community reports with enough procedure attached to be actionable.

**[TESTED] Template inspection, `video_ltx2_5_t2v.json` @ `Comfy-Org/workflow_templates` main, 2026-09-03.** Method: fetch raw JSON (103,406 chars / 3,673 lines), read the subgraph node's input-order declaration and `widgets_values`, then grep the whole file. Results: `prompt_enhance = true`; `duration` is a `PrimitiveInt` = `5` seconds, `"fixed"`; resolution 1280×720; `frame_rate` 24; seed `558811532553686`; no duration-head or `model_patches` node anywhere; one hardcoded negative `pc game, console game, video game, cartoon, childish, ugly`; enhancer model slot `gemma4_e2b_it_bf16.safetensors`; upscaler slot `ltx-2.5-latent-spatial-upscaler-x2-bf16-1.0.safetensors`. Node versions in `properties.ver`: comfy-core 0.30.0 for the subgraph, 0.7.0 for the Duration primitive, 0.5.1 for SaveVideo/CreateVideo/LTXVConcatAVLatent.

**[TESTED] Enhancer system prompts are unchanged between the Diffusers vendored snapshot (pinned at LTX-2 commit `ae855f8538843825f9015a419cf4ba5edaf5eec2`) and LTX-2 `main`.** Method: fetched both, compared the T2V text clause-by-clause — identical, including the coffee-shop example. So the 2.5 enhancer prompt has not been revised since at least that commit, and there is no separate multishot enhancer prompt in the repo's `prompts/` directory (the directory listing could not be fetched — `api.github.com/contents` returns empty here — but both named files resolve and `ltx-core/README.md`'s "System Prompts" section lists exactly two).

**[TESTED] `DEFAULT_NEGATIVE_PROMPT` diverges between LTX-2 and Diffusers.** Method: diffed the two constants. Diffusers omits the leading `has_subtitles, has_blurbox, transition from black, transition to black, speech_ending_short, `; the remainder is byte-identical. Diffusers' comment even cites the LTX-2 line range it copied from (`constants.py#L131-L143`), so the truncation looks accidental.

**[USER-VERIFIED] Enhancer ON can produce output unrelated to the prompt.** Two seeds of the same report, from the same author, filed in both trackers: [HF `discussions/36`](https://huggingface.co/Lightricks/LTX-2.5/discussions/36) (opened 2026-08-14 per index, 8 replies) and [Comfy-Org/ComfyUI issue #15600](https://github.com/Comfy-Org/ComfyUI/issues/15600) (opened 2026-08-14, **still open, no labels, no assignee, no maintainer reply** as of 2026-09-03). Setup stated: LTX-2.5 22B distilled, 1280×720, 24 fps, 10 s, conv BF16 video VAE, 2.5 latent spatial upscaler, Gemma 4 12B encoder, `gemma4_e2b_it_bf16.safetensors` enhancer. Result: an aerial-mountain-road-with-red-car prompt rendered as "a close-up cinematic scene of a man and woman standing outdoors"; a cartoon-cat prompt rendered as "a photorealistic person hiking/walking through a forest". Author's conclusion verbatim: "Disabling Prompt Enhancement consistently gives me much better adherence to the original prompt." No seeds published, so n is unknown.
Community diagnoses in the same thread, all `[LORE]`: (a) the enhancer LLM sometimes emits **empty text** and the workflow proceeds with no prompt — "you can check it with the preview text node"; (b) enhanced-prompt **leakage from the previous run's image** — "The T2V sees the last used image file and injects it into the enhanced prompts first sentence… To stop this, I drop a blank image into the I2V 'Load First Frame' node"; (c) one user reports the enhancer emitting **pure token garbage** (a screenshot of `,GEtYVOMUCZNlTDIRLPKBkfXFnmvdJERE…`) after a ComfyUI Desktop update, traced by them to the **wrong enhancer model** being selected. **Actionable teaching rule regardless of cause: wire a Preview Text node to the enhancer output and read it before blaming the prompt.**

**[USER-VERIFIED] Static-camera prompting fails in 2.5 I2V.** [`discussions/54`](https://huggingface.co/Lightricks/LTX-2.5/discussions/54) "Zooming in" (opened 2026-08-18 per index, 5 replies). Reporter: "every single clip is zooming in long or short", and after trying `"tripod locked-off static camera, zero camera movement"`: "from like 50 different testes i have maybe **2 clip where there no zoom in**". The full failing prompt is published (a stylized-3D character behind a kitchen worktop) and opens with `"A static shot of … locked-off camera, zero camera movement."` — i.e. it already follows both the "camera verb first" and "state it as the first descriptor" advice offered in the thread. A second user: "specify in the prompt 'No camera movement' or something like that, doesn't really help". A `CINEMAGRAPH_MOTION` LoRA also did not fix it. **This is the strongest prompt-level regression signal of the sweep: the closed-set `Static` camera LoRA, not prose, is the route to a locked-off shot in 2.5.**

**[USER-VERIFIED] Audio-to-video / singing regressed vs 2.3.** [`discussions/57`](https://huggingface.co/Lightricks/LTX-2.5/discussions/57), "Don't Use LTX 2.5 For Music Videos! Stick To LTX 2.3" (opened 2026-08-19 per index). Author claims "rigorous"/"extensive benchmark tests" but publishes no seeds or workflow; conclusion verbatim: "I absolutely cannot recommend version 2.5 for singing avatars or music-focused workflows… Stick to LTX 2.3 for external audio". Consistent with the official IC-LoRA table, where **Dub-It is 2.3-only** ("LTX-2.5 support in development"). One reply offers a prompt hack — "Try this at the end of your prompt: `Audio: Audio1`" — which I checked against `ltx_pipelines/dubit.py` and found **no such token or parser**; audio reference conditioning is done with VAE latents and RoPE-shifted reference tokens (`patchify_dubit_audio_reference_latent`, `negative_positions=True`), not a prompt string. Grade the hack `[LORE]`, likely folklore; do not teach it.

**[USER-VERIFIED, weak] Full/dev model at 20–50 steps disappoints in the shipped workflows.** [`discussions/20`](https://huggingface.co/Lightricks/LTX-2.5/discussions/20): "I ran till 50 steps and still getting bad outputs"; another at 20 steps multi-shot Ref2Vid on a 3090 — "it just looked cheap and plastic… took me 43 minutes". Best in-thread diagnosis: "The supplied ones are built for distilled with the sigma's and all the stuff" — i.e. the shipped templates hardcode the **distilled sigma schedule** and are not valid for the dev checkpoint. Corroborated officially: `LTXVNormalizingSampler` is "NOT tuned for the full model", and `pipelines.md` routes the full model to `TI2VidTwoStagesPipeline`/`HQ` with a distilled LoRA in stage 2. **Do not teach students to raise steps on a distilled template.**

**[LORE] `enable_prompt_enhancement` on the Diffusers modular path.** [`LTX-2.5-Diffusers/discussions/14`](https://huggingface.co/Lightricks/LTX-2.5-Diffusers/discussions/14) — **this PR is not about the enhancer default at all** (see Contradicts §1). It does publish a working modular recipe worth keeping: components `prompt_enhancer` and `processor` are loaded from `google/gemma-4-E2B-it` rather than bundled; the call passes `negative_prompt=DEFAULT_NEGATIVE_PROMPT`, `num_frames=None,  # Set to an int (e.g. 121) to specify a fixed video length`, `use_cross_timestep=True`, `enable_prompt_enhancement=True`, `cm.enable_auto_cpu_offload(device="cuda", memory_reserve_margin="20GB")`, `LTX2VideoVaeNeighborhoodNattenProcessor` + `enable_tiling()`. **`num_frames=None` is the Diffusers spelling of Auto Duration** — so the Diffusers path does expose it, unlike the ComfyUI template.

**[SPECULATION] NAG as the negative-prompt substitute.** NAG is now a **ComfyUI built-in**, `NAGuidance` ([docs.comfy.org](https://docs.comfy.org/built-in-nodes/NAGuidance)), documented verbatim as: "enables the use of negative prompts with distilled or schnell models by modifying the model's attention mechanism during the sampling process". Params: `nag_scale` 0–50 (default **5.0**), `nag_alpha` 0–1 (default **0.5**, "1.0 fully replaces the original attention"), `nag_tau` 1–10 (default **1.5**). Paper: [arXiv 2505.21179](https://arxiv.org/pdf/2505.21179). Upstream node pack: [ChenDarYen/ComfyUI-NAG](https://github.com/ChenDarYen/ComfyUI-NAG).
**Why it is in scope for LTX-2.5:** the shipped 2.5 template runs the distilled transformer with a **dual-CFG guider at CFG 1 for both video and audio** ([`text-to-video.md`](https://docs.ltx.io/open-source-model/usage-guides/text-to-video.md), verbatim: "sampled together with the `euler_ancestral` sampler and a dual-CFG guider (CFG 1 for both video and audio) on a fixed distilled sigma schedule"), and `pytorch-api.md` lists distilled CFG as **1.0**. At CFG 1 a negative prompt has no CFG branch to act on — which makes the template's hardcoded `pc game, console game, …` negative **inert on the distilled path** unless something like NAG is inserted. `[SPECULATION]` on inertness (not stated by any source and not testable here); `[OFFICIAL]` that distilled CFG is 1.0 and that the template hardcodes both.
**Status caveat, do not skip:** an open ComfyUI issue reports the built-in node not working — [Comfy-Org/ComfyUI issue #12707, "Native NAG node (Normalized Attention Guidance) not applying negative prompt despite double inference time"](https://github.com/Comfy-Org/ComfyUI/issues/12707) (surfaced in search; the issue body could not be read — `api.github.com` returns empty here and I did not spend a fetch on the HTML). **No LTX-specific NAG evidence of any kind was found** — no LTX+NAG workflow, no LTX mention in the NAG repo README, nothing on `docs.ltx.io`. This is the sweep's clearest candidate for an in-house test (see Validator changes).

---

### Contradicts current corpus

Line numbers refer to this file as of 2026-09-03, before this section was appended.

1. **The 08-28 digest's "Next-run target" is wrong about `discussions/14`.** The digest says `Lightricks/LTX-2.5-Diffusers/discussions/14` is "on the Prompt Enhancer". It is a **merged Diffusers PR by `dg845` titled "Add Prompt Enhancer and Processor Modular Reference"** — a `modular_model_index.json` change that lets the modular pipeline pull `prompt_enhancer` and `processor` from `google/gemma-4-E2B-it` instead of vendoring weights. No discussion of defaults, and `dg845` is an HF/Diffusers contributor, not Lightricks. `art-alex` (LTX.io org) appears only to merge it. **The thread that actually discusses the enhancer's behaviour is `Lightricks/LTX-2.5/discussions/36`** (note: same repo has an unrelated `discussions/14`, "still 2.5 character consistency not perfect" — the digest may have crossed the two repos' numbering). Correct the next-run target.

2. **Line 48, "No model-specific negative vocabulary is documented in the primary 2.3 materials reviewed. Report as nothing reliable found."** — Falsified for 2.5, and probably for 2.3 too (the constant lives in the shared `ltx-pipelines` package). **Three** official negatives exist: the ~90-item `DEFAULT_NEGATIVE_PROMPT` in `ltx_pipelines/utils/constants.py`; a copy in Diffusers **missing its first five items**; and a six-token aesthetic negative hardcoded in the official ComfyUI 2.5 template. Keep all three, say they disagree. Also revise line 50 (`[SYNTHESIS]` "use negatives sparingly for duplicates, morphing, subtitles, unwanted score") — it is directionally right and `has_subtitles` / `speech_ending_short` in the official list vindicate the "subtitles" and "unwanted score" instincts, but it should now cite the official list rather than stand as synthesis.

3. **Lines 8, 14, 41, 84 — the ≤150-word ceiling and the 512-token note both descend from a dead file.** `prompt_enhancer_utils.py` / `prompt_enhancer_nodes.py` in ComfyUI-LTXVideo are the **LTXV-0.9-era** enhancer (Llama-3.2-3B-Instruct + Florence-2-large-PromptGen-v2.0, `max_resulting_tokens` default 256 / max 512). The 2.5 enhancer is Gemma 4 E2B driven by the two `ltx-core` Gemma system prompts, which contain **no length instruction of any kind**. Line 41's "Enhancer ceiling: 150 words" and line 84's "Confusing the node's 512-token allowance with the official 150-word recommendation" are both about a component 2.5 does not use.

4. **Line 42's resolution of the 150-vs-200 conflict is now a three-way conflict, and the current authority is neither number.** Current guidance is **"roughly 4–8 descriptive sentences"** with explicit permission for longer screenplay-style scenes (docs.ltx.io, both prompting-guide URLs). The 200-word figure survives only in the LTX-2 GitHub README; the 150 figure only in the dead enhancer file. Replace the "150 hard / 151–200 soft" band for 2.5 targets with a sentence-count band, and keep the word band only for 2.3.

5. **Line 20's "no timestamps/cuts" and line 30's "start with action, not an establishing adjective pile" need a multishot exception and a slugline exception.** Cuts are now first-class **when named in prose**; the enhancer still refuses to invent them. And two of the three official 2.5 sample prompts use screenplay sluglines and `Reporter: "…"` character cues, so "one flowing paragraph" is the **single-shot** rule, not a universal one.

6. **Line 36 and line 97 recommend `Pose Control` and `Motion Track Control` by those names.** For 2.5, **pose is inside Union Control** (depth + canny + pose, one checkpoint); the standalone `ltx-2-19b-ic-lora-pose-control` is an LTX-2.0 file absent from the "All LTX-2.5 IC-LoRAs" table. "Motion Track Control" is now documented as **Motion Control** with two nodes (**LTX Draw Tracks**, **LTX Sparse Track Editor**) and a 3–4-keypoints-per-track recommendation. Also line 36's `Union Control` gloss should note it is now the **pose** route, not just depth+canny.

7. **Line 37's "IC-LoRA … the prompt should still describe the intended movement" is right but incomplete.** Official guidance adds three prose rules our corpus lacks: describe **style, not control type**; **prepend the trigger phrase** for adapters that have one (`DEBLUR`, `REMOVEBEARD`, `COLORIZE`, `ADD WATER`, `ENHANCE QUALITY`); and never **contradict the reference's structure**. Plus IC-LoRA strength is no longer fixed at 1.0.

8. **Line 3's pointer "see `new-models.md`" undersells the divergence.** `new-models.md:9` says "use enhancer for terse prompts and **disable it to preserve exact wording**", which is correct advice, but the file does not say the official ComfyUI template ships it **on**. That is the single highest-value teaching correction in this sweep.

9. **The 08-28 digest's LTX tension (a) resolves to "docs bug", with a named false claim.** `docs.ltx.io/…/pytorch-api.md` asserts the spatial upscaler is "still hosted on the LTX-2.3 repo"; the LTX-2.5 HF repo ships `latent_upscale_models/ltx-2.5-latent-spatial-upscaler-x2-bf16-1.0.safetensors`, the LTX-2 README uses it, and the ComfyUI template's `upscale_model` widget names it. Two `docs.ltx.io` pages are stale; the same two pages are the only ones documenting `--duration-head-path`, so they are partially updated, not abandoned. `text-to-video.md` is stale in a second way: it states template defaults of 768×512 / 97 frames, versus the shipped 1280×720 / 5 s.

10. **The 08-28 digest's tension (b) resolves against the 12 GB figure.** Official **32GB+ minimum** on `system-requirements.md` and in the ComfyUI-LTXVideo README; 12 GB appears only on the marketing `llm-info` page, 16 GB only on the product comparison table. Three official numbers for one model. Also correct the mechanism: **int8/fp8 + CPU/disk offload + block streaming + tiled VAE decode**, not GGUF — no official GGUF path exists.

11. **The 08-28 digest's tension (c) needs restating.** It says the enhancer "was default-on until 08-20". I found **no source dating any default change**, and the template on `main` is default-**on** as of 2026-09-03. Restate as: default-on is current for the official ComfyUI T2V template; `llm-info` still never mentions it; Comfy Org's own tutorial says the opposite of the file it ships.

12. **New contradiction, not in the digest: the free API text-encode node was silently wrong for 2.5.** `docs.ltx.io` documents `GemmaAPITextEncode` as a drop-in VRAM saver with no version caveat; `art-alex` (LTX.io org) states the new encoder "is not supported there yet". Anyone benchmarking 2.5 through that node encoded with the wrong encoder.

---

### Few-shot gold (new pairs)

### Pair 5 — dialogue/audio, LTX-2.5 single shot [SYNTHESIS]
INTENT: Two colleagues exchange one line in a rain-lit stairwell; locked framing, ambience carries the beat.
PROMPT-EN:
Style: cinematic-realistic. A woman in her late twenties, dark hair pulled back, wearing a grey wool coat, stops on a concrete stairwell landing and turns her head toward the door above her as rain drums on the skylight. A static medium shot holds her at frame left; a caged bulb throws soft overhead light across the wet steps. She lifts a set of keys, then lowers them again as a second woman in a navy raincoat climbs into frame behind her, breathing hard. The first woman speaks quietly, in a low, careful voice, "You said you locked it." The second answers, flatly, "I did." A beat of silence. Rain on the skylight continues throughout, the keys chime once against each other, footsteps scuff on grit, and a fluorescent ballast hums faintly above them; no music.
NOTES: Written to the current 2.5 rules, not the old 150-word cap: 8 sentences, `Style:` prefix as the enhancer's own guideline specifies, present tense, one camera treatment stated once and held ("A static shot holds…"), emotion carried by physical cues, dialogue quoted with a named speaker and a delivery adjective, and **"A beat of silence."** written in as an action so Auto Duration allocates time for it rather than compressing it. Every sound has a named source. `no music` is explicit. Safe with the enhancer either on or off — it is already detailed and chronological, so the T2V system prompt's "DO NOT make major edits" clause should apply.

### Pair 6 — Native Multishot, three shots, one generation [SYNTHESIS]
INTENT: Establish → detail → reaction across two named cuts, with declared audio continuity and re-identified subjects.
PROMPT-EN:
Style: cinematic-realistic. Initially, a wide shot frames a long workbench in a dim instrument-repair shop at dusk, brass shavings scattered across the wood, a single desk lamp pooling warm light at the centre. A grey-bearded man in a leather apron leans over a disassembled trumpet, turning a valve slowly between finger and thumb; low street traffic and the faint hiss of a radiator fill the room. The view cuts to a close-up of his hands, the same leather apron visible at the edge of frame, as he seats the valve and it clicks home; the traffic drops away and only the radiator hiss and a soft metallic click remain. A moment later, a hard cut transitions to a medium shot of the grey-bearded man from the front, the desk lamp now behind his shoulder, as he raises the trumpet, blows one short test note, and lets a slow smile spread. He says, warmly, "There you are." The radiator hiss continues across the cut, the single trumpet note rings and decays, and the street traffic fades back up underneath; no music.
NOTES: Built strictly to the official multishot checklist. Three shots (the documented 2–4 band), each with a clear job (establish → detail → reaction) and its own framing stated once. Both cuts are **named in prose** — "The view cuts to a close-up of…" and "A hard cut transitions to…" — using the exact phrasings the guide lists, so the enhancer's "no cuts unless explicitly requested" rule is satisfied rather than fought. Subjects are **re-identified** at each reappearance ("the same leather apron", "the grey-bearded man"), and **audio continuity is declared at every cut** ("the traffic drops away and only…", "The radiator hiss continues across the cut"). Chronological connectives are the documented ones: "Initially…", "A moment later…". No costume or geography change. **Do not reformat this as a numbered shot list or bare sluglines** — the guide explicitly forbids that unless the cut is also named in prose.

### Pair 7 — Dub-It speech replacement, official slot format [OFFICIAL template, SYNTHESIS content]
INTENT: Replace an English line in an existing clip with Spanish, single speaker, matched timing.
PROMPT-EN:
A woman speaking in Spanish with a Madrid accent, saying: "No pienso firmar nada hasta que lo lea entero."
NOTES: This is the one LTX prompt form that is **not** a flowing paragraph — it is the documented slot template `[Speaker] is speaking [Language/Accent], saying: "[Dialogue]"`. Rules that make or break it, all official: supply the **full target-language text** (Dub-It does not translate), write it in **native script**, keep **one speaker only** (the beta adapter cannot separate speakers), and match the **syllable count and timing** of the original line — too long and words get skipped, too short and delivery drags. Emotion/delivery adjectives may be appended. Requires the Dub-It IC-LoRA, which is **LTX-2.3-only** as of 2026-09-03 ("LTX-2.5 support in development"), so route Dub-It intents to a 2.3 checkpoint, not 2.5. Spanish is on the validated list (English, French, Spanish, German, Russian); **Chinese is not**, despite the native-script instruction naming Mandarin.

---

### Validator changes

**Which 2.3 rules still hold for LTX-2.5, mechanically.**

| # | Existing rule (line) | 2.5 status | Action |
|---|---|---|---|
| V1 | "Require an action/change verb in the first sentence" (93) | **Holds, strengthened.** Guide: "Give each sentence a verb that does something — *walks, turns, exhales, reaches*". | Extend from first sentence to a per-sentence check: warn if a sentence has no finite verb. |
| V2 | "For audio-enabled generation require at least one of dialogue, ambience, effect, music, or `no music/no dialogue`" (94) | **Holds.** Six official prompt elements still end with "Describe the Audio". | Keep unchanged. In multishot mode, require an audio statement **per cut**, not just once. |
| V3 | "Warn if dialogue lacks quotation marks or an attributed speaker" (95) | **Holds, now [OFFICIAL].** Guide: "Place spoken dialogue in **quotation marks**"; enhancer: "ALWAYS include exact words in quotes with voice characteristics". | Keep; upgrade the evidence label. Add: warn if quoted dialogue has no delivery/voice descriptor. |
| V4 | "Warn on adjective/tag fragments with no finite verb; official dialect is one flowing paragraph" (96) | **Holds for the fragment half; the paragraph half must be scoped.** Two of three official 2.5 samples use sluglines + `Character:` cues. | Keep the fragment warning (it now also catches the guide's "tag syntax… tend to underperform"). **Scope the paragraph rule to single-shot mode**; allow slugline/character-cue form in the dialogue/screenplay mode. |
| V5 | "Do not require Chinese or negatives" (96) | **Half wrong now.** Negatives are officially documented for 2.5. | Change to: never *require* a negative, but **offer the official default**, and warn that three different official negatives exist. Chinese half unchanged. |
| V6 | "Target 40–150 English words; hard warning over 150 when official enhancer mode is selected" (91) | **Must change for 2.5.** No word cap exists in current guidance or in the enhancer prompt; 150 traces to a dead component. | **2.3 targets:** keep 40–150 / soft 151–200. **2.5 targets:** replace with a **sentence-count** rule — target **4–8 sentences** for a single shot, allow up to ~16 for multishot or screenplay form, warn only when sentences carry no concrete visual/audio detail. |
| V7 | "If intent contains exact pose/path language and no control input is active, warn and recommend Pose Control or Motion Track Control" (97) | **Rename required.** | For 2.5: recommend **Union Control** for pose/depth/canny and **Motion Control** (LTX Draw Tracks / LTX Sparse Track Editor) for trajectories. Keep the "do not merely inflate the prompt" behaviour. |
| V8 | "Warn above one main action per 2–3 seconds of requested duration" (98) | **Holds, but the failure mode inverted.** With Auto Duration the model sizes the clip to the described action, so a dense prompt now yields a *longer* clip rather than a rushed one — provided the duration head is loaded. In ComfyUI it is **not** loaded, so the 2.3 crowding warning still applies exactly. | Make it conditional on target: keep the warning when duration is fixed (all ComfyUI 2.5 work, and any `--num-frames` run); soften it to informational when the duration head is active. |

**New validator rules for 2.5.**
- **V9 — enhancer state must be declared.** If the target is LTX-2.5 + ComfyUI, surface: "the official T2V template ships `prompt_enhance = true`; your prompt will be rewritten unless you toggle it off." `[OFFICIAL/TESTED]`
- **V10 — frame grid and dimensions.** Warn unless `num_frames % 8 == 1` and `width % 32 == 0 && height % 32 == 0`. Note that Dub-It/Retake **silently snap** frames to the nearest `8k+1` rather than erroring. `[OFFICIAL]`
- **V11 — named cuts are required for multishot, and forbidden otherwise.** If the prompt implies more than one shot (multiple framings, "then we see", "meanwhile"), require a **named transition** from the official set (hard cut / match cut / dissolve / "the view cuts to") plus a re-identified subject and an audio-continuity clause at each cut. Conversely, if the user asked for a single continuous take, warn on any cut language — the enhancer will preserve it. Warn above **4 shots**. `[OFFICIAL]`
- **V12 — static camera cannot be prompted reliably in 2.5.** If intent contains "static", "locked-off", "tripod", "no camera movement", emit a warning: prose is reported to fail in 2.5 I2V (~2/50 successes, `discussions/54`); route to the `Static` camera-control LoRA. `[USER-VERIFIED]`
- **V13 — IC-LoRA prose hygiene.** When an IC-LoRA target is active: forbid naming the control type in the prompt ("depth map shows…"); require the **trigger phrase first** for adapters that use one; warn on prose that contradicts the reference. `[OFFICIAL]`
- **V14 — Dub-It slot form.** Recognise the `[Speaker] is speaking [Language/Accent], saying: "[Dialogue]"` template and validate it separately: one speaker, native script, full target text, syllable-length parity. Route Dub-It intents to **2.3**, not 2.5. `[OFFICIAL]`
- **V15 — do not raise steps on a distilled template.** If the target is the shipped 2.5 template and the user asks for more steps or the dev checkpoint, warn that the template hardcodes the distilled sigma schedule. `[OFFICIAL + USER-VERIFIED]`
- **V16 — I2V: describe change, not the frame.** Upgrade our existing advice to `[OFFICIAL]` and give it the mechanism: "Inaccurate descriptions may cause scene cuts" (I2V system prompt).

**Test the maintainer should run (hand to agent 2B).** Fixed seed, LTX-2.5 distilled, official T2V template, one prompt containing an obvious negative-prompt target (e.g. a request that tends to produce subtitles), three arms: (i) template as shipped (CFG 1, negative present); (ii) negative field emptied; (iii) `NAGuidance` inserted (`nag_scale` 5.0, `nag_alpha` 0.5, `nag_tau` 1.5) with the official `DEFAULT_NEGATIVE_PROMPT`. If (i) and (ii) are pixel-identical, the template's negative is inert at CFG 1 and NAG is the only negative path on the distilled model — which would settle a question our corpus has carried for three sweeps across LTX, Z-Image Turbo and Krea 2. Run every arm with `prompt_enhance` **off**, and separately capture the enhancer's output text via a Preview Text node.

---

### Nothing-found register

Every brief item gets a line so nobody re-hunts it. Absences are scoped to the surfaces named.

- **`Lightricks/LTX-2.5-Diffusers/discussions/14` as an enhancer-default thread — does not exist.** The PR is a modular-loading change. Not found on that repo's discussion tab: any thread about the enhancer default. The Diffusers repo has only **9** community items total.
- **`[STAFF]` yield: one claim.** Walked the `Lightricks/LTX-2.5` discussions index (63 items, 45 shown open + 18 closed) and read #14(diffusers), #20, #34, #36, #48, #54, #57 in full. Only **`art-alex`** carries an org badge and only in #34. **No Lightricks staff reply was found on the enhancer threads (#36), the static-camera thread (#54), the A2V regression (#57), or the settings thread (#20).** The 18 closed discussions were **not** read (index link only) — a plausible place for more staff answers, and the cheapest next-run target.
- **Lightricks GitHub issues: not enumerated.** `api.github.com` returns empty bodies here for `/issues`, `/contents` and `/search/issues`, and I chose not to spend the remaining budget paging HTML issue lists for `Lightricks/LTX-2` and `Lightricks/ComfyUI-LTXVideo`. **No `[STAFF]` claim was harvested from either repo's issue tracker this run.** Hand to agent 2A with the note that HTML issue pages do fetch (proved on `Comfy-Org/ComfyUI/issues/15600`).
- **Enhancer default-change date (the 08-11 → 08-20 window): not found.** Searched `docs.ltx.io` (`/llms.txt` index and every open-source-model page fetched), `ltx.io/llm-info`, `ltx.io/model/license`, the LTX-2 README, the ComfyUI-LTXVideo README, and `blog.comfy.org`'s LTX-2.5 post. No changelog entry, release note, or commit message dating a change of the enhancer default. `ltx.io/release-notes` and `docs.ltx.io/api-changelog/llms.txt` were **not** fetched — next-run targets.
- **A dedicated multishot enhancer system prompt: not found.** `ltx-core/README.md` lists exactly two system prompts (T2V, I2V); both are in this file's Sources; neither mentions multishot. The `prompts/` directory could not be listed (API empty).
- **A 20-second clamp in the local pipelines: not found.** 20 s is documented only for the hosted API/product (`llm-info`, Comfy blog partner-node envelopes). No `max_frames`/duration ceiling was found in `pipelines.md`, `installation.md`, `pytorch-api.md` or the LTX-2 README.
- **"Does over-describing lengthen the clip?" — no direct source.** The docs state the direction (the predictor "sizes the clip to the action you describe… it won't stretch a moment") but never quantify, never state a max the head can predict, and never say what happens to a 20-sentence prompt. Not found on `docs.ltx.io`, the LTX-2 README, `pipelines.md`, or the Comfy blog. Needs a `[TESTED]` answer: same content at 3 / 8 / 16 sentences with the duration head loaded and `--num-frames` omitted, record predicted frames.
- **Auto Duration in ComfyUI: absent from the shipped template**, confirmed by grep (see Tested findings). Not found: any ComfyUI node that loads `ltx-2.5-duration-head-bf16.safetensors`, in the template, the docs.comfy.org tutorial, or the ComfyUI-LTXVideo node reference.
- **GGUF for LTX-2.5: no official path.** Not found on the HF model card snippets, LTX-2 README, `docs.ltx.io`, or docs.comfy.org. Community request open at `discussions/18` with no reply. Whatever is behind the "12 GB" claim, it is not GGUF.
- **Chinese prompt vocabulary for LTX: none.** See Chinese sources for the exact queries and page list. Zero Chinese prompt examples, zero term tables, zero ZH-vs-EN comparisons on any page reached.
- **LTX + NAG: nothing.** No LTX-specific NAG workflow, benchmark, or mention found on docs.comfy.org, the NAG repo README (via search snippets), `docs.ltx.io`, or the LTX HF discussions. The `NAGuidance` built-in exists and is documented generically; ComfyUI issue #12707 questions whether it works at all. **Do not teach NAG for LTX yet** — teach it as an untested hypothesis with a named test.
- **`Audio: Audio1` prompt suffix: unsupported.** Checked `dubit.py` in full; no such token, parser, or prompt-side audio-selection syntax. `[LORE]`, likely folklore.
- **Reddit: structurally unreachable** (standing rule). The AlphaLab article cites two Reddit threads (an RTX 3060 field report, ~180 s for a 0.5MP 10 s clip with the enhancer off, +~30 s with it on; and the launch thread) — **cited via AlphaLab, not verified at source.** `[LORE]`, second-hand.
- **civitai.red: not attempted** (invisible to fetches, standing rule). One HF commenter mentions testing 2.5 "on Civitai with its 'full' capacity" — hearsay, no settings.
- **Discord (`discord.gg/ltxplatform`): not attempted.** Requires auth; the official "Getting Help" route and therefore a likely home for staff prompting answers that will never be citable here. Record as permanently out of reach for this corpus.
- **`arxiv 2601.03233`: not fetched.** It is the **LTX-2 (January 2026)** technical report; per AlphaLab and my own reading of the model card it contains **no 2.5-specific multishot or duration-head detail**, so it is unlikely to yield prompt semantics. Low-priority next-run item.
- **A 2.5-specific rewrite of the ComfyUI-LTXVideo README: does not exist.** That README is still 2.3-centric (2.3 checkpoints, 2.3 upscalers, stock Gemma 3 download instructions, LTX-2.0-era camera and pose LoRAs) even though `example_workflows/2.5/` exists and docs.ltx.io links into it. Its only 2.5-current facts are the 32GB prerequisite and the low-VRAM loader note.

---

### Sources

Official — Lightricks / LTX (all accessed 2026-09-03):
- [LTX-2 GitHub README](https://raw.githubusercontent.com/Lightricks/LTX-2/main/README.md) — [OFFICIAL]. Model list, 66 GiB quick start, encoder version gate, duration head, "Keep within 200 words".
- [`ltx_pipelines/utils/constants.py`](https://raw.githubusercontent.com/Lightricks/LTX-2/main/packages/ltx-pipelines/src/ltx_pipelines/utils/constants.py) — [OFFICIAL]. `DEFAULT_NEGATIVE_PROMPT`, distilled sigmas, per-generation guider params.
- [`gemma_t2v_system_prompt.txt`](https://raw.githubusercontent.com/Lightricks/LTX-2/main/packages/ltx-core/src/ltx_core/text_encoders/gemma/encoders/prompts/gemma_t2v_system_prompt.txt) and [`gemma_i2v_system_prompt.txt`](https://raw.githubusercontent.com/Lightricks/LTX-2/main/packages/ltx-core/src/ltx_core/text_encoders/gemma/encoders/prompts/gemma_i2v_system_prompt.txt) — [OFFICIAL]. Current enhancer system prompts.
- [`ltx-core/README.md`](https://raw.githubusercontent.com/Lightricks/LTX-2/main/packages/ltx-core/README.md) — [OFFICIAL]. `(F-1) % 8 == 0`, H/32 W/32, 14B+5B streams, 48 blocks, dual context dims, block streaming.
- [`ltx-pipelines/docs/pipelines.md`](https://raw.githubusercontent.com/Lightricks/LTX-2/main/packages/ltx-pipelines/docs/pipelines.md) — [OFFICIAL]. 12 pipelines, Retake 8k+1 constraint, Dub-It silent frame snapping.
- [`ltx-pipelines/docs/installation.md`](https://raw.githubusercontent.com/Lightricks/LTX-2/main/packages/ltx-pipelines/docs/installation.md) — [OFFICIAL]. `--enhance-prompt` as opt-in flag; common CLI flags.
- [`ltx_pipelines/dubit.py`](https://raw.githubusercontent.com/Lightricks/LTX-2/main/packages/ltx-pipelines/src/ltx_pipelines/dubit.py) — [OFFICIAL]. `enhance_prompt: bool = False`; audio reference conditioning is latent-based, no `Audio:` token.
- [`LICENSE` — LTX-2.x Community License Agreement](https://raw.githubusercontent.com/Lightricks/LTX-2/main/LICENSE) — [OFFICIAL], license date 2026-08-11. §2.1 $10,000,000 annual revenues; §2.2 Non-Commercial Purpose; Attachment A #5/#18/#19/#20.
- [Prompting Guide (open-source path)](https://docs.ltx.io/open-source-model/usage-guides/prompting-guide.md) and [(API path)](https://docs.ltx.io/api-documentation/implementation-guides/prompting-guide.md) — [OFFICIAL]. 4–8 sentences, Multi-Shot section, Auto-Duration pacing, enhancer, Dub-It template, sample prompts, term lists.
- [Open-source overview](https://docs.ltx.io/open-source-model/getting-started/overview.md) — [OFFICIAL]. "New in 2.5" list including Native multishot and Auto duration.
- [Quick Start](https://docs.ltx.io/open-source-model/getting-started/quick-start.md) — [OFFICIAL]. Split pack, `--duration-head-path`, **stale 2.3 upscaler**.
- [System Requirements](https://docs.ltx.io/open-source-model/getting-started/system-requirements.md) — [OFFICIAL]. **32GB+ VRAM minimum**, CUDA 12.7+, Python 3.12+.
- [PyTorch API](https://docs.ltx.io/open-source-model/integration-tools/pytorch-api.md) — [OFFICIAL]. `8n + 1` / ÷32 verbatim, duration-head omission rule, frame/duration table, sampling table, fp8/offload, **"still hosted on the LTX-2.3 repo"** (false).
- [Text-to-Video guide](https://docs.ltx.io/open-source-model/usage-guides/text-to-video.md) — [OFFICIAL]. "The template turns on Prompt Enhance by default"; template negative prompt; two-stage description; stale 768×512/97-frame defaults.
- [LTX ComfyUI Nodes reference](https://docs.ltx.io/open-source-model/integration-tools/ltx-comfy-ui-nodes.md) — [OFFICIAL]. GemmaAPITextEncode, MultimodalGuider, IC-LoRA Guide Advanced, NormalizingSampler caveats, tiled VAE decode.
- [IC-LoRA Adapters](https://docs.ltx.io/open-source-model/integration-tools/ic-lo-ra-adapters.md) — [OFFICIAL]. 2.5 roster; pose inside Union Control; Ingredients two-part prompt; 2.3-only flags for HDR/Dub-It/Relight.
- [IC-LoRA guide](https://docs.ltx.io/open-source-model/usage-guides/ic-lo-ra.md) — [OFFICIAL]. Prompt-alignment rules, trigger phrases, `attention_strength`/`attention_mask`, sparse-track best practices, 704x1216 @24–30fps.
- [`ltx.io/llm-info`](https://ltx.io/llm-info) — [OFFICIAL] spec content / marketing claims, "Last updated: August 2026". Launch 2026-08-11, 20 s, 24 kHz stereo, camera-LoRA closed set, **12GB claim**, $10M ARR wording.
- [`ltx.io/model/license`](https://ltx.io/model/license) — [OFFICIAL] marketing. "under $10M in annual revenue"; links to the real LICENSE.
- [`Lightricks/LTX-2.5` model card + discussions index](https://huggingface.co/Lightricks/LTX-2.5/discussions) — [OFFICIAL]. Gated; `License: ltx-2.x-community-license-agreement`; split-pack CLI snippets; DFR detailing-LoRA "strength is fixed at 0.5".
- [`Lightricks/LTX-2.5/discussions/34`](https://huggingface.co/Lightricks/LTX-2.5/discussions/34) — **[STAFF]** `art-alex`, badged "LTX.io org", anchor `#6a7eab28198a731624f3cdce`. Encoder substitution; API encode node lacks 2.5 support.
- [`Lightricks/LTX-2.5-Diffusers/discussions/14`](https://huggingface.co/Lightricks/LTX-2.5-Diffusers/discussions/14) — [OFFICIAL/MAINTAINER] (Diffusers contributor `dg845`; merged by `art-alex`). Modular recipe, `num_frames=None`, `enable_prompt_enhancement=True`.
- [`Lightricks/LTX-2.5/discussions/36`](https://huggingface.co/Lightricks/LTX-2.5/discussions/36), [`/20`](https://huggingface.co/Lightricks/LTX-2.5/discussions/20), [`/48`](https://huggingface.co/Lightricks/LTX-2.5/discussions/48), [`/54`](https://huggingface.co/Lightricks/LTX-2.5/discussions/54), [`/57`](https://huggingface.co/Lightricks/LTX-2.5/discussions/57) — [USER-VERIFIED]/[LORE]. Enhancer failures, full-model settings, static-camera failure, A2V regression.
- [ComfyUI-LTXVideo README](https://raw.githubusercontent.com/Lightricks/ComfyUI-LTXVideo/master/README.md) — [OFFICIAL], **2.3-centric and stale**. 32GB+ prerequisite; LTX-2.0-era camera/pose LoRA filenames.
- [`prompt_enhancer_nodes.py`](https://raw.githubusercontent.com/Lightricks/ComfyUI-LTXVideo/master/prompt_enhancer_nodes.py) — [OFFICIAL], **legacy LTXV-0.9 enhancer**. Llama-3.2-3B + Florence-2, 256/512 tokens. Not the 2.5 path.

Official — Comfy Org (accessed 2026-09-03):
- [`video_ltx2_5_t2v.json`](https://raw.githubusercontent.com/Comfy-Org/workflow_templates/main/templates/video_ltx2_5_t2v.json) — [OFFICIAL/MAINTAINER] + [TESTED] inspection. `prompt_enhance = true`; `duration` PrimitiveInt 5 "fixed"; 1280×720; hardcoded negative; 2.5 upscaler; no duration head.
- [docs.comfy.org LTX-2.5 tutorial](https://docs.comfy.org/tutorials/video/ltx/ltx-2-5) — [OFFICIAL/MAINTAINER]. Gated-repo callout; int8-convrot file set; **"The workflow keeps it off by default" (contradicted by the shipped template)**; per-mode prompting tips.
- [blog.comfy.org — "LTX-2.5 Day-0 Support in ComfyUI"](https://blog.comfy.org/p/ltx-25-day-0-support-in-comfyui) — [OFFICIAL/MAINTAINER], Rob, 2026-08-12. "small **experimental** duration head model"; DFR explanation; ComfyUI 0.32.0; Fast/Pro envelopes.
- [docs.comfy.org NAGuidance](https://docs.comfy.org/built-in-nodes/NAGuidance) — [OFFICIAL/MAINTAINER]. Built-in NAG params and purpose.
- [Comfy-Org/ComfyUI issue #15600](https://github.com/Comfy-Org/ComfyUI/issues/15600) — [USER-VERIFIED]. Opened 2026-08-14 by `cinetube`, **open, unlabelled, unanswered** at 2026-09-03.
- [Comfy-Org/ComfyUI issue #12707](https://github.com/Comfy-Org/ComfyUI/issues/12707) — [LORE], title only (body not read). Native NAG node reportedly not applying the negative prompt.

Third-party:
- [`diffusers/pipelines/ltx2/utils.py`](https://raw.githubusercontent.com/huggingface/diffusers/main/src/diffusers/pipelines/ltx2/utils.py) — [OFFICIAL/MAINTAINER] (HF). Verbatim copies of both Gemma system prompts; **truncated** `DEFAULT_NEGATIVE_PROMPT`; cites LTX-2 commit `ae855f8538843825f9015a419cf4ba5edaf5eec2`.
- [AlphaLab — LTX-2.5 原生多鏡頭影片模型 (zh-TW)](https://www.alphalab.site/ltx-2-5-multishot-local-video-model) — [LORE], Terry Chen, 2026-08-13. Independent verification of the VRAM triangle and the ARR-vs-annual-revenues gap; checkpoint byte sizes; Reddit reports cited second-hand.
- [Normalized Attention Guidance (arXiv 2505.21179)](https://arxiv.org/pdf/2505.21179) and [ChenDarYen/ComfyUI-NAG](https://github.com/ChenDarYen/ComfyUI-NAG) — [OFFICIAL/PAPER] / [LORE], via search snippets only, no LTX content.
- Chinese pages surfaced but not fetched (listed for the next sweep, all derivative): [知乎 zhuanlan/p/2071535981560440452](https://zhuanlan.zhihu.com/p/2071535981560440452), [知乎 question/2070892832164991350](https://www.zhihu.com/question/2070892832164991350), [sanwenge.com/post/1351.html](https://www.sanwenge.com/post/1351.html), [nextmodel.cn/knowledges/news/24908](https://www.nextmodel.cn/knowledges/news/24908/), [17you.com LTX-2.5](https://www.17you.com/freeresources/ltx-2-5-open-video).
