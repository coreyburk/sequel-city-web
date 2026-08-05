param(
    [Parameter(Position = 0)]
    [Alias("Name", "Task", "Id", "Title")]
    [string]$Slug,

    [ValidateRange(1, [int]::MaxValue)]
    [int]$Number,

    [string]$DestinationDirectory
)

$generatorPath = Join-Path $PSScriptRoot 'work-package/new-lite-work-package.ps1'
if (-not (Test-Path -LiteralPath $generatorPath -PathType Leaf)) {
    throw "Lite work-package generator implementation was not found: $generatorPath"
}

& $generatorPath @PSBoundParameters
