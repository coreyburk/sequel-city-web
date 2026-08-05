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

$implementationPath = Join-Path $PSScriptRoot 'work-package/audit-work-package.ps1'
if (-not (Test-Path -LiteralPath $implementationPath -PathType Leaf)) {
    throw "Audit work package implementation was not found: $implementationPath"
}

& $implementationPath @PSBoundParameters
exit $LASTEXITCODE
