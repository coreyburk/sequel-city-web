param(
    [Parameter(Position = 0)]
    [Alias("Name", "Task", "Id", "Title")]
    [string]$Slug,

    [ValidateRange(1, [int]::MaxValue)]
    [int]$Number
)

$projectRoot = Split-Path -Path $PSScriptRoot -Parent
$destinationDirectory = Join-Path $projectRoot 'docs/01-work-packages'

function ConvertTo-Slug {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Value
    )

    $normalized = $Value.Trim().ToLowerInvariant()
    $normalized = $normalized -replace '[^a-z0-9]+', '-'
    $normalized = $normalized -replace '-{2,}', '-'
    return $normalized.Trim('-')
}

function Get-NextWorkPackageNumber {
    $highestNumber = 0
    $existingFiles = Get-ChildItem -LiteralPath $destinationDirectory -Filter 'WP-*.md' -File -ErrorAction SilentlyContinue

    foreach ($existingFile in $existingFiles) {
        if ($existingFile.BaseName -match '^WP-(\d{3})-[a-z0-9-]+$') {
            $currentNumber = [int]$matches[1]
            if ($currentNumber -gt $highestNumber) {
                $highestNumber = $currentNumber
            }
        }
    }

    return ($highestNumber + 1)
}

function New-WorkPackagePath {
    param(
        [Parameter(Mandatory = $true)]
        [ValidateRange(1, [int]::MaxValue)]
        [int]$WorkPackageNumber,

        [Parameter(Mandatory = $true)]
        [string]$NormalizedSlug
    )

    $numberPrefix = 'WP-{0:D3}' -f $WorkPackageNumber
    $baseFileName = "$numberPrefix-$NormalizedSlug"
    $candidatePath = Join-Path $destinationDirectory "$baseFileName.md"

    if (-not (Test-Path -LiteralPath $candidatePath)) {
        return $candidatePath
    }

    $suffix = 2
    while ($true) {
        $candidatePath = Join-Path $destinationDirectory "$baseFileName-$suffix.md"
        if (-not (Test-Path -LiteralPath $candidatePath)) {
            return $candidatePath
        }

        $suffix++
    }
}

$rawSlug = $Slug
if ([string]::IsNullOrWhiteSpace($rawSlug)) {
    $rawSlug = Read-Host 'Enter lite work package slug'
}

$normalizedSlug = ConvertTo-Slug -Value $rawSlug

if ([string]::IsNullOrWhiteSpace($normalizedSlug)) {
    throw 'Lite work package slug is empty after normalization. Use letters, numbers, or spaces.'
}

$workPackageTitle = $rawSlug.Trim()

if (-not (Test-Path -LiteralPath $destinationDirectory -PathType Container)) {
    New-Item -ItemType Directory -Path $destinationDirectory -Force | Out-Null
}

$workPackageNumber = if ($PSBoundParameters.ContainsKey('Number')) { $Number } else { Get-NextWorkPackageNumber }
$destinationPath = New-WorkPackagePath -WorkPackageNumber $workPackageNumber -NormalizedSlug $normalizedSlug

$templateContent = @"
# $workPackageTitle

## Objective

State the single, concrete outcome this work package must achieve.

- No implementation detail
- No solution framing
- Must be testable

## Scope

Define exactly what is in and out.

### In Scope
- Explicit behaviors or fields to add/change
- Exact surfaces impacted

### Out of Scope
- Anything not explicitly listed
- Refactors
- UI redesign unless stated
- New dependencies

## Files Allowed to Change

List exact files.

- Only these files may be modified
- No new files unless explicitly allowed

## Constraints

Non-negotiable rules.

- Preserve existing behavior unless explicitly changing it
- No architectural changes
- No renaming outside scope
- No speculative improvements
- No "while we're here" changes

## Required Behavior

Describe the exact functional change.

- Use concise bullet points
- Keep requirements explicit and testable

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3
- [ ] No unrelated files changed

## Codex Prompt

Implement the required behavior exactly as specified.

Scope:
- Only modify the allowed files

Constraints:
- No refactors
- No new dependencies
- Preserve all existing behavior

Return:
- Exact code changes
- Short summary of what was implemented

## Gemini Audit Prompt

Audit this change against the work package.

Verify:
- All acceptance criteria are satisfied
- No files outside allowed list were modified
- No functional regression
- Behavior remains consistent outside scope

Output:
- Verdict: PASS or FAIL
- Violations
- Regressions
- Drift risks

## Codex Results

## Gemini Audit Results

## Final Decision
"@

Set-Content -LiteralPath $destinationPath -Value $templateContent -Encoding UTF8

Write-Host "Created: $destinationPath"
Write-Host ''
Write-Host 'Next steps:'
Write-Host '1. Fill in Objective, Scope, Files Allowed to Change, Constraints, and Acceptance Criteria.'
Write-Host '2. Write the implementation prompt under "Codex Prompt".'
Write-Host '3. Run scripts/run-work-package.ps1 when the package is ready.'
