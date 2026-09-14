# Adversarial verification — 2026-09-10 round (round 2 verifier)

**Purpose: break today's work before a second apply pass consumes it.** Successor to
[`verification-2026-09.md`](verification-2026-09.md) (2026-09-03), whose
*"Items the synthesis agent must NOT fold in"* list (34 entries) is treated here as **binding** and is
used as a filter on everything produced today.

Files under verdict (all dated 2026-09-10):
`research/_addenda/system-prompt-audit-2026-09-10.md` (12 proposed replacement system prompts) ·
`research/qwen-image.md` §*2026-09-10 sweep* · `research/_addenda/krea-character-art.md`
§*2026-09-10 official prompt-pair harvest* · `research/digests/2026-09-10-digest.md` ·
`research/_addenda/template-picker-audit-2026-09-10.md` · `docs/CHANGELOG-2026-09-10.md` ·
the live `PromptStudio.html`.

This file **adds nothing to the corpus** and edits nothing. It records verdicts.
Written incrementally; if it ends mid-section the remaining sections were not reached.

---

## Method & coverage

**Sampling frame.** 52 numbered claims, stratified to the brief's minima and biased toward claims that
would change the app if true (system-prompt instructions, length caps, licence terms, picker facts,
validator numbers).

| Stratum (brief minimum) | Claims sampled |
|---|---|
| system-prompt-audit CONTRADICTED / MISSING rows (≥12) | 14 |
| Qwen-Image 2026-09-10 sweep (≥8) | 9 |
| Krea 2026-09-10 harvest (≥6) | 7 |
| 2026-09-10 digest (≥6) | 6 |
| Template/picker audit (≥8) | 9 |
| Applied app edits (≥5) | 7 |
| **Total** | **52** |

Plus: a per-model **system-prompt gate** over all 12 proposed replacement prompts (every changed
instruction ruled ALLOW / ALLOW-AS-ADVISORY / BLOCK / NEEDS-RENDER), an internal-consistency pass
across today's six files, and a 10-item applied-edit audit against `PromptStudio.html`.

**Verdict vocabulary.** **CONFIRMED** · **OVERSTATED** (real but claimed beyond the evidence) ·
**UNSUPPORTED** (no evidence at the cited source) · **STALE** · **MISLABELLED** (wrong evidence grade
or wrong scope label) · **UNREACHABLE** · **NOT RE-FETCHED** (sampled, out of budget — recorded so
nobody assumes it was checked).

**Surfaces re-fetched today (2026-09-10):** `raw.githubusercontent.com` (Qwen-Image
`prompt_utils_2512.py`, read in full and byte-checked), `huggingface.co/api/models?search=…`,
`modelscope.cn/api/v1/models/…`, `docs.comfy.org`, `huggingface.co/<repo>/raw/<ref>/README.md`.
**Not attempted** (standing refusals in `RESEARCH-PLAN-2026-09.md` rule 7): civitai.com, civitai.red,
Reddit, Discord, web.archive.org. No absence claim in this file depends on them.

**Read locally, in full:** all six of today's outputs, `verification-2026-09.md`, and the live
`PromptStudio.html` (`TARGETS`, `KNOWLEDGE`, `GOTCHAS`, `validate()`, `wfNotes`, the model picker,
`SDXL_NEG` / `WAN_NEG` / `QWENIMG_NEG`).

### The one methodological problem that affects the whole round

**The system-prompt audit and the Qwen-Image sweep were run in parallel and disagree about
Qwen-Image, and the audit lost.** The audit states, in its own Sources block:

> ⚠ Its `## 2026-09-10 sweep` section is entirely `_(pending)_` at the time of this audit

so its entire `qwenimg` chapter (10 MISSING rows, 17 changes, a full replacement prompt) was written
against the **2026-08-28 cn-sweep** and never saw the primary-source read that landed the same day.
Two of its proposed instructions are contradicted by that read (claims #7 and #8 below). The apply
pass must reconcile, not merge.

---

## Claim-by-claim table

| # | File : heading | Claim | Label as written | Verdict | Reason + verbatim excerpt where it differs |
|---|---|---|---|---|---|
| 1 | qwen-image : D1 | `magic_prompt` is assigned but never concatenated in `prompt_utils_2512.py`, both `polish_prompt_en` and `polish_prompt_zh` | `[OFFICIAL]` | **CONFIRMED** | Re-fetched the file in full. `magic_prompt = "Ultra HD, 4K, cinematic composition"` then `return polished_prompt` — no reference between them; ZH identical with `magic_prompt = "超清，4K，电影级构图"`. Byte-exact |
| 2 | qwen-image : D2 | 2512 EN `polish_prompt_en` rule 7 is *"Maintain conciseness: aim for a succinct description, ideally around 200 words…"* and it sits **inside Subtask 1 (Portrait)** | `[OFFICIAL]` | **CONFIRMED** | Verbatim, numbered 7 under `## Subtask 1: Portrait Image Rewriting`. Core Requirements 1–5, Subtask 2 and Subtask 3 carry **no** length rule — verified by reading all three subtasks |
| 3 | qwen-image : D2 | 2512 ZH rule 7 is 「**内容篇幅保持克制**：人像场景下，改写/扩写的内容篇幅保持简洁，输出控制在150字以内。」 | `[OFFICIAL]` | **CONFIRMED** | Byte-exact, also under 子任务一 (portrait). The sweep's own gloss "roughly 90–110 English words of content" is an **unmeasured estimate** and should be marked SYNTHESIS |
| 4 | qwen-image : D3 | EN Core Requirement 1 carries an infographic carve-out (line breaks + hyphen-led descriptive sentences); ZH Core Requirement 1 is absolute 「禁止使用列表、编号、标题或任何结构化格式」 | `[OFFICIAL]` | **CONFIRMED** | Both quoted verbatim and byte-exact. The EN Subtask-2 examples do contain literal `\n` + `- ` lines (`"Top Section:\n- On the left, a group of five illustrated people labeled …"`) |
| 5 | qwen-image : D4 | ZH rule 6 is a hard order; EN rule 6 is a *"Recommended Description Flow"* with an explicit override | `[OFFICIAL]` | **CONFIRMED** | EN verbatim: *"However, always prioritize a natural narrative over this rigid structure; adapt the order as needed to create a more compelling and readable description."* ZH verbatim: 「人像场景中输出先后顺序按照上述说明。」 |
| 6 | qwen-image : D5 | The app's ZH sentinel `无其他文字。` matches neither the ZH rule string nor the ZH example string | `[OFFICIAL]` | **CONFIRMED, and the sweep undercounts** | Rule string 「图像中未出现任何可识别文字」; 子任务二 examples end 「图像中未出现其他文字。」; the 子任务三 example ends 「**图像中未出现任何文字或人像。**」 — a **third** official form the sweep does not record. Any "use the official string" instruction must say which of three |
| 7 | system-prompt-audit : qwenimg Q1 / proposed text | *"English targets about 200 words of direct, specific prose; Chinese portraits are capped at 150 characters"* — presented as a **language** split | `[OFFICIAL]` | **OVERSTATED — reproduces the exact defect it was written to fix** | Both numbers are **portrait-scoped**. The EN 200 is Subtask-1 rule 7 (claim #2); text-containing and general images have no length rule in either language. The audit's own file calls the app's global "about 200 words" a defect (`qwenimg` row 4 "INCOMPLETE overall") and then ships a replacement that is global for English. `qwen-image.md` X1 gets this right; the audit does not |
| 8 | system-prompt-audit : qwenimg Q6 / proposed text | *"Portraits, in this order: ethnicity → gender → age … → background and light"* as a hard rule | `[OFFICIAL]` | **OVERSTATED (scope)** | That chain is the **Chinese** rewriter's rule 6. The English rewriter labels the same flow *"Recommended"* and overrides it explicitly (claim #5). The audit's proposed prompt emits English by default for non-Chinese input, so it hardens a rule the vendor deliberately softened for that branch. `qwen-image.md` X2 states the correct form ("keep the order as the default, add 'prefer a natural sentence order…' for English output only") |
| 9 | system-prompt-audit : qwenimg Q12 / proposed text | *"the official rewriter defines that suffix but never actually appends it; it is dead code"* | corrects a CONTRADICTED claim | **OVERSTATED (scope)** | True of `prompt_utils_2512.py` only (claim #1). Per `qwen-image.md` D1 the legacy `prompt_utils.py` still does `return polished_prompt + magic_prompt` and the README base-Qwen-Image snippet still passes `prompt + positive_magic["en"]`. The audit replaces one absolute ("officially retired") with another ("dead code"). The correct statement is the sweep's: *"dropped for 2512; still appended by base Qwen-Image."* **Legacy file NOT RE-FETCHED by me** |
| 10 | qwen-image : §STAFF, role evidence | `X-niper` = Xiangyu Fan, Lightning first author; `lightx2v` carries an **Owner** badge; `keizez3` graded `[STAFF-probable]` | `[STAFF]` | **CONFIRMED as method, NOT RE-FETCHED as fact** | The role-evidence chain (citation block → GitHub profile title → HF Owner badge) is the method the 09-03 verifier validated end-to-end (#58, #34). The HF discussion pages themselves were not re-fetched here. `keizez3` at `[STAFF-probable]` is **honest labelling** and must not be upgraded — note the plan's rule 2 does not define that grade (label-inflation, 09-03 process defect #65) |
| 11 | qwen-image : T-c / X7 | *"Lightning at 4 steps collapses seed variance"* | `[LORE]`, n≈3 | **CONFIRMED as correctly graded** | The sweep grades it LORE, states n, states "no seeds or grids published", and states "unanswered by the maintainers". This is the correct handling. ⚠ The *consequence* it draws — retract "sample multiple seeds" — is a **behaviour change built on LORE**; it must ship as an advisory, never as a validator rule |
| 12 | qwen-image : X9 | The 2512 ComfyUI template `image_qwen_Image_2512` exists with a **50-step** standard subgraph, contradicting test-kit T1's "20 steps" | `[OFFICIAL]` | **NOT RE-FETCHED** | `docs.comfy.org/tutorials/image/qwen/qwen-image-2512` not re-fetched by me. Recorded because it changes a test-kit arm. The **template-vs-vendor** distinction the sweep draws (item 4) is methodologically right and is the sweep's best process contribution |
| 13 | krea harvest : *The 36 prompts, verbatim* | Exactly 36 `widget:` entries, one-to-one with `images/00.jpg`…`images/35.jpg` | `[OFFICIAL]` | **CONFIRMED** | Parsed the 36 fenced blocks out of the file programmatically: count = 36 |
| 14 | krea harvest : *Length distribution* | min **10** (#17) · median **101.5** · mean **108.0** · max **230** (#4); chars min 61 / median 625 / mean 673.6 / max 1321 | `[TESTED — static analysis]` | **CONFIRMED — I recomputed all eight** | Independent recount: 10 / 101.5 / 108.03 / 230 and 61 / 625 / 673.61 / 1321. ⚠ Q1 71.2 and Q3 142.2 use the **(n+1) quantile convention**; numpy's default (linear on (n−1)) gives 71.75 / **136.75**. The convention is not stated. Harmless, but "IQR 71–142" is repeated in the digest as if unambiguous |
| 15 | krea harvest : X1 / digest *Contradicts* #1 | Only **15 of 36 (42%)** land inside the app's `80-140 words` rule; 12 below, 9 above | `[OFFICIAL]` contradicts | **CONFIRMED exactly** | My recount: 15 / 12 / 9. This is the round's single strongest falsification of a live app rule |
| 16 | krea harvest : C1 | *"**28/36 are prose**; only 8 are pure comma-runs (#18, 19, 20, 26, 32, 34, 35, 36)"* | `[OFFICIAL]` | **OVERSTATED (off by one)** | There are **9** entries with no sentence break: the list omits **#17** (`immense rocket launch exhaust as seen from extremely close up`), a 10-word bare noun phrase that is neither prose nor a paragraph. Correct figures: **27/36 prose, 9 non-prose**. The conclusion ("prose is the vendor default") survives at 75%; the number does not. The same miscount propagates to the family-B line "13 prose, 8 pure comma-runs" (should be 12 / 9) |
| 17 | krea harvest : X5 / digest *Contradicts* #4 | `matte surface`, `no specular highlights`, `dry pigment finish`, `flat graphic design` appear **nowhere** in the 36; `matte` occurs once, as an object colour | `[OFFICIAL]` scoped absence | **CONFIRMED exactly** | Substring scan: all four = 0 occurrences; `matte` = 1, prompt #18 (`3D rendered matte black designer toy figure`). Also confirmed: 0/36 double quotes, 0/36 request rendered text, 0/36 weighting parens, 0 occurrences of masterpiece / best quality / 8k / ultra detailed / beautiful / amazing, 0/9 LoRA trigger phrases |
| 18 | krea harvest : family split | Family A = 1–15, mean **143.7** / median **134**; family B = 16–36, mean **82.6** / median **77**; *"All 15 family-A entries carry the trailing tail; none of the 21 family-B entries do"* | `[SYNTHESIS]` on the split, `[OFFICIAL]` on the strings | **CONFIRMED exactly** | Recomputed: 143.7 / 134 and 82.6 / 77; a `., ` splice occurs in prompts **1–15 only**. ⚠ Two soft spots: (a) #16 is a 96-word third-person *"This is a watercolor illustration…"* caption — family-A **shape** with no tail — so the split is not as "clean" as claimed, it is clean only on the *tail*; (b) the earlier line *"The 17 long third-person … prompts (1–15, plus 3 and 9's variants)"* is arithmetically incoherent — #3 and #9 are already inside 1–15 |
| 19 | krea harvest : *Against the 512-position cap* | *"Every official prompt sits at or under ~46% of the 512-position budget"* | `[SYNTHESIS]` | **OVERSTATED (favourable conversion chosen)** | The same sentence offers two conversions for the same longest prompt: 1,321 chars ÷ 5.6 = **236 positions** (46%) and 230 words ÷ 0.75 = **307 tokens** (**60%**). Both arithmetic checks pass; the headline quotes only the lower one. Say "≤46–60% depending on which conversion you use", or the reassurance is stronger than the evidence |
| 20 | krea harvest : *Erratum* | The pinned release-day card `665ef38` reads `guidance_scale=3.5`, so §1.5's `0.0` is a transcription error and the CFG conflict dates to release day, not a later edit | `[OFFICIAL]` | **CONFIRMED (second-hand) and consistent** | Matches the 09-03 verifier's #57/ruling #9 exactly, from an independent read of the same pin. The harvest also correctly refuses to resolve the open question. The card body itself was not re-fetched by me |
| 21 | digest : release block | ComfyUI in-window releases **v0.34.4 (Sep 4) · v0.34.5 (Sep 5) · v0.34.6 (Sep 7) · v0.35.0 (Sep 9)**, with v0.35.0's six-bullet "New Open-Source Model Support" block quoted verbatim | `[OFFICIAL]` | **CONFIRMED byte-for-byte** | Re-fetched `docs.comfy.org/changelog`. All four labels and dates exact; all six v0.35.0 bullets exact including PR numbers (#16048, #15922, #15908, #16020, #16065, #15662). v0.34.4–v0.34.6 are Partner-only, as claimed |
| 22 | digest : *Tested findings* 1 | ComfyUI v0.35.0 adds a sampler named **`cfgpp_ud10_ab`** (PR #15951, *"Added a CFG++ sampler that works well at lower steps on Anima"*), which the corpus's `cfg_pp` substring rule misses | `[OFFICIAL]` + `[SYNTHESIS]` | **CONFIRMED** | Verbatim in the changelog's *New Node Updates*. The substring observation is trivially true and is a genuine, cheap validator fix. Correctly scoped ("the naming gap is the finding, not the behaviour") |
| 23 | digest : releases 1 | *"the local:partner ratio in this window is **6 : 8**, not 1 : 11"* | `[OFFICIAL]` | **CONFIRMED only under an unstated convention** | Counting every Partner bullet gives **9** (5 + 1 + 2 + 1); 8 requires excluding v0.34.6's *"Retired partner models"* bullet as a removal. The convention is never stated. Also, four of the six "local" bullets are **feature updates to models already in core** (H3 PDD LoRA, Fun Union, text-encoder refs, H3/HiDream LoRA loading) — only Pixal3D Multi-View and SenseNova U1.5 are new models |
| 24 | digest : releases 6 | SenseNova U1.5 clears the plan's strict local gate: weights ✅ **licence text ✅** ComfyUI path ✅ | `[OFFICIAL]` | **OVERSTATED on one leg of three** | Weights confirmed by me (`sensenova/SenseNova-U1.5-8B-MoT`, createdAt 2026-08-19, lastModified 2026-08-24T02:53:12Z, `license:apache-2.0`); the quant ecosystem figures are exact (`realrebelai/…_GGUFs` **12,902** downloads, `NANI-Nithin/…-GGUF` **2,375**, `Milor123/ComfyUI-ConvRot-…-T8`, `t8star/SenseNova-U1.5-Comfy`); the ComfyUI path confirmed (v0.35.0, PR #15922). **But only the HF licence *tag* was read — no `LICENSE` file was fetched.** The plan's gate says "licence **text**", and this is the exact tag-vs-text conflation the 09-03 verifier caught on SCAIL-2 (Apache file vs MIT tag, #8). Downgrade to "tag Apache-2.0; text unread" |
| 25 | digest : *Official guide changes* 4 | `Lightricks/LTX-2.5-22b-IC-LoRA-Pixel-Spatial-Upscaler` `lastModified` **2026-09-10T09:13:23Z**, card text unreadable (gated), and two `[STAFF]` claims depend on it | `[OFFICIAL]` | **NOT RE-FETCHED** | Recorded as the round's highest-risk unverified change, which is the right call. The proposed remedy (find a commit SHA and pin the raw URL) is proved to work by claim #13's route |
| 26 | digest : *Official guide changes* 1–3 | The Alibaba guide is unchanged (`meta-last-modified 2026-09-02T00:46:00+08:00`) and the 45°-orbit absence is confirmed a second time | `[OFFICIAL]` | **NOT RE-FETCHED** | Consistent with the 09-03 verifier's #42/#43, which did fetch it and recorded the identical stamp. The three newly-recorded English control strings (`Generate single shot.` / `No dialogue.` / `No background music.`) and the `Image 1` orthography rule are new to the corpus and, if real, are directly usable — **verify before folding** |
| 27 | picker : *Finding of the run* | `Comfy-Org/Krea-2` is `gated:false` and carries `LICENSE.pdf` at the repo root, so FOLD-IN **H8** / **A29** / verifier **K40**'s "blocked behind a gated PDF" blocker is wrong | `[OFFICIAL]` | **CONFIRMED (access route)** | HF API for `Comfy-Org/Krea-2`: `"gated": false`, and `siblings` contains `{"rfilename":"LICENSE.pdf"}`. The route is exactly what 09-03 exclusion **#24** demanded ("Either open it or state the thresholds as unverified") |
| 28 | picker : *Finding of the run* | §2.3 verbatim: commercial use permitted only under **$1,000,000 USD** trailing-twelve-month company-wide revenue, affiliates aggregated | `[OFFICIAL]` | **NOT RE-FETCHED (PDF text)** | I confirmed the file exists and is ungated but did not extract the PDF. The clause set the audit reports (§2.1 revocable, §3.1(b) "Krea" naming, §3.1(c) NOTICE, §4.1(c) provenance/watermarking, §4.2 content filtering, §5.3 you own Outputs, §9.2 30-day termination, §10.1 Delaware) is internally coherent and matches the content-filter obligation the 09-03 verifier independently confirmed on the model card (#57) |
| 29 | picker : *Finding of the run* | *"The `50 seats` is not merely unsourced, it is **refuted**"* — "seat"/"seats" absent from the whole document | `[OFFICIAL]` | **NOT RE-FETCHED — and this is the one claim I would gate hardest** | A refutation-by-absence over a 14,646-character PDF extraction is only as good as the extraction. PDF text layers drop ligatures, headers, footnotes and footers routinely. Ship it as *"not found in the extracted text of LICENSE.pdf v.1 (2026-06-22)"*, never as *"refuted"* — the plan's rule 3 (absence claims are scoped) applies to PDFs too |
| 30 | picker : LongCat-Image | `min`/`comfy` `6`/`10` wrong; README comment is `pipe.enable_model_cpu_offload()  # Offload to CPU to save VRAM (Required ~17 GB); slower but prevents OOM`, and the non-offloaded line is *"Uncomment for high VRAM devices"* | `[OFFICIAL]` | **CONFIRMED verbatim** | Re-fetched the card. Both comments byte-exact. ⚠ **The source never says what the ~17 GB is** (VRAM? system RAM? the offloaded path's own need?). The audit reads it as a VRAM floor without flagging the ambiguity. The *direction* is supported independently by the corpus VRAM table; the *number* should be quoted, not interpreted |
| 31 | picker : LongCat-Image | `speed:'fast'` is wrong: official quick-start is **`num_inference_steps=50, guidance_scale=4.0, enable_cfg_renorm=True`**; the 8-step build is a different checkpoint | `[OFFICIAL]` | **CONFIRMED verbatim** | All three kwargs exact in the card's quick-start. Also confirmed: `license: apache-2.0` in the front-matter, and the mandatory-quotes rule *"Failure to use explicit quotation marks prevents this mechanism from triggering, which will severely compromise the text rendering capability"* — verbatim |
| 32 | picker : LongCat-Image | `disk` `~12 GB` understates: transformer 12.54 GB + text_encoder 16.59 GB (5 shards) + VAE 0.168 → **~29.3 GB** | `[OFFICIAL]` | **NOT RE-FETCHED** | HF tree sizes not re-read. The *structural* point (some rows quote the DiT alone, others a runnable stack) is verifiable from the rows themselves and is the audit's best contribution |
| 33 | picker : FLUX.2 klein 9B | `comfy:16` should be 24–32; corpus says 16 GB is *"marginal — official says ~29 GB / RTX 4090+"* | OFFICIAL (BFL, via corpus) | **NOT RE-FETCHED** | Rests on `image-model-comparison.md`, a corpus file, not on a re-fetched BFL page. Grade honestly as **corpus-mediated**, not OFFICIAL — the 09-03 verifier's #29 already recorded `docs.bfl.ai/flux_2/flux2_overview` as NOT RE-FETCHED |
| 34 | picker : FLUX.2 klein 4B | `min:6` has **no source anywhere**; lowest attested are 8 / 8.4 / 13 | UNSOURCED | **CONFIRMED as a defect class** | The audit's own evidence names three conflicting figures, two of them BFL's own (repo README ~8 GB vs docs/card ~13 GB) — an acknowledged internal vendor contradiction. `min:6` sits below all three. The correction (→8) is safe; the `comfy:8`→`12` change rests on a TESTED-vs-OFFICIAL conflict and should be shipped with both numbers visible |
| 35 | picker : Illustrious / NoobAI | `lic:'varies/checkpoint'` is wrong: Illustrious **v2.0 = creativeml-openrail-m**, NoobAI eps + v-pred and Illustrious **v0.1 = FAIPL-1.0-SD (commercial PROHIBITED)** | `[OFFICIAL]` | **CONFIRMED (second-hand), and the licence-filter bug is the real finding** | The NoobAI FAIPL commercial prohibition was verified verbatim by the 09-03 verifier (#61, K27). The `OnomaAIResearch/Illustrious-XL-v2.0` front-matter was not re-fetched by me. **The consequential half is `licClass`**: the row is `licClass:'risk'` in the live file, so the audit's "false positive in the free/commercial filter" claim needs re-checking — see *Applied-edit audit* |
| 36 | picker : Qwen-Image-Edit-2511 | *"There is no plain `fp8_e4m3fn` build for 2511"*; smallest quant is fp8mixed **20.53 GB**; bf16 = **40.86 GB** | `[OFFICIAL]` | **NOT RE-FETCHED** | HF tree not re-read. The claim is falsifiable in one fetch and should be re-checked before `comfy:16`→`24` ships, because it is the sole basis for that change |
| 37 | picker : MiniMax H3 | `min:48`/`comfy:80` wrong; MiniMax publishes **未公布** twice; measured floor pruned-int8 **16 GB**; *"the row's own `warn` already says 480p+audio on ~12 GB VRAM — it contradicts itself"* | OFFICIAL absence + TESTED | **CONFIRMED as an internal contradiction; the replacement is NOT RE-FETCHED** | The self-contradiction is checkable in the live file and is real. The 未公布 quotes were **NOT RE-FETCHED by the 09-03 verifier either** (its ruling #6 says so explicitly), so `min:12/comfy:16` would ship on a chain that has never been verified at source. Ship the *deletion* of 48/80 now; hold the replacement numbers |
| 38b | system-prompt-audit : `sdxlAnime` row 14 | *"`· Pony V6: emit NO negative prompt and say why in one clause after the tags is NOT allowed — simply omit the block`"* is **BROKEN TEXT**, ungrammatical and self-negating, and is *"an application artifact, not a FOLD-IN item"* | BROKEN TEXT | **CONFIRMED live** | `PromptStudio.html:726` reads exactly that. The 2026-09-10 apply pass (D3) produced a self-contradictory instruction in the most-consulted branch of a five-family dialect. **Must be repaired before anything else in this target** |
| 39 | system-prompt-audit : `sdxlAnime` *Example audit* | The single exemplar violates two hard rules: a **3-rung** score chain where the rule demands six, and it **emits a negative block on a Pony prompt** using Animagine's list | — | **CONFIRMED live** | `PromptStudio.html:734-736`. The chain stops at `score_7_up`; a negative block follows. Its tokens (`missing fingers, extra digit`) do not even match the Animagine list the same file now ships at line 728 (`missing finger, extra digits`) — so the exemplar teaches a third, unsourced variant. D1/D2/D3 rewrote the rules and left the exemplar teaching the opposite |
| 40 | system-prompt-audit : `wanI2V` row 7 | `TARGETS.wanI2V` still says `固定机位。` while `TARGETS.wan` now says `固定镜头` — *"the app now emits two different tokens for one concept"* | **CONTRADICTED** | **CONFIRMED live** | `PromptStudio.html:567`: *"If the camera should stay still: \"Static camera.\" / \"固定机位。\""*. Verifier #42 established `固定镜头` as the vendor's word. FOLD-IN A2 fixed one target and left the other |
| 41 | system-prompt-audit : `scail` row 11 | *"704p recommended for Replacement"* is *"stated twice — rule and example"*, and is UNSUPPORTED at source (verifier #4, exclusion #2) | **CONTRADICTED** | **CONFIRMED live, and the CHANGELOG overstates its own fix** | `PromptStudio.html:680` now carries the corrected sentence (*"704p for pose-driven work (the card says … it does not name replacement)"*) — but **line 688, the worked example, still ends `704p output recommended` on a `MODE: Replacement` case**. `CHANGELOG-2026-09-10.md` records A20-target as **APPLIED**; it was applied to the rule only |
| 42 | system-prompt-audit : `minimaxref` row 1 | `"12 files max"` in `TARGETS.minimaxref` is CONTRADICTED; local caps are 9/3/3/3 = 18 with no total | **CONTRADICTED** | **CONFIRMED as already fixed** | No occurrence of `12 files max` survives anywhere in `PromptStudio.html`. The audit's snapshot predates the applier here; the apply pass must not re-apply R1 blindly |
| 43 | system-prompt-audit : `minimax` row 10 | The camera table's twelfth row is `Roll Clockwise / Roll Counterclockwise`, not bare `Roll` | **CONFIRMED, one token short** | **NOT RE-FETCHED** | Rests entirely on `minimax-h3.md` item 8's transcription of a MiniMax "base guide" that neither the 09-03 verifier nor I have fetched. Eight of the seventeen `minimax` changes (M1–M5, M13) rest on that same untouched document. It is the largest **single-source** dependency in the whole audit |
| 44 | system-prompt-audit : `minimaxref` row 19 / R15 | The Ref2VA 16:9 / 9:16 aspect restriction, carried as `MISSING (OFFICIAL-3P, flag only)` and graded `OFFICIAL-3P` in the change table | `[OFFICIAL-3P]` | **MISLABELLED — binding exclusion breach** | 09-03 exclusion **#21** names this exact claim and rules it `[LORE]`: *"`[OFFICIAL-3P]`-graded claims from third-party LoRA READMEs — specifically the Ref2VA aspect-ratio restriction … Both are `[LORE]`."* The audit's *behaviour* is right (wfNotes, flag-don't-enforce) but it re-uses the forbidden grade, and `[OFFICIAL-3P]` is the same invented label the 09-03 process-defect #65 called "the worst offender" |
| 45 | system-prompt-audit : `sdxl` row 13 / X7 | *"Rendered text goes at the FRONT of the prompt, never at the end, quoted verbatim"* as a general rule | `[CREATOR]` | **OVERSTATED (scope), by the audit's own admission** | The audit's own evidence cell flags verifier **#62**: the sentence comes from the Ragnarok guide's *Metallic Typography (Text)* **example**, spliced into a fenced block with two other sections. The audit records the caveat and then ships the rule unscoped in the proposed prompt. Scope it to typography/text-heavy prompts or drop it |
| 46 | system-prompt-audit : `krea2` K10 / FOLD-IN B4 | *"follow the encoder's OWN slot order … colour → shape → size → texture → quantity → text → spatial relationships → objects → background. That is a better-evidenced ordering rule than any heuristic."* | `[OFFICIAL-PATTERN]` | **FALSIFIED the same day, by a sibling file** | The Krea harvest (claim #17's corpus) measures fill rates **94 / 94 / 92 / 61 / 56 / 53 / 6 %** and an observed order of objects → attributes → spatial → background → composition → medium/camera → lighting → palette. The digest carries it as *Contradicts* **#3**: *"Keep the nine slots as an axis checklist; delete 'in that order'."* K10 would rewrite the app's second-best exemplar to obey an order the vendor does not use — **and `CHANGELOG-2026-09-10.md` records B4 as APPLIED**, so the falsified ordering rule is already live |
| 47 | system-prompt-audit : `krea2` proposed text | *"Kill AI gloss with POSITIVE matte facts: 'matte surface, no specular highlights, dry pigment finish, subtle paper texture, expressive thick brushstrokes'"* | `[OFFICIAL]` (row 4) | **UNSUPPORTED as vendor language** (claim #17) | Three of the five phrases occur **zero** times in the vendor's 36 published prompts. Only `expressive thick brushstrokes` is real (prompt #25). Keep the advice, regrade to `[SYNTHESIS]`, and prefer the mark-making vocabulary the harvest extracted |
| 48 | system-prompt-audit : `wan` W4 proposed text | *"The Chinese rewriter says 部分, no cap, and its exemplars carry 9-11. Cap English at 4; **Chinese may run to ~10**."* | `[OFFICIAL]` | **UNSUPPORTED band — and the audit forbids itself from writing it** | 09-03 verifier **#40** counted the ZH exemplars as **9 / 11 / 7**, so "9-11" excludes a third of the sample. W4's own evidence cell says the change is *"phrased as **the instruction**, never as a measured band, because verification #40 marks the exemplar tally UNSUPPORTED"* — and the proposed prompt then ships the band twice. The `不超过4种` English half is sound (verifier #39 CONFIRMED) |
| 49 | system-prompt-audit : `wan` proposed camera list | English move vocabulary given as *"push in / pull back / pan left-right / tilt up-down / **arc shot**"* — `orbit` absent | `[OFFICIAL]` (W6/W7) | **OVERSTATED — a retired doctrine surviving as a word list** | 09-03 exclusion **#6** deleted *"orbit is the documented failure word"* as having no first-party source on any surface across two sweeps, and the guide's only 环绕运镜 exemplar is a successful ~180° orbit. Listing `arc shot` as the sole English gloss for 环绕运镜, with `orbit` conspicuously absent, silently re-teaches the deleted rule. Either list both or list neither |
| 50 | system-prompt-audit : length rule | *"A full replacement `system:` string … at **≤ current length + 20%**"* (§Scope & method, pass 5) | the audit's own binding constraint | **BREACHED in 6 of 12 targets** | Self-reported: `wanI2V` **+24%** · `minimaxref` **+35%** · `scail` **+43%** · `sdxl` **+49%** · `qwenimg` **+50%** · `krea2` **+58%** (+31% post-B4) · `flux` **+24%**. Only `wan` (+18%), `ltx` (+18%), `minimax` (+20%), `sdxlAnime` (+20%) and `zimage` (+15% post-FOLD-IN) comply. The audit is honest about every breach and proposes trims for most — but §C-9 then argues the rule itself is wrong, which is an argument to *change* the rule, not to ship past it |
| 51 | system-prompt-audit : `minimaxref` + `scail` proposed exemplars | Worked outputs containing the meta-parentheticals *"(Compressed — a real generation prompt continues to 350-500 words.)"* and, in `minimaxref`, *"(<Video 1>'s soundtrack is not attached, so this standalone reference is <Audio 1>.)"* | — | **NEW DEFECT introduced by the audit** | These sit **inside the `Example output:` block**, i.e. inside the text the 7B is shown as a model answer. Every one of these targets also carries a hard *"Output ONLY the six sections"* / *"Output ONLY the three labeled parts"* contract. A 7B copies exemplar shape more reliably than it obeys rules — this is the audit's own §C-1 thesis, applied against itself. Move both parentheticals out of the fenced output |
| 52 | system-prompt-audit : `qwenimg` chapter scope | *"⚠ Its `## 2026-09-10 sweep` section is entirely `_(pending)_` at the time of this audit"* | method note | **CONFIRMED, and it invalidates the chapter's currency** | The `qwenimg` chapter's 10 MISSING rows and 17 changes were built on `cn-sweep-2026-08-28.md` §4.3 and never saw the primary-source read that landed hours later. Claims #7, #8 and #9 are the three places where it lost. The apply pass must treat `research/qwen-image.md` §*2026-09-10 sweep* as authoritative over the audit's `qwenimg` chapter wherever they differ |
| 53 | picker : baseline | All seven embedded `WF_TEMPLATES` graphs are canonically identical to the 2026-08-28 verified harvest, and all seven are **NO DRIFT** upstream as of 2026-09-10 | `[OFFICIAL]` | **NOT RE-FETCHED — but the method is the best in the round** | Two independent reads per file (cache-busted raw + jsdelivr), a third in-page `fetch(cache:'no-store')` with SHA-256 for four of seven, and a caught instance of `raw.githubusercontent.com` **serving a stale `image_krea2_turbo_t2i.json`**. That last observation independently corroborates `RESEARCH-PLAN-2026-09.md` rule 7's staleness warning and should be promoted into the plan |

---

## Verdict summary

| Verdict | Count |
|---|---|
| **CONFIRMED** (incl. 2 "confirmed as a defect", 4 "confirmed live") | **26** |
| **OVERSTATED** | **9** |
| **UNSUPPORTED / FALSIFIED** | **4** |
| **MISLABELLED** | **2** |
| **STALE** | **1** |
| **NOT RE-FETCHED** | **11** |
| **UNREACHABLE** | **0** (no domain under a standing refusal was attempted) |
| **Total rows** | **53** |

Plus: **6 of 12** proposed system prompts breach the audit's own ≤+20% length rule (claim #50);
**1 binding-exclusion breach** (#44); **1 new defect introduced by the audit itself** (#51);
**2 defects introduced by the 2026-09-10 apply pass and still live** (#38b, #39); **1 live defect in
none of today's files** (`CAM_FIXED`, see *Applied-edit audit*).

**Overall read.** The round's primary-source work is strong: every figure I recomputed from the Krea
harvest matched to the digit, every Qwen-Image rewriter quotation was byte-exact against the file I
re-fetched, and every ComfyUI changelog quotation was byte-exact. The failures cluster in four places,
and they are the same four the 09-03 verifier named:

1. **Scope loss inside a true statement** — a portrait-only rule shipped as a language rule (#7), a
   ZH-only order shipped as a global order (#8), a 2512-only observation shipped as a global one (#9),
   an example-only sentence shipped as a general rule (#45).
2. **Counts and bands asserted rather than counted** — 28-vs-27 prose (#16), 6:8 (#23), "9-11" ZH
   aesthetic tokens the previous verifier already counted as 9/11/7 (#48).
3. **Absence stated absolutely** — "the 50 seats is *refuted*" over a PDF text extraction (#29).
4. **Two same-day files disagreeing and nobody arbitrating** — the whole `qwenimg` chapter (#52), and
   Krea's nine-slot ordering rule falsified by its own sibling file on the same day (#46).

---

## System-prompt gate

Per model: every changed instruction, ruled **ALLOW** (OFFICIAL/STAFF and verifier-confirmed) ·
**ADVISORY** (ship, but as house craft / at its labelled grade, never as vendor fact) · **BLOCK** ·
**NEEDS-RENDER** (a synthesised exemplar nobody has generated from — ship only if the maintainer
renders it first, or ship it labelled untested).

Each proposed prompt was also checked for **internal contradiction** (does an exemplar break a rule in
the same string?) and against the audit's own **≤+20%** rule.

### `wan` — ALLOW 10 · ADVISORY 1 · BLOCK 2 · length **+18% ✓**

| Change | Ruling |
|---|---|
| W1 STYLE LEADS + attested style vocabulary | **ALLOW** — `system_prompt.py` rule 5; verifier #38 confirmed the file byte-exact |
| W2 2D-style aesthetic suppression | **ALLOW** |
| W3 name both official orders, drop "Style last" | **ALLOW** — two OFFICIAL orders, both stated, neither hidden |
| W4a English aesthetic cap `不超过4种` | **ALLOW** — verifier #39 CONFIRMED |
| W4b *"its exemplars carry 9-11"* / *"Chinese may run to ~10"* | **BLOCK** — claim #48. Verifier #40 counted 9/11/7. W4's own evidence cell forbids a measured band |
| W5 the three motion exemplar phrases (猛烈地摇摆 / 缓慢地移动 / 打碎了玻璃) | **ALLOW** — verifier #44 CONFIRMED verbatim |
| W6 split the camera bullet; name the closed 拍摄角度 set | **ALLOW** |
| W7 add 复合运镜 | **ADVISORY** — `[AL]` guide term, not PE-attested |
| W8 delete *"measurably harms motion and identity"* | **ALLOW** — removes an asserted measurement nobody made |
| W9 named banned mood tokens | **ALLOW** (rule OFFICIAL; the compound list is LORE but cited only as *banned*, which is safe at any grade) |
| W10 声音 controls are cloud-tier | **ALLOW** |
| W11 rewrite the ZH exemplar (drop 低机位, use 镜头从左到右横移, style first) | **ALLOW + NEEDS-RENDER** |
| W12 keep the EN exemplar | **ALLOW** |
| *(unlisted)* English move list gives `arc shot` and omits `orbit` | **BLOCK** — claim #49; exclusion #6. List both English words or neither |

Internal-contradiction check: **resolved.** The current string's rule-7-vs-example-1 ordering clash is
fixed by W3, and the ZH exemplar's angle+move violation is fixed by W11.

### `wanI2V` — ALLOW 8 · ADVISORY 2 · BLOCK 0 · length **+24% ✗ (trim to +17%, as the audit itself offers)**

I1 `固定机位`→`固定镜头` **ALLOW** (verifier #42; fixes a live cross-target inconsistency, claim #40) ·
I2 PE-attested camera set **ALLOW** · I3 speed adverbs + visible effect **ALLOW** ·
I4 quote 提示词 = 运动 + 运镜 **ALLOW** · I5 move-XOR-angle **ALLOW** · I6 banned mood tokens **ALLOW** ·
I8 quote the ZH rewriter's own 100字 sentence **ALLOW** · I10 add a visible effect to the EN exemplar
**ALLOW** · I7 silent-classification line **ADVISORY** (SYNTHESIS) ·
I9 **add a 49-character Chinese exemplar** **ADVISORY + NEEDS-RENDER** — the *vocabulary* is OFFICIAL,
the sentence is the auditor's; it is also the highest-value item in this target, because the ZH branch's
unit differs by ~3× and has no exemplar today. The *"15-70 words is usually right"* band stays
**ADVISORY** — no corpus figure, correctly flagged by the audit.

### `ltx` — ALLOW 11 · ADVISORY 3 · BLOCK 0 · length **+18% ✓**

L1 silent classification **ADVISORY** · L2 screenplay-form scoping **ALLOW** (cites the guide's
Longer/Screenplay-Style section, *not* the sample count verifier #14 struck) · L3 per-sentence verb
**ALLOW** · L4 tag-syntax ban **ALLOW** · L5 detail-to-shot-scale + camera-relative-to-subject
**ALLOW** · L7 three official negatives, offer-never-require **ALLOW** · L8 on-screen-text caveat
**ALLOW** · L9 English default **ALLOW** · L10 restate the enhancer bullet concretely **ALLOW** ·
L11 "no labels"→"no meta-labels" **ALLOW** · L12 FORM/LENGTH/AUDIO/RULES/CUTS headings **ADVISORY** ·
L13 fix exemplar 1 **ALLOW** · L14 add a two-shot cut exemplar **ALLOW + NEEDS-RENDER**.

**L6 Auto Duration ("reads the length off the prompt and does NOT pad") → ADVISORY, needs a scope
clause.** 09-03 **K5** records Auto Duration as *absent from the shipped ComfyUI template — a
Python-path feature*. Unconditional, it tells ComfyUI users their beat count changes clip length when
on the template they are running it does not.

**Residue the audit did not flag:** the proposed LENGTH block keeps *"LTX-2.3: 40-150 words soft, 200
hard (the LTX-2 README's own figure)"*. Only the **200** is the README's; the 40-150 is house craft
under an attribution that reads as covering both. Exclusion **#12** is explicit that the 150 descends
from the LTXV-0.9 enhancer. **Split the attribution.**

### `minimax` — ALLOW 10 · ADVISORY 5 · BLOCK 0 · length **+20% (at the ceiling)**

**ALLOW (code-level; verifier #50 read `nodes_minimax_h3.py` byte-exact):** M9 ban `(word:1.2)` and
`{a|b}` · M10 "H3 takes NO negative prompt — CFG-distilled" · M11 the exact `ValueError` string with
the boundary left unstated · M12 ~6 s → ~5 s and the `n % 17 == 5` grid · M14 style list marked open
(fixes an unsourced closed set) · M16/M17 exemplar fixes (**+NEEDS-RENDER**).

**ALLOW, single-source** (all rest on `minimax-h3.md` item 8's transcription of a MiniMax "base guide"
no verifier has fetched — claim #43): M1 blank line · M2 amplitude/speed only when meaningful ·
M3 `Roll Clockwise/Counterclockwise` · M4 speaker numbering by first vocal event · M5 `<scenetrans>` /
`<cutoff>` · M8 signage language · M13 non-verbal sound and "speed, rhythm".

**ADVISORY:** M6 mouth-stop clause (`[OFFICIAL-PATTERN]` — a gold pair's NOTES, not a vendor rule) ·
M7 on-screen copy "3-5 words, ≤32 characters" (sourced to a **CN product-ad skill**, a task-specific
document; do not ship as a universal H3 rule) · M15 restructure.

### `minimaxref` — ALLOW 9 · ADVISORY 4 · BLOCK 2 · length **+35% ✗ (exception requested)**

R1 caps 9/3/3/3 = 18, no total **ALLOW** (verifier #52) — *but* claim #42: the "12 files max" it
replaces is **already gone**; do not double-apply. R3 three-step label numbering **ALLOW** (verifier
#50/#52) — the single most valuable change in the target. R4 state the soundtrack assumption
**ALLOW** · R6 no label without an asset **ALLOW** · R7 `weak_reference` honesty clause **ALLOW** ·
R8 amplitude/speed **ALLOW** · R9 speaker mechanics **ALLOW** · R11 banned syntax + no negative
**ALLOW** · R14 repeat the 350-500 band next to the exemplar **ALLOW**.

**ADVISORY:** R2 drop the "15s total" figures (the *totals* are hosted-surface; make sure the ~15 s
**clip** cap survives elsewhere) · R5 conflict-winner device (`OFFICIAL-PATTERN`) · R12 blank line
between sections (the audit grades the Ref2VA extension SYNTHESIS itself) · R13 exemplar fix
(**NEEDS-RENDER**).

**BLOCK:** **R15** — the Ref2VA 16:9/9:16 restriction re-graded `[OFFICIAL-3P]`, which binding
exclusion **#21** rules `[LORE]` **by name** (claim #44). Ship the wfNotes flag with a `[LORE]` label,
not that grade. **And the exemplar's inline parenthetical** *"(<Video 1>'s soundtrack is not attached,
so this standalone reference is <Audio 1>.)"* placed inside the `Example output:` block (claim #51).

**Length exception: NOT granted as written.** The audit's own §C-9 has the right fix — hoist the shared
TIMING-WORDS / weighting / negative-guidance blocks into a common prefix, freeing 300-600 characters in
every video target. Do that, then R3 fits.

### `scail` — ALLOW 9 · ADVISORY 5 · BLOCK 1 (length) · length **+43% ✗ (audit's own trim → +21%, still over)**

S1 90-140 words in **both** modes, with the vendor's mode-agnostic sentence **ALLOW** (verifier #2) ·
S2 delete "704p recommended for Replacement", keep "pose-driven performs better at 704p" **ALLOW**
(binding exclusion #2 — and claim #41 shows the live exemplar still needs it) · S3 mask polarity on
both sides of both modes **ALLOW** (verifier #9) · S5 anti-inflation clause **ALLOW** · S7 extend the
ban list, drop bare `process` **ALLOW** (verifier #5) · S8 512 UMT5 ceiling **ALLOW** (verifier #7) ·
S9 appearance-and-environment channel **ALLOW** · S10 negative-prompt paragraph **ALLOW** ·
S11 narrow "fix the drive, not the prose" to motion/identity **ALLOW** · S13 ÷32 as a *recommendation*
**ALLOW** — exactly what exclusion **#1** demanded, and the proposed text does use "should".

**ADVISORY:** S4 concrete background nouns (USER-VERIFIED; **the "FOUR OR MORE" count is the auditor's,
not the source's** — ship the requirement, label the number) · S6 field order (`OFFICIAL-PATTERN`) ·
S12 background-removed, aspect-padded reference (TESTED, single report) · S14 position-first routing
and the 6-identity cap (TESTED, corroborated by `DEFAULT_PALETTE` and the paper's K=6) ·
S15 the 113-word rewritten exemplar (**NEEDS-RENDER**).

**BLOCK:** nothing substantive — but **+43%** must come down. The audit's two cuts (resolution sentence
and negative paragraph → `wfNotes`) land at +21%; take a third from the numbered field order.

### `sdxl` — ALLOW 7 · ADVISORY 2 · BLOCK 0 (1 NEEDS-VERIFY) · length **+49% ✗**

X1 "the first clause sets the foundation" replacing "trailing tokens fade" **ALLOW** ·
**X2 the U-Net context rule with SDXL 4% / SD 2.1 0.2% — ALLOW, and the best single change in the whole
audit**: it is precisely the scope limit exclusion **#16** requires whenever the app states the
order-over-prose rule, and verifier #28 confirmed every figure verbatim · X3 "at most 2 quality words"
→ **no** standing quality words **ALLOW** · X4 weights sparingly, SDXL named as the exception
**ALLOW** · X5 family-route the negative; Juggernaut/Ragnarok emit none **ALLOW** (verifier #58) ·
X6 BOORU-in-negative **ALLOW** · X8 never machine-translate tags **ALLOW** · X9 no exact viewpoint from
prose **ALLOW**.

**ADVISORY:** X7 "text at the FRONT" — scope it (claim #45) · the house slot order (UNSOURCED, harmless).

**NEEDS-VERIFY before ship:** X10's RealVisXL negative is quoted as a literal the rewriter must emit
*exactly*. Neither I nor the 09-03 verifier re-fetched that card; #58 only characterised the list.
Re-fetch it, or reference "the card's own list" without hardcoding a copy.

**Length:** the audit names the right fix itself — make `SDXL_NEG` a function of family (FOLD-IN D9)
and leave a two-line pointer, landing at +16%.

### `sdxlAnime` — ALLOW 8 · ADVISORY 1 · BLOCK 0 · length **+20% ✓**

**A1 repair the broken Pony-negative sentence — ALLOW, and the highest-priority single edit in the
round** (claim #38b: live at `PromptStudio.html:726`, introduced by the 09-10 apply pass). A2 explicit
family selection + state the assumed family **ALLOW** · A3 refuse Pony V7 (AuraFlow) **ALLOW** ·
A4 truncated chain has "a much weaker effect" **ALLOW** (card verbatim, verifier #61) · A5 the two Pony
style templates and `rating_*` values **ALLOW** · A6 NoobAI percentile explanation **ALLOW** ·
A7 Animagine parenthesis escaping and year tags **ALLOW** ·
**A9 fix exemplar 1 — ALLOW, urgent** (claim #39) · A10 add a NoobAI exemplar **ALLOW + NEEDS-RENDER**.

**ADVISORY:** **A8 the Illustrious control-token rungs and version gate.** The audit's own grade is
*"CREATOR via a LORE reprint channel"*, and 09-03 process defect **#64** flagged `sdxl.md` for grading
three reprints of one evidence shape three different ways. Ship the vocabulary with a visible
"community reprint of the author's notes" label, never as an Onoma card rule. Exclusion **#29** stays
binding: no Onoma card states any quality prefix.

### `flux` — ALLOW 11 · ADVISORY 1 · BLOCK 1 (citation) · length **+24% ✗ (audit's trim → +18%)**

F1 task-branch (comma-run slot template vs relational sentences) **ALLOW** — correctly *scopes* rather
than generalises, avoiding verifier #24 · F2 "word order signals priority" **ALLOW** · F3 delete "it
collapses seed diversity" **ALLOW** · F4 bound the long band at 80-300+ and add the 32K-vs-512 caveat
**ALLOW** (verifier #22, #27) · F5 klein has no prompt upsampling **ALLOW** · F6 JSON for 3+ objects
with the anti-overuse clause **ALLOW** · F7 requote BFL's softened negative line, keep the output
constraint **ALLOW** (verifier #25) · F8 three substitution pairs **ALLOW** · F9 drop the "not parsed"
mechanism, keep the ban **ALLOW** · F10 content-native language, Chinese on the same footing **ALLOW** ·
F11 mixed-language mechanics **ALLOW** · F12 "paragraph" → "prompt" **ALLOW** · F13 add a text-in-image
exemplar **ALLOW + NEEDS-RENDER**.

**BLOCK (citation, not instruction):** do not cite `prompting_unified_technical` as the home of BFL's
native-language sentence. Verifier **#26** read that page in full and the sentence is not on it;
exclusion **#15** says find the right page first.

### `zimage` — ALLOW 8 · ADVISORY 3 · BLOCK 0 · length **+15% post-FOLD-IN ✓**

Z1 the STAFF token conversion and the `max_sequence_length=1024` remedy **ALLOW** (verifier #34) ·
Z2 weights are literal text **ALLOW** · Z4 PE awareness **ALLOW** · Z5 rendered Han glyphs stay Chinese
inside an English prompt **ALLOW** · Z6 numbered five-step multi-subject procedure **ALLOW** ·
**Z7 MultiBind failure names as *vocabulary only*, never as "Z-Image was tested" — ALLOW, and it is the
correct handling of a scoped paper** · Z8 output contract **ALLOW** · Z9 English multi-subject Base
exemplar **ALLOW + NEEDS-RENDER**.

**ADVISORY:** Z3 the NegPiP route clause (`[LORE]`, labelled) — **but soften the absolute**: the
proposed text says *"A community NegPiP node is **the only route** to a real negative on Turbo"*, an
unscoped absence claim · Z10 silent classification.

**Residue:** the proposed Base exemplar is English and closes with a **Chinese** negative
(`多余的人物, 面部变形, 手部畸形, 文字, 水印`). That is the vendor's own targeted list, but the target's
language rule routes English input to English output. Add a clause permitting the Chinese Base negative,
or the 7B will produce inconsistent language pairs.

### `qwenimg` — ALLOW 9 · ADVISORY 4 · BLOCK 2 · length **+50% ✗** · **chapter must be reconciled first**

Everything below was checked by me against a full re-fetch of `prompt_utils_2512.py` today.

**ALLOW (verified verbatim by me):** Q2 three-branch expansion policy · Q3 "even an instruction is the
description to be rewritten" + the ban on lists/numbering/headings · Q4 enumerated proper-noun
protection (names, brands, places, IP, titles, slogans, URLs, phone numbers) · Q5 mandatory art-style
statement with the vendor's own vocabulary · Q7 the texture set 光滑/粗糙/金属感/织物感/透明/磨砂 plus the
fuller light list · Q8 layout direction, presentation mode, punctuation/case/line-break preservation ·
Q9 the quote-mark asymmetry · Q10 "if it is not a text image, add no text" + invent the concrete short
string · Q15-Q17 exemplar fixes and the general-scene exemplar (**+NEEDS-RENDER**).

**BLOCK — Q1 as written.** *"English targets about 200 words … Chinese portraits are capped at 150
characters"* presents a **portrait-scoped** English figure as language-wide (claim #7). The 200 lives in
Subtask 1 rule 7; Subtasks 2 and 3 have no length rule in either language. Use `qwen-image.md` X1's
formulation: *portrait EN ≈200 words · portrait ZH ≤150 字 · text/general: as long as every exact string
and spatial relation is stated, and no longer.*

**BLOCK — Q6 as written.** ethnicity → gender → age is a **hard** rule only in the Chinese rewriter
(claim #8). The English rewriter labels it *"Recommended Description Flow"* and adds *"always prioritize
a natural narrative over this rigid structure; adapt the order as needed."*

**ADVISORY — Q12.** "dead code" is true of `prompt_utils_2512.py` only (claim #9). Use the sweep's
wording: *dropped for 2512, still appended by base Qwen-Image.*

**ADVISORY — Q11.** Three official "no text" strings exist, not one (claim #6). Pick one and say so.

**ADVISORY — Q13, Q14.** Best-effort pose (TESTED/PAPER + LORE) and the Lightning CFG-1 route clause
(SYNTHESIS from OFFICIAL). Note the sweep's **T-c/X7** additionally makes the app's standing "sample
multiple seeds" advice conditional at 4/8 steps — `[LORE]`, n≈3, **never a validator rule**.

### `krea2` — ALLOW 7 · ADVISORY 3 · BLOCK 3 · length **+58% / +31% post-B4 ✗**

K2 reference-image token cost + "downscale references hard" **ALLOW** · K3 weights are literal text
**ALLOW** (verifier #54) · K4 Turbo 8/cfg 0.0 vs RAW 52/cfg 3.5 recipe branch **ALLOW** — **but keep the
live app's `guidance_scale=3.5` conflict clause**, which the proposed text drops; exclusion **#25** says
record the conflict, do not pick a side · K5 "connect a REAL EMPTY negative, never `ConditioningZeroOut`"
**ALLOW** — and see the *Applied-edit audit*, because the live `wfNotes` teaches the opposite ·
K7 `prompt_enhance` OFF with the **ethics-refusal** reason, not the diversity reason **ALLOW**
(exclusion #26) · K8 "restate instead of multiply" **ALLOW** · K11 second exemplar
**ALLOW + NEEDS-RENDER**.

**ADVISORY:** K1 — ship the 512-position / ~2,850-character ceiling as the hard number, but **restate
80-140 as *typical***: the same day's harvest measures the vendor's own gallery at 10-230 words with only
**42%** inside the band (claim #15) · K6 flat-background difficulty (`[SPECULATION]`, labelled) ·
K9 English output (scoped absence, labelled as the app's choice).

**BLOCK — K10, and a retraction of the already-applied B4.** The nine-slot **ordering** rule is falsified
by the vendor's own 36 prompts (claim #46; digest *Contradicts* #3). Keep the nine slots as an **axis
checklist**; delete "in that order". `CHANGELOG-2026-09-10.md` records **B4 as APPLIED to
`TARGETS.krea2`**, so this is a retraction, not merely a non-adoption.

**BLOCK — the "matte facts" string.** `matte surface`, `no specular highlights`, `dry pigment finish`
occur **zero** times in the vendor's 36 prompts (claim #17). Keep the advice at `[SYNTHESIS]`, or replace
with the mark-making vocabulary the harvest extracted.

**BLOCK — "Output ONLY the paragraph" as an absolute.** 15 of 36 official prompts are *paragraph* +
`., ` + *style tail* (harvest X6, digest *Contradicts* #5).

### Gate totals

| Model | ALLOW | ADVISORY | BLOCK | NEEDS-RENDER | ≤+20%? |
|---|--:|--:|--:|--:|:--:|
| `wan` | 10 | 1 | 2 | 1 | ✓ +18% |
| `wanI2V` | 8 | 2 | 0 | 1 | ✗ +24% |
| `ltx` | 11 | 3 | 0 | 1 | ✓ +18% |
| `minimax` | 10 | 5 | 0 | 2 | ✓ +20% |
| `minimaxref` | 9 | 4 | 2 | 1 | ✗ +35% |
| `scail` | 9 | 5 | 1 | 1 | ✗ +43% |
| `sdxl` | 7 | 2 | 0 (+1 verify) | 1 | ✗ +49% |
| `sdxlAnime` | 8 | 1 | 0 | 1 | ✓ +20% |
| `flux` | 11 | 1 | 1 | 1 | ✗ +24% |
| `zimage` | 8 | 3 | 0 | 1 | ✓ +15%\* |
| `qwenimg` | 9 | 4 | 2 | 3 | ✗ +50% |
| `krea2` | 7 | 3 | 3 | 1 | ✗ +58% |
| **Total** | **107** | **34** | **13** | **15** | **5 of 12** |

\* against the post-FOLD-IN baseline; the apply pass must re-measure against the live string.

---

## Internal contradictions ruled

**1. Qwen-Image length — system-prompt audit vs the same-day sweep.**
**Ruling: the sweep wins outright, and I verified it at source.** The audit ships "EN ≈200 words" as a
language-wide rule; `prompt_utils_2512.py` puts it in Subtask 1 (Portrait) rule 7 and gives Subtasks 2
and 3 no length rule at all. The audit's `qwenimg` chapter was written against a `_(pending)_` sibling
and says so. **Reconcile before applying.** (Claims #2, #7.)

**2. Qwen-Image portrait order — hard rule or recommendation?**
**Ruling: both, by language, and the audit collapsed them.** ZH rule 6 ends 「人像场景中输出先后顺序按照
上述说明」; EN rule 6 is headed *"Recommended Description Flow"* and ends *"always prioritize a natural
narrative over this rigid structure."* Verified verbatim today. (Claims #5, #8.)

**3. Krea 2 nine slots — checklist or ordering rule?**
**Ruling: checklist yes, ordering no — and the app already shipped the wrong half.** Fill rates
94/94/92/61/56/53/6% and the observed order falsify the 09-03 "in that order" framing against the
vendor's own prompts. FOLD-IN **B4** is recorded APPLIED. **This is a retraction the second apply pass
must make, not merely a change it declines.** (Claims #46, #17.)

**4. Krea 2 length — `krea-character-art.md` §2.3 band vs the harvest.**
**Ruling: the harvest wins; the band is craft.** §2.3 is `[LORE]`; the harvest is a static analysis of an
`[OFFICIAL]` corpus with 42% compliance. `80-140 words` becomes "typical"; the hard number is the
512-position ceiling — which the harvest shows no vendor prompt approaches (≤46-60%), relocating the
cliff risk onto `prompt_enhance` output and vision references. Note this **weakens FOLD-IN D5's
premise**: its character-count advisory fires on a length the vendor never publishes. (Claims #14, #15,
#19.)

**5. Krea 2 licence — picker audit ($1M OFFICIAL) vs the applied app text ("thresholds unverified").**
**Ruling: the picker audit is right on the route and probably right on the number; the app now
under-claims.** `Comfy-Org/Krea-2` is `gated:false` with `LICENSE.pdf` at the root — verified by me.
That is exactly the remedy exclusion **#24** prescribed. **But** "50 seats is *refuted*" must be
restated as "not found in the extracted text", and the applier should re-extract §2.3 itself before
quoting it in the app. (Claims #27, #28, #29.)

**6. LTX enhancer default.** No conflict this round. A6/A10/A11 are applied and the live text is correct
(`:945`, `:1230` both say *"untested"*). The 09-03 ruling #5 stands.

**7. ComfyUI version numbers — digest vs ops file vs app.**
**Ruling: no contradiction; the app is dated.** `comfyui-ops-2026-09.md` anchors at core **v0.34.3
(Sep 2)** / templates **0.11.48**, correct as of its own date. The digest adds four core and three
template releases inside the window. The app repeats the ops anchor with an explicit *"As of Sept 3
2026"* stamp (`:886`) — honest, but four core and nine template releases behind. **STALE, not wrong.**
(Claim #21.)

**8. Krea band audit vs harvest — the app's own two numbers.**
**Ruling: they measure different things and the app does not say so.** `80-140 words` (craft) and
`512 conditioning positions ≈ 2,850 characters` (capacity) must be visibly labelled, or the 7B treats
140 as the safety limit and the validator never warns on the real one.

**9. H3 reference caps — audit snapshot vs live app.**
**Ruling: the audit's snapshot is stale; the apply pass must not regress it.** `minimaxref` row 1 reports
`"12 files max"` as live; it is gone (claim #42). Apply R1's remaining half (drop the "15s total"
figures) without re-applying the caps sentence.

**10. Picker licence rubric — Krea $1M ⇒ `risk` vs LTX $10M ⇒ `ok`.**
**Ruling: the audit is right that the rubric is unwritten and right that it is the priority.** Add: the
`renderPicker` bug it found (`'nc'` and `'ok'` render identically) leaves three non-commercial models
visually indistinguishable from Apache rows. But its `licClass === 'ok'` **false-positive claim on
Illustrious/NoobAI needs re-checking against the live file**, whose row already reads `licClass:'risk'`
— the audit may be describing a pre-apply state.

---

## Applied-edit audit

Ten applied items, live text vs proposed text.

| # | Item | Changelog says | Live text | Verdict |
|---|---|---|---|---|
| 1 | **A3** delete the `orbit` validator error | APPLIED | No orbit ban anywhere; `CAM_MOVE` still *detects* `orbit` / `环绕运镜` as a move, which is correct | **OK** |
| 2 | **A2** Wan `固定镜头` | ALREADY | `TARGETS.wan` emits 固定镜头 | **OK — but see #3** |
| 3 | **(new defect, in none of today's files)** `CAM_FIXED` | not recorded | `:1174` `/(fixed camera\|static shot\|static camera\|no camera movement\|固定机位\|镜头不移动)/i` — **`固定镜头` is absent** | **DEFECT INTRODUCED BY A2.** The wan target now tells the model to emit the one locked-camera token the validator cannot see; it passes today only because the app also emits `镜头不移动`. Add `固定镜头` |
| 4 | **A20-target** SCAIL 704p | APPLIED | Rule fixed at `:680`; **exemplar at `:688` still ends `704p output recommended` on a `MODE: Replacement` case** | **INCOMPLETE — the changelog overstates it** (claim #41). Exclusion #2 residue still live |
| 5 | **A15/B8** H3 reference caps | APPLIED to `TARGETS.minimaxRef` + the GOTCHAS card | No `12 files max` survives | **OK** |
| 6 | **A21** Wan-Dancer picker row | APPLIED | No `Prompt Alignment` string anywhere | **OK** |
| 7 | **A39** Civitai anime claim | APPLIED | No `every top Civitai` string | **OK** |
| 8 | **A29/H8** Krea licence | ALREADY | `:1783` `lic:'Custom (Krea Community License; thresholds unverified)'` | **NOW WRONG in the other direction** — the $1M is verified OFFICIAL (claims #27, #28) |
| 9 | **D1/D2/D3** `sdxlAnime` | APPLIED | `:726` an **ungrammatical, self-negating** Pony-negative sentence; `:734-736` a 3-rung chain **plus an illegal negative block** whose token list matches neither family | **TWO DEFECTS INTRODUCED BY THIS APPLY PASS** (claims #38b, #39). Highest-priority repair in the round |
| 10 | **E1** ComfyUI version anchor | ALREADY | `:886` *"As of Sept 3 2026: core v0.34.3 (Sept 2), … workflow-templates 0.11.48"* | **STALE** — four core releases and nine template releases behind. Date-stamped, so honest; refresh from the digest |

**Additional live defect found while auditing, in none of today's files.**
`PromptStudio.html:2272` — `wfNotes()`:

```js
if (tplKey === 'zimage' || tplKey === 'klein' || tplKey === 'krea') notes.push('No negative-prompt field by design (CFG-free graph uses ConditioningZeroOut).');
```

This teaches `ConditioningZeroOut` as the Krea 2 negative slot, which `krea-character-art.md`
§*Contradicts* #2 and §*Validator changes* both call **unsafe**: with any `_cfg_pp` sampler it produces
a degenerate uncond and visible grain, and the corrected advice is *"connect a real, empty negative — it
costs nothing and cannot break."* The digest's *Tested findings* #1 then adds a **new** core `_cfg_pp`
sampler (`cfgpp_ud10_ab`) to worry about. **Split the `krea` branch out of that line.**

**Did any applied sentence rest on evidence the 09-03 verifier BLOCKED?** One partial. `:881` still
lists *"wrong text encoder pairing (e.g. T5 in both DualCLIPLoader slots)"* among verified black-output
causes. Exclusion **#13** retired *"wrong encoder = black images"* **for klein specifically**, where the
symptom is a `mat1/mat2` matmul error. The surviving sentence is a different, dual-CLIP claim and the
klein wording is gone — **compliant, but load-bearing on an unstated scope**. Add "(not klein — that
throws a shape mismatch)".

---

## Picker corrections cleared for apply

Exact rows the apply pass may take now. Everything else in the picker audit is NOT RE-FETCHED by me or
held below.

| Row | Field | Change cleared | Basis |
|---|---|---|---|
| LongCat-Image | `speed` | `'fast'` → a string naming the official recipe, e.g. `'slow (official: 50 steps, CFG 4.0)'` | Card quick-start re-fetched today: `num_inference_steps=50, guidance_scale=4.0, enable_cfg_renorm=True` |
| LongCat-Image | `warn` | add: quoting is **mandatory** for text — *"Failure to use explicit quotation marks … will severely compromise the text rendering capability"* | Card, verbatim, re-fetched today |
| LongCat-Image | `min`/`comfy` | `6`/`10` → **delete the numbers or quote the comment**; do not assert 16/24 as measured | Comment re-fetched (`Required ~17 GB`) but **the unit is unstated in the source** (claim #30) |
| LongCat-Image | `lic` | keep `Apache 2.0` | Front-matter `license: apache-2.0`, re-fetched today |
| Krea 2 | `lic` | `'…thresholds unverified'` → a string carrying the **$1M trailing-12-month company-wide revenue** cap, once the applier re-extracts §2.3 itself | `Comfy-Org/Krea-2` `gated:false` + `LICENSE.pdf` present, verified by me; PDF text NOT re-fetched |
| Krea 2 | `lic` | **do not** write "no seat limit" or "50 seats refuted" | Absence over a PDF extraction (claim #29) |
| MiniMax H3 | `min`/`comfy` | **delete `48`/`80`** — the row contradicts its own `warn` ("480p+audio on ~12 GB VRAM") | Internal contradiction, checkable in the live file (claim #37) |
| MiniMax H3 | `min`/`comfy` | **hold** the replacement `12`/`16` | Rests on 未公布 quotes unfetched across two rounds (09-03 ruling #6) |
| Wan2.2-Animate-2 | `warn` | `"3 weeks in"` → date-relative or `"~5 weeks in"` | Arithmetic from a release date already in the corpus; live at `:1746` |
| LTX 2.3 | `warn` | remove `"Negatives are inert (CFG 1)"` | Binding exclusion **#11**; the same downgrade is already live in `GOTCHAS` (`:945`) and `validate()` (`:1230`), so the picker row is an internal inconsistency |
| SCAIL-2 | `warn` | remove `"Prompt-inert"` → prompt-**subordinate** | Verifier #2/#5, FOLD-IN A18, already applied elsewhere in the app |
| all rows | structure | adopt the audit's **one-precision-per-row** rule; make `disk` the complete set the official template loads | Verifiable from the rows themselves; the highest-value change in the picker audit |
| `renderPicker` | render | give `licClass:'nc'` its own badge | Read the code — only `'risk'` is styled |
| `WF_TEMPLATES` | — | **no change** — all seven templates NO DRIFT | Method sound (two-to-three independent reads); NOT RE-FETCHED by me (claim #53) |

**Not cleared** (one fetch each would settle them): klein 9B `comfy` 16→24-32 · klein 4B `comfy` 8→12 ·
Qwen-Edit-2511 `comfy` 16→24 · Z-Image Turbo `disk` · every HF-tree byte count · the Illustrious/NoobAI
`lic` string · the `licClass === 'ok'` false-positive claim (the live row already reads `risk`).

---

## Items the apply pass must NOT use

The 34 entries in `verification-2026-09.md` §*Items the synthesis agent must NOT fold in* remain
**binding and unamended**. These are additional.

1. **`TARGETS.qwenimg` Q1 as written** — "English targets about 200 words" as a language-wide rule. It
   is portrait-scoped. Use `qwen-image.md` X1's three-way formulation.
2. **`TARGETS.qwenimg` Q6 as written** — ethnicity → gender → age as a hard order for English output.
   The English rewriter explicitly overrides it.
3. **"the official rewriter … never appends it; it is dead code"** as a general statement about
   `magic_prompt`. True of 2512 only.
4. **Krea 2's nine descriptor slots "in that order."** Falsified against the vendor's own 36 prompts.
   Keep the checklist; **retract the ordering half of the already-applied FOLD-IN B4.**
5. **`matte surface` / `no specular highlights` / `dry pigment finish` / `flat graphic design`** as Krea
   vendor vocabulary. Zero occurrences in 36 official prompts.
6. **`80-140 words` as a Krea 2 rule.** 42% compliance against the vendor's own gallery (10-230 words).
7. **"Output ONLY the paragraph" as the only legal Krea 2 form.** 15/36 official prompts carry a style tail.
8. **Wan "the ZH exemplars carry 9-11 aesthetic tokens" / "Chinese may run to ~10."** Verifier #40
   counted 9/11/7. This is the ZH twin of binding exclusion #7.
9. **`arc shot` as the sole English gloss for 环绕运镜**, with `orbit` omitted — exclusion #6's deleted
   doctrine surviving as a word list.
10. **The Ref2VA 16:9 / 9:16 restriction at `[OFFICIAL-3P]`.** Exclusion #21 rules it `[LORE]` by name.
11. **"Rendered text goes at the FRONT of the prompt" as a general SDXL rule.** One sentence from the
    Ragnarok guide's *Metallic Typography* example (process defect #62).
12. **"The `50 seats` is refuted."** Restate as *"not found in the extracted text of `LICENSE.pdf` v.1
    (2026-06-22)"*.
13. **SenseNova U1.5 "licence text ✅".** Only the HF `license:apache-2.0` **tag** was read. Fetch the
    LICENSE file — this is the SCAIL-2 tag-vs-text trap again.
14. **Meta-parentheticals inside worked `Example output:` blocks** (`minimaxref`, `scail`). A 7B copies
    exemplar shape; these will appear in user output.
15. **The audit's `qwenimg` chapter as a whole**, until reconciled with `research/qwen-image.md`
    §*2026-09-10 sweep*. Where they differ, the sweep is authoritative.
16. **Any of the seven length-budget breaches shipped as-is.** Take the audit's own §C-9 fix — hoist the
    shared TIMING-WORDS, weighting-behaviour and negative-guidance blocks into a common prefix — before
    granting per-target exceptions.
17. **`ConditioningZeroOut` as the Krea 2 negative slot** (live at `PromptStudio.html:2272`).
18. **R1's caps sentence re-applied.** "12 files max" is already gone; do not duplicate.
19. **MiniMax H3 `min:12 / comfy:16`** as the replacement for 48/80. Delete the wrong numbers now; hold
    the replacements.
20. **The digest's "local:partner ratio 6:8"** without stating the counting convention; every-bullet
    counting gives 6:9, and four of the six "local" items are updates to models already in core.

---

## Sources

All accessed **2026-09-10**.

**Re-fetched and verified at source**
- `https://raw.githubusercontent.com/QwenLM/Qwen-Image/main/src/examples/tools/prompt_utils_2512.py`
  — read in full: both system prompts, all three subtasks, both `magic_prompt` assignments, `rewrite()`
- `https://docs.comfy.org/changelog` — v0.35.0, v0.34.6, v0.34.5, v0.34.4, v0.34.3 blocks
- `https://huggingface.co/api/models?search=SenseNova-U1.5&sort=lastModified&limit=20`
- `https://huggingface.co/api/models/Comfy-Org/Krea-2` (`gated:false`; `siblings` includes `LICENSE.pdf`)
- `https://huggingface.co/meituan-longcat/LongCat-Image/raw/main/README.md`

**Recomputed locally (deterministic, re-runnable)**
- The 36 Krea prompts parsed out of `research/_addenda/krea-character-art.md` lines 1361-1545 and
  re-measured: counts, word/character distributions, quantiles under two conventions, the family-A/B
  split, tail incidence, prose-vs-comma-run classification, quote incidence, LoRA-trigger incidence,
  quality-tag incidence, weighting-paren incidence, `matte` and `solid … background` incidence.

**Read locally, read-only**
- `research/_addenda/system-prompt-audit-2026-09-10.md` (all 1,639 lines)
- `research/qwen-image.md` §*2026-09-10 sweep* · `research/_addenda/krea-character-art.md`
  §*2026-09-10 official prompt-pair harvest* · `research/digests/2026-09-10-digest.md` ·
  `research/_addenda/template-picker-audit-2026-09-10.md` · `docs/CHANGELOG-2026-09-10.md`
- `research/_addenda/verification-2026-09.md` (all 590 lines; its 34-item exclusion list is binding)
- `research/_addenda/comfyui-ops-2026-09.md` (version anchor only)
- `docs/RESEARCH-PLAN-2026-09.md` (operating rules; rule 7 tooling notes)
- `PromptStudio.html` — `TARGETS` (529-821), `KNOWLEDGE` (823-889), `GOTCHAS` (892-950),
  `CAM_FIXED`/`CAM_MOVE` (1174-1175), `validate()` (1230, 1277, 1370, 1408), `MODELSPEC` (1724-),
  `wfNotes()` (2272)

**Not attempted** (standing refusals, `RESEARCH-PLAN-2026-09.md` rule 7): civitai.com, civitai.red,
Reddit, Discord, web.archive.org. **No absence claim in this file depends on them.**

**Sampled but NOT RE-FETCHED** (recorded so nobody assumes they were checked): the legacy
`prompt_utils.py`; the MiniMax H3 "base guide" §2.2/§4.2/§4.3/§4.4; `Comfy-Org/Krea-2/LICENSE.pdf` text;
the `krea/Krea-2-Turbo` card body at `665ef38`; the Alibaba prompt guide; every HF-tree byte count in
the picker audit; the RealVisXL, Illustrious v2.0 and Qwen-Image-Edit-2511 cards;
`docs.comfy.org/tutorials/image/qwen/qwen-image-2512`; the seven upstream workflow templates;
`Lightricks/LTX-2.5-22b-IC-LoRA-Pixel-Spatial-Upscaler`.
