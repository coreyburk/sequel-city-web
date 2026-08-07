param()

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Path (Split-Path -Path $PSScriptRoot -Parent) -Parent
$wrapperPath = Join-Path $repoRoot 'scripts/audit-work-package.ps1'
$implementationPath = Join-Path $repoRoot 'scripts/work-package/audit-work-package.ps1'
$wrapper = Get-Content -LiteralPath $wrapperPath -Raw
$implementation = Get-Content -LiteralPath $implementationPath -Raw
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

function Assert-ParameterContractMatches {
    param(
        [Parameter(Mandatory = $true)]
        [string]$ShimPath,

        [Parameter(Mandatory = $true)]
        [string]$ImplementationPath
    )

    $shimParameters = (Get-Command -Name $ShimPath).Parameters
    $implementationParameters = (Get-Command -Name $ImplementationPath).Parameters
    $parameterNames = @('WorkPackage', 'Agent', 'AllowExternalAudit', 'AllowMixedWorktree', 'TimeoutMinutes')

    foreach ($parameterName in $parameterNames) {
        if (-not $shimParameters.ContainsKey($parameterName)) {
            throw "Shim missing public parameter: $parameterName"
        }
        if (-not $implementationParameters.ContainsKey($parameterName)) {
            throw "Implementation missing public parameter: $parameterName"
        }

        $shimParameter = $shimParameters[$parameterName]
        $implementationParameter = $implementationParameters[$parameterName]
        if ($shimParameter.ParameterType.FullName -ne $implementationParameter.ParameterType.FullName) {
            throw "Parameter type mismatch for $parameterName."
        }

        $shimAliases = @($shimParameter.Aliases | Sort-Object)
        $implementationAliases = @($implementationParameter.Aliases | Sort-Object)
        if (($shimAliases -join ',') -ne ($implementationAliases -join ',')) {
            throw "Parameter alias mismatch for $parameterName."
        }

        $shimAttributes = @($shimParameter.Attributes)
        $implementationAttributes = @($implementationParameter.Attributes)
        $shimParameterAttribute = @($shimAttributes | Where-Object { $_ -is [System.Management.Automation.ParameterAttribute] } | Select-Object -First 1)
        $implementationParameterAttribute = @($implementationAttributes | Where-Object { $_ -is [System.Management.Automation.ParameterAttribute] } | Select-Object -First 1)

        if ($shimParameterAttribute.Count -eq 1 -and $implementationParameterAttribute.Count -eq 1) {
            if ($shimParameterAttribute[0].Mandatory -ne $implementationParameterAttribute[0].Mandatory) {
                throw "Parameter mandatory setting mismatch for $parameterName."
            }
            if ($shimParameterAttribute[0].Position -ne $implementationParameterAttribute[0].Position) {
                throw "Parameter position mismatch for $parameterName."
            }
        }
    }
}

if (-not (Test-Path -LiteralPath $wrapperPath -PathType Leaf)) {
    throw "Missing wrapper: $wrapperPath"
}

if (-not (Test-Path -LiteralPath $implementationPath -PathType Leaf)) {
    throw "Missing moved implementation: $implementationPath"
}

$parseErrors = $null
[System.Management.Automation.Language.Parser]::ParseFile($wrapperPath, [ref]$null, [ref]$parseErrors) | Out-Null
if ($parseErrors -and $parseErrors.Count -gt 0) {
    $formattedErrors = $parseErrors | ForEach-Object { $_.Message } | Out-String
    throw "audit-work-package.ps1 has parse errors:`n$formattedErrors"
}

$parseErrors = $null
[System.Management.Automation.Language.Parser]::ParseFile($implementationPath, [ref]$null, [ref]$parseErrors) | Out-Null
if ($parseErrors -and $parseErrors.Count -gt 0) {
    $formattedErrors = $parseErrors | ForEach-Object { $_.Message } | Out-String
    throw "work-package/audit-work-package.ps1 has parse errors:`n$formattedErrors"
}

Assert-Contains `
    -Text $wrapper `
    -Pattern 'work-package/audit-work-package\.ps1' `
    -Message 'Top-level audit wrapper shim does not delegate to scripts/work-package.'

Assert-Contains `
    -Text $wrapper `
    -Pattern '@PSBoundParameters' `
    -Message 'Top-level audit wrapper shim does not forward PSBoundParameters.'

Assert-Contains `
    -Text $implementation `
    -Pattern '\[string\]\$Agent = "AntiGravity"' `
    -Message 'Moved implementation must default to AntiGravity.'

Assert-Contains `
    -Text $implementation `
    -Pattern '-Execute Audit' `
    -Message 'Moved implementation must call the runner in generic audit mode.'

Assert-Contains `
    -Text $implementation `
    -Pattern '-AuditAgent AntiGravity' `
    -Message 'Moved implementation must pass the selected audit agent to the runner.'

Assert-Contains `
    -Text $implementation `
    -Pattern "run-work-package\.ps1" `
    -Message 'Moved implementation must resolve the top-level runner.'

Assert-ParameterContractMatches -ShimPath $wrapperPath -ImplementationPath $implementationPath

try {
    New-Item -ItemType Directory -Force -Path $tempRoot | Out-Null

    $tempWp = @'
# Audit Wrapper Temp

## Objective

Temporary audit wrapper validation.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/WP-180-audit-work-package-command-wrapper.md
- docs/01-work-packages/WP-218-audit-work-package-script-directory-compatibility-shim.md
- docs/01-work-packages/WP-222-run-work-package-script-directory-compatibility-shim.md
- docs/01-work-packages/WP-235-correct-audit-result-heading-normalization.md
- docs/01-work-packages/WP-9994-audit-wrapper-temp.md
- docs/00-ssot/END-OF-DAY-HANDOFF.md
- docs/05-development-workflow/Codex-Gemini-Execution-Guide.md
- docs/05-development-workflow/Contributor-Workflow-Guide.md
- docs/05-development-workflow/Work-Package-Lifecycle.md
- scripts/audit-work-package.ps1
- scripts/work-package/audit-work-package.ps1
- scripts/run-work-package.ps1
- scripts/work-package/run-work-package.ps1
- scripts/tests/test-audit-work-package-wrapper.ps1
- scripts/tests/test-agentic-workflow-decision.ps1
- scripts/tests/test-run-work-package-audit-runner.ps1
- scripts/tests/test-run-work-package-isolation.ps1
- scripts/tests/test-work-package-closeout-preflight.ps1
- scripts/tests/test-work-package-status.ps1
- .codex/skills/sequel-city-audit-runner-contracts/**
- .understand-anything/**

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

    & powershell -ExecutionPolicy Bypass -File $implementationPath 'WP-9994' -TimeoutMinutes 1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw 'Moved implementation should record missing AGY authorization as blocked without exiting non-zero.'
    }

    $directBlockedWp = Get-Content -LiteralPath $tempWpPath -Raw
    Assert-Contains `
        -Text $directBlockedWp `
        -Pattern 'Blocker type:\s*external audit not authorized' `
        -Message 'Moved implementation did not route default AntiGravity audit to the external authorization gate.'

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
Write-Output "## Wrapper Audit Summary"
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
    Assert-NotContains `
        -Text $updatedWp `
        -Pattern '(?m)^## Verdict:\s*PASS' `
        -Message 'Wrapper wrote mock AGY verdict as a top-level work-package heading.'
    Assert-Contains `
        -Text $updatedWp `
        -Pattern '(?m)^### Wrapper Audit Summary\s*$' `
        -Message 'Wrapper did not demote mock AGY audit subheading under Audit Results.'

    & powershell -ExecutionPolicy Bypass -File $implementationPath 'WP-9994' -AllowExternalAudit -TimeoutMinutes 1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw 'Moved implementation mock AGY success invocation failed.'
    }

    $directUpdatedWp = Get-Content -LiteralPath $tempWpPath -Raw
    Assert-Contains `
        -Text $directUpdatedWp `
        -Pattern 'Wrapper audit:\s*PASS' `
        -Message 'Moved implementation did not write mock AGY PASS output to Audit Results.'
    Assert-NotContains `
        -Text $directUpdatedWp `
        -Pattern '(?m)^## Verdict:\s*PASS' `
        -Message 'Moved implementation wrote mock AGY verdict as a top-level work-package heading.'
    Assert-Contains `
        -Text $directUpdatedWp `
        -Pattern '(?m)^### Wrapper Audit Summary\s*$' `
        -Message 'Moved implementation did not demote mock AGY audit subheading under Audit Results.'
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
