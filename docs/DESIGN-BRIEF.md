# Design Brief v2 — Prompt Studio visual & usability pass

**For:** a Claude Design session. **Scope:** styling, layout, and interaction organization — no feature changes, no logic changes. The app is functionally complete, test-covered, and now public (github.com/yizhutlon-coder/AIVideoGenPrompter, Apache 2.0), used by students *and* local-AI hobbyists. This pass makes it look and feel professional.

## The three priorities, in order

### 1. Usability through progressive disclosure

The app has grown to ~10 header controls and a dense input zone. The direction: **anything that can be intuitively categorized under a tool/button should be hidden until that button is clicked.**

- **Header:** at rest, show at most 4–5 things: the state dot, the Translate-critical selects (or fold them too), one or two primary actions, and grouped menus for the rest. A sensible grouping the owner would accept (designer may propose better): **Tools** menu → 🎞 Clips, 🎛 H3 Builder, 🗺 Picker, 🧠 Gotchas; **Library** menu → 📌 Pins, History; standalone: 💬 Ask (it's a primary feature), ⫲ Split; **Settings** menu → ⚙ Models, 🌓 theme, output language. Menus must be readable: real text labels next to any icon, generous hit targets, no emoji-only buttons in menus.
- **Input zone:** the intent textarea is the star. Example chips, the 📋 Project context (already collapsible — good pattern, keep it), and the language select should read as quiet secondary UI. The 12 model chips in two rows are core and stay visible, but can be visually calmer.
- **Result cards:** the per-card button row (⬇ WF / 📌 Pin / Copy) can collapse to Copy + an overflow "⋯" if it reduces noise — Copy is the dominant action.
- **Discoverability guard:** first-run users must still find things. Grouped menus need clear names; consider a one-time subtle hint or keep the panels' current behavior once opened.

### 2. A professional, neutral palette — both themes first-class

Current colors are engineer-picked and slightly toy-like (bright blue accent, mint green, amber). The goal is **neutral/professional** — think developer-tool restraint (Linear/GitHub-desktop energy), not SaaS-landing-page flash.

- Rework both palettes via the existing CSS variables. Dark stays default. Muted accent (desaturated blue/slate range), semantic green/amber/red toned to signal without shouting. No gradients for decoration, no glows.
- **Light mode needs the most work** — it was a quick variable swap. Real surface hierarchy (bg / panel / panel2), borders that define without heaviness, and correct text ramps.
- WCAG AA minimum for body text AND the dim/hint text people actually read; the format-check ✓/⚠ states and validation messages must be legible on a classroom projector in both themes.
- Both themes ship in the same file as today: `:root` vars + `[data-theme="light"]` overrides, `#themeSel`, `ps_theme` storage key — mechanism unchanged.

### 3. Readability & consistency

- One type scale (e.g. 11/12.5/14/16/19), one spacing rhythm, one radius. Prompt output stays mono and copy-paste-clean.
- One button system (primary / secondary / quiet / destructive), one chip system, one card system, one slide-in panel chrome — the 8 panels currently have hand-rolled variants of the same header; unify them.
- Emoji-as-icons may stay for personality or be replaced with inline SVG (fully embedded only) — but in menus, always icon + text label.

## Surface inventory (updated)

1. **PromptStudio.html** — header; first-run wizard (3 steps + in-app model download with progress); input zone (intent, example chips, collapsible Project Context, Output-language select, model chips in Video/Image groups, Translate); results grid (streaming cards, format badges ✓/⚠+Fix, tweak bar per card, ⬇ WF / 📌 / Copy); **eight slide-in panels** (Ask tutor w/ context badge, Gotchas w/ search, Model Picker w/ filters, Model manager w/ download progress, Pins, History, and two iframe panels: Clips, H3 Builder); the ⬇ WF export **dialog**; footer: myth-of-the-day line + provenance/audit line (must stay present and legible — it's a security feature). Split view = two iframes of the same file.
2. **tools/H3Builder.html** — two-column form tool; modes, media-tag simulator with budget meters, structured editors with toolbar inserters, red/amber/green validation list, assembled-prompt pane, dialogue dialog.
3. **tools/ClipPicker.html** — drop video, pick window, chunk buttons, ffmpeg command block.

## Hard constraints — unchanged and non-negotiable

- Single-file architecture per file: CSS in each file's `<style>`, no CDNs, no external fonts, no build step, no frameworks. Runs offline from double-click.
- **Every existing `id` and JS-referenced class is load-bearing** (jsdom test suite asserts on them). Add classes/wrappers freely; never rename or remove existing ones. Restyle via CSS; touch markup only additively. If you add menus, implement them with NEW elements that call the existing `toggle*()` functions — do not remove the existing buttons' ids (hide them with CSS if superseded).
- Keep CSS variable names (`--bg --panel --panel2 --border --text --dim --accent --green --warn --err --mono`); new variables may be added.
- Slide-in panel mechanics (`.open` classes, `right` transitions, `position:fixed`) and split-view iframes must keep working; streaming rewrites card innerHTML frequently — avoid layout-thrash-prone CSS on results.
- The provenance/audit footer text and the `!START HERE.bat` onboarding story must not be hidden or removed.

## Verification expected (same bar as engineering commits)

Extract each file's script blocks → `node --check`. Boot PromptStudio in jsdom with mocked Ollama `/api/tags`: reaches "offline & ready"; 12 model chips render; every `toggle*()` (Ask, Gotchas, Picker, Models, Pins, Hist, Clips, H3B) still opens its panel; `validate()` unit cases pass (including the temporal-semantics cases); `setTheme('light'|'dark'|'auto')` flips `data-theme`; `buildWorkflow()` still returns integrity-clean JSON for all 9 mapped targets. Test recipes are throughout the git log. Commit in logical steps ("design: header menu grouping"), do not push, do not touch `research/`, `README.md`, launchers, or `docs/` other than this file.
