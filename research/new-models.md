# Significant new locally runnable models found

Research baseline: 2026-08-15. “New” is interpreted as major 2026 releases newer than the named baseline variants, not releases after the research date.

## LTX-2.5 [OFFICIAL]

LTX-2.5 supersedes 2.3 and is open-weight/local. Official docs say it uses a custom Gemma 4 12B text encoder, has stronger complex-prompt following, optional prompt enhancement, synchronized video/audio, auto-duration inferred from described events, EXR support, LoRA and IC-LoRA. This is significant enough for a class update because it changes both prompt understanding and duration semantics. [Official docs](https://docs.ltx.io/open-source-model/getting-started/overview), accessed 2026-08-15.

Prompt impact: describe the event needed rather than choosing duration independently; use enhancer for terse prompts and disable it to preserve exact wording.

## Qwen-Image 2.0 / 2.0-RL / Flash [OFFICIAL/PAPER]

Qwen-Image 2.0 unifies generation and editing and has superseded 2512/2511 in current Alibaba endpoints. The 2.0-RL report claims improved aesthetics, adherence and editing on Qwen-Image-Bench; Qwen-Image-Flash addresses few-step generation. These are significant model-family updates for local image curricula, although exact open-weight availability/license must be checked per checkpoint before classroom packaging. [2.0 report](https://arxiv.org/abs/2605.10730) · [2.0-RL report](https://arxiv.org/abs/2606.27608) · [Flash report](https://arxiv.org/abs/2606.03746), accessed 2026-08-15.

## Qwen-Image 3.0 API notice [OFFICIAL, not confirmed local]

Alibaba documentation lists Qwen-Image 3.0 as of July 2026, but this research did not find a primary-source open-weight/local release. It should not be added to a “locally runnable” selector yet. [Alibaba API docs](https://help.aliyun.com/en/model-studio/qwen-image-generation-and-editing-api-reference), accessed 2026-08-15.

## FLUX 3 [OFFICIAL docs mention; local status unverified]

BFL's current prompting index mentions FLUX 3 video prompting, but no verified open-weight local release was established in this pass. Do not add it as locally runnable without model-card/license confirmation. [BFL prompting index](https://docs.bfl.ai/guides/prompting_summary), accessed 2026-08-15.

## Recommendation

Add LTX-2.5 immediately as a new local target. Track Qwen-Image 2.0 open checkpoints and licenses. Keep Qwen-Image 3.0 and FLUX 3 out of local selectors until official downloadable weights are confirmed.

