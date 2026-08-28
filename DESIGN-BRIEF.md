# Design Brief — Prompt Studio visual pass

**For:** a Claude Design session taking a visual/UX polish pass.
**Scope:** styling and layout refinement only. The app is functionally complete, test-covered, and in daily classroom use — this pass makes it *feel* as good as it works.

## What this is

Prompt Studio is an offline teaching app for local AI video/image generation. A student types a plain-language shot idea; the app translates it into the native prompt dialect of up to 12 models via a local LLM (Ollama), format-checks each output against official rules, and teaches along the way. Audience: students on classroom laptops, plus the instructor projecting it on a big screen. Everything is engineer-built UI: functional, dense, consistent-ish, unlovely.

## The surfaces (all in this folder)

1. **PromptStudio.html** — the main app. Header (state dot, model/theme/language selects, 7 tool buttons), setup wizard (3 steps, first-run only), input zone (intent textarea, example chips, collapsible Project Context, model chips in two grouped rows, Translate button), results grid (streaming output cards with format-check badges, Copy/Pin buttons, per-card tweak bar), plus SEVEN slide-in panels: Tutor chat, Gotchas (searchable myth/reality cards), Model Picker (filterable spec chart), Model manager (Ollama pulls with progress), Pinned board, History, and two iframe panels (Clip Picker, H3 Builder). A footer "myth of the day" line. Split-screen mode renders two app copies in iframes side by side.
2. **H3Builder.html** — two-column form tool: mode picker, duration, media-tag simulator with budget meters, per-mode structured editors with toolbar inserters, live validation list (red/amber/green), assembled-prompt pane.
3. **ClipPicker.html** — drop a video, pick an exact-second window, chunk buttons, copy an ffmpeg command.

## Current visual language

- Single dark palette via CSS variables on `:root`: `--bg #0c0f14, --panel #151a22, --panel2 #1c2330, --border #2a3342, --text #e9eef6, --dim #8f9cb0, --accent #5eb1ff, --green #6fdf9c, --warn #ffb45e, --err #ff7a7a`, mono stack for prompt text.
- **New:** a light theme just landed as `[data-theme="light"]` variable overrides (values chosen quickly by an engineer — genuinely open to revision), toggled by `#themeSel` in the header, persisted in `localStorage('ps_theme')`, followed by the satellite files via a small header script. `Auto` follows `prefers-color-scheme`.
- System font stack, sizes hand-picked per element (11px–20px, no scale), emoji as icons (🎬🧠🗺⚙💬📌🎞🎛📋), border-radius 7–12px ad hoc, spacing ad hoc.

## What we want from the pass

1. **A real theme.** Refine both palettes (dark stays default). The light palette especially needs a designer's eye — contrast, surface hierarchy, and the accent/success/warn/error ramp. Both must keep WCAG AA on body text and the dim/hint text students actually read.
2. **Type & spacing scale.** Replace ad-hoc sizes with a small scale (e.g. 11/12/13/15/18/22) and consistent spacing rhythm. Prompt output stays mono and copy-paste-clean.
3. **Component consistency.** One button system (primary/ghost/mini/danger), one chip system (model chips, example chips, tag chips, gotcha topic tags), one card system (result cards, gotcha cards, picker cards, pin cards), one slide-in panel chrome (7 panels currently have hand-rolled variants of the same header).
4. **Hierarchy in the input zone.** The intent textarea is the star; example chips, project context, language select, and 11 model chips currently compete with it. The header has 8+ controls — group or overflow them thoughtfully (a single ☰ menu for the panel buttons is acceptable if discoverability survives for students).
5. **States.** Streaming (blinking cursor in cards), format-check badges (✓ / ⚠ n issues / Fix button), empty states (no pins, no history, no gotcha matches), connection states (the wizard, "Ollama not running"), download progress bars. Make these legible at classroom-projector distance.
6. **The teaching accents.** Gotcha cards (myth ✗ / reality ✓), the myth-of-the-day footer, and validation messages are the pedagogical soul — they can take more visual character than the chrome.

## Hard constraints — do not break

- **Single-file architecture.** All CSS stays in each file's `<style>` block. No external fonts, no CDNs, no build step, no frameworks — these files run offline from double-click on student machines.
- **Every `id` and JS-referenced class name is load-bearing.** The JS queries by id extensively and a test suite (jsdom) asserts against them. You may ADD classes and wrapper elements freely; renaming or removing existing ids/classes breaks the app. Safest workflow: restyle via CSS, touch markup only to add classes/wrappers.
- **Keep the CSS variable names** (`--bg`, `--panel`, `--panel2`, `--border`, `--text`, `--dim`, `--accent`, `--green`, `--warn`, `--err`, `--mono`) — JS writes some of them inline. You may add new variables.
- Theme mechanism stays: `[data-theme="light"]` overrides + `#themeSel` + `ps_theme` storage key.
- No `position: fixed` changes that break the slide-in panels' open/close transitions (`.open` classes, `right` transitions), and the split-view iframes must keep working.
- Streaming updates rewrite card `innerHTML` frequently — avoid CSS that causes layout thrash on tall results.
- Emoji icons may be replaced with inline SVG if fully embedded (no icon fonts, no requests).

## Verification expected of the pass

After changes, extract each file's script blocks and `node --check` them; boot PromptStudio in jsdom with a mocked Ollama `/api/tags` and confirm: state reaches "offline & ready", 12 model chips render, each panel toggle opens, `validate()` unit cases still pass, and `setTheme('light'|'dark'|'auto')` still flips `data-theme`. (Prior sessions' test snippets are in the git log; commit `bf80908` has the theme tests.)

## Files & git

Work in this folder on `PromptStudio.html`, `H3Builder.html`, `ClipPicker.html` (and `video-prompt-translator.html` only if trivial). Commit in logical steps with plain messages ("design: unify button system"). Do not push. Do not touch `research/`, `README.md`, launchers, or `RESEARCH-PLAN.md`.
