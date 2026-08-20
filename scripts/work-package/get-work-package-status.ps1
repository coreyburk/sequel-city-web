param(
    [Parameter(Position = 0, Mandatory = $true)]
    [string]$WorkPackagePath,

    [switch]$Json
)

$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Path $PSScriptRoot -Parent
$projectRoot = Split-Path -Path $scriptRoot -Parent
. (Join-Path $scriptRoot 'lib/WorkPackageResolver.ps1')

function Resolve-WorkPackagePath {
    param([Parameter(Mandatory = $true)][string]$Path)

    return Resolve-WorkPackageInputPath -InputValue $Path -ProjectRoot $projectRoot
}

function Get-MarkdownSection {
    param(
        [Parameter(Mandatory = $true)][string]$Content,
        [Parameter(Mandatory = $true)][string]$Heading
    )

    $escaped = [regex]::Escape($Heading)
    $match = [regex]::Match($Content, "(?ms)^##\s+$escaped\s*\r?\n(.*?)(?=^##\s+|\z)")
    if (-not $match.Success) {
        return $null
    }

    return $match.Groups[1].Value.Trim()
}

function Get-SectionContentStatus {
    param([string]$Value)

    if ([string]::IsNullOrWhiteSpace($Value)) {
        return [pscustomobject]@{
            HasContent = $false
            Reason = 'section is empty'
        }
    }

    $placeholderPatterns = @(
        '^State the single, concrete outcome',
        '^No implementation detail$',
        '^No solution framing$',
        '^Must be testable$',
        '^Define exactly what is in and out',
        '^Explicit behaviors or fields to add/change$',
        '^Exact surfaces impacted$',
        '^Anything not explicitly listed$',
        '^Refactors$',
        '^UI redesign unless stated$',
        '^New dependencies$',
        '^List exact files',
        '^List explicit read-only boundaries$',
        '^Non-negotiable rules',
        '^Preserve existing behavior unless explicitly changing it$',
        '^No architectural changes$',
        '^No renaming outside scope$',
        '^No speculative improvements$',
        '^No "while we''re here" changes$',
        '^Describe the exact functional change',
        '^Use concise bullet points$',
        '^Keep requirements explicit and testable$',
        '^Criterion \d+$',
        '^No unrelated files changed$',
        '^Implement the required behavior exactly as specified',
        '^Only modify the allowed files$',
        '^No refactors$',
        '^No new dependencies$',
        '^Preserve all existing behavior$',
        '^Exact code changes$',
        '^Short summary of what was implemented$'
    )

    $hasPlaceholder = $false
    $hasConcreteContent = $false
    foreach ($line in ($Value -split "\r?\n")) {
        $trimmed = $line.Trim()
        if ([string]::IsNullOrWhiteSpace($trimmed)) {
            continue
        }

        $normalized = $trimmed -replace '^\s*[-*]\s+', ''
        $normalized = $normalized.Trim()
        if ($normalized -match '^#{3,6}\s+') {
            continue
        }

        $isPlaceholder = $false
        foreach ($pattern in $placeholderPatterns) {
            if ($normalized -match $pattern) {
                $isPlaceholder = $true
                $hasPlaceholder = $true
                break
            }
        }

        if (-not $isPlaceholder) {
            $hasConcreteContent = $true
            break
        }
    }

    if ($hasConcreteContent) {
        return [pscustomobject]@{
            HasContent = $true
            Reason = 'section contains concrete content'
        }
    }

    $reason = if ($hasPlaceholder) { 'section contains only template placeholder text' } else { 'section has no concrete content' }
    return [pscustomobject]@{
        HasContent = $false
        Reason = $reason
    }
}

function Test-SectionHasContent {
    param([string]$Value)

    return (Get-SectionContentStatus -Value $Value).HasContent
}

function Normalize-WorkPackagePath {
    param(
        [Parameter(Mandatory = $true)]
        [AllowEmptyString()]
        [string]$Path
    )

    $normalized = $Path.Trim()
    $normalized = $normalized.Trim('`', '"', "'")
    $normalized = $normalized -replace '\\', '/'
    if ($normalized.StartsWith('./')) {
        $normalized = $normalized.Substring(2)
    }
    return $normalized.ToLowerInvariant()
}

function Get-ProjectRelativePath {
    param([Parameter(Mandatory = $true)][string]$Path)

    $rootPath = [System.IO.Path]::GetFullPath($projectRoot).TrimEnd('\', '/') + [System.IO.Path]::DirectorySeparatorChar
    $absolutePath = [System.IO.Path]::GetFullPath($Path)
    if ($absolutePath.StartsWith($rootPath, [System.StringComparison]::OrdinalIgnoreCase)) {
        return $absolutePath.Substring($rootPath.Length)
    }

    return $absolutePath
}

function Convert-StatusPath {
    param([Parameter(Mandatory = $true)][string]$StatusLine)

    if ($StatusLine.Length -lt 4) {
        return $null
    }

    $path = $StatusLine.Substring(3).Trim()
    if ($path -match ' -> ') {
        $path = ($path -split ' -> ')[-1].Trim()
    }

    return Normalize-WorkPackagePath -Path $path
}

function Get-GitModifiedFiles {
    $statusOutput = & git -C $projectRoot status --porcelain
    if ($LASTEXITCODE -ne 0) {
        throw 'git status failed.'
    }

    $files = @()
    foreach ($line in $statusOutput) {
        $path = Convert-StatusPath -StatusLine $line
        if (-not [string]::IsNullOrWhiteSpace($path)) {
            $files += $path
        }
    }

    return $files
}

function Get-WorkPackageScope {
    param([Parameter(Mandatory = $true)][string]$SectionText)

    $allowed = @()
    $prohibited = @()
    $mode = if ($SectionText -match '(?im)^\s*Allowed:\s*$') { 'none' } else { 'allowed' }

    foreach ($line in ($SectionText -split "\r?\n")) {
        $trimmed = $line.Trim()
        if ($trimmed -match '^\s*Allowed:\s*$') {
            $mode = 'allowed'
            continue
        }
        if ($trimmed -match '^\s*Do Not Modify:\s*$') {
            $mode = 'prohibited'
            continue
        }
        if ($trimmed -notmatch '^\s*[-*]\s+(.+?)\s*$') {
            continue
        }

        $entry = Normalize-WorkPackagePath -Path $matches[1]
        if ([string]::IsNullOrWhiteSpace($entry)) {
            continue
        }

        if ($mode -eq 'prohibited') {
            $prohibited += $entry
        } elseif ($mode -eq 'allowed') {
            $allowed += $entry
        }
    }

    return [pscustomobject]@{
        Allowed = @($allowed)
        Prohibited = @($prohibited)
    }
}

function Test-PathAllowed {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string[]]$AllowedPatterns
    )

    foreach ($pattern in $AllowedPatterns) {
        if ($pattern.EndsWith('/**')) {
            $prefix = $pattern.Substring(0, $pattern.Length - 3)
            if ($Path -eq $prefix -or $Path.StartsWith("$prefix/")) {
                return $true
            }
        } elseif ($Path -eq $pattern) {
            return $true
        }
    }

    return $false
}

function Test-ResultSectionRecorded {
    param(
        [string]$Value,
        [string]$PendingPattern
    )

    if ([string]::IsNullOrWhiteSpace($Value)) {
        return $false
    }

    return ($Value.Trim() -notmatch $PendingPattern)
}

function Get-FinalDecisionKind {
    param([string]$DecisionText)

    if ([string]::IsNullOrWhiteSpace($DecisionText)) {
        return 'Pending'
    }

    if ($DecisionText -match '(?i)\b(accepted|approved)\b') {
        return 'Accepted'
    }
    if ($DecisionText -match '(?i)\brejected\b') {
        return 'Rejected'
    }
    if ($DecisionText -match '(?i)\bdeferred\b') {
        return 'Deferred'
    }

    return 'Pending'
}

function Test-AuditBlocked {
    param([string]$AuditText)

    if ([string]::IsNullOrWhiteSpace($AuditText)) {
        return $false
    }

    $explicitBlocked = (
        $AuditText -match '(?im)^\s*(?:[-*]\s*)?\*{0,2}(?:Verdict|Status)(?:\s*:)?\*{0,2}(?:\s*:)?\s*\*{0,2}BLOCKED\b' -or
        $AuditText -match '(?im)^\s*#{1,6}\s*(?:Verdict|Status)\s*:?\s*\*{0,2}BLOCKED\b' -or
        $AuditText -match '(?im)^\s*(?:[-*]\s*)?(?:Blocked external audit|Blocked audit|Audit blocked)\s*:'
    )
    if ($explicitBlocked) {
        return $true
    }

    $explicitPass = (
        $AuditText -match '(?im)^\s*(?:[-*]\s*)?\*{0,2}(?:Verdict|Status|Final Audit Summary\s*-?\s*Verdict)(?:\s*:)?\*{0,2}(?:\s*:)?\s*\*{0,2}PASS\b' -or
        $AuditText -match '(?im)^\s*#{1,6}\s*(?:Verdict|Status|Final Audit Summary\s*-?\s*Verdict)\s*:?\s*\*{0,2}PASS\b' -or
        $AuditText -match '(?im)^\s*##\s*Verdict\s*\r?\n\s*\*?\*?PASS\b'
    )
    if ($explicitPass) {
        return $false
    }

    return $false
}

$resolvedPath = Resolve-WorkPackagePath -Path $WorkPackagePath
$relativePath = Normalize-WorkPackagePath -Path (Get-ProjectRelativePath -Path $resolvedPath)
$content = Get-Content -LiteralPath $resolvedPath -Raw

$requiredPlanningSections = @(
    'Objective',
    'Scope',
    'Impact Analysis',
    'Files Allowed to Change',
    'Constraints',
    'Required Behavior',
    'Acceptance Criteria',
    'Code Prompt',
    'Audit Prompt'
)

$missingPlanningSections = @()
$missingPlanningSectionDetails = @()
$sectionMap = @{}
foreach ($sectionName in $requiredPlanningSections + @('Code Results', 'Audit Results', 'Final Decision')) {
    $sectionText = Get-MarkdownSection -Content $content -Heading $sectionName
    $sectionMap[$sectionName] = $sectionText
    if ($requiredPlanningSections -contains $sectionName) {
        $contentStatus = Get-SectionContentStatus -Value $sectionText
        if (-not $contentStatus.HasContent) {
            $missingPlanningSections += $sectionName
            $missingPlanningSectionDetails += [pscustomobject]@{
                section = $sectionName
                reason = $contentStatus.Reason
            }
        }
    }
}

$filesAllowedSection = $sectionMap['Files Allowed to Change']
if ($null -eq $filesAllowedSection) {
    $filesAllowedSection = ''
}
$scope = Get-WorkPackageScope -SectionText $filesAllowedSection
$modifiedFiles = @(Get-GitModifiedFiles)
$outOfScopeFiles = @()
foreach ($file in $modifiedFiles) {
    if (-not (Test-PathAllowed -Path $file -AllowedPatterns $scope.Allowed)) {
        $outOfScopeFiles += $file
    }
}

$codeRecorded = Test-ResultSectionRecorded -Value $sectionMap['Code Results'] -PendingPattern '(?i)^\s*pending implementation\.?\s*$'
$auditRecorded = Test-ResultSectionRecorded -Value $sectionMap['Audit Results'] -PendingPattern '(?i)^\s*pending audit\.?\s*$'
$auditBlocked = Test-AuditBlocked -AuditText $sectionMap['Audit Results']
$decisionKind = Get-FinalDecisionKind -DecisionText $sectionMap['Final Decision']

$state = 'Unknown'
$nextAction = 'Review manually.'
$exitCode = 0

if ($outOfScopeFiles.Count -gt 0) {
    $state = 'BlockedMixedWorktree'
    $nextAction = 'Resolve unrelated dirty files or use a reviewed mixed-worktree exception before audit or finalization.'
    $exitCode = 2
} elseif ($missingPlanningSections.Count -gt 0) {
    $state = 'PlanningIncomplete'
    $nextAction = 'Complete missing planning sections before implementation.'
} elseif ($decisionKind -eq 'Accepted') {
    $state = 'AcceptedReadyForFinalization'
    $nextAction = 'Finalize with scripts/commit-work-package.ps1 after reviewing audit and human acceptance.'
} elseif ($decisionKind -eq 'Rejected' -or $decisionKind -eq 'Deferred') {
    $state = "Closed$decisionKind"
    $nextAction = 'Do not implement or finalize as accepted work; create a follow-up package if work remains.'
} elseif ($auditBlocked) {
    $state = 'AuditBlockedNeedsResolution'
    $nextAction = 'Resolve the audit blocker or record explicit human acceptance of the limitation before finalization.'
    $exitCode = 2
} elseif ($auditRecorded) {
    $state = 'AuditedNeedsFinalDecision'
    $nextAction = 'Human reviewer should accept, reject, defer, or request corrective work.'
} elseif ($codeRecorded) {
    $state = 'ImplementedNeedsAudit'
    $nextAction = 'Run the independent audit path for this work package.'
} else {
    $state = 'ReadyForImplementation'
    $nextAction = 'Run the code agent or implement the work package within the allowed scope.'
}

$result = [pscustomobject]@{
    workPackagePath = $relativePath
    state = $state
    nextAction = $nextAction
    codeResultsRecorded = $codeRecorded
    auditResultsRecorded = $auditRecorded
    auditBlocked = $auditBlocked
    finalDecision = $decisionKind
    missingPlanningSections = @($missingPlanningSections)
    missingPlanningSectionDetails = @($missingPlanningSectionDetails)
    allowedPatterns = @($scope.Allowed)
    prohibitedPatterns = @($scope.Prohibited)
    dirtyFiles = @($modifiedFiles)
    outOfScopeDirtyFiles = @($outOfScopeFiles)
}

if ($Json) {
    $result | ConvertTo-Json -Depth 6
} else {
    Write-Host "Work package: $($result.workPackagePath)"
    Write-Host "State: $($result.state)"
    Write-Host "Next action: $($result.nextAction)"
    Write-Host "Code results recorded: $($result.codeResultsRecorded)"
    Write-Host "Audit results recorded: $($result.auditResultsRecorded)"
    Write-Host "Final decision: $($result.finalDecision)"

    if ($result.missingPlanningSections.Count -gt 0) {
        Write-Host 'Missing planning sections:'
        foreach ($entry in $result.missingPlanningSectionDetails) {
            Write-Host "  - $($entry.section): $($entry.reason)"
        }
    }

    Write-Host 'Dirty files:'
    if ($result.dirtyFiles.Count -eq 0) {
        Write-Host '  - none'
    } else {
        foreach ($entry in $result.dirtyFiles) {
            Write-Host "  - $entry"
        }
    }

    Write-Host 'Out-of-scope dirty files:'
    if ($result.outOfScopeDirtyFiles.Count -eq 0) {
        Write-Host '  - none'
    } else {
        foreach ($entry in $result.outOfScopeDirtyFiles) {
            Write-Host "  - $entry"
        }
    }
}

exit $exitCode
