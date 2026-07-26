param()

$ErrorActionPreference = 'Stop'

$scriptRoot = Split-Path -Path $PSScriptRoot -Parent
$repoRoot = Split-Path -Path $scriptRoot -Parent
$studentPackageRoot = Join-Path $scriptRoot 'student-package'
$tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ('sequel-student-package-shim-test-' + [guid]::NewGuid().ToString('N'))

$commands = @(
    [pscustomobject]@{
        Name = 'build-student-tester-package.ps1'
        Parameters = @('OutputRoot', 'NoZip')
    },
    [pscustomobject]@{
        Name = 'start-student-package.ps1'
        Parameters = @('SqlHost', 'SqlPort', 'DatabaseName', 'SqlUser', 'SqlPassword', 'PromptForDatabaseSettings', 'ResetEnvironment')
    },
    [pscustomobject]@{
        Name = 'setup-local-sql-accounts.ps1'
        Parameters = @('SqlHost', 'SqlPort', 'DatabaseName', 'RuntimeLogin', 'RuntimePassword', 'BootstrapLogin', 'BootstrapPassword')
    }
)

function Assert-Equal {
    param(
        [Parameter(Mandatory = $true)][AllowNull()][object]$Actual,
        [Parameter(Mandatory = $true)][AllowNull()][object]$Expected,
        [Parameter(Mandatory = $true)][string]$Message
    )

    if ($Actual -ne $Expected) {
        throw "$Message Expected '$Expected' but got '$Actual'."
    }
}

function Assert-True {
    param(
        [Parameter(Mandatory = $true)][bool]$Condition,
        [Parameter(Mandatory = $true)][string]$Message
    )

    if (-not $Condition) {
        throw $Message
    }
}

function Assert-ContainsText {
    param(
        [Parameter(Mandatory = $true)][string]$Text,
        [Parameter(Mandatory = $true)][string]$Pattern,
        [Parameter(Mandatory = $true)][string]$Message
    )

    if ($Text -notmatch $Pattern) {
        throw $Message
    }
}

function Assert-PathExists {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][string]$Message
    )

    if (-not (Test-Path -LiteralPath $Path -PathType Leaf)) {
        throw $Message
    }
}

function Get-ScriptAst {
    param([Parameter(Mandatory = $true)][string]$Path)

    $parseErrors = $null
    $tokens = $null
    $ast = [System.Management.Automation.Language.Parser]::ParseFile($Path, [ref]$tokens, [ref]$parseErrors)
    if ($parseErrors -and $parseErrors.Count -gt 0) {
        $formattedErrors = $parseErrors | ForEach-Object { $_.Message } | Out-String
        throw "$Path has parse errors:`n$formattedErrors"
    }

    return $ast
}

function Get-ParamMetadata {
    param([Parameter(Mandatory = $true)][string]$Path)

    $ast = Get-ScriptAst -Path $Path
    $metadata = @{}

    foreach ($parameterAst in $ast.ParamBlock.Parameters) {
        $name = $parameterAst.Name.VariablePath.UserPath
        $default = $null
        if ($parameterAst.DefaultValue) {
            $default = $parameterAst.DefaultValue.Extent.Text
        }

        $typeName = $null
        if ($parameterAst.StaticType) {
            $typeName = $parameterAst.StaticType.FullName
        }

        $metadata[$name] = [pscustomobject]@{
            TypeName = $typeName
            Default = $default
        }
    }

    return $metadata
}

function Assert-ParameterCompatibility {
    param(
        [Parameter(Mandatory = $true)][string]$TopLevelPath,
        [Parameter(Mandatory = $true)][string]$ImplementationPath,
        [Parameter(Mandatory = $true)][string[]]$ExpectedParameters
    )

    $topLevelParams = Get-ParamMetadata -Path $TopLevelPath
    $implementationParams = Get-ParamMetadata -Path $ImplementationPath

    Assert-Equal -Actual $topLevelParams.Count -Expected $ExpectedParameters.Count -Message "$TopLevelPath public parameter count changed."
    Assert-Equal -Actual $implementationParams.Count -Expected $ExpectedParameters.Count -Message "$ImplementationPath public parameter count changed."

    foreach ($parameterName in $ExpectedParameters) {
        Assert-True -Condition $topLevelParams.ContainsKey($parameterName) -Message "$TopLevelPath is missing parameter $parameterName."
        Assert-True -Condition $implementationParams.ContainsKey($parameterName) -Message "$ImplementationPath is missing parameter $parameterName."
        Assert-Equal -Actual $topLevelParams[$parameterName].TypeName -Expected $implementationParams[$parameterName].TypeName -Message "$parameterName type differs between shim and implementation."
        Assert-Equal -Actual $topLevelParams[$parameterName].Default -Expected $implementationParams[$parameterName].Default -Message "$parameterName default differs between shim and implementation."
    }
}

function Invoke-ExpectFailure {
    param([Parameter(Mandatory = $true)][string[]]$Arguments)

    $previousErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        $output = & powershell @Arguments 2>&1 | Out-String
        return [pscustomobject]@{
            ExitCode = $LASTEXITCODE
            Output = $output
        }
    } finally {
        $ErrorActionPreference = $previousErrorActionPreference
    }
}

try {
    foreach ($command in $commands) {
        $topLevelPath = Join-Path $scriptRoot $command.Name
        $implementationPath = Join-Path $studentPackageRoot $command.Name

        Assert-PathExists -Path $topLevelPath -Message "Missing top-level compatibility shim: $topLevelPath"
        Assert-PathExists -Path $implementationPath -Message "Missing student-package implementation: $implementationPath"

        Get-ScriptAst -Path $topLevelPath | Out-Null
        Get-ScriptAst -Path $implementationPath | Out-Null

        $topLevelSource = Get-Content -LiteralPath $topLevelPath -Raw
        Assert-ContainsText -Text $topLevelSource -Pattern ([regex]::Escape("student-package/$($command.Name)")) -Message "$($command.Name) shim does not delegate to scripts/student-package."
        Assert-ContainsText -Text $topLevelSource -Pattern '@PSBoundParameters' -Message "$($command.Name) shim does not forward bound parameters."

        Assert-ParameterCompatibility -TopLevelPath $topLevelPath -ImplementationPath $implementationPath -ExpectedParameters $command.Parameters
    }

    $safeFailure = Invoke-ExpectFailure -Arguments @(
        '-NoProfile',
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        (Join-Path $scriptRoot 'setup-local-sql-accounts.ps1'),
        '-DatabaseName',
        'invalid-name'
    )
    Assert-True -Condition ($safeFailure.ExitCode -ne 0) -Message 'Invalid SQL identifier should fail through the top-level shim.'
    Assert-ContainsText -Text $safeFailure.Output -Pattern 'DatabaseName contains unsupported characters' -Message 'Invalid SQL identifier failure did not propagate expected error text.'

    New-Item -ItemType Directory -Force -Path $tempRoot | Out-Null
    $buildOutput = & powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $scriptRoot 'build-student-tester-package.ps1') -OutputRoot $tempRoot -NoZip 2>&1 | Out-String
    Assert-Equal -Actual $LASTEXITCODE -Expected 0 -Message "Package build through top-level shim failed. Output: $buildOutput"

    $packageRoot = Get-ChildItem -LiteralPath $tempRoot -Directory |
        Where-Object { $_.Name -like 'sequel-detective-student-tester-*' } |
        Select-Object -First 1
    Assert-True -Condition ($null -ne $packageRoot) -Message 'Package build did not create a staging directory.'

    foreach ($relativePath in @(
        'scripts/build-student-tester-package.ps1',
        'scripts/start-student-package.ps1',
        'scripts/setup-local-sql-accounts.ps1',
        'scripts/student-package/build-student-tester-package.ps1',
        'scripts/student-package/start-student-package.ps1',
        'scripts/student-package/setup-local-sql-accounts.ps1'
    )) {
        Assert-PathExists -Path (Join-Path $packageRoot.FullName $relativePath) -Message "Package is missing required script: $relativePath"
    }

    $packagedTopLevelScripts = @(Get-ChildItem -LiteralPath (Join-Path $packageRoot.FullName 'scripts') -File -Filter '*.ps1' | Select-Object -ExpandProperty Name)
    Assert-Equal -Actual $packagedTopLevelScripts.Count -Expected 3 -Message 'Package should include only the three public top-level student-package shims.'

    Write-Host 'Student package script shim tests passed.'
}
finally {
    if (Test-Path -LiteralPath $tempRoot) {
        Remove-Item -LiteralPath $tempRoot -Recurse -Force
    }
}
