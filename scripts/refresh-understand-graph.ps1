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

function Write-Utf8NoBomFile {
    param(
        [Parameter(Mandatory = $true)][string]$LiteralPath,
        [Parameter(Mandatory = $true)][AllowEmptyString()][string]$Value
    )

    $encoding = New-Object System.Text.UTF8Encoding -ArgumentList $false
    [System.IO.File]::WriteAllText($LiteralPath, $Value, $encoding)
}

function Write-JsonUtf8NoBomFile {
    param(
        [Parameter(Mandatory = $true)][string]$LiteralPath,
        [Parameter(Mandatory = $true)][object]$InputObject,
        [int]$Depth = 100
    )

    $json = ConvertTo-Json -InputObject $InputObject -Depth $Depth
    Write-Utf8NoBomFile -LiteralPath $LiteralPath -Value $json
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
    Write-JsonUtf8NoBomFile -LiteralPath $importInputPath -InputObject $importInput

    Invoke-NodeStage -Stage 'extract-import-map' -Arguments @($pluginPaths.ExtractImportMap, $importInputPath, $importMapPath)

    $importMap = Get-Content -LiteralPath $importMapPath -Raw | ConvertFrom-Json
    $structureInput = [ordered]@{
        projectRoot = $repoRoot
        batchFiles = $scan.files
        batchImportData = $importMap
    }
    Write-JsonUtf8NoBomFile -LiteralPath $structureInputPath -InputObject $structureInput

    Invoke-NodeStage -Stage 'extract-structure' -Arguments @($pluginPaths.ExtractStructure, $structureInputPath, $structureResultPath)

    $gitHash = (& git rev-parse HEAD).Trim()
    if ([string]::IsNullOrWhiteSpace($gitHash)) {
        throw 'Unable to determine current git commit hash for graph assembly.'
    }

    $projectName = Split-Path -Path $repoRoot -Leaf
    $assemblyScript = @'
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const repoRoot = process.argv[2];
const scanPath = process.argv[3];
const importMapPath = process.argv[4];
const structureResultPath = process.argv[5];
const coreIndex = process.argv[6];
const projectName = process.argv[7];
const gitHash = process.argv[8];

const core = await import(pathToFileURL(coreIndex).href);
const scan = JSON.parse(fs.readFileSync(scanPath, 'utf8'));
const importMap = JSON.parse(fs.readFileSync(importMapPath, 'utf8'));
const structure = JSON.parse(fs.readFileSync(structureResultPath, 'utf8'));
const scannedPaths = new Set((scan.files || []).map((file) => file.path));

function normalizeComplexity(value) {
  if (typeof value === 'string') {
    const normalized = value.toLowerCase().trim();
    if (['simple', 'moderate', 'complex'].includes(normalized)) {
      return normalized;
    }
    if (['low', 'easy', 'trivial', 'basic'].includes(normalized)) {
      return 'simple';
    }
    if (['high', 'hard', 'difficult', 'advanced'].includes(normalized)) {
      return 'complex';
    }
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    if (value <= 3) {
      return 'simple';
    }
    if (value >= 7) {
      return 'complex';
    }
  }
  return 'moderate';
}

function normalizeLineRange(item) {
  if (Array.isArray(item.lineRange) && item.lineRange.length >= 2) {
    return item.lineRange;
  }
  const start = Number.isFinite(item.startLine) ? item.startLine : 1;
  const end = Number.isFinite(item.endLine) ? item.endLine : start;
  return [start, end];
}

function normalizeNamedItems(items) {
  return (Array.isArray(items) ? items : [])
    .filter((item) => item && typeof item.name === 'string' && item.name.trim().length > 0)
    .map((item) => ({
      ...item,
      name: item.name,
      lineRange: normalizeLineRange(item),
    }));
}

function normalizeImportTarget(entry) {
  if (typeof entry === 'string') {
    return entry;
  }
  if (!entry || typeof entry !== 'object') {
    return '';
  }
  return entry.resolvedPath || entry.resolved || entry.target || entry.path || entry.filePath || '';
}

const builder = new core.GraphBuilder(projectName, gitHash);
for (const file of scan.files || []) {
  const result = (structure.results || []).find((entry) => entry.path === file.path) || {};
  const functions = normalizeNamedItems(result.functions);
  const classes = normalizeNamedItems(result.classes);
  const meta = {
    summary: result.summary || file.summary || '',
    fileSummary: result.summary || file.summary || '',
    tags: Array.isArray(result.tags) ? result.tags : [],
    complexity: normalizeComplexity(result.complexity || file.complexity),
    summaries: {},
  };

  if (functions.length > 0 || classes.length > 0) {
    builder.addFileWithAnalysis(file.path, { functions, classes }, meta);
  } else {
    builder.addFile(file.path, meta);
  }
}

for (const file of scan.files || []) {
  const imports = importMap[file.path] || [];
  for (const entry of Array.isArray(imports) ? imports : []) {
    const target = normalizeImportTarget(entry);
    if (target && scannedPaths.has(target)) {
      builder.addImportEdge(file.path, target);
    }
  }
}

const graph = builder.build();
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
'@
    Write-Utf8NoBomFile -LiteralPath $assemblyScriptPath -Value $assemblyScript

    Push-Location $repoRoot
    try {
        Invoke-NodeStage -Stage 'graph-assembly' -Arguments @($assemblyScriptPath, $repoRoot, $scanPath, $importMapPath, $structureResultPath, $pluginPaths.CoreIndex, $projectName, $gitHash)

        $scanForFingerprints = Get-Content -LiteralPath $scanPath -Raw | ConvertFrom-Json
        $fingerprintInput = [ordered]@{
            projectRoot = $repoRoot
            sourceFilePaths = @($scanForFingerprints.files | ForEach-Object { $_.path })
            gitCommitHash = $gitHash
        }
        Write-JsonUtf8NoBomFile -LiteralPath $fingerprintInputPath -InputObject $fingerprintInput

        Invoke-NodeStage -Stage 'build-fingerprints' -Arguments @($pluginPaths.BuildFingerprints, $fingerprintInputPath)

        $meta = [ordered]@{
            lastAnalyzedAt = (Get-Date).ToUniversalTime().ToString('o')
            gitCommitHash = $gitHash
            version = '1.0.0'
            analyzedFiles = @($scanForFingerprints.files).Count
        }
        Write-JsonUtf8NoBomFile -LiteralPath (Join-Path $understandRoot 'meta.json') -InputObject $meta -Depth 10
    }
    finally {
        Pop-Location
    }
}
finally {
    if (-not $KeepIntermediate -and (Test-Path -LiteralPath $intermediateRoot)) {
        Assert-PathInside -Path $intermediateRoot -Parent $understandRoot
        Remove-Item -LiteralPath $intermediateRoot -Recurse -Force

        $tmpRoot = Split-Path -Path $intermediateRoot -Parent
        if (Test-Path -LiteralPath $tmpRoot -PathType Container) {
            Assert-PathInside -Path $tmpRoot -Parent $understandRoot
            if (-not (Get-ChildItem -LiteralPath $tmpRoot -Force)) {
                Remove-Item -LiteralPath $tmpRoot -Force
            }
        }
    }
}

Write-Host 'Understand graph refresh completed.'
