# H3 guidance review — 2026-09-22

This review updates the app's H3 knowledge bank, translator example, and Builder/Studio cheat sheets. The user's default authoring rule is stricter than MiniMax's general rewriting guide: a translator may use only facts the user wrote, unless the user explicitly chooses **Suggest details**. A sparse request therefore remains sparse.

## Source hierarchy and decisions

| Source | Supported finding | App decision |
|---|---|---|
| [MiniMax base prompt guide](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/docs/VIDEO_PROMPT_WRITING_GUIDE_base_en.md) | T2VA/I2VA/FL2VA/L2VA have three core fields; first shot has no timestamp, later cuts need increasing times; FL2VA generally favors one continuous shot; dialogue uses stable IDs and exact `<d>` text. It allows adding intent-consistent details in general T2VA rewriting. | Teach these as format rules. The app's literal mode retains the user's stricter no-invention policy. |
| [MiniMax full-reference guide](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/docs/VIDEO_PROMPT_WRITING_GUIDE_ref_en.md) | `<Subject N>` is reusable visible content, including scene, clothing and props; standalone `<Picture N>` is for a concrete frame/storyboard anchor; `<Video N>` is a whole-video source/structure. `fully_copy` means the entire source audio is the entire final track; `partially_copy` copies some signal; `reference` copies no signal. A video does not automatically make an Audio label just because it has sound. Fully specified REF generation normally uses 350–500 words, with exceptions. | Correct examples and starter lines; define audio markers precisely. Keep short drafts short rather than padding to the usual word range. |
| [MiniMax product-ad skill](https://github.com/MiniMax-AI/MiniMax-H3/blob/main/skills/minimalist-product-ad-generator/SKILL.cn.md) | Its product-ad workflow recommends 3–4, 5–7, and 6–9 beats for 5, 10, and 15 seconds. | Retain as optional planning advice. It is not a universal format limit. A fifth shot is advisory, not a hard error. |
| [MiniMax team AMA](https://www.reddit.com/r/StableDiffusion/comments/1vh9rtw/ama_minimax_h3_team_ask_us_anything_about_our/) | Staff says high-quality refs help Ref2VA fidelity; visual quality may be lower than first-frame modes. For continuation, provide the prior ending video/audio and describe the next segment, but seamless joins are not guaranteed. | Add to tutor troubleshooting as firsthand staff guidance, not a prompt syntax rule. |
| [Community prompting discussion](https://www.reddit.com/r/StableDiffusion/comments/1vwtrt1/if_youre_using_minimax_h3_what_prompting_tricks/) | Individual users report voice assignments failing across multiple audio references and long dialogue being skipped when it exceeds clip time. Reports are uncontrolled. | Present as an anecdote with concrete checks: label numbering, speaker IDs, dialogue duration. Do not encode a universal ban on multiple voices. |

## Corrections to earlier guidance

- The old knowledge-bank sentence called the product-ad beat suggestions an **official H3 beat budget**. The numbers do come from a MiniMax-authored skill, but that skill is for a minimalist product ad. The general prompt guides do not make them a universal limit.
- A translator example had a background image as a standalone `<Picture 2>` definition, even though the image supplied reusable scene content. It now defines a scene `<Subject 2>` sourced from `<Picture 2>`. A replaced person remains absent from the final video.
- The example also labeled a referenced recorded line `fully_copy`. That marker describes a complete final-track reuse, so the example now uses `[audio reference]` and `reference` for line content and quiet delivery. The user's source words stay exact.
- `overall_soundscape: N/A` for unspecified sound is a conservative app policy. MiniMax's base guide reserves that value for explicit full silence. The tutor now says so; otherwise it could falsely describe this product decision as official.
- The old `>4 shots` hard error was not supported by MiniMax's format guide. It is now advice to check pacing and whether each cut adds information.
- The older standalone `tools/video-prompt-translator.html` still taught `[0s-2s]` slices, `AUDIO:` and `NEGATIVE:` blocks for local H3. Its H3 text now uses the same three-field shot format as the main app and points users to the main translator for full-reference work.

## Limits

Forum reports are single-user experience, not controlled evidence. This review changes guidance and local prompt construction; it does not establish that H3 will obey any individual reference or that source audio will be reproduced exactly. The app does not inspect attached media in its text-only translator, so it cannot describe unseen details from them.

## Live local test

The portable, signed Ollama runtime and local page server launched on `127.0.0.1`; the app loaded in the Codex browser and detected `qwen2.5:7b-instruct`. The normal installed Ollama path was missing from this session's `PATH`, so the launcher now also checks Ollama's standard per-user install location. This sandbox blocked Windows `Start-Process` from opening the default browser, although both services started; the page was opened in the Codex browser for the test.

The H3 Builder visibly reported five timed shots as pacing advice rather than a hard format error. Its and Studio's expanded cheat sheets showed the corrected reference and audio definitions. The main app's built-in multi-reference example returned two picture sources, a woman Subject, a scene Subject, one shot, and `N/A` audio; it did not invent a video or show the replaced position-guide person. The app reported format OK.

Two live tutor questions exposed a weakness of the 7B local model. Despite the knowledge bank, it first distinguished Subject from Picture by visual prominence and then claimed a timbre-only sample should use `fully_copy`. The common reference-label and audio-marker questions now receive narrow source-based answers directly in the tutor. Both were repeated in the browser and returned the correct definitions. Other open-ended tutor answers remain model-generated and require review.
