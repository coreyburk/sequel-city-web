param()

$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Path $PSScriptRoot -Parent
$repoRoot = Split-Path -Path $scriptRoot -Parent
$facadePath = Join-Path $scriptRoot 'get-sdk-manager-orchestration-dry-run.ps1'
$implementationPath = Join-Path $scriptRoot 'sdk-manager/get-sdk-manager-orchestration-dry-run.ps1'
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

function Assert-PathExists {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string]$Message
    )

    if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
        throw $Message
    }
}

function Assert-ParameterContractMatches {
    param(
        [Parameter(Mandatory = $true)][string]$ShimPath,
        [Parameter(Mandatory = $true)][string]$ImplementationPath
    )

    $shimParameters = (Get-Command -Name $ShimPath).Parameters
    $implementationParameters = (Get-Command -Name $ImplementationPath).Parameters
    $parameterNames = @('WorkPackage', 'Json', 'SkipUnderstandReadiness')

    foreach ($parameterName in $parameterNames) {
        if (-not $shimParameters.ContainsKey($parameterName)) {
            throw "Shim missing public parameter: $parameterName"
        }
        if (-not $implementationParameters.ContainsKey($parameterName)) {
            throw "Implementation missing public parameter: $parameterName"
        }

        $shimParameter = $shimParameters[$parameterName]
        $implementationParameter = $implementationParameters[$parameterName]
        Assert-Equal -Actual $shimParameter.ParameterType.FullName -Expected $implementationParameter.ParameterType.FullName -Message "Parameter type mismatch for $parameterName."

        $shimAliases = @($shimParameter.Aliases | Sort-Object)
        $implementationAliases = @($implementationParameter.Aliases | Sort-Object)
        Assert-Equal -Actual ($shimAliases -join ',') -Expected ($implementationAliases -join ',') -Message "Parameter alias mismatch for $parameterName."
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

function Get-OwnedTempWorkPackagePaths {
    $ownedNamePattern = '^WP-\d{4}-sdk-manager-orchestration-planned-temp\.md$'
    return @(
        Get-ChildItem -LiteralPath $wpDirectory -Force -File -ErrorAction SilentlyContinue |
            Where-Object { $_.Name -match $ownedNamePattern } |
            ForEach-Object { $_.FullName }
    )
}

function Clear-OwnedTempWorkPackageFixtures {
    foreach ($path in (Get-OwnedTempWorkPackagePaths)) {
        Remove-Item -LiteralPath $path -Force -ErrorAction SilentlyContinue
    }
}

function Assert-NoOwnedTempWorkPackageFixtures {
    $remaining = @(Get-OwnedTempWorkPackagePaths)
    if ($remaining.Count -gt 0) {
        throw "SDK manager orchestration temp WP fixtures were not cleaned up: $($remaining -join ', ')"
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
- .understand-anything/knowledge-graph.json
- .understand-anything/fingerprints.json
- .understand-anything/meta.json
- .understand-anything/intermediate/scan-result.json

Do Not Modify:

- apps/**
- database/**

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
    Assert-HasProperty -Object $Result -Name 'readiness' -Message 'Facade missing readiness.'
    Assert-HasProperty -Object $Result -Name 'testExecutionGuidance' -Message 'Facade missing test execution guidance.'
    Assert-HasProperty -Object $Result -Name 'operatorHandoff' -Message 'Facade missing operator handoff.'
    Assert-HasProperty -Object $Result.recommendation -Name 'readiness' -Message 'Nested recommendation missing readiness.'
    Assert-HasProperty -Object $Result.recommendation -Name 'testExecutionGuidance' -Message 'Nested recommendation missing test execution guidance.'
    Assert-HasProperty -Object $Result.recommendation -Name 'operatorHandoff' -Message 'Nested recommendation missing operator handoff.'
    Assert-Equal -Actual $Result.readiness.validation.action -Expected $Result.recommendation.readiness.validation.action -Message 'Facade readiness should mirror nested recommendation readiness.'
    Assert-Equal -Actual $Result.testExecutionGuidance.recommendation -Expected $Result.recommendation.testExecutionGuidance.recommendation -Message 'Facade test guidance should mirror nested recommendation guidance.'
    Assert-Equal -Actual $Result.operatorHandoff.nextAction -Expected $Result.recommendation.operatorHandoff.nextAction -Message 'Facade operator handoff should mirror nested recommendation next action.'
    Assert-Equal -Actual $Result.operatorHandoff.testExecution.requiresSerial -Expected $Result.recommendation.operatorHandoff.testExecution.requiresSerial -Message 'Facade operator handoff should mirror nested test guidance.'
    Assert-ContainsText -Text ([string]$Result.operatorHandoff.summary) -Pattern 'advisory.*does not execute commands' -Message 'Facade operator handoff summary should preserve advisory boundary.'
    Assert-ContainsText -Text ([string]$Result.operatorHandoff.stopReason) -Pattern 'does not execute workflow commands' -Message 'Facade operator handoff stop reason should preserve non-execution boundary.'

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

Assert-PathExists -Path $facadePath -Message "Missing top-level SDK manager orchestration dry-run shim: $facadePath"
Assert-PathExists -Path $implementationPath -Message "Missing SDK manager orchestration dry-run implementation: $implementationPath"

$parseErrors = $null
[System.Management.Automation.Language.Parser]::ParseFile($facadePath, [ref]$null, [ref]$parseErrors) | Out-Null
if ($parseErrors -and $parseErrors.Count -gt 0) {
    $formattedErrors = $parseErrors | ForEach-Object { $_.Message } | Out-String
    throw "get-sdk-manager-orchestration-dry-run.ps1 shim has parse errors:`n$formattedErrors"
}

$parseErrors = $null
[System.Management.Automation.Language.Parser]::ParseFile($implementationPath, [ref]$null, [ref]$parseErrors) | Out-Null
if ($parseErrors -and $parseErrors.Count -gt 0) {
    $formattedErrors = $parseErrors | ForEach-Object { $_.Message } | Out-String
    throw "get-sdk-manager-orchestration-dry-run.ps1 implementation has parse errors:`n$formattedErrors"
}

$shimSource = Get-Content -LiteralPath $facadePath -Raw
$implementationSource = Get-Content -LiteralPath $implementationPath -Raw
Assert-ContainsText -Text $shimSource -Pattern 'sdk-manager/get-sdk-manager-orchestration-dry-run\.ps1' -Message 'Orchestration shim does not delegate to scripts/sdk-manager.'
Assert-ContainsText -Text $shimSource -Pattern '@PSBoundParameters' -Message 'Orchestration shim does not forward PSBoundParameters.'
Assert-ContainsText -Text $implementationSource -Pattern "get-sdk-manager-recommendation\.ps1" -Message 'Moved orchestration implementation does not reference the top-level recommendation helper.'
Assert-ParameterContractMatches -ShimPath $facadePath -ImplementationPath $implementationPath

Clear-OwnedTempWorkPackageFixtures
Assert-NoOwnedTempWorkPackageFixtures

$beforeHashes = Get-FileHashMap
$plannedFixture = New-TemporaryWorkPackageFixture
$tempWpPaths = @($plannedFixture.path)

foreach ($tempWpPath in $tempWpPaths) {
    if (Test-Path -LiteralPath $tempWpPath) {
        throw "Temporary fixture path already exists and will not be overwritten: $tempWpPath"
    }
}

$testFailure = $null
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
    Assert-Equal -Actual $invalid.testExecutionGuidance.requiresSerial -Expected $false -Message 'Facade invalid WP should preserve deterministic standard test guidance.'
    Assert-Equal -Actual $invalid.operatorHandoff.blocked -Expected $true -Message 'Facade invalid WP operator handoff should report blocked.'
    Assert-ContainsText -Text ([string]$invalid.operatorHandoff.stopReason) -Pattern 'manual blocker resolution|workPackageStatus' -Message 'Facade invalid WP operator handoff should explain blocker.'

    $textOutput = & powershell -NoProfile -ExecutionPolicy Bypass -File $facadePath -WorkPackage $plannedFixture.id -SkipUnderstandReadiness 2>&1 | Out-String
    Assert-Equal -Actual $LASTEXITCODE -Expected 0 -Message 'Text facade command should exit 0.'
    Assert-ContainsText -Text $textOutput -Pattern 'SDK manager orchestration dry run:\s*implement' -Message 'Text output missing facade recommendation.'
    Assert-ContainsText -Text $textOutput -Pattern 'Dry run:\s*True' -Message 'Text output missing dry-run marker.'
    Assert-ContainsText -Text $textOutput -Pattern 'Executed:\s*False' -Message 'Text output missing executed false.'
    Assert-ContainsText -Text $textOutput -Pattern 'Execution forbidden:\s*True' -Message 'Text output missing execution-forbidden marker.'
    Assert-ContainsText -Text $textOutput -Pattern "Command preview:\s*scripts/run-work-package\.ps1 $($plannedFixture.id) -Execute Codex" -Message 'Text output missing command preview display text.'
    Assert-ContainsText -Text $textOutput -Pattern 'Validation readiness:' -Message 'Text output missing validation readiness.'
    Assert-ContainsText -Text $textOutput -Pattern 'Test execution guidance:\s*standard' -Message 'Text output missing standard test guidance.'
    Assert-ContainsText -Text $textOutput -Pattern 'Operator handoff:' -Message 'Text output missing operator handoff.'
    Assert-ContainsText -Text $textOutput -Pattern 'Operator stop reason:.*does not execute workflow commands' -Message 'Text output missing non-executing operator stop reason.'
    Assert-NotContainsText -Text $textOutput -Pattern 'PASS agentic workflow|PASS SDK manager recommendation' -Message 'Facade text output should not execute workflow test scripts.'

    $directTextOutput = & powershell -NoProfile -ExecutionPolicy Bypass -File $implementationPath -SkipUnderstandReadiness 2>&1 | Out-String
    Assert-Equal -Actual $LASTEXITCODE -Expected 0 -Message 'Direct implementation text command should exit 0.'
    Assert-ContainsText -Text $directTextOutput -Pattern 'SDK manager orchestration dry run:\s*plan' -Message 'Direct implementation text output missing facade recommendation.'
    Assert-ContainsText -Text $directTextOutput -Pattern 'Dry run:\s*True' -Message 'Direct implementation text output missing dry-run marker.'
    Assert-ContainsText -Text $directTextOutput -Pattern 'Executed:\s*False' -Message 'Direct implementation text output missing executed false.'
    Assert-ContainsText -Text $directTextOutput -Pattern 'Execution forbidden:\s*True' -Message 'Direct implementation text output missing execution-forbidden marker.'
    Assert-ContainsText -Text $directTextOutput -Pattern 'Validation readiness:' -Message 'Direct implementation text output missing validation readiness.'
    Assert-ContainsText -Text $directTextOutput -Pattern 'Test execution guidance:\s*standard' -Message 'Direct implementation text output missing standard guidance.'
    Assert-ContainsText -Text $directTextOutput -Pattern 'Operator handoff:' -Message 'Direct implementation text output missing operator handoff.'

    $afterHashes = Get-FileHashMap
    foreach ($key in $beforeHashes.Keys) {
        Assert-Equal -Actual $afterHashes[$key] -Expected $beforeHashes[$key] -Message "SDK manager orchestration dry-run tests modified tracked graph artifact $key."
    }

    Test-NoUnderstandTransientArtifacts
}
catch {
    $testFailure = $_
}
finally {
    foreach ($tempWpPath in $tempWpPaths) {
        if (Test-Path -LiteralPath $tempWpPath) {
            Remove-Item -LiteralPath $tempWpPath -Force -ErrorAction SilentlyContinue
        }
    }
    Clear-OwnedTempWorkPackageFixtures
}

Assert-NoOwnedTempWorkPackageFixtures

if ($null -ne $testFailure) {
    throw $testFailure
}

$wp233 = Invoke-FacadeJson -Arguments @('-WorkPackage', 'WP-233', '-SkipUnderstandReadiness')
Assert-Equal -Actual $wp233.kind -Expected 'sdk_manager_orchestration_dry_run' -Message 'WP-233 facade kind mismatch.'
Assert-Equal -Actual $wp233.recommendation.kind -Expected 'sdk_manager_recommendation' -Message 'WP-233 nested recommendation kind mismatch.'
Assert-HasProperty -Object $wp233 -Name 'readiness' -Message 'WP-233 facade JSON missing readiness.'
Assert-HasProperty -Object $wp233 -Name 'testExecutionGuidance' -Message 'WP-233 facade JSON missing test execution guidance.'
Assert-HasProperty -Object $wp233 -Name 'operatorHandoff' -Message 'WP-233 facade JSON missing operator handoff.'
Assert-Equal -Actual $wp233.readiness.validation.action -Expected $wp233.recommendation.readiness.validation.action -Message 'WP-233 facade readiness should mirror nested recommendation readiness.'
Assert-Equal -Actual $wp233.testExecutionGuidance.requiresSerial -Expected $true -Message 'WP-233 facade JSON should surface serial fixture-test guidance.'
Assert-Equal -Actual $wp233.operatorHandoff.testExecution.requiresSerial -Expected $true -Message 'WP-233 facade operator handoff should surface serial fixture-test guidance.'

$wp233TextOutput = & powershell -NoProfile -ExecutionPolicy Bypass -File $facadePath -WorkPackage WP-233 -SkipUnderstandReadiness 2>&1 | Out-String
Assert-Equal -Actual $LASTEXITCODE -Expected 0 -Message 'WP-233 text facade command should exit 0.'
Assert-ContainsText -Text $wp233TextOutput -Pattern 'Validation readiness:' -Message 'WP-233 facade text output missing validation readiness.'
Assert-ContainsText -Text $wp233TextOutput -Pattern 'Test execution guidance:\s*run serially' -Message 'WP-233 facade text output missing serial fixture-test guidance.'
Assert-ContainsText -Text $wp233TextOutput -Pattern 'Operator handoff:' -Message 'WP-233 facade text output missing operator handoff.'
Assert-ContainsText -Text $wp233TextOutput -Pattern 'Operator test execution:\s*run serially' -Message 'WP-233 facade text output missing operator serial test guidance.'

Write-Host 'PASS SDK manager orchestration dry-run facade contract checks'
