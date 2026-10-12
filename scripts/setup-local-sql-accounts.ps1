param(
    [string]$SqlHost = "localhost",
    [int]$SqlPort = 1433,
    [string]$DatabaseName = "SequelCityCrimesDB",
    [string]$RuntimeLogin = "sequel_web_user",
    [string]$RuntimePassword = $env:SQLSERVER_PASSWORD,
    [string]$BootstrapLogin = "sequel_bootstrap_user",
    [string]$BootstrapPassword = $env:SQLSERVER_BOOTSTRAP_PASSWORD,
    [string]$RepositoryLogin = "sequel_case_repository",
    [string]$RepositoryPassword = $env:SQLSERVER_APP_PASSWORD,
    [switch]$SkipBootstrapAccount
)

$ErrorActionPreference = "Stop"

$implementationPath = Join-Path $PSScriptRoot "student-package/setup-local-sql-accounts.ps1"
& $implementationPath @PSBoundParameters
exit $LASTEXITCODE
