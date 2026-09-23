# Retroactive evidence audit — 2026-09-17

First application of **rule 2b** (`docs/RESEARCH-PLAN-2026-09.md`): *an uncorroborated unofficial claim
is a point of interest, not a finding.* Eight claims the **app already ships** were put through a
confirm/disprove pass. Detail files:
[`lore-audit-2026-09-17-wan.md`](lore-audit-2026-09-17-wan.md) ·
[`lore-audit-2026-09-17-claims.md`](lore-audit-2026-09-17-claims.md).

Selection rule: not "all `[LORE]`" (455 instances corpus-wide) but rule 2b's gate — **single/thin
source + below `[TESTED]` + the app rests on it.** Nothing here is applied to `PromptStudio.html`.

## Verdicts

| # | Claim (as the app states it) | Where it bites | Verdict |
|---|---|---|---|
| 1 | Krea 2 has a ~512-token cap and **fails silently to a black frame past ~600** | HARD validator, `>2500` chars | 🔴 **CONTRADICTED** |
| 2 | *"NEVER use 'cinematic' — it triggers the stylization branch"* | HARD validator + KB, graded OFFICIAL | 🔴 **CONTRADICTED** |
| 3 | Qwen-Image 2512 prefers `Subject:/Camera:` label blocks over prose | KB, marked CONTESTED | 🔴 **CONTRADICTED ×2** |
| 4 | At 4/8 Lightning steps seed variance collapses — *"LORE, n≈3, no grids published"* | KB caveat | 🟢 **CONFIRMED — app under-claims** |
| 5 | Wan I2V caps: ≤100 EN words / ≤100 ZH characters | HARD validator ×2 | 🟢 **CONFIRMED** |
| 6 | EN/ZH rewriter asymmetry (D3) + azure-sky rule (D5) + `tar_lang="zh"` | KB | 🟢 **CONFIRMED, one framing fix** |
| 7 | Krea 2 `ONE prose paragraph, 80-140 words` | `TARGETS.krea2.system` | 🟡 already fixed in-app |
| 8 | LTX *"≤150 words"* belongs to the retired LTXV-0.9 enhancer | KB | 🟢 **CONFIRMED** |

## The three that moved

### 1. The Krea 2 black-frame cliff is not a length cliff 🔴
The whole claim rested on **ComfyUI issue #14782**, one reporter, which the 08-28 digest graded
`[TESTED]` on its quoted methodology. **The reporter has since retracted it** `[TESTED — retracted]`:

```
I no longer think this is primarily about prompt length alone
```

Corruption tracks `mod 256` of the **combined** sequence, on **Intel Arc XPU + comfy-kitchen Triton**,
and flips with `--enable-triton-backend`; **one corrupting case runs at `txtlen=165`**, far below any
cap. There *is* a maintainer reply (`comfyanonymous`) and it is a WONTFIX: *"ComfyUI behavior has
always been to pass your entire prompt to the model."*

**So the corpus's "open, no maintainer reply" is false, and it is shipped in the app.** What survives is
narrower and real: `encoder.py max_length = 512` — but that is a **caller-overridable default in a
reference script**, not a documented model limit, and **truncation is not corruption**.

> **App action:** delete the **HARD** severity and the black-frame claim. If anything is kept, keep an
> **advisory** grounded only in the surviving fact — Krea's reference encoder truncates at 512
> positions while ComfyUI does not, so the two paths diverge on long prompts. Do not tell students their
> frame will go black.

### 2. The "cinematic" ban is an inference, not a rule 🔴
The app enforces a HARD error and the KB grades it `OFFICIAL`, citing `system_prompt.py` rule 5. Rule 5,
verbatim `[LORE — transcription, corroborated ×2]`:

```
若原始prompt中没有风格，则不添加风格描述，若有风格描述，则将风格描述放于首位，若为2D插画等与现实电影相悖的风格，则不要添加关于电影美学的描写；
```

It contains **no token "cinematic" and no "stylization branch"**. The only suppression is **conditional
on a 2D/non-photoreal style**. The same constant elsewhere *commands* cinematic treatment
(`你是一位电影导演…添加电影元素`). Correct grade: **`[SPECULATION]`**. `system-prompt-audit-2026-09-10.md`
row 15 is wrong twice — it cites a rule that doesn't say this, and it grades a **transcription** as
`OFFICIAL`, which is the exact laundering rule 2b exists to stop.

**And there is a live user-facing bug.** The app's own system prompt (line 578/581) already states the
correct, conditional form — *suppressed for 2D styles*, and *"unless the user used it"* — but **the
validator regex has no such exemption**. A user asking for "cinematic lighting" is hard-blocked and sent
round the Fix loop, violating the app's own preserve-the-user's-content-words rule.

> **App action:** demote HARD → advisory; scope it to 2D/illustration styles; add the user-used
> exemption to the regex; regrade the KB line from `OFFICIAL` to `[SPECULATION]`; fix `system-prompt-audit` row 15.

### 3. The Qwen label-block claim has a plagiarised source and a vendor refutation 🔴
Civitai article 30826 is a **near-verbatim uncredited copy** of `help.apiyi.com` (2026-01-18) — an **API
reseller's marketing blog** — down to identical examples and identical 95%/70% figures; its headline
"~30%" appears only in its own TL;DR. And the vendor's own `prompt_utils_2512.py` contains **zero**
`Subject:`/`Camera:` tokens across 1,394 lines and says:

```
always prioritize a natural narrative over this rigid structure
```

Two independent grounds for retirement: the source is not what it appeared to be, **and** the vendor's
own rewriter refutes it. Note this also retires the 08-28 digest's framing of it as *"directionally
consistent"* with arXiv:2606.03715 — a marketing blog cannot corroborate a paper.

> **App action:** delete the CONTESTED line rather than keep it as a live alternative.

## The confirmations worth banking

- **#4 is the good kind of failure — we were too cautious.** `ModelTC/Qwen-Image-Lightning#42` has
  **published grids and a maintainer acknowledgment**, n≥5. Delete *"n≈3, no grids published"*; the
  claim is stronger than the app says.
- **#5 CONFIRMED on all three axes** — wording, numbers, **and addressee**. All four constants say
  改写后的/输出的 prompt / *"the rewritten prompt"*: these are caps on the **extender's output**. Agent W
  also established that `validate()` runs on the **rewriter's output**, not user input (~25 call sites
  pass `final`/`outputs[k]`), so the app enforces them in the right place. Keep as is; only drop the
  `OFFICIAL.` label from the KB sentence, since the source is still a transcription.
- **#6 CONFIRMED with a framing fix to the 09-13 digest:** D3 is real (ZH `选择部分` vs EN
  `选择不超过4种`), but `可以任选，不必每项都有` appears in **both** language variants, not only ZH as
  09-13 reported. D5 (azure sky, rationale `避免曝光`) confirmed verbatim in both. `tar_lang="zh"` is
  genuinely `[OFFICIAL]` from `generate.py` (snapshot 2026-09-16).

## Retire this target: `system_prompt.py` will never be fetchable

Five sweeps have failed. The cause is now structural, not bad luck: the file is **wildcard-imported
(`from .system_prompt import *`) and named nowhere in the repo**, so **no crawler holds its URL**, and
the fetch tool's provenance gate can only mint URLs that appear in a WebSearch Links array. **The gate
can never be satisfied for this file by search.** Grade stays `[LORE — transcription, corroborated ×2]`.
Stop spending sweeps on it; the only routes left are a maintainer paste or a local clone.

## Tooling learned (folded into the operating rules)

- **Search verbatim *content strings*, not filenames** — that is what minted a source URL this run.
- **GitHub cache ages run 0–85 days**, wider than the 46-day figure recorded on 09-17; and **GitHub
  *issue* pages return no `meta-request-id` at all**, so #14782's snapshot date is **undatable** — a
  caveat on verdict 1 that does not change its direction (the retraction text is unambiguous).
- Prefer `adg.csdn.net` over `blog.csdn.net`; HF `/raw/` over `/blob/` for **source files** (the reverse
  of the rule for **gated model cards**, where `/blob/main/` is the one that renders).

## Net

Of eight shipped claims, **three were wrong** — one of them a HARD validator rule telling students their
output would go black, one a HARD rule blocking a word the app's own system prompt says to allow, and
one resting on a plagiarised marketing post. Two confirmations were **under-stated** rather than
over-stated. Rule 2b earned its place on its first run.
