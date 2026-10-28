-- Recognized-installation compatibility only. Never used for fresh bootstrap.
-- Frozen upgrade sections extracted from the accepted pre-cleanup scripts.
-- The guarded installer owns recognition, verified backup and transaction safety.
-- BEGIN STUDENT RUNTIME INSTALL
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
-- BEGIN STUDENT CASE EXTENSION INSTALL
ALTER TABLE app.CaseFactDefinition WITH CHECK ADD CONSTRAINT FK_Fact_Definition FOREIGN KEY(CaseId,ContentVersion) REFERENCES app.CaseDefinition(CaseId,ContentVersion);
ALTER TABLE app.CaseBriefingFact WITH CHECK ADD CONSTRAINT FK_BriefingFact_Type FOREIGN KEY(CaseId,ContentVersion,FactKey,ValueType) REFERENCES app.CaseFactDefinition(CaseId,ContentVersion,FactKey,ValueType);
ALTER TABLE app.CaseStepFactBinding WITH CHECK ADD CONSTRAINT FK_Binding_Step FOREIGN KEY(CaseId,ContentVersion,StepKey) REFERENCES app.CaseStep(CaseId,ContentVersion,StepKey);
ALTER TABLE app.CaseStepFactBinding WITH CHECK ADD CONSTRAINT FK_Binding_Fact FOREIGN KEY(CaseId,ContentVersion,FactKey) REFERENCES app.CaseFactDefinition(CaseId,ContentVersion,FactKey);
ALTER TABLE app.CaseStepFactBinding WITH CHECK ADD CONSTRAINT FK_Binding_Source FOREIGN KEY(CaseId,ContentVersion,SourceStepKey) REFERENCES app.CaseStep(CaseId,ContentVersion,StepKey);
ALTER TABLE app.AttemptEvidenceItem WITH CHECK ADD CONSTRAINT FK_Item_Attempt FOREIGN KEY(AttemptId,CaseId,ContentVersion) REFERENCES app.LearnerAttempt(AttemptId,CaseId,ContentVersion);
ALTER TABLE app.AttemptEvidenceItem WITH CHECK ADD CONSTRAINT FK_Item_Step FOREIGN KEY(CaseId,ContentVersion,StepKey) REFERENCES app.CaseStep(CaseId,ContentVersion,StepKey);
ALTER TABLE app.AttemptEvidenceItem WITH CHECK ADD CONSTRAINT FK_Item_Action FOREIGN KEY(AttemptId,ActionId) REFERENCES app.AttemptAction(AttemptId,ActionId);
GRANT SELECT ON app.CaseFactDefinition TO sequel_repository;
GRANT SELECT ON app.CaseBriefingFact TO sequel_repository;
GRANT SELECT ON app.CaseStepFactBinding TO sequel_repository;
GRANT SELECT,INSERT,UPDATE,DELETE ON app.AttemptEvidenceItem TO sequel_repository;
INSERT dbo.AppSchemaVersion(MigrationKey,AppliedBy,Notes) VALUES('case-runtime-v2',COALESCE(SUSER_SNAME(),USER_NAME()),'Typed authored facts and distinct durable evidence collections.');
GO
GRANT EXECUTE ON app.CheckCase004EvidenceManifest TO sequel_repository;
GO
-- BEGIN STUDENT CITY NAME INSTALL
INSERT dbo.AppSchemaVersion(MigrationKey,AppliedBy,Notes) VALUES('canonical-city-v1',COALESCE(SUSER_SNAME(),USER_NAME()),'WP-297: verified report spelling and immutable Case 004 v2 publication.');
GO
-- END STUDENT CITY NAME INSTALL
GRANT EXECUTE ON app.CheckCase001Suspect TO sequel_repository;
GRANT EXECUTE ON app.CheckCase001EvidenceManifest TO sequel_repository;
IF EXISTS(SELECT 1 FROM app.CaseDefinition WHERE CaseId='case-001' AND ContentVersion=3 AND EvidenceVersion='case001-complete-v5' AND ReleaseStatus='released')
INSERT dbo.AppSchemaVersion(MigrationKey,AppliedBy,Notes) VALUES('case001-complete-v5',COALESCE(SUSER_SNAME(),USER_NAME()),'WP-300: clean Case 001 evidence and immutable v3 and single culprit verification.');
GO
-- END STUDENT CASE EXTENSION INSTALL

-- END STUDENT RUNTIME INSTALL
