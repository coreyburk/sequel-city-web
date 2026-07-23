param()

$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Path $PSScriptRoot -Parent
$repoRoot = Split-Path -Path $scriptRoot -Parent
$wrapperPath = Join-Path $repoRoot 'scripts/refresh-understand-graph.ps1'
$tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ('sequel-understand-refresh-test-' + [guid]::NewGuid().ToString('N'))

function Assert-Contains {
    param(
        [Parameter(Mandatory = $true)][string]$Text,
        [Parameter(Mandatory = $true)][string]$Pattern,
        [Parameter(Mandatory = $true)][string]$Message
    )

    if ($Text -notmatch $Pattern) {
        throw $Message
    }
}

function Assert-Equal {
    param(
        [Parameter(Mandatory = $true)][object]$Actual,
        [Parameter(Mandatory = $true)][object]$Expected,
        [Parameter(Mandatory = $true)][string]$Message
    )

    if ($Actual -ne $Expected) {
        throw "$Message Expected '$Expected' but got '$Actual'."
    }
}

function Get-FileHashMap {
    $paths = @(
        '.understand-anything/knowledge-graph.json',
        '.understand-anything/fingerprints.json',
        '.understand-anything/meta.json',
        '.understand-anything/intermediate/scan-result.json'
    )

    $hashes = @{}
    foreach ($relativePath in $paths) {
        $absolutePath = Join-Path $repoRoot $relativePath
        $hashes[$relativePath] = (Get-FileHash -LiteralPath $absolutePath -Algorithm SHA256).Hash
    }

    return $hashes
}

function New-FakePluginRoot {
    param(
        [Parameter(Mandatory = $true)][string]$Root,
        [switch]$Incomplete
    )

    $skillRoot = Join-Path $Root 'skills/understand'
    $coreRoot = Join-Path $Root 'packages/core/dist'
    New-Item -ItemType Directory -Force -Path $skillRoot | Out-Null
    New-Item -ItemType Directory -Force -Path $coreRoot | Out-Null

    $requiredFiles = @(
        (Join-Path $skillRoot 'scan-project.mjs'),
        (Join-Path $skillRoot 'extract-import-map.mjs'),
        (Join-Path $skillRoot 'extract-structure.mjs'),
        (Join-Path $skillRoot 'build-fingerprints.mjs'),
        (Join-Path $coreRoot 'index.js')
    )

    foreach ($file in $requiredFiles) {
        if ($Incomplete -and $file -like '*extract-structure.mjs') {
            continue
        }

        Set-Content -LiteralPath $file -Value '// test fixture' -Encoding UTF8
    }
}

try {
    if (-not (Test-Path -LiteralPath $wrapperPath -PathType Leaf)) {
        throw "Missing wrapper: $wrapperPath"
    }

    $parseErrors = $null
    [System.Management.Automation.Language.Parser]::ParseFile($wrapperPath, [ref]$null, [ref]$parseErrors) | Out-Null
    if ($parseErrors -and $parseErrors.Count -gt 0) {
        $formattedErrors = $parseErrors | ForEach-Object { $_.Message } | Out-String
        throw "refresh-understand-graph.ps1 has parse errors:`n$formattedErrors"
    }

    New-Item -ItemType Directory -Force -Path $tempRoot | Out-Null

    $completePluginRoot = Join-Path $tempRoot 'complete-plugin'
    New-FakePluginRoot -Root $completePluginRoot

    $beforeHashes = Get-FileHashMap
    $dryRunOutput = & powershell -NoProfile -ExecutionPolicy Bypass -File $wrapperPath -PluginRoot $completePluginRoot -DryRun 2>&1 | Out-String
    Assert-Equal -Actual $LASTEXITCODE -Expected 0 -Message 'Dry-run wrapper invocation failed.'
    Assert-Contains -Text $dryRunOutput -Pattern 'Dry run:\s*no files modified' -Message 'Dry run output did not state that no files were modified.'
    Assert-Contains -Text $dryRunOutput -Pattern ([regex]::Escape($completePluginRoot)) -Message 'Dry run output did not include the explicit plugin-root override.'
    Assert-Contains -Text $dryRunOutput -Pattern 'scan-project\.mjs' -Message 'Dry run output did not list required Understand scripts.'

    $afterHashes = Get-FileHashMap
    foreach ($key in $beforeHashes.Keys) {
        Assert-Equal -Actual $afterHashes[$key] -Expected $beforeHashes[$key] -Message "Dry run modified tracked graph artifact $key."
    }

    $incompletePluginRoot = Join-Path $tempRoot 'incomplete-plugin'
    New-FakePluginRoot -Root $incompletePluginRoot -Incomplete
    $previousErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        $missingOutput = & powershell -NoProfile -ExecutionPolicy Bypass -File $wrapperPath -PluginRoot $incompletePluginRoot -DryRun 2>&1 | Out-String
        $missingExitCode = $LASTEXITCODE
    }
    finally {
        $ErrorActionPreference = $previousErrorActionPreference
    }
    if ($missingExitCode -eq 0) {
        throw 'Wrapper should fail when required plugin scripts are missing.'
    }
    Assert-Contains -Text $missingOutput -Pattern 'Understand plugin prerequisites are missing' -Message 'Missing-prerequisite failure did not explain the blocker.'
    Assert-Contains -Text $missingOutput -Pattern 'extract-structure\.mjs' -Message 'Missing-prerequisite failure did not identify the missing script.'
}
finally {
    Remove-Item -LiteralPath $tempRoot -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host 'PASS Understand graph refresh wrapper checks'
