#!/bin/bash
# Prompt Studio launcher (Mac / Linux)
cd "$(dirname "$0")"

if ! command -v ollama >/dev/null 2>&1; then
  echo "Ollama is not installed yet. Opening the download page..."
  open "https://ollama.com/download" 2>/dev/null || xdg-open "https://ollama.com/download"
  exit 1
fi

# Allow the app page to talk to Ollama.
# NOTE: must be "*" -- Ollama rejects any value without a URL scheme, and
# browsers report local files as origin "null", which can't be listed.
export OLLAMA_ORIGINS="*"

# If a server is already running and already allows the app, reuse it
if curl -s -m 2 -H "Origin: null" -D - -o /dev/null http://localhost:11434/api/tags 2>/dev/null | grep -qi "access-control-allow-origin"; then
  open "PromptStudio.html" 2>/dev/null || xdg-open "PromptStudio.html"
  exit 0
fi

# Otherwise restart the server with the right setting
pkill -f "ollama serve" 2>/dev/null
pkill -x "Ollama" 2>/dev/null
sleep 2
nohup ollama serve >/dev/null 2>&1 &

# Wait for the server (max ~20s)
for i in $(seq 1 20); do
  curl -s http://localhost:11434/api/tags >/dev/null 2>&1 && break
  sleep 1
done

open "PromptStudio.html" 2>/dev/null || xdg-open "PromptStudio.html"
