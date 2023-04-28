import express from "express";
import blogs from "./routes/blogs.js";
import { errorHandler } from "./utils/middleware.js";

const app = express();

app.use(express.json());
app.use("/api/blogs", blogs);
app.use(errorHandler);

export default app;