# Settings that change prompt strategy

Baseline: 2026-08-15. This is intentionally not a full settings guide.

| Model/variant | Setting context | Prompt implication |
|---|---|---|
| Wan T2V-A14B | 480p/720p; optional Qwen extension | Raw prompts may be brief; extended prompts should follow 60–200 ZH-character T2V schema |
| Wan I2V-A14B | Input aspect ratio; image-aware extender | Do not spend prompt on static appearance; motion/camera ≤100 words |
| Wan TI2V-5B | 1280x704 T2V, image aspect for I2V | Select T2V vs I2V dialect from presence of image |
| LTX 2.3 dev vs distilled | Different checkpoint/LoRA recipes; HQ LoRA 0.8 | Keep prompt fixed when comparing quality; distilled may trade diversity/adherence |
| H3 base vs Ref2VA | Different input representation/schema | Mode choice changes the entire prompt format, not just settings |
| SCAIL standard | 40 steps, shift 3, CFG 5 | 90–140-word replacement paragraph; drive/mask control motion |
| SCAIL Lightx2v | 8 steps, shift 1, CFG 1, LoRA 1 | Do not attribute distilled artifacts to prompt wording without an A/B test |
| SDXL/RealVis/Juggernaut | CFG ~4–7; 30–50 steps by card | Higher CFG can oversaturate; compact front-loaded prompts outperform padding |
| FLUX.2 klein distilled | 4 steps; no prompt upsampling | Supply explicit detail; no negative prompt |
| FLUX.2 dev/base | Local customization, more diversity | Longer/structured prompts and references are viable; compare at fixed guidance |
| Z-Image Turbo | 8 NFEs/9 scheduler steps, CFG 0 | No negatives; detailed natural prompt; 512-token default |
| Z-Image base | 28–50 steps, CFG 3–5, negatives | Targeted negative is part of control; CFG normalization on for realism |
| Qwen Edit-2511 | 40 steps, true CFG 4, guidance 1 example | Direct edit instruction plus preservation clauses; blank negative is acceptable |
| Qwen Lightning | Version-specific 4/8-step LoRA | Short acceleration can reduce adherence; never mix LoRA/model versions |

## General rules

- A prompt benchmark changes one variable at a time: prompt, seed, checkpoint, steps, guidance, scheduler, resolution, enhancer and reference strength must be logged.
- Distillation commonly changes diversity and fine-detail adherence. Rewriter rules should select variant before length/negative policy.
- Higher guidance is not a substitute for clear binding. It can increase saturation and artifacts [OFFICIAL Diffusers].
- Aspect ratio is compositional conditioning: match portrait/full-body, landscape/wide establishing, and poster layouts before rewriting around crops.
- When a prompt enhancer is on, validate the actual expanded prompt—not only the user's original.

## Sources

See each model's `## Sources`; primary settings are from official model cards/repos accessed 2026-08-15.

