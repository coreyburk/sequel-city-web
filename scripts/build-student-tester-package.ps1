param(
    [string]$OutputRoot,
    [switch]$NoZip
)

$ErrorActionPreference = "Stop"

$implementationPath = Join-Path $PSScriptRoot "student-package/build-student-tester-package.ps1"
& $implementationPath @PSBoundParameters
exit $LASTEXITCODE
