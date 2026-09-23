# Walk me through it — pilot and triage, 2026-09-22

## Decision

Built a guided prototype for three workflows where form structure has a clear benefit over a plain rewrite: Wan 2.2 I2V, MiniMax H3 one-shot reference generation/editing, and Qwen-Image 2.1 image editing. It lives behind the new button below Prompt Studio's text box and also opens as `tools/WalkThrough.html`. The main text translator remains the faster path for a simple one-line idea.

The wizard asks the task first, then reveals only its relevant fields. Subjects, actions, and references use Add buttons rather than asking for counts in advance. The resulting prompt is assembled by deterministic code from entered text; there is no Ollama call, no file inspection, and no external network call. Users connect the actual reference files in their generation workflow.

## What was tested

- Fourteen deterministic cases covered one and two Wan motions, sequence versus simultaneity, camera omission, missing actions, Qwen edits with one or two images, explicit keep constraints, H3 picture roles, replaced position guides, video and audio references, optional scene facts, simultaneous actions, video edit mode, and missing identity. All assembled prompts passed the existing target validators with no hard errors, or correctly requested missing information.
- Browser interaction verified the entry button, question choices, conditional forms, missing-field feedback, H3 assembly, Qwen image numbering (`Image 1` base, then `Image 2`), Qwen assembly and copy, and hiding a stale preview when a field changes. The H3 handoff was tested in the live app: both pictures, their descriptions, and all six prompt sections appeared in H3 Builder. Its Restore previous draft button returned to the draft that was present before import.
- The existing Prompt Studio grounding harness passed its 26 regression checks. Both local serving paths allow the new page. The release checksum list includes it.

## Usefulness judgment

The pilot is useful when it prevents role confusion or omitted constraints. For example, a two-picture H3 request yields separate character and scene Subjects with the supplied actions, camera, and sound; a Qwen edit binds the base image and added source to `<image1>` and `<image2>`. Wan I2V keeps only specified motion and camera behavior. The form cannot invent a sword, hairstyle, music, or unseen image content because its assembler has no source for those facts.

For a single action such as “the woman waves,” opening the wizard and filling fields takes more work than typing the sentence. The feature should remain optional. The H3 path currently assembles **one shot** and does not handle cut times or dialogue markup; it passes the draft to H3 Builder for those jobs, with a one-step restore if the builder already held a draft. Passing a format validator also does not establish that a target generator will follow the prompt; no image or video render comparison was performed in this pilot.

## Files and rerun

- `tools/WalkThrough.html` — guided UI and deterministic assembler.
- `research/_addenda/walkthrough-eval-2026-09-22.mjs` — run with `node research/_addenda/walkthrough-eval-2026-09-22.mjs`.
- `PromptStudio.html`, `tools/H3Builder.html`, both local server allowlists, `README.md`, and the release checksum manifest were updated for access, handoff, and packaging.
