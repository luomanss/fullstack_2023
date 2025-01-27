import express, { Request, Response, NextFunction } from "express";
import patientService from "../services/patientService";
import { NewPatient } from "../types";
import { newPatientSchema } from "../util";
import { z } from "zod";

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

const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).json({ error: error.issues });
  } else {
    next(error);
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

router.use(errorMiddleware);

export default router;
