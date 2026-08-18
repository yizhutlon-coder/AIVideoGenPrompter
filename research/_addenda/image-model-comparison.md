# Local image-model comparison — "reach for X when you need Y"

Comparative addendum to the image corpus (`sdxl.md`, `flux.md`, `z-image.md`, `qwen-image.md`,
`new-models.md`, `_addenda/image-catch-up.md`, `_addenda/krea-character-art.md`).
Research pass: **2026-08-17**. All URLs accessed **2026-08-17** unless noted.

**Purpose.** A teacher needs to tell a student *"reach for X when you need Y."* This document is the
evidence behind that sentence, per model, per dimension, with the numbers and the gaps.

Evidence labels as in the main corpus: `[OFFICIAL]` (vendor doc / code / model card / tech report),
`[STAFF]` (named vendor employee, non-doc), `[TESTED]` (third party ran it, methodology stated),
`[CITED]` (a number in someone's table that was copy-pasted from an earlier source, **not** re-run),
`[LORE]` (community consensus, no methodology), `[SPECULATION]`, `[SYNTHESIS]` (my inference).

---

## 0. Read this first — six methodological facts that change how you read every table below

These are not caveats. They are the findings.

**(1) Most "third-party" benchmark numbers are citation chains, not replications.**
The SDXL GenEval row (0.55 / 0.98 / 0.74 / 0.39 / 0.85 / 0.15 / 0.23) is byte-identical in CogView4,
Lumina-Image 2.0 and HiDream-I1 because all three re-quote the original GenEval paper. The SDXL DPG
row is byte-identical everywhere because all of them re-quote **ELLA**. The LongText-Bench rows in
Qwen-Image, Z-Image, Ovis-Image and GLM-Image agree **byte-for-byte** — that is one **X-Omni**
measurement propagated four times, not four confirmations. **Agreement across papers is not evidence
of reproducibility.**

**(2) GenEval is formally saturated and demonstrably mis-ranks current models.** `[TESTED]`
**GenEval 2** ([arXiv:2512.16853](https://arxiv.org/abs/2512.16853), Kamath, Chang, Krishna,
Zettlemoyer, Hu, Ghazvininejad, Dec 2025), verbatim:

> *"Although GenEval was well-aligned with human judgment at the time of its release, it has drifted
> far from human judgment over time — resulting in an **absolute error of as much as 17.7%** for
> current models. This level of drift strongly suggests that **GenEval has been saturated for some
> time**, as we verify via a large-scale human study."*

Their Table 1, reported vs. human-verified:

| Model | GenEval reported | Human-verified | Deviation |
|---|---|---|---|
| SD 2.1 | 44.8 | 42.5 | −2.4 |
| SDXL | 53.5 | 56.6 | +3.1 |
| SD3-medium | 69.8 | 75.2 | +5.4 |
| SD3.5-large | 69.6 | 77.0 | +7.4 |
| **FLUX.1-dev** | 62.9 | **73.1** | **+10.1** |
| **Qwen-Image** | 81.4 | **92.4** | **+11.0** |
| Gemini 2.5-Flash-Image | 75.4 | **93.1** | **+17.7** |

Co-author Yushi Hu, [X, Dec 2025](https://x.com/huyushi98/status/2002200394207015123): *"GenEval is
basically saturated and broken for today's text-to-image models: it relies on 2021 detector + CLIP,
so rankings can be nonsense… If you're benchmarking seriously, use GenEval2."*

**Practical rule: never separate two models on a GenEval delta under ~5 points.** Qwen-Image 0.87 /
LongCat 0.87 / FLUX.2-dev 0.87 / Z-Image 0.84 are not meaningfully ordered.

**(3) Two vendors publicly refuse to report GenEval/CompBench, and say why.**
Tencent (HunyuanImage 3.0, [arXiv:2509.23951](https://arxiv.org/abs/2509.23951) §5.1), verbatim:
*"they may highly rate images with critical failures in spatial relationships (e.g., confusing 'a boy
under a bee' with 'a bee under a boy')."* Krea, verbatim: *"many of the academic benchmarks and
metrics are misaligned with what users actually want."* Consequence: for HunyuanImage 3.0 the only
GenEval number in existence is the 0.72 in LongCat's table, and **Krea 2 appears on no compositional
benchmark at all.**

**(4) "Text rendering score" is not one quantity, and the benchmarks flatly contradict each other.**
FLUX.2 [dev] scores **85.34 on UniGenBench++ EN-short Text — the best open model** — and **1.0 on
BizGenEval Text-hard — near the bottom**. Both are defensible: BizGenEval uses dense multi-element
commercial documents, UniGenBench++ uses short strings. See §3.

**(5) The two most credible independent leaderboards rank models in different orders, and the
disagreement is the result.** T2I-CoReBench (instruction fidelity) puts **Z-Image base above
Z-Image-Turbo** (61.1 vs 56.4); Artificial Analysis Elo (aesthetic preference) puts **Turbo above
base** (1130 vs 1064). Same for FLUX.2 klein distilled vs Base at both sizes. **Distilled checkpoints
win the aesthetics arena and lose the composition benchmark.** Pick your leaderboard by asking what
you are actually optimizing.

**(6) Vendors publish latency on hardware nobody owns.** BFL's klein Pareto curves are *"measured on
a GB200 in bf16"*; Z-Image's sub-second claim is on an H800; GLM-Image's table is H100. The only
consumer-GPU figures that name a GPU, a resolution regime, VRAM and wall-clock together are
**FLUX.2 klein 4B distilled at ~1.2 s / 8.4 GB on a 5090** and **Qwen-Image fp8 at ~71 s on a
4090D** (resolution unstated, probably 1328²). See §8.

---

## 1. THE DECISION GUIDE — reach for X when you need Y

Each row is defended in the section named. Confidence is my judgement of how well-evidenced the
routing is, not how good the model is.

| When the student needs… | Reach for | Runner-up / fallback | Why | Confidence |
|---|---|---|---|---|
| **Anime / manga / booru-tag illustration** | **Illustrious XL v2.0** (or a NoobAI-XL / WAI-Illustrious derivative) | Animagine XL 4.0 (cleaner, SFW-leaning); **Z-Anime** if you'll write prose instead of tags | Every top-ranked anime checkpoint on Civitai is `baseModel: Illustrious`. Nothing on FLUX/Qwen/Z has displaced it. §6.1 | **High** (platform data) |
| **Chinese / CJK text in the image** | **LongCat-Image** (rare characters) or **GLM-Image** (long strings) | Qwen-Image-2512 | ChineseWord L3: LongCat **70.3** vs Qwen 6.5. LongText-ZH: GLM **0.979**. **Never FLUX** — FLUX.1 = 0.005. §3 | **High** |
| **English short text — a sign, a label, one word — on a small GPU** | **Z-Image-Turbo (6B)** | Qwen-Image-2512 | OneIG-EN Text **0.994**, 8 steps, <16 GB. Best text-per-VRAM in existence. §3 | **High** |
| **English long paragraph text** | **Z-Image base** (50 steps) or **Qwen-Image-2512** | GLM-Image | Base beats its own Turbo 0.935 → 0.917 on LongText-EN. Step count matters here and doesn't for short text. §3, §3.5 | **High** |
| **Posters / infographics with many separate text areas** | **GLM-Image** (if you have 23 GB+) or **Ovis-Image 7B** | Z-Image base | CVTG-2K word acc: Ovis 0.9200, GLM 0.9116, Z-Image 0.8671, **FLUX.1-dev 0.4965**. §3.2 | **High** |
| **Graphic design, typography, logos, layout** | **Ideogram 4** (open-weighted 2026-06-03, 9.3B) | FLUX.2 [dev] for brand hex codes; Qwen-2512 for infographics | Only model with a *human-designer* blind eval: 47.9% first-place vs FLUX.2 [max] 15.5%. Caveat: non-commercial licence, gated, **JSON-caption-only prompting**. §6.3 | **Medium** (vendor-selected third-party evals) |
| **Photoreal humans, best available look** | **Krea 2 Turbo** | Z-Image base / Juggernaut Z; Qwen-Image-2512 | *No measured evidence exists.* Routing is from architecture (no AI-generated pretraining data, no aesthetic oversampling) + platform behaviour. §5 | **Low — see §5.2** |
| **Photoreal humans with reproducible pose control** | **SDXL photoreal finetune + ControlNet** (Juggernaut XL v9 / RealVisXL V5) | Qwen-Image or Z-Image + their ControlNet-Union | SDXL is still the only base with a *complete* control stack incl. IP-Adapter-FaceID + InstantID. §7 | **High** |
| **Best English prompt adherence, hardware no object** | **FLUX.2 [dev] (32B)** | Qwen-Image-2512; Z-Image base | T2I-CoReBench overall 64.4 (top open model); DPG 87.57; TIIF 88.82/88.10. Needs 64–90 GB unquantized. §2, §8 | **Medium-high** |
| **Best adherence-per-VRAM** | **Z-Image base (6B)** or **FLUX.2 klein 9B** | LongCat-Image (6B) | Z-Image: CoReBench 61.1 at 6B / <16 GB. LongCat: GenEval 0.87 at 6B, ties 20B Qwen. §2, §8 | **Medium-high** |
| **Instruction editing, single image** | **Qwen-Image-Edit-2511** (Apache-2.0) or **FireRed-Image-Edit-1.1** (Apache-2.0) | FLUX.2 [klein] 9B | Arena single-edit Elo: Qwen-2511 1235 > klein-9B 1224. CPI-Bench overall: FireRed 3.43 > Qwen-2511 3.37. §4 | **Medium** |
| **Multi-image reference / compose 2+ subjects** | **FLUX.2 [klein] 9B** | FLUX.2 [dev] | Both a VLM judge (CPI multi 3.38) and **8.3M human arena votes** (Elo 1213) put it above Qwen-2511 (1173) and FireRed. **The marketing inverts the ranking.** §4.3 | **High** |
| **Keeping a specific person's face across edits** | **FireRed-Image-Edit-1.1** | Qwen-Image-Edit-2511 | Weakly supported — vendor's own bench only (REDEdit Portrait 4.50, Consistency 9.51). **No face-embedding metric exists for any 2026 edit model.** §4.2 | **Low** |
| **Character consistency across many fresh generations** | **SDXL/Illustrious + LoRA** (mature) or **Krea 2 Raw→LoRA→Turbo** | FLUX.2 klein + `dx8152/Flux2-Klein-9B-Consistency` | Krea's own FAQ: turnarounds are *"visually consistent… not pixel-perfect."* Train LoRA once the design is locked. §9 | **Medium** |
| **Fastest acceptable image on a laptop / 8 GB** | **FLUX.2 [klein] 4B** (Apache 2.0) | Z-Image-Turbo GGUF Q4; SDXL | ~1.2 s / 8.4 GB on a 5090, 4 steps. Only model on this list with **Apple Silicon (mflux) and LiteRT on-device** builds. §8 | **High** |
| **Fastest with best quality on a 16 GB card** | **Z-Image-Turbo (6B)** | Krea 2 Turbo fp8 (12 GB weights) | Vendor target is explicitly *"<16 GB VRAM consumer devices"*, 8 NFE. §8 | **High** |
| **Unrestricted commercial use, no revenue cap, no filter duty** | **Z-Image / Qwen-Image (Apache 2.0)**, **LongCat-Image (Apache 2.0)**, **GLM-Image (MIT)**, **HiDream-I1 (MIT)**, **FLUX.2 klein 4B (Apache 2.0)** | SDXL (OpenRAIL++, use-restrictions but no cap) | See §10. **FLUX.1 dev / FLUX.2 dev / klein 9B are non-commercial.** Krea 2 and SD3.5 cap at $1M revenue. | **High** |
| **A workflow that must not be blocked or revoked** | **Chroma1-HD (Apache 2.0, explicitly unaligned)** or **SDXL/Illustrious/Pony** | — | Krea 2 and FLUX.2 klein 9B **licences oblige the deployer to run content filters**; Krea reserves revocation. §10 | **High** |
| **Widest painterly / non-photoreal style range** | **Krea 2** (Raw for diversity, Turbo for speed) | SDXL + LoRAs (vast library); FLUX.1 Krea [dev] | Krea 2's whole thesis is anti-mode-collapse; 9 official style LoRAs. §6.2, and see `krea-character-art.md` | **Medium** |
| **Seed-to-seed variety while exploring** | **The non-distilled checkpoint of whatever you chose** — Z-Image base, Krea 2 Raw, klein Base, Chroma1-Base | SD1.5/SDXL if you genuinely just want scatter | OneIG Diversity: SD1.5 0.429 > SDXL 0.296 > FLUX.1-dev 0.238 > Qwen 0.179. Every vendor now admits post-training is deliberate mode collapse. §9.1 | **High** |
| **Anything requiring hands to be right first try** | *No model.* Generate 4, pick one, or inpaint with an SDXL/Qwen stack. | — | **There is no hand benchmark. At all.** §5.3 | **High (that the gap exists)** |

### 1.1 The five "do not reach for X" rules

1. **Do not use FLUX (any version) for Chinese text.** FLUX.1 [dev] LongText-ZH = **0.005**; klein 9B
   = 0.218; FLUX.2 [dev] = 0.757 — improved, not solved. On CVTG-Hard-ZH, FLUX.1-dev scores
   **0.0000**. `[TESTED]`
2. **Do not use SDXL for any text at all.** OneIG-EN Text **0.029**; UniGenBench++ EN-short **0.00**.
   SDXL's own model card says *"The model cannot render legible text."* `[OFFICIAL]`
3. **Do not use a Lightning/Turbo/distilled LoRA when the image contains dense or small text.**
   Qwen's own Lightning repo: *"the base model is more likely to produce better results"* for dense
   and small text. klein Base 9B beats klein 9B distilled by **17 points** on UniGenBench++ EN text.
   `[OFFICIAL]` + `[TESTED]`
4. **Do not expect Krea 2 or FLUX.2 to inpaint.** Krea 2 has no edit model (`[STAFF]`, AMA). BFL
   shipped **no FLUX.2-Fill and no FLUX.2-Redux** — a real regression vs FLUX.1. §7.4
5. **Do not assume kohya `sd-scripts` will train your new model.** As of v0.11.1 (2026-06-16) it
   supports none of Qwen-Image, Z-Image, FLUX.2, Krea 2, LongCat, GLM. That work moved to
   **musubi-tuner** and **ai-toolkit**. §7.7

---

## 2. Dimension 1 — Prompt adherence

### 2.1 The one benchmark that still discriminates: T2I-CoReBench `[TESTED]`

**Best methodology found in this entire pass.** [t2i-corebench.github.io](https://t2i-corebench.github.io/)
· [arXiv:2509.03516](https://arxiv.org/abs/2509.03516) (ICLR 2026, Kling/Kuaishou + USTC + HKU).
**1,080 identical prompts, ~13,500 yes/no checklist questions, 28+ models, 12 dimensions** (4
composition, 8 reasoning), MLLM judges. Seeds not fixed/reported.

| Model | Composition | Reasoning | **Overall** |
|---|---|---|---|
| *(closed ref)* Nano Banana 2 | 89.8 | 83.1 | *85.3* |
| **FLUX.2 [dev]** | 84.7 | 54.2 | **64.4** |
| **Qwen-Image-2512** | 83.7 | 51.7 | **62.4** |
| **Z-Image (base)** | 81.9 | 50.6 | **61.1** |
| **FLUX.2 [klein] 9B** | 78.0 | 52.0 | **60.6** |
| **LongCat-Image** | 70.8 | 54.1 | **59.6** |
| Qwen-Image | 78.0 | 49.3 | 58.9 |
| **Z-Image-Turbo** | 74.6 | 47.3 | **56.4** |
| **FLUX.2 [klein] 4B** | 68.4 | 47.7 | **54.6** |
| FLUX.1 Krea [dev] | 56.0 | 44.3 | 48.2 |
| FLUX.1 [schnell] | 49.6 | 40.0 | 43.2 |
| HiDream-I1 (Full) | 50.3 | 39.4 | 43.0 |
| **FLUX.1 [dev]** | 48.6 | 39.0 | **42.2** |
| SD3.5 Large | 41.5 | 35.9 | 37.8 |
| SD3.5 Medium | 41.0 | 33.9 | 36.3 |

**Krea 2 and GLM-Image are absent.** Headline conclusion, verbatim: *"composition capability still
remains limited in high compositional scenarios, while **the reasoning capability lags even further
behind as a critical bottleneck**, with all models struggling to infer implicit elements."*

**The single most actionable finding in this document:** on CoReBench, **prompt rewriting is worth
more than model choice**. Qwen-Image's reasoning mean goes **49.3 → 72.7 (+23.4)** with o3 rewriting;
FLUX.1 Krea [dev] goes **44.3 → 65.5 (+21.2)**. Closed models that already rewrite internally gain
only +4.6 to +10.9. **A rewritten Qwen-Image beats an un-rewritten FLUX.2 [dev] on reasoning.**

> ⚠️ This cuts against the corpus's existing rewriter finding (`image-catch-up.md` contradiction #1,
> where naive zero-shot rewriting scored **below** no rewriter at all, 0.370 vs 0.401). Both are
> `[TESTED]`. **Reconciliation `[SYNTHESIS]`:** CoReBench used a *frontier reasoning model* (o3) on
> *reasoning-heavy* prompts; arXiv:2510.12041 used mid-size open backbones on *aesthetic preference*.
> The honest teaching line is: **rewriting helps most where the prompt requires inference the image
> model can't do, and hurts where it just adds adjectives.**

### 2.2 GenEval — read §0(2) first

| Model | Overall | Two Obj | Count | Position | Color-Attr | Source | Label |
|---|---|---|---|---|---|---|---|
| Qwen-Image-RL | **0.91** | 0.95 | 0.93 | 0.87 | 0.83 | [Qwen tech report](https://arxiv.org/abs/2508.02324) Tab.4 | `[OFFICIAL]` |
| Mage-Flow 4B (RL) | 0.90 | – | – | – | – | [Mage-Flow README](https://raw.githubusercontent.com/microsoft/Mage/main/mage_flow/README.md) | `[OFFICIAL]` |
| Qwen-Image (SFT) | 0.87 | 0.92 | 0.89 | 0.76 | 0.77 | same | `[OFFICIAL]` |
| **FLUX.2 [dev]** | **0.87** | – | – | – | – | Mage-Flow README | `[TESTED*]` |
| **LongCat-Image (6B)** | **0.87** | 0.98 | 0.86 | 0.75 | 0.73 | [LongCat](https://arxiv.org/html/2512.07584v1) Tab.2 | `[OFFICIAL]` |
| FLUX.2 [klein] 9B | 0.86 | – | – | – | – | Mage-Flow README | `[TESTED*]` |
| **Z-Image (base)** | **0.84** | – | – | – | – | [Z-Image](https://arxiv.org/abs/2511.22699) §5.2 | `[OFFICIAL]` |
| FLUX.2 [klein] Base 9B / 4B | 0.83 / 0.83 | – | – | – | – | Mage-Flow README | `[TESTED*]` |
| HiDream-I1-Full | 0.83 | 0.98 | 0.79 | 0.60 | 0.72 | [arXiv:2505.22705](https://arxiv.org/html/2505.22705v1) | `[OFFICIAL]` |
| **Z-Image-Turbo** | **0.82** | – | – | – | – | Z-Image §5.2 | `[OFFICIAL]` |
| Qwen-Image (GenEval-2 re-run) | 0.814 | – | – | – | – | GenEval 2 Tab.1 | `[TESTED]` |
| Janus-Pro-7B | 0.80 | 0.89 | 0.59 | 0.79 | 0.66 | multiple | `[CITED]` |
| FLUX.2 [klein] Base 4B | 0.78 | – | – | – | – | Mage-Flow README | `[TESTED*]` |
| CogView4-6B / Lumina-Image 2.0 | 0.73 / 0.73 | 0.86/0.87 | 0.66/0.67 | 0.48/– | 0.58/0.62 | vendor READMEs | `[OFFICIAL]` |
| HunyuanImage 3.0 | 0.72 | 0.92 | 0.48 | 0.42 | 0.63 | LongCat Tab.2 | `[TESTED]` |
| SD3.5-Large | 0.71 / 0.696 | 0.89 | 0.73 | 0.34 | 0.47 | Qwen; GenEval 2 | `[CITED]`/`[TESTED]` |
| **FLUX.1 [dev]** | **0.66 / 0.6518 / 0.629** | 0.79–0.81 | 0.65–0.74 | 0.22–0.24 | 0.445–0.45 | 4 lineages | see below |
| **SDXL 1.0** | **0.55 / 0.535** | 0.74 | 0.39 | **0.15** | **0.23** | [GenEval](https://arxiv.org/abs/2310.11513) | `[TESTED]` origin |

`[TESTED*]` = published by Microsoft Mage-Flow; the FLUX.2 rows cannot be citations (no vendor source
exists) so they are presumably Microsoft-run, but the README does not say which of its rows are cited
vs re-run. Every Mage-Flow row for Qwen/Z-Image/LongCat/Hunyuan matches those vendors' self-reports
*exactly*, i.e. those are cited.

**Reported discrepancies for the same model+benchmark:** SD3-Medium **0.62 / 0.698 / 0.74** (spread
0.12 — the largest in the corpus; caused by GenEval vs GenEval++ version drift and different runs).
FLUX.1 [dev] has **four** circulating values across two subscore lineages.

**No GenEval exists for:** FLUX.1 [schnell], FLUX.1 Krea [dev], Qwen-Image-2512, GLM-Image, Krea 2,
or **any** SDXL finetune. **No 2025/2026 model has been re-scored under GenEval 2** — its evaluated
set is fixed at 8 models.

**The single number to teach from this table:** SDXL's **Position 0.15 and Color-Attribution 0.23**.
That is what "SDXL cannot do spatial relations or bind attributes" looks like numerically, and it is
the honest reason to move a student off SDXL for anything compositional.

### 2.3 DPG-Bench

| Model | Overall | Source | Label |
|---|---|---|---|
| Qwen-Image | **88.32** | Qwen Tab.3 | `[OFFICIAL]` |
| **Z-Image (base)** | **88.14** (Attribute **93.16**) | Z-Image §5.2 | `[OFFICIAL]` |
| **FLUX.2 [dev]** | **87.57** | Mage-Flow README | `[TESTED*]` |
| Lumina-Image 2.0 | 87.20 | [arXiv:2503.21758](https://ar5iv.labs.arxiv.org/html/2503.21758) | `[OFFICIAL]` |
| **Qwen-Image-2512** | **87.20** | [GLM-Image README](https://github.com/zai-org/GLM-Image) | `[TESTED]` |
| LongCat-Image | 86.80 | LongCat Tab.3 | `[OFFICIAL]` |
| FLUX.2 [klein] 9B | 86.20 | Mage-Flow | `[TESTED*]` |
| HunyuanImage 3.0 | 86.10 | LongCat Tab.3 | `[TESTED]` |
| HiDream-I1-Full | 85.89 | HiDream Tab.1 | `[OFFICIAL]` |
| FLUX.2 [klein] 4B / Base 9B | 85.53 / 85.29 | Mage-Flow | `[TESTED*]` |
| CogView4-6B | 85.13 | CogView4 README | `[OFFICIAL]` |
| **Z-Image-Turbo** | **84.86** | GLM-Image README | `[CITED]` |
| GLM-Image | 84.78 | GLM-Image README | `[OFFICIAL]` |
| SD3-Medium | 84.08 | ELLA-lineage | `[CITED]` |
| **FLUX.1 [dev]** | **83.52–83.84** | 4 sources | `[CITED]`/`[TESTED]` |
| FLUX.2 [klein] Base 4B | 83.02 | Mage-Flow | `[TESTED*]` |
| **SDXL** | **74.65** | [ELLA](https://arxiv.org/abs/2403.05135) | `[TESTED]` origin |

> **DPG-Bench is the most citation-contaminated table in the field.** Two published FLUX.1-dev rows
> share an overall of ~83.8 but have Global subscores of **74.35 vs 85.80** — an 11.5-point gap on
> the same model, same benchmark. Verify provenance before trusting any row.

**No DPG number exists for SD3.5 (Large or Medium) or Krea 2.**

### 2.4 T2I-CompBench — abandoned

**No 2025/2026 open-weights model has a published T2I-CompBench number.** Not FLUX.2, not Z-Image,
not Qwen-Image, not GLM-Image, not LongCat, not Krea 2, not HiDream, not SD3.5. The benchmark was
effectively dropped by vendors after 2024. What survives (CogView4's T2I-CompBench++ table):

| Model | Color | Shape | Texture | 2D-Spatial | 3D-Spatial | Numeracy | Complex |
|---|---|---|---|---|---|---|---|
| SDXL | 0.5879 | 0.4687 | 0.5299 | **0.2133** | 0.3566 | 0.4988 | 0.3237 |
| SD3-Medium | 0.8132 | 0.5885 | 0.7334 | 0.3200 | 0.4084 | 0.6174 | 0.3771 |
| FLUX.1 [dev] | 0.7572 | 0.5066 | 0.6300 | **0.2700** | 0.3992 | 0.6165 | 0.3628 |
| CogView4-6B | 0.7786 | 0.5880 | 0.6983 | 0.3075 | 0.3708 | 0.6626 | 0.3869 |
| Janus-Pro-7B | 0.5145 | 0.3323 | 0.4069 | 0.1566 | 0.2753 | 0.4406 | 0.3806 |

Source: [github.com/THUDM/CogView4](https://github.com/THUDM/CogView4). ⚠️ Two incompatible versions
circulate: original T2I-CompBench (BLIP-VQA, 3 categories, NeurIPS 2023) vs **T2I-CompBench++** (8
categories, TPAMI 2025). SDXL's Color is 0.6369 in one and 0.5879 in the other. Not an error — a
version discontinuity. **Never mix rows across the two.**

### 2.5 Spatial relations — the one benchmark, and it stops in mid-2025

**GenSpace** ([arXiv:2505.24870](https://arxiv.org/html/2505.24870v2)) `[TESTED]`:

| Model | Camera Pose | Complex Pose | Allocentric Rel | Intrinsic Rel | ObjDist | Avg Rank |
|---|---|---|---|---|---|---|
| GPT-4o (closed) | 59.41 | 25.01 | **21.21** | 19.08 | 41.33 | 1.8 |
| Bagel (open, unified) | 43.34 | 13.47 | 22.53 | 19.12 | 36.86 | 3.6 |
| SD3.5-L | 42.85 | 5.90 | 11.15 | 23.55 | 33.05 | 5.3 |
| **FLUX.1-dev** | 40.42 | 12.28 | 13.17 | 19.40 | 30.72 | 5.4 |
| **SDXL** | 33.66 | 9.52 | 16.38 | 8.87 | 33.76 | 7.7 |

**Note the ceiling: even GPT-4o scores 21–25% on allocentric relations and complex pose.** Verbatim:
*"unified generative models perform better than dedicated image generation models with similar ELO
scores… closed-source models still comprehensively outperform their open-source counterparts."*

**No 2025/2026 model has GenSpace coverage — no evidence found.** Treat 3D spatial reasoning as an
open failure mode for every local model, *regardless of its GenEval Position subscore.*

### 2.6 TIIF-Bench — the best-maintained third-party leaderboard

[a113n-w3i.github.io/TIIF_Bench](https://a113n-w3i.github.io/TIIF_Bench/) `[TESTED]`. Short/long:
**FLUX.2 [dev] 88.82/88.10** · Qwen-Image 86.14/86.83 · klein 9B 85.22/84.13 · Qwen-2512 83.24/84.93 ·
Z-Image 80.20/83.01 · klein Base 9B 81.47/84.52 · GLM-Image 81.01/81.02 · LongCat 80.93/81.30 ·
klein Base 4B 79.94/80.01 · klein 4B 78.91/79.04 · Z-Image-Turbo 77.73/80.05 · DALL-E 3 74.96/70.81 ·
BAGEL 71.50/71.70 · SD3.5-Large 71.15/66.96 · **FLUX.1 [dev] 71.09/71.78** · SD3.5-Medium 70.17/66.19 ·
**SDXL 54.96/42.13**.

Spread from SDXL to FLUX.2-dev is 34 points. **This is the benchmark to use when you need a number
that still separates models.**

### 2.7 World knowledge — WISE

WISE_Verified (Qwen3.5-35B judge, benchmark maintainers, `[TESTED]`): Qwen-Image-Agent 0.9020 ·
Qwen-Image-2.0 0.7954 · **FLUX.2-dev 0.5650** · Qwen-Image 0.5100 · FLUX.1-dev 0.4160 ·
SD3.5-large 0.4040 · FLUX.1-schnell 0.3640 · **SDXL-0.9 0.3640** · SD1.5 0.3090.
Legacy WISE (GPT-4o judge, not comparable): **LongCat-Image 0.65** · Qwen-Image 0.62 ·
HunyuanImage 3.0 0.57 · FLUX.1-dev 0.50 · SD3.5-L 0.46 · **SDXL 0.43** · FLUX.1-schnell 0.40.

Z-Image, GLM-Image, LongCat and Krea 2 are absent from WISE_Verified — **no evidence found.**
Z-Image's own stated limitation `[OFFICIAL]`: *"Due to limited model size (6B parameters), Z-Image
exhibits limitations in world knowledge, intent understanding, and complex reasoning."* That is the
honest cost of the 6B/16 GB deal.

---

## 3. Dimension 2 — Text rendering

### 3.0 Correction to two claims the corpus was carrying

| Claim | Verdict |
|---|---|
| *"Z beats Qwen on English multi-region **0.867 vs 0.829**"* | **Numbers correct, benchmark label wrong.** Those are **CVTG-2K average Word Accuracy** (0.8671 vs 0.8288), not LongText-Bench. On **LongText-Bench-EN the ranking reverses** — Qwen-Image **0.943** beats Z-Image **0.935**. Both facts sit in the *same* Z-Image paper (Tables 5 and 6). Do not conflate them. |
| *"FLUX.1 scores 0.005 on Chinese"* | **Correct.** LongText-Bench-**ZH** = 0.005 for FLUX.1 [dev]. Origin is **X-Omni** ([arXiv:2507.22058](https://arxiv.org/abs/2507.22058)), the paper that *introduced* LongText-Bench — not Qwen and not Z-Image, who both re-print X-Omni's rows verbatim. |

### 3.1 LongText-Bench (Text Accuracy, OCR = Qwen2.5-VL-7B, 160 prompts × 8 scenarios)

| Model | Open | EN | ZH | Published by | Label |
|---|---|---|---|---|---|
| Seedream 4.5 | ✗ | 0.989 | 0.987 | GLM-Image | `[TESTED]` |
| HiDream-O1-Image-Pro | ✓ | 0.982 | 0.980 | HiDream | `[OFFICIAL]` |
| Nano Banana 2.0 | ✗ | 0.981 | 0.949 | GLM-Image | `[TESTED]` |
| HiDream-O1-Image 8B | ✓ | 0.979 | 0.978 | HiDream | `[OFFICIAL]` |
| **FLUX.2 [dev] 32B** | ✓ | **0.963** | **0.757** | HiDream-O1 card | `[TESTED]` |
| Ovis-Image 7B | ✓ | 0.922 | 0.964 | Ovis | `[OFFICIAL]` |
| **Qwen-Image-2512** | ✓ | **0.956** | **0.965** | **GLM-Image** | `[TESTED]` |
| GPT Image 1 [High] | ✗ | 0.956 | **0.619** | X-Omni | `[TESTED]` |
| **GLM-Image 16B** | ✓ | 0.952 | **0.979** | Z.ai | `[OFFICIAL]` |
| **Qwen-Image 20B** | ✓ | 0.943 | 0.946 | Qwen / Z-Image / Ovis / GLM | `[OFFICIAL]` |
| **Z-Image 6B** | ✓ | 0.935 | 0.936 | Z-Image | `[OFFICIAL]` |
| Seedream 4.0 | ✗ | 0.921 | 0.926 | GLM-Image | `[TESTED]` |
| **Z-Image-Turbo 6B** | ✓ | 0.917 | 0.926 | Z-Image | `[OFFICIAL]` |
| Seedream 3.0 | ✗ | 0.896 | 0.878 | X-Omni | `[TESTED]` |
| **FLUX.2 [klein] 9B** | ✓ | 0.864 | **0.218** | ERNIE-Image | `[TESTED]` |
| **FLUX.1 [dev] 12B** | ✓ | **0.607** | **0.005** | X-Omni | `[TESTED]` |
| OmniGen2 | ✓ | 0.561 | 0.059 | X-Omni | `[TESTED]` |
| **HiDream-I1-Full 17B** | ✓ | 0.543 | 0.024 | X-Omni | `[TESTED]` |
| BAGEL | ✓ | 0.373 | 0.310 | X-Omni | `[TESTED]` |
| Janus-Pro | ✓ | 0.019 | 0.006 | X-Omni | `[TESTED]` |
| **SDXL, SD3.5, FLUX.1 schnell, FLUX.1 Krea, Krea 2, LongCat** | ✓ | — | — | — | **no evidence found** |

⚠️ **Two incompatible re-measurements exist and must not be mixed with the above.** Pruna AI ran
"LongTextBench" with a **word-accuracy** metric (FLUX.2 [flex] baseline 0.8681, [max] 0.8458,
[pruna.ai](https://www.pruna.ai/blog/flux2flex-3-faster)). FreeText ([arXiv:2601.00535](https://arxiv.org/abs/2601.00535))
reports it as **NED via PaddleOCR** (FLUX.1-dev 0.598, Qwen-Image 0.625). FLUX.1-dev 0.607 vs 0.598
is coincidence, not agreement.

### 3.2 CVTG-2K — multi-region English text (origin: TextCrafter, [arXiv:2503.23461](https://arxiv.org/html/2503.23461v5))

2,000 prompts, 2–5 text regions, avg 8.10 words / 39.47 chars per prompt.

| Model | 2 reg | 3 reg | 4 reg | 5 reg | **avg Word Acc** | NED | Label |
|---|---|---|---|---|---|---|---|
| HiDream-O1-Image-Pro | – | – | – | – | **0.9222** | 0.9628 | `[OFFICIAL]` |
| **Ovis-Image 7B** | 0.9248 | 0.9239 | 0.9180 | 0.9166 | **0.9200** | **0.9695** | `[OFFICIAL]` |
| **GLM-Image 16B** | – | – | – | – | **0.9116** | 0.9557 | `[OFFICIAL]` |
| Seedream 4.5 | – | – | – | – | 0.8990 | 0.9483 | `[TESTED]` |
| **FLUX.2 [dev] 32B** | – | – | – | – | 0.8926 | 0.9475 | `[TESTED]` |
| **Z-Image 6B** | 0.9006 | 0.8722 | 0.8652 | 0.8512 | **0.8671** | 0.9367 | `[OFFICIAL]` |
| **LongCat-Image 6B** | 0.9129 | 0.8737 | 0.8557 | 0.8310 | 0.8658 | 0.9361 | `[OFFICIAL]` |
| **Qwen-Image-2512** | – | – | – | – | 0.8604 | 0.9290 | `[TESTED]` |
| **Z-Image-Turbo 6B** | 0.8872 | 0.8662 | 0.8628 | 0.8347 | 0.8585 | 0.9281 | `[OFFICIAL]` |
| GPT Image 1 [High] | 0.8779 | 0.8659 | 0.8731 | 0.8218 | 0.8569 | 0.9478 | `[TESTED]` |
| **Qwen-Image 20B** | 0.8370 | 0.8364 | 0.8313 | 0.8158 | **0.8288** | 0.9116 | `[OFFICIAL]` |
| Nano Banana 2.0 | – | – | – | – | 0.7788 | 0.8754 | `[TESTED]` |
| HunyuanImage 3.0 | 0.8300 | 0.7635 | 0.7384 | 0.7279 | 0.7650 | 0.8765 | `[TESTED]` |
| **SD3.5 Large 8B** | 0.7293 | 0.6825 | 0.6574 | 0.5940 | **0.6548** | 0.8470 | `[TESTED]` |
| Seedream 3.0 | 0.6282 | 0.5962 | 0.6043 | 0.5610 | 0.5924 | 0.8537 | `[TESTED]` |
| **FLUX.1 [dev] 12B** | 0.6089 | 0.5531 | 0.4661 | 0.4316 | **0.4965** | 0.6879 | `[TESTED]` |
| AnyText | 0.0513 | 0.1739 | 0.1948 | 0.2249 | 0.1804 | 0.4675 | `[TESTED]` |

**Multi-region degradation — the best-quantified failure mode in this whole document.** Relative
word-accuracy loss going 2 → 5 regions:

| Model | drop |
|---|---|
| Ovis-Image | **−0.9%** |
| Qwen-Image | **−2.5%** |
| Z-Image | −5.5% |
| Z-Image-Turbo | −5.9% |
| GPT Image 1 [High] | −6.4% |
| LongCat-Image | −9.0% |
| SD3.5 Large | **−18.6%** |
| **FLUX.1 [dev]** | **−29.1%** |
| TextDiffuser-2 | −84.8% |

> **Teaching point: "how many separate text areas" is a stronger failure predictor than "how many
> characters" for FLUX-class models.** A student asking for a poster with four labels is asking the
> hard question, not the one asking for a long sign.

**CVTG-Hard** (400 prompts, ZH+EN, TextCrafter journal version, all own runs `[TESTED]`):
GLM-Image 0.8171 EN / 0.8610 ZH · LongCat 0.7991 / 0.6894 · Z-Image 0.7218 / 0.7125 ·
HunyuanImage 3.0 0.6719 / 0.5821 · Qwen-Image 0.6312 / 0.6526 · SD3.5 0.4623 / **0.0014** ·
**FLUX.1-dev 0.2427 / 0.0000**.

### 3.3 ChineseWord — the rare-character cliff

Tiers from the PRC standard character list: L1 = 3,500 chars, L2 = 3,000, L3 = 1,605. One character
per image.

**Qwen's own protocol** ([arXiv:2508.02324](https://arxiv.org/pdf/2508.02324) Tab.9):

| Model | L1 | L2 | L3 | Overall |
|---|---|---|---|---|
| Qwen-Image | **97.29** | **40.53** | **6.48** | 58.30 |
| GPT Image 1 [High] | 68.37 | 15.97 | 3.55 | 36.14 |
| Seedream 3.0 | 53.48 | 26.23 | 1.25 | 33.05 |

**LongCat's re-run** (8,105 prompts, **PPOCRv5** OCR, [arXiv:2512.07584](https://arxiv.org/pdf/2512.07584) Tab.7):

| Model | L1 | L2 | L3 | Overall |
|---|---|---|---|---|
| **LongCat-Image (6B)** | **98.7** | **90.8** | **70.3** | **90.7** |
| Seedream 4.0 | 94.8 | 41.2 | 2.3 | 58.5 |
| Qwen-Image | 92.5 | 37.1 | 6.1 | 56.6 |
| HunyuanImage 3.0 | 83.5 | 31.3 | 4.1 | 49.3 |

🔴 **The two tables disagree about Qwen-Image** (L1 97.29 vs 92.5, overall 58.30 vs 56.6). LongCat
switched OCR *because* *"existing MLLMs often struggle to recognize rare characters"*; Qwen never
stated its OCR. Qwen's own number is the higher one — the expected direction.

**LongCat-Image is the first model to break the L3 cliff** (70.3 vs everyone else's 2–6), at 6B. And
it is the only one with an honest self-caveat `[OFFICIAL]`: *"while exhibiting dominance in
single-character rendering, the model experiences a noticeable decline in stability when generating
multi-character sequences, primarily due to the insufficient scale of real-world textual training
data."*

**No ChineseWord numbers exist for SDXL, SD3.5, any FLUX, Z-Image, GLM-Image or HiDream.**

### 3.4 OneIG-Bench "Text" — widest open-model coverage

Verified identical across Z-Image Tab.7–8, Qwen Tab.5–6 and Ovis Tab.6–7.

`Z-Image-Turbo 0.994` · `Qwen-Image-2512 0.990` · `Z-Image 0.987` · `Ovis-Image 0.914` ·
`Qwen-Image 0.891` · `FLUX.2 klein 9B 0.866` · `GPT Image 1 0.857` · `HiDream-I1-Full 0.707` ·
`SD3.5 Large 0.629` · **`FLUX.1 [dev] 0.523`** · `Lumina-Image 2.0 0.106` · **`SDXL 0.029`** ·
`SD 1.5 0.010` · `Janus-Pro 0.001`.

ZH column: `Z-Image 0.988` · `Z-Image-Turbo 0.982` · `Ovis 0.961` · `Qwen-Image 0.963` ·
`GPT Image 1 0.650` · **`HiDream-I1-Full 0.205`** · `CogView4 0.193`.

**The open-weights English text ladder, in one line:**
`SDXL 0.03 → FLUX.1-dev 0.52 → SD3.5L 0.63 → HiDream-I1 0.71 → Qwen-Image 0.89 → Z-Image 0.99`.

### 3.5 The four text regimes — they do not correlate

| Regime | Best benchmark | Best local model | Worst notable | Key insight |
|---|---|---|---|---|
| **English SHORT** (a sign, a word) | OneIG-EN Text; UniGenBench++ EN-short | **Z-Image-Turbo 0.994** | SDXL 0.029 / 0.00 | Step-insensitive — the 8-step Turbo **beats** its own 50-step base |
| **English LONG / paragraph** | LongText-Bench-EN; STRICT | HiDream-O1 0.979 / **Qwen-2512 0.956** / GLM 0.952 | FLUX.1-dev 0.607; SD3.5 collapses 34.20 → 17.66 short→long | **Step count matters here**: Z-Image base 0.935 > Turbo 0.917 |
| **MULTI-REGION** (posters) | CVTG-2K by region count | Ovis 0.9200 / **GLM 0.9116** / Z-Image 0.8671 | **FLUX.1-dev −29.1%** from 2→5 regions | The *most discriminating* axis |
| **Chinese / CJK** | LongText-ZH; ChineseWord; CVTG-Hard-ZH | **LongCat 90.7** (rare chars) / **GLM 0.979** (long) | **FLUX.1-dev 0.005**; HiDream-I1 0.024; klein-9B 0.218 | The L3 cliff (97→41→6). Western families are at functional zero |

🔴 **UniGenBench++ and BizGenEval flatly disagree about FLUX.2 [dev].**
UniGenBench++ ([arXiv:2510.18701](https://arxiv.org/abs/2510.18701), Gemini-2.5-Pro judge)
EN-short Text: **FLUX.2 [dev] 85.34 — best open model**; GLM-Image 76.15; Qwen-Image 72.13;
Z-Image-Turbo 70.69; Z-Image 68.39; **HiDream-I1-Full 66.67 EN / 0.00 ZH**; LongCat 66.09;
klein Base 9B 59.48; FLUX.1 Krea 44.83; **klein 9B 42.82 EN / 1.44 ZH**; SD3.5-L 34.20;
FLUX.1-dev 32.18; **SDXL 0.00**.
BizGenEval ([arXiv:2603.25732](https://arxiv.org/abs/2603.25732), 26 models, Gemini-3-Flash judge,
κ=0.77 vs 59 humans) Text hard/easy: HunyuanImage 3.0 10.2/39.6 · Z-Image 2.8/45.0 ·
Qwen-2512 1.8/39.2 · **FLUX.2-dev 1.0/43.0** · GLM-Image 0.2/4.4 · LongCat 0.0/4.4 ·
**SD3.5-L, FLUX.1-Krea, FLUX.1-dev, FLUX.1-schnell all 0.0/0.0**. Verbatim: *"21 out of 26 evaluated
models score below 12.6 in both Text and Knowledge… Notably, **all open-source models fall into this
regime**."*

**Both are right.** BizGenEval tests dense multi-element commercial documents; UniGenBench++ tests
short strings. Teach the regime, not the score.

### 3.6 Text-rendering failure modes with actual evidence

- **Length.** **STRICT** (EMNLP 2025, [arXiv:2505.18985](https://arxiv.org/abs/2505.18985)) `[TESTED]`,
  5→5000 chars: *"Most diffusion models demonstrate a marked decline in performance as the input text
  length exceeds **approximately 200 characters**."* Distinct failure mode — **instruction
  abandonment, not misspelling**: *"when instructed to render a document stating 'Asia … is the
  largest continent…', some models, **especially Flux 1.1 pro, return an illustration of an Asian map
  instead of the text itself**."* Cross-lingual ordering EN > FR > ZH, attributed to *data volume,
  not glyph complexity*.
  ⚠️ **"FLUX text degrades past N words":** the only sourced number is *"After about 30 characters,
  accuracy dropped noticeably"* from [wavespeed.ai](https://wavespeed.ai/blog/posts/qwen-2512-vs-sdxl-flux-text-benchmark/)
  — 20 prompts, human rubric, no OCR, and it calls itself *"directional rather than absolute."*
  **A measured word-count-vs-accuracy curve for any FLUX: no evidence found.**
- **Small text is an attention-budget problem, and this is measured.** TextCrafter names three CVTG
  failure modes — **text confusion**, **text omission**, **text blurriness** (*"Small-scale text…
  receives insufficient attention"*). Their "Text Focus" attention-reweighting stage **alone** lifts
  FLUX word accuracy **0.4965 → 0.6351 (+28% relative)**; all three stages give **0.7370 (+48%)**.
  Corroborated by OCRGenBench naming *"insufficient encoding and decoding granularity of small text"*
  across 19 models.
- **Quantization.** **No published OCR-accuracy-vs-quant-level curve exists for FLUX.1, FLUX.2 or
  Qwen-Image — no evidence found.** Every "Q4 is where text breaks" claim traces to anecdote. The one
  real measured table is for Ideogram 4 ([arXiv:2606.12280](https://arxiv.org/html/2606.12280v1),
  n=63, EasyOCR NED, lower better): **GGUF Q4_K 0.62–0.73** · INT8 0.704 · FP8 0.715 · **NF4 0.760**.
  **At 4-bit the format matters more than the bit count — GGUF k-quants beat NF4/bnb at equal size.**
  8-bit is text-neutral.
- **Distillation.** klein Base 9B **59.48** vs klein 9B distilled **42.82** on UniGenBench++ EN text —
  **17 points**. Z-Image base beats Turbo on long and multi-region but *loses* on short. BFL confirms
  the mechanism `[OFFICIAL]`: FLUX.2 [flex]'s steps parameter is *"trading off typography accuracy and
  latency."* Why text specifically: GLM-Image and Krea 2 both state text legibility is an explicit
  **GRPO reward** — text accuracy is an RL-tuned property of the final checkpoint, exactly what a
  distillation pass erodes.
- **Prompt-side workarounds, ranked by evidence:**

| Workaround | Evidence | Strength |
|---|---|---|
| **Enclose the target text in quotation marks** | TextCrafter attention-map finding `[TESTED]`: *"the preceding quotation mark in the attention map corresponds to the visual text it governs."* GLM-Image README makes it a **hard requirement**; LongCat's README warns in all-caps that omitting it *"will severely compromise the text rendering capability"*; BFL and Qwen both list it first | **Strong — mechanistic + 4 independent vendors** |
| **Give an explicit layout / separate the regions** | TextCrafter ablation on FLUX.1-dev, CVTG-2K: 0.4965 → Region Insulation alone **0.6116** → Text Focus alone **0.6351** → all three **0.7370** | **Strong** |
| ⚠️ **LLM-generated bounding boxes** | TextCrafter: MLLM boxes *"frequently produce overlapping boxes that do not conform to the layout preferences inherent in Diffusion models"* | **Caution** |
| ⚠️ **"Enhance into a longer prompt"** | TIIF Text sub-score short→long: **SD3 collapses 59.83 → 20.83**; SANA 17.83→15.83 — while **FLUX.1-dev improves 43.83 → 52.83** and Qwen drops 92.76→89.14 | **Strong, and model-dependent — can halve text accuracy on SD3-class models** |
| **Generate high-res then downscale** | — | **no evidence found — folklore** |

---

## 4. Dimension 5 — Editing, multi-reference, identity

### 4.1 The roster

| Model | Org | Released | License | Params | Native refs |
|---|---|---|---|---|---|
| Qwen-Image-Edit-2511 | Alibaba | 2025-12-23 | **Apache-2.0** | 20B | multi (cap not stated) |
| Qwen-Image-Edit-2509 | Alibaba | 2025-09-22 | Apache-2.0 | 20B | 1–3 |
| **FireRed-Image-Edit-1.1** | **Xiaohongshu / RedNote** | 2026-03-02 | **Apache-2.0** | ~20B (Qwen-Image backbone, count undisclosed) | 1–3 native, "10+" via an Agent crop/stitch pipeline |
| FLUX.2 [dev] | BFL | 2025-11-22 | FLUX Non-Comm | 32B | ~6 recommended local |
| FLUX.2 [klein] 9B / 9B-KV | BFL | 2026-01-14 / 03-09 | FLUX Non-Comm | 9B | multi |
| **FLUX.2 [klein] 4B** | BFL | 2026-01-14 | **Apache-2.0** | 4B | multi |
| FLUX.1 Kontext [dev] | BFL | 2025-05-28 | FLUX Non-Comm | 12B | 1 |
| LongCat-Image-Edit / -Turbo | Meituan | 2025-12-05 / 2026-02-03 | Apache-2.0 | 6B | — |
| GLM-Image | Z.ai | 2026-01-08 | **MIT** | 9B AR + 7B DiT | multi |
| Step1X-Edit v1.2 | StepFun | 2025-11-26 | Apache-2.0 | 19B | 1 |
| HiDream-E1.1 | HiDream.ai | 2025-07-16 | MIT | — | 1 |
| **Z-Image-Edit** | Tongyi-MAI | **NEVER RELEASED** — still `*To be released*` in the model-zoo table | — | — | — |

**Z-Image-Edit confirmation `[OFFICIAL]`:** [github.com/Tongyi-MAI/Z-Image](https://github.com/Tongyi-MAI/Z-Image)
still lists Z-Image-Edit and Z-Image-Omni-Base as *"To be released"* after ~9 months. HF returns no
such repo. (The **official blog still carries the now-false claim** that Edit weights are "publicly
available" — cite the repo table, never the blog.)

### 4.2 Benchmarks — and the fact that the named ones are saturated

**CPI-Bench** ([arXiv:2608.14546](https://arxiv.org/abs/2608.14546), Alibaba Taobao/Tmall, 2026-08-14)
is the newest and, by its own measurement, best-correlated with human arena votes. *Italic = open.*

| Model | GEdit /10 | ImgEdit | REDEdit | CPI-General | CPI-Practical | CPI-Intelligent | **CPI-Overall** |
|---|---|---|---|---|---|---|---|
| GPT-Image-2 | 8.69 | 4.74 | 4.65 | 4.64 | 4.69 | 4.77 | **4.70** |
| Seedream5 Pro | 8.63 | 4.57 | 4.62 | 4.63 | 4.72 | 4.70 | 4.68 |
| Nano Banana Pro | 7.73 | 4.37 | 4.42 | 4.47 | 4.58 | 4.68 | 4.58 |
| Qwen Image 2.0 Pro | 8.52 | 4.45 | 4.38 | 4.38 | 4.39 | 3.79 | 4.19 |
| *FireRed-Image-Edit* | 7.94 | 4.56 | 4.26 | 3.76 | 3.89 | **2.65** | **3.43** |
| *Qwen-Image-Edit-2511* | 7.87 | 4.51 | 4.23 | 3.73 | 3.85 | 2.54 | **3.37** |
| *FLUX.2-klein-9B* | 8.12 | 4.32 | 4.07 | 3.78 | 3.86 | 2.48 | **3.37** |
| *FLUX.2-klein-4B* | 7.79 | 4.12 | 3.94 | 3.65 | 3.63 | 2.33 | 3.20 |
| *JoyAI-Image-Edit-Plus* | 7.54 | 4.02 | 3.87 | 3.32 | 3.50 | 2.07 | 2.96 |
| **variance across models** | **0.063** | **0.039** | 0.059 | 0.143 | 0.127 | **0.728** | 0.288 |

**That variance row is the point.** GEdit and ImgEdit discriminate **2–12× worse** than CPI's own
subsets. **If you are choosing a model on a 0.05 GEdit delta you are reading noise.** Paper's
conclusion, verbatim: *"only top-tier closed-source models consistently exceed a score of 4.0, whereas
open-source models generally plateau around 3.0… **the primary performance bottleneck distinguishing
open-source from closed-source models lies in their capability to handle multi-image consistency and
reasoning**."*

**arena.ai human Elo** `[TESTED, independent]` — Single Image Edit snapshot 2026-08-07, **28.8M
votes**; Multi Image Edit 2026-07-24, **8.3M votes**:

| Model | Single rank / Elo | Multi rank / Elo |
|---|---|---|
| gpt-image-2 (closed) | 1 / 1463 | 1 / 1454 |
| hunyuan-image-3.0-instruct | 19 / 1302 | absent |
| qwen-image-edit-2511 | 31 / **1235** | 29 / **1173** |
| flux-2-klein-9b | 35 / 1224 | **25 / 1213** |
| flux-2-dev | 36 / 1224 | 27 / 1202 |
| flux-2-klein-4b | 42 / 1188 | 30 / 1166 |
| flux-1-kontext-dev | 46 / 1149 | 40 / 1034 |
| bagel / step1x-edit | 51 / 1026, 52 / 998 | absent |

**Two things fall out.** (a) The best open model is **~160 Elo behind** the best proprietary one on
single-image editing. (b) **The ordering flips between tasks** — Qwen-2511 edges klein-9B on single
(1235 vs 1224) but klein-9B beats it by ~40 Elo on multi (1213 vs 1173). CPI-Bench reproduces the
flip with a VLM judge. **That cross-validated flip is the strongest editing finding in this document.**

**FireRed, LongCat-Image-Edit and JoyAI are not on the arena at all.** FireRed's "#1 open-source"
claim has never faced a human vote.

**GEdit-Bench** (FireRed's own table, `[OFFICIAL]`) EN G_O: FireRed **7.943** · Qwen-2511 7.877 ·
LongCat 7.748 · Qwen-2509 7.480 · **FLUX.2 [dev] 7.413**. ⚠️ Two defects: the Step1X-Edit-v1.2 row is
byte-identical to Qwen-2509 across all six columns (copy-paste error — use StepFun's own 7.58), and
Qwen-2509's EN G_O is reported as 7.54 / 7.480 / 7.56 by three labs. **Treat any sub-0.1 GEdit delta
across differently-sourced numbers as noise.**
**FLUX.1 Kontext's Chinese collapse is real and large:** CEdit-Bench-CN G_SC **1.11** (Pro) /
**1.25** (dev). Kontext effectively does not follow Chinese instructions.

**KRIS-Bench** (StepFun-run): Step1X-v1.2 thinking+reflection **60.93** · Qwen-2509 56.15 ·
FLUX.1 Kontext dev 49.54. No KRIS numbers for Qwen-2511, FireRed, LongCat or FLUX.2 — **no evidence
found.** **RISEBench, Complex-Edit, OmniContext for the 2026 cohort: no evidence found.**

**RISEBench** (reasoning-informed editing, [arXiv:2504.02826](https://arxiv.org/abs/2504.02826))
shows the open/closed gap most sharply: GPT-Image-1.5 **51.4** · Nano Banana Pro 48.3 ·
**Qwen-Image-Edit-2511 19.4** · BAGEL+CoT 15.8 · Qwen-2509 9.2 · **FLUX.1-Kontext-Dev 5.8** ·
HiDream-Edit **0.0**.

### 4.3 Identity preservation — the field's biggest measurement hole

**There is no ArcFace-style face-similarity number for any 2026 instruction-edit model.** Every tech
report in the cohort uses VLM-judge scores. Notably, FireRed devotes §3.7 to a face-recognition-
embedding identity loss and then reports **zero** face-similarity metrics validating it, and runs no
ablations.

What exists — **REDEdit "Portrait"** (VLM judge 1–5, FireRed's own bench):
Nano-Banana-Pro 4.82 · Seedream4.0 4.77 · **FireRed 4.50** · LongCat 4.47 · **FLUX.2 [dev] 4.44** ·
**Qwen-2511 4.42** · Qwen-2509 4.30. **FireRed loses to every proprietary model on Portrait** despite
the "open-source SOTA in character identity preservation" marketing.
**REDEdit "Consistency"** (unedited-region preservation, 0–10): Nano-Banana-Pro 9.53 · **FireRed
9.51** · Qwen-2511 9.27 · LongCat 8.50 · FLUX.2 dev 8.33.

The only real face-embedding cosine anywhere is **XVerseBench ID-Sim** from the UMO paper
([arXiv:2509.06818](https://arxiv.org/html/2509.06818v1)) — but it measures identity *insertion into a
new scene*, not *preservation across an instruction edit*, and covers Sept-2025 models only. Its
qualitative finding generalizes and is worth teaching: all one-to-one mapping methods suffer
**identity confusion that worsens as reference count rises** — *"reference identities missing,
mismatching hair, wrongly assigned clothes."*

`[SYNTHESIS]` **Best local model for holding a face across an edit: FireRed-Image-Edit-1.1**, on
REDEdit Portrait 4.50 + Consistency 9.51 + an explicit face-embedding training loss. But that rests
**entirely** on the vendor's own benchmark, FireRed has never been human-voted, and the benchmarked
version is 1.0 not 1.1. **Label this weakly supported and tell students to A/B it against
Qwen-Edit-2511 themselves.**

### 4.4 Multi-image reference — the marketing inverts the ranking

| Model | Claimed | Measured |
|---|---|---|
| **FLUX.2 [klein] 9B** | multi, uncapped, *not marketed on this* | **Best open: arena multi #25 / 1213; CPI multi 3.38** |
| FLUX.2 [dev] | ~6 local / 8 API / 10 playground | arena multi #27 / 1202 |
| Qwen-Edit-2511 | *"high-fidelity fusion of two person images"* | arena 1173; **CPI Multi-Image Compose 2.75 — worst open model in that column** |
| **FireRed-1.1** | **"10+ elements"** | **CPI multi overall 3.11, Compose 2.58 — lowest of any open model**; not on arena |

**FireRed's "10+ elements" is a *pipeline* claim, not a model capability** — an Agent module that
calls Gemini for ROI detection, crops, and stitches inputs into 2–3 composite ~1024² images before
they reach the DiT. It scores worst on composition.

`[OFFICIAL]` **FLUX.2's cap is a pixel budget, not an image count**: *"at 1MP output you can use up to
8 reference images, at 2MP output up to 7."* Lowering output resolution buys reference slots.

### 4.5 Editing failure modes — verbatim

- **"Image drift" — named by the vendor in the successor's release notes.** `[OFFICIAL]`
  [Qwen-Image-Edit-2511](https://huggingface.co/Qwen/Qwen-Image-Edit-2511): *"Key enhancements…
  include: **mitigate image drift**, improved character consistency…"* The 2509 card never uses the word.
- **Pixel shift / zoom, open and unanswered.** `[TESTED]` [QwenLM/Qwen-Image#229](https://github.com/QwenLM/Qwen-Image/issues/229)
  (opened 2025-12-07, still open, **zero maintainer replies**): *"there is some **non-uniform pixel
  shift (a slight 'zoom effect')**… I still do not always get 'pixel-perfect' results."*
- **Colour/brightness shift is caused by the speed LoRA, not the base model.** `[TESTED]`
  [LightX2V-Qwen-Image-Lightning#83](https://github.com/ModelTC/LightX2V-Qwen-Image-Lightning/issues/83):
  the distilled 2511 shows *"noticeable brightness and color shift"* on an explicit no-op prompt.
  **Actionable: if you see global colour drift on Qwen-Edit, suspect your Lightning LoRA first.**
- **Preservation is a function of your inference stack, not just your checkpoint.** `[TESTED]`
  [huggingface/diffusers#12216](https://github.com/huggingface/diffusers/issues/12216), same weights /
  params / seed: *"The results I get with diffusers are **noticeably inferior compared to ComfyUI**
  especially in terms of preservation of the details."*
- **VAE-induced small-detail loss.** `[OFFICIAL]` Boogu-Image-0.1-Edit card: *"Because we use the
  open-source FLUX.1 VAE, reconstruction loss is relatively large, so details such as **small faces,
  small limbs, eyes, and text may still show artifacts**"* and *"results are more stable at 1K"*
  despite 2K support.
- **No pixel-level metric (PSNR/SSIM/LPIPS on unedited regions) is published for any model in this
  cohort.** Every "background preservation" number is a VLM judge score. **No evidence found** for
  multi-turn VAE round-trip degradation either.

---

## 5. Dimension 3 — Human rendering, skin, the "AI look", hands

### 5.1 Who claims to fight it, and what the mechanism is `[OFFICIAL]`

**FLUX.1 Krea [dev] — the origin of the framing.**
[krea.ai/blog/flux-krea-open-source-release](https://www.krea.ai/blog/flux-krea-open-source-release):
> *"a clear trend when working with AI generated images is their unique look: **overly-blurry
> backgrounds, waxy skin textures, boring composition**… Together, these problems constitute what is
> now known as the 'AI look'."*
> *"Our goal from the beginning was simple: **'Make AI images that don't look AI.'**"*
> *"we find that **LAION Aesthetics**… to be **highly biased towards depicting women, blurry
> backgrounds, overly soft textures, and bright images**… relying on these models… **adds implicit
> biases to the model's priors**."*

⚠️ **The field's most-cited anti-AI-look claim cites a paper that does not support it.** That blog
hyperlinks "AI look" to [arXiv:2506.15742](https://arxiv.org/abs/2506.15742) — which is *"FLUX.1
Kontext: Flow Matching for In-Context Image Generation and Editing"*, containing no definition or
measurement of "AI look". **Treat "AI look" as a vendor/community term with no academic definition.**

**Krea 2 — the strongest data-side claim.** [Technical report](https://www.krea.ai/blog/krea-2-technical-report):
> *"**Importantly, we use no AI-generated images in our pretraining mix.**… even a small proportion of
> AI-generated images introduces biases into the model's output distribution… We therefore designed
> in-house classifiers to filter such images out."*
> *"these quality scores are used **only to drop images of extremely poor quality, not to oversample**
> images on the basis of their scores."*
> *"such methods may classify a blurry image as low quality, even though **motion blur or softness can
> be a deliberate artistic choice**."*

Note this is a **reversal of FLUX.1 Krea's own recipe**, which explicitly *did* use synthetic data
(*"we also incorporate high quality synthetic samples from Krea-1 during SFT"*). Krea 2 filters
synthetic at **pretraining**; SFT/RL still use curated aesthetic rewards.

**Qwen-Image-2512 — the most literal claim, and the most operationally useful artifact in this
document.** [HF card](https://huggingface.co/Qwen/Qwen-Image-2512):
> *"**Enhanced Human Realism** — Qwen-Image-2512 **significantly reduces the "AI-generated" look**…"*
> *"The original Qwen-Image struggles to accurately render aged facial features (e.g., wrinkles),
> resulting in an **artificial "AI look"**."*

Its ship-with-the-model official negative prompt, verbatim:
```
低分辨率，低画质，肢体畸形，手指畸形，画面过饱和，蜡像感，人脸无细节，过度光滑，画面具有AI感。构图混乱。文字模糊，扭曲。
```
Gloss: *low resolution, low quality, deformed limbs, **deformed fingers**, oversaturated, **waxwork
feel (蜡像感)**, faces without detail, **excessively smooth**, image **has an AI feel (AI感)**.
Chaotic composition. Blurry, distorted text.*

This is a vendor-endorsed negative that names waxiness, over-smoothing, detail-less faces and deformed
fingers as the specific failure set. ⚠️ It is **Chinese-language** — the English translation is not
the tested string.

**Z-Image — no marketing claim, but a stronger mechanism.** Tech report, verbatim:
> *"our reward model is designed to evaluate the model's performance along three key dimensions:
> instruction-following capability, **AI-Content Detection perception**, and aesthetic quality."*

**The only case found of a shipped local model optimizing against an AI-detector signal.** Scores for
that axis are unpublished.

**FLUX.2 — no anti-AI-look claim at all.** The launch post's photorealism claim is purely additive
(*"Greater detail, sharper textures, and more stable lighting"*). No mention of waxiness, skin, or
aesthetic-score bias. **And FLUX.2 has no negative prompt**, so the Qwen-style anti-waxy negative is
structurally unavailable; BFL's workaround is *"Instead of 'no blur,' say 'sharp focus throughout.'"*

**Juggernaut Z** (RunDiffusion, Apr 2026, a **Z-Image Base** fine-tune, CC BY-NC 4.0) makes vendor
claims on exactly these axes: *"more refined skin texture"*, *"Cleaner portraits with more natural
skin texture"*, *"Improved anatomy and structural integrity"*, *"**Better representation across
ethnicities by default**"*. No measurements, comparison figures only.

### 5.2 Is there measured evidence? **Essentially no. This is the biggest hole in the field.**

**No evidence found**, verified by direct source-checking rather than inference:
- Any benchmark with a **skin, waxiness, or "AI-look" axis**.
- Any **human-preference study on portraits** comparing FLUX.1 Krea / Krea 2 / Z-Image / Qwen-2512.
- "FaceBench" as a T2I generation benchmark ranking generators on face quality — **does not exist**.
- Any **quantitative facial-diversity study** (face-embedding diversity across seeds) for the
  "FLUX chin" / "same face" problem. Nearest work — *GRADE: Quantifying Sample Diversity in
  Text-to-Image Models* — is neither face-specific nor applied to 2026 models.
- Any deepfake-detection paper that ranks **generators** by human photorealism. That literature
  measures *detector* accuracy and predates FLUX.2 / Z-Image / Krea 2.

**The closest measured thing that exists** is HPSv3 ([arXiv:2508.03789](https://arxiv.org/abs/2508.03789),
1.08M pairs), which has a **"Characters"** column but no photo/skin column and is frozen at Aug-2025
models: Kolors 10.55 / **11.79 chars** · FLUX.1-dev 10.43 / 11.70 · Playground v2.5 10.27 / 11.07 ·
CogView4 9.61 / 10.72 · **SDXL 8.20 / 8.67** · SD3 Medium 5.31 / 6.70. No Qwen-Image, no Z-Image, no
FLUX.2, no Krea 2. And Krea's critique applies recursively — HPSv3 is exactly the class of preference
model Krea says causes AI-look regression when optimized against.

**The one indirect measured signal for "same face":** OneIG's per-category Diversity shows the
**Text&Portrait column is the lowest-diversity category for every modern model** — FLUX.1-dev
**0.190** vs its own 0.243 natural-prompt score, and vs SD1.5's 0.381. **Portraits are where modern
models collapse hardest**, and FLUX.1-dev collapses ~2× harder there than SD1.5. §6.2.

> `[SYNTHESIS]` **Teaching line: "which model has better skin" is currently unanswerable from public
> evidence.** Anything you say about it is `[LORE]` unless the student generates and rates it
> themselves. That is a genuinely useful thing to tell a class.

**Behavioural proxy `[LORE]`** (platform telemetry, not opinion — forums were not reachable this
pass). HF trending T2I, Aug 2026: `nvidia/Qwen-Image-Flash` · **`krea/Krea-2-Turbo`** · FLUX.1-dev ·
**`krea/Krea-2-Raw`** · **`RudySen/Krea2-realism-V2`** · `ponpoke/flux2-klein-9b-uncensored-text-encoder`.
30-day downloads: Z-Image-Turbo **1.16M** · FLUX.1-dev 553K · Qwen-Image-Lightning 428K ·
Krea-2-Turbo 183K · **Juggernaut-XL-v9 162K** · **RealVisXL_V5.0 195K**.

The sharpest signal is **what the Krea 2 LoRA ecology is *for***: `RudySen/Krea2-realism-V2` (24K dl),
`gokaygokay/Krea-2-Realism-LoRA` (18K dl), and — pointedly — **`inlineresearch/skin-lora-krea-2-raw`,
tagged `skin-texture, portrait, realism`**. A *skin* LoRA for the model that markets itself on not
having waxy skin is the clearest available community verdict.

**Second signal: the SDXL photoreal brands left SDXL.** Juggernaut → **Z-Image** (`RunDiffusion/Juggernaut-Z-Image`,
Apr 2026). RealVis's author (SG161222) appears on **Chroma**. **LUSTIFY**, Civitai's #1 most-downloaded
checkpoint of the past month, went `SDXL 1.0 → v10 (Krea 2)`. **bigASP** went SDXL → **FLUX.2-klein-9B**.

`[LORE, low confidence]` My read of the photoreal-human ordering, Aug 2026:
**Krea 2 ≈ Z-Image / Juggernaut Z > Qwen-Image-2512 > FLUX.2 [dev] > Chroma1-HD > SDXL photoreal
finetunes.** SDXL finetunes retain six-figure monthly downloads — plausibly for VRAM, ControlNet/
IP-Adapter maturity and NSFW, not peak skin quality.

### 5.3 Hands and anatomy — **no benchmark exists. At all.**

Searched systematically. **`HandCraft`, `AnatomyBench`, `MalformedBench`, "Adversarial Hand" — none
check out as T2I evaluation benchmarks. `Hand1000` did not surface as a ranking benchmark.** Every
hand paper in the literature is **corrective/generative**, not evaluative: HandRefiner, HanDrawer,
FoundHand, AttentionHand, InterHandGen, Affordance Diffusion.

The only quantitative traces of hand quality in shipped artifacts are **prompt-level**:
Qwen-2512 still ships `肢体畸形，手指畸形` in its official negative, i.e. **Qwen still expects hand
failure and ships a mitigation.**

**Krea's mechanism claim is load-bearing and worth teaching** `[OFFICIAL]`:
> *"Many image generation workflows use negative prompts like 'too many fingers, deformed faces,
> blurry, oversaturated' to improve image quality. For the negative prompt to steer the model away
> from undesirable parts of the data distribution, **it must first have learned what these undesirable
> parts look like**."*

`[SYNTHESIS]` This predicts something checkable: **models trained only on clean data, and models run
at CFG ≈ 0–1, have no hand-repair lever.** That covers FLUX.2 (no negatives at all), Z-Image-Turbo
(guidance 0.0), Krea 2 Turbo (CFG 0.0/1.0), and every Lightning/Turbo LoRA stack. Models with working
negatives — Z-Image base, Krea 2 Raw, Qwen-Image, SDXL — do. **This is the strongest available reason
to keep a CFG-capable checkpoint in the toolkit.**

---

## 6. Dimension 4 — Style range

### 6.1 Anime — **Illustrious is still king, and the challenger requires abandoning tags**

`[LORE, platform data]` Civitai API, anime checkpoints, most-downloaded of the past month: the
top-ranked entries are **PerfectDeliberate** and **One obsession**, and **every current version of
both is `"baseModel":"Illustrious"`** (older versions trail back to SD 1.5 and NoobAI). **No FLUX-,
Qwen- or Z-Image-based model appears in the anime top ranks.**

HF 30-day downloads across the SDXL-anime stack: `cagliostrolab/animagine-xl-4.0` **201K** ·
`LyliaEngine/Pony_Diffusion_V6_XL` **179K** · `novaAnimeXL_ilV140` 176K · `nova-furry-xl-il-v120` 158K ·
`amanatsu-illustrious-v11` 153K · WAI-NSFW-illustrious variants ~150K combined ·
`Laxhar/noobai-XL-1.1` 95K · `janku-v5-nsfw-noobai-rouwei-illustrious` 92K ·
`Illustrious-xl-early-release-v0` 78K · `hassaku-xl-illustrious-v31` 59K · `noobai-XL-Vpred-1.0` 51K.

⚠️ **Animagine XL 4.0 out-downloads the Illustrious base repo on HF, but Civitai — where anime users
actually live — is Illustrious-dominated.** HF numbers are distorted by mirroring (`John6666/*`).
**Illustrious tops out at XL v2.0 (Apr 2025)**; `OnomaAIResearch` has published nothing newer, and its
non-SDXL bet (`Illustrious-Lumina-v0.03`, 48 likes) appears abandoned. Community is *still* quantizing
Illustrious in mid-2026 (`offgrid-ai/illustrious-xl-v2.0-GGUF`, Jun 2026).

**The first credible challenger: `SeeSee21/Z-Anime`** (Apr 2026) — **478 likes**, the highest-liked
Z-Image derivative found. *"a full fine-tune of Alibaba's Z-Image Base architecture — not a LoRA
merge."* Ships Base + Distill-8-step + Distill-4-step + GGUF, **8 GB VRAM**. Claims *"Rich anime
aesthetics with strong style diversity"*, *"High diversity across characters, poses, compositions"*.
**Critical prompting difference: natural language, not booru tags** — the card explicitly marks
`"A young anime girl with long silver hair and golden eyes, wearing a traditional shrine maiden
outfit…"` ✅ and `"anime girl, silver hair, shrine maiden, bamboo, cherry blossom, warm light"` ❌.
Base 28–50 steps / CFG 3–5 / `euler_ancestral`+`beta`, negatives fully effective; distills at CFG 1.0
with *"limited effect"* negatives. **Downloads ~1.2K/mo vs Illustrious's six figures — high
enthusiasm, low adoption.**

Also in the frame: **NetaYume-Lumina-Image-2.0** (19.7K/mo, on Lumina-Image-2.0) and **Chroma**
(lodestone, 8.9B, FLUX.1-**schnell**-derived, **Apache 2.0**, ~313K/mo across variants) — Chroma is
positioned as a **base for finetuning**, not an anime model: *"Chroma1 is intentionally designed to be
an excellent starting point for finetuning."* Its tech report is still *"forthcoming"* as of Aug 2026.

> ⚠️ **Conflict with the corpus.** This pass found **no evidence of Pony V7 on HF or Civitai**, while
> `image-catch-up.md` §1.5 documented `purplesmartai/pony-v7-base` (AuraFlow) with verbatim card
> quotes. **The corpus is right — V7 shipped.** This pass simply couldn't reach the repo (search
> exhausted, Civitai partial). What both agree on: **V6 (SDXL) is what people actually run** —
> ~179K/mo — and V7's own card concedes score tags degraded.

`[SYNTHESIS]` **Anime verdict, Aug 2026: Illustrious/NoobAI-XL remains the practical king** — tag
vocabulary, character-LoRA coverage, ControlNet maturity, NSFW. **Z-Anime is the first plausible
successor** but it costs you the booru-tag dialect. Animagine XL 4.0 is the SFW-leaning alternative.

### 6.2 Style diversity and the mode-collapse story — measured `[TESTED]`

Full OneIG-Bench leaderboard arrays (extracted from
[the site source](https://raw.githubusercontent.com/OneIG-Bench/oneig-bench.github.io/main/index.html);
⚠️ **last updated 2025-09-19 — no Z-Image, FLUX.2, Krea 2 or Ideogram 4**):

| Model | Align | Text | Reason | **Style** | **Diversity** |
|---|---|---|---|---|---|
| Seedream 4.0 | 0.894 | 0.981 | 0.352 | 0.458 | 0.197 |
| **Qwen-Image** | 0.882 | 0.891 | 0.306 | **0.418** | **0.179** |
| Nano Banana | 0.878 | 0.894 | 0.346 | 0.450 | 0.182 |
| Step-3o Vision | 0.867 | 0.811 | 0.328 | 0.391 | **0.108** |
| **GPT Image 1** | 0.851 | 0.857 | 0.345 | **0.462** | 0.151 |
| HiDream-I1-Full | 0.829 | 0.707 | 0.317 | 0.347 | 0.186 |
| Kolors 2.0 | 0.820 | 0.427 | 0.262 | 0.360 | **0.300** |
| Lumina-Image 2.0 | 0.819 | 0.106 | 0.270 | 0.354 | 0.216 |
| Ovis-U1-3B | 0.816 | 0.034 | 0.226 | **0.443** | 0.191 |
| Recraft V3 | 0.810 | 0.795 | 0.323 | 0.378 | 0.205 |
| SD 3.5 Large | 0.809 | 0.629 | 0.294 | 0.353 | 0.225 |
| **FLUX.1-dev** | 0.786 | 0.523 | 0.253 | **0.368** | **0.238** |
| CogView4 | 0.786 | 0.641 | 0.246 | 0.353 | 0.205 |
| SANA-1.5 4.8B | 0.765 | 0.069 | 0.217 | 0.401 | 0.216 |
| **SDXL** | 0.688 | 0.029 | 0.237 | **0.332** | **0.296** |
| **SD 1.5** | 0.565 | 0.010 | 0.207 | **0.383** | **0.429** |
| Janus-Pro | 0.553 | 0.001 | 0.139 | 0.276 | 0.365 |

Z-Image's own reported OneIG (from its tech report, `[OFFICIAL]`, **not on the public leaderboard**):
EN Align 0.881 / Text 0.987 / Reason 0.280 / **Style 0.387** / **Diversity 0.194** / Overall 0.546;
Turbo Style 0.368 / Diversity 0.139 / Overall 0.528.

**The diversity story, verified.** SD 1.5 (0.429) > Janus-Pro (0.365) > Kolors 2.0 (0.300) >
SDXL (0.296) > Seedream 3.0 (0.277) > FLUX.1-dev (0.238) > SD3.5L (0.225) > **Qwen-Image (0.179)** >
GPT-4o (0.151) > Step-3o (0.108). **The correlation with recency is close to monotonic and negative.**

Three compounding causes, all now stated by vendors themselves:
1. **Weak prompt adherence *looks like* diversity.** SD1.5 scores 0.565 Alignment vs Seedream 4.0's
   0.894 — much of SD1.5's "diversity" is it not doing what you asked. **The metric cannot distinguish
   creative variance from incompetence.** Never quote a diversity ranking without the alignment column.
2. **Post-training is deliberate mode collapse.** Krea: *"Pre-training is all about mode coverage,
   post-training is all about mode collapsing."* Z-Image: SFT shifts *"from a diversity-maximizing
   regime to a quality-maximizing operating point."*
3. **Few-step distillation collapses further.** Z-Image's own Model Zoo table rates
   **Turbo Diversity "Low" / Z-Image "Medium" / Omni-Base "High"**; DMD *"'collapse[s]' its
   probabilistic path into a deterministic… process."* Every Lightning/Turbo/Flash/klein-distilled
   variant inherits this.

**Practical rule this supports:** *variety → use the pre-SFT / non-distilled checkpoint (Z-Image base,
Krea 2 Raw, klein Base, Chroma1-Base). Reliability → use the distilled one.* And note the corollary
already in the corpus (`image-catch-up.md` §2.3, §3.2): **long fully-specified prompts also kill seed
diversity** — the same mechanism from the prompt side.

**Style per-category** (Traditional / Media / Anime): `Seedream 3.0 0.383/0.365/**0.524**` (highest
Anime of any model) · `Nano Banana 0.439/0.419/0.503` · `Ovis-U1 0.456/0.372/0.490` ·
`GPT-4o 0.532/0.404/0.411` · `FLUX.1-dev 0.367/0.298/0.391` · **`SD1.5 0.483/0.298/0.349`** ·
`SDXL 0.316/0.307/0.339` · **`Recraft V3 0.418/0.347/0.332` (lowest Anime)**.
Note **SD1.5's *Traditional* style score (0.483) beats every open model and most closed ones** —
consistent with the "old models had wider stylistic range" thesis.

### 6.3 Graphic design, typography, layout — **Ideogram open-weighted, and this changes the answer**

**Ideogram 4** — [huggingface.co/ideogram-ai/ideogram-4-fp8](https://huggingface.co/ideogram-ai/ideogram-4-fp8),
**released 2026-06-03**, 9.3B, fp8 + nf4, gated, **Ideogram 4 Non-Commercial license**. 722 likes,
46K downloads/mo. `[OFFICIAL]`:
> *"**Ideogram 4 is Ideogram's first open weight text-to-image model.** It is a state-of-the-art
> foundation model **trained from scratch** — not a fine-tune of any existing model."*
> *"At 9.3B parameters, Ideogram 4 delivers **the best text rendering of any open-weight release we
> benchmarked — ahead of much larger models like Qwen-Image (20B), FLUX.2 [dev] (32B), and
> HunyuanImage 3.0 (80B MoE)**."*
> *"On layout control (**7Bench**), it is **significantly better than all closed-source models**."*

Third-party evidence (vendor-selected but externally run) — the **ContraLabs blind typography eval
judged by ten professional designers** is the only human-designer study found anywhere in this pass:

| Model | First-place win rate | *"Would you use this in real client work?"* /5 |
|---|---|---|
| **Ideogram 4** | **47.9%** | **3.55** |
| Gemini 3.1 Flash Image / Nano Banana 2 | 30.0% | 2.84 |
| Grok Imagine 1.0 | 15.0% | 2.61 |
| **FLUX.2 [max]** | **15.5%** | **2.49 — worst of four** |

⚠️ **That FLUX.2 [max] result is a genuinely notable third-party datapoint against FLUX for design
work**, and it is the only one that exists.

**Operational facts that matter:** single-stream 34-layer DiT; **Qwen3-VL-8B-Instruct** text encoder
with hidden states from **13 intermediate layers** concatenated; native any-resolution 256–2048,
aspect to 6:1; and the big one — *"**trained exclusively on structured JSON captions**. Plain-text
prompts still work, but won't perform as well."* Supports `colour_palette` hex arrays, `bbox` layout
coordinates, `compositional_deconstruction`. Safety screening via **Hive** keys in the reference CLI.

**FLUX.2's hex-colour capability** `[OFFICIAL]`, [docs.bfl.ai](https://docs.bfl.ai/guides/prompting_guide_flux2):
> *"FLUX.2 supports precise color matching using hex codes. Useful for brand consistency and design
> work."* ⚠️ *"Hex codes work best when **clearly associated with specific objects**… 'The car is
> #FF0000' works better than 'use red #FF0000 in the image.'"*

⚠️ **Keep the corpus's existing caveat** (`image-catch-up.md` §2.8): the only *measured* hex numbers
in the literature are FLUX.1-era and catastrophic (**GenColorBench/NumColor: FLUX 13.82% at ISCC-L1,
5.86% at CSS3/X11**). **No independent ΔE-measured test of FLUX.2 hex adherence exists.** Do not
repeat "exact color matching" as established fact.

**Qwen-Image's infographic capability** is demonstrated rather than benchmarked (a PPT roadmap slide,
a two-column industrial infographic, a 3×4 educational poster, all from long Chinese prompts). Its
OneIG Text 0.891 EN / 0.963 ZH is the best hard number any *local* model has. Note **Qwen-Image
already beats Recraft V3 on OneIG text (0.891 vs 0.795)**, and Recraft has the lowest Anime style
score of any closed model — i.e. Recraft is a narrow design specialist, not a general ceiling.

`[LORE, low confidence]` **Best local model for graphic design, Aug 2026: Ideogram 4** for typography,
layout, logo and poster (caveats: non-commercial, gated, effectively JSON-only). **Qwen-Image-2512**
for infographics and Chinese text. **FLUX.2 [dev]** when you need brand hex codes *and* multi-reference
product consistency in the same model. **Flat vector / logo specifically: no benchmark exists.**

### 6.4 NSFW / uncensored — a practical routing axis, reported neutrally

**Heavily filtered, with disclosed pre-training + post-training + inference filters** `[OFFICIAL]`:
- **FLUX.2 [dev]** and **FLUX.2 [klein] 9B** — *"We filtered pre-training data for multiple categories
  of 'not safe for work' (NSFW) and known child sexual abuse material (CSAM)"*; *"By inhibiting certain
  behaviors and suppressing certain concepts in the trained model"*; and a licence obligation:
  *"**Filters or manual review must be used**… **We may approach known deployers at random to verify
  that filters or manual review processes are in place.**"* Final eval used n≈2,800 prompts. Pixel
  watermarking + C2PA. **klein 4B is Apache 2.0; klein 9B and dev are not.**
- **Krea 2** — *"the release checkpoints demonstrated high resilience against violative inputs"*, plus:
  *"**deployers are required to implement content filtering measures**… Deployers who fail to implement
  required safeguards are in breach of the license."* Krea also *"reserves the right to update model
  weights or revoke access."*
- **Ideogram 4** — Hive text + visual moderation wired into the reference CLI.
- **Qwen-Image / Z-Image** — Apache 2.0, and their model cards contain **no NSFW filtering disclosure
  at all** (unusual for 2026). Practically: not aggressively censored, not trained for it either.

**Permissive by design:** **Chroma1-HD / Base / Flash / Radiance** (Apache 2.0), explicitly:
*"The model is released in a state as is and **has not been aligned with a specific safety filter**."*
Plus the whole SDXL family (Pony V6, Illustrious/NoobAI, WAI, janku, hassaku, nova-furry, bigASP v2).

**The 2026 shift `[LORE]`:** the uncensored community moved onto **FLUX.2 [klein] 9B and Krea 2
despite both being filtered.** `fancyfeast/bigasp-3` is now *"a Flux 2 Klein 9B model"* (v2/v2.5 were
SDXL). **`ponpoke/flux2-klein-9b-uncensored-text-encoder`** — 405 likes, 33K downloads/mo, tagged
`uncensored, abliterated` — is an **abliterated Qwen3 text encoder** as a drop-in for klein. That is
the mechanism: strip refusal from the text encoder rather than retrain the DiT. **LUSTIFY** shipped
`v10 (Krea 2)` after nine SDXL versions.

`[SYNTHESIS]` **Routing implication:** if a workflow must not be blocked or revoked, **Chroma1-HD
(Apache 2.0, unaligned) or SDXL/Illustrious/Pony** are the only bases whose *licences* impose no
filtering duty. FLUX.2-klein and Krea 2 are technically finetunable and the community has done so, but
**both licences obligate deployers to run filters**, and Krea reserves revocation. That is a
deployment risk, not just a moral one.

---

## 7. Dimension 6 — Control ecosystem (ControlNet, pose, depth, adapters, trainers)

### 7.1 Master matrix

✅ production-grade · 🟡 partial/beta/indirect · ❌ no evidence found

| | SDXL | SD3.5-L | FLUX.1 dev | HiDream-I1 | Qwen-Image | Z-Image | FLUX.2 dev | FLUX.2 klein | Krea 2 | LongCat | GLM-Image |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Official CN from own lab** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Canny | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Depth | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **OpenPose** | ✅ | ❌ | 🟡 union only | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Tile / upscale | ✅ | 🟡 "blur" | ✅ | ❌ | 🟡 | ✅ | 🟡 | 🟡 | ❌ | ❌ | ❌ |
| Softedge / lineart | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | 🟡 | ❌ | ❌ |
| **Inpaint** | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ | 🟡 | ✅ | 🟡 | 🟡 | 🟡 |
| Normal map | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Segmentation | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Union / multi-control | ✅ | ❌ | ✅ | ❌ | ✅ ×2 | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **IP-Adapter proper** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### 7.2 Corrections to two things the corpus asserts

**"Krea 2 has no ControlNet ecosystem as of Aug 2026" — REFUTED, but it expired in July, it wasn't
wrong when written.** Three community control-LoRAs with confirmed weight files now exist:

| Repo | Type | Created | Likes/DL |
|---|---|---|---|
| `Patil/Krea-2-depth-controlnet` | Depth control-LoRA (rank-64 + expanded input proj, all 28 blocks), 862 MB | **2026-07-03** | 136 |
| `thedeoxen/Krea-2-pose-controlnet` | OpenPose/DWPose control-LoRA + ComfyUI workflow | **2026-08-04** | 39 / 292 |
| `tori29umai/krea2-controlnet` | `krea2-anythng` silhouette/composition, rank 64, 106,786 pairs, 7k steps | **2026-08-06** | 9 |

Plus three ComfyUI node repos and live HF Spaces. **The defensible version of the claim now is:**
*Krea has released no official ControlNet; the community stack is 2–7 weeks old, is entirely
control-LoRAs (latent-concat, rank-64, the FLUX.1-Depth-dev-lora recipe) rather than true
copied-block ControlNets, has no union model, and lacks canny, tile, lineart, normal and seg.*
Meanwhile Krea 2's **LoRA** ecosystem is far ahead of its control ecosystem — 8 official style LoRAs,
`ostris/krea2_turbo_training_adapter` at 19.2K dl, and musubi-tuner + DiffSynth both landing Krea 2
training on **2026-06-24, six days after weights dropped**.

**Qwen-Image and Z-Image both have mature ControlNet stacks — this is the answer to the corpus's two
open questions.**

- **Qwen-Image — the deepest new-gen stack.** `InstantX/Qwen-Image-ControlNet-Union` (canny, soft
  edge, depth, pose; 120 likes / 5.1K dl) · `InstantX/…-Inpainting` · three `DiffSynth-Studio`
  blockwise nets · `alibaba-pai/Qwen-Image-2512-Fun-Controlnet-Union` (10.1K dl, targets 2512) ·
  **first-party Comfy-Org repacks at 29.5K and 21.6K downloads**. Only model surveyed with union +
  dedicated inpaint + Comfy-Org repacks. Regional/identity control is via **EliGen** (entity-level
  regional LoRAs, [arXiv:2501.01097](https://arxiv.org/abs/2501.01097)) and `Qwen-Image-i2L`, not
  IP-Adapter.
- **Z-Image — since 2025-12-02.** `alibaba-pai/Z-Image-Turbo-Fun-Controlnet-Union-2.1` at **441 likes
  / 99.5K downloads** is one of the most-adopted ControlNets for *any* 2026 base. Canny, Depth, Pose,
  MLSD, Hed, Scribble, **Gray** (added 2026-02-26), plus a built-in **inpaint mode**. Companions:
  `-Tile-2.1-8steps` (2048² SR), a 1.9 GB lite variant, and `neuralvfx/Z-Image-SAM-ControlNet`.
  ⚠️ **Two caveats:** the family targets **Turbo** first (base-`Z-Image` support only landed
  2026-02-02), and **the non-distilled v2.0/2.1 variants degrade Turbo's few-step acceleration** —
  use the `-8steps` variants. Note the irony: **Z-Image has a mature ControlNet stack while
  Z-Image-Edit does not exist.**

### 7.3 SDXL is still the only complete stack

`xinsir/controlnet-union-sdxl-1.0` (**1.81K likes / 111K dl**) covers 12 control + 5 editing modes.
Specialists from xinsir, diffusers, thibaud, TheMistoAI MistoLine, alimama EcomXL, TTPlanet tile,
SargeZT seg, plus the full `Eugeoter/noob-sdxl-controlnet-*` anime parallel set. Inpainting:
`diffusers/stable-diffusion-xl-1.0-inpainting-0.1` (176K dl). Adapters: IP-Adapter,
**IP-Adapter-FaceID (214K dl — the highest-download adapter on the Hub)**, InstantID (48.5K dl),
PuLID v1.1, EcomID, ID-Patch, CSGO, InstantIR.

**This, not aesthetics, is why SDXL is still on people's disks.**

### 7.4 FLUX.2 — BFL shipped nothing, and lost two tools

**No FLUX.2-Fill, no FLUX.2-Redux, no FLUX.2-Depth/Canny.** Confirmed against the full
`black-forest-labs` org listing — every Fill/Depth/Canny/Redux asset is FLUX.1, dated 2024-11-20.
**Losing Fill and Redux is a real regression vs FLUX.1 and the single best argument for staying on
FLUX.1 dev for masked work.**

What exists: one third-party union for dev (`alibaba-pai/FLUX.2-dev-Fun-Controlnet-Union`, 5.8K dl),
and for klein a *different paradigm* — `thedeoxen/refcontrol-FLUX.2-klein-9B-reference-{depth,pose,
canny,lineart,normal}-lora` — which exploit klein's **native multi-image reference input** rather than
a ControlNet branch. **This is the only normal-map control in the entire survey.**
Identity: `dx8152/Flux2-Klein-9B-Consistency` (461 likes / 47.1K dl).

### 7.5 The thin and the empty

- **SD3.5** — thin and abandoned. Official ControlNets are canny/depth/blur, **Large-8B only**, gated;
  the promised 2B versions and additional control types **never shipped**. No pose, tile, softedge,
  inpaint, normal or seg from anyone. ⚠️ **The "SD3 vs SD3.5" trap:** every InstantX SD3 ControlNet
  and both alimama SD3 nets target `stable-diffusion-3-medium`, **not 3.5** — routinely miscited.
- **HiDream-I1** — effectively zero. No official ControlNets, no IP-Adapter, and exactly **one**
  community artifact on the entire Hub (a 14-download SimpleTuner test LoRA). Its answer to "control"
  is instruction editing via E1/E1.1, and the line has pivoted to HiDream-O1-Image.
- **LongCat-Image and GLM-Image — genuinely empty.** Exhaustive sweeps return **zero** ControlNets,
  zero LoRAs, zero adapters for either. GLM-Image additionally has **zero trainer support anywhere** —
  its hybrid 9B-AR + 7B-DiT architecture structurally resists a ControlNet residual branch, and
  control lives inside the model.

### 7.6 Two structural findings worth teaching

**(a) IP-Adapter proper is dead for every post-2025 base.** A sweep through 2026-08-13 returns **zero**
IP-Adapters for Qwen-Image, Z-Image, FLUX.2, Krea 2, LongCat or GLM-Image. InstantX's last image
adapters were FLUX.1-dev and SD3.5-Large (both 2024). What replaced it: **EliGen** (regional/entity
control), **image-to-LoRA** (`Z-Image-i2L`, `Qwen-Image-i2L`), and **native multi-reference inputs**.

**(b) The ecosystem bifurcated along architectural lines.** Chinese labs' models (Qwen, Z-Image) get
**classic side-network ControlNets** from Alibaba PAI / InstantX / DiffSynth. Western and newer models
(FLUX.2, Krea 2) get **control-LoRAs with latent-concat conditioning** riding on native
reference-image inputs. **These are not interchangeable and require different ComfyUI nodes.**

Two documented retreats explain the gaps: **xinsir halted SD3 ControlNet training for lack of GPU
funding** (stated on the union-sdxl card), and **ali-vilab suspended FLUX post-training for ACE++**
citing *"high degree of heterogeneity… highly unstable training"* against a distilled base.

### 7.7 LoRA trainer support — the one that will bite you

| Trainer | SDXL | SD3.5 | FLUX.1 | HiDream | Qwen-Image | Z-Image | FLUX.2 dev | FLUX.2 klein | Krea 2 | LongCat | GLM |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **kohya sd-scripts** v0.11.1 | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **musubi-tuner** | ❌ | ❌ | 🟡 Kontext | 🟡 O1 | ✅ | ✅ | ✅ | ✅ | ✅ exp. | ❌ | ❌ |
| **ai-toolkit** (ostris) | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ +De-Turbo | ✅ | ✅ | ✅ **+edit training** | ❌ | ❌ |
| **diffusion-pipe** | ✅ | 🟡 SD3 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **OneTrainer** | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **SimpleTuner** | ✅ +CN | ✅ +CN | ✅ +CN | ✅ +CN | ✅ | ✅ | ✅ | 🟡 | ❌ | ✅ **only trainer** | ❌ |
| **DiffSynth-Studio** | — | — | — | — | ✅ +CN/EliGen | ✅ | ✅ LoRA | ✅ | ✅ | 🟡 video | ❌ |

**kohya sd-scripts supports none of the seven new bases.** Its list as of v0.11.1 (2026-06-16) stops
at SD1/2, SDXL, SD3/3.5, FLUX.1, LUMINA, HunyuanImage-2.1, Anima. **Treating "sd-scripts" and "kohya"
as the default answer to "how do I train a LoRA" is now wrong for anything newer than FLUX.1.**
SimpleTuner is the only trainer claiming **ControlNet training**, and the only one supporting
LongCat-Image.

---

## 8. Dimension 7 — Speed and hardware

### 8.1 Steps, guidance, params `[OFFICIAL]`

| Model | Params | Steps | Guidance / CFG | Notes |
|---|---|---|---|---|
| SDXL 1.0 | 2.6B UNet (+refiner → 6.6B ensemble) | 25–40 | 3–7 (Juggernaut: *"lower = more realistic"*) | Card: *"The model cannot render legible text."* |
| FLUX.1 [dev] | 12B | ~28–50 | guidance-distilled | Non-commercial |
| FLUX.1 [schnell] | 12B | 1–4 | — | Apache 2.0 |
| **FLUX.2 [dev]** | **32B** + Mistral-3 24B TE | — | no negative prompt | Up to 4 MP, ~6–10 refs |
| **FLUX.2 [klein] 4B** | 4B + Qwen3-4B TE | **4** (step-distilled) | `guidance_scale=1.0` | **Apache 2.0** |
| FLUX.2 [klein] 9B | 9B + Qwen3-8B TE | **4** | `guidance_scale=4.0` | FLUX NCL |
| FLUX.2 [klein] Base 4B / 9B | 4B / 9B | **50** (undistilled) | real CFG works | Base 4B is Apache 2.0 |
| FLUX.2 [klein] 9B-KV | 9B + KV caching | 4 | — | *"faster than 4B for multi-reference editing"* |
| **Z-Image-Turbo** | **6B** + Qwen3-4B TE | **8 NFE** (`num_inference_steps=9`, *"# This actually results in 8 DiT forwards"*) | **`guidance_scale=0.0`** — no negatives | |
| **Z-Image (base)** | 6B | **28–50** | **3.0–5.0**, full CFG + negatives | `cfg_normalization=False` stylism / `True` realism |
| **Qwen-Image / -2512** | **20B** MMDiT + Qwen2.5-VL-7B | **50** | `true_cfg_scale=4.0` | Native 1:1 is **1328×1328**, not 1024 |
| Qwen-2512-Lightning | +LoRA | **4** | cfg 1.0 | **No 8-step variant for 2511/2512** |
| **Krea 2 Turbo** | 12–12.9B DiT + Qwen3-VL-4B | **8** | **cfg 0.0, mu 1.15** (⚠️ **use 1.0 on stock ComfyUI KSampler**) | Up to 2K |
| Krea 2 Raw | same | **52** (CLI default 28) | **3.5** (CLI default 4.5) | *"not recommended for inference"* — a finetuning base |
| **LongCat-Image** | **6B** | **50** | **4.0**, `enable_cfg_renorm=True` | Edit-Turbo: 8 steps, guidance 1, *"10x speedup"* |
| **GLM-Image** | 9B AR + 7B DiT (~16B) | **50** | **1.5**; AR `temp 0.9, top_p 0.75` | Resolution **must** be divisible by 32 |
| HiDream-I1 Full / Dev / Fast | 17B sparse MoE, 4 text encoders | 50 / 28 / 16 | 5.0 / 1.0 / 1.0 | shift 3.0 / 6.0 / 3.0 |
| SD3.5 Large / Medium | 8B / 2.5B | 28 / 40 | — | |
| Ideogram 4 | 9.3B | `V4_QUALITY_48` preset | — | JSON captions only |

### 8.2 Measured speed — the honest set is tiny

| Figure | Source | Label |
|---|---|---|
| **FLUX.2 klein 4B distilled: ~1.2 s, 8.4 GB VRAM, RTX 5090** | [docs.comfy.org](https://docs.comfy.org/tutorials/flux/flux-2-klein.md) | `[TESTED, vendor-adjacent]` |
| **FLUX.2 klein Base 4B: ~17 s, 9.2 GB VRAM, RTX 5090** | same | same |
| **Qwen-Image fp8 on RTX 4090D 24 GB: ~94 s first / ~71 s second** | ComfyUI docs | `[TESTED]` ⚠️ **resolution unstated** — Comfy's Qwen template defaults to 1328² (~1.7 MP), so these are *not* 1024² numbers |
| Qwen fp8 + lightx2v 8-step LoRA, 4090D | ~55 s / ~34 s | `[TESTED]` |
| Qwen distilled fp8, 4090D | ~69 s / ~36 s | `[TESTED]` |
| **GLM-Image on H100 (diffusers):** 2048² T2I **252.6 s / 45.1 GB**; 1024² **64.3 s / 37.8 GB**; 512² **27.3 s / 34.3 GB** | [GLM-Image README](https://github.com/zai-org/GLM-Image) | `[OFFICIAL]` |
| **Z-Image: "sub-second inference latency on an enterprise-grade H800… <16 GB VRAM"** | [Z-Image blog](https://tongyi-mai.github.io/Z-Image-blog/) + arXiv abstract | `[OFFICIAL]` — ⚠️ **the widely-quoted "0.9 s" figure appears nowhere in official materials.** Treat 0.9 s as `[LORE]` |
| Z-Image training cost: **314K H800 GPU hours (~$630K)** | tech report | `[OFFICIAL]` |
| **FLUX.2 quantization: FP8 up to 1.6× faster / 40% less VRAM; NVFP4 up to 2.7× faster / 55% less VRAM** *(benchmarks on RTX 5080/5090, T2I 1024²)* | BFL | `[OFFICIAL]` |
| **Qwen-Image-Lightning: "12–25× speed improvement with no significant loss in performance in most cases"** | [ModelTC](https://github.com/ModelTC/Qwen-Image-Lightning) | `[OFFICIAL]` — base is run at NFE=100 vs 4, which is where 25× comes from |
| **klein Pareto: "matches or exceeds Qwen's quality at a fraction of the latency and VRAM, and outperforms Z-Image… Speed is measured on a GB200 in bf16"** | [BFL klein blog](https://bfl.ai/blog/flux2-klein-towards-interactive-visual-intelligence) | `[OFFICIAL]` — ⚠️ **plot is a PNG; coordinates are not machine-readable, and GB200 latency is useless for consumer planning** |
| Z-Image-Turbo on **MacBook Air M4 16 GB: ~3 min @ 1024×768** | commenter, Stable Diffusion Art | `[LORE]` |

**No published seconds-per-1024² figure exists for RTX 3060, 4060, A100 or H100 for any model on this
list, from any vendor.** The only named consumer GPUs anywhere are **RTX 5090**, **RTX 4090D** and
**RTX 5080/5090**; the only datacenter ones are **H800**, **H100** and **GB200**.

### 8.3 VRAM — the 8 / 12 / 16 GB verdict

| Model | 8 GB | 12 GB | 16 GB | Apple Silicon | CPU |
|---|---|---|---|---|---|
| **SDXL** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **FLUX.2 klein 4B** | ✅ (8.4 GB measured — marginal) | ✅ | ✅ | ✅ **mflux 4-bit + LiteRT on-device** | untested |
| **Z-Image-Turbo 6B** | GGUF Q4 ✅ | ✅ | ✅ **official target** | ✅ (~3 min on M4) | ✅ **via `wbruna/Z-Image-Turbo-sdcpp-GGUF`** |
| Krea 2 Turbo 12.9B | GGUF Q4 | GGUF (12 GB reported working with fp8) | fp8 (12.0 GiB weights) | untested | untested |
| FLUX.1 [dev] 12B | GGUF | GGUF/fp8 | fp8 | 🟡 | slow |
| FLUX.2 klein 9B | ❌ | GGUF only | marginal — **official says ~29 GB / RTX 4090+** | ❌ | ❌ |
| Qwen-Image 20B | offload only (DiffSynth claims **4 GB** layer-by-layer) | GGUF/offload | fp8 tight (20.4 GB file); 24 GB comfortable | untested | slow |
| LongCat-Image 6B | ❌ | ❌ | marginal — code comment: `# Required ~17 GB` | untested | untested |
| HiDream-I1 17B | ❌ | GGUF/NF4 | fp8 (**">16 GB"**; bf16 needs **>27 GB**) | untested | untested |
| **GLM-Image ~16B** | ❌ | ❌ | ❌ — **">80 GB single-GPU, or ~23 GB with `enable_model_cpu_offload=True`"** | ❌ | ❌ |
| **FLUX.2 [dev] 32B** | ❌ | 🟡 only by streaming ~70 GB through system RAM `[LORE]` | ❌ | ❌ | ❌ |

**FLUX.2 [dev], the honest quote** `[OFFICIAL]`, [NVIDIA](https://blogs.nvidia.com/blog/rtx-ai-garage-flux-2-comfyui/):
> *"They run a staggering 32-billion-parameter model requiring **90GB VRAM** to load completely. Even
> using lowVRAM mode… the VRAM requirement is still **64GB**, which puts the model **virtually out of
> reach for any consumer card** to use effectively."*

⚠️ **BFL's own materials contradict each other on klein 4B VRAM: the blog and model card say ~13 GB;
the repo README says ~8 GB; ComfyUI measured 8.4 GB.** Use the measured number.

⚠️ **Privacy flag (carried forward from `image-catch-up.md`):** the FLUX.2 low-VRAM path that uses a
**remote text encoder** (`remote-text-encoder-flux-2.huggingface.co`) computes embeddings **in the
cloud** — the user's prompt leaves the machine. Any "fully local" claim alongside that config is false.

**GGUF availability:** abundant for Z-Image, FLUX.2 klein (all four variants + KV), FLUX.2 dev,
Qwen-Image, Krea 2, LongCat, HiDream Full/Dev (⚠️ **no city96 GGUF for HiDream Fast**), Illustrious,
Chroma. **GLM-Image has none — HF search returns an empty array.** It is the one model on this list
with no community quant path at all.

---

## 9. Dimension 8 — Consistency and seed diversity

### 9.1 Seed diversity — see §6.2 for the numbers; here is the routing

`[OFFICIAL]` Z-Image publishes its own diversity tier table: **Omni-Base High / Z-Image Medium /
Z-Image-Turbo Low**. `[STAFF]` JerryWu-code, [issue #27](https://github.com/Tongyi-MAI/Z-Image/issues/27#issuecomment-3592317395):
*"it's actually a trade-off."* `[STAFF]` [issue #16](https://github.com/Tongyi-MAI/Z-Image/issues/16#issuecomment-3587832445):
*"using short prompts work better for diversity with less words describing their attributes &
identity… But noted our model works best for long and detailed prompt."*

**Two independent mechanisms both reduce diversity, and they compound:**
1. **Distillation / post-training** (§6.2) — architectural, you fix it by choosing the base checkpoint.
2. **Long fully-specified prompts** — PromptMoG ([arXiv:2511.20251](https://arxiv.org/abs/2511.20251),
   1000 prompts of 250–450 words, Vendi Score over InceptionV3 + DINOv3, 6 seeds): *"state-of-the-art
   models exhibit a clear drop in diversity as prompt length increases."* You fix it by prompting
   short while exploring.

**Measured workaround for Z-Image-Turbo specifically** `[TESTED]`, Wei Mao, MyAIForce, 2025-12-21:
sampler/scheduler changes barely help; two-KSampler with CFG<1 on the first gives real diversity but
*"randomness is not selective"*; `SeedVarianceEnhancer` is cleaner but *"faces remain very similar"*.
**Winner: FLUX schnell → Z-Image-Turbo img2img** (shared latent space) — Schnell 768×1024 at 4 steps
for 8 candidates in 49 s, then Turbo repaints at 1536×2048. Author's conclusion: *"Z Image Turbo's
lack of variation is **not a minor tuning issue — it's a structural problem rooted in the first
sampling step**."*

### 9.2 Character consistency — three tiers, by maturity of tooling

| Tier | Method | Best models | Evidence |
|---|---|---|---|
| **1** | **Prompt discipline** — lock 3–5 colour words, restate the full character description verbatim in every prompt | Everything | `[OFFICIAL]` Krea: *"**Pick three to five color words per character and reuse them across every sheet. Drift in palette is the biggest cause of inconsistency.**"* BFL's documented FLUX.2 method is the same brute force: *"**Repeat these details in every panel prompt.**"* — no special mechanism, and **the "best character consistency available today" claim ships with no eval table** |
| **2** | **Image reference at inference** | **FLUX.2 [klein] 9B** (best measured multi-ref, §4.4); Krea 2 via `ReferenceLatent`; Qwen-Edit-2511 | `[OFFICIAL]` Krea FAQ: turnarounds are *"visually consistent — same outfit, same hair color, same proportions — but **not pixel-perfect**. For pixel-perfect multi-view work, generate the front view first, then use it as an image reference."* `[TESTED]` earngenix: **the VAE→`ReferenceLatent` path "is the path doing most of the work to hold the face steady"** — skipping it and relying on the text-encoded reference alone *"drops identity preservation noticeably"* |
| **3** | **LoRA** — the only reliable answer | **SDXL/Illustrious** (vast, mature); **Krea 2** (train on Raw, run on Turbo); Qwen/Z-Image/FLUX.2 via musubi-tuner or ai-toolkit | `[OFFICIAL]` Krea: *"A LoRA takes about 20 minutes and gives you that exact character on demand."* ComfyUI docs: **"train LoRAs on RAW, run inference on Turbo"** |

`[SYNTHESIS]` **A 4-view sheet at 2048 wide gives ~512 px per character — too small for a sprite.**
Use the sheet as a *design document*, then re-generate each view individually with the sheet as an
image reference. And note `[OFFICIAL]` fal's finding that a **solid background also improves
cross-generation style consistency** — a free win.

---

## 10. Dimension 9 — Licences

| Model | Exact licence | Commercial? | Caps / obligations |
|---|---|---|---|
| **FLUX.2 [klein] 4B** and **Base 4B** | **Apache 2.0** | ✅ unrestricted | ungated |
| **FLUX.1 [schnell]** | Apache 2.0 | ✅ | ungated |
| **Z-Image / Turbo / base** | **Apache 2.0** | ✅ | none |
| **Qwen-Image / -2512 / -Edit-* / Lightning** | **Apache 2.0** | ✅ | none |
| **LongCat-Image (all)** | **Apache 2.0** | ✅ | none |
| **FireRed-Image-Edit 1.0 / 1.1** | **Apache 2.0** | ✅ | code and weights |
| **Chroma1-\*** | **Apache 2.0** | ✅ | explicitly **unaligned**, no safety filter |
| **GLM-Image** | **MIT** | ✅ | VQ tokenizer + ViT from X-Omni stay Apache-2.0 |
| **HiDream-I1 / E1.1** | **MIT** (transformer) | ✅ *"Commercial-Friendly"* | ⚠️ text encoder is **Llama-3.1-8B-Instruct** → Llama 3.1 Community License applies to that component |
| **SDXL base 1.0** | **CreativeML Open RAIL++-M** | ✅ with use restrictions | no revenue cap |
| **Illustrious XL v0.1** | **Fair AI Public License 1.0-SD** | restricted — **copyleft** | must open-source derivatives, publish datasets + merge recipes. Verbatim: *"You are prohibited from monetizing any **close-sourced fine-tuned / merged model**"* |
| **Illustrious XL v2.0-STABLE** | `creativeml-openrail-m` | ✅ | ⚠️ **the licence changed between versions** — "Illustrious = FAIPL" is wrong for v2.0. And **v1.0 was closed-source** (the v0.1 card concedes: *"we know many of you are disappointed with the closed-source nature of Illustrious XL v1.0"*) |
| **SD3.5 Large / Medium / Large-Turbo** | **Stability AI Community License** | ✅ **under $1M** | *"free for everyone, unless… you or your organization generate over **USD $1M**… **regardless of the source of that revenue**"* |
| **Krea 2 Raw + Turbo** | **Krea 2 Community License** v.1 (2026-06-22) | ✅ **under $1M** | §2.3 revenue cap trailing-12-months, all affiliates, all sources; **§3.1 derivatives must be named "Krea 2 [Your Name]"**; **§4.2 content filtering is a licence obligation**; **§9.2 revocable for convenience on 30 days' notice**; Delaware law. You own the outputs |
| **FLUX.1 [dev], FLUX.1 Krea [dev]** | `flux-1-dev-non-commercial-license` | ❌ | gated |
| **FLUX.2 [dev], klein 9B, Base 9B, 9B-KV** | **FLUX Non-Commercial License** | ❌ | gated; **filters or manual review are mandatory**, and BFL *"may approach known deployers at random to verify"* |
| **Ideogram 4** | Ideogram 4 Non-Commercial | ❌ | gated |
| **Juggernaut Z** | CC BY-NC 4.0 | ❌ | |
| **Pony V6 / Juggernaut XL / RealVisXL** | **no evidence found this pass** — these live on Civitai | — | do not assert |

**The rename** `[OFFICIAL]`: *"The 'FLUX [dev] Non-Commercial License' has been renamed to '**FLUX
Non-Commercial License**' and will apply to the 9B Klein models. **No material changes** have been
made to the license."*

**BFL's stated reason for the 4B/9B split** `[OFFICIAL]`, klein 4B card: *"The final FLUX.2 [klein]
checkpoints demonstrated high resilience against violative inputs… Based on these findings, we
approved the release of the… **4B models under an Apache 2.0 license** and the… **9B models under a
non-commercial license**."*

`[SYNTHESIS]` **The teaching sentence:** *"If a student wants to sell what they make, the safe list is
Z-Image, Qwen-Image, LongCat, GLM-Image, HiDream, FLUX.2 klein 4B, FLUX.1 schnell, Chroma and SDXL.
Everything with the word 'dev' in it, plus Krea 2 above $1M and SD3.5 above $1M, is not."*

---

## 11. Head-to-head bakeoffs — what actually exists, and how weak it is

Ordered by methodological strength.

**1. T2I-CoReBench** — §2.1. 1,080 identical prompts, 28+ models, checklist-graded. **The strongest
same-prompt comparison in existence.** Seeds not fixed/reported; judge-model dependent.

**2. arena.ai edit leaderboards** — §4.2. **28.8M and 8.3M human votes.** Blind pairwise, same prompt.
Measures preference, not fidelity. The single/multi ordering flip is cross-validated by CPI-Bench.

**3. Artificial Analysis T2I Arena** — [artificialanalysis.ai](https://artificialanalysis.ai/image/leaderboard/text-to-image),
fetched 2026-08-17. Method: *"Users compare two images generated from the same prompt without knowing
which model created each."* **Same prompt, unfixed seed, default settings, 1024².** Thousands to ~19K
votes per model. **Measures aesthetic preference, not prompt fidelity.**

Open-weights Elo: Ideogram 4.0 **1217** · **FLUX.2 [dev] 1199** · Qwen Image Max 2512 1173 ·
**FLUX.2 klein 9B 1146** · **Z-Image Turbo 1130** · klein Base 9B 1099 · Qwen Image 1082 ·
HiDream-I1-Dev 1070 · **GLM-Image 1068** · **Z-Image Base 1064** · klein 4B 1057 · **LongCat 1053** ·
FLUX.1 [dev] 1041 · FLUX.1 Krea [dev] 1036 · SD3.5 Large 1034 · **FLUX.1 [schnell] 1000 (anchor)** ·
klein Base 4B 972 · SD3.5 Medium 963 · **SDXL 1.0 884**.

⚠️ **Two things to call out.**
(a) **Distilled beats base on this leaderboard and loses on CoReBench** — Z-Image Turbo 1130 vs Base
1064, klein distilled > klein Base at both sizes. **The disagreement is the result** (§0(5)).
(b) **Krea 2's arena entries (Large 1220, Medium Turbo 1222, Medium 1212) are NOT tagged "Open
Weights"**, while FLUX.2 dev, klein, Z-Image Turbo, GLM-Image and LongCat are. **Krea's claim of
*"#1 text-to-image model from an independent lab on Artificial Analysis"* is therefore about their
hosted models — it is not a verified statement about the 12.9B open weights you would download.**
Downgrade that marketing line to `[LORE]` w.r.t. the open checkpoint. (Krea's own tech report is more
careful: *"among the top 10 models… 2nd place among models from independent labs."*)

**4. Qwen-Image-Lightning's base-vs-distilled grids** `[OFFICIAL, self-published]` — **the only
fixed-seed grid found anywhere in this pass** (`--base_seed 42`, base 50 steps/cfg 4.0 vs 8-step and
4-step at cfg 1.0, reproduction commands published). Refreshingly non-triumphalist: named failure
modes are **dense/small text** (*"the base model is more likely to produce better results"*),
**hair-like details** (*"noticeably blurred or excessively sharpened"*), and complex scenes. Its
closing caveat should temper every bakeoff on this page: *"**Even for the same prompt at different
resolutions, the relative performance ranking of the models may differ substantially.**"*

**5. Stable Diffusion Art: Z-Image Turbo vs FLUX.1 Dev** `[TESTED — weak]`,
[stable-diffusion-art.com/z-image](https://stable-diffusion-art.com/z-image/). **4 prompts, one human
evaluator, no fixed seed, no blinding.** Its own framing is wrong (*"both distilled models are roughly
the same size"* — 6B vs 12B). Verdicts, verbatim: short text *"Tie"*; long text *"**Z-Image wins**…
While more accurate, Z-image's text tends to look too neat to be naturally in the scene"*; challenging
pose (capoeira cartwheel kick) *"Flux is significantly worse in anatomy… **Z-Image wins**"*; Van Gogh
style *"Flux's image is way too realistic for the 'Van Gogh' style. **Z-Image wins**"*. Conclusion:
*"**Z-Image Turbo generate better images than Flux.1 Dev in most areas.**"* **Quote the conclusion,
flag the N=4.**

**6. LongCat-Image human eval** `[OFFICIAL, self-published, N not disclosed]` — LongCat-Image-Edit
**beats** Qwen-Image-Edit-2509 (58.7% / 54.2%) and FLUX.1 Kontext [Pro] (60.5% / 63%), **loses** to
Nano Banana (39.2%) and Seedream 4.0 (43.1%).

**7. ContraLabs designer typography study** — §6.3. Ten professional designers, blind. The only
human-expert study in the entire pass.

**Explicitly no evidence found:** any academic user study comparing **FLUX.2 vs Qwen vs Z-Image vs
Krea 2**. **Krea 2 appears in no independent benchmark of any kind.** Reddit r/StableDiffusion
comparison threads were unreachable this pass (domain blocked to the fetcher), so the enthusiast
same-seed grid content that would answer the practical question is **not represented here** — treat
this document as strong on published evidence and thin on community bakeoffs.

---

## 12. Strengths matrix

Rows = model. ●●● best-in-class among local models · ●● strong · ● usable · ○ weak · — no evidence.
**Every cell is a compression of §2–§10; read the section before quoting a cell.**

| Model | Adherence | EN text | ZH text | Humans/skin | Style range | Anime | Editing | Control | Speed | VRAM floor | Licence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **SDXL + finetunes** | ○ (GenEval 0.55, Pos 0.15) | ○○ (0.029 — none) | ○ (none) | ●● (finetunes) | ●● (LoRA library) | **●●●** | ●● (inpaint mature) | **●●●** | ●● | **8 GB** | OpenRAIL++ ✅ |
| **FLUX.1 [dev]** | ● (CoRe 42.2) | ● (0.523) | ○ (**0.005**) | ●● | ●● | ○ | ●● (Kontext, Fill, Redux) | ●●● | ● | 12 GB | **NC ❌** |
| **FLUX.1 Krea [dev]** | ● (CoRe 48.2) | ○ (BizGen 0.0) | ○ | ●●● (anti-AI-look, 2025) | ●● | ○ | ●● (FLUX.1 tools) | ●●● | ● | 12–24 GB | **NC ❌** |
| **FLUX.2 [dev]** | **●●● (CoRe 64.4)** | **●●●** (UniGen 85.34, LongText 0.963) | ● (0.757) | ●● | ●● | ○ | ●● (no Fill/Redux) | ● | ○ | **64–90 GB** | **NC ❌** |
| **FLUX.2 klein 9B** | ●● (CoRe 60.6) | ●● (0.864) | ○ (0.218) | ●● | ●● | ○ | **●●● multi-ref** | ●● | ●●● (4 steps) | ~29 GB | **NC ❌** |
| **FLUX.2 klein 4B** | ● (CoRe 54.6) | ● | ○ | ● | ● | ○ | ●● | ●● | **●●● (1.2 s/5090)** | **8.4 GB** | **Apache ✅** |
| **Z-Image-Turbo (6B)** | ●● (CoRe 56.4) | **●●● (OneIG 0.994)** | ●● (0.926) | ●● | ● (low diversity) | ● (Z-Anime) | — (Edit never shipped) | ●● (union, 99.5K dl) | **●●● (8 NFE)** | **<16 GB** | **Apache ✅** |
| **Z-Image (base)** | ●● (CoRe 61.1) | ●● (0.935) | ●● (0.936) | ●●● (Juggernaut Z) | ●● (negatives work) | ●● | — | ●● | ● (28–50) | <16 GB | **Apache ✅** |
| **Qwen-Image-2512 (20B)** | ●● (CoRe 62.4) | ●● (0.956) | **●●● (0.965)** | ●● (anti-AI-look neg.) | ●● | ○ | **●●● (Edit-2511)** | **●●● (deepest new-gen)** | ○ (50 steps, ~71 s) | 20 GB fp8 | **Apache ✅** |
| **Krea 2 (12.9B)** | — **no benchmark** | ● `[LORE]` mediocre | — | **●●● `[LORE]`** | **●●●** | ● | ✗ **no edit model** | ● (5-week-old LoRAs) | ●● (8 steps) | 12–16 GB | **$1M cap + filter duty** |
| **LongCat-Image (6B)** | ●● (GenEval 0.87) | ●● (CVTG 0.8658) | **●●● (ChineseWord 90.7)** | ●● | ●● | ○ | ●● | ✗ **nothing** | ● | ~17 GB | **Apache ✅** |
| **GLM-Image (~16B)** | ● (DPG 84.78) | ●● (0.952) | **●●● (0.979, CVTG 0.9116)** | ●● | ● | ○ | ●● | ✗ **nothing** | ○ (64 s/1024² H100) | **23–80 GB** | **MIT ✅** |
| **SD3.5 Large** | ○ (CoRe 37.8) | ● (0.629) | ○ (CVTG-Hard 0.0014) | ● | ●● | ○ | ○ | ○ (abandoned) | ● | 16 GB | **$1M cap** |
| **HiDream-I1 (17B)** | ● (CoRe 43.0) | ● (0.707) | ○ (0.024) | ●● | ●● | ○ | ● (E1.1) | ✗ **one 14-dl LoRA** | ○ | >16 GB fp8 | **MIT ✅** |
| **Ideogram 4 (9.3B)** | — | **●●● (vendor + designer eval)** | — | ● | ●● (design) | ○ | — | ✗ | ●● | ~10–19 GB | **NC ❌** |
| **Chroma1-HD (8.9B)** | — | — | — | ●● | ●● (finetune base) | ●● | — | ● | ● | 12 GB | **Apache ✅, unaligned** |

---

## 13. Contradiction register — things not to say

| # | Common claim | Status |
|---|---|---|
| 1 | *"Model X beats Y — GenEval 0.87 vs 0.84"* | **Meaningless.** GenEval under-reports by 10–18 points and mis-ranks. §0(2) |
| 2 | *"Z beats Qwen on English multi-region text on LongText-Bench"* | **Wrong benchmark.** Those are CVTG-2K numbers. On LongText-EN, Qwen wins 0.943 vs 0.935. §3.0 |
| 3 | *"Krea 2 has no ControlNet ecosystem"* | **Expired July 2026.** Three community control-LoRAs now exist (depth, pose, silhouette). Still no official ControlNet, no union, no canny/tile/lineart/normal/seg. §7.2 |
| 4 | *"Krea 2 is the #1 open-weights model on Artificial Analysis"* | **Not verifiable.** Krea's arena entries are **not tagged "Open Weights"** and their names (Large/Medium/Medium Turbo) don't map onto the released Raw/Turbo repos. §11 |
| 5 | *"FLUX.2 has the best character/product/style consistency available today"* | `[OFFICIAL]` **published with no eval and no benchmark table.** BFL's documented mechanism is literally repeating the description in every prompt. §9.2 |
| 6 | *"FLUX.2 matches hex colours exactly"* | `[OFFICIAL]` claimed, **never measured**. The only measured hex numbers are FLUX.1-era and catastrophic (5.86–13.82%). §6.3 |
| 7 | *"FireRed handles 10+ reference images"* | **Pipeline claim, not model capability** — an Agent crops and stitches into 2–3 composites. It scores **worst of any open model** on multi-image composition. §4.4 |
| 8 | *"Z-Image-Edit is out"* | **No.** Still `*To be released*` after ~9 months, zero maintainer replies to ~20 issues. **The official blog carries a now-false claim that it is available** — cite the repo table. §4.1 |
| 9 | *"Z-Image does 0.9 s per image"* | The figure **appears in no official material** — the claim is *"sub-second… on an enterprise-grade H800."* `[LORE]` §8.2 |
| 10 | *"klein 4B needs 13 GB"* | **BFL's own materials contradict each other** (13 GB blog/card vs 8 GB README). ComfyUI measured **8.4 GB**. §8.3 |
| 11 | *"Q4 is where text rendering breaks"* | **No evidence found** for FLUX or Qwen. The one measured table (Ideogram 4) says **GGUF Q4_K beats FP8 on OCR**, and that format matters more than bit count. §3.6 |
| 12 | *"Generate at 2× and downscale for better text"* | **No evidence found. Folklore.** §3.6 |
| 13 | *"Model X has better skin / avoids the AI look"* | **No benchmark with a skin or AI-look axis exists.** Every such claim is vendor marketing or `[LORE]`. §5.2 |
| 14 | *"Model X fixed hands"* | **There is no hand benchmark.** §5.3 |
| 15 | *"kohya sd-scripts trains everything"* | **It trains none of Qwen-Image, Z-Image, FLUX.2, Krea 2, LongCat or GLM.** §7.7 |
| 16 | *"InstantX SD3 ControlNets work on SD3.5"* | **They target `stable-diffusion-3-medium`.** Routinely miscited. §7.5 |
| 17 | *"Union-Pro 2.0 is a strict upgrade over 1.0 for FLUX.1"* | **It dropped tile support that 1.0 had.** For FLUX tile use Union-Pro 1.0, InstantX Union mode 1, or jasperai's Upscaler |
| 18 | *"Prompt rewriting always helps"* / *"always hurts"* | **Both are `[TESTED]` and both are true in their domain.** o3 rewriting gains +21–23 on CoReBench reasoning; naive open-model rewriting scored **below** no rewriter at all on aesthetic win rate. §2.1 |
| 19 | *"Rare Chinese characters are as reliable as common ones"* | **97% → 41% → 6%** across frequency tiers on Qwen. LongCat is the only model to break it (98.7/90.8/70.3). §3.3 |
| 20 | *"Old models are just worse"* | On **style diversity** they are measurably better — SD1.5 0.429, SDXL 0.296 vs Qwen 0.179. But much of that is weak alignment masquerading as variety. §6.2 |

---

## 14. Explicit "no evidence found" ledger

Filling these would be genuinely novel work — several are cheap experiments nobody has published.

**Benchmarks that do not cover current models:**
- **T2I-CompBench** for *any* 2025/2026 open model — the benchmark was abandoned by vendors.
- **GenSpace** (3D spatial) — coverage stops at Seedream-3.0 / GPT-4o era.
- **GenEval 2** — 8-model set only; **no current-generation model has been re-scored** under the fixed evaluator.
- **HPSv2.1 / HPSv3** — no Qwen-Image, Z-Image, FLUX.2 or Krea 2.
- **OneIG public leaderboard** — last updated 2025-09-19; no Z-Image, FLUX.2, Krea 2 or Ideogram 4.
- **RISEBench / Complex-Edit / OmniContext** for the 2026 edit cohort.
- **KRIS-Bench** for Qwen-2511, FireRed, LongCat or FLUX.2.
- **ChineseWord** for anything except Qwen, Seedream 3.0/4.0, GPT-Image-1, Hunyuan 3.0, LongCat.
- **TextAtlasEval** for SDXL, any FLUX, Z-Image, HiDream or Hunyuan.
- **LongText-Bench / CVTG-2K** for SDXL, SD3.5, FLUX.1 schnell, FLUX.1 Krea, Krea 2, or FLUX.2 klein 4B.

**Per-model holes:**
- **Krea 2** — every compositional benchmark, every text benchmark, every named-GPU latency figure, any independent evaluation of the *open* checkpoint. Elo only, and the open/closed mapping of its arena entries is unresolved.
- **SDXL finetunes** (Juggernaut, RealVisXL, Pony V6, Illustrious) — **no compositional benchmark data of any kind**, confirmed at source. Their cards carry sampler settings and marketing only. Illustrious's own paper uses Elo / CCIP / TrueSkill 2, never GenEval or DPG. Any claim about their prompt adherence relative to SDXL base is **currently unfalsifiable from public sources**.
- **FLUX.1 [schnell]** and **FLUX.1 Krea [dev]** — no GenEval, no DPG, no dedicated text benchmark.
- **Qwen-Image-2512** — no GenEval; Qwen publishes **zero** text numbers for it (every 2512 text number in §3 comes from a *competitor*: Z.ai or Baidu).
- **GLM-Image** — no GenEval, no T2I-CompBench, and **no GGUF quant exists**.
- **DPG-Bench** for SD3.5 (Large or Medium) or Krea 2.

**Structural gaps in the literature:**
- **No skin / waxiness / "AI-look" benchmark exists.** No portrait human-preference study for the current cohort. No quantitative facial-diversity ("same face") study.
- **No hand or anatomy benchmark exists at all.** Every hand paper is corrective, not evaluative.
- **No face-embedding identity metric for any 2026 instruction-edit model.** Every "identity preservation" number is a VLM judge score.
- **No pixel-level metric** (PSNR/SSIM/LPIPS on unedited regions) for any edit model. No measurement of multi-turn VAE round-trip degradation.
- **No measured OCR-accuracy-vs-quantization curve** for FLUX or Qwen. **No measured OCR-vs-resolution curve** for any model.
- **No evidence that community LoRAs degrade text rendering** — untested folklore in both directions.
- **No published word/character limit for reliable text rendering, from any vendor.**
- **No controlled A/B of the same semantic prompt in ZH vs EN** on any bilingual model.
- **No seconds-per-1024² figure on RTX 3060/4060/A100/H100 for any model on this list.**
- **No academic user study** comparing FLUX.2 vs Qwen vs Z-Image vs Krea 2.

---

## 15. Actions for the corpus

1. **Add the "GenEval is saturated" rule** as a first-class gotcha, with the GenEval 2 numbers. Any
   GenEval delta under ~5 points should trigger a validator warning, not a routing decision.
2. **Split "text rendering" into four regimes** in the model selector (EN short / EN long /
   multi-region / CJK). They do not correlate, and one number cannot route all four. §3.5
3. **Correct the CVTG-2K vs LongText-Bench conflation** wherever the 0.867/0.829 pair appears.
4. **Retire "Krea 2 has no ControlNet"** and replace with the precise version in §7.2.
5. **Add the "distilled wins Elo, base wins composition" rule.** Route on which the user needs.
   Extend the existing "negatives are a function of CFG, not of the model" rule to note that **the
   same CFG argument removes the hand-repair lever** (§5.3).
6. **Add Ideogram 4** to `new-models.md` — open weights since 2026-06-03, **JSON-caption-only
   prompting dialect**, best local typography, non-commercial licence.
7. **Add the licence routing table (§10) as a hard filter**, not advice. "Can the student sell this?"
   is answerable and currently isn't answered anywhere in the corpus.
8. **Add the kohya-sd-scripts gap** to the gotchas bank — it is the most likely silent failure a
   student will hit when told "train a LoRA."
9. **Record the multi-region degradation numbers** (§3.2) as the canonical answer to "how much text
   can I ask for?" — it is region count, not character count.
10. **Reconcile the two rewriter findings** (§2.1) rather than picking one. The honest rule is
    domain-dependent, and the corpus currently carries only the pessimistic half.

---

## 16. Source list

**Benchmarks and papers** (all `[TESTED]` unless noted)
- GenEval 2 — <https://arxiv.org/abs/2512.16853>
- GenEval (origin) — <https://arxiv.org/abs/2310.11513>
- T2I-CoReBench — <https://arxiv.org/abs/2509.03516> · <https://t2i-corebench.github.io/>
- ELLA / DPG-Bench (origin) — <https://arxiv.org/abs/2403.05135>
- T2I-CompBench++ — <https://arxiv.org/abs/2307.06350>
- GenSpace — <https://arxiv.org/html/2505.24870v2>
- TIIF-Bench — <https://a113n-w3i.github.io/TIIF_Bench/> · <https://arxiv.org/abs/2506.02161>
- OneIG-Bench — <https://oneig-bench.github.io/> · <https://arxiv.org/abs/2506.07977> · [leaderboard source](https://raw.githubusercontent.com/OneIG-Bench/oneig-bench.github.io/main/index.html)
- WISE — <https://arxiv.org/abs/2503.07265> · <https://github.com/PKU-YuanGroup/WISE>
- HPSv3 — <https://arxiv.org/abs/2508.03789> · <https://github.com/MizzenAI/HPSv3>
- X-Omni / LongText-Bench (origin) — <https://arxiv.org/abs/2507.22058>
- TextCrafter / CVTG-2K (origin) — <https://arxiv.org/html/2503.23461v5>
- UniGenBench++ — <https://arxiv.org/abs/2510.18701>
- BizGenEval — <https://arxiv.org/abs/2603.25732>
- STRICT (text length) — <https://arxiv.org/abs/2505.18985>
- OCRGenBench — <https://arxiv.org/html/2507.15085v4>
- TextAtlas5M / TextAtlasEval — <https://arxiv.org/abs/2502.07870>
- CPI-Bench — <https://arxiv.org/abs/2608.14546>
- RISEBench — <https://arxiv.org/abs/2504.02826> · <https://github.com/PhoenixZ810/RISEBench>
- UMO / XVerseBench ID-Sim — <https://www.arxiv.org/html/2509.06818v1>
- Quantization vs OCR (Ideogram 4) — <https://arxiv.org/html/2606.12280v1>
- PromptMoG / LPD-Bench (diversity vs prompt length) — <https://arxiv.org/abs/2511.20251>
- Input-side inference-time scaling (rewriter sweep) — <https://arxiv.org/abs/2510.12041>
- GenColorBench / NumColor (hex adherence) — <https://arxiv.org/html/2510.20586v1> · <https://arxiv.org/abs/2603.13547>

**Model tech reports / cards** (`[OFFICIAL]`)
- Qwen-Image — <https://arxiv.org/abs/2508.02324> · <https://huggingface.co/Qwen/Qwen-Image-2512> · <https://qwenlm.github.io/blog/qwen-image/>
- Qwen-Image-Edit-2511 — <https://huggingface.co/Qwen/Qwen-Image-Edit-2511>
- Qwen-Image-Lightning — <https://github.com/ModelTC/Qwen-Image-Lightning>
- Z-Image — <https://arxiv.org/abs/2511.22699> · <https://github.com/Tongyi-MAI/Z-Image> · <https://huggingface.co/Tongyi-MAI/Z-Image>
- LongCat-Image — <https://arxiv.org/html/2512.07584v1> · <https://github.com/meituan-longcat/LongCat-Image>
- GLM-Image — <https://github.com/zai-org/GLM-Image> · <https://huggingface.co/zai-org/GLM-Image> · <https://docs.z.ai/guides/image/glm-image>
- FLUX.2 — <https://bfl.ai/blog/flux-2> · <https://bfl.ai/blog/flux2-klein-towards-interactive-visual-intelligence> · <https://docs.bfl.ai/guides/prompting_guide_flux2> · <https://huggingface.co/black-forest-labs/FLUX.2-klein-4B>
- FLUX 3 (no open weights) — <https://bfl.ai/models/flux-3>
- Krea 2 — <https://www.krea.ai/blog/krea-2-technical-report> · <https://huggingface.co/krea/Krea-2-Turbo> · <https://www.krea.ai/krea-2-licensing> · <https://docs.comfy.org/tutorials/image/krea/krea-2>
- FLUX.1 Krea [dev] — <https://www.krea.ai/blog/flux-krea-open-source-release>
- FireRed-Image-Edit — <https://github.com/FireRedTeam/FireRed-Image-Edit> · <https://www.arxiv.org/html/2602.13344v1>
- HiDream-I1 — <https://arxiv.org/html/2505.22705v1> · <https://huggingface.co/HiDream-ai/HiDream-I1-Full>
- Ideogram 4 — <https://huggingface.co/ideogram-ai/ideogram-4-fp8>
- Chroma1-HD — <https://huggingface.co/lodestones/Chroma1-HD>
- Z-Anime — <https://huggingface.co/SeeSee21/Z-Anime>
- Juggernaut-Z-Image — <https://huggingface.co/RunDiffusion/Juggernaut-Z-Image>
- bigASP 3 (FLUX.2-klein-9B) — <https://huggingface.co/fancyfeast/bigasp-3>
- SDXL — <https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0>
- SD3.5 licence — <https://stability.ai/license>
- Illustrious v0.1 / v2.0 — <https://huggingface.co/OnomaAIResearch/Illustrious-XL-v2.0> · <https://arxiv.org/abs/2409.19946>
- Mage-Flow (FLUX.2 GenEval/DPG source) — <https://raw.githubusercontent.com/microsoft/Mage/main/mage_flow/README.md>
- Step1X-Edit — <https://raw.githubusercontent.com/stepfun-ai/Step1X-Edit/main/README.md>

**Control / ecosystem**
- `xinsir/controlnet-union-sdxl-1.0`, `InstantX/Qwen-Image-ControlNet-Union`, `alibaba-pai/Z-Image-Turbo-Fun-Controlnet-Union-2.1`, `Patil/Krea-2-depth-controlnet`, `thedeoxen/Krea-2-pose-controlnet`, `tori29umai/krea2-controlnet`, `thedeoxen/refcontrol-FLUX.2-klein-9B-reference-*`, `dx8152/Flux2-Klein-9B-Consistency` — all on huggingface.co
- EliGen — <https://arxiv.org/abs/2501.01097>

**Leaderboards / bakeoffs**
- Artificial Analysis T2I — <https://artificialanalysis.ai/image/leaderboard/text-to-image>
- arena.ai image-edit leaderboards (28.8M / 8.3M votes)
- Stable Diffusion Art, Z-Image vs FLUX.1 dev — <https://stable-diffusion-art.com/z-image/>
- Pruna, FLUX.2 flex — <https://www.pruna.ai/blog/flux2flex-3-faster>
- NVIDIA on FLUX.2 VRAM — <https://blogs.nvidia.com/blog/rtx-ai-garage-flux-2-comfyui/>
- ComfyUI klein tutorial (the only consumer-GPU latency figure) — <https://docs.comfy.org/tutorials/flux/flux-2-klein.md>

**Issue trackers cited as evidence**
- <https://github.com/QwenLM/Qwen-Image/issues/229> (pixel shift, unanswered)
- <https://github.com/ModelTC/LightX2V-Qwen-Image-Lightning/issues/83> (Lightning colour shift)
- <https://github.com/huggingface/diffusers/issues/12216> (diffusers vs ComfyUI preservation)
- <https://github.com/Tongyi-MAI/Z-Image/issues/16>, <https://github.com/Tongyi-MAI/Z-Image/issues/27> (diversity trade-off, `[STAFF]`)

---

*End of comparison. Two honesty notes. (1) Web search quota was exhausted during this pass; most
evidence above came from direct fetches of primary sources — arXiv, model cards, GitHub READMEs, HF
and Civitai APIs — which is methodologically better but means **community forum evidence
(r/StableDiffusion in particular) is unrepresented**. Anywhere this document says "community
consensus," it is inferred from platform telemetry (downloads, likes, what people are building LoRAs
for), not from reading opinions. (2) **Nothing here has been image-tested by me.** Every routing
recommendation is derived from published numbers and vendor documentation, and the sections where
those don't exist — skin, hands, painterly style, Krea 2 anything — are labelled accordingly and
should be treated as hypotheses for the student to test, not conclusions.*
