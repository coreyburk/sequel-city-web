param(
    [string]$SqlHost = 'localhost',
    [int]$SqlPort = 1433,
    [string]$DatabaseName = 'SequelCityCrimesDB',
    [string]$ProjectRoot = (Split-Path (Split-Path $PSScriptRoot -Parent) -Parent),
    [switch]$LibraryOnly
)

$ErrorActionPreference = 'Stop'

function Assert-StudentSqlTarget([string]$HostName, [int]$Port, [string]$Name) {
    if ($HostName -notmatch '^(localhost|127\.0\.0\.1)$' -or $Port -lt 1 -or $Port -gt 65535) {
        throw 'Student setup supports a local SQL Server only. Ask your instructor to configure the machine.'
    }
    if ($Name -notmatch '^[A-Za-z_][A-Za-z0-9_]{0,127}$') { throw 'Unsupported database identifier.' }
    if ($Name -in @('master','model','msdb','tempdb')) { throw 'System databases cannot be student setup targets.' }
}

function Invoke-StudentSql($Connection, [string]$Sql, $Transaction = $null, [switch]$Scalar, [hashtable]$Parameters = @{}) {
    $command = $Connection.CreateCommand()
    $command.CommandTimeout = 180
    $command.CommandText = $Sql
    if ($Transaction) { $command.Transaction = $Transaction }
    foreach ($key in $Parameters.Keys) { $null = $command.Parameters.AddWithValue($key, $Parameters[$key]) }
    try {
        if ($Scalar) { return $command.ExecuteScalar() }
        $null = $command.ExecuteNonQuery()
    } finally { $command.Dispose() }
}

function Get-StudentSqlSection([string]$Path, [ValidateSet('FRESH','RUNTIME','CASE EXTENSION')][string]$Kind) {
    $text = [IO.File]::ReadAllText($Path)
    $begin = "-- BEGIN STUDENT $Kind INSTALL"
    $end = "-- END STUDENT $Kind INSTALL"
    if ([regex]::Matches($text, [regex]::Escape($begin)).Count -ne 1 -or
        [regex]::Matches($text, [regex]::Escape($end)).Count -ne 1) {
        throw "Installation section boundaries are missing or ambiguous in $([IO.Path]::GetFileName($Path))."
    }
    $start = $text.IndexOf($begin) + $begin.Length
    $finish = $text.IndexOf($end)
    if ($finish -le $start) { throw 'Invalid installation section order.' }
    $section = $text.Substring($start, $finish - $start)
    # Select the connection database; never substitute names throughout SQL bodies.
    $section = [regex]::Replace($section, '(?i)\A[\r\n\t ]*USE[\t ]+SequelCityCrimesDB[\t ]*\r?\n', '')
    # Reject database DDL even inside dynamic SQL; current authoritative install
    # sections contain no such statements or transcript text.
    if($section -match '(?i)\b(?:CREATE|DROP|ALTER|RESTORE|BACKUP)\s+DATABASE\b|\bTRUNCATE\s+TABLE\b'){
        throw 'Database switching/destructive database commands are forbidden in installable SQL sections.'
    }
    # Evidence transcripts contain SQL words; ignore quoted data before comments.
    $analyzed = [regex]::Replace($section, "'(?:''|[^'])*'", "''")
    $analyzed = [regex]::Replace($analyzed, '(?s)/\*.*?\*/|(?m)--[^\r\n]*', '')
    if ($analyzed -match '(?i)\b(?:CREATE|DROP|ALTER|RESTORE|BACKUP)\s+DATABASE\b|\bTRUNCATE\s+TABLE\b' -or $analyzed -match '(?im)^\s*USE\s+') {
        throw 'Database switching/destructive database commands are forbidden in installable SQL sections.'
    }
    if ($Kind -ne 'FRESH' -and $analyzed -match '(?i)\b(?:INSERT(?:\s+INTO)?|UPDATE|DELETE(?:\s+FROM)?|MERGE)\s+(?:\[?dbo\]?\.)?(?:CrimeType|CrimeSceneReport|InterviewLog|PersonsOfInterest|Solution|CaseAnswerKey)\b') {
        throw 'Runtime installation cannot mutate public evidence or answer data.'
    }
    if($Kind -ne 'FRESH' -and ($analyzed -match '(?i)\bDROP\b|\bEXEC\b|\bEXECUTE\s+(?!(?:AS|ON|TO)\b)' -or
        $analyzed -match '(?i)\b(?:CREATE|ALTER)\s+(?:TABLE|TRIGGER|PROCEDURE|PROC|VIEW|SYNONYM)\s+(?!app\.)')){
        throw 'Runtime SQL must use additive app objects and cannot execute dynamic SQL.'
    }
    if($Kind -ne 'FRESH'){
        foreach($write in [regex]::Matches($analyzed,'(?i)\b(?:INSERT(?:\s+INTO)?|UPDATE|DELETE(?:\s+FROM)?|MERGE)\s+([A-Za-z0-9_\[\].]+)')){
            $target=$write.Groups[1].Value.Replace('[','').Replace(']','')
            if($target -in @('AS','ON','TO')){continue} # Trigger/permission DDL, not a DML target.
            if($target -notmatch '^app\.[A-Za-z0-9_]+$' -and $target -ine 'dbo.AppSchemaVersion'){throw 'Runtime installation cannot mutate public evidence or answer data.'}
        }
    }
    return $section
}

function Assert-StudentEvidence($Connection, $Transaction = $null) {
    # Pre-mutation compatibility check. The authoritative manifest is also executed
    # after installation, so this conservative entry gate cannot establish readiness.
    $match = Invoke-StudentSql $Connection @'
SELECT CASE WHEN EXISTS (SELECT 1 FROM dbo.CrimeType WHERE CrimeID=1080 AND CrimeType='Murder')
 AND (SELECT COUNT(*) FROM dbo.CrimeSceneReport WHERE CrimeID=1080 AND ReportDate=20230502 AND ReportCity='Sequel City' AND ReportDescription LIKE '%clocktower%')=1
 AND (SELECT COUNT(DISTINCT i.PersonID) FROM dbo.InterviewLog i JOIN dbo.CrimeSceneReport r ON r.ReportID=i.ReportID WHERE r.ReportDate=20230502 AND r.ReportCity='Sequel City' AND r.ReportDescription LIKE '%clocktower%' AND i.PersonID IN (27590,50417,62764))=3
 AND (SELECT COUNT(*) FROM dbo.CaseAnswerKey WHERE CaseId='case-004' AND AnswerRole IN ('trigger_man','mastermind'))=2
 AND OBJECT_ID('dbo.VerifySuspectSubmission','P') IS NOT NULL
 THEN 1 ELSE 0 END;
'@ $Transaction -Scalar
    if ($match -ne 1) { throw 'Existing evidence is incompatible. Setup preserved the database; ask your instructor to review it.' }
}

function Assert-StudentRuntimeShape($Connection, $Transaction = $null, [switch]$AllowV1) {
    $valid = Invoke-StudentSql $Connection @'
SELECT CASE WHEN
 (SELECT COUNT(*) FROM sys.tables WHERE schema_id=SCHEMA_ID('app') AND name IN ('CaseDefinition','CaseStep','CaseStepPrerequisite','LocalLearner','LearnerAttempt','LearnerRequest','AttemptWorkspace','AttemptAction','AttemptStepEvidence'))=9
 AND (SELECT COUNT(*) FROM sys.foreign_keys WHERE schema_id=SCHEMA_ID('app') AND is_disabled=0 AND is_not_trusted=0 AND name IN ('FK_Step_Definition','FK_Definition_Entry','FK_Prerequisite_Step','FK_Prerequisite_Required','FK_Attempt_Owner','FK_Attempt_Content','FK_Workspace_Attempt','FK_Action_Attempt','FK_Evidence_Attempt','FK_Evidence_Step','FK_Evidence_Action','FK_Request_Owner'))=12
 AND (SELECT COUNT(*) FROM sys.triggers WHERE parent_id IN (OBJECT_ID('app.CaseDefinition'),OBJECT_ID('app.CaseStep'),OBJECT_ID('app.CaseStepPrerequisite')) AND is_disabled=0)=3
 AND (SELECT COUNT(*) FROM dbo.AppSchemaVersion WHERE MigrationKey='case-runtime-v1')=1
 AND EXISTS (SELECT 1 FROM app.CaseDefinition WHERE CaseId='case-001' AND ContentVersion=1 AND EvidenceVersion='sequel-evidence-v1' AND ReleaseStatus='released')
 THEN 1 ELSE 0 END;
'@ $Transaction -Scalar
    if ($valid -ne 1) { throw 'Protected runtime schema is incomplete or incompatible; no automatic repair was performed.' }
    if (!$AllowV1) {
        $extension = Invoke-StudentSql $Connection @'
SELECT CASE WHEN
 (SELECT COUNT(*) FROM sys.tables WHERE schema_id=SCHEMA_ID('app') AND name IN ('CaseFactDefinition','CaseBriefingFact','CaseStepFactBinding','AttemptEvidenceItem'))=4
 AND (SELECT COUNT(*) FROM sys.foreign_keys WHERE schema_id=SCHEMA_ID('app') AND is_disabled=0 AND is_not_trusted=0 AND name IN ('FK_Fact_Definition','FK_BriefingFact_Type','FK_Binding_Step','FK_Binding_Fact','FK_Binding_Source','FK_Item_Attempt','FK_Item_Step','FK_Item_Action'))=8
 AND (SELECT COUNT(*) FROM sys.triggers WHERE parent_id IN (OBJECT_ID('app.CaseFactDefinition'),OBJECT_ID('app.CaseBriefingFact'),OBJECT_ID('app.CaseStepFactBinding')) AND is_disabled=0)=3
 AND EXISTS (SELECT 1 FROM sys.check_constraints WHERE name='CK_Definition_ReleasedEntry' AND is_disabled=0 AND is_not_trusted=0)
 AND EXISTS (SELECT 1 FROM dbo.AppSchemaVersion WHERE MigrationKey='case-runtime-v2')
 AND EXISTS (SELECT 1 FROM app.CaseDefinition WHERE CaseId='case-001' AND ContentVersion=2 AND ReleaseStatus='released')
 AND EXISTS (SELECT 1 FROM app.CaseDefinition WHERE CaseId='case-004' AND ContentVersion=1 AND ReleaseStatus='released')
 THEN 1 ELSE 0 END;
'@ $Transaction -Scalar
        if ($extension -ne 1) { throw 'Case runtime extension is incomplete. Launch setup to upgrade a recognized version 1 installation; partial installations require instructor review.' }
        if ((Invoke-StudentSql $Connection 'EXEC app.CheckCase004EvidenceManifest;' $Transaction -Scalar) -ne 1) { throw 'Case 004 evidence does not match the released path. Existing records were preserved; ask the instructor to review the database.' }
    }
    $valid = Invoke-StudentSql $Connection 'EXEC app.CheckEvidenceManifest;' $Transaction -Scalar
    if ($valid -ne 1) { throw 'Protected evidence manifest does not match this installation.' }
}

function Install-StudentDatabase([string]$HostName, [int]$Port, [string]$Name, [string]$Root) {
    Assert-StudentSqlTarget $HostName $Port $Name
    $files = @('01-SequelCityCrimesDB - Create DB.sql','02-SequelCityCrimesDB - Insert Data.sql','03-SequelCityCrimesDB - ForeignKeys.sql')
    # Validate every boundary before obtaining administrative access or changing SQL.
    $fresh = @(); $runtime = @(); $extensions = @()
    foreach ($file in $files) {
        $path = Join-Path $Root "database/$file"
        $fresh += Get-StudentSqlSection $path FRESH
        $runtime += Get-StudentSqlSection $path RUNTIME
        $extensions += Get-StudentSqlSection $path 'CASE EXTENSION'
    }
    $builder = New-Object System.Data.SqlClient.SqlConnectionStringBuilder
    $builder['Data Source'] = "$HostName,$Port"; $builder['Initial Catalog'] = 'master'
    $builder['Integrated Security'] = $true; $builder['TrustServerCertificate'] = $true; $builder['Connect Timeout'] = 10
    # Session-owned SQL application locks must end at Dispose, not linger in a
    # pooled administrative connection and block another launcher.
    $builder['Pooling'] = $false
    $connection = [System.Data.SqlClient.SqlConnection]::new($builder.ConnectionString)
    $transaction = $null
    try {
        try { $connection.Open() } catch { throw 'Local SQL setup requires Windows SQL Server administrator access. Ask your instructor to prepare the machine.' }
        # SQL application-lock resources are case-sensitive even when database
        # identifiers are not. Serialize case aliases conservatively as well.
        $lockName = "SequelDetectiveInstall:$($Name.ToLowerInvariant())"
        $lock = Invoke-StudentSql $connection "DECLARE @result int; EXEC @result=sys.sp_getapplock @Resource=@name,@LockMode='Exclusive',@LockOwner='Session',@LockTimeout=0; SELECT @result;" -Scalar -Parameters @{ '@name'=$lockName }
        if ($lock -lt 0) { throw 'Another database setup is running. Wait for it to finish, then launch again.' }
        $exists = Invoke-StudentSql $connection 'SELECT COUNT(*) FROM sys.databases WHERE name=@name;' -Scalar -Parameters @{ '@name'=$Name }
        $created = $false
        if ($exists -eq 0) {
            Invoke-StudentSql $connection "CREATE DATABASE [$Name];"
            $created = $true
        }
        $connection.ChangeDatabase($Name)
        $tableCount = Invoke-StudentSql $connection 'SELECT COUNT(*) FROM sys.tables;' -Scalar
        $ownedEmpty = Invoke-StudentSql $connection "SELECT COUNT(*) FROM sys.extended_properties WHERE class=0 AND name='SequelDetectiveInstaller' AND CONVERT(nvarchar(80),value)='student-install-v1';" -Scalar
        if ($created) {
            Invoke-StudentSql $connection "EXEC sys.sp_addextendedproperty @name=N'SequelDetectiveInstaller',@value=N'student-install-v1';"
            $ownedEmpty = 1
        }
        $mode = 'current'; $backupPath = $null
        if ($tableCount -eq 0 -and $ownedEmpty -eq 1) {
            $objects=Invoke-StudentSql $connection 'SELECT COUNT(*) FROM sys.objects WHERE is_ms_shipped=0;' -Scalar
            if($objects -ne 0){throw 'Installer-marked database is not empty. No automatic repair was performed.'}
            $mode = 'fresh'
        }
        else {
            $knownTables = Invoke-StudentSql $connection "SELECT COUNT(*) FROM sys.tables WHERE schema_id=SCHEMA_ID('dbo') AND name IN ('CrimeType','CrimeSceneReport','DriversLicense','PersonsOfInterest','EventSchedule','EventRegistration','FitNFlabClub','FitNFlabClubCheckIn','Employment','InterviewLog','Solution','AppSchemaVersion','CaseAnswerKey');" -Scalar
            if ($knownTables -ne 13) { throw 'Unrecognized existing database. Automatic setup made no changes.' }
            Assert-StudentEvidence $connection
            $appExists = Invoke-StudentSql $connection "SELECT COUNT(*) FROM sys.schemas WHERE name='app';" -Scalar
            if ($appExists -eq 0) {
                $roles = Invoke-StudentSql $connection "SELECT COUNT(*) FROM sys.database_principals WHERE name IN ('sequel_learner','sequel_repository');" -Scalar
                if ($roles -ne 0) { throw 'Partial runtime installation is not a supported upgrade target.' }
                $mode = 'legacy'
            } else {
                Assert-StudentRuntimeShape $connection -AllowV1
                $extensionMarker = Invoke-StudentSql $connection "SELECT COUNT(*) FROM dbo.AppSchemaVersion WHERE MigrationKey='case-runtime-v2';" -Scalar
                if ($extensionMarker -eq 0) {
                    $extensionObjects = Invoke-StudentSql $connection "SELECT COUNT(*) FROM sys.tables WHERE schema_id=SCHEMA_ID('app') AND name IN ('CaseFactDefinition','CaseBriefingFact','CaseStepFactBinding','AttemptEvidenceItem');" -Scalar
                    if ($extensionObjects -ne 0) { throw 'Partial case extension is not a supported automatic upgrade target.' }
                    $mode = 'extension'
                } else { Assert-StudentRuntimeShape $connection }
            }
            if ($mode -in @('legacy','extension')) {
                $backupDirectory = Invoke-StudentSql $connection "SELECT CONVERT(nvarchar(4000),SERVERPROPERTY('InstanceDefaultBackupPath'));" -Scalar
                if (!$backupDirectory -or $backupDirectory -is [DBNull]) { throw 'SQL Server backup directory is unavailable. No upgrade was performed.' }
                $backupPath = Join-Path ([string]$backupDirectory) ("${Name}_before_runtime_" + [guid]::NewGuid().ToString('N') + '.bak')
                Invoke-StudentSql $connection "BACKUP DATABASE [$Name] TO DISK=@path WITH COPY_ONLY,CHECKSUM;" -Parameters @{ '@path'=$backupPath }
                Invoke-StudentSql $connection 'RESTORE VERIFYONLY FROM DISK=@path WITH CHECKSUM;' -Parameters @{ '@path'=$backupPath }
                Write-Host "Verified database backup retained: $backupPath"
            }
        }
        if ($mode -ne 'current') {
            $transaction = $connection.BeginTransaction()
            Invoke-StudentSql $connection 'SET XACT_ABORT ON;' $transaction
            $sections = if ($mode -eq 'fresh') { $fresh } elseif ($mode -eq 'extension') { $extensions } else { $runtime }
            foreach ($section in $sections) {
                foreach ($batch in [regex]::Split($section, '(?im)^[\t ]*GO[\t ]*(?:--[^\r\n]*)?\r?$')) {
                    if (![string]::IsNullOrWhiteSpace($batch)) { Invoke-StudentSql $connection $batch $transaction }
                }
            }
            Assert-StudentEvidence $connection $transaction
            Assert-StudentRuntimeShape $connection $transaction
            $transaction.Commit(); $transaction.Dispose(); $transaction = $null
        }
        Write-Host "Database setup verified ($mode)."
        return [pscustomobject]@{ Mode=$mode; BackupPath=$backupPath }
    } catch {
        if ($transaction) { try { $transaction.Rollback() } catch {} }
        # Retain claimed empty database for safe recovery; never DROP DATABASE.
        throw
    } finally {
        if ($transaction) { $transaction.Dispose() }
        $connection.Dispose()
    }
}

if (!$LibraryOnly) { Install-StudentDatabase $SqlHost $SqlPort $DatabaseName $ProjectRoot }
