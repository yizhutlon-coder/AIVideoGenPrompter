# Validator accuracy run — 2026-09-10

Fixtures: **142** across **12** model keys. validate() threw on **0**.

Message-prefix census (the stated contract is `HARD:` / `advisory:`): `HARD:` **1** · `advisory:` **7** · **no prefix 98** (unprefixed messages are counted as blocking, because `renderCheck()` renders them identically to a hard error).

## Confusion by model key

| key | n | correct | false-hard | false-pass | wrong-severity | accuracy |
|---|--:|--:|--:|--:|--:|--:|
| `wan` | 13 | 10 | 1 | 0 | 2 | 77% |
| `wanI2V` | 8 | 7 | 0 | 1 | 0 | 88% |
| `ltx` | 13 | 11 | 2 | 0 | 0 | 85% |
| `minimax` | 14 | 14 | 0 | 0 | 0 | 100% |
| `minimaxref` | 9 | 6 | 3 | 0 | 0 | 67% |
| `scail` | 12 | 8 | 1 | 1 | 2 | 67% |
| `sdxl` | 10 | 10 | 0 | 0 | 0 | 100% |
| `sdxlAnime` | 12 | 9 | 2 | 1 | 0 | 75% |
| `flux` | 14 | 14 | 0 | 0 | 0 | 100% |
| `zimage` | 11 | 8 | 3 | 0 | 0 | 73% |
| `qwenimg` | 13 | 9 | 4 | 0 | 0 | 69% |
| `krea2` | 13 | 6 | 5 | 0 | 2 | 46% |
| **total** | **142** | **112** | **21** | **3** | **6** | **79%** |

- **false-hard** (blocks a prompt that is valid or only worth an advisory): **21** of 142 — of which **20** are on OFFICIAL / gold-pair fixtures.
- **false-pass** (misses a real, sourced violation entirely): **3**.
- **wrong-severity** (right that something is off, wrong tier): **6**.

Label distribution — expect `pass` 57 · `advisory` 27 · `hard` 58.

## Failures (30)

### `wan-gold-p1-zh` — WRONG-SEVERITY

- key `wan` · expect **advisory** · actual **pass** · grade SYNTHESIS
- rule: Chinese prompt must not trip English word counts
- source: research/wan22.md §Few-shot gold Pair 1 (PROMPT-ZH)
- messages produced: _(none)_

### `wan-gold-p7-en` — FALSE-HARD

- key `wan` · expect **pass** · actual **hard** · grade OFFICIAL-PATTERN
- rule: one camera move ('pushes in') must not count as 'multiple camera moves'
- source: research/wan22.md §Few-shot gold Pair 7 (PROMPT-EN) — official token order
- messages produced:
  - `multiple camera moves — Wan follows one simple command at best`

### `wan-adv-guwei` — WRONG-SEVERITY

- key `wan` · expect **advisory** · actual **pass** · grade OFFICIAL
- rule: 固定机位 is a synonym — suggest 固定镜头, never block
- source: research/wan22.md §Validator changes #3 ('Accept 固定机位 … but suggest the official token 固定镜头'); system-prompt-audit I1
- messages produced: _(none)_

### `wanI2V-viol-zh-over100` — FALSE-PASS

- key `wanI2V` · expect **hard** · actual **pass** · grade OFFICIAL
- rule: Chinese I2V over the official 100-character cap
- source: TARGETS.wanI2V.system ('Hard cap 100 words in English, 100 characters in Chinese — the two official rewriters differ'); FOLD-IN A22
- messages produced: _(none)_

### `ltx-gold-p6-multishot` — FALSE-HARD

- key `ltx` · expect **pass** · actual **hard** · grade SYNTHESIS (built to the official multishot checklist)
- rule: LTX-2.5 named cuts are ALLOWED — three shots, named transitions, audio continuity
- source: research/ltx23.md §Few-shot gold Pair 6; §Validator changes V11
- messages produced:
  - `the request SEQUENCES events (then/after) but the output has no sequencing words — verify the order of events survived (timing words are physics)`

### `ltx-gold-p7-dubit` — FALSE-HARD

- key `ltx` · expect **advisory** · actual **hard** · grade OFFICIAL template
- rule: the Dub-It slot form is official and must not be judged by the paragraph length rules
- source: research/ltx23.md §Few-shot gold Pair 7; §Validator changes V14 ('Recognise the [Speaker] is speaking [Language/Accent], saying: "[Dialogue]" template and validate it separately')
- messages produced:
  - `too short (19 words) — a single shot is roughly 4-8 descriptive sentences`

### `mmref-gold-p4` — FALSE-HARD

- key `minimaxref` · expect **advisory** · actual **hard** · grade OFFICIAL-PATTERN
- rule: all six sections, narrow reference roles, no ordinal gaps
- source: research/minimax-h3.md §Few-shot gold Pair 4 (six-section Ref2VA)
- messages produced:
  - `advisory: both video and audio references — each reference video's soundtrack is a separate input whose <Audio j> is emitted BEFORE its <Video k>, so a standalone voice reference written as <Audio 1> can silently point at a soundtrack instead`
  - `detailed_description thin (54 words; official generation target 350-500)`

### `mmref-gold-app-example` — FALSE-HARD

- key `minimaxref` · expect **advisory** · actual **hard** · grade app's own worked example
- rule: the app's own few-shot example must not produce a blocking message
- source: TARGETS.minimaxref.system example output
- messages produced:
  - `advisory: both video and audio references — each reference video's soundtrack is a separate input whose <Audio j> is emitted BEFORE its <Video k>, so a standalone voice reference written as <Audio 1> can silently point at a soundtrack instead`
  - `detailed_description thin (74 words; official generation target 350-500)`

### `mmref-gold-h3p8` — FALSE-HARD

- key `minimaxref` · expect **advisory** · actual **hard** · grade OFFICIAL-PATTERN, derived
- rule: two pictures, one video, no audio references
- source: research/_addenda/h3-deep-dive.md §Few-shot gold Pair 8 (explicit conflict resolution)
- messages produced:
  - `detailed_description thin (92 words; official generation target 350-500)`

### `scail-gold-p1` — WRONG-SEVERITY

- key `scail` · expect **advisory** · actual **pass** · grade SYNTHESIS
- rule: final-video description with no edit verbs
- source: research/scail2.md §Few-shot gold Pair 1 (animation)
- messages produced: _(none)_

### `scail-gold-p2` — WRONG-SEVERITY

- key `scail` · expect **advisory** · actual **pass** · grade OFFICIAL-PATTERN
- rule: replacement described as a final video
- source: research/scail2.md §Few-shot gold Pair 2; also TARGETS.scail.system's own example
- messages produced: _(none)_

### `scail-viol-banlist-official` — FALSE-PASS

- key `scail` · expect **hard** · actual **pass** · grade OFFICIAL
- rule: the official enhancer's own banned vocabulary
- source: research/scail2.md §Validator changes #3 ('Extend ban list to the official one … the task is, Gemini, editing software, Photoshop, inpaint, prompt, 分割, 抠图, 修图')
- messages produced: _(none)_

### `scail-viol-toolong` — FALSE-HARD

- key `scail` · expect **advisory** · actual **hard** · grade OFFICIAL
- rule: PROMPT far past the 90-140 band
- source: research/scail2.md §Validator changes #1 ('warn over ~160 words')
- messages produced:
  - `PROMPT too long (178 words; Replacement target 90-140, Animation less)`

### `anime-gold-p8-illustrious` — FALSE-HARD

- key `sdxlAnime` · expect **advisory** · actual **hard** · grade CREATOR-DIALECT ([LORE] prefix, labelled)
- rule: the masterpiece/best-quality prefix is third-party LORE on Illustrious — a labelled suggestion, not an error
- source: research/sdxl.md §Few-shot gold Pair 8 (Illustrious v3.5-vpred colour control)
- messages produced:
  - `Illustrious: no Onoma card states any quality prefix — "masterpiece, best quality, amazing quality" is third-party LORE, not official`

### `anime-adv-pony-no-chain` — FALSE-HARD

- key `sdxlAnime` · expect **advisory** · actual **hard** · grade CREATOR (card wording is 'much weaker effect', not 'broken')
- rule: an absent score chain is a quality-scheme miss, not a format error — advisory, not blocking
- source: research/sdxl.md §Validator changes (Pony V6 block); Pony V6 card ('trained on a combination of natural language prompts and tags')
- messages produced:
  - `Pony V6: missing the score chain — open "score_9, score_8_up, score_7_up..."`

### `anime-viol-vpred-karras` — FALSE-PASS

- key `sdxlAnime` · expect **hard** · actual **pass** · grade CREATOR (card verbatim, 'error' per the corpus)
- rule: a Karras schedule requested on a v-pred checkpoint
- source: research/sdxl.md §Validator changes (NoobAI v-pred block: 'Scheduler MUST NOT be karras — error, cite the card'); FOLD-IN D4
- messages produced: _(none)_

### `zimg-gold-p2-en` — FALSE-HARD

- key `zimage` · expect **advisory** · actual **hard** · grade SYNTHESIS
- rule: a short gold pair must not be blocked; the 80-300 band is craft guidance, not a documented error
- source: research/z-image.md §Few-shot gold Pair 2 (EN) — 47 words
- messages produced:
  - `too short (44 words, want 80-300 of concrete relational detail)`

### `zimg-gold-p4-zh` — FALSE-HARD

- key `zimage` · expect **advisory** · actual **hard** · grade SYNTHESIS
- rule: native glyphs and layout in Chinese
- source: research/z-image.md §Few-shot gold Pair 4 (ZH)
- messages produced:
  - `thin for Z-Image (84 Han chars; aim 120-500)`

### `zimg-gold-p6-positive` — FALSE-HARD

- key `zimage` · expect **advisory** · actual **hard** · grade LORE-PATTERN (positive half is plain Z-Image prose)
- rule: positive-rephrase anti-gloss route
- source: research/z-image.md §Few-shot gold Pair 6 (positive only — the NegPiP negative goes into a node socket, never into the prompt)
- messages produced:
  - `too short (42 words, want 80-300 of concrete relational detail)`

### `qwen-gold-p1-en` — FALSE-HARD

- key `qwenimg` · expect **advisory** · actual **hard** · grade SYNTHESIS
- rule: the app's own worked portrait example must not be blocked for lacking the no-text sentinel
- source: research/qwen-image.md §Few-shot gold Pair 1 (EN); also TARGETS.qwenimg.system's own example
- messages produced:
  - `must either quote visible text exactly or state the image contains no recognizable text`

### `qwen-gold-p1-zh` — FALSE-HARD

- key `qwenimg` · expect **advisory** · actual **hard** · grade SYNTHESIS
- rule: Chinese portrait prose must not trip English word counts
- source: research/qwen-image.md §Few-shot gold Pair 1 (ZH)
- messages produced:
  - `must either quote visible text exactly or state the image contains no recognizable text`

### `qwen-gold-p7-edit` — FALSE-HARD

- key `qwenimg` · expect **pass** · actual **hard** · grade OFFICIAL-PATTERN + STAFF-PATTERN
- rule: an edit prompt carries no negative block and is judged as an edit
- source: research/qwen-image.md §Few-shot gold Pair 7 (Edit-2511 text replacement); §Validator changes #7 (edit-prompt structure)
- messages produced:
  - `missing "Negative prompt:" block`

### `qwen-gold-p5-edit-multi` — FALSE-HARD

- key `qwenimg` · expect **pass** · actual **hard** · grade OFFICIAL-PATTERN
- rule: one role per indexed image, explicit preservation
- source: research/qwen-image.md §Few-shot gold Pair 5 (multi-image edit); §Validator suggestions ('Edit: require operation + target + result')
- messages produced:
  - `missing "Negative prompt:" block`
  - `must either quote visible text exactly or state the image contains no recognizable text`

### `krea-gold-p5-charart` — WRONG-SEVERITY

- key `krea2` · expect **advisory** · actual **pass** · grade OFFICIAL-PATTERN
- rule: medium-first character art on a locked flat background
- source: research/_addenda/krea-character-art.md §Few-shot gold Pair 5 (descriptor-slot order, ~135 words)
- messages produced: _(none)_

### `krea-gold-p7-official25` — WRONG-SEVERITY

- key `krea2` · expect **advisory** · actual **pass** · grade OFFICIAL
- rule: a 60-word vendor prompt is inside the official distribution (median 101.5, min 10) — length is craft guidance, not a rule
- source: research/_addenda/krea-character-art.md §Few-shot gold Pair 7 — verbatim prompt #25 of the vendor's 36 widget pairs (60 words)
- messages produced: _(none)_

### `krea-gold-p8-familyA` — FALSE-HARD

- key `krea2` · expect **advisory** · actual **hard** · grade OFFICIAL
- rule: the vendor's family-A format falsifies 'LEAD WITH THE MEDIUM' and the 80-140 band simultaneously (X1, X2, X6)
- source: research/_addenda/krea-character-art.md §Few-shot gold Pair 8 — verbatim prompt #6 of 36 (199 words, medium disclosed at 64%, trailing style tail)
- messages produced:
  - `does not lead with the medium — Krea 2 responds to medium-first prompts`
  - `too long (199 words, want 80-140)`

### `krea-gold-official17-short` — FALSE-HARD

- key `krea2` · expect **advisory** · actual **hard** · grade OFFICIAL
- rule: a ten-word official prompt must not be blocked
- source: research/_addenda/krea-character-art.md §2026-09-10 harvest, prompt #17 of 36 — the vendor's shortest published prompt (10 words)
- messages produced:
  - `does not lead with the medium — Krea 2 responds to medium-first prompts`
  - `too short (10 words, want 80-140 of concrete description)`

### `krea-gold-official30-pitchblack` — FALSE-HARD

- key `krea2` · expect **advisory** · actual **hard** · grade OFFICIAL
- rule: 'pitch-black background' is the vendor's own background lock wording
- source: research/_addenda/krea-character-art.md §2026-09-10 harvest, prompt #30 of 36
- messages produced:
  - `does not lead with the medium — Krea 2 responds to medium-first prompts`
  - `background mentioned but not locked ("solid flat <color> background") — gradients and environments sneak in otherwise`

### `krea-gold-official31-long` — FALSE-HARD

- key `krea2` · expect **advisory** · actual **hard** · grade OFFICIAL
- rule: a 193-word official prompt is inside the vendor's published spread (max 230)
- source: research/_addenda/krea-character-art.md §2026-09-10 harvest, prompt #31 of 36 (193 words)
- messages produced:
  - `background mentioned but not locked ("solid flat <color> background") — gradients and environments sneak in otherwise`
  - `too long (180 words, want 80-140)`

### `krea-gold-official23-crimson` — FALSE-HARD

- key `krea2` · expect **advisory** · actual **hard** · grade OFFICIAL
- rule: 4 of 36 official prompts never name a medium at all (X2)
- source: research/_addenda/krea-character-art.md §2026-09-10 harvest, prompt #23 of 36 (77 words, no medium word)
- messages produced:
  - `does not lead with the medium — Krea 2 responds to medium-first prompts`

## Full message log

- `wan-gold-p1-en` [pass→pass] (clean)
- `wan-gold-p1-zh` [advisory→pass] (clean)
- `wan-gold-p2-en` [pass→pass] (clean)
- `wan-gold-p3-en` [pass→pass] (clean)
- `wan-gold-p3-zh` [pass→pass] (clean)
- `wan-gold-p7-en` [pass→hard] multiple camera moves — Wan follows one simple command at best
- `wan-gold-p7-zh` [pass→pass] (clean)
- `wan-viol-noneg` [hard→hard] missing "Negative prompt:" block
- `wan-viol-contradiction` [hard→hard] contradiction: fixed camera + camera-movement verbs in the same prompt | multiple camera moves — Wan follows one simple command at best
- `wan-viol-cinematic` [hard→hard] multiple camera moves — Wan follows one simple command at best | contains "cinematic" — triggers the Wan stylization branch; describe the look concretely
- `wan-adv-aes-en` [advisory→advisory] advisory: 8 front-loaded aesthetic tokens — the EN rewriter is instructed 不超过4种 while the ZH one has no cap, though the vendor's own English exemplar carries te
- `wan-adv-guwei` [advisory→pass] (clean)
- `wan-viol-bullets` [hard→hard] uses bullet points — Wan wants comma-separated phrases | multiple camera moves — Wan follows one simple command at best
- `wanI2V-gold-p4-en` [pass→pass] (clean)
- `wanI2V-gold-p4-zh` [pass→pass] (clean)
- `wanI2V-gold-motion-en` [pass→pass] (clean)
- `wanI2V-viol-over100` [hard→hard] over the official 100-word I2V cap (113 words) — motion content only
- `wanI2V-viol-zh-over100` [hard→pass] (clean)
- `wanI2V-viol-static-restate` [hard→hard] restates static content (appearance/scene/style) — the image already carries it
- `wanI2V-viol-noneg` [hard→hard] missing "Negative prompt:" block
- `wanI2V-viol-contradiction` [hard→hard] contradiction: fixed camera + camera-movement verbs in the same prompt
- `ltx-gold-p1` [pass→pass] (clean)
- `ltx-gold-p2` [pass→pass] (clean)
- `ltx-gold-p3` [pass→pass] (clean)
- `ltx-gold-p4` [pass→pass] (clean)
- `ltx-gold-p5-25single` [pass→pass] (clean)
- `ltx-gold-p6-multishot` [pass→hard] the request SEQUENCES events (then/after) but the output has no sequencing words — verify the order of events survived (timing words are physics)
- `ltx-gold-p7-dubit` [advisory→hard] too short (19 words) — a single shot is roughly 4-8 descriptive sentences
- `ltx-viol-negative` [hard→hard] contains a negative prompt — never required on the distilled path (dual-CFG guider at CFG 1.0, and the shipped template already hardcodes a six-token negative);
- `ltx-viol-linebreaks` [hard→hard] not a single paragraph (has line breaks)
- `ltx-viol-noaudio` [hard→hard] no explicit audio content — LTX audio is not automatic (name sounds, dialogue, or "no music")
- `ltx-viol-23-toolong` [hard→hard] too long (206 words) for LTX-2.3 — the README says "Keep within 200 words"
- `ltx-viol-cut-no-audio-continuity` [hard→hard] the request SEQUENCES events (then/after) but the output has no sequencing words — verify the order of events survived (timing words are physics) | a cut with no audio-continuity clause — state what the sound does across it ("the piano score continues across the cut" / "the dialogue drops; only wind remains
- `ltx-viol-oner-with-cut` [hard→hard] a cut with no audio-continuity clause — state what the sound does across it ("the piano score continues across the cut" / "the dialogue drops; only wind remains | the request asked for a single continuous take but the prompt names a cut
- `mm-gold-p1-en` [pass→pass] (clean)
- `mm-gold-p1-zh` [pass→pass] (clean)
- `mm-gold-p2` [pass→pass] (clean)
- `mm-gold-p3` [pass→pass] (clean)
- `mm-gold-h3-p5-vo` [pass→pass] (clean)
- `mm-gold-h3-p6-cut` [pass→pass] (clean)
- `mm-gold-h3-p7-ad` [pass→pass] (clean)
- `mm-gold-p9-two-speakers` [pass→pass] (clean)
- `mm-viol-arrow` [hard→hard] contains arrows/plus signs — H3 may render them as on-screen text
- `mm-viol-noshot1` [hard→hard] missing [Shot 1] opening
- `mm-viol-shot1-timestamp` [hard→hard] [Shot 1] carries a timestamp — cut times start at [Shot 2]
- `mm-viol-cutto` [hard→hard] [CUT TO] is not H3 syntax — use [Shot N] At MM:SS.mmm
- `mm-viol-weights` [hard→hard] uses (word:1.2) weighting — H3's tokenizer runs with disable_weights=True, so it is inert AND the parentheses can render as on-screen text
- `mm-viol-wildcard` [hard→hard] contains {a|b} — ComfyUI's wildcard expander eats it before the model sees it (dynamic_prompts=True)
- `mmref-gold-p4` [advisory→hard] advisory: both video and audio references — each reference video's soundtrack is a separate input whose <Audio j> is emitted BEFORE its <Video k>, so a standalo | detailed_description thin (54 words; official generation target 350-500)
- `mmref-gold-app-example` [advisory→hard] advisory: both video and audio references — each reference video's soundtrack is a separate input whose <Audio j> is emitted BEFORE its <Video k>, so a standalo | detailed_description thin (74 words; official generation target 350-500)
- `mmref-gold-p10-mixed` [advisory→advisory] advisory: both video and audio references — each reference video's soundtrack is a separate input whose <Audio j> is emitted BEFORE its <Video k>, so a standalo
- `mmref-gold-h3p8` [advisory→hard] detailed_description thin (92 words; official generation target 350-500)
- `mmref-viol-missing-section` [hard→hard] missing retention_analysis: section | retention_analysis has no relationship markers | detailed_description thin (28 words; official generation target 350-500)
- `mmref-viol-ordinal-gap` [hard→hard] <Picture> ordinals skip 2 while <Picture 3> is used — ordinals number the SUPPLIED assets 1-based per type, with no gaps (empty slots are never counted) | detailed_description thin (56 words; official generation target 350-500)
- `mmref-viol-cap` [hard→hard] <Video 4> exceeds the local cap (3) | detailed_description thin (48 words; official generation target 350-500)
- `mmref-viol-no-markers` [hard→hard] retention_analysis has no relationship markers | detailed_description thin (35 words; official generation target 350-500)
- `mmref-viol-weights` [hard→hard] uses (word:1.2) weighting — H3's tokenizer runs with disable_weights=True, so it is inert AND the parentheses can render as on-screen text | detailed_description thin (35 words; official generation target 350-500)
- `scail-gold-p1` [advisory→pass] (clean)
- `scail-gold-p2` [advisory→pass] (clean)
- `scail-gold-p3` [pass→pass] (clean)
- `scail-gold-p5-official` [pass→pass] (clean)
- `scail-gold-p6-anim-long` [pass→pass] (clean)
- `scail-gold-p7-bg-anchor` [pass→pass] (clean)
- `scail-viol-editverb` [hard→hard] uses edit-instruction words (replace/swap/edit/mask) — describe the FINAL video instead
- `scail-viol-banlist-official` [hard→pass] (clean)
- `scail-viol-chinese` [hard→hard] PROMPT should be English — the official enhancer outputs English
- `scail-viol-toolong` [advisory→hard] PROMPT too long (178 words; Replacement target 90-140, Animation less)
- `scail-viol-nomode` [hard→hard] missing MODE: field | uses edit-instruction words (replace/swap/edit/mask) — describe the FINAL video instead
- `sdxl-gold-p1` [pass→pass] (clean)
- `sdxl-gold-p2` [pass→pass] (clean)
- `sdxl-gold-p3` [pass→pass] (clean)
- `sdxl-gold-p4-text` [pass→pass] (clean)
- `sdxl-gold-p6-ragnarok` [pass→pass] (clean)
- `sdxl-gold-juggernaut-noneg` [pass→pass] (clean)
- `sdxl-viol-prose` [hard→hard] not comma-separated keywords — reads like prose
- `sdxl-viol-toolong` [hard→hard] too long (103 words) — CLIP reads ~75 tokens, trailing content fades
- `sdxl-viol-qualitypile` [hard→hard] quality-tag pile — 2 max on photoreal SDXL
- `sdxl-viol-weights` [hard→hard] too many (word:1.x) weights — 1-2 max, and they differ across UIs
- `anime-gold-p5-pony` [pass→pass] (clean)
- `anime-gold-p7-noobai` [pass→pass] (clean)
- `anime-gold-p8-illustrious` [advisory→hard] Illustrious: no Onoma card states any quality prefix — "masterpiece, best quality, amazing quality" is third-party LORE, not official
- `anime-gold-animagine` [pass→pass] (clean)
- `anime-adv-nofamily` [advisory→advisory] advisory: no checkpoint family detected (Pony V6 / Pony V7 / NoobAI / Illustrious / Animagine) — the family rules were skipped, and no quality scheme is portabl
- `anime-adv-pony-no-chain` [advisory→hard] Pony V6: missing the score chain — open "score_9, score_8_up, score_7_up..."
- `anime-viol-pony-quality` [hard→hard] Pony V6: masterpiece / best quality / amazing quality / high score / great score / hd / 8k are not Pony vocabulary
- `anime-viol-pony-two-source` [hard→hard] Pony V6: 2 source_* tags — exactly one
- `anime-viol-noobai-prefix` [hard→hard] NoobAI: missing the card prefix "masterpiece, best quality, newest, absurdres, highres, safe," (newest/recent/mid/early/old are PERIOD tags, never quality words
- `anime-viol-animagine-order` [hard→hard] Animagine: the count tag comes FIRST (1girl / 1boy / 1other) | Animagine: quality tags belong at the END — "masterpiece, high score, great score, absurdres" appear too early
- `anime-viol-vpred-karras` [hard→pass] (clean)
- `anime-viol-ponyv7-text` [hard→hard] advisory: Pony V7 permits score_* tags but never requires them — and no SDXL rule applies to it at all (AuraFlow: no CLIP-skip, no 77-token limit) | Pony V7: rendered text is out of scope for this checkpoint
- `flux-gold-p1-en` [pass→pass] (clean)
- `flux-gold-p1-zh` [pass→pass] (clean)
- `flux-gold-p2` [pass→pass] (clean)
- `flux-gold-p3` [pass→pass] (clean)
- `flux-gold-p4-text` [pass→pass] (clean)
- `flux-gold-p5-klein` [pass→pass] (clean)
- `flux-gold-p6-kleinbase` [pass→pass] (clean)
- `flux-viol-negative` [hard→hard] contains a negative prompt — distilled Flux runs CFG-free and ignores them (only klein Base supports negatives) | multiple blocks — one flowing paragraph
- `flux-viol-weights` [hard→hard] uses (word:1.x) weighting — Flux does not parse it
- `flux-viol-qualitytags` [hard→hard] quality meta-tags — noise on Flux (and long prompts collapse seed diversity)
- `flux-viol-negphrase` [hard→hard] negative phrasing ("no/without") — phrase positively (exception: "no other text")
- `flux-viol-blocks` [hard→hard] multiple blocks — one flowing paragraph
- `zimg-gold-p1-en` [pass→pass] (clean)
- `zimg-gold-p1-zh` [pass→pass] (clean)
- `zimg-gold-p2-en` [advisory→hard] too short (44 words, want 80-300 of concrete relational detail)
- `zimg-gold-p3-en` [pass→pass] (clean)
- `zimg-gold-p4-zh` [advisory→hard] thin for Z-Image (84 Han chars; aim 120-500)
- `zimg-gold-p5-zh` [pass→pass] (clean)
- `zimg-gold-p5-en` [pass→pass] (clean)
- `zimg-gold-p6-positive` [advisory→hard] too short (42 words, want 80-300 of concrete relational detail)
- `zimg-viol-negative` [hard→hard] contains a negative prompt — Z-Image-Turbo has no CFG (Base variant supports them) | too short (49 words, want 80-300 of concrete relational detail)
- `zimg-viol-metatags` [hard→hard] meta-tags — officially banned in Z-Image's prompt guide | too short (52 words, want 80-300 of concrete relational detail)
- `zimg-viol-zh-toolong` [hard→hard] too long (495 Han chars) — the default 512-token cap truncates the tail SILENTLY at roughly 450 Han characters; the vendor's own remedy is max_sequence_length=1
- `qwen-gold-p1-en` [advisory→hard] must either quote visible text exactly or state the image contains no recognizable text
- `qwen-gold-p1-zh` [advisory→hard] must either quote visible text exactly or state the image contains no recognizable text
- `qwen-gold-p2-en` [pass→pass] (clean)
- `qwen-gold-p4-zh-text` [pass→pass] (clean)
- `qwen-gold-p6-zh-infographic` [pass→pass] (clean)
- `qwen-gold-p6-en-infographic` [pass→pass] (clean)
- `qwen-gold-p8-en-antiai` [pass→pass] (clean)
- `qwen-gold-p7-edit` [pass→hard] missing "Negative prompt:" block
- `qwen-gold-p5-edit-multi` [pass→hard] missing "Negative prompt:" block | must either quote visible text exactly or state the image contains no recognizable text
- `qwen-viol-noneg` [hard→hard] missing "Negative prompt:" block
- `qwen-viol-magicsuffix` [hard→hard] contains the retired magic suffix — officially replaced by the negative list
- `qwen-viol-text-placeholder` [hard→hard] must either quote visible text exactly or state the image contains no recognizable text
- `qwen-viol-wrongneg` [hard→hard] negative prompt is not the official anti-AI-look Chinese list
- `krea-gold-p5-charart` [advisory→pass] (clean)
- `krea-gold-p7-official25` [advisory→pass] (clean)
- `krea-gold-p8-familyA` [advisory→hard] does not lead with the medium — Krea 2 responds to medium-first prompts | too long (199 words, want 80-140)
- `krea-gold-p9-flatcolour` [pass→pass] (clean)
- `krea-gold-official17-short` [advisory→hard] does not lead with the medium — Krea 2 responds to medium-first prompts | too short (10 words, want 80-140 of concrete description)
- `krea-gold-official30-pitchblack` [advisory→hard] does not lead with the medium — Krea 2 responds to medium-first prompts | background mentioned but not locked ("solid flat <color> background") — gradients and environments sneak in otherwise
- `krea-gold-official31-long` [advisory→hard] background mentioned but not locked ("solid flat <color> background") — gradients and environments sneak in otherwise | too long (180 words, want 80-140)
- `krea-gold-official23-crimson` [advisory→hard] does not lead with the medium — Krea 2 responds to medium-first prompts
- `krea-viol-negative` [hard→hard] contains a negative prompt — Krea 2 Turbo runs CFG-free in Krea's own CLI/diffusers and at CFG 1.0 in ComfyUI (not 0.0); the official Turbo card's own snippet u
- `krea-viol-weights` [hard→hard] uses (word:1.x) weighting — the stock Krea 2 tokenizer does not parse it at all, so "(red:1.3)" lands in the prompt as LITERAL TEXT; restate the color/element i
- `krea-viol-qualitytags` [hard→hard] quality meta-tags — noise on Krea 2 | too short (50 words, want 80-140 of concrete description)
- `krea-viol-over512` [hard→hard] too long (507 words, want 80-140) | HARD: 2861 characters is past the reference cap of 512 conditioning positions — Krea's own encoder truncates there and ComfyUI does not, so behaviour above it i
- `krea-adv-reference` [advisory→advisory] advisory: a reference image spends the SAME 512-position budget at (h/32)·(w/32)+2 tokens — one 1-megapixel reference is ~1026 tokens and exceeds the whole budg
- `scail-viol-over512` [hard→hard] PROMPT too long (472 words; Replacement target 90-140, Animation less)
- `flux-adv-complex-scene` [pass→pass] (clean)
- `flux-viol-past-encoder-cap` [hard→hard] too long (555 words) — length collapses seed diversity; local weights truncate at 512 tokens
