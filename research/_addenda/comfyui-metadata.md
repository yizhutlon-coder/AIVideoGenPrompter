# ComfyUI output metadata — what is embedded, where, and how much

STATUS (2026-09-13 merge review): DRAFT, under-graded — most tables carry no evidence grade or URL; treat as working notes, not ground truth, until regraded. One factual error corrected below.

## What gets written

Every built-in output node declares two hidden inputs, `prompt: "PROMPT"` and `extra_pnginfo: "EXTRA_PNGINFO"`. The executor fills them; the node dumps both as JSON into the file unless the server was started with `--disable-metadata`.
`[OFFICIAL]` https://docs.comfy.org/development/api-development/workflow-metadata
`[OFFICIAL]` `nodes.py` → `SaveImage.save_images`: `metadata.add_text("prompt", json.dumps(prompt))` then one `add_text(x, json.dumps(extra_pnginfo[x]))` per key — https://raw.githubusercontent.com/comfyanonymous/ComfyUI/master/nodes.py

| Field | What it is | What it contains |
|---|---|---|
| `prompt` | API-format graph: every node that executed, keyed by id, `class_type` + `inputs` (+ `_meta.title`) | Positive/negative text verbatim, checkpoint/UNet/CLIP/VAE filenames, `LoraLoader` filename + `strength_model`/`strength_clip`, seed, steps, CFG, sampler, scheduler, denoise, width/height/length, fps, input filenames. Subgraphs are already flattened. |
| `workflow` | UI-format canvas (`extra_pnginfo.workflow`, put there by the frontend) | Same values plus node positions, links, `widgets_values`, titles, Note/MarkdownNote text, `definitions.subgraphs`, `properties.cnr_id` per node (→ which custom packs are needed), frontend version. This is what ComfyUI reloads on drag-drop. |

Custom nodes may add further `extra_pnginfo` keys. Custom savers (Image Saver, SaveImageWithMetaData) additionally write an A1111-style `parameters` string so Civitai can parse it.

**Not included:** model weights or hashes (core nodes), input image pixels (filename only), LoRA trigger words (only if typed into the prompt), any signature — it is plain editable text. `[OFFICIAL]` "Embedded metadata is not a digital signature."

## Where it lives per container

| Output | Location | Source |
|---|---|---|
| PNG / APNG | `tEXt` chunks `prompt`, `workflow` (uncompressed) | `nodes.py` SaveImage / SaveAnimatedPNG |
| Animated WebP | EXIF: tag 0x0110 Model = `prompt:{…}`, 0x010f Make = `workflow:{…}` | `nodes.py` SaveAnimatedWEBP |
| MP4 / MOV (`SaveVideo`) | container tags via `movflags=use_metadata_tags` → `moov/meta/keys` + `ilst` | `comfy_extras/nodes_video.py`, `comfy_api/latest/_input_impl/video_types.py` |
| WebM (`SaveWEBM`) | Matroska Tags (muxers upper-case the names: `PROMPT`, `WORKFLOW`) | `nodes_video.py` SaveWEBM |
| `.latent` / `.safetensors` | safetensors header `__metadata__` | `nodes.py` SaveLatent |

## How much

Measured on this repo's verified templates (`research/_addenda/comfy-templates/`), minified: `workflow` 7 KB (SDXL simple) → 41 KB (Wan 2.2 14B I2V with subgraphs); `prompt` typically 1–10 KB. Expect 10–60 KB per output; large custom-node graphs can exceed 100 KB. Negligible next to the image.

## Why a file comes up empty

- `--disable-metadata` / Desktop "Disable saving prompt metadata in files" `[OFFICIAL]`
- Re-encoding: Discord, Reddit, X, Instagram, messengers, screenshots, most editors.
- **Civitai:** the displayed image is a CDN transform (`…/width=450/…`, JPEG/WebP) — right-click → Save is stripped. The post's **Download** button requests `original=true`, i.e. the uploader's file, metadata intact if it ever had any. `[USER]` civitai/civitai#1823 (2025-08): the API "returns a URL that is an optimized version of the original image by default". Civitai's own "generation data" panel is parsed server-side from the original, so it can show a prompt while the file you saved has none.
- Direct file hosts (Catbox, HuggingFace, GitHub raw, Drive) preserve it.
- `PreviewImage` DOES write a file — it redirects output to ComfyUI's temp directory (`get_temp_directory()`; see comfyui-ops-2026-09.md:259). Corrected 2026-09-13; the original line claimed it never writes one.

## Frontend behaviour worth knowing

- Drag-drop onto the canvas reads `workflow` first, falls back to `prompt` (reconstructs a layout). `[OFFICIAL]`
- Subgraph templates: the user-typed values live on the *instance* node (`widgets_values`, or a link into the instance input); the inner node's own `widgets_values` may be stale template text. The API `prompt` has the real values. MetaInspector handles both.
- Link ids inside `definitions.subgraphs[].links` reuse the same numbers as the outer canvas — scope them per definition when resolving.
- `ConditioningZeroOut` on the negative input means "no negative" (CFG-free graphs); do not report the positive text as the negative.
