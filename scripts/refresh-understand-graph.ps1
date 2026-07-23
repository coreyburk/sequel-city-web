[CmdletBinding()]
param(
    [string]$PluginRoot,

    [switch]$DryRun,

    [switch]$KeepIntermediate
)

$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Path $PSCommandPath -Parent
$repoRoot = Split-Path -Path $scriptRoot -Parent
$understandRoot = Join-Path $repoRoot '.understand-anything'
$intermediateRoot = Join-Path $understandRoot 'tmp/refresh-understand-graph'
$trackedIntermediatePath = Join-Path $understandRoot 'intermediate/scan-result.json'

function Get-PluginRootCandidates {
    $candidates = New-Object System.Collections.Generic.List[string]

    if (-not [string]::IsNullOrWhiteSpace($PluginRoot)) {
        [void]$candidates.Add($PluginRoot)
    }

    foreach ($envName in @('UNDERSTAND_PLUGIN_ROOT', 'UA_PLUGIN_ROOT')) {
        $value = [Environment]::GetEnvironmentVariable($envName)
        if (-not [string]::IsNullOrWhiteSpace($value)) {
            [void]$candidates.Add($value)
        }
    }

    foreach ($base in @($env:USERPROFILE, $env:HOME)) {
        if ([string]::IsNullOrWhiteSpace($base)) {
            continue
        }

        [void]$candidates.Add((Join-Path $base '.understand-anything-plugin'))
        [void]$candidates.Add((Join-Path $base '.agents/skills/understand'))
    }

    return @($candidates | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Select-Object -Unique)
}

function Resolve-UnderstandPluginRoot {
    $candidates = Get-PluginRootCandidates

    foreach ($candidate in $candidates) {
        if (Test-Path -LiteralPath $candidate -PathType Container) {
            return (Resolve-Path -LiteralPath $candidate).Path
        }
    }

    $searched = if ($candidates.Count -gt 0) { $candidates -join [Environment]::NewLine } else { '(no candidate paths)' }
    throw "Unable to find Understand plugin root. Pass -PluginRoot or set UNDERSTAND_PLUGIN_ROOT. Searched:$([Environment]::NewLine)$searched"
}

function Get-RequiredPluginPaths {
    param([Parameter(Mandatory = $true)][string]$Root)

    return [ordered]@{
        ScanProject = Join-Path $Root 'skills/understand/scan-project.mjs'
        ExtractImportMap = Join-Path $Root 'skills/understand/extract-import-map.mjs'
        ExtractStructure = Join-Path $Root 'skills/understand/extract-structure.mjs'
        BuildFingerprints = Join-Path $Root 'skills/understand/build-fingerprints.mjs'
        CoreIndex = Join-Path $Root 'packages/core/dist/index.js'
    }
}

function Assert-RequiredPluginPaths {
    param([Parameter(Mandatory = $true)][System.Collections.IDictionary]$Paths)

    $missing = @()
    foreach ($entry in $Paths.GetEnumerator()) {
        if (-not (Test-Path -LiteralPath $entry.Value -PathType Leaf)) {
            $missing += "$($entry.Key): $($entry.Value)"
        }
    }

    if ($missing.Count -gt 0) {
        throw "Understand plugin prerequisites are missing:$([Environment]::NewLine)$($missing -join [Environment]::NewLine)"
    }
}

function Assert-PathInside {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string]$Parent
    )

    $resolvedParent = [System.IO.Path]::GetFullPath($Parent).TrimEnd('\', '/') + [System.IO.Path]::DirectorySeparatorChar
    $resolvedPath = [System.IO.Path]::GetFullPath($Path)
    if (-not $resolvedPath.StartsWith($resolvedParent, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Refusing to write outside expected directory. Path: $resolvedPath Parent: $resolvedParent"
    }
}

function Invoke-NodeStage {
    param(
        [Parameter(Mandatory = $true)][string]$Stage,
        [Parameter(Mandatory = $true)][string[]]$Arguments
    )

    Write-Host "Running $Stage..."
    & node @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "$Stage failed with exit code $LASTEXITCODE."
    }
}

$resolvedPluginRoot = Resolve-UnderstandPluginRoot
$pluginPaths = Get-RequiredPluginPaths -Root $resolvedPluginRoot
Assert-RequiredPluginPaths -Paths $pluginPaths

Write-Host "Repository root: $repoRoot"
Write-Host "Understand plugin root: $resolvedPluginRoot"
Write-Host 'Required plugin scripts:'
foreach ($entry in $pluginPaths.GetEnumerator()) {
    Write-Host "  - $($entry.Key): $($entry.Value)"
}

Write-Host 'Tracked refresh outputs:'
Write-Host '  - .understand-anything/knowledge-graph.json'
Write-Host '  - .understand-anything/fingerprints.json'
Write-Host '  - .understand-anything/meta.json'
Write-Host '  - .understand-anything/intermediate/scan-result.json'

if ($DryRun) {
    Write-Host 'Dry run: no files modified.'
    Write-Host 'Planned stages: scan, import-map extraction, structure extraction, graph assembly, fingerprint baseline, metadata write, transient cleanup.'
    exit 0
}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    throw 'Node.js is required to refresh the Understand graph, but node was not found on PATH.'
}

Assert-PathInside -Path $intermediateRoot -Parent $understandRoot
New-Item -ItemType Directory -Force -Path $intermediateRoot | Out-Null
New-Item -ItemType Directory -Force -Path (Split-Path -Path $trackedIntermediatePath -Parent) | Out-Null

$scanPath = Join-Path $intermediateRoot 'scan-result.json'
$importInputPath = Join-Path $intermediateRoot 'import-input.json'
$importMapPath = Join-Path $intermediateRoot 'import-map.json'
$structureInputPath = Join-Path $intermediateRoot 'structure-input.json'
$structureResultPath = Join-Path $intermediateRoot 'structure-result.json'
$fingerprintInputPath = Join-Path $intermediateRoot 'fingerprint-input.json'
$assemblyScriptPath = Join-Path $intermediateRoot 'assemble-graph.mjs'

try {
    Invoke-NodeStage -Stage 'scan-project' -Arguments @($pluginPaths.ScanProject, $repoRoot, $scanPath)

    $scan = Get-Content -LiteralPath $scanPath -Raw | ConvertFrom-Json
    $importInput = [ordered]@{
        projectRoot = $repoRoot
        files = $scan.files
    }
    $importInput | ConvertTo-Json -Depth 100 | Set-Content -LiteralPath $importInputPath -Encoding UTF8

    Invoke-NodeStage -Stage 'extract-import-map' -Arguments @($pluginPaths.ExtractImportMap, $importInputPath, $importMapPath)

    $importMap = Get-Content -LiteralPath $importMapPath -Raw | ConvertFrom-Json
    $structureInput = [ordered]@{
        projectRoot = $repoRoot
        batchFiles = $scan.files
        batchImportData = $importMap
    }
    $structureInput | ConvertTo-Json -Depth 100 | Set-Content -LiteralPath $structureInputPath -Encoding UTF8

    Invoke-NodeStage -Stage 'extract-structure' -Arguments @($pluginPaths.ExtractStructure, $structureInputPath, $structureResultPath)

    $coreIndex = $pluginPaths.CoreIndex -replace '\\', '/'
    $assemblyScript = @"
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const repoRoot = process.argv[2];
const scanPath = process.argv[3];
const importMapPath = process.argv[4];
const structureResultPath = process.argv[5];
const coreIndex = process.argv[6];

const core = await import(pathToFileURL(coreIndex).href);
const scan = JSON.parse(fs.readFileSync(scanPath, 'utf8'));
const importMap = JSON.parse(fs.readFileSync(importMapPath, 'utf8'));
const structure = JSON.parse(fs.readFileSync(structureResultPath, 'utf8'));

const files = scan.files.map((file) => {
  const result = (structure.results || []).find((entry) => entry.path === file.path) || {};
  const imports = importMap[file.path] || [];
  return {
    path: file.path,
    language: file.language || file.type || 'unknown',
    type: file.type || 'file',
    size: file.size || 0,
    lineCount: file.lineCount || 0,
    imports,
    exports: result.exports || [],
    functions: (result.functions || []).map((item) => ({
      ...item,
      lineRange: Array.isArray(item.lineRange) ? item.lineRange : [item.startLine || 1, item.endLine || item.startLine || 1],
    })),
    classes: result.classes || [],
    summary: result.summary || '',
    sections: result.sections || [],
    metadata: result.metadata || {},
  };
});

const builder = new core.GraphBuilder(repoRoot);
const graph = builder.build(files);
graph.layers = core.detectLayers(graph);
graph.tour = core.generateHeuristicTour(graph);
const validation = core.validateGraph(graph);
if (!validation.success) {
  const detail = JSON.stringify({
    fatal: validation.fatal || '',
    issues: (validation.issues || []).length,
    errors: (validation.errors || []).length,
  });
  throw new Error(`Graph validation failed: ${detail}`);
}

fs.writeFileSync('.understand-anything/knowledge-graph.json', JSON.stringify(graph, null, 2));
fs.copyFileSync(scanPath, '.understand-anything/intermediate/scan-result.json');
console.log(JSON.stringify({
  nodes: graph.nodes.length,
  edges: graph.edges.length,
  layers: graph.layers.length,
  tourSteps: graph.tour.length,
  files: scan.files.length,
}, null, 2));
"@
    Set-Content -LiteralPath $assemblyScriptPath -Value $assemblyScript -Encoding UTF8

    Push-Location $repoRoot
    try {
        Invoke-NodeStage -Stage 'graph-assembly' -Arguments @($assemblyScriptPath, $repoRoot, $scanPath, $importMapPath, $structureResultPath, $pluginPaths.CoreIndex)

        $gitHash = (& git rev-parse HEAD).Trim()
        if ([string]::IsNullOrWhiteSpace($gitHash)) {
            throw 'Unable to determine current git commit hash for fingerprint baseline.'
        }

        $scanForFingerprints = Get-Content -LiteralPath $scanPath -Raw | ConvertFrom-Json
        $fingerprintInput = [ordered]@{
            projectRoot = $repoRoot
            sourceFilePaths = @($scanForFingerprints.files | ForEach-Object { $_.path })
            gitCommitHash = $gitHash
        }
        $fingerprintInput | ConvertTo-Json -Depth 100 | Set-Content -LiteralPath $fingerprintInputPath -Encoding UTF8

        Invoke-NodeStage -Stage 'build-fingerprints' -Arguments @($pluginPaths.BuildFingerprints, $fingerprintInputPath)

        $meta = [ordered]@{
            lastAnalyzedAt = (Get-Date).ToUniversalTime().ToString('o')
            gitCommitHash = $gitHash
            version = '1.0.0'
            analyzedFiles = @($scanForFingerprints.files).Count
        }
        $meta | ConvertTo-Json -Depth 10 | Set-Content -LiteralPath (Join-Path $understandRoot 'meta.json') -Encoding UTF8
    }
    finally {
        Pop-Location
    }
}
finally {
    if (-not $KeepIntermediate -and (Test-Path -LiteralPath $intermediateRoot)) {
        Assert-PathInside -Path $intermediateRoot -Parent $understandRoot
        Remove-Item -LiteralPath $intermediateRoot -Recurse -Force
    }
}

Write-Host 'Understand graph refresh completed.'
