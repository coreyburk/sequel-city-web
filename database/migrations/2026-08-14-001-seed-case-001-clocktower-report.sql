IF NOT EXISTS (
  SELECT 1
  FROM dbo.CrimeSceneReport
  WHERE CrimeID = 1080
    AND ReportDate = 20230502
    AND ReportCity = 'Sequel City'
    AND ReportDescription = 'Public clocktower ceremony report: civic official collapsed after a toast during the bell sequence; medical response noted suspected poisoning and clockroom access records held for timeline review.'
)
BEGIN
  INSERT INTO dbo.CrimeSceneReport
    (ReportDate, CrimeID, ReportDescription, ReportCity)
  VALUES
    (
      20230502,
      1080,
      'Public clocktower ceremony report: civic official collapsed after a toast during the bell sequence; medical response noted suspected poisoning and clockroom access records held for timeline review.',
      'Sequel City'
    );
END;
