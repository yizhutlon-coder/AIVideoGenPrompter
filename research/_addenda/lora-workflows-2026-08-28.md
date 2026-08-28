# ComfyUI LoRA Workflow Best Practices — Addendum

**Research date: 2026-08-28.** All URLs accessed 2026-08-28 unless noted.
Purpose: ground the auto-generated-workflow feature (optional LoRA support) of the
teaching app in verifiable node schemas and real serialized workflows.

## Evidence labels

| Label | Meaning |
|---|---|
| `[OFFICIAL]` | ComfyUI core source, Comfy-Org repos/docs/templates, or the upstream author's own repo/source |
| `[STAFF]` | Statement by a maintainer (comfyanonymous, kijai, rgthree, Comfy-Org staff) outside of source |
| `[TESTED]` | A real, shipped/serialized workflow or test fixture demonstrating the shape in practice |
| `[LORE]` | Community consensus / tutorial-site claim; useful default but not authoritative |

> **Reading rule for this file:** every claim carries a label + URL. Where a claim is
> `[LORE]`, the app should expose it as a *suggestion with a range*, never as a hard default
> the student cannot see or change.

---

# 1. Native LoRA wiring per family

## 1.1 The two core node classes (exact schemas)

Source of truth: `ComfyUI/nodes.py` on `master`, read 2026-08-28 via
`https://raw.githubusercontent.com/comfyanonymous/ComfyUI/master/nodes.py`
(browse: <https://github.com/comfyanonymous/ComfyUI/blob/master/nodes.py>).

### `LoraLoader` — [OFFICIAL]

```python
class LoraLoader:
    ESSENTIALS_CATEGORY = "Image Generation"

    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "model": ("MODEL", {"tooltip": "The diffusion model the LoRA will be applied to."}),
                "clip": ("CLIP", {"tooltip": "The CLIP model the LoRA will be applied to."}),
                "lora_name": (folder_paths.get_filename_list("loras"), {"tooltip": "The name of the LoRA."}),
                "strength_model": ("FLOAT", {"default": 1.0, "min": -100.0, "max": 100.0, "step": 0.01, ...}),
                "strength_clip": ("FLOAT", {"default": 1.0, "min": -100.0, "max": 100.0, "step": 0.01, ...}),
            }
        }

    RETURN_TYPES = ("MODEL", "CLIP")
    FUNCTION = "load_lora"
    CATEGORY = "model/loaders"
```

* **Widget order (this is the `widgets_values` array order):**
  `[lora_name, strength_model, strength_clip]`.
* **Input slot order:** `model` (0), `clip` (1). Both are *required* — a `LoraLoader` with a
  dangling `clip` will fail validation.
* **Outputs:** `MODEL` (0), `CLIP` (1).
* Strength range is `-100.0 … 100.0`, step `0.01`. Negative strengths are legal and
  documented ("This value can be negative") — useful for "anti-LoRA" teaching demos.

### `LoraLoaderModelOnly` — [OFFICIAL]

```python
class LoraLoaderModelOnly(LoraLoader):
    @classmethod
    def INPUT_TYPES(s):
        return {"required": { "model": ("MODEL",),
                              "lora_name": (folder_paths.get_filename_list("loras"), ),
                              "strength_model": ("FLOAT", {"default": 1.0, "min": -100.0, "max": 100.0, "step": 0.01}),
                              }}
    RETURN_TYPES = ("MODEL",)
    FUNCTION = "load_lora_model_only"

    def load_lora_model_only(self, model, lora_name, strength_model):
        return (self.load_lora(model, None, lora_name, strength_model, 0)[0],)
```

* **Widget order:** `[lora_name, strength_model]` — only two entries.
* **Input slot order:** `model` (0). **Outputs:** `MODEL` (0).
* Internally it calls the same `load_lora` with `clip=None` and `strength_clip=0`.

### ⚠️ Display names flipped — [OFFICIAL], important for a teaching app

`NODE_DISPLAY_NAME_MAPPINGS` in the same `nodes.py`:

```python
"LoraLoader": "Load LoRA (Model and CLIP)",
"LoraLoaderModelOnly": "Load LoRA",
```

As of the current `master`, the **model-only loader is the one simply called "Load LoRA"** in
the node menu; the CLIP-carrying one is disambiguated as "Load LoRA (Model and CLIP)".
Older tutorials that say "add a Load LoRA node and wire CLIP through it" now point at a
node that *has no CLIP input*. The app's tutor copy must use the **class names**
(`LoraLoader` / `LoraLoaderModelOnly`) and mention both display names, or students will
follow a stale screenshot and get a validation error.

### When model-only is *required*

`LoraLoaderModelOnly` is mandatory whenever there is no `CLIP` object in the graph to patch,
or where patching the text encoder is meaningless/harmful:

1. **Any `UNETLoader` / "Load Diffusion Model" graph** (Flux, Qwen-Image, Wan, LTX, Z-Image,
   Krea in diffusion-model form): the text encoder is loaded separately by `CLIPLoader`, and
   the LoRA lives on the diffusion transformer. `[OFFICIAL]` — the family templates below all
   use `LoraLoaderModelOnly` in exactly this position.
2. **Wan 2.2 A14B MoE (two experts)**: two independent `MODEL` chains (high-noise, low-noise).
   The single `CLIP` (umt5) is shared and is *not* routed through the LoRA loaders. See §1.4.
3. **Speed/distill LoRAs generally** (Lightning/lightx2v, LTX distilled, Turbo/acc LoRAs):
   these are pure diffusion-transformer deltas; there is no text-encoder component to apply.

`LoraLoader` (with CLIP) is correct for **checkpoint-based image families where the LoRA was
trained with a text-encoder side** — classically SD1.5 and SDXL. `[OFFICIAL]`
docs.comfy.org describes `strength_clip` as "typically used between 0~1 for daily image
generation": <https://docs.comfy.org/built-in-nodes/LoraLoader>

`[OFFICIAL]` model-only doc page: <https://docs.comfy.org/built-in-nodes/LoraLoaderModelOnly>
— "This node specializes in loading a LoRA model without requiring a CLIP model."

---

## 1.2 The canonical chains

### A. Checkpoint families (SDXL, SD1.5, and any `CheckpointLoaderSimple` graph)

```
CheckpointLoaderSimple ──MODEL──> LoraLoader ──MODEL──> KSampler.model
                       ──CLIP───> LoraLoader ──CLIP───> CLIPTextEncode (positive)
                                                   └──> CLIPTextEncode (negative)
                       ──VAE────────────────────────────> VAEDecode
```

Both text-encode nodes must take the **post-LoRA** CLIP. A very common auto-generation bug is
patching only the positive encoder. `[OFFICIAL]` docs.comfy.org LoraLoader page: "If you need
to load multiple LoRA models, you can directly chain multiple nodes together."

Minimal `LoraLoader` node object (UI/workflow format), synthesised from the verified schema:

```json
{
  "id": 10,
  "type": "LoraLoader",
  "order": 1,
  "mode": 0,
  "inputs": [
    { "name": "model", "type": "MODEL", "link": 4 },
    { "name": "clip",  "type": "CLIP",  "link": 5 }
  ],
  "outputs": [
    { "name": "MODEL", "type": "MODEL", "links": [11] },
    { "name": "CLIP",  "type": "CLIP",  "links": [12, 13] }
  ],
  "properties": { "Node name for S&R": "LoraLoader", "cnr_id": "comfy-core" },
  "widgets_values": [ "my_style_lora.safetensors", 0.8, 0.8 ]
}
```

API/prompt format for the same node:

```json
"10": {
  "class_type": "LoraLoader",
  "inputs": {
    "lora_name": "my_style_lora.safetensors",
    "strength_model": 0.8,
    "strength_clip": 0.8,
    "model": ["4", 0],
    "clip":  ["4", 1]
  }
}
```

### B. Diffusion-model families (Flux, Qwen-Image, Z-Image, Krea, LTX, Wan — native)

```
UNETLoader ──MODEL──> LoraLoaderModelOnly ──MODEL──> (ModelSampling* / sampler)
CLIPLoader ──CLIP───────────────────────────────────> CLIPTextEncode      (LoRA does NOT touch this)
VAELoader  ──VAE────────────────────────────────────> VAEDecode
```

The CLIP path bypasses the LoRA entirely. **This is the structural difference the app must
encode**: family → `usesModelOnlyLoader: true|false`.

Real serialized `LoraLoaderModelOnly` from an **official Comfy-Org template**
(`templates/video_ltx2_3_id_lora.json`, node 293), `[OFFICIAL]` + `[TESTED]`:
<https://github.com/Comfy-Org/workflow_templates/blob/main/templates/video_ltx2_3_id_lora.json>

```json
{
  "id": 293,
  "type": "LoraLoaderModelOnly",
  "order": 10,
  "mode": 0,
  "inputs": [
    { "localized_name": "model", "name": "model", "type": "MODEL", "link": 658 },
    { "localized_name": "lora_name", "name": "lora_name", "type": "COMBO",
      "widget": { "name": "lora_name" }, "link": 738 }
  ],
  "outputs": [
    { "localized_name": "MODEL", "name": "MODEL", "type": "MODEL", "links": [755, 782] }
  ],
  "properties": {
    "cnr_id": "comfy-core",
    "ver": "0.3.75",
    "Node name for S&R": "LoraLoaderModelOnly",
    "models": [
      {
        "name": "ltx_2.3_22b_distilled_1.1_lora_dynamic_fro09_avg_rank_111_bf16.safetensors",
        "url": "https://huggingface.co/Comfy-Org/ltx-2.3/resolve/main/split_files/loras/ltx_2.3_22b_distilled_1.1_lora_dynamic_fro09_avg_rank_111_bf16.safetensors",
        "directory": "loras"
      }
    ]
  },
  "widgets_values": [
    "ltx_2.3_22b_distilled_1.1_lora_dynamic_fro09_avg_rank_111_bf16.safetensors",
    0.5
  ]
}
```

Three things worth copying into the generator:

1. **`properties.models[]`** — an array of `{name, url, directory}`. The ComfyUI frontend uses
   this to offer "download the missing model" when a student opens the workflow. For a
   teaching app that ships LoRA-enabled workflows this is the single highest-value optional
   field. `[OFFICIAL]` (present in every Comfy-Org template that references a downloadable
   weight).
2. **`properties["Node name for S&R"]`** and `cnr_id: "comfy-core"` — mark the node as core so
   ComfyUI-Manager does not report it as a missing custom node.
3. `lora_name` is serialized **both** as `widgets_values[0]` and as an `inputs[]` entry of type
   `COMBO` with a `widget: {name: "lora_name"}` back-reference (because in this template the
   filename is driven by an upstream primitive, `link: 738`). For a hand-generated workflow you
   normally omit the `inputs` COMBO entry and keep only `widgets_values`.

---

## 1.3 Per-family notes

| Family | Loader node | CLIP through loader? | Notes |
|---|---|---|---|
| SDXL / SD1.5 (checkpoint) | `LoraLoader` | **Yes** | Both positive and negative `CLIPTextEncode` must consume the patched CLIP. |
| Flux (dev/klein, `UNETLoader` + dual `CLIPLoader`) | `LoraLoaderModelOnly` | No | T5-XXL + CLIP-L loaded via `DualCLIPLoader`; Flux LoRAs are transformer-only. |
| Z-Image / Z-Image Turbo | `LoraLoaderModelOnly` | No | Turbo is distilled → see §4 de-distillation. |
| Qwen-Image / Qwen-Image-Edit | `LoraLoaderModelOnly` | No | Text side is a Qwen2.5-VL encoder via `CLIPLoader`; never LoRA'd by image LoRAs. |
| Krea (Raw + turbo-LoRA) | `LoraLoaderModelOnly` | No | The turbo LoRA *is* a `LoraLoaderModelOnly` in the chain. |
| Wan 2.2 A14B (native) | `LoraLoaderModelOnly` ×2 | No | One chain per expert. See §1.4. |
| Wan 2.2 TI2V-5B (native) | `LoraLoaderModelOnly` | No | Single model → single chain. |
| Wan (WanVideoWrapper) | `WanVideoLoraSelect` | n/a | Structurally different — see §1.5. |
| LTX-2.x | `LoraLoaderModelOnly` | No | Official templates chain distilled LoRA → ID/IC LoRA. See §1.6. |

`[OFFICIAL]` for the Wan native structure: <https://docs.comfy.org/tutorials/video/wan/wan2_2>
— the 14B templates use two `Load Diffusion Model` nodes (high-noise, low-noise) and one
`Load CLIP` (umt5).

---

## 1.4 Wan 2.2 A14B — the two-expert rule

Wan 2.2 A14B is a MoE with a **high-noise expert** and a **low-noise expert**, split by
denoising timestep. `[OFFICIAL]` <https://docs.comfy.org/tutorials/video/wan/wan2_2>

Consequences for LoRA auto-generation:

* **Every LoRA must be applied twice** — once on the high-noise `MODEL` chain and once on the
  low-noise `MODEL` chain — or the effect will only apply to half the denoising schedule and
  the result will visibly drift mid-clip.
* Speed LoRAs ship as **separate HIGH and LOW files** and must not be crossed. Real example
  from a shipped Wan workflow (`[TESTED]`,
  <https://github.com/artokun/comfyui-mcp/blob/main/packs/wan-longer-videos/workflow.json>):
  `Wan2.2-Lightning_I2V-A14B-4steps-lora_HIGH_fp16.safetensors` on the high chain,
  `..._LOW_fp16.safetensors` on the low chain, both at strength `1`.
* In that same real workflow, only **one** of the two loader nodes has a `CLIP` link; the other
  has `"link": null` on its clip input. That is the practical shape of "don't LoRA the text
  encoder twice" when a CLIP-capable loader is used on a video model.
* Structurally identical advice applies to Wan 2.2 "SVI"/Pro dual-noise variants: `[LORE]`
  <https://www.apatero.com/blog/wan-22-pro-svi-lora-loader-comfyui-complete-guide-2025>
  ("Always use LoraLoaderModelOnly, never the standard LoraLoader… you need LoRAs on BOTH the
  high-noise and low-noise model paths").

## 1.5 WanVideoWrapper (kijai) — structurally different, do NOT auto-generate

`ComfyUI-WanVideoWrapper` does not use `MODEL` at all for LoRAs. It uses a `WANVIDLORA`
select-chain that feeds the **model loader**, not the sampler:

```
WanVideoLoraSelect ──WANVIDLORA──> WanVideoLoraSelect (chained via prev_lora) ──> WanVideoModelLoader
```

* Node classes: `WanVideoLoraSelect`, `WanVideoLoraSelectMulti` (and `WanVideoLoraBlockEdit`
  for per-block masking). `[OFFICIAL]` <https://github.com/kijai/ComfyUI-WanVideoWrapper/blob/main/nodes.py>
* Extra widgets not present in core: `blocks` (per-block strength dict), `low_mem_load`
  (bool, trades load speed for VRAM), `merge_loras`.
* Known interaction: `low_mem_load` is ignored when `merge_loras` is off. `[OFFICIAL]` issue
  <https://github.com/kijai/ComfyUI-WanVideoWrapper/issues/1036>
* **Recommendation for the app:** do not emit wrapper graphs. Native Wan nodes are shipped and
  documented by Comfy-Org; the wrapper's node surface changes fast and a student who does not
  have it installed gets a red graph. If a student *pastes in* a wrapper workflow, the tutor
  should recognise `WanVideoLoraSelect` and explain the difference rather than trying to
  rewrite it.

## 1.6 LTX-2.x — chained distilled + task LoRA, official pattern

From `templates/video_ltx2_3_id_lora.json` `[OFFICIAL]` + `[TESTED]`:

* Node 293: `LoraLoaderModelOnly`, `ltx_2.3_22b_distilled_1.1_lora_dynamic_...bf16.safetensors`,
  **strength 0.5**, output link `755`.
* Node 346: `LoraLoaderModelOnly`, `ltx-2.3-id-lora-talkvid-3k.safetensors`,
  **strength 1.0**, input link `755` (i.e. directly downstream of node 293).

So the official order is **speed/distill LoRA first (partial strength), task LoRA second (full
strength)**. The distilled LoRA's output also fans out to a second consumer (`links: [755, 782]`),
i.e. the pre-ID-LoRA model is reused elsewhere in the graph.

There is a second official LTX LoRA template, `video_ltx2_3_ic_lora` ("LTX 2.3 IC-LoRA Union
Control"), listed in the template index `[OFFICIAL]`
<https://github.com/Comfy-Org/workflow_templates/blob/main/templates/index.json>.
LTX does **not** introduce a bespoke `LTXVLoraLoader` class — core `LoraLoaderModelOnly` is used.

---

# 2. Multi-LoRA chaining

## 2.1 The canonical mechanism

`[OFFICIAL]` comfyanonymous's own examples site
(<https://comfyanonymous.github.io/ComfyUI_examples/lora/>):

> "Loras are patches applied on top of the main MODEL and the CLIP model… You can apply
> multiple Loras by chaining multiple LoraLoader nodes… All LoRA flavours: Lycoris, loha,
> lokr, locon, etc… are used this way."

`[OFFICIAL]` <https://docs.comfy.org/tutorials/basic/multiple-loras> — the official multi-LoRA
tutorial is literally two `Load LoRA` nodes in series, `MODEL`→`MODEL` and `CLIP`→`CLIP`.
There is no core "stacker" node; **serial chaining is the only native mechanism.**

## 2.2 Does order matter? — the actual answer

Read `comfy/lora.py :: calculate_weight` (source, 2026-08-28,
<https://github.com/comfyanonymous/ComfyUI/blob/master/comfy/lora.py>). Patches are stored
per-key in a list and replayed **in insertion order**:

```python
def calculate_weight(patches, weight, key, ...):
    for p in patches:
        strength = p[0]; v = p[1]; strength_model = p[2]; offset = p[3]; function = p[4]
        ...
        if isinstance(v, weight_adapter.WeightAdapterBase):
            output = v.calculate_weight(weight, key, strength, strength_model, offset, ...)
            ...
        if patch_type == "diff":
            ...
            weight += function(strength * cast_to_device(diff, weight.device, weight.dtype))
        elif patch_type == "set":
            weight.copy_(v[0])          # <-- DESTRUCTIVE, not commutative
        elif patch_type == "model_as_lora":
            weight += function(strength * diff_weight)
```

Conclusions the app can state honestly `[OFFICIAL]`:

* **For ordinary LoRA/LoHa/LoKr/LoCon adapters, chaining is additive** (`weight += strength·Δ`
  per adapter). Addition is commutative, so **swapping the order of two plain LoRA loaders
  produces the same weights** up to float non-associativity (visually identical; not always
  bit-identical, so a fixed seed can still shift a pixel or two).
* **Order genuinely matters** in three cases:
  1. A LoRA that carries `.set_weight` keys → `patch_type == "set"` → `weight.copy_()` wipes
     everything applied earlier for that key. BFL's Flux control LoRAs are converted into
     exactly this shape (`convert_lora_bfl_control` emits `.set_weight`, see
     `comfy/lora_convert.py`).
  2. Anything non-LoRA inserted mid-chain that returns a *different* model object
     (`ModelSamplingSD3`, `ModelSamplingAuraFlow`, `CFGNorm`, patch-loaders). Put **all**
     LoRA loaders before those.
  3. `strength_model != 1.0` on a *preceding* patch entry: `calculate_weight` does
     `weight *= strength_model` before applying the patch, which is a scaling of the
     already-patched weight.
* Community guidance to "keep a consistent convention (style → character → object)" is
  `[LORE]` and is about *reasoning*, not math:
  <https://neurocanvas.net/blog/multi-lora-workflows-comfyui/>

**App recommendation:** emit LoRA loaders in the order the user listed them, put them all
immediately after the model loader and before any sampling-patch node, and tell the student
that for ordinary LoRAs the order is cosmetic.

## 2.3 model vs clip strength convention

* `strength_model` and `strength_clip` are independent floats on `LoraLoader`. Default `1.0`
  each. `[OFFICIAL]`
* Most UIs (A1111 `<lora:name:0.8>`, rgthree "Single Strength" mode, Lora-Manager) collapse
  them to **one number used for both**. rgthree's backend: `strength_clip = value['strengthTwo']
  if 'strengthTwo' in value else … strength_model` `[OFFICIAL]`
  (<https://github.com/rgthree/rgthree-comfy/blob/main/py/power_lora_loader.py>).
* **A single strength for both is the correct default for an auto-generator.** Splitting them
  is an advanced move (lowering `strength_clip` while keeping `strength_model` reduces prompt
  contamination from the trigger token). `[LORE]`
* On any `LoraLoaderModelOnly` path, clip strength is structurally `0` — the app must not
  surface a clip-strength control at all for those families, or students will set a number
  that does nothing.

## 2.4 Stacking budget

`[LORE]`, but consistent across 2026 guides: 2–3 LoRAs max, each ~0.4–0.8, keeping the
**summed** strength under about 2.0; lower each one when stacking.
<https://www.promptzone.com/tara_suzuki/how-to-use-loras-in-comfyui-in-2026-load-stack-and-troubleshoot-235e>,
<https://eastondev.com/blog/en/posts/ai/20260720-comfyui-lora-guide/>

Mechanical cost `[OFFICIAL]`: each `LoraLoader` instance caches exactly one LoRA
(`self.loaded_lora = (lora_path, lora, lora_metadata)` in `nodes.py`) and each call does
`model.clone()`. A ten-loader chain therefore holds ten LoRA state-dicts in RAM plus ten
patcher clones — a real cause of "it worked yesterday" OOM reports on 8–12 GB cards.

## 2.5 Trigger words

* A trigger word is a property of the **individual LoRA** (the caption token it was trained
  on), never of the family. Nothing in ComfyUI core injects it — the student must type it.
  `[OFFICIAL]` (no trigger-word handling exists anywhere in `nodes.py` / `comfy/lora.py`).
* Ecosystem tooling that does inject it reads Civitai's `trainedWords` array:
  rgthree `get_enabled_triggers_from_prompt_node()` → `info['trainedWords'][:max_each]`
  `[OFFICIAL]` (<https://github.com/rgthree/rgthree-comfy/blob/main/py/power_lora_loader.py>);
  ComfyUI-Lora-Manager's loader "will automatically apply preset strength and trigger words"
  `[OFFICIAL]` (<https://github.com/willmiao/ComfyUI-Lora-Manager/blob/main/README.md>).
* Family tendencies `[LORE]`:
  * **SD1.5 / SDXL** — trigger words are the norm; without the token a character LoRA often
    does almost nothing even at strength 1.0.
  * **Flux, Qwen-Image, Z-Image, Krea** — many 2025–26 LoRAs are trained on natural-language
    captions and describe the subject in plain prose instead of a rare token; a trigger word
    may still exist and is usually a short phrase.
  * **Wan / LTX motion & style LoRAs** — trigger phrases are common and are usually a short
    English motion description embedded in the prompt.
  * **Speed / distillation LoRAs (Lightning, lightx2v, LTX-distilled, Turbo, acceleration
    LoRAs) never have trigger words.** If the app's UI asks for one, it is asking a nonsense
    question. Treat "speed LoRA" as a distinct kind in the data model.

**App recommendation:** store LoRAs as
`{file, kind: "style"|"character"|"concept"|"speed"|"control", baseFamily, strength, triggerWords[]}`
and only render the trigger-word field when `kind != "speed"`.

---

# 3. Manager-ecosystem nodes (EXPERIMENTAL export mode)

## 3.1 Which one to support — the popularity evidence

ComfyUI Registry API, fetched 2026-08-28:

| Pack | Registry `downloads` | `github_stars` | Latest version (registry) | Endpoint |
|---|---:|---:|---|---|
| `rgthree-comfy` | **3,879,247** | 3,400 | `1.0.2608210019` (2026-08-21) | <https://api.comfy.org/nodes/rgthree-comfy> |
| `comfyui-lora-manager` | 766,384 | 1,406 | `1.2.1` (2026-08-16) | <https://api.comfy.org/nodes/comfyui-lora-manager> |
| `comfyui-manager` | 14,207 * | **15,876** | `3.0.1` | <https://api.comfy.org/nodes/comfyui-manager> |

\* ComfyUI-Manager's registry download count is unrepresentative — it is normally installed by
git/bundled with desktop builds, not from the registry. Its 15.9k stars are the real signal.

**Decision: support exactly one third-party loader — rgthree's `Power Lora Loader (rgthree)`.**
`[OFFICIAL]` justification beyond the 5× download lead:
Comfy-Org's own `comfy-cli` has hard-coded special-casing for this node's dynamic-widget
payload in its workflow→API converter
(<https://github.com/Comfy-Org/comfy-cli/blob/main/comfy_cli/workflow_to_api.py>):

```python
clean = {k: v for k, v in value.items() if k != "strengthTwo" or v is not None}
out[name] = clean
```

i.e. first-party Comfy-Org tooling already treats this serialization as something it must
understand. No other third-party LoRA loader has that status.

## 3.2 `Power Lora Loader (rgthree)` — exact serialization

**Node class / `type` string as serialized:** `Power Lora Loader (rgthree)`
`[OFFICIAL]` — built as `addRgthree("Power Lora Loader")` where `addRgthree(str) => str + " (rgthree)"`
(<https://github.com/rgthree/rgthree-comfy/blob/main/src_web/comfyui/constants.ts>).
The Python class is `RgthreePowerLoraLoader`, but the *registered key* (and therefore the
`class_type` in API JSON and `type` in workflow JSON) is the display string above.

**Backend contract** `[OFFICIAL]`
(<https://github.com/rgthree/rgthree-comfy/blob/main/py/power_lora_loader.py>):

```python
class RgthreePowerLoraLoader:
  @classmethod
  def INPUT_TYPES(cls):
    return {
      "required": {},
      "optional": FlexibleOptionalInputType(type=any_type, data={
        "model": ("MODEL",),
        "clip": ("CLIP",),
      }),
      "hidden": {},
    }
  RETURN_TYPES = ("MODEL", "CLIP")
  RETURN_NAMES = ("MODEL", "CLIP")
  FUNCTION = "load_loras"

  def load_loras(self, model=None, clip=None, **kwargs):
    for key, value in kwargs.items():
      key = key.upper()
      if key.startswith('LORA_') and 'on' in value and 'lora' in value and 'strength' in value:
        strength_model = value['strength']
        strength_clip = value['strengthTwo'] if 'strengthTwo' in value else None
        if clip is None:
          ...
          strength_clip = 0
        else:
          strength_clip = strength_clip if strength_clip is not None else strength_model
        if value['on'] and (strength_model != 0 or strength_clip != 0):
          lora = get_lora_by_filename(value['lora'], log_node=self.NAME)
          if model is not None and lora is not None:
            model, clip = LoraLoader().load_lora(model, clip, lora, strength_model, strength_clip)
    return (model, clip)
```

Key facts for a generator:

* `model` and `clip` are both **optional** in the current version — so this node is legal on a
  video/diffusion-model graph with `clip` unconnected (it degrades to model-only, forcing
  `strength_clip = 0`). Older releases had them `required`; do not assume.
* Dynamic inputs are named `lora_1`, `lora_2`, … (frontend: `"lora_" + this.loraWidgetsCounter`).
  Only keys matching `^LORA_` (case-insensitive) are processed.
* Per-LoRA payload dict: `{ "on": bool, "lora": str, "strength": float, "strengthTwo": float|null }`.
  `strengthTwo` is only emitted when the node property `"Show Strengths"` is
  `"Separate Model & Clip"`; in `"Single Strength"` mode `strength` is used for both.
* It internally delegates to core `LoraLoader().load_lora(...)` — so the *semantics* are
  identical to a serial chain of core loaders. That is what makes a "convert Power Lora Loader
  ⇄ core chain" feature safe and is the right thing to teach.

### Real serialized node (workflow / UI format) — `[TESTED]`

From a shipped Wan 2.2 workflow,
<https://github.com/artokun/comfyui-mcp/blob/main/packs/wan-longer-videos/workflow.json>
(node id 476, verbatim):

```json
{
  "id": 476,
  "type": "Power Lora Loader (rgthree)",
  "size": [514.27, 217.60],
  "flags": {},
  "order": 162,
  "mode": 4,
  "inputs": [
    { "dir": 3, "name": "model", "type": "MODEL", "link": 641 },
    { "dir": 3, "name": "clip",  "type": "CLIP",  "link": null }
  ],
  "outputs": [
    { "dir": 4, "name": "MODEL", "shape": 3, "type": "MODEL", "links": [524] },
    { "dir": 4, "name": "CLIP",  "shape": 3, "type": "CLIP",  "links": [] }
  ],
  "properties": {
    "cnr_id": "rgthree-comfy",
    "ver": "1.0.2507112302",
    "Show Strengths": "Single Strength",
    "aux_id": "rgthree/rgthree-comfy",
    "widget_ue_connectable": {}
  },
  "widgets_values": [
    {},
    { "type": "PowerLoraLoaderHeaderWidget" },
    {
      "on": true,
      "lora": "Wan2.2-Lightning_T2V-v1.1-A14B-4steps-lora_LOW_fp16.safetensors",
      "strength": 1,
      "strengthTwo": null
    },
    {
      "on": false,
      "lora": "Wan2.1_T2V_14B_FusionX_LoRA.safetensors",
      "strength": 1,
      "strengthTwo": null
    },
    {},
    ""
  ]
}
```

**`widgets_values` layout — memorise this shape:**

| Index | Value | Widget |
|---|---|---|
| 0 | `{}` | leading `RgthreeDividerWidget` (spacer) |
| 1 | `{"type": "PowerLoraLoaderHeaderWidget"}` | the "Toggle All" header row |
| 2 … n | `{"on": …, "lora": …, "strength": …, "strengthTwo": …}` | one per LoRA row, in visual order |
| n+1 | `{}` | trailing `RgthreeDividerWidget` (button spacer) |
| n+2 | `""` | the `➕ Add Lora` `RgthreeBetterButtonWidget` |

A zero-LoRA node therefore serializes as `[{}, {"type":"PowerLoraLoaderHeaderWidget"}, {}, ""]`
— also confirmed `[TESTED]` in
<https://github.com/artokun/comfyui-mcp/blob/main/packs/z-image-turbo/workflow.json> (node 69)
and in the Image-MetaHub parser fixture
<https://github.com/LuqP2/Image-MetaHub/blob/main/__tests__/comfyui-parser.test.ts>:
`widgets_values: [{}, { type: 'PowerLoraLoaderHeaderWidget' }, { on: true, lora: 'sdxl/Realism Lora By Stable Yogi_V3_Lite.safetensors', strength: 1 }, {}, '']`.

`properties` fields that matter: `cnr_id: "rgthree-comfy"` and `aux_id: "rgthree/rgthree-comfy"`
are what ComfyUI-Manager's "Install Missing Custom Nodes" uses to resolve the pack. **Emit
both** or the student gets a red node with no install offer. `"Show Strengths"` must be
`"Single Strength"` or `"Separate Model & Clip"` (exact strings).

### API / prompt format — `[TESTED]`

<https://github.com/nixified-ai/flake/blob/master/flake-modules/projects/comfyui/vm-test/custom-nodes-test.json>:

```json
"12": {
  "class_type": "Power Lora Loader (rgthree)",
  "inputs": {
    "PowerLoraLoaderHeaderWidget": { "type": "PowerLoraLoaderHeaderWidget" },
    "lora_1": { "on": true, "lora": "my_lora.safetensors", "strength": 0.8 },
    "model": ["4", 0],
    "clip":  ["4", 1]
  }
}
```

Note the header widget is carried into `inputs` under its own name — harmless to the backend
(it does not match `^LORA_`) but **must be present** for the frontend's
`configureFromApiJson()` round-trip to lay the node out correctly. `[OFFICIAL]`
(<https://github.com/rgthree/rgthree-comfy/blob/main/web/comfyui/power_lora_loader.js>).

### Known sharp edge — `[OFFICIAL]`

ComfyUI's stock API-JSON loading does not restore dynamic widgets; rgthree works around it
with a `setTimeout(… 16)` re-`configure()` in the constructor. Practical consequence for a
teaching app: **ship the UI/workflow format, not the API format**, when the workflow contains a
Power Lora Loader. Related upstream report:
<https://github.com/rgthree/rgthree-comfy/issues/564>

## 3.3 ComfyUI-Lora-Manager (willmiao) — for recognition, not generation

Registered node keys are `<Class>.NAME` values; the human-readable names are
`… (LoraManager)`. `[OFFICIAL]`
<https://github.com/willmiao/ComfyUI-Lora-Manager/blob/main/__init__.py>

| Python class | UI name |
|---|---|
| `LoraLoaderLM` | `Lora Loader (LoraManager)` |
| `LoraTextLoaderLM` | `LoRA Text Loader (LoraManager)` |
| `LoraStackerLM` | `Lora Stacker (LoraManager)` |
| `LoraStackCombinerLM` | `Lora Stack Combiner (LoraManager)` |
| `TriggerWordToggleLM` | `TriggerWord Toggle (LoraManager)` |
| `PromptLM` / `TextLM` | `Prompt (LoraManager)` / `Text (LoraManager)` |
| `UNETLoaderLM` / `CheckpointLoaderLM` | `Unet Loader (LoraManager)` / `Checkpoint Loader (LoraManager)` |
| `WanVideoLoraSelectLM` / `WanVideoLoraTextSelectLM` | WanVideoWrapper-compatible selectors |
| `LoraPoolLM`, `LoraRandomizerLM`, `LoraCyclerLM`, `LoraInfoLM`, `LoraSyntaxToPath`, `CreateHookLoraLM`, `MetadataOverwriteLM`, `SaveImageLM`, `DebugMetadataLM` | assorted |

Serialization style is **fundamentally different from rgthree**: LoRAs are encoded as an
A1111-style *text* widget (`AUTOCOMPLETE_TEXT_LORAS`, e.g. `<lora:name:0.8>`), not as a dict
per row, plus an optional `LORA_STACK` input. Outputs are `(MODEL, CLIP, trigger_words,
loaded_loras)`. `[OFFICIAL]`
<https://deepwiki.com/willmiao/ComfyUI-Lora-Manager/3.1-custom-nodes>

Because the payload is free text, a generator would have to reproduce that pack's syntax
exactly and would silently produce a no-op if the syntax drifts. **Do not generate these.**
The tutor should recognise the class names and explain them.

## 3.4 What "Install Missing Custom Nodes" looks like for the student

`[OFFICIAL]` <https://docs.comfy.org/manager/legacy-ui>

1. Student opens the exported workflow. ComfyUI shows a **missing-node dialog** listing the
   unknown `type` strings.
2. Student clicks **Open Manager** → **Install Missing Custom Nodes** → sees a filtered list →
   **Install** (prefer a numbered registry version over `nightly`; ComfyUI's default security
   level blocks `nightly` installs).
3. Manager installs dependencies, then **prompts for a ComfyUI restart**; after restart the
   student should verify there is no `import failed` marker in the Manager list.
4. Documented failure cases: the pack is not registered in the registry, the pack is not open
   source, or the author renamed/removed the node. The docs explicitly say the missing-node
   list can come up empty in those cases.

Additional 2026 caveats `[LORE]`: a red node can also mean "installed but failed to import",
and when two packs export the same node name the student can silently get a different
implementation. <https://localaimaster.com/blog/comfyui-missing-node-types>

**App recommendation for EXPERIMENTAL mode:** ship the workflow with an inline
`MarkdownNote`/`Note` node naming the required pack and its GitHub URL, and always offer a
one-click "core-nodes-only" re-export that replaces the Power Lora Loader with an equivalent
serial `LoraLoader`/`LoraLoaderModelOnly` chain. Because the rgthree node delegates to core
`LoraLoader`, the two exports are numerically equivalent.

---

# 4. Recommended default strengths

## 4.1 The one fully-worked official image example (copy this shape)

Comfy-Org's own `Qwen Image: Illustration LoRA` template `[OFFICIAL]`
(<https://comfy.org/workflows/template_qwen_image_illustration_lora-e41b80eb587d/>,
JSON: <https://comfy.org/workflows/download/e41b80eb587d.json>) is the cleanest reference
LoRA graph Comfy-Org ships for an image family. Verbatim structure:

```
UNETLoader(qwen_image_fp8_e4m3fn.safetensors)
   └─MODEL─> LoraLoaderModelOnly(illustration-1.0-qwen-image.safetensors, 1.0)
                └─MODEL─> ModelSamplingAuraFlow(7)
                             └─MODEL─> KSampler(steps 45, cfg 3.5, euler, simple, denoise 1)
CLIPLoader(qwen_2.5_vl_7b_fp8_scaled.safetensors, "qwen_image", "default")
   └─CLIP──> CLIPTextEncode (positive)   [LoRA NOT in this path]
   └─CLIP──> CLIPTextEncode (negative)
VAELoader(qwen_image_vae.safetensors) ──> VAEDecode
```

The LoRA node, verbatim:

```json
{
  "id": 73,
  "type": "LoraLoaderModelOnly",
  "inputs": [
    { "localized_name": "model", "name": "model", "type": "MODEL", "link": 129 },
    { "localized_name": "lora_name", "name": "lora_name", "type": "COMBO", "widget": {"name": "lora_name"}, "link": 141 },
    { "localized_name": "strength_model", "name": "strength_model", "type": "FLOAT", "widget": {"name": "strength_model"}, "link": 142 }
  ],
  "outputs": [ { "localized_name": "MODEL", "name": "MODEL", "type": "MODEL", "links": [130] } ],
  "properties": {
    "Node name for S&R": "LoraLoaderModelOnly",
    "cnr_id": "comfy-core",
    "ver": "0.3.49",
    "models": [
      { "directory": "loras",
        "name": "illustration-1.0-qwen-image.safetensors",
        "url": "https://huggingface.co/alvdansen/illustration-1.0-qwen-image/resolve/main/illustration-1.0-qwen-image.safetensors" }
    ]
  },
  "widgets_values": [ "illustration-1.0-qwen-image.safetensors", 1 ]
}
```

And the template's own `MarkdownNote` states, verbatim `[OFFICIAL]`:

```
Sampler: euler
Scheduler: simple
CFG: 3.5
Steps: 45 (30-60 works well)
LoRA strength: 0.8-1.0
```

Three patterns worth stealing wholesale for the teaching app:

* **The LoRA loader sits between the model loader and the sampling-patch node**
  (`ModelSamplingAuraFlow`), not after it. Same rule for `ModelSamplingSD3` / `ModelSamplingFlux`.
* **`MarkdownNote` carrying recommended settings + every model download link.** This is
  Comfy-Org's own convention for teaching inside a workflow. Emit one.
* **Subgraph + `proxyWidgets`** to expose only `prompt`, `lora_name`, `strength_model`,
  `steps`, `cfg` to the student. `properties.proxyWidgets` is a list of `[nodeId, widgetName]`.
  This is a genuinely good pedagogy affordance if the app targets recent frontends
  (`extra.frontendVersion: "1.42.8"` in that template).

## 4.2 Default strength table

Defaults the generator should emit, and the range the UI should allow. Anything not
`[OFFICIAL]` should be shown to the student as a starting point with the range visible.

| Family | LoRA kind | Default `strength_model` | Usable range | `strength_clip` | Evidence |
|---|---|---:|---|---|---|
| SDXL / SD1.5 | style / character | 0.8 | 0.4 – 1.0 | = model | `[LORE]` |
| SDXL / SD1.5 | stacked (2–3) | 0.6 each | 0.4 – 0.8, sum ≤ ~2.0 | = model | `[LORE]` |
| Flux dev / klein | character | 0.9 | 0.7 – 1.0 | n/a (model-only) | `[LORE]` |
| Flux dev / klein | style | 0.8 | 0.5 – 1.0 | n/a | `[LORE]` |
| Qwen-Image | style | **0.9** | **0.8 – 1.0** | n/a | **`[OFFICIAL]`** (template MarkdownNote) |
| Qwen-Image | any | template ships `1.0` in the widget | 0.5 – 1.5 | n/a | `[OFFICIAL]` widget value / `[LORE]` range |
| Z-Image (base) | style / character | 1.0 | 0.6 – 1.2 | n/a | `[LORE]` |
| Z-Image **Turbo** | style / character | 0.8 | 0.5 – 1.0 | n/a | `[LORE]` — lower because the base is distilled, see §4.3 |
| Krea 2 Raw | turbo / acceleration LoRA | **0.6** | 0.5 – 0.8 | n/a | prior corpus (`research/_addenda/krea-character-art.md`) |
| Wan 2.2 A14B | Lightning / lightx2v 4-step | **1.0** on *both* HIGH and LOW | 0.8 – 1.2 | n/a | `[TESTED]` shipped workflow; `[STAFF]`/`[LORE]` kijai discussion |
| Wan 2.2 A14B | style / motion / character | 1.0 | 0.6 – 1.2, applied to both experts | n/a | `[LORE]` |
| LTX-2.3 | distilled speed LoRA | **0.5** | 0.4 – 0.7 | n/a | **`[OFFICIAL]`** template `video_ltx2_3_id_lora` |
| LTX-2.3 | ID-LoRA / IC-LoRA (task) | **1.0** | 0.8 – 1.0 | n/a | **`[OFFICIAL]`** same template |
| MiniMax H3 | acceleration LoRA | 1.0 | — | n/a | prior corpus (`research/minimax-h3.md`) |

Wan Lightning strength evidence: `[STAFF]`/`[LORE]`
<https://github.com/kijai/ComfyUI-WanVideoWrapper/issues/998> and
<https://huggingface.co/Kijai/WanVideo_comfy/discussions/50> — normal `1.0` works, with the
caveat that the HIGH-noise LoRA is the one people most often need to retune. `[LORE]`
lightx2v's own card recommends CFG 1 and 4 steps with these LoRAs:
<https://huggingface.co/lightx2v/Wan2.2-Distill-Loras>

## 4.3 Interplay with distilled / Turbo bases (wire in, do not re-derive)

Established in the existing corpus (`research/_cross/settings-context.md`,
`research/z-image.md`, `research/minimax-h3.md`) and **not contradicted** by anything found
in this sweep:

> Adding a normal (non-distillation) LoRA to a **distilled / Turbo / Lightning** base
> partially *de-distills* it. Symptom: soft, undercooked, low-contrast output at the base
> model's advertised step count. Fix: raise steps and raise CFG off 1.0.

| Base | Without LoRA | With a style/character LoRA |
|---|---|---|
| Z-Image **Turbo** | ~8 steps, CFG 1.0 | **~20 steps, CFG 1.5–2.0** |
| Krea 2 Raw + turbo-LoRA @0.6 | turbo LoRA is the accelerator | adding a *second* LoRA → raise steps; keep turbo LoRA at 0.6 |
| MiniMax H3 + acceleration LoRA | 8–10 steps | adding a style LoRA → push toward the upper end and re-check CFG |
| Wan 2.2 + Lightning 4-step | 4+4 steps, CFG 1 | adding a style LoRA → 6+6 or 8+8 steps, CFG 1.0–1.5 `[LORE]` |
| LTX-2.3 + distilled LoRA @0.5 | distilled schedule | official template already runs distilled@0.5 + task@1.0 together `[OFFICIAL]` |
| Qwen-Image (non-distilled) | 45 steps, CFG 3.5 | unchanged — no de-distillation to fight `[OFFICIAL]` |

**App rule:** `if base.isDistilled && loras.any(kind != "speed") → bump steps and unlock CFG,
and say why in the tutor panel.` This is the single highest-value piece of teaching in the
whole LoRA feature, because the failure is silent — the student sees "blurry" and blames the
LoRA.

---

# 5. Failure modes when auto-generating LoRA workflows

## 5.1 LoRA for the wrong base model — silent no-op, not an error `[OFFICIAL]`

`comfy/lora.py :: load_lora()` ends with:

```python
if log_missing:
    for x in lora.keys():
        if x not in loaded_keys:
            logging.warning("lora key not loaded: {}".format(x))
```

and `comfy/sd.py :: load_lora_for_models()`:

```python
for x in loaded:
    if (x not in k) and (x not in k1):
        logging.warning("NOT LOADED {}".format(x))
```

**No exception is raised.** An SDXL LoRA on a Flux model produces a page of
`lora key not loaded: …` in the *console* and an image identical to no-LoRA. The student sees
"nothing happened" and turns the strength up to 2.0.

**App mitigations:**
* Record `baseFamily` on every LoRA the student registers and refuse to wire a mismatched pair.
* Teach the two exact console strings above so a student can self-diagnose.
* Offer "run once at strength 0 vs strength 1 and compare" as the definitive test.

## 5.2 LoRA naming formats — a narrower problem than "diffusers vs kohya" `[OFFICIAL]`

`comfy/lora.py :: model_lora_keys_unet` / `model_lora_keys_clip` build an explicit key map per
architecture. What is actually accepted, per family (read from source 2026-08-28):

| Family (model class) | Accepted LoRA key prefixes |
|---|---|
| UNet (SD1.5/SDXL) | `lora_unet_*` (kohya), `diffusion_model.*` (generic), diffusers `…processor.to_*`, `unet.*`, `lycoris_*` |
| CLIP text encoders | `lora_te_*`, `lora_te1_*`, `lora_te2_*` (kohya/SDXL), `text_encoder.*`, `text_encoder_2.*` (diffusers), `text_encoders.*` (generic) |
| Flux | `transformer.*` (diffusers/SimpleTuner), `lycoris_*`, `lora_transformer_*` (OneTrainer), bare key (DiffSynth) |
| SD3 | `transformer.*`, `base_model.model.*`, `lora_transformer_*`, `lycoris_*` |
| QwenImage | bare `diffusion_model`-relative key, `transformer.*`, `lycoris_*` — **no `lora_unet_` kohya form** |
| Krea2 (`krea2_to_diffusers`) | `diffusion_model.*`, `transformer.*`, `lycoris_*`, bare key |
| Z-Image (`Lumina2` class, `z_image_to_diffusers`) | `diffusion_model.*`, `transformer.*`, `lycoris_*`, bare key |
| LTXV / LTXAV | bare `diffusion_model`-relative key only |
| HunyuanVideo | `transformer.*` (diffusion-pipe), `diffusion_model.*` (old LoRAs) |
| Kandinsky5 / ErnieImage / ACEStep15 / HiDream / Omnigen2 / Mochi | see source; each is a small explicit set |

Auto-conversions that happen for free in `comfy/lora_convert.py :: convert_lora()` `[OFFICIAL]`:

* BFL Flux control LoRAs (detected by `img_in.lora_A.weight` + `single_blocks.0.norm.key_norm.scale`)
  → rewritten to `diffusion_model.*` with `.diff_b` / `.set_weight` keys.
* Wan Fun LoRAs (`lora_unet__blocks_…`) → double underscore collapsed to single.
* USO LoRAs → `.processor.` names remapped.

Everything else passes through unchanged. The honest statement for the tutor is:
**"ComfyUI already understands kohya, diffusers, OneTrainer, SimpleTuner/LyCORIS and DiffSynth
naming for most families. Failures are usually wrong-base-model, an exotic trainer, or a family
(LTX, Qwen) whose key map only covers one convention."**

Adapter *types* are broad — the loader iterates `comfy.weight_adapter.adapters`, and
comfyanonymous states "All LoRA flavours: Lycoris, loha, lokr, locon, etc… are used this way"
`[OFFICIAL]` <https://comfyanonymous.github.io/ComfyUI_examples/lora/>.

## 5.3 CLIP strength on a model-only path

* On core `LoraLoaderModelOnly` there is **no** clip widget — nothing to get wrong.
* On rgthree's Power Lora Loader with `clip` unconnected, the backend logs
  `"Recieved clip strength eventhough no clip supplied!"` (sic — the typo is in the source)
  and forces `strength_clip = 0` `[OFFICIAL]`.
* **Generator rule:** never emit `"Show Strengths": "Separate Model & Clip"` on a graph whose
  `clip` input is null, and never expose a clip-strength slider for a model-only family.

## 5.4 Wrong strength defaults

* Emitting `1.0` by reflex onto a distilled base → soft/undercooked output (§4.3).
* Emitting `1.0` for each of four stacked LoRAs → mush; the `[LORE]` budget is sum ≤ ~2.0.
* Emitting the LTX distilled LoRA at `1.0` instead of the official `0.5` → over-baked motion.
* Emitting a Wan speed LoRA on only one of the two experts → the clip visibly changes
  character mid-way, because one denoising half is accelerated and the other is not.

## 5.5 Stacking too many — `[OFFICIAL]` mechanics + `[LORE]` aesthetics

* RAM: each `LoraLoader` node instance holds its own `self.loaded_lora` state-dict cache, and
  each call does `model.clone()`. Long chains are a real memory cost, not just visual clutter.
* Concept bleed: LoRAs trained on overlapping subjects fight; the practical ceiling is 2–3.
* If the app wants a "many LoRAs" affordance, the right UI is one Power Lora Loader with
  per-row on/off toggles (exactly why that node is popular), not fifteen core nodes.

## 5.6 Structural / serialization mistakes the generator can make

| Mistake | Consequence |
|---|---|
| LoRA loader placed *after* `ModelSamplingSD3/AuraFlow/Flux` | not what any official template does; breaks for `set`-type patches and confuses students comparing to docs |
| Patching only the positive `CLIPTextEncode` on an SDXL graph | negative prompt encoded with un-patched CLIP; subtle quality loss |
| Emitting API (`/prompt`) format for a Power Lora Loader workflow | dynamic widgets do not restore in the UI (<https://github.com/rgthree/rgthree-comfy/issues/564>) |
| Omitting `cnr_id` / `aux_id` on a third-party node | ComfyUI-Manager cannot offer "Install Missing Custom Nodes" |
| Omitting `properties.models[]` | no auto-download prompt; the student hunts for the file by hand |
| Wrong `widgets_values` arity on `LoraLoader` (2 instead of 3) | widget binding shifts; `strength_clip` gets the wrong value |
| Using the display name `"Load LoRA"` as the node `type` | invalid — `type` must be the class name `LoraLoaderModelOnly` |
| Assuming `Power Lora Loader (rgthree)` requires `model`+`clip` | current version has both optional; older versions had both required |

## 5.7 Emerging: bypass-mode LoRA — `[OFFICIAL]` code, unverified UI surface

`comfy/sd.py` now contains `load_bypass_lora_for_models()`:

> "Load LoRA in bypass mode without modifying base model weights. Instead of patching weights,
> this injects the LoRA computation into the forward pass: `output = base_forward(x) +
> lora_path(x)` … This is useful for training and when model weights are offloaded."

It logs under a `[BypassLoRA]` tag. Flagged here because it changes the mental model the tutor
teaches ("a LoRA is a weight patch") for at least one code path. **Not verified which node
class exposes it** — do not build UI on it until that is confirmed.

---

# 6. Concrete recommendations for the generator

1. Model LoRAs as
   `{file, kind, baseFamily, strength, strengthClip?, triggerWords[], downloadUrl?}` where
   `kind ∈ {style, character, concept, speed, control}`.
2. Per family, store `loraLoaderClass: "LoraLoader" | "LoraLoaderModelOnly"` and
   `clipThroughLoader: bool`. Only SDXL / SD1.5 get `true`.
3. Insert all loaders **immediately after the model loader**, in list order, **before** any
   `ModelSampling*` node.
4. For Wan 2.2 A14B, duplicate the whole chain onto both experts, and require HIGH/LOW variants
   for speed LoRAs.
5. Always emit `properties.models[]` with the download URL when known, plus a `MarkdownNote`
   with recommended settings — Comfy-Org's own in-workflow teaching convention.
6. Default export = **core nodes only**. EXPERIMENTAL export = **one** Power Lora Loader
   (`Power Lora Loader (rgthree)`), UI format only, with `cnr_id`/`aux_id` set and a note
   pointing at Manager → Install Missing Custom Nodes.
7. If `base.isDistilled` and any non-speed LoRA is present, raise steps / unlock CFG and surface
   the reason in the tutor panel.
8. Validate before export: strength sum, base-family match, no clip-strength on model-only,
   `widgets_values` arity, loader-before-ModelSampling ordering.

---

# 7. Sources

All accessed **2026-08-28**.

### ComfyUI core (source of truth)
* `nodes.py` (`LoraLoader`, `LoraLoaderModelOnly`, `NODE_DISPLAY_NAME_MAPPINGS`) — <https://github.com/comfyanonymous/ComfyUI/blob/master/nodes.py>
* `comfy/lora.py` (`load_lora`, `model_lora_keys_unet`, `model_lora_keys_clip`, `calculate_weight`) — <https://github.com/comfyanonymous/ComfyUI/blob/master/comfy/lora.py>
* `comfy/sd.py` (`load_lora_for_models`, `load_bypass_lora_for_models`) — <https://github.com/comfyanonymous/ComfyUI/blob/master/comfy/sd.py>
* `comfy/lora_convert.py` (`convert_lora`, BFL / Wan-Fun / USO conversions) — <https://github.com/comfyanonymous/ComfyUI/blob/master/comfy/lora_convert.py>

### Comfy-Org docs, templates, tooling
* LoraLoader node doc — <https://docs.comfy.org/built-in-nodes/LoraLoader>
* LoraLoaderModelOnly node doc — <https://docs.comfy.org/built-in-nodes/LoraLoaderModelOnly>
* Multiple LoRAs tutorial — <https://docs.comfy.org/tutorials/basic/multiple-loras>
* Lora Examples (comfyanonymous) — <https://comfyanonymous.github.io/ComfyUI_examples/lora/>
* Wan2.2 native workflow tutorial — <https://docs.comfy.org/tutorials/video/wan/wan2_2>
* ComfyUI-Manager docs, Install Missing Custom Nodes — <https://docs.comfy.org/manager/legacy-ui>
* Template index — <https://github.com/Comfy-Org/workflow_templates/blob/main/templates/index.json>
* LTX-2.3 ID LoRA template — <https://github.com/Comfy-Org/workflow_templates/blob/main/templates/video_ltx2_3_id_lora.json>
* Qwen-Image Illustration LoRA template — <https://comfy.org/workflows/template_qwen_image_illustration_lora-e41b80eb587d/> · JSON <https://comfy.org/workflows/download/e41b80eb587d.json>
* `comfy-cli` workflow→API converter (rgthree `strengthTwo` special-case) — <https://github.com/Comfy-Org/comfy-cli/blob/main/comfy_cli/workflow_to_api.py>

### rgthree-comfy
* `py/power_lora_loader.py` — <https://github.com/rgthree/rgthree-comfy/blob/main/py/power_lora_loader.py>
* `web/comfyui/power_lora_loader.js` — <https://github.com/rgthree/rgthree-comfy/blob/main/web/comfyui/power_lora_loader.js>
* `src_web/comfyui/constants.ts` (`NodeTypesString.POWER_LORA_LOADER`) — <https://github.com/rgthree/rgthree-comfy/blob/main/src_web/comfyui/constants.ts>
* `src_web/comfyui/utils_widgets.ts` (divider/button widget serialize flags) — <https://github.com/rgthree/rgthree-comfy/blob/main/src_web/comfyui/utils_widgets.ts>
* API-JSON dynamic-widget issue #564 — <https://github.com/rgthree/rgthree-comfy/issues/564>
* DeepWiki overview — <https://deepwiki.com/rgthree/rgthree-comfy/3.3-power-lora-loader>
* Registry stats — <https://api.comfy.org/nodes/rgthree-comfy>

### ComfyUI-Lora-Manager
* `__init__.py` (`NODE_CLASS_MAPPINGS`) — <https://github.com/willmiao/ComfyUI-Lora-Manager/blob/main/__init__.py>
* README — <https://github.com/willmiao/ComfyUI-Lora-Manager/blob/main/README.md>
* DeepWiki custom-nodes page — <https://deepwiki.com/willmiao/ComfyUI-Lora-Manager/3.1-custom-nodes>
* Registry stats — <https://api.comfy.org/nodes/comfyui-lora-manager>

### ComfyUI-Manager
* Registry stats — <https://api.comfy.org/nodes/comfyui-manager>
* Repo — <https://github.com/ltdrdata/ComfyUI-Manager>

### WanVideoWrapper
* `nodes.py` — <https://github.com/kijai/ComfyUI-WanVideoWrapper/blob/main/nodes.py>
* `low_mem_load` / `merge_loras` interaction, issue #1036 — <https://github.com/kijai/ComfyUI-WanVideoWrapper/issues/1036>
* Lightning LoRA weight discussion, issue #998 — <https://github.com/kijai/ComfyUI-WanVideoWrapper/issues/998>
* Kijai/WanVideo_comfy discussion #50 — <https://huggingface.co/Kijai/WanVideo_comfy/discussions/50>
* lightx2v Wan2.2 distill LoRAs — <https://huggingface.co/lightx2v/Wan2.2-Distill-Loras>

### Real shipped workflows / fixtures (`[TESTED]`)
* Wan Power-Lora-Loader workflow — <https://github.com/artokun/comfyui-mcp/blob/main/packs/wan-longer-videos/workflow.json>
* Z-Image Turbo pack — <https://github.com/artokun/comfyui-mcp/blob/main/packs/z-image-turbo/workflow.json>
* Image-MetaHub ComfyUI parser fixture — <https://github.com/LuqP2/Image-MetaHub/blob/main/__tests__/comfyui-parser.test.ts>
* nixified-ai custom-nodes API-format test — <https://github.com/nixified-ai/flake/blob/master/flake-modules/projects/comfyui/vm-test/custom-nodes-test.json>

### Community guidance (`[LORE]`)
* <https://www.promptzone.com/tara_suzuki/how-to-use-loras-in-comfyui-in-2026-load-stack-and-troubleshoot-235e>
* <https://eastondev.com/blog/en/posts/ai/20260720-comfyui-lora-guide/>
* <https://neurocanvas.net/blog/multi-lora-workflows-comfyui/>
* <https://www.apatero.com/blog/wan-22-pro-svi-lora-loader-comfyui-complete-guide-2025>
* <https://localaimaster.com/blog/comfyui-missing-node-types>
* <https://www.nextdiffusion.ai/tutorials/how-to-use-flux-lora-in-comfyui>

---

## Open questions / not verified

* Which node class (if any) exposes `load_bypass_lora_for_models` in the UI (§5.7).
* Whether an official Comfy-Org template exists for **Z-Image** or **Krea 2** *with* a LoRA.
  The template index surfaced LoRA-tagged templates for LTX-2.3 (ID + IC) and Qwen-Image, but
  the fetched `index.json` appeared truncated on the image side, so absence is not proven.
* Exact strength conventions for Z-Image Turbo and Krea 2 with *third-party* LoRAs — those
  rows in §4.2 are `[LORE]` / prior-corpus, not first-party.
* Whether `Power Lora Loader (rgthree)` `properties.ver` values matter to the frontend when
  round-tripping; observed values ranged from a raw commit SHA to `1.0.2507112302`.

---
