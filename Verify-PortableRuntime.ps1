param([Parameter(Mandatory=$true)][string]$ExePath)
$ErrorActionPreference = 'Stop'
if (-not (Test-Path -LiteralPath $ExePath -PathType Leaf)) { throw 'Portable Ollama executable is missing.' }
$signature = Get-AuthenticodeSignature -LiteralPath $ExePath
$subject = if ($signature.SignerCertificate) { $signature.SignerCertificate.Subject } else { '' }
if ($signature.Status -ne 'Valid' -or $subject -notmatch '(^|, )O=Ollama Inc\.(,|$)') {
  throw "Portable Ollama executable is not validly signed by Ollama Inc. ($($signature.Status)). Do not run it."
}
