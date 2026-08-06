$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Path $PSScriptRoot -Parent
$projectRoot = Split-Path -Path $scriptRoot -Parent
$checkerPath = Join-Path $scriptRoot 'get-work-package-validation-plan.ps1'
$implementationPath = Join-Path $scriptRoot 'work-package/get-work-package-validation-plan.ps1'
$wpDirectory = Join-Path $projectRoot 'docs/01-work-packages'
$tempWpPath = Join-Path $wpDirectory 'WP-9995-validation-plan-temp.md'

function Clear-OwnedTempWorkPackageFixtures {
    Remove-Item -LiteralPath $tempWpPath -Force -ErrorAction SilentlyContinue
}

function Assert-NoOwnedTempWorkPackageFixtures {
    if (Test-Path -LiteralPath $tempWpPath) {
        throw "Validation-plan temp WP fixture was not cleaned up: $tempWpPath"
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

function Assert-ContainsText {
    param(
        [Parameter(Mandatory = $true)][string]$Text,
        [Parameter(Mandatory = $true)][string]$Pattern,
        [Parameter(Mandatory = $true)][string]$Message
    )

    if ($Text -notmatch $Pattern) {
        throw "$Message Missing pattern '$Pattern'."
    }
}

function Assert-ScriptParses {
    param([Parameter(Mandatory = $true)][string]$Path)

    $parseErrors = $null
    [System.Management.Automation.Language.Parser]::ParseFile($Path, [ref]$null, [ref]$parseErrors) | Out-Null
    if ($parseErrors -and $parseErrors.Count -gt 0) {
        $formattedErrors = $parseErrors | ForEach-Object { $_.Message } | Out-String
        throw "Script has parse errors at $Path`n$formattedErrors"
    }
}

function Get-ParameterNames {
    param([Parameter(Mandatory = $true)][string]$Path)

    $tokens = $null
    $parseErrors = $null
    $ast = [System.Management.Automation.Language.Parser]::ParseFile($Path, [ref]$tokens, [ref]$parseErrors)
    if ($parseErrors -and $parseErrors.Count -gt 0) {
        throw "Cannot inspect parameters for unparsable script: $Path"
    }

    return @($ast.ParamBlock.Parameters | ForEach-Object { $_.Name.VariablePath.UserPath })
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

function Invoke-ImplementationJson {
    param(
        [Parameter(Mandatory = $true)][string]$TargetPath,
        [int]$ExpectedExitCode = 0
    )

    $output = & powershell -NoProfile -ExecutionPolicy Bypass -File $implementationPath $TargetPath -Json
    $actualExitCode = $LASTEXITCODE
    if ($actualExitCode -ne $ExpectedExitCode) {
        throw "Expected implementation exit code $ExpectedExitCode but got $actualExitCode. Output: $output"
    }

    return ($output | ConvertFrom-Json)
}

Clear-OwnedTempWorkPackageFixtures
Assert-NoOwnedTempWorkPackageFixtures

$testFailure = $null
try {
    Assert-ScriptParses -Path $checkerPath
    Assert-ScriptParses -Path $implementationPath
    Assert-ContainsText -Text (Get-Content -LiteralPath $checkerPath -Raw) -Pattern 'work-package/get-work-package-validation-plan\.ps1' -Message 'Top-level validation-plan shim does not delegate to scripts/work-package.'
    Assert-ContainsText -Text (Get-Content -LiteralPath $checkerPath -Raw) -Pattern '@PSBoundParameters' -Message 'Top-level validation-plan shim does not forward bound parameters.'
    $shimParameters = @(Get-ParameterNames -Path $checkerPath)
    $implementationParameters = @(Get-ParameterNames -Path $implementationPath)
    Assert-Equal -Actual ($shimParameters -join ',') -Expected ($implementationParameters -join ',') -Message 'Validation-plan shim parameter names differ from implementation.'

    Set-Content -LiteralPath $tempWpPath -Value (New-TempWorkPackageContent) -Encoding UTF8
    $missing = Invoke-CheckerJson -TargetPath $tempWpPath -ExpectedExitCode 2
    Assert-Equal -Actual $missing.state -Expected 'ValidationPlanMissing' -Message 'Missing validation-plan state mismatch.'
    Assert-AnyMatch -Collection @($missing.missingFindings) -Pattern 'No verification commands' -Message 'Missing validation-plan findings mismatch.'
    Assert-Equal -Actual $missing.recommendation.kind -Expected 'validation_plan_recommendation' -Message 'Missing validation recommendation kind mismatch.'
    Assert-Equal -Actual $missing.recommendation.action -Expected 'add_validation_plan' -Message 'Missing validation recommendation action mismatch.'
    Assert-Equal -Actual $missing.recommendation.blocksAuditReadiness -Expected $true -Message 'Missing validation should block audit readiness.'
    Assert-AnyMatch -Collection @($missing.recommendation.missingFindings) -Pattern 'No verification commands' -Message 'Missing validation recommendation findings mismatch.'

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
    Assert-Equal -Actual $ready.recommendation.action -Expected 'run_planned_validation' -Message 'Ready validation recommendation action mismatch.'
    Assert-Equal -Actual $ready.recommendation.blocksAuditReadiness -Expected $false -Message 'Ready validation should not block audit readiness.'
    Assert-AnyMatch -Collection @($ready.recommendation.commandsToRun) -Pattern 'test-work-package-validation-plan' -Message 'Ready validation recommendation command mismatch.'

    $readyByNumber = Invoke-CheckerJson -TargetPath 'WP-9995'
    Assert-Equal -Actual $readyByNumber.workPackagePath -Expected 'docs/01-work-packages/wp-9995-validation-plan-temp.md' -Message 'Number-only work package resolution path mismatch.'
    Assert-Equal -Actual $readyByNumber.state -Expected 'ValidationPlanReady' -Message 'Number-only validation-plan state mismatch.'
    $readyByImplementation = Invoke-ImplementationJson -TargetPath 'WP-9995'
    Assert-Equal -Actual $readyByImplementation.state -Expected 'ValidationPlanReady' -Message 'Direct moved implementation validation-plan state mismatch.'

    $noTests = @'
- Related tests:
  - None. Documentation-only package with no automated validation beyond review.
'@
    Set-Content -LiteralPath $tempWpPath -Value (New-TempWorkPackageContent -RelatedTests $noTests) -Encoding UTF8
    $explained = Invoke-CheckerJson -TargetPath $tempWpPath
    Assert-Equal -Actual $explained.state -Expected 'NoAutomatedValidationExplained' -Message 'No automated validation explanation state mismatch.'
    Assert-Equal -Actual $explained.noAutomatedValidationExplained -Expected $true -Message 'No automated validation flag mismatch.'
    Assert-Equal -Actual $explained.recommendation.action -Expected 'review_no_automation_explanation' -Message 'No-automation validation recommendation action mismatch.'
    Assert-Equal -Actual $explained.recommendation.reviewRequired -Expected $true -Message 'No-automation validation should require review.'
    Assert-Equal -Actual $explained.recommendation.noAutomatedValidationExplained -Expected $true -Message 'No-automation recommendation flag mismatch.'

    $evidence = @'
Validation:

- PASS: `powershell -ExecutionPolicy Bypass -File scripts/tests/test-work-package-validation-plan.ps1`
- PASS: `git diff --check`
'@
    Set-Content -LiteralPath $tempWpPath -Value (New-TempWorkPackageContent -RelatedTests $relatedTests -Verification $verification -CodeResults $evidence) -Encoding UTF8
    $recorded = Invoke-CheckerJson -TargetPath $tempWpPath
    Assert-Equal -Actual $recorded.state -Expected 'ValidationEvidenceRecorded' -Message 'Validation evidence state mismatch.'
    Assert-AnyMatch -Collection @($recorded.validationEvidence) -Pattern 'PASS' -Message 'Validation evidence extraction mismatch.'
    Assert-Equal -Actual $recorded.recommendation.action -Expected 'review_recorded_evidence' -Message 'Recorded validation recommendation action mismatch.'
    Assert-Equal -Actual $recorded.recommendation.requiresAction -Expected $false -Message 'Recorded validation should not require action.'
    Assert-AnyMatch -Collection @($recorded.recommendation.evidenceToReview) -Pattern 'PASS' -Message 'Recorded validation recommendation evidence mismatch.'

    $proseEvidence = @'
Validation performed:

- `powershell -ExecutionPolicy Bypass -File scripts/tests/test-work-package-validation-plan.ps1` passed.
- `git diff --check` reported no whitespace errors.
'@
    Set-Content -LiteralPath $tempWpPath -Value (New-TempWorkPackageContent -RelatedTests $relatedTests -Verification $verification -CodeResults $proseEvidence) -Encoding UTF8
    $recordedProse = Invoke-CheckerJson -TargetPath $tempWpPath
    Assert-Equal -Actual $recordedProse.state -Expected 'ValidationEvidenceRecorded' -Message 'Validation prose evidence state mismatch.'
    Assert-AnyMatch -Collection @($recordedProse.validationEvidence) -Pattern 'Validation performed' -Message 'Validation prose heading extraction mismatch.'
    Assert-AnyMatch -Collection @($recordedProse.validationEvidence) -Pattern 'passed' -Message 'Validation prose command-result extraction mismatch.'
    Assert-Equal -Actual $recordedProse.recommendation.action -Expected 'review_recorded_evidence' -Message 'Validation prose recommendation action mismatch.'

    $target = Invoke-CheckerJson -TargetPath 'docs/01-work-packages/WP-177-work-package-validation-plan-checker.md'
    Assert-Equal -Actual $target.state -Expected 'ValidationEvidenceRecorded' -Message 'Target WP validation-plan state mismatch.'

}
catch {
    $testFailure = $_
}
finally {
    Clear-OwnedTempWorkPackageFixtures
}

Assert-NoOwnedTempWorkPackageFixtures

if ($null -ne $testFailure) {
    throw $testFailure
}

Write-Host 'PASS work-package validation-plan checks'
