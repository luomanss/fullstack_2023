import { v4 as uuid } from "uuid";
import {
  NonSensitivePatientEntry,
  NewPatientEntry,
  PatientEntry,
} from "../types";
import patients from "../data/patients";

const getNonsesitivePatientEntries = (): NonSensitivePatientEntry[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (patient: NewPatientEntry): PatientEntry => {
  const newPatient = {
    id: uuid(),
    ...patient,
  };

  patients.push(newPatient);

  return newPatient;
};

export default {
  getNonsesitivePatientEntries,
  addPatient,
};
