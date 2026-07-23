[CmdletBinding()]
param(
    [string]$PluginRoot,

    [switch]$Json
)

$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Path $PSCommandPath -Parent
$repoRoot = Split-Path -Path $scriptRoot -Parent
$wrapperPath = Join-Path $scriptRoot 'refresh-understand-graph.ps1'
$understandRoot = Join-Path $repoRoot '.understand-anything'
$trackedArtifacts = @(
    '.understand-anything/knowledge-graph.json',
    '.understand-anything/fingerprints.json',
    '.understand-anything/meta.json',
    '.understand-anything/intermediate/scan-result.json'
)

function Get-TrackedArtifactHashes {
    $hashes = [ordered]@{}
    foreach ($relativePath in $trackedArtifacts) {
        $absolutePath = Join-Path $repoRoot $relativePath
        if (-not (Test-Path -LiteralPath $absolutePath -PathType Leaf)) {
            throw "Missing tracked Understand artifact: $relativePath"
        }

        $hashes[$relativePath] = (Get-FileHash -LiteralPath $absolutePath -Algorithm SHA256).Hash
    }

    return $hashes
}

function Compare-ArtifactHashes {
    param(
        [Parameter(Mandatory = $true)][System.Collections.IDictionary]$Before,
        [Parameter(Mandatory = $true)][System.Collections.IDictionary]$After
    )

    $changed = @()
    foreach ($key in $Before.Keys) {
        if (-not $After.Contains($key) -or $Before[$key] -ne $After[$key]) {
            $changed += $key
        }
    }

    return @($changed)
}

function Get-ArtifactHygiene {
    $tmpPath = Join-Path $understandRoot 'tmp'
    $trashDirs = @()
    $logFiles = @()

    if (Test-Path -LiteralPath $understandRoot -PathType Container) {
        $trashDirs = @(Get-ChildItem -LiteralPath $understandRoot -Force -Directory -ErrorAction SilentlyContinue |
            Where-Object { $_.Name -like '.trash-*' } |
            ForEach-Object { $_.FullName })

        $logFiles = @(Get-ChildItem -LiteralPath $understandRoot -Force -File -ErrorAction SilentlyContinue |
            Where-Object { $_.Name -like '*.log' } |
            ForEach-Object { $_.FullName })
    }

    return [ordered]@{
        tmpExists = Test-Path -LiteralPath $tmpPath
        trashDirs = @($trashDirs)
        logFiles = @($logFiles)
    }
}

function Invoke-WrapperDryRun {
    if (-not (Test-Path -LiteralPath $wrapperPath -PathType Leaf)) {
        return [ordered]@{
            succeeded = $false
            exitCode = 127
            output = ''
            error = "Missing refresh wrapper: $wrapperPath"
        }
    }

    $arguments = @(
        '-NoProfile',
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        $wrapperPath,
        '-DryRun'
    )

    if (-not [string]::IsNullOrWhiteSpace($PluginRoot)) {
        $arguments += @('-PluginRoot', $PluginRoot)
    }

    $previousErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        $output = & powershell @arguments 2>&1 | Out-String
        $exitCode = $LASTEXITCODE
    }
    finally {
        $ErrorActionPreference = $previousErrorActionPreference
    }

    return [ordered]@{
        succeeded = ($exitCode -eq 0)
        exitCode = $exitCode
        output = $output.Trim()
        error = if ($exitCode -eq 0) { '' } else { "refresh-understand-graph.ps1 -DryRun exited with code $exitCode" }
    }
}

$beforeHashes = $null
$afterHashes = $null
$changedArtifacts = @()
$dryRun = $null
$hygiene = $null
$errors = @()

try {
    $beforeHashes = Get-TrackedArtifactHashes
    $dryRun = Invoke-WrapperDryRun
    $afterHashes = Get-TrackedArtifactHashes
    $changedArtifacts = Compare-ArtifactHashes -Before $beforeHashes -After $afterHashes
    $hygiene = Get-ArtifactHygiene

    if (-not $dryRun.succeeded) {
        $errors += $dryRun.error
    }
    if ($changedArtifacts.Count -gt 0) {
        $errors += "Tracked Understand artifacts changed during dry-run: $($changedArtifacts -join ', ')"
    }
    if ($hygiene.tmpExists) {
        $errors += '.understand-anything/tmp exists after readiness preflight.'
    }
    if ($hygiene.trashDirs.Count -gt 0) {
        $errors += "Understand trash directories are present: $($hygiene.trashDirs -join ', ')"
    }
    if ($hygiene.logFiles.Count -gt 0) {
        $errors += "Understand log files are present: $($hygiene.logFiles -join ', ')"
    }
}
catch {
    $errors += $_.Exception.Message
}

$result = [ordered]@{
    ready = ($errors.Count -eq 0)
    repositoryRoot = $repoRoot
    wrapperPath = $wrapperPath
    pluginRoot = $PluginRoot
    dryRun = if ($null -ne $dryRun) { $dryRun } else { [ordered]@{ succeeded = $false; exitCode = $null; output = ''; error = 'Dry-run was not executed.' } }
    trackedArtifacts = $trackedArtifacts
    changedArtifacts = @($changedArtifacts)
    artifactHygiene = if ($null -ne $hygiene) { $hygiene } else { [ordered]@{ tmpExists = $null; trashDirs = @(); logFiles = @() } }
    errors = @($errors)
}

if ($Json) {
    $result | ConvertTo-Json -Depth 8
}
else {
    Write-Host "Understand refresh readiness: $(if ($result.ready) { 'READY' } else { 'BLOCKED' })"
    Write-Host "Repository root: $($result.repositoryRoot)"
    Write-Host "Wrapper: $($result.wrapperPath)"
    if (-not [string]::IsNullOrWhiteSpace($PluginRoot)) {
        Write-Host "Plugin root override: $PluginRoot"
    }
    Write-Host "Dry run succeeded: $($result.dryRun.succeeded)"
    Write-Host "Tracked artifacts changed: $($result.changedArtifacts.Count)"
    Write-Host "Temporary directory present: $($result.artifactHygiene.tmpExists)"
    Write-Host "Trash directories present: $($result.artifactHygiene.trashDirs.Count)"
    Write-Host "Log files present: $($result.artifactHygiene.logFiles.Count)"

    if ($result.errors.Count -gt 0) {
        Write-Host 'Errors:'
        foreach ($entry in $result.errors) {
            Write-Host "  - $entry"
        }
    }
}

if (-not $result.ready) {
    exit 1
}

exit 0
