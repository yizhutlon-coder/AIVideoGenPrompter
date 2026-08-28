@echo off
setlocal EnableDelayedExpansion
title Clip Chopper (H3 prep)
echo.
echo  === Clip Chopper ===
echo  Splits a video into exact whole-second chunks (frame-accurate re-encode).
echo.

rem -- ffmpeg installed? --
where ffmpeg >nul 2>nul
if errorlevel 1 (
  echo  ffmpeg is not installed. Easiest fix, run:
  echo     winget install Gyan.FFmpeg
  echo  then re-run this file.
  pause
  exit /b
)

rem -- input video: drag & drop onto this .bat, or prompt --
set "IN=%~1"
if "%IN%"=="" (
  set /p IN=Drag a video file into this window and press Enter:
)
rem strip quotes if pasted
set "IN=%IN:"=%"
if not exist "%IN%" (
  echo  File not found: %IN%
  pause
  exit /b
)

rem -- probe duration --
for /f "usebackq delims=" %%d in (`ffprobe -v error -show_entries format^=duration -of default^=nw^=1:nk^=1 "%IN%"`) do set DUR=%%d
for /f "delims=." %%w in ("%DUR%") do set /a DURW=%%w
echo  Duration: %DURW% seconds (%DUR%)

set /p LEN=Chunk length in seconds [default 15]:
if "%LEN%"=="" set LEN=15
echo %LEN%|findstr /r "^[0-9][0-9]*$" >nul || ( echo  Whole seconds only. & pause & exit /b )
if %LEN% LSS 2 ( echo  H3 needs clips of at least 2 seconds. & pause & exit /b )

set "OUTDIR=%~dpn1_chunks"
if "%~1"=="" set "OUTDIR=%IN%_chunks"
mkdir "%OUTDIR%" 2>nul
echo  Writing chunks to: %OUTDIR%
echo.

set /a START=0
set /a IDX=0
:loop
if %START% GEQ %DURW% goto done
set /a IDX+=1
set /a END=START+LEN
if %END% GTR %DURW% set /a END=DURW
set /a THIS=END-START
if %THIS% LSS 2 (
  echo  Skipping final %THIS%s remainder ^(below H3's 2s minimum^).
  goto done
)
set "PAD=00%IDX%"
set "PAD=!PAD:~-3!"
echo  Chunk !PAD!: %START%s - %END%s  (%THIS%s^)
ffmpeg -v error -y -ss %START% -i "%IN%" -t %THIS% -c:v libx264 -crf 18 -preset fast -c:a aac -movflags +faststart "%OUTDIR%\chunk_!PAD!_%START%s-%END%s.mp4"
set /a START+=LEN
goto loop

:done
echo.
echo  Done — %IDX% chunk(s) in %OUTDIR%
echo  Reminder: H3 accepts up to 3 reference videos, 15 seconds TOTAL.
pause
