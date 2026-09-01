# ComfyUI pain points BEYOND the interface — the full lifecycle of misery

**Purpose:** decide where **Prompt Studio** (offline single-file HTML prompt-engineering tool) can *genuinely* help a ComfyUI user, and — just as important — where it cannot. The companion file [`comfyui-ux-research.md`](comfyui-ux-research.md) covers the canvas/frontend. This file deliberately covers everything *else*: install, nodes, workflows, models, memory, errors, learning.

**Research window:** roughly Jan 2024 – Aug 2026, weighted heavily toward 2025–2026 (ComfyUI core v0.3.x → v0.24.x, frontend v1.16 → v1.4x, the Comfy Node Registry transition, Nodes 2.0, and Dynamic VRAM).

**All URLs accessed 2026-09-01.**

---

## Evidence labels

| Label | Meaning |
|---|---|
| `[OFFICIAL]` | Comfy-Org docs, blog, release notes, support KB, or source-of-truth code (`cli_args.py`) |
| `[STAFF]` | Named Comfy-Org maintainer/collaborator statement (comfyanonymous, ltdrdata/Dr.Lt.Data, christian-byrne, rattus128, comfyui-wiki, huchenlei, Yoland Yan) |
| `[TESTED]` | Reproducible claim with a log/repro in the primary source |
| `[USER]` | Verbatim user statement with URL |
| `[USER-PARA]` | Paraphrase from a search snippet or secondary aggregator; **not** verbatim |
| `[LORE]` | Widely-repeated community claim without a primary source located |
| `[NOT FOUND]` | Area searched, nothing usable |

### Methodology and access caveats — read this before trusting a quote

1. **GitHub reaction counts were unavailable this entire session.** Every issue page rendered `Reactions are currently unavailable`. Where the brief asked for "issue reaction counts where visible," the honest answer is **`[NOT FOUND]` — none were visible on any issue.** Traction is therefore proxied by: open/closed state, maintainer *labels* (`Potential Bug` vs `User Support` vs `Stale`), assignment to a named maintainer, comment/participant counts, forum view counts, and recurrence of the same title across years. This is a real weakening of the evidence and is not papered over below.

2. **Reddit could not be re-verified by me directly.** `reddit.com` 403s. The Redlib mirror `safereddit.com` returned readable thread text early in the session (that is where the r/comfyui quotes below come from, transcribed by a research subagent) but returned **empty page bodies on every one of my own later re-verification attempts** — apparently mirror rate-limiting. Reddit quotes below are marked `[USER]` with a **`⚠ re-verify`** flag. They are specific (handles, dates, comment counts) and internally consistent, and where a Reddit quote makes a *technical* claim I have corroborated the claim independently from a non-Reddit source. But the exact wording should be re-checked before it is quoted publicly.

3. **AI-generated SEO blogspam was excluded as evidence** — see the meta-finding immediately below. Domains excluded on sight: `wonderfullauncher.com`, `runaihome.com`, `popularai.org`, `apatero.com`, `thetoolshub.net`, `smartart.live`, `earngenix.com`, `markaicode.com`, `comfy-ui.net`, `comfyui.org`, `viblo.asia`. None of these is cited as user evidence anywhere in this file.

4. Several GitHub pages exceeded the fetch tool's size limit; where only a search snippet was verified, the finding is labelled `[USER-PARA]` and says so.

---

## 0. Meta-finding: the help-seeking layer itself is broken

This was not in the brief's category list, but it emerged so consistently that it belongs first, because it changes the value calculation for everything downstream.

**A generic troubleshooting search now returns almost no primary sources.** A search for `"ComfyUI error" fix guide 2026` returned a first page consisting of `thetoolshub.net`, `wonderfullauncher.com`, `smartart.live` (twice), `markaicode.com`, `comfy-ui.net`, `earngenix.com`, and a Medium post — **zero** results from reddit.com, docs.comfy.org, or github.com. A separate search for ComfyUI red-node confusion surfaced `wonderfullauncher.com` above any actual Reddit thread. The same pattern recurred across install, dependency, model-path, and PyTorch-version queries run independently by five research agents.

Spot-checking that content: it is templated, mutually near-identical, and restates generic advice ("update your GPU driver", "click Install Missing Custom Nodes") without touching the model-specific silent failures that are the actual hard problems. Some of it is actively harmful — e.g. blanket "reinstall the CUDA Toolkit" advice where the official fix is a `pip install` against the correct wheel index.

`[OFFICIAL]` For contrast, the real answer to the most-searched error is one command: "First uninstall torch… `pip install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cu130`" — and the same page warns Intel-GPU users explicitly **not** to follow it: "On Intel GPUs this error means ComfyUI tried to use CUDA because the XPU backend was not available. Do not follow the NVIDIA CUDA reinstallation steps above." — https://docs.comfy.org/troubleshooting/overview

**Why this matters for Prompt Studio:** a *curated, offline, versioned, honestly-sourced* knowledge bank is not competing with docs.comfy.org. It is competing with content farms — and on that comparison it wins by default. This materially raises the value of §7's opportunity.

---

## 1. Installation & environment

### 1.1 "Which Python is THE Python" is the master confusion

`[USER]` `[TESTED]` A user shows two different torch builds resolvable at once: `pip show torch` reports `2.8.0+cu126` from a conda `site-packages`, while `python -c "import torch"` resolves `2.8.0+cu129` from `D:\ComfyUI\.venv`.

> "I could not downgrade to the correct PyTorch version desired… how to make sure ComfyUI is using the desired version."
> — JackFrog, Comfy-Org/ComfyUI #10228, 2025-10-06. **Closed as stale, labelled `User Support`.** https://github.com/Comfy-Org/ComfyUI/issues/10228

`[OFFICIAL]` Comfy-Org's own docs treat this as the root cause of most repair failures: the fix command must target the environment that *starts* ComfyUI — for portable, `python_embeded`, "not your system Python, not a separate virtual environment." https://docs.comfy.org/installation/comfyui_portable_windows

**Assessment:** this is the single highest-frequency install failure and it is structural — it comes from shipping four install shapes (portable / desktop / manual venv / third-party launcher) with four different Python locations.

### 1.2 `update_comfyui_and_python_dependencies.bat` is a booby trap, and has been for over a year

`[USER]` Issue title, verbatim: *"accidently ran 'update_comfyui_and_python_dependencies.bat' and broke ComfyUI … (whoops lol)"*

> "Running ComfyUI on the cpu via run_cpu.bat works fine… but running ComfyUI with run_nvidia_gpu.bat doesnt work."
> — gluttonium, Comfy-Org/ComfyUI #7415, 2025-03-27, labelled `User Support`. https://github.com/Comfy-Org/ComfyUI/issues/7415

`[USER]` The identical failure, nine months later, **still open**:

> "After running update\update_comfyui_and_python_dependencies.bat as administrator and allowing it to complete successfully, ComfyUI can no longer start with GPU acceleration… AssertionError: Torch not compiled with CUDA enabled."
> — NateWu224, Comfy-Org/ComfyUI #11575, 2025-12-31, labelled `Potential Bug`. Traceback terminates inside `python_embeded\Lib\site-packages\torch\cuda\__init__.py`. https://github.com/Comfy-Org/ComfyUI/issues/11575

`[LORE]` "Torch not compiled with CUDA enabled" recurs as an issue *title* across at least #2427, #4845, #6679, #7433, #7826, #8431, #9887, #11575 — a multi-year recurrence signal even without per-issue traction data.

### 1.3 Updating core without updating the frontend/template packages is an officially-named failure mode

`[OFFICIAL]` docs.comfy.org troubleshooting, verbatim section heading and fix:

> **"'Frontend or Templates Package Not Updated'"** → `# After updating ComfyUI via Git, update frontend dependencies` / `pip install -r requirements.txt`
> https://docs.comfy.org/troubleshooting/overview

i.e. Comfy-Org itself recognises that `git pull` alone leaves you in a split-version state. This is the mechanism behind a large share of §3's workflow rot.

### 1.4 Frontend churn is loud, and users are freezing versions to escape it

`[USER]` Issue title in full caps — *"Frontend is totally broken! PLEASE FIX IT OR ATLEAST ROLLBACK TO THE ONE WHICH WAS STABLE!!!!!!"*

> "I am really tired of ComfyUI recently. Every new update keeps ruining the frontend more and more instead of fixing it… you should make an experimental branch and only push stable releases when they are ready… We can still use older versions of the frontend, but it keeps giving us warnings… I am tired of this, even just typing it is frustrating."
> — mery-96-new, Comfy-Org/ComfyUI_frontend #11333, 2026-04-17, **open**, type `Bug`. https://github.com/Comfy-Org/ComfyUI_frontend/issues/11333

### 1.5 There is no first-party rollback

`[USER]` > "I have noticed a lot of problems after the last update of comfyui. A rollback to version v.0.3.27 is recommended until the issues are fixed. How can I properly perform the rollback? I use comfyui desktop on windows 10."
> — arkinson9, Comfy-Org/desktop #1107, 2025-04-21. **Closed as `not planned`.** https://github.com/Comfy-Org/desktop/issues/1107

`[USER]` Eight months later, same question, **answered only by another user**:

> "Can someone tell me how i can retrograde back to an older version of the Comfyui App? I've updated yesterday to the new one and everything in my workflow broke :/"
> — MasterJames18, Comfy-Org/ComfyUI Discussion #11429, 2025-12-19
> Peer reply (MIkel-007, 2025-12-23): "The only way is probably to completely reinstall with an older version."
> https://github.com/Comfy-Org/ComfyUI/discussions/11429

**This is a notable structural gap:** an application whose updates demonstrably break user work has no supported downgrade path, and the request for one was closed `not planned`.

### 1.6 Desktop (Electron + `uv`) fails in ways portable users never see

`[USER]` `[TESTED]` Server start dies with a bare Windows fatal-error code after all validation reports OK:

> `Python process exited with code 3221225477 and signal null`
> — ukfliers-coder, Comfy-Org/desktop #1611, 2026-02-19, App v0.85, **open**. (`3221225477` = `STATUS_DLL_NOT_FOUND`; the user is shown nothing else.) https://github.com/Comfy-Org/desktop/issues/1611

`[USER]` Desktop's `uv` bootstrap hard-depends on downloading a standalone CPython from a GitHub release asset:

> `uv.exe venv --python 3.12 --python-preference only-managed` → "由于目标计算机积极拒绝，无法连接 (os error 10061)" ["connection actively refused"]; user reports "whateve click next or install, it could't launch."
> — qlxxkj, Comfy-Org/desktop #1345, 2025-09-25, v0.4.74. https://github.com/Comfy-Org/desktop/issues/1345

`[USER]` `[TESTED]` Windows-version-sensitive `uv` fallback, with the user isolating the variable themselves:

> "I installed 25H2, then I did everything necessary to install the Comfyui program, however, when starting it, I constantly get the same error… I installed other versions of Python several times and the thing keeps happening (i also did a fresh install for comfyui)… Then I went back to 24H2, first start and everything is fine… This morning I start the program again and the same error repeats."
> — DiabolicX, forum.comfy.org, 2025-10-21. https://forum.comfy.org/t/error-in-starting-comfyui-problem-with-manager-and-python-python-m-pip-not-available-falling-back-to-uv/3881
> **Traction on sibling threads on that same page: "Fail to Install python packages…" 21 replies / 11,864 views; "Unable to start ComfyUI" 18 replies / 5,550 views.**

`[USER]` Desktop writes data to undisclosed locations despite an explicit custom install path:

> "even when a non-default location is explicitly selected, the installer proceeds to write models, data, and supporting folders to locations that were never disclosed… including the user's home directory, AppData, and a `comfyui-shared` folder"
> — codehere9, Comfy-Org/ComfyUI #14844, 2026-07-09, **open**; cross-references #14443 ("Constant moving of folders") and #14656. https://github.com/Comfy-Org/ComfyUI/issues/14844

### 1.7 Windows-specific traps

`[USER]` `[TESTED]` **OneDrive + non-ASCII path + MSVC = insightface build failure.** The pip log runs from `C:\Users\furka\OneDrive\Masaüstü\ComfyUI_windows_portable\python_embeded\python.exe` (Turkish for "Desktop") and dies with the compiler mangling the path bytes:

> `fatal error C1083: i‡erme dosyas\x8d a‡\x8dlam\x8dyor: 'Python.h': No such file or directory`
> User: "i tried install C++ build tools but didnt work."
> — vurki16, Comfy-Org/ComfyUI #6826, 2025-02-16. https://github.com/Comfy-Org/ComfyUI/issues/6826

`[USER]` `[TESTED]` **Spaces in the install path** break pip subprocess invocation, root-caused by the reporter:

> "Inside my folder path (XXX), there was a space. After moving the AppImage to another folder without space, I got no more error."
> — Striffly, LykosAI/StabilityMatrix #244. https://github.com/LykosAI/StabilityMatrix/issues/244

`[USER]` **Installing to `C:\Program Files`** fails with `EPERM: operation not permitted, mkdir 'C:\Program Files\ComfyUI\custom_nodes'` and a cascading `ENOENT`, with no user-facing explanation. The reporter had to ask for the obvious: "Installer should either: Check if it has write access on the folder and add a warning when folder is chosen; when crashing it should inform the user that selected folder cannot be written."
> — lerignoux, Comfy-Org/desktop #1081, 2025-04-01. **Closed `not planned`.** https://github.com/Comfy-Org/desktop/issues/1081

`[USER]` **Triton / SageAttention on Windows** — `ModuleNotFoundError: No module named 'distutils'` (removed from stdlib in Python 3.12) when installing via a launcher's bundled uv/venv. — LesPles, LykosAI/StabilityMatrix #1400, 2025-09-29. https://github.com/LykosAI/StabilityMatrix/issues/1400

`[NOT FOUND]` **Antivirus/Defender quarantine as a named cause of a ComfyUI install failure.** Widely assumed in community lore; no qualifying primary-source issue or forum thread located this pass.

### 1.8 Hardware-generation lag: Blackwell / sm_120

`[USER]` A year after the 50-series launch, precompiled custom-node CUDA kernels still lack sm_120:

> "I am encountering a compatibility issue when using nodes like FaceDetailer on NVIDIA Blackwell GPUs (e.g., RTX PRO 6000 Blackwell)… some precompiled CUDA kernels in these nodes do not include support for compute capability sm_120"
> — stedbrown, ltdrdata/ComfyUI-Impact-Pack #1179, 2026-01-18, **open**. https://github.com/ltdrdata/ComfyUI-Impact-Pack/issues/1179

`[LORE]` The existence of a long-lived pinned support thread — "Nvidia 50 Series (Blackwell) support thread: How to get ComfyUI running on your new 50 series GPU" (https://github.com/comfyanonymous/ComfyUI/discussions/6643) — is itself evidence of sustained onboarding pain, though its body was not retrievable.

`[USER]` **Mac/MPS:** `TypeError: BFloat16 is not supported on MPS` (SkyForceCoder, #5829, 2024-11-28, open, `Potential Bug`); `[USER-PARA]` fp8 equivalent — `Trying to convert Float8_e4m3fn to the MPS backend but it does not have support for that dtype` (#10292, snippet only). `[OFFICIAL]` The documented remedy is retreat: `--cpu` / `--force-fp16 --cpu`.

`[OFFICIAL-adjacent]` **AMD ROCm on Windows only became officially supported in 2026** — "official AMD ROCm™ support is now available on the Windows ComfyUI Desktop app, starting with version v0.7.0… based on ROCm 7.1.1" (announcement cross-posted 2026-01-06). That it is a 2026 announcement is the finding.

---

## 2. Custom-node ecosystem fragility

### 2.1 Cross-pack pip clobbering is the defining structural defect

`[USER]` `[TESTED]` Three popular packs installed together; one shared dependency clobber takes down two of them:

> "Version conflicts for huggingface_hub prevent the proper loading of classes, causing errors and making workflows and nodes unusable… Example of Error: ImportError: cannot import name 'LocalEntryNotFoundError' from 'huggingface_hub.errors'"
> …and the user asks the right question: "Could a virtual environment for each custom node be a solution? Should ComfyUI implement a way to manage custom node dependencies?"
> — John-Dormevil, Comfy-Org/ComfyUI #7055, 2025-03-03, **open**, `Potential Bug`. Startup log shows `comfyui-easy-use` and `comfyui-mvadapter` both `(IMPORT FAILED)` in the same run. https://github.com/Comfy-Org/ComfyUI/issues/7055

`[USER]` Scale of the blast radius on a *fresh* install:

> "I am reporting a severe environment conflict affecting over 30 custom nodes on a fresh ComfyUI installation using Python 3.12. The console is flooded with ImportError crashes. The root cause is a 'Dependency Hell' scenario involving TensorFlow, Transformers, and Protobuf… Can we have a 'Safe Mode' or strictly enforced guideline to prevent nodes from installing TensorFlow unless absolutely critical? It is the primary source of instability in this PyTorch ecosystem."
> — wzgrx, Comfy-Org/ComfyUI #12198, 2026-02-01, closed, labelled `Feature`. Names ~20 broken packs including Florence2, SAM2, ReActor, LTXVideo, CogVideoXWrapper, was-node-suite, InstantID. https://github.com/Comfy-Org/ComfyUI/issues/12198

`[USER]` The canonical community rant that set the norms, and is still referenced two years on — 17 upvotes, 12 replies:

> "12. Use strict version specifiers… You ends up with this funny looking dependency resolution"
> "15. Wrong dependency names in requirements.txt… this is dangerous because any one can register virus under these unoccupied names and soon your node will help the baddies just like how LLMVISION did its thing."
> "When developing nodes, please ensure that the name in NODE_CLASS_MAPPINGS is unique… please make it distinct so users won't have to guess which node they should install from a list where there is a ton of naming conflicts"
> — wfjsw, Comfy-Org/ComfyUI Discussion #2635, 2024-01-25. https://github.com/Comfy-Org/ComfyUI/discussions/2635

`[STAFF]` Dr.Lt.Data replying in that thread, notable for candour about the ecosystem's skill baseline:

> "This is a good guideline. Many developers creating custom nodes often start without prior experience in Python, myself included."

### 2.2 Comfy-Org's proposed fix is process isolation — and its own commenters doubt it

`[OFFICIAL]` > "Solve Dependency Woes — Every custom node pack has its own set of dependencies. Unfortunately, sometimes these dependencies conflict which can 'brick' a ComfyUI installation when you install the wrong custom nodes together… we're exploring the ability to put each custom node pack utilizing the Public API in its own Python process."
> — Jedrzej Kosinski & Jacob Segal, "Dependency Resolution and Custom Node Standards", blog.comfy.org, 2025-06-07. **23 likes, 6 comments, 2 restacks.** https://blog.comfy.org/p/dependency-resolution-and-custom

`[USER]` The sharpest comment on that very post:

> "the dependency resolution is still a mystery to me. assuming a custom node declares a dependency on `some-package==2.0.0` and comfy has `some-package==3.0.0` how does the solution described in this specification help with that?"
> — shizoidcat

As of Sept 2026 this remains a proposal, not a shipped guarantee.

### 2.3 "IMPORT FAILED" tells the user nothing — and the complaint has been bounced across three repos

`[USER]` The issue has been transferred ComfyUI#11454 → frontend#7733 → frontend#12450 and is **still open**:

> "When a custom node fails to import, ComfyUI should report why the import failed (at least the exception type and message) in the import summary… No exception type or error message is shown next to the failing module. This makes diagnosing broken custom nodes difficult, especially when many nodes are loading."
> — originally cmyoussef, 2025-12-21; now Comfy-Org/ComfyUI_frontend #12450, labelled `Custom Node` + `Potential Bug`, **includes a submitted patch**. https://github.com/Comfy-Org/ComfyUI_frontend/issues/12450

`[USER]` A commenter on the original:

> "New innovative manager fails to install custom node requirements and then just prints enigmatic 'install failed'. But wait, it looks so modern because it has big thumbnails that does nothing but clutter. Good that manual install works."
> — mdkdy

**The three-repo transfer history is itself the traction signal.**

### 2.4 "Install Missing Custom Nodes" is unreliable in two distinct ways

`[USER]` **Wrong pack offered** — raised by a well-known community figure, with screenshots:

> "Often on the standalone and portable/web versions of Comfy, when you click Install Missing Custom Nodes, some node packs come up as the incorrect id's. As you can imagine this could cause the wrong node pack to be installed and in certain cases that could be dangerous. In this case it works in the old manager, but not the new manager."
> — purzbeats, Comfy-Org/ComfyUI-Manager #1762, 2025-04-20. Closed via linked PR frontend#3521. https://github.com/Comfy-Org/ComfyUI-Manager/issues/1762

`[USER]` **Silently detects nothing** when the pack isn't in the registry — filed three weeks before this report's cutoff:

> "When opening a workflow that depends on a custom node pack which is not present in the ComfyUI-Manager registry (for example, Dream Video Batches), the Install Missing Custom Nodes feature does not detect it… The result is that users often have to manually search GitHub or ask the community to identify the missing repository."
> — theawesomerobot, Comfy-Org/ComfyUI-Manager #3138, 2026-08-06, **open**. https://github.com/Comfy-Org/ComfyUI-Manager/issues/3138

That is **17 months after the CNR launch** and the user still cannot distinguish "not installed" from "not in registry" from "renamed node".

### 2.5 Big packs break on core updates; maintainers label it as such

`[USER]` rgthree's own maintainer triaged this with the label **`bug caused by comfyui`**:

> "Fast Group Bypasser (rgthree) shows as a red node. Power Lora Loader (rgthree) has model and clip in/out but does not have any entry boxes for Loras anymore. Also the settings menu for RGThree is missing."
> — KazutoEleros, rgthree/rgthree-comfy #706, 2026-03-17, **open**. Related discussion #671 attributes rgthree breakage to Nodes 2.0, workaround = disable Nodes 2.0. https://github.com/rgthree/rgthree-comfy/issues/706

`[USER]` Crystools (~2k stars) failing on a missing transitive dep: `ModuleNotFoundError: No module named 'deepdiff'` → `Cannot import ...\comfyui-crystools module for custom nodes` — EivKnightOfIce, crystian/ComfyUI-Crystools #249, 2025-10-23, open.

`[USER-PARA]` `WASasquatch/was-node-suite-comfyui` is owner-archived (read-only, ~June 2025); maintenance continues in an `ltdrdata/` fork. Archived-banner text was truncated on fetch, so this is snippet-confirmed only.

`[NOT FOUND]` **A concrete bug report of two shipped packs colliding on the same `NODE_CLASS_MAPPINGS` key.** The risk is documented normatively (§2.1, wfjsw) but no live collision report was located.

### 2.6 Security — the ecosystem is arbitrary-code-execution by design, and the controls leak

**Incident 1 — ComfyUI_LLMVISION (June 2024).** `[USER-PARA]` (original repo deleted; reconstructed from security press). Malicious node posing as an OpenAI/Anthropic integration; payload hidden in custom pip wheels referenced from `requirements.txt`; exfiltrated browser passwords, crypto wallets, screenshots and Discord tokens to an attacker-controlled Discord webhook. Attributed to "Nullbulge". Comfy-Org treats it as the founding incident.

**Incident 2 — ultralytics PyPI supply-chain compromise (Dec 2024).** `[USER-PARA]`/vendor-sourced. Versions 8.3.41/42 and 8.3.45/46 shipped an XMRig cryptominer via a compromised GitHub Actions workflow. ultralytics is a dependency of **ComfyUI-Impact-Pack**, one of the most-installed packs in existence. https://blog.pypi.org/posts/2024-12-11-ultralytics-attack-analysis/

**Incident 3 — Upscaler-4K / Akira Stealer (Oct 2025 → Jan 2026).** This is the best-documented one and the most damning.

`[OFFICIAL]` > "Between October 17th and 19th, 2024 [sic — timeline in the same post says 2025], a malicious actor uploaded two node packs to the Comfy Registry containing the malware. Following a flag from an automated security scanner and manual review by the Registry team, the malicious versions were banned on October 21st. Before the ban was implemented, these nodes were downloaded a total of 790 times."
> — Yoland Yan, "Upscaler-4K Malicious Node Pack Post Mortem", blog.comfy.org, 2026-01-11. **6 likes, 1 comment.** https://blog.comfy.org/p/upscaler-4k-malicious-node-pack-post

`[USER]` That single comment, 11 days later, reports the malicious node was **still installable**:

> "Since it is still available for install through the Manager, is the EliseiBorisov Comfy-Upscaler-4K node clean? Actually, I just checked and LoneMilk Upscaler 4K is also available for install. Am I out-of-date somewhere?"
> — Og, 2026-01-22

`[USER]` `[TESTED]` The deep technical writeup, **open since Jan 2026 (~8 months unresolved at cutoff)**, quotes a user's frustration verbatim from Discord:

> "I found some malware 'in' ComfyUI (can be installed without leaving the software - no manual download). Guess that happens from time to time, but some things puzzle me: The original package is gone, but there is already a new 'upscaler-4k'. Its github is down, but the plugin can still be installed… I was surprised that there is no information at all about the incident. Is there really no place to go to get details about security issues?"
> — "Peppermint", quoted by fflurk, Comfy-Org/ComfyUI #11791. https://github.com/Comfy-Org/ComfyUI/issues/11791
> Technical detail: the node called `ensure_package("requests")` → runtime `pip install`, fetched a PyArmor-protected Golang loader from `postprocesser[.]com` / `cosmoplanets[.]net`, persisted as hidden `DisplayUpdater.exe`, exfiltrated via gofile.io. Registry download counts cited: 472 + 283 + 24 = **779**. The issue also alleges the second uploader account is the banned actor re-uploading — i.e. **ban evasion defeats registry banning as a control.**

`[OFFICIAL]` Comfy-Org's stated policy, one year earlier:

> "We will start ramping up ComfyUI Registry restrictions on a few code practices [eval/exec, subprocess pip installs, code obfuscation]… In 3 months… we will block all public nodes [using eval/exec]. In 6 months… we will block all publish nodes from calling pip install."
> — Yoland Yan, "ComfyUI 2025 Jan Security Update", blog.comfy.org, 2025-01-03. https://blog.comfy.org/p/comfyui-2025-jan-security-update

**The finding writes itself:** the Jan-2026 malware used *runtime pip install* — precisely the practice that was to be blocked by ~July 2025. And a commenter on that 2025 post had already flagged the risk: "There will be criminal liability for comfyui for knowing high-risk safety issues and willfully letting them persist for months…" — Yng Baker, 2025-02-03. `[USER]`

### 2.7 Registry transition — governance was handled well; completeness was not

`[OFFICIAL]` > "on March 28, ComfyUI-Manager will be moving to the Comfy-Org GitHub organization… Dr.Lt.Data, who has been the driving force behind ComfyUI-Manager from the beginning, will continue to maintain and develop it."
> — Christian Byrne, blog.comfy.org, 2025-03-29. **24 likes**, positively received ("A big kudos to you guys 👏 I really like how you respect and recognize the independent devs like this" — Özgür Altay). Roadmap promises "Native integration of ComfyUI-Manager into ComfyUI" and "Enhanced installation safety with snapshot functionality." https://blog.comfy.org/p/comfyui-manager-joins-comfy-org

`[OFFICIAL]` Dr.Lt.Data remains the hands-on security reviewer post-handover: the Upscaler-4K timeline records "Oct 21, 2025, evening: Registry maintainer Dr.Lt.Data reviewed the code and confirmed the malware."

The fallout is not political, it is **coverage**: see §2.4's #3138. Registry-sourced nodes carry metadata; git-cloned ones don't (§3.1), and the Manager can't help with what isn't in the registry.

---

## 3. Workflow portability & rot

### 3.1 FACTS FIRST — what a saved workflow JSON actually contains (this bounds everything below)

`[OFFICIAL]` Per the ComfyUI Workflow JSON Schema v1.0 (https://docs.comfy.org/specs/workflow_json), a workflow contains `version`, `config`, `state`, `groups`, `nodes[]`, `links[]`, `reroutes[]`, `extra`, and an **optional** top-level `models[]` (name, url, hash, hash_type, directory). Within `nodes[].properties` only `"Node name for S&R"` is formally specified; `additionalProperties: true` permits arbitrary extras.

`[TESTED]` Empirically, from a real workflow JSON attached to Comfy-Org/ComfyUI #11109 (ComfyUI 0.3.76 / frontend 1.33.10):

```
"properties":{"Node name for S&R":"DualCLIPLoader","cnr_id":"comfy-core","ver":"0.3.38",
  "models":[{"name":"clip_l.safetensors","url":"https://huggingface.co/...","directory":"text_encoders"}]}
```
…but **most nodes in the same file carry none of it**: `"properties":{"Node name for S&R":"UNETLoader"}`. Top-level `extra` recorded only `"frontendVersion":"1.23.4"` and `"workflowRendererVersion":"LG"` — **no ComfyUI core version, no per-node-pack version manifest, and no model hashes for the actual checkpoint/LoRA files used.**

> **This is the single most important fact in this report for Prompt Studio's roadmap.** `cnr_id`/`ver` coverage is *inconsistent by construction*: present for some Registry-sourced nodes, absent for core loaders and (per corroborating snippets) typically absent for git-cloned custom nodes. Any companion tool that promises "drop your workflow, I'll tell you what you need" will be **right sometimes and silently incomplete the rest of the time** — which is the same failure mode this report criticises elsewhere. Design accordingly: report *known* requirements and explicitly enumerate *unknowable* ones.

### 3.2 Core-node signature changes silently invalidate saved workflows

`[USER]` `[TESTED]` A new required input with a default value was appended to a **core** node, and every previously-deployed workflow began failing validation:

> "Updating ComfyUI should not break API functionality… After recently updating, `resolution_steps` with a default value was added to `ImageScaleToTotalPixels` at the end of its inputs… because this value is missing, previous deployed workflows quit working because validation fails."
> Log: `Failed to validate prompt for output 410: * ImageScaleToTotalPixels 93: - Required input is missing: resolution_steps`
> — littleowl, Comfy-Org/ComfyUI #11833, 2026-01-13, **open**. https://github.com/Comfy-Org/ComfyUI/issues/11833

### 3.3 The "newer version required" error fires when you already have a newer version

`[USER]` > "Some Nodes Are Missing… Some nodes require a newer version of ComfyUI (current: 0.3.66). Please update to use all nodes. Requires ComfyUI 0.3.60"
> — hard-sarachi, Comfy-Org/ComfyUI #10490, 2025-10-26. **Closed as `not planned`** (`Stale` + `User Support`). Reproduced with all custom nodes disabled. https://github.com/Comfy-Org/ComfyUI/issues/10490

0.3.66 > 0.3.60. The error is arithmetically wrong and was closed unfixed.

### 3.4 A single frontend point-release can break unrelated workflows within hours

`[USER]` `[TESTED]` > "Most of my workflow have this issue at load. Comfyui Cannot read properties of undefined (reading 'addEventListener'). They are completely different from each other but have the same bug. Some custom nodes are loaded correctly but when I choose to add them to the canvas, nothing happen. Downgrading to commit from 5 hours ago [980621d] that use comfyui-frontend-package==1.39.19 fix the issue."
> — RayHell, issue titled *"comfyui-frontend-package==1.41.15 Is breaking a lot of workflow and nodes."*, Comfy-Org/ComfyUI #12893, 2026-03-11, closed via frontend PR #9759. https://github.com/Comfy-Org/ComfyUI/issues/12893

`[USER]` And the schema-level version: `TypeError: this.widgets.values(...).filter is not a function` — "Workflow does not load and error message displays. This is consistent regardless of workflow." Failure inside `LGraph.configure` / `ComfyApp.loadGraphData`. — bettinaSim, #11109, 2025-12-04.

`[USER-PARA]` Community wiki attributes a broad class of blank-widget-on-import failures to the post-frontend-v1.16.9 change in widget-value storage, noting it made cross-version workflow compatibility "very difficult to maintain." Wiki source only — not primary — flagged accordingly.

### 3.5 Subgraphs: the most-praised 2025 feature is also a portability hazard

`[USER]` Studio-scale impact, **open**, labelled `area:subgraph` + `area:workflows`:

> "After updating Comfy all of our studio worklfows got broken, the subgraphs are not working and we are getting a constant red error 'Failed to save workflow draft'. We are forced to never update comfy until this is solved, our studio workflow has hundreds of nodes and took weeks to build. At the moment we ha solved it reverting to an older frontend version."
> Repro detail: "open an older workflow with nested and subnested subgraphs with various type of inputs, boolean, float, sliders, all say 'disconnected'." / "How is this affecting you? Crashes ComfyUI completely."
> — axior, Comfy-Org/ComfyUI_frontend #10772, 2026-03-31. https://github.com/Comfy-Org/ComfyUI_frontend/issues/10772

`[USER]` `[TESTED]` A user root-causes a JSON-ordering bug in the subgraph loader:

> "Subgraphs are a really cool new feature but unfortunately have been released without sufficient testing… if the Nested Subgraph is first in the list then the Test Subgraph will fail to load because at this point it is not defined. Reversing the order of subgraphs in the JSON list makes this problem go away… You need to build dictionary by loading all the subgraphs before you try to dereference the subgraph id's."
> — Javerre, Comfy-Org/ComfyUI #10522, 2025-10-28, closed. https://github.com/Comfy-Org/ComfyUI/issues/10522

`[USER-PARA]` Snippet-only leads (titles verified, bodies not fetched): frontend #9065 — subgraph loading aborts for workflows "saved in 1.39.x and below" with multi-level nested subgraphs; desktop #1255 — subgraph workflows fail on Desktop *despite matching versions*, i.e. platform-specific divergence.

### 3.6 "Works on my machine" — recipients of shared workflows

`[USER]` A 20+ minute first-person troubleshooting log published as a Civitai article, ending in exhausted triumph:

> "ComfyUI again fails to load UI… after having updated front end" … "THE SITE DOESN'T SHOW THE NODE!?!?!?!" … "go forth now and exert your newfound competence unto fearful repositories who once thought themselves safe in the obscurity of dependency hell, for now hell has frozen over!"
> — d3fused, "Fix ComfyUI's missing nodes and absent modules once and for all!", civitai.com, 2025-10-14. https://civitai.com/articles/20856/fix-comfyuis-missing-nodes-and-absent-modules-once-and-for-all

`[USER]` Path-dependence: forum thread "Installed ComfyUI to a drive other than C:. Workflow not finding Model files" (forum.comfy.org t/3801) — **3,811 views** — confirming the class is common enough to generate sustained official-forum traffic.

### 3.7 API-format vs UI-format: confirmed by staff as a real, self-inflicted trap

`[STAFF]` The clearest first-party admission in this entire report, from Comfy-Org's own comfy-cli maintainer:

> "'Save (API Format)' is hidden behind **dev mode** in the frontend settings, so most users don't know it exists or that they need it. Workflows shared on Civitai, Reddit, in PNG metadata, etc. are almost always in UI/save format. The result: users naturally try `comfy run --workflow my-workflow.json` with whatever they exported, hit the error, and have no path forward from the CLI."
> — christian-byrne, Comfy-Org/comfy-cli #446, 2026-05-06. Also notes the Comfy Cloud MCP server documents the same limitation: "Saved workflows use the ComfyUI graph format, which requires conversion to API format". https://github.com/Comfy-Org/comfy-cli/issues/446

`[USER]` `[TESTED]` And the format is not the only variable — node registration itself is unstable across the two paths:

> "I have created a workflow using webui, and exported it as an api after confirming it works properly… I got a 'node does not exist error'… It's really strange because the custom node has been installed… I opened that api file from comfyui web ui and it was loaded and executed properly. I got the error whey only using API."
> Log: `'Cannot execute because node aichemyYOLOv8Segmentation does not exist.'`
> — uS-aito, Comfy-Org/ComfyUI #9635, 2025-08-30, **open**. https://github.com/Comfy-Org/ComfyUI/issues/9635

`[OFFICIAL]` **Nuance worth recording, because it inverts the usual advice:** Runpod's ComfyUI-to-API tooling demands the **UI** export, not the API export — "Make sure to export your workflow using **Comfy → File → Export** (not the API export)… If you used the API export, go back to ComfyUI and use File → Export instead." https://docs.runpod.io/community-solutions/comfyui-to-api/overview
So "always use API format" is *wrong* as blanket guidance. Any companion tool giving format advice must be tool-specific.

---

## 4. Model management

### 4.1 `extra_model_paths.yaml` — the intended solution, which crashes on a whitespace error

`[USER]` `[TESTED]` Malformed YAML doesn't warn, it takes down startup with a raw traceback:

> `File ".../utils/extra_config.py", line 29, in load_extra_path_config / for y in conf[x].split("\n"): / TypeError: string indices must be integers, not 'str'`
> — schoenid, Comfy-Org/ComfyUI #11404, 2025-12-18, **open**, `Potential Bug`, fix PR #11416. https://github.com/Comfy-Org/ComfyUI/issues/11404

`[USER]` The identical error anchors a discussion that ran **Sept 2024 → Feb 2026** (9 comments, 9 participants), with a peer supplying the actual diagnosis the software should have given: "Look this in not valid Yaml formating, this code view deleted all required spaces. So before just copying validate Yaml format first." — flynet, Discussion #5015. https://github.com/Comfy-Org/ComfyUI/discussions/5015

`[USER]` Even correctly configured, it isn't honoured universally:

> "it feels like extra_model_paths.yaml is the intended way of solving this problem, it's just that not every custom node respects it (e.g. Florence, Whisper, FaceRestore are just three examples I've encountered this morning that don't)."
> — tanoshimi, forum.comfy.org (thread views: 7,081). https://forum.comfy.org/t/models-not-being-detected-even-though-yaml-has-dirs-added/1394

`[STAFF]` And Desktop uses **a different file entirely** from the one every tutorial names:

> "There are two distinct files: 1. The original file from ComfyUI, `extra_model_paths.yaml`… 2. The config file used exclusively in the desktop app, `extra_models_config.yaml`… generated and maintained by the desktop app… lives in `%APPDATA%\ComfyUI` on Windows."
> — forum.comfy.org staff, 2025-02-10, same thread

`[USER]` …and Desktop overwrites user edits to it: "I found the location, and copying the models here makes them available, but it gets deleted on update and then I had to copy them in there again." — Windsage, forum.comfy.org t/322 (**21,968 views**).

`[STAFF]` ltdrdata's guidance against the obvious workaround: "If you do it that way [symlink the whole models folder], problems will occur when updating ComfyUI. Instead, copy `ComfyUI/extra_model_paths.yaml.example`…" — Discussion #5015. Community counter-practice favours Windows *junctions* ("Junctions are the way to go… Saves a lot of headaches" — Woisek), with documented limits: junctions can't span network drives, and creation needs admin rights.

### 4.2 Choosing the right file variant — expensive to get wrong

`[USER]` The bandwidth economics, stated plainly:

> "If I spend 65.82 GB of my internet data and wait for all the model files to download… I'm not going to download 65.82 GB and waste my data plan."
> — fireYtail, huggingface.co/city96/FLUX.1-dev-gguf discussion #36, 2024-11-13

`[USER]` 27GB downloaded, placed per a published guide, dropdown still empty:

> "The downloaded files (a 19GB qwen safetensor checkpoint and an 8GB clip file also safetensor file format) are placed in the correct folder… I have followed the installation guide that told me to put the qwen model and its CLIP inside the 'models\diffusion_model' and in 'models\clip'… The dropdown menu is empty."
> — gluttonium, Comfy-Org/ComfyUI #11581, 2025-12-31. **Closed `not planned`** (`Stale` + `User Support`). https://github.com/Comfy-Org/ComfyUI/issues/11581

`[USER]` Quantisation naming is genuinely misleading, and users know it: "Q8_0 is not equal to fp8 e5m2. Its int8 based." — Nelathan; "Q3 with t5xxl_fp8 can still pull off a pretty convincing image… Q2 is where it really degrades to the point of 'nobody should use this one'." — bobp (city96/FLUX.1-dev-gguf discussion #15; repo has 1.41k likes).

`[USER]` `[TESTED]` **A folder-key rename in core broke the most popular GGUF loader for everyone**: `Cannot import ComfyUI\custom_nodes\ComfyUI-GGUF module for custom nodes: 'unet'`, traced to the `unet` → `diffusion_models` rename — Danamir, city96/ComfyUI-GGUF #39, 2024-08-18.

`[USER]` NF4 variants widely non-functional in ComfyUI without an unofficial node that itself fails: "It doesn't seem to work in Comfy for me. Is that expected?" — 97Buckeye; "Same here - this model can not be run even with bitsandbytes node" — Alex199 (lllyasviel/flux1-dev-bnb-nf4 discussion #3).

`[LORE]` A third-party tool exists purely because filenames lie: TensorSort — *"Because filenames lie, but tensors don't."* … *"GGUF files often have WRONG quantization in the filename. The uploader writes 'Q8_0' but the file is actually Q4_K_M."* (r/comfyui, 2025-11-29, 18 upvotes) ⚠ re-verify.

### 4.3 Wrong text encoder / VAE → black frames and NaN, across every model family

This is the richest vein of *silent-ish* failure in the report — the pipeline runs to completion and hands back black.

| Model | Symptom | Source |
|---|---|---|
| Qwen-Image | "Using Qwen Image creates only black images" with Q2_K model + Q2_K Qwen2.5-VL encoder + safetensors VAE; console `RuntimeWarning: invalid value encountered in cast` | `[USER]` Hermit6202, QwenLM/Qwen-Image #68, 2025-08-14 |
| Qwen-Image | "The example workflow produces an all black image using my 3060rtx 12gb… no OOM and the Ksampler and VAE decode appear to be working." | `[USER]` AtomicPerception, QwenLM/Qwen-Image #32, 2025-08-05, **open** |
| SDXL / Wan 2.1+2.2 / FLUX.2 Klein | "Generations across multiple model types… frequently produce black/grey images, NaN latent errors, or heavily distorted/noisy outputs." Workaround: "Running VAE on CPU \| Reliably fixes SDXL black image issue, but is far too slow for Wan or Klein." | `[USER]` Sexhaver19, Comfy-Org/ComfyUI #13116, 2026-03-23, **assigned to maintainer rattus128** |
| LTX-2 22B | "produces completely garbled output (pure noise, no recognizable content) regardless of prompt… Text encoder: gemma_3_12B_it_fp8_e4m3fn.safetensors (loaded via GGUF CLIP loader node)" | `[USER]` EGBluesman, Lightricks/ComfyUI-LTXVideo #465, 2026-04-16 |
| MiniMax H3 | INT8 ConvRot VAE → "entirely black video. The same workflow works with minimax_h3_video_vae_fp16.safetensors." | `[USER]` ZhuominLi, Comfy-Org/ComfyUI #15524, 2026-08-12, **open** |
| Z-Image | Qwen3-4B encoder emits all-NaN conditioning on Blackwell → "the same sequence after one FaceDetailer execution produced 24/24 black images"; `RuntimeError: Z-Image became non-finite at patchify input context` | `[USER]` nubsgroup, Comfy-Org/ComfyUI #15110, 2026-07-27, **open**, `Potential Bug` |

`[USER]`/`[STAFF]` The FLUX naming confusion has been a documented FAQ since day one: "In anticipation of a flood of questions I am putting this here… Currently it is totaly incomprehensible which model is the CLIP_l in the model browser…" — BrechtCorbeel, Discussion #4222, 2024-08-05, answered by ltdrdata.

`[OFFICIAL]` Comfy-Org *does* document the two canonical FLUX mistakes — "**Flux + wrong VAE:** Using taesd or sdxl_vae.safetensors with Flux checkpoint. Fix: Use ae.safetensors" and "**Flux + incorrect CLIP configuration:** Using t5xxl_fp8_e4m3fn.safetensors in both CLIP slots of DualClipLoader." — https://docs.comfy.org/troubleshooting/model-issues
**But this coverage stops at FLUX.** There is no equivalent official matrix for Wan 2.1-vs-2.2 VAEs, Qwen-Image, LTX-2 + gemma, MiniMax H3 VAE variants, or Z-Image encoders — every one of which has a black-frame issue above.

`[NOT FOUND]` A standalone primary source isolating Wan 2.1-vs-2.2 VAE mismatch as the sole cause of black output. Widely asserted in AI-generated summaries; not confirmed. Treat that specific claim as unproven.

### 4.4 "Where do I put this file" is a permanent, high-traffic FAQ

`[OFFICIAL]` Comfy-Org maintains a dedicated KB article for it (https://support.comfy.org/articles/7025603568-where-do-models-go, "Last updated 2 months ago"). Its existence is the evidence.

`[USER]` And it still doesn't land:

> "I registered, downloaded the files, closed Comfy and placed the files in the specified locations… Launch Comfy again and I'm still getting the 'Missing Models' popup… What am I doing wrong?"
> Reply: "This windows installer is so confusing. All this %Appdata% and %userprofile% folders just makes it more annoying than it should be… I just got tired of all of this and installed the Portable Version from Github. Way easier to understand and control."
> — OysterMug / RSa, forum.comfy.org, 2025-09-12. https://forum.comfy.org/t/newbie-installed-comfy-says-missing-models-downloaded-put-in-place-still-says-theyre-missing/3789

`[USER]` The canonical folk answer — "press r on the keyboard (or ComfyUI icon → Edit → Refresh Node Definitions)" — recurs near-verbatim across independent threads, and in Discussion #12630 (2026-02-25, marked **Unanswered**) it *still didn't work*: "Thank you for your replies, it still doesn't work 😮‍💨".

---

## 5. Memory & performance

### 5.1 Dynamic VRAM — a genuine engineering win with a long regression tail

`[OFFICIAL]` > "The recent increase in hardware RAM prices has been a pain for everyone. To help alleviate this, we are introducing a new ComfyUI memory optimization system: **Dynamic VRAM**… ComfyUI now no longer unloads models from VRAM back to RAM at all."
> — comfyanonymous, blog.comfy.org, 2026-03-25. **43 likes, 5 restacks, 3 comments.** Mechanism: Virtual Base Address Register (zero physical VRAM cost), a `fault()` JIT-allocation API, graceful degradation instead of OOM, and a priority "watermark" system. https://blog.comfy.org/p/dynamic-vram-in-comfyui-saving-local
> Rollout: enabled by default (Discussion #12699).

The motivating bug was real and well-quantified:

`[USER]` `[TESTED]` > "With a 20GB pagefile (80GB total virtual memory), ComfyUI uses 45GB actual memory but commits 75GB virtual memory. The application will crash with OOM errors when committed memory hits 80GB/80GB, even though there's still ~30GB of RAM available… It's committing 67% more memory than it needs… around model_management.py:598, there appears to be a 10% safety margin built in, which on a 64GB system should only add ~6GB — the actual overcommit is 30GB - which represents 46% of my total physical RAM."
> — phazei, Comfy-Org/ComfyUI #8298, 2025-05-27, RTX 3090 / 64GB, **open**. https://github.com/Comfy-Org/ComfyUI/issues/8298

**But the regression tail is substantial and maintainer-acknowledged** (note how many are assigned to `rattus128`):

`[USER]` `[TESTED]` > "Memory is not being offloaded from RAM after models are moved to VRAM. Constant swapping/pagefile activity occurs between RAM and disk, potentially reducing SSD lifespan due to excessive writes. RAM consumption spikes to full capacity (32GB) during a single generation… System performance degraded significantly; workflows that previously ran smoothly are now nearly impossible to execute… Severe degradation in usability for users with 32GB RAM and 16GB VRAM."
> — intervisionlord, Comfy-Org/ComfyUI #12541, 2026-02-20, **open**, `Potential Bug`. https://github.com/Comfy-Org/ComfyUI/issues/12541

`[USER]` Outright crash on a 5090: `Expected all tensors to be on the same device, but got index is on cuda:0, different from other tensors on cpu` … "Testing with `--disable-dynamic-vram` does work." — AnnieTheEagle, #12786, 2026-03-05, open, assigned rattus128.

`[USER]` And the escape hatch is scheduled for removal:

> "I saw that the flag --disable-dynamic-vram will be soon removed. I'm using a 2 step QWEN edit workflow… in between the 2 genarations the models are always unloaded and need to be reloaded every time… Using --disable-dynamic-vram everything is smooth, models are kept in RAM and repeated workflow runs are fast."
> — MrSeri0us, #13139, 2026-03-24, open, assigned rattus128. https://github.com/Comfy-Org/ComfyUI/issues/13139

`[USER]` Desktop-side, no UI escape at all: "After the update, ComfyUI unloads all models after every generation… Before generation: VRAM usage ~10-11 GB. After generation completes: ~936 MB… There appears to be no exposed UI setting or configuration file entry allowing users to disable this behavior." — iamddtla0620, Comfy-Org/desktop #1741, 2026-06-11. (Note: the desktop repo was itself archived 2026-06-26.)

### 5.2 Flag confusion is documented into existence

`[OFFICIAL]` From `cli_args.py` / the Startup Flags reference:

> `--lowvram` — **"No effect when dynamic VRAM is enabled.** Otherwise, runs text encoders on CPU."

A flag that every tutorial, every forum answer and every blogspam article still recommends **is now a no-op by default.** Meanwhile `--cache-ram` became the default caching mode (displacing the old aggressive `--cache-classic`), and `--gpu-only / --highvram / --lowvram / --novram / --cpu` are mutually exclusive.

**This is a textbook knowledge-rot trap:** the entire corpus of community advice about VRAM flags was silently invalidated by a default change, and the only source of truth is a source file.

### 5.3 Model reloading — the recurring complaint that predates and outlives every fix

`[USER]`/`[STAFF]` The same thread runs from **March 2023 to November 2025**:

> "It seems to me that for each task models are loaded and offloaded from the GPU memory at each task execution… this seems to lead to a massive performance hit compared to auto1111." — KaruroChori, 2023-03
> `[STAFF]` "You can use this command line option to always keep them in memory: --highvram" — comfyanonymous
> 2.5 years later: "Ever since you're new update it doesn't do this anymore so now it takes double the amount of time to process videos… any work around? Why vram isn't doing it it's still offloading after every prompt" — UVMFilm, 2025-11-07
> https://github.com/Comfy-Org/ComfyUI/discussions/311

`[USER]` `[TESTED]` Multi-model video workflows re-read from disk **every run**:

> "Reads models from disk once they are evicted from VRAM, meaning every single time you run a workflow with multiple models that don't fit entirely into VRAM… Marvel at endless disk loading every time you re-run the workflow."
> Log: `Model WAN21 prepared for dynamic VRAM loading. 27251MB Staged` → `Prompt executed in 226.60 seconds … 174.92 … 167.58`
> — BobJohnson24, #14076, 2026-05-23, open, assigned rattus128. https://github.com/Comfy-Org/ComfyUI/issues/14076

`[USER]` **Editing the prompt text alone forces a full diffusion-model reload from disk**:

> "If the prompt is not changed, the disk does not read again. If the user changes anything in the prompt, the application reads from the disk and takes time to process… previously, everything was cached in memory… Right now, even though I have free memory, the memory is not used, and the disk is used on every change."
> — Aamir3d, #14618, 2026-06-24, **open**, `Potential Bug`. https://github.com/Comfy-Org/ComfyUI/issues/14618

> **Directly relevant to Prompt Studio:** the iteration loop that prompt engineering *depends on* — tweak wording, re-run, compare — is currently the loop with the worst cache behaviour. This is an argument for doing prompt iteration/validation **outside** ComfyUI before committing a run, which is precisely what Prompt Studio is.

`[USER]` Slow-storage users penalised by an NVMe assumption: "It's like comfy got optimized to use less sysram and just assumes everyone has NVME ssd. Is there a flag to toggle this new behavior off?" — Ph0rk0z, #12330, 2026-02-06, assigned rattus128.

`[USER]` `--cache-none` is a per-session global, so fixing LTX breaks everything else: "I am having to reset comfyui each time and take the argument in and out as needed." — lebakerino, #12992. And `--cache-lru` "applies at the node level rather than specifically to model handling" — monstari, #11930.

`[USER]`/`[STAFF]` A node-level example of the same coupling, with the maintainer reverting: user reports "<5 s/it to around 30 s/it… I'm not sure that the encoders are being kicked out any more"; city96 replies **"Yeah, the LoRA weight fix seems to mess with model management. I've reverted that part temporarily until a better solution is found."** — city96/ComfyUI-GGUF #94.

---

## 6. Errors & debuggability

### 6.1 Raw tracebacks, classified by maintainers as user error

`[USER]` A ~40-line Python traceback through `execution.py` → `samplers.py` → `flux/model.py` ending in:

> `!!! Exception during processing !!! mat1 and mat2 shapes cannot be multiplied (512x2560 and 7680x3072)`
> — MGB211, Comfy-Org/ComfyUI #12076, 2026-01-25. **Closed, labelled `User Support`** — i.e. an unmapped tensor-shape traceback is triaged as the user's problem, not a UX defect. https://github.com/Comfy-Org/ComfyUI/issues/12076

`[USER]` ⚠ re-verify — validation failures surface as a raw dict:

> "Failed to validate prompt for output 23 (video combine) / Output will be ignored / invalid prompt: {'type': 'prompt_outputs_failed_validation', 'message': 'Prompt outputs failed validation', 'details': '', 'extra_info': {}}"
> — u/Huge-Refuse-2135, r/comfyui, 2026-03-09, 35 comments. https://www.reddit.com/r/comfyui/comments/1rozib4/

`[USER]` ⚠ re-verify — and the beginner's honest reaction: "I am trying to use someone elses workflow right now. Keep getting this error and I have no idea what it means?" — u/Particular-List1185, r/comfyui, 2025-01-21.

### 6.2 Red-node ambiguity is officially acknowledged, and the official remedy is manual bisection

`[OFFICIAL]` docs.comfy.org: "Nodes can show missing states either when ComfyUI core nodes are missing due to version updates, or when custom nodes are not installed" — resolved by `--disable-all-custom-nodes` plus manual binary search or `comfy-cli node bisect`. https://docs.comfy.org/troubleshooting/custom-node-issues

The documentation is genuinely good. But the fact that **the sanctioned diagnostic procedure is "disable half your nodes, restart, repeat"** is the finding: the platform has no mechanism to tell you *why* a node is red.

### 6.3 Silent failures — the highest-value category in this entire report

These are failures where the run **completes successfully** and hands back a wrong or unaffected result. No red node. No error. Often not even a toast — just a line in a console the user isn't reading.

**(a) LoRA loads, applies nothing.**

`[USER]` `[TESTED]` > `lora key not loaded: lycoris_condition_embedder.alpha` (repeated ~15×) … **"The result sounds the same with or without the LoKr."**
> — fappaz, Comfy-Org/ComfyUI #12638, 2026-02-25, `Potential Bug`. https://github.com/Comfy-Org/ComfyUI/issues/12638

`[LORE]` `[TESTED]` This is chronic, not a one-off: distinct issues titled around `lora key not loaded` span ~2 years — #5492, #5655, #6584, #10119, #13747, #11487. **#10119 (WanAnimate relight LoRA) was closed `not planned`, labelled `Stale`** — auto-closed by the stale bot without resolution. https://github.com/Comfy-Org/ComfyUI/issues/10119

**(b) Text silently truncated at 77 tokens.**

`[USER]` ⚠ re-verify > "I'm hitting the 77-token limit in ComfyUI with SDXL models, even after installing ComfyUI-Long-CLIP… I still get truncation warnings for prompts over 77 tokens even when I use SeaArtLongXLClipMerge before CLIP Text Encode."
> — u/Strange_Ear9293, r/comfyui, 2025-04-08.

`[USER]` ⚠ re-verify — a node author designing around it: "SDXL truncates at ~77 tokens, so a full compiled style washes out there no matter which checkpoint you use. that's why there's no SDXL template set. not a limitation i can fix from this side." — u/behzad-gh, r/comfyui, 2026-07-30, 28 upvotes.

**(c) Negative prompt is mathematically inert on guidance-distilled models.**

`[USER]` ⚠ re-verify > "neither FLUX nor Z-Image takes a negative prompt. both are guidance distilled at CFG 1.0, so the negative branch multiplies out entirely. the templates ship with zeroed conditioning on the sampler's negative input… raising CFG doesn't bring it back." — u/behzad-gh, r/comfyui, 2026-07-30

`[USER]` ⚠ re-verify > "CFG has to be 1.0… this trips up a lot of people coming from SDXL… if you leave CFG at 7-8 like SDXL habit, you're not making it follow the prompt harder… set it to 1.0 and negative prompt barely matters anymore either, so I just left mine empty." — u/Realistic-Fennel-190, r/comfyui, ~2026-08-21

**Independent corroboration of the technical claim (non-Reddit, obtained separately):** the Z-Image-Turbo prompting guide on HuggingFace and huggingface/diffusers issue #13416 ("how to use zimage and flux2 with negative prompt?") both confirm these are guidance-distilled, do not use CFG at inference, and therefore do not take negative prompts. So the *claim* is solid even where the *quote* needs re-verification.
— https://huggingface.co/Tongyi-MAI/Z-Image-Turbo/discussions/8 · https://github.com/huggingface/diffusers/issues/13416

`[USER-PARA]` A Civitai custom node ("Flux Pseudo Negative Prompt") exists solely to route around this, and community notes flag Krea 2 Turbo's CFG 0.0 default as an even sharper trap (0.0 read as pure unconditional → prompt ignored).

**(d) Wrong-but-loadable components producing degraded-not-failed output** — the entire §4.3 black-frame table belongs here too. And architecture mismatch is indistinguishable from a bug:

`[USER]` ⚠ re-verify > "i get KSampler: mat1 and mat2 shapes cannot be multiplied (236x2560 and 4096x3072… that does not happen if i change the checkpoint to zimage turbo… i am sure the lora works all fine cuz i have used it but on a sd based workflow that does not support zimage"
> — u/White_Horizon, r/comfyui, 2026-01-21

### 6.4 Where users actually go for help

| Venue | Observed reality |
|---|---|
| **r/comfyui** | The de facto support channel by volume. Troubleshooting/showcase posts routinely draw 60–743 upvotes and dozens–hundreds of comments. `[USER]` ⚠ re-verify |
| **forum.comfy.org** (official) | Real but thin. Sampling the "latest" feed 2026-08-29: most threads 0–1 replies, 12–862 views. Unanswered examples: "Constant crashes are back, very unstable comfy ui" (0 replies/102 views), "Assertion Error in Chroma/Flux PuLid node" (0 replies/67 views). https://forum.comfy.org/latest `[OFFICIAL]` venue, low traction |
| **GitHub Issues** | Functions as quasi-support with a visible triage taxonomy: `User Support` (= not a real bug), `Potential Bug`, `Stale` (auto-closed). Multiple substantive issues in this report were closed `not planned` / `Stale` unresolved (#10490, #10119, #11581, #10228, #1107, #1081). |
| **GitHub Discussions** | The one place maintainer engagement shone: collaborator `comfyui-wiki` personally diagnosed the VACE frame-count issue and committed to a docs fix — `[STAFF]` "I think I should update the template and add a note about it." https://github.com/Comfy-Org/ComfyUI/discussions/8293 |
| **Google / generic search** | Colonised by AI blogspam — see §0. |
| **Discord** | Referenced by users (the Upscaler-4K quote originates there) but not crawlable; `[NOT FOUND]` as a citable evidence source. |

---

## 7. Learning & knowledge

### 7.1 What beginners repeatedly fail at (ranked by observed frequency)

1. **Red/missing nodes on someone else's workflow**, with no way to tell whether it's a missing pack, a version mismatch, or a path problem. Recurring across years — e.g. `[USER]` ⚠ re-verify u/Dotchy0 (r/comfyui, 2026-07-22): "I run into a bunch of missing custom node packages and validation errors… after restarting, the same errors still persist and the nodes remain red/missing." (1 comment — such threads often go unanswered.)
2. **Not knowing what a downloaded file *is*** — checkpoint vs LoRA vs ControlNet vs VAE, and which base architecture it targets. Evidenced by an entire third-party tool built for it (§4.2) plus the mat1/mat2 mismatch above.
3. **Where to put files / why the dropdown is empty** (§4.4) — has its own official KB article and still recurs.
4. **Low-VRAM confusion with no baseline for "normal"** — `[USER]` ⚠ re-verify a self-described absolute beginner on a GTX 1660 6GB, after trying multiple GGUF quant workflows, still could not tell whether 1-hour generations were expected: *"maybe I've done something stupid… or maybe that's just as good as it gets for now?"* — u/Fickle-Cattle2003, r/comfyui, 2025-12-21, 25 comments.
5. **Opaque dropdown/validation errors** (`Value not in list: swap_model: 'inswapper_128 (1).onnx' not in []`).

### 7.2 What intermediate users hit next

- **Sampler × scheduler choice** — treated as unsolved-by-documentation; a user brute-forced the full matrix for one model+LoRA combo and published it because no authority existed (`[USER-PARA]` ⚠ re-verify, r/comfyui, 183 upvotes).
- **Model-specific numeric constraints.** The clearest case, and a template/doc failure admitted by staff: `[STAFF]` "The step size for the length of WanVaceToVideo should be set to 4. It must be configured in a way that when 1 is subtracted from it, the resulting value is divisible by 4." — user's reply: *"I saw in the documentation 'step size 4' but I assumed it should be divisible by 4 without the +1."* — Discussion #8293. The docs said something true and were still misread; the maintainer conceded the template needed a note.
- **CFG/negative habits carried from SDXL to distilled models** (§6.3c) — this is squarely an *intermediate* failure: it requires already knowing SDXL conventions.
- **LoRA architecture/version mismatch** (§6.3a).

### 7.3 Official docs — honest coverage assessment

**Genuinely good `[OFFICIAL]`:**
- `docs.comfy.org/troubleshooting/custom-node-issues` — thorough bisection methodology, `comfy-cli node bisect`, per-OS steps.
- `docs.comfy.org/troubleshooting/overview` — correct, specific PyTorch/CUDA remediation, with a vendor-specific counter-warning for Intel.
- `docs.comfy.org/troubleshooting/model-issues` — tensor-dimension and architecture-mismatch errors, plus the two canonical FLUX VAE/CLIP mistakes.
- `docs.comfy.org/specs/workflow_json` — a real, versioned schema.
- Clear issue-routing by venue (node bugs → the node's repo; core → Comfy-Org/ComfyUI; desktop; frontend).

**Absent `[NOT FOUND]` — and this is the gap that matters:**
- **No page explaining `lora key not loaded`**, or that it can mean a *total* silent no-op rather than a partial one. ≥7 GitHub issues over ~2 years; zero canonical documentation.
- **No page on CFG=1.0 / guidance-distilled negative-prompt inertness** (FLUX, Z-Image, Klein, Krea 2). All explanation is community-authored.
- **No page on CLIP 77-token silent truncation** — when it happens, whether it warns.
- **No component-compatibility matrix beyond FLUX** — despite documented black-frame failures for Qwen-Image, LTX-2, MiniMax H3, Z-Image and Wan (§4.3).
- **No documentation that `--lowvram` became a no-op** anywhere except a source file (§5.2).

> **Net:** official docs are strong on *environment* problems and essentially silent on *model-semantics* problems. The silent-failure class — the one where the software tells you nothing and the output looks plausible — is exactly the class with no authoritative source, and it is exactly the class Prompt Studio already documents.

---

## 8. Companion-app opportunity assessment

**Prompt Studio's real constraints:** a single offline HTML file. No filesystem access beyond user-initiated file open / download. No network. No Python. No ability to inspect the ComfyUI install, run pip, or read the console. Anything requiring live environment introspection is out of reach **unless** the design admits a small optional companion custom node — flagged where relevant.

Ratings: **HIGH** = in reach, unmet need, defensible. **MEDIUM** = partially addressable, real caveats. **LOW** = mostly structural, don't build. **NONE** = out of reach, don't pretend.

| # | Opportunity | Category | Rating | Why |
|---|---|---|---|---|
| 1 | **Silent-failure pre-flight validator** | §6.3 | **HIGH** | Inert negatives on distilled models, >77-token truncation, LoRA/base architecture mismatch, CFG-0.0 traps. All decidable from prompt text + declared model — *no environment access needed*. Confirmed `[NOT FOUND]` gap in official docs. Prompt Studio already has the validator machinery. **Best opportunity in the report.** |
| 2 | **Model-component compatibility matrix** | §4.2–4.3 | **HIGH** | "Which text encoder + VAE + variant goes with which checkpoint, and which combinations produce black frames." Six documented black-frame families; official docs cover only FLUX. Pure knowledge, offline-deliverable. Also prevents 20–65GB wasted downloads. |
| 3 | **Curated offline gotchas/tutor bank** | §0, §7 | **HIGH** | Competes not with docs.comfy.org but with content farms (§0). Being *offline and versioned* is a feature: it can't rot mid-session and can carry honest "as of" dates. Must cover the §7.3 absences. |
| 4 | **Paste-your-log error decoder** | §1, §6.1–6.2 | **MEDIUM-HIGH** | User pastes a console log / traceback; offline pattern-matching maps it to cause + fix. Feasible in single-file HTML (regex + rules). Directly attacks the raw-traceback and red-node-ambiguity problems, and the `IMPORT FAILED`-without-reason gap (§2.3). Novel — nothing comparable found. Risk: rule set needs maintenance, and must degrade to "unknown" honestly rather than guessing. |
| 5 | **Workflow JSON inspector / portability report** | §3 | **MEDIUM** | Drop a workflow JSON → list required node packs, models, and detect the API-vs-UI format (§3.7). **Hard ceiling from §3.1:** `cnr_id`/`ver` coverage is inconsistent, there is no core-version or model-hash record. Only build this if it clearly separates *known* requirements from *unknowable* ones — otherwise it reproduces the confident-but-wrong failure this report criticises. |
| 6 | **VRAM/fit estimator** | §5 | **MEDIUM** | A calculator (params × dtype + resolution + frame count → will it fit) is offline-feasible and beginners lack any baseline for "normal" (§7.1.4). But Dynamic VRAM changed the model mid-flight and `--lowvram` is now a no-op (§5.2), so any estimate risks being confidently wrong. Ship only with explicit version scoping. |
| 7 | Node dependency/conflict resolution | §2.1–2.2 | **LOW** | Requires pip resolution in the live environment. Comfy-Org's own answer is process isolation, still unshipped. Out of reach — at most, *warn* that a named pack has a known conflict. |
| 8 | Install/environment repair | §1 | **NONE** | Needs to run commands in the right Python. Structural. The most a companion can do is #4 (decode the log and tell the user what to type). |
| 9 | Security / malicious-node defence | §2.6 | **NONE** | Registry-side problem; ban evasion defeats it even for Comfy-Org (§2.6). Do not imply protection. A one-line honest warning in the knowledge bank is the appropriate scope. |
| 10 | Memory-regression / rollback help | §1.5, §5.1 | **NONE** | No first-party rollback exists (§1.5). Not a companion-app problem. |

### Two cross-cutting design notes

**(a) The prompt-iteration loop is currently the worst-cached loop in ComfyUI.** §5.3 (#14618): changing prompt text alone forces a full model reload from disk. Iterating prompts *outside* ComfyUI and committing a validated prompt once is therefore not just convenient — it avoids a measured performance cliff. This is the strongest *structural* argument for Prompt Studio's existence found in this research, and it should be stated in the product's own positioning.

**(b) The "should it be a custom node?" question.** Opportunities 1–3 are strictly better as an offline HTML file: no install, no dependency surface, no contribution to §2.1's clobbering problem, and — pointedly — no participation in the ecosystem whose trust model just failed (§2.6). Opportunities 4–6 would be *more accurate* as a custom node (it could read the actual environment) but would inherit every fragility documented in §2. **Recommendation: stay a companion app.** If environment access ever becomes necessary, prefer asking the user to paste a log over shipping a node.

---

## 9. Gaps, negatives and things this report could not establish

- `[NOT FOUND]` **Issue reaction counts** — GitHub rendered "Reactions are currently unavailable" for the entire session. No reaction-count traction data exists anywhere in this file. Labels/state/comments were used instead.
- `[NOT FOUND]` **Independently re-verifiable Reddit quotes.** Obtained early via a Redlib mirror, not re-verifiable later. All marked ⚠ re-verify.
- `[NOT FOUND]` **YouTube commentary snippets.** The brief asked for these. Searches returned only SEO blogspam and Gumroad listings; no video comment threads were retrievable with available tooling. This is a genuine gap, not an omission.
- `[NOT FOUND]` Antivirus/Defender as a documented ComfyUI install-failure cause.
- `[NOT FOUND]` A live two-pack `NODE_CLASS_MAPPINGS` key collision report.
- `[NOT FOUND]` A primary source isolating Wan 2.1-vs-2.2 VAE mismatch as a sole black-output cause — **treat that widely-repeated claim as unproven.**
- `[NOT FOUND]` A primary quote for the frequently-repeated "Nodes 2.0 disables ~30% of existing custom nodes" figure. Do not cite it.
- `[NOT FOUND]` Pinokio- and Docker-specific install complaints distinct from the general venv/portable class.
- `[USER-PARA]` only (bodies not fetched, titles verified): ComfyUI #11260, #10292, #6254, #11731, #14340, frontend #9065, #8778, desktop #1255, ComfyUI-Manager PR #1356.

## 10. Sources

Comfy-Org core — https://github.com/Comfy-Org/ComfyUI/issues/7055 · /7415 · /8298 · /9635 · /10228 · /10232 · /10490 · /10522 · /11109 · /11404 · /11575 · /11581 · /11791 · /11833 · /11930 · /12076 · /12198 · /12330 · /12541 · /12638 · /12786 · /12893 · /12992 · /13116 · /13139 · /14076 · /14618 · /14844 · /15110 · /15524 · /6826 · /10119 · /5829
Discussions — /discussions/311 · /2635 · /4222 · /5015 · /8293 · /11429 · /12630 · /12699 · /6643
Frontend — https://github.com/Comfy-Org/ComfyUI_frontend/issues/10772 · /11333 · /12450
Desktop — https://github.com/Comfy-Org/desktop/issues/1081 · /1107 · /1345 · /1611 · /1741
Manager / CLI — https://github.com/Comfy-Org/ComfyUI-Manager/issues/1762 · /2201 · /3138 · https://github.com/Comfy-Org/comfy-cli/issues/446 · /344
Node packs — https://github.com/rgthree/rgthree-comfy/issues/706 · https://github.com/crystian/ComfyUI-Crystools/issues/249 · https://github.com/ltdrdata/ComfyUI-Impact-Pack/issues/1179 · https://github.com/city96/ComfyUI-GGUF/issues/39 · /94 · /205 · https://github.com/kijai/ComfyUI-WanVideoWrapper/issues/805 · /979 · https://github.com/Lightricks/ComfyUI-LTXVideo/issues/465 · https://github.com/QwenLM/Qwen-Image/issues/32 · /68
Third-party — https://github.com/LykosAI/StabilityMatrix/issues/244 · /991 · /1400 · https://github.com/huggingface/diffusers/issues/13416
Official — https://docs.comfy.org/troubleshooting/overview · /custom-node-issues · /model-issues · https://docs.comfy.org/specs/workflow_json · https://docs.comfy.org/installation/comfyui_portable_windows · https://support.comfy.org/articles/7025603568-where-do-models-go · https://github.com/comfyanonymous/ComfyUI/blob/master/comfy/cli_args.py
Blog — https://blog.comfy.org/p/dynamic-vram-in-comfyui-saving-local · /p/dependency-resolution-and-custom · /p/comfyui-manager-joins-comfy-org · /p/comfyui-2025-jan-security-update · /p/upscaler-4k-malicious-node-pack-post
Forum — https://forum.comfy.org/t/3881 · /t/3789 · /t/3801 · /t/1394 · /t/322 · /t/1511 · /latest
Other — https://huggingface.co/Tongyi-MAI/Z-Image-Turbo/discussions/8 · https://huggingface.co/city96/FLUX.1-dev-gguf/discussions/15 · /36 · https://huggingface.co/lllyasviel/flux1-dev-bnb-nf4/discussions/3 · https://blog.pypi.org/posts/2024-12-11-ultralytics-attack-analysis/ · https://docs.runpod.io/community-solutions/comfyui-to-api/overview · https://civitai.com/articles/20856
Reddit (⚠ re-verify) — r/comfyui threads 1rozib4 · 1i6l5js · 1v3ky0b · 1juaisp · 1var31u · 1vtikqr · 1qik19p · 1vo0o5r
