# H3 Studio AI Build: expanded search and tests — 2026-09-22

This extends [the first improvement pass](h3-studio-ai-improvement-2026-09-22.md). Three Luna agents researched independent paths, and the promising local approaches were tested against the two installed Qwen 2.5 7B models. No files were committed and no new model was downloaded.

## Source correction

The original [MiniMax base prompt guide](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/docs/VIDEO_PROMPT_WRITING_GUIDE_base_en.md) and [full-reference guide](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/docs/VIDEO_PROMPT_WRITING_GUIDE_ref_en.md) are published under MiniMaxAI's own Hugging Face repository. These confirm the mode and alignment strings, `[Shot N]` syntax, six reference sections, tags, and dialogue syntax. The reference guide also says generation descriptions are *normally* 350–500 words. The earlier report's description of that range as only third-party advice was wrong and is corrected there.

The official base guide allows the rewriter to add details consistent with user intent and reserves `overall_soundscape: N/A` for explicit silence. This app's user-requested grounding policy is stricter: unspecified details must remain unspecified. The direct builder therefore keeps sparse prompts short and uses `N/A` for unspecified audio. This is a deliberate product choice, not an official MiniMax recommendation. Numerical beat budgets remain an optional Studio planning heuristic; they were not found as a rule in the primary guide.

The current FL2VA alignment text in H3 Studio already matches the official guide's unbracketed `Picture 1 (from Shot 1)` / `Picture 2 (from Shot N)` wording. The agent's preliminary warning about brackets was resolved by checking the actual code. No alignment patch was needed.

## Local alternatives tested

| Approach | Result | Interpretation |
| --- | --- | --- |
| Full-project generation with existing prompt, Ollama JSON mode, general schema, fixed schema, and revised prompt | 0/10 on each strategy | A valid JSON envelope did not ensure correct assets, modes, actions, or shot markers. [Results](h3-studio-ai-improvement-2026-09-22.md). |
| Ollama native tool call, five original cases × two models | 0/10 semantic passes | Function arguments supplied a schema-oriented transport, but the models still invented assets or missed H3 timeline content. [Raw results](h3-studio-ai-eval-tool-2026-09-22.json). |
| Exact-source-span extraction, seven cases × two models, initial prompt | 6/14 strict passes | Moving from full project writing to copying request spans is promising, but wrong asset types, missed actions, paraphrased quotes, and duration-as-cut errors remain. [Raw results](h3-studio-ai-span-eval-v1-2026-09-22.json). |
| Same span task with a stronger instruction and one worked example | 6/14 strict passes | The example helped some cases but also caused missing assets and spurious cut times. [Raw results](h3-studio-ai-span-eval-v2-2026-09-22.json). |

The span rubric requires every emitted quote to be a literal substring of the request, all expected actions and assets to be present with the correct kind, and only explicit cut times to be returned. Its first loose version appeared to pass 10/14; adding asset-kind and cut-time checks exposed four false passes. This is why the stricter 6/14 score is reported.

## Evidence and decision

[Ollama's structured-output documentation](https://ollama.com/blog/structured-outputs) supports JSON Schema through `format`; [Ollama's tool-calling documentation](https://github.com/ollama/ollama/blob/main/docs/capabilities/tool-calling.mdx) supports function schemas and arguments. [llama.cpp's grammar guide](https://github.com/ggml-org/llama.cpp/blob/master/grammars/README.md) offers further grammar controls, but they constrain output syntax, not whether the contents match the user's scene. Switching runtimes would also change the app's local setup without evidence of a semantic benefit.

The reliable current path remains: derive unambiguous mode, assets, actions, and cut times in JavaScript; render the H3 wrapper in JavaScript; use local models only for bounded tasks whose output can be checked against the original request. Reject uncertain drafts and leave the current project intact. The new span experiment is **not** wired into the app because 6/14 is too low for unattended use.

A stronger local model is a possible future test, not a verified fix. [Qwen's Qwen3 release](https://qwenlm.github.io/blog/qwen3/) reports improved instruction and tool-use performance, and [Ollama lists a local `qwen3:14b` build](https://ollama.com/library/qwen3%3A14b). It was not downloaded or tested here; model-card claims cannot substitute for the H3 regression suite.

## Next measurable experiment

For complex requests, present extracted assets, actions, dialogue, and cuts for user review before compiling, rather than applying a model-generated full project automatically. A candidate extractor should be accepted only if its source spans are exact, its asset inventory is complete, cut times are explicit, and every requested action is covered. Benchmark it on these seven cases plus user-provided real prompts, and require zero fabricated assets and zero silently dropped actions before connecting it to AI Build.
