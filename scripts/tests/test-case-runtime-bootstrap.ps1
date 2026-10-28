param(
 [ValidateSet('SequelCityRuntimeTest_Workspace')][string]$DatabaseName='SequelCityRuntimeTest_Workspace',
 [string]$SqlHost='localhost',[int]$SqlPort=1433,[switch]$RunBrowsers
)
$ErrorActionPreference='Stop'
. (Join-Path $PSScriptRoot 'single-test-database.ps1')
if($SqlHost -notin @('localhost','127.0.0.1','.') -or $SqlPort -ne 1433){throw 'Tests require the registered local SQL workspace.'}
if($env:SEQUEL_CITY_SINGLE_TEST_SESSION -ne 'active'){
 & (Join-Path $PSScriptRoot 'invoke-single-database-test.ps1') -Task Runtime -RunBrowsers:$RunBrowsers
 return
}
# The outer exclusive workspace session preserves/restores the registered preview.
# This inner runtime fixture still refuses an existing database.
$root=Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$master=[System.Data.SqlClient.SqlConnection]::new("Server=$SqlHost,$SqlPort;Database=master;Integrated Security=True;TrustServerCertificate=True;")
$master.Open()
function Run-Sql([System.Data.SqlClient.SqlConnection]$Connection,[string]$Text) {
 if($Connection.Database -notin @('master','SequelCityRuntimeTest_Workspace')){throw 'SQL test execution refused outside the registered workspace.'}
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
 # This newly owned fixture must not depend on an unavailable Windows domain
 # for existing EXECUTE AS OWNER manifests. Use the instance's built-in SQL
 # principal (SID 0x01), including instances where sa has been renamed.
 $fixtureOwner=[string](Scalar-Sql $master 'SELECT SUSER_SNAME(0x01)')
 if(!$fixtureOwner){throw 'Built-in SQL owner is unavailable for the disposable fixture.'}
 $quotedFixtureOwner='['+$fixtureOwner.Replace(']',']]')+']'
 Run-Sql $master "ALTER AUTHORIZATION ON DATABASE::[$DatabaseName] TO $quotedFixtureOwner;"
 . (Join-Path $root 'scripts/student-package/install-student-database.ps1') -SqlHost $SqlHost -SqlPort $SqlPort -DatabaseName $DatabaseName -ProjectRoot $root -LibraryOnly
 Assert-True ($DatabaseName -eq 'SequelCityRuntimeTest_Workspace') 'Fixture target changed while loading installer functions.'
 . (Join-Path $PSScriptRoot 'bootstrap-test-fixtures.ps1')
 $seed=[IO.File]::ReadAllText((Join-Path $root 'database/02-SequelCityCrimesDB - Insert Data.sql'))
 $caseContent=[regex]::Match($seed,'(?s)-- BEGIN CURRENT CASE-001 CONTENT.*?-- END CURRENT CASE-001 CONTENT').Value
 $caseInterviews=[regex]::Match($seed,'(?s)-- BEGIN CURRENT CASE 001 INTERVIEWS.*?-- END CURRENT CASE 001 INTERVIEWS').Value
 $caseAnswer=[regex]::Match($seed,'(?s)-- BEGIN CURRENT CASE 001 ANSWER(.*?)-- END CURRENT CASE 001 ANSWER').Groups[1].Value.Trim().TrimEnd(',')
 $reportDescription=[regex]::Match($seed,"\('20230502', '1080', ('(?:''|[^'])*'), 'Sequel City'\)").Groups[1].Value
 Assert-True (!!$caseContent -and !!$caseInterviews -and !!$caseAnswer -and !!$reportDescription) 'Current seed section missing.'
 $fullCaseSeed="DELETE i FROM dbo.InterviewLog i JOIN dbo.CrimeSceneReport r ON r.ReportID=i.ReportID WHERE r.ReportDate=20230502 AND r.ReportCity='Sequel City'; UPDATE dbo.CrimeSceneReport SET ReportDescription=$reportDescription WHERE ReportDate=20230502 AND ReportCity='Sequel City';`r`nGO`r`nSET IDENTITY_INSERT dbo.InterviewLog ON;`r`nGO`r`n"+$caseInterviews+"`r`nSET IDENTITY_INSERT dbo.InterviewLog OFF;`r`nGO`r`nINSERT dbo.CaseAnswerKey(CaseId,AnswerRole,PersonID,RevealOrder,SuccessVerdict) VALUES "+$caseAnswer+";`r`nGO`r`n"+$caseContent+"`r`nINSERT dbo.AppSchemaVersion(MigrationKey,AppliedBy,Notes) VALUES('case001-complete-v5',SUSER_SNAME(),'Owned current-evidence fixture switch');"
 foreach($phase in @('Current','Historical')){
  if($phase -eq 'Historical'){Reset-SingleTestFixture $master}
  $master.ChangeDatabase($DatabaseName)
  foreach ($file in @('01-SequelCityCrimesDB - Create DB.sql','02-SequelCityCrimesDB - Insert Data.sql','03-SequelCityCrimesDB - ForeignKeys.sql')) {
   $path=Join-Path $root "database/$file"
   $sql=if($phase -eq 'Current'){Get-StudentSqlSection $path FRESH}else{Get-HistoricalBootstrapSection $path Full}
   $batchNumber=0
   foreach($batch in [regex]::Split($sql,'(?im)^[\t ]*GO[\t ]*(?:--[^\r\n]*)?\r?$')){
    $batchNumber++
    if($batch.Trim()){try{Run-Sql $master $batch}catch{throw "$phase $file batch $batchNumber failed: $($_.Exception.Message)"}}
   }
   Write-Host "PASS: $phase $file"
  }
  if($phase -eq 'Current'){
   $baseline=Get-Content (Join-Path $PSScriptRoot 'fixtures/bootstrap-current-baseline.json') -Raw|ConvertFrom-Json
   foreach($table in $baseline.tables.PSObject.Properties){
    $name=$table.Name;$expected=$table.Value
    $hash=Scalar-Sql $master "SELECT CONVERT(varchar(64),HASHBYTES('SHA2_256',(SELECT * FROM dbo.[$name] ORDER BY $($expected.OrderBy) FOR JSON PATH,INCLUDE_NULL_VALUES)),2);"
    Assert-True ($hash -eq $expected.Sha256) "Current $name values/IDs differ from the pre-cleanup bootstrap."
    Assert-True ((Scalar-Sql $master "SELECT COUNT(*) FROM dbo.[$name];") -eq $expected.Count) "Current $name count changed."
   }
   Assert-True ((Scalar-Sql $master "SELECT CONVERT(int,IDENT_CURRENT('dbo.InterviewLog'));") -eq 7142) 'Current interview identity allocation changed.'
   Assert-True ((Scalar-Sql $master 'SELECT COUNT(*) FROM app.CaseDefinition;') -eq 2) 'Fresh bootstrap contains history or test cases.'
   Assert-True ((Scalar-Sql $master "SELECT COUNT(*) FROM app.CaseDefinition WHERE ReleaseStatus='released' AND ((CaseId='case-001' AND ContentVersion=3) OR (CaseId='case-004' AND ContentVersion=2));") -eq 2) 'Current live releases missing.'
   Assert-True ((Scalar-Sql $master 'SELECT COUNT(*) FROM app.CaseStep;') -eq 22) 'Unexpected current task definitions.'
   Assert-True ((Scalar-Sql $master 'EXEC app.CheckEvidenceManifest;') -eq 1) 'Current-only readiness manifest failed.'
   $currentContent=@{}
   foreach($table in @('CaseDefinition','CaseStep','CaseStepPrerequisite','CaseFactDefinition','CaseBriefingFact','CaseStepFactBinding')){
    $json=Scalar-Sql $master "SELECT (SELECT * FROM app.[$table] WHERE (CaseId='case-001' AND ContentVersion=3) OR (CaseId='case-004' AND ContentVersion=2) FOR JSON PATH,INCLUDE_NULL_VALUES);"
    $currentContent[$table]=@(ConvertFrom-Json $json)
   }
   $contentFile=Join-Path ([IO.Path]::GetTempPath()) ('sequel-bootstrap-content-'+[guid]::NewGuid().ToString('N')+'.json')
   try{
    [IO.File]::WriteAllText($contentFile,($currentContent|ConvertTo-Json -Depth 12))
    & node (Join-Path $PSScriptRoot 'check-bootstrap-authoring-baseline.mjs') $contentFile
    Assert-True ($LASTEXITCODE -eq 0) 'Current authored values differ from original bootstrap.'
   }finally{if(Test-Path -LiteralPath $contentFile){Remove-Item -LiteralPath $contentFile}}
   & (Join-Path $root 'scripts/student-package/setup-local-sql-accounts.ps1') -SqlHost $SqlHost -SqlPort $SqlPort -DatabaseName $DatabaseName -RuntimeLogin $learner -RuntimePassword $password -RepositoryLogin $repository -RepositoryPassword $password -SkipBootstrapAccount
   $priorCurrentUser=$env:SC_BOOTSTRAP_REPOSITORY_USER;$priorCurrentPassword=$env:SC_BOOTSTRAP_REPOSITORY_PASSWORD
   try{
    $env:SC_BOOTSTRAP_REPOSITORY_USER=$repository;$env:SC_BOOTSTRAP_REPOSITORY_PASSWORD=$password
    & node --import tsx (Join-Path $PSScriptRoot 'check-current-bootstrap-readiness.mjs')
    Assert-True ($LASTEXITCODE -eq 0) 'Current-only API readiness failed.'
   }finally{$env:SC_BOOTSTRAP_REPOSITORY_USER=$priorCurrentUser;$env:SC_BOOTSTRAP_REPOSITORY_PASSWORD=$priorCurrentPassword}
   Write-Host 'PASS: pre-cleanup hashes for all 11 public/answer tables, stable IDs, current-only releases and manifest.'
  }
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
 Assert-True ((Scalar-Sql $r 'SELECT COUNT(*) FROM app.CaseStep') -eq 39) 'Repository content read failed.'
 foreach ($sql in @('UPDATE app.CaseStep SET SamuelDirection=N''spoiler'' WHERE CaseId=''case-001''','SELECT * FROM dbo.CaseAnswerKey','CREATE TABLE app.IllegalWriter (id INT)')) {
  $denied=$false;try { Run-Sql $r $sql } catch { $denied=$true }; Assert-True $denied "Repository privilege too broad: $sql"
 }
 Run-Sql $r "EXEC dbo.VerifySuspectSubmission @Suspect=N'nobody';"
 Assert-True ((Scalar-Sql $r 'EXEC app.CheckEvidenceManifest') -eq 1) 'Evidence manifest failed.'
 Write-Host 'PASS: actual learner/repository logins, metadata, CTE/join/view/synonym, immutable content and verifier checks.'
 # API integration uses only credentials belonging to this disposable DB; no secret output.
 $names=@('SQLSERVER_HOST','SQLSERVER_PORT','SQLSERVER_DATABASE','SQLSERVER_USER','SQLSERVER_PASSWORD','SQLSERVER_APP_USER','SQLSERVER_APP_PASSWORD','SQLSERVER_BOOTSTRAP_USER','SQLSERVER_BOOTSTRAP_PASSWORD','CASE_RUNTIME_INTEGRATION','CASE_RUNTIME_SESSION_SECRET','CASE_RUNTIME_ALLOWED_ORIGINS','CASE_RUNTIME_BROWSER_TESTS')
 $saved=@{};foreach($name in $names){$saved[$name]=[Environment]::GetEnvironmentVariable($name)}
 try {
  $env:SQLSERVER_HOST=$SqlHost;$env:SQLSERVER_PORT="$SqlPort";$env:SQLSERVER_DATABASE=$DatabaseName
  $env:SQLSERVER_USER=$learner;$env:SQLSERVER_PASSWORD=$password
  $env:SQLSERVER_APP_USER=$repository;$env:SQLSERVER_APP_PASSWORD=$password
  $env:SQLSERVER_BOOTSTRAP_USER=$bootstrap;$env:SQLSERVER_BOOTSTRAP_PASSWORD=$password
  $env:CASE_RUNTIME_INTEGRATION='1'
  $env:CASE_RUNTIME_SESSION_SECRET=[guid]::NewGuid().ToString('N')+[guid]::NewGuid().ToString('N')
  $env:CASE_RUNTIME_ALLOWED_ORIGINS='http://127.0.0.1:4173,http://127.0.0.1:5173'
  $env:CASE_RUNTIME_BROWSER_TESTS=if($RunBrowsers){'1'}else{'0'}
  Push-Location (Join-Path $root 'apps/api')
  try { & node --import tsx src/repositories/caseRuntimeRepository.test.ts; if ($LASTEXITCODE -ne 0) {throw 'Live repository integration failed.'}; & node --import tsx src/services/caseAttemptService.test.ts; if ($LASTEXITCODE -ne 0) {throw 'Live durable attempt integration failed.'}; & node --import tsx src/services/case004ProgressionService.test.ts; if ($LASTEXITCODE -ne 0) {throw 'Live Case 004 progression integration failed.'}; foreach($batch in [regex]::Split($fullCaseSeed,'(?im)^[\t ]*GO[\t ]*(?:--[^\r\n]*)?\r?$')){if($batch.Trim()){Run-Sql $master $batch}}; & node --import tsx src/services/case001FullResolution.test.ts; if($LASTEXITCODE -ne 0){throw 'Full Case 001 SQL/API proof failed.'}; & node --import tsx src/services/caseRuntimeAuthoring.test.ts; if ($LASTEXITCODE -ne 0) {throw 'Live SQL authoring proof failed.'} } finally { Pop-Location }
 } finally { foreach($name in $names){[Environment]::SetEnvironmentVariable($name,$saved[$name])} }
 Write-Host 'PASS: disposable bootstrap and repository foundation.'
} finally {
 foreach($connection in $connections){$connection.Dispose()}
 [System.Data.SqlClient.SqlConnection]::ClearAllPools()
 if ($owned -and $DatabaseName -eq 'SequelCityRuntimeTest_Workspace') {
  Run-Sql $master "USE master; ALTER DATABASE [$DatabaseName] SET SINGLE_USER WITH ROLLBACK IMMEDIATE; DROP DATABASE [$DatabaseName];"
 }
 foreach($login in @($learner,$repository,$bootstrap)){Run-Sql $master "IF EXISTS (SELECT 1 FROM sys.sql_logins WHERE name=N'$login') DROP LOGIN [$login];"}
 $master.Dispose()
}
