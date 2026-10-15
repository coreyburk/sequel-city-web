-- WP-290: test-only authored records. Execute only in a newly owned disposable
-- SequelCityRuntimeTest_ database through the integration harness, never installer seed.
IF DB_NAME() NOT LIKE 'SequelCityRuntimeTest[_]%' THROW 51040,'Disposable authoring target required.',1;
IF EXISTS(SELECT 1 FROM app.CaseDefinition WHERE CaseId IN ('case-008','fixture-authoring-draft','fixture-authoring-retired')) THROW 51040,'Authoring fixture already exists.',1;
SET XACT_ABORT ON;
BEGIN TRY
BEGIN TRANSACTION;
INSERT app.CaseDefinition(CaseId,ContentVersion,Title,Dossier,WholeCaseObjective,EntryStepKey,EvidenceVersion,CompletionScope,ReleaseStatus)
VALUES('case-008',1,'Authored Incident Review','A training review in Sequel City on January 15, 2023.','Trace a recorded crime type to one incident report.',NULL,'sequel-evidence-v1','evidence-review','draft'),
('fixture-authoring-draft',1,'Unpublished authoring fixture','Private draft dossier.','Inspect evidence.',NULL,'sequel-evidence-v1','evidence-review','draft'),
('fixture-authoring-retired',1,'Retired authoring fixture','Retired dossier.','Inspect evidence.',NULL,'sequel-evidence-v1','evidence-review','retired');
INSERT app.CaseStep(CaseId,ContentVersion,StepKey,DisplayOrder,TaskTitle,StepObjective,SamuelDirection,Hint,StarterSql,CompletionMode,ValidatorKey,ValidatorParametersJson)
VALUES('case-008',1,'catalogue',0,'Read the crime catalogue.','Find the recorded murder crime type.','Inspect CrimeType and log the row that describes the recorded crime.','Read the crime names before choosing a row.','SELECT * FROM CrimeType','log','case004.crime-type','{}'),
('case-008',1,'archive',1,'Inspect the incident archive.','Read the report archive columns.','Inspect CrimeSceneReport broadly before constructing filters.','Find the city, date and report columns.','SELECT * FROM CrimeSceneReport','query','case004.report-inspection','{}'),
('case-008',1,'incident',2,'Isolate the briefing incident.','Record the one incident that matches the observed crime and public briefing.','Use your proved crime type with the briefing city and date, then log the isolated report.','Keep refining while several rows remain.','SELECT * FROM CrimeSceneReport','log','case004.report-isolation','{}');
INSERT app.CaseStepPrerequisite(CaseId,ContentVersion,StepKey,RequiredStepKey)
VALUES('case-008',1,'archive','catalogue'),('case-008',1,'incident','archive');
INSERT app.CaseFactDefinition(CaseId,ContentVersion,FactKey,Label,EvidenceColumn,ValueType,Cardinality)
VALUES('case-008',1,'briefing-city','City from case briefing','ReportCity','text','single'),
('case-008',1,'briefing-date','Date from case briefing','ReportDate','integer','single'),
('case-008',1,'CrimeID','Recorded CrimeID','CrimeID','integer','single'),
('case-008',1,'ReportID','Observed ReportID','ReportID','integer','single');
INSERT app.CaseBriefingFact(CaseId,ContentVersion,FactKey,ItemKey,ValueType,TextValue,IntegerValue,DisplayValue)
VALUES('case-008',1,'briefing-city','city','text','Sequel City',NULL,'Sequel City'),
('case-008',1,'briefing-date','date','integer',NULL,20230115,'January 15, 2023');
INSERT app.CaseStepFactBinding(CaseId,ContentVersion,StepKey,FactKey,BindingUse,SourceStepKey,InsertOperator)
VALUES('case-008',1,'catalogue','CrimeID','output',NULL,NULL),
('case-008',1,'incident','CrimeID','input','catalogue','equals'),
('case-008',1,'incident','briefing-city','input',NULL,'equals'),
('case-008',1,'incident','briefing-date','input',NULL,'equals'),
('case-008',1,'incident','ReportID','output',NULL,NULL);
UPDATE app.CaseDefinition SET EntryStepKey='catalogue',ReleaseStatus='released' WHERE CaseId='case-008' AND ContentVersion=1;
COMMIT;
END TRY
BEGIN CATCH
 IF @@TRANCOUNT>0 ROLLBACK;
 THROW;
END CATCH;
