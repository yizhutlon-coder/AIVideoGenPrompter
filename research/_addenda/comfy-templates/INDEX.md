# ComfyUI workflow template ground truth

Harvested 2026-08-28. Every fact below was read out of the JSON files sitting next to this
file — nothing is reconstructed from memory. Node class names, `widgets_values` orders and
link structures are quoted as they appear on disk.

Primary source: `https://github.com/Comfy-Org/workflow_templates` (official Comfy-Org
templates), fetched via `https://cdn.jsdelivr.net/gh/Comfy-Org/workflow_templates@main/<path>`.
Repo layout (from the repo README, same access date): full standalone workflows live in
`templates/`; reusable subgraph components live in `blueprints/`; both are mirrored into
`packages/media_*/`. The authoritative list of template IDs is the repo-root `bundles.json`.

## Fidelity notes

* All eight delivered files parse cleanly with `json.load`.
* `LTX-2.3_T2V_I2V_Single_Stage_Distilled_Full.json` was verified byte-exact against the
  git blob SHA published by GitHub (`1358422d7928c00b002ceeb1390822c9e5f58aee`, 54378 bytes).
* `image_qwen_image.json`, `image_z_image_turbo.json`, `image_sdxl_simple.json` and
  `video_wan2_2_5B_ti2v.json` were each fetched twice, through two independent paths, and the
  two copies were confirmed byte-identical (`cmp`) before being kept.
* Nothing was stripped from any delivered file — `extra`/`ds` viewport metadata is intact.
* One file is a **known-incomplete capture** and is named accordingly:
  `video_ltx2_3_t2v.TRUNCATED-DO-NOT-USE.json`. See graph 3 below.

## Format / schema summary

All nine files are the **UI ("workflow") format**, not the API/prompt format:
top-level `id`, `revision`, `last_node_id`, `last_link_id`, `nodes[]`, `links[]`, `groups[]`,
`config`, `extra`, `"version": 0.4`. All of them drag-and-drop into ComfyUI as-is (subject to
having the required models, and for the Lightricks file the required custom nodes).

Two link encodings coexist and a generator must handle both:

* **Top-level `links`** are positional arrays:
  `[link_id, origin_node_id, origin_slot, target_node_id, target_slot, "TYPE"]`
* **Subgraph `links`** (inside `definitions.subgraphs[].links`) are objects:
  `{"id":…, "origin_id":…, "origin_slot":…, "target_id":…, "target_slot":…, "type":"…"}`
  with `origin_id: -10` meaning the subgraph input node and `target_id: -20` the output node.

Newer frontends add fields worth knowing about:

* `widgets_values_named` — a name→value mirror of `widgets_values`, e.g. in
  `image_sdxl_simple.json` (frontendVersion 1.49.6). Only that file has it in this set.
* `properties.proxyWidgets` — on a subgraph *instance* node, a list of
  `[inner_node_id, widget_name]` pairs describing which inner widgets are surfaced.
* `properties.models` — download metadata (`name`, `url`, `directory`, sometimes `hash`).
* `properties.cnr_id` / `ver` — the comfy-core version the node was authored against.

### Subgraph parameterization — the important gotcha

Five of the eight graphs are **subgraph-wrapped**, i.e. the visible graph is 3–6 nodes and one
node whose `"type"` is a **UUID** matching an entry in `definitions.subgraphs[]`. Where the
effective parameter value lives differs by frontend version:

* **Older style** (`video_wan2_2_14B_i2v`, `image_z_image_turbo`, `image_qwen_image`,
  `image_flux2_klein_text_to_image`, `video_ltx2_3_t2v`): the instance node's
  `widgets_values` is `[]`. Defaults live on the **inner** nodes inside
  `definitions.subgraphs[0].nodes`. Edit those.
* **Newer style** (`image_krea2_turbo_t2i`): the instance node's `widgets_values` is a
  populated array whose order matches `definitions.subgraphs[0].inputs[]` element-for-element,
  and it **shadows** the inner defaults. Edit the outer array.

Either way, subgraph templates are materially harder to parameterize than flat ones. The two
flat graphs here — `image_sdxl_simple` and `video_wan2_2_5B_ti2v` — are the easy targets.

---

## 1. Wan 2.2 TI2V-5B, text-to-video (native) — VERIFIED

* File: `video_wan2_2_5B_ti2v.json` (14,523 bytes)
* Source: `https://cdn.jsdelivr.net/gh/Comfy-Org/workflow_templates@main/templates/video_wan2_2_5B_ti2v.json`
* Accessed 2026-08-28. `frontendVersion` 1.27.10, `last_node_id` 59, `last_link_id` 108.
* **Flat graph, no subgraphs.** 13 nodes, 13 links. Easiest of the video graphs to parameterize.

Node classes: `UNETLoader`, `CLIPLoader`, `VAELoader`, `ModelSamplingSD3`, `CLIPTextEncode` ×2,
`Wan22ImageToVideoLatent`, `LoadImage`, `KSampler`, `VAEDecode`, `CreateVideo`, `SaveVideo`,
`MarkdownNote`.

| What | Node id | Type | Index into `widgets_values` | Shipped default |
|---|---|---|---|---|
| positive prompt | 6 | CLIPTextEncode | `[0]` | "Low contrast. In a retro 1970s-style subway station, a street musician plays…" |
| negative prompt | 7 | CLIPTextEncode | `[0]` | the standard Wan CJK negative block ("色调艳丽，过曝，静态，…倒着走") |
| seed | 3 | KSampler | `[0]` | `898471028164125` |
| control_after_generate | 3 | KSampler | `[1]` | `"randomize"` |
| steps | 3 | KSampler | `[2]` | `20` |
| cfg | 3 | KSampler | `[3]` | `5` |
| sampler_name | 3 | KSampler | `[4]` | `"uni_pc"` |
| scheduler | 3 | KSampler | `[5]` | `"simple"` |
| denoise | 3 | KSampler | `[6]` | `1` |
| width | 55 | Wan22ImageToVideoLatent | `[0]` | `1280` |
| height | 55 | Wan22ImageToVideoLatent | `[1]` | `704` |
| length (frames) | 55 | Wan22ImageToVideoLatent | `[2]` | `121` |
| batch_size | 55 | Wan22ImageToVideoLatent | `[3]` | `1` |
| shift | 48 | ModelSamplingSD3 | `[0]` | `8` |
| fps | 57 | CreateVideo | `[0]` | `24` |
| diffusion model | 37 | UNETLoader | `[0]`, `[1]` | `"wan2.2_ti2v_5B_fp16.safetensors"`, `"default"` |
| text encoder | 38 | CLIPLoader | `[0]`,`[1]`,`[2]` | `"umt5_xxl_fp8_e4m3fn_scaled.safetensors"`, `"wan"`, `"default"` |
| vae | 39 | VAELoader | `[0]` | `"wan2.2_vae.safetensors"` |
| output prefix | 58 | SaveVideo | `[0]`,`[1]`,`[2]` | `"video/ComfyUI"`, `"auto"`, `"auto"` |

Note: node 56 (`LoadImage`) has `"mode": 4` (bypassed). The template ships as T2V; setting
mode back to 0 and wiring the image turns it into I2V (the group is literally titled
"For i2v, use Ctrl + B to enable"). The VAE feeds both `VAEDecode` and
`Wan22ImageToVideoLatent` (links 76 and 105).

## 2. Wan 2.2 14B image-to-video (native) — VERIFIED

* File: `video_wan2_2_14B_i2v.json` (85,227 bytes)
* Source: `https://cdn.jsdelivr.net/gh/Comfy-Org/workflow_templates@main/templates/video_wan2_2_14B_i2v.json`
* Accessed 2026-08-28. `frontendVersion` 1.42.10, `last_node_id` 164.
* **SUBGRAPH — harder to parameterize.** 6 top-level nodes, 2 top-level links, 1 subgraph.

Top level: `MarkdownNote` (id 105 "VRAM Usage", id 66 "Model Links", id 130 "Note"),
`LoadImage` (id 97, default `"video_wan2_2_14B_i2v_input_image.jpg"`), `SaveVideo` (id 108,
`["video/Wan2.2_i2v","auto","auto"]`), and the subgraph instance node **id 129**, whose
`"type"` is `"84e2cf3f-de93-40ef-ab22-b9375296917b"`.

Subgraph `definitions.subgraphs[0]`: name `"Image to Video (Wan2.2)"`, 30 nodes, 60 links.
Instance node 129 has `widgets_values: []` → **edit the inner nodes**.

`properties.proxyWidgets` on node 129 (this is the surfaced-parameter map):
`[["93","text"],["98","width"],["98","height"],["161","value"],["86","noise_seed"],["95","unet_name"],["101","lora_name"],["96","unet_name"],["102","lora_name"],["84","clip_name"],["90","vae_name"],["131","value"]]`

Subgraph inputs, in order: `start_image` (IMAGE), `text` (labelled "prompt"), `width`,
`height`, `value_1` ("duration", FLOAT), `noise_seed`, `unet_name` ("high_noise_model"),
`lora_name` ("high_noise_lightning_lora"), `unet_name_1` ("low_noise_model"),
`lora_name_1` ("low_noise_lightning_lora"), `clip_name`, `vae_name`, `value`
("enable_turbo_mode", BOOLEAN).

| What | Inner node id | Type | Index | Shipped default |
|---|---|---|---|---|
| positive prompt | 93 | CLIPTextEncode | `[0]` | "The white dragon warrior stands still, eyes full of determination and strength. The came…" |
| negative prompt | 89 | CLIPTextEncode | `[0]` | standard Wan CJK negative block |
| width | 98 | WanImageToVideo | `[0]` | `640` |
| height | 98 | WanImageToVideo | `[1]` | `640` |
| length (frames) | 98 | WanImageToVideo | `[2]` | `81` (also driven by node 163 `ComfyMathExpression` `"floor (a * b + 1)"` from duration × fps) |
| batch | 98 | WanImageToVideo | `[3]` | `1` |
| duration (s) | 161 | PrimitiveFloat | `[0]` | `5` |
| fps | 162 | PrimitiveFloat | `[0]` | `16` |
| fps (video mux) | 94 | CreateVideo | `[0]` | `16` |
| seed | 86 | KSamplerAdvanced (high noise) | `[1]` | `264244520398999`; `[2]` = `"randomize"` |
| high-noise model | 95 | UNETLoader | `[0]` | `"wan2.2_i2v_high_noise_14B_fp8_scaled.safetensors"` |
| low-noise model | 96 | UNETLoader | `[0]` | `"wan2.2_i2v_low_noise_14B_fp8_scaled.safetensors"` |
| text encoder | 84 | CLIPLoader | `[0]`,`[1]`,`[2]` | `"umt5_xxl_fp8_e4m3fn_scaled.safetensors"`, `"wan"`, `"default"` |
| vae | 90 | VAELoader | `[0]` | `"wan_2.1_vae.safetensors"` |
| high-noise lightning LoRA | 101 | LoraLoaderModelOnly | `[0]`,`[1]` | `"wan2.2_i2v_lightx2v_4steps_lora_v1_high_noise.safetensors"`, `1.0000000000000002` |
| low-noise lightning LoRA | 102 | LoraLoaderModelOnly | `[0]`,`[1]` | `"wan2.2_i2v_lightx2v_4steps_lora_v1_low_noise.safetensors"`, `1.0000000000000002` |
| shift | 103 / 104 | ModelSamplingSD3 | `[0]` | `5.000000000000001` (both) |
| turbo toggle | 131 | PrimitiveBoolean "Enable 4steps LoRA?" | `[0]` | `false` |

`KSamplerAdvanced` `widgets_values` order (both samplers): `[add_noise, noise_seed,
control_after_generate, steps, cfg, sampler_name, scheduler, start_at_step, end_at_step,
return_with_leftover_noise]`.
* node 86 (high noise): `["enable", 264244520398999, "randomize", 4, 1, "euler", "simple", 0, 2, "enable"]`
* node 85 (low noise): `["disable", 0, "fixed", 4, 1, "euler", "simple", 2, 1, "disable"]`

Steps/cfg/split-step are **not** read from those arrays at runtime — they are driven by
`PrimitiveInt`/`PrimitiveFloat` nodes routed through `ComfySwitchNode` gates keyed on node 131:
non-turbo path = node 128 steps `20`, node 126 cfg `3.5`, node 127 split_step `10`;
turbo path = node 118 steps `4`, node 122 cfg `1`, node 124 split_step `2`.
Switch nodes: 116 / 117 (model), 119 (steps), 120 (cfg), 125 (split step).

## 3. LTX 2.3 distilled text-to-video — PARTIAL (official Comfy-Org) + VERIFIED FALLBACK (official Lightricks)

### 3a. Comfy-Org native template — could NOT be fetched completely

* Intended file: `templates/video_ltx2_3_t2v.json` (this is the correct, existing template ID —
  confirmed in the repo's `bundles.json` under `media-video`).
* Source attempted: `https://cdn.jsdelivr.net/gh/Comfy-Org/workflow_templates@main/templates/video_ltx2_3_t2v.json`
  and `https://raw.githubusercontent.com/Comfy-Org/workflow_templates/main/templates/video_ltx2_3_t2v.json`.
* Both fetches were **truncated by the fetch tool at 105,577 bytes** (the file is larger than
  the tool's per-response budget). Saved as `video_ltx2_3_t2v.TRUNCATED-DO-NOT-USE.json`.
  **It is not valid JSON and must not be shipped or drag-dropped.** The cut lands inside
  `definitions.subgraphs[0].groups`; the subgraph's `links` array, `extra`, and the closing
  braces are missing.
* What *was* recovered intact and is trustworthy: the 3 top-level nodes, the subgraph's
  `inputs[]`, and all 51 subgraph nodes with their `widgets_values`. Recorded below so the
  parameterization points are documented even though the file itself is unusable.

Top level: `SaveVideo` (id 75, `["video/LTX_2.3_t2v","auto","auto"]`), `MarkdownNote`
(id 103, "Model Links" — links to `Lightricks/LTX-2.3` on HF and `Lightricks/LTX-2` on GitHub,
plus an LTX-2.3 prompting section), and subgraph instance **id 267**, type
`"b94257db-cdc1-45d3-8913-ca61e782d9c1"`, `widgets_values: []`.

Subgraph name `"Text to Video (LTX-2.3)"`, 51 nodes. `proxyWidgets` on node 267:
`[["266","value"],["330","value"],["257","value"],["258","value"],["225","value"],["260","value"],["237","noise_seed"],["236","ckpt_name"],["232","lora_name"],["243","text_encoder"],["233","model_name"],["326","lora_name"]]`

| What | Inner node id | Type | Index | Shipped default |
|---|---|---|---|---|
| positive prompt | 266 | PrimitiveStringMultiline "Prompt" | `[0]` | "Dynamic cinematic close-up of high-tech modular machinery self-assembling in midair… glowing engraved text “LTX-2.3” centered and unobstructed, dramatic lighting, photorealism, 8K, sharp focus.\n" |
| negative prompt | 247 | CLIPTextEncode | `[0]` | `"pc game, console game, video game, cartoon, childish, ugly"` |
| width | 257 | PrimitiveInt "Width" | `[0]` | `1280` |
| height | 258 | PrimitiveInt "Height" | `[0]` | `720` |
| duration (s) | 225 | PrimitiveInt "Duration" | `[0]` | `5` |
| fps | 260 | PrimitiveInt "Frame Rate" | `[0]` | `25` |
| seed | 237 | RandomNoise | `[0]`,`[1]` | `810138461690240`, `"randomize"` |
| checkpoint | 236 | CheckpointLoaderSimple | `[0]` | `"ltx-2.3-22b-dev-fp8.safetensors"` |
| distilled LoRA | 232 | LoraLoaderModelOnly | `[0]`,`[1]` | `"ltx_2.3_22b_distilled_1.1_lora_dynamic_fro09_avg_rank_111_bf16.safetensors"`, `0.5` |
| text encoder | 243 | LTXAVTextEncoderLoader | `[0]`,`[1]`,`[2]` | `"gemma_3_12B_it_fp4_mixed.safetensors"`, `"ltx-2.3-22b-dev-fp8.safetensors"`, `"default"` |
| latent upscaler | 233 | LatentUpscaleModelLoader | `[0]` | `"ltx-2.3-spatial-upscaler-x2-1.1.safetensors"` |
| prompt-enhance toggle | 330 | PrimitiveBoolean | `[0]` | `true` |
| enhancer LoRA | 326 | LoraLoader | `[0]`,`[1]`,`[2]` | `"gemma-3-12b-it-abliterated_lora_rank64_bf16.safetensors"`, `1`, `1` |
| base latent | 228 | EmptyLTXVLatentVideo | `[0..3]` | `768, 512, 97, 1` (width/height/length/batch — overridden by links) |
| audio latent | 214 | LTXVEmptyLatentAudio | `[0..2]` | `97, 25, 1` |

**Structural surprise:** there is no `steps` or `cfg` widget anywhere in the distilled path.
Denoising is driven by `ManualSigmas` string widgets — node 211 `"0.85, 0.7250, 0.4219, 0.0"`
and node 252 `"1.0, 0.99375, 0.9875, 0.98125, 0.975, 0.909375, 0.725, 0.421875, 0.0"` — plus
`CFGGuider` nodes 213 and 231 both at cfg `1`. A generator must treat "steps" for LTX 2.3
distilled as a sigma schedule, not an integer. Other notable classes: `LTXVConcatAVLatent`,
`LTXVSeparateAVLatent`, `LTXVAudioVAELoader`, `LTXVAudioVAEDecode`, `LTXVImgToVideoInplace`,
`LTXVLatentUpsampler`, `LTXVCropGuides`, `LTXVPreprocess`, `LTXVConditioning`,
`TextGenerateLTX2Prompt`, `ResizeImagesByLongerEdge`, `ResizeImageMaskNode`,
`ComfyMathExpression`, `ComfySwitchNode`, `VAEDecodeTiled`. It generates video **and audio**.

### 3b. Fallback actually delivered — official Lightricks vendor workflow

* File: `LTX-2.3_T2V_I2V_Single_Stage_Distilled_Full.json` (54,378 bytes)
* Source: `https://github.com/Lightricks/ComfyUI-LTXVideo` →
  `https://raw.githubusercontent.com/Lightricks/ComfyUI-LTXVideo/master/example_workflows/2.3/LTX-2.3_T2V_I2V_Single_Stage_Distilled_Full.json`
* Accessed 2026-08-28. This is the **model vendor's own** example workflow, not a community
  file. Byte-exactness confirmed against GitHub's blob SHA.
* `frontendVersion` 1.42.8, `last_node_id` 4985, `last_link_id` 13363. Flat: **44 nodes,
  60 links, no subgraphs**, plus a `floatingLinks` key. Groups: "Set prompts", "Preprocess",
  "Load Models", "Load Image (set bypass=True if t2v)", "Generate Distilled", "Generate Full",
  "Decode Distilled", "Decode Full".
* **Caveat: not pure comfy-core.** Requires the `ComfyUI-LTXVideo` custom nodes
  (`LTXV*`, `GemmaAPITextEncode`, `LTXAVTextEncoderLoader`, `MultimodalGuider`,
  `GuiderParameters`, `ManualSigmas`, `LTXFloatToInt`, `ResizeImageMaskNode`) and
  `ClownSampler_Beta` (RES4LYF). It will not load on a bare ComfyUI install.

| What | Node id | Type | Index | Shipped default |
|---|---|---|---|---|
| positive prompt | 2483 | CLIPTextEncode | `[0]` | "A traditional Japanese tea ceremony takes place in a tatami room as a host carefully prepares matcha…" |
| negative prompt | 2612 | CLIPTextEncode | `[0]` | `"pc game, console game, video game, cartoon, childish, ugly"` |
| width | 3059 | EmptyLTXVLatentVideo | `[0]` | `960` |
| height | 3059 | EmptyLTXVLatentVideo | `[1]` | `544` |
| length (frames) | 3059 | EmptyLTXVLatentVideo | `[2]` | `121` |
| batch | 3059 | EmptyLTXVLatentVideo | `[3]` | `1` |
| frames (primitive) | 4979 | PrimitiveInt "number of frames" | `[0]` | `121` |
| fps (primitive) | 4978 | PrimitiveFloat "fps" | `[0]` | `24` |
| steps | 4966 | LTXVScheduler | `[0]` | `15` (then `2.05`, `0.95`, `true`, `0.1`) |
| cfg | 4828 | CFGGuider | `[0]` | `1` |
| seed (full path) | 4814 | RandomNoise | `[0]`,`[1]` | `42`, `"fixed"` |
| seed (distilled path) | 4832 | RandomNoise | `[0]`,`[1]` | `43`, `"fixed"` |
| sampler (distilled) | 4967 | ClownSampler_Beta | `[0..4]` | `0.25, "exponential/res_2s", 94, "fixed", true` |
| sampler (full) | 4831 | KSamplerSelect | `[0]` | `"euler_ancestral_cfg_pp"` |
| sigmas | 4971 | ManualSigmas | `[0]` | `"1.0, 0.99375, 0.9875, 0.98125, 0.975, 0.909375, 0.725, 0.421875, 0.0"` |
| checkpoint | 3940 | CheckpointLoaderSimple | `[0]` | `"ltx-2.3-22b-dev.safetensors"` |
| audio VAE | 4010 | LTXVAudioVAELoader | `[0]` | `"ltx-2.3-22b-dev.safetensors"` |
| text encoder | 4960 | LTXAVTextEncoderLoader | `[0]`,`[1]`,`[2]` | `"comfy_gemma_3_12B_it.safetensors"`, `"ltx-2.3-22b-dev.safetensors"`, `"default"` |
| distilled LoRA (full path) | 4922 | LoraLoaderModelOnly | `[0]`,`[1]` | `"ltxv/ltx2/ltx-2.3-22b-distilled-lora-384-1.1.safetensors"`, `0.5` |
| distilled LoRA (distilled path) | 4968 | LoraLoaderModelOnly | `[0]`,`[1]` | same file, `0.2` |
| t2v toggle | 4977 | PrimitiveBoolean "bypass_i2v" | `[0]` | `true` (ships as T2V) |
| frame rate cond. | 1241 | LTXVConditioning | `[0]` | `24` |
| guider params (audio) | 4963 | GuiderParameters | `[0..7]` | `"AUDIO", 7, 1, true, 0.7, 3, 0, true` |
| guider params (video) | 4964 | GuiderParameters | `[0..7]` | `"VIDEO", 3, 1, true, 0.9, 3, 0, true` |
| outputs | 4823 / 4852 | SaveVideo | `[0]` | `"output_F"` (full) / `"output_D"` (distilled) |

## 4. SDXL basic txt2img — VERIFIED

* File: `image_sdxl_simple.json` (10,998 bytes)
* Source: `https://cdn.jsdelivr.net/gh/Comfy-Org/workflow_templates@main/templates/image_sdxl_simple.json`
* Accessed 2026-08-28. `frontendVersion` 1.49.6, `last_node_id` 16, `last_link_id` 41.
* **Flat graph, no subgraphs.** 8 nodes, 9 links. This is exactly the requested shape:
  `CheckpointLoaderSimple` → 2× `CLIPTextEncode` → `KSampler` → `VAEDecode` → `SaveImage`
  (plus `EmptyLatentImage` and one `MarkdownNote`). **The cleanest template in this set to
  parameterize** — and the only one carrying `widgets_values_named`.

| What | Node id | Type | Index | Shipped default |
|---|---|---|---|---|
| positive prompt | 10 | CLIPTextEncode ("Positive Prompt") | `[0]` | "a giant classical marble statue standing alone in a pure white empty void, soft diffused lighting, subtle shadows, surreal, minimalist, fine art photography, quiet atmosphere, sense of scale" |
| negative prompt | 11 | CLIPTextEncode ("Negative Prompt") | `[0]` | `"color, colored, lowres, blurry, out of focus, deformed, bad anatomy, extra limbs, mutated, watermark, text, logo, signature\n"` |
| seed | 12 | KSampler | `[0]` | `812045847300606` |
| control_after_generate | 12 | KSampler | `[1]` | `"randomize"` |
| steps | 12 | KSampler | `[2]` | `25` |
| cfg | 12 | KSampler | `[3]` | `7` |
| sampler_name | 12 | KSampler | `[4]` | `"dpmpp_2m"` |
| scheduler | 12 | KSampler | `[5]` | `"karras"` |
| denoise | 12 | KSampler | `[6]` | `1` |
| width | 13 | EmptyLatentImage | `[0]` | `1024` |
| height | 13 | EmptyLatentImage | `[1]` | `1024` |
| batch_size | 13 | EmptyLatentImage | `[2]` | `1` |
| checkpoint | 15 | CheckpointLoaderSimple | `[0]` | `"sd_xl_base_1.0.safetensors"` |
| filename_prefix | 7 | SaveImage | `[0]` | `"sdxl_simple"` |

Note node 14 (`VAEDecode`) has **no** `widgets_values` key at all — a generator must not assume
the key exists. Related official SDXL template IDs in the same repo, if a refiner/turbo variant
is ever needed: `sdxl_simple_example`, `sdxl_refiner_prompt_example`, `sdxl_revision_text_prompts`,
`sdxlturbo_example`.

## 5. Z-Image Turbo txt2img — VERIFIED

* File: `image_z_image_turbo.json` (27,172 bytes)
* Source: `https://cdn.jsdelivr.net/gh/Comfy-Org/workflow_templates@main/templates/image_z_image_turbo.json`
* Accessed 2026-08-28. `frontendVersion` 1.42.15, `last_node_id` 61, `last_link_id` 75.
* **SUBGRAPH.** Only 3 top-level nodes and 1 top-level link.

Top level: `MarkdownNote` (id 35), `SaveImage` (id 9, `["z-image-turbo"]`), and instance node
**id 57** of type `"f2fdebf6-dfaf-43b6-9eb2-7f70613cfdc1"`, `widgets_values: []`.
Subgraph name `"Text to Image (Z-Image-Turbo)"`, 9 nodes, 18 links.

Subgraph inputs in order: `text` (labelled "prompt"), `width`, `height`, `seed`, `steps`,
`unet_name`, `clip_name`, `vae_name`.
`proxyWidgets`: `[["27","text"],["13","width"],["13","height"],["3","seed"],["3","steps"],["28","unet_name"],["30","clip_name"],["29","vae_name"],["3","control_after_generate"]]`

| What | Inner node id | Type | Index | Shipped default |
|---|---|---|---|---|
| positive prompt | 27 | CLIPTextEncode | `[0]` | `"Latina female with thick wavy hair, harbor boats and pastel houses behind. Breezy seaside light, warm tones, cinematic close-up. "` |
| negative prompt | — | — | — | **none.** The negative is `ConditioningZeroOut` (node 33) fed from the positive encode. There is no second `CLIPTextEncode`. |
| width | 13 | EmptySD3LatentImage | `[0]` | `1024` |
| height | 13 | EmptySD3LatentImage | `[1]` | `1024` |
| batch_size | 13 | EmptySD3LatentImage | `[2]` | `1` |
| seed | 3 | KSampler | `[0]` | `0` |
| control_after_generate | 3 | KSampler | `[1]` | `"randomize"` |
| steps | 3 | KSampler | `[2]` | `8` |
| cfg | 3 | KSampler | `[3]` | `1` |
| sampler_name | 3 | KSampler | `[4]` | `"res_multistep"` |
| scheduler | 3 | KSampler | `[5]` | `"simple"` |
| denoise | 3 | KSampler | `[6]` | `1` |
| shift | 11 | ModelSamplingAuraFlow | `[0]` | `3` |
| diffusion model | 28 | UNETLoader | `[0]`,`[1]` | `"z_image_turbo_bf16.safetensors"`, `"default"` |
| text encoder | 30 | CLIPLoader | `[0]`,`[1]`,`[2]` | `"qwen_3_4b.safetensors"`, `"lumina2"`, `"default"` |
| vae | 29 | VAELoader | `[0]` | `"ae.safetensors"` |
| filename_prefix | 9 (top level) | SaveImage | `[0]` | `"z-image-turbo"` |

Related official IDs: `image_z_image` (non-turbo base), `image_z_image_int8`,
`image_z_image_turbo_int8`, `image_z_image_turbo_fun_union_controlnet`. There are also flat
**blueprints** at `blueprints/text_to_image_z_image_turbo.json` and
`blueprints/text_to_image_z_image_base.json` which may be easier to template from.

## 6. Qwen-Image txt2img — VERIFIED

* File: `image_qwen_image.json` (46,429 bytes)
* Source: `https://cdn.jsdelivr.net/gh/Comfy-Org/workflow_templates@main/templates/image_qwen_image.json`
* Accessed 2026-08-28. `frontendVersion` 1.41.13, `last_node_id` 87, `last_link_id` 153.
* **SUBGRAPH.** 5 top-level nodes, 1 top-level link.

Top level: three `MarkdownNote`s (69 "VRAM Usage", 67 "Model links", 77 "Aspect Ratio
Resolutions"), `SaveImage` (id 60, `["Qwen-Image"]`), and instance node **id 76** of type
`"e5cfe5ba-2ae0-4bc4-869f-ab2228cb44d3"`, `widgets_values: []`.
Subgraph name `"Text to Image (Qwen-Image)"`, 19 nodes, 30 links.

Subgraph inputs in order: `text` ("prompt"), `width`, `height`, `seed`, `unet_name`,
`clip_name`, `vae_name`, `lora_name` ("lightning_lora"), `value` ("enable_turbo_mode").

| What | Inner node id | Type | Index | Shipped default |
|---|---|---|---|---|
| positive prompt | 6 | CLIPTextEncode ("Positive Prompt") | `[0]` | the long Hong Kong neon-signage prompt with embedded CJK shop names |
| negative prompt | 7 | CLIPTextEncode ("Negative Prompt") | `[0]` | `""` (empty) |
| width | 58 | EmptySD3LatentImage | `[0]` | `1328` |
| height | 58 | EmptySD3LatentImage | `[1]` | `1328` |
| batch_size | 58 | EmptySD3LatentImage | `[2]` | `1` |
| seed | 3 | KSampler | `[0]` | `50347169638278` |
| control_after_generate | 3 | KSampler | `[1]` | `"randomize"` |
| steps (array slot) | 3 | KSampler | `[2]` | `8` — **overridden by link**, see below |
| cfg (array slot) | 3 | KSampler | `[3]` | `1` — **overridden by link** |
| sampler_name | 3 | KSampler | `[4]` | `"euler"` |
| scheduler | 3 | KSampler | `[5]` | `"simple"` |
| denoise | 3 | KSampler | `[6]` | `1` |
| shift | 66 | ModelSamplingAuraFlow | `[0]` | `3.1000000000000005` |
| diffusion model | 37 | UNETLoader | `[0]`,`[1]` | `"qwen_image_fp8_e4m3fn.safetensors"`, `"default"` |
| text encoder | 38 | CLIPLoader | `[0]`,`[1]`,`[2]` | `"qwen_2.5_vl_7b_fp8_scaled.safetensors"`, `"qwen_image"`, `"default"` |
| vae | 39 | VAELoader | `[0]` | `"qwen_image_vae.safetensors"` |
| lightning LoRA | 73 | LoraLoaderModelOnly | `[0]`,`[1]` | `"Qwen-Image-Lightning-8steps-V1.0.safetensors"`, `1` |
| turbo toggle | 86 | PrimitiveBoolean "Enable Lightning LoRA" | `[0]` | `false` |

Steps and cfg are routed through `ComfySwitchNode` gates keyed on node 86:
turbo path node 79 `PrimitiveInt` steps `8` + node 81 `PrimitiveFloat` cfg `1`;
non-turbo path node 84 `PrimitiveInt` steps `20` + node 85 `PrimitiveFloat` cfg `4`.
Switches: 78 (model), 82 (steps), 83 (cfg). Note the KSampler has `seed`, `steps` and `cfg`
promoted to **link inputs** (slots 4, 5, 6) — the `widgets_values` entries at those positions
are inert while the links exist.

Shipped aspect-ratio table (from MarkdownNote 77): 1:1 (1328,1328) · 16:9 (1664,928) ·
9:16 (928,1664) · 4:3 (1472,1140) · 3:4 (1140,1472) · 3:2 (1584,1056) · 2:3 (1056,1584).
Related official IDs: `image_qwen_Image_2512`, `image_qwen_image_edit`,
`image_qwen_image_edit_2509`, `image_qwen_image_edit_2511`, `image_qwen_image_layered`,
plus blueprints `text_to_image_qwen_image.json` and `text_to_image_qwen_image_2512.json`.

## 7. FLUX.2 Klein txt2img — VERIFIED

* File: `image_flux2_klein_text_to_image.json` (69,661 bytes)
* Source: `https://cdn.jsdelivr.net/gh/Comfy-Org/workflow_templates@main/templates/image_flux2_klein_text_to_image.json`
* Accessed 2026-08-28. `frontendVersion` 1.38.6, `last_node_id` 79, `last_link_id` 157.
* **TWO SUBGRAPHS in one file** — base and distilled, run as parallel branches.

Top level (6 nodes, 4 links): `SaveImage` id 9 (`["Flux2-Klein"]`, mode 0) and `SaveImage`
id 78 (mode **4 = bypassed**); `MarkdownNote` id 79; `PrimitiveStringMultiline` **id 76**
titled "Prompt"; instance id 75 (type `"7b34ab90-36f9-45ba-a665-71d418f0df18"`, mode 0) and
instance id 77 (type `"a67caa28-5f85-4917-8396-36004960dd30"`, mode 4).

**The prompt lives at top level**, unlike the other subgraph templates:
node **76**, `widgets_values[0]` =
`"A hedgehog wearing a tiny party hat surrounded by confetti, early digital camera style, slight noise, flash photography, candid moment, 2000s digicam aesthetic, festive birthday celebration atmosphere\n"`.
It fans out to both subgraphs via links 155 and 157.

Both subgraphs have identical input signatures (`value` INT, `value_1` INT, `unet_name`,
`clip_name`, `vae_name`, `text` labelled "prompt") and both instance nodes carry
`widgets_values: []`, so defaults come from the inner nodes.

Subgraph A — `"Text to Image (Flux.2 Klein 4B)"` (14 nodes, 23 links), the **active** branch:

| What | Inner node id | Type | Index | Default |
|---|---|---|---|---|
| steps | 62 | Flux2Scheduler | `[0]` | `20` (then width `1024`, height `1024`) |
| cfg | 63 | CFGGuider | `[0]` | `5` |
| width | 68 | PrimitiveInt "Width" | `[0]` | `1024` |
| height | 69 | PrimitiveInt "Height" | `[0]` | `1024` |
| latent | 66 | EmptyFlux2LatentImage | `[0..2]` | `1024, 1024, 1` |
| seed | 73 | RandomNoise | `[0]`,`[1]` | `0`, `"randomize"` |
| sampler | 61 | KSamplerSelect | `[0]` | `"euler"` |
| diffusion model | 70 | UNETLoader | `[0]`,`[1]` | `"flux-2-klein-base-4b.safetensors"`, `"default"` |
| text encoder | 71 | CLIPLoader | `[0]`,`[1]`,`[2]` | `"qwen_3_4b.safetensors"`, `"flux2"`, `"default"` |
| vae | 72 | VAELoader | `[0]` | `"flux2-vae.safetensors"` |
| positive encode | 74 | CLIPTextEncode | `[0]` | `""` (driven by link from node 76) |
| negative prompt | 67 | CLIPTextEncode | `[0]` | `""` |

Subgraph B — `"Text to Image (Flux.2 Klein 4B Distilled)"` (14 nodes, 23 links), bypassed:
same node ids, but `Flux2Scheduler` node 62 steps = **`4`**, `CFGGuider` node 63 cfg = **`1`**,
`UNETLoader` node 70 = `"flux-2-klein-4b.safetensors"`, `RandomNoise` node 73 seed =
`432262096973490`, and the negative branch is `ConditioningZeroOut` (node 76 inside the
subgraph) rather than a second `CLIPTextEncode`.

Also uses `SamplerCustomAdvanced` (node 64) and `VAEDecode` (node 65) in both branches.
Sibling official IDs for the 9B variants: `image_flux2_klein_image_edit_9b_base`,
`image_flux2_klein_image_edit_9b_distilled`, `image_flux2_text_to_image_9b`, `image_flux2`,
`image_flux2_fp8`; blueprints `text_to_image_flux_2_dev.json`, `image_edit_flux_2_klein_4b.json`.

## 8. Krea 2 Turbo txt2img — VERIFIED

* File: `image_krea2_turbo_t2i.json` (58,695 bytes)
* Source: `https://cdn.jsdelivr.net/gh/Comfy-Org/workflow_templates@main/templates/image_krea2_turbo_t2i.json`
* Accessed 2026-08-28. `frontendVersion` 1.48.5, `last_node_id` 50, `last_link_id` 86.
* **SUBGRAPH, and the one that uses the NEW value-on-the-instance convention.**

Top level (6 nodes, 3 links): `SaveImage` id 29 (`["Krea2_turbo"]`), three `MarkdownNote`s
(47 "LoRA Trigger Words and Settings", 48 "Model Links", 50 "Note: Krea-2"),
`ResolutionSelector` **id 49** (`["1:1 (Square)", 1, 8]`, outputs width+height INT), and
instance node **id 30**, type `"b0e5ca93-2731-42b9-8e0a-d28ea851ff81"`.
Top-level links: `[44,30,0,29,0,"IMAGE"]`, `[85,49,0,30,3,"INT"]`, `[86,49,1,30,4,"INT"]`.

Subgraph name `"Text to Image (Krea-2 Turbo)"`, 20 nodes, 40 links.

**Node 30's `widgets_values` is populated (14 entries) and is the authoritative parameter
array.** Its order matches `definitions.subgraphs[0].inputs[]` exactly:

| idx | subgraph input (label) | shipped default |
|---|---|---|
| 0 | `value` — prompt (STRING) | "A high-resolution, surreal digital illustration showing a human hand holding a martini glass…" |
| 1 | `value_1` — prompt_enhance | `true` |
| 2 | `thinking` — LLM_thinking_mode | `false` |
| 3 | `max_length_1` — LLM_max_token | `512` |
| 4 | `width_1` — width | `1024` (driven by ResolutionSelector link 85) |
| 5 | `height_1` — height | `1024` (driven by link 86) |
| 6 | `seed_1` — seed | `594361197674106` |
| 7 | `value_3` — enable_lora | `false` |
| 8 | `lora_name_1` — lora_name | `"krea2_darkbrush.safetensors"` |
| 9 | `strength_model_1` — strength_model | `0.8` |
| 10 | `string_b_1` — lora_trigger_word | `"muted minimalist sketch style"` |
| 11 | `unet_name` | `"krea2_turbo_fp8_scaled.safetensors"` |
| 12 | `clip_name` | `"qwen3vl_4b_fp8_scaled.safetensors"` |
| 13 | `vae_name` | `"qwen_image_vae.safetensors"` |

Inner-node defaults (shadowed by the array above, but this is where steps/cfg/sampler live —
they are **not** exposed on the instance):

| What | Inner node id | Type | Index | Default |
|---|---|---|---|---|
| seed | 3 | KSampler | `[0]` | `735915477938686` |
| control_after_generate | 3 | KSampler | `[1]` | `"randomize"` |
| steps | 3 | KSampler | `[2]` | `8` |
| cfg | 3 | KSampler | `[3]` | `1` |
| sampler_name | 3 | KSampler | `[4]` | `"euler"` |
| scheduler | 3 | KSampler | `[5]` | `"simple"` |
| denoise | 3 | KSampler | `[6]` | `1` |
| width/height | 5 | EmptyLatentImage | `[0..2]` | `1024, 1024, 1` |
| positive prompt | 6 | CLIPTextEncode | `[0]` | same martini-glass text |
| negative | 13 | ConditioningZeroOut | — | no negative `CLIPTextEncode` in this graph |
| diffusion model | 10 | UNETLoader | `[0]`,`[1]` | `"krea2_turbo_fp8_scaled.safetensors"`, `"default"` |
| text encoder | 11 | CLIPLoader | `[0]`,`[1]`,`[2]` | `"qwen3vl_4b_fp8_scaled.safetensors"`, `"krea2"`, `"default"` |
| vae | 12 | VAELoader | `[0]` | `"qwen_image_vae.safetensors"` |
| style LoRA | 15 | LoraLoaderModelOnly | `[0]`,`[1]` | `"krea2_darkbrush.safetensors"`, `0.8` |

**Structural surprise:** this template embeds a local LLM prompt-rewriter. Node 16
`TextGenerate` (`widgets_values`: `["", 512, "on", 0.7, 64, 0.95, 0.05, 1.05, 0, 0, true, true]`)
is fed a system prompt from node 18 `PrimitiveStringMultiline` ("You are an expert prompt
engineer for text-to-image models…") and the user prompt from node 19. Node 24
`PrimitiveBoolean` "Refine Prompt?" defaults to **`true`**, so out of the box the user's prompt
is rewritten by an LLM before encoding. Node 21 `ComfySwitchNode` selects raw vs enhanced.
A generator that wants deterministic prompt fidelity must set that boolean to `false`
(instance `widgets_values[1]`).
Other classes present: `StringConcatenate` (17, 27), `PreviewAny` (20),
`ComfySwitchNode` (21, 22, 28), `PrimitiveBoolean` (23, 24).
Sibling official IDs: `image_krea2_turbo_t2i_int8`, `image_krea2_turbo_int8_image_style_reference`,
`api_krea2_t2i`, `api_krea2_style_reference`.

---

## Practical notes for a workflow generator

1. Prefer the **flat** graphs (`image_sdxl_simple`, `video_wan2_2_5B_ti2v`) as templates; they
   need only positional `widgets_values` edits.
2. For subgraph graphs, decide per file whether values live on the instance
   (`image_krea2_turbo_t2i`) or on inner nodes (everything else). Check whether the instance's
   `widgets_values` is empty.
3. Watch for widgets that have been **promoted to link inputs** (an entry in the node's
   `inputs[]` with a `"widget": {"name": …}` key). When such a link exists, the corresponding
   `widgets_values` slot is inert — the value comes from the upstream `PrimitiveInt` /
   `PrimitiveFloat` / `PrimitiveBoolean` / `ComfySwitchNode` chain instead. This is how
   Wan 2.2 14B, Qwen-Image and LTX 2.3 all express "turbo mode".
4. Some graphs ship with nodes at `"mode": 4` (bypassed) — the i2v `LoadImage` in Wan 5B, the
   distilled branch in FLUX.2 Klein, the Gemma API encoders in the Lightricks LTX file.
   Toggling `mode` between 0 and 4 is a legitimate parameterization lever.
5. `ConditioningZeroOut` replaces the negative `CLIPTextEncode` in Z-Image Turbo, Krea 2 Turbo
   and the FLUX.2 Klein distilled branch — those graphs have **no negative prompt field**.
6. `VAEDecode` in `image_sdxl_simple` has no `widgets_values` key at all; never assume presence.
