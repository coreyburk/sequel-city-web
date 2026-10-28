# One registered SQL test database shared by preview and all fixture runners.
# Dot-source only. Production installers never depend on this test helper.
$script:SingleTestDatabaseName='SequelCityRuntimeTest_Workspace'
function Get-SingleTestRegistration([string]$RepositoryRoot) {
    $gitDirectory=[string](& git -C $RepositoryRoot rev-parse --git-common-dir)
    if($LASTEXITCODE -ne 0){throw 'Cannot locate the registered test workspace.'}
    if(![IO.Path]::IsPathRooted($gitDirectory)){$gitDirectory=Join-Path $RepositoryRoot $gitDirectory}
    $path=Join-Path ([IO.Path]::GetFullPath($gitDirectory)) 'single-test-database.json'
    if(!(Test-Path -LiteralPath $path)){throw 'Single test database registration is missing. Initialize it explicitly; automatic per-run clone creation is disabled.'}
    $registration=Get-Content -LiteralPath $path -Raw|ConvertFrom-Json
    if($registration.DatabaseName -ne $script:SingleTestDatabaseName -or $registration.OwnerId -notmatch '^[a-f0-9]{32}$' -or $registration.SqlHost -notin @('localhost','127.0.0.1','.') -or [int]$registration.SqlPort -ne 1433){throw 'Invalid single test database registration.'}
    return $registration
}
function Invoke-SingleTestSql($Connection,[string]$Text,[hashtable]$Parameters=@{},[switch]$Scalar) {
    $command=$Connection.CreateCommand();$command.CommandText=$Text;$command.CommandTimeout=180
    try{
        foreach($key in $Parameters.Keys){$null=$command.Parameters.AddWithValue($key,$Parameters[$key])}
        if($Scalar){return $command.ExecuteScalar()}
        $null=$command.ExecuteNonQuery()
    }finally{$command.Dispose()}
}
function Assert-SingleTestInventory($Connection) {
    $other=Invoke-SingleTestSql $Connection "SELECT COUNT(*) FROM sys.databases WHERE name LIKE 'SequelCityRuntimeTest[_]%' AND name<>N'SequelCityRuntimeTest_Workspace';" -Scalar
    if($other -ne 0){throw 'Additional Sequel City test databases exist. Remove obsolete copies before using the single workspace.'}
}
function Assert-SingleTestOwner($Connection,$Registration) {
    Assert-SingleTestInventory $Connection
    $exists=Invoke-SingleTestSql $Connection "SELECT COUNT(*) FROM sys.databases WHERE name=N'SequelCityRuntimeTest_Workspace';" -Scalar
    if($exists -ne 1){throw 'Registered test database is missing. Recovery or explicit initialization is required.'}
    $owner=Invoke-SingleTestSql $Connection "SELECT CONVERT(nvarchar(128),value) FROM [SequelCityRuntimeTest_Workspace].sys.extended_properties WHERE class=0 AND name=N'SequelCityTestWorkspaceOwner';" -Scalar
    if($owner -ne $Registration.OwnerId){throw 'Database ownership registration does not match; refusing destructive test operations.'}
}
function Open-SingleTestLease([string]$RepositoryRoot) {
    $registration=Get-SingleTestRegistration $RepositoryRoot
    $connection=[Data.SqlClient.SqlConnection]::new("Server=$($registration.SqlHost),$($registration.SqlPort);Database=master;Integrated Security=True;TrustServerCertificate=True;Pooling=False;")
    try{
        $connection.Open()
        $locked=Invoke-SingleTestSql $connection "DECLARE @r int;EXEC @r=sys.sp_getapplock @Resource=N'SequelCityWeb:SingleTestWorkspace',@LockMode='Exclusive',@LockOwner='Session',@LockTimeout=0;SELECT @r;" -Scalar
        if($locked -lt 0){throw 'Another single-database test or preview operation is running.'}
        Assert-SingleTestOwner $connection $registration
        return [pscustomobject]@{Connection=$connection;Registration=$registration;BackedUp=$false;BackupPath=$null;PreviewWasRunning=$false;Restored=$false;Commit=$false}
    }catch{$connection.Dispose();throw}
}
function Assert-SingleTestPreviewAvailable([string]$RepositoryRoot) {
    $lease=Open-SingleTestLease $RepositoryRoot
    try {Assert-SingleTestOwner $lease.Connection $lease.Registration}finally{$lease.Connection.Dispose()}
}
function Start-SingleTestSession($Lease) {
    $state=[string]$Lease.Registration.PreviewStatePath
    $expected=Join-Path ([IO.Path]::GetFullPath($Lease.Registration.RepositoryRoot)) '.git/wp300-preview'
    if([IO.Path]::GetFullPath($state) -ne [IO.Path]::GetFullPath($expected)){throw 'Unexpected preview state directory.'}
    $processPath=Join-Path $state 'processes.json'
    if(Test-Path -LiteralPath $processPath){
        $record=Get-Content -LiteralPath $processPath -Raw|ConvertFrom-Json
        if(Get-Process -Id $record.ApiProcessId -ErrorAction SilentlyContinue){
            & (Join-Path $state 'stop.ps1')
            $Lease.PreviewWasRunning=$true
        }
    }
    Assert-SingleTestOwner $Lease.Connection $Lease.Registration
    $directory=[string](Invoke-SingleTestSql $Lease.Connection "SELECT CONVERT(nvarchar(4000),SERVERPROPERTY('InstanceDefaultBackupPath'));" -Scalar)
    if(!$directory -or ![IO.Path]::IsPathRooted($directory)){throw 'SQL Server backup directory is unavailable.'}
    $Lease.BackupPath=Join-Path $directory 'SequelCityRuntimeTest_Workspace_recovery.bak'
    Invoke-SingleTestSql $Lease.Connection 'BACKUP DATABASE [SequelCityRuntimeTest_Workspace] TO DISK=@path WITH COPY_ONLY,INIT,CHECKSUM;' @{'@path'=$Lease.BackupPath}
    Invoke-SingleTestSql $Lease.Connection 'RESTORE VERIFYONLY FROM DISK=@path WITH CHECKSUM;' @{'@path'=$Lease.BackupPath}
    $Lease.BackedUp=$true
}
function Reset-SingleTestFixture($Connection,[switch]$LeaveAbsent) {
    if($env:SEQUEL_CITY_SINGLE_TEST_SESSION -ne 'active' -or !$global:SequelCitySingleTestLease -or $global:SequelCitySingleTestLease.Connection.State -ne 'Open'){throw 'Fixture reset requires the registered exclusive workspace session.'}
    $global:SequelCitySingleTestLease.Connection.ChangeDatabase('master')
    $mode=Invoke-SingleTestSql $global:SequelCitySingleTestLease.Connection "SELECT APPLOCK_MODE(N'public',N'SequelCityWeb:SingleTestWorkspace',N'Session');" -Scalar
    if($mode -ne 'Exclusive'){throw 'Fixture reset requires the registered exclusive workspace session.'}
    $Connection.ChangeDatabase('master')
    Assert-SingleTestInventory $Connection
    Invoke-SingleTestSql $Connection "IF DB_ID(N'SequelCityRuntimeTest_Workspace') IS NOT NULL BEGIN ALTER DATABASE [SequelCityRuntimeTest_Workspace] SET SINGLE_USER WITH ROLLBACK IMMEDIATE; DROP DATABASE [SequelCityRuntimeTest_Workspace]; END;"
    if(!$LeaveAbsent){
        Invoke-SingleTestSql $Connection 'CREATE DATABASE [SequelCityRuntimeTest_Workspace];'
        $owner=[string](Invoke-SingleTestSql $Connection 'SELECT SUSER_SNAME(0x01);' -Scalar)
        if(!$owner){throw 'SQL owner unavailable for test fixture.'}
        $quoted='['+$owner.Replace(']',']]')+']'
        Invoke-SingleTestSql $Connection "ALTER AUTHORIZATION ON DATABASE::[SequelCityRuntimeTest_Workspace] TO $quoted;"
        $Connection.ChangeDatabase($script:SingleTestDatabaseName)
    }
}
function Close-SingleTestSession($Lease) {
    $restored=$false
    try{
        if($Lease.BackedUp -and !$Lease.Commit){
            $Lease.Connection.ChangeDatabase('master')
            Assert-SingleTestInventory $Lease.Connection
            Invoke-SingleTestSql $Lease.Connection "IF DB_ID(N'SequelCityRuntimeTest_Workspace') IS NOT NULL BEGIN ALTER DATABASE [SequelCityRuntimeTest_Workspace] SET SINGLE_USER WITH ROLLBACK IMMEDIATE; DROP DATABASE [SequelCityRuntimeTest_Workspace]; END;"
            Invoke-SingleTestSql $Lease.Connection 'RESTORE DATABASE [SequelCityRuntimeTest_Workspace] FROM DISK=@path WITH REPLACE,CHECKSUM;' @{'@path'=$Lease.BackupPath}
            Invoke-SingleTestSql $Lease.Connection 'ALTER DATABASE [SequelCityRuntimeTest_Workspace] SET MULTI_USER;'
            Assert-SingleTestOwner $Lease.Connection $Lease.Registration
            $restored=$true;$Lease.Restored=$true
            try{Remove-SingleTestBackups $Lease.Connection}catch{Write-Warning ('Preview restored; fixture backup cleanup failed: '+$_.Exception.Message)}
        }
        elseif($Lease.Commit){Assert-SingleTestOwner $Lease.Connection $Lease.Registration;$restored=$true}
    }catch{throw "Test workspace recovery failed. Keep $($Lease.BackupPath) and registration for recovery. $($_.Exception.Message)"}
    finally{$Lease.Connection.Dispose()}
    if($Lease.PreviewWasRunning -and ($restored -or !$Lease.BackedUp)){& (Join-Path $Lease.Registration.PreviewStatePath 'start.ps1')}
}
function Remove-SingleTestBackups($Connection,[switch]$IncludeObsolete) {
    # Windows denies the developer account access to the SQL service backup folder.
    # Delete only exact, validated test-backup paths through the SQL service account.
    $root=[string](Invoke-SingleTestSql $Connection "SELECT CONVERT(nvarchar(4000),SERVERPROPERTY('InstanceDefaultBackupPath'));" -Scalar)
    $command=$Connection.CreateCommand();$command.CommandText="SELECT full_filesystem_path,file_or_directory_name FROM sys.dm_os_enumerate_filesystem(@root,N'SequelCityRuntimeTest_*.bak') WHERE is_directory=0;"
    $null=$command.Parameters.AddWithValue('@root',$root)
    try{$files=[Data.DataTable]::new();$files.Load($command.ExecuteReader())}finally{$command.Dispose()}
    $removed=0
    foreach($file in $files.Rows){
        $name=[string]$file.file_or_directory_name
        $pattern=if($IncludeObsolete){'^SequelCityRuntimeTest_[A-Za-z0-9_]+_before_runtime_[a-f0-9]{32}\.bak$'}else{'^SequelCityRuntimeTest_Workspace_before_runtime_[a-f0-9]{32}\.bak$'}
        if($name -notmatch $pattern){continue}
        $path=[IO.Path]::GetFullPath([string]$file.full_filesystem_path)
        if([IO.Path]::GetDirectoryName($path).TrimEnd('\') -ne [IO.Path]::GetFullPath($root).TrimEnd('\')){throw 'Backup cleanup escaped the SQL backup directory.'}
        $check=$Connection.CreateCommand();$check.CommandText='RESTORE HEADERONLY FROM DISK=@path;';$null=$check.Parameters.AddWithValue('@path',$path)
        try{$header=[Data.DataTable]::new();$header.Load($check.ExecuteReader())}finally{$check.Dispose()}
        if(!$header.Rows.Count -or @($header.Rows|Where-Object {[string]$_.DatabaseName -notmatch '^SequelCityRuntimeTest_[A-Za-z0-9_]+$'}).Count){throw 'Backup header is not owned by the Sequel City test namespace.'}
        Invoke-SingleTestSql $Connection 'EXEC master.sys.xp_delete_files @path;' @{'@path'=$path}
        $exists=Invoke-SingleTestSql $Connection 'SELECT file_exists FROM sys.dm_os_file_exists(@path);' @{'@path'=$path} -Scalar
        if($exists -ne 0){throw "Could not remove obsolete test backup: $name"}
        $removed++
    }
    Write-Output "Removed $removed obsolete test backup artifacts; retained the single workspace recovery backup."
}
function Initialize-SingleTestDatabase([string]$RepositoryRoot) {
    $common=[string](& git -C $RepositoryRoot rev-parse --git-common-dir)
    if($LASTEXITCODE -ne 0){throw 'Cannot locate Git common directory.'}
    if(![IO.Path]::IsPathRooted($common)){$common=Join-Path $RepositoryRoot $common}
    $registrationPath=Join-Path ([IO.Path]::GetFullPath($common)) 'single-test-database.json'
    if(Test-Path -LiteralPath $registrationPath){Assert-SingleTestPreviewAvailable $RepositoryRoot;Write-Output 'Single test workspace is already registered.';return}
    $connection=[Data.SqlClient.SqlConnection]::new('Server=localhost,1433;Database=master;Integrated Security=True;TrustServerCertificate=True;Pooling=False;');$connection.Open()
    try{
        $locked=Invoke-SingleTestSql $connection "DECLARE @r int;EXEC @r=sys.sp_getapplock @Resource=N'SequelCityWeb:SingleTestWorkspace',@LockMode='Exclusive',@LockOwner='Session',@LockTimeout=0;SELECT @r;" -Scalar
        if($locked -lt 0){throw 'Another single-database operation is running.'}
        $existing=Invoke-SingleTestSql $connection "SELECT COUNT(*) FROM sys.databases WHERE name LIKE 'SequelCityRuntimeTest[_]%';" -Scalar
        if($existing -ne 0){throw 'A test database already exists without this registration. Review/adopt it explicitly; no second clone will be created.'}
        . (Join-Path $RepositoryRoot 'scripts/student-package/start-student-package.ps1') -LibraryOnly
        $null=Install-StudentDatabase 'localhost' 1433 'SequelCityRuntimeTest_Workspace' $RepositoryRoot
        $owner=[guid]::NewGuid().ToString('N')
        Invoke-SingleTestSql $connection "EXEC [SequelCityRuntimeTest_Workspace].sys.sp_addextendedproperty @name=N'SequelCityTestWorkspaceOwner',@value=@owner;" @{'@owner'=$owner}
        $primary=Split-Path ([IO.Path]::GetFullPath($common)) -Parent
        @{DatabaseName='SequelCityRuntimeTest_Workspace';OwnerId=$owner;SqlHost='localhost';SqlPort=1433;RepositoryRoot=$primary;PreviewStatePath=(Join-Path $primary '.git/wp300-preview')}|ConvertTo-Json|Set-Content -LiteralPath $registrationPath
        Write-Output 'Initialized the one registered test database: SequelCityRuntimeTest_Workspace.'
    }finally{$connection.Dispose()}
}
