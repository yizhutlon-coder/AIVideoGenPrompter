H3 Studio — independent build from the 2026-09-17 handoff instructions

Double-click !START MAIN + H3 STUDIO.bat in the repository root. It opens
Prompt Studio and this fresh H3 Studio page, after preparing local Ollama.
You can also open H3Studio.html directly in Chrome or Edge after Ollama starts.

The fresh tool's Model dropdown lets you switch among installed Ollama models;
the ↻ button refreshes the list after a new model is installed. This selection
is remembered for the fresh tool and is separate from the main app's selection.
When available, the standard qwen2.5:7b-instruct model is selected by default.
AI requests use Ollama's structured JSON output. An incomplete JSON response or
missing shot timeline gets one automatic repair pass. The repair keeps explicit
cut times and the requested shot count when it can. If repair still fails, the
project stays unchanged and your request remains in the chat box. Review the
Checks card after each draft, especially when using a smaller local model.

This is a separate implementation of the requested advanced workbench. It has
its own browser autosave and undo keys. JSON project files can be exchanged
with tools/H3Studio.html in either direction.

The main Prompt Studio Tools menu still opens tools/H3Studio.html. This folder
is for review only. No files in this folder have been committed or pushed.
