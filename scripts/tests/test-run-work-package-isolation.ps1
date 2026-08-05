param()

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Path (Split-Path -Path $PSScriptRoot -Parent) -Parent
$runnerPath = Join-Path $repoRoot 'scripts/run-work-package.ps1'
$runnerImplementationPath = Join-Path $repoRoot 'scripts/work-package/run-work-package.ps1'
$commitHelperPath = Join-Path $repoRoot 'scripts/commit-work-package.ps1'
$commitHelperImplementationPath = Join-Path $repoRoot 'scripts/work-package/commit-work-package.ps1'
$workPackageDirectory = Join-Path $repoRoot 'docs/01-work-packages'

function Assert-Contains {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Text,

        [Parameter(Mandatory = $true)]
        [string]$Pattern,

        [Parameter(Mandatory = $true)]
        [string]$Message
    )

    if ($Text -notmatch $Pattern) {
        throw $Message
    }
}

function Assert-NotExists {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path,

        [Parameter(Mandatory = $true)]
        [string]$Message
    )

    if (Test-Path -LiteralPath $Path) {
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

function Get-ParameterNames {
    param([Parameter(Mandatory = $true)][string]$Path)

    $tokens = $null
    $parseErrors = $null
    $ast = [System.Management.Automation.Language.Parser]::ParseFile($Path, [ref]$tokens, [ref]$parseErrors)
    if ($parseErrors -and $parseErrors.Count -gt 0) {
        throw "Cannot inspect parameters for unparsable script: $Path"
    }

    return @($ast.ParamBlock.Parameters | ForEach-Object { $_.Name.VariablePath.UserPath })
}

$parseErrors = $null
[System.Management.Automation.Language.Parser]::ParseFile($runnerPath, [ref]$null, [ref]$parseErrors) | Out-Null
if ($parseErrors -and $parseErrors.Count -gt 0) {
    $formattedErrors = $parseErrors | ForEach-Object { $_.Message } | Out-String
    throw "run-work-package.ps1 has parse errors:`n$formattedErrors"
}

[System.Management.Automation.Language.Parser]::ParseFile($runnerImplementationPath, [ref]$null, [ref]$parseErrors) | Out-Null
if ($parseErrors -and $parseErrors.Count -gt 0) {
    $formattedErrors = $parseErrors | ForEach-Object { $_.Message } | Out-String
    throw "work-package/run-work-package.ps1 has parse errors:`n$formattedErrors"
}

[System.Management.Automation.Language.Parser]::ParseFile($commitHelperPath, [ref]$null, [ref]$parseErrors) | Out-Null
if ($parseErrors -and $parseErrors.Count -gt 0) {
    $formattedErrors = $parseErrors | ForEach-Object { $_.Message } | Out-String
    throw "commit-work-package.ps1 has parse errors:`n$formattedErrors"
}

[System.Management.Automation.Language.Parser]::ParseFile($commitHelperImplementationPath, [ref]$null, [ref]$parseErrors) | Out-Null
if ($parseErrors -and $parseErrors.Count -gt 0) {
    $formattedErrors = $parseErrors | ForEach-Object { $_.Message } | Out-String
    throw "work-package/commit-work-package.ps1 has parse errors:`n$formattedErrors"
}

Assert-Contains `
    -Text (Get-Content -LiteralPath $commitHelperPath -Raw) `
    -Pattern 'work-package/commit-work-package\.ps1' `
    -Message 'Top-level commit helper shim does not delegate to scripts/work-package.'
Assert-Contains `
    -Text (Get-Content -LiteralPath $runnerPath -Raw) `
    -Pattern 'work-package/run-work-package\.ps1' `
    -Message 'Top-level runner shim does not delegate to scripts/work-package.'
Assert-Contains `
    -Text (Get-Content -LiteralPath $runnerPath -Raw) `
    -Pattern '@PSBoundParameters' `
    -Message 'Top-level runner shim does not forward bound parameters.'
Assert-Contains `
    -Text (Get-Content -LiteralPath $runnerImplementationPath -Raw) `
    -Pattern "lib/WorkPackageResolver\.ps1" `
    -Message 'Moved runner implementation does not resolve the work-package resolver through scripts root.'
Assert-Contains `
    -Text (Get-Content -LiteralPath $commitHelperPath -Raw) `
    -Pattern '@PSBoundParameters' `
    -Message 'Top-level commit helper shim does not forward bound parameters.'
Assert-Contains `
    -Text (Get-Content -LiteralPath $commitHelperImplementationPath -Raw) `
    -Pattern "lib/WorkPackageResolver\.ps1" `
    -Message 'Moved commit helper implementation does not resolve the work-package resolver through scripts root.'

$shimParameters = @(Get-ParameterNames -Path $commitHelperPath)
$implementationParameters = @(Get-ParameterNames -Path $commitHelperImplementationPath)
Assert-Equal -Actual ($shimParameters -join ',') -Expected ($implementationParameters -join ',') -Message 'Commit helper shim parameter names differ from implementation.'

$runnerShimParameters = @(Get-ParameterNames -Path $runnerPath)
$runnerImplementationParameters = @(Get-ParameterNames -Path $runnerImplementationPath)
Assert-Equal -Actual ($runnerShimParameters -join ',') -Expected ($runnerImplementationParameters -join ',') -Message 'Runner shim parameter names differ from implementation.'

$tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ('sequel-isolation-test-' + [guid]::NewGuid().ToString('N'))
$tempWpName = 'WP-9998-isolation-temp.md'
$tempWpPath = Join-Path $workPackageDirectory $tempWpName
$outOfScopePath = Join-Path $repoRoot 'docs/isolation-temp-out-of-scope.md'
$originalAgyCli = $env:LITE_WP_AGY_CLI

try {
    New-Item -ItemType Directory -Force -Path $tempRoot | Out-Null

    $tempWp = @'
# Isolation Temp

## Objective

Temporary worktree isolation validation.

## Files Allowed to Change

Allowed:

- docs/01-work-packages/WP-175-isolated-work-package-audit-finalization-workflow.md
- docs/01-work-packages/WP-179-unified-work-package-identifier-resolution.md
- docs/01-work-packages/WP-201-commit-helper-work-package-traceability-line.md
- docs/01-work-packages/WP-220-commit-work-package-script-directory-compatibility-shim.md
- docs/01-work-packages/WP-222-run-work-package-script-directory-compatibility-shim.md
- docs/01-work-packages/WP-9998-isolation-temp.md
- scripts/run-work-package.ps1
- scripts/work-package/run-work-package.ps1
- scripts/commit-work-package.ps1
- scripts/work-package/commit-work-package.ps1
- scripts/get-work-package-status.ps1
- scripts/get-work-package-validation-plan.ps1
- scripts/lib/**
- scripts/tests/**
- docs/05-development-workflow/**
- docs/00-ssot/SSOT-Development-Workflow.md
- docs/00-ssot/END-OF-DAY-HANDOFF.md
- .codex/skills/sequel-city-audit-runner-contracts/**
- .codex/skills/sequel-city-wp-closeout-handoff/**
- .codex/skills/sequel-city-wp-finalize/**

Do Not Modify:

- apps/**

## Code Prompt

No-op.

## Audit Prompt

Audit the temporary isolation validation.

## Code Results

Pending.

## Audit Results

Pending.

## Final Decision

Accepted for temporary test validation.
'@
    Set-Content -LiteralPath $tempWpPath -Value $tempWp -Encoding UTF8

    $previewPromptOutput = & powershell -ExecutionPolicy Bypass -File $runnerPath $tempWpName -Execute None 2>&1 | Out-String
    if ($LASTEXITCODE -ne 0) {
        throw 'Runner prompt preview should work through the top-level shim.'
    }
    Assert-Contains `
        -Text $previewPromptOutput `
        -Pattern 'Mode:\s*preview Codex prompt' `
        -Message 'Runner top-level prompt preview did not report preview mode.'

    $directPreviewPromptOutput = & powershell -ExecutionPolicy Bypass -File $runnerImplementationPath $tempWpName -Execute None 2>&1 | Out-String
    if ($LASTEXITCODE -ne 0) {
        throw 'Runner prompt preview should work through the moved implementation.'
    }
    Assert-Contains `
        -Text $directPreviewPromptOutput `
        -Pattern 'Mode:\s*preview Codex prompt' `
        -Message 'Moved runner prompt preview did not report preview mode.'

    & powershell -ExecutionPolicy Bypass -File $runnerPath $tempWpName -Execute AntiGravity | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw 'Allowed-file audit path should not fail isolation.'
    }

    $allowedWp = Get-Content -LiteralPath $tempWpPath -Raw
    Assert-Contains `
        -Text $allowedWp `
        -Pattern 'Blocker type:\s*external audit not authorized' `
        -Message 'Allowed-file audit path should reach the AGY authorization gate.'

    Set-Content -LiteralPath $outOfScopePath -Value 'temporary out-of-scope test file' -Encoding UTF8

    $mockMarker = Join-Path $tempRoot 'agy-invoked.txt'
    $mockAgy = Join-Path $tempRoot 'mock-agy.ps1'
    Set-Content -LiteralPath $mockAgy -Encoding UTF8 -Value @"
Set-Content -LiteralPath '$mockMarker' -Value 'invoked' -Encoding UTF8
Write-Output 'Verdict: PASS'
exit 0
"@
    $env:LITE_WP_AGY_CLI = $mockAgy

    & powershell -ExecutionPolicy Bypass -File $runnerPath $tempWpName -Execute AntiGravity -AllowExternalAudit | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw 'Mixed-worktree audit block should return without a process failure.'
    }

    Assert-NotExists -Path $mockMarker -Message 'AGY mock was invoked even though isolation failed.'
    $blockedWp = Get-Content -LiteralPath $tempWpPath -Raw
    Assert-Contains `
        -Text $blockedWp `
        -Pattern 'Blocker type:\s*mixed worktree' `
        -Message 'Mixed worktree was not recorded as the audit blocker.'
    Assert-Contains `
        -Text $blockedWp `
        -Pattern 'docs/isolation-temp-out-of-scope\.md' `
        -Message 'Mixed-worktree block did not list the out-of-scope file.'

    & powershell -ExecutionPolicy Bypass -File $runnerPath $tempWpName -Execute AntiGravity -AllowExternalAudit -AllowMixedWorktree | Out-Null
    if ($LASTEXITCODE -ne 0) {
        throw 'Mixed-worktree override should allow mock AGY execution.'
    }

    if (-not (Test-Path -LiteralPath $mockMarker)) {
        throw 'AGY mock was not invoked after -AllowMixedWorktree override.'
    }

    $overrideWp = Get-Content -LiteralPath $tempWpPath -Raw
    Assert-Contains `
        -Text $overrideWp `
        -Pattern 'Verdict:\s*PASS' `
        -Message 'Override run did not write mock AGY PASS output.'

    $previousErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        & powershell -ExecutionPolicy Bypass -File $commitHelperPath `
            -WorkPackagePath "WP-9998" `
            -Title 'Validate isolation helper refusal' `
            -Bullet @('exercise mixed worktree refusal') `
            -StagePath "docs/01-work-packages/$tempWpName" 2>$null | Out-Null
        $commitHelperExitCode = $LASTEXITCODE
    }
    finally {
        $ErrorActionPreference = $previousErrorActionPreference
    }
    if ($commitHelperExitCode -eq 0) {
        throw 'Commit helper should refuse mixed-worktree finalization before staging.'
    }

    $stagedFiles = & git -C $repoRoot diff --cached --name-only
    if ($LASTEXITCODE -ne 0) {
        throw 'Unable to inspect staged files after commit-helper refusal.'
    }
    if ($stagedFiles) {
        throw "Commit helper staged files before mixed-worktree refusal:`n$($stagedFiles -join [Environment]::NewLine)"
    }

    $previewOutput = & powershell -ExecutionPolicy Bypass -File $commitHelperPath `
        -WorkPackagePath "WP-9998" `
        -Title 'Validate isolation helper preview' `
        -Bullet @('exercise preview behavior') `
        -Preview 2>&1 | Out-String
    if ($LASTEXITCODE -ne 0) {
        throw 'Commit helper preview should not require clean worktree isolation.'
    }
    Assert-Contains `
        -Text $previewOutput `
        -Pattern '(?ms)Validate isolation helper preview\s+WP:\s*WP-9998\s+- exercise preview behavior' `
        -Message 'Commit helper preview did not include the resolved WP ID as the first body line.'

    $directPreviewOutput = & powershell -ExecutionPolicy Bypass -File $commitHelperImplementationPath `
        -WorkPackagePath "WP-9998" `
        -Title 'Validate moved isolation helper preview' `
        -Bullet @('exercise moved preview behavior') `
        -Preview 2>&1 | Out-String
    if ($LASTEXITCODE -ne 0) {
        throw 'Moved commit helper preview should not require clean worktree isolation.'
    }
    Assert-Contains `
        -Text $directPreviewOutput `
        -Pattern '(?ms)Validate moved isolation helper preview\s+WP:\s*WP-9998\s+- exercise moved preview behavior' `
        -Message 'Moved commit helper preview did not include the resolved WP ID as the first body line.'

    $stagedAfterPreview = & git -C $repoRoot diff --cached --name-only
    if ($LASTEXITCODE -ne 0) {
        throw 'Unable to inspect staged files after commit-helper previews.'
    }
    if ($stagedAfterPreview) {
        throw "Commit helper preview staged files unexpectedly:`n$($stagedAfterPreview -join [Environment]::NewLine)"
    }
}
finally {
    if ($null -eq $originalAgyCli) {
        Remove-Item Env:LITE_WP_AGY_CLI -ErrorAction SilentlyContinue
    }
    else {
        $env:LITE_WP_AGY_CLI = $originalAgyCli
    }

    Remove-Item -LiteralPath $outOfScopePath -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath $tempWpPath -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath $tempRoot -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host 'PASS work-package isolation checks'
