@echo off
setlocal
title Prompt Studio + H3 Studio

set "H3_PAGE=%~dp0H3Studio.html"
if not exist "%H3_PAGE%" (
  echo H3 Studio page is missing:
  echo %H3_PAGE%
  pause
  exit /b 1
)

rem The main launcher locates Ollama and opens Prompt Studio.
call "%~dp0..\Start-PromptStudio.bat"
if errorlevel 1 exit /b 1
start "" "http://127.0.0.1:8765/tools/H3Studio.html"
exit /b 0
