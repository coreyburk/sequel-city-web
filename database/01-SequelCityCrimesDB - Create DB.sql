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
Neumont University
Bootstrap script version: 2.0
Last updated: 2026-10-08
Changes: Protected case repository, versioned case content, and durable learner attempts.
This header describes the scripts; installed database readiness is checked separately.


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

EXEC(N'
CREATE TRIGGER CheckSuspect ON [dbo].[solution]
	AFTER INSERT AS
	BEGIN
		DECLARE @suspect NVARCHAR(500),
			@caseId NVARCHAR(50),
			@suspectPersonId INT,
			@verdict NVARCHAR(500),
			@incorrect VARCHAR(100)

		SET NOCOUNT ON
		SET @caseId = N''case-004''
		SET @incorrect = N''Great guess, but that is not the right suspect. Try again!''


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
')
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

EXEC(N'
CREATE PROCEDURE [dbo].[VerifySuspectSubmission]
	@Suspect NVARCHAR(100)
WITH EXECUTE AS ''solution_verifier''
AS
BEGIN
	SET NOCOUNT ON

	DECLARE @caseId NVARCHAR(50)
	SET @caseId = N''case-004''

	INSERT INTO Solution (Suspect)
	VALUES (@Suspect)

	SELECT TOP (1)
		solutionResult.Suspect,
		solutionResult.Verdict,
		@caseId AS CaseId,
		CAST(CASE WHEN answerKey.PersonID IS NULL THEN 0 ELSE 1 END AS BIT) AS IsCorrect,
		answerKey.AnswerRole AS SolvedRole,
		CASE
			WHEN answerKey.AnswerRole = N''trigger_man'' THEN N''mastermind''
			WHEN answerKey.AnswerRole = N''mastermind'' THEN N''closed''
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
	ORDER BY solutionResult.Attempt DESC
END
')
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



-- WP-287: protected runtime foundation.
CREATE SCHEMA app AUTHORIZATION dbo;
GO
CREATE ROLE sequel_learner AUTHORIZATION dbo;
CREATE ROLE sequel_repository AUTHORIZATION dbo;
GO
CREATE TABLE app.CaseDefinition (
 CaseId NVARCHAR(50) NOT NULL, ContentVersion INT NOT NULL CHECK (ContentVersion>0),
 Title NVARCHAR(200) NOT NULL, Dossier NVARCHAR(2000) NOT NULL, WholeCaseObjective NVARCHAR(1000) NOT NULL,
 EntryStepKey NVARCHAR(80) NOT NULL, EvidenceVersion NVARCHAR(80) NOT NULL,
 CompletionScope NVARCHAR(40) NOT NULL CHECK (CompletionScope IN ('evidence-review','full-resolution')),
 ReleaseStatus NVARCHAR(20) NOT NULL CHECK (ReleaseStatus IN ('draft','released','retired')),
 CONSTRAINT PK_CaseDefinition PRIMARY KEY (CaseId,ContentVersion)
);
CREATE TABLE app.CaseStep (
 CaseId NVARCHAR(50) NOT NULL, ContentVersion INT NOT NULL, StepKey NVARCHAR(80) NOT NULL,
 DisplayOrder INT NOT NULL CHECK (DisplayOrder>=0), TaskTitle NVARCHAR(200) NOT NULL,
 StepObjective NVARCHAR(1000) NOT NULL, SamuelDirection NVARCHAR(2000) NOT NULL,
 Hint NVARCHAR(2000) NULL, StarterSql NVARCHAR(4000) NULL,
 CompletionMode NVARCHAR(10) NOT NULL CHECK (CompletionMode IN ('query','log','verify')),
 ValidatorKey NVARCHAR(80) NOT NULL, ValidatorParametersJson NVARCHAR(4000) NOT NULL CHECK (ISJSON(ValidatorParametersJson)=1),
 CONSTRAINT PK_CaseStep PRIMARY KEY (CaseId,ContentVersion,StepKey),
 CONSTRAINT UQ_CaseStep_Order UNIQUE (CaseId,ContentVersion,DisplayOrder)
);
CREATE TABLE app.CaseStepPrerequisite (
 CaseId NVARCHAR(50) NOT NULL, ContentVersion INT NOT NULL, StepKey NVARCHAR(80) NOT NULL, RequiredStepKey NVARCHAR(80) NOT NULL,
 CONSTRAINT PK_CaseStepPrerequisite PRIMARY KEY (CaseId,ContentVersion,StepKey,RequiredStepKey),
 CONSTRAINT CK_Prerequisite_Distinct CHECK (StepKey<>RequiredStepKey)
);
CREATE TABLE app.LocalLearner (
 OwnerId UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, CapabilityHash BINARY(32) NOT NULL UNIQUE,
 CreatedAtUtc DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(), LastSeenAtUtc DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);
CREATE TABLE app.LearnerAttempt (
 AttemptId UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, OwnerId UNIQUEIDENTIFIER NOT NULL,
 CaseId NVARCHAR(50) NOT NULL, ContentVersion INT NOT NULL, EvidenceVersion NVARCHAR(80) NOT NULL,
 Status NVARCHAR(20) NOT NULL CHECK (Status IN ('active','completed','archived','incompatible')),
 ArchivedFromStatus NVARCHAR(20) NULL,
 Revision BIGINT NOT NULL DEFAULT 0 CHECK (Revision>=0),
 CreatedAtUtc DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(), UpdatedAtUtc DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
 CONSTRAINT UQ_Attempt_Content UNIQUE (AttemptId,CaseId,ContentVersion),
 CONSTRAINT CK_Attempt_Archive CHECK ((Status='archived' AND ArchivedFromStatus IS NOT NULL AND ArchivedFromStatus IN ('active','completed')) OR (Status<>'archived' AND ArchivedFromStatus IS NULL))
);
-- WP-288: owner request outcomes survive attempt deletion for safe retries.
CREATE TABLE app.LearnerRequest (
 OwnerId UNIQUEIDENTIFIER NOT NULL, RequestId UNIQUEIDENTIFIER NOT NULL,
 RequestDigest BINARY(32) NOT NULL, OutcomeJson NVARCHAR(MAX) NOT NULL
 CHECK (ISJSON(OutcomeJson)=1 AND DATALENGTH(OutcomeJson)<=262144),
 CreatedAtUtc DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
 CONSTRAINT PK_LearnerRequest PRIMARY KEY (OwnerId,RequestId)
);
CREATE UNIQUE INDEX UX_Attempt_Active ON app.LearnerAttempt (OwnerId,CaseId) WHERE Status='active';
CREATE INDEX IX_Attempt_OwnerCase ON app.LearnerAttempt (OwnerId,CaseId,UpdatedAtUtc);
CREATE TABLE app.AttemptWorkspace (
 AttemptId UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
 WorkspaceJson NVARCHAR(MAX) NOT NULL CHECK (ISJSON(WorkspaceJson)=1 AND DATALENGTH(WorkspaceJson)<=262144)
);
CREATE TABLE app.AttemptAction (
 ActionId UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, AttemptId UNIQUEIDENTIFIER NOT NULL, RequestId UNIQUEIDENTIFIER NOT NULL,
 ActionKind NVARCHAR(10) NOT NULL CHECK (ActionKind IN ('query','log','verify')),
 RequestDigest BINARY(32) NOT NULL, PrerequisiteRevision BIGINT NOT NULL CHECK (PrerequisiteRevision>=0),
 SqlOrSubmission NVARCHAR(MAX) NOT NULL CHECK (DATALENGTH(SqlOrSubmission)<=32768),
 ValidatorResult NVARCHAR(200) NOT NULL, ProofJson NVARCHAR(MAX) NOT NULL CHECK (ISJSON(ProofJson)=1 AND DATALENGTH(ProofJson)<=65536),
 CreatedAtUtc DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(), ExpiresAtUtc DATETIME2 NULL,
 CONSTRAINT UQ_Action_Request UNIQUE (AttemptId,RequestId),
 CONSTRAINT UQ_Action_Ownership UNIQUE (AttemptId,ActionId)
);
CREATE INDEX IX_Action_Expiry ON app.AttemptAction (AttemptId,ExpiresAtUtc);
CREATE TABLE app.AttemptStepEvidence (
 AttemptId UNIQUEIDENTIFIER NOT NULL, StepKey NVARCHAR(80) NOT NULL, CaseId NVARCHAR(50) NOT NULL, ContentVersion INT NOT NULL,
 ActionId UNIQUEIDENTIFIER NOT NULL, ValidatorVersion INT NOT NULL CHECK (ValidatorVersion>0),
 ProofJson NVARCHAR(MAX) NOT NULL CHECK (ISJSON(ProofJson)=1 AND DATALENGTH(ProofJson)<=65536),
 EvaluatedAtUtc DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
 CONSTRAINT PK_AttemptStepEvidence PRIMARY KEY (AttemptId,StepKey)
);
GO
CREATE TRIGGER app.ProtectReleasedDefinition ON app.CaseDefinition AFTER UPDATE, DELETE AS
BEGIN
 IF EXISTS (SELECT 1 FROM deleted WHERE ReleaseStatus='released')
  THROW 51001, 'Released content is immutable; publish a new version.', 1;
END;
GO
CREATE TRIGGER app.ProtectReleasedStep ON app.CaseStep AFTER INSERT, UPDATE, DELETE AS
BEGIN
 IF EXISTS (SELECT 1 FROM (SELECT CaseId,ContentVersion FROM inserted UNION SELECT CaseId,ContentVersion FROM deleted) x
 JOIN app.CaseDefinition d ON d.CaseId=x.CaseId AND d.ContentVersion=x.ContentVersion WHERE d.ReleaseStatus='released')
  THROW 51001, 'Released steps are immutable; publish a new version.', 1;
END;
GO
CREATE TRIGGER app.ProtectReleasedPrerequisite ON app.CaseStepPrerequisite AFTER INSERT, UPDATE, DELETE AS
BEGIN
 IF EXISTS (SELECT 1 FROM (SELECT CaseId,ContentVersion FROM inserted UNION SELECT CaseId,ContentVersion FROM deleted) x
 JOIN app.CaseDefinition d ON d.CaseId=x.CaseId AND d.ContentVersion=x.ContentVersion WHERE d.ReleaseStatus='released')
  THROW 51001, 'Released prerequisites are immutable; publish a new version.', 1;
END;
GO
CREATE PROCEDURE app.GetLegacyCaseRoleCounts WITH EXECUTE AS OWNER AS
 SELECT SUM(CASE WHEN AnswerRole IN ('trigger_man','mastermind') THEN 1 ELSE 0 END) expectedRoleCount,
 SUM(CASE WHEN AnswerRole NOT IN ('trigger_man','mastermind') THEN 1 ELSE 0 END) unexpectedRoleCount
 FROM dbo.CaseAnswerKey WHERE CaseId='case-004';
GO
CREATE PROCEDURE app.CheckEvidenceManifest WITH EXECUTE AS OWNER AS
 SELECT CASE WHEN EXISTS (SELECT 1 FROM dbo.CrimeType WHERE CrimeID=1080 AND CrimeType='Murder')
 AND (SELECT COUNT(*) FROM dbo.CrimeSceneReport WHERE CrimeID=1080 AND ReportDate=20230502 AND ReportCity='Sequel City' AND ReportDescription LIKE '%clocktower%')=1
 AND (SELECT COUNT(DISTINCT i.PersonID) FROM dbo.InterviewLog i JOIN dbo.CrimeSceneReport r ON r.ReportID=i.ReportID WHERE r.ReportDate=20230502 AND r.ReportCity='Sequel City' AND r.ReportDescription LIKE '%clocktower%' AND i.PersonID IN (27590,50417,62764))=3
 THEN 1 ELSE 0 END evidenceMatches;
GO
