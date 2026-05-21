/***************************************************
********   Sequel City Crimes Database		********
********		SQL Murder Mystery			********
********   Create Database and Tables		********
****************************************************

Original Concept by:
NUKhight Lab SQL Mystery
https://github.com/NUKnightLab/sql-mysteries

Heavily modified and updated by:
Corey Burk
BSIS Chair 
Neumont College of Computer Science
v1: 2025


1) Run the Create Database script
2) Run the Insert Data script
3) Run the Alter Tables script
*/


---------------------
-- Create Database --
---------------------

USE master
GO

-- Drop SequelCityCrimesDB if it exists
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'SequelCityCrimesDB')
BEGIN
    ALTER DATABASE SequelCityCrimesDB 
	SET SINGLE_USER WITH ROLLBACK IMMEDIATE
    DROP DATABASE SequelCityCrimesDB
END
GO

DROP DATABASE IF EXISTS SequelCityCrimesDB
GO

CREATE DATABASE SequelCityCrimesDB
GO

USE SequelCityCrimesDB
GO


-------------------
-- Create Tables --
-------------------

-- Table: Crime_Type
CREATE TABLE CrimeType
(
	CrimeID INT IDENTITY(1005,15) NOT NULL PRIMARY KEY,
	CrimeType VARCHAR(30) NOT NULL,
	CrimeDescription VARCHAR(500) NULL
)


-- Table: Crime_Scene_Report
CREATE TABLE CrimeSceneReport 
(
    ReportID INT IDENTITY(10001,1) NOT NULL PRIMARY KEY,
	CrimeID INT NOT NULL,  -- Foreign Key: CrimeType(CrimeID)
	ReportDate INT NULL,
    ReportDescription VARCHAR(400) NULL,
    ReportCity VARCHAR(20) NULL
)
GO

-- Table: Drivers_License
CREATE TABLE DriversLicense 
(
    LicenseID INT NOT NULL PRIMARY KEY,
    Age SMALLINT NULL,
    Height SMALLINT NULL,
    EyeColor VARCHAR(15) NULL,
    HairColor VARCHAR(15) NULL,
    Gender VARCHAR(15) NULL,
    PlateNumber VARCHAR(15) NULL,
    CarMake VARCHAR(25) NULL,
    CarModel VARCHAR(25) NULL
)
GO

-- Suspects and Witnesses
-- Table: PersonsofInterest
CREATE TABLE PersonsOfInterest 
(
    PersonID INT NOT NULL PRIMARY KEY,
    PersonName VARCHAR(50) NULL,
    LicenseID INT NULL,  -- Foreign Key: DriversLicense(LicenseID)
    AddressNumber SMALLINT NULL,
    AddressStreetName VARCHAR(50) NULL,
	AddressCity VARCHAR(50) NULL,
    SSN INT NULL  -- Foreign Key: Employment(SSN)
)
GO

-- Table: EventSchedule
CREATE TABLE EventSchedule
(
	EventID INT IDENTITY(1001,12) NOT NULL PRIMARY KEY,
	EventDate DATE NOT NULL,
	EventName VARCHAR(100) NULL
)

-- Table: Event_Registration
CREATE TABLE EventRegistration
(
    RegistrationID INT IDENTITY(101,1) NOT NULL PRIMARY KEY,
	EventID INT NULL,  -- Foreign Key: EventSchedule(EventID)
    EventPersonID INT NULL,  -- Foreign Key: Person(PersonID)
)
GO

-- The Fit N Flab Club
-- Table: FitNFlabClub
CREATE TABLE FitNFlabClub 
(
    FitMemberID VARCHAR(10) NOT NULL PRIMARY KEY,
    PersonID INT NULL,  -- Foreign Key: Person(PersonID)
    FitMembershipStartDate INT NULL,
    FitMembershipStatus VARCHAR(20) NULL
)
GO

-- Table: FitNFlabClubCheck_In
CREATE TABLE FitNFlabClubCheckIn
(
    FitCheckInID INT IDENTITY NOT NULL PRIMARY KEY,
	FitMemberID VARCHAR(10) NULL,  -- Foreign Key: FitNFlabClub(FitMemberID)
    FitCheckInDate INT NULL,
    FitCheckInTime INT NULL,
    FitCheckOutTime INT NULL
)
GO

-- Table: Employment
CREATE TABLE Employment 
(
    SSN INT NOT NULL PRIMARY KEY,
	JobTitle VARCHAR(75),
	CompanyName VARCHAR(75),
	AnnualIncome MONEY NULL
)
GO


-- Table: InterviewLog
CREATE TABLE InterviewLog
(
    LogID INT NOT NULL IDENTITY(1001,1) PRIMARY KEY,
	PersonID INT NOT NULL, -- Foreign Key: Person(PersonID)
    ReportID INT NOT NULL,  --Foreign Key: CrimeSceneReport(ReportID)
	LogTranscript VARCHAR(500) NULL
) 
GO





---------------------------------------
-- Create Solution Table and Trigger --
---------------------------------------
USE SequelCityCrimesDB
GO

-- Table: Solution

CREATE TABLE Solution 
(
    [Attempt] INT NOT NULL IDENTITY(0,1) PRIMARY KEY,	
    [Suspect] NVARCHAR(100) NULL,
	[Verdict] NVARCHAR(500) NULL
)
GO

CREATE TABLE AppSchemaVersion
(
	[MigrationKey] NVARCHAR(255) NOT NULL PRIMARY KEY,
	[AppliedAtUtc] DATETIME2(0) NOT NULL
		CONSTRAINT DF_AppSchemaVersion_AppliedAtUtc DEFAULT SYSUTCDATETIME(),
	[AppliedBy] NVARCHAR(255) NOT NULL,
	[Notes] NVARCHAR(500) NULL
)
GO

CREATE TABLE CaseAnswerKey
(
	[CaseId] NVARCHAR(50) NOT NULL,
	[AnswerRole] NVARCHAR(50) NOT NULL,
	[PersonID] INT NOT NULL,
	[RevealOrder] INT NOT NULL,
	[SuccessVerdict] NVARCHAR(500) NOT NULL,
	CONSTRAINT PK_CaseAnswerKey PRIMARY KEY ([CaseId], [AnswerRole]),
	CONSTRAINT UQ_CaseAnswerKey_RevealOrder UNIQUE ([CaseId], [RevealOrder]),
	CONSTRAINT UQ_CaseAnswerKey_PersonID UNIQUE ([CaseId], [PersonID])
)
GO


-- Trigger: CheckSuspect
DROP TRIGGER IF EXISTS [CheckSuspect]
GO

CREATE TRIGGER CheckSuspect ON [dbo].[solution]
	AFTER INSERT AS
	BEGIN
		DECLARE @suspect NVARCHAR(500),
			@caseId NVARCHAR(50),
			@suspectPersonId INT,
			@verdict NVARCHAR(500),
			@incorrect VARCHAR(100)

		SET NOCOUNT ON
		SET @caseId = 'case-004'
		SET @incorrect= 'Great guess, but that is not the right suspect. Try again!'


		SELECT @suspect = Suspect
		FROM INSERTED
		
		SELECT @suspectPersonId = poi.PersonID
		FROM PersonsOfInterest AS poi
		WHERE poi.PersonName = @suspect

		SELECT @verdict = cak.SuccessVerdict
		FROM CaseAnswerKey AS cak
		WHERE cak.CaseId = @caseId
			AND cak.PersonID = @suspectPersonId

		INSERT INTO Solution (Suspect, Verdict)
		VALUES (
			@suspect,
			COALESCE(@verdict, @incorrect)
		)
	END
GO		

DROP PROCEDURE IF EXISTS [dbo].[VerifySuspectSubmission]
GO

IF DATABASE_PRINCIPAL_ID('solution_verifier') IS NULL
BEGIN
	CREATE USER [solution_verifier] WITHOUT LOGIN
END
GO

GRANT INSERT, SELECT ON [dbo].[Solution] TO [solution_verifier]
GRANT SELECT ON [dbo].[CaseAnswerKey] TO [solution_verifier]
GRANT SELECT ON [dbo].[PersonsOfInterest] TO [solution_verifier]
GO

CREATE PROCEDURE [dbo].[VerifySuspectSubmission]
	@Suspect NVARCHAR(100)
WITH EXECUTE AS 'solution_verifier'
AS
BEGIN
	SET NOCOUNT ON

	DECLARE @caseId NVARCHAR(50)
	SET @caseId = 'case-004'

	INSERT INTO Solution (Suspect)
	VALUES (@Suspect)

	SELECT TOP (1)
		solutionResult.Suspect,
		solutionResult.Verdict,
		@caseId AS CaseId,
		CAST(CASE WHEN answerKey.PersonID IS NULL THEN 0 ELSE 1 END AS BIT) AS IsCorrect,
		answerKey.AnswerRole AS SolvedRole,
		CASE
			WHEN answerKey.AnswerRole = 'trigger_man' THEN 'mastermind'
			WHEN answerKey.AnswerRole = 'mastermind' THEN 'closed'
			ELSE NULL
		END AS NextRole,
		personLookup.PersonID AS SuspectPersonId
	FROM Solution AS solutionResult
	OUTER APPLY (
		SELECT TOP (1) poi.PersonID
		FROM PersonsOfInterest AS poi
		WHERE poi.PersonName = @Suspect
	) AS personLookup
	LEFT JOIN CaseAnswerKey AS answerKey
		ON answerKey.CaseId = @caseId
		AND answerKey.PersonID = personLookup.PersonID
	WHERE solutionResult.Suspect = @Suspect
		AND solutionResult.Verdict IS NOT NULL
	ORDER BY Attempt DESC
END
GO

IF DATABASE_PRINCIPAL_ID('sequel_web_user') IS NOT NULL
BEGIN
	GRANT EXECUTE ON [dbo].[VerifySuspectSubmission] TO [sequel_web_user]
END
GO


/* 
-- Use the follow two queries to determine if your suspect is the killer:

-- Insert your suspect:
	INSERT INTO solution (suspect) VALUES ('Insert the full name of your suspect')
	Example:
		INSERT INTO solution (suspect) VALUES ('Joe Schmoe')

-- Determine if your suspicion is correct:
	SELECT suspect, verdict FROM solution

*/


