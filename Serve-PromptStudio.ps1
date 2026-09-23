# Serves only Prompt Studio pages on loopback. No directory listing, CORS, or file upload.
$ErrorActionPreference = 'Stop'
$port = 8765
$root = $PSScriptRoot
$pages = @{
  '/' = 'PromptStudio.html'
  '/PromptStudio.html' = 'PromptStudio.html'
  '/tools/H3Builder.html' = 'tools/H3Builder.html'
  '/tools/H3Studio.html' = 'tools/H3Studio.html'
  '/tools/WalkThrough.html' = 'tools/WalkThrough.html'
  '/tools/ClipPicker.html' = 'tools/ClipPicker.html'
  '/tools/ClipStitcher.html' = 'tools/ClipStitcher.html'
  '/tools/MetaInspector.html' = 'tools/MetaInspector.html'
  '/tools/video-prompt-translator.html' = 'tools/video-prompt-translator.html'
  '/tools/h3-studio-from-spec/H3Studio.html' = 'tools/h3-studio-from-spec/H3Studio.html'
  '/tools/h3-studio-review/H3Studio.html' = 'tools/h3-studio-review/H3Studio.html'
}
$csp = "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; font-src 'self' data:; frame-src 'self'; frame-ancestors 'self'; connect-src http://localhost:11434 http://127.0.0.1:11434 http://127.0.0.1:8188; object-src 'none'; base-uri 'none'; form-action 'none'"
$listener = [Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback, $port)
$listener.Start()
try {
  while ($true) {
    $client = $listener.AcceptTcpClient()
    try {
      $client.ReceiveTimeout = 5000
      $client.SendTimeout = 5000
      $stream = $client.GetStream()
      $buffer = [byte[]]::new(8192)
      $count = 0
      while ($count -lt $buffer.Length) {
        $read = $stream.Read($buffer, $count, $buffer.Length - $count)
        if ($read -eq 0) { break }
        $count += $read
        if ([Text.Encoding]::ASCII.GetString($buffer, 0, $count).Contains("`r`n`r`n")) { break }
      }
      $header = [Text.Encoding]::ASCII.GetString($buffer, 0, $count)
      $lines = $header.Split(@("`r`n"), [StringSplitOptions]::None)
      $parts = $lines[0].Split(' ')
      $method = if ($parts.Length -gt 0) { $parts[0] } else { '' }
      $route = if ($parts.Length -gt 1) { $parts[1].Split('?')[0] } else { '' }
      $hostLine = $lines | Where-Object { $_ -match '^Host:' } | Select-Object -First 1
      $hostName = if ($hostLine) { $hostLine.Substring(5).Trim() } else { '' }
      $status = '200 OK'
      $body = [byte[]]::new(0)
      $type = 'text/plain; charset=utf-8'
      if ($hostName -ne "127.0.0.1:$port") { $status = '400 Bad Request' }
      elseif ($method -ne 'GET' -and $method -ne 'HEAD') { $status = '405 Method Not Allowed' }
      elseif ($route -eq '/__health') { $body = [Text.Encoding]::UTF8.GetBytes($root) }
      elseif ($pages.ContainsKey($route)) {
        $path = Join-Path $root $pages[$route]
        if (Test-Path -LiteralPath $path -PathType Leaf) {
          $body = [IO.File]::ReadAllBytes($path)
          $type = 'text/html; charset=utf-8'
        } else { $status = '404 Not Found' }
      } else { $status = '404 Not Found' }
      $headers = "HTTP/1.1 $status`r`nContent-Type: $type`r`nContent-Length: $($body.Length)`r`nConnection: close`r`nX-Content-Type-Options: nosniff`r`nX-Frame-Options: SAMEORIGIN`r`nReferrer-Policy: no-referrer`r`nCache-Control: no-store`r`nContent-Security-Policy: $csp`r`n`r`n"
      $headerBytes = [Text.Encoding]::ASCII.GetBytes($headers)
      $stream.Write($headerBytes, 0, $headerBytes.Length)
      if ($method -eq 'GET' -and $body.Length) { $stream.Write($body, 0, $body.Length) }
    } catch { }
    finally { $client.Close() }
  }
} finally { $listener.Stop() }
