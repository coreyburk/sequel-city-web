$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Path $PSScriptRoot -Parent
$projectRoot = Split-Path -Path $scriptRoot -Parent
$checkerPath = Join-Path $scriptRoot 'get-work-package-status.ps1'
$wpDirectory = Join-Path $projectRoot 'docs/01-work-packages'
$tempWpPath = Join-Path $wpDirectory 'WP-9996-status-temp.md'
$outOfScopePath = Join-Path $projectRoot 'docs/wp-status-temp-out-of-scope.md'

function Clear-OwnedTempWorkPackageFixtures {
    Remove-Item -LiteralPath $tempWpPath -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath $outOfScopePath -Force -ErrorAction SilentlyContinue
}

function Assert-NoOwnedTempWorkPackageFixtures {
    $remaining = @()
    if (Test-Path -LiteralPath $tempWpPath) {
        $remaining += $tempWpPath
    }
    if (Test-Path -LiteralPath $outOfScopePath) {
        $remaining += $outOfScopePath
    }
    if ($remaining.Count -gt 0) {
        throw "Status temp fixtures were not cleaned up: $($remaining -join ', ')"
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

function New-TempWorkPackageContent {
    param(
        [string]$CodeResults = 'Pending implementation.',
        [string]$AuditResults = 'Pending audit.',
        [string]$FinalDecision = 'Pending human acceptance.'
    )

    return @"
# Temporary Status Test Work Package

## Objective

Validate status classification for a temporary work package.

## Scope

### In Scope

- Temporary status checker validation.

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
- User workflows: status checking.
- Security/data boundaries: no runtime changes.

### Graph Update Decision
- Regeneration required: No.
- Rationale: Fixture-only validation.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/**
- docs/05-development-workflow/**
- docs/00-ssot/END-OF-DAY-HANDOFF.md
- scripts/**
- .codex/skills/sequel-city-wp-closeout-handoff/**

Do Not Modify:

- apps/**
- database/**

## Constraints

- No runtime changes.

## Required Behavior

- Report the correct lifecycle state.

## Acceptance Criteria

- [ ] Status is classified correctly.

## Code Prompt

Implement the temporary fixture behavior.

## Audit Prompt

Audit the temporary fixture behavior.

## Code Results

$CodeResults

## Audit Results

$AuditResults

## Final Decision

$FinalDecision
"@
}

function New-IncompleteTempWorkPackageContent {
    return @"
# Temporary Incomplete Status Test Work Package

## Scope

### In Scope

- Temporary incomplete fixture validation.

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
- User workflows: status checking.
- Security/data boundaries: no runtime changes.

### Graph Update Decision
- Regeneration required: No.
- Rationale: Fixture-only validation.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/**
- docs/05-development-workflow/**
- docs/00-ssot/END-OF-DAY-HANDOFF.md
- scripts/**
- .codex/skills/sequel-city-wp-closeout-handoff/**

Do Not Modify:

- apps/**
- database/**

## Constraints

- No runtime changes.

## Required Behavior

- Report the correct lifecycle state.

## Acceptance Criteria

- [ ] Status is classified correctly.

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

Clear-OwnedTempWorkPackageFixtures
Assert-NoOwnedTempWorkPackageFixtures

$testFailure = $null
try {
    Set-Content -LiteralPath $tempWpPath -Value (New-IncompleteTempWorkPackageContent) -Encoding UTF8
    $incomplete = Invoke-CheckerJson -TargetPath $tempWpPath
    Assert-Equal -Actual $incomplete.state -Expected 'PlanningIncomplete' -Message 'Planning incomplete state mismatch.'
    Assert-Contains -Collection @($incomplete.missingPlanningSections) -Expected 'Objective' -Message 'Planning incomplete missing-section list mismatch.'

    Set-Content -LiteralPath $tempWpPath -Value (New-TempWorkPackageContent) -Encoding UTF8
    $ready = Invoke-CheckerJson -TargetPath $tempWpPath
    Assert-Equal -Actual $ready.state -Expected 'ReadyForImplementation' -Message 'Ready state mismatch.'

    $readyByNumber = Invoke-CheckerJson -TargetPath 'WP-9996'
    Assert-Equal -Actual $readyByNumber.workPackagePath -Expected 'docs/01-work-packages/wp-9996-status-temp.md' -Message 'Number-only work package resolution path mismatch.'
    Assert-Equal -Actual $readyByNumber.state -Expected 'ReadyForImplementation' -Message 'Number-only ready state mismatch.'

    Set-Content -LiteralPath $tempWpPath -Value (New-TempWorkPackageContent -CodeResults 'Implemented fixture behavior.') -Encoding UTF8
    $implemented = Invoke-CheckerJson -TargetPath $tempWpPath
    Assert-Equal -Actual $implemented.state -Expected 'ImplementedNeedsAudit' -Message 'Implemented state mismatch.'

    Set-Content -LiteralPath $tempWpPath -Value (New-TempWorkPackageContent -CodeResults 'Implemented fixture behavior.' -AuditResults 'Verdict: PASS') -Encoding UTF8
    $audited = Invoke-CheckerJson -TargetPath $tempWpPath
    Assert-Equal -Actual $audited.state -Expected 'AuditedNeedsFinalDecision' -Message 'Audited state mismatch.'

    Set-Content -LiteralPath $tempWpPath -Value (New-TempWorkPackageContent -CodeResults 'Implemented fixture behavior.' -AuditResults 'Verdict: BLOCKED') -Encoding UTF8
    $auditBlocked = Invoke-CheckerJson -TargetPath $tempWpPath -ExpectedExitCode 2
    Assert-Equal -Actual $auditBlocked.state -Expected 'AuditBlockedNeedsResolution' -Message 'Audit blocked state mismatch.'
    Assert-Equal -Actual $auditBlocked.auditBlocked -Expected $true -Message 'Audit blocked flag mismatch.'

    Set-Content -LiteralPath $tempWpPath -Value (New-TempWorkPackageContent -CodeResults 'Implemented fixture behavior.' -AuditResults 'Verdict: PASS' -FinalDecision 'Accepted.') -Encoding UTF8
    $accepted = Invoke-CheckerJson -TargetPath $tempWpPath
    Assert-Equal -Actual $accepted.state -Expected 'AcceptedReadyForFinalization' -Message 'Accepted state mismatch.'
    Assert-Equal -Actual $accepted.finalDecision -Expected 'Accepted' -Message 'Accepted decision mismatch.'

    Set-Content -LiteralPath $tempWpPath -Value (New-TempWorkPackageContent -FinalDecision 'Rejected.') -Encoding UTF8
    $rejected = Invoke-CheckerJson -TargetPath $tempWpPath
    Assert-Equal -Actual $rejected.state -Expected 'ClosedRejected' -Message 'Rejected state mismatch.'

    Set-Content -LiteralPath $tempWpPath -Value (New-TempWorkPackageContent -FinalDecision 'Deferred.') -Encoding UTF8
    $deferred = Invoke-CheckerJson -TargetPath $tempWpPath
    Assert-Equal -Actual $deferred.state -Expected 'ClosedDeferred' -Message 'Deferred state mismatch.'

    Set-Content -LiteralPath $outOfScopePath -Value 'temporary out-of-scope dirty file' -Encoding UTF8
    $blocked = Invoke-CheckerJson -TargetPath $tempWpPath -ExpectedExitCode 2
    Assert-Equal -Actual $blocked.state -Expected 'BlockedMixedWorktree' -Message 'Blocked state mismatch.'
    Assert-Contains -Collection @($blocked.outOfScopeDirtyFiles) -Expected 'docs/wp-status-temp-out-of-scope.md' -Message 'Blocked state out-of-scope list mismatch.'

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

Write-Host 'PASS work-package status checks'
