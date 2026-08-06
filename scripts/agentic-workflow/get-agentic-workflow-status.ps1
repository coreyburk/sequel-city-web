[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [Alias("Name", "Task", "Id")]
    [string]$WorkPackage,

    [switch]$Json,

    [switch]$SkipUnderstandReadiness,

    [switch]$Strict
)

$ErrorActionPreference = 'Stop'

$implementationRoot = Split-Path -Path $PSCommandPath -Parent
$scriptRoot = Split-Path -Path $implementationRoot -Parent
$repoRoot = Split-Path -Path $scriptRoot -Parent

function Invoke-CommandCapture {
    param(
        [Parameter(Mandatory = $true)][string]$Executable,
        [Parameter(Mandatory = $true)][string[]]$Arguments
    )

    $previousErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        $output = & $Executable @Arguments 2>&1 | Out-String
        $exitCode = $LASTEXITCODE
    }
    finally {
        $ErrorActionPreference = $previousErrorActionPreference
    }

    return [pscustomobject]@{
        exitCode = $exitCode
        output = $output.Trim()
    }
}

function Invoke-GitValue {
    param([Parameter(Mandatory = $true)][string[]]$Arguments)

    $capture = Invoke-CommandCapture -Executable 'git' -Arguments (@('-C', $repoRoot) + $Arguments)
    if ($capture.exitCode -ne 0) {
        return ''
    }

    return $capture.output
}

function Get-GitState {
    $statusCapture = Invoke-CommandCapture -Executable 'git' -Arguments @('-C', $repoRoot, 'status', '--short', '--untracked-files=all')
    $dirtyFiles = @()
    if ($statusCapture.exitCode -eq 0 -and -not [string]::IsNullOrWhiteSpace($statusCapture.output)) {
        foreach ($line in ($statusCapture.output -split "\r?\n")) {
            $trimmed = $line.Trim()
            if (-not [string]::IsNullOrWhiteSpace($trimmed)) {
                $dirtyFiles += $trimmed
            }
        }
    }

    return [pscustomobject]@{
        branch = Invoke-GitValue -Arguments @('branch', '--show-current')
        head = Invoke-GitValue -Arguments @('rev-parse', '--short', 'HEAD')
        remote = Invoke-GitValue -Arguments @('remote', 'get-url', 'origin')
        statusExitCode = $statusCapture.exitCode
        isClean = ($statusCapture.exitCode -eq 0 -and $dirtyFiles.Count -eq 0)
        dirtyFiles = @($dirtyFiles)
    }
}

function ConvertFrom-JsonOrNull {
    param([string]$Text)

    if ([string]::IsNullOrWhiteSpace($Text)) {
        return $null
    }

    try {
        return ($Text | ConvertFrom-Json)
    }
    catch {
        return $null
    }
}

function New-SkippedComponent {
    param(
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)][string]$Reason
    )

    return [pscustomobject]@{
        name = $Name
        status = 'Skipped'
        skipped = $true
        exitCode = $null
        state = 'Skipped'
        blocked = $false
        parseSucceeded = $false
        reason = $Reason
        data = $null
        rawOutput = ''
        error = ''
    }
}

function New-CommandComponent {
    param(
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)][string]$ScriptName,
        [string[]]$Arguments = @(),
        [Parameter(Mandatory = $true)][scriptblock]$StateSelector,
        [Parameter(Mandatory = $true)][scriptblock]$BlockedSelector
    )

    $scriptPath = Join-Path $scriptRoot $ScriptName
    $capture = Invoke-CommandCapture -Executable 'powershell' -Arguments (@('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $scriptPath) + $Arguments)
    $parsed = ConvertFrom-JsonOrNull -Text $capture.output
    $parseSucceeded = ($null -ne $parsed)
    $state = if ($parseSucceeded) { & $StateSelector $parsed } else { 'Unparsed' }
    if ([string]::IsNullOrWhiteSpace([string]$state)) {
        $state = 'Unknown'
    }

    $blocked = $false
    if ($capture.exitCode -ne 0 -or -not $parseSucceeded) {
        $blocked = $true
    }
    elseif (& $BlockedSelector $parsed) {
        $blocked = $true
    }

    $status = if ($blocked) { 'Blocked' } else { 'Ready' }

    return [pscustomobject]@{
        name = $Name
        status = $status
        skipped = $false
        exitCode = $capture.exitCode
        state = $state
        blocked = $blocked
        parseSucceeded = $parseSucceeded
        reason = ''
        data = $parsed
        rawOutput = if ($parseSucceeded) { '' } else { $capture.output }
        error = if ($parseSucceeded) { '' } else { 'Component output was not valid JSON.' }
    }
}

function Test-BlockedState {
    param([string]$State)

    return ($State -match '^(Blocked|BlockedMixedWorktree|AuditBlockedNeedsResolution|PlanningIncomplete|ValidationPlanMissing|ClosedRejected|ClosedDeferred)$')
}

function Get-ComponentParseReadiness {
    param([object]$Components)

    $items = @()
    foreach ($component in $Components.GetEnumerator()) {
        $value = $component.Value
        $ready = ($value.skipped -eq $true -or $value.parseSucceeded -eq $true)
        $message = if ($value.skipped -eq $true) {
            $value.reason
        }
        elseif ($value.parseSucceeded -eq $true) {
            'Component JSON parsed successfully.'
        }
        else {
            if ([string]::IsNullOrWhiteSpace([string]$value.error)) {
                'Component output was not valid JSON.'
            }
            else {
                [string]$value.error
            }
        }

        $items += [pscustomobject]@{
            name = $value.name
            state = $value.state
            status = $value.status
            skipped = [bool]$value.skipped
            parseSucceeded = [bool]$value.parseSucceeded
            ready = [bool]$ready
            message = $message
        }
    }

    return @($items)
}

function Get-ValidationReadiness {
    param([object]$ValidationRecommendation)

    if ($null -eq $ValidationRecommendation) {
        return [pscustomobject]@{
            available = $false
            action = ''
            requiresAction = $false
            reviewRequired = $false
            blocksAuditReadiness = $false
            summary = 'No validation recommendation is available.'
        }
    }

    $actionProperty = $ValidationRecommendation.PSObject.Properties['action']
    $requiresActionProperty = $ValidationRecommendation.PSObject.Properties['requiresAction']
    $reviewRequiredProperty = $ValidationRecommendation.PSObject.Properties['reviewRequired']
    $blocksAuditReadinessProperty = $ValidationRecommendation.PSObject.Properties['blocksAuditReadiness']
    $summaryProperty = $ValidationRecommendation.PSObject.Properties['summary']

    return [pscustomobject]@{
        available = $true
        action = if ($null -ne $actionProperty) { [string]$actionProperty.Value } else { '' }
        requiresAction = if ($null -ne $requiresActionProperty) { [bool]$requiresActionProperty.Value } else { $false }
        reviewRequired = if ($null -ne $reviewRequiredProperty) { [bool]$reviewRequiredProperty.Value } else { $false }
        blocksAuditReadiness = if ($null -ne $blocksAuditReadinessProperty) { [bool]$blocksAuditReadinessProperty.Value } else { $false }
        summary = if ($null -ne $summaryProperty) { [string]$summaryProperty.Value } else { '' }
    }
}

function Get-ValidationTextItems {
    param([object]$ValidationPlan)

    if ($null -eq $ValidationPlan -or $ValidationPlan.parseSucceeded -ne $true -or $null -eq $ValidationPlan.data) {
        return @()
    }

    $items = @()
    $data = $ValidationPlan.data
    foreach ($propertyName in @('relatedTests', 'plannedVerificationCommands')) {
        $property = $data.PSObject.Properties[$propertyName]
        if ($null -ne $property -and $null -ne $property.Value) {
            $items += @($property.Value | ForEach-Object { [string]$_ })
        }
    }

    $recommendationProperty = $data.PSObject.Properties['recommendation']
    if ($null -ne $recommendationProperty -and $null -ne $recommendationProperty.Value) {
        foreach ($propertyName in @('commandsToRun')) {
            $property = $recommendationProperty.Value.PSObject.Properties[$propertyName]
            if ($null -ne $property -and $null -ne $property.Value) {
                $items += @($property.Value | ForEach-Object { [string]$_ })
            }
        }
    }

    return @($items | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
}

function Get-TestExecutionGuidance {
    param([object]$ValidationPlan)

    $items = @(Get-ValidationTextItems -ValidationPlan $ValidationPlan)
    $fixturePatterns = @(
        'test-agentic-workflow-decision\.ps1',
        'test-sdk-manager-recommendation\.ps1',
        'test-work-package-status\.ps1',
        'test-work-package-validation-plan\.ps1',
        'test-work-package-closeout-preflight\.ps1',
        'test-work-package-creation-shims\.ps1',
        'test-run-work-package-isolation\.ps1'
    )

    $matchedItems = @()
    foreach ($item in $items) {
        foreach ($pattern in $fixturePatterns) {
            if ($item -match $pattern) {
                $matchedItems += $item
                break
            }
        }
    }

    $requiresSerial = ($matchedItems.Count -gt 0)
    return [pscustomobject]@{
        recommendation = if ($requiresSerial) { 'run_serially' } else { 'standard' }
        requiresSerial = [bool]$requiresSerial
        reason = if ($requiresSerial) {
            'One or more related validation commands use work-package fixture tests that create temporary work-package files or dirty-worktree fixtures.'
        }
        else {
            'No work-package fixture tests requiring serial execution were detected.'
        }
        commands = @($matchedItems | Select-Object -Unique)
    }
}

$workPackageProvided = -not [string]::IsNullOrWhiteSpace($WorkPackage)
$git = Get-GitState

if ($workPackageProvided) {
    $workPackageStatus = New-CommandComponent `
        -Name 'workPackageStatus' `
        -ScriptName 'get-work-package-status.ps1' `
        -Arguments @($WorkPackage, '-Json') `
        -StateSelector { param($data) [string]$data.state } `
        -BlockedSelector { param($data) Test-BlockedState -State ([string]$data.state) }

    $validationPlan = New-CommandComponent `
        -Name 'validationPlan' `
        -ScriptName 'get-work-package-validation-plan.ps1' `
        -Arguments @($WorkPackage, '-Json') `
        -StateSelector { param($data) [string]$data.state } `
        -BlockedSelector { param($data) Test-BlockedState -State ([string]$data.state) }

    $closeoutPreflight = New-CommandComponent `
        -Name 'closeoutPreflight' `
        -ScriptName 'check-work-package-closeout.ps1' `
        -Arguments @($WorkPackage, '-Json') `
        -StateSelector { param($data) [string]$data.state } `
        -BlockedSelector { param($data) ([string]$data.state) -eq 'Blocked' }
}
else {
    $workPackageStatus = New-SkippedComponent -Name 'workPackageStatus' -Reason 'No work package was provided.'
    $validationPlan = New-SkippedComponent -Name 'validationPlan' -Reason 'No work package was provided.'
    $closeoutPreflight = New-SkippedComponent -Name 'closeoutPreflight' -Reason 'No work package was provided.'
}

if ($SkipUnderstandReadiness) {
    $understandReadiness = New-SkippedComponent -Name 'understandReadiness' -Reason 'Skipped by -SkipUnderstandReadiness.'
}
else {
    $understandReadiness = New-CommandComponent `
        -Name 'understandReadiness' `
        -ScriptName 'check-understand-refresh-readiness.ps1' `
        -Arguments @('-Json') `
        -StateSelector { param($data) if ($data.ready -eq $true) { 'Ready' } else { 'Blocked' } } `
        -BlockedSelector { param($data) $data.ready -ne $true }
}

$components = [ordered]@{
    workPackageStatus = $workPackageStatus
    validationPlan = $validationPlan
    closeoutPreflight = $closeoutPreflight
    understandReadiness = $understandReadiness
}

$blockers = @()
foreach ($component in $components.GetEnumerator()) {
    $value = $component.Value
    if ($value.blocked -eq $true) {
        $blockers += "$($value.name): $($value.state)"
    }
}

$overallState = if ($blockers.Count -gt 0) { 'Blocked' } else { 'Ready' }
$nextAction = if ($blockers.Count -gt 0) {
    'Review component blockers before dispatching the next workflow action.'
}
elseif ($workPackageProvided) {
    'Use the component states to choose implementation, audit, acceptance, or finalization.'
}
else {
    'Provide -WorkPackage to include lifecycle, validation, and closeout state.'
}

$validationRecommendation = $null
if ($null -ne $validationPlan -and $validationPlan.parseSucceeded -eq $true -and $null -ne $validationPlan.data) {
    $recommendationProperty = $validationPlan.data.PSObject.Properties['recommendation']
    if ($null -ne $recommendationProperty) {
        $validationRecommendation = $recommendationProperty.Value
    }
}

$readiness = [pscustomobject]@{
    componentParseReadiness = @(Get-ComponentParseReadiness -Components $components)
    validation = Get-ValidationReadiness -ValidationRecommendation $validationRecommendation
}
$testExecutionGuidance = Get-TestExecutionGuidance -ValidationPlan $validationPlan

$result = [pscustomobject]@{
    generatedAt = (Get-Date).ToUniversalTime().ToString('o')
    repository = [pscustomobject]@{
        root = $repoRoot
    }
    git = $git
    workPackage = [pscustomobject]@{
        input = if ($workPackageProvided) { $WorkPackage } else { '' }
        available = $workPackageProvided
    }
    components = [pscustomobject]$components
    validationRecommendation = $validationRecommendation
    readiness = $readiness
    testExecutionGuidance = $testExecutionGuidance
    overall = [pscustomobject]@{
        state = $overallState
        blockers = @($blockers)
        nextAction = $nextAction
    }
}

if ($Json) {
    $result | ConvertTo-Json -Depth 12
}
else {
    Write-Host "Agentic workflow status: $($result.overall.state)"
    Write-Host "Repository: $($result.repository.root)"
    Write-Host "Branch: $($result.git.branch)"
    Write-Host "HEAD: $($result.git.head)"
    Write-Host "Remote: $($result.git.remote)"
    Write-Host "Working tree clean: $($result.git.isClean)"
    Write-Host "Work package: $(if ($workPackageProvided) { $WorkPackage } else { 'none' })"
    Write-Host 'Components:'
    foreach ($component in $components.GetEnumerator()) {
        $value = $component.Value
        $detail = if ($value.skipped) { $value.reason } else { "exit $($value.exitCode)" }
        Write-Host "  - $($value.name): $($value.state) [$($value.status); $detail]"
    }
    if ($null -ne $result.validationRecommendation) {
        Write-Host "Validation recommendation: $($result.validationRecommendation.action)"
    }
    Write-Host "Validation readiness: action=$($result.readiness.validation.action); requiresAction=$($result.readiness.validation.requiresAction); reviewRequired=$($result.readiness.validation.reviewRequired); blocksAuditReadiness=$($result.readiness.validation.blocksAuditReadiness)"
    if ($result.testExecutionGuidance.requiresSerial) {
        Write-Host "Test execution guidance: run serially - $($result.testExecutionGuidance.reason)"
    }
    else {
        Write-Host "Test execution guidance: standard - $($result.testExecutionGuidance.reason)"
    }
    Write-Host "Next action: $($result.overall.nextAction)"
    if ($result.overall.blockers.Count -gt 0) {
        Write-Host 'Blockers:'
        foreach ($blocker in $result.overall.blockers) {
            Write-Host "  - $blocker"
        }
    }
}

if ($Strict -and $blockers.Count -gt 0) {
    exit 2
}

exit 0
