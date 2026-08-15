# MiniMax H3 — deep-dive addendum

Companion to `research/minimax-h3.md`. Research pass: **2026-08-15**. All URLs accessed
2026-08-15 unless otherwise noted. Scope: what is **new or missing** relative to the
2026-08-15 baseline brief. Basics already in the baseline (33B omni-transformer, 4–15 s,
17k+5 grid, 768p local / 2K hosted, FL2VA + Ref2VA, 9/3/3/12 reference caps, the official
T2VA and Ref2VA field formats, community license territory) are **not** re-derived here;
they are only cited when this pass changed or sharpened them.

Evidence labels: `[OFFICIAL]` MiniMax or ComfyUI first-party docs/code; `[STAFF]` MiniMax
employee statement outside docs; `[TESTED]` someone reports running it with numbers or
reproducible detail; `[LORE]` widely repeated, no run behind it; `[SPECULATION]` mine.

---

## 0. The single most important framing correction

The corpus (and most of the web) blurs **three different prompt layers**. Almost every
"H3 prompt guide" on the open web is written for layer 1 and is silently wrong if you
paste it into a local ComfyUI/diffusers H3-Base node.

| Layer | What it is | What the text looks like | Who it's for |
|---|---|---|---|
| 1. User intent | Free-form prose brief sent to `hailuoai.video`, `platform.minimax.io`, fal, Atlas Cloud, Runware, Comfy partner nodes | `Create a 15-second 16:9 crime title sequence… Audio: … Do not add Chinese text.` | Hosted API users |
| 2. H3-Context-IR | Hosted rewriter that converts layer 1 → layer 3 | n/a (a service) | Not written by hand |
| 3. H3-Base prompt | The structured Context-IR output the weights were trained on | `integrated_multimodal_description: [Shot 1] …` / `overall_soundscape:` / `non_diegetic_music:` | **Local deployment** |

`[OFFICIAL]` MiniMax says this explicitly in the open-source announcement
(<https://www.minimax.io/news/minimax-h3-open-source>, 2026-08-03):

```text
H3-Context-IR is critical to the quality of the final output, so we strongly recommend
incorporating it into your generation pipeline or following the "Prompting Guidance" to
build your own context-processing system.
```

```text
Because H3-Context-IR relies on a multi-stage workflow and multiple hosted models and
services, it is not included in this open-source release.
```

Practical consequence for a teaching app `[SPECULATION, high confidence]`: the two big
"reverse-engineered from 45 official prompts" guides (Atlas Cloud, fal) are **layer-1
corpora**. Their patterns — `[0s–2s]` time slices, standalone `Audio:` blocks, long
negative lists, `Image 1 is the mood board` role sentences — are *inputs to the rewriter*,
not the dialect the weights consume. They are still useful: they tell you what to write in
the box **before** your own rewriter step. But teaching them as "the H3 prompt format" is
the single most common error in the public material.

Confirmation that these are layer-1: an independent read of fal's guide found the strings
`integrated_multimodal_description`, `overall_soundscape`, `non_diegetic_music` do **not
appear anywhere** in it, and all 44 examples are prose blocks
(<https://fal.ai/learn/devs/minimax-h3-prompting-guide>). Same for Atlas Cloud's Ref2V
test article (<https://www.atlascloud.ai/blog/tips/minimax-h3-reference-to-video>).

---

## 1. What actually shipped or changed, 2026-08-03 → 2026-08-15

### 1.1 Timeline

| Date | Event | Label |
|---|---|---|
| 2026-08-03 | Open weights on HF/ModelScope; ComfyUI **v0.30.0** native support same day | `[OFFICIAL]` |
| 2026-08-03 | ComfyUI PR #15227 adds **768P** to the H3 *partner* (API) nodes | `[OFFICIAL]` |
| ~2026-08-05 | Reddit AMA, r/StableDiffusion | `[STAFF]` |
| 2026-08-07 | ComfyUI **v0.31.0**: `int8_convrot` VAE for H3; **fixed H3 audio corruption with EasyCache** (#15390); fixed MiniMax audio sampler issues + expanded sampler support (#15243); fixed audio-VAE full offload (#15377); fixed H3 latent noise-mask sampling (#15322) | `[OFFICIAL]` |
| 2026-08-09→10 | **Official Skills pack** published to `MiniMax-AI/MiniMax-H3/skills`: `h3-prompt-writing` + **8 style-specific production skills**, style skills bilingual (`SKILL.cn.md`) | `[OFFICIAL]` |
| 2026-08-11 | ComfyUI **v0.32.0**: optimized H3 VAE (#15446); **fixed peak-memory issue** (#15486); **fixed `VAEDecodeTiled` crash on NestedTensor latents (MiniMax H3)** (#15477); fixed broken tiled audio decode (#15502) | `[OFFICIAL]` |
| 2026-08-11 | **LTX-2.5** open weights ship, day-0 in ComfyUI, with *native multi-shot* | `[OFFICIAL]` |
| ~2026-08-12 | Atlas Cloud publishes the first genuinely instrumented Ref2V test run | `[TESTED]` |
| 2026-08-13 | ComfyUI **v0.33.1**: **MiniMax H3 Context IR & Regenerate nodes** added (PR #15471) — "Added Context IR prompt enhancer and Regenerate to 2K nodes"; also MiniMax Music 3 native support | `[OFFICIAL]` |
| — | Community 4-step Turbo LoRA (`lightx2v/Minimax-h3-Turbo` v0.1 preview + `ModelTC/Minimax-H3-Turbo` runner) | `[OFFICIAL-3P]` |

ComfyUI changelog source: <https://docs.comfy.org/changelog>.

### 1.2 Regenerate-2K: still not open, but now reachable from ComfyUI

`[OFFICIAL]` Not open-sourced as of 2026-08-15. Model card / news page:

```text
Due to the complexity of the system, this module is not yet open-sourced.
We will release it once it is ready.
```

`[STAFF]` AMA: MiniMax says H3-Regenerate-2K is **not** the base checkpoint run a second
time — it is a dedicated latent-space DiT regeneration model, currently being tuned for
efficiency/quality so it can run locally; they intend to open-source it, no date.
(Recap: <https://x.com/MiniMax_AI/status/2086253065657790895>; secondary readouts
<https://x.com/FurkanGozukara/status/2085529290892775819>,
<https://x.com/IamEmily2050/status/2085996847227646318>.)

`[OFFICIAL]` **New since the baseline**: ComfyUI v0.33.1 (2026-08-13) added *partner*
nodes for **H3 Context IR** and **H3 Regenerate to 2K**. So the documented "Full 2K
Workflow" (local H3-Base 768p → hosted Regenerate-2K) is now a graph you can build inside
ComfyUI instead of a shell script. It is still an API call requiring a MiniMax key — it is
**not** local 2K.

Teaching note `[SPECULATION]`: the Context IR node is arguably the more consequential of
the two, because it means a local user can now get the *official* layer-1 → layer-3
rewrite instead of hand-writing layer 3 or using an LLM approximation. Worth flagging in
the app as "the reference implementation of what your rewriter is imitating."

### 1.3 Sparse attention: announced, not shipped

`[OFFICIAL]` Model architecture section, verbatim:

```text
To reduce the computational cost of long multimodal sequences, H3 natively supports
sparse-attention training and inference. The initial open-source release provides
inference with full attention only. Our sparse-attention implementation will be released
in a future update.
```

```text
During the final stage of training, we introduce native sparse attention to reduce the
computational cost of long sequences. The sparse-attention implementation is not included
in the initial open-source release and will be published separately in a future update.
```

`[LORE]` Secondary sources describe it as MoBA-style train-aware block selection; MiniMax's
*text* model line does have a published sparse-attention paper (`arXiv:2606.13392`,
"MiniMax Sparse Attention"), but **no primary source ties that paper to H3's video
attention**. Do not assert the link. The practical consequence stands: **quadratic
attention scaling is still what you get locally on 2026-08-15**, so the baseline's
duration/resolution cost warning is unchanged.

### 1.4 License: no Apache relicense. "On the table" only.

`[OFFICIAL]` Weights remain under the **MiniMax H3 Community License Agreement**
(<https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/LICENSE>), effective 2026-08-02,
Applicable Territory = worldwide **except US, EU, UK, Republic of Korea**.

`[OFFICIAL]` MiniMax published a license Q&A doc that the baseline does not cite —
`docs/QA-about-License.md`. It is the most quotable thing on this topic and contains a
concrete escape hatch:

```text
The current limitation means "not yet", not "not ever."
```

```text
Organizations in these regions can apply for a formal license. After reviewing the
deployment scenario and confirming that appropriate compliance controls and safeguards
are implemented, MiniMax may authorize usage.
```

```text
Clearly communicate any future license changes instead of making silent updates.
```

Application form: <https://platform.minimax.io/h3-license>. Stated reasons: EU AI Act
enforcement, UK/KR uncertainty, and — notably — "MiniMax is also involved in ongoing
copyright-related legal proceedings specifically concerning generative video AI."

`[STAFF]` The AMA line about Apache is a *conditional*, and every secondary readout agrees
on the hedge: "as copyright matters settle, transitioning to an Apache-2.0 license is on
the table." **Not a commitment. No date. Do not teach it as coming.**

`[OFFICIAL]` Nuance worth keeping: the GitHub *repository* code is Apache-2.0 and the
Qwen3-VL-32B text encoder is Apache-2.0, but neither relicenses the H3 weights or outputs.

### 1.5 New checkpoints / derivatives

- `[OFFICIAL]` Still exactly **two** official checkpoints: `FL2VA` (t2va / fl2va) and
  `Ref2VA` (ref2va). Both **CFG-distilled**. No third checkpoint appeared.
- `[OFFICIAL-3P]` **4-step Turbo LoRA**: `lightx2v/Minimax-h3-Turbo`,
  `minimax_h3_fl2v_turbo_4step_v0.1.safetensors`, driver repo
  <https://github.com/ModelTC/Minimax-H3-Turbo>. Repo's own caveat, verbatim:

  ```text
  v0.1 is a preview release. Its current visual quality can be reviewed in the linked
  examples, and the image details still need improvement. An enhanced version is in
  development.
  ```

  Roadmap: improve FL2V Turbo quality, then **distill Ref2V**. So there is currently **no
  Ref2VA turbo**.
- `[TESTED]` The Turbo LoRA does *not* work well at its nameplate 4 steps.
  <https://aistudynow.com/minimax-h3-comfyui-workflow-almost-3x-faster-ref2va-guide/>
  (2026-08-07): "four steps did not work well for me. The output quality was poor." 8–10
  steps became usable with "some texture degradation." INT8 FL2VA + Turbo at 4 steps was
  "very poor." Author leaves Turbo disabled for production.
- `[STAFF]` AMA: team is "exploring four-step and eight-step inference"; **a smaller H3 is
  not currently planned**; a **unified text-to-image + general image-editing model derived
  from the H3 lineage** is in post-training and intended for open-source release.
- `[OFFICIAL]` Comfy-Org quantized repo now carries `bf16` (~66.3 GB each),
  `pruned_int8_convrot` and `pruned_fp8_scaled` (~21 GB) for both FL2VA and Ref2VA, plus
  `qwen3vl_32b_minimax_h3_nvfp4_awq` text encoder and the two VAEs
  (<https://huggingface.co/Comfy-Org/MiniMax-H3>).

### 1.6 Prompt-guide revisions

`[OFFICIAL]` The two canonical guides are **unchanged in substance** and are still
English-only. The HF `docs/` tree on 2026-08-15 contains exactly three files:
`QA-about-License.md`, `VIDEO_PROMPT_WRITING_GUIDE_base_en.md`,
`VIDEO_PROMPT_WRITING_GUIDE_ref_en.md`
(<https://huggingface.co/api/models/MiniMaxAI/MiniMax-H3/tree/main/docs>). **There is no
`_cn` guide.** See §6.

`[OFFICIAL]` What *is* new is the **Skills pack** (2026-08-09/10). Nine skills:

| Skill | Produces |
|---|---|
| `h3-prompt-writing` | The layer-3 rewriter, all five modes |
| `3d-animation-short-generator` | Full stylized 3D short: outline → character/env cards → shot table → storyboard → per-shot render → assembly → BGM |
| `brand-promo-video-generator` | Brand promo from product images + brief |
| `co-op-game-intro-generator` | Co-op game intro |
| `handdrawn-live-video-generator` | Hand-drawn + live-action explainer |
| `minimalist-product-ad-generator` | Apple-style minimalist product ad with beat-synced typography |
| `music-video-subtitle-generator` | Music video with subtitles |
| `paper-collage-explainer-generator` | Paper-collage explainer |
| `papercraft-stop-motion-explainer` | Papercraft stop-motion explainer, character/scene continuity |

(Index: <https://github.com/MiniMax-AI/MiniMax-H3/tree/main/skills>; write-up
<https://comfyui-wiki.com/zh/news/2026-08-10-minimax-h3-official-skills>. Install:
`npx skills add https://github.com/MiniMax-AI/MiniMax-H3 --skill '*'`.)

**The eight style skills are a much richer source of MiniMax's real prompting doctrine than
the two guides**, because they encode failure-avoidance rules the guides omit. §3, §5 and
§6 below mine them. They are also the only official artifacts with Chinese text.

---

## 2. Base-mode prompt expertise — what the official guide actually specifies

The baseline brief has the camera table and field order. These are the load-bearing
specifics it is missing, all `[OFFICIAL]` from
<https://huggingface.co/MiniMaxAI/MiniMax-H3/raw/main/docs/VIDEO_PROMPT_WRITING_GUIDE_base_en.md>.

### 2.1 The alignment instruction is a fixed string per mode, and must be line 1

```text
For the target video, at 0.00 seconds into the target video, <Picture 1> (from [Shot 1]) is fully referenced.
```
(I2VA)

```text
How the reference pictures align with the target video — Picture 1 (from Shot 1) aligns with the 0.00-second mark of the target video; Picture 2 (from Shot N) aligns with the S.SS-second mark of the target video.
```
(FL2VA)

```text
How the reference pictures align with the target video — <Picture 1> (from [Shot N]) aligns with the S.SS-second mark of the target video.
```
(L2VA)

```text
The instruction must be the first line of the final prompt, followed by one blank line
before the core fields.
```

Note the inconsistency in MiniMax's own examples: FL2VA drops the angle brackets
(`Picture 1`), I2VA and L2VA keep them (`<Picture 1>`). Reproduce per-mode as written.
`S.SS` is the effective duration to exactly two decimals.

### 2.2 Cuts: the exact accepted verbs, and when NOT to cut

```text
[Shot 2] At 00:03.500, the camera cuts to...
```

Accepted cut phrasings: `the camera cuts to`, `the shot cuts to`, `the shot transitions
to`, `the shot changes to`, `the shot switches to`. Cross-dissolve / fade / wipe only when
the user explicitly asked. And the rule most prompts violate:

```text
A cut should introduce new information about the subject, space, state, viewpoint, or
time. If only the distance or a slight angle needs to change, prefer camera motion.
```

**There is no `[CUT TO]` marker in H3's dialect** — see §3.1.

### 2.3 Voiceover has an exact required phrase plus a mandatory follow-up clause

```text
For voiceover, use the exact phrase `says in an off-screen voiceover`. Immediately after
every voiceover <d> block, state that the corresponding on-screen character's lips remain
closed
```

```text
The man (S1) says in an off-screen voiceover: <d>[English] I still remember that road.</d> while his lips remain completely closed.
```

This is the officially-blessed fix for "mouth keeps flapping over narration."

### 2.4 On-screen text: English double quotes, original language preserved

```text
Place any banner, sign, label, subtitle, or neon text that is actually visible on screen
in English double quotation marks. Preserve the original text and punctuation verbatim,
without translation.
```

```text
A red neon sign reading "营业中" glows above the doorway.
```

### 2.5 `non_diegetic_music` has an explicit *anti*-instruction

```text
Focus on instrumentation, speed, rhythm, and dynamic changes; do not use abstract mood
words or explain the emotional function of the score.
```

So `non_diegetic_music: tense, ominous, builds dread` is a defect, not a style.
`Sparse piano notes at a slow tempo, joined by sustained low strings that gradually
increase in volume before fading out.` is correct.

### 2.6 Style goes at the head of `[Shot 1]`, from a short vocabulary

```text
Common styles include `Cinematic`, `live-action`, `2D-animated`, `3D CG`, `claymation`,
`watercolor`, and `vintage film`.
```

```text
[Shot 1] Live-action, cinematic, a medium-wide shot frames...
```

For keyframe modes, derive style **from the reference image**, not from text.

---

## 3. Multi-shot: what the community and MiniMax's own skills actually found

### 3.1 `[CUT TO]` does not exist in H3

`[OFFICIAL]` Nothing in `base-en`, `ref-en`, `SKILL.md`, or any official example uses
`[CUT TO]`. The dialect is `[Shot N] At MM:SS.mmm, the camera cuts to …`. If your app
emits `[CUT TO]` it is emitting an LTX/Sora-family idiom into an H3 prompt.

`[LORE]` The layer-1 corpora do use two *other* packing conventions that reach the rewriter
fine: bracketed time slices (`[0s-2s] … [2s-4s] …`, six beats in 15 s in MiniMax's own game-UI
example) and named shots (`Shot 1 — Ultra-wide establishing shot. … → Hard cut.`). Those
are layer-1. Do not mix them into layer 3.

### 3.2 Official beat-density budget — the most actionable number found this pass

`[OFFICIAL]` `minimalist-product-ad-generator/SKILL.cn.md` gives a hard beat budget that
appears nowhere in the prompt guides:

```text
- 5 秒建议 3-4 个节拍。
- 10 秒建议 5-7 个节拍。
- 15 秒建议 6-9 个节拍。
```
(5 s → 3–4 beats; 10 s → 5–7; 15 s → 6–9.)

with the packing rule:

```text
每个节拍只保留一个主要动作，次级动作延迟出现。
```
(One primary action per beat; secondary actions are delayed.)

and an energy curve:

```text
- 5 秒片：1 个小峰值 + 1 个稳定收束。
- 10 秒片：1-2 个峰值 + 1-2 个制动时刻。
- 15 秒片：2-3 个峰值 + 2 个安静制动时刻。
```
(5 s: 1 peak + 1 settle. 10 s: 1–2 peaks + 1–2 brakes. 15 s: 2–3 peaks + 2 quiet brakes.)

This directly answers "how much can I pack into one call." Note these are *beats* (an
action change), not necessarily `[Shot N]` cuts — §2.2's rule says prefer camera motion
over a cut when only distance/angle changes, so a 10-second clip with 6 beats might be
2–3 shots.

### 3.3 MiniMax's own narrative workflow does NOT pack multi-shot into one H3 call

`[OFFICIAL]` This is the most consequential thing in the Skills pack. The
`3d-animation-short-generator` skill — MiniMax's own end-to-end narrative pipeline —
renders **one clip per shot** and assembles in post:

```text
STEP 7: Video-Model Choice Card + Single-Shot Video Clips
...
For each approved table row, call the chosen video model to generate the corresponding
independent video clip.
```

```text
Single-Shot Video Clip nodes (rendered by the video model selected in Step 7 — H3 default,
Seedance 2.0 fallback)
```

Continuity is carried by **character cards + scene cards + a six-column shot table**, not by
in-prompt multi-shot. Interpretation `[SPECULATION, high confidence]`: multi-shot in one
call is fine for a self-contained 2–3-shot beat, and MiniMax uses it that way in the
launch T2VA example; it is **not** how they build a 30–180 s narrative. Teach in-prompt
multi-shot as a shot-*pair* device, not a storytelling device.

### 3.4 MiniMax's skills name a competitor as the multi-shot fallback

`[OFFICIAL]` Same skill, `references/model-selection.md`:

```text
**H3 (recommended default)** — strong on visual packaging, motion graphics, text/UI
clarity, multi-modal context understanding, and cost efficiency ... Best for: stylized 3D
animated shorts with strong design language, text overlays, motion-graphic moments,
packaging-style transitions, and dialogue-driven beats where the audio is part of the
deliverable.
**Seedance 2.0 (fallback for high-stakes animation performance)** — strong on cinematic
camera, complex shots, elastic Pixar-style performance, and tension-driven action. Best
for: chase sequences, slapstick beats, climax shots where the selling point is the
animation itself rather than the packaging.
```

And in the Chinese product-ad skill, even more bluntly:

```text
Seedance 只在用户明确想要更强多分镜执行、用户点名 Seedance，或 H3 失败 / 无法满足结构且
用户接受兜底时使用。
```
(Seedance is used only when the user explicitly wants **stronger multi-shot execution**,
names Seedance, or H3 fails / cannot satisfy the structure and the user accepts the
fallback.)

MiniMax's own guidance therefore concedes that H3's multi-shot execution and elastic
character performance are **not** its strength. This is unusually candid first-party
evidence and belongs in any honest comparison section.

Also `[OFFICIAL]`, same file, on how much of the plan H3 will swallow:

```text
H3 is strong at instruction following, so the per-second directive can be sent almost
verbatim.
```

### 3.5 Tested multi-shot data points

- `[TESTED]` RTX PRO 6000 Blackwell 96 GB, ~1 MP, **15 s multi-shot in 23 minutes** (BF16
  transformer + BF16 text encoder); creator got "most of the requested sequence in a
  single generation without frame repair," replacing text cards before upscale.
  (<https://www.virse.ai/blog/minimax-h3-reddit-review>, 2026-08-07, aggregating Reddit.)
- `[TESTED]` 15-second train scene with a walk-and-board action chain, dialogue and lip
  sync "worked well" — but a *reference object* (the train) drifted, fixed by naming it
  explicitly. (aistudynow, 2026-08-07.)
- `[TESTED]` H3-as-audio-generator: at 32×32 px output, ~45 s of dialogue stayed coherent;
  **60-second dialogue started losing coherence**. (virse/Reddit aggregation.) Useful
  upper bound on how long a *spoken* timeline can be before it degrades, independent of
  the 15-s video cap.

---

## 4. Dialogue, lip-sync and audio

### 4.1 Officially specified, frequently missed

`[OFFICIAL]` (base guide §4.4):
- Speaker IDs `(S1)`, `(S2)`; compound `(S1,S2)` for simultaneous speech; **an ID persists
  across shots**; non-vocalising characters get **no** ID.
- On first appearance, establish "character type, age, gender, whether the person is
  on-screen, pitch, timbre, speaking rate, or accent."
- Identity phrase, ID, action, delivery go **outside** `<d>`. Inside `<d>`: language tag +
  exact words only. "Preserve every original word and punctuation mark verbatim; do not
  translate or rewrite them."
- `<scenetrans>` at **both** connection points when a line crosses a cut, plus an explicit
  statement that audio continues; `<cutoff>` for speech truncated by the video ending.
  Continuity phrasings: `continues seamlessly across the cut`, `continues uninterrupted
  into the next shot`, `carries over from the previous shot`, `remains audible across the
  transition`.

`[OFFICIAL]` (ref guide §5.4) — extra rules the base guide doesn't state:
- `(Sx)` is assigned by **order of actual vocal events in the target video**, never
  renumbered in the audio definition, and **never written in `retention_analysis`**.
- Unintelligible source speech → write `[unclear]`, do not guess.
- Punctuation is normalised to `,` `.` `?` `!`; strip tildes, emoji, bullets, decorative
  repeats; end every complete utterance with `.`/`?`/`!` **before** `</d>`.
- A vocal cue that exists only inside a reused BGM gets `<Audio N>` as its source, **not**
  a new `(Sx)`.
- "When only timbre, rhythm, emotion, or delivery is referenced, do not carry the original
  dialogue from the reference audio into the target video."

### 4.2 Community lip-sync technique

- `[LORE, converged across many guides]` **One to two sentences of dialogue per five
  seconds of clip.** Overlong lines produce rushed delivery, audio running past the last
  frame, or strained lip-sync. This is the most consistently repeated number on the open
  web; nobody published a controlled test behind it, so treat as a working budget, not a
  measurement.
- `[TESTED]` The single most useful lip-sync fix found this pass, from a real run
  (aistudynow, 2026-08-07): when the model keeps moving the mouth after a line ends, add
  an explicit mouth-stop plus a listening action.

  > "Her lips stop moving immediately after the last word. She listens in silence and keeps
  > the book pressed firmly against her body."

  This is the same mechanism as the official voiceover rule (§2.3) generalised to on-screen
  dialogue. MiniMax's own Ref2VA example does it too: *"Exactly as his voice stops, his
  lips meet in a relaxed, peaceful smile, and his jaw ceases speaking motion."*
- `[TESTED]` "Describe the reaction instead of adding more dialogue" — after S2's line, the
  protagonist's beat was carried by looking down / touching the cover / closing the book
  rather than a second line. Reported as improving both pacing and lip-sync load.
- `[LORE]` "realistic lip articulation, no exaggerated mouth opening" as an anti-rubber-mouth
  phrase. Repeated in several guides; no test behind it.
- `[TESTED]` Reddit-reported weak points: eye flicker, face softness, and **deformation
  specifically during image-plus-audio lip-sync**. (virse aggregation.)

### 4.3 Audio prompting — what measurably moves the needle

- `[TESTED]` **Reference audio is a steer on the mix, not a music slot.** Atlas Cloud
  measured envelope correlation between the uploaded 8.05 s slice and the returned track at
  **0.25**, versus **−0.05** for a no-reference control; the returned bed ran **~7 dB
  hotter** than the no-audio control across the first five seconds before dialogue started.
  Verbatim:

  > "Reference audio does **not** come back verbatim. ... Read reference audio as a steer
  > on the mix, not a music slot. If you need your exact track under the picture, lay it in
  > afterwards."

  This directly contradicts the widespread `[LORE]` that `fully_copy` gives you your track
  back. `fully_copy` is a *marker in the prompt*, not a signal-path guarantee — at least
  through the hosted endpoint.
- `[OFFICIAL]` Leaving `non_diegetic_music` **blank** is a defect; `N/A` is the correct
  "no music" value. Leaving `overall_soundscape` as `N/A` is only correct for explicitly
  requested total silence. Multiple community guides trace "the model invented a
  soundtrack" to exactly this.
- `[OFFICIAL]` Chinese product-ad skill on when to give up on native audio:

  ```text
  视频生成阶段默认先使用 MiniMax-H3 原生音频 ... 如果 H3 直出的音乐不好听、太吵、太弱、
  不同步，或用户要求重新配乐，再使用 music-2.6 生成一条较长的独立器乐配乐并替换视频音轨。
  ```
  (Default to H3 native audio; if H3's music is bad / too loud / too weak / out of sync,
  generate a separate longer instrumental with `music-2.6` and replace the track.)

  MiniMax's own workflow treats native music as a first draft that is frequently replaced.
- `[LORE]` Spatial/stereo audio phrasing ("footsteps pan rear-left to front-right",
  "dialogue centered, environmental sounds stereo-wide") is promoted by the community
  `awesome-minimax-h3` guide. The AudioVAE genuinely is stereo (same encoder per channel,
  processed independently, recombined — `[OFFICIAL]`), so the mechanism exists; nobody has
  published a stereo-field A/B.
- `[TESTED]` **Do not use EasyCache with audio on ComfyUI < v0.31.0.** PR #15390 (2026-08-07)
  is literally titled "Fixed MiniMax H3 audio corruption with EasyCache." A 2026-08 Reddit
  tester independently "suspected EasyCache could affect audio quality more noticeably for
  music than dialogue." If your users are on an older build, this is a real, dated bug.

---

## 5. Ref2VA / full-reference practice

### 5.1 Retention markers — do they behave as documented?

`[OFFICIAL]` The full marker sets and their scope discipline are in the ref guide; the
baseline has them. The rule the baseline is missing:

```text
Choose each relationship marker only within the reference role already defined for that
label in `subject_definitions`. Do not treat newly added actions, backgrounds, or plot
events in the target video as losses of reference fidelity.
```

`[TESTED]` **Only two markers have any behavioural evidence, and one is contradicted:**

| Marker | Evidence |
|---|---|
| `fully_preserved` (image identity) | **Holds well.** Atlas Cloud ran a two-shot scene across a full night→morning lighting inversion: "Same face, same scar over the right eyebrow, same jacket and towel, across a scene and framing change with nothing shared but the references." Identity drift was **not** observed. `[TESTED]` |
| `attribute_transfer` (video → motion only) | **Works, but leaks grade.** See §5.3. `[TESTED]` |
| `fully_copy` (audio) | **Contradicted.** See §4.3 — envelope correlation 0.25. `[TESTED]` |
| `partially_preserved`, `weak_reference`, `partially_copy`, `reference` (audio) | **Nothing found.** No published test isolates these. `[NOTHING FOUND]` |

Honest position for the app: teach the markers as *the required vocabulary of the format*
(they are), not as four calibrated strengths (unproven).

### 5.2 `ref_image_size`: `match` vs `max`

`[OFFICIAL]` ComfyUI docs, verbatim:

```text
ref_image_size: `match` scales references down to the generation resolution for speed;
`max` keeps up to a 2048px short edge for stronger identity fidelity at the cost of speed.
```

`[TESTED]` Community confirmation that `max` does improve quality "at a substantial
generation-time cost," and that Ref2V being *softer / more artifact-heavy than I2V* is a
real recurring complaint (virse aggregation of Reddit). Practical ladder from a real
workflow (aistudynow): start `match`; move to `max` only when reference fidelity is the
binding constraint and VRAM allows; `match` is also the first thing to try on OOM.

`[SPECULATION]` The reason `max` helps is probably not magic: at `match`, a 4 K character
sheet is downsampled to ~1344×768 before conditioning, so fine facial detail is destroyed
before the model ever sees it. That also predicts `max` buys you nothing if your reference
image was low-res or soft to begin with — which matches the tested advice "if the input
face is already blurry, the generated result may also lack facial detail."

### 5.3 Multi-reference conflicts — the one documented conflict

`[TESTED]` Atlas Cloud, verbatim — **a video reference's grade beats your text prompt's
lighting**:

> "I asked for 'bright empty covered market, cold clean daylight' *and* 'carry the grade
> and grain of the reference clip', and the reference clip won. ... You cannot ask one call
> for the same look and the opposite light. If you need the light to change, drop the grade
> instruction, or drop the video reference and hold identity with the image alone."

`[TESTED]` And an image reference drags its own lighting in:

> "A reference image pins identity: face structure, hair, distinguishing marks, garment. It
> does not pin lighting, and this is the single most common surprise. It also drags the
> reference photo's light along with it, which is why a character sheet shot in a moody
> environment produces a character who cannot survive a scene change. **Shoot your
> reference flat and neutral.**"

`[OFFICIAL]` MiniMax's own Chinese skill states the priority rule as a hard requirement:

```text
当多份素材都包含人物或场景时，必须明确：哪一份决定身份、哪一份只提供姿势、光线或风格、
冲突部分以哪一份为准。不要让"图1参考人物"和"视频1保持原人物"同时存在而不说明优先级。
```
(When several assets contain people or scenes you MUST state which one decides identity,
which only supplies pose/light/style, and **which wins where they conflict**. Never let
"Picture 1 references the person" and "Video 1 keeps the original person" coexist without
a stated priority.)
— <https://www.ai-indeed.com/encyclopedia/29229.html> quoting the official framing.

`[NOTHING FOUND]` No published test establishes an image-vs-image priority order, nor any
quality-dilution threshold from too many references. Atlas Cloud pushed **10 images**
through and the job completed normally at identical cost. So "too many references" is
currently a *cost-of-attention* concern `[SPECULATION]`, not a documented failure.

### 5.4 The grid-reference trap — official, and nowhere else on the web

`[OFFICIAL]` `minimalist-product-ad-generator/SKILL.cn.md` abandoned four-up reference
sheets on purpose:

```text
本 Skill 不再默认使用四宫格锚定图，因为视频模型可能把宫格版式带进最终画面；默认使用三张
独立锚定照片
```
(No longer uses a 4-up anchor grid by default, **because the video model may carry the grid
layout into the final frame**; defaults to three independent anchor photos.)

```text
每张锚定照片都必须是一张可独立成立的完整产品照片。禁止生成网格、分屏、拼贴板、画框、
多面板、产品墙或分镜板。
```

This is a first-party, previously undocumented Ref2VA failure mode: **character-sheet /
contact-sheet reference images can leak their panel layout into the output.** Fix: feed
N separate single-subject images instead of one composite sheet. (Note this is in tension
with the community `[LORE]` "use multi-angle character sheets for action scenes" — the
community advice is about *multi-view coverage*, which you can get from separate files.)

### 5.5 Two more official Ref2VA mechanics worth stealing

`[OFFICIAL]` Same skill:

```text
生视频阶段不要把用户上传的原商品图传给视频模型。原商品图只用于前置产品分析和锚定图生成。
```
(At video time, **do not** pass the user's original product photo to the video model; it is
only for analysis and for generating the anchor images.) — i.e. references should be
*purpose-built* renders in the target style, not raw source photos.

`[OFFICIAL]` Native reference ordering, from a third-party node pack that reads the native
implementation (<https://github.com/ethanfel/ComfyUI-MiniMax-H3-Guide>):

```text
Native Ref2VA ordering is pictures first; then each enabled video soundtrack <Audio N>
immediately before its <Video N>; then standalone audio. Audio and video labels are
independently numbered, so equal numbers do not imply a pairing.
```

```text
Native Image to Video stretches a first frame to the target canvas and center-cover-crops
a last frame. Match endpoint aspect ratio to output width/height when exact composition is
important.
```

That second one is a genuine FL2VA gotcha the official guide never states: **first frame is
stretched, last frame is centre-cropped.** Mismatched aspect ratios silently recompose your
ending.

### 5.6 Reference-role assignment — the one universally agreed technique

`[OFFICIAL]` ComfyUI docs: "State which reference drives which part of the shot (identity,
style, motion, camera, voice). **Explicit assignments tend to work much better.**"

`[TESTED]` Confirmed in a real Ref2VA ladder (aistudynow): `<Picture 1>` = woman,
`<Picture 2>` = environment, `<Picture 3>` = handbag → "the handbag stayed close to the
reference, including its visible design and sides." Author's rule: *"Tell MiniMax H3 why
each image exists"* and *"Do not add references only because the maximum is nine."*

`[TESTED]` Counter-nuance from Atlas Cloud that nobody else says: references and text
**compete**.

> "A reference image and a good noun phrase compete for the same job, so spend your
> reference slots on the things language cannot pin down: a specific face, a specific
> product, a specific logo."

Their 1→2 reference delta was small precisely because the prompt *also* described the bowl
in words and H3 drew a passable one from text alone.

---

## 6. Chinese prompting for H3

### 6.1 Is there an official Chinese prompt guide? No.

`[OFFICIAL]` The HF `docs/` tree contains only `_base_en.md` and `_ref_en.md`. The
`h3-prompt-writing` skill has **no** `SKILL.cn.md` (404 on
`skills/h3-prompt-writing/SKILL.cn.md`, 2026-08-15). Only the **eight style skills** ship
`SKILL.cn.md`, and those are agent-workflow documents in Chinese, not prompt-format specs.

So: the launch was bilingual, the *product* is bilingual, but **the prompt format spec is
English-only and there is no Chinese variant with different guidance.** `[NOTHING FOUND]`
on any official Chinese-language rewrite of the field/marker rules.

### 6.2 What language do the fields want?

`[OFFICIAL]` Unambiguous, from `h3-prompt-writing/SKILL.md`:

```text
Write rewrite sections in English; preserve dialogue, lyrics, and visible scene text in
their original language.
```

and `ref-en.txt`:

```text
Write all six rewrite sections in English. Preserve the original language only for dialogue
and lyrics inside <d> and for text visibly present in the scene.
```

So the baseline's position — **English structure, Chinese only inside `<d>[Chinese] …</d>`
and inside `"…"` for on-screen text** — is confirmed as the official expert dialect. This
pass found **no evidence** that Chinese prose in `integrated_multimodal_description`
outperforms English, and no evidence that it fails either. `[NOTHING FOUND]`

### 6.3 Where Chinese *does* win

`[OFFICIAL]` Dialogue: 11 stably supported languages including Chinese
(Arabic, Chinese, English, French, German, Italian, Japanese, Korean, Portuguese, Russian,
Spanish). Preserve exact Chinese words; never translate.

`[OFFICIAL]` The `3d-animation-short-generator` skill goes out of its way to avoid an
English default:

```text
Dialogue language only if the user explicitly states it; do not default to English
dialogue.
```

`[OFFICIAL]` Counterpoint — MiniMax's *own Chinese* product-ad skill **mandates English for
on-screen copy**:

```text
画面内广告文案强制使用英文。如果用户输入中文文案，要翻译成简洁英文，或让用户确认英文化版本。
```
(On-screen ad copy is required to be English. Chinese copy must be translated to concise
English or confirmed with the user.)

`[LORE]` And the layer-1 corpora repeatedly ship the negative *"Do not introduce Chinese
text, garbled characters, or misspellings"* in English title sequences — i.e. **stray
Chinese glyph injection into English on-screen text is a known H3 artefact**, consistent
with a Chinese-heavy training mix. This is the clearest language-related finding of the
pass, and it points the opposite way from "write in Chinese": for **rendered text**, H3
leans Chinese and needs to be pushed off it.

### 6.4 Prompt length, Chinese-corpus derived

`[LORE]` Across MiniMax's 45 official layer-1 examples the **median is ~130 Chinese
characters**, with the two longest at 657 and 858. Reported independently by Atlas Cloud
and by ai-indeed.com. The stated reason short ones are short: *"The short ones are short
because a reference board is carrying the description."* Corollary worth teaching:
**prompt length should track how much of the job you refused to hand to a reference**, not
be maximised.

`[OFFICIAL]` Layer-1 hard cap: **7,000 characters**.

### 6.5 A Chinese-specific formatting hazard

`[OFFICIAL]` From the Chinese product-ad skill, about the shot table you feed the model:

```text
文案拆分只能用自然语言描述"前半 / 后半"，禁止写箭头、斜杠、加号或连接符，避免模型把符号
当成画面文案。
```
(Describe text splits in natural language only — **no arrows, slashes, plus signs or
connectors — because the model may render the symbol as on-screen text.**)

Generalises well beyond Chinese: **punctuation you use as prompt syntax can end up rendered
in the frame.** Same skill, at delivery QA: "文案可读、单行、不拥挤，没有多余箭头或符号"
(copy is readable, single-line, uncluttered, no stray arrows or symbols). Same rule appears
in the 3D-short skill's final check: "Final video must contain no storyboard traces, labels,
arrows, timing marks, panel borders."

---

## 7. Failure catalog with prompt-side fixes

Fix column marked `[prompt]` = fixable in the prompt; `[graph]` = a setting/graph change;
`[none]` = not fixable by prompt as of 2026-08-15.

| Failure | Evidence | Fix |
|---|---|---|
| Motion too static ("one push-in stretched over 10 s") | `[LORE]`, universal | `[prompt]` Timeline the beats to §3.2 density; give each beat one primary action; state the *sound* of each action too |
| Slideshow pacing in multi-shot | `[LORE]` + official skill counter-phrasing "never a slideshow" | `[prompt]` Causal chain between beats; write transitions as physical events, not named effects |
| Camera drifts when you wanted lock-off | `[OFFICIAL]` | `[prompt]` `The camera holds a static shot`; remove every camera adjective elsewhere |
| Unwanted slow-motion look, smeary frames | `[TESTED]` Reddit | `[none]` reported as a model/sampler characteristic; no prompt fix published |
| Mouth keeps moving after the line ends | `[OFFICIAL]` + `[TESTED]` | `[prompt]` "his lips remain completely closed" (voiceover, mandatory) / "her lips stop moving immediately after the last word. She listens in silence." |
| Rushed delivery / audio runs past last frame | `[LORE]` | `[prompt]` 1–2 sentences per 5 s; split across shots; use `<cutoff>` if truncation is intended |
| Unwanted background music appears | `[TESTED]` Reddit + `[OFFICIAL]` | `[prompt]` `non_diegetic_music: N/A` — **blank is not the same as N/A** |
| Audio corruption / artefacts with EasyCache | `[OFFICIAL]` ComfyUI PR #15390 | `[graph]` Update to ≥ v0.31.0, or disable EasyCache |
| Garbled on-screen text | `[TESTED]` frame crops in Atlas Cloud's read of the official game-UI clip: strings typed in the prompt render clean (`RIGHT ARM EQUIPMENT`, `PHANTOM GRIP`), strings only gestured at ("HUD elements") render as `ETR METNO CITFEP` | `[prompt]` **Type every word that must be readable**, in quotes; add "do not misspell, do not add other text, do not add subtitles" |
| Stray Chinese glyphs in English titles | `[LORE]` recurring official negative | `[prompt]` "Do not introduce Chinese text, garbled characters, or misspellings" |
| Prompt punctuation rendered into the frame | `[OFFICIAL]` CN skill | `[prompt]` No arrows/slashes/plus-signs in the description; describe splits in words |
| Too much text on screen at once / double-line titles | `[OFFICIAL]` CN skill | `[prompt]` One single-line string at a time; for a 10 s piece, **1 mid text + 1 end text**, other beats "no text" |
| Identity drift across a scene change | `[TESTED]` — **not observed** in a controlled two-shot night→morning test | `[prompt]` If it happens: enumerate the attributes (hair, garment, marks) rather than saying "keep her consistent" |
| A specific object mutates (the train, the bowl) | `[TESTED]` | `[prompt]` Name the exact object that must not change. "If one element changes incorrectly, tell the model exactly which element must remain unchanged. Do not keep adding vague quality words." |
| Faces mangled in wide/distant shots; distant people unrecognisable | `[TESTED]` recurring Reddit complaint | `[prompt-workaround]` MiniMax's own wuxia example: "Show the face only in close-up or extreme close-up. In wide shots, use back view, rear three-quarter view, or empty environment shots; never show a distant frontal face." `[none]` as a true fix |
| Ref2V softer / more artefacty than I2V | `[TESTED]` | `[graph]` `ref_image_size: max`; better/sharper source refs; align aspect ratios |
| Soft, plastic faces even before diffusion | `[TESTED]` controlled VAE encode/decode test showed facial & skin detail loss with no diffusion involved | `[none]` — it's the VisualVAE. Mitigate with resolution (~1344×768) and post-upscale |
| Grid/contact-sheet layout leaks into output | `[OFFICIAL]` | `[prompt/asset]` Use N separate single-subject reference images |
| Video reference overrides your lighting direction | `[TESTED]` | `[prompt]` Drop either the grade instruction or the video reference; you cannot have both |
| Reference photo's lighting contaminates the new scene | `[TESTED]` | `[asset]` Shoot references flat and neutral |
| Model invents a person when a reference is missing | `[TESTED]` "a confident wrong face looks exactly like a successful run" | `[graph]` Verify refs actually attached; H3 substitutes silently rather than refusing |
| First frame stretched / last frame centre-cropped | `[OFFICIAL]` node behaviour | `[graph]` Match endpoint image aspect ratio to output W/H |
| Hosted only: first-frame `image` + `refers` in one call → one input silently dropped, still billed | `[TESTED]` reproduced both directions 2026-08-12 | `[graph]` Pick one path per call. **Not a local-weights issue** |

### 7.1 Silent substitution is the meta-failure

`[TESTED]` The most transferable framing from this pass, and it applies to local runs too:
H3 **substitutes rather than refuses**. A "successful" generation can quietly have dropped
a reference, invented a face, or ignored a beat. Practical teaching consequence: the app
should ship a **QA checklist** rather than assume a completed render is a correct render.
Atlas Cloud's four-check pass generalises well:

1. Is every string that had to be readable still legible and correctly spelled?
2. Did the declared style survive, or did something "improve" it?
3. Does the audio contain only the sounds you listed? (probe the container: expect
   h264 + AAC stereo 32 kHz)
4. Did the last frame land where you pinned it?

---

## 8. Comparative context

### 8.1 Benchmarks

`[OFFICIAL-3P]` Artificial Analysis blind human-preference Elo, early August 2026:

- **Video editing: #1**, Elo ~1,125–1,130 over ~10,280 votes, statistically tied with
  Gemini Omni Flash (~1,122). Ahead of Alibaba HappyHorse-1.0.
- **Text-to-video with audio: #2**, Elo 1,238 vs Gemini Omni Flash 1,241.
- **Text-to-video without audio: #2**, Elo 1,305 vs Gemini Omni Flash 1,324.
- **Image-to-video: top 3.**

(<https://artificialanalysis.ai/video/leaderboard/text-to-video>,
<https://x.com/ArtificialAnlys/status/2083042088338538594>,
<https://mlq.ai/news/minimax-h3-tops-a-video-editing-arena-but-its-open-weights-exclude-us-users/>)

Caveat `[SPECULATION]`: these are *preference* Elos, not prompt-adherence measurements.
No public benchmark isolates instruction-following for H3.

### 8.2 vs LTX-2.5

`[OFFICIAL]` LTX-2.5 shipped open weights **2026-08-11** with day-0 ComfyUI support
(v0.32.0: native support with STG, dual CFG, duration prediction; new `LTXV Spatio-Temporal
Guidance`, `LTXV Modality Guidance`, `LTXV Dual CFG Guider`, `LTXV Duration Predictor`
nodes). LTX's own positioning claims **native multi-shot** — a full sequence rendered as
one output holding character/scene/voice across cuts — plus "stronger prompt adherence," a
custom Gemma 4 language backbone, and a dedicated prompt enhancer.
(<https://ltx.io/model/ltx-2-5>, <https://blog.comfy.org/p/ltx-25-day-0-support-in-comfyui>,
<https://venturebeat.com/technology/ltx-2-5-can-generate-a-10-second-ai-video-from-an-image-in-just-6-8-seconds-on-nvidia-superchips-and-its-open-weights>)

`[NOTHING FOUND]` **No credible H3-vs-LTX-2.5 side-by-side exists as of 2026-08-15.** The
model is four days old. Everything comparative on the web is H3 vs **LTX 2.3**.

`[TESTED]` H3 vs LTX 2.3, same prompt: H3 took **~3× longer**, creator preferred H3's
result. Another creator found H3 preserved a cat's face/fur/eye colour through occlusion
under a blanket where LTX 2.3 produced "melting or frozen behavior." A repeated caveat:
*"H3 benefits from its own detailed, storyboard-like prompting style rather than identical
prompts across models"* — i.e. same-prompt comparisons systematically understate H3.
(virse aggregation; <https://www.jxp.com/minimax/blog/minimax-h3-vs-ltx-2-3>.)

`[SPECULATION]` Given §3.3–3.4 — MiniMax's own pipeline renders one shot per call and names
Seedance as the multi-shot fallback — LTX-2.5's native multi-shot is likely a real
differentiator on *sequence* work, while H3 keeps the edge on native audio, reference
richness (12 files, mixed modality), and text/UI rendering. Flag as untested.

### 8.3 vs Wan 2.2

`[TESTED]` No head-to-head prompt-adherence benchmark. The one concrete data point is
ergonomic, not qualitative: a 12 GB VRAM + 16 GB RAM user produced a 640×480 R2V in 13
minutes and specifically valued that **the workstation stayed usable during H3 generation,
unlike their Wan workflow**. Community sentiment: Wan "drifts a bit from the source."
`[LORE]`

`[NOTHING FOUND]` No Wan 2.2 vs H3 prompt-adherence benchmark of any kind.

---

## 9. Few-shot gold

### Pair 5 — voiceover with lip lock [OFFICIAL-PATTERN]
INTENT: Narrated memory over a driving shot; character must not appear to speak.
PROMPT-EN:
```text
integrated_multimodal_description: [Shot 1] Live-action, cinematic, a medium shot frames a man in his fifties in the driver's seat of a stationary car at dusk, both hands resting on the wheel. The camera pushes in with small amplitude at slow speed as he looks through the windshield toward an unlit road. The man, with a low, weathered voice (S1), says in an off-screen voiceover: <d>[English] I still remember that road.</d> while his lips remain completely closed. He exhales once and lowers his gaze to the dashboard.
overall_soundscape: Faint engine idle and a slow ventilation hum continue under distant wind. Fabric shifts as he moves, and one long exhale is audible.
non_diegetic_music: N/A
```
NOTES: Uses the two mandatory official strings — `says in an off-screen voiceover` and an
immediate lips-closed clause. This is the single highest-yield correction for narration
prompts. Non-vocalising subjects would get no `(S)` ID.

### Pair 6 — dialogue crossing a cut [OFFICIAL-PATTERN]
INTENT: One line spans a cut, with the mouth stopping cleanly.
PROMPT-EN:
```text
integrated_multimodal_description: [Shot 1] Live-action, cinematic, a medium two-shot frames a young woman in a grey coat and an older woman across a kitchen table. The camera holds a static shot. The young woman with a clear, level voice (S1) begins: <d>[English] I found the letters in the attic,<scenetrans></d> and her jaw is still moving as the shot ends. [Shot 2] At 00:04.000, the shot cuts to a close-up of the older woman's hands stilling on a teacup while <scenetrans> the same line continues uninterrupted into the next shot: <d>[English] and I read every one.</d> Exactly as the voice stops, the speaking motion ends and the older woman's fingers tighten on the handle.
overall_soundscape: Quiet kitchen room tone with a low refrigerator hum. A spoon touches ceramic once and a chair creaks softly.
non_diegetic_music: A single sustained low string tone enters at the cut and holds without swelling.
```
NOTES: `<scenetrans>` appears at **both** connection points plus an explicit continuity
phrase (`continues uninterrupted into the next shot`) — the official requirement most
hand-written prompts get half-right. Also demonstrates the mouth-stop clause on an
on-screen speaker.

### Pair 7 — beat-budgeted 10-second product ad [OFFICIAL-PATTERN, derived]
INTENT: Product film with legible typography, from a locked reference.
PROMPT-EN:
```text
integrated_multimodal_description: [Shot 1] Live-action, cinematic, a clean white studio space with generous negative space. A matte purple wireless earbud case rests centred on a seamless white surface, its true purple body and satin texture unchanged. The camera pushes in with small amplitude at slow speed as the lid rotates open thirty degrees and an internal highlight appears along the hinge. The single line "Color Meets Sound" fades in to the right of the case in a semibold sans-serif, on one line, the first half in dark charcoal and the second half in the case's purple. [Shot 2] At 00:06.000, the shot cuts to a wider frame of the closed case at rest, full-frame and centred, with the same single line of text held steady and legible until the final frame. No other text appears anywhere in the video.
overall_soundscape: A soft magnetic click as the lid rotates open, a faint surface contact when the case settles, and quiet studio room tone throughout.
non_diegetic_music: A pluck-led electronic figure near 100 BPM over a sub-bass pulse and woodblock percussion, cutting off within half a second at the end and leaving only the pluck tail decaying.
```
PROMPT-ZH (layer-1 brief that would produce the above, not a layer-3 prompt):
```text
10 秒 16:9 白色科技风产品广告。主推款：紫色无线耳机充电盒，产品本体颜色必须保留。
画面文案只用一条单行英文 "Color Meets Sound"，前半深灰、后半紫色，中段出现一次，
结尾稳定停留一次，其他节拍无文字。禁止四宫格、分屏、拼贴、画框和结尾产品墙。
配乐 100BPM 左右科技感，pluck + kick + sub-bass，结尾 0.5 秒内全停。
```
NOTES: Encodes four official rules at once — the 10 s → 5–7 beat / one-action-per-beat
budget, the "1 mid text + 1 end text" reduction, the two-tone single-line typography rule
with the product colour, and the abrupt music cut-off. The ZH block deliberately shows the
*brief* layer, not the prompt layer, to model the §0 distinction.

### Pair 8 — Ref2VA with an explicit conflict resolution [OFFICIAL-PATTERN, derived]
INTENT: Character from an image, choreography from a video, and a deliberate lighting
change that must beat the video's grade.
PROMPT-EN:
```text
subject_definitions:
<Subject 1> is the dancer whose appearance comes from <Picture 1>: short black hair, a small scar above the right eyebrow, a faded indigo work jacket with sleeves rolled to the elbow.
<Subject 2> is the empty covered market interior in <Picture 2>, with a steel-framed skylight, lowered shutters, and a bare concrete floor.
<Video 1> supplies only the choreography and body mechanics of the routine; its own subject, location, grade and grain are not used.

summary:
[reference generation] <Subject 1> performs the routine from <Video 1> inside <Subject 2> under cold overhead daylight. Identity comes from <Picture 1>, the environment from <Picture 2>, and only the movement from <Video 1>.

retention_analysis:
<Subject 1> (appears in [Shot 1]): fully_preserved - hair, scar, and indigo jacket are unchanged.
<Subject 2> (appears in [Shot 1]): fully_preserved - skylight, shutters, and concrete floor are unchanged.
<Video 1> (applies in [Shot 1]): attribute_transfer - only the choreography and body mechanics transfer to <Subject 1>; the colour grade, grain, lighting and location of <Video 1> are not transferred.

detailed_description:
The target video is in realistic photographic style with cold, clean overhead daylight.
[Shot 1] A static wide shot establishes <Subject 2>, the empty covered market, with hard daylight falling through the steel-framed skylight onto bare concrete. <Subject 1> stands at centre frame in the indigo work jacket and begins the routine from <Video 1>, planting the left foot, dropping the right shoulder, and turning through a full rotation before settling into a low stance. The camera holds a static shot throughout while the daylight stays even and cold across the floor.
overall_soundscape:
Shoe soles squeak and scrape on concrete, fabric snaps on each turn, and a wide empty-hall reverb continues throughout.
non_diegetic_music:
N/A
```
NOTES: The retention line for `<Video 1>` **names what is excluded** ("the colour grade,
grain, lighting and location of `<Video 1>` are not transferred"). This is the direct
prompt-side answer to the one documented multi-reference conflict (§5.3), where a video
reference's grade beat a text lighting instruction. Also demonstrates the ref-guide rule
that a video supplying only motion is `reference generation`, not `video editing`.

---

## 10. Explicit "nothing found"

- **No H3 technical report** as of 2026-08-15. `[STAFF]` says "coming soon." No arXiv entry.
  (`arXiv:2606.13392` is *MiniMax Sparse Attention* for the text-model line, not H3.)
- **No sparse-attention code** released.
- **No Regenerate-2K weights** released.
- **No Apache relicense** — conditional AMA hedge only.
- **No official Chinese prompt-format guide.**
- **No controlled ZH-vs-EN prompt experiment** for H3 in either language's community.
- **No H3 vs LTX-2.5 comparison** of any kind (LTX-2.5 is 4 days old).
- **No H3 vs Wan 2.2 prompt-adherence benchmark.**
- **No published test isolating** `partially_preserved`, `weak_reference`, `partially_copy`,
  or audio `reference` behaviour.
- **No Ref2VA turbo LoRA** (roadmapped, not shipped).
- **No source found for a "Contex-Loop" chaining node** — the baseline brief cites one but
  this pass could not locate it under that name. What *does* exist is the manual pattern
  `[TESTED]`: feed shot N's output back in as shot N+1's video reference. Atlas Cloud is
  blunt that this is all there is: *"the actual mechanism behind multi-shot continuity. Not
  'H3 remembers your character'. You hand the previous shot back to it."* `[STAFF]` The AMA
  says Ref2VA supports continuation and that a 60-second chained workflow capability was
  "retained from pretraining." **Recommend verifying the Contex-Loop entry in the baseline
  brief before shipping it.**

---

## 11. Source index

Official / first-party:
- <https://www.minimax.io/news/minimax-h3-open-source> (2026-08-03)
- <https://huggingface.co/MiniMaxAI/MiniMax-H3> and `docs/QA-about-License.md`,
  `docs/VIDEO_PROMPT_WRITING_GUIDE_base_en.md`, `docs/VIDEO_PROMPT_WRITING_GUIDE_ref_en.md`
- <https://github.com/MiniMax-AI/MiniMax-H3/tree/main/skills> — `h3-prompt-writing/SKILL.md`,
  `3d-animation-short-generator/SKILL.md` + `references/model-selection.md`,
  `minimalist-product-ad-generator/SKILL.cn.md`
- <https://docs.comfy.org/tutorials/video/minimax/minimax-h3>
- <https://docs.comfy.org/changelog> (v0.30.0 → v0.33.1)
- <https://huggingface.co/Comfy-Org/MiniMax-H3>

Staff / AMA:
- <https://x.com/MiniMax_AI/status/2086253065657790895> (official recap)
- <https://x.com/FurkanGozukara/status/2085529290892775819>,
  <https://x.com/IamEmily2050/status/2085996847227646318> (secondary readouts)

Tested:
- <https://aistudynow.com/minimax-h3-comfyui-workflow-almost-3x-faster-ref2va-guide/> (2026-08-07)
- <https://www.atlascloud.ai/blog/tips/minimax-h3-reference-to-video> (2026-08-12)
- <https://www.virse.ai/blog/minimax-h3-reddit-review> (2026-08-07, Reddit aggregation)

Layer-1 corpora (useful, but not the local format — see §0):
- <https://www.atlascloud.ai/blog/tips/minimax-h3-prompt-guide> (45 official prompts)
- <https://fal.ai/learn/devs/minimax-h3-prompting-guide> (44 examples)

Community tooling:
- <https://github.com/ethanfel/ComfyUI-MiniMax-H3-Guide> (reads native implementation;
  source of the reference-ordering and stretch/crop facts)
- <https://github.com/ModelTC/Minimax-H3-Turbo>, <https://huggingface.co/lightx2v/Minimax-h3-Turbo>
- <https://github.com/joeVenner/awesome-minimax-h3>

Chinese-language:
- <https://comfyui-wiki.com/zh/news/2026-08-10-minimax-h3-official-skills>
- <https://www.ai-indeed.com/encyclopedia/29229.html> (2026-08-06)

Comparative:
- <https://artificialanalysis.ai/video/leaderboard/text-to-video>
- <https://ltx.io/model/ltx-2-5>, <https://blog.comfy.org/p/ltx-25-day-0-support-in-comfyui>
