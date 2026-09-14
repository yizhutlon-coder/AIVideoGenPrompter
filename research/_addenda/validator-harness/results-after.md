# Validator accuracy run — 2026-09-10

Fixtures: **142** across **12** model keys. validate() threw on **0**.

Message-prefix census (the stated contract is `HARD:` / `advisory:`): `HARD:` **2** · `advisory:` **50** · **no prefix 62** (unprefixed messages are counted as blocking, because `renderCheck()` renders them identically to a hard error).

## Confusion by model key

| key | n | correct | false-hard | false-pass | wrong-severity | accuracy |
|---|--:|--:|--:|--:|--:|--:|
| `wan` | 13 | 13 | 0 | 0 | 0 | 100% |
| `wanI2V` | 8 | 8 | 0 | 0 | 0 | 100% |
| `ltx` | 13 | 13 | 0 | 0 | 0 | 100% |
| `minimax` | 14 | 14 | 0 | 0 | 0 | 100% |
| `minimaxref` | 9 | 9 | 0 | 0 | 0 | 100% |
| `scail` | 12 | 12 | 0 | 0 | 0 | 100% |
| `sdxl` | 10 | 10 | 0 | 0 | 0 | 100% |
| `sdxlAnime` | 12 | 12 | 0 | 0 | 0 | 100% |
| `flux` | 14 | 14 | 0 | 0 | 0 | 100% |
| `zimage` | 11 | 11 | 0 | 0 | 0 | 100% |
| `qwenimg` | 13 | 13 | 0 | 0 | 0 | 100% |
| `krea2` | 13 | 13 | 0 | 0 | 0 | 100% |
| **total** | **142** | **142** | **0** | **0** | **0** | **100%** |

- **false-hard** (blocks a prompt that is valid or only worth an advisory): **0** of 142 — of which **0** are on OFFICIAL / gold-pair fixtures.
- **false-pass** (misses a real, sourced violation entirely): **0**.
- **wrong-severity** (right that something is off, wrong tier): **0**.

Label distribution — expect `pass` 57 · `advisory` 27 · `hard` 58.

## Failures (0)

_None._
## Full message log

- `wan-gold-p1-en` [pass→pass] (clean)
- `wan-gold-p1-zh` [advisory→advisory] advisory: 固定机位 / 镜头位置保持不动 are accepted synonyms, but the 阿里云 guide (rev. 2026-09-02) says 通过"固定镜头"来强调 — emit 固定镜头
- `wan-gold-p2-en` [pass→pass] (clean)
- `wan-gold-p3-en` [pass→pass] (clean)
- `wan-gold-p3-zh` [pass→pass] (clean)
- `wan-gold-p7-en` [pass→pass] (clean)
- `wan-gold-p7-zh` [pass→pass] (clean)
- `wan-viol-noneg` [hard→hard] missing "Negative prompt:" block
- `wan-viol-contradiction` [hard→hard] contradiction: fixed camera + camera-movement verbs in the same prompt
- `wan-viol-cinematic` [hard→hard] contains "cinematic" — triggers the Wan stylization branch; describe the look concretely
- `wan-adv-aes-en` [advisory→advisory] advisory: 8 front-loaded aesthetic tokens — the EN rewriter is instructed 不超过4种 while the ZH one has no cap, though the vendor's own English exemplar carries te
- `wan-adv-guwei` [advisory→advisory] advisory: 固定机位 / 镜头位置保持不动 are accepted synonyms, but the 阿里云 guide (rev. 2026-09-02) says 通过"固定镜头"来强调 — emit 固定镜头
- `wan-viol-bullets` [hard→hard] uses bullet points — Wan wants comma-separated phrases
- `wanI2V-gold-p4-en` [pass→pass] (clean)
- `wanI2V-gold-p4-zh` [pass→pass] (clean)
- `wanI2V-gold-motion-en` [pass→pass] (clean)
- `wanI2V-viol-over100` [hard→hard] over the official 100-word I2V cap (113 words) — motion content only
- `wanI2V-viol-zh-over100` [hard→hard] over the official 100-character I2V cap (139 字) — the ZH rewriter caps characters, not words; motion content only
- `wanI2V-viol-static-restate` [hard→hard] restates static content (appearance/scene/style) — the image already carries it
- `wanI2V-viol-noneg` [hard→hard] missing "Negative prompt:" block
- `wanI2V-viol-contradiction` [hard→hard] contradiction: fixed camera + camera-movement verbs in the same prompt
- `ltx-gold-p1` [pass→pass] (clean)
- `ltx-gold-p2` [pass→pass] (clean)
- `ltx-gold-p3` [pass→pass] (clean)
- `ltx-gold-p4` [pass→pass] (clean)
- `ltx-gold-p5-25single` [pass→pass] (clean)
- `ltx-gold-p6-multishot` [pass→pass] (clean)
- `ltx-gold-p7-dubit` [advisory→advisory] advisory: recognised as the official Dub-It slot template — the paragraph, length and audio rules do not apply; match the syllable count and timing of the origi
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
- `mmref-gold-p4` [advisory→advisory] advisory: both video and audio references — each reference video's soundtrack is a separate input whose <Audio j> is emitted BEFORE its <Video k>, so a standalo | advisory: detailed_description is 54 words — the official generation target is 350-500 (warn below 300); a short one still validates, it just under-specifies th
- `mmref-gold-app-example` [advisory→advisory] advisory: both video and audio references — each reference video's soundtrack is a separate input whose <Audio j> is emitted BEFORE its <Video k>, so a standalo | advisory: detailed_description is 74 words — the official generation target is 350-500 (warn below 300); a short one still validates, it just under-specifies th
- `mmref-gold-p10-mixed` [advisory→advisory] advisory: both video and audio references — each reference video's soundtrack is a separate input whose <Audio j> is emitted BEFORE its <Video k>, so a standalo | advisory: detailed_description is 134 words — the official generation target is 350-500 (warn below 300); a short one still validates, it just under-specifies t
- `mmref-gold-h3p8` [advisory→advisory] advisory: detailed_description is 92 words — the official generation target is 350-500 (warn below 300); a short one still validates, it just under-specifies th
- `mmref-viol-missing-section` [hard→hard] missing retention_analysis: section | retention_analysis has no relationship markers | advisory: detailed_description is 28 words — the official generation target is 350-500 (warn below 300); a short one still validates, it just under-specifies th
- `mmref-viol-ordinal-gap` [hard→hard] <Picture> ordinals skip 2 while <Picture 3> is used — ordinals number the SUPPLIED assets 1-based per type, with no gaps (empty slots are never counted) | advisory: detailed_description is 56 words — the official generation target is 350-500 (warn below 300); a short one still validates, it just under-specifies th
- `mmref-viol-cap` [hard→hard] <Video 4> exceeds the local cap (3) | advisory: detailed_description is 48 words — the official generation target is 350-500 (warn below 300); a short one still validates, it just under-specifies th
- `mmref-viol-no-markers` [hard→hard] retention_analysis has no relationship markers | advisory: detailed_description is 35 words — the official generation target is 350-500 (warn below 300); a short one still validates, it just under-specifies th
- `mmref-viol-weights` [hard→hard] uses (word:1.2) weighting — H3's tokenizer runs with disable_weights=True, so it is inert AND the parentheses can render as on-screen text | advisory: detailed_description is 35 words — the official generation target is 350-500 (warn below 300); a short one still validates, it just under-specifies th
- `scail-gold-p1` [advisory→advisory] advisory: PROMPT is 35 words — the README says long detailed prompts beat short ones, and the enhancer band is 90-140 for BOTH modes (the old "animation 15-60 w
- `scail-gold-p2` [advisory→advisory] advisory: PROMPT is 51 words — the README says long detailed prompts beat short ones, and the enhancer band is 90-140 for BOTH modes (the old "animation 15-60 w
- `scail-gold-p3` [pass→pass] (clean)
- `scail-gold-p5-official` [pass→pass] (clean)
- `scail-gold-p6-anim-long` [pass→pass] (clean)
- `scail-gold-p7-bg-anchor` [pass→pass] (clean)
- `scail-viol-editverb` [hard→hard] uses edit-instruction words (replace/swap/edit/mask) — describe the FINAL video instead | advisory: PROMPT is 37 words — the README says long detailed prompts beat short ones, and the enhancer band is 90-140 for BOTH modes (the old "animation 15-60 w
- `scail-viol-banlist-official` [hard→hard] uses the official enhancer's banned vocabulary (the task is / Gemini / editing software / Photoshop / inpaint / prompt / 分割 / 抠图 / 修图) — the PROMPT is a descrip | advisory: PROMPT is 47 words — the README says long detailed prompts beat short ones, and the enhancer band is 90-140 for BOTH modes (the old "animation 15-60 w
- `scail-viol-chinese` [hard→hard] advisory: PROMPT is 1 words — the README says long detailed prompts beat short ones, and the enhancer band is 90-140 for BOTH modes (the old "animation 15-60 wo | PROMPT should be English — the official enhancer outputs English
- `scail-viol-toolong` [advisory→advisory] advisory: PROMPT is 178 words — over the ~160 warn line for the 90-140 band
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
- `anime-gold-p8-illustrious` [advisory→advisory] advisory: Illustrious — no Onoma card states any quality prefix, so "masterpiece, best quality, amazing quality" is third-party LORE, not official. Keep it if i
- `anime-gold-animagine` [pass→pass] (clean)
- `anime-adv-nofamily` [advisory→advisory] advisory: no checkpoint family detected (Pony V6 / Pony V7 / NoobAI / Illustrious / Animagine) — the family rules were skipped, and no quality scheme is portabl
- `anime-adv-pony-no-chain` [advisory→advisory] advisory: Pony V6 without the score chain — open "score_9, score_8_up, score_7_up, score_6_up, score_5_up, score_4_up"; the card calls the ladder its quality sc
- `anime-viol-pony-quality` [hard→hard] Pony V6: masterpiece / best quality / amazing quality / high score / great score / hd / 8k are not Pony vocabulary
- `anime-viol-pony-two-source` [hard→hard] Pony V6: 2 source_* tags — exactly one
- `anime-viol-noobai-prefix` [hard→hard] NoobAI: missing the card prefix "masterpiece, best quality, newest, absurdres, highres, safe," (newest/recent/mid/early/old are PERIOD tags, never quality words
- `anime-viol-animagine-order` [hard→hard] Animagine: the count tag comes FIRST (1girl / 1boy / 1other) | Animagine: quality tags belong at the END — "masterpiece, high score, great score, absurdres" appear too early
- `anime-viol-vpred-karras` [hard→hard] v-pred checkpoint with a Karras schedule — the card is explicit that Karras must not be used; switch to Euler (or DDIM), and fix the rest of the v-pred graph to
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
- `zimg-gold-p2-en` [advisory→advisory] advisory: short for Z-Image (44 words; the guide asks for 80-300 of concrete relational detail) — no word floor is documented, so check the categories instead: 
- `zimg-gold-p3-en` [pass→pass] (clean)
- `zimg-gold-p4-zh` [advisory→advisory] advisory: thin for Z-Image (84 Han chars; aim 120-450) — no floor is documented, the guide asks for concrete relational categories rather than a length
- `zimg-gold-p5-zh` [pass→pass] (clean)
- `zimg-gold-p5-en` [pass→pass] (clean)
- `zimg-gold-p6-positive` [advisory→advisory] advisory: short for Z-Image (42 words; the guide asks for 80-300 of concrete relational detail) — no word floor is documented, so check the categories instead: 
- `zimg-viol-negative` [hard→hard] contains a negative prompt — Z-Image-Turbo has no CFG (Base variant supports them) | advisory: short for Z-Image (49 words; the guide asks for 80-300 of concrete relational detail) — no word floor is documented, so check the categories instead: 
- `zimg-viol-metatags` [hard→hard] meta-tags — officially banned in Z-Image's prompt guide | advisory: short for Z-Image (52 words; the guide asks for 80-300 of concrete relational detail) — no word floor is documented, so check the categories instead: 
- `zimg-viol-zh-toolong` [hard→hard] too long (495 Han chars) — the default 512-token cap truncates the tail SILENTLY at roughly 450 Han characters; the vendor's own remedy is max_sequence_length=1
- `qwen-gold-p1-en` [advisory→advisory] advisory: no quoted text and no no-text sentinel — the official rewriter's own examples close with "The image contains no recognizable text." / 图像中未出现其他文字。 so t
- `qwen-gold-p1-zh` [advisory→advisory] advisory: no quoted text and no no-text sentinel — the official rewriter's own examples close with "The image contains no recognizable text." / 图像中未出现其他文字。 so t
- `qwen-gold-p2-en` [pass→pass] (clean)
- `qwen-gold-p4-zh-text` [pass→pass] (clean)
- `qwen-gold-p6-zh-infographic` [pass→pass] (clean)
- `qwen-gold-p6-en-infographic` [pass→pass] (clean)
- `qwen-gold-p8-en-antiai` [pass→pass] (clean)
- `qwen-gold-p7-edit` [pass→pass] (clean)
- `qwen-gold-p5-edit-multi` [pass→pass] (clean)
- `qwen-viol-noneg` [hard→hard] missing "Negative prompt:" block
- `qwen-viol-magicsuffix` [hard→hard] contains the retired magic suffix — officially replaced by the negative list
- `qwen-viol-text-placeholder` [hard→hard] the image is described as carrying text but no exact string is quoted — transcribe EVERY visible string verbatim in quotes with its carrier, position, font styl
- `qwen-viol-wrongneg` [hard→hard] negative prompt is not the official anti-AI-look Chinese list
- `krea-gold-p5-charart` [advisory→advisory] advisory: 149 words — over the 80-140 craft band, though 9 of the vendor's own 36 published prompts are longer (max 230); what actually binds is the 512-positio
- `krea-gold-p7-official25` [advisory→advisory] advisory: 60 words — the app's craft band is 80-140, but the vendor's own 36 published prompts run 10-230 words (median 101.5, 12 of them under 80), so short is
- `krea-gold-p8-familyA` [advisory→advisory] advisory: the medium is disclosed late (49% through the prompt) — the vendor does this too (its family-A house format discloses the medium at ~64% and pushes st | advisory: 199 words — over the 80-140 craft band, though 9 of the vendor's own 36 published prompts are longer (max 230); what actually binds is the 512-positio
- `krea-gold-p9-flatcolour` [pass→pass] (clean)
- `krea-gold-official17-short` [advisory→advisory] advisory: no medium named anywhere — 4 of the vendor's 36 published prompts do the same, so this is not an error, but naming the medium ("a stylized digital pai | advisory: 10 words — the app's craft band is 80-140, but the vendor's own 36 published prompts run 10-230 words (median 101.5, 12 of them under 80), so short is
- `krea-gold-official30-pitchblack` [advisory→advisory] advisory: the medium is disclosed late (99% through the prompt) — the vendor does this too (its family-A house format discloses the medium at ~64% and pushes st
- `krea-gold-official31-long` [advisory→advisory] advisory: 180 words — over the 80-140 craft band, though 9 of the vendor's own 36 published prompts are longer (max 230); what actually binds is the 512-positio
- `krea-gold-official23-crimson` [advisory→advisory] advisory: no medium named anywhere — 4 of the vendor's 36 published prompts do the same, so this is not an error, but naming the medium ("a stylized digital pai | advisory: 79 words — the app's craft band is 80-140, but the vendor's own 36 published prompts run 10-230 words (median 101.5, 12 of them under 80), so short is
- `krea-viol-negative` [hard→hard] contains a negative prompt — Krea 2 Turbo runs CFG-free in Krea's own CLI/diffusers and at CFG 1.0 in ComfyUI (not 0.0); the official Turbo card's own snippet u | advisory: 57 words — the app's craft band is 80-140, but the vendor's own 36 published prompts run 10-230 words (median 101.5, 12 of them under 80), so short is
- `krea-viol-weights` [hard→hard] uses (word:1.x) weighting — the stock Krea 2 tokenizer does not parse it at all, so "(red:1.3)" lands in the prompt as LITERAL TEXT; restate the color/element i | advisory: 64 words — the app's craft band is 80-140, but the vendor's own 36 published prompts run 10-230 words (median 101.5, 12 of them under 80), so short is
- `krea-viol-qualitytags` [hard→hard] quality meta-tags — noise on Krea 2 | advisory: 50 words — the app's craft band is 80-140, but the vendor's own 36 published prompts run 10-230 words (median 101.5, 12 of them under 80), so short is
- `krea-viol-over512` [hard→hard] advisory: 507 words — over the 80-140 craft band, though 9 of the vendor's own 36 published prompts are longer (max 230); what actually binds is the 512-positio | HARD: 2861 characters is past the reference cap of 512 conditioning positions — Krea's own encoder truncates there and ComfyUI does not, so behaviour above it i
- `krea-adv-reference` [advisory→advisory] advisory: a reference image spends the SAME 512-position budget at (h/32)·(w/32)+2 tokens — one 1-megapixel reference is ~1026 tokens and exceeds the whole budg
- `scail-viol-over512` [hard→hard] advisory: PROMPT is 472 words — over the ~160 warn line for the 90-140 band | HARD: PROMPT is 472 words / 2858 characters — at the staff conversion of 0.75 words per token that is at or past text_len = 512 UMT5 tokens, where SCAIL-2 silen
- `flux-adv-complex-scene` [pass→pass] (clean)
- `flux-viol-past-encoder-cap` [hard→hard] advisory: 555 words — 30-80 is the official ideal and 80-300 is allowed for genuinely complex multi-object scenes; extra length does not improve quality, it col | too long (555 words) — past ~480 tokens of the diffusers/ComfyUI default max_sequence_length=512, where the tail is truncated SILENTLY (BFL's "32K tokens" is a 
