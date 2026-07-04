param(
    [string]$OutputRoot,
    [switch]$NoZip
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Path $PSScriptRoot -Parent
$packageName = "sequel-detective-student-tester"
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

if ([string]::IsNullOrWhiteSpace($OutputRoot)) {
    $OutputRoot = Join-Path ([System.IO.Path]::GetTempPath()) "SequelCityWebStudentPackages"
}

$resolvedOutputRoot = [System.IO.Path]::GetFullPath($OutputRoot)
$stagingRoot = Join-Path $resolvedOutputRoot "$packageName-$timestamp"
$zipPath = "$stagingRoot.zip"

function Assert-SourceExists {
    param([Parameter(Mandatory = $true)][string]$RelativePath)

    $sourcePath = Join-Path $projectRoot $RelativePath
    if (-not (Test-Path -LiteralPath $sourcePath)) {
        throw "Required source path is missing: $RelativePath"
    }
}

function Copy-FileToPackage {
    param([Parameter(Mandatory = $true)][string]$RelativePath)

    Assert-SourceExists $RelativePath
    $sourcePath = Join-Path $projectRoot $RelativePath
    $destinationPath = Join-Path $stagingRoot $RelativePath
    $destinationDirectory = Split-Path -Path $destinationPath -Parent

    if (-not (Test-Path -LiteralPath $destinationDirectory)) {
        New-Item -ItemType Directory -Path $destinationDirectory -Force | Out-Null
    }

    Copy-Item -LiteralPath $sourcePath -Destination $destinationPath -Force
}

function Copy-DirectoryToPackage {
    param([Parameter(Mandatory = $true)][string]$RelativePath)

    Assert-SourceExists $RelativePath
    $sourcePath = Join-Path $projectRoot $RelativePath
    $destinationPath = Join-Path $stagingRoot $RelativePath
    $destinationParent = Split-Path -Path $destinationPath -Parent

    if (-not (Test-Path -LiteralPath $destinationParent)) {
        New-Item -ItemType Directory -Path $destinationParent -Force | Out-Null
    }

    Copy-Item -LiteralPath $sourcePath -Destination $destinationPath -Recurse -Force
}

function Assert-PackageDoesNotContain {
    param(
        [Parameter(Mandatory = $true)][string]$Pattern,
        [Parameter(Mandatory = $true)][string]$FailureMessage
    )

    $matches = Get-ChildItem -LiteralPath $stagingRoot -Recurse -Force -ErrorAction SilentlyContinue |
        Where-Object { $_.FullName -like $Pattern }

    if ($matches) {
        $firstMatch = $matches | Select-Object -First 1
        throw "$FailureMessage First match: $($firstMatch.FullName)"
    }
}

if (-not (Test-Path -LiteralPath $resolvedOutputRoot)) {
    New-Item -ItemType Directory -Path $resolvedOutputRoot -Force | Out-Null
}

if (Test-Path -LiteralPath $stagingRoot) {
    $resolvedStagingRoot = [System.IO.Path]::GetFullPath($stagingRoot)
    if (-not $resolvedStagingRoot.StartsWith($resolvedOutputRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Refusing to clean a staging path outside the output root: $resolvedStagingRoot"
    }

    Remove-Item -LiteralPath $resolvedStagingRoot -Recurse -Force
}

if (Test-Path -LiteralPath $zipPath) {
    Remove-Item -LiteralPath $zipPath -Force
}

New-Item -ItemType Directory -Path $stagingRoot -Force | Out-Null

$rootFiles = @(
    "README.md",
    "RUNNING-SEQUEL-DETECTIVE.md",
    "Start-SequelDetective.cmd",
    "package.json",
    "package-lock.json",
    "scripts/build-student-tester-package.ps1",
    "scripts/start-student-package.ps1"
)

$apiFiles = @(
    "apps/api/package.json",
    "apps/api/tsconfig.json",
    "apps/api/.env.example"
)

$webFiles = @(
    "apps/web/package.json",
    "apps/web/index.html",
    "apps/web/tsconfig.json",
    "apps/web/tsconfig.node.json",
    "apps/web/vite.config.ts"
)

foreach ($relativePath in $rootFiles + $apiFiles + $webFiles) {
    Copy-FileToPackage $relativePath
}

$directories = @(
    "apps/api/src",
    "apps/web/src",
    "database",
    "docs/04-developer-setup",
    "docs/09-release-readiness"
)

foreach ($relativePath in $directories) {
    Copy-DirectoryToPackage $relativePath
}

Assert-PackageDoesNotContain -Pattern "*\.git*" -FailureMessage "Package must not contain git metadata."
Assert-PackageDoesNotContain -Pattern "*\node_modules*" -FailureMessage "Package must not contain node_modules."
Assert-PackageDoesNotContain -Pattern "*\apps\api\.env" -FailureMessage "Package must not contain apps/api/.env."
Assert-PackageDoesNotContain -Pattern "*\dist*" -FailureMessage "Package must not contain build output."
Assert-PackageDoesNotContain -Pattern "*\coverage*" -FailureMessage "Package must not contain coverage output."
Assert-PackageDoesNotContain -Pattern "*\test-results*" -FailureMessage "Package must not contain Playwright test results."
Assert-PackageDoesNotContain -Pattern "*.log" -FailureMessage "Package must not contain local log files."

$artifactPath = $stagingRoot
if (-not $NoZip) {
    $compressCommand = Get-Command Compress-Archive -ErrorAction SilentlyContinue
    if ($compressCommand) {
        Compress-Archive -LiteralPath $stagingRoot -DestinationPath $zipPath -Force
        $artifactPath = $zipPath
    } else {
        Write-Warning "Compress-Archive is unavailable. Leaving package folder unzipped."
    }
}

Write-Host "Created student tester package:"
Write-Host "  $artifactPath"
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Send the package artifact to pilot testers."
Write-Host "  2. Have testers extract it and double-click Start-SequelDetective.cmd."
Write-Host "  3. Use docs/09-release-readiness/student-install-and-run-guide.md as the student handout."
Write-Host "  4. Do not add generated package artifacts to git."
