param()

$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Path $PSScriptRoot -Parent
$managerPath = Join-Path $scriptRoot 'get-sdk-manager-recommendation.ps1'

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

$parseErrors = $null
[System.Management.Automation.Language.Parser]::ParseFile($managerPath, [ref]$null, [ref]$parseErrors) | Out-Null
if ($parseErrors -and $parseErrors.Count -gt 0) {
    $formattedErrors = $parseErrors | ForEach-Object { $_.Message } | Out-String
    throw "get-sdk-manager-recommendation.ps1 has parse errors:`n$formattedErrors"
}

$repositoryOnly = Invoke-ManagerJson -Arguments @('-SkipUnderstandReadiness')
Assert-ManagerRecommendation -Recommendation $repositoryOnly -ExpectedAction 'plan' -ExpectedStatusState 'Skipped' -ExpectedRequiresHumanAuthorization $false -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Repository-only'
Assert-Equal -Actual $repositoryOnly.workPackage -Expected '' -Message 'Repository-only work package should be empty.'

$plannedSnapshot = ConvertTo-Base64Text -Text (New-DecisionSnapshotJson -WorkPackage 'WP-9991' -DecisionAction 'ImplementWorkPackage' -OverallState 'Ready' -WorkPackageStatusState 'ReadyForImplementation' -CloseoutState 'ReadyForAudit' -CommandPreview 'scripts/run-work-package.ps1 WP-9991 -Execute Codex')
$planned = Invoke-ManagerJson -Arguments @('-WorkPackage', 'WP-9991', '-DecisionSnapshotJsonBase64', $plannedSnapshot, '-AllowTestDecisionSnapshot')
Assert-ManagerRecommendation -Recommendation $planned -ExpectedAction 'implement' -ExpectedStatusState 'ReadyForImplementation' -ExpectedRequiresHumanAuthorization $true -ExpectedRequiresExternalAuthorization $false -CommandPattern 'run-work-package\.ps1 WP-9991 -Execute Codex' -MessagePrefix 'Planned WP'

$implementedSnapshot = ConvertTo-Base64Text -Text (New-DecisionSnapshotJson -WorkPackage 'WP-9992' -DecisionAction 'RequestIndependentAudit' -OverallState 'Ready' -WorkPackageStatusState 'ImplementedNeedsAudit' -CloseoutState 'ReadyForAudit' -RequiresExternalAuthorization $true -CommandPreview 'scripts/audit-work-package.ps1 WP-9992 -AllowExternalAudit')
$implemented = Invoke-ManagerJson -Arguments @('-WorkPackage', 'WP-9992', '-DecisionSnapshotJsonBase64', $implementedSnapshot, '-AllowTestDecisionSnapshot')
Assert-ManagerRecommendation -Recommendation $implemented -ExpectedAction 'audit' -ExpectedStatusState 'ImplementedNeedsAudit' -ExpectedRequiresHumanAuthorization $true -ExpectedRequiresExternalAuthorization $true -CommandPattern 'audit-work-package\.ps1 WP-9992 -AllowExternalAudit' -MessagePrefix 'Implemented WP'

$auditedSnapshot = ConvertTo-Base64Text -Text (New-DecisionSnapshotJson -WorkPackage 'WP-9993' -DecisionAction 'RequestHumanFinalDecision' -OverallState 'Ready' -WorkPackageStatusState 'AuditedNeedsFinalDecision' -CloseoutState 'ReadyForAcceptance')
$audited = Invoke-ManagerJson -Arguments @('-WorkPackage', 'WP-9993', '-DecisionSnapshotJsonBase64', $auditedSnapshot, '-AllowTestDecisionSnapshot')
Assert-ManagerRecommendation -Recommendation $audited -ExpectedAction 'request_human_decision' -ExpectedStatusState 'AuditedNeedsFinalDecision' -ExpectedRequiresHumanAuthorization $true -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Audited WP'

$acceptedSnapshot = ConvertTo-Base64Text -Text (New-DecisionSnapshotJson -WorkPackage 'WP-9994' -DecisionAction 'FinalizeAcceptedWorkPackage' -OverallState 'Ready' -WorkPackageStatusState 'AcceptedReadyForFinalization' -CloseoutState 'ReadyForFinalization' -CommandPreview 'scripts/commit-work-package.ps1 -WorkPackagePath WP-9994 -Preview')
$accepted = Invoke-ManagerJson -Arguments @('-WorkPackage', 'WP-9994', '-DecisionSnapshotJsonBase64', $acceptedSnapshot, '-AllowTestDecisionSnapshot')
Assert-ManagerRecommendation -Recommendation $accepted -ExpectedAction 'finalize' -ExpectedStatusState 'AcceptedReadyForFinalization' -ExpectedRequiresHumanAuthorization $true -ExpectedRequiresExternalAuthorization $false -CommandPattern 'commit-work-package\.ps1 -WorkPackagePath WP-9994 -Preview' -MessagePrefix 'Accepted WP'

$blockedSnapshot = ConvertTo-Base64Text -Text (New-DecisionSnapshotJson -WorkPackage 'WP-9995' -DecisionAction 'ResolveBlockers' -OverallState 'Blocked' -WorkPackageStatusState 'BlockedMixedWorktree' -CloseoutState 'Blocked' -Blockers @('workPackageStatus: BlockedMixedWorktree', 'closeoutPreflight: Blocked'))
$blocked = Invoke-ManagerJson -Arguments @('-WorkPackage', 'WP-9995', '-DecisionSnapshotJsonBase64', $blockedSnapshot, '-AllowTestDecisionSnapshot')
Assert-ManagerRecommendation -Recommendation $blocked -ExpectedAction 'resolve_blockers' -ExpectedStatusState 'BlockedMixedWorktree' -ExpectedRequiresHumanAuthorization $true -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Blocked WP'
Assert-ContainsText -Text (@($blocked.blockers) -join "`n") -Pattern 'BlockedMixedWorktree' -Message 'Blocked WP should surface mixed-worktree blocker.'

$closedSnapshot = ConvertTo-Base64Text -Text (New-DecisionSnapshotJson -WorkPackage 'WP-9996' -DecisionAction 'NoActionClosed' -OverallState 'Ready' -WorkPackageStatusState 'ClosedRejected' -CloseoutState 'Blocked' -RequiresHumanDecision $false)
$closed = Invoke-ManagerJson -Arguments @('-WorkPackage', 'WP-9996', '-DecisionSnapshotJsonBase64', $closedSnapshot, '-AllowTestDecisionSnapshot')
Assert-ManagerRecommendation -Recommendation $closed -ExpectedAction 'no_action' -ExpectedStatusState 'ClosedRejected' -ExpectedRequiresHumanAuthorization $false -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Closed WP'

$manualSnapshot = ConvertTo-Base64Text -Text (New-DecisionSnapshotJson -WorkPackage 'WP-9997' -DecisionAction 'ManualReview' -OverallState 'Ready' -WorkPackageStatusState 'UnexpectedLifecycleState' -CloseoutState 'UnexpectedCloseoutState')
$manual = Invoke-ManagerJson -Arguments @('-WorkPackage', 'WP-9997', '-DecisionSnapshotJsonBase64', $manualSnapshot, '-AllowTestDecisionSnapshot')
Assert-ManagerRecommendation -Recommendation $manual -ExpectedAction 'manual_review' -ExpectedStatusState 'UnexpectedLifecycleState' -ExpectedRequiresHumanAuthorization $true -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Manual-review WP'

$unknownSnapshot = ConvertTo-Base64Text -Text (New-DecisionSnapshotJson -WorkPackage 'WP-9998' -DecisionAction 'UnexpectedDecisionAction' -OverallState 'Ready' -WorkPackageStatusState 'UnexpectedLifecycleState' -CloseoutState 'UnexpectedCloseoutState')
$unknown = Invoke-ManagerJson -Arguments @('-WorkPackage', 'WP-9998', '-DecisionSnapshotJsonBase64', $unknownSnapshot, '-AllowTestDecisionSnapshot')
Assert-ManagerRecommendation -Recommendation $unknown -ExpectedAction 'manual_review' -ExpectedStatusState 'UnexpectedLifecycleState' -ExpectedRequiresHumanAuthorization $true -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Unknown-action WP'
Assert-Equal -Actual $unknown.source.decisionAction -Expected 'UnexpectedDecisionAction' -Message 'Unknown action should be preserved in source metadata.'

$unguarded = Invoke-ManagerJson -Arguments @('-WorkPackage', 'WP-9999', '-DecisionSnapshotJsonBase64', $plannedSnapshot)
Assert-ManagerRecommendation -Recommendation $unguarded -ExpectedAction 'resolve_blockers' -ExpectedStatusState 'Blocked' -ExpectedRequiresHumanAuthorization $true -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Unguarded decision snapshot'
Assert-ContainsText -Text (@($unguarded.blockers) -join "`n") -Pattern 'RequiresAllowTestDecisionSnapshot' -Message 'Unguarded decision snapshot should require the test-only guard.'
Assert-NotContainsText -Text ([string]$unguarded.commandPreview) -Pattern 'run-work-package|audit-work-package|commit-work-package' -Message 'Unguarded snapshot should not preserve workflow command previews.'

$textOutput = & powershell -NoProfile -ExecutionPolicy Bypass -File $managerPath -WorkPackage WP-9991 -DecisionSnapshotJsonBase64 $plannedSnapshot -AllowTestDecisionSnapshot 2>&1 | Out-String
Assert-Equal -Actual $LASTEXITCODE -Expected 0 -Message 'Text manager command should exit 0.'
Assert-ContainsText -Text $textOutput -Pattern 'SDK manager recommendation:\s*implement' -Message 'Text output missing mapped recommendation.'
Assert-ContainsText -Text $textOutput -Pattern 'Dry run:\s*True' -Message 'Text output missing dry-run marker.'
Assert-ContainsText -Text $textOutput -Pattern 'Executed:\s*False' -Message 'Text output missing executed false.'
Assert-ContainsText -Text $textOutput -Pattern 'Forbidden to execute:\s*True' -Message 'Text output missing forbidden-to-execute marker.'

Write-Host 'PASS SDK manager recommendation contract checks'
