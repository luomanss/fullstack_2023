import { v4 as uuid } from "uuid";
import {
  NonSensitivePatientEntry,
  NewPatient,
  Patient,
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

const getPatient = (id: string): Patient | undefined => {
  return patients.find((patient) => patient.id === id);
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...patient,
    entries: [],
  };

  patients.push(newPatient);

  return newPatient;
};

export default {
  getNonsesitivePatientEntries,
  getPatient,
  addPatient,
};
