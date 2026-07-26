param(
    [Parameter(Position = 0, Mandatory = $true)]
    [string]$WorkPackagePath,

    [switch]$Json
)

$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Path $PSScriptRoot -Parent
. (Join-Path $PSScriptRoot 'lib/WorkPackageResolver.ps1')

function Resolve-WorkPackagePath {
    param([Parameter(Mandatory = $true)][string]$Path)

    return Resolve-WorkPackageInputPath -InputValue $Path -ProjectRoot $projectRoot
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

function Normalize-WorkPackagePath {
    param([Parameter(Mandatory = $true)][string]$Path)

    $normalized = $Path.Trim()
    $normalized = $normalized.Trim('`', '"', "'")
    $normalized = $normalized -replace '\\', '/'
    if ($normalized.StartsWith('./')) {
        $normalized = $normalized.Substring(2)
    }
    return $normalized.ToLowerInvariant()
}

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

function Get-Subsection {
    param(
        [Parameter(Mandatory = $true)][string]$Content,
        [Parameter(Mandatory = $true)][string]$Heading
    )

    $escaped = [regex]::Escape($Heading)
    $match = [regex]::Match($Content, "(?ms)^###\s+$escaped\s*\r?\n(.*?)(?=^###\s+|^##\s+|\z)")
    if (-not $match.Success) {
        return ''
    }

    return $match.Groups[1].Value.Trim()
}

function Get-LinesAfterLabel {
    param(
        [Parameter(Mandatory = $true)][string]$Content,
        [Parameter(Mandatory = $true)][string]$Label
    )

    $items = @()
    $lines = $Content -split "\r?\n"
    $inside = $false
    foreach ($line in $lines) {
        if ($line -match "^\s*-\s+$([regex]::Escape($Label))\s*:\s*(.*)$") {
            $inside = $true
            $tail = $matches[1].Trim()
            if (-not [string]::IsNullOrWhiteSpace($tail)) {
                $items += $tail
            }
            continue
        }

        if ($inside) {
            if ($line -match '^\s*-\s+[A-Za-z][A-Za-z /-]*\s*:') {
                break
            }
            if ($line -match '^\s*[-*]\s+(.+?)\s*$') {
                $items += $matches[1].Trim()
                continue
            }
            if ($line -match '^\s{2,}[-*]\s+(.+?)\s*$') {
                $items += $matches[1].Trim()
                continue
            }
            if (-not [string]::IsNullOrWhiteSpace($line) -and $line -notmatch '^\s*$') {
                $items += $line.Trim()
            }
        }
    }

    return @($items | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
}

function Test-NoAutomatedValidationExplanation {
    param([string[]]$Lines)

    foreach ($line in $Lines) {
        $trimmed = $line.Trim().Trim('`')
        if ($trimmed -match '^(powershell|npm|git|node|npx|pwsh|vitest|playwright)\b') {
            continue
        }
        if ($trimmed -match '(?i)\b(no automated|none|not applicable|manual only|documentation-only|docs-only)\b') {
            return $true
        }
    }

    return $false
}

function Get-CommandCandidates {
    param([string]$Content)

    $commands = @()
    foreach ($line in ($Content -split "\r?\n")) {
        $trimmed = $line.Trim()
        if ([string]::IsNullOrWhiteSpace($trimmed)) {
            continue
        }

        $candidate = $null
        if ($trimmed -match '^[-*]\s+`(.+?)`\s*$') {
            $candidate = $matches[1].Trim()
        } elseif ($trimmed -match '^[-*]\s+((?:powershell|npm|git|node|npx|pwsh|vitest|playwright)\b.+)$') {
            $candidate = $matches[1].Trim()
            $candidate = $candidate.Trim('`')
        } elseif ($trimmed -match '^(powershell|npm|git|node|npx|pwsh|vitest|playwright)\b') {
            $candidate = $trimmed.Trim('`')
        }

        if (-not [string]::IsNullOrWhiteSpace($candidate)) {
            $commands += $candidate
        }
    }

    return @($commands | Select-Object -Unique)
}

function Get-ValidationEvidence {
    param([string]$Content)

    $evidence = @()
    foreach ($line in ($Content -split "\r?\n")) {
        $trimmed = $line.Trim()
        if ([string]::IsNullOrWhiteSpace($trimmed)) {
            continue
        }

        if ($trimmed -match '(?i)^#+\s+Validation\b' -or $trimmed -match '(?i)^Validation\s*:\s*$' -or $trimmed -match '(?i)^[-*]\s+(PASS|FAIL|SKIP|BLOCKED)\s*:') {
            $evidence += $trimmed
        }
    }

    return @($evidence | Select-Object -Unique)
}

function New-ValidationRecommendation {
    param(
        [Parameter(Mandatory = $true)][string]$State,
        [string[]]$PlannedCommands = @(),
        [string[]]$ValidationEvidence = @(),
        [bool]$NoAutomatedValidationExplained = $false,
        [string[]]$MissingFindings = @()
    )

    $action = 'add_validation_plan'
    $summary = 'Add explicit verification commands or a clear no-automated-tests explanation before implementation or audit.'
    $requiresAction = $true
    $reviewRequired = $true
    $blocksAuditReadiness = $true

    if ($State -eq 'ValidationEvidenceRecorded') {
        $action = 'review_recorded_evidence'
        $summary = 'Review recorded validation evidence during audit and acceptance.'
        $requiresAction = $false
        $reviewRequired = $true
        $blocksAuditReadiness = $false
    }
    elseif ($State -eq 'ValidationPlanReady') {
        $action = 'run_planned_validation'
        $summary = 'Run or record the planned validation commands during implementation.'
        $requiresAction = $true
        $reviewRequired = $false
        $blocksAuditReadiness = $false
    }
    elseif ($State -eq 'NoAutomatedValidationExplained') {
        $action = 'review_no_automation_explanation'
        $summary = 'Review the no-automated-validation explanation during audit.'
        $requiresAction = $false
        $reviewRequired = $true
        $blocksAuditReadiness = $false
    }

    return [pscustomobject]@{
        kind = 'validation_plan_recommendation'
        action = $action
        summary = $summary
        requiresAction = $requiresAction
        reviewRequired = $reviewRequired
        blocksAuditReadiness = $blocksAuditReadiness
        commandsToRun = @($PlannedCommands)
        evidenceToReview = @($ValidationEvidence)
        missingFindings = @($MissingFindings)
        noAutomatedValidationExplained = $NoAutomatedValidationExplained
    }
}

$resolvedPath = Resolve-WorkPackagePath -Path $WorkPackagePath
$relativePath = Normalize-WorkPackagePath -Path (Get-ProjectRelativePath -Path $resolvedPath)
$content = Get-Content -LiteralPath $resolvedPath -Raw

$impactAnalysis = Get-MarkdownSection -Content $content -Heading 'Impact Analysis'
$regressionSurface = Get-Subsection -Content $impactAnalysis -Heading 'Regression Surface'
$relatedTests = @(Get-LinesAfterLabel -Content $regressionSurface -Label 'Related tests')
$relatedTestsExplainNoAutomation = Test-NoAutomatedValidationExplanation -Lines $relatedTests

$codePrompt = Get-MarkdownSection -Content $content -Heading 'Code Prompt'
$auditPrompt = Get-MarkdownSection -Content $content -Heading 'Audit Prompt'
$codeResults = Get-MarkdownSection -Content $content -Heading 'Code Results'

$plannedCommands = @()
$plannedCommands += Get-CommandCandidates -Content $codePrompt
$plannedCommands += Get-CommandCandidates -Content $auditPrompt
$plannedCommands += Get-CommandCandidates -Content (($codePrompt + [Environment]::NewLine + $auditPrompt) -replace '(?ms)^.*?Verification:\s*', '')
$plannedCommands = @($plannedCommands | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Select-Object -Unique)

$validationEvidence = @(Get-ValidationEvidence -Content $codeResults)
$hasPlan = ($plannedCommands.Count -gt 0 -or ($relatedTests.Count -gt 0 -and -not $relatedTestsExplainNoAutomation))
$hasNoAutomationExplanation = $relatedTestsExplainNoAutomation
$hasEvidence = ($validationEvidence.Count -gt 0)

$state = 'ValidationPlanMissing'
$nextAction = 'Add explicit verification commands or a clear no-automated-tests explanation before implementation or audit.'
$exitCode = 2
$missingFindings = @()

if ($hasEvidence) {
    $state = 'ValidationEvidenceRecorded'
    $nextAction = 'Review recorded validation evidence during audit and acceptance.'
    $exitCode = 0
} elseif ($hasPlan) {
    $state = 'ValidationPlanReady'
    $nextAction = 'Run or record the planned validation commands during implementation.'
    $exitCode = 0
} elseif ($hasNoAutomationExplanation) {
    $state = 'NoAutomatedValidationExplained'
    $nextAction = 'Review the no-automated-validation explanation during audit.'
    $exitCode = 0
} else {
    if ($relatedTests.Count -eq 0) {
        $missingFindings += 'No related tests listed in Impact Analysis / Regression Surface.'
    }
    if ($plannedCommands.Count -eq 0) {
        $missingFindings += 'No verification commands found in Code Prompt or Audit Prompt.'
    }
}

$recommendation = New-ValidationRecommendation `
    -State $state `
    -PlannedCommands $plannedCommands `
    -ValidationEvidence $validationEvidence `
    -NoAutomatedValidationExplained $hasNoAutomationExplanation `
    -MissingFindings $missingFindings

$result = [pscustomobject]@{
    workPackagePath = $relativePath
    state = $state
    nextAction = $nextAction
    relatedTests = @($relatedTests)
    plannedVerificationCommands = @($plannedCommands)
    validationEvidence = @($validationEvidence)
    noAutomatedValidationExplained = $hasNoAutomationExplanation
    missingFindings = @($missingFindings)
    recommendation = $recommendation
}

if ($Json) {
    $result | ConvertTo-Json -Depth 6
} else {
    Write-Host "Work package: $($result.workPackagePath)"
    Write-Host "State: $($result.state)"
    Write-Host "Next action: $($result.nextAction)"
    Write-Host "No automated validation explained: $($result.noAutomatedValidationExplained)"
    Write-Host "Recommendation: $($result.recommendation.action)"
    Write-Host "Blocks audit readiness: $($result.recommendation.blocksAuditReadiness)"

    Write-Host 'Related tests:'
    if ($result.relatedTests.Count -eq 0) {
        Write-Host '  - none'
    } else {
        foreach ($entry in $result.relatedTests) {
            Write-Host "  - $entry"
        }
    }

    Write-Host 'Planned verification commands:'
    if ($result.plannedVerificationCommands.Count -eq 0) {
        Write-Host '  - none'
    } else {
        foreach ($entry in $result.plannedVerificationCommands) {
            Write-Host "  - $entry"
        }
    }

    Write-Host 'Validation evidence:'
    if ($result.validationEvidence.Count -eq 0) {
        Write-Host '  - none'
    } else {
        foreach ($entry in $result.validationEvidence) {
            Write-Host "  - $entry"
        }
    }

    Write-Host 'Missing findings:'
    if ($result.missingFindings.Count -eq 0) {
        Write-Host '  - none'
    } else {
        foreach ($entry in $result.missingFindings) {
            Write-Host "  - $entry"
        }
    }
}

exit $exitCode
