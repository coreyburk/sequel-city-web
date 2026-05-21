MERGE dbo.CaseAnswerKey AS target
USING (
    VALUES
        (
            N'case-004',
            N'trigger_man',
            67318,
            1,
            N'Congrats, you found the murderer! But wait, there is more... 
			You found the Trigger Man, now find the Master Mind.
			Try querying the interview transcript of the murderer to find the real villain behind this crime. 
			Use this same INSERT statement with your new suspect to check your answer.'
        ),
        (
            N'case-004',
            N'mastermind',
            99716,
            2,
            N'Congrats, you found the Master Mind of this murder! 
			Everyone in SQL City hails you as the greatest SQL detective of all time. 
			Time to celebrate!'
        )
) AS source ([CaseId], [AnswerRole], [PersonID], [RevealOrder], [SuccessVerdict])
    ON target.CaseId = source.CaseId
   AND target.AnswerRole = source.AnswerRole
WHEN MATCHED THEN
    UPDATE SET
        target.PersonID = source.PersonID,
        target.RevealOrder = source.RevealOrder,
        target.SuccessVerdict = source.SuccessVerdict
WHEN NOT MATCHED THEN
    INSERT ([CaseId], [AnswerRole], [PersonID], [RevealOrder], [SuccessVerdict])
    VALUES (source.CaseId, source.AnswerRole, source.PersonID, source.RevealOrder, source.SuccessVerdict);
