[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [Alias("Name", "Task", "Id")]
    [string]$WorkPackage,

    [switch]$Json,

    [switch]$SkipUnderstandReadiness,

    [switch]$AllowTestStatusSnapshot,

    [string]$StatusSnapshotJson,

    [string]$StatusSnapshotJsonBase64
)

$ErrorActionPreference = 'Stop'

$implementationRoot = Split-Path -Path $PSCommandPath -Parent
$scriptRoot = Split-Path -Path $implementationRoot -Parent
$statusScriptPath = Join-Path $scriptRoot 'get-agentic-workflow-status.ps1'

function Invoke-StatusBundle {
    $arguments = @(
        '-NoProfile',
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        $statusScriptPath,
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

function New-Recommendation {
    param(
        [Parameter(Mandatory = $true)][string]$Action,
        [string]$CommandPreview = '',
        [bool]$RequiresHumanDecision = $true,
        [bool]$RequiresExternalAuthorization = $false,
        [Parameter(Mandatory = $true)][string]$Reason,
        [string[]]$Blockers = @(),
        [object[]]$BlockerDetails = @(),
        [object]$ValidationPlan = $null
    )

    $details = @($BlockerDetails)
    if ($details.Count -eq 0 -and $Blockers.Count -gt 0) {
        $details = @($Blockers | ForEach-Object { ConvertTo-BlockerDetail -Blocker $_ })
    }

    return [pscustomobject]@{
        action = $Action
        commandPreview = $CommandPreview
        requiresHumanDecision = $RequiresHumanDecision
        requiresExternalAuthorization = $RequiresExternalAuthorization
        reason = $Reason
        blockers = @($Blockers)
        blockerDetails = @($details)
        validationPlan = $ValidationPlan
    }
}

function New-BlockerDetail {
    param(
        [Parameter(Mandatory = $true)][string]$Source,
        [Parameter(Mandatory = $true)][string]$State,
        [Parameter(Mandatory = $true)][string]$Message,
        [Parameter(Mandatory = $true)][string]$NextStep,
        [AllowEmptyString()][string]$CommandPreview = ''
    )

    return [pscustomobject]@{
        source = $Source
        state = $State
        message = $Message
        nextStep = $NextStep
        commandPreview = $CommandPreview
    }
}

function ConvertTo-BlockerDetail {
    param([Parameter(Mandatory = $true)][AllowEmptyString()][string]$Blocker)

    $source = 'statusBundle'
    $state = $Blocker.Trim()
    if ($Blocker -match '^\s*([^:]+):\s*(.+?)\s*$') {
        $source = $Matches[1].Trim()
        $state = $Matches[2].Trim()
    }

    return New-BlockerDetail `
        -Source $source `
        -State $state `
        -Message "The $source component reported blocker state '$state'." `
        -NextStep 'Resolve or review this blocker before choosing another workflow action.' `
        -CommandPreview ''
}

function Get-ComponentState {
    param(
        [object]$StatusSnapshot,
        [string]$ComponentName
    )

    if ($null -eq $StatusSnapshot -or $null -eq $StatusSnapshot.components) {
        return ''
    }

    $property = $StatusSnapshot.components.PSObject.Properties[$ComponentName]
    if ($null -eq $property -or $null -eq $property.Value) {
        return ''
    }

    return [string]$property.Value.state
}

function Get-DecisionRecommendation {
    param(
        [object]$StatusSnapshot,
        [string[]]$StatusBlockers
    )

    $workPackageAvailable = $false
    $workPackageInput = ''
    if ($null -ne $StatusSnapshot -and $null -ne $StatusSnapshot.workPackage) {
        $workPackageAvailable = ($StatusSnapshot.workPackage.available -eq $true)
        $workPackageInput = [string]$StatusSnapshot.workPackage.input
    }

    if (-not $workPackageAvailable) {
        return New-Recommendation `
            -Action 'ProvideWorkPackage' `
            -RequiresHumanDecision $false `
            -Reason 'No work-package identifier was provided, so lifecycle routing cannot continue.'
    }

    $statusState = Get-ComponentState -StatusSnapshot $StatusSnapshot -ComponentName 'workPackageStatus'
    $closeoutState = Get-ComponentState -StatusSnapshot $StatusSnapshot -ComponentName 'closeoutPreflight'
    $validationPlan = Get-ValidationRecommendation -StatusSnapshot $StatusSnapshot

    if ($statusState -eq 'ReadyForImplementation') {
        return New-Recommendation `
            -Action 'ImplementWorkPackage' `
            -CommandPreview "scripts/run-work-package.ps1 $workPackageInput -Execute Codex" `
            -RequiresHumanDecision $true `
            -Reason 'The work package is planned and ready for scoped implementation.' `
            -ValidationPlan $validationPlan
    }

    if ($statusState -eq 'ClosedRejected' -or $statusState -eq 'ClosedDeferred') {
        return New-Recommendation `
            -Action 'NoActionClosed' `
            -RequiresHumanDecision $false `
            -Reason "The work package is closed as $statusState and should not continue as accepted work." `
            -ValidationPlan $validationPlan
    }

    $overallState = if ($null -ne $StatusSnapshot.overall) { [string]$StatusSnapshot.overall.state } else { 'Unknown' }
    if ($overallState -eq 'Blocked') {
        return New-Recommendation `
            -Action 'ResolveBlockers' `
            -RequiresHumanDecision $true `
            -Reason 'The status bundle reported blockers that must be reviewed before choosing a workflow action.' `
            -Blockers $StatusBlockers `
            -ValidationPlan $validationPlan
    }

    if ($statusState -eq 'ImplementedNeedsAudit' -or $closeoutState -eq 'ReadyForAudit') {
        return New-Recommendation `
            -Action 'RequestIndependentAudit' `
            -CommandPreview "scripts/audit-work-package.ps1 $workPackageInput -AllowExternalAudit" `
            -RequiresHumanDecision $true `
            -RequiresExternalAuthorization $true `
            -Reason 'Implementation evidence is recorded and the next gate is independent audit with explicit external-audit authorization.' `
            -ValidationPlan $validationPlan
    }

    if ($statusState -eq 'AuditedNeedsFinalDecision' -or $closeoutState -eq 'ReadyForAcceptance') {
        return New-Recommendation `
            -Action 'RequestHumanFinalDecision' `
            -RequiresHumanDecision $true `
            -Reason 'Audit evidence is recorded and the next gate is human acceptance, rejection, deferral, or corrective follow-up.' `
            -ValidationPlan $validationPlan
    }

    if ($statusState -eq 'AcceptedReadyForFinalization' -or $closeoutState -eq 'ReadyForFinalization') {
        return New-Recommendation `
            -Action 'FinalizeAcceptedWorkPackage' `
            -CommandPreview "scripts/commit-work-package.ps1 -WorkPackagePath $workPackageInput -Preview" `
            -RequiresHumanDecision $true `
            -Reason 'The work package is accepted and ready for handoff refresh plus commit-helper finalization.' `
            -ValidationPlan $validationPlan
    }

    return New-Recommendation `
        -Action 'ManualReview' `
        -RequiresHumanDecision $true `
        -Reason "No deterministic route is defined for status '$statusState' and closeout '$closeoutState'." `
        -Blockers @('decisionRouter: UnsupportedState') `
        -BlockerDetails @(
            New-BlockerDetail `
                -Source 'decisionRouter' `
                -State 'UnsupportedState' `
                -Message "No deterministic route is defined for work-package status '$statusState' and closeout state '$closeoutState'." `
                -NextStep 'Review the status and closeout components manually before running workflow commands.' `
                -CommandPreview ''
        ) `
        -ValidationPlan $validationPlan
}

function Get-ValidationRecommendation {
    param([object]$StatusSnapshot)

    if ($null -eq $StatusSnapshot) {
        return $null
    }

    $topLevel = $StatusSnapshot.PSObject.Properties['validationRecommendation']
    if ($null -ne $topLevel -and $null -ne $topLevel.Value) {
        return $topLevel.Value
    }

    if ($null -eq $StatusSnapshot.components) {
        return $null
    }

    $validationComponent = $StatusSnapshot.components.PSObject.Properties['validationPlan']
    if ($null -eq $validationComponent -or $null -eq $validationComponent.Value -or $null -eq $validationComponent.Value.data) {
        return $null
    }

    $recommendation = $validationComponent.Value.data.PSObject.Properties['recommendation']
    if ($null -eq $recommendation) {
        return $null
    }

    return $recommendation.Value
}

$statusSnapshotSupplied = (
    -not [string]::IsNullOrWhiteSpace($StatusSnapshotJson) -or
    -not [string]::IsNullOrWhiteSpace($StatusSnapshotJsonBase64)
)

if ($statusSnapshotSupplied -and -not $AllowTestStatusSnapshot) {
    $statusCapture = [pscustomobject]@{
        exitCode = 0
        parseSucceeded = $true
        data = [pscustomobject]@{
            workPackage = [pscustomobject]@{
                input = if ([string]::IsNullOrWhiteSpace($WorkPackage)) { '' } else { $WorkPackage }
                available = -not [string]::IsNullOrWhiteSpace($WorkPackage)
            }
            components = [pscustomobject]@{}
            overall = [pscustomobject]@{
                state = 'Blocked'
                blockers = @('testStatusSnapshot: RequiresAllowTestStatusSnapshot')
                nextAction = 'Rerun with real status-bundle input or use the explicit test-only guard in tests.'
            }
        }
        rawOutput = ''
    }
}
else {
    $statusSnapshotText = $StatusSnapshotJson
    if (-not [string]::IsNullOrWhiteSpace($StatusSnapshotJsonBase64)) {
        try {
            $statusSnapshotText = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($StatusSnapshotJsonBase64))
        }
        catch {
            $statusSnapshotText = ''
        }
    }

    if ([string]::IsNullOrWhiteSpace($statusSnapshotText)) {
        $statusCapture = Invoke-StatusBundle
    }
    else {
        try {
            $statusCapture = [pscustomobject]@{
                exitCode = 0
                parseSucceeded = $true
                data = ($statusSnapshotText | ConvertFrom-Json)
                rawOutput = ''
            }
        }
        catch {
            $statusCapture = [pscustomobject]@{
                exitCode = 0
                parseSucceeded = $false
                data = $null
                rawOutput = $statusSnapshotText.Trim()
            }
        }
    }
}

if (-not $statusCapture.parseSucceeded) {
    $statusSnapshot = $null
    $recommendation = New-Recommendation `
        -Action 'ResolveBlockers' `
        -RequiresHumanDecision $true `
        -Reason 'The status bundle did not return parseable JSON.' `
        -Blockers @('statusBundle: Unparsed') `
        -BlockerDetails @(
            New-BlockerDetail `
                -Source 'statusBundle' `
                -State 'Unparsed' `
                -Message 'The status bundle did not return parseable JSON.' `
                -NextStep 'Review the status command output and fix the parse failure before choosing a workflow action.' `
                -CommandPreview ''
        )
}
else {
    $statusSnapshot = $statusCapture.data
    $statusBlockers = @()
    if ($null -ne $statusSnapshot.overall -and $null -ne $statusSnapshot.overall.blockers) {
        $statusBlockers = @($statusSnapshot.overall.blockers)
    }
    $recommendation = Get-DecisionRecommendation -StatusSnapshot $statusSnapshot -StatusBlockers $statusBlockers
}

$result = [pscustomobject]@{
    generatedAt = (Get-Date).ToUniversalTime().ToString('o')
    dryRun = $true
    executed = $false
    workPackage = [pscustomobject]@{
        input = if ([string]::IsNullOrWhiteSpace($WorkPackage)) { '' } else { $WorkPackage }
    }
    status = [pscustomobject]@{
        statusBundleExitCode = $statusCapture.exitCode
        statusBundleParseSucceeded = $statusCapture.parseSucceeded
        overallState = if ($null -ne $statusSnapshot -and $null -ne $statusSnapshot.overall) { [string]$statusSnapshot.overall.state } else { 'Unknown' }
    }
    recommendation = $recommendation
    statusSnapshot = $statusSnapshot
}

if ($Json) {
    $result | ConvertTo-Json -Depth 14
}
else {
    Write-Host "Agentic workflow decision: $($result.recommendation.action)"
    Write-Host "Dry run: $($result.dryRun)"
    Write-Host "Executed: $($result.executed)"
    Write-Host "Work package: $(if ([string]::IsNullOrWhiteSpace($result.workPackage.input)) { 'none' } else { $result.workPackage.input })"
    Write-Host "Status: $($result.status.overallState)"
    Write-Host "Reason: $($result.recommendation.reason)"
    if (-not [string]::IsNullOrWhiteSpace($result.recommendation.commandPreview)) {
        Write-Host "Command preview: $($result.recommendation.commandPreview)"
    }
    Write-Host "Requires human decision: $($result.recommendation.requiresHumanDecision)"
    Write-Host "Requires external authorization: $($result.recommendation.requiresExternalAuthorization)"
    if ($result.recommendation.blockers.Count -gt 0) {
        Write-Host 'Blockers:'
        foreach ($blocker in $result.recommendation.blockers) {
            Write-Host "  - $blocker"
        }
    }
    if ($result.recommendation.blockerDetails.Count -gt 0) {
        Write-Host 'Blocker guidance:'
        foreach ($detail in $result.recommendation.blockerDetails) {
            Write-Host "  - $($detail.source): $($detail.nextStep)"
        }
    }
}

exit 0
