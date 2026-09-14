# Template drift & Model-Picker audit — 2026-09-10

Auditor pass over Prompt Studio's seven embedded ComfyUI workflow templates and the
21-entry 🗺 Model Picker table. Research output only — `PromptStudio.html` was read but
**not edited** by this pass.

## Scope & method

**Access date for every fetch below: 2026-09-10.**

What was audited:

* `WF_TEMPLATES` (PromptStudio.html line 1725 — one 139,399-char line holding seven full
  ComfyUI *workflow*-format graphs: `sdxl`, `wan5b`, `zimage`, `qwen`, `klein`, `krea`, `ltx`).
* `WF_MAP` (line 1728), `buildWorkflow()` (line 1822), `WF_RES` (line 1919),
  `wfNotes()` (line 2167), `downloadWf()` (line 2176).
* `MODELSPEC` (line 1627, 21 entries) + `renderPicker()` (line 1698) — the 🗺 Model Picker.

Method:

1. Parsed the `WF_TEMPLATES` object straight out of the HTML line with `json.JSONDecoder().raw_decode`.
2. Compared each embedded graph against the corresponding verified JSON in
   `research/_addenda/comfy-templates/` by canonical JSON (`json.dumps(..., sort_keys=True)`).
3. Fetched the **current** upstream source for each template and diffed against the embedded copy.
4. Cross-checked model filenames against the Comfy-Org HF repackage repos' file listings.
5. Cross-checked every `MODELSPEC` row against official cards / repackage sizes / the corpus
   (`research/new-models.md`, `research/_addenda/*.md`, `docs/FOLD-IN-2026-09.md` §H).

### Baseline finding — embedded copies are byte-faithful to the verified harvest

All seven embedded graphs are **canonically identical** to the verified JSONs harvested
2026-08-28 (same `id`, `last_node_id`, `last_link_id`, `extra.frontendVersion`, node counts,
link counts, subgraph counts, every `widgets_values`):

| template key | verified file | top nodes | links | subgraphs | frontendVersion | embedded vs verified |
|---|---|---|---|---|---|---|
| `sdxl` | `image_sdxl_simple.json` | 8 | 9 | 0 | 1.49.6 | **IDENTICAL** |
| `wan5b` | `video_wan2_2_5B_ti2v.json` | 13 | 13 | 0 | 1.27.10 | **IDENTICAL** |
| `zimage` | `image_z_image_turbo.json` | 3 | 1 | 1 | 1.42.15 | **IDENTICAL** |
| `qwen` | `image_qwen_image.json` | 5 | 1 | 1 | 1.41.13 | **IDENTICAL** |
| `klein` | `image_flux2_klein_text_to_image.json` | 6 | 4 | 2 | 1.38.6 | **IDENTICAL** |
| `krea` | `image_krea2_turbo_t2i.json` | 6 | 3 | 1 | 1.48.5 | **IDENTICAL** |
| `ltx` | `LTX-2.3_T2V_I2V_Single_Stage_Distilled_Full.json` (Lightricks vendor) | 44 | 60 | 0 | 1.42.8 | **IDENTICAL** |

Consequence: **any drift found below is upstream drift since 2026-08-28**, not an app
transcription error. There is no third state to reconcile.

### Fetch-integrity note (method caveat worth keeping)

`mcp__workspace__web_fetch` against `raw.githubusercontent.com` was observed **serving a stale
revision** of `image_krea2_turbo_t2i.json` on one attempt (it returned a pre-2026-07-31 copy with
`last_link_id: 71`, 8 top-level nodes, a second subgraph `460e1a4e-…` and `CustomCombo` /
`RegexExtract` / `StringReplace` node types that no longer exist upstream). Every verdict below
was therefore taken from **at least two independent reads** — a cache-busted
`raw.githubusercontent.com/...?cb=…` plus the `cdn.jsdelivr.net/gh/…@main/…` mirror, and for
four of the seven a third in-browser `fetch(..., {cache:'no-store'})` with an in-page SHA-256.
Any future automated drift check that trusts a single `web_fetch` will raise false alarms.

Confirming SHA-256 prefixes (raw == jsdelivr == in-page, 2026-09-10):

| file | sha256[0:16] | bytes |
|---|---|---|
| `image_sdxl_simple.json` | `a9856bb0dcf02f0a` | 10,997 |
| `video_wan2_2_5B_ti2v.json` | `50390798a1337570` | 14,523 |
| `image_z_image_turbo.json` | `307904f13211cfa5` | 27,172 |

The local verified copy of the Lightricks LTX file still reproduces GitHub's published blob SHA
`1358422d7928c00b002ceeb1390822c9e5f58aee` after CRLF normalisation, so the local harvest is
provably unmodified.

---

## Template drift

**Headline: all seven embedded templates are NO DRIFT as of 2026-09-10.** Not one node type,
model filename, sampler default, resolution default, prompt default or subgraph input list has
changed upstream since the 2026-08-28 harvest. **No edits to `WF_TEMPLATES` are required.**

Summary table:

| app key | upstream source (accessed 2026-09-10) | verdict |
|---|---|---|
| `sdxl` | `raw.githubusercontent.com/Comfy-Org/workflow_templates/main/templates/image_sdxl_simple.json` | **NO DRIFT** |
| `wan5b` | `…/templates/video_wan2_2_5B_ti2v.json` | **NO DRIFT** |
| `zimage` | `…/templates/image_z_image_turbo.json` | **NO DRIFT** |
| `qwen` | `…/templates/image_qwen_image.json` | **NO DRIFT** |
| `klein` | `…/templates/image_flux2_klein_text_to_image.json` | **NO DRIFT** |
| `krea` | `…/templates/image_krea2_turbo_t2i.json` | **NO DRIFT** |
| `ltx` | `raw.githubusercontent.com/Lightricks/ComfyUI-LTXVideo/master/example_workflows/2.3/LTX-2.3_T2V_I2V_Single_Stage_Distilled_Full.json` | **NO DRIFT** |

### 1. `sdxl` — `image_sdxl_simple.json` — NO DRIFT

| field | app / verified | upstream 2026-09-10 | same? |
|---|---|---|---|
| `id` / `last_node_id` / `last_link_id` | `0fe56559-…` / 16 / 41 | identical | ✓ |
| `extra.frontendVersion` | 1.49.6 | 1.49.6 | ✓ |
| nodes / links / subgraphs | 8 / 9 / 0 | 8 / 9 / 0 | ✓ |
| checkpoint (15) | `sd_xl_base_1.0.safetensors` | same | ✓ |
| KSampler (12) | `[812045847300606,"randomize",25,7,"dpmpp_2m","karras",1]` | same | ✓ |
| latent (13) | `[1024,1024,1]` | same | ✓ |
| positive (10) / negative (11) | marble-statue / "color, colored, lowres, …signature\n" | same | ✓ |
| SaveImage (7) | `["sdxl_simple"]` | same | ✓ |
| node 15 output slot order | MODEL(0), CLIP(1), VAE(2) | same | ✓ |

Verdict: **NO DRIFT.** No edits.

*Non-drift observation (pre-existing, worth a future ticket, not this pass):* this is the only
template carrying the newer `widgets_values_named` name→value mirror (on 7 of its 8 nodes, e.g.
node 12's `{"seed":…,"steps":25,"cfg":7,"sampler_name":"dpmpp_2m",…}`). `wfSet()` writes only
`widgets_values`, so an exported SDXL workflow carries a **stale `widgets_values_named` block**
that disagrees with the array the user actually gets. Current ComfyUI frontends read
`widgets_values`, so this is cosmetic today; it is a latent trap if a future frontend ever
prefers the named mirror. Cheapest fix if ever wanted: in `wfSet()`, after writing
`nd.widgets_values[idx] = val`, also update `nd.widgets_values_named` when it exists and the
node's widget order is known — or simply `delete nd.widgets_values_named` on any node the
exporter touches. **Not proposed as a change now** — it is not drift and it is not breaking
anything.

### 2. `wan5b` — `video_wan2_2_5B_ti2v.json` — NO DRIFT

| field | app / verified | upstream 2026-09-10 | same? |
|---|---|---|---|
| `id` / `last_node_id` / `last_link_id` | `91f6bbe2-…` / 59 / 108 | identical | ✓ |
| `extra.frontendVersion` | 1.27.10 | 1.27.10 | ✓ |
| nodes / links / subgraphs | 13 / 13 / 0 | 13 / 13 / 0 | ✓ |
| diffusion model (37) | `wan2.2_ti2v_5B_fp16.safetensors`, `default` | same | ✓ |
| text encoder (38) | `umt5_xxl_fp8_e4m3fn_scaled.safetensors`, `wan`, `default` | same | ✓ |
| **VAE (39)** | `wan2.2_vae.safetensors` | same | ✓ |
| KSampler (3) | `[898471028164125,"randomize",20,5,"uni_pc","simple",1]` | same | ✓ |
| latent (55) | `[1280,704,121,1]` | same | ✓ |
| shift (48 ModelSamplingSD3) | `8` | same | ✓ |
| fps (57 CreateVideo) | `24` | same | ✓ |
| LoadImage (56) | `mode: 4` (bypassed), `["example.png","image"]` | same | ✓ |
| SaveVideo (58) | `["video/ComfyUI","auto","auto"]` | same | ✓ |

Verdict: **NO DRIFT.** No edits.

**VAE-pairing cross-check passes.** `research/_addenda/comfyui-ops-2026-09.md` records the rule
that the 5B TI2V model pairs with `wan2.2_vae.safetensors` while the 14B models pair with
`wan_2.1_vae.safetensors`. This template is the 5B and ships `wan2.2_vae.safetensors` — correct,
and the app does not rewrite it. (The 14B graph, which ships `wan_2.1_vae.safetensors`, is
harvested in `comfy-templates/` but is **not** embedded in `WF_TEMPLATES`, so the app cannot
mis-pair it.)

### 3. `zimage` — `image_z_image_turbo.json` — NO DRIFT

| field | app / verified | upstream 2026-09-10 | same? |
|---|---|---|---|
| `id` / `last_node_id` / `last_link_id` | `9ae6082b-…` / 61 / 75 | identical | ✓ |
| `extra.frontendVersion` | 1.42.15 | 1.42.15 | ✓ |
| top nodes / links / subgraphs | 3 / 1 / 1 ("Text to Image (Z-Image-Turbo)", 9 nodes, 18 links) | identical | ✓ |
| subgraph inputs (order) | text, width, height, seed, steps, unet_name, clip_name, vae_name | identical, same UUIDs | ✓ |
| `proxyWidgets` | 9 entries, `control_after_generate` last | identical | ✓ |
| diffusion model (28) | `z_image_turbo_bf16.safetensors`, `default` | same | ✓ |
| text encoder (30) | `qwen_3_4b.safetensors`, `lumina2`, `default` | same | ✓ |
| VAE (29) | `ae.safetensors` | same | ✓ |
| KSampler (3) | `[0,"randomize",8,1,"res_multistep","simple",1]` | same | ✓ |
| shift (11 ModelSamplingAuraFlow) | `3` | same | ✓ |
| latent (13) | `[1024,1024,1]` | same | ✓ |
| negative | none — `ConditioningZeroOut` (33) fed from the positive encode | same | ✓ |

Verdict: **NO DRIFT.** No edits. The app writing no negative and no cfg for this template is
still correct: there is still no second `CLIPTextEncode` anywhere in the file, and `cfg` is
still neither a subgraph input nor a proxy widget.

### 4. `qwen` — `image_qwen_image.json` — NO DRIFT

| field | app / verified | upstream 2026-09-10 | same? |
|---|---|---|---|
| `id` / `last_node_id` / `last_link_id` | `91f6bbe2-…` / 87 / 153 | identical | ✓ |
| `extra.frontendVersion` | 1.41.13 | 1.41.13 | ✓ |
| top nodes / links / subgraphs | 5 / 1 / 1 ("Text to Image (Qwen-Image)", 19 nodes) | identical | ✓ |
| subgraph inputs (order) | text, width, height, seed, unet_name, clip_name, vae_name, lora_name, value | identical, same UUIDs | ✓ |
| diffusion model (37) | `qwen_image_fp8_e4m3fn.safetensors`, `default` | same | ✓ |
| text encoder (38) | `qwen_2.5_vl_7b_fp8_scaled.safetensors`, `qwen_image`, `default` | same | ✓ |
| VAE (39) | `qwen_image_vae.safetensors` | same | ✓ |
| lightning LoRA (73) | `Qwen-Image-Lightning-8steps-V1.0.safetensors`, `1` | same | ✓ |
| KSampler (3) | `[50347169638278,"randomize",8,1,"euler","simple",1]` (steps/cfg inert) | same | ✓ |
| shift (66) | `3.1000000000000005` | same | ✓ |
| latent (58) | `[1328,1328,1]` | same | ✓ |
| turbo gates | 86 `false`; turbo 79=8 / 81=1; non-turbo 84=20 / 85=4; switches 78/82/83 | identical | ✓ |
| AR table (MarkdownNote 77) | 1328² · 1664×928 · 928×1664 · 1472×1140 · 1140×1472 · 1584×1056 · 1056×1584 | identical | ✓ |

Verdict: **NO DRIFT.** No edits.

Two bookkeeping corrections to the 2026-08-28 `INDEX.md` prose (not upstream changes — the file
itself is unchanged, so nothing in the app moves):

* `definitions.subgraphs[0].links` actually holds **31** entries, not the 30 the INDEX says. Link
  id 133 is a pre-existing gap and `last_link_id` is still 153, so no new edge exists.
* The INDEX's inner-node listing silently omitted two of the 19 nodes: id **8** `VAEDecode`
  (`widgets_values: []`) and id **87** `MarkdownNote` inside the subgraph, whose text is
  `"Try 50 steps, if you want original the [qwen image](https://huggingface.co/Qwen/Qwen-Image)'s setting, but it will takes longer"`.

### 5. `klein` — `image_flux2_klein_text_to_image.json` — NO DRIFT

| field | app / verified | upstream 2026-09-10 | same? |
|---|---|---|---|
| `id` / `last_node_id` / `last_link_id` | `92112d97-…` / 79 / 157 | identical | ✓ |
| `extra.frontendVersion` | 1.38.6 | 1.38.6 | ✓ |
| top nodes / links / subgraphs | 6 / 4 / 2 (14 nodes + 23 links each) | identical | ✓ |
| top-level prompt (76) | hedgehog/party-hat/digicam string, trailing `\n` | byte-identical | ✓ |
| top-level links | 154 `75→9`, 155 `76→75`, 156 `77→78`, 157 `76→77` | identical | ✓ |
| subgraph A model (70) | `flux-2-klein-base-4b.safetensors` | same | ✓ |
| subgraph B model (70) | `flux-2-klein-4b.safetensors` | same | ✓ |
| text encoder (71) | `qwen_3_4b.safetensors`, `flux2`, `default` | same | ✓ |
| VAE (72) | `flux2-vae.safetensors` | same | ✓ |
| A steps/cfg | Flux2Scheduler 62 `[20,1024,1024]`; CFGGuider 63 `[5]` | same | ✓ |
| B steps/cfg | Flux2Scheduler 62 `[4,1024,1024]`; CFGGuider 63 `[1]` | same | ✓ |
| B bypassed? | instance 77 and SaveImage 78 both `mode: 4` | still bypassed | ✓ |
| subgraph inputs (both) | value INT, value_1 INT, unet_name, clip_name, vae_name, text | identical, same UUIDs | ✓ |

Verdict: **NO DRIFT.** No edits. Download links in MarkdownNote 79 still point at
`Comfy-Org/flux2-klein` (diffusion_models, text_encoders) and `Comfy-Org/flux2-dev` (vae).

### 6. `krea` — `image_krea2_turbo_t2i.json` — NO DRIFT

Upstream git history confirms the verdict independently: the most recent commit touching this
path is **2026-07-31, "Fix krea2 issue and update translation (#1067)"** — before the
2026-08-28 harvest. Prior commits: 2026-07-22 (#1004, thinking mode), 2026-06-29 (#979).

| field | app / verified | upstream 2026-09-10 | same? |
|---|---|---|---|
| `id` / `last_node_id` / `last_link_id` | `08988737-…` / 50 / 86 | identical | ✓ |
| `extra.frontendVersion` | 1.48.5 | 1.48.5 | ✓ |
| top nodes / links / subgraphs | 6 / 3 / 1 ("Text to Image (Krea-2 Turbo)", 20 nodes, 40 links) | identical | ✓ |
| **subgraph inputs: count & order** | **14**, `value, value_1, thinking, max_length_1, width_1, height_1, seed_1, value_3, lora_name_1, strength_model_1, string_b_1, unet_name, clip_name, vae_name` | **identical, 14, same order** | ✓ |
| node 30 `widgets_values` | 14 populated entries, index-aligned | identical | ✓ |
| diffusion model | `krea2_turbo_fp8_scaled.safetensors` | same | ✓ |
| text encoder | `qwen3vl_4b_fp8_scaled.safetensors`, `krea2`, `default` | same | ✓ |
| VAE | `qwen_image_vae.safetensors` | same | ✓ |
| style LoRA | `krea2_darkbrush.safetensors`, `0.8` | same | ✓ |
| KSampler (inner 3) | `[735915477938686,"randomize",8,1,"euler","simple",1]` | same | ✓ |
| ResolutionSelector (49) | `["1:1 (Square)", 1, 8]` | same | ✓ |
| prompt-enhancer defaults | TextGenerate 16 `["",512,"on",0.7,64,0.95,0.05,1.05,0,0,true,true]`; PrimitiveBoolean 24 "Refine Prompt?" = **`true`**; 23 "Enable LoRA?" = `false`; switches 21/22/28 = `[false]` | identical | ✓ |
| negative | none — `ConditioningZeroOut` (13) | same | ✓ |

Verdict: **NO DRIFT.** No edits. This was the highest-risk template (an inserted or reordered
subgraph input would silently corrupt every export, because `buildWorkflow` writes node 30's
array by bare index) — and the 14-entry order is confirmed unchanged.

The app's decision to set `widgets_values[1] = false` (prompt_enhance OFF) remains a real and
necessary intervention: upstream still ships `Refine Prompt?` = `true`, so out of the box the
user's prompt is rewritten by a local LLM before encoding.

### 7. `ltx` — Lightricks vendor workflow — NO DRIFT

| field | app / verified | upstream 2026-09-10 | same? |
|---|---|---|---|
| `id` / `last_node_id` / `last_link_id` | `394ed254-…` / 4985 / 13363 | identical | ✓ |
| `extra.frontendVersion` | 1.42.8 | 1.42.8 | ✓ |
| nodes / links / subgraphs | 44 / 60 / 0, plus top-level `floatingLinks` | identical, `floatingLinks` still present | ✓ |
| bytes | 54,378 | 54,378 | ✓ |
| checkpoint (3940) / audio VAE (4010) | `ltx-2.3-22b-dev.safetensors` | same | ✓ |
| text encoder (4960) | `comfy_gemma_3_12B_it.safetensors`, `ltx-2.3-22b-dev.safetensors`, `default` | same | ✓ |
| distilled LoRA (4922 / 4968) | `ltxv/ltx2/ltx-2.3-22b-distilled-lora-384-1.1.safetensors` @ 0.5 / 0.2 | same | ✓ |
| LTXVScheduler (4966) | `[15, 2.05, 0.95, true, 0.1]` | same | ✓ |
| CFGGuider (4828) | `[1]` | same | ✓ |
| ManualSigmas (4971) | `"1.0, 0.99375, 0.9875, 0.98125, 0.975, 0.909375, 0.725, 0.421875, 0.0"` | same | ✓ |
| ClownSampler_Beta (4967) | `[0.25,"exponential/res_2s",94,"fixed",true]` | same | ✓ |
| KSamplerSelect (4831) | `"euler_ancestral_cfg_pp"` | same | ✓ |
| latent (3059) | `[960,544,121,1]` | same | ✓ |
| frames (4979) / fps (4978) / cond fps (1241) | `121` / `24` / `24` | same | ✓ |
| seeds (4814 / 4832) | `[42,"fixed"]` / `[43,"fixed"]` | same | ✓ |
| `bypass_i2v` (4977) | `true` (ships T2V) | same | ✓ |
| GuiderParameters (4963 / 4964) | `["AUDIO",7,1,true,0.7,3,0,true]` / `["VIDEO",3,1,true,0.9,3,0,true]` | same | ✓ |
| outputs (4823 / 4852) | `"output_F"` / `"output_D"` | same | ✓ |
| groups | 8 | 8 | ✓ |

Verdict: **NO DRIFT.** No edits.

One INDEX prose correction (not drift): the first group's full title is
`"Set prompts     -> use API Text Encode for more memory efficient run"`; the INDEX abbreviated
it to `"Set prompts"`. The byte count proves the file is unchanged.

#### 7b. The official Comfy-Org LTX template — now fetchable, but do NOT adopt it

`templates/video_ltx2_3_t2v.json` still exists on `main`. It is now **141,901 bytes** (grown from
the 105,577-byte point at which the 2026-08-28 harvest was truncated), and it has been
**restructured into a subgraph workflow**:

* `frontendVersion` now **1.51.9** (was 1.42.x-era), `id` `07824bbb-6672-4bb0-ac36-4313a519e35b`,
  `last_node_id` 331, only **3 root nodes** (`SaveVideo` 75, `MarkdownNote` 103, subgraph
  instance **267** of type `b94257db-cdc1-45d3-8913-ca61e782d9c1`), 1 link, 0 groups.
* All 51 real nodes now live inside `definitions.subgraphs[0]`, named `"Text to Video (LTX-2.3)"`.
* Node 267 now carries a **populated promoted-widget array** (the Krea-style "new" convention):
  `[0]` prompt · `[1]` Enable Prompt Enhance `true` · `[2]` Width `1280` · `[3]` Height `720` ·
  `[4]` Duration `5` · `[5]` Frame Rate `25` · `[6]` `noise_seed` `810138461690240` ·
  `[7]` `ckpt_name` `"ltx-2.3-22b-dev-fp8.safetensors"` ·
  `[8]` `lora_name` `"ltx_2.3_22b_distilled_1.1_lora_dynamic_fro09_avg_rank_111_bf16.safetensors"` ·
  `[9]` `text_encoder` `"gemma_3_12B_it_fp4_mixed.safetensors"` ·
  `[10]` `model_name` `"ltx-2.3-spatial-upscaler-x2-1.1.safetensors"` ·
  `[11]` `lora_name_1` `"gemma-3-12b-it-abliterated_lora_rank64_bf16.safetensors"`.
* Resolution/duration/fps and the enhance boolean are unchanged from the 2026-08-28 partial
  capture (1280×720, 5 s, 25 fps, enhance `true`).
* It pulls in third-party node types (`ComfyMathExpression`, `ComfySwitchNode`,
  `TextGenerateLTX2Prompt`, `PreviewAny`, `Reroute`) on top of the LTXV set, and does **not**
  need `ClownSampler_Beta`/RES4LYF (both sampler paths are `KSamplerSelect "euler"`).

**Recommendation: keep the Lightricks vendor fallback.** Swapping to the native template is not a
drop-in — every `buildWorkflow` anchor for `ltx` (nodes 2483 / 3059 / 4979 / 4814 / 4832) would
have to be rewritten to index into node 267's promoted array, the embedded JSON would roughly
triple in size (54 KB → 142 KB, on a single-file offline HTML app), and it would swap the model
set (fp8 checkpoint, a different distilled LoRA, an fp4-mixed Gemma encoder, plus a spatial
upscaler and an abliterated Gemma LoRA the user would additionally have to download). The one
line in `wfNotes()` that says the Comfy-Org template is "unavailable" is now slightly stale in
wording — see the proposed micro-edit under **wfNotes** below. That is the only text change this
whole job produces.

### Proposed edits to `WF_TEMPLATES` / `buildWorkflow` / `WF_RES`

**None.** Every one of the seven graphs, every model filename, every sampler/steps/cfg/shift/
scheduler default, every resolution default, and every subgraph input list is unchanged upstream.

### Proposed edit to `wfNotes()` — one line, wording only (OPTIONAL, COSMETIC)

`PromptStudio.html` line 2168 currently reads, for `tplKey === 'ltx'`:

```
'Official Comfy-Org template unavailable — this is the official Lightricks vendor workflow'
```

That was true on 2026-08-28 (the file could not be fetched intact). As of 2026-09-10 the
Comfy-Org template *is* retrievable; the reason to ship the vendor file is now a deliberate
engineering choice, not an availability failure. Honest replacement:

```
'Official Comfy-Org template is a 142 KB subgraph graph — this is the official Lightricks vendor workflow instead'
```

Evidence: `https://raw.githubusercontent.com/Comfy-Org/workflow_templates/main/templates/video_ltx2_3_t2v.json`,
141,901 bytes, accessed 2026-09-10. **Grade: cosmetic.** Nothing exports differently.

## buildWorkflow anchor check

Every node id and every `widgets_values` index that `buildWorkflow()` (PromptStudio.html
line 1822) writes into was re-checked against the current upstream graph. **All 31 anchors are
still valid. Zero broken anchors.**

| tplKey | app write (line) | node type upstream | index meaning upstream | status |
|---|---|---|---|---|
| `sdxl` | `wfSet(wf,10,0,pos)` | CLIPTextEncode "Positive Prompt" | `[0]` = text | ✓ |
| `sdxl` | `wfSet(wf,11,0,neg)` | CLIPTextEncode "Negative Prompt" | `[0]` = text | ✓ |
| `sdxl` | `wfSet(wf,12,0/1/2/3,…)` | KSampler | seed / control_after_generate / steps / cfg | ✓ |
| `sdxl` | `wfSet(wf,13,0/1,…)` | EmptyLatentImage | width / height | ✓ |
| `sdxl` | `wfSet(wf,7,0,'PromptStudio_SDXL')` | SaveImage | filename_prefix | ✓ |
| `sdxl` | `insertLoras(wf,15,loras,true)` | CheckpointLoaderSimple | outputs MODEL(0), CLIP(1), VAE(2) — `both=true` correct | ✓ |
| `wan5b` | `wfSet(wf,6,0,pos)` / `wfSet(wf,7,0,neg)` | CLIPTextEncode ×2 | `[0]` = text | ✓ |
| `wan5b` | `wfSet(wf,3,0/1/2/3,…)` | KSampler | seed / control / steps / cfg | ✓ |
| `wan5b` | `wfSet(wf,55,0/1/2,…)` | Wan22ImageToVideoLatent | width / height / length | ✓ |
| `wan5b` | node 56 `mode` 4→0 for `wanI2V` | LoadImage → node 55 optional `start_image` (`shape: 7`, link 106) | correct I2V switch | ✓ |
| `wan5b` | `insertLoras(wf,37,loras,false)` | UNETLoader — single MODEL output, no CLIP | `both=false` correct | ✓ |
| `zimage` | `wfSet(wf,27,0,pos)` | CLIPTextEncode (inner) | `[0]` = text | ✓ |
| `zimage` | `wfSet(wf,3,0/1/2,…)` | KSampler (inner) | seed / control / steps | ✓ |
| `zimage` | `wfSet(wf,13,0/1,…)` | EmptySD3LatentImage (inner) | width / height | ✓ |
| `qwen` | `wfSet(wf,6,0,pos)` / `wfSet(wf,7,0,neg)` | CLIPTextEncode ×2 (inner) | `[0]` = text | ✓ |
| `qwen` | `wfSet(wf,3,0/1,…)` | KSampler (inner) | seed / control | ✓ |
| `qwen` | `wfSet(wf,58,0/1,…)` | EmptySD3LatentImage (inner) | width / height | ✓ |
| `qwen` | `wfSet(wf,86,0,!!turbo)` | PrimitiveBoolean "Enable Lightning LoRA" | `[0]` = bool | ✓ |
| `klein` | `wfSet(wf,76,0,pos)` | PrimitiveStringMultiline (TOP level) | `[0]` = text | ✓ |
| `klein` | `wfSet(wf,73,0/1,…,true)` | RandomNoise (both subgraphs, `everywhere=true`) | seed / control | ✓ |
| `klein` | `wfSet(wf,62,1/2,…,true)` | Flux2Scheduler | `[steps, width, height]` | ✓ (see caveat) |
| `klein` | `wfSet(wf,66,0/1,…,true)` | EmptyFlux2LatentImage | width / height | ✓ (see caveat) |
| `klein` | `wfSet(wf,68,0,w,true)` / `wfSet(wf,69,0,h,true)` | PrimitiveInt "Width" / "Height" | `[0]` = value | ✓ **(effective)** |
| `krea` | `inst.widgets_values[0/1/6/7/8/9/10]` (node 30) | subgraph instance, 14-entry array | prompt / prompt_enhance / seed / enable_lora / lora_name / strength / trigger | ✓ |
| `krea` | `wfSet(wf,3,2,12)` | KSampler (inner) | `[2]` = steps | ✓ |
| `ltx` | `wfSet(wf,2483,0,pos)` | CLIPTextEncode | `[0]` = text | ✓ |
| `ltx` | `wfSet(wf,3059,0/1/2,…)` | EmptyLTXVLatentVideo | width / height / length | ✓ (see caveat) |
| `ltx` | `wfSet(wf,4979,0,f)` | PrimitiveInt "number of frames" | `[0]` = value | ✓ **(effective)** |
| `ltx` | `wfSet(wf,4832,0,seed)` / `wfSet(wf,4814,0,seed)` | RandomNoise ×2 | `[0]` = noise_seed | ✓ |

### Three pre-existing "belt and braces" caveats — all already handled correctly

These are **not new** and **not drift**; they were true on 2026-08-28 too. They are recorded here
because a reader of `buildWorkflow` could otherwise think the app is writing dead values.

1. **`klein` node 62 idx 1/2 and node 66 idx 0/1 are link-driven.** `Flux2Scheduler.width/height`
   are fed by links 137/138 from `PrimitiveInt` 68/69, and `EmptyFlux2LatentImage.width/height`
   by links 149/150 from the same pair. At execution the links win, so those two writes are
   cosmetic. **The app is safe because it also writes nodes 68 and 69**, which are the effective
   source. Writing all three is the right belt-and-braces call — it keeps the canvas visually
   consistent with what actually runs. No change.

2. **`ltx` node 3059 idx 2 (length) is link-driven** by link 13350 from `PrimitiveInt` 4979. Same
   pattern: the app also writes 4979 — the authoritative frame count — so the export is correct.
   Width (idx 0) and height (idx 1) on 3059 *are* live widgets. No change.

3. **`zimage` / `qwen` promoted widgets.** In both subgraph templates, `seed`, `steps`, `cfg`,
   `width` and `height` are promoted to link inputs from the subgraph input node, yet
   `widgets_values` remains the full positional array. Since the *instance* nodes leave those
   subgraph inputs unconnected (`widgets_values: []` on the instance, no incoming links), the
   inner widget values are what run. The app's positional writes are correct. No change.

Two further mechanical notes confirmed still true:

* `wfSet()` writes only the **first** matching node id unless `everywhere` is passed. That
  matters only for `klein`, where node ids 62/63/66/68/69/73/74 exist **twice** (once per
  subgraph) — and `klein` is the one branch that passes `everywhere = true` on every one of
  those writes. Correct.
* `buildWorkflow`'s stale-link sanitizer (`wf.links.filter(l => ids.has(l[1]) && ids.has(l[3]))`
  plus `delete wf.floatingLinks`) is still needed: the Lightricks LTX file still ships a
  top-level `floatingLinks` array of 1. Confirmed present upstream. No change.

### `WF_RES` check

`WF_RES` (line 1919) is app-authored, not harvested, so "drift" is only about whether it still
agrees with the templates and the official aspect tables.

| key | app list | check | verdict |
|---|---|---|---|
| `sdxl` | 1024², 1152×896, 896×1152, 1344×768, 768×1344 | all SDXL-native bucket sizes; template default 1024² is entry 0 | ✓ keep |
| `wan5b` | 1280×704, 704×1280, 960×960 | template default 1280×704 is entry 0 | ✓ keep |
| `zimage` | 1024², 1344×768, 768×1344 | template default 1024² is entry 0 | ✓ keep |
| `qwen` | 1328², 1664×928, 928×1664, 1472×1140, 1140×1472 | exactly the first five rows of the upstream MarkdownNote 77 table, unchanged upstream | ✓ keep |
| `klein` | 1024², 1344×768, 768×1344 | template default 1024² is entry 0 | ✓ keep |
| `krea` | single 1024² entry labelled "set aspect via Resolution Selector node in ComfyUI" | still correct — width/height on instance 30 slots 3/4 are driven by `ResolutionSelector` 49 via links 85/86, so a `WF_RES` pick would be overridden | ✓ keep |
| `ltx` | 960×544 "16:9 (first pass)", 1280×720, 544×960 | template default 960×544 is entry 0 | ✓ keep |

Optional, low value: `qwen` could gain the two remaining official rows **3:2 (1584×1056)** and
**2:3 (1056×1584)** from MarkdownNote 77 — they are official and currently omitted. Not required.

## Model Picker audit

`MODELSPEC` — 21 rows, 12 fields each = 252 fields. **Roughly 60 fields need a change; 14 are
YES-must.** The picker's fit rule is `vram >= comfy` → "✓ comfortable", `vram >= min` → "⚠ tight",
else "✗ too big", sorted fit → ease desc → min asc, and only `licClass:'ok'` rows survive the
"free/commercial only" tick — so a wrong `min`/`comfy` is a hardware mis-teaching and a wrong
`licClass` is a licence-safety bug.

**Concurrency note.** While this audit ran, the concurrent apply-agent moved `MODELSPEC` from
line 1627 to **line 1724** and already landed four fixes: row 8 Wan-Dancer's `disk`/`best`/`warn`
(FOLD-IN A21), row 11's `best` (A39), row 14's `warn` (A31/A38), and row 20's `lic` string. Those
are marked **[already applied]** below — do not double-apply. Everything else is outstanding.

### The single structural finding that explains most of the errors

**The rows mix precisions inside one row and use two incompatible `disk` conventions.**
Six of nine video rows and five of twelve image rows quote a `min` derived from a GGUF/Q4 or int8
build, a `comfy` derived from fp8, and a `disk` derived from bf16 — three precisions, none
labelled. Separately, some rows quote the **DiT file alone** (klein 9B "~18 GB", klein 4B "~8 GB",
Qwen "~40 GB", LongCat "~12 GB") while others quote a **complete runnable stack** (FLUX.1 dev
"~24 GB"), which makes klein 9B look 2× cheaper to download than FLUX.1 dev when its runnable set
(27–35 GB) is in fact larger.

**Proposed rule, worth more than any individual number fix:** every row's `min` / `comfy` / `disk`
triple must name **one** precision, and the `disk` figure must be the **complete set the official
ComfyUI template loads** (model + text encoder + VAE), because that is what the user actually
downloads. This mirrors the standing rule already in
`research/_addenda/comfyui-ops-2026-09.md` — *use the quantised build the official template loads*.

### Audit table

Grades: OFFICIAL · TESTED · STAFF · LORE · SYNTHESIS · SPECULATION · UNSOURCED.
All HF sizes are decimal GB read from the HF tree API on **2026-09-10** (exact byte counts).

#### Video rows

| model | field | app value | verified value | source | grade | change? |
|---|---|---|---|---|---|---|
| Wan 2.2 TI2V-5B | `disk` | `~12 GB` | **18.14 GB** — exactly what the app's own `wan5b` template loads: `wan2.2_ti2v_5B_fp16` 9,999,658,848 + `umt5_xxl_fp8_e4m3fn_scaled` 6,735,906,897 + `wan2.2_vae` 1,409,400,960 | HF tree `Comfy-Org/Wan_2.2_ComfyUI_Repackaged/split_files/*` | OFFICIAL | **YES-must** |
| Wan 2.2 TI2V-5B | `comfy` | `12` | Only measured 5B datapoint is **peak 18.6 GB** at 720×1280 / 121 f / bf16 — the template's own default. ComfyUI's "fits well on 8GB vram" is OFFICIAL but names no res/length | `video-model-comparison.md` L680, L707; `comfyui-ops-2026-09.md` L148 | OFFICIAL vs TESTED | YES-should → `20`, or keep 12 and scope it "12 at ≤480p" |
| Wan 2.2 TI2V-5B | `best` | "top-tier temporal consistency" | No temporal-consistency measurement for the **5B** exists in the corpus. Traces to Sci-VBench 2.79 for unqualified "Wan 2.2" in the 08-27 digest, which verification marks *not re-verified* | `digests/2026-08-27-digest.md` L16; `verification-2026-09.md` **K50** | LORE / UNSOURCED | **YES-must** |
| Wan 2.2 TI2V-5B | `warn` | "Weak camera-following (family trait)" | CMC 42.86 was measured on the **14B** (45 GB GPU). The matrix marks 5B camera adherence `?` | `video-model-comparison.md` L132, L164-170 | SYNTHESIS | YES-should (label inferred) |
| Wan 2.2 A14B | `min`/`comfy` | `12` / `24` | Official floor is **80 GB**; consumer path is community GGUF/fp8 only; **no measured A14B consumer figure exists.** 12 ≈ Q4_K_M 9.65 GB/expert, 24 ≈ Q8 15.4 GB/expert (experts swap, so peak ≈ one expert) | `video-model-comparison.md` L708, §9.5 | OFFICIAL floor / SYNTHESIS | YES-should (name the quant tier) |
| Wan 2.2 A14B | `disk` | `~28 GB quant.` | 28.59 GB = exactly the two **fp8** experts (14,293,923,632 × 2) — correct, but excludes the encoder+VAE the same graph needs: full fp8 stack **35.58 GB**. And it is an fp8 figure beside a Q4-derived `min` | HF tree `Comfy-Org/Wan_2.2_ComfyUI_Repackaged` | OFFICIAL | YES-should |
| Wan 2.2 A14B | `best` | "highest measured temporal consistency of ANY model (incl. closed)" | Same unverified Sci-VBench 2.79. The *scene-semantics* half (Scene Depiction 96.43, Object types 72.62) is solid TESTED-PAPER | `verification-2026-09.md` **K50** | LORE | **YES-must** (attribute + downgrade) |
| LTX 2.3 | `warn` | "**Negatives are inert (CFG 1)**" | **Retired.** A10/A11 downgrade inertness to SPECULATION/UNTESTED: *"whether that negative is fully inert at CFG 1 is UNTESTED — no source states it and no A/B exists."* CFG 1.0 stays OFFICIAL. Verifier: **High severity**, "a confident claim on a speculative mechanism" | FOLD-IN **A10**, **A11**; `ltx23.md` item 8 | SPECULATION | **YES-must** |
| LTX 2.3 | `disk` | `~26 GB` | Vendor checkpoints are **46.15 GB each** (`ltx-2.3-22b-dev` 46,149,344,974); the app's own graph loads that **plus** the 7.61 GB distilled LoRA and the Gemma encoder. The picker understates its own export by >2× | HF tree `Lightricks/LTX-2.3` | OFFICIAL | **YES-must** |
| LTX 2.3 | `min`/`comfy` | `8` / `16` | No LTX-2.3-specific floor in the corpus. `ComfyUI-LTXVideo/README.md` says **"32GB+ VRAM"**. The sub-16 GB evidence is for **LTX-2.5 distilled int8 on a 3060 12 GB**, not 2.3 | `ltx23.md` L311 item 10; `video-model-comparison.md` L79, L694 | OFFICIAL vs TESTED | **YES-must** (nothing supports 8 GB for 2.3) |
| LTX 2.3 | `ease` | `4` | The workflow **the app itself ships** requires **RES4LYF** (`ClownSampler_Beta`, node 4967); the native Comfy-Org template does not. Custom-node install is the corpus's canonical ease penalty | this file §7 / §7b | OFFICIAL (file inspection) | YES-should → `3` |
| LTX 2.3 | `lic` | `LTXV open` | **LTX-2.x Community License**, dated 2026-08-11. "LTXV open" is retired 0.9.x branding, and the word *open* does false work | FOLD-IN **A13**, **H6**; `ltx23.md` item 15 | OFFICIAL | **YES-must** |
| LTX 2.3 | `licClass` | `ok` | Not Apache-equivalent: Attachment A **#18** no competing model, **#20** no competing product, **§6** no removing watermarking/provenance, **#5** disclose machine-generated content, plus a **$10M annual-revenues** trigger (annual revenues, *not* ARR) with affiliates aggregated (§1.6) | FOLD-IN **H6**, **A13** | OFFICIAL | **YES-must** → see the rubric note below |
| LTX 2.5 | `disk` | `~45 GB` | bf16 transformer **42.02 GB**; the ComfyUI default the docs load is **int8-convrot 21.50 GB**; nvfp4 distilled 18.72 GB. Neither stack lands on 45 | HF tree `Lightricks/LTX-2.5/diffusion_models` | OFFICIAL | YES-should (pick a config) |
| LTX 2.5 | `min`/`comfy` | `12` / `24` | 12 is **TESTED** (3060 12 GB, 960×544, 15 s, 8 steps, int8-convrot) — but **A12** is explicit that the **OFFICIAL minimum is 32 GB+**; 12 appears only on a marketing `llm-info` page and 16 only on a product table. Three official numbers for one model | FOLD-IN **A12**; `ltx23.md` item 10, L311-313 | OFFICIAL + TESTED | YES-should (keep as *int8* numbers, say so; never present marketing as spec) |
| LTX 2.5 | `lic`/`licClass` | `LTXV (gated)` / `ok` | Same LTX-2.x Community License; gating is an HF access gate, not a licence name | as above | OFFICIAL | **YES-must** |
| LTX 2.5 | `warn` | "lost its one multi-shot bakeoff to H3" | Misquotes the source. The tester says the feature **was never exercised**: *"the flagship feature, 'native multi-shot,' was not utilized under the I2V/single-image conditions of this test; in fact, there were several instances where MiniMax H3 … came out on top."* | `video-model-comparison.md` §7.2 L501-507; `verification-2026-09.md` **K50** | TESTED, misquoted | **YES-must** |
| **MiniMax H3** | `min`/`comfy` | **`48` / `80`** | **MiniMax publishes 未公布 (no minimum VRAM), twice, on its own self-hosting page.** Measured: pruned-int8 floor **16 GB**, peak 12.5-15.6 GiB; a **3090 24 GB** ran 832×480/124 f/20 steps in 4m26s and 362 f in 23m17s; a **5060 Ti 16 GB** and a **5070 Ti 16 GB** both completed. The row's own `warn` already says "480p+audio on ~12 GB VRAM" — **it contradicts itself** | `minimax-h3.md` L396-398 §Contradicts #3; `video-model-comparison.md` L685-691, L706; FOLD-IN **F6** | OFFICIAL absence + TESTED | **YES-must** → `min:12, comfy:16` |
| MiniMax H3 | `disk` | `~125 GB` | 123.61 GB is the **bf16** one-checkpoint stack; the **docs-recommended default local config is 42.48 GB** (20.97 `fl2va_pruned_int8_convrot` + 15.69 `qwen3vl_32b_nvfp4_awq` + 5.21 + 0.61) — which the row's own `warn` already states | `minimax-h3.md` §Contradicts #3 size table | OFFICIAL | **YES-must** |
| MiniMax H3 | `warn` | "62+62 GB at bf16" | Wrong pairing. 62+62 can only mean the two bf16 **diffusion** checkpoints (61.7 GiB each, FL2VA and Ref2VA) — **you need one at a time.** bf16 model + bf16 encoder is **62 + 48 GiB** | FOLD-IN **F6**; `minimax-h3.md` §Contradicts #3 | OFFICIAL | **YES-must** |
| MiniMax H3 | `lic` | `Regional restrictions` | Understates twice: **§V.4 + Exhibit A item 1 extend the ban to the OUTPUTS**, and there is an unresolved conflict with docs.comfy.org's *"Commercial use of locally generated outputs requires a MiniMax commercial license, available through Comfy, the only official reseller"* | FOLD-IN **B6**, **H1**, **H9b** | OFFICIAL (both) | **YES-must**; `licClass:'risk'` correctly stays |
| MiniMax H3 | `warn` | (LoRA silence) | Missing: **§I.11 makes any H3 LoRA a Model Derivative** inheriting every term including the output ban; several HF H3 LoRAs are tagged `apache-2.0` anyway | FOLD-IN **H2**; `verification-2026-09.md` **K14** | OFFICIAL + SPECULATION | YES-should |
| SCAIL-2 | `warn` | "**Prompt-inert**" | **Retired.** **A18** replaces it with **PROMPT-SUBORDINATE**: the vendor states long detailed prompts beat short/empty ones, ships a Gemini rewriter whose only job is to lengthen the prompt, and the workflow note says *"Main prompt controls final appearance"*. Verifier severity **High** | FOLD-IN **A18**; `scail2.md` §Prompt-inertness verdict; `verification-2026-09.md` **#2, #5, K17** | OFFICIAL | **YES-must** |
| SCAIL-2 | `min` | `8` | The only 8 GB claim is a **知乎 GGUF claim graded LORE, body walled**. Official: *"None published, on any GPU. Arithmetic floor ~27 GB of weights."* One real end-to-end run: **RTX 3090 24 GB, peak under 24 GB**. Smallest **official** repackage is `nvfp4_mxpf8_mix` **11.02 GB** | `scail2.md` L385, L449-454; HF tree `Comfy-Org/SCAIL-2` | LORE only | **YES-must** → `12` (nvfp4) / `16` (int8) |
| SCAIL-2 | `disk` | `7-33 GB` | Official repackages: fp16 32.79 · fp8_scaled 17.69 · int8_convrot 16.65 · mxfp8 17.15 · nvfp4_mix 11.02. Top ✓; **bottom 7 GB matches no official file** (community GGUF only). Measured real stack ≈ **21.4 GB** | same HF tree; `scail2.md` L453 | OFFICIAL / UNSOURCED | YES-should |
| SCAIL-2 | `best` | "**unlimited** length" | The 81/5 Extend arithmetic is OFFICIAL three ways (76 new frames/segment); "unlimited" is not — *"degradation after repeated looping is unavoidable, consistency drifts"*, and the one hardware test **did not exercise Extend** | `scail2.md` L256-267, L386-389, L460 | OFFICIAL / LORE | YES-should |
| SCAIL-2 | `ease` | `3` | Understated: mask polarity **inverts on both sides** between modes, masks need an **exact trained 6-colour palette**, canvas must be **÷32 not ÷16**, and the official template ships **two reproducible bugs** that each throw a bare "Value not in list" and must be fixed **in two places** (Base *and* Extend subgraphs) | FOLD-IN **A20**; `scail2.md` L401-407, L455-458 | OFFICIAL + TESTED | YES-should → `2` |
| SCAIL-2 | `lic` | `Apache 2.0` | Picks one side of a live conflict: code repo Apache 2.0 ("Copyright 2026 Zhipu AI"), every distribution surface (HF, ModelScope, `Comfy-Org/SCAIL-2`) tagged **MIT**. FOLD-IN: *"Both permissive; state the conflict"* | FOLD-IN **H9a**; `verification-2026-09.md` **#8** | OFFICIAL vs OFFICIAL | YES-should; `licClass:'ok'` stays |
| Wan2.2-Animate-2 | `disk` | `~83 GB` | **Wrong unit.** ComfyUI needs **one** diffusion file: `wan_animate_2_int8_convrot` 16.65 GB or `_bf16` 32.79 GB → full int8 stack ≈ **25 GB**, bf16 ≈ 40 GB. ~83 GB is only reachable as a **full clone of the vendor repo**. Every other video row quotes a ComfyUI-path figure | HF trees `Comfy-Org/Wan-Animate-2`, `Wan-AI/Wan2.2-Animate-2-14B`; `wan22.md` L306 | OFFICIAL | **YES-must** |
| Wan2.2-Animate-2 | `min`/`comfy` | `16` / `24` | *"Tuned for 8× A800; 480P on 2× A800. No consumer VRAM figure exists."* And `min:16` sits **below the int8 weights themselves** (16.65 GB). `WanAnimate2Cache` additionally costs **~12.5 GB system RAM** at 480×832/81 f | `video-model-comparison.md` L709; `wan22.md` L306, L320 | UNSOURCED | **YES-must** (state as unknown) |
| Wan2.2-Animate-2 | `warn` | "3 weeks in" | Stale: released 2026-08-07, ComfyUI-native 2026-08-08 → **~4.8 weeks** as of 2026-09-10 | `digests/2026-08-27-digest.md` L7; `wan22.md` L304 | OFFICIAL | YES-should (make date-relative) |
| Wan2.2-Animate-2 | `warn` | (missing) | Missing the two things that actually break an Animate-2 prompt: the dialect captions **the reference image only** (`不描述动作行为`; motion comes from the driving video), and **CFG is 0.0-1.0 across the official configs**, so negatives are not live | FOLD-IN **B11**; `wan22.md` §3 | OFFICIAL / SPECULATION | YES-should |
| Wan-Dancer-14B | `min`/`comfy` | `16` / `24` | **No VRAM figure is published, and the official pipeline hard-gates on 8 GPUs:** `assert world_size == 8, "WORLD_SIZE must be 8"` in `gen_video_global.py`. Defaults 720×1280, 149 f, 48 steps global / 24 local | `wan22.md` L384; FOLD-IN **A21** | OFFICIAL (the gate) / UNSOURCED | **YES-must** |
| Wan-Dancer-14B | `tags` | `['t2v','swap']` | It is **music-to-dance**, two-stage, and *"takes no English prompt"* — a fixed Chinese caption schema. Nothing documents a character-swap capability. `t2v` puts it in front of users filtering for text-to-video | `wan22.md` §4 L324-390, L566 | OFFICIAL | **YES-must** |
| Wan-Dancer-14B | `ease` | `2` | With an 8-GPU assert and a ZH slot schema carrying a hidden runtime-appended `帧率是{fps}` token, `1` is more honest | `wan22.md` L370-384 | OFFICIAL | YES-should → `1` |
| Wan-Dancer-14B | `disk`, `best`, `warn` | `~28 GB`, "Prompt Alignment **9.03**" | Both were **invented numbers** — *"Neither the HF card, the arXiv v2 abstract, nor the project page states any Prompt Alignment score or names a benchmark"*; *"the '~28 GB bf16' figure stands unconfirmed"* | FOLD-IN **A21**, **F9**; `verification-2026-09.md` **#45/#47**; `wan22.md` L652-653 | UNSOURCED | **[already applied]** |
| FramePack | `best` | "Runs on a 6 GB laptop" | The 6 GB VRAM figure is OFFICIAL verbatim — but the same corpus row states FramePack *"Needs 36-45 GB system RAM, transiently 70-90 GB on first LoRA merge."* A 6 GB laptop will not have that | `video-model-comparison.md` L703 | OFFICIAL (both halves) | **YES-must** (add the RAM caveat) |
| FramePack | `disk` | `~30 GB` | Transformer verified **25.75 GB** (3 shards). The first-run download also pulls the HunyuanVideo VAE, llava-llama-3-8b, CLIP-L and SigLIP — not measured; the corpus states no total | HF tree `lllyasviel/FramePackI2V_HY` | OFFICIAL (transformer) / UNSOURCED (total) | YES-should |

**Video rows verified correct** (fields checked and found fine): 5B `kind/tags/min:8/speed/ease/lic/licClass`, "720p class" ✓ · A14B `kind/tags/speed/ease/lic/licClass`, "weakest measured camera-follower" ✓ (CMC 42.86) · LTX 2.3 `kind/tags/speed`, "~5.7× Wan" ✓ TESTED, "native speech is gibberish (mux TTS)" ✓ TESTED, "camera weak" ✓ · LTX 2.5 `kind/tags/speed/ease`, multi-shot with named cuts + duration ✓ (B12), "most 2.3 LoRAs transfer" ✓ (HDR/Dub-It/Relight are 2.3-only — worth a clause), "gated download" ✓ · H3 `kind/tags/speed/ease:2/licClass:risk`, "#1 editing Elo" ✓ OFFICIAL-3P (~10,280 votes; teach as *preference*, not adherence), "$20M gate / attribution / no-distillation" ✓ B6, "5-15s, 768p local" ✓ · SCAIL-2 `kind/tags/speed/licClass`, "exact motion transfer" ✓ (Appearance Consistency 4.38), "exact trained color palette" ✓ A20, "silent output" ✓ · Animate-2 `kind/tags/speed/ease/lic/licClass`, "48 viewpoints — on paper" ✓ correctly hedged, "zero community recipes" ✓, "Chinese two-field dialect" ✓ B11 · Wan-Dancer `kind/speed/lic/licClass` ✓ · FramePack `kind/tags/min:6/comfy:8` ✓ OFFICIAL verbatim, `speed/ease/lic/licClass`, "60-second clips" ✓ (1800 f @ 30 fps), "weakest overall visual quality" ✓ (Objects 35.71), "fixed 25-step recipe" ✓ (*"Changing this value is not recommended"*), "best measured local camera-follower (71%)" ✓ CMC 71.43 (5/7).

#### Image rows

| model | field | app value | verified value | source | grade | change? |
|---|---|---|---|---|---|---|
| SDXL photoreal | `best` | "the **only** fully mature ControlNet/regional-control ecosystem" | The corpus's own control column rates **SDXL ●●●, FLUX.1 [dev] ●●●, Qwen-Image ●●● ("deepest new-gen")** | `image-model-comparison.md` L1369-1370, L1377 | SYNTHESIS on TESTED | YES-should → "the most mature" |
| SDXL photoreal | `lic` | `RAIL++-M` | True of **SDXL base 1.0** only. Corpus is explicit: *"Pony V6 / Juggernaut XL / RealVisXL — no evidence found this pass — these live on Civitai — **do not assert**"*; **Juggernaut Z is CC BY-NC 4.0** | `image-model-comparison.md` L1272, L1280-1281 | OFFICIAL (base) / explicit absence | YES-should |
| SDXL photoreal | `warn` | "77-token window" | Not a window — ComfyUI **chunks** at 75 and concatenates; cross-chunk relations are lost, nothing is discarded | FOLD-IN **A40**; `verification-2026-09.md` #58/#59 | CREATOR (advice) / TESTED (mechanism) | YES-should |
| **Illustrious / NoobAI** | **`licClass`** | **`ok`** | NoobAI-XL cards carry `fair-ai-public-license-1.0-sd` with **"II. Commercial Prohibition — We prohibit any form of commercialization, including but not limited to monetization or commercial use of the model, derivative models, or model-generated products"** plus §III mandatory open-sourcing of derivatives/merges/LoRAs. **Re-verified verbatim today** at `huggingface.co/Laxhar/noobai-XL-Vpred-1.0/raw/main/README.md` and `…/Laxhar/noobai-XL-1.1` cardData — FOLD-IN H3 asked for exactly this re-verification and it **passes** | FOLD-IN **H3**; HF cards (2026-09-10); `image-model-comparison.md` L1273-1274 | OFFICIAL | **YES-must** → `risk` |
| Illustrious / NoobAI | `lic` | `varies/checkpoint` | Two opposite regimes, not a gradient: Illustrious **v2.0 = creativeml-openrail-m (commercial OK)**; NoobAI eps + v-pred and Illustrious **v0.1 = FAIPL-1.0-SD (commercial PROHIBITED)** | HF `OnomaAIResearch/Illustrious-XL-v2.0` (`license: creativeml-openrail-m`) | OFFICIAL | **YES-must** |
| Illustrious / NoobAI | `warn` | no licence sentence | must gain one | as above | OFFICIAL | **YES-must** |
| Illustrious / NoobAI | `ease` | `5` | The row bundles families with **mutually contradictory wiring**: NoobAI v-pred needs Euler/DDIM **+** `prediction_type=v_prediction` **+** `rescale_betas_zero_snr=True` **+** CFG-Rescale ≈0.2 **+** CFG 4-5, or output is visibly broken. Its own `warn` ("each derivative has its own quality-tag scheme") contradicts a 5 | FOLD-IN **A25**; `verification-2026-09.md` K25 (High); NoobAI card *"⚠️ Other samplers will not work properly"* | OFFICIAL | YES-should → `4` |
| Illustrious / NoobAI | `best` | "every top Civitai anime checkpoint builds on it" | Unverifiable — civitai.com returns an empty body to every automated check | FOLD-IN **A39**; `verification-2026-09.md` **K48** | LORE | **[already applied]** |
| FLUX.1 family | `min`/`comfy` | `8` / `16` | Corpus floor for FLUX.1 [dev] is **12 GB**; FLUX.1 Krea [dev] 12-24 GB. `min:8` rests on GGUF Q4 + offload — a Q4 floor under an fp8/bf16 `comfy` under a bf16 `disk` | `image-model-comparison.md` L1370-1371 | SYNTHESIS on OFFICIAL | YES-should |
| FLUX.1 family | `disk` | `~24 GB (GGUF 7-13)` | `flux1-dev.safetensors` = **23.80 GB** ✓ — and it is a **complete** checkpoint (DiT + T5 + CLIP-L + VAE). fp8 single-file = **17.25 GB**. The GGUF 7-13 range is DiT-only and still needs T5 separately (7-13 not verified this pass) | HF `Comfy-Org/flux1-dev?blobs=true` | OFFICIAL / UNVERIFIED (7-13) | YES-should |
| FLUX.1 family | `warn` | "512-token silent truncation" | True for **dev** (T5 512); the row also bundles **schnell**, whose cap was not confirmed this pass | `verification-2026-09.md` **K31** (#22/#27) | OFFICIAL (dev) / UNVERIFIED (schnell) | YES-should (scope to dev/Krea) |
| FLUX.2 dev | `disk` | `~64 GB` | Official ComfyUI download = `flux2_dev_fp8mixed` **35.46 GB** + `mistral_3_small_flux2_fp8` **18.03 GB** + VAE 0.34 = **53.8 GB**. **No hosted file is 64 GB** | HF `Comfy-Org/flux2-dev?blobs=true` | OFFICIAL | YES-should |
| FLUX.2 dev | `warn` | "collapses at **5+ text regions**" | **Misattributed.** The 5-region figure is CVTG-2K Table 8, which **does not include FLUX.2 dev** — the −17.7-point collapse there is **FLUX.1 [dev]** (0.6089 → 0.4316). FLUX.2 dev's real split is UniGenBench++ EN-short **85.34 (best open model)** vs BizGenEval Text-hard **1.0 (near bottom)** | `image-catch-up.md` L799-812; `image-model-comparison.md` L66-68 | OFFICIAL (both benchmarks) | **YES-must** |
| FLUX.2 dev | `min` | `24` | Nearest sourced 4-bit figure is **~20 GB** (NF4 DiT + 4-bit encoder + offload); ~18 GB with a remote encoder; ~8 GB via `group_offloading` but needing 32 GB free RAM. `comfy:64` ≈ the sourced 62 GB (bf16 + `enable_model_cpu_offload()`) — keep | `image-catch-up.md` L597-599 | OFFICIAL | YES-should (24 is interpolated) |
| **FLUX.2 klein 9B** | **`comfy`** | **`16`** | Corpus VRAM matrix: 8 GB ❌ · 12 GB "GGUF only" · 16 GB **"marginal — official says ~29 GB / RTX 4090+"** | `image-model-comparison.md` L1193, L1373 | OFFICIAL (BFL, via corpus) | **YES-must** → `24`-`32` |
| FLUX.2 klein 9B | `min` | `12` | 12 GB is GGUF-only, quoted beside an unquantised `disk` | same | OFFICIAL | YES-should → `16` |
| FLUX.2 klein 9B | `disk` | `~18 GB` | DiT alone = **18.16 GB** ✓, but the runnable set adds `qwen_3_8b` **16.38 GB** (fp8mixed 8.66) + VAE 0.34 → **34.9 GB bf16 / 27.2 GB fp8** | HF `black-forest-labs/FLUX.2-klein-9B?blobs=true`; `Comfy-Org/vae-text-encorder-for-flux-klein-9b?blobs=true` | OFFICIAL | YES-should |
| FLUX.2 klein 9B | `warn` | "wrong encoder gives black images" | **Retired.** A mismatch throws `mat1 and mat2 shapes cannot be multiplied (512x12288 and 7680x3072)` at the sampler; *"No evidence anywhere that a wrong text encoder yields a black image on klein"* | FOLD-IN **A31**, **A38**; `flux.md` item 7 §Nothing-found | OFFICIAL (code) | **[already applied]** |
| FLUX.2 klein 9B | `warn` | no filter obligation | Card Responsible AI §5: *"Filters or manual review **must** be used with the FLUX.2 [klein] 9B models"* — the only picker row besides Krea 2 where the licence imposes an operational duty | FOLD-IN **H7**; `flux.md` L226-228 | OFFICIAL ⚠ §5 text not re-fetched (H7's caveat stands) | YES-should |
| FLUX.2 klein 9B | `ease` | `4` | Gated + needs a separately-sourced size-matched Qwen3-8B that ComfyUI's own Flux 2 page does not hand you (*"THE TRAP IS OFFICIAL"*) + filter duty | FOLD-IN A31; `flux.md` L456-459 | OFFICIAL | YES-should → `3` |
| **FLUX.2 klein 4B** | **`comfy`** | **`8`** | ComfyUI **measured 8.4 GB** on a 5090; BFL docs/card say *"~13 GB"* (RTX 3090/4070+); BFL repo README says *"~8 GB"* — an acknowledged internal BFL contradiction. `comfy:8` stamps "✓ comfortable" *below* the only measured figure | `image-model-comparison.md` L1167, L1189, L1205-1206; `image-catch-up.md` L1169 | TESTED vs OFFICIAL | **YES-must** → `12` |
| FLUX.2 klein 4B | `min` | `6` | **No source anywhere** for 6. Lowest attested figures are 8 / 8.4 / 13 | same | UNSOURCED | **YES-must** → `8` |
| FLUX.2 klein 4B | `disk` | `~8 GB` | DiT = **7.75 GB** ✓ but + `qwen_3_4b` **8.04 GB** (fp4 3.85) + VAE 0.34 → **16.1 GB bf16 / 11.9 GB fp4-encoder** | HF `Comfy-Org/flux2-klein?blobs=true` | OFFICIAL | YES-should |
| **Z-Image Turbo** | `disk` | `~8-13 GB` | The official template loads `z_image_turbo_bf16` **12.31 GB** + `qwen_3_4b` **8.04 GB** + `ae` 0.34 = **20.7 GB**. Fully quantised (`nvfp4` 4.51 + `fp4_mixed` 3.48 + VAE) = 8.3 GB; int8+fp4 = 10.0 GB. The range describes only the quantised end | HF `Comfy-Org/z_image_turbo?blobs=true`; template node 28 loads the **bf16** file | OFFICIAL | **YES-must** |
| Z-Image Turbo | `comfy` | `12` | Vendor's own figure is *"fits comfortably within 16G VRAM"* / *"<16 GB VRAM consumer devices"*; the bf16 DiT alone is 12.31 GB, so 12 GB requires int8/nvfp4 | `image-catch-up.md` L1175; `image-model-comparison.md` L107 | OFFICIAL | YES-should → `16` |
| Z-Image Turbo | `speed` | "very fast (8-9 steps)" | 8 is the **NFE count**; the value you type is **9** (vendor comment: `num_inference_steps=9, # This actually results in 8 DiT forwards`). ComfyUI's shipped template types 8 | FOLD-IN **A35** | OFFICIAL + STAFF | YES-should |
| Z-Image Turbo | `warn` | "no negatives" | **Correct for Turbo**, confirmed three ways: code (`do_classifier_free_guidance = self._guidance_scale > 0`, Turbo ships `guidance_scale=0.0`), STAFF (`Cxxs`, Tongyi-MAI: *"this model does not use negative prompts"*), and the official graph (no second `CLIPTextEncode`; node 33 `ConditioningZeroOut`, cfg 1). A36's list names **Base**, not Turbo | `z-image.md` items 5, 9; FOLD-IN **A36**; this file §3 | OFFICIAL + STAFF | NO-keep; add the NegPiP route clause and B1's `max_sequence_length=1024` remedy (YES-should) |
| Z-Image Base | `disk` | `~13 GB` | Transformer 12.31 GB ✓ but the full diffusers repo is **~20.5 GB** (Qwen3-4B encoder 8.045 + VAE 0.168) | HF tree `Tongyi-MAI/Z-Image?recursive=true` | OFFICIAL | YES-should |
| Z-Image Base | `best` | "rich seed variety" | The vendor's **own** diversity tier table is Omni-Base **High** / Z-Image **Medium** / Turbo **Low**. "Rich" overstates a *Medium* tier | `image-model-comparison.md` §9.1 (OFFICIAL) | OFFICIAL | YES-should |
| Z-Image Base | `warn` | `cfg_normalization` "off=stylized, on=realism" | It is a **CFG-burn limiter** — clamps the guided prediction's norm to `cfg_normalization ×` the positive-only norm — and it is a **float** (True = 1.0; 1.2 is legal). The off/on line exists on the **GitHub README only**; the HF card drops it | FOLD-IN **B2**; `z-image.md` items 2-4 | OFFICIAL | YES-should (keep the advice, drop the "quality switch" framing) |
| Z-Image Base | `min`/`comfy` | `10` / `16` | **No first-party VRAM figure for Base exists in the corpus** — these are extrapolated from Turbo's *"fits comfortably within 16G"* | `z-image.md`; `verification-2026-09.md` **K38** | UNSOURCED | NO-keep, but label as inference |
| **Qwen-Image 2512** | `comfy` | `16` | Smallest non-GGUF DiT is **fp8 20.43 GB**. Corpus: 8 GB "offload only", 12 GB "GGUF/offload", 16 GB **"fp8 tight"**, **24 GB comfortable** | HF `Comfy-Org/Qwen-Image_ComfyUI?blobs=true`; `image-model-comparison.md` §8.3 | OFFICIAL + SYNTHESIS | **YES-must** → `24` |
| Qwen-Image 2512 | `disk` | `~40 GB (Q4 ~12)` | bf16 DiT **40.86 GB** ✓ — but DiT alone. + encoder 9.38 GB (fp8) / 16.58 (bf16) + VAE 0.25 → practical fp8 set ≈ **30.1 GB** | same | OFFICIAL | YES-should |
| Qwen-Image 2512 | `speed` | "slow (40-50 steps)" | The official 2512 **T2I** recipe is **50 steps / cfg 4.0**; 40 is the *Edit* number. The Comfy 2512 template's standard subgraph is 50 | `qwen-image.md` **X8**, **X9** | OFFICIAL | YES-should |
| **Qwen-Image-Edit-2511** | `comfy` | `16` | Smallest 2511 quant is **fp8mixed 20.53 GB** / int8_convrot 20.50 GB. **There is no plain `fp8_e4m3fn` build for 2511.** Plus a 9.38 GB encoder and reference-image activations | HF tree `Comfy-Org/Qwen-Image-Edit_ComfyUI/split_files/diffusion_models` | OFFICIAL | **YES-must** → `24` |
| Qwen-Image-Edit-2511 | `disk` | `~40 GB` | bf16 = **40.86 GB** ✓ exact — but **no quantised path is signposted at all**, unlike row 18, so its `min:12` is unreachable from anything the row tells the user | same | OFFICIAL | YES-should |
| Qwen-Image-Edit-2511 | `best` | `"pose from image 3"` | **`image N` appears on no first-party surface.** Three official phrasings exist and disagree: rewriter `picture 1/2`; README Edit-2509 uses spatial roles with **no index**; README SGLang uses **`Figure 1/2`**. No first-party source ranks them | `qwen-image.md` §New official guidance **#9**, **X5** | OFFICIAL (the variants) / SPECULATION (any ranking) | **YES-must** (drop the quotation marks) |
| Qwen-Image-Edit-2511 | `warn` | "sample several seeds" (unconditional) | Correct on the **non-distilled** model; at Lightning 4/8 steps multiple reporters see near-identical output across seeds | `qwen-image.md` **X7** (LORE, n≈3) | LORE | YES-should (condition it) |
| **Krea 2 (Turbo/Raw)** | `warn` | "near-zero seed variety" | **Unsourced and pointed the wrong way.** Krea's tech report verbatim: *"One failure mode we explicitly optimize against is diversity collapse… rewarding intra-group visual diversity"*. Krea 2 is **absent** from the OneIG diversity table. The corpus routes **Krea 2 Raw** as a *seed-variety* pick, and the row covers Turbo *and* Raw | `krea-character-art.md` §3.2 L343-346; `image-model-comparison.md` §1.1 L111, L342 | UNSOURCED | **YES-must** (delete, or scope to Turbo as unmeasured) |
| Krea 2 (Turbo/Raw) | `lic` | `Custom (<$1M/<50 seats)` | See the dedicated finding below — the **$1M is OFFICIAL and correct**; the **"50 seats" is refuted, not merely unsourced** | `Comfy-Org/Krea-2` `LICENSE.pdf` §2.3 (2026-09-10) | OFFICIAL | **YES-must** — but the live file's replacement is *also* wrong |
| Krea 2 (Turbo/Raw) | `warn` | "No independent benchmarks" | **Still true.** Absent from T2I-CoReBench, GenEval, GenEval 2, DPG-Bench, T2I-CompBench, WISE_Verified and OneIG diversity. Krea's *"#1 from an independent lab"* refers to **hosted** models not tagged "Open Weights" | `image-model-comparison.md` §0(3), §2.2-2.4, §3, §11(3)(b) | OFFICIAL absence | NO-keep (optionally sharpen) |
| **LongCat-Image** | `min`/`comfy` | **`6` / `10`** | Official README code comment: `pipe.enable_model_cpu_offload()  # Offload to CPU to save VRAM (Required ~17 GB); slower but prevents OOM` — and the non-offloaded line is *"Uncomment for high VRAM devices"*. Corpus VRAM table: 8 GB ❌, 12 GB ❌, 16 GB marginal | `huggingface.co/meituan-longcat/LongCat-Image/raw/main/README.md` (2026-09-10); `image-model-comparison.md` §8.3 | OFFICIAL | **YES-must** → ≈ `16` / `24` |
| LongCat-Image | `disk` | `~12 GB` | Transformer 12.54 GB ✓ — but the pipeline loads the **whole repo**: text_encoder **16.59 GB** (5 shards) + VAE 0.168 → **~29.3 GB** | HF tree `meituan-longcat/LongCat-Image?recursive=true` | OFFICIAL | **YES-must** |
| LongCat-Image | `speed` | `fast` | Official quick-start: **`num_inference_steps=50, guidance_scale=4.0, enable_cfg_renorm=True`** — 50 steps with real CFG ≈ 100 NFE, on a CPU-offloaded path the vendor itself calls *"slower"*. The 8-step "10× speedup" build is **LongCat-Image-Edit-Turbo**, a different checkpoint | same README; `image-model-comparison.md` §8.1 | OFFICIAL | **YES-must** |
| LongCat-Image | `ease` | `3` | Zero ControlNets, zero IP-Adapters, zero LoRA-trainer support (kohya / musubi / ai-toolkit all ✗) — it is the ✗-nothing ecosystem row | `image-model-comparison.md` §7.7 L1096, L1104, L1379 | SYNTHESIS | YES-should → `2` |

**Image rows verified correct:** SDXL `min:6/comfy:8` (8 GB is the sourced floor, 6 is community practice with offload), `speed/ease:5/licClass`, "weakest text rendering" ✓ · Illustrious/NoobAI `min/comfy/disk/speed/tags` ✓, "Danbooru tag dialect" ✓ · FLUX.1 `ease:4/licClass`, "keeps Fill/Redux tooling FLUX.2 dropped" ✓, "no negatives (CFG 1)" ✓ · FLUX.2 dev `comfy:64/ease:2/licClass`, "T2I-CoReBench 64.4" ✓, "JSON-structured prompts" ✓, "no Fill/Redux" ✓ · klein 9B `tags/speed/licClass`, "8.3M human votes" ✓ · klein 4B `speed/ease/lic/licClass` ✓ Apache 2.0 (H7 confirms the 4B/9B split), "no upsampler" ✓ · Z-Image Turbo `min:6/ease/lic/licClass/tags`, "OneIG-EN 0.994" ✓, "low seed diversity" ✓ (vendor tier: Low) · Z-Image Base `speed` (OFFICIAL 28-50 / CFG 3-5), `lic/licClass/tags/ease`, "real CFG + negatives" ✓ **consistent with A36** (whose corrected list names Z-Image Base) · Qwen 2512 `lic/licClass`, `min:12` defensible **only** via the signposted GGUF path, "Lightning LoRAs drop CFG to 1 and kill negatives" ✓ X8, "Chinese text champion" ✓ (ChineseWord L1 97.29) · Qwen-Edit-2511 `lic/licClass/tags/speed`, "role binding can swap or fail" ✓ · Krea 2 `disk '~13 GB FP8'` **exact** (`krea2_turbo_fp8_scaled.safetensors` = 13,141,730,784 B), `min:12/comfy:16/speed/licClass:risk`, "ComfyUI wants CFG 1.0 (not 0)" ✓, "prompt_enhance default trap" ✓ A29 + the template's `Refine Prompt? = true` · LongCat `lic 'Apache 2.0'` ✓ (card front-matter), both `best` figures ✓ (ChineseWord L3 **70.3** vs 2-6, arXiv:2512.07584 Tab.7; GenEval **0.87** at 6B ties 20B Qwen, Tab.2), "quoted text is mandatory" ✓ (*"will severely compromise the text rendering capability"*).

### Finding of the run: FOLD-IN H8 / A29 should be RETIRED, not folded

FOLD-IN **H8** and **A29** and verifier **K40** all record Krea 2's licence thresholds as
*unsourced*, blocked behind *"a PDF in a gated repo"*. **That blocker is wrong.**
`krea/Krea-2-Turbo` is gated, but **`Comfy-Org/Krea-2` is `gated:false` and carries its own
`LICENSE.pdf` at the repo root.** It was fetched and extracted this pass (14,646 characters):

> **KREA 2 COMMUNITY LICENSE AGREEMENT, v.1, Date: June 22, 2026** — Krea.ai, Inc., a Delaware corporation.
> **§2.3:** *"Commercial Use under this Agreement of the Krea Model, Derivatives, or Outputs is permitted only if you (including all affiliated entities under common ownership or control) have total company-wide annual revenue of less than one million United States dollars ($1,000,000 USD), calculated on a trailing twelve-month basis and including all revenue from all sources."*

Also confirmed verbatim: §2.1 the grant is **revocable**; §3.1(b) derivative model names must begin
*"Krea"*; §3.1(c) a NOTICE file with a fixed attribution string; §3.3 no removal of notices;
§4.1(c) no circumventing *"content provenance, or watermarking mechanisms"*; **§4.2 Content
Filtering Requirement**; §4.3 AI-disclosure where required by law; §5.3 *"You own all Outputs you
generate… Krea claims no ownership of Outputs"*; §9.2 termination for convenience on 30 days'
notice; §9.3 litigation termination; §10.1 Delaware law.

Consequences:

* **The `$1M` is real and OFFICIAL** — the app's original number was correct all along.
* **The `50 seats` is not merely unsourced, it is refuted.** The strings "seat", "seats" and every
  user-count formulation are **absent from the entire document**. It traces to a single blog
  (`localaimaster.com`, 2026-07-20) that `krea-character-art.md` already graded LORE.
* **The live file's already-applied replacement — `'Custom (Krea Community License; thresholds
  unverified)'` — is now also wrong**: it under-claims a threshold that is verified.
* The corpus already had this right: `image-model-comparison.md` §10 line 1276 carries the Krea row
  with clause-level citations (§2.3 trailing-12-month revenue cap, §3.1 naming, §4.2 filters, §9.2
  revocation, Delaware, "you own the outputs"), every one confirmed by the PDF. Verifier **K40**
  checked `krea-character-art.md` and the model card but **not** `image-model-comparison.md` §10.

### The picker's own rubric is internally inconsistent

Krea 2's **$1M** revenue cap ⇒ `licClass:'risk'`, while LTX's **$10M** revenue cap ⇒
`licClass:'ok'`. Same clause type, opposite class — and the app graded Krea `risk` on figures it
believed *unverified* while giving LTX, whose restrictive clauses are quoted verbatim in the
corpus, a clean bill. Whatever the rule is, it should be written down once and applied uniformly.

### A rendering bug with licence consequences (`renderPicker`, line 1698)

```js
<span class="pk-lic${m.licClass === 'risk' ? ' risk' : ''}">${esc(m.lic)}</span>
```

Only `'risk'` gets the red badge. **`'nc'` and `'ok'` render identically**, so FLUX.1 dev,
FLUX.2 dev and klein 9B — three non-commercial models — look exactly like Apache-2.0 rows to
anyone scanning, and the `lic` text string is the only signal. Fix in the renderer (a distinct
amber badge for `nc`) rather than by re-classing rows.

Related: **the "free/commercial only" filter is `m.licClass === 'ok'`**, and it currently produces
one **false positive** (Illustrious/NoobAI, whose licence forbids commercialising even the
generated images) and one **false negative** (FLUX.1 schnell is Apache 2.0 and fully commercial,
but is bundled into a row classed `nc`, so the filter hides it). The false positive is the
dangerous one.

### Corrected data block

In the app constant's shape. Only rows and fields with a change are shown; **`[already applied]`
rows reflect the concurrent editor's work and are reproduced only for completeness.** Where a
number rests on a quantisation tier, the tier is now stated inside the string — that is the
point of the change, not padding.

```js
/* ================= model picker ================= */
const MODELSPEC = [
  // kind:v/i · min/comfy VRAM GB · ease 1-5 · lic: ok|nc|risk
  // RULE: min/comfy/disk in one row must name ONE precision, and `disk` is the COMPLETE
  //       set the official ComfyUI template loads (model + text encoder + VAE).
  {name:'Wan 2.2 TI2V-5B', kind:'v', tags:['t2v','i2v'], min:8, comfy:20, disk:'~18 GB fp16 set', speed:'medium', ease:4, lic:'Apache 2.0', licClass:'ok',
   best:'Entry-level video that punches up: solid scene fidelity on a consumer card, and the easiest video graph in ComfyUI to run.',
   warn:'Camera-following is weak across the Wan family (measured on the 14B, not the 5B); 720p class. 8 GB is ComfyUI\'s claim; the one measured run peaked at 18.6 GB at the template\'s own 1280x704/121f default.'},

  {name:'Wan 2.2 A14B (T2V/I2V)', kind:'v', tags:['t2v','i2v'], min:12, comfy:24, disk:'~29 GB fp8 experts (~36 GB with encoder+VAE)', speed:'slow', ease:3, lic:'Apache 2.0', licClass:'ok',
   best:'Best open scene semantics (Scene Depiction 96.43, Object types 72.62). The open-weight workhorse.',
   warn:'Weakest measured camera-follower (CMC 42.86); realism bias drags anime toward live-action. Official floor is 80 GB — 12/24 GB assume community GGUF Q4/Q8, one expert resident at a time.'},

  {name:'LTX 2.3 (distilled)', kind:'v', tags:['t2v','i2v','audio'], min:16, comfy:32, disk:'~54 GB (46 GB checkpoint + 7.6 GB distilled LoRA)', speed:'fast (8-step)', ease:3, lic:'LTX-2.x Community License', licClass:'nc',
   best:'Fastest iteration loop (~5.7x Wan) with native audio foley — the seed-hunting workhorse.',
   warn:'Vendor README says 32 GB+ VRAM; the sub-16 GB reports are LTX-2.5 int8, not 2.3. Negatives are never required (CFG 1) and whether they do anything is UNTESTED. Native speech is gibberish (mux TTS); camera weak. Needs the RES4LYF custom-node pack. Licence: free only under $10M annual revenues; no competing model (#18) or competing product (#20); do not remove watermarking/provenance (S6); disclose machine-generated content (#5).'},

  {name:'LTX 2.5', kind:'v', tags:['t2v','i2v','audio','multishot'], min:12, comfy:24, disk:'~22 GB int8-convrot (bf16 transformer ~42 GB)', speed:'fast-ish', ease:3, lic:'LTX-2.x Community License (gated DL)', licClass:'nc',
   best:'Native multi-shot with named cuts + duration control; most 2.3 LoRAs transfer (HDR, Dub-It and Relight are 2.3-only).',
   warn:'VRAM numbers are the int8-convrot path (tested on a 3060 12 GB); the vendor README says 32 GB+. Slower per clip than 2.3. H3 handled cut transitions better in the one I2V comparison that exists — which did not exercise 2.5\'s multi-shot at all. Gated download. Same $10M / no-competing-model licence as 2.3.'},

  {name:'MiniMax H3', kind:'v', tags:['t2v','audio','multishot','edit','ref'], min:12, comfy:16, disk:'~42 GB int8 (bf16 stack ~124 GB)', speed:'very slow', ease:2, lic:'Territory-restricted — outputs too', licClass:'risk',
   best:'The audiovisual native: stereo audio, dialogue, faithful cuts, on-screen text, reference-driven editing (#1 editing Elo, ~10,280 votes — a preference score, not adherence).',
   warn:'MiniMax publishes NO minimum VRAM; the official pruned-int8 build runs 480p+audio at 12.5-15.6 GiB and has completed on 16 GB and 24 GB cards. bf16 is 62 GiB model + 48 GiB encoder (you need one diffusion checkpoint at a time). Licence excludes US/EU/UK/KR and the ban covers the OUTPUTS, not just the weights; $20M gate, attribution is a "shall", no distillation. A LoRA trained on H3 inherits H3\'s licence — never infer permission from an uploader\'s apache-2.0 tag. Two official sources conflict on commercial use: the licence grants it inside the Applicable Territory, Comfy says you must buy through them. 5-15s, 768p local.'},

  {name:'SCAIL-2', kind:'v', tags:['swap','long','i2v'], min:12, comfy:24, disk:'11-33 GB (int8 stack ~21 GB)', speed:'medium/chunk', ease:2, lic:'Apache 2.0 (code) / MIT (weights) — surfaces disagree', licClass:'ok',
   best:'Exact motion transfer and character replacement (Appearance Consistency 4.38), arbitrary length via 81-frame chunks.',
   warn:'PROMPT-SUBORDINATE, not prompt-inert — the vendor says long detailed prompts beat short ones, but masks and drive quality dominate. Mask polarity INVERTS between Animation and Replacement modes and masks need the exact trained 6-colour palette; canvas must divide by 32, not 16. The official template ships two filename bugs that each throw a bare "Value not in list" and must be fixed in BOTH the Base and Extend subgraphs. Drift accumulates across chunks. Silent output. No official VRAM floor: ~27 GB of weights, one measured run peaked under 24 GB.'},

  {name:'Wan2.2-Animate-2', kind:'v', tags:['swap'], min:24, comfy:32, disk:'~25 GB int8 (~40 GB bf16)', speed:'slow', ease:2, lic:'Apache 2.0', licClass:'ok',
   best:'Character animation with independent text-driven camera (48 viewpoints) — on paper.',
   warn:'No consumer VRAM figure exists (tuned for 8x A800; 480P on 2x A800) — these numbers are derived from the 16.65 GB int8 weights, not measured. WanAnimate2Cache also costs ~12.5 GB system RAM. Essentially untested in the wild (zero community recipes). Chinese two-field dialect that captions the REFERENCE IMAGE only — motion comes from the driving video. CFG is 0.0-1.0 across the official configs, so negatives are not live.'},

  // [already applied by the concurrent editor — disk/best/warn only]
  {name:'Wan-Dancer-14B', kind:'v', tags:['dance'], min:0, comfy:0, disk:'14B class (no size published)', speed:'slow', ease:1, lic:'Apache 2.0', licClass:'ok',
   best:'Music-to-dance video with LIVE CFG 5.0 + negative prompts (rare in 2026 video); fixed caption schema, not the Wan cinematic formula.',
   warn:'Young ecosystem, few community recipes yet; the global stage asserts world_size == 8 (8 GPUs) and no single-GPU VRAM figure is published. Takes no English prompt — the input is a fixed Chinese caption schema.'},
  // NOTE on min/comfy above: there is no honest integer. Either keep 16/24 and say in `warn`
  // that they are unsourced, or introduce a sentinel (min:0) that renderPicker() renders as
  // "VRAM not published" instead of a fit verdict. The latter is preferable — as written the
  // picker currently tells a 24 GB owner "comfortable" for an 8-GPU pipeline.

  {name:'FramePack', kind:'v', tags:['t2v','i2v','long'], min:6, comfy:8, disk:'~26 GB transformer (+ VAE and 3 encoders, total unmeasured)', speed:'slow, steady', ease:4, lic:'Apache 2.0', licClass:'ok',
   best:'Runs on 6 GB of VRAM, makes 60-second clips, and is the best measured local camera-follower (CMC 71.43, 5/7 commanded motions).',
   warn:'The 6 GB is VRAM only — it also needs 36-45 GB of SYSTEM RAM, transiently 70-90 GB on a first LoRA merge, which a 6 GB laptop will not have. Weakest overall visual quality of the roster (Objects 35.71); fixed 25-step recipe.'},

  {name:'SDXL photoreal (Juggernaut/RealVis)', kind:'i', tags:['photo'], min:6, comfy:8, disk:'~7 GB', speed:'fast', ease:5, lic:'SDXL base OpenRAIL++-M; finetune licences vary', licClass:'ok',
   best:'Cheapest capable photoreal + the most mature ControlNet/regional-control ecosystem.',
   warn:'CLIP chunks at 75 tokens and concatenates — nothing is discarded, but relations across a chunk boundary are lost. Weakest text rendering; quality-tag/sampler advice varies per checkpoint. OpenRAIL++-M covers SDXL base 1.0 only — the Civitai finetunes have their own terms (Juggernaut Z is CC BY-NC 4.0); check the checkpoint page.'},

  {name:'Illustrious / NoobAI (anime)', kind:'i', tags:['anime'], min:6, comfy:8, disk:'~7 GB', speed:'fast', ease:4, lic:'FAIPL-1.0-SD (NoobAI: NO commercial) / OpenRAIL++-M (Illustrious v2.0)', licClass:'risk',
   best:'Still the anime backbone — the Illustrious/NoobAI lineage is what the popular anime checkpoints build on. Full ControlNet support.', // [best already applied]
   warn:'LICENCE: NoobAI-XL prohibits ALL commercialisation — including of the images you generate — and forces you to open-source derivatives, merges and LoRAs. Illustrious v0.1 is the same FAIPL copyleft; only Illustrious v2.0 is OpenRAIL++-M (commercial OK), and Animagine XL 4.0 is OpenRAIL++-M too. Pony V6, taught elsewhere in this app, additionally forbids monetized inference (carve-out only for Civitai and Hugging Face). One row, several licences — read the checkpoint card. Danbooru tag dialect; each derivative has its own quality-tag scheme. NoobAI v-pred needs Euler/DDIM + v_prediction + rescale_betas_zero_snr + CFG-Rescale ~0.2 or the output is visibly broken.'},

  {name:'FLUX.1 dev / schnell / Krea', kind:'i', tags:['photo'], min:12, comfy:16, disk:'~24 GB all-in-one (fp8 ~17 GB; GGUF DiT 7-13 + T5 separately)', speed:'medium', ease:4, lic:'schnell Apache 2.0 - dev + Krea dev NON-COMMERCIAL', licClass:'nc',
   best:'Great prose adherence per VRAM; keeps Fill/Redux tooling FLUX.2 dropped; Krea dev fights the AI look.',
   warn:'No negatives (CFG 1); dev/Krea truncate silently at T5\'s 512 tokens. dev and Krea dev weights are non-commercial; schnell is Apache 2.0 and fully commercial. min 12 is the sourced dev floor; 8 GB is GGUF Q4 with offload.'},

  {name:'FLUX.2 dev', kind:'i', tags:['photo','ref'], min:20, comfy:64, disk:'~54 GB fp8 set (35.5 DiT + 18 encoder + VAE)', speed:'slow', ease:2, lic:'FLUX Non-Commercial (gated; filters mandatory)', licClass:'nc',
   best:'Best open-model raw adherence (T2I-CoReBench 64.4); JSON-structured prompts for complex scenes.',
   warn:'Monster hardware (bf16 + CPU offload ~62 GB; ~20 GB only via NF4 + 4-bit encoder + offload); no Fill/Redux. Strong on sparse text (UniGenBench++ EN-short 85.34, best open model) but near the bottom on dense text (BizGenEval Text-hard 1.0). Gated, and the card makes filters or manual review mandatory.'},

  {name:'FLUX.2 klein 9B', kind:'i', tags:['photo','ref','edit'], min:16, comfy:24, disk:'~27 GB fp8 set (~35 GB bf16)', speed:'fast (distilled)', ease:3, lic:'FLUX Non-Commercial (filters mandatory)', licClass:'nc',
   best:'Best measured multi-image reference of any open model (8.3M human votes).',
   warn:'Needs a size-matched Qwen3-8B text encoder (4B pairs with Qwen3-4B); a mismatch throws "mat1 and mat2 shapes cannot be multiplied" at the sampler. ComfyUI\'s own Flux 2 page does not hand you the right encoder. BFL\'s figure is ~29 GB / RTX 4090+ — 16 GB is marginal and 12 GB is GGUF-only. Non-commercial, gated, and the card makes content filters or manual review mandatory.'}, // [warn encoder sentence already applied]

  {name:'FLUX.2 klein 4B', kind:'i', tags:['photo'], min:8, comfy:12, disk:'~16 GB bf16 set (~12 GB with an fp4 encoder)', speed:'very fast', ease:4, lic:'Apache 2.0', licClass:'ok',
   best:'The laptop champion (1.2 s/image on a 5090) with unrestricted commercial use.',
   warn:'No upsampler — your prompt must carry all the detail. ComfyUI measured 8.4 GB on a 5090 while BFL\'s own docs say ~13 GB and its repo README says ~8 GB; plan for 12. Needs the size-matched Qwen3-4B encoder.'},

  {name:'Z-Image Turbo', kind:'i', tags:['photo','textEN','textZH'], min:6, comfy:16, disk:'~21 GB bf16 set (~8-10 GB fully quantised)', speed:'very fast (9 scheduler steps = 8 NFE)', ease:4, lic:'Apache 2.0', licClass:'ok',
   best:'Best short-text-per-VRAM anywhere (OneIG-EN 0.994), fully bilingual, tiny and quick.',
   warn:'Low seed diversity — vendor\'s own tier is Low; vary wording, not seeds. No negative through guidance (guidance_scale 0 skips the branch entirely; the community NegPiP node gives one via signed positive conditioning). Silent truncation at 512 tokens — staff say to set max_sequence_length=1024. The vendor\'s bf16 file is 12.3 GB, so sub-16 GB means int8/nvfp4.'},

  {name:'Z-Image Base', kind:'i', tags:['photo','textEN','textZH'], min:10, comfy:16, disk:'~13 GB DiT (~20 GB full set)', speed:'medium (28-50 steps)', ease:3, lic:'Apache 2.0', licClass:'ok',
   best:'The composition pick: real CFG + negatives, long-text strength, and the more varied of the pair (vendor tier: Base Medium, Turbo Low).',
   warn:'Slower. cfg_normalization is a CFG-burn limiter, not a style switch — it clamps the guided prediction\'s norm to N x the positive-only norm, and it is a float (True = 1.0; 1.2 is legal); off reads stylized, on reads realism. VRAM figures are extrapolated from Turbo — no first-party Base number is published.'},

  {name:'Qwen-Image 2512', kind:'i', tags:['photo','textZH','textEN'], min:12, comfy:24, disk:'~30 GB fp8 set (bf16 DiT alone ~41 GB; Q4 ~12)', speed:'slow (50 steps, cfg 4.0)', ease:3, lic:'Apache 2.0', licClass:'ok',
   best:'Chinese text champion (ChineseWord L1 97.29); long English paragraphs; dense multi-region posters.',
   warn:'Big download; the smallest non-GGUF DiT is 20.4 GB, so 16 GB is tight and 24 GB is comfortable — min 12 is the GGUF/offload path only. Lightning LoRAs drop CFG to 1 and kill negatives.'},

  {name:'Qwen-Image-Edit-2511', kind:'i', tags:['edit','ref'], min:12, comfy:24, disk:'~40 GB bf16 (fp8mixed/int8 ~20.5 GB; no fp8_e4m3fn build exists)', speed:'slow', ease:3, lic:'Apache 2.0', licClass:'ok',
   best:'Instruction editing with indexed or spatial multi-image roles — the vendor\'s own surfaces use picture N, Figure N and plain spatial words, and disagree on which is best.',
   warn:'Role binding can swap or fail — on the non-distilled path, sample several seeds; at Lightning 4/8 steps seeds barely move, so vary the prompt or the reference instead. Smallest quant is 20.5 GB, so 16 GB is tight.'},

  {name:'Krea 2 (Turbo/Raw)', kind:'i', tags:['paint','photo'], min:12, comfy:16, disk:'~13 GB FP8', speed:'fast (Turbo 8)', ease:3, lic:'Krea 2 Community License (commercial only under $1M/yr)', licClass:'risk',
   best:'The painterly/anti-AI-look pick — flat-background character art, matte texture.',
   warn:'No independent benchmark of the open weights (the "#1 from an independent lab" claim is about Krea\'s hosted models); ComfyUI wants CFG 1.0 (not 0); prompt_enhance default trap. Licence: commercial use only while company-wide annual revenue (trailing 12 months, all sources, all affiliates) is under $1,000,000; S4.2 makes content filtering an obligation, S4.1(c) forbids removing watermarking/provenance, S3.1 requires derivative names to begin "Krea", and S9.2 lets Krea terminate for convenience on 30 days\' notice. You own your outputs (S5.3).'},

  {name:'LongCat-Image', kind:'i', tags:['textZH'], min:16, comfy:24, disk:'~29 GB (12.5 GB DiT + 16.6 GB encoder)', speed:'slow (50 steps, CFG 4.0)', ease:2, lic:'Apache 2.0', licClass:'ok',
   best:'Rare Chinese characters solved (ChineseWord L3 70.3 where everyone else scores 2-6); ties 20B Qwen on GenEval at 6B (0.87).',
   warn:'The vendor\'s own memory-saving path (enable_model_cpu_offload) still needs ~17 GB and is explicitly "slower"; 8 and 12 GB do not run it. The encoder ships in the same repo, so the real download is ~29 GB, not ~12. The 8-step "10x speedup" build is LongCat-Image-Edit-Turbo, a different checkpoint. Quoted text is mandatory syntax; no ControlNets, no IP-Adapters, no LoRA-trainer support.'}
];
```

**Two things the block cannot express, and the renderer should:**

1. `Wan-Dancer-14B` has **no honest `min`/`comfy` integer** — the official pipeline needs 8 GPUs
   and no single-GPU figure exists. `renderPicker()` should learn a sentinel (e.g. `min: 0`)
   rendered as **"VRAM not published"** instead of a fit verdict. As shipped, the picker tells a
   24 GB owner "✓ comfortable" for an 8-GPU pipeline. The same sentinel would serve
   `Wan2.2-Animate-2`, whose numbers above are derived from file sizes, not measured.
2. `licClass:'nc'` needs its own badge (see the rendering bug above).

## Licence flags to add

Each is a candidate `warn` clause, a `KNOWLEDGE` line or a GOTCHAS card. **OFFICIAL unless noted.**

| # | row | what the source says | current `lic` / `licClass` | proposed | FOLD-IN |
|---|---|---|---|---|---|
| L1 | **Illustrious / NoobAI** | NoobAI-XL: `fair-ai-public-license-1.0-sd`, *"II. Commercial Prohibition — We prohibit any form of commercialization… of the model, derivative models, or **model-generated products**"* + §III mandatory open-sourcing of derivatives, merges, LoRAs | `varies/checkpoint` / **`ok`** | `FAIPL-1.0-SD (NoobAI: NO commercial) / OpenRAIL++-M (Illustrious v2.0)` / **`risk`** + warn sentence | **H3** — *re-verified verbatim 2026-09-10; H3's "re-verify before folding" caveat is now discharged* |
| L2 | Illustrious / NoobAI | **Animagine XL 4.0 is OpenRAIL++-M — commercial use is fine.** State it so the notice reads as guidance, not blanket discouragement | absent | warn clause | **H5** (re-verified: `cagliostrolab/animagine-xl-4.0` carries `license:openrail++`) |
| L3 | Illustrious / NoobAI | **Pony V6** uses a modified FAIPL banning inference on any monetized site or app, carve-out only for Civitai and Hugging Face. **The picker has no Pony row**, so H4 has nowhere to live even though the app teaches the Pony score ladder in `KNOWLEDGE` | absent | warn clause | **H4** — ⚠ **NOT re-verified**: the HF mirror `LyliaEngine/Pony_Diffusion_V6_XL` is tagged `cdla-permissive-2.0`, which is the **uploader's** tag, not Pony's licence; the real terms live on Civitai, which returns empty to automated checks. This mirror tag is itself a live instance of H2's *"never infer permission from an uploader's tag"* |
| L4 | **MiniMax H3** | §V.4 + Exhibit A item 1 extend the ban to the **Outputs**, not just the weights; §IV.2 is a *shall* (attribution) while "Powered by" is only encouraged | `Regional restrictions` / `risk` | `Territory-restricted — outputs too` / `risk` + warn | **H1 / B6** |
| L5 | MiniMax H3 | §I.11 makes any LoRA / distillation / synthetic-data derivative a **Model Derivative** inheriting every term including the output ban; several HF H3 LoRAs are tagged `apache-2.0` anyway | absent | warn: *"never infer permission from an uploader's tag"* | **H2** (licence OFFICIAL, compliance observation SPECULATION) |
| L6 | MiniMax H3 | Licence grants royalty-free commercial use **inside** the Applicable Territory; docs.comfy.org says *"Commercial use of locally generated outputs requires a MiniMax commercial license, available through Comfy, the only official reseller"* | absent | warn: teach the split, don't resolve it | **H9b** (OFFICIAL vs OFFICIAL; the reconciliation is SPECULATION) |
| L7 | **LTX 2.3** | LTX-2.x Community Licence: paid at *"annual revenues of at least $10,000,000"* (annual **revenues**, not ARR), §1.6 aggregates affiliates; Attachment A **#18** no competing model, **#20** no competing product, **§6** no removing watermarking/provenance, **#5** disclose machine-generated content | `LTXV open` / **`ok`** | `LTX-2.x Community License` / **`nc`** + warn | **H6 / A13** |
| L8 | **LTX 2.5** | Same licence; the gate is an HF access gate, not a licence name | `LTXV (gated)` / **`ok`** | `LTX-2.x Community License (gated DL)` / **`nc`** + same warn | **H6 / A13** |
| L9 | **FLUX.2 klein 9B** | 9B and 9B-KV are FLUX **Non-Commercial**, *and* Responsible AI §5: *"Filters or manual review **must** be used with the FLUX.2 [klein] 9B models"*. **4B is Apache 2.0** — the split is real | `Non-commercial` / `nc` | `FLUX Non-Commercial (filters mandatory)` / `nc` + warn | **H7** — ⚠ `flux2_overview` was not re-fetched by the verifier (#29) and was not re-fetched here either |
| L10 | **FLUX.2 dev** | `image-model-comparison.md` §10 groups *"FLUX.2 [dev], klein 9B, Base 9B, 9B-KV"* under *"gated; filters or manual review are mandatory"* | `Non-commercial` / `nc` | `FLUX Non-Commercial (gated; filters mandatory)` / `nc` | **H7**-adjacent |
| L11 | **SCAIL-2** | Code repo Apache 2.0 (*"Copyright 2026 Zhipu AI"*); every distribution surface (HF, ModelScope, `Comfy-Org/SCAIL-2`) tagged **MIT**. Both permissive — *state* the conflict | `Apache 2.0` / `ok` | `Apache 2.0 (code) / MIT (weights) — surfaces disagree` / `ok` | **H9a** |
| L12 | **Krea 2** | `LICENSE.pdf` v.1 (2026-06-22) §2.3: commercial use only under **$1,000,000** company-wide annual revenue, trailing 12 months, all sources, all affiliates. **"Seats" appear nowhere in the document.** Plus §4.2 filters, §4.1(c) provenance, §3.1 naming, §9.2 termination for convenience, §5.3 you own the outputs, §10.1 Delaware | `Custom (<$1M/<50 seats)` — and the live file's `Custom (Krea Community License; thresholds unverified)` is also wrong | `Krea 2 Community License (commercial only under $1M/yr)` / `risk` + warn | **H8 / A29 — RETIRE, do not fold** |
| L13 | **SDXL photoreal** | `RAIL++-M` is SDXL **base 1.0**'s licence. Corpus: *"Pony V6 / Juggernaut XL / RealVisXL — no evidence found this pass — do not assert"*; **Juggernaut Z is CC BY-NC 4.0** | `RAIL++-M` / `ok` | `SDXL base OpenRAIL++-M; finetune licences vary` / `ok` + warn | (verifier finding, not a §H item) |
| L14 | **FLUX.1 family** | One row bundles **schnell (Apache 2.0, fully commercial)** with two non-commercial checkpoints and classes the lot `nc`, so the "free/commercial only" filter **hides a genuinely Apache-2.0 model** | `dev NC / schnell Apache` / `nc` | split the row, or `schnell Apache 2.0 - dev + Krea dev NON-COMMERCIAL` + warn naming which file is which | (structural) |
| L15 | **the whole table** | Krea's **$1M** cap ⇒ `risk`; LTX's **$10M** cap ⇒ `ok`. Same clause type, opposite class | — | write the rubric down once and apply it uniformly | (structural) |
| L16 | **`renderPicker()`** | Only `'risk'` gets a badge; `'nc'` renders identically to `'ok'`, so three non-commercial models look Apache-clean at a glance | — | add a distinct amber badge for `nc` | (structural) |

**Verified correct, no licence change:** Wan 2.2 TI2V-5B · Wan 2.2 A14B · Wan2.2-Animate-2 ·
Wan-Dancer-14B · FramePack · FLUX.2 klein 4B · Z-Image Turbo · Z-Image Base · Qwen-Image 2512 ·
Qwen-Image-Edit-2511 · LongCat-Image — all Apache 2.0 / `ok`, re-confirmed from HF card
front-matter on 2026-09-10.

## Nothing-found register

Things this audit looked for and could **not** establish. Recorded so a later pass does not
re-spend the budget, and so nothing here is mistaken for a verified absence.

1. **No template drift of any kind.** Seven templates, five upstream repos, three independent
   read paths — nothing changed since 2026-08-28. This is a null result, and it is the main one.
2. **`api.github.com` and `data.jsdelivr.com` return empty bodies** through `web_fetch` in this
   environment (both serve `application/json`). Blob-SHA and file-size comparison via those APIs
   is unavailable; `raw.githubusercontent.com` and `cdn.jsdelivr.net` (both `text/plain`) work.
   Consistent with `new-models.md`'s standing note that GitHub HTML commit/release views are also
   stale or empty here.
3. **`raw.githubusercontent.com` served a stale revision at least once** (the Krea 2 pre-2026-07-31
   copy). Two independent reads are now mandatory for any drift claim.
4. **Pony V6's actual licence text (FOLD-IN H4) could not be re-verified.** Civitai returns an
   empty body to automated checks and the HF mirror's `cdla-permissive-2.0` tag is the uploader's,
   not Pony's. H4 remains OFFICIAL-per-corpus but unconfirmed at source.
5. **FLUX.2 klein 9B's Responsible AI §5 filter clause was not re-fetched** — H7's `flux2_overview`
   caveat (#29) still stands after this pass too.
6. **No first-party VRAM figure exists for Z-Image Base, Wan 2.2 A14B on consumer hardware,
   Wan2.2-Animate-2 on a single GPU, Wan-Dancer-14B on any GPU, or LTX 2.3 specifically.**
   Every picker number for those rows is extrapolation. Stating that in the row is the honest fix;
   inventing a better integer is not.
7. **FramePack's total first-run download was not measured** — the transformer is 25.75 GB, but the
   VAE, llava-llama-3-8b, CLIP-L and SigLIP pulls were not summed, and the corpus states no total.
8. **The FLUX.1 GGUF "7-13 GB" range was not verified** this pass; it is DiT-only in any case.
9. **FLUX.1 schnell's T5 token cap was not confirmed** (widely reported as 256; the row's
   "512-token truncation" is verified for **dev** only).
10. **No independent benchmark of Krea 2's open weights exists** — checked T2I-CoReBench, GenEval,
    GenEval 2, DPG-Bench, T2I-CompBench, WISE_Verified, OneIG diversity, and the arena's
    Open-Weights tier. This is a *verified* absence and the row's "No independent benchmarks" is
    correct.
11. **No temporal-consistency measurement exists for Wan 2.2 TI2V-5B**, and the "highest of any
    model" figure for the family traces to a single unverified digest line (Sci-VBench 2.79).
12. **The 2026-09 register found no new local model in the 2026-08-28 → 09-03 window**
    (`research/new-models.md`), so no picker row is missing a September release. **Bernini-R**
    (ByteDance, Apache 2.0, native ComfyUI support, official Comfy-Org repackage
    `wan2.2_bernini_r_fp16.safetensors`, official docs.comfy.org tutorial) is the one candidate
    the picker does not carry — but FOLD-IN **G11** blocks it pending two unknowns (does it fit
    24 GB at fp8; does the shipped lightx2v cfg-step-distill LoRA make negatives inert), so it is
    **not** proposed as a row here.
13. **`renderPicker()` has no `nc` badge and no "VRAM unknown" state** — both are renderer gaps,
    not data gaps, and no amount of `MODELSPEC` editing fixes them.

## Sources

All accessed **2026-09-10** unless noted.

### Upstream template sources

| label | URL |
|---|---|
| Comfy-Org template index | `https://raw.githubusercontent.com/Comfy-Org/workflow_templates/main/templates/index.json` |
| SDXL simple | `https://raw.githubusercontent.com/Comfy-Org/workflow_templates/main/templates/image_sdxl_simple.json` |
| Wan 2.2 5B TI2V | `https://raw.githubusercontent.com/Comfy-Org/workflow_templates/main/templates/video_wan2_2_5B_ti2v.json` |
| Z-Image Turbo | `https://raw.githubusercontent.com/Comfy-Org/workflow_templates/main/templates/image_z_image_turbo.json` |
| Qwen-Image | `https://raw.githubusercontent.com/Comfy-Org/workflow_templates/main/templates/image_qwen_image.json` |
| FLUX.2 Klein t2i | `https://raw.githubusercontent.com/Comfy-Org/workflow_templates/main/templates/image_flux2_klein_text_to_image.json` |
| Krea 2 Turbo t2i | `https://raw.githubusercontent.com/Comfy-Org/workflow_templates/main/templates/image_krea2_turbo_t2i.json` |
| LTX 2.3 native (Comfy-Org, **not adopted**) | `https://raw.githubusercontent.com/Comfy-Org/workflow_templates/main/templates/video_ltx2_3_t2v.json` |
| LTX 2.3 vendor (the file the app embeds) | `https://raw.githubusercontent.com/Lightricks/ComfyUI-LTXVideo/master/example_workflows/2.3/LTX-2.3_T2V_I2V_Single_Stage_Distilled_Full.json` |
| jsdelivr mirror (second read path) | `https://cdn.jsdelivr.net/gh/Comfy-Org/workflow_templates@main/templates/<name>.json` |

### Hugging Face file listings and cards (picker figures)

`Comfy-Org/Wan_2.2_ComfyUI_Repackaged` · `Comfy-Org/Wan-Animate-2` · `Wan-AI/Wan2.2-Animate-2-14B` ·
`Lightricks/LTX-2.3` · `Lightricks/LTX-2.5` · `Comfy-Org/SCAIL-2` · `lllyasviel/FramePackI2V_HY` ·
`Comfy-Org/flux1-dev` · `Comfy-Org/flux2-dev` · `Comfy-Org/flux2-klein` ·
`black-forest-labs/FLUX.2-klein-9B` · `Comfy-Org/vae-text-encorder-for-flux-klein-9b` ·
`Comfy-Org/vae-text-encorder-for-flux-klein-4b` · `Comfy-Org/z_image_turbo` · `Tongyi-MAI/Z-Image` ·
`Comfy-Org/Qwen-Image_ComfyUI` · `Comfy-Org/Qwen-Image-Edit_ComfyUI` · `Comfy-Org/Krea-2`
(including its **ungated `LICENSE.pdf`**) · `meituan-longcat/LongCat-Image` ·
`Laxhar/noobai-XL-Vpred-1.0` and `Laxhar/noobai-XL-1.1` (licence re-verification) ·
`OnomaAIResearch/Illustrious-XL-v2.0` · `cagliostrolab/animagine-xl-4.0`.
Form used: `https://huggingface.co/api/models/<repo>/tree/main?recursive=true` (exact byte counts)
and `https://huggingface.co/<repo>/raw/main/README.md`.

### Repo corpus (paths under `C:\GitHub Copies\AIVideoGenPrompter`)

`PromptStudio.html` (read-only snapshot: `WF_TEMPLATES` L1725, `WF_MAP` L1728, `buildWorkflow`
L1822, `WF_RES` L1919, `wfNotes` L2167, `MODELSPEC` L1627 at snapshot / L1724 live,
`renderPicker` L1698) ·
`research\_addenda\comfy-templates\INDEX.md` and the eight verified JSONs beside it ·
`docs\FOLD-IN-2026-09.md` (A10-A13, A18-A21, A24-A31, A35-A40, B1-B12, F6, F9, G1/G11/G13, §H) ·
`research\_addenda\comfyui-ops-2026-09.md` · `research\_addenda\video-model-comparison.md` ·
`research\_addenda\video-tested-evidence.md` · `research\_addenda\image-model-comparison.md` ·
`research\_addenda\image-catch-up.md` · `research\_addenda\krea-character-art.md` ·
`research\_addenda\verification-2026-09.md` · `research\_addenda\staff-claims-2026-09.md` ·
`research\_addenda\test-kit-2026-09.md` · `research\new-models.md` (§2026-09 register) ·
`research\wan22.md` · `research\ltx23.md` · `research\minimax-h3.md` · `research\scail2.md` ·
`research\sdxl.md` · `research\flux.md` · `research\z-image.md` · `research\qwen-image.md` ·
`research\digests\2026-08-27-digest.md`.

### Papers cited through the corpus

arXiv:2512.07584 (LongCat-Image, Tab. 2 and Tab. 7) · AnimationBench CMC figures ·
T2I-CoReBench · UniGenBench++ · BizGenEval · CVTG-2K Tab. 8 · OneIG · Sci-VBench (unverified).

