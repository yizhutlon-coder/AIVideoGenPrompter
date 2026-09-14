# `[STAFF]` / `[CREATOR]` claims harvest — 2026-09-03

Agent 2A, Wave 2 of [`docs/RESEARCH-PLAN-2026-09.md`](../../docs/RESEARCH-PLAN-2026-09.md).
**Sole purpose:** raise the corpus's `[STAFF]` evidence from near-zero. In scope: maintainer- or
author-authored statements about **prompting, prompt length, negatives, language, encoder behaviour,
and settings that change prompting**. Out of scope: vendor docs and model-card prose (that is
`[OFFICIAL]`, and Wave 1 already mined it).

All access dates **2026-09-03** unless stated.

## Method

Role evidence was required for every row. Accepted forms, in the order they appear below:

- **HF org badge** rendered next to the reply (`LTX.io org`, `Tongyi-MAI org`, `KREA org`) — the
  strongest signal available on Hugging Face, plus the account's `Organizations` block on its profile.
- **Civitai/CivArchive `Author` label** rendered under the commenter's name on the model's own page.
- **Commit-author match** — e.g. `art-alex` is listed as having *updated* `Lightricks/LTX-2.5-22b-IC-LoRA-*`
  repos two days before access, alongside the `LTX.io` org badge.

The single highest-yield technique this run was **HF profile community-activity pages**
(`https://huggingface.co/<user>/activity/community`). They enumerate every discussion a staff account
has touched, with permalink anchors, in one fetch — far cheaper and more complete than paging
discussion indexes per repo. `art-alex/activity/community` alone produced eight candidate threads.

### Surfaces reached

| Surface | Result |
|---|---|
| HF discussion **index** pages | Work. Reliable dates. |
| HF discussion **detail** pages | Work, but caches are inconsistent — the same page can report "16 days ago" and "Jun 24" for one thread across fetches. Dates below are reconciled against the index and the repo creation date, and flagged where they disagree. |
| HF **profile activity** pages (`/activity/community`) | Work, and show org membership. **New technique — recommend it as standing practice.** |
| `huggingface.co/api/models?author=…` | Works (used for org lineage). |
| GitHub **issue/discussion HTML** pages (`/issues/N`) | Work, but ~9k tokens of boilerplate each. |
| GitHub **plain** `/issues` list (open, page 1) | Works. |
| GitHub `?q=…` **search** URLs (`/issues?q=is%3Aissue+prompt`, `/issues?q=prompt`) | **Return HTTP 200 with an empty body.** Confirms the brief's warning is only half right: list pages work, *filtered* list pages do not. So closed issues and keyword search were unreachable this run — a real coverage limit. |
| `api.github.com` | Empty bodies, as briefed. Not used. |
| **civarchive.com** | Works, and renders the `Author` badge. Pages are 55–85k chars, so they overflow the fetch cap into a file that then has to be grepped — budget ~2 operations per page. |
| **civitai.com** (`/api/v1/models/<id>` and HTML) | **Empty body.** Add to the unreachable list alongside civitai.red. |
| `web.archive.org`, Reddit, Discord | Not attempted (briefed unreachable). One row below re-anchors a Reddit-only claim onto a fetchable HF surface. |

---

## Claims table

`Corpus effect` cites file + line in `research/`.

| # | Model | Claim (one sentence) | Who + role evidence | Verbatim quote (≤60 words) | URL | Date | Corpus effect |
|---|---|---|---|---|---|---|---|
| 1 | **Z-Image / Z-Image-Turbo** | The text encoder is not swappable: Z-Image works only with Qwen3-4B, by training. | **Cxxs** (Dongyang Liu), badged **`Tongyi-MAI org`**; profile `Organizations` lists Tongyi-MAI | "Our model is trained with qwen3-4b, so yes, our diffusion model works exclusively with qwen3-4b." | <https://huggingface.co/Tongyi-MAI/Z-Image-Turbo/discussions/24#69294b7cba94cc937d0e27b5> | 2025-11-28 | **NEW.** No corpus line asserts encoder-lock. `z-image.md:239` only uses the Qwen3-4B tokenizer for token counting; `:370`/`:412` name the encoder architecturally. Adds a hard "do not substitute the encoder" rule, and stands in explicit contrast to row 8 (LTX, where staff engage with swap proposals). |
| 2 | **Z-Image-Turbo** | Turbo's shipped defaults are **8 steps at time-shift 3**, and staff say you may push 16–30 steps *if* you also raise time-shift to ~6–12, with no guarantee of improvement. | **Cxxs**, badged **`Tongyi-MAI org`** | "you can try inferencing with, say, 16 or even 30 steps. When using such large steps, I recommend also trying with different time shift values (currently it is set to 3, you can try something like 6 or 12)… in some cases it might be better than the default 8 step timeshift=3 setting" | <https://huggingface.co/Tongyi-MAI/Z-Image-Turbo/discussions/34#6929c2824664a1235bbc027f> | 2025-11-28 | **UPGRADES** `z-image.md:507`, which records "Turbo: 8 steps, guidance 0.0, 1024²" from `inference.py` as `[OFFICIAL]` code but carries **no time-shift value and no staff guidance on raising steps**. This is the first `[STAFF]` statement that time-shift is a coupled knob — a settings-that-change-prompting item the Meta Inspector should surface. |
| 3 | **Z-Image-Turbo** | Turbo is step-distilled and is not the model to push steps on; the Base model is. | **DyJiang**, badged **`Tongyi-MAI org`** | "Z-Image Turbo is a step-distilled model aiming to bring the community a model that pairs extremely low inference latency with nearly uncompromised quality. If you enjoy pushing step to see the gain, stay turn for the Base model to release." | <https://huggingface.co/Tongyi-MAI/Z-Image-Turbo/discussions/34#692999689e6ed7c1cb5e148e> | 2025-11-28 | **CONFIRMS at `[STAFF]`** the Turbo-vs-Base split that `z-image.md:394` and the `[STAFF]` items at `:234`/`:257` treat as a route distinction. Second Tongyi-MAI voice on the same thread, so the Turbo/Base advice is not one engineer's opinion. |
| 4 | **LTX-2.5** | Its IC-LoRAs need **no trigger phrase and no special prompt shape** — reuse the source video's own prompt or a detailed caption of it. | **art-alex** (Alex Artyomov), badged **`LTX.io org`**; profile shows him *updating* `Lightricks/LTX-2.5-22b-IC-LoRA-*` repos | "You don't need any specific prompt structure to use this IC-LoRA. You can use the original prompt that you used to generate the source video or to use a detailed caption of the source video" | <https://huggingface.co/Lightricks/LTX-2.5-22b-IC-LoRA-Pixel-Spatial-Upscaler/discussions/3#6a8c3aaa3a77b9d453fc5a6a> | ~2026-08-24 | **RESOLVES an ambiguity** in `ltx23.md:332–334` and `:453`, which require "prepend the trigger phrase … for adapters that have one" but list triggers only for `DEBLUR / REMOVEBEARD / COLORIZE / ADD WATER / ENHANCE QUALITY`. Now sourced at `[STAFF]`: the **Pixel Spatial Upscaler has none**, and the correct prompt is the *source* prompt. Also relevant to validator V13 at `ltx23.md:509` — V13 must not demand a trigger for this adapter. |
| 5 | **LTX-2.5** | A failing prompt was fixed by staff **without** the prompt enhancer, by rewriting it as one plain event per line with explicit screen-side directions and by deleting the keyword preamble and the quality tail. | **art-alex**, badged **`LTX.io org`** | "The prompt that you provided is indeed tricky and doesn't produce good results as it is. But with very minor changes (even without prompt enhancement) on a default ComfyUI I2V template the model produced a decent and accurate result." | <https://huggingface.co/Lightricks/LTX-2.5/discussions/62#6a8dc0d55606db3b2f622e07> | ~2026-08-25 | **NEW, and the best few-shot gold in this file** — a staff-authored before/after pair. See the *before/after* block below. Directly supports `ltx23.md:36` (one main action per 2–3 s) and contradicts the community position in the same thread that "a modern model MUST be able to process overcomplicated prompts". |
| 6 | **LTX-2.5** | Staff's own reference prompt for the official distilled pipeline is a single dense paragraph that puts spoken lines in single quotes inline, names non-speech sounds, and states the camera as static once. | **art-alex**, badged **`LTX.io org`** | "…he speaks with a deep male voice and a satisfied tone, saying, 'I think it's so good.' The camera remains static throughout, maintaining a shallow depth of field… After a brief pause, another short, audible sniff is heard." | <https://huggingface.co/Lightricks/LTX-2.5/discussions/62#6a8d66189fa36373d1e158ec> | ~2026-08-25 | **NEW gold pair candidate** for the LTX dialect (audio-video). Confirms the corpus position that LTX takes speech inline rather than in a separate field. Full text quoted below. |
| 7 | **Juggernaut XL (SDXL)** | Prompts over **75 tokens are ignored** on Juggernaut because it is an SDXL/CLIP model, and going over can make the image *worse* than trimming. | **KandooAI**, rendered **`Author`** under the comment on the Juggernaut XL model page | "Additionally, your prompt should be no longer than 75 tokens. This is an SDXL model with a CLIP text encoder. Anything beyond 75 tokens is ignored by the model or can even result in worse image quality than if you had trimmed it down." | <https://civarchive.com/models/133005> (comment thread, reply to `creativeaientertainment`) | 2025-05-11 | **UPGRADES** `sdxl.md:9`, `:40` and `:288`, which carry "under about 75 tokens" / "Try not to exceed 75 tokens" from the RunDiffusion *guide*. This is the author saying it in his own words **with a stated mechanism** — and the mechanism is wrong for ComfyUI. See *Contradictions surfaced* #1. |
| 8 | **Juggernaut XIII Ragnarok (SDXL)** | Start with **no** negative prompt; add only the specific things you can see going wrong. | **KandooAI**, **`Author`**; identical instruction also in the model card's own Recommended Settings block | Card: "**Negative: Start with no negative, and add afterwards the Stuff you don´t wanna see in that image.**" · Comment: "We also recommend starting **without** a negative prompt, and only adding specific negative tags if truly necessary." | <https://civarchive.com/models/133005> | card 2025-05-07; comment 2025-05-11 | **CONFIRMS at `[CREATOR]`** `image-catch-up.md:192` ("Heavy negatives often hurt more than they help on this model"), which was directional only, and `sdxl.md:631` ("Juggernaut publishes no standing negative at all"). The "We also recommend" phrasing makes this RunDiffusion's team position, not a personal preference. |
| 9 | **Juggernaut XIII Ragnarok (SDXL)** | NSFW output on Ragnarok is steerable **from the negative prompt**, because a low-ratio Lustify merge was used deliberately. | **KandooAI**, **`Author`** | "In **Juggernaut Ragnarok**, the NSFW parts can easily be controlled using appropriate **negative tags**, in case it gets too much. That said, the model generally separates **SFW and NSFW** content quite well." | <https://civarchive.com/models/133005> | 2025-05-07 | **CONFIRMS and sources** `sdxl.md:142`, whose Ragnarok row records "add NSFW tokens to the negative" and the BOORU-token training note. Row 142's advice previously rested on the RunDiffusion guide; now it has the author's own reason (a low-ratio Lustify merge). |
| 10 | **RealVisXL V5.0 Lightning (SDXL)** | The Lightning variant's operating point is DPM++ SDE Karras, **5 steps, CFG 1.0–2.0**, with `4x-NMKD-Superscale-SP_178000_G`. | **SG_161222**, rendered **`Author`** on the RealVisXL model page | "Sampler - DPM++ SDE Karras with 5 Sampling Steps; CFG Scale - 1.0 - 2.0; Upscaler - 4x-NMKD-Superscale-SP\_178000\_G." | <https://civarchive.com/models/139562> | 2024-09-05 | **FILLS a stated gap.** `sdxl.md:143` records RealVisXL V5.0 CFG as "not stated" and `:666` says outright "**RealVisXL V5.0 resolution list / CLIP-skip / CFG** — the card states none". The HF card is silent; the **Civitai card and the author's own comments are not**. The card additionally states "Use Turbo models with DPM++ SDE Karras sampler, 4-10 steps and CFG Scale 1-2.5" and "Use Lightning models with DPM++ SDE Karras / DPM++ SDE sampler, 4-6 steps and CFG Scale 1-2". |
| 11 | **NoobAI-XL (SDXL)** | Pony `score_*` tags appear to work on NoobAI **not** through shared weights but because NoobAI's whole training set was aesthetic-scored. | **L_A_X**, rendered **`Author`** on the NoobAI-XL model page | "Even though we didn't actually use any Pony weights to train the Noob model, **I suspect those score tags might be interacting with the aesthetic scoring.** We do apply aesthetic scoring to our entire training dataset, so that might be the connection" | <https://civarchive.com/models/833294> | 2026-01-27 | **NEW, and it changes a validator.** `sdxl.md`'s per-family rules treat `score_9…` as Pony-only. This says score tags on NoobAI are **not inert** — a user reported (same thread, 2026-01-04) locked-seed A/B differences: "Softer light, background light wasn't as good as before… Lost some of edge as well." So a NoobAI validator should *warn* on score tags, not *strip* them, and must not claim they do nothing. Note the author's own hedge — "I suspect" — so grade the mechanism `[CREATOR-SPECULATION]`, the "no Pony weights" half `[CREATOR]`. |
| 12 | **Krea 2 Turbo** | A first-party set of **36 prompt + image pairs** exists in an earlier README revision, and staff pointed users to the exact commit after trimming them from the current card. | **NagaSaiAbhinay** (Naga Sai Abhinay Devarinti), badged **`KREA org`**; profile `Organizations` lists KREA | "I removed some prompts to keep it clean but an older version has all of them. you can grab them here: <https://huggingface.co/krea/Krea-2-Turbo/raw/665ef38131535e3a1da1a86c6ff2261e70ba9a55/README.md> 36 prompts & images" | <https://huggingface.co/krea/Krea-2-Turbo/discussions/3#6a3b871e4bde98afd3b6561c> | ~2026-06-23 (index/profile read "about 2 months ago"; sibling thread #4 is dated Jun 24) | **NEW, and high value for few-shot gold.** `krea-character-art.md` has no reference to a 36-pair first-party prompt corpus; its prompt evidence is the current card plus community reports (`:1067`). This is a pinned-commit `raw` URL, so it is stable and fetchable. **Recommend Wave 3 or the maintainer harvest all 36 pairs** — they are the only large official Krea 2 prompt set. |
| 13 | **Krea 2** | There is still no Krea 2 edit/inpaint model; editing is "something we are exploring". | **NagaSaiAbhinay**, badged **`KREA org`** | "Editing is something we are exploring as well. See our research lead's reply in the AMA here: <https://www.reddit.com/r/StableDiffusion/comments/1udnm0a/comment/otdj4v9/>" | <https://huggingface.co/krea/Krea-2-Turbo/discussions/8#6a4389f4a59609daf3407af1> | ~2026-06-30 (index reads "about 1 month ago"; sibling #7 is dated Jun 29) | **RE-ANCHORS** `krea-character-art.md:155` and `:791` and `image-model-comparison.md:125`, all of which rest on the **Reddit AMA — a surface that is unreachable from this environment**. Same claim, same team, on a fetchable URL. The corpus can now cite HF instead of Reddit for "no edit model". |
| 14 | **Krea 2** | Krea's own expectation is that LoRAs are trained on **Raw**, not on Turbo + the Turbo training adapter. | **NagaSaiAbhinay**, badged **`KREA org`** | "Thank you for sharing! curious as to why you chose to train on Turbo + Turbo LoRA instead of directly training on Raw ?" | <https://huggingface.co/krea/Krea-2-Turbo/discussions/10#6a45043fa1c2d4b40bf6b62a> | 2026-07-01 | **NEW.** A question, not an instruction — so grade it `[STAFF-IMPLIED]`, not `[STAFF]`. Worth recording because `lora-workflows-2026-08-28.md` and `krea-character-art.md` do not state which Krea 2 checkpoint is the training target, and the community thread (same page) reports Raw-trained LoRAs working on Turbo anyway. |

### Row 5 in full — the staff before/after prompt pair (LTX-2.5, I2V)

The user's failing prompt, verbatim:

```text
sound-driven video, audio-reactive motion, continuous visual flow

A cinematic top-down overhead shot of the black Lada car from the image. Suddenly, dark brown fizzy cola starts pouring out of all the windows and doors like a waterfall. An anthropomorphic fluffy brown bear wearing a t-shirt quickly opens the door and climbs inside. The car then violently accelerates, performing a sharp, aggressive drift on the gravel road, leaving smoke and tire tracks, and finally crashes head-on into the green bushes on the side of the road. High dynamic range, realistic physics, splashes of liquid, flying debris from the bushes.
```

`art-alex`'s rewrite, verbatim, which he says worked on the **default ComfyUI I2V template with no prompt enhancement**:

```text
The car is peacefully parked at the side of the road when suddenly, dark brown fizzy cola starts pouring out of all the car's windows and doors.

An anthropomorphic fluffy brown bear wearing a t-shirt quickly approaches the car from the left, opens the front door and climbs inside the driver seat.
The car violently accelerates, performing a sharp, aggressive drift on the gravel road, leaving smoke and tire tracks.
After a short drive the car looses control and crashes head-on into the green bushes on the left side of the road.
```

`[SYNTHESIS]` The five edits, which are the teachable content: (a) the keyword preamble
`sound-driven video, audio-reactive motion, continuous visual flow` is **deleted**; (b) the quality tail
`High dynamic range, realistic physics, splashes of liquid, flying debris` is **deleted**; (c) the
camera specification `cinematic top-down overhead shot` is **deleted** — nothing replaces it; (d) each
beat gets **its own line**, and a *starting state* line is added in front ("is peacefully parked …
when suddenly"); (e) vague motion is given **screen-side and part specificity** — "opens the door"
becomes "approaches the car **from the left**, opens the **front** door and climbs inside the **driver
seat**", and "the side of the road" becomes "the **left** side of the road". Note the staff rewrite
preserves the author's typo (`looses`), which is evidence it was pasted from a real run.

### Row 6 in full — the staff reference prompt (LTX-2.5, distilled pipeline)

```text
A medium close-up shot features a Caucasian man with a beard, wearing a green and white baseball cap without any letters on the front, and a light blue shirt over a white t-shirt. He is positioned in the center of the frame, looking intently directly at the camera, his eyes focused on camera. His facial expression is one of deep concentration, with his brow slightly raised. As he looks straight at the camera, a quick sniff sound is heard, and then he speaks with a deep male voice and a satisfied tone, saying, 'I think it's so good.' The camera remains static throughout, maintaining a shallow depth of field, which keeps the man in sharp focus while the background is softly blurred, showing a beige wall behind him. After a brief pause, another short, audible sniff is heard. The man then continues to speak, his voice maintaining the same quality, as he states, 'So good. So good.' He elaborates further, emphasizing his point with a final statement, 'This got to be, it's got to be the best tool I've ever seen.'"
```

`[SYNTHESIS]` Shape: shot scale → subject appearance (with a **negation stated positively** —
"without any letters on the front") → framing and gaze → expression → **non-speech sound named before
speech** → speech in single quotes with voice quality and tone attached → camera and depth of field
stated once, mid-prompt → further beats appended in time order. This is a single flowing paragraph,
which sits *against* row 5's line-per-beat rewrite — the two are not contradictory (row 5 is I2V with
physical action; row 6 is a static talking-head), but a tutor should not present either as the one
LTX house style. See *Contradictions surfaced* #4.

---

## Contradictions surfaced

**1. `[CREATOR]` mechanism vs. how ComfyUI actually behaves — the 75-token claim (row 7).**

- KandooAI, Juggernaut author: *"Anything beyond 75 tokens is ignored by the model or can even result in worse image quality than if you had trimmed it down."*
- ComfyUI does **not** discard tokens past 75 on SDXL. `CLIPTextEncode` chunks the prompt into 75-token windows, encodes each, and concatenates the embeddings, so token 100 is encoded and does reach the model. `sdxl.md:40` already states the softer, correct version — "CLIP tokenization makes concise front-loaded prompts safer".
- **Resolution to teach:** keep the *advice* (stay near 75 tokens; front-load) and drop the *reason*. The honest statement is "past 75 tokens SDXL encodes your prompt in separate chunks that cannot attend to each other, so cross-chunk relationships are lost and quality often drops — the model author recommends staying under 75". Do not let the app repeat "ignored by the model": that is a `[CREATOR]` claim that a `[TESTED]` reading of ComfyUI's encoder contradicts. Flag for agent 3A.

**2. RealVisXL V5.0 "CFG not stated" is wrong (row 10).**

- `sdxl.md:143` (recipe table) and `sdxl.md:666` (nothing-found register): CFG, resolution list and CLIP-skip are "not stated"; ":666" says "the card states none".
- The **Civitai card** states, in bold at the top: *"Use Turbo models with DPM++ SDE Karras sampler, 4-10 steps and CFG Scale 1-2.5"* and *"Use Lightning models with DPM++ SDE Karras / DPM++ SDE sampler, 4-6 steps and CFG Scale 1-2"*, plus Hires.Fix settings for V5 Lightning (3 steps, denoise 0.5, CFG 1.0–2.0). The author repeats CFG 1.0–2.0 in a comment.
- **Resolution:** the absence claim was scoped to the HF card only, so it was not false — but it is now misleading, because the recipe *does* exist on another first-party surface. Rewrite `:666` to say "the **HF** card states none; the Civitai/CivArchive card states Turbo and Lightning CFG bands" and fill the table row for the distilled variants. Note the split cleanly: **base V5.0** CFG is still unstated anywhere; only Turbo/Lightning have numbers.

**3. Pony score tags are not inert on NoobAI (row 11).**

- Corpus position (implicit across `sdxl.md`'s per-family validator rules): `score_9, score_8_up, …` is Pony vocabulary; other families do not use it.
- NoobAI's author: no Pony weights were used, *but* "I suspect those score tags might be interacting with the aesthetic scoring. We do apply aesthetic scoring to our entire training dataset".
- **Resolution:** a validator may say "score tags are Pony syntax and are not required here", but must **not** say they have no effect, and must not silently strip them. The author's own words are a hedge, so the mechanism is `[CREATOR-SPECULATION]`; the lineage denial is `[CREATOR]`.

**4. The two LTX staff prompts disagree about paragraph shape (rows 5 and 6).**

- Row 6 (staff reference prompt for the official CLI) is **one long paragraph**.
- Row 5 (staff rewrite of a user's failing I2V prompt) is **four short lines, one beat each**, and its whole point is that the user's single paragraph was the problem.
- Both are the same person, nine days apart. **Resolution:** the variable is content, not style — action-dense multi-event I2V wants beats on separate lines; a single-subject talking-head wants continuous prose. `ltx23.md:36` ("one main action per 2–3 seconds") is the reconciling rule and should be taught as the primary one, with paragraph-vs-lines presented as a consequence of how many actions there are. Do **not** fold either prompt into the corpus as "the LTX house style" on its own.

**5. `[STAFF]`-looking answers that are not `[STAFF]` — the H3 reference-mode guide.**

The most detailed, most authoritative-sounding answer about H3's `ref2va` prompt format anywhere on
Hugging Face is **not attributable**. See *Nothing-found register*, MiniMax row, and the
`[LORE]`-graded item below. It contradicts nothing in the corpus, but any agent that treats it as
official would be wrong, and the corpus currently has an H3 reference-tag gap that it would appear to
fill.

---

## Recorded but **not** `[STAFF]` — role could not be shown

Both items are substantive and both would be tempting to mis-grade. Recorded here so nobody upgrades
them by accident.

**A. `[LORE]` — the H3 Full-Reference prompt-format answer.** `Asakura` (display name "Kotone") posted a
four-part, headed, formatted answer to `MiniMaxAI/MiniMax-H3/discussions/71` covering whether Subjects
may reference each other, what `partially_preserved` means, how strictly the template must be copied,
and why `subject_definitions` / `retention_analysis` / `detailed_description` repeat the same visual
details. It reads exactly like a vendor answer and drew ❤️4 / 👍1.

**Why it cannot be `[STAFF]`:** no org badge is rendered on the reply, and
<https://huggingface.co/Asakura> shows **`Organizations: None yet`**, `models 0`, `datasets 0`, and a
contribution counter of **1** — that reply is the account's only community activity. The three
possibilities (an unbadged MiniMax employee, a knowledgeable user, or an LLM-drafted answer) cannot be
separated from outside. Two of its four answers are checkable against
`docs/VIDEO_PROMPT_WRITING_GUIDE_ref_en.md` and one — *"`partially_preserved` means that some defined
reference characteristics are changed, omitted, or only partly used. It does not mean that only part of
the Subject is visible in a particular shot"* — is a genuinely useful disambiguation that agent 1E's
H3 register should chase in the official guide text. **Grade `[LORE — single unverifiable account]`
until someone finds the same distinction in a MiniMax-authored file.** URL:
<https://huggingface.co/MiniMaxAI/MiniMax-H3/discussions/71#6a7aef8d3856caf83e70de35>, ~2026-08-19.

**B. `[LORE]` — negative prompting at CFG 1 on Wan 2.2 via negpip.** `amamisu` ported the
`sd-webui-negpip` approach into `WanVideoTextEncode` and the sampler and documented a weight syntax that
suppresses concepts **inside the positive prompt** while CFG stays at 1.0: *"Suppress: a woman with
black hair. (blonde hair:-1.0)"* · *"Boost: a cat sitting on a (red couch:1.5)"*, with the caveat
*"Some models won't budge at +7.0, while +3.0 is already overdoing it for others."*
<https://github.com/kijai/ComfyUI-WanVideoWrapper/issues/1834>, 2025-12-26.

**Why it is not `[STAFF]`:** the author is a community contributor with an experimental fork
(`amatiramisu/ComfyUI-WanVideoWrapper-negpip`), and **Kijai has not replied on the thread** as of
access. Secondary summaries claiming "it was added to the sampler and WanVideoTextEncode node(s)" are
paraphrasing the *proposer's own* description of his fork, not a merge. This matters because it is the
only credible route to live negatives on a CFG-1 distilled Wan pipeline, and the corpus's Wan and
`comfyui-metadata` files have nothing on it. **Next-run target:** check whether negpip landed in
`kijai/ComfyUI-WanVideoWrapper` `nodes.py` on `main` (reachable via `raw.githubusercontent.com`) — if
it did, the commit author gives the role evidence this row lacks.

---

## Nothing-found register

Scoped absence claims. "Searched" names the exact surfaces reached.

| Repo / org | What was searched | Result |
|---|---|---|
| **`Wan-Video/Wan2.2` (GitHub)** | `/issues` open list, page 1 (12 items) | **No maintainer replies visible, and no prompting thread on page 1.** The repo shows "**Issue creation is restricted in this repository**" and 247 open issues whose page-1 titles are mostly noise (`wannn`, `see`, `try`, `1`). Closed issues and keyword search were **unreachable** — `?q=` URLs return empty bodies. **No `[STAFF]` Wan claim obtained.** |
| **`Wan-AI/Wan2.2-T2V-A14B` (HF)** | discussions index, 16 threads incl. closed count | **Zero Wan-AI-badged replies.** Every thread is user-authored; #7 ("Vibe coded a simple but effective prompt doc for Wan 2.2 with over 100 examples") has no vendor response. |
| **`Wan-AI/Wan2.2-Animate-2-14B` (HF)** | discussions index, all 5 threads (0 closed) | **Zero Wan-AI replies.** Repo is 4 days old at access; threads #2 "few questions…" and #3 "Wan Animate 2 Lite?" are unanswered. So `wan22.md`'s *Contradicts* #7 (no Lite weights) is still unconfirmed by staff. |
| **`Wan-AI` org, staff accounts** | `huggingface.co/api/models?author=Wan-AI` for lineage | No individual Wan-AI staff account surfaced as a discussion participant, so the profile-activity technique could not be applied to Wan. **Wan remains the largest `[STAFF]` hole in the corpus.** |
| **`QwenLM/Qwen-Image` (GitHub)** | `/issues?q=is%3Aissue+prompt` (empty body — search unavailable) | **Not reachable.** Only leads came via WebSearch: issues #24, #128, #161. Not fetched — no evidence any carries a maintainer prompting statement. Open. |
| **`Qwen/Qwen-Image` (HF)** | discussions index, 86 threads (page 1 of 2) + thread #81 in full | **Zero Qwen-badged replies.** #81, "Where can I find an official prompt guide for Qwen Image?" (2025-11-11), got **no vendor answer at all** — the asker answered himself by finding `help.aliyun.com/zh/model-studio/text-to-image-prompt`. That silence is itself worth recording: Qwen ships no prompt guide on HF and does not point to one. |
| **`Qwen/Qwen-Image-2512` (HF)** | discussions index, 27 threads | **Zero Qwen-badged replies.** #13 ("Cannot follow anti-aesthetics prompt to generate 'low quality' images", 2 replies) and #22 ("ignores all `{}` and `|` in prompts", 0 replies) are both prompting bugs left unanswered by the vendor. |
| **`MiniMaxAI/MiniMax-H3` (HF)** | discussions index, 96 threads (page 1 of 2); threads #64, #65, #71, #95 in full; `MiniMax-AI/activity/community` (all 67 contributions) | **Zero MiniMax prompting statements.** The org account `MiniMax-AI`'s only H3 thread is the pinned recruiting post #61 (【招聘】); its other 66 contributions are README/diffusers PRs on M2/M2.5/M3/Music3. #95 ("Please provide more in-depth documentation for Full-Reference Mode", 👍3) is **unanswered**; #65 (prompt adherence degrading from 352p/416p to 768p, 6 replies) is **entirely community**; #64 (10 replies on audio-reference tags) is **entirely community**. `minimax-h3.md:925` ("`[STAFF]` **0**") **still holds after this sweep.** |
| **`MiniMax-AI` (GitHub)** | not fetched | Skipped: the HF org account's own activity showed no prompting engagement, and `?q=` search is unavailable, so a blind issue-list walk was not worth the budget. Open. |
| **`zai-org/SCAIL-2` (GitHub)** | `/issues` (complete — **1 open issue total**) | **Nothing.** The single issue is `SAM3D-Body 如何使用呢` (#1, 2026-06-09), unanswered, unrelated to prompting. `scail2.md:661` names the SCAIL authors as a next-run `[STAFF]` target; **that target is now closed as empty** — there is no channel on this repo where they answer. Kijai's two Comfy-Org quotes (`scail2.md:314`, `:317`) remain the only SCAIL-2 `[STAFF]` evidence. |
| **`black-forest-labs/flux2` (GitHub)** | `/issues` open list, page 1 (12 items) | **No BFL replies visible.** Prompt/encoder-relevant open issues exist and are unanswered: #59 (padded Qwen3 hidden states in joint attention with no padding mask), #58 (对中文渲染不友好), #43 (klein 4B editing). |
| **`black-forest-labs/FLUX.2-klein-9B` (HF)** | discussions index, 40 threads | **Zero BFL-badged replies across all 40.** Includes #17 "Flux 2 Klein 9B ignores all `{}` and `|` in prompts" (5 replies, no vendor), #32 "Flux 2 hex color code not consistent?" (0), #24 licence clarification (1). **`flux.md:541` ("No `[STAFF]` (named BFL employee) claim obtained") is confirmed a second time.** BFL answers on neither GitHub nor HF. |
| **`Lightricks/LTX-Video` (GitHub)** | `/issues` open list; issue #235 in full | #235 ("LTXvideo is great, but not good at prompt…", 2025-07-28) is **closed with zero comments** — no staff answer. Open list carries #278 "Unwanted subtitles for east Asian languages" (a language issue) which was **not fetched**; recommend it as a next-run target. |
| **`Lightricks/LTX-2.5` (HF), other art-alex threads** | profile activity gave anchors; #48 and #63 fetched | **Cache miss, not absence.** `#48` ("Are I2V & T2V workflows actually different?") shows art-alex's reply in his activity feed but the thread page served a stale copy with the reply missing. `#63` (a long Portuguese negation-heavy I2V prompt submitted as a PR) shows only `art-alex changed pull request status to closed` — **no explanatory comment**, so there is no staff statement about non-English prompts on LTX. Threads still unread: `#53` (latent spatial upscaler input limit), `#44` (custom audio lipsync), `#39`, `#50`, `LTX-2-19b-IC-LoRA-Detailer#2`. |
| **`Lightricks/ComfyUI-LTXVideo` (GitHub)** | not fetched | Skipped after `?q=` search proved unavailable. WebSearch surfaced #489 (missing text encoder in 2.3 workflow) and #548 (LTX 2.5 negative-prompt CLIP encode error) as candidates. Open. |
| **`Comfy-Org/workflow_templates` (GitHub) #919** | issue in full | **No Comfy-Org reply.** The issue documents that every `*ltx2_3*` template ships a **prefilled negative prompt wired into a `CFGGuider` set to `cfg = 1`**, making it inert, and is **still open and unlabelled** since 2026-06-03. Author `debugXin` is not a Comfy-Org member, so this is `[USER-VERIFIED]`, not `[STAFF]` — but it is the cleanest statement of the false-affordance problem anywhere and `comfyui-metadata.md` / the `GOTCHAS` cards should cite it. |
| **`Comfy-Org/Wan_2.2_ComfyUI_Repackaged` (HF)** | discussions index, 23 threads | **No prompting statement.** All threads are file/VRAM/licence. |
| **`Tongyi-MAI/Z-Image` (HF, Base repo)** | discussions index, 29 threads | **Zero Tongyi-MAI-badged replies on the Base repo.** #29 ("Z-Image diffusers implementation does not support prompt weighting") is unanswered. All four Tongyi-MAI staff quotes in this file come from the **Turbo** repo. |
| **`civitai.com`** | `/api/v1/models/133005`, HTML | **Empty body — unreachable.** Add to the standing unreachable list next to `civitai.red`. All Civitai-origin evidence in this file came via `civarchive.com`. |
| **Pony Diffusion V6 XL author comments** | `civarchive.com/models/257749`, grepped for `^Author$` | **No `Author`-badged comment on that page.** Either the id is not Pony v6 or AstraliteHeart does not comment there. **No `[CREATOR]` Pony claim obtained** — `sdxl.md`'s `score_9…` requirement still rests on the model card, not on an author statement. |
| **Illustrious (OnomaAI) and Animagine 4 (Cagliostro) author comments** | not fetched | Out of budget after the Juggernaut / RealVis / NoobAI pages (each costs a fetch plus a grep). Open; `civarchive.com` is the right surface and the `^Author$` grep is the right method. |
| **GitHub keyword search / closed issues, all repos** | `?q=` URL forms | **Structurally unreachable this run.** This is the single biggest limitation on the harvest: maintainers most often answer in issues that then get **closed**, and closed issues are exactly what could not be listed. Any future `[STAFF]` sweep should first re-test `?q=` and, if still empty, budget for `raw.githubusercontent.com` reads of maintainer-authored files instead. |

---

## Sources

Staff/creator rows, in table order:

- <https://huggingface.co/Tongyi-MAI/Z-Image-Turbo/discussions/24> — `[STAFF]` Cxxs (`Tongyi-MAI org`), encoder exclusivity, 2025-11-28.
- <https://huggingface.co/Tongyi-MAI/Z-Image-Turbo/discussions/34> — `[STAFF]` Cxxs (steps + time-shift) and DyJiang (`Tongyi-MAI org`, step-distillation), 2025-11-28.
- <https://huggingface.co/Cxxs/activity/community> — role evidence for Cxxs (Alpha-VLLM, **Tongyi-MAI**), accessed 2026-09-03.
- <https://huggingface.co/Lightricks/LTX-2.5-22b-IC-LoRA-Pixel-Spatial-Upscaler/discussions/3> — `[STAFF]` art-alex (`LTX.io org`), IC-LoRA prompting, ~2026-08-24.
- <https://huggingface.co/Lightricks/LTX-2.5/discussions/62> — `[STAFF]` art-alex, before/after prompt pair and the official reference prompt, ~2026-08-25.
- <https://huggingface.co/art-alex/activity/community> — role evidence for art-alex (`LTX.io`, `ltx-community`; updating `Lightricks/LTX-2.5-22b-IC-LoRA-*`), plus the anchor list for eight further staff replies. Accessed 2026-09-03.
- <https://civarchive.com/models/133005> — `[CREATOR]` KandooAI (**Author**), Juggernaut XL / XIII Ragnarok: 75-token claim (2025-05-11), no-negative-first (card 2025-05-07 + comment 2025-05-11), NSFW-via-negative (2025-05-07). Accessed 2026-09-03.
- <https://civarchive.com/models/139562> — `[CREATOR]` SG_161222 (**Author**), RealVisXL V5.0 Lightning settings (2024-09-05) and the card's Turbo/Lightning CFG bands. Accessed 2026-09-03.
- <https://civarchive.com/models/833294> — `[CREATOR]` L_A_X (**Author**), NoobAI-XL score-tag / aesthetic-scoring reply (2026-01-27) and the user A/B report that prompted it (2026-01-04). Accessed 2026-09-03.
- <https://huggingface.co/krea/Krea-2-Turbo/discussions/3> — `[STAFF]` NagaSaiAbhinay (`KREA org`), pointer to 36 official prompt+image pairs, ~2026-06-23.
- <https://huggingface.co/krea/Krea-2-Turbo/raw/665ef38131535e3a1da1a86c6ff2261e70ba9a55/README.md> — the pinned commit those 36 pairs live in. **Not yet harvested.**
- <https://huggingface.co/krea/Krea-2-Turbo/discussions/8> — `[STAFF]` NagaSaiAbhinay, no edit model yet, ~2026-06-30.
- <https://huggingface.co/krea/Krea-2-Turbo/discussions/10> — `[STAFF-IMPLIED]` NagaSaiAbhinay, train on Raw, 2026-07-01.
- <https://huggingface.co/NagaSaiAbhinay/activity/community> — role evidence (KREA org badge + `Organizations: KREA`), accessed 2026-09-03.

Not-`[STAFF]` items:

- <https://huggingface.co/MiniMaxAI/MiniMax-H3/discussions/71> and <https://huggingface.co/Asakura> — the unattributable H3 reference-mode answer, and the profile that disqualifies it.
- <https://github.com/kijai/ComfyUI-WanVideoWrapper/issues/1834> — negpip weighted negatives at CFG 1, `amamisu`, 2025-12-26, no maintainer reply.
- <https://github.com/Comfy-Org/workflow_templates/issues/919> — inert negatives in the LTX-2.3 template family, `debugXin`, 2026-06-03, open and unanswered.

Absence-claim surfaces (all accessed 2026-09-03): <https://github.com/Wan-Video/Wan2.2/issues> ·
<https://huggingface.co/Wan-AI/Wan2.2-T2V-A14B/discussions> ·
<https://huggingface.co/Wan-AI/Wan2.2-Animate-2-14B/discussions> ·
<https://huggingface.co/Qwen/Qwen-Image/discussions> (and <https://huggingface.co/Qwen/Qwen-Image/discussions/81>) ·
<https://huggingface.co/Qwen/Qwen-Image-2512/discussions> ·
<https://huggingface.co/MiniMaxAI/MiniMax-H3/discussions> (and /64, /65, /95) ·
<https://huggingface.co/MiniMax-AI/activity/community> ·
<https://github.com/zai-org/SCAIL-2/issues> ·
<https://github.com/black-forest-labs/flux2/issues> ·
<https://huggingface.co/black-forest-labs/FLUX.2-klein-9B/discussions> ·
<https://github.com/Lightricks/LTX-Video/issues> (and /235) ·
<https://huggingface.co/Lightricks/LTX-2.5/discussions/48> · <https://huggingface.co/Lightricks/LTX-2.5/discussions/63> ·
<https://huggingface.co/Comfy-Org/Wan_2.2_ComfyUI_Repackaged/discussions> ·
<https://huggingface.co/Tongyi-MAI/Z-Image/discussions> ·
<https://github.com/Tongyi-MAI/Z-Image/issues/7> · <https://civarchive.com/models/257749> ·
`https://civitai.com/api/v1/models/133005` (empty).
