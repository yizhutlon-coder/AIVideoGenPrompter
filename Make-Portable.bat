@echo off
setlocal
title Make Portable Package
echo.
echo  === Make Portable Package ===
echo  Turns this folder into a fully self-contained kit - runtime + model + tools -
echo  that runs from a USB stick on any Windows machine with NO install.
echo.

set "ROOT=%~dp0"

rem -- 1. Portable Ollama runtime --
if exist "%ROOT%runtime\ollama.exe" goto have_runtime
if exist "%ROOT%runtime" goto partial_runtime

echo  [1/2] Downloading portable Ollama runtime, about 1 GB, from ollama.com ...
set "ZIP=%TEMP%\ollama-portable-%RANDOM%-%RANDOM%.zip"
curl --fail --location --proto "=https" --proto-redir "=https" --tlsv1.2 --progress-bar -o "%ZIP%" https://ollama.com/download/ollama-windows-amd64.zip
if errorlevel 1 goto dl_fail
mkdir "%ROOT%runtime" 2>nul
echo  Checking archive paths...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%ROOT%Verify-PortableZip.ps1" "%ZIP%" "%ROOT%runtime"
if errorlevel 1 goto ex_fail
echo  Extracting...
tar -xf "%ZIP%" -C "%ROOT%runtime"
if errorlevel 1 goto ex_fail
if not exist "%ROOT%runtime\ollama.exe" goto ex_fail
echo  Checking Ollama's publisher signature...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%ROOT%Verify-PortableRuntime.ps1" "%ROOT%runtime\ollama.exe"
if errorlevel 1 goto ex_fail
del "%ZIP%" 2>nul
echo  Runtime ready.
goto models

:have_runtime
echo  [1/2] Portable runtime already present - skipping download.

:models
echo.
if not exist "%USERPROFILE%\.ollama\models\manifests" goto no_models

echo  [2/2] Copying your downloaded models into the package - several GB ...
robocopy "%USERPROFILE%\.ollama\models" "%ROOT%models" /E /NJH /NJS /NDL /NFL >nul
echo  Models copied.
goto done

:no_models
echo  [2/2] No local models found to copy.
echo  That's fine - on any machine, Start-Portable.bat plus the app's Download
echo  button will pull the model straight onto this folder or stick.
mkdir "%ROOT%models" 2>nul

:done
echo.
echo  Done. This folder is now self-contained:
echo    - copy it to a USB stick or any machine
echo    - double-click Start-Portable.bat  - no install, no admin, and no
echo      internet needed once the model is in the models folder
echo.
echo  Tip: USB 3.0, or copying the folder onto the machine first, makes model
echo  loading much faster. On weak laptops use the Qwen 3B model instead of 7B.
pause
exit /b

:dl_fail
if defined ZIP del "%ZIP%" 2>nul
echo  Download failed - check your connection.
pause
exit /b 1

:ex_fail
if defined ZIP del "%ZIP%" 2>nul
echo  Runtime extraction or publisher verification failed. Do not use the incomplete runtime folder.
pause
exit /b 1

:partial_runtime
echo  The runtime folder exists but has no ollama.exe. Move that incomplete folder aside, then try again.
pause
exit /b 1
