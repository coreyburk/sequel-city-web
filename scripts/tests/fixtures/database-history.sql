-- Test-only unreleased authoring record. Never part of bootstrap or packaged upgrades.
IF DB_NAME() <> N'SequelCityRuntimeTest_Workspace'
    THROW 51000, 'Historical test content requires the registered test workspace.', 1;
INSERT app.CaseDefinition (CaseId,ContentVersion,Title,Dossier,WholeCaseObjective,EntryStepKey,EvidenceVersion,CompletionScope,ReleaseStatus)
VALUES ('fixture-foundation',1,'Foundation authoring fixture','Internal authoring validation fixture.','Identify the recorded crime type.','crime-type','sequel-evidence-v1','evidence-review','draft');
INSERT app.CaseStep (CaseId,ContentVersion,StepKey,DisplayOrder,TaskTitle,StepObjective,SamuelDirection,Hint,StarterSql,CompletionMode,ValidatorKey,ValidatorParametersJson)
VALUES ('fixture-foundation',1,'crime-type',0,'Inspect the catalogue.','Identify the crime type.','Begin by inspecting CrimeType.',NULL,'SELECT * FROM CrimeType;','query','case001.crime-type','{}');
GO
