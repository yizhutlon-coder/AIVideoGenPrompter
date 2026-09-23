@echo off
title Prompt Studio (Portable)
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Launch-PromptStudio.ps1" -Portable
if errorlevel 1 pause
