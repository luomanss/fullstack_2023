import { z } from "zod";
import { newEntrySchema, newPatientSchema } from "./util";

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export type NewPatient = z.infer<typeof newPatientSchema>;

interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis["code"]>;
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3,
}

export enum EntryType {
  HealthCheck = "HealthCheck",
  OccupationalHealthcare = "OccupationalHealthcare",
  Hospital = "Hospital",
}

interface HealthCheckEntry extends BaseEntry {
  type: EntryType.HealthCheck;
  healthCheckRating: HealthCheckRating;
}

interface OccupationalHealthcareEntry extends BaseEntry {
  type: EntryType.OccupationalHealthcare;
  employerName: string;
  sickLeave?: {
    startDate: string;
    endDate: string;
  };
}

interface HospitalEntry extends BaseEntry {
  type: EntryType.Hospital;
  discharge: {
    date: string;
    criteria: string;
  };
}

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

// type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;

// type EntryWithoutId = UnionOmit<Entry, 'id'>;
export type NewEntry = z.infer<typeof newEntrySchema>;

export interface Patient extends NewPatient {
  id: string;
  entries: Entry[];
}

export type NonSensitivePatientEntry = Omit<Patient, "ssn" | "entries">;
