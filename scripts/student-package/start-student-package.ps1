param(
    [string]$SqlHost = "localhost",
    [int]$SqlPort = 1433,
    [string]$DatabaseName = "SequelCityCrimesDB",
    [string]$SqlUser = "",
    [string]$SqlPassword = "",
    [switch]$PromptForDatabaseSettings,
    [switch]$ResetEnvironment,
    [int]$ApiPort = 3001,
    [int]$WebPort = 5173,
    [int]$StartupTimeoutSeconds = 90,
    [switch]$NoBrowser,
    [switch]$SetupOnly,
    [switch]$LibraryOnly
)
$ErrorActionPreference = 'Stop'
$scriptsRoot = Split-Path $PSScriptRoot -Parent
$projectRoot = Split-Path $scriptsRoot -Parent
$launcherLibraryOnly = $LibraryOnly
. (Join-Path $PSScriptRoot 'install-student-database.ps1') -SqlHost $SqlHost -SqlPort $SqlPort -DatabaseName $DatabaseName -LibraryOnly
$LibraryOnly = $launcherLibraryOnly

function New-StudentSecret {
    $bytes = New-Object byte[] 32
    $rng = [Security.Cryptography.RandomNumberGenerator]::Create()
    try { $rng.GetBytes($bytes) } finally { $rng.Dispose() }
    return ([BitConverter]::ToString($bytes)).Replace('-', '').ToLowerInvariant()
}

function Read-StudentEnvironment([string]$Path) {
    $values = @{}
    if (Test-Path -LiteralPath $Path) {
        foreach ($line in [IO.File]::ReadAllLines($Path)) {
            if ($line -match '^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$') {
                $key = $Matches[1]; $value = $Matches[2].Trim()
                if ($values.ContainsKey($key)) { throw "Duplicate configuration key: $key. Ask your instructor to correct it." }
                if ($value.StartsWith('"') -and $value.EndsWith('"')) {
                    try { $value = ConvertFrom-Json $value } catch { throw "Unsupported quoted configuration for $key." }
                } elseif ($value.StartsWith("'") -and $value.EndsWith("'")) { $value = $value.Substring(1,$value.Length-2) }
                else { $value = ($value -split '\s+#',2)[0] }
                if ($value -match '[\r\n\x00]') { throw "Unsupported configuration value for $key." }
                $values[$key] = [string]$value
            } elseif ($line.Trim() -and !$line.TrimStart().StartsWith('#')) { throw 'Unsupported .env syntax. Ask your instructor to review the configuration.' }
        }
    }
    return $values
}

function Protect-StudentConfig([string]$Path) {
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent().User.Value
    $allowed=@($identity,'S-1-5-18','S-1-5-32-544')
    # icacls changes only the DACL, without requiring SeSecurityPrivilege for SACLs.
    & icacls $Path /inheritance:r /grant:r "*${identity}:(F)" '*S-1-5-18:(F)' '*S-1-5-32-544:(F)' | Out-Null
    if($LASTEXITCODE -ne 0){throw 'Could not protect local credentials.'}
    $acl = if($PSVersionTable.PSEdition -eq 'Core') {
        [IO.FileSystemAclExtensions]::GetAccessControl([IO.FileInfo]::new($Path))
    } else { [IO.File]::GetAccessControl($Path) }
    foreach($rule in @($acl.GetAccessRules($true,$true,[Security.Principal.SecurityIdentifier]))){
        $sid=$rule.IdentityReference.Value
        if($sid -notin $allowed){ & icacls $Path /remove "*$sid" | Out-Null; if($LASTEXITCODE -ne 0){throw 'Could not remove broad configuration access.'} }
    }
}

function Ensure-StudentEnvironment([string]$Root, [hashtable]$Defaults) {
    $path = Join-Path $Root 'apps/api/.env'
    $values = Read-StudentEnvironment $path
    $updates = @{}
    foreach ($key in $Defaults.Keys) {
        if (!$values.ContainsKey($key) -or [string]::IsNullOrWhiteSpace($values[$key])) { $updates[$key]=$Defaults[$key]; $values[$key]=$Defaults[$key] }
    }
    if($Defaults.ContainsKey('CASE_RUNTIME_ALLOWED_ORIGINS')){
        $origin=$Defaults['CASE_RUNTIME_ALLOWED_ORIGINS']
        $origins=@($values['CASE_RUNTIME_ALLOWED_ORIGINS'] -split ',' | ForEach-Object {$_.Trim()} | Where-Object {$_})
        if($origin -notin $origins){$values['CASE_RUNTIME_ALLOWED_ORIGINS']=(@($origins)+@($origin)) -join ',';$updates['CASE_RUNTIME_ALLOWED_ORIGINS']=$values['CASE_RUNTIME_ALLOWED_ORIGINS']}
    }
    # Administrative accounts are not needed in the running student API.
    foreach ($key in @('SQLSERVER_BOOTSTRAP_USER','SQLSERVER_BOOTSTRAP_PASSWORD')) {
        if ($values.ContainsKey($key)) { $values.Remove($key); $updates[$key]=$null }
    }
    if ($values['SQLSERVER_BOOTSTRAP_MODE'] -ne 'verify') { $values['SQLSERVER_BOOTSTRAP_MODE']='verify'; $updates['SQLSERVER_BOOTSTRAP_MODE']='verify' }
    if ($updates.Count -gt 0) {
        $lines = [Collections.Generic.List[string]]::new()
        if (Test-Path -LiteralPath $path) {
            foreach ($line in [IO.File]::ReadAllLines($path)) {
                if ($line -match '^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=' -and $updates.ContainsKey($Matches[1])) { continue }
                $lines.Add($line)
            }
        }
        foreach ($key in ($updates.Keys | Sort-Object)) {
            if ($null -ne $updates[$key]) { $encoded = ConvertTo-Json ([string]$updates[$key]) -Compress; $lines.Add("$key=$encoded") }
        }
        $temporary = "$path.$([guid]::NewGuid().ToString('N')).tmp"
        $replaced = "$temporary.previous"
        try {
            $empty=[IO.File]::Open($temporary,'CreateNew','Write','None');$empty.Dispose()
            Protect-StudentConfig $temporary
            [IO.File]::WriteAllLines($temporary,$lines,(New-Object Text.UTF8Encoding($false)))
            if (Test-Path -LiteralPath $path) { Protect-StudentConfig $path; [IO.File]::Replace($temporary,$path,$replaced) } else { [IO.File]::Move($temporary,$path) }
            Protect-StudentConfig $path
        } finally { foreach($localFile in @($temporary,$replaced)){ if (Test-Path -LiteralPath $localFile) { Remove-Item -LiteralPath $localFile -Force } } }
        Write-Host 'Local configuration updated; existing secrets and settings retained.'
    } elseif(Test-Path -LiteralPath $path) { Protect-StudentConfig $path }
    return $values
}

function Test-StudentRuntimeConnection([hashtable]$Settings) {
    $builder = New-Object System.Data.SqlClient.SqlConnectionStringBuilder
    $builder['Data Source'] = "$($Settings.SQLSERVER_HOST),$($Settings.SQLSERVER_PORT)"
    $builder['Initial Catalog']=$Settings.SQLSERVER_DATABASE; $builder['User ID']=$Settings.SQLSERVER_APP_USER
    $builder['Password']=$Settings.SQLSERVER_APP_PASSWORD; $builder['TrustServerCertificate']=$true; $builder['Connect Timeout']=5
    $connection=[System.Data.SqlClient.SqlConnection]::new($builder.ConnectionString)
    try {
        $connection.Open()
        Assert-StudentRuntimeShape $connection
        $bounded = Invoke-StudentSql $connection "SELECT CASE WHEN IS_ROLEMEMBER('sequel_repository')=1 AND IS_ROLEMEMBER('db_owner')=0 AND IS_SRVROLEMEMBER('sysadmin')=0 THEN 1 ELSE 0 END;" -Scalar
        return ($bounded -eq 1)
    } catch { return $false } finally { $connection.Dispose() }
}

function Ensure-StudentDependencies([string]$Root) {
    foreach ($name in @('node','npm.cmd')) { if (!(Get-Command $name -ErrorAction SilentlyContinue)) { throw 'Node.js and npm are required. Ask your instructor to prepare the machine.' } }
    # Reinstall when the shipped lockfile changes, not merely when a CLI is absent.
    $hash=[Security.Cryptography.SHA256]::Create()
    try{$signature=([BitConverter]::ToString($hash.ComputeHash([IO.File]::ReadAllBytes((Join-Path $Root 'package-lock.json'))))).Replace('-','')}
    finally{$hash.Dispose()}
    $signature += ':' + (& node --version)
    $stamp=Join-Path $Root 'node_modules/.sequel-detective-lock'
    if ((Test-Path (Join-Path $Root 'node_modules/.bin/tsx.cmd')) -and (Test-Path (Join-Path $Root 'node_modules/.bin/vite.cmd')) -and
        (Test-Path $stamp) -and [IO.File]::ReadAllText($stamp).Trim() -eq $signature) { return }
    Push-Location $Root
    try {
        Write-Host 'Installing application dependencies from the lockfile.'
        # npm's PowerShell shim reparses invocation text on some Node installations.
        # The native Windows shim preserves this fixed argument list on PS 5.1/7.
        & npm.cmd ci --include=dev --no-audit --no-fund
        if ($LASTEXITCODE -ne 0) { throw 'Dependency installation failed. Check connectivity and ask your instructor to retry setup.' }
        if(!(Test-Path (Join-Path $Root 'node_modules/tsx/dist/cli.mjs')) -or !(Test-Path (Join-Path $Root 'node_modules/vite/bin/vite.js'))){throw 'Installed application dependencies are incomplete. Ask your instructor to review the package.'}
        [IO.File]::WriteAllText($stamp,$signature,(New-Object Text.UTF8Encoding($false)))
    } finally { Pop-Location }
}

function Test-StudentPort([int]$Port) {
    $listener = [Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback,$Port)
    try { $listener.Start(); return $true } catch { return $false } finally { $listener.Stop() }
}

function Get-StudentLaunchLockPath([string]$Root) {
    $hash=[Security.Cryptography.SHA256]::Create()
    try{$key=([BitConverter]::ToString($hash.ComputeHash([Text.Encoding]::UTF8.GetBytes([IO.Path]::GetFullPath($Root).ToLowerInvariant())))).Replace('-','')}
    finally{$hash.Dispose()}
    return Join-Path ([IO.Path]::GetTempPath()) ("SequelDetectiveLaunch_$key.lock")
}

function Wait-StudentReadiness([string]$ApiUrl,[string]$WebUrl,[int]$Timeout,$ApiProcess,$WebProcess) {
    $watch=[Diagnostics.Stopwatch]::StartNew()
    while ($watch.Elapsed.TotalSeconds -lt $Timeout) {
        if ($ApiProcess.HasExited -or $WebProcess.HasExited) { throw 'An application process stopped before readiness. Ask your instructor to review the local logs.' }
        try {
            $health=Invoke-RestMethod "$ApiUrl/api/health/full" -TimeoutSec 2
            $web=Invoke-WebRequest $WebUrl -UseBasicParsing -TimeoutSec 2
            if ($health.data.database.isConnected -and $health.data.bootstrap.status -eq 'ready' -and $web.StatusCode -eq 200) {
                # Session/catalogue reachability catches missing secret/origin and route setup.
                $session=Invoke-RestMethod "$ApiUrl/api/session" -Headers @{ Origin=$WebUrl } -TimeoutSec 2
                $cases=Invoke-RestMethod "$ApiUrl/api/cases" -TimeoutSec 2
                if ($session.csrfToken -and @($cases.cases | Where-Object { $_.caseId -eq 'case-001' }).Count -eq 1) { return }
            }
        } catch {}
        Start-Sleep -Milliseconds 500
    }
    throw 'Application readiness timed out. No browser was opened. Ask your instructor to review setup and local logs.'
}

function Stop-StudentOwnedProcess($Process) {
    if (!$Process -or $Process.HasExited) { return }
    # Enumerate descendants only from our retained PID, never by executable name.
    $children=@(Get-CimInstance Win32_Process -Filter "ParentProcessId=$($Process.Id)" -ErrorAction SilentlyContinue)
    foreach ($child in $children) {
        $current=Get-Process -Id $child.ProcessId -ErrorAction SilentlyContinue
        if ($current) { Stop-StudentOwnedProcess $current }
    }
    $Process.Refresh()
    if (!$Process.HasExited) { Stop-Process -Id $Process.Id -Force -ErrorAction SilentlyContinue }
}

function Invoke-StudentLaunch([string]$Root) {
    if ($ResetEnvironment) { throw 'ResetEnvironment is retired to preserve saved ownership and credentials. Ask your instructor to review configuration without resetting progress.' }
    if ($PromptForDatabaseSettings) { throw 'Manual setup prompts are retired. Instructors configure supported local settings once; students launch the CMD file.' }
    if ($ApiPort -lt 1 -or $ApiPort -gt 65535 -or $WebPort -lt 1 -or $WebPort -gt 65535 -or $ApiPort -eq $WebPort -or $StartupTimeoutSeconds -lt 1) { throw 'Invalid local service ports or startup timeout.' }
    $lockPath=Get-StudentLaunchLockPath $Root
    $lock=$null; $apiProcess=$null; $webProcess=$null
    try {
        try { $lock=[IO.File]::Open($lockPath,'OpenOrCreate','ReadWrite','None') } catch { throw 'Another launcher is active for this installation. Use its app or close it before relaunching.' }
        $existing=Read-StudentEnvironment (Join-Path $Root 'apps/api/.env')
        $target = if ($existing.SQLSERVER_DATABASE) { $existing.SQLSERVER_DATABASE } else { $DatabaseName }
        $hostName = if ($existing.SQLSERVER_HOST) { $existing.SQLSERVER_HOST } else { $SqlHost }
        $port = if ($existing.SQLSERVER_PORT) { [int]$existing.SQLSERVER_PORT } else { $SqlPort }
        Assert-StudentSqlTarget $hostName $port $target
        if ($existing.PORT) { $script:ApiPort=[int]$existing.PORT }
        if ($ApiPort -lt 1 -or $ApiPort -gt 65535 -or $ApiPort -eq $WebPort) { throw 'Invalid configured application port.' }
        if ($existing.HOST -and $existing.HOST -notin @('127.0.0.1','localhost')) { throw 'Student application must listen on loopback. Ask your instructor to review HOST.' }
        if (!$SetupOnly -and (!(Test-StudentPort $ApiPort) -or !(Test-StudentPort $WebPort))) { throw 'An application port is already in use. Close the prior launcher or ask your instructor; unrelated processes were not stopped.' }
        Ensure-StudentDependencies $Root
        $suffix=[guid]::NewGuid().ToString('N').Substring(0,12)
        $defaults=@{
            SQLSERVER_HOST=$hostName; SQLSERVER_PORT=[string]$port; SQLSERVER_DATABASE=$target
            SQLSERVER_USER=$(if($SqlUser){$SqlUser}else{"sc_learner_$suffix"})
            SQLSERVER_PASSWORD=$(if($SqlPassword){$SqlPassword}else{'Sc!'+(New-StudentSecret)})
            SQLSERVER_APP_USER="sc_repository_$suffix"; SQLSERVER_APP_PASSWORD=('Sc!'+(New-StudentSecret))
            SQLSERVER_TRUST_SERVER_CERTIFICATE='true'; SQLSERVER_BOOTSTRAP_MODE='verify'
            CASE_RUNTIME_SESSION_SECRET=(New-StudentSecret); CASE_RUNTIME_ALLOWED_ORIGINS="http://127.0.0.1:$WebPort"
            HOST='127.0.0.1'; PORT=[string]$ApiPort
        }
        $settings=Ensure-StudentEnvironment $Root $defaults
        if (!(Test-StudentRuntimeConnection $settings)) {
            $null=Install-StudentDatabase $hostName $port $target $Root
            & (Join-Path $Root 'scripts/student-package/setup-local-sql-accounts.ps1') -SqlHost $hostName -SqlPort $port -DatabaseName $target -RuntimeLogin $settings.SQLSERVER_USER -RuntimePassword $settings.SQLSERVER_PASSWORD -RepositoryLogin $settings.SQLSERVER_APP_USER -RepositoryPassword $settings.SQLSERVER_APP_PASSWORD -SkipBootstrapAccount
            if (!(Test-StudentRuntimeConnection $settings)) { throw 'Runtime login or schema verification failed. Existing login passwords were not changed; ask your instructor to reconcile configuration.' }
        }
        if ($SetupOnly) { Write-Host 'Student setup completed.'; return }
        $principal=[Security.Principal.WindowsPrincipal]::new([Security.Principal.WindowsIdentity]::GetCurrent())
        if($principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)){throw 'Setup is complete. Close the elevated window and launch normally; application services must not run as Windows administrator.'}
        $node=(Get-Command node).Source
        $apiCli=Join-Path $Root 'node_modules/tsx/dist/cli.mjs'
        $webCli=Join-Path $Root 'node_modules/vite/bin/vite.js'
        $logRoot=Join-Path ([IO.Path]::GetTempPath()) ('SequelDetective-' + [guid]::NewGuid().ToString('N'))
        New-Item -ItemType Directory -Path $logRoot | Out-Null
        # Launch bounded runtimes without inherited administrative/bootstrap secrets.
        $names=@($settings.Keys) + @('VITE_API_BASE_URL','SQLSERVER_BOOTSTRAP_USER','SQLSERVER_BOOTSTRAP_PASSWORD')
        $names=@($names | Select-Object -Unique)
        $prior=@{}; foreach($key in $names){ $prior[$key]=[Environment]::GetEnvironmentVariable($key,'Process') }
        try {
            foreach($key in $settings.Keys){ [Environment]::SetEnvironmentVariable($key,$settings[$key],'Process') }
            $env:HOST='127.0.0.1'; $env:PORT=[string]$ApiPort
            $env:VITE_API_BASE_URL="http://127.0.0.1:$ApiPort"
            $env:SQLSERVER_BOOTSTRAP_USER=$null; $env:SQLSERVER_BOOTSTRAP_PASSWORD=$null
            $apiProcess=Start-Process -FilePath $node -ArgumentList @(('"'+$apiCli+'"'),'src/server.ts') -WorkingDirectory (Join-Path $Root 'apps/api') -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $logRoot 'api.log') -RedirectStandardError (Join-Path $logRoot 'api-error.log')
            $webProcess=Start-Process -FilePath $node -ArgumentList @(('"'+$webCli+'"'),'--host','127.0.0.1','--port',[string]$WebPort,'--strictPort') -WorkingDirectory (Join-Path $Root 'apps/web') -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $logRoot 'web.log') -RedirectStandardError (Join-Path $logRoot 'web-error.log')
        } finally { foreach($key in $names){ [Environment]::SetEnvironmentVariable($key,$prior[$key],'Process') } }
        Write-Host "Waiting for the application. Local logs: $logRoot"
        $webUrl="http://127.0.0.1:$WebPort"
        Wait-StudentReadiness "http://127.0.0.1:$ApiPort" $webUrl $StartupTimeoutSeconds $apiProcess $webProcess
        Write-Host "Ready: $webUrl. Leave this window open while using the app."
        if (!$NoBrowser) { Start-Process $webUrl }
        while (!$apiProcess.HasExited -and !$webProcess.HasExited) { Start-Sleep -Seconds 1 }
        throw 'An application service stopped. Relaunch after reviewing the local logs.'
    } finally {
        Stop-StudentOwnedProcess $webProcess; Stop-StudentOwnedProcess $apiProcess
        if($lock){$lock.Dispose()}
    }
}

if (!$LibraryOnly) { Invoke-StudentLaunch $projectRoot }
