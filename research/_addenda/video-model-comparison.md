# Addendum — comparative capability guide to locally-runnable video models

Research pass: **2026-08-17**. All URLs accessed 2026-08-17 unless stated otherwise.
Companion to `_addenda/video-tested-evidence.md` (2026-08-15), which covers *prompt
technique*. This file covers **model capability**: what each model is actually best
at relative to the others, for teaching "reach for X when you need Y."

## Evidence labels

- **[OFFICIAL]** — model author, model card, official repo/docs, or the model's own paper.
- **[STAFF]** — vendor blog / vendor employee, not the canonical artifact.
- **[TESTED-PAPER]** — third-party paper with a published table and visible methodology.
- **[TESTED]** — someone ran it and published enough settings to be checkable.
- **[LORE]** — repeated claim, no visible methodology. Includes most "comparison" blog posts.
- **[SPECULATION]** — inference of mine, not supported by a located primary source.
- **[NO EVIDENCE]** — searched for, not found. Treated as a finding, not a gap to fill with a guess.

**Cloud/API models appear only as reference points and are marked `(CLOUD)`.**

---

## 0. Read this before using anything below

Five framing facts that change how every number in this file should be taught.

**0.1 The two newest and most interesting models publish almost no numbers.**
The LTX-2 paper contains **exactly one table** (inference speed) and no VBench, no
Movie Gen Bench, no audio metric, no numeric human-preference result. The
Wan-Animate-2 paper contains **zero metric values of any kind** and **no limitations
section**. Their headline quality claims rest on unpublished internal studies.
[OFFICIAL, both papers read in full this pass.]

**0.2 Prompt adherence and visual quality are decoupled, and this is measured.**
SpatialAlign found LTX-Video-2B **worst on dynamic spatial correctness (0.058
Correct@0.7)** while **topping ID Consistency (0.8028)** and near-topping CLIP-IQA
(0.9061). A model that looks the best can follow the prompt the worst.
[TESTED-PAPER, arXiv:2602.22745]

**0.3 Seed variance usually exceeds the effect you are trying to teach.**
On Wan 2.2 5B the standard deviation *across seeds* is 0.2180 on Action Binding —
larger than the entire measured effect of prompt upsampling on that metric (+0.022).
Verbatim: *"T2V is 9× more variable with respect to seed than with respect to image
anchors."* Any single-generation A/B a student runs is noise; require 3–5 seeds.
[TESTED-PAPER, arXiv:2512.16371 Table 6]

**0.4 Two "official" capabilities in this roster do not exist as downloadable weights.**
`Wan-Animate-2-Lite` (the real-time streaming variant) is described in the paper and
README but **no Lite weights appear in any Wan-AI HF repo** (org listing checked
2026-08-17). `H3-Context-IR` and `H3-Regenerate-2K` are **hosted API only** — and
MiniMax's own card says Context-IR is *"critical to the quality of the final
output."* Local H3 caps at 768p. [OFFICIAL]

**0.5 There is no Wan 2.5 / 2.6 / 2.7 / 3.0 open weight release.**
Re-verified today via the HF API: the `Wan-AI` org's newest entries are
`Wan2.2-Animate-2-14B-Diffusers` (2026-08-13), `Wan2.2-Animate-2-14B` (2026-08-09)
and `Wan-Dancer-14B` (2026-07-17). Everything else is the Wan 2.1/2.2 family. A
search-index summary this pass surfaced a leaderboard row reading **"Wan2.7-260612,
Elo 1157"** — treat as **[SPECULATION]**: if it exists it is a hosted model, not
local weights. Do not put Wan 2.7 in a local selector.
[OFFICIAL] <https://huggingface.co/api/models?author=Wan-AI&sort=lastModified>

---

## 1. THE DECISION GUIDE — "reach for X when…"

This is the teaching artifact. Each row states the confidence behind it.

### Text-to-video, no reference material

| You need… | Reach for | Why | Confidence |
|---|---|---|---|
| **The scene contents to be right** (objects, setting, composition) | **Wan 2.2 A14B** | Scene Depiction **96.43**, Object types **72.62** on AnimationBench — beats every other open model tested (HunyuanVideo Objects 25.00, Framepack 35.71) | **High** [TESTED-PAPER] |
| **Dialogue, foley and music to come out of the same forward pass** | **MiniMax H3** *or* **LTX-2.5** | The only two local AV-natives. H3: 32 kHz stereo, 11 stable dialogue languages. LTX-2: joint 14B video + 5B audio stream, stereo 24 kHz out | **High** [OFFICIAL] |
| **A fast iteration loop** (many takes per hour) | **LTX-2.5 distilled** | 8 steps is real and verified on three GPUs; 5.7× faster than Wan 2.2 on identical hardware in the one controlled test that exists | **High** [TESTED] |
| **Legible on-screen text / UI / motion graphics** | **MiniMax H3** | Strings typed verbatim in quotes render clean; strings merely gestured at render as garbage. Also MiniMax's own skills name text/UI clarity as an H3 strength | **Medium** [TESTED + OFFICIAL] |
| **Multiple connected shots in one generation** | **LTX-2.5** | Only model in the roster with *native multishot* as a first-class documented feature holding identity/voice/style across cuts | **Medium** [OFFICIAL, capability unverified by any third party] |
| **A locked-off camera that stays locked** | **Wan 2.2** | The only same-input head-to-head found: Wan held a fixed camera where LTX-2.3 distilled zoomed out and drifted | **Medium** [TESTED, n=1] |
| **Anime / 2D that looks like anime** | **Wan 2.2 + an anime LoRA at 1.0–1.5**, or **MiniMax H3** for prompt-only | Wan has the deepest live anime LoRA ecosystem *because* its base has a documented realism bias. H3 exposes `2D-animated` as a named style token | **Medium** [TESTED + OFFICIAL] |
| **To run on 12 GB or less** | **FramePack** (6 GB) or **LTX-2.5 distilled int8** (measured on a 3060 12GB) | The only two with credible sub-16 GB evidence | **High** [OFFICIAL + TESTED] |

### Image/keyframe conditioning

| You need… | Reach for | Why | Confidence |
|---|---|---|---|
| **First *and* last frame pinned** | **MiniMax H3 FL2VA** or **LTX-2.x** | H3 FL2VA takes 0, 1 or 2 images natively. LTX has `LTXVAddGuide` chaining (first/mid/last verified working) | **High** [OFFICIAL + TESTED] |
| **A single start frame, stable result** | **Wan 2.2 I2V-A14B** | The stability winner in the one controlled I2V comparison | **Medium** [TESTED, n=1] |
| **Long output from one image, on a small GPU** | **FramePack** | 60 s at 30 fps on 6 GB, verbatim from the author; writes a complete mp4 after every section | **High** [OFFICIAL] |
| **Identity held across a scene/lighting change from references** | **MiniMax H3 Ref2VA** | Controlled two-shot night→morning test: *"Same face, same scar over the right eyebrow, same jacket and towel, across a scene and framing change with nothing shared but the references."* Identity drift not observed | **Medium** [TESTED, single tester] |

### Character animation / motion transfer / editing

| You need… | Reach for | Why | Confidence |
|---|---|---|---|
| **Swap a character *into* an existing video (replacement)** | **SCAIL-2** | Replacement is a first-class mode (`--replace_flag`). **Wan-Animate-2 has no replacement mode at all** — the string "replac" appears in its paper only inside a citation title | **High** [OFFICIAL] |
| **Multiple interacting characters** | **SCAIL-2** | Binding slots (K=6, 28 extra channels), dedicated multi-character human eval, zero-shot beyond K | **High** [OFFICIAL] |
| **Non-human / stylized / heavily-non-anthropomorphic subjects** | **SCAIL-2** | Zero-shot animal *driving*, object motion transfer, cross-embodiment. Wan-Animate-2 supports non-human *targets* but claims no cross-embodiment | **Medium** [OFFICIAL + LORE convergent] |
| **Output camera angle decoupled from the driving video** | **Wan2.2-Animate-2** | Its unique differentiator: viewpoint LoRA over 48 orientations, text-driven ("right 60-degree view") | **High** [OFFICIAL] |
| **Faces and hands to survive the transfer** | **Wan2.2-Animate-2** for expression fidelity; **SCAIL-2** for hands specifically | Animate-2 removed the intermediate skeleton entirely and claims expression/hand fidelity (qualitative only). SCAIL-2 has a *dedicated algorithm* for hands — Bias-Aware DPO, built because *"finger joints are often incorrectly articulated or simply neglected"* | **Low/Medium** — never measured against each other |
| **Real-time / streaming character animation** | **Wan-Animate-2-Lite** — **but the weights do not exist yet** | 24 fps at 400×720 on 4×H100, 3-step, 8-frame chunks, in the paper only | **Do not teach as available** [OFFICIAL] |
| **Music-driven dance** | **Wan-Dancer-14B** | Separate Apache-2.0 Wan-AI release, arXiv:2607.09581. A tester called it *"Pro Dancer… sharpness is exceptional. However, it is resource-heavy"* | **Low** [OFFICIAL exists; one qualitative test] |

### Hard constraints that override everything

| Constraint | Consequence |
|---|---|
| **You or your students are in the US, EU, UK or South Korea** | **MiniMax H3 is off the table.** Its licence restricts *"the MiniMax H3 Works **or any of their Outputs or results**"* outside the Applicable Territory. It is the outputs, not just the weights. Application form exists for institutions: <https://platform.minimax.io/h3-license> [OFFICIAL] |
| **You are in the EU** | **HunyuanVideo 1.5 is gated against you** — the model card carries `extra_gated_eu_disallowed: true` and the Tencent Hunyuan Community licence [OFFICIAL, verified today] |
| **You need unambiguous permissive licensing** | **Wan 2.2, Wan2.2-Animate-2, Wan-Dancer are Apache-2.0** — the cleanest in the roster [OFFICIAL] |
| **You need it to run offline end-to-end** | H3's official prompt path (Context-IR) and 2K path are **hosted APIs**; SCAIL-2's official prompt enhancer **requires a `GEMINI_API_KEY`**. Both are local-model-with-a-cloud-shaped-hole [OFFICIAL] |

### One-line summary to write on a whiteboard

> **Wan 2.2** = the reliable *content and stability* model.
> **LTX-2.5** = the *speed, multi-shot and iteration* model.
> **MiniMax H3** = the *audio, references and text-on-screen* model, if you're allowed to use it.
> **SCAIL-2** = *put this character into that video*.
> **Wan-Animate-2** = *drive this character, and let me move the camera*.
> **FramePack** = *it runs on the laptop*.
> **HunyuanVideo 1.5** = *8B that fits, with no adapter ecosystem*.

---

## 2. STRENGTHS MATRIX

Scale: **A** strong / **B** adequate / **C** weak / **–** not applicable / **?** no evidence.
Every non-`?` cell traces to a section below. Cells marked `?` are honest gaps.

| Dimension | Wan 2.2 A14B | Wan 2.2 TI2V-5B | Wan-Animate-2 | SCAIL-2 | LTX 2.3 | LTX 2.5 | MiniMax H3 | HunyuanVideo 1.5 | FramePack |
|---|---|---|---|---|---|---|---|---|---|
| Scene / object content | **A** 96.43 | B | – | – | ? | ? | B? | ? | C 35.71 |
| Subject action adherence | **C** 54.76 | ? | – | – | ? | ? | ? | ? | ? |
| Camera command adherence | **C** 42.86 | ? | **A** (viewpoint ctrl) | C | C drift | ? | B? | C 33.95 | B 71.43 |
| Counts / numeracy | C 0.553 | C 0.419 | – | – | ? | ? | ? | ? | ? |
| Spatial relations (dynamic) | **C** 0.127 | C 0.177 | – | – | **C** 0.058 | ? | ? | ? | ? |
| Natural human motion | B | B | **A** | **A** | B | B | **A** | ? | B |
| Physics plausibility | B 57.26 | ? | – | – | C | C | **A**? | ? | ? |
| Fast / large-amplitude action | B | ? | B | **A** | **C** | **C** | B | ? | C |
| Face identity over time | B | C | **A** | **A** 4.38 | **A** 0.80* | A | B | ? | B |
| Hands | B | C | A | **A** (DPO) | **C** | ? | ? | ? | ? |
| Lip-sync | – | – | – | – | B | B | **A** | – | – |
| Native audio | **–** | **–** | – | – | **A** | **A** | **A** | – | – |
| Dialogue intelligibility | – | – | – | – | **C** | **C** | B | – | – |
| Max single-pass duration | ~5 s | ~5 s | chunked | chunked | ~20 s | ~20 s | **15 s** | ? | **60 s** |
| Multi-shot in one call | C | C | – | – | C | **A** | B | ? | – |
| Chaining quality | B | ? | **A** | B | B | ? | B | ? | **A** |
| Reference-driven identity | B (VACE) | C | **A** | **A** | B (IC-LoRA) | B | **A** (12 files) | ? | – |
| First/last frame control | B | B | – | – | **A** | **A** | **A** | ? | B |
| Speed per clip | **C** | C | ? | ? | **A** | **A** | C | B | C |
| Minimum VRAM | C (24 GB+) | B (~8–12) | ? | ? | B | **B** (12) | C (16) | **B** (14) | **A** (6) |
| Photoreal | **A** | B | – | – | **A** | **A** | **A** | **A** | B |
| Anime / 2D | **C base / A w/ LoRA** | C | – | – | B | B | **A** (named token) | B | C |
| 3D CG / stylized | B w/ LoRA | C | – | – | **A** | **A** | **A** | B | C |
| LoRA ecosystem depth | **A** 330 | C 18 | C | C | **A** 354* | C 4 | C 3 | **C** 1 | C |
| Licence cleanliness | **A** Apache | **A** | **A** Apache | B (conflict) | B (cap) | B (cap) | **C** (4 regions) | **C** (EU gated) | A |

\* LTX ID-Consistency 0.8028 is measured on the old **LTX-Video-2B**, not 2.3/2.5.
\* LTX's 354 HF adapters are inflated by lineage tagging across LTXV 0.9.x → 2.5.

---

## 3. Prompt adherence, by prompt element

### 3.1 The one model with a broad published adherence profile is Wan 2.2

**[TESTED-PAPER] AnimationBench (arXiv:2604.15299, 2026-04-16)** — Wan 2.2 run on local
open weights (14B, 45 GB GPU, 832×480 or 720×1280), 70 videos per model,
CoTracker point tracking following the VBench++ heuristic.

```
Wan2.2  Scene Depiction 96.43 | Object types 72.62 | Motion Rationality 57.26
        Actions 54.76 | Camera Motion 42.86 | Dynamic Degree 76.67
```

Camera Motion Consistency across the whole roster, seven commanded motions
(`pan left/right`, `tilt up/down`, `zoom in/out`, `static`):

| Model | CMC | Local or hosted |
|---|---|---|
| **Wan 2.2** | **42.86** | **local weights** |
| Sora2-Pro `(CLOUD)` | 42.86 | API |
| **HunyuanVideo** | **57.14** | **local weights** |
| **Framepack** | **71.43** | **local weights** |
| Veo3.1 `(CLOUD)` | 80.36 | API |
| Seedance-Pro `(CLOUD)` | 87.50 | API |
| Kling2.6 `(CLOUD)` | 94.64 | API |
| Seedance2.0 `(CLOUD)` | 96.42 | API |

42.86 = 3/7 exactly; the quantisation implies whole-motion-type failures, not partial
credit. **The teaching point is counter-intuitive and worth stating plainly: FramePack
— the weakest model here on everything else — is the best local camera follower in the
set, and Wan 2.2 is the worst.** Wan wins semantics (Objects 72.62 vs HunyuanVideo
25.00, Framepack 35.71) and loses camera to both.

**Wan 2.2 follows what is in the frame far better than how the camera moves or what
the subject does.** [SYNTHESIS from TESTED]

### 3.2 Compositional adherence — Wan only, and it is poor where it matters for motion

**[TESTED-PAPER] Anchored Video Generation (arXiv:2512.16371)**, T2V-CompBench, raw
prompts, 5 seeds, local weights:

| Element | Wan 2.2 5B | Wan 2.2 14B |
|---|---|---|
| Consistent Attribute | 0.814 | 0.844 |
| **Dynamic Attribute** | **0.177** | **0.127** |
| Spatial Relationship | 0.577 | 0.639 |
| Motion Binding | 0.257 | 0.299 |
| Action Binding | 0.487 | 0.624 |
| Object Interaction | 0.629 | 0.765 |
| **Generative Numeracy (counts)** | **0.419** | **0.553** |

Note the inversion worth teaching: **14B is *worse* than 5B on Dynamic Attribute**
(0.127 vs 0.177). Bigger is not uniformly better on "things that change during
the shot."

### 3.3 Counts and spatial relations are the worst-measured dimension across all open models

**Counting is measured by essentially nobody.** VBench-2.0 has no counting dimension
and flags counting as a weakness of the *evaluator* VLMs. AnimationBench and MMGR have
no counting metric. T2V-CompBench's Generative Numeracy (above) is the only proxy.
RAPO++ reports the failure only qualitatively, verbatim: *"when prompts explicitly
specify object counts — such as 'five parrots' or 'three giraffes' — the generated
videos often fail to match the intended number of entities."* [TESTED-PAPER,
arXiv:2510.20206]

**Dynamic spatial relations, the single worst result located anywhere:**
SpatialAlign Correct@0.7 — **LTX-Video-2B 0.058**, **Wan2.1-1.3B 0.125**; all
VBench-2.0 models 19–21%. VBench-2.0's own verdict, verbatim:

> "Most models perform poorly in capturing Dynamic Spatial Relationships and Dynamic
> Attributes. Even in relatively simple cases … models fail in about 80% of the time."

**Teaching consequence:** counts and "A moves from left of B to right of B" are the two
things students should be told the model will probably get wrong regardless of which
model they pick and how well they phrase it. This is not a prompting skill gap.

### 3.4 Artificial Analysis Elos — preference, not adherence

**[OFFICIAL-3P]** Blind human-preference Elo, early August 2026, MiniMax H3:

- **Video editing: #1 overall**, Elo ~1,125–1,130 over ~10,280 votes, statistically
  tied with Gemini Omni Flash `(CLOUD)` ~1,122.
- **Text-to-video with audio: #2**, Elo **1,238** vs Gemini Omni Flash `(CLOUD)` 1,241.
- **Text-to-video without audio: #2**, Elo **1,305** vs Gemini Omni Flash `(CLOUD)` 1,324.
- **Image-to-video: top 3.**

Open-weights-only sub-rankings, from a search-index summary this pass and therefore
**lower confidence — verify before teaching**:

| Board | 1st | 2nd | 3rd |
|---|---|---|---|
| T2V with audio | MiniMax H3 **1237** | LTX-2.3 Fast 976 | LTX-2.3 Pro 958 |
| T2V without audio | MiniMax H3 **1305** | LTX-2 Pro 1121 | LTX-2 Fast 1120 |
| I2V with audio | MiniMax H3 **1189** | MAGI-2 Preview 1104 | LTX-2.3 Fast 959 |
| I2V without audio | MiniMax H3 **1352** | Cosmos3-Super-I2V-4Step 1263 | Cosmos3-Super-I2V 1246 |

If those hold, the H3-to-LTX gap among open weights is **~260–330 Elo** — very large.
But note the confound that MiniMax's own material concedes: H3 *"benefits from its own
detailed, storyboard-like prompting style rather than identical prompts across
models"*, and arena prompts are not H3-dialect. [TESTED-API caveat]

**[OFFICIAL] LTX's own paper cites the same board** for a much earlier snapshot:
*"In the Artificial Analysis public rankings (as of November 6th, 2025), LTX-2 was
ranked 3rd in Image-to-Video and 4th in Text-to-Video generation. Notably, it
surpassed proprietary systems such as Sora 2 Pro and large-scale open models like
Wan 2.2-14B."*

**Caveat to teach with all of these: these are *preference* Elos, not prompt-adherence
measurements. No public benchmark isolates instruction-following for H3 or for any
LTX 2.x version.** [NO EVIDENCE]

### 3.5 LTX in benchmarks: essentially absent

LTX appears in **one** of the nine benchmark papers surveyed across this and the prior
pass — SpatialAlign, and only as the old **LTX-Video-2B**. **No LTX-2.x version appears
in any benchmark located.** [NO EVIDENCE] State this plainly to students: claims about
LTX-2.5 prompt adherence — including Lightricks' own *"follows complex prompts more
faithfully than before"* — are **vendor assertion with no third-party measurement.**

---

## 4. Motion quality

### 4.1 The clearest measured statement

MMGR (arXiv:2512.14691) on Wan 2.2 — a *reasoning* benchmark, so read it narrowly:
2D Maze overall **0.83–5.00%** (Veo-3 `(CLOUD)` 38.69–51.50%); maze "Cross Wall" rate
**79.17–90.83%**, with the memorable verbatim conclusion that models *"treat walls as
visual suggestions rather than impermeable boundaries."* ARC-AGI v1 0.17%, v2 0.00%.
Cite for "do not expect exact spatial choreography or physical constraint satisfaction
from text," not for cinematography. [TESTED-PAPER]

### 4.2 Fast / large-amplitude action is LTX's recurring weakness

Three independent sources, two languages, converge:

- **[OFFICIAL]** LTX-2.5 model card limitation: *"highly chaotic motion can still
  introduce artifacts."*
- **[TESTED]** AIwood, RTX 5090D, LTX-2.5 first test 2026-08-12: 大动态表现仍有不足 —
  *"large dynamics are still weak."* <https://bbs.monster/thread-4677-1-1.html>
- **[TESTED]** おーら (ai_0049), 2026-08-13, RTX 5060 Ti 16GB, LTX-2.5 vs LTX-2.3 vs H3:
  *"In terms of the persuasiveness of motion and fewer physical glitches, my experience
  that MiniMax H3 is still a step ahead."* Also: *"it is a negative point that LTX2.5
  turned the woman into two people."* <https://note.com/ai_0049/n/n46672bb50bf0>

Counterweight in LTX's favour, and it is a real insight for anime work — **[OFFICIAL]**
Lightricks' own docs: *"2D animation styles produce fewer temporal artifacts than
photorealistic output because simpler geometry and flat color reduces the model's
burden on complex physics."*

### 4.3 Wan 2.2's Lightning few-step LoRA breaks specifically on large motion

**[OFFICIAL]**, from lightx2v's own card — an unusually candid vendor limitation:
*"When the video contains elements with **extremely large motion**, the generated
results may include **artifacts** … the **direction of the vehicles may be reversed**."*
Requires the exact `denoising_step_list = [1000, 750, 500, 250]` and **both** high- and
low-noise LoRAs. Teaching consequence: **students running 4-step Lightning workflows are
running a configuration whose authors document motion failure**, and the prior pass's
finding that prompt-expansion benefit vanishes at 15 steps compounds this.

### 4.4 Subtle micro-motion

**[NO EVIDENCE]** for any model. No benchmark dimension measures it; no community test
isolates it. The nearest signals are (a) MiniMax's own skills file conceding that
*"elastic Pixar-style performance"* is a Seedance strength and not H3's, and (b) the
community claim that SCAIL-2's *"tiny, subtle facial expressions (like eye movements)
might not feel quite as detailed as Wan-Animate"* — which is **[LORE]**, has no support
in either paper, and describes Wan-Animate **v1**.

---

## 5. Human rendering — faces, identity, hands, lip-sync

### 5.1 Hands: the one model with an algorithm aimed at the problem

**[OFFICIAL] SCAIL-2 paper**, verbatim:

> "We notice that subtle movements in the hand region provide the most obvious evidence,
> where **finger joints are often incorrectly articulated or simply neglected**. To
> mitigate this bias, we propose **Bias-Aware DPO**."

The negative sample is constructed by deliberately propagating pose-extraction error
(`r⁻ = G(P(r), R)`), so the model is trained against its own characteristic hand
failure. No other model in the roster has a hands-specific mechanism.

**[TESTED]** Hands are also where the one controlled T2V/I2V head-to-head separated the
models: on RTX 5090, same input image and prompt, **LTX-2.3 distilled "breaks when
hands are visible"; Wan 2.2 showed "some blur, less breakdown."**
<https://zenn.dev/toki_mwc/articles/ltx23-vs-wan22-i2v-benchmark-rtx5090>

### 5.2 Identity stability

| Model | Evidence | Grade |
|---|---|---|
| **SCAIL-2** | Video-Bench Appearance Consistency **4.38** — best in its table (Wan-Animate v1 4.23, SCAIL v1 4.25, SteadyDancer 4.17). Mechanism: character binding slots isolate identity under multi-character occlusion | **[OFFICIAL/PAPER]** |
| **Wan-Animate-2** | Identity preservation is one of five *user-study dimensions*; **the numeric value is only inside a chart image**. Prose gives one number: *"over 70% of pairwise comparisons favoring our method in overall quality"* vs Wan-Animate v1 | **[OFFICIAL, weak]** |
| **MiniMax H3 Ref2VA** | Held identity across a full night→morning lighting inversion and a framing change with nothing shared but the references | **[TESTED, single tester]** |
| **Wan 2.2 (T2V)** | Prompt inflation *costs* identity: Human Identity **0.6919 → 0.5509 (−20%)** on 14B under LLM prompt expansion | **[TESTED-PAPER]** |
| **LTX-Video-2B** | ID Consistency **0.8028**, top of its table — but that is the old 2B checkpoint | **[TESTED-PAPER]** |

**[TESTED]** Practical failure boundary for Wan-Animate-2 from the earliest hands-on
(T8star-Aix, 2026-08-10, 3 days post-release, RunningHub cloud): *face consistency is
stable in frontal / half-body close shots; small-face and long shots still drift off
the reference.* Mirrors the H3 finding that distant faces are unrecognisable, for which
MiniMax's own workaround is *"Show the face only in close-up or extreme close-up. In
wide shots, use back view … never show a distant frontal face."*
**Cross-model pattern worth teaching: face quality is a function of face-pixels-in-frame
on every model in this roster.** [SYNTHESIS from TESTED]

### 5.3 Lip-sync

| Model | Status |
|---|---|
| **MiniMax H3** | **Best supported.** Speaker IDs `(S1)`/`(S2)` persisting across shots, `<d>[lang]…</d>` dialogue blocks, `<scenetrans>` for lines crossing a cut, `<cutoff>` for truncation, and a mandatory lips-closed clause for voiceover. **[TESTED]** PC Watch's Nishikawa notes lip-sync works off the **mixed track** — no Mel-Band RoFormer vocal separation needed, unlike his LTX-2.3 workflow |
| **LTX 2.x** | Works, but fragile. **[TESTED]** LUTA@AI found **FFLF (first/last-frame lock) and external-audio lip-sync are mutually exclusive** — locking endpoints suppresses mouth movement; lip-sync doesn't fire below ~6 s audio and wants ≥10 s. **[TESTED]** The ltx2bench site got lip-sync working only via cross-modal STG guidance at layer 29 |
| **LTX-2.5 regression risk** | **[TESTED]** AIwood: LTX-2.3 workflows mostly run on 2.5 weights, **but audio-driven digital-human lip-sync fails** — suspected audio-path change. Corroborated by Lightricks' own note that Dub-It *"has not been validated on LTX-2.5 yet"* |
| **SCAIL-2** | Explicitly future work: *"extend the framework to more tasks, such as accurate lip-syncing for talking scenes"* [OFFICIAL] |
| **Wan 2.2** | Not native. Requires a *separate 14B-class checkpoint* — Wan2.2-S2V-14B (80 GB VRAM), MeiGen-MultiTalk, InfiniteTalk, HuMo |

**H3's documented lip-sync failure and its official fix** is the highest-yield thing to
teach: mouths keep moving after the line ends, and the fix is an explicit stop clause —
*"Her lips stop moving immediately after the last word. She listens in silence."*
MiniMax's own example does the same: *"Exactly as his voice stops, his lips meet in a
relaxed, peaceful smile, and his jaw ceases speaking motion."* [OFFICIAL + TESTED]

---

## 6. Audio

### 6.1 Yes — H3 and LTX are the only local AV-natives in this roster

Confirmed. Wan 2.2, Wan-Animate-2, SCAIL-2, HunyuanVideo, HunyuanVideo 1.5 and
FramePack **all produce silent video**. Wan has an audio *ecosystem* — S2V-14B,
HunyuanVideo-Foley, MeiGen-MultiTalk, InfiniteTalk, HuMo — but every one is an
additional 14B-class model loaded alongside the base. Materially different VRAM and
workflow story from a single joint forward pass. [OFFICIAL]

### 6.2 Published specs

| | MiniMax H3 | LTX-2.x |
|---|---|---|
| Sample rate / channels | **32 kHz stereo** | 16 kHz mel → **24 kHz two-channel** out (HiFi-GAN, channels doubled vs V1) |
| Audio latent rate | 40 Hz per channel | ~25 tokens/s, 128-dim |
| Architecture | Single-stream 33B omni-transformer; audio and video latents jointly predicted | Asymmetric dual-stream: 14B video + 5B audio, AV cross-attention with **temporal-only RoPE** *"enforcing that cross-modal attention focuses on synchronization in time rather than spatial alignment"* |
| Dialogue languages | **11 stable**: Arabic, Chinese, English, French, German, Italian, Japanese, Korean, Portuguese, Russian, Spanish | Multilingual via Gemma3-12B; card tags en/de/es/fr/ja/ko/zh/it/pt |
| Audio input | ≤3 clips, 2–15 s each (Ref2VA) | V2A and A2V both supported |
| Guidance | — | Audio uses **much stronger text guidance than video**: `s_t=7, s_m=3` for audio vs `s_t=3, s_m=3` for video |

Both [OFFICIAL]. Sources: <https://huggingface.co/MiniMaxAI/MiniMax-H3>,
arXiv:2601.03233.

### 6.3 Neither has any published audio metric. At all.

**[NO EVIDENCE]** The LTX-2 paper contains **no FAD, no KL, no CLAP, no AV-Align, no
sync-C/sync-D, no WER/CER, no MOS, no music metric.** Its entire audio evaluation is a
prose sentence about an unpublished internal study plus an attention-map figure. H3 has
**no technical report at all** as of this date. **There is no measured audio comparison
between the two local AV-natives, in any direction.**

### 6.4 What the community actually found — and it is unflattering to both

- **[TESTED]** LTX-2 native speech in video-extension workflows: *"Audio: LTX-2 native
  (**gibberish**) — requires TTS mux for real speech."* Same site's talking-avatar
  "Best" result also muxes Qwen3 TTS post-generation.
  <https://appvikalabs.github.io/ltx2bench/>
- **[TESTED]** Japanese testers report LTX-2.5/2.3 producing *"unintelligible dialogue"*
  and *"unintelligible alphabet subtitles"* that **violated an explicit "No text, no
  subtitles" negative constraint**.
- **[TESTED]** H3 music: produces *"a so-called 'pseudo-language' song"* whose lyrics
  are unidentifiable unless written into the prompt.
- **[TESTED]** H3 unprompted speech: 「指示していないのに喋ってしまうこともあり」 —
  *"It sometimes talks when I didn't tell it to."*
- **[TESTED]** H3 reference audio is **not** a music slot: measured envelope correlation
  between an uploaded 8.05 s slice and the returned track was **0.25** (no-reference
  control: −0.05). Verbatim: *"Read reference audio as a steer on the mix, not a music
  slot. If you need your exact track under the picture, lay it in afterwards."*
- **[OFFICIAL]** MiniMax's own production skill treats native music as a **first draft**:
  if H3's music is bad/too loud/too weak/out of sync, generate a separate instrumental
  with `music-2.6` and replace the track.

**Honest teaching line:** *both* local AV-natives generate convincing **foley and
ambience**; **neither reliably generates intelligible speech or usable music**. The
professional workflow on both is native audio for the bed, TTS/music muxed for anything
that has to be understood. [SYNTHESIS from TESTED, converging across three languages]

### 6.5 Two documented audio-destroying bugs

1. **[OFFICIAL]** ComfyUI PR #15390 (2026-08-07) is titled *"Fixed MiniMax H3 audio
   corruption with EasyCache."* On builds < v0.31.0 this is real and dated.
2. **[TESTED]** H3 audio is destroyed by the **sampler**, not by quantization: LCM +
   Beta scheduler → *"the sound was totally off, only weird ringing noises."* Euler and
   res_multistep are safe.

Adjacent, single-source: an FP8 quantizer reports naive FP8 casting causes
*"audio-video desync"* on LTX and keeps `audio_in`/`video_in`/`time_in`/`guidance_in`
in BF16 to prevent it — mechanistically consistent with cross-modality AdaLN being the
sync mechanism, but **one self-interested source.** [TESTED, weak]

---

## 7. Duration and pacing

| Model | Max single pass | Multi-shot in one call | Chaining mechanism |
|---|---|---|---|
| **Wan 2.2 A14B / TI2V-5B** | ~5 s (81–121 frames) | No | External only (VACE, manual relay) |
| **LTX 2.3** | ~20 s claimed | **No** — system prompt: *"DO NOT use timestamps or describe scene cuts unless explicitly requested"* | Community V2V extension chains (tested 5s→14.7s→24.4s→34s) |
| **LTX 2.5** | ~20 s; **duration predicted from the prompt** by an optional duration head | **Yes, native.** *"Prefer 2–4 shots in one generation"* | Same, plus native cuts |
| **MiniMax H3** | **4–15 s**, 24 fps, hard cap | Yes, `[Shot N] At MM:SS.mmm, the camera cuts to…` | Feed shot N's output back as shot N+1's video reference |
| **Wan-Animate-2** | Not stated; Lite is chunked 8-frame autoregressive | – | *"error buffer mechanism"* claims no observable accumulation over "extended sequences" — **never quantified in seconds** |
| **SCAIL-2** | Not stated | – | *"we follow Wan-Animate to randomly replace the first 2 latents to be conditional history latents"* — one sentence, no experiment |
| **FramePack** | **60 s at 30 fps (1800 frames) on 6 GB** | – | Section-by-section, writes a complete mp4 after each |

### 7.1 The duration numbers degrade before they cap out

**[OFFICIAL] LTX-2 limitations, verbatim:** *"generating coherent audiovisual sequences
longer than roughly 20 seconds can lead to temporal drift, degraded synchronization, or
reduced scene diversity."* And on multi-speaker: *"the model may inconsistently assign
spoken content to characters, occasionally confusing which character should speak
specific lines."*

**[TESTED]** H3 dialogue coherence at 32×32 px (audio-only use): ~45 s stayed coherent;
**60-second dialogue started losing coherence.** A useful upper bound on a *spoken*
timeline independent of the 15 s video cap.

**[TESTED]** LTX-2.5 practical duration ceiling on consumer hardware is **lower than the
spec**: multiple users reported immediately post-release that *"it crashes during VAE
decoding if the length exceeds 5 seconds."* Root cause is [OFFICIAL] — the new DiffVAE
*"operates much closer to pixel resolution… roughly 500× more tokens for a 1080p
121-frame video,"* and *"the diffusion decoder will end up dominating your total
generation time."* Fixes: tile 768→512, `temporal_size 64` + `temporal_overlap 16`, or
swap to the old Conv VAE (both ship in the 2.5 pack).

### 7.2 The most important pacing finding: nobody builds narratives with in-prompt multi-shot

**[OFFICIAL]** MiniMax's own `3d-animation-short-generator` skill — their end-to-end
narrative pipeline — renders **one clip per shot** and assembles in post. Continuity is
carried by character cards + scene cards + a six-column shot table, **not** by in-prompt
multi-shot. And their model-selection file names a competitor as the fallback:
*"Seedance is used only when the user explicitly wants stronger multi-shot execution…"*

**[TESTED]** Independently, LTX-2.5's headline multi-shot did not win the one test that
tried it: おーら, 2026-08-13 — *"the flagship feature, 'native multi-shot,' was not
utilized under the I2V/single-image conditions of this test; in fact, there were several
instances where MiniMax H3, which faithfully handles cut transitions, came out on top."*
His summary: *"it seems more accurate for now to view LTX2.5 as 'a different tool for
long takes and high-speed iteration' rather than a 'replacement for MiniMax H3'."*

**Teach in-prompt multi-shot as a shot-*pair* device, not a storytelling device.**
[SYNTHESIS, high confidence — supported by the model vendor's own workflow]

### 7.3 An official beat budget, from MiniMax

The only quantitative pacing guidance found from any vendor
(`minimalist-product-ad-generator/SKILL.cn.md`): 5 s → 3–4 beats; 10 s → 5–7; 15 s →
6–9. One primary action per beat. Energy curve: 5 s = 1 peak + 1 settle; 10 s = 1–2
peaks + 1–2 brakes; 15 s = 2–3 peaks + 2 quiet brakes. [OFFICIAL] Transfers reasonably
as a general pacing heuristic. [SPECULATION on transfer]

---

## 8. Editing and reference tasks

### 8.1 Capability grid

| Task | Wan 2.2 | Wan-Animate-2 | SCAIL-2 | LTX 2.5 | MiniMax H3 |
|---|---|---|---|---|---|
| Subject **replacement** into existing video | via VACE | **No** | **Yes** (`--replace_flag`) | In/outpainting | Ref2VA video editing |
| Motion transfer from driving video | via VACE | **Yes** (end-to-end, no skeleton) | **Yes** | Motion Control IC-LoRA | Ref2VA `attribute_transfer` |
| Multi-character | — | **No** | **Yes** (K=6 binding slots) | ? | ≤9 images |
| Identity from reference image | via VACE | Yes | Yes | IC-LoRA | **Yes, ≤9 images / 12 files mixed** |
| Non-human / cross-embodiment driving | — | Targets only | **Yes, zero-shot** | ? | ? |
| Output camera ≠ driving camera | — | **Yes, 48 viewpoints, text-driven** | Emergent only | — | — |
| First/last frame | Yes | — | — | **Yes** (`LTXVAddGuide` chain) | **Yes** (FL2VA, 0/1/2 images) |
| Relight | — | `relight_lora` | — | **Relight guide** | — |
| Speech replacement / dubbing | — | — | Future work | **Dub-It (beta)**, 5 languages | Ref2VA voice-timbre reference |

### 8.2 Wan-Animate-2 vs SCAIL-2: the comparison everyone wants and nobody has made

**[NO EVIDENCE] There is no direct head-to-head, quantitative or otherwise.** Verified
from both papers this pass:

- SCAIL-2 (arXiv:2606.10804, June 2026) **predates** Wan-Animate-2 (arXiv:2608.06009,
  August 2026) by two months. The string "Wan-Animate-2" appears **0 times** in it. Its
  baselines are Wan-Animate **v1**, SteadyDancer, Onetoall-Animation, UniAnimate-DiT,
  VACE.
- Wan-Animate-2 **cites** SCAIL-2 (ref [32]) but **never benchmarks it** — it appears in
  the Introduction only, dismissed on cost grounds: *"full-sequence self-attention over
  all reference and target tokens incurs quadratic complexity, severely limiting
  scalability and rendering inference impractical for long sequences or high-resolution
  outputs."* SCAIL-2 is absent from its qualitative figure and its user study.
- **Worse: Wan-Animate-2 published no metrics at all**, so the pair is not *comparable*
  even in principle from published data.

**They are not independent lineages.** Both bootstrap from Wan-Animate v1 synthetic
data — SCAIL-2 verbatim: *"we utilize several off-the-shelf models, including
SCAIL-Preview, Wan-Animate, MoCha to synthesize 60K motion pairs."* Wan-Animate-2 uses
*"an automated synthesis pipeline built upon Wan-Animate."* They are two
second-generation distillations of the same teacher.

**The one third-party comparison that circulates is architecturally stale.**
`docs.dreamerland.ai/…/wan-animate-vs-scail2` frames Wan as "The Bone/Skeleton Route" —
which is **v1's architecture**. Wan-Animate-2 **removed** the intermediate motion
extractor, converging architecturally on SCAIL-2. Its claim that "Wan-Animate has
Replacement Mode" is true of v1 and **false of v2**. Label the whole page **[LORE]**,
and note it is answering a question about a different model. Its one claim with paper
support is SCAIL-2's multi-character and non-human strength.

**What is defensible to teach:**
1. Both are 14B, Wan-backbone, end-to-end/no-skeleton.
2. **SCAIL-2 covers strictly more tasks** and is the only one of the two with published
   metrics.
3. **Wan-Animate-2 is the only one with camera/viewpoint control**, an official
   distilled checkpoint (10 steps, cfg 1.0, euler), and a real-time design.
4. Any "X beats Y" claim about this pair is inference or lore.

**[TESTED] Practical caveat on adoption, and it is stark.** As of today the HF API
reports `Wan-AI/Wan2.2-Animate-2-14B` at **139 likes and 0 downloads**; the Diffusers
repacks at 195 and 496 downloads. Compare `Wan2.2-Animate-14B` (v1): **20,957
downloads**. Corroborated by the earliest hands-on (T8star, 2026-08-10) noting community
workflows **had not yet reproduced the official video-character-replacement capability**
— in practice Animate-2 was motion-transfer only at that date. **Wan-Animate-2 is
essentially untested by the community.** Teach it as promising and unproven.

### 8.3 The reference-handling rules that actually change outcomes (H3)

Highest-yield, all [TESTED] or [OFFICIAL]:

- **Assign a role to every reference.** *"State which reference drives which part of the
  shot (identity, style, motion, camera, voice). Explicit assignments tend to work much
  better."*
- **A video reference's colour grade beats your text lighting instruction.** *"I asked
  for 'bright empty covered market, cold clean daylight' and 'carry the grade and grain
  of the reference clip', and the reference clip won."*
- **An image reference drags its own lighting in.** *"Shoot your reference flat and
  neutral."*
- **Do not use contact sheets.** MiniMax abandoned 4-up anchor grids because *"the video
  model may carry the grid layout into the final frame."* Use N separate single-subject
  images.
- **First frame is stretched, last frame is centre-cropped** in native FL2VA. Mismatched
  aspect ratios silently recompose your ending.
- **The model substitutes rather than refuses** — a missing reference produces a
  confident wrong face, not an error. Ship a QA checklist, don't assume a completed
  render is a correct render.

### 8.4 SCAIL-2 chaining, measured against the alternative

**[TESTED, commercial COI]** T8star-Aix, 2026-06-16 — the only comparison of SCAIL-2's
context-window approach against the KJ relay workflow. KJ relay: stable within ~20–30 s
but errors and tearing (裂画) accumulate per hop. SCAIL-2 context-window: lower VRAM,
higher theoretical ceiling, but **visible transitions/flicker at each context switch**.
His verdict: *"In replacement mode, SCAIL-2 multi-reference easily produces
contamination, face flicker, or characters interfering with each other. For replacements
under ~20 seconds the author still recommends the KJ relay workflow."* Trap he
documents: padding the multi-reference mask with one extra black image makes the model
**absorb the black** and darken the background or whole character.
<https://bbs.monster/thread-4183-1-1.html>

---

## 9. Speed and hardware

### 9.1 The only true controlled head-to-head that exists

**[TESTED] zenn.dev/toki_mwc**, pub. 2026-03-11, upd. 2026-06-28. RTX 5090 32 GB,
Win 11, ComfyUI v0.16.4, PyTorch 2.9.1+cu130. **Same input image, same prompt, 832×480,
81 frames, both at GGUF Q4_K_M.**

| | LTX-2.3 22B distilled | Wan 2.2 14B I2V |
|---|---|---|
| Steps / sampler | 8, ManualSigmas, CFGGuider cfg 1.0, euler | 6 (3+3), dpm++_sde |
| **Warm generation** | **22.1 s** | **125 s** |
| Cold start | 48.5 s | 143.9 s |
| Camera | ❌ *"zooms out/scrolls on its own"* | ✅ *"Stable with fixed camera"* |
| Hands | ❌ breaks when visible | ⚠️ some blur, less breakdown |

**5.7× faster, and Wan still wins on quality.** Three findings worth propagating:

1. **The 5.7× is a 2.3-and-newer property, not an "LTX" property.** The author initially
   benchmarked `ltx-2-19b-distilled-fp8.safetensors` believing it was 2.3. It is
   **LTX-2.0**, and it measured **114 s — essentially tied with Wan 2.2, at lower
   quality.** Filename ambiguity is a real classroom trap.
2. **SageAttention 3 gave Wan 2.2 13% and LTX-2.3 GGUF exactly 0%** — with
   `UnetLoaderGGUF` the 4-bit→bf16 dequantization is the bottleneck, not attention.
3. **When system RAM exceeded ~92% utilization, Wan 2.2 throughput dropped ~50%.**

His own selection rule: lip-sync / batch → LTX-2.3 distilled; anime PV / character work
→ Wan 2.2.

### 9.2 The vendor's 18× claim, and why it isn't the 5.7× above

**[OFFICIAL]** LTX-2 paper Table 1 — *the only table in the paper*:

| Model | Modality | Params | Sec/Step |
|---|---|---|---|
| Wan 2.2-14B | Video only | 14B | **22.30 s** |
| LTX-2 | Audio + Video | 19B | **1.22 s** |

Conditions: **single H100, 121 frames, 720p, single-step Euler, CFG=1.**
*"LTX-2 is approximately 18× faster than Wan 2.2."*

**Three caveats to teach with it:** it is **per diffusion step, not per clip** (the
paper never states a step count, so no seconds-per-clip can be derived); CFG=1
contradicts the paper's own stated generation config (`s_t=3, s_m=3`); and the paper
contradicts itself on parameter count (14B+5B/19B in the body, *"13B video diffusion
transformer with a lightweight 3B audio stream"* in the conclusion).

### 9.3 Measured consumer-GPU numbers with complete settings

Only entries with resolution + frames + steps + quantization are listed. A number
without those is not comparable — say so to students.

| GPU | Model | Res | Frames | Steps | Quant | Time |
|---|---|---|---|---|---|---|
| 5090 32GB | LTX-2.3 distilled | 832×480 | 81 | 8, cfg 1.0 | GGUF Q4_K_M | **22.1 s** |
| 5090 | Wan 2.2 I2V-14B | 832×480 | 81 | 6 (3+3) | GGUF Q4_K_M ×2 | **125 s** |
| 5090 | LTX-2.3 Dev | 1280×720 | **481** | 8 | FP8 | **82 s** |
| 5090 | LTX-2.3 Dev | 1920×1080 | 481 | 8 | FP8 | 547 s |
| 5090 | MiniMax H3 | 1344×768 | 56 | **4** (turbo LoRA) | int8_convrot + nvfp4 TE | **16.2 s** |
| 5090 | MiniMax H3 | 1344×768 | 56 | 20 | same | 48.3 s |
| 5090 | Wan2.2 TI2V-5B | 720×1280 | 121 | 30, cfg 5.0 | bf16 | 4m12s–6m08s, peak 18.6 GB |
| 5090D | MiniMax H3 (T2V) | — | 10 s | 4 | **W4A8** + LightX2V | ~115 s |
| 5090D | MiniMax H3 (T2V) | — | 10 s | 20 | BF16 native | ~800 s |
| 5090D | LTX-2.5 | 1920×1080 | 10 s | — | — | **160–170 s** |
| 5090 | MiniMax H3 | 720p | 10 s | 8 + Turbo 0.8 | — | **~144 s** |
| 3090 24GB | MiniMax H3 | 832×480 | 124 (5 s) | 20 | pruned_int8 | **4m26s** |
| 3090 | MiniMax H3 | 832×480 | **362 (15 s)** | 20 | same | **23m17s** |
| 3090 | FramePack | 512×768 | 145 (4.8 s) | 25 ×4 sections | bf16, DynamicSwap | ~16 min |
| 5060 Ti 16GB | LTX-2.5 I2V | 1.2 MP | 10 s | — | — | 470–491 s |
| 5060 Ti 16GB | LTX-2.3 I2V | 1.2 MP | 10 s | — | — | **313–325 s** |
| 5060 Ti 16GB | MiniMax H3 I2V | 0.6 MP | 10 s | 6 (turbo) | — | 738–788 s |
| 5070 Ti 16GB | MiniMax H3 | 640×480 | **736 (30 s)** | 20 | pruned_int8 + EasyCache | 9m55s |
| 4060 Ti 16GB | FramePack | ~640 | 33 | 25 | +Xformers+Sage | **3m17s** |
| 4090 24GB | HunyuanVideo 1.5 I2V step-distilled | 480p | 121 | 8 or 12 | — | **"within 75 seconds"** [OFFICIAL] |
| **3060 12GB** | **LTX-2.5 distilled** | 960×544 | **15 s clip** | 8 | int8-convrot | **~5 min** |

Note the LTX-2.5-is-slower-than-2.3 result (470 s vs 313 s on the same card and same
prompt) — the quality/speed trade moved, it did not strictly improve.

### 9.4 Minimum viable VRAM

| Model | Floor | Caveat |
|---|---|---|
| **FramePack** | **6 GB** [OFFICIAL, verbatim: *"To generate 1-minute video (60 seconds) at 30fps (1800 frames) using 13B model, the minimal required GPU memory is 6GB. (Yes 6 GB, not a typo.)"*] | Needs **36–45 GB system RAM**, transiently 70–90 GB on first LoRA merge |
| **LTX-2.5 distilled int8** | **~12 GB measured** (3060) | bf16 transformer is **42 GB** and will not load on any consumer card |
| **HunyuanVideo 1.5** | **14 GB with offloading** [OFFICIAL] | **Resolution/length not stated** — do not assume 720p |
| **MiniMax H3 pruned int8** | **16 GB measured** (peak 12.5–15.6 GiB) | See RAM warning below |
| **Wan 2.2 TI2V-5B** | *"fits well on 8 GB"* in ComfyUI [OFFICIAL] | CLI official floor is **24 GB and it still OOMs at VAE decode** on both 4090 and 3090 (issues #34, #90) |
| **Wan 2.2 A14B** | 80 GB [OFFICIAL] | Consumer path is community GGUF/fp8 only |
| **Wan-Animate-2** | Tuned for **8× A800**; 480P on 2× A800 | **No consumer VRAM figure exists** |
| **SCAIL-2** | **None published, on any GPU.** Arithmetic floor ~27 GB of weights | **Zero benchmarks exist anywhere** |
| **HunyuanVideo 13B** | 45–60 GB [OFFICIAL] | Effectively datacenter-only |

**The single most under-reported constraint is system RAM, not VRAM.** For MiniMax H3
in ComfyUI, measured on the same job with only a startup flag changed:

| Flag | ComfyUI RSS peak |
|---|---|
| default | **45.43 GiB** |
| `--fast-disk` | 12.64 GiB |
| **`--disable-pinned-memory`** | **6.07 GiB** |

A 31 GB box went from **OOM-killed to completing**. **Every contradictory "32 GB works /
32 GB fails" report on the web is this flag.** [TESTED, two independent reporters]

**VAE decode kills more runs than sampling does** — on Wan the 50/50 denoise steps
complete and *then* it OOMs in `vae2_2.py decode`; on LTX-2.5 the symptom is a **hang,
not an error**; on H3 `VAEDecodeTiled` is a **literal no-op** (the H3 VAE already tiles
internally). [TESTED, code-verified for H3]

### 9.5 Quantization and few-step reality

**The Wan 2.2 MoE trap:** published GGUF sizes are **per expert**, and A14B has two.
Q4_K_M = 9.65 GB per expert = **19.3 GB both**; Q8_0 = 15.4 → **30.8 GB**. Peak VRAM is
~one expert (experts swap at the SNR threshold), but disk and RAM cost 2×. Several
widely-copied guides publish the one-expert column as whole-model VRAM.

**Claimed vs actually-usable step counts** — teach this table, it corrects four
widespread errors:

| Model | Claimed | Actually usable |
|---|---|---|
| Wan 2.2 Lightning | 4 | 4 works, but authors document artifacts and **reversed vehicle direction** under extremely large motion |
| Wan-Animate-2 distill | **10** | 10 (base is 40) — notably more conservative than Lightning |
| **LTX-2.x distilled** | 8 | **8, verified on 3060, 3090 and 5090** |
| LTX-2.x **dev** | blog says "20–50" | **30** per Lightricks staff; a user at 50 steps was still *"getting bad outputs, I mean just bad"* — the official workflows are distilled-tuned |
| **MiniMax H3 turbo LoRA** | "4-step" | **6–8 best**; at 4 steps with heavy motion it smears. LoRA author's own guidance |
| **HunyuanVideo 1.5 CFG-distilled** | assumed few-step | **50 steps. Verbatim: *"the cfg distilled model we provided, must use 50 steps to generate correct results."*** The ~2× gain is from dropping CFG, not steps |
| **FramePack** | — | **25, and the UI says *"Changing this value is not recommended."*** README: *"No timestep distillation."* |
| SCAIL-2 | — | LightX2V Wan2.1 distill LoRA transfers: 8 steps |

**Quantization damage is separable from step count, and it is the quantization.**
**[TESTED — the best-controlled test found in any language]** AIwood, RTX 5090D,
2026-08-09, **fixed seed 999**, 10 s clips, same machine, varying only precision and
steps: *"W4A8 produced motion-logic errors even when run at 20 steps."* His pick was
BF16 + LightX2V at 6 steps (~240 s), not the 7× faster W4A8 4-step (~115 s).
<https://bbs.monster/thread-4652-1-1.html>

**Per-quant-tier quality loss (Q4 vs Q6 vs Q8) has NEVER been measured for any model in
this roster.** [NO EVIDENCE] city96 publishes no video-specific numbers; NVIDIA's NVFP4
card says it evaluated on VBench 2.0 and **publishes no scores**. Do not let students
fill this with a guess.

Three documented quantization/precision breakages, and only three:
1. **Wan2.2 Animate fp8 grid-pattern noise** — initial fp8_scaled uploads left face-encoder
   layers in bf16 and ComfyUI downcast them; fixed in `_v2`. [TESTED, by the quantizer]
2. **LTX FP8 audio-video desync** — mitigated by keeping norm layers and
   `audio_in`/`video_in`/`time_in`/`guidance_in` in BF16. [TESTED, single source]
3. **H3 audio destroyed by LCM+Beta scheduler** — not a quant issue. [TESTED]

---

## 10. Style range

### 10.1 The best-evidenced style claim in the whole file: Wan 2.2 has a realism bias

Three independent directions:

- **[OFFICIAL]** The Wan2.2 README's only style claim is cinematic. The words "anime",
  "cartoon", "2D" and "illustration" appear **nowhere**; all example prompts are photoreal.
- **[TESTED]** The author of the top Wan 2.2 anime LoRA (271 reviews, "Very Positive"),
  from training experiments: *"WAN 2.2 appears to have a strong bias towards realistic
  generations… more consistent generation can be achieved by bumping the model strength
  up to 1.2 or adding `((realistic))` to your negative prompt."* The LoRA's stated
  purpose: *"useful for maintaining this style when a prompt or model has a tendency to
  insert realism **or a 3d animation aesthetic**."*
- **[TESTED]** Wan GitHub issue #435, open since Jun 2025: *"One of the biggest Wan
  issues, for those trying to work on anime only, is that it often slides towards
  realism. **Especially when generating multiple videos to make a longer one.**"* —
  i.e. **the drift compounds across chained clips.**

### 10.2 Lightricks is unusually candid about the same problem

**[OFFICIAL]**, from LTX's own docs:
> *"AI video generation defaults to photorealism. That is what the training data
> emphasizes."*
> *"**Style Drift Mid-Generation** — The model may start in a consistent style but
> gradually drift toward photorealism over a longer clip. To counter this, keep clips
> short (2-4 seconds) and regenerate rather than generating long continuous shots."*
> *"**The visual anchor of a non-photorealistic image is often more effective than
> text-only style control.**"*

### 10.3 MiniMax H3 has the most explicit style vocabulary of any vendor

**[OFFICIAL]** *"Common styles include `Cinematic`, `live-action`, `2D-animated`,
`3D CG`, `claymation`, `watercolor`, and `vintage film`."* Style goes at the head of
`[Shot 1]`; for keyframe modes, derive style from the reference image, not from text.
This makes H3 the strongest **prompt-only** stylized model in the roster.

### 10.4 LoRA ecosystem depth (Hugging Face adapter counts, 2026-08-17)

| Base model | Adapters | Read |
|---|---|---|
| `Lightricks/LTX-Video` (whole lineage) | **354** | Inflated by lineage tagging; skews to ID/enhancement |
| `Wan-AI/Wan2.2-I2V-A14B` | **330** | **Deepest live anime ecosystem — precisely because the base is bad at anime** |
| `tencent/HunyuanVideo` | 114 | **A fossil record** — nearly all Dec 2024–Feb 2025 |
| `Wan-AI/Wan2.1-T2V-14B` | 75 | |
| `Wan-AI/Wan2.2-T2V-A14B` | 48 | |
| `Wan-AI/Wan2.2-TI2V-5B` | 18 | 5B is under-served |
| `Lightricks/LTX-2.5` | 4 | 6 days old at count time |
| `MiniMaxAI/MiniMax-H3` | 3 | 2 weeks old |
| `tencent/HunyuanVideo-1.5` | **1** | **Recommending HV1.5 for style means prompting only** |

**[OFFICIAL] LTX cross-version portability is a genuine advantage:** *"the large majority
of LoRAs and IC-LoRAs trained on LTX-2.3 run on LTX-2.5 without changes."*
**[OFFICIAL] Wan-Animate portability is a warning:** *"If you're using Wan-Animate, we do
not recommend using LoRA models trained on Wan2.2, since weight changes during training
may lead to unexpected behavior."*

### 10.5 Does 2D art get unwanted 3D motion? Yes — and someone diagnosed the mechanism

**[TESTED]** あかぽろ / redpolo, 2025-10-01, Wan2.2-Animate character-replace, same chibi
reference + same driving video, default vs. tuned settings:

> 「参照画像のキャラクターがアニメキャラクターのように実写の人物と大きく異なるプロポーション
> だった場合、実写側のプロポーションに引きずられアニメ体型が崩れやすい傾向があります。」
> *"When the reference character has proportions very different from a real person — like
> an anime character — it gets **dragged toward the live-action proportions and the anime
> body type readily collapses**."*

Causes: the auto mask region is far too small for a big-headed character, and the
extracted ViTPose skeleton has human proportions. He shipped a retargeting node. His
tested settings: `adjust_scale` **0.5–0.7×** for chibi; anchor on **feet, not neck**, for
grounded full-body shots; **`relight_lora` is actively bad for anime** —
「アニメ特有の塗りと相性が悪い」 *"poor affinity with anime-specific flat coloring"*;
`face_strength` ≥0.5 even if unused or you get mask-boundary noise; at 480p a
normal-proportioned character's face collapses when the full body is in frame.
<https://note.com/redpolo/n/nfc9c72321f74>

**Independent confirmation from the LoRA-training side**, verbatim version notes:
*"**Version 1**: Helps maintain style on characters; **suffers quality loss when doing
advanced motion or dramatic camera movement.** Trained on an image set."* /
*"**Version 2**: … **more traditional character movement as seen in Japanese
animation.** Trained on a set of images **and a set of video clips**."*
**A still-image-trained anime LoRA degrades under camera movement, and fixing
"Japanese animation movement" required adding video clips.** That is strong evidence
the base motion prior is 3D-camera-shaped and must be re-taught for 2D. [TESTED]

**[OFFICIAL]** A 2D limit LTX names that no model can currently fix: *"Traditional 2D
animation often runs on 'twos' … **AI-generated video runs at a continuous framerate, so
achieving that look requires post-processing or prompt-level pacing cues.**"*

**[NO EVIDENCE]** Nobody has published a controlled "flat 2D input → measure added
parallax" test for base T2V/I2V on any model. The redpolo finding is about
Animate/motion-transfer specifically.

**[LORE] to discard:** the widely-copied advice to add `3D, Blender, Unreal Engine, CGI`
to negatives and `2D anime style, cel-shaded, flat shading` to positives has **no test
behind it anywhere**. The two communities that actually solved this solved it
differently — Japanese via geometry/conditioning fixes, Chinese via dedicated Wan 2.2
anime finetunes (Dasiwa V8–V10, AniSora V3, Anime-Unlimited) — and **neither used magic
negative-prompt strings.**

---

## 11. Licence and practical constraints

| Model | Licence | Commercial | Regional | Gate |
|---|---|---|---|---|
| **Wan 2.2** (all variants) | **Apache-2.0** | Yes | None | Ungated |
| **Wan2.2-Animate-2** | **Apache-2.0** (verified via HF API today) | Yes | None | Ungated |
| **Wan-Dancer-14B** | Apache-2.0 | Yes | None | Ungated |
| **SCAIL-2** | **⚠️ Conflict: GitHub says Apache-2.0, HF card metadata says MIT** | Yes either way | None found | Ungated |
| **LTX 2.3 / 2.5** | LTX-2 Community License (`ltx-2-community-license-agreement`) | Yes, with a revenue threshold; 2.5 docs claim *"fewer restrictive third-party dependencies and a clearer path to fine-tune, deploy, and commercialize"* | None found | **`gated: auto`** — click-through + contact info |
| **MiniMax H3** | MiniMax H3 Community License | Yes, in-territory | **Excludes US, EU, UK, South Korea — and the licence restricts the *Outputs*, not just the weights** | Ungated on HF, but see territory |
| **HunyuanVideo / 1.5** | Tencent Hunyuan Community | Yes, in-territory | **`extra_gated_eu_disallowed: true`** — EU blocked | Gated |
| **FramePack** | Apache-2.0 | Yes | None | — |

**Three practical footguns beyond the licence text:**

1. **H3's territory clause is the sharpest constraint in the roster.** *"You may not use,
   reproduce, modify, distribute, or display the MiniMax H3 Works or any of their Outputs
   or results outside the Applicable Territory."* MiniMax's own Q&A says *"The current
   limitation means 'not yet', not 'not ever'"* and institutions can apply at
   <https://platform.minimax.io/h3-license>. An Apache relicense is a **conditional AMA
   hedge, not a commitment** — do not teach it as coming.
2. **Two "local" models have cloud-shaped holes.** H3's Context-IR (which its own card
   calls *"critical to the quality of the final output"*) and Regenerate-2K are hosted
   API only. SCAIL-2's official prompt enhancer requires a `GEMINI_API_KEY`.
3. **[OFFICIAL] FramePack has an impostor-domain problem** the author insists on
   carrying: *"this GitHub repository is the only official FramePack website… All other
   websites are spam and fake, including but not limited to `framepack.co`,
   `framepack.net`, `framepack.ai`, `framepack.pro`, `framepack.cc`, `framepackai.co`…
   Do not pay money or download files from any of those websites."* Worth showing
   students as a media-literacy example.

---

## 12. Head-to-head bakeoff register

Ranked by methodology quality. **Only #1 holds seed, prompt, input, resolution, frames
and quantization constant across models.**

| # | Who / when | Hardware | Models | What was held constant | Conclusion | Trust |
|---|---|---|---|---|---|---|
| 1 | **zenn.dev/toki_mwc**, 2026-03-11 / upd. 06-28 | RTX 5090 32GB | LTX-2.3 distilled vs Wan 2.2 14B I2V | Input image, prompt, 832×480, 81 frames, GGUF Q4_K_M both | LTX **5.7× faster** (22.1 s vs 125 s); **Wan wins quality** — fixed camera, less hand breakdown | **High** |
| 2 | **AIwood 爱屋研究室**, 2026-08-09 | RTX 5090D | MiniMax H3, W4A8 vs BF16 × 4/6/20 steps | **Fixed seed 999**, same machine, 10 s, same resolution | *"W4A8 produced motion-logic errors even when run at 20 steps"* — damage is the quantization, not the step count | **High** (within-model) |
| 3 | **おーら / ai_0049**, 2026-08-13 | RTX 5060 Ti 16GB | LTX-2.5 vs LTX-2.3 vs MiniMax H3 | Same input image, same prompt, 10 s target, 3 scenes; prompts published | *"view LTX2.5 as 'a different tool for long takes and high-speed iteration' rather than a 'replacement for MiniMax H3'"*; *"MiniMax H3 is still a step ahead"* on motion persuasiveness; LTX2.5 *"turned the woman into two people"* | **High for practicality, Medium for ranking** — seed not controlled (he says so), resolution deliberately unequal (1.2 vs 0.6 MP), n=1 per scene |
| 4 | **西川和久 / PC Watch**, 2026-08-13 | RTX 5090 @500W | MiniMax H3 vs Wan 2.2 / LTX-2.3 (qualitative) | Named nodes, measured timings; no side-by-side grid | *"a completely different dimension from the Wan 2.2 and LTX-2.3 I've been using locally"*; H3 720p/10 s ≈ **144 s**. On Sora 2 `(CLOUD)`: *"it exceeds it by quite a lot. But… it's the video generation **engine** performance that has been surpassed"* | **High outlet, Medium method** |
| 5 | **AIwood**, 2026-08-13 | RTX 5090D 32G, 128GB RAM | H3 FL2VA vs Ref2VA × steps × LoRA strength | **Fixed seed 666**, 10 s, 1 MP | **Ref2VA produces "triangle eyes" (三角眼) when the face is small in frame**; FL2VA gets pixelation instead; Ref2VA has a persistent "greasy" look worsened by accel LoRA. Pick: FL2VA + 6 steps | **High** (within-model) |
| 6 | **おーら**, 2026-08-06 | RTX 5060 Ti 16GB | Wan-Dancer-14B vs H3 vs LTX-2.3 | *"as consistent as possible"* — duration and resolution **not** matched | Wan Dancer = *"Pro Dancer… sharpness is exceptional. However, it is resource-heavy"*; H3 = *"Idol Dance"*, within range of 12GB GPUs; LTX2.3 = *"Amateur Dance… weak in choreographic consistency over long durations"*. Self-caveat: *"impossible to judge 'consistency' in just about 5 seconds"* | **Medium** |
| 7 | **LUTA@AI**, 2026-03-16 | RTX 4090 24GB, 32GB RAM | LTX-2.3 FP8 vs GGUF | Same workflow | **Speed is not reproducible**: 134 s → **13+ minutes** on the second run (shared-GPU-memory swap). Requires ComfyUI restart for any change other than the seed. *"In the RTX 4090 environment, 22B-class models turn out to lack stability"* | **High** (single-model) |
| 8 | **T8star-Aix**, 2026-06-16 | RunningHub cloud | SCAIL-2 context-window vs KJ relay | Approach-level | KJ relay stable ~20–30 s but tearing accumulates; SCAIL-2 lower VRAM, higher ceiling, but visible flicker at each context switch. Recommends KJ relay under ~20 s | **Medium** — heavy commercial COI |
| 9 | **T8star-Aix**, 2026-08-10 | RunningHub cloud | Wan-Animate-2 hands-on | — | **20 s ≈ 9 min at 832 res.** Face consistency stable frontal/close; small-face and long shots drift. Community workflows **had not reproduced official replacement capability** | **Medium** |
| 10 | **AIwood**, 2026-08-12 | RTX 5090D | LTX-2.5 first test | — | **1920×1080 / 10 s ≈ 160–170 s.** On-screen text improved over 2.3. **大动态表现仍有不足** — *"large dynamics still weak."* **2.3 workflows run on 2.5 weights but audio-driven lip-sync fails** | **Medium** |
| 11 | **ltx2bench / appvikalabs** | RTX PRO 6000 96GB | LTX-2 19B distilled, 8 pipeline variants | Same prompt, same source image, warm-cache | Best T2AV 14.8 s @1280×704. **Native speech "gibberish" — requires TTS mux.** Kijai upscale pass *"destroys audio"*; FFLF upscale *"generates completely different person from input frames"* | **High** (within-model) |

### 12.1 YouTube bakeoffs — exist, methodology unverifiable

Confirmed to exist via oEmbed; **page bodies were not fetchable, so no settings, seed or
hardware could be verified for any of them.** Treat as **[LORE]** until someone watches
them and records the methodology:

- "MiniMax H3 vs LTX 2.3 vs Wan 2.2 — Same Prompt, Which Wins?" (Floyo AI) — the only
  conclusion text obtained, and it is second-hand from a search index: *"H3 has the best
  motion, camera, and physics, while LTX 2.3 is most consistent and reliable."*
- "MiniMax H3 vs LTX 2.5 — I Ran the Same Prompts (Who Wins?)" (The AI Brief)
- "LTX 2.5 vs Minimax H3 (Local Free AI Video Comparison)" (CuriAWEsity)
- "The AI War Has Started: MiniMax H3 vs LTX 2.3 — Head To Head" (Codebreakers)

### 12.2 Sources to name and distrust

- **`wavespeed.ai/blog/posts/ltx-2-3-vs-wan-2-2-comparison-2026/`** — the worst offender
  *because it is the most convincing*. Claims *"RTX 4090, ComfyUI nightly, identical
  prompt + seed where supported"* and *"LTX ranged 10–14× faster."* Tells: WaveSpeed
  **sells LTX-2.3 and H3 API access**, linked 3×; **zero output frames** (all images are
  stock illustration); no prompts, seeds, step counts or checkpoint hashes despite
  claiming a controlled seed; states *"I couldn't find reliable public parameter counts
  for either model"* which is flatly false for Wan 2.2; the "wan 2.2" link is a paid-search
  affiliate URL with a `gclid`. **This is the origin of most of the "LTX is 10–18× faster
  than Wan" folklore now laundered into search-engine summaries as fact.**
- **`willitrunai.com`** — a **calculator, not a benchmark**; self-discloses *"All
  estimates are approximations based on mathematical models and public specifications."*
  Its HunyuanVideo 1.5 "45–90 seconds per 4-second clip" is contradicted by two
  first-party issue reports of 40–60 **minutes**.
- **`ltx23.org`** — an unaffiliated paid generation service, **not Lightricks**. Claims
  LTX 2.3 is "Apache 2.0" (it is the LTX Community License).
- **Same-template SEO cluster, all [LORE]:** wan27.org, crepal.ai, nemovideo.com,
  mindstudio.ai, kie.ai, orcarouter.ai, jxp.com, sourceforge compare pages,
  localaimaster.com, spheron.network, apatero.com, earngenix.com, minimaxh3.co,
  ltxworkflow.com, and `ltx.io/alternatives/*` (vendor-authored).
- **`jisaku.com/posts/ai-video-generation-local`** — headline says Wan2.2/LTX-2.3; the
  body is a stale 2024 article about Wan2.1, CogVideoX-5B, Mochi 1 and AnimateDiff with
  a new title bolted on. Section headings literally read 「Wan2.1の詳細セットアップ手順」.
- **Widely-copied Chinese numbers with no source, do not repeat:** "15秒 RTX 4090
  约4分钟", "单4090D 768p/50步 约30–40分钟", "VBench 文生视频得分 1455", "8G显存就能跑",
  and the bilibili clickbait 「MiniMax H3 由30B降为20B」 (contradicted by the [OFFICIAL]
  33B figure).

---

## 13. "Nothing found" register

Searched for this pass, not located. Each is a finding.

1. **Any direct Wan-Animate-2 vs SCAIL-2 comparison** — none exists, and none is
   *possible* from published data because Wan-Animate-2 published no metrics.
2. **Any LTX-2.5 vs Wan 2.2 comparison** — not one. Every "LTX vs Wan" search result is
   about LTX **2.3**.
3. **Any MiniMax H3 vs Wan 2.2 comparison with published settings** — none. Only
   unverifiable YouTube titles and one journalist's qualitative verdict.
4. **Any audio / lip-sync comparison between the two local AV-natives (LTX vs H3)** —
   none, despite that being both models' headline feature.
5. **Any LTX 2.x version in any benchmark** — none. All LTX benchmark evidence is the old
   LTX-Video-2B.
6. **Any audio metric for LTX-2 or H3** — no FAD, no AV-Align, no sync score, no MOS,
   from any source including the vendors.
7. **Per-quant-tier quality loss (Q4 vs Q6 vs Q8) for any model in this roster** — never
   measured. NVIDIA's own NVFP4 card says it evaluated on VBench 2.0 and publishes no scores.
8. **Audio corruption tied to a specific quantization level** — the FP8 desync claim is a
   single self-interested source; nobody has published a quant-ladder audio comparison.
9. **Any same-seed *cross-model* bakeoff, in any language.** Seeds are not portable across
   these architectures; every tester either ignores this or hedges. All fixed-seed work
   found is within-model.
10. **Any benchmark measuring object counts** in video generation.
11. **Any controlled "flat 2D input → measure added parallax" test** for base T2V/I2V.
12. **SCAIL-2 speed or VRAM on any GPU** — zero benchmarks exist anywhere.
13. **Wan-Animate-2 on any consumer GPU** — zero.
14. **Whether the desktop stays usable during generation** — measured for nothing except
    FramePack, which is explicitly designed for it.
15. **Any Wan 2.5/2.6/2.7/3.0 open weights** — re-verified absent today.
16. **Wan-Animate-2-Lite weights, H3-Context-IR weights, H3-Regenerate-2K weights, H3
    sparse attention, FramePack-P1** — all announced, none released.
17. **Reddit coverage generally.** `reddit.com` is fetch-blocked in this environment and
    WebSearch rejects the domain; r/StableDiffusion, r/comfyui and r/LocalLLaMA
    contributed **nothing** to this pass. That is a hole in the evidence base, not a
    finding about the models. **Highest-value follow-up.**

---

## 14. Honest assessment of this comparison

**What is solid:** the licence/regional analysis, the hardware/VRAM floors, the
step-count corrections, the Wan 2.2 adherence profile, the SCAIL-2 vs Wan-Animate-2
*capability* split, and the "no evidence" register.

**What is thin:** almost every *quality* ranking. There is exactly **one** controlled
cross-model test in the entire literature, it covers two models, it is five months old,
and it predates LTX-2.5 and MiniMax H3 entirely. The Artificial Analysis Elos are the
broadest signal available and they measure **preference under non-native prompting**,
which systematically penalises H3 (whose own vendor says so) and cannot separate
adherence from aesthetics.

**What would change the picture fastest**, in priority order:
1. A single fixed-prompt, fixed-input, three-seed run of Wan 2.2 / LTX-2.5 / H3 on one
   machine, publishing outputs and settings. **Nobody has done this.** It is the highest-value
   artifact a teacher could produce, and it is a weekend of work on a 5090.
2. Any quant ladder (Q4/Q6/Q8) with published stills — the whole community is guessing.
3. Anyone actually running Wan-Animate-2 and SCAIL-2 on the same driving video.

**The most useful thing to tell students** is not which model wins. It is that
**capability differences between these models are large and well-documented, while
quality differences are small, contested, and mostly unmeasured** — so choose on
capability, licence and hardware, which are knowable, rather than on quality, which
currently is not.

---

## 15. Sources

### Official / first-party
- [MiniMax H3 model card](https://huggingface.co/MiniMaxAI/MiniMax-H3) — full spec table, architecture, Context-IR/Regenerate-2K status, licence links. Read verbatim this pass.
- [MiniMax H3 Community License](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/LICENSE) and [`docs/QA-about-License.md`](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/docs/QA-about-License.md)
- [MiniMax H3 prompt guides + Skills pack](https://github.com/MiniMax-AI/MiniMax-H3/tree/main/skills)
- [LTX open-source docs overview (2.5)](https://docs.ltx.io/open-source-model/getting-started/overview) — "New in 2.5" list read verbatim this pass.
- [LTX docs prompting guide](https://docs.ltx.io/open-source-model/usage-guides/prompting-guide) · [system requirements](https://docs.ltx.io/open-source-model/getting-started/system-requirements)
- [Lightricks/LTX-2.5 HF API record](https://huggingface.co/api/models/Lightricks/LTX-2.5) — file manifest, `gated: auto`, `ltx-2-community-license-agreement`, 465,529 downloads, lastModified 2026-08-17. **New since the 08-15 pass: 2.5 now ships its own `latent_upscale_models/ltx-2.5-latent-spatial-upscaler-x2` and `-temporal-upscaler-x2`** — the 2.3-upscaler dependency noted in the prior addendum appears resolved.
- [LTX-2 paper, arXiv:2601.03233](https://arxiv.org/html/2601.03233v1) — read in full. One table; no VBench; no audio metrics.
- [Wan-AI HF org listing](https://huggingface.co/api/models?author=Wan-AI&sort=lastModified) — checked 2026-08-17, confirms no Wan 2.5/2.6/2.7/3.0.
- [Wan2.2-Animate-2-14B](https://huggingface.co/Wan-AI/Wan2.2-Animate-2-14B) (Apache-2.0, 139 likes / 0 downloads) and [paper arXiv:2608.06009](https://arxiv.org/html/2608.06009v1) — read in full; **no metric tables, no limitations section**.
- [Wan-Dancer-14B](https://huggingface.co/Wan-AI/Wan-Dancer-14B) — arXiv:2607.09581, Apache-2.0.
- [SCAIL-2 paper arXiv:2606.10804](https://arxiv.org/html/2606.10804v1) — Table 2 read verbatim; §4.3–§6 not verbatim-accessible (fetch truncation), items so sourced are flagged medium confidence.
- [zai-org/SCAIL-2 GitHub](https://github.com/zai-org/SCAIL-2) (Apache-2.0) vs [HF card](https://huggingface.co/zai-org/SCAIL-2) (MIT) — the licence conflict.
- [HunyuanVideo-1.5 model card](https://huggingface.co/tencent/HunyuanVideo-1.5) — `extra_gated_eu_disallowed: true`, Tencent Hunyuan Community licence, 8.3B, 14 GB with offloading, 480p I2V step-distilled "within 75 seconds" on a 4090, CFG-distilled needs 50 steps. Verified 2026-08-17.
- [FramePack](https://github.com/lllyasviel/FramePack) — 6 GB claim, 25 steps, "No timestep distillation", impostor-domain warning.
- [lightx2v/Wan2.2-Lightning](https://huggingface.co/lightx2v/Wan2.2-Lightning) — the large-motion artifact admission.
- [ComfyUI Wan 2.2 tutorial](https://docs.comfy.org/tutorials/video/wan/wan2_2) · [SCAIL-2 tutorial](https://docs.comfy.org/tutorials/video/zai/scail2) · [MiniMax H3 tutorial](https://docs.comfy.org/tutorials/video/minimax/minimax-h3) · [changelog](https://docs.comfy.org/changelog)

### Tested / papers
- [AnimationBench, arXiv:2604.15299](https://arxiv.org/pdf/2604.15299) — Wan 2.2 CMC 42.86, Scene Depiction 96.43; full CMC roster.
- [Anchored Video Generation, arXiv:2512.16371](https://arxiv.org/html/2512.16371) — T2V-CompBench, 5 seeds, seed-variance figures.
- [VBench-2.0, arXiv:2503.21755](https://arxiv.org/html/2503.21755v2) — camera motion dimension; the "80% failure" quote.
- [SpatialAlign, arXiv:2602.22745](https://arxiv.org/html/2602.22745v1) — LTX-Video-2B 0.058 / ID-Consistency 0.8028.
- [MMGR, arXiv:2512.14691](https://arxiv.org/html/2512.14691) — Wan 2.2 maze/sudoku/ARC failures.
- [RAPO++, arXiv:2510.20206](https://arxiv.org/abs/2510.20206) — the counting-failure quote; generic rewriters below raw.

### Tested / community
- [zenn.dev/toki_mwc — LTX-2.3 vs Wan 2.2 on RTX 5090](https://zenn.dev/toki_mwc/articles/ltx23-vs-wan22-i2v-benchmark-rtx5090) — **the only true controlled cross-model test located.**
- [note.com/ai_0049 — LTX-2.5 vs LTX-2.3 vs MiniMax H3](https://note.com/ai_0049/n/n46672bb50bf0) (2026-08-13) and [Wan-Dancer vs H3 vs LTX-2.3](https://note.com/ai_0049/n/n6ca05d44959d) (2026-08-06)
- [PC Watch / 西川和久 — MiniMax H3 local](https://pc.watch.impress.co.jp/docs/column/nishikawa/2132431.html) (2026-08-13)
- [note.com/luta_ai — LTX-2.3 FP8 vs GGUF on 4090](https://note.com/luta_ai/n/n6cfb06fb6b69) (2026-03-16) — reproducibility failure, FFLF/lip-sync exclusivity.
- [note.com/redpolo — anime proportion collapse in Wan2.2-Animate](https://note.com/redpolo/n/nfc9c72321f74) + [retargeter node](https://github.com/red-polo/ComfyUI-WanViTPoseRetargeter)
- [AIwood — H3 W4A8 vs BF16, fixed seed 999](https://bbs.monster/thread-4652-1-1.html) · [H3 FL2VA vs Ref2VA, seed 666](https://bbs.monster/thread-4693-1-1.html) · [LTX-2.5 first test](https://bbs.monster/thread-4677-1-1.html)
- [T8star-Aix — SCAIL-2 vs KJ relay](https://bbs.monster/thread-4183-1-1.html) · [Wan Animate 2 hands-on](https://bbs.monster/thread-4658-1-1.html)
- [ltx2bench — LTX-2 T2AV pipeline shootout, RTX PRO 6000](https://appvikalabs.github.io/ltx2bench/) — source of the "native speech is gibberish" finding.
- [Tomiigo/minimax-h3-16gb](https://github.com/Tomiigo/minimax-h3-16gb) and [tonyd2wild/minimax-h3-local](https://github.com/tonyd2wild/minimax-h3-local) — the `--disable-pinned-memory` RAM finding, independently corroborated.
- [Wan2.2 issue #34](https://github.com/Wan-Video/Wan2.2/issues/34) / [#90](https://github.com/Wan-Video/Wan2.2/issues/90) — official-command VAE-decode OOM on 4090 and 3090.
- [Wan2.1 issue #435](https://github.com/Wan-Video/Wan2.1/issues/435) — anime-to-realism drift, open since Jun 2025.
- [Anime Style WAN 2.2 I2V LoRA](https://civitai.com/models/2222779/anime-style-wan-22-i2v) — the realism-bias training report and v1-vs-v2 camera-motion note.
- [QuantStack Wan2.2-I2V-A14B-GGUF](https://huggingface.co/QuantStack/Wan2.2-I2V-A14B-GGUF) — the per-expert size trap.

### Comparative / preference
- [Artificial Analysis text-to-video leaderboard](https://artificialanalysis.ai/video/leaderboard/text-to-video) · [image-to-video](https://artificialanalysis.ai/video/leaderboard/image-to-video) — H3 Elos; open-weights sub-rankings in §3.4 are search-index-derived and should be re-verified against the live board before teaching.

### Named as unreliable (cited for what they claim, not as evidence)
- `wavespeed.ai/blog/posts/ltx-2-3-vs-wan-2-2-comparison-2026/` · `willitrunai.com` ·
  `ltx23.org` · `wan27.org` · `docs.dreamerland.ai/…/wan-animate-vs-scail2` (compares
  Wan-Animate **v1**, architecturally stale) · `jisaku.com` · the SEO cluster listed in §12.2.
