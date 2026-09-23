H3 Studio review build

Open H3Studio.html in Chrome or Edge to check this separate version. For the local
AI feature, start Ollama with !START HERE.bat in the repository root first.

This build includes two reliability changes compared with tools/H3Studio.html:
- Project imports sanitize media jobs, clip durations, and audio modes. An
  unsupported project version leaves the existing Restore-previous backup intact.
- AI replies must include the full project text schema before they can replace
  the current project. The final streamed response chunk is read even when the
  server omits a trailing newline.

Autosave and Restore-previous use separate review keys, so this copy does not
replace the main H3 Studio project's browser storage.

Nothing in this review folder is committed or published.
