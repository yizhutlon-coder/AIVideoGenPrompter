# AI Video Gen Prompter

Describe a shot once in plain language — get it translated into the native prompt dialect of four local AI video models, side by side:

| Model | Prompt dialect |
|---|---|
| **Wan 2.2** | Keyword formula (Subject + Scene + Motion + cinematography vocab) + official Chinese negative prompt |
| **LTX 2.3** | One flowing present-tense cinematic prose paragraph |
| **MiniMax H3** | Timeline blocks `[0s-2s]`, SUBJECT/ACTION/CAMERA, audio block, speaker IDs |
| **SCAIL-2** | Motion transfer — prompt describes the output only; motion comes from a driving video |

Runs 100% offline on your own machine via a small local LLM (Qwen through [Ollama](https://ollama.com)). No accounts, no cloud, prompts never leave your computer.

## Quick start

1. Install [Ollama](https://ollama.com/download) (one time).
2. **Windows:** double-click `Start-PromptStudio.bat` · **Mac/Linux:** run `start-promptstudio.sh`
3. First run only: click the **Download Qwen** button in the app (7B ≈ 4.7 GB, or 3B for slower machines) and watch the progress bar.
4. Type what you want to see → **Translate** → copy the version for your model.

Every run after that: double-click the launcher and go. Works with Wi-Fi off once the model is downloaded.

## Features

- Streams output live from the local LLM
- **Format checker** — validates each output against the model's official rules (✓ or ⚠), with a one-click **Fix** that sends violations back to the LLM
- History panel (last 40 translations, stored locally in your browser)
- Model picker — works with any model you have in Ollama; Qwen recommended
- `video-prompt-translator.html` — earlier teaching version with detailed "why this format?" explanations per model

## Privacy notes

- Internet is used only for the one-time Ollama install + model download. Inference is fully local (Ollama listens on `127.0.0.1` only).
- The launcher sets `OLLAMA_ORIGINS=*` so the app page can reach Ollama. This means a website open in your browser could also send requests to your local Ollama (it can never read your files, prompts, or history). Work offline or close unknown tabs if that concerns you.

## Updating the prompt rules

Each model's dialect lives in the `TARGETS` object in `PromptStudio.html` (system prompt + one worked example). When a model ships new prompting guidance, edit those strings — nothing else needs to change.

Prompt dialects sourced from official guides (Aug 2026): Wan 2.2 README, LTX 2.3 prompt guide, MiniMax H3 HuggingFace docs, SCAIL-2 repo.
