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

## Validator suggestions

- Detect mode first. Base mode must contain the three core fields in order.
- Ref2VA must contain all six sections in canonical order and at least one definition/retention line per referenced asset.
- Dialogue regex: `<d>\[(?:English|Chinese|[^\]]+)\].+?</d>`; warn on quoted speech outside `<d>`.
- Each `[Shot N>1]` should have a timestamp; enforce monotonically increasing time.
- Camera movement should match `(type)( optional amplitude)( optional speed)` in natural prose; flag detached multi-tag stacks.
- Full-reference generation: warn below 300 or above 550 English words; target 350–500.

## Sources

- [MiniMax H3 launch](https://www.minimax.io/blog/minimax-h3) and [Chinese launch](https://www.minimaxi.com/blog/minimax-h3) — [OFFICIAL], 2026-07-31, accessed 2026-08-15.
- [MiniMax-H3 official repository/skill](https://github.com/MiniMax-AI/MiniMax-H3/tree/main/skills/h3-prompt-writing) — [OFFICIAL], accessed 2026-08-15.
- [Official base guide](https://github.com/MiniMax-AI/MiniMax-H3/blob/main/skills/h3-prompt-writing/references/base-en.txt) and [reference guide](https://github.com/MiniMax-AI/MiniMax-H3/blob/main/skills/h3-prompt-writing/references/ref-en.txt) — [OFFICIAL], accessed 2026-08-15.
- [Team AMA](https://www.reddit.com/r/StableDiffusion/comments/1vh9rtw/ama_minimax_h3_team_ask_us_anything_about_our/) — [STAFF], 2026-08, accessed 2026-08-15.

