@echo off
title Prompt Studio Launcher
echo.
echo  === Prompt Studio ===
echo.

rem -- 1. Is Ollama installed? --
where ollama >nul 2>nul
if errorlevel 1 (
  echo  Ollama is not installed yet.
  echo  Opening the download page -- install it, then double-click this file again.
  start https://ollama.com/download
  pause
  exit /b
)

rem -- 2. Allow the app page to talk to Ollama.
rem    NOTE: must be "*" -- Ollama rejects any value without a URL scheme, and
rem    browsers report local files as origin "null", which can't be listed.
setx OLLAMA_ORIGINS "*" >nul 2>nul
set OLLAMA_ORIGINS=*

rem -- 3. If a server is already running AND already allows the app, just reuse it --
del "%TEMP%\ps_headers.txt" >nul 2>nul
curl -s -m 2 -H "Origin: null" -o nul -D "%TEMP%\ps_headers.txt" http://localhost:11434/api/tags 2>nul
if exist "%TEMP%\ps_headers.txt" (
  findstr /I "access-control-allow-origin" "%TEMP%\ps_headers.txt" >nul 2>nul && (
    echo  Ollama is already running -- opening the studio.
    goto open
  )
)

rem -- 4. Otherwise restart Ollama with the right settings --
echo  Starting Ollama...
taskkill /F /IM "ollama app.exe" >nul 2>nul
taskkill /F /IM ollama.exe >nul 2>nul

rem wait for the port to be released (max ~10s)
set /a n=0
:freewait
set /a n+=1
if %n% GTR 10 goto startserve
curl -s -m 1 -o nul http://localhost:11434/api/tags 2>nul && (
  timeout /t 1 /nobreak >nul
  goto freewait
)

:startserve
start "" /B ollama serve >nul 2>nul

rem -- 5. Wait for the server to come up (max ~20s) --
set /a n=0
:upwait
set /a n+=1
if %n% GTR 20 goto open
timeout /t 1 /nobreak >nul
curl -s -m 1 -o nul http://localhost:11434/api/tags 2>nul || goto upwait

:open
rem -- 6. Open the app (it handles model download itself, with a progress bar) --
start "" "%~dp0PromptStudio.html"
exit /b
