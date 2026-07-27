[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [Alias("Name", "Task", "Id")]
    [string]$WorkPackage,

    [switch]$Json,

    [switch]$SkipUnderstandReadiness,

    [switch]$Strict
)

$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Path $PSCommandPath -Parent
$implementationPath = Join-Path $scriptRoot 'agentic-workflow/get-agentic-workflow-status.ps1'

& $implementationPath @PSBoundParameters
exit $LASTEXITCODE
