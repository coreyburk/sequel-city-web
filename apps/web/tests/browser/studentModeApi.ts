import type { Page, Route } from "@playwright/test";

type Scalar = string | number | boolean | null;

type QueryRow = {
  values: Record<string, Scalar>;
  displayValues: Record<string, string>;
};

function buildRow(values: Record<string, Scalar>): QueryRow {
  return {
    values,
    displayValues: Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, value === null ? "" : String(value)])
    )
  };
}

function buildQuerySuccess(rows: QueryRow[]) {
  const columnNames = rows.length > 0 ? Object.keys(rows[0].displayValues) : [];

  return {
    success: true,
    data: {
      columns: columnNames.map((name, index) => ({
        name,
        ordinal: index,
        dataType: "string"
      })),
      rows,
      rowCount: rows.length
    },
    safety: {
      isAllowed: true,
      normalizedStatementType: "SELECT",
      violations: [],
      message: "Safe."
    },
    executionTimeMs: 1,
    message: "Executed."
  };
}

function normalizeSql(sql: string): string {
  return sql.toLowerCase().replace(/\s+/g, " ").trim();
}

const crimeTypeRows = [buildRow({ CrimeID: 1080, CrimeLabel: "Murder" })];

const crimeSceneReportRows = [
  buildRow({
    CrimeID: 1080,
    ReportID: 10975,
    ReportDate: "2023-01-15",
    ReportCity: "SQL City",
    ReportDescription: "Murder happened outside Symphony Hall."
  })
];

const witnessInterviewRows = [
  buildRow({
    LogID: 4559,
    PersonID: 14887,
    ReportID: 10975,
    LogTranscript: "There was a suspicious-looking red BMW parked outside the Symphony Hall."
  }),
  buildRow({
    LogID: 4925,
    PersonID: 14887,
    ReportID: 10975,
    LogTranscript: "I heard a gunshot and then saw a man run out."
  }),
  buildRow({
    LogID: 5148,
    PersonID: 14887,
    ReportID: 10975,
    LogTranscript: 'I caught part of the plate - it included "H42W" before the car tore off.'
  }),
  buildRow({
    LogID: 5108,
    PersonID: 14887,
    ReportID: 10975,
    LogTranscript:
      'He had a "Get Fit Now Gym" bag. The membership number on the bag started with "48Z". Only gold members have those bags.'
  }),
  buildRow({
    LogID: 4742,
    PersonID: 16371,
    ReportID: 10975,
    LogTranscript: "I saw the murder happen right outside Symphony Hall."
  }),
  buildRow({
    LogID: 4782,
    PersonID: 16371,
    ReportID: 10975,
    LogTranscript: "I recognized the killer from my gym when I was working out last week on January the 9th."
  })
];

const witnessNameRows = [
  buildRow({
    PersonID: 14887,
    PersonName: "Morty Schapiro",
    AddressStreetName: "Northwestern Dr"
  }),
  buildRow({
    PersonID: 16371,
    PersonName: "Annabel Miller",
    AddressStreetName: "Franklin Ave"
  })
];

const gymLeadRows = [
  buildRow({
    FitMemberID: "48Z7A",
    FitMembershipStatus: "gold",
    PersonID: 67318
  })
];

const suspectCandidateRows = [
  buildRow({
    PersonID: 67318,
    PersonName: "Jeremy Bowers",
    LicenseID: 423327
  })
];

const suspectInterviewRows = [
  buildRow({
    LogID: 8801,
    PersonID: 67318,
    ReportID: 10975,
    LogTranscript: "I delivered the hit after the contract came through."
  }),
  buildRow({
    LogID: 8802,
    PersonID: 67318,
    ReportID: 10975,
    LogTranscript: "The client wanted that scumbag taken out fast."
  })
];

const mastermindTranscriptRows = [
  buildRow({
    LogID: 9901,
    PersonID: 67318,
    ReportID: 10975,
    LogTranscript: "A high-roller dame with deep pockets put out a contract on him."
  }),
  buildRow({
    LogID: 9902,
    PersonID: 67318,
    ReportID: 10975,
    LogTranscript: "I met up with her three times last December."
  }),
  buildRow({
    LogID: 9903,
    PersonID: 67318,
    ReportID: 10975,
    LogTranscript: "Every meeting was right next to Symphony Hall."
  }),
  buildRow({
    LogID: 9904,
    PersonID: 67318,
    ReportID: 10975,
    LogTranscript: "She clicked around in designer stilettos."
  }),
  buildRow({
    LogID: 9905,
    PersonID: 67318,
    ReportID: 10975,
    LogTranscript: "Redheaded broad, serious ice on her fingers, impossible to miss."
  }),
  buildRow({
    LogID: 9906,
    PersonID: 67318,
    ReportID: 10975,
    LogTranscript: "She pulled up in a BMW M8 and looked about 5'5\" to 5'8\"."
  })
];

const driversLicenseRows = [
  buildRow({
    LicenseID: 202298,
    Age: 21,
    Height: 66,
    EyeColor: "blue",
    HairColor: "red",
    Gender: "female",
    PlateNumber: "500123",
    CarMake: "BMW",
    CarModel: "M8"
  }),
  buildRow({
    LicenseID: 857212,
    Age: 31,
    Height: 67,
    EyeColor: "brown",
    HairColor: "red",
    Gender: "female",
    PlateNumber: "VFZXF6",
    CarMake: "BMW",
    CarModel: "M8"
  })
];

const mastermindIdentityRows = [
  buildRow({
    PersonID: 99716,
    PersonName: "Miranda Priestly",
    LicenseID: 202298,
    AddressStreetName: "Golden Ave",
    SSN: 987756388
  }),
  buildRow({
    PersonID: 14307,
    PersonName: "Dani Rawley",
    LicenseID: 857212,
    AddressStreetName: "Twentyeighth Ave",
    SSN: 362878596
  })
];

const suspectInterviewTrailRows = [...suspectInterviewRows, ...mastermindTranscriptRows];

const eventRegistrationRows = [
  buildRow({
    RegistrationID: 16502,
    EventID: 2669,
    EventPersonID: 14307
  }),
  buildRow({
    RegistrationID: 15383,
    EventID: 2669,
    EventPersonID: 99716
  }),
  buildRow({
    RegistrationID: 17606,
    EventID: 3005,
    EventPersonID: 14307
  }),
  buildRow({
    RegistrationID: 17607,
    EventID: 3005,
    EventPersonID: 99716
  }),
  buildRow({
    RegistrationID: 17608,
    EventID: 3257,
    EventPersonID: 14307
  }),
  buildRow({
    RegistrationID: 17609,
    EventID: 3257,
    EventPersonID: 99716
  })
];

const employmentRows = [
  buildRow({
    SSN: 987756388,
    JobTitle: "Urban Policy Advisor",
    CompanyName: "Sub Rosa Strategies",
    Salary: 310000
  }),
  buildRow({
    SSN: 362878596,
    JobTitle: "Tattoo Artist",
    CompanyName: "Urban Mystique Holdings",
    Salary: 36000
  })
];

const eventScheduleRows = [
  buildRow({
    EventID: 2669,
    EventDate: "2022-12-15",
    EventName: "Neon Nights Symphony Delights"
  }),
  buildRow({
    EventID: 3005,
    EventDate: "2022-12-09",
    EventName: "Skyline Symphony Showcase"
  }),
  buildRow({
    EventID: 3257,
    EventDate: "2022-12-19",
    EventName: "Winter Wonderland Symphony"
  })
];

const decemberEventScheduleRows = [
  ...eventScheduleRows,
  buildRow({
    EventID: 2214,
    EventDate: "2022-12-02",
    EventName: "Moonlight Fashion Gala"
  }),
  buildRow({
    EventID: 2388,
    EventDate: "2022-12-04",
    EventName: "Downtown Art Preview"
  }),
  buildRow({
    EventID: 2471,
    EventDate: "2022-12-07",
    EventName: "Velvet Room Charity Dinner"
  }),
  buildRow({
    EventID: 2816,
    EventDate: "2022-12-12",
    EventName: "City Lights Winter Market"
  }),
  buildRow({
    EventID: 3062,
    EventDate: "2022-12-18",
    EventName: "Founders Club Holiday Auction"
  }),
  buildRow({
    EventID: 3348,
    EventDate: "2022-12-23",
    EventName: "Midtown Masquerade"
  }),
  buildRow({
    EventID: 3499,
    EventDate: "2022-12-28",
    EventName: "Harbor Lights Reception"
  })
];

const queryMap = new Map<string, ReturnType<typeof buildQuerySuccess>>([
  ["select * from crimetype", buildQuerySuccess(crimeTypeRows)],
  ["select * from crimescenereport where crimeid = 1080 and reportcity = 'sql city'", buildQuerySuccess(crimeSceneReportRows)],
  ["select * from interviewlog where reportid = 10975 order by personid", buildQuerySuccess(witnessInterviewRows)],
  ["select * from personsofinterest where personid = 14887 or personid = 16371", buildQuerySuccess(witnessNameRows)],
  ["select * from fitnflabclub where fitmembershipstatus = 'gold' and fitmemberid like '48z%'", buildQuerySuccess(gymLeadRows)],
  ["select * from personsofinterest where personid = 67318", buildQuerySuccess(suspectCandidateRows)],
  ["select * from interviewlog where personid = 67318", buildQuerySuccess(suspectInterviewTrailRows)],
  ["select * from interviewlog where personid = 67318 and reportid = 10975", buildQuerySuccess(suspectInterviewTrailRows)],
  ["select * from driverslicense where carmake = 'bmw' and carmodel = 'm8' and gender = 'female' and haircolor = 'red' and height between 65 and 67", buildQuerySuccess(driversLicenseRows)],
  ["select * from personsofinterest where licenseid = 202298 or licenseid = 857212", buildQuerySuccess(mastermindIdentityRows)],
  ["select * from eventschedule where eventdate like '2022-12%'", buildQuerySuccess(decemberEventScheduleRows)],
  ["select * from eventschedule where eventdate like '2022-12%' and eventname like '%symphony%'", buildQuerySuccess(eventScheduleRows)],
  ["select * from eventregistration where eventid in (2669, 3005, 3257) and eventpersonid in (14307, 99716) order by eventid, eventpersonid", buildQuerySuccess(eventRegistrationRows)],
  ["select * from eventregistration where eventid = 2669 and (eventpersonid = 14307 or eventpersonid = 99716) order by eventpersonid", buildQuerySuccess(eventRegistrationRows.filter((row) => String(row.values.EventID) === "2669"))],
  ["select * from employment where ssn = 987756388 or ssn = 362878596", buildQuerySuccess(employmentRows)],
  ["select * from employment where ssn = 362878596 or ssn = 987756388", buildQuerySuccess(employmentRows)],
  ["select * from eventschedule where eventid = 2669 and eventdate like '2022-12%' and eventname like '%symphony%'", buildQuerySuccess(eventScheduleRows.filter((row) => String(row.values.EventID) === "2669"))]
]);

async function fulfillJson(route: Route, body: unknown): Promise<void> {
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify(body)
  });
}

export async function installStudentModeApiMocks(page: Page): Promise<void> {
  await page.route("http://127.0.0.1:3001/api/health/full", async (route) => {
    await fulfillJson(route, {
      success: true,
      data: {
        api: "ok",
        database: {
          status: "ok",
          isConnected: true,
          databaseName: "SequelCity",
          serverName: "Localhost",
          message: "Connected."
        },
        bootstrap: {
          mode: "verify",
          status: "ready",
          migrated: true,
          usedBootstrapCredentials: false,
          canApplyInApp: false,
          applyActionMessage: null,
          message: "Ready.",
          hasSchemaVersionTable: true,
          expectedMigrationKey: "2026-05-sequel-city",
          currentMigrationKey: "2026-05-sequel-city",
          pendingMigrationKeys: []
        },
        schema: {
          status: "ok",
          tableCount: 7,
          relationshipCount: 3,
          message: "Loaded."
        }
      }
    });
  });

  await page.route("http://127.0.0.1:3001/api/schema/tables", async (route) => {
    await fulfillJson(route, {
      success: true,
      data: {
        tables: [
          {
            schemaName: "dbo",
            tableName: "CrimeType",
            fullName: "CrimeType",
            columns: [{ columnName: "CrimeID", ordinal: 1, dataType: "int", isNullable: false, maxLength: null, numericPrecision: 10, numericScale: 0, isPrimaryKey: true, isForeignKey: false }],
            primaryKey: { name: "PK_CrimeType", columns: ["CrimeID"] }
          },
          {
            schemaName: "dbo",
            tableName: "CrimeSceneReport",
            fullName: "CrimeSceneReport",
            columns: [{ columnName: "ReportID", ordinal: 1, dataType: "int", isNullable: false, maxLength: null, numericPrecision: 10, numericScale: 0, isPrimaryKey: true, isForeignKey: false }],
            primaryKey: { name: "PK_CrimeSceneReport", columns: ["ReportID"] }
          },
          {
            schemaName: "dbo",
            tableName: "InterviewLog",
            fullName: "InterviewLog",
            columns: [{ columnName: "LogID", ordinal: 1, dataType: "int", isNullable: false, maxLength: null, numericPrecision: 10, numericScale: 0, isPrimaryKey: true, isForeignKey: false }],
            primaryKey: { name: "PK_InterviewLog", columns: ["LogID"] }
          },
          {
            schemaName: "dbo",
            tableName: "PersonsOfInterest",
            fullName: "PersonsOfInterest",
            columns: [{ columnName: "PersonID", ordinal: 1, dataType: "int", isNullable: false, maxLength: null, numericPrecision: 10, numericScale: 0, isPrimaryKey: true, isForeignKey: false }],
            primaryKey: { name: "PK_PersonsOfInterest", columns: ["PersonID"] }
          },
          {
            schemaName: "dbo",
            tableName: "FitNFlabClub",
            fullName: "FitNFlabClub",
            columns: [{ columnName: "FitMemberID", ordinal: 1, dataType: "varchar", isNullable: false, maxLength: 20, numericPrecision: null, numericScale: null, isPrimaryKey: true, isForeignKey: false }],
            primaryKey: { name: "PK_FitNFlabClub", columns: ["FitMemberID"] }
          },
          {
            schemaName: "dbo",
            tableName: "DriversLicense",
            fullName: "DriversLicense",
            columns: [{ columnName: "LicenseID", ordinal: 1, dataType: "int", isNullable: false, maxLength: null, numericPrecision: 10, numericScale: 0, isPrimaryKey: true, isForeignKey: false }],
            primaryKey: { name: "PK_DriversLicense", columns: ["LicenseID"] }
          },
          {
            schemaName: "dbo",
            tableName: "EventRegistration",
            fullName: "EventRegistration",
            columns: [{ columnName: "RegistrationID", ordinal: 1, dataType: "int", isNullable: false, maxLength: null, numericPrecision: 10, numericScale: 0, isPrimaryKey: true, isForeignKey: false }],
            primaryKey: { name: "PK_EventRegistration", columns: ["RegistrationID"] }
          },
          {
            schemaName: "dbo",
            tableName: "EventSchedule",
            fullName: "EventSchedule",
            columns: [{ columnName: "EventID", ordinal: 1, dataType: "int", isNullable: false, maxLength: null, numericPrecision: 10, numericScale: 0, isPrimaryKey: true, isForeignKey: false }],
            primaryKey: { name: "PK_EventSchedule", columns: ["EventID"] }
          }
        ],
        relationships: []
      }
    });
  });

  await page.route("http://127.0.0.1:3001/api/query/execute", async (route) => {
    const body = route.request().postDataJSON() as { sql?: string };
    const normalizedSql = normalizeSql(body.sql ?? "");
    const response = queryMap.get(normalizedSql);

    if (!response) {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({
          success: false,
          safety: {
            isAllowed: true,
            normalizedStatementType: "SELECT",
            violations: [],
            message: "Safe."
          },
          executionTimeMs: 1,
          message: `No browser-test fixture exists for query: ${body.sql ?? ""}`
        })
      });
      return;
    }

    await fulfillJson(route, response);
  });

  await page.route("http://127.0.0.1:3001/api/case/verify-suspect", async (route) => {
    const body = route.request().postDataJSON() as { suspect?: string };
    const suspect = body.suspect?.trim() ?? "";
    const name = suspect.toLowerCase();
    const isTrigger = name === "jeremy bowers";
    const isMastermind = name === "miranda priestly";

    await fulfillJson(route, {
      success: true,
      data: {
        suspect,
        verdict: isTrigger
          ? "Jeremy Bowers is the hired killer."
          : isMastermind
          ? "Miranda Priestly is the mastermind."
          : "That suspect does not hold up.",
        caseId: "case-004",
        isCorrect: isTrigger || isMastermind,
        solvedRole: isTrigger ? "trigger_man" : isMastermind ? "mastermind" : null,
        nextRole: isTrigger ? "mastermind" : null,
        suspectPersonId: isTrigger ? 67318 : null
      },
      message: isTrigger || isMastermind ? "Theory confirmed." : "Theory rejected."
    });
  });
}
