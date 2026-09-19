$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$serverProcess = $null

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  throw "Node.js 20+ is required. Install Node.js and run this script again."
}

if (-not (Get-Command cloudflared -ErrorAction SilentlyContinue)) {
  Write-Host "cloudflared is not installed. Installing the official Cloudflare package with winget..." -ForegroundColor Yellow
  if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    throw "winget is not available. Install cloudflared from https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/"
  }
  winget install --id Cloudflare.cloudflared --exact --accept-source-agreements --accept-package-agreements
  $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
  if (-not (Get-Command cloudflared -ErrorAction SilentlyContinue)) {
    throw "cloudflared was installed but is not on PATH yet. Close and reopen PowerShell, then run this script again."
  }
}

Write-Host "Starting Spirit Slasher backend on http://127.0.0.1:8787 ..." -ForegroundColor Cyan
$serverProcess = Start-Process -FilePath "node" -ArgumentList "server/server.js" -WorkingDirectory $projectRoot -PassThru

try {
  Write-Host "Starting HTTPS Quick Tunnel. Share the URL ending in trycloudflare.com with Billy." -ForegroundColor Green
  Write-Host "The app auto-connects when opened from that URL. Press Ctrl+C to stop both server and tunnel." -ForegroundColor Green
  # cloudflared writes normal informational logs to stderr. PowerShell turns
  # native stderr into an error record when ErrorActionPreference is Stop, so
  # allow those logs through without treating them as a failed tunnel.
  $previousErrorActionPreference = $ErrorActionPreference
  $ErrorActionPreference = "Continue"
  $openedTunnelTab = $false
  $tunnelArguments = @("tunnel", "--no-autoupdate")
  if ($env:SPIRIT_TUNNEL_PROTOCOL) {
    $tunnelArguments += @("--protocol", $env:SPIRIT_TUNNEL_PROTOCOL)
  }
  $tunnelArguments += @("--url", "http://127.0.0.1:8787")
  $transportLabel = if ($env:SPIRIT_TUNNEL_PROTOCOL) { $env:SPIRIT_TUNNEL_PROTOCOL } else { "default QUIC" }
  Write-Host "Tunnel transport: $transportLabel" -ForegroundColor DarkGray
  & cloudflared @tunnelArguments 2>&1 | ForEach-Object {
    $line = $_.ToString()
    Write-Host $line
    if (-not $openedTunnelTab -and $line -match "https://[a-z0-9-]+\.trycloudflare\.com") {
      $publicUrl = $Matches[0]
      $openedTunnelTab = $true
      Write-Host "Open this URL on the host and send it to Billy: $publicUrl" -ForegroundColor Yellow
      Start-Process $publicUrl
    }
  }
  $ErrorActionPreference = $previousErrorActionPreference
}
finally {
  if ($serverProcess -and -not $serverProcess.HasExited) {
    Stop-Process -Id $serverProcess.Id -Force
  }
}
