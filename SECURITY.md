# Security Policy

## The security model

This app's core security claim is simple and checkable: **it makes no network connections except to `127.0.0.1` (your local Ollama)**. No telemetry, no updates, no CDNs. Any copy that contacts anything else is not this software — see "Verifying your copy" in the README (checksums in `docs/SHA256SUMS.txt`).

Known, documented trade-off: the launchers set `OLLAMA_ORIGINS=*` so the local page can reach Ollama; the README's Privacy section and the included handout explain the implications.

## Reporting a vulnerability

- Prefer GitHub's **private vulnerability reporting** on this repository (Security tab → Report a vulnerability), if enabled.
- Otherwise open an issue. For anything sensitive, say only that you've found a security issue and ask for a private channel — don't post exploit details publicly first.
- Supported versions: the latest `main` and the most recent release tag.

## Reporting a malicious or impersonating fork

If you find a modified copy distributed as "Prompt Studio" / "AI Video Gen Prompter" that fails the README's authenticity audit (added network calls, stripped provenance footer, mismatched checksums):

1. Please open an issue here with a link, so users can be warned.
2. Report it to GitHub (Report abuse) — unmarked modified redistribution violates Apache 2.0 §4(b), and use of this project's name to endorse a modified copy violates §6.

## What this policy does not cover

The AI models the app writes prompts for, Ollama itself, and ComfyUI are separate projects with their own policies. The included privacy handout covers ComfyUI's threat model (custom nodes, `--listen`) as a teaching resource.
