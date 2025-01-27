import { diagnoses, codes } from "../data/diagnoses";

export const getDiagnoses = () => {
  return diagnoses;
};

export const getCodes = () => {
  return codes;
};

export default {
  getDiagnoses,
  getCodes,
};