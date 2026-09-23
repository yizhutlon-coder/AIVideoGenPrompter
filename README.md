# AI Video Gen Prompter — Prompt Studio

An **offline teaching toolkit** for local AI video and image generation. Describe a shot once in plain language and get it translated into the native prompt dialect of **13 local models** — format-checked against official rules, explained by a built-in tutor, and exportable as ready-wired ComfyUI workflows where a verified template is bundled.

The launchers run the app on your own machine through [Ollama](https://ollama.com), with Ollama cloud features disabled. The app itself has no accounts or telemetry; after a one-time model download it works with Wi-Fi off.

| Video | Image |
|---|---|
| Wan 2.2 (T2V + I2V dialects) | SDXL (photoreal + anime-tag dialects) |
| LTX 2.3/2.5 | Flux (FLUX.1 / FLUX.2 klein) |
| MiniMax H3 (+ full-reference mode) | Z-Image Turbo/Base |
| SCAIL-2 | Qwen-Image 2512 |
| | Qwen-Image 2.1 (generation, editing, multi-reference, RGBA) |
| | Krea 2 |

Each model wants a *different* prompt language — keyword formulas, cinematic prose, timeline schemas with speaker IDs, Danbooru tags, native Chinese. That difference is the whole subject this app teaches.

## ⬇ Download — no GitHub knowledge needed

**[Click here to download everything as one ZIP](https://github.com/yizhutlon-coder/AIVideoGenPrompter/archive/refs/heads/main.zip)** (~3 MB — no AI models inside; the app downloads its LLM itself with a progress bar).

1. Open the downloaded ZIP → **Extract All** to anywhere (Desktop is fine).
2. Open the extracted folder → double-click **`!START HERE.bat`** (it sorts to the top of the folder — there is no .exe; this IS the program).
3. Follow the 3-step wizard on screen. Done.

That link always gives the newest version. Prefer a frozen snapshot? Use the [v1.0 release ZIP](https://github.com/yizhutlon-coder/AIVideoGenPrompter/archive/refs/tags/v1.0.zip) — its checksums are pinned in that snapshot's `docs/SHA256SUMS.txt`.

New work is saved on review branches before it reaches `main`. See [Versioning and review workflow](docs/VERSIONING.md) for checkpoints, checks, and release tags.

## Privacy first

This project exists for people who run AI locally *because* they care where their data goes. Accordingly:

- **Local connections only.** The launcher serves the app page on `127.0.0.1:8765`; it talks to Ollama on loopback port 11434 and can optionally read your local ComfyUI model list on port 8188. It makes no telemetry, analytics, update, or CDN requests.
- **Fully offline after setup.** Internet is used exactly twice, both at your initiative: installing Ollama and downloading an LLM. After that, turn Wi-Fi off — everything works. That test *is* the proof; run it.
- **Browser-owned storage.** History, pins, project context, and H3 autosaves live in your browser's local site data for `127.0.0.1:8765`; this is not an app-owned data folder. The app does not upload or sync them. Your browser profile, extensions, backups, and anyone with access to that profile may be able to read them. Use Settings → Export saved data to keep a local backup.
- **Auditable by design.** One readable HTML file, no build step, no minification — search it for `http` yourself (see [Verifying your copy](#verifying-your-copy-is-authentic)). The in-app footer repeats these audit instructions so they travel with every copy.
- **Restricted launcher:** it no longer sets `OLLAMA_ORIGINS=*`. On Windows it removes that wildcard from the user environment if an older Prompt Studio launcher saved it. It restarts Ollama bound to `127.0.0.1` with `OLLAMA_NO_CLOUD=1`, and the app hides cloud model entries. Another local app or browser page on a localhost origin may still reach Ollama under Ollama's own default rules; keep Ollama and your browser updated.

---

## Quick start (Windows)

1. **Install [Ollama](https://ollama.com/download)** — one time, normal system install.
2. **Double-click `!START HERE.bat`** (same as `Start-PromptStudio.bat`). It starts Ollama and a page server bound to your computer only, then opens `http://127.0.0.1:8765/PromptStudio.html` in your browser. There is no app .exe. (Mac/Linux: `start-promptstudio.sh`, which also requires Python 3.)
3. **First run only:** the app shows a 3-step wizard. Click **Download Qwen 7B** (4.7 GB, progress bar in-app) — or the 3B option for weaker laptops. No terminal, ever.

That's it. Every run after: double-click the launcher, type an idea, hit **Translate**.

**Updating from the older `file://` launcher?** Browser storage has a separate origin for the new localhost page. Before switching, open `PromptStudio.html` directly from the same folder/path as before, use Settings → **Export saved data**, then launch the new version and use Settings → **Import saved data**. This carries history, pins, context, LoRA notes, and any H3 autosaves in that same browser origin. For an H3 Studio project opened as a separate local file, use its **Save .json** button in the old version and **Open** in the new version; browsers can isolate storage for different `file://` pages. The old browser data is not deleted automatically. Keep exported JSON private; it contains your prompts and project text.

### About the model download (what/where/why)

- The download is the **local LLM that rewrites your prompts** (Qwen 2.5 7B recommended — it's the only catalog model that writes idiomatic Chinese, which the Alibaba-family models want). It is *not* the video/image models themselves — those live in your ComfyUI install.
- It's stored by Ollama in your user profile (`~/.ollama`), **not** in this folder — so the folder stays small and shareable.
- Want other LLMs? **⚙ Models** in the app header: one-click installs from a curated catalog, or paste any ollama.com / HuggingFace link and it pulls automatically. Anything Ollama serves works; the app's expertise lives in its prompts, not the model.
- After downloading, the whole app works **fully offline** — the cleanest way to verify the privacy story is to turn Wi-Fi off and use it.

---

## What's in the app

- **Translate** — one idea in, per-model dialect out. Short ideas use a simple, literal prompt by default; detailed requests use the local model. Turn on **Suggest details (editable template)** to let the local model add optional scene ideas; the app shows those suggestions separately and lets you edit them as a new input. Four examples demonstrate simple action, detailed images, timed video, and H3 references, selecting the matching targets when clicked. Qwen-Image 2.1 has its own target for generation, editing, up to 10 ordered references, and transparent RGBA output; it stays separate from Qwen-Image 2512 because their negative, reference, and workflow rules differ. Output language: Auto / EN / 中文. For an English result from Wan T2V, Wan I2V, Z-Image, or Qwen-Image 2512, click **中文版本** to generate a separately checked Chinese version while keeping the English original. **📋 Project context** is visible by default and stores persistent invariants ("my fishing-village game: painterly, muted palette") applied to every translation.
- **Format checker** — every output is validated against that model's official rules (✓ / ⚠ with one-click **Fix**). Catches things like negative prompts on CFG-free models, Wan camera-verb mistakes, H3 timeline violations.
- **⬇ WF (workflow export)** — turns a translated prompt into a ready-wired **ComfyUI workflow JSON**: verified official Comfy-Org templates, your prompt injected, correct sampler recipes, resolution/duration/seed controls, optional LoRAs (with an embedded strength/trigger-word checklist note, and auto step-bumps on distilled models). Drag the file onto the ComfyUI canvas — no node wiring. Optional one-time link-up: paste your ComfyUI's `/object_info` page into the export dialog and it learns your *actual installed* model files — LoRA boxes autocomplete your real filenames, typos get flagged, and exports warn when a template's default model isn't installed (ComfyUI fails silently on wrong filenames). The dialog also keeps a **trigger-word notebook**: save a LoRA's trigger words once (from its model card) and they reappear next to that LoRA forever after — with a one-click option to prepend them to the exported prompt, so a LoRA never silently underperforms for want of its trigger. No ComfyUI flags or plugins needed; nothing leaves your machine.
- **💬 Ask** — an offline tutor grounded in a research-verified knowledge bank (evidence-graded, updated weekly): prompt techniques, model comparisons, ComfyUI troubleshooting, LoRA setup. Conversations are continuous within a session.
- **🗺 Picker** — pick your GPU VRAM + task, see which of 21 models fit (comfortable/tight/too big), with ease ratings, license warnings, and what each excels at.
- **🧠 Gotchas** — 40+ myth-vs-reality cards for the misconceptions that trip everyone ("negative prompts work everywhere", "(word:1.3) is portable", "longer prompts are better"…). A random one appears as a footer tip each launch.
- **🎛 H3 Builder** — hand-craft MiniMax H3 prompts in the official dialect: all five modes, reference-tag budget simulator (arrival-order rules!), toolbar inserters, live rule checking. Deliberately simple — it's the learning tool. Also standalone in `tools/`.
- **🧭 Walk me through it** — guided, AI-free prompt assembly for creating still images, editing images, Wan image-to-video motion, and MiniMax H3 reference video. The new image path structures subjects, relationships, scene, layout, lighting, style, and exact visible text for Qwen-Image 2.1, Z-Image Turbo, Flux, or SDXL; Qwen can request transparent RGBA, while SDXL receives a checkpoint-specific negative prompt. Canvas shape is shown as a generator setting, separate from the copyable prompt. For H3, name on-screen subjects, assign picture sources, and add actions or exact dialogue at specified seconds; a separate choice controls whether a timed beat starts a new shot. Actor choices include tagged subjects, Everyone, and custom text. Group speech uses combined speaker IDs. Preview and copy the result, then optionally press **Check with selected AI** to ask the configured local Ollama model for an advisory comparison with your filled fields. The check never edits the prompt and cannot inspect reference files. Connect the named files in your generator workflow. H3 drafts can pass to H3 Builder, which offers a one-step restore of the previous draft. Also standalone as `tools/WalkThrough.html` (AI checking uses the main app).
- **🎬 H3 Studio** — the advanced H3 workbench. Describe a simple video in plain language for a literal project, or use a local LLM for complex setup and later edits ("make shot 2 slower", "add rain sounds"). Each AI change is backed up first, so Restore previous is your undo. It has autosaved projects, JSON save/load, one clear job per reference, a timeline x-ray with duration and dialogue checks, camera checks, and **→ locate** buttons for findings. Its beat counts use an optional MiniMax product-ad planning guide, not a universal H3 limit. The reference guide distinguishes reusable subjects from frame-anchor pictures and whole-video sources; see the in-app cheat sheet. Also standalone in `tools/`.
- **🎞 Clips** — pick exact-second windows from reference videos for H3's 15s budget; copies a frame-accurate ffmpeg command. Also standalone in `tools/`, with drag-and-drop `ClipChopper.bat` for bulk splitting.
- **🔎 Meta Inspector** — answers "which one worked?" after a big batch, lets you recreate or tweak a successful output, and gives two machines with the same models a way to swap complete recipes (good for teaching). Drop any ComfyUI output (PNG, WebP, MP4/MOV, WebM/MKV, `.latent`, or a workflow `.json`) anywhere on the page and read the recipe ComfyUI embedded in it: the exact positive/negative prompt, model files, LoRAs with strengths, seed/steps/CFG/sampler, canvas size and frame count, custom node packs required, and the full workflow (downloadable as `.json` to drag into ComfyUI). Detects the model family and offers one-click **Send prompt → Translate** (selects the matching target), **→ Reload settings into workflow export** (prompt, seed, steps, CFG, resolution, duration and LoRAs pre-filled — edit one thing and re-export), and a **📦 Recipe bundle** ZIP (`workflow.json` + `api-prompt.json` + a plain `recipe.txt` listing models, LoRAs, packs and settings + the original file) for sharing through chat apps that would strip the image. Reads A1111/Forge `parameters` too. Parsing happens entirely in your browser. Also standalone in `tools/`.
  **Limitations, plainly:** it only works on the *original file* — copy-pasted images, screenshots, and anything posted through Discord/Reddit/X/Instagram/messengers (or right-click-saved from Civitai instead of its Download button) are re-encoded and carry nothing; files made with `--disable-metadata` carry nothing; the metadata holds model/LoRA/input *filenames*, never the weights, the input pixels, or the custom nodes, so reproducing a result still needs the same files; trigger words are only present if they were typed into the prompt; positive/negative labels and settings are inferred from the graph (reliable for core nodes, best-effort for exotic custom ones — the raw JSON is always shown); and none of it is a signature — it proves nothing about who made a file.
  **Large files:** Meta Inspector reads files up to 256 MB normally; for larger files it scans only the first and last 12 MB to avoid exhausting browser memory. Metadata elsewhere may be missed.
- **🧵 Clip Stitcher** — chain 5–15s generations into one long video with invisible cuts. The workflow: export a clip's **last frame** as a PNG (one click), use it as the next generation's I2V/start image, repeat — then drop all clips in and get the exact ffmpeg concat command. It drops the duplicated seam frame of every clip after the first (and trims audio by exactly one frame alongside, so nothing drifts), warns on resolution mismatches, offers hard-cut or fade audio seams, and can emit a double-clickable `StitchClips.bat`. Also standalone in `tools/`. Honest caveat: chained I2V drifts slightly in color over many hops — that's the model, not the stitch; frame-exact PNGs keep it minimal.
- **📌 Pins / History / Split view** — pin outputs to a board (shared across split panes), 40-entry history, and a two-workspace split screen for e.g. image-gen on the left, image-to-video on the right.
- **🌓 Theme** — Auto (follows OS) / Dark / Light, synced across all tools.

## The portable packager (standalone USB version)

Turn the folder into a **zero-install kit** that runs on any Windows machine — classroom-ready:

1. On a machine that already has the LLM downloaded: **double-click `Make-Portable.bat`** (needs internet once). It downloads the official portable Ollama runtime into `runtime/` (~1 GB), checks archive paths and Ollama's Windows publisher signature, and copies your downloaded LLMs into `models/` (a few GB).
2. **Copy the whole folder** to a USB stick or any machine.
3. There: **double-click `Start-Portable.bat`.** No install, no admin, no internet — runtime and models travel with the folder. If no model was copied, the app's Download button pulls one onto the stick.

Tips: USB 3.0 (or copy-to-disk first) loads models much faster; use the 3B model for weak laptops. `runtime/` and `models/` are gitignored — they belong on the stick, never in the repo.

## Folder map

```
!START HERE.bat          double-click this to run (Windows)
PromptStudio.html        the main app page (open through the launcher for local model access)
Start-PromptStudio.bat   the launcher !START HERE calls  ·  start-promptstudio.sh (Mac/Linux)
Launch-PromptStudio.ps1  Windows launcher logic  ·  Serve-PromptStudio.ps1 local page server
serve-promptstudio.py    Mac/Linux local page server (Python 3)
Make-Portable.bat        build the standalone USB kit
Start-Portable.bat       run the standalone kit (zero install)
tools/                   standalone versions of the in-app tools
  H3Builder.html         hand-crafted H3 prompts (simple)  ·  H3Studio.html  advanced H3 workbench
  ClipPicker.html        exact-second clip windows
  MetaInspector.html     read the prompt / LoRAs / seed / workflow embedded in any ComfyUI output
  ClipStitcher.html      chain clips into one long video (last-frame refs + seam-exact concat)
  ClipChopper.bat        drag-and-drop bulk video splitter (needs ffmpeg)
docs/                    privacy handout (PDF), checksums, research plan, design brief
research/                the evidence-graded research corpus behind the app
  digests/               weekly research digests (what changed, what contradicts)
  _addenda/              deep-dives, sweeps, verified ComfyUI template ground-truth
```

## How the knowledge stays current

The app's system prompts, knowledge bank, gotchas, and validators are compiled from a research corpus where **every claim carries an evidence grade** (`[OFFICIAL]` / `[STAFF]` / `[TESTED]` / `[LORE]`) and a source URL. A weekly automated sweep (Chinese + Western sources) produces digests in `research/digests/`; corrections get folded in — including corrections *to our own claims* (see the digests' errata). If you find the app teaching something wrong, that pipeline is how it gets fixed.

## Verifying your copy is authentic

This app's biggest safety property is that it is **auditable in two minutes**. If you got these files anywhere other than the official repo (https://github.com/yizhutlon-coder/AIVideoGenPrompter), verify before running:

1. **The network audit.** The app's automatic requests should target only loopback: its own page server on `127.0.0.1:8765`, Ollama on port 11434, and optional ComfyUI discovery on `127.0.0.1:8188`. Documentation links and explicit model downloads can contact the internet when you choose them. Any other endpoint in a fetch/XHR is a red flag.
2. **The live check.** Open the app, press F12 → Network tab, use it. Automatic requests should stay on those loopback addresses. Then turn Wi-Fi off — translation with already downloaded local models should still work.
3. **The checksum check.** Compare your files against `docs/SHA256SUMS.txt` from the official repo: Windows `certutil -hashfile PromptStudio.html SHA256`, Mac/Linux `shasum -a 256 PromptStudio.html`. Maintainers regenerate them with `node Update-Checksums.mjs` before each release. They are computed over the files **as GitHub serves them (LF line endings)** — the ZIP download and `git show` match directly. If you cloned with Git on Windows, `core.autocrlf` may have rewritten line endings to CRLF and every hash will differ; verify against the ZIP, or run `git show HEAD:PromptStudio.html | shasum -a 256` (Git Bash) instead.

Forks are welcome under Apache 2.0 — but the license requires modified files to carry prominent change notices, and this project's name may not be used to endorse modified versions (see LICENSE §4(b), §6, and NOTICE). A copy that claims to be Prompt Studio but fails the audit above is not this project. Report impersonating or malicious forks via GitHub's report-abuse and DMCA processes — the change-notice clause is what makes those reports stick.

## Contributing / adapting

Each model's dialect lives in the `TARGETS` object in `PromptStudio.html` (system prompt + worked examples); the tutor's knowledge in `KNOWLEDGE`; misconceptions in `GOTCHAS`; workflow templates in `WF_TEMPLATES` (verified official JSONs — see `research/_addenda/comfy-templates/INDEX.md` for the parameterization ground truth). Everything is a single readable file — reading it is a legitimate class exercise.
