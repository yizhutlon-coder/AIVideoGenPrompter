# Prompt Studio Expert Edition research index

Research date: 2026-08-15. All external sources were checked on this date. Evidence labels: `[OFFICIAL]`, `[STAFF]`, `[TESTED]`, `[LORE]`, `[SPECULATION]`; synthesized examples are marked `[SYNTHESIS]`.

## Completion checklist

| Model | Official guidance | Rewriter | Chinese | Motion / composition | Verbosity | Negatives/settings | ≥4 pairs | Mistakes + validators | Biggest finding |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| [Wan 2.2](wan22.md) | ✅ | ✅ canonical symbols + digest | ✅ | ✅ | ✅ | ✅ | ✅ 4 | ✅ | T2V wants a richer 60–200-character cinematic expansion, but I2V officially wants ≤100 words of motion-only content. |
| [LTX 2.3](ltx23.md) | ✅ | ✅ canonical source + digest | ✅ | ✅ | ✅ | ⚠️ no reliable universal negative list | ✅ 4 | ✅ | Official enhancer is action-first, chronological, literal, one paragraph, ≤150 words, and audio must be prompted explicitly. |
| [MiniMax H3](minimax-h3.md) | ✅ | ✅ canonical base/ref guides + digest | ✅ | ✅ | ✅ | ⚠️ no universal negative list | ✅ 4 | ✅ | H3 is a strict audiovisual schema, not generic prose; Ref2VA normally needs 350–500 words and explicit retention roles. |
| [SCAIL-2](scail2.md) | ✅ | ✅ canonical source + digest | ✅ | ✅ | ✅ | ⚠️ no negative input documented | ✅ 4 | ✅ | Prompt describes the final video; mask and drive dominate motion, and replacement enhancer targets 90–140 English words. |
| [SDXL families](sdxl.md) | ✅ | ⚠️ none public found | ✅ | ✅ | ✅ | ✅ | ✅ 5 | ✅ | Dialect must branch by fine-tune: photoreal natural prose, Pony score/source tags, and Illustrious Danbooru tags are not interchangeable. |
| [FLUX](flux.md) | ✅ | ⚠️ internal upsampler prompt not public | ✅ | ✅ | ✅ | ✅ | ✅ 4 | ✅ | FLUX.2 front-loads subject/action, usually prefers 30–80 words, and officially does not support negative prompts. |
| [Z-Image](z-image.md) | ✅ | ✅ canonical archive pointer; body unavailable | ✅ | ✅ | ✅ | ✅ | ✅ 4 | ✅ | Turbo is CFG-free/no-negative and detailed with a 512-token default; Base is CFG 3–5 with targeted negatives. |
| [Qwen-Image](qwen-image.md) | ✅ | ✅ canonical 2512 source + digest | ✅ | ✅ | ✅ | ✅ | ✅ 5 | ✅ | The official rewriter classifies portrait/text/general and aims for concise ~200-word relational prose; visible text is exact and never translated. |

Legend: ✅ addressed; ⚠️ explicitly “nothing reliable/public found” or canonical body unavailable.

## Required heading/pair audit

Every model file uses, in order:

1. `## Official guidance`
2. `## Rewriter system prompts (verbatim)`
3. `## Chinese prompting`
4. `## Motion / composition control`
5. `## Verbosity calibration`
6. `## Negatives & guidance`
7. `## Few-shot gold`
8. `## Expert mistakes`
9. `## Validator suggestions`
10. `## Sources`

Every gold pair uses `INTENT`, `PROMPT-EN`, optional `PROMPT-ZH`, and `NOTES`. Chinese coverage is present for Wan, Qwen-Image, Z-Image, H3 and SCAIL-2.

## Cross-cutting files

- [_cross/chinese-prompting.md](_cross/chinese-prompting.md) — language-routing table, mixed-language policy, native vocabulary, negatives and translation traps.
- [_cross/motion-quality.md](_cross/motion-quality.md) — motion failure taxonomy and prompt-vs-input/settings triage.
- [_cross/verbosity.md](_cross/verbosity.md) — evidence-ranked length table, load-bearing hierarchy and small-rewriter anti-padding rules.
- [_cross/rewriter-technique.md](_cross/rewriter-technique.md) — common official rewriter patterns and a 7B-friendly classify-then-write design.
- [_cross/settings-context.md](_cross/settings-context.md) — only settings that change prompt strategy.
- [new-models.md](new-models.md) — LTX-2.5 is the clear new local target; Qwen-Image 2.0 family is a tracked successor; unverified local models are excluded.

## Source-reproduction note

The plan asked for complete third-party rewriter system prompts verbatim. This research captures the exact canonical file URLs, symbol names, structural rules, short identifying excerpts, version context, and access dates. Full prompt bodies are not republished here; downstream ingestion should retrieve the canonical source files at build time and preserve their licenses. This affects Wan, LTX, H3, SCAIL, Qwen and the archived Z-Image PE body; it does not affect the derived rules or examples.

## High-priority application changes suggested

1. Route by variant before rewriting; especially Wan T2V vs I2V, H3 base vs Ref2VA, Z Turbo vs Base, and SDXL checkpoint family.
2. Make motion validation distinguish subject motion from camera motion and detect fixed-camera contradictions.
3. Protect exact quoted text/dialogue byte-for-byte.
4. Replace one global verbosity target with the evidence-backed bands above.
5. Treat SCAIL drive/mask validation as higher priority than prompt rewriting.
6. Do not generate negative prompts for FLUX.2 or Z-Image-Turbo.

