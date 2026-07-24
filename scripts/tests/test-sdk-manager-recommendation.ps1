param()

$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Path $PSScriptRoot -Parent
$repoRoot = Split-Path -Path $scriptRoot -Parent
$managerPath = Join-Path $scriptRoot 'get-sdk-manager-recommendation.ps1'
$wpDirectory = Join-Path $repoRoot 'docs/01-work-packages'
$tempWpPaths = @(
    (Join-Path $wpDirectory 'WP-9981-sdk-manager-planned-temp.md'),
    (Join-Path $wpDirectory 'WP-9982-sdk-manager-implemented-temp.md'),
    (Join-Path $wpDirectory 'WP-9983-sdk-manager-audited-temp.md'),
    (Join-Path $wpDirectory 'WP-9984-sdk-manager-accepted-temp.md'),
    (Join-Path $wpDirectory 'WP-9985-sdk-manager-rejected-temp.md'),
    (Join-Path $wpDirectory 'WP-9986-sdk-manager-deferred-temp.md')
)

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
- docs/05-development-workflow/**
- scripts/**

Do Not Modify:

- apps/**
- database/**
- .understand-anything/**

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
}

if (-not (Test-Path -LiteralPath $managerPath -PathType Leaf)) {
    throw "Missing SDK manager recommendation command: $managerPath"
}

foreach ($tempWpPath in $tempWpPaths) {
    if (Test-Path -LiteralPath $tempWpPath) {
        throw "Temporary fixture path already exists and will not be overwritten: $tempWpPath"
    }
}

$parseErrors = $null
[System.Management.Automation.Language.Parser]::ParseFile($managerPath, [ref]$null, [ref]$parseErrors) | Out-Null
if ($parseErrors -and $parseErrors.Count -gt 0) {
    $formattedErrors = $parseErrors | ForEach-Object { $_.Message } | Out-String
    throw "get-sdk-manager-recommendation.ps1 has parse errors:`n$formattedErrors"
}

try {
    Set-Content -LiteralPath $tempWpPaths[0] -Value (New-SdkManagerWorkPackage -Title 'WP-9981 Planned SDK Manager Fixture') -Encoding UTF8
    Set-Content -LiteralPath $tempWpPaths[1] -Value (New-SdkManagerWorkPackage -Title 'WP-9982 Implemented SDK Manager Fixture' -CodeResults (New-ImplementedCodeResults)) -Encoding UTF8
    Set-Content -LiteralPath $tempWpPaths[2] -Value (New-SdkManagerWorkPackage -Title 'WP-9983 Audited SDK Manager Fixture' -CodeResults (New-ImplementedCodeResults) -AuditResults (New-PassingAuditResults)) -Encoding UTF8
    Set-Content -LiteralPath $tempWpPaths[3] -Value (New-SdkManagerWorkPackage -Title 'WP-9984 Accepted SDK Manager Fixture' -CodeResults (New-ImplementedCodeResults) -AuditResults (New-PassingAuditResults) -FinalDecision 'Accepted after fixture validation.') -Encoding UTF8
    Set-Content -LiteralPath $tempWpPaths[4] -Value (New-SdkManagerWorkPackage -Title 'WP-9985 Rejected SDK Manager Fixture' -FinalDecision 'Rejected after fixture validation.') -Encoding UTF8
    Set-Content -LiteralPath $tempWpPaths[5] -Value (New-SdkManagerWorkPackage -Title 'WP-9986 Deferred SDK Manager Fixture' -FinalDecision 'Deferred after fixture validation.') -Encoding UTF8

    $beforeHashes = Get-FileHashMap

    $repositoryOnly = Invoke-ManagerJson -Arguments @('-SkipUnderstandReadiness')
    Assert-ManagerRecommendation -Recommendation $repositoryOnly -ExpectedAction 'plan' -ExpectedStatusState 'Skipped' -ExpectedRequiresHumanAuthorization $false -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Repository-only'
    Assert-Equal -Actual $repositoryOnly.workPackage -Expected '' -Message 'Repository-only work package should be empty.'
    Assert-ContainsText -Text (@($repositoryOnly.evidence.source) -join "`n") -Pattern 'scripts/get-agentic-workflow-decision\.ps1' -Message 'Repository-only evidence should cite decision router.'

    $realPlanned = Invoke-ManagerJson -Arguments @('-WorkPackage', 'WP-9981', '-SkipUnderstandReadiness')
    Assert-ManagerRecommendation -Recommendation $realPlanned -ExpectedAction 'implement' -ExpectedStatusState 'ReadyForImplementation' -ExpectedRequiresHumanAuthorization $true -ExpectedRequiresExternalAuthorization $false -CommandPattern 'run-work-package\.ps1 WP-9981 -Execute Codex' -MessagePrefix 'Real planned WP'

    $realImplemented = Invoke-ManagerJson -Arguments @('-WorkPackage', 'WP-9982', '-SkipUnderstandReadiness')
    Assert-ManagerRecommendation -Recommendation $realImplemented -ExpectedAction 'audit' -ExpectedStatusState 'ImplementedNeedsAudit' -ExpectedRequiresHumanAuthorization $true -ExpectedRequiresExternalAuthorization $true -CommandPattern 'audit-work-package\.ps1 WP-9982 -AllowExternalAudit' -MessagePrefix 'Real implemented WP'

    $realAudited = Invoke-ManagerJson -Arguments @('-WorkPackage', 'WP-9983', '-SkipUnderstandReadiness')
    Assert-ManagerRecommendation -Recommendation $realAudited -ExpectedAction 'request_human_decision' -ExpectedStatusState 'AuditedNeedsFinalDecision' -ExpectedRequiresHumanAuthorization $true -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Real audited WP'

    $realAccepted = Invoke-ManagerJson -Arguments @('-WorkPackage', 'WP-9984', '-SkipUnderstandReadiness')
    Assert-ManagerRecommendation -Recommendation $realAccepted -ExpectedAction 'finalize' -ExpectedStatusState 'AcceptedReadyForFinalization' -ExpectedRequiresHumanAuthorization $true -ExpectedRequiresExternalAuthorization $false -CommandPattern 'commit-work-package\.ps1 -WorkPackagePath WP-9984 -Preview' -MessagePrefix 'Real accepted WP'

    $realRejected = Invoke-ManagerJson -Arguments @('-WorkPackage', 'WP-9985', '-SkipUnderstandReadiness')
    Assert-ManagerRecommendation -Recommendation $realRejected -ExpectedAction 'no_action' -ExpectedStatusState 'ClosedRejected' -ExpectedRequiresHumanAuthorization $false -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Real rejected WP'

    $realDeferred = Invoke-ManagerJson -Arguments @('-WorkPackage', 'WP-9986', '-SkipUnderstandReadiness')
    Assert-ManagerRecommendation -Recommendation $realDeferred -ExpectedAction 'no_action' -ExpectedStatusState 'ClosedDeferred' -ExpectedRequiresHumanAuthorization $false -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Real deferred WP'

    $realInvalid = Invoke-ManagerJson -Arguments @('-WorkPackage', 'WP-0000-does-not-exist', '-SkipUnderstandReadiness')
    Assert-ManagerRecommendation -Recommendation $realInvalid -ExpectedAction 'resolve_blockers' -ExpectedStatusState 'Unparsed' -ExpectedRequiresHumanAuthorization $true -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Real invalid WP'
    Assert-ContainsText -Text (@($realInvalid.blockers) -join "`n") -Pattern 'workPackageStatus' -Message 'Invalid WP should surface status blocker.'

    $plannedSnapshot = ConvertTo-Base64Text -Text (New-DecisionSnapshotJson -WorkPackage 'WP-9991' -DecisionAction 'ImplementWorkPackage' -OverallState 'Ready' -WorkPackageStatusState 'ReadyForImplementation' -CloseoutState 'ReadyForAudit' -CommandPreview 'scripts/run-work-package.ps1 WP-9991 -Execute Codex')
    $planned = Invoke-ManagerJson -Arguments @('-WorkPackage', 'WP-9991', '-DecisionSnapshotJsonBase64', $plannedSnapshot, '-AllowTestDecisionSnapshot')
    Assert-ManagerRecommendation -Recommendation $planned -ExpectedAction 'implement' -ExpectedStatusState 'ReadyForImplementation' -ExpectedRequiresHumanAuthorization $true -ExpectedRequiresExternalAuthorization $false -CommandPattern 'run-work-package\.ps1 WP-9991 -Execute Codex' -MessagePrefix 'Planned snapshot WP'

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

    $textOutput = & powershell -NoProfile -ExecutionPolicy Bypass -File $managerPath -WorkPackage WP-9981 -SkipUnderstandReadiness 2>&1 | Out-String
    Assert-Equal -Actual $LASTEXITCODE -Expected 0 -Message 'Text manager command should exit 0.'
    Assert-ContainsText -Text $textOutput -Pattern 'SDK manager recommendation:\s*implement' -Message 'Text output missing mapped recommendation.'
    Assert-ContainsText -Text $textOutput -Pattern 'Dry run:\s*True' -Message 'Text output missing dry-run marker.'
    Assert-ContainsText -Text $textOutput -Pattern 'Executed:\s*False' -Message 'Text output missing executed false.'
    Assert-ContainsText -Text $textOutput -Pattern 'Forbidden to execute:\s*True' -Message 'Text output missing forbidden-to-execute marker.'

    $afterHashes = Get-FileHashMap
    foreach ($key in $beforeHashes.Keys) {
        Assert-Equal -Actual $afterHashes[$key] -Expected $beforeHashes[$key] -Message "SDK manager recommendation tests modified tracked graph artifact $key."
    }

    Test-NoUnderstandTransientArtifacts
}
finally {
    foreach ($tempWpPath in $tempWpPaths) {
        if (Test-Path -LiteralPath $tempWpPath) {
            Remove-Item -LiteralPath $tempWpPath -Force
        }
    }
}

Write-Host 'PASS SDK manager recommendation contract checks'
