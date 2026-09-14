# Significant new locally runnable models found

Research baseline: 2026-08-15. “New” is interpreted as major 2026 releases newer than the named baseline variants, not releases after the research date.

## LTX-2.5 [OFFICIAL]

LTX-2.5 supersedes 2.3 and is open-weight/local. Official docs say it uses a custom Gemma 4 12B text encoder, has stronger complex-prompt following, optional prompt enhancement, synchronized video/audio, auto-duration inferred from described events, EXR support, LoRA and IC-LoRA. This is significant enough for a class update because it changes both prompt understanding and duration semantics. [Official docs](https://docs.ltx.io/open-source-model/getting-started/overview), accessed 2026-08-15.

Prompt impact: describe the event needed rather than choosing duration independently; use enhancer for terse prompts and disable it to preserve exact wording.

## Qwen-Image 2.0 / 2.0-RL / Flash [OFFICIAL/PAPER; not verified local]

Qwen-Image 2.0 unifies generation and editing and has superseded 2512/2511 in current Alibaba endpoints. The 2.0-RL report claims improved aesthetics, adherence and editing on Qwen-Image-Bench; its 57.84 overall score is reported as +2.61 over base, with higher T2I/edit arena Elo. Qwen-Image-Flash addresses few-step generation. However, the official Qwen Hugging Face model list does not expose a Qwen-Image-2.0 weight repository in this research pass, and the official GitHub announcement does not provide a local checkpoint link. Treat the family as API/paper-only, not locally runnable, until an official weight card and license appear. [Official repository](https://github.com/QwenLM/Qwen-Image) · [Qwen model list](https://huggingface.co/Qwen/models) · [2.0 report](https://arxiv.org/abs/2605.10730) · [2.0-RL report](https://arxiv.org/abs/2606.27608) · [Flash report](https://arxiv.org/abs/2606.03746), accessed 2026-08-15.

## Qwen-Image 3.0 API notice [OFFICIAL, not confirmed local]

Alibaba documentation lists Qwen-Image 3.0 as of July 2026, but this research did not find a primary-source open-weight/local release. It should not be added to a “locally runnable” selector yet. [Alibaba API docs](https://help.aliyun.com/en/model-studio/qwen-image-generation-and-editing-api-reference), accessed 2026-08-15.

## FLUX 3 [OFFICIAL docs mention; local status unverified]

BFL's current prompting index mentions FLUX 3 video prompting, but no verified open-weight local release was established in this pass. Do not add it as locally runnable without model-card/license confirmation. [BFL prompting index](https://docs.bfl.ai/guides/prompting_summary), accessed 2026-08-15.

## Recommendation

Add LTX-2.5 immediately as a new local target. Keep Qwen-Image 2.0/2.0-RL/Flash, Qwen-Image 3.0 and FLUX 3 out of local selectors until official downloadable weights and licenses are confirmed.

---

## 2026-09 register (agent 2D, 2026-08-28 → 2026-09-03)

All access dates in this section are **2026-09-03** unless stated. The gate applied is the strict
one from the brief: a model is **local** only if (1) downloadable weights on HF/ModelScope with a
licence file, (2) a ComfyUI path (core nodes, Comfy-Org repackage, or a named wrapper) **or** an
official inference repo that runs on one consumer/prosumer GPU, and (3) an official model card or
README with prompt guidance — each with a URL. Everything else is in the closed-tier register.

**Headline:** **nothing cleared the local gate inside the 08-28 → 09-03 window.** Three independent
surfaces agree (HF `?search=` index, `Comfy-Org` repackage listing, docs.comfy.org changelog). The
window's real value is what the sweep found *outside* it: **ByteDance Bernini-R**, an Apache-2.0
Wan-2.2-based local model with **native ComfyUI core support, an official Comfy-Org repackage and an
official docs.comfy.org tutorial**, which the corpus does not mention anywhere — plus a backlog of
ten more Comfy-Org repackages in the same condition.

### Method and surface reliability — read before trusting any absence claim below

This matters more than usual this run because **several surfaces named in the brief are stale in this
environment, and one of them is stale in a way that silently manufactures false "nothing new"**.

- `[TESTED]` **The HF `?author=` and `?pipeline_tag=` listing indices are stale; `?search=` is
  fresh.** `?author=Wan-AI&sort=createdAt&direction=-1` returned a newest entry of
  **2025-11-12**, yet `Wan-AI/Wan-Dancer-14B` exists with `createdAt` **2026-07-10**
  (https://huggingface.co/api/models/Wan-AI/Wan-Dancer-14B). `?pipeline_tag=text-to-video` and
  `?pipeline_tag=image-to-video` both topped out at **2026-07-23**. Adding a `search=` term to the
  same query switched to a fresh index: `?author=Wan-AI&search=Wan&sort=createdAt` returned
  **2026-08-06**, and `?search=Qwen-Image&sort=createdAt` returned **2026-09-03**.
  **Standing rule: never make an HF absence claim from `?author=` or `?pipeline_tag=` alone — always
  add a `search=` term.** The 08-28 digest's "no new open weights since Wan-Animate-2 (08-07)" line
  is consistent with an `?author=`-shaped blind spot, and it did in fact miss two 08-07…08-13 items
  (see below).
- `[TESTED]` **GitHub HTML is stale or empty here.**
  `https://github.com/Comfy-Org/workflow_templates/commits/main` and `…/commits/main.atom` both
  returned **empty bodies**. `https://github.com/Comfy-Org/ComfyUI/releases` fetched but showed
  **v0.33.1 as "Latest"**, while docs.comfy.org's changelog lists **v0.34.2**. So the 08-28 plan
  note "GitHub HTML pages fetch" is only half true: they fetch, but the release/commit views are
  behind. `raw.githubusercontent.com` **does** work and is current.
- `[TESTED]` **docs.comfy.org is the freshest reliable surface** (clean markdown, current to
  v0.34.2 / 2026-08-27).
- `[TESTED]` **docs.comfy.org `sitemap.xml` `lastmod` is not a content-change signal.** Every
  `built-in-nodes/*` page carries an identical bulk timestamp `2026-08-31T10:16:22`, i.e. a
  site-wide regeneration. Do not read those as edits.
- `[SYNTHESIS]` **Chinese-language search for this window returned 2025 material.** A ZH query for
  late-Aug/early-Sep open-weight releases surfaced 魔搭 monthly reports and 速递 pages
  (`modelscope.csdn.net/68be68b0f2ddc335f538ef1e.html`, "8.30-9.06") whose contents are **2025**
  releases (HunyuanVideo-Foley, Wan2.2-S2V, HunyuanWorld-Voyager, MiniCPM-V 4.5). **None of these is
  a 2026 release and none is reported as new here.** Recorded so a future sweep does not mistake the
  same pages for window coverage. Machine-translation risk: high on those summaries.
- `[SYNTHESIS]` Not reached this run: ModelScope's own new-model listing (no working listing
  endpoint found; the per-model `api/v1/models/ORG/NAME` form needs a name you already have),
  Reddit and web.archive.org (structurally unreachable per the standing rule), blog.comfy.org
  (JavaScript-gated, returns only the Substack subscribe shell).

Fetch budget used: ~35 web fetches + 5 web searches.

### New local models

#### In-window (2026-08-28 → 2026-09-03): none found

`[SYNTHESIS]` No model released in the window clears the gate. Three converging checks:

1. **Newest Comfy-Org repackage is `Comfy-Org/MiniMax-Music-3`, `createdAt` 2026-08-08.**
   `https://huggingface.co/api/models?author=Comfy-Org&search=o&sort=createdAt&direction=-1&limit=15`.
   A Comfy-Org repackage repo is created when core support lands for a local model, so this is the
   tightest available proxy: **no local model gained a ComfyUI core path after 2026-08-08.**
2. **Newest ComfyUI release is v0.34.2, 2026-08-27** — one day *before* the window opens — and its
   only entries are a Gemini Omni 1.1 Flash partner node and an HEVC remux fix. No "New Open-Source
   Model Support" block exists after **v0.34.0 (2026-08-26)**. https://docs.comfy.org/changelog
3. **Newest entry in `templates/index.json` on `main` is dated 2026-08-11** (see next section).

Per-org HF checks (all with a `search=` term, so on the fresh index), newest official generative
release in each org as of 2026-09-03 — all pre-window:

| Org | Newest generative release | Date |
|---|---|---|
| `Wan-AI` | `Wan2.2-Animate-2-14B-Distilled-Diffusers` | 2026-08-06 |
| `Lightricks` | `LTX-2.5-22b-IC-LoRA-Pixel-Spatial-Upscaler` | 2026-08-11 |
| `ByteDance` | `Bernini-Diffusers-v2` | 2026-08-13 |
| `MiniMaxAI` | `MiniMax-Music3` | 2026-08-07 |
| `black-forest-labs` | `FLUX.2-small-decoder` | 2026-04-06 |
| `Qwen` (image family) | `Qwen-Image-Bench` | 2026-05-21 |
| `Tongyi-MAI` | `Z-Image` | 2026-01-23 |
| `krea` | `Krea-2-LoRA-softwatercolor` / `-neondrip` | 2026-06-23 |
| `tencent` (Hunyuan gen) | `HunyuanImage-3.0-Instruct-Distil` | 2026-01-25 |
| `zai-org` | `GLM-5.3` / `GLM-5.3-Flash` (LLM/VLM, not a generator) | 2026-08-25 |
| `stepfun-ai` | `Step-3.7-Flash-GGUF` (LLM/VLM) | 2026-05-28 |
| `Skywork` | `SkyReels-V3-A2V-19B` | 2026-01-19 |
| `Kwai-Kolors` | `MetaView` | 2026-07-11 |

#### Bernini-R — ByteDance, Apache-2.0 — **outside the window, and missing from the whole corpus**

**This is the run's biggest find and the register's one clear app candidate.** It is not a
window release (weights 2026-06-01, ComfyUI repackage 2026-06-09, official templates 2026-06-14),
but it appears in **no** file under `research/` and in no digest, so it is recorded here rather than
lost. It clears all three gate items.

*What it is.* `[OFFICIAL]` "**Bernini-R** is ByteDance's **renderer-only** Wan 2.2 model for
in-context image and video conditioning. It uses a set of conditioning streams (source video,
reference images, reference video) to guide generation. No LoRA training or fine-tuning required."
— https://docs.comfy.org/tutorials/video/bytedance/bernini-r. Six task types, verbatim from the same
page: **`t2v`** (text prompt), **`v2v`** (source video, restyling), **`rv2v`** (source video + ref
image(s) — relighting, subject insertion), **`r2v`** (reference image(s) only), **`img`** (source
image + text prompt), **`ads2v`** (source video + ref video, insert content). The upstream README
additionally names `t2i`, `i2i` and `mv2v` and says of the last: "For edits that need to change the
subject's motion (case 2 makes the person crouch down), the `mv2v` task type gives better results."
— https://huggingface.co/ByteDance/Bernini-R/raw/main/README.md.

*Gate item 1 — weights + licence.* `[OFFICIAL]` Upstream: https://huggingface.co/ByteDance/Bernini-R
(card front-matter `license: apache-2.0`; README closes "Apache License 2.0. See LICENSE."),
plus `ByteDance/Bernini-R-Diffusers` (2026-06-02) and `ByteDance/Bernini-R-1.3B-Diffusers`
(2026-06-08), all `license:apache-2.0` per
`https://huggingface.co/api/models?author=ByteDance&search=B&sort=createdAt&direction=-1`.

*Gate item 2 — ComfyUI path (core).* `[OFFICIAL]` "**ComfyUI now natively supports Bernini-R nodes.**
Make sure you have updated to the latest version of ComfyUI before starting." —
https://docs.comfy.org/tutorials/video/bytedance/bernini-r. Official repackage:
**https://huggingface.co/Comfy-Org/Bernini-R** (`createdAt` 2026-06-09, `license:apache-2.0`,
`base_model:ByteDance/Bernini-R`), single file **`wan2.2_bernini_r_fp16.safetensors`**. Core support
landed via **Comfy-Org/ComfyUI PR #14216, "feat: Add Bernini-R model support (Wan video)
(CORE-279)", authored by kijai** — https://github.com/Comfy-Org/ComfyUI/pull/14216 `[LORE]` (PR
title and author read from a search result listing, not from the PR page itself; verify before
quoting the PR).

*Full model file set, verbatim from the official tutorial's Model Installation block:*

```
ComfyUI/
├── models/
│   ├── text_encoders/
│   │   └── umt5_xxl_fp8_e4m3fn_scaled.safetensors
│   ├── vae/
│   │   └── Wan2_1_VAE_bf16.safetensors
│   ├── loras/
│   │   └── lightx2v_T2V_14B_cfg_step_distill_v2_lora_rank64_bf16.safetensors
│   ├── diffusion_models/
│   │   └── wan2.2_bernini_r_fp16.safetensors
```

Note the **`lightx2v` cfg-step-distill LoRA is part of the official recipe** — so the shipped
ComfyUI path is a **distilled, low-CFG** configuration, which is exactly the regime where our corpus
says negative prompts go inert. That is a testable prediction, not a finding.

*Gate item 3 — official prompt guidance.* `[OFFICIAL]` Same tutorial: "**In the prompt, use
`image0`, `image1`, … to reference each image.** Not needed for **Image Editing**: that task uses
`source_image` instead." and, for video: "Each batched image becomes its own in-context token.
Mention `image0`, `image1`, … in the prompt if references play different roles."

*VRAM class.* `[OFFICIAL]` The official template declares `"size": 38762079846, "vram":
38762079846` — **≈38.8 GB / 36.1 GiB** for the fp16 path
(`templates/index.json`, entry `video_bernini_r_video_editing`,
https://raw.githubusercontent.com/Comfy-Org/workflow_templates/main/templates/index.json).
The upstream README's reference environment is an **NVIDIA H100**, and its video examples are all
`torchrun --nproc-per-node 8 … --ulysses 8`; only `t2i`/`i2i` are shown single-GPU. A third-party
wrapper claims "**Runs in 24GB with fp8**" (https://github.com/neuregex/ComfyUI-BerniniR) `[LORE]` —
**unverified, and the single most useful thing to test before teaching this model.** Practical class
answer for now: **treat it as a 24 GB-with-quantisation / 40 GB-native model**, i.e. the same tier
as Wan 2.2 A14B, which is unsurprising since it *is* Wan 2.2 A14B plus a trained renderer.

*One verbatim official prompt example* — from the repo's own `t2v` test case,
https://raw.githubusercontent.com/bytedance/Bernini/master/assets/testcases/t2v/t2v.json `[OFFICIAL]`:

```
Day time, side lighting, medium shot, center composition. A large, fluffy white polar bear sits upright on a snowbank, holding a brown wooden acoustic guitar. The bear's thick furry right paw continuously strums the metal strings up and down, while its heavy body sways side to side. The bear's dark black nose twitches, and its mouth is slightly open as it moves its head. Behind the polar bear, white snowflakes gently drift downward across a vast icy landscape under a bright, deep blue sky. Sunlight casts crisp shadows on the snowy ground, illuminating the bear's thick fur and the polished surface of the guitar.
```

**Read the first sentence.** `Day time, side lighting, medium shot, center composition.` is the
**Wan 2.2 电影美学 axis order** (时间 → 光源/光线角度 → 镜头尺寸 → 构图) as recorded in
`_addenda/cn-sweep-2026-08-28.md` and `wan22.md` §`2026-09 sweep`, emitted verbatim by ByteDance in
its own official test case. `[SYNTHESIS]` This is **independent third-party corroboration of the Wan
2.2 axis vocabulary from a non-Alibaba vendor** — worth more than another Alibaba-family citation,
and it should be cited wherever the corpus defends that axis list.

*And the edit dialect*, from `rv2v_case1.json`
(https://raw.githubusercontent.com/bytedance/Bernini/master/assets/testcases/rv2v/rv2v_case1.json)
`[OFFICIAL]`:

```
Replace the person's outer shirt with the shirt from the reference image while keeping the inner undershirt unchanged, preserving the original body pose, fit behavior, camera framing, lighting, background, pants, hair, skin, shadows, and overall motion exactly as they are. The person stands against the same plain light gray studio backdrop with the same subtle movement and relaxed posture, still wearing the original yellow and white horizontally striped inner T-shirt underneath, while the outer garment is now a clean white button-up shirt with thin vertical dark pinstripes, a short stand collar, black front buttons, and a left chest pocket, appearing naturally worn on the body with realistic fabric drape and motion instead of hanging flat, and all other scene elements remain unchanged.
```

*Dialect in one sentence.* **Bernini-R speaks Wan 2.2's cinematic-axis prose for generation and a
"change exactly one thing, then re-describe everything that must not change" preservation clause for
editing, with reference images addressed positionally as `image0`, `image1`, …**

*Official prompt enhancer.* `[OFFICIAL]` `--use_pe` "enhances the prompt through an
**OpenAI-compatible endpoint** and is recommended for best generation quality" (`BERNINI_PE_API_KEY`
/ `BERNINI_PE_BASE_URL` / `BERNINI_PE_MODEL`, "vision-capable chat model"). **Another vendor whose
"best quality" path is a hidden cloud rewriter** — the same pattern as Wan's DashScope expander and
MiniMax H3's Context-IR, and a direct argument for Prompt Studio's premise. The ComfyUI path does
**not** include it, so ComfyUI users see un-enhanced behaviour by default.

*Recommendation:* **add as target.** It is Apache-2.0, has core ComfyUI nodes, an official
Comfy-Org repackage, two official templates and an official tutorial, it shares Wan 2.2's dialect
(so the marginal teaching cost is low), and it covers a task family — reference-guided relight /
restyle / subject insertion on video — that no current target covers.

*Known discrepancy to flag to students.* `[TESTED]` The official tutorial links a second workflow,
`video_bernini_r_image_editing.json`, and says to "search 'Bernini-R' in Template Library", but
`templates/index.json` on `main` (fetched 2026-09-03) lists **only** `video_bernini_r_video_editing`
("Bernini-R: Video Edit", `date` 2026-06-14, `openSource: true`). So the image-editing template may
not appear in the Template Library even on a current install. Scoped claim: not present in
`index.json` as fetched; the JSON file itself was not fetched.

#### Bernini-Diffusers-v2 — ByteDance, Apache-2.0, 2026-08-13 — **fails gate item 2**

`[OFFICIAL]` https://huggingface.co/ByteDance/Bernini-Diffusers-v2 (`createdAt` 2026-08-13,
`license: apache-2.0`). The full Bernini pipeline rather than the renderer alone: "a **Qwen2.5-VL
planner**, Bernini planning weights, and Wan2.2 diffusion components in one self-contained
diffusers-format directory", recommended "when you need stronger instruction following, multi-step
semantic planning, and better handling of complex video generation or editing requests". Benchmark
row as published: `Bernini-v2 7+14B` — EditVerse 8.02, OpenVE 3.96, OpenS2V 63.83, VBench 84.46.

**Gate verdict: fails (2).** No ComfyUI path exists for the planner pipeline — the Comfy-Org
repackage is `Bernini-R` (renderer) only — and the official repo's recommended environment is
"Hopper GPUs (H100/H800/H200)" with video launched as `torchrun --nproc-per-node 8 … --ulysses 8`.
7B planner + 14B×2 renderer is not a one-consumer-GPU story. *Recommendation:* **track.** If a
ComfyUI path appears, the planner is the interesting part for a prompting class, because it makes
the model's own prompt interpretation inspectable.

#### MiniMax-Music3 — MiniMaxAI, 2026-08-07 — clears the gate, out of app scope

`[OFFICIAL]` Weights https://huggingface.co/MiniMaxAI/MiniMax-Music3 (`createdAt` 2026-08-07),
Comfy-Org repackage **https://huggingface.co/Comfy-Org/MiniMax-Music-3** (`createdAt` 2026-08-08,
`license:apache-2.0`), core support in **ComfyUI v0.33.1, 2026-08-13**, listed under "New
Open-Source Model Support": "**MiniMax Music 3**: Native text-to-music support for songs up to 5
minutes from **caption and lyrics**", with two new nodes — `MiniMax Music3 Text Encode` ("Caption and
lyrics text encoding") and `Empty MiniMax Music3 Latent Audio` (PR #15570).
https://docs.comfy.org/changelog

It clears all three gate items, and it is **a two-field prompt dialect** (caption + lyrics), which
is structurally the same shape as Wan-Animate-2's 人物外观描述/背景描述 split. But Prompt Studio
teaches **video and image** prompting; a music model is out of scope. *Recommendation:* **ignore for
targets, record for the tutor** — a student who sees "MiniMax" in ComfyUI's model list should be told
Music3 is a different model from H3 and takes a different prompt shape. **Also note: this release
(08-07) and Bernini-Diffusers-v2 (08-13) both fall inside the 08-28 digest's claimed
"no new open weights in scope since Wan-Animate-2 (08-07)" period.** That line needs correcting.

#### Corpus-coverage backlog — local models with an official Comfy-Org repackage that `research/` does not cover

`[OFFICIAL]` All rows from
`https://huggingface.co/api/models?author=Comfy-Org&search=o&sort=createdAt&direction=-1&limit=15`,
accessed 2026-09-03. Each has weights, a licence tag and, by construction, an official ComfyUI path.
None was investigated further this run — this is a **hand-off list for a follow-up sweep**, not a
set of findings, and the download counts are the only evidence of classroom relevance.

| Comfy-Org repackage | Upstream | Licence tag | Created | Downloads | Why it might matter |
|---|---|---|---|---|---|
| `Comfy-Org/Bernini-R` | `ByteDance/Bernini-R` | apache-2.0 | 2026-06-09 | 103,984 | covered above — **add as target** |
| `Comfy-Org/Mage-Flow` | `microsoft/Mage-Flow` | mit | 2026-07-24 | 202,156 | an MIT Microsoft image model with a Comfy path, entirely absent from the corpus — highest-priority follow-up |
| `Comfy-Org/Ideogram-4` | `ideogram-ai/ideogram-4-fp8` | other | 2026-06-03 | 227,999 | a **local fp8 Ideogram 4**; if real, a previously API-only vendor has an open tier — verify the licence text first |
| `Comfy-Org/Boogu-Image` | `Boogu/Boogu-Image-0.1-Base` | apache-2.0 | 2026-06-17 | 119,497 | unknown vendor, Apache-2.0, non-trivial adoption |
| `Comfy-Org/JoyAI-Image-Edit` | `jdopensource/JoyAI-Image-Edit-Plus-Diffusers` | apache-2.0 | 2026-07-20 | 0 | JD's image-edit model; a `JoyAI-Echo` video model also shows up as a base for community LTX merges |
| `Comfy-Org/SCAIL-2` | `zai-org/SCAIL-2` | **mit** | 2026-06-09 | 304,542 | **hands agent 1A two facts it was missing: SCAIL-2's licence tag is MIT, and an official Comfy-Org repackage exists** |
| `Comfy-Org/Anima-LLLite` | `kohya-ss/Anima-LLLite` | other | 2026-07-17 | 36,331 | pairs with the v0.33.1 "Anima tunes checkpoints with extra blocks" entry |
| `Comfy-Org/SeedVR2` | `ByteDance-Seed/SeedVR2-3B` | apache-2.0 | 2026-06-06 | 301,474 | video restoration, prompt-light; useful for the OOM/upscale ladder in `comfyui-ops` |
| `Comfy-Org/Wan-Animate-2` | (none listed) | apache-2.0 | 2026-07-14 | 400,349 | confirms the official ComfyUI path for a model `wan22.md` already covers |
| `Comfy-Org/Pixal3D` | `TencentARC/Pixal3D` | mit | 2026-06-30 | 95,740 | 3D; out of scope |
| `Comfy-Org/RT-DETR`, `Comfy-Org/Qwen3-VL` | — | apache-2.0 | 2026-06 | 1,222 / 274,395 | utility/VLM, not generators |

### New Comfy-Org templates since 08-28

`[OFFICIAL]` **None.** `templates/index.json` on `main`
(https://raw.githubusercontent.com/Comfy-Org/workflow_templates/main/templates/index.json, fetched
2026-09-03, 2,927 lines) contains **no entry with a `date` later than 2026-08-11**. A regex for
`"date": "2026-(08-(1[2-9]|2[0-9]|3[01])|09-|1[0-2]-)"` matched zero lines. The most recent template
cohorts, for the record:

| Date | Templates | Local or API |
|---|---|---|
| 2026-08-11 | `video_ltx2_5_t2v`, `video_ltx2_5_i2v`, `video_ltx2_5_flf2v` | **local** |
| 2026-08-11 | `api_ltx2_5_t2v`, `api_ltx2_5_i2v`, `api_ltx2_5_flf2v` ("LTX-2.5 (Pro)") | API |
| 2026-08-07 | `api_seedance2_5_t2v` / `_i2v-edit` / `_r2v` / `_flf2v` | API |
| 2026-08-04 | `api_bfl_flux3_t2v`, `api_bfl_flux3_i2v` ("FLUX 3 Video") | API |
| 2026-08-02 | `video_minimax_h3_t2v`, `_i2v`, `_r2v` | **local** |

The commit history itself could not be read (both
`https://github.com/Comfy-Org/workflow_templates/commits/main` and its `.atom` feed returned empty
bodies), so this absence claim rests on the `date` fields in `index.json` on `main`, not on commits.

Verbatim from the 2026-08-11 local T2V template description, useful as an official statement of what
LTX-2.5 is sold as: "Generate cinematic video from a text prompt using LTX-2.5, a production-ready
diffusion model that outputs a single video file with optional spatial upscaling for enhanced
resolution." And the H3 T2V one, which pins the local ceiling: "Output is up to 2K resolution, 24fps,
and roughly 15 seconds long, with no file inputs required — just a prompt to one video output."
(Compare `minimax-h3.md`: the 2K tier is API-only, so this template description is describing the
partner node, not the local weights — a trap for students reading template blurbs.)

### Closed-tier register

API-only, announced-only, or weights "coming soon". Every row has a dated source. **`[OFFICIAL]`
unless marked.** Access 2026-09-03.

| Model / tier | Status | Evidence + source |
|---|---|---|
| **FLUX 3** (image) | Announced 2026-07-23, **closed**; Dev weights "planned for later in 2026", no date/licence/size | https://bfl.ai/blog/flux-3 (via 08-28 digest). **Re-verified against the org's HF page this run:** newest `black-forest-labs` repo is `FLUX.2-small-decoder`, 2026-04-06 — no FLUX 3 weights of any kind. `?search=black-forest-labs&sort=createdAt` |
| **FLUX 3 Video** | **API only.** ComfyUI partner templates `api_bfl_flux3_t2v` / `api_bfl_flux3_i2v`, `date` 2026-08-04, provider "Black Forest Labs" | `templates/index.json`. Blurb: "Outputs 1 video in 720p at 24fps, 5 to 20 seconds long, supporting any aspect ratio from 9:16 to 21:9 with built-in sound design." |
| **Wan 2.5 / 2.6 / 2.7** | **API only, no weights.** | Wan-AI HF org newest = 2026-08-06 (`?author=Wan-AI&search=Wan&sort=createdAt`). `?search=Wan2.6` returns only two empty community placeholders (`Fhcxfh/wan2.6`, `fanfa2320s/wan2.6`, both 0 files of interest) — **the "Wan 2.6 Image is the latest open-source image model from Wan" framing on SEO sites is not supported by the org's HF page.** Third-party corroboration that 2.5 is API-only `[LORE]`: wan27.org, spheron.network |
| **Wan 3.0** | **API only**, ComfyUI *partner* node | "Added Wan 3.0 text, image, and reference to video with native audio, **up to 30 seconds**" — ComfyUI **v0.33.4, 2026-08-24**, PR #15843. https://docs.comfy.org/changelog |
| **Wan 3.0 Prime** (`WAN3-Prime`) | **API only, billed premium tier** | "Added the Wan 3.0 Prime model option with **higher per-second rates**" — ComfyUI **v0.34.1, 2026-08-26**, PR #15894 |
| **Qwen-Image 2.0 / 2.0-RL / Flash** | **No weights.** | Qwen HF image family newest = `Qwen-Image-Bench`, 2026-05-21; latest weights remain `Qwen-Image-2512` (2025-12-30) and `Qwen-Image-Edit-2511`. `?author=Qwen&search=Image&sort=createdAt`. Position unchanged from the 08-15 entry above |
| **Qwen-Image 3.0 / 3.0 Pro** | **API only** — now with a dated ComfyUI partner node | "Added Qwen-Image 3.0 and 3.0 Pro text-to-image and edit nodes" — ComfyUI **v0.32.0, 2026-08-11**, PR #15327. Partner ⇒ API. No 3.0 weight repo in the Qwen org |
| **MiniMax H3 — Context-IR and Regenerate-2K** | **API-only tiers of a model whose base weights are open** | "Added **Context IR prompt enhancer** and Regenerate to 2K nodes" — ComfyUI **v0.33.1, 2026-08-13**, PR #15471. Local weights are 768p; see `minimax-h3.md`. Any tutorial using these nodes is demonstrating a **hidden cloud rewriter**, not local behaviour |
| **Seedance 2.5** (ByteDance) | **API only.** 1080p and Extend added mid-Aug | Templates `api_seedance2_5_*`, `date` 2026-08-07, provider ByteDance; "ByteDance Seedance 2.5 1080p" PR #15684 and "Extend" PR #15579 in **v0.33.2, 2026-08-17** |
| **Seedream 5.0 Pro** (ByteDance, image) | **API only**; "Fast Mode" = a **vendor prompt optimiser** | "**Fast prompt-optimization mode** for Seedream 5.0 Pro image-to-image" — **v0.33.3, 2026-08-20**, PR #15750. Also "Option to disable thinking on Seedream nodes" (PR #14853) — another hosted rewriter with a switch |
| **Kling v2 / legacy Kling** | **Being retired.** | "Removed kling-v2 from Kling Image Generation **ahead of September 15 retirement**" — **v0.33.4, 2026-08-20**, PR #15676. Earlier: "Removed retired legacy Kling models and Virtual Try-On API", PR #15249 |
| **Google Veo 2 / Veo 3.0** | **Retired** | "Removed the **retiring** Veo 2 and Veo 3.0 models from the Veo nodes" — **v0.34.1, 2026-08-26**, PR #15883 |
| **Gemini Omni 1.1 Flash** | **API only**, newest partner addition in the run-up to the window | "Faster video generation and conversational editing, with 4K output and video extend" — **v0.34.2, 2026-08-27** |
| **PixVerse V6** | **API only** | "Added V6 text-to-video, image-to-video, first-last-frame, extend, and fusion nodes with native audio" — **v0.34.0, 2026-08-26**, PR #15880 |
| **Grok Imagine Image 2.0** | **API only** | "Added grok-imagine-image-2.0 model support" — **v0.32.0, 2026-08-11**, PR #15496 |
| **Recraft V4** | **API only** | "Added the Recraft V4 Create Style node and `recraftv4_styles` models that require a style ID or reference images" — **v0.34.1, 2026-08-26**, PR #15903 |
| **Sora (any tier)** | **Not found on the surfaces searched** — no Sora node, template or changelog entry appears in docs.comfy.org's changelog or `templates/index.json`. No claim made either way |
| **Vidu (any tier)** | **Not found on the surfaces searched** — same two surfaces, no hits |
| **Hailuo hosted tiers** | **Not found under that brand name** on docs.comfy.org or in `templates/index.json`; MiniMax's hosted video capability appears as the H3 partner nodes above. The Chinese-hub tier description remains the 08-28 digest's `design.minimaxi.com/h3` citation, not re-fetched this run |

`[SYNTHESIS]` **Pattern worth teaching:** in the 08-04 → 08-27 run-up to this window, ComfyUI added
**one** local model (LTX-2.5, v0.32.0) and **eleven** partner/API models, and three vendors shipped a
*server-side prompt optimiser* as a headline feature (Seedream Fast Mode, MiniMax Context-IR, Wan 3.0
via DashScope). The gap between "what a tutorial demonstrates" and "what local weights do" is
widening, not narrowing.

### Retired or superseded

- `[OFFICIAL]` **Veo 2 and Veo 3.0 removed** from ComfyUI's Veo nodes, v0.34.1, 2026-08-26, PR #15883.
- `[OFFICIAL]` **kling-v2 removed** from Kling Image Generation, v0.33.4, 2026-08-20, PR #15676,
  "ahead of **September 15** retirement" — i.e. a retirement lands just after this window; any class
  material naming kling-v2 will break mid-September.
- `[OFFICIAL]` **Legacy Kling models and the Virtual Try-On API removed**, PR #15249.
- `[OFFICIAL]` **Tripo**: "Removed the retired Refine Draft model node and the v2.0 model version",
  v0.34.0, 2026-08-26, PR #15851.
- `[SYNTHESIS]` **Superseded within the local set:** `LTX-2.3` is superseded by `LTX-2.5` (2026-07-23)
  and by the 2026-08-11 template cohort, but LTX-2.3's twelve official IC-LoRAs
  (Ingredients, HDR, DubIt, Clean-Plate, Relight, Day-To-Night, Colorization, Deblur, Decompression,
  In-Outpainting, Water-Simulation, Instant-Shave, Cross-Eyed) have **no 2.5 equivalents yet** — only
  `LTX-2.5-22b-IC-LoRA-Pixel-Spatial-Upscaler` (2026-08-11) has been ported
  (`?author=Lightricks&search=LTX&sort=createdAt`). So "upgrade to 2.5" costs a student most of the
  IC-LoRA toolkit. Not a retirement; a real trade-off worth stating.
- **Nothing was retired or superseded inside 08-28 → 09-03.**

### Nothing-found register

Scoped absence claims. Each names the surfaces actually searched.

- **In-window new local models: none found** on (a) HF `?search=`-index queries for `Wan-AI`,
  `Lightricks`, `ByteDance`, `MiniMaxAI`, `Qwen`, `black-forest-labs`, `Tongyi-MAI`, `krea`,
  `tencent`, `zai-org`, `stepfun-ai`, `Skywork`, `Kwai-Kolors`, `Comfy-Org`; (b) `templates/index.json`
  on `main`; (c) docs.comfy.org `/changelog`; (d) five web searches, two in Chinese.
- **`Wan-AI`**: nothing after `Wan2.2-Animate-2-14B-Distilled-Diffusers` (2026-08-06). No Wan 2.5,
  2.6, 2.7 or 3.0 weight repo exists in the org.
- **`black-forest-labs`**: nothing after 2026-04-06. No FLUX 3 weights, no FLUX 3 licence file.
- **`Qwen`**: no `Qwen-Image-2.0`, `-3.0` or `-Flash` weight repo. Newest image-family repo
  2026-05-21.
- **`Tongyi-MAI`**: only four repos total; nothing after `Z-Image` (2026-01-23). **No Z-Image Edit or
  Omni-Base repo** — corroborates agent 1C's brief.
- **`krea`**: nothing after the 2026-06-23 LoRA batch. Everything newer bearing "krea2" in its name is
  a community derivative of `krea/Krea-2-Raw` / `-Turbo` (nine such repos created 2026-09-02/03 alone).
- **`tencent`**: no Hunyuan video or image release after 2026-01-25. HunyuanVideo-1.5 (2025-11-18)
  remains the newest Hunyuan video model.
- **`zai-org`**: GLM-5.3 and GLM-5.3-Flash (2026-08-25) are LLM/VLM releases, **not** generators. No
  new SCAIL release.
- **`stepfun-ai`, `Skywork`, `Kwai-Kolors`**: nothing generative after 2026-05-28, 2026-01-19 and
  2026-07-11 respectively.
- **`THUDM` / `genmo` / `rhymes-ai` / `Lumina` (Alpha-VLLM)**: **not individually queried this run** —
  budget went to the orgs with live 2026 release cadence. Recorded as *unchecked*, not as *empty*.
  (Indirect signal only: `CogVideoX-5b-I2V` appears in community listings as a 2024-era model.)
- **New Comfy-Org templates since 08-28: none.** No `date` after 2026-08-11 in `index.json`.
- **New ComfyUI release in the window: none.** Latest is v0.34.2, 2026-08-27.
- **New Comfy-Org repackage in the window: none.** Latest is `MiniMax-Music-3`, 2026-08-08.
- **ModelScope new-model listing: not reached.** No working listing endpoint found; only the
  per-model `api/v1/models/ORG/NAME` form is documented, and it requires a name you already have.
  The Chinese searches that were run returned **2025** 魔搭 monthly reports, not 2026 content.
- **Reddit, Discord, web.archive.org: unreachable** (standing rule; not attempted).
- **blog.comfy.org: JavaScript-gated**, returns only the Substack subscribe shell — no post list.
- **GitHub commit and release views: empty or stale** (see Method). `raw.githubusercontent.com` works.
- **No `[TESTED]` VRAM or throughput figure was produced for Bernini-R.** The only numbers available
  are the template's declared 38.8 GB and a third-party "24GB with fp8" claim. Nothing here was run.

### What Bernini-R's dialect would need (hand-off for a follow-up sweep)

If Bernini-R becomes a target, the dialect is **mostly inherited, and that is the point**. The
generation side is Wan 2.2: the model is literally `Wan2.2-T2V-A14B` plus a trained renderer, its
official `t2v` test prompt opens with the four Wan cinematic axes in canonical order
(`Day time, side lighting, medium shot, center composition.`), and its text encoder is the same
UMT5-XXL, so the existing Wan 2.2 axis vocabulary, ZH/EN behaviour and token-order rules should
transfer unchanged — this needs a fixed-seed check, not a new rulebook. What is **genuinely new** and
must be authored from scratch is the **conditioning-slot grammar**: a `task_type` selector
(`t2v` / `v2v` / `rv2v` / `r2v` / `img` / `ads2v`, plus `t2i` / `i2i` / `mv2v` in the upstream repo
but not in the ComfyUI tutorial's table — that discrepancy needs resolving before it is taught),
positional reference tokens (`image0`, `image1`, … referring to batched reference images in prompt
order, with `source_image` used instead for plain image editing), the `v2v`-vs-`mv2v` decision rule
that the vendor states in one sentence ("edits that need to change the subject's motion" take
`mv2v`), and above all the **editing preservation clause** — the official `rv2v` example spends over
half its words enumerating what must *not* change (pose, fit behaviour, camera framing, lighting,
background, pants, hair, skin, shadows, motion) and closes with "all other scene elements remain
unchanged". That is the opposite of our brevity guidance for T2V and would need its own card, its own
gold pairs, and a validator that warns when an `rv2v` prompt names a change without naming what is
preserved. Three open questions for the follow-up: does the shipped `lightx2v` cfg-step-distill LoRA
make negatives inert as our distilled-model rule predicts; does the model actually fit 24 GB at fp8;
and does the Wan axis prefix still help once in-context reference tokens are supplying the look?

### Sources

All accessed **2026-09-03**.

*Official — HF model cards and licences*
- https://huggingface.co/ByteDance/Bernini-R · README: https://huggingface.co/ByteDance/Bernini-R/raw/main/README.md
- https://huggingface.co/ByteDance/Bernini-Diffusers-v2 · README: https://huggingface.co/ByteDance/Bernini-Diffusers-v2/raw/main/README.md
- https://huggingface.co/Comfy-Org/Bernini-R
- https://huggingface.co/MiniMaxAI/MiniMax-Music3 · https://huggingface.co/Comfy-Org/MiniMax-Music-3
- https://huggingface.co/api/models/Wan-AI/Wan-Dancer-14B

*Official — ByteDance Bernini repo test cases (verbatim prompts)*
- https://raw.githubusercontent.com/bytedance/Bernini/master/assets/testcases/t2v/t2v.json
- https://raw.githubusercontent.com/bytedance/Bernini/master/assets/testcases/rv2v/rv2v_case1.json
- Code repo: https://github.com/bytedance/Bernini · Paper: https://arxiv.org/abs/2605.22344 · Project page: https://bernini-ai.github.io/

*Official — ComfyUI*
- https://docs.comfy.org/changelog (v0.30.0 → v0.34.2; entries cited by version + date)
- https://docs.comfy.org/tutorials/video/bytedance/bernini-r
- https://raw.githubusercontent.com/Comfy-Org/workflow_templates/main/templates/index.json
- https://docs.comfy.org/sitemap.xml (used only to show `lastmod` is a bulk regeneration timestamp)

*Official — HF listing queries (the fresh `search=` index)*
- `?author=Comfy-Org&search=o&sort=createdAt&direction=-1&limit=15`
- `?author=Wan-AI&search=Wan&sort=createdAt&direction=-1`
- `?author=Lightricks&search=LTX&sort=createdAt&direction=-1`
- `?author=ByteDance&search=B&sort=createdAt&direction=-1`
- `?author=Qwen&search=Image&sort=createdAt&direction=-1`
- `?author=krea&search=Krea&sort=createdAt&direction=-1`
- `?author=tencent&search=Hunyuan&sort=createdAt&direction=-1`
- `?search=` for `MiniMaxAI`, `zai-org`, `black-forest-labs`, `stepfun-ai`, `Skywork/SkyReels`, `Kwai-Kolors`, `Qwen-Image`, `Wan2.6`, `krea`
- Stale-index demonstration: `?author=Wan-AI&sort=createdAt&direction=-1&limit=20`, `?pipeline_tag=text-to-video&sort=createdAt&direction=-1`, `?pipeline_tag=image-to-video&sort=createdAt&direction=-1`

*Third-party — `[LORE]`, listed because they are cited above and must be verified before use*
- https://github.com/Comfy-Org/ComfyUI/pull/14216 (Bernini-R core support; title/author from a search listing, PR page not fetched)
- https://github.com/neuregex/ComfyUI-BerniniR ("Runs in 24GB with fp8")
- https://github.com/CCpt5/ComfyUI-BerniniStudio · https://github.com/RH-RunningHub/ComfyUI-RH-Bernini · https://github.com/AIMixer/ComfyUI-Bernini (community Bernini wrappers)
- https://wan27.org/blog/wan-2-5-open-source-guide · https://www.spheron.network/blog/deploy-wan-2-5-gpu-cloud/ (Wan 2.5 API-only; SEO-grade, used only as corroboration)
- https://modelscope.csdn.net/68be68b0f2ddc335f538ef1e.html (魔搭 速递 "8.30-9.06" — **2025**, not 2026; recorded as a trap)

*Cross-references — do not duplicate these here*
- Wan-Dancer-14B and Wan2.2-Animate-2 dialects: [`wan22.md`](wan22.md) §`2026-09 sweep (agent 1F)`
- FLUX.2 klein: [`flux.md`](flux.md) §`2026-09 sweep (agent 1C)`
- Wan 2.2 Chinese axis vocabulary (which the Bernini `t2v` prompt corroborates): [`wan22.md`](wan22.md) §`2026-09 sweep` and [`_addenda/cn-sweep-2026-08-28.md`](_addenda/cn-sweep-2026-08-28.md)
- LTX-2.5 depth: [`ltx23.md`](ltx23.md) §`2026-09 sweep (agent 1D)` · MiniMax H3: [`minimax-h3.md`](minimax-h3.md) §`2026-09 sweep (agent 1E)` · SCAIL-2: [`scail2.md`](scail2.md) §`2026-09 sweep (agent 1A)`
