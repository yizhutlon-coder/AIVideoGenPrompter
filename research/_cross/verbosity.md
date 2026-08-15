# Verbosity calibration

Baseline: 2026-08-15.

## Sweet spots

| Model/variant | Evidence-backed target | Quality |
|---|---|---|
| Wan T2V extender | 60–200 Chinese characters | [OFFICIAL] |
| Wan I2V | ≤100 words; dynamic content only | [OFFICIAL] |
| LTX 2.3 enhancer | ≤150 words, one paragraph | [OFFICIAL] |
| MiniMax H3 base | No cap published; complete structured timeline | [OFFICIAL structure] |
| MiniMax H3 Ref2VA | 350–500 English words for generation | [OFFICIAL] |
| SCAIL replacement | 90–140 English words | [OFFICIAL] |
| FLUX.2 | 30–80 ideal; 10–30 exploration; 80+ complex | [OFFICIAL] |
| SDXL/Juggernaut | About ≤75 CLIP tokens for Juggernaut | [CREATOR] |
| Z-Image Turbo | Long/detailed; 512-token default, optional 1024 | [STAFF/OFFICIAL] |
| Qwen-Image-2512 | Ideally about 200 words, concise | [OFFICIAL rewriter] |

## Load-bearing hierarchy

1. Exact subject/count/identity.
2. Observable action or pose and spatial relationship.
3. Composition/camera and crop.
4. Environment and object interactions.
5. Light direction/quality/color.
6. Medium/style and material texture.
7. Audio/dialogue for native AV models.
8. Only then atmosphere and secondary detail.

Delete first: repeated quality words, awards, emotional interpretation, style synonyms, “cinematic” repeated in multiple forms, static I2V recaptioning, negative boilerplate.

## Why small rewriters pad

[LORE] 3–8B instruction models optimize for apparent completeness: they expand every category, echo the user's nouns, and add safe cinematic clichés. Countermeasures:

- Give a hard output band and a deletion priority.
- Classify task/variant before rewrite.
- State “one concrete detail per category; omit irrelevant categories.”
- Ban abstract atmosphere claims and quality-tag stacks.
- Require an internal checklist but output only the prompt.
- Use one or two contrastive examples showing concise expert output, not many long exemplars.
- Preserve exact text/dialogue before compression.

## Recommended rewriter instruction

“Preserve intent. Select only details that change pixels, motion, layout, or sound. Do not restate visible I2V content. Prefer one precise noun/verb over multiple adjectives. Stay within the model-specific band. Output only the final prompt.”

## Validator logic

- Count words and Han characters separately; never treat them as equivalents.
- Use soft warnings for normal prose bands, hard failures only for documented truncation/format limits.
- Count generic quality aliases and repeated lemmas.
- I2V: compare prompt nouns against image caption and discount unchanged static restatement.
- Text/dialogue content is protected from compression.

## Sources

Primary source links are collected in each model file; especially [Wan system prompts](https://github.com/Wan-Video/Wan2.2/blob/main/wan/utils/system_prompt.py), [LTX enhancer](https://github.com/Lightricks/ComfyUI-LTXVideo/blob/master/prompt_enhancer_utils.py), [H3 guides](https://github.com/MiniMax-AI/MiniMax-H3/tree/main/skills/h3-prompt-writing/references), [FLUX guide](https://docs.bfl.ai/guides/prompting_guide_flux2), [Z-Image staff discussion](https://huggingface.co/Tongyi-MAI/Z-Image-Turbo/discussions/8), and [Qwen 2512 rewriter](https://github.com/QwenLM/Qwen-Image/blob/main/src/examples/tools/prompt_utils_2512.py), all accessed 2026-08-15.

