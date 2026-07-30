param(
    [Parameter(Position = 0, Mandatory = $true)]
    [string]$WorkPackagePath,

    [switch]$Json
)

$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Path $PSCommandPath -Parent
$implementationPath = Join-Path $scriptRoot 'work-package/get-work-package-status.ps1'

& $implementationPath @PSBoundParameters
exit $LASTEXITCODE
