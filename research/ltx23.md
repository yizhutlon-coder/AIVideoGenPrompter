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
