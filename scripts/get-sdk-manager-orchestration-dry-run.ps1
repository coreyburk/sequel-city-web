[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [Alias("Name", "Task", "Id")]
    [string]$WorkPackage,

    [switch]$Json,

    [switch]$SkipUnderstandReadiness
)

$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Path $PSCommandPath -Parent
$implementationPath = Join-Path $scriptRoot 'sdk-manager/get-sdk-manager-orchestration-dry-run.ps1'

& $implementationPath @PSBoundParameters
exit $LASTEXITCODE
