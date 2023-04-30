import * as dotenv from "dotenv";
import log from "./logger.js";

dotenv.config();

const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

if (!MONGODB_URI) {
  log.error(
    `No mongo connection string. Set ${
      process.env.NODE_ENV === "test" ? "TEST_" : ""
    }MONGODB_URI environment variable.`
  );

  process.exit(1);
}

const SECRET = process.env.SECRET;

if (!SECRET) {
  log.error(
    `No token secret. Set SECRET environment variable.`
  );

  process.exit(1);
}

export const PORT = process.env.PORT || 3001;
export { MONGODB_URI, SECRET };
