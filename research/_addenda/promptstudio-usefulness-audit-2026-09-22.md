# Prompt Studio usefulness audit — 2026-09-22

## Method

Ran the app's real `generate()` path against the installed local `qwen2.5:7b-instruct` Ollama model, with an isolated in-memory browser store so test prompts did not enter the user's pin/history data. The local Prompt Studio page was served and its model picker was checked in the browser. The first pass used a short and a detailed request for each of the 13 targets. A second pass used 9 specialized requests for image text, transparency, Chinese, editing, references, multiple shots, and character replacement. Raw inputs, outputs, failures, and network-call counts are in the two JSON result files. This evaluates prompt preparation, not the quality of images or video rendered by the target generators.

Across 35 cases, 33 yielded a copyable prompt and 2 failed. Twelve copyable prompts had the same positive text as the input after whitespace/case/punctuation normalization. Ten of those exact echoes were in the short/simple or near-short cases. This is partly intentional: Simple mode avoids inventing scene details. A changed output is **not** automatically better; several rewrites omitted constraints or added unrequested details.

## Where it saved work

| Target | Observed value | Main limitation |
| --- | --- | --- |
| MiniMax H3 | Added the required shot/audio sections, speaker ID, dialogue markup, and explicit cut time. | One output repeated sound in the visual section; automated checks did not measure all omissions. |
| H3 multi-ref | With assets listed on separate lines, converted picture roles into Subjects, excluded the replaced guide, and kept the requested sequence. | A realistic one-line asset description failed after repair. A successful run labeled audible rain as `overall_soundscape: N/A`. |
| Wan I2V | Removed static image facts and kept only stated motion and camera behavior in the detailed case. | Short Simple mode still returned “In my still image” in the positive prompt. |
| Qwen-Image 2.1 | Converted numbered source to `<image1>` for an edit and added its official transparency wrapper for an RGBA request. | Ordinary text-to-image scenes usually remain close to the input. |
| SDXL photoreal | Supplied a separate standard negative list and compressed a detailed scene into a shorter prompt. | Short positive prompt was an exact echo. |
| Wan T2V | Supplied its negative list; the Chinese-version action produced a usable native Chinese draft in the tested case. | A video-only test retained spoken words and sound; another detailed request lost its final action. The checked Chinese draft omitted dawn/style and a color. |
| LTX | Reordered a detailed request into action-first prose. | Dropped the explicit “No music” constraint. Sparse input was an exact echo. |

## Lower-value or specialized outputs

| Target | Observed result |
| --- | --- |
| Z-Image | One detailed result was near-identical, another was exact, and the short result was exact. Its checked Chinese version omitted “cream paper”. |
| Qwen-Image 2512 | Positive prompt was an exact echo in all three cases; it did provide the official negative list. The Chinese button produced a useful translation in the tested text-layout case. |
| Flux | Reordered/condensed supplied facts in detailed cases, but did not add a model-specific syntax or comparable time saving; omitted some stated exclusions/relations. Short result echoed. |
| Krea 2 | Expanded front/back character-sheet wording in one case, but added an unrequested stance in another. Short result echoed. |
| SDXL anime tags | Added Pony control tags, but one result incorrectly said “assumed: Pony V6” even though the user named Pony V6. The positive content largely echoed. |
| SCAIL-2 | A detailed replacement request became a usable finished-video sentence, but one short replacement request failed validation after repair. Another output changed the destination of the run. |

## Changes made from this audit

- Kept the core video models and SDXL/Qwen-Image 2.1 visible. Moved SCAIL-2, SDXL anime, Flux, Z-Image, Qwen-Image 2512, and Krea 2 into expandable **More video/image models** lists. They remain fully selectable. SCAIL-2 is no longer selected by default.
- Example buttons automatically open the additional list when they select one of its models. Browser interaction confirmed the list expands and the Detailed image example selects its hidden models.
- The Chinese result badge now says **format OK · review content**. The prior “checked” wording could imply that every source fact survived; the evaluated Chinese drafts show that this is not guaranteed.

## Open quality issues

The app currently catches many invented details and format errors but does not reliably detect omitted facts. The local model dropped actions, explicit exclusions, audible rain, and some visual details while still producing prompts that passed automated checks. In the two-shot and reference cases, the validator or local repair sometimes failed to make a copyable output. These are the priority for the next translator-quality iteration. The utility ranking above is based on one installed 7B local model and this prompt set, so it should not be treated as a general ranking of the underlying image/video generators.

## Reproduction

- `node research/_addenda/promptstudio-usefulness-eval-2026-09-22.mjs`
- `node research/_addenda/promptstudio-usefulness-eval-2026-09-22.mjs --targeted`
- `node research/_addenda/promptstudio-grounding-harness.mjs` (existing regression checks; passed)
