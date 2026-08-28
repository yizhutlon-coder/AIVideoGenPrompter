# ComfyUI Troubleshooting + How-Do-I FAQ (Student-Facing)

**Harvested:** 2026-08-28
**Audience:** students handed a ready-made workflow JSON who need to run it, plus general beginners.
**Purpose:** offline tutor knowledge bank for the teaching app. Each entry is a `Q:` / `A:` pair written for a student, followed by graded sources.

## Evidence label key

| Label | Meaning |
|---|---|
| `[OFFICIAL]` | Comfy-Org first-party: docs.comfy.org pages, ComfyUI source code (`cli_args.py`, `nodes.py`, `folder_paths.py`, `main.py`, README), ComfyUI_frontend source, ComfyUI-Manager README. |
| `[STAFF]` | Written by a core maintainer but outside the formal docs (project wiki, in-code warning strings, model-author READMEs). |
| `[TESTED]` | A measured/benchmarked number published by Comfy-Org (e.g. the VRAM/timing tables in official tutorial pages). |
| `[LORE]` | Widely-repeated community claim that I could NOT verify against a first-party source. Flagged inline; do not teach as fact. |

All URLs accessed **2026-08-28**. docs.comfy.org serves clean markdown when you append `.md` to a page path.

---

## Highest-value corrections found during this harvest

Read these before using the FAQ — they contradict things commonly assumed:

1. **ComfyUI-Manager is now built into ComfyUI core**, not a custom node you clone. On Desktop it is on by default; on Portable/manual you install `manager_requirements.txt` and pass `--enable-manager`. The old `git clone` into `custom_nodes/` is documented as a *legacy* method. [OFFICIAL]
2. **The new Manager UI cannot install from a Git URL at all** — by design, for security. Registry-only. Students hitting an unregistered node must install by hand or use the legacy UI.
3. **`--normalvram` no longer exists** in `cli_args.py`. The VRAM group is `--gpu-only / --highvram / --lowvram / --novram / --cpu`. Also, `--lowvram` is now a *no-op when dynamic VRAM is active* — it only forces text encoders to CPU in the legacy path.
4. **The "Krea 2 >600-token cliff" could not be verified from any first-party source** and the official Krea prompting guide says the opposite. See the "no reliable answer" list at the end. Do not teach it.
5. **Krea 2 uses the Qwen-Image VAE** (`qwen_image_vae.safetensors`) and a Qwen3-VL text encoder — a very common mismatch for students who assume a Flux-family VAE.
6. **The docs' Wan 2.2 I2V step list has a bug**: it instructs loading the `t2v` filenames while its own download cards list the `i2v` files. A student following the numbered steps loads the wrong weights.

---

## The FAQ

---

### Q: Someone gave me a workflow `.json` file. How do I load it into ComfyUI?

**A:** Drag the `.json` file straight onto the ComfyUI canvas — that is the fastest way and it works for any workflow file. You can also use the top menu **Workflows → Open** (or `Ctrl + O` / `Cmd ⌘ + O`) and pick the file. If your teacher sent you a PNG or MP4 instead of a `.json`, drag *that* in — ComfyUI-generated output files carry the whole workflow inside them. Once loaded, the graph appears exactly as the author arranged it, including node positions, groups and colours.

**Sources**

- `[OFFICIAL]` "ComfyUI workflows can be stored in JSON format… After downloading, use menu **Workflows** -> **Open** to load the JSON file." — https://docs.comfy.org/get_started/first_generation.md (accessed 2026-08-28)
- `[OFFICIAL]` "Dragging and dropping a ComfyUI-generated image into the interface; Using menu **Workflows** -> **Open** to open an image" — same page.
- `[OFFICIAL]` `Ctrl + O | Load workflow` — https://docs.comfy.org/interface/shortcuts.md (accessed 2026-08-28)

---

### Q: What's the difference between a "UI format" workflow and an "API format" workflow, and which one do I need?

**A:** The normal workflow file (saved with `File → Save` / `Ctrl+S`) is the **save format** — it keeps node positions, sizes, colours and groups so it can be reopened and edited in the browser. The **API format** (`File → Export Workflow (API)`) strips all of that and keys everything by numeric node ID; it is what you POST to the server if you are driving ComfyUI from another program. For a class, you want the save format — an API-format file dropped on the canvas will not lay out as a normal editable graph, and a save-format file POSTed to `/prompt` will be rejected. If you were given API format and need to edit it, load it in the frontend and re-export.

**Sources**

- `[OFFICIAL]` "the workflow must be submitted in **API format**, a specialized JSON structure that differs from the regular save format used in the browser." — https://docs.comfy.org/development/api-development/workflow-api-format.md (accessed 2026-08-28)
- `[OFFICIAL]` Same page's comparison table: Save Format = "`File → Save` or `Ctrl+S`", node keys = "Node titles or labels", position/layout = "Included (x, y, width)", colours/groups = "Included", usage = "Re-opening in the frontend". API Format = "`File → Export Workflow (API)`", node keys = "Numeric node IDs", position/layout = "**Excluded**", colours/groups = "**Excluded**", usage = "API submission".
- `[OFFICIAL]` Conversion recipe, same page: "1. Open the `.json` file using `File → Load` in the frontend 2. Export it via `File → Export Workflow (API)`".
- Note: the older requirement to first switch on "Enable Dev mode Options" in settings **could not be found** in the current docs — the export appears to be an unconditional File-menu item as of this harvest. Treat the dev-mode step as possibly obsolete.

---

### Q: I loaded the workflow and some nodes are red / say "missing". What do I do?

**A:** Red nodes mean the workflow uses a *custom node pack* that isn't installed on your machine — the graph is fine, your ComfyUI just doesn't know those node types. If ComfyUI-Manager is available, a prompt appears automatically when the workflow loads: choose **Install All** to install every missing pack at once, or **Open Manager** to inspect them first. After installing, **restart ComfyUI** and reload the workflow. If no prompt appears, open the Manager and use the **Missing** filter in the left sidebar to list what the current workflow needs.

**Sources**

- `[OFFICIAL]` "If your ComfyUI Manager is properly installed, a prompt will appear when loading a workflow with missing nodes. 1. You can choose **Install All** to install all nodes at once 2. Or choose **Open Manager** to open the manager and browse details before installing" — https://docs.comfy.org/manager/pack-management.md (accessed 2026-08-28)
- `[OFFICIAL]` "**Left sidebar (Filters)**: Filter installed nodes, nodes in workflow, missing nodes, updatable nodes, etc." — same page.
- `[OFFICIAL]` "**Missing node detection**: Automatically detect and install missing nodes from workflows" — https://docs.comfy.org/manager/overview.md (accessed 2026-08-28)
- `[OFFICIAL]` Legacy Manager wording: "When you click on the `Install Missing Custom Nodes` button in the menu, it displays a list of extension nodes that contain nodes not currently present in the workflow." — https://raw.githubusercontent.com/Comfy-Org/ComfyUI-Manager/main/README.md (accessed 2026-08-28)
- `[OFFICIAL]` Restart requirement after manual install: "Restart ComfyUI and refresh your browser. Check startup logs for any `import failed` errors" — https://docs.comfy.org/installation/install_custom_node.md (accessed 2026-08-28). Note: the Manager README itself does **not** state a restart is required for the missing-node flow; the restart guidance comes from the custom-node install docs.

---

### Q: What if ComfyUI-Manager itself isn't installed?

**A:** In current ComfyUI, the Manager ships **inside ComfyUI core** — it just may need switching on. On **Comfy Desktop** it is already included and enabled, nothing to do. On **Windows Portable**, run `.\python_embeded\python.exe -m pip install -r ComfyUI\manager_requirements.txt` then launch with `--enable-manager`. On a **manual install**, activate your venv, run `pip install -r manager_requirements.txt`, and start with `python main.py --enable-manager`. The old approach of `git clone`-ing ComfyUI-Manager into `custom_nodes/` still works but is now documented as legacy.

**Sources**

- `[OFFICIAL]` "If you're using Comfy Desktop, ComfyUI-Manager is already included and enabled by default. No additional installation is required." — https://docs.comfy.org/manager/install.md (accessed 2026-08-28)
- `[OFFICIAL]` Portable: "`.\python_embeded\python.exe -m pip install -r ComfyUI\manager_requirements.txt`" then "`.\python_embeded\python.exe -s ComfyUI\main.py --windows-standalone-build --enable-manager`" — same page.
- `[OFFICIAL]` Manual: "`pip install -r manager_requirements.txt`" then "`python main.py --enable-manager`" — same page.
- `[OFFICIAL]` Flags table, same page: `--enable-manager` "Enable ComfyUI-Manager"; `--enable-manager-legacy-ui` "Use the legacy manager UI instead of the new UI (requires `--enable-manager`)"; `--disable-manager-ui` "Disable the manager UI and endpoints while keeping background features (requires `--enable-manager`)".
- `[OFFICIAL]` Same flags in source: `--enable-manager` = "Enable the ComfyUI-Manager feature." — https://raw.githubusercontent.com/Comfy-Org/ComfyUI/master/comfy/cli_args.py (accessed 2026-08-28)
- `[OFFICIAL]` Legacy path + exact folder name: "ComfyUI-Manager files must be accurately located in the path `ComfyUI/custom_nodes/comfyui-manager`" and "Do not install in paths like `ComfyUI/custom_nodes/ComfyUI-Manager/ComfyUI-Manager` or `ComfyUI/custom_nodes/ComfyUI-Manager-main`" — https://docs.comfy.org/manager/install.md

---

### Q: The Manager can't find the node pack I need. Why, and what now?

**A:** The new Manager UI only installs packs that are published to the ComfyUI Registry, and it deliberately does **not** offer "install from Git URL" — that was removed for security. If your pack isn't in the registry, install it by hand: `cd ComfyUI/custom_nodes`, `git clone <repo url>`, then install that pack's `requirements.txt` into ComfyUI's *own* Python environment (for Portable: `python_embeded\python.exe -m pip install -r ComfyUI\custom_nodes\<pack>\requirements.txt`), then restart. Alternatively, switch to the legacy Manager UI with `--enable-manager --enable-manager-legacy-ui`, which still exposes Git-URL install (subject to its security level).

**Sources**

- `[OFFICIAL]` "The new Manager only supports installing nodes from the registry. If your node is not registered in the registry, please register it in the Manager first." and "For security and stability of the ComfyUI user system, the new UI does not support installing nodes via git." — https://docs.comfy.org/manager/pack-management.md (accessed 2026-08-28)
- `[OFFICIAL]` Manual git flow and the portable pip command — https://docs.comfy.org/installation/install_custom_node.md (accessed 2026-08-28)
- `[OFFICIAL]` Legacy UI switch: "`python main.py --enable-manager --enable-manager-legacy-ui`" — https://docs.comfy.org/manager/install.md
- `[OFFICIAL]` Security warning to relay to students: "Only install custom nodes from trusted authors and those commonly used by the community… Avoid installing obscure or suspicious plugins - unverified plugins may pose security risks that could lead to system compromise" — https://docs.comfy.org/installation/install_custom_node.md

---

### Q: ComfyUI-Manager says "not allowed with this security level". How do I fix it?

**A:** The Manager has a `security_level` setting that blocks riskier actions. `strong` blocks both high- and middle-risk actions; `normal` (the usual default) blocks only high-risk ones — which includes installing via Git URL, standalone `pip install`, and installing packs not in the default channel. `normal-` applies the same block only when the server is listening on a non-loopback address; `weak` allows everything. The setting lives in `config.ini` under the Manager's user directory. Lowering it weakens a real security boundary, so on a shared or school machine, ask an instructor before changing it — installing the pack manually is usually the safer path.

**Sources**

- `[OFFICIAL]` "`strong` * doesn't allow `high` and `middle` level risky feature / `normal` * doesn't allow `high` level risky feature * `middle` level risky feature is available / `normal-` * doesn't allow `high` level risky feature if `--listen` is specified and not starts with `127.` / `weak` * all feature is available" — https://raw.githubusercontent.com/Comfy-Org/ComfyUI-Manager/main/README.md (accessed 2026-08-28)
- `[OFFICIAL]` "`high` level risky features * `Install via git url`, `pip install` * Installation of custom nodes registered not in the `default channel`. * Fix custom nodes"; "`middle` level risky features * Uninstall/Update * Installation of custom nodes registered in the `default channel`. * Restore/Remove Snapshot * Restart"; "`low` level risky features * Update ComfyUI" — same README.
- `[OFFICIAL]` config location: `<USER_DIRECTORY>/__manager/config.ini` on ComfyUI v0.3.76+, `<USER_DIRECTORY>/default/ComfyUI-Manager/config.ini` on older versions — https://docs.comfy.org/manager/troubleshooting.md (accessed 2026-08-28)
- `[OFFICIAL]` **Version-dependent caveat:** the `ltdrdata/ComfyUI-Manager` fork's README states these two actions have moved out from under `security_level` into dedicated flags: "`Install via git url`, `pip install`, and installation of custom nodes not registered in the `default channel` are **no longer governed by `security_level`**"; the flags are `allow_git_url_install` / `allow_pip_install`, both "default to `false`", take effect "**only** when the server listens on a loopback address", and "Changes take effect after a **restart** (no hot reload)." — https://raw.githubusercontent.com/ltdrdata/ComfyUI-Manager/main/README.md (accessed 2026-08-28). Teach the `security_level` model but expect the flag model on newer builds.

---

### Q: How do I add a node to my workflow by hand?

**A:** Three ways. (1) **Double-click** on empty canvas to open the quick node search, type part of the node name, press Enter. (2) **Drag a link out of a socket** and release it on empty canvas — a filtered menu appears offering only nodes that can accept that data type, which is the fastest way to build a chain correctly. (3) Open the **Node Library** sidebar (`N`) and browse by category, including everything from Comfy Core and your installed custom packs.

**Sources**

- `[OFFICIAL]` "`Double-Click LMB | Quick search for nodes to add`" — https://docs.comfy.org/interface/shortcuts.md (accessed 2026-08-28)
- `[OFFICIAL]` "When dragging the input/output of a node, if a connection appears but you haven't connected to another node's input or output, releasing the mouse will pop up a context menu for the input/output, used to quickly add related types of nodes. You can adjust the number of node suggestions in the settings" — https://docs.comfy.org/basic-concepts/nodes.md (accessed 2026-08-28)
- `[OFFICIAL]` "Node Library: All nodes in ComfyUI, including `Comfy Core` and your installed custom nodes, can be found here" and sidebar shortcut `N` — https://docs.comfy.org/interface/overview.md and https://docs.comfy.org/interface/shortcuts.md
- `[OFFICIAL]` Suggestion count setting: "### Number of nodes suggestions / **Default Value**: 5" — https://docs.comfy.org/interface/settings/comfy.md (accessed 2026-08-28)
- `[LORE]` The classic **right-click canvas → Add Node → category submenu** is not documented on any current docs.comfy.org page I could find, and the frontend is migrating to "Nodes 2.0" (Vue rendering replacing the LiteGraph canvas — https://docs.comfy.org/interface/nodes-2.md). Teach double-click and drag-from-socket as the reliable paths; mention right-click as "may exist depending on your version".

---

### Q: Where exactly do model files go?

**A:** Everything lives under `ComfyUI/models/`, in a subfolder named for the *kind* of file, and each loader node reads from exactly one of those folders. The ones that matter most: `checkpoints/` (all-in-one models loaded by **Load Checkpoint** / `CheckpointLoaderSimple`), `diffusion_models/` (bare UNet/DiT weights loaded by **Load Diffusion Model** / `UNETLoader`), `text_encoders/` (CLIP / T5 / Qwen text encoders, loaded by `CLIPLoader` / `DualCLIPLoader`), `vae/`, `loras/`, `controlnet/`, `clip_vision/`, `upscale_models/`, `embeddings/`. If a file is in the wrong folder its loader dropdown simply won't list it. Two legacy folder names still work: `models/unet/` is read as `diffusion_models`, and `models/clip/` is read as `text_encoders`. Accepted extensions are `.safetensors`, `.ckpt`, `.pt`, `.pt2`, `.bin`, `.pth`, `.pkl`, `.sft`.

**Sources**

- `[OFFICIAL]` `folder_names_and_paths["checkpoints"] = ([os.path.join(models_dir, "checkpoints")], supported_pt_extensions)`; `folder_names_and_paths["text_encoders"] = ([os.path.join(models_dir, "text_encoders"), os.path.join(models_dir, "clip")], supported_pt_extensions)`; `folder_names_and_paths["diffusion_models"] = ([os.path.join(models_dir, "unet"), os.path.join(models_dir, "diffusion_models")], supported_pt_extensions)`; plus `vae`, `loras`, `controlnet` (also reads `t2i_adapter`), `clip_vision`, `style_models`, `embeddings`, `upscale_models`, `vae_approx`, `hypernetworks`, `model_patches`, `audio_encoders`, `classifiers`, `detection`, `diffusers` — https://raw.githubusercontent.com/Comfy-Org/ComfyUI/master/folder_paths.py (accessed 2026-08-28)
- `[OFFICIAL]` Legacy aliases: `def map_legacy(folder_name): legacy = {"unet": "diffusion_models", "clip": "text_encoders"}` — same file.
- `[OFFICIAL]` Extensions: `supported_pt_extensions = {'.ckpt', '.pt', '.pt2', '.bin', '.pth', '.safetensors', '.pkl', '.sft'}` — same file.
- `[OFFICIAL]` "All models are stored in `<your ComfyUI installation>/ComfyUI/models/` with subfolders like `checkpoints`, `embeddings`, `vae`, `lora`, `upscale_model`, etc. ComfyUI detects models in these folders and paths configured in `extra_model_paths.yaml` at startup." — https://docs.comfy.org/get_started/first_generation.md (accessed 2026-08-28)
- `[OFFICIAL]` On Comfy Desktop the models folder may not be where you expect: "Click the **logo** at the top-left; Open **Help** → **Open folder**; Choose **Open models folder**" — same page.

---

### Q: My workflow uses `UNETLoader` (Load Diffusion Model), not `CheckpointLoaderSimple` (Load Checkpoint). Does that change where the file goes?

**A:** Yes, and this is one of the most common reasons a student's model "disappears". **Load Checkpoint** lists only files in `models/checkpoints/`; **Load Diffusion Model** lists only files in `models/diffusion_models/` (or the legacy `models/unet/`). Modern models like Flux, Qwen-Image, Wan and Krea usually ship as *separate* pieces — a diffusion model, one or more text encoders, and a VAE — so a single workflow will pull from three different folders at once. If you drop a Flux `.safetensors` into `checkpoints/` but the workflow uses `UNETLoader`, the dropdown will stay empty even though the file is clearly "in models".

**Sources**

- `[OFFICIAL]` `class CheckpointLoaderSimple` → `"ckpt_name": (folder_paths.get_filename_list("checkpoints"), …)`; `class UNETLoader` → `"unet_name": (folder_paths.get_filename_list("diffusion_models"), )`; `class CLIPLoader` → `"clip_name": (folder_paths.get_filename_list("text_encoders"), )`; `class DualCLIPLoader` → both slots from `"text_encoders"`; `class VAELoader` → `vaes = folder_paths.get_filename_list("vae")`; `class LoraLoader` → `"lora_name": (folder_paths.get_filename_list("loras"), …)` — https://raw.githubusercontent.com/Comfy-Org/ComfyUI/master/nodes.py (accessed 2026-08-28)
- `[OFFICIAL]` Worked example of the split-file pattern: "Ensure the `DualCLIPLoader` node has the following models loaded: clip_name1: t5xxl_fp16.safetensors, clip_name2: clip_l.safetensors … Make sure the `Load VAE` node has `ae.safetensors` loaded" — https://docs.comfy.org/tutorials/flux/flux-1-text-to-image.md (accessed 2026-08-28)

---

### Q: I already have models in another folder (or another UI like A1111). Do I have to copy them?

**A:** No — use `extra_model_paths.yaml` to point ComfyUI at folders you already have. Portable/manual installs ship an `extra_model_paths.yaml.example` in the ComfyUI root; copy it to `extra_model_paths.yaml` and edit. Comfy Desktop uses `extra_models_config.yaml` in its app-data directory instead (`C:\Users\<you>\AppData\Roaming\ComfyUI\` on Windows, `~/Library/Application Support/ComfyUI/` on macOS) — **add** to that file, don't overwrite what the installer generated. Each entry is a `base_path` plus per-type subpaths, and you must **restart ComfyUI** for changes to take effect.

**Sources**

- `[OFFICIAL]` "We provide a way to add extra model search paths via the `extra_model_paths.yaml` configuration file… Copy and rename it to `extra_model_paths.yaml` for use. Keep it in ComfyUI's root directory at `ComfyUI/extra_model_paths.yaml`." — https://docs.comfy.org/basic-concepts/models.md (accessed 2026-08-28)
- `[OFFICIAL]` Desktop path `C:\Users\YourUsername\AppData\Roaming\ComfyUI\extra_models_config.yaml`; warning "For the desktop version, please add the configuration to the existing configuration path without overwriting the path configuration generated during installation." and "After saving, you need to **restart ComfyUI** for the changes to take effect." — same page.
- `[OFFICIAL]` A1111 sharing example: `a111: base_path: D:\stable-diffusion-webui\` with `checkpoints: models/Stable-diffusion`, `vae: models/VAE`, `loras: |` `models/Lora` `models/LyCORIS`, `controlnet: models/ControlNet` — same page.
- `[OFFICIAL]` Multi-path syntax and the newer keys: "`text_encoders: |` `models/text_encoders/` `models/clip/  # legacy location still supported`"; "`diffusion_models: |` `models/diffusion_models` `models/unet`"; `audio_encoders`, `model_patches` — https://raw.githubusercontent.com/Comfy-Org/ComfyUI/master/extra_model_paths.yaml.example (accessed 2026-08-28)
- `[OFFICIAL]` You can also add extra custom-node folders: "`my_custom_nodes:` `custom_nodes: /Users/your_username/Documents/extra_custom_nodes`" — https://docs.comfy.org/basic-concepts/models.md

---

### Q: The workflow loaded but a model dropdown is empty, red, or shows "null". How do I fix it?

**A:** The workflow stores the model **filename as text**. If your copy of the file has even a slightly different name (`flux1-dev.safetensors` vs `flux1-dev-fp8.safetensors`), or sits in a different `models/` subfolder, ComfyUI can't match it and the widget goes red. Fix it in this order: (1) confirm the file is in the folder that *that specific loader* reads; (2) press **`R`** to refresh node definitions — you don't have to restart just for a new file; (3) click the dropdown and pick your actual filename from the list; (4) if the list is still empty, restart ComfyUI. Renaming your file to exactly match the workflow also works and is often easier when a whole class shares one workflow.

**Sources**

- `[OFFICIAL]` The error text students will see: "Prompt outputs failed validation: CheckpointLoaderSimple: - Value not in list: ckpt_name: 'model-name.safetensors' not in []" — https://docs.comfy.org/troubleshooting/model-issues.md (accessed 2026-08-28)
- `[OFFICIAL]` "Verify the model is in the correct location… Ensure your model file is placed in the correct subfolder (e.g. `checkpoints`, `loras`, `vae`); Press the `r` key to refresh node definitions so ComfyUI can detect the model; Restart ComfyUI; Ensure the correct model is selected in the loader node" — https://docs.comfy.org/basic-concepts/models.md (accessed 2026-08-28)
- `[OFFICIAL]` "After you install or update models, press **`R`** on your keyboard to refresh object definitions and update model lists in nodes (for example, the dropdown in **Load Checkpoint**)." — https://docs.comfy.org/get_started/first_generation.md
- `[OFFICIAL]` "If the `Load Checkpoint` node shows no models or displays 'null', verify your model installation location and try refreshing or restarting ComfyUI." — same page.
- `[OFFICIAL]` `R | Refresh node definitions` — https://docs.comfy.org/interface/shortcuts.md

---

### Q: My output image or video is completely black / blank. What causes that?

**A:** Black output almost always means one of the model pieces doesn't match the others, or the VAE is running at a precision it can't handle. Work through these: **(1) Wrong VAE for the model family.** Model families use different latent shapes — SD1.5 and SDXL use 4-channel latents, Flux and SD3 use 16-channel. A mismatch usually errors at the VAE Decode stage rather than going black, but a subtly-wrong VAE can produce garbage. **(2) Wrong text encoder.** Flux needs `clip_l` + `t5xxl` in the two `DualCLIPLoader` slots — putting T5 in both is a known mistake. **(3) fp16 VAE overflow.** If you launched with `--fp16-vae`, remove it; ComfyUI's own help text for that flag literally warns it "might cause black images". Let ComfyUI pick the VAE dtype automatically, or force `--fp32-vae`. **(4) A broken xformers build.** xformers 0.0.18 has a known black-image bug at high resolution. **(5) macOS 14.5+** has a black-image bug that ComfyUI works around internally. **(6) Guidance settings on distilled models.** Few-step distilled checkpoints (Krea 2 Turbo, Z-Image-Turbo, "Lightning"/"Turbo" LoRAs) are trained to run with CFG effectively off; cranking CFG up burns or blanks the image.

**Sources**

- `[OFFICIAL]` Architecture families and channel counts: "**Flux models** use 16-channel latent space with dual text encoder conditioning (CLIP-L + T5-XXL); **SD1.5 models** use 4-channel latent space…; **SDXL models** use 4-channel latent space with dual text encoders; **SD3 models** use 16-channel latent space with triple text encoder conditioning" — https://docs.comfy.org/troubleshooting/model-issues.md (accessed 2026-08-28)
- `[OFFICIAL]` "**Flux + wrong VAE:** Problem: Using taesd or sdxl_vae.safetensors with Flux checkpoint. Fix: Use ae.safetensors (Flux VAE)"; "**Flux + incorrect CLIP configuration:** Problem: Using t5xxl_fp8_e4m3fn.safetensors in both CLIP slots of DualClipLoader. Fix: Use t5xxl_fp8_e4m3fn.safetensors in one slot and clip_l.safetensors in the other" — same page.
- `[OFFICIAL]` `--fp16-vae` help text: **"Run the VAE in fp16, might cause black images."**; siblings `--fp32-vae` "Run the VAE in full precision fp32.", `--bf16-vae` "Run the VAE in bf16.", `--cpu-vae` "Run the VAE on the CPU." — https://raw.githubusercontent.com/Comfy-Org/ComfyUI/master/comfy/cli_args.py (accessed 2026-08-28)
- `[OFFICIAL]` `--force-upcast-attention` help text: "Force enable attention upcasting, please report if it fixes black images." — same file.
- `[STAFF]` xformers: "WARNING: This version of xformers has a major bug where you will get black images when generating high resolution images." / "Please downgrade or upgrade xformers to a different version." (fires on `XFORMERS_VERSION.startswith("0.0.18")`) — https://raw.githubusercontent.com/comfyanonymous/ComfyUI/master/comfy/model_management.py (accessed 2026-08-28)
- `[STAFF]` macOS: `if macos_version is not None and ((14, 5) <= macos_version):  # black image bug on recent versions of macOS, I don't think it's ever getting fixed` → sets `upcast = True` — same file.
- `[OFFICIAL]` Distilled models run without CFG: Krea 2 Turbo is "an 8-step distilled checkpoint" (https://docs.comfy.org/tutorials/image/krea/krea-2.md); Z-Image-Turbo is "A distilled version that … with only **8 NFEs**" (https://docs.comfy.org/tutorials/image/z-image/z-image-turbo.md).
- `[STAFF]` Explicit CFG-off instruction from the model authors: "Distilled for few-step sampling — run with 8 steps and CFG disabled." and the reference command `--steps 8 --cfg 0.0 --mu 1.15`; RAW variant uses `--steps 52 --cfg 3.5` — https://raw.githubusercontent.com/krea-ai/krea-2/main/README.md (accessed 2026-08-28)
- `[OFFICIAL]` Flux's guidance is an embedded value, not CFG: `FluxGuidance` input `guidance` default `3.5`; `FluxDisableGuidance` description "This node completely disables the guidance embed on Flux and Flux like models" — https://raw.githubusercontent.com/comfyanonymous/ComfyUI/master/comfy_extras/nodes_flux.py (accessed 2026-08-28)
- `[LORE]` **Do NOT teach:** the "sdxl_vae_fp16_fix" workaround by name, or an A1111-style "NaNs were produced" message with a `--disable-nan-check` flag. Neither string exists anywhere in ComfyUI's source (`cli_args.py`, `model_management.py`, `sd.py`). The `--disable-nan-check` flag is an Automatic1111 feature, not ComfyUI.
- `[LORE]` **Could not verify:** a documented "wrong VAE → silently black image" path. What *is* verified is that each VAE declares its own `working_dtypes` list and `--fp16-vae` bypasses that safety list — that's the real mechanism.

---

### Q: I get "CUDA out of memory". What actually helps?

**A:** In rough order of effectiveness and least-pain-first: **(1) Use a smaller-precision build of the same model.** Official fp8 variants are roughly half the file size of bf16/fp16 (Qwen-Image: 40.9 GB bf16 vs 20.4 GB fp8) with a modest quality cost. GGUF quantised builds go smaller still but need the community `ComfyUI-GGUF` custom node. **(2) Lower the resolution and batch size** — VRAM cost scales with pixels. **(3) Add a `VAE Decode (Tiled)` node** in place of the normal VAE Decode; decoding the final image in tiles is often what pushes a big generation over the edge. **(4) Reserve less / offload more**: `--reserve-vram 2`, `--disable-smart-memory` to force aggressive offload to system RAM, `--lowvram`, then `--novram`, and `--cpu` only as a last resort. **(5) Close other GPU consumers** — browsers and games hold VRAM. Note that offloading trades VRAM for **system RAM**: with dynamic VRAM, ComfyUI streams weights, so a machine with plenty of RAM copes far better with a big model than one without.

**Sources**

- `[OFFICIAL]` Escalation ladder: "`python main.py --lowvram  # First try` / `python main.py --novram  # If lowvram insufficient` / `python main.py --cpu  # Last resort`"; also "Reduce attention memory usage: `python main.py --use-pytorch-cross-attention`" — https://docs.comfy.org/troubleshooting/model-issues.md (accessed 2026-08-28)
- `[OFFICIAL]` "Lower resolution/batch size - Reduce image size or number of images"; "Close unnecessary applications - Free up RAM and VRAM"; "`python main.py --reserve-vram 2`"; "`python main.py --disable-smart-memory`"; "`python main.py --preview-method none` (Disable previews (saves VRAM and processing))" — https://docs.comfy.org/troubleshooting/overview.md (accessed 2026-08-28)
- `[OFFICIAL]` Exact flag help — `--lowvram`: "Doesn't do anything if dynamic vram is enabled. If dynamic vram isn't being used this option makes the text encoders run on the CPU."; `--novram`: "When lowvram isn't enough."; `--highvram`: "By default models will be unloaded to CPU memory after being used. This option keeps them in GPU memory."; `--gpu-only`: "Store and run everything (text encoders/CLIP models, etc... on the GPU)."; `--cpu`: "To use the CPU for everything (slow)."; `--reserve-vram`: "Set the amount of vram in GB you want to reserve for use by your OS/other software."; `--vram-headroom`: "Set the amount of vram in GB for DynamicVRAM to maintain as extra headroom above default."; `--disable-smart-memory`: "Force ComfyUI to agressively offload to regular ram instead of keeping models in vram when it can."; `--cache-none`: "Reduced RAM/VRAM usage at the expense of executing every node for each run."; `--async-offload`: "Use async weight offloading… Default is 2. Enabled by default on Nvidia."; `--fast-disk`: "Prefer disk-backed dynamic loading and offload over unpinned RAM. Can be faster for users with fast NVME disks." — https://raw.githubusercontent.com/Comfy-Org/ComfyUI/master/comfy/cli_args.py (accessed 2026-08-28). **Note: `--normalvram` no longer exists.**
- `[OFFICIAL]` Tiled VAE decode is built in: `class VAEDecodeTiled` with `tile_size` (default 512, min 64, max 4096), `overlap` (default 64), `temporal_size` (default 64, "Only used for video VAEs: Amount of frames to decode at a time."), `temporal_overlap` (default 8); display name `"VAE Decode (Tiled)"`; sibling `"VAE Encode (Tiled)"` — https://raw.githubusercontent.com/comfyanonymous/ComfyUI/master/nodes.py (accessed 2026-08-28)
- `[TESTED]` fp8 vs bf16 file size for the same model: "Qwen-Image_bf16 (40.9 GB)" vs "Qwen-Image_fp8 (20.4 GB)", with the fp8 build being the one the official workflow loads — https://docs.comfy.org/tutorials/image/qwen/qwen-image.md (accessed 2026-08-28)
- `[OFFICIAL]` "ComfyUI does not natively support GGUF format models. To use GGUF models, you need to install community custom nodes such as [ComfyUI-GGUF](https://github.com/city96/ComfyUI-GGUF)." — https://docs.comfy.org/basic-concepts/models.md (accessed 2026-08-28)
- `[STAFF]` Important nuance on GGUF vs native fp8, printed by ComfyUI when you disable dynamic VRAM: "If you use gguf we recommend keeping dynamic vram enabled and using native ComfyUI model formats instead. ComfyUI native formats like fp8 will be faster even if they are larger than your memory." — https://raw.githubusercontent.com/comfyanonymous/ComfyUI/master/main.py (accessed 2026-08-28)
- `[STAFF]` fp8 needs the right GPU generation: "50 series (blackwell): fp16, bf16, fp8, fp4 / 40 series (ada): fp16, bf16, fp8 / 30 series (ampere): fp16, bf16 / 20 series (turing): fp16 / 10 series (pascal) and below: only slow full precision fp32." — https://raw.githubusercontent.com/wiki/comfyanonymous/ComfyUI/Which-GPU-should-I-buy-for-ComfyUI.md (accessed 2026-08-28)
- `[OFFICIAL]` System RAM does matter, but no minimum is published. The default cache size is computed *from* system RAM: `cache_ram = min(10.0, max(2.0, comfy.model_management.total_ram * 0.10 / 1024.0))` — https://raw.githubusercontent.com/comfyanonymous/ComfyUI/master/main.py. The system-requirements page lists OS, Python, browser and GPU but **no RAM line** — https://docs.comfy.org/installation/system_requirements.md

---

### Q: How do I know which version of ComfyUI I'm running?

**A:** Open **Settings** (gear icon, or `Ctrl + ,`) and go to the **About** page. It shows the backend **ComfyUI Version** and the separate **ComfyUI_frontend Version**, each linked to its GitHub repo. If you're on a nightly build the commit hash isn't shown there — run `git log` in your ComfyUI directory instead. The console/terminal also prints it at startup: look for the `ComfyUI version: X.Y.Z` line alongside the Python version. There is **no** `--version` command-line flag.

**Sources**

- `[OFFICIAL]` "**ComfyUI Version**: Shows the backend ComfyUI version number, linked to the official GitHub repository; **ComfyUI_frontend Version**: Shows the frontend interface version number, linked to the frontend GitHub repository"; opened via "**Settings** (gear icon) or using the `Ctrl + ,` keyboard shortcut" — https://docs.comfy.org/interface/settings/about.md (accessed 2026-08-28)
- `[OFFICIAL]` Nightly caveat: "if you are using the nightly version, the corresponding commit hash will not be displayed here… you can use the `git log` command in the corresponding ComfyUI main directory to view the corresponding commit hash." — same page.
- `[OFFICIAL]` Startup log: `logging.info("ComfyUI version: {}".format(comfyui_version.__version__))`, plus `comfy-aimdo` / `comfy-kitchen` version lines — https://raw.githubusercontent.com/comfyanonymous/ComfyUI/master/main.py (accessed 2026-08-28)
- `[OFFICIAL]` No `--version` flag exists in `cli_args.py`; the only print-and-exit flag is `--list-feature-flags` — https://raw.githubusercontent.com/Comfy-Org/ComfyUI/master/comfy/cli_args.py
- `[OFFICIAL]` The About page is also what a bug report needs: "System Information (can be found in the About page in settings): Operating System…, ComfyUI version…, Python version…, PyTorch version…, GPU model and driver version, Installation method" — https://docs.comfy.org/troubleshooting/overview.md

---

### Q: How do I update ComfyUI safely?

**A:** It depends on your install. **Desktop**: it auto-updates; you can force a check with **Menu → Help → Check for Updates**. Desktop tracks the *stable* release, so new features can lag by weeks. **Portable**: double-click `update\update_comfyui.bat` (development/latest) or `update_comfyui_stable.bat` (stable). Avoid `update_comfyui_and_python_dependencies.bat` unless you're deliberately fixing a broken environment — it reinstalls PyTorch and every dependency and can break custom nodes. **Manual/git**: activate your venv, `git pull`, **then `pip install -r requirements.txt`**. That last step is the one people skip, and skipping it is the #1 cause of "I updated but the new templates/nodes aren't there" — the frontend, templates and node docs ship as separate pip packages.

**Sources**

- `[OFFICIAL]` Portable script list and the danger warning: "`update_comfyui.bat` // Update to latest development version; `update_comfyui_stable.bat` // Update to latest stable version; `update_comfyui_and_python_dependencies.bat` // ⚠️ DANGER: Reinstalls dependencies - may cause conflicts". Risks listed: "May cause dependency conflicts with your existing setup; Can break custom nodes that rely on specific package versions; May overwrite manually configured packages" — https://docs.comfy.org/installation/update_comfyui.md (accessed 2026-08-28)
- `[OFFICIAL]` Manual: "`cd <ComfyUI-installation-path>` / `git pull`" then "`pip install -r requirements.txt`" — same page.
- `[OFFICIAL]` "Users often only use the `git pull` command to update ComfyUI code but **neglect core dependency updates**, leading to the following issues: Missing or abnormal frontend functionality; Cannot find newly added workflow templates; Outdated or missing node help documentation; New features lack corresponding frontend support" — same page.
- `[OFFICIAL]` The separately-versioned packages: `comfyui-frontend-package`, `comfyui-workflow-templates`, `comfyui-embedded-docs`, `comfy-kitchen`, `comfy-aimdo` — same page.
- `[OFFICIAL]` Failure symptom to recognise in the log: "`Falling back to the default frontend.` / `ComfyUI frontend version: xxx`" — same page.
- `[OFFICIAL]` Desktop: "Click `Menu` in the menu bar; Select `Help`; Click `Check for Updates`" and "Desktop installs track the **stable** ComfyUI release by default." — same page and https://docs.comfy.org/installation/system_requirements.md
- `[OFFICIAL]` Rollback: "`git log --oneline`" / "`git checkout <commit-hash>`" / "`git checkout master`" — https://docs.comfy.org/installation/update_comfyui.md

---

### Q: How do I update a single custom node without breaking everything?

**A:** In the Manager, use the **Update available** filter to see what has updates, select the pack, pick a specific version in the **Version** dropdown, then click **Update** — pinning a version is safer than blindly taking the newest. Before a batch update, take a snapshot: a snapshot records your ComfyUI version, every custom node with its commit hash, and all pip packages, so you can restore the exact working state. Comfy Desktop takes snapshots automatically on every boot and before/after each update, and restores roll back automatically if a package install fails. If something breaks and you can't tell what, launch with `--disable-all-custom-nodes` to confirm it's a custom node, then bisect.

**Sources**

- `[OFFICIAL]` "Under the **Update available** filter, you can filter nodes that have updates available… 1. Updatable nodes will display an update arrow indicator 2. Select a specific version in **Version** 3. Click the **Update** button after selecting a version to update" — https://docs.comfy.org/manager/pack-management.md (accessed 2026-08-28)
- `[OFFICIAL]` "A snapshot records your instance's current state, including: **ComfyUI version**… **Custom nodes**：every custom node with its version or commit hash… **pip packages**：all Python packages installed in the environment." / "Snapshots serve as restore points: roll back after a broken update…" / "Comfy Desktop automatically creates snapshots on key events: every boot, restart, **before/after an update**, and after a restore." / "If cancelled or if a package install fails, the system automatically rolls back to the pre-restore state using a built-in backup." — https://docs.comfy.org/installation/desktop/usage/snapshots.md (accessed 2026-08-28)
- `[OFFICIAL]` Legacy Manager snapshot behaviour: "When you press `Save snapshot` or use `Update All` on `Manager Menu`, the current installation status snapshot is saved." and "However, for custom nodes not managed by Git, snapshot support is incomplete." — https://raw.githubusercontent.com/Comfy-Org/ComfyUI-Manager/main/README.md (accessed 2026-08-28)
- `[OFFICIAL]` Isolation: `python main.py --disable-all-custom-nodes`, and `--whitelist-custom-nodes` "Specify custom node folders to load even when --disable-all-custom-nodes is enabled." — https://docs.comfy.org/troubleshooting/custom-node-issues.md and https://raw.githubusercontent.com/Comfy-Org/ComfyUI/master/comfy/cli_args.py
- `[OFFICIAL]` Automated bisect: "`comfy-cli node bisect start`" → mark `good` / `bad` → "`comfy-cli node bisect reset`" — https://docs.comfy.org/troubleshooting/custom-node-issues.md (accessed 2026-08-28)
- `[LORE]` I found **no** explicit official warning against "Update All". The nearest first-party signal is that snapshots exist precisely to "roll back after a broken update" and are taken automatically before/after updates.

---

### Q: Why does the first run take forever, and the second run of the same thing is quick?

**A:** Two separate caches are warming up. First, the model weights have to be read off disk and moved into RAM/VRAM — that can be tens of gigabytes, and on a spinning disk it dominates everything. Once loaded, ComfyUI keeps them cached, so the next run skips it. Second, ComfyUI only re-executes the parts of the graph that actually changed: if you only edit the prompt, the model loading and text-encoder setup are reused. Official benchmark on an RTX 4090D: the same Qwen-Image distilled fp8 workflow took ≈69 s on the first generation and ≈36 s on the second. If model loading is your bottleneck, move models to an SSD/NVMe.

**Sources**

- `[OFFICIAL]` "Only parts of the graph that have an output with all the correct inputs will be executed. Only parts of the graph that change from each execution to the next will be executed, if you submit the same graph twice only the first will be executed. If you change the last part of the graph only the part you changed and the part that depends on it will be executed." — https://raw.githubusercontent.com/comfyanonymous/ComfyUI/master/README.md (accessed 2026-08-28)
- `[TESTED]` VRAM Usage Reference table, GPU: RTX4090D 24GB — `fp8_e4m3fn`: First Generation ≈94 s / Second Generation ≈71 s; `fp8_e4m3fn with lightx2v 8-step LoRA`: ≈55 s / ≈34 s; `Distilled fp8_e4m3fn`: ≈69 s / ≈36 s — https://docs.comfy.org/tutorials/image/qwen/qwen-image.md (accessed 2026-08-28)
- `[OFFICIAL]` "### Slow Model Loading — **Symptoms:** Long delays when switching models or starting generation. **Solutions:** 1. **Use faster storage:** Move models to SSD if using HDD; Use NVMe SSD for best performance" — https://docs.comfy.org/troubleshooting/model-issues.md (accessed 2026-08-28)
- `[OFFICIAL]` Cache modes: `--cache-ram` "Use RAM pressure caching with the specified headroom thresholds. **This is the default caching mode.**"; `--cache-classic` "Use the old style (aggressive) caching."; `--cache-lru N` "Use LRU caching with a maximum of N node results cached. May use more RAM/VRAM."; `--cache-none` "Reduced RAM/VRAM usage at the expense of executing every node for each run." — https://raw.githubusercontent.com/comfyanonymous/ComfyUI/master/comfy/cli_args.py (accessed 2026-08-28)
- `[STAFF]` A separate first-run compile cost exists if you use `TorchCompileModel` (category `"experimental"`, `is_experimental=True`, backends `["inductor", "cudagraphs"]` — https://raw.githubusercontent.com/comfyanonymous/ComfyUI/master/comfy_extras/nodes_torch_compile.py) or ROCm tuning: "`PYTORCH_TUNABLEOP_ENABLED=1` … might speed things up at the cost of a **very slow initial run**." — ComfyUI README.

---

### Q: I clicked Run again with no changes and nothing happened. Is it broken?

**A:** No — that's intentional. ComfyUI hashes the graph and re-executes only what changed. Submit an identical graph twice and only the first one actually runs; the second returns the cached result instantly. If you want a genuinely different image, change something: the most common lever is the **seed** (set `control_after_generate` to `randomize`, or type a new seed). If you specifically want everything recomputed every time, launch with `--cache-none`, at the cost of speed.

**Sources**

- `[OFFICIAL]` "if you submit the same graph twice only the first will be executed" — https://raw.githubusercontent.com/comfyanonymous/ComfyUI/master/README.md (accessed 2026-08-28)
- `[OFFICIAL]` `--cache-none` "Reduced RAM/VRAM usage at the expense of executing every node for each run." — https://raw.githubusercontent.com/comfyanonymous/ComfyUI/master/comfy/cli_args.py
- `[OFFICIAL]` WebSocket also reports this as `execution_cached` — https://docs.comfy.org/development/comfyui-server/comms_messages.md (accessed 2026-08-28)

---

### Q: Seeds — what do fixed / increment / decrement / randomize actually do?

**A:** The seed is the starting random noise; the same seed with the same settings gives the same image. `control_after_generate` is a **UI-only helper** that changes the seed number for you around each run: **fixed** leaves it alone (use this when iterating on a prompt so only the prompt varies), **increment** adds one step, **decrement** subtracts one step, and **randomize** jumps to a random value. The default is `randomize` for widgets that declare seed control. Whether the change happens *before* or *after* the run is a setting — **Settings → Node Widget → Widget control mode** (`before` / `after`), which also renames the widget accordingly. Seeds range 0 to 18446744073709551615, though `randomize` is internally clamped well below that ceiling.

**Sources**

- `[OFFICIAL]` `values: ['fixed', 'increment', 'decrement', 'randomize']`, `serialize: false, // Don't include this in prompt.`, `canvasOnly: true`; tooltip "Allows the linked widget to be changed automatically, for example randomizing the noise seed."; default `defaultValue ?? 'randomize'` — https://raw.githubusercontent.com/Comfy-Org/ComfyUI_frontend/main/src/scripts/widgets.ts (accessed 2026-08-28)
- `[OFFICIAL]` Per-mode arithmetic: `case 'increment': case 'increment-wrap': next += step2; break` / `case 'decrement': next -= step2; break` / `case 'randomize': next = Math.floor(Math.random() * range) * step2 + min; break` / `if (mode === 'fixed') return undefined`; and `const SAFE_INTEGER_MAX = 1125899906842624` clamps randomize — https://raw.githubusercontent.com/Comfy-Org/ComfyUI_frontend/main/src/scripts/valueControl.ts (accessed 2026-08-28)
- `[OFFICIAL]` Before/after: `function controlValueRunBefore() { return useSettingStore().get('Comfy.WidgetControlMode') === 'before' }` with `beforeQueued` / `afterQueued` hooks — widgets.ts, same file.
- `[OFFICIAL]` The setting: "### Widget control mode / * **Options**: before, after / * **Function**: Controls whether the timing of node widget value updates is before or after workflow execution, such as updating seed values" — https://docs.comfy.org/interface/settings/comfy.md (accessed 2026-08-28)
- `[OFFICIAL]` Seed definition: `"seed": ("INT", {"default": 0, "min": 0, "max": 0xffffffffffffffff, "control_after_generate": True, "tooltip": "The random seed used for creating the noise."})`; input table lists range `0 ~ 18446744073709551615` — https://docs.comfy.org/built-in-nodes/KSampler.md (accessed 2026-08-28)
- Practical note worth teaching: `control_after_generate` has `serialize: false`, so it is **not** part of the submitted prompt — it's purely a client-side convenience, and it does nothing if the seed widget has an incoming link.

---

### Q: How do I switch a node off? What's the difference between Ctrl+M and Ctrl+B?

**A:** `Ctrl + M` (`Cmd ⌘ + M`) **mutes** — the node's mode becomes `Never`, it does not execute, and nothing downstream can read anything from it. That branch is dead; downstream nodes will error if they *needed* that input. `Ctrl + B` (`Cmd ⌘ + B`) **bypasses** — the node also doesn't execute, but downstream nodes can still pull the *unprocessed* data through it, so the chain keeps running. The classic example is a LoRA loader: bypass it and the model flows through untouched; mute it and everything after it breaks. Rule of thumb: **bypass** to remove a step from a chain, **mute** to switch off a whole output branch.

**Sources**

- `[OFFICIAL]` "* **Always**: The default node mode. The node will execute whenever it runs for the first time or when any of its inputs change since the last execution; * **Never**: The node will never execute under any circumstances, as if it's been deleted. Subsequent nodes cannot read or receive any data from it; * **Bypass**: The node will never execute under any circumstances, but subsequent nodes can still try to obtain data that hasn't been processed by this node" — https://docs.comfy.org/basic-concepts/nodes.md (accessed 2026-08-28)
- `[OFFICIAL]` Worked LoRA example, same page: "The node set to `Never` mode causes subsequent nodes to show errors because they don't receive any input data. The node set to `Bypass` mode still allows subsequent nodes to receive unprocessed data, so they load the output data from the first `Load LoRA` node, allowing the subsequent workflow to continue running normally"
- `[OFFICIAL]` "you may notice that we currently provide: Always, Never, On Event, On Trigger - four modes, but actually only **Always** and **Never** are effective. **On Event** and **On Trigger** are currently ineffective… Additionally, you can understand **Bypass** as a mode." — same page.
- `[OFFICIAL]` `Ctrl + M | Mute/unmute selected nodes`; `Ctrl + B | Bypass/unbypass selected nodes`; macOS `Cmd ⌘ + M` / `Cmd ⌘ + B`; also `Alt + C` collapse, `Ctrl + G` add frame (group) — https://docs.comfy.org/interface/shortcuts.md (accessed 2026-08-28)
- `[LORE]` **Why shared workflows arrive with muted/bypassed groups:** this is authoring convention, not a documented feature. Authors commonly ship one graph containing several alternative branches (different resolutions, optional upscale/interpolation passes, an image-to-video variant) with all but one branch muted, so a student unmutes the branch they want rather than rebuilding it. I could not find a first-party doc stating this; teach it as a convention with the instruction "look for greyed-out groups before assuming the workflow is broken", and check the workflow author's notes.
- `[OFFICIAL]` Related: ComfyUI also supports deliberately running only part of a graph — see https://docs.comfy.org/interface/features/partial-execution.md

---

### Q: Where did my images and videos go?

**A:** Everything a **Save Image** or **Save Video** node produces lands in `ComfyUI/output/`. Files are named `<filename_prefix>_00001_.png`, with the counter auto-incrementing so nothing is overwritten. Video saved by the core **Save Video** node defaults to the prefix `video/ComfyUI`, i.e. it lands in `output/video/`. Note the difference between **Save Image** and **Preview Image**: Preview Image writes to `ComfyUI/temp/` with a random name and is not a permanent output — if your workflow only has a Preview node, nothing is being saved. You can move the whole output folder with `--output-directory <path>`.

**Sources**

- `[OFFICIAL]` "The SaveImage node saves the images it receives to your `ComfyUI/output` directory. It saves each image as a PNG file and can embed workflow metadata, such as the prompt, into the saved file for future reference." — https://docs.comfy.org/built-in-nodes/SaveImage.md (accessed 2026-08-28)
- `[OFFICIAL]` `output_directory = os.path.join(base_path, "output")`; `temp_directory = os.path.join(base_path, "temp")`; `input_directory = os.path.join(base_path, "input")` — https://raw.githubusercontent.com/Comfy-Org/ComfyUI/master/folder_paths.py (accessed 2026-08-28)
- `[OFFICIAL]` Filename pattern: `file = f"{filename_with_batch_num}_{counter:05}_.png"`, with `counter = max(...)+1` — https://raw.githubusercontent.com/Comfy-Org/ComfyUI/master/nodes.py (accessed 2026-08-28)
- `[OFFICIAL]` `class PreviewImage(SaveImage)` overrides `self.output_dir = folder_paths.get_temp_directory()`, `self.type = "temp"`, `self.prefix_append = "_temp_" + <5 random letters>` — same file. Docs: "designed for creating temporary preview images… saves it to a temporary directory." — https://docs.comfy.org/built-in-nodes/PreviewImage.md
- `[OFFICIAL]` `--output-directory` "Set the ComfyUI output directory. Overrides --base-directory."; `--base-directory` "Set the ComfyUI base directory for models, custom_nodes, input, output, temp, and user directories."; `--temp-directory`, `--input-directory`, `--user-directory` similarly — https://raw.githubusercontent.com/Comfy-Org/ComfyUI/master/comfy/cli_args.py
- `[OFFICIAL]` Core `SaveVideo` default `filename_prefix="video/ComfyUI"` — https://raw.githubusercontent.com/Comfy-Org/ComfyUI/master/comfy_extras/nodes_video.py (accessed 2026-08-28)

---

### Q: How do I change the output filename or put outputs in a subfolder?

**A:** Edit the **filename_prefix** widget on the Save node. Put a slash in it and you get a subfolder: `class3/assignment2` writes to `ComfyUI/output/class3/assignment2_00001_.png`. The prefix also accepts substitution tokens: `%date:yyyy-MM-dd%` for the date, `%width%` / `%height%`, and `%NodeName.widget%` to pull a value from another node — e.g. `%KSampler.seed%` bakes the seed into the filename, which is excellent for classwork you need to trace later. The node name is matched against its `Node name for S&R` property or its title, so if you rename a node in the UI, use the new title. You cannot escape the output folder — `../` paths are rejected.

**Sources**

- `[OFFICIAL]` Widget tooltip: `"filename_prefix": ("STRING", {"default": "ComfyUI", "tooltip": "The prefix for the file to save. This may include formatting information such as %date:yyyy-MM-dd% or %Empty Latent Image.width% to include values from nodes."})` — https://raw.githubusercontent.com/Comfy-Org/ComfyUI/master/nodes.py (accessed 2026-08-28)
- `[OFFICIAL]` Subfolder + escape guard: `subfolder = os.path.dirname(os.path.normpath(filename_prefix))`; `full_output_folder = os.path.join(output_dir, subfolder)`; `if os.path.commonpath(...) != output_dir: err = "**** ERROR: Saving image outside the output folder is not allowed."` — https://raw.githubusercontent.com/Comfy-Org/ComfyUI/master/folder_paths.py (accessed 2026-08-28)
- `[OFFICIAL]` Server-side tokens in `compute_vars`: `%width%`, `%height%`, `%year%`, `%month%`, `%day%`, `%hour%`, `%minute%`, `%second%`; plus `%batch_num%` in `nodes.py` — same files.
- `[OFFICIAL]` Client-side token resolution (this is where `%date:...%` and `%Node.widget%` are expanded): `value.replace(/%([^%]+)%/g, ...)`; `if (split[0].startsWith('date:')) { return formatDate(split[0].substring(5), new Date()) }`; node lookup by `n.properties?.['Node name for S&R'] === split[0]` falling back to `n.title === split[0]`; illegal filename characters in the substituted value are replaced with `_` — https://raw.githubusercontent.com/Comfy-Org/ComfyUI_frontend/main/src/utils/searchAndReplace.ts (accessed 2026-08-28)

---

### Q: I have an image from last week and I want to know what prompt and settings made it. How?

**A:** Drag the file back onto the ComfyUI canvas. ComfyUI embeds the entire workflow inside every file it saves, so dropping the PNG in restores the exact graph — prompt, seed, sampler, steps, model filenames, everything. Two keys are written: `prompt` (the API-format graph the server actually ran) and `workflow` (the visual graph with layout). This works for PNG; animated WEBP stores the same data in EXIF tags, animated PNG in a custom `comf` chunk, and core WEBM/MP4 nodes write it as container metadata. Caveat: it only works for files ComfyUI itself saved — a screenshot, a re-export from Photoshop, or an upload through a service that strips metadata will have nothing to recover. It also fails if the server was started with `--disable-metadata`.

**Sources**

- `[OFFICIAL]` "All images generated by ComfyUI contain metadata including workflow information. You can load workflows by: Dragging and dropping a ComfyUI-generated image into the interface; Using menu **Workflows** -> **Open** to open an image" — https://docs.comfy.org/get_started/first_generation.md (accessed 2026-08-28)
- `[OFFICIAL]` "Images containing workflow JSON in their metadata can be directly dragged into ComfyUI or loaded using the menu `Workflows` -> `Open (ctrl+o)`." — https://docs.comfy.org/tutorials/basic/lora.md (accessed 2026-08-28)
- `[OFFICIAL]` PNG write path: `if not args.disable_metadata: metadata = PngInfo(); metadata.add_text("prompt", json.dumps(prompt)); for x in extra_pnginfo: metadata.add_text(x, json.dumps(extra_pnginfo[x]))` — https://raw.githubusercontent.com/Comfy-Org/ComfyUI/master/nodes.py (accessed 2026-08-28)
- `[OFFICIAL]` The kill switch: `--disable-metadata` "Disable saving prompt metadata in files." — https://raw.githubusercontent.com/Comfy-Org/ComfyUI/master/comfy/cli_args.py
- `[OFFICIAL]` WEBP uses EXIF instead of tEXt: `exif_data[0x0110] = "prompt:{}".format(json.dumps(cls.hidden.prompt))` (EXIF 0x0110 = Model), `inital_exif_tag = 0x010F` (Make); animated PNG uses `metadata.add(b"comf", ...)` — https://raw.githubusercontent.com/Comfy-Org/ComfyUI/master/comfy_api/latest/_ui.py (accessed 2026-08-28)
- `[OFFICIAL]` `SaveWEBM`: `container.metadata["prompt"] = json.dumps(cls.hidden.prompt)`; `SaveVideo`: `if not args.disable_metadata: … metadata["prompt"] = cls.hidden.prompt … video.save_to(..., metadata=saved_metadata)` — https://raw.githubusercontent.com/Comfy-Org/ComfyUI/master/comfy_extras/nodes_video.py (accessed 2026-08-28). **Caveat found:** `SaveWEBM` does *not* check `args.disable_metadata`, so WEBM still carries the prompt even when metadata is meant to be off.
- `[LORE]` **Unverified:** whether the frontend can *read back* a workflow from a core-saved MP4 by drag-and-drop. The write path is confirmed in source; I found no doc confirming the import path for MP4. Teach PNG as the guaranteed method and tell students to keep the `.json` for video work.

---

### Q: Can I run a ComfyUI workflow from another program instead of clicking Run?

**A:** Yes. ComfyUI runs an HTTP server (default `http://127.0.0.1:8188`). You export your workflow as **API format** (`File → Export Workflow (API)`) and `POST` it to `/prompt` as `{"prompt": {...}}`, optionally with a `client_id`. The response gives you a `prompt_id` and queue position. You then poll `GET /history/{prompt_id}` for the results, or connect a WebSocket to `/ws?clientId=<uuid>` for live progress events. Fetch the finished file with `GET /view?filename=...&subfolder=...&type=output`. If your app runs in a browser on a different origin, start ComfyUI with `--enable-cors-header` (bare = allow all, or pass a specific origin).

**Sources**

- `[OFFICIAL]` "`/prompt` | post | submit a prompt to the queue" and "it is posted to `/prompt` which validates the prompt and adds it to an execution queue, returning either a `prompt_id` and `number` (the position in the queue), or `error` and `node_errors` if validation fails." — https://docs.comfy.org/development/comfyui-server/comms_routes.md (accessed 2026-08-28)
- `[OFFICIAL]` Minimal client: `p = {"prompt": prompt}` → `request.Request("http://127.0.0.1:8188/prompt", data=data)` — https://raw.githubusercontent.com/Comfy-Org/ComfyUI/master/script_examples/basic_api_example.py (accessed 2026-08-28)
- `[OFFICIAL]` With progress: `p = {"prompt": prompt, "client_id": client_id}`; `client_id = str(uuid.uuid4())`; `ws.connect(f"ws://{SERVER_ADDRESS}/ws?clientId={client_id}")` — note the POST body uses `client_id` (snake_case) but the WebSocket query param is `clientId` (camelCase) — https://docs.comfy.org/development/comfyui-server/api-examples.md (accessed 2026-08-28)
- `[OFFICIAL]` Other routes: `/history` get "retrieve the queue history"; `/history/{prompt_id}`; `/view` get "view an image"; `/queue` get/post; `/interrupt` post "stop the current workflow execution"; `/upload/image` post; `/free` post "free memory by unloading specified models"; `/object_info` get "retrieve details of all node types"; `/system_stats` get — https://docs.comfy.org/development/comfyui-server/comms_routes.md
- `[OFFICIAL]` Result shape: `history[prompt_id]["outputs"][node_id]["images"]` → each `{"filename","subfolder","type"}`; `/view` params `filename`, `subfolder`, `type` — https://docs.comfy.org/development/comfyui-server/api-examples.md
- `[OFFICIAL]` WS message types: `execution_start`, `execution_error`, `execution_interrupted`, `execution_cached`, `execution_success`, `executing`, `executed`, `progress`, `status`; completion is `executing` with `node` = `None`; `status` carries `exec_info.queue_remaining` — https://docs.comfy.org/development/comfyui-server/comms_messages.md (accessed 2026-08-28)
- `[OFFICIAL]` `--enable-cors-header`: `type=str, default=None, metavar="ORIGIN", nargs="?", const="*", help="Enable CORS (Cross-Origin Resource Sharing) with optional origin or allow all with default '*'."` — https://raw.githubusercontent.com/Comfy-Org/ComfyUI/master/comfy/cli_args.py (accessed 2026-08-28)
- `[OFFICIAL]` `--port` `default=8188` "Set the listen port."; server "automatically starts an HTTP server at `http://127.0.0.1:8188`" — same file and https://docs.comfy.org/development/comfyui-server/comms_overview.md

---

### Q: How do I access ComfyUI from another computer on the network?

**A:** Start it with `--listen` — with no argument that binds `0.0.0.0,::` (all interfaces), or give a specific IP. Then browse to `http://<that machine's IP>:8188`. Two things bite people: the normal in-app login only works from localhost, so for LAN access you need an API key from platform.comfy.org (pass it in the login dialog or via `--api-key`); and firewalls block port 8188 by default. Only do this on a network you trust — exposing ComfyUI gives anyone on that network the ability to run code on your machine.

**Sources**

- `[OFFICIAL]` `--listen`: `type=str, default="127.0.0.1", metavar="IP", nargs="?", const="0.0.0.0,::", help="Specify the IP address to listen on (default: 127.0.0.1). You can give a list of ip addresses by separating them with a comma… If --listen is provided without an argument, it defaults to 0.0.0.0,:: (listens on all ipv4 and ipv6)"` — https://raw.githubusercontent.com/Comfy-Org/ComfyUI/master/comfy/cli_args.py (accessed 2026-08-28)
- `[OFFICIAL]` "**Login Issues When Not on Localhost:** Normal login only works when accessing from localhost. For LAN/remote access: Generate API key at platform.comfy.org/login. Use API key in login dialog or with `--api-key` command line argument." — https://docs.comfy.org/troubleshooting/overview.md (accessed 2026-08-28)
- `[OFFICIAL]` "**Check firewall settings** - Allow ComfyUI through firewall; **Try different port** - Default is 8188, try 8189 or 8190" — same page.
- `[OFFICIAL]` Related security note: `security_level` `normal-` specifically "doesn't allow `high` level risky feature if `--listen` is specified and not starts with `127.`" — https://raw.githubusercontent.com/Comfy-Org/ComfyUI-Manager/main/README.md

---

### Q: The run failed. Where's the actual error message?

**A:** Two places. In the browser, the "Prompt execution failed" dialog has a **Show report** button — click it, that's the real message. In the terminal/console you get the full Python traceback; toggle the log panel with `` Ctrl + ` `` or use the Console button in the bottom-left toolbar. Read the error before changing anything: `Value not in list` means a missing/misnamed model file, `expected input[...] to have 4 channels, but got 16` means you've mixed model families, and `CUDA out of memory` means VRAM. On Comfy Desktop the log files are at `C:\Users\<username>\AppData\Roaming\ComfyUI\logs` on Windows.

**Sources**

- `[OFFICIAL]` "**Symptoms:** 'Prompt execution failed' dialog with 'Show report' button… **Quick fixes:** 1. **Click 'Show report'** - Read the detailed error message to identify the specific issue" — https://docs.comfy.org/troubleshooting/overview.md (accessed 2026-08-28)
- `[OFFICIAL]` `` Ctrl + ` `` = "Toggle log bottom panel" — https://docs.comfy.org/interface/shortcuts.md (accessed 2026-08-28)
- `[OFFICIAL]` "**Bottom Toolbar**: Contains buttons for Help (opens runtime logs), Console (opens runtime logs), Shortcuts…, and Settings" — https://docs.comfy.org/interface/overview.md (accessed 2026-08-28)
- `[OFFICIAL]` Desktop log path: "Log files from: `C:\Users\<username>\AppData\Roaming\ComfyUI\logs` (Windows)" — https://docs.comfy.org/troubleshooting/overview.md
- `[OFFICIAL]` Error-to-cause map: "Value not in list: ckpt_name: 'model-name.safetensors' not in []" (missing model) and "Given groups=1, weight of size [64, 4, 3, 3], expected input[1, 16, 128, 128] to have 4 channels, but got 16 channels instead" with "**Root cause:** Using models from different architecture families together" — https://docs.comfy.org/troubleshooting/model-issues.md
- `[OFFICIAL]` Also check the browser console: "Browser console errors (F12 → Console tab)" — https://docs.comfy.org/troubleshooting/overview.md

---

### Q: How do I stop a generation that's already running?

**A:** `Ctrl + Alt + Enter` (`Cmd ⌘ + Alt + Enter` on macOS) interrupts the current run. From code or another app, `POST /interrupt`. To clear queued-but-not-yet-started jobs, open the Queue sidebar (`Q`) and clear it, or `POST /queue` with the clear operation. If ComfyUI is stuck holding VRAM after you stop, `POST /free` unloads models.

**Sources**

- `[OFFICIAL]` `Ctrl + Alt + Enter | Interrupt`; `Ctrl + Enter | Queue prompt`; `Ctrl + Shift + Enter | Queue prompt (Front)`; `Q | Toggle queue sidebar` — https://docs.comfy.org/interface/shortcuts.md (accessed 2026-08-28)
- `[OFFICIAL]` "`/interrupt` | post | stop the current workflow execution"; "`/queue` | post | manage queue operations (clear pending/running)"; "`/free` | post | free memory by unloading specified models" — https://docs.comfy.org/development/comfyui-server/comms_routes.md (accessed 2026-08-28)
- `[OFFICIAL]` The WS event you'll see is `execution_interrupted` — https://docs.comfy.org/development/comfyui-server/comms_messages.md

---

### Q: I installed the custom node pack but the node is still missing. Why?

**A:** Check three things in order. **(1) Did you restart?** ComfyUI only registers node classes at startup. **(2) Check the startup log for `import failed`** — the pack was cloned but its Python dependencies didn't install, which is the most common cause. Install them into ComfyUI's *own* Python environment, not your system Python. **(3) Check the folder shape.** The pack must be its own directory directly inside `custom_nodes/` — if you unzipped a GitHub ZIP you may have `custom_nodes/Pack-main/` or a doubled `custom_nodes/Pack/Pack/`, and neither is recognised. If the node still fails, it may be incompatible with your ComfyUI version; check the pack's GitHub issues.

**Sources**

- `[OFFICIAL]` "Restart ComfyUI and refresh your browser. Check startup logs for any `import failed` errors" — https://docs.comfy.org/installation/install_custom_node.md (accessed 2026-08-28)
- `[OFFICIAL]` "Dependencies must be installed in your ComfyUI environment - be careful not to mix with your system environment to avoid contamination"; Portable command: `python_embeded\python.exe -m pip install -r ComfyUI\custom_nodes\[node directory]\requirements.txt` — same page.
- `[OFFICIAL]` Symptom list: "'Failed to import' errors in console/logs; **Missing nodes still showing as missing after installation and restart**; ComfyUI crashes or fails to start". Causes: "Custom nodes requiring additional wheels…; Custom nodes using strict dependency versions (e.g. `torch==2.4.1`) while other plugins use different versions…, causing conflicts after installation; Network issues preventing successful dependency installation" — https://docs.comfy.org/troubleshooting/custom-node-issues.md (accessed 2026-08-28)
- `[OFFICIAL]` Folder-shape rule (stated for Manager but applies generally): "decompression occurs in a path such as `ComfyUI/custom_nodes/ComfyUI-Manager-main`. In such cases, [it] may operate, but it won't be recognized… and updates cannot be performed." — https://raw.githubusercontent.com/Comfy-Org/ComfyUI-Manager/main/README.md (accessed 2026-08-28)
- `[OFFICIAL]` Naming caveat worth knowing: "You should no longer assume that the GitHub repository name will match the subdirectory name under `custom_nodes`. The name of the subdirectory… will now use the normalized name from the `name` field in `pyproject.toml`." — same README.
- `[OFFICIAL]` Frontend-side escape hatches if a node reports missing incorrectly: "'Can't Find Custom Node': Disable node validation in ComfyUI settings"; "'Error Toast About Workflow Failing Validation': Disable workflow validation in settings temporarily" — https://docs.comfy.org/troubleshooting/overview.md

---

### Q: Where can I get known-good example workflows to compare against?

**A:** Use the built-in **Templates** browser: click the Templates icon in the sidebar, or **Workflow → Browse Workflow Templates**. These are official, first-party workflows for every natively-supported model, and they must not use third-party nodes, so they always load cleanly. When you open one, ComfyUI checks whether the required models exist and offers download links for the missing ones. If a workflow you were given misbehaves, loading the official template for the same model is the fastest way to see what a correct graph looks like. If templates seem out of date, they ship as a separate pip package (`comfyui-workflow-templates`) that must be updated alongside ComfyUI.

**Sources**

- `[OFFICIAL]` "Click the **Templates** icon in the sidebar to open Workflow Templates. You can also open it from the menu **Workflow** → **Browse Workflow Templates**." — https://docs.comfy.org/interface/features/template.md (accessed 2026-08-28)
- `[OFFICIAL]` "When loading a template, ComfyUI automatically checks whether all required model files exist. If anything is missing, it will prompt you to download the models." — same page.
- `[OFFICIAL]` "For official templates, we require the following: 1. Do not use any third-party nodes (to avoid extra installations for users who lack those nodes)." — same page.
- `[OFFICIAL]` **Important gotcha for students:** "missing-file detection only checks whether there is a file with the same name in the corresponding top-level directory… If you have already downloaded the model into a subfolder such as `ComfyUI/models/diffusion_models/wan_video`, you can ignore the popup and simply ensure the correct model is selected in the corresponding model loader node." — same page.
- `[OFFICIAL]` How the download links are embedded (useful if you're authoring workflows for a class): a `models` array under each node's `properties`, with `name`, `url`, `directory`; "Currently, only links from Hugging Face and Civitai are supported. The model format must be a safe format such as `.safetensors` or `.sft`. Formats like `.gguf` are considered unsafe" — same page.
- `[OFFICIAL]` "Templates are managed and updated as a separate dependency: `comfyui-workflow-templates`" — same page.
- `[OFFICIAL]` "When trying new models, start with the template workflows or official ComfyUI workflow examples before customizing" — https://docs.comfy.org/troubleshooting/model-issues.md

---

### Q: How do I add a LoRA to a workflow?

**A:** Put the `.safetensors` file in `ComfyUI/models/loras/`, add a **Load LoRA** node, and wire it *between* your checkpoint loader and everything downstream: `model` and `clip` in from the loader, `model` and `clip` out to the sampler and the text encoders. Pick the file in `lora_name`, then tune `strength_model` (how strongly it bends the image model) and `strength_clip` (how strongly it bends the text understanding). To stack LoRAs, chain multiple Load LoRA nodes in series. All LoRA variants — Lycoris, loha, lokr, locon — load the same way. Handy trick: `Ctrl + B` on a Load LoRA node bypasses it so you can A/B the effect without rewiring.

**Sources**

- `[OFFICIAL]` "Download the blindbox_V1Mix.safetensors file and put it in your `ComfyUI/models/loras` folder."; "Models in the `ComfyUI\models\loras` folder will be detected by ComfyUI and can be loaded using this node." — https://docs.comfy.org/tutorials/basic/lora.md (accessed 2026-08-28)
- `[OFFICIAL]` Input table: `model` "Connect to the base model"; `clip` "Connect to the CLIP model"; `lora_name` "Select the LoRA model to load and use"; `strength_model` "Affects how strongly the LoRA influences the model weights; higher values make the LoRA style stronger"; `strength_clip` "Affects how strongly the LoRA influences the CLIP text embeddings" — same page.
- `[OFFICIAL]` "This node supports chain connections, allowing multiple `Load LoRA` nodes to be linked in series to apply multiple LoRA models." — same page; see also https://docs.comfy.org/tutorials/basic/multiple-loras.md
- `[OFFICIAL]` "We will demonstrate how to use a LoRA model. All LoRA variants: Lycoris, loha, lokr, locon, etc... are used in the same way." — same page.
- `[OFFICIAL]` `class LoraLoader` reads `folder_paths.get_filename_list("loras")` — https://raw.githubusercontent.com/Comfy-Org/ComfyUI/master/nodes.py
- `[OFFICIAL]` Bypass-a-LoRA is the docs' own worked example of Bypass mode — https://docs.comfy.org/basic-concepts/nodes.md

---

### Q: Does ComfyUI need an internet connection? Is my work being uploaded anywhere?

**A:** No, and no — local generation runs entirely on your machine. ComfyUI core does not download anything unless you ask it to (clicking a model download prompt, installing a custom node, using the Templates browser). The exceptions are the optional **Partner / API nodes**, which are paid cloud services that *do* send your inputs to a third party; those are clearly separate nodes and require an account and credits. If you need a hard guarantee for a classroom, launch with `--disable-api-nodes`, which disables those nodes and stops the frontend talking to the internet at all.

**Sources**

- `[OFFICIAL]` "Runs fully offline: core does not download anything unless you request it. Use `--disable-api-nodes` to disable the optional paid Comfy API nodes and force all built-in functionality to stay offline." — https://raw.githubusercontent.com/Comfy-Org/ComfyUI/master/README.md (accessed 2026-08-28)
- `[OFFICIAL]` `--disable-api-nodes` "Disable loading all api nodes. Also prevents the frontend from communicating with the internet." — https://raw.githubusercontent.com/Comfy-Org/ComfyUI/master/comfy/cli_args.py (accessed 2026-08-28)
- `[OFFICIAL]` Partner nodes are paid and account-gated: "Check API key validity - Verify keys in user settings; Check account credits - Ensure sufficient API credits" — https://docs.comfy.org/troubleshooting/overview.md (accessed 2026-08-28). Data-handling terms: https://docs.comfy.org/tutorials/partner-nodes/data-retention.md
- `[OFFICIAL]` Manager also has an offline mode: `network_mode = public|private|offline` — https://raw.githubusercontent.com/Comfy-Org/ComfyUI-Manager/main/README.md

---

### Q: How do I send my workflow to a classmate or hand it in?

**A:** `Ctrl + S` saves it into your local workflow list; use **Workflows → Export** to write a `.json` you can attach to an email or upload. Anything you generated also carries the workflow inside it, so sending the PNG is often enough. Two things to include alongside the file so the recipient can actually run it: the **exact model filenames** you used (the workflow stores filenames as text and won't find differently-named copies), and the **list of custom node packs** the workflow needs. If your grader has ComfyUI-Manager, the missing-node prompt will handle the second one for them.

**Sources**

- `[OFFICIAL]` "You can export workflows using menu **Workflows** -> **Export**." — https://docs.comfy.org/get_started/first_generation.md (accessed 2026-08-28)
- `[OFFICIAL]` `Ctrl + S | Save workflow` — https://docs.comfy.org/interface/shortcuts.md
- `[OFFICIAL]` Bug-report guidance that doubles as a handoff checklist: "List of installed custom nodes; Workflow file (.json) that reproduces the issue" — https://docs.comfy.org/troubleshooting/overview.md (accessed 2026-08-28)
- `[OFFICIAL]` Missing-node prompt on the recipient's side — https://docs.comfy.org/manager/pack-management.md

---

### Q: What hardware do I actually need? Does it work on a Mac or an AMD card?

**A:** Yes to both, with caveats. NVIDIA on Windows/Linux is the best-supported path (install PyTorch with CUDA 13.0). Apple Silicon works via PyTorch's MPS backend — ComfyUI does not use MLX. AMD works well on Linux with ROCm 7.2; on Windows AMD support is experimental and limited to RDNA 3/3.5/4 cards. Intel Arc works through PyTorch's XPU backend (do **not** install a CUDA wheel — the "Torch not compiled with CUDA enabled" error on Intel means XPU wasn't found, not that you need CUDA). Python 3.13 is recommended; use Chrome 143+ for the UI. Note that fp8 model variants — the main VRAM saver — need a 40-series or newer NVIDIA GPU to run fast.

**Sources**

- `[OFFICIAL]` "**NVIDIA GPU** - Install stable pytorch with CUDA 13.0"; "**AMD GPU (Linux)** - ROCm 7.2 stable or nightly"; "**AMD GPU (Windows/Linux, RDNA 3/3.5/4 only)** - Experimental support for RX 7000 series (RDNA 3), Strix Halo/Ryzen AI Max+ 365 (RDNA 3.5), and RX 9000 series (RDNA 4)"; "**Intel GPU** - Arc series with native PyTorch torch.xpu support"; "**Apple Silicon** - M1/M2/M3/M4 series with Metal acceleration"; "**CPU** - Use the `--cpu` parameter (slower)" — https://docs.comfy.org/installation/system_requirements.md (accessed 2026-08-28)
- `[OFFICIAL]` "**Python 3.13** is very well supported and recommended… Python 3.12 is a good fallback if you have trouble with some custom node dependencies on 3.13" — same page.
- `[OFFICIAL]` "For the best experience, use **Google Chrome version 143 or later**. Earlier versions of Chrome (142 and below) have known issues that can cause visual glitches and performance problems in ComfyUI." — same page.
- `[OFFICIAL]` "ComfyUI does not use MLX directly. On Apple Silicon (M1/M2/M3/M4) Macs, ComfyUI uses PyTorch with the **MPS (Metal Performance Shaders)** backend" — same page.
- `[OFFICIAL]` Intel trap: "On Intel GPUs this error means ComfyUI tried to use CUDA because the XPU backend was not available. Do not follow the NVIDIA CUDA reinstallation steps above. Intel GPUs use XPU, not CUDA." — https://docs.comfy.org/troubleshooting/overview.md (accessed 2026-08-28)
- `[OFFICIAL]` Desktop-specific: "Comfy Desktop Windows only supports NVIDIA GPUs with CUDA. Use ComfyUI Portable or manual installation for other GPUs" — same page.
- `[STAFF]` fp8 support by GPU generation — https://raw.githubusercontent.com/wiki/comfyanonymous/ComfyUI/Which-GPU-should-I-buy-for-ComfyUI.md (accessed 2026-08-28)

---

## Couldn't find a reliable answer

Items I actively looked for and could **not** substantiate from a first-party source. Do not put these in the tutor as fact.

1. **The Krea 2 ">600 token" prompt cliff.** Checked https://docs.comfy.org/tutorials/image/krea/krea-2.md, https://raw.githubusercontent.com/krea-ai/krea-2/main/README.md, https://raw.githubusercontent.com/krea-ai/krea-2/main/docs/prompting.md, and ComfyUI's `comfy/text_encoders/krea2.py`. No token cap, no max sequence length, no degradation threshold anywhere. The official prompting guide points the other way: "Long detailed prompts yield best results, but the model is capable of generating high quality images with minimal prompt engineering." The encoder is a 12-layer tap of Qwen3-VL-4B with no truncation logic. **Verdict: unsupported; treat as community lore until someone reproduces it.**
2. **"Wrong VAE silently produces a black image."** The documented failure mode for a family mismatch is a *tensor-shape error at VAE Decode*, not silent black output. The verified black-image mechanisms are fp16 VAE overflow, xformers 0.0.18, and macOS 14.5+.
3. **`sdxl_vae_fp16_fix` by name.** No Comfy-Org doc or source line references it. The generic `--fp16-vae` → black images warning is verified; the SDXL-specific fix is not.
4. **An A1111-style "NaNs were produced" message or `--disable-nan-check` flag in ComfyUI.** These strings do not exist in `cli_args.py`, `model_management.py` or `sd.py`. That's an Automatic1111 feature. **Actively refuted — remove if present in the knowledge bank.**
5. **"CFG > 1 on a distilled model burns/blanks the output" as an official ComfyUI statement.** Neither the Flux nor the Z-Image-Turbo tutorial page states a CFG value at all. The strongest first-party evidence is Krea's own `--cfg 0.0` reference command and the existence of `FluxDisableGuidance`. Teach it as model-author guidance, not ComfyUI doctrine.
6. **Whether the "Enable Dev mode Options" setting is still required to see Export (API).** Current docs present `File → Export Workflow (API)` unconditionally; I found no dev-mode toggle. Likely obsolete but unconfirmed.
7. **Right-click canvas → Add Node → category submenu.** Not documented on any current docs.comfy.org page, and the frontend is mid-migration to Nodes 2.0. Needs in-app testing to confirm for a given version.
8. **Whether dragging a core-ComfyUI-saved MP4 back in restores the workflow.** The metadata *write* path is confirmed in `nodes_video.py`; no doc confirms the read/import path.
9. **What ComfyUI-Manager's missing-node detection does internally** (how class names map to packages, whether `extension-node-map.json` drives it, and whether a restart is required). The Manager README describes only the user-visible button. The restart requirement is documented for manual installs, not for the Manager flow.
10. **A published minimum system RAM requirement.** None exists. https://docs.comfy.org/installation/system_requirements.md lists OS, Python, browser and GPU only.
11. **An official warning against "Update All" in the Manager.** Not found; snapshots are the documented mitigation.
12. **Whether swapping Wan 2.2's high-noise and low-noise models produces garbage.** https://docs.comfy.org/tutorials/video/wan/wan2_2.md documents the correct wiring but says nothing about the failure mode.
13. **ComfyUI-Manager's own version number and its minimum ComfyUI version.** The README states neither. The only version boundary given is a path change at ComfyUI `v0.3.76+` (`<USER_DIRECTORY>/__manager/` vs `<USER_DIRECTORY>/default/ComfyUI-Manager/`).

### Documentation defects found (worth flagging to students)

- **Wan 2.2 I2V step list is wrong.** The numbered steps instruct loading `wan2.2_t2v_high_noise_14B_fp8_scaled.safetensors` while the page's own download cards list `wan2.2_i2v_high_noise_14B_fp16.safetensors`. A student following the steps for image-to-video loads text-to-video weights. — https://docs.comfy.org/tutorials/video/wan/wan2_2.md (accessed 2026-08-28)
- **`--cache-ram` inactive-threshold default disagrees between docs and source.** https://docs.comfy.org/development/comfyui-server/startup-flags.md says 96 GB; `cli_args.py` says "inactive 100% of system RAM (max 128GB)". Trust the source.
- **`SaveWEBM` ignores `--disable-metadata`.** It writes `container.metadata["prompt"]` unconditionally, unlike `SaveImage` and `SaveVideo`. — https://raw.githubusercontent.com/Comfy-Org/ComfyUI/master/comfy_extras/nodes_video.py
- **Empty doc pages.** `https://docs.comfy.org/manager/missing-nodes.md`, `https://docs.comfy.org/built-in-nodes/nodes/image/save-image.md` and `https://docs.comfy.org/built-in-nodes/nodes/sampling/ksampler.md` return empty. The working node-doc paths are the flat form: `https://docs.comfy.org/built-in-nodes/SaveImage.md`, `https://docs.comfy.org/built-in-nodes/KSampler.md`.
- **`troubleshooting/overview.md` is stale on Python.** It says "Check Python version (3.9+ required, 3.12 recommended)" while `system_requirements.md` says 3.13 is recommended.
