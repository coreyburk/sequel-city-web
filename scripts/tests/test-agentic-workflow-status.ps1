param()

$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Path $PSScriptRoot -Parent
$repoRoot = Split-Path -Path $scriptRoot -Parent
$checkerPath = Join-Path $scriptRoot 'get-agentic-workflow-status.ps1'

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

function Assert-ContainsText {
    param(
        [Parameter(Mandatory = $true)][string]$Text,
        [Parameter(Mandatory = $true)][string]$Pattern,
        [Parameter(Mandatory = $true)][string]$Message
    )

    if ($Text -notmatch $Pattern) {
        throw $Message
    }
}

function Assert-HasProperty {
    param(
        [Parameter(Mandatory = $true)][object]$Object,
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)][string]$Message
    )

    if (-not ($Object.PSObject.Properties.Name -contains $Name)) {
        throw $Message
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

function Test-NoUnderstandTransientArtifacts {
    $understandRoot = Join-Path $repoRoot '.understand-anything'
    $tmpPath = Join-Path $understandRoot 'tmp'
    if (Test-Path -LiteralPath $tmpPath) {
        throw '.understand-anything/tmp should not exist after status bundle tests.'
    }

    $trashDirs = @(Get-ChildItem -LiteralPath $understandRoot -Force -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -like '.trash-*' })
    if ($trashDirs.Count -gt 0) {
        throw 'Understand trash directories should not exist after status bundle tests.'
    }

    $logFiles = @(Get-ChildItem -LiteralPath $understandRoot -Force -File -ErrorAction SilentlyContinue | Where-Object { $_.Name -like '*.log' })
    if ($logFiles.Count -gt 0) {
        throw 'Understand log files should not exist after status bundle tests.'
    }
}

function Invoke-StatusJson {
    param(
        [string[]]$Arguments,
        [int]$ExpectedExitCode = 0
    )

    $output = & powershell -NoProfile -ExecutionPolicy Bypass -File $checkerPath @Arguments -Json 2>&1 | Out-String
    $actualExitCode = $LASTEXITCODE
    if ($actualExitCode -ne $ExpectedExitCode) {
        throw "Expected status bundle exit code $ExpectedExitCode but got $actualExitCode. Output: $output"
    }

    return ($output | ConvertFrom-Json)
}

if (-not (Test-Path -LiteralPath $checkerPath -PathType Leaf)) {
    throw "Missing status bundle script: $checkerPath"
}

$parseErrors = $null
[System.Management.Automation.Language.Parser]::ParseFile($checkerPath, [ref]$null, [ref]$parseErrors) | Out-Null
if ($parseErrors -and $parseErrors.Count -gt 0) {
    $formattedErrors = $parseErrors | ForEach-Object { $_.Message } | Out-String
    throw "get-agentic-workflow-status.ps1 has parse errors:`n$formattedErrors"
}

$beforeHashes = Get-FileHashMap

$repoOnly = Invoke-StatusJson -Arguments @('-SkipUnderstandReadiness')
Assert-HasProperty -Object $repoOnly -Name 'generatedAt' -Message 'JSON output missing generatedAt.'
Assert-HasProperty -Object $repoOnly -Name 'repository' -Message 'JSON output missing repository.'
Assert-HasProperty -Object $repoOnly -Name 'git' -Message 'JSON output missing git.'
Assert-HasProperty -Object $repoOnly -Name 'workPackage' -Message 'JSON output missing workPackage.'
Assert-HasProperty -Object $repoOnly -Name 'components' -Message 'JSON output missing components.'
Assert-HasProperty -Object $repoOnly -Name 'overall' -Message 'JSON output missing overall.'
Assert-Equal -Actual $repoOnly.workPackage.available -Expected $false -Message 'Repository-only workPackage availability mismatch.'
Assert-Equal -Actual $repoOnly.components.workPackageStatus.status -Expected 'Skipped' -Message 'Repository-only status component should be skipped.'
Assert-Equal -Actual $repoOnly.components.validationPlan.status -Expected 'Skipped' -Message 'Repository-only validation component should be skipped.'
Assert-Equal -Actual $repoOnly.components.closeoutPreflight.status -Expected 'Skipped' -Message 'Repository-only closeout component should be skipped.'
Assert-Equal -Actual $repoOnly.components.understandReadiness.status -Expected 'Skipped' -Message 'Understand readiness should be skipped.'
Assert-Equal -Actual $repoOnly.overall.state -Expected 'Ready' -Message 'Repository-only skipped components should not block.'

$withWorkPackage = Invoke-StatusJson -Arguments @('-WorkPackage', 'WP-191', '-SkipUnderstandReadiness')
Assert-Equal -Actual $withWorkPackage.workPackage.input -Expected 'WP-191' -Message 'Work package input mismatch.'
Assert-Equal -Actual $withWorkPackage.workPackage.available -Expected $true -Message 'Work package availability mismatch.'
Assert-Equal -Actual $withWorkPackage.components.workPackageStatus.parseSucceeded -Expected $true -Message 'Work-package status JSON parse mismatch.'
Assert-Equal -Actual $withWorkPackage.components.validationPlan.parseSucceeded -Expected $true -Message 'Validation-plan JSON parse mismatch.'
Assert-Equal -Actual $withWorkPackage.components.understandReadiness.status -Expected 'Skipped' -Message 'Understand skip component mismatch.'

$textOutput = & powershell -NoProfile -ExecutionPolicy Bypass -File $checkerPath -WorkPackage WP-191 -SkipUnderstandReadiness 2>&1 | Out-String
Assert-Equal -Actual $LASTEXITCODE -Expected 0 -Message 'Text status bundle should exit 0.'
Assert-ContainsText -Text $textOutput -Pattern 'Agentic workflow status:' -Message 'Text output missing status heading.'
Assert-ContainsText -Text $textOutput -Pattern 'Components:' -Message 'Text output missing components heading.'
Assert-ContainsText -Text $textOutput -Pattern 'workPackageStatus' -Message 'Text output missing work-package status component.'

$invalidNonStrict = Invoke-StatusJson -Arguments @('-WorkPackage', 'WP-0000-does-not-exist', '-SkipUnderstandReadiness')
Assert-Equal -Actual $invalidNonStrict.overall.state -Expected 'Blocked' -Message 'Invalid work package should report blocked overall state.'
Assert-Equal -Actual $invalidNonStrict.components.workPackageStatus.status -Expected 'Blocked' -Message 'Invalid status component should be blocked.'
Assert-Equal -Actual $invalidNonStrict.components.workPackageStatus.parseSucceeded -Expected $false -Message 'Invalid status component should capture parse failure.'

$strictOutput = & powershell -NoProfile -ExecutionPolicy Bypass -File $checkerPath -WorkPackage WP-0000-does-not-exist -SkipUnderstandReadiness -Strict -Json 2>&1 | Out-String
Assert-Equal -Actual $LASTEXITCODE -Expected 2 -Message 'Strict invalid work package should exit 2.'
$strictResult = $strictOutput | ConvertFrom-Json
Assert-Equal -Actual $strictResult.overall.state -Expected 'Blocked' -Message 'Strict invalid work package JSON state mismatch.'

$afterHashes = Get-FileHashMap
foreach ($key in $beforeHashes.Keys) {
    Assert-Equal -Actual $afterHashes[$key] -Expected $beforeHashes[$key] -Message "Status bundle modified tracked graph artifact $key."
}

Test-NoUnderstandTransientArtifacts

Write-Host 'PASS agentic workflow status bundle checks'
