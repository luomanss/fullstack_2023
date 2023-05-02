import express from "express";
import User from "../models/user.js";
import Blog from "../models/blog.js";

const testingRouter = express.Router();

testingRouter.post("/reset", async (request, response) => {
  await User.deleteMany({});
  await Blog.deleteMany({});

  response.status(204).end();
});

export default testingRouter;