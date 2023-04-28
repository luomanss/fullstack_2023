import * as dotenv from "dotenv";
import log from "./logger.js";

dotenv.config();

if (!process.env.MONGODB_URI) {
  log.error(
    "No mongo connection string. Set MONGODB_URI environment variable."
  );
  process.exit(1);
}

export const PORT = process.env.PORT || 3001;
export const MONGODB_URI = process.env.MONGODB_URI;
