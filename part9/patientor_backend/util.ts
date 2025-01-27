import z from "zod";
import { EntryType, Gender, HealthCheckRating } from "./types";

export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

export const newPatientSchema = z.object({
  name: z.string().nonempty(),
  dateOfBirth: z.string().nonempty().date(),
  ssn: z
    .string()
    .nonempty()
    .regex(/^\d{6}[-+A]\d{3}[0-9A-Z]$/, "Invalid Finnish SSN format"),
  gender: z.nativeEnum(Gender),
  occupation: z.string().nonempty(),
});

export const newEntrySchema = z.object({
  description: z.string().nonempty(),
  date: z.string().nonempty().date(),
  specialist: z.string().nonempty(),
  diagnosisCodes: z.array(z.string()),
  type: z.nativeEnum(EntryType),
});

export const newHealthCheckEntrySchema = newEntrySchema.extend({
  type: z.literal(EntryType.HealthCheck),
  healthCheckRating: z.nativeEnum(HealthCheckRating),
});

export const newOccupationalHealthcareEntrySchema = newEntrySchema.extend({
  type: z.literal(EntryType.OccupationalHealthcare),
  employerName: z.string().nonempty(),
  sickLeave: z.object({
    startDate: z.string().nonempty().date(),
    endDate: z.string().nonempty().date(),
  }),
});

export const newHospitalEntrySchema = newEntrySchema.extend({
  type: z.literal(EntryType.Hospital),
  discharge: z.object({
    date: z.string().nonempty().date(),
    criteria: z.string().nonempty(),
  }),
});
