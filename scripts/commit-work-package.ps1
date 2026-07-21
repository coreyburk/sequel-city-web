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

    [switch]$AllowMixedWorktree,

    [string]$Remote = 'origin',

    [string]$Branch
)

$projectRoot = Split-Path -Path $PSScriptRoot -Parent
. (Join-Path $PSScriptRoot 'lib/WorkPackageResolver.ps1')

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

function Normalize-WorkPackagePath {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path
    )

    $normalized = $Path.Trim()
    if ([string]::IsNullOrWhiteSpace($normalized)) {
        return $null
    }

    $normalized = $normalized.Trim('`', '"', "'", ' ')
    $normalized = $normalized -replace '\bonly\b\s*$', ''
    $normalized = $normalized -replace '^[.][\\/]', ''
    $normalized = $normalized -replace '\\', '/'
    $normalized = $normalized.Trim()

    if ([string]::IsNullOrWhiteSpace($normalized)) {
        return $null
    }

    return $normalized.ToLowerInvariant()
}

function Get-WorkPackageScopeLists {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Content
    )

    $sectionBody = Get-SectionBody -Content $Content -Heading 'Files Allowed to Change'
    $allowedFiles = New-Object System.Collections.Generic.List[string]
    $prohibitedFiles = New-Object System.Collections.Generic.List[string]
    $lines = $sectionBody -split "\r?\n"

    $allowedMarker = '^\s*Allowed\s*:\s*$'
    $prohibitedMarker = '^\s*(Do\s+Not\s+Modify|Prohibited|Disallowed|Not\s+Allowed)\s*:\s*$'

    $hasAllowedMarker = $false
    foreach ($line in $lines) {
        if ($line -match $allowedMarker) {
            $hasAllowedMarker = $true
            break
        }
    }

    $mode = if ($hasAllowedMarker) { 'pending' } else { 'allowed' }

    foreach ($line in $lines) {
        if ($line -match $allowedMarker) {
            $mode = 'allowed'
            continue
        }
        if ($line -match $prohibitedMarker) {
            $mode = 'prohibited'
            continue
        }

        if ($mode -eq 'pending') {
            continue
        }

        if ($mode -eq 'allowed') {
            $target = $allowedFiles
        }
        else {
            $target = $prohibitedFiles
        }
        $pathMatches = [regex]::Matches($line, '`([^`]+)`')
        if ($pathMatches.Count -gt 0) {
            foreach ($match in $pathMatches) {
                $normalizedPath = Normalize-WorkPackagePath -Path $match.Groups[1].Value
                if (-not [string]::IsNullOrWhiteSpace($normalizedPath) -and -not $target.Contains($normalizedPath)) {
                    [void]$target.Add($normalizedPath)
                }
            }

            continue
        }

        $candidate = $line.Trim()
        if ([string]::IsNullOrWhiteSpace($candidate)) {
            continue
        }

        $candidate = $candidate -replace '^[\*\-\u2022]\s*', ''
        $candidate = $candidate -replace '\s+only\s*$', ''

        if ($candidate -notmatch '[\\/]') {
            continue
        }

        $normalizedCandidate = Normalize-WorkPackagePath -Path $candidate
        if (-not [string]::IsNullOrWhiteSpace($normalizedCandidate) -and -not $target.Contains($normalizedCandidate)) {
            [void]$target.Add($normalizedCandidate)
        }
    }

    return @{
        Allowed = @($allowedFiles)
        Prohibited = @($prohibitedFiles)
    }
}

function Test-WorkPackagePathAllowed {
    param(
        [Parameter(Mandatory = $true)]
        [AllowEmptyString()]
        [string]$Path,

        [AllowEmptyCollection()]
        [string[]]$AllowedPatterns
    )

    if ([string]::IsNullOrWhiteSpace($Path)) {
        return $false
    }

    if (-not $AllowedPatterns -or $AllowedPatterns.Count -eq 0) {
        return $false
    }

    foreach ($pattern in $AllowedPatterns) {
        if ([string]::IsNullOrWhiteSpace($pattern)) {
            continue
        }

        if ($pattern -eq $Path) {
            return $true
        }

        if ($pattern.EndsWith('/**')) {
            $prefix = $pattern.Substring(0, $pattern.Length - 3).TrimEnd('/')
            if ([string]::IsNullOrWhiteSpace($prefix)) {
                continue
            }

            if ($Path -eq $prefix -or $Path.StartsWith($prefix + '/')) {
                return $true
            }
        }
    }

    return $false
}

function Get-GitModifiedFiles {
    $gitStatusOutput = & git -C $projectRoot status --porcelain
    if ($LASTEXITCODE -ne 0) {
        throw 'Failed to capture modified files with git status --porcelain.'
    }

    $modifiedFiles = New-Object System.Collections.Generic.List[string]

    foreach ($line in $gitStatusOutput) {
        if ([string]::IsNullOrWhiteSpace($line) -or $line.Length -lt 4) {
            continue
        }

        $statusCode = $line.Substring(0, 2)
        $pathText = $line.Substring(3).Trim()

        if ([string]::IsNullOrWhiteSpace($pathText)) {
            continue
        }

        if ($statusCode -match 'D') {
            continue
        }

        if ($statusCode -notmatch '[MARC\?]') {
            continue
        }

        if ($pathText -match ' -> ') {
            $pathText = ($pathText -split ' -> ', 2)[1]
        }

        $normalizedPath = Normalize-WorkPackagePath -Path $pathText
        if (-not [string]::IsNullOrWhiteSpace($normalizedPath) -and -not $modifiedFiles.Contains($normalizedPath)) {
            [void]$modifiedFiles.Add($normalizedPath)
        }
    }

    return @($modifiedFiles)
}

function Assert-WorktreeIsolatedForWorkPackage {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Content
    )

    $scopeLists = Get-WorkPackageScopeLists -Content $Content
    $allowedFiles = $scopeLists.Allowed
    $modifiedFiles = Get-GitModifiedFiles
    $outOfScopeFiles = @($modifiedFiles | Where-Object { -not (Test-WorkPackagePathAllowed -Path $_ -AllowedPatterns $allowedFiles) })

    if ($outOfScopeFiles.Count -eq 0) {
        return
    }

    $details = ($outOfScopeFiles | ForEach-Object { "- $_" }) -join [Environment]::NewLine
    throw "Mixed worktree detected before accepted work-package commit. Resolve unrelated dirty files or rerun with -AllowMixedWorktree for an intentional exception.`nOut-of-scope files:`n$details"
}

if (-not (Test-Path -LiteralPath (Join-Path $projectRoot '.git') -PathType Container)) {
    throw "Not a git repository root: $projectRoot"
}

$resolvedWorkPackagePath = Resolve-WorkPackageInputPath -InputValue $WorkPackagePath -ProjectRoot $projectRoot

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

if ($AllowMixedWorktree) {
    Write-Host 'WORKTREE ISOLATION OVERRIDE: continuing with dirty files outside this work package because -AllowMixedWorktree was provided.'
}
else {
    Assert-WorktreeIsolatedForWorkPackage -Content $workPackageContent
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
