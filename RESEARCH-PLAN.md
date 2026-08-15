# Research Plan — Prompt Studio "Expert Edition" Knowledge Expansion

**For:** a dedicated research session (web research, no code changes)
**Consumer:** Claude in a later session will parse everything under `research/` and fold it into `PromptStudio.html` (the `KNOWLEDGE` bank, the per-model `TARGETS` system prompts, and the format validators). Write for that consumer: structured, quotable, source-marked.
**Date baseline:** verify everything as of the research date; note version numbers and dates on every claim.

## Goals (in priority order)

1. **Expert-level prompt dialect mastery per model** — beyond the basics we have: the knobs that separate an okay prompt from an expert one.
2. **Chinese-output expertise** — exactly when a Chinese prompt outperforms English per model, and what expert Chinese prompts look like (not translations — native prompt idiom). The app should be able to *choose* Chinese when it wins.
3. **Motion quality** — the #1 user complaint is "the motion isn't what I wanted": too static, too chaotic, wrong subject moving, camera drifting. Collect per-model motion-control vocabulary, known motion failure modes, and prompt-side fixes.
4. **Verbosity calibration** — second complaint: outputs too verbose/flowery, or padded prompts that dilute the subject. Find per-model evidence for optimal length and structure density, and what kinds of detail are load-bearing vs noise.
5. **Few-shot gold** — the single highest-leverage artifact: curated pairs of (plain intent → expert prompt), EN and ZH, per model. These go directly into the app's system prompts.

## Models in scope

Video: **Wan 2.2** (T2V-A14B / I2V-A14B / TI2V-5B), **LTX 2.3**, **MiniMax H3** (T2VA + full-reference mode), **SCAIL-2** (Animation + Replacement).
Image: **SDXL** (+ major fine-tune families: Juggernaut, RealVis, Pony, Illustrious), **Flux** (FLUX.1 dev/schnell/Krea, FLUX.2 dev/klein), **Z-Image / Z-Image-Turbo** (+ base variant, Edit if released by research date), **Qwen-Image** (2512 + Edit-2511, Lightning).
Also check: any NEW major locally-runnable video/image model released since Aug 2026 that a class would care about — one short file if so.

## Per-model research brief (repeat for each model)

For each model, answer with sources:

1. **Official prompt guidance, exhaustively.** Not just the README — dig into: docs folders in the repo, HuggingFace model card discussions where STAFF answer, official blog posts, and the **actual system-prompt text of the model's official prompt rewriter/extender** (e.g. Wan's `prompt_extend.py` Chinese and English system prompts, Qwen-Image's `prompt_utils_2512.py`, LTX's enhancer node prompts, Z-Image's archived `pe.py`, Hunyuan's PromptEnhancer prompts as comparative reference). **Quote these verbatim in full** — they are the single best source of truth and we will mine them for our own system prompts.
2. **Chinese prompting.** Is the model's text encoder bilingual? Do official docs/examples prompt in Chinese? Community consensus (including Chinese community) on EN vs ZH quality per task type? Collect 3+ native Chinese expert prompt examples with what makes them idiomatic (e.g. 4-character aesthetic compounds, cinematography terms in Chinese). For Chinese-first models (Wan, Qwen-Image, Z-Image, H3, SCAIL-2), specifically search Chinese sources: official 中文 docs, Zhihu, Bilibili tutorial transcripts, WeChat/公众号 articles, 通义/魔搭 (ModelScope) community. Note when Chinese wins (e.g. rendering Chinese glyphs, negative prompts, aesthetic vocab) and when it doesn't.
3. **Motion control (video models) / composition control (image models).** The full documented camera + subject-motion vocabulary; how to force motion when output is too static; how to calm chaotic motion; how to make only ONE subject move; motion strength settings that interact with prompts (e.g. Wan motion score lore, LTX prompt-vs-guidance interplay, H3 amplitude/speed modifiers, SCAIL-2 driving-video dominance). Collect known failure → prompt-fix tables.
4. **Verbosity and structure calibration.** Evidence (official statements, controlled community tests, not vibes) on optimal token/word counts per variant; which detail categories improve output (lighting, texture, spatial layering) vs dilute it (mood words, meta-tags, redundant style stacking); ordering effects (front-loading).
5. **Negative prompts / guidance, advanced.** Beyond defaults: task-specific negative additions that measurably help; CFG/shift/steps interplay with prompt style; per-fine-tune trigger tags (SDXL families) with their model-card sources.
6. **Few-shot gold pairs.** 4-6 pairs per model of (short plain-language intent → expert full prompt), covering: a person/character shot, a landscape/scene, an action/motion-heavy shot, a text-in-image case (image models), a dialogue/audio case (H3/LTX). Provide both EN and ZH versions where ZH is relevant. Mark which are from official sources vs community vs your own synthesis following official rules.
7. **Common expert mistakes.** What do experienced users still get wrong on this model? (These become teaching notes and validator rules.)
8. **Validator-rule suggestions.** Mechanical, regex-checkable rules an app could use to verify a prompt fits this model's dialect (e.g. "must contain X", "must not contain Y", word-count bands, required sections). Flag rules we likely have wrong today.

## Cross-cutting topics (separate files)

- **chinese-prompting.md** — When/why Chinese prompts win across Alibaba-family models; bilingual encoder behavior; mixed EN/ZH prompts; Chinese negative-prompt conventions; pitfalls of machine-translated Chinese; a mini style guide for writing native-idiom Chinese prompts (vocabulary lists: lighting terms, camera terms, aesthetic compounds, texture words).
- **motion-quality.md** — Cross-model synthesis of the "motion isn't what I want" problem: taxonomy of motion failures (static output, morphing/warping, wrong-subject motion, camera drift, speed issues), which are prompt-fixable vs settings-fixable vs model limits, per-model mapping.
- **verbosity.md** — Cross-model synthesis: prompt-length sweet spots table with evidence quality noted; the "load-bearing detail" hierarchy; how small local rewriter LLMs (3-8B) tend to pad, and system-prompt techniques that keep a rewriter terse and concrete.
- **rewriter-technique.md** — How the best official rewriters are prompted (patterns across Wan/Qwen/Z-Image/Hunyuan/LTX rewriter system prompts): classification-then-rules structures, banned-word lists, output-only constraints, exemplar counts. Anything that helps our Qwen-7B rewriter behave expertly, including whether asking it to *reason before writing* helps or hurts on small models.
- **settings-context.md** — Brief per-model generation-settings reference (steps/CFG/shift/scheduler/resolution) ONLY where settings change what the prompt should say. Not a full settings guide.

## Source and evidence standards

- Prefer, in order: official repo/docs/model cards → staff posts in HF discussions/issues → maintainer blogs (Comfy, BFL, Lightricks) → high-quality community tests with methodology (side-by-side grids, fixed seeds) → tutorials/lore. **Chinese official docs outrank English mirrors for Alibaba-family models.**
- Label every claim: `[OFFICIAL]`, `[STAFF]`, `[TESTED]` (community with methodology), `[LORE]` (consensus without test), `[SPECULATION]`. Include URL + access date. If sources conflict, keep both and say so.
- Quote official rewriter system prompts and official example prompts **verbatim in fenced blocks** — do not paraphrase them.
- It is fine (and useful) to report "no reliable information found" for a subtopic.

## Output organization — REQUIRED

Create a `research/` folder in this repo folder:

```
research/
  INDEX.md                 ← checklist of every brief item per model, status, and one-line summary of the biggest finding
  wan22.md
  ltx23.md
  minimax-h3.md
  scail2.md
  sdxl.md
  flux.md
  z-image.md
  qwen-image.md
  new-models.md            ← only if something new and significant exists
  _cross/chinese-prompting.md
  _cross/motion-quality.md
  _cross/verbosity.md
  _cross/rewriter-technique.md
  _cross/settings-context.md
```

Every model file uses the same section headers, in this order, so they can be parsed programmatically:
`## Official guidance` · `## Rewriter system prompts (verbatim)` · `## Chinese prompting` · `## Motion / composition control` · `## Verbosity calibration` · `## Negatives & guidance` · `## Few-shot gold` · `## Expert mistakes` · `## Validator suggestions` · `## Sources`

In `## Few-shot gold`, format each pair exactly as:

```
### Pair N — <category> [<EVIDENCE-LABEL>]
INTENT: <plain-language intent>
PROMPT-EN:
<full prompt>
PROMPT-ZH: (omit if not relevant)
<full prompt>
NOTES: <why this is expert-level; which rules it demonstrates>
```

## Non-goals

No code changes, no edits to PromptStudio.html or the knowledge bank, no reorganizing existing files. Research output goes ONLY into `research/`. Commit to git as you go with plain messages ("research: wan22 brief").

## Done criteria

INDEX.md shows every brief item addressed (or explicitly marked "nothing found"); every model file has ≥4 few-shot gold pairs; ZH coverage exists for Wan, Qwen-Image, Z-Image, H3, SCAIL-2; all rewriter system prompts that are publicly available are captured verbatim.
