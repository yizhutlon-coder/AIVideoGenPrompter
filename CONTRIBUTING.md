# Contributing

Thanks for helping — this project improves through evidence, and contributions are judged the same way its research is.

## The ground rules

- **Everything is evidence-graded.** The app's knowledge comes from `research/`, where every claim carries a grade (`[OFFICIAL]` / `[STAFF]` / `[TESTED]` / `[LORE]`) and a source URL. A correction PR that says "the Wan camera guidance is wrong" needs a source; one that says so with a fixed-seed grid is gold. See `docs/RESEARCH-PLAN.md` for the standards.
- **Single-file architecture is sacred.** No frameworks, no CDNs, no build step, no external fonts. These files must run offline from a double-click on a school laptop. If your change needs npm, it needs a rethink.
- **Privacy is the product.** No network calls except `127.0.0.1`. A PR adding any other endpoint will be declined regardless of intent.

## Where things live (all inside `PromptStudio.html`)

`TARGETS` — per-model system prompts and examples · `KNOWLEDGE` — the tutor's knowledge bank · `GOTCHAS` — the myth/reality cards · `validate()` — the format checkers · `WF_TEMPLATES` — verified ComfyUI workflow templates (ground truth in `research/_addenda/comfy-templates/INDEX.md`).

## Before you open a PR

Extract the script blocks and check them (`node --check`), and boot the app in jsdom with a mocked Ollama `/api/tags` to confirm it reaches "offline & ready" — test recipes are throughout the git log. Mark modified files per Apache 2.0 §4(b). Contributions are accepted under the repo's Apache 2.0 terms (§5).

## Especially welcome

Corrections with receipts; new model dialects sourced from official guides; Chinese-community findings (half this corpus's edge comes from 中文 sources); fixed-seed tests of anything currently graded `[LORE]`; translations of the student-facing text.
