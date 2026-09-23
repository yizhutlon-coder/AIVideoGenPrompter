param([Parameter(Mandatory=$true)][string]$ZipPath,
      [Parameter(Mandatory=$true)][string]$RuntimePath)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$destination = [IO.Path]::GetFullPath($RuntimePath).TrimEnd('\', '/') + [IO.Path]::DirectorySeparatorChar
$archive = [IO.Compression.ZipFile]::OpenRead($ZipPath)
try {
  foreach ($entry in $archive.Entries) {
    $name = $entry.FullName.Replace('\', '/')
    if (-not $name -or $name.StartsWith('/') -or $name -match '^[A-Za-z]:' -or
        ($name.Split('/') -contains '..') -or (($entry.ExternalAttributes -shr 16) -band 0xF000) -eq 0xA000) {
      throw "Unsafe path or link in portable runtime ZIP: $name"
    }
    $target = [IO.Path]::GetFullPath((Join-Path $destination $name))
    if (-not $target.StartsWith($destination, [StringComparison]::OrdinalIgnoreCase)) {
      throw "Portable runtime ZIP entry escapes its folder: $name"
    }
  }
} finally { $archive.Dispose() }
