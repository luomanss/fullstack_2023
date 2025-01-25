import z from "zod";
import { Gender } from "./types";

export const newPatientSchema = z.object({
    name: z.string().nonempty(),
    dateOfBirth: z.string().nonempty().date(),
    ssn: z.string().nonempty().regex(/^\d{6}[-+A]\d{3}[0-9A-Z]$/, "Invalid Finnish SSN format"),
    gender: z.nativeEnum(Gender),
    occupation: z.string().nonempty()
});
