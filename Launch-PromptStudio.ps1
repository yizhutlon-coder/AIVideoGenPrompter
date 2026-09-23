param([switch]$Portable)
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$serverScript = Join-Path $root 'Serve-PromptStudio.ps1'
$url = 'http://127.0.0.1:8765/PromptStudio.html'

function Get-LocalPageServer {
  try { return (Invoke-WebRequest -Uri 'http://127.0.0.1:8765/__health' -TimeoutSec 2 -UseBasicParsing).Content.Trim() }
  catch { return $null }
}

# Older launchers saved a wildcard for the whole Windows user account.
if ([Environment]::GetEnvironmentVariable('OLLAMA_ORIGINS', 'User') -eq '*') {
  [Environment]::SetEnvironmentVariable('OLLAMA_ORIGINS', $null, 'User')
  Write-Host 'Removed the wildcard Ollama browser permission saved by an older launcher.'
}

if ($Portable) {
  $env:OLLAMA_MODELS = Join-Path $root 'models'
  $ollamaExe = Join-Path $root 'runtime\ollama.exe'
  if (Test-Path -LiteralPath $ollamaExe -PathType Leaf) {
    & (Join-Path $root 'Verify-PortableRuntime.ps1') $ollamaExe
  } else {
    $command = Get-Command ollama.exe -ErrorAction SilentlyContinue
    if (-not $command) { throw 'No bundled Ollama runtime found. Run Make-Portable.bat first.' }
    $ollamaExe = $command.Source
  }
} else {
  $command = Get-Command ollama.exe -ErrorAction SilentlyContinue
  $installedOllama = Join-Path $env:LOCALAPPDATA 'Programs\Ollama\ollama.exe'
  if ($command) {
    $ollamaExe = $command.Source
  } elseif (Test-Path -LiteralPath $installedOllama -PathType Leaf) {
    $ollamaExe = $installedOllama
  } else {
    Write-Host 'Ollama is not installed. Opening its download page; run this launcher again after installing it.'
    Start-Process 'https://ollama.com/download'
    exit 1
  }
}

$env:OLLAMA_ORIGINS = ''
$env:OLLAMA_NO_CLOUD = '1'
$env:OLLAMA_HOST = '127.0.0.1:11434'

# Restart so the local-only settings apply even if another Ollama instance was running.
Get-Process -Name 'ollama', 'ollama app' -ErrorAction SilentlyContinue |
  Stop-Process -Force -ErrorAction SilentlyContinue
for ($i = 0; $i -lt 20; $i++) {
  try { Invoke-WebRequest -Uri 'http://127.0.0.1:11434/api/tags' -TimeoutSec 1 -UseBasicParsing | Out-Null }
  catch { break }
  Start-Sleep -Milliseconds 500
}
Start-Process -FilePath $ollamaExe -ArgumentList 'serve' -WindowStyle Hidden
$ready = $false
for ($i = 0; $i -lt 40; $i++) {
  try {
    $response = Invoke-WebRequest -Uri 'http://127.0.0.1:11434/api/tags' -TimeoutSec 1 -UseBasicParsing
    if ($response.StatusCode -eq 200) { $ready = $true; break }
  } catch { }
  Start-Sleep -Milliseconds 500
}
if (-not $ready) { throw 'Ollama did not start on 127.0.0.1:11434. Check whether another Ollama service owns that port.' }

$health = Get-LocalPageServer
if ($health -and $health -ne $root) { throw 'Another local page server is using port 8765. Close it before launching Prompt Studio.' }
if (-not $health) {
  Start-Process -FilePath 'powershell.exe' -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$serverScript`"" -WindowStyle Hidden
  for ($i = 0; $i -lt 20; $i++) {
    Start-Sleep -Milliseconds 250
    $health = Get-LocalPageServer
    if ($health) { break }
  }
}
if ($health -ne $root) { throw 'Prompt Studio local page server did not start on 127.0.0.1:8765.' }
Start-Process $url
Write-Host "Prompt Studio opened at $url"
