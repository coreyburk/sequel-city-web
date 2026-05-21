IF DATABASE_PRINCIPAL_ID(N'solution_verifier') IS NULL
BEGIN
    CREATE USER [solution_verifier] WITHOUT LOGIN;
END;

GRANT INSERT, SELECT ON [dbo].[Solution] TO [solution_verifier];
GRANT SELECT ON [dbo].[CaseAnswerKey] TO [solution_verifier];
GRANT SELECT ON [dbo].[PersonsOfInterest] TO [solution_verifier];
