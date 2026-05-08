[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$WorkPackagePath,

    [Parameter(Mandatory = $true)]
    [string]$Title,

    [Parameter(Mandatory = $true)]
    [string[]]$Bullet,

    [string]$PreservationBullet,

    [string[]]$StagePath,

    [switch]$Preview,

    [switch]$Push,

    [string]$Remote = 'origin',

    [string]$Branch
)

$projectRoot = Split-Path -Path $PSScriptRoot -Parent

function Get-SectionBody {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Content,

        [Parameter(Mandatory = $true)]
        [string]$Heading
    )

    $pattern = "(?ms)^## $([regex]::Escape($Heading))\s*\r?\n(.*?)(?=^## |\z)"
    $match = [regex]::Match($Content, $pattern)
    if (-not $match.Success) {
        throw "Section '## $Heading' was not found."
    }

    return $match.Groups[1].Value.Trim()
}

function Normalize-BulletLine {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Value
    )

    $trimmed = $Value.Trim()
    if ([string]::IsNullOrWhiteSpace($trimmed)) {
        throw 'Bullet values must not be empty.'
    }

    $trimmed = $trimmed -replace '^[\-\*•]\s*', ''
    return "- $trimmed"
}

function Get-CurrentBranch {
    $branchName = (& git -C $projectRoot rev-parse --abbrev-ref HEAD).Trim()
    if ([string]::IsNullOrWhiteSpace($branchName)) {
        throw 'Unable to determine the current branch.'
    }

    return $branchName
}

function Test-AcceptedFinalDecision {
    param(
        [Parameter(Mandatory = $true)]
        [string]$DecisionText
    )

    return $DecisionText -match '(?im)\b(approved|accepted)\b'
}

if (-not (Test-Path -LiteralPath (Join-Path $projectRoot '.git') -PathType Container)) {
    throw "Not a git repository root: $projectRoot"
}

$resolvedWorkPackagePath = if ([System.IO.Path]::IsPathRooted($WorkPackagePath)) {
    $WorkPackagePath
}
else {
    Join-Path $projectRoot $WorkPackagePath
}

if (-not (Test-Path -LiteralPath $resolvedWorkPackagePath -PathType Leaf)) {
    throw "Work package file was not found: $resolvedWorkPackagePath"
}

$conventionalPrefixPattern = '^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\(.+\))?:\s+'
if ($Title.Trim() -match $conventionalPrefixPattern) {
    throw "Title uses a Conventional Commit prefix. Use the project format instead: imperative title, blank line, bullet list."
}

$workPackageContent = Get-Content -LiteralPath $resolvedWorkPackagePath -Raw
$finalDecision = Get-SectionBody -Content $workPackageContent -Heading 'Final Decision'
if (-not (Test-AcceptedFinalDecision -DecisionText $finalDecision)) {
    throw "The work package Final Decision must contain 'Approved' or 'Accepted' before committing."
}

$normalizedBullets = foreach ($entry in $Bullet) {
    Normalize-BulletLine -Value $entry
}

$messageLines = New-Object System.Collections.Generic.List[string]
[void]$messageLines.Add($Title.Trim())
[void]$messageLines.Add('')
foreach ($line in $normalizedBullets) {
    [void]$messageLines.Add($line)
}
if (-not [string]::IsNullOrWhiteSpace($PreservationBullet)) {
    [void]$messageLines.Add((Normalize-BulletLine -Value $PreservationBullet))
}

$commitMessage = ($messageLines -join [Environment]::NewLine).TrimEnd() + [Environment]::NewLine

if ($Preview) {
    Write-Host 'Previewing commit message:'
    Write-Host ''
    Write-Host $commitMessage
    return
}

if ($StagePath -and $StagePath.Count -gt 0) {
    & git -C $projectRoot add -- $StagePath
    if ($LASTEXITCODE -ne 0) {
        throw 'git add failed.'
    }
}

$stagedFiles = (& git -C $projectRoot diff --cached --name-only)
if ($LASTEXITCODE -ne 0) {
    throw 'Unable to inspect staged changes.'
}

if (-not $stagedFiles -or $stagedFiles.Count -eq 0) {
    throw 'No staged changes found. Stage files first or pass -StagePath.'
}

$tempFile = [System.IO.Path]::GetTempFileName()
try {
    [System.IO.File]::WriteAllText($tempFile, $commitMessage, [System.Text.UTF8Encoding]::new($false))
    & git -C $projectRoot commit -F $tempFile
    if ($LASTEXITCODE -ne 0) {
        throw 'git commit failed.'
    }

    if ($Push) {
        if ([string]::IsNullOrWhiteSpace($Branch)) {
            $Branch = Get-CurrentBranch
        }

        & git -C $projectRoot push $Remote $Branch
        if ($LASTEXITCODE -ne 0) {
            throw 'git push failed.'
        }
    }
}
finally {
    if (Test-Path -LiteralPath $tempFile) {
        Remove-Item -LiteralPath $tempFile -Force
    }
}
