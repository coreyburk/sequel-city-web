$ErrorActionPreference = 'Stop'

function ConvertTo-WorkPackageSlug {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Value
    )

    $normalized = $Value.Trim().ToLowerInvariant()
    $normalized = $normalized -replace '[^a-z0-9]+', '-'
    $normalized = $normalized -replace '-{2,}', '-'
    return $normalized.Trim('-')
}

function Resolve-WorkPackageInputPath {
    param(
        [Parameter(Mandatory = $true)]
        [string]$InputValue,

        [Parameter(Mandatory = $true)]
        [string]$ProjectRoot,

        [string]$WorkPackageDirectory = (Join-Path $ProjectRoot 'docs/01-work-packages')
    )

    $trimmed = $InputValue.Trim()
    if ([string]::IsNullOrWhiteSpace($trimmed)) {
        throw 'Work package filename, path, number, or slug is required.'
    }

    if (-not (Test-Path -LiteralPath $WorkPackageDirectory -PathType Container)) {
        throw "Work package directory is missing: $WorkPackageDirectory"
    }

    if ([System.IO.Path]::IsPathRooted($trimmed)) {
        if (-not (Test-Path -LiteralPath $trimmed -PathType Leaf)) {
            throw "Work package file was not found: $trimmed"
        }

        return [System.IO.Path]::GetFullPath($trimmed)
    }

    $directPath = Join-Path $ProjectRoot $trimmed
    if (Test-Path -LiteralPath $directPath -PathType Leaf) {
        return [System.IO.Path]::GetFullPath($directPath)
    }

    if ($trimmed -match '\.md$') {
        $workPackagePath = Join-Path $WorkPackageDirectory $trimmed
        if (-not (Test-Path -LiteralPath $workPackagePath -PathType Leaf)) {
            throw "Work package file was not found: $workPackagePath"
        }

        return [System.IO.Path]::GetFullPath($workPackagePath)
    }

    if ($trimmed -match '^(?i)WP-\d{3,}$') {
        $matchingWorkPackages = @(Get-ChildItem -LiteralPath $WorkPackageDirectory -Filter "$trimmed-*.md" -File)

        if ($matchingWorkPackages.Count -eq 0) {
            throw "No work package matches number '$trimmed' in $WorkPackageDirectory"
        }

        if ($matchingWorkPackages.Count -gt 1) {
            $matchList = $matchingWorkPackages | ForEach-Object { $_.FullName } | Out-String
            throw "Multiple work packages match number '$trimmed':`n$matchList"
        }

        return [System.IO.Path]::GetFullPath($matchingWorkPackages[0].FullName)
    }

    if ($trimmed -match '^WP-\d{4}-\d{2}-\d{2}-') {
        $workPackagePath = Join-Path $WorkPackageDirectory "$trimmed.md"
        if (-not (Test-Path -LiteralPath $workPackagePath -PathType Leaf)) {
            throw "Work package file was not found: $workPackagePath"
        }

        return [System.IO.Path]::GetFullPath($workPackagePath)
    }

    $normalizedSlug = ConvertTo-WorkPackageSlug -Value $trimmed
    if ([string]::IsNullOrWhiteSpace($normalizedSlug)) {
        throw 'Work package slug is empty after normalization.'
    }

    $matchingWorkPackages = @(Get-ChildItem -LiteralPath $WorkPackageDirectory -Filter "WP-*-$normalizedSlug.md" -File |
        Where-Object { $_.BaseName -match "-$([regex]::Escape($normalizedSlug))$" })

    if ($matchingWorkPackages.Count -eq 0) {
        throw "No work package matches slug '$normalizedSlug' in $WorkPackageDirectory"
    }

    if ($matchingWorkPackages.Count -gt 1) {
        $matchList = $matchingWorkPackages | ForEach-Object { $_.FullName } | Out-String
        throw "Multiple work packages match slug '$normalizedSlug':`n$matchList"
    }

    return [System.IO.Path]::GetFullPath($matchingWorkPackages[0].FullName)
}
