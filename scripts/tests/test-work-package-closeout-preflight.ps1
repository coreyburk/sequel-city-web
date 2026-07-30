param()

$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Path $PSScriptRoot -Parent
$projectRoot = Split-Path -Path $scriptRoot -Parent
$checkerPath = Join-Path $scriptRoot 'check-work-package-closeout.ps1'
$implementationPath = Join-Path $scriptRoot 'work-package/check-work-package-closeout.ps1'
$wpDirectory = Join-Path $projectRoot 'docs/01-work-packages'
$tempWpPath = Join-Path $wpDirectory 'WP-9993-closeout-preflight-temp.md'

function Clear-OwnedTempWorkPackageFixtures {
    Remove-Item -LiteralPath $tempWpPath -Force -ErrorAction SilentlyContinue
}

function Assert-NoOwnedTempWorkPackageFixtures {
    if (Test-Path -LiteralPath $tempWpPath) {
        throw "Closeout preflight temp WP fixture was not cleaned up: $tempWpPath"
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

function Assert-Contains {
    param(
        [Parameter(Mandatory = $true)][object[]]$Collection,
        [Parameter(Mandatory = $true)][string]$Expected,
        [Parameter(Mandatory = $true)][string]$Message
    )

    if ($Collection -notcontains $Expected) {
        throw "$Message Missing '$Expected'."
    }
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
        [string]$CodeResults = 'Implemented fixture behavior.',
        [string]$AuditResults = 'Pending audit.',
        [string]$FinalDecision = 'Pending human acceptance.',
        [string]$ValidationEvidence = @'
Validation:

- PASS: `powershell -ExecutionPolicy Bypass -File scripts/tests/test-work-package-closeout-preflight.ps1`
'@
    )

    return @"
# Temporary Closeout Preflight Test Work Package

## Objective

Validate closeout preflight classification for a temporary work package.

## Scope

### In Scope

- Temporary closeout preflight validation.

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
- Related tests:
  - `powershell -ExecutionPolicy Bypass -File scripts/tests/test-work-package-closeout-preflight.ps1`
- User workflows: closeout preflight checking.
- Security/data boundaries: no runtime changes.

### Graph Update Decision
- Regeneration required: No.
- Rationale: Fixture-only validation.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/**
- docs/00-ssot/END-OF-DAY-HANDOFF.md
- docs/05-development-workflow/**
- scripts/get-work-package-status.ps1
- scripts/get-work-package-validation-plan.ps1
- scripts/check-work-package-closeout.ps1
- scripts/work-package/**
- scripts/tests/test-agentic-workflow-decision.ps1
- scripts/tests/test-sdk-manager-orchestration-dry-run.ps1
- scripts/tests/test-sdk-manager-recommendation.ps1
- scripts/tests/test-work-package-closeout-preflight.ps1
- scripts/tests/test-work-package-status.ps1
- scripts/tests/test-work-package-validation-plan.ps1
- .codex/skills/sequel-city-wp-closeout-handoff/**

Do Not Modify:

- apps/**
- database/**

## Constraints

- No runtime changes.

## Required Behavior

- Report the correct closeout preflight state.

## Acceptance Criteria

- [ ] Preflight state is classified correctly.

## Code Prompt

Implement the temporary fixture behavior.

Verification:

- `powershell -ExecutionPolicy Bypass -File scripts/tests/test-work-package-closeout-preflight.ps1`

## Audit Prompt

Audit the temporary fixture behavior.

## Code Results

$CodeResults

$ValidationEvidence

## Audit Results

$AuditResults

## Final Decision

$FinalDecision
"@
}

function Invoke-PreflightJson {
    param(
        [Parameter(Mandatory = $true)][string]$TargetPath,
        [int]$ExpectedExitCode = 0
    )

    $before = if (Test-Path -LiteralPath $TargetPath -PathType Leaf) {
        Get-Content -LiteralPath $TargetPath -Raw
    } else {
        $null
    }

    $output = & powershell -NoProfile -ExecutionPolicy Bypass -File $checkerPath $TargetPath -Json
    $actualExitCode = $LASTEXITCODE
    if ($actualExitCode -ne $ExpectedExitCode) {
        throw "Expected preflight exit code $ExpectedExitCode but got $actualExitCode. Output: $output"
    }

    $after = if (Test-Path -LiteralPath $TargetPath -PathType Leaf) {
        Get-Content -LiteralPath $TargetPath -Raw
    } else {
        $null
    }

    if ($before -ne $after) {
        throw 'Preflight mutated the target work package fixture.'
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
    Assert-ContainsText -Text (Get-Content -LiteralPath $checkerPath -Raw) -Pattern 'work-package/check-work-package-closeout\.ps1' -Message 'Top-level closeout shim does not delegate to scripts/work-package.'
    Assert-ContainsText -Text (Get-Content -LiteralPath $checkerPath -Raw) -Pattern '@PSBoundParameters' -Message 'Top-level closeout shim does not forward bound parameters.'
    Assert-ContainsText -Text (Get-Content -LiteralPath $implementationPath -Raw) -Pattern "get-work-package-status\.ps1" -Message 'Moved closeout implementation does not invoke top-level status helper.'
    Assert-ContainsText -Text (Get-Content -LiteralPath $implementationPath -Raw) -Pattern "get-work-package-validation-plan\.ps1" -Message 'Moved closeout implementation does not invoke top-level validation-plan helper.'
    $shimParameters = @(Get-ParameterNames -Path $checkerPath)
    $implementationParameters = @(Get-ParameterNames -Path $implementationPath)
    Assert-Equal -Actual ($shimParameters -join ',') -Expected ($implementationParameters -join ',') -Message 'Closeout shim parameter names differ from implementation.'

    Set-Content -LiteralPath $tempWpPath -Value (New-TempWorkPackageContent) -Encoding UTF8
    $readyForAudit = Invoke-PreflightJson -TargetPath 'WP-9993'
    Assert-Equal -Actual $readyForAudit.state -Expected 'ReadyForAudit' -Message 'ReadyForAudit state mismatch.'
    Assert-Equal -Actual $readyForAudit.validationState -Expected 'ValidationEvidenceRecorded' -Message 'ReadyForAudit validation state mismatch.'
    $readyForAuditByImplementation = Invoke-ImplementationJson -TargetPath 'WP-9993'
    Assert-Equal -Actual $readyForAuditByImplementation.state -Expected 'ReadyForAudit' -Message 'Direct moved implementation ReadyForAudit state mismatch.'

    Set-Content -LiteralPath $tempWpPath -Value (New-TempWorkPackageContent -AuditResults 'Verdict: PASS') -Encoding UTF8
    $readyForAcceptance = Invoke-PreflightJson -TargetPath 'WP-9993'
    Assert-Equal -Actual $readyForAcceptance.state -Expected 'ReadyForAcceptance' -Message 'ReadyForAcceptance state mismatch.'
    Assert-Equal -Actual $readyForAcceptance.auditPassed -Expected $true -Message 'Audit pass detection mismatch.'

    $auditPassWithLifecycleText = @'
- **Verdict**: PASS
- **Preflight behavior gaps**: None. The wrapper emits `ReadyForAudit`, `ReadyForAcceptance`, `ReadyForFinalization`, and `Blocked`.
'@
    Set-Content -LiteralPath $tempWpPath -Value (New-TempWorkPackageContent -AuditResults $auditPassWithLifecycleText) -Encoding UTF8
    $readyForAcceptanceWithLifecycleText = Invoke-PreflightJson -TargetPath 'WP-9993'
    Assert-Equal -Actual $readyForAcceptanceWithLifecycleText.state -Expected 'ReadyForAcceptance' -Message 'PASS audit with lifecycle-state text should remain ready for acceptance.'
    Assert-Equal -Actual $readyForAcceptanceWithLifecycleText.auditPassed -Expected $true -Message 'PASS audit with lifecycle-state text pass detection mismatch.'

    $agyStyleAuditPass = @'
- **Verdict:** PASS
- **Scope violations:** None
'@
    Set-Content -LiteralPath $tempWpPath -Value (New-TempWorkPackageContent -AuditResults $agyStyleAuditPass) -Encoding UTF8
    $readyForAcceptanceWithAgyStylePass = Invoke-PreflightJson -TargetPath 'WP-9993'
    Assert-Equal -Actual $readyForAcceptanceWithAgyStylePass.state -Expected 'ReadyForAcceptance' -Message 'AGY-style bold verdict should be ready for acceptance.'
    Assert-Equal -Actual $readyForAcceptanceWithAgyStylePass.auditPassed -Expected $true -Message 'AGY-style bold verdict pass detection mismatch.'

    Set-Content -LiteralPath $tempWpPath -Value (New-TempWorkPackageContent -AuditResults $agyStyleAuditPass -FinalDecision 'Accepted.') -Encoding UTF8
    $readyForFinalizationWithAgyStylePass = Invoke-PreflightJson -TargetPath 'WP-9993'
    Assert-Equal -Actual $readyForFinalizationWithAgyStylePass.state -Expected 'ReadyForFinalization' -Message 'AGY-style bold verdict should be ready for finalization when accepted.'
    Assert-Equal -Actual $readyForFinalizationWithAgyStylePass.auditPassed -Expected $true -Message 'AGY-style bold accepted verdict pass detection mismatch.'

    Set-Content -LiteralPath $tempWpPath -Value (New-TempWorkPackageContent -AuditResults '### Verdict: PASS') -Encoding UTF8
    $readyForAcceptanceWithHeadingPass = Invoke-PreflightJson -TargetPath 'WP-9993'
    Assert-Equal -Actual $readyForAcceptanceWithHeadingPass.state -Expected 'ReadyForAcceptance' -Message 'Heading verdict should be ready for acceptance.'
    Assert-Equal -Actual $readyForAcceptanceWithHeadingPass.auditPassed -Expected $true -Message 'Heading verdict pass detection mismatch.'

    Set-Content -LiteralPath $tempWpPath -Value (New-TempWorkPackageContent -AuditResults 'Verdict: PASS' -FinalDecision 'Accepted.') -Encoding UTF8
    $readyForFinalization = Invoke-PreflightJson -TargetPath 'WP-9993'
    Assert-Equal -Actual $readyForFinalization.state -Expected 'ReadyForFinalization' -Message 'ReadyForFinalization state mismatch.'
    Assert-Equal -Actual $readyForFinalization.finalDecision -Expected 'Accepted' -Message 'ReadyForFinalization decision mismatch.'

    Set-Content -LiteralPath $tempWpPath -Value (New-TempWorkPackageContent -AuditResults 'Verdict: BLOCKED') -Encoding UTF8
    $blocked = Invoke-PreflightJson -TargetPath 'WP-9993' -ExpectedExitCode 2
    Assert-Equal -Actual $blocked.state -Expected 'Blocked' -Message 'Blocked state mismatch.'
    Assert-Contains -Collection @($blocked.findings) -Expected 'Audit results are blocked or failed.' -Message 'Blocked findings mismatch.'

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

Write-Host 'PASS work-package closeout preflight checks'
