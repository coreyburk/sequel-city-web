param()

$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Path $PSScriptRoot -Parent
$repoRoot = Split-Path -Path $scriptRoot -Parent
$decisionPath = Join-Path $scriptRoot 'get-agentic-workflow-decision.ps1'
$wpDirectory = Join-Path $repoRoot 'docs/01-work-packages'
$tempWpPaths = @(
    (Join-Path $wpDirectory 'WP-9992-agentic-decision-planned-temp.md'),
    (Join-Path $wpDirectory 'WP-9993-agentic-decision-implemented-temp.md'),
    (Join-Path $wpDirectory 'WP-9994-agentic-decision-audited-temp.md'),
    (Join-Path $wpDirectory 'WP-9995-agentic-decision-accepted-temp.md'),
    (Join-Path $wpDirectory 'WP-9996-agentic-decision-rejected-temp.md'),
    (Join-Path $wpDirectory 'WP-9997-agentic-decision-deferred-temp.md')
)

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

function Assert-ContainsText {
    param(
        [Parameter(Mandatory = $true)][string]$Text,
        [Parameter(Mandatory = $true)][string]$Pattern,
        [Parameter(Mandatory = $true)][string]$Message
    )

    if ($Text -notmatch $Pattern) {
        throw $Message
    }
}

function Assert-NotContainsText {
    param(
        [Parameter(Mandatory = $true)][AllowEmptyString()][string]$Text,
        [Parameter(Mandatory = $true)][string]$Pattern,
        [Parameter(Mandatory = $true)][string]$Message
    )

    if ($Text -match $Pattern) {
        throw $Message
    }
}

function Assert-HasProperty {
    param(
        [Parameter(Mandatory = $true)][object]$Object,
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)][string]$Message
    )

    if (-not ($Object.PSObject.Properties.Name -contains $Name)) {
        throw $Message
    }
}

function Assert-Decision {
    param(
        [Parameter(Mandatory = $true)][object]$Decision,
        [Parameter(Mandatory = $true)][string]$ExpectedAction,
        [Parameter(Mandatory = $true)][bool]$ExpectedRequiresHumanDecision,
        [Parameter(Mandatory = $true)][bool]$ExpectedRequiresExternalAuthorization,
        [AllowEmptyString()][string]$CommandPattern = '',
        [string]$MessagePrefix = 'Decision'
    )

    Assert-Equal -Actual $Decision.dryRun -Expected $true -Message "$MessagePrefix dryRun flag mismatch."
    Assert-Equal -Actual $Decision.executed -Expected $false -Message "$MessagePrefix executed flag mismatch."
    Assert-Equal -Actual $Decision.recommendation.action -Expected $ExpectedAction -Message "$MessagePrefix recommendation mismatch."
    Assert-Equal -Actual $Decision.recommendation.requiresHumanDecision -Expected $ExpectedRequiresHumanDecision -Message "$MessagePrefix human-decision flag mismatch."
    Assert-Equal -Actual $Decision.recommendation.requiresExternalAuthorization -Expected $ExpectedRequiresExternalAuthorization -Message "$MessagePrefix external-authorization flag mismatch."

    $commandPreview = [string]$Decision.recommendation.commandPreview
    if ([string]::IsNullOrWhiteSpace($CommandPattern)) {
        Assert-Equal -Actual $commandPreview -Expected '' -Message "$MessagePrefix should not include a command preview."
    }
    else {
        Assert-ContainsText -Text $commandPreview -Pattern $CommandPattern -Message "$MessagePrefix command preview mismatch."
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

function Test-NoUnderstandTransientArtifacts {
    $understandRoot = Join-Path $repoRoot '.understand-anything'
    $tmpPath = Join-Path $understandRoot 'tmp'
    if (Test-Path -LiteralPath $tmpPath) {
        throw '.understand-anything/tmp should not exist after decision-router tests.'
    }

    $trashDirs = @(Get-ChildItem -LiteralPath $understandRoot -Force -Directory -ErrorAction SilentlyContinue | Where-Object { $_.Name -like '.trash-*' })
    if ($trashDirs.Count -gt 0) {
        throw 'Understand trash directories should not exist after decision-router tests.'
    }

    $logFiles = @(Get-ChildItem -LiteralPath $understandRoot -Force -File -ErrorAction SilentlyContinue | Where-Object { $_.Name -like '*.log' })
    if ($logFiles.Count -gt 0) {
        throw 'Understand log files should not exist after decision-router tests.'
    }
}

function Invoke-DecisionJson {
    param([string[]]$Arguments)

    $output = & powershell -NoProfile -ExecutionPolicy Bypass -File $decisionPath @Arguments -Json 2>&1 | Out-String
    if ($LASTEXITCODE -ne 0) {
        throw "Decision router should exit 0. Exit code: $LASTEXITCODE Output: $output"
    }

    return ($output | ConvertFrom-Json)
}

function New-MockedStatusSnapshotJson {
    param(
        [Parameter(Mandatory = $true)][string]$WorkPackage,
        [Parameter(Mandatory = $true)][string]$OverallState,
        [Parameter(Mandatory = $true)][string]$WorkPackageStatusState,
        [Parameter(Mandatory = $true)][string]$CloseoutState,
        [string[]]$Blockers = @()
    )

    $snapshot = [pscustomobject]@{
        workPackage = [pscustomobject]@{
            input = $WorkPackage
            available = $true
        }
        components = [pscustomobject]@{
            workPackageStatus = [pscustomobject]@{
                state = $WorkPackageStatusState
            }
            closeoutPreflight = [pscustomobject]@{
                state = $CloseoutState
            }
        }
        overall = [pscustomobject]@{
            state = $OverallState
            blockers = @($Blockers)
        }
    }

    return ($snapshot | ConvertTo-Json -Depth 8 -Compress)
}

function ConvertTo-Base64Text {
    param([Parameter(Mandatory = $true)][string]$Text)

    return [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($Text))
}

function New-DecisionRouterWorkPackage {
    param(
        [string]$Title = 'Temporary Agentic Decision Router Test Work Package',
        [string]$CodeResults = 'Pending implementation.',
        [string]$AuditResults = 'Pending audit.',
        [string]$FinalDecision = 'Pending human acceptance.'
    )

    return @"
# $Title

## Objective

Validate decision routing for a temporary work package.

## Scope

### In Scope

- Temporary decision-router validation.

### Out of Scope

- Runtime changes.

## Impact Analysis

### Understand Status
- Graph available: Not required for temporary test fixture.
- Baseline commit: Not applicable.
- Freshness assessment: Not applicable.
- Analysis performed: Fixture-only validation.

### Affected Architecture
- Layers: development workflow scripts.
- Primary files/components: temporary test files.
- Upstream consumers: tests.
- Downstream dependencies: none.

### Regression Surface
- Related tests: this test file.
- User workflows: decision-router checking.
- Security/data boundaries: no runtime changes.

### Graph Update Decision
- Regeneration required: No.
- Rationale: Fixture-only validation.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/**
- scripts/**

Do Not Modify:

- apps/**
- database/**
- .understand-anything/**

## Constraints

- No runtime changes.

## Required Behavior

- Report the correct decision-router state.

## Acceptance Criteria

- [ ] Decision routing is classified correctly.

## Code Prompt

Implement the temporary fixture behavior.

## Audit Prompt

Audit the temporary fixture behavior.

## Code Results

$CodeResults

## Audit Results

$AuditResults

## Final Decision

$FinalDecision
"@
}

function New-ImplementedCodeResults {
    return @"
Implemented temporary fixture behavior.

Validation:

- PASS: temporary decision-router fixture validation
"@
}

function New-PassingAuditResults {
    return @"
Verdict: PASS

Violations:

- None.

Regressions:

- None.

Drift risks:

- None.
"@
}

if (-not (Test-Path -LiteralPath $decisionPath -PathType Leaf)) {
    throw "Missing decision router script: $decisionPath"
}

foreach ($tempWpPath in $tempWpPaths) {
    if (Test-Path -LiteralPath $tempWpPath) {
        throw "Temporary fixture path already exists and will not be overwritten: $tempWpPath"
    }
}

$parseErrors = $null
[System.Management.Automation.Language.Parser]::ParseFile($decisionPath, [ref]$null, [ref]$parseErrors) | Out-Null
if ($parseErrors -and $parseErrors.Count -gt 0) {
    $formattedErrors = $parseErrors | ForEach-Object { $_.Message } | Out-String
    throw "get-agentic-workflow-decision.ps1 has parse errors:`n$formattedErrors"
}

try {
    Set-Content -LiteralPath $tempWpPaths[0] -Value (New-DecisionRouterWorkPackage -Title 'WP-9992 Planned Decision Router Fixture') -Encoding UTF8
    Set-Content -LiteralPath $tempWpPaths[1] -Value (New-DecisionRouterWorkPackage -Title 'WP-9993 Implemented Decision Router Fixture' -CodeResults (New-ImplementedCodeResults)) -Encoding UTF8
    Set-Content -LiteralPath $tempWpPaths[2] -Value (New-DecisionRouterWorkPackage -Title 'WP-9994 Audited Decision Router Fixture' -CodeResults (New-ImplementedCodeResults) -AuditResults (New-PassingAuditResults)) -Encoding UTF8
    Set-Content -LiteralPath $tempWpPaths[3] -Value (New-DecisionRouterWorkPackage -Title 'WP-9995 Accepted Decision Router Fixture' -CodeResults (New-ImplementedCodeResults) -AuditResults (New-PassingAuditResults) -FinalDecision 'Accepted after fixture validation.') -Encoding UTF8
    Set-Content -LiteralPath $tempWpPaths[4] -Value (New-DecisionRouterWorkPackage -Title 'WP-9996 Rejected Decision Router Fixture' -FinalDecision 'Rejected after fixture validation.') -Encoding UTF8
    Set-Content -LiteralPath $tempWpPaths[5] -Value (New-DecisionRouterWorkPackage -Title 'WP-9997 Deferred Decision Router Fixture' -FinalDecision 'Deferred after fixture validation.') -Encoding UTF8

    $beforeHashes = Get-FileHashMap

    $repositoryOnly = Invoke-DecisionJson -Arguments @('-SkipUnderstandReadiness')
    Assert-HasProperty -Object $repositoryOnly -Name 'generatedAt' -Message 'JSON output missing generatedAt.'
    Assert-HasProperty -Object $repositoryOnly -Name 'dryRun' -Message 'JSON output missing dryRun.'
    Assert-HasProperty -Object $repositoryOnly -Name 'executed' -Message 'JSON output missing executed.'
    Assert-HasProperty -Object $repositoryOnly -Name 'workPackage' -Message 'JSON output missing workPackage.'
    Assert-HasProperty -Object $repositoryOnly -Name 'status' -Message 'JSON output missing status.'
    Assert-HasProperty -Object $repositoryOnly -Name 'recommendation' -Message 'JSON output missing recommendation.'
    Assert-HasProperty -Object $repositoryOnly -Name 'statusSnapshot' -Message 'JSON output missing statusSnapshot.'
    Assert-Decision -Decision $repositoryOnly -ExpectedAction 'ProvideWorkPackage' -ExpectedRequiresHumanDecision $false -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Repository-only'

    $plannedWp = Invoke-DecisionJson -Arguments @('-WorkPackage', 'WP-9992', '-SkipUnderstandReadiness')
    Assert-Equal -Actual $plannedWp.workPackage.input -Expected 'WP-9992' -Message 'Planned WP input mismatch.'
    Assert-Decision -Decision $plannedWp -ExpectedAction 'ImplementWorkPackage' -ExpectedRequiresHumanDecision $true -ExpectedRequiresExternalAuthorization $false -CommandPattern 'run-work-package\.ps1 WP-9992 -Execute Codex' -MessagePrefix 'Planned WP'
    Assert-Equal -Actual $plannedWp.statusSnapshot.components.workPackageStatus.state -Expected 'ReadyForImplementation' -Message 'Planned WP status snapshot state mismatch.'

    $textOutput = & powershell -NoProfile -ExecutionPolicy Bypass -File $decisionPath -WorkPackage WP-9992 -SkipUnderstandReadiness 2>&1 | Out-String
    Assert-Equal -Actual $LASTEXITCODE -Expected 0 -Message 'Text decision router should exit 0.'
    Assert-ContainsText -Text $textOutput -Pattern 'Agentic workflow decision:\s*ImplementWorkPackage' -Message 'Text output missing recommendation.'
    Assert-ContainsText -Text $textOutput -Pattern 'Executed:\s*False' -Message 'Text output missing executed false.'
    Assert-ContainsText -Text $textOutput -Pattern 'Command preview:' -Message 'Text output missing command preview.'

    $implementedWp = Invoke-DecisionJson -Arguments @('-WorkPackage', 'WP-9993', '-SkipUnderstandReadiness')
    Assert-Decision -Decision $implementedWp -ExpectedAction 'RequestIndependentAudit' -ExpectedRequiresHumanDecision $true -ExpectedRequiresExternalAuthorization $true -CommandPattern 'audit-work-package\.ps1 WP-9993 -AllowExternalAudit' -MessagePrefix 'Implemented WP'

    $auditedWp = Invoke-DecisionJson -Arguments @('-WorkPackage', 'WP-9994', '-SkipUnderstandReadiness')
    Assert-Decision -Decision $auditedWp -ExpectedAction 'RequestHumanFinalDecision' -ExpectedRequiresHumanDecision $true -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Audited WP'

    $acceptedWp = Invoke-DecisionJson -Arguments @('-WorkPackage', 'WP-9995', '-SkipUnderstandReadiness')
    Assert-Decision -Decision $acceptedWp -ExpectedAction 'FinalizeAcceptedWorkPackage' -ExpectedRequiresHumanDecision $true -ExpectedRequiresExternalAuthorization $false -CommandPattern 'commit-work-package\.ps1 -WorkPackagePath WP-9995 -Preview' -MessagePrefix 'Accepted WP'

    $rejectedWp = Invoke-DecisionJson -Arguments @('-WorkPackage', 'WP-9996', '-SkipUnderstandReadiness')
    Assert-Decision -Decision $rejectedWp -ExpectedAction 'NoActionClosed' -ExpectedRequiresHumanDecision $false -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Rejected WP'
    Assert-ContainsText -Text $rejectedWp.recommendation.reason -Pattern 'ClosedRejected' -Message 'Rejected WP reason should name ClosedRejected.'

    $deferredWp = Invoke-DecisionJson -Arguments @('-WorkPackage', 'WP-9997', '-SkipUnderstandReadiness')
    Assert-Decision -Decision $deferredWp -ExpectedAction 'NoActionClosed' -ExpectedRequiresHumanDecision $false -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Deferred WP'
    Assert-ContainsText -Text $deferredWp.recommendation.reason -Pattern 'ClosedDeferred' -Message 'Deferred WP reason should name ClosedDeferred.'

    $blockedSnapshot = ConvertTo-Base64Text -Text (New-MockedStatusSnapshotJson -WorkPackage 'WP-9998' -OverallState 'Blocked' -WorkPackageStatusState 'BlockedMixedWorktree' -CloseoutState 'Blocked' -Blockers @('workPackageStatus: BlockedMixedWorktree', 'closeoutPreflight: Blocked'))
    $blockedWp = Invoke-DecisionJson -Arguments @('-WorkPackage', 'WP-9998', '-StatusSnapshotJsonBase64', $blockedSnapshot)
    Assert-Decision -Decision $blockedWp -ExpectedAction 'ResolveBlockers' -ExpectedRequiresHumanDecision $true -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Blocked WP'
    Assert-ContainsText -Text (@($blockedWp.recommendation.blockers) -join "`n") -Pattern 'BlockedMixedWorktree' -Message 'Blocked WP should surface mixed-worktree blocker.'
    Assert-NotContainsText -Text ([string]$blockedWp.recommendation.commandPreview) -Pattern 'run-work-package|audit-work-package|commit-work-package' -Message 'Blocked WP should not preview workflow execution commands.'

    $manualSnapshot = ConvertTo-Base64Text -Text (New-MockedStatusSnapshotJson -WorkPackage 'WP-9999' -OverallState 'Ready' -WorkPackageStatusState 'UnexpectedLifecycleState' -CloseoutState 'UnexpectedCloseoutState')
    $manualWp = Invoke-DecisionJson -Arguments @('-WorkPackage', 'WP-9999', '-StatusSnapshotJsonBase64', $manualSnapshot)
    Assert-Decision -Decision $manualWp -ExpectedAction 'ManualReview' -ExpectedRequiresHumanDecision $true -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Manual-review WP'
    Assert-ContainsText -Text $manualWp.recommendation.reason -Pattern 'UnexpectedLifecycleState' -Message 'Manual-review reason should include unsupported status state.'

    $invalidWp = Invoke-DecisionJson -Arguments @('-WorkPackage', 'WP-0000-does-not-exist', '-SkipUnderstandReadiness')
    Assert-Decision -Decision $invalidWp -ExpectedAction 'ResolveBlockers' -ExpectedRequiresHumanDecision $true -ExpectedRequiresExternalAuthorization $false -MessagePrefix 'Invalid WP'
    Assert-ContainsText -Text (@($invalidWp.recommendation.blockers) -join "`n") -Pattern 'workPackageStatus' -Message 'Invalid WP blockers should include status component.'

    $afterHashes = Get-FileHashMap
    foreach ($key in $beforeHashes.Keys) {
        Assert-Equal -Actual $afterHashes[$key] -Expected $beforeHashes[$key] -Message "Decision router modified tracked graph artifact $key."
    }

    Test-NoUnderstandTransientArtifacts
}
finally {
    foreach ($tempWpPath in $tempWpPaths) {
        if (Test-Path -LiteralPath $tempWpPath) {
            Remove-Item -LiteralPath $tempWpPath -Force
        }
    }
}

Write-Host 'PASS agentic workflow decision-router fixture matrix checks'
