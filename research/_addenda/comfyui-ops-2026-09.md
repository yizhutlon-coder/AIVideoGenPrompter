# ComfyUI operations for the tutor — 2026-09 sweep

**Agent:** 2C (Wave 2, RESEARCH-PLAN-2026-09 §2C). **All URLs accessed 2026-09-03** unless a different date is stated inline.

## Scope & sources

This file grounds the 💬 Ask tutor for the **operational** questions students hit when handed a workflow JSON. It **extends and does not repeat** four existing files — read them first, cite them by reference:

| File | What it already covers (do not duplicate) |
|---|---|
| `research/_addenda/comfyui-faq-2026-08-28.md` | 30-odd student Q&A pairs: loading workflows, UI-vs-API format, model folders, black output, seeds, bypass/mute, outputs, API/`/prompt`, updating, hardware. Harvested 2026-08-28. |
| `research/_addenda/comfyui-painpoints.md` | The evidence base for *why* these things break: install shapes, dependency clobbering, `IMPORT FAILED`, registry coverage, workflow rot, subgraph regressions, dynamic-VRAM regression tail, silent failures. |
| `research/_addenda/comfyui-architecture.md` | `/object_info` shape and cost (§3), the three middlewares and **exact `--enable-cors-header` semantics** (§1.2), why `file://` and a different localhost port both fail the default origin check (§1.3), route table, drag-drop ingestion, `?template=` deep links. |
| `research/_addenda/comfyui-metadata.md` | What is embedded in outputs, per-container locations, sizes, why a file comes up empty, drag-drop precedence (`workflow` then `prompt`), and the subgraph *instance-vs-inner* widget-value rule. Ground truth for `tools/MetaInspector.html`. |

**What is new here:** everything re-verified against `master` and docs **today**; the `cnr_id`/`aux_id`/`ver` contract from primary source; a corrected OOM ladder (the docs' ladder is now partly wrong because of dynamic VRAM); per-model file/folder maps for the five families the app exports; the Aug-3 → Sep-2 change list; a 20-row error→fix table; and two live contradictions with the app's own `KNOWLEDGE`/corpus.

**Version anchors (2026-09-03).**

- ComfyUI core **v0.34.3**, released **September 2, 2026** — https://docs.comfy.org/changelog.md `[OFFICIAL]`
- `ComfyUI/requirements.txt` pins: `comfyui-frontend-package==1.49.6`, `comfyui-workflow-templates==0.11.48`, `comfyui-embedded-docs==0.5.10`, `comfy-kitchen==0.2.31`, `comfy-aimdo==0.4.15` — https://docs.comfy.org/basic-concepts/dependencies.md `[OFFICIAL]`
- `ComfyUI_frontend` `main` `package.json` `"version": "1.49.1"` (dev head is *behind* the 1.49.6 wheel core ships) — https://raw.githubusercontent.com/Comfy-Org/ComfyUI_frontend/main/package.json `[OFFICIAL]`
- Minimum officially supported PyTorch is **2.7** (core v0.32.0, 2026-08-11) — changelog `[OFFICIAL]`

**Tooling notes.** docs.comfy.org serves clean markdown (`.md` suffix) and indexes at `/llms.txt`; the changelog is one page, `https://docs.comfy.org/changelog.md`, newest-first. `raw.githubusercontent.com` works. GitHub **issue** HTML pages render server-side and are readable but cost ~6 k tokens each; `api.github.com` returns empty bodies; GitHub **tree/blob** pages return empty (client-rendered). `curl` from the shell sandbox is blocked by an allowlist — only the fetch tool works. Reddit and Discord unreachable. ~30 fetches used.

---

## Missing nodes

### The install-missing flow as it stands today

`[OFFICIAL]` The Manager is **built into ComfyUI core**, not a pack you clone:

- **Desktop:** "ComfyUI-Manager is already included and enabled by default. No additional installation is required."
- **Portable:** `.\python_embeded\python.exe -m pip install -r ComfyUI\manager_requirements.txt`, then launch with `--enable-manager`.
- **Manual:** `pip install -r manager_requirements.txt`, then `python main.py --enable-manager`.
- Flags: `--enable-manager`, `--enable-manager-legacy-ui` ("requires `--enable-manager`"), `--disable-manager-ui` ("Disable the manager UI and endpoints while keeping background features").
— https://docs.comfy.org/manager/install.md

`[OFFICIAL]` Source confirms the same three flags and that legacy implies enable: `parser.add_argument("--enable-manager", action="store_true", help="Enable the ComfyUI-Manager feature.")` and, at the bottom of the file, `if args.enable_manager_legacy_ui: args.enable_manager = True` — https://raw.githubusercontent.com/comfyanonymous/ComfyUI/master/comfy/cli_args.py

**"Since which version?"** The changelog's first entry for the bundled Manager is core **v0.4.0, 2025-12-10**: "ComfyUI-Manager pip installation support". Bundled Manager versions then move with core: **v4.0.4** by core v0.7.0 (2025-12-31), **4.1b1** by v0.11.1 (2026-01-29), **4.1** by v0.19.0 (2026-04-13). The same v0.4.0 release added "**Add missing nodes warning UI to queue button and breadcrumb**", and v0.3.76 (2025-12-02) listed "Improve missing node UX" alongside the Nodes 2.0 public beta. `[OFFICIAL]` https://docs.comfy.org/changelog.md

`[OFFICIAL]` **A git-cloned Manager cannot use the new UI at all**: "The following version updates only support pip installations. Versions installed via custom nodes do not support switching to the new UI." Desktop switches in **Server Settings → UI Settings → Use legacy manager interface**. — https://docs.comfy.org/manager/install.md

`[OFFICIAL]` On load, "a prompt will appear when loading a workflow with missing nodes. 1. You can choose **Install All** … 2. Or choose **Open Manager**"; per-node, "select the corresponding node, then click the **Missing** button in the preview panel". Two FAQ answers on the same page are the whole registry story: "The new Manager only supports installing nodes from the registry" and "For security and stability of the ComfyUI user system, the new UI does not support installing nodes via git." — https://docs.comfy.org/manager/pack-management.md

`[OFFICIAL]` Model docs repeat the two causes verbatim on every model tutorial page: "If nodes are missing when loading a workflow, possible reasons: 1. You are not using the latest ComfyUI version (Nightly version) 2. Some nodes failed to import at startup" — e.g. https://docs.comfy.org/tutorials/video/ltx/ltx-2-5.md, https://docs.comfy.org/tutorials/video/wan/wan2_2.md, https://docs.comfy.org/tutorials/flux/flux-2-dev.md

`[USER]` Unregistered packs are still **silently omitted** rather than reported — open feature request, 2026-08-06: "When opening a workflow that depends on a custom node pack which is not present in the ComfyUI-Manager registry (for example, **Dream Video Batches**), the **Install Missing Custom Nodes** feature does not detect it… The result is that users often have to manually search GitHub or ask the community to identify the missing repository." Still **open, no labels, no assignee** as of today. — theawesomerobot, https://github.com/Comfy-Org/ComfyUI-Manager/issues/3138

### Registry packs vs git-cloned packs — and what `cnr_id` / `aux_id` / `ver` mean

`[OFFICIAL]` Primary source is the frontend's zod schema for `node.properties`:

```ts
// Shared schema for Comfy Node Registry IDs and GitHub repo names
const zRepoLikeId = z.string().min(1).max(100).regex(repoLikeIdPattern, {
    message: "ID can only contain ASCII letters, digits, '_', '-', and '.'" })
  .refine((id) => !/^[_\-.]|[_\-.]$/.test(id), {
    message: "ID must not start or end with '_', '-', or '.'" })

const zCnrId = zRepoLikeId

// Auxiliary ID identifies node packs not installed via the Comfy Node Registry
const zAuxId = z.string()
  .regex(/^[^/]+\/[^/]+$/, "Invalid format. Must be 'github-user/repo-name'")
  …  "Invalid aux_id: Must be valid 'github-username/github-repo-name'"

const zVersion = z.union([
  z.string().transform((ver) => ver.replace(/^v/, '')) // Strip leading 'v'
    .pipe(z.union([zSemVer, zGitHash])),
  z.literal('unknown')
])

const zProperties = z.object({
  ['Node name for S&R']: z.string().optional(),
  cnr_id: zCnrId.optional(),
  aux_id: zAuxId.optional(),
  ver: zVersion.optional(),
  models: z.array(zModelFile).optional()
}).passthrough()
```

— https://raw.githubusercontent.com/Comfy-Org/ComfyUI_frontend/main/src/platform/workflow/validation/schemas/workflowSchema.ts

Read that as a contract:

| Field | Meaning | Shape | Present when |
|---|---|---|---|
| `cnr_id` | Comfy Node Registry pack id (**core nodes use the literal `comfy-core`**) | ASCII id, ≤100 chars | node came from a registry-installed pack, or is a core node in a recently-saved workflow |
| `aux_id` | "identifies node packs **not** installed via the Comfy Node Registry" | exactly `github-user/repo-name` | node came from a git-cloned pack whose author registered an aux id |
| `ver` | pack version | **semver** (leading `v` stripped) **or a 4–40-char git hash** or the literal string `"unknown"` | alongside `cnr_id`/`aux_id`; `"unknown"` is a legal, expected value |
| `models` | download hints (`name`, `url`, `directory`) | array | template/authored workflows only |

Validation failures produce these exact strings, which is what a student sees if they hand-edit a workflow: `Node pack version has invalid semantic version: "…"`, `Node pack version has invalid Git commit hash: "…"`. `[OFFICIAL]` same file.

`[OFFICIAL]` A verbatim real node from the docs' own template example — this is what `comfy-core` + `ver` + `models` looks like on disk:

```json
"properties": {
  "Node name for S&R": "DualCLIPLoader",
  "cnr_id": "comfy-core",
  "ver": "0.3.40",
  "models": [
    { "name": "clip_l.safetensors",
      "url": "https://huggingface.co/comfyanonymous/flux_text_encoders/resolve/main/clip_l.safetensors",
      "directory": "text_encoders" }
  ]
}
```
— https://docs.comfy.org/interface/features/template.md

`[TESTED]`/`[SYNTHESIS]` Coverage is **inconsistent by construction** — `comfyui-painpoints.md` §3.1 shows a real 0.3.76 workflow where one node carried `cnr_id`/`ver`/`models` and most carried only `"Node name for S&R"`. Consequence for Prompt Studio and for the tutor's phrasing: a workflow can be read for *known* requirements, and the unknowable ones must be named as unknowable. Do not promise "drop your workflow and I'll list what you need".

### Why a node can be installed and still red — the six real causes

1. **Not restarted.** Node classes register at startup only. `[OFFICIAL]` "Restart ComfyUI and refresh your browser. Check startup logs for any `import failed` errors" — https://docs.comfy.org/installation/install_custom_node.md (2026-08-28).
2. **`IMPORT FAILED` — the pack cloned but its Python deps did not install.** The log line format students should be taught to search for, verbatim from a real startup log: `0.0 seconds (IMPORT FAILED): …\custom_nodes\ComfyUI-Inspire-Pack`, preceded by `Cannot import …\custom_nodes\ComfyUI-Inspire-Pack module for custom nodes: No module named 'webcolors'`. `[USER]` `[TESTED]` https://github.com/Comfy-Org/ComfyUI-Manager/issues/2030 (closed).
3. **The registry was unreachable, so the Manager cannot resolve or version anything.** Same issue, same log: `[ComfyUI-Manager] An error occurred while fetching 'https://api.comfy.org/nodes?page=1&limit=30&comfyui_version=v0.3.45-17-ge6e5d33b&form_factor=git-windows': Expecting value: line 2 column 1 (char 1)` then `Cannot connect to comfyregistry.` — the user's visible symptom was "version of nodes is unknown !!". `[USER]` `[TESTED]` Teaching value: on a locked-down school network, "unknown version" and a Manager that finds nothing are **network** symptoms, not broken installs. Manager has a first-class setting for it: `network_mode = public|private|offline` in `config.ini`. `[OFFICIAL]` https://raw.githubusercontent.com/Comfy-Org/ComfyUI-Manager/main/README.md
4. **Version/`ver` mismatch between the workflow and the installed pack.** The Manager offers a per-pack **Version** dropdown on install and update ("select a specific version in **Version** to install") — pinning to the `ver` in the workflow is the fix. `[OFFICIAL]` https://docs.comfy.org/manager/pack-management.md · The pack-id resolution itself has been wrong before: `[USER]` "some node packs come up as the incorrect id's… that could be dangerous" — purzbeats, ComfyUI-Manager#1762 (closed via frontend PR #3521, see painpoints §2.4).
5. **The core version comparison can be arithmetically wrong.** `[USER]` "Some nodes require a newer version of ComfyUI (current: 0.3.66)… Requires ComfyUI 0.3.60" — reproduced with all custom nodes disabled, **closed `not planned`**: https://github.com/Comfy-Org/ComfyUI/issues/10490 (see painpoints §3.3). Teach: if the numbers say you are already newer, ignore the dialog.
6. **A frontend-extension conflict, not a missing backend node.** `[OFFICIAL]` The official first move is **Settings → Extensions → disable all third-party extensions**, which "you don't need to restart ComfyUI multiple times - just reload"; symptoms explicitly include "Workflows not executing", "Node connections not working properly", "Completely broken UI or blank screen". — https://docs.comfy.org/troubleshooting/custom-node-issues.md

Two more mechanical traps worth one sentence each: the folder name under `custom_nodes/` is now "the normalized name from the `name` field in `pyproject.toml`", so **it need not match the GitHub repo name** `[OFFICIAL]` (Manager README); and the frontend has an escape hatch when a node is reported missing incorrectly — `[OFFICIAL]` "**'Can't Find Custom Node'**: Disable node validation in ComfyUI settings" — https://docs.comfy.org/troubleshooting/overview.md.

---

## Model files & paths

### Where each kind of file lives

The folder→loader map and the legacy aliases (`models/unet/` → `diffusion_models`, `models/clip/` → `text_encoders`) are already sourced from `folder_paths.py` in `comfyui-faq-2026-08-28.md`. **New folders a 2026 student will meet and will not have:**

| Folder | Used by | Source |
|---|---|---|
| `models/latent_upscale_models/` | LTX-2.5 spatial upscaler (`ltx-2.5-latent-spatial-upscaler-x2-bf16-1.0.safetensors`) | https://docs.comfy.org/tutorials/video/ltx/ltx-2-5.md `[OFFICIAL]` |
| `models/embeddings/` for **video** | MiniMax H3 prompt embeddings via `embedding:name` syntax (core v0.34.0, PR #15697) | https://docs.comfy.org/tutorials/video/minimax/minimax-h3.md `[OFFICIAL]` |
| `models/loras/` as a **hard requirement** | H3 templates list the turbo LoRA as "Required by the workflow's **model scan**" even when `turbo_mode` is off | same page `[OFFICIAL]` |

### Per-family file map for the five families the app exports (verified today)

| Family | Diffusion model | Text encoder(s) | VAE | Notes |
|---|---|---|---|---|
| **Wan 2.2 14B T2V** | `wan2.2_t2v_high_noise_14B_fp8_scaled` **+** `wan2.2_t2v_low_noise_14B_fp8_scaled` (two loaders) | `umt5_xxl_fp8_e4m3fn_scaled` | **`wan_2.1_vae.safetensors`** — labelled "Wan2.1 VAE (compatible with Wan2.2)" | latent node is `EmptyHunyuanLatentVideo` (yes, "Hunyuan") |
| **Wan 2.2 14B I2V** | `wan2.2_i2v_high_noise_14B_fp16` + `…_low_noise_14B_fp16` | same | `wan_2.1_vae` | **the doc's numbered steps still say to load the `t2v` files** — see defect below |
| **Wan 2.2 TI2V 5B** | `wan2.2_ti2v_5B_fp16` | same | **`wan2.2_vae.safetensors`** (different VAE from 14B) | "should fit well on 8GB vram with the ComfyUI native offloading" |
| **LTX-2.5** | `ltx-2.5-22b-distilled-transformer-comfy-int8-convrot` | `gemma4-12b-with-proj-ltx-2.5-comfy-int8-convrot`; **+`gemma4_e2b_it_int8_convrot` only if the prompt enhancer is on** | **two**: `ltx-2.5-video-vae-bf16` **and** `ltx-2.5-audio-vae-bf16` | plus `latent_upscale_models/`; weights are in a **gated** HF repo |
| **MiniMax H3** | `minimax_h3_fl2va_pruned_int8_convrot` (T2V/I2V) — **`…_ref2va_…` for R2V, different weights** | `qwen3vl_32b_minimax_h3_nvfp4_awq` | **two**: `minimax_h3_video_vae_fp16` **and** `minimax_h3_audio_vae_fp32` | needs core ≥ **0.30.0** |
| **FLUX.2 dev** | `flux2_dev_fp8mixed` ("We are using quantized weights in this workflow") | **`mistral_3_small_flux2_bf16`** | `flux2-vae` | not Qwen3, not T5 |
| **Qwen-Image** | `qwen_image_fp8_e4m3fn` | `qwen_2.5_vl_7b_fp8_scaled` | `qwen_image_vae` | fp8 20.4 GB vs bf16 40.9 GB (Aug sweep) |

Sources, all `[OFFICIAL]`: https://docs.comfy.org/tutorials/video/wan/wan2_2.md · https://docs.comfy.org/tutorials/video/ltx/ltx-2-5.md · https://docs.comfy.org/tutorials/video/minimax/minimax-h3.md · https://docs.comfy.org/tutorials/flux/flux-2-dev.md · https://docs.comfy.org/interface/features/template.md

**This resolves an open corpus question.** `comfyui-painpoints.md` §4.3 records `[NOT FOUND]` for "a standalone primary source isolating Wan 2.1-vs-2.2 VAE mismatch". The docs do not describe the failure mode, but they now state the **correct pairing unambiguously**: 14B → `wan_2.1_vae`, 5B → `wan2.2_vae`. Teach the pairing; still do not claim a specific symptom for getting it wrong.

**Documentation defect, re-verified today (not fixed):** on https://docs.comfy.org/tutorials/video/wan/wan2_2.md the *I2V* section's download cards list `wan2.2_i2v_high_noise_14B_fp16.safetensors` / `…_low_noise_14B_fp16.safetensors`, while its own numbered steps read "Make sure the first `Load Diffusion Model` node loads the `wan2.2_t2v_high_noise_14B_fp8_scaled.safetensors` model." A student following the steps loads **text-to-video** weights into an image-to-video graph. `[OFFICIAL]` (defect first recorded 2026-08-28; still present 2026-09-03).

### Why wrong filenames fail quietly, and the exact texts

`[OFFICIAL]` Validation error, verbatim, still current:

```
Prompt execution failed
Prompt outputs failed validation:
CheckpointLoaderSimple:
- Value not in list: ckpt_name: 'model-name.safetensors' not in []
```
— https://docs.comfy.org/troubleshooting/model-issues.md · The same shape appears per loader; real-world instances in the tracker use `unet_name` (`Value not in list: unet_name: 'wan2.2_t2v_high_noise_14B_fp8_scaled.safetensors' not in []`, ComfyUI#10773; `'z_image_turbo_bf16.safetensors'`, #11777; `'wan2.1_i2v_480p_14B_bf16.safetensors'`, #7151). `[USER]` — titles and URLs verified by search only, bodies not fetched: https://github.com/Comfy-Org/ComfyUI/issues/10773 · /11777 · /7151

`[OFFICIAL]` Other model-file texts on that page today: `Error while deserializing header` (corrupt/truncated download → re-download, check disk space and permissions); and the architecture-mismatch family, of which the two most teachable are `Given groups=1, weight of size [64, 4, 3, 3], expected input[1, 16, 128, 128] to have 4 channels, but got 16 channels instead` (4 = SD-family latents, 16 = Flux/SD3-family) and `mat1 and mat2 shapes cannot be multiplied (154x2048 and 768x320)` (SD1.5 ControlNet on an SDXL checkpoint).

**Refresh, not restart:** `R` refreshes node definitions and model lists; restart only if `R` fails. `[OFFICIAL]` (faq-2026-08-28, four separate doc pages).

**The missing-model popup lies about subfolders — verbatim, still current:** "In the current version, missing-file detection only checks whether there is a file with the same name in the corresponding **top-level directory**… If you have already downloaded the model into a subfolder such as `ComfyUI/models/diffusion_models/wan_video`, you can ignore the popup and simply ensure the correct model is selected in the corresponding model loader node." `[OFFICIAL]` https://docs.comfy.org/interface/features/template.md · Same page: `.gguf` links cannot be embedded — "Formats like `.gguf` are considered unsafe; when embedded they will be flagged as unsafe and the link will not be shown", so GGUF users **never** get a download prompt.

`[OFFICIAL]` Two frontend settings decide whether these warnings appear at all — **Workflow → Show missing nodes warning** (default Enabled) and **Show missing models warning** (default Enabled). A student who turned them off sees nothing. — https://docs.comfy.org/interface/settings/comfy.md

**`extra_model_paths.yaml`** and the Desktop-only `extra_models_config.yaml` in `%APPDATA%\ComfyUI\` (append, don't overwrite; restart after) are fully sourced in faq-2026-08-28 and painpoints §4.1 — including the `TypeError: string indices must be integers, not 'str'` startup crash on malformed YAML and ltdrdata's warning against symlinking the whole `models` folder. Nothing changed today; `--extra-model-paths-config PATH [PATH …]` still accepts multiple files, and `--models-directory` now exists as a separate override of the models folder inside `--base-directory`. `[OFFICIAL]` cli_args.py

### `/object_info` and the CORS caveat

Full treatment is `comfyui-architecture.md` §1.2–1.3 and §3. For the tutor, three sentences suffice:

1. `GET /object_info` returns every node definition **including the live on-disk filename lists** that populate the loader dropdowns — it is the authoritative answer to "what do I actually have installed". `[OFFICIAL]` route table: https://docs.comfy.org/development/comfyui-server/comms_routes.md (2026-08-28); shape/cost verified live in architecture §3.
2. A **browser tool on another origin cannot fetch it** unless ComfyUI was started with `--enable-cors-header` — `type=str, default=None, metavar="ORIGIN", nargs="?", const="*", help="Enable CORS (Cross-Origin Resource Sharing) with optional origin or allow all with default '*'."` `[OFFICIAL]` cli_args.py. A page opened from `file://`, or served from a different localhost port, both fail the default origin check (architecture §1.3).
3. Prompt Studio's "🔗 Your installed models" flow sidesteps all of this: the **student** opens `127.0.0.1:8188/object_info` in a tab and pastes the text, so no flag, no CORS, no network hop. That is the right thing to teach, and the tutor should say *why* it needs no flags rather than suggesting `--enable-cors-header`.

---

## Running out of memory

### The docs' ladder is now partly wrong. Read the flags first.

`[OFFICIAL]` The troubleshooting page still prints this:

```bash
python main.py --lowvram          # First try
python main.py --novram           # If lowvram insufficient
python main.py --cpu              # Last resort
```
— https://docs.comfy.org/troubleshooting/model-issues.md

`[OFFICIAL]` But `cli_args.py` today says `--lowvram` = "**Doesn't do anything if dynamic vram is enabled.** If dynamic vram isn't being used this option makes the text encoders run on the CPU." — and the file ends with the gate that decides everything:

```python
def enables_dynamic_vram():
    if args.enable_dynamic_vram:
        return True
    return not args.disable_dynamic_vram and not args.highvram and not args.gpu_only and not args.novram and not args.cpu
```
— https://raw.githubusercontent.com/comfyanonymous/ComfyUI/master/comfy/cli_args.py

`[SYNTHESIS]` `[OFFICIAL]` So: **dynamic VRAM is on by default, and `--novram`, `--highvram`, `--gpu-only` and `--cpu` each silently turn it off.** Step 2 of the official ladder therefore *disables the very system that was streaming your weights*. Teach the corrected order:

1. **Don't add flags first.** Lower resolution, frame count/`length`, and batch size — VRAM scales with pixels × frames. `[OFFICIAL]`
2. **Use the model variant the official template loads** — fp8 / `int8_convrot` / `nvfp4` / `fp8mixed` builds are now the *shipped default* for LTX-2.5, H3 and FLUX.2, not an optimisation you add. `[OFFICIAL]` per-model pages above.
3. **Swap the final `VAE Decode` for `VAE Decode (Tiled)`** (`tile_size` 512 default, `overlap` 64, and for video `temporal_size` 64 / `temporal_overlap` 8). Video decode is very often the peak. `[OFFICIAL]` `nodes.py` (Aug sweep). Core v0.32.0 fixed "VAEDecodeTiled: crash on NestedTensor latents (MiniMax H3)" and "broken tiled audio decode" — if tiled decode used to crash on H3, update. `[OFFICIAL]` changelog.
4. **`--cpu-vae`** ("Run the VAE on the CPU.") when decode alone is the problem — reliable, slow, and per painpoints §4.3 "far too slow for Wan or Klein". `[OFFICIAL]` cli_args.py
5. **`--reserve-vram N`** / **`--vram-headroom N`** to leave room for the OS/browser, and **`--disable-smart-memory`** to force aggressive offload to system RAM. `[OFFICIAL]`
6. **Feed it RAM/disk instead of VRAM:** `--async-offload` (default 2 streams, on by default on Nvidia), `--fast-disk` ("Prefer disk-backed dynamic loading and offload over unpinned RAM… faster for users with fast NVME disks"), `--cache-none` ("Reduced RAM/VRAM usage at the expense of executing every node for each run"). `[OFFICIAL]`
7. **Only then** the mutually-exclusive VRAM group — and knowing it costs you dynamic VRAM: `--lowvram` (no-op under dynamic VRAM), `--novram` ("When lowvram isn't enough."), `--cpu` ("To use the CPU for everything (slow)."). `[OFFICIAL]`
8. **`--disable-dynamic-vram` still exists** ("Disable dynamic VRAM and use estimate based model loading") and there is now a matching `--enable-dynamic-vram` "Enable dynamic VRAM on systems where it's not enabled by default". `[OFFICIAL]` **This contradicts the community expectation recorded in painpoints §5.1** that the flag was about to be removed (#13139) — as of 2026-09-03 both flags are present in `master`.

`[OFFICIAL]` **`--normalvram` does not exist.** Also worth knowing: `--preview-method` **defaults to `none`** in source (`default=LatentPreviewMethod.NoPreviews`), so the docs' "`--preview-method none` (saves VRAM)" tip is only meaningful if previews were switched on elsewhere (the frontend exposes the setting).

`[STAFF]` GGUF vs native, printed by ComfyUI itself: "If you use gguf we recommend keeping dynamic vram enabled and using native ComfyUI model formats instead. ComfyUI native formats like fp8 will be faster even if they are larger than your memory." — `main.py` (Aug sweep). GGUF also needs the community `ComfyUI-GGUF` pack and gets no template download link (unsafe-format rule above).

**Block swap is not a core feature.** Core has no block-swap node or flag; the mechanism lives in wrappers — `Kijai/ComfyUI-WanVideoWrapper` for Wan, `Lightricks/ComfyUI-LTXVideo` for LTX — both linked from the official Wan/LTX pages as **Community Resources**. `[OFFICIAL]` https://docs.comfy.org/tutorials/video/wan/wan2_2.md · `[SYNTHESIS]` therefore: teaching a student to "turn on block swap" means teaching them to install a custom pack and leave the native graph, with the portability cost that implies. Prefer steps 1–6 first.

### Per-family notes

| Family | What actually helps first | Source |
|---|---|---|
| **Wan 2.2 14B** | Two 14B experts are loaded per run (high+low noise) — that is the memory story. Use the `fp8_scaled` pair, shrink `length` in `EmptyHunyuanLatentVideo`, tiled decode. Core v0.31.0 shipped "Speedups for LTX and Wan". | `[OFFICIAL]` wan2_2.md; changelog |
| **Wan 2.2 5B TI2V** | The honest low-VRAM answer: "The Wan2.2 5B version should fit well on 8GB vram with the ComfyUI native offloading." | `[OFFICIAL]` wan2_2.md |
| **LTX-2.5 (Gemma 4)** | Ships `int8_convrot` weights already; the enhancer's extra Gemma-4 E2B encoder is "~5 GB and adds about 1-2 minutes" — turn it off to save both. v0.33.1 fixed "float64 device in LTX diffusion decoder". | `[OFFICIAL]` ltx-2-5.md; changelog |
| **MiniMax H3** | Lower the **Resolution Selector** megapixels (template ships "a fast preview size"); `turbo_mode` drops 20 steps → 8; v0.32.0 "Fixed peak memory issue with MiniMax-H3" and "Optimized MiniMax-H3 VAE"; v0.31.0 added `int8_convrot` VAE and fixed "full offload on MiniMax audio VAE". | `[OFFICIAL]` minimax-h3.md; changelog |
| **Qwen-Image** | fp8 (20.4 GB) vs bf16 (40.9 GB) is the single biggest lever; official workflow loads fp8. | `[TESTED]` qwen-image.md (Aug sweep) |
| **FLUX.2 dev** | Official ComfyUI path is already quantised (`flux2_dev_fp8mixed`). Core v0.4.0 "Reduced LoRA memory reservations, especially beneficial for Flux2 workflows" and "Fixed Flux2 OOM errors with improved dequantization offload accounting" — an old ComfyUI OOMs on FLUX.2 where a current one does not. | `[OFFICIAL]` flux-2-dev.md; changelog |

### The strings students see

- `RuntimeError: CUDA out of memory` (docs' own heading) `[OFFICIAL]`
- `Expected all tensors to be on the same device, but got index is on cuda:0, different from other tensors on cpu` — a dynamic-VRAM offload bug, worked around with `--disable-dynamic-vram`. `[USER]` painpoints §5.1 (#12786)
- `Input tensors must be in dtype of torch.float16 or torch.bfloat16, using pytorch attention instead` — **not an error.** `[OFFICIAL]` "These are expected; the affected layers fall back to standard attention and generation still works." (Sage Attention on MiniMax H3) — https://docs.comfy.org/tutorials/video/minimax/minimax-h3.md

---

## Outputs, metadata, recovery

Everything about *what* is embedded, *where* per container, *how much*, and *why a file comes up empty* is in **`research/_addenda/comfyui-metadata.md`** — including the drag-drop precedence rule (`workflow` first, fall back to `prompt`), the per-container table (PNG `tEXt`; WebP EXIF 0x0110/0x010f; MP4/MOV `movflags=use_metadata_tags`; WebM Matroska tags upper-cased), and the `SaveWEBM`-ignores-`--disable-metadata` defect. Do not restate it; link it.

**Additions and re-verifications for the tutor:**

- **The kill switch, both halves.** `--disable-metadata` = "Disable saving prompt metadata in files." `[OFFICIAL]` cli_args.py (2026-09-03). The Desktop equivalent is the "Disable saving prompt metadata in files" setting recorded in `comfyui-metadata.md`. If a class is told to keep recipes, this must be **off**; if a class must strip provenance, this is the switch — and `SaveWEBM` will still leak the prompt.
- **MP4 recovery got better in August.** Core v0.30.0 (2026-08-03): "**MP4 metadata**: Store MP4 metadata at the beginning of the file when possible" (PR #15195). `[OFFICIAL]` changelog. `[SYNTHESIS]` For the Meta Inspector this matters: prompt/workflow tags in an `.mp4` written by a current ComfyUI are near the file head, so a partial read or a streamed upload is much more likely to still contain them. `comfyui-metadata.md`'s claim that MP4 tags live in `moov/meta` stays true — only their position moved.
- **Save vs Preview.** `SaveImage` → `ComfyUI/output/`, `<prefix>_00001_.png`, counter auto-increments; `PreviewImage` subclasses it but redirects to `folder_paths.get_temp_directory()` with `type="temp"` and a random `_temp_XXXXX` suffix — **a graph whose only sink is a Preview node saves nothing permanent.** Core `SaveVideo` defaults to `filename_prefix="video/ComfyUI"`, i.e. `output/video/`. `[OFFICIAL]` faq-2026-08-28 (sourced to `nodes.py`, `nodes_video.py`, `folder_paths.py`). Directory overrides: `--output-directory`, `--temp-directory`, `--input-directory`, `--user-directory`, `--models-directory`, all overriding `--base-directory`. `[OFFICIAL]` cli_args.py
- **API-format export still needs Dev mode — this corrects our own corpus.** faq-2026-08-28 item 6 of "Couldn't find a reliable answer" guessed the dev-mode toggle was "possibly obsolete". It is not. `[OFFICIAL]` Settings → **Dev Mode → "Enable dev mode options (API save, etc.)" · Default Value: Disabled · Function: Enables development mode options (such as API save, etc.)** — https://docs.comfy.org/interface/settings/comfy.md. This also corroborates christian-byrne's staff complaint in painpoints §3.7 that "'Save (API Format)' is hidden behind **dev mode**".
- **Subgraph templates — where the typed values live.** `comfyui-metadata.md` has the file-level rule (values on the **instance** node; the inner node's `widgets_values` may be stale template text; the API `prompt` has the truth). The UI-level rules, verified today: the **Parameters panel** ("With ComfyUI v0.3.66 or later, you can edit the subgraph parameters directly from the parameters panel without entering the subgraph" — select the subgraph, "Edit Subgraph Widgets", reorder by drag, toggle visibility by eye icon); **Unpack subgraph** now exists (right-click menu or selection toolbox) even though the same page's own Note still says converting back "will be supported in the future"; and **Subgraph Blueprints** (frontend ≥ 1.27.7) are copied, not shared — "The new subgraph node that has been added from Subgraph Blueprints is still isolated… they will not affect each other." `[OFFICIAL]` https://docs.comfy.org/interface/features/subgraph.md · The schema backs this: a subgraph definition carries `widgets: z.array(zExposedWidget)` (promoted widgets, `{id, name}`) while the *instance* carries `widgets_values`. `[OFFICIAL]` workflowSchema.ts
- **Two save-time settings that change what a recovered file looks like:** Workflow → **"Save node IDs to workflow"** (default Enabled) and **"Sort node IDs when saving workflow"** (default Disabled). `[OFFICIAL]` settings/comfy.md. `[SYNTHESIS]` Node-id churn is why two exports of "the same" workflow can diff badly; sorting on makes class diffs readable.
- **Recovery caveat to keep saying:** it only works for files ComfyUI itself wrote. Re-encoding by Discord/Reddit/X/messengers, screenshots and most editors strip it (`comfyui-metadata.md`), and PNG remains the guaranteed round-trip — keep the `.json` for video work.

---

## Changes since 2026-08 that matter

From https://docs.comfy.org/changelog.md, entries dated 2026-08-03 → 2026-09-02, filtered to things a student can feel. All `[OFFICIAL]`.

| Version · date | Change | Why a student cares |
|---|---|---|
| v0.30.0 · Aug 3 | **MiniMax-H3** open-weights support (CORE-375); Pruna LTX VAE; `SaveVideo` **CRF** option; `VAEDecodeAudio` nested latents; **MP4 metadata at file start**; nested-latent previews (LTXAV); "Fallback to cuDNN attention on Linux when Flash Attention fails"; frontend → 1.47.11 | H3 needs core ≥ 0.30.0; video quality now tunable; better metadata recovery |
| v0.30.1 · Aug 3 | frontend → 1.47.12 | — |
| v0.30.2 · Aug 5 | Partner: BFL **Flux 3 Video**; Topaz; **legacy Kling models removed** | a partner node can disappear from under a saved workflow |
| v0.31.0 · Aug 7 | **Wan-Animate2** native; `Create Layered Image`/`Add Layer` compositor; `WanAnimate2ToVideo`, `WanAnimate2Cache`; frontend → **1.48.7**; **3D Viewer (Beta) enabled by default**; **"Gated Hugging Face model access hints"**; LTX+Wan speedups; `int8_convrot` VAE for H3; asym `w4a8_int` | gated-repo hints are new UI; new quantisation tiers |
| v0.32.0 · Aug 11 | **LTX 2.5** native "with STG, dual CFG, and duration prediction"; new nodes **LTXV Spatio-Temporal Guidance / Modality Guidance / Dual CFG Guider / Duration Predictor**; **minimum PyTorch now 2.7**; **VAEDecodeTiled crash on NestedTensor (H3) fixed**; tiled audio decode fixed; CLIP Vision regression fixed; Mistral/Llama tokenizers no longer need `transformers` | LTX-2.5 graphs use four unfamiliar guidance nodes; PyTorch floor moved |
| v0.33.1 · Aug 13 | **MiniMax Music 3** native; **native CUDA Graphs interoperable with dynamic VRAM**; dynamic VRAM kept on under **WSL**; H3 Context IR prompt enhancer (partner 2K nodes); `KSamplerAdvanced` `add_noise` fix on nested latents; "Fixed `thinking=false` ignored on Gemma4 E2B/E4B" | WSL users get dynamic VRAM; a *partner* enhancer ≠ the local one |
| v0.33.2 · Aug 17 | frontend → **1.49.6**; Fish Audio partner nodes | the frontend version core ships today |
| v0.33.3 · Aug 20 | Ideogram P-Image renamed to credit **Pruna** | node display names change under you |
| v0.33.4 · Aug 24 | **Wan 3.0** *partner* nodes (up to 30 s, native audio); Meshy-7; "Removed kling-v2 … ahead of September 15 retirement" | **Wan 3.0 is API-only** — no local weights |
| v0.34.0 · Aug 26 | **Pixal3D & TRELLIS2** (3D), **SAM 3D Body**, **TAESD H3** preview decoder; **MiniMax-H3 `embedding:` syntax** (PR #15697); `CreateVideo` colorspace + bit depth; **HDR video saving (AV1, mkv/webm)**; "Fixed the default SQLite database path to resolve from the user directory instead of the install directory" | `embedding:` now works for video prompts |
| v0.34.1 · Aug 26 | **WAN3-Prime** partner option; Recraft V4; "**Removed the retiring Veo 2 and Veo 3.0 models**" | — |
| v0.34.2 · Aug 27 | Gemini Omni 1.1 Flash; "Remux HEVC into mp4/mov as hvc1 so Apple players can play the files" | HEVC outputs now play on Macs |
| v0.34.3 · Sep 2 | **MiniMax H3 Max** partner option; lower TRELLIS remesh memory; 3D preview temp paths | current release |

### Telling a local node from a paid Partner node — teach this explicitly

`[OFFICIAL]` The official term is now **Partner Nodes** (formerly "API nodes"): "ComfyUI's new way of calling closed-source models through API requests". Four tells, in order of reliability:

1. **Pricing badge.** Settings → Partner Nodes → "**Show Partner Node pricing badge** · Default Value: Enabled · … helping users identify the usage cost of Partner Nodes". https://docs.comfy.org/interface/settings/comfy.md
2. **They need an account and a positive credit balance**, and they only work from `127.0.0.1`/`localhost` unless you log in with an API key — "you cannot use the Partner Nodes in a ComfyUI service started with the `--listen` parameter in a LAN environment".
3. **The docs live in a separate tree.** The same model name appears twice: `/tutorials/video/ltx/ltx-2-5.md` (local weights) vs `/tutorials/partner-nodes/lightricks/ltx-2-5.md` (paid API); likewise `/tutorials/video/minimax/minimax-h3.md` vs `/tutorials/partner-nodes/minimax/minimax-h3.md`. `docs.comfy.org/llms.txt` even counts a "Built-in Nodes / Nodes / **Partner** (259 pages)" branch.
4. **They send your inputs off-machine.** "Partner Nodes send your inputs (prompts, images, and other content) to third-party providers for processing."

`[OFFICIAL]` The classroom hard guarantee is unchanged: `--disable-api-nodes` "Disable loading all api nodes. Also prevents the frontend from communicating with the internet." — cli_args.py and https://docs.comfy.org/tutorials/partner-nodes/overview.md

### Settings that silently change results

`[OFFICIAL]` https://docs.comfy.org/interface/settings/comfy.md unless noted.

- **Node Widget → Widget control mode (`before`/`after`)** — decides whether the seed advances before or after the run; changes which seed produced which image.
- **Queue Button → Batch count limit, default 100** — the cap on one click, not the batch size.
- **Node Search Box → Node search box implementation** (`default` vs `litegraph (legacy)`, experimental) and **Show deprecated nodes in search** (Disabled) / **Show experimental nodes in search** (Enabled) — why two machines "don't have the same nodes" in search.
- **Validation → Validate workflows** (Enabled): "When validation fails, error prompts will be displayed, but workflow loading will **not** be blocked" — a red toast is not a refusal.
- **Model Library → Automatically load all model folders** (Disabled) — the sidebar can look empty until you click a folder.
- **Prompt enhancers are off by default in the templates that have them.** LTX-2.5: "The workflow keeps it off by default. Enable `prompt_enhance` on the LTX-2.5 node…" — https://docs.comfy.org/tutorials/video/ltx/ltx-2-5.md. `[SYNTHESIS]` This matters for the app's own Krea note (`wfNotes`: the Krea template's rewriter is turned OFF by our export) — the LTX default now agrees with our choice rather than contradicting it, and the H3 "Context IR prompt enhancer" is a **partner-node** feature, not the local graph.

---

## Error → fix table

Exact text · cause · fix · source. `[OFFICIAL]` = Comfy-Org docs or source; `[USER]` = tracker.

| # | Exact text students see | Cause | Fix | Source |
|---|---|---|---|---|
| 1 | `Prompt outputs failed validation:` … `- Value not in list: ckpt_name: 'x.safetensors' not in []` | filename in the workflow ≠ any file the *that* loader's folder | put the file in the folder that loader reads → press **`R`** → pick your file in the dropdown; empty `[]` means the folder itself is empty | `[OFFICIAL]` troubleshooting/model-issues.md |
| 2 | `Value not in list: unet_name: '…' not in []` | file is in `checkpoints/` but the graph uses `UNETLoader` (reads `diffusion_models/`, legacy `unet/`) | move to `models/diffusion_models/`, `R` | `[OFFICIAL]` model-issues.md; `[USER]` ComfyUI#10773, #11777, #7151 |
| 3 | `Given groups=1, weight of size [64, 4, 3, 3], expected input[1, 16, 128, 128] to have 4 channels, but got 16 channels instead` | mixed architecture families (4-ch SD/SDXL vs 16-ch Flux/SD3) | keep model + VAE + encoders from one release; the second number is the channel count | `[OFFICIAL]` model-issues.md |
| 4 | `mat1 and mat2 shapes cannot be multiplied (154x2048 and 768x320)` | SD1.5 ControlNet on an SDXL checkpoint (or vice versa) | use a ControlNet built for that architecture | `[OFFICIAL]` model-issues.md |
| 5 | `Error while deserializing header` | truncated/corrupt safetensors, no disk space, or unreadable permissions | re-download; check free space (2–15 GB+) and read permissions | `[OFFICIAL]` model-issues.md |
| 6 | `RuntimeError: CUDA out of memory` | too many pixels × frames for the card | resolution/length/batch → tiled VAE decode → `--cpu-vae` → `--reserve-vram` → offload flags; **avoid `--novram` early, it disables dynamic VRAM** | `[OFFICIAL]` model-issues.md + cli_args.py |
| 7 | `Expected all tensors to be on the same device, but got index is on cuda:0, different from other tensors on cpu` | dynamic-VRAM offload bug | `--disable-dynamic-vram` (still present in `master` today) | `[USER]` ComfyUI#12786 (painpoints §5.1) |
| 8 | `Input tensors must be in dtype of torch.float16 or torch.bfloat16, using pytorch attention instead` | Sage Attention on H3 layers in other dtypes | **nothing** — "These are expected… generation still works" | `[OFFICIAL]` minimax-h3.md |
| 9 | `0.0 seconds (IMPORT FAILED): …\custom_nodes\<pack>` in the startup log | pack cloned, Python deps missing/conflicting | install that pack's `requirements.txt` into ComfyUI's **own** Python (`python_embeded\python.exe -m pip install -r …`), restart | `[USER]` Manager#2030 log; `[OFFICIAL]` install_custom_node.md |
| 10 | `Cannot import …\custom_nodes\<pack> module for custom nodes: No module named 'webcolors'` | one missing transitive dependency | `pip install` that module into ComfyUI's environment; check for version clobbering | `[USER]` Manager#2030 |
| 11 | `[ComfyUI-Manager] An error occurred while fetching 'https://api.comfy.org/nodes?…'` + `Cannot connect to comfyregistry.` | no/blocked network — versions then show as "unknown" and missing packs cannot be resolved | fix the network/proxy, or set Manager `network_mode = private|offline` and install by hand | `[USER]` Manager#2030; `[OFFICIAL]` Manager README |
| 12 | `Some nodes require a newer version of ComfyUI (current: 0.3.66). … Requires ComfyUI 0.3.60` | comparison bug; fires when you are already newer | ignore it; reproduced with all custom nodes disabled and closed `not planned` | `[USER]` ComfyUI#10490 |
| 13 | "Install Missing Custom Nodes" lists **nothing** although nodes are red | the pack is not in the Comfy Node Registry — omitted silently | identify the pack from `properties.aux_id` (`github-user/repo`) or the node name, then `git clone` into `custom_nodes/` + its requirements | `[USER]` Manager#3138 (open); `[OFFICIAL]` workflowSchema.ts |
| 14 | Missing-models popup keeps appearing after you downloaded the file | detection "only checks whether there is a file with the same name in the corresponding **top-level directory**" | ignore the popup and select the file in the loader, or move it out of the subfolder | `[OFFICIAL]` features/template.md |
| 15 | No download prompt at all for a GGUF model | `.gguf` links "are considered unsafe… the link will not be shown" | download manually; install `ComfyUI-GGUF`; prefer native fp8 when dynamic VRAM is on | `[OFFICIAL]` features/template.md; `[STAFF]` main.py |
| 16 | Model download fails / 401 on LTX-2.5 weights | gated Hugging Face repo | accept the licence on `Lightricks/LTX-2.5` and wait for approval — "Model downloads will fail without access" | `[OFFICIAL]` ltx-2-5.md |
| 17 | `Node pack version has invalid semantic version: "…"` / `Node pack version has invalid Git commit hash: "…"` | hand-edited `properties.ver`; only semver, a 4–40-char git hash, or `"unknown"` validate | restore a valid value or delete the key | `[OFFICIAL]` workflowSchema.ts |
| 18 | `Invalid aux_id: Must be valid 'github-username/github-repo-name'` | `aux_id` not in `owner/repo` form | fix to exactly two `/`-separated segments | `[OFFICIAL]` workflowSchema.ts |
| 19 | Workflow-validation error toast on load | frontend zod/link validation | it does not block loading; temporarily "Disable workflow validation in settings" and report | `[OFFICIAL]` troubleshooting/overview.md; settings/comfy.md |
| 20 | `Torch not compiled with CUDA enabled` **on an Intel GPU** | XPU backend not found; ComfyUI fell back to CUDA | "**Do not** follow the NVIDIA CUDA reinstallation steps above. Intel GPUs use XPU, not CUDA." Install an XPU wheel | `[OFFICIAL]` troubleshooting/overview.md |
| 21 | `Frontend or Templates Package Not Updated` | `git pull` without updating the pip packages | `pip install -r requirements.txt` (frontend/templates/docs are separate wheels) | `[OFFICIAL]` troubleshooting/overview.md |
| 22 | H3 output is 1376×768 or rejected at 1.0 MP | above the pixel-area cap | "Skip the `1.0` Megapixel step… above the model's 768x1344 pixel area cap" — use `0.98`, keep Multiple = 32 | `[OFFICIAL]` minimax-h3.md |
| 23 | Run does nothing; result appears instantly | identical graph → cached (`execution_cached`) | change the seed, or launch with `--cache-none` | `[OFFICIAL]` README + comms_messages.md (Aug sweep) |

---

## Teaching gotchas

**Queue vs Run.** They are the same action: the button labelled **Run** queues a prompt; `Ctrl+Enter` = "Queue prompt", `Ctrl+Shift+Enter` = "Queue prompt (Front)", `Ctrl+Alt+Enter` = Interrupt, `Q` toggles the queue sidebar. Nothing runs synchronously — the job goes on a server-side queue and returns a `prompt_id` plus a queue position. `[OFFICIAL]` shortcuts.md / comms_routes.md (Aug sweep). Corollary: **`Ctrl+Enter` five times gives you five jobs**, which is different from batch size (below), and the frontend caps one click at **Batch count limit = 100**. `[OFFICIAL]` settings/comfy.md

**"Nothing happened" is the cache, not a bug.** "if you submit the same graph twice only the first will be executed"; the websocket says `execution_cached`. Change the seed (or anything upstream) to get a different result; `--cache-none` forces full re-execution at a speed cost. `[OFFICIAL]` (Aug sweep)

**Seeds and `control_after_generate`.** `values: ['fixed','increment','decrement','randomize']`, default `randomize`, `serialize: false` (**client-side only — it is not part of the submitted prompt, and it does nothing if the seed widget has an incoming link**). `increment` adds one step, `decrement` subtracts, `randomize` jumps (clamped by `SAFE_INTEGER_MAX = 1125899906842624`, well below the widget's `0…18446744073709551615`). Whether it fires before or after the run is **Settings → Node Widget → Widget control mode**. `[OFFICIAL]` frontend `widgets.ts`/`valueControl.ts` + settings/comfy.md (Aug sweep, re-checked in settings today). Teaching order: **fixed** while you iterate on wording, **randomize** only when exploring.

**Batch size vs queue count.** Batch size (the latent node's `batch_size`, or frames/`length` for video) multiplies VRAM in a single run; queue count runs the same graph N times sequentially at the same VRAM. When a student OOMs on "4 images", lowering batch size is the fix; when they want 4 different seeds cheaply, queueing 4 is. `[SYNTHESIS]` on `[OFFICIAL]` "Lower resolution/batch size - Reduce image size or number of images" (troubleshooting/overview.md) and the batch-count-limit setting.

**Why the same seed gives different pixels on another machine.** The seed fixes the *noise*, not the arithmetic. ComfyUI picks among mutually exclusive attention backends (`--use-split-cross-attention`, `--use-quad-cross-attention`, `--use-pytorch-cross-attention`, `--use-sage-attention`, `--use-flash-attention`, `--use-ck-attention`) and falls back silently at runtime — v0.30.0 added "Fallback to cuDNN attention on Linux when Flash Attention fails", v0.30.0 "Expand k/v when attention would fall back to math for GQA", and H3 layers drop to PyTorch attention with the dtype message above. Weight dtype differs by GPU generation (`[STAFF]` 50-series: fp16/bf16/fp8/fp4; 40-series fp8; 30-series bf16; 20-series fp16). And ComfyUI's own determinism flag is hedged: `--deterministic` = "Make pytorch use slower deterministic algorithms when it can. **Note that this might not make images deterministic in all cases.**" `[OFFICIAL]` cli_args.py + changelog; `[STAFF]` GPU wiki (Aug sweep). Teach: identical seed reproduces *within one machine and one build*; across machines expect "same composition, different grain", and never grade on pixel identity.

**CFG 1 makes negatives inert.** At CFG 1 there is no guidance term to steer away from, so the negative prompt has no effect; Turbo/Lightning/distilled checkpoints are trained to run there. This is already in the corpus with sources — `research/_addenda/comfyui-faq-2026-08-28.md` ("Distilled models run without CFG", `FluxDisableGuidance`, Krea's own `--cfg 0.0`), the app's `KNOWLEDGE` Krea/Z-Image/Qwen-Lightning paragraphs, and `wfNotes`' "No negative-prompt field by design (CFG-free graph uses `ConditioningZeroOut`)". `comfyui-metadata.md` adds the reading rule: a `ConditioningZeroOut` on the negative input means "no negative" — do not report the positive text as the negative. Do **not** upgrade "CFG > 1 on a distilled model burns the image" to official ComfyUI doctrine; it is model-author guidance (faq §"Couldn't find a reliable answer" #5).

**Bypass vs mute.** `Ctrl+B` = **Bypass**: "The node will never execute… but subsequent nodes can still try to obtain data that hasn't been processed by this node" — data flows through. `Ctrl+M` = **Mute** (mode `Never`): "as if it's been deleted. Subsequent nodes cannot read or receive any data from it" — downstream errors. Bypass to remove a *step* from a chain (the docs' own worked example is a LoRA loader); mute to switch off a whole *branch*. Shipped workflows use bypassed groups as optional sections — the app's own Wan graph bypasses `LoadImage` for T2V. `[OFFICIAL]` basic-concepts/nodes.md + shortcuts.md (Aug sweep). Subgraphs obey the same rule: "Use bypass to disable". `[OFFICIAL]` features/subgraph.md

**Three more worth a card each.** (a) **Gated repos**: LTX-2.5 downloads fail until you accept the licence on Hugging Face; the frontend now shows "Gated Hugging Face model access hints" (v0.31.0). (b) **Templates as ground truth**: official templates "Do not use any third-party nodes", so if a template runs and the shared workflow does not, the difference is custom nodes. (c) **Licence ≠ weights**: H3 open weights are local, but "Commercial use of locally generated outputs requires a MiniMax commercial license… available through Comfy, the only official reseller" `[OFFICIAL]` minimax-h3.md; and Wan 3.0 / Qwen-Image 3.0 / Flux 3 exist **only** as partner nodes.

---

## Proposed tutor knowledge lines

Terse, `KNOWLEDGE`-style, ≤60 words each, evidence-labelled. Ready for `docs/FOLD-IN-2026-09.md` to place.

1. `[OFFICIAL]` **Version anchor (Sept 3, 2026):** ComfyUI core v0.34.3 (Sept 2), frontend package 1.49.6, workflow-templates 0.11.48, embedded-docs 0.5.10, minimum PyTorch 2.7. Settings→About shows your two versions. `git pull` alone leaves you split-versioned — always `pip install -r requirements.txt` after.
2. `[OFFICIAL]` **Manager is built into core** (pip support landed core v0.4.0, Dec 2025; bundled Manager 4.1 by v0.19.0). Desktop: on. Portable/manual: install `manager_requirements.txt`, launch `--enable-manager`. A git-cloned Manager **cannot** use the new UI. `--enable-manager-legacy-ui` restores Git-URL install.
3. `[OFFICIAL]` **Red nodes, official causes, in order:** wrong/old ComfyUI version, or a pack that failed to import at startup. Search the console for `IMPORT FAILED` and `Cannot import … module for custom nodes:` before reinstalling anything. Restart after installing — node classes register only at startup.
4. `[OFFICIAL]` **`cnr_id`/`aux_id`/`ver` in workflow JSON:** `cnr_id` = registry pack id (core nodes = `comfy-core`); `aux_id` = `github-user/repo` for packs **not** from the registry; `ver` = semver, a git hash, or literally `"unknown"`. Most nodes carry none of it — treat detection as partial, never complete.
5. `[USER]` **If "Install Missing Custom Nodes" lists nothing while nodes are red**, the pack is probably not in the registry — it is omitted silently (Manager#3138, open Aug 2026). Read `properties.aux_id` in the JSON to find the repo, then `git clone` into `custom_nodes/` and install its `requirements.txt`.
6. `[USER]` **"Version unknown" and a Manager that finds nothing = a network problem.** Look for `Cannot connect to comfyregistry.` in the log. On a locked-down network set Manager `network_mode = private` or `offline` and install packs by hand.
7. `[OFFICIAL]` **Wan 2.2 VAEs are not interchangeable:** 14B T2V/I2V load `wan_2.1_vae.safetensors` ("compatible with Wan2.2"); the 5B TI2V loads `wan2.2_vae.safetensors`. The official I2V step list still names the `t2v` files — trust the download cards, not the numbered steps.
8. `[OFFICIAL]` **New folders 2026 models need:** `models/latent_upscale_models/` (LTX-2.5 upscaler), `models/embeddings/` for MiniMax H3 `embedding:` prompts (core v0.34.0). LTX-2.5 and H3 each need **two** VAEs, video and audio. FLUX.2 dev uses a **Mistral** text encoder, not T5 or Qwen.
9. `[OFFICIAL]` **The missing-models popup only looks in the top-level folder.** A model inside `models/diffusion_models/wan_video/` triggers a false "missing" — ignore the popup and pick the file in the loader. GGUF files never get a download link at all (`.gguf` is treated as an unsafe format).
10. `[OFFICIAL]` **OOM ladder, corrected:** resolution/length/batch first → `VAE Decode (Tiled)` → `--cpu-vae` → `--reserve-vram 2` / `--disable-smart-memory` → `--async-offload` / `--fast-disk` / `--cache-none`. `--lowvram` is a no-op under dynamic VRAM, and `--novram`, `--highvram`, `--gpu-only`, `--cpu` each **turn dynamic VRAM off**.
11. `[OFFICIAL]` **Use the quantised build the official template loads** — LTX-2.5 `int8_convrot`, H3 `int8_convrot` + `nvfp4` encoder, FLUX.2 `fp8mixed`, Qwen fp8 (20 GB vs 41 GB bf16). ComfyUI itself recommends native fp8 over GGUF while dynamic VRAM is on. Block swap is a wrapper feature, not core.
12. `[OFFICIAL]` **Not every scary console line is an error.** `Input tensors must be in dtype of torch.float16 or torch.bfloat16, using pytorch attention instead` is expected with Sage Attention on MiniMax H3 — those layers fall back and generation completes normally.
13. `[OFFICIAL]` **Preview saves nothing.** `PreviewImage` writes to `ComfyUI/temp/` with a random name; only Save nodes write `output/`. Core `SaveVideo` defaults to prefix `video/ComfyUI`, i.e. `output/video/`. Move outputs with `--output-directory`.
14. `[OFFICIAL]` **Metadata:** ComfyUI embeds `prompt` + `workflow` in everything it saves, and `--disable-metadata` (Desktop: "Disable saving prompt metadata in files") switches it off. Since core v0.30.0 MP4 tags are written at the **start** of the file, so recovery survives partial reads. Prompt Studio's Meta Inspector reads all of these.
15. `[OFFICIAL]` **API-format export is still behind Dev mode** — Settings → Dev Mode → "Enable dev mode options (API save, etc.)", default **Disabled**. Save format (`Ctrl+S`) is what you share and drag onto a canvas; API format is only for driving the server from code.
16. `[OFFICIAL]` **Subgraphs:** the values you typed live on the **instance** node — edit them via "Edit Subgraph Widgets" (parameters panel, core v0.3.66+) without entering the subgraph. Inner nodes may still show stale template text. Blueprints are copied, not linked: editing one instance does not change another.
17. `[OFFICIAL]` **Partner nodes are paid cloud calls**, not local models: they show a pricing badge, need a Comfy account with credits, only work from `127.0.0.1`, and send your prompts and images to third parties. Wan 3.0, Qwen-Image 3.0 and Flux 3 are partner-only. `--disable-api-nodes` removes them and blocks all frontend internet access.
18. `[OFFICIAL]` **Queue vs Run:** Run *is* queue. `Ctrl+Enter` queues, `Ctrl+Shift+Enter` queues to the front, `Ctrl+Alt+Enter` interrupts, `Q` opens the queue. One click is capped at Batch count limit 100. Queue count = N sequential runs at the same VRAM; batch size = one run at N× VRAM.
19. `[OFFICIAL]` `control_after_generate` is **client-side only** (`serialize: false`) — it never reaches the server and does nothing if the seed widget has an incoming link. `fixed` while you iterate on wording, `randomize` to explore. Settings → Node Widget → Widget control mode decides before-or-after.
20. `[OFFICIAL]`/`[SYNTHESIS]` **Same seed, different machine, different pixels.** Attention backend (Sage/Flash/cuDNN/PyTorch, with silent runtime fallbacks), weight dtype by GPU generation, and quantisation all change the arithmetic. Even `--deterministic` "might not make images deterministic in all cases." Reproduce within one machine and build; never grade on pixel identity.

---

## Nothing-found register

Scoped to what was searched: docs.comfy.org (`llms.txt` index, changelog, troubleshooting, manager, interface, basic-concepts, tutorials for LTX-2.5 / H3 / Wan 2.2 / FLUX.2 dev / templates / settings), `raw.githubusercontent.com` for ComfyUI `master` (`cli_args.py`) and ComfyUI_frontend `main` (`workflowSchema.ts`, `package.json`, `scripts/`), the ComfyUI-Manager README, and GitHub issue pages plus web search over github.com.

1. **No official changelog entry for `ComfyUI_frontend` itself.** `raw.githubusercontent.com/Comfy-Org/ComfyUI_frontend/main/CHANGELOG.md` returns empty; GitHub tree/blob and releases pages render client-side and fetch empty. Frontend changes are only visible through core's changelog ("Bumped comfyui-frontend-package to …") and `package.json`. The dev head (1.49.1) is *older* than the wheel core pins (1.49.6) — do not read `main` as "newest".
2. **No first-party document defining `cnr_id`/`aux_id`/`ver` in prose.** `https://docs.comfy.org/specs/workflow_json` shows `properties` with only `"Node name for S&R"` typed and `additionalProperties: true`; the real contract exists only in the frontend zod schema and in one worked example on the templates page. Both are cited above.
3. **No source found for how the Manager maps a missing class name to a pack** (whether `extension-node-map.json` drives the new UI, and whether a restart is required for the missing-node flow). Same gap as recorded 2026-08-28; the Manager README describes only the button. Not answered by any page fetched today.
4. **No official statement that a `ver` mismatch alone renders a node red.** The Version dropdown and the `ver` field exist, and #1762/#10490 show id- and version-resolution failures, but no doc or source line says "installed pack version ≠ workflow `ver` ⇒ node shows as missing". Causes 1–3 and 6 in "Why a node can be installed and still red" are sourced; the pure-version case is `[SPECULATION]`.
5. **No published VRAM/timing table for Wan 2.2 14B, LTX-2.5, MiniMax H3 or FLUX.2 dev.** Only qualitative statements ("5B should fit well on 8GB vram") and the Qwen-Image RTX 4090D table from the Aug sweep. Not found on any tutorial page; the per-family OOM table above is therefore mechanism-based, not benchmarked.
6. **No core block-swap node or flag.** Not in `cli_args.py`; not in any docs page fetched. Block swap exists only in `ComfyUI-WanVideoWrapper` / `ComfyUI-LTXVideo`, which the docs list as community resources. Recorded so nobody re-hunts a native option.
7. **The `--disable-dynamic-vram` removal could not be confirmed.** painpoints §5.1 records a user told it "will be soon removed" (#13139). It is present in `master` today, alongside a new `--enable-dynamic-vram`. Treat "the flag is going away" as unconfirmed.
8. **No official cross-GPU reproducibility statement.** Nothing says "the same seed will differ across GPUs"; the claim in gotcha 20 is `[SYNTHESIS]` from the attention-backend flag set, the runtime fallbacks in the changelog, dtype-by-generation from the GPU wiki, and the hedge inside `--deterministic`'s own help text.
9. **Desktop "Disable saving prompt metadata in files" not re-verified today.** The setting is cited in `comfyui-metadata.md` (2026-09-02); `docs.comfy.org/installation/desktop/usage/settings.md` was not fetched this pass. The CLI flag was re-verified.
10. **Closed-issue harvest was deliberately shallow.** GitHub issue HTML works but costs ~6 k tokens per page, so only Manager#3138 (open) and Manager#2030 (closed) were fetched in full. ComfyUI#10773 / #11777 / #7151 (the `unet_name` family) and Manager#1339 / #1812 / #11762 were located by search — **titles, repos and URLs verified, bodies not read**. Anyone quoting them must fetch them.
11. **Reddit and Discord remain unreachable** (standing rule). `api.github.com` returns empty bodies. Shell `curl` is blocked by an allowlist in this environment — only the fetch tool reaches the network.

---

## Sources

All accessed **2026-09-03** unless noted.

**Comfy-Org docs**
- Changelog (v0.29.x → v0.34.3) — https://docs.comfy.org/changelog.md
- Doc index — https://docs.comfy.org/llms.txt · https://docs.comfy.org/_llms/en/get-started.md
- Dependencies / pinned wheel versions — https://docs.comfy.org/basic-concepts/dependencies.md
- Node properties (conceptual) — https://docs.comfy.org/basic-concepts/properties.md
- Workflow JSON schema v1.0 — https://docs.comfy.org/specs/workflow_json.md
- Manager install & flags — https://docs.comfy.org/manager/install.md
- Manager custom nodes (new UI), registry-only + no-git FAQ — https://docs.comfy.org/manager/pack-management.md
- Troubleshooting overview — https://docs.comfy.org/troubleshooting/overview.md
- Model issues (error texts) — https://docs.comfy.org/troubleshooting/model-issues.md
- Custom-node issues (binary search, Extensions panel) — https://docs.comfy.org/troubleshooting/custom-node-issues.md
- Comfy settings reference (Dev mode, partner badge, missing-node/model warnings, batch cap, validation) — https://docs.comfy.org/interface/settings/comfy.md
- Templates (cnr_id example, top-level-only detection, `.gguf` unsafe) — https://docs.comfy.org/interface/features/template.md
- Subgraphs (parameters panel, unpack, blueprints) — https://docs.comfy.org/interface/features/subgraph.md
- Partner Nodes overview — https://docs.comfy.org/tutorials/partner-nodes/overview.md
- LTX-2.5 — https://docs.comfy.org/tutorials/video/ltx/ltx-2-5.md
- MiniMax H3 — https://docs.comfy.org/tutorials/video/minimax/minimax-h3.md
- Wan 2.2 — https://docs.comfy.org/tutorials/video/wan/wan2_2.md
- FLUX.2 dev — https://docs.comfy.org/tutorials/flux/flux-2-dev.md

**Source code**
- `comfy/cli_args.py` (all flags, `enables_dynamic_vram()`) — https://raw.githubusercontent.com/comfyanonymous/ComfyUI/master/comfy/cli_args.py
- Frontend workflow zod schema (`cnr_id`, `aux_id`, `ver`, subgraph defs, `extra`) — https://raw.githubusercontent.com/Comfy-Org/ComfyUI_frontend/main/src/platform/workflow/validation/schemas/workflowSchema.ts
- Frontend `package.json` (1.49.1) — https://raw.githubusercontent.com/Comfy-Org/ComfyUI_frontend/main/package.json
- Frontend schema-generation script (locates the schema path) — https://raw.githubusercontent.com/Comfy-Org/ComfyUI_frontend/main/scripts/generate-json-schema.ts
- ComfyUI-Manager README (security levels, `network_mode`, paths, V3.38 migration, pyproject naming) — https://raw.githubusercontent.com/Comfy-Org/ComfyUI-Manager/main/README.md

**GitHub issues — fetched and quoted verbatim**
- Manager #3138, "Feature Request: Improve 'Install Missing Custom Nodes' Detection and Feedback", theawesomerobot, opened 2026-08-06, **open** — https://github.com/Comfy-Org/ComfyUI-Manager/issues/3138
- Manager #2030, "unknown version nodes", hadi446-446, opened 2025-07-25, **closed** — https://github.com/Comfy-Org/ComfyUI-Manager/issues/2030

**GitHub issues — located by search, titles/URLs only (bodies not read)**
- ComfyUI #10773, #11777, #7151, #8826, #8329 (`Value not in list` / `unet_name`); Manager #1339 (installed nodes not recognised), #1812 (install by URL, cnr_id from URL, version defaulted to "nightly"), #11762 (custom-node installation done but still missing).

**Referenced repo files (not re-fetched this pass)**
- `research/_addenda/comfyui-metadata.md` (2026-09-02) · `research/_addenda/comfyui-faq-2026-08-28.md` (2026-08-28) · `research/_addenda/comfyui-painpoints.md` (2026-09-01) · `research/_addenda/comfyui-architecture.md` (2026-09-01) · `PromptStudio.html` `KNOWLEDGE` "== COMFYUI FAQ ==" block and `wfNotes()` (read-only, for overlap and contradiction checking).
