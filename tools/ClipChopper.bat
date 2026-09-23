@echo off
title Clip Chopper (H3 prep)
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0ClipChopper.ps1" -InputPath "%~1"
if errorlevel 1 echo Clip Chopper stopped without finishing.
pause
