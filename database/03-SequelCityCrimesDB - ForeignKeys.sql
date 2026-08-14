/***************************************************
********   Sequel City Crimes Database		********
********		SQL Murder Mystery			********
********	  Foreign Key Constraints		********
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


/*
**********************************************************
****  RUN ALTER TABLES LAST -  AFTER DATA INSERTION   ****
**********************************************************
*/

-------------------------------------------------
-- Alter Tables to add Foreign Key Constraints --
-------------------------------------------------

USE SequelCityCrimesDB
GO


-- Alter Tables to add Foreign Key Constraints

-- CrimeSceneReport
ALTER TABLE CrimeSceneReport WITH NOCHECK
	ADD CONSTRAINT FK_CrimeSceneReport_Crimes
    FOREIGN KEY (CrimeID)
    REFERENCES CrimeType(CrimeID)
GO

-- PersonsOfInterest
ALTER TABLE PersonsOfInterest WITH NOCHECK
	ADD CONSTRAINT FK_PersonsOfInterest_DriversLicense
    FOREIGN KEY (LicenseID)
    REFERENCES DriversLicense(LicenseID)
GO

-- PersonsOfInterest
ALTER TABLE PersonsOfInterest WITH NOCHECK
	ADD CONSTRAINT FK_PersonsOfInterest_Employment
    FOREIGN KEY (SSN)
    REFERENCES Employment(SSN)
GO

-- InterviewLog
ALTER TABLE InterviewLog
    ADD CONSTRAINT FK_InterviewLog_Person
	FOREIGN KEY (PersonID)
    REFERENCES PersonsOfInterest(PersonID)
GO

-- InterviewLog
ALTER TABLE InterviewLog
    ADD CONSTRAINT FK_InterviewLog_CrimeSceneReport
    FOREIGN KEY (ReportID)
    REFERENCES CrimeSceneReport(ReportID)
GO

-- EventRegistration
ALTER TABLE EventRegistration WITH NOCHECK
    ADD CONSTRAINT FK_EventRegistration_Person
	FOREIGN KEY (EventPersonID)
    REFERENCES PersonsOfInterest(PersonID) 
GO

-- EventRegistration
ALTER TABLE EventRegistration WITH NOCHECK
    ADD CONSTRAINT FK_EventRegistration_EventSchedule
	FOREIGN KEY (EventID)
    REFERENCES EventSchedule(EventID) 

-- FitNFlabClubCheckIn 
ALTER TABLE FitNFlabClubCheckIn 
    ADD CONSTRAINT FK_FitNFlabClubCheckIn_FitNFlabClub
    FOREIGN KEY (FitMemberID)
    REFERENCES FitNFlabClub(FitMemberID) 
GO

-- FitNFlabClub
ALTER TABLE FitNFlabClub
    ADD CONSTRAINT FK_FitNFlabClub_Person
    FOREIGN KEY (PersonID)
    REFERENCES PersonsOfInterest(PersonID)
GO

-- CaseAnswerKey
ALTER TABLE CaseAnswerKey WITH NOCHECK
	ADD CONSTRAINT FK_CaseAnswerKey_PersonsOfInterest
	FOREIGN KEY (PersonID)
	REFERENCES PersonsOfInterest(PersonID)
GO

MERGE dbo.AppSchemaVersion AS target
USING (
	VALUES
		(N'2026-05-21-001-create-case-answer-key-table.sql'),
		(N'2026-05-21-002-seed-case-answer-key-case-004.sql'),
		(N'2026-05-21-003-add-case-answer-key-foreign-key.sql'),
		(N'2026-05-21-004-create-solution-verifier-user.sql'),
		(N'2026-05-21-005-create-case-verification-objects.sql'),
		(N'2026-08-14-001-seed-case-001-clocktower-report.sql')
) AS source (MigrationKey)
	ON target.MigrationKey = source.MigrationKey
WHEN NOT MATCHED THEN
	INSERT (MigrationKey, AppliedBy, Notes)
	VALUES (source.MigrationKey, COALESCE(SUSER_SNAME(), USER_NAME()), N'Applied by full database bootstrap scripts.');
GO

IF DATABASE_PRINCIPAL_ID('sequel_web_user') IS NOT NULL
BEGIN
	GRANT SELECT ON [dbo].[AppSchemaVersion] TO [sequel_web_user]
END
GO







