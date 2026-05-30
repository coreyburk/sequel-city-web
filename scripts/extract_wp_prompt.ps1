Param(
    [string]$WorkPackagePath = "docs/01-work-packages/WP-140-mastermind-progression.md"
)

if (-not (Test-Path -Path $WorkPackagePath)) {
    Write-Error "Work package not found: $WorkPackagePath"
    exit 2
}

$content = Get-Content -Raw -Path $WorkPackagePath

function Get-Section([string]$Content, [string]$Heading) {
    $escaped = [regex]::Escape($Heading)
    $pattern = "(?ms)^## $escaped\s*\r?\n(.*?)(?=^## |\z)"
    $m = [regex]::Match($Content, $pattern)
    if ($m.Success) { return $m.Groups[1].Value.Trim() }
    return $null
}

$codeHeadings = @('Code Prompt','Codex Prompt','7. Codex Prompt')
$printed = $false
foreach ($h in $codeHeadings) {
    $sec = Get-Section $content $h
    if ($sec) {
        Write-Host "=== $h ===`n"
        Write-Host $sec
        $printed = $true
        break
    }
}
if (-not $printed) { Write-Host "No Code Prompt section found." }

$auditHeadings = @('Audit Prompt','8. Audit Prompt','Gemini Audit Prompt','AntiGravity Audit Prompt','8. AntiGravity Audit Prompt')
$printed = $false
foreach ($h in $auditHeadings) {
    $sec = Get-Section $content $h
    if ($sec) {
        Write-Host "`n=== $h ===`n"
        Write-Host $sec
        $printed = $true
        break
    }
}
if (-not $printed) { Write-Host "No Audit Prompt section found." }
