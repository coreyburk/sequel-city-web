[CmdletBinding()]
param(
    [Parameter(Position = 0, Mandatory = $true)]
    [Alias("Name", "Task", "Id", "WorkPackage")]
    [string]$WorkPackagePath,

    [switch]$Json
)

$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Path $PSCommandPath -Parent
$implementationPath = Join-Path $scriptRoot 'work-package/check-work-package-closeout.ps1'

& $implementationPath @PSBoundParameters
exit $LASTEXITCODE
