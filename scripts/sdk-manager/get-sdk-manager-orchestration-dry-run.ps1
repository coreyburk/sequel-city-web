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
    statusState = if ($null -ne $recommendation.statusState) { [string]$recommendation.statusState } else { 'Unknown' }
    commandPreviewDisplayText = $commandPreview
    requiresHumanAuthorization = if ($null -ne $recommendation.requiresHumanAuthorization) { [bool]$recommendation.requiresHumanAuthorization } else { $true }
    requiresExternalAuthorization = if ($null -ne $recommendation.requiresExternalAuthorization) { [bool]$recommendation.requiresExternalAuthorization } else { $false }
    blocked = ($blockers.Count -gt 0 -or $recommendedAction -eq 'resolve_blockers')
    blockers = @($blockers)
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
    if ($result.blockers.Count -gt 0) {
        Write-Host 'Blockers:'
        foreach ($blocker in $result.blockers) {
            Write-Host "  - $blocker"
        }
    }
}

exit 0
