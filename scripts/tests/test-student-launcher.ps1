param([switch]$SqlIntegration,[string]$SqlHost='localhost',[int]$SqlPort=1433,[switch]$PackageLaunch,[switch]$ConnectionProbeOnly)
$ErrorActionPreference='Stop'
. (Join-Path $PSScriptRoot 'single-test-database.ps1')
if(($SqlIntegration -or $ConnectionProbeOnly -or $PackageLaunch) -and $env:SEQUEL_CITY_SINGLE_TEST_SESSION -ne 'active'){
 if($SqlHost -notin @('localhost','127.0.0.1','.') -or $SqlPort -ne 1433){throw 'Tests require the registered local SQL workspace.'}
 & (Join-Path $PSScriptRoot 'invoke-single-database-test.ps1') -Task Launcher -PackageLaunch:$PackageLaunch -ConnectionProbeOnly:$ConnectionProbeOnly
 return
}
$repoRoot=Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$fixture=Join-Path ([IO.Path]::GetTempPath()) ('sequel-launcher-test-'+[guid]::NewGuid().ToString('N'))
. (Join-Path $repoRoot 'scripts/student-package/start-student-package.ps1') -SqlHost $SqlHost -SqlPort $SqlPort -LibraryOnly

function Set-LauncherFixtureOwner([string]$Name){
    if($Name -notmatch '^SequelCityRuntimeTest_[A-Za-z0-9_]+$'){throw 'Refusing a non-disposable fixture owner change.'}
    $owner=Invoke-StudentSql $master 'SELECT QUOTENAME(SUSER_SNAME(0x01));' -Scalar
    if(!$owner){throw 'Built-in SQL fixture owner unavailable.'}
    Invoke-StudentSql $master "ALTER AUTHORIZATION ON DATABASE::[$Name] TO $owner;"
}
function Assert-Launcher([bool]$Condition,[string]$Message){if(!$Condition){throw $Message}}
function Expect-LauncherFailure([scriptblock]$Action,[string]$Pattern){
    $failed=$false
    try { & $Action } catch { if($_.Exception.Message -notmatch $Pattern){throw};$failed=$true }
    Assert-Launcher $failed "Expected failure: $Pattern"
}
function Read-LauncherLog([string]$Path){
    if(!(Test-Path -LiteralPath $Path)){return ''}
    $stream=[IO.File]::Open($Path,'Open','Read',([IO.FileShare]::ReadWrite -bor [IO.FileShare]::Delete))
    $reader=[IO.StreamReader]::new($stream)
    try{return $reader.ReadToEnd()}finally{$reader.Dispose()}
}

$databases=@(); $logins=@(); $master=$null; $launched=$null
try {
    New-Item -ItemType Directory -Path (Join-Path $fixture 'apps/api') -Force | Out-Null
    $defaults=@{SQLSERVER_USER='fixture_learner';SQLSERVER_PASSWORD=(New-StudentSecret);SQLSERVER_APP_USER='fixture_repo';SQLSERVER_APP_PASSWORD=(New-StudentSecret);CASE_RUNTIME_SESSION_SECRET=(New-StudentSecret);SQLSERVER_BOOTSTRAP_MODE='verify'}
    $envPath=Join-Path $fixture 'apps/api/.env'
    [IO.File]::WriteAllText($envPath,"# existing note`r`nCUSTOM_SETTING=keep`r`nSQLSERVER_BOOTSTRAP_MODE=apply`r`nSQLSERVER_BOOTSTRAP_USER=old_admin`r`nSQLSERVER_BOOTSTRAP_PASSWORD=old_secret`r`n")
    $first=Ensure-StudentEnvironment $fixture $defaults
    $second=Ensure-StudentEnvironment $fixture @{SQLSERVER_PASSWORD=(New-StudentSecret);CASE_RUNTIME_SESSION_SECRET=(New-StudentSecret)}
    Assert-Launcher ($first.SQLSERVER_PASSWORD -eq $second.SQLSERVER_PASSWORD -and $first.CASE_RUNTIME_SESSION_SECRET -eq $second.CASE_RUNTIME_SESSION_SECRET) 'Repeat launch rotated credentials.'
    Assert-Launcher ($second.CUSTOM_SETTING -eq 'keep' -and $second.SQLSERVER_BOOTSTRAP_MODE -eq 'verify' -and !$second.ContainsKey('SQLSERVER_BOOTSTRAP_PASSWORD')) 'Config preservation/admin secret removal failed.'
    Assert-Launcher ([IO.File]::ReadAllText($envPath).Contains('# existing note')) 'Configuration comment lost.'
    $origins=Ensure-StudentEnvironment $fixture @{CASE_RUNTIME_ALLOWED_ORIGINS='http://127.0.0.1:5173'}
    $changedOrigins=Ensure-StudentEnvironment $fixture @{CASE_RUNTIME_ALLOWED_ORIGINS='http://127.0.0.1:5174'}
    Assert-Launcher ($changedOrigins.CASE_RUNTIME_ALLOWED_ORIGINS -eq 'http://127.0.0.1:5173,http://127.0.0.1:5174' -and $changedOrigins.CASE_RUNTIME_SESSION_SECRET -eq $first.CASE_RUNTIME_SESSION_SECRET) 'Origin configuration update rotated secrets or removed the previous origin.'
    Assert-Launcher ((Get-Acl $envPath).AreAccessRulesProtected) 'Local secret file inherits permissions.'
    Assert-Launcher ((New-StudentSecret) -match '^[a-f0-9]{64}$') 'Unexpected secret format.'
    [IO.File]::WriteAllText($envPath,"SQLSERVER_USER=a`r`nSQLSERVER_USER=b")
    Expect-LauncherFailure {Read-StudentEnvironment $envPath} 'Duplicate'
    foreach($target in @('master','msdb','bad-name')){Expect-LauncherFailure {Assert-StudentSqlTarget localhost 1433 $target} 'System databases|Unsupported'}
    Expect-LauncherFailure {Assert-StudentSqlTarget remote.example 1433 good} 'local SQL'
    $badSql=Join-Path $fixture 'bad.sql'
    [IO.File]::WriteAllText($badSql,"-- BEGIN STUDENT RUNTIME INSTALL`r`nDROP DATABASE example;`r`n-- END STUDENT RUNTIME INSTALL")
    Expect-LauncherFailure {Get-StudentSqlSection $badSql RUNTIME} 'forbidden'
    [IO.File]::WriteAllText($badSql,"-- BEGIN STUDENT RUNTIME INSTALL`r`nEXEC(N'DROP DATABASE example;');`r`n-- END STUDENT RUNTIME INSTALL")
    Expect-LauncherFailure {Get-StudentSqlSection $badSql RUNTIME} 'forbidden'
    [IO.File]::WriteAllText($badSql,"-- BEGIN STUDENT RUNTIME INSTALL`r`nDROP TABLE dbo.CrimeType;`r`n-- END STUDENT RUNTIME INSTALL")
    Expect-LauncherFailure {Get-StudentSqlSection $badSql RUNTIME} 'additive'
    [IO.File]::WriteAllText($badSql,"-- BEGIN STUDENT RUNTIME INSTALL`r`nINSERT dbo.InterviewLog(PersonID) VALUES(1);`r`n-- END STUDENT RUNTIME INSTALL")
    Expect-LauncherFailure {Get-StudentSqlSection $badSql RUNTIME} 'cannot mutate'
    [IO.File]::WriteAllText($badSql,'-- BEGIN STUDENT RUNTIME INSTALL')
    Expect-LauncherFailure {Get-StudentSqlSection $badSql RUNTIME} 'boundaries'
    $listener=[Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback,0);$listener.Start()
    try {Assert-Launcher (!(Test-StudentPort $listener.LocalEndpoint.Port)) 'Occupied port was accepted.'} finally {$listener.Stop()}
    $lockPath=Get-StudentLaunchLockPath $fixture
    $held=[IO.File]::Open($lockPath,'OpenOrCreate','ReadWrite','None')
    try {Expect-LauncherFailure {Invoke-StudentLaunch $fixture} 'Another launcher'} finally {$held.Dispose()}
    $script:ResetEnvironment=$true
    Expect-LauncherFailure {Invoke-StudentLaunch $fixture} 'retired'
    $script:ResetEnvironment=$false
    # Dependency/health failures are tested without invoking npm or the network.
    $originalDependency=${function:Ensure-StudentDependencies}
    function Ensure-StudentDependencies {throw 'Dependency fixture failure'}
    $script:SetupOnly=$true
    [IO.File]::WriteAllText($envPath,'CUSTOM_SETTING=keep')
    Expect-LauncherFailure {Invoke-StudentLaunch $fixture} 'Dependency fixture'
    Set-Item Function:Ensure-StudentDependencies $originalDependency
    $script:SetupOnly=$false
    $originalRest=${function:Invoke-RestMethod};$originalWeb=${function:Invoke-WebRequest}
    function Invoke-RestMethod {return @{data=@{database=@{isConnected=$true};bootstrap=@{status='degraded'}}}}
    function Invoke-WebRequest {return @{StatusCode=200}}
    try {Expect-LauncherFailure {Wait-StudentReadiness 'http://127.0.0.1:1' 'http://127.0.0.1:2' 1 @{HasExited=$false} @{HasExited=$false}} 'timed out'}
    finally {Remove-Item Function:Invoke-RestMethod;Remove-Item Function:Invoke-WebRequest;if($originalRest){Set-Item Function:Invoke-RestMethod $originalRest};if($originalWeb){Set-Item Function:Invoke-WebRequest $originalWeb}}
    # Catalog-only owner helpers must work for renamed/disabled SQL owners without Windows resolution.
    $originalSql=${function:Invoke-StudentSql}
    try {
        function Invoke-StudentSql($Connection,$Sql,$Transaction,[switch]$Scalar,[hashtable]$Parameters){
            if($Sql -match 'SUSER_SNAME|SUSER_SID|xp_logininfo'){throw 'Windows identity resolution is forbidden in owner inspection.'}
            if($Sql -match 'sid=0x01'){return '[renamed_local_sql_owner]'}
            return 'U'
        }
        Assert-Launcher ((Get-StudentStableSqlOwner $null) -eq '[renamed_local_sql_owner]') 'Renamed SQL owner was not discovered by SID.'
        Assert-Launcher ((Get-StudentDatabaseOwnerType $null 'Fixture') -eq 'U') 'Windows principal type was not catalog-inspected.'
        function Invoke-StudentSql {return $null}
        Expect-LauncherFailure {Get-StudentStableSqlOwner $null} 'stable local SQL owner is unavailable'
        Expect-LauncherFailure {Get-StudentDatabaseOwnerType $null 'Fixture'} 'cannot be classified'
        Set-Item Function:Invoke-StudentSql $originalSql
        $fakeCommand=[pscustomobject]@{CommandTimeout=0;CommandText=''}
        $fakeCommand|Add-Member ScriptMethod ExecuteScalar {throw "Windows NT group/user 'unreachable fixture'"}
        $fakeCommand|Add-Member ScriptMethod Dispose {}
        $fakeConnection=[pscustomobject]@{Command=$fakeCommand}
        $fakeConnection|Add-Member ScriptMethod CreateCommand {return $this.Command}
        Expect-LauncherFailure {Invoke-StudentSql $fakeConnection 'SELECT 1' -Scalar} 'ownership verification needs local SQL administrator'

    } finally {Set-Item Function:Invoke-StudentSql $originalSql}
    Write-Host 'PASS: launcher/configuration/safety fixtures.'

    if ($SqlIntegration -or $ConnectionProbeOnly) {
        Assert-StudentSqlTarget $SqlHost $SqlPort 'SequelCityRuntimeTest_Workspace'
        $master=[Data.SqlClient.SqlConnection]::new("Server=$SqlHost,$SqlPort;Database=master;Integrated Security=True;TrustServerCertificate=True;Pooling=False;");$master.Open()
        $suffix=[guid]::NewGuid().ToString('N')
        $freshName='SequelCityRuntimeTest_Workspace';$legacyName=$freshName;$unknownName=$freshName
        # Each scenario replaces this same leased database; no concurrent fixture copies.
        Reset-SingleTestFixture $master -LeaveAbsent
        $installation=Install-StudentDatabase $SqlHost $SqlPort $freshName $repoRoot
        $databases += $freshName
        Assert-Launcher ($installation.Mode -eq 'fresh') 'Fresh setup did not run.'
        # Probe missing accounts before creation, then connect in this same process.
        $master.ChangeDatabase($freshName)
        $probeSuffix=[guid]::NewGuid().ToString('N').Substring(0,12)
        $probeSettings=@{SQLSERVER_HOST=$SqlHost;SQLSERVER_PORT=[string]$SqlPort;SQLSERVER_DATABASE=$freshName;SQLSERVER_APP_USER="sc_repository_$probeSuffix";SQLSERVER_APP_PASSWORD=('Sc!'+(New-StudentSecret));SQLSERVER_USER="sc_learner_$probeSuffix";SQLSERVER_PASSWORD=('Sc!'+(New-StudentSecret))}
        Assert-Launcher (!(Test-StudentRuntimeConnection $probeSettings)) 'Missing accounts unexpectedly ready.'
        foreach($probeAccount in @(@{user=$probeSettings.SQLSERVER_APP_USER;password=$probeSettings.SQLSERVER_APP_PASSWORD;role='sequel_repository'},@{user=$probeSettings.SQLSERVER_USER;password=$probeSettings.SQLSERVER_PASSWORD;role='sequel_learner'})){
            Assert-Launcher ((Invoke-StudentSql $master 'SELECT COUNT(*) FROM sys.sql_logins WHERE name=@name;' -Scalar -Parameters @{'@name'=$probeAccount.user}) -eq 0) 'Fixture login name already exists.'
            Invoke-StudentSql $master "CREATE LOGIN [$($probeAccount.user)] WITH PASSWORD=N'$($probeAccount.password)';"
            $logins += $probeAccount.user
            Invoke-StudentSql $master "CREATE USER [$($probeAccount.user)] FOR LOGIN [$($probeAccount.user)]; ALTER ROLE $($probeAccount.role) ADD MEMBER [$($probeAccount.user)];"
        }
        Assert-Launcher (Test-StudentRuntimeConnection $probeSettings) 'First-invocation bounded readiness failed after provisioning.'
        foreach($probePasswordKey in @('SQLSERVER_PASSWORD','SQLSERVER_APP_PASSWORD')){
            $wrongSettings=$probeSettings.Clone();$wrongSettings[$probePasswordKey]='Sc!'+(New-StudentSecret)
            Assert-Launcher (!(Test-StudentRuntimeConnection $wrongSettings)) 'Wrong account password was accepted.'
            Assert-Launcher (Test-StudentRuntimeConnection $probeSettings) 'Wrong-password probe poisoned subsequent readiness.'
        }
        Invoke-StudentSql $master "DENY SELECT ON dbo.CrimeType TO [$($probeSettings.SQLSERVER_USER)];"
        try{Assert-Launcher (!(Test-StudentRuntimeConnection $probeSettings)) 'Learner without evidence permission was accepted.'}
        finally{Invoke-StudentSql $master "REVOKE SELECT ON dbo.CrimeType TO [$($probeSettings.SQLSERVER_USER)];"}
        Invoke-StudentSql $master "ALTER ROLE sequel_repository DROP MEMBER [$($probeSettings.SQLSERVER_APP_USER)];"
        try{Assert-Launcher (!(Test-StudentRuntimeConnection $probeSettings)) 'Repository without bounded role was accepted.'}
        finally{Invoke-StudentSql $master "ALTER ROLE sequel_repository ADD MEMBER [$($probeSettings.SQLSERVER_APP_USER)];"}
        Assert-Launcher (Test-StudentRuntimeConnection $probeSettings) 'Restored bounded permissions not ready.'
        $sameAccount=$probeSettings.Clone();$sameAccount.SQLSERVER_USER=$sameAccount.SQLSERVER_APP_USER
        Assert-Launcher (!(Test-StudentRuntimeConnection $sameAccount)) 'Shared learner/repository identity was accepted.'
        Invoke-StudentSql $master 'DISABLE TRIGGER app.ProtectReleasedStep ON app.CaseStep;'
        try{Assert-Launcher (!(Test-StudentRuntimeConnection $probeSettings)) 'Corrupt runtime schema was accepted.'}
        finally{Invoke-StudentSql $master 'ENABLE TRIGGER app.ProtectReleasedStep ON app.CaseStep;'}
        Assert-Launcher (Test-StudentRuntimeConnection $probeSettings) 'Restored schema not ready.'
        Write-Host 'PASS: one-invocation new-login readiness, both passwords, and actual SQL permission-denial checks.'
        if($ConnectionProbeOnly){return}
        $master.ChangeDatabase($freshName)
        Invoke-StudentSql $master @'
INSERT app.LocalLearner(OwnerId,CapabilityHash) VALUES ('11111111-1111-4111-8111-111111111111',HASHBYTES('SHA2_256','fixture'));
INSERT app.LearnerAttempt(AttemptId,OwnerId,CaseId,ContentVersion,EvidenceVersion,Status) VALUES ('22222222-2222-4222-8222-222222222222','11111111-1111-4111-8111-111111111111','case-001',1,'sequel-evidence-v1','active');
INSERT app.AttemptWorkspace(AttemptId,WorkspaceJson) VALUES ('22222222-2222-4222-8222-222222222222',N'{"draftSql":"SELECT * FROM CrimeType;","notes":["retain me"],"selectedView":"workbench"}');
'@
        $again=Install-StudentDatabase $SqlHost $SqlPort $freshName $repoRoot
        Assert-Launcher ($again.Mode -eq 'current') 'Repeat database setup was not verification only.'
        Assert-Launcher ((Invoke-StudentSql $master "SELECT COUNT(*) FROM app.AttemptWorkspace WHERE WorkspaceJson LIKE '%retain me%';" -Scalar) -eq 1) 'Saved workspace was lost.'
        $windowsOwner=Invoke-StudentSql $master "SELECT QUOTENAME(name) FROM master.sys.server_principals WHERE sid=SUSER_SID() AND type='U';" -Scalar
        Assert-Launcher (![string]::IsNullOrWhiteSpace($windowsOwner)) 'SQL integration requires its already-registered Windows setup login for ownership coverage.'
        $beforeRepair=Invoke-StudentSql $master "SELECT CONVERT(varchar(64),HASHBYTES('SHA2_256',(SELECT WorkspaceJson FROM app.AttemptWorkspace ORDER BY AttemptId FOR JSON PATH)),2);" -Scalar
        $evidenceBefore=Invoke-StudentSql $master 'SELECT CHECKSUM_AGG(BINARY_CHECKSUM(*)) FROM dbo.CrimeSceneReport;' -Scalar
        Invoke-StudentSql $master "ALTER AUTHORIZATION ON DATABASE::[$freshName] TO $windowsOwner;"
        Assert-Launcher ((Get-StudentDatabaseOwnerType $master $freshName) -eq 'U') 'Unsafe existing-owner fixture was not established.'
        # Backup failure must prevent ALTER AUTHORIZATION.
        $originalBackup=${function:Backup-StudentDatabase}
        try {
            function Backup-StudentDatabase {throw 'WP309 backup failure fixture'}
            Expect-LauncherFailure {Install-StudentDatabase $SqlHost $SqlPort $freshName $repoRoot} 'backup failure fixture'
            Assert-Launcher ((Get-StudentDatabaseOwnerType $master $freshName) -eq 'U') 'Failed backup changed owner.'
        } finally {Set-Item Function:Backup-StudentDatabase $originalBackup}
        $originalInvokeSql=${function:Invoke-StudentSql}
        try {
            function Invoke-StudentSql($Connection,$Sql,$Transaction,[switch]$Scalar,[hashtable]$Parameters=@{}){
                if($Sql -match '^ALTER AUTHORIZATION'){throw 'WP309 setup permission fixture'}
                & $originalInvokeSql $Connection $Sql $Transaction -Scalar:$Scalar -Parameters $Parameters
            }
            Expect-LauncherFailure {Install-StudentDatabase $SqlHost $SqlPort $freshName $repoRoot} 'setup permission fixture'
            Assert-Launcher ((Get-StudentDatabaseOwnerType $master $freshName) -eq 'U') 'Refused owner change altered ownership.'
        } finally {Set-Item Function:Invoke-StudentSql $originalInvokeSql}
        # Validation after the ownership change must roll the owner back with the transaction.
        $originalShape=${function:Assert-StudentRuntimeShape}
        try {
            function Assert-StudentRuntimeShape($Connection,$Transaction,[switch]$AllowV1,[switch]$AllowLegacyCity,[switch]$MetadataOnly){
                if(!$MetadataOnly){throw 'WP309 post-repair validation failure'}
                & $originalShape $Connection $Transaction -AllowV1:$AllowV1 -AllowLegacyCity:$AllowLegacyCity -MetadataOnly
            }
            Expect-LauncherFailure {Install-StudentDatabase $SqlHost $SqlPort $freshName $repoRoot} 'post-repair validation failure'
            Assert-Launcher ((Get-StudentDatabaseOwnerType $master $freshName) -eq 'U') 'Failed validation did not roll ownership back.'
        } finally {Set-Item Function:Assert-StudentRuntimeShape $originalShape}
        $repair=Install-StudentDatabase $SqlHost $SqlPort $freshName $repoRoot
        Assert-Launcher ($repair.OwnershipRepaired -and $repair.BackupPath -and $repair.Mode -eq 'current') 'Existing owner repair did not retain a backup and verify current data.'
        Assert-Launcher ((Get-StudentDatabaseOwnerType $master $freshName) -eq 'S') 'Ownership did not become SQL-local.'
        Assert-Launcher ((Invoke-StudentSql $master "SELECT CONVERT(varchar(64),HASHBYTES('SHA2_256',(SELECT WorkspaceJson FROM app.AttemptWorkspace ORDER BY AttemptId FOR JSON PATH)),2);" -Scalar) -eq $beforeRepair) 'Ownership repair changed saved work.'
        Assert-Launcher ((Invoke-StudentSql $master 'SELECT CHECKSUM_AGG(BINARY_CHECKSUM(*)) FROM dbo.CrimeSceneReport;' -Scalar) -eq $evidenceBefore) 'Ownership repair changed evidence.'
        Assert-Launcher (Test-StudentRuntimeConnection $probeSettings) 'Restricted SQL accounts failed after ownership repair.'
        $repeatRepair=Install-StudentDatabase $SqlHost $SqlPort $freshName $repoRoot
        Assert-Launcher (!$repeatRepair.OwnershipRepaired -and !$repeatRepair.BackupPath) 'Repeat launch changed owner or made an unnecessary backup.'
        Write-Host 'PASS: account-neutral existing-owner repair, backup refusal, transactional rollback, preservation and bounded SQL readiness.'
        $master.ChangeDatabase('master')
        $heldLock=Invoke-StudentSql $master "DECLARE @result int; EXEC @result=sys.sp_getapplock @Resource=@name,@LockMode='Exclusive',@LockOwner='Session',@LockTimeout=0; SELECT @result;" -Scalar -Parameters @{'@name'="SequelDetectiveInstall:$($freshName.ToLowerInvariant())"}
        Assert-Launcher ($heldLock -ge 0) 'Fixture could not claim setup lock.'
        try{
            Expect-LauncherFailure {Install-StudentDatabase $SqlHost $SqlPort $freshName $repoRoot} 'Another database setup'
            Expect-LauncherFailure {Install-StudentDatabase $SqlHost $SqlPort $freshName.ToUpperInvariant() $repoRoot} 'Another database setup'
        }
        finally{Invoke-StudentSql $master "EXEC sys.sp_releaseapplock @Resource=@name,@LockOwner='Session';" -Parameters @{'@name'="SequelDetectiveInstall:$($freshName.ToLowerInvariant())"}}
        # Replace the same database with a compatible legacy fixture.
        Reset-SingleTestFixture $master
        $master.ChangeDatabase($legacyName)
        foreach($file in @('01-SequelCityCrimesDB - Create DB.sql','02-SequelCityCrimesDB - Insert Data.sql','03-SequelCityCrimesDB - ForeignKeys.sql')) {
            $section=Get-StudentSqlSection (Join-Path $repoRoot "database/$file") FRESH
            $section=[regex]::Replace($section,'(?s)-- BEGIN WP-300 COMPLETE EVIDENCE.*?-- END WP-300 COMPLETE EVIDENCE','')
            if($file.StartsWith('02-')){$section += [Environment]::NewLine+[IO.File]::ReadAllText((Join-Path $repoRoot 'apps/api/src/services/fixtures/case001-legacy-evidence.sql'))}
            $section=[regex]::Replace($section,'(?s)-- BEGIN STUDENT RUNTIME INSTALL.*?-- END STUDENT RUNTIME INSTALL','')
            foreach($batch in [regex]::Split($section,'(?im)^[\t ]*GO[\t ]*(?:--[^\r\n]*)?\r?$')){if($batch.Trim()){Invoke-StudentSql $master $batch}}
        }
        $before=Invoke-StudentSql $master 'SELECT COUNT(*) FROM dbo.InterviewLog;' -Scalar
        $beforeChecksum=Invoke-StudentSql $master 'SELECT CHECKSUM_AGG(BINARY_CHECKSUM(*)) FROM dbo.InterviewLog;' -Scalar
        # Inject a final-batch failure to prove all earlier runtime DDL/data rolls back.
        $originalSection=${function:Get-StudentSqlSection}
        function Get-StudentSqlSection([string]$Path,[string]$Kind){
            $section=& $originalSection $Path $Kind
            if($Kind -eq 'RUNTIME' -and [IO.Path]::GetFileName($Path) -eq '03-SequelCityCrimesDB - ForeignKeys.sql'){$section += "`r`nGO`r`nTHROW 51025,'installation interruption fixture',1;`r`n"}
            return $section
        }
        try{Expect-LauncherFailure {Install-StudentDatabase $SqlHost $SqlPort $legacyName $repoRoot} 'installation interruption fixture'}
        finally{Set-Item Function:Get-StudentSqlSection $originalSection}
        Assert-Launcher ((Invoke-StudentSql $master "SELECT COUNT(*) FROM sys.schemas WHERE name='app';" -Scalar) -eq 0) 'Failed installation retained partial runtime schema.'
        $upgrade=Install-StudentDatabase $SqlHost $SqlPort $legacyName $repoRoot
        Assert-Launcher ($upgrade.Mode -eq 'legacy' -and $upgrade.BackupPath.EndsWith('.bak')) 'Legacy backup/upgrade missing.'
        Assert-Launcher ((Invoke-StudentSql $master 'SELECT COUNT(*) FROM dbo.InterviewLog;' -Scalar) -eq $before) 'Public data changed during upgrade.'
        Assert-Launcher ((Invoke-StudentSql $master 'SELECT CHECKSUM_AGG(BINARY_CHECKSUM(*)) FROM dbo.InterviewLog;' -Scalar) -eq $beforeChecksum) 'Public interview values changed during upgrade.'
        $null=Install-StudentDatabase $SqlHost $SqlPort $legacyName $repoRoot
        # Reconstruct the previously shipped v1 schema from the same source by
        # excluding only the new additive extension. This fixture owns its target.
        $v1Name=$freshName
        Reset-SingleTestFixture $master
        $master.ChangeDatabase($v1Name)
        foreach($file in @('01-SequelCityCrimesDB - Create DB.sql','02-SequelCityCrimesDB - Insert Data.sql','03-SequelCityCrimesDB - ForeignKeys.sql')) {
            $section=Get-StudentSqlSection (Join-Path $repoRoot "database/$file") FRESH
            $section=[regex]::Replace($section,'(?s)-- BEGIN WP-300 COMPLETE EVIDENCE.*?-- END WP-300 COMPLETE EVIDENCE','')
            if($file.StartsWith('02-')){$section += [Environment]::NewLine+[IO.File]::ReadAllText((Join-Path $repoRoot 'apps/api/src/services/fixtures/case001-legacy-evidence.sql'))}
            $section=[regex]::Replace($section,'(?s)-- BEGIN STUDENT CASE EXTENSION INSTALL.*?-- END STUDENT CASE EXTENSION INSTALL','')
            foreach($batch in [regex]::Split($section,'(?im)^[\t ]*GO[\t ]*(?:--[^\r\n]*)?\r?$')){if($batch.Trim()){Invoke-StudentSql $master $batch}}
        }
        Assert-StudentRuntimeShape $master -AllowV1
        Invoke-StudentSql $master @'
INSERT app.LocalLearner(OwnerId,CapabilityHash) VALUES ('11111111-1111-4111-8111-111111111111',HASHBYTES('SHA2_256','pinned-v1'));
INSERT app.LearnerAttempt(AttemptId,OwnerId,CaseId,ContentVersion,EvidenceVersion,Status) VALUES ('22222222-2222-4222-8222-222222222222','11111111-1111-4111-8111-111111111111','case-001',1,'sequel-evidence-v1','active');
INSERT app.AttemptWorkspace(AttemptId,WorkspaceJson) VALUES ('22222222-2222-4222-8222-222222222222',N'{"draftSql":"retain pinned draft","notes":["retain v1 note"],"selectedView":"workbench"}');
'@
        $pinnedChecksum=Invoke-StudentSql $master "SELECT CHECKSUM_AGG(BINARY_CHECKSUM(*)) FROM app.CaseStep WHERE CaseId='case-001' AND ContentVersion=1;" -Scalar
        $evidenceChecksum=Invoke-StudentSql $master 'SELECT CHECKSUM_AGG(BINARY_CHECKSUM(*)) FROM dbo.DriversLicense;' -Scalar
        $originalSection=${function:Get-StudentSqlSection}
        function Get-StudentSqlSection([string]$Path,[string]$Kind){
            $section=& $originalSection $Path $Kind
            if($Kind -eq 'CASE EXTENSION' -and [IO.Path]::GetFileName($Path) -eq '03-SequelCityCrimesDB - ForeignKeys.sql'){$section += "`r`nGO`r`nTHROW 51025,'extension interruption fixture',1;`r`n"}
            return $section
        }
        try{Expect-LauncherFailure {Install-StudentDatabase $SqlHost $SqlPort $v1Name $repoRoot} 'extension interruption fixture'}
        finally{Set-Item Function:Get-StudentSqlSection $originalSection}
        Assert-Launcher ((Invoke-StudentSql $master "SELECT COUNT(*) FROM sys.tables WHERE object_id=OBJECT_ID('app.AttemptEvidenceItem');" -Scalar) -eq 0) 'Failed upgrade retained partial evidence collection schema.'
        $extensionUpgrade=Install-StudentDatabase $SqlHost $SqlPort $v1Name $repoRoot
        Assert-Launcher ($extensionUpgrade.Mode -eq 'extension' -and $extensionUpgrade.BackupPath.EndsWith('.bak')) 'Version 1 extension upgrade did not retain a verified backup.'
        Assert-Launcher ((Invoke-StudentSql $master "SELECT COUNT(*) FROM app.LearnerAttempt WHERE ContentVersion=1 AND AttemptId='22222222-2222-4222-8222-222222222222';" -Scalar) -eq 1) 'Old attempt was remapped.'
        Assert-Launcher ((Invoke-StudentSql $master "SELECT COUNT(*) FROM app.AttemptWorkspace WHERE WorkspaceJson LIKE '%retain v1 note%';" -Scalar) -eq 1) 'Pinned workspace lost.'
        Assert-Launcher ((Invoke-StudentSql $master "SELECT CHECKSUM_AGG(BINARY_CHECKSUM(*)) FROM app.CaseStep WHERE CaseId='case-001' AND ContentVersion=1;" -Scalar) -eq $pinnedChecksum) 'Immutable pinned content changed.'
        Assert-Launcher ((Invoke-StudentSql $master 'SELECT CHECKSUM_AGG(BINARY_CHECKSUM(*)) FROM dbo.DriversLicense;' -Scalar) -eq $evidenceChecksum) 'Upgrade changed public evidence.'
        $repeatExtension=Install-StudentDatabase $SqlHost $SqlPort $v1Name $repoRoot
        Assert-Launcher ($repeatExtension.Mode -eq 'current') 'Repeated extension install was not verification only.'
        Write-Host 'PASS: backed-up v1 additive upgrade, interruption rollback, pinned-version/workspace/public-evidence preservation and repeat launch.'
        # WP-297: reconstruct the shipped intact runtime, keeping its released v1
        # content. Only this newly claimed disposable fixture is made legacy.
        $cityName=$freshName
        Reset-SingleTestFixture $master
        $master.ChangeDatabase($cityName)
        foreach($file in @('01-SequelCityCrimesDB - Create DB.sql','02-SequelCityCrimesDB - Insert Data.sql','03-SequelCityCrimesDB - ForeignKeys.sql')) {
            $section=Get-StudentSqlSection (Join-Path $repoRoot "database/$file") FRESH
            # Reconstruct the actual pre-v3 city dataset, not new evidence
            # combined with an older city manifest.
            $section=[regex]::Replace($section,'(?s)-- BEGIN WP-300 COMPLETE EVIDENCE.*?-- END WP-300 COMPLETE EVIDENCE','')
            if($file.StartsWith('02-')){$section += [Environment]::NewLine+[IO.File]::ReadAllText((Join-Path $repoRoot 'apps/api/src/services/fixtures/case001-legacy-evidence.sql'))}
            $section=[regex]::Replace($section,'(?s)-- WP-300: complete full Tier 1 case\..*?-- END WP-300 COMPLETE CASE','')
            if($file.StartsWith('01-')) {
                $section=[regex]::Replace($section,'(?s)-- BEGIN STUDENT CITY NAME INSTALL.*?-- END STUDENT CITY NAME INSTALL',{
                    param($m)
                    $old=$m.Value.Replace("ReportCity='Sequel City'","ReportCity='SQL City'")
                    $old=[regex]::Replace($old,"(?m)^ AND NOT EXISTS .*?\r?$",'')
                    $old=[regex]::Replace($old,"(?m)^ AND \(SELECT COUNT\(\*\) FROM dbo.CrimeSceneReport WHERE ReportCity='SQL City'.*?=16\r?$",'')
                    return $old
                })
            } else { $section=[regex]::Replace($section,'(?s)-- BEGIN STUDENT CITY NAME INSTALL.*?-- END STUDENT CITY NAME INSTALL','') }
            foreach($batch in [regex]::Split($section,'(?im)^[\t ]*GO[\t ]*(?:--[^\r\n]*)?\r?$')){if($batch.Trim()){Invoke-StudentSql $master $batch}}
        }
        Invoke-StudentSql $master "UPDATE dbo.CrimeSceneReport SET ReportCity='SQL City' WHERE ReportID IN (10056,10138,10154,10216,10317,10506,10562,10571,10791,10927,10969,10970,10975,11049,11050);"
        Assert-StudentRuntimeShape $master -AllowLegacyCity
        Invoke-StudentSql $master @'
INSERT app.LocalLearner(OwnerId,CapabilityHash) VALUES ('11111111-1111-4111-8111-111111111111',HASHBYTES('SHA2_256','city-v1'));
INSERT app.LearnerAttempt(AttemptId,OwnerId,CaseId,ContentVersion,EvidenceVersion,Status) VALUES ('22222222-2222-4222-8222-222222222222','11111111-1111-4111-8111-111111111111','case-004',1,'sequel-evidence-v1','active');
INSERT app.AttemptWorkspace(AttemptId,WorkspaceJson) VALUES ('22222222-2222-4222-8222-222222222222',N'{"draftSql":"SQL City draft","notes":["SQL City note"],"selectedView":"workbench"}');
INSERT app.AttemptAction(ActionId,AttemptId,RequestId,ActionKind,RequestDigest,PrerequisiteRevision,SqlOrSubmission,ValidatorResult,ProofJson) VALUES ('33333333-3333-4333-8333-333333333333','22222222-2222-4222-8222-222222222222','44444444-4444-4444-8444-444444444444','query',0x01,0,'SELECT * FROM CrimeType','matched',N'{"facts":[{"key":"CrimeID","value":"1080","sourceActionId":"33333333-3333-4333-8333-333333333333"}],"items":["1080"],"completed":true}');
INSERT app.AttemptStepEvidence(AttemptId,StepKey,CaseId,ContentVersion,ActionId,ValidatorVersion,ProofJson) SELECT AttemptId,'crime-type','case-004',1,ActionId,1,ProofJson FROM app.AttemptAction;
INSERT app.AttemptEvidenceItem(AttemptId,CaseId,ContentVersion,StepKey,ItemKey,ActionId,ValidatorVersion,ProofJson) SELECT AttemptId,'case-004',1,'crime-type','1080',ActionId,1,ProofJson FROM app.AttemptAction;
'@
        # Byte-exact hashes, not row counts, prove preservation across repair.
        $preserved=@{}
        $tables=@('dbo.CrimeType','dbo.DriversLicense','dbo.PersonsOfInterest','dbo.EventSchedule','dbo.EventRegistration','dbo.FitNFlabClub','dbo.FitNFlabClubCheckIn','dbo.Employment','dbo.InterviewLog','dbo.Solution','dbo.CaseAnswerKey','app.LearnerAttempt','app.AttemptWorkspace','app.AttemptAction','app.AttemptStepEvidence','app.AttemptEvidenceItem')
        foreach($table in $tables){$preserved[$table]=Invoke-StudentSql $master "SELECT CONVERT(varchar(64),HASHBYTES('SHA2_256',(SELECT * FROM $table FOR JSON PATH,INCLUDE_NULL_VALUES)),2);" -Scalar}
        $v1Hashes=@{}
        $v1Orders=@{CaseDefinition='CaseId,ContentVersion';CaseStep='StepKey';CaseStepPrerequisite='StepKey,RequiredStepKey';CaseFactDefinition='FactKey';CaseBriefingFact='FactKey,ItemKey';CaseStepFactBinding='StepKey,FactKey,BindingUse'}
        foreach($table in $v1Orders.Keys){$v1Hashes[$table]=Invoke-StudentSql $master "SELECT CONVERT(varchar(64),HASHBYTES('SHA2_256',(SELECT * FROM app.$table WHERE CaseId='case-004' AND ContentVersion=1 ORDER BY $($v1Orders[$table]) FOR JSON PATH,INCLUDE_NULL_VALUES)),2);" -Scalar}
        $reportHashSql="SELECT CONVERT(varchar(64),HASHBYTES('SHA2_256',(SELECT ReportID,CrimeID,ReportDate,ReportDescription,CASE WHEN ReportID IN (10056,10138,10154,10216,10317,10506,10562,10571,10791,10927,10969,10970,10975,11049,11050) THEN 'Sequel City' ELSE ReportCity END ReportCity FROM dbo.CrimeSceneReport ORDER BY ReportID FOR JSON PATH,INCLUDE_NULL_VALUES)),2);"
        $reportHash=Invoke-StudentSql $master $reportHashSql -Scalar
        # Same count, wrong identities; same identities, wrong description; partial repair.
        Invoke-StudentSql $master "UPDATE dbo.CrimeSceneReport SET ReportDescription=ReportDescription+'x' WHERE ReportID=10056;"
        Expect-LauncherFailure {Install-StudentDatabase $SqlHost $SqlPort $cityName $repoRoot} 'signature'
        Invoke-StudentSql $master "UPDATE dbo.CrimeSceneReport SET ReportDescription=LEFT(ReportDescription,LEN(ReportDescription)-1) WHERE ReportID=10056; UPDATE dbo.CrimeSceneReport SET ReportCity='Sequel City' WHERE ReportID=10056;"
        Expect-LauncherFailure {Install-StudentDatabase $SqlHost $SqlPort $cityName $repoRoot} 'Conflicting'
        Invoke-StudentSql $master "UPDATE dbo.CrimeSceneReport SET ReportCity='SQL City' WHERE ReportID=10056;"
        $oldCity=Invoke-StudentSql $master 'SELECT ReportCity FROM dbo.CrimeSceneReport WHERE ReportID=10001;' -Scalar
        Invoke-StudentSql $master "UPDATE dbo.CrimeSceneReport SET ReportCity='SQL City' WHERE ReportID=10001;"
        Expect-LauncherFailure {Install-StudentDatabase $SqlHost $SqlPort $cityName $repoRoot} 'Unexpected legacy report set'
        Invoke-StudentSql $master 'UPDATE dbo.CrimeSceneReport SET ReportCity=@city WHERE ReportID=10001;' -Parameters @{'@city'=$oldCity}
        Invoke-StudentSql $master "DISABLE TRIGGER app.ProtectReleasedBriefingFact ON app.CaseBriefingFact; UPDATE app.CaseBriefingFact SET TextValue='Other City' WHERE CaseId='case-004' AND ContentVersion=1 AND FactKey='briefing-city'; ENABLE TRIGGER app.ProtectReleasedBriefingFact ON app.CaseBriefingFact;"
        Expect-LauncherFailure {Install-StudentDatabase $SqlHost $SqlPort $cityName $repoRoot} 'Unexpected Case 004 content'
        Invoke-StudentSql $master "DISABLE TRIGGER app.ProtectReleasedBriefingFact ON app.CaseBriefingFact; UPDATE app.CaseBriefingFact SET TextValue='SQL City' WHERE CaseId='case-004' AND ContentVersion=1 AND FactKey='briefing-city'; ENABLE TRIGGER app.ProtectReleasedBriefingFact ON app.CaseBriefingFact;"
        $originalSection=${function:Get-StudentSqlSection}
        function Get-StudentSqlSection([string]$Path,[string]$Kind){
            $section=& $originalSection $Path $Kind
            if($Kind -eq 'CITY NAME' -and [IO.Path]::GetFileName($Path).StartsWith('03-')){$section += "`r`nGO`r`nTHROW 51025,'city interruption fixture',1;`r`n"}
            return $section
        }
        try{Expect-LauncherFailure {Install-StudentDatabase $SqlHost $SqlPort $cityName $repoRoot} 'city interruption fixture'}
        finally{Set-Item Function:Get-StudentSqlSection $originalSection}
        Assert-Launcher ((Get-StudentCityState $master) -eq 'legacy') 'Interrupted repair changed report cities.'
        Assert-StudentRuntimeShape $master -AllowLegacyCity
        Assert-Launcher ((Invoke-StudentSql $master "SELECT COUNT(*) FROM app.CaseDefinition WHERE CaseId='case-004' AND ContentVersion=2;" -Scalar) -eq 0) 'Interrupted repair published v2.'
        Assert-Launcher ((Invoke-StudentSql $master "SELECT COUNT(*) FROM dbo.AppSchemaVersion WHERE MigrationKey='canonical-city-v1';" -Scalar) -eq 0) 'Interrupted repair retained marker.'
        $cityRepair=Install-StudentDatabase $SqlHost $SqlPort $cityName $repoRoot
        Assert-Launcher ($cityRepair.Mode -eq 'city' -and $cityRepair.BackupPath.EndsWith('.bak')) 'City backup/repair missing.'
        Invoke-StudentSql $master 'RESTORE VERIFYONLY FROM DISK=@path WITH CHECKSUM;' -Parameters @{'@path'=$cityRepair.BackupPath}
        Assert-Launcher ((Invoke-StudentSql $master $reportHashSql -Scalar) -eq $reportHash) 'Repair changed other report values.'
        foreach($table in $tables){Assert-Launcher ((Invoke-StudentSql $master "SELECT CONVERT(varchar(64),HASHBYTES('SHA2_256',(SELECT * FROM $table FOR JSON PATH,INCLUDE_NULL_VALUES)),2);" -Scalar) -eq $preserved[$table]) "Repair changed $table"}
        foreach($table in $v1Orders.Keys){Assert-Launcher ((Invoke-StudentSql $master "SELECT CONVERT(varchar(64),HASHBYTES('SHA2_256',(SELECT * FROM app.$table WHERE CaseId='case-004' AND ContentVersion=1 ORDER BY $($v1Orders[$table]) FOR JSON PATH,INCLUDE_NULL_VALUES)),2);" -Scalar) -eq $v1Hashes[$table]) "Repair rewrote immutable v1 $table"}
        Assert-Launcher ((Install-StudentDatabase $SqlHost $SqlPort $cityName $repoRoot).Mode -eq 'current') 'Repair not idempotent.'
        Write-Host 'PASS: WP-297 exact report signatures, unknown/partial refusal, verified backup, atomic rollback, v1/workspace/evidence preservation and repeat launch.'
        Reset-SingleTestFixture $master
        Invoke-StudentSql $master "ALTER AUTHORIZATION ON DATABASE::[$unknownName] TO $windowsOwner;"
        Expect-LauncherFailure {Install-StudentDatabase $SqlHost $SqlPort $unknownName $repoRoot} 'Unrecognized'
        Assert-Launcher ((Get-StudentDatabaseOwnerType $master $unknownName) -eq 'U') 'Unknown target ownership was modified.'
        Reset-SingleTestFixture $master -LeaveAbsent
        $null=Install-StudentDatabase $SqlHost $SqlPort $freshName $repoRoot
        $master.ChangeDatabase($freshName)
        Invoke-StudentSql $master 'DISABLE TRIGGER app.ProtectReleasedStep ON app.CaseStep;'
        Invoke-StudentSql $master "ALTER AUTHORIZATION ON DATABASE::[$freshName] TO $windowsOwner;"
        Expect-LauncherFailure {Install-StudentDatabase $SqlHost $SqlPort $freshName $repoRoot} 'incomplete'
        Assert-Launcher ((Get-StudentDatabaseOwnerType $master $freshName) -eq 'U') 'Partial target ownership was modified.'
        Invoke-StudentSql $master 'ENABLE TRIGGER app.ProtectReleasedStep ON app.CaseStep;'
        Write-Host 'PASS: real SQL fresh/repeat/legacy backup and preservation/unknown/corrupt state checks.'

        if ($PackageLaunch) {
            $packageOutput=Join-Path $fixture 'packages'
            & (Join-Path $repoRoot 'scripts/build-student-tester-package.ps1') -OutputRoot $packageOutput -NoZip
            $package=(Get-ChildItem $packageOutput -Directory | Select-Object -First 1).FullName
            # Exercise actual locked dependency installation in the extracted package.
            $apiListener=[Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback,0);$apiListener.Start();$apiPortTest=$apiListener.LocalEndpoint.Port;$apiListener.Stop()
            $webListener=[Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback,0);$webListener.Start();$webPortTest=$webListener.LocalEndpoint.Port;$webListener.Stop()
            $launchName=$freshName
            # Claim database ourselves so cleanup owns it even when a launched child fails.
            Reset-SingleTestFixture $master
            $master.ChangeDatabase($launchName);Invoke-StudentSql $master "EXEC sys.sp_addextendedproperty @name=N'SequelDetectiveInstaller',@value=N'student-install-v1';"
            $arguments=@('-NoProfile','-ExecutionPolicy','Bypass','-File',('"'+(Join-Path $package 'scripts/start-student-package.ps1')+'"'),'-DatabaseName',$launchName,'-SqlHost',$SqlHost,'-SqlPort',[string]$SqlPort,'-ApiPort',[string]$apiPortTest,'-WebPort',[string]$webPortTest,'-NoBrowser','-StartupTimeoutSeconds','90')
            $previousModulePath=$env:PSModulePath
            try{$env:PSModulePath=$null;$launched=Start-Process powershell -ArgumentList $arguments -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $fixture 'launch.log') -RedirectStandardError (Join-Path $fixture 'launch-error.log')}
            finally{$env:PSModulePath=$previousModulePath}
            $watch=[Diagnostics.Stopwatch]::StartNew();$ready=$false
            while($watch.Elapsed.TotalSeconds -lt 300 -and !$launched.HasExited){
                if((Read-LauncherLog (Join-Path $fixture 'launch.log')).Contains('Ready:')){$ready=$true;break}
                Start-Sleep -Milliseconds 500
            }
            Assert-Launcher $ready ('Packaged launch failed: '+(Read-LauncherLog (Join-Path $fixture 'launch-error.log'))+(Read-LauncherLog (Join-Path $fixture 'launch.log')))
            $settings=Read-StudentEnvironment (Join-Path $package 'apps/api/.env');$logins += @($settings.SQLSERVER_USER,$settings.SQLSERVER_APP_USER)
            Assert-Launcher (Test-StudentRuntimeConnection $settings) 'Packaged runtime not ready.'
            $apiUrl="http://127.0.0.1:$apiPortTest";$webUrl="http://127.0.0.1:$webPortTest"
            $session=Invoke-RestMethod "$apiUrl/api/session" -Headers @{Origin=$webUrl} -SessionVariable cookies
            $headers=@{Origin=$webUrl;'X-CSRF-Token'=$session.csrfToken}
            $attempt=Invoke-RestMethod "$apiUrl/api/cases/case-001/attempts" -Method Post -ContentType 'application/json' -WebSession $cookies -Headers $headers -Body (@{requestId=[guid]::NewGuid().ToString();expectedRevision='0'} | ConvertTo-Json)
            Assert-Launcher ($attempt.task.starter.sql.Trim().TrimEnd(';') -eq 'SELECT * FROM CrimeType') 'Packaged fresh case did not start at CrimeType.'
            Assert-Launcher ($attempt.contentVersion -eq 3 -and $attempt.progress.total -eq 6 -and $attempt.task.completionMode -eq 'log') 'Packaged current case contract is incorrect.'
            $workspace=@{draftSql='SELECT * FROM CrimeType;';notes=@('package reload note');selectedView='workbench'}
            $null=Invoke-RestMethod "$apiUrl/api/attempts/$($attempt.attemptId)/workspace" -Method Patch -ContentType 'application/json' -WebSession $cookies -Headers $headers -Body (@{requestId=[guid]::NewGuid().ToString();expectedRevision=$attempt.revision;workspace=$workspace} | ConvertTo-Json -Depth 5)
            Stop-StudentOwnedProcess $launched;$launched=$null
            # Relaunch same package/config without setup arguments changing identity.
            # A healthy normal launch must not need the administrative installer at all.
            $packageInstaller=Join-Path $package 'scripts/student-package/install-student-database.ps1'
            $packageInstallerText=[IO.File]::ReadAllText($packageInstaller)
            [IO.File]::AppendAllText($packageInstaller,"`r`nfunction Install-StudentDatabase {throw 'WP309 administrative setup forbidden during healthy launch'}`r`n")
            try{$env:PSModulePath=$null;$launched=Start-Process powershell -ArgumentList $arguments -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $fixture 'relaunch.log') -RedirectStandardError (Join-Path $fixture 'relaunch-error.log')}
            finally{$env:PSModulePath=$previousModulePath}
            $watch.Restart();$ready=$false
            while($watch.Elapsed.TotalSeconds -lt 100 -and !$launched.HasExited){if((Read-LauncherLog (Join-Path $fixture 'relaunch.log')).Contains('Ready:')){$ready=$true;break};Start-Sleep -Milliseconds 500}
            Assert-Launcher $ready 'Repeat packaged launch did not reach readiness.'
            [IO.File]::WriteAllText($packageInstaller,$packageInstallerText)
            Assert-Launcher (!(Read-LauncherLog (Join-Path $fixture 'relaunch.log')).Contains('Installing application dependencies')) 'Repeat launch unnecessarily reinstalled dependencies.'
            $restored=Invoke-RestMethod "$apiUrl/api/attempts/$($attempt.attemptId)" -WebSession $cookies
            Assert-Launcher ($restored.workspace.notes -contains 'package reload note') 'Package relaunch lost saved workspace.'
            $settings2=Read-StudentEnvironment (Join-Path $package 'apps/api/.env')
            Assert-Launcher ($settings.CASE_RUNTIME_SESSION_SECRET -eq $settings2.CASE_RUNTIME_SESSION_SECRET) 'Package relaunch changed session secret.'
            $verification=Invoke-RestMethod "$apiUrl/api/case/verify-suspect" -Method Post -ContentType 'application/json' -Body '{"suspect":"Jeremy Bowers"}'
            Assert-Launcher ($verification.success -and $verification.data.isCorrect) 'Legacy Case 004 controlled verification regressed.'
            $browserNames=@('VITE_API_BASE_URL','PLAYWRIGHT_BASE_URL','CASE_001_LIVE_SMOKE','CASE_AUTHORING_LIVE')
            $browserPrior=@{};foreach($key in $browserNames){$browserPrior[$key]=[Environment]::GetEnvironmentVariable($key,'Process')}
            Push-Location (Join-Path $repoRoot 'apps/web')
            try{
                $env:VITE_API_BASE_URL=$apiUrl;$env:PLAYWRIGHT_BASE_URL=$webUrl;$env:CASE_001_LIVE_SMOKE='1';$env:CASE_AUTHORING_LIVE='1'
                & node (Join-Path $repoRoot 'node_modules/@playwright/test/cli.js') test --workers=1 case-001-full-resolution.spec.ts student-mode.spec.ts
                Assert-Launcher ($LASTEXITCODE -eq 0) 'Packaged app live browser regression failed.'
            }finally{Pop-Location;foreach($key in $browserNames){[Environment]::SetEnvironmentVariable($key,$browserPrior[$key],'Process')}}
            Write-Host 'PASS: extracted package one-launch setup, API readiness, first task, saved workspace and relaunch.'
            Stop-StudentOwnedProcess $launched;$launched=$null
            Invoke-StudentSql $master "ALTER AUTHORIZATION ON DATABASE::[$launchName] TO $windowsOwner;"
            # A Windows owner may resolve while the domain is reachable. Simulate
            # only the initial failed probe; backup, repair and later probes are real.
            $packageLauncher=Join-Path $package 'scripts/student-package/start-student-package.ps1'
            $packageLauncherText=[IO.File]::ReadAllText($packageLauncher)
            $ownerProbeFixture=@'
$script:OwnerRepairFixtureOriginalProbe=${function:Test-StudentRuntimeConnection}
$script:OwnerRepairFixtureFirstProbe=$true
function Test-StudentRuntimeConnection([hashtable]$Settings) {
    if($script:OwnerRepairFixtureFirstProbe){
        $script:OwnerRepairFixtureFirstProbe=$false
        $script:StudentRuntimeReadinessReason='database-ownership'
        return $false
    }
    return (& $script:OwnerRepairFixtureOriginalProbe $Settings)
}
'@
            $launchMarker='if (!$LibraryOnly) { Invoke-StudentLaunch $projectRoot }'
            Assert-Launcher ($packageLauncherText.Contains($launchMarker)) 'Packaged launcher fixture entrypoint not found.'
            [IO.File]::WriteAllText($packageLauncher,$packageLauncherText.Replace($launchMarker,$ownerProbeFixture+"`r`n"+$launchMarker))
            try{$env:PSModulePath=$null;$launched=Start-Process powershell -ArgumentList $arguments -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $fixture 'owner-repair-launch.log') -RedirectStandardError (Join-Path $fixture 'owner-repair-launch-error.log')}
            finally{$env:PSModulePath=$previousModulePath}
            $watch.Restart();$ready=$false
            while($watch.Elapsed.TotalSeconds -lt 180 -and !$launched.HasExited){if((Read-LauncherLog (Join-Path $fixture 'owner-repair-launch.log')).Contains('Ready:')){$ready=$true;break};Start-Sleep -Milliseconds 500}
            Assert-Launcher $ready ('Ownership-repair package launch failed: '+(Read-LauncherLog (Join-Path $fixture 'owner-repair-launch-error.log'))+(Read-LauncherLog (Join-Path $fixture 'owner-repair-launch.log')))
            Assert-Launcher ((Get-StudentDatabaseOwnerType $master $launchName) -eq 'S') 'Package did not repair Windows-dependent owner.'
            Assert-Launcher ((Read-LauncherLog (Join-Path $fixture 'owner-repair-launch.log')).Contains('Verified database backup retained:')) 'Package ownership repair did not verify a backup.'
            $restored=Invoke-RestMethod "$apiUrl/api/attempts/$($attempt.attemptId)" -WebSession $cookies
            Assert-Launcher ($restored.workspace.notes -contains 'package reload note') 'Ownership-repair package launch lost saved work.'
            $settingsAfterRepair=Read-StudentEnvironment (Join-Path $package 'apps/api/.env')
            foreach($key in @('CASE_RUNTIME_SESSION_SECRET','SQLSERVER_PASSWORD','SQLSERVER_APP_PASSWORD')){Assert-Launcher ($settings[$key] -eq $settingsAfterRepair[$key]) 'Ownership repair changed an existing credential/session secret.'}
            [IO.File]::WriteAllText($packageLauncher,$packageLauncherText)
            Write-Host 'PASS: extracted package existing-owner repair after simulated first-probe failure preserves saved work, credentials and browser ownership.'

            # Exercise a real compatible legacy target through one normal packaged
            # launch as well. Retain the fresh fixture's config while this second
            # fixture reuses the same database with newly generated accounts.
            Stop-StudentOwnedProcess $launched;$launched=$null
            $packageLegacyName=$freshName
            Reset-SingleTestFixture $master
            $master.ChangeDatabase($packageLegacyName)
            foreach($file in @('01-SequelCityCrimesDB - Create DB.sql','02-SequelCityCrimesDB - Insert Data.sql','03-SequelCityCrimesDB - ForeignKeys.sql')){
                $section=Get-StudentSqlSection (Join-Path $repoRoot "database/$file") FRESH
                $section=[regex]::Replace($section,'(?s)-- BEGIN WP-300 COMPLETE EVIDENCE.*?-- END WP-300 COMPLETE EVIDENCE','')
                if($file.StartsWith('02-')){$section += [Environment]::NewLine+[IO.File]::ReadAllText((Join-Path $repoRoot 'apps/api/src/services/fixtures/case001-legacy-evidence.sql'))}
                $section=[regex]::Replace($section,'(?s)-- BEGIN STUDENT RUNTIME INSTALL.*?-- END STUDENT RUNTIME INSTALL','')
                foreach($batch in [regex]::Split($section,'(?im)^[\t ]*GO[\t ]*(?:--[^\r\n]*)?\r?$')){if($batch.Trim()){Invoke-StudentSql $master $batch}}
            }
            $legacyChecksum=Invoke-StudentSql $master 'SELECT CHECKSUM_AGG(BINARY_CHECKSUM(*)) FROM dbo.InterviewLog;' -Scalar
            $packageConfig=Join-Path $package 'apps/api/.env'
            $savedFreshConfig=Join-Path $fixture 'fresh-launch.env'
            Assert-Launcher ([IO.Path]::GetFullPath($packageConfig).StartsWith([IO.Path]::GetFullPath($fixture)+[IO.Path]::DirectorySeparatorChar,[StringComparison]::OrdinalIgnoreCase)) 'Package config escaped fixture.'
            Move-Item -LiteralPath $packageConfig -Destination $savedFreshConfig
            try{
                $legacyArguments=$arguments.Clone();$legacyArguments[[Array]::IndexOf($legacyArguments,'-DatabaseName')+1]=$packageLegacyName
                try{$env:PSModulePath=$null;$launched=Start-Process powershell -ArgumentList $legacyArguments -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $fixture 'legacy-launch.log') -RedirectStandardError (Join-Path $fixture 'legacy-launch-error.log')}
                finally{$env:PSModulePath=$previousModulePath}
                $watch.Restart();$ready=$false
                while($watch.Elapsed.TotalSeconds -lt 100 -and !$launched.HasExited){if((Read-LauncherLog (Join-Path $fixture 'legacy-launch.log')).Contains('Ready:')){$ready=$true;break};Start-Sleep -Milliseconds 500}
                Assert-Launcher $ready ('Legacy packaged first launch failed: '+(Read-LauncherLog (Join-Path $fixture 'legacy-launch-error.log'))+(Read-LauncherLog (Join-Path $fixture 'legacy-launch.log')))
                $legacySettings=Read-StudentEnvironment $packageConfig;$logins+=@($legacySettings.SQLSERVER_USER,$legacySettings.SQLSERVER_APP_USER)
                Assert-Launcher (Test-StudentRuntimeConnection $legacySettings) 'Legacy packaged accounts not bounded/ready.'
                Assert-Launcher ((Read-LauncherLog (Join-Path $fixture 'legacy-launch.log')).Contains('Verified database backup retained:')) 'Legacy packaged launch omitted verified backup.'
                Assert-Launcher ((Invoke-StudentSql $master 'SELECT CHECKSUM_AGG(BINARY_CHECKSUM(*)) FROM dbo.InterviewLog;' -Scalar) -eq $legacyChecksum) 'Legacy packaged launch changed public evidence.'
                Write-Host 'PASS: compatible legacy package reaches readiness in one launch with retained verified backup.'
            }finally{
                Stop-StudentOwnedProcess $launched;$launched=$null
                if(Test-Path -LiteralPath $packageConfig){$legacyCleanup=Read-StudentEnvironment $packageConfig;$logins+=@($legacyCleanup.SQLSERVER_USER,$legacyCleanup.SQLSERVER_APP_USER);Remove-Item -LiteralPath $packageConfig}
                Move-Item -LiteralPath $savedFreshConfig -Destination $packageConfig
            }
        }
    }
} finally {
    Stop-StudentOwnedProcess $launched
    if($master){
        if($package -and (Test-Path (Join-Path $package 'apps/api/.env'))){$cleanupSettings=Read-StudentEnvironment (Join-Path $package 'apps/api/.env');$logins=@($logins + @($cleanupSettings.SQLSERVER_USER,$cleanupSettings.SQLSERVER_APP_USER) | Where-Object {$_ -match '^sc_(learner|repository)_[a-f0-9]{12}$'} | Select-Object -Unique)}
        $master.ChangeDatabase('master')
        if($databases.Count){Reset-SingleTestFixture $master -LeaveAbsent}
        foreach($login in $logins){Invoke-StudentSql $master "IF EXISTS(SELECT 1 FROM sys.sql_logins WHERE name=N'$login') DROP LOGIN [$login];"}
        $master.Dispose()
    }
    # Use native PowerShell end-to-end; never pass enumerated paths to cmd deletion.
    $resolvedFixture=[IO.Path]::GetFullPath($fixture)
    $tempPrefix=[IO.Path]::GetFullPath([IO.Path]::GetTempPath()).TrimEnd('\','/')+[IO.Path]::DirectorySeparatorChar
    Assert-Launcher ($resolvedFixture.StartsWith($tempPrefix,[StringComparison]::OrdinalIgnoreCase)) 'Fixture cleanup escaped temp directory.'
    if(Test-Path (Join-Path $resolvedFixture 'packages')) {
        foreach($fixturePackage in Get-ChildItem -LiteralPath (Join-Path $resolvedFixture 'packages') -Directory){
            $fixtureLink=[IO.Path]::GetFullPath((Join-Path $fixturePackage.FullName 'node_modules'))
            Assert-Launcher ($fixtureLink.StartsWith($resolvedFixture+[IO.Path]::DirectorySeparatorChar,[StringComparison]::OrdinalIgnoreCase)) 'Dependency cleanup escaped fixture.'
            if((Test-Path -LiteralPath $fixtureLink) -and ((Get-Item -LiteralPath $fixtureLink).Attributes -band [IO.FileAttributes]::ReparsePoint)){[IO.Directory]::Delete($fixtureLink)}
        }
    }
    if(Test-Path -LiteralPath $resolvedFixture){
        $deleted=$false
        for($i=0; $i -lt 10 -and !$deleted; $i++){
            try {
                Remove-Item -LiteralPath $resolvedFixture -Recurse -Force -ErrorAction Stop
                $deleted=$true
            } catch {
                try {
                    [IO.Directory]::Delete("\\?\$resolvedFixture",$true)
                    $deleted=$true
                } catch {
                    Start-Sleep -Milliseconds 500
                }
            }
        }
    }
}
