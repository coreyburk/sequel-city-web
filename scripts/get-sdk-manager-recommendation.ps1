[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [Alias("Name", "Task", "Id")]
    [string]$WorkPackage,

    [switch]$Json,

    [switch]$SkipUnderstandReadiness,

    [switch]$AllowTestDecisionSnapshot,

    [string]$DecisionSnapshotJson,

    [string]$DecisionSnapshotJsonBase64
)

$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Path $PSCommandPath -Parent
$decisionScriptPath = Join-Path $scriptRoot 'get-agentic-workflow-decision.ps1'

function Invoke-DecisionRouter {
    $arguments = @(
        '-NoProfile',
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        $decisionScriptPath,
        '-Json'
    )

    if (-not [string]::IsNullOrWhiteSpace($WorkPackage)) {
        $arguments += @('-WorkPackage', $WorkPackage)
    }

    if ($SkipUnderstandReadiness) {
        $arguments += '-SkipUnderstandReadiness'
    }

    $previousErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        $output = & powershell @arguments 2>&1 | Out-String
        $exitCode = $LASTEXITCODE
    }
    finally {
        $ErrorActionPreference = $previousErrorActionPreference
    }

    $parsed = $null
    $parseSucceeded = $false
    if (-not [string]::IsNullOrWhiteSpace($output)) {
        try {
            $parsed = $output | ConvertFrom-Json
            $parseSucceeded = $true
        }
        catch {
            $parseSucceeded = $false
        }
    }

    return [pscustomobject]@{
        exitCode = $exitCode
        parseSucceeded = $parseSucceeded
        data = $parsed
        rawOutput = $output.Trim()
    }
}

function ConvertTo-DecisionAction {
    param([AllowEmptyString()][string]$Action)

    switch ($Action) {
        'ProvideWorkPackage' { return 'plan' }
        'ImplementWorkPackage' { return 'implement' }
        'RequestIndependentAudit' { return 'audit' }
        'RequestHumanFinalDecision' { return 'request_human_decision' }
        'FinalizeAcceptedWorkPackage' { return 'finalize' }
        'ResolveBlockers' { return 'resolve_blockers' }
        'NoActionClosed' { return 'no_action' }
        'ManualReview' { return 'manual_review' }
        default { return 'manual_review' }
    }
}

function Get-ComponentState {
    param(
        [object]$Decision,
        [string]$ComponentName
    )

    if ($null -eq $Decision -or $null -eq $Decision.statusSnapshot -or $null -eq $Decision.statusSnapshot.components) {
        return ''
    }

    $property = $Decision.statusSnapshot.components.PSObject.Properties[$ComponentName]
    if ($null -eq $property -or $null -eq $property.Value) {
        return ''
    }

    return [string]$property.Value.state
}

function Get-StatusState {
    param([object]$Decision)

    $workPackageState = Get-ComponentState -Decision $Decision -ComponentName 'workPackageStatus'
    if (-not [string]::IsNullOrWhiteSpace($workPackageState)) {
        return $workPackageState
    }

    if ($null -ne $Decision -and $null -ne $Decision.status -and -not [string]::IsNullOrWhiteSpace([string]$Decision.status.overallState)) {
        return [string]$Decision.status.overallState
    }

    return 'Unknown'
}

function New-Evidence {
    param(
        [object]$Decision,
        [object]$DecisionCapture
    )

    $items = @(
        [pscustomobject]@{
            source = 'scripts/get-agentic-workflow-decision.ps1'
            field = 'exitCode'
            value = $DecisionCapture.exitCode
        },
        [pscustomobject]@{
            source = 'scripts/get-agentic-workflow-decision.ps1'
            field = 'parseSucceeded'
            value = $DecisionCapture.parseSucceeded
        }
    )

    if ($null -ne $Decision) {
        $items += [pscustomobject]@{
            source = 'decisionRouter'
            field = 'action'
            value = if ($null -ne $Decision.recommendation) { [string]$Decision.recommendation.action } else { '' }
        }
        $items += [pscustomobject]@{
            source = 'decisionRouter'
            field = 'reason'
            value = if ($null -ne $Decision.recommendation) { [string]$Decision.recommendation.reason } else { '' }
        }
        $items += [pscustomobject]@{
            source = 'statusBundle'
            field = 'overallState'
            value = if ($null -ne $Decision.status) { [string]$Decision.status.overallState } else { '' }
        }
        $items += [pscustomobject]@{
            source = 'statusBundle'
            field = 'workPackageStatus'
            value = Get-ComponentState -Decision $Decision -ComponentName 'workPackageStatus'
        }
        $items += [pscustomobject]@{
            source = 'statusBundle'
            field = 'closeoutPreflight'
            value = Get-ComponentState -Decision $Decision -ComponentName 'closeoutPreflight'
        }
    }

    return @($items)
}

function New-BlockedDecisionCapture {
    param(
        [Parameter(Mandatory = $true)][string]$Blocker,
        [Parameter(Mandatory = $true)][string]$Reason
    )

    return [pscustomobject]@{
        exitCode = 0
        parseSucceeded = $true
        data = [pscustomobject]@{
            generatedAt = (Get-Date).ToUniversalTime().ToString('o')
            dryRun = $true
            executed = $false
            workPackage = [pscustomobject]@{
                input = if ([string]::IsNullOrWhiteSpace($WorkPackage)) { '' } else { $WorkPackage }
            }
            status = [pscustomobject]@{
                statusBundleExitCode = 0
                statusBundleParseSucceeded = $true
                overallState = 'Blocked'
            }
            recommendation = [pscustomobject]@{
                action = 'ResolveBlockers'
                commandPreview = ''
                requiresHumanDecision = $true
                requiresExternalAuthorization = $false
                reason = $Reason
                blockers = @($Blocker)
            }
            statusSnapshot = $null
        }
        rawOutput = ''
    }
}

$decisionSnapshotSupplied = (
    -not [string]::IsNullOrWhiteSpace($DecisionSnapshotJson) -or
    -not [string]::IsNullOrWhiteSpace($DecisionSnapshotJsonBase64)
)

if ($decisionSnapshotSupplied -and -not $AllowTestDecisionSnapshot) {
    $decisionCapture = New-BlockedDecisionCapture `
        -Blocker 'testDecisionSnapshot: RequiresAllowTestDecisionSnapshot' `
        -Reason 'Decision snapshot input is test-only and requires the explicit guard.'
}
elseif ($decisionSnapshotSupplied) {
    $decisionSnapshotText = $DecisionSnapshotJson
    if (-not [string]::IsNullOrWhiteSpace($DecisionSnapshotJsonBase64)) {
        try {
            $decisionSnapshotText = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($DecisionSnapshotJsonBase64))
        }
        catch {
            $decisionSnapshotText = ''
        }
    }

    try {
        $decisionCapture = [pscustomobject]@{
            exitCode = 0
            parseSucceeded = $true
            data = ($decisionSnapshotText | ConvertFrom-Json)
            rawOutput = ''
        }
    }
    catch {
        $decisionCapture = New-BlockedDecisionCapture `
            -Blocker 'decisionSnapshot: Unparsed' `
            -Reason 'The supplied test decision snapshot was not parseable JSON.'
    }
}
else {
    $decisionCapture = Invoke-DecisionRouter
}

if (-not $decisionCapture.parseSucceeded) {
    $decision = $null
    $recommendationAction = 'ResolveBlockers'
    $commandPreview = ''
    $requiresHumanAuthorization = $true
    $requiresExternalAuthorization = $false
    $blockers = @('decisionRouter: Unparsed')
}
else {
    $decision = $decisionCapture.data
    $recommendationAction = if ($null -ne $decision.recommendation) { [string]$decision.recommendation.action } else { '' }
    $commandPreview = if ($null -ne $decision.recommendation) { [string]$decision.recommendation.commandPreview } else { '' }
    $requiresHumanAuthorization = if ($null -ne $decision.recommendation) { [bool]$decision.recommendation.requiresHumanDecision } else { $true }
    $requiresExternalAuthorization = if ($null -ne $decision.recommendation) { [bool]$decision.recommendation.requiresExternalAuthorization } else { $false }
    $blockers = if ($null -ne $decision.recommendation -and $null -ne $decision.recommendation.blockers) { @($decision.recommendation.blockers) } else { @() }
}

$result = [pscustomobject]@{
    kind = 'sdk_manager_recommendation'
    generatedAt = (Get-Date).ToUniversalTime().ToString('o')
    workPackage = if ($null -ne $decision -and $null -ne $decision.workPackage -and -not [string]::IsNullOrWhiteSpace([string]$decision.workPackage.input)) { [string]$decision.workPackage.input } elseif ([string]::IsNullOrWhiteSpace($WorkPackage)) { '' } else { $WorkPackage }
    statusState = Get-StatusState -Decision $decision
    recommendedAction = ConvertTo-DecisionAction -Action $recommendationAction
    commandPreview = $commandPreview
    requiresHumanAuthorization = $requiresHumanAuthorization
    requiresExternalAuthorization = $requiresExternalAuthorization
    forbiddenToExecute = $true
    blockers = @($blockers)
    evidence = New-Evidence -Decision $decision -DecisionCapture $decisionCapture
    source = [pscustomobject]@{
        decisionAction = $recommendationAction
        dryRun = if ($null -ne $decision) { [bool]$decision.dryRun } else { $true }
        executed = if ($null -ne $decision) { [bool]$decision.executed } else { $false }
        statusBundleExitCode = if ($null -ne $decision -and $null -ne $decision.status) { $decision.status.statusBundleExitCode } else { $null }
        statusBundleParseSucceeded = if ($null -ne $decision -and $null -ne $decision.status) { $decision.status.statusBundleParseSucceeded } else { $null }
    }
}

if ($Json) {
    $result | ConvertTo-Json -Depth 14
}
else {
    Write-Host "SDK manager recommendation: $($result.recommendedAction)"
    Write-Host 'Dry run: True'
    Write-Host 'Executed: False'
    Write-Host "Forbidden to execute: $($result.forbiddenToExecute)"
    Write-Host "Work package: $(if ([string]::IsNullOrWhiteSpace($result.workPackage)) { 'none' } else { $result.workPackage })"
    Write-Host "Status state: $($result.statusState)"
    if (-not [string]::IsNullOrWhiteSpace($result.commandPreview)) {
        Write-Host "Command preview: $($result.commandPreview)"
    }
    Write-Host "Requires human authorization: $($result.requiresHumanAuthorization)"
    Write-Host "Requires external authorization: $($result.requiresExternalAuthorization)"
    if ($result.blockers.Count -gt 0) {
        Write-Host 'Blockers:'
        foreach ($blocker in $result.blockers) {
            Write-Host "  - $blocker"
        }
    }
}

exit 0
