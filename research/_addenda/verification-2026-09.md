# Adversarial verification — 2026-09-03 (agent 3A)

Wave 3 of [`docs/RESEARCH-PLAN-2026-09.md`](../../docs/RESEARCH-PLAN-2026-09.md), section 3A.
**Purpose: break today's work.** Every claim below was re-fetched at source on **2026-09-03** unless the
verdict says UNREACHABLE or NOT RE-FETCHED. Findings are not softened for consistency; where a Wave-1/2
agent is right, that is recorded too, because the synthesis agent needs to know which claims are safe to
fold in and which are not.

This file **adds nothing to the corpus** and edits nothing. It records verdicts.

---

## Method & coverage

**Sampling frame.** 61 numbered claims, stratified to the brief's minima and biased toward claims that
would change the app if true (validator rules, length caps, negative-prompt liveness, licence terms,
default states).

| Label as written by the source agent | Claims sampled |
|---|---|
| `[OFFICIAL]` (incl. `[OFFICIAL/PAPER]`, `[OFFICIAL/MAINTAINER]`) | 34 |
| `[STAFF]` / `[CREATOR]` / `[STAFF-IMPLIED]` | 9 |
| `[TESTED]` (incl. `[TESTED/PAPER]`, static-inspection claims, tooling claims) | 10 |
| `[LORE]` / `[SPECULATION]` / `[SYNTHESIS]` | 8 |
| **Total** | **61** |

**Spread across all 12 outputs** (claims per file): `scail2.md` 11 · `sdxl.md` 9 · `ltx23.md` 9 ·
`flux.md` 6 · `z-image.md` 6 · `wan22.md` 7 · `minimax-h3.md` 6 · `_addenda/krea-character-art.md` 5 ·
`_addenda/staff-claims-2026-09.md` 5 · `new-models.md` 3 · `_addenda/test-kit-2026-09.md` (+3 JSONs) 3 ·
`_addenda/comfyui-ops-2026-09.md` 1.

**"Contradicts corpus" items ruled on:** 8 (scail2 #2/#5/#6/#9, ltx23 #3/#10, wan22 #1, flux #1).

**Budget used:** 31 `web_fetch` calls · 0 WebSearch · 4 sandbox-Python runs (test-kit JSON diffing;
no network) · 1 large-file grep pass each on the LTX template, the arXiv HTML and the CivArchive page.

**Surfaces that worked for me today:** `raw.githubusercontent.com`; `docs.comfy.org`, `docs.ltx.io`,
`docs.bfl.ai` (all serve clean markdown); `huggingface.co/<repo>/raw/<ref>/README.md` including
**pinned-commit refs**; HF discussion detail pages; `help.aliyun.com`; `civarchive.com`;
`rundiffusion.com`; `arxiv.org/html/...`. **`arxiv.org/abs/<id>` returned a title but an empty PDF body**
— use `/html/<id>v1`.

**Surfaces that did NOT work / were not attempted:** civitai.com, civitai.red, Reddit, Discord,
web.archive.org — not attempted (standing rules). Sandbox bash has no network (confirmed).

### ⚠ The tooling claim four agents made is wrong

**`api.github.com` is NOT uniformly empty in this environment.**
`https://api.github.com/repos/zai-org/SCAIL-2/branches` returned a full JSON body to me on 2026-09-03,
with exactly the two branches and the two SHAs agent 1A reports. Yet **agents 1B, 1C (both files), 1D and
2A all state, as a scoped tooling finding, that `api.github.com` "returns an empty body for every request
in this environment."** That absolute is falsified; what is true is that the *issues*, *contents*,
*trees* and *search* endpoints came back empty for them while `/branches` works for me. Agent 1E's
narrower wording ("returned empty bodies for `/pulls/N`, `/pulls/N/files` and `/issues/N`") is the only
version of this claim that survives.

Consequence: several "could not enumerate / not evidence of absence" registers rest on an over-broad
tooling claim and should be re-tested per-endpoint next run, not written off wholesale.

---

## Claim-by-claim table

Verdicts: **CONFIRMED** · **OVERSTATED** (real but claimed beyond the evidence) · **UNSUPPORTED**
(no evidence found at the cited source) · **STALE** · **MISLABELLED** (wrong evidence grade) ·
**UNREACHABLE** · **NOT RE-FETCHED** (sampled but out of budget — recorded so nobody assumes it was
checked).

| # | File : heading | Claim | Label | Verdict | Reason | Source excerpt (verbatim where it differs) | URL |
|---|---|---|---|---|---|---|---|
| 1 | scail2 : New official guidance | Canonical repo is `zai-org/SCAIL-2`; `GET /branches` returns exactly `sat-scail2` + `wan-scail2`, no `main` | `[OFFICIAL]` | **CONFIRMED** | API fetched; two branches, SHAs match `ac63f8e…` / `78fe195…` | `[{"name":"sat-scail2",…"sha":"ac63f8eb369e…"},{"name":"wan-scail2",…"sha":"78fe19576bb0…"}]` | api.github.com/repos/zai-org/SCAIL-2/branches |
| 2 | scail2 : New official guidance | *"SCAIL-2 is trained with long, detailed prompts. Short prompts or an empty prompt can run, but detailed descriptions… usually produce better results."* | `[OFFICIAL]` | **CONFIRMED** | Verbatim, at the end of the LoRA section, and mode-agnostic as claimed | identical | raw…/wan-scail2/README.md |
| 3 | scail2 : New official guidance | *"H and W **must** both be divisible by 32 (e.g. 704×1280)"* | `[OFFICIAL]` | **OVERSTATED** (misquote) | Card says **should**, and adds a qualifier the quote drops. Validator change #5 ("require `%32==0`", graded OFFICIAL) rests on a hardened paraphrase | *"H and W should be both divisible by 32 (e.g. 704\*1280) **if using other resolutions**."* | raw…/wan-scail2/README.md |
| 4 | scail2 : New official guidance | *"End-to-end driving supports both 512p and 704p; **pose-driven and replacement** performs better at 704p"* | `[OFFICIAL]` | **UNSUPPORTED** (fabricated inside a verbatim quote) | The card never mentions replacement in that sentence. This is the only source for the app's "704p recommended for **Replacement**" | *"End-to-end driven supports both 512p and 704p. **Pose-driven** performs better under 704p."* | raw…/wan-scail2/README.md |
| 5 | scail2 : New official guidance | Both enhancer system prompts verbatim, incl. rule 8 "around 90-140 words" and rule 7's Gemini/editing-software ban | `[OFFICIAL]` | **CONFIRMED** | Byte-for-byte against the shipped file, both prompts | identical | raw…/wan-scail2/prompt_enhancer.py |
| 6 | scail2 : Validator changes #13 | "its `prompt_examples.txt` default is empty/absent so it runs with `"(No examples provided.)"`" / "`_read_examples` tolerates absence" | `[OFFICIAL]` | **UNSUPPORTED** | `--examples` defaults to the *string* `"prompt_examples.txt"`, so `path is not None` and `_check_file` **raises `FileNotFoundError`**. The fallback fires only when the file exists and is *empty*. If the file is absent the enhancer **crashes**, it does not degrade gracefully | `def _read_examples(path,…): if path is None: return ""` … `_check_file(path,…)` → `raise FileNotFoundError` | raw…/wan-scail2/prompt_enhancer.py |
| 7 | scail2 : New official guidance | `wan_shared_cfg.text_len = 512`, `sample_fps = 16`, full Chinese `sample_neg_prompt` | `[OFFICIAL]` | **CONFIRMED** | All three exact, character-for-character on the negative | identical | raw…/wan-scail2/wan/configs/shared_config.py |
| 8 | scail2 : Contradicts #6 | Licence conflict: `LICENSE` = Apache 2.0 "Copyright 2026 Zhipu AI" vs MIT on HF/ModelScope/Comfy-Org | `[OFFICIAL]` vs `[OFFICIAL]` | **CONFIRMED** | Apache text + `Copyright 2026 Zhipu AI` verified; the MIT tag is independently confirmed by 2D's Comfy-Org row | `Copyright 2026 Zhipu AI` / `Apache License Version 2.0` | raw…/wan-scail2/LICENSE |
| 9 | scail2 : New official guidance | `DEFAULT_PALETTE` (6 colours) + comment *"Model was trained on these exact colors; deviating degrades multi-identity quality."*; `previous_frame_count` tooltip; mask-polarity comment; `negative` a first-class input | `[OFFICIAL]` | **CONFIRMED** | All four verbatim in `nodes_scail.py` on master; `width`/`height` do use `step=32`; palette index is `i % len(...)` so a 7th wraps | identical | raw…/Comfy-Org/ComfyUI/master/comfy_extras/nodes_scail.py |
| 10 | scail2 : Contradicts #5 | ComfyUI tutorial says *"Must be divisible by 16"* while card/node say 32 | `[OFFICIAL]` vs `[OFFICIAL]` | **CONFIRMED** | Parameter table says exactly that; `ceil(total_frames / 76)`, `76 × (index − 1)`, 81/5 defaults and the manual-queue note are all verbatim too | *"`width` / `height` … Must be divisible by 16"* | docs.comfy.org/tutorials/video/zai/scail2 |
| 11 | scail2 : Tested findings | ComfyLab's "two reproducible bugs in the official template" (VAE filename, LoRA subfolder) | `[TESTED]` | **OVERSTATED** | The official tutorial's own download list *names* `Wan2_1_VAE_bf16.safetensors` (Kijai repackage) and puts the lightx2v LoRA flat in `models/loras/`. Following ComfyUI's docs there is no mismatch; the failure is following the zai-org download instead. Not a template defect | tutorial file tree: `vae/Wan2_1_VAE_bf16.safetensors`, `loras/lightx2v_I2V_14B_480p_…safetensors` | docs.comfy.org/tutorials/video/zai/scail2 |
| 12 | ltx23 : item 1 | The 2.5 prompting guide has **no word count** anywhere; length guidance is "roughly 4–8 descriptive sentences" | `[OFFICIAL]` | **CONFIRMED** | Verified across the whole page; Length section verbatim | *"Match length to complexity. A simple single shot is often 4–8 sentences; a longer screenplay-style scene can run longer, provided every sentence adds concrete visual or audio detail."* | docs.ltx.io/…/prompting-guide.md |
| 13 | ltx23 : item 3 | Whole Multi-Shot section verbatim, incl. "Prefer 2–4 shots", the four cut requirements, the single/multi table | `[OFFICIAL]` | **CONFIRMED** | Byte-for-byte | identical | docs.ltx.io/…/prompting-guide.md |
| 14 | ltx23 : item 17 | "Two of the three official 2.5 sample prompts are screenplay-style with sluglines" | `[OFFICIAL]` | **OVERSTATED** | The page carries **two** sample prompts, and only **one** uses a slugline + `Reporter:` cue. The conclusion survives on the guide's own "Longer / Screenplay-Style" section, not on this count | Example 1 = `EXT. TOWN STREET – MORNING…`; Example 2 = prose with quoted dialogue, no slugline | docs.ltx.io/…/prompting-guide.md |
| 15 | ltx23 : item 5 | Shipped `video_ltx2_5_t2v.json` has `prompt_enhance = true`, duration 5 s, 1280×720, seed 558811532553686, fps 24, and the exact 6-file model set | `[OFFICIAL/TESTED]` | **CONFIRMED** | Re-fetched and re-read the subgraph `widgets_values`; array matches 1D's transcription element-for-element | `[ "<Arctic hunter prompt>", true, 5, 1280, 720, 558811532553686, 24, … "gemma4_e2b_it_bf16.safetensors" ]` | raw…/workflow_templates/main/templates/video_ltx2_5_t2v.json |
| 16 | ltx23 : item 5 | Comfy Org's tutorial says the enhancer is off by default and is therefore wrong | `[OFFICIAL]` | **CONFIRMED** | Both halves verified. **This is the sweep's single most consequential correct finding** | *"**Use the prompt enhancer (optional)**: The workflow keeps it off by default."* | docs.comfy.org/tutorials/video/ltx/ltx-2-5 |
| 17 | ltx23 : Tested findings | Grep of the template "for `Duration\|model_patch\|LTX2\|LTXV` returns only that primitive plus the note text" | `[TESTED]` | **OVERSTATED** (method mis-stated) | My grep for `LTXV` returns eight distinct node types (`LTXVConcatAVLatent`, `LTXVLatentUpsampler`, `LTXVAudioVAEDecode`, `LTXVDualCFGGuider` ×2, `LTXVSeparateAVLatent` ×2, `LTXVConditioning`, `EmptyLTXVLatentVideo`, `LTXVEmptyLatentAudio`). The **substantive** conclusion — no duration-head loader, no `model_patches` reference — is CONFIRMED | — | same JSON |
| 18 | ltx23 : item 7 | The template hardcodes the six-token negative | `[OFFICIAL/TESTED]` | **CONFIRMED** | Present verbatim in the subgraph | `"pc game, console game, video game, cartoon, childish, ugly"` | same JSON |
| 19 | ltx23 : Contradicts #10 | Official minimum is 32 GB+ VRAM; the 12 GB figure is marketing-only | `[OFFICIAL]` | **CONFIRMED** | Verbatim, plus RAM 32 GB / 100 GB / CUDA 12.7+ / Python 3.12+ and A100-80GB/H100 recommended | *"**GPU**: NVIDIA GPU with a minimum 32GB+ VRAM - more is better"* | docs.ltx.io/…/system-requirements.md |
| 20 | ltx23 : Sources | Body cites the template as `raw.githubusercontent.com/Comfy-Org/workflow_templates/**blob**/main/…` | `[OFFICIAL]` | **STALE/BROKEN URL** | That form 404s on raw.githubusercontent; only the Sources-block form (`/main/templates/…`) resolves. Cosmetic but it is the URL a reader will copy | — | — |
| 21 | ltx23 : item 16 | `art-alex` (LTX.io org) on encoder substitution + API encode node lacking 2.5 support | `[STAFF]` | **NOT RE-FETCHED** | Budget. Role-evidence method (org badge + merge action) is sound and 2A independently corroborates the account | — | huggingface.co/Lightricks/LTX-2.5/discussions/34 |
| 22 | flux : item 2 | "FLUX.2 supports prompts up to 32K tokens"; bands Short 10-30 / Medium 30-80 / **Long 80-300+** | `[OFFICIAL]` | **CONFIRMED** | Table and Tip verbatim | identical | docs.bfl.ai/guides/prompting_unified_building |
| 23 | flux : item 3 | The `[SUBJECT], [LOCATION], [STYLE], …` slot template + "prompt-building aid, not a rule" + the nine-row component table | `[OFFICIAL]` | **CONFIRMED** | Verbatim; 1C's quote truncates the Tip one clause early without an ellipsis (*"…every time. **Use the parts that actually improve the image you want.**"*) | identical | same page |
| 24 | flux : item 4 | "An official order-matters demonstration, quotable and **paired with images**" | `[OFFICIAL]` | **OVERSTATED** | The two prompts are verbatim correct, but **no images accompany them**. The page's images sit under other sections. Do not sell this as a paired-image demo | *"Prompt order matters here too. If FLUX keeps pulling too far back, make the subject clear first…"* (text only) | same page |
| 25 | flux : item 5 | BFL softened the no-negatives line; the replacement table; the 3-step procedure; the escalation ladder; klein "what you write is what you get" | `[OFFICIAL]` | **CONFIRMED** | All verbatim | *"Most FLUX models do not support negative prompts. Even when they can process them, AI models generally struggle with negation…"* | docs.bfl.ai/guides/prompting_unified_technical |
| 26 | flux : Chinese sources | The multi-language sentence is attributed to `prompting_unified_technical`/`prompting_guide_flux2` | `[OFFICIAL]` | **MISATTRIBUTED** | That sentence is **not** on `prompting_unified_technical` (I read the page in full). It lives elsewhere in the unified set (likely `usecases_t2i_multi_language`). The claim may be true; the citation is wrong | — | same page |
| 27 | flux : item 8 | `Flux2KleinPipeline` hardcodes `negative_prompt = ""`, has no string negative argument, mis-types `negative_prompt_embeds` as `str`, docstring says `""` is used | `[OFFICIAL]` | **CONFIRMED** | Every element verified in source, plus `do_classifier_free_guidance = self._guidance_scale > 1 and not self.config.is_distilled`, the `is_distilled` config flag and the "ignored for step-wise distilled models" warning | *"Note that "" is used as the negative prompt in this pipeline. If not provided, will be generated from ""."* | raw…/diffusers/main/src/diffusers/pipelines/flux2/pipeline_flux2_klein.py |
| 28 | flux : item 10 | arXiv 2606.03715 tested **FLUX.2 Klein-4B**; BoT >40% but <50%; BoPTW reaches 65% vs full 70–90%; "a noticeable discrepancy persists for FLUX.2"; the sculpture example; SD 2.1 0.2% / SDXL 4%; GenEval Single-object 88/90/100%, DrawBench Text 27/37/24% | `[TESTED/PAPER]` | **CONFIRMED** | Every quoted figure and sentence verified verbatim in the v1 HTML. 1C's handling of this paper is the most careful piece of evidence work in the sweep | *"Still, a noticeable discrepancy persists for FLUX.2…"* / *"with SD 2.1, the non-inferiority rate is 0.2%, and with SDXL it is 4%"* | arxiv.org/html/2606.03715v1 |
| 29 | flux : item 6 | klein multi-reference cap 4; 13 GB vs the repo's 8 GB; 9B KV; LoRA beta 2026-04-23 | `[OFFICIAL]` | **NOT RE-FETCHED** | Budget went to the two load-bearing flux claims (#25, #27). `flux2_overview` and the flux2 repo README were not re-read | — | docs.bfl.ai/flux_2/flux2_overview |
| 30 | z-image : item 1 | Model-zoo table verbatim; Omni-Base and Edit "*To be released*" in **both** columns; Turbo is the only RL variant with CFG ❌ | `[OFFICIAL]` | **CONFIRMED** | Table matches row-for-row; News dates `[2026-01-27]` / `[2025-11-26]` confirmed | identical | raw…/Tongyi-MAI/Z-Image/main/README.md |
| 31 | z-image : item 2 | Base recommended-parameter block, incl. the two lines the HF card drops | `[OFFICIAL]` | **CONFIRMED** | Verbatim, all five bullets | *"**Negative prompts:** Strongly recommended for better control"* / *"**CFG normalization:** `False` for general stylism, `True` for realism"* | same README |
| 32 | z-image : Validator changes | "Turbo → 9 scheduler steps (8 DiT forwards)" — offered as `[SYNTHESIS]` | `[SYNTHESIS]` | **MISLABELLED (too low)** | The official README says it in a code comment. Upgrade to `[OFFICIAL]` | `num_inference_steps=9,  # This actually results in 8 DiT forwards` | same README |
| 33 | z-image : Contradicts #5 | "the vendor's own worked example uses 50 steps, guidance 4, `cfg_normalization=False`, **1280×720**" | `[OFFICIAL]` | **OVERSTATED** (dimension flipped) | The snippet is `height=1280, width=720` — i.e. **720×1280 portrait**, not 1280×720 landscape | `height=1280, width=720` | same README |
| 34 | z-image : item 8 | `QJerry` (Tongyi-MAI org): 512-token cap is a serving choice; `max_sequence_length=1024` supported; ≈0.75 words/token | `[STAFF]` | **CONFIRMED** | Quote and code block verbatim; org badge renders; 2025-11-27 | identical, incl. `##  please add this line, the default is 512` | huggingface.co/Tongyi-MAI/Z-Image-Turbo/discussions/8 |
| 35 | z-image : item 9 | `Cxxs` (Tongyi-MAI org): *"does not rely on classifier-free guidance… does not use negative prompts at all"*; *"works best with long and detailed prompts"* | `[STAFF]` | **CONFIRMED** | Both verbatim, same thread, badge renders | identical | same thread |
| 36 | z-image : item 13 | `ZImagePipeline` **does** accept a string `negative_prompt`; the 08-28 "no string→negative path" defect is klein's alone | `[OFFICIAL]` | **CONFIRMED (indirectly)** | Not re-fetched, but #27 confirms the defect is specific to `Flux2KleinPipeline`'s code shape, and the Z-Image README's own Base snippet passes `negative_prompt=negative_prompt` as a plain string — which only makes sense if the argument exists | `negative_prompt = "" # Optional, but would be powerful…` then `pipe(prompt=…, negative_prompt=negative_prompt, …)` | raw…/Z-Image/main/README.md |
| 37 | z-image : Nothing-found | "`pe.py` 404s"; "`web.archive.org` blocked" | `[OFFICIAL]`/tooling | **CONFIRMED (second-hand)** | The thread itself contains both the 404 report and the archive link; I did not attempt the blocked domain | `MrlG`: *"it's giving a 404 error"* | huggingface.co/Tongyi-MAI/Z-Image-Turbo/discussions/8 |
| 38 | wan22 : item 1 | Constants live in `system_prompt.py` (not `prompt_extend.py`); six symbols; ZH text confirmed verbatim | `[OFFICIAL]` | **CONFIRMED** | Exactly six symbols; ZH T2V rules 1–10, the 60-200字 cap, the 湛蓝色的天空 rule and rule 3's mood ban all verbatim | identical | raw…/Wan-Video/Wan2.2/main/wan/utils/system_prompt.py |
| 39 | wan22 : item 1(b) | EN rewriter caps aesthetic tokens at `不超过4种`; ZH says `部分` (no cap) | `[OFFICIAL]` | **CONFIRMED** | Both rule-1 strings verbatim | identical | same file |
| 40 | wan22 : item 1(b) | "the ZH exemplars front-load **9–11** aesthetic tokens, the EN exemplars **3–4**" | `[SYNTHESIS]` | **UNSUPPORTED** | I counted them. ZH: 9 / 11 / 7. EN: 4 / **10** / 5. **EN exemplar 2 carries ten aesthetic tokens — the vendor's own English example violates its own `不超过4种` cap.** Validator change #1 ("warn above ~4 in English") is built on a band the shipped exemplars contradict | EN ex-2 opens `Dawn time, top lighting, high-angle shot, daylight, long lens shot, center composition, Close-up shot,  Fluorescent lighting,  soft lighting, cool colors.` | same file |
| 41 | wan22 : item 1(c)/(d) | `The俯拍close-up` untranslated leak; `""Low angle shot"` stray quote; ZH 镜头尺寸 has no 极端特写 while EN has `Extreme close-up shot` | `[OFFICIAL]` | **CONFIRMED** | All three present exactly as described | identical | same file |
| 42 | wan22 : Contradicts #3 | The official locked-camera term is `固定镜头`, not `固定机位` | `[OFFICIAL]` | **CONFIRMED** | Verbatim in the I2V formula; `meta-last-modified: 2026-09-02T00:46:00+08:00` confirmed | 「若希望镜头不要发生变化，可以通过"固定镜头"来强调」 | help.aliyun.com/zh/model-studio/text-to-video-prompt |
| 43 | wan22 : Contradicts #1 | The "orbit wider than 45° risks distortion" rule has **no** support on the Alibaba guide; the sole 环绕运镜 exemplar is a successful ~180° back-to-front orbit | `[OFFICIAL]`→`[LORE]` | **CONFIRMED** | No degree figure appears anywhere on the page. The orbit exemplar sits inside 动态控制, which the page labels 「以下视频效果均使用**万相2.2**版本」 — so it *is* a Wan 2.2 example. **This falsifies both the app's KNOWLEDGE line and the live `wan` system prompt** | 「**环绕运镜**，镜头跟随人物背面运镜至正面…镜头从他背后缓缓绕行至正面」 | same page |
| 44 | wan22 : Chinese vocabulary table | 运动描述 = 幅度+速率+效果 with three exemplar phrases; cloud-only control words (生成单镜头 / 无台词 / 无背景音乐 / 图n / 视频n / character1) | `[OFFICIAL]` | **CONFIRMED** | All verbatim, and the wan2.5+/2.6/2.7/3.0 scoping is correct | 「包含运动的**幅度、速率**和运动作用的**效果**，例如"猛烈地摇摆"、"缓慢地移动"、"打碎了玻璃"」 | same page |
| 45 | wan22 : Nothing-found | Wan-Dancer "Prompt Alignment 9.03" NOT FOUND on the HF card / abstract / project page | `[OFFICIAL]` absence | **CONFIRMED** | No benchmark, no score, no "Prompt Alignment" string anywhere on the card. **The app states 9.03 as fact** | — | huggingface.co/Wan-AI/Wan-Dancer-14B/raw/main/README.md |
| 46 | wan22 : item 4 | Wan-Dancer `cfg_scale=5` official; five genres; 48 global / 24 local steps; Apache 2.0 | `[OFFICIAL]` | **CONFIRMED** | All five worked examples list `cfg_scale=5`; the five prompt-file paths are on the card; `license: apache-2.0` | *"`prompt_path` — Path to prompt file (defines dance style)"* | same card |
| 47 | wan22 : item 4 | "~28 GB bf16" for Wan-Dancer, carried by the app as fact | `[SPECULATION]` (1F) | **UNSUPPORTED** | Not on the card. 1F correctly flags it unverified; the **app** does not | — | same card |
| 48 | minimax-h3 : item 1 | Licence verbatim: §I.3/I.5 Excluded Territories; §II escape hatch; §IV.1 $20M + `api@minimax.io` subject line; §IV.2 "shall prominently display"; §III.3 "encouraged to"; §III.4 NOTICE; §V.3 + §I.11 no-distill; §V.4 + Exhibit A #1 outputs-outside-territory; §VI.4 no rights over Outputs; Qwen3-VL-32B Apache note | `[OFFICIAL]` | **CONFIRMED** | Ten separate quotations, all byte-exact including the source's own `"MiniMax H3"on` typo. **The strongest verified block in the whole sweep** | identical throughout | huggingface.co/MiniMaxAI/MiniMax-H3/raw/main/LICENSE |
| 49 | minimax-h3 : item 2 | Comfy's tutorial says commercial use of *local* outputs needs a MiniMax licence sold by Comfy as "the only official reseller" | `[OFFICIAL]` | **CONFIRMED** | Verbatim | *"Commercial use of locally generated outputs requires a MiniMax commercial license, available through Comfy, the only official reseller. Generations on Comfy Cloud already include commercial rights."* | docs.comfy.org/tutorials/video/minimax/minimax-h3 |
| 50 | minimax-h3 : item 5 | Node constants (`CANVAS_MULTIPLE 32`, `BASE_SHORT_EDGE 768`, `MAX_PIXELS 768*1344`, `REF_IMAGE_SHORT_EDGE 2048`, `FPS 24`, `AUDIO_LATENT_FPS 40`), `align_frame_count`, the length tooltip, sigma-shift 12/3, keyframe asymmetry comments, `dynamic_prompts=True` | `[OFFICIAL]` | **CONFIRMED** | Every constant, comment and tooltip verbatim; 124=5.167 s and 362=15.083 s check out | *"Frame count at 24 fps, snapped up to the model's 17k+5 grid (124 = ~5s; trained range is ~124-362, longer is untested)"* | raw…/ComfyUI/master/comfy_extras/nodes_minimax_h3.py |
| 51 | minimax-h3 : item 4(c) | "`comfy_extras/nodes_minimax_h3.py` contains only **four** nodes … with no enhancer among them" — used as one of three proofs Context-IR is cloud-only | `[OFFICIAL]` | **OVERSTATED (inference)** | The file does contain exactly four nodes. But the official docs page documents a **fifth** H3 node, `MiniMaxH3AddGuide` (PR #15439), which is *not* in that file — so "this file lists every H3 node" is false, and absence-from-this-file is weak evidence. The conclusion (Context-IR is cloud-only) still stands on the other two confirmations | docs: *"[#15439] added the `MiniMaxH3AddGuide` node"*; file: four `io.ComfyNode` classes | node file + docs page |
| 52 | minimax-h3 : Contradicts #4 | Local ComfyUI caps are 9/3/3/3 with **no total cap**; the "12 files max" belongs to the hosted/tooling surface | `[OFFICIAL]` | **CONFIRMED** | Autogrow maxima are 9/3/3/3 in the schema; the docs state the caps with no total. **The app's KNOWLEDGE says "12 files max" flatly** | *"Up to 9 reference images, 3 reference videos (each can carry its own soundtrack), and 3 standalone reference audio clips"* | node file + docs page |
| 53 | minimax-h3 : item 7 | `MiniMaxH3AddGuide` semantics (any frame, clip lengths 5/22/39…, `<5` uses first image only, negative `frame_idx`, audio cropped, chainable) and per-token noise masks | `[OFFICIAL]` | **CONFIRMED** | Verbatim on the docs page | *"a value of `0` preserves the corresponding latent region, while `1` regenerates it. Video masks snap to the model's 2x2 latent patch grid…"* | docs.comfy.org/tutorials/video/minimax/minimax-h3 |
| 54 | krea : item 2 & 3 | `encoder.py`: the nine-slot system descriptor verbatim; `max_length=512`; 12 `select_layers`; 541-token window; silent truncation; the 34-token prefix sliced off | `[OFFICIAL]` | **CONFIRMED** | Every line exact, including `prompt_template_encode_start_idx = 34` and `hiddens = hiddens[:, prefix_idx:]` | identical | raw…/krea-ai/krea-2/main/encoder.py |
| 55 | krea : item 1 & 5 | Nine LoRA triggers + strengths; *"The defaults (8 steps, prompt enhancement enabled, no LoRA)…"*; `prompt_enhance` and `LLM_max_token` tooltips | `[OFFICIAL — ComfyUI docs]` | **CONFIRMED** | Table identical row-for-row; both tooltips verbatim; the `[OFFICIAL — ComfyUI docs]` not `[OFFICIAL — Krea]` scoping is exactly right | identical | docs.comfy.org/tutorials/image/krea/krea-2 |
| 56 | krea : Nothing-found | "`krea/Krea-2-Turbo` and `-Raw` raw model cards: unreachable … returns an empty body because the repos are licence-gated" | tooling absence | **UNSUPPORTED** | `huggingface.co/krea/Krea-2-Turbo/raw/665ef381…/README.md` fetched **in full** for me. The gating explanation is wrong for `raw/` refs, and every §1.1–§1.3 quote 1C declared un-refreshable is in fact refreshable | full card returned, 36 widget prompts included | pinned-commit raw URL |
| 57 | staff-claims : row 12 | `NagaSaiAbhinay` (KREA org) pointed at a pinned commit with "36 prompts & images"; 2A calls the URL "stable and fetchable" | `[STAFF]` | **CONFIRMED** | The URL works and the card carries **exactly 36** `widget:` entries (`images/00.jpg`…`images/35.jpg`). 2A's highest-value row, vindicated | 36 widget prompt/output pairs | same URL |
| 58 | staff-claims : rows 7/8/9 | KandooAI (`Author`): 75-token claim; "start with no negative"; NSFW controllable via negative tags because of a low-ratio Lustify merge | `[CREATOR]` | **CONFIRMED** | All three verbatim, `Author` badge rendered, dates match (2025-05-11 / card 2025-05-07 / 2025-05-07) | *"Additionally, your prompt should be no longer than 75 tokens. This is an SDXL model with a CLIP text encoder. Anything beyond 75 tokens is ignored by the model or can even result in worse image quality than if you had trimmed it down."* | civarchive.com/models/133005 |
| 59 | staff-claims : contradiction #1 | The 75-token *mechanism* ("ignored by the model") is wrong for ComfyUI, which chunks and concatenates | `[TESTED]` reading | **CONFIRMED as a correction** | 2A caught its own source. Keep the advice, drop the mechanism — and note the app currently repeats neither, which is the right state | — | — |
| 60 | staff-claims : rows 1/2/3/10/11 | Cxxs encoder-lock; Cxxs steps+time-shift; DyJiang step-distillation; SG_161222 RealVis Lightning; L_A_X NoobAI score tags | `[STAFF]`/`[CREATOR]` | **NOT RE-FETCHED** | Budget. Rows 1–3 sit on the same repo and badge I verified for #34/#35, so the role evidence is sound; rows 10/11 rest on CivArchive `Author` badges, a method I verified works for row 7 | — | — |
| 61 | sdxl : recipe table + verbatim blocks | NoobAI v-pred settings/prefix/negative/zsnr; Pony V6 card block; Animagine §1–§6 + Limitations; Ragnarok settings + prompting tips + BOORU rule | `[OFFICIAL]`/`[CREATOR]` | **CONFIRMED** (with three defects, below) | All four blocks verified against the live cards; see #62–#64 in *Process defects* for the quote-assembly, licence-omission and mirror-grading problems | e.g. *"Sampling Method: **Euler** (⚠️ Other samplers will not work properly)"* | four URLs in Sources |

### Test-kit spot-check (brief item: 3 JSONs, validity + only-documented-points changed)

I diffed **four** files programmatically against their source templates (whole-tree recursive diff,
not a text diff).

| File | JSON valid | Diffs vs template | Verdict |
|---|---|---|---|
| `T1-qwen-a-prose.json` vs `image_qwen_image.json` | yes | 9 — prompt, seed, `control_after_generate`, steps, cfg (×2 nodes), width/height, `filename_prefix` | **CONFIRMED** — all inside the documented allow-list |
| `T2-zimage-turbo-zeroout.json` vs `image_z_image_turbo.json` | yes | 5 — prompt, seed, `control_after_generate`, cfg, `filename_prefix` | **CONFIRMED** |
| `T5-wan5b-orbit45.json` vs `video_wan2_2_5B_ti2v.json` | yes | 8 — prompt, seed, `control_after_generate`, cfg, width/height/length, `filename_prefix` | **CONFIRMED** |
| `T7-noobai-vpred-euler-karras.json` vs `image_sdxl_simple.json` | yes | 22 — prompt, negative, seed, steps, cfg, sampler, width/height, `ckpt_name`, `filename_prefix` (each appearing twice because these nodes carry both `widgets_values` and `widgets_values_named`) | **CONFIRMED** |

Node ids, link ids and counts are byte-identical in all four, as 2B claims. The
`T2-zimage-turbo-negeqpos.json` arm differs from its sibling **only** by `mode: 4` (bypass) on the
existing `ConditioningZeroOut` node — an elegant, documented-points-only way to build the arm.

**Two test-design defects, though** (recorded in *Process defects* #67 and #68): the T7 v-pred arm ships
no v-prediction / zsnr / CFG-Rescale node, and the T2 Z-Image-Base arm's "negative = positive" condition
mathematically cancels guidance rather than testing it.

---

## Verdict summary

| Verdict | Count |
|---|---|
| **CONFIRMED** | 38 |
| **OVERSTATED** | 8 |
| **UNSUPPORTED** | 6 |
| **MISLABELLED** | 2 (one too high: #26 misattribution; one too low: #32) |
| **STALE / broken** | 1 |
| **NOT RE-FETCHED** | 4 |
| **UNREACHABLE** | 0 (I attempted no domain under a standing refusal) |
| **Total** | **59 rows + 2 method rows = 61** |

Plus **4 test-kit JSONs** verified valid and edit-scoped, and **1 sweep-wide tooling claim refuted**
(`api.github.com`).

**Overall read.** The sweep is unusually good on primary-source retrieval: every verbatim code and
licence block I re-fetched came back byte-exact, which is rare. The failures cluster in three places:
(a) **quotes that were tightened or extended while inside quotation marks** (#3, #4, #23), (b) **counts
and tallies asserted without being counted** (#14, #17, #40), and (c) **absence and tooling claims stated
absolutely rather than per-endpoint** (#6, #56, the `api.github.com` claim).

---

## Internal contradictions ruled

**1. `api.github.com` — 1A vs 1B/1C/1D/2A.**
**Ruling: 1A is right, the others are over-broad.** `/branches` returns a full body; `/issues`,
`/contents`, `/git/trees` and `/search` do not. Record as *endpoint-specific*, and stop writing "every
request". This matters because 1A's SCAIL-2 branch claim was the one item four other agents' tooling note
would have you disbelieve.

**2. SCAIL-2 licence — 1A "conflict, unresolved" vs 2D "hands agent 1A two facts it was missing: SCAIL-2's licence tag is MIT".**
**Ruling: 1A is right on the facts; 2D is wrong about 1A.** 1A already recorded both the Apache `LICENSE`
(verified: "Copyright 2026 Zhipu AI") *and* the MIT tag on HF/ModelScope/Comfy-Org, and explicitly
declined to pick. 2D's framing implies 1A missed the MIT tag and the Comfy-Org repackage; it did not
(`scail2.md` Contradicts #6 and the `Comfy-Org/SCAIL-2` card citation). **Do not let the digest record
this as a 2D discovery.** The substantive answer for the app: *the code repo is Apache-2.0, every
distribution surface is tagged MIT; both are permissive; state the conflict.*

**3. Z-Image negative path — 08-28 digest #3 vs 1C.**
**Ruling: 1C is right and the digest line must be corrected.** The defect is `Flux2KleinPipeline`'s
alone (#27 verified in source), and the Z-Image README's own Base snippet passes a plain-string
`negative_prompt` (#36). The two pipelines were conflated because one issue mentions both.

**4. Wan "orbit ≤ 45°" — this file's own lines 9/44 vs 1F Contradicts #1.**
**Ruling: 1F wins outright.** No degree figure exists anywhere on the (2026-09-02) Alibaba guide, and the
only 环绕运镜 exemplar is a *successful* ~180° orbit inside the Wan-2.2-labelled section. The rule is
`[LORE]` at best. **This is live in the app twice** (see TARGETS audit).

**5. LTX enhancer default — Lightricks docs vs Comfy Org docs vs the shipped template.**
**Ruling: 1D wins on all three legs.** Template `prompt_enhance = true` (#15), Lightricks says on,
Comfy Org says off (#16). Also **1D's rejection of the digest's "default-on window Aug 11–20" is
correct**: no source dates a change, and the template on `main` is on today. Restate as *current state*,
never as a closed historical window — which means the app's "community results from that window are
confounded" sentence has no source.

**6. H3 VRAM — 1E (MiniMax publishes 未公布; 12 GB is community) vs the app (12 GB as a working figure).**
**Ruling: 1E's structure is right** (vendor publishes no minimum; the 12 GB/42 GB pair is the marketing
FAQ's 「社区验证过的参考点」 for **480p with audio**). I did not re-fetch `platform.minimaxi.com`, so the
Chinese 未公布 quotes are NOT RE-FETCHED — but the arithmetic 1E offers (20.97 + 15.69 + 5.21 + 0.61 =
42.48 GB) is checkable and correct, and the docs page I *did* fetch names exactly those four files.

**7. The 75-token SDXL claim — 2A row 7 vs 2A contradiction #1 vs the app.**
**Ruling: the advice is `[CREATOR]`-sourced and verified; the mechanism is false.** KandooAI really wrote
"ignored by the model" (#58). ComfyUI chunks past 75 and concatenates, so token 100 does reach the model.
**Additional finding neither agent made:** the ≤75 figure is stated by the author for **Juggernaut XL**
and in the **Ragnarok** guide; 1B's validator nonetheless applies "warn above ~75 CLIP tokens" to
**Juggernaut XI/XII**, whose own HF card states no token guidance. That extrapolation is `[LORE]`.

**8. Krea 2 model cards reachable? — 1C ("gated, empty body") vs 2A ("stable and fetchable").**
**Ruling: 2A wins.** The pinned-commit raw URL returns the full card (#56). 1C's blanket
"un-refreshed this sweep" caveat over §1.1–§1.3 should be lifted, and the 36 official prompt+image pairs
should be harvested — they are the largest first-party Krea 2 prompt corpus in existence.

**9. Krea 2 Turbo CFG — the corpus/app ("CFG-free Turbo, 0.0 in the CLI/diffusers") vs the official Turbo card.**
**Ruling: a new, unrecorded official-vs-corpus conflict.** The `krea/Krea-2-Turbo` card's own diffusers
snippet is `pipe("a fox in the snow", num_inference_steps=8, guidance_scale=3.5)`. Nobody in the sweep
records that. Either `Krea2Pipeline` treats `guidance_scale` as embedded (not CFG) guidance, or the app's
"CFG-free" framing is wrong. **Unresolved and testable — do not fold either side in as settled.**

**10. `MiniMaxH3AddGuide` — 1E item 4(c) ("only four nodes") vs 1E item 7 ("AddGuide exists").**
**Ruling: both observations are true and 1E did not notice they collide.** The node file has four
classes; the docs document a fifth from a merged PR. Treat "not in that file" as weak evidence of
absence from now on (#51).

**11. Z-Image Edit "released" — 1C locates the contradiction on the project blog only.**
**Ruling: 1C understates it.** The **repo README itself** showcases Edit ("🧠 **Creative Image Editing**:
**Z-Image-Edit** shows a strong understanding of bilingual editing instructions…") three sections below
the zoo table that marks it *To be released*. The vendor contradicts itself inside one file.

---

## Live app audit — `KNOWLEDGE`

`PromptStudio.html` lines 816–889. Read-only. Each row quotes the app, then the corpus/source text that
contradicts or dates it, with the research file + heading that carries it.

| # | App text (verbatim, `KNOWLEDGE`) | Contradicted / dated by | Source of the correction | Severity |
|---|---|---|---|---|
| K1 | *"using official tokens ("arc shot", NOT "orbit" — orbit is the documented failure word), arcs under ~45 degrees"* | No degree figure and no orbit warning exist on the Alibaba guide (rev. 2026-09-02) or in `system_prompt.py`; the guide's only 环绕运镜 exemplar is a **successful ~180° orbit** in the Wan-2.2-labelled section | `wan22.md` §2026-09 sweep → *Contradicts current corpus* #1 · verified #43 | **High — an OFFICIAL-graded rule with no first-party source** |
| K2 | *"Wan-Dancer-14B (Apache, Jul 2026, ~28GB bf16) … headline **Prompt Alignment 9.03**"* | No benchmark, score or "Prompt Alignment" string on the HF card, the arXiv v2 abstract or the project page; no size figure either | `wan22.md` → *Nothing-found register* · verified #45, #47 | **High — two unsourced numbers presented as headline facts** |
| K3 | *"Wan-Dancer-14B … dance/choreography video that is NOT prompt-inert: **real prompts**"* | The dialect is a fixed four-slot training caption (`一个人正在跳舞，舞蹈种类是{genre},图像清晰程度{…},人物动作平均幅度{…},人物动作最大幅度{…}。`) plus a runtime-appended `帧率是{n}`; cinematography words are out of schema | `wan22.md` §item 4 · card corroborates ("prompt file (defines dance style)") #46 | Medium |
| K4 | *"I2V-A14B officially wants **≤100 words** of MOTION-ONLY content"* | True of the **EN** rewriter only. `I2V_A14B_ZH_SYS_PROMPT` says 「改写后的prompt字数控制在**100字以下**」 — 100 **Chinese characters**, roughly a third of the budget. The app teaches one number for two different limits | `system_prompt.py` (my finding; not in any sweep file) | Medium — new |
| K5 | *"LTX 2.3 / 2.5 … ≤150 words (official enhancer ceiling for 2.3)"* and *"Auto Duration … and Native Multishot are UNTESTED prompt-semantics changes"* | The 150 figure descends from the **LTXV-0.9** enhancer (Llama-3.2-3B + Florence-2), a component 2.5 does not use; current guidance is sentence-count. And Auto Duration is **absent from the shipped ComfyUI template** — it is a Python-path feature, not an untested unknown | `ltx23.md` → *Contradicts* #3/#4 and item 12 · verified #12, #17 | **High** |
| K6 | *"Gemma 4 12B encoder (~15GB alone — "runs on 12GB" claims assume GGUF/offload)"* | Official **minimum is 32 GB+ VRAM**; there is **no official GGUF path** for LTX-2.5 (community request open, no reply). The mechanism behind the low numbers is int8/fp8 + CPU/disk offload + block streaming + tiled VAE | `ltx23.md` item 10 · verified #19 | **High — the app names the wrong mechanism and the wrong floor** |
| K7 | *"license is NOT Apache — free under **$10M ARR**"* | The agreement says **"annual revenues of at least $10,000,000"**, not ARR, and aggregates subsidiaries/affiliates under common control (§1.6) | `ltx23.md` item 15 (LICENSE, license date 2026-08-11) | Low but legally material |
| K8 | *"No universal negative list is documented"* (LTX) | **Three** official negatives exist: the ~90-item `DEFAULT_NEGATIVE_PROMPT` in `ltx_pipelines/utils/constants.py`, a Diffusers copy **missing its first five items**, and the six-token template negative | `ltx23.md` → *Contradicts* #2 · template negative verified #18 | **High** |
| K9 | *"HISTORY: LTX-2.5's built-in prompt enhancer was ON by default Aug 11-20, 2026 … community results from that window are confounded."* | No source dates any change of the default, and the template on `main` is default-**on today**. The window is invented; the confound is *ongoing*, not historical | `ltx23.md` item 5 + *Contradicts* #11 · verified #15, #16 | **High — the app tells students the problem is over** |
| K10 | *"For exact pose/motion paths use the IC-LoRA controls (**Pose Control**, **Motion Track Control**)"* | For 2.5, pose lives inside **Union Control** (depth+canny+pose); the standalone pose adapter is an LTX-**2.0** 19b file absent from the 2.5 table. "Motion Track Control" is now **Motion Control** | `ltx23.md` item 13 + *Contradicts* #6 | Medium |
| K11 | *"open weights Aug 3, 2026"* (H3) | Licence header: *"MiniMax H3 release date/License date: **August 2, 2026**"* | verified #48 | Low |
| K12 | *"Reference caps: 9 images + 3 videos … + 3 audio (15s total), **12 files max**"* | Local ComfyUI exposes 9/3/3/3 = **18 slots with no total cap**; the 12-total figure is a hosted/tooling rule (it appears only in a third-party rewriter's README) | `minimax-h3.md` → *Contradicts* #4 · verified #52 | **High — a hard validator number that is wrong locally** |
| K13 | *"audio cannot be sent without at least one image or video"* (H3) | Not stated on the ComfyUI docs page, and `MiniMaxH3ReferenceToVideo` iterates `ref_audios` independently of `ref_images`/`ref_videos` — nothing in the schema or `execute()` enforces it | node file + docs page, verified #50/#52 | Medium — **unsourced** |
| K14 | *"Community H3 LoRAs DO exist despite the license (user-verified on civitai.red…)"* — and nothing about who owns the derivative | A LoRA trained on H3 is a **Model Derivative** under §I.11 and inherits every term including the territorial ban on **outputs** (§V.4). Several HF H3 LoRAs are tagged `apache-2.0` regardless | `minimax-h3.md` LoRA ecosystem `[SPECULATION]` · licence verified #48 | Medium |
| K15 | *"the advertised 4s appears API-only"*; *"2K only via the hosted Regenerate-2K module"* | Both hold, but the app should also carry the trap: **docs.comfy.org's own H3 page headline says "Output is up to 2K resolution, 24fps, and about 15 seconds"** while the local weights are 768p. A student reading the official page is misled | docs page, verified #49 context | Medium — new |
| K16 | *"official enhancer bans replace/swap/edit/mask wording and targets one 90-140-word ENGLISH paragraph for Replacement (**Animation can be 15-60 words**: "The girl is dancing" is an official minimal example)"* | The vendor's own line is the opposite and mode-agnostic: long detailed prompts beat short and empty ones. `"The girl is dancing"` is a **CLI smoke test**, and the official template's default prompt is 111 words for an animation-style dance | `scail2.md` → *Contradicts* #2 · verified #2 | **High** |
| K17 | *"CLASSIFICATION: effectively PROMPT-INERT ("prompts have limited impact on the final result"; the paper has no prompt ablation)"* | The paper indeed never ablates the prompt — but the vendor ships a whole Gemini rewriter, states long prompts win, and the official workflow note says the main prompt controls final appearance. 1A's verdict is *prompt-subordinate, not inert* | `scail2.md` → *Prompt-inertness verdict* · #2, #5 | **High — the app's classification drives its whole SCAIL UX** |
| K18 | *"Length: no total cap"* (SCAIL-2) | `wan_shared_cfg.text_len = 512` (UMT5) is a hard cap | `scail2.md` → *Contradicts* #4 · verified #7 | Medium |
| K19 | *"masks (placement; white background = replacement/keep scene)"* — one polarity given | Polarity inverts **on both sides**: Animation → driving black / reference **white**; Replacement → driving white / reference **black**. The app states only the driving side | `scail2.md` mask polarity · verified #9 | Medium |
| K20 | *"official repo: zai-org/SCAIL-2"* + *"Repo note: zai-org/SCAIL-2 has no main branch — default is wan-scail2"* | **Correct** — and now verified at the API. Keep. (The file's own Sources block still points at the `Ardynai` fork; the app does not) | verified #1 | — (no change needed) |
| K21 | *"official enhancer bans replace/swap/edit/mask wording"* | Narrower than the official ban list, which also forbids `"the task is"`, `Gemini`, `editing software` and mentioning the prompt-generation process (rule 7) | `scail2.md` enhancer rules · verified #5 | Low |
| K22 | *"Anime: Pony V6 needs its score ladder … + source_* tags; Illustrious wants **masterpiece/best-quality** + canonical Danbooru tags"* | **No Onoma card states any quality prefix.** The `masterpiece, best quality, amazing quality` scheme is a third-party guide (SeaArt, 2025-03-18). The same app then says *"Illustrious deliberate de-biasing"* two sentences later — the app contradicts itself | `sdxl.md` → *Contradicts* #4 | **High — internal self-contradiction in one paragraph** |
| K23 | *"NO QUALITY-TAG SCHEME IS PORTABLE: Pony V6 ladder, NoobAI time-decayed percentile ladder, Animagine 4.0 own vocabulary (placed at the END), Illustrious deliberate de-biasing — five incompatible official answers"* | Four are named, "five" is claimed. And the fifth (photoreal) has no scheme at all. Also **Animagine documents two sets** — `masterpiece/best quality/low quality/worst quality` *and* the six score tags | verified #61 (Animagine card §"Special Tags") | Low |
| K24 | *"Illustrious org static since Apr 2025"* | True of **HuggingFace only**. v3.0 EPS, v3.0 VPred and v3.5 VPred shipped after that on the vendor platform (v3.5-vpred release notes 2025-06-16) | `sdxl.md` → *Contradicts* #6 | Medium |
| K25 | *"Sampler advice equally non-portable (NoobAI v-pred bans Karras; RealVis requires it; Pony Realism bans DPM++ 2M Karras)"* | Under-warns. The NoobAI card is **stricter than a Karras ban**: *"Sampling Method: **Euler** (⚠️ Other samplers will not work properly)"*. The safe teaching is "Euler or DDIM, never a Karras schedule", plus `rescale_betas_zero_snr`, plus CFG-Rescale ≈0.2, plus CFG 4–5 | `sdxl.md` → *Contradicts* #5 · verified #61 | **High** |
| K26 | Nothing in `KNOWLEDGE` about Illustrious **control tokens** | Six documented axes exist (contrast / brightness / sharpness / dynamic colors / colorfulness / saturation), plus the author's warning that `dark` is "contaminated" and `black theme` is preferable, plus "v3.0-vpred may not work well with the token" | `sdxl.md` → *Contradicts* #7 | Medium — largest missing vocabulary |
| K27 | Nothing in `KNOWLEDGE` about **anime-checkpoint licences** | **NoobAI-XL is `fair-ai-public-license-1.0-sd` with an explicit "II. Commercial Prohibition — We prohibit any form of commercialization" and a mandatory open-sourcing clause. Pony V6 forbids running inference on any monetized site or app** (modified FAIPL; explicit carve-out only for Civitai and HF). Animagine 4.0 is CreativeML OpenRAIL++-M and permits commercial use | my finding — **absent from `sdxl.md` too** | **High — new; a teaching app recommending these to students should say so** |
| K28 | *"BEST-EVIDENCED CROSS-MODEL RULE … A "bag of position-tagged words" (identity + order, no grammar) **matched** full prose embeddings on quality, attribute binding, spatial relations AND numeracy (arXiv:2606.03715, image models)"* | The paper reports BoPTW at **65%** non-inferiority against full embeddings' **70–90%** — "coming close to", not matching — and singles out **FLUX.2 as still sensitive** to losing context. Category spread is wide (GenEval Single-object 88–100%; DrawBench **Text 24–37%**) | verified #28 | **High — the app's flagship rule is overstated against its own citation** |
| K29 | Same line: the paper is presented with no architecture scope | The paper's own DiT-vs-U-Net section: **SD 2.1 0.2%, SDXL 4%** — U-Net models "completely fail" without context. The app applies the rule as cross-model while shipping an SDXL target | verified #28 · `flux.md` *Validator changes* last bullet | **High** |
| K30 | Same line: *"four independent vendor guides converge on order-based emphasis"* | Uncounted and unsourced. BFL is one (verified). No list of four exists anywhere in the corpus | verified #24 | Low |
| K31 | *"Cloud accepts 32K tokens; LOCAL weights hard-truncate at 512 silently"* (FLUX) | Correct and now verified both ends (#22, #27). Keep — this is one of the app's best lines | — | — (no change) |
| K32 | *"FLUX.2 klein … (9B needs Qwen3-8B; **wrong encoder = black images**)"* | **No source anywhere** produces a black image from an encoder mismatch. The observed symptom is `mat1 and mat2 shapes cannot be multiplied (512x12288 and 7680x3072)` at the sampler | `flux.md` item 7 + *Nothing-found* first bullet | **High — a named diagnostic that is wrong** |
| K33 | *"Official FLUX.2 order: Subject + Action first, then style, then context; 30-80 words "usually ideal""* | Still official on the pro/max page, but BFL's **current** unified guidance is a slot-ordered comma-run template plus bands 10-30 / 30-80 / **80-300+** | `flux.md` items 1–3 · verified #22, #23 | Medium |
| K34 | *"FLUX.2 dev 32B + klein (FIVE checkpoints…)"* | Six rows in BFL's own distillation matrix (klein 4B, 9B, 9B KV, 4B Base, 9B Base, dev), and **9B KV is new to the corpus** | `flux.md` item 6 + *Contradicts* #4 | Low |
| K35 | *"Turbo: 8 steps, guidance 0, NO negatives"* (Z-Image) | Vendor code says `num_inference_steps=9,  # This actually results in 8 DiT forwards`. "8 steps" is the zoo table's NFE count, not the value you type | verified #32 | Medium |
| K36 | *"Base (Jan 27, 2026, released): 28-50 steps, CFG 3-5, negatives strongly recommended, cfg_normalization off=stylized/on=realism"* | Correct — and now precisely sourced (GitHub README only; the HF card **drops** the negative and cfg-normalization lines). Add the mechanism: `cfg_normalization` is a **norm clamp on the guided prediction**, used as a float, so it is a CFG-burn limiter, not a quality switch. `cfg_truncation` is missing from the app entirely | `z-image.md` items 2–4 · verified #31 | Medium |
| K37 | *"Z-Image-Edit and Omni-Base remain "To be released" — the official blog's claim that Edit is available is FALSE as of Aug 2026 (9 months, no maintainer replies)"* | The zoo-table half is verified (#30). But **the repo README itself** showcases Edit, so the contradiction is not blog-vs-repo, it is *inside the README*. And "9 months, no maintainer replies" rests on diffusers issue #169, which **1C could not re-verify this sweep** | verified #30 + `z-image.md` *Nothing-found* 2nd bullet | Medium |
| K38 | Nothing about Z-Image's official VRAM figure or a Z-Image ControlNet | The README states Turbo *"fits comfortably within **16G VRAM** consumer devices"*, and its Community Works section names **`Z-Image-ControlNet`** and a 4 GB-VRAM path via `stable-diffusion.cpp` | verified #30 (same README) | Low — new |
| K39 | *"KREA 2 (K2) — Krea's from-scratch **~12.9B** DiT"* | The official card says *"Diffusion Transformer with **12 billion** parameters"* | verified #57 | Low |
| K40 | *"LICENSE is custom (Community License: roughly **under $1M revenue and under 50 seats**, plus content-filter obligations)"* | The content-filter obligation is confirmed on the card (*"deployers are required to implement content filtering measures or equivalent review processes"*). The **$1M / 50-seat thresholds appear on no surface I or any agent fetched** — the licence is a PDF nobody opened | verified #57; `krea-character-art.md` has no licence quote either | **High — an unsourced licence threshold in a teaching app** |
| K41 | *"CONTESTED length cliff: … got clean output at 576 tokens but pure black at 640 — **yet no cap exists anywhere in the ComfyUI/Krea source**"* | A cap does exist: `encoder.py` sets `max_length = 512` and truncates silently at a 541-token window. The reference implementation cannot exceed 512 conditioning positions; ComfyUI can — that *is* the bug | `krea-character-art.md` item 3 · verified #54 | **High — the app asserts the opposite of the source** |
| K42 | *"Emphasis syntax (word:1.2) is **actively destructive**"* (Krea 2) | The stock Krea 2 tokenizer does not parse weights at all — they are **literal text**. The syntax becomes meaningful only inside a NegPiP patch | `krea-character-art.md` → *Contradicts* #5 | Medium |
| K43 | *"image reference via VAEEncode→ReferenceLatent (**does most identity work**; text alone is worse)"* | Contested at source level: `Krea2.extra_conds` reads only `cross_attn` — no `reference_latents` — so a latent entry would be silently discarded. The identity work is plausibly the *vision* path's. ComfyUI's own style-reference template uses a dedicated int8 checkpoint + `krea2_style_reference.safetensors`, **not** a latent slot | `krea-character-art.md` → *Contradicts* #1 · template set verified #55 | **High** |
| K44 | *"the pipeline's prompt_enhance is ON by default and RL-trained to INCREASE diversity"* | Default-ON verified verbatim. The "RL-trained to increase diversity" half has **no source** in the corpus; what the enhancer actually is: a nine-rule system prompt (`docs/expansion.txt`) run through `TextGenerate` on the same Qwen3-VL-4B, which can emit an **ethics refusal** that silently replaces the prompt | verified #55 · `krea-character-art.md` item 6 | Medium |
| K45 | *"HOST TRAP: several hosted APIs (fal, Segmind) expose a negative_prompt field on FLUX.2 and Z-Image that is architecturally DEAD — the pipelines have no string-to-negative path (open diffusers issue #13416)"* | Half wrong: **`ZImagePipeline` does have a string→negative path.** The dead-field claim survives for klein; for Z-Image the field is dead only at `guidance_scale == 0` | `z-image.md` item 13 + `flux.md` item 8 · verified #27, #36 | **High** |
| K46 | *"Negatives active: SDXL (CFG 5-8), Wan (official ZH list), Qwen-Image (official ZH list), Z-Image Base, FLUX.2 klein Base"* | Add **SCAIL-2**: CFG is live at the 5.0 default, the CLI hardcodes a Chinese Wan negative, and ComfyUI exposes `negative` as a real conditioning input. Also note klein Base's negative is architecturally live but **unreachable through diffusers** | `scail2.md` → *Contradicts* #3 · verified #7, #9, #27 | Medium |
| K47 | *"Prompt inflation is measurably harmful (TESTED, video)"* + reconciliation paragraph | Holds, and gains a **staff-authored worked example**: `art-alex` (LTX.io org) fixed a failing I2V prompt by deleting a keyword preamble, deleting a quality tail, deleting the camera spec, giving each beat its own line, and adding screen-side specificity | `staff-claims-2026-09.md` rows 5–6 (role evidence sound; not re-fetched) | — (additive) |
| K48 | *"Illustrious XL v2 (or NoobAI derivatives) for anime — still king, every top Civitai anime checkpoint builds on it"* | Unverifiable from any surface reachable this sweep (civitai.com returns an empty body for every agent). Presented as fact | `staff-claims-2026-09.md` surfaces table; `sdxl.md` surface notes | Medium — **unfalsifiable as written** |
| K49 | Nothing in `KNOWLEDGE` about **Bernini-R** | ByteDance Bernini-R is Apache-2.0, has ComfyUI **core** nodes, an official Comfy-Org repackage, an official tutorial and two official templates, speaks Wan 2.2's cinematic-axis prose, and addresses `image0`, `image1`, … positionally | `new-models.md` §Bernini-R (NOT RE-FETCHED by me — verify before folding) | Medium — new coverage gap |
| K50 | *"LTX-2.5 … lost the one multi-shot bakeoff to H3"* / *"FramePack … BEST local camera follower at 71.4"* / *"Sci-VBench spatiotemporal 2.79"* | Not touched by any Wave-1/2 file and not re-verified here. Flagged so the digest does not treat them as freshly confirmed | — | Low — **untouched, unverified** |

**Count: 50 `KNOWLEDGE` items flagged — 37 contradicted or dated, 8 unsourced/unfalsifiable, 3 confirmed-keep, 2 new coverage gaps.**

---

## Live app audit — `GOTCHAS`

`PromptStudio.html` lines 892–937 (44 cards). Cards not listed below survive today's corpus unchanged.

| Card (`t` / myth) | Problem | Correction source | Severity |
|---|---|---|---|
| **Wan** — *"Wan 2.2 reliably obeys camera instructions."* → r: *"…keep ONE simple command"* | The remedy text is fine, but the card's family inherits K1: the app's Wan guidance elsewhere hangs on the unsupported 45°/orbit rule | `wan22.md` *Contradicts* #1 · #43 | Medium |
| **Wan** — *"Wan I2V prompts should describe the whole scene."* → r: *"I2V wants ≤100 words of MOTION-ONLY content"* | ≤100 **words** is the EN rewriter; the ZH rewriter says ≤100 **characters** | `system_prompt.py` · #K4 | Medium |
| **Wan** — *"Wan 3.0 is out."* → r: *"…the newest open release is Wan2.2-Animate-2"* | Still true, but **Wan-Dancer-14B (Jul 2026) is newer than the card implies is possible** and the Animate-2 two-field rule needs its third field: DiffSynth also takes an `animate2_prompt_ref` caption of the *driving* video | `wan22.md` item 3 | Low |
| **H3** — *"Reference tags match the slots you plug media into."* → r: *"…eats both a file slot and the 3-audio budget"* | The arrival-order and gap-closing mechanics are now `[OFFICIAL]` (code-verified) — **upgrade the grade**. But "a file slot" implies the 12-file cap, which does not exist locally | node file · #50, #52 | Medium |
| **H3** — *"Self-hosting unlocks 2K and longer clips."* → r: *"Local weights are 768p and the same 15s cap."* | Correct, and worth strengthening: **ComfyUI's own H3 page headline says "up to 2K resolution … about 15 seconds"**, so the student's confusion comes from official docs | docs page · #K15 | Low |
| **H3** — *"You can pack unlimited action into 15 seconds."* | Beat budget verified live and unchanged (`SKILL.cn.md`, per 1E). Keep | `minimax-h3.md` item 5 (not re-fetched) | — |
| **Z-Image** — *"Z-Image-Edit is available."* → r: *"The blog claims it; the model zoo says "To be released" — for 9 months, with no maintainer replies."* | Zoo table verified. Two fixes: the contradiction is **also inside the README**, and "no maintainer replies" rests on an issue nobody could re-check this sweep | #30, #37 | Medium |
| **Z-Image** — *"'Long detailed prompts' means 600-1000 words."* → r: *"The default cap is 512 TOKENS…"* | Correct and now staff-sourced with the exact remedy (`max_sequence_length=1024`) and conversion (0.75 words/token). **Add the remedy to the card** | #34 | — (additive) |
| **SCAIL-2** — *"Identity errors mean the prompt needs work."* → r: *"Identity is a mask/reference lever, not a prose lever. Fix the masks and drive quality first; the paper never even ablates prompts."* | Over-general on one axis: **background** drift is the one failure where a detailed first-frame description partially worked where masks and workflow changes failed | `scail2.md` *Contradicts* #8 | Medium |
| **SCAIL-2** — *"Write "replace the dancer with my character"."* → r: *"…edit verbs (replace/swap/mask) are officially banned."* | Correct, and the official ban list is wider (`the task is`, `Gemini`, `editing software`, the prompt-generation process) | #5 | Low |
| **LTX** — *"LTX never cuts and caps at 150 words."* → r: *"True for 2.3. LTX-2.5 has native multi-shot with named cuts, and its current docs replaced the cap with "4-8 descriptive sentences"."* | The 2.5 half is verified. The **"True for 2.3" half is wrong**: 150 comes from the LTXV-0.9 enhancer node, not from any 2.3 guidance — the 2.3-era figure on record is the GitHub README's "Keep within 200 words" | `ltx23.md` *Contradicts* #3/#4 · #12 | **High** |
| **LTX** — *"My LTX negative prompt is cleaning up the output."* → r: *"On the default distilled path (CFG 1) the negative pass is skipped entirely — official templates even ship a decorative negative."* | Template negative verified present (#18) and dual-CFG at 1 is official. But **the inertness itself is `[SPECULATION]`** — no source states it and nobody has run the A/B. The card asserts it flatly | `ltx23.md` NAG section (explicitly `[SPECULATION]`) | **High — a confident claim on a speculative mechanism** |
| **LTX** (missing card) | No card warns that the shipped ComfyUI template runs the enhancer **on**, or that Comfy Org's own tutorial says the opposite | #15, #16 | **High — the sweep's top teaching correction has no card** |
| **Krea 2** — *"CFG 0 works the same everywhere for Krea 2 Turbo."* → r: *"Use CFG 1.0 in ComfyUI; 0.0 only in Krea's own CLI/diffusers."* | The official Turbo card's diffusers snippet is `guidance_scale=3.5`, not 0.0 | #57, ruling #9 | **High** |
| **Krea 2** — *"The built-in prompt enhancer helps character sheets."* → r: *"It defaults ON and is trained to maximize visual DIVERSITY"* | Default-ON verified. The "trained to maximize diversity" claim is unsourced; the documented risk is different — the enhancer can return an **ethics refusal** that is then encoded as your prompt | #55; `krea-character-art.md` item 6 | Medium |
| **Krea 2** (missing card) | No card carries the **512-conditioning-position ceiling**, the reference-image token cost (`(h/32)·(w/32)+2`, ≈1026 for 1 MP — a single 1 MP reference already exceeds the budget), or the `ConditioningZeroOut`-with-`_cfg_pp` grain trap | `krea-character-art.md` items 3, B; *Contradicts* #2 · #54 | **High** |
| **Weights** — *"(word:1.3) emphasis works everywhere."* → r: *"On Qwen3-encoder models (Krea 2, klein, Z-Image) scaling one token shoves the WHOLE conditioning (destructive past 1.2)."* | Wrong mechanism. On those models the syntax is **literal text** — nothing is scaled at all. Add: on **H3** it is architecturally inert (`disable_weights=True`), and `{a\|b}` on H3 is eaten by ComfyUI's wildcard expander before the model sees it | `z-image.md` item 15; `krea-character-art.md` *Contradicts* #5; `minimax-h3.md` item 3 | **High** |
| **Negatives** — *"Negative prompts work everywhere."* → r: lists the CFG-free set | Add **SCAIL-2 to the *active* side** (CFG 5.0 default, real `negative` input) and note that klein **Base** is live-but-unreachable through diffusers | #7, #9, #27 | Medium |
| **ComfyUI** — *"Negative-looking output means the model is bad."* → r: lists black-frame causes | Remove/replace *"wrong encoder pairing"* as a black-image cause for klein: the verified symptom is a `mat1/mat2` matmul mismatch | `flux.md` item 7 · #K32 | Medium |
| **SDXL** — *"One prompt style fits all SDXL checkpoints."* → r: *"Five incompatible official schemes… Illustrious de-biased no-tags"* | "Illustrious de-biased no-tags" is right that no Onoma card states a prefix — but `KNOWLEDGE` says the opposite in the same app. Pick one. Also **Pony V6's card explicitly endorses natural language**, which the card's tag-only framing hides | #61; verified Pony card | Medium |
| **SDXL** (missing card) | No card on **licences**: NoobAI bans commercialization outright, Pony V6 bans monetized inference. Students building portfolios need this before the sampler advice | verified #61 (NoobAI + Pony cards) | **High — new** |
| **Length** — *"Longer prompts are always better."* → r: *"In images, long prompts don't raise quality — they collapse seed diversity."* | Holds, and gains staff support (Cxxs on Turbo's low diversity; the 512/1024 remedy). Keep | #34, #35 | — |

**Count: 22 of 44 `GOTCHAS` cards need edits; 5 whole cards are missing (LTX enhancer default, Krea 2 length ceiling, SDXL licences, H3 local caps, Wan camera-rule retraction).**

---

## Live app audit — `TARGETS` & validators

| Target / line | App text | Verdict | Source |
|---|---|---|---|
| `TARGETS.wan.system` (≈line 541) | *"ONE camera behavior only, placed FIRST in its clause, using official vocabulary — say "arc shot" (never "orbit"), **keep arcs under 45 degrees**."* | **UNSUPPORTED — remove the number and the orbit ban.** No degree figure exists on the Alibaba guide (rev. 2026-09-02) or in `system_prompt.py`; the guide's own 环绕运镜 exemplar is a successful ~180° orbit in the Wan-2.2 section. Keep the defensible half: one camera move per short clip | #43 |
| `TARGETS.wan.system` | *"write "fixed camera, no camera movement" / "**固定机位**，镜头不移动""* | **Wrong token.** The vendor's word is **`固定镜头`** (「通过"固定镜头"来强调」). Keep `固定机位` / `镜头位置保持不动` as accepted synonyms, emit `固定镜头` | #42 |
| `TARGETS.wan.system` | *"write English (35-120 words)"* / ZH 60-200 characters | **Under-specified.** The EN rewriter caps aesthetic tokens at `不超过4种` while ZH has no cap — but the vendor's own EN exemplar 2 uses **ten**. Teach the asymmetry, not a hard 4 | #39, #40 |
| `TARGETS.wanI2V` (≈line 561) | *"≤100 words"* framing | Correct for English; the ZH rewriter's own limit is 100 **characters** | #K4 |
| `TARGETS.ltx.system` (≈line 588) | *"Cap at **150 words** (official enhancer ceiling; LTX-2.5 style is 4-8 descriptive sentences)."* | **STALE.** The 150 figure is the LTXV-0.9 enhancer's, a component 2.5 does not use, and no word cap exists in current guidance. Split by version: 2.3 keeps a word band; 2.5 gets **4–8 sentences** single-shot, up to ~16 for multishot/screenplay | #12 |
| `TARGETS.ltx.system` | *"Negative prompts do not exist on the distilled path (CFG 1 skips them)"* | **OVERSTATED.** CFG 1.0 on the distilled path is `[OFFICIAL]`; the *inertness* is `[SPECULATION]` and untested. Three official negatives exist. Soften to "never required; the shipped template's negative has no CFG branch to act on at CFG 1 — untested" | #18, `ltx23.md` NAG section |
| `TARGETS.ltx.system` | *"No cuts or timestamps for 2.3; simple named cuts are allowed only if the user asked and is on 2.5."* | **CONFIRMED and well-scoped.** Add the four official per-cut requirements (name the transition, re-establish the shot, re-identify subjects, state audio continuity) and the 2–4-shot band | #13 |
| `TARGETS.ltx.system` | *"ONE flowing present-tense paragraph"* as an unconditional rule | **Needs scoping.** The guide sanctions a screenplay form for dialogue/multi-beat scenes ("scene headers, character cues, and quoted dialogue") | #12, #14 |
| `TARGETS.ltx` (missing) | No instruction about the enhancer's shipped state | **Add:** the official ComfyUI T2V template ships `prompt_enhance = true`; the prompt will be rewritten unless toggled off | #15, #16 |
| `TARGETS.sdxlAnime.system` (≈line 715) | *"For Illustrious the user swaps that ladder for "masterpiece, best quality" — **mention nothing about this in the output; default to the Pony V6 ladder**."* | **MISLABELLED as official + wrong default.** No Onoma card states a prefix (that scheme is a 2025 third-party guide), and five sourced recipes now exist. The dialect must be a **family selector**, not a Pony default with a footnote | `sdxl.md` gap list #1/#2 · #61 |
| `TARGETS.sdxlAnime.system` | *"Output canonical English Danbooru-style tags… **NO prose sentences**"* | **Contradicted by Pony V6's own card**, which the same rule targets: *"This model is trained on combination of natural language prompts and tags and is capable of understanding both, so describing intended result using normal language works in most cases."* The tag-only rule is right for **Animagine** ("natural language input may not be effective"), wrong for Pony V6 | verified Pony + Animagine cards (**my finding — not in `sdxl.md`**) |
| `TARGETS.sdxlAnime.system` | *"**15-35 tags** total"* | **UNSUPPORTED.** No anime card states a tag count. Animagine states a structure, NoobAI a caption order, Illustrious an order. Replace with per-family order templates | `sdxl.md` gap list #7 |
| `TARGETS.sdxlAnime.system` | Hardcoded negative `lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, …` | **Nobody's official list — but narrower than 1B says.** It is close to Animagine's, and the two tokens 1B calls wrong (`missing fingers`, `extra digit`) **match Animagine's own widget metadata exactly**, while §3 of the same card uses the singular/plural the other way. Two variants coexist on one card. It is still **not** NoobAI's list and it contradicts Pony V6's "designed to not need negative prompts" | verified Animagine card |
| Validator `PromptStudio.html:1257-1258` | Errors when `score_9` or `source_*` is missing, for every anime checkpoint | **Wrong for four of five families.** Gate on a family selector | `sdxl.md` gap list #1 |
| Validator (missing) | No CLIP-skip field on `sdxlAnime` | Pony V6's one **hard** requirement ("clip skip 2 … otherwise you will be getting low quality blobs") is unenforceable | verified Pony card |
| `WF` note `PromptStudio.html:2157` | *"NoobAI v-pred checkpoints ban Karras; adjust per your checkpoint card"* | **Under-specified on five counts:** name the replacement (Euler, or DDIM), require `prediction_type=v_prediction` **and** `rescale_betas_zero_snr=True`, name CFG-Rescale ≈0.2, extend the ban to Illustrious v3.0-vpred and v3.5-vpred, and drop CFG to 4–5 | #61 · `sdxl.md` gap list #6 |
| `WF_MAP` `PromptStudio.html:1713` | `sdxl` and `sdxlAnime` both map to one `sdxl` template | One template cannot carry a Karras requirement (RealVis) and a Karras ban (NoobAI v-pred), a baked-in VAE and a CLIP-skip-2 loader | `sdxl.md` gap list #8 |
| `SDXL_NEG` `PromptStudio.html:526` | Generic 13-token list on the photoreal target | **Invents a consensus.** RealVis publishes a shorter differently-shaped list with weighting parens; Juggernaut publishes **no** standing negative and its author says *"Start with no negative, and add afterwards the Stuff you don´t wanna see"* | #58 · `sdxl.md` gap list #4 |
| `TARGETS.sdxl.system` (≈line 695) | *"Keep it under ~60 words (≈75 CLIP tokens)"* | Defensible for Juggernaut/Ragnarok (author-stated, verified) — but the **mechanism must not be taught as "ignored"**, and the figure has no card behind it for Juggernaut XI/XII | #58, #59, ruling #7 |
| `TARGETS.krea2.system` (≈line 800) | *"ONE prose paragraph, **80-140 words**"* · *"NEVER use (word:1.2) emphasis — it is **broken** on Krea 2"* · *"NO negative prompt (Turbo is CFG-free)"* | Three fixes: (a) 80-140 is craft, not capacity — the hard ceiling is **512 conditioning positions ≈2,850 chars**, and it should be an error, not silence; (b) weights are **literal text**, not broken; (c) the official Turbo card's own diffusers call uses `guidance_scale=3.5`, so "CFG-free" needs a route clause | #54, #57 · `krea-character-art.md` *Contradicts* #5, #8 |
| `TARGETS.krea2.system` (missing) | No mention of the encoder's own nine-slot descriptor | The encoder prepends *"Describe the image by detailing the color, shape, size, texture, quantity, text, spatial relationships of the objects and background:"* — a better-evidenced ordering rule than the app's medium-first heuristic | #54 |
| `TARGETS.zimage.system` (≈line 753) | *"Length: 80-300 English words or 120-500 Chinese characters. NEVER exceed ~350 words"* | Quantify with staff figures: 512 tokens ≈ **380 English words** at 0.75 w/tok; warn at 480 tokens / 360 words / ~450 Han chars; offer the exact remedy `max_sequence_length=1024` | #34 |
| `TARGETS.zimage.system` | *"NO negative prompt (Turbo has no CFG)"* — no Base branch | The target conflates Turbo and Base. Base **recommends** negatives, runs CFG 3–5 at 28–50 steps, and exposes `cfg_normalization`. The app's own `KNOWLEDGE` knows this; the target does not | #31 |
| `TARGETS.zimage.system` | *"No weighting syntax."* | Correct — and the reason is that the stock tokenizer treats `(word:1.2)` as literal text, not that it is destructive | `z-image.md` item 15 |
| `TARGETS.minimax` / `minimaxRef` (≈lines 603/627) | Reference caps stated as *"9 images + 3 videos 15s total + 3 audio 15s total, **12 files max**"* | The 12-total is a hosted rule. Local enforceable caps are **9/3/3/3 with no total**, and `<Audio j>` can reach 6 | #52 |
| `TARGETS.scail2` (≈line 649) | Prompt-inert framing inherited from `KNOWLEDGE` | Retire "prompt-inert". Target 90–140 words for **both** modes, hard-cap 512 UMT5 tokens, require concrete background nouns in Replacement mode, and stop telling users SCAIL-2 has no negative path | #2, #5, #7, #9 |
| Resolution presets `PromptStudio.html:1905-1911` | `ltx: [[960,544],[1280,720],[544,960]]` | All are `%32 == 0` ✓. But no preset enforces `num_frames % 8 == 1`, and no SCAIL preset enforces `%32` (the app has no scail entry) | `ltx23.md` item 8 |

---

## Process defects

1. **#62 — Non-contiguous text presented as one verbatim block.** `sdxl.md`'s Ragnarok fenced block
   concatenates the *Settings* section, the *Prompting Tips* section, and one sentence from the
   *Metallic Typography (Text)* example ("Make sure you put the text at the front of the prompt not at
   the end.") into a single quotation with no elision markers. Every line is real; the block is not.
2. **#63 — Quotes hardened inside quotation marks.** `scail2.md` renders the card's "should be … divisible
   by 32 **if using other resolutions**" as "**must** both be divisible by 32", and inserts "**and
   replacement**" into a sentence that names only pose-driven. Two `[OFFICIAL]` validator rules rest on
   the altered versions (#3, #4).
3. **#64 — Mirror grading is inconsistent within one file.** `sdxl.md` grades a SeaArt mirror of
   Illustrious release notes `[OFFICIAL]` "text via mirror", a `neverbiasu.github.io` reprint
   `[CREATOR]` words via `[LORE]` channel, and an `LyliaEngine` mirror of the Pony V6 Civitai card plain
   `[CREATOR]`. Three different treatments of the same evidence shape. The Pony mirror is also
   base-modelled on `Bakanayatsu/Pony-Diffusion-V6-XL-for-Anime`, i.e. not even a mirror of the original
   checkpoint's repo.
4. **#65 — Label inflation beyond the plan's vocabulary.** The plan (operating rule 2) fixes seven labels.
   Today's files introduce **`[CREATOR]`, `[OFFICIAL-3P]`, `[OFFICIAL/PAPER]`, `[OFFICIAL/MAINTAINER]`,
   `[TESTED/PAPER]`, `[CREATOR-DIALECT]`, `[CREATOR/TESTED]`, `[CREATOR-SPECULATION]`,
   `[OFFICIAL-PATTERN]`, `[LORE-PATTERN]`, `[TESTED-PATTERN]`, `[STAFF-IMPLIED]`,
   `[LORE — single unverifiable account]`** — thirteen new grades across the sweep. `[OFFICIAL-3P]` is the
   worst offender: in `minimax-h3.md` it is applied to a **third-party LoRA repo's README**
   (`lightx2v/…-Prompter-LoRA-Omni`) and then used to source a Ref2VA aspect-ratio restriction and a
   12-asset cap that the vendor does not state. A third party's README is `[LORE]` or at best
   `[USER-VERIFIED]`; putting "OFFICIAL" in the token invites exactly the mis-fold 1E itself warns about.
   `[CREATOR]` is defensible and should be added to the plan properly rather than smuggled in.
5. **#66 — Absence and tooling claims stated absolutely.** Four files assert `api.github.com` returns
   empty "for every request"; one asserts the Krea 2 raw cards are unreachable because the repo is gated.
   Both are false as written (Method section; #56). The plan's rule 3 ("absence claims are scoped")
   applies to *tooling* claims too.
6. **#67 — Test-kit defect: the T7 v-pred arm cannot test what it claims.**
   `T7-noobai-vpred-euler-karras.json` / `-normal.json` are derived from `image_sdxl_simple.json` with
   only `CheckpointLoaderSimple`, `CLIPTextEncode`×2 and `KSampler`. There is **no
   `ModelSamplingDiscrete` (v_prediction) node and no CFG-Rescale / dynamic-CFG node** — the two things
   `sdxl.md`'s own v-pred validator says are *required* ("error if either is missing"). The test as
   shipped compares samplers on a v-pred checkpoint running without the v-pred plumbing the same sweep
   mandates. Add a `ModelSamplingDiscrete` v_prediction node (and note that this breaks the
   "node ids byte-identical" guarantee, which is why it was probably skipped — say so).
7. **#68 — Test-kit defect: the Z-Image "negative = positive" arm cancels rather than tests.**
   `T2-zimage-*-negeqpos.json` bypasses `ConditioningZeroOut` (`mode: 4`) so the negative branch receives
   the *positive* conditioning. At CFG 4 that gives `pred = pos + 4·(pos − pos) = pos`, i.e. an
   effectively unguided image — a real and interesting result, but not "does the negative do anything";
   it measures "is the uncond branch computed at all". The protocol should say which of the two questions
   each arm answers.
8. **#69 — Counts asserted without counting.** Three: "two of the three official 2.5 sample prompts"
   (there are two, one qualifies, #14); "ZH exemplars 9–11 / EN 3–4" (ZH 9/11/7, EN 4/**10**/5, #40);
   the template grep claim (#17). All three are load-bearing for a validator rule or a doctrine change.
9. **#70 — A broken URL in a body citation.** `ltx23.md` item 5 cites
   `raw.githubusercontent.com/Comfy-Org/workflow_templates/**blob**/main/templates/video_ltx2_5_t2v.json`,
   which 404s. The Sources block has the working form.
10. **#71 — Internal date inconsistencies inside one file.** `new-models.md` dates LTX-2.5 to
    **2026-07-23** in *Retired or superseded* while its own template table and closed-tier register put
    the LTX-2.5 cohort at **2026-08-11** and FLUX 3's announcement at 2026-07-23 — a copy error. The same
    file gives ComfyUI **v0.33.4** two different dates (2026-08-24 for Wan 3.0, 2026-08-20 for
    kling-v2). `sdxl.md`'s recipe table dates the Juggernaut XI HF card "lastModified 2026-05-08" and the
    Ragnarok guide "2025-05-08" — same day-month, one year apart; the guide's date is verified 2025, so
    check the card's.
11. **#72 — 2D mis-credits itself with a 1A finding.** See ruling #2. The SCAIL-2 MIT tag and the
    Comfy-Org repackage are both already in `scail2.md`.
12. **#73 — Missing access dates.** Mostly good, but `wan22.md`'s Chinese vocabulary table cites `[CM]`
    (community) rows with **no URL and no access date at all** — `固定机位 / 跟拍 / 一镜到底 / 后拉揭示`,
    `侧逆光 / 轮廓光 / 窗侧柔光 / 阴天漫射光 / 烛火摇曳`, and the `_cross` texture list. They are correctly
    graded `[LORE]`, but "community, no vendor attestation" is not a citation.
13. **#74 — Role evidence: good, with two gaps.** 2A's method (HF org badge + `Organizations` block +
    `/activity/community` + CivArchive `Author`) is the best in the corpus and I verified it end-to-end
    for KandooAI (#58) and Cxxs/QJerry (#34/#35). Two gaps: `art-alex`'s dates are given as "~2026-08-24"
    / "~2026-08-25" because the detail pages cache inconsistently — acceptable but flag them as
    approximate wherever the digest reuses them; and row 14 is graded `[STAFF-IMPLIED]` for what is a
    **question**, not a statement ("curious as to why you chose to train on Turbo…"). A staff question is
    evidence of a staff *expectation*, which is weaker still. Keep it at `[LORE]`.
14. **#75 — Coverage gap nobody registered: Juggernaut Z.** RunDiffusion's own site links a
    "Juggernaut Z Prompt Guide" and "Juggernaut Z Is Now live" (both Aug 2026), and `RunDiffusion/Juggernaut-Z-Image`
    appears in 1B's own HF search results. `sdxl.md` stops at XIII Ragnarok and its nothing-found register
    does not mention Z. The newest checkpoint in the family is unexamined.

---

## Items the synthesis agent must NOT fold in

Listed plainly. Each is UNSUPPORTED or OVERSTATED above.

1. **SCAIL-2 "H and W *must* be divisible by 32"** as an `[OFFICIAL]` hard rule. The card says *should*,
   with a qualifier. Ship `%32` as a **recommendation with a TESTED mechanism**, not as a card quote.
2. **SCAIL-2 "pose-driven *and replacement* performs better at 704p."** The words "and replacement" are
   not in the source. Do not carry the app's "704p recommended for Replacement" on this citation.
3. **SCAIL-2 "`prompt_examples.txt` is empty/absent so the enhancer runs with `(No examples provided.)`"**
   If the file is absent the enhancer raises `FileNotFoundError`. Rewrite validator change #13.
4. **"`api.github.com` returns an empty body for every request in this environment."** Endpoint-specific.
   Do not put the absolute in the digest's tooling notes.
5. **"Krea 2's raw model cards are unreachable because the repos are licence-gated."** They fetch. Lift
   the "un-refreshed" caveat and harvest the 36 official prompt+image pairs.
6. **Wan "orbit wider than 45° risks spatial distortion" / "orbit is the documented failure word."**
   No first-party source on any surface searched across two sweeps. Remove from `KNOWLEDGE` and from
   `TARGETS.wan.system`; do not downgrade-and-keep the number.
7. **Wan "the EN exemplars carry 3–4 aesthetic tokens."** They carry 4, 10 and 5. Do not build the
   English aesthetic-token validator on a band the vendor's own exemplar breaks; state the `不超过4种`
   instruction *and* that the vendor's exemplar violates it.
8. **Wan-Dancer "headline Prompt Alignment 9.03"** and **"~28 GB bf16."** Neither exists on the card,
   the abstract or the project page. Delete both from `KNOWLEDGE`.
9. **LTX "two of the three official 2.5 sample prompts use sluglines."** Two prompts, one slugline. Cite
   the guide's "Longer / Screenplay-Style" section instead — it says what you want, officially.
10. **LTX "the enhancer was ON by default Aug 11–20, 2026."** No source dates any change. It is on
    **today**. Rewrite as current state.
11. **LTX "negative prompts are inert on the distilled path"** stated as fact in `GOTCHAS` and
    `TARGETS.ltx`. `[SPECULATION]` until the A/B in `test-kit` T2-LTX is run.
12. **LTX "≤150 words is true for 2.3."** The 150 figure is the LTXV-0.9 enhancer node's, not 2.3
    guidance. If a 2.3 word figure is needed, the only sourced one is the GitHub README's 200.
13. **FLUX "wrong encoder = black images."** Retire. The symptom is
    `mat1 and mat2 shapes cannot be multiplied`.
14. **FLUX "the order-matters demonstration is paired with images."** Text only.
15. **The BFL multi-language sentence attributed to `prompting_unified_technical`.** Not on that page.
    Find the right page before citing.
16. **arXiv 2606.03715 "matched full prose embeddings."** 65% vs 70–90% is "close to", not "matched", and
    the paper singles out FLUX.2 as still context-sensitive. Also **never state this rule without the
    U-Net scope limit** (SDXL 4%, SD 2.1 0.2%) while the app ships an SDXL target.
17. **"four independent vendor guides converge on order-based emphasis."** Uncounted. One is verified.
18. **H3 "12 files max"** as a local validator rule. Local caps are 9/3/3/3, no total.
19. **H3 "audio cannot be sent without at least one image or video."** Not in the schema, not in the docs.
20. **H3 "`nodes_minimax_h3.py` contains only four nodes"** used as evidence about what H3 can do.
    `MiniMaxH3AddGuide` is a fifth, documented node that is not in that file.
21. **`[OFFICIAL-3P]`-graded claims from third-party LoRA READMEs** — specifically the Ref2VA
    aspect-ratio restriction (`Ref2AV supports 16:9 and 9:16`) and the 12-total asset cap. Both are
    `[LORE]`. 1E already says "flag, do not enforce" for the first; apply the same to the second.
22. **Krea 2 "no cap exists anywhere in the ComfyUI/Krea source."** `encoder.py` sets `max_length = 512`.
23. **Krea 2 "(word:1.2) is actively destructive"** and the Z-Image/klein version of the same claim.
    The syntax is **literal text** in stock encode.
24. **Krea 2 "Community License: roughly under $1M revenue and under 50 seats."** Unsourced — nobody
    opened `LICENSE.pdf`. Either open it or state the thresholds as unverified.
25. **Krea 2 "CFG-free Turbo"** without a route clause. The official Turbo card's diffusers snippet is
    `guidance_scale=3.5`. Record the conflict; do not pick a side yet.
26. **Krea 2 "prompt_enhance is RL-trained to INCREASE diversity."** No source in the corpus.
27. **Z-Image "the vendor's worked example uses 1280×720."** It is `height=1280, width=720`.
28. **Z-Image "the blog claims Edit is released"** framed as blog-vs-repo. The **repo README** also
    showcases Edit.
29. **Illustrious "masterpiece, best quality" as its quality prefix** on either app surface. No Onoma
    card states any prefix; downgrade to `[LORE]` in both places and stop contradicting yourself.
30. **`sdxlAnime`'s "NO prose sentences" as a universal anime rule.** Pony V6's card explicitly endorses
    natural language. Scope the rule to Animagine (and to NoobAI's caption order).
31. **`sdxlAnime`'s "15-35 tags."** No card states a tag count.
32. **KandooAI's *mechanism*** ("anything beyond 75 tokens is ignored by the model"). Keep the advice,
    drop the reason — ComfyUI chunks and concatenates.
33. **"Illustrious XL v2 … every top Civitai anime checkpoint builds on it"** as fact, while every agent
    reports civitai.com unreachable. Either scope it or cut it.
34. **2D's claim that it handed 1A the MIT licence tag and the Comfy-Org repackage.** 1A had both.

**Things that ARE safe and are the sweep's strongest confirmed claims** (fold with confidence):
the LTX enhancer default trio (#15/#16); the MiniMax H3 licence block, all ten clauses (#48); the
`Flux2KleinPipeline` hardcoded-`""` negative and its `is_distilled` mechanics (#27); arXiv 2606.03715's
verbatim figures *with* their scope limits (#28); the Wan `system_prompt.py` ZH/EN divergences (#38–#41);
the Krea 2 `encoder.py` nine-slot descriptor and 512-position ceiling (#54); the Z-Image staff 512→1024
remedy (#34); the H3 node constants and 17k+5 grid (#50); the nine Krea LoRA triggers (#55); the SCAIL-2
enhancer prompts and mask mechanics (#5/#9); the NoobAI v-pred and Animagine recipes (#61); and the
36-prompt Krea corpus at a pinned commit (#57).

---

## Sources

All accessed **2026-09-03**.

**Re-fetched and verified**
- `https://api.github.com/repos/zai-org/SCAIL-2/branches`
- `https://raw.githubusercontent.com/zai-org/SCAIL-2/wan-scail2/README.md`
- `https://raw.githubusercontent.com/zai-org/SCAIL-2/wan-scail2/prompt_enhancer.py`
- `https://raw.githubusercontent.com/zai-org/SCAIL-2/wan-scail2/wan/configs/shared_config.py`
- `https://raw.githubusercontent.com/zai-org/SCAIL-2/wan-scail2/LICENSE`
- `https://raw.githubusercontent.com/Comfy-Org/ComfyUI/master/comfy_extras/nodes_scail.py`
- `https://docs.comfy.org/tutorials/video/zai/scail2`
- `https://docs.ltx.io/open-source-model/usage-guides/prompting-guide.md`
- `https://docs.ltx.io/open-source-model/getting-started/system-requirements.md`
- `https://raw.githubusercontent.com/Comfy-Org/workflow_templates/main/templates/video_ltx2_5_t2v.json`
- `https://docs.comfy.org/tutorials/video/ltx/ltx-2-5`
- `https://docs.bfl.ai/guides/prompting_unified_building`
- `https://docs.bfl.ai/guides/prompting_unified_technical`
- `https://raw.githubusercontent.com/huggingface/diffusers/main/src/diffusers/pipelines/flux2/pipeline_flux2_klein.py`
- `https://arxiv.org/html/2606.03715v1` (and `https://arxiv.org/abs/2606.03715`, title only — PDF body empty)
- `https://raw.githubusercontent.com/Tongyi-MAI/Z-Image/main/README.md`
- `https://huggingface.co/Tongyi-MAI/Z-Image-Turbo/discussions/8`
- `https://raw.githubusercontent.com/Wan-Video/Wan2.2/main/wan/utils/system_prompt.py`
- `https://help.aliyun.com/zh/model-studio/text-to-video-prompt` (`meta-last-modified: 2026-09-02T00:46:00+08:00`)
- `https://huggingface.co/Wan-AI/Wan-Dancer-14B/raw/main/README.md`
- `https://huggingface.co/MiniMaxAI/MiniMax-H3/raw/main/LICENSE`
- `https://raw.githubusercontent.com/Comfy-Org/ComfyUI/master/comfy_extras/nodes_minimax_h3.py`
- `https://docs.comfy.org/tutorials/video/minimax/minimax-h3`
- `https://huggingface.co/Laxhar/noobai-XL-Vpred-1.0/raw/main/README.md`
- `https://huggingface.co/LyliaEngine/Pony_Diffusion_V6_XL/raw/main/README.md`
- `https://huggingface.co/cagliostrolab/animagine-xl-4.0/raw/main/README.md`
- `https://www.rundiffusion.com/prompt-guide-for-juggernaut-xiii-ragnarok-by-rundiffusion` (published 2025-05-08)
- `https://raw.githubusercontent.com/krea-ai/krea-2/main/encoder.py`
- `https://docs.comfy.org/tutorials/image/krea/krea-2`
- `https://huggingface.co/krea/Krea-2-Turbo/raw/665ef38131535e3a1da1a86c6ff2261e70ba9a55/README.md`
- `https://civarchive.com/models/133005`

**Read locally (read-only)**
- `PromptStudio.html` — `TARGETS` (529–815), `KNOWLEDGE` (816–889), `GOTCHAS` (892–937), `ASK_SYSTEM`
  (939–), `SDXL_NEG` (526), validator (1256–1262), `WF_MAP` (1713), WF note (2157), resolution presets
  (1905–1911).
- `research/_addenda/test-kit/*.json` (4 files diffed programmatically) against
  `research/_addenda/comfy-templates/{image_qwen_image,image_z_image_turbo,video_wan2_2_5B_ti2v,image_sdxl_simple}.json`
  and `comfy-templates/INDEX.md`'s documented edit points.
- All twelve Wave-1/2 outputs, `## 2026-09 sweep` / `## 2026-09 register` sections in full.

**Attempted, blocked or not attempted**
- civitai.com, civitai.red, Reddit, Discord, web.archive.org — **not attempted** (standing refusals /
  briefed unreachable). No absence claim in this file depends on them.
- `platform.minimaxi.com/docs/guides/local-deploy-h3`, `design.minimaxi.com/h3`,
  `bbs.monster/thread-4183-1-1.html`, `comfylab.dev/blog/…/scail-2-…`,
  `raw…/Brobert-in-aus/scail-auto-extend/main/README.md`, `github.com/Comfy-Org/ComfyUI/issues/14782`,
  `github.com/fblissjr/krea-explorations`, `docs.bfl.ai/flux_2/flux2_overview`,
  `raw…/Lightricks/LTX-2/main/packages/ltx-pipelines/src/ltx_pipelines/utils/constants.py`,
  `huggingface.co/Lightricks/LTX-2.5/discussions/34`, `arxiv.org/abs/2603.21937`,
  `docs.comfy.org/tutorials/video/bytedance/bernini-r` — **NOT RE-FETCHED** (budget). Claims resting on
  them are marked NOT RE-FETCHED in the table and are *not* endorsed by this file.
