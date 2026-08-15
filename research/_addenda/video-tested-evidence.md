# Addendum — tested evidence for video prompt techniques

Research pass: 2026-08-15 (follow-up to the 2026-08-15 corpus baseline). All URLs
accessed 2026-08-15 unless noted.

Purpose: the base corpus (`wan22.md`, `ltx23.md`, `scail2.md`, `_cross/*`) is
strong on [OFFICIAL] sources and weak on [TESTED] evidence. This pass hunts
specifically for controlled comparisons with visible methodology, and records
"nothing found" explicitly where that is the honest answer.

## Evidence labels used here

- **[OFFICIAL]** — model author / model card / official repo or docs.
- **[STAFF]** — vendor blog or vendor employee, not the canonical artifact.
- **[TESTED-PAPER]** — peer-review-style paper with a published table; methodology visible.
- **[TESTED-LOCAL]** — someone ran local open weights and published settings + side-by-side output.
- **[TESTED-API]** — measured, but on hosted API/cloud, not local weights.
- **[LORE]** — community/SEO claim with no visible methodology.
- **[SPECULATION]** — claim not supported by any primary source located in this pass.

Where a source only *asserts* it tested something without publishing a protocol
or numbers, it is labelled [LORE] regardless of how confident it sounds.

---

## 0. Headline corrections to the current corpus

Read this section first; the rest is supporting detail.

| # | Corpus currently says | This pass found | Severity |
|---|---|---|---|
| 1 | (implicitly) Wan 2.2 is a competent camera-instruction follower; `fixed camera / 固定机位` is a reliable prompt-side fix | **Wan 2.2 scores 42.86% Camera Motion Consistency on AnimationBench — the worst of eight models tested, and 3/7 commanded camera motions.** Camera obedience is the *weakest* prompt channel on Wan, not a lever. | **High** |
| 2 | Longer/richer prompts are broadly good; extenders/rewriters help | **Generic LLM prompt expansion measurably degrades dynamic/temporal attributes and identity on Wan.** Dynamic Attribute drops in 4/4 models tested; Human Identity 0.692→0.551 on Wan 2.2 14B. | **High** |
| 3 | `new-models.md`: "Add LTX-2.5 immediately as a new local target" | **Confirmed and stronger than stated** — weights are live, split-pack, dev + distilled + NVFP4, and LTX-2.3 LoRAs mostly transfer. But 2.5 adds **native multi-shot with explicit cuts**, which directly contradicts the 2.3 rule "no timestamps/cuts unless requested". | **High** |
| 4 | Nothing about Wan 2.5/2.6/2.7/3.0 | Third-party sites assert Wan 3.0 open weights (1.3B + 14B, Apache 2.0) shipped April 2026. **Primary sources contradict this**: the Wan-Video GitHub org has 4 repos (newest Wan2.2, last updated 2026-03-17) and the Wan-AI HF org exposes nothing past the Wan 2.2 family. Do **not** add Wan 3.0. | **High** |
| 5 | `scail2.md` cites `github.com/Ardynai/scail-2` as the official repo | **Official repo is `github.com/zai-org/SCAIL-2`** (branch `wan-scail2`). Ardynai is not the upstream. Prompt-enhancer and README quotes should be re-anchored. | Medium |
| 6 | No mention of Wan-Animate-2 | **New official open-weight release 2026-08-07: `Wan-AI/Wan2.2-Animate-2-14B` (+ Distilled), Apache 2.0, arXiv 2608.06009.** Direct SCAIL-2 competitor, and its official prompt dialect is **Chinese, appearance-only, no action verbs** — a genuinely different dialect from everything in the corpus. | **High** |
| 7 | `_cross/chinese-prompting.md`: "no primary evidence of ZH advantage" for motion/aesthetics | Still true for positive prompts. But a reproducible community A/B on the **negative** prompt (shared workflow JSON, side-by-side stills) supports keeping the ZH default negative untranslated on the Wan family. | Medium |
| 8 | LTX 2.3 guidance treats camera-drift as prompt-fixable | **[TESTED-LOCAL]** On RTX 5090, same input image + same prompt, LTX-2.3 distilled I2V zoomed out and drifted while Wan 2.2 held a fixed camera. The tester explicitly flags prompt-side stabilisation as *untested future work*. | Medium |

---

## 1. Fixed-seed / controlled prompt comparisons

### 1.1 Wan 2.2 motion prompting, amplitude/speed wording, fixed-camera compliance

**Nothing found** in the form requested: no Civitai article, Reddit methodical
post, Banodoco summary, or YouTube test was located that holds seed fixed and
varies *only* motion-amplitude/speed wording on Wan 2.2 and publishes the grid.
Searches for "Civitai Wan 2.2 same-seed prompt A/B", "r/StableDiffusion Wan 2.2
prompt adherence test same seed" and "Banodoco Wan prompt testing" returned
workflow packages and marketing guides, not controlled wording ablations. Treat
all amplitude/speed advice in `wan22.md` as [OFFICIAL]-derived, still unverified.

What *does* exist, and is stronger evidence than anything community-side:

**[TESTED-PAPER] AnimationBench (arXiv:2604.15299, 2026-04-16)** — Camera Motion
Consistency (CMC) over seven commanded motions (`pan left`, `pan right`,
`tilt up`, `tilt down`, `zoom in`, `zoom out`, `static`), 70 videos per model,
CoTracker point tracking following the VBench++ heuristic. Wan 2.2 run on local
open weights (14B, 45 GB GPU, 832×480 or 720×1280).

| Model | CMC | Local or hosted |
|---|---|---|
| **Wan 2.2** | **42.86** | local weights |
| Sora2-Pro | 42.86 | API |
| HunyuanVideo | 57.14 | local weights |
| Framepack | 71.43 | local weights |
| Veo3.1 | 80.36 | API |
| Seedance-Pro | 87.50 | API |
| Kling2.6 | 94.64 | API |
| Seedance2.0 | 96.42 | API |

42.86 = 3/7 exactly, 57.14 = 4/7, 71.43 = 5/7 — the quantisation implies
whole-motion-type failures, not partial credit. No per-motion-type breakdown is
published, so we cannot say whether `static` specifically is one of the three
Wan gets right.

The same Wan 2.2 row is the single most useful "what does Wan actually follow"
datapoint found in this pass:

```
Wan2.2  Scene Depiction 96.43 | Object types 72.62 | Motion Rationality 57.26
        Actions 54.76 | Camera Motion 42.86 | Dynamic Degree 76.67
```

Interpretation [SYNTHESIS from TESTED]: **Wan 2.2 follows what is in the frame
far better than how the camera moves or what the subject does.** It also beats
every other open model tested on semantic content (HunyuanVideo Objects 25.00,
Framepack 35.71) while losing to both on camera.

Corroborating, on a different open-weight set — **[TESTED-PAPER] VBench-2.0
(arXiv:2503.21755)**, Camera Motion dimension (nine motion types, CoTracker-v2,
~70 prompts/dimension, human-alignment 97.95%, seed 42, 8×A100 for the open
models): HunyuanVideo 33.95%, CogVideoX-1.5 33.33%, Sora-480p 27.16%, versus
hosted Kling 1.6 at 61.73%. Wan is *not* in VBench-2.0's roster (it appears only
as anomaly-detector training data). Both benchmarks use the same measurement
family, so the open-vs-hosted camera gap is consistent across two independent
papers.

**AnimationBench prompt-refinement loop**: the paper runs a VLM that generates
diagnostic questions and feeds them to a prompt refiner; applied to Wan 2.2 it
reports *"this approach fixed the majority of the issues, leading to a
significant improvement in the semantic consistency of the generated videos."*
**No numeric before/after delta is published**, and it targeted semantic
consistency, not camera. [LORE-grade claim inside a TESTED paper.]

### 1.2 Does prompt rewriting help on Wan? Yes for some elements, measurably harmful for others

**[TESTED-PAPER] Anchored Video Generation (arXiv:2512.16371, EPFL)** is the most
directly useful paper found. It runs `T2V raw` vs `T2V (upsampled)` vs `Anchored`
on **Wan 2.2 5B, Wan 2.2 14B, Wan 2.1 1B, CogVideo 1.5 5B**, all local open
weights, all numbers averaged over **5 seeds**, on T2V-CompBench and VBench 2.0.
"Upsampled" = LLM prompt expansion (the paper does not state which LLM produced
those — flag as an unspecified detail).

T2V-CompBench, raw → upsampled (Δ):

| Element | Wan 2.2 5B | Wan 2.2 14B |
|---|---|---|
| Consistent Attribute | 0.814 → 0.866 (+) | 0.844 → 0.897 (+) |
| **Dynamic Attribute** | **0.177 → 0.137 (−23%)** | **0.127 → 0.084 (−34%)** |
| Spatial Relationship | 0.577 → 0.606 (+) | 0.639 → 0.643 (+) |
| **Motion Binding** | **0.257 → 0.245 (−)** | **0.299 → 0.291 (−)** |
| Action Binding | 0.487 → 0.509 (+) | 0.624 → 0.675 (+) |
| Object Interaction | 0.629 → 0.690 (+) | **0.765 → 0.762 (−)** |
| Generative Numeracy | 0.419 → 0.523 (+) | 0.553 → 0.605 (+) |
| **Average** | 0.480 → 0.511 (**+6.46%**) | 0.550 → 0.565 (**+2.73%**) |

Dynamic Attribute regressed in **4/4** models; Motion Binding in **3/4**.

VBench 2.0 per-metric (Table 7), raw → upsampled — this is the clearest
"which prompt elements respond to wording" table located anywhere:

| Metric | Wan 2.2 5B | Wan 2.2 14B | CogVideoX 5B |
|---|---|---|---|
| **Camera Motion** | **0.1630 → 0.4963 (3.0×)** | **0.2148 → 0.5407 (2.5×)** | 0.2500 → 0.2407 (−) |
| Material | 0.4031 → 0.7348 | 0.5916 → 0.8011 | 0.4271 → 0.6237 |
| Mechanics | 0.5848 → 0.6890 | 0.5837 → 0.7464 | 0.6742 → 0.6438 (−) |
| Motion Order | 0.2449 → 0.3354 | 0.2929 → 0.4182 | 0.0670 → 0.0793 |
| **Dynamic Spatial Rel.** | **0.3594 → 0.3246 (−)** | **0.4203 → 0.3246 (−23%)** | 0.1507 → 0.1797 |
| **Instance Preservation** | **0.8800 → 0.7880 (−)** | **0.8770 → 0.7851 (−)** | 0.7400 → 0.7439 |
| **Human Identity** | **0.6826 → 0.6133 (−)** | **0.6919 → 0.5509 (−20%)** | 0.7803 → 0.8190 |

Two consequential reads:

1. **Camera wording *is* highly responsive on Wan** (3× on 5B) even though Wan's
   *absolute* camera score is poor. Reconciling with §1.1: naming the camera
   move matters a lot relative to not naming it, but even a well-named camera
   move is only obeyed roughly half the time. Both statements are true; the app
   should require an explicit camera clause **and** warn that compliance is
   best-effort.
2. **Prompt inflation costs identity and instance preservation.** This is a
   direct, numeric argument for the corpus's existing "delete first: repeated
   quality words, awards, emotional interpretation" rule — now [TESTED] rather
   than [SYNTHESIS].

Note the transferability warning: camera terms are the most prompt-responsive
dimension on Wan and the *least* on CogVideoX (slightly negative). Prompt advice
does not port across backbones.

**Sobering baseline for any prompt tool** (same paper, Table 6): on Wan 5B, the
standard deviation *across random seeds* is 0.2180 on Action Binding and 0.2401
on Object Interaction — **larger than the entire measured effect of prompt
upsampling on those metrics** (+0.022 and +0.061). Verbatim: *"T2V is 9× more
variable with respect to seed than with respect to image anchors."*
Implication for the teaching app: any single-generation A/B a user runs is
noise. Recommend 3–5 seeds before believing a wording change.

**Low-step interaction, a real negative result**: at 15 sampling steps the
upsampled prompt's entire advantage evaporates — Wan 5B upsampled average 0.3983
vs raw 0.3985. Verbatim: *"The upsampled variant follows a similar trend but
appears even more unstable (−10.2% and −22.0%)."* Relevant because most local
users run distilled/Lightning 4–8 step workflows.

**[TESTED-PAPER] RAPO++ (arXiv:2510.20206)** — five open-source T2V models
(LaVie, Latte, HunyuanVideo, CogVideoX-5B, Wan2.1; size unstated for Wan). The
rewriting tables cover LaVie and Latte only; Wan appears only in physics tables.
Its value here is the **negative result on generic rewriters**:

| LaVie, VBench | Total | Human Action | Object Class |
|---|---|---|---|
| raw prompt | **80.89%** | **95.80%** | **92.09%** |
| + GPT-4 refiner | 79.69% | 83.80% | 88.73% |
| + Open-Sora-style Prompt Refiner | 79.75% | 87.00% | 91.29% |
| + Promptist | 79.13% | 81.00% | 71.04% |
| + PAE | 79.17% | 82.40% | 73.23% |
| + RAPO++ (distribution-matched) | 82.65% | 99.20% | 98.78% |

**All four generic LLM rewriters score below the raw prompt.** Same pattern on
T2V-CompBench: every generic rewriter is below raw on all four compositional
metrics for both models. The paper's thesis is explicitly *match the training
caption distribution's length, do not maximise length*:

> "other methods generate longer prompts that contain excessive details and
> complex vocabulary, which may be counterproductive"

> "Simply attempting to optimize prompts by manually adding random descriptions
> can potentially mislead models and degrade the quality of generative results."

Module ablation (LaVie, VBench Total, raw = 80.89%): word-augmentation alone
**80.37%**, sentence-refactoring alone **79.75%** — *both worse than doing
nothing*; all three modules together 82.38%. Rewriter LLM barely matters:
GPT-4 82.38 / Mistral 82.25 / LLaMA 82.10 — a local 7B rewriter is adequate.

Known counting failure, verbatim: *"when prompts explicitly specify object
counts — such as 'five parrots' or 'three giraffes' — the generated videos often
fail to match the intended number of entities."*

**[TESTED-PAPER] 3R (arXiv:2603.01509)** — LaVie only, EvalCrafter, 2 seeds.
Prompt rewriting alone ("One Prompt") = +7 total but **−0.95 on Text-Video
Alignment** (68.49 → 67.54). Iterative VLM-critique rewriting is a hard negative:
Text-Video Alignment 69.44 → 66.35. Verbatim: *"vision-language model critique
degrades text-video alignment severely due to it's over-correction nature."*
Relevant to any "critique-and-revise" loop we might build into the app. Note
they declined to use Wan for cost reasons, so this is not Wan evidence.

### 1.3 LTX prompt length — does 150+ words really beat 50?

**Nothing found.** No controlled length sweep exists for LTX at any version. No
paper in this pass contains a numeric prompt-length ablation for any video model
(RAPO++ comes closest with a distribution plot but publishes no word counts).
The competing recommendations are all assertion:

- **[OFFICIAL]** ComfyUI-LTXVideo enhancer: ≤150 words. Still the strictest.
- **[STAFF]** ltx.io adherence article (2026-05-13): *"The documentation
  recommends keeping prompts within 200 words. Longer prompts tend to dilute the
  model's attention."* No test behind it.
- **[OFFICIAL, current]** The LTX-2.5-era docs prompting guide **drops the word
  cap entirely** and gives shape guidance instead: *"Aim for roughly 4–8
  descriptive sentences"* for a single shot, and *"a longer screenplay-style
  scene can run longer, provided every sentence adds concrete visual or audio
  detail."*
- **[OFFICIAL, current]** The live `gemma_t2v_system_prompt.txt` on LTX-2 `main`
  contains **no word limit at all** (verified verbatim this pass).

**Corpus action**: `ltx23.md` presents the 150 vs 200 conflict as resolved by
preferring 150 in enhancer mode. That is still defensible for the *ComfyUI
enhancer node*, but it should be stated that the current official guidance has
moved to a sentence-count heuristic with no word cap, and that **no measured
evidence supports any of the three numbers.**

Indirect evidence that bears on it: AVG and RAPO++ both show LLM-expanded prompts
buying composition at the cost of dynamics/identity. That is an argument for the
lower end of any band, but it was measured on Wan/CogVideo, **not LTX** — LTX
appears in none of the prompt-optimisation papers.

### 1.4 Prose vs structure

**Nothing found** as a controlled comparison on Wan or LTX. Both models' official
dialects are prose (Wan: extender emits flowing description; LTX: "single
continuous paragraph in natural language"), and no test contradicts or confirms
that tag-style input is worse.

One adjacent [TESTED-PAPER] datapoint, on a different model, argues **structure
beats prose** for a specific element — **SpatialAlign (arXiv:2602.22745)**,
Wan2.1-1.3B baseline, 30-prompt subset, spatial-relation correctness:

| Prompt form | Baseline score |
|---|---|
| plain two-clause structured (`A is on the left of B, then A runs to the right of B`) | **0.180** |
| ChatGPT-augmented (LLM-embellished) | 0.107 |
| Qwen2.5-augmented | 0.180 |
| collapsed to single "from … to …" clause | 0.107 |

LLM embellishment and clause-collapsing each cut spatial adherence ~41%
relative. **Terse explicit two-stage structure is the best-performing phrasing
for spatial change.** [TESTED-PAPER, but Wan 2.1 1.3B, not 2.2 — do not
over-transfer.]

### 1.5 Wan negative-prompt ablation: Chinese default vs English translation

**[TESTED-LOCAL, community, single-workflow A/B]** — the closest thing to a real
ablation found. Origin: r/comfyui thread "Don't replace the Chinese text in the
negative prompt in wan2.1 with English" (2025-06); mirrored with both prompt
strings, both output stills side by side, and a downloadable
`Wan2.1_Negative_CN.json` workflow at
`scrapbox.io/work4ai/…` (Japanese, nomadoor).

Protocol visible: one ComfyUI workflow, the only variable is the negative prompt
text (the published Chinese default vs a careful English translation of the same
list); two output stills labelled "← 中国語 / 英語 →". Not seed-swept, not scored,
n=1 pair. Author's verdict on the images: *"たしかに…🤔"* ("indeed…, hm").
Also states plainly: **positive prompt language did not seem to matter**
(「Positiveの方はどっちでも良いらしい」).

Status: **Wan 2.1, not 2.2.** No 2.2-specific replication found. Independent
[STAFF/LORE] corroboration only: ViewComfy's Wan 2.2 guide says *"Negative
prompts are more reliably enforced in this version. We typically use the default
chinese one."*

**Nothing found** for the third arm of the requested ablation — *no* negative
prompt vs the default. Nobody has published that comparison.

Recommended corpus wording: keep the ZH default negative untranslated (weak
[TESTED] + [OFFICIAL] default + on-distribution reasoning), but label it
"Wan 2.1 evidence, assumed to carry to 2.2", and do not claim a magnitude.

---

## 2. Chinese vs English A/B on Wan (beyond text rendering)

**Nothing found** in the form requested. No study, grid, or methodical community
post was located that A/Bs a Chinese positive prompt against an English positive
prompt on Wan 2.2 (or any bilingual video model) and measures motion quality,
aesthetics, or adherence.

What was found, all weak:

- **[TESTED-LOCAL, weak]** The negative-prompt A/B above explicitly reports the
  *positive* prompt language as not mattering ("どっちでも良いらしい"). n=1.
- **[LORE]** A third-party guide asserts different optimal lengths per language:
  *"English: 80–120 words delivers the richest results; Chinese: aim for 50–80
  characters."* No methodology; note that its Chinese figure is *below* the
  official Wan extender band of 60–200 characters, so it should not override
  `wan22.md`.
- **[TESTED-PAPER, adjacent]** A demographic-bias paper reports that for
  Hunyuan, Qwen and Wan 2.1, *Chinese prompts slightly increase the proportion of
  Asian faces, but not enough to match Chinese population distribution.* This is
  a real measured language effect, but it is a **subject-demographics prior**,
  not a motion or aesthetic quality effect.

**New and consequential**: the Wan family's own newest release inverts the
corpus's "English is safe" default for one model. **Wan-Animate-2**'s official
inference command and Diffusers snippet both use a **Chinese** prompt, and the
model card ships a **Chinese** captioner instruction to produce it (§5.2). That
is [OFFICIAL] evidence that at least one current Wan-family model has a
Chinese-native prompt dialect.

Verdict for `_cross/chinese-prompting.md`: the decision table row for Wan 2.2
stands as written. Add a note that **no measured motion/aesthetic ZH-vs-EN
evidence exists for any video model as of this date**, and add a Wan-Animate-2
row where Chinese is the documented default.

---

## 3. LTX-2.5 — status, prompt-guide differences, does 2.3 guidance transfer?

**[OFFICIAL] Status: confirmed shipped and local.** `Lightricks/LTX-2.5` on HF,
gated (contact-info click-through), LTX-2.x Community License (free commercial
use under $10M revenue), ~378k downloads last month, paper arXiv:2601.03233
("LTX-2: Efficient Joint Audio-Visual Foundation Model", 2026-01-06).

Ships as a **split, Comfy-aligned pack** rather than a monolith:

- `ltx-2.5-22b-distilled-transformer-bf16` — *"Fixed 8-step schedule, CFG=1."*
- `ltx-2.5-22b-dev-transformer-bf16` — full/trainable
- `…-comfy-int8-convrot` variants — **ComfyUI only, not for `ltx-pipelines`**
- `…-nvfp4` — Blackwell
- `text_encoders/gemma4-12b-with-proj-ltx-2.5-bf16` — **Gemma 4 12B**, custom
- `vae/…-video-vae` (DiffVAE, heavier) vs `…-video-vae-conv` (faster)
- `model_patches/ltx-2.5-duration-head-bf16` — auto duration when `--num-frames` omitted
- Constraints: `num_frames % 8 == 1`; W and H divisible by 32
- Quirk worth recording: the distilled pipeline still needs the **LTX-2.3**
  spatial upscaler (`ltx-2.3-spatial-upscaler-x2-1.1.safetensors`).

**What's new that changes prompting** [OFFICIAL, model card]:

1. **Native multishot generation** — *"generate connected scenes in a single
   pass: multiple shots that hold character identity, environment, lighting,
   voice, and visual style across cuts (previous versions produced a single
   continuous shot)."*
2. **Custom Gemma 4 12B text encoder** — *"holds complex prompts together
   (multiple characters, camera moves, lighting, actions) instead of dropping
   details across a longer sequence."*
3. **Duration predictor (optional)** — predicts clip length from the prompt.
4. Prompt enhancer, diffusion fidelity rendering, new diffusion video decoder.

**Does 2.3 guidance transfer?** Mostly yes, with three explicit deltas.

- **[OFFICIAL] LoRA transfer**: *"Based on our testing, the large majority of
  LoRAs and IC-LoRAs trained on LTX-2.3 run on LTX-2.5 without changes. A small
  number of exceptions exist — validate your adapters before production use."*
  So the corpus's Pose Control / Motion Track Control / Union Control routing
  advice survives.
- **[OFFICIAL] Multi-shot is a genuine dialect change.** `ltx23.md` records the
  system-prompt rule *"no timestamps/cuts unless requested"*. For 2.5, cuts are a
  first-class feature with their own rules, from the current docs prompting guide:
  - Write the full scene as **one chronological paragraph**. *"Do not use a shot
    list, numbered beats, or screenplay sluglines unless you also describe the
    cut in prose."*
  - At every cut: **name the transition** in natural language ("A hard cut
    transitions to…", "A match cut connects…"), **re-establish** shot scale /
    angle / who is in frame / changed lighting, **re-identify** recurring
    subjects with the same visual identifiers, and **state audio continuity**
    ("the piano score continues across the cut").
  - *"Prefer 2–4 shots in one generation."*
  - For I2V from a first frame, *"prefer a single continuous take unless you
    intentionally describe a cut away from that opening image."*
- **[OFFICIAL] Length guidance changed shape** — see §1.3. Single shot ≈ 4–8
  descriptive sentences; no word cap in the current docs or in the live
  `gemma_t2v_system_prompt.txt`.

**What did NOT change** — verified verbatim against the live LTX-2 `main`
system prompt this pass, so the corpus's rules still hold:

```
- Camera motion: DO NOT invent camera motion unless requested by the user.
- Speech: DO NOT modify user-provided character dialogue unless it's a typo.
- No timestamps or cuts: DO NOT use timestamps or describe scene cuts unless explicitly requested.
- Format: DO NOT use phrases like "The scene opens with...".
- Style: Include visual style at the beginning: "Style: <style>, <rest of prompt>."
- Restrained language: Avoid dramatic/exaggerated terms.
- If the user's raw input prompt is highly detailed, chronological and in the requested format:
  DO NOT make major edits or introduce new elements. Add/enhance audio descriptions if missing.
```

Note the internal tension worth flagging in the app: the **enhancer** must not
invent cuts, but the **user** may request them and 2.5 supports them natively.

**New capability with its own prompt template** — Dub-It (speech replacement,
beta IC-LoRA), validated for English, French, Spanish, German, Russian:
`| [Speaker] is speaking [Language/Accent], saying: "[Dialogue]" |`. Requirements:
provide the full dialogue text (*"It does not translate dialogue for you"*),
write in **native script**, single speaker only. Best practice: *"keep your
prompt at roughly the same timing and syllable length as the original dialogue.
Slightly longer is better than too short."*

**Known 2.5 limits** [OFFICIAL]: on-screen text improved but *"exact spelling and
consistency across frames are not guaranteed"*; *"highly chaotic motion can still
introduce artifacts"*; and, from the model card's own Limitations, *"Prompt
following is heavily influenced by prompting style."*

**Nothing found**: no LTX-2.5-specific prompt-adherence blog (the ltx.io
adherence article is still the 2.3 one, dated 2026-05-13), no LTX-2.5 in any
benchmark located, and no tested comparison of 2.3 vs 2.5 prompt behaviour.

### 3.1 LTX-2.3 vs Wan 2.2, measured on local weights

**[TESTED-LOCAL]** zenn.dev / toki_mwc, published 2026-03-11, updated 2026-06-28.
RTX 5090 32 GB, Windows 11, ComfyUI v0.16.4, PyTorch 2.9.1+cu130. Both models at
GGUF Q4_K_M, **identical input image, resolution (832×480), frame count (81),
and prompt.**

| | LTX-2.3 22B distilled | Wan 2.2 14B |
|---|---|---|
| Warm generation | **22.1 s** | 125 s |
| Cold start | 48.5 s | 143.9 s |
| Steps / sampler | 8, ManualSigmas, CFGGuider cfg=1.0, euler | 6 (3+3), dpm++_sde |
| Camera stability | ❌ *"zooms out/scrolls on its own"* | ✅ *"Stable with fixed camera"* |
| Hands | ❌ breaks when visible | ⚠️ some blur, less breakdown |

Caption on the paired GIFs: *"Generated with the same input image and the same
prompt. LTX-2.3 zooms out and has high motion. Wan 2.2 has a fixed camera and
stable movement."*

Two things the corpus should absorb:

1. The **distilled** LTX-2.3 checkpoint has an intrinsic camera-drift tendency
   at 8 steps. The author explicitly lists prompt-side mitigation as untested
   future work: *"there is room for verification of stabilizing the distilled
   pipeline through prompt engineering (e.g., `fixed camera, no zoom, minimal
   motion`)."* So `fixed camera` on LTX distilled is **[SPECULATION], not a
   documented fix.**
2. `ltx23.md`'s existing warning "testing dev and distilled checkpoints with one
   settings/prompt assumption" is now backed by a measurement: the author also
   found that running the distilled model through the dev-oriented
   `MultimodalGuider` pipeline took **540 s** and produced background/camera
   drift — *"Poor compatibility with distilled model."*

Also useful for a teaching app: filename ambiguity is a real trap.
`ltx-2-19b-distilled-fp8.safetensors` is **LTX-2.0 (19B, ~23.5 GB)**, not 2.3
(22B, GGUF Q4 ~17.8 GB); the author benchmarked the wrong model for a while.

---

## 4. SCAIL-2

### 4.1 Does prompt detail measurably reduce identity errors in Replacement mode?

**Nothing found. This is a clean negative.**

The SCAIL-2 paper (arXiv:2606.10804; v2 2026-06-10, v3 2026-08-05 renumbers the
sections) **contains no prompt ablation at all**. "Prompt" appears three times:
in the abstract as *"soft guidance beyond textual instructions"*, in §3.1 as
`c_text` in the conditioning tuple, and as the "Prompt Weaver" — which is an
*image-editing* prompt used to synthesise training data via Nano Banana, not a
video caption.

The only measured ablations (Appendix D, Table 5, cross-identity multi-character
split of Studio-Bench, Video-Bench 1–5 scale):

| Method | Imaging Quality ↑ | Temporal Consistency ↑ | Appearance Consistency ↑ |
|---|---|---|---|
| w/o Binding Slots | 4.47 | 4.17 | **3.90** |
| w/o Replacement data | 3.90 | 4.13 | 4.10 |
| Full model | **4.63** | **4.23** | **4.13** |

> "Removing Binding Slots causes a clear drop in Appearance Consistency,
> demonstrating that the slots are key to keeping each character's identity
> intact."

Identity is a **mask/architecture** lever, not a prompt lever. The paper's only
finding about text conditioning is **negative**:

> "Without the environment switch, the model generates an arbitrary background,
> as it struggles to distinguish the two modes from textual cues alone."

The prompt-detail claim in the corpus traces to the README, unquantified
[OFFICIAL]:

> "Note that SCAIL-2 is trained with long, detailed prompts. Short prompts or an
> empty prompt can run, but detailed descriptions of the reference subject and
> motion usually produce better results."

Also missing from the paper: seed protocol (the word "seed" does not appear),
number of test cases, resolution, fps, frame count, number of human raters. GSB
win rates exist only inside figure images. So even the model's headline results
are not reproducible from the text. `scail2.md` should say this.

**Corpus action**: keep the 90–140-word replacement target as [OFFICIAL], but
downgrade any implication that prompt detail *fixes identity*. Route identity
failures to mask/Binding-Slot/resolution, which is what the numbers support —
which is what `scail2.md` already does. Good: the existing guidance survives
contact with the evidence.

### 4.2 Per-segment prompt swapping in long chains

**[OFFICIAL/MAINTAINER] Found, and it is structurally supported.** The official
ComfyUI tutorial (`docs.comfy.org/tutorials/video/zai/scail2`) ships a template
built from two subgraphs:

- **Base** subgraph = first segment (81 frames default)
- **Extend** subgraph = segments 2+, chaining `previous_frames`, incrementing
  `segment_index` (pose offset = `76 × (index − 1)`), `previous_frame_count` = 5
  overlap frames
- Segment count = `ceil(total_frames / 76)`
- **Both subgraphs expose their own `prompt` parameter** — so per-segment prompt
  variation is a first-class, officially templated capability.
- Caveat, verbatim: *"`WanSCAILToVideo` cannot queue all segments automatically.
  Run each segment manually."*
- Mode is set by `replace_mode` on **both** subgraphs (`true` = Replacement,
  driving-mask BG white; `false` = Animation, BG black).
- SAM3 open-vocabulary tracking terms (`sam3_video_object`, `sam3_image_object`,
  default `human`) *"control the SAM3 mask tracking, **not** the SCAIL-2 output
  prompt"* — a real footgun the app should surface.
- ComfyUI stack is Wan2.1-based: `wan2.1_14B_SCAIL_2_fp16`, umt5-xxl,
  clip_vision_h, Wan2.1 VAE, lightx2v distill LoRA, `wan2.1_SCAIL_2_DPO_lora`,
  `sam3.1_multiplex_fp16`. Resolution must be divisible by **16** in the Comfy
  path (the CLI README says 32) — note the discrepancy.

**Nothing found** on whether *varying* the prompt per segment measurably helps or
hurts continuity. No community test located. The paper's only long-video sentence
is: *"For long video generation, we follow Wan-Animate to randomly replace the
first 2 latents to be conditional history latents."* No chaining procedure, no
minute-scale claim.

Community workflows exist and can be cited as [LORE] for practice, not results:
Civitai "SCAIL-2 Single-Person Reference Editing Long-Video Workflow" (model
2694396) and "Two-Person" (2710817).

### 4.3 SCAIL-2.x update

**None found.** No SCAIL-2.1/2.5/3 exists. The only movement is paper revision
v2 → v3 (2026-08-05, section renumbering; ablations move from §4.5 to §4.4).

**Repo correction**: official is `github.com/zai-org/SCAIL-2`, branch
`wan-scail2`; HF `zai-org/SCAIL-2`; ComfyUI repack `Comfy-Org/SCAIL-2`; ModelScope
`ZhipuAI/SCAIL-2`. Preprocessing lives in a `SCAIL-Pose` submodule
(`process_animation_aio.py --e2e_mode`, `process_replacement.py --matchnearest`).
The corpus's `Ardynai/scail-2` citation should be replaced.

Everything else in `scail2.md` verified verbatim against the live README:
prompt-is-description-not-instruction, describe clothing + interacted objects,
512p/704p with pose-driven better at 704p, defaults `--sample_steps 40
--sample_shift 3.0 --sample_guide_scale 5.0 --sample_solver unipc`, Lightx2v
LoRA recipe 8 steps / shift 1 / guide 1.0. The enhancer is Gemini-based
(`GEMINI_API_KEY` required, `--num_frames 8`, few-shot from
`prompt_examples.txt`, outputs *"a long English description"*) — worth flagging
in a local-first app that the official enhancer is **not local**.

---

## 5. Wan updates since Aug 2026

### 5.1 Wan 2.5 / 2.6 / 2.7 / 3.0 open weights — do not believe the third-party sites

A cluster of SEO sites (`wan27.org`, `wan-3.io`, `orcarouter.ai`, `evolink.ai`)
asserts a detailed Wan release history — 2.5 (Sep 2025, commercial API, "promised
open, never shipped"), 2.6 (Dec 2025, closed), 2.7 (Mar 2026, "Apache 2.0
partial"), and **Wan 3.0 open weights 1.3B + 14B under Apache 2.0 shipped
~April 2026** with native 4K, 30-second clips and audio.

**Primary sources contradict the Wan 3.0 claim** [OFFICIAL, checked this pass]:

- `github.com/Wan-Video` has exactly **4 repositories**: Wan2.1, Wan2.2,
  Wan-skills, and a diffusers fork. **Wan2.2 was last updated 2026-03-17.**
  There is no Wan2.5 / 2.6 / 2.7 / Wan3 repository.
- `huggingface.co/Wan-AI` lists **27 models**, all in the Wan 2.1/2.2 families
  plus Wan-Dancer-14B. Newest entries are Wan2.2-Animate-2 (3–7 days ago) and
  Wan-Dancer-14B (30 days ago). **No Wan 3.0, no 1.3B or 14B Wan-3 checkpoint.**
- The wan27.org article's own sourcing for the release is a **LinkedIn post**,
  and it hedges throughout ("were reported released", "reported by industry
  trackers").

Label: **[SPECULATION] — Wan 3.0 open weights are not verifiable from any primary
source as of 2026-08-15. Do not add Wan 3.0 to any local selector.** The same
caution the corpus already applies to Qwen-Image 3.0 and FLUX 3 applies here,
more strongly.

Secondary claims in the same cluster that we can neither confirm nor deny from
primary sources: the 2.5/2.6/2.7 API-only history, and WanSong / Wan-Streamer.
Partial confirmation only: HF `Wan-AI` does host **Wan-Dancer-14B** and papers
"WanSong v1.0 Technical Report" (2607.14749) and "Video = World + Event Stream"
(2607.15038), so the *ecosystem* expansion is real even if the version history is
not verified.

### 5.2 Wan-Animate-2 — a genuine new open-weight local target [OFFICIAL]

`Wan-AI/Wan2.2-Animate-2-14B` and `…-Distilled`, **Apache 2.0**, released
**2026-08-07**, paper arXiv:2608.06009 ("Wan-Animate-2: Pushing the Application
Boundaries of Character Animation Models"). Diffusers-integrated
(`WanAnimate2Pipeline`, PR #14412), DiffSynth-Studio and ComfyUI integrations
marked done. This is Alibaba's direct answer to SCAIL-2 and should be considered
for the model selector.

> "We present Wan-Animate-2, a novel end-to-end character animation framework
> that directly consumes driving videos in a redesigned Diffusion Transformer,
> which achieves high-fidelity motion generation and strong identity preservation
> by eliminating intermediate motion extractors. **We further add text-driven
> viewpoint control to decouple the output camera perspective from the driving
> video.** In addition, we develop Wan-Animate-2-Lite, an efficient variant that
> reduces inference latency to real-time thresholds for streaming character
> animation."

**Its prompt dialect is new and Chinese-native** — this matters for the app.
The model card instructs you to caption the *reference image* with an LLM
(*"e.g. Qwen3.7-Plus"*) using this exact Chinese instruction, then use the
caption as the prompt:

```
用中文客观描述图片中的内容，包括以下要点：人物外观描述，不描述动作行为。
背景描述，忽略主观评价和情绪推测。
下面给出描述范例，必须遵循这个范式，不要输出额外的符号：
人物外观描述：穿着一件浅蓝色的校服衬衫，领口和袖口有白色边饰。胸前有一个圆形徽章。
背景描述：背景为明亮、整洁的教室或办公室，氛围安静有序。
```

Three properties worth recording, all [OFFICIAL] and all *different from
SCAIL-2*:

1. **Two labelled fields**, not free prose: `人物外观描述：…` then `背景描述：…`.
2. **Explicitly no action description** (`不描述动作行为`) — the opposite of
   SCAIL-2's "describe the final generated video including action". Motion comes
   entirely from the driving video.
3. **Chinese is the documented language**, with the official examples in Chinese
   in both the CLI and the Diffusers snippet.

Sampling: Base 40 steps; Distillation **10 steps, `guidance_scale=1.0` (no CFG),
euler**. Defaults tuned for 8×A800 at 720P; 480P tested on 2×A800. Example
resolution in Diffusers: 800×640, 24 fps.

`Wan-Animate-2-Lite` is announced in the abstract but **no Lite weights are
published on the HF org as of this date** — do not list it as available.

### 5.3 No Wan 2.2 prompt-guide changes

The Wan2.2 repo has not been touched since 2026-03-17. `system_prompt.py`
constants, the Alibaba Cloud prompt guide, and the ModelScope negative list are
unchanged relative to the corpus baseline. `wan22.md`'s [OFFICIAL] section stands.

---

## 6. Prompt-adherence benchmarks — what do they say Wan/LTX actually follow?

Consolidated from the four benchmark papers read in full this pass. **Object
counting is measured by none of them** — VBench-2.0 has no counting dimension
and flags counting as a weakness of the *evaluator* VLMs; SpatialAlign uses
counts only as a validity filter; AnimationBench and MMGR have no counting
metric. T2V-CompBench's "Generative Numeracy" (via AVG) is the only proxy:
Wan 2.2 5B 0.419, 14B 0.553.

**Ranking of prompt elements by how well open models obey them:**

| Prompt element | Evidence | Verdict |
|---|---|---|
| Static scene / object content | Wan 2.2 Scene Depiction **96.43**, Objects **72.62** (AnimationBench) | Reliably followed |
| Consistent attributes | Wan 2.2 14B 0.844 (T2V-CompBench) | Good |
| Subject actions | Wan 2.2 Actions **54.76** (AnimationBench) | Mediocre |
| Camera motion | Wan 2.2 CMC **42.86** (AnimationBench); HunyuanVideo 33.95 / CogVideoX-1.5 33.33 (VBench-2.0) | **Poor** on open weights; big gap to hosted |
| Motion order | Wan 5B 0.2449, Wan 14B 0.2929 raw (VBench 2.0 via AVG) | Poor |
| Dynamic attributes (things changing) | Wan 5B 0.177, Wan 14B 0.127 (T2V-CompBench) | **Very poor** |
| Dynamic spatial relations | LTX-Video-2B **0.058**, Wan2.1-1.3B **0.125** Correct@0.7 (SpatialAlign); all VBench-2.0 models 19–21% | **Worst measured** |
| Counts | not measured by any benchmark found | Unknown; RAPO++ reports qualitative failure |

VBench-2.0's own summary of the spatial/dynamic failure, verbatim:
> "Most models perform poorly in capturing Dynamic Spatial Relationships and
> Dynamic Attributes. Even in relatively simple cases … models fail in about 80%
> of the time. These shortcomings … are likely due to inadequate captioning
> granularity in video generation datasets."

**The most important benchmark statement for a prompt-teaching app**, VBench-2.0,
verbatim:

> "Limited Impact on Knowledge-Driven Dimensions. For dimensions that rely on
> model's intrinsic visual understanding and prior knowledge, like Human
> Fidelity, **Camera Motion**, Geometry, and Commonsense, we observe **no
> consistent performance trend from models using different Prompt Refiners** …
> success in these areas may depend less on prompt engineering and more on
> underlying data quality and model architecture."

Counterpart, same paper: *"Prompting Partially Compensates for Physical
Reasoning Gaps … models can be steered toward physically plausible outcomes
through carefully designed prompts."* And a cost: prompt refinement *"may improve
controllability by fine-graining the text at the expense of diversity."*

**Note the apparent conflict with AVG's Camera Motion 3× jump** (§1.2). They are
not actually incompatible: VBench-2.0 compared *different refiners against each
other* on HunyuanVideo/CogVideoX-1.5; AVG compared *raw vs any expansion* on Wan.
Honest synthesis: **saying something about the camera beats saying nothing;
which refiner you use, and how ornately, does not measurably matter — and the
ceiling is low regardless.**

**LTX in benchmarks**: essentially absent. LTX appears in exactly one of the nine
papers surveyed — SpatialAlign, and only as **LTX-Video-2B** (an old, small
checkpoint), where it is near-worst on spatial correctness (0.058) while topping
ID Consistency (0.8028) and near-topping CLIP-IQA (0.9061). **Visual quality and
instruction adherence are decoupled.** No LTX-2.x version appears in any
benchmark located. State this plainly in the corpus: **we have no benchmark
evidence about LTX 2.3 or 2.5 prompt adherence.**

**MMGR (arXiv:2512.14691)** — the corpus already cites this for Wan 2.2 spatial
gaps. Confirmed and quantified. Wan 2.2 is the only open-weight video model in
the roster (*"recommended configurations"*, but the variant, resolution and step
count are never stated — a real reproducibility gap):

- 2D Maze Overall: **0.83–5.00%** across six configs (Veo-3: 38.69–51.50%)
- Maze "Cross Wall" rate (lower better): **79.17–90.83%** — *"they treat walls as
  visual suggestions rather than impermeable boundaries"*
- Sudoku "Clues Changed": **99.33–100%** on 4×4, **85.33–91.00%** on 9×9 — it
  essentially always destroys given content in the conditioning image
- ARC-AGI v1 Overall **0.17%**; v2 Overall **0.00%**

Caveat for our use: MMGR is a *reasoning* benchmark. These numbers say Wan 2.2
cannot execute symbolic/planning tasks; they do not directly bear on
cinematographic prompt adherence. Cite them for "do not expect exact spatial
choreography from text", which is what `wan22.md` already does.

**Sci-VBench** (16 video models scored on science) and **T2VPhysBench**,
**GeoT2V-Bench**, **MemoBench**, **MMPhysVideo** surfaced in searches but were
not read in this pass. Flag as follow-up.

### 6.1 EvalCrafter successors

EvalCrafter itself (700 prompts, 17 metrics) is still in active use as a
secondary benchmark (RAPO++, 3R). The successor landscape found: **VBench-2.0**
(18 dimensions, intrinsic faithfulness), **T2V-CompBench** (7 compositional
categories — the most prompt-element-aligned), **MMGR** (generative reasoning),
**AnimationBench** (character-centric, 20 dimensions incl. CMC),
**SpatialAlign/DSR-Dataset** (dynamic spatial relations), **Wan-Bench**
(Alibaba's own, 3 dimensions × 14 fine-grained metrics), **Studio-Bench** and
**X-Dance** (character animation, used by SCAIL-2). For our purposes
**T2V-CompBench and AnimationBench are the two that map most directly onto
prompt elements a user types.**

---

## 7. "Nothing found" register

Stated explicitly, per the brief. Each of these was searched for and not located:

1. Fixed-seed side-by-side grid varying **only** Wan 2.2 motion amplitude/speed
   wording. None.
2. Fixed-seed grid testing Wan **fixed-camera compliance** as a function of
   phrasing (`fixed camera` vs `静止` vs `固定机位` vs nothing). None.
3. Controlled **LTX prompt-length sweep** (50 vs 100 vs 150 vs 200 words). None,
   at any LTX version, from any source.
4. **Prose vs structured/tag** prompt comparison on Wan or LTX. None.
5. Wan negative-prompt ablation with a **"no negative prompt"** arm. None.
6. **Chinese vs English positive-prompt** A/B measuring motion or aesthetics on
   any bilingual video model. None.
7. **SCAIL-2 prompt-detail ablation** for Replacement-mode identity error. None —
   the paper has no prompt ablation whatsoever.
8. Test of whether **per-segment prompt variation** in SCAIL-2 long chains helps
   or hurts. None (the capability is documented; its effect is not measured).
9. **LTX-2.5 in any benchmark**, or an LTX-2.5-specific adherence guide. None.
10. Any **Banodoco Discord** prompt-testing summary republished with methodology.
    None (a Banodoco knowledge base and a HF discord-archive dataset exist and
    are a plausible future mining target).
11. Verified **Wan 3.0 / 2.7 / 2.6 / 2.5 open weights** on any primary source.
    None.

---

## 8. Concrete corpus edits recommended

Ordered by value.

1. **`wan22.md` → motion/composition table.** Change the "Camera drifts" row
   evidence from `[OFFICIAL] guide` to `[OFFICIAL] guide + [TESTED] AnimationBench
   CMC 42.86% — naming the camera helps (AVG: 0.163→0.496 with prompt expansion)
   but obedience is roughly 3/7 even when named.` Add a validator behaviour:
   when a fixed camera is requested, show a best-effort notice, same treatment
   as the existing exact-pose warning.
2. **`_cross/verbosity.md` → add a "measured costs of verbosity" block.** Cite
   AVG (Dynamic Attribute −23%/−34%, Human Identity −20% on Wan 14B, Instance
   Preservation −0.09 on both) and RAPO++ (all four generic rewriters below raw
   on VBench Total). This converts the "delete first" list from [SYNTHESIS] to
   [TESTED].
3. **New `_cross` note or `settings-context.md` addition: seed variance.** AVG:
   Wan 5B σ across seeds = 0.218 (Action Binding), 0.240 (Object Interaction),
   *"T2V is 9× more variable with respect to seed than with respect to image
   anchors."* The app should tell users to fix the seed and run 3–5 seeds before
   trusting a wording change. Also: prompt expansion's benefit vanishes at 15
   steps — relevant to every Lightning/distilled workflow.
4. **`ltx23.md` → add an "LTX-2.5 delta" section** covering multi-shot cut
   grammar (2–4 shots, name the transition, re-establish, re-identify, state
   audio continuity), the removal of the word cap in current docs, the duration
   head, Dub-It's template, and the LoRA-transfer statement. Keep the 150-word
   enhancer rule scoped to the ComfyUI enhancer node.
5. **`ltx23.md` → distilled-checkpoint camera drift.** Add the zenn RTX 5090
   result and mark `fixed camera, no zoom` on distilled LTX as [SPECULATION].
6. **`scail2.md` → fix the repo URL** to `zai-org/SCAIL-2`; add the ComfyUI
   segment-chaining parameters (81 frames, 76 stride, 5 overlap, per-segment
   `prompt`, manual queueing, SAM3 terms ≠ output prompt, W/H ÷16 in Comfy vs
   ÷32 in CLI); add "the paper contains no prompt ablation and no seed protocol";
   note the enhancer needs a Gemini API key (not local).
7. **`new-models.md` → three edits.** (a) Add **Wan-Animate-2** as a confirmed
   new Apache-2.0 local target with its Chinese two-field appearance-only prompt
   dialect. (b) Add an explicit **"Wan 3.0: not verifiable, do not add"** entry.
   (c) Upgrade the LTX-2.5 entry with the split-pack file list and the 2.3
   spatial-upscaler dependency.
8. **`_cross/chinese-prompting.md`.** Add: no measured ZH-vs-EN motion/aesthetic
   evidence exists for any video model; the one community A/B says positive-prompt
   language did not matter and only the negative did; add a Wan-Animate-2 row
   with Chinese as the documented default.
9. **New `_cross` section on benchmark-grounded element priorities** — the table
   in §6 is directly usable as teaching content: tell users which parts of their
   prompt the model will probably honour and which it will probably ignore.

---

## Sources

Primary / official:

- [Lightricks/LTX-2.5 model card](https://huggingface.co/Lightricks/LTX-2.5) — [OFFICIAL], accessed 2026-08-15.
- [LTX docs prompting guide (2.5-era)](https://docs.ltx.io/open-source-model/usage-guides/prompting-guide) — [OFFICIAL], accessed 2026-08-15.
- [LTX-2 `gemma_t2v_system_prompt.txt` (main branch, verbatim)](https://raw.githubusercontent.com/Lightricks/LTX-2/main/packages/ltx-core/src/ltx_core/text_encoders/gemma/encoders/prompts/gemma_t2v_system_prompt.txt) — [OFFICIAL], accessed 2026-08-15.
- [LTX-2 repository](https://github.com/Lightricks/LTX-2) — [OFFICIAL], accessed 2026-08-15.
- [Wan-AI HF organization (27 models, no Wan 3.0)](https://huggingface.co/Wan-AI) — [OFFICIAL], accessed 2026-08-15.
- [Wan-Video GitHub organization (4 repos, newest Wan2.2 @ 2026-03-17)](https://github.com/Wan-Video) — [OFFICIAL], accessed 2026-08-15.
- [Wan-AI/Wan2.2-Animate-2-14B model card](https://huggingface.co/Wan-AI/Wan2.2-Animate-2-14B) — [OFFICIAL], released 2026-08-07, accessed 2026-08-15.
- [zai-org/SCAIL-2 README (branch `wan-scail2`)](https://github.com/zai-org/SCAIL-2/blob/wan-scail2/README.md) — [OFFICIAL], accessed 2026-08-15.
- [ComfyUI SCAIL-2 tutorial (segment chaining, per-segment prompt)](https://docs.comfy.org/tutorials/video/zai/scail2) — [OFFICIAL/MAINTAINER], accessed 2026-08-15.

Tested / papers:

- [AnimationBench (arXiv:2604.15299)](https://arxiv.org/pdf/2604.15299) — [TESTED-PAPER], Wan 2.2 CMC 42.86, local weights. Accessed 2026-08-15.
- [Anchored Video Generation (arXiv:2512.16371)](https://arxiv.org/html/2512.16371) — [TESTED-PAPER], Wan 2.2 5B/14B raw vs prompt-upsampled vs anchored, 5 seeds, local weights. Accessed 2026-08-15.
- [RAPO++ (arXiv:2510.20206)](https://arxiv.org/abs/2510.20206) — [TESTED-PAPER], generic rewriters below raw prompt; length-distribution thesis. Accessed 2026-08-15.
- [3R: Retrieval, Refinement, Ranking (arXiv:2603.01509)](https://arxiv.org/html/2603.01509v1) — [TESTED-PAPER], VLM-critique rewriting degrades alignment. LaVie only. Accessed 2026-08-15.
- [VBench-2.0 (arXiv:2503.21755)](https://arxiv.org/html/2503.21755v2) — [TESTED-PAPER], Camera Motion dimension; "no consistent trend from Prompt Refiners". Accessed 2026-08-15.
- [SpatialAlign (arXiv:2602.22745)](https://arxiv.org/html/2602.22745v1) — [TESTED-PAPER], LTX-Video-2B 0.058 / Wan2.1-1.3B 0.125 Correct@0.7; prompt-structure ablation. Accessed 2026-08-15.
- [MMGR (arXiv:2512.14691)](https://arxiv.org/html/2512.14691) — [TESTED-PAPER], Wan 2.2 reasoning failures. Accessed 2026-08-15.
- [SCAIL-2 paper (arXiv:2606.10804)](https://arxiv.org/abs/2606.10804) — [OFFICIAL/PAPER], Table 5 ablations; **no prompt ablation**. Accessed 2026-08-15.
- [Wan-Animate-2 paper (arXiv:2608.06009)](https://arxiv.org/pdf/2608.06009) — [OFFICIAL/PAPER], not read in full this pass. Accessed 2026-08-15.
- [LTX-2 paper (arXiv:2601.03233)](https://huggingface.co/papers/2601.03233) — [OFFICIAL/PAPER], not read in full this pass. Accessed 2026-08-15.

Tested / community:

- [LTX-2.3 22B vs Wan 2.2 14B on RTX 5090 (zenn.dev, toki_mwc)](https://zenn.dev/toki_mwc/articles/ltx23-vs-wan22-i2v-benchmark-rtx5090?locale=en) — [TESTED-LOCAL], 2026-03-11 / updated 2026-06-28, accessed 2026-08-15.
- [Wan2.1 Chinese-vs-English negative prompt A/B (work4ai scrapbox, mirroring r/comfyui)](https://scrapbox.io/work4ai/Wan2.1%E3%81%AE(%E3%83%87%E3%83%95%E3%82%A9%E3%83%AB%E3%83%88%E3%81%AE)Negative_Prompt%E3%81%AF%E4%B8%AD%E5%9B%BD%E8%AA%9E%E3%81%AE%E3%81%BE%E3%81%BE%E4%BD%BF%E3%81%A3%E3%81%9F%E3%81%BB%E3%81%86%E3%81%8C%E8%89%AF%E3%81%84) — [TESTED-LOCAL, n=1 pair, workflow JSON published], accessed 2026-08-15. Underlying thread: r/comfyui `1l4uz74` (2025-06).

Staff / lore (cited for what they claim, not as evidence):

- [LTX blog: How to improve LTX-2.3 prompt adherence](https://ltx.io/blog/how-to-improve-ltx-2-3-prompt-adherence) — [STAFF], 2026-05-13, accessed 2026-08-15. Source of the "under 200 words", cfg_scale 2.0–5.0 / audio 7.0, stg_scale 0.5–1.5, rescale_scale 0.7 figures, and the fixed-seed iteration advice.
- [ViewComfy Wan 2.2 guide](https://www.viewcomfy.com/blog/wan2.2_prompt_guide_with_examples) — [LORE], 2025-07-29. "80–120 words", "we typically use the default chinese one", "clips under 5 seconds", "don't go higher than 120 frames".
- [wan27.org Wan 2.2 prompt guide](https://wan27.org/blog/wan-2-2-prompt-guide) — [LORE]. Claims "200 hours, 2,000 prompts, four criteria" but publishes no seed protocol, no grid, no numbers. Its "25–80 words sweet spot" **conflicts** with the official 60–200 Han-character extender band; its "Wan 2.2 defaults to a mild push-in if no camera instruction is given" is an interesting, untested claim worth an experiment.
- [wan27.org: Is Wan 3.0 open source?](https://wan27.org/blog/wan-3-open-source) — [SPECULATION]. Contradicted by the Wan-AI HF org and Wan-Video GitHub org, both checked 2026-08-15.
