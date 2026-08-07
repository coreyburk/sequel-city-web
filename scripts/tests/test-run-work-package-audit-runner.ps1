param()

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Path (Split-Path -Path $PSScriptRoot -Parent) -Parent
$runnerPath = Join-Path $repoRoot 'scripts/run-work-package.ps1'
$runnerImplementationPath = Join-Path $repoRoot 'scripts/work-package/run-work-package.ps1'
$statusPath = Join-Path $repoRoot 'scripts/get-work-package-status.ps1'
$closeoutPath = Join-Path $repoRoot 'scripts/check-work-package-closeout.ps1'
$runner = Get-Content -LiteralPath $runnerPath -Raw
$runnerImplementation = Get-Content -LiteralPath $runnerImplementationPath -Raw
$workPackageDirectory = Join-Path $repoRoot 'docs/01-work-packages'

function Assert-Contains {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Text,

        [Parameter(Mandatory = $true)]
        [string]$Pattern,

        [Parameter(Mandatory = $true)]
        [string]$Message
    )

    if ($Text -notmatch $Pattern) {
        throw $Message
    }
}

function Assert-NotContains {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Text,

        [Parameter(Mandatory = $true)]
        [string]$Pattern,

        [Parameter(Mandatory = $true)]
        [string]$Message
    )

    if ($Text -match $Pattern) {
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

$parseErrors = $null
[System.Management.Automation.Language.Parser]::ParseFile($runnerPath, [ref]$null, [ref]$parseErrors) | Out-Null
if ($parseErrors -and $parseErrors.Count -gt 0) {
    $formattedErrors = $parseErrors | ForEach-Object { $_.Message } | Out-String
    throw "run-work-package.ps1 has parse errors:`n$formattedErrors"
}

[System.Management.Automation.Language.Parser]::ParseFile($runnerImplementationPath, [ref]$null, [ref]$parseErrors) | Out-Null
if ($parseErrors -and $parseErrors.Count -gt 0) {
    $formattedErrors = $parseErrors | ForEach-Object { $_.Message } | Out-String
    throw "work-package/run-work-package.ps1 has parse errors:`n$formattedErrors"
}

Assert-Contains `
    -Text $runner `
    -Pattern 'work-package/run-work-package\.ps1' `
    -Message 'Top-level runner shim does not delegate to scripts/work-package.'

Assert-Contains `
    -Text $runner `
    -Pattern '@PSBoundParameters' `
    -Message 'Top-level runner shim does not forward PSBoundParameters.'

$shimParameters = @(Get-ParameterNames -Path $runnerPath)
$implementationParameters = @(Get-ParameterNames -Path $runnerImplementationPath)
Assert-Equal -Actual ($shimParameters -join ',') -Expected ($implementationParameters -join ',') -Message 'Runner shim parameter names differ from implementation.'

Assert-Contains `
    -Text $runnerImplementation `
    -Pattern '\[ValidateSet\("Gemini", "AntiGravity"\)\]\s*\[string\]\$AuditAgent = "Gemini"' `
    -Message 'AuditAgent must default to Gemini and support AntiGravity.'

Assert-Contains `
    -Text $runnerImplementation `
    -Pattern '\[switch\]\$AllowExternalAudit' `
    -Message 'AllowExternalAudit switch is required for AGY data-sharing authorization.'

Assert-Contains `
    -Text $runnerImplementation `
    -Pattern 'if \(-not \$AllowExternalAudit\)' `
    -Message 'AntiGravity execution must be blocked when external audit sharing is not authorized.'

Assert-Contains `
    -Text $runnerImplementation `
    -Pattern "The runner did not send work-package prompt or repository context to AGY\." `
    -Message 'Blocked AGY audit result must state that repository context was not sent.'

Assert-Contains `
    -Text $runnerImplementation `
    -Pattern "return `"agy`"" `
    -Message 'AntiGravity runner must resolve the agy CLI by default.'

Assert-Contains `
    -Text $runnerImplementation `
    -Pattern '--print' `
    -Message 'AntiGravity runner must use agy print mode.'

Assert-Contains `
    -Text $runnerImplementation `
    -Pattern 'Mode: execute audit \(agent: \$AuditAgent\)' `
    -Message 'Generic audit mode must route through the selected audit agent.'

$tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ('sequel-runner-audit-test-' + [guid]::NewGuid().ToString('N'))
$tempWpName = 'WP-9999-runner-audit-temp.md'
$tempWpPath = Join-Path $workPackageDirectory $tempWpName
$originalAgyCli = $env:LITE_WP_AGY_CLI

try {
    New-Item -ItemType Directory -Force -Path $tempRoot | Out-Null

    $tempWp = @'
# Runner Audit Temp

## Objective

Temporary runner validation.

## Scope

### In Scope

- Temporary runner validation.

### Out of Scope

- Runtime changes.

## Impact Analysis

### Understand Status
- Graph available: Not required for temporary fixture.
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
  - `powershell -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-audit-runner.ps1`
- User workflows: audit runner validation.
- Security/data boundaries: no runtime changes.

### Graph Update Decision
- Regeneration required: No.
- Rationale: Fixture-only validation.

## Files Allowed to Change

Allowed:

- scripts/run-work-package.ps1
- scripts/audit-work-package.ps1
- scripts/work-package/audit-work-package.ps1
- scripts/commit-work-package.ps1
- scripts/tests/**
- docs/01-work-packages/WP-175-isolated-work-package-audit-finalization-workflow.md
- docs/01-work-packages/WP-177-work-package-validation-plan-checker.md
- docs/01-work-packages/WP-179-unified-work-package-identifier-resolution.md
- docs/01-work-packages/WP-180-audit-work-package-command-wrapper.md
- docs/01-work-packages/WP-218-audit-work-package-script-directory-compatibility-shim.md
- docs/01-work-packages/WP-222-run-work-package-script-directory-compatibility-shim.md
- docs/01-work-packages/WP-235-correct-audit-result-heading-normalization.md
- docs/01-work-packages/WP-9999-runner-audit-temp.md
- docs/05-development-workflow/**
- docs/00-ssot/SSOT-Development-Workflow.md
- docs/00-ssot/END-OF-DAY-HANDOFF.md
- scripts/work-package/run-work-package.ps1
- scripts/get-work-package-validation-plan.ps1
- scripts/get-work-package-status.ps1
- scripts/lib/**
- .codex/skills/sequel-city-audit-runner-contracts/**
- .codex/skills/sequel-city-wp-closeout-handoff/**
- .understand-anything/**

Do Not Modify:

- apps/**

## Code Prompt

No-op.

Verification:

- `powershell -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-audit-runner.ps1`

## Audit Prompt

Audit the temporary runner validation.

## Constraints

- No runtime changes.

## Required Behavior

- Report the correct lifecycle state after parser-safe audit insertion.

## Acceptance Criteria

- [ ] Status is classified correctly after mock audit insertion.
- [ ] Closeout is classified correctly after mock audit insertion.

## Code Results

Implemented temporary runner validation.

Validation:

- PASS: `powershell -ExecutionPolicy Bypass -File scripts/tests/test-run-work-package-audit-runner.ps1`

## Audit Results

Pending.

## Final Decision

Pending.
'@
    Set-Content -LiteralPath $tempWpPath -Value $tempWp -Encoding UTF8

    $numberOnlyOutput = & powershell -ExecutionPolicy Bypass -File $runnerPath 'WP-9999' -Execute None | Out-String
    if ($LASTEXITCODE -ne 0) {
        throw 'Runner failed to resolve a work package by WP number.'
    }
    $escapedTempWpPath = [regex]::Escape($tempWpPath)
    Assert-Contains `
        -Text $numberOnlyOutput `
        -Pattern $escapedTempWpPath `
        -Message 'Runner did not resolve WP-9999 to the matching temporary work package.'

    $directNumberOnlyOutput = & powershell -ExecutionPolicy Bypass -File $runnerImplementationPath 'WP-9999' -Execute None | Out-String
    if ($LASTEXITCODE -ne 0) {
        throw 'Moved runner failed to resolve a work package by WP number.'
    }
    Assert-Contains `
        -Text $directNumberOnlyOutput `
        -Pattern $escapedTempWpPath `
        -Message 'Moved runner did not resolve WP-9999 to the matching temporary work package.'

    $mockAgySuccess = Join-Path $tempRoot 'mock-agy-success.ps1'
    Set-Content -LiteralPath $mockAgySuccess -Encoding UTF8 -Value @'
param(
    [string]$Print,
    [string]$Prompt,
    [string]$PrintTimeout,
    [string]$TimeoutValue
)

Write-Output "## Verdict: PASS"
Write-Output ""
Write-Output "## Audit Verification Summary"
Write-Output "Scope violations: None"
Write-Output ""
Write-Output "## Regressions"
Write-Output "None"
exit 0
'@

    $env:LITE_WP_AGY_CLI = $mockAgySuccess
    & powershell -ExecutionPolicy Bypass -File $runnerPath $tempWpName -Execute AntiGravity -AllowExternalAudit -AntiGravityTimeoutMinutes 1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw 'Mock AGY success invocation failed.'
    }

    $updatedWp = Get-Content -LiteralPath $tempWpPath -Raw
    Assert-Contains `
        -Text $updatedWp `
        -Pattern 'Verdict:\s*PASS' `
        -Message 'Mock AGY success output was not written to Audit Results.'
    Assert-NotContains `
        -Text $updatedWp `
        -Pattern '(?m)^## Verdict:\s*PASS' `
        -Message 'Mock AGY verdict heading was written as a top-level work-package heading.'
    Assert-Contains `
        -Text $updatedWp `
        -Pattern '(?m)^### Audit Verification Summary\s*$' `
        -Message 'Mock AGY audit subheading was not demoted under Audit Results.'
    Assert-Contains `
        -Text $updatedWp `
        -Pattern '(?ms)^## Audit Results\s+Verdict:\s*PASS.*^### Audit Verification Summary\s+Scope violations:\s*None.*^### Regressions\s+None\s+^## Final Decision' `
        -Message 'Mock AGY output did not remain inside the Audit Results section.'
    Assert-NotContains `
        -Text $updatedWp `
        -Pattern '(?ms)^## Audit Results.*^## (Verdict|Audit Verification Summary|Regressions)\b.*^## Final Decision' `
        -Message 'Mock AGY output introduced sibling top-level audit headings.'

    $statusOutput = & powershell -ExecutionPolicy Bypass -File $statusPath $tempWpName | Out-String
    if ($LASTEXITCODE -ne 0) {
        throw 'Status helper failed after parser-safe mock AGY audit insertion.'
    }
    Assert-Contains `
        -Text $statusOutput `
        -Pattern 'State:\s*AuditedNeedsFinalDecision' `
        -Message 'Status helper did not detect the parser-safe AGY fixture as audited.'

    $closeoutOutput = & powershell -ExecutionPolicy Bypass -File $closeoutPath $tempWpName | Out-String
    if ($LASTEXITCODE -ne 0) {
        throw 'Closeout helper failed after parser-safe mock AGY audit insertion.'
    }
    Assert-Contains `
        -Text $closeoutOutput `
        -Pattern 'Closeout state:\s*ReadyForAcceptance' `
        -Message 'Closeout helper did not detect the parser-safe AGY fixture as ready for acceptance.'

    $mockAgyAuthFailure = Join-Path $tempRoot 'mock-agy-auth-failure.ps1'
    Set-Content -LiteralPath $mockAgyAuthFailure -Encoding UTF8 -Value @'
Write-Error "You are not logged into Antigravity."
exit 1
'@

    $env:LITE_WP_AGY_CLI = $mockAgyAuthFailure
    & powershell -ExecutionPolicy Bypass -File $runnerPath $tempWpName -Execute AntiGravity -AllowExternalAudit -AntiGravityTimeoutMinutes 1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw 'Runner should record mock AGY auth failure as blocked without exiting non-zero.'
    }

    $blockedWp = Get-Content -LiteralPath $tempWpPath -Raw
    Assert-Contains `
        -Text $blockedWp `
        -Pattern 'Verdict:\s*BLOCKED' `
        -Message 'Mock AGY auth failure was not recorded as blocked.'
    Assert-Contains `
        -Text $blockedWp `
        -Pattern 'Blocker type:\s*authentication' `
        -Message 'Mock AGY auth failure was not classified as authentication.'
}
finally {
    if ($null -eq $originalAgyCli) {
        Remove-Item Env:LITE_WP_AGY_CLI -ErrorAction SilentlyContinue
    }
    else {
        $env:LITE_WP_AGY_CLI = $originalAgyCli
    }

    Remove-Item -LiteralPath $tempWpPath -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath $tempRoot -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host 'PASS run-work-package AntiGravity audit runner checks'
