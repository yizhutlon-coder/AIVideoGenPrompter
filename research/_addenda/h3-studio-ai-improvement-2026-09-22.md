# H3 Studio AI Build research and iteration — 2026-09-22

No files were committed. Three Luna agents independently investigated Ollama output control, H3 source rules, and the current failure path. All tests used the local installation and synthetic text requests; no H3 video was generated.

## Sources and confidence

- High: [Ollama structured output documentation](https://github.com/ollama/ollama/blob/main/docs/capabilities/structured-outputs.mdx), [API reference](https://github.com/ollama/ollama/blob/main/docs/api.md), and [OpenAPI definition](https://github.com/ollama/ollama/blob/main/docs/openapi.yaml) support `POST /api/chat`, `format` as JSON or JSON Schema, nonstreamed responses, and model options. These are syntax controls; they do not claim to prevent invented scene facts.
- High: the [MiniMax H3 README](https://github.com/MiniMax-AI/MiniMax-H3/blob/main/README.md) provides the official model modes, section names, and shot examples. [Comfy-Org's H3 reference node documentation](https://github.com/Comfy-Org/embedded-docs/blob/main/comfyui_embedded_docs/docs/MiniMaxH3ReferenceToVideo/en.md) supports reference slot behavior and tag numbering.
- High, found during the expanded search: MiniMax's own [base prompt guide](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/docs/VIDEO_PROMPT_WRITING_GUIDE_base_en.md) and [full-reference guide](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/docs/VIDEO_PROMPT_WRITING_GUIDE_ref_en.md) confirm the exact alignment strings, shot syntax, six reference sections, and reference-label roles. The reference guide says generation descriptions are *normally* 350–500 words; that is a recommendation with stated exceptions, not a minimum for a valid prompt. This corrects the earlier source classification.
- Lower: the third-party `LeonSooLab/minimax-h3` guide supplied the numerical beat budgets used by H3 Studio. Those are retained as an optional planning guide, not a MiniMax requirement.

The official base guide permits adding details consistent with the user's intent and reserves soundscape `N/A` for explicit silence. This user's explicit product rule forbids adding unstated scene facts. The direct builder therefore keeps sparse descriptions sparse and uses `N/A` when audio is unspecified. That is an intentional fidelity tradeoff, not a claim that MiniMax recommends short or silent prompts.

## Controlled model trials

The evaluation script sent five cases to each installed model: simple text, plain text, two timed shots, one first-frame picture, and two numbered reference pictures. It scored both project structure and requested mode/media/action preservation. Raw responses and rubric findings are saved in the adjacent `h3-studio-ai-eval-*.json` files.

| Strategy | `qwen2.5:7b-instruct` | `R4C3R/qwen2.5-7b-instruct-heretic:q8_0` | Finding |
| --- | ---: | ---: | --- |
| Existing prompt | 0/5 | 0/5 | Invented references, wrong modes, missing shot markers. |
| Ollama `format: "json"` | 0/5 | 0/5 | Parseable JSON did not make the project faithful. |
| General JSON Schema | 0/5 | 0/5 | Structure improved, but semantics still failed. |
| Schema with mode and media count fixed from the case | 0/5 | 0/5 | Output fields still omitted actions or mixed content. |
| Revised prompt with less pressure to invent detail | 0/5 | 0/5 | Prompt wording alone did not resolve the failure. |

The fixed-schema experiment supplied the expected mode and media count to isolate the formatting question; a production builder would need to derive those facts from the request. This experiment does not establish performance for other models.

## Implemented change

For a narrow set of clear requests, H3 Studio now builds the project directly from the user's words. It handles text-only single actions, two or three explicit shots with given cut times, a numbered first/last-frame picture, and up to two numbered reference pictures. It does not create an absent asset, cut time, camera move, sound, music, or visual detail. A simple build works without Ollama. A complex request still uses the chosen local model.

The model path now rejects explicit picture-only requests if it invents a video or audio reference. Follow-up edits reject unsolicited changes to mode, media, duration, soundscape, or music. The existing full-project and Checks-card validation still run before application; a rejected draft leaves the previous project intact. UI copy explains which path handled the request and describes the Checks result as format checking, not factual proof.

## Iterative verification

1. The first direct-builder version passed five core cases in the pure-code harness and four live browser cases, including the two-picture battlefield request that had previously acquired an invented `<Video 1>`.
2. Added alternate duration phrasing, a simple smile, and specified clothing/setting. All built in the browser with no reference assets and passed the app Checks card. An alternate duration left “Make a video…” in the timeline; that wording was stripped and retested in the browser.
3. Added false-positive boundaries: requests with an unknown cut time, named video, dialogue, or a picture-number gap bypass the direct builder. The harness verifies these declines, along with literal content preservation and invented-asset rejection.
4. A real model follow-up, “Add rain sounds to the soundscape,” exposed an overly strict soundscape keyword check. After correcting it, the model changed only `ss` in the browser; mode, media, duration, scene, and music stayed intact.
5. After stopping Ollama, the browser built “A woman smiles for 8 seconds” through the direct path and passed format checks. The app also showed the expected Ollama-unavailable notice for model-driven work.
6. A final two-sentence request initially revealed that the direct builder kept only the last action. It now keeps both sentences in one shot. The corrected output and format check passed in the browser.

The final H3 harness passes 31 cases. The Prompt Studio grounding, Chinese-version, and security harnesses also pass. Browser checks confirmed the simple project modes, media counts, shot markers, app Checks result, and the follow-up edit.

## Remaining limits

- The direct builder deliberately covers only recognizable, explicit requests. Complex builds still depend on Ollama and can fail; a validation error means the draft was not applied.
- Format checks cannot prove that every arbitrary sentence is grounded in the user request. Review generated prose against the request before copying it.
- The tests verify project creation and editing, not whether MiniMax generates a good video from the assembled prompt.
