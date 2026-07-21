param()

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Path (Split-Path -Path $PSScriptRoot -Parent) -Parent
$runnerPath = Join-Path $repoRoot 'scripts/run-work-package.ps1'
$runner = Get-Content -LiteralPath $runnerPath -Raw
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

$parseErrors = $null
[System.Management.Automation.Language.Parser]::ParseFile($runnerPath, [ref]$null, [ref]$parseErrors) | Out-Null
if ($parseErrors -and $parseErrors.Count -gt 0) {
    $formattedErrors = $parseErrors | ForEach-Object { $_.Message } | Out-String
    throw "run-work-package.ps1 has parse errors:`n$formattedErrors"
}

Assert-Contains `
    -Text $runner `
    -Pattern '\[ValidateSet\("Gemini", "AntiGravity"\)\]\s*\[string\]\$AuditAgent = "Gemini"' `
    -Message 'AuditAgent must default to Gemini and support AntiGravity.'

Assert-Contains `
    -Text $runner `
    -Pattern '\[switch\]\$AllowExternalAudit' `
    -Message 'AllowExternalAudit switch is required for AGY data-sharing authorization.'

Assert-Contains `
    -Text $runner `
    -Pattern 'if \(-not \$AllowExternalAudit\)' `
    -Message 'AntiGravity execution must be blocked when external audit sharing is not authorized.'

Assert-Contains `
    -Text $runner `
    -Pattern "The runner did not send work-package prompt or repository context to AGY\." `
    -Message 'Blocked AGY audit result must state that repository context was not sent.'

Assert-Contains `
    -Text $runner `
    -Pattern "return `"agy`"" `
    -Message 'AntiGravity runner must resolve the agy CLI by default.'

Assert-Contains `
    -Text $runner `
    -Pattern '--print' `
    -Message 'AntiGravity runner must use agy print mode.'

Assert-Contains `
    -Text $runner `
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

## Files Allowed to Change

Allowed:

- scripts/run-work-package.ps1
- scripts/audit-work-package.ps1
- scripts/commit-work-package.ps1
- scripts/tests/**
- docs/01-work-packages/WP-175-isolated-work-package-audit-finalization-workflow.md
- docs/01-work-packages/WP-177-work-package-validation-plan-checker.md
- docs/01-work-packages/WP-179-unified-work-package-identifier-resolution.md
- docs/01-work-packages/WP-180-audit-work-package-command-wrapper.md
- docs/01-work-packages/WP-9999-runner-audit-temp.md
- docs/05-development-workflow/**
- docs/00-ssot/SSOT-Development-Workflow.md
- docs/00-ssot/END-OF-DAY-HANDOFF.md
- scripts/get-work-package-validation-plan.ps1
- scripts/get-work-package-status.ps1
- scripts/lib/**
- .codex/skills/sequel-city-audit-runner-contracts/**
- .codex/skills/sequel-city-wp-closeout-handoff/**

Do Not Modify:

- apps/**

## Code Prompt

No-op.

## Audit Prompt

Audit the temporary runner validation.

## Code Results

Pending.

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

    $mockAgySuccess = Join-Path $tempRoot 'mock-agy-success.ps1'
    Set-Content -LiteralPath $mockAgySuccess -Encoding UTF8 -Value @'
param(
    [string]$Print,
    [string]$Prompt,
    [string]$PrintTimeout,
    [string]$TimeoutValue
)

Write-Output "Verdict: PASS"
Write-Output ""
Write-Output "Scope violations: None"
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
