# Security Policy

## The security model

The app's automatic requests stay on loopback: the page server at `127.0.0.1:8765`, Ollama at `localhost`/`127.0.0.1:11434`, and optional ComfyUI discovery at `127.0.0.1:8188`. The app has no telemetry, automatic updates, or CDN resources. User-initiated documentation links and model downloads can contact the internet. See "Verifying your copy" in the README (checksums in `docs/SHA256SUMS.txt`).

The launchers serve only named HTML pages on loopback and do not enable wildcard Ollama browser origins. They start Ollama with `OLLAMA_HOST=127.0.0.1:11434` and `OLLAMA_NO_CLOUD=1`; the app also hides zero-size and cloud-named models. Browser history, pins, and H3 autosaves remain in browser localStorage. Use Settings → Export saved data before switching from the older `file://` launcher, then import after launching the localhost version. An H3 Studio project stored under a separate file origin must be saved and reopened with H3 Studio's own project JSON controls. Exported JSON contains private prompt text.

The local page server uses a Content Security Policy to restrict network requests and page resources. Its inline-script allowance is needed by the current single-file app, so this policy is defense in depth, not a substitute for escaping untrusted text. Keep Ollama, the browser, and ComfyUI updated; they have separate security boundaries.

The optional Windows portable packager downloads Ollama over HTTPS, rejects unsafe ZIP entry paths, and requires a valid `Ollama Inc.` publisher signature on the bundled executable before packaging or launching it. It still tracks Ollama's current download, so new releases should be tested before shipping a portable kit.

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
