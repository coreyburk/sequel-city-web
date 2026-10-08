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
Neumont University
Bootstrap script version: 2.0
Last updated: 2026-10-08
Changes: Protected case repository, versioned case content, and durable learner attempts.
This header describes the scripts; installed database readiness is checked separately.


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








-- WP-287: checked relationships and bounded database roles.
ALTER TABLE app.CaseStep WITH CHECK ADD CONSTRAINT FK_Step_Definition FOREIGN KEY (CaseId,ContentVersion) REFERENCES app.CaseDefinition(CaseId,ContentVersion);
ALTER TABLE app.CaseDefinition WITH CHECK ADD CONSTRAINT FK_Definition_Entry FOREIGN KEY (CaseId,ContentVersion,EntryStepKey) REFERENCES app.CaseStep(CaseId,ContentVersion,StepKey);
ALTER TABLE app.CaseStepPrerequisite WITH CHECK ADD CONSTRAINT FK_Prerequisite_Step FOREIGN KEY (CaseId,ContentVersion,StepKey) REFERENCES app.CaseStep(CaseId,ContentVersion,StepKey);
ALTER TABLE app.CaseStepPrerequisite WITH CHECK ADD CONSTRAINT FK_Prerequisite_Required FOREIGN KEY (CaseId,ContentVersion,RequiredStepKey) REFERENCES app.CaseStep(CaseId,ContentVersion,StepKey);
ALTER TABLE app.LearnerAttempt WITH CHECK ADD CONSTRAINT FK_Attempt_Owner FOREIGN KEY (OwnerId) REFERENCES app.LocalLearner(OwnerId);
ALTER TABLE app.LearnerAttempt WITH CHECK ADD CONSTRAINT FK_Attempt_Content FOREIGN KEY (CaseId,ContentVersion) REFERENCES app.CaseDefinition(CaseId,ContentVersion);
ALTER TABLE app.AttemptWorkspace WITH CHECK ADD CONSTRAINT FK_Workspace_Attempt FOREIGN KEY (AttemptId) REFERENCES app.LearnerAttempt(AttemptId);
ALTER TABLE app.AttemptAction WITH CHECK ADD CONSTRAINT FK_Action_Attempt FOREIGN KEY (AttemptId) REFERENCES app.LearnerAttempt(AttemptId);
ALTER TABLE app.AttemptStepEvidence WITH CHECK ADD CONSTRAINT FK_Evidence_Attempt FOREIGN KEY (AttemptId,CaseId,ContentVersion) REFERENCES app.LearnerAttempt(AttemptId,CaseId,ContentVersion);
ALTER TABLE app.AttemptStepEvidence WITH CHECK ADD CONSTRAINT FK_Evidence_Step FOREIGN KEY (CaseId,ContentVersion,StepKey) REFERENCES app.CaseStep(CaseId,ContentVersion,StepKey);
ALTER TABLE app.AttemptStepEvidence WITH CHECK ADD CONSTRAINT FK_Evidence_Action FOREIGN KEY (AttemptId,ActionId) REFERENCES app.AttemptAction(AttemptId,ActionId);
GO
GRANT SELECT ON dbo.CrimeType TO sequel_learner;
GRANT SELECT ON dbo.CrimeSceneReport TO sequel_learner;
GRANT SELECT ON dbo.DriversLicense TO sequel_learner;
GRANT SELECT ON dbo.PersonsOfInterest TO sequel_learner;
GRANT SELECT ON dbo.EventSchedule TO sequel_learner;
GRANT SELECT ON dbo.EventRegistration TO sequel_learner;
GRANT SELECT ON dbo.FitNFlabClub TO sequel_learner;
GRANT SELECT ON dbo.FitNFlabClubCheckIn TO sequel_learner;
GRANT SELECT ON dbo.Employment TO sequel_learner;
GRANT SELECT ON dbo.InterviewLog TO sequel_learner;
DENY SELECT,INSERT,UPDATE,DELETE,EXECUTE ON SCHEMA::app TO sequel_learner;
DENY SELECT,INSERT,UPDATE,DELETE ON dbo.Solution TO sequel_learner;
DENY SELECT ON dbo.CaseAnswerKey TO sequel_learner;
DENY SELECT ON dbo.AppSchemaVersion TO sequel_learner;
DENY EXECUTE TO sequel_learner;
DENY VIEW DEFINITION TO sequel_learner;
DENY SELECT ON sys.objects TO sequel_learner;
DENY SELECT ON sys.tables TO sequel_learner;
DENY SELECT ON sys.columns TO sequel_learner;
DENY SELECT ON sys.sql_modules TO sequel_learner;
DENY SELECT ON sys.all_objects TO sequel_learner;
DENY SELECT ON sys.schemas TO sequel_learner;
-- INFORMATION_SCHEMA uses server-scoped system objects and cannot be denied
-- to a database role here. Permission-based visibility hides app/answer objects;
-- API SQL safety blocks all INFORMATION_SCHEMA access as defense in depth.
GRANT SELECT ON app.CaseDefinition TO sequel_repository;
GRANT SELECT ON app.CaseStep TO sequel_repository;
GRANT SELECT ON app.CaseStepPrerequisite TO sequel_repository;
GRANT SELECT,INSERT,UPDATE,DELETE ON app.LocalLearner TO sequel_repository;
GRANT SELECT,INSERT,UPDATE,DELETE ON app.LearnerAttempt TO sequel_repository;
GRANT SELECT,INSERT,UPDATE,DELETE ON app.AttemptWorkspace TO sequel_repository;
GRANT SELECT,INSERT,UPDATE,DELETE ON app.AttemptAction TO sequel_repository;
GRANT SELECT,INSERT,UPDATE,DELETE ON app.AttemptStepEvidence TO sequel_repository;
GRANT SELECT ON dbo.AppSchemaVersion TO sequel_repository;
GRANT VIEW DEFINITION TO sequel_repository;
GRANT EXECUTE ON app.GetLegacyCaseRoleCounts TO sequel_repository;
GRANT EXECUTE ON dbo.VerifySuspectSubmission TO sequel_repository;
DENY SELECT ON dbo.CaseAnswerKey TO sequel_repository;
DENY SELECT,INSERT,UPDATE,DELETE ON dbo.Solution TO sequel_repository;
GO
INSERT dbo.AppSchemaVersion (MigrationKey,AppliedBy,Notes)
VALUES ('case-runtime-v1',COALESCE(SUSER_SNAME(),USER_NAME()),'Protected foundation with sequel-evidence-v1 seed.');
GO
GRANT EXECUTE ON app.CheckEvidenceManifest TO sequel_repository;
GO
-- WP-288: owner-scoped idempotency includes deleted attempts.
ALTER TABLE app.LearnerRequest WITH CHECK ADD CONSTRAINT FK_Request_Owner FOREIGN KEY (OwnerId) REFERENCES app.LocalLearner(OwnerId);
GRANT SELECT,INSERT,UPDATE,DELETE ON app.LearnerRequest TO sequel_repository;
GO
