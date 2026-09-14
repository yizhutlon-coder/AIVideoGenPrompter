# Validator accuracy — measured, then fixed (2026-09-10)

**Scope.** `PromptStudio.html`'s `validate(key, text, intent)` only, plus its two helper regex
constants (`CAM_FIXED`, `CAM_MOVE`). Nothing else in the app was touched — the whole-file diff against
the pre-fix reconstruction lands entirely inside lines 1174–1505, i.e. the helper block and the
function body. No commits.

**Headline.** Against a 142-fixture labelled set built from OFFICIAL/STAFF/CREATOR rules and from
every `### Pair N` gold block in the corpus:

| | fixtures | correct | **false-hard** | **false-pass** | wrong-severity | accuracy |
|---|--:|--:|--:|--:|--:|--:|
| **before** | 142 | 112 | **21** (20 on OFFICIAL/gold) | **3** | 6 | 79% |
| **after** | 142 | 142 | **0** | **0** | **0** | 100% |

The pre-fix validator blocked **one in seven** of the vendors' own published prompts.

---

## 1. Method

### 1.1 Harness

`research/_addenda/validator-harness/` — three files, no network, `node` only.

- **`extract.mjs`** loads every `<script>` block of `PromptStudio.html` into a `node:vm` context with
  DOM/`window`/`localStorage`/`fetch`/timer stubs and `location.search = '?split'` (so the init IIFE
  returns early and no polling timers start), then lifts `validate`, `TARGETS`, `WAN_NEG`,
  `SDXL_NEG`, `QWENIMG_NEG` out of the context's lexical scope. `PS_APP=<path>` scores a different
  build of the app — that is how the "before" column above was produced against the *final* labels.
- **`fixtures.json`** — 142 labelled cases, `{key, id, text, expect, rule, source, grade, intent?}`.
  `{{WAN_NEG}}` / `{{SDXL_NEG}}` / `{{QWENIMG_NEG}}` placeholders are expanded from the app's own
  constants at run time, so a fixture can never drift from the string the app actually emits.
- **`run.mjs`** — runs everything, classifies, prints the per-model confusion table, every failure
  with the messages that produced it, and a full message log for diffing runs.

### 1.2 Severity model — and a finding about the contract

`validate()` returns a flat array of strings. The app's own stated contract
(`docs/CHANGELOG-2026-09-10.md` §Deviations 1) is that severity lives in the wording: `HARD: …`
blocking, `advisory: …` non-blocking.

**In the pre-fix build, exactly ONE message in the whole function carried `HARD:` and seven carried
`advisory:`; 98 of the 106 messages emitted across the fixture set carried no prefix at all.** Taken
literally, the documented classifier ("any `HARD:` → hard, else advisory") would have called almost
every error an advisory. It isn't one: `renderCheck()` renders an unprefixed message exactly like the
one `HARD:` message — a `⚠ N issues` badge plus a **Fix** button that re-runs the model to rewrite the
prompt. So the harness classifies:

- message starts with `advisory:` → **advisory** (non-blocking guidance)
- message starts with `HARD:` **or carries no prefix** → **blocking**
- no messages → **pass**

and a fixture's verdict is:

- **false-hard** — actual blocking, expected pass or advisory (*blocks a valid prompt*)
- **false-pass** — actual clean, expected blocking (*misses a real violation*)
- **wrong-severity** — any other mismatch

A comment block above `validate()` now states the convention in-source so future rules keep it. Every
rule I added or retiered uses an explicit prefix; the ~60 legacy blocking messages were left unprefixed
because the brief required the message style be preserved, and re-prefixing all of them would rewrite
every tooltip and every Fix-button prompt. **This remains the single largest structural gap: the tier
is inferable but not declared.**

### 1.3 Fixture provenance

Gold pairs were transcribed verbatim from the corpus and, where the app's output format requires it,
the official negative block was appended (`Negative prompt: {{WAN_NEG}}` etc.) so the fixture is what
the app would actually hand `validate()`. Violation fixtures were written only where an OFFICIAL,
STAFF or CREATOR-card rule exists; nothing was invented to make a rule look good.

| key | n | pass | advisory | hard | gold pairs drawn from |
|---|--:|--:|--:|--:|---|
| `wan` | 13 | 6 | 3 | 4 | `wan22.md` Pairs 1, 2, 3, 7 (EN+ZH) |
| `wanI2V` | 8 | 3 | 0 | 5 | `wan22.md` Pair 4 (EN+ZH) |
| `ltx` | 13 | 6 | 1 | 6 | `ltx23.md` Pairs 1–7 |
| `minimax` | 14 | 8 | 0 | 6 | `minimax-h3.md` Pairs 1–3, 9 · `h3-deep-dive.md` Pairs 5–7 |
| `minimaxref` | 9 | 0 | 4 | 5 | `minimax-h3.md` Pairs 4, 10 · `h3-deep-dive.md` Pair 8 · `TARGETS.minimaxref` example |
| `scail` | 12 | 4 | 3 | 5 | `scail2.md` Pairs 1, 2, 3, 5 (OFFICIAL template), 6, 7 |
| `sdxl` | 10 | 6 | 0 | 4 | `sdxl.md` Pairs 1–4, 6 |
| `sdxlAnime` | 12 | 3 | 3 | 6 | `sdxl.md` Pairs 5, 7, 8 |
| `flux` | 14 | 8 | 0 | 6 | `flux.md` Pairs 1–6 |
| `zimage` | 11 | 5 | 3 | 3 | `z-image.md` Pairs 1–6 |
| `qwenimg` | 13 | 7 | 2 | 4 | `qwen-image.md` Pairs 1, 2, 4, 5, 6, 7, 8 |
| `krea2` | 13 | 1 | 8 | 4 | `krea-character-art.md` Pairs 5, 7, 8, 9 + official harvest prompts #17, #23, #30, #31 |
| **total** | **142** | **57** | **27** | **58** | **77** transcribed gold/vendor prompts |

Counted from the file itself: **77** fixtures carry a `-gold-` id, i.e. a prompt transcribed verbatim
from a vendor surface or from the corpus's own `### Pair N` blocks; **95** cite a source graded
OFFICIAL / OFFICIAL-PATTERN; the rest are CREATOR-card dialects, SYNTHESIS gold, the app's own four
worked examples, and violation cases each traceable to a named OFFICIAL/STAFF line. **20** fixtures
contain Han characters (Wan T2V ×4, Wan I2V ×2, H3 ×1, SCAIL ×1, Z-Image ×3, Qwen-Image ×4, Flux ×1,
plus the ZH-only over-cap and wrong-negative cases).

Binding exclusions from `research/_addenda/verification-2026-09.md` were honoured: nothing marked
UNSUPPORTED or OVERSTATED was encoded as a rule. In particular **#43** (the orbit ban / 45° figure) has
a fixture that asserts `without orbiting` must *not* error, and **#40** (Wan's `不超过4种`) stays an
advisory whose own text says the vendor's English exemplar carries ten.

---

## 2. Before → after, per model

| key | n | before correct | before FH / FP / WS | after correct | after FH / FP / WS |
|---|--:|--:|---|--:|---|
| `wan` | 13 | 10 | 1 / 0 / 2 | 13 | 0 / 0 / 0 |
| `wanI2V` | 8 | 7 | 0 / 1 / 0 | 8 | 0 / 0 / 0 |
| `ltx` | 13 | 11 | 2 / 0 / 0 | 13 | 0 / 0 / 0 |
| `minimax` | 14 | 14 | 0 / 0 / 0 | 14 | 0 / 0 / 0 |
| `minimaxref` | 9 | 6 | 3 / 0 / 0 | 9 | 0 / 0 / 0 |
| `scail` | 12 | 8 | 1 / 1 / 2 | 12 | 0 / 0 / 0 |
| `sdxl` | 10 | 10 | 0 / 0 / 0 | 10 | 0 / 0 / 0 |
| `sdxlAnime` | 12 | 9 | 2 / 1 / 0 | 12 | 0 / 0 / 0 |
| `flux` | 14 | 14 | 0 / 0 / 0 | 14 | 0 / 0 / 0 |
| `zimage` | 11 | 8 | 3 / 0 / 0 | 11 | 0 / 0 / 0 |
| `qwenimg` | 13 | 9 | 4 / 0 / 0 | 13 | 0 / 0 / 0 |
| `krea2` | 13 | 6 | 5 / 0 / 2 | 13 | 0 / 0 / 0 |
| **total** | **142** | **112 (79%)** | **21 / 3 / 6** | **142 (100%)** | **0 / 0 / 0** |

Raw runs: `results-before.md`, `results-after.md` (both include the full message log).

**Read 100% honestly.** It measures conformance to *this* label set, and I both wrote the labels and
made the fixes. The load-bearing number is the one that cannot be tuned away by relabelling: **0
blocking messages on 84 pass/advisory fixtures, 77 of which are prompts the vendors or the corpus
published as correct.** Seven labels were corrected mid-run; every one is listed in §5 with its
reason, and the "before" column above was re-scored against the *corrected* labels on a reconstructed
pre-fix build, so the two columns are directly comparable.

---

## 3. The five worst pre-existing defects

1. **`CAM_MOVE` counted capture groups, not camera moves** (wan). `CAM_MOVE` has no `/g` flag and
   seven capture groups, so `pos.match(CAM_MOVE).length` was **always 8** whenever any camera verb
   appeared. Every Wan prompt containing a single camera move — including the corpus's OFFICIAL
   token-order exemplar, whose whole point is *one* move — was told "multiple camera moves". A
   one-line arithmetic bug that fired on the single most common Wan prompt shape.
2. **Krea 2's craft band was enforced as a format error.** `80–140 words` blocked prompts outside it,
   and `LEAD WITH THE MEDIUM` blocked anything whose first 60 characters lacked a medium word. Against
   the vendor's own 36 published `widget:` prompts (`krea-character-art.md` §2026-09-10 harvest) that
   band holds for **42%** and the medium rule for **67%**: Krea ships a 10-word prompt and a 230-word
   prompt in the same gallery. Five of the eight official Krea prompts I fixtured were blocked. The
   same rule also mis-fired on `pitch-black background` — one of the vendor's own background locks.
3. **`Illustrious: no Onoma card states any quality prefix` was an error, not a labelled suggestion.**
   `sdxl.md` §Validator changes says in as many words to mark it "a **suggestion labelled `[LORE]`**".
   The corpus's own Illustrious v3.5-vpred gold pair was blocked by it. Same shape on Pony V6's score
   chain, where the card's claim is a *strength* claim ("much weaker effect"), not a format rule.
4. **Qwen-Image had no edit mode**, so every edit prompt — including two OFFICIAL-PATTERN gold pairs,
   one of them a STAFF pattern — was blocked twice over for "missing Negative prompt:" and for not
   quoting text. The corpus asks for exactly this branch (`classify portrait|text|general|edit before
   validating`). The no-text sentinel also mis-fired on ordinary portraits, including the app's own
   few-shot example inside `TARGETS.qwenimg.system`.
5. **`detailed_description thin` blocked every H3 reference exemplar the corpus has** — 54, 74 and 92
   words against a floor of 120 — although `minimax-h3.md` says "**warn** below 300". The app's own
   worked example in `TARGETS.minimaxref.system` failed its own validator.

Runners-up: the Chinese half of Wan's I2V cap was never checked at all (100 *characters*, not 100
words — `FOLD-IN A22`); `art` was an unanchored alternative in Krea's medium regex, so `partially`
counted as an art medium; and the LTX length floor blocked the official Dub-It slot template.

---

## 4. Every rule changed

Format: **old → new**, with the evidence line that licenses the change.

### Helpers

| # | Change | Evidence |
|---|---|---|
| H1 | Added `CAM_MOVE_G` — the same alternation with `/g` and non-capturing groups — and switched the move *count* to it. `CAM_MOVE` itself keeps its `/i` form for `.test()`. Comment added warning never to `.length` the non-global one | Arithmetic bug; the corrected count is what `wan22.md` §Validator suggestions asks for ("warn on >2 distinct camera moves") |
| H2 | `CAM_MOVE` gained `复合运镜`; `CAM_FIXED` gained `固定镜头`, `镜头位置保持不动`, `fixed shot`, `locked-off` | `wan22.md` §Validator changes #3, verbatim ("add `环绕运镜\|复合运镜` to the conflicting-verb list"; "Accept `固定机位` and `镜头位置保持不动` as synonyms") |
| H3 | Severity-tier comment block added above `validate()` | `docs/CHANGELOG-2026-09-10.md` §Deviations 1 states the convention but nothing in the source did |

### Cross-model

| # | Old → new | Evidence |
|---|---|---|
| X1 | The intent-vs-output sequencing check tested the *output* with the same narrow regex as the intent → new `seqOutRe` also accepts `initially`, `a moment later`, `moments later`, `later,`, `subsequently`, `once …`, `finally`, `first,`, `second,`, `and only then`, `until`, `随后`, `最后` | `ltx23.md` Pair 6 NOTES: "Chronological connectives are the documented ones: *Initially…*, *A moment later…*" — the guide's own vocabulary was being read as *missing* sequencing |

### `wan`

| # | Old → new | Evidence |
|---|---|---|
| W1 | `too short (n words, want ~35-120)` / `too long …` **blocking** → `advisory:` on both ends, bands aligned to 35–140 EN and 60–200 Han | `wan22.md` §Validator suggestions, verbatim: "35–140 English words or 60–200 Han characters; **warn, do not fail**, outside band" |
| W2 | `multiple camera moves` fired on one move → now reports the real count and only above 2 | H1 |
| W3 | *(new)* `advisory:` when `固定机位` / `镜头位置保持不动` appears without `固定镜头` | `wan22.md` §Validator changes #3; `system-prompt-audit-2026-09-10.md` row I1 (阿里云 rev. 2026-09-02 verbatim 「通过"固定镜头"来强调」) |

### `wanI2V`

| # | Old → new | Evidence |
|---|---|---|
| I1 | Only the English 100-**word** cap was checked → added the Chinese 100-**character** cap as a separate blocking rule | `TARGETS.wanI2V.system` verbatim ("100 words in English, 100 characters in Chinese — the two official rewriters differ"); `FOLD-IN` A22 |

### `ltx`

| # | Old → new | Evidence |
|---|---|---|
| L1 | *(new)* Dub-It recognizer: a prompt matching `… speaking [Language/Accent], saying: "…"` is validated on its own rules (one speaker, quoted full target text, single line) and returns before the paragraph/length/audio rules, with one advisory naming the 2.3 routing and the syllable-timing requirement | `ltx23.md` §Validator changes **V14** verbatim: "Recognise the `[Speaker] is speaking [Language/Accent], saying: "[Dialogue]"` template and validate it separately … Route Dub-It intents to **2.3**" |
| L2 | `too short (<35 words)` blocking → `advisory:` | No word floor exists in the 2.5 guide; V6 replaces length with a sentence-count rule, which the function already enforces separately |

### `minimax` / `minimaxref`

| # | Old → new | Evidence |
|---|---|---|
| M1 | `detailed_description thin (<120)` / `too long (>560)` blocking → `advisory:` at the sourced thresholds **<300 / >550** | `minimax-h3.md` §Validator suggestions verbatim: "Full-reference generation: **warn** below 300 or above 550 English words; target 350–500" |

### `scail`

| # | Old → new | Evidence |
|---|---|---|
| S1 | *(new)* blocking on the official enhancer's own ban list: `the task is`, `Gemini`, `editing software`, `Photoshop`, `inpaint`, `prompt`, `分割`, `抠图`, `修图` | `scail2.md` §Validator changes **#3** ("Extend ban list to the official one … from enhancer rule 1 and rule 7"), `[OFFICIAL]` |
| S2 | `PROMPT too long (>160)` blocking → `advisory:`, plus a new `advisory:` **under 60 words**, both quoting the one 90–140 band for **both** modes | `scail2.md` §Validator changes **#1**: "Length target: 90–140 English words for BOTH modes. Retire the 'animation 15–60 words' rule. **Warn** under ~60 … **warn** over ~160"; `FOLD-IN` A19 |
| S3 | *(new)* `HARD:` above ~360 words / 2,000 characters — the `text_len = 512` UMT5 cap, using the staff 0.75 words/token conversion | `scail2.md` §Validator changes **#2**: "Hard cap: 512 UMT5 tokens (`text_len = 512`). **Block, don't warn**, above it" |

### `sdxlAnime`

| # | Old → new | Evidence |
|---|---|---|
| A1 | `Pony V6: missing the score chain` blocking → `advisory:` (both the absent-chain and the short-chain messages) | Pony V6 card's claim is a strength claim ("bare `score_9` has a much weaker effect"), and the same card endorses natural-language prompts; the corpus's rule is a quality-scheme recommendation, not a format check |
| A2 | `Illustrious: no Onoma card states any quality prefix` blocking → `advisory:` | `sdxl.md` §Validator changes, Illustrious block, verbatim: "mark `masterpiece, best quality, amazing quality` as a **suggestion labelled `[LORE]`**" |
| A3 | *(new)* blocking when a **v-pred** family is detected **and** the request names a **Karras** schedule; the message also names the other three changes a v-pred graph needs | `sdxl.md` §Validator changes, NoobAI v-pred block: "Scheduler MUST NOT be `karras` … — **error**, cite the card"; `FOLD-IN` D4 |

### `flux`

| # | Old → new | Evidence |
|---|---|---|
| F1 | `too short (<25)` blocking → `advisory:`; `too long (>160)` blocking → `advisory:` above **300** and blocking only above **360 words** (≈480 tokens of the `max_sequence_length=512` default) | `flux.md` §Validator changes: "Warn above **480 tokens** … Word-band targets stay 30–80 (medium) with **80–300 allowed for genuinely complex scenes**" |

### `zimage`

| # | Old → new | Evidence |
|---|---|---|
| Z1 | `too short (<55 words)` and `thin (<90 Han)` blocking → `advisory:`, band text corrected to 120–450 Han | `z-image.md` §Validator suggestions state *categories* ("subject, spatial relation, light/style"), never a floor; the only sourced mechanical limits are the 512/1024-token ones, which stay blocking |

### `qwenimg`

| # | Old → new | Evidence |
|---|---|---|
| Q1 | *(new)* **edit branch**: when the intent says edit, or the prompt opens with an edit imperative, or it indexes `image N` / `图N`, the negative-block and no-text rules are skipped and the edit shape is checked instead — a preservation clause is required, and >4 bullet constraints or >2 shouted negations are blocked | `qwen-image.md` §Validator suggestions ("Classify `portrait\|text\|general\|edit` before validating"); §Validator changes **#7** (one imperative + explicit preservation; reject bullet blocks and shouted negations) |
| Q2 | One rule `must either quote visible text exactly or state …` → split in two: **blocking** only when the prompt names a text carrier (sign/poster/label/menu/slide/海报/招牌…) and quotes nothing; otherwise **advisory** suggesting the sentinel | `qwen-image.md` §Validator suggestions ("reject vague placeholders"); the sentinel itself is an official-example convention, and the app's own `TARGETS.qwenimg` portrait example omits it |
| Q3 | Sentinel set extended to `图像中未出现其他文字`, `图像中未出现任何可识别文字`, `no other text`, `「…」` | `qwen-image.md` §Validator changes **#4** (X4) verbatim |

### `krea2`

| # | Old → new | Evidence |
|---|---|---|
| K1 | `too short (<55)` / `too long (>170)` blocking → `advisory:` outside 80–140, message quoting the measured vendor distribution (10–230 words, median 101.5, 42% inside the band) | `krea-character-art.md` §2026-09-10 harvest §Length distribution and contradiction **X1** |
| K2 | `does not lead with the medium` blocking, matched only in the first 60 chars, with an unanchored `art` alternative → `advisory:` in two flavours (no medium named anywhere / medium disclosed late), medium vocabulary widened to the words the vendor actually uses, `\bart…\b` anchored | Harvest **X2** ("named within the first 80 characters in 24/36 … never named at all in 4"); the `partially`-matches-`art` bug |
| K3 | `background mentioned but not locked` blocking, accepting only `solid`/`flat` → `advisory:`, accepting `plain`, `uniform`, `seamless`, `pitch-black`, `single-colour`, `monochromatic` | Harvest **C4**, which lists the vendor's own lock wordings verbatim, including `pitch-black background` and `plain white background` |
| — | The `HARD:` 2,500-character cap, the 1,400-character expander interlock and the reference-image advisory were already correct and are unchanged | `krea-character-art.md` §Validator changes; `FOLD-IN` D5 |

---

## 5. Fixtures I labelled wrong, and why

Seven labels were corrected once the run showed my prediction was not what the sources actually say.
Each is recorded in `fixtures.json` under a `relabelled` key.

| fixture | was → is | why |
|---|---|---|
| `wan-gold-p3-zh` | advisory → pass | I expected the 固定机位 advisory; the pair says 一镜到底 and carries no locked-camera token at all, so no rule applies |
| `wan-gold-p7-en` | advisory → pass | The `AES_EN` closed set counts **4** front-loaded tokens here, not 5: the pair opens `Edge lighting`, and the table contains `edge light` with a word boundary, so `edge lighting` does not match. The pair's NOTES count five by hand. **The regex and the corpus disagree on the count** — logged as a gap, not patched, because #40 already grades this band UNSUPPORTED |
| `ltx-gold-p6-multishot` | advisory → pass | At 200 words nothing fires once the sequencing vocabulary is widened |
| `ltx-gold-p7-dubit` | pass → advisory | The new Dub-It recognizer emits one informational advisory by design (route to 2.3, match syllable timing) |
| `scail-viol-toolong` | hard → advisory | `scail2.md` #1 says "**warn** over ~160". The blocking tier for SCAIL-2 length is the 512-token `text_len` cap (#2, "Block, don't warn"), now covered by a dedicated fixture |
| `zimg-gold-p4-zh` | pass → advisory | 84 Han characters is genuinely under the 120–450 band; the advisory is correct behaviour |
| `krea-gold-p5-charart` | pass → advisory | 149 words is genuinely outside 80–140; the advisory is correct behaviour |

Two fixture *texts* were also too short to exercise the rule they claimed to test
(`zimg-viol-zh-toolong` sat under 450 Han characters, `krea-viol-over512` under 2,500 characters) and
were lengthened. Three fixtures were added after the first run to cover newly-added blocking rules
(`scail-viol-over512`, `flux-adv-complex-scene`, `flux-viol-past-encoder-cap`).

---

## 6. Rules left advisory on purpose

These are all real, sourced rules that cannot be made mechanical without generating false positives on
prompts the vendors themselves publish. Each stays as `advisory:` text that names its own evidence.

| Rule | Why it cannot block |
|---|---|
| Wan `不超过4种` front-loaded aesthetic tokens (EN) | `verification-2026-09.md` **#40 UNSUPPORTED** — the vendor's own English exemplar carries ten. Settled only by **T4** |
| Wan / Z-Image / Krea / SCAIL / LTX / Flux length bands | Every source that states one says "warn, do not fail" (Wan, verbatim), or the vendor's published prompts straddle the band (Krea: 42% compliance), or no floor is documented at all (Z-Image, LTX 2.5) |
| Wan 固定机位 → 固定镜头 | A synonym the corpus explicitly says to *accept*; only the emitted token is a preference. **T5** tests whether the tokens differ at render time |
| Wan 运镜-vs-拍摄角度 exclusion, Wan mood-prose (氛围/感觉) | Already advisory; both are instructions to the vendor's *rewriter*, with no evidence about the model's own behaviour |
| Illustrious quality prefix, Pony V6 score ladder | Card wording is a strength claim or a third-party `[LORE]` convention, not a format requirement |
| H3 `detailed_description` 350–500 target | The source says "warn"; the corpus's own reference exemplars are teaching-length |
| H3 `<Video>` + `<Audio>` soundtrack-ordinal ambiguity | Depends on which assets are attached, which `validate()` cannot see |
| Krea medium-first, background lock, expander interlock, reference budget | Falsified as absolutes by the 36-prompt harvest (X2, C4) or depend on graph state (`prompt_enhance`, attachments) the function cannot read |
| Krea/LTX "every sentence must add concrete visual or audio detail" | Not machine-checkable; carried in message text only |
| Qwen no-text sentinel on prompts with no text carrier | An official-example convention; the app's own worked example omits it |

---

## 7. Known gaps — need renders, not code

Nothing below can be settled by static analysis. All are already specified in
`research/_addenda/test-kit-2026-09.md`; the validator quotes the uncertainty rather than resolving it.

- **T4 — Wan's four-aesthetic-token cap.** Whether >4 front-loaded tokens degrades anything, or is
  purely a rewriter instruction. Until then the rule stays advisory *and* the token-counting table
  disagrees with the corpus's hand count on the vendor's own exemplar (see §5, `wan-gold-p7-en`).
- **T5 — Wan camera vocabulary.** `固定镜头` vs `固定机位` vs "static shot", and arc vs orbit. Decides
  whether W3 is a preference or a real token effect.
- **T6 — Krea 2's length cliff.** Only one controlled report exists (clean at 576 positions, pure
  black at 640). The `HARD:` 2,500-character rule is the reference cap plus a character proxy, not a
  measured failure point.
- **T2 — negative-prompt inertness** (LTX distilled, Z-Image Turbo, Krea 2). The blocking
  negative-prompt rules on those three keys rest on CFG-1.0/guidance-0 architecture, not on a render
  showing the negative does nothing.
- **Tokenizer-free counting.** Every token rule (Z-Image 512/1024, Flux 480, SCAIL 512, Krea 512, H3's
  unpublished segment limit) uses the staff 0.75 words/token conversion or a character proxy. A real
  tokenizer in the harness would make all of them exact; none of the four tokenizers ships offline.
- **Graph-state rules.** Frame grids, resolutions, schedulers, CLIP-skip, `prompt_enhance`, attached
  references — `validate()` sees only prompt text and the user's request line. These live in
  `wfNotes()` / `KNOWLEDGE` and are out of this function's reach by design. The one exception now
  bridged is the v-pred/Karras pair (A3), because the user names the sampler in their request.

---

## 8. How to re-run

```bash
cd research/_addenda/validator-harness

node extract.mjs                       # smoke test: prints validate('wan','test') as an array
node run.mjs                           # full report to stdout
node run.mjs --save results-after.md   # …and write it next to the fixtures
node run.mjs --key krea2               # one model key
node run.mjs --id krea-gold-p7-official25
PS_APP=/path/to/other/PromptStudio.html node run.mjs   # score a different build
```

Syntax check after any edit to the app (this is what gates a change here):

```bash
node -e "const fs=require('fs');const h=fs.readFileSync('PromptStudio.html','utf8');\
[...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].forEach((m,i)=>{new Function(m[1]);console.log('script',i,'OK')})"
```

Last run: `script 0 OK`, `script 1 OK`; 142/142 fixtures correct; 0 false-hard, 0 false-pass,
0 wrong-severity.

**When adding a rule:** add its fixture *first*, with the `source` field quoting the line that
licenses it, then make the rule pass. If the source says "warn", the message must start with
`advisory:`. If it says "error" / "block, don't warn", it must not.
