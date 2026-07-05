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

$projectRoot = Split-Path -Path $PSScriptRoot -Parent
$envPath = Join-Path $projectRoot "apps/api/.env"
$webUrl = "http://127.0.0.1:5173"

function Require-Command {
    param(
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)][string]$InstallHint
    )

    if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
        throw "$Name was not found. $InstallHint"
    }
}

function Read-RequiredValue {
    param(
        [Parameter(Mandatory = $true)][string]$Prompt,
        [Parameter(Mandatory = $true)][string]$DefaultValue
    )

    $value = Read-Host "$Prompt [$DefaultValue]"
    if ([string]::IsNullOrWhiteSpace($value)) {
        return $DefaultValue
    }

    return $value.Trim()
}

function Ensure-BackendEnvironment {
    if ((Test-Path -LiteralPath $envPath) -and -not $ResetEnvironment) {
        Write-Host "Using existing apps/api/.env."
        Write-Host "To recreate it with the student package defaults, run scripts/start-student-package.ps1 -ResetEnvironment."
        return
    }

    Write-Host "Creating apps/api/.env for local student testing."

    if ($PromptForDatabaseSettings) {
        Write-Host "Use custom database values only if your instructor gave them to you."
        $resolvedHost = Read-RequiredValue -Prompt "SQL Server host" -DefaultValue $SqlHost
        $resolvedPort = Read-RequiredValue -Prompt "SQL Server port" -DefaultValue ([string]$SqlPort)
        $resolvedDatabase = Read-RequiredValue -Prompt "Database name" -DefaultValue $DatabaseName
        $resolvedUser = Read-RequiredValue -Prompt "Database user" -DefaultValue $SqlUser
    } else {
        $resolvedHost = $SqlHost
        $resolvedPort = [string]$SqlPort
        $resolvedDatabase = $DatabaseName
        $resolvedUser = $SqlUser
    }

    $resolvedPassword = $SqlPassword

    $envDirectory = Split-Path -Path $envPath -Parent
    if (-not (Test-Path -LiteralPath $envDirectory)) {
        New-Item -ItemType Directory -Path $envDirectory -Force | Out-Null
    }

    @(
        "SQLSERVER_HOST=$resolvedHost",
        "SQLSERVER_PORT=$resolvedPort",
        "SQLSERVER_DATABASE=$resolvedDatabase",
        "SQLSERVER_USER=$resolvedUser",
        "SQLSERVER_PASSWORD=$resolvedPassword",
        "SQLSERVER_TRUST_SERVER_CERTIFICATE=true",
        "SQLSERVER_BOOTSTRAP_MODE=apply"
    ) | Set-Content -LiteralPath $envPath -Encoding UTF8

    Write-Host "Created apps/api/.env with local classroom defaults."
    Write-Host "If SQL account setup fails, send the launcher message to your instructor."
}

function Ensure-Dependencies {
    $rootNodeModules = Join-Path $projectRoot "node_modules"
    $apiNodeModules = Join-Path $projectRoot "apps/api/node_modules"
    $webNodeModules = Join-Path $projectRoot "apps/web/node_modules"

    if (
        (Test-Path -LiteralPath $rootNodeModules) -and
        (Test-Path -LiteralPath $apiNodeModules) -and
        (Test-Path -LiteralPath $webNodeModules)
    ) {
        Write-Host "npm dependencies already installed."
        return
    }

    Write-Host "Installing npm dependencies. This can take a few minutes on first run."
    Push-Location $projectRoot
    try {
        npm install
    } finally {
        Pop-Location
    }
}

Require-Command -Name "node" -InstallHint "Install Node.js before running Sequel Detective."
Require-Command -Name "npm" -InstallHint "Install Node.js with npm before running Sequel Detective."

Ensure-BackendEnvironment
Ensure-Dependencies

Write-Host "Starting Sequel Detective."
Write-Host "Leave this window open while you use the app."
Write-Host "On first run, the backend will try to create or repair Sequel City SQL accounts using local Windows permissions."
Write-Host "If that fails, ask your instructor to run scripts/setup-local-sql-accounts.ps1 as a local Windows administrator."
Write-Host "Opening $webUrl after the local server starts."

$browserDelayCommand = "Start-Sleep -Seconds 8; Start-Process '$webUrl'"
Start-Process powershell -WindowStyle Hidden -ArgumentList @(
    "-NoProfile",
    "-Command",
    $browserDelayCommand
)

Push-Location $projectRoot
try {
    npm run dev
} finally {
    Pop-Location
}
