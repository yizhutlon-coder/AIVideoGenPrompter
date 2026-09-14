# MiniMax H3 research brief

Research baseline: 2026-08-15. Scope: base T2VA/I2VA/FL2VA/L2VA and full-reference Ref2VA.

## Official guidance

- [OFFICIAL, 2026-07-31] H3 jointly understands text, images, video, and audio; generates native stereo audio, up to 2K and 15 seconds; references are related by natural language. [Launch post](https://www.minimax.io/blog/minimax-h3)
- [OFFICIAL] The shipped skill requires exact mode selection and exact field order. Base modes use an optional alignment instruction, then `integrated_multimodal_description`, `overall_soundscape`, `non_diegetic_music`. [Official skill](https://github.com/MiniMax-AI/MiniMax-H3/tree/main/skills/h3-prompt-writing)
- [OFFICIAL] Shots use `[Shot N]` and millisecond timestamps. Dialogue uses `<d>[Language] exact words</d>`; `<scenetrans>` marks dialogue continuing over a cut and `<cutoff>` truncated speech.
- [OFFICIAL] Full-reference mode has six ordered sections: `subject_definitions`, `summary`, `retention_analysis`, style sentence, `detailed_description`, then soundscape/music. Generation descriptions normally target 350–500 English words.

## Rewriter system prompts (verbatim)

Canonical documents: [`base-en.txt`](https://github.com/MiniMax-AI/MiniMax-H3/blob/main/skills/h3-prompt-writing/references/base-en.txt), [`ref-en.txt`](https://github.com/MiniMax-AI/MiniMax-H3/blob/main/skills/h3-prompt-writing/references/ref-en.txt), and the [official skill wrapper](https://github.com/MiniMax-AI/MiniMax-H3/blob/main/skills/h3-prompt-writing/SKILL.md).

Short verbatim fingerprints:

```text
“A complete camera-motion expression has three dimensions”
“Preserve the exact field names, section order, labels, and timing notation”
```

Full third-party guide text is not duplicated. The exact files above are stable canonical retrieval points.

## Chinese prompting

- [OFFICIAL] MiniMax publishes a Chinese launch page and its core relationship example natively in Chinese. Base dialogue explicitly carries a language tag and must preserve original words, so Chinese dialogue should remain Chinese.
- [OFFICIAL] The current public skill references are English and define fixed English field names/markers. For local structured prompting, the safest expert dialect is English structure with exact Chinese dialogue inside `<d>[Chinese]…</d>`.
- Native Chinese intent examples: `参考视频1的小幅缓慢推镜，仅迁移运镜，不迁移人物与场景`; `图2中的人物保持外貌与服装，演唱音频3中的歌词，音色仅作参考`; `固定机位，前景人物不动，只有远处霓虹灯闪烁` [SYNTHESIS].

## Motion / composition control

Official camera vocabulary: Zoom In/Out; Push In/Pull Out; Pan Left/Right; Truck Left/Right; Tilt Up/Down; Pedestal Up/Down; Arc Shot; Tracking Shot; Static Shot; Shake Slightly/Strongly; POV; Roll Clockwise/Counterclockwise. Add `with small/large amplitude` and `at slow/fast speed` only when meaningful.

Failure fixes:

- Static: timeline the visible action and its sound; do not merely name an action category.
- Camera drift: `The camera holds a static shot`; do not add camera adjectives elsewhere.
- Wrong subject: create/reuse one `<Subject N>`, state exactly where it appears, and mark other subjects stationary.
- Reference leakage: define each source's role narrowly; e.g. `<Video 1>` is camera rhythm only, not identity/style.
- Morphing: use `fully_preserved` for identity/wardrobe and describe stable anchors every shot.
- Speed mismatch: name type + amplitude + speed naturally within the shot.
- Exact pose/path: use a reference video or picture with a narrowly declared role (`attribute_transfer` for motion/camera, `fully_preserved` for identity) and describe only the visible constraints the shot must retain. Text-only body geometry remains best effort; split complex choreography into separately timed shots.

## Verbosity calibration

- Base modes: no official total word cap found. Use enough detail for a complete audiovisual timeline; concise single shots often fit 120–300 words [SYNTHESIS].
- Full-reference generation: 350–500 English words [OFFICIAL]. A single shot is not automatically shorter; detail should follow information load.
- `overall_soundscape`: 1–4 sentences. `non_diegetic_music`: 1–3 sentences. Use `N/A` for music when absent; use soundscape `N/A` only for explicitly total silence [OFFICIAL].
- Load-bearing: mode, alignment timing, shot/timestamp, appearance/position, causal action, camera type/amplitude/speed, speaker IDs, exact dialogue, diegetic vs non-diegetic split, reference retention. Noise: plot summaries, abstract mood, repeated reference statements.

## Negatives & guidance

- The official skill is positive structural control, not a negative-tag dialect. No primary-source evidence found for a universal H3 negative list.
- Use constraints inside `retention_analysis` and shot descriptions: what is fully preserved, partially preserved, attribute-transferred, or weakly referenced. Audio markers are `fully_copy`, `partially_copy`, `reference`, `weak_reference` [OFFICIAL].
- [STAFF, 2026-08] Team AMA recommends the official guides and says the API's native Context-IR is the most faithful route. [AMA](https://www.reddit.com/r/StableDiffusion/comments/1vh9rtw/ama_minimax_h3_team_ask_us_anything_about_our/)

## Few-shot gold

### Pair 1 — person shot [SYNTHESIS]
INTENT: A baker opens before sunrise and speaks.
PROMPT-EN:
integrated_multimodal_description: [Shot 1] Live-action, medium-wide shot. A middle-aged baker opens the wooden shutters before sunrise, crosses to the counter, and places a warm loaf beneath the pendant light. The camera pushes in with small amplitude at slow speed. The baker (S1), speaking in a calm raspy voice, says: <d>[English] First batch of the morning.</d>
overall_soundscape: Shutters scrape, trays clink, and a knife cuts the crust while the quiet street remains audible outside.
non_diegetic_music: N/A
PROMPT-ZH:
integrated_multimodal_description: [Shot 1] 写实电影风，中远景。黎明前，中年面包师推开木质百叶窗，走到柜台，把一条温热的面包放在吊灯下。镜头小幅缓慢推进。面包师(S1)用平静而略带沙哑的声音说：<d>[Chinese] 今天的第一炉。</d>
overall_soundscape: 百叶窗摩擦声、烤盘轻碰声与切开面包外壳的脆响，窗外街道保持安静。
non_diegetic_music: N/A
NOTES: Exact fields, speaker ID, camera dimensions, and sound separation.

### Pair 2 — landscape [SYNTHESIS]
INTENT: Fog clears from a mountain lake.
PROMPT-EN:
integrated_multimodal_description: [Shot 1] A static ultra-wide shot frames a mountain lake before sunrise. Fog moves slowly from right to left, revealing a dark pine shoreline; the first orange light reaches the summit and its reflection gradually lengthens across still water. No people or boats enter the frame.
overall_soundscape: Light wind passes through pines, small waves touch the stones, and one distant bird calls.
non_diegetic_music: Sparse low strings sustain quietly and fade as the summit brightens.
NOTES: The camera is fixed while environmental change is explicit.

### Pair 3 — action [SYNTHESIS]
INTENT: A courier leaps between rooftops.
PROMPT-EN:
integrated_multimodal_description: [Shot 1] A low tracking shot follows a courier in a yellow jacket sprinting toward the roof edge. The camera tracks at fast speed as she plants her left foot, jumps across the narrow alley, pulls both knees upward, and lands in a crouch on the opposite roof; loose gravel skids behind her. The camera stops and holds as she regains balance.
overall_soundscape: Rapid footsteps, fabric snaps in the wind, one heavy landing, and scattering gravel.
non_diegetic_music: Fast muted percussion stops on the landing.
NOTES: Causal action phases and a camera stop prevent runaway motion.

### Pair 4 — dialogue/audio [OFFICIAL-PATTERN]
INTENT: Use a reference camera move, singer, and voice.
PROMPT-EN:
subject_definitions:
<Subject 1> is the singer from <Picture 1>; preserve identity, hairstyle, and clothing.
<Video 1> supplies only the slow Hitchcock dolly-zoom camera movement.
<Audio 1> is the voice-timbre reference for <Subject 1> (S1).
summary:
[reference generation + audio reference] <Subject 1> sings while the camera movement follows <Video 1> and the vocal timbre references <Audio 1>.
retention_analysis:
<Subject 1> (appears in [Shot 1]): fully_preserved - identity, hair, and clothing remain unchanged.
<Video 1> (applies in [Shot 1]): attribute_transfer - only camera movement is transferred.
<Audio 1>: reference - timbre guides the performance without copying the signal.
The target video uses realistic concert photography with cool stage light.
detailed_description:
[Shot 1] <Subject 1> (S1) stands center stage and begins singing <d>[Chinese] 别让夜色带走你的名字。</d> in the clear vocal timbre referenced from <Audio 1>. The camera performs the slow dolly zoom from <Video 1> with small amplitude while the singer and stage geometry remain stable.
overall_soundscape:
Low audience room tone and soft stage-monitor hum continue beneath the voice.
non_diegetic_music:
N/A
NOTES: Six-section Ref2VA structure and narrow reference roles.

## Expert mistakes

- Omitting the mode, or using Ref2VA labels in base mode.
- Treating reference files as global style/identity sources instead of defining each role.
- Writing `Zoom In` when the camera should physically push in.
- Repeating dialogue in `overall_soundscape`.
- Translating or polishing user dialogue instead of preserving it.
- Using soundscape `N/A` merely because there is no music.
- Packing several pose transitions, dialogue beats and camera changes into one untimed shot instead of budgeting them across shots.

## Validator suggestions

- Detect mode first. Base mode must contain the three core fields in order.
- Ref2VA must contain all six sections in canonical order and at least one definition/retention line per referenced asset.
- Dialogue regex: `<d>\[(?:English|Chinese|[^\]]+)\].+?</d>`; warn on quoted speech outside `<d>`.
- Each `[Shot N>1]` should have a timestamp; enforce monotonically increasing time.
- Camera movement should match `(type)( optional amplitude)( optional speed)` in natural prose; flag detached multi-tag stacks.
- Full-reference generation: warn below 300 or above 550 English words; target 350–500.
- If intent requests an exact pose, motion path, or camera path without a corresponding reference asset, label it best effort and suggest Ref2VA/reference generation rather than expanding prose.
- Warn when a shot contains more than one primary body action plus one camera action per 2–3 seconds of implied duration.

## Sources

- [MiniMax H3 launch](https://www.minimax.io/blog/minimax-h3) and [Chinese launch](https://www.minimaxi.com/blog/minimax-h3) — [OFFICIAL], 2026-07-31, accessed 2026-08-15.
- [MiniMax-H3 official repository/skill](https://github.com/MiniMax-AI/MiniMax-H3/tree/main/skills/h3-prompt-writing) — [OFFICIAL], accessed 2026-08-15.
- [Official base guide](https://github.com/MiniMax-AI/MiniMax-H3/blob/main/skills/h3-prompt-writing/references/base-en.txt) and [reference guide](https://github.com/MiniMax-AI/MiniMax-H3/blob/main/skills/h3-prompt-writing/references/ref-en.txt) — [OFFICIAL], accessed 2026-08-15.
- [Team AMA](https://www.reddit.com/r/StableDiffusion/comments/1vh9rtw/ama_minimax_h3_team_ask_us_anything_about_our/) — [STAFF], 2026-08, accessed 2026-08-15.

---

## 2026-09 sweep (agent 1E)

Scope: licence verbatim, Chinese doc set, ComfyUI `embedding:` / partner nodes / version numbers,
hardware qualifiers, LoRA & embedding ecosystem, reference-tag mechanics, prompt-inertness.
All URLs accessed **2026-09-03** unless stated. Baseline for the delta: `research/minimax-h3.md`
(2026-08-15) + `_addenda/h3-deep-dive.md` (2026-08-15).

**Headline:** the ComfyUI *source* is now the best primary source on H3's local prompt dialect.
`comfy/text_encoders/minimax.py` and `comfy_extras/nodes_minimax_h3.py` document the reference-tag
mechanics, the frame grid, the trained duration range and the fact that **prompt weighting is
explicitly disabled** — all things we previously carried as `[LORE]`.

### New official guidance

**1. Licence, verbatim (the four clauses the 08-28 digest asked for).**
`[OFFICIAL]` <https://huggingface.co/MiniMaxAI/MiniMax-H3/raw/main/LICENSE> — "MiniMax H3
COMMUNITY LICENSE AGREEMENT", release/licence date **August 2, 2026**, licensor **Nanonoble Pte.
Ltd.**, governing law **Hong Kong SAR**. Unchanged from the 08-15 record; now quoted exactly.

*Territorial exclusion* (§I.3 + §I.5):

```text
3. “Applicable Territory” means worldwide, excluding the Excluded Territories.
5. “Excluded Territories” means the European Union, the United Kingdom, the Republic of Korea and the United States of America.
```

*Framed as temporary, and the escape hatch is in the licence itself* (§II, second paragraph) —
note this is the **licence text**, not just the Q&A doc we already cite:

```text
We will continuously evaluate the applicable laws, regulations and compliance requirements for the Excluded Territories. In the meantime, should any person in such Excluded Territories be interested in deploying our models, you are welcome to contact us about obtaining a license, which will be granted based on robust controls and guardrails for purposes of complying with the laws, regulations and compliance requirements of the Excluded Territories.
```

*Revenue gate* (§IV.1) — note the exact contact string, which our corpus does not carry:

```text
1. You shall obtain a separate, prior written authorization from MiniMax by contacting api@minimax.io with the subject line “MiniMax H3 licensing - authorization request”, if your commercial products and services generate more than 20 million US dollars (or equivalent in other currencies) in yearly revenue.
```

*Attribution — two different obligations, and only one is mandatory.* §IV.2 is a **shall**; the
"Powered by MiniMax H3" line in §III.3.a is only **encouraged**. Our corpus blurs these.

```text
2. You shall prominently display “MiniMax H3”on the user interface of commercial product or service that uses MiniMax H3 or MiniMax H3 Works.
```

```text
3. You are encouraged to:
  a. display a notice on any product or service developed using MiniMax H3 indicating that the product or service is “Powered by MiniMax H3”;
  b. add an AI-generation identifier to files produced using generative AI models including MiniMax H3; and
  c. publish at least one technical blog post or a public statement describing your experience using MiniMax H3 Works;
```

Plus the mandatory NOTICE file for non-hosted redistribution (§III.4):

```text
“MiniMax H3 is licensed under the MiniMax H3 Community License Agreement, Copyright © 2026 MiniMax. All Rights Reserved.”
```

*No-distillation.* Two clauses, not one. §V.3 is the training ban; §I.11 is the definition that
makes distillation/synthetic-data derivation a "Model Derivative" (so it inherits every term):

```text
3. You may not use the MiniMax H3 Works or any of their Outputs or results to improve any other artificial intelligence model (other than MiniMax H3 or its Model Derivatives).
```

```text
11. “Model Derivatives” means all of the following: (i) any modification of MiniMax H3 or any Model Derivative thereof; (ii) any work based on MiniMax H3 or any Model Derivative thereof; or (iii) any other machine learning model created by transferring the patterns of the weights, parameters, operational patterns, or Outputs of MiniMax H3 or any Model Derivative thereof to another model, such that the latter model exhibits behavior similar to MiniMax H3 or its Model Derivatives, including by distillation methods, methods using intermediate data representations, or methods based on training using synthetic-data Outputs generated by MiniMax H3 or its Model Derivatives. For the avoidance of doubt, Outputs are not deemed Model Derivatives.
```

*Two clauses our corpus has never recorded and that matter more for a US-authored teaching app
than the download restriction does.* §V.4 extends the territory ban to **outputs**; Exhibit A
item 1 repeats it as an acceptable-use violation:

```text
4. You may not use, reproduce, modify, distribute, or display the MiniMax H3 Works or any of their Outputs or results outside the Applicable Territory. Any such use outside the Applicable Territory is not authorized by this Agreement.
```

```text
1. Use outside the Applicable Territory;
```

§V.5 also imposes a full safeguards/reporting/remediation regime on anyone who exposes H3 to third
parties, and §VI.4 states `MiniMax claims no rights over the Outputs you generate.` Note the
trailing licence note: `the encoder of MiniMax H3 uses Qwen3-VL-32B, which is licensed under
Apache 2.0` — the encoder's licence does **not** relicense the weights or the outputs.

**2. A Comfy claim that contradicts the licence as written.** `[OFFICIAL]`
<https://docs.comfy.org/tutorials/video/minimax/minimax-h3>, verbatim:

```text
H3's open weights let you run the model locally. Commercial use of locally generated outputs requires a MiniMax commercial license, available through Comfy, the only official reseller. Generations on Comfy Cloud already include commercial rights.
```

<https://comfy.org/minimax/license> ("Updated August 2026") sells two tiers — **Professional**
(fixed monthly, ≤10 licensed users, *distilled* open-weight versions only) and **Enterprise**
(annual, no user cap, "every model version, undistilled weights included"), described as
"Available globally", with "Full commercial rights to your outputs, fine-tuning and LoRA training,
and client and downstream work included." See *Contradicts current corpus* §1.

**3. ComfyUI: `embedding:` for H3 — what it actually is.** `[OFFICIAL]` Shipped in **v0.34.0
(2026-08-26)**; latest release is **v0.34.2 (2026-08-27)** and contains no further H3 items
(<https://docs.comfy.org/changelog>). Same release added **TAESD H3** (PR #15695), a lightweight
preview decoder.

- Source PR: [Comfy-Org/ComfyUI#15697](https://github.com/Comfy-Org/ComfyUI/pull/15697),
  "feat(minimax): support prompt embeddings", author **silveroxides** (Contributor, *not*
  MiniMax/Comfy staff), merged by comfyanonymous **2026-08-18** as commit `e5a38e3`. PR body
  verbatim: `Adds support for embedding: syntax in prompt to load Minimax H3 embedding loading.`
- What it does, per the docs page: `Place an embedding file in ComfyUI/models/embeddings/ and
  reference it in the prompt by name, for example embedding:my_embedding. The embedding is loaded
  and mixed into the text conditioning just like with any other ComfyUI model.` Trigger word =
  filename without extension.
- **The load-bearing implementation detail** (`comfy/text_encoders/minimax.py` at `e5a38e3`):
  `MiniMaxH3Tokenizer.add_text()` now delegates to the Qwen3-VL tokenizer with weighting turned
  **off** —

  ```python
  token_batches = self.qwen3vl_32b.tokenize_with_weights(
      s,
      return_word_ids=False,
      disable_weights=True,
  )
  if len(token_batches) != 1:
      raise ValueError("MiniMax H3 text segment exceeds the supported prompt length.")
  ```

  So on H3: `embedding:` **works**, and `(word:1.2)` attention weighting is **architecturally
  inert** — first-party code, not inference. And there is a **hard length error**, not a silent
  truncation: any single text segment that tokenizes past one batch raises
  `MiniMax H3 text segment exceeds the supported prompt length.`
- Tooling caveat: `raw.githubusercontent.com/.../master/comfy/text_encoders/minimax.py` served a
  **pre-#15697** copy of the file on 2026-09-03 (still containing the removed `_text_ids` helper).
  The commit-pinned URL served the merged version. **Pin the commit when quoting ComfyUI source.**

**4. Context-IR / Regenerate-2K are cloud-only — now confirmed three ways.** `[OFFICIAL]`
(a) the changelog lists both v0.33.1 nodes under **"Partner Node Updates"**, i.e. billed API nodes,
not open-weight support (PR #15471); (b) MiniMax's own Chinese self-hosting page states
`不包含 H3-Context-IR 和完整 2K Workflow` and its component table marks H3-Context-IR and
H3-Regenerate-2K as **是否包含在开放发布中: 否**; (c) `comfy_extras/nodes_minimax_h3.py` contains only
four nodes — `EmptyMiniMaxH3LatentAV`, `MiniMaxH3ImageToVideo`, `MiniMaxH3ReferenceToVideo`,
`MiniMaxH3SigmaShift` — with no enhancer among them.

**5. Local geometry and frame grid, from node source.** `[OFFICIAL]`
<https://raw.githubusercontent.com/Comfy-Org/ComfyUI/master/comfy_extras/nodes_minimax_h3.py>
(fetched 2026-09-03). Constants: `CANVAS_MULTIPLE = 32`, `BASE_SHORT_EDGE = 768`,
`MAX_PIXELS = 768 * 1344` (1,032,192 px), `REF_IMAGE_SHORT_EDGE = 2048`, `FPS = 24`,
`AUDIO_LATENT_FPS = 40`. Defaults `width=1344, height=768, length=124`.

```python
def align_frame_count(n):
    while n % 17 != 5:
        n += 1
```

Length tooltip, verbatim — **this upgrades the 15.08 s ceiling from `[LORE]` to `[OFFICIAL]`**:

```text
Frame count at 24 fps, snapped up to the model's 17k+5 grid (124 = ~5s; trained range is ~124-362, longer is untested)
```

124 frames = 5.167 s; **362 frames = 15.083 s**. Frame count snaps **up**. Sigma-shift defaults are
`shift_video = 12.0`, `shift_audio = 3.0`. Docs restate the resolution rule and add the trap:
`Skip the 1.0 Megapixel step: it yields 1376x768, above the model's 768x1344 pixel area cap.`
Use `0.98` MP, or type `1344 x 768`.

**6. Keyframe asymmetry, confirmed first-party.** `[OFFICIAL]` `MiniMaxH3ImageToVideo.execute()`:
first frame is `# geometry anchor: plain stretch to canvas` (`crop="disabled"`), last frame is
`# follower: aspect-preserving cover-crop` (`crop="center"`). The 08-15 addendum carried this from
a third-party node pack; it is now confirmed in core.

**7. Two new local capabilities the corpus does not mention.** `[OFFICIAL]` docs page:
- `MiniMaxH3AddGuide` (PR #15439) — anchor a guide at **any** frame, not just first/last.
  Multi-frame batches are cropped to valid clip lengths `5, 22, 39...` (17k+5); batches under 5
  frames use only the first image; `frame_idx` accepts negatives (count from the end); audio guides
  are cropped to the remaining duration. Chainable.
- Per-token latent noise masks (PR #15375) for video **and** audio latents: `a value of 0 preserves
  the corresponding latent region, while 1 regenerates it. Video masks snap to the model's 2x2
  latent patch grid, and audio masks to whole latent frames.` Local inpainting / object removal /
  clip extension.
- Sage Attention roughly doubles speed; expect and ignore the console line
  `Input tensors must be in dtype of torch.float16 or torch.bfloat16, using pytorch attention instead`.

**8. Prompt guides: no revision since 2026-08-15.** `[OFFICIAL]`
<https://huggingface.co/api/models/MiniMaxAI/MiniMax-H3/tree/main/docs> still lists exactly three
files, no `_cn` variant. Fingerprints for future diffing: `QA-about-License.md` oid `f31bbf62`
(3,917 B); `VIDEO_PROMPT_WRITING_GUIDE_base_en.md` oid `40cf586a` (15,773 B);
`VIDEO_PROMPT_WRITING_GUIDE_ref_en.md` oid `7ae1b2d0` (23,553 B).

**T2VA schema, verbatim from §2.2 of the base guide (unrevised)** — note the **blank line between
fields**, which none of our gold pairs reproduce:

```text
integrated_multimodal_description: [Shot 1] ...

overall_soundscape: ...

non_diegetic_music: ...
```

```text
- **integrated_multimodal_description**: Describes visuals, actions, shots, speakers, dialogue, singing, and diegetic audio along the timeline.
- **overall_soundscape**: Summarizes ambient sound, physical action sounds, and non-verbal human sounds across the entire video.
- **non_diegetic_music**: Describes background music that the characters cannot hear and only the audience can hear.
```

Field-length rules, verbatim: `Use 1–4 English sentences in one continuous paragraph` (soundscape),
with `Dialogue, singing, and diegetic music already belong in the multimodal description and should
not be repeated here.` and `Use N/A only when the user explicitly requests complete silence
throughout the video.`; `Use 1–3 English sentences` (music) with `Focus on instrumentation, speed,
rhythm, and dynamic changes; do not use abstract mood words or explain the emotional function of
the score.`

Three base-guide rules absent from our corpus: `Do not add a timestamp to the first shot.`;
`FL2VA generally favors a single shot so the model can interpolate continuously from the first
frame to the last frame.`; and the guide's own internal inconsistency — §2.1's FL2VA template says
`Picture 2 (from Shot N)` while Case 3 writes `Picture 2 (from Shot 1)` for a single-shot clip
(N=1, so both are correct; reproduce per-mode as written).

**Camera vocabulary, verbatim and complete** (base guide §4.3, unchanged). Header line:
`A complete camera-motion expression has three dimensions: the motion type defines how the camera
moves, amplitude defines the range of compositional change, and speed defines the pacing of that
change. Add amplitude and speed only when they are meaningful; medium amplitude and normal speed
are usually omitted.`

| Dimension | Expression | Description |
|---|---|---|
| Motion type | `Zoom In / Zoom Out` | The focal length changes while the camera body remains stationary |
| Motion type | `Push In / Pull Out` | The camera moves forward / backward |
| Motion type | `Pan Left / Pan Right` | The camera remains in place while the lens pivots horizontally |
| Motion type | `Truck Left / Truck Right` | The camera translates horizontally |
| Motion type | `Tilt Up / Tilt Down` | The camera remains in place while the lens pivots vertically |
| Motion type | `Pedestal Up / Pedestal Down` | The entire camera moves upward / downward |
| Motion type | `Arc Shot` | The camera moves in an arc around the subject |
| Motion type | `Tracking Shot` | The camera follows a moving subject |
| Motion type | `Static Shot` | The camera position and lens remain still |
| Motion type | `Shake Slightly / Shake Strongly` | Slight / strong camera shake |
| Motion type | `POV` | The subject's point of view |
| Motion type | `Roll Clockwise / Roll Counterclockwise` | The camera rolls clockwise / counterclockwise around the lens axis |
| Amplitude | `with small amplitude` / `with large amplitude` | Small-range / large-range change |
| Speed | `at slow speed` / `at fast speed` | Slow / fast movement |

Written-form rule, verbatim: `Camera motion should be written as a natural English action within
the shot, rather than stacked as separate labels at the end of a sentence:` with the three model
sentences `The camera pushes in with small amplitude at slow speed toward the folded letter in her
hands.` / `The camera pans right with large amplitude at fast speed, revealing the open doorway.` /
`The camera holds a static shot as the runner exits the frame.`

### Chinese sources

**1. `platform.minimaxi.com/docs/guides/local-deploy-h3` — a major official Chinese page the corpus
has never seen.** `[OFFICIAL]`, self-dated **最后审阅 2026 年 8 月 26 日**.
<https://platform.minimaxi.com/docs/guides/local-deploy-h3> (index at
<https://platform.minimaxi.com/docs/guides/local-deploy>). It fetches as clean markdown.

- Licence warning verbatim: `截至 2026 年 8 月 26 日审阅的 License 版本，美国、欧盟、英国和韩国属于 Excluded Territories，需要另行获得许可。`
- Pinned official model revision: `MiniMaxAI/MiniMax-H3`, revision **`42ed227ee7df40d41602854ae760620d6eb651fe`**.
- Pinned ComfyUI baseline: workflow_templates rev `3c1df78`, Comfy-Org weights rev `4cc1d817`.
- **MiniMax has not published a minimum-VRAM figure.** Verbatim: `已公布最低显存与性能 | ComfyUI H3 指南未公布；请在实际硬件上验证所选工作流` and, in the model table, `最低显存未公布`. See *Contradicts* §3.
- Output envelope verbatim: `H3-Base 输出时长为 4–15 秒，短边 768 像素，视频 24 FPS，音频为 32 kHz 立体声。Ref2VA 最多接受 9 张图片、3 个视频片段和 3 个音频片段；单文件及组合限制请查看模型卡。`
- Reference-tag instruction verbatim: `在 R2V 提示词中，按连接顺序使用 <Picture 1>、<Video 1>、<Audio 1> 等标签引用输入，并说明每个参考素材负责身份、风格、动作、运镜还是声音。`
- Quantised-vs-official warning verbatim (a real teaching point — our corpus treats the Comfy files
  as "the weights"): `ComfyUI 模板使用 Comfy-Org/MiniMax-H3 发布的裁剪和量化文件，其中包含 INT8/NVFP4 组件。这些文件不同于 SGLang 基线使用的官方混合 BF16/FP32 H3 checkpoint，输出质量、显存占用和可复现性可能不同；不要混用两条路径的性能结论。`
- **CFG-distilled, stated as an operational constraint**: `H3 为 CFG 蒸馏模型，--cfg-parallel-size 必须保持 1`. Strongest first-party support yet for "no live negative prompt locally".
- Reproducibility discipline worth stealing verbatim for the app: `不要在未记录的情况下将 FL2VA 替换为 Ref2VA，或启用会改变质量的 Turbo LoRA。` and `比较结果时，应记录 LoRA 名称、强度、steps、seed 和全部参考素材。`
- A dated silent-corruption bug: `2026 年 8 月 26 日审阅的上游 issue（sgl-project/sglang#34227）报告：使用 --use-fsdp-inference true 部署 H3 可能静默产生损坏的视频和音频，且服务端无任何报错。`
- Storage: SGLang cookbook reports the official mixed BF16/FP32 weights at `约为 108 GB`; the
  vLLM-Omni recipe reports `每个 checkpoint 分区磁盘占用约 135 GiB；本地保留两个分区约需 270 GiB`.

**2. The same page carries an LoRA-training recipe with a real learning-rate ablation** — the kind
of table the 08-28 digest recorded as "still not recovered" from Zhihu. `[OFFICIAL]` (MiniMax doc
transcribing the upstream `miles-diffusion` recipe, commit `578d5a571c4924787eb85f0e6eac0de381f3e54f`,
labelled **Experimental**): defaults 学习率 **3e-5**, weight decay 0.01, **LoRA rank 64 / alpha 128**,
rollout batch 32, `--fsdp-flow-shift 12.0`, `--diffusion-guidance-scale 1.0`.

| 学习率 | 结果 |
|---|---|
| 3e-4 | 训练崩溃 |
| 1e-4 | 可见的画面退化 |
| 5e-5 | 首个 epoch 内出现过拟合迹象 |
| **3e-5** | **最佳结果；配方默认值** |
| 1e-5 | 欠拟合，与基座几乎无差异 |

Training-data grid constraints, verbatim — with a **hard rejection**, not a warning:
`训练数据必须精确落在 H3 的服务网格上；encoder 会拒绝任何不合网格的输入` · 画布 `短边 768；16:9 对应 1344 × 768`
· 帧率 `24 FPS，严格校验（±0.01）` · 帧数 `17n + 5 网格，最少 107 帧（约 4.46 秒）` · manifest JSONL
`{"prompt": ..., "metadata": {"video": "clips/clip.mp4"}}`. Also a real export gotcha: the
`adapter_config.json` sidecar must sit beside the `.safetensors`, because `缺失时 alpha 会回退为 rank，即强度减半`.

**3. `design.minimaxi.com/h3` FAQ, re-read.** `[OFFICIAL]` The hardware answer is explicitly framed
as community data, which the 08-28 digest's item 5 read as a vendor spec:
`比你想的低。社区验证过的参考点：12 GB 显存（RTX 3060 级）用 pruned int8（共约 42 GB 下载）即可出带音频的 480p；16–24 GB 很从容…社区方案最低压到 5–8 GB。系统内存建议 32–64 GB`.
LoRA answer verbatim: `AI-Toolkit 已支持 H3（含蒸馏训练适配器），首批角色/风格 LoRA、加速 LoRA 与全量微调已在 Hugging Face 流通。注意再分发时需标注修改说明，衍生物仍受社区许可条款约束。`
And the single best one-line answer to "is H3 prompt-inert?":
`H3 对 prompt 结构的敏感度高于多数模型——它用完整的多模态语言模型读你的提示词。`

**4. The Feishu doc set is behind a login wall — not merely client-rendered.** `[TESTED]`
The four doc links on `design.minimaxi.com/h3` are
开源资源 <https://vrfi1sk8a0.feishu.cn/docx/LFRwdBwKAoXGzwxud1jcD1ZDnxb> ·
**版本更新** <https://vrfi1sk8a0.feishu.cn/docx/WAT9dFe4xoHtkdxPLjMcWiOunde> ·
本地部署指南 <https://vrfi1sk8a0.feishu.cn/docx/XY05dGaZHoqi1IxmnZVcL9xSnse> ·
使用手册 wiki <https://vrfi1sk8a0.feishu.cn/wiki/FIWjwgL33ipnkekzk30crmKUnIh>.
`web_fetch` returns an empty body. A real browser (Chrome MCP, 2026-09-03) **redirects to
`accounts.feishu.cn` and demands a Doubao/Feishu QR-code login.** So the 版本更新 changelog is
**unreachable without a Feishu account**, and the 08-28 "needs Chrome MCP" note is wrong — Chrome
does not help. Recommend retiring this target and treating
`platform.minimaxi.com/docs/guides/local-deploy-h3` (which *is* dated and versioned) as the
substitute changelog surface. See *Nothing-found register*.

**5. Beat budget re-verified as current, plus the on-screen-text rules the addendum missed.**
`[OFFICIAL]` <https://raw.githubusercontent.com/MiniMax-AI/MiniMax-H3/main/skills/minimalist-product-ad-generator/SKILL.cn.md>,
still live and unchanged on 2026-09-03:

```text
- 5 秒建议 3-4 个节拍。
- 10 秒建议 5-7 个节拍。
- 15 秒建议 6-9 个节拍。
```

```text
- 5 秒片：1 个小峰值 + 1 个稳定收束。
- 10 秒片：1-2 个峰值 + 1-2 个制动时刻。
- 15 秒片：2-3 个峰值 + 2 个安静制动时刻。
```

New from this pass: a hard length rule for rendered copy — `可见画面文案必须是 3-5 个英文词，尽量不超过 32 个英文字符含空格；不要写 1-2 个词的孤立功能标签。`
— a named typeface to put in the prompt: `画面提示词优先写 SF Pro Display Semibold` — a
one-string-at-a-time rule: `同一时间画面里只允许出现一条单行英文文案；禁止上下两排文字、双行标题、主副标题并列、两处文字同时出现。`
— and a prompt-completeness gate that is a validator rule in disguise:
`prompt 完整性检查：如果最终视频生成 prompt 里没有逐字包含所有计划出现的英文文案，本次任务还不能派发，必须先重写 prompt。`
Also, for product ads specifically, MiniMax wants **one** H3 call, not one-clip-per-shot:
`默认生成一条 H3 全画幅产品片，而不是逐镜生成多个首帧视频`. Contrast the `3d-animation-short-generator`
skill's per-shot pipeline (addendum §3.3) — the doctrine is genre-dependent, not universal.

**6. Chinese-capable local rewriter.** `[LORE — third-party README, not vendor]` `lightx2v/MiniMax-H3-Prompt-Rewriter-LoRA-Omni`
(created 2026-08-26) declares `language: [en, zh]` on a Qwen2.5-Omni-7B base — the only rewriter in
scope that accepts Chinese input *and* image/video/audio references. See *New official guidance*
above and the LoRA list below.

### Tested findings

- `[TESTED]` **Feishu docs require an account** (above). Chrome MCP navigation on 2026-09-03
  landed on `accounts.feishu.cn`.
- `[TESTED]` **civitai.red is still invisible to fetches.** `https://civitai.red/models?query=minimax%20h3`
  returned an empty body on 2026-09-03. The 08-28 erratum's standing rule holds unchanged: any
  "no H3 LoRAs on Civitai" statement must be scoped to **the fetchable main site**. The instructor's
  `[USER-VERIFIED]` finding that H3 LoRAs exist there stands and this pass could not extend it.
- `[TESTED]` **`raw.githubusercontent.com/.../master/...` can serve stale content.** Two fetches of
  the same path minutes apart returned pre- and post-merge versions of
  `comfy/text_encoders/minimax.py`; the commit-pinned URL was correct. Quote ComfyUI source only
  from a pinned SHA.
- `[TESTED]` **`api.github.com` returned empty bodies** for `/pulls/N`, `/pulls/N/files` and
  `/issues/N` on `Comfy-Org/ComfyUI` in this environment on 2026-09-03, while the HTML pages
  `github.com/.../pull/N` and `.../issues/N` fetched fine (noisy but complete, including the full
  issue/PR body and merge state). **Reverse the 09-03 plan's tooling note for this environment.**
  `huggingface.co/api/models/...` JSON endpoints, by contrast, work perfectly and are the cheapest
  way to get exact file sizes and repo trees.
- `[OFFICIAL]` (upstream benchmark transcribed by MiniMax) **Consumer-GPU numbers that actually
  exist**, all at the Quickstart shape (1344×768, 124 frames, 24 fps, 50 steps, 5 s T2VA):
  2 × RTX 5090 32 GB, TP 2 + layerwise offload, lossless → **559.67 s end-to-end**, peak
  **26.3 GiB/card**; 1 × RTX 4090 24 GB, layerwise offload + `kitchen_int8` → **GPU peak ~18 GB**,
  latency dependent on host RAM and offload bandwidth. Under vLLM-Omni, 2 × RTX 5090 TP 2 + offload
  → **8 min 38 s**, peak ~22.6 GiB/card (single unwarmed run). The dual-GPU offload recipe wants
  **≥200 GiB system RAM, 384 GiB recommended**.

### Contradicts current corpus

1. **"Local weights are free to use commercially under the community licence" vs Comfy's
   reseller page.** The licence grants a `non-exclusive, non-transferable, royalty-free, limited
   license` for commercial use inside the Applicable Territory, gated only at $20M revenue, and
   MiniMax's Chinese FAQ says `社区许可授予免版税商用`. ComfyUI's own H3 tutorial says
   `Commercial use of locally generated outputs requires a MiniMax commercial license, available
   through Comfy, the only official reseller.` **Both kept.** Most plausible reconciliation
   `[SPECULATION]`: Comfy is selling the §II route out of the Excluded Territories (its page says
   "Available globally"), which for a US/EU/UK/KR user is not an upsell but the *only* lawful path —
   and that reading makes the Comfy page the more relevant one for this app's students. Do not
   teach either sentence as the whole truth; teach the split.
2. **"No Ref2VA turbo LoRA" (addendum §1.5) is now false, and "4-step Turbo v0.1" is stale.**
   `[OFFICIAL]` <https://huggingface.co/api/models/Comfy-Org/MiniMax-H3/tree/main/loras> lists
   **three** turbo LoRAs, each 1.956 GB: `minimax_h3_fl2v_turbo_4step_v1.0_768p_comfyui_bf16`,
   `minimax_h3_fl2v_turbo_8step_v1.0_comfyui_bf16`, **`minimax_h3_ref2v_turbo_4step_v0.1_comfyui_bf16`**.
   The docs now ship the **8-step v1.0** as the FL2VA default turbo (`turbo_steps` default 8,
   `turbo_model_strength` default 1.0, base workflow 20 steps, "raise the step count (for example
   to 25) for better motion quality") and a **4-step Ref2V** LoRA behind a "Lightning LoRA"
   checkbox. The `[TESTED]` "4 steps did not work well" datapoint (aistudynow, 2026-08-07) was
   measured against **v0.1 preview** weights and should be dated, not repeated as current.
3. **"H3 needs 12 GB VRAM" is a community figure, not a vendor spec; and "62+62 GB" needs its
   config named.** `[OFFICIAL]` MiniMax's own self-hosting page says the minimum VRAM is **未公布**
   (not published), twice. The 12 GB / 42 GB pair comes from the marketing FAQ's
   `社区验证过的参考点` and describes **480p with audio**, not 768p. Exact sizes from the HF API
   (2026-09-03), which let us name every figure:

   | Artifact | Bytes | ≈GB | ≈GiB |
   |---|---|---|---|
   | `minimax_h3_fl2va_bf16` (and `ref2va_bf16`, identical size) | 66,280,487,368 | 66.28 | **61.7** |
   | `minimax_h3_fl2va_pruned_bf16` | 40,225,724,176 | 40.23 | 37.5 |
   | `minimax_h3_fl2va_int8_convrot` | 34,038,892,334 | 34.04 | 31.7 |
   | `minimax_h3_fl2va_pruned_int8_convrot` | 20,970,379,616 | 20.97 | 19.5 |
   | `minimax_h3_fl2va_pruned_fp8_scaled` | 20,958,205,608 | 20.96 | 19.5 |
   | `qwen3vl_32b_minimax_h3_bf16` | 51,506,295,256 | 51.51 | 48.0 |
   | `qwen3vl_32b_minimax_h3_int8_convrot` | 27,141,342,152 | 27.14 | 25.3 |
   | `qwen3vl_32b_minimax_h3_nvfp4_awq` | 15,687,142,551 | 15.69 | 14.6 |
   | `minimax_h3_video_vae_fp16` | 5,207,808,496 | 5.21 | 4.85 |
   | `minimax_h3_audio_vae_fp32` | 605,254,808 | 0.61 | 0.56 |

   - **"62+62 GB" can only mean the two bf16 *diffusion* checkpoints** (61.7 GiB each, FL2VA and
     Ref2VA) — because bf16 model + bf16 encoder is **62 + 48 GiB**, not 62 + 62. Fix the corpus line
     to "the two unquantised bf16 checkpoints are 61.7 GiB (66.3 GB) each; you only need one at a
     time, and the bf16 text encoder is a further 48 GiB."
   - **"~42 GB download" is arithmetically exactly the int8 ComfyUI stack**:
     20.97 (`fl2va_pruned_int8_convrot`) + 15.69 (`qwen3vl_32b_..._nvfp4_awq`) + 5.21 + 0.61 =
     **42.48 GB**. That is the docs-recommended default local config — and note the text encoder in
     it is **NVFP4**, not int8, so "pruned int8" names only the diffusion file.
4. **The "12-file cap" is real but belongs to the *hosted/tooling* surface, not to local ComfyUI.**
   `[OFFICIAL]` `MiniMaxH3ReferenceToVideo`'s schema exposes **four** Autogrow groups with maxima
   `ref_images` 9, `ref_videos` 3, `ref_video_audios` 3, `ref_audios` 3 — **18 slots and no total
   cap**. `[LORE — third-party README, not vendor]` `lightx2v/MiniMax-H3-Prompt-Rewriter-LoRA-Omni` states
   `The script accepts at most 9 images, 3 videos, 3 audio files, and 12 total reference assets.`
   MiniMax's Chinese page says `最多 9 张图片、3 个视频片段和 3 个音频片段` (15) and defers the combined
   limit to the model card. **Keep the 12 as a hosted-path constraint; do not teach it as a local
   validator rule.** Local per-type caps 9/3/3/3 are the enforceable ones.
5. **The video-soundtrack rule is surface-dependent, and the two surfaces disagree.**
   `[OFFICIAL]` In ComfyUI, a reference video's soundtrack is a **separate input** that consumes its
   own `<Audio j>` ordinal — the code comment is literal:
   `# the soundtrack gets its own <Audio j> label, emitted before <Video k>`, and the pairing is by
   index (`ref_video_audio_N belongs to ref_video_N`). `[LORE — third-party README, not vendor]` The Omni rewriter says the
   opposite about *embedded* audio: `Embedded video audio is not used. Supply a separate labeled
   audio reference when audio content must be retained or imitated.` These are consistent once you
   see that neither path reads a video file's muxed audio track — you must attach it explicitly —
   but the *numbering consequence* differs and only the ComfyUI path burns an `<Audio>` ordinal.
   **Practical ceiling: `<Audio j>` can reach 6 locally** (3 video soundtracks + 3 standalone).
6. **"H3 is prompt-inert" should be retired; "H3 ignores weighting" should replace it.**
   Evidence, all `[OFFICIAL]`: the encoder is a real 50-layer-truncated Qwen3-VL-32B reading raw
   un-templated prompt text; `embedding:` textual inversion works; MiniMax says
   `H3 对 prompt 结构的敏感度高于多数模型`; and the ComfyUI prompt widget is declared
   `dynamic_prompts=True`. What *is* inert is attention weighting (`disable_weights=True`) and the
   negative-prompt path (CFG-distilled, no negative input on any H3 node, `--cfg-parallel-size` must
   stay 1). New gotcha from `dynamic_prompts=True`: **`{a|b}` in an H3 prompt is consumed by
   ComfyUI's wildcard expander before the model ever sees it** — a third meaning for `{}` to add to
   the 08-28 weighting-syntax audit table (NovelAI emphasis, ComfyUI wildcard, and now live on H3).
7. **"The rewriter is cloud-only" needs a qualifier.** The *official* Context-IR remains closed
   (three independent confirmations above), but two open local approximations now exist — see
   *LoRA & embedding ecosystem*. The honest line is: "the official rewriter is cloud-only; open
   local imitations of it exist and are explicitly not equivalent."
8. **"Six ordered sections" for Ref2VA is counted two different ways.** Our corpus counts
   `subject_definitions, summary, retention_analysis, style sentence, detailed_description,
   soundscape/music`. `[LORE — third-party README, not vendor]` The Omni rewriter's schema lists six **field names**:
   `subject_definitions / summary / retention_analysis / detailed_description / overall_soundscape /
   non_diegetic_music`, with the style sentence living inside `detailed_description`. Prefer the
   field-name list for a validator (it is machine-checkable); keep the style sentence as a required
   *first line of* `detailed_description`.
9. **New Ref2VA aspect-ratio restriction, not in our corpus.** `[LORE — third-party README, not vendor]` Omni rewriter:
   `Base tasks support adaptive, 21:9, 16:9, 4:3, 1:1, 3:4, and 9:16; Ref2AV supports 16:9 and 9:16.`
   Unverified against MiniMax's own docs — flag, do not enforce.

### Few-shot gold (new pairs)

Numbering continues from `_addenda/h3-deep-dive.md` (Pairs 5–8).

### Pair 9 — T2VA, two speakers [OFFICIAL-PATTERN]
INTENT: A late-night radio host takes a caller; both voices must be distinct, the second speaker is
off-screen, and neither mouth should keep moving after its line.
PROMPT-EN:
```text
integrated_multimodal_description: [Shot 1] Live-action, cinematic, a medium shot frames a radio host in her forties alone in a small broadcast booth after midnight, headphones on, one hand resting on a fader. The camera holds a static shot. The host, with a low, warm, unhurried voice (S1), leans toward the microphone and says: <d>[English] You're on the air. Where are you calling from?</d> Her lips stop moving immediately after the last word and she watches the level meter. A younger man (S2), heard only through the monitor speakers and never shown, answers in a thin, tired voice from an off-screen telephone line: <d>[English] A parking lot outside town. I couldn't sleep either.</d> [Shot 2] At 00:06.000, the shot cuts to a close-up of the host's hand easing the fader down two millimetres while the caller's line stays audible across the transition. The host (S1) answers quietly: <d>[English] Then we'll stay up together.</d> and her jaw settles closed as the meter falls.
overall_soundscape: A low console hum and the hiss of a slightly overdriven phone line continue throughout. Foam scrapes against the microphone once, a chair creaks, and the fader travels with a soft mechanical slide.
non_diegetic_music: A single sustained electric-piano chord at a slow tempo, repeating twice and decreasing in volume before the second shot ends.
```
NOTES: Both speakers are numbered in order of their **first vocal event** and keep their IDs across
the cut (base guide §4.4). S2 is established as off-screen with pitch/timbre/rate cues on first
appearance, so no `<scenetrans>` is needed — the line does not itself cross the cut; the *continuity
clause* (`stays audible across the transition`) does that job instead, which is the case the corpus's
Pair 6 does not cover. Each line gets its own mouth-stop clause. Dialogue is not repeated in
`overall_soundscape`. `non_diegetic_music` names instrumentation, tempo and dynamics with no mood
words (§4.7). Two lines in Shot 1 plus one in Shot 2 sits inside the community 1–2-sentences-per-5 s
budget.

### Pair 10 — full-reference mode, mixed media with a declared conflict winner [OFFICIAL-PATTERN]
INTENT: Two characters from separate stills, a camera rhythm from a reference clip whose own grade
must be rejected, that clip's soundtrack as a rhythm-only audio reference, and one standalone voice
reference — connected in that exact order.
PROMPT-EN:
```text
subject_definitions:
<Subject 1> is the luthier from <Picture 1>: grey braided hair, wire-rimmed glasses, a canvas apron over a dark green shirt, and a small burn scar on the back of the left hand.
<Subject 2> is the workshop interior from <Picture 2>: a long maple bench under two north-facing windows, hand planes on a wall rail, and pale shavings on a plank floor.
<Audio 1> is the soundtrack of <Video 1> and supplies only its tempo and accent placement; none of its instruments, room tone or dialogue are used.
<Video 1> supplies only the camera rhythm — the timing and length of its slow arc around the bench; its subject, location, colour grade and grain are not used.
<Audio 2> is the voice-timbre reference for <Subject 1> (S1); its words are not carried into the target video.

summary:
[reference generation + audio reference] <Subject 1> works at the bench inside <Subject 2> while the camera follows the arc timing of <Video 1>, the cutting accents fall on the tempo of <Audio 1>, and the spoken line uses the timbre of <Audio 2>. Where <Video 1> and the written lighting direction conflict, the written lighting direction wins.

retention_analysis:
<Subject 1> (appears in [Shot 1]): fully_preserved - braided grey hair, wire-rimmed glasses, canvas apron and the left-hand scar remain unchanged.
<Subject 2> (appears in [Shot 1]): fully_preserved - the maple bench, wall rail of planes and the two north windows remain unchanged.
<Video 1> (applies in [Shot 1]): attribute_transfer - only the arc timing and duration of the camera movement transfer; the colour grade, grain, lighting, subject and location of <Video 1> are not transferred.
<Audio 1>: weak_reference - only tempo and accent placement guide the timing of the physical action.
<Audio 2>: reference - timbre, pitch and speaking rate guide the delivery; the original words are not used.

detailed_description:
The target video is in realistic photographic style with cool, even north-window daylight and no warm practical sources.
[Shot 1] A slow arc shot moves left around the bench with small amplitude at slow speed, matching the arc timing of <Video 1>, while cool daylight stays flat across the shavings and the wall of planes. <Subject 1> (S1) draws a plane along a spruce top in three even strokes, each stroke landing on an accent of <Audio 1>, then lifts the plane, blows the shaving clear, and says in the timbre referenced from <Audio 2>: <d>[English] Two more passes and it will sing.</d> Her lips stop moving immediately after the last word and she tilts the top toward the window to read the light on the surface. The camera completes the arc and holds.
overall_soundscape:
Three long plane strokes cut across the grain, a shaving curls and drops to the floor, and a single breath clears the surface. A wide quiet room tone with faint street traffic continues outside the windows.
non_diegetic_music:
N/A
```
NOTES: Demonstrates the four things this pass established. **(a) Arrival-order numbering with
per-type ordinals**: connected as Picture 1, Picture 2, Video 1 + its soundtrack, then one standalone
audio — so the video's soundtrack takes `<Audio 1>` (it is emitted immediately before `<Video 1>`)
and the standalone voice reference becomes `<Audio 2>`, per `nodes_minimax_h3.py`. Writing the voice
reference as `<Audio 1>` here would silently point at the wrong asset — the single most likely
Ref2VA authoring error. **(b) Gap-closing**: numbering follows *supplied* assets, not slot numbers,
so leaving `ref_image_2` empty and filling `ref_image_3` still yields `<Picture 2>`. **(c) The
conflict winner is stated in `summary` and enforced by naming the exclusions in
`retention_analysis`** — the documented failure mode is a video reference's grade beating a text
lighting instruction (addendum §5.3). **(d)** `weak_reference` is used for a rhythm-only audio role;
per the addendum's marker audit that marker has no published behavioural test, so treat it as
required vocabulary rather than a calibrated strength. Every supplied label appears in the prompt and
no unsupplied label does — the Omni rewriter enforces exactly that rule.

### Validator changes

Proposed additions, each with the surface it rests on:

1. **`(word:1.2)` on an H3 prompt → error, not warning.** `disable_weights=True` in
   `comfy/text_encoders/minimax.py@e5a38e3`. Parentheses survive as literal characters and can be
   *rendered into the frame* (CN skill's punctuation rule), so this is a double defect.
2. **`{a|b}` on an H3 prompt → warning.** The prompt widget is `dynamic_prompts=True`; ComfyUI
   expands the wildcard before the model sees it.
3. **`embedding:<name>` → recognised token, not an error.** Valid since ComfyUI v0.34.0; suggest the
   ten `minimaxh3_*` names when the user types `embedding:` (list below).
4. **Frame count: accept only `n % 17 == 5`; warn outside 124–362.** 124 = 5.17 s, 362 = 15.08 s
   ("trained range is ~124-362, longer is untested"). Note the training recipe's floor is 107
   (`17n+5`, ~4.46 s) and the doc envelope is 4–15 s — so 107–123 is legal-but-below-ComfyUI's-stated
   trained range. Snap **up**.
5. **Resolution: multiples of 32, short edge 768, area ≤ 1,032,192 px.** Reject 1376×768 explicitly
   with the docs' own explanation. Default 1344×768.
6. **Ref2VA tag arithmetic.** Compute expected labels from the attached assets: images 1..n in
   connection order; for each video, its soundtrack (if attached) takes the next `<Audio>` ordinal
   *before* the video's `<Video>` ordinal; standalone audio last. Then: (a) every supplied label must
   appear in the prompt; (b) no unsupplied label may appear; (c) `<Audio>` may reach 6. Local caps
   9/3/3/3; the 12-total cap is a hosted-path rule and should be an advisory, not a block.
7. **Field-name check for Ref2VA** on six names in order (`subject_definitions`, `summary`,
   `retention_analysis`, `detailed_description`, `overall_soundscape`, `non_diegetic_music`), with
   the style sentence required as the first line of `detailed_description` rather than as a field.
8. **Blank line between the three base fields**, per base-guide §2.2.
9. **No timestamp on `[Shot 1]`** (base guide §4.2) — our current rule only enforces monotonic
   increase from Shot 2.
10. **Length guard.** Warn on a single unbroken text run long enough to risk
    `MiniMax H3 text segment exceeds the supported prompt length.` No token number is published;
    treat this as a "split into shots" nudge rather than a hard number `[SPECULATION]`.
11. **On-screen copy**: 3–5 English words, ≤32 characters including spaces, one single-line string
    at a time; every readable string typed verbatim in double quotes (CN product-ad skill).
12. **Negatives**: keep suppressing any negative-prompt field for H3 and cite the CFG-distillation
    line rather than "H3 is prompt-inert".

### Nothing-found register

Every brief item gets a line so nobody re-hunts it. Surfaces searched are named.

- **Feishu 版本更新 changelog — unreachable, and Chrome does not fix it.** Login wall at
  `accounts.feishu.cn` (QR code, Doubao/Feishu account). Not found on: `web_fetch`, Chrome MCP,
  Google/Bing via WebSearch (only third-party mentions that the docs exist). **No dated H3 changelog
  entries since 2026-08-15 were recoverable from any Chinese surface reached.** The nearest dated
  substitute is `platform.minimaxi.com/docs/guides/local-deploy-h3` (最后审阅 2026-08-26). Recommend
  replacing this target with that page + `docs.comfy.org/changelog`.
- **No revision to the official prompt guides** since 2026-08-15 (three files, same names; oids now
  recorded for diffing). **No Chinese-language prompt-format guide exists** on huggingface.co,
  github.com/MiniMax-AI/MiniMax-H3, platform.minimaxi.com or design.minimaxi.com.
- **No H3 technical report and no arXiv entry.** Not found on arxiv.org, minimax.io/blog,
  the GitHub repo, or WebSearch (2026-09-03). `arXiv:2606.13392` remains the *text*-line sparse-
  attention paper, unlinked to H3's video attention.
- **No sparse-attention code in the official release**; `lightx2v/Minimax-h3-Turbo-SLA` and
  `FastVideo-FastH3-...-VSA-DataFree` are third-party sparse-attention *distillations*, not the
  promised official implementation.
- **No H3-Regenerate-2K weights.** Confirmed closed on three surfaces this pass.
- **No Apache relicense.** Licence text on HF is unchanged (dated August 2, 2026).
- **No MiniMax-published minimum-VRAM figure** — explicitly `未公布` on its own self-hosting page.
  Every VRAM number in circulation (12 GB, 8 GB, 5–8 GB) is community or upstream-benchmark data.
- **No official H3-vs-anything prompt-adherence benchmark**; nothing new since 08-15 on
  artificialanalysis.ai. Still no H3-vs-LTX-2.5 comparison found.
- **No published test isolating `partially_preserved`, `weak_reference`, `partially_copy`, or audio
  `reference`.** Unchanged; the marker audit in addendum §5.1 stands.
- **civitai.red: still invisible to fetches** (empty body, 2026-09-03). Scope every Civitai absence
  claim to the fetchable main site.
- **Reddit: not attempted** this pass (structurally unreachable per the 08-28 tooling note); the
  existing AMA citation is unverified against a live page.
- **No `Contex-Loop` node found** under that name, second pass running. The addendum's recommendation
  to delete or re-source that baseline entry stands. What exists locally instead is now *better*:
  `MiniMaxH3AddGuide` + latent noise masks give real anchored continuation and extension.
- **No maintainer/staff reply on `ostris/ai-toolkit#1009`** (Ref2VA training request, opened
  2026-08-13, still Open, unlabelled, unassigned as of 2026-09-03).
- **No per-LoRA trigger words** published for most of the third-party H3 LoRAs listed below; only
  the ten ComfyUI embeddings have documented triggers (= filename).

### LoRA & embedding ecosystem (new sub-topic)

**Ten prompt embeddings, and they are unofficial.** `[OFFICIAL]` docs.comfy.org, verbatim:
`These files are unofficial: they were contributed by community member silveroxides via Hugging
Face PR #50, and were not produced by Comfy-Org or MiniMax.` Hosted at
<https://huggingface.co/Comfy-Org/MiniMax-H3/tree/main/embeddings>, 0.5–1.5 MB each (consistent with
textual-inversion vectors in the 5120-dim Qwen3-VL space). Trigger = filename without extension:
`minimaxh3_art_is_explosion` · `minimaxh3_blooming_flowers` · `minimaxh3_bullet_time` ·
`minimaxh3_dark_magic` · `minimaxh3_fire_breath` · `minimaxh3_four_seasons` ·
`minimaxh3_kiss_camera` · `minimaxh3_spiral_ascent` · `minimaxh3_storm_magic` ·
`minimaxh3_truman_show`. Originals: <https://huggingface.co/silveroxides/MiniMax-H3_tests>.

**AI-Toolkit.** `[LORE — third-party README, not vendor]` `ostris/minimax_h3_training_adapter` exists on HF (created
2026-08-06, last modified 2026-08-07, two files: `..._alpha.safetensors`, `..._v1.safetensors`,
310 MB total, **no model card**). `[LORE]` Search-surfaced (Ostris on X; comfyui-wiki 2026-08-03):
ai-toolkit added H3 **T2V and I2V** LoRA training with an NVFP4 path and VAE gradient checkpointing;
Ostris's own words as quoted: "Only T2V and I2V for now." `[LORE — third-party README, not vendor]` Ref2VA training is
**not** in ai-toolkit — issue #1009 requesting it is open and unanswered, and its author states
`Currently, training Ref2VA requires using custom/official standalone scripts outside of ai-toolkit.`
The `[OFFICIAL]` alternative for Ref2VA-adjacent training is the `miles-diffusion` recipe on
MiniMax's own page (FL2VA `t2va` only; the audio branch participates in rollout but not in loss).

**Named third-party LoRAs on huggingface.co** (via `huggingface.co/api/models?search=minimax_h3`,
2026-09-03; likes/downloads as reported that day). Scope: this is the HF surface only.

| Kind | Repo | Note |
|---|---|---|
| Acceleration | `lightx2v/Minimax-h3-Turbo` | 799 likes / 1.03 M dl; Apache-2.0-labelled |
| Acceleration | `lightx2v/Minimax-h3-Turbo-SLA` | sparse-attention distill, arXiv 2509.24006 |
| Acceleration | `larryvrh/MiniMax-H3-Turbo-Lora` | 913 likes / 682 k dl |
| Acceleration | `drbaph/MiniMax-H3-Turbo-Lora-ComfyUI` | dynamic-rank / SVD repack |
| Acceleration | `alibaba-pai/MiniMax-H3-Acc-LoRAs` + `aptech0081/...-ComfyUI` | videox_fun, arXiv 2607.26004 |
| Acceleration | `mvp-lab/MiniMax-H3-RAVEN-Streaming-LoRA` | streaming/realtime, arXiv 2605.15190 |
| Acceleration | `barelymining/ComfyUI-MiniMax-H3-FastVideo` | wraps `FastVideo/FastVideo-FastH3-4-step-Preview-v1-VSA-DataFree` |
| Style | `KennethFal/vh5tape-vhs-lora-minimax-h3` | VHS / 1980s |
| Style | `lovis93/studio-1939-old-animation-lora-minimax-h3` | vintage animation |
| Realism | `fal/MiniMax-H3-Realism-People-LoRA` | 339 likes / 49 k dl — published by a *host vendor* |
| Realism | `prithivMLmods/MiniMax-H3-Facial-Realism-CloseUp` | close-up faces (addresses the known soft-face VAE limit) |
| Motion | `Jojocodex/minimax-h3-Camera-Motion-lora`, `...-spatial-physics-lora`, `...-wushu-action-lora`, `wushu-action-v7-...-fl2va-ref2va-lora` | camera / physics / action |
| Format | `rehan-fal/minimax-h3-vr180-sbs-lora` | VR180 side-by-side stereo, created 2026-09-03 |
| Character | `Playtime-AI/Minimax_H3-*` (Megan_Fox, Margot_Robbie, Zendaya, Anya_Taylor_Joy, Ariana_Grande, Sadie_S) | celebrity-likeness LoRAs |
| Control | `alibaba-pai/MiniMax-H3-Fun-Controlnet-Union` | **ControlNet for H3** — a capability our corpus does not mention |
| Full finetune | `OpenVDN/vdn-minimax-h3` (2026-09-02) + `t8star/Vdn-Minimax-H3-Comfy` (2026-09-03) | newest derivative base, trending |
| Text encoder | `ethanfel/Qwen3-VL-32B-Ultra-Heretic-H3-*`, `sakamakismile/...`, `Momoking/...` | abliterated Qwen3-VL encoders — **swapping the encoder changes prompt behaviour** |
| Rewriter | `lightx2v/MiniMax-H3-Prompt-Rewriter-LoRA` (Qwen3.6-27B, T2VA only) | open local Context-IR imitation |
| Rewriter | `lightx2v/MiniMax-H3-Prompt-Rewriter-LoRA-Omni` (Qwen2.5-Omni-7B, en+zh, all five modes) | accepts image/video/audio refs |

`[SPECULATION]` Two compliance observations worth a teaching note, not a claim about any repo:
several of these declare `license: apache-2.0` although a LoRA trained on H3 is a **Model
Derivative** under §I.11 and MiniMax's own FAQ says `衍生物仍受社区许可条款约束`; and celebrity-likeness
LoRAs sit directly against Exhibit A item 13 (`Use to impersonate another person without that
person's consent…`). The app should teach the derivative-inherits-the-licence rule rather than
inferring permission from an uploader's tag.

**The two open rewriters, and what they concede.** `[LORE — third-party README, not vendor]`
`lightx2v/MiniMax-H3-Prompt-Rewriter-LoRA` (Qwen3.6-27B LoRA) publishes a four-way comparison
gallery — *Original Prompt (No Rewrite)* / *MiniMax Context-IR* / *Qwen3.6-27B Base Rewriter* /
*this LoRA* — on four fixed prompts with the same checkpoint and settings. Its own limitations,
verbatim, are the honest framing to teach:

```text
It is a learned approximation, not an open-source release or exact replica of the official H3-Context-IR service.
```

```text
This release supports text-only T2VA prompt rewriting; it does not consume images, videos, or audio references.
```

Roadmap: FL2VA and Ref2VA rewriting unchecked. The **Omni** variant (Qwen2.5-Omni-7B, `en`+`zh`)
covers all five modes, takes ordered `--reference TYPE=PATH` assets, and emits a `schema_ok` flag —
`schema_ok validates section presence and ordering only; it is not a semantic quality score.`
Its label rules are the cleanest statement of the mechanics anywhere:
`Ref2AV references preserve command-line order. Labels are numbered separately by media type, so
the first image is <Picture 1>, the first video is <Video 1>, and the first audio file is <Audio 1>.`
and `The raw prompt must mention every supplied label and must not mention labels that were not
supplied.`

### Reference-tag mechanics — the `[LORE]` item now has a primary source

`[OFFICIAL]` <https://raw.githubusercontent.com/Comfy-Org/ComfyUI/master/comfy_extras/nodes_minimax_h3.py>
and `comfy/text_encoders/minimax.py@e5a38e3`, both fetched 2026-09-03. This closes brief item 6.

Node docstring, verbatim:

```text
References enter the presentation in fixed order: images, then videos (each
soundtrack's <Audio j> label right before its <Video k>), then standalone
audio. Ordinals are 1-based per type, so the prompt refers to them as
<Picture i> / <Video k> / <Audio j>.
```

Tokenizer docstring, verbatim — note `audio never enters Qwen`:

```text
  t2va:   <prompt>
  fl2va:  "<Picture 1>: " <vision block> ["<Picture 2>: " <vision block>] <prompt>
  ref2va: per condition in request order (1-based ordinals per type):
            image -> "<Picture i>: " <vision block>
            audio -> "<Audio j>: "              (audio never enters Qwen)
            video -> "<Video k>: " then per 2-frame temporal block
                     "<T.T seconds>" <vision block(2 frames)>
          then <prompt>
```

Mechanics established from the code, each previously `[LORE]`:

- **Arrival-order numbering.** `counters = {"image": 0, "audio": 0, "video": 0}` incremented per
  item as `minimax_ref_items` is iterated **in request order**, with independent per-type ordinals.
  Equal numbers across types imply **no** pairing.
- **Gap-closing is real.** The node builds `ref_items` with `for img in (ref_images or {}).values():
  if img is None: continue` — empty slots are skipped and never counted, so labels are always dense.
  Leaving slot 2 empty and filling slot 3 makes the filled asset `<Picture 2>`.
- **Video soundtracks split into their own audio reference**, emitted *before* their video, paired by
  index (`ref_video_audio_N` ↔ `ref_video_N`). Code comment:
  `# the soundtrack gets its own <Audio j> label, emitted before <Video k>`.
- **File caps locally are 9 / 3 / 3 / 3 with no total cap** (Autogrow maxima); `<Audio j>` can reach
  **6**. The 12-total figure is a hosted/tooling rule (see *Contradicts* §4).
- **Reference videos**: min 5 frames — error string verbatim
  `MiniMax H3 reference videos need at least 5 frames (~0.2s at 24 fps)`; trimmed **down** to the
  nearest `17n+5`; truncated to the target frame count; tooltip says
  `Reference video frames at 24 fps (2-15s)`. **Qwen sees the reference video at 2 fps** with
  `<%.1f seconds>` timestamps per 2-frame block; odd counts are repeat-padded.
- **`ref_image_size`**, tooltip verbatim (fuller than the docs line our corpus quotes):
  `'match' scales each ref (down only, keeping aspect) to the generation's pixel area; 'max' uses
  the reference pipeline's 2048px short edge for best identity fidelity. Reference tokens ride
  through every sampling step, so 'max' can be several times slower.` Reference images are
  `downscaled to 2048 short edge if larger, never upscaled` — which confirms the addendum's
  `[SPECULATION]` that `max` buys nothing from a soft or low-res source.
- **Architecture detail worth one line in KNOWLEDGE**: the conditioning is `the unnormalized hidden
  state after LM layer 50` of a Qwen3-VL-32B `truncated to 50 layers`; vision-pad positions carry
  adaLN token tag 0 and text positions tag 1, exported as `minimax_token_tags`. Latents are
  NestedTensor pairs, video `[B,24,T,H/16,W/16]` and audio `[B,32,2,T40]`.

### Sources

Official — MiniMax:
- <https://huggingface.co/MiniMaxAI/MiniMax-H3/raw/main/LICENSE> — licence + Exhibit A, dated
  2026-08-02, accessed 2026-09-03. `[OFFICIAL]`
- <https://platform.minimaxi.com/docs/guides/local-deploy-h3> and
  <https://platform.minimaxi.com/docs/guides/local-deploy> — Chinese self-hosting docs,
  最后审阅 2026-08-26, accessed 2026-09-03. **New surface.** `[OFFICIAL]`
- <https://design.minimaxi.com/h3> — Chinese hub FAQ, accessed 2026-09-03. `[OFFICIAL]`
- <https://huggingface.co/api/models/MiniMaxAI/MiniMax-H3/tree/main/docs> — doc-tree oids,
  accessed 2026-09-03. `[OFFICIAL]`
- <https://huggingface.co/MiniMaxAI/MiniMax-H3/raw/main/docs/VIDEO_PROMPT_WRITING_GUIDE_base_en.md>
  — full base guide, accessed 2026-09-03. `[OFFICIAL]`
- <https://raw.githubusercontent.com/MiniMax-AI/MiniMax-H3/main/skills/minimalist-product-ad-generator/SKILL.cn.md>
  — beat budget, on-screen-text rules, accessed 2026-09-03. `[OFFICIAL]`

Official — ComfyUI / Comfy Org:
- <https://docs.comfy.org/changelog> — v0.34.0 (2026-08-26), v0.34.1, v0.34.2 (2026-08-27),
  accessed 2026-09-03. `[OFFICIAL]`
- <https://docs.comfy.org/tutorials/video/minimax/minimax-h3> — resolution/frames/turbo/embeddings/
  AddGuide/noise-mask + the reseller note, accessed 2026-09-03. `[OFFICIAL]`
- <https://comfy.org/minimax/license> — "Updated August 2026", accessed 2026-09-03. `[OFFICIAL]`
- <https://github.com/Comfy-Org/ComfyUI/pull/15697> — `embedding:` PR, merged 2026-08-18 as
  `e5a38e3`, accessed 2026-09-03. `[OFFICIAL]`
- <https://raw.githubusercontent.com/Comfy-Org/ComfyUI/e5a38e3f7b91619ff295ffbbeddff35d8e381677/comfy/text_encoders/minimax.py>
  — tokenizer, `disable_weights=True`, accessed 2026-09-03. `[OFFICIAL]`
- <https://raw.githubusercontent.com/Comfy-Org/ComfyUI/master/comfy_extras/nodes_minimax_h3.py>
  — node schemas and constants, accessed 2026-09-03. `[OFFICIAL]`
- Comfy-Org weight/LoRA/embedding trees via
  `https://huggingface.co/api/models/Comfy-Org/MiniMax-H3/tree/main/{diffusion_models,text_encoders,vae,loras,embeddings}`
  — exact byte sizes, accessed 2026-09-03. `[OFFICIAL]`

Third-party:
- <https://huggingface.co/lightx2v/MiniMax-H3-Prompt-Rewriter-LoRA/raw/main/README.md> and
  <https://huggingface.co/lightx2v/MiniMax-H3-Prompt-Rewriter-LoRA-Omni/raw/main/README.md>
  — open local rewriters, accessed 2026-09-03. `[LORE — third-party README, not vendor]`
- <https://huggingface.co/api/models?search=minimax_h3> and `?search=minimax-h3` — LoRA/derivative
  census, accessed 2026-09-03. `[LORE — third-party README, not vendor]`
- <https://huggingface.co/api/models/ostris/minimax_h3_training_adapter> — accessed 2026-09-03.
  `[LORE — third-party README, not vendor]`
- <https://github.com/ostris/ai-toolkit/issues/1009> — Ref2VA training request, open, accessed
  2026-09-03. `[LORE — third-party README, not vendor]`
- <https://comfyui-wiki.com/en/news/2026-08-03-ai-toolkit-minimax-h3-training> and
  <https://x.com/ostrisai/status/2084317559348944907> — ai-toolkit H3 T2V/I2V support, via
  WebSearch snippets only (pages not fetched), 2026-09-03. `[LORE]`

Unreachable (recorded, do not re-hunt without a Feishu account):
- <https://vrfi1sk8a0.feishu.cn/docx/WAT9dFe4xoHtkdxPLjMcWiOunde> (版本更新),
  <https://vrfi1sk8a0.feishu.cn/docx/LFRwdBwKAoXGzwxud1jcD1ZDnxb> (开源资源),
  <https://vrfi1sk8a0.feishu.cn/docx/XY05dGaZHoqi1IxmnZVcL9xSnse> (本地部署指南),
  <https://vrfi1sk8a0.feishu.cn/wiki/FIWjwgL33ipnkekzk30crmKUnIh> (使用手册) — login wall.
- <https://civitai.red/models?query=minimax%20h3> — empty body, 2026-09-03.

**Claim counts by label in this section:** `[OFFICIAL]` 41 · `[LORE — third-party README, not vendor]` 9 · `[TESTED]` 4 ·
`[LORE]` 2 · `[SPECULATION]` 3 · `[USER-VERIFIED]` 1 (carried forward, not new) ·
`[STAFF]` **0** — no maintainer- or employee-authored statement about H3 prompting was found on any
surface reached this pass; the `embedding:` PR's only human commentary is from an outside
contributor, and issue #1009 has no maintainer reply. Wave-2 agent 2A should not expect H3 to
supply `[STAFF]` claims from GitHub or HF.

> Grade note (2026-09-13 merge review): all `[OFFICIAL-3P]` tokens above were regraded to `[LORE — third-party README, not vendor]`. The branch's own round-1 verification (process defect #65) ruled the invented label launders third-party READMEs into vendor authority; the Ref2VA aspect restriction and the 12-asset cap sourced under it are NOT vendor statements.
