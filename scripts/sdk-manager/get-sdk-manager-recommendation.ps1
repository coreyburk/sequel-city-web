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

$implementationRoot = Split-Path -Path $PSCommandPath -Parent
$scriptRoot = Split-Path -Path $implementationRoot -Parent
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

function New-EmptyReadiness {
    return [pscustomobject]@{
        componentParseReadiness = @()
        validation = [pscustomobject]@{
            available = $false
            action = ''
            requiresAction = $false
            reviewRequired = $false
            blocksAuditReadiness = $false
            summary = 'Validation readiness was not available from the decision router.'
        }
    }
}

function New-EmptyTestExecutionGuidance {
    return [pscustomobject]@{
        recommendation = 'standard'
        requiresSerial = $false
        reason = 'Test execution guidance was not available from the decision router.'
        commands = @()
    }
}

function Get-RecommendationReadiness {
    param([object]$Decision)

    if ($null -ne $Decision -and $null -ne $Decision.recommendation -and $null -ne $Decision.recommendation.readiness) {
        return $Decision.recommendation.readiness
    }

    return New-EmptyReadiness
}

function Get-RecommendationTestExecutionGuidance {
    param([object]$Decision)

    if ($null -ne $Decision -and $null -ne $Decision.recommendation -and $null -ne $Decision.recommendation.testExecutionGuidance) {
        return $Decision.recommendation.testExecutionGuidance
    }

    return New-EmptyTestExecutionGuidance
}

function Write-ReadinessAndTestGuidance {
    param(
        [object]$Readiness,
        [object]$TestExecutionGuidance
    )

    if ($null -ne $Readiness -and $null -ne $Readiness.validation) {
        $validation = $Readiness.validation
        Write-Host "Validation readiness: action=$($validation.action); requiresAction=$($validation.requiresAction); reviewRequired=$($validation.reviewRequired); blocksAuditReadiness=$($validation.blocksAuditReadiness)"
    }

    if ($null -ne $TestExecutionGuidance) {
        if ([bool]$TestExecutionGuidance.requiresSerial) {
            Write-Host "Test execution guidance: run serially - $($TestExecutionGuidance.reason)"
        }
        else {
            Write-Host "Test execution guidance: standard - $($TestExecutionGuidance.reason)"
        }
    }
}

function New-OperatorHandoff {
    param(
        [Parameter(Mandatory = $true)][string]$RecommendedAction,
        [AllowEmptyString()][string]$WorkPackageValue,
        [Parameter(Mandatory = $true)][string]$StatusState,
        [AllowEmptyString()][string]$CommandPreviewValue,
        [Parameter(Mandatory = $true)][bool]$RequiresHumanAuthorizationValue,
        [Parameter(Mandatory = $true)][bool]$RequiresExternalAuthorizationValue,
        [string[]]$BlockersValue = @(),
        [object]$ReadinessValue,
        [object]$TestExecutionGuidanceValue
    )

    $blocked = ($BlockersValue.Count -gt 0 -or $RecommendedAction -eq 'resolve_blockers')
    $workPackageDisplay = if ([string]::IsNullOrWhiteSpace($WorkPackageValue)) { 'none' } else { $WorkPackageValue }
    $authorization = @()
    if ($RequiresHumanAuthorizationValue) {
        $authorization += 'human authorization'
    }
    if ($RequiresExternalAuthorizationValue) {
        $authorization += 'external authorization'
    }
    $authorizationText = if ($authorization.Count -gt 0) { $authorization -join ' and ' } else { 'no additional authorization' }

    $stopReason = 'SDK manager is advisory and does not execute workflow commands.'
    if ($blocked) {
        $blockerText = if ($BlockersValue.Count -gt 0) { $BlockersValue -join '; ' } else { 'recommended action is blocker resolution' }
        $stopReason = "Stop for manual blocker resolution: $blockerText. SDK manager is advisory and does not execute workflow commands."
    }
    elseif ($RequiresExternalAuthorizationValue) {
        $stopReason = 'Stop for explicit external authorization before any external audit or data sharing. SDK manager is advisory and does not execute workflow commands.'
    }
    elseif ($RequiresHumanAuthorizationValue) {
        $stopReason = 'Stop for explicit human authorization before the next workflow step. SDK manager is advisory and does not execute workflow commands.'
    }

    $validation = if ($null -ne $ReadinessValue -and $null -ne $ReadinessValue.validation) { $ReadinessValue.validation } else { $null }
    $testGuidance = $TestExecutionGuidanceValue

    return [pscustomobject]@{
        summary = "Next action '$RecommendedAction' for work package '$workPackageDisplay' requires $authorizationText. SDK manager is advisory and does not execute commands."
        nextAction = $RecommendedAction
        workPackage = $WorkPackageValue
        statusState = $StatusState
        requiresHumanAuthorization = $RequiresHumanAuthorizationValue
        requiresExternalAuthorization = $RequiresExternalAuthorizationValue
        blocked = $blocked
        stopReason = $stopReason
        commandPreview = $CommandPreviewValue
        validationReadiness = [pscustomobject]@{
            action = if ($null -ne $validation) { [string]$validation.action } else { '' }
            reviewRequired = if ($null -ne $validation) { [bool]$validation.reviewRequired } else { $false }
            blocksAuditReadiness = if ($null -ne $validation) { [bool]$validation.blocksAuditReadiness } else { $false }
            summary = if ($null -ne $validation) { [string]$validation.summary } else { 'Validation readiness is unavailable.' }
        }
        testExecution = [pscustomobject]@{
            requiresSerial = if ($null -ne $testGuidance) { [bool]$testGuidance.requiresSerial } else { $false }
            reason = if ($null -ne $testGuidance) { [string]$testGuidance.reason } else { 'Test execution guidance is unavailable.' }
            commands = if ($null -ne $testGuidance -and $null -ne $testGuidance.commands) { @($testGuidance.commands) } else { @() }
        }
    }
}

function Write-OperatorHandoff {
    param([object]$OperatorHandoff)

    if ($null -eq $OperatorHandoff) {
        return
    }

    Write-Host "Operator handoff: $($OperatorHandoff.summary)"
    Write-Host "Operator stop reason: $($OperatorHandoff.stopReason)"
    if ($OperatorHandoff.testExecution.requiresSerial) {
        Write-Host "Operator test execution: run serially - $($OperatorHandoff.testExecution.reason)"
    }
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
        $items += [pscustomobject]@{
            source = 'decisionRouter'
            field = 'readiness'
            value = if ($null -ne $Decision.recommendation -and $null -ne $Decision.recommendation.readiness) { 'available' } else { 'unavailable' }
        }
        $items += [pscustomobject]@{
            source = 'decisionRouter'
            field = 'testExecutionGuidance'
            value = if ($null -ne $Decision.recommendation -and $null -ne $Decision.recommendation.testExecutionGuidance) { 'available' } else { 'unavailable' }
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
                readiness = New-EmptyReadiness
                testExecutionGuidance = New-EmptyTestExecutionGuidance
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

$readiness = Get-RecommendationReadiness -Decision $decision
$testExecutionGuidance = Get-RecommendationTestExecutionGuidance -Decision $decision
$workPackageValue = if ($null -ne $decision -and $null -ne $decision.workPackage -and -not [string]::IsNullOrWhiteSpace([string]$decision.workPackage.input)) { [string]$decision.workPackage.input } elseif ([string]::IsNullOrWhiteSpace($WorkPackage)) { '' } else { $WorkPackage }
$statusState = Get-StatusState -Decision $decision
$recommendedAction = ConvertTo-DecisionAction -Action $recommendationAction
$operatorHandoff = New-OperatorHandoff `
    -RecommendedAction $recommendedAction `
    -WorkPackageValue $workPackageValue `
    -StatusState $statusState `
    -CommandPreviewValue $commandPreview `
    -RequiresHumanAuthorizationValue $requiresHumanAuthorization `
    -RequiresExternalAuthorizationValue $requiresExternalAuthorization `
    -BlockersValue @($blockers) `
    -ReadinessValue $readiness `
    -TestExecutionGuidanceValue $testExecutionGuidance

$result = [pscustomobject]@{
    kind = 'sdk_manager_recommendation'
    generatedAt = (Get-Date).ToUniversalTime().ToString('o')
    workPackage = $workPackageValue
    statusState = $statusState
    recommendedAction = $recommendedAction
    commandPreview = $commandPreview
    requiresHumanAuthorization = $requiresHumanAuthorization
    requiresExternalAuthorization = $requiresExternalAuthorization
    forbiddenToExecute = $true
    blockers = @($blockers)
    readiness = $readiness
    testExecutionGuidance = $testExecutionGuidance
    operatorHandoff = $operatorHandoff
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
    Write-ReadinessAndTestGuidance -Readiness $result.readiness -TestExecutionGuidance $result.testExecutionGuidance
    Write-OperatorHandoff -OperatorHandoff $result.operatorHandoff
    if ($result.blockers.Count -gt 0) {
        Write-Host 'Blockers:'
        foreach ($blocker in $result.blockers) {
            Write-Host "  - $blocker"
        }
    }
}

exit 0
