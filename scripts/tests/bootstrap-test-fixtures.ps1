# Test-only historical assembly. Current production data is always read from database/.
# The caller must hold the registered exclusive workspace lease before executing SQL.
function Get-HistoricalBootstrapSection([string]$Path, [ValidateSet('Legacy','Foundation','PreCity','Full')][string]$Stage='Full') {
    $root=Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
    $file=[IO.Path]::GetFileName($Path)
    $text=Get-StudentSqlSection $Path FRESH
    $migration=[IO.File]::ReadAllText((Join-Path $root "scripts/student-package/migrations/$file"))
    $runtime=[regex]::Match($migration,'(?s)-- BEGIN STUDENT RUNTIME INSTALL.*?-- END STUDENT RUNTIME INSTALL').Value
    if(!$runtime){throw 'Historical runtime section missing.'}
    $runtime=[regex]::Replace($runtime,'(?s)-- BEGIN COMPATIBLE CASE 001 COMPLETE CONTENT.*?-- END COMPATIBLE CASE 001 COMPLETE CONTENT','')
    if($Stage -eq 'Legacy'){$runtime=''}
    elseif($Stage -eq 'Foundation'){$runtime=[regex]::Replace($runtime,'(?s)-- BEGIN STUDENT CASE EXTENSION INSTALL.*?-- END STUDENT CASE EXTENSION INSTALL','')}
    elseif($Stage -eq 'PreCity'){
        if($file.StartsWith('01-')){
            # The shipped pre-city schema had this manifest with the older city
            # predicate; it did not yet require the canonical spelling/count.
            $runtime=[regex]::Replace($runtime,'(?s)-- BEGIN STUDENT CITY NAME INSTALL.*?-- END STUDENT CITY NAME INSTALL',{
                param($m)
                $old=$m.Value.Replace("ReportCity='Sequel City'","ReportCity='SQL City'")
                $old=[regex]::Replace($old,"(?m)^ AND NOT EXISTS .*?\r?$",'')
                $old=[regex]::Replace($old,"(?m)^ AND \(SELECT COUNT\(\*\) FROM dbo.CrimeSceneReport WHERE ReportCity='SQL City'.*?=16\r?$",'')
                return $old
            })
        }else{$runtime=[regex]::Replace($runtime,'(?s)-- BEGIN STUDENT CITY NAME INSTALL.*?-- END STUDENT CITY NAME INSTALL','')}
    }
    $text=[regex]::Replace($text,'(?s)-- BEGIN STUDENT RUNTIME INSTALL.*?-- END STUDENT RUNTIME INSTALL',[System.Text.RegularExpressions.MatchEvaluator]{param($m) $runtime})
    if($file.StartsWith('02-')){
        $text=[regex]::Replace($text,'(?s)-- BEGIN CURRENT CASE 001 INTERVIEWS.*?-- END CURRENT CASE 001 INTERVIEWS','')
        $text=[regex]::Replace($text,'(?s)[ \t]*-- BEGIN CURRENT CASE 001 ANSWER.*?-- END CURRENT CASE 001 ANSWER','')
        $text += "`r`n"+[IO.File]::ReadAllText((Join-Path $root 'apps/api/src/services/fixtures/case001-legacy-evidence.sql'))
        if($Stage -ne 'Legacy'){$text += "`r`n"+[IO.File]::ReadAllText((Join-Path $root 'scripts/tests/fixtures/database-history.sql'))}
    }
    return $text
}
