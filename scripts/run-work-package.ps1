param(
    [Parameter(Position = 0)]
    [Alias("Name", "Task", "Id", "WorkPackage")]
    [string]$Slug,

    [Alias("Prompt", "Mode")]
    [ValidateSet("Codex", "Gemini")]
    [string]$Type,

    [ValidateSet("None", "Codex", "Gemini", "Full")]
    [string]$Execute = "None",

    [switch]$EnforceScope,

    [ValidateRange(1, 1440)]
    [int]$GeminiTimeoutMinutes
)

$projectRoot = Split-Path -Path $PSScriptRoot -Parent
$workPackageDirectory = Join-Path $projectRoot 'docs/01-work-packages'

if (-not (Test-Path -LiteralPath $workPackageDirectory -PathType Container)) {
    throw "Work package directory is missing: $workPackageDirectory"
}

function ConvertTo-Slug {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Value
    )

    $normalized = $Value.Trim().ToLowerInvariant()
    $normalized = $normalized -replace '[^a-z0-9]+', '-'
    $normalized = $normalized -replace '-{2,}', '-'
    return $normalized.Trim('-')
}

function Resolve-WorkPackagePath {
    param(
        [Parameter(Mandatory = $true)]
        [string]$InputValue
    )

    $trimmed = $InputValue.Trim()
    if ([string]::IsNullOrWhiteSpace($trimmed)) {
        throw 'Work package filename or slug is required.'
    }

    if ($trimmed -match '\.md$') {
        $exactPath = Join-Path $workPackageDirectory $trimmed
        if (-not (Test-Path -LiteralPath $exactPath -PathType Leaf)) {
            throw "Work package file was not found: $exactPath"
        }

        return $exactPath
    }

    if ($trimmed -match '^WP-\d{4}-\d{2}-\d{2}-') {
        $exactPath = Join-Path $workPackageDirectory "$trimmed.md"
        if (-not (Test-Path -LiteralPath $exactPath -PathType Leaf)) {
            throw "Work package file was not found: $exactPath"
        }

        return $exactPath
    }

    $normalizedSlug = ConvertTo-Slug -Value $trimmed
    if ([string]::IsNullOrWhiteSpace($normalizedSlug)) {
        throw 'Work package slug is empty after normalization.'
    }

    $matchingWorkPackages = Get-ChildItem -LiteralPath $workPackageDirectory -Filter "WP-*-$normalizedSlug.md" -File |
        Where-Object { $_.BaseName -match "-$([regex]::Escape($normalizedSlug))$" }

    if ($matchingWorkPackages.Count -eq 0) {
        throw "No lite work package matches slug '$normalizedSlug' in $workPackageDirectory"
    }

    if ($matchingWorkPackages.Count -gt 1) {
        $matchList = $matchingWorkPackages | ForEach-Object { $_.FullName } | Out-String
        throw "Multiple work packages match slug '$normalizedSlug':`n$matchList"
    }

    return $matchingWorkPackages[0].FullName
}

function Get-SectionBody {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Content,

        [Parameter(Mandatory = $true)]
        [string[]]$Heading
    )

    $match = $null
    foreach ($currentHeading in $Heading) {
        $escapedHeading = [regex]::Escape($currentHeading)
        $pattern = "(?ms)^## $escapedHeading\s*\r?\n(.*?)(?=^## |\z)"
        $match = [regex]::Match($Content, $pattern)
        if ($match.Success) {
            break
        }
    }

    if (-not $match -or -not $match.Success) {
        $expectedHeadings = $Heading | ForEach-Object { "## $_" }
        throw "Section '$($expectedHeadings -join "' or '")' was not found."
    }

    $sectionBody = $match.Groups[1].Value
    $lines = $sectionBody -split "\r?\n"

    while ($lines.Count -gt 0 -and [string]::IsNullOrWhiteSpace($lines[0])) {
        if ($lines.Count -eq 1) {
            $lines = @()
        }
        else {
            $lines = $lines[1..($lines.Count - 1)]
        }
    }

    while ($lines.Count -gt 0 -and [string]::IsNullOrWhiteSpace($lines[$lines.Count - 1])) {
        if ($lines.Count -eq 1) {
            $lines = @()
        }
        else {
            $lines = $lines[0..($lines.Count - 2)]
        }
    }

    if ($lines.Count -gt 0 -and $lines[0].TrimStart().StartsWith('```')) {
        if ($lines.Count -eq 1) {
            $lines = @()
        }
        else {
            $lines = $lines[1..($lines.Count - 1)]
        }
    }

    if ($lines.Count -gt 0 -and $lines[$lines.Count - 1].TrimEnd().EndsWith('```')) {
        if ($lines.Count -eq 1) {
            $lines = @()
        }
        else {
            $lines = $lines[0..($lines.Count - 2)]
        }
    }

    while ($lines.Count -gt 0 -and [string]::IsNullOrWhiteSpace($lines[0])) {
        if ($lines.Count -eq 1) {
            $lines = @()
        }
        else {
            $lines = $lines[1..($lines.Count - 1)]
        }
    }

    while ($lines.Count -gt 0 -and [string]::IsNullOrWhiteSpace($lines[$lines.Count - 1])) {
        if ($lines.Count -eq 1) {
            $lines = @()
        }
        else {
            $lines = $lines[0..($lines.Count - 2)]
        }
    }

    return ($lines -join [Environment]::NewLine)
}

function Set-SectionBody {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Content,

        [Parameter(Mandatory = $true)]
        [string]$Heading,

        [Parameter(Mandatory = $true)]
        [string]$Body
    )

    $escapedHeading = [regex]::Escape($Heading)
    $pattern = "(?ms)(^## $escapedHeading\s*\r?\n)(.*?)(?=^## |\z)"
    $match = [regex]::Match($Content, $pattern)

    if (-not $match.Success) {
        throw "Section '## $Heading' was not found."
    }

    $cleanBody = $Body.Trim()
    $replacement = if ([string]::IsNullOrWhiteSpace($cleanBody)) {
        $match.Groups[1].Value + [Environment]::NewLine
    }
    else {
        $match.Groups[1].Value + $cleanBody + [Environment]::NewLine + [Environment]::NewLine
    }

    return [regex]::Replace($Content, $pattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $replacement }, 1)
}

function Get-PromptHeading {
    param(
        [Parameter(Mandatory = $true)]
        [ValidateSet("Codex", "Gemini")]
        [string]$PromptType
    )

    if ($PromptType -eq "Gemini") {
        return @("Gemini Audit Prompt", "8. Gemini Audit Prompt")
    }

    return @("Codex Prompt", "7. Codex Prompt")
}

function Format-HeadingList {
    param(
        [Parameter(Mandatory = $true)]
        [string[]]$Headings
    )

    $formatted = $Headings | ForEach-Object { "## $_" }
    return $formatted -join "' or '"
}

function Get-ResultHeading {
    param(
        [Parameter(Mandatory = $true)]
        [ValidateSet("Codex", "Gemini")]
        [string]$PromptType
    )

    if ($PromptType -eq "Gemini") {
        return "Gemini Audit Results"
    }

    return "Codex Results"
}

function Get-ConfiguredCliName {
    param(
        [Parameter(Mandatory = $true)]
        [ValidateSet("Codex", "Gemini")]
        [string]$PromptType
    )

    if ($PromptType -eq "Gemini") {
        if (-not [string]::IsNullOrWhiteSpace($env:LITE_WP_GEMINI_CLI)) {
            return $env:LITE_WP_GEMINI_CLI
        }

        return "gemini"
    }

    if (-not [string]::IsNullOrWhiteSpace($env:LITE_WP_CODEX_CLI)) {
        return $env:LITE_WP_CODEX_CLI
    }

    return "codex"
}

function Resolve-PreviewPromptType {
    param(
        [Parameter(Mandatory = $true)]
        [ValidateSet("None", "Codex", "Gemini", "Full")]
        [string]$ExecuteMode,

        [AllowNull()]
        [AllowEmptyString()]
        [string]$LegacyPromptType
    )

    if ($ExecuteMode -eq "Codex" -or $ExecuteMode -eq "Gemini") {
        return $ExecuteMode
    }

    if (-not [string]::IsNullOrWhiteSpace($LegacyPromptType) -and $LegacyPromptType -notin @("Codex", "Gemini")) {
        throw "Unsupported legacy prompt selector: $LegacyPromptType"
    }

    if (-not [string]::IsNullOrWhiteSpace($LegacyPromptType)) {
        return $LegacyPromptType
    }

    return "Codex"
}

function Format-ElapsedDuration {
    param(
        [Parameter(Mandatory = $true)]
        [TimeSpan]$Elapsed
    )

    $totalHours = [int][Math]::Floor($Elapsed.TotalHours)
    return '{0:D2}:{1:D2}:{2:D2}' -f $totalHours, $Elapsed.Minutes, $Elapsed.Seconds
}

function ConvertTo-ProcessArgument {
    param(
        [string]$Value
    )

    if ($Value -notmatch '[\s"]') {
        return $Value
    }

    return '"' + ($Value -replace '"', '\"') + '"'
}

function Invoke-PromptCli {
    param(
        [Parameter(Mandatory = $true)]
        [ValidateSet("Codex", "Gemini")]
        [string]$PromptType,

        [Parameter(Mandatory = $true)]
        [string]$PromptText,

        [int]$GeminiTimeoutMinutes
    )

    $cliName = Get-ConfiguredCliName -PromptType $PromptType
    $cliCommand = Get-Command -Name $cliName -ErrorAction SilentlyContinue
    if (-not $cliCommand) {
        throw "$PromptType CLI is not available. Expected command '$cliName'. Override with LITE_WP_${PromptType.ToUpperInvariant()}_CLI if needed."
    }

    $startInfo = New-Object System.Diagnostics.ProcessStartInfo
    $arguments = @()
    $commandSource = $cliCommand.Source
    if ([string]::IsNullOrWhiteSpace($commandSource) -and $cliCommand.CommandType -eq [System.Management.Automation.CommandTypes]::Application) {
        $commandSource = $cliCommand.Path
    }
    if ([string]::IsNullOrWhiteSpace($commandSource)) {
        $commandSource = $cliCommand.Definition
    }
    if ([string]::IsNullOrWhiteSpace($commandSource)) {
        throw "Unable to resolve launch path for $PromptType CLI '$cliName'."
    }

    if ($commandSource -match '\.ps1$') {
        $powerShellHost = Get-Command -Name 'powershell.exe' -ErrorAction SilentlyContinue
        if (-not $powerShellHost) {
            throw "Unable to launch $PromptType CLI script shim '$commandSource' because powershell.exe was not found."
        }

        $startInfo.FileName = $powerShellHost.Source
        $arguments += @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', $commandSource)
    }
    elseif ($commandSource -match '\.(cmd|bat)$') {
        $cmdHostPath = $null
        if (-not [string]::IsNullOrWhiteSpace($env:ComSpec) -and (Test-Path -LiteralPath $env:ComSpec -PathType Leaf)) {
            $cmdHostPath = $env:ComSpec
        }
        else {
            $cmdHost = Get-Command -Name 'cmd.exe' -ErrorAction SilentlyContinue
            if ($cmdHost) {
                $cmdHostPath = $cmdHost.Source
            }
        }

        if ([string]::IsNullOrWhiteSpace($cmdHostPath)) {
            throw "Unable to launch $PromptType CLI batch shim '$commandSource' because cmd.exe was not found."
        }

        $startInfo.FileName = $cmdHostPath
    }
    else {
        $startInfo.FileName = $commandSource
    }

    if ($PromptType -eq "Codex") {
        $arguments += @('exec', '--cd', $projectRoot, $PromptText)
    }
    else {
        $arguments += @('-p', $PromptText)
    }

    if ([string]::IsNullOrWhiteSpace($startInfo.FileName)) {
        throw "Unable to determine executable path for $PromptType CLI '$cliName'."
    }

    if ($commandSource -match '\.(cmd|bat)$') {
        $commandLine = @(
            ConvertTo-ProcessArgument -Value $commandSource
        ) + @(
            $arguments | ForEach-Object { ConvertTo-ProcessArgument -Value $_ }
        )
        $startInfo.Arguments = '/d /s /c ' + (ConvertTo-ProcessArgument -Value ($commandLine -join ' '))
    }
    else {
        $startInfo.Arguments = ($arguments | ForEach-Object { ConvertTo-ProcessArgument -Value $_ }) -join ' '
    }

    $startInfo.WorkingDirectory = $projectRoot
    $startInfo.UseShellExecute = $false
    $startInfo.RedirectStandardInput = $false
    $startInfo.RedirectStandardOutput = $true
    $startInfo.RedirectStandardError = $true
    $startInfo.CreateNoWindow = $true

    $process = New-Object System.Diagnostics.Process
    $process.StartInfo = $startInfo

    try {
        [void]$process.Start()
    }
    catch {
        throw "Failed to start $PromptType CLI '$commandSource': $($_.Exception.Message)"
    }

    $capacityObserved = $false
    $timedOut = $false
    $stdoutTask = $null
    $stderrTask = $null
    $stdoutBuilder = $null
    $stderrBuilder = $null
    $latestStatus = $null
    $lastStatusLine = $null

    if ($PromptType -eq "Gemini") {
        $stdoutBuilder = New-Object System.Text.StringBuilder
        $stderrBuilder = New-Object System.Text.StringBuilder
        $stdoutTask = $process.StandardOutput.ReadLineAsync()
        $stderrTask = $process.StandardError.ReadLineAsync()
    }
    else {
        $stdoutTask = $process.StandardOutput.ReadToEndAsync()
        $stderrTask = $process.StandardError.ReadToEndAsync()
    }

    Write-Host "Starting $PromptType process..."
    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    $lastProgressSeconds = 0
    $capacityStatusPrinted = $false
    while (-not $process.WaitForExit(1000)) {
        if ($PromptType -eq "Gemini") {
            $pollResult = Receive-GeminiProcessOutput `
                -Process $process `
                -StdoutTask $stdoutTask `
                -StderrTask $stderrTask `
                -StdoutBuilder $stdoutBuilder `
                -StderrBuilder $stderrBuilder `
                -LatestStatus $latestStatus `
                -CapacityObserved $capacityObserved
            $stdoutTask = $pollResult.StdoutTask
            $stderrTask = $pollResult.StderrTask
            $latestStatus = $pollResult.LatestStatus
            $capacityObserved = $pollResult.CapacityObserved
        }

        if ($PromptType -eq "Gemini" -and $capacityObserved -and -not $capacityStatusPrinted) {
            Write-Host 'Gemini status: Waiting on model capacity...'
            $capacityStatusPrinted = $true
        }

        if ($stopwatch.Elapsed.TotalSeconds -ge ($lastProgressSeconds + 15)) {
            $lastProgressSeconds = [int]$stopwatch.Elapsed.TotalSeconds
            Write-Host "$PromptType still running... elapsed $(Format-ElapsedDuration -Elapsed $stopwatch.Elapsed)"
            if ($PromptType -eq "Gemini" -and -not [string]::IsNullOrWhiteSpace($latestStatus) -and $latestStatus -ne $lastStatusLine) {
                Write-Host "Gemini status: $latestStatus"
                $lastStatusLine = $latestStatus
            }
        }

        if ($PromptType -eq "Gemini" -and $GeminiTimeoutMinutes -gt 0 -and $stopwatch.Elapsed.TotalMinutes -ge $GeminiTimeoutMinutes) {
            $timedOut = $true
            try {
                if (-not $process.HasExited) {
                    $process.CloseMainWindow() | Out-Null
                    if (-not $process.WaitForExit(2000)) {
                        $process.Kill()
                    }
                }
            }
            catch {
                if (-not $process.HasExited) {
                    $process.Kill()
                }
            }
            break
        }
    }
    $stopwatch.Stop()
    if ($timedOut) {
        $elapsedDisplay = Format-ElapsedDuration -Elapsed $stopwatch.Elapsed
        Write-Host "Gemini timed out after $elapsedDisplay"
        throw [System.TimeoutException]::new("Gemini timed out after $elapsedDisplay")
    }

    Write-Host "$PromptType finished in $(Format-ElapsedDuration -Elapsed $stopwatch.Elapsed)"

    if ($PromptType -eq "Gemini") {
        $process.WaitForExit()
        while ($stdoutTask -or $stderrTask) {
            $pollResult = Receive-GeminiProcessOutput `
                -Process $process `
                -StdoutTask $stdoutTask `
                -StderrTask $stderrTask `
                -StdoutBuilder $stdoutBuilder `
                -StderrBuilder $stderrBuilder `
                -LatestStatus $latestStatus `
                -CapacityObserved $capacityObserved `
                -WaitForCompletion
            $stdoutTask = $pollResult.StdoutTask
            $stderrTask = $pollResult.StderrTask
            $latestStatus = $pollResult.LatestStatus
            $capacityObserved = $pollResult.CapacityObserved
        }

        $stdout = $stdoutBuilder.ToString()
        $stderr = $stderrBuilder.ToString()
    }
    else {
        $stdout = $stdoutTask.GetAwaiter().GetResult()
        $stderr = $stderrTask.GetAwaiter().GetResult()
    }

    $combinedOutput = @($stdout, $stderr) -join ""
    $cleanOutput = $combinedOutput.Trim()

    if (Test-CliCapacitySignal -Text $combinedOutput) {
        $capacityObserved = $true
        Write-Host "$PromptType reported capacity/backoff; continuing to wait..."
    }

    if ($process.ExitCode -ne 0) {
        if ([string]::IsNullOrWhiteSpace($cleanOutput)) {
            throw "$PromptType CLI exited with code $($process.ExitCode) and produced no output."
        }

        if ($PromptType -eq "Gemini") {
            $failureReason = if ($capacityObserved) { 'capacity/backoff observed' } else { 'non-zero exit without clear cause' }
            throw "$PromptType CLI exited with code $($process.ExitCode) ($failureReason):`n$cleanOutput"
        }

        throw "$PromptType CLI exited with code $($process.ExitCode):`n$cleanOutput"
    }

    if ($PromptType -eq "Gemini" -and [string]::IsNullOrWhiteSpace($cleanOutput)) {
        return ''
    }

    if ([string]::IsNullOrWhiteSpace($cleanOutput)) {
        throw "$PromptType CLI completed successfully but returned no output."
    }

    return $cleanOutput
}

function Receive-GeminiProcessOutput {
    param(
        [Parameter(Mandatory = $true)]
        [System.Diagnostics.Process]$Process,

        [System.Threading.Tasks.Task[string]]$StdoutTask,

        [System.Threading.Tasks.Task[string]]$StderrTask,

        [Parameter(Mandatory = $true)]
        [System.Text.StringBuilder]$StdoutBuilder,

        [Parameter(Mandatory = $true)]
        [System.Text.StringBuilder]$StderrBuilder,

        [string]$LatestStatus,

        [bool]$CapacityObserved,

        [switch]$WaitForCompletion
    )

    while ($true) {
        $handledLine = $false

        if ($StdoutTask) {
            $stdoutReady = if ($WaitForCompletion) { $StdoutTask.Wait(100) } else { $StdoutTask.IsCompleted }
            if ($stdoutReady) {
                $stdoutLine = $StdoutTask.GetAwaiter().GetResult()
                if ($null -ne $stdoutLine) {
                    [void]$StdoutBuilder.AppendLine($stdoutLine)
                    $statusLine = Get-GeminiLiveStatusLine -Line $stdoutLine
                    if (-not [string]::IsNullOrWhiteSpace($statusLine)) {
                        $LatestStatus = $statusLine
                    }
                    if (Test-CliCapacitySignal -Text $stdoutLine) {
                        $CapacityObserved = $true
                    }
                    $StdoutTask = $Process.StandardOutput.ReadLineAsync()
                    $handledLine = $true
                }
                else {
                    $StdoutTask = $null
                }
            }
        }

        if ($StderrTask) {
            $stderrReady = if ($WaitForCompletion) { $StderrTask.Wait(100) } else { $StderrTask.IsCompleted }
            if ($stderrReady) {
                $stderrLine = $StderrTask.GetAwaiter().GetResult()
                if ($null -ne $stderrLine) {
                    [void]$StderrBuilder.AppendLine($stderrLine)
                    $statusLine = Get-GeminiLiveStatusLine -Line $stderrLine
                    if (-not [string]::IsNullOrWhiteSpace($statusLine)) {
                        $LatestStatus = $statusLine
                    }
                    if (Test-CliCapacitySignal -Text $stderrLine) {
                        $CapacityObserved = $true
                    }
                    $StderrTask = $Process.StandardError.ReadLineAsync()
                    $handledLine = $true
                }
                else {
                    $StderrTask = $null
                }
            }
        }

        if (-not $WaitForCompletion -or -not $handledLine) {
            break
        }
    }

    return @{
        StdoutTask = $StdoutTask
        StderrTask = $StderrTask
        LatestStatus = $LatestStatus
        CapacityObserved = $CapacityObserved
    }
}

function Test-CliCapacitySignal {
    param(
        [Parameter(Mandatory = $true)]
        [AllowEmptyString()]
        [string]$Text
    )

    return (
        $Text -match '(?i)Retrying with backoff' -or
        $Text -match '(?i)\b429\b' -or
        $Text -match '(?i)RESOURCE_EXHAUSTED' -or
        $Text -match '(?i)Too Many Requests'
    )
}

function Get-GeminiLiveStatusLine {
    param(
        [Parameter(Mandatory = $true)]
        [AllowEmptyString()]
        [string]$Line
    )

    $trimmed = $Line.Trim()
    if ([string]::IsNullOrWhiteSpace($trimmed)) {
        return $null
    }

    if ($trimmed -match '^(?i)Retrying with backoff\b') {
        return 'Retrying with backoff...'
    }

    if ($trimmed -match '^(?i)Attempt \d+ failed with status 429\b' -or
        $trimmed -match '^(?i)Too Many Requests\b' -or
        $trimmed -match '^(?i)RESOURCE_EXHAUSTED\b') {
        return 'Waiting on model capacity...'
    }

    if (Test-GeminiLiveStatusNoise -Line $trimmed) {
        return $null
    }

    return 'Gemini is producing output...'
}

function Test-GeminiLiveStatusNoise {
    param(
        [Parameter(Mandatory = $true)]
        [AllowEmptyString()]
        [string]$Line
    )

    return (
        $Line -match '^(?i)(_GaxiosError|at Gaxios\.|at async\b|config:\s*$|response:\s*$|status:\s*$)' -or
        $Line -match '^(?i)(##?\s*(Verdict|Strengths|Violations|Regressions|Drift risks|Non-blocking observations)\b)' -or
        $Line -match '^(?i)(I will\b|I''ll\b|I am\b|I''m\b|We will\b|We''ll\b|Let me\b|Thinking\b)' -or
        $Line -match '^(?i)(Error executing tool\b|Unauthorized tool call\b|LocalAgentExecutor\b|Tool call\b|Attempting to use\b|Blocked tool\b)' -or
        $Line -match '^(```|diff --git\b|index\s+|---\s|\+\+\+\s|@@)'
    )
}

function Show-Prompt {
    param(
        [Parameter(Mandatory = $true)]
        [ValidateSet("Codex", "Gemini")]
        [string]$PromptType,

        [Parameter(Mandatory = $true)]
        [string]$PromptText
    )

    Write-Host "$PromptType Prompt:"
    Write-Host '-------------'
    Write-Host $PromptText
    Write-Host '-------------'

    if (Get-Command -Name Set-Clipboard -ErrorAction SilentlyContinue) {
        Set-Clipboard -Value $PromptText
        Write-Host "Clipboard: copied $PromptType Prompt"
    }
    else {
        Write-Host 'Clipboard: Set-Clipboard not available, skipped'
    }
}

function Update-WorkPackageResults {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path,

        [Parameter(Mandatory = $true)]
        [ValidateSet("Codex", "Gemini")]
        [string]$PromptType,

        [Parameter(Mandatory = $true)]
        [AllowEmptyString()]
        [string]$OutputText
    )

    $content = Get-Content -LiteralPath $Path -Raw
    $normalizedOutput = Normalize-ResultText -PromptType $PromptType -OutputText $OutputText
    $usedFallback = $false

    if ($PromptType -eq "Gemini" -and [string]::IsNullOrWhiteSpace($normalizedOutput)) {
        $normalizedOutput = 'Gemini produced no retained audit block. Review raw CLI output or rerun.'
        $usedFallback = $true
    }

    $updated = Set-SectionBody -Content $content -Heading (Get-ResultHeading -PromptType $PromptType) -Body $normalizedOutput
    Set-Content -LiteralPath $Path -Value $updated -Encoding UTF8

    return @{
        Succeeded = $true
        UsedFallback = $usedFallback
    }
}

function Normalize-WorkPackagePath {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path
    )

    $normalized = $Path.Trim()
    if ([string]::IsNullOrWhiteSpace($normalized)) {
        return $null
    }

    $normalized = $normalized.Trim('`', '"', "'", ' ')
    $normalized = $normalized -replace '\bonly\b\s*$', ''
    $normalized = $normalized -replace '^[.][\\/]', ''
    $normalized = $normalized -replace '\\', '/'
    $normalized = $normalized.Trim()

    if ([string]::IsNullOrWhiteSpace($normalized)) {
        return $null
    }

    return $normalized.ToLowerInvariant()
}

function Get-AllowedWorkPackageFiles {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Content
    )

    $sectionBody = Get-SectionBody -Content $Content -Heading @('Files Allowed to Change')
    $allowedFiles = New-Object System.Collections.Generic.List[string]

    foreach ($line in ($sectionBody -split "\r?\n")) {
        $pathMatches = [regex]::Matches($line, '`([^`]+)`')
        if ($pathMatches.Count -gt 0) {
            foreach ($match in $pathMatches) {
                $normalizedPath = Normalize-WorkPackagePath -Path $match.Groups[1].Value
                if (-not [string]::IsNullOrWhiteSpace($normalizedPath) -and -not $allowedFiles.Contains($normalizedPath)) {
                    [void]$allowedFiles.Add($normalizedPath)
                }
            }

            continue
        }

        $candidate = $line.Trim()
        if ([string]::IsNullOrWhiteSpace($candidate)) {
            continue
        }

        $candidate = $candidate -replace '^[\*\-\u2022]\s*', ''
        $candidate = $candidate -replace '\s+only\s*$', ''

        if ($candidate -notmatch '[\\/]') {
            continue
        }

        $normalizedCandidate = Normalize-WorkPackagePath -Path $candidate
        if (-not [string]::IsNullOrWhiteSpace($normalizedCandidate) -and -not $allowedFiles.Contains($normalizedCandidate)) {
            [void]$allowedFiles.Add($normalizedCandidate)
        }
    }

    return @($allowedFiles)
}

function Get-GitModifiedFiles {
    $gitStatusOutput = git status --porcelain
    if ($LASTEXITCODE -ne 0) {
        throw 'Failed to capture modified files with git status --porcelain.'
    }

    $modifiedFiles = New-Object System.Collections.Generic.List[string]

    foreach ($line in $gitStatusOutput) {
        if ([string]::IsNullOrWhiteSpace($line) -or $line.Length -lt 4) {
            continue
        }

        $statusCode = $line.Substring(0, 2)
        $pathText = $line.Substring(3).Trim()

        if ([string]::IsNullOrWhiteSpace($pathText)) {
            continue
        }

        if ($statusCode -match 'D') {
            continue
        }

        if ($statusCode -notmatch '[MARC\?]') {
            continue
        }

        if ($pathText -match ' -> ') {
            $pathText = ($pathText -split ' -> ', 2)[1]
        }

        $normalizedPath = Normalize-WorkPackagePath -Path $pathText
        if (-not [string]::IsNullOrWhiteSpace($normalizedPath) -and -not $modifiedFiles.Contains($normalizedPath)) {
            [void]$modifiedFiles.Add($normalizedPath)
        }
    }

    return @($modifiedFiles)
}

function Format-ScopeCheckSection {
    param(
        [string[]]$AllowedFiles,

        [string[]]$ModifiedFiles,

        [string[]]$OutOfScopeFiles
    )

    $lines = New-Object System.Collections.Generic.List[string]
    [void]$lines.Add('### Scope Check')
    [void]$lines.Add('')
    if ($OutOfScopeFiles.Count -gt 0) {
        [void]$lines.Add('Result: VIOLATION - out-of-scope file changes detected')
    }
    else {
        [void]$lines.Add('Result: PASS - no out-of-scope file changes detected')
    }

    [void]$lines.Add('')
    [void]$lines.Add('Allowed files')
    [void]$lines.Add('-------------')
    if ($AllowedFiles.Count -gt 0) {
        foreach ($path in $AllowedFiles) {
            [void]$lines.Add("- $path")
        }
    }
    else {
        [void]$lines.Add('- None')
    }

    [void]$lines.Add('')
    [void]$lines.Add('Modified files')
    [void]$lines.Add('--------------')
    if ($ModifiedFiles.Count -gt 0) {
        foreach ($path in $ModifiedFiles) {
            [void]$lines.Add("- $path")
        }
    }
    else {
        [void]$lines.Add('- None')
    }

    [void]$lines.Add('')
    [void]$lines.Add('Out-of-scope files')
    [void]$lines.Add('------------------')
    if ($OutOfScopeFiles.Count -gt 0) {
        foreach ($path in $OutOfScopeFiles) {
            [void]$lines.Add("! $path")
        }
    }
    else {
        [void]$lines.Add('- None')
    }

    return ($lines -join [Environment]::NewLine)
}

function Normalize-ResultText {
    param(
        [Parameter(Mandatory = $true)]
        [ValidateSet("Codex", "Gemini")]
        [string]$PromptType,

        [Parameter(Mandatory = $true)]
        [AllowEmptyString()]
        [string]$OutputText
    )

    $normalized = Remove-AnsiSequences -Text $OutputText
    $normalized = $normalized -replace "`r`n?", "`n"

    if ($PromptType -eq "Gemini") {
        $normalized = Select-ResultBlock -Text $normalized -StartPattern @(
            '(?im)^## Verdict:\s*',
            '(?im)^Verdict:\s*',
            '(?im)^✦ Audit Result:\s*',
            '(?im)^# Audit Report\b',
            '(?im)^1\.\s+Overall Verdict:\s*'
        )
        $normalized = Trim-GeminiToFinalAuditBlock -Text $normalized
        $normalized = Trim-GeminiInvestigativePreamble -Text $normalized
        $normalized = Trim-GeminiRuntimeSpill -Text $normalized
        $normalized = Compress-GeminiAuditBlock -Text $normalized
    }
    else {
        $normalized = Select-ResultBlock -Text $normalized -StartPattern @(
            '(?im)^[\*\-\u2022]?\s*File changed[s]?:\s*',
            '(?im)^What was implemented:\s*',
            '(?im)^Updated\s+',
            '(?im)^Fixed\s+',
            '(?im)^Added\s+',
            '(?im)^Removed\s+',
            '(?im)^Implemented\s+',
            '(?im)^Changed\s+'
        )
        $normalized = Trim-CodexTranscriptAfterSummary -Text $normalized
    }

    $normalized = Trim-TrailingCliNoise -Text $normalized
    $normalized = Strip-OuterCodeFence -Text $normalized
    return $normalized.Trim()
}

function Select-ResultBlock {
    param(
        [Parameter(Mandatory = $true)]
        [AllowEmptyString()]
        [string]$Text,

        [Parameter(Mandatory = $true)]
        [string[]]$StartPattern
    )

    $bestIndex = -1
    foreach ($pattern in $StartPattern) {
        $matches = [regex]::Matches($Text, $pattern)
        if ($matches.Count -gt 0) {
            $candidateIndex = $matches[$matches.Count - 1].Index
            if ($candidateIndex -gt $bestIndex) {
                $bestIndex = $candidateIndex
            }
        }
    }

    if ($bestIndex -lt 0) {
        return $Text
    }

    return $Text.Substring($bestIndex)
}

function Trim-TrailingCliNoise {
    param(
        [Parameter(Mandatory = $true)]
        [AllowEmptyString()]
        [string]$Text
    )

    $lines = $Text -split "`n"
    $kept = New-Object System.Collections.Generic.List[string]

    foreach ($line in $lines) {
        if ($line -match '^Error executing tool ' -or $line -match '^Tool ".*" not found\.') {
            break
        }
        [void]$kept.Add($line)
    }

    return ($kept -join "`n")
}

function Trim-GeminiToFinalAuditBlock {
    param(
        [Parameter(Mandatory = $true)]
        [AllowEmptyString()]
        [string]$Text
    )

    $lines = $Text -split "`n"

    for ($index = 0; $index -lt $lines.Count; $index++) {
        if (Test-GeminiFinalReportAnchor -Line $lines[$index]) {
            return ($lines[$index..($lines.Count - 1)] -join "`n")
        }
    }

    return $Text
}

function Compress-GeminiAuditBlock {
    param(
        [Parameter(Mandatory = $true)]
        [AllowEmptyString()]
        [string]$Text
    )

    $trimmedText = $Text.Trim()
    if ([string]::IsNullOrWhiteSpace($trimmedText)) {
        return ''
    }

    $lines = $trimmedText -split "`n"
    $sections = @{
        Verdict = New-Object System.Collections.Generic.List[string]
        Strengths = New-Object System.Collections.Generic.List[string]
        Violations = New-Object System.Collections.Generic.List[string]
        Regressions = New-Object System.Collections.Generic.List[string]
        'Drift risks' = New-Object System.Collections.Generic.List[string]
    }
    $currentSection = $null

    foreach ($line in $lines) {
        $trimmedLine = $line.Trim()
        if ([string]::IsNullOrWhiteSpace($trimmedLine)) {
            if ($currentSection -and $sections[$currentSection].Count -gt 0 -and $sections[$currentSection][$sections[$currentSection].Count - 1] -ne '') {
                [void]$sections[$currentSection].Add('')
            }
            continue
        }

        $matchedSection = $null
        $matchedContent = $null

        if ($trimmedLine -match '^(?i)(?:##\s*)?Verdict:\s*(.*)$') {
            $matchedSection = 'Verdict'
            $matchedContent = $matches[1].Trim()
        }
        elseif ($trimmedLine -match '^(?i)(?:##\s*)?Strengths:\s*(.*)$') {
            $matchedSection = 'Strengths'
            $matchedContent = $matches[1].Trim()
        }
        elseif ($trimmedLine -match '^(?i)(?:##\s*)?Violations:\s*(.*)$') {
            $matchedSection = 'Violations'
            $matchedContent = $matches[1].Trim()
        }
        elseif ($trimmedLine -match '^(?i)(?:##\s*)?Regressions:\s*(.*)$') {
            $matchedSection = 'Regressions'
            $matchedContent = $matches[1].Trim()
        }
        elseif ($trimmedLine -match '^(?i)(?:##\s*)?Drift risks:\s*(.*)$') {
            $matchedSection = 'Drift risks'
            $matchedContent = $matches[1].Trim()
        }
        elseif ($trimmedLine -match '^(?i)1\.\s+Overall Verdict:\s*(.*)$') {
            $matchedSection = 'Verdict'
            $matchedContent = $matches[1].Trim()
        }

        if ($matchedSection) {
            $currentSection = $matchedSection
            if (-not [string]::IsNullOrWhiteSpace($matchedContent)) {
                [void]$sections[$currentSection].Add($matchedContent)
            }
            continue
        }

        if (-not $currentSection) {
            continue
        }

        if ($trimmedLine -match '^(?i)(summary|audit summary|overall assessment)\s*:') {
            continue
        }

        if ($trimmedLine.Length -gt 200) {
            continue
        }

        if ($currentSection -eq 'Verdict') {
            if ($sections['Verdict'].Count -ge 2) {
                continue
            }

            if ($trimmedLine -notmatch '^[\*\-\u2022]|\b(pass|fail|warning|warn|approve|approved|reject|rejected|blocked|blocker|drift|regression|violation|compliant|non-compliant)\b') {
                continue
            }
        }
        else {
            if ($trimmedLine -notmatch '^[\*\-\u2022]') {
                continue
            }
        }

        [void]$sections[$currentSection].Add($trimmedLine)
    }

    $output = New-Object System.Collections.Generic.List[string]
    $orderedSections = @('Verdict', 'Strengths', 'Violations', 'Regressions', 'Drift risks')

    foreach ($sectionName in $orderedSections) {
        $sectionLines = @($sections[$sectionName] | Where-Object { $_ -ne '' })
        if ($sectionLines.Count -eq 0) {
            continue
        }

        if ($sectionName -eq 'Strengths') {
            if ($sectionLines.Count -gt 2) {
                continue
            }

            $hasLongStrength = $false
            foreach ($sectionLine in $sectionLines) {
                if ($sectionLine.Length -gt 120) {
                    $hasLongStrength = $true
                    break
                }
            }

            if ($hasLongStrength) {
                continue
            }
        }

        if ($output.Count -gt 0) {
            [void]$output.Add('')
        }

        [void]$output.Add("## $sectionName")
        foreach ($sectionLine in $sectionLines) {
            [void]$output.Add($sectionLine)
        }
    }

    if ($output.Count -eq 0) {
        return $trimmedText
    }

    return ($output -join "`n").Trim()
}

function Trim-GeminiInvestigativePreamble {
    param(
        [Parameter(Mandatory = $true)]
        [AllowEmptyString()]
        [string]$Text
    )

    $lines = $Text -split "`n"
    $lastPreambleIndex = -1

    for ($index = 0; $index -lt $lines.Count; $index++) {
        if (Test-GeminiInvestigativePreambleMarker -Line $lines[$index]) {
            $lastPreambleIndex = $index
        }
    }

    if ($lastPreambleIndex -lt 0) {
        return $Text
    }

    for ($index = $lastPreambleIndex + 1; $index -lt $lines.Count; $index++) {
        if (Test-GeminiFinalReportAnchor -Line $lines[$index]) {
            return ($lines[$index..($lines.Count - 1)] -join "`n")
        }
    }

    return $Text
}

function Test-GeminiInvestigativePreambleMarker {
    param(
        [Parameter(Mandatory = $true)]
        [AllowEmptyString()]
        [string]$Line
    )

    $trimmed = $Line.Trim()
    if ([string]::IsNullOrWhiteSpace($trimmed)) {
        return $false
    }

    return (
        $trimmed -match '^(?i)I will start by\b' -or
        $trimmed -match '^(?i)I will read\b' -or
        $trimmed -match '^(?i)I will check\b' -or
        $trimmed -match '^(?i)I will examine\b' -or
        $trimmed -match '^(?i)I will now\b' -or
        $trimmed -match '^(?i)I''ll now\b'
    )
}

function Test-GeminiFinalReportAnchor {
    param(
        [Parameter(Mandatory = $true)]
        [AllowEmptyString()]
        [string]$Line
    )

    $trimmed = $Line.Trim()
    if ([string]::IsNullOrWhiteSpace($trimmed)) {
        return $false
    }

    return (
        $trimmed -match '^(?i)## Verdict:\s*' -or
        $trimmed -match '^(?i)Verdict:\s*' -or
        $trimmed -match '^(?i)1\.\s+Overall Verdict:\s*' -or
        $trimmed -match '^(?i)##?\s*Strengths\b' -or
        $trimmed -match '^(?i)##?\s*Violations\b' -or
        $trimmed -match '^(?i)##?\s*Regressions\b' -or
        $trimmed -match '^(?i)##?\s*Drift risks\b' -or
        $trimmed -match '^(?i)##?\s*Non-blocking observations\b'
    )
}

function Trim-GeminiRuntimeSpill {
    param(
        [Parameter(Mandatory = $true)]
        [AllowEmptyString()]
        [string]$Text
    )

    $lines = $Text -split "`n"
    $kept = New-Object System.Collections.Generic.List[string]

    foreach ($line in $lines) {
        if ($kept.Count -gt 0 -and (Test-GeminiRuntimeSpillMarker -Line $line)) {
            break
        }

        [void]$kept.Add($line)
    }

    return ($kept -join "`n")
}

function Test-GeminiRuntimeSpillMarker {
    param(
        [Parameter(Mandatory = $true)]
        [AllowEmptyString()]
        [string]$Line
    )

    $trimmed = $Line.Trim()
    if ([string]::IsNullOrWhiteSpace($trimmed)) {
        return $false
    }

    return (
        $trimmed -match '^(?i)Attempt 1 failed with status\b' -or
        $trimmed -match '^(?i)Retrying with backoff\b' -or
        $trimmed -match '^(?i)_GaxiosError\b' -or
        $trimmed -match '^(?i)at Gaxios\.' -or
        $trimmed -match '^(?i)at async\b' -or
        $trimmed -match '^(?i)config:\s*$' -or
        $trimmed -match '^(?i)response:\s*$' -or
        $trimmed -match '^(?i)status:\s*$' -or
        $trimmed -match '^(?i)Too Many Requests\b' -or
        $trimmed -match '^(?i)RESOURCE_EXHAUSTED\b'
    )
}

function Trim-CodexTranscriptAfterSummary {
    param(
        [Parameter(Mandatory = $true)]
        [AllowEmptyString()]
        [string]$Text
    )

    $lines = $Text -split "`n"
    $kept = New-Object System.Collections.Generic.List[string]

    foreach ($line in $lines) {
        if ($kept.Count -gt 0 -and (Test-CodexTranscriptMarker -Line $line)) {
            break
        }

        [void]$kept.Add($line)
    }

    return ($kept -join "`n")
}

function Test-CodexTranscriptMarker {
    param(
        [Parameter(Mandatory = $true)]
        [AllowEmptyString()]
        [string]$Line
    )

    $trimmed = $Line.Trim()
    if ([string]::IsNullOrWhiteSpace($trimmed)) {
        return $false
    }

    return (
        $trimmed -match '^diff --git\b' -or
        $trimmed -match '^index\s+' -or
        $trimmed -match '^---\s' -or
        $trimmed -match '^\+\+\+\s' -or
        $trimmed -match '^@@' -or
        $trimmed -match '^(?i)Reading additional input from stdin\b' -or
        $trimmed -match '^(?i)OpenAI Codex\b' -or
        $trimmed -match '^(?i)user$' -or
        $trimmed -match '^(?i)codex$' -or
        $trimmed -match '^(?i)exec$' -or
        $trimmed -match '^(?i)succeeded in\b' -or
        $trimmed -match '^(?i)exited\b' -or
        $trimmed -match '^(?i)ERROR\b' -or
        $trimmed -match '^Tool "' -or
        $trimmed -match '^Error executing tool ' -or
        $trimmed -match '^(?i)PS [^>]+>' -or
        $trimmed -match '^(?i)At line:\d+ char:\d+' -or
        $trimmed -match '^\+ CategoryInfo\s*:' -or
        $trimmed -match '^\+ FullyQualifiedErrorId\s*:'
    )
}

function Strip-OuterCodeFence {
    param(
        [Parameter(Mandatory = $true)]
        [AllowEmptyString()]
        [string]$Text
    )

    $lines = $Text -split "`n"
    while ($lines.Count -gt 0 -and [string]::IsNullOrWhiteSpace($lines[0])) {
        if ($lines.Count -eq 1) {
            $lines = @()
        }
        else {
            $lines = $lines[1..($lines.Count - 1)]
        }
    }

    while ($lines.Count -gt 0 -and [string]::IsNullOrWhiteSpace($lines[$lines.Count - 1])) {
        if ($lines.Count -eq 1) {
            $lines = @()
        }
        else {
            $lines = $lines[0..($lines.Count - 2)]
        }
    }

    if ($lines.Count -ge 2 -and $lines[0].TrimStart().StartsWith('```') -and $lines[$lines.Count - 1].TrimEnd().EndsWith('```')) {
        if ($lines.Count -eq 2) {
            return ''
        }
        return ($lines[1..($lines.Count - 2)] -join "`n")
    }

    return ($lines -join "`n")
}

function Remove-AnsiSequences {
    param(
        [Parameter(Mandatory = $true)]
        [AllowEmptyString()]
        [string]$Text
    )

    return [regex]::Replace($Text, '\x1B\[[0-9;?]*[ -/]*[@-~]', '')
}

function Invoke-ExecutionStep {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path,

        [Parameter(Mandatory = $true)]
        [string]$Content,

        [Parameter(Mandatory = $true)]
        [ValidateSet("Codex", "Gemini")]
        [string]$PromptType,

        [switch]$EnforceScope,

        [int]$GeminiTimeoutMinutes
    )

    $promptHeading = Get-PromptHeading -PromptType $PromptType
    $promptText = Get-SectionBody -Content $Content -Heading $promptHeading

    if ([string]::IsNullOrWhiteSpace($promptText)) {
        throw "Section '$(Format-HeadingList -Headings $promptHeading)' is empty in $Path"
    }

    Write-Host ''
    Write-Host "Executing $PromptType CLI..."
    try {
        $outputText = Invoke-PromptCli -PromptType $PromptType -PromptText $promptText -GeminiTimeoutMinutes $GeminiTimeoutMinutes
    }
    catch [System.TimeoutException] {
        if ($PromptType -eq "Gemini") {
            $timeoutDuration = ([TimeSpan]::FromMinutes($GeminiTimeoutMinutes)).ToString('mm\:ss')
            $timeoutNote = "Verdict: Gemini audit timed out after $timeoutDuration before a final audit report was produced."
            $writeResult = Update-WorkPackageResults -Path $Path -PromptType $PromptType -OutputText $timeoutNote
            if ($writeResult.Succeeded) {
                if ($writeResult.UsedFallback) {
                    Write-Host "Gemini fallback note written to section '## $(Get-ResultHeading -PromptType $PromptType)'"
                }
                else {
                    Write-Host "Gemini timeout note written to section '## $(Get-ResultHeading -PromptType $PromptType)'"
                }
            }

            throw [System.TimeoutException]::new("Gemini audit timed out after $timeoutDuration. Timeout note written to '## $(Get-ResultHeading -PromptType $PromptType)'.")
        }

        throw
    }
    $scopeViolationDetected = $false
    if ($PromptType -eq "Codex") {
        $allowedFiles = Get-AllowedWorkPackageFiles -Content $Content
        $modifiedFiles = Get-GitModifiedFiles
        $outOfScopeFiles = @($modifiedFiles | Where-Object { $allowedFiles -notcontains $_ })
        $scopeCheck = Format-ScopeCheckSection -AllowedFiles $allowedFiles -ModifiedFiles $modifiedFiles -OutOfScopeFiles $outOfScopeFiles

        if (-not [string]::IsNullOrWhiteSpace($outputText)) {
            $outputText = $outputText.TrimEnd() + [Environment]::NewLine + [Environment]::NewLine + $scopeCheck
        }
        else {
            $outputText = $scopeCheck
        }

        if ($outOfScopeFiles.Count -gt 0) {
            if ($EnforceScope) {
                Write-Error 'Scope check failed: out-of-scope file modifications detected. Codex results were recorded; remaining workflow steps are skipped.'
                $scopeViolationDetected = $true
            }
            else {
                Write-Host 'SCOPE CHECK WARNING: out-of-scope file modifications detected'
            }
        }
        else {
            Write-Host 'Scope check passed: no out-of-scope file modifications detected'
        }
    }

    $writeResult = Update-WorkPackageResults -Path $Path -PromptType $PromptType -OutputText $outputText
    if ($writeResult.Succeeded) {
        if ($PromptType -eq "Gemini" -and $writeResult.UsedFallback) {
            Write-Host "Gemini fallback note written to section '## $(Get-ResultHeading -PromptType $PromptType)'"
        }
        else {
            Write-Host "$PromptType results written to section '## $(Get-ResultHeading -PromptType $PromptType)'"
        }
    }

    if ($scopeViolationDetected) {
        throw 'Scope enforcement failed because out-of-scope file modifications were detected.'
    }
}

$workPackageInput = $Slug
if ([string]::IsNullOrWhiteSpace($workPackageInput)) {
    $workPackageInput = Read-Host 'Enter lite work package filename or slug'
}

$workPackagePath = Resolve-WorkPackagePath -InputValue $workPackageInput
$workPackageContent = Get-Content -LiteralPath $workPackagePath -Raw

Write-Host "Work package: $workPackagePath"
Write-Host ''

if ($Execute -eq "None") {
    $selectedPromptType = Resolve-PreviewPromptType -ExecuteMode $Execute -LegacyPromptType $Type
    $promptHeading = Get-PromptHeading -PromptType $selectedPromptType
    $selectedPrompt = Get-SectionBody -Content $workPackageContent -Heading $promptHeading

    if ([string]::IsNullOrWhiteSpace($selectedPrompt)) {
        throw "Section '$(Format-HeadingList -Headings $promptHeading)' is empty in $workPackagePath"
    }
    Write-Host "Mode: preview $selectedPromptType prompt"
    Write-Host 'Default: when -Execute is omitted, the script previews the Codex prompt.'
    if (-not [string]::IsNullOrWhiteSpace($Type)) {
        Write-Host "Compatibility: using legacy prompt selector '$Type'."
    }
    Write-Host ''
    Show-Prompt -PromptType $selectedPromptType -PromptText $selectedPrompt
    Write-Host ''
    Write-Host 'Next steps:'
    Write-Host "1. Run the prompt in $selectedPromptType."
    Write-Host "2. Paste results into $(Get-ResultHeading -PromptType $selectedPromptType)."
    if ($selectedPromptType -eq "Codex") {
        Write-Host '3. Run Gemini Audit Prompt.'
    }
    return
}

switch ($Execute) {
    "Codex" {
        Write-Host 'Mode: execute Codex'
        Write-Host ''
        Invoke-ExecutionStep -Path $workPackagePath -Content $workPackageContent -PromptType "Codex" -EnforceScope:$EnforceScope -GeminiTimeoutMinutes $GeminiTimeoutMinutes
    }
    "Gemini" {
        Write-Host 'Mode: execute Gemini'
        Write-Host ''
        Invoke-ExecutionStep -Path $workPackagePath -Content $workPackageContent -PromptType "Gemini" -EnforceScope:$EnforceScope -GeminiTimeoutMinutes $GeminiTimeoutMinutes
    }
    "Full" {
        Write-Host 'Mode: run full workflow'
        Write-Host ''
        Invoke-ExecutionStep -Path $workPackagePath -Content $workPackageContent -PromptType "Codex" -EnforceScope:$EnforceScope -GeminiTimeoutMinutes $GeminiTimeoutMinutes
        $workPackageContent = Get-Content -LiteralPath $workPackagePath -Raw
        Invoke-ExecutionStep -Path $workPackagePath -Content $workPackageContent -PromptType "Gemini" -EnforceScope:$EnforceScope -GeminiTimeoutMinutes $GeminiTimeoutMinutes
    }
    default {
        throw "Unsupported execute mode: $Execute"
    }
}

Write-Host ''
Write-Host 'Next steps:'
Write-Host '1. Review the updated work package sections.'
Write-Host '2. Confirm Codex and Gemini outputs are acceptable.'
Write-Host '3. Update Final Decision manually when ready.'
