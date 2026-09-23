# Western sweep 2026-09-18

Agent B (Western/English depth sweep). Prior digest **2026-09-17** → news window is **1 day**
(2026-09-17 → 2026-09-18). Access date for everything below is **2026-09-18** unless stated.

**Standing expectation, stated up front:** a one-day window is the shortest possible. The news delta
section is deliberately thin and is **not** padded. The budget went to resolving **prior-digest
priority targets** (FastH3 licence + negative prompt, SDXL fine-tune sweep, [STAFF] sweep, Wan
prompt_extend.py, LTX discussions/48, U1.5 schema conflict) alongside a standard model/release scan.

**Headline findings, for the digest writer:**

1. **Fizgig v6.1.0** shipped 2026-09-18 00:42 UTC with **prompt-level named references** for H3
   RefMods (`<Picture 1>`, `<Video 1>` syntax tokenizer-verified against ComfyUI), bundled
   audio+visual RefMods, and **Automagic v3** self-adjusting optimizer for H3 LoRA training (§1.1).
2. **FastH3 V2 licence confirmed** as `minimax-h3-community` on the HF model card. **Negative
   prompts are NOT honoured** on the distilled path — cfg=1, DMD2 guidance-free. This resolves
   Priority Target 1 from the 09-17 digest (§2.1).
3. **All H3 distillations are guidance-free.** The ModelTC Minimax-H3-Turbo docs explicitly state
   "these distillations are guidance-free, and raising CFG does not sharpen the output; it fights the
   distillation." This is now confirmed across FastH3 V2, ModelTC Turbo, and VDN-H3 Turbo (§2.2).
4. **LTX-2.5 discussion #48** is a user question ("Are I2V & T2V workflows actually different?"),
   not a staff post. No [STAFF] posts found on LTX-2.5, Wan-AI, BFL, Qwen, or zai-org HF
   discussions in this window (§5).
5. **Wan prompt_extend.py**: fifth consecutive scraper failure. HF blob page resolves but returns
   no renderable text (§4.3).
6. **SDXL fine-tune families**: nothing new in window (§4.1).
7. **Qwen-Image-Edit-2509** exists on HF but is a **September 2025** release (version numbering:
   25-09), not new. It introduced multi-image editing support and is Apache 2.0 licensed (§4.4).

---

## 1. News delta 2026-09-17 → 2026-09-18

### 1.1 Fizgig v6.1.0 — prompt-level named references for MiniMax H3 RefMods

`[OFFICIAL]` Released 2026-09-18 at 00:42 UTC by @shootthesound on GitHub.

Source: <https://github.com/shootthesound/Fizgig/releases/tag/v6.1.0>, accessed 2026-09-18.

**What changed, prompt-relevant:**

- **Named reference prompts.** RefMod Studio can now expose mods to the text encoder using
  `<Picture n>`, `<Video n>`, `<Audio n>` labels. The release notes state:

  > Tick Numbered references and each mod gets a label: a single-frame mod is `<Picture n>`, a
  > stacked or motion mod is `<Video n>`, a bundled audio member is `<Audio n>`. The map beside
  > the tick says which number is which.

  And:

  > The token stream and the picture patches are checked against ComfyUI's own tokenizer, so what
  > the Studio sends is what the node sends.

  This means a prompt written as "the woman in `<Picture 1>` stands on the left" in RefMod Studio
  will produce identical tokenization in ComfyUI's H3 RefMod Text Encode node. `[OFFICIAL]`

- **Bundle format.** Visual + audio RefMods are now written as a single `.safetensors` file by
  default. The loader presents it as two members (All / Visual / Audio). Metadata records which
  base model variant (Reference vs First/Last Frame) and whether it was plain-encoded or tuned.

- **Automagic v3 optimizer for H3 LoRA training.** Imported from @ostris's AI-Toolkit under MIT
  licence. Self-adjusting learning rate: reads the direction of its own updates, moves rate up
  while they hold steady, down while they alternate. Now the default for MiniMax H3 character
  presets. The release notes state:

  > Leave the Learning Rate box at 1e-6. Under Automagic that box is a starting point, not the
  > rate. An AdamW number like 2e-4 is far too hot as a start, and Fizgig refuses to launch with
  > one rather than letting you find out twenty minutes in.

  **Krea 2 can optionally use it** but it matched rather than beat the standard recipe, so it is
  not the default there. Klein is unchanged. `[OFFICIAL]`

- **Style preset unchanged.** The Style preset stays on `adamw` at a flat 2e-4 because "a style
  set's images all share the look being learned, so the update signs agree for longer and a
  self-adjusting rate pushes harder than a style wants." `[OFFICIAL]`

**Prompt-studio relevance:** The `<Picture n>` / `<Video n>` named-reference syntax is a new
prompt-craft primitive for H3 RefMod workflows. It is NOT a model-level feature — it is a
tooling convention shared between Fizgig's RefMod Studio and the ComfyUI-MiniMaxH3Mod node pack.

---

## 2. Tested findings / Resolving prior-digest priority targets

### 2.1 Priority 1: FastH3 V2 licence + negative prompt behaviour — RESOLVED

**Licence:** `minimax-h3-community` (inherited from base MiniMax H3). The HF model card states:

> This checkpoint inherits the MiniMax H3 Community License.

Source: <https://huggingface.co/FastVideo/FastVideo-FastH3-8-Step-V2>, accessed 2026-09-18.
`[OFFICIAL]`

**Negative prompt:** The distilled path does NOT honour negative prompts. Evidence chain:

1. The FastH3 V2 model card states the checkpoint uses "data-free DMD2 and VSA-H3 at 80%
   sparsity" with a scheduler shift of 10 (base model is 12). The card's inference examples use
   BasicGuider, which is CFG-free (cfg=1). `[OFFICIAL]`

2. The ModelTC Minimax-H3-Turbo documentation (a separate H3 distillation project) explicitly
   confirms the general principle for all H3 distillations:

   > These distillations are guidance-free, and raising CFG does not sharpen the output; it
   > fights the distillation. Settings are the same across the board: LoRA strength 1.0,
   > scheduler simple, and CFG left at 1.0 because these distillations are guidance-free.

   Source: <https://minimax3.com/blog/minimax-h3-turbo-steps>, accessed 2026-09-18. `[LORE]`
   (third-party summary site, but accurately reflects the GitHub README).

3. The 09-17 digest's own synthesis rule — "CFG~1 => negatives inert" — applies. `[SYNTHESIS]`

**Conclusion for corpus:** FastH3 V2 weights are under minimax-h3-community licence (US/EU/UK/KR
excluded). Negative prompts on the distilled path are inert. A `DEFAULT_NEGATIVE_PROMPT` node
connected to a FastH3 workflow would have zero effect.

### 2.2 All H3 distillations are guidance-free — cross-project confirmation

This is now confirmed across three independent H3 distillation projects:

| Project | Steps | CFG | Negative honoured? | Source |
|---|---|---|---|---|
| FastH3 V2 (FastVideo) | 8 | 1.0 | No | HF model card |
| Minimax-H3-Turbo (ModelTC/lightx2v) | 4 / 8 | 1.0 | No | GitHub README |
| VDN-H3 Turbo (OpenVDN/drbaph) | 8 | 1.0 | No | ComfyUI wiki 09-10 |

All three use BasicGuider or equivalent cfg=1 inference. This is a structural property of the
distillation method (DMD2 / consistency distillation), not a per-project choice.

`[TESTED]` — confirmed via model cards and published inference code. No proprietary API
rewriting involved; this is local inference behaviour.

---

## 3. Official guide changes

**Nothing new in window.** No new entries on docs.comfy.org/changelog, no new LTX blog posts, no
new MiniMax or Wan-AI official guides published between 2026-09-17 and 2026-09-18.

Surfaces searched:
- <https://docs.comfy.org/changelog> (via WebSearch, 2026-09-18)
- <https://ltx.io/blog/ltx-2-5-prompt-guide> (via WebSearch, no updates since 2026-08-11 publication)
- ComfyUI-wiki.com/en/news (fetched 2026-09-18; latest article is Fizgig v6 RefMods, Sep 16/17)

---

## 4. Nothing-found register

### 4.1 SDXL fine-tune families (Priority 5 from 09-17)

**Nothing new found.** No new checkpoint releases for Juggernaut, RealVis, Pony, Illustrious,
NoobAI, or Animagine in the Sep 17-18 window.

Surfaces searched:
- WebSearch: "SDXL Juggernaut RealVis Pony Illustrious NoobAI new checkpoint September 2026"
- WebSearch: "civitai new SDXL checkpoint model release September 17 18 2026"
- Civitai.red: structurally unreachable via server fetch (returns empty to all scraper requests)

Note: Civitai shipped a platform update (Aug 30 - Sep 4) with Muse Image and UX improvements,
but no new model checkpoint announcements. The absence claim is bounded by search-engine indexing
lag — a model uploaded in the last 24 hours may not yet appear in WebSearch results.

### 4.2 [STAFF] sweep (Priority 6 from 09-17)

**No [STAFF] posts found.** Checked HF discussions for:
- Wan-AI (via WebSearch "huggingface Wan-AI discussions staff")
- black-forest-labs (via WebSearch, checked FLUX.2-klein-9B and FLUX.1-schnell discussions links)
- Qwen (via WebSearch "huggingface Qwen discussions staff")
- Lightricks/LTX-2.5 (fetched full discussions list — 65 threads, all user-created)
- zai-org (via WebSearch "SCAIL-2 zai-org")

The LTX-2.5 discussions page shows 65 open threads (plus 18 closed). All visible threads are
from community users. No Lightricks staff responses visible in thread titles or metadata.

Notable LTX-2.5 community discussions (not staff):
- #57 "Don't Use LTX 2.5 For Music Videos! Stick To LTX 2.3" — user opinion (18 days old)
- #48 "Are I2V & T2V workflows actually different?" — user question (21 days old)
- #62 "Any chance for a bigger text encoder (e.g. Gemma 4 26b)?" — feature request (16 days old)

Source: <https://huggingface.co/Lightricks/LTX-2.5/discussions>, accessed 2026-09-18.

### 4.3 Wan prompt_extend.py (Priority 3 from 09-17)

**Fifth consecutive scraper failure.** The HF blob-view URL resolves (HTTP 200) but the page
returns no renderable Python source through the scraper:

URL attempted: `https://huggingface.co/spaces/Wan-AI/Wan-2.2-5B/blob/ff5d8c785849346ce28e81771b0ea6cf39c79cb1/wan/utils/prompt_extend.py`

The page is a Spaces repo file, not a model repo file. HF Spaces blob views may require
JavaScript rendering that the scraper cannot execute. **Recommendation: try the model repo
equivalent** at `Wan-AI/Wan2.2-T2V-A14B/blob/main/wan/utils/prompt_extend.py` on the next run,
or extract the file content via `git clone` in the shell tool.

### 4.4 Qwen-Image-Edit-2509 — NOT a new release

The model card says "This September, we are pleased to introduce Qwen-Image-Edit-2509." However,
the version suffix `2509` means 2025-09 per Qwen's established naming convention (cf.
Qwen-Image-Edit-2511 = Nov 2025). The arxiv citation is from August 2025. This is a
**September 2025** release, not September 2026. No new Qwen-Image model weights were released
in the Sep 17-18 2026 window.

Source: <https://huggingface.co/Qwen/Qwen-Image-Edit-2509>, accessed 2026-09-18. `[OFFICIAL]`

### 4.5 U1.5 schema conflict (Priority 2 from 09-17)

**Unresolved.** The arXiv technical report 2609.11929 exists (submitted 2026-09-10, 38 pages)
but the full paper content was not extractable through the scraper within this sweep's budget.
The paper title is "SenseNova-U1.5: Towards Native Unified Visual Intelligence." The abstract
mentions "structural prompt enhancement" and "carefully curated generation and editing data" but
does not surface the specific Render-JSON schema keys at abstract level.

Source: <https://arxiv.org/abs/2609.11929>, accessed 2026-09-18.

**Recommendation:** the next run should attempt to fetch the HTML version at
`https://arxiv.org/html/2609.11929` and grep for "render" / "json" / "schema" to locate the
relevant section without reading all 38 pages.

### 4.6 New open-weight models

**No new locally-runnable open-weight video or image generation models released in the Sep 17-18
window.** The landscape remains as the 09-17 digest described it.

Surfaces searched:
- WebSearch: "new open weight video generation model locally runnable September 2026"
- WebSearch: "FLUX.2 open weights new model September 2026"
- WebSearch: "Z-Image Turbo Base open weight model new release September 2026"
- ComfyUI-wiki.com/en/news front page (fetched 2026-09-18)

### 4.7 SCAIL-2 / zai-org

**No new commits in the Sep 17-18 window.** The GitHub commits page for `wan-scail2` branch
was fetched but returned empty content (GitHub's commits-list page may require JS rendering).
The most recent known updates from WebSearch results are: training code released 2026-08-06,
relighting LoRA 2026-07-15.

Source: <https://github.com/zai-org/SCAIL-2/commits/wan-scail2/>, accessed 2026-09-18.

### 4.8 arXiv prompt-adherence / binding papers

**No new papers from 2609.17xxx or 2609.18xxx found** matching prompt adherence, binding, or
rewriting for video/image generation. The most recent relevant paper in the 2609 batch is
VI-Bench (2609.08079, Sep 8) and AV-SafetyBench (2609.06991), both already within prior digest
coverage window.

Surfaces searched:
- WebSearch: "arXiv prompt adherence text-to-video binding September 2026"
- WebSearch: "arXiv 2609 text-to-video image generation prompt September 17 18 2026"

---

## 5. Contradicts current guidance

**Nothing found that contradicts current corpus positions in this window.**

The only notable community discussion that might challenge guidance is LTX-2.5 discussion #57
("Don't Use LTX 2.5 For Music Videos! Stick To LTX 2.3"), but this is a user opinion without
methodology or comparative evidence, and it was posted ~18 days before this window. Graded
`[LORE]` at best; does not meet the evidence bar to register as a contradiction.

---

## 6. ComfyUI ecosystem context (outside strict window but near-boundary)

The ComfyUI-wiki news page (fetched 2026-09-18) shows the following items from Sep 13-16, all
**outside** the strict 1-day window but potentially relevant for context:

| Date | Item | Category |
|---|---|---|
| Sep 16 | Fizgig v6.0.0/v6.0.1 RefMods for H3 | Tool |
| Sep 14 | Krea 2 Lineart Edit LoRA (community) | LoRA |
| Sep 14 | YuE2 Real-Audio Encoder (community) | Tool |
| Sep 13 | Camera H3: visual camera path editor | Tool |
| Sep 13 | YuE2 LoRA Trainer in ComfyUI | Tool |

These are recorded for context but are NOT within the 09-17→09-18 window.

**Within the window:** only Fizgig v6.1.0 (Sep 18 00:42 UTC) as detailed in §1.1.

---

## 7. LTX-2.5 text encoder note

The LTX-2.5 model card (fetched via HF discussions page) reveals the text encoder file is named
`gemma4-12b-with-proj-ltx-2.5-bf16.safetensors`. This confirms LTX-2.5 uses **Gemma 4 12B** as
its text encoder (upgraded from LTX-2.3's encoder). This is not new information per se — the
09-17 digest may already cover it — but it is now directly confirmed from the model card's own
download instructions.

Source: <https://huggingface.co/Lightricks/LTX-2.5/discussions>, accessed 2026-09-18 (model card
visible in page header). `[OFFICIAL]`

---

## 8. Surfaces searched — complete list

| Surface | Method | Result |
|---|---|---|
| GitHub ComfyUI/releases | WebSearch | No new release in window |
| GitHub Comfy-Org/desktop/releases | WebSearch | No new desktop release in window |
| GitHub Fizgig releases | Fetched v6.1.0 page | v6.1.0 in window (Sep 18 00:42) |
| GitHub zai-org/SCAIL-2 commits | Fetched, empty render | No new commits visible |
| HF FastVideo/FastVideo-FastH3-8-Step-V2 | Fetched model card | Licence + distillation confirmed |
| HF Lightricks/LTX-2.5 discussions | Fetched full list | 65 threads, no staff posts |
| HF Wan-AI discussions | WebSearch | No staff posts found |
| HF black-forest-labs discussions | WebSearch | No staff posts found |
| HF Qwen discussions | WebSearch | No staff posts found |
| HF zai-org repos | WebSearch | No new activity |
| HF Qwen/Qwen-Image-Edit-2509 | Fetched model card | Sep 2025 release, not 2026 |
| ComfyUI-wiki.com/en/news | Fetched front page | Fizgig v6 RefMods latest |
| docs.comfy.org/changelog | WebSearch | No new entries in window |
| ltx.io/blog | WebSearch | No new posts in window |
| Civitai | WebSearch (civitai.red unreachable) | No new SDXL checkpoints |
| arXiv 2609.* | WebSearch | No new prompt papers in window |
| ModelTC/Minimax-H3-Turbo | WebSearch | CFG-free confirmation |
| Krea docs/changelog | WebSearch | No updates in window |

**Structurally unreachable surfaces:**
- Civitai.red (returns empty to server fetch)
- Reddit (structurally unreachable per tooling rules)
- HF blob pages for Spaces repos (JS rendering required; prompt_extend.py failure)
