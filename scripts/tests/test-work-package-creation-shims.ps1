param()

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Path (Split-Path -Path $PSScriptRoot -Parent) -Parent
$liteShimPath = Join-Path $repoRoot 'scripts/new-lite-work-package.ps1'
$liteImplementationPath = Join-Path $repoRoot 'scripts/work-package/new-lite-work-package.ps1'
$legacyWrapperPath = Join-Path $repoRoot 'scripts/new-work-package.ps1'
$workPackageDirectory = Join-Path $repoRoot 'docs/01-work-packages'
$tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ('sequel-wp-creation-shims-' + [guid]::NewGuid().ToString('N'))

function Assert-Contains {
    param(
        [Parameter(Mandatory = $true)][string]$Text,
        [Parameter(Mandatory = $true)][string]$Pattern,
        [Parameter(Mandatory = $true)][string]$Message
    )

    if ($Text -notmatch $Pattern) {
        throw $Message
    }
}

function Assert-NotContains {
    param(
        [Parameter(Mandatory = $true)][string]$Text,
        [Parameter(Mandatory = $true)][string]$Pattern,
        [Parameter(Mandatory = $true)][string]$Message
    )

    if ($Text -match $Pattern) {
        throw $Message
    }
}

function Assert-Equal {
    param(
        [Parameter(Mandatory = $true)][object]$Actual,
        [Parameter(Mandatory = $true)][object]$Expected,
        [Parameter(Mandatory = $true)][string]$Message
    )

    if ($Actual -ne $Expected) {
        throw "$Message Expected '$Expected' but got '$Actual'."
    }
}

function Assert-True {
    param(
        [Parameter(Mandatory = $true)][bool]$Condition,
        [Parameter(Mandatory = $true)][string]$Message
    )

    if (-not $Condition) {
        throw $Message
    }
}

function Assert-PathExists {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string]$Message
    )

    if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
        throw $Message
    }
}

function Assert-Parses {
    param([Parameter(Mandatory = $true)][string]$Path)

    $tokens = $null
    $parseErrors = $null
    [System.Management.Automation.Language.Parser]::ParseFile($Path, [ref]$tokens, [ref]$parseErrors) | Out-Null
    if ($parseErrors -and $parseErrors.Count -gt 0) {
        $formattedErrors = $parseErrors | ForEach-Object { $_.Message } | Out-String
        throw "$Path has parse errors:`n$formattedErrors"
    }
}

function Get-ParameterSignature {
    param([Parameter(Mandatory = $true)][string]$Path)

    $tokens = $null
    $parseErrors = $null
    $ast = [System.Management.Automation.Language.Parser]::ParseFile($Path, [ref]$tokens, [ref]$parseErrors)
    if ($parseErrors -and $parseErrors.Count -gt 0) {
        throw "Cannot inspect parameters for unparsable script: $Path"
    }

    return @(
        foreach ($parameter in $ast.ParamBlock.Parameters) {
            $aliases = @(
                foreach ($attribute in $parameter.Attributes) {
                    if ($attribute.TypeName.GetReflectionType().FullName -eq 'System.Management.Automation.AliasAttribute') {
                        foreach ($argument in $attribute.PositionalArguments) {
                            $argument.Value
                        }
                    }
                }
            )

            $validateRanges = @(
                foreach ($attribute in $parameter.Attributes) {
                    if ($attribute.TypeName.GetReflectionType().FullName -eq 'System.Management.Automation.ValidateRangeAttribute') {
                        ($attribute.PositionalArguments | ForEach-Object { $_.Extent.Text }) -join '..'
                    }
                }
            )

            [pscustomobject]@{
                Name = $parameter.Name.VariablePath.UserPath
                Attributes = ($parameter.Attributes | ForEach-Object { $_.TypeName.GetReflectionType().FullName }) -join ','
                Aliases = ($aliases -join ',')
                ValidateRange = ($validateRanges -join ',')
            }
        }
    )
}

function Invoke-Generator {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string]$Slug,
        [Parameter(Mandatory = $true)][string]$DestinationDirectory,
        [int]$Number
    )

    $arguments = @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $Path, $Slug, '-DestinationDirectory', $DestinationDirectory)
    if ($PSBoundParameters.ContainsKey('Number')) {
        $arguments += @('-Number', $Number)
    }

    $output = & powershell @arguments 2>&1 | Out-String
    if ($LASTEXITCODE -ne 0) {
        throw "Generator failed for $Path. Output:`n$output"
    }

    return $output
}

function Assert-TemplateShape {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string]$ExpectedTitle
    )

    $content = Get-Content -LiteralPath $Path -Raw
    Assert-Contains -Text $content -Pattern ('(?m)^# ' + [regex]::Escape($ExpectedTitle) + '$') -Message 'Generated WP title changed.'

    $expectedHeadings = @(
        '## Objective',
        '## Scope',
        '## Impact Analysis',
        '## Files Allowed to Change',
        '## Constraints',
        '## Required Behavior',
        '## Acceptance Criteria',
        '## Code Prompt',
        '## Audit Prompt',
        '## Code Results',
        '## Audit Results',
        '## Final Decision'
    )

    foreach ($heading in $expectedHeadings) {
        Assert-Contains -Text $content -Pattern ('(?m)^' + [regex]::Escape($heading) + '\r?$') -Message "Generated WP missing heading $heading."
    }
}

function Get-OwnedRepoTempFixtures {
    return @(
        Get-ChildItem -LiteralPath $workPackageDirectory -Force -File -ErrorAction SilentlyContinue |
            Where-Object { $_.Name -match '^WP-9\d{3}-.+temp\.md$' } |
            Select-Object -ExpandProperty FullName
    )
}

try {
    $beforeRepoFixtures = @(Get-OwnedRepoTempFixtures)

    Assert-Parses -Path $liteShimPath
    Assert-Parses -Path $liteImplementationPath
    Assert-Parses -Path $legacyWrapperPath

    $shimSource = Get-Content -LiteralPath $liteShimPath -Raw
    Assert-Contains -Text $shimSource -Pattern 'work-package/new-lite-work-package\.ps1' -Message 'Lite generator shim does not delegate to scripts/work-package.'
    Assert-Contains -Text $shimSource -Pattern '@PSBoundParameters' -Message 'Lite generator shim does not forward bound parameters.'

    $implementationSource = Get-Content -LiteralPath $liteImplementationPath -Raw
    Assert-Contains -Text $implementationSource -Pattern '\$scriptRoot\s*=\s*Split-Path\s+-Path\s+\$PSScriptRoot\s+-Parent' -Message 'Moved lite generator does not resolve scripts root from scripts/work-package.'
    Assert-Contains -Text $implementationSource -Pattern "docs/01-work-packages" -Message 'Moved lite generator does not preserve default work-package destination.'

    $legacySource = Get-Content -LiteralPath $legacyWrapperPath -Raw
    Assert-Contains -Text $legacySource -Pattern 'new-lite-work-package\.ps1' -Message 'Legacy generator wrapper does not route through the lite generator.'
    Assert-Contains -Text $legacySource -Pattern 'retained for compatibility' -Message 'Legacy generator wrapper does not retain compatibility warning.'

    $shimSignature = @(Get-ParameterSignature -Path $liteShimPath | ConvertTo-Json -Compress)
    $implementationSignature = @(Get-ParameterSignature -Path $liteImplementationPath | ConvertTo-Json -Compress)
    Assert-Equal -Actual ($shimSignature -join '') -Expected ($implementationSignature -join '') -Message 'Lite generator shim parameter contract differs from implementation.'

    New-Item -ItemType Directory -Force -Path $tempRoot | Out-Null

    $topLevelDir = Join-Path $tempRoot 'top-level'
    $topLevelOutput = Invoke-Generator -Path $liteShimPath -Slug 'Example Package Temp' -DestinationDirectory $topLevelDir -Number 9001
    $topLevelPath = Join-Path $topLevelDir 'WP-9001-example-package-temp.md'
    Assert-PathExists -Path $topLevelPath -Message 'Top-level lite generator did not create expected file.'
    Assert-Contains -Text $topLevelOutput -Pattern 'Created:' -Message 'Top-level lite generator did not print creation message.'
    Assert-TemplateShape -Path $topLevelPath -ExpectedTitle 'Example Package Temp'

    $movedDir = Join-Path $tempRoot 'moved'
    $movedOutput = Invoke-Generator -Path $liteImplementationPath -Slug 'Moved Package Temp' -DestinationDirectory $movedDir -Number 9002
    $movedPath = Join-Path $movedDir 'WP-9002-moved-package-temp.md'
    Assert-PathExists -Path $movedPath -Message 'Moved lite generator did not create expected file.'
    Assert-Contains -Text $movedOutput -Pattern 'Created:' -Message 'Moved lite generator did not print creation message.'
    Assert-TemplateShape -Path $movedPath -ExpectedTitle 'Moved Package Temp'

    $legacyDir = Join-Path $tempRoot 'legacy'
    $legacyOutput = Invoke-Generator -Path $legacyWrapperPath -Slug 'Legacy Package Temp' -DestinationDirectory $legacyDir -Number 9003
    $legacyPath = Join-Path $legacyDir 'WP-9003-legacy-package-temp.md'
    Assert-PathExists -Path $legacyPath -Message 'Legacy generator did not create expected file.'
    Assert-Contains -Text $legacyOutput -Pattern 'retained for compatibility' -Message 'Legacy generator did not emit compatibility warning.'
    Assert-TemplateShape -Path $legacyPath -ExpectedTitle 'Legacy Package Temp'

    $collisionDir = Join-Path $tempRoot 'collision'
    New-Item -ItemType Directory -Force -Path $collisionDir | Out-Null
    $collisionOutput1 = Invoke-Generator -Path $liteShimPath -Slug 'Collision Package Temp' -DestinationDirectory $collisionDir -Number 9004
    $collisionOutput2 = Invoke-Generator -Path $liteShimPath -Slug 'Collision Package Temp' -DestinationDirectory $collisionDir -Number 9004
    Assert-PathExists -Path (Join-Path $collisionDir 'WP-9004-collision-package-temp.md') -Message 'First collision fixture was not created.'
    Assert-PathExists -Path (Join-Path $collisionDir 'WP-9004-collision-package-temp-2.md') -Message 'Collision suffix fixture was not created.'
    Assert-Contains -Text $collisionOutput1 -Pattern 'WP-9004-collision-package-temp\.md' -Message 'First collision output did not name expected file.'
    Assert-Contains -Text $collisionOutput2 -Pattern 'WP-9004-collision-package-temp-2\.md' -Message 'Second collision output did not name expected suffixed file.'

    $slugDir = Join-Path $tempRoot 'slug'
    $slugOutput = Invoke-Generator -Path $liteShimPath -Slug '  Mixed___Slug!!! Temp  ' -DestinationDirectory $slugDir -Number 9005
    Assert-PathExists -Path (Join-Path $slugDir 'WP-9005-mixed-slug-temp.md') -Message 'Slug normalization changed.'
    Assert-Contains -Text $slugOutput -Pattern 'WP-9005-mixed-slug-temp\.md' -Message 'Slug output did not use normalized slug.'

    $afterRepoFixtures = @(Get-OwnedRepoTempFixtures)
    Assert-Equal -Actual ($afterRepoFixtures -join '|') -Expected ($beforeRepoFixtures -join '|') -Message 'Package-creation tests left owned temp fixtures in docs/01-work-packages.'
}
finally {
    Remove-Item -LiteralPath $tempRoot -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host 'PASS work-package creation shim checks'
