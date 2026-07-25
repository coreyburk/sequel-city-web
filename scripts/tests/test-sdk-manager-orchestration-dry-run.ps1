param()

$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Path $PSScriptRoot -Parent
$repoRoot = Split-Path -Path $scriptRoot -Parent
$facadePath = Join-Path $scriptRoot 'get-sdk-manager-orchestration-dry-run.ps1'
$wpDirectory = Join-Path $repoRoot 'docs/01-work-packages'
$tempWpPaths = @()

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

function Assert-NotContainsText {
    param(
        [Parameter(Mandatory = $true)][AllowEmptyString()][string]$Text,
        [Parameter(Mandatory = $true)][string]$Pattern,
        [Parameter(Mandatory = $true)][string]$Message
    )

    if ($Text -match $Pattern) {
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

function Invoke-FacadeJson {
    param([string[]]$Arguments)

    $output = & powershell -NoProfile -ExecutionPolicy Bypass -File $facadePath @Arguments -Json 2>&1 | Out-String
    if ($LASTEXITCODE -ne 0) {
        throw "SDK manager orchestration dry-run facade should exit 0. Exit code: $LASTEXITCODE Output: $output"
    }

    return ($output | ConvertFrom-Json)
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
        throw '.understand-anything/tmp should not exist after SDK manager orchestration dry-run tests.'
    }

    $trashDirs = @(Get-ChildItem -LiteralPath $understandRoot -Force -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -like '.trash-*' })
    if ($trashDirs.Count -gt 0) {
        throw 'Understand trash directories should not exist after SDK manager orchestration dry-run tests.'
    }

    $logFiles = @(Get-ChildItem -LiteralPath $understandRoot -Force -File -ErrorAction SilentlyContinue | Where-Object { $_.Name -like '*.log' })
    if ($logFiles.Count -gt 0) {
        throw 'Understand log files should not exist after SDK manager orchestration dry-run tests.'
    }
}

function New-OrchestrationDryRunWorkPackage {
    param([Parameter(Mandatory = $true)][string]$Title)

    return @"
# $Title

## Objective

Validate SDK manager orchestration dry-run routing for a temporary work package.

## Scope

### In Scope

- Temporary SDK manager orchestration dry-run validation.

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
- User workflows: SDK manager orchestration dry-run checking.
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

- Report the correct SDK manager orchestration dry-run state.

## Acceptance Criteria

- [ ] SDK manager orchestration dry-run routing is classified correctly.

## Code Prompt

Implement the temporary fixture behavior.

## Audit Prompt

Audit the temporary fixture behavior.

## Code Results

Pending implementation.

## Audit Results

Pending audit.

## Final Decision

Pending human acceptance.
"@
}

function New-TemporaryWorkPackageFixture {
    for ($attempt = 0; $attempt -lt 100; $attempt++) {
        $number = Get-Random -Minimum 9000 -Maximum 9780
        $id = 'WP-{0}' -f $number
        $path = Join-Path $wpDirectory "$id-sdk-manager-orchestration-planned-temp.md"

        if (-not (Test-Path -LiteralPath $path)) {
            return [pscustomobject]@{
                route = 'planned'
                number = $number
                id = $id
                path = $path
                title = "$id Planned SDK Manager Orchestration Dry-Run Fixture"
            }
        }
    }

    throw 'Unable to allocate collision-free temporary SDK manager orchestration WP fixture after 100 attempts.'
}

function Assert-FacadeContract {
    param(
        [Parameter(Mandatory = $true)][object]$Result,
        [Parameter(Mandatory = $true)][string]$ExpectedAction,
        [Parameter(Mandatory = $true)][bool]$ExpectedBlocked,
        [string]$CommandPattern = ''
    )

    Assert-Equal -Actual $Result.kind -Expected 'sdk_manager_orchestration_dry_run' -Message 'Facade kind mismatch.'
    Assert-Equal -Actual $Result.dryRun -Expected $true -Message 'Facade dryRun flag mismatch.'
    Assert-Equal -Actual $Result.executed -Expected $false -Message 'Facade executed flag mismatch.'
    Assert-Equal -Actual $Result.executionForbidden -Expected $true -Message 'Facade executionForbidden flag mismatch.'
    Assert-Equal -Actual $Result.manager.mode -Expected 'dry_run' -Message 'Facade manager mode mismatch.'
    Assert-Equal -Actual $Result.manager.dependencyFree -Expected $true -Message 'Facade dependencyFree flag mismatch.'
    Assert-Equal -Actual $Result.manager.sdkExecution -Expected $false -Message 'Facade sdkExecution flag mismatch.'
    Assert-Equal -Actual $Result.manager.runtimeAi -Expected $false -Message 'Facade runtimeAi flag mismatch.'
    Assert-Equal -Actual $Result.manager.networkAllowed -Expected $false -Message 'Facade networkAllowed flag mismatch.'
    Assert-Equal -Actual $Result.allowedNextAction -Expected $ExpectedAction -Message 'Facade allowedNextAction mismatch.'
    Assert-Equal -Actual $Result.blocked -Expected $ExpectedBlocked -Message 'Facade blocked flag mismatch.'
    Assert-Equal -Actual $Result.source.delegated -Expected $true -Message 'Facade should report delegated recommendation command.'
    Assert-Equal -Actual $Result.source.commandPreviewExecuted -Expected $false -Message 'Facade must not execute command previews.'
    Assert-Equal -Actual $Result.recommendation.kind -Expected 'sdk_manager_recommendation' -Message 'Nested recommendation kind mismatch.'
    Assert-Equal -Actual $Result.recommendation.forbiddenToExecute -Expected $true -Message 'Nested recommendation forbiddenToExecute mismatch.'
    Assert-Equal -Actual $Result.recommendation.source.executed -Expected $false -Message 'Nested recommendation executed flag mismatch.'
    Assert-HasProperty -Object $Result -Name 'evidence' -Message 'Facade missing evidence.'

    $evidenceSources = @($Result.evidence | ForEach-Object { [string]$_.source }) -join "`n"
    Assert-ContainsText -Text $evidenceSources -Pattern 'scripts/get-sdk-manager-orchestration-dry-run\.ps1' -Message 'Facade evidence should cite the facade command.'
    Assert-ContainsText -Text $evidenceSources -Pattern 'scripts/get-sdk-manager-recommendation\.ps1' -Message 'Facade evidence should cite the recommendation command.'

    if ([string]::IsNullOrWhiteSpace($CommandPattern)) {
        Assert-Equal -Actual ([string]$Result.commandPreviewDisplayText) -Expected '' -Message 'Facade should not include a command preview.'
    }
    else {
        Assert-ContainsText -Text ([string]$Result.commandPreviewDisplayText) -Pattern $CommandPattern -Message 'Facade command preview display text mismatch.'
    }
}

if (-not (Test-Path -LiteralPath $facadePath -PathType Leaf)) {
    throw "Missing SDK manager orchestration dry-run facade: $facadePath"
}

$parseErrors = $null
[System.Management.Automation.Language.Parser]::ParseFile($facadePath, [ref]$null, [ref]$parseErrors) | Out-Null
if ($parseErrors -and $parseErrors.Count -gt 0) {
    $formattedErrors = $parseErrors | ForEach-Object { $_.Message } | Out-String
    throw "get-sdk-manager-orchestration-dry-run.ps1 has parse errors:`n$formattedErrors"
}

$beforeHashes = Get-FileHashMap
$plannedFixture = New-TemporaryWorkPackageFixture
$tempWpPaths = @($plannedFixture.path)

foreach ($tempWpPath in $tempWpPaths) {
    if (Test-Path -LiteralPath $tempWpPath) {
        throw "Temporary fixture path already exists and will not be overwritten: $tempWpPath"
    }
}

try {
    Set-Content -LiteralPath $plannedFixture.path -Value (New-OrchestrationDryRunWorkPackage -Title $plannedFixture.title) -Encoding UTF8

    $planned = Invoke-FacadeJson -Arguments @('-WorkPackage', $plannedFixture.id, '-SkipUnderstandReadiness')
    Assert-FacadeContract -Result $planned -ExpectedAction 'implement' -ExpectedBlocked $false -CommandPattern "run-work-package\.ps1 $($plannedFixture.id) -Execute Codex"
    Assert-Equal -Actual $planned.workPackage -Expected $plannedFixture.id -Message 'Facade planned work package mismatch.'
    Assert-Equal -Actual $planned.statusState -Expected 'ReadyForImplementation' -Message 'Facade planned status state mismatch.'
    Assert-Equal -Actual $planned.requiresHumanAuthorization -Expected $true -Message 'Facade planned human authorization mismatch.'
    Assert-Equal -Actual $planned.requiresExternalAuthorization -Expected $false -Message 'Facade planned external authorization mismatch.'

    $invalid = Invoke-FacadeJson -Arguments @('-WorkPackage', 'WP-0000-does-not-exist', '-SkipUnderstandReadiness')
    Assert-FacadeContract -Result $invalid -ExpectedAction 'resolve_blockers' -ExpectedBlocked $true
    Assert-ContainsText -Text (@($invalid.blockers) -join "`n") -Pattern 'workPackageStatus' -Message 'Facade invalid WP should propagate status blocker.'
    Assert-Equal -Actual $invalid.requiresHumanAuthorization -Expected $true -Message 'Facade invalid WP human authorization mismatch.'
    Assert-Equal -Actual $invalid.requiresExternalAuthorization -Expected $false -Message 'Facade invalid WP external authorization mismatch.'

    $textOutput = & powershell -NoProfile -ExecutionPolicy Bypass -File $facadePath -WorkPackage $plannedFixture.id -SkipUnderstandReadiness 2>&1 | Out-String
    Assert-Equal -Actual $LASTEXITCODE -Expected 0 -Message 'Text facade command should exit 0.'
    Assert-ContainsText -Text $textOutput -Pattern 'SDK manager orchestration dry run:\s*implement' -Message 'Text output missing facade recommendation.'
    Assert-ContainsText -Text $textOutput -Pattern 'Dry run:\s*True' -Message 'Text output missing dry-run marker.'
    Assert-ContainsText -Text $textOutput -Pattern 'Executed:\s*False' -Message 'Text output missing executed false.'
    Assert-ContainsText -Text $textOutput -Pattern 'Execution forbidden:\s*True' -Message 'Text output missing execution-forbidden marker.'
    Assert-ContainsText -Text $textOutput -Pattern "Command preview:\s*scripts/run-work-package\.ps1 $($plannedFixture.id) -Execute Codex" -Message 'Text output missing command preview display text.'
    Assert-NotContainsText -Text $textOutput -Pattern 'PASS agentic workflow|PASS SDK manager recommendation' -Message 'Facade text output should not execute workflow test scripts.'

    $afterHashes = Get-FileHashMap
    foreach ($key in $beforeHashes.Keys) {
        Assert-Equal -Actual $afterHashes[$key] -Expected $beforeHashes[$key] -Message "SDK manager orchestration dry-run tests modified tracked graph artifact $key."
    }

    Test-NoUnderstandTransientArtifacts
}
finally {
    foreach ($tempWpPath in $tempWpPaths) {
        if (Test-Path -LiteralPath $tempWpPath) {
            Remove-Item -LiteralPath $tempWpPath -Force
        }
    }
}

Write-Host 'PASS SDK manager orchestration dry-run facade contract checks'
