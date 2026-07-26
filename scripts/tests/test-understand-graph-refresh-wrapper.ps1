param()

$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Path $PSScriptRoot -Parent
$repoRoot = Split-Path -Path $scriptRoot -Parent
$wrapperPath = Join-Path $repoRoot 'scripts/refresh-understand-graph.ps1'
$tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ('sequel-understand-refresh-test-' + [guid]::NewGuid().ToString('N'))

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

function Invoke-WrapperExpectFailure {
    param(
        [Parameter(Mandatory = $true)][string]$PluginRoot,
        [switch]$KeepIntermediate
    )

    $previousErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        $arguments = @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $wrapperPath, '-PluginRoot', $PluginRoot)
        if ($KeepIntermediate) {
            $arguments += '-KeepIntermediate'
        }

        $output = & powershell @arguments 2>&1 | Out-String
        return [pscustomobject]@{
            ExitCode = $LASTEXITCODE
            Output = $output
        }
    }
    finally {
        $ErrorActionPreference = $previousErrorActionPreference
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
        if ($Incomplete -and $file -like '*extract-structure.mjs') {
            continue
        }

        Set-Content -LiteralPath $file -Value '// test fixture' -Encoding UTF8
    }
}

function New-FailingNodeFixture {
    param([Parameter(Mandatory = $true)][string]$Root)

    New-Item -ItemType Directory -Force -Path $Root | Out-Null

    $nodeCommand = @'
@echo off
for %%F in ("%~1") do set SCRIPT_NAME=%%~nxF
if /I "%SCRIPT_NAME%"=="scan-project.mjs" (
  > "%~3" echo {"files":[{"path":"scripts/example.ts","language":"typescript","type":"file","size":1,"lineCount":1}]}
  exit /b 0
)
echo forced fake node failure 1>&2
exit /b 9
'@
    Set-Content -LiteralPath (Join-Path $Root 'node.cmd') -Value $nodeCommand -Encoding ASCII
}

try {
    if (-not (Test-Path -LiteralPath $wrapperPath -PathType Leaf)) {
        throw "Missing wrapper: $wrapperPath"
    }

    $wrapperSource = Get-Content -LiteralPath $wrapperPath -Raw
    Assert-Contains -Text $wrapperSource -Pattern 'function\s+Write-Utf8NoBomFile' -Message 'Wrapper does not define a BOM-less UTF-8 write helper.'
    Assert-Contains -Text $wrapperSource -Pattern '\$assemblyScript\s*=\s*@''' -Message 'Generated assembly script is not stored in a literal PowerShell here-string.'
    Assert-Contains -Text $wrapperSource -Pattern 'new core\.GraphBuilder\(projectName,\s*gitHash\)' -Message 'Wrapper does not construct GraphBuilder with project name and git hash.'
    Assert-Contains -Text $wrapperSource -Pattern 'builder\.build\(\)' -Message 'Wrapper does not call the current no-argument GraphBuilder build API.'
    Assert-Contains -Text $wrapperSource -Pattern 'core\.validateGraph\(graph\)' -Message 'Wrapper does not validate the assembled graph.'
    Assert-NotContains -Text $wrapperSource -Pattern 'new core\.GraphBuilder\(repoRoot\)' -Message 'Wrapper still uses repo root as the GraphBuilder constructor contract.'
    Assert-NotContains -Text $wrapperSource -Pattern 'builder\.build\(files\)' -Message 'Wrapper still passes files into GraphBuilder.build().'
    Assert-NotContains -Text $wrapperSource -Pattern 'ConvertTo-Json[\s\S]*Set-Content[\s\S]*-Encoding\s+UTF8' -Message 'Wrapper still pipes JSON through Set-Content -Encoding UTF8.'

    $parseErrors = $null
    [System.Management.Automation.Language.Parser]::ParseFile($wrapperPath, [ref]$null, [ref]$parseErrors) | Out-Null
    if ($parseErrors -and $parseErrors.Count -gt 0) {
        $formattedErrors = $parseErrors | ForEach-Object { $_.Message } | Out-String
        throw "refresh-understand-graph.ps1 has parse errors:`n$formattedErrors"
    }

    New-Item -ItemType Directory -Force -Path $tempRoot | Out-Null

    $assemblyMatch = [regex]::Match($wrapperSource, "\`$assemblyScript\s*=\s*@'\r?\n(?<Script>[\s\S]*?)\r?\n'@")
    Assert-True -Condition $assemblyMatch.Success -Message 'Could not extract the generated assembly script for syntax validation.'
    $assemblyCheckPath = Join-Path $tempRoot 'assemble-graph-check.mjs'
    $utf8NoBom = New-Object System.Text.UTF8Encoding -ArgumentList $false
    [System.IO.File]::WriteAllText($assemblyCheckPath, $assemblyMatch.Groups['Script'].Value, $utf8NoBom)

    if (Get-Command node -ErrorAction SilentlyContinue) {
        $nodeCheckOutput = & node --check $assemblyCheckPath 2>&1 | Out-String
        Assert-Equal -Actual $LASTEXITCODE -Expected 0 -Message "Generated assembly script failed node --check. Output: $nodeCheckOutput"
    }

    $completePluginRoot = Join-Path $tempRoot 'complete-plugin'
    New-FakePluginRoot -Root $completePluginRoot

    $beforeHashes = Get-FileHashMap
    $dryRunOutput = & powershell -NoProfile -ExecutionPolicy Bypass -File $wrapperPath -PluginRoot $completePluginRoot -DryRun 2>&1 | Out-String
    Assert-Equal -Actual $LASTEXITCODE -Expected 0 -Message 'Dry-run wrapper invocation failed.'
    Assert-Contains -Text $dryRunOutput -Pattern 'Dry run:\s*no files modified' -Message 'Dry run output did not state that no files were modified.'
    Assert-Contains -Text $dryRunOutput -Pattern ([regex]::Escape($completePluginRoot)) -Message 'Dry run output did not include the explicit plugin-root override.'
    Assert-Contains -Text $dryRunOutput -Pattern 'scan-project\.mjs' -Message 'Dry run output did not list required Understand scripts.'

    $afterHashes = Get-FileHashMap
    foreach ($key in $beforeHashes.Keys) {
        Assert-Equal -Actual $afterHashes[$key] -Expected $beforeHashes[$key] -Message "Dry run modified tracked graph artifact $key."
    }

    $incompletePluginRoot = Join-Path $tempRoot 'incomplete-plugin'
    New-FakePluginRoot -Root $incompletePluginRoot -Incomplete
    $previousErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        $missingOutput = & powershell -NoProfile -ExecutionPolicy Bypass -File $wrapperPath -PluginRoot $incompletePluginRoot -DryRun 2>&1 | Out-String
        $missingExitCode = $LASTEXITCODE
    }
    finally {
        $ErrorActionPreference = $previousErrorActionPreference
    }
    if ($missingExitCode -eq 0) {
        throw 'Wrapper should fail when required plugin scripts are missing.'
    }
    Assert-Contains -Text $missingOutput -Pattern 'Understand plugin prerequisites are missing' -Message 'Missing-prerequisite failure did not explain the blocker.'
    Assert-Contains -Text $missingOutput -Pattern 'extract-structure\.mjs' -Message 'Missing-prerequisite failure did not identify the missing script.'

    $understandTmpRoot = Join-Path $repoRoot '.understand-anything/tmp'
    $refreshTempRoot = Join-Path $understandTmpRoot 'refresh-understand-graph'
    Remove-Item -LiteralPath $refreshTempRoot -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath $understandTmpRoot -Force -ErrorAction SilentlyContinue

    $fakeBin = Join-Path $tempRoot 'fake-bin'
    New-FailingNodeFixture -Root $fakeBin
    $originalPath = $env:PATH
    try {
        $env:PATH = "$fakeBin;$env:PATH"

        $beforeFailureHashes = Get-FileHashMap
        $keptFailure = Invoke-WrapperExpectFailure -PluginRoot $completePluginRoot -KeepIntermediate
        if ($keptFailure.ExitCode -eq 0) {
            throw 'Forced wrapper failure should have exited non-zero.'
        }
        Assert-Contains -Text $keptFailure.Output -Pattern 'extract-import-map failed' -Message 'Forced failure did not occur after import-input generation.'

        $importInputPath = Join-Path $refreshTempRoot 'import-input.json'
        Assert-True -Condition (Test-Path -LiteralPath $importInputPath -PathType Leaf) -Message 'KeepIntermediate did not retain generated import-input.json for inspection.'
        $bytes = [System.IO.File]::ReadAllBytes($importInputPath)
        $hasBom = $bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF
        Assert-True -Condition (-not $hasBom) -Message 'Generated import-input.json has a UTF-8 BOM.'

        Remove-Item -LiteralPath $refreshTempRoot -Recurse -Force -ErrorAction SilentlyContinue

        $cleanedFailure = Invoke-WrapperExpectFailure -PluginRoot $completePluginRoot
        if ($cleanedFailure.ExitCode -eq 0) {
            throw 'Forced wrapper failure without KeepIntermediate should have exited non-zero.'
        }
        Assert-True -Condition (-not (Test-Path -LiteralPath $refreshTempRoot)) -Message 'Wrapper did not clean transient Understand refresh directory after failure.'
        Assert-True -Condition (-not (Test-Path -LiteralPath $understandTmpRoot)) -Message 'Wrapper did not clean empty Understand tmp parent after failure.'

        $afterFailureHashes = Get-FileHashMap
        foreach ($key in $beforeFailureHashes.Keys) {
            Assert-Equal -Actual $afterFailureHashes[$key] -Expected $beforeFailureHashes[$key] -Message "Forced failure modified tracked graph artifact $key."
        }
    }
    finally {
        $env:PATH = $originalPath
        Remove-Item -LiteralPath $refreshTempRoot -Recurse -Force -ErrorAction SilentlyContinue
        Remove-Item -LiteralPath $understandTmpRoot -Force -ErrorAction SilentlyContinue
    }
}
finally {
    Remove-Item -LiteralPath $tempRoot -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host 'PASS Understand graph refresh wrapper checks'
