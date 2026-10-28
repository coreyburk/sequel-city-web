[CmdletBinding()]
param([switch]$SqlIntegration)
$ErrorActionPreference='Stop'
$root=Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
. (Join-Path $PSScriptRoot 'single-test-database.ps1')
function Assert-WorkspaceTest([bool]$Value,[string]$Message){if(!$Value){throw $Message}}
function Expect-WorkspaceFailure([scriptblock]$Action,[string]$Pattern){
    $failed=$false
    try{& $Action}catch{$failed=$true;if($_.Exception.Message -notmatch $Pattern){throw}}
    if(!$failed){throw "Expected rejection: $Pattern"}
}
foreach($name in @('single-test-database.ps1','invoke-single-database-test.ps1','test-case-runtime-bootstrap.ps1','test-student-launcher.ps1')){
    $errors=$null;$tokens=$null
    $null=[Management.Automation.Language.Parser]::ParseFile((Join-Path $PSScriptRoot $name),[ref]$tokens,[ref]$errors)
    Assert-WorkspaceTest ($errors.Count -eq 0) "PowerShell parser errors in $name"
}
Expect-WorkspaceFailure {& (Join-Path $PSScriptRoot 'test-case-runtime-bootstrap.ps1') -DatabaseName 'SequelCityCrimesDB'} 'ValidateSet|does not belong|not belong|not valid'
Expect-WorkspaceFailure {Reset-SingleTestFixture $null} 'exclusive workspace session'
$launcher=[IO.File]::ReadAllText((Join-Path $PSScriptRoot 'test-student-launcher.ps1'))
Assert-WorkspaceTest ($launcher -notmatch 'SequelCityRuntimeTest_(launch|legacy|unknown|city|v1|package)_\$suffix') 'Launcher still generates multiple fixture names.'
Write-Output 'PASS parser, classroom-target refusal, lease-required reset and fixed fixture-name checks.'
if(!$SqlIntegration){return}
$lease=Open-SingleTestLease $root
try{
    $before=[string](Invoke-SingleTestSql $lease.Connection "SELECT CONVERT(varchar(64),HASHBYTES('SHA2_256',(SELECT AttemptId,WorkspaceJson FROM [SequelCityRuntimeTest_Workspace].app.AttemptWorkspace ORDER BY AttemptId FOR JSON PATH,INCLUDE_NULL_VALUES)),2);" -Scalar)
    $classroom=[string](Invoke-SingleTestSql $lease.Connection "SELECT CONVERT(varchar(64),HASHBYTES('SHA2_256',(SELECT * FROM [SequelCityCrimesDB].dbo.AppSchemaVersion ORDER BY MigrationKey FOR JSON PATH,INCLUDE_NULL_VALUES)),2);" -Scalar)
    Expect-WorkspaceFailure {$second=Open-SingleTestLease $root;$second.Connection.Dispose()} 'Another single-database'
    $wrong=$lease.Registration.PSObject.Copy();$wrong.OwnerId='00000000000000000000000000000000'
    Expect-WorkspaceFailure {Assert-SingleTestOwner $lease.Connection $wrong} 'does not match'
    $original=${function:Invoke-SingleTestSql}
    try{
        function Invoke-SingleTestSql {return 1}
        Expect-WorkspaceFailure {Assert-SingleTestInventory $lease.Connection} 'Additional Sequel City test databases'
    }finally{Set-Item Function:Invoke-SingleTestSql $original}
}finally{$lease.Connection.Dispose()}
Expect-WorkspaceFailure {& (Join-Path $PSScriptRoot 'invoke-single-database-test.ps1') -Task RecoveryProbe} 'intentional recovery probe failure'
$lease=Open-SingleTestLease $root
try{
    $after=[string](Invoke-SingleTestSql $lease.Connection "SELECT CONVERT(varchar(64),HASHBYTES('SHA2_256',(SELECT AttemptId,WorkspaceJson FROM [SequelCityRuntimeTest_Workspace].app.AttemptWorkspace ORDER BY AttemptId FOR JSON PATH,INCLUDE_NULL_VALUES)),2);" -Scalar)
    Assert-WorkspaceTest ($before -eq $after) 'Preview workspace changed after failure recovery.'
    $classroomAfter=[string](Invoke-SingleTestSql $lease.Connection "SELECT CONVERT(varchar(64),HASHBYTES('SHA2_256',(SELECT * FROM [SequelCityCrimesDB].dbo.AppSchemaVersion ORDER BY MigrationKey FOR JSON PATH,INCLUDE_NULL_VALUES)),2);" -Scalar)
    Assert-WorkspaceTest ($classroom -eq $classroomAfter) 'Classroom schema markers changed.'
    Assert-WorkspaceTest ((Invoke-SingleTestSql $lease.Connection "SELECT COUNT(*) FROM [SequelCityRuntimeTest_Workspace].sys.tables WHERE name=N'WP302RecoveryProbe';" -Scalar) -eq 0) 'Failed test fixture was not removed by restore.'
    Assert-SingleTestOwner $lease.Connection $lease.Registration
}finally{$lease.Connection.Dispose()}
Write-Output 'PASS real SQL lock contention, ownership mismatch, second-clone refusal, failure recovery, retained preview workspace and unchanged classroom markers.'
