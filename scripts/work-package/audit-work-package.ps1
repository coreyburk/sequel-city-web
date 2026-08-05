[CmdletBinding()]
param(
    [Parameter(Position = 0, Mandatory = $true)]
    [Alias("Name", "Task", "Id")]
    [string]$WorkPackage,

    [ValidateSet("AntiGravity", "Gemini")]
    [string]$Agent = "AntiGravity",

    [switch]$AllowExternalAudit,

    [switch]$AllowMixedWorktree,

    [ValidateRange(1, 1440)]
    [int]$TimeoutMinutes = 10
)

$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Path $PSScriptRoot -Parent
$runnerPath = Join-Path $scriptRoot 'run-work-package.ps1'
if (-not (Test-Path -LiteralPath $runnerPath -PathType Leaf)) {
    throw "Work package runner was not found: $runnerPath"
}

if ($Agent -eq 'AntiGravity') {
    & $runnerPath `
        -Slug $WorkPackage `
        -Execute Audit `
        -AuditAgent AntiGravity `
        -AllowExternalAudit:$AllowExternalAudit `
        -AllowMixedWorktree:$AllowMixedWorktree `
        -AntiGravityTimeoutMinutes $TimeoutMinutes
}
else {
    & $runnerPath `
        -Slug $WorkPackage `
        -Execute Audit `
        -AuditAgent Gemini `
        -AllowMixedWorktree:$AllowMixedWorktree `
        -GeminiTimeoutMinutes $TimeoutMinutes
}
exit $LASTEXITCODE
