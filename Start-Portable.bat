@echo off
setlocal
title Prompt Studio (Portable)
echo.
echo  === Prompt Studio (Portable) ===
echo.

set "ROOT=%~dp0"

rem -- models live in this folder, so everything travels together --
set "OLLAMA_MODELS=%ROOT%models"
set OLLAMA_ORIGINS=*

rem -- prefer the bundled runtime; fall back to an installed ollama --
set "OLLAMA_EXE=%ROOT%runtime\ollama.exe"
if not exist "%OLLAMA_EXE%" (
  where ollama >nul 2>nul
  if errorlevel 1 (
    echo  No bundled runtime found and Ollama is not installed on this machine.
    echo  Run Make-Portable.bat once (needs internet) to bundle the runtime here.
    pause
    exit /b
  )
  set "OLLAMA_EXE=ollama"
  echo  Using this machine's installed Ollama with the portable models folder.
)

rem -- stop any Ollama already running (it would use the wrong models folder) --
taskkill /F /IM "ollama app.exe" >nul 2>nul
taskkill /F /IM ollama.exe >nul 2>nul

rem -- wait for the port to free up (max ~8s) --
set /a n=0
:freewait
set /a n+=1
if %n% GTR 8 goto startserve
curl -s -m 1 -o nul http://localhost:11434/api/tags 2>nul && (
  timeout /t 1 /nobreak >nul
  goto freewait
)

:startserve
start "" /B "%OLLAMA_EXE%" serve >nul 2>nul

rem -- wait for the server (max ~20s) --
set /a n=0
:upwait
set /a n+=1
if %n% GTR 20 goto open
timeout /t 1 /nobreak >nul
curl -s -m 1 -o nul http://localhost:11434/api/tags 2>nul || goto upwait

:open
start "" "%ROOT%PromptStudio.html"
echo  Running. Models folder: %OLLAMA_MODELS%
echo  You can close this window.
timeout /t 4 >nul
exit /b
