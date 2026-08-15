# Official rewriter technique synthesis

Baseline: 2026-08-15.

## Common patterns

1. **Classify first.** Qwen routes portrait/text/general; H3 routes T2VA/I2VA/FL2VA/L2VA/Ref2VA; Wan routes T2V/I2V/empty-I2V.
2. **Protect invariants.** Preserve original subject/action, exact visible text, exact dialogue, reference identity and unchanged edit regions.
3. **Use variant schemas.** H3 has exact fields; SCAIL replacement is a final-video paragraph; Wan I2V is motion-only; Qwen portraits have ordered content.
4. **Constrain addition.** Add only logical light/environment/motion detail; never add subjects/styles/text without a reason.
5. **Ban known failure language.** SCAIL bans edit/process terms; Wan bans literary mood padding; Qwen bans placeholders for visible text.
6. **Hard output contract.** Output only prompt; one paragraph or exact fields; explicit word band.
7. **Examples follow rules.** Wan, LTX, H3 and Qwen all ship exemplars close to the target dialect.

## Per-rewriter anatomy

- Wan T2V: rule list + allowed cinematic vocab + defaults + banned literary output + 60–200 ZH characters + examples.
- Wan I2V: image-aware extraction + preserve action/camera + delete static restatement + ≤100 words.
- LTX: role (“cinematic director”) + chronological literal prose + category order + ≤150 words + output-only + examples.
- Qwen 2512: task classifier + shared rules + task-specific exhaustive fields + recommended flow + ~200 words + output-only.
- Z-Image PE: official location identified; staff says detailed/long. Public archived body was not reliably accessible.
- H3: mode classifier + references loaded on demand + exact field/label/timestamp contract; no generic prose rewrite.
- SCAIL: multimodal caption/reference inputs + final-state semantics + preservation rules + banned edit words + 90–140 words.

## Best system design for a 7B local rewriter

Use two stages in one response contract:

1. Silent routing/checklist: model, variant, input type, language, text/dialogue invariants, motion failure risk, target length.
2. Direct generation under the selected mini-schema.

Do not ask a small model to print chain-of-thought. [SYNTHESIS] Hidden checklist-style reasoning helps routing; printed reasoning consumes tokens, leaks policy, and increases format failures. Ask it to “check silently” and output only the prompt.

## Minimal master template

```text
Classify silently: MODEL_VARIANT, TASK, OUTPUT_LANGUAGE.
Protect: subject/action, quoted text/dialogue, reference roles, explicit user constraints.
Apply only the selected model rules. Add only concrete visible/audible details.
Delete: repetition, abstract mood, generic quality stacks, static I2V recaptioning.
Validate silently against FORMAT and LENGTH.
Output only the final prompt.
```

Then inject a small variant block, not every model's full manual. This reduces instruction interference in 3–8B models.

## Few-shot strategy

- 2–4 examples per dialect, each covering a distinct failure mode.
- Include one terse input whose output stays terse, preventing learned padding.
- Include one exact text/dialogue case and one multi-subject disambiguation case.
- Label upstream evidence internally, but never emit labels inside runtime prompts.
- Avoid dozens of long examples; they teach length more strongly than rules.

## Mechanical post-validation

Run deterministic checks after generation: required headers/order, word/character band, exact quoted-string preservation, banned terms, reference labels, camera contradiction, and text/dialogue syntax. If one check fails, repair only the failing field—do not rerun unrestricted expansion.

## Sources

- [Wan system prompts](https://github.com/Wan-Video/Wan2.2/blob/main/wan/utils/system_prompt.py) — [OFFICIAL].
- [LTX prompt enhancer](https://github.com/Lightricks/ComfyUI-LTXVideo/blob/master/prompt_enhancer_utils.py) — [OFFICIAL].
- [Qwen-Image 2512 rewriter](https://github.com/QwenLM/Qwen-Image/blob/main/src/examples/tools/prompt_utils_2512.py) — [OFFICIAL].
- [MiniMax H3 skill](https://github.com/MiniMax-AI/MiniMax-H3/tree/main/skills/h3-prompt-writing) — [OFFICIAL].
- [SCAIL enhancer](https://github.com/Ardynai/scail-2/blob/wan-scail2/prompt_enhancer.py) — [OFFICIAL].
- [Z-Image staff PE pointer](https://huggingface.co/Tongyi-MAI/Z-Image-Turbo/discussions/8) — [STAFF]. All accessed 2026-08-15.

