# Handoff: Prompt Studio visual & usability pass

## Overview
Restyling pass for **Prompt Studio** (github.com/yizhutlon-coder/AIVideoGenPrompter): progressive-disclosure header, professional neutral palette (dark default + first-class light), and one consistent type/spacing/button/panel system. No feature or logic changes.

## About the Design Files
`mockups.html` is a **design reference created in HTML** — a static, self-contained canvas of mockups (open it in any browser, works offline). It is not production code. The task is to **restyle the existing app files** (`PromptStudio.html`, `tools/H3Builder.html`, `tools/ClipPicker.html`) to match, working within their hard constraints (below).

## Fidelity
**High-fidelity** for color, type, spacing, and component treatment — recreate values exactly. Layout of existing surfaces is unchanged except where noted (header menus, card action row).

Mockup index (badges in mockups.html): **1a** main screen, direction A "Steel", dark + light · **1b** accent variant B "Slate Indigo" · **1c** accent variant C "Graphite" · **1d** unified panel chrome · **1e** first-run wizard · **1f** WF export dialog · **1g** H3 Builder · **1h** Clip Picker. Directions differ ONLY in the two `--accent` values; everything else is shared. **Recommended default: direction A.**

## Hard constraints (from the owner's brief — non-negotiable)
- Single-file architecture per HTML file: CSS in each file's `<style>`, no CDNs, **no external fonts**, no build step, no frameworks.
- Every existing `id` and JS-referenced class is load-bearing (jsdom suite asserts on them). Restyle via CSS; touch markup only additively. New header menus must be NEW elements calling the existing `toggle*()` functions; hide superseded buttons with CSS, never remove their ids.
- Keep CSS variable names `--bg --panel --panel2 --border --text --dim --accent --green --warn --err --mono` (new vars may be added). Theme mechanism unchanged: `:root` + `[data-theme="light"]` overrides, `#themeSel`, `ps_theme` storage key.
- Slide-in panel mechanics (`.open`, `right` transitions, `position:fixed`) and split-view iframes keep working; results stream via innerHTML rewrites — avoid layout-thrash-prone CSS there.
- Provenance/audit footer and myth-of-the-day line stay present and legible.
- Verification bar: `node --check` on script blocks; jsdom boot with mocked Ollama; all `toggle*()` open; `validate()` and `buildWorkflow()` pass; `setTheme()` flips `data-theme`.

## Design Tokens

### Shared neutrals + semantics — DARK (default, `:root`)
```css
--bg:#14161a; --panel:#1b1e24; --panel2:#232730; --border:#2f3540;
--text:#e7eaee; --dim:#99a2af;
--green:#7cc494; --warn:#d8a75f; --err:#d98484;
--mono:ui-monospace,'Cascadia Code',Consolas,monospace; /* unchanged */
```

### Shared neutrals + semantics — LIGHT (`[data-theme="light"]`)
```css
--bg:#f2f2f3; --panel:#ffffff; --panel2:#ebecee; --border:#d3d6da;
--text:#1d1f20; --dim:#5b636d;
--green:#1f6f3f; --warn:#8a5a14; --err:#a83232;
```

### Accent per direction (`--accent`, plus a NEW `--accent-fg` for text on accent fills)
| Direction | Dark accent / fg | Light accent / fg |
|---|---|---|
| **A Steel (recommended)** | `#7fa3c7` / `#0f151c` | `#48708f` / `#ffffff` |
| B Slate Indigo | `#a3a8d6` / `#131420` | `#565d9d` / `#ffffff` |
| C Graphite | `#aeb6bf` / `#14171a` | `#3d454e` / `#ffffff` |

Useful derived tints (may add as vars): selected-chip fill = accent at ~10% alpha (dark `rgba(127,163,199,.12)`, light `rgba(72,112,143,.09)` for A).

### Rules that must survive
- **Semantic ramp is sacred**: ✓ uses `--green`, ⚠ `--warn`, ✗ `--err` — never the accent, in every direction and theme. Values above are tuned for classroom-projector legibility (light-theme semantics are dark enough for white cards; dark-theme semantics are desaturated but unambiguous).
- **Prompt output stays mono** (`--mono`), copy-paste-clean, no styling inside the text.
- No gradients, no glows. Replace the two existing progress-bar gradients (`linear-gradient(90deg,var(--accent),var(--green))`) with flat `var(--accent)`.

### Type
- Headings/panel titles: condensed face. Mockups use Barlow Condensed, but **external fonts are banned** — implement as `--font-heading:'Barlow Condensed','Arial Narrow','Helvetica Neue Condensed',system-ui,sans-serif;` (picks it up if locally installed, degrades safely). Body: `--font-body:'Barlow',system-ui,'Segoe UI',sans-serif;`. Optionally embed Barlow as base64 `@font-face` inside the `<style>` block — allowed (no network), but adds ~200 KB/file; owner's call.
- One scale: **11 / 12.5 / 14 / 16 / 19 px**. Panel & card titles: heading face, weight 600, slight letter-spacing (.3–.5px); section micro-labels (VIDEO / IMAGE, MODE, CHECKS): heading face 11–12px, uppercase, letter-spacing 1.5px, `--dim` or accent.
- Body line-height 1.5–1.6; mono blocks 11.5px / 1.6.

### Spacing & radius
- One radius: **4px** on all controls, chips, cards, panels, dialogs (replaces the current 7/8/9/12/14/18px mix). Chips are rectangles at 3–4px, not pills.
- Rhythm: 12/14px card padding, 6–8px gaps in control rows, 12px grid gap in results.
- Borders: 1px `--border` hairlines everywhere; elevation via shadow only on overlays (panels `-16px 0 40px rgba(0,0,0,.35)` dark / softer light; dialogs `0 24px 60px rgba(0,0,0,.5)`).

## Screens / Views

### 1. Header (PromptStudio.html) — progressive disclosure (mockup 1a)
At rest, exactly: brand `🎬 Prompt Studio` (heading face 19px) · state dot + status text (12px `--dim`; dot `--green` when ready, `--err` when not) · right group (flex, gap 6px):
- **💬 Ask** — standalone quiet button (primary feature).
- **Tools ▾** menu → 🎛 H3 Builder, 🎞 Clip Picker, 🗺 Model Picker, 🧠 Gotchas.
- **Library ▾** menu → 📌 Pins (with count), History.
- **⚙ ▾** menu → Models (manager), Theme (auto/dark/light), Output language, ⫲ Split view.

Menu spec: dropdown `--panel` bg, `--border` hairline, 4px radius, shadow; each item = emoji + **bold 12.5px label** + 11px `--dim` one-line hint, 8px/10px padding, hover `--panel2`. Generous hit targets; never emoji-only. Implement as new elements calling existing `toggle*()`; hide old buttons via CSS (keep ids). `#themeSel`, `#langSel` move into ⚙ menu (keep ids/handlers). Discoverability: existing `title` tooltips + menu hints suffice; optionally a one-time dismissible "tools moved into menus" toast.

### 2. Input zone (mockup 1a)
- Textarea is the star: `--panel2` bg, 15px text, accent border on focus.
- Example chips + 📋 Project context: quiet — 11.5px `--dim`, hairline border, 3px radius, no fill. Context stays collapsible (keep pattern).
- Model chips, 2 rows with VIDEO/IMAGE micro-labels: unselected = hairline border + `--dim` text, no fill; selected = accent border + ~10% accent tint + `--text`. 12px text, 4px/10px padding.
- Right column: Output select (quiet), **Translate** primary (solid `--accent`, `--accent-fg` text, 700 weight), `Ctrl+Enter ↵` hint 11px `--dim`.

### 3. Result cards (mockup 1a)
- Head: model name (heading face 15px 600) · fmt hint 11px `--dim` · right: format state + actions.
- Format states: `✓ format` in `--green`; `⚠ N issues` in `--warn` + solid **Fix** button (`--warn` bg, dark text on dark theme / white on light, 700).
- Actions collapse to **Copy** (quiet bordered) + **⋯** overflow (menu: ⬇ WF, 📌 Pin) — keep existing buttons' handlers; ⋯ is a new element.
- Body: mono block. Streaming cursor: 7×13px `--accent` block. Tweak bar: input + ↻ button on `--panel2` strip, top hairline. Avoid transitions/animations on card internals (innerHTML rewrites).

### 4. Slide-in panels — one chrome for all 8 (mockup 1d)
Header: 12px/14px padding, bottom hairline; condensed uppercase title (16px 600, letter-spacing) + optional 11px `--dim` role hint + quiet ✕ (no border, `--dim`, hover `--text`). Restyle `.cp-head/.ap-head/.hp-head` to this one spec via CSS. Panel body: 12–14px padding, item cards `--panel2` on `--panel`, 4px radius. Ask bubbles: user = accent-tint fill + accent border, radius 4px; assistant = `--panel2` + `--border`. Kill light-theme hardcoded `#dbeafe`/`#1a2536` — use accent-tint from vars.

### 5. First-run wizard (mockup 1e)
Steps as cards: done = 0.55 opacity, `--green` ✓ disc; active = accent border + accent-outlined number disc. Primary/secondary download buttons; flat accent 6px progress bar; mono pull status in `--dim`.

### 6. WF export dialog (mockup 1f)
Same chrome as panels: condensed title bar + ✕, hairline divider, body 16px padding, quiet note plate (`--panel2`, 11.5px `--dim`), right-aligned Cancel (quiet) + Download JSON (primary).

### 7. H3 Builder (mockup 1g)
Keep two-column layout. Cards get micro-label headers (MODE / MEDIA TAGS / SHOT EDITOR / CHECKS) in accent condensed caps. Mode chips = same chip system. Media tag rows: mono tag in `--green`, budget meters mono 11px with flat accent fill. Validation list `.v` rows: hairline border + ~8% tint of the semantic color + semantic text (`✓ --green / ⚠ --warn / ✗ --err`) — same recipe both themes, replacing the hardcoded light-theme hexes. Assembled prompt: mono pre on `--panel2`.

### 8. Clip Picker (mockup 1h)
Dashed `--border` drop zone; timeline with accent-tinted window + 2px accent edge handles; chunk buttons = chip system; ffmpeg block mono in `--green` with quiet Copy.

### Footer (must stay)
Myth-of-the-day 11.5px + provenance/audit line 10.5px, `--dim`, centered; link in accent. Never hidden.

## Interactions & Behavior
- Hovers: quiet buttons/chips → `--text` + accent border (existing pattern, keep). Menus: open on click, close on outside click / Esc.
- Focus: `:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }` everywhere; textarea/input focus = accent border.
- Panel slide transitions unchanged (`right .25s`). No new animations on results.
- Theme switching unchanged (`setTheme`, `ps_theme`, `data-theme`).

## State Management
None new. Menus are open/closed CSS classes on new wrapper elements; all actions delegate to existing `toggle*()` / handlers.

## Assets
None. Emoji-as-icons retained (owner's choice); menus always pair emoji + text label. No external fonts or images.

## Files
- `mockups.html` — the full mockup canvas (self-contained; pan/scroll; badges 1a–1h).
- Targets in the app repo: `PromptStudio.html`, `tools/H3Builder.html`, `tools/ClipPicker.html` (H3Builder/ClipPicker carry their own copies of the `:root`/light variable blocks — update both in step).
- Owner's full brief: `docs/DESIGN-BRIEF.md` in the repo (verification recipes in the git log).
