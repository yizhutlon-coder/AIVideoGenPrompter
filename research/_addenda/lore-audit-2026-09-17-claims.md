# Retroactive rule-2b evidence audit — five app-bearing claims

**Agent C · audit date 2026-09-17 · research only, no corpus file modified.**

Applying `docs/RESEARCH-PLAN-2026-09.md` **rule 2b** (*an uncorroborated unofficial claim is a point
of interest, not a finding*; it gets a bounded confirm/disprove pass on a **different surface** before
the app rests on it) retroactively to five claims the shipped app currently teaches.

**Standing absence caveat, applied to every "not found" statement below:** `civitai.red` is invisible to
all server fetches from this environment, and `civitai.com` returns an empty body to automated fetches.
Every Civitai absence claim in this file is therefore scoped to **the fetchable main site via
`civarchive.com`** plus the WebSearch (US) index. Reddit, Discord, `web.archive.org`, 知乎, Bilibili and
`*.feishu.cn` are unreachable and were not attempted — absences are not scoped to cover them.

**Label discipline:** `[OFFICIAL]` / `[STAFF]` / `[TESTED]` / `[LORE]` / `[SPECULATION]` / `[SYNTHESIS]`
only. A third-party README is `[LORE — third-party, not vendor]`. `[USER-VERIFIED]` is the instructor's
alone and appears nowhere in this file.

---

## 1. Krea 2's "~512-token conditioning cliff — silent black frame past ~600"

**CLAIM** (verbatim, `research/digests/2026-08-28-digest.md` line 63 and following):

> **Krea 2 has a ~512-token conditioning cap and fails silently past it.** `[TESTED]`
> … 49/512/513/576 = OK; **640 = black; 674 = corrupted**. Sampler reports 8/8, VAE decodes, image is
> black. Teach "512 is the reference cap, past ~600 it dies" — the cliff is in (576, 640], not at 512.

**Where it bites.** Three places in the shipped app:
- `PromptStudio.html` line 891 (`KNOWLEDGE`, Krea family): *"One controlled single-variable report
  (ComfyUI #14782, open, no maintainer reply, INT8 ConvRot checkpoint) measured 49/512/513/576 OK, 640
  BLACK, 674 corrupted. … **OFFICIAL cap, TESTED cliff.**"*
- `PromptStudio.html` validator, `key === 'krea2'`, the **HARD** rule at `t.length > 2500`:
  `'HARD: ' + t.length + ' characters is past the reference cap … (one controlled report: clean at 576
  tokens, pure black at 640)'`
- the same block's advisory at `t.length > 1400` ("the expansion can push the total over the cliff").

### VERDICT: **CONTRADICTED** — and contradicted by the single source itself.

The corpus's whole case rests on one quoted sentence, *"The sequence length was the only intentionally
changed variable."* **That sentence has been superseded by the same reporter, in the same thread.** The
issue now carries a maintainer reply and an explicit retraction of the length hypothesis. Both were
invisible to the 08-28 grading pass and to the 09-03 and 09-13 re-reads.

**Evidence A — the reporter retracts prompt length as the cause.** `[TESTED — same single reporter,
self-correcting]` `Goldlionren`, comment on `Comfy-Org/ComfyUI` issue #14782,
<https://github.com/Comfy-Org/ComfyUI/issues/14782>, accessed **2026-09-17**:

```text
I found a more specific reproduction and I no longer think this is primarily about prompt length alone.

New finding:
the issue appears to depend on the exact combined text+image sequence shape when running with the
comfy-kitchen Triton backend on Intel XPU.

Key observation:
with the same prompt and same 1:1 workflow, simply disabling `--enable-triton-backend` makes the
corrupted output disappear.

So the minimal flip is:

- Triton ON  -> corrupted / black output
- Triton OFF -> normal output
```

and, from the same comment, the three traces that break the length link outright — **all three at
`txtlen=165`**, i.e. a *short* prompt, with the corruption tracking `mod256` of the **combined** sequence,
not the text length:

```text
1) 3:4 case (works, Triton ON)
- txtlen=165
- imglen=8295
- combined_len=8460
- mod256=12
- reference_pad256=244

2) 1:1 case (corrupts, Triton ON)
- txtlen=165
- imglen=8281
- combined_len=8446
- mod256=254
- reference_pad256=2

3) 1:1 case (works, Triton OFF)
- txtlen=161
- imglen=8281
- combined_len=8442
- mod256=250
- reference_pad256=6
```

```text
This suggests the corruption is tied to exact tensor shape / backend selection rather than prompt semantics.

I also checked the Krea 2 reference implementation and it pads the combined text+image sequence to a
multiple of 256 before the shared transformer blocks, explicitly "to stabilize compiled kernel shapes".
The current ComfyUI Krea2 path does not appear to do this.
```

This is fatal to the corpus grading in a specific way: **case 2 corrupts at `txtlen=165`** — about a
tenth of the "cliff" the app teaches. If a 165-token prompt can produce the identical failure, then
"640 = black" was never a length threshold; it was one point on a shape/`mod 256` curve that length
*happened* to move. The original sweep changed sequence length, and sequence length changes total tensor
shape — so "the only intentionally changed variable" was true and still **confounded**.

**Evidence B — there IS now a maintainer reply, and it declines the premise.** `[STAFF]` `comfyanonymous`
(ComfyUI lead maintainer), same thread, accessed **2026-09-17**:

```text
ComfyUI behavior has always been to pass your entire prompt to the model even if it breaks the model a bit.
```

So the corpus's standing qualifier *"open, no maintainer reply"* — repeated verbatim in `PromptStudio.html`
line 891, in `docs/FOLD-IN-2026-09.md` line 271, and in `krea-character-art.md` §*Tested findings* A — is
**now factually wrong in the shipped app text**. It is also, read carefully, a **WONTFIX**: ComfyUI is
stating that not truncating is intended behaviour, not a bug. The corpus's framing *"ComfyUI can [exceed
the cap], and that is the bug"* is the opposite of what the maintainer says.

**Evidence C — the environment was never a normal one, and the corpus never recorded it.** Same issue,
Debug Logs block, accessed **2026-09-17**:

```text
Platform: Linux
Python: 3.13.12
PyTorch: 2.11.0+xpu
Device: Intel(R) Arc(TM) Pro B60 Graphics
ComfyUI: 0.27.0 / development master
comfy-kitchen: 0.2.16
Triton: 3.7.0
```

**Intel Arc / XPU / `torch+xpu` / comfy-kitchen Triton.** Not CUDA. The corpus recorded the checkpoint
caveat ("INT8 ConvRot, not the FP8 most users run") but **never recorded the accelerator**, which turns out
to be the actual independent variable. A single-reporter result on a minority backend was graded `[TESTED]`
and hard-wired into a validator.

**Evidence D — a second reporter in-thread points at a different, non-length cause.** `[LORE]` `LukeG89`,
same thread, accessed **2026-09-17**: he reports `--disable-async-offload` producing *"black or broken
images"* on his system and links <https://github.com/Comfy-Org/ComfyUI/issues/14812> and
<https://github.com/Comfy-Org/ComfyUI/issues/14754>. This is **not** corroboration of a length cliff — it
is a second, independent, length-free route to the same black-frame symptom, which further dissolves the
length attribution.

**Issue state.** Still **open** as of the snapshot read; **not** closed by any commit; **no** PR merged.
The reporter offers a patch (*"can prepare a PR if this is the intended fix direction"*) and the maintainer's
reply signals the answer is no.

> **Snapshot-date honesty note.** The `web_fetch` on the issue page returned **no `meta-request-id`
> header** (GitHub issue pages render through a different path than `blob` pages), so I **cannot decode a
> snapshot date for #14782** and will not invent one. Lower bound from content: the thread contains a
> comment referencing issue **#14812 as newly created**, so the snapshot post-dates #14812's creation and
> is materially newer than the 2026-09-03 read that recorded "no maintainer reply". The
> `krea-ai/krea-2/blob/main/encoder.py` page *did* return a header — `meta-request-id:
> 0441:3D442F:2A44AE:3B3D46:6A3BE15B`, final segment `0x6A3BE15B` = 1782309211 =
> **snapshot 2026-06-24 13:53:31 UTC** (85 days old — note this is *outside* the 0–46-day window the
> tooling brief describes, so treat that window as not universal).

### The distinction the corpus collapsed, restated

These are two claims, and only one of them survives:

| | Claim | Status |
|---|---|---|
| **(i)** | Krea's **reference encoder** defaults to `max_length = 512` text positions and silently truncates | **CONFIRMED `[OFFICIAL]`** |
| **(ii)** | Exceeding ~600 conditioning positions in ComfyUI **causes a black frame** | **CONTRADICTED `[LORE]`** |

**(i) re-verified at source.** `[OFFICIAL]` <https://github.com/krea-ai/krea-2/blob/main/encoder.py>,
accessed 2026-09-17, **GitHub snapshot 2026-06-24**, verbatim:

```python
@dataclass
class TextEncoderConfig:
    model_id: str
    max_length: int = 512
    select_layers: tuple[int, ...] = (2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35)
```

```python
            inputs = self.tokenizer(
                text,
                truncation=True,
                return_length=False,
                return_overflowing_tokens=False,
                padding="max_length",
                max_length=self.max_length
                + prefix_idx
                - self.prompt_template_encode_suffix_start_idx,
                return_tensors="pt",
            )
```

```python
            hiddens = hiddens[:, prefix_idx:]
            mask = mask[:, prefix_idx:]
```

with `prompt_template_encode_start_idx = 34` and `prompt_template_encode_suffix_start_idx = 5`. The
corpus's arithmetic (512 + 34 − 5 = 541-token window, silent truncation, 34-token prefix sliced off,
**512 conditioning positions**) is **exact**. Keep this.

But note precisely **what kind of fact this is**: `max_length: int = 512` is a **default argument in a
reference inference script**, not a model-architecture limit and not a documented vendor statement. It is
a *config default* — the strong reading the instruction asked me to test for ("a documented text-encoder
sequence length") is **only half true**: it is in code, it is not in prose anywhere. `Qwen3-VL-4B` itself
imposes no 512 limit; 512 is Krea's chosen default, and `Qwen3VLConditioner.__init__` takes `max_length`
as a **caller-overridable parameter** (`def __init__(self, version, max_length: int = 512, …)`). Anyone
instantiating it with a larger value gets a larger window. That is the opposite of a hard cap.

**(ii) has no second surface.** Surfaces searched for an independent report of black/corrupted Krea 2
output at long prompt length: WebSearch (US index) on *"Krea 2 ComfyUI long prompt black image corrupted
output reproduce"* and *"ComfyUI issue 14782 Krea 2 conditioning sequence length black output"*;
`Comfy-Org/ComfyUI` issue thread itself; `docs.comfy.org`. **Every hit resolves back to #14782 itself.**
No independent reproduction exists on any surface I could reach. Not scoped to cover Reddit, Discord,
`civitai.red`, 知乎, Bilibili or `web.archive.org` (all unreachable, not attempted).

### Correct grade now

- **The 512 reference-encoder truncation:** `[OFFICIAL]` — *a default in Krea's reference inference code*.
  Unchanged, and the strongest thing here.
- **The black-frame cliff in (576, 640]:** demote from `[TESTED]` to **`[LORE]` — single reporter,
  unreplicated, self-retracted, minority accelerator (Intel XPU + Triton), confounded by tensor shape.**
- **"no maintainer reply":** **stale and wrong.** There is a maintainer reply, and it is a WONTFIX.
- **"ComfyUI can exceed the cap, and that is the bug":** `[SPECULATION]` at best; the maintainer explicitly
  frames non-truncation as intended behaviour.

### Concrete app action

1. **Delete the black-frame cliff from the validator.** The `t.length > 2500` rule is currently **HARD**
   severity resting on a retracted single-reporter observation. Either delete it or demote it to
   **advisory** with the truncation rationale only: past ~2,850 characters Krea's own reference encoder
   would have truncated, so the tail is outside what the vendor's pipeline ever conditions on. That
   rationale survives; "pure black at 640" does not.
2. **Rewrite `PromptStudio.html` line 891's length paragraph.** Strike *"open, no maintainer reply"*
   (false), strike *"640 BLACK, 674 corrupted"* as a teaching fact, strike *"OFFICIAL cap, TESTED cliff"*
   → **"OFFICIAL reference-encoder default; cliff LORE, retracted by its own reporter."** Strike *"and
   that is the bug"* — the maintainer says it is not.
3. **Keep** the `> 1400` character advisory, but re-motivate it: the risk is `prompt_enhance` pushing the
   text past the point where the **reference** pipeline would have truncated, i.e. a *fidelity* risk, not
   a *black frame* risk.
4. **Keep** the reference-image budget advisory — `(h/32)·(w/32)+2` — but note it now has extra weight:
   the reporter's own traces show `imglen≈8281` against `txtlen=165`, i.e. the image path dominates the
   sequence by ~50×, exactly as the corpus predicted.
5. **Retire `research/_addenda/test-kit-2026-09.md` T6** as designed. T6 (`T6-krea2-len-560/640`) was built
   to replicate a length cliff on fp8/CUDA. Given the retraction it would almost certainly come back clean
   and be misread as "fp8 is safe" rather than "there was never a length cliff." If the maintainer wants a
   test at all, the decisive one is now **backend**, not length: same prompt, same seed, Triton on vs off.

---

## 2. Krea 2's "80–140 words" band

**CLAIM** (verbatim, as `TARGETS.krea2.system` stated it before the 09-10 merge):

> `ONE prose paragraph, 80-140 words`

**Where it bites.** `TARGETS.krea2.system` rule 1, and the `krea2` validator word-count branch.

### VERDICT: **CONTRADICTED** — the 2026-09-10 falsification is sound, and **the app has already been fixed.**

This was a **local** check per instruction; no fetches were spent. Two things to report.

**(a) The falsification holds up.** `research/_addenda/krea-character-art.md` §*2026-09-10 official
prompt-pair harvest* rests on the vendor's own `widget:` gallery — 36 `text:` strings each paired
one-to-one with an `output.url` image Krea generated and chose to publish — read from the
**commit-pinned** card `krea/Krea-2-Turbo` @ `665ef38131535e3a1da1a86c6ff2261e70ba9a55`
(<https://huggingface.co/krea/Krea-2-Turbo/raw/665ef38131535e3a1da1a86c6ff2261e70ba9a55/README.md>,
fetched 2026-09-10). Grade `[OFFICIAL]` is correct for the prompt strings: they are the vendor's own
gallery, not a community transcription.

Soundness checks I ran on the numbers themselves:

- The band histogram sums correctly: 1 + 2 + 11 + 8 + 7 + 6 + 1 = **36**. ✓
- The compliance split sums correctly: 15 inside + 12 below + 9 above = **36**. ✓
- Median 101.5 on an even n=36 is consistent with the stated mean 108.0 and a right skew (min 10, max 230). ✓
- The harvest is **not circular**: `docs/prompting.md`'s 19 worked examples are identified as a *subset*
  (entries 17, 18, 20, 24, 21, 33, 25), so the 17 long family-A prompts are genuinely new evidence and not
  a re-count of the material the 80–140 band was originally drawn from.

Verbatim from that section:

```text
Only 15 of 36 (42%) land inside the app's `80-140 words` rule; 12 are shorter than 80 and 9 are
longer than 140. Krea publishes a ten-word prompt (`immense rocket launch exhaust as seen from
extremely close up`) and a 230-word prompt in the same gallery, with the same billing.
```

The correct reading is the one the sweep drew: 80–140 describes **the middle of the vendor's own
distribution**; it is not a specification. `[OFFICIAL]` contradicts `[SYNTHESIS]`.

**(b) The app no longer states it as a hard rule.** As shipped today, `PromptStudio.html`
`TARGETS.krea2.system` rule 1:

```text
- ONE prose paragraph in English. The typical 80-140-word band is not a minimum; short source
  descriptions produce short prompts.
```

and the validator branch is correctly **advisory**, not HARD:

```javascript
    const w = enWords(t);
    if (w > 140) issues.push('advisory: ' + w + ' words — longer than the usual craft band; trim details that were not supplied by the user');
```

and the `KNOWLEDGE` line already concedes it: *"LENGTH: the app's 80-140-word band is craft, not capacity
— those 36 official prompts run 10-230 words (median 101.5) with only 15 inside the band."*

**One residual inconsistency worth flagging.** The advisory fires at `w > 140` — the top of a band the app
itself now says is not a rule, and which **9 of the vendor's own 36 published prompts exceed**. Firing an
advisory on a shape the vendor ships ~25% of the time is a false-positive generator.

### Correct grade now

`[OFFICIAL]` **contradicted**. The band is `[SYNTHESIS]` house craft, and is correctly labelled as such in
the current app text.

### Concrete app action

**Keep (already restated as a typical band) — one small follow-up.** Raise the advisory threshold from
`w > 140` to something outside the vendor's observed range (vendor max is 230), or reword it to read
"above the typical band" rather than as a defect. The binding limit is, and should remain, the
character/position ceiling — with target 1's caveat that its justification is *reference-encoder
truncation*, not a black frame.

---

## 3. Qwen-Image 2512 "prefers structured label blocks over prose"

**CLAIM** (verbatim, `PromptStudio.html` line 889, `KNOWLEDGE`):

> `CONTESTED (LORE): a community claim that 2512 actually prefers structured label blocks
> (Subject:/Pose:/Camera:/Lighting:) over prose — weakly evidenced, but directionally consistent with the
> order-over-grammar finding; both positions kept until tested.`

**Where it bites.** `PromptStudio.html` line 889 knowledge-bank text only. It does **not** drive
`TARGETS.qwenimg.system` (which mandates prose) and does **not** appear in the validator. Blast radius is
therefore limited to what the app *teaches*, not what it *emits*.

### VERDICT: **CONTRADICTED** — on two independent grounds. The efficacy sub-question stays open, but the app should stop carrying the claim.

**Access note, stated plainly as instructed.** `civitai.com/articles/30826/...` was **not** fetched;
`civitai.com` returns an empty body to automated fetches and is on the do-not-attempt list. I read the
article through **`civarchive.com`**, which works and carries the author label. `civitai.red` is invisible
to all server fetches, so nothing below is scoped to it.

### Ground 1 — the source is not a source. Civitai 30826 is a near-verbatim rewrite of an API reseller's marketing blog published 4½ months earlier.

`[LORE — third-party, not vendor]` **Civitai article 30826**, author **`Tukanazo1966`**, published
**2026-05-31T20:23:57Z**, read via
<https://civarchive.com/articles/30826/qwen-image-2512-prompt-guide-best-practices>, accessed **2026-09-17**.
Engagement metadata on the archive page: *"1K views · 10 reactions · **0 comments on CivitAI** · 2 collected."*
Zero comments = zero peer scrutiny.

The article presents itself as first-hand testing:

```text
Qwen-Image-2512 dropped in December 2025 from Alibaba Cloud's Qwen team, and after putting it through
its paces across ComfyUI and Forge Neo, I can say this is genuinely one of the most interesting
open-source models to come out in a while.
```

```text
This was the first thing I noticed when I started testing. Writing a prompt like a sentence feels
intuitive, but this model was trained on structured label data — meaning it actually processes
categorized information far more accurately than flowing prose.

I now almost never write narrative prompts for this model.
```

**But the same material — same example prompts, word for word; same statistics — was published on
2026-01-18**, four and a half months earlier, by an AI-API reseller's content-marketing blog.
`[LORE — third-party, not vendor, commercial]`
<https://help.apiyi.com/en/qwen-image-2512-prompt-guide-test-cases-en.html>, `meta-article:published_time:
2026-01-18T08:35:42+00:00`, accessed **2026-09-17**, verbatim:

```text
### 1.1 Structured Prompts Beat Narrative Descriptions

**The Wrong Way** (Narrative):

A young woman in a white dress walking in an autumn forest, sunlight shining from behind her,
creating a peaceful and ethereal atmosphere.

**The Right Way** (Structured):

Subject: young woman, professional model
Pose: walking forward, confident stride
Clothing: flowing white dress
Camera: medium shot, eye level
Environment: dense forest, autumn colors
Lighting: golden hour, backlit
Mood: serene, ethereal
```

```text
**How it works**: Qwen-Image-2512 was trained on data using structured labels, so the model responds
much more accurately to prompts that are clearly categorized.
```

The overlap is not thematic, it is textual and numeric:

| Element | apiyi.com, 2026-01-18 | Civitai 30826, 2026-05-31 |
|---|---|---|
| "Structured Prompts Beat Narrative Descriptions" | §1.1 heading | §1 heading, identical wording |
| The autumn-forest narrative example | verbatim | **verbatim, identical** |
| The 7-line `Subject:/Pose:/Clothing:/Camera:/Environment:/Lighting:/Mood:` block | verbatim | **verbatim, identical** |
| "Priority Order: Subject → Environment → Details", wrong/right headshot pair | verbatim | **verbatim, identical** |
| *"In 20 generations, the correct version produced a clear subject 95% of the time, while the wrong version only managed 70%"* | present | **same 95% / 70%** |
| "Keep it Simple: 1-3 Sentences is Best", 82-word verbose foil | present | **same rule, same 82 words** |
| "23 real-world test cases" | present | **"After running 23 test cases…"** |
| The three "breakthroughs" (text rendering / realistic faces / material textures) | present | **verbatim** |
| ">10,000 rounds of blind testing on LM Arena" | present | **verbatim** |

So the corpus's *"single source"* framing was **too generous**. It is not one independent source; it is
**one upstream marketing artifact and one uncredited downstream copy presented as personal testing**. Rule
2b's "corroborate on a different surface" is exactly what catches this: the second surface turned out to
be the first one wearing a hat.

And the upstream source has a **disclosed commercial interest**, inline, in the middle of the very claim:

```text
> 🎯 **Pro Tip**: For commercial photography, product shots, or portraits that need high-precision
control, we recommend using a structured prompt format. When calling the Qwen-Image-2512 API through the
[APIYI](https://apiyi.com) platform, you can save your favorite structured templates to boost batch
generation efficiency.
```

**Further internal tells, now visible with the full text in hand:**

1. **No grids, no images, no seeds for the structure claim.** The 08-28 grading said 30826 "cites seeds and
   n=20" — it does, but **for the *ordering* claim in §2, not the structure claim in §1**. The structure
   claim's entire evidentiary content is *"The difference in results is not subtle."* Upstream, it is a
   subjective **7/10 vs 9/10** table with no images:

   ```text
   | Prompt Type | Subject Clarity | Lighting Accuracy | Detail Richness | Generation Speed |
   | Narrative   | 7/10            | 6/10              | 7/10            | 28s              |
   | Structured  | 9/10            | 9/10              | 9/10            | 25s              |
   ```

2. **A number that appears only in the summary.** 30826's TL;DR asserts *"Structure over narrative —
   categorized prompts boost precision by ~30%"*. **The figure ~30% appears nowhere in the article body.**
   It is manufactured at summarisation time — the classic LLM-written-summary artifact.

3. **Two of its own Golden Rules contradict each other.** Rule 1 is an 8-line label block; Rule 3 is
   *"Keep it brief — 1–3 sentences, compress ruthlessly."* A label block is not sentences. Worse, the
   article's **own** §2 "Right order" worked example is *unlabelled line-broken prose*, not the §1 format
   — the article does not follow its own headline rule in its own examples.

4. **A physically implausible mechanism.** Both versions claim structured prompts generate *faster*
   (28s → 25s; *"generation is slightly faster too"*). Conditioning-sequence shape has no such effect on
   diffusion sampling time at these lengths. This is a fabricated detail, and it sits inside the one table
   offered as data.

### Ground 2 — the vendor's own rewriter emits prose, and explicitly says so.

This is the cleanest available proxy for the training caption format, as instructed, and it points the
other way. `[OFFICIAL]`
<https://github.com/QwenLM/Qwen-Image/blob/main/src/examples/tools/prompt_utils_2512.py>, accessed
**2026-09-17**, **GitHub snapshot 2026-07-23 09:24:55 UTC** (decoded from `meta-request-id:
0481:878C1:1528BB:1ED37B:6A61DDE7`, final segment `0x6A61DDE7` = 1784028295).

**Machine-checked absence over the whole 1,394-line file:** the tokens `Subject:`, `Pose:`, `Camera:`,
`Lighting:`, `Style:` and `Background:` occur **zero times**. Not in the English system prompt, not in the
Chinese one, not in any of the ~24 worked exemplars.

Every exemplar is continuous prose. Verbatim, first portrait exemplar:

```text
"A young East Asian woman with fair skin and black hair styled in a high bun adorned with a floral
crown of deep red and orange roses and chrysanthemums. She wears a white traditional-style garment with
red trim, cloud-patterned collar, golden frog closures, and embroidered flowers. …"
```

and the general-image exemplar:

```text
"A rugged mountain landscape under a clear blue sky with scattered white clouds. Snow-capped peaks
dominate the background, with steep rocky slopes and visible glaciers. …"
```

Most decisively, the rewriter's **Subtask 1 rule 6 anticipates exactly this question and rules against
the label block** — verbatim:

```text
6. **Recommended Description Flow**:

To ensure clarity, a logical flow is recommended for portrait descriptions. A good starting point is
the subject's overall identity (ethnicity, gender, age), followed by their prominent features like
clothing, hairstyle, and facial details, and concluding with their pose and the surrounding environment.

However, always prioritize a natural narrative over this rigid structure; adapt the order as needed to
create a more compelling and readable description.
```

*"Always prioritize a natural narrative over this rigid structure"* is the vendor, in its own shipped
rewriter, choosing prose over field order — while conceding the **order** the community noticed is real.
That is a precise split: **the ordering intuition survives; the label-block formatting does not.**

This corroborates `research/qwen-image.md` §D3 independently: the only structured form Qwen sanctions is
**line-broken, hyphen-led descriptive sentences for infographics in English**, and the Chinese rewriter
*forbids* headings and numbered lists outright.

### Independent replication: none found.

Surfaces searched: WebSearch (US index) on *"Qwen-Image 2512 structured label prompt vs natural language
prose comparison test"* and *"Qwen-Image 2512 prompt_utils_2512.py polish rewrite system prompt"*;
`civarchive.com` (article + its 0-comment thread); `help.apiyi.com`; `QwenLM/Qwen-Image` repo. **Every
hit that asserts the claim traces back to the apiyi.com → Civitai 30826 chain.** Not scoped to Reddit,
Discord, `civitai.red`, 知乎, Bilibili or `web.archive.org` — all unreachable, not attempted.

### Correct grade now

- **"2512 was trained on structured label data":** `[LORE — third-party, not vendor]`, **downgraded
  further to effectively unsourced** — the assertion is a bare mechanism-story in commercial marketing
  copy, contradicted by the vendor's own rewriter. It should not be repeated in either direction as fact
  about training data.
- **"Label blocks outperform prose on 2512":** **untested**. Nobody has published a grid. The claim's
  provenance is dead; its *truth* is simply unknown.
- **"Lead with the subject / order matters":** the one part with vendor support (rewriter rule 6's
  "recommended description flow"). `[OFFICIAL]`, keep.

### Concrete app action

**Delete the CONTESTED (LORE) clause from line 889** — do not merely re-label it. The current text says
*"weakly evidenced, but directionally consistent with the order-over-grammar finding; both positions kept
until tested."* Two problems: (a) "weakly evidenced" overstates it — it is evidenced by a copied marketing
post; (b) it is **not** directionally consistent, because the vendor's rewriter endorses the *ordering*
while explicitly rejecting the *rigid structure*, and the app's sentence fuses the two.

Replace with one sentence that keeps the surviving half and closes the dead half, e.g.: *"Order matters —
the official rewriter's own flow is identity → clothing/hair/face → pose → environment — but write it as
natural narrative: the rewriter says 'always prioritize a natural narrative over this rigid structure',
and emits continuous prose in all ~24 of its exemplars. The community `Subject:/Pose:/Camera:` label-block
claim traces to a single API-reseller marketing post (2026-01-18) republished uncredited on Civitai
(30826, 2026-05-31); it has no grids and no vendor support."*

**Needs a local test only if the maintainer still wants the efficacy answer.** `test-kit-2026-09.md`
**T1** already specs it (`T1-qwen-a-prose` / `-b-labels` / `-c-scrambled`). Per `qwen-image.md` §D3 the
(b) arm should be **re-specified**: run *three* arms — prose, bare `Label:` tokens, and the vendor's own
line-broken hyphen-led sentences — because the current (b) arm tests a format no first-party surface
sanctions, and a null result on it would prove nothing about structure in general.

---

## 4. "At 4 or 8 Lightning steps, seed variance collapses"

**CLAIM** (verbatim, `PromptStudio.html` line 889, `KNOWLEDGE`):

> `At 4 or 8 Lightning steps, seed variance is reported to collapse (LORE, n≈3, no grids published) —
> treat "sample multiple seeds" as conditional there, never as a rule.`

**Where it bites.** `PromptStudio.html` line 889 knowledge text, and the conditioning of the
"sample multiple seeds" advice (corpus X7). Not a validator rule — correctly so.

### VERDICT: **CONFIRMED** — and the app is *under*-claiming. Grids exist, a maintainer has acknowledged it, and n is ≥5, not ≈3.

The app's honest hedge (*"LORE, n≈3, no grids published"*) was accurate as of the 09-10 verification pass.
It is **no longer accurate**: the corpus was reading only the two HuggingFace discussion threads and had
not found the two **GitHub** issue threads on the maintainer's own repos, one of which contains published
comparison grids and a maintainer reply.

**Evidence A — published grids, on the maintainer's own repo.** `[TESTED]` `zewt`,
<https://github.com/ModelTC/Qwen-Image-Lightning/issues/42>, accessed **2026-09-17**, verbatim:

```text
In short, disabling guidance entirely for early steps (typically just the first step) helps increase
output variety by making it less likely to collapse into a small set of possible results very early on.
This screamed Qwen Image to me: it gives very little variation from seed to seed.  Trying this by setting
CFG=0 for the first denoising step, I'm surprised at how much of an improvement it gives.  It turns Qwen
Image from a really powerful but boring model (every seed is the same) into one I'll actually use.
```

and the methodology, which is the part the corpus said did not exist:

```text
Here are some examples.  These are all random seeds, not fixed across examples (this is to show the
change in variety, not compare individual outputs).  Top is a regular 20-step generation, CFG=3, giving
QI's usual nearly identical images.  The middle disables guidance for the first step (CFG=0).  It makes
a big difference in some and less in others, I included some of both.  The bottom is from
Lightning-8steps-V2.0.
```

**Eight prompt families**, each with a **three-row image strip** (4273×768 px, i.e. multiple seeds per
row), plus a downloadable ComfyUI workflow (`image_qwen_image_skip_guidance.json`) that splits the first
step across two `KSamplerAdvanced` nodes. Named mechanism with a citation: <https://arxiv.org/abs/2404.07724>.
**Grids now exist.** The app's "no grids published" is stale.

**Evidence B — a maintainer reply, accepting the premise.** `[STAFF]` `X-niper` (ModelTC — the org that
publishes Qwen-Image-Lightning), same thread, accessed **2026-09-17**, verbatim:

```text
We have read the paper before and we agree with the idea in the paper on handling the trade off between
diversity and quality.

The test is well organized and clear, thank you so much for your feedback.

As for your suggestion - disabling cfg for the first step, we agree with idea and we will try it out.
Besides we will also consider CFG annealing curve,  we will post new reply when there are updates.
```

This is the first `[STAFF]` acknowledgment on this topic in the corpus. `qwen-image.md` §T-c's standing
qualifier *"unanswered by the maintainers"* is now **stale**. The maintainer frames it exactly as the
literature does — a **diversity/quality trade-off** — which is a mechanism, not a defect report.

**Evidence C — a second independent tester, with same-seed images, and a new finding the corpus lacks.**
`[TESTED]` `menahem121`, same thread, accessed **2026-09-17**, verbatim:

```text
Here is a comparison I made using that technique versus without it, both with the same seeds. The prompt
was: "A young swordswoman". I've noticed that the more detailed the prompt is, the less variation appears
in the output images.
```

```text
My conclusion is that overall it's not a game changer, and the images produced with that technique are of
lower quality.
```

He posts four sets of three images (short prompt ± technique, detailed prompt ± technique). Two things
matter here:

1. **"The more detailed the prompt is, the less variation appears"** — a *prompt-length × seed-variance*
   interaction the corpus has nowhere. It is directly actionable for a prompt-writing app: the app's own
   output (long, detailed prose) is the regime where seed variance is *lowest*. That strengthens the
   existing advice to vary wording rather than seeds, and gives it a reason.
2. The workaround is **not** a free fix — an independent tester judges it a quality regression. The corpus
   should not promote the CFG=0-first-step trick as a remedy.

**Evidence D — a fourth reporter, with an image, on the other maintainer repo.** `[LORE]` `coco-yu`,
<https://github.com/ModelTC/LightX2V-Qwen-Image-Lightning/issues/45>, opened **2025-09-23**, accessed
**2026-09-17**, **GitHub snapshot 2026-09-17 22:36:09 UTC** (decoded from `meta-request-id:
2E02:2AFEFD:34C744E:4715C4B:6AAC6B59`, final segment `0x6AAC6B59` = 1789684569 — cache age **0 days**;
independently corroborated by the page's own image JWT `exp` of 1789684869, five minutes later). Verbatim:

```text
The generated images are almost identical (only minor difference) when the prompt is the same but the
seed is different.

I am curious as to why this phenomenon occurs.
```

One image attached. Issue state: **Closed**, no reply, no label, no assignee — closed silently, not
resolved.

**Running total of independent reporters:** `lightx2v` HF disc. 6 (2025-08-12) + HF disc. 4 (2025-08-17)
+ the third the corpus counted + `zewt` + `menahem121` + `coco-yu` = **n ≥ 5, on four separate surfaces,
across two maintainer repos and one model hub.**

### The correction that matters most

The app attributes the collapse **to the Lightning step counts**. `zewt`'s grids say otherwise, and the
top row of every one of his strips is the control that shows it:

```text
Top is a regular 20-step generation, CFG=3, giving QI's usual nearly identical images.
```

**Base Qwen-Image at 20 steps and CFG 3 already exhibits it.** Low seed variance is a property of
**Qwen-Image under guidance**, which distillation *compounds* rather than causes. The refinement:

| Configuration | Seed variance | Responds to CFG=0-first-step? |
|---|---|---|
| Base, 20 steps, CFG 3 | already low (`zewt`) | **yes**, "big difference in some" |
| Lightning **8-step V2.0** | low | **yes**, "works surprisingly well" |
| Lightning **8-step V1.1** | low | **no** — *"It broke V1.1 8-step a lot"* |
| Lightning **4-step** | lowest | **no** — *"The 4-step doesn't work at all"* |

So "at 4 or 8 steps" is too narrow *and* too coarse: the effect is broader than Lightning, and the
mitigations are version-specific.

### Correct grade now

Upgrade **`[LORE]` → `[TESTED]`** for the phenomenon (published grids + workflow + n ≥ 5 across four
surfaces), plus **`[STAFF]`** for the maintainer's acknowledgment of the diversity/quality trade-off.
The *mitigation* (CFG=0 on step 1) stays **`[TESTED]`, contested on quality** — one tester reports it
helps, one reports a quality regression, the maintainer has said only "we will try it out".

### Concrete app action

**Restate, and drop the hedges that are now false.** Replace line 889's clause with something like:
*"Qwen-Image gives little seed-to-seed variation under guidance — visible even on the base model at 20
steps / CFG 3, and sharpest at 4-step Lightning (TESTED: published grids, ModelTC/Qwen-Image-Lightning
#42; n≥5 across four surfaces; maintainer X-niper acknowledges the diversity/quality trade-off). Longer,
more detailed prompts reduce variation further. So vary the wording or the reference, not the seed."*

Specifically: **delete "no grids published"** (false), **delete "n≈3"** (now ≥5), and **delete
"unanswered by the maintainers"** from `qwen-image.md` §T-c (false). Do **not** add the CFG=0-first-step
workaround to the app — it is contested on quality and does not work on the 4-step at all.

**No local test needed.** This one is settled well enough for the advisory the app gives. If the
maintainer wants the prompt-length interaction pinned down, the cheap decisive test is: one prompt at ~15
words and one at ~120 words, 6 seeds each, 4-step Lightning, everything else fixed — that measures
`menahem121`'s claim directly and is the only part still resting on a single observation.

---

## 5. The LTX "≤150 words" figure

**CLAIM** (verbatim, `PromptStudio.html` line 866, `KNOWLEDGE`, and repeated in the myth-busting list at
line 969):

> `LENGTH IS VERSION-SPLIT: LTX-2.5's current guide gives no word count at all — "roughly 4-8 descriptive
> sentences" for a single shot, longer for screenplay-style scenes "provided every sentence adds concrete
> visual or audio detail". The only sourced 2.3-era word figure is the LTX-2 README's "Keep within 200
> words". The ≤150 figure the community repeats belongs to the retired LTXV-0.9 enhancer node
> (Llama-3.2-3B + Florence-2), which 2.5 does not use. OFFICIAL.`

**Where it bites.** `PromptStudio.html` line 866 `KNOWLEDGE`; the myth-buster entry at line 969; and
validator rule V6 (the LTX word band / sentence band split).

### VERDICT: **CONFIRMED — both halves, verbatim, against first-party sources.** With one provenance correction that makes the app's own framing *too generous to the 200 figure*.

**Half (a) — the ≤150 figure belongs to the retired LTXV-0.9 enhancer. CONFIRMED.**
`[OFFICIAL]` <https://github.com/Lightricks/ComfyUI-LTXVideo/blob/master/prompt_enhancer_utils.py>,
accessed **2026-09-17**, **GitHub snapshot 2026-08-04 10:54:43 UTC** (`meta-request-id:
0544:3923C0:13879A4:1B7D85F:6A71C4F3`, `0x6A71C4F3` = 1785768883; age 43 days). `T2V_CINEMATIC_PROMPT`,
verbatim:

```python
T2V_CINEMATIC_PROMPT = """You are an expert cinematic director with many award winning movies, When writing prompts based on the user input, focus on detailed, chronological descriptions of actions and scenes.
Include specific movements, appearances, camera angles, and environmental details - all in a single flowing paragraph.
Start directly with the action, and keep descriptions literal and precise.
Think like a cinematographer describing a shot list.
Do not change the user input intent, just enhance it.
Keep within 150 words.
```

```python
Do not exceed the 150 word limit!
Output the enhanced prompt only.
```

`I2V_CINEMATIC_PROMPT` in the same file carries the identical pair of sentences. And the file is confirmed
**LTXV-0.9-era** from its own internals: `_generate_image_captions` passes the Florence-2 control token
`system_prompt: str = "<DETAILED_CAPTION>"`, and `max_new_tokens: int = 256` is the enhancer's generation
cap — exactly the Llama-3.2-3B + Florence-2 pairing the corpus identified. **Half (a) stands, word for
word.**

**Half (b) — LTX-2.3's README says "Keep within 200 words". CONFIRMED.**
`[OFFICIAL]` <https://github.com/Lightricks/LTX-2/blob/main/README.md>, accessed **2026-09-17**,
**GitHub snapshot 2026-07-13 12:32:11 UTC** (`meta-request-id: 0504:1F08C5:4255750:5C2A31A:6A54DACB`,
`0x6A54DACB` = 1783945931; age **65 days** — again outside the 0–46-day window the tooling brief
describes; independently corroborated by the page's own embedded video JWT, whose
`X-Amz-Date` is `20260713T123211Z`, the same second). §*✍️ Prompting for LTX-2*, verbatim:

```text
When writing prompts, focus on detailed, chronological descriptions of actions and scenes. Include
specific movements, appearances, camera angles, and environmental details - all in a single flowing
paragraph. Start directly with the action, and keep descriptions literal and precise. Think like a
cinematographer describing a shot list. Keep within 200 words. For best results, build your prompts
using this structure:

- Start with main action in a single sentence
- Add specific details about movements and gestures
- Describe character/object appearances precisely
- Include background and environment details
- Specify camera angles and movements
- Describe lighting and colors
- Note any changes or sudden events
```

**Half (b) stands.** Note the README is 2.3-era in substance: its quick start downloads
`Lightricks/LTX-2.3` checkpoints and `google/gemma-3-12b-it-qat-q4_0-unquantized`.

### The provenance correction — 150 and 200 are the SAME text, not two sources

Reading the two blocks side by side, the LTX-2 README's prompting section is a **near-verbatim copy of the
retired LTXV-0.9 enhancer's own system prompt**, reflowed into a paragraph, with the number changed:

| LTXV-0.9 `T2V_CINEMATIC_PROMPT` | LTX-2 README §Prompting |
|---|---|
| "focus on detailed, chronological descriptions of actions and scenes." | **identical** |
| "Include specific movements, appearances, camera angles, and environmental details - all in a single flowing paragraph." | **identical, including the spaced hyphen** |
| "Start directly with the action, and keep descriptions literal and precise." | **identical** |
| "Think like a cinematographer describing a shot list." | **identical** |
| "**Keep within 150 words.**" | "**Keep within 200 words.**" |
| "For best results, build your prompts using this structure:" | **identical** |
| the seven structure lines | **identical, all seven, same order, same wording** |

Every sentence matches except the number. So the app's line — *"The **only sourced** 2.3-era word figure
is the LTX-2 README's 'Keep within 200 words'"* — is **literally true but rhetorically misleading**: it
implies 200 is a *better-sourced* figure than 150, when in fact 200 is **the same instruction with the
digit edited**, carried forward into a README from a component the corpus itself calls dead. Both numbers
share one ancestor. Neither is a measurement.

This *strengthens* the app's overall conclusion (stop teaching word caps) while correcting the reason:
the app currently treats 150 as discredited and 200 as authoritative. The honest position is that **both
are inherited boilerplate**, and the only number produced by anyone *describing the current model* is the
sentence count.

### Reconciling the word count and the sentence count — they are not rivals

The instruction asked for reconciliation rather than a contest, and the sources make it easy, because the
new guide **explicitly rejects fixed counts**. `[OFFICIAL/STAFF]`
<https://ltx.io/blog/ltx-2-5-prompt-guide>, **2026-08-10**, by **Rachel Luxemburg**, whose author bio on
the same page reads *"Rachel is the Senior Developer Advocate for LTX-2, connecting cutting-edge AI with
the developers who build on it"* — accessed **2026-09-17**. Verbatim, §*Simple / Single-Shot*:

```text
- Write your prompt as a **single flowing paragraph**
- Use **present tense** verbs for action and movement
- Match the level of detail to the shot scale (close-ups need more detail than wide shots)
- Describe camera movement relative to the subject
- Aim for roughly **4–8 descriptive sentences**
- Iterate freely — LTX is designed for fast experimentation
```

and §*Length*, in full:

```text
Match length to complexity rather than a fixed count. A simple single shot is often 4–8 sentences; a
longer screenplay-style scene can run longer, provided every sentence adds concrete visual or audio
detail.
```

**No word count appears anywhere on the page** — I checked the full rendered text; the strings "200
words" and "150 words" are absent. The corpus's `ltx23.md` line 145 claim is confirmed on the current
first-party guide.

**The reconciliation.** These measure the same thing at different granularity and do not conflict:

- 4–8 descriptive sentences of the density the guide asks for (shot type, lighting, action, character,
  camera, audio) runs roughly **20–25 words per sentence** → **≈80–200 words**. The vendor's own
  quick-start prompt in the LTX-2 README is a single flowing paragraph of ~190 words across ~9 sentences.
- So **"Keep within 200 words" and "roughly 4–8 descriptive sentences" describe the same envelope.** The
  200 is the outer edge of the sentence band, not a competing rule.
- **≤150 is the odd one out**, and it is the one the community repeats. It is tighter than both, and its
  only home is a dead component's system prompt — where it was an instruction *to a 3B summariser*, to
  stop it rambling, not advice to a human author.
- The guide's actual controlling principle is neither: *"Match length to complexity rather than a fixed
  count… provided every sentence adds concrete visual or audio detail."* **The binding test is
  informativeness per sentence, not any count.**

Also confirmed on the same page, supporting the app's adjacent multi-shot claim: *"**LTX-2.5** can also
generate **multi-shot scenes**"*, *"Prefer 2–4 shots in one generation"*, and *"Do **not** use a shot
list, numbered beats, or screenplay sluglines unless you also describe the cut in prose."*

### Correct grade now

- ≤150 belongs to the retired LTXV-0.9 enhancer: **`[OFFICIAL]` CONFIRMED** (read at source).
- LTX-2 README "Keep within 200 words": **`[OFFICIAL]` CONFIRMED**, but regrade its *authority* —
  `[OFFICIAL — inherited boilerplate from the 0.9 enhancer prompt, number edited]`, not an independent
  measurement.
- LTX-2.5 "roughly 4–8 descriptive sentences" + "match length to complexity rather than a fixed count":
  **`[OFFICIAL/STAFF]` CONFIRMED**, named author, dated, first-party domain. This is the current authority.

### Concrete app action

**Keep — with two small edits.**

1. **Line 866:** change *"The only sourced 2.3-era word figure is the LTX-2 README's 'Keep within 200
   words'"* → *"The 2.3-era README's 'Keep within 200 words' is the same sentence as the retired 0.9
   enhancer's 'Keep within 150 words', with the number edited — both are inherited boilerplate, not
   measurements."* This is a *strengthening* edit: it removes the implication that 200 is independently
   sourced.
2. **Add the reconciliation explicitly**, so the two numbers stop reading as rivals: *"4–8 descriptive
   sentences ≈ 80–200 words at the density the guide asks for, so the sentence band and the 200-word
   figure agree; the controlling rule is the guide's own — match length to complexity, and keep only
   sentences that add concrete visual or audio detail."*
3. **Validator V6 needs no change.** The 2.3 word band / 2.5 sentence band split is correct as specced.

**Incidental observation, out of scope, low confidence, flagged not folded:** the LTX-2 README quick start
pins `google/gemma-3-12b-it-qat-q4_0-unquantized`, while `PromptStudio.html` line 866 states LTX-2.5 uses a
version-gated **Gemma 4 12B** (`gemma4-12b-ltx-v1`). These are plausibly both right (2.3 vs 2.5 branches),
but the README snapshot is 65 days old and I did not verify the 2.5 encoder independently. **Not a finding
— a pointer for whoever next touches the LTX file.**

---

## Audit summary

| # | Claim | Prior grade | **Verdict** | New grade | Action |
|---|---|---|---|---|---|
| 1 | Krea 2 ~512 cliff, black at 640 | `[TESTED]` / "unconfirmed" | **CONTRADICTED** | cap `[OFFICIAL]`; cliff `[LORE]`, retracted | delete cliff from validator; rewrite KB line |
| 2 | Krea 2 "80–140 words" | `[SYNTHESIS]` as rule | **CONTRADICTED** | `[SYNTHESIS]` typical band | already fixed; raise advisory threshold |
| 3 | Qwen 2512 prefers label blocks | `[LORE]` CONTESTED | **CONTRADICTED** | effectively unsourced | delete clause; keep the ordering half |
| 4 | Lightning seed-variance collapse | `[LORE]`, n≈3, no grids | **CONFIRMED** (app under-claims) | `[TESTED]` + `[STAFF]` | restate; drop the false hedges |
| 5 | LTX ≤150 belongs to the 0.9 enhancer | `[OFFICIAL]` | **CONFIRMED**, both halves | `[OFFICIAL]`; 200 regraded as inherited | keep; two wording edits |

**Rule 2b's yield on this pass: three of five app-bearing claims moved.** Two collapsed on contact with a
second surface (1 and 3), one turned out to be *stronger* than the app claims (4). In both collapses the
decisive evidence was **already sitting in the original source** — a later comment in the same GitHub
thread, and an earlier publication date on the same text — which is the specific failure mode rule 2b
exists to catch: the corpus read each source **once**, at grading time, and never went back.

**Two process notes for the maintainer:**

1. **Single-source claims need a re-read date, not just an access date.** #14782's retraction was
   invisible because the corpus quoted a 2026-08-28 read three times without re-opening the page. Any
   claim graded on one open issue should carry a "re-check by" date.
2. **The tooling brief's "0–46 day" GitHub cache window is not universal.** Measured ages this run:
   **0 days** (`LightX2V-Qwen-Image-Lightning#45`), **43 days** (`prompt_enhancer_utils.py`), **65 days**
   (`LTX-2/README.md`), **85 days** (`krea-2/encoder.py`). Decode and state the age every time; two of
   four exceeded 46 days. **GitHub *issue* pages returned no `meta-request-id` at all** in two of three
   cases, so issue snapshots are undatable by this method — which matters most for exactly the
   single-source-issue claims rule 2b targets.


