IF OBJECT_ID(N'dbo.CaseAnswerKey', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.CaseAnswerKey
    (
        [CaseId] NVARCHAR(50) NOT NULL,
        [AnswerRole] NVARCHAR(50) NOT NULL,
        [PersonID] INT NOT NULL,
        [RevealOrder] INT NOT NULL,
        [SuccessVerdict] NVARCHAR(500) NOT NULL,
        CONSTRAINT PK_CaseAnswerKey PRIMARY KEY ([CaseId], [AnswerRole]),
        CONSTRAINT UQ_CaseAnswerKey_RevealOrder UNIQUE ([CaseId], [RevealOrder]),
        CONSTRAINT UQ_CaseAnswerKey_PersonID UNIQUE ([CaseId], [PersonID])
    );
END;
