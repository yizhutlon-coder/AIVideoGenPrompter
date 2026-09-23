@echo off
title Prompt Studio Launcher
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0Launch-PromptStudio.ps1"
if errorlevel 1 pause
