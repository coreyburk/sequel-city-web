$templatePath = 'D:\GitHub-Repos\Canvas\docs\90-templates\work-package-template.md'
$destinationDirectory = 'D:\GitHub-Repos\Canvas\docs\01-work-packages'

# Prompt for a human-readable slug, then normalize it for the file name.
$rawSlug = Read-Host 'Enter work package slug'
$normalizedSlug = $rawSlug.Trim().ToLower()
$normalizedSlug = $normalizedSlug -replace '\s+', '-'
$normalizedSlug = $normalizedSlug -replace '[^a-z0-9-]', ''
$normalizedSlug = $normalizedSlug -replace '-{2,}', '-'
$normalizedSlug = $normalizedSlug.Trim('-')

if ([string]::IsNullOrWhiteSpace($normalizedSlug)) {
    throw 'Work package slug is empty after normalization. Please use letters, numbers, or spaces.'
}

$date = Get-Date -Format 'yyyy-MM-dd'
$workPackageId = "WP-$date-$normalizedSlug"
$destinationPath = Join-Path $destinationDirectory "$workPackageId.md"

if (-not (Test-Path -LiteralPath $templatePath)) {
    throw "Template file does not exist: $templatePath"
}

if (Test-Path -LiteralPath $destinationPath) {
    throw "Destination file already exists: $destinationPath"
}

# Replace the root template placeholders with the generated identifier and date.
$templateContent = Get-Content -LiteralPath $templatePath -Raw
$templateContent = $templateContent.Replace('WP-YYYY-MM-DD-slug', $workPackageId)
$templateContent = $templateContent.Replace('YYYY-MM-DD', $date)

Set-Content -LiteralPath $destinationPath -Value $templateContent -Encoding UTF8

Write-Host "Created: $destinationPath"
Write-Host ''
Write-Host 'Next steps:'
Write-Host '1. Fill in the work package details and constraints.'
Write-Host '2. Review the scope to keep the task bounded and deterministic.'
Write-Host '3. Hand the file to the implementation workflow when ready.'
