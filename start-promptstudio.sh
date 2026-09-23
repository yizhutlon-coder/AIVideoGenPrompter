#!/bin/sh
set -eu
cd "$(dirname "$0")"

if ! command -v ollama >/dev/null 2>&1; then
  echo 'Ollama is not installed. Opening its download page; run this launcher again after installing it.'
  open 'https://ollama.com/download' 2>/dev/null || xdg-open 'https://ollama.com/download'
  exit 1
fi
if ! command -v python3 >/dev/null 2>&1; then
  echo 'Python 3 is needed to serve the local app page securely on macOS/Linux.'
  exit 1
fi

# A localhost page can reach Ollama under its default CORS rules. Do not use '*'.
unset OLLAMA_ORIGINS
export OLLAMA_NO_CLOUD=1
export OLLAMA_HOST=127.0.0.1:11434
pkill -f 'ollama serve' 2>/dev/null || true
pkill -x 'Ollama' 2>/dev/null || true
for i in 1 2 3 4 5 6 7 8 9 10; do
  if ! curl -fsS --max-time 1 http://127.0.0.1:11434/api/tags >/dev/null 2>&1; then break; fi
  sleep 1
done
nohup ollama serve >/dev/null 2>&1 &
ready=0
for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20; do
  if curl -fsS --max-time 1 http://127.0.0.1:11434/api/tags >/dev/null 2>&1; then ready=1; break; fi
  sleep 1
done
if [ "$ready" -ne 1 ]; then echo 'Ollama did not start on 127.0.0.1:11434.'; exit 1; fi

root=$(pwd -P)
health=$(curl -fsS --max-time 2 http://127.0.0.1:8765/__health 2>/dev/null || true)
if [ -n "$health" ] && [ "$health" != "$root" ]; then
  echo 'Another local page server is using port 8765. Close it before launching Prompt Studio.'
  exit 1
fi
if [ -z "$health" ]; then
  nohup python3 serve-promptstudio.py >/dev/null 2>&1 &
  for i in 1 2 3 4 5 6 7 8 9 10; do
    sleep 1
    health=$(curl -fsS --max-time 2 http://127.0.0.1:8765/__health 2>/dev/null || true)
    if [ -n "$health" ]; then break; fi
  done
fi
if [ "$health" != "$root" ]; then echo 'Prompt Studio local page server did not start.'; exit 1; fi
url='http://127.0.0.1:8765/PromptStudio.html'
open "$url" 2>/dev/null || xdg-open "$url"
