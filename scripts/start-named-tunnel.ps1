[CmdletBinding()]
param(
  [string]$Hostname = "slasher.spirituniverse.gr",
  [int]$Port = 8787,
  [switch]$NoBrowser,
  [switch]$NoServiceStart
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot

if ($Hostname -notmatch '^[a-z0-9.-]+$') {
  throw "Hostname contains unsupported characters: $Hostname"
}

$node = Get-Command node.exe -ErrorAction SilentlyContinue
if (-not $node) { throw "Node.js was not found in PATH. Install Node.js 20+ first." }

$tunnelService = Get-Service -Name "cloudflared" -ErrorAction SilentlyContinue
if (-not $tunnelService) {
  throw "The cloudflared Windows service is not installed. Run the Cloudflare dashboard's service install command once (with a fresh token), then run this script again. The token is intentionally not stored in this repository."
}

$serverProcess = $null
try {
  $serverProcess = Start-Process -FilePath $node.Source -ArgumentList @("server/server.js") -WorkingDirectory $projectRoot -PassThru

  $health = $null
  for ($attempt = 0; $attempt -lt 30 -and -not $health; $attempt++) {
    try {
      $health = Invoke-RestMethod -Uri "http://127.0.0.1:$Port/api/health" -TimeoutSec 2
    } catch {
      Start-Sleep -Milliseconds 500
    }
  }
  if (-not $health -or -not $health.ok) { throw "The local game server did not become healthy on port $Port." }

  if (-not $NoServiceStart -and $tunnelService.Status -ne "Running") {
    try {
      Start-Service -Name "cloudflared"
      $tunnelService.WaitForStatus("Running", [TimeSpan]::FromSeconds(15))
    } catch {
      throw "The cloudflared service is installed but could not be started. Run PowerShell as Administrator and try again. $($_.Exception.Message)"
    }
  }

  Write-Host "Spirit Slasher server is healthy: http://127.0.0.1:$Port/api/health" -ForegroundColor Green
  Write-Host "Named Online origin: https://$Hostname" -ForegroundColor Cyan
  Write-Host "The cloudflared service carries the tunnel; no token is read or saved by this script." -ForegroundColor DarkGray
  if (-not $NoBrowser) { Start-Process "https://$Hostname" }
  Read-Host "Press Enter to stop the local game server (the tunnel service will remain installed)"
} finally {
  if ($serverProcess -and -not $serverProcess.HasExited) {
    Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue
  }
}
