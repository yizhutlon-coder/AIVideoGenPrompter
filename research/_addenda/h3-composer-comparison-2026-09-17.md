# Competitive review: "H3 Prompt Composer" (BMB12d3) vs our H3 Builder — 2026-09-17

Subject: https://github.com/BMB12d3/minimax-h3-prompt-composer — single-file offline H3 prompt
builder, actively developed (V5.43.4 at review time, 1.27 MB HTML). Reviewed via README, changelog,
and both official PDF user guides (~100% of guide text); **code itself only ~7% fetched (CSS only),
so all behavior claims below are documentation-derived, not code-verified**.

LICENSE: none in repo → all-rights-reserved. We may use FACTS about H3 (all independently in our
corpus) and reimplement CONCEPTS in our own words/code. We may NOT copy their code, UI text, guide
prose, or phrase-bank wording. Nothing from their materials may be pasted into our product.

## What they do better (ranked, concept-level)

1. Timed Action Beats vs Shots as distinct structural objects (Shot = a cut; Beat = a timed window
   inside a continuous shot; dialogue binds to a Beat). We infer beats by regex-counting timing words
   — theirs is the correct model and would make our beat-budget rule countable instead of guessed.
2. Typed per-reference "job" ownership (picture: frame-anchor/wardrobe/scale/continuity/storyboard/
   lighting; video: source-edit/continuation/performance/camera/timing; audio: timbre/exact-dialogue/
   copied-source/music-style/texture) → drives generated definitions, default retention markers, and
   a "two references claim the same job" check.
3. Single-camera-authority arbitration: one authoring path active, dormant drafts kept, warning when
   source footage owns the camera and a second authority is added. We have no analogue.
4. Endpoint-first camera builder (start frame → end frame → physically compatible move) with
   suppression rules: omit medium amplitude and normal speed rather than over-specifying. Our
   dropdowns currently invite over-specification.
5. Graded scale/placement transfer (height-only safest → +approximate placement) with explicit
   authority boundaries; "Spatial Placement Map = coordinates only".
6. Project persistence: autosave + JSON save/load + versioned migration + one-slot pre-destructive
   "Restore previous". Our H3Builder has zero persistence.
7. Multi-Generation sequences with a reference library + previous-generation continuity pictures
   ("crop away stale evidence"), same-scene vs new-location continuity switch.
8. Deterministic Prompt Coach with an honest empty state ("no rule fired ≠ prose is optimal") that
   never blocks output; Locate buttons jumping from finding → field.
9. Seven guided editing workflows (insert/replace subject, background+relight, performance/camera
   transfer, continue-video) provisioning only the inputs each needs; built-in examples that pass
   their own checks clean.
10. Frame Grabber with purpose-encoding filenames (slot, generation, purpose, time).

Not substantiated in their docs: subject-level voice binding mechanics. Locate is conditional
("when one clear source exists").

## What we do better

Arrival-order tag simulation matching nodes_minimax_h3.py (incl. renumber-on-toggle footgun);
bidirectional cited↔attached tag reconciliation; evidence-graded corpus with regrade history behind
every rule; beat budgets (5s:3-4 / 10s:5-7 / 15s:6-9 — absent from their docs entirely); LLM
translation + tutor + 12-model breadth and cross-model doctrine; trap checks they lack ((word:1.2)
inert-and-renderable, {a|b} wildcard expansion, arrows/[CUT TO] as literal text); honest length guard
tied to the real ValueError string; surrounding toolchain (Gotchas, Picker, ClipPicker/Stitcher,
MetaInspector, installed-models link).

## Factual deltas (verdicts)

- Duration floor 4-15s (theirs) vs 5-15 (ours): BOTH PARTLY RIGHT. 4s is the MiniMax doc envelope;
  it snaps to 107 frames (~4.46s), below ComfyUI's stated trained range 124-362. Our 5s local floor
  stands; corpus already documents the 107-123 "legal but below trained range" band.
- "7,000-character prompt ceiling": UNSOURCED (no derivation anywhere in their guides; hedged as
  "currently checks"). Our [SPECULATION] ~450-word split-into-shots nudge remains the honest form.
  The underlying failure is real (hard ValueError, not truncation). Settled only by tokenizing
  against H3's text encoder.
- "12 mixed reference files total" as a LOCAL rule: WRONG (theirs), per our regraded corpus —
  Autogrow maxima 9/3/3/3, 18 slots, no total cap; 12 traces to a third-party README, hosted-path
  only. **Our own H3Builder shipped the same stale hard error** (check() E at >12 files) — fixed
  2026-09-17 to a hosted-path advisory; budget readout relabeled "(12 = hosted cap; local has none)".
- 9 pictures / 3 videos / 3 standalone audio: agree. (Our extra precision: <Audio j> can reach 6
  with soundtracks; their per-type framing doesn't surface this.)
- 17n+5 @ 24fps, 10.00s → 243 frames → ~10.13s: arithmetic correct, matches our frameCount().

## Output-schema conformance

Their generated structure matches the official schema our corpus verified from ComfyUI source:
integrated_multimodal_description / six Ref2VA sections in order / Shot-1-no-timestamp with strictly
increasing MM:SS.mmm / (S1) speaker stability / <d>[Lang]…</d> / same 4+4 retention vocabulary /
350-500-word detailed_description target (≈ our 300/550 band). No deviations found either direction.
Their extra: English-only rule for all sections except literal dialogue/lyrics/on-screen text.

## Security note

Their no-network claim is self-reported and was NOT independently verified (code slice fetched was
CSS only). They publish a SHA-256 like we do. Treat as plausible, unaudited.

## Adoption outcome (2026-09-17; concepts only, own implementation)

Owner decision: keep H3Builder deliberately simple as the learning tool; adoptions land in a new
separate advanced tool, tools/H3Studio.html.

1. DONE in H3Builder (stays): 12-file cap demoted to hosted-path advisory; budget relabeled.
2. DONE in H3Studio: typed reference "job" per media (per-kind enums) driving starter
   subject_definitions/retention lines (job→default marker map) + duplicate-exclusive-job warning.
3. DONE in H3Studio (adapted): rather than a structured beat tree, a parsed "timeline x-ray" —
   [Shot N] blocks parsed into per-shot windows, sentence-counted beats vs the official budget
   (dialogue lines count as one beat), and dialogue-longer-than-its-shot warnings (~140wpm).
   Free-text authoring is preserved on purpose: writing the dialect is the pedagogy.
4. DONE in H3Studio: localStorage autosave (versioned payload v:1), JSON save/load with migration
   hook, pre-destructive Restore-previous that swaps (press twice = undo the restore).
5. DONE in H3Studio: one-camera-authority-per-shot warning, camera-reference-video vs authored-move
   conflict (uses the job field), amplitude/speed suppression hint; plus → locate buttons on every
   check finding (scroll + flash + select the offending text).
Deferred: honest-empty-state coach framing, built-in worked examples.
