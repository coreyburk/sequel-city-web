-- Recognized-installation compatibility only. Never used for fresh bootstrap.
-- Frozen upgrade sections extracted from the accepted pre-cleanup scripts.
-- The guarded installer owns recognition, verified backup and transaction safety.
-- BEGIN STUDENT RUNTIME INSTALL
-- WP-287: version-controlled authored content. No UI routing changes.
INSERT app.CaseDefinition (CaseId,ContentVersion,Title,Dossier,WholeCaseObjective,EntryStepKey,EvidenceVersion,CompletionScope,ReleaseStatus)
VALUES ('case-001',1,'The Clocktower Poisoning',
 'May 2nd, 2023: a civic clocktower ceremony ended with a public poisoning in Sequel City.',
 'Determine who committed the crime by building an evidence trail. This release covers crime type, incident report and linked interviews; culprit resolution is not yet released.',
 'crime-type','sequel-evidence-v1','evidence-review','draft');
INSERT app.CaseStep (CaseId,ContentVersion,StepKey,DisplayOrder,TaskTitle,StepObjective,SamuelDirection,Hint,StarterSql,CompletionMode,ValidatorKey,ValidatorParametersJson)
VALUES ('case-001',1,'crime-type',0,'Identify the recorded crime type.',
 'Find the recorded crime type and read its CrimeID.',
 'Every investigation needs a firm first fact. Start with CrimeType, find the row that describes this crime, and log its CrimeID before following the report trail.',
 'A broad SELECT query will show the columns and rows of the table. Find the crime type and crime ID for the type of crime in this case.','SELECT * FROM CrimeType;','query','case001.crime-type','{}'),
 ('case-001',1,'clocktower-report',1,'Locate the clocktower report.',
 'Narrow the report archive to one matching incident row and read its ReportID.',
 'Use the CrimeID from the CrimeTypes table to find the correct Crime Scene Report in CrimeSceneReport. Inspect its columns, then use the city and date in your case file to narrow the archive until one incident remains.',
 'Keep refining your query using WHERE, AND, and OR to filter the results. Remember to use your discovered clues. Log the ReportID from the isolated row.','SELECT * FROM CrimeSceneReport;','query','case001.report','{}'),
 ('case-001',1,'linked-interviews',2,'Follow the report into interviews.',
 'Retrieve interviews linked to the crime report and compare the accounts.',
 'The report gives us a trail to the people who left an account. Inspect InterviewLog, then use your observed ReportID to find the linked interviews and read what each witness actually recorded.',
 'Use the ReportID you read from the report; a broad interview search by itself does not prove the link.','SELECT * FROM InterviewLog;','query','case001.interviews','{}');
INSERT app.CaseStepPrerequisite (CaseId,ContentVersion,StepKey,RequiredStepKey)
VALUES ('case-001',1,'clocktower-report','crime-type'),('case-001',1,'linked-interviews','clocktower-report');
UPDATE app.CaseDefinition SET ReleaseStatus='released' WHERE CaseId='case-001' AND ContentVersion=1;
GO
-- BEGIN STUDENT CASE EXTENSION INSTALL
-- Released Case 001 version 1 remains untouched for pinned attempts.
INSERT app.CaseDefinition(CaseId,ContentVersion,Title,Dossier,WholeCaseObjective,EntryStepKey,EvidenceVersion,CompletionScope,ReleaseStatus)
SELECT CaseId,2,Title,Dossier,WholeCaseObjective,NULL,EvidenceVersion,CompletionScope,'draft' FROM app.CaseDefinition WHERE CaseId='case-001' AND ContentVersion=1;
INSERT app.CaseStep(CaseId,ContentVersion,StepKey,DisplayOrder,TaskTitle,StepObjective,SamuelDirection,Hint,StarterSql,CompletionMode,ValidatorKey,ValidatorParametersJson)
SELECT CaseId,2,StepKey,DisplayOrder,TaskTitle,StepObjective,SamuelDirection,Hint,REPLACE(StarterSql,';',''),CompletionMode,ValidatorKey,ValidatorParametersJson FROM app.CaseStep WHERE CaseId='case-001' AND ContentVersion=1;
INSERT app.CaseStepPrerequisite(CaseId,ContentVersion,StepKey,RequiredStepKey)
SELECT CaseId,2,StepKey,RequiredStepKey FROM app.CaseStepPrerequisite WHERE CaseId='case-001' AND ContentVersion=1;
INSERT app.CaseDefinition(CaseId,ContentVersion,Title,Dossier,WholeCaseObjective,EntryStepKey,EvidenceVersion,CompletionScope,ReleaseStatus)
VALUES('case-004',1,'The SQL City Murder','January 15, 2023: a murder in SQL City. Follow the report, listen to the witnesses, and build an evidence trail that identifies the killer and the person who hired him.','Prove who committed the murder and who commissioned it, using linked records and controlled theory checks.',NULL,'sequel-evidence-v1','full-resolution','draft');
INSERT app.CaseStep(CaseId,ContentVersion,StepKey,DisplayOrder,TaskTitle,StepObjective,SamuelDirection,Hint,StarterSql,CompletionMode,ValidatorKey,ValidatorParametersJson) VALUES('case-004',1,'crime-type',0,N'Identify the recorded crime type.',N'Find the CrimeID for Murder.',N'Every trail needs a sound beginning. Open CrimeType and find the recorded crime type for this investigation. Log its row so we can carry its identifier forward.',N'Read the CrimeType column before selecting the Murder row.',N'SELECT * FROM CrimeType','log','case004.crime-type','{}');
INSERT app.CaseStep(CaseId,ContentVersion,StepKey,DisplayOrder,TaskTitle,StepObjective,SamuelDirection,Hint,StarterSql,CompletionMode,ValidatorKey,ValidatorParametersJson) VALUES('case-004',1,'report-inspection',1,N'Inspect the report archive.',N'Discover the columns available in CrimeSceneReport.',N'Your crime type is proved. Open the report archive broadly and inspect the columns before building your filters.',N'Look for the crime, city, date and report identifier columns.',N'SELECT * FROM CrimeSceneReport','query','case004.report-inspection','{}');
INSERT app.CaseStepPrerequisite(CaseId,ContentVersion,StepKey,RequiredStepKey) VALUES('case-004',1,'report-inspection','crime-type');
INSERT app.CaseStep(CaseId,ContentVersion,StepKey,DisplayOrder,TaskTitle,StepObjective,SamuelDirection,Hint,StarterSql,CompletionMode,ValidatorKey,ValidatorParametersJson) VALUES('case-004',1,'report-isolation',2,N'Locate the SQL City murder report.',N'Narrow the archive to one incident and record its ReportID.',N'Use the CrimeID you proved with the city and date from your briefing. Keep refining until one report remains, then log that row.',N'Combine the proved crime type with the briefing city and date. A large result set still needs refinement.',N'SELECT * FROM CrimeSceneReport','log','case004.report-isolation','{}');
INSERT app.CaseStepPrerequisite(CaseId,ContentVersion,StepKey,RequiredStepKey) VALUES('case-004',1,'report-isolation','report-inspection');
INSERT app.CaseStep(CaseId,ContentVersion,StepKey,DisplayOrder,TaskTitle,StepObjective,SamuelDirection,Hint,StarterSql,CompletionMode,ValidatorKey,ValidatorParametersJson) VALUES('case-004',1,'witness-observations',3,N'Read both witness accounts.',N'Record two distinct report-linked witness bundles.',N'The report is our bridge to the people who saw something. Follow its ReportID into InterviewLog and log a useful observation from each witness.',N'Repeated PersonIDs connect several observations. Confessions belong to a later part of the investigation.',N'SELECT * FROM InterviewLog','log','case004.witness-observations','{}');
INSERT app.CaseStepPrerequisite(CaseId,ContentVersion,StepKey,RequiredStepKey) VALUES('case-004',1,'witness-observations','report-isolation');
INSERT app.CaseStep(CaseId,ContentVersion,StepKey,DisplayOrder,TaskTitle,StepObjective,SamuelDirection,Hint,StarterSql,CompletionMode,ValidatorKey,ValidatorParametersJson) VALUES('case-004',1,'witness-identities',4,N'Identify both witnesses.',N'Resolve both observed witness PersonIDs into names.',N'You have two voices. Give each a name using PersonsOfInterest and the PersonIDs you observed. Log both identity rows.',N'Keep both witness identifiers in view. A single identity leaves half the trail unnamed.',N'SELECT * FROM PersonsOfInterest','log','case004.witness-identities','{}');
INSERT app.CaseStepPrerequisite(CaseId,ContentVersion,StepKey,RequiredStepKey) VALUES('case-004',1,'witness-identities','witness-observations');
INSERT app.CaseStep(CaseId,ContentVersion,StepKey,DisplayOrder,TaskTitle,StepObjective,SamuelDirection,Hint,StarterSql,CompletionMode,ValidatorKey,ValidatorParametersJson) VALUES('case-004',1,'gym-lead',5,N'Follow the gym membership lead.',N'Connect the witnessed membership clues to a visible PersonID.',N'Read your witness clues together. Carry the membership prefix and membership status into FitNFlabClub; inspect check-in records if you need to test the timeline.',N'A membership must match both the prefix and status clues. Read its PersonID rather than guessing a name.',N'SELECT * FROM FitNFlabClub','log','case004.gym-lead','{}');
INSERT app.CaseStepPrerequisite(CaseId,ContentVersion,StepKey,RequiredStepKey) VALUES('case-004',1,'gym-lead','witness-identities');
INSERT app.CaseStep(CaseId,ContentVersion,StepKey,DisplayOrder,TaskTitle,StepObjective,SamuelDirection,Hint,StarterSql,CompletionMode,ValidatorKey,ValidatorParametersJson) VALUES('case-004',1,'suspect-identity',6,N'Identify the gym-linked suspect.',N'Resolve the proved gym PersonID into a name.',N'The gym record gives us an identifier, not a conclusion. Follow that PersonID into PersonsOfInterest and log the identity you find.',N'Stay tied to the PersonID from the membership record.',N'SELECT * FROM PersonsOfInterest','log','case004.suspect-identity','{}');
INSERT app.CaseStepPrerequisite(CaseId,ContentVersion,StepKey,RequiredStepKey) VALUES('case-004',1,'suspect-identity','gym-lead');
INSERT app.CaseStep(CaseId,ContentVersion,StepKey,DisplayOrder,TaskTitle,StepObjective,SamuelDirection,Hint,StarterSql,CompletionMode,ValidatorKey,ValidatorParametersJson) VALUES('case-004',1,'suspect-confession',7,N'Read the suspect''s direct confession.',N'Record the identified suspect''s admission linked to this report.',N'Now listen to the suspect in InterviewLog. Keep both his PersonID and this ReportID in the search, and log the row that directly admits the killing.',N'A description of a client is a later lead. First establish the suspect''s own admission.',N'SELECT * FROM InterviewLog','log','case004.suspect-confession','{}');
INSERT app.CaseStepPrerequisite(CaseId,ContentVersion,StepKey,RequiredStepKey) VALUES('case-004',1,'suspect-confession','suspect-identity');
INSERT app.CaseStep(CaseId,ContentVersion,StepKey,DisplayOrder,TaskTitle,StepObjective,SamuelDirection,Hint,StarterSql,CompletionMode,ValidatorKey,ValidatorParametersJson) VALUES('case-004',1,'murderer-verification',8,N'Test the murderer theory.',N'Verify the identity supported by the membership and confession trail.',N'Your evidence now supports a theory. Open Evidence Board and submit the suspect name you proved.',N'A correct theory must be supported by this attempt''s proved identity and confession.',NULL,'verify','case004.murderer-verification','{}');
INSERT app.CaseStepPrerequisite(CaseId,ContentVersion,StepKey,RequiredStepKey) VALUES('case-004',1,'murderer-verification','suspect-confession');
INSERT app.CaseStep(CaseId,ContentVersion,StepKey,DisplayOrder,TaskTitle,StepObjective,SamuelDirection,Hint,StarterSql,CompletionMode,ValidatorKey,ValidatorParametersJson) VALUES('case-004',1,'mastermind-profile',9,N'Build the hiring person''s profile.',N'Collect all ten distinct clue threads from the confirmed killer''s interviews.',N'A hired killer leaves another trail. Revisit his report-linked interviews and log each row that adds a new detail about the person who hired him.',N'Look for the paid hit, woman, wealth, December meetings, Symphony, shoes, jewelry, hair, car and height. Repeated clues do not add a new thread.',N'SELECT * FROM InterviewLog','log','case004.mastermind-profile','{}');
INSERT app.CaseStepPrerequisite(CaseId,ContentVersion,StepKey,RequiredStepKey) VALUES('case-004',1,'mastermind-profile','murderer-verification');
INSERT app.CaseStep(CaseId,ContentVersion,StepKey,DisplayOrder,TaskTitle,StepObjective,SamuelDirection,Hint,StarterSql,CompletionMode,ValidatorKey,ValidatorParametersJson) VALUES('case-004',1,'mastermind-candidates',10,N'Build a candidate shortlist.',N'Record at least two distinct license records matching the earned profile.',N'Translate the profile you earned into DriversLicense conditions. Keep each person who fits the appearance and vehicle clues in play.',N'Use the observed gender, hair, BMW M8 and height clues together; log each matching candidate.',N'SELECT * FROM DriversLicense','log','case004.mastermind-candidates','{}');
INSERT app.CaseStepPrerequisite(CaseId,ContentVersion,StepKey,RequiredStepKey) VALUES('case-004',1,'mastermind-candidates','mastermind-profile');
INSERT app.CaseStep(CaseId,ContentVersion,StepKey,DisplayOrder,TaskTitle,StepObjective,SamuelDirection,Hint,StarterSql,CompletionMode,ValidatorKey,ValidatorParametersJson) VALUES('case-004',1,'mastermind-identities',11,N'Identify both shortlisted candidates.',N'Link both license records to names, PersonIDs and SSNs.',N'A license shortlist is a starting point. Follow each proved LicenseID into PersonsOfInterest and log both complete identities.',N'Keep the PersonID, name, LicenseID and SSN visible together. We still have alternatives to compare.',N'SELECT * FROM PersonsOfInterest','log','case004.mastermind-identities','{}');
INSERT app.CaseStepPrerequisite(CaseId,ContentVersion,StepKey,RequiredStepKey) VALUES('case-004',1,'mastermind-identities','mastermind-candidates');
INSERT app.CaseStep(CaseId,ContentVersion,StepKey,DisplayOrder,TaskTitle,StepObjective,SamuelDirection,Hint,StarterSql,CompletionMode,ValidatorKey,ValidatorParametersJson) VALUES('case-004',1,'symphony-events',12,N'Find all three December Symphony events.',N'Record the three distinct events described in the interview trail.',N'The meetings give us a shared event trail. Search EventSchedule for December 2022 and Symphony, and log all three matching events.',N'One or two events leave this collection incomplete. Their observed EventIDs will guide the attendance comparison.',N'SELECT * FROM EventSchedule','log','case004.symphony-events','{}');
INSERT app.CaseStepPrerequisite(CaseId,ContentVersion,StepKey,RequiredStepKey) VALUES('case-004',1,'symphony-events','mastermind-identities');
INSERT app.CaseStep(CaseId,ContentVersion,StepKey,DisplayOrder,TaskTitle,StepObjective,SamuelDirection,Hint,StarterSql,CompletionMode,ValidatorKey,ValidatorParametersJson) VALUES('case-004',1,'attendance-comparison',13,N'Compare both candidates'' attendance.',N'Compare both proved identities against all three proved events.',N'Carry both candidate PersonIDs and all three EventIDs into EventRegistration. Compare the same event set for both people before drawing a conclusion.',N'Both candidates may remain in play. Shared attendance is evidence to compare, not permission to guess.',N'SELECT * FROM EventRegistration','query','case004.attendance-comparison','{}');
INSERT app.CaseStepPrerequisite(CaseId,ContentVersion,StepKey,RequiredStepKey) VALUES('case-004',1,'attendance-comparison','symphony-events');
INSERT app.CaseStep(CaseId,ContentVersion,StepKey,DisplayOrder,TaskTitle,StepObjective,SamuelDirection,Hint,StarterSql,CompletionMode,ValidatorKey,ValidatorParametersJson) VALUES('case-004',1,'employment-comparison',14,N'Use the wealth clue to break the tie.',N'Compare both earned SSNs and record the stronger wealth evidence.',N'Attendance kept both candidates in view. Return to the paid-hit and wealth clue: compare their Employment records using the SSNs you proved.',N'Keep both rows visible, compare their income, and log the record that best supports the wealth clue.',N'SELECT * FROM Employment','log','case004.employment-comparison','{}');
INSERT app.CaseStepPrerequisite(CaseId,ContentVersion,StepKey,RequiredStepKey) VALUES('case-004',1,'employment-comparison','attendance-comparison');
INSERT app.CaseStep(CaseId,ContentVersion,StepKey,DisplayOrder,TaskTitle,StepObjective,SamuelDirection,Hint,StarterSql,CompletionMode,ValidatorKey,ValidatorParametersJson) VALUES('case-004',1,'mastermind-verification',15,N'Test the mastermind theory.',N'Verify the identity supported by the complete hiring-person trail.',N'Your profile, events and employment comparison now support a final theory. Open Evidence Board and test the name supported by those records.',N'Use the identity linked to your proved wealth evidence. The earlier murderer verdict did not finish this investigation.',NULL,'verify','case004.mastermind-verification','{}');
INSERT app.CaseStepPrerequisite(CaseId,ContentVersion,StepKey,RequiredStepKey) VALUES('case-004',1,'mastermind-verification','employment-comparison');
INSERT app.CaseFactDefinition(CaseId,ContentVersion,FactKey,Label,EvidenceColumn,ValueType,Cardinality)
VALUES('case-001',2,'briefing-city','City from case briefing','ReportCity','text','single'),('case-001',2,'briefing-date','Date from case briefing','ReportDate','integer','single'),
('case-004',1,'briefing-city','City from case briefing','ReportCity','text','single'),('case-004',1,'briefing-date','Date from case briefing','ReportDate','integer','single');
INSERT app.CaseBriefingFact(CaseId,ContentVersion,FactKey,ItemKey,ValueType,TextValue,IntegerValue,DisplayValue)
VALUES('case-001',2,'briefing-city','city','text','Sequel City',NULL,'Sequel City'),('case-001',2,'briefing-date','date','integer',NULL,20230502,'May 2, 2023'),
('case-004',1,'briefing-city','city','text','SQL City',NULL,'SQL City'),('case-004',1,'briefing-date','date','integer',NULL,20230115,'January 15, 2023');
INSERT app.CaseStepFactBinding(CaseId,ContentVersion,StepKey,FactKey,BindingUse,SourceStepKey,InsertOperator)
SELECT d.CaseId,d.ContentVersion,s.StepKey,f.FactKey,'input',NULL,'equals' FROM app.CaseDefinition d JOIN app.CaseStep s ON s.CaseId=d.CaseId AND s.ContentVersion=d.ContentVersion JOIN app.CaseFactDefinition f ON f.CaseId=d.CaseId AND f.ContentVersion=d.ContentVersion
WHERE ((d.CaseId='case-001' AND d.ContentVersion=2) OR d.CaseId='case-004') AND s.ValidatorKey IN ('case001.report','case004.report-inspection','case004.report-isolation');

INSERT app.CaseFactDefinition(CaseId,ContentVersion,FactKey,Label,EvidenceColumn,ValueType,Cardinality) VALUES('case-004',1,'CrimeID','Murder CrimeID','CrimeID','integer','single');
INSERT app.CaseStepFactBinding(CaseId,ContentVersion,StepKey,FactKey,BindingUse,SourceStepKey,InsertOperator) VALUES('case-004',1,'crime-type','CrimeID','output',NULL,NULL);
INSERT app.CaseFactDefinition(CaseId,ContentVersion,FactKey,Label,EvidenceColumn,ValueType,Cardinality) VALUES('case-004',1,'ReportID','Incident ReportID','ReportID','integer','single');
INSERT app.CaseStepFactBinding(CaseId,ContentVersion,StepKey,FactKey,BindingUse,SourceStepKey,InsertOperator) VALUES('case-004',1,'report-isolation','ReportID','output',NULL,NULL);
INSERT app.CaseFactDefinition(CaseId,ContentVersion,FactKey,Label,EvidenceColumn,ValueType,Cardinality) VALUES('case-004',1,'PersonID:witness','Witness PersonID','PersonID','integer','collection');
INSERT app.CaseStepFactBinding(CaseId,ContentVersion,StepKey,FactKey,BindingUse,SourceStepKey,InsertOperator) VALUES('case-004',1,'witness-observations','PersonID:witness','output',NULL,NULL);
INSERT app.CaseFactDefinition(CaseId,ContentVersion,FactKey,Label,EvidenceColumn,ValueType,Cardinality) VALUES('case-004',1,'FitMemberID:prefix','Witness membership prefix','FitMemberID','text','single');
INSERT app.CaseStepFactBinding(CaseId,ContentVersion,StepKey,FactKey,BindingUse,SourceStepKey,InsertOperator) VALUES('case-004',1,'witness-observations','FitMemberID:prefix','output',NULL,NULL);
INSERT app.CaseFactDefinition(CaseId,ContentVersion,FactKey,Label,EvidenceColumn,ValueType,Cardinality) VALUES('case-004',1,'FitMembershipStatus','Witness membership status','FitMembershipStatus','text','single');
INSERT app.CaseStepFactBinding(CaseId,ContentVersion,StepKey,FactKey,BindingUse,SourceStepKey,InsertOperator) VALUES('case-004',1,'witness-observations','FitMembershipStatus','output',NULL,NULL);
INSERT app.CaseFactDefinition(CaseId,ContentVersion,FactKey,Label,EvidenceColumn,ValueType,Cardinality) VALUES('case-004',1,'PersonName:witness','Witness name','PersonName','text','collection');
INSERT app.CaseStepFactBinding(CaseId,ContentVersion,StepKey,FactKey,BindingUse,SourceStepKey,InsertOperator) VALUES('case-004',1,'witness-identities','PersonName:witness','output',NULL,NULL);
INSERT app.CaseFactDefinition(CaseId,ContentVersion,FactKey,Label,EvidenceColumn,ValueType,Cardinality) VALUES('case-004',1,'FitMemberID','Gym membership','FitMemberID','text','single');
INSERT app.CaseStepFactBinding(CaseId,ContentVersion,StepKey,FactKey,BindingUse,SourceStepKey,InsertOperator) VALUES('case-004',1,'gym-lead','FitMemberID','output',NULL,NULL);
INSERT app.CaseFactDefinition(CaseId,ContentVersion,FactKey,Label,EvidenceColumn,ValueType,Cardinality) VALUES('case-004',1,'PersonID:suspect','Gym-linked PersonID','PersonID','integer','single');
INSERT app.CaseStepFactBinding(CaseId,ContentVersion,StepKey,FactKey,BindingUse,SourceStepKey,InsertOperator) VALUES('case-004',1,'gym-lead','PersonID:suspect','output',NULL,NULL);
INSERT app.CaseFactDefinition(CaseId,ContentVersion,FactKey,Label,EvidenceColumn,ValueType,Cardinality) VALUES('case-004',1,'PersonName:suspect','Suspect name','PersonName','text','single');
INSERT app.CaseStepFactBinding(CaseId,ContentVersion,StepKey,FactKey,BindingUse,SourceStepKey,InsertOperator) VALUES('case-004',1,'suspect-identity','PersonName:suspect','output',NULL,NULL);
INSERT app.CaseFactDefinition(CaseId,ContentVersion,FactKey,Label,EvidenceColumn,ValueType,Cardinality) VALUES('case-004',1,'Profile','Mastermind clue',NULL,'text','collection');
INSERT app.CaseStepFactBinding(CaseId,ContentVersion,StepKey,FactKey,BindingUse,SourceStepKey,InsertOperator) VALUES('case-004',1,'mastermind-profile','Profile','output',NULL,NULL);
INSERT app.CaseFactDefinition(CaseId,ContentVersion,FactKey,Label,EvidenceColumn,ValueType,Cardinality) VALUES('case-004',1,'LicenseID:candidate','Candidate LicenseID','LicenseID','integer','collection');
INSERT app.CaseStepFactBinding(CaseId,ContentVersion,StepKey,FactKey,BindingUse,SourceStepKey,InsertOperator) VALUES('case-004',1,'mastermind-candidates','LicenseID:candidate','output',NULL,NULL);
INSERT app.CaseFactDefinition(CaseId,ContentVersion,FactKey,Label,EvidenceColumn,ValueType,Cardinality) VALUES('case-004',1,'EventPersonID:candidate','Candidate PersonID','EventPersonID','integer','collection');
INSERT app.CaseStepFactBinding(CaseId,ContentVersion,StepKey,FactKey,BindingUse,SourceStepKey,InsertOperator) VALUES('case-004',1,'mastermind-identities','EventPersonID:candidate','output',NULL,NULL);
INSERT app.CaseFactDefinition(CaseId,ContentVersion,FactKey,Label,EvidenceColumn,ValueType,Cardinality) VALUES('case-004',1,'SSN:candidate','Candidate SSN','SSN','integer','collection');
INSERT app.CaseStepFactBinding(CaseId,ContentVersion,StepKey,FactKey,BindingUse,SourceStepKey,InsertOperator) VALUES('case-004',1,'mastermind-identities','SSN:candidate','output',NULL,NULL);
INSERT app.CaseFactDefinition(CaseId,ContentVersion,FactKey,Label,EvidenceColumn,ValueType,Cardinality) VALUES('case-004',1,'PersonName:candidate','Candidate name','PersonName','text','collection');
INSERT app.CaseStepFactBinding(CaseId,ContentVersion,StepKey,FactKey,BindingUse,SourceStepKey,InsertOperator) VALUES('case-004',1,'mastermind-identities','PersonName:candidate','output',NULL,NULL);
INSERT app.CaseFactDefinition(CaseId,ContentVersion,FactKey,Label,EvidenceColumn,ValueType,Cardinality) VALUES('case-004',1,'EventID','December Symphony event','EventID','integer','collection');
INSERT app.CaseStepFactBinding(CaseId,ContentVersion,StepKey,FactKey,BindingUse,SourceStepKey,InsertOperator) VALUES('case-004',1,'symphony-events','EventID','output',NULL,NULL);
INSERT app.CaseFactDefinition(CaseId,ContentVersion,FactKey,Label,EvidenceColumn,ValueType,Cardinality) VALUES('case-004',1,'SSN:wealth','Wealth evidence SSN','SSN','integer','single');
INSERT app.CaseStepFactBinding(CaseId,ContentVersion,StepKey,FactKey,BindingUse,SourceStepKey,InsertOperator) VALUES('case-004',1,'employment-comparison','SSN:wealth','output',NULL,NULL);
INSERT app.CaseStepFactBinding(CaseId,ContentVersion,StepKey,FactKey,BindingUse,SourceStepKey,InsertOperator)
VALUES('case-004',1,'report-inspection','CrimeID','input','crime-type','equals'),
('case-004',1,'report-isolation','CrimeID','input','crime-type','equals'),
('case-004',1,'witness-observations','ReportID','input','report-isolation','equals'),
('case-004',1,'witness-identities','PersonID:witness','input','witness-observations','equals'),
('case-004',1,'gym-lead','FitMemberID:prefix','input','witness-observations','prefix'),
('case-004',1,'gym-lead','FitMembershipStatus','input','witness-observations','equals'),
('case-004',1,'suspect-identity','PersonID:suspect','input','gym-lead','equals'),
('case-004',1,'suspect-confession','PersonID:suspect','input','gym-lead','equals'),
('case-004',1,'suspect-confession','ReportID','input','report-isolation','equals'),
('case-004',1,'mastermind-profile','PersonID:suspect','input','gym-lead','equals'),
('case-004',1,'mastermind-profile','ReportID','input','report-isolation','equals'),
('case-004',1,'mastermind-identities','LicenseID:candidate','input','mastermind-candidates','equals'),
('case-004',1,'attendance-comparison','EventPersonID:candidate','input','mastermind-identities','equals'),
('case-004',1,'attendance-comparison','EventID','input','symphony-events','equals'),
('case-004',1,'employment-comparison','SSN:candidate','input','mastermind-identities','equals'),
('case-004',1,'murderer-verification','PersonName:suspect','input','suspect-identity',NULL),
('case-004',1,'mastermind-verification','PersonName:candidate','input','mastermind-identities',NULL);
INSERT app.CaseFactDefinition(CaseId,ContentVersion,FactKey,Label,EvidenceColumn,ValueType,Cardinality)
VALUES('case-001',2,'CrimeID','Murder CrimeID','CrimeID','integer','single'),
('case-001',2,'ReportID','Incident ReportID','ReportID','integer','single'),
('case-001',2,'ReportCity','Report city','ReportCity','text','single'),
('case-001',2,'ReportDate','Report date','ReportDate','integer','single'),
('case-001',2,'PersonID','Interview PersonID','PersonID','integer','collection');
INSERT app.CaseStepFactBinding(CaseId,ContentVersion,StepKey,FactKey,BindingUse,SourceStepKey,InsertOperator)
VALUES('case-001',2,'crime-type','CrimeID','output',NULL,NULL),
('case-001',2,'clocktower-report','ReportID','output',NULL,NULL),
('case-001',2,'clocktower-report','ReportCity','output',NULL,NULL),
('case-001',2,'clocktower-report','ReportDate','output',NULL,NULL),
('case-001',2,'linked-interviews','PersonID','output',NULL,NULL),
('case-001',2,'clocktower-report','CrimeID','input','crime-type','equals'),
('case-001',2,'linked-interviews','ReportID','input','clocktower-report','equals');
UPDATE app.CaseDefinition SET EntryStepKey='crime-type',ReleaseStatus='released' WHERE (CaseId='case-001' AND ContentVersion=2) OR (CaseId='case-004' AND ContentVersion=1);
GO
-- BEGIN STUDENT CITY NAME INSTALL
-- WP-297: publish v2; preserve every released v1 row for pinned attempts.
INSERT app.CaseDefinition(CaseId,ContentVersion,Title,Dossier,WholeCaseObjective,EntryStepKey,EvidenceVersion,CompletionScope,ReleaseStatus)
SELECT CaseId,2,REPLACE(Title,'SQL City','Sequel City'),REPLACE(Dossier,'SQL City','Sequel City'),WholeCaseObjective,NULL,EvidenceVersion,CompletionScope,'draft' FROM app.CaseDefinition WHERE CaseId='case-004' AND ContentVersion=1;
INSERT app.CaseStep(CaseId,ContentVersion,StepKey,DisplayOrder,TaskTitle,StepObjective,SamuelDirection,Hint,StarterSql,CompletionMode,ValidatorKey,ValidatorParametersJson)
SELECT CaseId,2,StepKey,DisplayOrder,CASE WHEN StepKey='report-isolation' THEN 'Locate the Sequel City murder report.' ELSE TaskTitle END,StepObjective,SamuelDirection,Hint,StarterSql,CompletionMode,ValidatorKey,ValidatorParametersJson FROM app.CaseStep WHERE CaseId='case-004' AND ContentVersion=1;
INSERT app.CaseStepPrerequisite(CaseId,ContentVersion,StepKey,RequiredStepKey)
SELECT CaseId,2,StepKey,RequiredStepKey FROM app.CaseStepPrerequisite WHERE CaseId='case-004' AND ContentVersion=1;
INSERT app.CaseFactDefinition(CaseId,ContentVersion,FactKey,Label,EvidenceColumn,ValueType,Cardinality)
SELECT CaseId,2,FactKey,Label,EvidenceColumn,ValueType,Cardinality FROM app.CaseFactDefinition WHERE CaseId='case-004' AND ContentVersion=1;
INSERT app.CaseBriefingFact(CaseId,ContentVersion,FactKey,ItemKey,ValueType,TextValue,IntegerValue,DecimalValue,DateValue,DisplayValue)
SELECT CaseId,2,FactKey,ItemKey,ValueType,CASE WHEN FactKey='briefing-city' AND ItemKey='city' THEN 'Sequel City' ELSE TextValue END,IntegerValue,DecimalValue,DateValue,CASE WHEN FactKey='briefing-city' AND ItemKey='city' THEN 'Sequel City' ELSE DisplayValue END FROM app.CaseBriefingFact WHERE CaseId='case-004' AND ContentVersion=1;
INSERT app.CaseStepFactBinding(CaseId,ContentVersion,StepKey,FactKey,BindingUse,SourceStepKey,InsertOperator)
SELECT CaseId,2,StepKey,FactKey,BindingUse,SourceStepKey,InsertOperator FROM app.CaseStepFactBinding WHERE CaseId='case-004' AND ContentVersion=1;
UPDATE app.CaseDefinition SET EntryStepKey='crime-type',ReleaseStatus='released' WHERE CaseId='case-004' AND ContentVersion=2;
GO
-- END STUDENT CITY NAME INSTALL

-- BEGIN COMPATIBLE CASE 001 COMPLETE CONTENT
IF EXISTS (SELECT 1 FROM dbo.CrimeSceneReport WHERE ReportDescription=N'Clocktower ceremony, May 2: the mayor collapsed after the noon toast. Toxicology found poison in his red-ribbon glass. The shared jug and the other served drinks tested clear. A statement was taken from the serving steward.')
AND EXISTS(SELECT 1 FROM dbo.CaseAnswerKey WHERE CaseId=N'case-001' AND AnswerRole=N'culprit')
BEGIN
INSERT app.CaseDefinition(CaseId,ContentVersion,Title,Dossier,WholeCaseObjective,EntryStepKey,EvidenceVersion,CompletionScope,ReleaseStatus) VALUES(N'case-001',3,N'The Clocktower Poisoning',N'May 2, 2023. Sequel City gathered beneath the clocktower for a civic celebration. During the noon toast, the mayor collapsed in front of the crowd. What first looked like a medical emergency became a murder investigation. The city''s records hold the accounts of those involved. Follow their evidence and establish who was responsible.',N'Identify who poisoned the mayor using the records you uncover.',NULL,N'case001-complete-v5',N'full-resolution',N'draft');
INSERT app.CaseStep(CaseId,ContentVersion,StepKey,DisplayOrder,TaskTitle,StepObjective,SamuelDirection,Hint,StarterSql,CompletionMode,ValidatorKey,ValidatorParametersJson) VALUES
(N'case-001',3,N'crime-type',0,N'Identify the crime type.',N'Find the identifier for Murder.',N'Start with CrimeType. Find the row for Murder and log its CrimeID.',N'Run a CrimeType query, find Murder in the results, and select Log Clue on that row.',N'SELECT * FROM CrimeType',N'log',N'case001.murder-type',N'{}'),
(N'case-001',3,N'final-report',1,N'Find the incident report.',N'Retrieve the report for this investigation.',N'Use the briefing city and date with the crime type you proved. Read the report and its identifiers.',N'Match ReportCity, ReportDate and CrimeID. Run the matching query to prove the task; Log Clue saves an optional note.',N'SELECT * FROM CrimeSceneReport',N'query',N'case001.final-report',N'{}'),
(N'case-001',3,N'witness-account',2,N'Read the steward''s account.',N'Find what the steward remembers.',N'Follow the report into InterviewLog. Read the steward''s account and decide whom you need to question.',N'Match the proved ReportID. If several statements are returned, use a name or phrase from the report to distinguish the steward''s account.',N'SELECT * FROM InterviewLog',N'query',N'case001.witness-account',N'{}'),
(N'case-001',3,N'suspect-identity',3,N'Identify the person named.',N'Find the named person''s identifier.',N'Find the person named by the steward in PersonsOfInterest. Read the PersonID so you can look for that person''s interview.',N'Match PersonName with the full name in the account you proved.',N'SELECT * FROM PersonsOfInterest',N'query',N'case001.suspect-identity',N'{}'),
(N'case-001',3,N'suspect-account',4,N'Question the person named.',N'Retrieve and assess the person''s own account.',N'Use the identity you found to retrieve this person''s statement about the incident. Compare it with the report and the steward''s account.',N'Match PersonID and the incident ReportID in InterviewLog.',N'SELECT * FROM InterviewLog',N'query',N'case001.suspect-account',N'{}'),
(N'case-001',3,N'culprit-verification',5,N'Resolve the investigation.',N'Confirm the conclusion supported by the evidence.',N'Review the report and both accounts. Submit the person your evidence supports.',N'Consider the source of the mayor''s drink compared with the other drinks.',NULL,N'verify',N'case001.culprit-verification',N'{}');
INSERT app.CaseStepPrerequisite(CaseId,ContentVersion,StepKey,RequiredStepKey) VALUES
(N'case-001',3,N'final-report',N'crime-type'),
(N'case-001',3,N'witness-account',N'final-report'),
(N'case-001',3,N'suspect-identity',N'witness-account'),
(N'case-001',3,N'suspect-account',N'suspect-identity'),
(N'case-001',3,N'culprit-verification',N'suspect-account');
INSERT app.CaseFactDefinition(CaseId,ContentVersion,FactKey,Label,EvidenceColumn,ValueType,Cardinality) VALUES
(N'case-001',3,N'briefing-city',N'City from briefing',N'ReportCity',N'text',N'single'),
(N'case-001',3,N'briefing-date',N'Date from briefing',N'ReportDate',N'integer',N'single'),
(N'case-001',3,N'CrimeID',N'Murder CrimeID',N'CrimeID',N'integer',N'single'),
(N'case-001',3,N'ReportID',N'Incident ReportID',N'ReportID',N'integer',N'single'),
(N'case-001',3,N'PersonName',N'Name from steward',N'PersonName',N'text',N'single'),
(N'case-001',3,N'PersonID',N'Named person ID',N'PersonID',N'integer',N'single'),
(N'case-001',3,N'Statement',N'Interview finding',NULL,N'text',N'single');
INSERT app.CaseBriefingFact(CaseId,ContentVersion,FactKey,ItemKey,ValueType,TextValue,IntegerValue,DisplayValue) VALUES
(N'case-001',3,N'briefing-city',N'city',N'text',N'Sequel City',NULL,N'Sequel City'),
(N'case-001',3,N'briefing-date',N'date',N'integer',NULL,20230502,N'May 2, 2023');
INSERT app.CaseStepFactBinding(CaseId,ContentVersion,StepKey,FactKey,BindingUse,SourceStepKey,InsertOperator) VALUES
(N'case-001',3,N'crime-type',N'CrimeID',N'output',NULL,NULL),
(N'case-001',3,N'final-report',N'CrimeID',N'input',N'crime-type',N'equals'),
(N'case-001',3,N'final-report',N'briefing-city',N'input',NULL,N'equals'),
(N'case-001',3,N'final-report',N'briefing-date',N'input',NULL,N'equals'),
(N'case-001',3,N'final-report',N'ReportID',N'output',NULL,NULL),
(N'case-001',3,N'witness-account',N'ReportID',N'input',N'final-report',N'equals'),
(N'case-001',3,N'witness-account',N'PersonName',N'output',NULL,NULL),
(N'case-001',3,N'suspect-identity',N'PersonName',N'input',N'witness-account',N'equals'),
(N'case-001',3,N'suspect-identity',N'PersonID',N'output',NULL,NULL),
(N'case-001',3,N'suspect-account',N'PersonID',N'input',N'suspect-identity',N'equals'),
(N'case-001',3,N'suspect-account',N'ReportID',N'input',N'final-report',N'equals'),
(N'case-001',3,N'suspect-account',N'Statement',N'output',NULL,NULL),
(N'case-001',3,N'culprit-verification',N'PersonName',N'input',N'witness-account',NULL);
UPDATE app.CaseDefinition SET EntryStepKey=N'crime-type',ReleaseStatus=N'released' WHERE CaseId=N'case-001' AND ContentVersion=3;
END;
GO
-- END COMPATIBLE CASE 001 COMPLETE CONTENT
-- END STUDENT CASE EXTENSION INSTALL

-- END STUDENT RUNTIME INSTALL
