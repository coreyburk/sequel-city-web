import type { ProvenFact } from "../types/caseRuntime.ts";
import type { QueryRow } from "../types/query.ts";

export const CASE001_FULL_EVIDENCE = "case001-complete-v5";
export const CASE001_FINAL_REPORT = "Clocktower ceremony, May 2: the mayor collapsed after the noon toast. Toxicology found poison in his red-ribbon glass. The shared jug and the other served drinks tested clear. A statement was taken from the serving steward.";
export const CASE001_WITNESS = "I was serving from the big jug. Les Eskridge asked me to leave the mayor's glass in its paper sleeve; he would do that drink himself. I know Les from last year's ceremony. He unwrapped it and poured at the side table while I served the crowd. He kept the red-ribbon glass with him, then handed it straight to the mayor for the toast. The other drinks came straight from my tray. I remember being annoyed that he wouldn't just take one of those.";
export const CASE001_SUSPECT = "Yes, I made the mayor's drink. He never liked the ceremony punch, so I used a drink mix for his. I kept the mix in my coat until I prepared his glass at the side table. I didn't use it for anyone else. Once I'd handed him the glass, I went back to the bell ropes. What happened after the toast wasn't anything to do with me.";
export const CASE001_FULL_HANDLERS = {
 "case001.murder-type": { mode: "log", table: "CrimeType", key: "CrimeID" },
 "case001.final-report": { mode: "query", table: "CrimeSceneReport", key: "ReportID" },
 "case001.witness-account": { mode: "query", table: "InterviewLog", key: "LogID" },
 "case001.suspect-identity": { mode: "query", table: "PersonsOfInterest", key: "PersonID" },
 "case001.suspect-account": { mode: "query", table: "InterviewLog", key: "LogID" },
 "case001.culprit-verification": { mode: "verify", table: "InterviewLog", key: "LogID" }
} as const;
export function fullCase001Field(row: QueryRow | undefined, name: string): string {
 return String(Object.entries(row?.values ?? {}).find(([key]) => key.toLowerCase() === name.toLowerCase())?.[1] ?? "");
}
export function evaluateFullCase001(key: string, rows: QueryRow[], previous: ProvenFact[], actionId: string): { matched: boolean; facts: ProvenFact[] } {
 const f=fullCase001Field, row=rows[0];
 const fact=(key:string,value:string):ProvenFact=>({key,label:key,value,sourceActionId:actionId});
 const earned=(key:string)=>previous.find(x=>x.key===key)?.value;
 if (key === "case001.murder-type") {
  const matched=rows.length===1 && f(row,"CrimeID")==="1080" && f(row,"CrimeType")==="Murder";
  return {matched,facts:matched?[fact("CrimeID","1080")]:[]};
 }
 if (key === "case001.final-report") {
  const matched=earned("CrimeID")==="1080" && rows.length===1 && !!f(row,"ReportID") && f(row,"ReportDate")==="20230502" && f(row,"ReportCity")==="Sequel City" && f(row,"CrimeID")===earned("CrimeID") && f(row,"ReportDescription")===CASE001_FINAL_REPORT;
  return {matched,facts:matched?[fact("ReportID",f(row,"ReportID"))]:[]};
 }
 if (key === "case001.witness-account") {
  const matched=rows.length===1 && !!earned("ReportID") && f(row,"ReportID")===earned("ReportID") && f(row,"PersonID")==="62764" && !!f(row,"LogID") && f(row,"LogTranscript")===CASE001_WITNESS;
  return {matched,facts:matched?[fact("PersonName:suspect","Les Eskridge")]:[]};
 }
 if (key === "case001.suspect-identity") {
  const matched=rows.length===1 && earned("PersonName:suspect")==="Les Eskridge" && f(row,"PersonName")===earned("PersonName:suspect") && f(row,"PersonID")==="27412";
  return {matched,facts:matched?[fact("PersonID:suspect",f(row,"PersonID"))]:[]};
 }
 if (key === "case001.suspect-account") {
  const matched=rows.length===1 && earned("PersonID:suspect")==="27412" && f(row,"PersonID")===earned("PersonID:suspect") && f(row,"ReportID")===earned("ReportID") && !!f(row,"LogID") && f(row,"LogTranscript")===CASE001_SUSPECT;
  return {matched,facts:matched?[fact("Statement:suspect","Les describes using his own drink mix only for the mayor's drink.")]:[]};
 }
 return {matched:false,facts:[]};
}
