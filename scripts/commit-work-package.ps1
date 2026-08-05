[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$WorkPackagePath,

    [Parameter(Mandatory = $true)]
    [string]$Title,

    [Parameter(Mandatory = $true)]
    [string[]]$Bullet,

    [string]$PreservationBullet,

    [string[]]$StagePath,

    [switch]$Preview,

    [switch]$Push,

    [switch]$AllowMixedWorktree,

    [string]$Remote = 'origin',

    [string]$Branch
)

$ErrorActionPreference = 'Stop'

$implementationPath = Join-Path $PSScriptRoot 'work-package/commit-work-package.ps1'
if (-not (Test-Path -LiteralPath $implementationPath -PathType Leaf)) {
    throw "Commit work package implementation was not found: $implementationPath"
}

& $implementationPath @PSBoundParameters
