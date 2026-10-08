param(
 [Parameter(Mandatory=$true)][ValidatePattern('^SequelCityRuntimeTest_[A-Za-z0-9_]+$')][string]$DatabaseName,
 [string]$SqlHost='localhost',[int]$SqlPort=1433
)
$ErrorActionPreference='Stop'
# Only a newly owned test database may be built or dropped; never an existing DB.
$root=Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$master=[System.Data.SqlClient.SqlConnection]::new("Server=$SqlHost,$SqlPort;Database=master;Integrated Security=True;TrustServerCertificate=True;")
$master.Open()
function Run-Sql([System.Data.SqlClient.SqlConnection]$Connection,[string]$Text) {
 $command=$Connection.CreateCommand(); $command.CommandTimeout=180; $command.CommandText=$Text
 try { $null=$command.ExecuteNonQuery() } finally { $command.Dispose() }
}
function Scalar-Sql([System.Data.SqlClient.SqlConnection]$Connection,[string]$Text) {
 $command=$Connection.CreateCommand(); $command.CommandTimeout=60; $command.CommandText=$Text
 try { return $command.ExecuteScalar() } finally { $command.Dispose() }
}
function Assert-True([bool]$Condition,[string]$Message) { if (!$Condition) { throw $Message } }
$exists=Scalar-Sql $master "SELECT COUNT(*) FROM sys.databases WHERE name=N'$DatabaseName'"
if ($exists -ne 0) { $master.Dispose(); throw 'Refusing to rebuild an existing database; supply a new disposable name.' }
$owned=$false
$suffix=[guid]::NewGuid().ToString('N')
$learner="sc_test_l_$suffix"; $repository="sc_test_r_$suffix"; $bootstrap="sc_test_b_$suffix"
$password='Sc_Test!'+[guid]::NewGuid().ToString('N')
$connections=@()
try {
 # Claim ownership atomically. If another process wins this name, CREATE fails
 # and cleanup never drops its database. Do not run the live rebuild preamble.
 Run-Sql $master "CREATE DATABASE [$DatabaseName];"
 $owned=$true
 foreach ($file in @('01-SequelCityCrimesDB - Create DB.sql','02-SequelCityCrimesDB - Insert Data.sql','03-SequelCityCrimesDB - ForeignKeys.sql')) {
  $sql=[IO.File]::ReadAllText((Join-Path $root ('database/'+$file)))
  $sql=$sql.Replace('SequelCityCrimesDB',$DatabaseName)
  if ($file -eq '01-SequelCityCrimesDB - Create DB.sql') {
   $tablesMarker=$sql.IndexOf('-- Create Tables --')
   if ($tablesMarker -lt 0) { throw 'Unknown creation-script shape; refusing destructive preamble.' }
   $sql="USE [$DatabaseName]"+[Environment]::NewLine+'GO'+[Environment]::NewLine+$sql.Substring($tablesMarker)
  }
  $analyzedSql=[regex]::Replace($sql,'(?s)/\*.*?\*/|(?m)--[^\r\n]*','')
  if ($analyzedSql -match '(?i)\b(?:CREATE|DROP|ALTER)\s+DATABASE\b') { throw 'Database-level DDL is forbidden after claiming the disposable target.' }
  if ($sql.Contains('SequelCityCrimesDB')) { throw 'Canonical database reference remained in disposable batch.' }
  $batchNumber=0
  foreach ($batch in [regex]::Split($sql,'(?im)^[\t ]*GO[\t ]*(?:--[^\r\n]*)?\r?$')) {
   $batchNumber++
   if (![string]::IsNullOrWhiteSpace($batch)) {
    try { Run-Sql $master $batch } catch { throw "$file batch $batchNumber failed: $($_.Exception.Message)" }
   }
  }
  Write-Host "PASS: $file"
 }
 & (Join-Path $root 'scripts/student-package/setup-local-sql-accounts.ps1') -SqlHost $SqlHost -SqlPort $SqlPort -DatabaseName $DatabaseName -RuntimeLogin $learner -RuntimePassword $password -RepositoryLogin $repository -RepositoryPassword $password -BootstrapLogin $bootstrap -BootstrapPassword $password
 # Repeated setup must remain bounded and idempotent.
 & (Join-Path $root 'scripts/student-package/setup-local-sql-accounts.ps1') -SqlHost $SqlHost -SqlPort $SqlPort -DatabaseName $DatabaseName -RuntimeLogin $learner -RuntimePassword $password -RepositoryLogin $repository -RepositoryPassword $password -BootstrapLogin $bootstrap -BootstrapPassword $password
 $l=[System.Data.SqlClient.SqlConnection]::new("Server=$SqlHost,$SqlPort;Database=$DatabaseName;User ID=$learner;Password=$password;TrustServerCertificate=True;")
 $r=[System.Data.SqlClient.SqlConnection]::new("Server=$SqlHost,$SqlPort;Database=$DatabaseName;User ID=$repository;Password=$password;TrustServerCertificate=True;")
 $l.Open();$r.Open();$connections=@($l,$r)
 Assert-True ((Scalar-Sql $l 'SELECT COUNT(*) FROM dbo.CrimeType') -gt 0) 'Learner evidence SELECT failed.'
 foreach ($sql in @(
  'SELECT * FROM app.CaseDefinition','SELECT * FROM app.LearnerAttempt',
  'SELECT * FROM dbo.CaseAnswerKey','SELECT * FROM dbo.Solution',
  'SELECT * FROM dbo.AppSchemaVersion','SELECT * FROM sys.tables',
  'SELECT * FROM sys.objects','SELECT * FROM sys.columns','SELECT * FROM sys.schemas',
  'SELECT * FROM sys.sql_modules',
  'WITH q AS (SELECT * FROM app.CaseStep) SELECT * FROM q',
  'SELECT c.* FROM dbo.CrimeType c JOIN app.CaseStep s ON 1=1',
  'SELECT * FROM dbo.CrimeType,app.CaseDefinition',
  'EXEC dbo.VerifySuspectSubmission @Suspect=N''nobody''',
  'INSERT dbo.Solution(Suspect) VALUES (N''nobody'')'
 )) {
  $denied=$false;try { Run-Sql $l $sql } catch { $denied=$true }
  Assert-True $denied "Learner access unexpectedly allowed: $sql"
 }
 Run-Sql $master "USE [$DatabaseName];"
 Run-Sql $master "CREATE VIEW dbo.InternalLeak AS SELECT * FROM app.CaseStep;"
 $denied=$false;try { Run-Sql $l 'SELECT * FROM dbo.InternalLeak' } catch { $denied=$true }; Assert-True $denied 'Internal view exposed.'
 Run-Sql $master "CREATE SYNONYM dbo.InternalAlias FOR app.CaseDefinition;"
 $denied=$false;try { Run-Sql $l 'SELECT * FROM dbo.InternalAlias' } catch { $denied=$true }; Assert-True $denied 'Internal synonym exposed.'
 Assert-True ((Scalar-Sql $l "SELECT IS_ROLEMEMBER('db_datareader')") -eq 0) 'Learner retained broad reader membership.'
 Assert-True ((Scalar-Sql $l "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='app' OR TABLE_NAME IN ('CaseAnswerKey','Solution','AppSchemaVersion')") -eq 0) 'Internal table metadata leaked.'
 Assert-True ((Scalar-Sql $l "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='app' OR TABLE_NAME IN ('CaseAnswerKey','Solution','AppSchemaVersion')") -eq 0) 'Internal column metadata leaked.'
 Assert-True ((Scalar-Sql $l "SELECT OBJECT_DEFINITION(OBJECT_ID('app.ProtectReleasedStep'))") -is [DBNull]) 'Definition leaked.'
 Assert-True ((Scalar-Sql $r 'SELECT COUNT(*) FROM app.CaseStep') -eq 4) 'Repository content read failed.'
 foreach ($sql in @('UPDATE app.CaseStep SET SamuelDirection=N''spoiler'' WHERE CaseId=''case-001''','SELECT * FROM dbo.CaseAnswerKey','CREATE TABLE app.IllegalWriter (id INT)')) {
  $denied=$false;try { Run-Sql $r $sql } catch { $denied=$true }; Assert-True $denied "Repository privilege too broad: $sql"
 }
 Run-Sql $r "EXEC dbo.VerifySuspectSubmission @Suspect=N'nobody';"
 Assert-True ((Scalar-Sql $r 'EXEC app.CheckEvidenceManifest') -eq 1) 'Evidence manifest failed.'
 Write-Host 'PASS: actual learner/repository logins, metadata, CTE/join/view/synonym, immutable content and verifier checks.'
 # API integration uses only credentials belonging to this disposable DB; no secret output.
 $names=@('SQLSERVER_HOST','SQLSERVER_PORT','SQLSERVER_DATABASE','SQLSERVER_USER','SQLSERVER_PASSWORD','SQLSERVER_APP_USER','SQLSERVER_APP_PASSWORD','SQLSERVER_BOOTSTRAP_USER','SQLSERVER_BOOTSTRAP_PASSWORD','CASE_RUNTIME_INTEGRATION')
 $saved=@{};foreach($name in $names){$saved[$name]=[Environment]::GetEnvironmentVariable($name)}
 try {
  $env:SQLSERVER_HOST=$SqlHost;$env:SQLSERVER_PORT="$SqlPort";$env:SQLSERVER_DATABASE=$DatabaseName
  $env:SQLSERVER_USER=$learner;$env:SQLSERVER_PASSWORD=$password
  $env:SQLSERVER_APP_USER=$repository;$env:SQLSERVER_APP_PASSWORD=$password
  $env:SQLSERVER_BOOTSTRAP_USER=$bootstrap;$env:SQLSERVER_BOOTSTRAP_PASSWORD=$password
  $env:CASE_RUNTIME_INTEGRATION='1'
  Push-Location (Join-Path $root 'apps/api')
  try { & node --import tsx src/repositories/caseRuntimeRepository.test.ts; if ($LASTEXITCODE -ne 0) {throw 'Live repository integration failed.'} } finally { Pop-Location }
 } finally { foreach($name in $names){[Environment]::SetEnvironmentVariable($name,$saved[$name])} }
 Write-Host 'PASS: disposable bootstrap and repository foundation.'
} finally {
 foreach($connection in $connections){$connection.Dispose()}
 [System.Data.SqlClient.SqlConnection]::ClearAllPools()
 if ($owned -and $DatabaseName -match '^SequelCityRuntimeTest_[A-Za-z0-9_]+$') {
  Run-Sql $master "USE master; ALTER DATABASE [$DatabaseName] SET SINGLE_USER WITH ROLLBACK IMMEDIATE; DROP DATABASE [$DatabaseName];"
 }
 foreach($login in @($learner,$repository,$bootstrap)){Run-Sql $master "IF EXISTS (SELECT 1 FROM sys.sql_logins WHERE name=N'$login') DROP LOGIN [$login];"}
 $master.Dispose()
}
