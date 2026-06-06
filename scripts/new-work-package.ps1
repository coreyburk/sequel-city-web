param(
    [Parameter(Position = 0)]
    [Alias("Name", "Task", "Id", "Title")]
    [string]$Slug,

    [ValidateRange(1, [int]::MaxValue)]
    [int]$Number,

    [string]$DestinationDirectory
)

$generatorPath = Join-Path $PSScriptRoot 'new-lite-work-package.ps1'

if (-not (Test-Path -LiteralPath $generatorPath -PathType Leaf)) {
    throw "Supported work-package generator not found: $generatorPath"
}

Write-Warning 'scripts/new-work-package.ps1 is retained for compatibility. Use scripts/new-lite-work-package.ps1 for new work.'

$arguments = @{}
if ($PSBoundParameters.ContainsKey('Slug')) {
    $arguments.Slug = $Slug
}
if ($PSBoundParameters.ContainsKey('Number')) {
    $arguments.Number = $Number
}
if ($PSBoundParameters.ContainsKey('DestinationDirectory')) {
    $arguments.DestinationDirectory = $DestinationDirectory
}

& $generatorPath @arguments
