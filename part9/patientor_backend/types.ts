import { z } from "zod";
import { newPatientSchema } from "./util";

export interface DiagnoseEntry {
    code: string;
    name: string;
    latin?: string;
}

export enum Gender {
    Male = "male",
    Female = "female",
    Other = "other"
}

export type NewPatientEntry = z.infer<typeof newPatientSchema>;

export interface PatientEntry extends NewPatientEntry {
    id: string;
}

export type NonSensitivePatientEntry = Omit<PatientEntry, 'ssn'>;
