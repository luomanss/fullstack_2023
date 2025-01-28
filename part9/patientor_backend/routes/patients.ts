import express, { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import patientService from "../services/patientService";
import { codes } from "../data/diagnoses";
import { Entry, EntryType, NewEntry, NewPatient } from "../types";
import { newPatientSchema, newEntrySchema, assertNever, newHealthCheckEntrySchema, newOccupationalHealthcareEntrySchema, newHospitalEntrySchema } from "../util";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json(patientService.getNonsesitivePatientEntries());
});

router.get("/:id", (req, res) => {
  const patient = patientService.getPatient(req.params.id);

  if (patient) {
    res.json(patient);
  } else {
    res.status(404).end();
  }
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    newPatientSchema.parse(req.body);
    next();
  } catch (e) {
    next(e);
  }
};

router.post(
  "/",
  newPatientParser,
  (req: Request<unknown, unknown, NewPatient>, res: Response) => {
    const newPatient = patientService.addPatient(req.body);

    res.json(newPatient);
  }
);

const newEntryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const base = newEntrySchema.parse(req.body);

    if (base.diagnosisCodes.some((code) => !codes.has(code))) {
      throw new z.ZodError([]);
    }

    switch (base.type) {
      case EntryType.HealthCheck:
        newHealthCheckEntrySchema.parse(req.body);
        break;
      case EntryType.OccupationalHealthcare:
        newOccupationalHealthcareEntrySchema.parse(req.body);
        break;
      case EntryType.Hospital:
        newHospitalEntrySchema.parse(req.body);
        break;
      default:
        assertNever(base.type);
    }

    next();
  } catch (e) {
    next(e);
  }
};

router.post("/:id/entries", newEntryParser, (req: Request<{ id: string }, unknown, NewEntry>, res) => {
  const patient = patientService.getPatient(req.params.id);

  if (!patient) {
    res.status(404).end();
    return;
  }

  const newEntry = { ...req.body, id: uuid() };

  patient.entries.push(newEntry as Entry);

  res.json(newEntry);
});

const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    const issue = error.issues[0].path[0] as string;

    res.status(400).json({ error: `Invalid ${issue}` });
  } else {
    next(error);
  }
};

router.use(errorMiddleware);

export default router;
