# Security sweep — 2026-09-18

Scope: Prompt Studio, production tools, Windows/portable/macOS/Linux launchers, local storage, Ollama access, generated shell commands, metadata parsing, and the optional review H3 pages. No commit was made. This is a focused source and behavior audit, not a penetration-test certification.

## Fixed in the working tree

| Severity | Finding | Change |
| --- | --- | --- |
| High | Windows launcher persisted `OLLAMA_ORIGINS=*` with `setx`; all launchers used wildcard browser origins. A site in the same browser could then call local Ollama. | Serve app pages from `127.0.0.1:8765`, which Ollama allows by default. Removed wildcard setup. Windows launcher removes an old user-level `*` value, starts Ollama bound to loopback with `OLLAMA_NO_CLOUD=1`, and checks the page server before opening it. |
| High | Ollama model names were inserted into a `<select>` and inline `onclick` JavaScript. A malicious `/api/tags` response could inject markup/code. | Create option nodes with `textContent`; use index-based button delegation. Browser-tested with an HTML/JavaScript payload in a mock model name: zero injected image nodes. |
| High | Ollama now has cloud models behind its local API, contradicting the app's unconditional local-inference claim. | Launchers set `OLLAMA_NO_CLOUD=1`. Main app, H3 Studio, review H3 pages, and legacy translator hide/reject zero-size and cloud-named models. Legacy translator accepts only loopback Ollama URLs. README and security policy now state the boundary accurately. |
| Medium | Clip Stitcher and Clip Picker copied shell commands built from untrusted filenames; Stitcher's downloaded `.bat` also echoed an unquoted output name. Clip Chopper expanded user input before validating it. | Unsafe filenames/output names disable command copying and batch download. Removed the unquoted echo. Replaced Clip Chopper's batch parsing with a PowerShell script that passes paths as literal process arguments and validates chunk length first. |
| Medium | A compressed PNG metadata field could expand without a limit. Large video files were read fully into browser memory up to 1.5 GB. | Cap decompressed metadata at 16 MB. Files over 256 MB now scan the first and last 12 MB without a full read and warn that middle metadata may be missed. |
| Medium | `postMessage` used `'*'` for files/prompts between the main page and Meta Inspector. | The localhost version uses exact same-origin targets and checks `e.origin`, while preserving direct-file fallback for migration. |
| Medium | Moving from `file://` to localhost changes browser storage origin, making old history/pins/H3 autosaves appear missing. | Added Settings → Export/Import saved data, strict key/shape/size checks, and migration instructions. A separately opened H3 Studio file may use a different file origin and needs its own Save .json/Open project flow. Old browser data is not erased. |
| Medium | Portable packaging followed downloads without HTTPS-only redirects, did not check ZIP paths, and executed the extracted runtime without a publisher check. | HTTPS-only `curl`, ZIP traversal/link check before extraction, and valid `Ollama Inc.` Authenticode signature required during packaging and portable launch. |

The local page servers bind to loopback, serve only named HTML files, reject unrecognized hosts and methods, omit CORS headers, prevent cross-origin framing, send `no-store`/`nosniff` headers, and apply a resource/network Content Security Policy. Inline scripts remain allowed because the current app uses inline scripts and handlers.

## Verification

- `node research/_addenda/security-sweep-harness.mjs`: script syntax, unsafe shell-name rejection, model-name injection guard, backup validation, 16 MB inflate cap, large-file partial read all pass.
- `node research/_addenda/promptstudio-grounding-harness.mjs`: 24 target checks pass, along with the preceding grounding/history checks.
- Synthetic ffmpeg input named `.tmp-security clip&safe!test.mp4`: Clip Chopper produced two correct chunks; `2 & whoami` was rejected as a length.
- PowerShell page server: app page returned 200 with CSP; `/.git/config` returned 404. Python page server: same, plus hostile `Host` returned 400 and hostile `Origin` received no CORS permission.
- In-app browser: main page, split view, Meta Inspector iframe, and H3 Studio loaded under the new page server. A mock Ollama response containing HTML/JS in a model name rendered as text, with zero injected image nodes; cloud/zero-size entries were absent from model selection.
- Windows PowerShell scripts and Python server passed syntax checks; Git Bash validated the shell launcher. ZIP verifier accepted a safe test entry and rejected `../escape.exe`. Portable signature verifier rejected a validly signed executable from the wrong publisher.
- The bundled ComfyUI privacy PDF was checked; it does not describe the old Prompt Studio wildcard launcher.

## Remaining release checks and limits

1. This machine has no installed Ollama on PATH. Run the full Windows launcher with a current official Ollama install, confirm local translation, and verify the server is bound to `127.0.0.1:11434` with cloud features disabled. Test `Start-Portable.bat` with a freshly downloaded official signed ZIP. Test the macOS/Linux launcher on those platforms with Python 3.
2. The CSP needs `'unsafe-inline'` because the app has inline scripts and event handlers. The stronger future design is separate JS files with a nonce/hash-based policy and no inline handlers. The current policy still blocks common network/resource exfiltration paths, but it is not a proof against all XSS.
3. The app still stores private text in browser localStorage, and exported backup JSON is plaintext. A browser extension, profile backup, local malware, or someone with access to the same browser profile can read it. App-owned encrypted storage would require a larger architecture change.
4. Large-file partial scanning can miss metadata stored in the middle of a file. Model-name filtering is defense in depth; the launcher's `OLLAMA_NO_CLOUD=1` setting is the primary cloud-inference control. Other local software can restart or reconfigure Ollama outside this app.
5. The `.bat` clip splitter now passes paths safely, but ffmpeg itself parses untrusted media. Users should keep ffmpeg updated. The optional ComfyUI integration and user-installed custom nodes have separate security risks.

Run `node Update-Checksums.mjs` after any further release-file edit. The checksum file covers the reviewed release files; it is not a cryptographic signature of the publisher.

## Primary references

- [Ollama default allowed origins and `OLLAMA_NO_CLOUD`](https://github.com/ollama/ollama/blob/main/envconfig/config.go)
- [Ollama cloud models through the local API](https://ollama.com/blog/cloud-models)
- [Ollama Windows installer publisher-signature check](https://github.com/ollama/ollama/blob/main/scripts/install.ps1)
- [OWASP DOM XSS prevention guidance](https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html)
