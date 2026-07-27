[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [Alias("Name", "Task", "Id")]
    [string]$WorkPackage,

    [switch]$Json,

    [switch]$SkipUnderstandReadiness,

    [switch]$AllowTestStatusSnapshot,

    [string]$StatusSnapshotJson,

    [string]$StatusSnapshotJsonBase64
)

$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Path $PSCommandPath -Parent
$implementationPath = Join-Path $scriptRoot 'agentic-workflow/get-agentic-workflow-decision.ps1'

& $implementationPath @PSBoundParameters
exit $LASTEXITCODE
