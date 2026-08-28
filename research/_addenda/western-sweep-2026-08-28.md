# Western sweep — 2026-08-28

Agent B / Western-sources sweep for Prompt Studio.
Corpus baseline 2026-08-15; last deep digest 2026-08-27. Hunting for delta since
then, plus depth never harvested.

Evidence labels: `[OFFICIAL]` `[STAFF]` `[TESTED]` `[LORE]` `[SPECULATION]`.
All access dates 2026-08-28 unless noted.

**STATUS: complete.**

**Section order note:** sections appear as **1 → 5 → 2 → 3 → 4 → 6 → 7 → 8 → 9**.
§5 (Priority-target results) is deliberately placed immediately after the access
log because it is the priority deliverable for this run. Numbering follows the
required schema; only the physical order differs.

**Headline for the digest, if you read nothing else:**
1. ComfyUI **#14782 is resolved**: Krea 2 has a **hard ~512-token conditioning
   cap**; past ~576–640 positions it emits black or corrupted images **silently**,
   with the sampler reporting success (§5.1). The only `[TESTED]` item this run.
2. **Item C1 recovered and it is worse than a missing note**: BFL says FLUX.2 has
   no negative prompts, `diffusers` provides no string→negative path, yet
   **fal.ai and Segmind expose a `negative_prompt` field and fal's guide actively
   recommends using it**. Same problem affects **Z-Image Turbo** (§5.5).
3. **arXiv:2606.03715 (MIT/Technion, Jun 2026) undercuts the "write prose because
   the encoder is an LLM" doctrine** while *strengthening* "front-load your
   subject": word identity and **word order** are what the image model actually
   uses (§6.1, §7.1).
4. **Reddit was structurally unreachable** this run — the brief's Arctic Shift
   method cannot work under this fetcher's provenance rule (§8).

---

## 1. Method & access log

**Hard constraint discovered this run (important for future sweeps):**
`mcp__workspace__web_fetch` in this environment enforces a **provenance set** — it
will only fetch a URL that appeared *verbatim* in a user message, a prior
`web_fetch` result, or a `WebSearch` result. Error text:

> URL not in provenance set. web_fetch can only retrieve URLs that appeared in a
> user message, a prior web_fetch result, or a WebSearch result.

Consequences:
- **The `?cb=20260828` cache-buster instruction is incompatible with this
  fetcher.** Appending it changes the string so it no longer matches provenance
  and the fetch is refused. I dropped the cache-buster and fetched the exact
  URL strings returned by `WebSearch`. Recommend the task spec drop the
  cache-buster requirement for this toolchain.
- Every fetch must be *preceded* by a `WebSearch` that surfaces the URL. This
  roughly doubles the cost per page and makes "guess the URL" impossible
  (e.g. I could not directly hit `github.com/Comfy-Org/ComfyUI/issues/14782`
  until a search surfaced it).

**Second correction to the task brief:** the ComfyUI core repo is now
`github.com/Comfy-Org/ComfyUI`, not `comfyanonymous/ComfyUI`. Issue numbering
is continuous (#14782 resolves under the Comfy-Org path).

**What worked**
- `WebSearch` → good coverage, surfaces civarchive.com, GitHub, HF, blogs.
- `civarchive.com` model pages: **fetch cleanly and render the full CivitAI
  comment thread inline**, including nested replies, usernames, dates and
  reaction counts. Confirmed the prior run's assessment that this is the
  richest unmined vein. No login wall.
- `github.com` HTML issue pages: fetch fine, full issue body renders.
- Vendor/aggregator blogs (instasd.com, comfyui-wiki.com): fetch fine.

**What blocked me** — recorded per-attempt in §8.

---

## 5. PRIORITY-TARGET RESULTS

*(Placed early because this is the priority deliverable.)*

### 5.1 ComfyUI issue #14782 — RESOLVED. It is a hard 512-token conditioning cap on Krea 2.

URL: https://github.com/Comfy-Org/ComfyUI/issues/14782 (accessed 2026-08-28)
Note: the repo path is **`Comfy-Org/ComfyUI`**, not `comfyanonymous/ComfyUI`.

Title: *"Krea2 long prompts exceed reference 512-token conditioning limit and produce
corrupted outputs"*. Opened **2026-07-06** by `Goldlionren`. **Still OPEN** as of
2026-08-28. Label: `Potential Bug`. No assignee, no linked PR, **no maintainer
reply on the page**.

`[TESTED]` — this one genuinely qualifies. The reporter ran a controlled sweep
with the *same* prompt, workflow, model and generation settings, varying only the
final conditioning sequence length, and states that explicitly:

> The sequence length was the only intentionally changed variable.

Reported results table (verbatim structure):

```
Final Krea2 conditioning sequence | Result
49   | OK
512  | OK
513  | OK
576  | OK
640  | Black output
674  | Corrupted/noisy output
```

Instrumentation on the failing prompt, verbatim:

```
raw_chars=3785
token_pairs=708
template_end=34
final conditioning seq=674
conditioning shape=(1, 674, 30720)
```

Mechanism, as stated by the reporter `[TESTED]` / `[SPECULATION]` on the fix:

> The reference implementation uses a default `max_length=512` and truncates the
> prompt body while preserving the final 5-token template suffix.

> In the current ComfyUI implementation, Krea2 inherits the Qwen3-VL tokenizer
> path and the resulting conditioning sequence is not capped to the Krea
> reference length before being passed to Krea2.

Failure signature is silent: KSampler reaches 8/8, no exception, no OOM, VAE
decode completes, output is black or noise. Reporter has a local patch and offers
a PR; upstream has not indicated a direction. Possibly related: issue **#14717**
(same symptom class, does not identify sequence length as the trigger).

**Prompt Studio implications (high value, actionable):**
- Krea 2 in ComfyUI has an effective **~512-token prompt ceiling**, and exceeding
  it fails *silently and deterministically*, not gracefully. The 34-token template
  prefix is stripped, so the budget is on the user's prompt body.
- Rough char budget from the reporter's own numbers: 3785 raw chars → 674
  post-prefix positions ≈ **5.6 chars per conditioning position**, so 512
  positions ≈ **~2,850 characters**. `[SPECULATION]` — this is my arithmetic on
  his figures, not his claim. Treat ~2,500 chars as a safe teaching ceiling.
- Note the cliff is not at 512: 513 and 576 still rendered OK; 640 went black.
  So the true failure boundary is somewhere in (576, 640]. Do **not** teach
  "512 = hard crash"; teach "512 is the reference cap, past ~600 it dies".
- **Directly relevant to the corpus rule that prompt-expansion/rewriting is
  risky**: on Krea 2 an auto-expander is not merely a quality risk, it can push
  a working prompt over the cliff and produce a black frame.

### 5.2 Civitai article 18294 — PARTIALLY recovered. Content is weak; it is not a test.

- Direct fetch of https://civitai.com/articles/18294/can-newer-models-handle-sdxl-style-prompts-testing-hi-dream-and-qwen-image
  (accessed 2026-08-28) returns the login interstitial:
  *"Log in to continue / This content requires an account"*. The page also carries
  `meta-robots: noindex,nofollow`, which is why it is thin in indexes.
- **No civarchive mirror exists for it.** `civarchive.com` mirrors *models* and
  their comment threads; its article coverage (`civarchive.com/articles`) did not
  surface this piece in any search I ran. Searching `civarchive.com articles "Can
  Newer Models Handle SDXL-Style Prompts"` returns only the walled civitai.com
  original.
- Recovered content is limited to the search-index summary `[LORE]`: the article
  takes **one** elaborate "gothic cyberpunk empress" prompt originally written for
  SDXL and runs it through **Hi-Dream** and **Qwen-Image** without LoRAs.
  Conclusion as indexed: Hi-Dream "keeps the gothic weight and cinematic shadows"
  while Qwen-Image "amplifies the cyber-fantasy with bold neon flair"; therefore
  "old SDXL prompt libraries aren't obsolete".

**Verdict: downgrade and largely discard.** This is n=1, one prompt, two models,
no seeds, no grid, no negative control, and the models tested are **Hi-Dream and
Qwen-Image (base) — neither is Qwen-Image-2512**, and no SDXL fine-tune family is
actually in the comparison. It is a vibes post. It must **not** be used to support
"SDXL tag prompts transfer to Qwen". Marking this target **closed as low-value** so
future runs stop spending budget on it.

### 5.3 A *better* Civitai article surfaced in its place — and it is NOT login-walled.

**Civitai articles are fetchable when they are not individually gated.** Article
30826 fetched in full, anonymously.

`Qwen-Image-2512 — Prompt Guide & Best Practices`, by **Tukanazo1966**, dated
**2026-05-31**, ~1k views.
https://civitai.com/articles/30826/qwen-image-2512-prompt-guide-and-best-practices
(accessed 2026-08-28)

Its central claim **contradicts a widely-held corpus-adjacent position** and is
worth flagging (see §7): it argues Qwen-Image-2512 prefers **structured,
label-categorised prompts over narrative prose**, verbatim:

> This was the first thing I noticed when I started testing. Writing a prompt like
> a sentence feels intuitive, but this model was trained on structured label data
> — meaning it actually processes categorized information far more accurately than
> flowing prose.

Its recommended structured form, verbatim:

```
Subject: young woman, professional model
Pose: walking forward, confident stride
Clothing: flowing white dress
Camera: medium shot, eye level
Environment: dense forest, autumn colors
Lighting: golden hour, backlit
Mood: serene, ethereal
```

Other claims (all with the same evidence problem, see grading below):
- **Front-loading the subject.** Claims: *"In 20 generations with the same seed,
  the correctly ordered prompt produced a well-composed, clear subject 95% of the
  time. The reversed version only managed 70%."*
- **Brevity.** *"1 to 3 sentences is the sweet spot"*; a 31-word prompt beat an
  82-word prompt.
- **Text rendering — quote the literal string.** *"Always wrap text in double
  quotes. This alone bumps spelling accuracy from about 65% to 85%."* Plus:
  name the font class ("bold sans serif"), one text element per line with a
  stated position, and simplify mixed alphanumerics
  (`"Issue #25 Jan 2026"` → `"Issue 25"`).
- **Parameters.** Golden config given as **CFG 4.5 + 50 steps**; CFG 7.0 + 50
  steps for text-heavy work ("~96% accuracy"); CFG >7.0 "noticeably kills the
  naturalness of skin and lighting".
- **Negative prompts do work on Qwen-Image-2512**, universal baseline given
  verbatim:
  ```
  blurry, low quality, pixelated, distorted, watermark, text overlay, oversaturated, plastic-looking, artificial
  ```

**Grading: `[LORE]`, not `[TESTED]`.** It cites fixed seeds and stated n (20
generations, 23 test cases), which is more than most, but there are **no grids,
no images of the comparisons, and no raw data**, and the percentages are
suspiciously tidy and uniformly framed as "X% → Y%" (65→85, 75→90, 60→85, 70→95).
That pattern plus the prose register makes me think parts of this article are
LLM-written. Do not promote to `[TESTED]`. Useful as a hypothesis generator only;
the front-loading and quoted-text claims are worth an in-house replication.

### 5.4 civarchive.com comment mirrors — the vein is real, and I confirmed how to mine it

`[OFFICIAL — access method]` civarchive model pages render **the full CivitAI
comment thread inline**, with usernames, dates, reaction counts and nested
replies, and require **no login**. Example proven this run:
https://civarchive.com/models/1817671?modelVersionId=2057465 (Wan Video 2.2,
30 comments) — accessed 2026-08-28.

Methodology-bearing items harvested from the Wan 2.2 thread (all dated Jul–Oct
2025, so these are **corroboration of existing corpus positions, not new**):

- **De-distillation, community-side confirmation.** `[LORE]` — `sumsenchi101`,
  2025-07-30, 10 reactions:
  > Every workflow out there has used the self forcing lora to speed up
  > generations. What I've found is if you use it on the high noise model
  > especially, it loses A LOT of its natural capabilities. I was wondering why a
  > lot of the keywords that were trained into the model that was presented in the
  > official video wasn't really working well. It was the lightx2v lora. You need
  > to increase the CFG and disable the lightx2v for best results.

  and the follow-up:
  > In 2.1 it just pollutes its ability to generate faces. In 2.2 its overall
  > motion and its general capabilities overall is affected.

  This is an independent, dated, community statement of the corpus position
  *"distillation + LoRA = partial de-distillation; raise steps/CFG above the
  official Turbo recipe"* — and it adds a specific, teachable nuance: the damage
  is concentrated in the **high-noise expert**, i.e. the composition/motion stage,
  which is exactly where prompt adherence lives. No seeds or grids → `[LORE]`.

- **LoRA routing by type across the MoE stages.** `[LORE]` — `funscripter627`,
  2025-07-29:
  > I think you need to apply your character lora's to the low noise model and any
  > movement/concepts to the high noise model... If you apply your character lora
  > to the high noise model you need to increase the strength to around 2 or 3 for
  > it to make any difference.

  Consistent with 5.4's de-distillation point: high-noise = motion/concept,
  low-noise = identity/detail. Useful mental model for teaching *where* a prompt's
  motion words get resolved.

- **VAE pairing correction.** `[LORE]` but crisp and mechanically checkable —
  `ezram`, 2025-08-01, 5 reactions:
  > 2.2 VAE is for the small 5B model only. The new 2.2 14B models still uses the
  > 2.1 VAE

  (Posted in reply to a full `size mismatch for encoder.conv1.weight ... [160,12,3,3,3]
  vs [96,3,3,3,3]` state-dict traceback.) A frequent local-setup failure mode.

- **T2V-only single-expert shortcut.** `[LORE]` — `p0z`, 2025-08-10, 7 reactions:
  > FYI, you can just use the low noise t2v model without using the high noise t2v
  > model. This trick only works for text2video, it **does NOT** work with
  > image2video.

  Disputed in-thread by `kakkkarot` (2025-09-05), who says the result is "slow mo
  mediocre movements". **Both kept — sources conflict.** Relevant to Prompt Studio
  because a single-expert T2V run will not respond to motion prompting the way the
  two-expert graph does.

- **5B verdict.** `[LORE]` — `hailprev` 2025-07-28 (8 reactions): *"From early
  testing T2V for 5B is really bad"*; `hoyleontour588` 2025-07-29 (6 reactions):
  *"the 5B model is pretty terrible. The I2V is appalling. The T2V is at about the
  same level as LTX around 12 months ago."* Consistent, multiple independent
  voices, still no methodology → `[LORE]`.

**Mining note for the next run:** the comment mirror is genuinely rich, but the
Wan 2.2 base-model page's comments are **all from the 2025 launch window**. The
`Updated: 8/28/2026` field on that page refers to archive metadata, not new
comments. To find *recent* methodology, target **recently-published derivative
model pages** (LoRAs, workflows, fine-tunes) rather than the frozen base-model
pages. Concrete unmined candidates listed in §9.

### 5.5 Hosted-klein negative prompts (item C1) — RECOVERED, and it is a documentation trap

This is the most consequential finding of the run for a teaching app, because
**the sources directly contradict each other and two of them are wrong.**

**The official position — `[OFFICIAL]`:**
Black Forest Labs' own prompting guide states flatly that FLUX.2 has no negative
prompt. Surfaced verbatim via search of https://docs.bfl.ml/guides/prompting_guide_flux2
(accessed 2026-08-28):

> FLUX.2 does not support negative prompts. Focus on describing what you want, not
> what you don't want.

**The reference-implementation position — `[OFFICIAL]`:**
`diffusers` issue #13416, *"how to use zimage and flux2 with negative prompt?"*,
opened **2026-04-04** by `chaowenguo`, label `bug`, **still OPEN with no
maintainer reply** as of 2026-08-28.
https://github.com/huggingface/diffusers/issues/13416 (accessed 2026-08-28)

> `from pipeline_flux_with_cfg import FluxCFGPipeline` — it allows to use negative
> prompt with flux, is there any similar stuff with zimage and flux2?
> I means diffusers.ZImagePipeline with Tongyi-MAI/Z-Image-Turbo and
> diffusers.flux2kleinpipeline with black-forest-labs/FLUX.2-klein-9B I see there
> is `negative_prompt_embeds: str | list[str] | None = None,` in the `__call__()`
> function but how to convert negative_prompt to negative_prompt_embeds?

Two things this pins down:
1. `Flux2KleinPipeline` and `ZImagePipeline` expose **`negative_prompt_embeds` but
   no `negative_prompt`** — i.e. the plumbing is present but there is no supported
   path from a *string* to a negative conditioning. FLUX.1 needed an out-of-tree
   `FluxCFGPipeline` for the same reason; FLUX.2/Z-Image have no such community
   pipeline referenced.
2. **This affects Z-Image the same way it affects klein.** The corpus fragment C1
   was filed under klein; it is actually a *shared* CFG-distilled-model problem
   covering FLUX.2 klein, FLUX.2 dev, and Z-Image Turbo.
3. Nobody at HF has answered in ~5 months. Treat "there is a supported way" as
   unproven.

**The hosted-API contradiction — this is the trap:**

| Source | Date | Says about klein negative prompts |
|---|---|---|
| BFL docs `[OFFICIAL]` | current | "FLUX.2 does not support negative prompts." |
| HF `diffusers` `[OFFICIAL]` | 2026-04-04, open | no `negative_prompt` arg exists; only `negative_prompt_embeds` |
| **fal.ai** klein guide `[LORE]` | 2026-01-16 | **"The `negative_prompt` parameter specifies what to avoid. Strategic use proves more effective than exhaustive listing."** — and gives recipes |
| **Segmind** klein API docs `[LORE]` | current | exposes a `negative_prompt` parameter |
| **deAPI** klein guide `[LORE]` | 2026-04-29 | **"No negative prompt, no guidance scale."** / "FLUX.2 Klein ignores them entirely." |

Quotes:

fal.ai, https://fal.ai/learn/devs/flux-2-klein-prompt-guide (Brad Rose, last
updated 2026-01-16, accessed 2026-08-28):

> **Negative Prompts**: The negative_prompt parameter specifies what to avoid.
> **Strategic use** proves more effective than exhaustive listing. For portraits:
> "distorted features, unnatural proportions, extra limbs."

deAPI, https://deapi.ai/blog/prompting-flux-2-klein-what-works-what-doesnt-and-why
(published 2026-04-29, accessed 2026-08-28):

> **No negative prompt, no guidance scale.** You don't get an "avoid this" lever.
> Every instruction has to be phrased positively: instead of "no blur," write
> "crisp focus with razor-sharp details."

> **Using negative prompts.** FLUX.2 Klein ignores them entirely.

**My reading `[SPECULATION]`, stated as such:** klein is step-distilled and
CFG-distilled (deAPI reports fixed 4 steps and `"guidance": 0` in its own working
API payload). A negative branch requires a second forward pass at CFG>1. A host
that exposes `negative_prompt` on a guidance-0 distilled model is either (a)
silently discarding the field, or (b) internally raising guidance, which
de-distills the model — the same failure mode the corpus already documents for
LTX distilled negatives being inert at CFG=1 and for accelerators silently
disabling negative-prompt nodes. **This is the same bug wearing a third hat.**

**What Prompt Studio should teach:** on FLUX.2 (dev and klein) and Z-Image Turbo,
a negative prompt field, *even when the host shows you one*, is not a reliable
lever. Steer positively. If a user must suppress something, the corpus's NAG
workaround (documented for LTX) is the architecturally analogous move — and note
a `ComfyUI-Krea2-NAG` node now exists for the same reason on Krea 2 Turbo
(https://comfyui-wiki.com/en/news/2026-08-10-comfyui-krea2-nag, surfaced
2026-08-28, not yet fetched — see §9).

Also worth recording: **fal's klein guide is unreliable across the board**, not
just on negatives. It also tells users to increase `num_inference_steps` for
"print-ready assets" and to tune `guidance_scale` between 2 and 8 — both of which
contradict a 4-step, guidance-0 distilled model. It cites two unrelated 2022
arXiv papers (2211.15462, 2207.12598) as its evidence base. Treat fal `/learn`
pages as SEO content, not documentation.

### 5.6 Weighting / emphasis syntax audit — `()`, `[]`, `{}`, `:weight`

C6 previously corrected `{}` as **NovelAI** syntax, not A1111. Extending that
audit across the current model families:

**The general rule that has emerged `[LORE]`, consistent across independent
sources:** numeric token weighting is a **CLIP-era mechanism**. Every model in
scope that has replaced CLIP with an LLM text encoder (Qwen3 / Qwen3-VL / Mistral
Small 3.2) has lost it — not "weakened", *mis-behaving*, because scaling one
token's embedding perturbs a sentence-level representation.

Best statement of the mechanism found this run, InstaSD's Krea 2 guide,
https://www.instasd.com/post/krea-2-prompt-and-style-guide-comfyui (accessed
2026-08-28) — `[LORE]`, vendor blog, no seeds/grids:

> The first thing people reach for when they want more of something is the old
> ComfyUI emphasis syntax, `(word:1.3)`. With Krea 2 it mostly doesn't do what you
> remember. That syntax was built for CLIP, where every token carries its own
> weight and you can dial one up on its own. The Qwen3VL encoder reads the whole
> sentence as language, so scaling one token's embedding shoves the entire
> conditioning around instead of lifting that one word. Push much past 1.2 and the
> picture falls apart before the emphasis ever lands.

Its three replacement levers, verbatim headings:
> - **Order carries the emphasis.** The encoder front-loads.
> - **Restate instead of multiply.** Rather than `(rust:1.4)`, describe the rust
>   twice in different words: "a rusted iron gate, orange corrosion eating through
>   the hinges."
> - **Be specific, not loud.** ... "Red" at 1.5 gets you a fight with the model.
>   "Oxblood" gets you the color on the first try.

Independent agreement from fal on klein — `[LORE]`, same caveats:
> **Weighted Emphasis**: Flux 2 [klein] does not use explicit weight syntax but
> responds to natural language emphasis. Phrases like "prominently featuring,"
> "with particular attention to," or "especially detailed" signal priority
> elements to the model.

And the "front-load the subject" lever is asserted independently by **four**
unrelated sources this run — InstaSD (Krea 2), fal (klein), deAPI (klein:
*"Front-load your subject. The model pays more attention to what appears first in
the prompt."*), and the Civitai Qwen-2512 guide (*"The model weights what comes
first"*). Four independent LLM-encoder models, same advice. That convergence is
the strongest signal in this sweep. `[LORE]` — none of them show grids, but the
independence is meaningful.

**Audit table — what Prompt Studio should teach per family:**

| Syntax | Origin | Where it is real | Where it is a mis-teaching |
|---|---|---|---|
| `(word:1.2)` | A1111 / ComfyUI CLIP token weighting | SDXL fine-tunes (Juggernaut, RealVis, Pony, Illustrious, NoobAI, Animagine) — all still CLIP-L+G | **Krea 2** (Qwen3-VL): destructive past ~1.2 `[LORE]`. **FLUX.2 klein/dev** (Qwen3 / Mistral Small 3.2): "does not use explicit weight syntax" `[LORE]`. **Qwen-Image**: not attested to work. |
| `((word))` nested parens | A1111 (≈1.1^n) | SDXL family only | same as above |
| `[word]` de-emphasis | A1111 (÷1.1) | SDXL family only | same as above |
| `{word}` | **NovelAI** — *not* A1111 (C6, re-confirmed) | NovelAI-lineage UIs only | Being taught as A1111/ComfyUI syntax is the C6 error. In ComfyUI `{a|b}` is *wildcard/alternation* in some node packs, a completely different meaning — a live collision worth calling out. |
| `:weight` bare | ComfyUI/A1111 inside parens only | SDXL family | Not a standalone syntax anywhere in scope. |
| Node-level weight | — | **`Krea2 Prompt Weight` community node** is the sanctioned numeric knob for Krea 2 per InstaSD; LoRA strength otherwise | — |

InstaSD verbatim on the sanctioned escape hatch:
> If you do need a real numerical knob, say for matching a brand color or pushing a
> style LoRA up and down, use the LoRA strength value or the community
> `Krea2 Prompt Weight` node. Those are built for it. For the prompt text itself,
> sentences win.

**Gap I could not close this run:** I found no source testing `()` weighting on
**Z-Image** or on **Qwen-Image-2512** specifically. Both use LLM encoders so the
same mechanism should apply, but that is `[SPECULATION]` until tested. Flagged in
§9.

---

## 2. New releases & license changes

### 2.1 ComfyUI **v0.34.0 and v0.34.1, both released 2026-08-26** — inside the delta window

Source: https://docs.comfy.org/changelog and https://github.com/comfy-org/ComfyUI/releases
(surfaced 2026-08-28; the full changelog page is ~100k chars and exceeded my fetch
limit, so the following is from the search-index extract of that official page —
`[OFFICIAL]` in origin, but **flag for verification** on the next run.)

The corpus already has "ComfyUI v0.34.0 partner/API node" for the closed Wan
tiers. Two items in these releases appear to be **new depth**:

- **`embedding:` syntax now works in MiniMax-H3 prompts.** Verbatim from the
  changelog extract: *"MiniMax-H3 prompt embeddings can now be loaded with the
  `embedding:` syntax in prompts."* `[OFFICIAL]`
  **This directly modifies a corpus position.** The corpus records H3 as having
  "zero Civitai LoRAs" and the SCAIL/Animate class as prompt-inert. H3 now has a
  first-class in-prompt hook for loading precomputed embeddings — a real prompt
  syntax for a model Prompt Studio currently treats as having none. Worth a
  dedicated dig next run: what produces those embedding files, and does the
  syntax accept a weight.
- **`TAESD H3`** — lightweight VAE decoder for fast previews on H3. `[OFFICIAL]`
  Practical relief for the "5s local floor" H3 problem in the corpus.
- v0.34.1 partner nodes: **`WAN3-Prime` adds a "Wan 3.0 Prime" model option with
  higher per-second rates**; Recraft V4 Styles nodes added; Google Veo 2 and
  Veo 3.0 removed. `[OFFICIAL]`
  → **Corroborates, does not change, the corpus position**: Wan 3.0 is reachable
  from ComfyUI only as a *billed partner/API node*. Nothing open-weight.
- Also new open-model support in v0.34.0: Pixal3D, TRELLIS2 (3D mesh/texture),
  SAM 3D Body. Out of scope for prompt translation.

### 2.2 **FLUX 3 — announced 2026-07-23, NOT open-weight, NOT locally runnable**

`[OFFICIAL]` https://bfl.ai/blog/flux-3 (surfaced 2026-08-28)

This is a **new closed tier in an in-scope family** and needs to be recorded
alongside the Wan 2.5/2.6/2.7/3.0 caveat, or users will assume FLUX 3 is the
successor to FLUX.2 dev that they can download. It is not.

Staged rollout as reported:
- **FLUX 3 Video** — early access now, API + *private* weights to initial partners.
- **FLUX 3 Action / FLUX-mimic** — early access, selected robotics partners.
- **FLUX 3 Image** — "rolling out in the coming weeks".
- **FLUX 3 Dev** — open-weight version of the multimodal backbone, *"planned for
  later in 2026"*. **No release date, no license terms, no model size disclosed.**

Capability summary (for context only, it is not runnable): a single unified
backbone producing images, video, synchronized audio and robot-action sequences;
up to ~20s of ~720p video with native sync sound. BFL calls the program "Real
World Models".

**Prompt Studio rule to add:** FLUX 3 belongs in the same "real but closed" bucket
as Wan 2.5+. Do not offer FLUX 3 presets. When FLUX 3 Dev lands, it will be a
*third* text-encoder generation in the FLUX family — the corpus already tracks
FLUX.1 (T5+CLIP), FLUX.2 dev (Mistral Small 3.2), FLUX.2 klein (Qwen3). Expect the
same wrong-encoder-black-image class of failure.

### 2.3 **Wan-Dancer-14B — Apache 2.0, open weights, and I believe it is missing from the corpus**

`[OFFICIAL]` https://huggingface.co/Wan-AI/Wan-Dancer-14B — model page shows
"Image-to-Video • Updated Jul 17". Paper: https://arxiv.org/abs/2607.09581
(2026-07-10, revised 07-17). Announced by @Alibaba_Wan 2026-07-14.
Contextualised in: https://huggingface.co/blog/ResterChed/wan-3-0 (community
article by Viddi AI, published 2026-07-29, accessed 2026-08-28).

The corpus says Wan-Animate-2 (Apache, 08-07) is the newest open release, which
remains true by date. But **Wan-Dancer-14B (2026-07-13, Apache 2.0) is an
open-weight Wan release in the video family and I found no sign it is in scope
anywhere in the corpus summary I was given.** Flagging it as a gap.

Why it matters for a prompt-teaching app — it is **not** prompt-inert:
- The Diffusers call takes a real `prompt` argument alongside image + audio, e.g.
  `prompt="K-pop dance with precise beat synchronization"`.
- Reported **Prompt Alignment 9.03** vs MusicInfuser 6.61 — the paper's own
  headline metric is prompt alignment, unusual for an audio-driven model.
- Official inference params from the model card `[OFFICIAL]`:
  **global stage 48 steps CFG 5.0; local stage 24 steps CFG 5.0.** Note CFG 5.0 —
  a *real* CFG, so unlike the distilled models in scope, **negative prompts are
  architecturally live here**.
- Two-stage hierarchical generation: global stage makes 38 sparse keyframes across
  the whole track at low res; local stage refines 5-second / 149-frame segments at
  720p30 in parallel. Dynamic frame rate 3–15 fps via absolute time identifiers in
  RoPE.
- Five genres: Chinese Classical, K-Pop, Latin, Tap, Street.
- 14B bf16 ≈ 28 GB VRAM minimum; ~85 GB on disk.

### 2.4 Wan siblings that are **papers only**, no weights — do not promise these

`[OFFICIAL]` (papers) / `[LORE]` (the Wan-3.0 inference around them):
- **WanSong v1.0** — text-to-music, ~25B, hybrid-MMDiT. https://arxiv.org/abs/2607.14749
  (2026-07-16). **Paper only, no weights, no published license.**
- **Wan-Streamer v0.3** — real-time AV streaming, https://arxiv.org/abs/2607.15038
  (2026-07-16). **Code CC BY 4.0, no model weights released.**

**One genuinely novel prompt-syntax datum from Wan-Streamer v0.3** `[OFFICIAL]`,
and it is directly relevant to the weighting/emphasis audit: the model takes
**open-vocabulary behaviour actions via parenthesized directives**, quoted from
the paper description:

```
(reaches into the grass and picks up a green leaf) Look what I found.
```

So in the current landscape `(...)` now means at least **three** different things
depending on model: CLIP token emphasis (SDXL family), nothing-or-damage (Qwen3/
Qwen3-VL encoders), and **stage-direction action markup** (Wan-Streamer). Prompt
Studio must not treat parentheses as a portable syntax. See §5.6.

### 2.5 Wan 3.0 release-date rumour — explicitly unverified, and it did **not** land

The community article repeats a leak (@koltregaskes citing MarsForTech) placing
**Wan 3.0 on 2026-08-06**. The article itself says it "has not been verified by
Alibaba", and its own FAQ says: *"Alibaba has not published a release date, model
card, or technical report for Wan 3.0."* `[LORE]` — and as of 2026-08-28 what
exists is a **billed ComfyUI partner node** (§2.1), not weights.
**This corroborates the corpus position. Nothing has changed.** Recording it so
the next run does not re-litigate the rumour.

The same article's license warning is worth adopting verbatim as house policy:
> **The license.** Wan 2.x and Wan-Dancer are Apache 2.0. WanSong and Wan-Streamer
> have no published license. Do not ship a product that depends on Wan 3.0 being
> Apache 2.0.

### 2.6 LTX — license terms recorded precisely (this is a license *clarification*, not a change)

`[OFFICIAL]` https://ltx.io/llm-info ("Last updated: August 2026", accessed
2026-08-28).

- **LTX-2.5 launched 2026-08-11.** Confirms the corpus date.
- License is the **LTX Model License, explicitly NOT Apache 2.0**. Verbatim:
  > Free to use for organizations with under $10 million in annual revenue.
  > Companies above $10M ARR embedding LTX into commercial products or production
  > environments require a commercial license.
- LTX-2.5 "further reduces restrictive third-party dependencies in the model
  license". That is the "cleaner licensing" bullet — a *relaxation*, but the ARR
  gate remains.
- **LTX-2.3 = released March 2026, 22B.** Its listed improvement over LTX-2 is
  *"a 4x larger text connector for stronger prompt adherence"* — a prompt-relevant
  fact about 2.3 specifically, which is in scope and thinly covered.

### 2.7 Nothing else new

No new open-weight release found this run for: Wan 2.2 core, MiniMax H3, SCAIL-2,
Z-Image, Qwen-Image / Qwen-Image-Edit, Krea 2, or any of the five SDXL fine-tune
families. See §8.

---

## 3. Official guide / model card / docs changes

### 3.1 LTX published an **official LLM-facing fact sheet** at `ltx.io/llm-info`

`[OFFICIAL]` — accessed 2026-08-28. This is a page written *for* AI assistants,
containing a literal section headed **"Instructions for AI Assistants"**. It is
authoritative for specs and licensing and simultaneously a marketing artifact.
**Treat its spec/licensing content as `[OFFICIAL]` and its competitive claims as
vendor marketing** (e.g. "roughly one-eighth the cost and one-seventh the render
time of comparable closed models", "the only production-grade open-source video
model without China-based infrastructure"). Do not launder those into the corpus
as findings.

**Prompt-relevant LTX-2.5 facts, verbatim:**

Text encoder change (LTX-2.3 used Gemma 3 12B IT; 2.5 moves to Gemma 4):
> **Custom Gemma 4 12B Text Encoder:** A purpose-built text encoder retains more
> of a complex prompt — multiple subjects, actions, lighting, and camera direction
> — reducing the need for rephrasing or regeneration.

The prompt enhancer, **as an officially promoted feature**:
> **Dedicated Prompt Enhancer:** A lightweight model expands short prompts into
> detailed cinematic instructions at near-zero added compute cost.

**Auto Duration — this is new and it is a prompt-semantics change:**
> **Auto Duration:** The model predicts appropriate clip length from the described
> action rather than requiring a fixed duration parameter.

`[SPECULATION]`, flagged: if duration is inferred from the described action, then
the *verb and its implied span* in an LTX-2.5 prompt now has a second-order effect
on output length. "she turns her head" and "she walks across the plaza" would
yield different clip lengths from the same settings. That is a teachable,
LTX-specific prompt behaviour with no analogue in Wan. Needs testing.

**Native Multishot** — also a prompt-semantics change:
> **Native Multishot:** A single generation produces multiple connected shots,
> holding character, environment, lighting, voice, style, and continuity across
> cuts (wide, over-the-shoulder, medium, close-up).

`[SPECULATION]`: this implies multi-shot prompts (explicit shot lists) are now a
supported prompt form on LTX-2.5, where on Wan 2.2 the corpus rule is "one camera
verb first". **The two models now want structurally different prompts.** High
value if confirmed.

Other officially stated specs worth pinning: 1080p/1440p/native 4K, portrait to
1080x1920, 24/25/48/50 FPS, **up to 20 seconds per generation**, joint 24 kHz
stereo audio in the same pass, camera-control LoRAs enumerated as
**Dolly-in, Dolly-out, Dolly-left, Dolly-right, Jib-up, Jib-down, Static**.
That camera-LoRA list is a *closed vocabulary* — useful, because it tells you
which camera moves LTX has a first-class control path for versus which must be
prompted in text.

Hardware, `[OFFICIAL]`: full dev model needs **80GB+ VRAM**; distilled and FP8
support 32GB; "run locally on a single GPU with as little as 12GB VRAM".

### 3.2 LTX model-file reality check (third-party, but concrete)

`[LORE]` — https://ltxworkflow.com/changelog, entry dated **2026-08-26**
(accessed 2026-08-28). Site states "Not affiliated with Lightricks", so this is
not official; but the numbers are checkable and the entry is 2 days old.

> +Note: LTX 2.5's official files need 24GB+ VRAM combined (Gemma 4 encoder alone
> is 15.37GB+) — 16GB cards need the GGUF path

> +New: LTX 2.5 official transformer, Gemma 4 text encoder, VAEs, LoRA, upscalers,
> and **duration-head patch** — all from the **gated** `Lightricks/LTX-2.5` repo

Two things Prompt Studio should note:
1. **The `Lightricks/LTX-2.5` HF repo is gated.** Users must accept terms before
   download. This is a real onboarding friction point and it also explains why
   community quants (Abiray, elix3r GGUFs) matter.
2. There is a distinct **"duration-head patch"** file — corroborating that Auto
   Duration is implemented as a separate head, i.e. it is a real component and not
   marketing copy.
3. The **Gemma 4 encoder alone is 15.37 GB**. This conflicts with the official
   "runs on as little as 12GB VRAM" line unless the GGUF/offload path is assumed.
   **Sources conflict; both recorded.**

Earlier entries on the same changelog that fill in LTX-2.3 depth the corpus is
thin on `[LORE]`:
- 2026-06-03: *"Gemma 3 12B IT text encoder (FP8 13.2 GB + full ~24 GB) from
  Comfy-Org — required for all ComfyUI workflows"* → confirms the 2.3→2.5 encoder
  generation jump.
- 2026-04-01: *"Distilled variant: 8 steps, CFG=1, same quality as dev"* →
  **independently corroborates the corpus position that LTX distilled negatives
  are inert at CFG=1**, since the official distilled recipe *is* CFG=1.
- 2026-06-01: OmniNFT RL LoRA (Kijai) improving audio-video sync
  (JavisBench DeSync 0.569 → 0.269).

### 3.3 Krea 2 official-adjacent recipe, consolidated

`[LORE]` (vendor blog, no methodology shown) —
https://www.instasd.com/post/krea-2-prompt-and-style-guide-comfyui, accessed
2026-08-28. Stated as reporting official numbers:

- **Weights dropped 2026-06-22.** 12.9B DiT trained from scratch (not a FLUX
  fine-tune), **Qwen3VL-4B text encoder**, **770M Qwen VAE**.
- **License: "Krea 2 Community License", not Apache.** The author explicitly says
  sources disagree on the commercial boundary and to read the license text.
  Recorded as an open question, not a finding.
- **Raw:** ~52 steps at **CFG 3.5**. **Turbo:** **8 steps at CFG 0.0**.
  Official code passes **`--mu 1.15`**.
- **Both variants trained at 2048×2048.** Verbatim: *"generating at 1024 and
  upscaling is throwing away capability you already downloaded."*
- Canonical minimal graph, verbatim:
  > Diffusion model: `krea2_turbo_fp8_scaled.safetensors`. Text encoder:
  > `qwen3vl_4b_fp8_scaled.safetensors`. VAE: `qwen_image_vae.safetensors`.
  > 8 steps, CFG 0.0, 2048×2048, LoRA loader in between if you want a style.
- VRAM: BF16 Turbo **24.76 GiB**, FP8 **12.01 GiB**. Official formats stop at
  BF16 / FP8 / NVFP4; community INT8 and INT4 ConvRot exist.
- **Nine official style LoRAs shipped with the weights, with non-guessable trigger
  phrases.** This is a hard, teachable lookup table and exactly the kind of thing
  Prompt Studio exists for:

| LoRA | Trigger phrase |
| --- | --- |
| Darkbrush | `monochrome ink wash style` |
| Dotmatrix | `monochrome stippling style` |
| Kidsdrawing | `naive expressive sketch style` |
| Neondrip | `textured abstract style` |
| Rainywindow | `rainy window style` |
| Retroanime | `purple retro anime style` |
| Softwatercolor | `art deco watercolor style` |
| Sunsetblur | `ethereal motion blur style` |
| Vintagetarot | `vintage tarot style` |

  With the usage rule, verbatim:
  > Every "this LoRA does nothing" complaint I've read traces back to a prompt
  > fighting the LoRA with its own style words. You can't ask for photorealism
  > while Vintagetarot is trying to hand you a tarot card. Pick a lane.

  **Caveat:** these trigger strings are unverified against the official Krea repo.
  Verify before shipping — see §9.

- Its exemplar prompt, quoted verbatim as an example of the shape it recommends:
  > `a fishmonger in a yellow rubber apron arranging silver mackerel on crushed ice at a covered market stall, early morning, cold blue daylight mixing with warm tungsten bulbs overhead, wet reflective concrete floor, photorealistic, slight motion blur on his hands`

  with the diagnostic heuristic:
  > When a generation goes mushy on me, the prompt almost always turns out to be
  > either two competing actions or zero described light.

### 3.4 BFL prompting guide — the negative-prompt line

`[OFFICIAL]` https://docs.bfl.ml/guides/prompting_guide_flux2 (surfaced
2026-08-28; I did not fetch the page body, only the indexed quote — verify next
run):

> FLUX.2 does not support negative prompts. Focus on describing what you want, not
> what you don't want.

Full treatment in §5.5.

---

## 4. Tested findings (methodology quoted)

**Only one item this run clears the `[TESTED]` bar.** Everything else is `[LORE]`.
I am deliberately not padding this section.

### 4.1 `[TESTED]` — Krea 2 conditioning-length cliff (ComfyUI #14782)

Full detail in §5.1. Methodology quoted verbatim there; the qualifying line is:

> The sequence length was the only intentionally changed variable.

Single reporter, single prompt, controlled sweep across six conditioning lengths
with the same workflow/model/settings, with instrumentation output pasted. n is
small and it is one person, but the manipulation is clean and the dependent
variable is binary and unambiguous (image renders vs. black/noise). Accepted as
`[TESTED]`.

### 4.2 Rejected from `[TESTED]` — and why

| Claim | Source | Why downgraded |
| --- | --- | --- |
| Front-loaded subject 95% vs reversed 70% over 20 fixed-seed gens | Civitai 30826 | States seed + n but shows **no grid, no images, no raw data**; percentages implausibly tidy across the whole article; prose reads LLM-generated. → `[LORE]` |
| Quoting text raises spelling accuracy 65%→85% | Civitai 30826 | same | 
| Negative prompt raises satisfaction 75%→90% | Civitai 30826 | same; "satisfaction" is not an operationalised measure |
| SDXL-style prompts transfer to Hi-Dream / Qwen-Image | Civitai 18294 | **n=1 prompt**, no seeds, no grid, no control. → `[LORE]`, and low-value |
| lightx2v LoRA destroys Wan 2.2 high-noise prompt response | civarchive comment, `sumsenchi101` | No seeds, no grid, no n. Dated and specific, and it *agrees* with the corpus, but it is still a forum post. → `[LORE]` |
| `(word:1.2)` breaks down on Krea 2 | InstaSD | Vendor blog; asserts a mechanism, shows no comparison grid. → `[LORE]` |
| BF16→FP8 "nearly invisible", INT4 costs fine texture | InstaSD, citing "that 150-image benchmark thread" | InstaSD is **reporting someone else's test it does not link**. Not verifiable. → `[LORE]`, and the underlying thread is an open target (§9) |

---

## 6. arXiv / papers

### 6.1 The most important paper of this sweep — and it cuts against the prevailing prompt doctrine

**`Text-to-Image Models Need Less from Text Encoders Than You Think`**
Nurit Spingarn, Noa Cohen, Tamar Rott Shaham (MIT CSAIL), Tomer Michaeli
(Technion). **arXiv:2606.03715v1 [cs.CV], 02 Jun 2026.** CC BY 4.0.
https://arxiv.org/html/2606.03715 (accessed 2026-08-28)
Project page: https://nsping13.github.io/contextless-TTI/

`[OFFICIAL]` (peer-preprint with stated method; GenEval + DrawBench + VLM-as-judge
evaluation, DiT vs UNet ablation in appendix). Abstract verbatim, key passage:

> We show that text-to-image diffusion transformer-based models commonly rely only
> on two relatively straightforward aspects of text representations: (i) the
> merging of adjacent tokens into a word representation, for words spanning
> multiple tokens, and (ii) word order, which is imprinted by the positional
> embedding of the text-encoder. To show this, we construct a new text embedding
> that encodes only individual word meanings and order but lacks any contextual
> information about the full prompt. We find that this *bag of position-tagged
> words* representation is sufficient to successfully guide image generation,
> achieving visual quality and text fidelity that are on par with full text
> embedding-guided generation. This demonstrates that, contrary to common belief,
> text-to-image models often do not use the rich information encoded in the text
> embedding beyond individual word meanings and word order. Instead, the decoding
> of complex linguistic structures is performed by the image model itself.

And from Figure 1's caption, verbatim:

> This surprising behavior is exhibited even for complex prompts that involve
> attribute binding, spatial relations, and numeracy.

**FLUX.2 with a Qwen encoder is named explicitly in the introduction** as an
instance of the trend the paper is questioning:

> architectures like FLUX.2 incorporate large language models such as Qwen as
> encoders. This progression reflects a widely held assumption: richer and more
> expressive text representations lead to improved image generation.

**Why this matters enormously for Prompt Studio — it splits the vendor doctrine
in half.** Every vendor guide I read this run says some version of *"the encoder
is an LLM now, so write grammatical prose; it parses syntax"* (InstaSD on Krea 2:
*"It parses grammar. Spatial relationships survive. Possessives survive."*; deAPI
on klein: *"rewards prose over keywords"*). This paper says the contextual part of
that representation is largely **not used**, and that what actually carries is
(a) word identity and (b) **word order**.

The two halves of the doctrine therefore land differently:
- **"Front-load your subject / order carries emphasis"** — *supported and
  strengthened* by the paper. Word order is one of only two channels the paper
  finds the image model actually exploits. Four independent vendor sources
  converge on this (§5.6). **This is now the single best-evidenced prompt rule in
  the whole corpus.** Promote it.
- **"Write flowing prose, grammar is what makes it work"** — *undercut*. If a bag
  of position-tagged words performs on par with full embeddings on attribute
  binding and spatial relations, then prose-vs-keywords may be much less load
  bearing than the guides claim, and the real variable is *which words, in which
  order*.
- It also gives a mechanism for the corpus's **prompt-expansion doctrine split**:
  rewriting that *preserves salient words and their order* should be harmless;
  rewriting that reorders or dilutes them should hurt. That is a testable, and
  quite elegant, unifying hypothesis. `[SPECULATION]` — mine, clearly labelled.
- Caveat before over-applying: the paper's models are the ones it tested, and the
  evaluation is image, not video. Do not assume it transfers to Wan/LTX.

### 6.2 Adjacent papers worth queuing, not read this run

`[OFFICIAL]` (titles/abstracts only, surfaced 2026-08-28, **not fetched**):
- **`Long-Text-to-Image Generation via Compositional Prompt Decomposition`** —
  https://arxiv.org/html/2604.18258v1. Reported finding: long-prompt failures are
  caused by text encoders failing to capture syntactic dependencies, with
  diffusion models suffering "attribute leakage". Directly relevant to §5.1's
  Krea 2 length cliff and to any prompt-splitting feature.
- **`DetailMaster: Can Your Text-to-Image Model Handle Long Prompts?`** —
  https://arxiv.org/html/2505.16915v3. Benchmark of prompts averaging **284.89
  tokens**. A ready-made evaluation set for a long-prompt feature.
- **`AgentComp: From Agentic Reasoning to Compositional Mastery in Text-to-Image
  Models`** — https://arxiv.org/pdf/2512.09081.
- **`LTX-2` technical report** — https://arxiv.org/abs/2601.03233 (cited by
  ltx.io/llm-info as the family's paper). Not yet mined. Likely the best single
  source of official LTX prompt-conditioning detail.
- **Wan-Animate-2 paper** — arXiv **2608.06009** (surfaced via search, unverified).
- **Wan-Dancer** — https://arxiv.org/abs/2607.09581 ·
  **WanSong** — https://arxiv.org/abs/2607.14749 ·
  **Wan-Streamer v0.3** — https://arxiv.org/abs/2607.15038

**Nothing found** dated in the 2026-08-27 → 2026-08-28 window. The one-day delta
since the last digest contains no new arXiv material in scope, which is expected.

---

## 7. Things that CONTRADICT corpus positions

Listed most to least consequential. Where sources conflict I keep both.

### 7.1 CONTRADICTS "write prose because the encoder is an LLM"

arXiv:2606.03715 (§6.1) vs. the entire vendor-guide consensus. **Both retained.**
The reconciliation I propose: *word choice and word order are load-bearing;
grammatical prose per se may not be.* This is the most important open question
this sweep surfaced.

### 7.2 CONTRADICTS "Qwen-Image wants natural-language description"

Civitai article 30826 (2026-05-31) argues Qwen-Image-2512 was **trained on
structured label data** and prefers `Subject: / Pose: / Clothing: / Camera: /
Environment: / Lighting: / Mood:` blocks over prose, claiming "not subtle"
improvements. `[LORE]`, evidence weak (§5.3). But it is a *directional* conflict
with the natural-language framing, and it is interestingly consistent with
§6.1 — a label list is close to a bag of position-tagged words.
**Both retained. Flagged for in-house replication as the single highest-value
test to run.**

### 7.3 CONTRADICTS "no negative prompt on FLUX.2" — at the hosted layer only

**fal.ai** and **Segmind** both expose and, in fal's case, actively *recommend*
`negative_prompt` for FLUX.2 klein, against BFL's own documentation and against
`diffusers`. `[LORE]` vs `[OFFICIAL]`. See §5.5. My assessment: the hosts are
wrong or silently discarding, but I cannot prove which without testing, so both
are recorded. Prompt Studio should teach the BFL position and warn that hosts
expose a field that may do nothing.

### 7.4 TENSION on the LTX-2.5 prompt enhancer

Corpus position: the enhancer was **on by default until 2026-08-20** and thereby
**confounded every 08-11 → 08-20 verdict** (fix PR #1166).
Official position (`ltx.io/llm-info`, updated August 2026): the enhancer is a
headline **feature** — *"expands short prompts into detailed cinematic
instructions at near-zero added compute cost"* — with no mention of the default-on
problem anywhere on the page.
**Not a factual contradiction** (both can be true), but note the vendor page shows
no acknowledgement of the confound, so a user reading official docs will not learn
that their early test results were invalid. Worth surfacing in-app.

### 7.5 TENSION on LTX-2.5 minimum VRAM

Official: *"run locally on a single GPU with as little as 12GB VRAM."*
Third-party (ltxworkflow.com, 2026-08-26): *"LTX 2.5's official files need 24GB+
VRAM combined (Gemma 4 encoder alone is 15.37GB+) — 16GB cards need the GGUF
path."* **Both recorded.** Probable reconciliation: the 12GB figure assumes
quantised/offloaded paths and community GGUFs, not the official file set.

### 7.6 TENSION on Wan 2.2 single-expert T2V

`p0z` (2025-08-10, 7 reactions): low-noise-only T2V works, I2V does not.
`kakkkarot` (2025-09-05): it produces "slow mo mediocre movements" and you should
use Wan 2.1 instead. **Both recorded.** `[LORE]` on both sides.

### 7.7 REFINEMENT, not contradiction — "Krea 2 has no length limit"

If the corpus carries any implication that Krea 2 accepts arbitrarily long
prompts, §5.1 corrects it: hard reference cap of 512, silent black/corrupt output
somewhere above ~576–640 conditioning positions.

### 7.8 CORROBORATIONS (nothing to change, recording so future runs stop re-checking)

- Wan 2.5/2.6/2.7/3.0 closed → **confirmed again** via ComfyUI v0.34.1 `WAN3-Prime`
  *partner/billed* node and via the Wan-3.0 article's own FAQ ("Alibaba has not
  published a release date, model card, or technical report").
- Distillation + LoRA = partial de-distillation → **independently corroborated**
  by `sumsenchi101` on civarchive, with the added nuance that the damage
  concentrates in the **high-noise expert**.
- LTX distilled negatives inert at CFG=1 → corroborated: the official LTX-2.3
  distilled recipe *is* **8 steps, CFG=1**.
- FLUX.2 dev vs klein different encoders → corroborated (deAPI: klein = Qwen3).
- Krea 2 uses a Qwen3-VL encoder → corroborated from two independent sources
  (InstaSD; ComfyUI #14782's tokenizer trace).

---

## 8. Nothing-found register (explicit, per area)

The last deep digest was **2026-08-27, one day ago**. A largely empty delta is the
correct and expected result. Stated plainly per area:

| Area | Result |
| --- | --- |
| **Wan 2.2 (T2V/I2V/TI2V-5B)** | **Nothing new.** Repo still frozen. No model-card change found. civarchive comments on the base page are all from the Jul–Oct 2025 launch window. |
| **Wan-Animate-2** | **Nothing new since 2026-08-07.** Still the newest open Wan *video* release by date. |
| **Wan 2.5 / 2.6 / 2.7 / 3.0** | **Nothing new.** Still closed. Only change is a new billed partner node (`WAN3-Prime`, ComfyUI v0.34.1, 2026-08-26). No weights, no license, no date. |
| **LTX 2.3** | **Nothing new.** Picked up depth (March 2026, 22B, "4x larger text connector", Gemma 3 12B IT encoder) but no *change* in the window. |
| **LTX 2.5** | **Nothing new since 2026-08-20 (PR #1166).** The `ltx.io/llm-info` page is stamped "August 2026" with no finer date; I could not establish whether it changed inside the delta window. Repo releases/issues not fetched — see §9. |
| **MiniMax H3** | **One new item:** `embedding:` prompt syntax + TAESD H3, ComfyUI v0.34.0, 2026-08-26 (§2.1). Nothing else — no LoRAs, no encoder change, no VRAM relief on the 62GB+62GB figures. |
| **SCAIL-2 (zai-org)** | **Nothing found at all.** Zero hits in any search this run. The `wan-scail2` default-branch quirk could not be re-verified because `api.github.com` is unusable and I never got a `zai-org` URL into the fetch provenance set. Complete miss — carried to §9. |
| **SDXL fine-tunes** (Juggernaut, RealVis, Pony, Illustrious, NoobAI, Animagine) | **Nothing new.** No new release, no license change, no new portable quality-tag or sampler evidence. The corpus position ("no portable recipe across the five families") stands unchallenged. |
| **FLUX.1** | **Nothing new.** |
| **FLUX.2 (dev / klein)** | **No model change.** New *documentation-layer* finding only: the hosted negative-prompt contradiction (§5.5) and confirmation that `diffusers` still has no string→negative path (issue #13416, open, unanswered since 2026-04-04). |
| **FLUX 3** | New but **out of local scope** — early access only, Dev weights "later in 2026", no date/license/size (§2.2). |
| **Z-Image (Turbo / Base)** | **Nothing new**, and a gap identified: no source found testing `()` weighting or negatives on Z-Image specifically. Only datum is that `ZImagePipeline` shares klein's `negative_prompt_embeds`-only limitation (#13416). |
| **Qwen-Image 2512 / Edit-2511** | **Nothing new in the window.** One older article (2026-05-31) surfaced with a structured-prompt claim that conflicts with prevailing doctrine (§7.2). No change to `positive_magic` status. |
| **Krea 2** | **Two substantive items**, both pre-dating the window but previously unresolved: the #14782 length cliff (opened 2026-07-06) and the weighting-syntax situation. No *new* release. |
| **Reddit** | **Zero coverage this run — total access failure.** See below. |
| **arXiv, 08-27 → 08-28** | **Nothing.** |
| **New open-weight models / license changes generally** | Only **Wan-Dancer-14B** (Apache 2.0, 2026-07-13) which I believe is a corpus gap rather than news, and the LTX Model License clarification. |

### Access failures, stated plainly

1. **Reddit is completely unreachable in this toolchain.** Not 403 — *structurally*
   unreachable. `WebSearch` returns no Reddit results at all for in-scope queries
   (it returned Wikipedia and Substack instead), and the **provenance rule on
   `web_fetch` means I cannot construct an Arctic Shift API query URL** — any URL
   I build myself is refused before the request is made. Arctic Shift can only be
   used if a search result happens to surface the exact query URL, which will
   never happen. **The task brief's Reddit method does not work here.** Either the
   next run needs Claude-in-Chrome for Reddit, or Reddit should be dropped from
   this agent's remit. This is the single biggest coverage hole in the sweep.
2. **`?cb=` cache-buster is unusable** — breaks provenance matching (§1).
3. **`docs.comfy.org/changelog` exceeded the fetch size limit** (~100k chars).
   ComfyUI changelog claims in §2.1 come from the search-index extract and are
   marked for verification. Appending `.md` was not attempted because it would
   break provenance.
4. **`arxiv.org/html/2606.03715` also exceeded the limit**; I recovered the
   abstract and introduction by reading the spilled file directly. Prefer
   `arxiv.org/abs/` URLs next time.
5. **Civitai article 18294 remains login-walled** and has **no civarchive mirror**
   (§5.2). Only the search-index summary was recoverable.
6. **`api.github.com`** — not attempted, per brief. GitHub HTML issue pages worked
   fine and should be the default.
7. Not reached for lack of budget, not because they were blocked: HF discussion
   tabs for `Wan-AI` / `Lightricks` / `MiniMaxAI` / `zai-org` / `Tongyi-MAI` /
   `black-forest-labs` / `krea`; `Lightricks/LTX-2` releases and issues;
   `ComfyUI_examples`; the ComfyUI workflow-templates repo; the ComfyUI blog.

---

## 9. Open targets for next run

**Ranked. Top five are the ones I would actually spend the budget on.**

1. **HF STAFF discussion tabs — completely unmined this run.** This is where
   `[STAFF]` evidence lives and I produced **zero** `[STAFF]`-labelled claims.
   Start with:
   - https://huggingface.co/Lightricks/LTX-2.5 (note: **gated repo** — discussions
     may still be readable)
   - https://huggingface.co/Lightricks/LTX-2.5-Diffusers/discussions/14 —
     *"Add Prompt Enhancer and Processor Modular Reference"*. **Highest-priority
     single URL in this list**: it is the prompt enhancer, in the official repo,
     in a discussion thread, and it is exactly the corpus's confound item.
   - https://huggingface.co/Wan-AI/Wan2.2-Animate-2-14B
   - https://huggingface.co/Wan-AI/Wan-Dancer-14B
   - `black-forest-labs`, `krea`, `MiniMaxAI`, `Tongyi-MAI`, `zai-org` org pages.
2. **SCAIL-2 / `zai-org` — a total miss this run.** Nothing surfaced in any
   search. Re-verify the `wan-scail2` default-branch claim via
   `raw.githubusercontent.com` and the HTML repo page. Needs a search that gets a
   `zai-org` URL into provenance first.
3. **Verify the Krea 2 LoRA trigger phrases (§3.3) against the official Krea
   repo.** Nine exact strings that Prompt Studio would ship as lookup data,
   currently sourced from a single vendor blog. If they are wrong, they are wrong
   in a way users will hit immediately. Highest ratio of user-visible impact to
   verification cost in the whole report.
4. **Test the §6.1 / §7.2 hypothesis in-house.** Same seed, same model
   (Qwen-Image-2512 and Krea 2), three prompt encodings of identical content:
   (a) prose, (b) `Subject:/Lighting:/Camera:` label block, (c) same words,
   scrambled order. If order dominates and prose-vs-labels does not, that resolves
   the biggest doctrinal split in the corpus and it is cheap.
5. **ComfyUI `embedding:` syntax on MiniMax-H3** (v0.34.0, 2026-08-26). What
   produces the embedding files? Does it accept a weight? Does it survive the
   accelerators the corpus says silently disable negative-prompt nodes? H3 is
   currently taught as prompt-inert; this may change that.

Secondary:

6. `ComfyUI-Krea2-NAG` — https://comfyui-wiki.com/en/news/2026-08-10-comfyui-krea2-nag
   (surfaced, not fetched). NAG for Krea 2 Turbo. Directly parallels the corpus's
   LTX NAG workaround; would let Prompt Studio teach one negative-prompt story
   across both distilled families.
7. `ComfyUI` issue **#14717** — the sibling of #14782, same symptom class,
   different (unidentified) trigger. Resolving it may widen or narrow the length
   rule.
8. **Verify the ComfyUI v0.34.0/v0.34.1 items** (§2.1) directly against
   https://github.com/comfy-org/ComfyUI/releases — my source was a search extract
   of the oversized changelog page.
9. **LTX-2 technical report, arXiv:2601.03233** — likely the richest unmined
   *official* source on LTX prompt conditioning. Fetch `abs/` not `html/`.
10. **Test LTX-2.5 Auto Duration** (§3.1): does the described action's implied
    span change clip length at fixed settings? If yes it is a genuinely novel,
    LTX-only prompt behaviour.
11. **Test LTX-2.5 Native Multishot prompt form** (§3.1): does an explicit shot
    list work, and does it break the Wan-derived "one camera verb first" rule?
12. **civarchive comment mining, correctly targeted.** Base-model pages are frozen
    at their 2025 launch comments. Target *recently published derivative pages*
    instead. Entry points confirmed live this run:
    - https://civarchive.com/models/2247803?modelVersionId=2532694 (Qwen-Image-Edit 2511)
    - https://civarchive.com/models/2458426?modelVersionId=2945208 (Anima)
    - https://civarchive.com/models/2003153?modelVersionId=2381931 (Wan2.2-Remix T2V&I2V)
    - https://civarchive.com/models/1911157?modelVersionId=2277630 (WAN 2.2 5b i2v Workflow)
    - https://civarchive.com/tags/qwen-image · https://civarchive.com/articles
13. **Hunt the "150-image / 5 quant format" Krea 2 benchmark thread** referenced
    but not linked by InstaSD. If it exists with grids, it is a real `[TESTED]`
    source on quantisation-vs-prompt-adherence.
14. **`()` weighting on Z-Image and Qwen-Image-2512** — the one hole in the §5.6
    audit table. No source found either way.
15. **Reddit access decision.** Either wire Claude-in-Chrome for
    `reddit.com/r/StableDiffusion` and `r/comfyui`, or formally drop Reddit from
    this agent's remit. Do not leave the brief specifying a method that cannot run.
16. Arxiv queue from §6.2: 2604.18258, 2505.16915v3, 2512.09081, 2608.06009.

---

*End of report. Written 2026-08-28 by Agent B (Western sweep). No app code was
modified.*

