# Guided-first Prompt Studio preview

Double-click `Start-Guided-Preview.bat` on Windows, or run `node serve-preview.mjs` here and open `http://127.0.0.1:8766/PromptStudio.html`. Node.js is required for this preview launcher; Ollama is optional.

This is a separate draft of the app. The current `PromptStudio.html` and `tools/WalkThrough.html` in the project root are unchanged by this preview. Port 8766 gives the draft its own browser storage, separate from the current app on port 8765.

The first screen opens the step-by-step builder without requiring Ollama. **Paste an idea · local AI** remains available as a direct route. A local model is optional for the guide's AI review and Chinese version. The Chinese action currently appears only for guided Wan 2.2 I2V and Z-Image Turbo drafts, where the existing translation checks apply; it does not claim coverage for the other guided formats.

The preview reuses the current project's H3 Builder, H3 Studio, clip tools, and Meta Inspector through its local server. Those shared tools are not copied or changed here. Prompts and reference files are not sent outside the user's local machine by this preview; the browser connects only to the local Ollama and optional ComfyUI endpoints allowed by the server policy.

This draft is for comparison. It does not replace the main app or install a model.
