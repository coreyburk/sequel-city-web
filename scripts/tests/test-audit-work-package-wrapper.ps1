param()

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Path (Split-Path -Path $PSScriptRoot -Parent) -Parent
$wrapperPath = Join-Path $repoRoot 'scripts/audit-work-package.ps1'
$wrapper = Get-Content -LiteralPath $wrapperPath -Raw
$workPackageDirectory = Join-Path $repoRoot 'docs/01-work-packages'
$tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ('sequel-audit-wrapper-test-' + [guid]::NewGuid().ToString('N'))
$tempWpName = 'WP-9994-audit-wrapper-temp.md'
$tempWpPath = Join-Path $workPackageDirectory $tempWpName
$originalAgyCli = $env:LITE_WP_AGY_CLI

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

if (-not (Test-Path -LiteralPath $wrapperPath -PathType Leaf)) {
    throw "Missing wrapper: $wrapperPath"
}

$parseErrors = $null
[System.Management.Automation.Language.Parser]::ParseFile($wrapperPath, [ref]$null, [ref]$parseErrors) | Out-Null
if ($parseErrors -and $parseErrors.Count -gt 0) {
    $formattedErrors = $parseErrors | ForEach-Object { $_.Message } | Out-String
    throw "audit-work-package.ps1 has parse errors:`n$formattedErrors"
}

Assert-Contains `
    -Text $wrapper `
    -Pattern '\[string\]\$Agent = "AntiGravity"' `
    -Message 'Wrapper must default to AntiGravity.'

Assert-Contains `
    -Text $wrapper `
    -Pattern '-Execute Audit' `
    -Message 'Wrapper must call the runner in generic audit mode.'

Assert-Contains `
    -Text $wrapper `
    -Pattern '-AuditAgent AntiGravity' `
    -Message 'Wrapper must pass the selected audit agent to the runner.'

try {
    New-Item -ItemType Directory -Force -Path $tempRoot | Out-Null

    $tempWp = @'
# Audit Wrapper Temp

## Objective

Temporary audit wrapper validation.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/WP-180-audit-work-package-command-wrapper.md
- docs/01-work-packages/WP-9994-audit-wrapper-temp.md
- docs/00-ssot/END-OF-DAY-HANDOFF.md
- docs/05-development-workflow/Codex-Gemini-Execution-Guide.md
- docs/05-development-workflow/Contributor-Workflow-Guide.md
- scripts/audit-work-package.ps1
- scripts/tests/test-audit-work-package-wrapper.ps1
- scripts/tests/test-run-work-package-audit-runner.ps1
- .codex/skills/sequel-city-audit-runner-contracts/**

Do Not Modify:

- apps/**
- database/**

## Code Prompt

No-op.

## Audit Prompt

Audit the temporary wrapper validation.

## Code Results

Pending.

## Audit Results

Pending.

## Final Decision

Pending.
'@
    Set-Content -LiteralPath $tempWpPath -Value $tempWp -Encoding UTF8

    & powershell -ExecutionPolicy Bypass -File $wrapperPath 'WP-9994' -TimeoutMinutes 1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw 'Wrapper should record missing AGY authorization as blocked without exiting non-zero.'
    }

    $blockedWp = Get-Content -LiteralPath $tempWpPath -Raw
    Assert-Contains `
        -Text $blockedWp `
        -Pattern 'Blocker type:\s*external audit not authorized' `
        -Message 'Wrapper did not route default AntiGravity audit to the external authorization gate.'

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
Write-Output "Wrapper audit: PASS"
exit 0
'@

    $env:LITE_WP_AGY_CLI = $mockAgySuccess
    & powershell -ExecutionPolicy Bypass -File $wrapperPath 'WP-9994' -AllowExternalAudit -TimeoutMinutes 1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw 'Wrapper mock AGY success invocation failed.'
    }

    $updatedWp = Get-Content -LiteralPath $tempWpPath -Raw
    Assert-Contains `
        -Text $updatedWp `
        -Pattern 'Wrapper audit:\s*PASS' `
        -Message 'Wrapper did not write mock AGY PASS output to Audit Results.'
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

Write-Host 'PASS audit-work-package wrapper checks'
