param()

$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Path $PSScriptRoot -Parent
$repoRoot = Split-Path -Path $scriptRoot -Parent
$decisionPath = Join-Path $scriptRoot 'get-agentic-workflow-decision.ps1'
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

function Assert-Decision {
    param(
        [Parameter(Mandatory = $true)][object]$Decision,
        [Parameter(Mandatory = $true)][string]$ExpectedAction,
        [Parameter(Mandatory = $true)][bool]$ExpectedRequiresHumanDecision,
        [Parameter(Mandatory = $true)][bool]$ExpectedRequiresExternalAuthorization,
        [AllowEmptyString()][string]$CommandPattern = '',
        [string]$MessagePrefix = 'Decision'
    )

    Assert-Equal -Actual $Decision.dryRun -Expected $true -Message "$MessagePrefix dryRun flag mismatch."
    Assert-Equal -Actual $Decision.executed -Expected $false -Message "$MessagePrefix executed flag mismatch."
    Assert-Equal -Actual $Decision.recommendation.action -Expected $ExpectedAction -Message "$MessagePrefix recommendation mismatch."
    Assert-Equal -Actual $Decision.recommendation.requiresHumanDecision -Expected $ExpectedRequiresHumanDecision -Message "$MessagePrefix human-decision flag mismatch."
    Assert-Equal -Actual $Decision.recommendation.requiresExternalAuthorization -Expected $ExpectedRequiresExternalAuthorization -Message "$MessagePrefix external-authorization flag mismatch."

    $commandPreview = [string]$Decision.recommendation.commandPreview
    if ([string]::IsNullOrWhiteSpace($CommandPattern)) {
        Assert-Equal -Actual $commandPreview -Expected '' -Message "$MessagePrefix should not include a command preview."
    }
    else {
        Assert-ContainsText -Text $commandPreview -Pattern $CommandPattern -Message "$MessagePrefix command preview mismatch."
    }
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
        throw '.understand-anything/tmp should not exist after decision-router tests.'
    }

    $trashDirs = @(Get-ChildItem -LiteralPath $understandRoot -Force -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -like '.trash-*' })
    if ($trashDirs.Count -gt 0) {
        throw 'Understand trash directories should not exist after decision-router tests.'
    }

    $logFiles = @(Get-ChildItem -LiteralPath $understandRoot -Force -File -ErrorAction SilentlyContinue | Where-Object { $_.Name -like '*.log' })
    if ($logFiles.Count -gt 0) {
        throw 'Understand log files should not exist after decision-router tests.'
    }
}

function Get-OwnedTempWorkPackagePaths {
    $ownedNamePattern = '^WP-\d{4}-agentic-decision-(planned|implemented|audited|accepted|rejected|deferred)-temp\.md$'
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
        throw "Decision-router temp WP fixtures were not cleaned up: $($remaining -join ', ')"
    }
}

function Invoke-DecisionJson {
    param([string[]]$Arguments)

    $output = & powershell -NoProfile -ExecutionPolicy Bypass -File $decisionPath @Arguments -Json 2>&1 | Out-String
    if ($LASTEXITCODE -ne 0) {
        throw "Decision router should exit 0. Exit code: $LASTEXITCODE Output: $output"
    }

    return ($output | ConvertFrom-Json)
}

function New-MockedStatusSnapshotJson {
    param(
        [Parameter(Mandatory = $true)][string]$WorkPackage,
        [Parameter(Mandatory = $true)][string]$OverallState,
        [Parameter(Mandatory = $true)][string]$WorkPackageStatusState,
        [Parameter(Mandatory = $true)][string]$CloseoutState,
        [string[]]$Blockers = @()
    )

    $snapshot = [pscustomobject]@{
        workPackage = [pscustomobject]@{
            input = $WorkPackage
            available = $true
        }
        components = [pscustomobject]@{
            workPackageStatus = [pscustomobject]@{
                state = $WorkPackageStatusState
            }
            validationPlan = [pscustomobject]@{
                data = [pscustomobject]@{
                    recommendation = [pscustomobject]@{
                        kind = 'validation_plan_recommendation'
                        action = 'run_planned_validation'
                        summary = 'Fixture validation recommendation.'
                        requiresAction = $true
                        reviewRequired = $false
                        blocksAuditReadiness = $false
                        commandsToRun = @('powershell -NoProfile -ExecutionPolicy Bypass -File scripts/tests/test-agentic-workflow-decision.ps1')
                        evidenceToReview = @()
                        missingFindings = @()
                        noAutomatedValidationExplained = $false
                    }
                }
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

    return ($snapshot | ConvertTo-Json -Depth 8 -Compress)
}

function ConvertTo-Base64Text {
    param([Parameter(Mandatory = $true)][string]$Text)

    return [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($Text))
}

function New-DecisionRouterWorkPackage {
    param(
        [string]$Title = 'Temporary Agentic Decision Router Test Work Package',
        [string]$CodeResults = 'Pending implementation.',
        [string]$AuditResults = 'Pending audit.',
        [string]$FinalDecision = 'Pending human acceptance.'
    )

    return @"
# $Title

## Objective

Validate decision routing for a temporary work package.

## Scope

### In Scope

- Temporary decision-router validation.

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
- User workflows: decision-router checking.
- Security/data boundaries: no runtime changes.

### Graph Update Decision
- Regeneration required: No.
- Rationale: Fixture-only validation.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/**
- docs/05-development-workflow/**
- scripts/**

Do Not Modify:

- apps/**
- database/**
- .understand-anything/**

## Constraints

- No runtime changes.

## Required Behavior

- Report the correct decision-router state.

## Acceptance Criteria

- [ ] Decision routing is classified correctly.

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

- PASS: temporary decision-router fixture validation
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
            $path = Join-Path $wpDirectory "$id-agentic-decision-$route-temp.md"

            $candidateFixtures += [pscustomobject]@{
                route = $route
                number = $number
                id = $id
                path = $path
                title = "$id $($route.Substring(0, 1).ToUpperInvariant())$($route.Substring(1)) Decision Router Fixture"
            }
            $candidatePaths += $path
        }

        $collisions = @($candidatePaths | Where-Object { Test-Path -LiteralPath $_ })
        if ($collisions.Count -eq 0) {
            return @($candidateFixtures)
        }
    }

    throw 'Unable to allocate collision-free temporary decision-router WP fixtures after 100 attempts.'
}

function Get-FixtureByRoute {
    param(
        [Parameter(Mandatory = $true)][object[]]$Fixtures,
        [Parameter(Mandatory = $true)][string]$Route
    )

    $fixture = @($Fixtures | Where-Object { $_.route -eq $Route })
    if ($fixture.Count -ne 1) {
        throw "Expected exactly one decision-router fixture for route '$Route' but found $($fixture.Count)."
    }

    return $fixture[0]
}

if (-not (Test-Path -LiteralPath $decisionPath -PathType Leaf)) {
    throw "Missing decision router script: $decisionPath"
}

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
[System.Management.Automation.Language.Parser]::ParseFile($decisionPath, [ref]$null, [ref]$parseErrors) | Out-Null
if ($parseErrors -and $parseErrors.Count -gt 0) {
    $formattedErrors = $parseErrors | ForEach-Object { $_.Message } | Out-String
    throw "get-agentic-workflow-decision.ps1 has parse errors:`n$formattedErrors"
}

$testFailure = $null
try {
    $plannedFixture = Get-FixtureByRoute -Fixtures $tempFixtures -Route 'planned'
    $implementedFixture = Get-FixtureByRoute -Fixtures $tempFixtures -Route 'implemented'
    $auditedFixture = Get-FixtureByRoute -Fixtures $tempFixtures -Route 'audited'
    $acceptedFixture = Get-FixtureByRoute -Fixtures $tempFixtures -Route 'accepted'
    $rejectedFixture = Get-FixtureByRoute -Fixtures $tempFixtures -Route 'rejected'
    $deferredFixture = Get-FixtureByRoute -Fixtures $tempFixtures -Route 'deferred'

    Set-Content -LiteralPath $plannedFixture.path -Value (New-DecisionRouterWorkPackage -Title $plannedFixture.title) -Encoding UTF8
    Set-Content -LiteralPath $implementedFixture.path -Value (New-DecisionRouterWorkPackage -Title $implementedFixture.title -CodeResults (New-ImplementedCodeResults)) -Encoding UTF8
    Set-Content -LiteralPath $auditedFixture.path -Value (New-DecisionRouterWorkPackage -Title $auditedFixture.title -CodeResults (New-ImplementedCodeResults) -AuditResults (New-PassingAuditResults)) -Encoding UTF8
    Set-Content -LiteralPath $acceptedFixture.path -Value (New-DecisionRouterWorkPackage -Title $acceptedFixture.title -CodeResults (New-ImplementedCodeResults) -AuditResults (New-PassingAuditResults) -FinalDecision 'Accepted after fixture validation.') -Encoding UTF8
    Set-Content -LiteralPath $rejectedFixture.path -Value (New-DecisionRouterWorkPackage -Title $rejectedFixture.title -FinalDecision 'Rejected after fixture validation.') -Encoding UTF8
    Set-Content -LiteralPath $deferredFixture.path -Value (New-DecisionRouterWorkPackage -Title $deferredFixture.title -FinalDecision 'Deferred after fixture validation.') -Encoding UTF8

    $beforeHashes = Get-FileHashMap

    $repositoryOnly = Invoke-DecisionJson -Arguments @('-SkipUnderstandReadiness')
    Assert-HasProperty -Object $repositoryOnly -Name 'generatedAt' -Message 'JSON output missing generatedAt.'
    Assert-HasProperty -Object $repositoryOnly -Name 'dryRun' -Message 'JSON output missing dryRun.'
    Assert-HasProperty -Object $repositoryOnly -Name 'executed' -Message 'JSON output missing executed.'
    Assert-HasProperty -Object $repositoryOnly -Name 'workPackage' -Message 'JSON output missing workPackage.'
    Assert-HasProperty -Object $repositoryOnly -Name 'status' -Message 'JSON output missing status.'
    Assert-HasProperty -Object $repositoryOnly -Name 'recommendation' -Message 'JSON output missing recommendation.'
    Assert-HasProperty -Object $repositoryOnly -Name 'statusSnapshot' -Message 'JSON output missing statusSnapshot.'
    Assert-Decision -Decision $repositoryOnly -ExpectedAction 'ProvideWorkPackage' -ExpectedRequiresHumanDecision $false -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Repository-only'

    $plannedWp = Invoke-DecisionJson -Arguments @('-WorkPackage', $plannedFixture.id, '-SkipUnderstandReadiness')
    Assert-Equal -Actual $plannedWp.workPackage.input -Expected $plannedFixture.id -Message 'Planned WP input mismatch.'
    Assert-Decision -Decision $plannedWp -ExpectedAction 'ImplementWorkPackage' -ExpectedRequiresHumanDecision $true -ExpectedRequiresExternalAuthorization $false -CommandPattern "run-work-package\.ps1 $($plannedFixture.id) -Execute Codex" -MessagePrefix 'Planned WP'
    Assert-Equal -Actual $plannedWp.statusSnapshot.components.workPackageStatus.state -Expected 'ReadyForImplementation' -Message 'Planned WP status snapshot state mismatch.'
    Assert-Equal -Actual $plannedWp.recommendation.validationPlan.kind -Expected 'validation_plan_recommendation' -Message 'Planned WP decision missing validation recommendation.'
    Assert-Equal -Actual $plannedWp.recommendation.validationPlan.action -Expected $plannedWp.statusSnapshot.validationRecommendation.action -Message 'Planned WP decision should pass through status validation recommendation.'

    $textOutput = & powershell -NoProfile -ExecutionPolicy Bypass -File $decisionPath -WorkPackage $plannedFixture.id -SkipUnderstandReadiness 2>&1 | Out-String
    Assert-Equal -Actual $LASTEXITCODE -Expected 0 -Message 'Text decision router should exit 0.'
    Assert-ContainsText -Text $textOutput -Pattern 'Agentic workflow decision:\s*ImplementWorkPackage' -Message 'Text output missing recommendation.'
    Assert-ContainsText -Text $textOutput -Pattern 'Executed:\s*False' -Message 'Text output missing executed false.'
    Assert-ContainsText -Text $textOutput -Pattern 'Command preview:' -Message 'Text output missing command preview.'

    $implementedWp = Invoke-DecisionJson -Arguments @('-WorkPackage', $implementedFixture.id, '-SkipUnderstandReadiness')
    Assert-Decision -Decision $implementedWp -ExpectedAction 'RequestIndependentAudit' -ExpectedRequiresHumanDecision $true -ExpectedRequiresExternalAuthorization $true -CommandPattern "audit-work-package\.ps1 $($implementedFixture.id) -AllowExternalAudit" -MessagePrefix 'Implemented WP'

    $auditedWp = Invoke-DecisionJson -Arguments @('-WorkPackage', $auditedFixture.id, '-SkipUnderstandReadiness')
    Assert-Decision -Decision $auditedWp -ExpectedAction 'RequestHumanFinalDecision' -ExpectedRequiresHumanDecision $true -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Audited WP'

    $acceptedWp = Invoke-DecisionJson -Arguments @('-WorkPackage', $acceptedFixture.id, '-SkipUnderstandReadiness')
    Assert-Decision -Decision $acceptedWp -ExpectedAction 'FinalizeAcceptedWorkPackage' -ExpectedRequiresHumanDecision $true -ExpectedRequiresExternalAuthorization $false -CommandPattern "commit-work-package\.ps1 -WorkPackagePath $($acceptedFixture.id) -Preview" -MessagePrefix 'Accepted WP'

    $rejectedWp = Invoke-DecisionJson -Arguments @('-WorkPackage', $rejectedFixture.id, '-SkipUnderstandReadiness')
    Assert-Decision -Decision $rejectedWp -ExpectedAction 'NoActionClosed' -ExpectedRequiresHumanDecision $false -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Rejected WP'
    Assert-ContainsText -Text $rejectedWp.recommendation.reason -Pattern 'ClosedRejected' -Message 'Rejected WP reason should name ClosedRejected.'

    $deferredWp = Invoke-DecisionJson -Arguments @('-WorkPackage', $deferredFixture.id, '-SkipUnderstandReadiness')
    Assert-Decision -Decision $deferredWp -ExpectedAction 'NoActionClosed' -ExpectedRequiresHumanDecision $false -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Deferred WP'
    Assert-ContainsText -Text $deferredWp.recommendation.reason -Pattern 'ClosedDeferred' -Message 'Deferred WP reason should name ClosedDeferred.'

    $blockedSnapshot = ConvertTo-Base64Text -Text (New-MockedStatusSnapshotJson -WorkPackage 'WP-9998' -OverallState 'Blocked' -WorkPackageStatusState 'BlockedMixedWorktree' -CloseoutState 'Blocked' -Blockers @('workPackageStatus: BlockedMixedWorktree', 'closeoutPreflight: Blocked'))
    $unguardedSnapshot = Invoke-DecisionJson -Arguments @('-WorkPackage', 'WP-9998', '-StatusSnapshotJsonBase64', $blockedSnapshot)
    Assert-Decision -Decision $unguardedSnapshot -ExpectedAction 'ResolveBlockers' -ExpectedRequiresHumanDecision $true -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Unguarded mocked snapshot'
    Assert-ContainsText -Text (@($unguardedSnapshot.recommendation.blockers) -join "`n") -Pattern 'RequiresAllowTestStatusSnapshot' -Message 'Unguarded mocked snapshot should require the test-only guard.'
    Assert-NotContainsText -Text ([string]$unguardedSnapshot.recommendation.commandPreview) -Pattern 'run-work-package|audit-work-package|commit-work-package' -Message 'Unguarded mocked snapshot should not preview workflow execution commands.'

    $blockedWp = Invoke-DecisionJson -Arguments @('-WorkPackage', 'WP-9998', '-StatusSnapshotJsonBase64', $blockedSnapshot, '-AllowTestStatusSnapshot')
    Assert-Decision -Decision $blockedWp -ExpectedAction 'ResolveBlockers' -ExpectedRequiresHumanDecision $true -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Blocked WP'
    Assert-ContainsText -Text (@($blockedWp.recommendation.blockers) -join "`n") -Pattern 'BlockedMixedWorktree' -Message 'Blocked WP should surface mixed-worktree blocker.'
    Assert-NotContainsText -Text ([string]$blockedWp.recommendation.commandPreview) -Pattern 'run-work-package|audit-work-package|commit-work-package' -Message 'Blocked WP should not preview workflow execution commands.'
    Assert-Equal -Actual $blockedWp.recommendation.validationPlan.action -Expected 'run_planned_validation' -Message 'Blocked WP should preserve validation recommendation from guarded snapshot.'

    $manualSnapshot = ConvertTo-Base64Text -Text (New-MockedStatusSnapshotJson -WorkPackage 'WP-9999' -OverallState 'Ready' -WorkPackageStatusState 'UnexpectedLifecycleState' -CloseoutState 'UnexpectedCloseoutState')
    $manualWp = Invoke-DecisionJson -Arguments @('-WorkPackage', 'WP-9999', '-StatusSnapshotJsonBase64', $manualSnapshot, '-AllowTestStatusSnapshot')
    Assert-Decision -Decision $manualWp -ExpectedAction 'ManualReview' -ExpectedRequiresHumanDecision $true -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Manual-review WP'
    Assert-ContainsText -Text $manualWp.recommendation.reason -Pattern 'UnexpectedLifecycleState' -Message 'Manual-review reason should include unsupported status state.'

    $invalidWp = Invoke-DecisionJson -Arguments @('-WorkPackage', 'WP-0000-does-not-exist', '-SkipUnderstandReadiness')
    Assert-Decision -Decision $invalidWp -ExpectedAction 'ResolveBlockers' -ExpectedRequiresHumanDecision $true -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Invalid WP'
    Assert-ContainsText -Text (@($invalidWp.recommendation.blockers) -join "`n") -Pattern 'workPackageStatus' -Message 'Invalid WP blockers should include status component.'

    $afterHashes = Get-FileHashMap
    foreach ($key in $beforeHashes.Keys) {
        Assert-Equal -Actual $afterHashes[$key] -Expected $beforeHashes[$key] -Message "Decision router modified tracked graph artifact $key."
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

Write-Host 'PASS agentic workflow decision-router fixture matrix checks'
