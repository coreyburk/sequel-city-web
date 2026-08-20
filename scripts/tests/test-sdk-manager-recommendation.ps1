param()

$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Path $PSScriptRoot -Parent
$repoRoot = Split-Path -Path $scriptRoot -Parent
$managerPath = Join-Path $scriptRoot 'get-sdk-manager-recommendation.ps1'
$implementationPath = Join-Path $scriptRoot 'sdk-manager/get-sdk-manager-recommendation.ps1'
$wpDirectory = Join-Path $repoRoot 'docs/01-work-packages'
$tempWpPaths = @()
$tempFixtures = @()

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
    $parameterNames = @(
        'WorkPackage',
        'Json',
        'SkipUnderstandReadiness',
        'AllowTestDecisionSnapshot',
        'DecisionSnapshotJson',
        'DecisionSnapshotJsonBase64'
    )

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

function ConvertTo-Base64Text {
    param([Parameter(Mandatory = $true)][string]$Text)

    return [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($Text))
}

function New-DecisionSnapshotJson {
    param(
        [Parameter(Mandatory = $true)][string]$WorkPackage,
        [Parameter(Mandatory = $true)][string]$DecisionAction,
        [Parameter(Mandatory = $true)][string]$OverallState,
        [Parameter(Mandatory = $true)][string]$WorkPackageStatusState,
        [Parameter(Mandatory = $true)][string]$CloseoutState,
        [bool]$RequiresHumanDecision = $true,
        [bool]$RequiresExternalAuthorization = $false,
        [AllowEmptyString()][string]$CommandPreview = '',
        [string[]]$Blockers = @()
    )

    $blockerDetails = @($Blockers | ForEach-Object {
        $source = 'statusBundle'
        $state = $_
        if ($_ -match '^\s*([^:]+):\s*(.+?)\s*$') {
            $source = $Matches[1].Trim()
            $state = $Matches[2].Trim()
        }

        [pscustomobject]@{
            source = $source
            state = $state
            message = "Fixture blocker for $source."
            nextStep = 'Resolve the fixture blocker before executing workflow commands.'
            commandPreview = ''
        }
    })

    $snapshot = [pscustomobject]@{
        generatedAt = '2026-07-24T00:00:00.0000000Z'
        dryRun = $true
        executed = $false
        workPackage = [pscustomobject]@{
            input = $WorkPackage
        }
        status = [pscustomobject]@{
            statusBundleExitCode = 0
            statusBundleParseSucceeded = $true
            overallState = $OverallState
        }
        recommendation = [pscustomobject]@{
            action = $DecisionAction
            commandPreview = $CommandPreview
            requiresHumanDecision = $RequiresHumanDecision
            requiresExternalAuthorization = $RequiresExternalAuthorization
            reason = "Fixture route for $DecisionAction."
            blockers = @($Blockers)
            blockerDetails = @($blockerDetails)
            readiness = [pscustomobject]@{
                componentParseReadiness = @(
                    [pscustomobject]@{
                        name = 'workPackageStatus'
                        state = $WorkPackageStatusState
                        status = 'Ready'
                        skipped = $false
                        parseSucceeded = $true
                        ready = $true
                        message = 'Fixture readiness.'
                    }
                )
                validation = [pscustomobject]@{
                    available = $true
                    action = 'run_planned_validation'
                    requiresAction = $true
                    reviewRequired = $false
                    blocksAuditReadiness = $false
                    summary = 'Run planned fixture validation.'
                }
            }
            testExecutionGuidance = [pscustomobject]@{
                recommendation = 'run_serially'
                requiresSerial = $true
                reason = 'Fixture work-package tests create temporary work-package files and should run serially.'
                commands = @(
                    'powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-sdk-manager-recommendation.ps1'
                )
            }
        }
        statusSnapshot = [pscustomobject]@{
            workPackage = [pscustomobject]@{
                input = $WorkPackage
                available = $true
            }
            components = [pscustomobject]@{
                workPackageStatus = [pscustomobject]@{
                    state = $WorkPackageStatusState
                }
                closeoutPreflight = [pscustomobject]@{
                    state = $CloseoutState
                }
            }
            overall = [pscustomobject]@{
                state = $OverallState
                blockers = @($Blockers)
            }
        }
    }

    return ($snapshot | ConvertTo-Json -Depth 12 -Compress)
}

function Invoke-ManagerJson {
    param([string[]]$Arguments)

    $output = & powershell -NoProfile -ExecutionPolicy Bypass -File $managerPath @Arguments -Json 2>&1 | Out-String
    if ($LASTEXITCODE -ne 0) {
        throw "Manager recommendation command should exit 0. Exit code: $LASTEXITCODE Output: $output"
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
        throw '.understand-anything/tmp should not exist after SDK manager recommendation tests.'
    }

    $trashDirs = @(Get-ChildItem -LiteralPath $understandRoot -Force -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -like '.trash-*' })
    if ($trashDirs.Count -gt 0) {
        throw 'Understand trash directories should not exist after SDK manager recommendation tests.'
    }

    $logFiles = @(Get-ChildItem -LiteralPath $understandRoot -Force -File -ErrorAction SilentlyContinue | Where-Object { $_.Name -like '*.log' })
    if ($logFiles.Count -gt 0) {
        throw 'Understand log files should not exist after SDK manager recommendation tests.'
    }
}

function Get-OwnedTempWorkPackagePaths {
    $ownedNamePattern = '^WP-\d{4}-sdk-manager-(planned|implemented|audited|accepted|rejected|deferred)-temp\.md$'
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
        throw "SDK manager recommendation temp WP fixtures were not cleaned up: $($remaining -join ', ')"
    }
}

function New-SdkManagerWorkPackage {
    param(
        [string]$Title = 'Temporary SDK Manager Test Work Package',
        [string]$CodeResults = 'Pending implementation.',
        [string]$AuditResults = 'Pending audit.',
        [string]$FinalDecision = 'Pending human acceptance.'
    )

    return @"
# $Title

## Objective

Validate SDK manager recommendation routing for a temporary work package.

## Scope

### In Scope

- Temporary SDK manager recommendation validation.

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
- User workflows: SDK manager recommendation checking.
- Security/data boundaries: no runtime changes.

### Graph Update Decision
- Regeneration required: No.
- Rationale: Fixture-only validation.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/**
- docs/00-ssot/END-OF-DAY-HANDOFF.md
- docs/05-development-workflow/**
- scripts/**
- .codex/skills/sequel-city-audit-runner-contracts/**
- .codex/skills/sequel-city-wp-closeout-handoff/**
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

- Report the correct SDK manager recommendation state.

## Acceptance Criteria

- [ ] SDK manager recommendation routing is classified correctly.

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

function New-ImplementedCodeResults {
    return @"
Implemented temporary fixture behavior.

Validation:

- PASS: temporary SDK manager recommendation fixture validation
"@
}

function New-PassingAuditResults {
    return @"
Verdict: PASS

Violations:

- None.

Regressions:

- None.

Drift risks:

- None.
"@
}

function New-TemporaryWorkPackageFixtures {
    $routes = @(
        'planned',
        'implemented',
        'audited',
        'accepted',
        'rejected',
        'deferred'
    )

    for ($attempt = 0; $attempt -lt 100; $attempt++) {
        $baseNumber = Get-Random -Minimum 9000 -Maximum 9780
        $candidateFixtures = @()
        $candidatePaths = @()

        for ($index = 0; $index -lt $routes.Count; $index++) {
            $route = $routes[$index]
            $number = $baseNumber + $index
            $id = 'WP-{0}' -f $number
            $path = Join-Path $wpDirectory "$id-sdk-manager-$route-temp.md"

            $candidateFixtures += [pscustomobject]@{
                route = $route
                number = $number
                id = $id
                path = $path
                title = "$id $($route.Substring(0, 1).ToUpperInvariant())$($route.Substring(1)) SDK Manager Fixture"
            }
            $candidatePaths += $path
        }

        $collisions = @($candidatePaths | Where-Object { Test-Path -LiteralPath $_ })
        if ($collisions.Count -eq 0) {
            return @($candidateFixtures)
        }
    }

    throw 'Unable to allocate collision-free temporary SDK manager WP fixtures after 100 attempts.'
}

function Get-FixtureByRoute {
    param(
        [Parameter(Mandatory = $true)][object[]]$Fixtures,
        [Parameter(Mandatory = $true)][string]$Route
    )

    $fixture = @($Fixtures | Where-Object { $_.route -eq $Route })
    if ($fixture.Count -ne 1) {
        throw "Expected exactly one SDK manager fixture for route '$Route' but found $($fixture.Count)."
    }

    return $fixture[0]
}

function Assert-ManagerRecommendation {
    param(
        [Parameter(Mandatory = $true)][object]$Recommendation,
        [Parameter(Mandatory = $true)][string]$ExpectedAction,
        [Parameter(Mandatory = $true)][string]$ExpectedStatusState,
        [Parameter(Mandatory = $true)][bool]$ExpectedRequiresHumanAuthorization,
        [Parameter(Mandatory = $true)][bool]$ExpectedRequiresExternalAuthorization,
        [AllowEmptyString()][string]$CommandPattern = '',
        [string]$MessagePrefix = 'Manager recommendation'
    )

    Assert-Equal -Actual $Recommendation.kind -Expected 'sdk_manager_recommendation' -Message "$MessagePrefix kind mismatch."
    Assert-Equal -Actual $Recommendation.recommendedAction -Expected $ExpectedAction -Message "$MessagePrefix action mismatch."
    Assert-Equal -Actual $Recommendation.statusState -Expected $ExpectedStatusState -Message "$MessagePrefix status state mismatch."
    Assert-Equal -Actual $Recommendation.requiresHumanAuthorization -Expected $ExpectedRequiresHumanAuthorization -Message "$MessagePrefix human authorization flag mismatch."
    Assert-Equal -Actual $Recommendation.requiresExternalAuthorization -Expected $ExpectedRequiresExternalAuthorization -Message "$MessagePrefix external authorization flag mismatch."
    Assert-Equal -Actual $Recommendation.forbiddenToExecute -Expected $true -Message "$MessagePrefix forbiddenToExecute flag mismatch."
    Assert-Equal -Actual $Recommendation.source.dryRun -Expected $true -Message "$MessagePrefix source dryRun mismatch."
    Assert-Equal -Actual $Recommendation.source.executed -Expected $false -Message "$MessagePrefix source executed mismatch."

    $commandPreview = [string]$Recommendation.commandPreview
    if ([string]::IsNullOrWhiteSpace($CommandPattern)) {
        Assert-Equal -Actual $commandPreview -Expected '' -Message "$MessagePrefix should not include a command preview."
    }
    else {
        Assert-ContainsText -Text $commandPreview -Pattern $CommandPattern -Message "$MessagePrefix command preview mismatch."
    }

    Assert-HasProperty -Object $Recommendation -Name 'generatedAt' -Message "$MessagePrefix missing generatedAt."
    Assert-HasProperty -Object $Recommendation -Name 'workPackage' -Message "$MessagePrefix missing workPackage."
    Assert-HasProperty -Object $Recommendation -Name 'blockers' -Message "$MessagePrefix missing blockers."
    Assert-HasProperty -Object $Recommendation -Name 'evidence' -Message "$MessagePrefix missing evidence."
    Assert-HasProperty -Object $Recommendation -Name 'source' -Message "$MessagePrefix missing source metadata."
    Assert-HasProperty -Object $Recommendation -Name 'readiness' -Message "$MessagePrefix missing readiness."
    Assert-HasProperty -Object $Recommendation -Name 'testExecutionGuidance' -Message "$MessagePrefix missing test execution guidance."
    Assert-HasProperty -Object $Recommendation -Name 'operatorHandoff' -Message "$MessagePrefix missing operator handoff."
    Assert-Equal -Actual $Recommendation.operatorHandoff.nextAction -Expected $Recommendation.recommendedAction -Message "$MessagePrefix operator handoff next action mismatch."
    Assert-Equal -Actual $Recommendation.operatorHandoff.workPackage -Expected $Recommendation.workPackage -Message "$MessagePrefix operator handoff work package mismatch."
    Assert-Equal -Actual $Recommendation.operatorHandoff.requiresHumanAuthorization -Expected $Recommendation.requiresHumanAuthorization -Message "$MessagePrefix operator handoff human authorization mismatch."
    Assert-Equal -Actual $Recommendation.operatorHandoff.requiresExternalAuthorization -Expected $Recommendation.requiresExternalAuthorization -Message "$MessagePrefix operator handoff external authorization mismatch."
    Assert-Equal -Actual $Recommendation.operatorHandoff.validationReadiness.action -Expected $Recommendation.readiness.validation.action -Message "$MessagePrefix operator handoff validation action mismatch."
    Assert-Equal -Actual $Recommendation.operatorHandoff.testExecution.requiresSerial -Expected $Recommendation.testExecutionGuidance.requiresSerial -Message "$MessagePrefix operator handoff test guidance mismatch."
    Assert-ContainsText -Text ([string]$Recommendation.operatorHandoff.summary) -Pattern 'advisory.*does not execute commands' -Message "$MessagePrefix operator handoff summary should preserve advisory boundary."
    Assert-ContainsText -Text ([string]$Recommendation.operatorHandoff.stopReason) -Pattern 'does not execute workflow commands' -Message "$MessagePrefix operator handoff stop reason should preserve non-execution boundary."
}

Assert-PathExists -Path $managerPath -Message "Missing top-level SDK manager recommendation shim: $managerPath"
Assert-PathExists -Path $implementationPath -Message "Missing SDK manager recommendation implementation: $implementationPath"

Clear-OwnedTempWorkPackageFixtures
Assert-NoOwnedTempWorkPackageFixtures

$tempFixtures = New-TemporaryWorkPackageFixtures
$tempWpPaths = @($tempFixtures | ForEach-Object { $_.path })

foreach ($tempWpPath in $tempWpPaths) {
    if (Test-Path -LiteralPath $tempWpPath) {
        throw "Temporary fixture path already exists and will not be overwritten: $tempWpPath"
    }
}

$parseErrors = $null
[System.Management.Automation.Language.Parser]::ParseFile($managerPath, [ref]$null, [ref]$parseErrors) | Out-Null
if ($parseErrors -and $parseErrors.Count -gt 0) {
    $formattedErrors = $parseErrors | ForEach-Object { $_.Message } | Out-String
    throw "get-sdk-manager-recommendation.ps1 shim has parse errors:`n$formattedErrors"
}

$parseErrors = $null
[System.Management.Automation.Language.Parser]::ParseFile($implementationPath, [ref]$null, [ref]$parseErrors) | Out-Null
if ($parseErrors -and $parseErrors.Count -gt 0) {
    $formattedErrors = $parseErrors | ForEach-Object { $_.Message } | Out-String
    throw "get-sdk-manager-recommendation.ps1 implementation has parse errors:`n$formattedErrors"
}

$shimSource = Get-Content -LiteralPath $managerPath -Raw
$implementationSource = Get-Content -LiteralPath $implementationPath -Raw
Assert-ContainsText -Text $shimSource -Pattern 'sdk-manager/get-sdk-manager-recommendation\.ps1' -Message 'Recommendation shim does not delegate to scripts/sdk-manager.'
Assert-ContainsText -Text $shimSource -Pattern '@PSBoundParameters' -Message 'Recommendation shim does not forward PSBoundParameters.'
Assert-ContainsText -Text $implementationSource -Pattern "get-agentic-workflow-decision\.ps1" -Message 'Moved recommendation implementation does not reference the top-level decision helper.'
Assert-ParameterContractMatches -ShimPath $managerPath -ImplementationPath $implementationPath

$testFailure = $null
try {
    $plannedFixture = Get-FixtureByRoute -Fixtures $tempFixtures -Route 'planned'
    $implementedFixture = Get-FixtureByRoute -Fixtures $tempFixtures -Route 'implemented'
    $auditedFixture = Get-FixtureByRoute -Fixtures $tempFixtures -Route 'audited'
    $acceptedFixture = Get-FixtureByRoute -Fixtures $tempFixtures -Route 'accepted'
    $rejectedFixture = Get-FixtureByRoute -Fixtures $tempFixtures -Route 'rejected'
    $deferredFixture = Get-FixtureByRoute -Fixtures $tempFixtures -Route 'deferred'

    Set-Content -LiteralPath $plannedFixture.path -Value (New-SdkManagerWorkPackage -Title $plannedFixture.title) -Encoding UTF8
    Set-Content -LiteralPath $implementedFixture.path -Value (New-SdkManagerWorkPackage -Title $implementedFixture.title -CodeResults (New-ImplementedCodeResults)) -Encoding UTF8
    Set-Content -LiteralPath $auditedFixture.path -Value (New-SdkManagerWorkPackage -Title $auditedFixture.title -CodeResults (New-ImplementedCodeResults) -AuditResults (New-PassingAuditResults)) -Encoding UTF8
    Set-Content -LiteralPath $acceptedFixture.path -Value (New-SdkManagerWorkPackage -Title $acceptedFixture.title -CodeResults (New-ImplementedCodeResults) -AuditResults (New-PassingAuditResults) -FinalDecision 'Accepted after fixture validation.') -Encoding UTF8
    Set-Content -LiteralPath $rejectedFixture.path -Value (New-SdkManagerWorkPackage -Title $rejectedFixture.title -FinalDecision 'Rejected after fixture validation.') -Encoding UTF8
    Set-Content -LiteralPath $deferredFixture.path -Value (New-SdkManagerWorkPackage -Title $deferredFixture.title -FinalDecision 'Deferred after fixture validation.') -Encoding UTF8

    $beforeHashes = Get-FileHashMap

    $repositoryOnly = Invoke-ManagerJson -Arguments @('-SkipUnderstandReadiness')
    Assert-ManagerRecommendation -Recommendation $repositoryOnly -ExpectedAction 'plan' -ExpectedStatusState 'Skipped' -ExpectedRequiresHumanAuthorization $false -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Repository-only'
    Assert-Equal -Actual $repositoryOnly.workPackage -Expected '' -Message 'Repository-only work package should be empty.'
    Assert-ContainsText -Text (@($repositoryOnly.evidence.source) -join "`n") -Pattern 'scripts/get-agentic-workflow-decision\.ps1' -Message 'Repository-only evidence should cite decision router.'

    $realPlanned = Invoke-ManagerJson -Arguments @('-WorkPackage', $plannedFixture.id, '-SkipUnderstandReadiness')
    Assert-ManagerRecommendation -Recommendation $realPlanned -ExpectedAction 'implement' -ExpectedStatusState 'ReadyForImplementation' -ExpectedRequiresHumanAuthorization $true -ExpectedRequiresExternalAuthorization $false -CommandPattern "run-work-package\.ps1 $($plannedFixture.id) -Execute Codex" -MessagePrefix 'Real planned WP'

    $realImplemented = Invoke-ManagerJson -Arguments @('-WorkPackage', $implementedFixture.id, '-SkipUnderstandReadiness')
    Assert-ManagerRecommendation -Recommendation $realImplemented -ExpectedAction 'audit' -ExpectedStatusState 'ImplementedNeedsAudit' -ExpectedRequiresHumanAuthorization $true -ExpectedRequiresExternalAuthorization $true -CommandPattern "audit-work-package\.ps1 $($implementedFixture.id) -AllowExternalAudit" -MessagePrefix 'Real implemented WP'

    $realAudited = Invoke-ManagerJson -Arguments @('-WorkPackage', $auditedFixture.id, '-SkipUnderstandReadiness')
    Assert-ManagerRecommendation -Recommendation $realAudited -ExpectedAction 'request_human_decision' -ExpectedStatusState 'AuditedNeedsFinalDecision' -ExpectedRequiresHumanAuthorization $true -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Real audited WP'

    $realAccepted = Invoke-ManagerJson -Arguments @('-WorkPackage', $acceptedFixture.id, '-SkipUnderstandReadiness')
    Assert-ManagerRecommendation -Recommendation $realAccepted -ExpectedAction 'finalize' -ExpectedStatusState 'AcceptedReadyForFinalization' -ExpectedRequiresHumanAuthorization $true -ExpectedRequiresExternalAuthorization $false -CommandPattern "commit-work-package\.ps1 -WorkPackagePath $($acceptedFixture.id) -Preview" -MessagePrefix 'Real accepted WP'

    $realRejected = Invoke-ManagerJson -Arguments @('-WorkPackage', $rejectedFixture.id, '-SkipUnderstandReadiness')
    Assert-ManagerRecommendation -Recommendation $realRejected -ExpectedAction 'no_action' -ExpectedStatusState 'ClosedRejected' -ExpectedRequiresHumanAuthorization $false -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Real rejected WP'

    $realDeferred = Invoke-ManagerJson -Arguments @('-WorkPackage', $deferredFixture.id, '-SkipUnderstandReadiness')
    Assert-ManagerRecommendation -Recommendation $realDeferred -ExpectedAction 'no_action' -ExpectedStatusState 'ClosedDeferred' -ExpectedRequiresHumanAuthorization $false -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Real deferred WP'

    $realInvalid = Invoke-ManagerJson -Arguments @('-WorkPackage', 'WP-0000-does-not-exist', '-SkipUnderstandReadiness')
    Assert-ManagerRecommendation -Recommendation $realInvalid -ExpectedAction 'resolve_blockers' -ExpectedStatusState 'Unparsed' -ExpectedRequiresHumanAuthorization $true -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Real invalid WP'
    Assert-ContainsText -Text (@($realInvalid.blockers) -join "`n") -Pattern 'workPackageStatus' -Message 'Invalid WP should surface status blocker.'

    $plannedSnapshot = ConvertTo-Base64Text -Text (New-DecisionSnapshotJson -WorkPackage 'WP-9991' -DecisionAction 'ImplementWorkPackage' -OverallState 'Ready' -WorkPackageStatusState 'ReadyForImplementation' -CloseoutState 'ReadyForAudit' -CommandPreview 'scripts/run-work-package.ps1 WP-9991 -Execute Codex')
    $planned = Invoke-ManagerJson -Arguments @('-WorkPackage', 'WP-9991', '-DecisionSnapshotJsonBase64', $plannedSnapshot, '-AllowTestDecisionSnapshot')
    Assert-ManagerRecommendation -Recommendation $planned -ExpectedAction 'implement' -ExpectedStatusState 'ReadyForImplementation' -ExpectedRequiresHumanAuthorization $true -ExpectedRequiresExternalAuthorization $false -CommandPattern 'run-work-package\.ps1 WP-9991 -Execute Codex' -MessagePrefix 'Planned snapshot WP'
    Assert-Equal -Actual $planned.readiness.validation.action -Expected 'run_planned_validation' -Message 'Planned snapshot readiness should surface validation action.'
    Assert-Equal -Actual $planned.testExecutionGuidance.requiresSerial -Expected $true -Message 'Planned snapshot should surface serial fixture guidance.'
    Assert-Equal -Actual $planned.operatorHandoff.testExecution.requiresSerial -Expected $true -Message 'Planned snapshot operator handoff should surface serial fixture guidance.'
    Assert-ContainsText -Text ([string]$planned.operatorHandoff.summary) -Pattern "Next action 'implement'" -Message 'Planned snapshot operator handoff summary should identify next action.'
    Assert-ContainsText -Text (@($planned.evidence | ForEach-Object { "$($_.source):$($_.field):$($_.value)" }) -join "`n") -Pattern 'decisionRouter:readiness:available' -Message 'Recommendation evidence should cite readiness availability.'
    Assert-ContainsText -Text (@($planned.evidence | ForEach-Object { "$($_.source):$($_.field):$($_.value)" }) -join "`n") -Pattern 'decisionRouter:testExecutionGuidance:available' -Message 'Recommendation evidence should cite test guidance availability.'

    $implementedSnapshot = ConvertTo-Base64Text -Text (New-DecisionSnapshotJson -WorkPackage 'WP-9992' -DecisionAction 'RequestIndependentAudit' -OverallState 'Ready' -WorkPackageStatusState 'ImplementedNeedsAudit' -CloseoutState 'ReadyForAudit' -RequiresExternalAuthorization $true -CommandPreview 'scripts/audit-work-package.ps1 WP-9992 -AllowExternalAudit')
    $implemented = Invoke-ManagerJson -Arguments @('-WorkPackage', 'WP-9992', '-DecisionSnapshotJsonBase64', $implementedSnapshot, '-AllowTestDecisionSnapshot')
    Assert-ManagerRecommendation -Recommendation $implemented -ExpectedAction 'audit' -ExpectedStatusState 'ImplementedNeedsAudit' -ExpectedRequiresHumanAuthorization $true -ExpectedRequiresExternalAuthorization $true -CommandPattern 'audit-work-package\.ps1 WP-9992 -AllowExternalAudit' -MessagePrefix 'Implemented snapshot WP'

    $auditedSnapshot = ConvertTo-Base64Text -Text (New-DecisionSnapshotJson -WorkPackage 'WP-9993' -DecisionAction 'RequestHumanFinalDecision' -OverallState 'Ready' -WorkPackageStatusState 'AuditedNeedsFinalDecision' -CloseoutState 'ReadyForAcceptance')
    $audited = Invoke-ManagerJson -Arguments @('-WorkPackage', 'WP-9993', '-DecisionSnapshotJsonBase64', $auditedSnapshot, '-AllowTestDecisionSnapshot')
    Assert-ManagerRecommendation -Recommendation $audited -ExpectedAction 'request_human_decision' -ExpectedStatusState 'AuditedNeedsFinalDecision' -ExpectedRequiresHumanAuthorization $true -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Audited snapshot WP'

    $acceptedSnapshot = ConvertTo-Base64Text -Text (New-DecisionSnapshotJson -WorkPackage 'WP-9994' -DecisionAction 'FinalizeAcceptedWorkPackage' -OverallState 'Ready' -WorkPackageStatusState 'AcceptedReadyForFinalization' -CloseoutState 'ReadyForFinalization' -CommandPreview 'scripts/commit-work-package.ps1 -WorkPackagePath WP-9994 -Preview')
    $accepted = Invoke-ManagerJson -Arguments @('-WorkPackage', 'WP-9994', '-DecisionSnapshotJsonBase64', $acceptedSnapshot, '-AllowTestDecisionSnapshot')
    Assert-ManagerRecommendation -Recommendation $accepted -ExpectedAction 'finalize' -ExpectedStatusState 'AcceptedReadyForFinalization' -ExpectedRequiresHumanAuthorization $true -ExpectedRequiresExternalAuthorization $false -CommandPattern 'commit-work-package\.ps1 -WorkPackagePath WP-9994 -Preview' -MessagePrefix 'Accepted snapshot WP'

    $blockedSnapshot = ConvertTo-Base64Text -Text (New-DecisionSnapshotJson -WorkPackage 'WP-9995' -DecisionAction 'ResolveBlockers' -OverallState 'Blocked' -WorkPackageStatusState 'BlockedMixedWorktree' -CloseoutState 'Blocked' -Blockers @('workPackageStatus: BlockedMixedWorktree', 'closeoutPreflight: Blocked'))
    $blocked = Invoke-ManagerJson -Arguments @('-WorkPackage', 'WP-9995', '-DecisionSnapshotJsonBase64', $blockedSnapshot, '-AllowTestDecisionSnapshot')
    Assert-ManagerRecommendation -Recommendation $blocked -ExpectedAction 'resolve_blockers' -ExpectedStatusState 'BlockedMixedWorktree' -ExpectedRequiresHumanAuthorization $true -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Blocked snapshot WP'
    Assert-ContainsText -Text (@($blocked.blockers) -join "`n") -Pattern 'BlockedMixedWorktree' -Message 'Blocked WP should surface mixed-worktree blocker.'

    $closedSnapshot = ConvertTo-Base64Text -Text (New-DecisionSnapshotJson -WorkPackage 'WP-9996' -DecisionAction 'NoActionClosed' -OverallState 'Ready' -WorkPackageStatusState 'ClosedRejected' -CloseoutState 'Blocked' -RequiresHumanDecision $false)
    $closed = Invoke-ManagerJson -Arguments @('-WorkPackage', 'WP-9996', '-DecisionSnapshotJsonBase64', $closedSnapshot, '-AllowTestDecisionSnapshot')
    Assert-ManagerRecommendation -Recommendation $closed -ExpectedAction 'no_action' -ExpectedStatusState 'ClosedRejected' -ExpectedRequiresHumanAuthorization $false -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Closed snapshot WP'

    $manualSnapshot = ConvertTo-Base64Text -Text (New-DecisionSnapshotJson -WorkPackage 'WP-9997' -DecisionAction 'ManualReview' -OverallState 'Ready' -WorkPackageStatusState 'UnexpectedLifecycleState' -CloseoutState 'UnexpectedCloseoutState')
    $manual = Invoke-ManagerJson -Arguments @('-WorkPackage', 'WP-9997', '-DecisionSnapshotJsonBase64', $manualSnapshot, '-AllowTestDecisionSnapshot')
    Assert-ManagerRecommendation -Recommendation $manual -ExpectedAction 'manual_review' -ExpectedStatusState 'UnexpectedLifecycleState' -ExpectedRequiresHumanAuthorization $true -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Manual-review snapshot WP'

    $unknownSnapshot = ConvertTo-Base64Text -Text (New-DecisionSnapshotJson -WorkPackage 'WP-9998' -DecisionAction 'UnexpectedDecisionAction' -OverallState 'Ready' -WorkPackageStatusState 'UnexpectedLifecycleState' -CloseoutState 'UnexpectedCloseoutState')
    $unknown = Invoke-ManagerJson -Arguments @('-WorkPackage', 'WP-9998', '-DecisionSnapshotJsonBase64', $unknownSnapshot, '-AllowTestDecisionSnapshot')
    Assert-ManagerRecommendation -Recommendation $unknown -ExpectedAction 'manual_review' -ExpectedStatusState 'UnexpectedLifecycleState' -ExpectedRequiresHumanAuthorization $true -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Unknown-action snapshot WP'
    Assert-Equal -Actual $unknown.source.decisionAction -Expected 'UnexpectedDecisionAction' -Message 'Unknown action should be preserved in source metadata.'

    $unguarded = Invoke-ManagerJson -Arguments @('-WorkPackage', 'WP-9999', '-DecisionSnapshotJsonBase64', $plannedSnapshot)
    Assert-ManagerRecommendation -Recommendation $unguarded -ExpectedAction 'resolve_blockers' -ExpectedStatusState 'Blocked' -ExpectedRequiresHumanAuthorization $true -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Unguarded decision snapshot'
    Assert-ContainsText -Text (@($unguarded.blockers) -join "`n") -Pattern 'RequiresAllowTestDecisionSnapshot' -Message 'Unguarded decision snapshot should require the test-only guard.'
    Assert-NotContainsText -Text ([string]$unguarded.commandPreview) -Pattern 'run-work-package|audit-work-package|commit-work-package' -Message 'Unguarded snapshot should not preserve workflow command previews.'
    Assert-Equal -Actual $unguarded.readiness.validation.available -Expected $false -Message 'Unguarded snapshot should emit deterministic unavailable readiness.'
    Assert-Equal -Actual $unguarded.testExecutionGuidance.requiresSerial -Expected $false -Message 'Unguarded snapshot should emit deterministic standard test guidance.'
    Assert-Equal -Actual $unguarded.operatorHandoff.blocked -Expected $true -Message 'Unguarded snapshot operator handoff should report blocked.'
    Assert-ContainsText -Text ([string]$unguarded.operatorHandoff.stopReason) -Pattern 'manual blocker resolution|RequiresAllowTestDecisionSnapshot' -Message 'Unguarded snapshot operator handoff should explain blocker.'

    $textOutput = & powershell -NoProfile -ExecutionPolicy Bypass -File $managerPath -WorkPackage $plannedFixture.id -SkipUnderstandReadiness 2>&1 | Out-String
    Assert-Equal -Actual $LASTEXITCODE -Expected 0 -Message 'Text manager command should exit 0.'
    Assert-ContainsText -Text $textOutput -Pattern 'SDK manager recommendation:\s*implement' -Message 'Text output missing mapped recommendation.'
    Assert-ContainsText -Text $textOutput -Pattern 'Dry run:\s*True' -Message 'Text output missing dry-run marker.'
    Assert-ContainsText -Text $textOutput -Pattern 'Executed:\s*False' -Message 'Text output missing executed false.'
    Assert-ContainsText -Text $textOutput -Pattern 'Forbidden to execute:\s*True' -Message 'Text output missing forbidden-to-execute marker.'
    Assert-ContainsText -Text $textOutput -Pattern 'Validation readiness:' -Message 'Text output missing validation readiness.'
    Assert-ContainsText -Text $textOutput -Pattern 'Test execution guidance:\s*standard' -Message 'Text output missing standard test guidance.'
    Assert-ContainsText -Text $textOutput -Pattern 'Operator handoff:' -Message 'Text output missing operator handoff.'
    Assert-ContainsText -Text $textOutput -Pattern 'Operator stop reason:.*does not execute workflow commands' -Message 'Text output missing non-executing operator stop reason.'

    $wp233TextOutput = & powershell -NoProfile -ExecutionPolicy Bypass -File $managerPath -WorkPackage WP-233 -SkipUnderstandReadiness 2>&1 | Out-String
    Assert-Equal -Actual $LASTEXITCODE -Expected 0 -Message 'WP-233 text manager command should exit 0.'
    Assert-ContainsText -Text $wp233TextOutput -Pattern 'Validation readiness:' -Message 'WP-233 text output missing validation readiness.'
    Assert-ContainsText -Text $wp233TextOutput -Pattern 'Test execution guidance:\s*run serially' -Message 'WP-233 text output missing serial fixture-test guidance.'
    Assert-ContainsText -Text $wp233TextOutput -Pattern 'Operator handoff:' -Message 'WP-233 text output missing operator handoff.'
    Assert-ContainsText -Text $wp233TextOutput -Pattern 'Operator test execution:\s*run serially' -Message 'WP-233 text output missing operator serial test guidance.'

    $directTextOutput = & powershell -NoProfile -ExecutionPolicy Bypass -File $implementationPath -SkipUnderstandReadiness 2>&1 | Out-String
    Assert-Equal -Actual $LASTEXITCODE -Expected 0 -Message 'Direct implementation text command should exit 0.'
    Assert-ContainsText -Text $directTextOutput -Pattern 'SDK manager recommendation:\s*plan' -Message 'Direct implementation text output missing mapped recommendation.'
    Assert-ContainsText -Text $directTextOutput -Pattern 'Dry run:\s*True' -Message 'Direct implementation text output missing dry-run marker.'
    Assert-ContainsText -Text $directTextOutput -Pattern 'Executed:\s*False' -Message 'Direct implementation text output missing executed false.'
    Assert-ContainsText -Text $directTextOutput -Pattern 'Validation readiness:' -Message 'Direct implementation text output missing validation readiness.'
    Assert-ContainsText -Text $directTextOutput -Pattern 'Test execution guidance:\s*standard' -Message 'Direct implementation text output missing standard guidance.'
    Assert-ContainsText -Text $directTextOutput -Pattern 'Operator handoff:' -Message 'Direct implementation text output missing operator handoff.'

    $afterHashes = Get-FileHashMap
    foreach ($key in $beforeHashes.Keys) {
        Assert-Equal -Actual $afterHashes[$key] -Expected $beforeHashes[$key] -Message "SDK manager recommendation tests modified tracked graph artifact $key."
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

Write-Host 'PASS SDK manager recommendation contract checks'
