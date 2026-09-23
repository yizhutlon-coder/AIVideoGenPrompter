# Versioning and review workflow

`main` is the public download. Keep work in a named review branch until it is ready to ship. A branch pushed to GitHub is a recoverable checkpoint; it is not a public release of the app.

The current checkpoint's open findings are recorded in [REVIEW-2026-09-23.md](REVIEW-2026-09-23.md).

## Save a checkpoint

1. Create a branch from the current work, named `codex/review-YYYY-MM-DD` (or a short feature name). Include the app, its tests, and the research or decision notes needed to understand the changes.
2. Keep local Ollama models, runtime binaries, media, and exported prompts out of Git. The repository ignores the usual model folders and Prompt Studio's default private export names. Check the staged file list before every commit.
3. Run the local checks listed below, commit the checkpoint, and push the branch. Open a pull request so the exact diff and test results are reviewable. Leave `main` alone until the review findings are resolved.

## Release a version

1. Resolve release-blocking findings on the review branch. Update the user-facing README and changelog for behavior changes, especially setup and privacy behavior.
2. Run automated checks, a fresh-launch check, and the relevant live Ollama/ComfyUI checks. The automated suite cannot prove model output quality or test every platform.
3. Regenerate `docs/SHA256SUMS.txt` with `node Update-Checksums.mjs`, then run `node Update-Checksums.mjs --check` and inspect the diff. These hashes identify files within a release; they do not authenticate the publisher by themselves.
4. Merge the reviewed branch into `main`. Tag that exact commit and publish release notes. Existing `v1.0` remains the first public snapshot; use `v1.1.0` for the next feature release and `v1.1.1` for a later fix, adjusting the version to match the actual scope.

## Fast local checks

From the repository root, run:

```text
node Update-Checksums.mjs --check
node research/_addenda/security-sweep-harness.mjs
node research/_addenda/promptstudio-grounding-harness.mjs
node research/_addenda/walkthrough-eval-2026-09-22.mjs
node guided-first-preview/verify-preview.mjs
git diff --check
```

GitHub runs the same offline checks on review branches and pull requests. A passing check means those known cases passed; it is not a security certification or a substitute for trying the app with real models.
