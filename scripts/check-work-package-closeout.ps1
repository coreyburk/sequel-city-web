[CmdletBinding()]
param(
    [Parameter(Position = 0, Mandatory = $true)]
    [Alias("Name", "Task", "Id", "WorkPackage")]
    [string]$WorkPackagePath,

    [switch]$Json
)

$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Path $PSScriptRoot -Parent
. (Join-Path $PSScriptRoot 'lib/WorkPackageResolver.ps1')

function Get-MarkdownSection {
    param(
        [Parameter(Mandatory = $true)][string]$Content,
        [Parameter(Mandatory = $true)][string]$Heading
    )

    $escaped = [regex]::Escape($Heading)
    $match = [regex]::Match($Content, "(?ms)^##\s+$escaped\s*\r?\n(.*?)(?=^##\s+|\z)")
    if (-not $match.Success) {
        return ''
    }

    return $match.Groups[1].Value.Trim()
}

function Invoke-JsonHelper {
    param(
        [Parameter(Mandatory = $true)][string]$ScriptName,
        [Parameter(Mandatory = $true)][string]$WorkPackage
    )

    $scriptPath = Join-Path $PSScriptRoot $ScriptName
    $output = & powershell -NoProfile -ExecutionPolicy Bypass -File $scriptPath $WorkPackage -Json
    $exitCode = $LASTEXITCODE
    $json = if ($output) { $output | ConvertFrom-Json } else { $null }

    return [pscustomobject]@{
        ExitCode = $exitCode
        Json = $json
    }
}

function Test-AuditPassLike {
    param([string]$Text)

    if ([string]::IsNullOrWhiteSpace($Text)) {
        return $false
    }

    return (
        $Text -match '(?im)^\s*(?:[-*]\s*)?(?:\*{0,2})?(?:Verdict|Final Audit Summary\s*-?\s*Verdict)(?:\*{0,2})?\s*:?\s*\*?\*?PASS\b' -or
        $Text -match '(?im)^\s*##\s*Verdict\s*\r?\n\s*\*?\*?PASS\b'
    )
}

function Test-AuditFailLike {
    param([string]$Text)

    if ([string]::IsNullOrWhiteSpace($Text)) {
        return $false
    }

    return (
        $Text -match '(?im)^\s*(?:[-*]\s*)?(?:\*{0,2})?(Verdict|Status)(?:\*{0,2})?\s*:?\s*\*?\*?(FAIL|BLOCKED)\b'
    )
}

$resolvedPath = Resolve-WorkPackageInputPath -InputValue $WorkPackagePath -ProjectRoot $projectRoot
$relativePath = $resolvedPath.Substring(([System.IO.Path]::GetFullPath($projectRoot).TrimEnd('\', '/') + [System.IO.Path]::DirectorySeparatorChar).Length)
$relativePath = ($relativePath -replace '\\', '/').ToLowerInvariant()
$content = Get-Content -LiteralPath $resolvedPath -Raw

$statusResult = Invoke-JsonHelper -ScriptName 'get-work-package-status.ps1' -WorkPackage $WorkPackagePath
$validationResult = Invoke-JsonHelper -ScriptName 'get-work-package-validation-plan.ps1' -WorkPackage $WorkPackagePath

$auditResults = Get-MarkdownSection -Content $content -Heading 'Audit Results'
$finalDecision = Get-MarkdownSection -Content $content -Heading 'Final Decision'
$auditRecorded = -not [string]::IsNullOrWhiteSpace($auditResults) -and $auditResults.Trim() -notmatch '(?i)^pending audit\.?\s*$'
$auditPassed = Test-AuditPassLike -Text $auditResults
$auditFailed = Test-AuditFailLike -Text $auditResults
$finalAccepted = $finalDecision -match '(?i)\b(accepted|approved)\b'
$finalClosedNotAccepted = $finalDecision -match '(?i)\b(rejected|deferred)\b'

$findings = New-Object System.Collections.Generic.List[string]

$statusBlockedByAuditText = (
    $statusResult.ExitCode -ne 0 -and
    [string]$statusResult.Json.state -eq 'AuditBlockedNeedsResolution' -and
    $auditPassed -and
    $statusResult.Json.outOfScopeDirtyFiles.Count -eq 0 -and
    $statusResult.Json.missingPlanningSections.Count -eq 0
)

if ($statusResult.ExitCode -ne 0 -and -not $statusBlockedByAuditText) {
    [void]$findings.Add("Status helper returned exit code $($statusResult.ExitCode).")
}

if ($validationResult.ExitCode -ne 0) {
    [void]$findings.Add("Validation-plan helper returned exit code $($validationResult.ExitCode).")
}

if ($statusResult.Json.outOfScopeDirtyFiles.Count -gt 0) {
    [void]$findings.Add('Dirty files outside the active work-package scope are present.')
}

if ($statusResult.Json.missingPlanningSections.Count -gt 0) {
    [void]$findings.Add('Required planning sections are missing or incomplete.')
}

if (($statusResult.Json.auditBlocked -eq $true -and -not $auditPassed) -or $auditFailed) {
    [void]$findings.Add('Audit results are blocked or failed.')
}

if ($finalClosedNotAccepted) {
    [void]$findings.Add('Final decision is rejected or deferred.')
}

$validationState = [string]$validationResult.Json.state
$validationAcceptableForAudit = $validationState -in @('ValidationPlanReady', 'ValidationEvidenceRecorded', 'NoAutomatedValidationExplained')
$validationEvidenceRecorded = $validationState -eq 'ValidationEvidenceRecorded'

if (-not $validationAcceptableForAudit) {
    [void]$findings.Add('Validation plan or validation evidence is missing.')
}

$state = 'Blocked'
$nextAction = 'Resolve closeout blockers before continuing.'

if ($findings.Count -eq 0) {
    if ($finalAccepted) {
        if ($auditRecorded -and $validationEvidenceRecorded) {
            $state = 'ReadyForFinalization'
            $nextAction = 'Refresh handoff if needed, then finalize with scripts/commit-work-package.ps1.'
        }
        else {
            [void]$findings.Add('Accepted finalization requires recorded audit results and validation evidence.')
        }
    }
    elseif ($auditRecorded) {
        if ($auditPassed) {
            $state = 'ReadyForAcceptance'
            $nextAction = 'Human reviewer should accept, reject, defer, or request corrective work.'
        }
        else {
            [void]$findings.Add('Audit results are recorded but no PASS verdict was detected.')
        }
    }
    elseif ($statusResult.Json.codeResultsRecorded -eq $true) {
        $state = 'ReadyForAudit'
        $nextAction = 'Run independent audit for this work package.'
    }
    else {
        [void]$findings.Add('Code results are not recorded yet.')
    }
}

if ($findings.Count -gt 0 -and $state -ne 'Blocked') {
    $state = 'Blocked'
    $nextAction = 'Resolve closeout blockers before continuing.'
}

$result = [pscustomobject]@{
    workPackagePath = $relativePath
    state = $state
    nextAction = $nextAction
    statusState = $statusResult.Json.state
    validationState = $validationState
    codeResultsRecorded = $statusResult.Json.codeResultsRecorded
    auditResultsRecorded = $auditRecorded
    auditPassed = $auditPassed
    finalDecision = $statusResult.Json.finalDecision
    dirtyFiles = @($statusResult.Json.dirtyFiles)
    outOfScopeDirtyFiles = @($statusResult.Json.outOfScopeDirtyFiles)
    findings = @($findings)
}

if ($Json) {
    $result | ConvertTo-Json -Depth 8
} else {
    Write-Host "Work package: $($result.workPackagePath)"
    Write-Host "Closeout state: $($result.state)"
    Write-Host "Next action: $($result.nextAction)"
    Write-Host "Status state: $($result.statusState)"
    Write-Host "Validation state: $($result.validationState)"
    Write-Host "Code results recorded: $($result.codeResultsRecorded)"
    Write-Host "Audit results recorded: $($result.auditResultsRecorded)"
    Write-Host "Audit pass detected: $($result.auditPassed)"
    Write-Host "Final decision: $($result.finalDecision)"
    Write-Host 'Findings:'
    if ($result.findings.Count -eq 0) {
        Write-Host '  - none'
    } else {
        foreach ($finding in $result.findings) {
            Write-Host "  - $finding"
        }
    }
}

if ($state -eq 'Blocked') {
    exit 2
}

exit 0
