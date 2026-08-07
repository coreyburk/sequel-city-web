[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [Alias("Name", "Task", "Id")]
    [string]$WorkPackage,

    [switch]$Json,

    [switch]$SkipUnderstandReadiness
)

$ErrorActionPreference = 'Stop'

$implementationRoot = Split-Path -Path $PSCommandPath -Parent
$scriptRoot = Split-Path -Path $implementationRoot -Parent
$recommendationScriptPath = Join-Path $scriptRoot 'get-sdk-manager-recommendation.ps1'

function Invoke-RecommendationCommand {
    $arguments = @(
        '-NoProfile',
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        $recommendationScriptPath,
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

function New-FacadeEvidence {
    param([object]$Capture)

    $items = @(
        [pscustomobject]@{
            source = 'scripts/get-sdk-manager-orchestration-dry-run.ps1'
            field = 'delegatedCommand'
            value = 'scripts/get-sdk-manager-recommendation.ps1 -Json'
        },
        [pscustomobject]@{
            source = 'scripts/get-sdk-manager-recommendation.ps1'
            field = 'exitCode'
            value = $Capture.exitCode
        },
        [pscustomobject]@{
            source = 'scripts/get-sdk-manager-recommendation.ps1'
            field = 'parseSucceeded'
            value = $Capture.parseSucceeded
        }
    )

    if ($Capture.parseSucceeded -and $null -ne $Capture.data -and $null -ne $Capture.data.evidence) {
        $items += @($Capture.data.evidence)
    }

    return @($items)
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
            summary = 'Validation readiness was not available from the SDK manager recommendation.'
        }
    }
}

function New-EmptyTestExecutionGuidance {
    return [pscustomobject]@{
        recommendation = 'standard'
        requiresSerial = $false
        reason = 'Test execution guidance was not available from the SDK manager recommendation.'
        commands = @()
    }
}

function Get-RecommendationReadiness {
    param([object]$Recommendation)

    if ($null -ne $Recommendation -and $null -ne $Recommendation.readiness) {
        return $Recommendation.readiness
    }

    return New-EmptyReadiness
}

function Get-RecommendationTestExecutionGuidance {
    param([object]$Recommendation)

    if ($null -ne $Recommendation -and $null -ne $Recommendation.testExecutionGuidance) {
        return $Recommendation.testExecutionGuidance
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

    $stopReason = 'SDK manager orchestration dry run is advisory and does not execute workflow commands.'
    if ($blocked) {
        $blockerText = if ($BlockersValue.Count -gt 0) { $BlockersValue -join '; ' } else { 'recommended action is blocker resolution' }
        $stopReason = "Stop for manual blocker resolution: $blockerText. SDK manager orchestration dry run is advisory and does not execute workflow commands."
    }
    elseif ($RequiresExternalAuthorizationValue) {
        $stopReason = 'Stop for explicit external authorization before any external audit or data sharing. SDK manager orchestration dry run is advisory and does not execute workflow commands.'
    }
    elseif ($RequiresHumanAuthorizationValue) {
        $stopReason = 'Stop for explicit human authorization before the next workflow step. SDK manager orchestration dry run is advisory and does not execute workflow commands.'
    }

    $validation = if ($null -ne $ReadinessValue -and $null -ne $ReadinessValue.validation) { $ReadinessValue.validation } else { $null }
    $testGuidance = $TestExecutionGuidanceValue

    return [pscustomobject]@{
        summary = "Next action '$RecommendedAction' for work package '$workPackageDisplay' requires $authorizationText. SDK manager orchestration dry run is advisory and does not execute commands."
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

function Get-RecommendationOperatorHandoff {
    param(
        [object]$Recommendation,
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

    if ($null -ne $Recommendation -and $null -ne $Recommendation.operatorHandoff) {
        return $Recommendation.operatorHandoff
    }

    return New-OperatorHandoff `
        -RecommendedAction $RecommendedAction `
        -WorkPackageValue $WorkPackageValue `
        -StatusState $StatusState `
        -CommandPreviewValue $CommandPreviewValue `
        -RequiresHumanAuthorizationValue $RequiresHumanAuthorizationValue `
        -RequiresExternalAuthorizationValue $RequiresExternalAuthorizationValue `
        -BlockersValue @($BlockersValue) `
        -ReadinessValue $ReadinessValue `
        -TestExecutionGuidanceValue $TestExecutionGuidanceValue
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

function New-BlockedRecommendation {
    param(
        [string]$StatusState,
        [string[]]$Blockers
    )

    return [pscustomobject]@{
        kind = 'sdk_manager_recommendation'
        generatedAt = (Get-Date).ToUniversalTime().ToString('o')
        workPackage = if ([string]::IsNullOrWhiteSpace($WorkPackage)) { '' } else { $WorkPackage }
        statusState = $StatusState
        recommendedAction = 'resolve_blockers'
        commandPreview = ''
        requiresHumanAuthorization = $true
        requiresExternalAuthorization = $false
        forbiddenToExecute = $true
        blockers = @($Blockers)
        readiness = New-EmptyReadiness
        testExecutionGuidance = New-EmptyTestExecutionGuidance
        evidence = @()
        source = [pscustomobject]@{
            decisionAction = 'ResolveBlockers'
            dryRun = $true
            executed = $false
            statusBundleExitCode = $null
            statusBundleParseSucceeded = $false
        }
    }
}

if (-not (Test-Path -LiteralPath $recommendationScriptPath -PathType Leaf)) {
    $recommendationCapture = [pscustomobject]@{
        exitCode = 1
        parseSucceeded = $false
        data = $null
        rawOutput = ''
    }
    $recommendation = New-BlockedRecommendation -StatusState 'Blocked' -Blockers @('recommendationCommand: Missing')
}
else {
    $recommendationCapture = Invoke-RecommendationCommand
    if ($recommendationCapture.parseSucceeded -and $null -ne $recommendationCapture.data) {
        $recommendation = $recommendationCapture.data
    }
    else {
        $recommendation = New-BlockedRecommendation -StatusState 'Unparsed' -Blockers @('recommendationCommand: Unparsed')
    }
}

$blockers = if ($null -ne $recommendation.blockers) { @($recommendation.blockers) } else { @() }
$recommendedAction = if ($null -ne $recommendation.recommendedAction) { [string]$recommendation.recommendedAction } else { 'resolve_blockers' }
$commandPreview = if ($null -ne $recommendation.commandPreview) { [string]$recommendation.commandPreview } else { '' }
$workPackageValue = if ($null -ne $recommendation.workPackage -and -not [string]::IsNullOrWhiteSpace([string]$recommendation.workPackage)) { [string]$recommendation.workPackage } elseif ([string]::IsNullOrWhiteSpace($WorkPackage)) { '' } else { $WorkPackage }
$readiness = Get-RecommendationReadiness -Recommendation $recommendation
$testExecutionGuidance = Get-RecommendationTestExecutionGuidance -Recommendation $recommendation
$statusState = if ($null -ne $recommendation.statusState) { [string]$recommendation.statusState } else { 'Unknown' }
$requiresHumanAuthorization = if ($null -ne $recommendation.requiresHumanAuthorization) { [bool]$recommendation.requiresHumanAuthorization } else { $true }
$requiresExternalAuthorization = if ($null -ne $recommendation.requiresExternalAuthorization) { [bool]$recommendation.requiresExternalAuthorization } else { $false }
$operatorHandoff = Get-RecommendationOperatorHandoff `
    -Recommendation $recommendation `
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
    kind = 'sdk_manager_orchestration_dry_run'
    generatedAt = (Get-Date).ToUniversalTime().ToString('o')
    dryRun = $true
    executed = $false
    executionForbidden = $true
    workPackage = $workPackageValue
    manager = [pscustomobject]@{
        name = 'sdk_manager_orchestration_facade'
        mode = 'dry_run'
        dependencyFree = $true
        sdkExecution = $false
        runtimeAi = $false
        networkAllowed = $false
    }
    recommendation = $recommendation
    allowedNextAction = $recommendedAction
    statusState = $statusState
    commandPreviewDisplayText = $commandPreview
    requiresHumanAuthorization = $requiresHumanAuthorization
    requiresExternalAuthorization = $requiresExternalAuthorization
    blocked = ($blockers.Count -gt 0 -or $recommendedAction -eq 'resolve_blockers')
    blockers = @($blockers)
    readiness = $readiness
    testExecutionGuidance = $testExecutionGuidance
    operatorHandoff = $operatorHandoff
    evidence = New-FacadeEvidence -Capture $recommendationCapture
    source = [pscustomobject]@{
        recommendationCommand = 'scripts/get-sdk-manager-recommendation.ps1'
        recommendationExitCode = $recommendationCapture.exitCode
        recommendationParseSucceeded = $recommendationCapture.parseSucceeded
        delegated = $true
        commandPreviewExecuted = $false
    }
}

if ($Json) {
    $result | ConvertTo-Json -Depth 16
}
else {
    Write-Host "SDK manager orchestration dry run: $($result.allowedNextAction)"
    Write-Host 'Dry run: True'
    Write-Host 'Executed: False'
    Write-Host "Execution forbidden: $($result.executionForbidden)"
    Write-Host "Work package: $(if ([string]::IsNullOrWhiteSpace($result.workPackage)) { 'none' } else { $result.workPackage })"
    Write-Host "Status state: $($result.statusState)"
    if (-not [string]::IsNullOrWhiteSpace($result.commandPreviewDisplayText)) {
        Write-Host "Command preview: $($result.commandPreviewDisplayText)"
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
