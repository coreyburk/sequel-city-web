$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Path (Split-Path -Path $PSScriptRoot -Parent) -Parent
$skillRoot = Join-Path $repoRoot '.codex/skills/sequel-city-wp-closeout-handoff'
$skillPath = Join-Path $skillRoot 'SKILL.md'
$promptPath = Join-Path $skillRoot 'references/closeout-prompts.md'
$openAiYamlPath = Join-Path $skillRoot 'agents/openai.yaml'

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

if (-not (Test-Path -LiteralPath $skillPath -PathType Leaf)) {
    throw "Missing skill file: $skillPath"
}
if (-not (Test-Path -LiteralPath $promptPath -PathType Leaf)) {
    throw "Missing prompt reference: $promptPath"
}
if (-not (Test-Path -LiteralPath $openAiYamlPath -PathType Leaf)) {
    throw "Missing agents/openai.yaml: $openAiYamlPath"
}

$skill = Get-Content -LiteralPath $skillPath -Raw
$prompts = Get-Content -LiteralPath $promptPath -Raw
$openAiYaml = Get-Content -LiteralPath $openAiYamlPath -Raw

Assert-Contains -Text $skill -Pattern '(?m)^name:\s*sequel-city-wp-closeout-handoff\s*$' -Message 'Skill name is incorrect.'

$triggerPhrases = @(
    'close out WP',
    'finalize WP',
    'audit complete',
    'review/update/commit/push',
    'update handoff',
    'refresh handoff',
    'accepted work package',
    'proper closeout request'
)

foreach ($phrase in $triggerPhrases) {
    Assert-Contains -Text $skill -Pattern ([regex]::Escape($phrase)) -Message "Skill description is missing trigger phrase: $phrase"
}

$requiredReads = @(
    'Contributor-Workflow-Guide.md',
    'Work-Package-Lifecycle.md',
    'Commit-Message-Guide.md',
    'sequel-city-wp-finalize/SKILL.md',
    'sequel-city-audit-runner-contracts/SKILL.md',
    'references/closeout-prompts.md'
)

foreach ($read in $requiredReads) {
    Assert-Contains -Text $skill -Pattern ([regex]::Escape($read)) -Message "Skill required reads are missing: $read"
}

$promptPhrases = @(
    'Close out WP-178',
    'AGY audit is complete',
    'refresh END-OF-DAY-HANDOFF.md',
    'Do not commit if audit failed',
    'scripts/commit-work-package.ps1'
)

foreach ($phrase in $promptPhrases) {
    Assert-Contains -Text $prompts -Pattern ([regex]::Escape($phrase)) -Message "Prompt reference is missing: $phrase"
}

Assert-Contains -Text $openAiYaml -Pattern 'default_prompt:\s*"Use \$sequel-city-wp-closeout-handoff' -Message 'openai.yaml default prompt must explicitly name the skill.'

Write-Host 'PASS wp closeout handoff skill checks'
