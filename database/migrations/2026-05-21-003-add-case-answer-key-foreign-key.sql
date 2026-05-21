IF NOT EXISTS (
    SELECT 1
    FROM sys.foreign_keys
    WHERE name = N'FK_CaseAnswerKey_PersonsOfInterest'
      AND parent_object_id = OBJECT_ID(N'dbo.CaseAnswerKey', N'U')
)
BEGIN
    ALTER TABLE dbo.CaseAnswerKey WITH NOCHECK
        ADD CONSTRAINT FK_CaseAnswerKey_PersonsOfInterest
        FOREIGN KEY (PersonID)
        REFERENCES dbo.PersonsOfInterest(PersonID);
END;
