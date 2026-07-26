[CmdletBinding()]
param(
    [string]$PluginRoot,

    [switch]$Json
)

$ErrorActionPreference = 'Stop'

$implementationPath = Join-Path $PSScriptRoot 'understand/check-understand-refresh-readiness.ps1'
& $implementationPath @PSBoundParameters
exit $LASTEXITCODE
