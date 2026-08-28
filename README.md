# AI Video Gen Prompter — Prompt Studio

An **offline teaching toolkit** for local AI video and image generation. Describe a shot once in plain language and get it translated into the native prompt dialect of **12 local models** — format-checked against official rules, explained by a built-in tutor, and exportable as ready-wired ComfyUI workflows.

Everything runs on your own machine through [Ollama](https://ollama.com). No accounts, no cloud, no telemetry — prompts never leave your computer, and after a one-time model download it works with Wi-Fi off.

| Video | Image |
|---|---|
| Wan 2.2 (T2V + I2V dialects) | SDXL (photoreal + anime-tag dialects) |
| LTX 2.3/2.5 | Flux (FLUX.1 / FLUX.2 klein) |
| MiniMax H3 (+ full-reference mode) | Z-Image Turbo/Base |
| SCAIL-2 | Qwen-Image 2512 |
| | Krea 2 |

Each model wants a *different* prompt language — keyword formulas, cinematic prose, timeline schemas with speaker IDs, Danbooru tags, native Chinese. That difference is the whole subject this app teaches.

---

## Quick start (Windows)

1. **Install [Ollama](https://ollama.com/download)** — one time, normal system install.
2. **Double-click `Start-PromptStudio.bat`.** It starts Ollama with the right settings and opens the app. (Mac/Linux: `start-promptstudio.sh`.)
3. **First run only:** the app shows a 3-step wizard. Click **Download Qwen 7B** (4.7 GB, progress bar in-app) — or the 3B option for weaker laptops. No terminal, ever.

That's it. Every run after: double-click the launcher, type an idea, hit **Translate**.

### About the model download (what/where/why)

- The download is the **local LLM that rewrites your prompts** (Qwen 2.5 7B recommended — it's the only catalog model that writes idiomatic Chinese, which the Alibaba-family models want). It is *not* the video/image models themselves — those live in your ComfyUI install.
- It's stored by Ollama in your user profile (`~/.ollama`), **not** in this folder — so the folder stays small and shareable.
- Want other LLMs? **⚙ Models** in the app header: one-click installs from a curated catalog, or paste any ollama.com / HuggingFace link and it pulls automatically. Anything Ollama serves works; the app's expertise lives in its prompts, not the model.
- After downloading, the whole app works **fully offline** — the cleanest way to verify the privacy story is to turn Wi-Fi off and use it.

---

## What's in the app

- **Translate** — one idea in, per-model dialect out, streaming live. Output language: Auto / EN / 中文 (Auto picks native Chinese where it measurably wins). **📋 Project context** stores persistent invariants ("my fishing-village game: painterly, muted palette") applied to every translation.
- **Format checker** — every output is validated against that model's official rules (✓ / ⚠ with one-click **Fix**). Catches things like negative prompts on CFG-free models, Wan camera-verb mistakes, H3 timeline violations.
- **⬇ WF (workflow export)** — turns a translated prompt into a ready-wired **ComfyUI workflow JSON**: verified official Comfy-Org templates, your prompt injected, correct sampler recipes, resolution/duration/seed controls, optional LoRAs (with an embedded strength/trigger-word checklist note, and auto step-bumps on distilled models). Drag the file onto the ComfyUI canvas — no node wiring.
- **💬 Ask** — an offline tutor grounded in a research-verified knowledge bank (evidence-graded, updated weekly): prompt techniques, model comparisons, ComfyUI troubleshooting, LoRA setup. Conversations are continuous within a session.
- **🗺 Picker** — pick your GPU VRAM + task, see which of 21 models fit (comfortable/tight/too big), with ease ratings, license warnings, and what each excels at.
- **🧠 Gotchas** — 40+ myth-vs-reality cards for the misconceptions that trip everyone ("negative prompts work everywhere", "(word:1.3) is portable", "longer prompts are better"…). A random one appears as a footer tip each launch.
- **🎛 H3 Builder** — hand-craft MiniMax H3 prompts in the official dialect: all five modes, reference-tag budget simulator (arrival-order rules!), toolbar inserters, live rule checking. Also standalone as `H3Builder.html`.
- **🎞 Clips** — pick exact-second windows from reference videos for H3's 15s budget; copies a frame-accurate ffmpeg command. Also standalone as `ClipPicker.html` + drag-and-drop `ClipChopper.bat` for bulk splitting.
- **📌 Pins / History / Split view** — pin outputs to a board (shared across split panes), 40-entry history, and a two-workspace split screen for e.g. image-gen on the left, image-to-video on the right.
- **🌓 Theme** — Auto (follows OS) / Dark / Light, synced across all tools.

## The portable packager (standalone USB version)

Turn the folder into a **zero-install kit** that runs on any Windows machine — classroom-ready:

1. On a machine that already has the LLM downloaded: **double-click `Make-Portable.bat`** (needs internet once). It downloads the official portable Ollama runtime into `runtime/` (~1 GB) and copies your downloaded LLMs into `models/` (a few GB).
2. **Copy the whole folder** to a USB stick or any machine.
3. There: **double-click `Start-Portable.bat`.** No install, no admin, no internet — runtime and models travel with the folder. If no model was copied, the app's Download button pulls one onto the stick.

Tips: USB 3.0 (or copy-to-disk first) loads models much faster; use the 3B model for weak laptops. `runtime/` and `models/` are gitignored — they belong on the stick, never in the repo.

## Folder map

```
PromptStudio.html        the main app (single file, open in any browser)
Start-PromptStudio.bat   everyday launcher (Windows)  ·  start-promptstudio.sh (Mac/Linux)
Make-Portable.bat        build the standalone USB kit
Start-Portable.bat       run the standalone kit (zero install)
H3Builder.html           hand-crafted H3 prompts (also inside the app)
ClipPicker.html          exact-second clip windows (also inside the app)
ClipChopper.bat          drag-and-drop bulk video splitter (needs ffmpeg)
ComfyUI-Privacy-Handout.pdf   one-page student handout
research/                the evidence-graded research corpus behind the app
  digests/               weekly research digests (what changed, what contradicts)
  _addenda/              deep-dives, sweeps, verified ComfyUI template ground-truth
RESEARCH-PLAN.md         spec for research passes   ·   DESIGN-BRIEF.md  visual-pass spec
```

## How the knowledge stays current

The app's system prompts, knowledge bank, gotchas, and validators are compiled from a research corpus where **every claim carries an evidence grade** (`[OFFICIAL]` / `[STAFF]` / `[TESTED]` / `[LORE]`) and a source URL. A weekly automated sweep (Chinese + Western sources) produces digests in `research/digests/`; corrections get folded in — including corrections *to our own claims* (see the digests' errata). If you find the app teaching something wrong, that pipeline is how it gets fixed.

## Privacy

The app talks only to `127.0.0.1` (Ollama). The launcher sets `OLLAMA_ORIGINS=*` so the local page can reach it — meaning a website open in your browser could also send requests to your local Ollama (it can never read your files, prompts, or history). Work offline or avoid untrusted tabs if that matters to you. Details in the ComfyUI privacy handout.

## Verifying your copy is authentic

This app's biggest safety property is that it is **auditable in two minutes**. If you got these files anywhere other than the official repo (https://github.com/yizhutlon-coder/AIVideoGenPrompter), verify before running:

1. **The network audit.** The authentic app contacts ONLY `127.0.0.1` (your local Ollama). Open any `.html` file in a text editor and search for `http` — the only network URLs present should be `localhost:11434` / `127.0.0.1`, documentation links inside display text, and the official model-download domains in the launcher scripts. Any other endpoint in a fetch/XHR is a red flag.
2. **The live check.** Open the app, press F12 → Network tab, use it. Every request should target `127.0.0.1:11434`. Then turn Wi-Fi off — everything should still work.
3. **The checksum check.** Compare your files against `SHA256SUMS.txt` from the official repo: Windows `certutil -hashfile PromptStudio.html SHA256`, Mac/Linux `shasum -a 256 PromptStudio.html`. Checksums are regenerated on every release commit.

Forks are welcome under Apache 2.0 — but the license requires modified files to carry prominent change notices, and this project's name may not be used to endorse modified versions (see LICENSE §4(b), §6, and NOTICE). A copy that claims to be Prompt Studio but fails the audit above is not this project. Report impersonating or malicious forks via GitHub's report-abuse and DMCA processes — the change-notice clause is what makes those reports stick.

## Contributing / adapting

Each model's dialect lives in the `TARGETS` object in `PromptStudio.html` (system prompt + worked examples); the tutor's knowledge in `KNOWLEDGE`; misconceptions in `GOTCHAS`; workflow templates in `WF_TEMPLATES` (verified official JSONs — see `research/_addenda/comfy-templates/INDEX.md` for the parameterization ground truth). Everything is a single readable file — reading it is a legitimate class exercise.
