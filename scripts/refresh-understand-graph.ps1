[CmdletBinding()]
param(
    [string]$PluginRoot,

    [switch]$DryRun,

    [switch]$KeepIntermediate
)

$ErrorActionPreference = 'Stop'

$implementationPath = Join-Path $PSScriptRoot 'understand/refresh-understand-graph.ps1'
& $implementationPath @PSBoundParameters
exit $LASTEXITCODE
