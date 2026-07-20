$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Path $PSScriptRoot -Parent
$projectRoot = Split-Path -Path $scriptRoot -Parent
$checkerPath = Join-Path $scriptRoot 'get-work-package-validation-plan.ps1'
$wpDirectory = Join-Path $projectRoot 'docs/01-work-packages'
$tempWpPath = Join-Path $wpDirectory 'WP-9995-validation-plan-temp.md'

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

function Assert-AnyMatch {
    param(
        [Parameter(Mandatory = $true)][object[]]$Collection,
        [Parameter(Mandatory = $true)][string]$Pattern,
        [Parameter(Mandatory = $true)][string]$Message
    )

    foreach ($entry in $Collection) {
        if ([string]$entry -match $Pattern) {
            return
        }
    }

    throw "$Message Missing pattern '$Pattern'."
}

function New-TempWorkPackageContent {
    param(
        [string]$RelatedTests = '- Related tests:',
        [string]$Verification = '',
        [string]$CodeResults = 'Pending implementation.'
    )

    return @"
# Temporary Validation Plan Test Work Package

## Objective

Validate validation-plan classification for a temporary work package.

## Scope

### In Scope

- Temporary validation checker validation.

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
$RelatedTests
- User workflows: validation checking.
- Security/data boundaries: no runtime changes.

### Graph Update Decision
- Regeneration required: No.
- Rationale: Fixture-only validation.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/**
- scripts/**

Do Not Modify:

- apps/**
- database/**

## Constraints

- No runtime changes.

## Required Behavior

- Report the correct validation-plan state.

## Acceptance Criteria

- [ ] Validation state is classified correctly.

## Code Prompt

Implement the temporary fixture behavior.

$Verification

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

function Invoke-CheckerJson {
    param(
        [Parameter(Mandatory = $true)][string]$TargetPath,
        [int]$ExpectedExitCode = 0
    )

    $output = & powershell -NoProfile -ExecutionPolicy Bypass -File $checkerPath $TargetPath -Json
    $actualExitCode = $LASTEXITCODE
    if ($actualExitCode -ne $ExpectedExitCode) {
        throw "Expected checker exit code $ExpectedExitCode but got $actualExitCode. Output: $output"
    }

    return ($output | ConvertFrom-Json)
}

try {
    Set-Content -LiteralPath $tempWpPath -Value (New-TempWorkPackageContent) -Encoding UTF8
    $missing = Invoke-CheckerJson -TargetPath $tempWpPath -ExpectedExitCode 2
    Assert-Equal -Actual $missing.state -Expected 'ValidationPlanMissing' -Message 'Missing validation-plan state mismatch.'
    Assert-AnyMatch -Collection @($missing.missingFindings) -Pattern 'No verification commands' -Message 'Missing validation-plan findings mismatch.'

    $relatedTests = @'
- Related tests:
  - `powershell -ExecutionPolicy Bypass -File scripts/tests/test-work-package-validation-plan.ps1`
'@
    $verification = @'
Verification:

- `powershell -ExecutionPolicy Bypass -File scripts/tests/test-work-package-validation-plan.ps1`
- `git diff --check`
'@
    Set-Content -LiteralPath $tempWpPath -Value (New-TempWorkPackageContent -RelatedTests $relatedTests -Verification $verification) -Encoding UTF8
    $ready = Invoke-CheckerJson -TargetPath $tempWpPath
    Assert-Equal -Actual $ready.state -Expected 'ValidationPlanReady' -Message 'Validation-plan ready state mismatch.'
    Assert-AnyMatch -Collection @($ready.plannedVerificationCommands) -Pattern 'test-work-package-validation-plan' -Message 'Validation command extraction mismatch.'

    $noTests = @'
- Related tests:
  - None. Documentation-only package with no automated validation beyond review.
'@
    Set-Content -LiteralPath $tempWpPath -Value (New-TempWorkPackageContent -RelatedTests $noTests) -Encoding UTF8
    $explained = Invoke-CheckerJson -TargetPath $tempWpPath
    Assert-Equal -Actual $explained.state -Expected 'NoAutomatedValidationExplained' -Message 'No automated validation explanation state mismatch.'
    Assert-Equal -Actual $explained.noAutomatedValidationExplained -Expected $true -Message 'No automated validation flag mismatch.'

    $evidence = @'
Validation:

- PASS: `powershell -ExecutionPolicy Bypass -File scripts/tests/test-work-package-validation-plan.ps1`
- PASS: `git diff --check`
'@
    Set-Content -LiteralPath $tempWpPath -Value (New-TempWorkPackageContent -RelatedTests $relatedTests -Verification $verification -CodeResults $evidence) -Encoding UTF8
    $recorded = Invoke-CheckerJson -TargetPath $tempWpPath
    Assert-Equal -Actual $recorded.state -Expected 'ValidationEvidenceRecorded' -Message 'Validation evidence state mismatch.'
    Assert-AnyMatch -Collection @($recorded.validationEvidence) -Pattern 'PASS' -Message 'Validation evidence extraction mismatch.'

    $target = Invoke-CheckerJson -TargetPath 'docs/01-work-packages/WP-177-work-package-validation-plan-checker.md'
    Assert-Equal -Actual $target.state -Expected 'ValidationEvidenceRecorded' -Message 'Target WP validation-plan state mismatch.'

    Write-Host 'PASS work-package validation-plan checks'
}
finally {
    if (Test-Path -LiteralPath $tempWpPath) {
        Remove-Item -LiteralPath $tempWpPath -Force
    }
}
