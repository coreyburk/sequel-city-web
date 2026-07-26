param(
    [string]$SqlHost = "localhost",
    [int]$SqlPort = 1433,
    [string]$DatabaseName = "SequelCityCrimesDB",
    [string]$SqlUser = "sequel_web_user",
    [string]$SqlPassword = "SQL-Web-PasSW0rd!",
    [switch]$PromptForDatabaseSettings,
    [switch]$ResetEnvironment
)

$ErrorActionPreference = "Stop"

$implementationPath = Join-Path $PSScriptRoot "student-package/start-student-package.ps1"
& $implementationPath @PSBoundParameters
exit $LASTEXITCODE
