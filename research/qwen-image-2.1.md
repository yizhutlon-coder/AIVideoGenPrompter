# Qwen-Image-2.1 research brief

Research date: 2026-09-22. Release date: 2026-09-20. Scope: local Qwen-Image-2.1 generation, editing, multi-reference, transparent output, ComfyUI, license, and early field reports.

Evidence grades used here:

- **OFFICIAL** — Qwen, Hugging Face Diffusers, or Comfy-Org source/documentation.
- **REPRODUCIBLE REPORT** — public issue or benchmark with enough hardware/settings to retry; still not a general rule.
- **COMMUNITY ANECDOTE** — firsthand report without controlled comparison.
- **APP POLICY** — Prompt Studio behavior chosen to protect grounding or prevent version confusion.

## Identity and architecture

- **OFFICIAL:** The release is **Qwen-Image-2.1**, a unified image generation and image editing model. There is no official general language model named simply “Qwen 2.1.” It is also unrelated to the older Wan2.1 video family. [Official repository](https://github.com/QwenLM/Qwen-Image-2.1)
- **OFFICIAL:** 7B visual generation component, 32 single-stream DiT layers, Qwen3-VL 8B condition encoder, 64-channel RGBA VAE with 16× spatial compression, Flow Matching with Euler scheduling, and prefix KV caching. [Architecture](https://github.com/QwenLM/Qwen-Image-2.1#architecture)
- **OFFICIAL:** One checkpoint supports text-to-image, single-image editing, multi-reference editing, local edits, subject extraction, and transparent RGBA generation/editing. The official model limit is **10 reference images**. [Model card](https://huggingface.co/Qwen/Qwen-Image-2.1)
- **OFFICIAL:** This is a still-image model. No direct video generation mode is documented.

## Prompt modes

### Text to image

Use direct natural-language prose. Preserve exact subject counts, relationships, layout, material, light, style, and visible copy. A short request may stay short in Prompt Studio strict mode.

The official Qwen prompt enhancer deliberately expands short requests, but it is a separate model. That does not make invented detail mandatory for the base generator.

### Image editing

State the operation first, then state what must remain unchanged. In ComfyUI, reference images are spliced into the encoder by slot order and addressed as `<image1>`, `<image2>`, and so on.

Official ComfyUI pattern:

```text
Keep the character and pose in <image1> unchanged, put this light blue denim shirt from <image2> on the character, preserve the original facial features, hair, body shape and pose
```

Source: [ComfyUI Qwen-Image-2.1 guide](https://docs.comfy.org/tutorials/image/qwen/qwen-image-2-1#prompting-for-image-edit)

Prompt Studio interpretation:

1. Name the requested operation.
2. Assign one explicit role to each numbered image.
3. Preserve content outside the requested change.
4. Do not describe unseen source-image facts.
5. Do not create an unlisted `<imageN>` reference.

### Multi-reference editing

- **OFFICIAL:** Diffusers accepts a list of images and the model supports up to 10 references.
- **OFFICIAL:** Qwen’s example combines three referenced characters around a campfire.
- **OFFICIAL/COMFY:** ComfyUI exposes more UI slots, but the model repository’s published support statement is 10 references. Prompt Studio uses the model’s stated limit.

Use explicit role mapping for identity, clothing, pose, product, scene, or other transferable content. Role binding remains probabilistic; “reference image” does not guarantee pixel identity.

### Transparent RGBA generation

**OFFICIAL exact format:**

```text
This is an RGBA image with transparency. <your description>. The image has alpha channel and the background is transparent.
```

Source: [official transparent image example](https://github.com/QwenLM/Qwen-Image-2.1#transparent-image-generation-rgba)

Prompt Studio adds this wrapper only when the request asks for transparency. Adding it to an ordinary image request changes the task.

### Background removal

The official ComfyUI workflow uses:

```text
Remove the background, and output a PNG image
```

Source: [ComfyUI background removal example](https://docs.comfy.org/tutorials/image/qwen/qwen-image-2-1#remove-background-qwen-image-21)

## Prompt enhancer checkpoints

Qwen separately released:

- `Qwen/Qwen-Image-2.1-PE-T2I`
- `Qwen/Qwen-Image-2.1-PE-I2I`

These are fine-tuned Qwen3.5-VL 9B models. They are not the 7B image generator and are not equivalent to Prompt Studio’s general Ollama rewriter.

The T2I enhancer returns a long English `rewritten_prompt` and a `wh_ratio`. The edit enhancer also accepts ordered images and may return `ratio_follow: "<image1>"`. The official code requires thinking mode and does not produce a negative prompt. [Official prompt rewriting documentation](https://github.com/QwenLM/Qwen-Image-2.1#prompt-rewriting)

**APP POLICY:** strict mode preserves only the user’s facts. “Suggest details” is the disclosed expansion path. This keeps optional creative completion separate from faithful translation.

## Sampling and canvas settings

Two official paths use different defaults:

| Path | Steps | CFG | Sampler / scheduler | Notes |
|---|---:|---:|---|---|
| Diffusers examples | 40 | `true_cfg_scale=1` | Flow Matching / Euler | Native pipeline default |
| ComfyUI official templates | 25 | 1 | Euler / simple | T2I, edit, and background removal |

At CFG 1, negative conditioning is inactive. Diffusers can use `negative_prompt` with `true_cfg_scale > 1`, but this doubles per-step work. Prompt Studio does not append the older Qwen-Image-2512 negative list to 2.1 prompts. [Diffusers API](https://huggingface.co/docs/diffusers/main/api/pipelines/qwenimage21), [ComfyUI settings](https://docs.comfy.org/tutorials/image/qwen/qwen-image-2-1#sampler-settings)

Official 2K recommendations:

| Ratio | Width × height |
|---|---:|
| 1:1 | 2048 × 2048 |
| 4:3 | 2400 × 1792 |
| 3:4 | 1792 × 2400 |
| 3:2 | 2528 × 1696 |
| 2:3 | 1696 × 2528 |
| 16:9 | 2752 × 1536 |
| 9:16 | 1536 × 2752 |

ComfyUI’s T2I template uses a megapixel selector; about 4 MP corresponds to a 2048 square. Image editing follows the first reference image’s ratio by default. A mismatched custom canvas can shift the edit. [Official sizes](https://github.com/QwenLM/Qwen-Image-2.1#supported-aspect-ratios), [ComfyUI resolution guidance](https://docs.comfy.org/tutorials/image/qwen/qwen-image-2-1#resolution)

## ComfyUI files

The official lower-memory templates load:

```text
models/diffusion_models/qwen_image_2.1_int8_convrot.safetensors
models/text_encoders/qwen3vl_8b_int8_convrot.safetensors
models/vae/qwen_image_2.1_vae_bf16.safetensors
```

Full BF16 diffusion and encoder files are also published. The edit workflow includes a Qwen Image 2.1 Cache node for the text/reference prefix. Update ComfyUI before loading the new templates; day-zero support initially required a current/nightly build. [Comfy-Org model package](https://huggingface.co/Comfy-Org/Qwen-Image-2.1), [official workflow templates](https://github.com/Comfy-Org/workflow_templates/tree/main/templates)

Prompt Studio does not reuse its 2512 workflow export for 2.1. The models, nodes, resolution controls, and editing graph differ.

## Hardware evidence

**OFFICIAL:** no minimum or recommended VRAM figure has been published. “7B” is the visual DiT size, not a VRAM requirement; the separate 8B encoder, VAE, references, canvas, and runtime memory also count.

Early reports cannot be collapsed into one threshold:

- **COMMUNITY ANECDOTE:** 8 GB VRAM plus 32 GB system RAM reportedly completed the official INT8 ConvRot 4 MP workflow slowly.
- **COMMUNITY ANECDOTE:** 16 GB RTX 5080 laptop tests reported roughly 30–46 seconds depending on encoder precision and attention backend.
- **REPRODUCIBLE REPORT:** one RTX 5090 benchmark measured about 30.9 GB BF16, 22.6 GB FP8 peak at 2048 square, and 15.4 GB NF4 peak. Two-reference editing raised memory further. Quantization quality was not compared.

These use different weights, resolutions, references, offloading, and software. Keep VRAM unknown in the picker until official or controlled common-method measurements exist.

## Early failure reports

- **REPRODUCIBLE REPORT:** ComfyUI issue #16437 reports green/corrupt output after ROCm dynamic-VRAM eviction and reload on an RX 9070 XT. Disabling `--enable-dynamic-vram` fixed that setup. The root cause remains open. [Issue #16437](https://github.com/comfyanonymous/ComfyUI/issues/16437)
- **REPRODUCIBLE REPORT:** official repo issue #6 reports good Apple M5 Max T2I but collapsed color/contrast/alpha for image editing at 512px or larger on MPS. A code workaround is proposed, but the issue is open. [Issue #6](https://github.com/QwenLM/Qwen-Image-2.1/issues/6)
- **COMMUNITY ANECDOTE:** official repo issue #9 reports repeated same-seed edit chains becoming oversaturated and blocked; changing seed or resolution avoided it for that reporter. Treat seed changes as a debugging step, not a universal rule. [Issue #9](https://github.com/QwenLM/Qwen-Image-2.1/issues/9)
- **REPRODUCIBLE REPORT:** ComfyUI issue #16443 reports a Windows multi-GPU crash on image editing with dynamic VRAM staging; pure T2I was not confirmed affected. [Issue #16443](https://github.com/comfyanonymous/ComfyUI/issues/16443)

## License

Qwen-Image-2.1 uses the **Qwen Research License Agreement**, not Apache 2.0.

- Non-commercial research/evaluation only under the public license.
- Commercial use requires a separate license from `model-business@notice.qwencloud.com`.
- Redistribution requires the license, modification notices, and the specified NOTICE attribution.
- If the materials or outputs train or improve a distributed AI model, its documentation must display “Built with Qwen” or “Improved using Qwen.”
- Export-control compliance is the user’s responsibility.

Source: [official license](https://github.com/QwenLM/Qwen-Image-2.1/blob/main/LICENSE)

## Prompt Studio validator contract

The `qwenimg21` target checks:

1. No negative block under the default CFG-1 workflow.
2. Still-image routing; video requests are rejected.
3. Every numbered source uses its matching `<imageN>` label.
4. No unlisted reference label appears.
5. The official 10-reference limit.
6. A preservation clause for edits except pure background removal.
7. Exact quoted visible text.
8. The official RGBA wrapper when transparency is requested.
9. No accidental switch into RGBA mode.

The general grounding checker still catches common invented colors, clothing, style, camera, lighting, weather, weapons, and extra actions. As with every prose checker, this is a bounded heuristic rather than proof of semantic faithfulness.
