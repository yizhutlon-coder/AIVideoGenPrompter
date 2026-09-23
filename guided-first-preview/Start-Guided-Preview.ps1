$ErrorActionPreference = 'Stop'
$previewRoot = $PSScriptRoot
$previewUrl = 'http://127.0.0.1:8766/PromptStudio.html'
$healthUrl = 'http://127.0.0.1:8766/__health'

function Get-PreviewServer {
  try { return (Invoke-WebRequest -Uri $healthUrl -TimeoutSec 2 -UseBasicParsing).Content.Trim() }
  catch { return $null }
}

$health = Get-PreviewServer
if ($health -and $health -ne $previewRoot) { throw 'Another local page server is using port 8766.' }
if (-not $health) {
  $node = Get-Command node.exe -ErrorAction SilentlyContinue
  if (-not $node) { throw 'Node.js is required to launch this local preview.' }
  Start-Process -FilePath $node.Source -ArgumentList 'serve-preview.mjs' -WorkingDirectory $previewRoot -WindowStyle Hidden
  for ($i = 0; $i -lt 20; $i++) {
    Start-Sleep -Milliseconds 250
    $health = Get-PreviewServer
    if ($health) { break }
  }
}
if ($health -ne $previewRoot) { throw 'The guided preview server did not start on 127.0.0.1:8766.' }
Start-Process $previewUrl
Write-Host "Guided-first preview opened at $previewUrl"
