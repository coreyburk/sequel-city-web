param(
    [string]$SqlHost = "localhost",
    [int]$SqlPort = 1433,
    [string]$DatabaseName = "SequelCityCrimesDB",
    [string]$RuntimeLogin = "sequel_web_user",
    [string]$RuntimePassword = "SQL-Web-PasSW0rd!",
    [string]$BootstrapLogin = "sequel_bootstrap_user",
    [string]$BootstrapPassword = "SQL-Bootstrap-PasSW0rd!"
)

$ErrorActionPreference = "Stop"

$implementationPath = Join-Path $PSScriptRoot "student-package/setup-local-sql-accounts.ps1"
& $implementationPath @PSBoundParameters
exit $LASTEXITCODE
