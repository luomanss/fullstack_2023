import express from "express";
import blogs from "./routes/blogs.js";
import users from "./routes/users.js";
import login from "./routes/login.js";
import {
  errorHandler,
  tokenExtractor,
  userExtractor,
} from "./utils/middleware.js";
import "express-async-errors";

const app = express();

app.use(express.json());
app.use(tokenExtractor);
app.use("/api/blogs", userExtractor, blogs);
app.use("/api/users", users);
app.use("/api/login", login);

if (process.env.NODE_ENV === "test") {
  const module = await import("./routes/testing.js");

  app.use("/api/testing", module.default);
}

app.use(errorHandler);

export default app;
