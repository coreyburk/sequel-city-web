param(
    [string]$SqlHost = "localhost",
    [int]$SqlPort = 1433,
    [string]$DatabaseName = "SequelCityCrimesDB",
    [string]$RuntimeLogin = "sequel_web_user",
    [string]$RuntimePassword = "SQL-Web-PasSW0rd!",
    [string]$BootstrapLogin = "sequel_bootstrap_user",
    [string]$BootstrapPassword = "SQL-Bootstrap-PasSW0rd!"
)

$ErrorActionPreference = "Stop"

function Assert-SafeSqlIdentifier {
    param(
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)][string]$Value
    )

    if ($Value -notmatch '^[A-Za-z_][A-Za-z0-9_]*$') {
        throw "$Name contains unsupported characters for this setup script."
    }
}

function Escape-SqlLiteral {
    param([Parameter(Mandatory = $true)][string]$Value)

    return $Value.Replace("'", "''")
}

Assert-SafeSqlIdentifier -Name "DatabaseName" -Value $DatabaseName
Assert-SafeSqlIdentifier -Name "RuntimeLogin" -Value $RuntimeLogin
Assert-SafeSqlIdentifier -Name "BootstrapLogin" -Value $BootstrapLogin

$escapedRuntimePassword = Escape-SqlLiteral $RuntimePassword
$escapedBootstrapPassword = Escape-SqlLiteral $BootstrapPassword

$sqlBatch = @"
USE [master];

IF DB_ID(N'$DatabaseName') IS NULL
BEGIN
    THROW 51000, 'The SequelCityCrimesDB database does not exist. Create or restore it before running account setup.', 1;
END;

IF NOT EXISTS (
    SELECT 1
    FROM sys.sql_logins
    WHERE name = N'$RuntimeLogin'
)
BEGIN
    CREATE LOGIN [$RuntimeLogin]
    WITH PASSWORD = N'$escapedRuntimePassword';
END;

IF NOT EXISTS (
    SELECT 1
    FROM sys.sql_logins
    WHERE name = N'$BootstrapLogin'
)
BEGIN
    CREATE LOGIN [$BootstrapLogin]
    WITH PASSWORD = N'$escapedBootstrapPassword';
END;

USE [$DatabaseName];

IF DATABASE_PRINCIPAL_ID(N'$RuntimeLogin') IS NULL
BEGIN
    CREATE USER [$RuntimeLogin]
    FOR LOGIN [$RuntimeLogin];
END;

IF NOT EXISTS (
    SELECT 1
    FROM sys.database_role_members AS drm
    INNER JOIN sys.database_principals AS rolePrincipal
        ON rolePrincipal.principal_id = drm.role_principal_id
    INNER JOIN sys.database_principals AS memberPrincipal
        ON memberPrincipal.principal_id = drm.member_principal_id
    WHERE rolePrincipal.name = N'db_datareader'
        AND memberPrincipal.name = N'$RuntimeLogin'
)
BEGIN
    ALTER ROLE [db_datareader]
    ADD MEMBER [$RuntimeLogin];
END;

IF DATABASE_PRINCIPAL_ID(N'$BootstrapLogin') IS NULL
BEGIN
    CREATE USER [$BootstrapLogin]
    FOR LOGIN [$BootstrapLogin];
END;

IF NOT EXISTS (
    SELECT 1
    FROM sys.database_role_members AS drm
    INNER JOIN sys.database_principals AS rolePrincipal
        ON rolePrincipal.principal_id = drm.role_principal_id
    INNER JOIN sys.database_principals AS memberPrincipal
        ON memberPrincipal.principal_id = drm.member_principal_id
    WHERE rolePrincipal.name = N'db_owner'
        AND memberPrincipal.name = N'$BootstrapLogin'
)
BEGIN
    ALTER ROLE [db_owner]
    ADD MEMBER [$BootstrapLogin];
END;
"@

$connectionString = "Server=$SqlHost,$SqlPort;Database=master;Integrated Security=True;TrustServerCertificate=True;"
$connection = New-Object System.Data.SqlClient.SqlConnection $connectionString

try {
    $connection.Open()
    $command = $connection.CreateCommand()
    $command.CommandTimeout = 120
    $command.CommandText = $sqlBatch
    $null = $command.ExecuteNonQuery()
    Write-Host "Sequel City SQL accounts are ready for $DatabaseName."
} finally {
    $connection.Dispose()
}
