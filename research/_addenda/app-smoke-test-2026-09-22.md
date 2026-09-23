# App smoke test — 2026-09-22

No files were committed. The first browser pass used a temporary simulated Ollama endpoint and two synthetic MP4 files. A second pass used the machine's actual Ollama installation and both downloaded Qwen models. Test-only services and media files were removed afterward.

## Passed

- Main app loaded through the local launcher server. Its default Project context, model selector, model picker, gotchas search, tutor panel, and ComfyUI workflow export responded in the browser. No browser console errors were observed.
- Sparse LTX input used Simple mode without inventing scene facts. Opt-in suggested details appeared separately, were labeled as a template, and kept that disclosure in history and pins. Editing the suggestions moved them into the request and turned the toggle off.
- The grounding harness passed for Simple mode and Project context across all 12 targets. Added template-mode regression coverage for all 12 targets.
- Both installed models (`qwen2.5:7b-instruct` and `R4C3R/qwen2.5-7b-instruct-heretic:q8_0`) completed the live rich-request run across all 12 targets with no unchecked output. Several targets needed a repair or Simple fallback; this is a safety pass, not a claim that the model itself followed every target dialect. The standard model also passed the four capability examples in a live run.
- The standard model produced a checked Chinese Wan version of “A woman walks across a battlefield” in the browser.
- A live anime-tag output invented `hair_red` and `eyes_black`; the existing checker missed those underscore tags. The grounding check now catches unstated hair/eye tags and mismatched attribute colors. The real model then repaired its output in the live retry.
- Wan I2V now rejects a static-only suggestion instead of showing a template draft whose content disappears from the motion-only output. A motion suggestion is retained. The rejection was verified in the browser and the harness.
- Chinese-version harness passed for Wan T2V, Wan I2V, Z-Image, and Qwen-Image, including translation validation, copy, revision, and history restoration.
- H3 Studio reference creation, job assignment, subject definition insertion, shot insertion, AI project application, restore previous, and autosave across tabs responded in the browser. H3 Builder shot insertion responded.
- A real H3 Studio AI build with each installed model returned structurally bad project content for a simple text-only request: an invented picture reference and no `[Shot 1]`. H3 Studio rejects these drafts, tries one JSON repair, and keeps the previous project if the repair still fails. New/Open/Restore reset the AI conversation so old requests do not influence a new project. A subsequent research and iteration pass added a direct simple builder, stricter edit boundaries, and 31 passing AI regression cases; see [the H3 AI improvement report](h3-studio-ai-improvement-2026-09-22.md).
- Clip Picker loaded a synthetic video and produced the correct 2s–4s extraction command. Clip Stitcher loaded two synthetic videos, built a stitch command, and updated it after reordering.
- Meta Inspector read a ComfyUI workflow JSON and displayed its model family, dimensions, seed, prompts, and model filenames.
- The local server returned the app and tools on allowlisted routes, returned 404 for unknown/traversal paths, 405 for POST, 400 for a foreign Host header, and included a Content Security Policy.
- Script syntax and security harness, release checksum verification, and Git whitespace checks passed.

## Open findings and limits

- The legacy 142-fixture validator harness exits with 69 false-hard, 1 false-pass, and 3 wrong-severity cases. Most old examples supply only a sparse `intent` while their expected prompt adds scene facts; they conflict with the current strict grounding policy. The 1 false-pass is `sdxl-viol-prose`, a long prose prompt that the current SDXL format checker accepts. This corpus needs a separate format-only score and a grounded corpus before its aggregate percentage is meaningful.
- The two local Qwen models are usable for Prompt Studio translation, but both failed the H3 Studio build evaluation (0/10 per strategy across five requests and two models). The new direct builder handles a defined set of straightforward requests. More complex H3 builds still depend on model behavior and may be rejected safely.
- The live model run used one rich request per target plus four examples. It does not prove accuracy for arbitrary prompts; the heuristic grounding checker can still miss other invented details.
- No ComfyUI generation was run. Workflow export was exercised through download; actual graph execution and model outputs remain unverified.
- The browser's automated file chooser timed out when used inside the integrated Clip Picker iframe. Direct Clip Picker and Clip Stitcher pages accepted the synthetic MP4s and worked; this may be an automation limitation, so the iframe upload path remains unverified.
