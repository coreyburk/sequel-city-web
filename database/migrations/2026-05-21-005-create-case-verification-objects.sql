EXEC(N'
CREATE OR ALTER TRIGGER [dbo].[CheckSuspect]
ON [dbo].[Solution]
AFTER INSERT
AS
BEGIN
    DECLARE @suspect NVARCHAR(500),
        @caseId NVARCHAR(50),
        @suspectPersonId INT,
        @verdict NVARCHAR(500),
        @incorrect VARCHAR(100);

    SET NOCOUNT ON;
    SET @caseId = N''case-004'';
    SET @incorrect = N''Great guess, but that is not the right suspect. Try again!'';

    SELECT TOP (1) @suspect = Suspect
    FROM inserted;

    SELECT TOP (1) @suspectPersonId = poi.PersonID
    FROM dbo.PersonsOfInterest AS poi
    WHERE poi.PersonName = @suspect;

    SELECT TOP (1) @verdict = cak.SuccessVerdict
    FROM dbo.CaseAnswerKey AS cak
    WHERE cak.CaseId = @caseId
      AND cak.PersonID = @suspectPersonId;

    INSERT INTO dbo.Solution (Suspect, Verdict)
    VALUES (@suspect, COALESCE(@verdict, @incorrect));
END;
');

EXEC(N'
CREATE OR ALTER PROCEDURE [dbo].[VerifySuspectSubmission]
    @Suspect NVARCHAR(100)
WITH EXECUTE AS ''solution_verifier''
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @caseId NVARCHAR(50);
    SET @caseId = N''case-004'';

    INSERT INTO dbo.Solution (Suspect)
    VALUES (@Suspect);

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
    FROM dbo.Solution AS solutionResult
    OUTER APPLY (
        SELECT TOP (1) poi.PersonID
        FROM dbo.PersonsOfInterest AS poi
        WHERE poi.PersonName = @Suspect
    ) AS personLookup
    LEFT JOIN dbo.CaseAnswerKey AS answerKey
        ON answerKey.CaseId = @caseId
       AND answerKey.PersonID = personLookup.PersonID
    WHERE solutionResult.Suspect = @Suspect
      AND solutionResult.Verdict IS NOT NULL
    ORDER BY solutionResult.Attempt DESC;
END;
');

IF DATABASE_PRINCIPAL_ID(N'sequel_web_user') IS NOT NULL
BEGIN
    GRANT SELECT ON OBJECT::dbo.AppSchemaVersion TO [sequel_web_user];
    GRANT EXECUTE ON OBJECT::dbo.VerifySuspectSubmission TO [sequel_web_user];
END;
