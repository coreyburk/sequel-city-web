param()

$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Path $PSScriptRoot -Parent
$repoRoot = Split-Path -Path $scriptRoot -Parent
$decisionPath = Join-Path $scriptRoot 'get-agentic-workflow-decision.ps1'
$wpDirectory = Join-Path $repoRoot 'docs/01-work-packages'
$tempWpPath = Join-Path $wpDirectory 'WP-9992-agentic-decision-temp.md'

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
        throw '.understand-anything/tmp should not exist after decision-router tests.'
    }

    $trashDirs = @(Get-ChildItem -LiteralPath $understandRoot -Force -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -like '.trash-*' })
    if ($trashDirs.Count -gt 0) {
        throw 'Understand trash directories should not exist after decision-router tests.'
    }

    $logFiles = @(Get-ChildItem -LiteralPath $understandRoot -Force -File -ErrorAction SilentlyContinue | Where-Object { $_.Name -like '*.log' })
    if ($logFiles.Count -gt 0) {
        throw 'Understand log files should not exist after decision-router tests.'
    }
}

function Invoke-DecisionJson {
    param([string[]]$Arguments)

    $output = & powershell -NoProfile -ExecutionPolicy Bypass -File $decisionPath @Arguments -Json 2>&1 | Out-String
    if ($LASTEXITCODE -ne 0) {
        throw "Decision router should exit 0. Exit code: $LASTEXITCODE Output: $output"
    }

    return ($output | ConvertFrom-Json)
}

function New-DecisionRouterWorkPackage {
    param([string]$CodeResults = 'Pending implementation.')

    return @"
# Temporary Agentic Decision Router Test Work Package

## Objective

Validate planned-state decision routing for a temporary work package.

## Scope

### In Scope

- Temporary decision-router validation.

### Out of Scope

- Runtime changes.

## Impact Analysis

### Understand Status
- Graph available: Not required for temporary test fixture.
- Baseline commit: Not applicable.
- Freshness assessment: Not applicable.
- Analysis performed: Fixture-only validation.

### Affected Architecture
- Layers: development workflow scripts.
- Primary files/components: temporary test files.
- Upstream consumers: tests.
- Downstream dependencies: none.

### Regression Surface
- Related tests: this test file.
- User workflows: decision-router checking.
- Security/data boundaries: no runtime changes.

### Graph Update Decision
- Regeneration required: No.
- Rationale: Fixture-only validation.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/**
- docs/05-development-workflow/**
- scripts/**

Do Not Modify:

- apps/**
- database/**
- .understand-anything/**

## Constraints

- No runtime changes.

## Required Behavior

- Report the correct decision-router state.

## Acceptance Criteria

- [ ] Decision routing is classified correctly.

## Code Prompt

Implement the temporary fixture behavior.

## Audit Prompt

Audit the temporary fixture behavior.

## Code Results

$CodeResults

## Audit Results

Pending audit.

## Final Decision

Pending human acceptance.
"@
}

if (-not (Test-Path -LiteralPath $decisionPath -PathType Leaf)) {
    throw "Missing decision router script: $decisionPath"
}

$parseErrors = $null
[System.Management.Automation.Language.Parser]::ParseFile($decisionPath, [ref]$null, [ref]$parseErrors) | Out-Null
if ($parseErrors -and $parseErrors.Count -gt 0) {
    $formattedErrors = $parseErrors | ForEach-Object { $_.Message } | Out-String
    throw "get-agentic-workflow-decision.ps1 has parse errors:`n$formattedErrors"
}

try {
    Set-Content -LiteralPath $tempWpPath -Value (New-DecisionRouterWorkPackage) -Encoding UTF8

    $beforeHashes = Get-FileHashMap

    $repositoryOnly = Invoke-DecisionJson -Arguments @('-SkipUnderstandReadiness')
    Assert-HasProperty -Object $repositoryOnly -Name 'generatedAt' -Message 'JSON output missing generatedAt.'
    Assert-HasProperty -Object $repositoryOnly -Name 'dryRun' -Message 'JSON output missing dryRun.'
    Assert-HasProperty -Object $repositoryOnly -Name 'executed' -Message 'JSON output missing executed.'
    Assert-HasProperty -Object $repositoryOnly -Name 'workPackage' -Message 'JSON output missing workPackage.'
    Assert-HasProperty -Object $repositoryOnly -Name 'status' -Message 'JSON output missing status.'
    Assert-HasProperty -Object $repositoryOnly -Name 'recommendation' -Message 'JSON output missing recommendation.'
    Assert-HasProperty -Object $repositoryOnly -Name 'statusSnapshot' -Message 'JSON output missing statusSnapshot.'
    Assert-Equal -Actual $repositoryOnly.dryRun -Expected $true -Message 'Repository-only dryRun flag mismatch.'
    Assert-Equal -Actual $repositoryOnly.executed -Expected $false -Message 'Repository-only executed flag mismatch.'
    Assert-Equal -Actual $repositoryOnly.recommendation.action -Expected 'ProvideWorkPackage' -Message 'Repository-only recommendation mismatch.'

    $plannedWp = Invoke-DecisionJson -Arguments @('-WorkPackage', 'WP-9992', '-SkipUnderstandReadiness')
    Assert-Equal -Actual $plannedWp.executed -Expected $false -Message 'Planned WP executed flag mismatch.'
    Assert-Equal -Actual $plannedWp.workPackage.input -Expected 'WP-9992' -Message 'Planned WP input mismatch.'
    Assert-Equal -Actual $plannedWp.recommendation.action -Expected 'ImplementWorkPackage' -Message 'Planned WP recommendation mismatch.'
    Assert-ContainsText -Text $plannedWp.recommendation.commandPreview -Pattern 'run-work-package\.ps1 WP-9992 -Execute Codex' -Message 'Planned WP command preview mismatch.'
    Assert-Equal -Actual $plannedWp.statusSnapshot.components.workPackageStatus.state -Expected 'ReadyForImplementation' -Message 'Planned WP status snapshot state mismatch.'

    $textOutput = & powershell -NoProfile -ExecutionPolicy Bypass -File $decisionPath -WorkPackage WP-9992 -SkipUnderstandReadiness 2>&1 | Out-String
    Assert-Equal -Actual $LASTEXITCODE -Expected 0 -Message 'Text decision router should exit 0.'
    Assert-ContainsText -Text $textOutput -Pattern 'Agentic workflow decision:\s*ImplementWorkPackage' -Message 'Text output missing recommendation.'
    Assert-ContainsText -Text $textOutput -Pattern 'Executed:\s*False' -Message 'Text output missing executed false.'
    Assert-ContainsText -Text $textOutput -Pattern 'Command preview:' -Message 'Text output missing command preview.'

    $implementedCodeResults = @"
Implemented temporary fixture behavior.

Validation:

- PASS: temporary decision-router fixture validation
"@
    Set-Content -LiteralPath $tempWpPath -Value (New-DecisionRouterWorkPackage -CodeResults $implementedCodeResults) -Encoding UTF8
    $implementedWp = Invoke-DecisionJson -Arguments @('-WorkPackage', 'WP-9992', '-SkipUnderstandReadiness')
    Assert-Equal -Actual $implementedWp.executed -Expected $false -Message 'Implemented WP executed flag mismatch.'
    Assert-Equal -Actual $implementedWp.recommendation.action -Expected 'RequestIndependentAudit' -Message 'Implemented WP recommendation mismatch.'
    Assert-ContainsText -Text $implementedWp.recommendation.commandPreview -Pattern 'audit-work-package\.ps1 WP-9992 -AllowExternalAudit' -Message 'Implemented WP command preview mismatch.'

    $invalidWp = Invoke-DecisionJson -Arguments @('-WorkPackage', 'WP-0000-does-not-exist', '-SkipUnderstandReadiness')
    Assert-Equal -Actual $invalidWp.executed -Expected $false -Message 'Invalid WP executed flag mismatch.'
    Assert-Equal -Actual $invalidWp.recommendation.action -Expected 'ResolveBlockers' -Message 'Invalid WP recommendation mismatch.'
    Assert-ContainsText -Text (@($invalidWp.recommendation.blockers) -join "`n") -Pattern 'workPackageStatus' -Message 'Invalid WP blockers should include status component.'

    $afterHashes = Get-FileHashMap
    foreach ($key in $beforeHashes.Keys) {
        Assert-Equal -Actual $afterHashes[$key] -Expected $beforeHashes[$key] -Message "Decision router modified tracked graph artifact $key."
    }

    Test-NoUnderstandTransientArtifacts
}
finally {
    if (Test-Path -LiteralPath $tempWpPath) {
        Remove-Item -LiteralPath $tempWpPath -Force
    }
}

Write-Host 'PASS agentic workflow decision-router checks'
