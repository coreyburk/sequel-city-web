param()

$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Path $PSScriptRoot -Parent
$repoRoot = Split-Path -Path $scriptRoot -Parent
$understandScriptRoot = Join-Path $scriptRoot 'understand'
$tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ('sequel-understand-shim-test-' + [guid]::NewGuid().ToString('N'))

$commands = @(
    [pscustomobject]@{
        Name = 'check-understand-refresh-readiness.ps1'
        Parameters = @('PluginRoot', 'Json')
    },
    [pscustomobject]@{
        Name = 'refresh-understand-graph.ps1'
        Parameters = @('PluginRoot', 'DryRun', 'KeepIntermediate')
    }
)

function Assert-Equal {
    param(
        [Parameter(Mandatory = $true)][AllowNull()][object]$Actual,
        [Parameter(Mandatory = $true)][AllowNull()][object]$Expected,
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

function Assert-ContainsText {
    param(
        [Parameter(Mandatory = $true)][AllowEmptyString()][string]$Text,
        [Parameter(Mandatory = $true)][string]$Pattern,
        [Parameter(Mandatory = $true)][string]$Message
    )

    if ($Text -notmatch $Pattern) {
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

function Get-ScriptAst {
    param([Parameter(Mandatory = $true)][string]$Path)

    $parseErrors = $null
    $tokens = $null
    $ast = [System.Management.Automation.Language.Parser]::ParseFile($Path, [ref]$tokens, [ref]$parseErrors)
    if ($parseErrors -and $parseErrors.Count -gt 0) {
        $formattedErrors = $parseErrors | ForEach-Object { $_.Message } | Out-String
        throw "$Path has parse errors:`n$formattedErrors"
    }

    return $ast
}

function Get-ParamMetadata {
    param([Parameter(Mandatory = $true)][string]$Path)

    $ast = Get-ScriptAst -Path $Path
    $metadata = @{}

    foreach ($parameterAst in $ast.ParamBlock.Parameters) {
        $name = $parameterAst.Name.VariablePath.UserPath
        $default = $null
        if ($parameterAst.DefaultValue) {
            $default = $parameterAst.DefaultValue.Extent.Text
        }

        $typeName = $null
        if ($parameterAst.StaticType) {
            $typeName = $parameterAst.StaticType.FullName
        }

        $metadata[$name] = [pscustomobject]@{
            TypeName = $typeName
            Default = $default
        }
    }

    return $metadata
}

function Assert-ParameterCompatibility {
    param(
        [Parameter(Mandatory = $true)][string]$TopLevelPath,
        [Parameter(Mandatory = $true)][string]$ImplementationPath,
        [Parameter(Mandatory = $true)][string[]]$ExpectedParameters
    )

    $topLevelParams = Get-ParamMetadata -Path $TopLevelPath
    $implementationParams = Get-ParamMetadata -Path $ImplementationPath

    Assert-Equal -Actual $topLevelParams.Count -Expected $ExpectedParameters.Count -Message "$TopLevelPath public parameter count changed."
    Assert-Equal -Actual $implementationParams.Count -Expected $ExpectedParameters.Count -Message "$ImplementationPath public parameter count changed."

    foreach ($parameterName in $ExpectedParameters) {
        Assert-True -Condition $topLevelParams.ContainsKey($parameterName) -Message "$TopLevelPath is missing parameter $parameterName."
        Assert-True -Condition $implementationParams.ContainsKey($parameterName) -Message "$ImplementationPath is missing parameter $parameterName."
        Assert-Equal -Actual $topLevelParams[$parameterName].TypeName -Expected $implementationParams[$parameterName].TypeName -Message "$parameterName type differs between shim and implementation."
        Assert-Equal -Actual $topLevelParams[$parameterName].Default -Expected $implementationParams[$parameterName].Default -Message "$parameterName default differs between shim and implementation."
    }
}

function Get-FileHashMap {
    $paths = @(
        '.understand-anything/knowledge-graph.json',
        '.understand-anything/fingerprints.json',
        '.understand-anything/meta.json',
        '.understand-anything/intermediate/scan-result.json'
    )

    $hashes = @{}
    foreach ($relativePath in $paths) {
        $absolutePath = Join-Path $repoRoot $relativePath
        $hashes[$relativePath] = (Get-FileHash -LiteralPath $absolutePath -Algorithm SHA256).Hash
    }

    return $hashes
}

function Assert-GraphArtifactsUnchanged {
    param(
        [Parameter(Mandatory = $true)][hashtable]$Before,
        [Parameter(Mandatory = $true)][string]$Message
    )

    $after = Get-FileHashMap
    foreach ($key in $Before.Keys) {
        Assert-Equal -Actual $after[$key] -Expected $Before[$key] -Message "$Message Changed artifact: $key."
    }
}

function New-FakePluginRoot {
    param(
        [Parameter(Mandatory = $true)][string]$Root,
        [switch]$Incomplete
    )

    $skillRoot = Join-Path $Root 'skills/understand'
    $coreRoot = Join-Path $Root 'packages/core/dist'
    New-Item -ItemType Directory -Force -Path $skillRoot | Out-Null
    New-Item -ItemType Directory -Force -Path $coreRoot | Out-Null

    $requiredFiles = @(
        (Join-Path $skillRoot 'scan-project.mjs'),
        (Join-Path $skillRoot 'extract-import-map.mjs'),
        (Join-Path $skillRoot 'extract-structure.mjs'),
        (Join-Path $skillRoot 'build-fingerprints.mjs'),
        (Join-Path $coreRoot 'index.js')
    )

    foreach ($file in $requiredFiles) {
        if ($Incomplete -and $file -like '*build-fingerprints.mjs') {
            continue
        }

        Set-Content -LiteralPath $file -Value '// understand shim test fixture' -Encoding UTF8
    }
}

function Invoke-ExpectFailure {
    param([Parameter(Mandatory = $true)][string[]]$Arguments)

    $previousErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        $output = & powershell @Arguments 2>&1 | Out-String
        return [pscustomobject]@{
            ExitCode = $LASTEXITCODE
            Output = $output
        }
    } finally {
        $ErrorActionPreference = $previousErrorActionPreference
    }
}

try {
    foreach ($command in $commands) {
        $topLevelPath = Join-Path $scriptRoot $command.Name
        $implementationPath = Join-Path $understandScriptRoot $command.Name

        Assert-PathExists -Path $topLevelPath -Message "Missing top-level Understand shim: $topLevelPath"
        Assert-PathExists -Path $implementationPath -Message "Missing Understand implementation: $implementationPath"

        Get-ScriptAst -Path $topLevelPath | Out-Null
        Get-ScriptAst -Path $implementationPath | Out-Null

        $topLevelSource = Get-Content -LiteralPath $topLevelPath -Raw
        Assert-ContainsText -Text $topLevelSource -Pattern ([regex]::Escape("understand/$($command.Name)")) -Message "$($command.Name) shim does not delegate to scripts/understand."
        Assert-ContainsText -Text $topLevelSource -Pattern '@PSBoundParameters' -Message "$($command.Name) shim does not forward bound parameters."

        Assert-ParameterCompatibility -TopLevelPath $topLevelPath -ImplementationPath $implementationPath -ExpectedParameters $command.Parameters
    }

    New-Item -ItemType Directory -Force -Path $tempRoot | Out-Null
    $completePluginRoot = Join-Path $tempRoot 'complete-plugin'
    New-FakePluginRoot -Root $completePluginRoot

    $beforeDryRunHashes = Get-FileHashMap
    $dryRunOutput = & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $scriptRoot 'refresh-understand-graph.ps1') -PluginRoot $completePluginRoot -DryRun 2>&1 | Out-String
    Assert-Equal -Actual $LASTEXITCODE -Expected 0 -Message "Top-level refresh dry-run shim failed. Output: $dryRunOutput"
    Assert-ContainsText -Text $dryRunOutput -Pattern 'Dry run:\s*no files modified' -Message 'Top-level refresh dry-run output did not preserve dry-run text.'
    Assert-ContainsText -Text $dryRunOutput -Pattern 'Tracked refresh outputs:' -Message 'Top-level refresh dry-run output did not preserve tracked output listing.'
    Assert-GraphArtifactsUnchanged -Before $beforeDryRunHashes -Message 'Top-level refresh dry-run modified tracked graph artifacts.'

    $beforeReadinessHashes = Get-FileHashMap
    $textOutput = & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $scriptRoot 'check-understand-refresh-readiness.ps1') -PluginRoot $completePluginRoot 2>&1 | Out-String
    Assert-Equal -Actual $LASTEXITCODE -Expected 0 -Message "Top-level readiness shim failed. Output: $textOutput"
    Assert-ContainsText -Text $textOutput -Pattern 'Understand refresh readiness:\s*READY' -Message 'Readiness text output did not report READY.'
    Assert-ContainsText -Text $textOutput -Pattern 'Dry run succeeded:\s*True' -Message 'Readiness text output did not report dry-run success.'

    $jsonOutput = & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $scriptRoot 'check-understand-refresh-readiness.ps1') -PluginRoot $completePluginRoot -Json 2>&1 | Out-String
    Assert-Equal -Actual $LASTEXITCODE -Expected 0 -Message "Top-level readiness JSON shim failed. Output: $jsonOutput"
    $jsonResult = $jsonOutput | ConvertFrom-Json
    Assert-Equal -Actual $jsonResult.ready -Expected $true -Message 'Readiness JSON ready flag changed.'
    Assert-Equal -Actual $jsonResult.dryRun.succeeded -Expected $true -Message 'Readiness JSON dryRun.succeeded flag changed.'
    Assert-Equal -Actual @($jsonResult.changedArtifacts).Count -Expected 0 -Message 'Readiness JSON changedArtifacts count changed.'
    Assert-GraphArtifactsUnchanged -Before $beforeReadinessHashes -Message 'Top-level readiness preflight modified tracked graph artifacts.'

    $incompletePluginRoot = Join-Path $tempRoot 'incomplete-plugin'
    New-FakePluginRoot -Root $incompletePluginRoot -Incomplete
    $blocked = Invoke-ExpectFailure -Arguments @(
        '-NoProfile',
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        (Join-Path $scriptRoot 'check-understand-refresh-readiness.ps1'),
        '-PluginRoot',
        $incompletePluginRoot,
        '-Json'
    )
    Assert-True -Condition ($blocked.ExitCode -ne 0) -Message 'Readiness shim should fail for incomplete plugin fixtures.'
    $blockedResult = $blocked.Output | ConvertFrom-Json
    Assert-Equal -Actual $blockedResult.ready -Expected $false -Message 'Blocked readiness JSON ready flag changed.'
    Assert-ContainsText -Text (@($blockedResult.errors) -join "`n") -Pattern 'refresh-understand-graph\.ps1 -DryRun exited with code' -Message 'Blocked readiness JSON did not preserve dry-run failure details.'

    $understandRoot = Join-Path $repoRoot '.understand-anything'
    Assert-True -Condition (-not (Test-Path -LiteralPath (Join-Path $understandRoot 'tmp'))) -Message 'Understand tmp directory should not remain after shim tests.'
    $trashDirs = @(Get-ChildItem -LiteralPath $understandRoot -Force -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -like '.trash-*' })
    Assert-Equal -Actual $trashDirs.Count -Expected 0 -Message 'Understand trash directories should not remain after shim tests.'
    $logFiles = @(Get-ChildItem -LiteralPath $understandRoot -Force -File -Filter '*.log' -ErrorAction SilentlyContinue)
    Assert-Equal -Actual $logFiles.Count -Expected 0 -Message 'Understand log files should not remain after shim tests.'

    Write-Host 'PASS Understand script shim checks'
}
finally {
    Remove-Item -LiteralPath $tempRoot -Recurse -Force -ErrorAction SilentlyContinue
}
