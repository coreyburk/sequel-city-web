param(
    [string]$SqlHost = "localhost",
    [int]$SqlPort = 1433,
    [string]$DatabaseName = "SequelCityCrimesDB",
    [string]$SqlUser = "",
    [string]$SqlPassword = "",
    [switch]$PromptForDatabaseSettings,
    [switch]$ResetEnvironment,
    [int]$ApiPort = 3001,
    [int]$WebPort = 5173,
    [int]$StartupTimeoutSeconds = 90,
    [switch]$NoBrowser,
    [switch]$SetupOnly,
    [switch]$LibraryOnly
)

$ErrorActionPreference = "Stop"

$implementationPath = Join-Path $PSScriptRoot "student-package/start-student-package.ps1"
try {
    & $implementationPath @PSBoundParameters
    exit 0
} catch {
    Write-Host ("Sequel Detective could not start: " + $_.Exception.Message)
    Write-Host 'Send this message to your instructor. Existing saved progress was not reset.'
    exit 1
}
