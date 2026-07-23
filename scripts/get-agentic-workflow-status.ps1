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

$scriptRoot = Split-Path -Path $PSCommandPath -Parent
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
