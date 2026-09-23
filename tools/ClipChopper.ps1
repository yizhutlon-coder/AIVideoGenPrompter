param([string]$InputPath)
$ErrorActionPreference = 'Stop'

if (-not $InputPath) { $InputPath = Read-Host 'Drag a video file here and press Enter' }
$InputPath = $InputPath.Trim().Trim('"')
if (-not (Test-Path -LiteralPath $InputPath -PathType Leaf)) { throw "File not found: $InputPath" }
$file = Get-Item -LiteralPath $InputPath
$ffprobe = Get-Command ffprobe.exe -ErrorAction SilentlyContinue
$ffmpeg = Get-Command ffmpeg.exe -ErrorAction SilentlyContinue
if (-not $ffprobe -or -not $ffmpeg) { throw 'ffmpeg and ffprobe are required. Install an up-to-date ffmpeg build and try again.' }

$durationText = (& $ffprobe.Source -v error -show_entries format=duration -of default=nw=1:nk=1 $file.FullName | Select-Object -First 1)
if ($LASTEXITCODE -ne 0 -or -not $durationText) { throw 'Could not read video duration.' }
$duration = 0.0
if (-not [double]::TryParse($durationText.Trim(), [Globalization.NumberStyles]::Float,
    [Globalization.CultureInfo]::InvariantCulture, [ref]$duration)) { throw 'Video duration was invalid.' }
$wholeSeconds = [int][Math]::Floor($duration)
Write-Host "Duration: $wholeSeconds whole seconds ($durationText)"

$lengthText = Read-Host 'Chunk length in seconds [default 15]'
if (-not $lengthText) { $lengthText = '15' }
$length = 0
if (-not [int]::TryParse($lengthText, [ref]$length) -or $length -lt 2 -or $length -gt 3600) {
  throw 'Enter a whole number of seconds from 2 to 3600.'
}

$outDir = Join-Path $file.DirectoryName ($file.BaseName + '_chunks')
[IO.Directory]::CreateDirectory($outDir) | Out-Null
Write-Host "Writing chunks to: $outDir"
$index = 0
for ($start = 0; $start -lt $wholeSeconds; $start += $length) {
  $seconds = [Math]::Min($length, $wholeSeconds - $start)
  if ($seconds -lt 2) { Write-Host "Skipping final ${seconds}s remainder (below H3's 2s minimum)."; break }
  $index++
  $name = 'chunk_{0:D3}_{1}s-{2}s.mp4' -f $index, $start, ($start + $seconds)
  $output = Join-Path $outDir $name
  Write-Host "Chunk ${index}: ${start}s - $($start + $seconds)s"
  & $ffmpeg.Source -v error -y -ss $start -i $file.FullName -t $seconds -c:v libx264 -crf 18 -preset fast -c:a aac -movflags +faststart $output
  if ($LASTEXITCODE -ne 0) { throw "ffmpeg failed on chunk $index; check the video and available disk space." }
}
Write-Host "Done: $index chunk(s). H3 accepts up to 3 reference videos, 15 seconds total."
