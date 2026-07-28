[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [Alias("Name", "Task", "Id")]
    [string]$WorkPackage,

    [switch]$Json,

    [switch]$SkipUnderstandReadiness,

    [switch]$AllowTestDecisionSnapshot,

    [string]$DecisionSnapshotJson,

    [string]$DecisionSnapshotJsonBase64
)

$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Path $PSCommandPath -Parent
$implementationPath = Join-Path $scriptRoot 'sdk-manager/get-sdk-manager-recommendation.ps1'

& $implementationPath @PSBoundParameters
exit $LASTEXITCODE
