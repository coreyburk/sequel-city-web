param(
    [Parameter(Position = 0)]
    [Alias("Name", "Task", "Id", "WorkPackage")]
    [string]$Slug,

    [Alias("Prompt", "Mode")]
    [ValidateSet("Codex", "Gemini")]
    [string]$Type,

    [ValidateSet("None", "Codex", "Claude", "Gemini", "AntiGravity", "Audit", "Full")]
    [string]$Execute = "None",

    [ValidateSet("Codex", "Claude")]
    [string]$CodeAgent = "Codex",

    [ValidateSet("default", "acceptEdits", "auto", "dontAsk", "bypassPermissions")]
    [string]$ClaudePermissionMode = "default",

    [switch]$EnforceScope,

    [ValidateSet("Gemini", "AntiGravity")]
    [string]$AuditAgent = "Gemini",

    [switch]$AllowExternalAudit,

    [switch]$AllowMixedWorktree,

    [ValidateRange(1, 1440)]
    [int]$GeminiTimeoutMinutes,

    [ValidateRange(1, 1440)]
    [int]$AntiGravityTimeoutMinutes = 10
)

$ErrorActionPreference = 'Stop'

$implementationPath = Join-Path $PSScriptRoot 'work-package/run-work-package.ps1'
& $implementationPath @PSBoundParameters
exit $LASTEXITCODE
