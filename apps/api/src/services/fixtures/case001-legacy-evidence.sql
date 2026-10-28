-- Test-only historical Case 001 fixture; never run against a classroom database.
IF DB_NAME() NOT LIKE 'SequelCityRuntimeTest[_]%'
 THROW 51000,'Legacy evidence fixture requires an owned disposable database.',1;
DELETE i FROM dbo.InterviewLog i JOIN dbo.CrimeSceneReport r ON r.ReportID=i.ReportID WHERE r.ReportDate=20230502 AND r.ReportCity='Sequel City';
UPDATE dbo.CrimeSceneReport SET ReportDescription=N'Public clocktower ceremony report: civic official collapsed after a toast during the bell sequence; medical response noted suspected poisoning and clockroom access records held for timeline review.' WHERE ReportDate=20230502 AND ReportCity='Sequel City';
GO
-------------------------------------------
---- Table: InterviewLog - Case 001 Clocktower Evidence Bundle 1  ----
-------------------------------------------

DECLARE @Case001ClocktowerReportID INT;

SELECT @Case001ClocktowerReportID = ReportID
FROM CrimeSceneReport
WHERE CrimeID = 1080
	AND ReportDate = 20230502
	AND ReportCity = 'Sequel City'
	AND ReportDescription LIKE '%Public clocktower ceremony report:%'
	AND ReportDescription LIKE '%suspected poisoning%'
	AND ReportDescription LIKE '%clockroom access records%';

IF @Case001ClocktowerReportID IS NOT NULL
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM InterviewLog
		WHERE PersonID = 62764
			AND ReportID = @Case001ClocktowerReportID
			AND LogTranscript LIKE '%crowd rail%'
			AND LogTranscript LIKE '%clockroom door stayed closed%'
	)
	BEGIN
		INSERT INTO InterviewLog (PersonID, ReportID, LogTranscript)
		VALUES (
			62764,
			@Case001ClocktowerReportID,
			'From the crowd rail, I thought the clockroom door stayed closed after the toast. The public sightlines made it look sealed until the bell sequence ended.'
		);
	END;

	IF NOT EXISTS (
		SELECT 1
		FROM InterviewLog
		WHERE PersonID = 27590
			AND ReportID = @Case001ClocktowerReportID
			AND LogTranscript LIKE '%access ledger%'
			AND LogTranscript LIKE '%after the toast began%'
	)
	BEGIN
		INSERT INTO InterviewLog (PersonID, ReportID, LogTranscript)
		VALUES (
			27590,
			@Case001ClocktowerReportID,
			'The access ledger shows one clockroom access mark after the toast began, before the bell sequence finished. The crowd would not have seen that side stair.'
		);
	END;

	IF NOT EXISTS (
		SELECT 1
		FROM InterviewLog
		WHERE PersonID = 50417
			AND ReportID = @Case001ClocktowerReportID
			AND LogTranscript LIKE '%PersonID entries%'
			AND LogTranscript LIKE '%clocktower access window%'
	)
	BEGIN
		INSERT INTO InterviewLog (PersonID, ReportID, LogTranscript)
		VALUES (
			50417,
			@Case001ClocktowerReportID,
			'Records staff flagged the PersonID entries tied to the clocktower access window. Match those records back to people before trusting the crowd account.'
		);
	END;
END;
GO
