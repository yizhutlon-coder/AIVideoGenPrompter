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

echo  [1/2] Downloading portable Ollama runtime, about 1 GB, from ollama.com ...
curl -L --progress-bar -o "%TEMP%\ollama-portable.zip" https://ollama.com/download/ollama-windows-amd64.zip
if errorlevel 1 goto dl_fail
mkdir "%ROOT%runtime" 2>nul
echo  Extracting...
tar -xf "%TEMP%\ollama-portable.zip" -C "%ROOT%runtime"
if errorlevel 1 goto ex_fail
del "%TEMP%\ollama-portable.zip" 2>nul
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
echo  Download failed - check your connection.
pause
exit /b

:ex_fail
echo  Extract failed.
pause
exit /b
