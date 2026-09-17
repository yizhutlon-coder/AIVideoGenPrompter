# Western sweep 2026-09-17

Agent B (Western/English depth sweep). Prior digest **2026-09-13** → news window is **4 days**
(2026-09-13 → 2026-09-17). Access date for everything below is **2026-09-17** unless stated.

**Standing expectation, stated up front:** a four-day window is not a news window. The "News delta"
section below is deliberately thin and is **not** padded. The budget went to the named depth targets:
the licence-gated LTX Pixel-Spatial-Upscaler card (Priority 1), the LTX-2.5 text-encoder commit
`1b92891` (Priority 2), the open LTX threads and a `[STAFF]` top-up (Priority 3), the ComfyUI /
template delta (Priority 4), and SenseNova U1.5 + arXiv (Priority 5).

**Headline findings, for the digest writer:**

1. **Priority 1 is a clean negative — both `art-alex` `[STAFF]` claims survive**, and one is now
   corroborated by the vendor's own card. The 09-10 card edit changed nothing that bears on them (§2).
2. **The method changed.** Licence-gated HF cards are readable at `…/blob/main/<file>`; `…/raw/main/…`
   and `…/commits/…` are empty. This unlocked the **27.1 kB `Lightricks/LTX-2.5` card the corpus had
   never read** (§2.0, §10.2a).
3. **HF discussion comment anchors are ObjectIds and decode to exact UTC timestamps** — validated
   against three known corpus dates. This retires the 09-10 "HF surfaces disagree about dates" errata
   (§3.1, §10.2b).
4. **The `1b92891` quarantine should be retracted, not dated.** Its single source said the *opposite*
   eight days earlier, and later said the defect appears with both encoders (§3, §8.1).
5. **The window is not empty.** ComfyUI **v0.35.2 (09-14)** and **v0.36.0 (09-15)** both shipped, with
   **FastVideo FastH3** — a new locally-runnable H3 derivative with a ComfyUI-native prompt path (§1).
6. **Lightricks publishes an official LTX-2.5 prompt guide the corpus does not have**, and it
   contradicts the 09-13 digest on paragraph packaging while supplying the conditional that reconciles
   both positions (§8.3).
7. **Lightricks' own Diffusers example ships an inert negative prompt** at `guidance_scale=1.0` on the
   *distilled* path — the false affordance is in vendor reference code, not just ComfyUI templates (§8.2).
8. **SenseNova U1.5's English prompt dialect is now sourced** (§6), and `docs.comfy.org` provably has
   **no** U1.5 tutorial (§6.7).

---

## 1. News delta 2026-09-13 → 2026-09-17

**The window is NOT empty.** The brief predicted "nothing moved"; that prediction is wrong, and the
reason is instructive — the 09-13 digest's own nothing-found register recorded `docs.comfy.org` as
**"not reached behind the provenance gate"**. It was reachable this run, and it had **two releases
inside the four days**.

| Item | Date | Grade | In window? |
|---|---|---|---|
| **ComfyUI v0.35.2** | 2026-09-14 | `[OFFICIAL]` | ✅ |
| **ComfyUI v0.36.0** | 2026-09-15 | `[OFFICIAL]` | ✅ |
| `comfyui-workflow-templates` **v0.11.60** (in v0.35.2) | 2026-09-14 | `[OFFICIAL]` | ✅ |
| `comfyui-workflow-templates` **v0.11.62** (in v0.36.0) | 2026-09-15 | `[OFFICIAL]` | ✅ |
| `Comfy-Org/docs` PR **#1674** — v0.35.1 notes back-filled | merged 2026-09-14 | `[OFFICIAL]` | ✅ |
| **FastVideo FastH3** support + tutorial + template | 2026-09-15 | `[OFFICIAL]` | ✅ |
| **YuE2** music model support + tutorial + template | 2026-09-15 | `[OFFICIAL]` | ✅ |
| **Marigold V2** support | 2026-09-15 | `[OFFICIAL]` | ✅ |

Source for all: <https://docs.comfy.org/changelog>, accessed 2026-09-17; PR body at
<https://github.com/Comfy-Org/docs/pull/1674>, accessed 2026-09-17.

**Nothing moved on the model-vendor side.** No new LTX repo, card revision, or discussion reply inside
the window (§2.4, §4). No new LTX release note. Details and the surfaces searched are in §9.

### 1.1 The one genuinely new in-scope open-weight model: **FastVideo FastH3**

`[OFFICIAL]` *"FastVideo 8-step distilled MiniMax H3 for text-to-video and image-to-video with native
audio"* — ComfyUI v0.36.0, 2026-09-15, with a **first-party tutorial already published**:
<https://docs.comfy.org/tutorials/video/minimax/minimax-h3-fastvideo.md>, described as *"Generate
MiniMax H3 video with synchronized audio in 8 sampling steps in ComfyUI using the FastVideo FastH3
distilled checkpoint: text-to-video and first/last-frame workflows."*

**Why this matters for prompting, not just the register.** It is the **third** H3 derivative in three
weeks (VDN-H3 09-07, H3-World 09-09, FastH3 09-15) and the **first one with a ComfyUI-native path**,
which means — unlike VDN-H3's two-stage `encode_prompt.py → .pt` route — **a student can type a prompt
into the sampler**. It is also an **8-step distilled** model, so by the 09-13 digest's own
"CFG≈1 ⇒ negatives inert" physics rule it should be assumed negative-inert until shown otherwise.
`[SYNTHESIS]` **Weights/licence not verified this run** — do not promote it past "register it" until
someone reads the FastVideo checkpoint's licence.

### 1.2 **YuE2** — a music-generation prompt dialect arrives in ComfyUI

`[OFFICIAL]` *"YuE2: Music generation from style prompts and lyrics"* (v0.36.0), max song duration
raised to **900 seconds**, tutorial at <https://docs.comfy.org/tutorials/audio/yue2/yue2.md>:
*"Generate complete songs with vocals in ComfyUI using the open-source YuE2 model: text to music with
ABC planning, and melody-preserving covers with SheetSage2."* **A two-field prompt dialect (style
prompt + lyrics) plus an "ABC planning" intermediate** is a genuinely new prompt shape for this corpus,
which has no audio-model dialect at all. **Out of scope for a video/image prompt tutor as currently
framed, but flagged as a scope decision for the maintainer, not a silent omission.**

### 1.3 Prompt-relevant node changes in window (v0.35.2 + v0.36.0)

- **Video Concatenate** (PR #16267) — *"Join multiple video clips end to end."* Relevant to the LTX
  multishot/extend teaching: stitching is now a core node, not a custom pack.
- **Generic Loops** (PR #16227) — *"Loop over lists in the graph, carry heterogeneous items through
  every iteration, and declare loop boundaries in node schemas."* This is the cleanest first-party
  route to **prompt sweeps** (the same seed × N prompt encodings) that the corpus's in-house test kit
  needs. **Recommend the test-kit addendum consider it.**
- **Gemini V3 node / GeminiNodeV3, V2 deprecated** (PR #16287, in both v0.35.2 and v0.36.0) — matters
  only because LTX's prompt-enhancer story and the `LTX Gemma API Text Encode` node sit in the same
  family; no LTX change implied.
- **`Add Noise` alpha fix** (PR #15626), **H3 Fun ControlNet + compiler fix** (PR #16240),
  **MiniMax-H3 VAE memory** (PR #16187) — not prompt-relevant, listed for completeness.

**Partner / API nodes, one line each (cloud-rewriter rule applies — any tutorial output from these
demonstrates a hosted pipeline, not a local model):** Tripo P2 (3D); Pruna P-Video-2 (720p/1080p T2V
and I2V, draft mode); **Flux Video Edit** — *"Edit a source clip from a text instruction: remove or
replace objects, restyle footage, change on-screen text or dialogue"*, i.e. an **instruction-style**
video-edit prompt dialect, **API-only**; Bria edit suite + Video Eraser; partner progress estimates.

## 2. LTX Pixel-Spatial-Upscaler card — did it change?

### 2.0 The method that worked — and it is *not* the one the brief predicted

The brief's method was "get a SHA from `/commits/main`, then read `…/raw/<SHA>/README.md`". **That
route is dead on these repos:** `…/commits/main`, `…/commits/main/README.md` and `…/commit/<SHA>`
**all return HTTP 200 with an empty body** on both `Lightricks/LTX-2.5-22b-IC-LoRA-Pixel-Spatial-Upscaler`
and `Lightricks/LTX-2.5` (accessed 2026-09-17). Gated repos appear to suppress commit history to
logged-out fetches the same way they suppress `…/raw/main/…`.

**What *does* work, and is much cheaper: the ordinary `…/blob/main/README.md` HTML page.** It renders
the **entire model card body**, including the YAML front-matter block, for a licence-gated repo, with
no SHA needed and no login. The same page also prints the **latest commit SHA and author** for that
file in its header. Two gated LTX cards were read in full this way this run — the adapter card and the
27.1 kB `Lightricks/LTX-2.5` card, **which the corpus had never read**.

> **Standing tooling rule to adopt:** on a gated HF repo, `…/raw/main/<file>` is empty and
> `…/commits/…` is empty, but **`…/blob/main/<file>` renders the file**. Use the blob page first; the
> commit-pinned raw URL is a fallback, not the primary.

### 2.1 Current card state

- Repo: `Lightricks/LTX-2.5-22b-IC-LoRA-Pixel-Spatial-Upscaler`, licence `ltx-2-community-license`
  (note: the **adapter** declares `ltx-2-community-license` / `LICENSE.md`, while the **base**
  `Lightricks/LTX-2.5` declares `ltx-2.x-community-license-agreement` / `LICENSE-2_x` — the 09-13
  digest's "two different slugs" open item is **re-confirmed**, now with both `license_link` targets:
  `github.com/Lightricks/LTX-2/blob/main/LICENSE.md` vs `…/blob/main/LICENSE-2_x`). `[OFFICIAL]`
- Latest commit touching `README.md`: **`74c4e68ee7dd99f3997d5a1bb1a3784941822222`**, author
  **`art-alex`** (LTX.io org), message *"Update README.md"*, marked `verified`. The commit **date is
  not obtainable** — see 2.0. The HF API `lastModified` recorded by the 09-10 sweep
  (**2026-09-10T09:13:23Z**) remains the only hard timestamp for this edit.
  <https://huggingface.co/Lightricks/LTX-2.5-22b-IC-LoRA-Pixel-Spatial-Upscaler/blob/main/README.md>,
  accessed 2026-09-17. `[OFFICIAL]`

### 2.2 The verdict on the two `[STAFF]` claims — **both still hold. Negative result.**

*(Brief called these "row 5"; in `staff-claims-2026-09.md` they are **row 4**. Row 5 is the separate
before/after rewrite. Minor citation errata for the digest.)*

**Claim A — "the Pixel Spatial Upscaler needs no trigger phrase."** **SURVIVES, and is now
corroborated `[OFFICIAL]` by the card itself.** The card as it stands after the 09-10 edit contains
**no trigger word, no trigger phrase, and no "Trigger" section of any kind**. Its only prompt-adjacent
statements are structural:

```text
The model is an in-context LoRA: instead of taking only a text prompt, it also consumes a
**reference video** in context alongside the noisy latents being denoised.
```

and the vendor's own CLI snippet on the same repo passes a bare placeholder:

```text
uv run python -m ltx_pipelines.ic_lora \
    --lora models/LTX-2.5-22b-IC-LoRA-Pixel-Spatial-Upscaler/<weights>.safetensors 1.0 \
    --video-conditioning reference.mp4 1.0 \
    --prompt "your prompt here" \
    --output-path output.mp4
```

No trigger token is prepended anywhere. `[OFFICIAL]` (repo "Use this model" panel, accessed
2026-09-17). **Validator note:** `ltx23.md:509` V13 must not demand a trigger for this adapter —
unchanged from the 09-03 finding, now on firmer ground.

**Claim B — "the correct prompt is the source video's own prompt / a detailed caption of it."**
**NOT contradicted, and NOT confirmed.** The revised card is **silent on prompt content**. It never
says what to write in `--prompt`. So `art-alex`'s discussion answer remains the **only** source for
claim B, and it remains the operative guidance. Nothing in the 09-10 revision touches it.

### 2.3 What the revised card *does* say that the corpus does not have

All `[OFFICIAL]`, same URL and access date.

1. **A guidance/steps ↔ fidelity trade-off, stated as a prompt-adjacent knob:**
   ```text
   The level of fidelity to the original can be traded off via generation parameters (guidance and
   step count in particular). Fewer steps and lower guidance keep the output closer to the reference;
   more steps and higher guidance allow more creative hallucination of detail.
   ```
   This is the **first vendor statement in the corpus that guidance is a live knob on an LTX-2.5
   path** — it sits against the distilled path's fixed `CFG=1`. See §8.
2. **Hard control-signal constraints** that a student will otherwise violate:
   `reference_downscale_factor: 2` carried in the model's own metadata; *"the reference must cover the
   same shot, duration and framing as the intended output. This is not an inpainting or reframing
   model — changing the aspect ratio or crop between reference and target degrades results."*
3. **Recommended flow names a base resolution:** *"generate your video at a low base resolution
   (~280p) until you are satisfied with composition and subject motion, then feed that clip as the
   reference and run the 2x upscaler."*
4. **Out of scope, verbatim:** *"This is not a blind denoiser or a compression-artefact remover… not
   intended for upscaling live-action footage where factual fidelity to the source matters."*
5. **Adapter rank 32, BF16, LoRA strength `1.0`** — *"The weights ship pre-scaled so that full
   strength is the intended default."*
6. **A first-party numeric conflict.** The card says strength **`1.0`**; the `Lightricks/LTX-2.5`
   repo's own download snippet says
   `# DFR requires the detailing IC-LoRA (separate repo; strength is fixed at 0.5)`. Grade the second
   one carefully: HF "Use this model" snippets are generated from `huggingface.js` library metadata,
   so it is **not necessarily vendor-authored** — `[LORE — HF-generated snippet]` against
   `[OFFICIAL]` card text. Flagged, not resolved.
7. **Docs domain drift:** the adapter card links IC-LoRA docs at `docs.ltx.video/...`; the base card's
   header links `docs.ltx.io`. Both are live-looking first-party domains. Record both.

### 2.4 Discussion-tab state on that repo

`Community 3` — **#3 "What is the prompt for this LoRA?" (2 replies, the `art-alex` answer), #1 "Any
plans for 4x?" (1 reply), one closed (#2).** **No new thread since the 09-03 harvest**, and no new
staff reply. <https://huggingface.co/Lightricks/LTX-2.5-22b-IC-LoRA-Pixel-Spatial-Upscaler/discussions>,
accessed 2026-09-17.

---

## 3. LTX-2.5 commit `1b92891` dated

### 3.1 A hard upper bound, via a new dating method

The commit page itself is unreadable (§2.0: `…/commit/<SHA>` returns an empty body on this gated repo,
and the URL was additionally refused by the provenance gate — see §10). **But the commit can still be
bounded hard, because the thread that cites it can be dated exactly.**

> **New method — HF discussion comment anchors are MongoDB ObjectIds.** Every reply permalink on an HF
> discussion page ends in a 24-hex-char anchor (e.g. `#6a8dc0d55606db3b2f622e07`). The **first 8 hex
> characters are a big-endian Unix timestamp**. Decoding them yields the comment's **exact UTC creation
> time** with no dependence on HF's relative labels.

**Validation of the method against known corpus values** (all from
<https://huggingface.co/Lightricks/LTX-2.5/discussions/62> and
<https://huggingface.co/Lightricks/LTX-2.5-22b-IC-LoRA-Pixel-Spatial-Upscaler/discussions/3>):

| Anchor | Decoded UTC | Corpus value | Match? |
|---|---|---|---|
| `6a8c3aaa3a77b9d453fc5a6a` (art-alex, IC-LoRA no-trigger, STAFF row 4) | **2026-08-24 12:35:54Z** | `~2026-08-24` | ✅ exact |
| `6a8d66189fa36373d1e158ec` (art-alex, reference prompt, STAFF row 6) | **2026-08-25 09:53:28Z** | `~2026-08-25` | ✅ exact |
| `6a8dc0d55606db3b2f622e07` (art-alex, before/after rewrite, STAFF row 5) | **2026-08-25 16:20:37Z** | `~2026-08-25` | ✅ exact |

The method reproduces the 09-03 harvest's reconciled dates to the day. **It is trustworthy and should
become standing practice** — it retires the whole "two HF surfaces disagree about a thread's date"
problem recorded in the 09-10 errata.

### 3.2 The bound

`kabachuha`'s opening post of `discussions/62`, which says *"Seeing and testing the changes in
[commit `1b92891…`]"*, decodes to **`6a871efadeedb13930ba6114` → 2026-08-20 15:36:26Z**.

**Therefore commit `1b92891cedc4a823c35a3b23588d7a57a3a23c65` was pushed on or before
2026-08-20 15:36 UTC.** `[SYNTHESIS]` — a hard upper bound from a first-party timestamp, not a
relative label. Corroborating context: LTX-2.5's public release was **2026-08-11**
(<https://comfyui-wiki.com/en/news/2026-08-11-ltx-2-5-open-weights-release>, `[LORE — third-party
news]`), so the commit falls in the window **2026-08-11 → 2026-08-20**.

**What this does to the quarantine.** The 09-13 digest said *"quarantine any LTX-2.5 prompt verdict
after that date."* The date is **~08-20, nine days after launch** — so the quarantine does **not**
carve a small recent slice out of the corpus; it covers **essentially the entire period in which the
corpus formed its LTX-2.5 prompt positions**, including the 09-03 `[STAFF]` harvest (08-24/08-25) and
every LTX-2.5 community report the corpus cites. The practical consequence is the opposite of a
quarantine: **almost nothing is on the clean side of the line**, so the line cannot be used to
partition evidence. Recommend the digest **replace the date-based quarantine with a per-claim
"which encoder file was loaded?" question**, which no source we hold answers.

### 3.3 What files it touched — **unknown, and the surfaces that would say are empty**

`kabachuha` (a community user, not staff) characterises it as a text-encoder checkpoint swap. That is
**the only description of the commit's contents anywhere reached this run**. `[LORE]`

### 3.4 Has Lightricks acknowledged it? — **No. Vendor silence is now positively evidenced.**

This is a firmer negative than the 09-13 digest had. `art-alex` (LTX.io org) **is present in the very
thread** where the accusation is made, and **replies twice**, and **never addresses the checkpoint**.
Verbatim, his first reply (`6a8d66189fa36373d1e158ec`, 2026-08-25 09:53:28Z), answering the
"wrong checkpoint" message directly:

```text
@kabachuha ,
Can you please elaborate on your comment? What are the issues you are experiencing with the prompt
adherence and which artefacts do you see?
Can you please provide the prompt and your setup?
Did you try to run the official LTX-2 inference pipeline:
```

He then pastes the official `ltx_pipelines.distilled` invocation and the reference prompt. **At no
point does he confirm, deny, or explain the re-upload.** `[STAFF]` — and the *absence* inside a staff
reply is stronger evidence of non-acknowledgement than silence on a surface staff never visited.

**An important qualifier the corpus does not have.** The accuser himself says the defect is **not**
specific to the new file. Verbatim (`6a8d720df632caf494b635ad`, 2026-08-25):

```text
Hi! There are extremely huge problems with object permanence, both with the old and with the new
text encoders.
```

`[LORE]` So the *"mismatched checkpoint causes weird prompt following"* story is **weakened by its own
source**: the complained-of behaviour is reported on **both** encoder files. Grade the mismatch as
`[LORE — single user, self-undercut]`, not as an established confounder.

The original claim, verbatim, for the record (`6a8d58e9b9f5d325a1b284d2`, **2026-08-25 08:57:13Z** —
note the 09-13 digest carried no date for it):

```text
They uploaded an entire wrong checkpoint, which was not synchronized with the video model, resulting
in artifacts and really weird prompt following
```

**Second-user corroboration is weaker than recorded.** The "independently noticed by a second user"
in the 09-13 digest is `Ravan` (`6a8d138eb29185dc7adaebfd`, 2026-08-25 04:01:18Z), whose actual words
are a **question, not an observation**:

```text
hi did you notice any difference in their latest change in text encoder .Didnt understand why they
uploaded new text encoder and didnt gave us any details .
```

`[LORE]` He noticed **an undocumented re-upload**, not a defect. **Correct the digest:** one user
reports a defect; a second user reports only that the upload happened without release notes.


## 4. STAFF hunt

### 4.1 Result: **no new `[STAFF]` claim in the window.** But three upgrades to existing rows.

The brief's method — open threads whose *titles* read as **architecture complaints** — worked again,
and it produced the thread that dominates this report (`LTX-2.5/discussions/62`, "Any chance for a
bigger text encoder…"). But **every staff reply in it is dated 2026-08-24/25**, i.e. **three weeks
before the window opens**. The window itself contains **no maintainer-authored prompting statement on
any surface reached**.

### 4.2 New / upgraded rows, in `staff-claims-2026-09.md` table shape

| # | Model | Claim | Who + role evidence | Verbatim quote | URL | Date | Corpus effect |
|---|---|---|---|---|---|---|---|
| **N1** | **LTX-2.5 IC-LoRA Pixel Spatial Upscaler** | The adapter genuinely ships **no trigger phrase** — the vendor's own card and CLI omit any trigger. | **Model card + repo "Use this model" panel** (vendor-authored card; the CLI snippet is HF-generated — see caveat) | `--prompt "your prompt here"` (no trigger token anywhere in the card or snippet); card has **no Trigger section** | <https://huggingface.co/Lightricks/LTX-2.5-22b-IC-LoRA-Pixel-Spatial-Upscaler/blob/main/README.md> | card state as of 2026-09-17 (edit `lastModified` 2026-09-10T09:13:23Z) | **UPGRADES `staff-claims` row 4 from `[STAFF]` to `[STAFF]` + `[OFFICIAL]` corroboration.** Validator V13 (`ltx23.md:509`) confirmed safe. |
| **N2** | **LTX-2.5 (distilled)** | The distilled transformer runs a **fixed 8-step schedule at CFG = 1**, stated by the vendor in the checkpoint table. | `Lightricks/LTX-2.5` model card, `art-alex` is the card's committer (`5e6e710`, LTX.io org) | "Distilled DiT (bf16). **Fixed 8-step schedule, CFG=1.**" | <https://huggingface.co/Lightricks/LTX-2.5/blob/main/README.md> | accessed 2026-09-17 | **NEW `[OFFICIAL]` anchor** for the 09-13 digest's promoted physics rule "CFG≈1 ⇒ negatives inert". The corpus previously inferred this; the vendor now states it in the model-family table. |
| **N3** | **LTX-2.5** | Vendor states outright that **prompting style, not prompt content, drives adherence**. | `Lightricks/LTX-2.5` model card, Limitations section | "**Prompt following is heavily influenced by prompting style.**" | same as N2 | accessed 2026-09-17 | **NEW.** The single most quotable one-line vendor justification for the whole app. Nothing in the corpus carries it. |
| **N4** | **LTX-2.5** | Duration is **derived from the prompt** when `--num-frames` is omitted. | same card | "Omit `--num-frames` to let the duration head pick a length from the prompt (LTX-2.5+)." · `model_patches/ltx-2.5-duration-head-bf16.safetensors` — "Auto duration when `--num-frames` omitted" | same as N2 | accessed 2026-09-17 | **SHARPENS** the corpus's Auto-Duration note: the prompt is an *input to the frame count*, which is why an under-filled long prompt "freaks out" (`[LORE]`, 09-13 item 6). The two findings now have a mechanism between them. |

### 4.3 A `[STAFF]`-adjacent **negative** worth recording

`art-alex` (LTX.io org) **replied twice in the thread accusing Lightricks of shipping a broken
text-encoder checkpoint and addressed neither the accusation nor the re-upload.** See §3.4 for the
verbatim. This is a *documented* non-acknowledgement rather than an absence of coverage, and it is the
strongest form the "vendor silent" claim can take.

### 4.4 Tabs actually checked this run (name every one)

| Surface | Result |
|---|---|
| `Lightricks/LTX-2.5/discussions` (full open index, 47 threads listed, "View closed (18)") | Newest: **#67 "Feature Request: Project-Based Character Memory with Smart Extend"** (0 replies) and **#66 "LTX-2.5"** (1 reply). **No staff reply visible on any in-window thread.** |
| `Lightricks/LTX-2.5/discussions/62` ("Any chance for a bigger text encoder…") — **read in full** | 22 comments. **Two `art-alex` (LTX.io org) replies, both 2026-08-25.** Out of window. Mined in full (§3, §8). |
| `Lightricks/LTX-2.5/discussions/48` ("Are I2V & T2V workflows actually different?") | **See §4.5 — served stale, question still unanswered on the copy served.** |
| `Lightricks/LTX-2.5/discussions/38` ("Atrocious model — object permanence/consistency is nonexistent") — **read in full** | **Zero staff replies.** Two `kabachuha` posts only. Contains the encoder recantation (§8.1). |
| `Lightricks/LTX-2.5-22b-IC-LoRA-Pixel-Spatial-Upscaler/discussions` | 3 threads (2 open, 1 closed). **Nothing new since 2026-08-28.** No new staff reply. |
| `Lightricks/LTX-2.5-Pre-Trained/discussions` | **Community tab shows no count at all — zero threads.** New repo, no discussion surface activity. |
| `art-alex/activity/community` | **NOT REACHED** — refused by the provenance gate (§10). The 09-03 harvest's highest-yield technique was unavailable this run. |
| `Cxxs`, `QJerry`, `DyJiang`, `KandooAI`, `SG_161222`, `L_A_X` profiles | **Still unchecked, still not empty.** Third run running. Same cause: each needs a minted URL and the fetch budget went to Priorities 1–4. |
| Wan-AI / black-forest-labs / Qwen / Tongyi-MAI / zai-org tabs | **Not searched this run.** Unchanged from the 09-13 register. |

### 4.5 `discussions/48` — answered? **Cannot be determined; the detail page is cache-stale, and it is out of window regardless.**

Two contradictory readings, both from today:

- **Discussions index** (accessed 2026-09-17): the row reads **`Are I2V & T2V workflows actually
  different? 2`** — a reply count of **2**.
- **Thread detail page** (accessed 2026-09-17): renders **only the opening post**, "opened 3 days ago",
  with **no replies at all**, and a page chrome that is visibly an older snapshot — it reports
  `Community 54` and licence slug `ltx-2-community-license-agreement`, while the live index reports
  `Community 73` and `ltx-2.x-community-license-agreement`.

**The date is now settled, though, and it settles the 09-10 errata.** The OP anchor
`#6a811f07845a39b1ec06d287` decodes to **2026-08-16 02:23:03Z**. So the thread is **a month old** —
neither "3 days ago" (detail page) nor "21 days ago" (index) is correct. **Both HF relative labels are
wrong; the ObjectId is right.** The underlying prompt-relevant question (any under-the-hood I2V/T2V
difference beyond the `Switch to Text to Video` boolean) is **still open in the corpus** and was **not
resolvable** from a stale page.

**Bonus finding from the stale render:** it preserves an **older licence slug**
(`ltx-2-community-license-agreement`) for `Lightricks/LTX-2.5`, whereas the live repo shows
`ltx-2.x-community-license-agreement`. Combined with `LTX-2.5-Pre-Trained` still declaring
`ltx-2-community-license-agreement` and the IC-LoRA declaring plain `ltx-2-community-license`, the
09-13 "two slugs" open item becomes a **three-slug, drifting-over-time** item: Lightricks **renamed the
LTX-2.5 licence slug** at some point after 2026-08-16 and did not propagate it to sibling repos.
`[OFFICIAL]` **Do not assert one $10M gate across the LTX family without diffing `LICENSE.md` against
`LICENSE-2_x`.**

---

## 5. ComfyUI + templates delta

### 5.1 Releases after v0.35.0

Source: <https://docs.comfy.org/changelog> (clean markdown, fresh — it carries **v0.36.0 dated
2026-09-15**, two days before access). All `[OFFICIAL]`, accessed 2026-09-17.

| Version | Date | Bundled templates |
|---|---|---|
| v0.34.6 | 2026-09-07 | — |
| **v0.35.0** | 2026-09-09 | (baseline; templates 0.11.57 per 09-10 sweep) |
| **v0.35.1** | **2026-09-10** | **0.11.59** (PR #16233) |
| **v0.35.2** | **2026-09-14** | **0.11.60** (PR #16319) |
| **v0.36.0** | **2026-09-15** | **0.11.62** (PR #16350) |

**v0.35.1's body — the 09-10 sweep's open item — is now read.** It is **entirely partner/API**: Tripo
v3 API + Smart Segment; Microsoft MAI Image 2.6 / 2.6-flash on the OpenRouter Image node; MAI auto
aspect ratio; Gemini 3.8 Flash on the Gemini text node; templates 0.11.59. **Nothing prompt-relevant
for local models.** Its provenance is worth noting: the release shipped 2026-09-10 but **was missing
from the changelog until PR #1674 was merged 2026-09-14** — the PR author states it plainly:

```text
ComfyUI v0.35.1 shipped on 2026-09-10 (tag commit Comfy-Org/ComfyUI@856a922be) but the changelog page
jumps from v0.35.0 straight to v0.34.6, so the patch release was never documented.
```

`[OFFICIAL]` <https://github.com/Comfy-Org/docs/pull/1674>, merged 2026-09-14.
**Standing caution for future sweeps: `docs.comfy.org/changelog` can lag a release by four days.**
A "nothing shipped" reading of that page is only ever a lower bound.

### 5.2 Template contents — **partially**, and the method that got there

The templates repo itself was **not** diffed (see §9). But the **changelog names what each bump
added**, which is the contents question at one remove:

- **0.11.62** `[OFFICIAL]`: *"Added FastH3 video, Marigold V2 estimation, and YuE2 music templates, and
  updated the Tripo, Gemini, and Ideogram workflows."* → **one new video template family (FastH3)**;
  the rest are partner/3D/audio.
- **0.11.60** `[OFFICIAL]`: *"Updated the bundled workflow templates."* — **contents not stated.** The
  only in-window template bump whose contents are unknown.
- **0.11.59** `[OFFICIAL]`: *"Updated the bundled workflow templates."* — likewise unstated.

**No LTX template change in the window.** The last LTX template-affecting entries are in **v0.35.0**
(LTXV generated keyframes / Freeze Latent, PR #16040; LTXV Add Latent Guide, PR #16176), both already
recorded by the 09-10 sweep. `[OFFICIAL]`

**Unresolved and worth one fetch next run:** whether **Comfy-Org/workflow_templates issue #919** (every
`*ltx2_3*` template ships a prefilled negative wired into a `CFGGuider` at `cfg = 1`, i.e. inert) has
been fixed in any of 0.11.59/.60/.62. **Not checked this run.**

### 5.3 GitHub freshness assertion — **PASSED**

Required by the 09-10 errata. **Test:** fetch `github.com/Comfy-Org/docs/pull/1674` and check whether
it renders a known-recent fact.
**Result:** the page renders the PR as **merged Sep 14, 2026** by `comfyui-wiki`, with the merge commit
`054769c`, the CodeRabbit review, and the full body — **a three-day-old event, inside the window.**
**GitHub HTML PR pages are fresh this run**, in contrast to 2026-09-10 when release listings were ~10
weeks stale. **Scope the assertion honestly: this proves PR/issue *conversation* pages are fresh; it
does NOT re-validate `github.com/.../releases`, `/tags`, `/releases.atom`, or
`raw.githubusercontent.com`, none of which were re-tested this run.**

## 6. SenseNova U1.5 (English side)

**The corpus's #1 open prompt-dialect target moves from "never heard of it" to a sourced, quotable
dialect.** All `[OFFICIAL]` (vendor-authored HF model cards), accessed 2026-09-17.

Primary sources read this run:
<https://huggingface.co/sensenova/SenseNova-U1.5-8B-MoT-SFT> ·
<https://huggingface.co/sensenova/SenseNova-U1.5-8B-MoT-LoRAs/blob/main/README.md>
(both carry the identical English card body as the final `SenseNova-U1.5-8B-MoT` repo).
Licence **Apache-2.0** throughout — re-confirming the 09-10 finding. Paper `arXiv:2605.12500` is the
**U1** paper (published 2026-05-12); **U1.5 has no paper**, its architecture write-up is an HF blog,
`huggingface.co/blog/sensenova/neo-unify`.

### 6.1 The prompting rule, verbatim — the whole "Best Practices" section is two sentences

```text
Direct natural-language prompts work well for clear tasks with few constraints. For complex generation
or editing, use prompt enhancement when additional planning is needed and explicitly specify what
should remain unchanged.
```

`[OFFICIAL]` **Three teachable claims are packed into that:** (a) the base dialect is **plain natural
language**, not a tag stack and not a label block; (b) the vendor's own answer to complexity is a
**prompt enhancer (PE)**, i.e. a rewriter — so this model has the *same* cloud/local confound pattern
the corpus tracks elsewhere, except here the PE is shipped as an *optional local recipe*; (c) for
editing, **naming what must stay fixed is a first-class part of the prompt.**

### 6.2 The vendor's own example prompts — both are short

```text
# text-to-image
--prompt "A cinematic mountain lake at sunrise, realistic photography."

# image editing
--prompt "Change the jacket to cobalt blue. Preserve the face, pose, background, lighting, and framing."
```

`[OFFICIAL]` **The T2I example is nine words.** That is a hard data point against any "always write
100–180 words" rule travelling to this model, and it belongs next to the 09-13 digest's
"same-encoder-opposite-appetite" argument (item 10). The **edit** example is the important one
pedagogically: it is **instruction + explicit preservation list**, in that order, one sentence each.
**Recommend it as a gold pair for an editing dialect.** `[SYNTHESIS]`

### 6.3 Settings that change prompting

- **Base T2I path:** no `cfg_scale` in the example → **CFG is live**, and the vendor says so in
  *Ongoing Improvements*: *"some prompts may produce excessive high-frequency detail or oversaturated
  colors, which can often be mitigated by **lowering `cfg_scale`**."* `[OFFICIAL]` **So negatives /
  guidance are NOT inert on the base path** — a useful counter-example to the corpus's CFG≈1 rule.
- **8-step LoRA path:** `--cfg_scale 1.0 --cfg_norm none --timestep_shift 3.0 --num_steps 8`
  `[OFFICIAL]`. **CFG exactly 1.0 ⇒ by the corpus's own promoted physics rule, negatives are inert on
  this path.** Same model, two paths, opposite guidance regimes. **This is the cleanest single-model
  demonstration of the CFG≈1 rule anywhere in the corpus** and should be taught with it.
- **Native resolution in both examples: `--width 2048 --height 2048`**; the card claims *"more
  efficient native 4K generation."*
- `timestep_shift 3.0` — note the structural echo of Z-Image-Turbo's *8 steps at time-shift 3*
  (`staff-claims` row 2). Two different vendors, same distilled operating point. `[SYNTHESIS]`

### 6.4 The "10 reference images" question — **not confirmed on any first-party surface**

ComfyUI's v0.35.0 changelog says *"multi-reference editing with **up to 10 reference images**"*
`[OFFICIAL — Comfy Org, not SenseNova]`. **SenseNova's own cards never state a number.** They say only
*"more accurate region- and object-level control through bounding boxes, visual markers, and single- or
multi-image references"* and list *"local, text, multi-reference, insertion, and replacement edits"* as
edit types. **How references are addressed inside the prompt text is not documented on any surface
reached.** Scope any "10 references" claim to Comfy Org's node description.

### 6.5 An in-window SenseNova release the corpus does not have

**`SenseNova-U1.5-8B-MoT-LoRA-8step`** — *"a 0.4B-parameter distilled adapter for faster and more
efficient text-to-image inference in 8 denoising steps"*, Apache-2.0, in
`sensenova/SenseNova-U1.5-8B-MoT-LoRAs`. `[OFFICIAL]` The `SenseNova-U1.5` collection reports
**"Updated about 21 hours ago"** at access, i.e. **≈2026-09-16 — inside the window**. *(Relative label;
treat the date as approximate — the ObjectId method of §3.1 does not apply to collections.)*
**It carries no trigger phrase** — the card reuses the *identical* base prompt in its example, changing
only sampler flags. `[OFFICIAL]` Explicit incompatibility note: *"It is not compatible with the earlier
`SenseNova-U1.5-8B-MoT-Preview` checkpoint."*

### 6.6 Model-stage table, for the register

| Repo | Stage | Note |
|---|---|---|
| `sensenova/SenseNova-U1.5-8B-MoT` | **RL** (final) | the one to teach |
| `sensenova/SenseNova-U1.5-8B-MoT-SFT` | Supervised fine-tuning | 18B params on disk, BF16 |
| `sensenova/SenseNova-U1.5-8B-MoT-LoRAs` | 8-step distilled LoRA (0.4B) | **new, ≈09-16** |
| `sensenova/SenseNova-U1.5-8B-MoT-Preview` | superseded | LoRA is **not** compatible with it |

*(Note the SFT card's own "Models" table calls the final checkpoint "Final" while the LoRAs card calls
it "RL" — a trivial first-party inconsistency, recorded so nobody treats them as two checkpoints.)*

### 6.7 **`docs.comfy.org` has NO SenseNova U1.5 tutorial — a properly scoped absence**

The 09-10 sweep guessed a path and got an empty body, and left it "unknown". **Resolved.** The full
`docs.comfy.org` English Get-Started index (**248 pages**, which is where every `tutorials/…` page is
listed) was fetched and searched case-insensitively for `sensenova` / `u1.5`: **zero matches**.
<https://docs.comfy.org/_llms/en/get-started.md>, accessed 2026-09-17.
**Scoped claim: as of 2026-09-17 there is no SenseNova U1.5 tutorial anywhere in the `docs.comfy.org`
English documentation index.** The same index *does* list new tutorials for FastH3, YuE2 and LTX-2.5 —
so the index is current, and the absence is real rather than an indexing lag. **The model has
first-class node support (v0.35.0) and zero first-party ComfyUI documentation.**

---

## 7. arXiv

Searched: arXiv listing/search via WebSearch with `2609` forced, plus the abstract page for the one
in-scope hit. **One new paper worth the corpus; nothing inside the 4-day window.**

### 7.1 **arXiv:2609.08079 — VI-Bench: Benchmarking Prompt Inversion from AIGC Videos** (2026-09-08)

`[OFFICIAL — peer-unreviewed preprint]` Xie, Zhao, Li, Liu, Zhang, Liu, Hou, Gong. 31 pages.
<https://arxiv.org/abs/2609.08079>, accessed 2026-09-17. **Not in the corpus.** Out of the news window
by five days, but squarely on the corpus's subject.

**Why it matters to this app specifically — it validates the app's own axis list from the outside.**
Verbatim:

```text
VI-Bench spans three progressively harder settings, namely single-shot semantic grounding, control
over style and camera behavior, and multi-shot compositional inversion, and evaluates five
generation-critical dimensions: subject, action, scene, style, and camera.
```

An independent group, working from **16.1 million real-user prompts**, factorises a video prompt into
**subject · action · scene · style · camera** — essentially the app's picker. That is the best external
support the corpus has for teaching those axes as *the* axes. `[SYNTHESIS]`

**Two further quotable results:**

```text
even the strongest model achieves only 0.632 on Inversion Score, performance degrades sharply as
samples require richer control and multi-shot reasoning, and models often produce plausible prompts
whose regenerated videos deviate from the reference
```

```text
a caption may describe what is visible, but a replayable prompt must recover the generation-relevant
controls needed to reproduce the video
```

**Corpus effect — this is a direct hit on a technique the corpus teaches.** "Caption the reference /
source video and use that as your prompt" is exactly the advice in `staff-claims` **row 4**
(`art-alex`: *"use … a detailed caption of the source video"*) and in the app's image-to-prompt
guidance. VI-Bench measures that operation and finds **the best of 18 VLMs scores 0.632**, with
*"plausible prompts whose regenerated videos deviate from the reference."* **The staff advice is not
wrong, but the corpus should stop presenting caption-the-source as reliable** and add: a VLM caption
recovers *what is visible*, not the *controls* (style, camera, multi-shot structure), and the gap is
measured and large. `[SYNTHESIS]` See §8.4.

### 7.2 Adjacent, older, not previously registered

Surfaced by the same searches; **abstracts not fetched**, recorded as leads only, all `[LORE — title
and search-summary only, not read]`:
`2608.12290` *Beyond Trial-and-Error: Agentic Optimization for Image-to-Video Adherence* ·
`2603.03505` *PhyPrompt: RL-based Prompt Refinement for Physically Plausible T2V* ·
`2603.01509` *Retrieval, Refinement and Ranking for T2V via Prompt Optimization and Test-Time Scaling* ·
`2605.09442` *SWIFT: Prompt-Adaptive Memory for Efficient Interactive Long Video Generation*.
The corpus's prior anchors (2609.11242, 2606.03715, 2606.08492) were **not re-read**.

---

## 8. Contradicts corpus

### 8.1 🔴 **The LTX text-encoder quarantine rests on one user who said the opposite three days earlier.**

The 09-13 digest's 🚨 quarantine flag cites `kabachuha` on `discussions/62`. **The same user, in
`discussions/38`, posted this** (`#6a8338365175f8874400c846`, decoded **2026-08-17 16:35:02Z**):

```text
After the text encoder change there is some improvement in permanence / prompt-following!
```

`[LORE]` <https://huggingface.co/Lightricks/LTX-2.5/discussions/38>, accessed 2026-09-17.

**Eight days later** (2026-08-25 08:57:13Z, `discussions/62`) the same account writes *"They uploaded an
entire wrong checkpoint… resulting in artifacts and really weird prompt following."* And on the same
day, asked by staff to elaborate, he says the object-permanence problems occur *"both with the old and
with the new text encoders."*

**Three statements, one author, one week:** the new encoder **improved** prompt-following → the new
encoder is **the wrong checkpoint** and degrades it → the defect is present with **both** encoders.
**Resolution to teach: retract the quarantine as an evidenced confounder.** Downgrade to
`[LORE — single user, self-contradicting]`, keep the *fact* that an undocumented text-encoder re-upload
happened (that part is corroborated by `Ravan` and unchallenged), and drop the causal claim. The
practical guidance that survives is narrow and worth keeping: **LTX-2.5 users should record which
`gemma4-12b-with-proj-ltx-2.5-*.safetensors` file they ran**, because Lightricks replaced it in place
without release notes.

### 8.2 🔴 **"`DEFAULT_NEGATIVE_PROMPT` is on the non-distilled 30-step path" is wrong.**

09-13 digest: *"`DEFAULT_NEGATIVE_PROMPT` exists in `diffusers.pipelines.ltx2.utils`, passed by the
official example on the **non-distilled** 30-step path… 'inert' must be scoped to distilled-only."*

**The vendor's own card shows it on the DISTILLED two-stage path, at `guidance_scale=1.0`.**
Verbatim from `Lightricks/LTX-2.5`'s Diffusers example — note the import list and the shared kwargs:

```python
from diffusers.pipelines.ltx2.utils import (
    DEFAULT_NEGATIVE_PROMPT,
    DISTILLED_SIGMA_VALUES,
    STAGE_2_DISTILLED_SIGMA_VALUES,
)
...
shared = dict(
    ...
    negative_prompt=DEFAULT_NEGATIVE_PROMPT,
    guidance_scale=1.0,
    audio_guidance_scale=1.0,
    stg_scale=0.0,
    ...
)
```

`[OFFICIAL]` <https://huggingface.co/Lightricks/LTX-2.5/blob/main/README.md>, accessed 2026-09-17.

**This does not rescue negatives — it makes the false-affordance case stronger.** The official example
passes a negative prompt **and** sets `guidance_scale=1.0` **and** `stg_scale=0.0` on the sigma schedule
named `DISTILLED_*`. So **Lightricks' own flagship code sample ships an inert negative prompt**, exactly
the pattern `Comfy-Org/workflow_templates#919` documents for the ComfyUI templates. **Correct the
digest's scoping sentence, and promote the finding: the inert-negative false affordance is not a
ComfyUI packaging bug, it is in the vendor's reference code.** 🔴

### 8.3 🟠 **"Single-paragraph packaging does not survive" is contradicted by the vendor's own prompt guide.**

09-13 digest item 3 concluded from `art-alex`'s line-per-beat rewrite that *"Prose-not-tags survives;
single-paragraph packaging does not."* **Lightricks publishes a prompt guide that says the opposite for
the default case.** `[OFFICIAL]` — <https://ltx.io/blog/ltx-2-5-prompt-guide>, **August 10, 2026**, by
**Rachel Luxemburg, "Senior Developer Advocate for LTX-2"** (vendor blog, named vendor role):

```text
### Simple / Single-Shot
For a single continuous take, a short flowing description works best:
- Write your prompt as a **single flowing paragraph**
- Use **present tense** verbs for action and movement
- Match the level of detail to the shot scale (close-ups need more detail than wide shots)
- Describe camera movement relative to the subject
- Aim for roughly **4–8 descriptive sentences**
```

and for multishot:

```text
Write the full scene as **one chronological paragraph** (or a short sequence of sentences). Do **not**
use a shot list, numbered beats, or screenplay sluglines unless you also describe the cut in prose.
```

**But the same guide licenses the other shape, explicitly:**

```text
### Longer / Screenplay-Style
When a scene involves dialogue, multiple beats, or precise timing, you can write it in a screenplay
style — scene headers, character cues, and quoted dialogue
```

**Resolution — and it is better than either prior position.** The vendor's rule is
**"match the structure to what you're describing rather than forcing every prompt into one shape"**,
with the default being a 4–8-sentence single paragraph and the exception being multi-beat or
dialogue-timed scenes. `art-alex`'s line-per-beat rewrite (`staff-claims` row 5) is the vendor
*applying its own exception*, not contradicting its guide. **The corpus should teach the conditional,
not either absolute**, and should add the concrete number the corpus has never had: **4–8 sentences**
for a single shot. 🟠

### 8.4 🟠 **"Caption the source video and use that as your prompt" needs a measured caveat.**

See §7.1. `staff-claims` row 4 and the app's image/video-to-prompt guidance both rest on
caption-the-source. `arXiv:2609.08079` measures precisely that inversion and reports the best of 18
VLMs at **0.632**, degrading sharply on style, camera and multi-shot. **Keep the advice, add the
caveat**: captions recover content far better than they recover *controls*. 🟠

### 8.5 🟢 **"CFG≈1 ⇒ negatives inert" — strengthened twice, and given a boundary.**

- **Strengthened, `[OFFICIAL]` vendor text:** `Lightricks/LTX-2.5` model card, checkpoint table:
  *"Distilled DiT (bf16). **Fixed 8-step schedule, CFG=1.**"*
- **Strengthened, new model:** SenseNova U1.5's 8-step LoRA ships `--cfg_scale 1.0`.
- **Boundary found:** SenseNova U1.5's **base** path has a live `cfg_scale` the vendor tells you to
  lower. So the rule is a **per-path** rule, not a per-model one. The teaching line should be
  *"check the guidance value on the path you are running, not the model you downloaded."* 🟢

### 8.6 🟠 **The IC-LoRA "no trigger, no special shape" rule does not generalise across LTX adapters.**

`staff-claims` row 4 is about the Pixel Spatial Upscaler and is confirmed (§2.2). **But the official
prompt guide gives a different adapter a mandatory template**, which a tutor could easily
over-generalise away. `[OFFICIAL]` (same URL as §8.3):

```text
#### Prompt Template
[Speaker] is speaking [Language/Accent], saying: "[Dialogue]"
```

with hard requirements: *"**Provide the full dialogue text** — the model follows the content of the
prompt. It does **not** translate dialogue for you"*; *"**Use native script** — write dialogue in the
alphabet of the target language"*; *"**Single speaker** — the beta IC-LoRA does not distinguish between
multiple speakers"*; **validated languages English, French, Spanish, German, Russian**; and a timing
rule — *"keep your prompt at roughly the same timing and syllable length as the original dialogue.
Slightly longer is better than too short. Prompt too long: the model might skip words. Prompt too
short: the output might sound slow and unnatural."*
**Teach per-adapter, never per-family.** 🟠

### 8.7 🟠 **"Don't prompt abstract emotion" gets a first-party source.**

`[OFFICIAL]`, same guide: *"Express emotion through **physical cues**, not abstract labels"*, repeated
as *"physical emotion cues (not labels like 'sad')"*. The corpus carried this only as a community
recollection of an LTX-2.0 guide. Now sourced. 🟠

### 8.8 Other `[OFFICIAL]` lines from the guide the corpus lacks

- *"**Keep lighting consistent** — use one coherent light logic per shot; mixed light sources confuse
  the result."*
- *"For image-to-video from a first frame, prefer a **single continuous take** unless you intentionally
  describe a cut away from that opening image."* — a concrete I2V-specific rule.
- Multishot: **2–4 shots**, *"name the edit: hard cut, match cut, dissolve"*, *"re-identify subjects
  when they reappear"*, *"at every cut, say whether music / dialogue / ambience continues or changes"*,
  and a full worked multishot example prompt (quoted in the guide, ~120 words, one paragraph).
- On-screen text: *"exact spelling and consistency across frames are **not guaranteed**… add critical
  titles, labels, or logos in post."*
- A vendor vocabulary list (Categories / Lighting / Textures / Color Palette / Atmosphere / Ambient
  Settings / Dialogue Style / Volume / Camera Language / Film Characteristics / Scale Indicators /
  Pacing / Visual Effects) — **this is a first-party controlled vocabulary the app's pickers could be
  aligned to.** Camera Language, verbatim: *"Follows · Tracks · Pans across · Circles around · Tilts
  upward · Pushes in / pulls back · Overhead view · Handheld movement · Over-the-shoulder · Wide
  establishing shot · Static frame."*

### 8.9 🟠 **Three LTX licence slugs, drifting.** See §4.5. Not a prompting issue, but the 09-13 "two
slugs" item is understated.

## 9. Nothing-found register

Every row names the surfaces actually reached. Per the standing absence-claim rule, nothing below is a
claim that a thing does not exist — only that it was not found on the named surfaces.

| Item | Surfaces searched | Result |
|---|---|---|
| **Commit date for `1b92891`** | `Lightricks/LTX-2.5/commits/main/README.md` (empty body); `…/commit/<SHA>` (provenance-refused, and the sibling repo's equivalent returned an empty body); WebSearch ×2 on the full SHA | **Exact date NOT obtained.** Hard upper bound **2026-08-20 15:36:26Z** derived instead (§3.2). |
| **Which files `1b92891` touched** | same surfaces | **Unknown.** Only a community characterisation exists. |
| **Lightricks acknowledgement of the encoder re-upload** | `discussions/62` in full (incl. both staff replies), `discussions/38` in full, `discussions` index (all 47 open threads' titles), WebSearch on "LTX-2.5 release notes text encoder reupload" | **None found, and positively evidenced as non-acknowledgement** (§3.4). `ltx.io/release-notes` and `docs.ltx.io` were **NOT fetched** (budget) — recorded as **unchecked**, not empty. |
| **`discussions/48` replies** | thread detail page (stale render, 0 replies), discussions index (reply count **2**) | **Contradiction unresolved.** Thread dated **2026-08-16** via ObjectId — out of window regardless. The I2V-vs-T2V question remains open in the corpus. |
| **New `[STAFF]` prompting claim inside 09-13→09-17** | all surfaces in §4.4 | **Zero.** Third consecutive sweep with no in-window staff claim. |
| **`art-alex/activity/community`** | attempted | **Provenance-refused.** The 09-03 harvest's highest-yield staff technique was unavailable; no substitute found. |
| **`Cxxs` / `QJerry` / `DyJiang` / `KandooAI` / `SG_161222` / `L_A_X`** | not attempted | **Unchecked, not empty.** Third run. |
| **Wan-AI / BFL / Qwen / Tongyi-MAI / zai-org discussion tabs** | not attempted | **Unchecked.** Unchanged since 09-13. |
| **SenseNova U1.5 tutorial on `docs.comfy.org`** | full English Get-Started index, 248 pages (`/_llms/en/get-started.md`), grepped case-insensitively for `sensenova`/`u1.5` | **Confirmed absent from the index** as of 2026-09-17 (§6.7). Index is current — it lists FastH3, YuE2 and LTX-2.5 tutorials. |
| **SenseNova U1.5 Cookbook** (`docs/u1.5_best_practices.md` — Image PE, Caption-to-Prompt, Editing PE recipes) | direct fetch ×2, WebSearch ×1 | **BLOCKED by the provenance gate** — the URL appears in three HF cards but was refused every time. **This is the single highest-value unread document for the corpus's #1 open target.** Paste `https://github.com/OpenSenseNova/SenseNova-U1/blob/refs/heads/feat/u1.5/docs/u1.5_best_practices.md` verbatim into the next brief. |
| **`huggingface.co/blog/sensenova/neo-unify`** | not attempted | **Unchecked.** U1.5's only architecture write-up (there is no U1.5 paper). |
| **How SenseNova U1.5 addresses references inside prompt text** | both English cards in full | **Not documented.** The "10 reference images" figure comes only from ComfyUI's changelog (§6.4). |
| **`comfyui-workflow-templates` PyPI page** | not fetched | **Unchecked.** Version history was obtained from `docs.comfy.org/changelog` instead (0.11.57→.59→.60→.62). |
| **Template *file* contents / diffs** | not fetched | **Unchecked.** `Comfy-Org/ComfyUI` PR #16350 was provenance-refused. 0.11.60's contents are undescribed even in the changelog. |
| **Whether `workflow_templates#919` (inert LTX negatives) is fixed** | not attempted | **Unchecked.** |
| **`raw.githubusercontent.com` freshness** | not re-tested | **Unknown.** The 09-10 erratum (stale) is neither confirmed nor retired. Only GitHub **PR-conversation HTML** was freshness-tested, and it passed. |
| **GitHub releases / tags / `.atom`** | not re-tested | **Unknown.** The 09-10 erratum (≈10 weeks stale) stands unchallenged. |
| **`docs.ltx.video/open-source-model/usage-guides/prompting-guide` (the canonical docs version, incl. its "Sample Prompts" section)** | provenance-refused; the vendor blog version was read instead | **Sample Prompts NOT read.** The blog links them at a Fern **preview** host, `lightricks-preview-feature-ltx25-model-docs.docs.buildwithfern.com/...#sample-prompts`, also refused. Next-run target. |
| **`docs.ltx.io` vs `docs.ltx.video`** | observed only | **Both are live first-party domains** appearing on the same pages. Not resolved which is canonical. |
| **FastVideo FastH3 weights + licence** | not fetched | **Unchecked.** Do not promote past "register it". |
| **arXiv prior anchors (2609.11242, 2606.03715, 2606.08492)** | not re-read | **Unchecked.** |
| **Reddit, Discord, `civitai.com`, `civitai.red`, `web.archive.org`, 知乎, Bilibili, `*.feishu.cn`** | not attempted, by standing rule | No claim is made about any of them. In particular, **`civitai.red` returns empty to all server fetches, so nothing here scopes to it.** |
| **SDXL fine-tune families** | not attempted | **Fourth consecutive run with zero coverage.** Out of this brief's scope, flagged so the streak is visible. |

---

## 10. Access notes

### 10.1 GitHub freshness assertion — **PASSED, narrowly scoped**

**Test:** `github.com/Comfy-Org/docs/pull/1674` against the known-recent fact "a v0.35.1 changelog PR
was merged in mid-September 2026". **Result:** the page rendered the PR **merged Sep 14, 2026** with
merge commit `054769c`, the full body, and the bot review — a **three-day-old** event.
**Verdict: GitHub PR/issue conversation HTML is fresh this run.** It does **not** follow that
`/releases`, `/tags`, `/releases.atom` or `raw.githubusercontent.com` are fresh; those were not
re-tested and their 09-10 staleness erratum stands.

### 10.2 **Two new, reusable methods — recommend both as standing practice**

**(a) Gated HF repos: read `…/blob/main/<file>`, not `…/raw/main/<file>`.**
On `Lightricks/*` (licence-gated), `…/raw/main/README.md` returns an empty body and `…/commits/…` and
`…/commit/<SHA>` also return empty bodies — **so the brief's commit-pinned-SHA method could not even be
started.** But the plain **`/blob/main/README.md` HTML page renders the entire file**, front-matter
included, with no login and no SHA, *and* prints the latest commit SHA + author in its header. Three
gated cards were read this way today, including the **27.1 kB `Lightricks/LTX-2.5` card that the corpus
had never read**. **Revise the tooling rule:** blob page first; commit-pinned raw only as a fallback.

**(b) Date any HF discussion comment exactly, from its anchor.**
HF comment permalinks are **MongoDB ObjectIds**; the first 8 hex characters are a big-endian Unix
timestamp. `int(anchor[:8], 16)` → exact UTC. Validated against three corpus-known dates and matched
all three to the day (§3.1). **This retires the 09-10 errata's "two HF surfaces disagree about a
thread's date" problem entirely.** It also shows how bad the labels are: `discussions/48` is rendered
as *"3 days ago"* on one surface and *"21 days"* on another, when it is in fact **2026-08-16** —
a month old. **Never date an HF discussion from a relative label again.**

### 10.3 The provenance gate was the dominant cost this run

**None of the URLs pasted in my brief were accepted** — the gate does not treat a subagent's
instructions as a user message. Every target had to be minted through WebSearch first, and several
could not be minted at all. **Refused despite appearing (as markdown link targets) inside prior fetch
results:**

- `https://huggingface.co/Lightricks/LTX-2.5/commit/1b92891cedc4a823c35a3b23588d7a57a3a23c65` ← **Priority 2's primary target**
- `https://github.com/OpenSenseNova/SenseNova-U1/blob/refs/heads/feat/u1.5/docs/u1.5_best_practices.md` ← **Priority 5's primary target**
- `https://github.com/Comfy-Org/ComfyUI/pull/16350` (templates v0.11.62 contents)
- `https://huggingface.co/api/models/...` and `…/api/models?search=…&sort=lastModified` — **the hard-UTC-timestamp tool named in the brief was unavailable all run**
- `https://docs.ltx.video/open-source-model/usage-guides/prompting-guide`
- `https://huggingface.co/art-alex/activity/community`

**Observed pattern (tentative):** bare URLs and WebSearch result URLs mint reliably; markdown
link *targets* mint inconsistently. **Actionable fix for the next brief: paste the six URLs above
verbatim in the instruction text** — the same fix the 09-13 digest prescribed for the Feishu URLs.

### 10.4 Other access facts

- **`docs.comfy.org` is the freshest surface reached** — clean markdown, `/llms.txt` index works, and
  it carried a release **two days old**. But see §5.1: it **lagged v0.35.1 by four days**, so treat a
  gap in it as a lower bound, not a fact.
- **Large pages:** `docs.comfy.org/changelog` (98 k chars) and `/_llms/en/get-started.md` (60 k chars)
  both overflowed the fetch cap into files. **That is a feature, not a failure** — grepping the saved
  file is how §6.7's absence claim and §1's release table were produced, at one fetch each.
- **`web_fetch` is rate-limited (HTTP 429)** and stalled the sweep once, around fetch ~32.
- **Same-URL de-duplication is session-wide across agents.** Two SenseNova URLs returned *"Already
  fetched … 554s ago in this session"* — **fetched by Agent A, whose content I cannot see.** Sibling
  repos carrying the identical card body were used instead. **Worth telling both agents next time:
  claim non-overlapping URLs, because a duplicate fetch returns nothing to the second agent.**
- **Fetch spend:** ~38 `web_fetch` calls + 9 WebSearch, inside the ~60 budget. Stopped because the
  brief was exhausted, not because the budget was.
- **Not committed** (rule 8). The maintainer commits.

### 10.5 Corrections to prior corpus records, collected

1. `staff-claims-2026-09.md`: the two upscaler claims are **row 4**, not row 5 (the brief says row 5).
2. The 09-13 digest dates `art-alex`'s before/after rewrite **≈09-04**; it is **2026-08-25 16:20:37Z**.
   The 09-03 harvest's `~2026-08-25` was right and should not have been moved.
3. The 09-13 digest's *"independently noticed by a second user"* overstates `Ravan`, who reported an
   **undocumented re-upload**, not a defect (§3.4).
4. The 09-13 digest's `DEFAULT_NEGATIVE_PROMPT` scoping is wrong (§8.2).
5. The 09-10 sweep's *"`Lightricks/LTX-2.5/discussions/48` … opened 3 days ago / 19 days"* — neither;
   **2026-08-16 02:23:03Z** (§4.5).
