param()

$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Path $PSScriptRoot -Parent
$repoRoot = Split-Path -Path $scriptRoot -Parent
$preflightPath = Join-Path $repoRoot 'scripts/understand/check-understand-refresh-readiness.ps1'
$tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ('sequel-understand-readiness-test-' + [guid]::NewGuid().ToString('N'))

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
        if ($Incomplete -and $file -like '*build-fingerprints.mjs') {
            continue
        }

        Set-Content -LiteralPath $file -Value '// readiness test fixture' -Encoding UTF8
    }
}

try {
    if (-not (Test-Path -LiteralPath $preflightPath -PathType Leaf)) {
        throw "Missing preflight: $preflightPath"
    }

    $parseErrors = $null
    [System.Management.Automation.Language.Parser]::ParseFile($preflightPath, [ref]$null, [ref]$parseErrors) | Out-Null
    if ($parseErrors -and $parseErrors.Count -gt 0) {
        $formattedErrors = $parseErrors | ForEach-Object { $_.Message } | Out-String
        throw "check-understand-refresh-readiness.ps1 has parse errors:`n$formattedErrors"
    }

    New-Item -ItemType Directory -Force -Path $tempRoot | Out-Null

    $completePluginRoot = Join-Path $tempRoot 'complete-plugin'
    New-FakePluginRoot -Root $completePluginRoot

    $beforeHashes = Get-FileHashMap
    $textOutput = & powershell -NoProfile -ExecutionPolicy Bypass -File $preflightPath -PluginRoot $completePluginRoot 2>&1 | Out-String
    Assert-Equal -Actual $LASTEXITCODE -Expected 0 -Message 'Text readiness preflight failed.'
    Assert-Contains -Text $textOutput -Pattern 'Understand refresh readiness:\s*READY' -Message 'Text output did not report READY.'
    Assert-Contains -Text $textOutput -Pattern 'Dry run succeeded:\s*True' -Message 'Text output did not report dry-run success.'
    Assert-Contains -Text $textOutput -Pattern 'Tracked artifacts changed:\s*0' -Message 'Text output did not report zero changed artifacts.'

    $jsonOutput = & powershell -NoProfile -ExecutionPolicy Bypass -File $preflightPath -PluginRoot $completePluginRoot -Json 2>&1 | Out-String
    Assert-Equal -Actual $LASTEXITCODE -Expected 0 -Message 'JSON readiness preflight failed.'
    $jsonResult = $jsonOutput | ConvertFrom-Json
    Assert-Equal -Actual $jsonResult.ready -Expected $true -Message 'JSON output ready flag mismatch.'
    Assert-Equal -Actual $jsonResult.dryRun.succeeded -Expected $true -Message 'JSON output dry-run flag mismatch.'
    Assert-Equal -Actual @($jsonResult.changedArtifacts).Count -Expected 0 -Message 'JSON output changed-artifact count mismatch.'
    Assert-Equal -Actual $jsonResult.artifactHygiene.tmpExists -Expected $false -Message 'JSON output tmp hygiene mismatch.'

    $afterHashes = Get-FileHashMap
    foreach ($key in $beforeHashes.Keys) {
        Assert-Equal -Actual $afterHashes[$key] -Expected $beforeHashes[$key] -Message "Readiness preflight modified tracked graph artifact $key."
    }

    $incompletePluginRoot = Join-Path $tempRoot 'incomplete-plugin'
    New-FakePluginRoot -Root $incompletePluginRoot -Incomplete

    $previousErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        $blockedJsonOutput = & powershell -NoProfile -ExecutionPolicy Bypass -File $preflightPath -PluginRoot $incompletePluginRoot -Json 2>&1 | Out-String
        $blockedExitCode = $LASTEXITCODE
    }
    finally {
        $ErrorActionPreference = $previousErrorActionPreference
    }

    if ($blockedExitCode -eq 0) {
        throw 'Readiness preflight should fail when wrapper prerequisites are missing.'
    }
    $blockedResult = $blockedJsonOutput | ConvertFrom-Json
    Assert-Equal -Actual $blockedResult.ready -Expected $false -Message 'Blocked JSON output ready flag mismatch.'
    Assert-Equal -Actual $blockedResult.dryRun.succeeded -Expected $false -Message 'Blocked JSON output dry-run flag mismatch.'
    Assert-Contains -Text (@($blockedResult.errors) -join "`n") -Pattern 'refresh-understand-graph\.ps1 -DryRun exited with code' -Message 'Blocked JSON output did not report dry-run failure.'
    Assert-Contains -Text $blockedResult.dryRun.output -Pattern 'Understand plugin prerequisites are missing' -Message 'Blocked JSON output did not include prerequisite failure details.'
}
finally {
    Remove-Item -LiteralPath $tempRoot -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host 'PASS Understand refresh readiness preflight checks'
