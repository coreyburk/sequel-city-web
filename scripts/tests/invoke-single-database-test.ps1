[CmdletBinding()]
param([ValidateSet('Runtime','Launcher','RecoveryProbe','Refresh','Initialize')][string]$Task='Runtime',[switch]$RunBrowsers,[switch]$PackageLaunch,[switch]$ConnectionProbeOnly)
$ErrorActionPreference='Stop'
$root=Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
. (Join-Path $PSScriptRoot 'single-test-database.ps1')
if($Task -eq 'Initialize'){Initialize-SingleTestDatabase $root;return}
$lease=Open-SingleTestLease $root
$prior=$env:SEQUEL_CITY_SINGLE_TEST_SESSION
$priorLease=$global:SequelCitySingleTestLease
$global:SequelCitySingleTestLease=$lease
try{
    Start-SingleTestSession $lease
    $env:SEQUEL_CITY_SINGLE_TEST_SESSION='active'
    Reset-SingleTestFixture $lease.Connection -LeaveAbsent
    switch($Task){
        'Runtime' {& (Join-Path $PSScriptRoot 'test-case-runtime-bootstrap.ps1') -DatabaseName 'SequelCityRuntimeTest_Workspace' -RunBrowsers:$RunBrowsers}
        'Launcher' {& (Join-Path $PSScriptRoot 'test-student-launcher.ps1') -SqlIntegration -PackageLaunch:$PackageLaunch -ConnectionProbeOnly:$ConnectionProbeOnly}
        'Refresh' {
            . (Join-Path $root 'scripts/student-package/start-student-package.ps1') -LibraryOnly
            $null=Install-StudentDatabase $lease.Registration.SqlHost $lease.Registration.SqlPort 'SequelCityRuntimeTest_Workspace' $root
            Invoke-SingleTestSql $lease.Connection "EXEC [SequelCityRuntimeTest_Workspace].sys.sp_addextendedproperty @name=N'SequelCityTestWorkspaceOwner',@value=@owner;" @{'@owner'=$lease.Registration.OwnerId}
            $lease.Commit=$true
            Write-Output 'Refreshed the existing single workspace from authoritative scripts; previous state is in the one recovery backup.'
        }
        'RecoveryProbe' {
            Reset-SingleTestFixture $lease.Connection
            Invoke-SingleTestSql $lease.Connection 'CREATE TABLE dbo.WP302RecoveryProbe(id int); INSERT dbo.WP302RecoveryProbe VALUES(1);'
            throw 'WP302 intentional recovery probe failure.'
        }
    }
}finally{
    try{Close-SingleTestSession $lease}finally{$env:SEQUEL_CITY_SINGLE_TEST_SESSION=$prior;$global:SequelCitySingleTestLease=$priorLease}
}
