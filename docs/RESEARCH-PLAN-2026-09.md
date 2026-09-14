# Research Plan 2026-09 — Knowledge-bank expansion with Opus subagents

**Purpose.** Spend an unattended session growing the evidence-graded corpus under `research/` and producing a ranked, line-referenced fold-in proposal for the app (`KNOWLEDGE`, `GOTCHAS`, `TARGETS` system prompts, validators). Successor to `docs/RESEARCH-PLAN.md` (Aug 2026); same standards, narrower targets: it goes after the **known gaps and open contradictions** recorded in `research/digests/2026-08-28-digest.md` rather than re-surveying everything.

**Baseline state (2026-09-03).** Corpus covers 12 dialects with ≥4 gold pairs each and five cross-cutting files. Weakest areas by the digests' own accounting: SCAIL-2 (zero hits two sweeps running), SDXL fine-tune recipes (nothing from either agent), Krea 2 Chinese coverage (zero), `[STAFF]` evidence (zero claims last run), Reddit (structurally unreachable), and an unapplied backlog of 10 ranked "recommended incorporations" plus 7 recorded contradictions. Also new since the last sweep: the Meta Inspector tool and `research/_addenda/comfyui-metadata.md`, which the 💬 Ask tutor does not yet know about.

---

## Operating rules for every agent

1. **Write only under `research/`.** Never touch `PromptStudio.html`, `tools/`, or `docs/` except the synthesis agent writing `docs/FOLD-IN-2026-09.md`. Append dated `## 2026-09 sweep` sections to existing model files; do not rewrite or reorder existing content.
2. **Evidence labels on every claim:** `[OFFICIAL]` `[STAFF]` `[TESTED]` `[LORE]` `[SPECULATION]` `[SYNTHESIS]` `[USER-VERIFIED]`, each with URL + access date. Quote rewriter prompts and official examples **verbatim in fenced blocks**. Conflicting sources: keep both, say so.
3. **Absence claims are scoped.** Never write "X does not exist"; write "not found on {surfaces searched}". Standing rule from the 08-28 erratum: civitai.red is invisible to fetches; Reddit is unreachable; say so when relevant.
4. **"Nothing found" is a deliverable.** Every brief item gets a line in the file's nothing-found register so nobody re-hunts it.
5. **Version- and date-stamp everything.** Model checkpoint names, repo commit or release tag, ComfyUI version, doc revision date.
6. **Chinese sources outrank English mirrors for Alibaba-family models** (Wan, Qwen-Image, Z-Image). Search in Chinese (知乎, Bilibili, 魔搭 ModelScope, 通义 docs, Feishu docs). Report machine-translation risk.
7. **Tooling notes (as learned during the 2026-09-03 run — see the digest's "Method & spend" for detail):** `raw.githubusercontent.com` works (the 08-28 note is stale); docs.comfy.org serves clean markdown, index at `/llms.txt`; GitHub issue/discussion **HTML** pages work, but `api.github.com` is unreliable (empty bodies for most endpoints) and GitHub `?q=` search pages return empty — closed issues are therefore hard to harvest; HF discussion index pages and `/<user>/activity/community` work (best route to `[STAFF]` quotes), detail pages may be cache-stale; civarchive.com works and shows author labels, while civitai.com, civitai.red, Reddit, Discord and web.archive.org are unreachable; ModelScope `/api/v1/models/ORG/NAME` JSON works; HF `?author=` listings are stale — add `search=`; Feishu docs are login-gated (retire that target). Sandbox bash has no network. Do not attempt to bypass a refused domain by other means.
8. **Do not commit.** The Windows working tree is CRLF while the index is LF; a commit from the sandbox would touch every file. Leave git to the maintainer.
9. **Budget:** each agent stops at ~60 fetches or when its brief is exhausted, whichever first, and always writes its file even if partial. A partial file with an honest register beats no file.

---

## Wave 1 — Gap-fill sweeps (6 agents, parallel)

Each writes into the named model file under a new `## 2026-09 sweep` header using the sub-headers: `### New official guidance` · `### Chinese sources` · `### Tested findings` · `### Contradicts current corpus` · `### Few-shot gold (new pairs)` · `### Validator changes` · `### Nothing-found register` · `### Sources`.

### 1A — SCAIL-2 from scratch → `research/scail2.md`
Two sweeps found nothing; treat as unexplored. Targets: `zai-org/SCAIL-2` repo on its `wan-scail2` default branch (verify the branch quirk), the paper and its ablations, official ComfyUI/Kijai nodes and their READMEs, the exact enhancer prompt text if public, mask-colour palette source comment, `--matchnearest`, 81-frame/5-overlap Extend arithmetic, per-segment prompt fields. Chinese: 智谱/Z.ai announcements, Bilibili tutorials, 知乎 threads — quote failure modes. Deliver ≥2 new gold pairs (Animation, Replacement) and a "prompt-inert or not?" verdict with evidence grade.

### 1B — SDXL fine-tune recipes → `research/sdxl.md`
Per checkpoint family, from the **model card itself** (Civitai main site, civarchive derivative pages, HF cards): Juggernaut (XI / Ragnarok), RealVis (v5+), Pony v6 & v7, Illustrious 2/3, NoobAI (eps vs **v-pred** — Karras ban), Animagine 4. Capture verbatim: recommended sampler/scheduler/steps/CFG, quality-tag prefix, official negative list, resolution list, "do not use" notes. Produce a **recipe table** and a per-family validator rule set (e.g. Pony requires `score_9…`; NoobAI v-pred forbids `karras`). Note what our current `sdxlAnime` export gets wrong.

### 1C — Krea 2 · Z-Image · FLUX.2 klein → `research/flux.md`, `research/z-image.md`, `research/_addenda/krea-character-art.md`
Krea 2: verify the nine official LoRA trigger words from the Krea repo/HF, the ~512-token cliff (source + methodology), Chinese coverage attempt (report zero if zero). Z-Image: Base negatives and `cfg_normalization` guidance from the official repo; whether Edit/Omni-Base released (check model zoo table verbatim); MultiBind mitigation evidence. klein: encoder mismatch symptoms (Qwen3 vs Mistral), the "no negative path" diffusers issue status, BFL prompting-guide diffs since Aug.

### 1D — LTX-2.5 after the enhancer change → `research/ltx23.md`
HF `Lightricks/LTX-2.5*/discussions` for **`[STAFF]`** answers (esp. discussions/14 on the Prompt Enhancer default), Auto Duration and Native Multishot prompt semantics (do named cuts change the "one camera verb first" rule?), IC-LoRA control docs, the T2V/I2V upscaler snippet discrepancy, `num_frames % 8 == 1` and ÷32 rules verbatim, licence text. Any Chinese vocabulary for LTX (expect none — record it).

### 1E — MiniMax H3 → `research/minimax-h3.md`
Feishu doc set changelog (版本更新), licence file verbatim (territorial exclusion, $20M gate, attribution, no-distill), ComfyUI `embedding:` syntax for H3 and what it implies for "prompt-inert", int8 vs bf16 hardware qualifiers, Context-IR/2K cloud-only confirmation, LoRA ecosystem on HF (AI-Toolkit) with names. Reference-tag arrival-order rules: find a primary or `[TESTED]` source.

### 1F — Wan 2.2 family → `research/wan22.md`
Diff `wan/utils/prompt_extend.py` (current) against the constants recorded in `_addenda/cn-sweep-2026-08-28.md`; confirm `tar_lang="zh"` default and dead `magic_prompt`. Wan-Dancer-14B and Wan2.2-Animate-2 dialects (the 人物外观描述/背景描述 two-field format verbatim). Camera-following: any new benchmark since AnimationBench. Finalize the Chinese vocabulary table (lighting, camera, aesthetic compounds, texture) with sources.

## Wave 2 — Cross-cutting (4 agents, parallel, after Wave 1)

### 2A — STAFF-claims harvest → `research/_addenda/staff-claims-2026-09.md`
Sole purpose: raise `[STAFF]` evidence from zero. Walk the HF discussion tabs and GitHub issues of every in-scope repo (Wan-AI, Lightricks, MiniMaxAI, zai-org, black-forest-labs, Tongyi-MAI/Z-Image, Qwen/Qwen-Image, krea) for maintainer-authored answers about prompting, length, negatives, language. One table: claim · who (role evidence) · verbatim quote · URL · date · which corpus line it confirms or contradicts.

### 2B — In-house test kit → `research/_addenda/test-kit-2026-09.md` + `research/_addenda/test-kit/*.json`
We cannot render here; design the tests the maintainer can run tomorrow. Priority test from the 08-28 digest: same seed, Qwen-Image-2512 and Krea 2, three encodings of identical content (prose / `Subject:/Lighting:/Camera:` labels / scrambled order). Also: ZH-vs-EN fixed-seed pairs for Wan 2.2 and Z-Image; negative-prompt inertness demonstration on Z-Image Turbo and klein. For each: hypothesis, exact prompts, ComfyUI workflow JSON built from `research/_addenda/comfy-templates/` (edit only documented points), seeds, what to look at, a results table to fill in. Outputs must drop back into the Meta Inspector so results carry their own recipe.

### 2C — ComfyUI operations for the tutor → `research/_addenda/comfyui-ops-2026-09.md`
Ground the 💬 Ask tutor for the questions students actually hit: missing-node install flow, wrong filename fails silently, OOM ladders (fp8/GGUF/offload/tiled VAE), `--disable-metadata` and the Meta Inspector, Save vs Preview, subgraph templates and where values live, frontend changes since Aug (docs.comfy.org changelog), `/object_info` link-up caveats. Cite docs.comfy.org and closed GitHub issues; include the metadata findings already in `comfyui-metadata.md` by reference, not by copy.

### 2D — New models register → `research/new-models.md`
Anything locally runnable released 2026-08-28 → today that a class would care about. Strict gate: downloadable weights + licence text + a ComfyUI path. Everything else goes in the closed-tier register (FLUX 3, Wan 2.5+, Qwen-Image 2.0/3.0 unless weights appeared). One short section each.

## Wave 3 — Verification and synthesis (2 agents, sequential)

### 3A — Adversarial verifier → `research/_addenda/verification-2026-09.md`
Sample ≥40 claims across all Wave 1–2 output (stratified by label). Re-fetch each source; mark **confirmed / overstated / unsupported / stale**. Separately, audit the live `KNOWLEDGE` string in `PromptStudio.html` (read-only) for lines that the new corpus contradicts or dates ("as of Aug 2026"). Refuse to soften findings for consistency's sake.

### 3B — Synthesis → `research/digests/2026-09-03-digest.md`, `research/INDEX.md`, `docs/FOLD-IN-2026-09.md`
Digest in the established format (new releases · official changes · tested · Chinese · contradicts · nothing-found · recommended incorporations · errata). Update INDEX completion table. Then the deliverable the maintainer acts on: **FOLD-IN** — a ranked list where each item names the exact target (`KNOWLEDGE` paragraph / `GOTCHAS` card / `TARGETS[key].system` / `WF` note / validator), the proposed text, the research file + section it rests on, its evidence grade, and a one-line risk note. Include the still-unapplied 08-28 backlog items with their current status. Nothing is applied to the app in this session.

---

## Execution notes

- Run waves as parallel `Agent` calls (`model: opus`), 4–6 per wave; Wave 3 waits for Wave 2. Give each agent its brief verbatim plus the operating rules, the file paths, and the 08-28 digest's relevant section as context. Ask each to return a ≤300-word summary listing its biggest finding, its biggest contradiction, and anything it could not reach.
- Expected spend: roughly 0.5–1.2M tokens per Wave 1–2 agent, more for 3A; ~10–14M total at the upper end. If budget tightens, drop 2D first, then 1C.
- Success criteria: every agent file has a nothing-found register; ≥10 new `[STAFF]` claims; SCAIL-2 and SDXL fine-tunes move from "nothing" to sourced recipes; FOLD-IN has ≥15 actionable items each with a target line and evidence grade; verifier finds and records at least one overstated claim (if it finds none, it did not look hard enough).
