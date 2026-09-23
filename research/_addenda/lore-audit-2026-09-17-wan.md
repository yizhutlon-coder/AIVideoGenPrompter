# Retroactive LORE audit — Wan 2.2 rewriter-constant rules (rule 2b pass)

**Date:** 2026-09-17 · **Auditor:** Agent W · **Status:** research output only.
`PromptStudio.html`, `tools/` and `docs/` were NOT modified. Not committed.

## Why this file exists

`docs/RESEARCH-PLAN-2026-09.md` **rule 2b** — *an uncorroborated unofficial claim is a
point of interest, not a finding* — applied retroactively to three **HARD validator
errors** whose whole provenance is a third-party transcription of
`Wan2.2 wan/utils/system_prompt.py`, a file that had failed to be read on four
consecutive sweeps.

`research/_addenda/system-prompt-audit-2026-09-10.md` row 15 grades one of these
**"CONFIRMED … OFFICIAL"** against the transcription rather than the file. That is the
grade inflation rule 2b exists to stop.

## Evidence-label key

`[OFFICIAL]` vendor docs / model card / shipped repo source · `[STAFF]` named vendor
employee · `[TESTED]` measured, methodology stated · `[LORE]` community consensus, incl.
**`[LORE — transcription, not vendor]`** and **`[LORE — code mirror, not vendor repo]`** ·
`[SPECULATION]` mechanism proposed, never measured · `[SYNTHESIS]` this auditor's
inference from two or more sourced facts.
`[USER-VERIFIED]` is the instructor's label alone and is not used here.
**`[OFFICIAL-3P]` is struck from this corpus and is not used.**

---

## § 0 — Two premises corrected before the verdicts

### 0a. The vendor file is still unread. Provenance grade is UNCHANGED.

`https://github.com/Wan-Video/Wan2.2/blob/main/wan/utils/system_prompt.py` was **not
reachable** this pass — see §Method. Everything below that quotes the *contents* of the
six constants still rests on **two independent third-party transcriptions**, not on the
file:

- `https://www.cnblogs.com/skiinaurora/p/19176083` — posted 2025-10-30, accessed
  2026-09-17. Reproduces all six constants as a single verbatim code dump.
- `https://blog.csdn.net/a486259/article/details/155646844` (author `a486259`, posted
  2025-12-07), read via the devpress mirror
  `https://adg.csdn.net/69522e405b9f5f31781b2e3f.html`, accessed 2026-09-17.
  Reproduces the ZH T2V, ZH I2V and ZH EMPTY constants with commentary.

Different authors, six weeks apart, **verbatim-identical** on every clause this audit
turns on. That is corroboration, and corroboration only.

> **Grade for the constants' text remains `[LORE — transcription, not vendor],
> corroborated ×2`.** This pass did NOT raise it. A third mirror is not the file.

### 0b. `validate()` runs on the REWRITER'S OUTPUT, not on the user's input.

The audit brief assumed the caps are enforced "on the user". **They are not.**
`PromptStudio.html` defines:

```js
function validate(key, text, intent) {
```

and every one of its ~25 call sites passes the **local Qwen rewriter's produced prompt**
as `text` (`final`, `outputs[k]`, `lastRun.outputs[key]`, `pre.textContent`, the `Fix`
and `Revise` drafts, the Chinese version, a pin's stored text). `intent` is the user's
request and is used only as the **grounding source** to check the output against.

There is no length cap anywhere on what the user may type. So on the *addressee*
question the app is already aligned with the official file, and the sharpest form of the
brief's worry does not arise. This materially changes the remedy for Target 2.

A `HARD:` issue is still consequential: it blocks Copy and Pin, and drives the automatic
`Fix` retry loop (`splitSeverity(validate(...)).hard`).

---

## § 1 — Target 1: the "cinematic" ban

**CLAIM** (verbatim, as the app states it). Two places:

- `TARGETS.wan.system`: `NEVER use the word "cinematic" unless the user used it.`
- `KNOWLEDGE ¶WAN 2.2`: `avoid the word "cinematic" (triggers the stylization branch)`

**What the app does with it:** a **HARD validator error**, fired unconditionally on the
rewriter's positive prompt:

```js
if (/\bcinematic\b/i.test(pos)) issues.push('HARD: contains "cinematic" — triggers the Wan stylization branch; describe the look concretely');
```

**VERDICT: CONTRADICTED** — as an attribution to rule 5. Rule 5 does not mention the
token, and the surrounding text points the other way.

**Evidence.** Rule 5, verbatim, identical in `T2V_A14B_ZH_SYS_PROMPT` **and**
`T2V_A14B_EN_SYS_PROMPT`:

```
5. 若原始prompt中没有风格，则不添加风格描述，若有风格描述，则将风格描述放于首位，若为2D插画等与现实电影相悖的风格，则不要添加关于电影美学的描写；
```

Rule 5 states three things: don't invent a style; if a style is present put it first; if
the style is 2D-illustration-like, don't add 电影美学 description. **Nothing about the
token "cinematic", and no "stylization branch".**

Worse for the claim, the same constant opens by *commanding* cinematic treatment:

```
你是一位电影导演，旨在为用户输入的原始prompt添加电影元素，改写为优质Prompt，使其完整、具有表现力。
```

("You are a film director, whose aim is to add **cinematic elements** to the user's
original prompt…") The rewriter's entire job is 电影美学. The only suppression in the file
is conditional on a **2D/illustration style**, not on a word.

- Source: `https://www.cnblogs.com/skiinaurora/p/19176083` · accessed 2026-09-17 ·
  non-GitHub, no `meta-request-id`; page's own published date 2025-10-30.
- Corroborating source: `https://adg.csdn.net/69522e405b9f5f31781b2e3f.html` · accessed
  2026-09-17 · published 2025-12-07.

**Absence claim, surfaces named.** The string "cinematic" / 电影 as a *banned token*
appears in **none** of: rule 5 (ZH or EN); the EN rule-1 aesthetic vocabulary lists
(时间/光源/光线强度/光线角度/色调/镜头尺寸/拍摄角度/构图 — no "cinematic" entry); any of
the four ZH or four EN T2V exemplars; any of the nine I2V exemplars; the I2V or EMPTY
constants. The 09-13 sweep's own reasoning was explicitly **"by omission"** — 电影美学
appears in headings and rewriter *instructions* but never inside official example
*prompts*. An omission argument is not a prohibition.

**Correct grade it should carry now:**
`[SPECULATION]` — mechanism proposed, never measured. (The 09-13 "by omission"
inference is at best `[SYNTHESIS]`, and it does not reach a *prohibition*.)
**It is not `[OFFICIAL]`.** `system-prompt-audit-2026-09-10.md` **row 15**
("CONFIRMED | `system_prompt.py` rule 5 style branch … OFFICIAL") is **wrong twice
over**: it cites a rule that does not say this, and it grades a transcription as vendor
authority. Row 15 should be re-graded **CONTRADICTED (attribution) / UNSOURCED (claim)**.

**What the app should do differently — concretely:**

1. **Demote the validator rule from `HARD:` to `advisory:`.** No first-party surface
   forbids the token; an advisory costs nothing if the guess is right and stops blocking
   Copy/Pin if it is wrong.
2. **Fix the live inconsistency.** `TARGETS.wan.system` says *"NEVER use the word
   'cinematic' **unless the user used it**"*, but the validator regex has **no such
   exemption**. A user who asks for "cinematic lighting" produces a rewriter output that
   is permitted by the system prompt and hard-blocked by the validator — which forces the
   `Fix` loop and can strip a word the user explicitly supplied, violating the app's own
   "preserve every content word the user gave" rule. If the rule is kept at all, the
   regex must carry the same `unless the user used it` exemption (i.e. test `intent`).
3. **Correct the `KNOWLEDGE ¶WAN 2.2` wording.** "triggers the stylization branch" asserts
   a mechanism nobody has observed. The defensible, sourced statement is the *2D*
   exemption, which is real: *if the style is 2D/illustration, the official rewriter adds
   no 电影美学 tokens* — and the app already carries that correctly elsewhere.

---

## § 2 — Target 2: the I2V caps (≤100 English words / 100 Chinese characters)

**CLAIM** (verbatim, as the app states it):

- `TARGETS.wanI2V.fmt`: `motion-only ≤100 words — the image carries everything else`
- `TARGETS.wanI2V.system`: `Hard cap 100 words in English, 100 characters in Chinese; a sparse request may be only a few words.`
- `KNOWLEDGE ¶WAN 2.2`: `the EN rewriter targets ~100 WORDS, the ZH rewriter says 改写后的prompt字数控制在100字以下 — 100 Chinese CHARACTERS, roughly a third of the budget.` — labelled **OFFICIAL** in the KB text.

**What the app does with it:** two **HARD validator errors** (FOLD-IN A22), on the
rewriter's output:

```js
if (!isHanDominant(pos) && w > 100) issues.push('HARD: over the official 100-word I2V cap (' + w + ' words) — motion content only');
if (isHanDominant(pos) && hI2V > 100) issues.push('HARD: over the official 100-character I2V cap (' + hI2V + ' 字) — the ZH rewriter caps characters, not words; motion content only');
```

**VERDICT: CONFIRMED as to wording, numbers and addressee — but only at transcription
grade, not `[OFFICIAL]`.**

**Evidence — exact wording and exact numbers.** All four I2V constants carry the cap, and
all four address the **rewriter's own output**:

```
I2V_A14B_ZH_SYS_PROMPT:        改写后的prompt字数控制在100字以下
I2V_A14B_EN_SYS_PROMPT:        Limit the rewritten prompt to 100 words or less.
I2V_A14B_EMPTY_ZH_SYS_PROMPT:  输出的prompt字数控制在100字以下
I2V_A14B_EMPTY_EN_SYS_PROMPT:  Limit the output prompt to 100 words or less.
```

- Source: `https://www.cnblogs.com/skiinaurora/p/19176083` · accessed 2026-09-17 (all
  four constants). ZH pair corroborated at
  `https://adg.csdn.net/69522e405b9f5f31781b2e3f.html` · accessed 2026-09-17.

**The addressee question, answered.** Decisively **the rewriter's output**, not the
user's input: 「**改写后的**prompt」 = "the prompt **after rewriting**"; 「**输出的**
prompt」 = "the **output** prompt"; EN "the **rewritten** prompt" / "the **output**
prompt". There is no instruction anywhere in these constants about the length of what the
user may supply — the constants say the opposite, that user input may be
「长度过长或者过短」 ("too long or too short") and must be *refined* to fit.

Independent vendor support for the same addressee reading, from the **real Wan 2.1
repo file** (`LM_*`/`VL_*` constants, the ancestors of these):

```
8. 改写后的prompt字数控制在80-100字左右
7. The revised prompt should be around 80-100 words long.
9. Control the rewritten prompt to around 80-100 words.
```

- `https://github.com/Wan-Video/Wan2.1/blob/main/wan/utils/prompt_extend.py` ·
  accessed 2026-09-17 · **snapshot 2026-09-07 18:03Z** (`meta-request-id`
  `04A1:169FA7:CB954D:11FF2F8:6A9EFC6F`, hex `6A9EFC6F` = 1788804207; **9 days stale**).
  `[OFFICIAL]` — but for **2.1**, whose numbers (80-100, "around"/左右) and constant
  names differ from 2.2's. Cited only for the *addressee* pattern, not the numbers.

**Correct grade it should carry now:**
`[LORE — transcription, not vendor], corroborated ×2` for the text and the numbers.
The `KNOWLEDGE ¶WAN 2.2` sentence that ends **"OFFICIAL."** is **over-graded** and should
read `[LORE — transcription, corroborated]`. The EN-words-vs-ZH-characters split is
real and correctly described.

**What the app should do differently — concretely:**

1. **Keep the two HARD checks where they are.** Per §0b they already fire on the
   rewriter's output, which is exactly what the constants govern. No re-scoping needed —
   the brief's worry does not apply to this codebase.
2. **Downgrade the KB label only.** Change `OFFICIAL.` to a transcription-grade hedge in
   the `KNOWLEDGE ¶WAN 2.2` I2V sentence.
3. **Consider softening "Hard cap" in `TARGETS.wanI2V.system`.** The ZH form is 以下
   ("or less") — a genuine ceiling, so "hard cap" is fair for ZH; the EN form is likewise
   "or less". This one is defensible as written. Leave it.
4. **Note for the record:** `--use_prompt_extend` defaults to **False** in the vendor
   `generate.py`, so on a default local run no official rewriter executes and this cap
   governs nothing upstream. The app's use of it as a house style target for its own
   rewriter is still reasonable, but it is a *house* target in that case.

---

## § 3 — Target 3: the EN/ZH asymmetry (D3), the azure-sky rule (D5), `tar_lang`

### 3a. D3 — the 4-aesthetic-token cap

**CLAIM** (as the 09-13 digest recorded D3): ZH says 可以任选，不必每项都有 (no cap on
aesthetic axes) while EN says 选择不超过4种 (hard cap of 4).

**What the app does with it:** **advisory only**, and the code comment says so:

```js
// D6 — advisory only (never an error): the EN rewriter is instructed 不超过4种, the ZH one has no cap
```

**VERDICT: CONFIRMED — with a correction to how the asymmetry was written down.**

**Evidence.** Rule 1 opening clause, the two constants side by side:

```
T2V_A14B_ZH_SYS_PROMPT:
1. 对于用户输入的prompt,在不改变prompt的原意（如主体、动作）前提下，从下列电影美学设定中选择部分合适的时间、光源、…、构图的电影设定细节,将这些内容添加到prompt中，让画面变得更美，注意，可以任选，不必每项都有

T2V_A14B_EN_SYS_PROMPT:
1. 对于用户输入的prompt,在不改变prompt的原意（如主体、动作）前提下，从下列电影美学设定中选择不超过4种合适的时间、光源、…、构图的电影设定细节,将这些内容添加到prompt中，让画面变得更美，注意，可以任选，不必每项都有
```

- Source: `https://www.cnblogs.com/skiinaurora/p/19176083` · accessed 2026-09-17 (only
  this transcription carries the EN constant; the CSDN/devpress one covers ZH only and
  says so explicitly: 「这里只分析中文结构的提示词」).

**The correction.** The cap asymmetry is real — ZH **选择部分** ("select some") vs EN
**选择不超过4种** ("select **no more than 4**"). But the digest's framing sets
可以任选，不必每项都有 against 不超过4种 as if they were the two halves of the split.
They are not: **可以任选，不必每项都有 is present verbatim in BOTH constants.** The EN
prompt therefore says, in one sentence, both "no more than 4" and "pick freely, you need
not have every item" — a genuine internal tension in the vendor text, which is itself
worth recording. The honest statement of D3 is:

> ZH 选择**部分** / EN 选择**不超过4种**; the 可以任选，不必每项都有 clause is **common to
> both** and is not the ZH side of the asymmetry.

Also worth noting: this EN constant is **written in Chinese** and merely *orders* English
output (「输出必须是英文！」), and its own length rule is stated in 字 —
「输出必须是全英文，改写后的prompt字数控制在60-200字左右」 — i.e. the EN rewriter's cap is
expressed as a **character** count too. That sharpens the existing note that the app's
"35-120 English words" band (audit row 5) is house guidance with no vendor basis.

**Correct grade:** `[LORE — transcription, not vendor]`, **single-source** for the EN
constant (cnblogs only). Weaker than the ZH material. Since the app already treats this
as advisory-only, the thin sourcing costs nothing.

**What the app should do differently:** **keep as is** (advisory). Optionally correct the
D3 wording in the 09-13 digest per the correction above.

### 3b. D5 — the azure-sky rule

**VERDICT: CONFIRMED** (at transcription grade). Rule 6, verbatim, **identical in both**
`T2V_A14B_ZH_SYS_PROMPT` and `T2V_A14B_EN_SYS_PROMPT`:

```
6. 若prompt出现天空的描述，则改为湛蓝色的天空相关描述，避免曝光；
```

The stated rationale is **避免曝光** ("avoid overexposure") — worth carrying, since it
explains the rule and makes it checkable.

- Source: `https://www.cnblogs.com/skiinaurora/p/19176083` · accessed 2026-09-17.
- ZH corroborated: `https://adg.csdn.net/69522e405b9f5f31781b2e3f.html` · accessed
  2026-09-17.

**Correct grade:** `[LORE — transcription, not vendor], corroborated ×2` (ZH);
single-source (cnblogs) for the EN constant.

### 3c. `tar_lang` defaults to `zh`

**VERDICT: CONFIRMED — and this one is genuinely `[OFFICIAL]`.** Read directly from the
vendor repo:

```python
    parser.add_argument(
        "--prompt_extend_target_lang",
        type=str,
        default="zh",
        choices=["zh", "en"],
        help="The target language of prompt extend.")
```

- `https://github.com/Wan-Video/Wan2.2/blob/main/generate.py` · accessed 2026-09-17 ·
  **snapshot 2026-09-16 17:38Z** (`meta-request-id`
  `9241:E5937:102F37:1589EC:6AAAD423`, hex `6AAAD423` = 1789580323; **1 day old**).
  `[OFFICIAL]`.

Corroborated in the expander itself, whose signature carries the same default:

```python
    def __call__(self, prompt, system_prompt=None, tar_lang="zh", image=None, seed=-1, *args, **kwargs):
```

- `https://huggingface.co/spaces/dangthr/Wan-2.2-5B/raw/main/wan/utils/prompt_extend.py`
  · accessed 2026-09-17 · `[LORE — code mirror, not vendor repo]` (a third-party Space
  fork; the **official** `Wan-AI/Wan-2.2-5B` Space carries the identical path — see
  §Method — but its blob view returns no source).

**Bonus `[OFFICIAL]`-adjacent structural confirmations** from that same mirror, all of
which the corpus had only at transcription grade:

```python
from .system_prompt import *

DEFAULT_SYS_PROMPTS = {
    "t2v-A14B": {"zh": T2V_A14B_ZH_SYS_PROMPT, "en": T2V_A14B_EN_SYS_PROMPT},
    "i2v-A14B": {"zh": I2V_A14B_ZH_SYS_PROMPT, "en": I2V_A14B_EN_SYS_PROMPT,
                 "empty": {"zh": I2V_A14B_EMPTY_ZH_SYS_PROMPT, "en": I2V_A14B_EMPTY_EN_SYS_PROMPT}},
    "ti2v-5B": {"t2v": {...}, "i2v": {...}},
}
```

```python
    def decide_system_prompt(self, tar_lang="zh", prompt=None):
        assert self.task is not None
        if "ti2v" in self.task:
            if self.is_vl:
                return DEFAULT_SYS_PROMPTS[self.task]["i2v"][tar_lang]
            else:
                return DEFAULT_SYS_PROMPTS[self.task]["t2v"][tar_lang]
        if "i2v" in self.task and len(prompt) == 0:
            return DEFAULT_SYS_PROMPTS[self.task]["empty"][tar_lang]
        return DEFAULT_SYS_PROMPTS[self.task][tar_lang]
```

This **confirms** three standing corpus claims that were previously transcription-only:

1. The six constants **do** live in `wan/utils/system_prompt.py`, not in
   `prompt_extend.py` (the `from .system_prompt import *` line). The KB sentence
   "constants live in wan/utils/system_prompt.py, NOT prompt_extend.py" is **correct**.
   *(This is also why the file has evaded four sweeps: it is imported by wildcard and
   never named in `generate.py`, so search engines have no inbound link to index — see
   §Method.)*
2. **TI2V-5B has no empty-prompt branch** — the `if "ti2v" in self.task` early return
   fires before the `len(prompt) == 0` check, so an empty prompt on `ti2v-5B` is an
   empty prompt, never an auto-caption. The KB claim is **CONFIRMED**.
3. `ti2v-5B` reuses the **A14B** constants for both its t2v and i2v paths.

---

## § 4 — Summary table

| # | Claim | App treatment | Verdict | Grade now | Action |
|---|---|---|---|---|---|
| 1 | "cinematic" is banned; rule 5 stylization branch | **HARD error** | **CONTRADICTED** (attribution) | `[SPECULATION]` | **Demote to advisory**; add the `unless the user used it` exemption; fix KB wording; re-grade audit row 15 |
| 2 | I2V ≤100 EN words / ≤100 ZH 字 | **HARD error** ×2 | **CONFIRMED** (wording, numbers, addressee) | `[LORE — transcription], corroborated ×2` | **Keep as is**; drop the `OFFICIAL.` label in KB text |
| 3a | D3 EN 不超过4种 vs ZH no cap | advisory | **CONFIRMED**, framing corrected | `[LORE — transcription]`, single-source (EN) | **Keep as is**; correct D3 wording in the 09-13 digest |
| 3b | D5 azure sky | KB text | **CONFIRMED** | `[LORE — transcription], corroborated ×2` | Keep; add the 避免曝光 rationale |
| 3c | `tar_lang` defaults `zh` | KB text / routing | **CONFIRMED** | **`[OFFICIAL]`** | Keep |

**Net effect of this pass: exactly one of the three HARD rules loses its footing.**
Targets 2 and 3 survive intact; Target 1 does not.

---

## § Method — did the WebSearch-minting route work?

**Partly. It minted the repo but never the target file.** Inherit this.

### The gate is real and behaves exactly as briefed

A direct fetch of the target returned, verbatim:

> `URL not in provenance set. web_fetch can only retrieve URLs that appeared in a user
> message, a prior web_fetch result, or a WebSearch result.`

Pasting the URL into this agent's brief did **not** mint it, confirming the 2026-09-17 CN
sweep's finding.

### Queries that DID mint useful URLs

| Query | Minted |
|---|---|
| `Wan2.2 wan/utils/system_prompt.py T2V_A14B_ZH_SYS_PROMPT github` | `github.com/Wan-Video/Wan2.2/blob/main/generate.py` ✅ |
| `"system_prompt.py" Wan-Video Wan2.2 blob main wan utils` | `github.com/Wan-Video/Wan2.1/blob/main/wan/utils/prompt_extend.py` ✅ |
| `"若有风格描述" "将风格描述放于首位" Wan 改写 prompt` | the CSDN transcription + `huggingface.co/vidfom/wan2gp/.../prompt_extend.py` ✅ |
| `Wan2.2 prompt_extend.py "改写后的prompt字数控制在100字以下" I2V` | **`huggingface.co/spaces/dangthr/Wan-2.2-5B/raw/main/wan/utils/prompt_extend.py`** ✅ — the single most valuable mint of the pass |
| `"湛蓝色的天空" Wan2.2 prompt 改写 天空的描述 系统提示词` | `www.cnblogs.com/skiinaurora/p/19176083` ✅ |
| `huggingface spaces Wan-2.2-5B "wan/utils/system_prompt.py"` | official `huggingface.co/spaces/Wan-AI/Wan-2.2-5B/blob/ff5d8c.../wan/utils/prompt_extend.py` ✅ |

**The trick that worked:** searching a **distinctive verbatim string from the
transcription** (`改写后的prompt字数控制在100字以下`, `湛蓝色的天空`) rather than the
filename. Filename queries return the repo; content queries return file-level URLs, and
HF `/raw/` URLs return clean plain-text source with no JS and no cache wrapper.

### Queries that did NOT mint the target (10 distinct phrasings, all failed)

`"system_prompt.py" Wan-Video Wan2.2 blob main wan utils` ·
`"I2V_A14B_EMPTY_ZH_SYS_PROMPT" OR "I2V_A14B_EN_SYS_PROMPT" Wan2.2` ·
`github.com/Wan-Video/Wan2.2/blob/main/wan/utils/prompt_extend.py` ·
`"Wan2.2" repo "wan/utils/system_prompt.py" source code sys prompt constants` ·
`huggingface spaces Wan-2.2-5B "wan/utils/system_prompt.py"` ·
`"system_prompt.py" Wan 2.2 "T2V_A14B_ZH_SYS_PROMPT" huggingface raw` ·
`"Limit the rewritten prompt to 100 words" Wan I2V system prompt rewriter` ·
`Wan2.2 system_prompt.py 源码 "I2V_A14B_ZH_SYS_PROMPT" 提示词改写 全文` ·
`Wan2.2 wan utils system_prompt.py` (`allowed_domains: github.com`) ·
`Wan 2.2 system_prompt.py I2V_A14B_EMPTY sys prompt file` (`allowed_domains: huggingface.co`)

**Diagnosed root cause — this is the durable finding.** `system_prompt.py` is pulled in by
`from .system_prompt import *` and is **never named anywhere in the repo's prose,
README, or `generate.py`**. It therefore has **no inbound link for a crawler to follow**,
so no search index holds its URL, so the provenance gate can never be satisfied for it by
search. This is a structural dead end, not bad luck — **a fifth sweep using search should
not be attempted.** Only a surface that enumerates a directory (a git clone, the GitHub
API, a `raw.githubusercontent.com` path, or a ModelScope file-tree JSON) can produce it,
and each of those must itself first be minted.

### Route attempted and failed

Link-chaining: fetch a minted GitHub/HF page hoping its own HTML links a sibling path.
- `github.com/Wan-Video/Wan2.2/blob/main/generate.py` — renders full source ✅ but links
  only to `/tree/main` breadcrumbs, never to `wan/utils/`.
- `huggingface.co/spaces/Wan-AI/Wan-2.2-5B/blob/ff5d8c.../wan/utils/prompt_extend.py` —
  **returned an empty body**, confirming the brief: HF *blob* views render model cards but
  not source files. Use `/raw/` instead, which worked perfectly.
- `blog.csdn.net/a486259/article/details/155646844` — **returned an empty body**
  (interstitial). The `adg.csdn.net` devpress mirror of the same article returned the
  full text. **Prefer `adg.csdn.net` over `blog.csdn.net` on sight.**

### Freshness check (mandatory, per brief) — the cache is real and datable

| GitHub page | `meta-request-id` tail | Decoded | Age at 2026-09-17 |
|---|---|---|---|
| `Wan2.2/blob/main/generate.py` | `6AAAD423` | 1789580323 → **2026-09-16 17:38Z** | 1 day |
| `Wan2.1/blob/main/wan/utils/prompt_extend.py` | `6A9EFC6F` | 1788804207 → **2026-09-07 18:03Z** | 9 days |

Decode: take the final hex segment of `meta-request-id`, read as a Unix timestamp
(`int(h, 16)`). Both fall inside the briefed 0–46 day band. **Neither is ~10 weeks
stale** — the 09-10 errata's "GitHub HTML is ~10 weeks stale" remains a
mis-description of this per-URL cache. HF `/raw/` responses carry no `meta-request-id`
and cannot be dated this way; treat them as undated.

### Budget

~13 WebSearch calls, 7 fetches (2 of them empty). Well inside the ~35 allowance. Not
committed, per the record-keeping contract — the maintainer commits.
